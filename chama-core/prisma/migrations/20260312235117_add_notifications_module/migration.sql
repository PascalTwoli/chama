/*
  Warnings:

  - You are about to drop the column `sent_at` on the `notification` table. All the data in the column will be lost.
  - The primary key for the `notification_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `default_delivery` on the `notification_type` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `notification_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `notification_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audience` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chama_id` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `notification_type` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationAudience" AS ENUM ('MEMBER', 'ADMIN', 'BOTH');

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_type_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropIndex
DROP INDEX "notification_type_name_key";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "sent_at",
ADD COLUMN     "action_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "audience" "NotificationAudience" NOT NULL,
ADD COLUMN     "chama_id" TEXT NOT NULL,
ADD COLUMN     "entity_id" TEXT,
ADD COLUMN     "entity_type" TEXT,
ALTER COLUMN "type_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "notification_type" DROP CONSTRAINT "notification_type_pkey",
DROP COLUMN "default_delivery",
DROP COLUMN "name",
ADD COLUMN     "action_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "default_audience" "NotificationAudience" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "key" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notification_type_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notification_type_id_seq";

-- CreateIndex
CREATE INDEX "notification_user_id_chama_id_idx" ON "notification"("user_id", "chama_id");

-- CreateIndex
CREATE INDEX "notification_read_at_idx" ON "notification"("read_at");

-- CreateIndex
CREATE INDEX "notification_user_id_chama_id_read_at_idx" ON "notification"("user_id", "chama_id", "read_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_key_key" ON "notification_type"("key");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "notification_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
