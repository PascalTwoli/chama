import { Injectable, Logger } from '@nestjs/common';
import { TreasurySummaryDto } from './dto/treasury-summary.dto';
import { FinanceService } from '../finance/finance.service';

interface CurrentUserType {
  id: string;
  email: string;
}

@Injectable()
export class TreasuryService {
  private readonly logger = new Logger(TreasuryService.name);

  constructor(private readonly financeService: FinanceService) {}

  /**
   * Get treasury summary with balance, total contributions, expenses, and loan flows.
   * Treasury Balance = Contributions - Expenses - Loans Disbursed + Loan Repayments
   */
  async getTreasurySummary(
    currentUser: CurrentUserType,
    chamaId: string,
  ): Promise<TreasurySummaryDto> {
    try {
      const summary = await this.financeService.getSummary(
        chamaId,
        currentUser.id,
      );

      return {
        treasuryBalance: summary.treasuryBalance,
        totalContributions: summary.totalContributions,
        totalExpenses: summary.totalExpenses,
        totalLoansDisbursed: summary.totalLoansDisbursed,
        totalLoanRepayments: summary.totalLoanRepayments,
        totalInterestEarned: summary.totalInterestEarned,
        netWorth: summary.netWorth,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch treasury summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
