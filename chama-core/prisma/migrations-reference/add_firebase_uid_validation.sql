/**
 * Add Firebase UID validation to the User model
 * Ensures the database enforces that user IDs must be Firebase UIDs
 * 
 * To apply: npx prisma migrate dev --name add_firebase_uid_validation
 */

-- Migration: Add validation and constraints for Firebase UID consistency
-- This ensures all new users MUST use Firebase UID as their primary key

-- Step 1: Add a new unique constraint on email (can still be null for OAuth users)
-- (Already exists in schema, but good to have)

-- Step 2: Create a trigger to validate Firebase UID format on INSERT/UPDATE
CREATE OR REPLACE FUNCTION validate_firebase_uid()
RETURNS TRIGGER AS $$
BEGIN
  -- Firebase UIDs are typically 28 alphanumeric characters
  -- UUIDs are 36 chars with hyphens
  -- Reject if it looks like a random UUID (has hyphens and specific UUID pattern)
  IF NEW.id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' THEN
    RAISE EXCEPTION 'User ID must be a Firebase UID, not a random UUID. Received: %', NEW.id;
  END IF;
  
  -- Reject if ID is too short (UUID minimum is 28 chars typically)
  IF LENGTH(NEW.id) < 20 THEN
    RAISE EXCEPTION 'User ID format invalid. Must be Firebase UID (20+ chars). Received: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Deploy trigger on user table
DROP TRIGGER IF EXISTS check_firebase_uid_format ON "user";
CREATE TRIGGER check_firebase_uid_format
BEFORE INSERT OR UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION validate_firebase_uid();

-- Step 3: Report current database anomalies
-- This query shows any users with problematic IDs
SELECT 
  id, 
  email, 
  'INVALID' as status,
  'UUID instead of Firebase UID' as issue
FROM "user"
WHERE id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$'
UNION ALL
SELECT 
  id,
  email,
  'INVALID' as status,
  'ID too short to be Firebase UID' as issue
FROM "user"
WHERE LENGTH(id) < 20;
