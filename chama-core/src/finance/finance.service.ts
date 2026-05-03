import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LoanStatus,
  Prisma,
  transaction_direction,
  transaction_status,
  transaction_type,
} from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ChamaSettingsService } from '../chama-settings/chama-settings.service';
import {
  CashflowPointDto,
  ExpenseBreakdownDto,
  FinanceSummaryDto,
} from './dto/financial-summary.dto';
import { FinanceRepository } from './finance.repository';

interface TransactionRecordInput {
  type: transaction_type;
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  referenceType?: string;
  direction?: transaction_direction;
  meta?: Prisma.InputJsonValue;
  status?: transaction_status;
}

@Injectable()
export class FinanceService {
  private readonly legacyTypeMap = new Map<transaction_type, transaction_type>([
    [transaction_type.LOAN, transaction_type.LOAN_DISBURSEMENT],
    [
      transaction_type.LOAN_REPAYMENT,
      transaction_type.LOAN_REPAYMENT_PRINCIPAL,
    ],
    [transaction_type.INVESTMENT, transaction_type.INVESTMENT_OUT],
    [transaction_type.RETURN, transaction_type.INVESTMENT_RETURN],
  ]);

  private readonly directionByType: Record<
    transaction_type,
    transaction_direction
  > = {
    [transaction_type.CONTRIBUTION]: transaction_direction.CREDIT,
    [transaction_type.EXPENSE]: transaction_direction.DEBIT,
    [transaction_type.LOAN_DISBURSEMENT]: transaction_direction.DEBIT,
    [transaction_type.LOAN_REPAYMENT_PRINCIPAL]: transaction_direction.CREDIT,
    [transaction_type.LOAN_INTEREST]: transaction_direction.CREDIT,
    [transaction_type.INVESTMENT_OUT]: transaction_direction.DEBIT,
    [transaction_type.INVESTMENT_RETURN]: transaction_direction.CREDIT,
    [transaction_type.WITHDRAWAL]: transaction_direction.DEBIT,
    [transaction_type.ADJUSTMENT]: transaction_direction.CREDIT,
    [transaction_type.FEE]: transaction_direction.DEBIT,
    [transaction_type.REFUND]: transaction_direction.CREDIT,
    // Legacy values
    [transaction_type.LOAN]: transaction_direction.DEBIT,
    [transaction_type.LOAN_REPAYMENT]: transaction_direction.CREDIT,
    [transaction_type.INVESTMENT]: transaction_direction.DEBIT,
    [transaction_type.RETURN]: transaction_direction.CREDIT,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: FinanceRepository,
    private readonly chamaSettingsService: ChamaSettingsService,
  ) {}

  normalizeType(type: transaction_type): transaction_type {
    return this.legacyTypeMap.get(type) ?? type;
  }

  resolveDirection(
    type: transaction_type,
    provided?: transaction_direction,
  ): transaction_direction {
    const expected = this.directionByType[type];

    if (type === transaction_type.ADJUSTMENT && provided) {
      return provided;
    }

    if (provided && provided !== expected) {
      throw new BadRequestException(
        `Direction '${provided}' does not match type '${type}'`,
      );
    }

    return expected;
  }

  async recordTransaction(
    input: TransactionRecordInput,
    options?: { tx?: Prisma.TransactionClient },
  ) {
    const client = options?.tx ?? this.prisma;
    const normalizedType = this.normalizeType(input.type);
    const direction = this.resolveDirection(normalizedType, input.direction);

    if (input.reference) {
      const existing = await client.transaction.findFirst({
        where: {
          chama_id: input.chamaId,
          type: normalizedType,
          reference: input.reference,
        },
      });

      if (existing) {
        return existing;
      }
    }

    return client.transaction.create({
      data: {
        id: crypto.randomUUID(),
        type: normalizedType,
        direction,
        amount: input.amount,
        chama_id: input.chamaId,
        user_id: input.userId,
        description: input.description,
        reference: input.reference,
        reference_type: input.referenceType,
        meta: input.meta,
        status: input.status ?? transaction_status.COMPLETED,
        updatedAt: new Date(),
      },
    });
  }

  async getSummary(
    chamaId: string,
    userId: string,
  ): Promise<FinanceSummaryDto> {
    await this.verifyChamaExists(chamaId);
    await this.verifyMembership(userId, chamaId);

    const [
      totalContributions,
      totalExpenses,
      totalLoansDisbursed,
      totalLoanRepayments,
      totalInterestEarned,
      totalOtherDebits,
      totalOtherCredits,
      outstandingResult,
      activeLoansCount,
      overdueLoansCount,
      defaultedLoansCount,
    ] = await Promise.all([
      this.repository.sumByTypes(chamaId, [transaction_type.CONTRIBUTION]),
      this.repository.sumByTypes(chamaId, [transaction_type.EXPENSE, transaction_type.FEE]),
      this.repository.sumByTypes(chamaId, [
        transaction_type.LOAN_DISBURSEMENT,
        transaction_type.LOAN,
      ]),
      this.repository.sumByTypes(chamaId, [
        transaction_type.LOAN_REPAYMENT_PRINCIPAL,
        transaction_type.LOAN_INTEREST,
        transaction_type.LOAN_REPAYMENT,
      ]),
      this.repository.sumByTypes(chamaId, [transaction_type.LOAN_INTEREST]),
      // Additional debits not covered by named categories
      this.repository.sumByTypes(chamaId, [
        transaction_type.WITHDRAWAL,
        transaction_type.INVESTMENT_OUT,
      ]),
      // Additional credits not covered by named categories
      this.repository.sumByTypes(chamaId, [
        transaction_type.REFUND,
        transaction_type.INVESTMENT_RETURN,
      ]),
      this.prisma.loan.aggregate({
        where: {
          chamaId,
          status: {
            in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE, LoanStatus.DISBURSED],
          },
        },
        _sum: { outstandingBalance: true },
      }),
      this.prisma.loan.count({
        where: { chamaId, status: { in: [LoanStatus.ACTIVE, LoanStatus.DISBURSED] } },
      }),
      this.prisma.loan.count({ where: { chamaId, status: LoanStatus.OVERDUE } }),
      this.prisma.loan.count({ where: { chamaId, status: LoanStatus.DEFAULTED } }),
    ]);

    // Treasury = all credits - all debits (covers every transaction type)
    const treasuryBalance =
      totalContributions +
      totalLoanRepayments +
      totalOtherCredits -
      totalExpenses -
      totalLoansDisbursed -
      totalOtherDebits;

    const outstandingLoans = Number(outstandingResult._sum.outstandingBalance ?? 0);

    return {
      treasuryBalance,
      totalContributions,
      totalExpenses,
      totalLoansDisbursed,
      totalLoanRepayments,
      totalInterestEarned,
      outstandingLoans,
      activeLoansCount,
      overdueLoansCount,
      defaultedLoansCount,
      netWorth: treasuryBalance + outstandingLoans,
    };
  }

  async getCashflow(
    chamaId: string,
    userId: string,
    months = 12,
  ): Promise<CashflowPointDto[]> {
    await this.verifyChamaExists(chamaId);
    await this.verifyMembership(userId, chamaId);

    const safeMonths = Math.min(Math.max(months, 1), 24);
    const now = new Date();
    const monthBuckets: Array<{
      start: Date;
      end: Date;
      label: string;
    }> = [];

    for (let i = safeMonths - 1; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthBuckets.push({ start, end, label });
    }

    const results = await Promise.all(
      monthBuckets.map(async bucket => {
        const [income, expenses, loansOut, repayments] = await Promise.all([
          this.repository.sumByTypesInRange(
            chamaId,
            [transaction_type.CONTRIBUTION],
            bucket.start,
            bucket.end,
          ),
          this.repository.sumByTypesInRange(
            chamaId,
            [transaction_type.EXPENSE, transaction_type.FEE],
            bucket.start,
            bucket.end,
          ),
          this.repository.sumByTypesInRange(
            chamaId,
            [
              transaction_type.LOAN_DISBURSEMENT,
              transaction_type.LOAN,
              transaction_type.INVESTMENT_OUT,
              transaction_type.WITHDRAWAL,
            ],
            bucket.start,
            bucket.end,
          ),
          this.repository.sumByTypesInRange(
            chamaId,
            [
              transaction_type.LOAN_REPAYMENT_PRINCIPAL,
              transaction_type.LOAN_INTEREST,
              transaction_type.LOAN_REPAYMENT,
              transaction_type.REFUND,
              transaction_type.INVESTMENT_RETURN,
            ],
            bucket.start,
            bucket.end,
          ),
        ]);

        return {
          month: bucket.label,
          income,
          expenses,
          loansOut,
          repayments,
          net: income + repayments - expenses - loansOut,
        };
      }),
    );

    return results;
  }

  async getExpenseBreakdown(
    chamaId: string,
    userId: string,
  ): Promise<ExpenseBreakdownDto> {
    await this.verifyChamaExists(chamaId);
    await this.verifyMembership(userId, chamaId);

    const items = await this.repository.getExpenseBreakdown(chamaId, [
      transaction_type.EXPENSE,
    ]);
    const total = items.reduce((sum, item) => sum + item.total, 0);

    return { total, items };
  }

  async getExpenseStats(
    chamaId: string,
    userId: string,
  ): Promise<{
    totalExpenses: number;
    thisMonthExpenses: number;
    largestExpense: number;
    topCategory: string;
  }> {
    await this.verifyChamaExists(chamaId);
    await this.verifyMembership(userId, chamaId);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [totalExpenses, thisMonthExpenses, largestExpense, breakdown] =
      await Promise.all([
        this.repository.sumByTypes(chamaId, [transaction_type.EXPENSE]),
        this.repository.sumByTypesInRange(
          chamaId,
          [transaction_type.EXPENSE],
          monthStart,
          monthEnd,
        ),
        this.repository.getLargestExpense(chamaId, [transaction_type.EXPENSE]),
        this.repository.getExpenseBreakdown(chamaId, [
          transaction_type.EXPENSE,
        ]),
      ]);

    return {
      totalExpenses,
      thisMonthExpenses,
      largestExpense,
      topCategory: breakdown[0]?.categoryName ?? 'N/A',
    };
  }

  async getContributionOverview(chamaId: string) {
    const [
      totalSavings,
      thisMonthTotal,
      monthlyContributions,
      recentContributions,
      membersWithTx,
      settings,
    ] = await Promise.all([
      this.repository.sumByTypes(chamaId, [transaction_type.CONTRIBUTION]),
      this.getThisMonthContributions(chamaId),
      this.getMonthlyContributions(chamaId),
      this.getRecentContributions(chamaId),
      this.repository.findMembersWithContributionTransactions(chamaId),
      this.chamaSettingsService.getSettingsByChamaId(chamaId),
    ]);

    const expectedContribution = settings?.contribution_amount ?? 0;
    const dueDay = settings?.due_day ?? 0;
    const gracePeriod = settings?.grace_period_days ?? 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const dayOfMonth = now.getDate();
    const deadline = dueDay + gracePeriod;

    let pendingPaymentsCount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let lateCount = 0;

    const membersOverview = membersWithTx.map(m => {
      const completedContributions = m.user.transaction.filter(
        tx =>
          tx.type === transaction_type.CONTRIBUTION &&
          tx.status === transaction_status.COMPLETED,
      );

      const thisMonthPaid = completedContributions
        .filter(
          tx =>
            tx.createdAt.getMonth() === currentMonth &&
            tx.createdAt.getFullYear() === currentYear,
        )
        .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

      const allTimeSavings = completedContributions.reduce(
        (sum, tx) => sum + tx.amount.toNumber(),
        0,
      );

      const sortedContributions = [...completedContributions].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      const lastPayment = sortedContributions[0];
      const lastPaymentDate = lastPayment
        ? lastPayment.createdAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : null;
      const lastPaymentAmount = lastPayment
        ? lastPayment.amount.toNumber()
        : null;

      let averageMonthly = 0;
      if (completedContributions.length > 0) {
        const monthlyTotals = new Map<string, number>();
        completedContributions.forEach(tx => {
          const key = `${tx.createdAt.getFullYear()}-${tx.createdAt.getMonth()}`;
          const current = monthlyTotals.get(key) || 0;
          monthlyTotals.set(key, current + tx.amount.toNumber());
        });
        const totalMonths = monthlyTotals.size;
        if (totalMonths > 0) {
          const totalAmount = Array.from(monthlyTotals.values()).reduce(
            (sum, amt) => sum + amt,
            0,
          );
          averageMonthly = Math.round(totalAmount / totalMonths);
        }
      }

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
        id: m.user_id,
        name: m.user.name || 'Unknown',
        phone: m.user.phone || '',
        savings: allTimeSavings,
        status,
        lastPaymentDate,
        lastPaymentAmount,
        averageMonthly,
        totalTransactions: completedContributions.length,
      };
    });

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
      thisMonthTotal,
      monthlyContributions,
      recentContributions,
      membersOverview,
      contributionDistribution,
      pendingPaymentsCount,
    };
  }

  private async getThisMonthContributions(chamaId: string): Promise<number> {
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

    return this.repository.sumByTypesInRange(
      chamaId,
      [transaction_type.CONTRIBUTION],
      startOfMonth,
      endOfMonth,
    );
  }

  private async getMonthlyContributions(
    chamaId: string,
  ): Promise<{ month: string; amount: number }[]> {
    const now = new Date();
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

      return this.repository
        .sumByTypesInRange(chamaId, [transaction_type.CONTRIBUTION], start, end)
        .then(amount => ({
          month: monthNames[d.getMonth()],
          amount,
        }));
    });

    return Promise.all(monthQueries);
  }

  private async getRecentContributions(chamaId: string) {
    const transactions = await this.repository.findRecentTransactionsByType(
      chamaId,
      transaction_type.CONTRIBUTION,
      5,
    );

    return transactions.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
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

  private async verifyMembership(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: { user_id: userId, chama_id: chamaId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
    }
  }

  private async verifyChamaExists(chamaId: string): Promise<void> {
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }
  }
}
