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
  Calendar,
  Clock,
  MapPin,
  Users,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleMeetingProps {
  onBack: () => void;
}

export default function ScheduleMeeting({ onBack }: ScheduleMeetingProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [sendReminder, setSendReminder] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Meeting scheduled successfully! Members will be notified.');
    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setAgenda('');
  };

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Monthly Meeting - January',
      date: 'Jan 15, 2026',
      time: '6:00 PM',
      location: 'Community Hall, Kileleshwa',
      attendees: 22,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Emergency Meeting',
      date: 'Jan 20, 2026',
      time: '7:00 PM',
      location: 'Online (Zoom)',
      attendees: 18,
      status: 'upcoming',
    },
  ];

  const pastMeetings = [
    {
      id: 3,
      title: 'Monthly Meeting - December',
      date: 'Dec 15, 2025',
      time: '6:00 PM',
      location: 'Community Hall, Kileleshwa',
      attendees: 24,
      status: 'completed',
    },
    {
      id: 4,
      title: 'Year End Review',
      date: 'Dec 28, 2025',
      time: '5:00 PM',
      location: 'Online (Zoom)',
      attendees: 20,
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Schedule Meeting</h1>
          <p className="text-sm text-muted-foreground">
            Plan and notify members about upcoming meetings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New Meeting</CardTitle>
            <CardDescription>Fill in the meeting details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm">
                  Meeting Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Monthly Meeting - January"
                  className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="date"
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="time"
                      type="time"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="location"
                    type="text"
                    placeholder="Community Hall, Kileleshwa"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="agenda" className="text-sm">
                  Meeting Agenda (Optional)
                </label>
                <textarea
                  id="agenda"
                  placeholder="1. Opening prayer&#10;2. Review previous minutes&#10;3. Financial report&#10;4. New business&#10;5. AOB"
                  className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={6}
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="sendReminder"
                  checked={sendReminder}
                  onChange={e => setSendReminder(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="sendReminder" className="text-sm">
                  Send SMS reminder to all members (recommended)
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pick Convenient Times</p>
                  <p className="text-xs text-muted-foreground">
                    Evening meetings work best for most members
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Clear Location</p>
                  <p className="text-xs text-muted-foreground">
                    Include landmarks or Google Maps link
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Prepare Agenda</p>
                  <p className="text-xs text-muted-foreground">
                    Share agenda in advance for better meetings
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Regular Schedule</p>
                  <p className="text-xs text-muted-foreground">
                    Same day each month helps attendance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Next Meeting</p>
                <p className="text-lg font-bold">Jan 15, 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                <p className="text-lg font-bold">92%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Meetings This Year
                </p>
                <p className="text-lg font-bold">2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>
            Scheduled meetings for the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {meeting.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{meeting.attendees}/24</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Past Meetings</CardTitle>
          <CardDescription>
            Meeting history and attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border gap-3 opacity-75"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Completed
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {meeting.attendees} attended
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
