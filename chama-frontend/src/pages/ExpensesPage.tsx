import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatsCard } from '../components/StatsCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Plus,
  Wallet,
  TrendingDown,
  DollarSign,
  FileText,
  Eye,
  Search,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Expense {
  id: string;
  description: string;
  category: string;
  categoryType:
    | 'Administrative'
    | 'Welfare'
    | 'Investment'
    | 'Purchase'
    | 'Reimbursement'; // For badge color
  payee: string; // "Paid To"
  amount: number;
  date: string;
  receiptId: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Meeting venue rental',
    category: 'Administrative',
    categoryType: 'Administrative',
    payee: 'Safari Park Hotel',
    amount: 5000,
    date: '15 Jan 2026',
    receiptId: 'RCP-2026-001',
  },
  {
    id: '2',
    description: 'Member welfare - Medical assistance',
    category: 'Welfare',
    categoryType: 'Welfare',
    payee: 'Grace Akinyi',
    amount: 15000,
    date: '12 Jan 2026',
    receiptId: '',
  },
  {
    id: '3',
    description: 'Treasury bond investment',
    category: 'Investment',
    categoryType: 'Investment',
    payee: 'Central Bank of Kenya',
    amount: 200000,
    date: '10 Jan 2026',
    receiptId: '',
  },
  {
    id: '4',
    description: 'Stationery and printing',
    category: 'Purchase',
    categoryType: 'Purchase',
    payee: 'City Stationers',
    amount: 2500,
    date: '8 Jan 2026',
    receiptId: 'RCP-2026-002',
  },
  {
    id: '5',
    description: 'Transport reimbursement',
    category: 'Reimbursement',
    categoryType: 'Reimbursement',
    payee: 'Peter Ochieng',
    amount: 1500,
    date: '5 Jan 2026',
    receiptId: '',
  },
];

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = mockExpenses.filter(
    e =>
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (type: string) => {
    // Colors based on screenshot: Admin=Orange/Yellow, Welfare=Pink, Investment=Green, Purchase=Purple, Reimbursement=Blue
    const styles: Record<string, string> = {
      Administrative:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      Welfare:
        'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      Investment:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      Purchase:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      Reimbursement:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    };

    return (
      <span
        className={cn(
          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
          styles[type] || 'bg-gray-100 text-gray-800'
        )}
      >
        {type}
      </span>
    );
  };

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Expense Tracking'
        subtitle='Track and manage Chama expenses'
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Plus className='w-4 h-4' />
            Record Expense
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Expenses'
          value='KSh 224,000'
          icon={TrendingDown}
          status='destructive' // Red trend arrow icon wrapper in screenshot
        />
        <StatsCard
          title='This Month'
          value='KSh 0'
          icon={Wallet} // Calendar icon in screenshot? Maybe Calendar. Using Wallet/Calendar.
          status='warning' // Yellow icon bg
        />
        <StatsCard
          title='Investments'
          value='KSh 200,000'
          icon={DollarSign}
          status='success'
        />
        <StatsCard
          title='Total Entries'
          value='5'
          icon={FileText} // Receipt icon
          status='default' // Blue icon bg in screenshot? Default usually gray, maybe 'info' later.
          className='text-blue-600' // manual override? No, StatsCard handles status. I'll stick to default structure.
        />
      </div>

      {/* Main Content */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        {/* Toolbar & Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 border-b border-border gap-4'>
          <div>
            <h3 className='font-semibold text-lg'>Expense History</h3>
            <p className='text-sm text-muted-foreground'>
              All recorded Chama expenses
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center'>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search expenses...'
                className='pl-9'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant='outline' className='w-full sm:w-auto'>
              All Categories
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Paid To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{expense.description}</span>
                    {expense.receiptId && (
                      <span className='text-xs text-muted-foreground'>
                        {expense.receiptId}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className='font-bold text-destructive'>
                  -KSh {expense.amount.toLocaleString()}
                </TableCell>
                <TableCell>{getCategoryBadge(expense.categoryType)}</TableCell>
                <TableCell>{expense.payee}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {expense.date}
                </TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm' className='gap-2 h-8'>
                    <Eye className='w-4 h-4' />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
