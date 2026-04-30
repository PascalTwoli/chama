import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Loan } from '../../models/loans';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusLabel,
  getStatusBadgeVariant,
  getInitials,
  getAvatarColor,
} from '../../utils/loans-utils';
import { cn } from '../../utils/cn';

interface LoanDetailsModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanDetailsModal({
  loan,
  isOpen,
  onClose,
}: LoanDetailsModalProps) {
  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Loan Details</DialogTitle>
          <DialogDescription>
            Reference Code: {loan.referenceCode}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Borrower Info */}
          <div className='bg-muted/30 rounded-lg p-4'>
            <h3 className='text-sm font-semibold mb-4'>Borrower Information</h3>
            <div className='flex items-start gap-4'>
              {(() => {
                const avatarColors = getAvatarColor(loan.borrower.name);

                return (
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold'
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
              <div className='flex-1'>
                <p className='font-medium text-base'>{loan.borrower.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {loan.borrower.email}
                </p>
                {loan.borrower.phone && (
                  <p className='text-sm text-muted-foreground'>
                    {loan.borrower.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loan Status & Timeline */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-muted/30 rounded-lg p-4'>
              <p className='text-xs text-muted-foreground mb-2'>Status</p>
              <Badge
                variant={getStatusBadgeVariant(loan.status).variant as any}
                className={getStatusBadgeVariant(loan.status).color}
              >
                {getStatusLabel(loan.status)}
              </Badge>
            </div>
            <div className='bg-muted/30 rounded-lg p-4'>
              <p className='text-xs text-muted-foreground mb-2'>Duration</p>
              <p className='font-semibold'>{loan.durationMonths} months</p>
            </div>
          </div>

          {/* Amount Summary */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>
                Requested Amount
              </p>
              <p className='text-lg font-bold'>
                {formatCurrency(loan.requestedAmount)}
              </p>
            </div>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>
                Approved Amount
              </p>
              <p className='text-lg font-bold'>
                {loan.approvedAmount
                  ? formatCurrency(loan.approvedAmount)
                  : '-'}
              </p>
            </div>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>
                Interest Rate
              </p>
              <p className='text-lg font-bold'>
                {loan.interestRate ? `${loan.interestRate}%` : '-'}
              </p>
            </div>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>
                Outstanding Balance
              </p>
              <p className='text-lg font-bold text-orange-600'>
                {formatCurrency(loan.outstandingBalance || 0)}
              </p>
            </div>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>
                Total Payable
              </p>
              <p className='text-lg font-bold'>
                {formatCurrency(loan.totalPayable || 0)}
              </p>
            </div>
            <div className='bg-card rounded-lg border border-border p-4'>
              <p className='text-xs text-muted-foreground mb-1'>Due Date</p>
              <p className='text-lg font-bold'>{formatDate(loan.dueDate)}</p>
            </div>
          </div>

          {/* Purpose & Notes */}
          {loan.purpose && (
            <div className='bg-muted/30 rounded-lg p-4'>
              <p className='text-xs text-muted-foreground mb-2'>Purpose</p>
              <p className='text-sm'>{loan.purpose}</p>
            </div>
          )}

          {loan.notes && (
            <div className='bg-muted/30 rounded-lg p-4'>
              <p className='text-xs text-muted-foreground mb-2'>Notes</p>
              <p className='text-sm'>{loan.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className='bg-muted/30 rounded-lg p-4'>
            <h3 className='text-sm font-semibold mb-4'>Timeline</h3>
            <div className='space-y-3'>
              {loan.requestedAt && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Requested</span>
                  <span>{formatDateTime(loan.requestedAt)}</span>
                </div>
              )}
              {loan.approvedAt && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Approved</span>
                  <span>{formatDateTime(loan.approvedAt)}</span>
                </div>
              )}
              {loan.disbursedAt && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Disbursed</span>
                  <span>{formatDateTime(loan.disbursedAt)}</span>
                </div>
              )}
              {loan.completedAt && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Completed</span>
                  <span>{formatDateTime(loan.completedAt)}</span>
                </div>
              )}
              {loan.defaultedAt && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Defaulted</span>
                  <span className='text-destructive'>
                    {formatDateTime(loan.defaultedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Repayment History */}
          {loan.repayments && loan.repayments.length > 0 && (
            <div className='bg-muted/30 rounded-lg p-4'>
              <h3 className='text-sm font-semibold mb-4'>Repayment History</h3>
              <div className='overflow-x-auto'>
                <Table className='text-sm'>
                  <TableHeader>
                    <TableRow className='border-b border-border'>
                      <TableHead className='h-8'>Date</TableHead>
                      <TableHead className='h-8'>Amount</TableHead>
                      <TableHead className='h-8'>Method</TableHead>
                      <TableHead className='h-8'>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loan.repayments.map(repayment => (
                      <TableRow
                        key={repayment.id}
                        className='border-b border-border/50'
                      >
                        <TableCell className='py-2'>
                          {formatDate(repayment.paymentDate)}
                        </TableCell>
                        <TableCell className='py-2 font-medium'>
                          {formatCurrency(repayment.amount)}
                        </TableCell>
                        <TableCell className='py-2 text-xs'>
                          {repayment.method}
                        </TableCell>
                        <TableCell className='py-2 text-xs font-mono'>
                          {repayment.reference || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
