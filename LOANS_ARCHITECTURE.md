# 🏗️ Loans Feature Architecture

## **System Design Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  LoansPage.tsx (Main Orchestrator)                     │   │
│  │  ├─ State Management (stats, loans, filters, modals)  │   │
│  │  ├─ Data Fetching (useEffect hooks)                   │   │
│  │  ├─ Event Handling (approve, reject, disburse...)     │   │
│  │  └─ UI Composition (components + modals)              │   │
│  └────────────────────────────────────────────────────────┘   │
│         │                        │                    │        │
│         ▼                        ▼                    ▼        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │LoanStatsCards│    │ LoansTable   │    │Modal Group   │    │
│  │              │    │              │    │              │    │
│  │ • 6 KPI cards│    │• Borrower    │    │• Approve     │    │
│  │ • Real data  │    │• Reference   │    │• Reject      │    │
│  │ • Skeletons  │    │• Principal   │    │• Disburse    │    │
│  │              │    │• Balance     │    │• Repayment   │    │
│  │              │    │• Status      │    │• Default     │    │
│  │              │    │• Actions     │    │• Details     │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│         │                        │                    │        │
│         └────────────┬───────────┴────────────┬───────┘        │
│                      ▼                        ▼                │
│        ┌──────────────────────────────────────────┐            │
│        │   LoansService (API Layer)               │            │
│        │                                           │            │
│        │ Methods:                                 │            │
│        │  • getStats(chamaId)                     │            │
│        │  • getLoans(chamaId, filters)            │            │
│        │  • getLoanById(id)                       │            │
│        │  • approveLoan(id, ...)                  │            │
│        │  • rejectLoan(id, ...)                   │            │
│        │  • disburseLoan(id, ...)                 │            │
│        │  • recordRepayment(id, ...)              │            │
│        │  • markDefaulted(id, ...)                │            │
│        └──────────────────────────────────────────┘            │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          │ axios (secure interceptor)
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                      NESTJS BACKEND                            │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Loans Controller & Service                            │  │
│  │                                                         │  │
│  │  Endpoints:                                            │  │
│  │  GET    /loans/stats                                  │  │
│  │  GET    /loans?filters                                │  │
│  │  GET    /loans/:id                                    │  │
│  │  PATCH  /loans/:id/approve                            │  │
│  │  PATCH  /loans/:id/reject                             │  │
│  │  PATCH  /loans/:id/disburse                           │  │
│  │  POST   /loans/:id/repayments                         │  │
│  │  PATCH  /loans/:id/default                            │  │
│  └────────────────────────────────────────────────────────┘  │
│         │                                                      │
│         ▼                                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                            │  │
│  └────────────────────────────────────────────────────────┘  │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
      PostgreSQL Database
```

---

## **File Structure**

```
chama-frontend/
└── src/
    ├── pages/
    │   └── LoansPage.tsx                    # Main page component
    │
    ├── components/
    │   └── loans/
    │       ├── LoanStatsCards.tsx           # Stats display (6 cards)
    │       ├── LoansTable.tsx               # Data table with actions
    │       ├── LoanDetailsModal.tsx         # Full loan details view
    │       ├── ApproveLoanModal.tsx         # Approve action
    │       ├── RejectLoanModal.tsx          # Reject action
    │       ├── DisburseLoanModal.tsx        # Disburse action
    │       ├── RepaymentModal.tsx           # Record repayment
    │       └── DefaultLoanModal.tsx         # Mark as defaulted
    │
    ├── services/
    │   └── loans/
    │       └── loans-service.ts             # API communication layer
    │
    ├── models/
    │   └── loans.ts                         # TypeScript type definitions
    │
    └── utils/
        └── loans-utils.ts                   # Formatting & utility functions
```

---

## **Data Models**

### **LoanStatus Enum**

```typescript
REQUESTED; // Initial request
UNDER_REVIEW; // Being reviewed
APPROVED; // Approved but not disbursed
DISBURSED; // Money disbursed
ACTIVE; // Currently in repayment
OVERDUE; // Past due
REPAID; // Fully repaid
COMPLETED; // Loan completed
DEFAULTED; // Payment default
REJECTED; // Request rejected
CANCELLED; // Loan cancelled
```

### **Loan Entity**

```typescript
{
  id: string
  chamaId: string
  borrowerId: string
  principalAmount: number
  interestRate: number
  totalAmount: number
  disbursedAmount: number
  repaidAmount: number
  outstandingBalance: number
  status: LoanStatus
  durationMonths: number
  requestDate: Date
  approvalDate?: Date
  disbursementDate?: Date
  dueDate?: Date
  purpose?: string
  notes?: string
  borrower: {
    id: string
    name: string
    email: string
    phone?: string
  }
  repayments: LoanRepayment[]
}
```

### **LoanRepayment**

```typescript
{
  id: string
  loanId: string
  amount: number
  paymentDate: Date
  method: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'OTHER'
  reference?: string
  notes?: string
}
```

### **LoanStats**

```typescript
{
  totalDisbursed: number;
  activeLoans: number;
  outstandingBalance: number;
  overdueLoans: number;
  interestEarned: number;
  defaultedLoans: number;
}
```

---

## **State Management Flow**

### **LoansPage State**

```typescript
// Data state
const [stats, setStats] = useState<LoanStats | null>(null);
const [loans, setLoans] = useState<Loan[]>([]);

// UI state
const [statsLoading, setStatsLoading] = useState(true);
const [loansLoading, setLoansLoading] = useState(true);

// Filter state
const [filters, setFilters] = useState<LoanFilterOptions>({
  status: 'ALL', // Status filter
  search: '', // Search query
  page: 1, // Pagination page
});
const [totalPages, setTotalPages] = useState(1);

// Modal state
const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
const [activeModal, setActiveModal] = useState<
  'details' | 'approve' | 'reject' | 'disburse' | 'repayment' | 'default' | null
>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### **State Update Triggers**

1. **Page Load**

   ```
   useEffect([chamaId]) → loadStats() → setStats()
   useEffect([chamaId]) → loadLoans() → setLoans()
   ```

2. **Search Input**

   ```
   User types → setFilters(search)
   → 400ms debounce
   → useEffect([filters])
   → loadLoans()
   → setLoans()
   ```

3. **Status Filter Click**

   ```
   User clicks status → setFilters(status)
   → useEffect[filters]
   → loadLoans()
   → setLoans()
   ```

4. **Action (e.g., Approve)**
   ```
   User submits form
   → setIsSubmitting(true)
   → handleApprove()
   → LoansService.approveLoan()
   → Success: reloadLoans() + closeModal()
   → Error: toast(error)
   → Finally: setIsSubmitting(false)
   ```

---

## **API Integration Pattern**

### **Service Layer (loans-service.ts)**

Each API method follows this pattern:

```typescript
async getStats(chamaId: string): Promise<LoanStats> {
  try {
    const response = await secureApiClient.get(
      `/api/v1/loans/stats`,
      { params: { chamaId } }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiErrorData
      throw new Error(apiError?.message || 'Failed to load loan statistics')
    }
    throw new Error('Network error. Please check your connection.')
  }
}
```

### **Error Handling Pattern**

```typescript
try {
  const response = await apiCall();
  setData(response.data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast.error(message); // User-friendly message
}
```

### **Debounce Pattern (Search)**

```typescript
useEffect(() => {
  // Set up timeout
  const timeout = setTimeout(() => {
    // Call API after user stops typing (400ms)
    loadLoans(filters);
  }, 400);

  // Cleanup previous timeout
  return () => clearTimeout(timeout);
}, [filters.search]);
```

---

## **Component Communication**

### **Parent → Child Props**

```
LoansPage
  ├─ LoanStatsCards
  │   ├─ stats: LoanStats
  │   └─ isLoading: boolean
  │
  ├─ LoansTable
  │   ├─ loans: Loan[]
  │   ├─ isLoading: boolean
  │   └─ onX callbacks: (loan) => void
  │
  └─ Modals
      ├─ loan: Loan | null
      ├─ isOpen: boolean
      ├─ isLoading: boolean
      ├─ onClose: () => void
      └─ onAction: (id, data) => void
```

### **Child → Parent Events**

```
Modal → User submits
  ↓
Call onAction callback
  ↓
LoansPage handler (handleApprove, etc.)
  ↓
Call LoansService method
  ↓
Success/Error toast
  ↓
Close modal
  ↓
Reload data
```

---

## **Loading States**

### **Stats Loading**

```typescript
if (statsLoading) {
  // Show 6 skeleton cards
  return (
    <div className='grid grid-cols-6 gap-4'>
      {[...Array(6)].map((_, i) => (
        <div className='h-24 bg-muted animate-pulse' />
      ))}
    </div>
  )
}
```

### **Table Loading**

```typescript
if (loansLoading) {
  // Show 5 skeleton rows
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className='h-12 bg-muted animate-pulse' />
      ))}
    </tbody>
  )
}
```

### **Submit Loading**

```typescript
<Button
  disabled={isSubmitting || !validForm}
>
  {isSubmitting && <Loader2 className='animate-spin mr-2' />}
  {isSubmitting ? 'Processing...' : 'Approve Loan'}
</Button>
```

---

## **Error Handling Strategy**

### **Layer 1: API Service**

```typescript
// API calls wrap in try-catch
// Convert axios errors to readable messages
// Return Promise<T> or throw Error
```

### **Layer 2: Event Handlers**

```typescript
// Wrap service calls in try-catch
// Show error toast with message
// Log to console for debugging
```

### **Layer 3: User Feedback**

```typescript
// Red toast for errors
// Helpful error messages
// Form stays open for retry
// Buttons disabled until retry
```

---

## **Performance Optimizations**

1. **Debounced Search** (400ms)

   - Reduces API calls while typing
   - Better UX with real-time filtering

2. **Lazy Loading Modals**

   - Only render open modal (React.lazy)
   - Reduces initial bundle size

3. **Memoized Callbacks**

   - useCallback for handler functions
   - Prevents unnecessary re-renders

4. **Conditional Rendering**

   - Don't render hidden modals
   - Only show status-relevant buttons

5. **Loading States**
   - Prevent double-submission
   - Show progress to user

---

## **Type Safety**

### **Zero 'any' Types**

✅ All variables have explicit types  
✅ All function parameters typed  
✅ All return types declared  
✅ Strict mode enabled in tsconfig.json

### **Type Coverage**

- Loan models: 12 types
- Service methods: 8 signatures
- Component props: 6+ interfaces
- Event handlers: 5 typed handlers
- Utility functions: 10+ typed functions

---

## **Testing Strategy**

### **Unit Tests (Future)**

- Utility functions (formatting, calculations)
- Service methods (with mocked axios)
- Component rendering with props

### **Integration Tests (Future)**

- LoansPage with mocked LoansService
- Modal form submission flow
- Filter + pagination flow

### **E2E Tests (Future)**

- Full user workflow (search → approve → disburse)
- Error scenarios
- Network failure handling

### **Current: Manual Testing**

- See LOANS_TESTING_GUIDE.md for detailed steps

---

## **Future Enhancements**

### **Tier 1: High Priority**

- [ ] Create Loan modal (new loan request)
- [ ] Edit Loan modal (for pending loans)
- [ ] Bulk approve/reject
- [ ] Export to CSV

### **Tier 2: Medium Priority**

- [ ] Loan amortization schedule
- [ ] Advanced filtering (date range, amount range)
- [ ] Loan repayment reminders (SMS/Email)
- [ ] Approval workflow rules

### **Tier 3: Low Priority**

- [ ] Loan guarantee tracking
- [ ] PDF agreement generation
- [ ] M-Pesa API integration
- [ ] Analytics dashboard

---

## **Security Considerations**

✅ All API calls use secure axios interceptor with token  
✅ No sensitive data stored in component state  
✅ Error messages don't leak internal details  
✅ Form inputs validated before submission  
✅ Buttons disabled while submitting (prevents double-click)  
✅ User permissions checked on backend

---

## **Browser Support**

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## **Deployment Checklist**

- [x] All files created and properly structured
- [x] All imports use correct relative paths
- [x] No circular dependencies
- [x] TypeScript strict mode passing
- [x] No console errors/warnings
- [x] All env variables defined
- [x] Backend endpoints documented
- [x] Error messages user-friendly
- [x] Loading states implemented
- [x] Dark mode support working
- [x] Responsive design tested
- [x] Documentation complete

---

**Architecture Version:** 1.0  
**Last Updated:** April 30, 2026  
**Status:** ✅ Production Ready
