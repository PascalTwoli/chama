import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { ExpensesService } from '../services/expenses';
import { CreateExpenseDto, ExpenseCategory } from '../models/expenses';
import { AlertCircle, Loader } from 'lucide-react';
import { showSuccessToast } from '../utils/toast';

export interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  chamaId: string;
}

export function RecordExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  chamaId,
}: RecordExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateExpenseDto>({
    defaultValues: {
      description: '',
      amount: '',
      categoryId: '',
      paidTo: '',
      paymentMethod: 'MPESA',
      expenseDate: new Date().toISOString(),
      referenceNumber: '',
      notes: '',
    },
  });

  const loadCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const cats = await ExpensesService.getCategories(chamaId);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [chamaId]);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, loadCategories]);

  const onSubmit = async (data: CreateExpenseDto) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert date string (YYYY-MM-DD) to ISO 8601 format with time
      const expenseDateObj = new Date(data.expenseDate);
      // Set to noon UTC to avoid timezone issues
      const isoDate = new Date(
        expenseDateObj.getUTCFullYear(),
        expenseDateObj.getUTCMonth(),
        expenseDateObj.getUTCDate(),
        12,
        0,
        0,
        0
      ).toISOString();

      // Send only the required fields in the correct format
      const payload = {
        description: data.description,
        amount: data.amount.toString(), // Keep as string for Decimal validation
        categoryId: data.categoryId,
        paidTo: data.paidTo,
        paymentMethod: data.paymentMethod,
        expenseDate: isoDate, // Use ISO 8601 format
        referenceNumber: data.referenceNumber || null,
        notes: data.notes || null,
      };

      await ExpensesService.createExpense(chamaId, payload as CreateExpenseDto);
      reset();
      showSuccessToast('Expense recorded successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='right-0 overflow-y-auto p-6'>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-2xl font-bold m-0'>
            Record New Expense
          </DialogTitle>
          <DialogDescription className='text-sm m-0'>
            Add a new expense to the Chama records
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {error && (
            <div className='flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg'>
              <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
            </div>
          )}

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description' className='text-sm font-semibold'>
              Description *
            </Label>
            <Input
              id='description'
              placeholder='e.g., Meeting venue rental'
              {...register('description', {
                required: 'Description is required',
              })}
              disabled={isLoading}
              className='h-9 text-sm'
            />
            {errors.description && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className='space-y-2'>
            <Label htmlFor='amount' className='text-sm font-semibold'>
              Amount (KSh) *
            </Label>
            <Input
              id='amount'
              type='number'
              step='0.01'
              placeholder='0.00'
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
              disabled={isLoading}
              className='h-9 text-sm'
            />
            {errors.amount && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <Label htmlFor='categoryId' className='text-sm font-semibold'>
              Category *
            </Label>
            <Controller
              name='categoryId'
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <>
                  <Select
                    id='categoryId'
                    {...field}
                    disabled={isLoading || isLoadingCategories}
                    error={errors.categoryId?.message}
                  >
                    <option value=''>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </>
              )}
            />
            {errors.categoryId && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Paid To */}
          <div className='space-y-2'>
            <Label htmlFor='paidTo' className='text-sm font-semibold'>
              Paid To *
            </Label>
            <Input
              id='paidTo'
              placeholder='e.g., Safari Park Hotel'
              {...register('paidTo', { required: 'Paid To is required' })}
              disabled={isLoading}
              className='h-9 text-sm'
            />
            {errors.paidTo && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.paidTo.message}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className='space-y-2'>
            <Label htmlFor='paymentMethod' className='text-sm font-semibold'>
              Payment Method *
            </Label>
            <Controller
              name='paymentMethod'
              control={control}
              rules={{ required: 'Payment method is required' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    id='paymentMethod'
                    disabled={isLoading}
                    error={errors.paymentMethod?.message}
                  >
                    <option value='MPESA'>M-Pesa</option>
                    <option value='BANK_TRANSFER'>Bank Transfer</option>
                    <option value='CASH'>Cash</option>
                    <option value='OTHER'>Other</option>
                  </Select>
                </>
              )}
            />
            {errors.paymentMethod && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Expense Date */}
          <div className='space-y-2'>
            <Label htmlFor='expenseDate' className='text-sm font-semibold'>
              Date *
            </Label>
            <Input
              id='expenseDate'
              type='date'
              {...register('expenseDate', {
                required: 'Date is required',
              })}
              disabled={isLoading}
              className='h-9 text-sm'
            />
            {errors.expenseDate && (
              <p className='text-xs text-red-500 font-medium'>
                {errors.expenseDate.message}
              </p>
            )}
          </div>

          {/* Reference Number - Optional */}
          <div className='space-y-2'>
            <Label htmlFor='referenceNumber' className='text-sm font-semibold'>
              Reference Number{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (Optional)
              </span>
            </Label>
            <Input
              id='referenceNumber'
              placeholder='e.g., TXN123456'
              {...register('referenceNumber')}
              disabled={isLoading}
              className='h-9 text-sm'
            />
          </div>

          {/* Notes - Optional */}
          <div className='space-y-2'>
            <Label htmlFor='notes' className='text-sm font-semibold'>
              Notes{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (Optional)
              </span>
            </Label>
            <textarea
              id='notes'
              placeholder='Additional details...'
              {...register('notes')}
              disabled={isLoading}
              className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm'
              rows={3}
            />
          </div>

          <DialogFooter className='gap-3 pt-4 border-t border-border mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
              className='font-medium'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='gap-2 bg-blue-600 hover:bg-blue-700 font-medium'
            >
              {isLoading && <Loader className='w-4 h-4 animate-spin' />}
              {isLoading ? 'Recording...' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
