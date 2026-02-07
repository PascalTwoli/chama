import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import { getDashboardPath } from '../../hooks/useOnboardingRedirect';
import LoadingSpinner from '../LoadingSpinner';

interface OnboardingGuardProps {
  children: ReactNode;
}

/**
 * OnboardingGuard - Protects onboarding routes
 * Ensures user is authenticated but has no approved chamas
 * If user has chamas, redirects to appropriate dashboard
 */
const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isAuthenticated, chamas, activeChama, isLoading } =
    useChamaMembership();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to='/auth/signin' replace />;
  }

  // If user has approved chamas, redirect to dashboard
  const approvedChamas = chamas.filter(c => c.status === 'APPROVED');
  if (approvedChamas.length > 0) {
    const redirectPath = getDashboardPath(activeChama);
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated with no chamas - allow access to onboarding
  return <>{children}</>;
};

export default OnboardingGuard;
