/*
  Warnings:

  - A unique constraint covering the columns `[user_id,chama_id]` on the table `membership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "membership_user_id_chama_id_key" ON "membership"("user_id", "chama_id");
