import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bell,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import AuthService from '../../services/auth/signup-service';
import LogoutModal from '../logoutModal';
import Logo1 from '../../logos/logo1';
import { useTheme } from '../../context/ThemeContext';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import { Button } from '../ui/button';

import { User } from '../../models/user';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [displayProfileMenu, setDisplayProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { chamaId } = useParams<{ chamaId: string }>();

  // Get dashboard context and admin access from membership context
  const { hasAdminAccess, dashboardContext, setDashboardContext, activeChama } =
    useChamaMembership();

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((userData: User) => {
        setUser(userData);
        setUserName(
          userData.firstName.charAt(0).toUpperCase() +
            userData.firstName.slice(1) +
            ' ' +
            userData.lastName.charAt(0).toUpperCase() +
            userData.lastName.slice(1)
        );
      })
      .catch(() => {
        // User not logged in - this is fine
      });
  }, []);

  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Handle dashboard switch
  const handleDashboardSwitch = () => {
    const targetChamaId = chamaId || activeChama?.chamaId;
    if (!targetChamaId) return;

    if (dashboardContext === 'admin') {
      // Switch to member dashboard
      setDashboardContext('member');
      navigate(`/member/chamas/${targetChamaId}`);
    } else {
      // Switch to admin dashboard
      setDashboardContext('admin');
      navigate(`/admin/chamas/${targetChamaId}`);
    }
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-white/30 dark:bg-black/30 backdrop-blur-md px-6 py-3 shadow-sm transition-all duration-300'>
      <div className='flex justify-between items-center'>
        {/* Left: Logo */}
        <div className='flex items-center'>
          <Logo1 />
        </div>

        {/* Right: Dashboard Toggle, Theme Toggle, Notifications, Profile */}
        <div className='flex items-center gap-4'>
          {/* Dashboard Toggle - Only show if user has admin access */}
          {hasAdminAccess && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleDashboardSwitch}
              className='flex items-center gap-2 text-sm font-medium'
              title={`Switch to ${dashboardContext === 'admin' ? 'Member' : 'Admin'} Dashboard`}
            >
              {dashboardContext === 'admin' ? (
                <>
                  <Users className='w-4 h-4' />
                  <span className='hidden sm:inline'>
                    Switch to Member View
                  </span>
                </>
              ) : (
                <>
                  <LayoutDashboard className='w-4 h-4' />
                  <span className='hidden sm:inline'>Switch to Admin View</span>
                </>
              )}
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant='outline'
            size='sm'
            onClick={toggleTheme}
            className='text-muted-foreground hover:text-foreground'
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className='w-4 h-4' />
            ) : (
              <Sun className='w-4 h-4' />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant='outline'
            size='sm'
            className='relative text-muted-foreground hover:text-foreground'
          >
            <Bell className='w-4 h-4' />
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center'>
              3
            </span>
          </Button>

          {/* This should not be deleted for now, i'll delete it myself when i'm sure it's not needed */}
          {/* Profile */}
          {/* <div className='relative'>
            <button
              onClick={() => setDisplayProfileMenu(!displayProfileMenu)}
              className='flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors border-none hover:border hover:border-input'
            >
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                <span className='text-sm font-bold text-primary'>
                  {getInitials()}
                </span>
              </div>
              <span className='text-sm font-medium text-foreground hidden sm:block'>
                {userName}
              </span>
              <ChevronDown className='w-4 h-4 text-muted-foreground' />
            </button>

            {displayProfileMenu && (
              <div className='absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50'>
                <div className='p-2'>
                  <button
                    onClick={() => {
                      setDisplayProfileMenu(false);
                      navigate('/account-settings');
                    }}
                    className='w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors'
                  >
                    <UserIcon className='w-4 h-4' />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setDisplayProfileMenu(false);
                    }}
                    className='w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors'
                  >
                    <LogOut className='w-4 h-4' />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>

      <LogoutModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </header>
  );
};

export default Navbar;
