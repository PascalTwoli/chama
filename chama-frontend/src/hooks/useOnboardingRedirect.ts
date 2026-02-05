import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChamaMembership } from '../context/ChamaMembershipContext';

interface OnboardingRedirectResult {
  isLoading: boolean;
  shouldRedirect: boolean;
  redirectPath: string | null;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/signin',
  '/signup',
];

// Onboarding routes for users without chamas
const ONBOARDING_ROUTES = [
  '/onboarding/chama-choice',
  '/onboarding/create-chama',
];

/**
 * Central resolver hook for post-auth routing
 * Runs after login, on app load, and on refresh
 *
 * Logic:
 * - If not authenticated: allow public routes only
 * - If authenticated && no chamas: redirect to /onboarding/chama-choice
 * - If authenticated && has chamas:
 *   - If ADMIN: redirect to /admin/dashboard
 *   - If MEMBER: redirect to /member/dashboard
 */
export const useOnboardingRedirect = (): OnboardingRedirectResult => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, chamas, activeChama, isLoading } =
    useChamaMembership();

  const getRedirectPath = useCallback((): string | null => {
    const currentPath = location.pathname;

    // If still loading, don't redirect yet
    if (isLoading) {
      return null;
    }

    // If not authenticated
    if (!isAuthenticated) {
      // Allow public routes
      if (PUBLIC_ROUTES.includes(currentPath)) {
        return null;
      }
      // Redirect to signin for protected routes
      return '/auth/signin';
    }

    // User is authenticated
    const approvedChamas = chamas.filter(c => c.status === 'APPROVED');

    // If user has no approved chamas
    if (approvedChamas.length === 0) {
      // Allow onboarding routes
      if (ONBOARDING_ROUTES.includes(currentPath)) {
        return null;
      }
      // Redirect to chama choice
      return '/onboarding/chama-choice';
    }

    // User has approved chamas
    if (activeChama) {
      // If on onboarding routes, redirect to dashboard
      if (
        ONBOARDING_ROUTES.includes(currentPath) ||
        PUBLIC_ROUTES.includes(currentPath)
      ) {
        if (activeChama.role === 'ADMIN') {
          return `/admin/chamas/${activeChama.chamaId}`;
        }
        return `/member/chamas/${activeChama.chamaId}`;
      }

      // Check if on correct dashboard for role
      if (activeChama.role === 'ADMIN' && currentPath.startsWith('/member/')) {
        return `/admin/chamas/${activeChama.chamaId}`;
      }
      if (activeChama.role === 'MEMBER' && currentPath.startsWith('/admin/')) {
        return `/member/chamas/${activeChama.chamaId}`;
      }
    }

    return null;
  }, [isAuthenticated, chamas, activeChama, isLoading, location.pathname]);

  const redirectPath = getRedirectPath();
  const shouldRedirect = redirectPath !== null;

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [shouldRedirect, redirectPath, navigate]);

  return {
    isLoading,
    shouldRedirect,
    redirectPath,
  };
};

/**
 * Get the appropriate dashboard path based on active chama role
 */
export const getDashboardPath = (
  activeChama: { chamaId: string; role: 'ADMIN' | 'MEMBER' } | null
): string => {
  if (!activeChama) {
    return '/onboarding/chama-choice';
  }

  if (activeChama.role === 'ADMIN') {
    return `/admin/chamas/${activeChama.chamaId}`;
  }

  return `/member/chamas/${activeChama.chamaId}`;
};

export default useOnboardingRedirect;
