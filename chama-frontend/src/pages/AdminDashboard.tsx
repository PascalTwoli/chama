import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import {
  Bell,
  Plus,
  Users,
  ArrowRight,
  Smartphone,
  UserPlus,
} from 'lucide-react';
import { link } from 'fs';
import { useNavigate, useParams } from 'react-router-dom';
import { EventHandler } from 'react';

export default function AdminDashboard() {
  const { chamaId } = useParams<{ chamaId: string }>();
  const navigate = useNavigate();

  return (
    <div className='p-6 text-white min-h-screen'>
      {/* Top Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-[#8C9095]'>
        <div className='admin-head-stats flex items-center gap-4 bg-primarybg border border-[2px] px-2 py-2 rounded-lg '>
          <div className='bg-[#BEC0C5] w-[40px] h-[35px] flex items-center justify-center rounded-xl'>
            <i className='bi bi-people-fill text-[#4084B9] text-2xl'></i>
          </div>
          <div>
            <p className='text-sm  m-0 '>Total Members</p>
            <p className='font-bold text-sm m-0 '>25</p>
          </div>
        </div>
        <div className='admin-head-stats flex items-center gap-4 bg-[#242E3B4D] border border-[2px] px-2 py-1 rounded-lg'>
          <div className='bg-[#BEC0C5] w-[40px] h-[35px] flex items-center justify-center rounded-xl'>
            <i className='bi bi-credit-card text-[#4084B9] text-2xl'></i>
          </div>
          <div>
            <p className='text-sm m-0'>Total Contributions</p>
            <p className='font-bold text-sm m-0'>Ksh 200,000</p>
          </div>
        </div>
        <div className='admin-head-stats flex items-center gap-4 bg-[#242E3B4D] px-2 py-1 rounded-lg'>
          <div className='bg-[#BEC0C5] w-[40px] h-[35px] flex items-center justify-center rounded-xl'>
            <i className='bi bi-activity text-[#4084B9] text-2xl'></i>
          </div>
          <div>
            <p className='text-sm m-0'>Upcoming Activities</p>
            <p className='font-bold text-sm m-0'>3</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* My Chamas */}
        <div className='chamas-container col-span-2 bg-primarybg rounded-xl'>
          <div className='chamas-container-header flex justify-between items-center mb-4  py-2 px-3'>
            <h2 className='text-white font-bold text-sm'>My Chamas</h2>
            <Button
              onClick={() =>
                // (window.location.href = `/admin/chamas/${chamaId}/invite-member`)
                navigate(`/admin/chamas/${chamaId}/invite-member`)
              }
              className='bg-primary flex gap-2 font-normal justify-between px-2 py-1 rounded hover:bg-blue-500 border-none text-[#FEE9E7]'
            >
              <i className='bi bi-plus text-lg'></i>
              Add Chama
            </Button>
          </div>

          <div className='space-y-4 p-2 text-default'>
            {[
              {
                name: 'Twoli Contribution group',
                members: '12 Members. Monthly contributions',
                total: 'Ksh 50,000',
                status: 'Active',
                color: 'green',
              },
              {
                name: 'Lubanga Gemini',
                members: '8 Members. Weekly contributions',
                total: 'Ksh 22,400',
                status: 'Active',
                color: 'green',
              },
              {
                name: 'Big J Contribution group',
                members: '12 Members. Bi-weekly contributions',
                total: 'Ksh 5,000',
                status: 'Pending',
                color: 'yellow',
              },
            ].map((chama, idx) => (
              <div
                key={idx}
                className=' chamas-div px-2 border border-gray-700 rounded-xl'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-semibold m-0'>{chama.name}</p>
                    <p className='text-sm text-gray-400 m-0'>{chama.members}</p>
                    <p className='text-sm my-2'>
                      Total:{' '}
                      <span className='text-green-400'>{chama.total}</span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${chama.status === 'Active' ? 'bg-[#54B68526] text-[#54B685]' : 'bg-[#F7C34426] text-[#F7C344]'}`}
                  >
                    {chama.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='quick-actions-div bg-primarybg rounded-xl'>
          <h2 className='quick-actions-head text-white font-bold text-sm m-0 p-5 mb-4'>
            Quick actions
          </h2>
          <div className='space-y-4 p-2 text-default'>
            <div className='quick-action-btn flex items-center justify-between p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <Smartphone className='text-blue-400' size={26} />
                <span>Make M-pesa Payment</span>
              </div>
              <i className='bi bi-chevron-right'></i>
            </div>
            <div className='quick-action-btn flex items-center justify-between p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <UserPlus className='text-blue-400' size={26} />
                <span>Invite members</span>
              </div>
              <i className='bi bi-chevron-right'></i>
            </div>
            <div className='quick-action-btn flex items-center justify-between p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <Bell className='text-blue-400' size={26} />
                <span>View Notifications</span>
              </div>
              <i className='bi bi-chevron-right'></i>
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <Card className='bg-primarybg p-0 mt-5'>
        <h2 className='text-lg font-semibold m-0 mb-4'>Activities</h2>
        <div className='space-y-3 text-default'>
          <div className='flex justify-between items-start'>
            <div className='flex gap-3 items-start'>
              <div className='bg-[#FCB92C1A] text-[#F7C344] p-2 rounded '>
                <Bell className='w-4 h-4' />
              </div>
              <div>
                <p className='font-semibold m-0'>Upcoming meeting</p>
                <p className='text-sm m-0'>Lubanga Gemini. Meeting reminder</p>
              </div>
            </div>
            <p className='text-sm whitespace-nowrap'>Thur 23/07/2025</p>
          </div>
          <div className='flex justify-between items-start'>
            <div className='flex gap-3 items-start'>
              <div className='bg-[#54B68533] p-2 rounded text-success'>
                <ArrowRight className='w-4 h-4 ' />
              </div>
              <div>
                <p className='font-semibold m-0'>Contribution Received</p>
                <p className='text-sm m-0'>
                  Twoli contribution group. Ksh 3,400
                </p>
              </div>
            </div>
            <p className='text-sm whitespace-nowrap'>2 hours ago</p>
          </div>
          <div className='flex justify-between items-start'>
            <div className='flex gap-3 items-start'>
              <div className='bg-[#4084B933] p-2 rounded text-blue-400'>
                <Users className='w-4 h-4 ' />
              </div>
              <div>
                <p className='font-semibold m-0'>New member joined</p>
                <p className='text-sm m-0'>
                  Big J Contribution group. Felix Twoli
                </p>
              </div>
            </div>
            <p className='text-sm whitespace-nowrap'>1 day ago</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
