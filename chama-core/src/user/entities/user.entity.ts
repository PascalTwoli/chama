import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserType } from '@prisma/client';

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
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+254712345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The active user type',
    enum: UserType,
    example: UserType.MEMBER,
  })
  @IsEnum(UserType)
  @IsOptional()
  activeUserType?: UserType;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  createdAt!: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2025-06-01T14:57:46.109Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  updatedAt!: Date;

  // Exclude password hash from responses
  @Exclude()
  passwordHash?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

// Firebase user entity for combined responses
@Expose()
export class FirebaseUserEntity {
  @ApiProperty({
    description: 'The Firebase UID of the user',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  uid!: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+254712345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: true,
  })
  @IsOptional()
  emailVerified?: boolean;

  constructor(partial: Partial<FirebaseUserEntity>) {
    Object.assign(this, partial);
  }
}

// Combined user response entity - Firebase data removed
@Expose()
export class UserResponseEntity {
  @ApiProperty({
    description: 'Local user information',
    type: UserEntity,
  })
  localUser!: UserEntity;

  constructor(partial: Partial<UserResponseEntity>) {
    if (partial.localUser) {
      this.localUser = new UserEntity(partial.localUser);
    } else {
      // Initialize with empty object if localUser is undefined
      this.localUser = new UserEntity({});
    }
  }
}

export class User {}
