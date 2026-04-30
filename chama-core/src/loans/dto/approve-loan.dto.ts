import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApproveLoanDto {
  @ApiProperty({ description: 'Approved loan amount', example: 50000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  approvedAmount: number;

  @ApiProperty({ description: 'Interest rate percentage', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate: number;

  @ApiProperty({ description: 'Loan duration in months', minimum: 1, maximum: 60 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(60)
  durationMonths: number;

  @ApiPropertyOptional({ description: 'Approval notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectLoanDto {
  @ApiProperty({ description: 'Reason for rejection' })
  @IsString()
  reason: string;
}
