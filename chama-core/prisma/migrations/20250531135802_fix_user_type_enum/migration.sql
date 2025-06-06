/*
  Warnings:

  - The `active_user_type` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "active_user_type",
ADD COLUMN     "active_user_type" "UserType";

-- DropEnum
DROP TYPE "user_type";
