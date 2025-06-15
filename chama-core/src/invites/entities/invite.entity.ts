import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsDate, IsOptional } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

@Expose()
export class ChamaEntity {
  @ApiProperty({
    description: 'The unique identifier of the chama',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The name of the chama',
    example: 'Investment Group',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'The description of the chama',
    example: 'A group for investment opportunities',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  constructor(partial: Partial<ChamaEntity>) {
    Object.assign(this, partial);
  }
}

@Expose()
export class InviteEntity {
  @ApiProperty({
    description: 'The unique identifier of the invite',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The ID of the chama that the invite is for',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'The chama that the invite is for',
    type: ChamaEntity,
    required: false,
  })
  @Type(() => ChamaEntity)
  @IsOptional()
  chama?: ChamaEntity;

  @ApiProperty({
    description: 'The unique token for the invite',
    example: '7f9c2ba5-7f38-4bff-b61d-5d6c3caad65e',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    description: 'The email address the invite was sent to',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  sentToEmail!: string;

  @ApiProperty({
    description: 'The date when the invite expires',
    example: '2025-06-08T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  expiresAt!: Date;

  @ApiProperty({
    description: 'The date when the invite was used',
    example: '2025-06-02T14:57:46.109Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value ? (value instanceof Date ? value : new Date(value)) : null)
  usedAt?: Date | null;

  @ApiProperty({
    description: 'The date when the invite was created',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  createdAt!: Date;

  constructor(partial: Partial<InviteEntity>) {
    Object.assign(this, partial);
    
    if (partial.chama) {
      this.chama = new ChamaEntity(partial.chama);
    }
  }
}

