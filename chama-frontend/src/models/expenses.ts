// Expense models and DTOs
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

export interface PaginatedExpensesDto {
  data: ExpenseResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseStatsDto {
  totalExpenses: number;
  thisMonthExpenses: number;
  largestExpense: number;
  topCategory: string;
}

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
