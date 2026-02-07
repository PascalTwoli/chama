import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import LoadingSpinner from '../LoadingSpinner';

interface DashboardGuardProps {
  children: ReactNode;
  requiredRole: 'ADMIN' | 'MEMBER';
}

/**
 * DashboardGuard - Protects dashboard routes
 * Ensures user is authenticated, has active chama, and has correct role
 */
const DashboardGuard: React.FC<DashboardGuardProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, chamas, activeChama, isLoading } =
    useChamaMembership();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to='/auth/signin' replace />;
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
