import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import ChamaService from '../services/chama/chama-services';
import TransactionService from '../services/transaction/transaction-services';
import { toast } from 'react-toastify';

// Avatar color helper - returns pastel bg and matching text color
const avatarColors = [
  { bg: 'rgba(59, 130, 246, 0.15)', text: '#2563eb' }, // blue
  { bg: 'rgba(168, 85, 247, 0.15)', text: '#7c3aed' }, // purple
  { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a' }, // green
  { bg: 'rgba(249, 115, 22, 0.15)', text: '#ea580c' }, // orange
  { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626' }, // red
  { bg: 'rgba(99, 102, 241, 0.15)', text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.15)', text: '#db2777' }, // pink
  { bg: 'rgba(20, 184, 166, 0.15)', text: '#0d9488' }, // teal
];

const getAvatarColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface ChamaMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function RecordContribution() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chamaId } = useParams<{ chamaId: string }>();

  const [members, setMembers] = useState<ChamaMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [amount, setAmount] = useState('5000');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Fetch members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      if (!chamaId) return;

      try {
        setIsLoading(true);
        const membersData = await ChamaService.getChamaMembers(chamaId);

        // Deduplicate members by user.id (in case of any duplicates from backend)
        const uniqueMembers = membersData.reduce(
          (acc: typeof membersData, member) => {
            if (!acc.find(m => m.user.id === member.user.id)) {
              acc.push(member);
            }
            return acc;
          },
          []
        );

        setMembers(uniqueMembers as ChamaMember[]);

        // Check if we have a pre-selected member from navigation state
        const state = location.state as { memberName?: string } | null;
        if (state?.memberName) {
          const preselectedMember = uniqueMembers.find(
            m => m.user.name.toLowerCase() === state.memberName?.toLowerCase()
          );
          if (preselectedMember) {
            setSelectedMemberId(preselectedMember.user.id);
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [chamaId, location.state]);

  const filteredMembers = members.filter(
    member =>
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.user.phone && member.user.phone.includes(searchQuery)) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMember = members.find(m => m.user.id === selectedMemberId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !chamaId) return;

    setIsSubmitting(true);
    try {
      await TransactionService.createTransaction({
        chamaId,
        type: 'CONTRIBUTION',
        amount: parseFloat(amount),
        reference: reference || undefined,
        description: notes || `Contribution recorded on ${date}`,
        userId: selectedMemberId, // Record for selected member
      });

      toast.success('Contribution recorded successfully!');
      navigate(`/admin/chamas/${chamaId}/contributions`);
    } catch (error) {
      console.error('Error recording contribution:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to record contribution'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-6 space-y-6 max-w-[1600px] mx-auto'>
      <PageHeader
        title='Record Contribution'
        subtitle='Add new M-Pesa payment record'
        showBackButton
      />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left Column: Member Selection */}
        <div className='lg:col-span-7 space-y-4'>
          <Card className='h-full border border-border shadow-sm'>
            <CardContent className='p-6 space-y-4'>
              <div>
                <h3 className='font-semibold text-base m-0'>Select Member</h3>
                <p className='text-sm text-muted-foreground m-0'>
                  Search and select the member who made the payment
                </p>
              </div>

              <div className='relative'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search by name or phone...'
                  className='pl-9'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className='space-y-2 mt-4 max-h-[600px] overflow-y-auto'>
                {isLoading ? (
                  <div className='flex items-center justify-center py-12'>
                    <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
                    <span className='ml-2 text-muted-foreground'>
                      Loading members...
                    </span>
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => {
                    const colors = getAvatarColors(member.user.name);
                    return (
                      <div
                        key={member.user.id}
                        onClick={() => setSelectedMemberId(member.user.id)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50',
                          selectedMemberId === member.user.id
                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                            : 'border-border'
                        )}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold'
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {getInitials(member.user.name)}
                          </div>
                          <div>
                            <p className='font-semibold text-sm text-foreground m-0'>
                              {member.user.name}
                            </p>
                            <p className='text-xs text-muted-foreground m-0'>
                              {member.user.phone || member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <Badge
                            variant='outline'
                            className='font-normal capitalize'
                          >
                            {member.role.toLowerCase()}
                          </Badge>
                          <p className='text-[10px] text-muted-foreground m-0 mt-1'>
                            Joined:{' '}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    {searchQuery ? (
                      <div>
                        No members found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      <div>No members in this chama yet</div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment Details Form */}
        <div className='lg:col-span-5'>
          <Card className='border border-border shadow-sm sticky top-6'>
            <CardContent className='p-6'>
              <div className='mb-6'>
                <h3 className='font-semibold text-base m-0'>Payment Details</h3>
                <p className='text-sm text-muted-foreground m-0'>
                  Enter M-Pesa transaction info
                </p>
              </div>

              {selectedMember ? (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  {/* Selected Member Banner */}
                  <div className='bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4'>
                    <p className='text-xs text-blue-600 mb-0.5'>
                      Recording for:
                    </p>
                    <p className='font-semibold text-blue-700'>
                      {selectedMember.user.name}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Amount (KSh) *
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-2.5 text-muted-foreground'>
                        KSh
                      </span>
                      <Input
                        type='number'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className='pl-10 font-mono'
                        placeholder='0.00'
                        min='1'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      M-Pesa Reference
                    </label>
                    <Input
                      value={reference}
                      onChange={e => setReference(e.target.value.toUpperCase())}
                      placeholder='e.g. QBX7H2K9LM'
                      className='uppercase font-mono'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Payment Date *
                    </label>
                    <div className='relative'>
                      <Calendar className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                      <Input
                        type='date'
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className='pl-9'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Notes (Optional)
                    </label>
                    <textarea
                      className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none'
                      placeholder='Any additional notes...'
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full gap-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className='w-4 h-4' />
                        Record Payment
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className='text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50'>
                  <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3'>
                    <Search className='w-6 h-6 text-gray-400' />
                  </div>
                  <h4 className='font-medium text-gray-900 mb-1'>
                    No Member Selected
                  </h4>
                  <p className='text-sm text-gray-500'>
                    Please select a member from the list on the left to specific
                    payment details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
