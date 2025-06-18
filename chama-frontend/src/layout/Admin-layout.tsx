import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbars/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hideSidebarRoutes = ['/create-chama'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  const chamas = [
    { id: 1, name: 'Chama One' },
    { id: 2, name: 'Chama Two' },
    // This would eventually come from your backend
  ];

  const handleJoinChama = (chamaId: number) => {
    navigate(`/chamas/${chamaId}`); // or handle it however your app defines "joining"
  };

  return (
    <div className='bg-[#19222C] layout text-white'>
      <Navbar
        chamas={chamas}
        onCreateChama={() => navigate('/create-chama')}
        handleJoinChama={handleJoinChama}
      />
      <div className='flex main-section'>
        {/*!shouldHideSidebar && */}
        <Sidebar />
        <div className='flex-1 flex rounded-xl ml-1 overflow-auto'>
          {' '}
          {/* bg-gray-700 */}
          <main className='p-4 w-full'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
