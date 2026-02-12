import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  MessageSquare,
  Phone,
  Users,
  Plus,
  Pin,
  Edit2,
  Trash2,
  Megaphone,
  AlertCircle,
  Calendar,
  Info,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'Contribution' | 'Meeting' | 'General' | 'Urgent';
  author: string;
  date: string; // e.g. "17 Jan 2026"
  isPinned?: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Important: Next Month Contribution Deadline',
    content:
      'Dear members, please note that February contributions are due by 5th February 2026. Late payment penalties will apply after the grace period.',
    type: 'Contribution',
    author: 'John Kamau',
    date: '17 Jan 2026',
    isPinned: true,
  },
  {
    id: '2',
    title: 'Monthly Meeting - February 2026',
    content:
      'Our next monthly general meeting is scheduled for Saturday, 5th February 2026 at 2:00 PM at the Community Hall. Agenda includes contribution review and new investment proposals. Your attendance is important!',
    type: 'Meeting',
    author: 'Sarah Njeri',
    date: '15 Jan 2026',
    isPinned: true,
  },
  {
    id: '3',
    title: 'New Member Welcome',
    content:
      'We are pleased to welcome Paul Kiptoo to Tumaini Chama! Paul has been a friend of the group for some time and we look forward to growing together.',
    type: 'General',
    author: 'John Kamau',
    date: '14 Jan 2026',
    isPinned: false,
  },
  {
    id: '4',
    title: 'Investment Update - Treasury Bonds',
    content:
      'Great news! Our investment in treasury bonds has yielded a 8.5% return. The Treasurer will present a detailed report at the next meeting.',
    type: 'General',
    author: 'Mary Wanjiku',
    date: '12 Jan 2026',
    isPinned: false,
  },
  {
    id: '5',
    title: 'URGENT: Emergency Loan Approved',
    content:
      'The committee has approved an emergency loan of KSh 30,000 to Peter Ochieng for medical expenses. All members please note this will affect our available loan capital.',
    type: 'Urgent',
    author: 'John Kamau',
    date: '10 Jan 2026',
    isPinned: false,
  },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'Announcements' | 'SMS Broadcast'>(
    'Announcements'
  );

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Contribution':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Meeting':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Contribution':
        return Megaphone; // or DollarSign
      case 'Meeting':
        return Calendar;
      case 'Urgent':
        return AlertCircle;
      default:
        return Info; // or MessageSquare
    }
  };

  const pinnedAnnouncements = mockAnnouncements.filter(a => a.isPinned);
  const otherAnnouncements = mockAnnouncements.filter(a => !a.isPinned);

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Communication'
        subtitle='Announcements and SMS broadcast'
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Total Announcements
              </p>
              <h3 className='text-2xl font-bold mt-1'>5</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
              <MessageSquare className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                SMS Sent (Month)
              </p>
              <h3 className='text-2xl font-bold mt-1'>3</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center'>
              <Phone className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Active Members
              </p>
              <h3 className='text-2xl font-bold mt-1'>10</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center'>
              <Users className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className='bg-muted/20 p-1 rounded-lg w-full flex text-sm font-medium mb-4'>
        <button
          onClick={() => setActiveTab('Announcements')}
          className={cn(
            'flex-1 py-2 rounded-md transition-all text-center',
            activeTab === 'Announcements'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:bg-background/50'
          )}
        >
          Announcements
        </button>
        <button
          onClick={() => setActiveTab('SMS Broadcast')}
          className={cn(
            'flex-1 py-2 rounded-md transition-all text-center',
            activeTab === 'SMS Broadcast'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:bg-background/50'
          )}
        >
          SMS Broadcast
        </button>
      </div>

      {/* Content */}
      {activeTab === 'Announcements' && (
        <div className='space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300'>
          <div className='flex justify-end'>
            <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='w-4 h-4' />
              New Announcement
            </Button>
          </div>

          {/* Pinned */}
          {pinnedAnnouncements.length > 0 && (
            <div className='space-y-4'>
              <h3 className='font-semibold flex items-center gap-2'>
                <Pin className='w-4 h-4 text-blue-600 fill-blue-600' />
                Pinned Announcements
              </h3>
              {pinnedAnnouncements.map(announcement => {
                const Icon = getIcon(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className='bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg p-5 space-y-3 relative group'
                  >
                    <div className='flex justify-between items-start'>
                      <span
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider',
                          getBadgeVariant(announcement.type)
                        )}
                      >
                        <Icon className='w-3 h-3' />
                        {announcement.type}
                      </span>
                      <div className='flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-blue-600'
                        >
                          <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-destructive'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className='text-lg font-semibold'>
                        {announcement.title}
                      </h4>
                      <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                        {announcement.content}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2'>
                      <span>Posted by {announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.date}</span>
                    </div>
                    <Pin className='absolute top-4 right-12 w-4 h-4 text-blue-400 rotate-45 hidden sm:block opacity-50' />
                  </div>
                );
              })}
            </div>
          )}

          {/* All */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>All Announcements</h3>
            {otherAnnouncements.map(announcement => {
              const Icon = getIcon(announcement.type);
              return (
                <div
                  key={announcement.id}
                  className='bg-card border border-border rounded-lg p-5 space-y-3 hover:shadow-sm transition-shadow group'
                >
                  <div className='flex justify-between items-start'>
                    <span
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider',
                        getBadgeVariant(announcement.type)
                      )}
                    >
                      <Icon className='w-3 h-3' />
                      {announcement.type}
                    </span>
                    <div className='flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-blue-600'
                      >
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-destructive'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className='text-base font-semibold'>
                      {announcement.title}
                    </h4>
                    <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                      {announcement.content}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2'>
                    <span>Posted by {announcement.author}</span>
                    <span>•</span>
                    <span>{announcement.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'SMS Broadcast' && (
        <div className='flex flex-col items-center justify-center py-12 text-center space-y-4 border border-dashed rounded-lg bg-muted/10'>
          <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center'>
            <Phone className='w-8 h-8 text-muted-foreground' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>SMS Broadcast</h3>
            <p className='text-muted-foreground max-w-sm mx-auto mt-1'>
              Send SMS notifications to all members or specific groups.
            </p>
          </div>
          <Button>Configure Sender ID</Button>
        </div>
      )}
    </div>
  );
}
