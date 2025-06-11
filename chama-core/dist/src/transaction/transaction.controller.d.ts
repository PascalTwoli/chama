import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';
import { TransactionService } from './transaction.service';
interface TransactionResponse {
    id: string;
    type: TransactionType;
    amount: number;
    chamaId: string;
    userId: string;
    description?: string;
    reference?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    createTransaction(createTransactionDto: CreateTransactionDto, currentUser: CurrentUserType): Promise<TransactionResponse>;
    getTransactionsByChama(chamaId: string, type?: TransactionType, startDate?: string, endDate?: string, currentUser?: CurrentUserType): Promise<TransactionResponse[]>;
    getTransactionById(id: string, currentUser: CurrentUserType): Promise<TransactionResponse>;
    getUserTransactionSummary(currentUser: CurrentUserType): Promise<{
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
    }>;
}
export {};
