import { Decimal } from 'decimal.js';
import { Entity } from './base.entity';
import { Contribution, ContributionStatus } from '../models';
export declare class ContributionEntity extends Entity<ContributionEntity> implements Contribution {
    chamaId: string;
    userId: string;
    amount: Decimal;
    currency: string;
    status: ContributionStatus;
    date: Date;
    constructor(partial: Partial<ContributionEntity>);
}
export declare class DecimalUtils {
    static toNumber(decimal: Decimal | number | string | null): number | null;
    static toDecimal(value: number | string | Decimal | null): Decimal | null;
    static formatCurrency(decimal: Decimal | number | string | null, currency?: string): string;
}
