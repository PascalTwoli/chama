-- Add rejection tracking to expense model
-- Allow tracking who rejected an expense and when

ALTER TABLE "expense" ADD COLUMN "rejectedBy" TEXT;
ALTER TABLE "expense" ADD COLUMN "rejectedAt" TIMESTAMP(3);

-- Add foreign key constraint for rejectedBy
ALTER TABLE "expense" ADD CONSTRAINT "expense_rejectedBy_fkey" FOREIGN KEY ("rejectedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
