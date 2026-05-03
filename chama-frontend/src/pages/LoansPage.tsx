import { useState, useContext, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search } from 'lucide-react';
import ChamaMembershipContext from '../context/ChamaMembershipContext';
import { toast } from 'react-toastify';

import {
  Loan,
  LoanStatus,
  LoanFilterOptions,
  PaymentMethod,
} from '../models/loans';
import LoansService from '../services/loans/loans-service';
import ChamaMembersService from '../services/chama/chama-members-service';

// Components
import { LoanStatsCards } from '../components/loans/LoanStatsCards';
import { LoansTable } from '../components/loans/LoansTable';
import { LoanDetailsModal } from '../components/loans/LoanDetailsModal';
import { ApproveLoanModal } from '../components/loans/ApproveLoanModal';
import { RejectLoanModal } from '../components/loans/RejectLoanModal';
import { DisburseLoanModal } from '../components/loans/DisburseLoanModal';
import { RepaymentModal } from '../components/loans/RepaymentModal';
import { DefaultLoanModal } from '../components/loans/DefaultLoanModal';
import {
  CreateLoanModal,
  CreateLoanData,
} from '../components/loans/CreateLoanModal';

const STATUS_FILTERS: Array<{ label: string; value: LoanStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Overdue', value: 'OVERDUE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Defaulted', value: 'DEFAULTED' },
];

export default function LoansPage() {
  const context = useContext(ChamaMembershipContext);
  const chamaId = context?.activeChama?.chamaId;

  // Data fetching
  const [stats, setStats] = useState<any>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [loansLoading, setLoansLoading] = useState(true);
  const [borrowersLoading, setBorrowersLoading] = useState(false);
  const [borrowers, setBorrowers] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);

  // Filters & Pagination
  const [filters, setFilters] = useState<LoanFilterOptions>({
    status: 'ALL',
    search: '',
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Selection
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeModal, setActiveModal] = useState<
    | 'details'
    | 'approve'
    | 'reject'
    | 'disburse'
    | 'repayment'
    | 'default'
    | 'create'
    | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stats
  useEffect(() => {
    if (!chamaId) return;

    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const data = await LoansService.getStats(chamaId);
        setStats(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load loan statistics'
        );
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [chamaId]);

  // Load loans
  useEffect(() => {
    if (!chamaId) return;

    const loadLoans = async () => {
      try {
        setLoansLoading(true);
        const data = await LoansService.getLoans(chamaId, {
          page: filters.page,
          limit: 20,
          status: filters.status === 'ALL' ? undefined : filters.status,
          ...(filters.search ? { search: filters.search } : {}),
        });
        setLoans(data.loans);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load loans'
        );
      } finally {
        setLoansLoading(false);
      }
    };

    // Debounce search
    const timeout = setTimeout(loadLoans, 400);
    return () => clearTimeout(timeout);
  }, [chamaId, filters.status, filters.search, filters.page]);

  // Load borrowers for create loan dropdown
  useEffect(() => {
    if (!chamaId) return;

    const loadBorrowers = async () => {
      try {
        setBorrowersLoading(true);
        const members = await ChamaMembersService.getChamaMembers(chamaId);

        const uniqueBorrowers = new Map<
          string,
          { id: string; name: string; email: string }
        >();

        members.forEach(member => {
          const userId = member.user?.id;
          if (!userId || uniqueBorrowers.has(userId)) return;

          const name =
            member.user.name?.trim() ||
            member.user.email?.trim() ||
            member.user.phone?.trim() ||
            'Unnamed member';
          const email = member.user.email?.trim() || '';

          uniqueBorrowers.set(userId, { id: userId, name, email });
        });

        const sortedBorrowers = Array.from(uniqueBorrowers.values()).sort(
          (a, b) => a.name.localeCompare(b.name)
        );

        setBorrowers(sortedBorrowers);
      } catch (error) {
        console.error('Error fetching borrowers:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load members'
        );
        setBorrowers([]);
      } finally {
        setBorrowersLoading(false);
      }
    };

    loadBorrowers();
  }, [chamaId]);

  // Modal handlers
  const openModal = (modal: typeof activeModal, loan: Loan) => {
    setSelectedLoan(loan);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLoan(null);
  };

  // Reload helper
  const reloadLoans = async () => {
    if (!chamaId) return;
    try {
      const updated = await LoansService.getLoans(chamaId, {
        page: filters.page,
        limit: 20,
        status: filters.status === 'ALL' ? undefined : filters.status,
      });
      setLoans(updated.loans);
      const newStats = await LoansService.getStats(chamaId);
      setStats(newStats);
    } catch (error) {
      console.error('Error reloading loans:', error);
    }
  };

  // Action handlers
  const handleReview = async (loanId: string) => {
    setIsSubmitting(true);
    try {
      await LoansService.reviewLoan(loanId);
      toast.success('Loan moved to under review');
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to review loan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (
    loanId: string,
    data: {
      approvedAmount: number;
      interestRate?: number;
      durationMonths?: number;
      notes?: string;
    }
  ) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.approveLoan(
        loanId,
        chamaId,
        data.approvedAmount,
        data.interestRate,
        data.notes
      );
      toast.success('Loan approved successfully');
      closeModal();
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to approve loan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (loanId: string, reason?: string) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.rejectLoan(loanId, chamaId, reason);
      toast.success('Loan rejected successfully');
      closeModal();
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject loan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisburse = async (
    loanId: string,
    data: { startDate: string }
  ) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.disburseLoan(loanId, data.startDate);
      toast.success('Loan disbursed successfully');
      closeModal();
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to disburse loan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordRepayment = async (
    loanId: string,
    data: {
      amount: number;
      paymentDate?: string;
      method: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.recordRepayment(loanId, data);
      toast.success('Repayment recorded successfully');
      closeModal();
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record repayment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkDefaulted = async (loanId: string, notes?: string) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.markDefaulted(loanId, { chamaId, notes } as any);
      toast.success('Loan marked as defaulted');
      closeModal();
      await reloadLoans();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to mark loan as defaulted'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (data: CreateLoanData) => {
    if (!chamaId) return;
    setIsSubmitting(true);
    try {
      await LoansService.createLoan({
        chamaId,
        borrowerId: data.borrowerId,
        amount: data.amount,
        interestRate: data.interestRate,
        durationMonths: data.durationMonths,
        purpose: data.purpose,
        notes: data.notes,
        status: data.status,
        startDate: data.startDate,
      });
      toast.success('Loan created successfully');
      closeModal();
      await reloadLoans();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!chamaId) {
    return <div className='p-6'>Please select a chama first</div>;
  }

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Loans'
        subtitle='Manage member loans and disbursements'
        action={
          <Button
            onClick={() => setActiveModal('create')}
            className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'
          >
            <Plus className='w-4 h-4' />
            New Loan
          </Button>
        }
      />

      {/* KPI Cards */}
      <LoanStatsCards stats={stats} isLoading={statsLoading} />

      {/* Main Content */}
      <div className='bg-card rounded-lg border border-border shadow-sm pb-4'>
        {/* Toolbar & Filters */}
        <div className='p-6 pb-4 border-b border-border space-y-4'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by borrower name or email...'
              className='pl-9'
              value={filters.search}
              onChange={e =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
            />
          </div>

          <div className='flex gap-2 overflow-x-auto pb-2'>
            {STATUS_FILTERS.map(status => (
              <Button
                key={status.value}
                variant={
                  filters.status === status.value ? 'default' : 'outline'
                }
                size='sm'
                onClick={() =>
                  setFilters({ ...filters, status: status.value, page: 1 })
                }
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className='px-6'>
          <LoansTable
            loans={loans}
            isLoading={loansLoading}
            onView={loan => openModal('details', loan)}
            onReview={loan => handleReview(loan.id)}
            onApprove={loan => openModal('approve', loan)}
            onReject={loan => openModal('reject', loan)}
            onDisburse={loan => openModal('disburse', loan)}
            onRepayment={loan => openModal('repayment', loan)}
            onDefault={loan => openModal('default', loan)}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='px-6 py-4 border-t border-border flex justify-between items-center'>
            <p className='text-sm text-muted-foreground'>
              Page {filters.page} of {totalPages}
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={filters.page === 1 || loansLoading}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={filters.page === totalPages || loansLoading}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LoanDetailsModal
        loan={selectedLoan}
        isOpen={activeModal === 'details'}
        onClose={closeModal}
      />

      <ApproveLoanModal
        loan={selectedLoan}
        isOpen={activeModal === 'approve'}
        isLoading={isSubmitting}
        onClose={closeModal}
        onApprove={handleApprove}
      />

      <RejectLoanModal
        loan={selectedLoan}
        isOpen={activeModal === 'reject'}
        isLoading={isSubmitting}
        onClose={closeModal}
        onReject={handleReject}
      />

      <DisburseLoanModal
        loan={selectedLoan}
        isOpen={activeModal === 'disburse'}
        isLoading={isSubmitting}
        onClose={closeModal}
        onDisburse={handleDisburse}
      />

      <RepaymentModal
        loan={selectedLoan}
        isOpen={activeModal === 'repayment'}
        isLoading={isSubmitting}
        onClose={closeModal}
        onRecord={handleRecordRepayment}
      />

      <DefaultLoanModal
        loan={selectedLoan}
        isOpen={activeModal === 'default'}
        isLoading={isSubmitting}
        onClose={closeModal}
        onDefault={handleMarkDefaulted}
      />

      <CreateLoanModal
        isOpen={activeModal === 'create'}
        onClose={closeModal}
        isLoading={isSubmitting}
        onSubmit={handleCreate}
        borrowers={borrowers}
        isBorrowersLoading={borrowersLoading}
      />
    </div>
  );
}
