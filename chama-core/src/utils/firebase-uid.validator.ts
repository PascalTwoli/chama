/**
 * Firebase UID Validation Utilities
 * Prevents users from being created with random UUIDs instead of Firebase UIDs
 * 
 * Usage:
 *   validateFirebaseUid(user.id) // throws error if invalid
 *   isValidFirebaseUid(user.id) // returns boolean
 */

/**
 * Firebase UID patterns:
 * - Typically 28 alphanumeric characters
 * - No hyphens (unlike UUIDs)
 * - No special characters
 * 
 * Random UUID patterns (to REJECT):
 * - 36 characters with hyphens
 * - Format: 8-4-4-4-12
 */

const RANDOM_UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const MIN_FIREBASE_UID_LENGTH = 20;
const MAX_FIREBASE_UID_LENGTH = 40;

/**
 * Validates that an ID is a Firebase UID, not a random UUID
 * Throws an error if validation fails
 */
export function validateFirebaseUid(id: string | undefined | null): void {
  if (!id) {
    throw new Error('User ID is required');
  }

  // Reject random UUIDs
  if (RANDOM_UUID_REGEX.test(id)) {
    throw new Error(
      `Invalid user ID format. Expected Firebase UID but received UUID format. ` +
      `Firebase UIDs should not contain hyphens. Received: ${id}`,
    );
  }

  // Firebase UIDs should be a reasonable length
  if (id.length < MIN_FIREBASE_UID_LENGTH || id.length > MAX_FIREBASE_UID_LENGTH) {
    throw new Error(
      `Invalid user ID length. Firebase UIDs should be ${MIN_FIREBASE_UID_LENGTH}-${MAX_FIREBASE_UID_LENGTH} characters. ` +
      `Received: ${id} (${id.length} chars)`,
    );
  }
}

/**
 * Non-throwing version - returns true if ID is valid Firebase UID
 */
export function isValidFirebaseUid(id: string | undefined | null): boolean {
  if (!id) return false;
  if (RANDOM_UUID_REGEX.test(id)) return false;
  if (id.length < MIN_FIREBASE_UID_LENGTH || id.length > MAX_FIREBASE_UID_LENGTH) return false;
  return true;
}

/**
 * Detects if an ID is a random UUID (the bug we're fixing)
 */
export function isRandomUuid(id: string | undefined | null): boolean {
  if (!id) return false;
  return RANDOM_UUID_REGEX.test(id);
}

/**
 * Logs a warning if an ID looks suspicious
 * Useful for debugging ID mismatches
 */
export function logIdWarning(context: string, id: string, expected: string): void {
  if (!isValidFirebaseUid(id)) {
    console.warn(
      `[${context}] Suspicious user ID format detected:\n` +
      `  Type: ${isRandomUuid(id) ? 'RANDOM UUID (BUG!)' : 'UNKNOWN'}\n` +
      `  Expected: ${expected}\n` +
      `  Actual: ${id}`,
    );
  }
}
