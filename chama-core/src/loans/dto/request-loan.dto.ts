import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RequestLoanDto {
  @ApiProperty({ description: 'Chama ID' })
  @IsString()
  @IsNotEmpty()
  chamaId: string;

  @ApiProperty({ description: 'Requested loan amount', example: 50000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

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
}
