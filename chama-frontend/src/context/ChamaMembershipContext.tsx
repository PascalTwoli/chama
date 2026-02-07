import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { ChamaMembership, User } from '../models/user';
import ChamaService from '../services/chama/chama-services';
import AuthService from '../services/auth/signup-service';

interface ChamaMembershipContextType {
  user: User | null;
  chamas: ChamaMembership[];
  activeChama: ChamaMembership | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setActiveChama: (chama: ChamaMembership) => void;
  refreshMemberships: () => Promise<void>;
  clearMemberships: () => void;
}

const ChamaMembershipContext = createContext<
  ChamaMembershipContextType | undefined
>(undefined);

interface ChamaMembershipProviderProps {
  children: ReactNode;
}

export const ChamaMembershipProvider: React.FC<
  ChamaMembershipProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chamas, setChamas] = useState<ChamaMembership[]>([]);
  const [activeChama, setActiveChamaState] = useState<ChamaMembership | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!localStorage.getItem('authToken');

  const refreshMemberships = useCallback(async () => {
    const token = localStorage.getItem('authToken');
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

      // Transform to ChamaMembership format
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
        }) => {
          // Check multiple sources for ADMIN role
          const roleUpperCase = chama.role?.toUpperCase();
          const orgRoleUpperCase = chama.organizationRole?.toUpperCase();
          const userTypeUpperCase = chama.userType?.toUpperCase();

          // User is ADMIN if:
          // 1. role is explicitly 'ADMIN'
          // 2. organizationRole is CHAIRPERSON, SECRETARY, TREASURER, or ADMIN
          // 3. userType is ADMIN
          // 4. User just created this specific chama (localStorage flag)
          const isAdmin =
            roleUpperCase === 'ADMIN' ||
            orgRoleUpperCase === 'CHAIRPERSON' ||
            orgRoleUpperCase === 'SECRETARY' ||
            orgRoleUpperCase === 'TREASURER' ||
            orgRoleUpperCase === 'ADMIN' ||
            userTypeUpperCase === 'ADMIN' ||
            (hasCreatedChama && chama.id === activeChamaIdFromStorage);

          return {
            chamaId: chama.id,
            chamaName: chama.name,
            role: (isAdmin ? 'ADMIN' : 'MEMBER') as 'ADMIN' | 'MEMBER',
            isActive: true,
            status: (chama.status?.toUpperCase() || 'APPROVED') as
              | 'PENDING'
              | 'APPROVED'
              | 'REJECTED',
            joinedAt: chama.joinedAt,
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
