import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';

export interface DashboardResponse {
  totalSavings: number;
  totalMembers: number;
  thisMonthTotal: number;
  pendingPaymentsCount: number;
  monthlyContributions: { month: string; amount: number }[];
  contributionDistribution: { name: string; value: number; color: string }[];
  recentContributions: {
    id: string;
    userId: string;
    name: string;
    date: string;
    amount: number;
    status: string;
  }[];
  membersOverview: {
    id: string;
    name: string;
    phone: string;
    savings: number;
    status: string;
    lastPaymentDate: string | null;
    lastPaymentAmount: number | null;
    averageMonthly: number;
    totalTransactions: number;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
  ) {}

  async getDashboard(
    chamaId: string,
    userId: string,
  ): Promise<DashboardResponse> {
    const [chama, membershipCheck] = await Promise.all([
      this.prisma.chama.findUnique({ where: { id: chamaId } }),
      this.prisma.membership.findFirst({
        where: { chama_id: chamaId, user_id: userId },
      }),
    ]);

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }
    if (!membershipCheck) {
      throw new ForbiddenException('You are not a member of this chama');
    }

    const [totalMembers, contributionOverview] = await Promise.all([
      this.getTotalMembers(chamaId),
      this.financeService.getContributionOverview(chamaId),
    ]);

    const {
      totalSavings,
      thisMonthTotal,
      monthlyContributions,
      recentContributions,
      membersOverview,
      contributionDistribution,
      pendingPaymentsCount,
    } = contributionOverview;

    return {
      totalSavings,
      totalMembers,
      thisMonthTotal,
      pendingPaymentsCount,
      monthlyContributions,
      contributionDistribution,
      recentContributions,
      membersOverview,
    };
  }

  private async getTotalMembers(chamaId: string): Promise<number> {
    return this.prisma.membership.count({
      where: { chama_id: chamaId },
    });
  }
}
