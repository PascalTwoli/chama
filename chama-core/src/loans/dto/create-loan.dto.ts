import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsPositive,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LoanStatus } from '@prisma/client';

export class CreateLoanDto {
  @ApiProperty({ description: 'Chama ID' })
  @IsString()
  @IsNotEmpty()
  chamaId: string;

  @ApiProperty({ description: 'Borrower user ID' })
  @IsString()
  @IsNotEmpty()
  borrowerId: string;

  @ApiProperty({ description: 'Requested loan amount', example: 50000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Interest rate percentage', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  interestRate: number;

  @ApiProperty({ description: 'Loan duration in months', minimum: 1, maximum: 60 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(60)
  durationMonths: number;

  @ApiPropertyOptional({ description: 'Purpose of the loan' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ enum: LoanStatus, description: 'Initial status (APPROVED or DISBURSED for admin direct creation)' })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @ApiPropertyOptional({ description: 'Start date (required if status is DISBURSED)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;
}
