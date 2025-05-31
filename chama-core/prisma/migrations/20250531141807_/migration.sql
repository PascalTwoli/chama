/*
  Warnings:

  - Made the column `active_user_type` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "active_user_type" SET NOT NULL,
ALTER COLUMN "active_user_type" SET DEFAULT 'MEMBER';
