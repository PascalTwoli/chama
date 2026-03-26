import { ApiProperty } from '@nestjs/swagger';

export class TreasurySummaryDto {
  @ApiProperty({
    description:
      'Treasury balance calculated as: Total Contributions - Total Approved Expenses',
    example: 150000.0,
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
}
