import { Injectable } from '@nestjs/common';
import {
  transaction_direction,
  transaction_status,
  transaction_type,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sumByTypes(
    chamaId: string,
    types: transaction_type[],
  ): Promise<number> {
    if (types.length === 0) return 0;
    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        type: { in: types },
        status: transaction_status.COMPLETED,
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  async sumByTypesInRange(
    chamaId: string,
    types: transaction_type[],
    start: Date,
    end: Date,
  ): Promise<number> {
    if (types.length === 0) return 0;
    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        type: { in: types },
        status: transaction_status.COMPLETED,
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  async sumByDirection(
    chamaId: string,
    direction: transaction_direction,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        direction,
        status: transaction_status.COMPLETED,
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  async sumByDirectionInRange(
    chamaId: string,
    direction: transaction_direction,
    start: Date,
    end: Date,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        chama_id: chamaId,
        direction,
        status: transaction_status.COMPLETED,
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  async findRecentTransactionsByType(
    chamaId: string,
    type: transaction_type,
    limit: number,
  ) {
    return this.prisma.transaction.findMany({
      where: {
        chama_id: chamaId,
        type,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: true },
    });
  }

  async findMembersWithContributionTransactions(chamaId: string) {
    return this.prisma.membership.findMany({
      where: { chama_id: chamaId },
      include: {
        user: {
          include: {
            transaction: {
              where: {
                chama_id: chamaId,
                type: transaction_type.CONTRIBUTION,
              },
            },
          },
        },
      },
    });
  }

  async getExpenseBreakdown(
    chamaId: string,
    expenseTypes: transaction_type[],
  ): Promise<
    Array<{ categoryId: string; categoryName: string; total: number }>
  > {
    if (expenseTypes.length === 0) return [];

    const transactions = await this.prisma.transaction.findMany({
      where: {
        chama_id: chamaId,
        type: { in: expenseTypes },
        status: transaction_status.COMPLETED,
        reference: { not: null },
      },
      select: { reference: true, amount: true },
    });

    const totalsByExpense = new Map<string, number>();
    transactions.forEach(tx => {
      if (!tx.reference) return;
      const current = totalsByExpense.get(tx.reference) ?? 0;
      totalsByExpense.set(tx.reference, current + tx.amount.toNumber());
    });

    const expenseIds = Array.from(totalsByExpense.keys());
    if (expenseIds.length === 0) return [];

    const expenses = await this.prisma.expense.findMany({
      where: { id: { in: expenseIds } },
      select: {
        id: true,
        category: { select: { id: true, name: true } },
      },
    });

    const totalsByCategory = new Map<string, { categoryId: string; categoryName: string; total: number }>();
    expenses.forEach(expense => {
      const amount = totalsByExpense.get(expense.id) ?? 0;
      if (amount <= 0) return;
      const existing = totalsByCategory.get(expense.category.id);
      if (existing) {
        existing.total += amount;
      } else {
        totalsByCategory.set(expense.category.id, {
          categoryId: expense.category.id,
          categoryName: expense.category.name,
          total: amount,
        });
      }
    });

    return Array.from(totalsByCategory.values()).sort(
      (a, b) => b.total - a.total,
    );
  }

  async getLargestExpense(
    chamaId: string,
    expenseTypes: transaction_type[],
  ): Promise<number> {
    if (expenseTypes.length === 0) return 0;

    const result = await this.prisma.transaction.findFirst({
      where: {
        chama_id: chamaId,
        type: { in: expenseTypes },
        status: transaction_status.COMPLETED,
      },
      orderBy: { amount: 'desc' },
      select: { amount: true },
    });

    return result?.amount?.toNumber() ?? 0;
  }
}
