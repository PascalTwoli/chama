# Google Sign-In Fix & Database Cleanup Guide

## Overview
The Google sign-in bug was caused by the `CurrentUser` decorator creating users with random UUIDs instead of Firebase UIDs. This guide explains:
1. What was fixed
2. How to clean up existing data
3. How we prevent this from happening again

---

## ✅ What Was Fixed

### Code Changes
1. **[current-user.decorator.ts](src/decorators/current-user.decorator.ts)**
   - Now searches by Firebase UID first (primary key)
   - Falls back to email for backward compatibility
   - Creates new users with Firebase UID (not random UUID)
   - Validates Firebase UID format to catch malformed tokens

2. **New Validation Utility: [firebase-uid.validator.ts](src/utils/firebase-uid.validator.ts)**
   - `validateFirebaseUid()` - Throws error if invalid
   - `isValidFirebaseUid()` - Returns boolean
   - `isRandomUuid()` - Detects the bug pattern
   - Prevents creation of invalid user records

3. **Database Trigger** (see: `prisma/migrations-reference/add_firebase_uid_validation.sql`)
   - Enforces Firebase UID format at database level
   - Rejects attempts to insert random UUIDs
   - Double-checks what code validation does

---

## 🧹 Database Cleanup (Dev Only)

Since you're in development and willing to reset data, here are your options:

### Option 1: Automatic Cleanup (Recommended)
```bash
cd chama-core

# First: Check what will be deleted (non-destructive)
npx ts-node scripts/fix-user-id-consistency.ts --check

# Then: Delete problematic users (destructive)
npx ts-node scripts/fix-user-id-consistency.ts --clean
```

The script will:
- Identify users with random UUID IDs (the bug pattern)
- Delete them and all their related data
- Leave valid users (Firebase UID) untouched

### Option 2: Full Database Reset (Nuclear)
If you want a completely fresh start:

```bash
# Drop and recreate database
npm run db:reset

# Restart backend
npm start
```

This will:
- Delete all data
- Run all migrations
- Create fresh schema with new validations

### Option 3: Manual SQL Cleanup
If you want to see what's wrong first:

```bash
# Check for problematic users (random UUIDs)
psql -U theboys -h localhost -d chama_db -c "
  SELECT id, email, name 
  FROM \"user\" 
  WHERE id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$'
  ORDER BY id;
"

# Delete specific users (cascade deletes related records)
psql -U theboys -h localhost -d chama_db -c "
  DELETE FROM \"user\" 
  WHERE id = 'YOUR-UUID-HERE';
"
```

---

## 🛡️ Prevention Going Forward

### Multi-Layer Protection

**Layer 1: Code Validation** (src/utils/firebase-uid.validator.ts)
```typescript
// In CurrentUser decorator
validateFirebaseUid(decodedToken.uid); // Throws if invalid
```

**Layer 2: Database Trigger** (enforced at INSERT/UPDATE)
```sql
-- Rejects any UUIDs with hyphens
IF NEW.id ~ '^[a-f0-9]{8}-[a-f0-9]{4}...' THEN
  RAISE EXCEPTION 'Must be Firebase UID, not UUID';
END IF;
```

**Layer 3: User Service Validation** (optional - add to registerUser)
```typescript
// In user.service.ts registerUser() method
validateFirebaseUid(userRecord.uid);
```

### Verification Checklist

After cleanup, verify the fix works:

```bash
# 1. Start backend
npm start

# 2. Test Google sign-in
# - Go to signup page
# - Click "Sign in with Google"
# - Verify it creates a user successfully

# 3. Check database consistency
psql -U theboys -h localhost -d chama_db -c "
  SELECT id, email FROM \"user\" LIMIT 5;
" | grep -v "^[a-f0-9]*-[a-f0-9]*-"
# Should only show Firebase UIDs (no hyphens in long strings)
```

---

## 📋 Development Workflow Going Forward

### When Adding New User Creation Paths
Always use:
```typescript
// ✅ CORRECT
const user = await prisma.user.create({
  data: {
    id: firebaseUserRecord.uid,  // Firebase UID
    email: firebaseUserRecord.email,
    name: firebaseUserRecord.displayName,
  }
});

// ❌ WRONG (will fail now)
const user = await prisma.user.create({
  data: {
    id: crypto.randomUUID(),  // Random UUID - will be rejected!
    email: email,
    name: name,
  }
});
```

### Testing New Auth Features
```bash
# Run consistency check before committing
npm run auth:consistency-check

# Watch for warnings in logs
# Should NOT see: "mismatched ID" or "RANDOM UUID"
```

---

## 📊 Architecture After Fix

```
Google Sign-In Flow:
┌─────────────────────────────────────────────────────────┐
│ 1. Frontend: GoogleAuthService.signInWithGoogle()      │
│    → Creates Firebase user with UID (e.g., "abc123...") │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ 2. Frontend: Call /auth/me with idToken                │
│    → Sets Authorization: Bearer <idToken>               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ 3. Backend: AuthGuard                                   │
│    → Verifies token signature                            │
│    → Extracts Firebase UID ("abc123...")                │
│    → Stores in request.decodedToken                     │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ 4. Backend: CurrentUser Decorator                       │
│    → validateFirebaseUid("abc123...")  ✓ Valid          │
│    → Find user by id = "abc123..."                      │
│    → If not found: Create with id = "abc123..."        │
│    → Return user data                                   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ 5. Backend: /auth/me Endpoint                           │
│    → Calls userService.findOne("abc123...")            │
│    → Finds user (was just created/found!) ✓            │
│    → Returns user profile                              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ 6. Frontend: AuthContext.refreshAuth()                  │
│    → Parses user data                                   │
│    → Sets isAuthenticated = true                        │
│    → Redirects to dashboard ✅ SUCCESS!                │
└─────────────────────────────────────────────────────────┘
```

All user IDs are now consistent Firebase UIDs throughout!

---

## 🔗 Related Files

- `src/decorators/current-user.decorator.ts` - Main fix
- `src/utils/firebase-uid.validator.ts` - New validation utility
- `src/user/user.service.ts` - Uses Firebase UID consistently
- `scripts/fix-user-id-consistency.ts` - Database cleanup script
- `prisma/migrations-reference/add_firebase_uid_validation.sql` - Database protection
- `chama-frontend/src/services/auth/google-auth-service.ts` - Frontend side
- `chama-frontend/src/context/AuthContext.tsx` - Auth state management

---

## ❓ FAQ

**Q: Will this break existing users?**
A: No. The fix maintains backward compatibility - it will still find and authenticate users with non-standard IDs. They'll just get a warning log.

**Q: What about email+password sign-in?**
A: Email+password uses the same code path now. It's also fixed and will create users with Firebase UID.

**Q: Can I test this without cleaning the database?**
A: Yes, it's backward compatible. But it's better to clean in dev to keep things consistent.

**Q: What if the cleanup script deletes important data?**
A: It only deletes users with the bug pattern (random UUIDs). Real user data should have been created with the earlier code that used Firebase UIDs correctly.

---

## 📝 Summary

✅ Code fix: CurrentUser decorator uses Firebase UID consistently
✅ Validation: New utility prevents bad IDs from being created  
✅ Database protection: Trigger rejects invalid formats
✅ Backward compatible: Old accounts still work (get warning)
✅ Cleanup script: Automatically removes buggy records
✅ Prevention: Multiple layers ensure this doesn't happen again
