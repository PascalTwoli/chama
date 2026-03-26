# Quick Test Guide - Account Linking Fix Verification

## 🚀 Start Here

Let's verify the fix works end-to-end.

### Prerequisites

- Backend running on `http://localhost:5500`
- Frontend running on `http://localhost:3000`
- Database is clean (already done ✅)
- Fresh test email address (not one you've used before)

---

## ✅ Test 1: Email/Password Registration (5 min)

**Goal:** Verify basic email/password signup works

### Steps:

```
1. Open http://localhost:3000/signup
2. Fill in form:
   - First Name: Test
   - Last Name: User
   - Email: testuser_001@example.com
   - Phone: +1234567890
   - Password: TestPass123!
3. Click "Create Account"
4. You should be logged in ✅
```

### Expected Result:

```
✅ Account created
✅ Tokens saved
✅ Redirected to dashboard
```

---

## ✅ Test 2: Email/Password Login (5 min)

**Goal:** Verify password login works after logout

### Steps:

```
1. Click Logout
2. Navigate to http://localhost:3000/signin
3. Enter:
   - Email: testuser_001@example.com
   - Password: TestPass123!
4. Click Sign In
5. You should be logged in ✅
```

### Expected Result:

```
✅ Login successful
✅ No error messages
✅ Logged into dashboard
```

---

## ✅ Test 3: Check Provider Status (5 min)

**Goal:** Verify the `/check-providers` API endpoint works

### Using Curl:

```bash
curl -X POST http://localhost:5500/api/v1/auth/check-providers \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser_001@example.com"}'
```

### Expected Response:

```json
{
  "email": "testuser_001@example.com",
  "hasPassword": true,
  "hasGoogle": false,
  "hasOtherProviders": false,
  "availableProviders": ["password"],
  "message": "Email/password authentication is available."
}
```

✅ This confirms password is the only provider.

---

## ✅ Test 4: Google Account Linking (10 min)

**Goal:** Link Google account and test provider change

### Steps:

```
1. Logout from current account
2. Go to http://localhost:3000/signin
3. Click "Sign In with Google"
4. Complete Google OAuth flow (select your Google account)
5. Firebase should prompt: "Enter your password to link accounts"
6. Enter: TestPass123!
7. Facebook completes linking
8. Check success message mentions providers

Example message:
"Account linked successfully! You can now sign in with: password, google.com"
or
"Account linked successfully! You can now sign in with: google.com"
```

### Expected Result:

```
✅ Account linking successful
✅ You're signed in
✅ Message shows available providers
```

---

## ✅ Test 5: Check Provider Status After Linking (5 min)

**Goal:** Verify provider status changed after linking

### Using Same Curl Command:

```bash
curl -X POST http://localhost:5500/api/v1/auth/check-providers \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser_001@example.com"}'
```

### Expected Response (After Linking):

```json
{
  "email": "testuser_001@example.com",
  "hasPassword": false,
  "hasGoogle": true,
  "hasOtherProviders": false,
  "availableProviders": ["google.com"],
  "message": "This account is linked to Google. Use Google sign-in instead of password."
}
```

✅ Notice `hasPassword` is now `false` - Firebase disabled it!

---

## ✅ Test 6: Email/Password Login After Linking (5 min)

**Goal:** Verify helpful error message when password is unavailable

### Steps:

```
1. Make sure you're logged out
2. Go to http://localhost:3000/signin
3. Try to sign in with:
   - Email: testuser_001@example.com
   - Password: TestPass123!
4. Click Sign In
5. You should get an error message
```

### Expected Error Message:

```
"Your account is linked to: google.com. Please sign in using one of those methods instead."
```

✅ This is the NEW helpful error message we added!

---

## ✅ Test 7: Google Sign-In After Linking (5 min)

**Goal:** Verify Google sign-in still works after accounts linked

### Steps:

```
1. From sign-in page (if not already there)
2. Click "Sign In with Google"
3. Choose your Google account
4. Should complete login immediately (no password prompt)
5. You should be logged in ✅
```

### Expected Result:

```
✅ Google sign-in works
✅ No password prompt (already linked)
✅ Logged into dashboard
```

---

## ✅ Test 8: Firebase Console Verification (5 min)

**Goal:** Verify Firebase shows the provider change

### Steps:

```
1. Open Firebase Console
2. Navigate to Authentication > Users
3. Find user: testuser_001@example.com
4. Check "Sign-in providers" section
5. Should show only "Google" (not "Email/Password")
```

### Expected:

```
Sign-in providers:
✅ google.com
❌ Email/Password (not shown)
```

---

## 📊 Summary Table

| Test | Action                           | Expected Result                              |
| ---- | -------------------------------- | -------------------------------------------- |
| 1    | Create account with email        | ✅ Account created & logged in               |
| 2    | Logout & login with password     | ✅ Login works, no errors                    |
| 3    | Check providers (before linking) | ✅ `"hasPassword": true, "hasGoogle": false` |
| 4    | Link Google to account           | ✅ Accounts linked, message shown            |
| 5    | Check providers (after linking)  | ✅ `"hasPassword": false, "hasGoogle": true` |
| 6    | Try password login after linking | ✅ Helpful error message shown               |
| 7    | Login with Google                | ✅ Login works without password prompt       |
| 8    | Check Firebase Console           | ✅ Shows only Google provider                |

---

## 🎉 If All Tests Pass

✅ **The fix is working correctly!**

This means:

1. ✅ Email/password auth works initially
2. ✅ Provider status API works correctly
3. ✅ Google account linking works
4. ✅ Firebase provider change is detected
5. ✅ Helpful error messages are shown
6. ✅ Users can sign in with Google after linking

---

## ⚠️ If Any Test Fails

**Check the following:**

1. **Backend not running?**

   ```
   cd /Users/theboys/dev/chama
   npm start
   ```

2. **Firebase not initialized?**

   - Check `.env` has `FIREBASE_API_KEY`
   - Check Firebase config is correct

3. **Database issues?**

   - Check if database is running
   - Verify user can be created

4. **Frontend not running?**
   ```
   cd /Users/theboys/dev/chama/chama-frontend
   npm start
   ```

---

## 📝 Test Notes

- Use a unique email each time (e.g., testuser_001@, testuser_002@, etc.)
- Keep passwords simple for testing (TestPass123!)
- Check browser console for detailed error messages
- Check backend logs for provider diagnostics

---

## 🔗 Reference Files

- Backend fixes: `chama-core/src/auth/` & `chama-core/src/user/`
- Frontend fixes: `chama-frontend/src/services/auth/google-auth-service.ts`
- Documentation: `FIREBASE_ACCOUNT_LINKING_GUIDE.md`
- Solutions: `FIREBASE_LINKING_SOLUTIONS.md`
- Full summary: `ACCOUNT_LINKING_RESOLUTION.md`

---

Ready to test? Start with Test 1! 🚀
