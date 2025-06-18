/*
  Warnings:

  - The values [ADMIN] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_role_new" AS ENUM ('CHAIRPERSON', 'MEMBER', 'TREASURER', 'SECRETARY');
ALTER TABLE "membership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "user_role_new" USING ("role"::text::"user_role_new");
ALTER TABLE "chama" ALTER COLUMN "organization_role" TYPE "user_role_new" USING ("organization_role"::text::"user_role_new");
ALTER TABLE "membership" ALTER COLUMN "role" TYPE "user_role_new" USING ("role"::text::"user_role_new");
ALTER TYPE "user_role" RENAME TO "user_role_old";
ALTER TYPE "user_role_new" RENAME TO "user_role";
DROP TYPE "user_role_old";
ALTER TABLE "membership" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;
