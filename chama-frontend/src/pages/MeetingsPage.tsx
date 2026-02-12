import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Calendar,
  Users,
  CheckCircle2,
  Plus,
  Clock,
  MapPin,
  Video,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Meeting {
  id: string;
  title: string;
  date: string; // e.g., "Thursday, 5 February 2026"
  time: string; // "14:00"
  location: string;
  type: 'In-Person' | 'Virtual';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Monthly General Meeting',
    date: 'Thursday, 5 February 2026',
    time: '14:00',
    location: 'Community Hall, Nairobi',
    type: 'In-Person',
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Emergency Committee Meeting',
    date: 'Sunday, 25 January 2026',
    time: '18:00',
    location: 'Zoom Meeting',
    type: 'Virtual',
    status: 'Upcoming',
  },
];

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Meetings'
        subtitle='Schedule and track Chama meetings'
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Plus className='w-4 h-4' />
            Schedule Meeting
          </Button>
        }
      />

      {/* KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Upcoming
              </p>
              <h3 className='text-2xl font-bold mt-1'>2</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
              <Calendar className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Completed
              </p>
              <h3 className='text-2xl font-bold mt-1'>3</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center'>
              <CheckCircle2 className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Avg Attendance
              </p>
              <h3 className='text-2xl font-bold mt-1'>90%</h3>
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
          onClick={() => setActiveTab('Upcoming')}
          className={cn(
            'flex-1 py-2 rounded-md transition-all text-center',
            activeTab === 'Upcoming'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:bg-background/50'
          )}
        >
          Upcoming (2)
        </button>
        <button
          onClick={() => setActiveTab('Past')}
          className={cn(
            'flex-1 py-2 rounded-md transition-all text-center',
            activeTab === 'Past'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:bg-background/50'
          )}
        >
          Past (3)
        </button>
      </div>

      {/* List */}
      <div className='space-y-4'>
        {mockMeetings.map(meeting => (
          <Card
            key={meeting.id}
            className='overflow-hidden hover:shadow-sm transition-shadow'
          >
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-lg'>{meeting.title}</h3>
                    {meeting.status === 'Upcoming' && (
                      <Badge
                        variant='outline'
                        className='bg-blue-50 text-blue-700 border-blue-200'
                      >
                        Upcoming
                      </Badge>
                    )}
                  </div>

                  <div className='space-y-2 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      {meeting.date}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='w-4 h-4' />
                      {meeting.time}
                    </div>
                    <div className='flex items-center gap-2'>
                      {meeting.type === 'Virtual' ? (
                        <Video className='w-4 h-4' />
                      ) : (
                        <MapPin className='w-4 h-4' />
                      )}
                      {meeting.location}
                    </div>
                  </div>
                </div>

                <div className='flex gap-2 mt-2 md:mt-0'>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <Eye className='w-4 h-4' />
                    View Details
                  </Button>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <Edit2 className='w-4 h-4' />
                    Edit
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10 gap-2'
                  >
                    <Trash2 className='w-4 h-4' />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {mockMeetings.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>
            No meetings found.
          </div>
        )}
      </div>
    </div>
  );
}
