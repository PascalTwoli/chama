import { useState } from 'react';
import { Copy, UserPlus, Mail, Link as LinkIcon, X } from 'lucide-react';
import { Button } from 'primereact/button';
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
    <div className='p-6 text-white min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-base font-bold m-0'>Invite Members</h2>
          <p className='text-sm text-gray-400 m-0'>
            Grow your chama by inviting new members
          </p>
        </div>
        <Button className='bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-400 border-none'>
          <UserPlus size={16} /> Add member Directly
        </Button>
      </div>

      {/* Select Chama */}
      <div className='bg-primarybg border1 rounded-xl mb-6'>
        <div className='select-chama-header'>
          <h3 className='text-sm p-3 m-0'>Select chama</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4  p-2'>
          <div className='flex flex-row items-start justify-between border1 p-3 rounded-lg'>
            <div className=' '>
              <p className='font-semibold m-0 text-base text-default'>
                Family Saving Chama
              </p>
              <p className='text-sm text-gray-400 m-0'>
                8 Members. Ksh 35,000 total
              </p>
              <p className='text-success text-sm m-0 mt-2'>Admin access</p>
            </div>
            <Button className='bg-[#54B68526] border-none rounded-full text-success font-normal'>
              Active
            </Button>
          </div>

          <div className='flex flex-row items-start justify-between border1 p-3 rounded-lg'>
            <div className=''>
              <p className='font-semibold m-0 text-base text-default'>
                Business Investment Club
              </p>
              <p className='text-sm text-gray-400 m-0'>
                12 Members. Ksh 102,300 total
              </p>
              <p className='text-success text-sm m-0 mt-2'>Admin access</p>
            </div>
            <Button className='bg-[#54B68526] border-none rounded-full text-success font-normal'>
              Active
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        {/* Email Invitation */}
        <div className='bg-primarybg rounded-xl border1'>
          <h3 className='flex items-center border2 gap-2 m-0 mb-4 p-4 font-semibold text-sm'>
            <Mail className='text-secondary1' size={16} /> E-mail invitation
          </h3>
          <div className='p-4'>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter email address'
              className='w-full p-3 mb-3 rounded bg-inherit border-none input-border placeholder:text-gray-400 focus:outline-secondary1'
            />
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder='Add a personal message to your invitation'
              className='w-full p-3 mb-3 rounded bg-inherit input-border placeholder:text-gray-400 focus:outline-secondary1'
            ></textarea>
            <Button className='w-full bg-secondary border-none text-white py-2 rounded hover:bg-sky-500'>
              Send Email Invitation
            </Button>
          </div>
        </div>

        {/* Invitation Link */}
        <div className='bg-primarybg p-4 rounded-xl border1'>
          <h3 className='flex items-center gap-2 m-0 mb-4 font-semibold text-sm'>
            <LinkIcon className='text-secondary1' size={16} /> Invitation link
          </h3>
          <div className='invitation-link flex items-center rounded mb-3 text-default border1 hover:text-white'>
            <input
              type='text'
              readOnly
              value='https://chamaplus.com/invite/family-saving/chama'
              className='bg-transparent w-full border-none focus:outline-none p-3 text-default hover:text-white hover:border-white'
            />
            <i className=' bi bi-copy copy-link-icon cursor-pointer px-3 py-2 hover:text-white hover:border-white border-left bg-gray-700 rounded-tr rounded-br'></i>
          </div>
          <div className='flex gap-2'>
            <button className='flex gap-2 bg-green-600 text-white px-2 py-1 rounded'>
              <i className='bi bi-whatsapp'></i>
              WhatsApp
            </button>
            <button className='flex gap-2 bg-cyan-600 text-white px-2 py-1 rounded'>
              <i className='bi bi-telegram'></i>
              Telegram
            </button>
            <button className='flex gap-2 bg-teal-600 text-white px-2 py-1 rounded'>
              <i className='bi bi-twitter-x'></i>
              Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Pending Invitations */}
      <div className='bg-primarybg rounded-xl pb-3'>
        <h3 className='font-semibold mb-4 p-4 border2 text-sm'>
          Pending Invitations
        </h3>
        {pendingInvites.map((invite, index) => (
          <div
            key={index}
            className='flex justify-between items-center p-3 border1 mb-3 rounded mx-4'
          >
            <div className='flex items-center gap-3'>
              {invite.type === 'email' ? (
                <div
                  className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-white'
                  style={{ backgroundColor: '#39eb' }} // blue background for email
                >
                  {invite.contact.charAt(0).toUpperCase()}
                </div>
              ) : (
                ProfileTemplate(invite, 10, 10)
              )}
              <div>
                <p className='font-semibold text-sm m-0 text-default'>
                  {invite.contact}
                </p>
                <p className='text-xs text-gray-400 m-0'>
                  Sent {invite.time} via {invite.type}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='bg-[#F7C34426] text-yellow-300 text-xs px-3 py-2 rounded-full'>
                Pending
              </span>
              <button
                className='bg-inherit border-none hover:bg-gray-700 hover:text-red-500 cursor-pointer rounded-full'
                onClick={() => handleRemoveInvite(index)}
              >
                <i className='bi bi-x text-3xl text-default hover:text-red-500 '></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InviteMembers;
