import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import AdminLayout from '../layout/Admin-layout';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';
import Softloans from '../components/softloans';
import Meetings from '../components/meetings';
import Shares from '../components/shares';
import Notifications from '../components/notifications';
import Disbursements from '../components/disbursements';
import Settings from '../components/settings/settings';
import AccountSettings from '../components/settings/account-settings';
import NavbarOnlyLayout from '../layout/navbar-only-layout';
import CreateChama from '../components/create-chama';
import ChamaListView from '../components/chama-list-view';
import AdminDashboard from '../pages/AdminDashboard';
import { ChamaUserType } from '../components/user-type';
import { UserType } from '../data/user-type';
import MemberLayout from '../layout/Member-layout';
import MemberDashboard from '../pages/MemberDashboard';
import AuthService from '../services/auth/signup-service';
import { useEffect, useState } from 'react';
import { OnboardingStatus } from '../models/user';
import Membership from '../components/membership';
import InviteLink from '../components/InviteLink';
import InviteMembers from '../components/member-invitation';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole: 'admin' | 'member';
}

const AppRoutes = () => {
  /**
   * Function to check if user should be redirected to role selection
   * @returns True if user should be redirected to role selection
   */
  // const shouldRedirectToRoleSelection = (): boolean => {
  // 	const status = AuthService.checkOnboardingStatus();
  // 	return status.needsUserType;
  // };

  /**
   * Function to get default route based on user type and onboarding status
   * @returns The path to redirect to
   */
  const getDefaultRoute = (): string => {
    return AuthService.getRedirectPath();
  };

  /**
   * Protected route component - only allows access to users with specified role
   */
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRole,
  }) => {
    const [status, setStatus] = useState<OnboardingStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      const checkStatus = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            navigate('/signin');
            return;
          }

          // Simulate progressive loading with more realistic progress updates
          const progressIntervals = [10, 25, 45, 60, 75, 85, 95];
          let currentIndex = 0;

          const progressTimer = setInterval(() => {
            if (currentIndex < progressIntervals.length) {
              setProgress(progressIntervals[currentIndex]);
              currentIndex++;
            }
          }, 150); // Update every 150ms for smoother animation

          const onboardingStatus = await AuthService.checkOnboardingStatus();

          // Clear the progress timer and set to 100% when done
          clearInterval(progressTimer);
          setProgress(100);

          // Small delay to show 100% completion before hiding
          setTimeout(() => {
            setStatus(onboardingStatus);
            setIsLoading(false);
          }, 200);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          navigate('/signin');
        }
      };
      checkStatus();
    }, [navigate]);

    if (isLoading) {
      return (
        <>
          {/* Progress bar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(79, 140, 255, 0.1)',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4f8cff 40%, #00e0c6 100%)',
                transition: 'width 0.3s ease-out',
                borderRadius: '0 2px 2px 0',
                boxShadow: '0 0 10px rgba(79, 140, 255, 0.3)',
              }}
            />
          </div>

          {/* Optional loading overlay with spinner */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#19222C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9998,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e0e0e0',
                  borderTop: '3px solid #4f8cff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div
                style={{
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Loading... {progress}%
              </div>
            </div>
          </div>

          {/* Add CSS animation for spinner */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      );
    }

    if (status?.needsUserType) {
      return <Navigate to='/chose-user' replace />;
    }

    const normalizedUserType = AuthService.normalizeUserType(
      status?.activeUserType ?? null
    );
    const normalizedAllowedType = AuthService.normalizeUserType(allowedRole);

    if (normalizedUserType !== normalizedAllowedType) {
      return <Navigate to={AuthService.getRedirectPath()} replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path='/' element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Public routes */}
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path='/chose-user'
          element={<ChamaUserType type={UserType.MEMBER} />}
        />

        {/* Admin routes */}
        <Route
          path='/create-chama'
          element={
            <ProtectedRoute allowedRole='admin'>
              <NavbarOnlyLayout>
                <CreateChama />
              </NavbarOnlyLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/chamas/:chamaId/*'
          element={
            <ProtectedRoute allowedRole='admin'>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='membership' element={<Membership />} />
          <Route path='softloans' element={<Softloans />} />
          <Route path='meetings' element={<Meetings />} />
          <Route path='shares' element={<Shares />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='disbursements' element={<Disbursements />} />
          <Route path='chama-settings' element={<Settings />} />
          <Route path='account-settings' element={<AccountSettings />} />
          <Route
            path='invite-link'
            element={<InviteLink chamaId={''} chamaName={''} />}
          />
          <Route path='invite-member' element={<InviteMembers />} />
        </Route>

        {/* Member routes */}
        <Route
          path='/chama-list-view'
          element={
            <ProtectedRoute allowedRole='member'>
              <NavbarOnlyLayout>
                <ChamaListView />
              </NavbarOnlyLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path='/member/chamas/:chamaId/*'
          element={
            <ProtectedRoute allowedRole='member'>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path='softloans' element={<Softloans />} />
          <Route path='meetings' element={<Meetings />} />
          <Route path='shares' element={<Shares />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='disbursements' element={<Disbursements />} />
          <Route path='chama_settings' element={<Settings />} />
          <Route path='account_settings' element={<AccountSettings />} />
        </Route>

        {/* Catch all route */}
        <Route path='*' element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
