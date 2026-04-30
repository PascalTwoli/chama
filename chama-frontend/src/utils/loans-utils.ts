import { LoanStatus } from '../models/loans';

// Status styling
export const getStatusBadgeVariant = (status: LoanStatus) => {
  switch (status) {
    case 'REQUESTED':
      return {
        variant: 'secondary',
        color:
          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      };
    case 'UNDER_REVIEW':
      return {
        variant: 'default',
        color:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      };
    case 'APPROVED':
      return {
        variant: 'default',
        color:
          'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      };
    case 'DISBURSED':
    case 'ACTIVE':
      return {
        variant: 'success',
        color:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      };
    case 'OVERDUE':
      return {
        variant: 'warning',
        color:
          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      };
    case 'REPAID':
    case 'COMPLETED':
      return {
        variant: 'success',
        color:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    case 'DEFAULTED':
      return {
        variant: 'destructive',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      };
    case 'REJECTED':
      return {
        variant: 'destructive',
        color:
          'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      };
    case 'CANCELLED':
      return {
        variant: 'secondary',
        color:
          'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
      };
    default:
      return { variant: 'secondary', color: 'bg-gray-100 text-gray-800' };
  }
};

export const getStatusLabel = (status: LoanStatus): string => {
  switch (status) {
    case 'REQUESTED':
      return 'Requested';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'APPROVED':
      return 'Approved';
    case 'DISBURSED':
      return 'Disbursed';
    case 'ACTIVE':
      return 'Active';
    case 'OVERDUE':
      return 'Overdue';
    case 'REPAID':
      return 'Repaid';
    case 'COMPLETED':
      return 'Completed';
    case 'DEFAULTED':
      return 'Defaulted';
    case 'REJECTED':
      return 'Rejected';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

// Available actions per status
export const getAvailableActions = (status: LoanStatus): string[] => {
  switch (status) {
    case 'REQUESTED':
    case 'UNDER_REVIEW':
      return ['review', 'approve', 'reject', 'view'];
    case 'APPROVED':
      return ['disburse', 'reject', 'view'];
    case 'DISBURSED':
    case 'ACTIVE':
    case 'OVERDUE':
      return ['repayment', 'default', 'view'];
    case 'COMPLETED':
    case 'DEFAULTED':
    case 'REPAID':
    case 'REJECTED':
    case 'CANCELLED':
      return ['view'];
    default:
      return ['view'];
  }
};

// Format currency to KSh
export const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return 'KSh 0';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get initials from name
export const getInitials = (name: string | undefined): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Deterministic color from name
export const getAvatarColor = (
  name: string | undefined
): { bg: string; text: string } => {
  if (!name) {
    return { bg: 'rgba(148, 163, 184, 0.2)', text: '#334155' };
  }

  const colors = [
    { bg: 'rgba(59, 130, 246, 0.15)', text: '#2563eb' },
    { bg: 'rgba(236, 72, 153, 0.15)', text: '#db2777' },
    { bg: 'rgba(249, 115, 22, 0.15)', text: '#ea580c' },
    { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a' },
    { bg: 'rgba(139, 92, 246, 0.15)', text: '#7c3aed' },
    { bg: 'rgba(20, 184, 166, 0.15)', text: '#0d9488' },
    { bg: 'rgba(99, 102, 241, 0.15)', text: '#4f46e5' },
    { bg: 'rgba(234, 179, 8, 0.15)', text: '#ca8a04' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Calculate loan summary
export const calculateLoanSummary = (
  principal: number,
  interestRate: number,
  durationMonths: number
) => {
  const monthlyRate = interestRate / 100 / 12;
  const interestAmount =
    (principal * interestRate * (durationMonths / 12)) / 100;
  const totalPayable = principal + interestAmount;
  const monthlyPayment = totalPayable / durationMonths;

  return {
    interestAmount: Math.round(interestAmount),
    totalPayable: Math.round(totalPayable),
    monthlyPayment: Math.round(monthlyPayment),
  };
};
