import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatsCard } from '../components/StatsCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Calendar,
  Mail,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useNavigate, useParams } from 'react-router-dom';
import ChamaService from '../services/chama/chama-services';
import { toast } from 'react-toastify';

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  role: string;
}

// Helper to generate avatar colors based on name - returns { bg, text }
const getAvatarColors = (name: string) => {
  const colors = [
    { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' }, // blue
    { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899' }, // pink
    { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' }, // orange
    { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' }, // green
    { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' }, // purple
    { bg: 'rgba(20, 184, 166, 0.15)', text: '#14b8a6' }, // teal
    { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1' }, // indigo
    { bg: 'rgba(234, 179, 8, 0.15)', text: '#ca8a04' }, // yellow
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Helper to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper to format role
const formatRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

// Helper to format date
const formatJoinedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { chamaId } = useParams<{ chamaId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      if (!chamaId) return;

      try {
        setIsLoading(true);
        const membersData = await ChamaService.getChamaMembers(chamaId);

        // Map to our Member interface
        const mappedMembers: Member[] = membersData.map(m => ({
          id: m.id,
          userId: m.userId,
          name: m.user.name || 'Unknown',
          email: m.user.email || '',
          phone: m.user.phone || undefined,
          joinedAt: m.joinedAt,
          role: m.role,
        }));

        setMembers(mappedMembers);
      } catch (error) {
        console.error('Error loading members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [chamaId]);

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const selectedMember = members.find(m => m.id === selectedMemberId);

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center h-[calc(100vh-64px)]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
      <PageHeader
        title='Members'
        subtitle={`${members.length} total members`}
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
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0'>
        <StatsCard
          title='Total Members'
          value={members.length.toString()}
          icon={Users}
          status='default'
          className='bg-card'
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
                    className='w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm'
                    style={{ 
                      backgroundColor: getAvatarColors(member.name).bg,
                      color: getAvatarColors(member.name).text 
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className='space-y-0.5'>
                    <p className='font-medium text-sm text-foreground m-0'>
                      {member.name}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Phone className='w-3 h-3' />
                      {member.phone || 'No phone'}
                      <span className='w-1 h-1 rounded-full bg-muted-foreground/30 mx-1' />
                      Joined {formatJoinedDate(member.joinedAt)}
                    </div>
                  </div>
                </div>

                <div className='text-right'>
                  <Badge variant='outline' className='text-[10px] px-1.5 h-5'>
                    {formatRole(member.role)}
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
                  className='w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold'
                  style={{
                    backgroundColor: getAvatarColors(selectedMember.name).bg,
                    color: getAvatarColors(selectedMember.name).text,
                  }}
                >
                  {getInitials(selectedMember.name)}
                </div>
                <div className='space-y-1'>
                  <h2 className='text-xl font-bold m-0'>
                    {selectedMember.name}
                  </h2>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>
                      {formatRole(selectedMember.role)}
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
                      {selectedMember.phone || 'No phone'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <Mail className='w-4 h-4' />
                    <span className='text-foreground'>
                      {selectedMember.email}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-foreground'>
                      Joined {formatJoinedDate(selectedMember.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className='border-b border-border pb-3'>
                <h4 className='font-semibold text-sm mb-1'>
                  Membership Details
                </h4>
                <div className='bg-muted/30 rounded-lg py-1 space-y-3'>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>Role</span>
                    <span className='font-bold'>
                      {formatRole(selectedMember.role)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center p-2 text-sm bg-background'>
                    <span className='text-muted-foreground'>Member Since</span>
                    <span className='font-bold'>
                      {formatJoinedDate(selectedMember.joinedAt)}
                    </span>
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
