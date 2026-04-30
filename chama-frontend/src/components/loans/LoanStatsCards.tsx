import { StatsCard } from '../StatsCard';
import {
  Banknote,
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  Clock,
} from 'lucide-react';
import { LoanStats } from '../../models/loans';
import { formatCurrency } from '../../utils/loans-utils';

interface LoanStatsCardsProps {
  stats: LoanStats | undefined;
  isLoading: boolean;
}

export function LoanStatsCards({ stats, isLoading }: LoanStatsCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='bg-card rounded-lg border border-border h-24 animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <StatsCard
        title='Total Disbursed'
        value={formatCurrency(stats.totalDisbursed)}
        icon={Banknote}
        status='default'
      />
      <StatsCard
        title='Active Loans'
        value={stats.activeLoans.toString()}
        icon={Users}
        status='default'
      />
      <StatsCard
        title='Outstanding Balance'
        value={formatCurrency(stats.outstandingBalance)}
        icon={BarChart3}
        status='warning'
      />
      <StatsCard
        title='Overdue Loans'
        value={stats.overdueLoans.toString()}
        icon={Clock}
        status='warning'
      />
      <StatsCard
        title='Interest Earned'
        value={formatCurrency(stats.interestEarned)}
        icon={TrendingUp}
        status='success'
      />
      <StatsCard
        title='Defaulted'
        value={stats.defaultedLoans.toString()}
        icon={AlertTriangle}
        status='destructive'
      />
    </div>
  );
}
