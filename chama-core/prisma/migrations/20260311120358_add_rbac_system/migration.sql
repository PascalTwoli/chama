-- CreateEnum
CREATE TYPE "system_role" AS ENUM ('OWNER', 'ADMIN', 'NONE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "system_role" "system_role" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "chama_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "member_role" (
    "user_id" TEXT NOT NULL,
    "chama_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "member_role_pkey" PRIMARY KEY ("user_id","chama_id")
);

-- CreateIndex
CREATE INDEX "role_chama_id_idx" ON "role"("chama_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_chama_id_name_key" ON "role"("chama_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_key_key" ON "permission"("key");

-- CreateIndex
CREATE INDEX "member_role_chama_id_idx" ON "member_role"("chama_id");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_role" ADD CONSTRAINT "member_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_role" ADD CONSTRAINT "member_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
