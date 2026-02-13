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
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Search,
} from 'lucide-react';
import { cn } from '../utils/cn';

// Mock Data
type ContributionStatus = 'Completed' | 'Pending' | 'Late';

interface Contribution {
  id: string;
  member: {
    name: string;
    initials: string; // Could be derived
    color: string; // For avatar bg
  };
  amount: number;
  date: string;
  method: 'M-Pesa' | 'Cash' | 'Bank Transfer';
  status: ContributionStatus;
}

const mockContributions: Contribution[] = [
  {
    id: '1',
    member: {
      name: 'John Kamau',
      initials: 'JK',
      color: 'bg-blue-100 text-blue-600',
    },
    amount: 5000,
    date: '15 Jan 2026',
    method: 'M-Pesa',
    status: 'Completed',
  },
  {
    id: '2',
    member: {
      name: 'Mary Wanjiku',
      initials: 'MW',
      color: 'bg-purple-100 text-purple-600',
    },
    amount: 5000,
    date: '14 Jan 2026',
    method: 'M-Pesa',
    status: 'Completed',
  },
  {
    id: '3',
    member: {
      name: 'Peter Ochieng',
      initials: 'PO',
      color: 'bg-green-100 text-green-600',
    },
    amount: 3500,
    date: '16 Jan 2026',
    method: 'Cash',
    status: 'Completed',
  },
  {
    id: '4',
    member: {
      name: 'Grace Akinyi',
      initials: 'GA',
      color: 'bg-orange-100 text-orange-600',
    },
    amount: 5000,
    date: '10 Jan 2026',
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: '5',
    member: {
      name: 'David Mwangi',
      initials: 'DM',
      color: 'bg-red-100 text-red-600',
    },
    amount: 5000,
    date: '17 Jan 2026',
    method: 'M-Pesa',
    status: 'Pending',
  },
  {
    id: '6',
    member: {
      name: 'Sarah Njeri',
      initials: 'SN',
      color: 'bg-indigo-100 text-indigo-600',
    },
    amount: 5000,
    date: '3 Jan 2026',
    method: 'M-Pesa',
    status: 'Late',
  },
  {
    id: '7',
    member: {
      name: 'John Kamau',
      initials: 'JK',
      color: 'bg-blue-100 text-blue-600',
    },
    amount: 5000,
    date: '14 Dec 2025',
    method: 'M-Pesa',
    status: 'Completed',
  },
  {
    id: '8',
    member: {
      name: 'Mary Wanjiku',
      initials: 'MW',
      color: 'bg-purple-100 text-purple-600',
    },
    amount: 5000,
    date: '15 Dec 2025',
    method: 'M-Pesa',
    status: 'Completed',
  },
];

export default function ContributionsPage() {
  const [filterStatus, setFilterStatus] = useState<ContributionStatus | 'All'>(
    'All'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContributions = mockContributions.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ContributionStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant='success' className='gap-1'>
            <CheckCircle2 className='w-3 h-3' /> Completed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant='warning' className='gap-1'>
            <Clock className='w-3 h-3' /> Pending
          </Badge>
        );
      case 'Late':
        return (
          <Badge variant='destructive' className='gap-1'>
            <AlertCircle className='w-3 h-3' /> Late
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <PageHeader
        title='Contributions'
        subtitle='Track all member contributions'
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Download className='w-4 h-4' />
            Export CSV
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Collected'
          value='KSh 28,500'
          icon={Wallet}
          status='success'
          className='bg-card'
        />
        <StatsCard
          title='Completed'
          value='6'
          icon={CheckCircle2}
          status='success'
        />
        <StatsCard title='Pending' value='1' icon={Clock} status='warning' />
        <StatsCard
          title='Late'
          value='1'
          icon={AlertCircle}
          status='destructive'
        />
      </div>

      {/* Main Content Card */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        {/* Table Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 border-b border-border gap-4'>
          <div>
            <h3 className='font-semibold text-lg m-0'>Contribution History</h3>
            <p className='text-sm text-muted-foreground m-0'>All contributions from all members</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center'>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search members...'
                className='pl-9'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto overflow-x-auto'>
              {['All', 'Completed', 'Pending', 'Late'].map(status => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterStatus(status as any)}
                  className={cn(
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContributions.map(contribution => (
                <TableRow key={contribution.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                          contribution.member.color
                        )}
                      >
                        {contribution.member.initials}
                      </div>
                      <span className='font-medium'>
                        {contribution.member.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='font-semibold'>
                    KSh {contribution.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {contribution.date}
                  </TableCell>
                  <TableCell>
                    <div className='inline-flex items-center px-2 py-1 rounded border border-border bg-muted/50 text-xs font-medium'>
                      {contribution.method}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contribution.status)}</TableCell>
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
          {filteredContributions.length === 0 && (
            <div className='p-12 text-center text-muted-foreground'>
              No contributions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
