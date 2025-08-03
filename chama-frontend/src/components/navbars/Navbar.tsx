// components/Navbar.tsx
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import AuthService from '../../services/auth/signup-service';
import { useEffect, useState } from 'react';
import NavbarLinks from './navbar-links';
import ProfileTemplate from '../../utils/profile-template';
import LogoutModal from '../logoutModal';
import Logo1 from '../../logos/logo1';

interface NavbarProps {
  chamas: { id: number; name: string }[];
  onCreateChama: () => void;
  handleJoinChama: (chamaId: number) => void;
}

const Navbar = ({ chamas, onCreateChama, handleJoinChama }: NavbarProps) => {
  const menuRef = useRef<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [displayNavbarLinks, setDisplayNavbarLinks] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // this for getting the currently logged in user's id
  useEffect(() => {
    AuthService.getCurrentUser().then((user: any) => {
      setUser(user);
      setUserName(
        user.firstName.charAt(0).toUpperCase() +
          user.firstName.slice(1) +
          ' ' +
          user.lastName.charAt(0).toUpperCase() +
          user.lastName.slice(1)
      );
    });
  }, []);

  const menuItems: MenuItem[] = [
    ...chamas.map(chama => ({
      label: chama.name,
      command: () => handleJoinChama(chama.id),
    })),
    { separator: true },
    {
      label: 'Create New Chama',
      icon: 'pi pi-plus',
      command: onCreateChama,
    },
  ];

  return (
    <div className='navbar flex justify-between items-center pl-7  pr-5 text-white'>
      <div className='flex items-center gap-x-6'>
        <span>
          <Logo1 />
        </span>
        <div className='relative'>
          <div
            className='text-white rounded px-4 py-2'
            onClick={e => menuRef.current.toggle(e)}
          >
            Select Chama <i className='pi pi-chevron-down ml-2' />
          </div>
          <Menu model={menuItems} popup ref={menuRef} />
        </div>
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
            <div className='fixed top-16 right-5 z-50'>
              <NavbarLinks
                onLogoutClick={() => {
                  setShowLogoutModal(true);
                  setDisplayNavbarLinks(false); // Close the dropdown when logout is clicked
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
};

export default Navbar;

// import { FC } from "react";

// interface Chama {
//   id: number;
//   name: string;
// }

// interface NavbarProps {
//   chamas: Chama[];
//   handleCreateChama: () => void;
//   handleJoinChama: (chamaId: number) => void;
// }

// const Navbar: FC<NavbarProps> = ({
//   chamas,
//   handleCreateChama,
//   handleJoinChama,
// }) => {
//   return (
//     <div className="navbar p-4 flex justify-between items-center bg-[#111827]">
//       <h1 className="text-xl font-bold">My Chama App</h1>

//       <div className="flex items-center gap-4">
//         <div className="relative group">
//           <button className="hover:text-blue-400">Switch Chama</button>
//           <div className="absolute hidden group-hover:block bg-white text-black shadow-md rounded mt-2">
//             {chamas.map((chama) => (
//               <div
//                 key={chama.id}
//                 onClick={() => handleJoinChama(chama.id)}
//                 className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
//               >
//                 {chama.name}
//               </div>
//             ))}
//             <div
//               onClick={handleCreateChama}
//               className="px-4 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer font-semibold border-t"
//             >
//               + Create New Chama
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
