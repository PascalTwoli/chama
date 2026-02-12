import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import AuthService from '../services/auth/signup-service';
import {
  LayoutDashboard,
  Coins,
  Users,
  Receipt,
  HandCoins,
  FileBarChart,
  Calendar,
  MessageSquare,
  Shield,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import ChamaService from '../services/chama/chama-services';
import LogoutModal from './logoutModal';
import { useTheme } from '../context/ThemeContext';
import { useChamaMembership } from '../context/ChamaMembershipContext';
import { cn } from '../utils/cn';
import { GovernanceRole } from '../models/user';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const { chamaId } = useParams<{ chamaId: string }>();
  const [chamaName, setChamaName] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Get active chama role info from context
  const { activeChama } = useChamaMembership();

  const baselink = `/admin/chamas/${chamaId}`;

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
        setChamaName('Error loading');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChamaData();
  }, [chamaId]);

  // get chama initials
  const getChamaInitials = () => {
    if (isLoading || !chamaName) return 'C+';
    const words = chamaName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((userData: any) => {
        setUser(userData);
        setUserName(
          userData.firstName.charAt(0).toUpperCase() +
            userData.firstName.slice(1) +
            ' ' +
            userData.lastName.charAt(0).toUpperCase() +
            userData.lastName.slice(1)
        );
      })
      .catch(() => {
        // User not logged in - this is fine
      });
  }, []);

  const getUserInitials = () => {
    if (!user) return '?';
    const words = user.firstName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  // Format governance role for display
  const formatGovernanceRole = (role: GovernanceRole): string => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get display role text
  const getRoleDisplayText = (): string => {
    if (!activeChama) return 'Member';

    // Show governance role if present (e.g., "Treasurer", "Chairperson")
    if (activeChama.governanceRole) {
      return formatGovernanceRole(activeChama.governanceRole);
    }

    // Otherwise show system role
    switch (activeChama.systemRole) {
      case 'OWNER':
        return 'Owner';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Member';
    }
  };

  // Navigation items matching the Figma design exactly
  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: `${baselink}`,
      end: true,
    },
    { icon: Coins, label: 'Contributions', path: `${baselink}/contributions` },
    { icon: Users, label: 'Members', path: `${baselink}/members` },
    { icon: Receipt, label: 'Expenses', path: `${baselink}/expenses` },
    { icon: HandCoins, label: 'Loans', path: `${baselink}/loans` },
    { icon: FileBarChart, label: 'Reports', path: `${baselink}/reports` },
    { icon: Calendar, label: 'Meetings', path: `${baselink}/meetings` },
    { icon: Bell, label: 'Notifications', path: `${baselink}/notifications` },
    {
      icon: MessageSquare,
      label: 'Communication',
      path: `${baselink}/communication`,
    },
    { icon: Shield, label: 'Roles & Permissions', path: `${baselink}/roles` },
    { icon: Activity, label: 'Activity Log', path: `${baselink}/activity-log` },
    { icon: Settings, label: 'Settings', path: `${baselink}/settings` },
  ];

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-card transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Toggle Button - Small Round Button with Arrow */}
      <button
        onClick={toggleSidebar}
        className='absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-card border border-border border-solid appearance-none shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors '
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className='w-3.5 h-3.5' />
        ) : (
          <ChevronLeft className='w-3.5 h-3.5' />
        )}
      </button>

      {/* Header / Logo Area */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-border mt-5',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <div
          className={cn(
            'w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0',
            isCollapsed && 'h-10 w-10'
          )}
        >
          <span className='text-primary-foreground font-bold text-sm'>
            {getChamaInitials()}
          </span>
        </div>
        {!isCollapsed && (
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-foreground truncate my-0'>
              Admin Dashboard
            </p>
            <p className='text-xs text-muted-foreground truncate my-0'>
              {isLoading ? 'Loading...' : chamaName}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto py-4 px-3'>
        <div className='space-y-1'>
          {navItems.map(({ icon: Icon, label, path, end }) => (
            // remove underline on side bar links
            <NavLink
              key={label}
              to={path}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline',
                  isCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
              title={isCollapsed ? label : undefined}
            >
              <Icon className='w-5 h-5 flex-shrink-0' />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section: Theme Toggle, User Profile, Logout */}
      <div className='mt-auto border-t border-border px-4 py-3'>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 text-sm font-medium transition-colors border-none bg-transparent rounded-md',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            isCollapsed && 'justify-center px-2'
          )}
          title={
            isCollapsed
              ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
              : undefined
          }
        >
          {theme === 'light' ? (
            <Moon className='w-5 h-5 flex-shrink-0' />
          ) : (
            <Sun className='w-5 h-5 flex-shrink-0' />
          )}
          {!isCollapsed && (
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>

        {/* User Profile */}
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-2 border-t border-border',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <div className='w-7 h-7 rounded-full bg-success flex items-center justify-center flex-shrink-0'>
            <span className='text-success-foreground font-semibold text-xs'>
              {getUserInitials()}
            </span>
          </div>
          {!isCollapsed && (
            <div className='min-w-0'>
              {/* remove vertical padding from the user name and role */}
              <p className='text-sm font-medium text-foreground truncate my-0'>
                {userName}
              </p>
              <p className='text-xs text-muted-foreground truncate my-0 flex items-center gap-1'>
                <span>{getRoleDisplayText()}</span>
                {activeChama?.isOwner && (
                  <span className='inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium'>
                    Owner
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 text-sm font-medium transition-colors border-none bg-transparent rounded-md',
            'text-destructive hover:bg-destructive hover:text-destructive-foreground',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut className='w-5 h-5 flex-shrink-0' />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <LogoutModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </aside>
  );
}

export default Sidebar;
