import { useEffect, useState } from 'react';
import AuthService from '../../services/auth/signup-service';
import NavbarLinks from './navbar-links';
import ProfileTemplate from '../../utils/profile-template';
import LogoutModal from '../logoutModal';
import Logo1 from '../../logos/logo1';

function OnBoardingNavbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [displayNavbarLinks, setDisplayNavbarLinks] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    AuthService.getCurrentUser().then((user: any) => {
      setUserName(
        user.firstName.charAt(0).toUpperCase() +
          user.firstName.slice(1) +
          ' ' +
          user.lastName.charAt(0).toUpperCase() +
          user.lastName.slice(1)
      );
      setUser(user);
    });
  }, []);

  return (
    <div className='navbar flex justify-between items-center text-white pl-7  pr-5'>
      <div className='flex items-center gap-x-6'>
        <span>
          <Logo1 />
        </span>
      </div>
      <div className='flex gap-x-4 items-center'>
        <i className='pi pi-bell' />
        <div
          className='profile-div flex items-center gap-x-2 relative cursor-pointer'
          onClick={() => setDisplayNavbarLinks(!displayNavbarLinks)}
        >
          {user && ProfileTemplate(user, 5, 5)}
          <span>{userName}</span>
          <i className='pi pi-chevron-down text-xs' />
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
      {/* Logout Modal - managed at navbar level to persist across component unmounts */}
      <LogoutModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default OnBoardingNavbar;
