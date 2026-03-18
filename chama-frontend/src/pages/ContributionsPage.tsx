import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Search,
  Plus,
  Phone,
  Calendar,
} from 'lucide-react';
import { cn } from '../utils/cn';
import TransactionService, {
  Transaction,
} from '../services/transaction/transaction-services';
import { toast } from 'react-toastify';
import ChamaSettingsService, {
  ChamaSettings,
} from '../services/chama/chama-settings-service';
import ChamaMembersService, {
  ChamaMember,
} from '../services/chama/chama-members-service';

type ContributionStatus = 'Completed' | 'Pending' | 'Late';

interface Contribution {
  id: string;
  member: {
    name: string;
    initials: string;
    color: string;
  };
  amount: number;
  date: string;
  method: 'M-Pesa' | 'Cash' | 'Bank Transfer';
  status: ContributionStatus;
  phone?: string;
  reference?: string;
}

// Avatar color helper - returns pastel bg and matching text color
const avatarColors = [
  { bg: 'rgba(59, 130, 246, 0.15)', text: '#2563eb' }, // blue
  { bg: 'rgba(168, 85, 247, 0.15)', text: '#7c3aed' }, // purple
  { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a' }, // green
  { bg: 'rgba(249, 115, 22, 0.15)', text: '#ea580c' }, // orange
  { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626' }, // red
  { bg: 'rgba(99, 102, 241, 0.15)', text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.15)', text: '#db2777' }, // pink
  { bg: 'rgba(20, 184, 166, 0.15)', text: '#0d9488' }, // teal
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

const avatarTailwindColors = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-orange-100 text-orange-600',
  'bg-red-100 text-red-600',
  'bg-indigo-100 text-indigo-600',
  'bg-pink-100 text-pink-600',
  'bg-teal-100 text-teal-600',
];

const getAvatarTailwindColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarTailwindColors[Math.abs(hash) % avatarTailwindColors.length];
};

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
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
};

const getContributionStatusForCycle = (params: {
  totalPaid: number;
  expectedContribution: number;
  dueDay: number | null;
  gracePeriodDays: number | null;
  today: Date;
}): ContributionStatus => {
  const { totalPaid, expectedContribution, dueDay, gracePeriodDays, today } =
    params;

  if (expectedContribution > 0 && totalPaid >= expectedContribution) {
    return 'Completed';
  }

  const due = dueDay ?? 0;
  const grace = gracePeriodDays ?? 0;
  const deadline = due + grace;
  const dayOfMonth = today.getDate();

  if (deadline > 0 && dayOfMonth > deadline) return 'Late';
  return 'Pending';
};

export default function ContributionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chamaId } = useParams<{ chamaId: string }>();

  const [filterStatus, setFilterStatus] = useState<ContributionStatus | 'All'>(
    'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [settings, setSettings] = useState<ChamaSettings | null>(null);
  const [members, setMembers] = useState<ChamaMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleViewContribution = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
  };

  const handleRecordForMember = () => {
    if (selectedContribution) {
      setIsModalOpen(false);
      navigate(`/admin/chamas/${chamaId}/contributions/record-contribution`, {
        state: { memberName: selectedContribution.member.name },
      });
    }
  };

  const handleRecordContribution = () => {
    navigate(`/admin/chamas/${chamaId}/contributions/record-contribution`);
  };

  const loadData = useCallback(async () => {
    if (!chamaId) return;
    try {
      const [settingsRes, membersRes, txRes] = await Promise.all([
        ChamaSettingsService.getSettings(chamaId),
        ChamaMembersService.getChamaMembers(chamaId),
        TransactionService.getTransactionsByChama(chamaId, {
          type: 'CONTRIBUTION',
        }),
      ]);

      setSettings(settingsRes);
      setMembers(membersRes);
      setTransactions(txRes);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to load contribution data'
      );
    }
  }, [chamaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onFocus = () => {
      loadData();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [location.key, loadData]);

  const currentCycleTransactions = useMemo(() => {
    return transactions.filter(
      t => t.type === 'CONTRIBUTION' && isInCurrentMonth(t.createdAt)
    );
  }, [transactions]);

  const byMember = useMemo(() => {
    const map = new Map<
      string,
      {
        totalPaid: number;
        lastPaymentAt: string | null;
        lastReference: string | null;
      }
    >();

    for (const tx of currentCycleTransactions) {
      const existing = map.get(tx.userId) || {
        totalPaid: 0,
        lastPaymentAt: null,
        lastReference: null,
      };

      const amount = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount);
      const nextTotal = existing.totalPaid + (Number.isFinite(amount) ? amount : 0);
      const isNewer =
        !existing.lastPaymentAt ||
        new Date(tx.createdAt).getTime() > new Date(existing.lastPaymentAt).getTime();

      map.set(tx.userId, {
        totalPaid: nextTotal,
        lastPaymentAt: isNewer ? tx.createdAt : existing.lastPaymentAt,
        lastReference:
          isNewer && tx.reference ? tx.reference : existing.lastReference,
      });
    }

    return map;
  }, [currentCycleTransactions]);

  const expectedContribution = settings?.contributionAmount ?? 0;
  const dueDay = settings?.dueDay ?? null;
  const gracePeriodDays = settings?.gracePeriodDays ?? 0;

  const contributions: Contribution[] = useMemo(() => {
    const today = new Date();

    return members.map(m => {
      const name = m.user?.name || 'Unknown Member';
      const initials = getInitials(name);
      const memberTx = byMember.get(m.userId);

      const paidAmount = memberTx?.totalPaid ?? 0;
      const status = getContributionStatusForCycle({
        totalPaid: paidAmount,
        expectedContribution,
        dueDay,
        gracePeriodDays,
        today,
      });

      return {
        id: m.userId,
        member: {
          name,
          initials,
          color: getAvatarTailwindColor(name),
        },
        amount: paidAmount,
        date: memberTx?.lastPaymentAt
          ? formatDisplayDate(memberTx.lastPaymentAt)
          : '-',
        method: 'M-Pesa',
        status,
        phone: m.user?.phone || undefined,
        reference: memberTx?.lastReference || undefined,
      };
    });
  }, [members, byMember, dueDay, gracePeriodDays, expectedContribution]);

  const kpis = useMemo(() => {
    const totalCollected = currentCycleTransactions.reduce((sum, t) => {
      const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const totalExpected = members.length * expectedContribution;

    let completedMembers = 0;
    let pendingMembers = 0;
    let lateMembers = 0;

    for (const c of contributions) {
      if (c.status === 'Completed') completedMembers += 1;
      else if (c.status === 'Late') lateMembers += 1;
      else pendingMembers += 1;
    }

    return {
      totalExpected,
      totalCollected,
      completedMembers,
      pendingMembers,
      lateMembers,
    };
  }, [contributions, currentCycleTransactions, expectedContribution, members.length]);

  const filteredContributions = contributions.filter(c => {
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
          <div className='flex gap-2'>
            <Button variant='outline' className='gap-2'>
              <Download className='w-4 h-4' />
              Export CSV
            </Button>
            <Button
              className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'
              onClick={handleRecordContribution}
            >
              <Plus className='w-4 h-4' />
              Record Contribution
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Collected'
          value={`KSh ${kpis.totalCollected.toLocaleString()}`}
          icon={Wallet}
          status='success'
          className='bg-card'
        />
        <StatsCard
          title='Completed'
          value={kpis.completedMembers.toString()}
          icon={CheckCircle2}
          status='success'
        />
        <StatsCard
          title='Pending'
          value={kpis.pendingMembers.toString()}
          icon={Clock}
          status='warning'
        />
        <StatsCard
          title='Late'
          value={kpis.lateMembers.toString()}
          icon={AlertCircle}
          status='destructive'
        />
      </div>

      {/* Main Content Card */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        {/* Table Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 pb-3 gap-4'>
          <div>
            <h3 className='font-semibold text-lg m-0'>Contribution History</h3>
            <span className='text-sm'>All contributions from all members</span>
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
              {(['All', 'Completed', 'Pending', 'Late'] as const).map(
                status => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {status}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='px-6'>
          <Table className='border-collapse'>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-b border-border'>
                <TableHead className='h-12'>Member</TableHead>
                <TableHead className='h-12'>Amount</TableHead>
                <TableHead className='h-12'>Date</TableHead>
                <TableHead className='h-12'>Method</TableHead>
                <TableHead className='h-12'>Status</TableHead>
                <TableHead className='h-12 text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            {/* reduce the height of the table rows */}
            <TableBody>
              {filteredContributions.map(contribution => (
                <TableRow
                  key={contribution.id}
                  className='hover:bg-muted/50 transition-colors border-0'
                >
                  <TableCell className='border-b border-border py-3'>
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
                  <TableCell className='font-semibold border-b border-border py-3'>
                    KSh {contribution.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className='text-muted-foreground border-b border-border py-3'>
                    {contribution.date}
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    <div className='inline-flex items-center px-2 py-1 rounded border border-border bg-muted/50 text-xs font-medium'>
                      {contribution.method}
                    </div>
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    {getStatusBadge(contribution.status)}
                  </TableCell>
                  <TableCell className='text-right border-b border-border py-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-0 gap-2 h-8'
                      onClick={() => handleViewContribution(contribution)}
                    >
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

      {/* Contribution Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Contribution Details</DialogTitle>
            <DialogDescription>
              View contribution information for this member
            </DialogDescription>
          </DialogHeader>

          {selectedContribution && (
            <div className='space-y-6'>
              {/* Member Info */}
              <div className='flex items-center gap-4'>
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium'
                  style={{
                    backgroundColor: getAvatarColors(
                      selectedContribution.member.name
                    ).bg,
                    color: getAvatarColors(selectedContribution.member.name)
                      .text,
                  }}
                >
                  {getInitials(selectedContribution.member.name)}
                </div>
                <div>
                  <h3 className='font-semibold text-lg'>
                    {selectedContribution.member.name}
                  </h3>
                  <p className='text-sm text-muted-foreground'>Member</p>
                </div>
              </div>

              {/* Contribution Details Grid */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Amount</p>
                  <p className='font-semibold text-lg'>
                    KSh {selectedContribution.amount.toLocaleString()}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <div>{getStatusBadge(selectedContribution.status)}</div>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground flex items-center gap-1'>
                    <Calendar className='w-3 h-3' /> Date
                  </p>
                  <p className='font-medium'>{selectedContribution.date}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    Payment Method
                  </p>
                  <p className='font-medium'>{selectedContribution.method}</p>
                </div>
                {selectedContribution.reference && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      {selectedContribution.method === 'M-Pesa'
                        ? 'M-Pesa Code'
                        : 'Reference'}
                    </p>
                    <p className='font-medium font-mono'>
                      {selectedContribution.reference}
                    </p>
                  </div>
                )}
                {selectedContribution.phone && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground flex items-center gap-1'>
                      <Phone className='w-3 h-3' /> Phone Number
                    </p>
                    <p className='font-medium'>{selectedContribution.phone}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className='pt-4 border-t border-border'>
                <Button
                  className='w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white'
                  onClick={handleRecordForMember}
                >
                  <Plus className='w-4 h-4' />
                  Record Payment for{' '}
                  {selectedContribution.member.name.split(' ')[0]}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
