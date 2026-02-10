import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, IsDate } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { UserEntity } from '../../user/entities/user.entity';
import { ChamaEntity } from './invite.entity';

@Expose()
export class MembershipEntity {
  @ApiProperty({
    description: 'The unique identifier of the membership',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'The user associated with the membership',
    type: UserEntity,
  })
  @Type(() => UserEntity)
  user?: UserEntity;

  @ApiProperty({
    description: 'The ID of the chama',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'The chama associated with the membership',
    type: ChamaEntity,
  })
  @Type(() => ChamaEntity)
  chama?: ChamaEntity;

  @ApiProperty({
    description: 'The role of the user in the chama',
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    description: 'The date when the user joined the chama',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  joinedAt!: Date;

  @ApiProperty({
    description: 'The date when the membership was created',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  createdAt!: Date;

  @ApiProperty({
    description: 'The date when the membership was last updated',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  updatedAt!: Date;

  constructor(partial: Partial<MembershipEntity>) {
    Object.assign(this, partial);

    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }

    if (partial.chama) {
      this.chama = new ChamaEntity(partial.chama);
    }
  }
}
