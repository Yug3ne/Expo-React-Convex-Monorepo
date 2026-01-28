# Building a Monorepo from Scratch with pnpm

A comprehensive guide to building modern full-stack monorepos using **pnpm workspaces** and **Turborepo**. This guide covers general patterns and best practices applicable to any monorepo project.

## Table of Contents

1. [Why pnpm + Turborepo?](#why-pnpm--turborepo)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Initialize Monorepo Root](#phase-1-initialize-monorepo-root)
4. [Phase 2: Configure Turborepo](#phase-2-configure-turborepo)
5. [Phase 3: Add Applications](#phase-3-add-applications)
6. [Phase 4: Add Shared Packages](#phase-4-add-shared-packages)
7. [Phase 5: Cross-Package Dependencies](#phase-5-cross-package-dependencies)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Why pnpm + Turborepo?

### pnpm Advantages

- **Disk efficiency**: Uses a content-addressable store, packages are stored once globally and hard-linked
- **Strict dependency resolution**: Prevents phantom dependencies (accessing packages not explicitly declared)
- **Fast installs**: Significantly faster than npm/yarn due to linking strategy
- **Built-in workspace support**: First-class monorepo support with `pnpm-workspace.yaml`

### Turborepo Advantages

- **Task orchestration**: Run tasks across packages with proper dependency ordering
- **Caching**: Local and remote caching for build artifacts
- **Parallelization**: Runs independent tasks concurrently
- **Incremental builds**: Only rebuilds what changed

---

## Prerequisites

```bash
# Node.js v18+ required
node --version

# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version  # Should be 9.x+
```

---

## Phase 1: Initialize Monorepo Root

### Step 1.1: Create Project Structure

```bash
mkdir my-monorepo
cd my-monorepo

# Create directory structure
mkdir -p apps packages
```

### Step 1.2: Initialize Root package.json

```bash
pnpm init
```

Edit `package.json`:

```json
{
  "name": "my-monorepo",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  }
}
```

> **Note**: The `packageManager` field enables Corepack and ensures consistent pnpm versions across the team.

### Step 1.3: Create pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

This tells pnpm which directories contain workspace packages.

### Step 1.4: Install Turborepo

```bash
pnpm add -D turbo
```

### Step 1.5: Create .gitignore

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/
.next/
.expo/

# Turborepo
.turbo/

# Environment
.env
.env.local
.env.*.local

# Lock files (keep only pnpm)
package-lock.json
yarn.lock
bun.lockb

# OS
.DS_Store

# IDE
.idea/
.vscode/
*.swp
```

### Step 1.6: Create .npmrc (Recommended)

```ini
# Hoist packages to root for better compatibility
shamefully-hoist=true

# Auto-install peers
auto-install-peers=true

# Strict peer dependencies
strict-peer-dependencies=false
```

> **Note**: `shamefully-hoist=true` is often needed for tools like React Native/Expo that expect packages at the root level.

---

## Phase 2: Configure Turborepo

### Step 2.1: Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": ["**/.env.*local", "**/.env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".expo/**", "build/**"]
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
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Key settings explained:**

| Setting | Purpose |
|---------|---------|
| `"ui": "tui"` | Enables Terminal UI for interactive output (QR codes, logs per task) |
| `"dependsOn": ["^build"]` | Build dependencies first (^ means upstream packages) |
| `"persistent": true` | Task runs indefinitely (for dev servers) |
| `"cache": false` | Don't cache this task's output |
| `"outputs"` | Files to cache for incremental builds |

### Step 2.2: Create Shared TypeScript Config

Create `tsconfig.base.json` in root:

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
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true
  },
  "exclude": ["node_modules", "dist", "build", ".turbo"]
}
```

Packages extend this config:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

---

## Phase 3: Add Applications

### Option A: React Web App (Vite)

```bash
cd apps
pnpm create vite@latest web --template react-ts
```

Update `apps/web/package.json`:

```json
{
  "name": "@my-monorepo/web",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

### Option B: React Native / Expo App

```bash
cd apps
pnpm dlx create-expo-app@latest mobile --template tabs
```

Update `apps/mobile/package.json`:

```json
{
  "name": "@my-monorepo/mobile",
  "private": true,
  "scripts": {
    "dev": "expo start",
    "build": "expo export",
    "typecheck": "tsc --noEmit"
  }
}
```

**Configure Metro for monorepo** (`apps/mobile/metro.config.js`):

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

### Option C: Next.js App

```bash
cd apps
pnpm dlx create-next-app@latest dashboard --typescript --tailwind --app
```

### Option D: Node.js API

```bash
mkdir -p apps/api
cd apps/api
pnpm init
```

```json
{
  "name": "@my-monorepo/api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## Phase 4: Add Shared Packages

### Create a Shared Utilities Package

```bash
mkdir -p packages/shared
cd packages/shared
pnpm init
```

`packages/shared/package.json`:

```json
{
  "name": "@my-monorepo/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

### Create UI Component Library

```bash
mkdir -p packages/ui
cd packages/ui
pnpm init
pnpm add react react-dom
pnpm add -D typescript @types/react
```

`packages/ui/package.json`:

```json
{
  "name": "@my-monorepo/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button.js",
      "types": "./dist/button.d.ts"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## Phase 5: Cross-Package Dependencies

### Add Workspace Package as Dependency

```bash
# From the app that needs the dependency
cd apps/web
pnpm add @my-monorepo/shared@workspace:*
pnpm add @my-monorepo/ui@workspace:*
```

This adds to `package.json`:

```json
{
  "dependencies": {
    "@my-monorepo/shared": "workspace:*",
    "@my-monorepo/ui": "workspace:*"
  }
}
```

### Import in Code

```typescript
// apps/web/src/App.tsx
import { formatDate, capitalize } from "@my-monorepo/shared";
import { Button } from "@my-monorepo/ui";
```

### Dependency Graph

Turborepo automatically understands the dependency graph:

```
apps/web
  └── @my-monorepo/shared
  └── @my-monorepo/ui
        └── @my-monorepo/shared

apps/mobile
  └── @my-monorepo/shared
```

When you run `pnpm build`, Turborepo builds in the correct order.

---

## Common Patterns

### Filtering Tasks by Package

```bash
# Run dev for specific package
pnpm --filter @my-monorepo/web dev

# Run build for package and its dependencies
pnpm --filter @my-monorepo/web... build

# Run in all packages matching pattern
pnpm --filter "./apps/*" build
```

### Turbo Filters

```bash
# Same filters work with turbo
pnpm turbo run build --filter=@my-monorepo/web
pnpm turbo run dev --filter=./apps/*
```

### Adding Scripts to Root

Common root scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=@my-monorepo/web",
    "dev:mobile": "turbo run dev --filter=@my-monorepo/mobile",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### Dependency Overrides

Force specific versions across all packages in root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "react": "19.1.0",
      "react-dom": "19.1.0",
      "typescript": "^5.7.2"
    }
  }
}
```

### Environment Variables

Each app can have its own `.env.local`:

```
apps/
  web/.env.local          # VITE_API_URL=...
  mobile/.env.local       # EXPO_PUBLIC_API_URL=...
packages/
  api/.env.local          # DATABASE_URL=...
```

Turborepo watches these via `globalDependencies`.

---

## Troubleshooting

### "Module not found" Errors

**Problem**: Package can't find workspace dependency.

**Solutions**:

```bash
# Reinstall all dependencies
pnpm install

# Clear caches and reinstall
rm -rf node_modules **/node_modules pnpm-lock.yaml
pnpm install
```

### Phantom Dependencies

**Problem**: Code imports a package not in `package.json` but it works locally.

**Solution**: pnpm's strict mode catches this. Add the missing dependency:

```bash
pnpm add missing-package
```

### TypeScript Can't Find Types

**Problem**: "Cannot find module '@my-monorepo/shared'"

**Solutions**:

1. Ensure the package is built: `pnpm --filter @my-monorepo/shared build`
2. Check `exports` in the package's `package.json`
3. Add path mapping in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@my-monorepo/*": ["./packages/*/src"]
    }
  }
}
```

### Metro Bundler Issues (React Native)

**Problem**: Metro can't resolve monorepo packages.

**Solutions**:

1. Ensure `metro.config.js` has `watchFolders` pointing to monorepo root
2. Clear Metro cache: `pnpm dlx expo start --clear`
3. Use `shamefully-hoist=true` in `.npmrc`

### Turbo Cache Issues

**Problem**: Changes not reflected after build.

**Solution**:

```bash
# Clear turbo cache
rm -rf .turbo
pnpm turbo run build --force
```

### Peer Dependency Warnings

**Problem**: Unmet peer dependency warnings.

**Solution**: Add to `.npmrc`:

```ini
auto-install-peers=true
strict-peer-dependencies=false
```

Or explicitly install the peer:

```bash
pnpm add react@^19.0.0
```

---

## Project Structure Reference

```
my-monorepo/
├── apps/
│   ├── web/                 # React (Vite)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── mobile/              # React Native (Expo)
│   │   ├── app/
│   │   ├── package.json
│   │   └── metro.config.js
│   └── api/                 # Node.js API
│       ├── src/
│       └── package.json
├── packages/
│   ├── shared/              # Shared utilities
│   │   ├── src/
│   │   └── package.json
│   ├── ui/                  # Component library
│   │   ├── src/
│   │   └── package.json
│   └── config/              # Shared configs (eslint, tsconfig)
│       └── package.json
├── package.json             # Root package
├── pnpm-workspace.yaml      # Workspace config
├── pnpm-lock.yaml           # Lock file
├── turbo.json               # Turborepo config
├── tsconfig.base.json       # Shared TS config
├── .npmrc                   # pnpm config
└── .gitignore
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all packages |
| `pnpm --filter <pkg> <cmd>` | Run command in specific package |
| `pnpm add <dep>` | Add dependency to current package |
| `pnpm add <dep> -w` | Add dependency to root |
| `pnpm add <pkg>@workspace:*` | Add workspace package as dependency |
| `pnpm dlx <cmd>` | Execute package without installing |
| `pnpm turbo run <task> --force` | Run ignoring cache |

---

## Resources

- [pnpm Documentation](https://pnpm.io)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo + pnpm Guide](https://turbo.build/repo/docs/getting-started/create-new#pnpm)
