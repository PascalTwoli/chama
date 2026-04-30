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

interface DisburseLoanModalProps {
  loan: Loan | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDisburse: (
    loanId: string,
    data: {
      startDate: string;
    }
  ) => void;
}

export function DisburseLoanModal({
  loan,
  isOpen,
  isLoading,
  onClose,
  onDisburse,
}: DisburseLoanModalProps) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleDisburse = () => {
    if (!loan) return;
    onDisburse(loan.id, {
      startDate,
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
          <DialogTitle>Disburse Loan</DialogTitle>
          <DialogDescription>
            Amount:{' '}
            {formatCurrency(loan.approvedAmount || loan.requestedAmount)}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-900'>
            <p className='text-sm text-blue-900 dark:text-blue-200'>
              This will mark the loan as active and record the disbursement
              date.
            </p>
          </div>

          <div>
            <label className='text-sm font-medium'>Start Date</label>
            <Input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleDisburse} disabled={isLoading}>
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Disburse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
