import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType, TransactionStatus } from '@prisma/client';
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
export declare class TransactionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTransaction(createTransactionDto: CreateTransactionDto, userId: string): Promise<TransactionResponse>;
    getTransactionsByChama(chamaId: string, userId: string, type?: TransactionType, startDate?: string, endDate?: string): Promise<TransactionResponse[]>;
    getTransactionById(id: string, userId: string): Promise<TransactionResponse>;
    getUserTransactionSummary(userId: string): Promise<{
        totalContributions: number;
        totalWithdrawals: number;
        totalLoans: number;
        totalRepayments: number;
        chamaStats: any[];
    }>;
}
