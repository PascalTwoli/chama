-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED', 'ACTIVE', 'OVERDUE', 'COMPLETED', 'DEFAULTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "transaction_direction" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "transaction_type" ADD VALUE 'LOAN_DISBURSEMENT';
ALTER TYPE "transaction_type" ADD VALUE 'LOAN_REPAYMENT_PRINCIPAL';
ALTER TYPE "transaction_type" ADD VALUE 'LOAN_INTEREST';
ALTER TYPE "transaction_type" ADD VALUE 'INVESTMENT_OUT';
ALTER TYPE "transaction_type" ADD VALUE 'INVESTMENT_RETURN';
ALTER TYPE "transaction_type" ADD VALUE 'ADJUSTMENT';
ALTER TYPE "transaction_type" ADD VALUE 'FEE';
ALTER TYPE "transaction_type" ADD VALUE 'REFUND';

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "direction" "transaction_direction" NOT NULL DEFAULT 'CREDIT',
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "reference_type" TEXT;

-- CreateTable
CREATE TABLE "loan" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "chamaId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "requestedAmount" DECIMAL(10,2) NOT NULL,
    "approvedAmount" DECIMAL(10,2),
    "interestRate" DECIMAL(5,2),
    "durationMonths" INTEGER NOT NULL,
    "purpose" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "disbursedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "defaultedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "reviewedBy" TEXT,
    "disbursedBy" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "principalAmount" DECIMAL(10,2),
    "interestAmount" DECIMAL(10,2),
    "totalPayable" DECIMAL(10,2),
    "outstandingBalance" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_repayment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_repayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_referenceCode_key" ON "loan"("referenceCode");

-- CreateIndex
CREATE INDEX "loan_chamaId_idx" ON "loan"("chamaId");

-- CreateIndex
CREATE INDEX "loan_borrowerId_idx" ON "loan"("borrowerId");

-- CreateIndex
CREATE INDEX "loan_status_idx" ON "loan"("status");

-- CreateIndex
CREATE INDEX "loan_chamaId_status_idx" ON "loan"("chamaId", "status");

-- CreateIndex
CREATE INDEX "loan_dueDate_idx" ON "loan"("dueDate");

-- CreateIndex
CREATE INDEX "loan_repayment_loanId_idx" ON "loan_repayment"("loanId");

-- CreateIndex
CREATE INDEX "transaction_chama_id_type_idx" ON "transaction"("chama_id", "type");

-- CreateIndex
CREATE INDEX "transaction_chama_id_createdAt_idx" ON "transaction"("chama_id", "createdAt");

-- CreateIndex
CREATE INDEX "transaction_chama_id_status_idx" ON "transaction"("chama_id", "status");

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_chamaId_fkey" FOREIGN KEY ("chamaId") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_disbursedBy_fkey" FOREIGN KEY ("disbursedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_repayment" ADD CONSTRAINT "loan_repayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_repayment" ADD CONSTRAINT "loan_repayment_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
