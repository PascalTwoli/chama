import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  Clock,
  DollarSign,
  Calendar,
  UserPlus,
  AlertCircle,
  Banknote,
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationsPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Notification {
  id: number;
  type: 'payment' | 'meeting' | 'loan_request' | 'member' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionRequired?: boolean;
  loanRequestId?: number;
}

export default function NotificationsPage({
  onBack,
  role,
}: NotificationsPageProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'action'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(
    role === 'admin'
      ? [
          {
            id: 1,
            type: 'loan_request',
            title: 'Loan Request from Mary Wanjiku',
            message:
              'Mary Wanjiku has requested a loan of KSh 50,000 for 6 months at 5% interest',
            time: '10 minutes ago',
            read: false,
            actionRequired: true,
            loanRequestId: 1,
          },
          {
            id: 2,
            type: 'payment',
            title: 'New Payment Received',
            message: 'Peter Kamau paid KSh 5,000 via M-Pesa',
            time: '2 hours ago',
            read: false,
          },
          {
            id: 3,
            type: 'loan_request',
            title: 'Loan Request from David Omondi',
            message:
              'David Omondi has requested a loan of KSh 30,000 for 3 months at 5% interest',
            time: '5 hours ago',
            read: false,
            actionRequired: true,
            loanRequestId: 2,
          },
          {
            id: 4,
            type: 'alert',
            title: 'Payment Reminder Due',
            message: '3 members have pending payments for this month',
            time: '1 day ago',
            read: true,
          },
          {
            id: 5,
            type: 'member',
            title: 'New Member Joined',
            message: 'Grace Njeri has joined the Chama via invite link',
            time: '2 days ago',
            read: true,
          },
        ]
      : [
          {
            id: 1,
            type: 'meeting',
            title: 'Upcoming Meeting Reminder',
            message: 'Chama meeting scheduled for January 15, 2026 at 2:00 PM',
            time: '1 hour ago',
            read: false,
          },
          {
            id: 2,
            type: 'payment',
            title: 'Payment Confirmed',
            message:
              'Your payment of KSh 5,000 has been confirmed and recorded',
            time: '2 days ago',
            read: false,
          },
          {
            id: 3,
            type: 'alert',
            title: 'Contribution Reminder',
            message:
              'Your monthly contribution of KSh 5,000 is due on January 5',
            time: '3 days ago',
            read: true,
          },
          {
            id: 4,
            type: 'loan_request',
            title: 'Loan Application Approved',
            message:
              'Your loan request of KSh 20,000 has been approved by the admin',
            time: '5 days ago',
            read: true,
          },
        ]
  );

  const handleApproveLoan = (
    notificationId: number,
    loanRequestId?: number
  ) => {
    toast.success('Loan request approved successfully!');
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true, actionRequired: false }
          : notif
      )
    );
  };

  const handleRejectLoan = (notificationId: number, loanRequestId?: number) => {
    toast.success('Loan request rejected');
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true, actionRequired: false }
          : notif
      )
    );
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-5 h-5 text-primary" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-secondary" />;
      case 'loan_request':
        return <Banknote className="w-5 h-5 text-accent" />;
      case 'member':
        return <UserPlus className="w-5 h-5 text-primary" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'action') return notif.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread{' '}
              {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-primary' : ''}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className={filter === 'unread' ? 'bg-primary' : ''}
                >
                  Unread ({unreadCount})
                </Button>
                {role === 'admin' && actionCount > 0 && (
                  <Button
                    variant={filter === 'action' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('action')}
                    className={filter === 'action' ? 'bg-primary' : ''}
                  >
                    Action Required ({actionCount})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No notifications to display
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map(notification => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !notification.read ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </div>
                          {notification.actionRequired && role === 'admin' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() =>
                                  handleApproveLoan(
                                    notification.id,
                                    notification.loanRequestId
                                  )
                                }
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  handleRejectLoan(
                                    notification.id,
                                    notification.loanRequestId
                                  )
                                }
                              >
                                <X className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            !notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-primary">{unreadCount}</p>
              </div>
              {role === 'admin' && actionCount > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Action Required
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {actionCount}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotif" className="text-sm">
                  Email Notifications
                </label>
                <input
                  id="emailNotif"
                  type="checkbox"
                  className="w-4 h-4"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="smsNotif" className="text-sm">
                  SMS Notifications
                </label>
                <input
                  id="smsNotif"
                  type="checkbox"
                  className="w-4 h-4"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="pushNotif" className="text-sm">
                  Push Notifications
                </label>
                <input
                  id="pushNotif"
                  type="checkbox"
                  className="w-4 h-4"
                  defaultChecked
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
