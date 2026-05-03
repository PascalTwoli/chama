import { Injectable } from '@nestjs/common';
import {
  ContributionPaymentStatus,
  ContributionPeriodStatus,
  ContributionTimeliness,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const memberSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
} satisfies Prisma.userSelect;

const obligationInclude = {
  user: { select: memberSelect },
  payments: {
    orderBy: { paid_at: 'desc' as const },
    take: 1,
  },
} satisfies Prisma.contribution_obligationInclude;

export type ObligationWithUser = Prisma.contribution_obligationGetPayload<{
  include: typeof obligationInclude;
}>;

@Injectable()
export class ContributionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Periods ──────────────────────────────────────────────────────────────────

  async findOpenPeriod(chamaId: string) {
    return this.prisma.contribution_period.findFirst({
      where: { chama_id: chamaId, status: ContributionPeriodStatus.OPEN },
      include: { obligations: { include: obligationInclude } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPeriodById(periodId: string) {
    return this.prisma.contribution_period.findUnique({
      where: { id: periodId },
      include: { obligations: { include: obligationInclude } },
    });
  }

  async findPeriods(
    chamaId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contribution_period.findMany({
        where: { chama_id: chamaId },
        orderBy: { start_date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contribution_period.count({ where: { chama_id: chamaId } }),
    ]);
    return { data, total };
  }

  async createPeriod(
    data: Prisma.contribution_periodUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.contribution_period.create({ data });
  }

  async closePeriod(periodId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.contribution_period.update({
      where: { id: periodId },
      data: { status: ContributionPeriodStatus.CLOSED },
    });
  }

  // ─── Obligations ──────────────────────────────────────────────────────────────

  async findObligation(periodId: string, userId: string) {
    return this.prisma.contribution_obligation.findUnique({
      where: { period_id_user_id: { period_id: periodId, user_id: userId } },
      include: obligationInclude,
    });
  }

  async findObligationsForPeriod(periodId: string) {
    return this.prisma.contribution_obligation.findMany({
      where: { period_id: periodId },
      include: obligationInclude,
      orderBy: { user: { name: 'asc' } },
    });
  }

  async findLastObligationForMember(chamaId: string, userId: string) {
    return this.prisma.contribution_obligation.findFirst({
      where: {
        chama_id: chamaId,
        user_id: userId,
        period: { status: ContributionPeriodStatus.CLOSED },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createObligation(
    data: Prisma.contribution_obligationUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.contribution_obligation.create({ data });
  }

  async updateObligation(
    obligationId: string,
    data: Prisma.contribution_obligationUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.contribution_obligation.update({
      where: { id: obligationId },
      data,
    });
  }

  async markOverdueObligations(periodId: string, dueDate: Date) {
    const now = new Date();
    if (now <= dueDate) return;

    await this.prisma.contribution_obligation.updateMany({
      where: {
        period_id: periodId,
        outstanding_balance: { gt: 0 },
        timeliness: { not: ContributionTimeliness.OVERDUE },
        status: { not: ContributionPaymentStatus.COMPLETED },
      },
      data: { timeliness: ContributionTimeliness.OVERDUE },
    });
  }

  // ─── Payments ─────────────────────────────────────────────────────────────────

  async createPayment(
    data: Prisma.contribution_paymentUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.contribution_payment.create({ data });
  }

  async findPayments(
    chamaId: string,
    filters: {
      periodId?: string;
      from?: Date;
      to?: Date;
      userId?: string;
    },
    page: number,
    limit: number,
  ) {
    const where: Prisma.contribution_paymentWhereInput = {
      chama_id: chamaId,
      ...(filters.periodId && {
        obligation: { period_id: filters.periodId },
      }),
      ...(filters.userId && { user_id: filters.userId }),
      ...(filters.from || filters.to
        ? {
            paid_at: {
              ...(filters.from && { gte: filters.from }),
              ...(filters.to && { lte: filters.to }),
            },
          }
        : {}),
    };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contribution_payment.findMany({
        where,
        orderBy: { paid_at: 'desc' },
        skip,
        take: limit,
        include: { user: { select: memberSelect } },
      }),
      this.prisma.contribution_payment.count({ where }),
    ]);

    return { data, total };
  }

  async sumPaymentsForPeriod(periodId: string): Promise<number> {
    const result = await this.prisma.contribution_payment.aggregate({
      where: { obligation: { period_id: periodId } },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  // ─── Stats helpers ────────────────────────────────────────────────────────────

  async getObligationCounts(periodId: string) {
    const [completed, partial, pending, overdue, totals] = await Promise.all([
      this.prisma.contribution_obligation.count({
        where: { period_id: periodId, status: ContributionPaymentStatus.COMPLETED },
      }),
      this.prisma.contribution_obligation.count({
        where: { period_id: periodId, status: ContributionPaymentStatus.PARTIAL },
      }),
      this.prisma.contribution_obligation.count({
        where: { period_id: periodId, status: ContributionPaymentStatus.PENDING },
      }),
      this.prisma.contribution_obligation.count({
        where: {
          period_id: periodId,
          timeliness: ContributionTimeliness.OVERDUE,
          status: { not: ContributionPaymentStatus.COMPLETED },
        },
      }),
      this.prisma.contribution_obligation.aggregate({
        where: { period_id: periodId },
        _sum: {
          required_amount: true,
          paid_amount: true,
          outstanding_balance: true,
          carry_forward_debt: true,
          carry_forward_credit: true,
        },
      }),
    ]);

    return {
      completed,
      partial,
      pending,
      overdue,
      totalRequired: Number(totals._sum.required_amount ?? 0),
      totalPaid: Number(totals._sum.paid_amount ?? 0),
      totalOutstanding: Number(totals._sum.outstanding_balance ?? 0),
      totalDebt: Number(totals._sum.carry_forward_debt ?? 0),
      totalCredit: Number(totals._sum.carry_forward_credit ?? 0),
    };
  }

  async getActiveMembers(chamaId: string) {
    return this.prisma.membership.findMany({
      where: { chama_id: chamaId },
      include: { user: { select: memberSelect } },
    });
  }
}
