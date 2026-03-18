import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Check,
  X,
  CreditCard,
  UserPlus,
  AlertCircle,
  Banknote,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '../utils/cn';
import NotificationsService, {
  Notification as ApiNotification,
  NotificationStats,
} from '../services/notifications/notifications-service';
import { useChamaMembership } from '../context/ChamaMembershipContext';
import { dispatchNotificationUpdate } from '../utils/notification-events';

export default function NotificationsPage() {
  const { activeChama } = useChamaMembership();
  const activeChamaId = activeChama?.chamaId;
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'action'>(
    'all'
  );
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    actionRequired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!activeChamaId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [notificationsData, statsData] = await Promise.all([
          NotificationsService.getNotifications({
            chamaId: activeChamaId,
            status: activeFilter,
            limit: 50,
          }),
          NotificationsService.getStats(activeChamaId),
        ]);

        setNotifications(notificationsData.data);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        alert(
          error instanceof Error ? error.message : 'Failed to load notifications'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [activeChamaId, activeFilter]);

  const markAllRead = async () => {
    if (!activeChamaId) return;

    try {
      setMarkingAllRead(true);
      await NotificationsService.markAllAsRead(activeChamaId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, readAt: new Date().toISOString() }))
      );
      setStats(prev => ({ ...prev, unread: 0 }));
      
      // Notify other components (like Navbar) to update
      dispatchNotificationUpdate();
      
      alert('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to mark all as read'
      );
    } finally {
      setMarkingAllRead(false);
    }
  };

  const markRead = async (id: string) => {
    if (!activeChamaId) return;

    try {
      await NotificationsService.markAsRead(id, activeChamaId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      
      // Notify other components (like Navbar) to update
      dispatchNotificationUpdate();
    } catch (error) {
      console.error('Error marking as read:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to mark as read'
      );
    }
  };

  const getIcon = (entityType?: string) => {
    if (!entityType) return <CreditCard className='w-5 h-5 text-gray-500' />;
    
    if (entityType === 'loan' || entityType === 'contribution') {
      return <Banknote className='w-5 h-5 text-blue-600' />;
    }
    if (entityType === 'member' || entityType === 'join_request') {
      return <UserPlus className='w-5 h-5 text-blue-600' />;
    }
    if (entityType === 'chama_settings') {
      return <AlertCircle className='w-5 h-5 text-orange-500' />;
    }
    return <CreditCard className='w-5 h-5 text-gray-500' />;
  };

  const getIconBg = (entityType?: string) => {
    if (entityType === 'chama_settings') return 'bg-orange-100';
    return 'bg-blue-100';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (!activeChamaId) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='p-6 text-center'>
            <p className='text-muted-foreground'>
              Please select a chama to view notifications
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Notifications'
        subtitle={`${stats.unread} unread notifications`}
        action={
          <Button
            variant='outline'
            className='gap-2'
            onClick={markAllRead}
            disabled={markingAllRead || stats.unread === 0}
          >
            {markingAllRead ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <CheckCheck className='w-4 h-4' />
            )}
            Mark All Read
          </Button>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Filters */}
          <div className='flex gap-2 pb-2'>
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Unread ({stats.unread})
            </button>
            <button
              onClick={() => setActiveFilter('action')}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === 'action'
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Action Required ({stats.actionRequired})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className='p-6 text-center'>
                <Loader2 className='w-8 h-8 animate-spin mx-auto text-blue-600' />
                <p className='text-sm text-muted-foreground mt-2'>
                  Loading notifications...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && notifications.length === 0 && (
            <Card>
              <CardContent className='p-6 text-center'>
                <p className='text-muted-foreground'>
                  {activeFilter === 'all'
                    ? 'No notifications yet'
                    : activeFilter === 'unread'
                    ? 'No unread notifications'
                    : 'No notifications requiring action'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* List */}
          {!loading && notifications.length > 0 && (
            <div className='space-y-4'>
              {notifications.map(notification => (
                <Card
                  key={notification.id}
                  className={cn(
                    'transition-colors border',
                    !notification.readAt
                      ? 'bg-blue-50/50 border-blue-100'
                      : 'bg-card border-border'
                  )}
                >
                  <CardContent className='p-5'>
                    <div className='flex items-start gap-4'>
                      {/* Icon */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          getIconBg(notification.entityType)
                        )}
                      >
                        {getIcon(notification.entityType)}
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-start gap-4'>
                          <div>
                            <h4 className='text-base font-semibold text-foreground m-0'>
                              {notification.title}
                            </h4>
                            <p className='text-sm text-muted-foreground mt-1'>
                              {notification.body}
                            </p>
                          </div>
                          {/* Unread Indicator */}
                          {!notification.readAt && (
                            <div className='w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0' />
                          )}
                        </div>

                        {/* Footer: Time & Actions */}
                        <div className='flex items-center justify-between mt-4'>
                          <span className='text-xs text-muted-foreground'>
                            {formatTimeAgo(notification.createdAt)}
                          </span>

                          {notification.actionRequired ? (
                            <div className='flex gap-2'>
                              <Button
                                size='sm'
                                variant='outline'
                                className='h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800'
                                onClick={() => {
                                  // TODO: Handle approve action based on entityType
                                  alert('Action handling coming soon');
                                }}
                              >
                                <Check className='w-3.5 h-3.5 mr-1.5' />
                                Approve
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                className='h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800'
                                onClick={() => {
                                  // TODO: Handle reject action based on entityType
                                  alert('Action handling coming soon');
                                }}
                              >
                                <X className='w-3.5 h-3.5 mr-1.5' />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            !notification.readAt && (
                              <button
                                onClick={() => markRead(notification.id)}
                                className='text-xs font-semibold text-foreground hover:underline'
                              >
                                Mark as read
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Stats & Settings */}
        <div className='space-y-6'>
          {/* Notification Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>
                Notification Stats
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <p className='text-xs text-muted-foreground'>Total</p>
                <h3 className='text-xl font-bold'>{stats.total}</h3>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Unread</p>
                <h3 className='text-xl font-bold text-blue-600'>
                  {stats.unread}
                </h3>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Action Required</p>
                <h3 className='text-xl font-bold text-orange-500'>
                  {stats.actionRequired}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='email_notif'
                  className='text-sm font-medium text-foreground'
                >
                  Email Notifications
                </label>
                <input
                  type='checkbox'
                  id='email_notif'
                  defaultChecked
                  disabled
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 opacity-50 cursor-not-allowed'
                  title='Coming soon'
                />
              </div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='sms_notif'
                  className='text-sm font-medium text-foreground'
                >
                  SMS Notifications
                </label>
                <input
                  type='checkbox'
                  id='sms_notif'
                  defaultChecked
                  disabled
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 opacity-50 cursor-not-allowed'
                  title='Coming soon'
                />
              </div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='push_notif'
                  className='text-sm font-medium text-foreground'
                >
                  Push Notifications
                </label>
                <input
                  type='checkbox'
                  id='push_notif'
                  defaultChecked
                  disabled
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 opacity-50 cursor-not-allowed'
                  title='Coming soon'
                />
              </div>
              <p className='text-xs text-muted-foreground mt-2'>
                Additional notification channels coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
