import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbars/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className='bg-background text-foreground h-screen flex flex-col overflow-hidden'>
      {/* Fixed Header */}
      <Navbar />

      {/* Body: Sidebar + Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar with top padding for navbar */}
        <aside className='flex-shrink-0 overflow-y-auto border-r border-border pt-16'>
          <Sidebar />
        </aside>

        {/* Main Content with top padding for navbar */}
        <main className='flex-1 overflow-y-auto bg-background pt-16'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
