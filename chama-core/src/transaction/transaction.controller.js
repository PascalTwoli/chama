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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TransactionController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const current_user_decorator_1 = require('../decorators/current-user.decorator');
const auth_guard_1 = require('../guards/auth.guard');
const create_transaction_dto_1 = require('./dto/create-transaction.dto');
const client_1 = require('@prisma/client');
const transaction_service_1 = require('./transaction.service');
let TransactionController = class TransactionController {
  constructor(transactionService) {
    this.transactionService = transactionService;
  }
  /**
   * Creates a new financial transaction
   */
  createTransaction(createTransactionDto, currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        // The service will handle validations like:
        // - Ensuring the user is a member of the chama
        // - Validating the transaction amount against chama rules
        // - Handling financial operations safely
        return yield this.transactionService.createTransaction(
          createTransactionDto,
          currentUser.id,
        );
      } catch (error) {
        if (error instanceof common_1.NotFoundException) {
          throw error;
        }
        if (error instanceof common_1.ForbiddenException) {
          throw error;
        }
        if (error instanceof common_1.BadRequestException) {
          throw error;
        }
        throw new common_1.InternalServerErrorException(
          `Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    });
  }
  /**
   * Gets all transactions for a specific chama
   */
  getTransactionsByChama(chamaId, type, startDate, endDate, currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!currentUser) {
          throw new Error('User not authenticated');
        }
        return yield this.transactionService.getTransactionsByChama(
          chamaId,
          currentUser.id,
          type,
          startDate,
          endDate,
        );
      } catch (error) {
        if (error instanceof common_1.NotFoundException) {
          throw error;
        }
        if (error instanceof common_1.ForbiddenException) {
          throw error;
        }
        throw new common_1.InternalServerErrorException(
          `Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    });
  }
  /**
   * Gets a specific transaction by ID
   */
  getTransactionById(id, currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const transaction = yield this.transactionService.getTransactionById(
          id,
          currentUser.id,
        );
        // Convert to TransactionResponse format
        const response = {
          id: transaction.id,
          type: transaction.type,
          amount: Number(transaction.amount),
          chamaId: transaction.chamaId,
          userId: transaction.userId,
          description: transaction.description || undefined,
          reference: transaction.reference || undefined,
          status: transaction.status,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        };
        return response;
      } catch (error) {
        if (error instanceof common_1.NotFoundException) {
          throw error;
        }
        if (error instanceof common_1.ForbiddenException) {
          throw error;
        }
        throw new common_1.InternalServerErrorException(
          `Failed to fetch transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    });
  }
  /**
   * Gets user's transaction summary
   */
  getUserTransactionSummary(currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return yield this.transactionService.getUserTransactionSummary(
          currentUser.id,
        );
      } catch (error) {
        throw new common_1.InternalServerErrorException(
          `Failed to fetch transaction summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    });
  }
};
exports.TransactionController = TransactionController;
__decorate(
  [
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
      summary: 'Create a new transaction',
      description: 'Creates a new financial transaction for a chama',
    }),
    (0, swagger_1.ApiBody)({
      type: create_transaction_dto_1.CreateTransactionDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
      description: 'Transaction created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Transaction ID' },
          type: {
            type: 'string',
            enum: Object.values(client_1.TransactionType),
            description: 'Transaction type',
          },
          amount: { type: 'number', description: 'Transaction amount' },
          chamaId: { type: 'string', description: 'ID of the chama' },
          userId: {
            type: 'string',
            description: 'ID of the user who created the transaction',
          },
          description: {
            type: 'string',
            description: 'Transaction description',
          },
          reference: {
            type: 'string',
            description: 'External reference number',
          },
          status: { type: 'string', description: 'Transaction status' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
      description: 'Invalid transaction data',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'User not authenticated',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
      description: 'User not authorized to create transactions for this chama',
    }),
    (0, common_1.UsePipes)(
      new common_1.ValidationPipe({ transform: true, whitelist: true }),
    ),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      create_transaction_dto_1.CreateTransactionDto,
      Object,
    ]),
    __metadata('design:returntype', Promise),
  ],
  TransactionController.prototype,
  'createTransaction',
  null,
);
__decorate(
  [
    (0, common_1.Get)('chama/:chamaId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Get all transactions for a chama',
      description:
        'Returns all transactions for a specific chama the user is a member of',
    }),
    (0, swagger_1.ApiParam)({
      name: 'chamaId',
      description: 'ID of the chama',
      type: 'string',
    }),
    (0, swagger_1.ApiQuery)({
      name: 'type',
      required: false,
      enum: client_1.TransactionType,
      description: 'Filter transactions by type',
    }),
    (0, swagger_1.ApiQuery)({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Filter transactions by start date (ISO format)',
    }),
    (0, swagger_1.ApiQuery)({
      name: 'endDate',
      required: false,
      type: String,
      description: 'Filter transactions by end date (ISO format)',
    }),
    (0, swagger_1.ApiOkResponse)({
      description: 'List of transactions',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Transaction ID' },
            type: {
              type: 'string',
              enum: Object.values(client_1.TransactionType),
              description: 'Transaction type',
            },
            amount: { type: 'number', description: 'Transaction amount' },
            chamaId: { type: 'string', description: 'ID of the chama' },
            userId: {
              type: 'string',
              description: 'ID of the user who created the transaction',
            },
            description: {
              type: 'string',
              description: 'Transaction description',
            },
            reference: {
              type: 'string',
              description: 'External reference number',
            },
            status: { type: 'string', description: 'Transaction status' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'User not authenticated',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
      description: 'User not authorized to view transactions for this chama',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Chama not found' }),
    __param(0, (0, common_1.Param)('chamaId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String, String, String, Object]),
    __metadata('design:returntype', Promise),
  ],
  TransactionController.prototype,
  'getTransactionsByChama',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Get transaction by ID',
      description: 'Returns a specific transaction by its ID',
    }),
    (0, swagger_1.ApiParam)({
      name: 'id',
      description: 'Transaction ID',
      type: 'string',
    }),
    (0, swagger_1.ApiOkResponse)({
      description: 'Transaction details',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Transaction ID' },
          type: {
            type: 'string',
            enum: Object.values(client_1.TransactionType),
            description: 'Transaction type',
          },
          amount: { type: 'number', description: 'Transaction amount' },
          chamaId: { type: 'string', description: 'ID of the chama' },
          userId: {
            type: 'string',
            description: 'ID of the user who created the transaction',
          },
          description: {
            type: 'string',
            description: 'Transaction description',
          },
          reference: {
            type: 'string',
            description: 'External reference number',
          },
          status: { type: 'string', description: 'Transaction status' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'User not authenticated',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
      description: 'User not authorized to view this transaction',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
      description: 'Transaction not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Object]),
    __metadata('design:returntype', Promise),
  ],
  TransactionController.prototype,
  'getTransactionById',
  null,
);
__decorate(
  [
    (0, common_1.Get)('user/summary'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Get user transaction summary',
      description:
        'Returns a summary of all transactions for the current user across all chamas',
    }),
    (0, swagger_1.ApiOkResponse)({
      description: 'User transaction summary',
      schema: {
        type: 'object',
        properties: {
          totalContributions: {
            type: 'number',
            description: 'Total amount contributed',
          },
          totalWithdrawals: {
            type: 'number',
            description: 'Total amount withdrawn',
          },
          totalLoans: { type: 'number', description: 'Total loans taken' },
          totalRepayments: {
            type: 'number',
            description: 'Total loan repayments',
          },
          chamaStats: {
            type: 'array',
            description: 'Transaction statistics per chama',
            items: {
              type: 'object',
              properties: {
                chamaId: { type: 'string', description: 'ID of the chama' },
                chamaName: { type: 'string', description: 'Name of the chama' },
                contributions: {
                  type: 'number',
                  description: 'Total contributions to this chama',
                },
                withdrawals: {
                  type: 'number',
                  description: 'Total withdrawals from this chama',
                },
                loans: {
                  type: 'number',
                  description: 'Total loans from this chama',
                },
                repayments: {
                  type: 'number',
                  description: 'Total loan repayments to this chama',
                },
              },
            },
          },
        },
      },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'User not authenticated',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  TransactionController.prototype,
  'getUserTransactionSummary',
  null,
);
exports.TransactionController = TransactionController = __decorate(
  [
    (0, swagger_1.ApiTags)('Transactions'),
    (0, common_1.Controller)('transactions'),
    __metadata('design:paramtypes', [transaction_service_1.TransactionService]),
  ],
  TransactionController,
);
