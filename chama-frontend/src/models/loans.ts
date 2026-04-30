// Loan Status Enum
export type LoanStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DISBURSED'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'REPAID'
  | 'COMPLETED'
  | 'DEFAULTED'
  | 'REJECTED'
  | 'CANCELLED';

export type PaymentMethod = 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'OTHER';

// Borrower DTO
export interface LoanBorrower {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Repayment DTO
export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

// Main Loan Response DTO
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
  status: LoanStatus;
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

// Paginated Loans Response
export interface PaginatedLoans {
  loans: Loan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Loan Stats DTO
export interface LoanStats {
  totalDisbursed: number;
  activeLoans: number;
  outstandingBalance: number;
  overdueLoans: number;
  completedLoans: number;
  defaultedLoans: number;
  interestEarned: number;
}

// Request DTOs
export interface CreateLoanDto {
  chamaId: string;
  borrowerId: string;
  requestedAmount: number;
  durationMonths: number;
  purpose?: string;
  notes?: string;
  autoApprove?: boolean;
}

// Admin Direct Loan Creation DTO
export interface AdminCreateLoanDto {
  chamaId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  purpose?: string;
  notes?: string;
  status?: LoanStatus;
  startDate?: string;
}

export interface ApproveLoanDto {
  chamaId: string;
  approvedAmount: number;
  interestRate?: number;
  durationMonths?: number;
  notes?: string;
}

export interface RejectLoanDto {
  chamaId: string;
  reason?: string;
}

export interface DisburseLoanDto {
  startDate: string;
}

export interface RecordRepaymentDto {
  amount: number;
  paymentDate?: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface MarkDefaultedDto {
  chamaId: string;
  notes?: string;
}

// Query Parameters
export interface LoanQueryParams {
  chamaId: string;
  status?: LoanStatus;
  search?: string;
  borrowerId?: string;
  page?: number;
  limit?: number;
}

// Filter Options for UI
export interface LoanFilterOptions {
  status: LoanStatus | 'ALL';
  search: string;
  page: number;
}
