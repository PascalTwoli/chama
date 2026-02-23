-- CreateEnum
CREATE TYPE "join_request_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "join_request" (
    "id" TEXT NOT NULL,
    "chama_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "join_request_status" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "join_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "join_request_chama_id_status_idx" ON "join_request"("chama_id", "status");

-- CreateIndex
CREATE INDEX "join_request_user_id_status_idx" ON "join_request"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "join_request_chama_id_user_id_key" ON "join_request"("chama_id", "user_id");

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
