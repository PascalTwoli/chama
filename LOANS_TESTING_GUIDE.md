# 🧪 Loans Feature - Quick Testing Guide

## **How to Verify the Implementation Works**

---

## **1️⃣ START THE DEVELOPMENT SERVER**

### Backend (NestJS)

```bash
cd /Users/theboys/dev/chama/chama-core
npm run start:dev
```

Expected: Server running on http://localhost:3000

### Frontend (React)

```bash
cd /Users/theboys/dev/chama/chama-frontend
npm start
```

Expected: App opens at http://localhost:3000

---

## **2️⃣ NAVIGATE TO LOANS PAGE**

```
URL: http://localhost:3000/admin/chamas/{chamaId}/loans
```

Where `{chamaId}` is a valid chama ID from your database.

---

## **3️⃣ VERIFY INITIAL LOAD**

### ✅ Stats Cards Should Appear

Look for 6 cards with:

- **Total Disbursed** - Sum of all disbursed amounts
- **Active Loans** - Count of loans in ACTIVE status
- **Outstanding Balance** - Total amount still owed
- **Overdue Loans** - Count of OVERDUE loans
- **Interest Earned** - Sum of interest received
- **Defaulted** - Count of DEFAULTED loans

**Issue?** If cards show "Loading", wait 2 seconds. If they don't appear:

- Check browser console for errors
- Verify backend `/loans/stats?chamaId={id}` endpoint returns data

### ✅ Data Table Should Populate

Look for columns:

- Borrower (with avatar)
- Reference Code
- Principal Amount
- Interest Rate
- Balance
- Due Date
- Status (badge)
- Actions (buttons)

**Issue?** If table shows "No loans found":

- Verify there are loans in the database for this chama
- Check API response: Network tab → GET `/loans?chamaId={id}`

---

## **4️⃣ TEST FILTERS & SEARCH**

### Search by Borrower Name

```
1. Type member name in search box
2. Table updates in real-time (with 400ms delay)
3. Verify only matching loans appear
```

### Status Filter Tabs

Click each tab:

- **All** - Shows all loans
- **Requested** - Shows REQUESTED loans only
- **Approved** - Shows APPROVED loans only
- **Active** - Shows ACTIVE loans only
- **Overdue** - Shows OVERDUE loans only
- **Completed** - Shows COMPLETED/REPAID loans only
- **Defaulted** - Shows DEFAULTED loans only

**Success:** Table updates immediately with filtered results

---

## **5️⃣ TEST EACH ACTION**

### 🔵 APPROVE LOAN (Status: REQUESTED or UNDER_REVIEW)

```
1. Find a loan with "Approve" button visible
2. Click "Approve" button
3. Modal opens with:
   - Loan details (borrower, amount)
   - Form fields:
     ✓ Approved Amount (pre-filled)
     ✓ Interest Rate % (optional)
     ✓ Duration Months (optional)
     ✓ Notes (optional)
4. Fill in amount and interest
5. Click "Approve Loan" button
6. Wait for response...
```

**Success:**

- ✅ Green toast: "Loan approved successfully"
- ✅ Modal closes
- ✅ Table refreshes
- ✅ Loan status changes to APPROVED

**Issue?**

- Check Network tab → PATCH `/loans/{id}/approve`
- Verify error message in red toast

---

### 🔴 REJECT LOAN (Status: REQUESTED or UNDER_REVIEW)

```
1. Find a loan with "Reject" button
2. Click "Reject" button
3. Modal opens with:
   - Loan details
   - Reason field (optional)
4. Enter reason (optional)
5. Click "Reject Loan" button
```

**Success:**

- ✅ Green toast: "Loan rejected successfully"
- ✅ Loan status changes to REJECTED
- ✅ Status badge turns red

---

### 💰 DISBURSE LOAN (Status: APPROVED)

```
1. Find a loan with "Disburse" button
2. Click "Disburse" button
3. Modal opens with:
   - Amount to disburse
   - Disbursement Date (defaults to today)
   - Notes field
4. Keep or change date
5. Click "Disburse Loan" button
```

**Success:**

- ✅ Green toast: "Loan disbursed successfully"
- ✅ Loan status changes to DISBURSED
- ✅ Modal closes
- ✅ Stats cards update (Active Loans count increases)

---

### 📝 RECORD REPAYMENT (Status: DISBURSED, ACTIVE, OVERDUE)

```
1. Find loan with "Record Repayment" button
2. Click button
3. Modal opens with:
   - Outstanding Balance (informational)
   - Amount field (required)
   - Payment Date (defaults to today)
   - Payment Method (select):
     • M-Pesa
     • Bank Transfer
     • Cash
     • Other
   - Reference field (e.g., transaction ID)
   - Notes (optional)
4. Enter amount
5. Select payment method
6. Enter reference
7. Click "Record Payment" button
```

**Success:**

- ✅ Green toast: "Repayment recorded successfully"
- ✅ Balance updates in table
- ✅ Repayment appears in "View Details" modal

---

### ⚠️ MARK DEFAULT (Status: ACTIVE, OVERDUE)

```
1. Find loan with "Mark Defaulted" button
2. Click button
3. Modal shows warning:
   - "Marking as defaulted indicates the loan holder has failed to repay"
   - Notes field (optional)
4. Enter notes (optional)
5. Click "Mark Defaulted" button
```

**Success:**

- ✅ Red toast appears
- ✅ Status changes to DEFAULTED
- ✅ Status badge turns red
- ✅ Defaulted loans count in stats increases

---

### 👁️ VIEW DETAILS (Any Status)

```
1. Click "View" button on any loan
2. Modal opens with:
   - Borrower card (name, email, phone)
   - Status & duration info
   - Amount grid:
     • Principal
     • Interest Rate
     • Total Amount
     • Disbursed Amount
     • Repaid Amount
     • Outstanding Balance
   - Purpose (if provided)
   - Notes (if provided)
   - Timeline events:
     • Requested on [date]
     • Approved on [date]
     • Disbursed on [date]
     • Defaulted on [date] (if applicable)
   - Repayment history table:
     • Date
     • Amount
     • Method
     • Reference
     • Notes
3. Scroll to view all information
4. Click X to close
```

**Success:** All loan information displays correctly

---

## **6️⃣ TEST PAGINATION**

```
If chama has >20 loans:
1. Verify "Page 1 of X" shows at bottom
2. Click "Next" button
3. Table loads next page of loans
4. Click "Previous" button
5. Returns to first page
```

---

## **7️⃣ TEST ERROR SCENARIOS**

### No Network / API Down

```
1. Disconnect internet or stop backend
2. Try to load loans page
3. Expected: Red toast with "Failed to load loans"
4. Reconnect and refresh → should work
```

### Insufficient Permissions

```
1. Try to approve loan without permission
2. Expected: Red toast with permission error
3. Check that button is disabled
```

### Invalid Data

```
1. Try to record repayment with amount > balance
2. Expected: Error message or validation
```

---

## **8️⃣ VERIFY DATA IN NETWORK TAB**

Press F12 → Network tab → Filter by "XHR"

### Expected API Calls:

1. **Page Load**

   ```
   GET /loans/stats?chamaId=... → 200 ✓
   GET /loans?chamaId=... → 200 ✓
   ```

2. **Approve Loan**

   ```
   PATCH /loans/{id}/approve → 200 ✓
   GET /loans/stats?chamaId=... → 200 ✓
   GET /loans?chamaId=... → 200 ✓
   ```

3. **Record Repayment**
   ```
   POST /loans/{id}/repayments → 200 ✓
   GET /loans/stats?chamaId=... → 200 ✓
   GET /loans?chamaId=... → 200 ✓
   ```

---

## **9️⃣ CHECK CONSOLE FOR ERRORS**

Press F12 → Console tab

### ✅ Good Signs

- No red errors
- No warnings about missing imports
- Component renders successfully

### ❌ Issues to Fix

- `Cannot find module...` → Import path error
- `undefined is not a function` → Missing prop
- `Uncaught SyntaxError` → Syntax error in component

---

## **🔟 COMMON ISSUES & SOLUTIONS**

### "Failed to load loans"

```
Problem: API request failing
Solution:
1. Verify backend is running (port 3000)
2. Check network tab for error response
3. Verify chamaId in URL is valid
4. Check backend logs for errors
```

### "Loan status doesn't match buttons"

```
Problem: Wrong action buttons showing
Solution:
1. Refresh page (Ctrl+Shift+R)
2. Check backend loan status value
3. Verify status matches enum: REQUESTED, APPROVED, DISBURSED, ACTIVE, etc.
```

### "Form won't submit"

```
Problem: Button stays disabled/spinning
Solution:
1. Check Network tab for stuck request
2. Look at browser console for errors
3. Verify required fields are filled
4. Refresh page
```

### "Numbers not formatting correctly"

```
Problem: Shows raw numbers like 50000 instead of KSh 50,000
Solution:
1. Check formatCurrency function in loans-utils.ts
2. Verify Intl.NumberFormat is available
3. Refresh cache (Ctrl+Shift+Delete)
```

---

## **✨ SUCCESS CHECKLIST**

After testing, verify:

- [ ] Stats cards load with real data
- [ ] Table shows loans from API
- [ ] Search filters work (400ms debounce)
- [ ] Status filters work
- [ ] Pagination works (if >20 loans)
- [ ] Approve action works end-to-end
- [ ] Reject action works
- [ ] Disburse action works
- [ ] Record repayment works
- [ ] Mark defaulted works
- [ ] View details modal opens
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Error messages appear
- [ ] Numbers format correctly (KSh)
- [ ] Dates format correctly
- [ ] Status badges have correct colors
- [ ] Dark mode works (toggle theme)
- [ ] Responsive on mobile (F12 → Toggle device toolbar)
- [ ] No console errors

---

## **🎯 QUICK TEST SCRIPT**

Run this sequence to verify everything in 5 minutes:

```
1. Open loans page
2. Wait for stats to load (2 sec)
3. Verify 6 stat cards appear
4. Type name in search → table filters
5. Click status filter → table updates
6. Click "Approve" on a loan → modal opens
7. Fill form → click Approve → toast appears
8. Verify loan status changed
9. Click "View" → details modal opens
10. Close modal
✅ Everything working!
```

---

**Ready to test? Let's go! 🚀**
