import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, CheckCircle, XCircle, Send, AlertTriangle } from 'lucide-react';
import { Loan, LoanStatus } from '../../models/loans';
import {
  formatCurrency,
  formatDate,
  getStatusLabel,
  getStatusBadgeVariant,
  getInitials,
  getAvatarColor,
} from '../../utils/loans-utils';
import { cn } from '../../utils/cn';

interface LoansTableProps {
  loans: Loan[];
  isLoading: boolean;
  onView: (loan: Loan) => void;
  onApprove: (loan: Loan) => void;
  onReject: (loan: Loan) => void;
  onDisburse: (loan: Loan) => void;
  onRepayment: (loan: Loan) => void;
  onDefault: (loan: Loan) => void;
}

const getActionButtons = (
  status: LoanStatus,
  loan: Loan,
  onView: (loan: Loan) => void,
  onApprove: (loan: Loan) => void,
  onReject: (loan: Loan) => void,
  onDisburse: (loan: Loan) => void,
  onRepayment: (loan: Loan) => void,
  onDefault: (loan: Loan) => void
) => {
  const buttons = [];

  // View button - always available
  buttons.push(
    <Button
      key='view'
      variant='ghost'
      size='sm'
      onClick={() => onView(loan)}
      className='h-8'
    >
      <Eye className='w-4 h-4' />
    </Button>
  );

  // Status-specific buttons
  switch (status) {
    case 'REQUESTED':
    case 'UNDER_REVIEW':
      buttons.push(
        <Button
          key='approve'
          variant='outline'
          size='sm'
          onClick={() => onApprove(loan)}
          className='h-8'
        >
          <CheckCircle className='w-4 h-4 mr-1' />
          Approve
        </Button>,
        <Button
          key='reject'
          variant='outline'
          size='sm'
          onClick={() => onReject(loan)}
          className='h-8 text-destructive hover:text-destructive'
        >
          <XCircle className='w-4 h-4 mr-1' />
          Reject
        </Button>
      );
      break;

    case 'APPROVED':
      buttons.push(
        <Button
          key='disburse'
          variant='outline'
          size='sm'
          onClick={() => onDisburse(loan)}
          className='h-8'
        >
          <Send className='w-4 h-4 mr-1' />
          Disburse
        </Button>
      );
      break;

    case 'DISBURSED':
    case 'ACTIVE':
    case 'OVERDUE':
      buttons.push(
        <Button
          key='repayment'
          variant='outline'
          size='sm'
          onClick={() => onRepayment(loan)}
          className='h-8'
        >
          Record Repayment
        </Button>
      );
      if (status !== 'OVERDUE') {
        buttons.push(
          <Button
            key='default'
            variant='outline'
            size='sm'
            onClick={() => onDefault(loan)}
            className='h-8 text-destructive hover:text-destructive'
          >
            <AlertTriangle className='w-4 h-4 mr-1' />
            Mark Defaulted
          </Button>
        );
      }
      break;
  }

  return buttons;
};

export function LoansTable({
  loans,
  isLoading,
  onView,
  onApprove,
  onReject,
  onDisburse,
  onRepayment,
  onDefault,
}: LoansTableProps) {
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='bg-muted rounded h-12 animate-pulse' />
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>No loans found</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <Table className='border-collapse'>
        <TableHeader className='bg-muted/50'>
          <TableRow className='hover:bg-transparent border-b border-border'>
            <TableHead>Borrower</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map(loan => (
            <TableRow
              key={loan.id}
              className='hover:bg-muted/50 transition-colors border-0'
            >
              <TableCell className='border-b border-border py-3'>
                <div className='flex items-center gap-3'>
                  {(() => {
                    const avatarColors = getAvatarColor(loan.borrower.name);

                    return (
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium'
                        )}
                        style={{
                          backgroundColor: avatarColors.bg,
                          color: avatarColors.text,
                        }}
                      >
                        {getInitials(loan.borrower.name)}
                      </div>
                    );
                  })()}
                  <div>
                    <p className='font-medium'>{loan.borrower.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {loan.borrower.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className='border-b border-border py-3 font-mono text-sm'>
                {loan.referenceCode}
              </TableCell>
              <TableCell className='border-b border-border py-3 font-medium'>
                {formatCurrency(loan.principalAmount || loan.requestedAmount)}
              </TableCell>
              <TableCell className='border-b border-border py-3 text-green-600 font-medium'>
                {formatCurrency(loan.interestAmount || loan.interestRate)}
              </TableCell>
              <TableCell className='border-b border-border py-3 font-bold'>
                {formatCurrency(loan.outstandingBalance || 0)}
              </TableCell>
              <TableCell className='border-b border-border py-3 text-muted-foreground'>
                {formatDate(loan.dueDate)}
              </TableCell>
              <TableCell className='border-b border-border py-3'>
                <Badge
                  variant={getStatusBadgeVariant(loan.status).variant as any}
                  className={getStatusBadgeVariant(loan.status).color}
                >
                  {getStatusLabel(loan.status)}
                </Badge>
              </TableCell>
              <TableCell className='border-b border-border py-3'>
                <div className='flex justify-end gap-2 flex-wrap'>
                  {getActionButtons(
                    loan.status,
                    loan,
                    onView,
                    onApprove,
                    onReject,
                    onDisburse,
                    onRepayment,
                    onDefault
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
