import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO for approving an expense
 */
export class ApproveExpenseDto {
  @ApiProperty({
    description: 'Chama ID (required)',
    example: 'uuid-here',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;
}

/**
 * DTO for rejecting an expense
 */
export class RejectExpenseDto {
  @ApiProperty({
    description: 'Chama ID (required)',
    example: 'uuid-here',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;
}
