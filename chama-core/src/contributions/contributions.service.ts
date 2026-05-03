import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ContributionPaymentStatus, ContributionTimeliness, transaction_type } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ContributionsRepository } from './contributions.repository';
import { FinanceService } from '../finance/finance.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChamaSettingsService } from '../chama-settings/chama-settings.service';
import { OpenPeriodDto } from './dto/open-period.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { ContributionQueryDto } from './dto/query.dto';
import {
  ContributionBoardRowDto,
  ContributionPaymentDto,
  ContributionPeriodDto,
  ContributionStatsDto,
  PaginatedPaymentsDto,
  PaginatedPeriodsDto,
} from './dto/contribution-response.dto';

@Injectable()
export class ContributionsService {
  private readonly logger = new Logger(ContributionsService.name);

  constructor(
    private readonly repo: ContributionsRepository,
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
    private readonly notificationsService: NotificationsService,
    private readonly chamaSettingsService: ChamaSettingsService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // OPEN A NEW PERIOD
  // ─────────────────────────────────────────────────────────────────────────────

  async openPeriod(dto: OpenPeriodDto, currentUserId: string): Promise<ContributionPeriodDto> {
    await this.assertMembership(dto.chamaId, currentUserId);

    const settings = await this.chamaSettingsService.getSettingsByChamaId(dto.chamaId);
    if (!settings) {
      throw new BadRequestException('Chama settings not configured. Set contribution amount and frequency first.');
    }

    const baseAmount = dto.requiredAmount ?? settings.contribution_amount;
    if (!baseAmount || baseAmount <= 0) {
      throw new BadRequestException('Contribution amount is not set in chama settings.');
    }

    const frequency = settings.frequency ?? 'MONTHLY';

    // Reject if an OPEN period already exists
    const existingOpen = await this.repo.findOpenPeriod(dto.chamaId);
    if (existingOpen) {
      throw new ConflictException(`Period "${existingOpen.label}" is still OPEN. Close it before opening a new one.`);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const dueDate = new Date(dto.dueDate);

    if (endDate <= startDate) throw new BadRequestException('endDate must be after startDate');
    if (dueDate < startDate) throw new BadRequestException('dueDate must be within the period');

    const members = await this.repo.getActiveMembers(dto.chamaId);
    if (members.length === 0) throw new BadRequestException('Chama has no active members');

    const period = await this.prisma.$transaction(async tx => {
      const created = await this.repo.createPeriod(
        {
          chama_id: dto.chamaId,
          label: dto.label,
          start_date: startDate,
          end_date: endDate,
          due_date: dueDate,
          required_amount: new Decimal(baseAmount),
          frequency: frequency.toString(),
          created_by: currentUserId,
        },
        tx,
      );

      // Create obligations for every member, carrying forward debt/credit
      await Promise.all(
        members.map(async m => {
          const prev = await this.repo.findLastObligationForMember(dto.chamaId, m.user_id);

          const carryDebt = prev
            ? Math.max(0, Number(prev.outstanding_balance))
            : 0;

          const carryCredit = prev
            ? Math.max(0, Number(prev.carry_forward_credit))
            : 0;

          // Required = base + previous debt - available credit (min 0)
          const required = Math.max(0, baseAmount + carryDebt - carryCredit);

          await this.repo.createObligation(
            {
              period_id: created.id,
              user_id: m.user_id,
              chama_id: dto.chamaId,
              required_amount: new Decimal(required),
              outstanding_balance: new Decimal(required),
              carry_forward_debt: new Decimal(carryDebt),
              carry_forward_credit: new Decimal(carryCredit),
            },
            tx,
          );
        }),
      );

      return created;
    });

    this.logger.log(`[CONTRIBUTIONS] Period "${period.label}" opened for chama ${dto.chamaId} by ${currentUserId}`);

    // Notify all members
    this.notifySwallowError('contribution.period.opened', {
      chamaId: dto.chamaId,
      title: 'New Contribution Period',
      body: `${period.label} contribution period is now open. Amount due: KSh ${baseAmount.toLocaleString()}`,
      entityType: 'contribution_period',
      entityId: period.id,
    });

    return this.mapPeriodToDto(period, { totalCollected: 0, totalExpected: members.length * baseAmount, fullyPaidCount: 0, memberCount: members.length });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RECORD A PAYMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async recordPayment(dto: RecordPaymentDto, currentUserId: string): Promise<ContributionBoardRowDto> {
    await this.assertMembership(dto.chamaId, currentUserId);

    // Verify the target member is in this chama
    await this.assertMembership(dto.chamaId, dto.userId);

    const openPeriod = await this.repo.findOpenPeriod(dto.chamaId);
    if (!openPeriod) throw new BadRequestException('No OPEN contribution period found for this chama.');

    const foundObligation = await this.repo.findObligation(openPeriod.id, dto.userId);
    let obligationId: string;
    let currentPaid: number;
    let currentOutstanding: number;
    let required: number;

    if (!foundObligation) {
      // Member joined after the period opened — create obligation on-the-fly
      const baseAmount = Number(openPeriod.required_amount);
      const created = await this.repo.createObligation({
        period_id: openPeriod.id,
        user_id: dto.userId,
        chama_id: dto.chamaId,
        required_amount: new Decimal(baseAmount),
        outstanding_balance: new Decimal(baseAmount),
        carry_forward_debt: new Decimal(0),
        carry_forward_credit: new Decimal(0),
      });
      obligationId = created.id;
      currentPaid = 0;
      currentOutstanding = baseAmount;
      required = baseAmount;
    } else {
      if (foundObligation.status === ContributionPaymentStatus.COMPLETED) {
        throw new BadRequestException('This member has already fully paid for this period.');
      }
      obligationId = foundObligation.id;
      currentPaid = Number(foundObligation.paid_amount);
      currentOutstanding = Number(foundObligation.outstanding_balance);
      required = Number(foundObligation.required_amount);
    }
    const paymentAmount = dto.amount;

    if (paymentAmount <= 0) throw new BadRequestException('Payment amount must be greater than 0');

    // How much actually reduces the outstanding balance
    const effectiveAmount = Math.min(paymentAmount, currentOutstanding);
    const excess = Math.max(0, paymentAmount - currentOutstanding);

    const newPaid = currentPaid + paymentAmount;
    const newOutstanding = Math.max(0, currentOutstanding - paymentAmount);
    const newCredit = excess > 0 ? excess : 0;

    // Determine payment status
    const newStatus: ContributionPaymentStatus =
      newOutstanding === 0
        ? ContributionPaymentStatus.COMPLETED
        : newPaid > 0
          ? ContributionPaymentStatus.PARTIAL
          : ContributionPaymentStatus.PENDING;

    // Determine timeliness
    const now = new Date();
    const dueDate = new Date(openPeriod.due_date);
    const paidAt = dto.paidAt ? new Date(dto.paidAt) : now;
    const timeliness: ContributionTimeliness =
      paidAt > dueDate ? ContributionTimeliness.LATE : ContributionTimeliness.ON_TIME;

    await this.prisma.$transaction(async tx => {
      await this.repo.updateObligation(
        obligationId,
        {
          paid_amount: new Decimal(newPaid),
          outstanding_balance: new Decimal(newOutstanding),
          carry_forward_credit: new Decimal(newCredit),
          status: newStatus,
          timeliness,
        },
        tx,
      );

      await this.repo.createPayment(
        {
          obligation_id: obligationId,
          chama_id: dto.chamaId,
          user_id: dto.userId,
          amount: new Decimal(paymentAmount),
          method: dto.method,
          reference: dto.reference,
          notes: dto.notes,
          paid_at: paidAt,
          recorded_by: currentUserId,
        },
        tx,
      );

      // Idempotent: reference = obligationId + ISO timestamp
      await this.financeService.recordTransaction(
        {
          type: transaction_type.CONTRIBUTION,
          amount: effectiveAmount,
          chamaId: dto.chamaId,
          userId: dto.userId,
          description: `Contribution for ${openPeriod.label}`,
          reference: `${obligationId}-${paidAt.toISOString()}`,
          referenceType: 'contribution_obligation',
          meta: {
            periodId: openPeriod.id,
            obligationId,
            periodLabel: openPeriod.label,
          },
        },
        { tx },
      );
    });

    const refreshed = await this.repo.findObligation(openPeriod.id, dto.userId);
    if (!refreshed) throw new NotFoundException('Obligation not found after update');

    this.logger.log(
      `[CONTRIBUTIONS] Payment KSh ${paymentAmount} recorded for ${dto.userId} in period "${openPeriod.label}"`,
    );

    // Notifications
    const memberName = refreshed.user.name ?? 'Member';
    if (newStatus === ContributionPaymentStatus.COMPLETED) {
      this.notifySwallowError('contribution.completed', {
        chamaId: dto.chamaId,
        title: 'Contribution Fully Paid',
        body: `${memberName} has completed their contribution for ${openPeriod.label}. KSh ${required.toLocaleString()} received.`,
        entityType: 'contribution_obligation',
        entityId: refreshed.id,
        targetUserIds: [dto.userId],
      });
    } else {
      this.notifySwallowError('contribution.received', {
        chamaId: dto.chamaId,
        title: 'Contribution Received',
        body: `Your contribution of KSh ${paymentAmount.toLocaleString()} for ${openPeriod.label} has been recorded. Balance: KSh ${newOutstanding.toLocaleString()}`,
        entityType: 'contribution_obligation',
        entityId: refreshed.id,
        targetUserIds: [dto.userId],
      });
    }

    return this.mapObligationToRow(refreshed);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CURRENT LIVE BOARD
  // ─────────────────────────────────────────────────────────────────────────────

  async getCurrentBoard(chamaId: string, currentUserId: string): Promise<ContributionBoardRowDto[]> {
    await this.assertMembership(chamaId, currentUserId);

    const openPeriod = await this.repo.findOpenPeriod(chamaId);
    if (!openPeriod) return [];

    // Auto-mark overdue
    await this.repo.markOverdueObligations(openPeriod.id, new Date(openPeriod.due_date));

    const obligations = await this.repo.findObligationsForPeriod(openPeriod.id);
    return obligations.map(o => this.mapObligationToRow(o));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PERIODS
  // ─────────────────────────────────────────────────────────────────────────────

  async getPeriods(chamaId: string, currentUserId: string, page: number, limit: number): Promise<PaginatedPeriodsDto> {
    await this.assertMembership(chamaId, currentUserId);

    const { data, total } = await this.repo.findPeriods(chamaId, page, limit);

    const rows = await Promise.all(
      data.map(async p => {
        const counts = await this.repo.getObligationCounts(p.id);
        return this.mapPeriodToDto(p, {
          totalCollected: counts.totalPaid,
          totalExpected: counts.totalRequired,
          fullyPaidCount: counts.completed,
          memberCount: counts.completed + counts.partial + counts.pending,
        });
      }),
    );

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPeriodById(periodId: string, chamaId: string, currentUserId: string): Promise<ContributionPeriodDto> {
    await this.assertMembership(chamaId, currentUserId);

    const period = await this.repo.findPeriodById(periodId);
    if (!period || period.chama_id !== chamaId) throw new NotFoundException('Period not found');

    // Auto-mark overdue if open
    if (period.status === 'OPEN') {
      await this.repo.markOverdueObligations(period.id, new Date(period.due_date));
    }

    const counts = await this.repo.getObligationCounts(period.id);
    return this.mapPeriodToDto(period, {
      totalCollected: counts.totalPaid,
      totalExpected: counts.totalRequired,
      fullyPaidCount: counts.completed,
      memberCount: counts.completed + counts.partial + counts.pending,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────────────────────

  async getHistory(chamaId: string, currentUserId: string, query: ContributionQueryDto): Promise<PaginatedPaymentsDto> {
    await this.assertMembership(chamaId, currentUserId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { data, total } = await this.repo.findPayments(
      chamaId,
      {
        periodId: query.periodId,
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
      },
      page,
      limit,
    );

    return {
      data: data.map(p => ({
        id: p.id,
        obligationId: p.obligation_id,
        chamaId: p.chama_id,
        userId: p.user_id,
        memberName: p.user.name ?? 'Unknown',
        amount: Number(p.amount),
        method: p.method,
        reference: p.reference,
        notes: p.notes,
        paidAt: p.paid_at.toISOString(),
        createdAt: p.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────────────────────────────────────

  async getStats(chamaId: string, currentUserId: string): Promise<ContributionStatsDto> {
    await this.assertMembership(chamaId, currentUserId);

    const openPeriod = await this.repo.findOpenPeriod(chamaId);

    if (!openPeriod) {
      // All-time totals from finance ledger when no period is open
      const totalCollected = await this.repo.sumPaymentsForPeriod('');
      return {
        totalCollected: 0,
        expectedThisPeriod: 0,
        outstandingThisPeriod: 0,
        fullyPaidMembers: 0,
        partialMembers: 0,
        pendingMembers: 0,
        overdueMembers: 0,
        carryForwardDebt: 0,
        carryForwardCredit: 0,
        openPeriodLabel: null,
        openPeriodDueDate: null,
      };
    }

    // Auto-mark overdue
    await this.repo.markOverdueObligations(openPeriod.id, new Date(openPeriod.due_date));

    const counts = await this.repo.getObligationCounts(openPeriod.id);

    return {
      totalCollected: counts.totalPaid,
      expectedThisPeriod: counts.totalRequired,
      outstandingThisPeriod: counts.totalOutstanding,
      fullyPaidMembers: counts.completed,
      partialMembers: counts.partial,
      pendingMembers: counts.pending,
      overdueMembers: counts.overdue,
      carryForwardDebt: counts.totalDebt,
      carryForwardCredit: counts.totalCredit,
      openPeriodLabel: openPeriod.label,
      openPeriodDueDate: new Date(openPeriod.due_date).toISOString(),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CSV EXPORT
  // ─────────────────────────────────────────────────────────────────────────────

  async exportCsv(chamaId: string, periodId: string | undefined, currentUserId: string): Promise<string> {
    await this.assertMembership(chamaId, currentUserId);

    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const open = await this.repo.findOpenPeriod(chamaId);
      if (!open) throw new BadRequestException('No open period found. Provide a periodId.');
      targetPeriodId = open.id;
    }

    const period = await this.repo.findPeriodById(targetPeriodId);
    if (!period || period.chama_id !== chamaId) throw new NotFoundException('Period not found');

    const obligations = await this.repo.findObligationsForPeriod(targetPeriodId);

    const headers = ['Member Name', 'Email', 'Phone', 'Required (KSh)', 'Paid (KSh)', 'Outstanding (KSh)', 'Status', 'Timeliness', 'Carry Forward Debt', 'Carry Forward Credit'];

    const rows = obligations.map(o => [
      o.user.name ?? 'Unknown',
      o.user.email ?? '',
      o.user.phone ?? '',
      Number(o.required_amount).toFixed(2),
      Number(o.paid_amount).toFixed(2),
      Number(o.outstanding_balance).toFixed(2),
      o.status,
      o.timeliness ?? 'N/A',
      Number(o.carry_forward_debt).toFixed(2),
      Number(o.carry_forward_credit).toFixed(2),
    ]);

    const lines = [
      `# ${period.label} — Contributions Export`,
      `# Period: ${new Date(period.start_date).toLocaleDateString()} to ${new Date(period.end_date).toLocaleDateString()}`,
      `# Due Date: ${new Date(period.due_date).toLocaleDateString()}`,
      '',
      headers.join(','),
      ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ];

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CLOSE PERIOD (manual)
  // ─────────────────────────────────────────────────────────────────────────────

  async closePeriod(periodId: string, chamaId: string, currentUserId: string): Promise<ContributionPeriodDto> {
    await this.assertMembership(chamaId, currentUserId);

    const period = await this.repo.findPeriodById(periodId);
    if (!period || period.chama_id !== chamaId) throw new NotFoundException('Period not found');
    if (period.status === 'CLOSED') throw new BadRequestException('Period is already closed');

    await this.repo.closePeriod(periodId);
    const counts = await this.repo.getObligationCounts(periodId);

    this.logger.log(`[CONTRIBUTIONS] Period "${period.label}" closed by ${currentUserId}`);

    return this.mapPeriodToDto({ ...period, status: 'CLOSED' }, {
      totalCollected: counts.totalPaid,
      totalExpected: counts.totalRequired,
      fullyPaidCount: counts.completed,
      memberCount: counts.completed + counts.partial + counts.pending,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  private mapObligationToRow(o: Awaited<ReturnType<typeof this.repo.findObligation>>): ContributionBoardRowDto {
    if (!o) throw new NotFoundException('Obligation not found');
    const required = Number(o.required_amount);
    const paid = Number(o.paid_amount);
    const progress = required > 0 ? Math.min(100, Math.round((paid / required) * 100)) : 100;

    return {
      obligationId: o.id,
      member: {
        id: o.user.id,
        name: o.user.name ?? 'Unknown',
        email: o.user.email ?? '',
        phone: o.user.phone,
      },
      requiredAmount: required,
      paidAmount: paid,
      outstandingBalance: Number(o.outstanding_balance),
      carryForwardDebt: Number(o.carry_forward_debt),
      carryForwardCredit: Number(o.carry_forward_credit),
      progressPercent: progress,
      status: o.status,
      timeliness: o.timeliness,
    };
  }

  private mapPeriodToDto(
    p: { id: string; chama_id: string; label: string; start_date: Date; end_date: Date; due_date: Date; required_amount: Decimal | number; frequency: string; status: string; createdAt: Date },
    meta: { totalCollected: number; totalExpected: number; fullyPaidCount: number; memberCount: number },
  ): ContributionPeriodDto {
    return {
      id: p.id,
      chamaId: p.chama_id,
      label: p.label,
      startDate: new Date(p.start_date).toISOString(),
      endDate: new Date(p.end_date).toISOString(),
      dueDate: new Date(p.due_date).toISOString(),
      requiredAmount: Number(p.required_amount),
      frequency: p.frequency,
      status: p.status as any,
      createdAt: new Date(p.createdAt).toISOString(),
      totalCollected: meta.totalCollected,
      totalExpected: meta.totalExpected,
      fullyPaidCount: meta.fullyPaidCount,
      memberCount: meta.memberCount,
    };
  }

  private async assertMembership(chamaId: string, userId: string): Promise<void> {
    const member = await this.prisma.membership.findFirst({
      where: { chama_id: chamaId, user_id: userId },
    });
    if (!member) throw new ForbiddenException('You are not a member of this chama');
  }

  private notifySwallowError(key: string, payload: Parameters<NotificationsService['notify']>[1]): void {
    this.notificationsService.notify(key, payload).catch((err: unknown) => {
      this.logger.warn(`Notification "${key}" failed: ${err instanceof Error ? err.message : 'unknown'}`);
    });
  }
}
