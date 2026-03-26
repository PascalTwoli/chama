-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'OTHER';

-- CreateTable
CREATE TABLE "expense_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chama_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "chamaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "paidTo" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "referenceNumber" TEXT,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "attachmentUrl" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "expense_category_chama_id_idx" ON "expense_category"("chama_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_category_chama_id_name_key" ON "expense_category"("chama_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "expense_referenceCode_key" ON "expense"("referenceCode");

-- CreateIndex
CREATE INDEX "expense_chamaId_idx" ON "expense"("chamaId");

-- CreateIndex
CREATE INDEX "expense_categoryId_idx" ON "expense"("categoryId");

-- CreateIndex
CREATE INDEX "expense_createdBy_idx" ON "expense"("createdBy");

-- CreateIndex
CREATE INDEX "expense_expenseDate_idx" ON "expense"("expenseDate");

-- AddForeignKey
ALTER TABLE "expense_category" ADD CONSTRAINT "expense_category_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_chamaId_fkey" FOREIGN KEY ("chamaId") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
