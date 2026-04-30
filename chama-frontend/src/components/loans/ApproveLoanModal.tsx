import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loan } from '../../models/loans';
import { formatCurrency } from '../../utils/loans-utils';
import { Loader2 } from 'lucide-react';

interface ApproveLoanModalProps {
  loan: Loan | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onApprove: (
    loanId: string,
    data: {
      approvedAmount: number;
      interestRate?: number;
      durationMonths?: number;
      notes?: string;
    }
  ) => void;
}

export function ApproveLoanModal({
  loan,
  isOpen,
  isLoading,
  onClose,
  onApprove,
}: ApproveLoanModalProps) {
  const [approvedAmount, setApprovedAmount] = useState(
    loan?.requestedAmount.toString() || ''
  );
  const [interestRate, setInterestRate] = useState(
    loan?.interestRate?.toString() || ''
  );
  const [durationMonths, setDurationMonths] = useState(
    loan?.durationMonths?.toString() || ''
  );
  const [notes, setNotes] = useState('');

  const handleApprove = () => {
    if (!loan || !approvedAmount) return;

    onApprove(loan.id, {
      approvedAmount: parseFloat(approvedAmount),
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      durationMonths: durationMonths ? parseInt(durationMonths, 10) : undefined,
      notes: notes || undefined,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Approve Loan</DialogTitle>
          <DialogDescription>
            Loan request from {loan.borrower.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>
              Requested Amount: {formatCurrency(loan.requestedAmount)}
            </label>
            <Input
              type='number'
              placeholder='Approved amount'
              value={approvedAmount}
              onChange={e => setApprovedAmount(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              Amount to approve for disbursement
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium'>Interest Rate (%)</label>
              <Input
                type='number'
                placeholder='e.g., 10'
                value={interestRate}
                onChange={e => setInterestRate(e.target.value)}
                disabled={isLoading}
                step='0.1'
                className='mt-1.5'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Duration (months)</label>
              <Input
                type='number'
                placeholder='e.g., 12'
                value={durationMonths}
                onChange={e => setDurationMonths(e.target.value)}
                disabled={isLoading}
                className='mt-1.5'
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium'>Notes</label>
            <Input
              placeholder='Optional approval notes'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading || !approvedAmount}
          >
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
