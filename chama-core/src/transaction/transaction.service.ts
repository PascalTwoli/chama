import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType, TransactionStatus } from 'generated/prisma';

// Define interface for transaction response that matches the controller's expected format
export interface TransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new financial transaction
   * @param createTransactionDto - Transaction data
   * @param userId - ID of the user creating the transaction
   * @returns The created transaction
   */
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionResponse> {
    // First, verify the user is a member of the chama
    const membership = await this.prisma.membership.findFirst({
      where: {
        chamaId: createTransactionDto.chamaId,
        userId: userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
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
      const transaction = await this.prisma.$transaction(async (prisma) => {
        return await prisma.transaction.create({
          data: {
            type: createTransactionDto.type,
            amount: createTransactionDto.amount,
            chamaId: createTransactionDto.chamaId,
            userId: userId,
            description: createTransactionDto.description,
            reference: createTransactionDto.reference,
            status: 'COMPLETED', // Default status
          },
        });
      });

      // Convert Decimal amount to number and null to undefined for response
      return {
        ...transaction,
        amount: Number(transaction.amount),
        description: transaction.description || undefined,
        reference: transaction.reference || undefined
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create transaction: ${error.message}`,
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
    type?: TransactionType,
    startDate?: string,
    endDate?: string,
  ): Promise<TransactionResponse[]> {
    // Verify the user is a member of the chama
    const membership = await this.prisma.membership.findFirst({
      where: {
        chamaId: chamaId,
        userId: userId,
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
      chamaId: chamaId,
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
    const transactions = await this.prisma.$transaction(async (prisma) => {
      return await prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
    
    // Convert Decimal amounts to numbers and null to undefined for response
    return transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
      description: transaction.description || undefined,
      reference: transaction.reference || undefined
    }));
  }

  /**
   * Gets a specific transaction by ID
   * @param id - Transaction ID
   * @param userId - ID of the user requesting the transaction
   * @returns Transaction details
   */
  async getTransactionById(id: string, userId: string): Promise<TransactionResponse> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        chama: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Verify the user is a member of the chama or created the transaction
    const isMember = transaction.chama.memberships.some(
      (membership) => membership.userId === userId,
    );
    const isCreator = transaction.userId === userId;

    if (!isMember && !isCreator) {
      throw new ForbiddenException(
        'You do not have permission to view this transaction',
      );
    }

    // Exclude nested data before returning and convert Decimal to number
    const { chama, ...transactionData } = transaction;
    return {
      ...transactionData,
      amount: Number(transactionData.amount),
      description: transactionData.description || undefined,
      reference: transactionData.reference || undefined
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
      where: { userId },
      include: {
        chama: true,
      },
    });

    const chamaIds = memberships.map((membership) => membership.chamaId);

    // Get all transactions for these chamas where the user is involved
    const transactions = await this.prisma.$transaction(async (prisma) => {
      return await prisma.transaction.findMany({
        where: {
          chamaId: { in: chamaIds },
          userId,
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

    transactions.forEach((transaction) => {
      // Update overall totals
      if (transaction.type === TransactionType.CONTRIBUTION) {
        totalContributions += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        totalWithdrawals += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.LOAN) {
        totalLoans += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.LOAN_REPAYMENT) {
        totalRepayments += transaction.amount.toNumber();
      }

      // Update chama-specific stats
      if (!chamaStatMap.has(transaction.chamaId)) {
        const chama = memberships.find(
          (m) => m.chamaId === transaction.chamaId,
        )?.chama;
        chamaStatMap.set(transaction.chamaId, {
          chamaId: transaction.chamaId,
          chamaName: chama?.name || 'Unknown Chama',
          contributions: 0,
          withdrawals: 0,
          loans: 0,
          repayments: 0,
        });
      }

      const chamaStat = chamaStatMap.get(transaction.chamaId);
      if (transaction.type === TransactionType.CONTRIBUTION) {
        chamaStat.contributions += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        chamaStat.withdrawals += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.LOAN) {
        chamaStat.loans += transaction.amount.toNumber();
      } else if (transaction.type === TransactionType.LOAN_REPAYMENT) {
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
