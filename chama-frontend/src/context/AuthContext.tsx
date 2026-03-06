import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import SecureTokenStorage from '../utils/secure-token-storage';
import AuthService from '../services/auth/signup-service';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async () => {
    const hasToken = SecureTokenStorage.isAuthenticated();
    setIsAuthenticated(hasToken);

    if (hasToken) {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser({
          id: currentUser.id || '',
          email: currentUser.email || '',
          name:
            `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() ||
            currentUser.email ||
            '',
        });
      } catch (error) {
        console.error('Failed to get current user:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshAuth]);

  const login = async () => {
    // Login is handled by AuthService, just refresh the state
    await refreshAuth();
  };

  const logout = () => {
    SecureTokenStorage.clearAllTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
