import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContributionPaymentStatus,
  ContributionPeriodStatus,
  ContributionTimeliness,
} from '@prisma/client';

export class ObligationMemberDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() email!: string;
  @ApiPropertyOptional() phone?: string | null;
}

export class ContributionBoardRowDto {
  @ApiProperty() obligationId!: string;
  @ApiProperty() member!: ObligationMemberDto;
  @ApiProperty() requiredAmount!: number;
  @ApiProperty() paidAmount!: number;
  @ApiProperty() outstandingBalance!: number;
  @ApiProperty() carryForwardDebt!: number;
  @ApiProperty() carryForwardCredit!: number;
  @ApiProperty({ type: Number, minimum: 0, maximum: 100 }) progressPercent!: number;
  @ApiProperty({ enum: ContributionPaymentStatus }) status!: ContributionPaymentStatus;
  @ApiPropertyOptional({ enum: ContributionTimeliness }) timeliness?: ContributionTimeliness | null;
}

export class ContributionPeriodDto {
  @ApiProperty() id!: string;
  @ApiProperty() chamaId!: string;
  @ApiProperty() label!: string;
  @ApiProperty() startDate!: string;
  @ApiProperty() endDate!: string;
  @ApiProperty() dueDate!: string;
  @ApiProperty() requiredAmount!: number;
  @ApiProperty() frequency!: string;
  @ApiProperty({ enum: ContributionPeriodStatus }) status!: ContributionPeriodStatus;
  @ApiProperty() createdAt!: string;
  @ApiPropertyOptional() totalCollected?: number;
  @ApiPropertyOptional() totalExpected?: number;
  @ApiPropertyOptional() fullyPaidCount?: number;
  @ApiPropertyOptional() memberCount?: number;
}

export class ContributionPaymentDto {
  @ApiProperty() id!: string;
  @ApiProperty() obligationId!: string;
  @ApiProperty() chamaId!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() memberName!: string;
  @ApiProperty() amount!: number;
  @ApiProperty() method!: string;
  @ApiPropertyOptional() reference?: string | null;
  @ApiPropertyOptional() notes?: string | null;
  @ApiProperty() paidAt!: string;
  @ApiProperty() createdAt!: string;
}

export class ContributionStatsDto {
  @ApiProperty() totalCollected!: number;
  @ApiProperty() expectedThisPeriod!: number;
  @ApiProperty() outstandingThisPeriod!: number;
  @ApiProperty() fullyPaidMembers!: number;
  @ApiProperty() partialMembers!: number;
  @ApiProperty() pendingMembers!: number;
  @ApiProperty() overdueMembers!: number;
  @ApiProperty() carryForwardDebt!: number;
  @ApiProperty() carryForwardCredit!: number;
  @ApiPropertyOptional() openPeriodLabel?: string | null;
  @ApiPropertyOptional() openPeriodDueDate?: string | null;
}

export class PaginatedPeriodsDto {
  @ApiProperty({ type: [ContributionPeriodDto] }) data!: ContributionPeriodDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() totalPages!: number;
}

export class PaginatedPaymentsDto {
  @ApiProperty({ type: [ContributionPaymentDto] }) data!: ContributionPaymentDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() totalPages!: number;
}
