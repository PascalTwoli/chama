import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty({ description: 'Notification ID' })
  @IsUUID()
  id: string;
}
