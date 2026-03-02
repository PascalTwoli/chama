import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateJoinRequestDto {
  @ApiProperty({
    description: 'The UUID of the chama to request to join',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'Optional message to the chama administrators',
    example: 'I would like to join your savings group',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
