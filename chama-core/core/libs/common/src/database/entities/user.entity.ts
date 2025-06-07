import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity } from './base.entity';
import { User, UserRole, UserType } from '../models';

/**
 * User entity class with validation decorators
 * 
 * Implements the Prisma User model with class-validator decorators
 * for proper validation and transformation of user data.
 */
export class UserEntity extends Entity<UserEntity> implements User {
  /**
   * User's full name
   */
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string | null;

  /**
   * User's email address
   */
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string | null;

  /**
   * User's phone number
   */
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+254712345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string | null;

  /**
   * Password hash (excluded from responses)
   */
  @Exclude()
  passwordHash: string | null;

  /**
   * User's role in the system
   */
  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;

  /**
   * Active user type
   */
  @ApiProperty({
    description: 'Active user type',
    enum: UserType,
    example: UserType.MEMBER,
    required: false,
  })
  @IsEnum(UserType, {
    message: `Active user type must be one of: ${Object.values(UserType).join(', ')}`,
  })
  @IsOptional()
  activeUserType: UserType | null;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
  }
}

