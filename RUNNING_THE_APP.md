# Running the Monorepo

This guide covers how to run the monorepo application, including the React web app, Expo mobile app, and Convex backend.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all apps (web, mobile, backend)
pnpm dev
```

That's it! The Turborepo TUI will show all running services. Use arrow keys to switch between outputs.

---

## Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Expo Go | Latest | App Store / Play Store |

### Optional (for native builds)

- **Xcode** - iOS Simulator (macOS only)
- **Android Studio** - Android Emulator

---

## Project Structure

```
monorepo/
├── apps/
│   ├── web/          # React + Vite (localhost:5173)
│   └── mobile/       # Expo + React Native
├── packages/
│   └── backend/      # Convex real-time backend
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## First-Time Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Convex Backend

```bash
cd packages/backend
pnpm dlx convex dev
```

This will:
1. Open browser for authentication
2. Create/select a Convex project
3. Generate types in `_generated/`
4. Output your deployment URL

**Copy the deployment URL** (looks like `https://xxx-xxx-xxx.convex.cloud`)

### 3. Configure Web App

Create `apps/web/.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Configure Mobile App

Edit `apps/mobile/app.json`, update the `extra.convexUrl`:

```json
{
  "expo": {
    "extra": {
      "convexUrl": "https://your-deployment.convex.cloud"
    }
  }
}
```

---

## Running the Apps

### All Apps Together

```bash
pnpm dev
```

Opens the Turborepo TUI showing:
- **@monorepo/web** - Vite dev server
- **@monorepo/mobile** - Expo with QR code
- **@monorepo/backend** - Convex dev server

Use arrow keys or mouse to switch between outputs.

### Individual Apps

```bash
# Web only
pnpm dev:web

# Mobile only
pnpm dev:mobile

# Backend only
pnpm dev:backend
```

### Specific Combinations

```bash
# Web + Backend
pnpm turbo run dev --filter=@monorepo/web --filter=@monorepo/backend

# Everything except mobile
pnpm turbo run dev --filter=!@monorepo/mobile
```

---

## Accessing the Apps

### Web App
- URL: http://localhost:5173
- Features: Task list with real-time sync

### Mobile App

**On Physical Device:**
1. Install **Expo Go** from App Store / Play Store
2. Run `pnpm dev` and select the mobile output
3. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

**On Simulator:**
```bash
cd apps/mobile

# iOS (macOS only)
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

### Backend Dashboard
- URL: https://dashboard.convex.dev
- View data, logs, and functions

---

## Available Commands

### Root Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps with TUI |
| `pnpm dev:web` | Start web app only |
| `pnpm dev:mobile` | Start mobile app only |
| `pnpm dev:backend` | Start Convex backend only |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm clean` | Clean build artifacts |

### Web App (`apps/web`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

### Mobile App (`apps/mobile`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Expo dev server |
| `pnpm ios` | Run on iOS Simulator |
| `pnpm android` | Run on Android Emulator |
| `pnpm web` | Run as web app |

### Backend (`packages/backend`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Convex dev server |
| `pnpm deploy` | Deploy to production |

---

## Real-Time Sync Demo

The app demonstrates real-time sync between web and mobile:

1. Start both apps: `pnpm dev`
2. Open web at http://localhost:5173
3. Open mobile via Expo Go
4. Add a task on either platform
5. Watch it appear instantly on both!

---

## Troubleshooting

### "Convex Not Configured"

The app shows a warning screen when Convex URL is missing.

**Fix:**
1. Run `cd packages/backend && pnpm dlx convex dev`
2. Copy the deployment URL
3. Add to `apps/web/.env.local` and `apps/mobile/app.json`

### Dependencies Not Found

```bash
# Clean reinstall
rm -rf node_modules **/node_modules pnpm-lock.yaml
pnpm install
```

### Metro Bundler Issues

```bash
cd apps/mobile

# Clear cache and restart
pnpm dlx expo start --clear
```

### Port Already in Use

```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9   # Web
lsof -ti:8081 | xargs kill -9   # Expo

# Or use different port
cd apps/web && PORT=3000 pnpm dev
```

### Expo Doctor

Run health check for mobile app:

```bash
cd apps/mobile
pnpm dlx expo-doctor
```

### TypeScript Errors After Schema Changes

1. Ensure Convex dev server is running
2. Save the schema file to trigger regeneration
3. Restart your IDE

---

## Development Tips

### Turborepo TUI

When running `pnpm dev`:
- **Arrow keys** / **Mouse**: Switch between task outputs
- **Ctrl+C**: Stop all tasks
- View logs for each service independently

### VS Code Multi-Root

Open the entire monorepo:
```bash
code .
```

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Expo Tools

### Environment Variables

| App | File | Prefix |
|-----|------|--------|
| Web | `.env.local` | `VITE_` |
| Mobile | `app.json` | N/A (use `extra`) |
| Backend | `.env.local` | N/A |

---

## Production Deployment

### Web (Vercel/Netlify)

```bash
cd apps/web
pnpm build
# Deploy dist/ folder
```

### Mobile (EAS Build)

```bash
cd apps/mobile
pnpm dlx eas build --platform all
```

### Backend (Convex)

```bash
cd packages/backend
pnpm dlx convex deploy
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK START                              │
├─────────────────────────────────────────────────────────────┤
│  1. pnpm install                                            │
│  2. cd packages/backend && pnpm dlx convex dev              │
│  3. Copy Convex URL to .env.local and app.json              │
│  4. pnpm dev                                                │
├─────────────────────────────────────────────────────────────┤
│  Web:    http://localhost:5173                              │
│  Mobile: Scan QR code in Expo Go                            │
│  Backend: https://dashboard.convex.dev                      │
└─────────────────────────────────────────────────────────────┘
```
