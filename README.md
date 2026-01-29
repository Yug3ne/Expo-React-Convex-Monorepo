# Monorepo Starter Kit

A production-ready monorepo starter kit with React (Web), Expo (Mobile), and Convex (Backend).

## Features

- **pnpm** - Fast, disk space efficient package manager
- **Turborepo** - High-performance build system for monorepos
- **React 19.2 + Vite** - Modern web app with instant HMR
- **Expo SDK 55 (Beta)** - Cross-platform mobile app (iOS, Android, Web)
- **Convex** - Real-time backend with automatic sync
- **Real-time Sync** - Changes sync instantly across web and mobile
- **TypeScript** - End-to-end type safety
- **NativeWind** - Tailwind CSS for React Native

## Project Structure

```text
monorepo/
├── apps/
│   ├── web/                 # React + Vite web application
│   │   ├── src/
│   │   │   ├── App.tsx      # Main app component
│   │   │   └── main.tsx     # Entry point
│   │   └── package.json
│   │
│   └── mobile/              # Expo React Native application
│       ├── app/
│       │   ├── _layout.tsx  # Root layout
│       │   ├── index.tsx    # Home screen
│       │   └── (tabs)/      # Tab navigation
│       └── package.json
│
├── packages/
│   └── backend/             # Convex backend
│       └── convex/
│           ├── schema.ts    # Database schema
│           ├── tasks.ts     # Tasks API
│           └── _generated/  # Auto-generated types
│
├── turbo.json               # Turborepo config
├── tsconfig.base.json       # Base TypeScript config
└── package.json             # Root package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v9+
- [Expo Go](https://expo.dev/client) app (for mobile testing) - SDK 55 beta version

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd monorepo

# Install dependencies
pnpm install
```

### Setup Convex Backend

```bash
# Navigate to backend and initialize Convex
cd packages/backend
pnpm dlx convex dev
```

This will open a browser to authenticate and create your Convex project. Save the deployment URL.

### Configure Environment

**Web App** - Create `apps/web/.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

**Mobile App** - Update `apps/mobile/app.json`:

```json
{
  "expo": {
    "extra": {
      "convexUrl": "https://your-deployment.convex.cloud"
    }
  }
}
```

### Run Development Servers

```bash
# Run everything (backend + web + mobile)
pnpm dev

# Or run individually
pnpm dev:backend  # Convex backend
pnpm dev:web      # Web at http://localhost:5173
pnpm dev:mobile   # Expo dev server
```

## Demo App

This starter includes a **Synced Tasks** demo app showcasing real-time sync:

| Web                     | Mobile               |
| ----------------------- | -------------------- |
| React + Vite            | Expo + React Native  |
| `http://localhost:5173` | Scan QR with Expo Go |

**Try it:** Add a task on web → It appears instantly on mobile!

## Documentation

| Document                                                                 | Description                                      |
| ------------------------------------------------------------------------ | ------------------------------------------------ |
| [RUNNING_THE_APP.md](./RUNNING_THE_APP.md)                               | Complete guide to running the application        |
| [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)                             | How all components work together                 |
| [BUILDING_MONOREPO_FROM_SCRATCH.md](./BUILDING_MONOREPO_FROM_SCRATCH.md) | Step-by-step tutorial to build this from scratch |

## Available Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | Start all apps in development mode |
| `pnpm dev:web`       | Start web app only                 |
| `pnpm dev:mobile`    | Start mobile app only              |
| `pnpm dev:backend`   | Start Convex backend only          |
| `pnpm build`         | Build all apps for production      |
| `pnpm lint`          | Lint all packages                  |
| `pnpm typecheck`     | Type-check all packages            |
| `pnpm clean`         | Clean build artifacts              |

## Tech Stack

### Apps

| App        | Technology                                          | Port |
| ---------- | --------------------------------------------------- | ---- |
| **Web**    | React 19.2, Vite 6, TypeScript                      | 5173 |
| **Mobile** | Expo SDK 55 (Beta), React Native 0.83, Expo Router  | 8081 |

### Backend

| Service      | Technology                            |
| ------------ | ------------------------------------- |
| **Database** | Convex (real-time, serverless)        |
| **API**      | Convex queries and mutations          |
| **Auth**     | Ready for Convex Auth (add as needed) |

### Tooling

| Tool           | Purpose                     |
| -------------- | --------------------------- |
| **pnpm**       | Package manager             |
| **Turborepo**  | Build orchestration         |
| **TypeScript** | Type safety                 |
| **ESLint**     | Code linting                |
| **NativeWind** | Tailwind CSS for mobile     |

## Use Cases

This starter kit is perfect for:

- **Cross-platform apps** - Build for web and mobile from one codebase
- **Real-time applications** - Chat, collaboration tools, live dashboards
- **Rapid prototyping** - Get from idea to MVP quickly
- **Production apps** - Scalable architecture for growing teams

## Adding New Features

### New Database Table

```typescript
// packages/backend/convex/schema.ts
export default defineSchema({
  tasks: defineTable({ ... }),

  // Add your new table
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
  }),
});
```

### New API Endpoint

```typescript
// packages/backend/convex/posts.ts
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect();
  },
});
```

### Use in Apps

```typescript
// In web or mobile
import { api } from "@monorepo/backend";

const posts = useQuery(api.posts.list);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this starter for any project!

---

Built with pnpm, Turborepo, React, Expo, and Convex
