# Firebase Account Linking - Complete Guide

## The Problem

When you link a Google account to an existing email/password account in Firebase, the password authentication **may become unavailable** due to Firebase's security policies for linked providers.

### What Happens:
1. ✅ You create account with email `test@example.com` + password
2. ✅ You can login with email/password 
3. ✅ You logout and try Google sign-in with the same email
4. ✅ Firebase detects existing account and asks you to link
5. ✅ You enter password, accounts link successfully
6. ❌ Now email/password login **stops working**
7. 📱 Firebase shows provider changed from "password" to "google"

## Why This Happens

Firebase's Security Behavior:
- When you link providers to same email, Firebase may disable less-secure password auth
- This enforces users to use OAuth (Google, GitHub, etc.) instead of passwords
- This is a Firebase security feature, not a bug

## Solutions

### ✅ Solution 1: Use the Correct Sign-In Method (Recommended)

After linking your Google account, **sign in with Google instead of email/password**.

**Steps:**
1. Go to Sign In page
2. Click "Sign In with Google"
3. Complete Google OAuth flow
4. You're logged in ✅

**Why:** Google OAuth is more secure than passwords. Once accounts are linked, Firebase encourages users to use OAuth.

### ✅ Solution 2: Check Disabled Providers via API

If you want to diagnose which providers are available:

**Endpoint:** `POST /api/v1/auth/check-providers`

**Request:**
```json
{
  "email": "test@example.com"
}
```

**Response:**
```json
{
  "email": "test@example.com",
  "hasPassword": false,
  "hasGoogle": true,
  "hasOtherProviders": false,
  "availableProviders": ["google.com"],
  "message": "This account is linked to Google. Use Google sign-in instead of password."
}
```

### ✅ Solution 3: Re-enable Password Provider (Development Only)

If you absolutely need password auth in development:

```bash
# 1. Check Firebase Console > Authentication > Users
# 2. Find your user
# 3. Click the user
# 4. In "Sign-in providers" section, look for "Email/Password"
# 5. If disabled, contact Firebase Support or re-create user

# Alternative: Disable provider linking
# Firebase Console > Authentication > Settings > User account linking
# Change from "Link accounts that use the same email"
# To "Create multiple accounts for each identity provider"
```

### ✅ Solution 4: Use Multi-Provider Support (Best Practice)

Update your login form to handle both methods:

**Frontend Update Needed:**
```tsx
// Login form should offer both options
<button onClick={() => signInWithGoogle()}>
  Sign In with Google
</button>

<button onClick={() => signInWithEmailPassword()}>
  Sign In with Email
</button>
```

**Backend handles both:**
- `POST /api/v1/auth/login` - Email/password (works if provider available)
- `POST /auth/me` - Google token (works via Bearer token)

## Technical Details

### How Firebase Account Linking Works:

1. **Before Linking:**
   ```
   User A: email=test@gmail.com, password=hash123, provider=password
   ```

2. **During Google OAuth:**
   ```
   Firebase detects email=test@gmail.com already exists
   Throws: auth/account-exists-with-different-credential
   ```

3. **After Linking (via linkWithCredential):**
   ```
   User A: email=test@gmail.com, providers=[password, google.com]
   Note: Password provider status may change based on Firebase security policies
   ```

## API Endpoints

### Check Account Providers
```
POST /api/v1/auth/check-providers
Body: { "email": "user@example.com" }

Response:
{
  "email": "user@example.com",
  "hasPassword": bool,
  "hasGoogle": bool,
  "hasOtherProviders": bool,
  "availableProviders": string[],
  "message": string
}
```

### Verify Google Token
```
POST /api/v1/auth/verify-google
Body: { "infoToken": "<firebase-id-token>" }

Response:
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "name": "User Name",
  "passwordAccountExists": bool,
  "accountLinkingNeeded": bool,
  "existingUid": "existing-uid-if-different",
  "message": string
}
```

## Testing Account Linking

### Test Scenario 1: Fresh Account
```
1. Register with email: clean-email@test.com + password
2. Logout
3. Try Google login with same email
4. Enter password when prompted (account linking prompt)
5. Verify login works
6. Try email/password login - check provider status
```

### Test Scenario 2: Existing Account
```
1. Logout from current account
2. Switch to different Google account
3. Try linking to existing password account
4. Verify providers shown in response
```

## Debugging

### Check Provider Status:
```bash
curl -X POST http://localhost:5500/api/v1/auth/check-providers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Monitor Backend Logs:
```
[AUTH] Email test@example.com has providers: google.com
[AUTH WARNING] User test@example.com has mismatched ID...
```

### Firebase Console:
1. Go to Authentication > Users
2. Click on specific user
3. Check "Sign-in providers" section
4. Note which providers are available/disabled

## Production Considerations

1. **User Communication:** Inform users that Google OAuth is the preferred method
2. **Disable Provider Linking:** If you want separate accounts per provider, update Firebase settings
3. **Email Requirements:** Don't auto-link accounts without user confirmation
4. **Support:** Have clear documentation on sign-in methods

## Reference

- [Firebase Account Linking Docs](https://firebase.google.com/docs/auth/web/account-linking)
- [Firebase Security Best Practices](https://firebase.google.com/docs/auth/best-practices)
- [Multi-Provider Support](https://firebase.google.com/docs/auth/web/manage-users)
