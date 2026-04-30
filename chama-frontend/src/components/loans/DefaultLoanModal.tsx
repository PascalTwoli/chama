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
import { Loader2 } from 'lucide-react';

interface DefaultLoanModalProps {
  loan: Loan | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDefault: (loanId: string, notes?: string) => void;
}

export function DefaultLoanModal({
  loan,
  isOpen,
  isLoading,
  onClose,
  onDefault,
}: DefaultLoanModalProps) {
  const [notes, setNotes] = useState('');

  const handleDefault = () => {
    if (!loan) return;
    onDefault(loan.id, notes || undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setNotes('');
      onClose();
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Mark Loan as Defaulted</DialogTitle>
          <DialogDescription>
            {loan.borrower.name} - Outstanding balance will be marked as
            defaulted
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900'>
            <p className='text-sm text-red-900 dark:text-red-200'>
              This action will mark the loan as defaulted. This is typically
              done when a borrower fails to make required payments.
            </p>
          </div>

          <div>
            <label className='text-sm font-medium'>Notes</label>
            <Input
              placeholder='Reason for default, actions taken, etc.'
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
            variant='destructive'
            onClick={handleDefault}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Mark as Defaulted
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
