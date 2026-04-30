import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanStatus, PaymentMethod, Prisma, loan, loan_repayment } from '@prisma/client';

export type LoanWithRelations = loan & {
  borrower: { id: string; name: string | null; email: string | null; phone: string | null };
  repayments?: loan_repayment[];
};

const borrowerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
} as const;

const loanInclude = {
  borrower: { select: borrowerSelect },
} satisfies Prisma.loanInclude;

const loanWithRepaymentsInclude = {
  borrower: { select: borrowerSelect },
  repayments: { orderBy: { paymentDate: 'desc' as const } },
} satisfies Prisma.loanInclude;

@Injectable()
export class LoansRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateReferenceCode(chamaId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.loan.count({
      where: { chamaId, createdAt: { gte: new Date(`${year}-01-01`) } },
    });
    return `LOAN-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  async create(data: Prisma.loanUncheckedCreateInput): Promise<LoanWithRelations> {
    return this.prisma.loan.create({ data, include: loanInclude }) as Promise<LoanWithRelations>;
  }

  async findById(id: string): Promise<LoanWithRelations | null> {
    return this.prisma.loan.findUnique({
      where: { id },
      include: loanWithRepaymentsInclude,
    }) as Promise<LoanWithRelations | null>;
  }

  async findMany(params: {
    chamaId?: string;
    status?: LoanStatus;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ loans: LoanWithRelations[]; total: number; page: number; limit: number; totalPages: number }> {
    const { chamaId, status, search, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.loanWhereInput = {};
    if (chamaId) where.chamaId = chamaId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { referenceCode: { contains: search, mode: 'insensitive' } },
        { borrower: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [loans, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        include: loanInclude,
        orderBy: { requestedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.loan.count({ where }),
    ]);

    return { loans: loans as LoanWithRelations[], total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(
    id: string,
    data: Prisma.loanUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<LoanWithRelations> {
    const client = tx ?? this.prisma;
    return client.loan.update({
      where: { id },
      data,
      include: loanInclude,
    }) as Promise<LoanWithRelations>;
  }

  async createRepayment(
    data: {
      loanId: string;
      amount: number;
      method: PaymentMethod;
      reference?: string;
      notes?: string;
      recordedBy: string;
      paymentDate?: Date;
    },
    tx: Prisma.TransactionClient,
  ): Promise<loan_repayment> {
    return tx.loan_repayment.create({
      data: {
        loanId: data.loanId,
        amount: data.amount,
        method: data.method,
        reference: data.reference ?? null,
        notes: data.notes ?? null,
        recordedBy: data.recordedBy,
        paymentDate: data.paymentDate ?? new Date(),
      },
    });
  }

  async findActiveLoan(chamaId: string, borrowerId: string): Promise<loan | null> {
    return this.prisma.loan.findFirst({
      where: {
        chamaId,
        borrowerId,
        status: { in: [LoanStatus.REQUESTED, LoanStatus.UNDER_REVIEW, LoanStatus.APPROVED, LoanStatus.ACTIVE, LoanStatus.DISBURSED] },
      },
    });
  }

  async findDefaultedLoan(chamaId: string, borrowerId: string): Promise<loan | null> {
    return this.prisma.loan.findFirst({
      where: { chamaId, borrowerId, status: LoanStatus.DEFAULTED },
    });
  }

  async getStats(chamaId: string): Promise<{
    totalDisbursed: number;
    activeLoans: number;
    outstandingBalance: number;
    overdueLoans: number;
    completedLoans: number;
    defaultedLoans: number;
    interestEarned: number;
  }> {
    const disbursedStatuses = [LoanStatus.ACTIVE, LoanStatus.OVERDUE, LoanStatus.COMPLETED, LoanStatus.DEFAULTED, LoanStatus.DISBURSED];

    const [disbursedResult, activeLoanCount, outstandingResult, overdueCount, completedCount, defaultedCount, interestResult] =
      await Promise.all([
        this.prisma.loan.aggregate({
          where: { chamaId, status: { in: disbursedStatuses } },
          _sum: { approvedAmount: true },
        }),
        this.prisma.loan.count({
          where: { chamaId, status: { in: [LoanStatus.ACTIVE, LoanStatus.DISBURSED] } },
        }),
        this.prisma.loan.aggregate({
          where: { chamaId, status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE, LoanStatus.DISBURSED] } },
          _sum: { outstandingBalance: true },
        }),
        this.prisma.loan.count({ where: { chamaId, status: LoanStatus.OVERDUE } }),
        this.prisma.loan.count({ where: { chamaId, status: LoanStatus.COMPLETED } }),
        this.prisma.loan.count({ where: { chamaId, status: LoanStatus.DEFAULTED } }),
        this.prisma.loan.aggregate({
          where: { chamaId, status: { in: disbursedStatuses } },
          _sum: { interestAmount: true },
        }),
      ]);

    return {
      totalDisbursed: Number(disbursedResult._sum.approvedAmount ?? 0),
      activeLoans: activeLoanCount,
      outstandingBalance: Number(outstandingResult._sum.outstandingBalance ?? 0),
      overdueLoans: overdueCount,
      completedLoans: completedCount,
      defaultedLoans: defaultedCount,
      interestEarned: Number(interestResult._sum.interestAmount ?? 0),
    };
  }

  /** Atomically mark overdue loans where dueDate has passed and balance > 0 */
  async markOverdueLoans(chamaId: string): Promise<number> {
    const result = await this.prisma.loan.updateMany({
      where: {
        chamaId,
        status: LoanStatus.ACTIVE,
        dueDate: { lt: new Date() },
        outstandingBalance: { gt: 0 },
      },
      data: { status: LoanStatus.OVERDUE },
    });
    return result.count;
  }
}
