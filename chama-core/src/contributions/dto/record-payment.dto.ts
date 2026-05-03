import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class RecordPaymentDto {
  @ApiProperty({ example: 'chama-uuid-123' })
  @IsString()
  @IsNotEmpty()
  chamaId!: string;

  @ApiProperty({ example: 'user-uuid-456', description: 'Member paying' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MPESA })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({ example: 'QKJ2345MPESA' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: '2026-04-10T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiPropertyOptional({ example: 'April contribution' })
  @IsOptional()
  @IsString()
  notes?: string;
}
