import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatsCard } from '../components/StatsCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  Search,
  Phone,
  Calendar,
  Wallet,
  Mail,
  Eye,
  Edit,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { chamaId } = useParams<{ chamaId: string }>();
  const navigate = useNavigate();

  return (
    <div className='p-6 space-y-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
      <PageHeader
        title='Members'
        subtitle={`${mockMembers.length} total members`}
        action={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='gap-2'
              onClick={() =>
                navigate(`/admin/chamas/${chamaId}/members/join-requests`)
              }
            >
              <UserCheck className='w-4 h-4' />
              Join Requests
            </Button>
            <Button
              className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'
              onClick={() =>
                navigate(`/admin/chamas/${chamaId}/members/invite-member`)
              }
            >
              <UserPlus className='w-4 h-4' />
              Add Member
            </Button>
          </div>
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
        <div className='w-full lg:w-3/5 flex flex-col gap-2 bg-card rounded-lg border border-border p-4 shadow-sm'>
          <div className='flex flex-col gap-1 mb-2'>
            <h3 className='font-semibold m-0'>All Members</h3>
            <p className='text-sm text-muted-foreground m-0'>
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
            <div className='flex gap-1 rounded-lg p-1 bg-muted/20'>
              {(['All', 'Paid', 'Pending'] as const).map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-4 h-9 text-xs font-medium rounded-md transition-colors ',
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {status}
                </Button>
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
        <div className='hidden lg:flex w-2/5 flex-col bg-card rounded-lg border border-border p-6 shadow-sm overflow-y-auto'>
          <div className='mb-6'>
            <h3 className='font-semibold m-0'>Member Details</h3>
            <p className='text-sm text-muted-foreground m-0'>
              View and manage member
            </p>
          </div>

          {selectedMember ? (
            <div className='flex flex-col flex-1 animate-in fade-in duration-300'>
              {/* Identity */}
              <div className='flex flex-col items-center text-center space-y-3 border-b border-border pb-4'>
                <div
                  className={cn(
                    'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold',
                    selectedMember.color
                  )}
                >
                  {selectedMember.initials}
                </div>
                <div className='space-y-1'>
                  <h2 className='text-xl font-bold m-0'>
                    {selectedMember.name}
                  </h2>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{selectedMember.role}</Badge>
                    <Badge
                      variant={
                        selectedMember.status === 'Paid' ? 'success' : 'warning'
                      }
                      className='px-3 py-0.5 text-xs font-medium'
                    >
                      {selectedMember.status === 'Paid'
                        ? 'Payment Complete'
                        : 'Payment Pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='m-0'>
                <h4 className='font-semibold text-sm'>Contact Information</h4>
                <div className='space-y-1 text-sm'>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <Phone className='w-4 h-4' />
                    <span className='text-foreground'>
                      {selectedMember.phone}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <Mail className='w-4 h-4' />
                    <span className='text-foreground'>
                      {selectedMember.name.toLowerCase().replace(' ', '.')}
                      @email.com
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-foreground'>
                      Joined {selectedMember.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className='border-b border-border pb-3'>
                <h4 className='font-semibold text-sm mb-1'>
                  Financial Summary
                </h4>
                <div className='bg-muted/30 rounded-lg py-1 space-y-3'>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>
                      Total Contributions
                    </span>
                    <span className='font-bold'>
                      KSh {selectedMember.savings.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>
                      Monthly Amount
                    </span>
                    <span className='font-bold'>KSh 5,000</span>
                  </div>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>Last Payment</span>
                    <span className='font-bold'>Dec 5, 2025</span>
                  </div>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>
                      Attendance Rate
                    </span>
                    <span className='font-bold'>75%</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='space-y-3 pt-2'>
                <Button
                  variant='outline'
                  className='w-full justify-start h-10 gap-2 font-medium bg-transparent'
                >
                  <Eye className='w-4 h-4 text-muted-foreground' />
                  View Full History
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start h-10 gap-2 font-medium bg-transparent'
                >
                  <Edit className='w-4 h-4 text-muted-foreground' />
                  Edit Details
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start h-10 gap-2 font-medium bg-transparent'
                >
                  <Mail className='w-4 h-4 text-muted-foreground' />
                  Send Message
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start h-10 gap-2 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border-border bg-transparent'
                >
                  <Trash2 className='w-4 h-4' />
                  Remove Member
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
