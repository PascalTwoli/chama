import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Plus,
  Send,
  Pin,
  MessageSquare,
  Bell,
  Users,
  Calendar,
  Edit,
  Trash2,
  Phone
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { toast } from 'sonner';

interface CommunicationPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  date: string;
  pinned: boolean;
  category: 'general' | 'meeting' | 'contribution' | 'urgent';
}

interface SMSMessage {
  id: string;
  subject: string;
  message: string;
  sentBy: string;
  sentDate: string;
  recipients: number;
  status: 'sent' | 'scheduled' | 'failed';
}

export default function CommunicationPage({ onBack, role }: CommunicationPageProps) {
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [showSendSMS, setShowSendSMS] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    category: 'general' as Announcement['category'],
    pinned: false
  });
  const [newSMS, setNewSMS] = useState({
    subject: '',
    message: '',
    recipients: 'all' as 'all' | 'admins' | 'custom',
    scheduleDate: ''
  });

  // Mock data
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Important: Next Month Contribution Deadline',
      message: 'Dear members, please note that February contributions are due by 5th February 2026. Late payment penalties will apply after the grace period.',
      author: 'John Kamau',
      date: '2026-01-17',
      pinned: true,
      category: 'contribution'
    },
    {
      id: '2',
      title: 'Monthly Meeting - February 2026',
      message: 'Our next monthly general meeting is scheduled for Saturday, 5th February 2026 at 2:00 PM at the Community Hall. Agenda includes contribution review and new investment proposals. Your attendance is important!',
      author: 'Sarah Njeri',
      date: '2026-01-15',
      pinned: true,
      category: 'meeting'
    },
    {
      id: '3',
      title: 'New Member Welcome',
      message: 'We are pleased to welcome Paul Kiptoo to Tumaini Chama! Paul has been a friend of the group for some time and we look forward to growing together.',
      author: 'John Kamau',
      date: '2026-01-14',
      pinned: false,
      category: 'general'
    },
    {
      id: '4',
      title: 'Investment Update - Treasury Bonds',
      message: 'Great news! Our investment in treasury bonds has yielded a 8.5% return. The Treasurer will present a detailed report at the next meeting.',
      author: 'Mary Wanjiku',
      date: '2026-01-12',
      pinned: false,
      category: 'general'
    },
    {
      id: '5',
      title: 'URGENT: Emergency Loan Approved',
      message: 'The committee has approved an emergency loan of KSh 30,000 to Peter Ochieng for medical expenses. All members please note this will affect our available loan capital.',
      author: 'John Kamau',
      date: '2026-01-10',
      pinned: false,
      category: 'urgent'
    }
  ];

  const smsHistory: SMSMessage[] = [
    {
      id: '1',
      subject: 'Meeting Reminder',
      message: 'Reminder: Monthly meeting tomorrow at 2PM, Community Hall. Please confirm attendance.',
      sentBy: 'Sarah Njeri',
      sentDate: '2026-02-04',
      recipients: 10,
      status: 'sent'
    },
    {
      id: '2',
      subject: 'Contribution Due',
      message: 'Your monthly contribution of KSh 5,000 is due by 5th Feb. Mpesa Paybill 123456, Account: TUMAINI',
      sentBy: 'Mary Wanjiku',
      sentDate: '2026-02-01',
      recipients: 10,
      status: 'sent'
    },
    {
      id: '3',
      subject: 'Happy New Year 2026',
      message: 'Tumaini Chama wishes all members a prosperous 2026! Looking forward to achieving our goals together.',
      sentBy: 'John Kamau',
      sentDate: '2026-01-01',
      recipients: 10,
      status: 'sent'
    }
  ];

  const categoryColors = {
    general: 'bg-primary/10 text-primary border-primary/20',
    meeting: 'bg-accent/10 text-accent border-accent/20',
    contribution: 'bg-secondary/10 text-secondary border-secondary/20',
    urgent: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const statusColors = {
    sent: 'bg-secondary/10 text-secondary border-secondary/20',
    scheduled: 'bg-accent/10 text-accent border-accent/20',
    failed: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Announcement posted successfully!');
    setShowNewAnnouncement(false);
    setNewAnnouncement({
      title: '',
      message: '',
      category: 'general',
      pinned: false
    });
  };

  const handleSendSMS = () => {
    if (!newSMS.subject || !newSMS.message) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newSMS.scheduleDate) {
      toast.success('SMS scheduled successfully!');
    } else {
      toast.success('SMS sent to all members!');
    }
    setShowSendSMS(false);
    setNewSMS({
      subject: '',
      message: '',
      recipients: 'all',
      scheduleDate: ''
    });
  };

  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);

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
            <h1 className="text-2xl font-bold">Communication</h1>
            <p className="text-sm text-muted-foreground">Announcements and SMS broadcast</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SMS Sent (Month)</p>
                <p className="text-2xl font-bold">{smsHistory.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">10</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="sms">SMS Broadcast</TabsTrigger>
        </TabsList>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-end">
            {role === 'admin' && (
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowNewAnnouncement(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            )}
          </div>

          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Pinned Announcements</h3>
              </div>
              {pinnedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={categoryColors[announcement.category]}>
                              {announcement.category === 'general' && <MessageSquare className="w-3 h-3 mr-1" />}
                              {announcement.category === 'meeting' && <Calendar className="w-3 h-3 mr-1" />}
                              {announcement.category === 'contribution' && <Bell className="w-3 h-3 mr-1" />}
                              {announcement.category === 'urgent' && <Bell className="w-3 h-3 mr-1" />}
                              {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                            </Badge>
                            <Pin className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-bold text-lg mb-2">{announcement.title}</h4>
                          <p className="text-muted-foreground">{announcement.message}</p>
                        </div>
                        {role === 'admin' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
                        <span>Posted by {announcement.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(announcement.date).toLocaleDateString('en-KE', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Regular Announcements */}
          <div className="space-y-4">
            {pinnedAnnouncements.length > 0 && (
              <h3 className="font-bold">All Announcements</h3>
            )}
            {regularAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Badge variant="outline" className={`${categoryColors[announcement.category]} mb-2`}>
                          {announcement.category === 'general' && <MessageSquare className="w-3 h-3 mr-1" />}
                          {announcement.category === 'meeting' && <Calendar className="w-3 h-3 mr-1" />}
                          {announcement.category === 'contribution' && <Bell className="w-3 h-3 mr-1" />}
                          {announcement.category === 'urgent' && <Bell className="w-3 h-3 mr-1" />}
                          {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </Badge>
                        <h4 className="font-bold text-lg mb-2">{announcement.title}</h4>
                        <p className="text-muted-foreground">{announcement.message}</p>
                      </div>
                      {role === 'admin' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
                      <span>Posted by {announcement.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(announcement.date).toLocaleDateString('en-KE', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SMS Broadcast Tab */}
        <TabsContent value="sms" className="space-y-4">
          <div className="flex justify-end">
            {role === 'admin' && (
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowSendSMS(true)}>
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SMS History</CardTitle>
              <CardDescription>Messages sent to members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smsHistory.map((sms) => (
                  <div key={sms.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{sms.subject}</h4>
                          <Badge variant="outline" className={statusColors[sms.status]}>
                            {sms.status.charAt(0).toUpperCase() + sms.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{sms.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Sent by {sms.sentBy}</span>
                      <span>•</span>
                      <span>{sms.recipients} recipients</span>
                      <span>•</span>
                      <span>
                        {new Date(sms.sentDate).toLocaleDateString('en-KE', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Announcement Dialog */}
      <Dialog open={showNewAnnouncement} onOpenChange={setShowNewAnnouncement}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Post a new announcement for all members</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                placeholder="e.g., Next Meeting Schedule"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {['general', 'meeting', 'contribution', 'urgent'].map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={newAnnouncement.category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewAnnouncement({...newAnnouncement, category: cat as Announcement['category']})}
                    className={newAnnouncement.category === cat ? categoryColors[cat as Announcement['category']].replace('bg-', 'bg-').replace('/10', '') : ''}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={5}
                placeholder="Write your announcement..."
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="pinned"
                checked={newAnnouncement.pinned}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, pinned: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="pinned" className="text-sm flex items-center gap-2">
                <Pin className="w-4 h-4" />
                Pin this announcement to the top
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handlePostAnnouncement}>
              Post Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send SMS Dialog */}
      <Dialog open={showSendSMS} onOpenChange={setShowSendSMS}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send SMS Broadcast</DialogTitle>
            <DialogDescription>Send SMS to all members or schedule for later</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject *</label>
              <Input
                placeholder="e.g., Meeting Reminder"
                value={newSMS.subject}
                onChange={(e) => setNewSMS({...newSMS, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Recipients *</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={newSMS.recipients === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewSMS({...newSMS, recipients: 'all'})}
                >
                  All (10)
                </Button>
                <Button
                  type="button"
                  variant={newSMS.recipients === 'admins' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewSMS({...newSMS, recipients: 'admins'})}
                >
                  Admins (4)
                </Button>
                <Button
                  type="button"
                  variant={newSMS.recipients === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewSMS({...newSMS, recipients: 'custom'})}
                >
                  Custom
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message * (160 characters max)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
                maxLength={160}
                placeholder="Type your SMS message..."
                value={newSMS.message}
                onChange={(e) => setNewSMS({...newSMS, message: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newSMS.message.length}/160 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Schedule (Optional)</label>
              <Input
                type="datetime-local"
                value={newSMS.scheduleDate}
                onChange={(e) => setNewSMS({...newSMS, scheduleDate: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to send immediately
              </p>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm font-medium mb-1">Estimated Cost</p>
              <p className="text-2xl font-bold">KSh 10</p>
              <p className="text-xs text-muted-foreground">10 recipients × KSh 1.00 per SMS</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendSMS(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSendSMS}>
              <Send className="w-4 h-4 mr-2" />
              {newSMS.scheduleDate ? 'Schedule SMS' : 'Send Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
