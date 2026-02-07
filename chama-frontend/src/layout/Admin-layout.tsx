import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbars/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className='bg-background text-foreground h-screen flex flex-col overflow-hidden'>
      {/* Fixed Header */}
      <header className='flex-shrink-0 border-b border-border'>
        <Navbar />
      </header>

      {/* Body: Fixed Sidebar + Scrollable Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Fixed Sidebar with internal scroll */}
        <aside className='flex-shrink-0 overflow-y-auto border-r border-border'>
          <Sidebar />
        </aside>

        {/* Scrollable Main Content Area */}
        <main className='flex-1 overflow-y-auto bg-background'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
