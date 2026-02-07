import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole, UserType } from '../models';

/**
 * Data Transfer Object for creating a new user
 *
 * Demonstrates proper validation using Prisma enums and class-validator decorators.
 * Includes transformation and validation rules for all user creation fields.
 */
export class CreateUserDto {
  /**
   * User's full name
   */
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'Name must be between 2 and 100 characters',
  })
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * User's email address
   */
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  /**
   * User's phone number
   */
  @ApiProperty({
    description: 'Phone number of the user (international format)',
    example: '+254712345678',
    pattern: '^\\+[1-9]\\d{1,14}$',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Phone number must be in international format (e.g., +254712345678)',
  })
  phone?: string;

  /**
   * User's password (will be hashed before storage)
   */
  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
    maxLength: 128,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(8, 128, {
    message: 'Password must be between 8 and 128 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  /**
   * User's role in the system
   */
  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.MEMBER,
    default: UserRole.MEMBER,
  })
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  @IsOptional()
  role?: UserRole = UserRole.MEMBER;

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
  activeUserType?: UserType;

  /**
   * Firebase UID for integration
   */
  @ApiProperty({
    description: 'Firebase user ID for integration',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  firebaseUid?: string;
}

/**
 * Data Transfer Object for updating user information
 */
export class UpdateUserDto {
  /**
   * User's full name
   */
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'Name must be between 2 and 100 characters',
  })
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * User's email address
   */
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  /**
   * User's phone number
   */
  @ApiProperty({
    description: 'Phone number of the user (international format)',
    example: '+254712345678',
    pattern: '^\\+[1-9]\\d{1,14}$',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Phone number must be in international format (e.g., +254712345678)',
  })
  phone?: string;

  /**
   * User's role in the system
   */
  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.MEMBER,
    required: false,
  })
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  @IsOptional()
  role?: UserRole;

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
  activeUserType?: UserType;
}

/**
 * Data Transfer Object for user login
 */
export class LoginUserDto {
  /**
   * Email or phone number for login
   */
  @ApiProperty({
    description: 'Email address or phone number for login',
    example: 'john.doe@example.com',
  })
  @IsString()
  identifier!: string;

  /**
   * User password
   */
  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
  })
  @IsString()
  password!: string;
}

/**
 * Utility class for DTO validation helpers
 */
export class DtoValidationUtils {
  /**
   * Check if a string is a valid email
   */
  static isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  /**
   * Check if a string is a valid phone number
   */
  static isPhoneNumber(value: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(value);
  }

  /**
   * Validate user role against Prisma enum
   */
  static isValidUserRole(role: string): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
  }

  /**
   * Validate user type against Prisma enum
   */
  static isValidUserType(type: string): type is UserType {
    return Object.values(UserType).includes(type as UserType);
  }

  /**
   * Sanitize and normalize email
   */
  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize and normalize name
   */
  static normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }
}
