# Running the App - Comprehensive Guide

This guide covers everything you need to know to run the monorepo application, including the web app, mobile app, and backend services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running the Backend (Convex)](#running-the-backend-convex)
4. [Running the Web App](#running-the-web-app)
5. [Running the Mobile App](#running-the-mobile-app)
6. [Running Everything Together](#running-everything-together)
7. [Available Scripts](#available-scripts)
8. [Environment Configuration](#environment-configuration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Tool | Minimum Version | Installation |
|------|-----------------|--------------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **Bun** | v1.1.42+ | [bun.sh](https://bun.sh) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

### For Mobile Development

| Tool | Platform | Installation |
|------|----------|--------------|
| **Expo Go** | iOS/Android | App Store / Play Store |
| **Xcode** | macOS (iOS dev) | Mac App Store |
| **Android Studio** | All platforms | [developer.android.com](https://developer.android.com/studio) |

### Optional but Recommended

- **VS Code** or **Cursor** - For the best development experience
- **Convex Dashboard** - Sign up at [convex.dev](https://convex.dev) for backend management

---

## Initial Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd monorepo

# Install all dependencies using Bun
bun install
```

This single command installs dependencies for:
- Root workspace
- `apps/web` - React web application
- `apps/mobile` - Expo mobile application
- `packages/backend` - Convex backend
- `packages/shared` - Shared utilities

### Step 2: Verify Installation

```bash
# Check that Turborepo is available
bunx turbo --version

# Check Bun version
bun --version
```

---

## Running the Backend (Convex)

The backend uses **Convex** - a real-time backend-as-a-service. You need to set this up first.

### First-Time Setup

```bash
# Navigate to the backend package
cd packages/backend

# Start Convex development server
# This will prompt you to log in and create a project
bunx convex dev
```

On first run, Convex will:
1. Open a browser for authentication
2. Ask you to create or select a project
3. Generate API types automatically
4. Start watching for schema changes

### Get Your Convex URL

After setup, you'll receive a deployment URL like:
```
https://your-project-name-123.convex.cloud
```

**Save this URL** - you'll need it for the web and mobile apps.

### Running Convex in the Background

For continuous development:

```bash
# From the monorepo root
bun run dev:backend
```

Or use Turborepo to run it alongside other services (see [Running Everything Together](#running-everything-together)).

---

## Running the Web App

### Step 1: Configure Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
cd apps/web
touch .env.local
```

Add your Convex URL:

```env
VITE_CONVEX_URL=https://your-project-name-123.convex.cloud
```

### Step 2: Start the Development Server

```bash
# Option 1: From the web app directory
cd apps/web
bun run dev

# Option 2: From the monorepo root using Turborepo
bun run dev:web
```

### Step 3: Access the App

Open your browser and navigate to:
```
http://localhost:3000
```

### What You Should See

- A "Synced Tasks" header
- A task input form
- A real-time task list
- Loading state if Convex is connecting

### If Convex is Not Configured

You'll see a helpful message:
> ⚠️ Convex Not Configured
> To get started, run `npx convex dev` in the `packages/backend` directory...

---

## Running the Mobile App

### Step 1: Configure Convex URL

Edit `apps/mobile/app.json` and update the `convexUrl`:

```json
{
  "expo": {
    "extra": {
      "convexUrl": "https://your-project-name-123.convex.cloud"
    }
  }
}
```

### Step 2: Start the Expo Development Server

```bash
# Option 1: From the mobile app directory
cd apps/mobile
bun run dev

# Option 2: From the monorepo root
bun run dev:mobile
```

### Step 3: Run on Your Device/Simulator

After starting the dev server, you'll see a QR code in the terminal.

#### On Physical Device (Recommended for Testing)
1. Install **Expo Go** from App Store / Play Store
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### On iOS Simulator (macOS only)
```bash
# In the mobile app directory
bun run ios
```

#### On Android Emulator
```bash
# In the mobile app directory
bun run android
```

### What You Should See

- Home screen with "Monorepo Mobile" title
- A counter button
- Monorepo structure information
- "Go to Tabs" navigation button
- Tasks screen with real-time sync

---

## Running Everything Together

The most efficient way to develop is running all services simultaneously using Turborepo.

### Run All Services

```bash
# From the monorepo root
bun run dev
```

This command starts:
- ✅ Convex backend (`packages/backend`)
- ✅ Web app at `http://localhost:3000` (`apps/web`)
- ✅ Mobile app with Expo (`apps/mobile`)

### Run Specific Combinations

```bash
# Backend + Web only
bun run dev:backend & bun run dev:web

# Backend + Mobile only
bun run dev:backend & bun run dev:mobile
```

### Terminal Management Tips

**Using multiple terminals:**
1. Terminal 1: `bun run dev:backend`
2. Terminal 2: `bun run dev:web`
3. Terminal 3: `bun run dev:mobile`

**Using a terminal multiplexer (tmux):**
```bash
tmux new-session -d -s dev 'bun run dev:backend'
tmux split-window -h 'bun run dev:web'
tmux split-window -v 'bun run dev:mobile'
tmux attach -t dev
```

---

## Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run dev:web` | Start only the web app |
| `bun run dev:mobile` | Start only the mobile app |
| `bun run dev:backend` | Start only the Convex backend |
| `bun run build` | Build all apps for production |
| `bun run lint` | Lint all packages |
| `bun run typecheck` | Type-check all packages |
| `bun run clean` | Clean all build artifacts |

### Web App Commands (`apps/web`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

### Mobile App Commands (`apps/mobile`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Expo dev server |
| `bun run ios` | Run on iOS simulator |
| `bun run android` | Run on Android emulator |
| `bun run web` | Run as web app |
| `bun run build` | Export for production |

### Backend Commands (`packages/backend`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Convex dev server |
| `bun run deploy` | Deploy to production |
| `bun run typecheck` | Type-check backend code |

---

## Environment Configuration

### Web App Environment Variables

Create `apps/web/.env.local`:

```env
# Required
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Optional - for production builds
VITE_APP_URL=https://your-app-url.com
```

### Mobile App Configuration

Edit `apps/mobile/app.json`:

```json
{
  "expo": {
    "extra": {
      "convexUrl": "https://your-deployment.convex.cloud"
    }
  }
}
```

### Convex Configuration

The Convex backend automatically manages its own configuration. After running `convex dev`, it creates:
- `packages/backend/convex/_generated/` - Auto-generated types and API
- `.env.local` in backend directory - Local deployment URL

---

## Troubleshooting

### Common Issues

#### "Convex Not Configured" Error

**Problem:** The app shows a configuration warning.

**Solution:**
1. Ensure Convex is running: `cd packages/backend && bunx convex dev`
2. Copy your Convex URL from the terminal
3. Add it to the appropriate config file (see [Environment Configuration](#environment-configuration))

#### Dependencies Not Found

**Problem:** Module not found errors.

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules
rm bun.lock
bun install
```

#### Metro Bundler Issues (Mobile)

**Problem:** Metro bundler can't resolve packages.

**Solution:**
```bash
cd apps/mobile
bun run dev --clear
```

Or reset the cache:
```bash
bunx expo start --clear
```

#### Port Already in Use

**Problem:** "Port 3000 is already in use"

**Solution:**
```bash
# Kill the process using the port
lsof -ti:3000 | xargs kill -9

# Or use a different port
cd apps/web
PORT=3001 bun run dev
```

#### TypeScript Errors After Schema Changes

**Problem:** Types are out of sync after changing Convex schema.

**Solution:**
1. Ensure Convex dev server is running
2. Save the schema file to trigger regeneration
3. Restart your IDE/editor

### Getting Help

- **Convex Issues:** [docs.convex.dev](https://docs.convex.dev)
- **Expo Issues:** [docs.expo.dev](https://docs.expo.dev)
- **Turborepo Issues:** [turbo.build/repo/docs](https://turbo.build/repo/docs)

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK START                              │
├─────────────────────────────────────────────────────────────┤
│  1. bun install                  # Install dependencies     │
│  2. cd packages/backend          # Setup Convex             │
│  3. bunx convex dev              # Start backend            │
│  4. Update .env.local & app.json # Add Convex URL           │
│  5. bun run dev                  # Run everything           │
├─────────────────────────────────────────────────────────────┤
│  Web:    http://localhost:3000                              │
│  Mobile: Scan QR code with Expo Go                          │
└─────────────────────────────────────────────────────────────┘
```
