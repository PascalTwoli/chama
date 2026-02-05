import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import LoadingSpinner from '../LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to signin if not authenticated
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useChamaMembership();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to signin, saving the attempted location
    return <Navigate to='/auth/signin' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
