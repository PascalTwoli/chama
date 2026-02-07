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
exports.UserEntity = void 0;
const swagger_1 = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const class_transformer_1 = require('class-transformer');
const base_entity_1 = require('./base.entity');
const models_1 = require('../models');
/**
 * User entity class with validation decorators
 *
 * Implements the Prisma User model with class-validator decorators
 * for proper validation and transformation of user data.
 */
class UserEntity extends base_entity_1.Entity {
  constructor(partial) {
    super(partial);
  }
}
exports.UserEntity = UserEntity;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Full name of the user',
      example: 'John Doe',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Object),
  ],
  UserEntity.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Email address of the user',
      example: 'john.doe@example.com',
      required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Object),
  ],
  UserEntity.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Phone number of the user',
      example: '+254712345678',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Object),
  ],
  UserEntity.prototype,
  'phone',
  void 0,
);
__decorate(
  [(0, class_transformer_1.Exclude)(), __metadata('design:type', Object)],
  UserEntity.prototype,
  'passwordHash',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'User role in the system',
      enum: models_1.UserRole,
      example: models_1.UserRole.MEMBER,
    }),
    (0, class_validator_1.IsEnum)(models_1.UserRole, {
      message: `Role must be one of: ${Object.values(models_1.UserRole).join(', ')}`,
    }),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
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
    __metadata('design:type', Object),
  ],
  UserEntity.prototype,
  'activeUserType',
  void 0,
);
