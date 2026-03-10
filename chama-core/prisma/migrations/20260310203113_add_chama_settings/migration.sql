-- CreateEnum
CREATE TYPE "ContributionModel" AS ENUM ('FIXED', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ContributionFrequency" AS ENUM ('MONTHLY', 'WEEKLY');

-- CreateTable
CREATE TABLE "chama_settings" (
    "id" TEXT NOT NULL,
    "chama_id" TEXT NOT NULL,
    "contribution_model" "ContributionModel" NOT NULL,
    "contribution_amount" INTEGER,
    "frequency" "ContributionFrequency",
    "due_day" INTEGER,
    "grace_period_days" INTEGER,
    "late_payment_fee" INTEGER,
    "minimum_contribution" INTEGER,
    "contribution_guidelines" TEXT,
    "require_meeting_attendance" BOOLEAN NOT NULL DEFAULT false,
    "enable_member_loans" BOOLEAN NOT NULL DEFAULT false,
    "automatic_sms_reminders" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chama_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chama_settings_chama_id_key" ON "chama_settings"("chama_id");

-- AddForeignKey
ALTER TABLE "chama_settings" ADD CONSTRAINT "chama_settings_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chama"("id") ON DELETE CASCADE ON UPDATE CASCADE;
