import { PrismaClient, transaction_direction, transaction_status, transaction_type } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function backfillExpenseTransactions() {
  console.log('Backfilling EXPENSE transactions from approved expenses...');

  const approvedExpenses = await prisma.expense.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      referenceCode: true,
      amount: true,
      chamaId: true,
      createdBy: true,
      approvedBy: true,
      approvedAt: true,
      createdAt: true,
    },
  });

  let createdCount = 0;
  for (const expense of approvedExpenses) {
    const existing = await prisma.transaction.findFirst({
      where: {
        type: transaction_type.EXPENSE,
        reference: expense.id,
      },
      select: { id: true },
    });

    if (existing) continue;

    const createdAt = expense.approvedAt ?? expense.createdAt;

    await prisma.transaction.create({
      data: {
        id: crypto.randomUUID(),
        type: transaction_type.EXPENSE,
        direction: transaction_direction.DEBIT,
        amount: expense.amount,
        chama_id: expense.chamaId,
        user_id: expense.createdBy,
        description: `Expense approved: ${expense.referenceCode}`,
        reference: expense.id,
        reference_type: 'expense',
        meta: {
          expenseId: expense.id,
          referenceCode: expense.referenceCode,
          approvedBy: expense.approvedBy ?? undefined,
        },
        status: transaction_status.COMPLETED,
        createdAt,
        updatedAt: new Date(),
      },
    });

    createdCount += 1;
  }

  console.log(`Backfill complete. Created ${createdCount} EXPENSE transactions.`);
}

backfillExpenseTransactions()
  .catch(error => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
