import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import {
  IsOptional,
  IsString,
  IsDecimal,
  IsEnum,
  IsISO8601,
  IsUUID,
  Min,
  Max,
  Length,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiProperty({
    description: 'Expense description',
    example: 'Office supplies purchase',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @ApiProperty({
    description: 'Expense amount',
    example: 5000.0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Min(0.01)
  @Max(999999.99)
  amount?: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'uuid-here',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Who received/benefited from the expense',
    example: 'John Doe or Vendor Name',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  paidTo?: string;

  @ApiProperty({
    description: 'Payment method used',
    enum: ['MPESA', 'BANK_TRANSFER', 'CASH', 'OTHER'],
    example: 'MPESA',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

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
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  expenseDate?: string;

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
}
