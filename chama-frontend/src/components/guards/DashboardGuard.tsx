import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import ChamaService from '../../services/chama/chama-services';
import LoadingSpinner from '../LoadingSpinner';

interface DashboardGuardProps {
  children: ReactNode;
  requiredRole: 'ADMIN' | 'MEMBER';
}

interface ChamaValidation {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * DashboardGuard - Protects dashboard routes
 * Ensures:
 * 1. User is authenticated
 * 2. User has approved chamas
 * 3. User has correct role for the route
 * 4. The chama ID in the URL exists and is accessible
 */
const DashboardGuard: React.FC<DashboardGuardProps> = ({
  children,
  requiredRole,
}) => {
  const { chamaId } = useParams<{ chamaId: string }>();
  const { isAuthenticated, chamas, activeChama, isLoading: membershipLoading } =
    useChamaMembership();

  const [chamaValidation, setChamaValidation] = useState<ChamaValidation>({
    isValid: false,
    isLoading: true,
    error: null,
  });

  // Validate that the chama exists in the backend
  useEffect(() => {
    const validateChama = async () => {
      if (!chamaId) {
        setChamaValidation({
          isValid: false,
          isLoading: false,
          error: 'No chama ID provided',
        });
        return;
      }

      // Skip validation if not authenticated yet
      if (!isAuthenticated) {
        setChamaValidation({
          isValid: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        setChamaValidation(prev => ({ ...prev, isLoading: true }));

        // Fetch chama details to validate it exists
        const chamaData = await ChamaService.getChamaById(chamaId);

        if (chamaData && chamaData.id) {
          setChamaValidation({
            isValid: true,
            isLoading: false,
            error: null,
          });
        } else {
          setChamaValidation({
            isValid: false,
            isLoading: false,
            error: 'Chama not found',
          });
        }
      } catch (error) {
        console.error('Error validating chama:', error);
        setChamaValidation({
          isValid: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to validate chama',
        });
      }
    };

    validateChama();
  }, [chamaId, isAuthenticated]);

  // Show loading while checking membership or validating chama
  if (membershipLoading || chamaValidation.isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to='/auth/signin' replace />;
  }

  // If chama validation failed, redirect to chama choice
  if (!chamaValidation.isValid) {
    console.warn('Chama validation failed:', chamaValidation.error);
    return <Navigate to='/onboarding/chama-choice' replace />;
  }

  // If user has no approved chamas, redirect to chama choice
  const approvedChamas = chamas.filter(c => c.status === 'APPROVED');
  if (approvedChamas.length === 0) {
    return <Navigate to='/onboarding/chama-choice' replace />;
  }

  // If no active chama set, redirect to chama choice
  if (!activeChama) {
    return <Navigate to='/onboarding/chama-choice' replace />;
  }

  // If role doesn't match, redirect to correct dashboard
  if (activeChama.role !== requiredRole) {
    if (activeChama.role === 'ADMIN') {
      return <Navigate to={`/admin/chamas/${activeChama.chamaId}`} replace />;
    }
    return <Navigate to={`/member/chamas/${activeChama.chamaId}`} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default DashboardGuard;
