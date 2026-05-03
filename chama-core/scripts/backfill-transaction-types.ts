import {
  PrismaClient,
  transaction_direction,
  transaction_type,
} from '@prisma/client';

const prisma = new PrismaClient();

async function backfillTransactionTypes() {
  console.log(
    'Backfilling transaction types, directions, and reference types...',
  );

  const updates: Array<{
    label: string;
    where: { type: transaction_type };
    data: Record<string, unknown>;
  }> = [
    {
      label: 'LOAN -> LOAN_DISBURSEMENT',
      where: { type: transaction_type.LOAN },
      data: {
        type: transaction_type.LOAN_DISBURSEMENT,
        direction: transaction_direction.DEBIT,
        reference_type: 'loan',
      },
    },
    {
      label: 'LOAN_REPAYMENT -> LOAN_REPAYMENT_PRINCIPAL',
      where: { type: transaction_type.LOAN_REPAYMENT },
      data: {
        type: transaction_type.LOAN_REPAYMENT_PRINCIPAL,
        direction: transaction_direction.CREDIT,
        reference_type: 'loan_repayment',
      },
    },
    {
      label: 'INVESTMENT -> INVESTMENT_OUT',
      where: { type: transaction_type.INVESTMENT },
      data: {
        type: transaction_type.INVESTMENT_OUT,
        direction: transaction_direction.DEBIT,
      },
    },
    {
      label: 'RETURN -> INVESTMENT_RETURN',
      where: { type: transaction_type.RETURN },
      data: {
        type: transaction_type.INVESTMENT_RETURN,
        direction: transaction_direction.CREDIT,
      },
    },
    {
      label: 'CONTRIBUTION direction',
      where: { type: transaction_type.CONTRIBUTION },
      data: { direction: transaction_direction.CREDIT },
    },
    {
      label: 'EXPENSE direction',
      where: { type: transaction_type.EXPENSE },
      data: {
        direction: transaction_direction.DEBIT,
        reference_type: 'expense',
      },
    },
    {
      label: 'WITHDRAWAL direction',
      where: { type: transaction_type.WITHDRAWAL },
      data: { direction: transaction_direction.DEBIT },
    },
    {
      label: 'ADJUSTMENT direction',
      where: { type: transaction_type.ADJUSTMENT },
      data: { direction: transaction_direction.CREDIT },
    },
    {
      label: 'FEE direction',
      where: { type: transaction_type.FEE },
      data: { direction: transaction_direction.DEBIT },
    },
    {
      label: 'REFUND direction',
      where: { type: transaction_type.REFUND },
      data: { direction: transaction_direction.CREDIT },
    },
  ];

  for (const update of updates) {
    const result = await prisma.transaction.updateMany({
      where: update.where,
      data: update.data,
    });

    console.log(`${update.label}: ${result.count} rows updated`);
  }

  console.log('Backfill complete.');
}

backfillTransactionTypes()
  .catch(error => {
    console.error('Backfill failed:', error);
  })
  .finally(() => prisma.$disconnect());
