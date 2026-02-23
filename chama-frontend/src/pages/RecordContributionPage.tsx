import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

// Mock Members Data (matching the screenshot)
const mockMembers = [
  {
    id: '1',
    name: 'Mary Wanjiku',
    phone: '0712345678',
    status: 'Paid This Month',
    lastPaid: 'Jan 5, 2026',
    initials: 'MW',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '2',
    name: 'Peter Kamau',
    phone: '0723456789',
    status: 'Paid This Month',
    lastPaid: 'Jan 5, 2026',
    initials: 'PK',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '3',
    name: 'Grace Achieng',
    phone: '0734567890',
    status: 'Paid This Month',
    lastPaid: 'Jan 6, 2026',
    initials: 'GA',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '4',
    name: 'David Omondi',
    phone: '0745678901',
    status: 'Pending',
    lastPaid: 'Dec 5, 2025',
    initials: 'DO',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '5',
    name: 'Faith Njeri',
    phone: '0756789012',
    status: 'Paid This Month',
    lastPaid: 'Jan 5, 2026',
    initials: 'FN',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '6',
    name: 'John Mwangi',
    phone: '0767890123',
    status: 'Pending',
    lastPaid: 'Dec 5, 2025',
    initials: 'JM',
    color: 'bg-blue-100 text-blue-600',
  },
];

export default function RecordContribution() {
  const navigate = useNavigate();
  const { chamaId } = useParams<{ chamaId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [amount, setAmount] = useState('5000');
  const [reference, setReference] = useState('QBX7H2K9LM'); // Mock default from screenshot
  const [date, setDate] = useState('2026-02-17'); // Mock default from screenshot
  const [notes, setNotes] = useState('');

  const filteredMembers = mockMembers.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)
  );

  const selectedMember = mockMembers.find(m => m.id === selectedMemberId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate(`/admin/chamas/${chamaId}/contributions`);
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
                {filteredMembers.map(member => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50',
                      selectedMemberId === member.id
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-border'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                          member.color
                        )}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-foreground m-0'>
                          {member.name}
                        </p>
                        <p className='text-xs text-muted-foreground m-0'>
                          {member.phone}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge
                        variant={
                          member.status === 'Paid This Month'
                            ? 'success'
                            : 'warning'
                        }
                        className='font-normal'
                      >
                        {member.status}
                      </Badge>
                      <p className='text-[10px] text-muted-foreground m-0'>
                        Last: {member.lastPaid}
                      </p>
                    </div>
                  </div>
                ))}

                {filteredMembers.length === 0 && (
                  <div className='text-center py-8 text-muted-foreground'>
                    <div className='text-center py-8 text-muted-foreground'>
                      No members found matching &quot;{searchQuery}&quot;
                    </div>
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
                      {selectedMember.name}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Amount (KSh) *
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-2.5 text-muted-foreground'>
                        $
                      </span>
                      <Input
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className='pl-7 font-mono'
                        placeholder='0.00'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      M-Pesa Reference *
                    </label>
                    <Input
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      placeholder='e.g. QBX7H2K9LM'
                      className='uppercase font-mono'
                      required
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
