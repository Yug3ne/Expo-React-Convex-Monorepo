# Building a Monorepo from Scratch

A practical step-by-step guide to building a full-stack monorepo with React (web), Expo (mobile), and Convex (backend) using modern CLI tools.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Initialize Monorepo Root](#phase-1-initialize-monorepo-root)
3. [Phase 2: Configure Turborepo](#phase-2-configure-turborepo)
4. [Phase 3: Create Web App with Vite](#phase-3-create-web-app-with-vite)
5. [Phase 4: Create Mobile App with Expo](#phase-4-create-mobile-app-with-expo)
6. [Phase 5: Setup Convex Backend](#phase-5-setup-convex-backend)
7. [Phase 6: Connect Apps to Backend](#phase-6-connect-apps-to-backend)
8. [Phase 7: Final Configuration](#phase-7-final-configuration)

---

## Prerequisites

Make sure you have these installed:

```bash
# Check Node.js (v18+ required)
node --version

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify Bun
bun --version
```

---

## Phase 1: Initialize Monorepo Root

### Step 1.1: Create Project Directory

```bash
mkdir my-monorepo
cd my-monorepo
```

### Step 1.2: Initialize Root Package

```bash
bun init -y
```

### Step 1.3: Configure Root package.json

Edit `package.json` to set up workspaces:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:mobile": "turbo run dev --filter=mobile",
    "dev:backend": "turbo run dev --filter=backend",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  },
  "packageManager": "bun@1.1.42"
}
```

### Step 1.4: Create Directory Structure

```bash
mkdir -p apps
mkdir -p packages
```

### Step 1.5: Install Turbo

```bash
bun add -d turbo
```

### Step 1.6: Create .gitignore

```bash
echo "node_modules/
.turbo/
dist/
build/
.expo/
.env
.env.local
.env.*.local
.DS_Store" > .gitignore
```

---

## Phase 2: Configure Turborepo

### Step 2.1: Create turbo.json

Create `turbo.json` in the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", "**/.env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".expo/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Step 2.2: Create Base TypeScript Config

Create `tsconfig.base.json` in the root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist", "build", ".turbo"]
}
```

---

## Phase 3: Create Web App with Vite

### Step 3.1: Create React App

```bash
cd apps
bun create vite@latest web --template react-ts
cd web
```

### Step 3.2: Update package.json Name

Edit `apps/web/package.json` - update the name to match your monorepo scope:

```json
{
  "name": "@my-monorepo/web",
  ...
}
```

Or use a simple name that matches the turbo filter:

```json
{
  "name": "web",
  ...
}
```

### Step 3.3: Update tsconfig.json

Replace `apps/web/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Step 3.4: Return to Root

```bash
cd ../..
```

---

## Phase 4: Create Mobile App with Expo

### Step 4.1: Create Expo App

```bash
cd apps
bunx create-expo-app@latest mobile --template blank-typescript
cd mobile
```

Or with Expo Router (recommended):

```bash
cd apps
bunx create-expo-app@latest mobile --template tabs
cd mobile
```

### Step 4.2: Update package.json Name

Edit `apps/mobile/package.json`:

```json
{
  "name": "@my-monorepo/mobile",
  ...
}
```

Or simple:

```json
{
  "name": "mobile",
  ...
}
```

### Step 4.3: Configure Metro for Monorepo

Create or update `apps/mobile/metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in monorepo
config.watchFolders = [monorepoRoot];

// Resolve packages from both locations
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
```

### Step 4.4: Return to Root

```bash
cd ../..
```

---

## Phase 5: Setup Convex Backend

### Step 5.1: Create Backend Package Directory

```bash
mkdir -p packages/backend
cd packages/backend
```

### Step 5.2: Initialize Package

```bash
bun init -y
```

### Step 5.3: Update package.json

Edit `packages/backend/package.json`:

```json
{
  "name": "@my-monorepo/backend",
  "version": "0.0.1",
  "private": true,
  "main": "./convex/_generated/api.js",
  "types": "./convex/_generated/api.d.ts",
  "scripts": {
    "dev": "convex dev",
    "deploy": "convex deploy",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "convex": "^1.17.4"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

Or simple name:

```json
{
  "name": "backend",
  ...
}
```

### Step 5.4: Initialize Convex

```bash
bunx convex init
```

This creates the `convex/` folder with initial files.

### Step 5.5: Create Your Schema

Edit `packages/backend/convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Add your tables here
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  }),
});
```

### Step 5.6: Create Your First Functions

Create `packages/backend/convex/tasks.ts`:

```typescript
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});
```

### Step 5.7: Start Convex Dev Server

```bash
bunx convex dev
```

This will:

1. Open browser for authentication
2. Create/select a Convex project
3. Generate types in `_generated/`
4. Give you a deployment URL

**Save the deployment URL!**

### Step 5.8: Return to Root

```bash
cd ../..
```

---

## Phase 6: Connect Apps to Backend

### Step 6.1: Install Dependencies from Root

```bash
bun install
```

### Step 6.2: Add Backend Dependency to Web App

```bash
cd apps/web
bun add convex
bun add @my-monorepo/backend@workspace:*
```

Or if using simple names:

```bash
bun add backend@workspace:*
```

### Step 6.3: Add Backend Dependency to Mobile App

```bash
cd ../mobile
bun add convex
bun add @my-monorepo/backend@workspace:*
bun add react-native-get-random-values
```

### Step 6.4: Configure Web Environment

Create `apps/web/.env.local`:

```text
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Step 6.5: Configure Mobile Environment

Edit `apps/mobile/app.json` to add the Convex URL:

```json
{
  "expo": {
    "extra": {
      "convexUrl": "https://your-deployment.convex.cloud"
    }
  }
}
```

### Step 6.6: Setup Convex Provider in Web App

Update `apps/web/src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {convex ? (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    ) : (
      <div>Configure VITE_CONVEX_URL in .env.local</div>
    )}
  </StrictMode>
);
```

### Step 6.7: Setup Convex Provider in Mobile App

For Expo Router, update `apps/mobile/app/_layout.tsx`:

```tsx
import "../polyfills"; // Create this file
import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Constants from "expo-constants";
import { useMemo } from "react";

const convexUrl = Constants.expoConfig?.extra?.convexUrl;

export default function RootLayout() {
  const convex = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    return null; // Or show config message
  }

  return (
    <ConvexProvider client={convex}>
      <Stack />
    </ConvexProvider>
  );
}
```

Create `apps/mobile/polyfills.ts`:

```typescript
import "react-native-get-random-values";
```

### Step 6.8: Return to Root

```bash
cd ../..
```

---

## Phase 7: Final Configuration

### Step 7.1: Install All Dependencies

```bash
bun install
```

### Step 7.2: Verify Structure

Your monorepo should look like:

```text
my-monorepo/
├── apps/
│   ├── web/          # Created with bun create vite@latest
│   └── mobile/       # Created with bunx create-expo-app@latest
├── packages/
│   └── backend/      # Convex backend
├── package.json      # Root with workspaces
├── turbo.json        # Turborepo config
├── tsconfig.base.json
└── bun.lock
```

### Step 7.3: Run Everything

```bash
# Start all apps
bun run dev

# Or individually
bun run dev:backend
bun run dev:web
bun run dev:mobile
```

---

## Quick Reference

### Creating New Packages

**Shared utilities package:**

```bash
mkdir -p packages/shared
cd packages/shared
bun init -y
# Edit package.json with name "@my-monorepo/shared"
```

**Add as dependency:**

```bash
cd apps/web
bun add @my-monorepo/shared@workspace:*
```

### Common Commands

| Command                     | Description                           |
| --------------------------- | ------------------------------------- |
| `bun install`               | Install all workspace dependencies    |
| `bun run dev`               | Start all apps with Turborepo         |
| `bun add -d <pkg>`          | Add dev dependency to current package |
| `bun add <pkg>@workspace:*` | Add workspace package as dependency   |

### Useful CLI Tools

| Tool               | Command                                             |
| ------------------ | --------------------------------------------------- |
| Create Vite app    | `bun create vite@latest <name> --template react-ts` |
| Create Expo app    | `bunx create-expo-app@latest <name>`                |
| Create Next.js app | `bunx create-next-app@latest <name>`                |
| Init Convex        | `bunx convex init`                                  |
| Init Prisma        | `bunx prisma init`                                  |

---

## Tips

1. **Workspace dependencies**: Always use `workspace:*` when adding internal packages
2. **Package names**: Use scoped names (`@my-monorepo/web`) or simple names (`web`) - just be consistent
3. **Turbo filters**: Match the `name` field in package.json for `--filter` to work
4. **Metro config**: Essential for React Native to resolve monorepo packages
5. **Root installs**: Run `bun install` from root to link all workspaces
