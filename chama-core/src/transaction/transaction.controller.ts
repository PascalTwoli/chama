import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';
import { TransactionService } from './transaction.service';

/**
 * Interface for Transaction response
 */
interface TransactionResponse {
  id: string;
  type: TransactionType; // Using Prisma's TransactionType
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Creates a new financial transaction
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new financial transaction for a chama',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Transaction ID' },
        type: { type: 'string', enum: Object.values(TransactionType), description: 'Transaction type' },
        amount: { type: 'number', description: 'Transaction amount' },
        chamaId: { type: 'string', description: 'ID of the chama' },
        userId: { type: 'string', description: 'ID of the user who created the transaction' },
        description: { type: 'string', description: 'Transaction description' },
        reference: { type: 'string', description: 'External reference number' },
        status: { type: 'string', description: 'Transaction status' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid transaction data' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to create transactions for this chama' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<TransactionResponse> {
    try {
      // The service will handle validations like:
      // - Ensuring the user is a member of the chama
      // - Validating the transaction amount against chama rules
      // - Handling financial operations safely
      return await this.transactionService.createTransaction(createTransactionDto, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets all transactions for a specific chama
   */
  @Get('chama/:chamaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all transactions for a chama',
    description: 'Returns all transactions for a specific chama the user is a member of',
  })
  @ApiParam({ name: 'chamaId', description: 'ID of the chama', type: 'string' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TransactionType,
    description: 'Filter transactions by type',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter transactions by start date (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter transactions by end date (ISO format)',
  })
  @ApiOkResponse({
    description: 'List of transactions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Transaction ID' },
          type: { type: 'string', enum: Object.values(TransactionType), description: 'Transaction type' },
          amount: { type: 'number', description: 'Transaction amount' },
          chamaId: { type: 'string', description: 'ID of the chama' },
          userId: { type: 'string', description: 'ID of the user who created the transaction' },
          description: { type: 'string', description: 'Transaction description' },
          reference: { type: 'string', description: 'External reference number' },
          status: { type: 'string', description: 'Transaction status' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to view transactions for this chama' })
  @ApiNotFoundResponse({ description: 'Chama not found' })
  async getTransactionsByChama(
    @Param('chamaId') chamaId: string,
    @Query('type') type?: TransactionType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CurrentUser() currentUser?: CurrentUserType,
  ): Promise<TransactionResponse[]> {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      return await this.transactionService.getTransactionsByChama(
        chamaId,
        currentUser.id,
        type,
        startDate,
        endDate,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets a specific transaction by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Returns a specific transaction by its ID',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID', type: 'string' })
  @ApiOkResponse({
    description: 'Transaction details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Transaction ID' },
        type: { type: 'string', enum: Object.values(TransactionType), description: 'Transaction type' },
        amount: { type: 'number', description: 'Transaction amount' },
        chamaId: { type: 'string', description: 'ID of the chama' },
        userId: { type: 'string', description: 'ID of the user who created the transaction' },
        description: { type: 'string', description: 'Transaction description' },
        reference: { type: 'string', description: 'External reference number' },
        status: { type: 'string', description: 'Transaction status' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to view this transaction' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async getTransactionById(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<TransactionResponse> {
    try {
      const transaction = await this.transactionService.getTransactionById(id, currentUser.id);
      
      // Convert to TransactionResponse format
      const response: TransactionResponse = {
        id: transaction.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        chamaId: transaction.chamaId,
        userId: transaction.userId,
        description: transaction.description || undefined,
        reference: transaction.reference || undefined,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      };
      
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets user's transaction summary
   */
  @Get('user/summary')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user transaction summary',
    description: 'Returns a summary of all transactions for the current user across all chamas',
  })
  @ApiOkResponse({
    description: 'User transaction summary',
    schema: {
      type: 'object',
      properties: {
        totalContributions: { type: 'number', description: 'Total amount contributed' },
        totalWithdrawals: { type: 'number', description: 'Total amount withdrawn' },
        totalLoans: { type: 'number', description: 'Total loans taken' },
        totalRepayments: { type: 'number', description: 'Total loan repayments' },
        chamaStats: {
          type: 'array',
          description: 'Transaction statistics per chama',
          items: {
            type: 'object',
            properties: {
              chamaId: { type: 'string', description: 'ID of the chama' },
              chamaName: { type: 'string', description: 'Name of the chama' },
              contributions: { type: 'number', description: 'Total contributions to this chama' },
              withdrawals: { type: 'number', description: 'Total withdrawals from this chama' },
              loans: { type: 'number', description: 'Total loans from this chama' },
              repayments: { type: 'number', description: 'Total loan repayments to this chama' },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  async getUserTransactionSummary(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<{
    totalContributions: number;
    totalWithdrawals: number;
    totalLoans: number;
    totalRepayments: number;
    chamaStats: Array<{
      chamaId: string;
      chamaName: string;
      contributions: number;
      withdrawals: number;
      loans: number;
      repayments: number;
    }>;
  }> {
    try {
      return await this.transactionService.getUserTransactionSummary(currentUser.id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch transaction summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

