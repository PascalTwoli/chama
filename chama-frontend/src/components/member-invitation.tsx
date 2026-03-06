/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Copy, QrCode, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
import { useParams } from 'react-router-dom';
import ChamaService from '../services/chama/chama-services';
import { toast } from 'react-toastify';
import { useEffect, useCallback } from 'react';

interface PendingInvite {
  id: string;
  email?: string;
  sentToEmail?: string;
  sent_to_email?: string; // Backend returns snake_case
  status: string;
  createdAt: string;
}

// Helper to get email from invite (handles both snake_case and camelCase)
const getInviteEmail = (invite: PendingInvite): string => {
  return invite.sentToEmail || invite.sent_to_email || invite.email || '';
};

const InviteMembers = () => {
  const { chamaId } = useParams<{ chamaId: string }>();
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitesLoading, setInvitesLoading] = useState(true);

  // Form State
  const [email, setEmail] = useState('');

  // Pending Invites Data
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  const fetchPendingInvites = useCallback(async () => {
    try {
      if (!chamaId) return;
      setInvitesLoading(true);
      const invites = await ChamaService.listPendingInvites(chamaId);
      setPendingInvites(invites);
    } catch (error) {
      console.error('Failed to fetch invites', error);
      toast.error('Failed to load pending invites');
    } finally {
      setInvitesLoading(false);
    }
  }, [chamaId]);

  useEffect(() => {
    if (chamaId) {
      fetchPendingInvites();
    }
  }, [chamaId, fetchPendingInvites]);

  const handleGenerateLink = async () => {
    if (!chamaId) {
      toast.error('Chama ID is missing');
      return;
    }

    try {
      setLoading(true);
      console.log('Generating link for chamaId:', chamaId);
      const response = await ChamaService.generateShareableLink(chamaId);
      console.log('Response from generateShareableLink:', response);
      const link = response.inviteLink;
      console.log('Invite link:', link);
      if (link) {
        setInviteLink(link);
        // Copy to clipboard immediately
        await navigator.clipboard.writeText(link);
        toast.success('Link generated and copied to clipboard!');
      } else {
        toast.error('No invite link returned from server');
      }
    } catch (error) {
      console.error('Failed to generate link', error);
      toast.error('Failed to generate invite link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!chamaId) {
      toast.error('Chama ID is missing');
      return;
    }

    // If link already exists, just copy it
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast.success('Link copied to clipboard!');
      return;
    }

    // Otherwise, generate and copy
    await handleGenerateLink();
  };

  const handleCreateInvite = async () => {
    if (!email || !chamaId) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      const response = await ChamaService.createInvite(chamaId, email);
      toast.success(`Invitation sent to ${email}`);
      setInviteLink(response.inviteLink);
      setEmail('');
      fetchPendingInvites();
    } catch (error) {
      console.error('Failed to create invite', error);
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 space-y-6 max-w-[1600px] mx-auto'>
      <PageHeader
        title='Invite Member'
        subtitle='Add new members to Tumaini Chama'
        showBackButton
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Forms */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Share Invite Link */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Share Invite Link
              </CardTitle>
              <p className='text-sm text-muted-foreground m-0'>
                Anyone with this link can join your Chama
              </p>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <Input
                    readOnly
                    value={inviteLink}
                    placeholder='Click "Copy Link" to generate and copy'
                    className='pr-20'
                  />
                </div>
                <Button
                  onClick={handleCopyLink}
                  disabled={loading}
                  className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'
                >
                  {loading ? (
                    <span className='animate-spin'>⌛</span>
                  ) : (
                    <Copy className='w-4 h-4' />
                  )}
                  Copy Link
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Button variant='outline' className='justify-start gap-2 h-10'>
                  <i className='bi bi-whatsapp text-green-600 text-lg'></i>
                  Share via WhatsApp
                </Button>
                <Button variant='outline' className='justify-start gap-2 h-10'>
                  <QrCode className='w-4 h-4 text-blue-600' />
                  Generate QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Send Personal Invite */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Send Personal Invite
              </CardTitle>
              <p className='text-sm text-muted-foreground m-0'>
                Invite a specific person via Email
              </p>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Email Address</label>
                <Input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='jane@example.com'
                />
              </div>

              <div className='pt-2'>
                <Button
                  disabled={loading}
                  onClick={handleCreateInvite}
                  className='bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto'
                >
                  {loading ? (
                    <span className='animate-spin'>⌛</span>
                  ) : (
                    <Mail className='w-4 h-4' />
                  )}
                  Send Email Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Pending Invitations
              </CardTitle>
              <p className='text-sm text-muted-foreground m-0'>
                Track sent invites and their status
              </p>
            </CardHeader>
            <CardContent>
              {invitesLoading ? (
                <div className='text-center py-4 text-muted-foreground'>
                  Loading...
                </div>
              ) : pendingInvites.length === 0 ? (
                <div className='text-center py-4 text-muted-foreground'>
                  No pending invites
                </div>
              ) : (
                <div className='space-y-3'>
                  {pendingInvites.map(invite => {
                    const emailDisplay = getInviteEmail(invite);
                    return (
                      <div
                        key={invite.id}
                        className='flex items-center justify-between p-3 border border-border rounded-lg bg-card'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-sm text-gray-600uppercase'>
                            {(emailDisplay || '??')
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className='font-semibold text-sm m-0'>
                              {emailDisplay || 'Unknown'}
                            </p>
                            <p className='text-xs text-muted-foreground m-0'>
                              Invited on{' '}
                              {new Date(invite.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <Badge
                            variant='secondary'
                            className='mb-1 font-normal text-[10px] px-2'
                          >
                            Pending
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Tips */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Invitation Tips */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Invitation Tips
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Verify Members</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Ensure you know the person before inviting
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>
                    WhatsApp Works Best
                  </p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Most members respond quickly via WhatsApp
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Link Expires</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Invitation links are valid for 7 days
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <CheckCircle2 className='w-5 h-5 text-blue-500 shrink-0' />
                <div>
                  <p className='text-sm font-semibold m-0'>Follow Up</p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Remind members to accept invites
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Stats */}
          <Card className='border border-border shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold m-0'>
                Current Stats
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Total Members
                </p>
                <p className='text-2xl font-bold m-0'>24</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Pending Invites
                </p>
                <p className='text-2xl font-bold m-0'>3</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground m-0'>
                  Joined This Month
                </p>
                <p className='text-2xl font-bold m-0'>2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
