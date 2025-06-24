import { ListBox } from 'primereact/listbox';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MembershipProps } from '../../models/chamas';

interface NavbarLink {
  label: string;
  to: string;
  icon: string;
}

interface NavbarLinksProps {
  onLogoutClick: () => void;
}

function NavbarLinks({ onLogoutClick }: NavbarLinksProps) {
  const [selectedItem, setSelectedItem] = useState<NavbarLink | null>(null);
  const { chamaId } = useParams<MembershipProps>();
  const settings = `/admin/chamas/${chamaId}/settings`;
  const navigate = useNavigate();

  const items = [
    { label: 'Profile', icon: 'pi pi-fw pi-profile', to: '/profile' },
    { label: 'Settings', icon: 'pi pi-fw pi-settings', to: `${settings}` },
    { label: 'Logout', icon: 'pi pi-fw pi-envelope', to: 'logout' },
  ];

  return (
    <div className='card flex justify-content-center w-[160px]'>
      <ListBox
        value={selectedItem}
        onChange={e => {
          setSelectedItem(e.value);
          if (e.value) {
            if (e.value.to === 'logout') {
              onLogoutClick();
            } else {
              navigate(e.value.to);
            }
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
