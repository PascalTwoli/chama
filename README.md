# ChamaPlus

A web-based savings group (Chama) management platform for Kenyan savings groups — digitizing contributions, expenses, member management, and treasury tracking.

## What's in this repo

| Package | Description |
|---------|-------------|
| [`chama-core`](./chama-core/) | NestJS REST API backend |
| [`chama-frontend`](./chama-frontend/) | React web application |

## Quick Start

```bash
# Install all workspace dependencies
pnpm install

# Start backend (port 5500)
pnpm --filter chama-core start:dev

# Start frontend (port 3000)
pnpm --filter chama-frontend start
```

See each package's README for detailed setup:

- [Backend README](./chama-core/README.md)
- [Frontend README](./chama-frontend/README.md)

## Tech Stack

- **Backend**: NestJS 10 · Prisma 6 · PostgreSQL · Firebase Admin SDK · Swagger
- **Frontend**: React 19 · React Router v7 · TanStack Query · Tailwind CSS · Firebase SDK

## Key Features

- Chama (group) creation and configuration
- Member management — invite links, join requests, governance roles
- Contribution tracking with payment status
- Expense tracking with approval workflow (PENDING → APPROVED/REJECTED)
- Role-based access control (governance roles + custom RBAC)
- Notifications system
- Dashboard with KPI stats and treasury charts
- Google OAuth + Email/Password authentication via Firebase

## Project Report

For a comprehensive deep-dive covering architecture, all features, known gaps, solved issues, and recommendations, see [PROJECT_REPORT.md](./PROJECT_REPORT.md).

## Requirements

- Node.js 18+
- pnpm
- PostgreSQL
- Firebase project (Email/Password + Google auth enabled)
- Firebase Admin SDK service account key (JSON)
