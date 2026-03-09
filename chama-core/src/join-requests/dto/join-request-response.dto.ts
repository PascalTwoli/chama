import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class UserInfo {
  @Expose()
  id!: string;

  @Expose()
  name!: string | null;

  @Expose()
  email!: string | null;

  @Expose()
  phoneNumber!: string | null;
}

class ChamaInfo {
  @Expose()
  id!: string;

  @Expose()
  name!: string | null;

  @Expose()
  description!: string | null;
}

export class JoinRequestResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the join request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    description: 'The UUID of the chama',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  chamaId!: string;

  @Expose()
  @ApiProperty({
    description: 'The UUID of the user who created the request',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  userId!: string;

  @Expose()
  @ApiProperty({
    description: 'The current status of the join request',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    example: 'PENDING',
  })
  status!: string;

  @Expose()
  @ApiProperty({
    description: 'Optional message from the requester',
    example: 'I would like to join your savings group',
    required: false,
    nullable: true,
  })
  message?: string | null;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the request was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the request was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt!: Date;

  @Expose()
  @ApiProperty({
    description: 'The UUID of the user who reviewed the request',
    example: '123e4567-e89b-12d3-a456-426614174003',
    required: false,
    nullable: true,
  })
  reviewedBy?: string | null;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the request was reviewed',
    example: '2024-01-15T11:00:00.000Z',
    required: false,
    nullable: true,
  })
  reviewedAt?: Date | null;

  @Expose()
  @Type(() => UserInfo)
  @ApiProperty({
    description: 'Information about the user who created the request',
    required: false,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+254712345678',
    },
  })
  user?: UserInfo;

  @Expose()
  @Type(() => ChamaInfo)
  @ApiProperty({
    description: 'Information about the chama',
    required: false,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Wealth Builders',
      description: 'A group of friends saving together',
    },
  })
  chama?: ChamaInfo;
}
