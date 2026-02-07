# ArchLens Strategic Systems — Architecture v3.0

## Monorepo Structure (Turborepo + pnpm)

```
archlens-strategic-systems/
├── turbo.json                    # Turborepo pipeline config
├── pnpm-workspace.yaml           # Workspace definition
├── package.json                  # Root scripts & devDependencies
│
├── apps/
│   ├── web/                      # Main SPA (React 18 + Vite + Module Federation)
│   │   ├── src/
│   │   │   ├── main.tsx          # Entry: providers (Apollo, TanStack, Sentry)
│   │   │   ├── App.tsx           # Root component (migrated)
│   │   │   ├── components/       # 38+ domain components
│   │   │   └── services/         # AI & domain services
│   │   ├── vite.config.ts        # Module Federation host config
│   │   └── tailwind.config.ts    # Extends @archlens/config preset
│   │
│   └── edge/                     # Cloudflare Workers (CDN + edge caching)
│       ├── wrangler.toml
│       └── src/index.ts          # Edge routing, KV cache, security headers
│
├── packages/
│   ├── config/                   # Shared configs
│   │   ├── tsconfig/             # base.json (strict), react.json, node.json
│   │   ├── eslint/               # Strict TS + React rules
│   │   ├── tailwind/             # Design tokens preset
│   │   └── prettier/             # Formatting rules
│   │
│   ├── types/                    # @archlens/types — all shared TypeScript interfaces
│   │
│   ├── ui/                       # @archlens/ui — Radix UI + TailwindCSS + CVA
│   │   ├── src/components/       # Button, Dialog, Tabs, Toast, ScrollArea, Progress
│   │   ├── .storybook/           # Storybook 8 + Chromatic visual testing
│   │   └── src/styles.css        # Global design system styles
│   │
│   ├── store/                    # @archlens/store — Zustand 5 + Immer + middleware
│   │   ├── src/stores/           # app-store.ts (full app state)
│   │   └── src/middleware/       # logger, persist-encrypted
│   │
│   ├── api/                      # @archlens/api — TanStack Query v5 + Apollo Client
│   │   ├── src/tanstack/         # query-client, hooks (useCodebase, useImpactAnalysis...)
│   │   └── src/graphql/          # Apollo client, queries, mutations
│   │
│   ├── realtime/                 # @archlens/realtime — Socket.io + SSE + WebRTC
│   │   ├── src/socket/           # Socket.io client singleton
│   │   ├── src/sse/              # Audit stream (Server-Sent Events)
│   │   ├── src/webrtc/           # CollaborativeReviewManager (peer connections)
│   │   └── src/hooks/            # useSocket, useAuditStream
│   │
│   └── monitoring/               # @archlens/monitoring — Sentry + Web Vitals
│       ├── src/sentry.ts         # Sentry init, error boundary helpers
│       ├── src/web-vitals.ts     # CLS, FID, LCP, FCP, TTFB, INP + SpeedCurve
│       └── src/performance.ts    # measureAsync, observeLongTasks, memory usage
│
└── server/
    └── gateway/                  # @archlens/gateway — Express + Socket.io + Redis
        ├── src/index.ts          # HTTP server + Socket.io with Redis adapter
        ├── src/ws/handlers.ts    # WebSocket event handlers + WebRTC signaling
        ├── src/sse/audit-stream.ts # SSE broadcast to connected clients
        └── src/api/routes.ts     # REST API endpoints
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 + TypeScript (strict) | UI with strict type safety |
| **Build** | Turborepo + Vite 6 | Incremental builds, 40+ components |
| **Micro-frontends** | @originjs/vite-plugin-federation | Module Federation for code splitting |
| **Global State** | Zustand 5 + Immer + middleware | Immutable state with devtools, persist, logger |
| **Server State** | TanStack Query v5 | Caching, invalidation, optimistic updates |
| **GraphQL Cache** | Apollo Client 3.11 | Local cache with type policies |
| **UI Components** | Radix UI (headless) + TailwindCSS | Accessible, unstyled primitives + utility CSS |
| **Design System** | Storybook 8 + Chromatic | Visual testing, component documentation |
| **Charts** | Recharts + Deck.gl | 2D charts + 3D dependency graph visualization |
| **WebSockets** | Socket.io + Redis Adapter | Real-time events, horizontal scaling |
| **SSE** | Server-Sent Events | Unidirectional audit event stream |
| **WebRTC** | Native WebRTC + signaling | Collaborative code review (P2P) |
| **Error Tracking** | Sentry + Session Replay | RUM, error boundaries, breadcrumbs |
| **Performance** | Web Vitals + SpeedCurve | CWV collection, long task monitoring |
| **CDN** | Cloudflare Workers + KV | Edge caching, security headers, routing |
| **Bundle Analysis** | vite-bundle-visualizer | Chunk analysis, manual chunk splitting |

## Getting Started

```bash
# Install pnpm if not already installed
npm i -g pnpm@9

# Install all dependencies
pnpm install

# Start development (all packages)
pnpm dev

# Start only the web app
pnpm dev:web

# Start the API gateway
pnpm server:dev

# Run Storybook
pnpm dev:storybook

# Build all packages
pnpm build

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Run bundle analysis
pnpm analyze
```

## Environment Variables

Create `.env.local` in `apps/web/`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=http://localhost:4000
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_SENTRY_DSN=your-sentry-dsn
VITE_APP_VERSION=3.0.0
VITE_GOOGLE_AI_KEY=your-google-ai-key
```

Server environment (`server/gateway/.env`):

```env
PORT=4000
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

## Key Design Decisions

1. **Strict TypeScript** — `noUncheckedIndexedAccess`, `strictNullChecks`, `noImplicitReturns` enabled across all packages
2. **Zustand over Redux** — Simpler API, zero boilerplate, native TypeScript, smaller bundle
3. **TanStack Query for server state** — Separates server cache from UI state, automatic background refetch
4. **Apollo Client for GraphQL** — Normalized cache for complex relational data, type policies
5. **Radix UI headless** — Accessible primitives without style opinions, composed with Tailwind
6. **Module Federation** — Allows independent deployment of feature modules (audit, security, graph)
7. **Redis adapter for Socket.io** — Enables horizontal scaling across multiple gateway instances
8. **Cloudflare Workers** — Edge-level caching reduces origin load, sub-50ms global latency
