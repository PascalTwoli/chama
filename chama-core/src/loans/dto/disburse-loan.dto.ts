import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DisburseLoanDto {
  @ApiProperty({ description: 'Loan start date (ISO 8601)', example: '2026-05-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;
}
