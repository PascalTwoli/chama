import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoanStatus, PaymentMethod } from '@prisma/client';

export class LoanBorrowerDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiPropertyOptional() phone?: string;
}

export class LoanRepaymentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() loanId: string;
  @ApiProperty() amount: number;
  @ApiProperty() paymentDate: Date;
  @ApiProperty({ enum: PaymentMethod }) method: PaymentMethod;
  @ApiPropertyOptional() reference?: string;
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() recordedBy: string;
  @ApiProperty() createdAt: Date;
}

export class LoanResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() referenceCode: string;
  @ApiProperty() chamaId: string;
  @ApiProperty() borrowerId: string;
  @ApiProperty({ type: LoanBorrowerDto }) borrower: LoanBorrowerDto;
  @ApiProperty() requestedAmount: number;
  @ApiPropertyOptional() approvedAmount?: number;
  @ApiPropertyOptional() interestRate?: number;
  @ApiProperty() durationMonths: number;
  @ApiPropertyOptional() purpose?: string;
  @ApiProperty({ enum: LoanStatus }) status: LoanStatus;
  @ApiProperty() requestedAt: Date;
  @ApiPropertyOptional() reviewedAt?: Date;
  @ApiPropertyOptional() approvedAt?: Date;
  @ApiPropertyOptional() disbursedAt?: Date;
  @ApiPropertyOptional() completedAt?: Date;
  @ApiPropertyOptional() defaultedAt?: Date;
  @ApiPropertyOptional() rejectedAt?: Date;
  @ApiPropertyOptional() cancelledAt?: Date;
  @ApiPropertyOptional() startDate?: Date;
  @ApiPropertyOptional() dueDate?: Date;
  @ApiPropertyOptional() principalAmount?: number;
  @ApiPropertyOptional() interestAmount?: number;
  @ApiPropertyOptional() totalPayable?: number;
  @ApiPropertyOptional() outstandingBalance?: number;
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiPropertyOptional({ type: [LoanRepaymentResponseDto] }) repayments?: LoanRepaymentResponseDto[];
}

export class PaginatedLoansDto {
  @ApiProperty({ type: [LoanResponseDto] }) loans: LoanResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}

export class LoanStatsDto {
  @ApiProperty() totalDisbursed: number;
  @ApiProperty() activeLoans: number;
  @ApiProperty() outstandingBalance: number;
  @ApiProperty() overdueLoans: number;
  @ApiProperty() completedLoans: number;
  @ApiProperty() defaultedLoans: number;
  @ApiProperty() interestEarned: number;
}
