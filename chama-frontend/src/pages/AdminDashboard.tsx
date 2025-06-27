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

export default function AdminDashboard() {
  return (
    // <div className='bg-[#111827] text-white min-h-screen p-8 space-y-8'>
    //   {/* Top Summary Cards */}
    //   <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
    //     <Card className='bg-[#1F2937] p-6'>
    //       <p className='text-sm text-gray-400'>Total Members</p>
    //       <div className='text-2xl font-bold mt-2'>25</div>
    //     </Card>
    //     <Card className='bg-[#1F2937] p-6'>
    //       <p className='text-sm text-gray-400'>Total Contributions</p>
    //       <div className='text-2xl font-bold mt-2'>Ksh 200,000</div>
    //     </Card>
    //     <Card className='bg-[#1F2937] p-6'>
    //       <p className='text-sm text-gray-400'>Upcoming Activities</p>
    //       <div className='text-2xl font-bold mt-2'>3</div>
    //     </Card>
    //   </div>

    //   {/* My Chamas Section */}
    //   <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
    //     <div className='col-span-2'>
    //       <Card className='bg-[#1F2937]'>
    //         <div className='flex justify-between items-center p-6'>
    //           <h2 className='text-lg font-semibold'>My Chamas</h2>
    //           <Button className='bg-blue-600 hover:bg-blue-500 text-white'>
    //             <Plus className='w-4 h-4 mr-2' /> Add Chama
    //           </Button>
    //         </div>
    //         <div className='space-y-4 px-6 pb-6'>
    //           {[
    //             {
    //               name: 'Twoli Contribution group',
    //               members: 12,
    //               frequency: 'Monthly contributions',
    //               total: 'Ksh 50,000',
    //               status: 'Active',
    //               statusColor: 'bg-green-700',
    //             },
    //             {
    //               name: 'Lubanga Gemini',
    //               members: 8,
    //               frequency: 'Weekly contributions',
    //               total: 'Ksh 22,400',
    //               status: 'Active',
    //               statusColor: 'bg-green-700',
    //             },
    //             {
    //               name: 'Big J Contribution group',
    //               members: 12,
    //               frequency: 'Bi-weekly contributions',
    //               total: 'Ksh 5,000',
    //               status: 'Pending',
    //               statusColor: 'bg-yellow-700',
    //             },
    //           ].map((group, i) => (
    //             <div
    //               key={i}
    //               className='bg-[#111827] p-4 rounded border border-gray-700'
    //             >
    //               <div className='flex justify-between'>
    //                 <div>
    //                   <p className='font-semibold'>{group.name}</p>
    //                   <p className='text-sm text-gray-400'>
    //                     {group.members} Members. {group.frequency}
    //                   </p>
    //                   <p className='text-sm text-green-400 mt-1'>
    //                     Total: {group.total}
    //                   </p>
    //                 </div>
    //                 <span
    //                   className={`text-sm px-3 py-1 rounded-full ${group.statusColor} text-white h-fit`}
    //                 >
    //                   {group.status}
    //                 </span>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </Card>
    //     </div>

    //     {/* Quick Actions */}
    //     <Card className='bg-[#1F2937] p-6 h-full'>
    //       <h2 className='text-lg font-semibold mb-4'>Quick actions</h2>
    //       <div className='space-y-4'>
    //         <Button
    //           outlined
    //           className='w-full flex justify-start gap-3 text-white border-gray-700'
    //         >
    //           <ArrowRight className='w-4 h-4' /> Make M-pesa Payment
    //         </Button>
    //         <Button
    //           outlined
    //           className='w-full flex justify-start gap-3 text-white border-gray-700'
    //         >
    //           <Users className='w-4 h-4' /> Invite members
    //         </Button>
    //         <Button
    //           outlined
    //           className='w-full flex justify-start gap-3 text-white border-gray-700'
    //         >
    //           <Bell className='w-4 h-4' /> View Notifications
    //         </Button>
    //       </div>
    //     </Card>
    //   </div>

    //   {/* Activities */}
    //   <Card className='bg-[#1F2937] p-6'>
    //     <h2 className='text-lg font-semibold mb-4'>Activities</h2>
    //     <div className='space-y-3'>
    //       <div className='flex justify-between items-start'>
    //         <div className='flex gap-3 items-start'>
    //           <div className='bg-yellow-600 p-2 rounded'>
    //             <Bell className='w-4 h-4 text-white' />
    //           </div>
    //           <div>
    //             <p className='font-semibold'>Upcoming meeting</p>
    //             <p className='text-sm text-gray-400'>
    //               Lubanga Gemini. Meeting reminder
    //             </p>
    //           </div>
    //         </div>
    //         <p className='text-sm text-gray-400 whitespace-nowrap'>
    //           Thur 23/07/2025
    //         </p>
    //       </div>
    //       <div className='flex justify-between items-start'>
    //         <div className='flex gap-3 items-start'>
    //           <div className='bg-green-600 p-2 rounded'>
    //             <ArrowRight className='w-4 h-4 text-white' />
    //           </div>
    //           <div>
    //             <p className='font-semibold'>Contribution Received</p>
    //             <p className='text-sm text-gray-400'>
    //               Twoli contribution group. Ksh 3,400
    //             </p>
    //           </div>
    //         </div>
    //         <p className='text-sm text-gray-400 whitespace-nowrap'>
    //           2 hours ago
    //         </p>
    //       </div>
    //       <div className='flex justify-between items-start'>
    //         <div className='flex gap-3 items-start'>
    //           <div className='bg-blue-600 p-2 rounded'>
    //             <Users className='w-4 h-4 text-white' />
    //           </div>
    //           <div>
    //             <p className='font-semibold'>New member joined</p>
    //             <p className='text-sm text-gray-400'>
    //               Big J Contribution group. Felix Twoli
    //             </p>
    //           </div>
    //         </div>
    //         <p className='text-sm text-gray-400 whitespace-nowrap'>1 day ago</p>
    //       </div>
    //     </div>
    //   </Card>
    // </div>
    <div className='p-6 bg-[#111827] text-white min-h-screen'>
      {/* Top Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='flex items-center gap-4 bg-[#1f2937] p-4 rounded-lg'>
          <img src='/assets/users-icon.png' alt='Members' className='w-6 h-6' />
          <div>
            <p className='text-sm text-gray-400'>Total Members</p>
            <p className='font-bold text-lg'>25</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-[#1f2937] p-4 rounded-lg'>
          <img
            src='/assets/contribution-icon.png'
            alt='Contributions'
            className='w-6 h-6'
          />
          <div>
            <p className='text-sm text-gray-400'>Total Contributions</p>
            <p className='font-bold text-lg'>Ksh 200,000</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-[#1f2937] p-4 rounded-lg'>
          <img
            src='/assets/activity-icon.png'
            alt='Activities'
            className='w-6 h-6'
          />
          <div>
            <p className='text-sm text-gray-400'>Upcoming Activities</p>
            <p className='font-bold text-lg'>3</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* My Chamas */}
        <div className='col-span-2 bg-[#1f2937] rounded-xl p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-white font-bold text-lg'>My Chamas</h2>
            <button className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500'>
              + Add Chama
            </button>
          </div>

          <div className='space-y-4'>
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
              <div key={idx} className='p-4 border border-gray-700 rounded-xl'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-semibold'>{chama.name}</p>
                    <p className='text-sm text-gray-400'>{chama.members}</p>
                    <p className='text-green-400 font-semibold'>
                      Total: {chama.total}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full bg-${chama.color}-900 text-${chama.color}-300`}
                  >
                    {chama.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-[#1f2937] rounded-xl p-5'>
          <h2 className='text-white font-bold text-lg mb-4'>Quick actions</h2>
          <ul className='space-y-4'>
            <li className='flex items-center justify-between bg-[#111827] p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <Smartphone className='text-blue-400' size={18} />
                <span>Make M-pesa Payment</span>
              </div>
              <span>&gt;</span>
            </li>
            <li className='flex items-center justify-between bg-[#111827] p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <UserPlus className='text-blue-400' size={18} />
                <span>Invite members</span>
              </div>
              <span>&gt;</span>
            </li>
            <li className='flex items-center justify-between bg-[#111827] p-3 rounded-lg hover:bg-[#2c3440] cursor-pointer'>
              <div className='flex items-center gap-3'>
                <Bell className='text-blue-400' size={18} />
                <span>View Notifications</span>
              </div>
              <span>&gt;</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Activities */}
      <div className='bg-[#1f2937] rounded-xl p-5 mt-6'>
        <h2 className='text-white font-bold text-lg mb-4'>Activities</h2>
        <ul className='space-y-4'>
          <li className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='bg-yellow-600 p-2 rounded-full'></div>
              <div>
                <p className='font-semibold'>Upcoming meeting</p>
                <p className='text-sm text-gray-400'>
                  Lubanga Gemini. Meeting reminder
                </p>
              </div>
            </div>
            <span className='text-sm text-gray-400'>Thur 23/07/2025</span>
          </li>
          <li className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='bg-green-600 p-2 rounded-full'></div>
              <div>
                <p className='font-semibold'>Contribution Received</p>
                <p className='text-sm text-gray-400'>
                  Twoli contribution group. Ksh 3,400
                </p>
              </div>
            </div>
            <span className='text-sm text-gray-400'>2 hours ago</span>
          </li>
          <li className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-600 p-2 rounded-full'></div>
              <div>
                <p className='font-semibold'>New member joined</p>
                <p className='text-sm text-gray-400'>
                  Big J Contribution group. Felix Twoli
                </p>
              </div>
            </div>
            <span className='text-sm text-gray-400'>1 day ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
