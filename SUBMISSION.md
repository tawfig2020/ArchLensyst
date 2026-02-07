# ArchLens Strategic Systems — Hackathon Submission

---

## 1. Video Script (2–3 Minutes)

### [0:00–0:25] ELEVATOR PITCH (Hook + Problem)

> "Every engineering team I've worked with faces the same invisible crisis: **architectural decay**. Your codebase grows, dependencies tangle, security vulnerabilities hide in plain sight — and by the time you notice, refactoring costs millions.
>
> I'm Tawfig, and I built **ArchLens** — an AI-driven codebase orchestration platform that uses **Google Gemini** to give engineering leaders a real-time nervous system for their entire software architecture.
>
> ArchLens doesn't just find bugs. It **understands** your architecture — detecting drift, enforcing invariants, and generating strategic insights that turn technical debt into competitive advantage."

### [0:25–0:50] HOW IT MEETS HACKATHON REQUIREMENTS + GEMINI USAGE

> "ArchLens is built from the ground up around **Gemini**. Here's how:
>
> **First — AI-Powered Architectural Analysis.** When you push code, our Cognitive Service sends the entire structural context to Gemini, which returns deep insights: circular dependencies, API boundary violations, coupling hotspots — each with a confidence score and a suggested fix.
>
> **Second — Semantic Code Search.** Using Gemini's embedding model `text-embedding-004`, we convert every architectural artifact into vector embeddings stored in Elasticsearch. Engineers can ask natural-language questions like 'Where do we violate the payment boundary?' and get precise, contextual results.
>
> **Third — Architectural Rationale Generation.** Gemini generates human-readable explanations of *why* architectural decisions were made, creating an institutional memory that survives team turnover."

### [0:50–1:10] PROBLEM + SOLUTION SUMMARY

> "The problem is clear: **67% of engineering time** is spent on maintenance, not innovation. Architecture degrades silently. By the time drift is visible, it's already expensive.
>
> ArchLens solves this with a five-layer intelligence stack:
> 1. A **Rust WASM parser** for blazing-fast multi-language code analysis
> 2. A **Gemini-powered Cognitive Service** for deep architectural understanding
> 3. A **Strategic Citadel** for real-time drift detection and service mesh monitoring
> 4. A **Sovereign Vault** with cryptographic proof chains for immutable decision records
> 5. A **Neo4j-backed Dependency Audit** engine for graph-based impact analysis
>
> All orchestrated through a Go API Gateway with JWT auth, rate limiting, and OpenTelemetry tracing."

### [1:10–2:30] LIVE DEMO WALKTHROUGH

> "Let me show you how a real user experiences ArchLens."

**[SCREEN: Landing Page]**
> "This is our landing page — clean, professional, with clear value propositions."

**[SCREEN: Click 'Sign In' → Sign In Page]**
> "We support email/password authentication and Google OAuth. For this demo, I'll use our Pro account quick-fill."

**[SCREEN: Click 'Pro Account' quick-fill → Click 'Sign In' → Dashboard loads]**
> "And we're in. This is the **ArchLens Dashboard** — your command center."

**[SCREEN: Overview page]**
> "The Overview shows real-time architecture health at a glance: health scores across six dimensions, service status, and a live activity feed."

**[SCREEN: Navigate to Code Analysis]**
> "In **Code Analysis**, Gemini analyzes your codebase and surfaces issues ranked by severity — with AI-generated fix suggestions and confidence scores."

**[SCREEN: Navigate to Semantic Search]**
> "**Semantic Search** lets you query your architecture in natural language. Ask 'Which services have the highest coupling?' and Gemini's embeddings find the answer instantly."

**[SCREEN: Navigate to Drift Detection]**
> "**Drift Detection** continuously monitors your architecture against defined invariants. When something drifts — a new dependency, a boundary violation — you're alerted in real-time via WebSocket."

**[SCREEN: Navigate to Security Hub]**
> "The **Security Hub** tracks CVEs across your entire dependency tree, with severity ratings and remediation guidance."

**[SCREEN: Navigate to Dependencies]**
> "The **Dependency Graph** visualizes your entire package ecosystem — powered by Neo4j graph queries for impact analysis and circular dependency detection."

**[SCREEN: Navigate to Settings → Show plan features]**
> "And everything is plan-aware. Pro users get AI insights and custom rules. Institution users unlock **Strategic Citadel** for service mesh topology and **Sovereign Vault** for cryptographically signed decision ledgers."

### [2:30–2:50] CLOSING

> "ArchLens transforms how engineering organizations understand and govern their software architecture. Built with Gemini at its core, five microservices across four languages, and a relentless focus on developer experience.
>
> **This isn't just a tool. It's architectural consciousness.**
>
> Thank you."

---

## 2. Gemini Integration Description (~200 words)

ArchLens integrates Google Gemini as the cognitive backbone of its architectural intelligence platform, powering three critical capabilities:

**AI-Powered Architectural Analysis:** The Cognitive Service (Python/FastAPI) sends structured code context to Gemini's `gemini-2.0-flash` model, which performs deep architectural analysis — identifying circular dependencies, API boundary violations, coupling hotspots, and security vulnerabilities. Each insight includes severity classification, affected files, suggested fixes, and a confidence score, enabling engineers to prioritize effectively.

**Semantic Code Search via Embeddings:** Using Gemini's `text-embedding-004` model, ArchLens converts architectural artifacts (code structures, dependency graphs, documentation) into 768-dimensional vector embeddings. These are indexed in Elasticsearch, enabling natural-language queries like "Where do we violate the payment service boundary?" — returning contextually relevant results ranked by vector similarity.

**Architectural Rationale Generation:** Gemini generates human-readable explanations of architectural decisions, including alternatives considered and trade-offs evaluated. This creates persistent institutional knowledge that survives team turnover — a critical need in enterprise engineering organizations.

Gemini is not a peripheral feature — it is the intelligence layer that transforms ArchLens from a static analysis tool into an AI-driven architectural consciousness platform. Every insight, search result, and rationale flows through Gemini, making it central and indispensable to the application's core value proposition.

---

## 3. Project Story

### Inspiration

Every engineering team I've been part of has faced the same silent crisis: architectural decay. Codebases grow organically, dependencies tangle invisibly, and by the time someone notices the structural rot, the cost to fix it has ballooned into millions of dollars and months of developer time. I watched talented teams spend 67% of their time on maintenance instead of innovation — not because they lacked skill, but because they lacked *visibility*.

The breaking point was watching a production incident cascade through six microservices because a single dependency change violated an undocumented architectural boundary. Nobody knew the boundary existed. Nobody could trace the impact. That day, I asked: **What if your codebase could understand itself?**

That question became ArchLens — an AI-driven platform that gives engineering organizations a real-time nervous system for their software architecture, powered by Google Gemini.

### What it does

ArchLens is a comprehensive codebase orchestration platform that provides:

- **AI-Powered Architectural Analysis** — Gemini analyzes code structure to detect circular dependencies, boundary violations, coupling hotspots, and security vulnerabilities, each with confidence scores and suggested fixes.
- **Semantic Code Search** — Natural-language queries over your entire codebase using Gemini embeddings, so engineers can ask "Where do we violate the payment boundary?" and get instant, precise answers.
- **Real-Time Drift Detection** — Continuous monitoring of architectural invariants with WebSocket-based alerts when deviations occur.
- **Service Mesh Monitoring** — Live topology visualization and health aggregation across distributed microservices.
- **Cryptographic Decision Ledger** — An immutable, Ed25519-signed record of every architectural decision with SHA-256 hash chains for audit compliance.
- **Dependency Graph Analysis** — Neo4j-powered graph queries for impact analysis, circular dependency detection, and hotspot identification.
- **Multi-Language Code Parsing** — A Rust WASM parser using tree-sitter grammars for TypeScript, JavaScript, Python, Rust, Go, and Java.

### How we built it

ArchLens is a polyglot microservices platform built across **four programming languages** and **six services**:

| Service | Language | Framework | Purpose |
|---------|----------|-----------|---------|
| API Gateway | Go | Fiber v2 | JWT auth, rate limiting, routing, OpenTelemetry |
| Cognitive Service | Python | FastAPI | Gemini AI analysis, embeddings, rationale |
| Strategic Citadel | Go | Fiber v2 | Drift detection, mesh monitoring, WebSocket |
| Sovereign Vault | Go | Fiber v2 | Ed25519 signing, immutable ledger, MongoDB |
| Dependency Audit | Java | Quarkus 3.7 | Neo4j graph queries, impact analysis |
| WASM Parser | Rust | tonic gRPC | Tree-sitter multi-language parsing |

**Frontend:** React 18 + Vite + TailwindCSS + Zustand + Framer Motion, organized as a Turborepo monorepo with shared packages for types, UI components, state management, and real-time communication.

**Infrastructure:** Docker Compose orchestrating PostgreSQL 16 (TimescaleDB), MongoDB 7, Redis Stack, Elasticsearch 8, Neo4j 5, Kafka (KRaft mode), Keycloak 24, Jaeger, Prometheus, and Grafana — all with Kubernetes manifests ready for production.

**Deployment:** Frontend on Netlify (drag-and-drop), Backend on Render.com with Docker-based services.

### Challenges we ran into

- **Polyglot Coordination** — Managing build pipelines across Go, Python, Rust, and Java required careful dependency isolation and Docker multi-stage builds.
- **JWT Consistency** — Ensuring HMAC-SHA256 JWT validation worked identically across the Go API Gateway and the frontend demo auth system required debugging signing mismatches.
- **Monorepo Complexity** — Configuring Turborepo with pnpm workspaces to properly share TypeScript configs, Tailwind presets, and component libraries across packages.
- **Real-Time Architecture** — Implementing WebSocket connections for drift detection alongside SSE for audit streaming while maintaining connection resilience.
- **Cryptographic Integrity** — Building the Sovereign Vault's Ed25519 signing with SHA-256 hash chains to ensure immutable, verifiable decision records.

### Accomplishments that we're proud of

- **Five production-grade microservices** across four languages, each with its own Dockerfile, health checks, and observability.
- **Gemini deeply integrated** as the cognitive backbone — not a bolt-on, but the intelligence layer powering analysis, search, and rationale.
- **Beautiful, responsive dashboard** with 12 feature-rich pages, plan-aware navigation, and professional UI/UX.
- **Cryptographically verifiable decision records** with Ed25519 signatures and SHA-256 hash chains — enterprise-grade auditability.
- **Full observability stack** — Prometheus metrics, Jaeger tracing, Grafana dashboards, and structured logging across all services.
- **Complete infrastructure-as-code** — Docker Compose, Kubernetes manifests, database migrations, and deployment blueprints.

### What we learned

- Gemini's embedding model is remarkably effective for code semantic search — the 768-dimensional vectors capture architectural relationships that keyword search completely misses.
- Building a polyglot system forces you to think deeply about API contracts and interface boundaries — the same lessons we teach in the platform itself.
- Ed25519 signing for immutable ledgers is simpler than expected but incredibly powerful for enterprise compliance.
- The gap between "working code" and "production-ready platform" is enormous — health checks, graceful shutdown, circuit breakers, and observability are where most of the engineering effort goes.

### What's next for ArchLens

- **Full Gemini API integration** — Moving from structured prompts to Gemini's function calling for automated fix generation and PR creation.
- **Live Repository Ingestion** — GitHub/GitLab webhook integration for continuous architectural monitoring on every push.
- **Collaborative Architecture Review** — WebRTC-powered real-time collaborative sessions where teams can review architectural insights together.
- **Custom AI Models** — Fine-tuning Gemini on organization-specific architectural patterns for enterprise customers.
- **Compliance Automation** — SOC 2, ISO 27001, and GDPR compliance report generation powered by the Sovereign Vault's cryptographic ledger.
- **Multi-Region Deployment** — Edge caching with Cloudflare Workers and multi-region database replication for global enterprises.

### Built With

**Languages:** TypeScript, Go, Python, Rust, Java
**Frontend:** React 18, Vite, TailwindCSS, Zustand, Framer Motion, React Router, Axios, Lucide Icons
**Backend:** Fiber (Go), FastAPI (Python), tonic gRPC (Rust), Quarkus (Java)
**AI/ML:** Google Gemini 2.0 (gemini-2.0-flash), Gemini Embeddings (text-embedding-004)
**Databases:** PostgreSQL 16 (TimescaleDB), MongoDB 7, Redis Stack, Elasticsearch 8, Neo4j 5
**Infrastructure:** Docker, Kubernetes, Kafka (KRaft), Keycloak, HashiCorp Vault
**Observability:** Prometheus, Grafana, Jaeger (OpenTelemetry), Loki, Sentry
**Deployment:** Netlify (frontend), Render.com (backend), Cloudflare Workers (edge)
**Monorepo:** Turborepo, pnpm workspaces

---

## 4. Testing Instructions

### Live Demo Access

**Frontend URL:** *(Deploy the `apps/web/dist` folder to Netlify via drag-and-drop)*

### Demo Accounts

| Tier | Email | Password | Features |
|------|-------|----------|----------|
| **Professional** | `pro@archlens.io` | `ProDemo2025!` | Dashboard, Code Analysis, Semantic Search, Dependencies, Drift Detection, Security Hub, Audit Log, Rules Engine, AI Insights, Custom Rules, API Access |
| **Institution** | `institution@archlens.io` | `InstitutionDemo2025!` | All Pro features + Strategic Citadel, Sovereign Vault, SSO/SAML, Compliance Reports, Dedicated Support, Multi-Region, Advanced RBAC |

### How to Test

1. **Open the deployed frontend URL** (or run locally with `cd apps/web && npm run dev`)
2. **Landing Page** — Scroll through to see the full marketing site with "Powered by ddbis-rmc" in the footer
3. **Sign In** — Click "Sign In" in the navbar, then use the **Quick Demo Access** buttons to auto-fill credentials
4. **Dashboard** — Explore all 12 pages:
   - **Overview** — Architecture health metrics, service status, activity feed
   - **Code Analysis** — AI-powered file analysis with severity ratings
   - **Semantic Search** — Natural-language codebase queries
   - **Dependencies** — Package health and dependency graph
   - **Drift Detection** — Architectural deviation monitoring
   - **Rules Engine** — Toggle-able architectural invariant rules
   - **Security Hub** — CVE tracking and vulnerability management
   - **Audit Log** — Immutable action timeline
   - **Strategic Citadel** — Service mesh topology *(Institution only)*
   - **Sovereign Vault** — Cryptographic decision ledger *(Institution only)*
   - **Metrics** — Performance charts and system indicators
   - **Settings** — Profile, notifications, security, plan management
5. **Sign Out** — Click the sign-out button in the sidebar, then sign in with the other demo account to compare feature access
6. **Sign Up** — Test the registration flow from the "Get Started" button
7. **Forgot Password** — Test the password recovery flow from the sign-in page

### Local Development

```bash
# Frontend
cd apps/web
pnpm install
pnpm dev          # → http://localhost:3000

# Backend (requires Docker)
docker-compose up -d
# API Gateway: http://localhost:8000
# Cognitive:   http://localhost:8100
# Citadel:     http://localhost:8200
# Vault:       http://localhost:8300
```

### Backend API Quick Test (PowerShell)

```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:8000/health

# Trigger analysis (requires JWT)
$headers = @{ "Authorization" = "Bearer <your-jwt-token>" }
Invoke-WebRequest -Uri http://localhost:8000/api/v1/analysis/trigger -Method POST -Headers $headers -Body '{"repo_id":"test"}' -ContentType "application/json"
```

---

## 5. Render.com Environment Variables

### API Gateway (`archlens-api-gateway`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `APP_ENV` | Environment | `production` |
| `APP_PORT` | Server port | `8000` |
| `JWT_SECRET` | JWT signing secret | *(generate a strong random string)* |
| `CORS_ORIGINS` | Allowed origins | `https://your-netlify-site.netlify.app` |
| `DB_HOST` | PostgreSQL host | *(from Render PostgreSQL or external provider)* |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL username | `archlens` |
| `DB_PASSWORD` | PostgreSQL password | *(your DB password)* |
| `DB_NAME` | PostgreSQL database | `archlens` |
| `REDIS_ADDR` | Redis connection | *(from Render Redis or Upstash)* |
| `KAFKA_BROKER` | Kafka broker | *(from Confluent Cloud or Upstash Kafka)* |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry endpoint | *(optional, e.g., Jaeger Cloud)* |
| `COGNITIVE_SERVICE_URL` | Cognitive service URL | `https://archlens-cognitive.onrender.com` |
| `CITADEL_SERVICE_URL` | Citadel service URL | `https://archlens-citadel.onrender.com` |
| `VAULT_SERVICE_URL` | Vault service URL | `https://archlens-vault.onrender.com` |
| `MONGO_URI` | MongoDB connection | *(from MongoDB Atlas)* |

### Cognitive Service (`archlens-cognitive`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `GOOGLE_AI_KEY` | **Gemini API Key** (required) | *(from Google AI Studio)* |
| `APP_ENV` | Environment | `production` |
| `REDIS_ADDR` | Redis connection | *(same as API Gateway)* |
| `ELASTICSEARCH_URL` | Elasticsearch URL | *(from Elastic Cloud or Bonsai)* |
| `KAFKA_BROKER` | Kafka broker | *(same as API Gateway)* |

### Strategic Citadel (`archlens-citadel`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `APP_ENV` | Environment | `production` |
| `APP_PORT` | Server port | `8200` |
| `DB_HOST` | PostgreSQL host | *(same as API Gateway)* |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL username | `archlens` |
| `DB_PASSWORD` | PostgreSQL password | *(same as API Gateway)* |
| `DB_NAME` | PostgreSQL database | `archlens` |
| `REDIS_ADDR` | Redis connection | *(same as API Gateway)* |
| `KAFKA_BROKER` | Kafka broker | *(same as API Gateway)* |

### Sovereign Vault (`archlens-vault`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `APP_ENV` | Environment | `production` |
| `APP_PORT` | Server port | `8300` |
| `MONGO_URI` | MongoDB connection | *(from MongoDB Atlas)* |
| `MONGO_DATABASE` | MongoDB database name | `archlens` |
| `REDIS_ADDR` | Redis connection | *(same as API Gateway)* |

### Recommended External Services for Render.com

| Service | Provider | Free Tier Available |
|---------|----------|---------------------|
| PostgreSQL | Render PostgreSQL or Neon | Yes |
| MongoDB | MongoDB Atlas | Yes (512MB) |
| Redis | Upstash Redis | Yes (10K commands/day) |
| Elasticsearch | Bonsai or Elastic Cloud | Yes (trial) |
| Kafka | Upstash Kafka or Confluent Cloud | Yes (limited) |

---
