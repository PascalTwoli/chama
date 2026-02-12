import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'loan_request' | 'payment' | 'alert' | 'member_join';
  actionRequired?: boolean;
  amount?: string;
  sender?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Loan Request from Mary Wanjiku',
    description:
      'Mary Wanjiku has requested a loan of KSh 50,000 for 6 months at 5% interest',
    time: '10 minutes ago',
    read: false,
    type: 'loan_request',
    actionRequired: true,
  },
  {
    id: '2',
    title: 'New Payment Received',
    description: 'Peter Kamau paid KSh 5,000 via M-Pesa',
    time: '2 hours ago',
    read: false,
    type: 'payment',
  },
  {
    id: '3',
    title: 'Loan Request from David Omondi',
    description:
      'David Omondi has requested a loan of KSh 30,000 for 3 months at 5% interest',
    time: '5 hours ago',
    read: false,
    type: 'loan_request',
    actionRequired: true,
  },
  {
    id: '4',
    title: 'Payment Reminder Due',
    description: '3 members have pending payments for this month',
    time: '1 day ago',
    read: true,
    type: 'alert',
  },
  {
    id: '5',
    title: 'New Member Joined',
    description: 'Grace Njeri has joined the Chama via invite link',
    time: '2 days ago',
    read: true,
    type: 'member_join',
  },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'action'>(
    'all'
  );
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionCount = notifications.filter(n => n.actionRequired).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'action') return n.actionRequired;
    return true;
  });

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'loan_request':
      case 'payment':
        return <Banknote className='w-5 h-5 text-blue-600' />;
      case 'member_join':
        return <UserPlus className='w-5 h-5 text-blue-600' />;
      case 'alert':
        return <AlertCircle className='w-5 h-5 text-orange-500' />;
      default:
        return <CreditCard className='w-5 h-5 text-gray-500' />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    if (type === 'alert') return 'bg-orange-100';
    return 'bg-blue-100';
  };

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Notifications'
        subtitle={`${unreadCount} unread notifications`}
        action={
          <Button variant='outline' className='gap-2' onClick={markAllRead}>
            <CheckCheck className='w-4 h-4' />
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
              All ({notifications.length})
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
              Unread ({unreadCount})
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
              Action Required ({actionCount})
            </button>
          </div>

          {/* List */}
          <div className='space-y-4'>
            {filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={cn(
                  'transition-colors border',
                  !notification.read
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
                        getIconBg(notification.type)
                      )}
                    >
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-start gap-4'>
                        <div>
                          <h4 className='text-base font-semibold text-foreground'>
                            {notification.title}
                          </h4>
                          <p className='text-sm text-muted-foreground mt-1'>
                            {notification.description}
                          </p>
                        </div>
                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className='w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0' />
                        )}
                      </div>

                      {/* Footer: Time & Actions */}
                      <div className='flex items-center justify-between mt-4'>
                        <span className='text-xs text-muted-foreground'>
                          {notification.time}
                        </span>

                        {notification.actionRequired ? (
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800'
                            >
                              <Check className='w-3.5 h-3.5 mr-1.5' />
                              Approve
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800'
                            >
                              <X className='w-3.5 h-3.5 mr-1.5' />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          !notification.read && (
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
                <h3 className='text-xl font-bold'>{notifications.length}</h3>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Unread</p>
                <h3 className='text-xl font-bold text-blue-600'>
                  {unreadCount}
                </h3>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Action Required</p>
                <h3 className='text-xl font-bold text-orange-500'>
                  {actionCount}
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
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
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
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
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
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
