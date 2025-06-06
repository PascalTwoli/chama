-- First convert the enum column to text to preserve values
ALTER TABLE "user" ALTER COLUMN "active_user_type" TYPE TEXT;

-- Drop the existing enum type if it exists
DROP TYPE IF EXISTS "UserType";

-- Create the new properly mapped enum
CREATE TYPE "user_type" AS ENUM ('ADMIN', 'MEMBER');

-- Convert the text column back to the new enum type
ALTER TABLE "user" ALTER COLUMN "active_user_type" TYPE "user_type" USING "active_user_type"::"user_type";

