import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import ChamaService from '../services/chama/chama-services';
import LogoutModal from './logoutModal';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const { chamaId } = useParams<{ chamaId: string }>();
  const [chamaName, setChamaName] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Set the base link according to user role
  const baselink = `/admin/chamas/${chamaId}`;

  // Fetch chama data when component mounts or chamaId changes
  useEffect(() => {
    const fetchChamaData = async () => {
      if (!chamaId) {
        setChamaName('Unknown Chama');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const chamaData = await ChamaService.getChamaById(chamaId);
        setChamaName(chamaData.name || 'Unknown Chama');
      } catch (error) {
        console.error('Error fetching chama data:', error);
        setChamaName('Error loading chama name');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChamaData();
  }, [chamaId]);

  return (
    <div
      className={`flex flex-col justify-between  sidebar text-white ${isCollapsed ? 'w-fit p-2' : 'max-w-[320px] pl-6 pr-6'} transition-all duration-500 ease-in-out`}
    >
      {' '}
      {/**bg-[#19222C] */}
      <div className={``}>
        {/* sidebar toggle button */}
        <div
          className=' sidebar-toggle-btn bg-gray-700 hover:bg-gray-500 cursor-pointer'
          onClick={() => {
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
          }}
        >
          <div className='text-gray-300 hover:text-white transition-colors duration-200  flex items-center justify-center w-full'>
            <i
              className={`bi ${isCollapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'}`}
            ></i>
          </div>
        </div>
        <div className=''>
          {/* header */}
          <div
            className={`sidebar-header flex items-center ${!isCollapsed ? 'pl-2 gap-2' : ''}`}
          >
            <div
              className='chama-profile-image-div min-w-[50px]'
              style={{
                backgroundImage: "url('/assets/chamaprofileimage.png')",
                backgroundSize: 'cover',
              }}
            >
              <div className='chama-profile-overlay'></div>
            </div>
            {!isCollapsed && (
              <div className={`flex flex-col text-center `}>
                <p className='text-gray-400 m-0 text-sm'>Chama name</p>
                <h3 className='font-bold m-0 text-sm'>
                  {isLoading ? 'Loading...' : chamaName} contribution group
                </h3>
              </div>
            )}
          </div>

          {/* nav links */}
          <div
            className={`sidebar-nav flex flex-col gap-y-2 pt-1 pb-3 text-gray-400 font-bold mb-6 ${!isCollapsed ? 'pl-2' : ''}`}
          >
            <h4
              className={`flex mb-2 text-sm ${isCollapsed ? 'justify-center' : ''}`}
            >
              Main
            </h4>

            {[
              ['bi-house-door', 'Dashboard', `${baselink}`],
              ['bi-people-fill', 'Membership', `${baselink}/membership`],
              ['bi-newspaper', 'Soft loans', `${baselink}/softloans`],
              ['bi-house-check', 'Meetings', `${baselink}/meetings`],
              ['bi-graph-up', 'Shares', `${baselink}/shares`],
              ['bi-bell', 'Notifications', `${baselink}/notifications`],
              ['bi-diagram-2', 'Disbursements', `${baselink}/disbursements`],
            ].map(([icon, label, path]) => {
              const isDashboard = label === 'Dashboard';

              return (
                <NavLink
                  key={label}
                  to={path}
                  end={isDashboard}
                  className={({ isActive }) =>
                    `flex items-center gap-x-4 py-3 px-2 rounded transition-all duration-300 hover:bg-gray-700 no-underline text-sm ${
                      isCollapsed ? 'justify-center' : ''
                    } ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400'}`
                  }
                >
                  <i
                    className={`bi ${icon} sidebar-icon text-base text-gray-300`}
                  ></i>
                  {!isCollapsed && <p className='p-0 m-0'>{label}</p>}
                </NavLink>
              );
            })}
          </div>

          {/* Settings */}
          <div className={` ${isCollapsed ? '' : 'pl-2'}`}>
            <NavLink
              to={`${baselink}/chama-settings`}
              className={({ isActive }) =>
                `flex items-center gap-x-4 py-3 px-2 rounded transition-all duration-300 hover:bg-gray-700  no-underline ${
                  isCollapsed ? 'justify-center' : ''
                } ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400'}`
              }
            >
              <i className='bi bi-gear text-gray-300 text-base'></i>
              {!isCollapsed && (
                <div className='flex gap-x-4 text-gray-400 font-bold'>
                  <p className='m-0 text-sm'>Settings</p>
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </div>
      <div
        className={`flex gap-x-4 text-red-300 font-bold py-3 px-2 hover:bg-gray-700 rounded cursor-pointer 
            ${isCollapsed ? 'justify-center' : 'ml-2 '}`}
        onClick={() => setShowLogoutModal(true)}
      >
        <i className='bi bi-box-arrow-right text-base'></i>
        {!isCollapsed && <span className='text-sm'>Log Out</span>}
      </div>
      <LogoutModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default Sidebar;
