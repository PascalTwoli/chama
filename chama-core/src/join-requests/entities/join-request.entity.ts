import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { join_request_status } from '@prisma/client';

@Expose()
export class UserEntity {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string | null;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

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
  description?: string | null;

  constructor(partial: Partial<ChamaEntity>) {
    Object.assign(this, partial);
  }
}

@Expose()
export class JoinRequestEntity {
  @ApiProperty({
    description: 'The unique identifier of the join request',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The ID of the chama that the join request is for',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'The ID of the user who created the join request',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'The status of the join request',
    enum: join_request_status,
    example: join_request_status.PENDING,
  })
  @IsEnum(join_request_status)
  status!: join_request_status;

  @ApiProperty({
    description: 'Optional message from the user requesting to join',
    example: 'I would like to join your savings group',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string | null;

  @ApiProperty({
    description: 'The date when the join request was created',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  createdAt!: Date;

  @ApiProperty({
    description: 'The date when the join request was last updated',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  updatedAt!: Date;

  @ApiProperty({
    description: 'The ID of the user who reviewed the join request',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reviewedBy?: string | null;

  @ApiProperty({
    description: 'The date when the join request was reviewed',
    example: '2025-06-02T14:57:46.109Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) =>
    value ? (value instanceof Date ? value : new Date(value)) : null,
  )
  reviewedAt?: Date | null;

  @ApiProperty({
    description: 'The user who created the join request',
    type: UserEntity,
    required: false,
  })
  @Type(() => UserEntity)
  @IsOptional()
  user?: UserEntity;

  @ApiProperty({
    description: 'The chama that the join request is for',
    type: ChamaEntity,
    required: false,
  })
  @Type(() => ChamaEntity)
  @IsOptional()
  chama?: ChamaEntity;

  constructor(partial: Partial<JoinRequestEntity>) {
    Object.assign(this, partial);

    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }

    if (partial.chama) {
      this.chama = new ChamaEntity(partial.chama);
    }
  }
}
