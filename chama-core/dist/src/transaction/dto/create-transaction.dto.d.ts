import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    type: TransactionType;
    amount: number;
    chamaId: string;
    description?: string;
    reference?: string;
}
