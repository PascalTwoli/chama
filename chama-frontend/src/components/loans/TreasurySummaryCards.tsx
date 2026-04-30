import { Wallet, ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { StatsCard } from '../StatsCard';
import { formatCurrency } from '../../utils/loans-utils';
import { TreasurySummary } from '../../services/treasury/treasury-service';

interface TreasurySummaryCardsProps {
  summary: TreasurySummary | undefined;
  isLoading: boolean;
}

export function TreasurySummaryCards({
  summary,
  isLoading,
}: TreasurySummaryCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-card rounded-lg border border-border h-24 animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatsCard
        title='Treasury Balance'
        value={formatCurrency(summary.treasuryBalance)}
        icon={Wallet}
        status='default'
      />
      <StatsCard
        title='Loans Disbursed'
        value={formatCurrency(summary.totalLoansDisbursed)}
        icon={ArrowDownRight}
        status='destructive'
      />
      <StatsCard
        title='Loan Repayments'
        value={formatCurrency(summary.totalLoanRepayments)}
        icon={ArrowUpRight}
        status='success'
      />
      <StatsCard
        title='Interest Earned'
        value={formatCurrency(summary.totalInterestEarned)}
        icon={TrendingUp}
        status='success'
      />
    </div>
  );
}
