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
  Banknote,
  Users,
  TrendingUp,
  AlertTriangle,
  Eye,
  Search,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Loan {
  id: string;
  member: {
    name: string;
    initials: string;
    color: string;
  };
  principal: number;
  interest: number;
  balance: number;
  dueDate: string;
  status: 'Active' | 'Defaulted' | 'Completed' | 'Pending';
}

const mockLoans: Loan[] = [
  {
    id: '1',
    member: {
      name: 'Peter Ochieng',
      initials: 'PO',
      color: 'bg-green-100 text-green-600',
    },
    principal: 50000,
    interest: 5000,
    balance: 55000,
    dueDate: '15 Feb 2026',
    status: 'Active',
  },
  {
    id: '2',
    member: {
      name: 'Grace Akinyi',
      initials: 'GA',
      color: 'bg-orange-100 text-orange-600',
    },
    principal: 20000,
    interest: 2000,
    balance: 22000,
    dueDate: '10 Feb 2026',
    status: 'Active',
  },
  {
    id: '3',
    member: {
      name: 'David Mwangi',
      initials: 'DM',
      color: 'bg-red-100 text-red-600',
    },
    principal: 100000,
    interest: 10000,
    balance: 0,
    dueDate: '12 Dec 2025',
    status: 'Completed',
  },
  {
    id: '4',
    member: {
      name: 'Sarah Njeri',
      initials: 'SN',
      color: 'bg-indigo-100 text-indigo-600',
    },
    principal: 30000,
    interest: 3000,
    balance: 33000,
    dueDate: '1 Jan 2026',
    status: 'Defaulted',
  },
];

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLoans = mockLoans.filter(l =>
    l.member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge
            variant='default'
            className='bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200'
          >
            Active
          </Badge>
        );
      case 'Completed':
        return <Badge variant='success'>Completed</Badge>;
      case 'Defaulted':
        return <Badge variant='destructive'>Defaulted</Badge>;
      case 'Pending':
        return <Badge variant='warning'>Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Loans'
        subtitle='Manage member loans'
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Plus className='w-4 h-4' />
            Record Loan
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Disbursed'
          value='KSh 200,000'
          icon={Banknote}
          status='default'
          className='bg-card'
        />
        <StatsCard
          title='Active Loans'
          value='2'
          icon={Users}
          status='warning' // Active implies focus needed? Or standard. Let's use warning for visibility or default. Warning matches "Pending" color often.
        />
        <StatsCard
          title='Interest Earned'
          value='KSh 20,000'
          icon={TrendingUp}
          status='success'
        />
        <StatsCard
          title='Defaulted'
          value='1'
          icon={AlertTriangle}
          status='destructive'
        />
      </div>

      {/* Main Content */}
      <div className='bg-card rounded-lg border border-border shadow-sm pb-4'>
        {/* Toolbar & Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 border-b border-border gap-4'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search loans by member...'
              className='pl-9'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full sm:w-auto overflow-x-auto'>
            <Button variant='outline' size='sm'>
              All Loans
            </Button>
            <Button variant='outline' size='sm'>
              Active
            </Button>
            <Button variant='outline' size='sm'>
              Defaulted
            </Button>
          </div>
        </div>

        <div className='px-6'>
          <Table className='border-collapse'>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-b border-border'>
                <TableHead>Member</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map(loan => (
                <TableRow
                  key={loan.id}
                  className='hover:bg-muted/50 transition-colors border-0'
                >
                  <TableCell className='border-b border-border py-3'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                          loan.member.color
                        )}
                      >
                        {loan.member.initials}
                      </div>
                      <span className='font-medium'>{loan.member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    KSh {loan.principal.toLocaleString()}
                  </TableCell>
                  <TableCell className='text-green-600 border-b border-border py-3'>
                    + KSh {loan.interest.toLocaleString()}
                  </TableCell>
                  <TableCell className='font-bold border-b border-border py-3'>
                    KSh {loan.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground border-b border-border py-3'>
                    {loan.dueDate}
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    {getStatusBadge(loan.status)}
                  </TableCell>
                  <TableCell className='text-right border-b border-border py-3'>
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
    </div>
  );
}
