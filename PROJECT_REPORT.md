# ChamaPlus — Comprehensive Project Report

> **Purpose:** This document is a deeply detailed technical and product report for ChamaPlus. It is intended to be shared with external AI agents (such as ChatGPT) so that collaborators are fully aligned on the architecture, current state, decisions made, open problems, and recommended future direction. Update this document whenever significant changes are made.
>
> **Last updated:** 2026-04-29
> **Current active branch:** `feature/expenses`

---

## Table of Contents

1. [What Is ChamaPlus?](#1-what-is-chamaplus)
2. [Tech Stack](#2-tech-stack)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Database Schema](#5-database-schema)
6. [Backend — chama-core](#6-backend--chama-core)
7. [Frontend — chama-frontend](#7-frontend--chama-frontend)
8. [Authentication System](#8-authentication-system)
9. [Role & Permission System (Dual-Role)](#9-role--permission-system-dual-role)
10. [Features Implemented](#10-features-implemented)
11. [Features Stubbed / Partially Implemented](#11-features-stubbed--partially-implemented)
12. [Known Gaps & Missing Pieces](#12-known-gaps--missing-pieces)
13. [Recommended Future Features](#13-recommended-future-features)
14. [Issues Encountered & How They Were Solved](#14-issues-encountered--how-they-were-solved)
15. [Outstanding TODOs](#15-outstanding-todos)
16. [Environment Variables Reference](#16-environment-variables-reference)
17. [Running the Project Locally](#17-running-the-project-locally)

---

## 1. What Is ChamaPlus?

**ChamaPlus** is a web-based savings group management platform designed primarily for Kenyan *chamas* (informal savings and investment groups). A chama is a collective where members make regular financial contributions, pool funds, and distribute them — either in rotation, as loans, or for investments.

ChamaPlus digitizes and formalises this process by providing:

- Group (chama) creation, configuration, and governance
- Member management with invite links and join requests
- Contribution tracking with payment status
- Expense tracking with approval workflows
- Role-based access control within each chama
- Notifications for key events
- A dashboard with treasury and KPI statistics
- Settings for chama rules, contribution models, and onboarding templates

**Target users:**

| User Type | Description |
|-----------|-------------|
| Chairperson | Creates and administers a chama; approves/rejects expenses and join requests |
| Treasurer | Manages funds and records contributions |
| Secretary | Handles records and communications |
| Member | Regular member who contributes and views their data |

---

## 2. Tech Stack

### Backend (`chama-core`)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | NestJS | ^10.0.0 |
| Language | TypeScript | strict mode |
| ORM | Prisma | ^6.9.0 |
| Database | PostgreSQL | (any recent version) |
| Auth | Firebase Admin SDK | ^13.4.0 |
| API Docs | Swagger (NestJS Swagger) | ^11.2.0 |
| Email | Nodemailer + Brevo | latest |
| Email Templates | React Email | ^1.0.8 |
| Validation | class-validator + class-transformer | latest |
| HTTP | Express (via NestJS) | ~4.16.1 |

### Frontend (`chama-frontend`)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19.0.0 |
| Language | TypeScript | ^4.9.5 |
| Routing | React Router DOM | ^7.4.0 |
| State / Server State | TanStack React Query | ^5.69.0 |
| Auth (client) | Firebase SDK | ^12.9.0 |
| HTTP Client | Axios | ^1.9.0 |
| Forms | React Hook Form | ^7.72.0 |
| UI Primitives | Radix UI | latest |
| Styling | Tailwind CSS + CVA + clsx | ^3.4.x |
| Components | PrimeReact + Lucide Icons | latest |
| Charts | Recharts | ^3.7.0 |
| Calendar | react-day-picker | ^9.14.0 |
| Date Utils | date-fns | ^4.1.0 |
| QR Code | qrcode.react | ^4.2.0 |
| Toast | react-hot-toast + react-toastify | latest |
| Build | react-scripts + CRACO | 5.0.1 / ^7.1.0 |
| Package Manager | pnpm (workspace) | latest |

---

## 3. Monorepo Structure

```
chama/                          ← repo root
├── chama-core/                 ← NestJS backend
│   ├── src/
│   │   ├── auth/               ← Auth controller (Google OAuth)
│   │   ├── chama/              ← Core chama CRUD + member listing
│   │   ├── chama-settings/     ← Contribution rules, frequency, grace period
│   │   ├── dashboard/          ← KPI stats endpoint
│   │   ├── email/              ← Email service (Nodemailer + Brevo)
│   │   ├── expenses/           ← Expense CRUD + approve/reject workflows
│   │   ├── guards/             ← AuthGuard, PermissionGuard
│   │   ├── invites/            ← Token-based invite links
│   │   ├── join-requests/      ← Join request submit/review
│   │   ├── notifications/      ← Notification CRUD + type seeding
│   │   ├── prisma/             ← PrismaService (singleton)
│   │   ├── roles-permissions/  ← RBAC role/permission management
│   │   ├── transaction/        ← Transaction records
│   │   ├── treasury/           ← Treasury summary endpoint
│   │   ├── user/               ← User profile CRUD
│   │   └── decorators/         ← @CurrentUser() decorator
│   ├── prisma/
│   │   └── schema.prisma       ← Single source of truth for DB schema
│   └── package.json
│
├── chama-frontend/             ← React frontend
│   ├── src/
│   │   ├── components/         ← Shared + feature components
│   │   │   ├── ui/             ← Design system primitives (Button, Card, Select…)
│   │   │   ├── guards/         ← Route guards (AuthGuard, OnboardingGuard, DashboardGuard)
│   │   │   ├── navbars/        ← Sidebar, top navbar
│   │   │   └── settings/       ← Account + chama settings sub-components
│   │   ├── config/             ← Axios config, Firebase config
│   │   ├── context/            ← React contexts (Auth, Chama, ChamaMembership, Theme)
│   │   ├── hooks/              ← Custom hooks (useChamaId, useOnboardingRedirect)
│   │   ├── layout/             ← AdminLayout, MemberLayout, NavbarOnlyLayout
│   │   ├── models/             ← TypeScript interfaces for API responses
│   │   ├── pages/              ← Page-level components (one per route)
│   │   ├── routes/             ← Routes.tsx (main router)
│   │   ├── services/           ← API service layer (one per domain)
│   │   └── utils/              ← Utilities (cn, toast, notifications events)
│   └── package.json
│
├── pnpm-workspace.yaml         ← Workspace config
├── package.json                ← Root (no scripts, just workspace)
└── PROJECT_REPORT.md           ← This file
```

---

## 4. Architecture Overview

### Request Flow

```
Browser → React SPA → Axios → NestJS API (/api/v1/)
                               ↓
                         AuthGuard
                         (verifies Firebase ID token)
                               ↓
                         @CurrentUser() decorator
                         (attaches { id, email, name } to request)
                               ↓
                         Controller → Service → Repository (Prisma)
                               ↓
                         PostgreSQL
```

### Authentication Flow

```
User signs in → Firebase SDK returns ID token
             → Token stored in httpOnly cookie AND localStorage (fallback)
             → Every Axios request attaches token as Bearer header
             → NestJS AuthGuard calls Firebase Admin verifyIdToken()
             → If valid: CurrentUser is set from DB lookup by Firebase UID
             → If user not in DB: auto-created on first verified request
```

### Frontend State Architecture

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| Auth state | `AuthContext` + `useAuth()` hook | Current user profile, loading state |
| Chama selection | `ChamaContext` + `useChamaId()` hook | Active chama ID from route params |
| Chama membership | `ChamaMembershipContext` | User's role in the active chama |
| Server state | TanStack Query (some pages) | Caching and refetching for API calls |
| Local UI state | `useState` per page/component | Forms, modals, filters |

---

## 5. Database Schema

All models defined in `chama-core/prisma/schema.prisma`.

### Core Models

| Model | Key Fields | Notes |
|-------|-----------|-------|
| `user` | `id` (Firebase UID), `name`, `email`, `phone`, `role` (user_role), `system_role` | PK = Firebase UID (string) |
| `chama` | `id`, `name`, `description`, `created_by`, `country`, `members_count` | `created_by` → user.id |
| `membership` | `id`, `user_id`, `chama_id`, `role` (user_role) | Unique on (user_id, chama_id) |
| `chama_settings` | `contribution_model`, `contribution_amount`, `frequency`, `due_day`, `grace_period_days`, etc. | 1:1 with chama |
| `contribution` | `id`, `chama_id`, `user_id`, `amount`, `currency`, `status` | Payment child records |
| `payment` | `id`, `contribution_id`, `method`, `status`, `external_ref` | M-Pesa / bank ref |
| `transaction` | `id`, `type`, `amount`, `chama_id`, `user_id`, `status` | Ledger records |
| `invite` | `id`, `chama_id`, `token` (unique), `sent_to_email`, `expires_at` | Token-based invite |
| `join_request` | `id`, `chama_id`, `user_id`, `status`, `message`, `reviewed_by` | Unique on (chama_id, user_id) |
| `notification` | `id`, `user_id`, `chama_id`, `type_id`, `audience`, `title`, `body`, `read_at` | |
| `notification_type` | `id`, `key` (unique), `description`, `default_audience` | Seeded enum-like lookup |
| `role` | `id`, `chama_id`, `name`, `is_default` | RBAC role per chama |
| `permission` | `id`, `key` (unique), `description` | Global permission catalogue |
| `role_permission` | `role_id`, `permission_id` | Many-to-many join |
| `member_role` | `user_id`, `chama_id`, `role_id` | PK = (user_id, chama_id) |
| `expense` | `id`, `referenceCode`, `chamaId`, `amount`, `categoryId`, `status`, `createdBy`, `approvedBy` | Status: PENDING/APPROVED/REJECTED |
| `expense_category` | `id`, `name`, `chama_id` (nullable) | null chama_id = global default |
| `ui_settings` | `user_id`, `show_tutorial`, `theme` | Per-user UI preferences |

### Key Enums

| Enum | Values |
|------|--------|
| `user_role` | CHAIRPERSON, TREASURER, SECRETARY, MEMBER |
| `system_role` | OWNER, ADMIN, NONE |
| `ExpenseStatus` | PENDING, APPROVED, REJECTED |
| `ContributionStatus` | PENDING, COMPLETED, FAILED |
| `PaymentMethod` | MPESA, BANK_TRANSFER, CASH, OTHER |
| `ContributionModel` | FIXED, FLEXIBLE |
| `ContributionFrequency` | MONTHLY, WEEKLY |
| `transaction_type` | CONTRIBUTION, WITHDRAWAL, LOAN, LOAN_REPAYMENT, INVESTMENT, RETURN, EXPENSE |
| `NotificationAudience` | MEMBER, ADMIN, BOTH |
| `UserType` | ADMIN, MEMBER |

### Cascade Delete Chain (chama deletion)

When a chama is deleted, the following order is required:
1. Manually delete: `payment` (child of contribution) → `contribution` → `notification` → `invite` → `membership`
2. Then delete `chama` — which auto-cascades: `join_request`, `chama_settings`, `role` (→ `role_permission`, `member_role`), `expense_category`, `expense`

---

## 6. Backend — chama-core

### API Prefix & Versioning

All routes are prefixed: `/api/v1/`

### Modules & Endpoints

#### Auth (`/api/v1/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/google` | Exchange Google ID token for session |
| POST | `/auth/signout` | Clear session cookie |

#### User (`/api/v1/users`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile (name, phone, etc.) |
| GET | `/users/me/join-requests` | Get user's own join requests |

#### Chama (`/api/v1/chama`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chama` | Create new chama |
| GET | `/chama` | Get all chamas user belongs to |
| GET | `/chama/available` | Get chamas user can join |
| GET | `/chama/:id` | Get specific chama by ID |
| PATCH | `/chama/:id` | Update chama name/description (owner only) |
| DELETE | `/chama/:id` | Delete chama + all data (owner only) |
| GET | `/chama/:id/members` | List all members of a chama |

#### Chama Settings (`/api/v1/chama-settings`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chama-settings` | Create settings for chama |
| GET | `/chama-settings/:chamaId` | Get settings for chama |
| PATCH | `/chama-settings/:chamaId` | Update settings |

#### Invites (`/api/v1/invites`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/invites` | Create invite (with or without email) |
| GET | `/invites/validate/:token` | Validate invite token |
| POST | `/invites/accept` | Accept invite (creates membership) |
| GET | `/invites/chama/:chamaId` | List pending invites for a chama |

#### Join Requests (`/api/v1/chamas`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chamas/:chamaId/requests` | Submit join request |
| GET | `/chamas/:chamaId/requests` | Get pending requests (admin) |
| POST | `/chamas/:chamaId/requests/:id/review` | Approve or reject request |

#### Expenses (`/api/v1/expenses`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/expenses` | Create expense |
| GET | `/expenses/chama/:chamaId` | List expenses for chama (up to 100) |
| GET | `/expenses/:id` | Get expense by ID |
| PATCH | `/expenses/:id` | Update expense (creator, if PENDING) |
| DELETE | `/expenses/:id` | Delete expense (creator, if PENDING) |
| POST | `/expenses/:id/approve` | Approve expense (admin only) |
| POST | `/expenses/:id/reject` | Reject expense (admin only) |
| GET | `/expenses/categories` | List all expense categories |
| GET | `/expenses/categories/chama/:chamaId` | List categories for a chama |
| POST | `/expenses/categories` | Create custom category |

#### Dashboard (`/api/v1/dashboard`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/:chamaId` | KPI stats (total contributions, expenses, members, treasury balance) |

#### Treasury (`/api/v1/treasury`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/treasury/:chamaId` | Treasury summary (income, expenses, net balance) |

#### Notifications (`/api/v1/notifications`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | Get user's notifications (filtered by chamaId) |
| POST | `/notifications/mark-read` | Mark specific notifications as read |
| POST | `/notifications/mark-all-read` | Mark all as read |

#### Roles & Permissions (`/api/v1/roles`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/roles` | Create RBAC role for a chama |
| GET | `/roles/:chamaId` | Get all roles for a chama |
| PATCH | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |
| POST | `/roles/:id/permissions` | Assign permissions to role |
| POST | `/roles/members/assign` | Assign RBAC role to member |
| POST | `/roles/members/governance` | Assign governance role (user_role) to member |

#### Transactions (`/api/v1/transactions`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/transactions` | Record transaction |
| GET | `/transactions/chama/:chamaId` | List transactions |

### Key Backend Patterns

- **AuthGuard**: Validates Firebase ID token on every protected route. Queries DB for user by Firebase UID; auto-creates user if not found.
- **@CurrentUser()**: Decorator that extracts the verified user from `request.user`.
- **PrismaService**: Singleton wrapper around PrismaClient, shared across all modules.
- **Repository pattern**: Each domain has a `.repository.ts` that owns all Prisma calls; the `.service.ts` contains business logic.
- **Prisma transactions**: `$transaction(async tx => { ... })` callback pattern used for multi-step writes (e.g., chama deletion, expense status updates).
- **Error handling**: All catch blocks use `error instanceof Error ? error.message : 'Unknown error'` (no bare `any` types).

---

## 7. Frontend — chama-frontend

### Routing Structure

```
/                               → Landing page (public)
/auth/signin                   → Sign in
/auth/signup                   → Sign up
/onboarding/chama-choice       → Choose chama or create one (OnboardingGuard)
/onboarding/create-chama       → Create chama wizard (AuthGuard)
/join-chama/:token             → Accept invite by token

/admin/chamas/:chamaId/        → Admin dashboard (DashboardGuard, role=ADMIN)
  index                        → AdminDashboard (KPI cards, charts)
  membership                   → Membership management
  contributions                → Contributions list
  contributions/record-contribution → Record contribution form
  expenses                     → Expenses page (filter, approve, view)
  loans                        → Loans (stub)
  members                      → Members page with roles
  roles                        → Roles & Permissions management
  meetings                     → Meetings list
  meetings/schedule            → Schedule meeting
  notifications                → Notifications list
  reports                      → Reports (stub)
  activity-log                 → Activity log (stub)
  communication                → Communication (stub)
  settings                     → Chama Settings page
  account-settings             → User account settings
  disbursements                → Disbursements (stub)

/member/chamas/:chamaId/       → Member dashboard (DashboardGuard, role=MEMBER)
  index                        → MemberDashboard
  notifications                → Notifications
  chama_settings               → Chama Settings (view-only)
  account_settings             → Account Settings
```

### Route Guards

| Guard | Logic |
|-------|-------|
| `AuthGuard` | Redirects to `/auth/signin` if not authenticated |
| `OnboardingGuard` | Redirects to `/onboarding/chama-choice` if authenticated but no chama |
| `DashboardGuard` | Verifies required role (ADMIN/MEMBER) for the specific chama |

### Key Context Providers

| Context | Hook | Provides |
|---------|------|----------|
| `AuthContext` | `useAuth()` | `user` (profile), `loading`, `isAuthenticated` |
| `ChamaContext` | `useChama()` | `chamaData`, `chamaId`, loading state |
| `ChamaMembershipContext` | `useChamaMembership()` | Current user's role in the active chama |
| `ThemeContext` | `useTheme()` | `isDark`, `toggleTheme` |

### Pages — Implementation Status

| Page | Status | Notes |
|------|--------|-------|
| `Landing` | Complete | Public marketing page |
| `SignIn` / `SignUp` | Complete | Email+password + Google OAuth |
| `ChamaChoice` | Complete | First-time user flow |
| `AdminDashboard` | Complete | KPI cards, treasury chart, quick actions |
| `MemberDashboard` | Complete | Simplified view for regular members |
| `ContributionsPage` | Complete | Contribution list with status badges |
| `ExpensesPage` | Complete | List, filter (search/category/date range), approve/reject, view modal |
| `MembersPage` | Complete | Member list with role assignment |
| `RolesAndPermissionsPage` | Complete | Create/edit RBAC roles and assign permissions |
| `NotificationsPage` | Complete | Notification list with read/unread state |
| `SettingsPage` | Complete | Edit chama info, configure settings, danger zone |
| `AccountSettings` | Complete | User profile, theme toggle |
| `LoansPage` | Stub | UI placeholder; no backend loan module |
| `ReportsPage` | Stub | UI placeholder; charts not connected to real data |
| `MeetingsPage` | Stub | List view; no backend scheduling |
| `ScheduleMeetingPage` | Stub | Form UI; no backend |
| `CommunicationPage` | Stub | Placeholder |
| `ActivityLogPage` | Stub | Placeholder |

### Service Layer

Each domain has a service class in `src/services/`:

| Service | File |
|---------|------|
| ChamaService | `chama/chama-services.ts` |
| ChamaMembersService | `chama/chama-members-service.ts` |
| ChamaSettingsService | `chama/chama-settings-service.ts` |
| DashboardService | `dashboard/dashboard-service.ts` |
| ExpensesService | `expenses.ts` |
| NotificationsService | `notifications/notifications-service.ts` |
| RolesPermissionsService | `roles-permissions/roles-permissions-service.ts` |
| TransactionService | `transaction/transaction-services.ts` |
| Auth services | `auth/` (google, signin, signup, logout) |

### UI Component System

The project uses a custom design system built on Radix UI primitives + Tailwind CSS. Components in `src/components/ui/`:

- `Button` (CVA variants)
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Input`, `Label`
- `Select` (Radix Select with custom styling)
- `Dialog` (Radix Dialog)
- `Tabs` (Radix Tabs)
- `Badge`
- `Avatar`
- `Table`
- `Checkbox` (custom, not Radix)

---

## 8. Authentication System

### Sign In / Sign Up

- **Email+Password**: Firebase Email/Password provider. On sign-in, client gets ID token → sends to backend.
- **Google OAuth**: Firebase Google provider. Client gets ID token → sends to `/api/v1/auth/google`.
- **Token storage**: Primary = `httpOnly` cookie set by backend. Fallback = `localStorage` (for environments where cookies are restricted).

### Auto User Creation

When a valid Firebase token is presented and no matching `user` record exists in PostgreSQL, the `@CurrentUser()` decorator auto-creates the user record using Firebase profile data (UID, name, email).

### Token Refresh

Firebase SDK automatically refreshes the ID token (expiry: 1 hour). The Axios interceptor in `secure-api-interceptor.ts` attaches the latest token before each request.

### Known Auth Issues / TODOs

1. **Google + Email account linking**: If a user signs up with email, then tries Google with the same email (or vice versa), Firebase throws `auth/account-exists-with-different-credential`. Resolution exists in `FIREBASE_LINKING_SOLUTIONS.md` but is not yet fully wired up in the UI.
2. **Password reset**: Not implemented. Firebase `sendPasswordResetEmail` is available but no UI exists.
3. **Session timeout handling**: If the cookie expires and localStorage fallback fails, the user gets an unhandled 401. No global 401 → redirect-to-login handler exists yet.

---

## 9. Role & Permission System (Dual-Role)

ChamaPlus uses two overlapping role systems:

### System 1: Governance Roles (`membership.role` / `user_role` enum)

Stored directly on the `membership` record. Used for governance hierarchy:

| Role | Typical Responsibilities |
|------|-------------------------|
| CHAIRPERSON | Approves/rejects expenses and join requests; can update chama settings |
| TREASURER | Records contributions; manages treasury |
| SECRETARY | Manages records, meeting notes |
| MEMBER | Basic access; can view their own data |

These are assigned via `PATCH /roles/members/governance`. Frontend checks `membership.role` (or `ChamaMembershipContext`) to show/hide admin actions.

### System 2: RBAC Roles (`role` + `permission` + `member_role` tables)

A flexible permission system where chairpersons can define custom roles (e.g., "Finance Officer") and assign fine-grained permissions (e.g., `expense.approve`, `contribution.record`).

- `role` — chama-specific role definition
- `permission` — global list of permission keys
- `role_permission` — join table (role → permissions)
- `member_role` — assigns an RBAC role to a user within a chama (PK = user_id + chama_id, so one RBAC role per user per chama)

### Known Dual-Role Sync Issue

The two systems are not always kept in sync. For example, when a user's governance role changes from CHAIRPERSON → MEMBER, their RBAC role is not automatically updated (and vice versa). This can cause stale permission checks. This is a known gap that needs a reconciliation strategy.

### Permission Guard

`PermissionGuard` on the backend validates RBAC permissions via `@RequirePermission('expense.approve')` decorators. However, not all endpoints use it — some rely on governance role checks inline in the service.

---

## 10. Features Implemented

### Chama Lifecycle
- [x] Create chama (with country selection, description, rules)
- [x] Configure chama settings (contribution model, frequency, amount, due day, grace period, late fee, member loans toggle, SMS reminders toggle)
- [x] Update chama name and description (owner/chairperson only)
- [x] Delete chama with full cascade (owner only, requires typing chama name to confirm)
- [x] View chama details

### Member Management
- [x] Invite members via shareable link (token-based)
- [x] Invite members via email (sends invite token)
- [x] Accept invite via `/join-chama/:token` route
- [x] Submit join request (with optional message)
- [x] Review join requests (approve / reject) — chairperson only
- [x] View all members with roles
- [x] Assign governance roles to members (chairperson/treasurer/secretary/member)
- [x] Assign RBAC roles to members

### Contributions
- [x] Record contributions (amount, currency, date)
- [x] View contribution list with status badges
- [x] Contribution status tracking (PENDING / COMPLETED / FAILED)

### Expenses
- [x] Record expense (description, amount, category, paid to, payment method, date, notes, attachment URL)
- [x] Auto-generated reference code (EXP-YYYY-NNN format)
- [x] Expense approval workflow (PENDING → APPROVED / REJECTED)
- [x] View expense details (ViewExpenseModal)
- [x] Atomic approve/reject: server checks PENDING status before acting; repository adds `status: 'PENDING'` to WHERE clause
- [x] Filter expenses by search (description, paidTo, referenceCode, amount)
- [x] Filter expenses by category (by name, not ID)
- [x] Filter expenses by date range (react-day-picker calendar popover)
- [x] Global + chama-specific expense categories

### Notifications
- [x] Notification model with type, audience, read status
- [x] Notification types seeded (MEMBER_JOINED, EXPENSE_SUBMITTED, EXPENSE_APPROVED, EXPENSE_REJECTED, etc.)
- [x] Mark individual / all notifications as read
- [x] Notification badge with unread count
- [x] Notifications page with list view

### Dashboard
- [x] KPI stat cards (total contributions, expenses, members, treasury balance)
- [x] Treasury chart (income vs. expenses, using Recharts)
- [x] StatCard trend row conditionally rendered (only when `change` is non-empty)

### Settings
- [x] Chama basic info editing (name, description) — inline card edit
- [x] Chama settings form (contribution model, amount, frequency, due day, etc.)
- [x] Onboarding templates preview (dynamic, shows live form data)
- [x] Danger Zone card (last position, owner-only, red border)
- [x] Delete chama with confirmation modal

### Auth
- [x] Email/password sign in + sign up
- [x] Google sign in
- [x] Route guards (auth, onboarding, role-based)
- [x] Auto user creation on first login
- [x] Token-based session management (cookie + localStorage fallback)

---

## 11. Features Stubbed / Partially Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Loans | UI stub — no backend module | `LoansPage.tsx`, `softloans.tsx` |
| Reports | UI stub — charts not real data | `ReportsPage.tsx` |
| Meetings | Basic list UI; no backend scheduling | `MeetingsPage.tsx`, `ScheduleMeetingPage.tsx` |
| Communication | Empty placeholder | `CommunicationPage.tsx` |
| Activity Log | Empty placeholder | `ActivityLogPage.tsx` |
| Disbursements | UI stub | `disbursements.tsx` |
| Shares | UI stub | `shares.tsx` |
| M-Pesa payment integration | Payment model exists; no M-Pesa API calls | `payment` table in schema |
| File/attachment upload | `attachmentUrl` field exists; `file-upload.service.ts` exists but not wired | `expenses/file-upload.service.ts` |
| Password reset | Firebase method available; no UI | — |
| Google + Email account linking | Resolution documented; not fully wired | `FIREBASE_LINKING_SOLUTIONS.md` |
| Member profile photos | `profile-image-upload.tsx` component exists; not integrated | `settings/profile-image-upload.tsx` |

---

## 12. Known Gaps & Missing Pieces

1. **No loans backend module**: The loans UI exists as stubs but there is no `loans` NestJS module, no schema model, and no API endpoints for loan issuance, repayment schedules, or interest calculations.

2. **No global 401 interceptor**: When tokens expire, individual API calls fail with 401 but there is no centralized handler that redirects to `/auth/signin`.

3. **`members_count` field not auto-updated**: The `chama.members_count` integer field is not updated when members join or leave. It's set at creation time but drift silently accumulates.

4. **Dual-role sync not enforced**: Changing governance role does not update RBAC role and vice versa. A user could have MEMBER governance role but retain admin-level RBAC permissions.

5. **No pagination on list endpoints**: Expenses, contributions, transactions all load up to a fixed limit (100 for expenses). No cursor or page-based pagination.

6. **Client-side filtering only**: All filtering for expenses (search, category, date) is done client-side after fetching the first 100 records. This doesn't scale.

7. **No real-time updates**: No WebSocket or SSE — the UI only updates on page load or manual refresh. Notifications are polled on mount.

8. **Email delivery unverified in production**: Nodemailer + Brevo is wired up but has not been tested in a production environment.

9. **No audit log / activity log**: The `ActivityLogPage` is a stub. No backend records who did what, when.

10. **M-Pesa integration is schema-only**: The `payment` table has `method: MPESA` and `external_ref` fields but no actual M-Pesa Daraja API calls are made.

11. **No recurring contribution reminders**: `automatic_sms_reminders` toggle exists in settings but the SMS/email reminder job does not exist.

12. **Chama type (SAVINGS/INVESTMENT) not surfaced in UI**: `normalizeChamaType()` exists in the service but the UI never sets or displays it.

---

## 13. Recommended Future Features

### High Priority

1. **Loans Module** (full implementation)
   - Models: `loan`, `loan_repayment` with interest calculation
   - States: REQUESTED → APPROVED → DISBURSED → REPAID / DEFAULTED
   - Endpoints: apply, approve, record repayment, view schedule
   - UI: `LoansPage` fully wired, amortization table

2. **M-Pesa Integration (Daraja API)**
   - STK push for contributions and loan repayments
   - Webhook receiver for payment confirmation
   - Update `payment.status` and `contribution.status` on callback
   - Essential for the Kenyan market

3. **Server-side Filtering & Pagination**
   - Add `?page=`, `?limit=`, `?search=`, `?category=`, `?dateFrom=`, `?dateTo=` query params to expense and contribution endpoints
   - Prevents loading 100+ records into memory for every page visit

4. **Real-time Notifications (WebSocket)**
   - NestJS Gateway + Socket.io
   - Push notification badge updates without page reload
   - Useful for expense approval events, join request events

5. **Reports Module (real data)**
   - Contribution trend chart (monthly totals)
   - Expense breakdown by category (pie chart)
   - Treasury balance over time
   - Exportable PDF/CSV

### Medium Priority

6. **Meetings with Scheduling**
   - Model: `meeting` (title, date, location, agenda, attendees, minutes)
   - Google Calendar / iCal integration
   - RSVP tracking

7. **Activity Log**
   - Backend audit trail: who did what, when, on which entity
   - Frontend activity log page (filters by date, user, action type)

8. **Communication / Messaging**
   - In-app announcements board
   - Optional: email broadcast to all members

9. **Password Reset**
   - Use Firebase `sendPasswordResetEmail` 
   - Forgot password UI at `/auth/forgot-password`

10. **Google + Email Account Linking**
    - Full UI flow when `auth/account-exists-with-different-credential` is thrown
    - Sign in with existing provider, then link the new one

11. **Mobile App (React Native)**
    - Same NestJS API, new React Native client
    - Push notifications via Firebase Cloud Messaging (FCM)
    - M-Pesa deep-links

### Lower Priority

12. **Multi-chama support**: A user is currently expected to be in one active chama. Support for switching between multiple chamas.

13. **Contribution Reminders**: Cron job that sends email/SMS reminders on `due_day - grace_period_days`.

14. **Investment tracking**: For chamas of type INVESTMENT — portfolio items, returns, dividends.

15. **Member borrowing limit**: Based on contribution history (a common real-world rule).

16. **QR code for chama invite**: The `qrcode.react` package is already installed; QR invite is partially present in `InviteLink.tsx`.

---

## 14. Issues Encountered & How They Were Solved

### Auth & User Issues

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Google sign-in failing for existing email accounts | Firebase throws `account-exists-with-different-credential` when email used with password is then tried with Google | Documented resolution in `FIREBASE_LINKING_SOLUTIONS.md`; partial fix applied; full account-linking flow not yet wired |
| `@CurrentUser()` logging verbose messages on every request | Early debug logging left in decorator | Removed console logs; decorator now silently creates/returns user |
| CORS blocking frontend requests | CORS origins were hardcoded without env var override | Refactored `main.ts` to read `CORS_ORIGINS` env var and merge with defaults |
| 401 errors not redirecting to login | No global Axios interceptor for 401 responses | Known gap — not yet fixed |

### TypeScript Issues

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `error is of type unknown` in catch blocks | TypeScript strict mode, raw `error.message` access | Added `error instanceof Error ? error.message : 'Unknown error'` pattern throughout services |
| `any` types in expenses service/repository | Initial quick implementation | Replaced with proper typed interfaces; `ExpenseStatus` enum used |
| `Promise.all` not awaited | Async calls used without `await` in service | Added `await` to all `Promise.all` calls |

### Frontend / UI Issues

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `isOwner` always false in SettingsPage | `getChamaById` returns raw Prisma chama (no computed `isOwner`/`role` field); frontend was checking non-existent fields | Added `useAuth()` in SettingsPage; compare `chamaData.created_by === authUser.id` |
| Description field showing empty on load | `localDescription` initialized as `null`; check was `!== undefined`; since `null !== undefined` is always `true`, it fell through to show `''` | Changed check to `!== null` |
| Category filter returning zero results | Expenses use chama-specific category IDs; filter was comparing against global category IDs (same names, different UUIDs) | Changed filter to compare `e.category.name` and populate select options with `cat.name` as value |
| Date filter broke original toolbar layout | Initial implementation added a second row of date inputs below the toolbar | Reverted layout; added a single calendar button that opens a popover with `react-day-picker` |
| StatCard showing empty trend row | `change` prop was empty string but trend arrow was still rendering | Added conditional: `{change && (<trend row/>)}` |
| Onboarding Templates showing hardcoded data | Card was using literal strings "Tumaini Chama" and "KSh 5000" | Made dynamic using `chamaDisplayName` and live form state |
| Danger Zone card not in last position | Card was placed before Onboarding Templates | Moved Danger Zone to end of settings page |

### Backend Logic Issues

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Expense approve/reject race condition | Two concurrent requests could both approve the same expense | Added `status: 'PENDING'` to WHERE clause in repository; service pre-checks status and throws `BadRequestException` if not PENDING |
| Chama delete failing due to FK constraints | No cascade delete on `membership`, `contribution`, `notification`, `invite` | Added manual deletion in transaction before deleting chama; remaining relations cascade from Prisma schema |
| `debug: ~2.6.9` in backend `package.json` | Leftover from NestJS scaffold; `debug` is a development utility | Noted; not removed to avoid breaking scaffold; low priority |

---

## 15. Outstanding TODOs

- [ ] **Global 401 interceptor**: Add Axios response interceptor that on 401 calls Firebase `signOut()` and redirects to `/auth/signin`.
- [ ] **`members_count` sync**: Update `chama.members_count` on every membership create/delete operation.
- [ ] **Account linking UI**: Build `/auth/link-account` flow for `account-exists-with-different-credential` errors.
- [ ] **Password reset UI**: Add forgot password page.
- [ ] **Notification actions**: `action_required` field in `notification` exists but no UI to perform the action (e.g., click "Approve" directly from notification).
- [ ] **Dual-role sync**: When governance role changes, update RBAC role if applicable.
- [ ] **File upload wiring**: `attachmentUrl` field in expense exists; `file-upload.service.ts` exists but isn't connected to the expense creation flow.
- [ ] **Loans module**: Full backend + frontend implementation.
- [ ] **M-Pesa integration**: Daraja API STK push + callback handler.
- [ ] **Pagination**: Add cursor/page params to expense, contribution, transaction list endpoints.

---

## 16. Environment Variables Reference

### Backend (`chama-core/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/chamaplus
PORT=5500
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
FIREBASE_KEY_PATH=./chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json

# Email (Nodemailer / Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-brevo-api-key
EMAIL_FROM=noreply@chamaplus.com
```

### Frontend (`chama-frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5500/api/v1

# Firebase (from Firebase project settings)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

---

## 17. Running the Project Locally

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL running locally
- Firebase project with Email/Password + Google auth enabled
- Firebase Admin SDK service account JSON key

### Setup

```bash
# 1. Clone repo and install dependencies
git clone <repo>
cd chama
pnpm install

# 2. Configure backend
cd chama-core
cp .env.example .env   # fill in DATABASE_URL, FIREBASE_KEY_PATH, etc.
npx prisma migrate dev
npx prisma db seed     # seeds notification_types and default expense_categories

# 3. Start backend
pnpm --filter chama-core start:dev
# → API running at http://localhost:5500/api/v1
# → Swagger at http://localhost:5500/api/docs

# 4. Configure frontend
cd ../chama-frontend
cp .env.example .env   # fill in Firebase config and REACT_APP_API_URL

# 5. Start frontend
pnpm --filter chama-frontend start
# → App running at http://localhost:3000
```

### Useful Commands

```bash
# Run Prisma Studio (DB browser)
cd chama-core && npx prisma studio

# Generate Prisma client after schema changes
cd chama-core && npx prisma generate

# Run migrations
cd chama-core && npx prisma migrate dev --name <migration-name>

# Type check frontend
cd chama-frontend && npx tsc --noEmit
```

---

*This document should be updated whenever:*
- *A new module or feature is added*
- *A significant architectural decision is made*
- *A major bug is found and fixed*
- *A new dependency is introduced*
