import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class RecordRepaymentDto {
  @ApiProperty({ description: 'Repayment amount', example: 10000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'External payment reference (e.g. M-Pesa code)' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Payment date (defaults to now)' })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;
}
