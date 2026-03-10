import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { transaction_type } from '@prisma/client';

/**
 * Using transaction_type from Prisma for consistency
 */

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The type of transaction',
    enum: transaction_type,
    example: transaction_type.CONTRIBUTION,
  })
  @IsNotEmpty({ message: 'Transaction type is required' })
  @IsEnum(transaction_type, { message: 'Invalid transaction type' })
  type!: transaction_type;

  @ApiProperty({
    description: 'The amount for the transaction',
    example: 1000,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(1, { message: 'Amount must be greater than 0' })
  amount!: number;

  @ApiProperty({
    description: 'The ID of the chama this transaction belongs to',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsNotEmpty({ message: 'Chama ID is required' })
  @IsUUID('4', { message: 'Invalid chama ID format' })
  chamaId!: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Monthly contribution',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 'TRX-12345',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Reference must be a string' })
  reference?: string;

  @ApiProperty({
    description:
      'User ID to record the transaction for (admin only). If not provided, uses authenticated user.',
    example: 'HhYUVkHwQJT9bgbkMsquiVjyAxQ2',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
