# Building a Monorepo from Scratch

A comprehensive step-by-step guide to building a full-stack monorepo with React (web), Expo (mobile), and Convex (backend) - exactly like this project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Project Setup](#phase-1-project-setup)
3. [Phase 2: Configure Turborepo](#phase-2-configure-turborepo)
4. [Phase 3: Create Shared Package](#phase-3-create-shared-package)
5. [Phase 4: Setup Convex Backend](#phase-4-setup-convex-backend)
6. [Phase 5: Create Web App](#phase-5-create-web-app)
7. [Phase 6: Create Mobile App](#phase-6-create-mobile-app)
8. [Phase 7: Connect Everything](#phase-7-connect-everything)
9. [Phase 8: Add Real Features](#phase-8-add-real-features)
10. [Phase 9: Polish and Best Practices](#phase-9-polish-and-best-practices)
11. [Reference Files](#reference-files)

---

## Prerequisites

Make sure you have these installed before starting:

```bash
# Check Node.js (v18+ required)
node --version

# Install Bun (our package manager)
curl -fsSL https://bun.sh/install | bash

# Verify Bun installation
bun --version
```

**Tools we'll use:**
- **Bun** - Fast JavaScript runtime and package manager
- **Turborepo** - Monorepo build system
- **Vite** - Web app bundler
- **Expo** - Mobile app framework
- **Convex** - Real-time backend

---

## Phase 1: Project Setup

### Step 1.1: Create Project Directory

```bash
# Create and enter project folder
mkdir my-monorepo
cd my-monorepo
```

### Step 1.2: Initialize Root Package

```bash
# Initialize with Bun
bun init -y
```

### Step 1.3: Configure Root package.json

Replace the contents of `package.json`:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=@my-monorepo/web",
    "dev:mobile": "turbo run dev --filter=@my-monorepo/mobile",
    "dev:backend": "turbo run dev --filter=@my-monorepo/backend",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "bun@1.1.42"
}
```

**What this does:**
- `workspaces` - Tells Bun where to find our packages
- `scripts` - Defines commands that run across all packages
- `turbo` - Build orchestration tool

### Step 1.4: Create Directory Structure

```bash
# Create all directories
mkdir -p apps/web/src
mkdir -p apps/mobile/app
mkdir -p packages/backend/convex
mkdir -p packages/shared/src
```

Your structure should now look like:
```
my-monorepo/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── backend/
│   └── shared/
└── package.json
```

### Step 1.5: Create .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
build/
.expo/
.turbo/

# Environment files
.env
.env.local
.env.*.local

# OS files
.DS_Store

# IDE
.vscode/
.idea/

# Lock files (keep bun.lock)
package-lock.json
yarn.lock
EOF
```

### Step 1.6: Install Root Dependencies

```bash
bun add -d turbo typescript
```

---

## Phase 2: Configure Turborepo

### Step 2.1: Create turbo.json

```bash
cat > turbo.json << 'EOF'
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
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
```

**Key concepts:**
- `dependsOn: ["^build"]` - Build dependencies first
- `cache: false` - Don't cache dev server
- `persistent: true` - Keep running (for dev servers)

### Step 2.2: Create Base TypeScript Config

```bash
cat > tsconfig.base.json << 'EOF'
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
    "incremental": true
  },
  "exclude": ["node_modules", "dist", "build", ".turbo"]
}
EOF
```

---

## Phase 3: Create Shared Package

### Step 3.1: Create package.json

```bash
cat > packages/shared/package.json << 'EOF'
{
  "name": "@my-monorepo/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
EOF
```

### Step 3.2: Create tsconfig.json

```bash
cat > packages/shared/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF
```

### Step 3.3: Create Source Files

**Constants:**
```bash
cat > packages/shared/src/constants.ts << 'EOF'
export const APP_NAME = 'My Monorepo App';

export const THEME = {
  colors: {
    background: '#0a0a0f',
    surface: '#12121a',
    border: '#1e1e2e',
    text: '#e4e4ed',
    textMuted: '#8888a0',
    accent: '#ff6b35',
    success: '#10b981',
    error: '#ef4444',
  },
} as const;
EOF
```

**Types:**
```bash
cat > packages/shared/src/types.ts << 'EOF'
export interface Task {
  _id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
EOF
```

**Utilities:**
```bash
cat > packages/shared/src/utils.ts << 'EOF'
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}
EOF
```

**Main export:**
```bash
cat > packages/shared/src/index.ts << 'EOF'
export * from './constants';
export * from './types';
export * from './utils';
EOF
```

---

## Phase 4: Setup Convex Backend

### Step 4.1: Create Backend package.json

```bash
cat > packages/backend/package.json << 'EOF'
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
EOF
```

### Step 4.2: Create Backend tsconfig.json

```bash
cat > packages/backend/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["convex/**/*"]
}
EOF
```

### Step 4.3: Create Database Schema

```bash
cat > packages/backend/convex/schema.ts << 'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  }).index("by_completed", ["isCompleted"]),
});
EOF
```

### Step 4.4: Create Tasks Functions

```bash
cat > packages/backend/convex/tasks.ts << 'EOF'
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all tasks
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

// Create a task
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

// Toggle task completion
export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(args.id, { isCompleted: !task.isCompleted });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
EOF
```

### Step 4.5: Create Convex Config

```bash
cat > packages/backend/convex/convex.config.ts << 'EOF'
import { defineApp } from "convex/server";

const app = defineApp();

export default app;
EOF
```

### Step 4.6: Create Backend .gitignore

```bash
cat > packages/backend/.gitignore << 'EOF'
.env.local
EOF
```

### Step 4.7: Initialize Convex

```bash
cd packages/backend
bunx convex dev
```

This will:
1. Open your browser to log in
2. Create a new project (or select existing)
3. Generate `_generated/` folder with types
4. Start watching for changes

**Save the Convex URL** - you'll need it later!

Press `Ctrl+C` to stop after initial setup.

---

## Phase 5: Create Web App

### Step 5.1: Create Web package.json

```bash
cat > apps/web/package.json << 'EOF'
{
  "name": "@my-monorepo/web",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "convex": "^1.17.4",
    "@my-monorepo/backend": "workspace:*",
    "@my-monorepo/shared": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
EOF
```

### Step 5.2: Create Web tsconfig.json

```bash
cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF
```

### Step 5.3: Create Vite Config

```bash
cat > apps/web/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
EOF
```

### Step 5.4: Create HTML Entry

```bash
cat > apps/web/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Monorepo - Web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
```

### Step 5.5: Create Main Entry Point

```bash
cat > apps/web/src/main.tsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

function Root() {
  if (!convex) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>⚠️ Convex Not Configured</h1>
        <p>Add VITE_CONVEX_URL to .env.local</p>
      </div>
    )
  }

  return (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
EOF
```

### Step 5.6: Create App Component

```bash
cat > apps/web/src/App.tsx << 'EOF'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@my-monorepo/backend'
import './App.css'

function App() {
  const [newTask, setNewTask] = useState('')
  
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)
  const toggleTask = useMutation(api.tasks.toggle)
  const removeTask = useMutation(api.tasks.remove)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await createTask({ text: newTask.trim() })
    setNewTask('')
  }

  return (
    <div className="app">
      <h1>Synced Tasks</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add</button>
      </form>

      {tasks === undefined ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className={task.isCompleted ? 'completed' : ''}>
              <button onClick={() => toggleTask({ id: task._id })}>
                {task.isCompleted ? '✓' : '○'}
              </button>
              <span>{task.text}</span>
              <button onClick={() => removeTask({ id: task._id })}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
EOF
```

### Step 5.7: Create Styles

```bash
cat > apps/web/src/index.css << 'EOF'
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a0f;
  color: #e4e4ed;
  min-height: 100vh;
}
EOF
```

```bash
cat > apps/web/src/App.css << 'EOF'
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #1e1e2e;
  border-radius: 8px;
  background: #12121a;
  color: #e4e4ed;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #ff6b35;
  color: #0a0a0f;
  font-weight: 600;
  cursor: pointer;
}

ul {
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #12121a;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

li.completed span {
  text-decoration: line-through;
  opacity: 0.5;
}

li span {
  flex: 1;
}

li button {
  background: transparent;
  color: #8888a0;
  padding: 0.5rem;
}
EOF
```

### Step 5.8: Create TypeScript Declaration

```bash
cat > apps/web/src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF
```

### Step 5.9: Create Environment File

```bash
# Replace with your actual Convex URL
cat > apps/web/.env.local << 'EOF'
VITE_CONVEX_URL=https://your-deployment.convex.cloud
EOF
```

---

## Phase 6: Create Mobile App

### Step 6.1: Create Mobile package.json

```bash
cat > apps/mobile/package.json << 'EOF'
{
  "name": "@my-monorepo/mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build": "expo export",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@my-monorepo/backend": "workspace:*",
    "@my-monorepo/shared": "workspace:*",
    "convex": "^1.17.4",
    "expo": "~54.0.31",
    "expo-constants": "~18.0.13",
    "expo-router": "~6.0.21",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.1.10",
    "babel-preset-expo": "^54.0.9",
    "typescript": "^5.7.2"
  },
  "private": true
}
EOF
```

### Step 6.2: Create Expo Config (app.json)

```bash
cat > apps/mobile/app.json << 'EOF'
{
  "expo": {
    "name": "My Monorepo Mobile",
    "slug": "my-monorepo-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "my-monorepo",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#0a0a0f"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mymonorepo.mobile"
    },
    "android": {
      "package": "com.mymonorepo.mobile"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "convexUrl": "YOUR_CONVEX_URL_HERE"
    }
  }
}
EOF
```

### Step 6.3: Create Mobile tsconfig.json

```bash
cat > apps/mobile/tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
EOF
```

### Step 6.4: Create Metro Config

```bash
cat > apps/mobile/metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in monorepo
config.watchFolders = [monorepoRoot];

// Resolve packages from both locations
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
EOF
```

### Step 6.5: Create Babel Config

```bash
cat > apps/mobile/babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
EOF
```

### Step 6.6: Create Polyfills (Required for Convex)

```bash
cat > apps/mobile/polyfills.ts << 'EOF'
// Polyfills required for Convex in React Native
import 'react-native-get-random-values';
EOF
```

### Step 6.7: Create Root Layout

```bash
cat > apps/mobile/app/_layout.tsx << 'EOF'
import '../polyfills';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';

const convexUrl = Constants.expoConfig?.extra?.convexUrl;

function ConvexNotConfigured() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Convex Not Configured</Text>
      <Text style={styles.subtitle}>Update convexUrl in app.json</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, color: '#e4e4ed', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8888a0' },
});

export default function RootLayout() {
  const convex = useMemo(() => {
    if (!convexUrl || convexUrl === 'YOUR_CONVEX_URL_HERE') return null;
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    return (
      <>
        <ConvexNotConfigured />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#e4e4ed',
          contentStyle: { backgroundColor: '#0a0a0f' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Tasks' }} />
      </Stack>
      <StatusBar style="light" />
    </ConvexProvider>
  );
}
EOF
```

### Step 6.8: Create Home Screen

```bash
cat > apps/mobile/app/index.tsx << 'EOF'
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@my-monorepo/backend';

export default function HomeScreen() {
  const [newTask, setNewTask] = useState('');

  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const handleSubmit = async () => {
    if (!newTask.trim()) return;
    await createTask({ text: newTask.trim() });
    setNewTask('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a task..."
            placeholderTextColor="#8888a0"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {tasks === undefined ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : tasks.length === 0 ? (
          <Text style={styles.loading}>No tasks yet!</Text>
        ) : (
          tasks.map((task) => (
            <View key={task._id} style={styles.taskItem}>
              <TouchableOpacity
                style={[styles.checkbox, task.isCompleted && styles.checked]}
                onPress={() => toggleTask({ id: task._id })}
              >
                {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text
                style={[styles.taskText, task.isCompleted && styles.completed]}
              >
                {task.text}
              </Text>
              <TouchableOpacity onPress={() => removeTask({ id: task._id })}>
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 20 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: '#12121a',
    borderRadius: 10,
    padding: 14,
    color: '#e4e4ed',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: { color: '#0a0a0f', fontWeight: '600' },
  loading: { color: '#8888a0', textAlign: 'center', padding: 20 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#1e1e2e',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: '#10b981', borderColor: '#10b981' },
  checkmark: { color: '#0a0a0f', fontWeight: '700' },
  taskText: { flex: 1, color: '#e4e4ed', fontSize: 16 },
  completed: { textDecorationLine: 'line-through', opacity: 0.5 },
  deleteText: { color: '#8888a0', fontSize: 24 },
});
EOF
```

### Step 6.9: Create Mobile .gitignore

```bash
cat > apps/mobile/.gitignore << 'EOF'
.expo/
dist/
EOF
```

---

## Phase 7: Connect Everything

### Step 7.1: Install All Dependencies

```bash
# From monorepo root
bun install
```

### Step 7.2: Add Polyfill Package for Mobile

```bash
cd apps/mobile
bun add react-native-get-random-values
cd ../..
```

### Step 7.3: Update Convex URLs

1. **Get your Convex URL:**
   ```bash
   cd packages/backend
   bunx convex dev
   # Copy the URL shown (e.g., https://xxx.convex.cloud)
   ```

2. **Update Web App:**
   Edit `apps/web/.env.local`:
   ```
   VITE_CONVEX_URL=https://your-actual-url.convex.cloud
   ```

3. **Update Mobile App:**
   Edit `apps/mobile/app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "convexUrl": "https://your-actual-url.convex.cloud"
       }
     }
   }
   ```

### Step 7.4: Test Everything

```bash
# Terminal 1: Start backend
bun run dev:backend

# Terminal 2: Start web
bun run dev:web

# Terminal 3: Start mobile
bun run dev:mobile
```

### Step 7.5: Verify Real-Time Sync

1. Open web app at `http://localhost:3000`
2. Scan QR code with Expo Go on your phone
3. Add a task on web - it appears on mobile instantly!
4. Complete a task on mobile - web updates immediately!

---

## Phase 8: Add Real Features

Now that the foundation is set, here are patterns for adding features:

### Adding a New Table

1. **Update Schema:**
   ```typescript
   // packages/backend/convex/schema.ts
   export default defineSchema({
     tasks: defineTable({ ... }),
     
     // Add new table
     notes: defineTable({
       title: v.string(),
       content: v.string(),
       createdAt: v.number(),
     }),
   });
   ```

2. **Create Functions:**
   ```typescript
   // packages/backend/convex/notes.ts
   export const list = query({ ... });
   export const create = mutation({ ... });
   ```

3. **Use in Components:**
   ```typescript
   const notes = useQuery(api.notes.list);
   const createNote = useMutation(api.notes.create);
   ```

### Adding a New Screen (Mobile)

1. Create file in `apps/mobile/app/`:
   ```typescript
   // apps/mobile/app/settings.tsx
   export default function SettingsScreen() {
     return <View>...</View>;
   }
   ```

2. Navigate to it:
   ```typescript
   import { Link } from 'expo-router';
   <Link href="/settings">Settings</Link>
   ```

### Adding Shared Utilities

1. Add to `packages/shared/src/utils.ts`
2. Export from `packages/shared/src/index.ts`
3. Use anywhere:
   ```typescript
   import { myNewUtil } from '@my-monorepo/shared';
   ```

---

## Phase 9: Polish and Best Practices

### Environment Variables Best Practices

- Never commit `.env.local` files
- Use `.env.example` as a template:
  ```bash
  cat > apps/web/.env.example << 'EOF'
  VITE_CONVEX_URL=https://your-deployment.convex.cloud
  EOF
  ```

### TypeScript Strict Mode

Already configured in `tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Code Organization

```
Feature-based structure:
packages/backend/convex/
├── tasks.ts      # Task-related functions
├── users.ts      # User-related functions
├── messages.ts   # Message-related functions
└── schema.ts     # All table definitions
```

### Performance Tips

1. **Use indexes** for filtered queries:
   ```typescript
   .withIndex("by_status", q => q.eq("isCompleted", false))
   ```

2. **Paginate large lists:**
   ```typescript
   const tasks = useQuery(api.tasks.list, { paginationOpts: { numItems: 50 } });
   ```

3. **Memoize components** in React:
   ```typescript
   const TaskItem = memo(({ task }) => ...);
   ```

---

## Reference Files

### Complete Directory Structure

```
my-monorepo/
├── .gitignore
├── package.json
├── turbo.json
├── tsconfig.base.json
├── bun.lock
│
├── apps/
│   ├── web/
│   │   ├── .env.local
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── App.css
│   │       ├── index.css
│   │       └── vite-env.d.ts
│   │
│   └── mobile/
│       ├── .gitignore
│       ├── app.json
│       ├── babel.config.js
│       ├── metro.config.js
│       ├── package.json
│       ├── polyfills.ts
│       ├── tsconfig.json
│       └── app/
│           ├── _layout.tsx
│           └── index.tsx
│
└── packages/
    ├── backend/
    │   ├── .gitignore
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── convex/
    │       ├── _generated/  (auto-generated)
    │       ├── convex.config.ts
    │       ├── schema.ts
    │       └── tasks.ts
    │
    └── shared/
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            ├── constants.ts
            ├── types.ts
            └── utils.ts
```

### Quick Commands Reference

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run dev` | Start everything |
| `bun run dev:web` | Start web only |
| `bun run dev:mobile` | Start mobile only |
| `bun run dev:backend` | Start Convex only |
| `bun run build` | Build all |
| `bun run typecheck` | Check all types |

---

## Congratulations! 🎉

You've built a complete full-stack monorepo with:

- ✅ **Bun** - Fast package management
- ✅ **Turborepo** - Efficient build orchestration
- ✅ **React + Vite** - Modern web app
- ✅ **Expo** - Cross-platform mobile app
- ✅ **Convex** - Real-time backend
- ✅ **Shared code** - DRY architecture
- ✅ **TypeScript** - End-to-end type safety
- ✅ **Real-time sync** - Instant updates everywhere

The patterns you've learned scale to any size project. Happy coding!
