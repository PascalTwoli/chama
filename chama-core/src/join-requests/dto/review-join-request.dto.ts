import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class ReviewJoinRequestDto {
  @ApiProperty({
    description: 'Whether to approve or reject the request',
    enum: ['approve', 'reject'],
    example: 'approve',
  })
  @IsNotEmpty()
  @IsIn(['approve', 'reject'])
  action!: 'approve' | 'reject';
}
