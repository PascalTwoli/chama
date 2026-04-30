import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { AlertCircle } from 'lucide-react';
import { LoanStatus } from '../../models/loans';

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLoanData) => Promise<void>;
  isLoading?: boolean;
  borrowers?: Array<{ id: string; name: string; email: string }>;
  isBorrowersLoading?: boolean;
}

export interface CreateLoanData {
  borrowerId: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  purpose?: string;
  notes?: string;
  status?: LoanStatus;
  startDate?: string;
}

const INITIAL_STATUS_OPTIONS = [
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'DISBURSED', label: 'DISBURSED' },
];

export function CreateLoanModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  borrowers = [],
  isBorrowersLoading = false,
}: CreateLoanModalProps) {
  const [borrowerId, setBorrowerId] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [durationMonths, setDurationMonths] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LoanStatus>('APPROVED');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');

  const borrowerOptions = useMemo(() => {
    if (isBorrowersLoading) {
      return [{ value: '', label: 'Loading members...' }];
    }

    if (borrowers.length === 0) {
      return [{ value: '', label: 'No members found' }];
    }

    return [
      { value: '', label: 'Select a borrower' },
      ...borrowers.map(borrower => ({
        value: borrower.id,
        label: borrower.email
          ? `${borrower.name} (${borrower.email})`
          : borrower.name,
      })),
    ];
  }, [borrowers, isBorrowersLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!borrowerId) {
      setError('Please select a borrower');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }
    if (!interestRate || parseFloat(interestRate) < 0) {
      setError('Please enter a valid interest rate');
      return;
    }
    if (
      !durationMonths ||
      parseInt(durationMonths) < 1 ||
      parseInt(durationMonths) > 60
    ) {
      setError('Duration must be between 1 and 60 months');
      return;
    }

    // If status is DISBURSED, startDate is required
    if (status === 'DISBURSED' && !startDate) {
      setError('Start date is required for DISBURSED loans');
      return;
    }

    try {
      await onSubmit({
        borrowerId,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        durationMonths: parseInt(durationMonths),
        purpose: purpose || undefined,
        notes: notes || undefined,
        status,
        startDate: startDate || undefined,
      });

      // Reset form
      setBorrowerId('');
      setAmount('');
      setInterestRate('');
      setDurationMonths('12');
      setPurpose('');
      setNotes('');
      setStatus('APPROVED');
      setStartDate('');
    } catch (err) {
      // Error is handled by parent
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='flex gap-2 p-3 bg-red-50 border border-red-200 rounded-md'>
              <AlertCircle className='w-4 h-4 text-red-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          {/* Borrower Selection */}
          <div className='space-y-1.5'>
            <Label htmlFor='borrower' className='text-sm font-medium'>
              Borrower *
            </Label>
            <Select
              value={borrowerId}
              onChange={e => setBorrowerId(e.target.value)}
              disabled={
                isLoading || isBorrowersLoading || borrowers.length === 0
              }
              className='mt-1.5'
              options={borrowerOptions}
            />
            {!isBorrowersLoading && borrowers.length === 0 && (
              <p className='text-xs text-muted-foreground'>
                No members available for this chama yet.
              </p>
            )}
          </div>

          {/* Loan Amount */}
          <div className='space-y-1.5'>
            <Label htmlFor='amount' className='text-sm font-medium'>
              Loan Amount (KES) *
            </Label>
            <Input
              id='amount'
              type='number'
              placeholder='e.g., 50000'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
              min='0'
              step='1'
            />
          </div>

          {/* Interest Rate */}
          <div className='space-y-1.5'>
            <Label htmlFor='interestRate' className='text-sm font-medium'>
              Interest Rate (%) *
            </Label>
            <Input
              id='interestRate'
              type='number'
              placeholder='e.g., 10'
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
              min='0'
              step='0.01'
            />
          </div>

          {/* Duration Months */}
          <div className='space-y-1.5'>
            <Label htmlFor='durationMonths' className='text-sm font-medium'>
              Duration (months) *
            </Label>
            <Input
              id='durationMonths'
              type='number'
              placeholder='e.g., 12'
              value={durationMonths}
              onChange={e => setDurationMonths(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
              min='1'
              max='60'
              step='1'
            />
          </div>

          {/* Status */}
          <div className='space-y-1.5'>
            <Label htmlFor='status' className='text-sm font-medium'>
              Initial Status
            </Label>
            <Select
              value={status}
              onChange={e => setStatus(e.target.value as LoanStatus)}
              disabled={isLoading}
              className='mt-1.5'
              options={INITIAL_STATUS_OPTIONS}
            />
          </div>

          {/* Start Date (for DISBURSED loans) */}
          {status === 'DISBURSED' && (
            <div className='space-y-1.5'>
              <Label htmlFor='startDate' className='text-sm font-medium'>
                Start Date (Required for DISBURSED) *
              </Label>
              <Input
                id='startDate'
                type='date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={isLoading}
                className='mt-1.5'
              />
            </div>
          )}

          {/* Purpose */}
          <div className='space-y-1.5'>
            <Label htmlFor='purpose' className='text-sm font-medium'>
              Purpose (optional)
            </Label>
            <Input
              id='purpose'
              type='text'
              placeholder='e.g., Business expansion'
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
          </div>

          {/* Notes */}
          <div className='space-y-1.5'>
            <Label htmlFor='notes' className='text-sm font-medium'>
              Notes (optional)
            </Label>
            <textarea
              id='notes'
              placeholder='Additional notes...'
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              disabled={isLoading}
              className='flex w-full rounded-md border border-border bg-input-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-solid'
              rows={3}
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {isLoading ? 'Creating...' : 'Create Loan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
