import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  ChamaMembership,
  User,
  SystemRole,
  GovernanceRole,
  computePermissions,
} from '../models/user';
import ChamaService from '../services/chama/chama-services';
import AuthService from '../services/auth/signup-service';
import SecureTokenStorage from '../utils/secure-token-storage';

// ==================== DASHBOARD CONTEXT UTILITIES ====================

/**
 * Get the last dashboard context the user was in
 */
export const getLastDashboardContext = (): 'admin' | 'member' => {
  return (
    (localStorage.getItem('lastDashboardContext') as 'admin' | 'member') ||
    'admin'
  );
};

/**
 * Set the last dashboard context
 */
export const setLastDashboardContext = (context: 'admin' | 'member'): void => {
  localStorage.setItem('lastDashboardContext', context);
};

// ==================== CONTEXT TYPES ====================

interface ChamaMembershipContextType {
  user: User | null;
  chamas: ChamaMembership[];
  activeChama: ChamaMembership | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setActiveChama: (chama: ChamaMembership) => void;
  refreshMemberships: () => Promise<void>;
  clearMemberships: () => void;
  // New: Check if user has admin dashboard access
  hasAdminAccess: boolean;
  // New: Current dashboard context
  dashboardContext: 'admin' | 'member';
  setDashboardContext: (context: 'admin' | 'member') => void;
}

const ChamaMembershipContext = createContext<
  ChamaMembershipContextType | undefined
>(undefined);

interface ChamaMembershipProviderProps {
  children: ReactNode;
}

// ==================== ROLE DETECTION HELPERS ====================

/**
 * Determine system role from API response
 */
function determineSystemRole(
  chama: {
    role?: string;
    organizationRole?: string;
    userType?: string;
    createdBy?: string;
    isOwner?: boolean;
  },
  currentUserId: string | undefined,
  hasCreatedChama: boolean,
  activeChamaIdFromStorage: string | null,
  chamaId: string
): SystemRole {
  const roleUpperCase = chama.role?.toUpperCase();
  const userTypeUpperCase = chama.userType?.toUpperCase();

  // Check if user is OWNER
  const isOwner =
    chama.isOwner === true ||
    roleUpperCase === 'OWNER' ||
    userTypeUpperCase === 'OWNER' ||
    chama.createdBy === currentUserId ||
    (hasCreatedChama && chamaId === activeChamaIdFromStorage);

  if (isOwner) {
    return 'OWNER';
  }

  // Check if user is ADMIN
  const orgRoleUpperCase = chama.organizationRole?.toUpperCase();
  const isAdmin =
    roleUpperCase === 'ADMIN' ||
    orgRoleUpperCase === 'CHAIRPERSON' ||
    orgRoleUpperCase === 'SECRETARY' ||
    orgRoleUpperCase === 'TREASURER' ||
    orgRoleUpperCase === 'ADMIN' ||
    userTypeUpperCase === 'ADMIN';

  if (isAdmin) {
    return 'ADMIN';
  }

  return 'MEMBER';
}

/**
 * Determine governance role from API response
 */
function determineGovernanceRole(orgRole?: string): GovernanceRole {
  if (!orgRole) return null;

  const normalized = orgRole.toUpperCase();
  const validRoles: GovernanceRole[] = [
    'CHAIRPERSON',
    'VICE_CHAIR',
    'SECRETARY',
    'TREASURER',
    'WELFARE_OFFICER',
  ];

  return (validRoles.find(r => r === normalized) as GovernanceRole) || null;
}

// ==================== PROVIDER ====================

// ==================== PROVIDER ====================

// ... imports ...

export const ChamaMembershipProvider: React.FC<
  ChamaMembershipProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chamas, setChamas] = useState<ChamaMembership[]>([]);
  const [activeChama, setActiveChamaState] = useState<ChamaMembership | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardContext, setDashboardContextState] = useState<
    'admin' | 'member'
  >(getLastDashboardContext());

  // Check authentication status using SecureTokenStorage
  const isAuthenticated = SecureTokenStorage.isAuthenticated();

  // Check if current user has admin access to active chama
  const hasAdminAccess =
    activeChama?.systemRole === 'OWNER' || activeChama?.systemRole === 'ADMIN';

  const setDashboardContext = useCallback((context: 'admin' | 'member') => {
    setDashboardContextState(context);
    setLastDashboardContext(context);
  }, []);

  const refreshMemberships = useCallback(async () => {
    // Get token from SecureTokenStorage
    const token = SecureTokenStorage.getAuthToken();
    if (!token) {
      setUser(null);
      setChamas([]);
      setActiveChamaState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get current user
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      // Get user's chamas
      const userChamas = await ChamaService.getUserChamas();

      // Check if user just created a chama (localStorage flag)
      const hasCreatedChama =
        localStorage.getItem('hasCreatedChama') === 'true';
      const activeChamaIdFromStorage = localStorage.getItem('activeChamaId');

      // Transform to ChamaMembership format with new role system
      const memberships: ChamaMembership[] = userChamas.map(
        (chama: {
          id: string;
          name: string;
          role?: string;
          organizationRole?: string;
          userType?: string;
          status?: string;
          joinedAt?: string;
          createdBy?: string;
          isOwner?: boolean;
        }) => {
          // Determine system role (OWNER / ADMIN / MEMBER)
          const systemRole = determineSystemRole(
            chama,
            currentUser?.id,
            hasCreatedChama,
            activeChamaIdFromStorage,
            chama.id
          );

          // Determine governance role (CHAIRPERSON, TREASURER, etc.)
          const governanceRole = determineGovernanceRole(
            chama.organizationRole
          );

          // Compute permissions based on roles
          const permissions = computePermissions(systemRole, governanceRole);

          return {
            chamaId: chama.id,
            chamaName: chama.name,
            systemRole,
            governanceRole,
            permissions,
            isActive: true,
            status: (chama.status?.toUpperCase() || 'APPROVED') as
              | 'PENDING'
              | 'APPROVED'
              | 'REJECTED',
            joinedAt: chama.joinedAt,
            isOwner: systemRole === 'OWNER',
          };
        }
      );

      setChamas(memberships);

      // Set active chama from localStorage or first approved chama
      const savedActiveChamaId = localStorage.getItem('activeChamaId');
      const approvedChamas = memberships.filter(c => c.status === 'APPROVED');

      if (savedActiveChamaId) {
        const savedChama = approvedChamas.find(
          c => c.chamaId === savedActiveChamaId
        );
        if (savedChama) {
          setActiveChamaState(savedChama);
        } else if (approvedChamas.length > 0) {
          setActiveChamaState(approvedChamas[0]);
          localStorage.setItem('activeChamaId', approvedChamas[0].chamaId);
        }
      } else if (approvedChamas.length > 0) {
        setActiveChamaState(approvedChamas[0]);
        localStorage.setItem('activeChamaId', approvedChamas[0].chamaId);
      }
    } catch (error) {
      console.error('Error refreshing memberships:', error);
      // If auth fails, clear everything
      setUser(null);
      setChamas([]);
      setActiveChamaState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveChama = useCallback((chama: ChamaMembership) => {
    setActiveChamaState(chama);
    localStorage.setItem('activeChamaId', chama.chamaId);
  }, []);

  const clearMemberships = useCallback(() => {
    setUser(null);
    setChamas([]);
    setActiveChamaState(null);
    localStorage.removeItem('activeChamaId');
    localStorage.removeItem('lastDashboardContext');
  }, []);

  // Initial load
  useEffect(() => {
    refreshMemberships();
  }, [refreshMemberships]);

  const value: ChamaMembershipContextType = {
    user,
    chamas,
    activeChama,
    isLoading,
    isAuthenticated,
    setActiveChama,
    refreshMemberships,
    clearMemberships,
    hasAdminAccess,
    dashboardContext,
    setDashboardContext,
  };

  return (
    <ChamaMembershipContext.Provider value={value}>
      {children}
    </ChamaMembershipContext.Provider>
  );
};

export const useChamaMembership = (): ChamaMembershipContextType => {
  const context = useContext(ChamaMembershipContext);
  if (context === undefined) {
    throw new Error(
      'useChamaMembership must be used within a ChamaMembershipProvider'
    );
  }
  return context;
};

export default ChamaMembershipContext;
