import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Video,
  User,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';

interface MeetingsPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'physical' | 'virtual';
  agenda: string[];
  attendees: number;
  totalMembers: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  minutes?: string;
  decisions?: string[];
}

interface Attendee {
  name: string;
  status: 'present' | 'absent' | 'apology';
}

export default function MeetingsPage({ onBack, role }: MeetingsPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock data
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Monthly General Meeting',
      date: '2026-02-05',
      time: '14:00',
      location: 'Community Hall, Nairobi',
      type: 'physical',
      agenda: [
        'Review January contributions',
        'Discuss investment opportunities',
        'Member welfare updates',
        'Any other business'
      ],
      attendees: 0,
      totalMembers: 10,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Emergency Committee Meeting',
      date: '2026-01-25',
      time: '18:00',
      location: 'Zoom Meeting',
      type: 'virtual',
      agenda: [
        'Loan request review',
        'Budget adjustments'
      ],
      attendees: 0,
      totalMembers: 10,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Monthly General Meeting',
      date: '2026-01-05',
      time: '14:00',
      location: 'Community Hall, Nairobi',
      type: 'physical',
      agenda: [
        'Review December contributions',
        'Annual financial report',
        'Election of officials',
        'New year targets'
      ],
      attendees: 9,
      totalMembers: 10,
      status: 'completed',
      minutes: 'Meeting started at 2:00 PM with 9 members present. Reviewed December contributions totaling KSh 50,000. Discussed investment options for accumulated savings. Elections held for secretary position.',
      decisions: [
        'Approved investment of KSh 200,000 in treasury bonds',
        'Elected Mary Wanjiku as new secretary',
        'Set monthly target at KSh 5,000 per member',
        'Scheduled next meeting for February 5th'
      ]
    },
    {
      id: '4',
      title: 'End of Year Meeting',
      date: '2025-12-20',
      time: '15:00',
      location: 'Safari Park Hotel',
      type: 'physical',
      agenda: [
        'Year-end financial review',
        'Dividend distribution',
        'Planning for 2026'
      ],
      attendees: 10,
      totalMembers: 10,
      status: 'completed',
      minutes: 'Full attendance achieved. Reviewed entire year performance with total contributions of KSh 600,000. Distributed dividends based on individual contributions.',
      decisions: [
        'Distributed KSh 50,000 in dividends',
        'Approved 2026 budget and targets',
        'Agreed to maintain current contribution model'
      ]
    },
    {
      id: '5',
      title: 'Mid-Year Planning',
      date: '2025-07-15',
      time: '14:00',
      location: 'Community Hall, Nairobi',
      type: 'physical',
      agenda: [
        'H1 performance review',
        'H2 targets setting'
      ],
      attendees: 8,
      totalMembers: 10,
      status: 'completed'
    }
  ];

  const attendees: Attendee[] = [
    { name: 'John Kamau', status: 'present' },
    { name: 'Mary Wanjiku', status: 'present' },
    { name: 'Peter Ochieng', status: 'absent' },
    { name: 'Grace Akinyi', status: 'present' },
    { name: 'David Mwangi', status: 'present' },
    { name: 'Sarah Njeri', status: 'apology' },
    { name: 'James Omondi', status: 'present' },
    { name: 'Anne Chebet', status: 'present' },
    { name: 'Paul Kiptoo', status: 'present' },
    { name: 'Lucy Muthoni', status: 'present' },
  ];

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const pastMeetings = meetings.filter(m => m.status === 'completed' || m.status === 'cancelled');

  const handleViewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowDetails(true);
  };

  const handleViewAttendance = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowAttendance(true);
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    toast.success('Meeting deleted successfully');
    setShowDeleteDialog(false);
    setSelectedMeeting(null);
  };

  const statusColors = {
    upcoming: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-secondary/10 text-secondary border-secondary/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const attendanceColors = {
    present: 'bg-secondary/10 text-secondary border-secondary/20',
    absent: 'bg-destructive/10 text-destructive border-destructive/20',
    apology: 'bg-accent/10 text-accent border-accent/20'
  };

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{meeting.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(meeting.date).toLocaleDateString('en-KE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {meeting.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {meeting.type === 'physical' ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  {meeting.location}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={statusColors[meeting.status]}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </Badge>
          </div>

          {meeting.status === 'completed' && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">{meeting.attendees}</span> / {meeting.totalMembers} members attended
              </span>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(meeting)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {meeting.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewAttendance(meeting)}
              >
                <Users className="w-4 h-4 mr-1" />
                Attendance
              </Button>
            )}
            {role === 'admin' && meeting.status === 'upcoming' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteMeeting(meeting)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Meetings</h1>
            <p className="text-sm text-muted-foreground">Schedule and track Chama meetings</p>
          </div>
        </div>
        {role === 'admin' && (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{pastMeetings.filter(m => m.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">90%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meetings Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upcoming' | 'past')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No upcoming meetings scheduled</p>
                {role === 'admin' && (
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Meeting Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              {selectedMeeting && new Date(selectedMeeting.date).toLocaleDateString('en-KE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMeeting.time}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <Badge variant="outline">
                    {selectedMeeting.type === 'physical' ? (
                      <><MapPin className="w-3 h-3 mr-1" /> Physical</>
                    ) : (
                      <><Video className="w-3 h-3 mr-1" /> Virtual</>
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-medium">{selectedMeeting.location}</p>
              </div>

              {selectedMeeting.status === 'completed' && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedMeeting.attendees} / {selectedMeeting.totalMembers} members
                    </span>
                    <span className="text-muted-foreground">
                      ({Math.round((selectedMeeting.attendees / selectedMeeting.totalMembers) * 100)}%)
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Agenda</p>
                <ul className="space-y-2">
                  {selectedMeeting.agenda.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedMeeting.minutes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Meeting Minutes</p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{selectedMeeting.minutes}</p>
                  </div>
                </div>
              )}

              {selectedMeeting.decisions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Key Decisions</p>
                  <div className="space-y-2">
                    {selectedMeeting.decisions.map((decision, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-secondary/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5" />
                        <span className="text-sm">{decision}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            {selectedMeeting?.status === 'completed' && (
              <Button className="bg-primary hover:bg-primary/90">
                <FileText className="w-4 h-4 mr-2" />
                Download Minutes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={showAttendance} onOpenChange={setShowAttendance}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Attendance</DialogTitle>
            <DialogDescription>
              {selectedMeeting?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {attendees.map((attendee, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{attendee.name}</span>
                </div>
                <Badge variant="outline" className={attendanceColors[attendee.status]}>
                  {attendee.status === 'present' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {attendee.status === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                  {attendee.status === 'apology' && <Clock className="w-3 h-3 mr-1" />}
                  {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttendance(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMeeting?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
