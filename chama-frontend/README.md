# chama-frontend — ChamaPlus Web App

React 19 web application for ChamaPlus — a savings group management platform.

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^19.0.0 | UI framework |
| TypeScript | ^4.9.5 | Type safety |
| React Router DOM | ^7.4.0 | Client-side routing |
| TanStack Query | ^5.69.0 | Server state caching |
| Firebase SDK | ^12.9.0 | Client-side auth |
| Axios | ^1.9.0 | HTTP client |
| React Hook Form | ^7.72.0 | Form management |
| Radix UI | latest | Accessible UI primitives |
| Tailwind CSS | ^3.4.x | Styling |
| Recharts | ^3.7.0 | Charts |
| react-day-picker | ^9.14.0 | Date range calendar |
| date-fns | ^4.1.0 | Date formatting |
| Lucide React | ^0.522.0 | Icons |
| react-hot-toast | ^2.6.0 | Toast notifications |
| CRACO | ^7.1.0 | CRA config override |

## Prerequisites

- Node.js 18+
- pnpm
- Backend API running (see [chama-core](../chama-core/README.md))
- Firebase project (Email/Password + Google auth enabled)

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env
cp .env.example .env   # fill in Firebase config and API URL

# 3. Ensure backend is running on port 5500

# 4. Start dev server
pnpm start
```

App runs at `http://localhost:3000`

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5500/api/v1

# Firebase project settings
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

All environment variables must be prefixed with `REACT_APP_`.

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Design system primitives (Button, Card, Input, Select…)
│   ├── guards/             # Route guards (AuthGuard, OnboardingGuard, DashboardGuard)
│   ├── navbars/            # Sidebar + top navbar
│   └── settings/           # Account + chama settings sub-components
├── config/                 # Axios config, Firebase config
├── context/                # React contexts (Auth, Chama, ChamaMembership, Theme)
├── hooks/                  # useChamaId, useOnboardingRedirect
├── layout/                 # AdminLayout, MemberLayout, NavbarOnlyLayout
├── models/                 # TypeScript interfaces for API responses
├── pages/                  # Page-level components (one per route)
│   └── onboarding/         # ChamaChoice page
├── routes/                 # Routes.tsx — main router
├── services/               # API service layer
│   ├── auth/               # Google, signin, signup, logout
│   ├── chama/              # ChamaService, ChamaMembersService, ChamaSettingsService
│   ├── dashboard/          # DashboardService
│   ├── notifications/      # NotificationsService
│   ├── roles-permissions/  # RolesPermissionsService
│   └── transaction/        # TransactionService
└── utils/                  # cn(), toast helpers, notification events
```

## Routing

```
/                               → Landing (public)
/auth/signin                   → Sign in
/auth/signup                   → Sign up
/onboarding/chama-choice       → First-time user flow
/onboarding/create-chama       → Create chama wizard
/join-chama/:token             → Accept invite by token

/admin/chamas/:chamaId/        → Admin area (requires ADMIN role)
  (index)                      → Dashboard with KPIs + charts
  membership                   → Membership management
  contributions                → Contribution list
  contributions/record-contribution
  expenses                     → Expense tracking + approvals
  loans                        → Loans (stub)
  members                      → Members + role assignment
  roles                        → RBAC role management
  meetings                     → Meetings (stub)
  meetings/schedule            → Schedule meeting (stub)
  notifications                → Notification list
  reports                      → Reports (stub)
  activity-log                 → Activity log (stub)
  communication                → Communication (stub)
  settings                     → Chama settings + danger zone
  account-settings             → User account settings

/member/chamas/:chamaId/       → Member area (requires MEMBER role)
  (index)                      → Member dashboard
  notifications                → Notifications
  chama_settings               → Settings (view-only)
  account_settings             → Account settings
```

## Route Guards

| Guard | Behaviour |
|-------|-----------|
| `AuthGuard` | Redirects to `/auth/signin` if not authenticated |
| `OnboardingGuard` | For authenticated users without a chama — shows chama-choice |
| `DashboardGuard` | Verifies the required role (ADMIN/MEMBER) for the specific chama |

## Context Providers

| Context | Hook | Provides |
|---------|------|----------|
| `AuthContext` | `useAuth()` | `user`, `loading`, `isAuthenticated` |
| `ChamaContext` | `useChama()` | `chamaData`, `chamaId`, loading state |
| `ChamaMembershipContext` | `useChamaMembership()` | User's role in the active chama |
| `ThemeContext` | `useTheme()` | `isDark`, `toggleTheme` |

## Page Status

| Page | Status |
|------|--------|
| Landing | Complete |
| SignIn / SignUp | Complete |
| ChamaChoice | Complete |
| AdminDashboard | Complete — KPI cards, treasury chart |
| MemberDashboard | Complete |
| ContributionsPage | Complete |
| ExpensesPage | Complete — search, category filter, date range, approve/reject |
| MembersPage | Complete — role assignment |
| RolesAndPermissionsPage | Complete |
| NotificationsPage | Complete |
| SettingsPage | Complete — edit chama info, configure settings, danger zone |
| AccountSettings | Complete |
| LoansPage | Stub |
| ReportsPage | Stub |
| MeetingsPage | Stub |
| CommunicationPage | Stub |
| ActivityLogPage | Stub |

## UI Component System

Custom design system in `src/components/ui/` built on Radix UI + Tailwind CSS + CVA:

- `Button` — variant-based (default, destructive, outline, ghost)
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Input`, `Label`
- `Select` — Radix Select with custom styling
- `Dialog` — Radix Dialog for modals
- `Tabs` — Radix Tabs
- `Badge`, `Avatar`, `Table`, `Checkbox`

## Authentication

- **Email+Password**: Firebase Email/Password provider
- **Google OAuth**: Firebase Google provider
- **Token**: Firebase ID token attached as `Bearer` header on every Axios request via interceptor in `config/axios-config.ts`
- **Storage**: httpOnly cookie (set by backend) + localStorage fallback

## Scripts

```bash
pnpm start          # Dev server with hot reload
pnpm build          # Production build
pnpm test           # Jest tests
npx tsc --noEmit    # Type check without building
```

## Troubleshooting

**API connection error / CORS**
- Confirm backend is running on port 5500
- Check `REACT_APP_API_URL` in `.env`
- Confirm `CORS_ORIGINS` on the backend includes `http://localhost:3000`

**401 Unauthorized**
- Clear localStorage and sign in again: `localStorage.clear()`
- Confirm the Firebase project matches the service account key on the backend

**Blank page after login**
- Open DevTools → Application → Clear Storage, then reload

**Port already in use**
```bash
lsof -ti:3000 | xargs kill -9
```
