import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LoanStatus } from '@prisma/client';

export class LoanQueryDto {
  @ApiPropertyOptional({ description: 'Filter by chama ID' })
  @IsString()
  @IsOptional()
  chamaId?: string;

  @ApiPropertyOptional({ enum: LoanStatus, description: 'Filter by loan status' })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @ApiPropertyOptional({ description: 'Search by borrower name or reference code' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number (default: 1)', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page (default: 20)', default: 20 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
