import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { transaction_type, transaction_status } from '@prisma/client';
import { ChamaSettingsService } from '../chama-settings/chama-settings.service';

export interface DashboardResponse {
  totalSavings: number;
  totalMembers: number;
  thisMonthTotal: number;
  pendingPaymentsCount: number;
  monthlyContributions: { month: string; amount: number }[];
  contributionDistribution: { name: string; value: number; color: string }[];
  recentContributions: {
    id: string;
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
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chamaSettingsService: ChamaSettingsService,
  ) {}

  async getDashboard(
    chamaId: string,
    userId: string,
  ): Promise<DashboardResponse> {
    // Verify chama exists and user is a member in parallel
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

    // Run all queries concurrently
    const [
      totalSavings,
      totalMembers,
      thisMonthTotal,
      monthlyContributions,
      recentContributions,
      membersWithTx,
      settings,
    ] = await Promise.all([
      this.getTotalSavings(chamaId),
      this.getTotalMembers(chamaId),
      this.getThisMonthTotal(chamaId),
      this.getMonthlyContributions(chamaId),
      this.getRecentContributions(chamaId),
      this.getMembersWithTransactions(chamaId),
      this.chamaSettingsService.getSettingsByChamaId(chamaId),
    ]);

    const expectedContribution = settings?.contribution_amount ?? 0;
    const dueDay = settings?.due_day ?? 0;
    const gracePeriod = settings?.grace_period_days ?? 0;

    // Compute per-member status and pending count
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const dayOfMonth = now.getDate();
    const deadline = dueDay + gracePeriod;

    let pendingPaymentsCount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let lateCount = 0;

    const membersOverview = membersWithTx.map((m) => {
      // Sum CONTRIBUTION transactions for this member in the current month
      const thisMonthPaid = m.transactions
        .filter(
          (tx) =>
            tx.type === transaction_type.CONTRIBUTION &&
            tx.status === transaction_status.COMPLETED &&
            tx.createdAt.getMonth() === currentMonth &&
            tx.createdAt.getFullYear() === currentYear,
        )
        .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

      // All-time contribution savings
      const allTimeSavings = m.transactions
        .filter(
          (tx) =>
            tx.type === transaction_type.CONTRIBUTION &&
            tx.status === transaction_status.COMPLETED,
        )
        .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

      let status: string;
      if (expectedContribution > 0 && thisMonthPaid >= expectedContribution) {
        status = 'Paid';
        paidCount++;
      } else if (deadline > 0 && dayOfMonth > deadline) {
        status = 'Late';
        lateCount++;
        pendingPaymentsCount++;
      } else {
        status = 'Pending';
        pendingCount++;
        pendingPaymentsCount++;
      }

      return {
        id: m.userId,
        name: m.userName || 'Unknown',
        phone: m.userPhone || '',
        savings: allTimeSavings,
        status,
      };
    });

    // Contribution distribution as percentages
    const total = paidCount + pendingCount + lateCount;
    const contributionDistribution = [
      {
        name: 'Paid on Time',
        value: total > 0 ? Math.round((paidCount / total) * 100) : 0,
        color: '#22c55e',
      },
      {
        name: 'Pending',
        value: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
        color: '#f59e0b',
      },
      {
        name: 'Paid Late',
        value: total > 0 ? Math.round((lateCount / total) * 100) : 0,
        color: '#dc2626',
      },
    ];

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

  private async getTotalSavings(chamaId: string): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        type: transaction_type.CONTRIBUTION,
        status: transaction_status.COMPLETED,
      },
      _sum: { amount: true },
    });
    return result._sum.amount?.toNumber() ?? 0;
  }

  private async getTotalMembers(chamaId: string): Promise<number> {
    return this.prisma.membership.count({
      where: { chama_id: chamaId },
    });
  }

  private async getThisMonthTotal(chamaId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        type: transaction_type.CONTRIBUTION,
        status: transaction_status.COMPLETED,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    });
    return result._sum.amount?.toNumber() ?? 0;
  }

  private async getMonthlyContributions(
    chamaId: string,
  ): Promise<{ month: string; amount: number }[]> {
    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthQueries = Array.from({ length: 6 }, (_, idx) => {
      const i = 5 - idx;
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      return this.prisma.transaction
        .aggregate({
          where: {
            chama_id: chamaId,
            type: transaction_type.CONTRIBUTION,
            status: transaction_status.COMPLETED,
            createdAt: { gte: start, lte: end },
          },
          _sum: { amount: true },
        })
        .then((result) => ({
          month: monthNames[d.getMonth()],
          amount: result._sum.amount?.toNumber() ?? 0,
        }));
    });

    return Promise.all(monthQueries);
  }

  private async getRecentContributions(
    chamaId: string,
  ): Promise<
    { id: string; name: string; date: string; amount: number; status: string }[]
  > {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        chama_id: chamaId,
        type: transaction_type.CONTRIBUTION,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      name: tx.user?.name || 'Unknown',
      date: tx.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: tx.amount.toNumber(),
      status: tx.status === transaction_status.COMPLETED ? 'Paid' : 'Pending',
    }));
  }

  private async getMembersWithTransactions(chamaId: string): Promise<
    {
      userId: string;
      userName: string | null;
      userPhone: string | null;
      transactions: {
        type: transaction_type;
        status: transaction_status;
        amount: { toNumber: () => number };
        createdAt: Date;
      }[];
    }[]
  > {
    const memberships = await this.prisma.membership.findMany({
      where: { chama_id: chamaId },
      include: {
        user: {
          include: {
            transaction: {
              where: {
                chama_id: chamaId,
                type: transaction_type.CONTRIBUTION,
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      userId: m.user_id,
      userName: m.user.name,
      userPhone: m.user.phone,
      transactions: m.user.transaction,
    }));
  }
}
