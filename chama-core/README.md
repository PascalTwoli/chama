# chama-core — ChamaPlus Backend API

NestJS REST API powering the ChamaPlus savings group management platform.

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | ^10.0.0 | Web framework |
| Prisma | ^6.9.0 | ORM |
| PostgreSQL | any | Database |
| Firebase Admin | ^13.4.0 | Token verification |
| Swagger | ^11.2.0 | API docs at `/api/docs` |
| class-validator | ^0.14.2 | DTO validation |
| Nodemailer + Brevo | latest | Email delivery |
| React Email | ^1.0.8 | Email templates |

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL (local or cloud)
- Firebase project with a service account key JSON

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env
cp .env.example .env   # fill in the values below

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed notification types and default expense categories
npx prisma db seed

# 5. Start dev server
pnpm start:dev
```

- API: `http://localhost:5500/api/v1`
- Swagger: `http://localhost:5500/api/docs`

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/chamaplus
FIREBASE_KEY_PATH=./chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json

# Optional
PORT=5500
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Email (Brevo / Nodemailer)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-brevo-api-key
EMAIL_FROM=noreply@chamaplus.com
```

## Project Structure

```
src/
├── auth/                   # Google OAuth endpoint
├── chama/                  # Chama CRUD + member listing
├── chama-settings/         # Contribution rules configuration
├── dashboard/              # KPI stats endpoint
├── decorators/             # @CurrentUser() decorator
├── email/                  # Email service (Nodemailer + templates)
├── expenses/               # Expense CRUD + approve/reject workflow
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   ├── expenses.repository.ts  # All Prisma calls
│   └── file-upload.service.ts
├── guards/                 # AuthGuard, PermissionGuard
├── invites/                # Token-based invite links
├── join-requests/          # Join request submit + review
├── notifications/          # Notification CRUD + type seeding
├── prisma/                 # PrismaService singleton
├── roles-permissions/      # RBAC roles + permissions
├── transaction/            # Transaction ledger records
├── treasury/               # Treasury summary
├── user/                   # User profile CRUD
└── utils/                  # Firebase UID validator
```

## Authentication

Every protected route uses `AuthGuard`, which:

1. Extracts the Bearer token from the `Authorization` header
2. Calls `firebase-admin.verifyIdToken(token)`
3. Looks up the user in PostgreSQL by Firebase UID
4. Auto-creates the user record if this is their first request
5. Attaches `{ id, email, name }` to `request.user`

The `@CurrentUser()` decorator retrieves this object in controller handlers.

## API Reference

All routes prefixed `/api/v1/`.

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/google` | No | Exchange Google ID token |
| POST | `/auth/signout` | No | Clear session cookie |

### User
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Yes | Get current user profile |
| PATCH | `/users/me` | Yes | Update profile |
| GET | `/users/me/join-requests` | Yes | Get user's join requests |

### Chama
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chama` | Yes | Create chama |
| GET | `/chama` | Yes | Get user's chamas |
| GET | `/chama/available` | Yes | Get joinable chamas |
| GET | `/chama/:id` | Yes | Get chama by ID |
| PATCH | `/chama/:id` | Yes | Update name/description (owner only) |
| DELETE | `/chama/:id` | Yes | Delete chama + all data (owner only) |
| GET | `/chama/:id/members` | Yes | List chama members |

### Chama Settings
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chama-settings` | Yes | Create settings |
| GET | `/chama-settings/:chamaId` | Yes | Get settings |
| PATCH | `/chama-settings/:chamaId` | Yes | Update settings |

### Invites
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/invites` | Yes | Create invite (with or without email) |
| GET | `/invites/validate/:token` | No | Validate invite token |
| POST | `/invites/accept` | Yes | Accept invite |
| GET | `/invites/chama/:chamaId` | Yes | List pending invites |

### Join Requests
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chamas/:chamaId/requests` | Yes | Submit join request |
| GET | `/chamas/:chamaId/requests` | Yes | Get pending requests (admin) |
| POST | `/chamas/:chamaId/requests/:id/review` | Yes | Approve or reject |

### Expenses
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/expenses` | Yes | Create expense |
| GET | `/expenses/chama/:chamaId` | Yes | List expenses (up to 100) |
| GET | `/expenses/:id` | Yes | Get expense by ID |
| PATCH | `/expenses/:id` | Yes | Update expense (creator, PENDING only) |
| DELETE | `/expenses/:id` | Yes | Delete expense (creator, PENDING only) |
| POST | `/expenses/:id/approve` | Yes | Approve (admin) |
| POST | `/expenses/:id/reject` | Yes | Reject (admin) |
| GET | `/expenses/categories` | Yes | List all categories |
| GET | `/expenses/categories/chama/:chamaId` | Yes | List chama categories |
| POST | `/expenses/categories` | Yes | Create custom category |

### Dashboard & Treasury
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard/:chamaId` | Yes | KPI stats |
| GET | `/treasury/:chamaId` | Yes | Treasury summary |

### Notifications
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | Yes | Get user's notifications |
| POST | `/notifications/mark-read` | Yes | Mark specific as read |
| POST | `/notifications/mark-all-read` | Yes | Mark all as read |

### Roles & Permissions
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/roles` | Yes | Create RBAC role |
| GET | `/roles/:chamaId` | Yes | Get roles for chama |
| PATCH | `/roles/:id` | Yes | Update role |
| DELETE | `/roles/:id` | Yes | Delete role |
| POST | `/roles/:id/permissions` | Yes | Assign permissions to role |
| POST | `/roles/members/assign` | Yes | Assign RBAC role to member |
| POST | `/roles/members/governance` | Yes | Assign governance role |

## Role System

**Governance roles** (`membership.role` enum): `CHAIRPERSON` / `TREASURER` / `SECRETARY` / `MEMBER` — stored on the membership record; used for hierarchical access decisions.

**RBAC roles** (`role` + `permission` + `member_role` tables): Custom named roles per chama with fine-grained permission keys (e.g., `expense.approve`). One RBAC role per user per chama via the `member_role` composite PK.

## Key Implementation Patterns

- **Repository pattern**: `.repository.ts` owns all Prisma calls; `.service.ts` owns business logic.
- **Prisma transactions**: `$transaction(async tx => { ... })` callback pattern for multi-step writes.
- **Error handling**: `error instanceof Error ? error.message : 'Unknown error'` in all catch blocks.
- **Atomic status changes**: `WHERE id = ? AND status = 'PENDING'` in repository prevents duplicate approvals.
- **Cascade delete ordering**: `membership` / `contribution` / `notification` / `invite` / `payment` must be deleted manually before deleting `chama`; remaining relations cascade via Prisma schema.

## Prisma

```bash
npx prisma migrate dev --name <name>   # Apply new migration
npx prisma generate                     # Regenerate client after schema change
npx prisma studio                       # Open database browser
npx prisma migrate reset               # Reset DB (dev only — destroys data)
```

## Scripts

```bash
pnpm start:dev    # Development with hot reload
pnpm start:prod   # Production
pnpm build        # Compile TypeScript
pnpm lint         # ESLint
```
