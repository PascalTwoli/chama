import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';
import AuthService from '../../services/auth/signup-service';
import LogoutModal from '../logoutModal';
import Logo1 from '../../logos/logo1';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [displayProfileMenu, setDisplayProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((userData: any) => {
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

  return (
    <header className='bg-card px-6 py-3'>
      <div className='flex justify-between items-center'>
        {/* Left: Logo */}
        <div className='flex items-center'>
          <Logo1 />
        </div>

        {/* Right: Theme Toggle, Notifications, Profile */}
        <div className='flex items-center gap-4'>
          {/* Theme Toggle */}
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
            className='text-muted-foreground hover:text-foreground'
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className='w-5 h-5' />
            ) : (
              <Sun className='w-5 h-5' />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant='ghost'
            size='icon'
            className='relative text-muted-foreground hover:text-foreground'
          >
            <Bell className='w-5 h-5' />
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center'>
              3
            </span>
          </Button>

          {/* Profile */}
          <div className='relative'>
            <button
              onClick={() => setDisplayProfileMenu(!displayProfileMenu)}
              className='flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors'
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
                    <User className='w-4 h-4' />
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
          </div>
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
