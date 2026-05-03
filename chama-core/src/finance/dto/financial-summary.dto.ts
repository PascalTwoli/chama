import { ApiProperty } from '@nestjs/swagger';

export class FinanceSummaryDto {
  @ApiProperty({
    description:
      'Treasury balance: all CREDIT transactions minus all DEBIT transactions (completed)',
    example: 125000.0,
    type: Number,
  })
  treasuryBalance!: number;

  @ApiProperty({
    description: 'Total sum of all completed contributions for the chama',
    example: 200000.0,
    type: Number,
  })
  totalContributions!: number;

  @ApiProperty({
    description:
      'Total sum of all completed expense transactions for the chama',
    example: 50000.0,
    type: Number,
  })
  totalExpenses!: number;

  @ApiProperty({
    description: 'Total sum of all disbursed loans (treasury outflow)',
    example: 60000.0,
    type: Number,
  })
  totalLoansDisbursed!: number;

  @ApiProperty({
    description: 'Total sum of loan repayments (treasury inflow)',
    example: 30000.0,
    type: Number,
  })
  totalLoanRepayments!: number;

  @ApiProperty({
    description: 'Total interest earned from loan repayments',
    example: 5000.0,
    type: Number,
  })
  totalInterestEarned!: number;

  @ApiProperty({
    description: 'Total outstanding loan balance across active/overdue loans',
    example: 42000.0,
    type: Number,
  })
  outstandingLoans!: number;

  @ApiProperty({
    description: 'Count of active loans',
    example: 4,
    type: Number,
  })
  activeLoansCount!: number;

  @ApiProperty({
    description: 'Count of overdue loans',
    example: 1,
    type: Number,
  })
  overdueLoansCount!: number;

  @ApiProperty({
    description: 'Count of defaulted loans',
    example: 0,
    type: Number,
  })
  defaultedLoansCount!: number;

  @ApiProperty({
    description:
      'Net worth: treasury balance + outstanding active loan principal',
    example: 167000.0,
    type: Number,
  })
  netWorth!: number;
}

export class CashflowPointDto {
  @ApiProperty({ example: '2024-09' })
  month!: string;

  @ApiProperty({ description: 'Contributions received', example: 15000.0, type: Number })
  income!: number;

  @ApiProperty({ description: 'Expenses and fees paid out', example: 3000.0, type: Number })
  expenses!: number;

  @ApiProperty({ description: 'Loans disbursed (outflow)', example: 5000.0, type: Number })
  loansOut!: number;

  @ApiProperty({ description: 'Loan repayments received (principal + interest)', example: 2000.0, type: Number })
  repayments!: number;

  @ApiProperty({ description: 'net = income + repayments - expenses - loansOut', example: 9000.0, type: Number })
  net!: number;
}

export class CashflowResponseDto {
  @ApiProperty({ type: [CashflowPointDto] })
  data!: CashflowPointDto[];
}

export class ExpenseBreakdownItemDto {
  @ApiProperty({ example: 'cat-123' })
  categoryId!: string;

  @ApiProperty({ example: 'Administrative' })
  categoryName!: string;

  @ApiProperty({ example: 12000.0, type: Number })
  total!: number;
}

export class ExpenseBreakdownDto {
  @ApiProperty({ example: 45000.0, type: Number })
  total!: number;

  @ApiProperty({ type: [ExpenseBreakdownItemDto] })
  items!: ExpenseBreakdownItemDto[];
}
