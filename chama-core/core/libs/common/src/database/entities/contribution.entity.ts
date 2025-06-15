import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsDate, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Decimal } from 'decimal.js';
import { Entity } from './base.entity';
import { Contribution, ContributionStatus } from '../models';

/**
 * Transformer to convert Prisma Decimal to number for API responses
 * and accept both number and string inputs
 */
function DecimalTransformer() {
  return Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    
    // If it's already a Decimal, convert to number
    if (value instanceof Decimal) {
      return value.toNumber();
    }
    
    // If it's a string or number, ensure it's a valid decimal
    const decimal = new Decimal(value);
    return decimal.toNumber();
  });
}

/**
 * Contribution entity class demonstrating Decimal field handling
 * 
 * Shows how to properly handle Prisma Decimal fields with transformers
 * for API serialization while maintaining type safety.
 */
export class ContributionEntity extends Entity<ContributionEntity> implements Contribution {
  /**
   * ID of the associated Chama
   */
  @ApiProperty({
    description: 'ID of the chama this contribution belongs to',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  chamaId!: string;

  /**
   * ID of the user making the contribution
   */
  @ApiProperty({
    description: 'ID of the user making the contribution',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  userId!: string;

  /**
   * Contribution amount (Decimal field mapped to number)
   */
  @ApiProperty({
    description: 'Amount of the contribution',
    example: 1000.50,
    type: Number,
  })
  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: 'Amount must be a number with at most 2 decimal places',
  })
  @DecimalTransformer()
  amount!: Decimal;

  /**
   * Currency code
   */
  @ApiProperty({
    description: 'Currency code for the contribution',
    example: 'KES',
  })
  @IsString()
  currency!: string;

  /**
   * Contribution status
   */
  @ApiProperty({
    description: 'Status of the contribution',
    enum: ContributionStatus,
    example: ContributionStatus.PENDING,
  })
  @IsEnum(ContributionStatus, {
    message: `Status must be one of: ${Object.values(ContributionStatus).join(', ')}`,
  })
  status!: ContributionStatus;

  /**
   * Date of the contribution
   */
  @ApiProperty({
    description: 'Date when the contribution was made',
    example: '2025-06-07T09:35:54.000Z',
  })
  @IsDate()
  @Type(() => Date)
  date!: Date;

  constructor(partial: Partial<ContributionEntity>) {
    super(partial);
  }
}

/**
 * Helper functions for working with Decimal fields
 */
export class DecimalUtils {
  /**
   * Convert a Decimal to number safely
   */
  static toNumber(decimal: Decimal | number | string | null): number | null {
    if (decimal === null || decimal === undefined) {
      return null;
    }
    
    if (typeof decimal === 'number') {
      return decimal;
    }
    
    if (decimal instanceof Decimal) {
      return decimal.toNumber();
    }
    
    return new Decimal(decimal).toNumber();
  }

  /**
   * Convert a number or string to Decimal
   */
  static toDecimal(value: number | string | Decimal | null): Decimal | null {
    if (value === null || value === undefined) {
      return null;
    }
    
    if (value instanceof Decimal) {
      return value;
    }
    
    return new Decimal(value);
  }

  /**
   * Format decimal as currency string
   */
  static formatCurrency(decimal: Decimal | number | string | null, currency = 'KES'): string {
    const num = DecimalUtils.toNumber(decimal);
    if (num === null) {
      return `${currency} 0.00`;
    }
    
    return `${currency} ${num.toFixed(2)}`;
  }
}

