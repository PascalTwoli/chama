import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TreasurySummaryDto } from './dto/treasury-summary.dto';
import { ExpenseStatus } from '@prisma/client';

interface CurrentUserType {
  id: string;
  email: string;
}

@Injectable()
export class TreasuryService {
  private readonly logger = new Logger(TreasuryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify user is member of chama
   */
  private async verifyMembership(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        user_id: userId,
        chama_id: chamaId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
    }
  }

  /**
   * Verify chama exists
   */
  private async verifyChamaExists(chamaId: string): Promise<void> {
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }
  }

  /**
   * Get treasury summary with balance, total contributions, and total expenses
   * Treasury Balance = Total Contributions - Total Approved Expenses
   */
  async getTreasurySummary(
    currentUser: CurrentUserType,
    chamaId: string,
  ): Promise<TreasurySummaryDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    try {
      // Get total contributions using aggregate (only COMPLETED contributions count)
      const contributionResult = await this.prisma.contribution.aggregate({
        where: {
          chama_id: chamaId,
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      });

      const totalContributions = contributionResult._sum?.amount
        ? parseFloat(contributionResult._sum.amount.toString())
        : 0;

      // Get total approved expenses using aggregate
      const expenseResult = await this.prisma.expense.aggregate({
        where: {
          chamaId,
          status: ExpenseStatus.APPROVED,
        },
        _sum: { amount: true },
      });

      const totalExpenses = expenseResult._sum?.amount
        ? parseFloat(expenseResult._sum.amount.toString())
        : 0;

      // Calculate treasury balance
      const treasuryBalance = totalContributions - totalExpenses;

      return {
        treasuryBalance,
        totalContributions,
        totalExpenses,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch treasury summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
