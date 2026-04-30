import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { ExpenseResponseDto } from '../models/expenses';
import { ExpensesService } from '../services/expenses';
import {
  AlertCircle,
  Loader,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { showSuccessToast } from '../utils/toast';

export interface ViewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
  chamaId: string;
  onSuccess?: () => void;
}

export function ViewExpenseModal({
  isOpen,
  onClose,
  expenseId,
  chamaId,
  onSuccess,
}: ViewExpenseModalProps) {
  const [expense, setExpense] = useState<ExpenseResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const loadExpense = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ExpensesService.getExpenseById(expenseId, chamaId);
      setExpense(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load expense details'
      );
    } finally {
      setIsLoading(false);
    }
  }, [expenseId, chamaId]);

  useEffect(() => {
    if (isOpen && expenseId) {
      loadExpense();
    }
  }, [isOpen, expenseId, loadExpense]);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      setError(null);
      console.log('[ViewExpenseModal] Approving expense:', expenseId, chamaId);
      await ExpensesService.approveExpense(expenseId, chamaId);
      console.log('[ViewExpenseModal] Expense approved successfully');
      showSuccessToast('Expense approved successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to approve expense';
      console.error('[ViewExpenseModal] Error approving expense:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      setError(null);
      console.log('[ViewExpenseModal] Rejecting expense:', expenseId, chamaId);
      await ExpensesService.rejectExpense(expenseId, chamaId);
      console.log('[ViewExpenseModal] Expense rejected successfully');
      showSuccessToast('Expense rejected successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to reject expense';
      console.error('[ViewExpenseModal] Error rejecting expense:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsRejecting(false);
    }
  };

  const getCategoryBadgeStyle = (categoryName: string) => {
    const styles: Record<string, string> = {
      Administrative:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      Welfare:
        'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      Investment:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      Operations:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      Purchase:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      Reimbursements:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      Events:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    };
    return (
      styles[categoryName] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    );
  };

  const getStatusBadgeStyle = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      PENDING:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      REJECTED:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='right-0 overflow-y-auto p-6'>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-xl font-bold m-0'>
            Expense Details
          </DialogTitle>
          <DialogDescription className='text-sm m-0'>
            Complete information about this expense
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className='flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg mb-4'>
            <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader className='w-6 h-6 animate-spin text-blue-600' />
          </div>
        ) : expense ? (
          <div className='space-y-4'>
            {/* Amount Box */}
            <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-900/30'>
              <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                Amount
              </p>
              <p className='text-3xl font-bold text-red-600 dark:text-red-400 m-0'>
                -KSh {expense.amount.toLocaleString()}
              </p>
            </div>

            {/* Category & Date */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-xs font-semibold text-muted-foreground mb-2'>
                  Category
                </p>
                <span
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border inline-block',
                    getCategoryBadgeStyle(expense.category.name)
                  )}
                >
                  {expense.category.name}
                </span>
              </div>
              <div>
                <p className='text-xs font-semibold text-muted-foreground mb-2'>
                  Date
                </p>
                <p className='text-base font-semibold text-foreground m-0'>
                  {new Date(expense.expenseDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className='pt-2'>
              <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                Description
              </p>
              <p className='text-base font-semibold text-foreground m-0'>
                {expense.description}
              </p>
            </div>

            {/* Paid To */}
            <div className='pt-2'>
              <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                Paid To
              </p>
              <p className='text-base font-semibold text-foreground m-0'>
                {expense.paidTo}
              </p>
            </div>

            {/* Payment Method & Reference Code */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='pt-2'>
                <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                  Payment Method
                </p>
                <p className='text-sm font-medium text-foreground m-0'>
                  {expense.paymentMethod}
                </p>
              </div>
              <div className='pt-2'>
                <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                  Reference
                </p>
                <p className='text-sm font-mono text-foreground m-0'>
                  {expense.referenceCode}
                </p>
              </div>
            </div>

            {/* Receipt Number */}
            {expense.referenceNumber && (
              <div className='bg-muted rounded-lg p-3 border border-border'>
                <p className='text-xs font-semibold text-muted-foreground m-0 mb-1'>
                  Receipt Number
                </p>
                <p className='text-sm font-mono font-medium text-foreground m-0'>
                  {expense.referenceNumber}
                </p>
              </div>
            )}

            {/* Status Indicators */}
            {expense.status === 'APPROVED' && expense.approvedAt && (
              <div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0' />
                <div>
                  <p className='text-sm font-semibold text-green-900 dark:text-green-200 m-0'>
                    Approved by {expense.approver?.name || expense.approvedBy || 'Admin'} ({expense.approver?.role || 'Member'})
                  </p>
                </div>
              </div>
            )}

            {expense.status === 'REJECTED' && (
              <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <XCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0' />
                <p className='text-sm font-semibold text-red-900 dark:text-red-200 m-0'>
                  Rejected by {expense.rejector?.name || 'Admin'} ({expense.rejector?.role || 'Member'})
                </p>
              </div>
            )}

            {/* Notes */}
            {expense.notes && (
              <div className='bg-muted/50 rounded-lg p-3 border border-border'>
                <p className='text-xs font-semibold text-muted-foreground m-0 mb-2'>
                  Notes
                </p>
                <p className='text-sm text-foreground m-0'>{expense.notes}</p>
              </div>
            )}

            {/* Attachment */}
            {expense.attachmentUrl && (
              <div className='flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <FileText className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                <a
                  href={expense.attachmentUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium'
                >
                  View Receipt
                </a>
              </div>
            )}

            {/* Approval Information */}
            {expense.status === 'APPROVED' && expense.approvedAt && (
              <div className='flex items-start gap-4 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='font-semibold text-green-900 dark:text-green-200 text-base m-0'>
                    Approved by {expense.approver?.name || expense.approvedBy || 'Admin'}
                  </p>
                  <p className='text-sm text-green-700 dark:text-green-300 m-0 mt-1'>
                    Role: {expense.approver?.role || 'Member'}
                  </p>
                  <p className='text-sm text-green-700 dark:text-green-300 m-0 mt-1'>
                    {new Date(expense.approvedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}

            {expense.status === 'REJECTED' && (
              <div className='flex items-start gap-4 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <XCircle className='w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='font-semibold text-red-900 dark:text-red-200 text-base m-0'>
                    Rejected by {expense.rejector?.name || 'Admin'}
                  </p>
                  <p className='text-sm text-red-700 dark:text-red-300 m-0 mt-1'>
                    Role: {expense.rejector?.role || 'Member'}
                  </p>
                  {expense.rejectedAt && (
                    <p className='text-sm text-red-700 dark:text-red-300 m-0 mt-1'>
                      {new Date(expense.rejectedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Attachment */}
            {expense.attachmentUrl && (
              <div className='flex items-start gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <p className='text-base font-semibold text-blue-900 dark:text-blue-200'>
                    Attachment available
                  </p>
                  <a
                    href={expense.attachmentUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline flex items-center gap-1.5 mt-2 font-medium'
                  >
                    <Eye className='w-4 h-4' /> View Receipt
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter className='gap-3 pt-4 border-t border-border mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isApproving || isRejecting}
            className='font-medium'
          >
            Close
          </Button>

          {expense && expense.status === 'PENDING' && (
            <>
              <Button
                type='button'
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                variant='destructive'
                className='gap-2 font-medium'
              >
                {isRejecting && <Loader className='w-4 h-4 animate-spin' />}
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button
                type='button'
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className='gap-2 bg-green-600 hover:bg-green-700 font-medium'
              >
                {isApproving && <Loader className='w-4 h-4 animate-spin' />}
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            </>
          )}

          {expense && expense.status === 'REJECTED' && (
            <Button
              type='button'
              onClick={handleApprove}
              disabled={isApproving}
              className='gap-2 bg-blue-600 hover:bg-blue-700 font-medium'
            >
              {isApproving && <Loader className='w-4 h-4 animate-spin' />}
              {isApproving ? 'Approving on Appeal...' : 'Approve on Appeal'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
