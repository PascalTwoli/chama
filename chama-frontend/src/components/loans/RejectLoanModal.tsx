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

interface RejectLoanModalProps {
  loan: Loan | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onReject: (loanId: string, reason?: string) => void;
}

export function RejectLoanModal({
  loan,
  isOpen,
  isLoading,
  onClose,
  onReject,
}: RejectLoanModalProps) {
  const [reason, setReason] = useState('');

  const handleReject = () => {
    if (!loan) return;
    onReject(loan.id, reason || undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setReason('');
      onClose();
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Reject Loan</DialogTitle>
          <DialogDescription>
            Rejecting loan request from {loan.borrower.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Reason for Rejection</label>
            <Input
              placeholder='e.g., Insufficient collateral, Poor credit history'
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              Optional: Explain why this loan is being rejected
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
