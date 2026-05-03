import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoansRepository } from './loans.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestLoanDto } from './dto/request-loan.dto';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveLoanDto, RejectLoanDto } from './dto/approve-loan.dto';
import { DisburseLoanDto } from './dto/disburse-loan.dto';
import { RecordRepaymentDto } from './dto/repayment.dto';
import { LoanQueryDto } from './dto/loan-query.dto';
import {
  LoanResponseDto,
  PaginatedLoansDto,
  LoanStatsDto,
  LoanRepaymentResponseDto,
} from './dto/loan-response.dto';
import { LoanStatus, transaction_type } from '@prisma/client';
import { LoanWithRelations } from './loans.repository';
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(
    private readonly repository: LoansRepository,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly financeService: FinanceService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // MEMBER: request a loan
  // ─────────────────────────────────────────────────────────────────────────────

  async requestLoan(
    dto: RequestLoanDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    await this.assertMembership(dto.chamaId, currentUserId);

    if (dto.amount <= 0)
      throw new BadRequestException('Loan amount must be greater than 0');
    if (dto.durationMonths < 1 || dto.durationMonths > 60) {
      throw new BadRequestException('Duration must be between 1 and 60 months');
    }

    const defaulted = await this.repository.findDefaultedLoan(
      dto.chamaId,
      currentUserId,
    );
    if (defaulted)
      throw new BadRequestException(
        'You have a defaulted loan. New requests are not allowed.',
      );

    const active = await this.repository.findActiveLoan(
      dto.chamaId,
      currentUserId,
    );
    if (active)
      throw new BadRequestException(
        'You already have an active or pending loan in this chama.',
      );

    const referenceCode = await this.repository.generateReferenceCode(
      dto.chamaId,
    );

    const loan = await this.repository.create({
      referenceCode,
      chamaId: dto.chamaId,
      borrowerId: currentUserId,
      requestedAmount: dto.amount,
      durationMonths: dto.durationMonths,
      purpose: dto.purpose ?? null,
      status: LoanStatus.REQUESTED,
    });

    await this.sendNotification(
      'loan.request',
      {
        chamaId: dto.chamaId,
        title: 'New Loan Request',
        body: `${loan.borrower.name ?? 'A member'} has requested a loan of KSh ${dto.amount.toLocaleString()}.`,
        entityType: 'loan',
        entityId: loan.id,
      },
      null,
    );

    return this.mapToDto(loan);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN: direct loan creation
  // ─────────────────────────────────────────────────────────────────────────────

  async createLoan(
    dto: CreateLoanDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    await this.assertPermission(dto.chamaId, currentUserId, 'loan.create');
    await this.assertMembership(dto.chamaId, dto.borrowerId);

    if (dto.amount <= 0)
      throw new BadRequestException('Loan amount must be greater than 0');
    if (dto.durationMonths < 1 || dto.durationMonths > 60) {
      throw new BadRequestException('Duration must be between 1 and 60 months');
    }

    const targetStatus = dto.status ?? LoanStatus.APPROVED;
    const allowedStatuses: LoanStatus[] = [
      LoanStatus.APPROVED,
      LoanStatus.DISBURSED,
      LoanStatus.REQUESTED,
    ];
    if (!allowedStatuses.includes(targetStatus)) {
      throw new BadRequestException(
        'Admin creation only supports REQUESTED, APPROVED, or DISBURSED status',
      );
    }

    const referenceCode = await this.repository.generateReferenceCode(
      dto.chamaId,
    );

    const interestAmount = (dto.amount * dto.interestRate) / 100;
    const totalPayable = dto.amount + interestAmount;
    const now = new Date();

    let startDate: Date | null = null;
    let dueDate: Date | null = null;
    let disbursedAt: Date | null = null;

    if (
      targetStatus === LoanStatus.DISBURSED ||
      targetStatus === LoanStatus.APPROVED
    ) {
      if (dto.startDate) {
        startDate = new Date(dto.startDate);
        dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + dto.durationMonths);
        if (targetStatus === LoanStatus.DISBURSED) disbursedAt = now;
      }
    }

    const loan = await this.prisma.$transaction(async tx => {
      const created = await tx.loan.create({
        data: {
          referenceCode,
          chamaId: dto.chamaId,
          borrowerId: dto.borrowerId,
          requestedAmount: dto.amount,
          approvedAmount: dto.amount,
          interestRate: dto.interestRate,
          durationMonths: dto.durationMonths,
          purpose: dto.purpose ?? null,
          notes: dto.notes ?? null,
          status: targetStatus,
          approvedAt: targetStatus !== LoanStatus.REQUESTED ? now : undefined,
          approvedBy:
            targetStatus !== LoanStatus.REQUESTED ? currentUserId : undefined,
          disbursedAt: disbursedAt ?? undefined,
          disbursedBy: disbursedAt ? currentUserId : undefined,
          startDate: startDate ?? undefined,
          dueDate: dueDate ?? undefined,
          principalAmount: dto.amount,
          interestAmount,
          totalPayable,
          outstandingBalance: totalPayable,
        },
        include: {
          borrower: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });

      if (targetStatus === LoanStatus.DISBURSED) {
        await this.financeService.recordTransaction(
          {
            type: transaction_type.LOAN_DISBURSEMENT,
            amount: dto.amount,
            chamaId: dto.chamaId,
            userId: dto.borrowerId,
            description: `Loan disbursed: ${referenceCode}`,
            reference: created.id,
            referenceType: 'loan',
            meta: { loanId: created.id, referenceCode },
          },
          { tx },
        );
      }

      return created;
    });

    return this.mapToDto(loan as LoanWithRelations);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LIST + DETAIL
  // ─────────────────────────────────────────────────────────────────────────────

  async findMany(
    query: LoanQueryDto,
    currentUserId: string,
  ): Promise<PaginatedLoansDto> {
    if (query.chamaId) {
      await this.assertMembership(query.chamaId, currentUserId);
      await this.repository.markOverdueLoans(query.chamaId);
    }

    const result = await this.repository.findMany({
      chamaId: query.chamaId,
      status: query.status,
      search: query.search,
      page: query.page ?? 1,
      limit: Math.min(query.limit ?? 20, 100),
    });

    return {
      loans: result.loans.map(l => this.mapToDto(l)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: string, currentUserId: string): Promise<LoanResponseDto> {
    const loan = await this.repository.findById(id);
    if (!loan) throw new NotFoundException('Loan not found');

    await this.assertMembership(loan.chamaId, currentUserId);

    return this.mapToDto(loan);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REVIEW
  // ─────────────────────────────────────────────────────────────────────────────

  async reviewLoan(
    id: string,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(loan.chamaId, currentUserId, 'loan.review');

    if (loan.status !== LoanStatus.REQUESTED) {
      throw new BadRequestException(
        `Loan must be in REQUESTED status to review. Current: ${loan.status}`,
      );
    }

    const updated = await this.repository.updateStatus(id, {
      status: LoanStatus.UNDER_REVIEW,
      reviewer: { connect: { id: currentUserId } },
      reviewedAt: new Date(),
    });

    return this.mapToDto(updated);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // APPROVE
  // ─────────────────────────────────────────────────────────────────────────────

  async approveLoan(
    id: string,
    dto: ApproveLoanDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(loan.chamaId, currentUserId, 'loan.approve');

    const approvableStatuses: LoanStatus[] = [
      LoanStatus.REQUESTED,
      LoanStatus.UNDER_REVIEW,
    ];
    if (!approvableStatuses.includes(loan.status)) {
      throw new BadRequestException(
        `Loan cannot be approved from status: ${loan.status}`,
      );
    }
    if (dto.approvedAmount <= 0)
      throw new BadRequestException('Approved amount must be greater than 0');

    const interestAmount = (dto.approvedAmount * dto.interestRate) / 100;
    const totalPayable = dto.approvedAmount + interestAmount;

    const updated = await this.repository.updateStatus(id, {
      status: LoanStatus.APPROVED,
      approvedAmount: dto.approvedAmount,
      interestRate: dto.interestRate,
      durationMonths: dto.durationMonths,
      principalAmount: dto.approvedAmount,
      interestAmount,
      totalPayable,
      outstandingBalance: totalPayable,
      notes: dto.notes ?? null,
      approvedAt: new Date(),
      approver: { connect: { id: currentUserId } },
    });

    await this.sendNotification(
      'loan.approved',
      {
        chamaId: loan.chamaId,
        title: 'Loan Approved',
        body: `Your loan of KSh ${dto.approvedAmount.toLocaleString()} has been approved.`,
        entityType: 'loan',
        entityId: id,
        targetUserIds: [loan.borrowerId],
      },
      null,
    );

    return this.mapToDto(updated);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REJECT
  // ─────────────────────────────────────────────────────────────────────────────

  async rejectLoan(
    id: string,
    dto: RejectLoanDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(loan.chamaId, currentUserId, 'loan.reject');

    const rejectableStatuses: LoanStatus[] = [
      LoanStatus.REQUESTED,
      LoanStatus.UNDER_REVIEW,
      LoanStatus.APPROVED,
    ];
    if (!rejectableStatuses.includes(loan.status)) {
      throw new BadRequestException(
        `Loan cannot be rejected from status: ${loan.status}`,
      );
    }

    const updated = await this.repository.updateStatus(id, {
      status: LoanStatus.REJECTED,
      notes: dto.reason,
      rejectedAt: new Date(),
    });

    await this.sendNotification(
      'loan.rejected',
      {
        chamaId: loan.chamaId,
        title: 'Loan Rejected',
        body: `Your loan request has been rejected. Reason: ${dto.reason}`,
        entityType: 'loan',
        entityId: id,
        targetUserIds: [loan.borrowerId],
      },
      null,
    );

    return this.mapToDto(updated);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DISBURSE
  // ─────────────────────────────────────────────────────────────────────────────

  async disburseLoan(
    id: string,
    dto: DisburseLoanDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(loan.chamaId, currentUserId, 'loan.disburse');

    if (loan.status !== LoanStatus.APPROVED) {
      throw new BadRequestException(
        `Loan must be APPROVED before disbursement. Current: ${loan.status}`,
      );
    }
    if (loan.disbursedAt)
      throw new BadRequestException('Loan has already been disbursed');

    const approvedAmount = Number(loan.approvedAmount ?? loan.requestedAmount);
    const startDate = new Date(dto.startDate);
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);
    const now = new Date();

    const updated = await this.prisma.$transaction(async tx => {
      const disbursed = await this.repository.updateStatus(
        id,
        {
          status: LoanStatus.ACTIVE,
          disbursedAt: now,
          disburser: { connect: { id: currentUserId } },
          startDate,
          dueDate,
        },
        tx,
      );

      await this.financeService.recordTransaction(
        {
          type: transaction_type.LOAN_DISBURSEMENT,
          amount: approvedAmount,
          chamaId: loan.chamaId,
          userId: loan.borrowerId,
          description: `Loan disbursed: ${loan.referenceCode}`,
          reference: loan.id,
          referenceType: 'loan',
          meta: { loanId: loan.id, referenceCode: loan.referenceCode },
        },
        { tx },
      );

      return disbursed;
    });

    await this.sendNotification(
      'loan.disbursed',
      {
        chamaId: loan.chamaId,
        title: 'Loan Disbursed',
        body: `Your loan of KSh ${approvedAmount.toLocaleString()} has been disbursed. Repayment due by ${dueDate.toLocaleDateString()}.`,
        entityType: 'loan',
        entityId: id,
        targetUserIds: [loan.borrowerId],
      },
      null,
    );

    return this.mapToDto(updated);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REPAYMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async recordRepayment(
    id: string,
    dto: RecordRepaymentDto,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(
      loan.chamaId,
      currentUserId,
      'loan.repayment.record',
    );

    const repayableStatuses: LoanStatus[] = [
      LoanStatus.ACTIVE,
      LoanStatus.OVERDUE,
      LoanStatus.DISBURSED,
    ];
    if (!repayableStatuses.includes(loan.status)) {
      throw new BadRequestException(
        `Cannot record repayment for a loan with status: ${loan.status}`,
      );
    }

    const currentBalance = Number(loan.outstandingBalance ?? 0);
    if (currentBalance <= 0)
      throw new BadRequestException('Loan has no outstanding balance');
    if (dto.amount <= 0)
      throw new BadRequestException('Repayment amount must be greater than 0');

    const effectiveAmount = Math.min(dto.amount, currentBalance);
    const newBalance = Math.max(0, currentBalance - effectiveAmount);
    const isComplete = newBalance === 0;
    const now = new Date();

    const split = this.splitRepayment(loan, effectiveAmount, currentBalance);

    const updated = await this.prisma.$transaction(async tx => {
      const repayment = await this.repository.createRepayment(
        {
          loanId: id,
          amount: effectiveAmount,
          method: dto.method,
          reference: dto.reference,
          notes: dto.notes,
          recordedBy: currentUserId,
          paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : now,
        },
        tx,
      );

      const loanUpdate = await this.repository.updateStatus(
        id,
        {
          outstandingBalance: newBalance,
          ...(isComplete
            ? {
                status: LoanStatus.COMPLETED,
                completedAt: now,
              }
            : {}),
        },
        tx,
      );

      if (split.principal > 0) {
        await this.financeService.recordTransaction(
          {
            type: transaction_type.LOAN_REPAYMENT_PRINCIPAL,
            amount: split.principal,
            chamaId: loan.chamaId,
            userId: loan.borrowerId,
            description: `Loan repayment (principal): ${loan.referenceCode}`,
            reference: repayment.id,
            referenceType: 'loan_repayment',
            meta: { loanId: loan.id, referenceCode: loan.referenceCode },
          },
          { tx },
        );
      }

      if (split.interest > 0) {
        await this.financeService.recordTransaction(
          {
            type: transaction_type.LOAN_INTEREST,
            amount: split.interest,
            chamaId: loan.chamaId,
            userId: loan.borrowerId,
            description: `Loan repayment (interest): ${loan.referenceCode}`,
            reference: repayment.id,
            referenceType: 'loan_repayment',
            meta: { loanId: loan.id, referenceCode: loan.referenceCode },
          },
          { tx },
        );
      }

      return loanUpdate;
    });

    await this.sendNotification(
      'loan.repayment.recorded',
      {
        chamaId: loan.chamaId,
        title: isComplete ? 'Loan Fully Repaid' : 'Repayment Recorded',
        body: isComplete
          ? `Congratulations! Your loan (${loan.referenceCode}) has been fully repaid.`
          : `Your repayment of KSh ${effectiveAmount.toLocaleString()} has been recorded. Remaining balance: KSh ${newBalance.toLocaleString()}.`,
        entityType: 'loan',
        entityId: id,
        targetUserIds: [loan.borrowerId],
      },
      null,
    );

    return this.mapToDto(
      (await this.repository.findById(id)) as LoanWithRelations,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MARK DEFAULTED
  // ─────────────────────────────────────────────────────────────────────────────

  async markDefaulted(
    id: string,
    currentUserId: string,
  ): Promise<LoanResponseDto> {
    const loan = await this.getLoanOrThrow(id);
    await this.assertPermission(
      loan.chamaId,
      currentUserId,
      'loan.mark.defaulted',
    );

    const defaultableStatuses: LoanStatus[] = [
      LoanStatus.ACTIVE,
      LoanStatus.OVERDUE,
    ];
    if (!defaultableStatuses.includes(loan.status)) {
      throw new BadRequestException(
        `Loan must be ACTIVE or OVERDUE to be marked as defaulted. Current: ${loan.status}`,
      );
    }

    const updated = await this.repository.updateStatus(id, {
      status: LoanStatus.DEFAULTED,
      defaultedAt: new Date(),
    });

    await this.sendNotification(
      'loan.defaulted',
      {
        chamaId: loan.chamaId,
        title: 'Loan Marked as Defaulted',
        body: `Loan ${loan.referenceCode} has been marked as defaulted.`,
        entityType: 'loan',
        entityId: id,
      },
      null,
    );

    return this.mapToDto(updated);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────────────────────────────────────

  async getStats(
    chamaId: string,
    currentUserId: string,
  ): Promise<LoanStatsDto> {
    await this.assertMembership(chamaId, currentUserId);
    await this.repository.markOverdueLoans(chamaId);
    const [summary, completedLoans] = await Promise.all([
      this.financeService.getSummary(chamaId, currentUserId),
      this.prisma.loan.count({
        where: { chamaId, status: LoanStatus.COMPLETED },
      }),
    ]);

    return {
      totalDisbursed: summary.totalLoansDisbursed,
      activeLoans: summary.activeLoansCount,
      outstandingBalance: summary.outstandingLoans,
      overdueLoans: summary.overdueLoansCount,
      completedLoans,
      defaultedLoans: summary.defaultedLoansCount,
      interestEarned: summary.totalInterestEarned,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  private async getLoanOrThrow(id: string): Promise<LoanWithRelations> {
    const loan = await this.repository.findById(id);
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  private async assertMembership(
    chamaId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: { chama_id: chamaId, user_id: userId },
    });
    if (!membership)
      throw new ForbiddenException('You are not a member of this chama');
  }

  private async assertPermission(
    chamaId: string,
    userId: string,
    permissionKey: string,
  ): Promise<void> {
    // System admins bypass permission checks
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.system_role === 'ADMIN') return;

    // Check governance role (CHAIRPERSON and TREASURER can manage loans)
    const membership = await this.prisma.membership.findFirst({
      where: { chama_id: chamaId, user_id: userId },
    });
    if (!membership)
      throw new ForbiddenException('You are not a member of this chama');

    if (['CHAIRPERSON', 'TREASURER'].includes(membership.role)) return;

    // Check RBAC permission
    const memberRole = await this.prisma.member_role.findUnique({
      where: { user_id_chama_id: { user_id: userId, chama_id: chamaId } },
      include: {
        role: {
          include: { role_permissions: { include: { permission: true } } },
        },
      },
    });

    const hasPermission = memberRole?.role.role_permissions.some(
      rp =>
        rp.permission.key === permissionKey ||
        rp.permission.key === 'issue_loans',
    );
    if (!hasPermission)
      throw new ForbiddenException(`Permission '${permissionKey}' required`);
  }

  private splitRepayment(
    loan: LoanWithRelations,
    amount: number,
    currentBalance: number,
  ): { principal: number; interest: number } {
    const principalTotal = Number(
      loan.principalAmount ?? loan.approvedAmount ?? loan.requestedAmount ?? 0,
    );
    const interestTotal = Number(loan.interestAmount ?? 0);
    const totalPayable = Number(
      loan.totalPayable ?? principalTotal + interestTotal,
    );

    if (!Number.isFinite(totalPayable) || totalPayable <= 0) {
      return { principal: amount, interest: 0 };
    }

    const totalRepaidSoFar = Math.max(0, totalPayable - currentBalance);
    const interestPaidSoFar = Math.min(interestTotal, totalRepaidSoFar);
    const interestRemaining = Math.max(0, interestTotal - interestPaidSoFar);
    const interest = Math.min(interestRemaining, amount);
    const principal = Math.max(0, amount - interest);

    return { principal, interest };
  }

  private async sendNotification(
    typeKey: string,
    payload: {
      chamaId: string;
      title: string;
      body: string;
      entityType?: string;
      entityId?: string;
      targetUserIds?: string[];
    },
    _unused: null,
  ): Promise<void> {
    try {
      await this.notificationsService.notify(typeKey, payload);
    } catch (err) {
      this.logger.warn(
        `Notification '${typeKey}' failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  private mapToDto(loan: LoanWithRelations): LoanResponseDto {
    const repayments: LoanRepaymentResponseDto[] = (loan.repayments ?? []).map(
      r => ({
        id: r.id,
        loanId: r.loanId,
        amount: Number(r.amount),
        paymentDate: r.paymentDate,
        method: r.method,
        reference: r.reference ?? undefined,
        notes: r.notes ?? undefined,
        recordedBy: r.recordedBy,
        createdAt: r.createdAt,
      }),
    );

    return {
      id: loan.id,
      referenceCode: loan.referenceCode,
      chamaId: loan.chamaId,
      borrowerId: loan.borrowerId,
      borrower: {
        id: loan.borrower.id,
        name: loan.borrower.name ?? '',
        email: loan.borrower.email ?? '',
        phone: loan.borrower.phone ?? undefined,
      },
      requestedAmount: Number(loan.requestedAmount),
      approvedAmount:
        loan.approvedAmount != null ? Number(loan.approvedAmount) : undefined,
      interestRate:
        loan.interestRate != null ? Number(loan.interestRate) : undefined,
      durationMonths: loan.durationMonths,
      purpose: loan.purpose ?? undefined,
      status: loan.status,
      requestedAt: loan.requestedAt,
      reviewedAt: loan.reviewedAt ?? undefined,
      approvedAt: loan.approvedAt ?? undefined,
      disbursedAt: loan.disbursedAt ?? undefined,
      completedAt: loan.completedAt ?? undefined,
      defaultedAt: loan.defaultedAt ?? undefined,
      rejectedAt: loan.rejectedAt ?? undefined,
      cancelledAt: loan.cancelledAt ?? undefined,
      startDate: loan.startDate ?? undefined,
      dueDate: loan.dueDate ?? undefined,
      principalAmount:
        loan.principalAmount != null ? Number(loan.principalAmount) : undefined,
      interestAmount:
        loan.interestAmount != null ? Number(loan.interestAmount) : undefined,
      totalPayable:
        loan.totalPayable != null ? Number(loan.totalPayable) : undefined,
      outstandingBalance:
        loan.outstandingBalance != null
          ? Number(loan.outstandingBalance)
          : undefined,
      notes: loan.notes ?? undefined,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
      repayments: repayments.length > 0 ? repayments : undefined,
    };
  }
}
