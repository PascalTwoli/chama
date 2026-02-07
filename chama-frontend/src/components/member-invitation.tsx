import { useState } from 'react';
import { Copy, UserPlus, Mail, Link as LinkIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import ProfileTemplate from '../utils/profile-template';

const InviteMembers = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [pendingInvites, setPendingInvites] = useState([
    {
      type: 'email',
      contact: 'felixer.twoli254@gmail.com',
      time: '2 days ago',
      avatar: '/assets/avatar1.png',
    },
    {
      type: 'whatsapp',
      contact: '+254759981287',
      time: 'days ago',
      avatar: '/assets/avatar2.png',
    },
  ]);

  const handleRemoveInvite = (index: number) => {
    setPendingInvites(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='p-6 text-foreground min-h-screen bg-background'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-base font-bold m-0 text-foreground'>
            Invite Members
          </h2>
          <p className='text-sm text-muted-foreground m-0'>
            Grow your chama by inviting new members
          </p>
        </div>
        <Button className='gap-2'>
          <UserPlus className='w-4 h-4' />
          Add member Directly
        </Button>
      </div>

      {/* Select Chama */}
      <div className='bg-card border border-border rounded-xl mb-6'>
        <div className='border-b border-border'>
          <h3 className='text-sm p-4 m-0 text-foreground font-semibold'>
            Select chama
          </h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
          <div className='flex flex-row items-start justify-between border border-border p-4 rounded-lg bg-muted/50'>
            <div>
              <p className='font-semibold m-0 text-base text-foreground'>
                Family Saving Chama
              </p>
              <p className='text-sm text-muted-foreground m-0'>
                8 Members. Ksh 35,000 total
              </p>
              <p className='text-success text-sm m-0 mt-2'>Admin access</p>
            </div>
            <span className='bg-success/20 border-none rounded-full text-success font-normal px-3 py-1 text-sm'>
              Active
            </span>
          </div>

          <div className='flex flex-row items-start justify-between border border-border p-4 rounded-lg bg-muted/50'>
            <div>
              <p className='font-semibold m-0 text-base text-foreground'>
                Business Investment Club
              </p>
              <p className='text-sm text-muted-foreground m-0'>
                12 Members. Ksh 102,300 total
              </p>
              <p className='text-success text-sm m-0 mt-2'>Admin access</p>
            </div>
            <span className='bg-success/20 border-none rounded-full text-success font-normal px-3 py-1 text-sm'>
              Active
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        {/* Email Invitation */}
        <div className='bg-card border border-border rounded-xl'>
          <h3 className='flex items-center border-b border-border gap-2 m-0 p-4 font-semibold text-sm text-foreground'>
            <Mail className='text-primary w-4 h-4' />
            E-mail invitation
          </h3>
          <div className='p-4'>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter email address'
              className='w-full p-3 mb-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            />
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder='Add a personal message to your invitation'
              className='w-full p-3 mb-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none'
            ></textarea>
            <Button className='w-full'>Send Email Invitation</Button>
          </div>
        </div>

        {/* Invitation Link */}
        <div className='bg-card border border-border p-4 rounded-xl'>
          <h3 className='flex items-center gap-2 m-0 mb-4 font-semibold text-sm text-foreground'>
            <LinkIcon className='text-primary w-4 h-4' />
            Invitation link
          </h3>
          <div className='flex items-center rounded-lg mb-3 border border-border overflow-hidden'>
            <input
              type='text'
              readOnly
              value='https://chamaplus.com/invite/family-saving/chama'
              className='bg-muted w-full border-none focus:outline-none p-3 text-foreground'
            />
            <button className='px-3 py-3 bg-muted hover:bg-primary/10 transition-colors border-l border-border'>
              <Copy className='w-4 h-4 text-muted-foreground' />
            </button>
          </div>
          <div className='flex gap-2'>
            <button className='flex gap-2 items-center bg-success hover:bg-success/90 text-success-foreground px-3 py-2 rounded-lg transition-colors'>
              <i className='bi bi-whatsapp'></i>
              WhatsApp
            </button>
            <button className='flex gap-2 items-center bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg transition-colors'>
              <i className='bi bi-telegram'></i>
              Telegram
            </button>
            <button className='flex gap-2 items-center bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg transition-colors border border-border'>
              <i className='bi bi-twitter-x'></i>
              Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Pending Invitations */}
      <div className='bg-card border border-border rounded-xl'>
        <h3 className='font-semibold p-4 border-b border-border text-sm text-foreground m-0'>
          Pending Invitations
        </h3>
        <div className='p-4 space-y-3'>
          {pendingInvites.map((invite, index) => (
            <div
              key={index}
              className='flex justify-between items-center p-3 border border-border rounded-lg bg-muted/50'
            >
              <div className='flex items-center gap-3'>
                {invite.type === 'email' ? (
                  <div className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary-foreground bg-primary'>
                    {invite.contact.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  ProfileTemplate(invite, 10, 10)
                )}
                <div>
                  <p className='font-semibold text-sm m-0 text-foreground'>
                    {invite.contact}
                  </p>
                  <p className='text-xs text-muted-foreground m-0'>
                    Sent {invite.time} via {invite.type}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='bg-accent/20 text-accent text-xs px-3 py-2 rounded-full'>
                  Pending
                </span>
                <button
                  className='p-1 hover:bg-destructive/10 rounded-full transition-colors'
                  onClick={() => handleRemoveInvite(index)}
                >
                  <X className='w-5 h-5 text-muted-foreground hover:text-destructive' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
