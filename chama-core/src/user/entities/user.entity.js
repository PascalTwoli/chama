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
exports.User =
  exports.UserResponseEntity =
  exports.FirebaseUserEntity =
  exports.UserEntity =
    void 0;
const swagger_1 = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const class_transformer_1 = require('class-transformer');
const client_1 = require('@prisma/client');
let UserEntity = class UserEntity {
  constructor(partial) {
    Object.assign(this, partial);
  }
};
exports.UserEntity = UserEntity;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The unique identifier of the user',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The name of the user',
      example: 'John Doe',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The email address of the user',
      example: 'john.doe@example.com',
      required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The phone number of the user',
      example: '+254712345678',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The active user type',
      enum: client_1.UserType,
      example: client_1.UserType.MEMBER,
    }),
    (0, class_validator_1.IsEnum)(client_1.UserType),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'activeUserType',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The date when the user was created',
      example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) =>
      value instanceof Date ? value : new Date(value),
    ),
    __metadata('design:type', Date),
  ],
  UserEntity.prototype,
  'createdAt',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The date when the user was last updated',
      example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) =>
      value instanceof Date ? value : new Date(value),
    ),
    __metadata('design:type', Date),
  ],
  UserEntity.prototype,
  'updatedAt',
  void 0,
);
__decorate(
  [(0, class_transformer_1.Exclude)(), __metadata('design:type', String)],
  UserEntity.prototype,
  'passwordHash',
  void 0,
);
exports.UserEntity = UserEntity = __decorate(
  [
    (0, class_transformer_1.Expose)(),
    __metadata('design:paramtypes', [Object]),
  ],
  UserEntity,
);
// Firebase user entity for combined responses
let FirebaseUserEntity = class FirebaseUserEntity {
  constructor(partial) {
    Object.assign(this, partial);
  }
};
exports.FirebaseUserEntity = FirebaseUserEntity;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The Firebase UID of the user',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  FirebaseUserEntity.prototype,
  'uid',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The email address of the user',
      example: 'john.doe@example.com',
      required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  FirebaseUserEntity.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The display name of the user',
      example: 'John Doe',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  FirebaseUserEntity.prototype,
  'displayName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The phone number of the user',
      example: '+254712345678',
      required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  FirebaseUserEntity.prototype,
  'phoneNumber',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Whether the user email is verified',
      example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Boolean),
  ],
  FirebaseUserEntity.prototype,
  'emailVerified',
  void 0,
);
exports.FirebaseUserEntity = FirebaseUserEntity = __decorate(
  [
    (0, class_transformer_1.Expose)(),
    __metadata('design:paramtypes', [Object]),
  ],
  FirebaseUserEntity,
);
// Combined user response entity - Firebase data removed
let UserResponseEntity = class UserResponseEntity {
  constructor(partial) {
    if (partial.localUser) {
      this.localUser = new UserEntity(partial.localUser);
    } else {
      // Initialize with empty object if localUser is undefined
      this.localUser = new UserEntity({});
    }
  }
};
exports.UserResponseEntity = UserResponseEntity;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Local user information',
      type: UserEntity,
    }),
    __metadata('design:type', UserEntity),
  ],
  UserResponseEntity.prototype,
  'localUser',
  void 0,
);
exports.UserResponseEntity = UserResponseEntity = __decorate(
  [
    (0, class_transformer_1.Expose)(),
    __metadata('design:paramtypes', [Object]),
  ],
  UserResponseEntity,
);
class User {}
exports.User = User;
