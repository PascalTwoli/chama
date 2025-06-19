import { ListBox } from 'primereact/listbox';
import { useState } from 'react';

interface NavbarLink {
  label: string;
  to: string;
  icon: string;
}

function NavbarLinks() {
  const [selectedItem, setSelectedItem] = useState<NavbarLink | null>(null);

  const items = [
    { label: 'Profile', icon: 'pi pi-fw pi-profile', to: '/profile' },
    { label: 'Settings', icon: 'pi pi-fw pi-settings', to: '/settings' },
    { label: 'Logout', icon: 'pi pi-fw pi-envelope', to: '/contact' },
  ];

  return (
    <div className='card flex justify-content-center'>
      <ListBox
        value={selectedItem}
        onChange={e => setSelectedItem(e.value)}
        options={items}
        optionLabel='label'
        className='w-full md:w-14rem'
      />
    </div>
  );
}

export default NavbarLinks;
