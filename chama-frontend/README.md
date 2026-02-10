# ChamaPlus Frontend

A modern React-based web application for ChamaPlus - a savings group (Chama) management platform built for Kenyan savings groups with M-Pesa integration.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following:

| Tool            | Version | Installation                                     |
| --------------- | ------- | ------------------------------------------------ |
| **Node.js**     | v18+    | [Download](https://nodejs.org/)                  |
| **npm**         | v9+     | Comes with Node.js                               |
| **Backend API** | Running | See [chama-core README](../chama-core/README.md) |

## Quick Start

```bash
# 1. Navigate to frontend directory
cd chama/chama-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (see Environment Configuration)

# 4. Ensure backend is running on port 5500

# 5. Start the development server
npm start
```

The app will be available at `http://localhost:3000`

## Environment Configuration

Create a `.env` file in the `chama-frontend` directory:

```env
# ==================== API Configuration ====================
REACT_APP_API_URL=http://localhost:5500/api/v1

# ==================== Firebase (for client-side auth) ====================
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

> **Note:** Environment variables in React must be prefixed with `REACT_APP_`

## Running the Application

### Development Mode

```bash
npm start
```

Opens `http://localhost:3000` with hot-reload enabled.

### Production Build

```bash
# Build for production
npm run build

# Serve the build locally (optional)
npx serve -s build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
chama-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── guards/         # Route guards (Auth, Dashboard, Onboarding)
│   │   ├── ui/             # UI primitives (Button, Card, Input, etc.)
│   │   └── navbars/        # Navigation components
│   ├── config/             # Configuration (axios, etc.)
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Layout components (Admin, Member)
│   ├── models/             # TypeScript interfaces
│   ├── pages/              # Page components
│   │   ├── onboarding/     # Onboarding pages
│   │   └── ...             # Other pages
│   ├── routes/             # Route configuration
│   ├── services/           # API services
│   │   ├── auth/           # Authentication services
│   │   └── chama/          # Chama services
│   ├── styles/             # Global styles and theme
│   └── utils/              # Utility functions
└── package.json
```

## Key Features

### Authentication Flow

- **Sign Up** → Creates account → Redirects to Chama Choice
- **Sign In** → Authenticates → Redirects based on chama membership

### Route Structure

| Route                      | Access | Description              |
| -------------------------- | ------ | ------------------------ |
| `/`                        | Public | Landing page             |
| `/auth/signin`             | Public | Sign in page             |
| `/auth/signup`             | Public | Sign up page             |
| `/onboarding/chama-choice` | Auth   | Choose/create/join chama |
| `/onboarding/create-chama` | Auth   | Create new chama         |
| `/admin/chamas/:id/*`      | Admin  | Admin dashboard routes   |
| `/member/chamas/:id/*`     | Member | Member dashboard routes  |

### Route Guards

| Guard             | Purpose                                |
| ----------------- | -------------------------------------- |
| `AuthGuard`       | Requires authentication                |
| `OnboardingGuard` | Requires auth + handles chama redirect |
| `DashboardGuard`  | Requires auth + chama + correct role   |

## Connecting to Backend

Ensure the backend is running before starting the frontend:

```bash
# Terminal 1: Start backend (in chama-core directory)
cd chama-core
npm run start:dev

# Terminal 2: Start frontend (in chama-frontend directory)
cd chama-frontend
npm start
```

The frontend expects the backend API at `http://localhost:5500/api/v1`

## Troubleshooting

### Common Issues

#### 1. API Connection Error

```
Error: Network Error / CORS Error
```

**Solutions:**

- Ensure backend is running on port 5500
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS is enabled on backend

#### 2. Authentication Issues

```
401 Unauthorized on API calls
```

**Solutions:**

- Clear localStorage: `localStorage.clear()`
- Sign in again
- Check if authToken is being saved correctly

#### 3. Blank Page After Login

```
User stuck on login page after successful login
```

**Solution:** Clear localStorage and try again

```javascript
// In browser console
localStorage.clear();
```

#### 4. Port Already in Use

```
Error: Something is already running on port 3000
```

**Solution:** Kill the process or use different port

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

#### 5. Module Not Found Errors

```
Module not found: Can't resolve '...'
```

**Solution:** Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

## Scripts Reference

| Script  | Command         | Description      |
| ------- | --------------- | ---------------- |
| `start` | `npm start`     | Start dev server |
| `build` | `npm run build` | Production build |
| `test`  | `npm test`      | Run tests        |
| `eject` | `npm run eject` | Eject CRA config |

## Tech Stack

- **React** 18.x with TypeScript
- **React Router** v6 for routing
- **Axios** for API calls
- **TailwindCSS** (via custom theme) for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Development Tips

1. **State Management:** Use `ChamaMembershipContext` for user/chama state
2. **API Calls:** Use services in `src/services/` for API interactions
3. **Styling:** Use theme CSS variables defined in `src/styles/theme.css`
4. **Components:** Prefer using UI components from `src/components/ui/`

## License

MIT License - see [LICENSE](LICENSE) for details.
