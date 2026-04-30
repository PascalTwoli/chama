import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsISO8601,
  IsUUID,
  Length,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense description',
    example: 'Office supplies purchase',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  description!: string;

  @ApiProperty({
    description: 'Expense amount',
    example: 5000.0,
    type: Number,
  })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '0,2' })
  amount!: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'uuid-here',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty({
    description: 'Who received/benefited from the expense',
    example: 'John Doe or Vendor Name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  paidTo!: string;

  @ApiProperty({
    description: 'Payment method used',
    enum: ['MPESA', 'BANK_TRANSFER', 'CASH', 'OTHER'],
    example: 'MPESA',
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({
    description: 'Reference number (e.g., transaction ID, check number)',
    example: 'TXN123456',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  referenceNumber?: string;

  @ApiProperty({
    description: 'ISO 8601 date when expense occurred',
    example: '2026-03-15T10:30:00Z',
    type: String,
  })
  @IsNotEmpty()
  @IsISO8601()
  expenseDate!: string;

  @ApiProperty({
    description: 'Additional notes about the expense',
    example: 'Bulk purchase for office use',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiProperty({
    description: 'URL to receipt or attachment',
    example: 'https://storage.example.com/receipts/123.pdf',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({
    description: 'Chama ID (provided as query parameter in request)',
    example: 'uuid-here',
    type: String,
  })
  chamaId!: string;
}
