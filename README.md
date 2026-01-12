# Monorepo Starter Kit

<div align="center">

![Bun](https://img.shields.io/badge/Bun-1.1.42-f9f1e1?style=for-the-badge&logo=bun&logoColor=black)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-1.17-FF6B35?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A production-ready monorepo starter kit with React (Web), Expo (Mobile), and Convex (Backend)**

[Getting Started](#-getting-started) • [Features](#-features) • [Documentation](#-documentation) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- **🚀 Bun** - Lightning-fast JavaScript runtime and package manager
- **📦 Turborepo** - High-performance build system for monorepos
- **⚛️ React + Vite** - Modern web app with instant HMR
- **📱 Expo** - Cross-platform mobile app (iOS, Android, Web)
- **⚡ Convex** - Real-time backend with automatic sync
- **🔄 Real-time Sync** - Changes sync instantly across web and mobile
- **📝 TypeScript** - End-to-end type safety
- **🎨 Shared Code** - Common utilities, types, and constants

---

## 🏗️ Project Structure

```
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
│   ├── backend/             # Convex backend
│   │   └── convex/
│   │       ├── schema.ts    # Database schema
│   │       ├── tasks.ts     # Tasks API
│   │       └── _generated/  # Auto-generated types
│   │
│   └── shared/              # Shared utilities
│       └── src/
│           ├── constants.ts # Theme, config
│           ├── types.ts     # TypeScript interfaces
│           └── utils.ts     # Helper functions
│
├── turbo.json               # Turborepo config
├── tsconfig.base.json       # Base TypeScript config
└── package.json             # Root package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) v1.1.42+
- [Expo Go](https://expo.dev/client) app (for mobile testing)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd monorepo

# Install dependencies
bun install
```

### Setup Convex Backend

```bash
# Navigate to backend and initialize Convex
cd packages/backend
bunx convex dev
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
bun run dev

# Or run individually
bun run dev:backend  # Convex backend
bun run dev:web      # Web at http://localhost:3000
bun run dev:mobile   # Expo dev server
```

---

## 📱 Demo App

This starter includes a **Synced Tasks** demo app showcasing real-time sync:

| Web | Mobile |
|-----|--------|
| React + Vite | Expo + React Native |
| `http://localhost:3000` | Scan QR with Expo Go |

**Try it:** Add a task on web → It appears instantly on mobile! ✨

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [RUNNING_THE_APP.md](./RUNNING_THE_APP.md) | Complete guide to running the application |
| [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) | How all components work together |
| [BUILDING_MONOREPO_FROM_SCRATCH.md](./BUILDING_MONOREPO_FROM_SCRATCH.md) | Step-by-step tutorial to build this from scratch |

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run dev:web` | Start web app only |
| `bun run dev:mobile` | Start mobile app only |
| `bun run dev:backend` | Start Convex backend only |
| `bun run build` | Build all apps for production |
| `bun run lint` | Lint all packages |
| `bun run typecheck` | Type-check all packages |
| `bun run clean` | Clean build artifacts |

---

## 🔧 Tech Stack

### Apps

| App | Technology | Port |
|-----|------------|------|
| **Web** | React 18, Vite 6, TypeScript | 3000 |
| **Mobile** | Expo 54, React Native, Expo Router | 8081 |

### Backend

| Service | Technology |
|---------|------------|
| **Database** | Convex (real-time, serverless) |
| **API** | Convex queries & mutations |
| **Auth** | Ready for Convex Auth (add as needed) |

### Tooling

| Tool | Purpose |
|------|---------|
| **Bun** | Package manager & runtime |
| **Turborepo** | Build orchestration |
| **TypeScript** | Type safety |
| **ESLint** | Code linting |

---

## 🎯 Use Cases

This starter kit is perfect for:

- 📱 **Cross-platform apps** - Build for web and mobile from one codebase
- ⚡ **Real-time applications** - Chat, collaboration tools, live dashboards
- 🚀 **Rapid prototyping** - Get from idea to MVP quickly
- 🏢 **Production apps** - Scalable architecture for growing teams

---

## 📦 Adding New Features

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
import { api } from '@monorepo/backend';

const posts = useQuery(api.posts.list);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this starter for any project!

---

<div align="center">

**Built with ❤️ using Bun, Turborepo, React, Expo, and Convex**

[⬆ Back to top](#monorepo-starter-kit)

</div>
