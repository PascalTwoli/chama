-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "expense" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "expense_status_idx" ON "expense"("status");

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
