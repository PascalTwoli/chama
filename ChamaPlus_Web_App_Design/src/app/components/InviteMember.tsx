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
  Copy,
  Send,
  CheckCircle2,
  Link as LinkIcon,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface InviteMemberProps {
  onBack: () => void;
}

export default function InviteMember({ onBack }: InviteMemberProps) {
  const [inviteLink] = useState(
    'https://chamaplus.app/join/tumaini-chama-xyz123'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const sendViaWhatsApp = () => {
    const message = `Hi! You've been invited to join Tumaini Chama on ChamaPlus. Click here to join: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendViaSMS = () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }
    toast.success('SMS invitation sent successfully!');
    // In real app, this would call SMS API
  };

  const sendViaEmail = () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success('Email invitation sent successfully!');
    // In real app, this would call email API
  };

  const pendingInvites = [
    {
      id: 1,
      name: 'Jane Kamau',
      phone: '0712345678',
      sentDate: 'Jan 10, 2026',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Michael Ochieng',
      phone: '0723456789',
      sentDate: 'Jan 8, 2026',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Lucy Adhiambo',
      phone: '0734567890',
      sentDate: 'Jan 5, 2026',
      status: 'expired',
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
          <h1 className="text-2xl font-bold">Invite Member</h1>
          <p className="text-sm text-muted-foreground">
            Add new members to Tumaini Chama
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Invite Link */}
          <Card>
            <CardHeader>
              <CardTitle>Share Invite Link</CardTitle>
              <CardDescription>
                Anyone with this link can join your Chama
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-2 border rounded-lg bg-muted text-sm"
                />
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={sendViaWhatsApp}
                  variant="outline"
                  className="justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                  Share via WhatsApp
                </Button>
                <Button variant="outline" className="justify-start">
                  <LinkIcon className="w-4 h-4 mr-2 text-primary" />
                  Generate QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Send Personal Invite */}
          <Card>
            <CardHeader>
              <CardTitle>Send Personal Invite</CardTitle>
              <CardDescription>
                Invite a specific person via SMS or Email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Kamau"
                  className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm">
                    Email (Optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={sendViaSMS}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send SMS Invite
                </Button>
                <Button onClick={sendViaEmail} variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invites */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Track sent invites and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingInvites.map(invite => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-bold text-muted-foreground text-sm">
                          {invite.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{invite.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {invite.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          invite.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {invite.status === 'pending' ? 'Pending' : 'Expired'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {invite.sentDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Verify Members</p>
                  <p className="text-xs text-muted-foreground">
                    Ensure you know the person before inviting
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">WhatsApp Works Best</p>
                  <p className="text-xs text-muted-foreground">
                    Most members respond quickly via WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Link Expires</p>
                  <p className="text-xs text-muted-foreground">
                    Invitation links are valid for 7 days
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Follow Up</p>
                  <p className="text-xs text-muted-foreground">
                    Remind members to accept invites
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Joined This Month
                </p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
