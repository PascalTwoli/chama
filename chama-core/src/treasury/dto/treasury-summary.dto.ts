import { ApiProperty } from '@nestjs/swagger';

export class TreasurySummaryDto {
  @ApiProperty({
    description:
      'Treasury balance calculated as: Contributions - Expenses - Loans Disbursed + Loan Repayments',
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
    description: 'Total sum of all approved expenses for the chama',
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
    description: 'Total interest earned from completed loans',
    example: 5000.0,
    type: Number,
  })
  totalInterestEarned!: number;

  @ApiProperty({
    description: 'Net worth: treasury balance + outstanding active loan principal',
    example: 167000.0,
    type: Number,
  })
  netWorth!: number;
}
