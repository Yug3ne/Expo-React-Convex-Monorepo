# Components Guide - How Everything Works

This guide explains how all the components in the monorepo work together, including the architecture, data flow, and code patterns used throughout the project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Backend (Convex)](#backend-convex)
4. [Shared Package](#shared-package)
5. [Web App Components](#web-app-components)
6. [Mobile App Components](#mobile-app-components)
7. [Real-Time Data Flow](#real-time-data-flow)
8. [Styling Patterns](#styling-patterns)
9. [State Management](#state-management)
10. [Type Safety](#type-safety)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MONOREPO ROOT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│   │   apps/web  │     │ apps/mobile │     │   packages/ │      │
│   │    (Vite)   │     │   (Expo)    │     │             │      │
│   └──────┬──────┘     └──────┬──────┘     │  ┌───────┐  │      │
│          │                   │            │  │backend│  │      │
│          └─────────┬─────────┘            │  │(Convex│  │      │
│                    │                      │  └───┬───┘  │      │
│                    │                      │      │      │      │
│                    │  imports             │  ┌───┴───┐  │      │
│                    └──────────────────────┼──│shared │  │      │
│                                           │  └───────┘  │      │
│                                           └─────────────┘      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Turborepo (Orchestration)  •  Bun (Package Manager)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Convex Cloud  │
                    │   (Real-time    │
                    │    Database)    │
                    └─────────────────┘
```

### Key Concepts

1. **Monorepo Structure**: Single repository containing multiple apps and packages
2. **Workspaces**: Bun workspaces enable sharing dependencies and code
3. **Turborepo**: Orchestrates builds and dev servers efficiently
4. **Convex**: Provides real-time backend functionality
5. **Shared Code**: Common utilities and types used by both web and mobile

---

## Project Structure

```
monorepo/
├── apps/
│   ├── web/                    # React + Vite web application
│   │   ├── src/
│   │   │   ├── App.tsx         # Main application component
│   │   │   ├── App.css         # Application styles
│   │   │   ├── main.tsx        # Entry point & Convex setup
│   │   │   └── index.css       # Global styles
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── mobile/                 # Expo React Native application
│       ├── app/
│       │   ├── _layout.tsx     # Root layout (Convex provider)
│       │   ├── index.tsx       # Home screen
│       │   └── (tabs)/         # Tab navigation
│       │       ├── _layout.tsx # Tab layout
│       │       ├── index.tsx   # Tasks screen
│       │       └── explore.tsx # Explore screen
│       ├── metro.config.js     # Metro bundler config
│       ├── app.json            # Expo configuration
│       └── package.json
│
├── packages/
│   ├── backend/                # Convex backend
│   │   └── convex/
│   │       ├── schema.ts       # Database schema
│   │       ├── tasks.ts        # Tasks queries/mutations
│   │       ├── users.ts        # Users queries/mutations
│   │       ├── messages.ts     # Messages queries/mutations
│   │       └── _generated/     # Auto-generated types
│   │
│   └── shared/                 # Shared utilities
│       └── src/
│           ├── index.ts        # Main export
│           ├── types.ts        # TypeScript interfaces
│           ├── utils.ts        # Utility functions
│           └── constants.ts    # Shared constants
│
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── tsconfig.base.json          # Base TypeScript config
```

---

## Backend (Convex)

### How Convex Works

Convex is a real-time backend platform that provides:
- **Automatic real-time sync** - Changes propagate instantly to all clients
- **Type-safe queries** - TypeScript types are auto-generated
- **Serverless functions** - No server management required

### Database Schema (`packages/backend/convex/schema.ts`)

The schema defines your database structure:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tasks table
  tasks: defineTable({
    text: v.string(),           // Task text
    isCompleted: v.boolean(),   // Completion status
    createdAt: v.number(),      // Timestamp
  }).index("by_completed", ["isCompleted"]),  // Index for filtering

  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Messages table (for real-time chat)
  messages: defineTable({
    userId: v.id("users"),      // Foreign key reference
    text: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
```

**Key Concepts:**
- `defineTable()` - Creates a table with typed fields
- `v.string()`, `v.boolean()`, etc. - Validators for type safety
- `.index()` - Creates database indexes for efficient queries

### Queries (`packages/backend/convex/tasks.ts`)

Queries read data from the database:

```typescript
import { query } from "./_generated/server";

// Get all tasks, sorted by newest first
export const list = query({
  args: {},                     // No arguments needed
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")           // Query the tasks table
      .order("desc")            // Sort descending
      .collect();               // Return as array
  },
});

// Get tasks filtered by status
export const listByStatus = query({
  args: { isCompleted: v.boolean() },   // Required argument
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_completed", (q) => 
        q.eq("isCompleted", args.isCompleted)
      )
      .collect();
  },
});
```

### Mutations (`packages/backend/convex/tasks.ts`)

Mutations modify data in the database:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

// Toggle task completion
export const toggle = mutation({
  args: { id: v.id("tasks") },     // Typed document ID
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    
    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
```

### Auto-Generated API

When you run `convex dev`, it generates:
- `_generated/api.ts` - Typed API for all queries/mutations
- `_generated/dataModel.ts` - Types for your database documents
- `_generated/server.ts` - Server-side utilities

This enables fully type-safe API calls:

```typescript
import { api } from '@monorepo/backend';

// TypeScript knows exactly what arguments are required
// and what the return type will be
const tasks = useQuery(api.tasks.list);
const createTask = useMutation(api.tasks.create);
```

---

## Shared Package

The shared package (`packages/shared`) contains code used by both web and mobile apps.

### Constants (`src/constants.ts`)

Shared configuration values:

```typescript
export const APP_NAME = 'Monorepo App';

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

export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_MESSAGE_LENGTH: 1000,
} as const;
```

### Types (`src/types.ts`)

Shared TypeScript interfaces:

```typescript
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
  createdAt: number;
}

// Utility types for flexibility
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithTimestamp<T> = T & { createdAt: number; updatedAt?: number; };
```

### Utilities (`src/utils.ts`)

Reusable helper functions:

```typescript
// Format timestamps for display
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Relative time formatting ("2 hours ago")
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  // ... more logic
}

// Debounce function for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

### Using Shared Code

Import from anywhere in the monorepo:

```typescript
// In web app
import { THEME, formatTimestamp } from '@monorepo/shared';

// In mobile app
import { Task, isValidEmail } from '@monorepo/shared';
```

---

## Web App Components

### Entry Point (`apps/web/src/main.tsx`)

Sets up the React app with Convex:

```typescript
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App';

// Get Convex URL from environment
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Create Convex client
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function Root() {
  // Show error if Convex not configured
  if (!convex) {
    return <div>⚠️ Convex Not Configured</div>;
  }

  // Wrap app with ConvexProvider for data access
  return (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
```

### Main App Component (`apps/web/src/App.tsx`)

The primary component with task management:

```typescript
import { useQuery, useMutation } from 'convex/react';
import { api } from '@monorepo/backend';

function App() {
  const [newTask, setNewTask] = useState('');
  
  // Real-time query - automatically updates when data changes
  const tasks = useQuery(api.tasks.list);
  
  // Mutations for data modification
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await createTask({ text: newTask.trim() });
    setNewTask('');
  };

  return (
    <div className="app">
      {/* Header */}
      <header>
        <h1>Synced Tasks</h1>
      </header>

      {/* Task Form */}
      <form onSubmit={handleSubmit}>
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
        />
        <button type="submit">Add</button>
      </form>

      {/* Task List - handles loading, empty, and data states */}
      {tasks === undefined ? (
        <div>Loading...</div>
      ) : tasks.length === 0 ? (
        <div>No tasks yet</div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <button onClick={() => toggleTask({ id: task._id })}>
                {task.isCompleted ? '✓' : ''}
              </button>
              <span>{task.text}</span>
              <button onClick={() => removeTask({ id: task._id })}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Key Patterns:**
1. **`useQuery`** - Subscribes to real-time data
2. **`useMutation`** - Returns function to modify data
3. **Loading State** - `undefined` means still loading
4. **Optimistic Updates** - UI updates immediately

---

## Mobile App Components

### Root Layout (`apps/mobile/app/_layout.tsx`)

Sets up navigation and Convex provider:

```typescript
import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';

// Get Convex URL from app.json
const convexUrl = Constants.expoConfig?.extra?.convexUrl;

export default function RootLayout() {
  // Create client inside component (React Native requirement)
  const convex = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    return <ConvexNotConfigured />;
  }

  return (
    <ConvexProvider client={convex}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#e4e4ed',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ConvexProvider>
  );
}
```

### Home Screen (`apps/mobile/app/index.tsx`)

Introduction screen with navigation:

```typescript
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Monorepo Mobile</Text>
      </View>

      {/* Interactive Counter */}
      <Pressable onPress={() => setCount(c => c + 1)}>
        <Text>Count is {count}</Text>
      </Pressable>

      {/* Navigation to Tabs */}
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.navButton}>
          <Text>Go to Tabs →</Text>
        </Pressable>
      </Link>
    </View>
  );
}
```

### Tab Navigation (`apps/mobile/app/(tabs)/_layout.tsx`)

Configures bottom tab navigation:

```typescript
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#8888a0',
        tabBarStyle: {
          backgroundColor: '#12121a',
          borderTopColor: '#1e1e2e',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarLabel: 'Explore' }}
      />
    </Tabs>
  );
}
```

### Tasks Tab (`apps/mobile/app/(tabs)/index.tsx`)

Real-time task management (identical logic to web):

```typescript
import { useQuery, useMutation } from 'convex/react';
import { api } from '@monorepo/backend';

export default function TabHomeScreen() {
  const [newTask, setNewTask] = useState('');
  
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        {/* Input */}
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleSubmit}
        />
        
        {/* Task List */}
        {tasks?.map((task) => (
          <TouchableOpacity 
            key={task._id}
            onPress={() => toggleTask({ id: task._id })}
          >
            <Text>{task.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

---

## Real-Time Data Flow

### How Real-Time Sync Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

  Web App                                              Mobile App
  ┌──────────┐                                        ┌──────────┐
  │  useQuery │                                       │  useQuery │
  │  tasks    │◄─────────┐              ┌────────────►│  tasks    │
  └──────────┘           │              │             └──────────┘
       │                 │              │                   │
       │ (1) Subscribe   │              │  (1) Subscribe    │
       ▼                 │              │                   ▼
  ┌──────────────────────┴──────────────┴──────────────────────┐
  │                      Convex Cloud                          │
  │  ┌─────────────────────────────────────────────────────┐   │
  │  │  (2) Query runs automatically on database changes   │   │
  │  │  (3) Results pushed to all subscribed clients       │   │
  │  └─────────────────────────────────────────────────────┘   │
  │                           │                                 │
  │                           ▼                                 │
  │                     ┌──────────┐                            │
  │                     │ Database │                            │
  │                     │  tasks   │                            │
  │                     └──────────┘                            │
  └─────────────────────────────────────────────────────────────┘
                              ▲
                              │ (4) Mutation
                              │
                        ┌──────────┐
                        │ User     │
                        │ Action   │
                        └──────────┘
```

### Step-by-Step Flow

1. **Subscription**: Both web and mobile use `useQuery(api.tasks.list)` to subscribe
2. **Initial Load**: Convex runs the query and sends results to both apps
3. **User Action**: User adds a task on web app
4. **Mutation**: `createTask()` sends data to Convex
5. **Database Update**: Convex inserts the new task
6. **Auto-Broadcast**: Convex re-runs all affected queries
7. **UI Update**: Both web AND mobile instantly show the new task

### Why It Works

- Convex tracks which queries each client subscribes to
- When data changes, it re-runs affected queries automatically
- Results are pushed via WebSocket to all connected clients
- No polling, no manual refresh - truly real-time

---

## Styling Patterns

### Web (CSS)

Traditional CSS in `App.css`:

```css
.app {
  min-height: 100vh;
  background: #0a0a0f;
  color: #e4e4ed;
}

.task-item {
  display: flex;
  align-items: center;
  background: #0a0a0f;
  border-radius: 10px;
}

.task-item.completed {
  opacity: 0.7;
}
```

### Mobile (StyleSheet)

React Native StyleSheet:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
    borderRadius: 10,
    padding: 12,
  },
  taskCompleted: {
    opacity: 0.7,
  },
});

// Usage
<View style={[styles.taskItem, task.isCompleted && styles.taskCompleted]}>
```

### Shared Theme Constants

Both apps use the same color palette from `@monorepo/shared`:

```typescript
import { THEME } from '@monorepo/shared';

// Web
<div style={{ background: THEME.colors.background }} />

// Mobile
<View style={{ backgroundColor: THEME.colors.background }} />
```

---

## State Management

### Local State (React useState)

For UI-only state:

```typescript
const [newTask, setNewTask] = useState('');  // Form input
const [count, setCount] = useState(0);        // Counter
```

### Server State (Convex)

For persistent, shared data:

```typescript
// Read data - automatically synced
const tasks = useQuery(api.tasks.list);

// Modify data
const createTask = useMutation(api.tasks.create);
await createTask({ text: 'New task' });
```

### No Redux/Context Needed

Convex eliminates the need for complex state management:

| Traditional | With Convex |
|-------------|-------------|
| Redux store | `useQuery()` |
| Actions/reducers | `useMutation()` |
| Async thunks | Built-in |
| Cache management | Automatic |
| Real-time updates | Automatic |

---

## Type Safety

### End-to-End Types

Types flow from backend to frontend automatically:

```
Schema (schema.ts)
     │
     ▼ convex dev generates
_generated/dataModel.ts
     │
     ▼ used by
tasks.ts (queries/mutations)
     │
     ▼ convex dev generates
_generated/api.ts
     │
     ▼ imported by
App.tsx / mobile screens
```

### TypeScript in Action

```typescript
// Backend: Define mutation with typed args
export const create = mutation({
  args: { text: v.string() },  // Requires string
  handler: async (ctx, args) => { ... }
});

// Frontend: TypeScript knows what's required
const createTask = useMutation(api.tasks.create);

createTask({ text: 'Hello' });     // ✅ Correct
createTask({ text: 123 });          // ❌ Type error
createTask({ });                    // ❌ Missing 'text'

// Query results are also typed
const tasks = useQuery(api.tasks.list);
// tasks is Task[] | undefined
// Each task has _id, text, isCompleted, createdAt
```

### Shared Types

For additional type safety across packages:

```typescript
// packages/shared/src/types.ts
export interface Task {
  _id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

// Use in web or mobile
import { Task } from '@monorepo/shared';
```

---

## Summary

This monorepo demonstrates modern full-stack development:

| Aspect | Technology | Benefit |
|--------|------------|---------|
| **Monorepo** | Bun + Turborepo | Shared code, single install |
| **Backend** | Convex | Real-time, type-safe, serverless |
| **Web** | React + Vite | Fast development, modern tooling |
| **Mobile** | Expo + React Native | Cross-platform with single codebase |
| **Shared** | TypeScript package | DRY code, consistent types |
| **Sync** | Convex subscriptions | Automatic real-time updates |

The key insight is that **the same code patterns** work identically on web and mobile - the only differences are UI components (div vs View, button vs TouchableOpacity).
