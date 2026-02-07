'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DtoValidationUtils =
  exports.LoginUserDto =
  exports.UpdateUserDto =
  exports.CreateUserDto =
    void 0;
const swagger_1 = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const class_transformer_1 = require('class-transformer');
const models_1 = require('../models');
/**
 * Data Transfer Object for creating a new user
 *
 * Demonstrates proper validation using Prisma enums and class-validator decorators.
 * Includes transformation and validation rules for all user creation fields.
 */
class CreateUserDto {
  constructor() {
    /**
     * User's role in the system
     */
    this.role = models_1.UserRole.MEMBER;
  }
}
exports.CreateUserDto = CreateUserDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Full name of the user',
      example: 'John Doe',
      minLength: 2,
      maxLength: 100,
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 100, {
      message: 'Name must be between 2 and 100 characters',
    }),
    (0, class_transformer_1.Transform)(({ value }) =>
      value === null || value === void 0 ? void 0 : value.trim(),
    ),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Email address of the user',
      example: 'john.doe@example.com',
      format: 'email',
      required: false,
    }),
    (0, class_validator_1.IsEmail)(
      {},
      {
        message: 'Please provide a valid email address',
      },
    ),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) =>
      value === null || value === void 0 ? void 0 : value.toLowerCase().trim(),
    ),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Phone number of the user (international format)',
      example: '+254712345678',
      pattern: '^\\+[1-9]\\d{1,14}$',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{1,14}$/, {
      message:
        'Phone number must be in international format (e.g., +254712345678)',
    }),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'User password',
      example: 'SecurePassword123!',
      minLength: 8,
      maxLength: 128,
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(8, 128, {
      message: 'Password must be between 8 and 128 characters',
    }),
    (0, class_validator_1.Matches)(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'password',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'User role in the system',
      enum: models_1.UserRole,
      example: models_1.UserRole.MEMBER,
      default: models_1.UserRole.MEMBER,
    }),
    (0, class_validator_1.IsEnum)(models_1.UserRole, {
      message: `Role must be one of: ${Object.values(models_1.UserRole).join(', ')}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'role',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Active user type',
      enum: models_1.UserType,
      example: models_1.UserType.MEMBER,
      required: false,
    }),
    (0, class_validator_1.IsEnum)(models_1.UserType, {
      message: `Active user type must be one of: ${Object.values(models_1.UserType).join(', ')}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'activeUserType',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Firebase user ID for integration',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateUserDto.prototype,
  'firebaseUid',
  void 0,
);
/**
 * Data Transfer Object for updating user information
 */
class UpdateUserDto {}
exports.UpdateUserDto = UpdateUserDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Full name of the user',
      example: 'John Doe',
      minLength: 2,
      maxLength: 100,
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 100, {
      message: 'Name must be between 2 and 100 characters',
    }),
    (0, class_transformer_1.Transform)(({ value }) =>
      value === null || value === void 0 ? void 0 : value.trim(),
    ),
    __metadata('design:type', String),
  ],
  UpdateUserDto.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Email address of the user',
      example: 'john.doe@example.com',
      format: 'email',
      required: false,
    }),
    (0, class_validator_1.IsEmail)(
      {},
      {
        message: 'Please provide a valid email address',
      },
    ),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) =>
      value === null || value === void 0 ? void 0 : value.toLowerCase().trim(),
    ),
    __metadata('design:type', String),
  ],
  UpdateUserDto.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Phone number of the user (international format)',
      example: '+254712345678',
      pattern: '^\\+[1-9]\\d{1,14}$',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{1,14}$/, {
      message:
        'Phone number must be in international format (e.g., +254712345678)',
    }),
    __metadata('design:type', String),
  ],
  UpdateUserDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'User role in the system',
      enum: models_1.UserRole,
      example: models_1.UserRole.MEMBER,
      required: false,
    }),
    (0, class_validator_1.IsEnum)(models_1.UserRole, {
      message: `Role must be one of: ${Object.values(models_1.UserRole).join(', ')}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UpdateUserDto.prototype,
  'role',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Active user type',
      enum: models_1.UserType,
      example: models_1.UserType.MEMBER,
      required: false,
    }),
    (0, class_validator_1.IsEnum)(models_1.UserType, {
      message: `Active user type must be one of: ${Object.values(models_1.UserType).join(', ')}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UpdateUserDto.prototype,
  'activeUserType',
  void 0,
);
/**
 * Data Transfer Object for user login
 */
class LoginUserDto {}
exports.LoginUserDto = LoginUserDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Email address or phone number for login',
      example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  LoginUserDto.prototype,
  'identifier',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'User password',
      example: 'SecurePassword123!',
    }),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  LoginUserDto.prototype,
  'password',
  void 0,
);
/**
 * Utility class for DTO validation helpers
 */
class DtoValidationUtils {
  /**
   * Check if a string is a valid email
   */
  static isEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
  /**
   * Check if a string is a valid phone number
   */
  static isPhoneNumber(value) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(value);
  }
  /**
   * Validate user role against Prisma enum
   */
  static isValidUserRole(role) {
    return Object.values(models_1.UserRole).includes(role);
  }
  /**
   * Validate user type against Prisma enum
   */
  static isValidUserType(type) {
    return Object.values(models_1.UserType).includes(type);
  }
  /**
   * Sanitize and normalize email
   */
  static normalizeEmail(email) {
    return email.toLowerCase().trim();
  }
  /**
   * Sanitize and normalize name
   */
  static normalizeName(name) {
    return name.trim().replace(/\s+/g, ' ');
  }
}
exports.DtoValidationUtils = DtoValidationUtils;
