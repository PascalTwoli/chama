import { Outlet } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';

interface DashboardLayoutProps {
  role: 'admin' | 'member';
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  // role can be used in the future for role-specific features
  console.log('Dashboard role:', role);

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-h-screen lg:ml-0'>
        {/* Top Header */}
        <header className='bg-card border-b border-border p-4 lg:p-6 flex items-center justify-between'>
          <div className='lg:pl-0 pl-12'>
            {/* Page title will be set by individual pages */}
          </div>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='icon' className='relative'>
              <Bell className='w-5 h-5' />
              <span className='absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center'>
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 p-4 lg:p-6 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
