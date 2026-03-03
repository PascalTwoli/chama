import { useEffect, useState } from 'react';
import AuthService from '../../services/auth/signup-service';
import NavbarLinks from './navbar-links';
import ProfileTemplate from '../../utils/profile-template';
import LogoutModal from '../logoutModal';
import Logo1 from '../../logos/logo1';
import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from '../ui';
import { useTheme } from '../../context/ThemeContext';

function OnBoardingNavbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [displayNavbarLinks, setDisplayNavbarLinks] = useState<boolean>(false);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    AuthService.getCurrentUser().then(userData => {
      setUserName(
        userData.firstName.charAt(0).toUpperCase() +
          userData.firstName.slice(1) +
          ' ' +
          userData.lastName.charAt(0).toUpperCase() +
          userData.lastName.slice(1)
      );
      setUser(userData);
    });
  }, []);

  return (
    <div className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-white/30 dark:bg-black/30 backdrop-blur-md px-6 py-1 shadow-sm transition-all duration-300 flex justify-between items-center'>
      <div className='flex items-center gap-x-6'>
        <span>
          <Logo1 />
        </span>
      </div>
      <div className='flex gap-x-4 items-center'>
        {/* Theme Toggle Button */}
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

        {/* Profile Menu */}
        <div
          className='profile-div flex items-center gap-x-2 relative cursor-pointer hover:bg-muted px-3 py-2 rounded-lg transition-colors'
          onClick={() => setDisplayNavbarLinks(!displayNavbarLinks)}
        >
          {user && ProfileTemplate(user, 5, 5)}
          <span className='text-sm font-medium'>{userName}</span>
          <i className='pi pi-chevron-down text-xs text-muted-foreground' />
          {displayNavbarLinks && (
            <div className='fixed top-16 right-6 z-50'>
              <NavbarLinks
                onLogoutClick={() => {
                  setShowLogoutModal(true);
                  setDisplayNavbarLinks(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default OnBoardingNavbar;
