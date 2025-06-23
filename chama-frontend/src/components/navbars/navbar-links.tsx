import { ListBox } from 'primereact/listbox';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MembershipProps } from '../../models/chamas';
import logoutUser from '../../services/auth/logout';

interface NavbarLink {
  label: string;
  to: string;
  icon: string;
}

function NavbarLinks() {
  const [selectedItem, setSelectedItem] = useState<NavbarLink | null>(null);
  const { chamaId } = useParams<MembershipProps>();
  const settings = `/admin/chamas/${chamaId}/settings`;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // The logoutUser function now handles the navigation
    } catch (error) {
      console.error('Logout failed:', error);
      // If logout fails, try to clear localStorage and redirect anyway
      localStorage.clear();
      navigate('/signin');
    }
  };

  const items = [
    { label: 'Profile', icon: 'pi pi-fw pi-profile', to: '/profile' },
    { label: 'Settings', icon: 'pi pi-fw pi-settings', to: `${settings}` },
    { label: 'Logout', icon: 'pi pi-fw pi-envelope', onClick: handleLogout },
  ];

  return (
    <div className='card flex justify-content-center w-[160px]'>
      <ListBox
        value={selectedItem}
        onChange={e => {
          setSelectedItem(e.value);
          if (e.value) {
            window.location.href = e.value.to;
          }
        }}
        options={items}
        optionLabel='label'
        className='w-full md:w-14rem'
      />
    </div>
  );
}

export default NavbarLinks;
