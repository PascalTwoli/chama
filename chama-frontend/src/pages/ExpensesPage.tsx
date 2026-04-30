import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format } from 'date-fns';
import { PageHeader } from '../components/PageHeader';
import { StatsCard } from '../components/StatsCard';
import { RecordExpenseModal } from '../components/RecordExpenseModal';
import { ViewExpenseModal } from '../components/ViewExpenseModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import {
  Plus,
  Wallet,
  TrendingDown,
  DollarSign,
  FileText,
  Eye,
  Search,
  Loader,
  AlertCircle,
  CalendarRange,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { ExpensesService } from '../services/expenses';
import {
  ExpenseResponseDto,
  ExpenseStatsDto,
  ExpenseCategory,
} from '../models/expenses';

export default function ExpensesPage() {
  const { chamaId: paramChamaId } = useParams<{ chamaId: string }>();
  const chamaId = paramChamaId || '';

  // State management
  const [expenses, setExpenses] = useState<ExpenseResponseDto[]>([]);
  const [stats, setStats] = useState<ExpenseStatsDto | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [viewExpenseId, setViewExpenseId] = useState<string | null>(null);

  // Load data on mount and when chamaId changes
  useEffect(() => {
    if (!chamaId) return;

    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get ALL expenses without filtering - we'll filter on client side
        const data = await ExpensesService.getExpenses(chamaId, 1, 100, {});
        setExpenses(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load expenses'
        );
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

  const handleRecordSuccess = useCallback(() => {
    // Refresh data after recording expense
    setSelectedCategory('');
    setSelectedStatus('');
    // Reload expenses
    if (chamaId) {
      const reloadExpenses = async () => {
        try {
          setIsLoading(true);
          const data = await ExpensesService.getExpenses(chamaId, 1, 100);
          setExpenses(data.data);
          // Also reload stats
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

  const handleViewSuccess = useCallback(async () => {
    // Close modal and refresh data after approval/rejection
    setViewExpenseId(null);

    // Reload all expenses (no filters)
    if (chamaId) {
      try {
        setIsLoading(true);
        const data = await ExpensesService.getExpenses(chamaId, 1, 100, {});
        setExpenses(data.data);
        // Also reload stats
        const stats = await ExpensesService.getExpenseStats(chamaId);
        setStats(stats);
      } catch (err) {
        console.error('Failed to reload expenses after action:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [chamaId]);

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const datePopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePopoverRef.current && !datePopoverRef.current.contains(e.target as Node)) {
        setDatePopoverOpen(false);
      }
    };
    if (datePopoverOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [datePopoverOpen]);

  const hasDateFilter = !!dateRange?.from;

  const dateBadgeLabel = (() => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d')}`;
    }
    if (dateRange?.from) return format(dateRange.from, 'MMM d, yyyy');
    return null;
  })();

  // Filter expenses by category, status, date range, and search (ALL client-side)
  const filteredExpenses = expenses.filter(e => {
    // Filter by category name (not ID — global vs chama-specific categories have different IDs but same name)
    if (selectedCategory && e.category.name !== selectedCategory) {
      return false;
    }

    // Filter by status
    if (selectedStatus && e.status !== selectedStatus) {
      return false;
    }

    // Filter by date range
    if (dateRange?.from) {
      const expenseDate = new Date(e.expenseDate);
      if (expenseDate < dateRange.from) return false;
      if (dateRange.to) {
        const toEnd = new Date(dateRange.to);
        toEnd.setHours(23, 59, 59, 999);
        if (expenseDate > toEnd) return false;
      }
    }

    // Filter by search query — description, reference code, or amount
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        e.description.toLowerCase().includes(q) ||
        e.referenceCode.toLowerCase().includes(q) ||
        e.amount.toString().includes(q);
      if (!matches) return false;
    }

    return true;
  });

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
      Miscellaneous:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800',
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

  if (!chamaId) {
    return (
      <div className='p-6'>
        <div className='text-center py-12'>
          <AlertCircle className='w-12 h-12 mx-auto text-yellow-600 mb-4' />
          <h2 className='text-lg font-semibold mb-2'>No Chama Selected</h2>
          <p className='text-muted-foreground'>
            Please select a chama to view expenses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Expense Tracking'
        subtitle='Track and manage Chama expenses'
        action={
          <Button
            className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => setIsRecordModalOpen(true)}
          >
            <Plus className='w-4 h-4' />
            Record Expense
          </Button>
        }
      />

      {error && (
        <div className='flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg'>
          <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
          <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {isStatsLoading ? (
          <>
            <div className='h-32 bg-muted rounded-lg animate-pulse' />
            <div className='h-32 bg-muted rounded-lg animate-pulse' />
            <div className='h-32 bg-muted rounded-lg animate-pulse' />
            <div className='h-32 bg-muted rounded-lg animate-pulse' />
          </>
        ) : stats ? (
          <>
            <StatsCard
              title='Total Expenses'
              value={`KSh ${stats.totalExpenses.toLocaleString()}`}
              icon={TrendingDown}
              status='destructive'
            />
            <StatsCard
              title='This Month'
              value={`KSh ${stats.thisMonthExpenses.toLocaleString()}`}
              icon={Wallet}
              status='warning'
            />
            <StatsCard
              title='Largest Expense'
              value={`KSh ${stats.largestExpense.toLocaleString()}`}
              icon={DollarSign}
              status='success'
            />
            <StatsCard
              title='Top Category'
              value={stats.topCategory}
              icon={FileText}
              status='default'
            />
          </>
        ) : null}
      </div>

      {/* Main Content */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        {/* Toolbar & Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 border-b border-border gap-4'>
          <div>
            <h3 className='font-semibold text-lg m-0'>Expense History</h3>
            <p className='text-sm text-muted-foreground m-0'>
              All recorded Chama expenses
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center'>
            <div className='relative w-full sm:w-200'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search expenses...'
                className='pl-9'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories Dropdown */}
            <Select
              value={selectedCategory || ''}
              onChange={e => setSelectedCategory(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({
                  value: cat.name,
                  label: cat.name,
                })),
              ]}
            />

            {/* Status Filter */}
            <Select
              value={selectedStatus || ''}
              onChange={e => setSelectedStatus(e.target.value)}
              options={[
                { value: '', label: 'All' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' },
              ]}
            />

            {/* Date filter popover */}
            <div className='relative' ref={datePopoverRef}>
              <button
                onClick={() => setDatePopoverOpen(prev => !prev)}
                className={cn(
                  'flex items-center gap-1.5 h-10 px-3 rounded-md border text-sm transition-colors whitespace-nowrap',
                  hasDateFilter
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700'
                    : 'border-input bg-background text-muted-foreground hover:text-foreground hover:border-input/80'
                )}
              >
                <CalendarRange className='w-4 h-4 shrink-0' />
                {dateBadgeLabel ?? 'Date'}
                {hasDateFilter && (
                  <span
                    role='button'
                    onClick={e => { e.stopPropagation(); setDateRange(undefined); }}
                    className='ml-1 hover:text-red-500'
                  >
                    <X className='w-3 h-3' />
                  </span>
                )}
              </button>

              {datePopoverOpen && (
                <div className='absolute right-0 top-11 z-50 bg-background border border-border rounded-lg shadow-lg p-3'>
                  <p className='text-xs text-muted-foreground mb-2 px-1'>
                    {dateRange?.from && !dateRange?.to
                      ? 'Click another date to set a range, or click Done'
                      : 'Click a date or drag to select a range'}
                  </p>
                  <DayPicker
                    mode='range'
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                  />
                  <div className='flex justify-between items-center pt-2 border-t border-border mt-1 px-1'>
                    {hasDateFilter ? (
                      <button
                        onClick={() => { setDateRange(undefined); }}
                        className='text-xs text-muted-foreground hover:text-foreground flex items-center gap-1'
                      >
                        <X className='w-3 h-3' />
                        Clear
                      </button>
                    ) : <span />}
                    <button
                      onClick={() => setDatePopoverOpen(false)}
                      className='text-xs font-medium text-blue-600 hover:text-blue-700'
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='px-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader className='w-6 h-6 animate-spin text-blue-600' />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className='text-center py-12'>
              <FileText className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>
                No expenses found. {searchQuery && 'Try adjusting your search.'}
              </p>
            </div>
          ) : (
            <Table className='border-collapse'>
              <TableHeader className='bg-muted/50'>
                <TableRow className='hover:bg-transparent border-b border-border'>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Paid To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map(expense => (
                  <TableRow
                    key={expense.id}
                    className='hover:bg-muted/50 transition-colors border-0'
                  >
                    <TableCell className='border-b border-border py-3'>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {expense.description}
                        </span>
                        {expense.referenceCode && (
                          <span className='text-xs text-muted-foreground'>
                            {expense.referenceCode}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='font-bold text-destructive border-b border-border py-3'>
                      -KSh {expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className='border-b border-border py-3'>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getCategoryBadgeStyle(expense.category.name)
                        )}
                      >
                        {expense.category.name}
                      </span>
                    </TableCell>
                    <TableCell className='border-b border-border py-3'>
                      {expense.paidTo}
                    </TableCell>
                    <TableCell className='border-b border-border py-3'>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getStatusBadgeStyle(expense.status)
                        )}
                      >
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground border-b border-border py-3'>
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right border-b border-border py-3'>
                      <Button
                        size='sm'
                        className='gap-2 h-8 bg-slate-100 text-slate-900 hover:bg-amber-100 hover:text-amber-900 transition-colors dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-amber-600 dark:hover:text-amber-100'
                        onClick={() => setViewExpenseId(expense.id)}
                      >
                        <Eye className='w-4 h-4' />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecordExpenseModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={handleRecordSuccess}
        chamaId={chamaId}
      />

      {viewExpenseId && (
        <ViewExpenseModal
          isOpen={!!viewExpenseId}
          onClose={() => setViewExpenseId(null)}
          expenseId={viewExpenseId}
          chamaId={chamaId}
          onSuccess={handleViewSuccess}
        />
      )}
    </div>
  );
}
