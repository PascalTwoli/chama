import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatsCard } from '../components/StatsCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  Search,
  Phone,
  Calendar,
  Wallet,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  phone: string;
  joinedDate: string;
  status: 'Paid' | 'Pending';
  savings: number;
  role: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Mary Wanjiku',
    initials: 'MW',
    color: 'bg-blue-100 text-blue-600',
    phone: '0712345678',
    joinedDate: 'Jan 2024',
    status: 'Paid',
    savings: 75000,
    role: 'Treasurer',
  },
  {
    id: '2',
    name: 'Peter Kamau',
    initials: 'PK',
    color: 'bg-indigo-100 text-indigo-600',
    phone: '0723456789',
    joinedDate: 'Feb 2024',
    status: 'Paid',
    savings: 120000,
    role: 'Member',
  },
  {
    id: '3',
    name: 'Grace Achieng',
    initials: 'GA',
    color: 'bg-purple-100 text-purple-600',
    phone: '0734567890',
    joinedDate: 'Mar 2024',
    status: 'Paid',
    savings: 85000,
    role: 'Secretary',
  },
  {
    id: '4',
    name: 'David Omondi',
    initials: 'DO',
    color: 'bg-orange-100 text-orange-600',
    phone: '0745678901',
    joinedDate: 'Jan 2024',
    status: 'Pending',
    savings: 95000,
    role: 'Member',
  },
  {
    id: '5',
    name: 'Faith Njeri',
    initials: 'FN',
    color: 'bg-pink-100 text-pink-600',
    phone: '0756789012',
    joinedDate: 'Apr 2024',
    status: 'Paid',
    savings: 68000,
    role: 'Member',
  },
  {
    id: '6',
    name: 'John Mwangi',
    initials: 'JM',
    color: 'bg-sky-100 text-sky-600',
    phone: '0767890123',
    joinedDate: 'Jan 2024',
    status: 'Pending',
    savings: 110000,
    role: 'Chairperson',
  },
  {
    id: '7',
    name: 'Sarah Wambui',
    initials: 'SW',
    color: 'bg-teal-100 text-teal-600',
    phone: '0778901234',
    joinedDate: 'May 2024',
    status: 'Paid',
    savings: 45000,
    role: 'Member',
  },
];

export default function MembersPage() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>(
    'All'
  );

  const filteredMembers = mockMembers.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedMember = mockMembers.find(m => m.id === selectedMemberId);

  return (
    <div className='p-6 space-y-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
      <PageHeader
        title='Members'
        subtitle={`${mockMembers.length} total members`}
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <UserPlus className='w-4 h-4' />
            Add Member
          </Button>
        }
        className='flex-shrink-0'
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0'>
        <StatsCard
          title='Total Members'
          value={mockMembers.length.toString()}
          icon={Users}
          status='default'
          className='bg-card'
        />
        <StatsCard
          title='Paid This Month'
          value='5'
          subtext='63% paid'
          icon={DollarSign}
          status='success'
        />
        <StatsCard
          title='Pending'
          value='3'
          subtext='Need follow-up'
          icon={TrendingUp}
          status='warning'
        />
        <StatsCard
          title='Total Savings'
          value='KSh 696K'
          icon={Wallet}
          status='default'
        />
      </div>

      {/* Main Split Layout */}
      <div className='flex gap-6 flex-1 min-h-0 pt-4'>
        {/* List Section */}
        <div className='w-full lg:w-3/5 flex flex-col gap-4 bg-card rounded-lg border border-border p-4 shadow-sm'>
          <div className='flex flex-col gap-2'>
            <h3 className='font-semibold'>All Members</h3>
            <p className='text-sm text-muted-foreground'>
              Manage and view member details
            </p>
          </div>

          {/* Toolbar */}
          <div className='flex gap-2 items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search members...'
                className='pl-9 bg-background'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex gap-1 border rounded-lg p-1 bg-muted/20'>
              {(['All', 'Paid', 'Pending'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable List */}
          <div className='flex-1 overflow-y-auto space-y-2 pr-1'>
            {filteredMembers.map(member => (
              <div
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50',
                  selectedMemberId === member.id
                    ? 'border-primary bg-accent/30 ring-1 ring-primary/20'
                    : 'border-border bg-background'
                )}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                      member.color
                    )}
                  >
                    {member.initials}
                  </div>
                  <div className='space-y-0.5'>
                    <p className='font-medium text-sm text-foreground'>
                      {member.name}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Phone className='w-3 h-3' />
                      {member.phone}
                      <span className='w-1 h-1 rounded-full bg-muted-foreground/30 mx-1' />
                      Joined {member.joinedDate}
                    </div>
                  </div>
                </div>

                <div className='text-right space-y-1'>
                  <p className='font-bold text-sm'>
                    KSh {member.savings.toLocaleString()}
                  </p>
                  <Badge
                    variant={member.status === 'Paid' ? 'success' : 'warning'}
                    className='text-[10px] px-1.5 h-5'
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className='hidden lg:flex w-2/5 flex-col bg-card rounded-lg border border-border p-6 shadow-sm'>
          <div className='mb-6'>
            <h3 className='font-semibold'>Member Details</h3>
            <p className='text-sm text-muted-foreground'>
              Select a member to view details
            </p>
          </div>

          {selectedMember ? (
            <div className='flex flex-col items-center flex-1 space-y-6 animate-in fade-in duration-300'>
              <div
                className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold',
                  selectedMember.color
                )}
              >
                {selectedMember.initials}
              </div>
              <div className='text-center space-y-1'>
                <h2 className='text-xl font-bold'>{selectedMember.name}</h2>
                <Badge variant='outline'>{selectedMember.role}</Badge>
              </div>

              <div className='w-full grid grid-cols-2 gap-4'>
                <div className='p-4 rounded-lg bg-muted/30 border space-y-1 text-center'>
                  <p className='text-xs text-muted-foreground'>Total Savings</p>
                  <p className='text-lg font-bold'>
                    KSh {selectedMember.savings.toLocaleString()}
                  </p>
                </div>
                <div className='p-4 rounded-lg bg-muted/30 border space-y-1 text-center'>
                  <p className='text-xs text-muted-foreground'>Status</p>
                  <Badge
                    variant={
                      selectedMember.status === 'Paid' ? 'success' : 'warning'
                    }
                  >
                    {selectedMember.status}
                  </Badge>
                </div>
              </div>

              <div className='w-full space-y-4'>
                <h4 className='font-medium text-sm border-b pb-2'>
                  Contact Information
                </h4>
                <div className='flex items-center gap-3 text-sm'>
                  <Phone className='w-4 h-4 text-muted-foreground' />
                  {selectedMember.phone}
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Calendar className='w-4 h-4 text-muted-foreground' />
                  Joined {selectedMember.joinedDate}
                </div>
              </div>

              <div className='mt-auto w-full pt-4 border-t'>
                <Button variant='outline' className='w-full'>
                  View Full Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center text-center text-muted-foreground space-y-4'>
              <div className='w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center'>
                <Users className='w-8 h-8 opacity-50' />
              </div>
              <p>Select a member from the list to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
