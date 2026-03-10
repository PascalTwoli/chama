import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { transaction_type, transaction_status } from '@prisma/client';
import * as crypto from 'crypto';

// Define interface for transaction response that matches the controller's expected format
export interface TransactionResponse {
  id: string;
  type: transaction_type;
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  status: transaction_status;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new financial transaction
   * @param createTransactionDto - Transaction data
   * @param userId - ID of the user creating the transaction (authenticated user)
   * @returns The created transaction
   */
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionResponse> {
    // Determine which user to record the transaction for
    // If userId is provided in DTO (admin recording for member), use that
    // Otherwise use the authenticated user
    const targetUserId = createTransactionDto.userId || userId;

    // First, verify the authenticated user is a member of the chama
    const authenticatedMembership = await this.prisma.membership.findFirst({
      where: {
        chama_id: createTransactionDto.chamaId,
        user_id: userId,
      },
    });

    if (!authenticatedMembership) {
      throw new ForbiddenException('You are not a member of this chama');
    }

    // If recording for a different user, check if authenticated user has admin/treasurer/chairperson role
    if (createTransactionDto.userId && createTransactionDto.userId !== userId) {
      if (!['ADMIN', 'TREASURER', 'CHAIRPERSON'].includes(authenticatedMembership.role)) {
        throw new ForbiddenException('Only chairpersons, admins and treasurers can record transactions for other members');
      }

      // Verify the target user is also a member of the chama
      const targetMembership = await this.prisma.membership.findFirst({
        where: {
          chama_id: createTransactionDto.chamaId,
          user_id: createTransactionDto.userId,
        },
      });

      if (!targetMembership) {
        throw new ForbiddenException('Target user is not a member of this chama');
      }
    }

    // Verify the chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: createTransactionDto.chamaId },
    });

    if (!chama) {
      throw new NotFoundException(
        `Chama with ID ${createTransactionDto.chamaId} not found`,
      );
    }

    // Create the transaction
    try {
      const transaction = await this.prisma.$transaction(async prisma => {
        return await prisma.transaction.create({
          data: {
            id: crypto.randomUUID(),
            type: createTransactionDto.type,
            amount: createTransactionDto.amount,
            chama_id: createTransactionDto.chamaId,
            user_id: targetUserId,
            description: createTransactionDto.description,
            reference: createTransactionDto.reference,
            status: transaction_status.COMPLETED,
            updatedAt: new Date(),
          },
        });
      });

      // Convert Decimal amount to number and null to undefined for response
      // Map snake_case database fields to camelCase for API response
      return {
        id: transaction.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        chamaId: transaction.chama_id,
        userId: transaction.user_id,
        description: transaction.description || undefined,
        reference: transaction.reference || undefined,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets all transactions for a specific chama
   * @param chamaId - ID of the chama
   * @param userId - ID of the user requesting transactions
   * @param type - Optional filter by transaction type
   * @param startDate - Optional filter by start date
   * @param endDate - Optional filter by end date
   * @returns List of transactions
   */
  async getTransactionsByChama(
    chamaId: string,
    userId: string,
    type?: transaction_type,
    startDate?: string,
    endDate?: string,
  ): Promise<TransactionResponse[]> {
    // Verify the user is a member of the chama
    const membership = await this.prisma.membership.findFirst({
      where: {
        chama_id: chamaId,
        user_id: userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
    }

    // Verify the chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Build the where clause based on filters
    const where: any = {
      chama_id: chamaId,
    };

    if (type) {
      where.type = type;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(endDate),
      };
    }

    // Get transactions
    const transactions = await this.prisma.$transaction(async prisma => {
      return await prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    // Convert Decimal amounts to numbers and null to undefined for response
    // Map snake_case database fields to camelCase for API response
    return transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      chamaId: transaction.chama_id,
      userId: transaction.user_id,
      description: transaction.description || undefined,
      reference: transaction.reference || undefined,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));
  }

  /**
   * Gets a specific transaction by ID
   * @param id - Transaction ID
   * @param userId - ID of the user requesting the transaction
   * @returns Transaction details
   */
  async getTransactionById(
    id: string,
    userId: string,
  ): Promise<TransactionResponse> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        chama: {
          include: {
            membership: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Verify the user is a member of the chama or created the transaction
    const isMember = transaction.chama.membership.some(
      membership => membership.user_id === userId,
    );
    const isCreator = transaction.user_id === userId;

    if (!isMember && !isCreator) {
      throw new ForbiddenException(
        'You do not have permission to view this transaction',
      );
    }

    // Exclude nested data before returning and convert Decimal to number
    // Map snake_case database fields to camelCase for API response
    const { chama, ...transactionData } = transaction;
    return {
      id: transactionData.id,
      type: transactionData.type,
      amount: Number(transactionData.amount),
      chamaId: transactionData.chama_id,
      userId: transactionData.user_id,
      description: transactionData.description || undefined,
      reference: transactionData.reference || undefined,
      status: transactionData.status,
      createdAt: transactionData.createdAt,
      updatedAt: transactionData.updatedAt,
    };
  }

  /**
   * Gets a summary of transactions for a user
   * @param userId - ID of the user
   * @returns Transaction summary
   */
  async getUserTransactionSummary(userId: string) {
    // Get all chamas the user is a member of
    const memberships = await this.prisma.membership.findMany({
      where: { user_id: userId },
      include: {
        chama: true,
      },
    });

    const chamaIds = memberships.map(membership => membership.chama_id);

    // Get all transactions for these chamas where the user is involved
    const transactions = await this.prisma.$transaction(async prisma => {
      return await prisma.transaction.findMany({
        where: {
          chama_id: { in: chamaIds },
          user_id: userId,
        },
      });
    });

    // Calculate totals
    let totalContributions = 0;
    let totalWithdrawals = 0;
    let totalLoans = 0;
    let totalRepayments = 0;

    // Group by chama for chama-specific stats
    const chamaStatMap = new Map();

    transactions.forEach(transaction => {
      // Update overall totals
      if (transaction.type === transaction_type.CONTRIBUTION) {
        totalContributions += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.WITHDRAWAL) {
        totalWithdrawals += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.LOAN) {
        totalLoans += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.LOAN_REPAYMENT) {
        totalRepayments += transaction.amount.toNumber();
      }

      // Update chama-specific stats
      if (!chamaStatMap.has(transaction.chama_id)) {
        const chama = memberships.find(
          m => m.chama_id === transaction.chama_id,
        )?.chama;
        chamaStatMap.set(transaction.chama_id, {
          chamaId: transaction.chama_id,
          chamaName: chama?.name || 'Unknown Chama',
          contributions: 0,
          withdrawals: 0,
          loans: 0,
          repayments: 0,
        });
      }

      const chamaStat = chamaStatMap.get(transaction.chama_id);
      if (transaction.type === transaction_type.CONTRIBUTION) {
        chamaStat.contributions += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.WITHDRAWAL) {
        chamaStat.withdrawals += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.LOAN) {
        chamaStat.loans += transaction.amount.toNumber();
      } else if (transaction.type === transaction_type.LOAN_REPAYMENT) {
        chamaStat.repayments += transaction.amount.toNumber();
      }
    });

    return {
      totalContributions,
      totalWithdrawals,
      totalLoans,
      totalRepayments,
      chamaStats: Array.from(chamaStatMap.values()),
    };
  }
}
