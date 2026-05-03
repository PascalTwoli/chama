/**
 * Financial data backfill script.
 *
 * Run with:  npx ts-node -r tsconfig-paths/register prisma/backfill-finance.ts
 *
 * What it does:
 *  1. Fix old LOAN records: set direction = DEBIT (they defaulted to CREDIT)
 *  2. Fix old LOAN_REPAYMENT records: ensure direction = CREDIT
 *  3. Fix old CONTRIBUTION records: ensure direction = CREDIT
 *  4. Create EXPENSE transactions for approved expenses that have none (so stats show correct totals)
 */

import { PrismaClient, transaction_direction, transaction_type } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting financial data backfill...\n');

  // ─── 1. Fix old LOAN records direction ───────────────────────────────────────
  const loanFix = await prisma.transaction.updateMany({
    where: {
      type: transaction_type.LOAN,
      direction: transaction_direction.CREDIT, // wrong default
    },
    data: { direction: transaction_direction.DEBIT },
  });
  console.log(`[1] Fixed ${loanFix.count} LOAN records → direction = DEBIT`);

  // ─── 2. Fix old LOAN_REPAYMENT records direction ──────────────────────────────
  const repayFix = await prisma.transaction.updateMany({
    where: {
      type: transaction_type.LOAN_REPAYMENT,
      direction: transaction_direction.DEBIT, // wrong if defaulted incorrectly
    },
    data: { direction: transaction_direction.CREDIT },
  });
  console.log(`[2] Fixed ${repayFix.count} LOAN_REPAYMENT records → direction = CREDIT`);

  // ─── 3. Ensure CONTRIBUTION records have direction = CREDIT ──────────────────
  const contribFix = await prisma.transaction.updateMany({
    where: {
      type: transaction_type.CONTRIBUTION,
      direction: { not: transaction_direction.CREDIT },
    },
    data: { direction: transaction_direction.CREDIT },
  });
  console.log(`[3] Fixed ${contribFix.count} CONTRIBUTION records → direction = CREDIT`);

  // ─── 4. Create EXPENSE transactions for approved expenses without one ─────────
  const approvedExpenses = await prisma.expense.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      chamaId: true,
      createdBy: true,
      amount: true,
      referenceCode: true,
      approvedAt: true,
    },
  });

  console.log(`\n[4] Found ${approvedExpenses.length} approved expenses to check...`);

  let created = 0;
  let skipped = 0;

  for (const expense of approvedExpenses) {
    // Check if an EXPENSE transaction already exists for this expense
    const existing = await prisma.transaction.findFirst({
      where: {
        chama_id: expense.chamaId,
        type: transaction_type.EXPENSE,
        reference: expense.id,
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

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
        status: 'COMPLETED',
        meta: {
          expenseId: expense.id,
          referenceCode: expense.referenceCode,
          backfilled: true,
        },
        updatedAt: expense.approvedAt ?? new Date(),
        createdAt: expense.approvedAt ?? new Date(),
      },
    });
    created++;
  }

  console.log(`    Created ${created} EXPENSE transactions, skipped ${skipped} (already had one)`);

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n✓ Backfill complete.');
}

main()
  .catch(e => {
    console.error('Backfill failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
