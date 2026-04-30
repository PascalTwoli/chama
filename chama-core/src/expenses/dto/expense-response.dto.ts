import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsISO8601 } from 'class-validator';

export class ExpenseCategoryDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'uuid-here',
    type: String,
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Administrative',
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Timestamp when created',
    example: '2026-03-15T10:30:00Z',
    type: String,
  })
  @IsISO8601()
  createdAt!: string;

  @ApiProperty({
    description: 'Chama ID (null for global categories)',
    example: 'uuid-here',
    type: String,
    nullable: true,
  })
  chamaId?: string | null;
}

export class ExpenseResponseDto {
  @ApiProperty({
    description: 'Expense ID',
    example: 'uuid-here',
    type: String,
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Auto-generated reference code',
    example: 'EXP-2026-001',
    type: String,
  })
  @IsString()
  referenceCode!: string;

  @ApiProperty({
    description: 'Chama ID',
    example: 'uuid-here',
    type: String,
  })
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'Expense description',
    example: 'Office supplies',
    type: String,
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Expense amount',
    example: 5000.0,
    type: Number,
  })
  amount!: number;

  @ApiProperty({
    description: 'Category',
    type: ExpenseCategoryDto,
  })
  category!: ExpenseCategoryDto;

  @ApiProperty({
    description: 'Recipient name or vendor',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  paidTo!: string;

  @ApiProperty({
    description: 'Payment method used',
    enum: ['MPESA', 'BANK_TRANSFER', 'CASH', 'OTHER'],
    example: 'MPESA',
  })
  @IsString()
  paymentMethod!: string;

  @ApiProperty({
    description: 'Reference number for payment',
    example: 'TXN123456',
    type: String,
    nullable: true,
  })
  referenceNumber?: string | null;

  @ApiProperty({
    description: 'When the expense occurred',
    example: '2026-03-15T10:30:00Z',
    type: String,
  })
  @IsISO8601()
  expenseDate!: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Office supplies purchase',
    type: String,
    nullable: true,
  })
  notes?: string | null;

  @ApiProperty({
    description: 'URL to receipt/attachment',
    example: 'https://storage.example.com/receipts/123.pdf',
    type: String,
    nullable: true,
  })
  attachmentUrl?: string | null;

  @ApiProperty({
    description: 'User ID who created the expense',
    example: 'uuid-here',
    type: String,
  })
  @IsUUID()
  createdBy!: string;

  @ApiProperty({
    description: 'Expense status',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    example: 'PENDING',
  })
  @IsString()
  status!: string;

  @ApiProperty({
    description: 'User ID who approved the expense',
    example: 'uuid-here',
    type: String,
    nullable: true,
  })
  @IsUUID()
  approvedBy?: string | null;

  @ApiProperty({
    description: 'Approver user information with role',
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'string', example: 'uuid-here' },
      name: { type: 'string', example: 'John Doe' },
      role: { type: 'string', example: 'Chairperson' },
    },
  })
  approver?: {
    id: string;
    name: string;
    role: string;
  } | null;

  @ApiProperty({
    description: 'Timestamp when approved',
    example: '2026-03-15T10:30:00Z',
    type: String,
    nullable: true,
  })
  @IsISO8601()
  approvedAt?: string | null;

  @ApiProperty({
    description: 'User ID who rejected the expense',
    example: 'uuid-here',
    type: String,
    nullable: true,
  })
  @IsUUID()
  rejectedBy?: string | null;

  @ApiProperty({
    description: 'Rejector user information with role',
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'string', example: 'uuid-here' },
      name: { type: 'string', example: 'Jane Smith' },
      role: { type: 'string', example: 'Chairperson' },
    },
  })
  rejector?: {
    id: string;
    name: string;
    role: string;
  } | null;

  @ApiProperty({
    description: 'Timestamp when rejected',
    example: '2026-03-15T10:30:00Z',
    type: String,
    nullable: true,
  })
  @IsISO8601()
  rejectedAt?: string | null;

  @ApiProperty({
    description: 'Timestamp when created',
    example: '2026-03-15T10:30:00Z',
    type: String,
  })
  @IsISO8601()
  createdAt!: string;
}

export class PaginatedExpensesDto {
  @ApiProperty({
    description: 'List of expenses',
    type: [ExpenseResponseDto],
  })
  data!: ExpenseResponseDto[];

  @ApiProperty({
    description: 'Total number of expenses',
    example: 100,
    type: Number,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
    type: Number,
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    type: Number,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total pages',
    example: 5,
    type: Number,
  })
  totalPages!: number;
}

export class ExpenseStatsDto {
  @ApiProperty({
    description: 'Total sum of all expenses for the chama',
    example: 50000.0,
    type: Number,
  })
  totalExpenses!: number;

  @ApiProperty({
    description: 'Sum of expenses for current month',
    example: 15000.0,
    type: Number,
  })
  thisMonthExpenses!: number;

  @ApiProperty({
    description: 'Highest single expense amount',
    example: 5000.0,
    type: Number,
  })
  largestExpense!: number;

  @ApiProperty({
    description: 'Category with highest total spend',
    example: 'Administrative',
    type: String,
  })
  topCategory!: string;
}

export class GetExpensesQueryDto {
  @ApiProperty({
    description: 'Chama ID (required)',
    example: 'uuid-here',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  page: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  limit: number = 20;

  @ApiProperty({
    description: 'Filter by category ID',
    example: 'uuid-here',
    type: String,
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Filter from date (ISO 8601)',
    example: '2026-01-01T00:00:00Z',
    type: String,
    required: false,
  })
  @IsISO8601()
  dateFrom?: string;

  @ApiProperty({
    description: 'Filter to date (ISO 8601)',
    example: '2026-03-31T23:59:59Z',
    type: String,
    required: false,
  })
  @IsISO8601()
  dateTo?: string;

  @ApiProperty({
    description: 'Filter by payment method',
    enum: ['MPESA', 'BANK_TRANSFER', 'CASH', 'OTHER'],
    required: false,
  })
  paymentMethod?: string;

  @ApiProperty({
    description: 'Filter by expense status',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    required: false,
  })
  status?: string;
}
