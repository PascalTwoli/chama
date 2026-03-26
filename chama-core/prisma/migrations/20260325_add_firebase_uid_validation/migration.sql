-- CreateTrigger: Validate Firebase UID format
-- Ensures all users have Firebase UIDs, not random UUIDs
-- This prevents the bug where CurrentUser decorator was creating users with crypto.randomUUID()

-- Step 1: Create validation function
-- Rejects any ID that looks like a random UUID (has hyphens in UUID pattern)
-- Also rejects IDs that are too short to be Firebase UIDs
CREATE OR REPLACE FUNCTION validate_firebase_uid()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if ID matches random UUID pattern (8-4-4-4-12 with hyphens)
  IF NEW.id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' THEN
    RAISE EXCEPTION 'Invalid user ID: Detected random UUID format. User IDs must be Firebase UIDs. This usually indicates a bug in user creation code. Received ID: %', NEW.id;
  END IF;
  
  -- Firebase UIDs are typically 20-35 characters
  IF LENGTH(NEW.id) < 20 OR LENGTH(NEW.id) > 40 THEN
    RAISE EXCEPTION 'Invalid user ID: ID length must be 20-40 characters for Firebase UID. Received ID length: %', LENGTH(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create trigger on user table for INSERT and UPDATE
DROP TRIGGER IF EXISTS check_firebase_uid_format ON "user" CASCADE;

CREATE TRIGGER check_firebase_uid_format
BEFORE INSERT OR UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION validate_firebase_uid();

-- Step 3: Create helper function to identify problematic users (for analysis)
CREATE OR REPLACE FUNCTION find_problematic_user_ids()
RETURNS TABLE (
  user_id TEXT,
  email TEXT,
  issue_type TEXT,
  issue_description TEXT
) AS $$
BEGIN
  -- Find users with UUID format IDs
  RETURN QUERY
  SELECT 
    id,
    COALESCE("email", 'N/A'),
    'INVALID_FORMAT',
    'User has random UUID instead of Firebase UID'
  FROM "user"
  WHERE id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$';
  
  -- Find users with ID length issues
  RETURN QUERY
  SELECT 
    id,
    COALESCE("email", 'N/A'),
    'INVALID_LENGTH',
    concat('User ID length is ', LENGTH(id)::TEXT, ' characters (expected 20-40)')
  FROM "user"
  WHERE LENGTH(id) < 20 OR LENGTH(id) > 40;
END;
$$ LANGUAGE plpgsql;
