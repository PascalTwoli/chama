-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
-- Step 1: Add the column as nullable
ALTER TABLE "user" ADD COLUMN "active_user_type" "UserType";

-- Step 2: Set default value for existing records
UPDATE "user" SET "active_user_type" = 'MEMBER';

-- Step 3: Make the column non-nullable
ALTER TABLE "user" ALTER COLUMN "active_user_type" SET NOT NULL;
