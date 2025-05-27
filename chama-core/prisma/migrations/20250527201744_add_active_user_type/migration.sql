/*
  Warnings:

  - Added the required column `active_user_type` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIM', 'MEMBER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "active_user_type" "UserType" NOT NULL;
