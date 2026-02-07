# ChamaPlus Backend (chama-core)

A modern NestJS-based backend API for ChamaPlus - a savings group (Chama) management platform built for Kenyan savings groups with M-Pesa integration.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Installation |
|------|---------|--------------|
| **Node.js** | v18+ | [Download](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **PostgreSQL** | v14+ | `brew install postgresql@14` (macOS) |
| **Firebase Account** | - | [Firebase Console](https://console.firebase.google.com/) |

## Quick Start

```bash
# 1. Clone the repository (if not already done)
cd chama/chama-core

# 2. Install dependencies
npm install

# 3. Set up PostgreSQL database (see Database Setup section)

# 4. Configure environment variables (see Environment Configuration)

# 5. Run database migrations
npx prisma migrate dev

# 6. Start the development server
npm run start:dev
```

The API will be available at `http://localhost:5500/api/v1`

## Database Setup

### Option 1: Local PostgreSQL (Recommended for Development)

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create a PostgreSQL user
createuser -s your_username

# Set password for the user
psql postgres -c "ALTER USER your_username WITH PASSWORD 'your_password';"

# Create the database
createdb chama_db -O your_username
```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql
```

```sql
-- In PostgreSQL shell
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE chama_db OWNER your_username;
GRANT ALL PRIVILEGES ON DATABASE chama_db TO your_username;
\q
```

### Option 2: Docker (Alternative)

```bash
# Start PostgreSQL with Docker
docker run --name chama_postgres \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=chama_db \
  -p 5432:5432 \
  -d postgres:14
```

### Verify Database Connection

```bash
psql -h localhost -U your_username -d chama_db -c "SELECT 1"
```

## Environment Configuration

Create a `.env` file in the `chama-core` directory:

```bash
# Copy the example (or create new)
cp .env.example .env
```

### Required Environment Variables

```env
# ==================== DATABASE ====================
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/chama_db?schema=public"

# ==================== SERVER ====================
PORT=5500

# ==================== FIREBASE (Authentication) ====================
FIREBASE_API_KEY="your_firebase_api_key"
FIREBASE_KEY_PATH=./chama-b57f4-firebase-adminsdk-fbsvc-xxxxxxxx.json

# ==================== EMAIL (Brevo/Sendinblue) ====================
BREVO_API_KEY=your_brevo_api_key
EMAIL_SENDER_ADDRESS=your_email@example.com
EMAIL_SENDER_NAME=ChamaPlus

# ==================== FRONTEND ====================
FRONTEND_URL=http://localhost:3000
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Save the JSON file to `chama-core/` directory
6. Update `FIREBASE_KEY_PATH` in `.env` with the filename

## Running the Application

### Development Mode (with hot-reload)

```bash
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Database Migrations

```bash
# Apply pending migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

## API Documentation

Once the server is running, access the Swagger API documentation at:

**`http://localhost:5500/api`**

### Main API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | Register new user |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/chama` | GET | Get user's chamas |
| `/api/v1/chama` | POST | Create new chama |
| `/api/v1/chama/available` | GET | Browse available chamas |
| `/api/v1/invites` | POST | Create invite |
| `/api/v1/invites/accept` | POST | Accept invite |
| `/api/v1/transactions` | GET/POST | Manage transactions |

## Project Structure

```
chama-core/
├── src/
│   ├── auth/           # Authentication module
│   ├── chama/          # Chama management module
│   ├── user/           # User management module
│   ├── invite/         # Invitation system
│   ├── transaction/    # Financial transactions
│   ├── email/          # Email service (Brevo)
│   └── prisma/         # Prisma database service
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── test/               # Test files
└── .env                # Environment variables
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: Can't reach database server at `localhost:5432`
```
**Solution:** Start PostgreSQL service
```bash
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

#### 2. Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```
**Solution:** Generate Prisma client
```bash
npx prisma generate
```

#### 3. Firebase Initialization Error
```
Error: Firebase initialization failed
```
**Solution:** Verify `FIREBASE_KEY_PATH` points to valid service account JSON file

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5500
```
**Solution:** Kill the process using the port
```bash
lsof -ti:5500 | xargs kill -9
```

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm run start` | Start production server |
| `start:dev` | `npm run start:dev` | Start with hot-reload |
| `build` | `npm run build` | Build for production |
| `test` | `npm run test` | Run unit tests |
| `lint` | `npm run lint` | Run ESLint |
| `format` | `npm run format` | Format with Prettier |

## License

MIT License - see [LICENSE](LICENSE) for details.
