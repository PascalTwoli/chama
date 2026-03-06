import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { InviteEntity } from '../entities/invite.entity';

export class CreateInviteDto {
  @ApiProperty({
    description: 'The UUID of the chama to invite the user to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;

  @ApiPropertyOptional({
    description:
      'The email address of the user to invite (optional for shareable links)',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

@Expose()
export class CreateInviteResponseDto {
  @ApiProperty({
    description: 'The created invite',
    type: InviteEntity,
  })
  @Expose()
  @Type(() => InviteEntity)
  invite!: InviteEntity;

  @ApiProperty({
    description: 'The shareable invite link',
    example: 'http://localhost:3000/join-chama/abc123...',
  })
  @Expose()
  inviteLink!: string;

  constructor(partial: Partial<CreateInviteResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AcceptInviteDto {
  @ApiProperty({
    description: 'The token to accept',
    example: 'abcdef123456',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
