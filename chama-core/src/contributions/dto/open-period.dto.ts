import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class OpenPeriodDto {
  @ApiProperty({ example: 'cham-uuid-123' })
  @IsString()
  @IsNotEmpty()
  chamaId!: string;

  @ApiProperty({ example: 'April 2026' })
  @IsString()
  @MinLength(2)
  label!: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ example: '2026-04-15', description: 'Payment due date' })
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({
    example: 5000,
    description: 'Override the default contribution amount from chama settings',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  requiredAmount?: number;
}
