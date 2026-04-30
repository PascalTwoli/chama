# ChamaPlus Frontend Patterns & Architecture Guide

## Overview

This guide documents the established patterns in the ChamaPlus frontend codebase for the Loans feature implementation. All code examples are from existing pages (ExpensesPage, ContributionsPage, LoansPage).

---

## 1. DATA FETCHING & STATE MANAGEMENT PATTERNS

### 1.1 Service Layer Architecture

**File:** [src/services/expenses.ts](src/services/expenses.ts)

```typescript
import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '../config/axios-config';
import {
  ExpenseResponseDto,
  PaginatedExpensesDto,
  ExpenseStatsDto,
} from '../models/expenses';

interface ApiErrorData {
  message?: string;
}

export class ExpensesService {
  // Static methods for API calls
  static async getExpenses(
    chamaId: string,
    page = 1,
    limit = 20,
    filters?: {
      categoryId?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
    }
  ): Promise<PaginatedExpensesDto> {
    try {
      const params = new URLSearchParams({
        chamaId,
        page: page.toString(),
        limit: limit.toString(),
      });

      // Build query string with optional filters
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);

      const response: AxiosResponse<PaginatedExpensesDto> = await apiClient.get(
        `/expenses?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch expenses.');
    }
  }

  static async createExpense(
    chamaId: string,
    data: CreateExpenseDto
  ): Promise<ExpenseResponseDto> {
    try {
      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.post(
        `/expenses?chamaId=${chamaId}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData & {
        message?: string | string[];
      };
      // Handle NestJS validation errors (array format)
      if (Array.isArray(errorData?.message)) {
        const validationErrors = (errorData.message as string[]).join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      }
      throw new Error(
        (errorData?.message as string) || 'Failed to create expense.'
      );
    }
  }
}
```

**Key Patterns:**

- Static class methods for API calls
- Strong typing with DTO models
- Consistent error handling with `AxiosError`
- Handle both single message and array validation errors
- Query parameters via `URLSearchParams`

**For Loans:** Use [src/services/loans/loans-service.ts](src/services/loans/loans-service.ts) as template

---

### 1.2 Page-Level State Management

**File:** [src/pages/ExpensesPage.tsx](src/pages/ExpensesPage.tsx) (lines 36-130)

```typescript
export default function ExpensesPage() {
  const { chamaId: paramChamaId } = useParams<{ chamaId: string }>();
  const chamaId = paramChamaId || '';

  // Data state
  const [expenses, setExpenses] = useState<ExpenseResponseDto[]>([]);
  const [stats, setStats] = useState<ExpenseStatsDto | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [viewExpenseId, setViewExpenseId] = useState<string | null>(null);

  // Load data on mount and when chamaId changes
  useEffect(() => {
    if (!chamaId) return;

    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await ExpensesService.getExpenses(chamaId, 1, 100, {});
        setExpenses(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load expenses');
      } finally {
        setIsLoading(false);
      }
    };

    const loadStats = async () => {
      try {
        setIsStatsLoading(true);
        const data = await ExpensesService.getExpenseStats(chamaId);
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await ExpensesService.getCategories(chamaId);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    void Promise.all([loadExpenses(), loadStats(), loadCategories()]);
  }, [chamaId]);

  // Refresh pattern after mutations
  const handleRecordSuccess = useCallback(() => {
    if (chamaId) {
      const reloadExpenses = async () => {
        try {
          setIsLoading(true);
          const data = await ExpensesService.getExpenses(chamaId, 1, 100);
          setExpenses(data.data);
          const stats = await ExpensesService.getExpenseStats(chamaId);
          setStats(stats);
        } catch (err) {
          console.error('Failed to reload expenses:', err);
        } finally {
          setIsLoading(false);
        }
      };
      reloadExpenses();
    }
  }, [chamaId]);
```

**Key Patterns:**

- Separate state for data, filters, loading, errors, and modals
- `useEffect` with dependency array for data loading
- Error handling in `catch` blocks with state management
- `useCallback` for memoized callback functions
- `Promise.all()` for parallel data loading
- Reload data after successful mutations

---

## 2. REACT QUERY PATTERNS (Future-Ready Setup)

**Dependencies:** [package.json](package.json)

```json
{
  "@tanstack/react-query": "^5.69.0",
  "react-hook-form": "^7.72.0",
  "react-hot-toast": "^2.6.0",
  "react-toastify": "^11.0.5"
}
```

**Note:** React Query is installed but not currently used. Consider adopting for new features like Loans.

---

## 3. MODAL COMPONENT PATTERNS

### 3.1 Dialog/Modal Components

**File:** [src/components/ui/dialog.tsx](src/components/ui/dialog.tsx)

```typescript
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // Support both centered and side-panel layouts
  const isSidePanel = className && className.includes('right-0');

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          isSidePanel
            ? 'fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl gap-4 border-l border-border px-4 py-2 bg-card shadow-lg rounded-none animate-in slide-in-from-right duration-1000 ease-out'
            : 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg sm:rounded-lg',
          !isSidePanel && className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 z-10'>
          <X className='h-4 w-4' />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
```

**Export Pattern:**

```typescript
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

### 3.2 Modal Implementation Pattern

**File:** [src/components/RecordExpenseModal.tsx](src/components/RecordExpenseModal.tsx)

```typescript
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
      // Transform data as needed (e.g., date formatting)
      const expenseDateObj = new Date(data.expenseDate);
      const isoDate = new Date(
        expenseDateObj.getUTCFullYear(),
        expenseDateObj.getUTCMonth(),
        expenseDateObj.getUTCDate(),
        12,
        0,
        0,
        0
      ).toISOString();

      const payload = {
        description: data.description,
        amount: data.amount.toString(),
        categoryId: data.categoryId,
        paidTo: data.paidTo,
        paymentMethod: data.paymentMethod,
        expenseDate: isoDate,
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

          {/* Form fields follow similar pattern */}
          <DialogFooter className='mt-6 flex gap-3 justify-end'>
            <Button variant='outline' onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='gap-2'
            >
              {isLoading && <Loader className='w-4 h-4 animate-spin' />}
              Record Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Key Patterns:**

- Modal as separate component with props interface
- State for loading, error, and form data
- `useCallback` for data loading with dependencies
- Data transformation before sending to API
- Success toast on completion
- Disabled state during loading
- Error display at top of form

### 3.3 View/Read Modal Pattern

**File:** [src/components/ViewExpenseModal.tsx](src/components/ViewExpenseModal.tsx)

```typescript
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
      await ExpensesService.approveExpense(expenseId, chamaId);
      showSuccessToast('Expense approved successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to approve expense';
      setError(errorMsg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      setError(null);
      await ExpensesService.rejectExpense(expenseId, chamaId);
      showSuccessToast('Expense rejected successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to reject expense';
      setError(errorMsg);
    } finally {
      setIsRejecting(false);
    }
  };

  // Render expense details and action buttons
}
```

**Key Differences from Record Modal:**

- Separate loading and action states (`isApproving`, `isRejecting`)
- Data loaded on modal open via `useEffect`
- Multiple action handlers (approve, reject)
- Read-only display with action buttons

---

## 4. TOAST/NOTIFICATION SYSTEM

### 4.1 Toast Utility Setup

**File:** [src/utils/toast.ts](src/utils/toast.ts)

```typescript
import { toast, ToastOptions } from 'react-toastify';

const baseToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className: 'rounded-lg shadow-lg',
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...baseToastOptions,
    className:
      'bg-green-800 border border-green-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-green-400',
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...baseToastOptions,
    className:
      'bg-red-800 border border-red-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-red-400',
    ...options,
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    ...baseToastOptions,
    className:
      'bg-yellow-800 border border-yellow-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-yellow-400',
    ...options,
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...baseToastOptions,
    className:
      'bg-blue-800 border border-blue-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-blue-400',
    ...options,
  });
};
```

### 4.2 Toast Integration in App

**File:** [src/App.tsx](src/App.tsx)

```typescript
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className='App text-base min-h-screen bg-background text-foreground'>
      <AppRoutes />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}
```

### 4.3 Usage in Components

```typescript
import { showSuccessToast, showErrorToast } from '../utils/toast';

// In modal onSubmit
await ExpensesService.createExpense(chamaId, payload);
showSuccessToast('Expense recorded successfully!');
onSuccess();
onClose();
```

**Key Patterns:**

- Centralized toast utility with consistent styling
- Custom colors per toast type
- Base options with customizable overrides
- `react-toastify` for persistent container
- Toast called after successful API operations

---

## 5. FORM VALIDATION PATTERNS

### 5.1 React Hook Form Integration

**Dependencies:** react-hook-form ^7.72.0

```typescript
import { useForm, Controller } from 'react-hook-form';

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
```

### 5.2 Field Registration Pattern

**Simple Inputs:**

```typescript
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
```

**Number Inputs with Validation:**

```typescript
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
```

**Select/Controlled Fields:**

```typescript
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
          <option key={cat.id} value={cat.id}>{cat.name}</option>
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
```

### 5.3 Form Submission

```typescript
const onSubmit = async (data: CreateExpenseDto) => {
  setIsLoading(true);
  setError(null);

  try {
    // Data transformation
    const payload = {
      ...data,
      amount: data.amount.toString(),
    };

    // API call
    await ExpensesService.createExpense(chamaId, payload);

    // Success handling
    reset();
    showSuccessToast('Success message');
    onSuccess();
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to...');
  } finally {
    setIsLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
    {/* fields */}
    <button type='submit' disabled={isLoading}>Submit</button>
  </form>
);
```

**Key Patterns:**

- `useForm` with strongly typed DTO
- `register` for uncontrolled inputs
- `Controller` for complex fields (selects, date pickers)
- Inline error display with custom styling
- Form state disabled during submission
- Error shown above form and per-field

---

## 6. TYPE DEFINITIONS STRUCTURE

### 6.1 Models Directory Organization

**Location:** [src/models/](src/models/)

- `expenses.ts` - Expense-related DTOs
- `chamas.ts` - Chama models
- `user.ts` - User, roles, and permissions

### 6.2 Expense Models Example

**File:** [src/models/expenses.ts](src/models/expenses.ts)

```typescript
// Domain models
export interface ExpenseCategory {
  id: string;
  name: string;
  createdAt: string;
  chamaId?: string | null;
}

export interface UserInfo {
  id: string;
  name: string;
  role: string;
}

export interface ExpenseResponseDto {
  id: string;
  referenceCode: string;
  chamaId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidTo: string;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'OTHER';
  referenceNumber?: string | null;
  expenseDate: string;
  notes?: string | null;
  attachmentUrl?: string | null;
  createdBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string | null;
  approvedAt?: string | null;
  approver?: UserInfo | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejector?: UserInfo | null;
  createdAt: string;
}

// Pagination wrapper
export interface PaginatedExpensesDto {
  data: ExpenseResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics
export interface ExpenseStatsDto {
  totalExpenses: number;
  thisMonthExpenses: number;
  largestExpense: number;
  topCategory: string;
}

// Form submission
export interface CreateExpenseDto {
  description: string;
  amount: string | number;
  categoryId: string;
  paidTo: string;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'OTHER';
  expenseDate: string;
  referenceNumber?: string;
  notes?: string;
}
```

### 6.3 Transaction Service Models

**File:** [src/services/transaction/transaction-services.ts](src/services/transaction/transaction-services.ts)

```typescript
export interface Transaction {
  id: string;
  type:
    | 'CONTRIBUTION'
    | 'WITHDRAWAL'
    | 'LOAN'
    | 'LOAN_REPAYMENT'
    | 'FINE'
    | 'INTEREST';
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateTransactionDto {
  chamaId: string;
  type:
    | 'CONTRIBUTION'
    | 'WITHDRAWAL'
    | 'LOAN'
    | 'LOAN_REPAYMENT'
    | 'FINE'
    | 'INTEREST';
  amount: number;
  description?: string;
  reference?: string;
  userId?: string; // Optional: for admin recording transactions for other members
}

export interface TransactionSummary {
  totalContributions: number;
  totalWithdrawals: number;
  totalLoans: number;
  totalLoanRepayments: number;
  balance: number;
  transactionCount: number;
}
```

### 6.4 Loan Models

**File:** [src/services/loans/loans-service.ts](src/services/loans/loans-service.ts)

```typescript
export interface LoanBorrower {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  method: string;
  reference?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  referenceCode: string;
  chamaId: string;
  borrowerId: string;
  borrower: LoanBorrower;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate?: number;
  durationMonths: number;
  purpose?: string;
  status:
    | 'REQUESTED'
    | 'APPROVED'
    | 'DISBURSED'
    | 'REPAID'
    | 'DEFAULTED'
    | 'REJECTED'
    | 'CANCELLED';
  requestedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  completedAt?: string;
  defaultedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  startDate?: string;
  dueDate?: string;
  principalAmount?: number;
  interestAmount?: number;
  totalPayable?: number;
  outstandingBalance?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  repayments?: LoanRepayment[];
}

export interface PaginatedLoans {
  loans: Loan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoanStats {
  totalDisbursed: number;
  activeLoans: number;
  outstandingBalance: number;
  overdueLoans: number;
  completedLoans: number;
  defaultedLoans: number;
  interestEarned: number;
}
```

---

## 7. UTILITY FUNCTIONS & FORMATTING

### 7.1 Class Name Utility

**File:** [src/utils/cn.ts](src/utils/cn.ts)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**

```typescript
className={cn(
  'text-sm font-medium',
  isLoading && 'opacity-50',
  error && 'text-red-500'
)}
```

### 7.2 Notification Events System

**File:** [src/utils/notification-events.ts](src/utils/notification-events.ts)

```typescript
export const NOTIFICATION_EVENTS = {
  UPDATED: 'notifications:updated',
} as const;

export const dispatchNotificationUpdate = () => {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENTS.UPDATED));
};

export const onNotificationUpdate = (callback: () => void) => {
  window.addEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
  return () =>
    window.removeEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
};
```

**Usage Pattern:**

```typescript
// Dispatch event after marking notifications as read
dispatchNotificationUpdate();

// Listen in component
useEffect(() => {
  const cleanup = onNotificationUpdate(() => {
    // Reload notifications
    loadNotifications();
  });
  return cleanup;
}, []);
```

### 7.3 Date Formatting (ContributionsPage Pattern)

**File:** [src/pages/ContributionsPage.tsx](src/pages/ContributionsPage.tsx) (lines 70-80)

```typescript
const formatDisplayDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const isInCurrentMonth = (isoDate: string): boolean => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};
```

### 7.4 Avatar Color Helper

**File:** [src/pages/ContributionsPage.tsx](src/pages/ContributionsPage.tsx) (lines 40-70)

```typescript
const avatarColors = [
  { bg: 'rgba(59, 130, 246, 0.15)', text: '#2563eb' }, // blue
  { bg: 'rgba(168, 85, 247, 0.15)', text: '#7c3aed' }, // purple
  { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a' }, // green
  { bg: 'rgba(249, 115, 22, 0.15)', text: '#ea580c' }, // orange
  { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626' }, // red
  // ... more colors
];

const getAvatarColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```

### 7.5 Status Badge Styling

**File:** [src/components/ViewExpenseModal.tsx](src/components/ViewExpenseModal.tsx) (lines 100-150)

```typescript
const getCategoryBadgeStyle = (categoryName: string) => {
  const styles: Record<string, string> = {
    Administrative:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    Welfare:
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    Investment:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    // ... more categories
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
```

---

## 8. UI COMPONENT LIBRARY PATTERNS

### 8.1 Available Components

**Location:** [src/components/ui/](src/components/ui/)

| Component | File           | Features                                                                 |
| --------- | -------------- | ------------------------------------------------------------------------ |
| Button    | `button.tsx`   | Variants: default, destructive, outline, secondary, ghost, link, success |
| Input     | `input.tsx`    | Styled text input with focus states                                      |
| Select    | `select.tsx`   | Custom dropdown with keyboard support                                    |
| Dialog    | `dialog.tsx`   | Radix-based modal with centered & side-panel layouts                     |
| Badge     | `badge.tsx`    | Pill-shaped badges with success/warning variants                         |
| Card      | `card.tsx`     | Container with header, content, footer                                   |
| Table     | `table.tsx`    | Semantic table components                                                |
| Tabs      | `tabs.tsx`     | Tabbed interface                                                         |
| Label     | `label.tsx`    | Form field labels                                                        |
| Checkbox  | `checkbox.tsx` | Checkbox input                                                           |

### 8.2 Button Variants

**File:** [src/components/ui/button.tsx](src/components/ui/button.tsx)

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium...',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground hover:bg-success/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
  }
);
```

**Usage:**

```typescript
<Button variant='primary' size='default'>Primary</Button>
<Button variant='outline' size='sm'>Outline Small</Button>
<Button variant='destructive'>Delete</Button>
<Button variant='success' size='lg'>Save</Button>
```

### 8.3 Badge Variants

**File:** [src/components/ui/badge.tsx](src/components/ui/badge.tsx)

```typescript
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold...',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success:
          'border-green-200 dark:border-green-800 bg-green-100 text-green-800...',
        warning:
          'border-warning dark:border-warning/50 bg-warning text-warning-foreground',
      },
    },
  }
);
```

---

## 9. EXISTING COMPONENTS & HELPERS

### 9.1 Page Header Component

**File:** [src/components/PageHeader.tsx](src/components/PageHeader.tsx)

```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {subtitle && <p className='text-muted-foreground mt-1'>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

### 9.2 Stats Card Component

**File:** [src/components/StatsCard.tsx](src/components/StatsCard.tsx)

```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon && <div className='text-muted-foreground'>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {trend && (
          <p className={cn(
            'text-xs',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 10. API CLIENT CONFIGURATION

### 10.1 Axios Configuration

**File:** [src/config/axios-config.ts](src/config/axios-config.ts)

```typescript
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureTokenStorage, { TokenType } from '../utils/secure-token-storage';

export const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5500/api/v1';

export const getAuthToken = (): string | null => {
  return SecureTokenStorage.getAuthToken();
};

export const getRefreshToken = (): string | null => {
  return SecureTokenStorage.getToken('refresh_token' as TokenType);
};

export const setAuthHeader = (
  instance: AxiosInstance,
  token: string | null
): void => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export const refreshAuthToken = async (
  refreshToken: string
): Promise<{ idToken: string; refreshToken?: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE}/auth/refresh-token?refreshToken=${refreshToken}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

---

## 11. SUMMARY: PATTERNS TO REUSE FOR LOANS FEATURE

### Architecture Patterns

✅ **Service Layer** → Static methods with proper error handling
✅ **Page State** → Separate state for data, filters, loading, errors, modals
✅ **Data Loading** → `useEffect` on mount, `Promise.all()` for parallel requests
✅ **Refresh Pattern** → Reload data after mutations with `useCallback`

### UI Components

✅ **Modals** → Dialog (Radix-based), DialogContent, DialogHeader/Footer
✅ **Forms** → React Hook Form with `useForm`, `register`, `Controller`
✅ **Inputs** → Input, Select, Label from ui/ folder
✅ **Display** → Badge, Button, StatsCard, PageHeader

### State Management

✅ **Modal State** → `isOpen`, `setIsOpen` for each modal
✅ **Action States** → Separate states for approve, reject, etc.
✅ **Error Handling** → Try-catch with consistent error messages
✅ **Loading States** → Separate `isLoading` and action-specific states

### Notifications

✅ **Toasts** → `showSuccessToast()`, `showErrorToast()` from utils
✅ **Error Display** → AlertCircle icon with error message at top of form

### Types & Models

✅ **DTOs** → Request (Create*, Update*) and Response (*ResponseDto, *Dto)
✅ **Pagination** → `PaginatedDto` with data, total, page, limit, totalPages
✅ **Stats** → Separate \*StatsDto for summary metrics
✅ **Enums** → String literals for status values

### Utilities

✅ **cn()** → Class name merging with clsx + twMerge
✅ **formatDate()** → Date formatting with locale support
✅ **getInitials()** → Extract initials from names
✅ **getAvatarColors()** → Deterministic color assignment
✅ **getBadgeStyle()** → Mapping status to Tailwind classes

---

## 12. FILES TO REFERENCE

**Core Files for Loans Implementation:**

1. [src/services/loans/loans-service.ts](src/services/loans/loans-service.ts) - Existing loan service
2. [src/pages/LoansPage.tsx](src/pages/LoansPage.tsx) - Page structure
3. [src/pages/ExpensesPage.tsx](src/pages/ExpensesPage.tsx) - Data loading pattern
4. [src/pages/ContributionsPage.tsx](src/pages/ContributionsPage.tsx) - Form & table patterns
5. [src/components/RecordExpenseModal.tsx](src/components/RecordExpenseModal.tsx) - Form modal template
6. [src/components/ViewExpenseModal.tsx](src/components/ViewExpenseModal.tsx) - View/action modal template
7. [src/models/expenses.ts](src/models/expenses.ts) - Type structure template
8. [src/utils/toast.ts](src/utils/toast.ts) - Notification setup
9. [src/config/axios-config.ts](src/config/axios-config.ts) - API configuration

---

## 13. RECOMMENDED NEXT STEPS FOR LOANS FEATURE

1. **Extend LoanService** with pagination, filtering, and action methods
2. **Create TypeScript DTOs** for loan creation/updates following expense model
3. **Build Record Loan Modal** using RecordExpenseModal as template
4. **Enhance LoansPage** with table and filtering from ExpensesPage pattern
5. **Add Loan Repayment Modal** for recording payments
6. **Implement Loan Status Badges** using ViewExpenseModal's badge system
7. **Add Loan Statistics Cards** using StatsCard component
8. **Setup Form Validation** using react-hook-form with loan-specific rules
