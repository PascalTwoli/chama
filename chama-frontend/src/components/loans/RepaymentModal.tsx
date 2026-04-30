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
import { Select } from '../ui/select';
import { Loan, PaymentMethod } from '../../models/loans';
import { formatCurrency } from '../../utils/loans-utils';
import { Loader2 } from 'lucide-react';

interface RepaymentModalProps {
  loan: Loan | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onRecord: (
    loanId: string,
    data: {
      amount: number;
      paymentDate?: string;
      method: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'MPESA',
  'BANK_TRANSFER',
  'CASH',
  'OTHER',
];

export function RepaymentModal({
  loan,
  isOpen,
  isLoading,
  onClose,
  onRecord,
}: RepaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [method, setMethod] = useState<PaymentMethod>('MPESA');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleRecord = () => {
    if (!loan || !amount || !method) return;

    onRecord(loan.id, {
      amount: parseFloat(amount),
      paymentDate: paymentDate || undefined,
      method,
      reference: reference || undefined,
      notes: notes || undefined,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setAmount('');
      setReference('');
      setNotes('');
      onClose();
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Record Repayment</DialogTitle>
          <DialogDescription>
            Outstanding balance: {formatCurrency(loan.outstandingBalance || 0)}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Amount</label>
            <Input
              type='number'
              placeholder='0'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={isLoading}
              step='100'
              className='mt-1.5'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium'>Payment Date</label>
              <Input
                type='date'
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                disabled={isLoading}
                className='mt-1.5'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Method</label>
              <Select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                disabled={isLoading}
                className='mt-1.5'
                options={PAYMENT_METHODS.map(m => ({
                  value: m,
                  label: m.replace(/_/g, ' '),
                }))}
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium'>Reference</label>
            <Input
              placeholder='e.g., Transaction ID, Cheque number'
              value={reference}
              onChange={e => setReference(e.target.value)}
              disabled={isLoading}
              className='mt-1.5'
            />
          </div>

          <div>
            <label className='text-sm font-medium'>Notes</label>
            <Input
              placeholder='Optional notes'
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
          <Button onClick={handleRecord} disabled={isLoading || !amount}>
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
