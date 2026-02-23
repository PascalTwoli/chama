import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';

// Mock Data
const upcomingMeetings = [
  {
    id: 1,
    title: 'Monthly Meeting - January',
    date: 'Jan 15, 2026',
    time: '6:00 PM',
    location: 'Community Hall, Kileleshwa',
    attendance: '22/24',
  },
  {
    id: 2,
    title: 'Emergency Meeting',
    date: 'Jan 20, 2026',
    time: '7:00 PM',
    location: 'Online (Zoom)',
    attendance: '18/24',
  },
];

const pastMeetings = [
  {
    id: 3,
    title: 'Monthly Meeting - December',
    date: 'Dec 15, 2025',
    time: '6:00 PM',
    status: 'Completed',
    attended: 24,
  },
  {
    id: 4,
    title: 'Year End Review',
    date: 'Dec 28, 2025',
    time: '5:00 PM',
    status: 'Completed',
    attended: 20,
  },
];

export default function ScheduleMeetingPage() {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('Monthly Meeting - January');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Community Hall, Kileleshwa');
  const [agenda, setAgenda] = useState('');
  const [sendReminder, setSendReminder] = useState(true);

  return (
    <div className='p-6 space-y-6 max-w-[1600px] mx-auto'>
      <PageHeader
        title='Schedule Meeting'
        subtitle='Plan and notify members about upcoming meetings'
        showBackButton
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Form & Lists */}
        <div className='lg:col-span-2 space-y-6'>
          {/* New Meeting Form */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                New Meeting
              </CardTitle>
              <p className='text-sm text-muted-foreground m-0'>
                Fill in the meeting details
              </p>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Meeting Title *</label>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder='e.g. Monthly General Meeting'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Date *</label>
                  <div className='relative'>
                    <Input
                      type='date'
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className='pl-9'
                    />
                    <Calendar className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Time *</label>
                  <div className='relative'>
                    <Input
                      type='time'
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className='pl-9'
                    />
                    <Clock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Location *</label>
                <div className='relative'>
                  <Input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className='pl-9'
                    placeholder='Enter location or meeting link'
                  />
                  <MapPin className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Meeting Agenda (Optional)
                </label>
                <textarea
                  className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none'
                  placeholder='1. Opening prayer&#10;2. Review previous minutes&#10;3. Financial report...'
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                />
              </div>

              <div className='flex items-center space-x-2 bg-muted/30 p-3 rounded-lg border border-border'>
                <Checkbox
                  id='reminder'
                  checked={sendReminder}
                  onCheckedChange={(checked: boolean) =>
                    setSendReminder(checked)
                  }
                />
                <label
                  htmlFor='reminder'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Send SMS reminder to all members (recommended)
                </label>
              </div>

              <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white gap-2'>
                <Plus className='w-4 h-4' />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Meetings List */}
          <div>
            <h3 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider'>
              Upcoming Meetings
            </h3>
            <p className='text-xs text-muted-foreground mb-4'>
              Scheduled meetings for the next 30 days
            </p>
            <div className='space-y-3'>
              {upcomingMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  className='bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'
                >
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0'>
                      <Calendar className='w-5 h-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-sm'>{meeting.title}</h4>
                      <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1'>
                        <span className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' /> {meeting.date}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' /> {meeting.time}
                        </span>
                        <span className='flex items-center gap-1'>
                          <MapPin className='w-3 h-3' /> {meeting.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <Users className='w-3 h-3' />
                      {meeting.attendance}
                    </div>
                    <Button variant='outline' size='sm' className='h-8'>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Meetings List */}
          <div>
            <h3 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider'>
              Past Meetings
            </h3>
            <p className='text-xs text-muted-foreground mb-4'>
              Meeting history and attendance records
            </p>
            <div className='space-y-3'>
              {pastMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  className='bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4'
                >
                  <div className='flex items-start gap-4 w-full md:w-auto'>
                    <div className='w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0'>
                      <Calendar className='w-5 h-5' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-sm'>{meeting.title}</h4>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1'>
                        <span className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' /> {meeting.date}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' /> {meeting.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 w-full md:w-auto justify-between'>
                    <Badge
                      variant='success'
                      className='font-normal text-[10px] px-2'
                    >
                      {meeting.status}
                    </Badge>
                    <span className='text-xs text-muted-foreground'>
                      {meeting.attended} attended
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tips & Stats */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Meeting Tips */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Meeting Tips
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>
                    Pick Convenient Times
                  </p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Evening meetings work best for most members
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Clear Location</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Include landmarks or Google Maps link
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Prepare Agenda</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Share agenda in advance for better meetings
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Regular Schedule</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Same day each month helps attendance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Next Meeting
                </p>
                <p className='text-lg font-bold m-0'>Jan 15, 2026</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Avg. Attendance
                </p>
                <p className='text-2xl font-bold m-0'>92%</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Meetings This Year
                </p>
                <p className='text-2xl font-bold m-0'>2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
