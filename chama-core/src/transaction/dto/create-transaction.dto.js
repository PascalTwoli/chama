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
exports.CreateTransactionDto = void 0;
const swagger_1 = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const client_1 = require('@prisma/client');
/**
 * Using TransactionType from Prisma for consistency
 */
class CreateTransactionDto {}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The type of transaction',
      enum: client_1.TransactionType,
      example: client_1.TransactionType.CONTRIBUTION,
    }),
    (0, class_validator_1.IsNotEmpty)({
      message: 'Transaction type is required',
    }),
    (0, class_validator_1.IsEnum)(client_1.TransactionType, {
      message: 'Invalid transaction type',
    }),
    __metadata('design:type', String),
  ],
  CreateTransactionDto.prototype,
  'type',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The amount for the transaction',
      example: 1000,
      minimum: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Amount is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Amount must be greater than 0' }),
    __metadata('design:type', Number),
  ],
  CreateTransactionDto.prototype,
  'amount',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The ID of the chama this transaction belongs to',
      example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Chama ID is required' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid chama ID format' }),
    __metadata('design:type', String),
  ],
  CreateTransactionDto.prototype,
  'chamaId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Description of the transaction',
      example: 'Monthly contribution',
      required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({
      message: 'Description must be a string',
    }),
    __metadata('design:type', String),
  ],
  CreateTransactionDto.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Reference number for the transaction',
      example: 'TRX-12345',
      required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reference must be a string' }),
    __metadata('design:type', String),
  ],
  CreateTransactionDto.prototype,
  'reference',
  void 0,
);
