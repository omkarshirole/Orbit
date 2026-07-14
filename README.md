# Orbit

<p align="center">
  <img src="https://img.shields.io/badge/Orbit-v0.1.0-635bff?style=for-the-badge&logo=rocket&logoColor=white" alt="Orbit">
</p>

<p align="center">
  <strong>Every order. One orbit.</strong>
</p>

<p align="center">
  A full-stack Next.js application for tracking online orders from Gmail and courier updates from AfterShip.
  Separates Google sign-in from Gmail mailbox consent, stores Gmail tokens encrypted, and keeps user data isolated with Supabase Row Level Security.
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-✨-purple?style=flat-square" alt="Features"></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-🏗️-blue?style=flat-square" alt="Architecture"></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick_Start-🚀-green?style=flat-square" alt="Quick Start"></a>
  <a href="#environment-variables"><img src="https://img.shields.io/badge/Environment_Variables-🔐-orange?style=flat-square" alt="Environment Variables"></a>
  <a href="#deployment"><img src="https://img.shields.io/badge/Deployment-☁️-cyan?style=flat-square" alt="Deployment"></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/Contributing-🤝-pink?style=flat-square" alt="Contributing"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white" alt="TanStack Query">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright">
</p>

---

## ✨ Features

### 📧 Gmail Integration
- **OAuth 2.0 with granular scopes** – Sign in with Google (identity only), then explicitly grant Gmail read access from the dashboard
- **Encrypted token storage** – AES-256-GCM encryption for access/refresh tokens before persisting to Supabase
- **Automated sync** – Background job scans purchase-related emails (last 180 days) and extracts order/tracking data
- **Smart parsing** – Regex-based extraction for order IDs, tracking numbers, couriers, prices, dates, and statuses
- **Deduplication** – Upserts by `source_message_id`, `external_order_id`, or `tracking_number`

### 📦 AfterShip Tracking
- **Real-time webhooks** – HMAC-SHA256 verified webhook endpoint for instant courier updates
- **Courier auto-detection** – AfterShip courier detection API for unknown tracking numbers
- **Tracking registration** – Register pending shipments to AfterShip on demand
- **Event normalization** – Maps AfterShip checkpoints to unified `OrderStatus` enum

### 🎯 Dashboard
- **Real-time updates** – Supabase Realtime subscriptions for orders, tracking events, notifications
- **Smart filters** – Active, Shipped, Delivered, Delayed, Returns, Cancelled, Arriving Today
- **Search** – Full-text search across product name, store, order ID, tracking number
- **Progress visualization** – Visual delivery progress bars per order
- **Manual order entry** – Add orders with tracking numbers when email parsing misses them

### 🔒 Security First
- **Row Level Security (RLS)** – Every table scoped to `auth.uid()`; no cross-user data leaks
- **Encrypted secrets** – Gmail tokens encrypted at rest; `gmail_tokens` table revoked from `anon`/`authenticated` roles
- **Signed OAuth state** – HMAC-signed, timestamped, nonce-protected state parameter for Gmail OAuth flow
- **Timing-safe comparisons** – Constant-time string comparison for webhook signatures and OAuth state
- **Idempotent webhooks** – Unique constraints + upserts prevent duplicate processing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ORBIT                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Browser    │◄──►│  Next.js     │◄──►│  Supabase    │◄──►│  AfterShip│  │
│  │  (React 19)  │    │  App Router  │    │  (Auth/DB/   │    │  (Tracking│  │
│  │  TanStack Q  │    │  (Server/    │    │   Realtime)  │    │   API)    │  │
│  └──────────────┘    │   Client)    │    └──────────────┘    └───────────┘  │
│         ▲            └──────┬───────┘            ▲                ▲         │
│         │                   │                    │                │         │
│         │        ┌──────────┴──────────┐         │                │         │
│         │        ▼                     ▼         ▼                ▼         │
│         │  ┌─────────┐            ┌──────────┐  ┌────────┐   ┌──────────┐   │
│         │  │ Gmail   │            │ Database │  │ Webhook│   │ Courier  │   │
│         │  │ API     │            │ Tables   │  │ Handler│   │ Detection│   │
│         │  └─────────┘            └──────────┘  └────────┘   └──────────┘   │
│         │                                              │                    │
│         └──────────────────────────────────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

| Flow | Description |
|------|-------------|
| **Auth** | Supabase Google OAuth → Session cookie → Server/client clients |
| **Gmail Connect** | User clicks "Connect Gmail" → Signed OAuth state → Google consent → Callback stores encrypted tokens |
| **Sync** | POST `/api/gmail/sync` → Fetch messages → Parse → Upsert orders/shipments → Register with AfterShip |
| **Webhook** | AfterShip POST → Verify HMAC → Parse events → Upsert tracking_events → Update order status → Notify |
| **Realtime** | Supabase Realtime → TanStack Query invalidation → UI updates instantly |

### Database Schema (Supabase)

```sql
profiles              -- User profile (avatar, name)
orders                -- Core order data (store, product, price, status, source)
shipments             -- Tracking info (courier, tracking_number, provider_tracking_id)
tracking_events       -- Immutable checkpoint history from AfterShip
gmail_tokens          -- Encrypted access/refresh tokens (RLS: service role only)
gmail_sync_runs       -- Sync job history & stats
gmail_sync_logs       -- Per-message error logs
notifications         -- User-facing alerts (delivery, delay, return, refund)
returns               -- Return/refund lifecycle tracking
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Supabase** project (free tier works)
- **Google Cloud** project with Gmail API enabled
- **AfterShip** account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/orbit-order-hub.git
cd orbit-order-hub
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in all variables in `.env.local` (see [Environment Variables](#environment-variables)).

**Generate encryption key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Paste output as TOKEN_ENCRYPTION_KEY
```

### 3. Setup Supabase

1. Create a new Supabase project
2. Go to **SQL Editor** → Run the migration:
   ```bash
   # Or copy contents of supabase/migrations/202607140001_orbit_schema.sql
   ```
3. Enable **Realtime** for tables: `orders`, `tracking_events`, `notifications`
4. Copy **Project URL** and **anon/public key** to `.env.local`
5. Copy **service_role key** (Settings → API) to `.env.local`

### 4. Configure Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → Create project
2. **APIs & Services** → Enable **Gmail API**
3. **OAuth Consent Screen** → External → Add test users (your email)
4. **Credentials** → Create **OAuth 2.0 Client ID** (Web application)
5. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/public/gmail-oauth-callback
   ```
6. Copy **Client ID** and **Client Secret** to `.env.local`

### 5. Configure AfterShip

1. [AfterShip](https://www.aftership.com/) → Create account → Get **API Key**
2. **Webhooks** → Add webhook:
   ```
   URL: http://localhost:3000/api/public/aftership-webhook
   Events: All tracking updates
   ```
3. Copy **Webhook Secret** to `AFTERSHIP_WEBHOOK_SECRET`
4. Copy **API Key** to `AFTERSHIP_API_KEY`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PUBLIC_APP_URL` | ✅ | Canonical app URL (no trailing slash) | `http://localhost:3000` |
| `SUPABASE_URL` | ✅ | Supabase project URL (server) | `https://xxx.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase anon key (server) | `eyJ...` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase URL (browser) | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase anon key (browser) | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server only) | `eyJ...` |
| `GOOGLE_OAUTH_CLIENT_ID` | ✅ | Google OAuth client ID | `123.apps.googleusercontent.com` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | ✅ | Google OAuth client secret | `GOCSPX...` |
| `GMAIL_OAUTH_STATE_SECRET` | ✅ | Random string for signing OAuth state | `openssl rand -base64 32` |
| `AFTERSHIP_API_KEY` | ✅ | AfterShip API key | `xxx-xxx-xxx` |
| `AFTERSHIP_WEBHOOK_SECRET` | ✅ | AfterShip webhook signing secret | `whsec_...` |
| `TOKEN_ENCRYPTION_KEY` | ✅ | Base64 32-byte key for token encryption | `node -e "..."` |

> **Never commit `.env.local`** – it's in `.gitignore`.

---

## 📡 API Reference

### Authentication
- `GET /api/auth/callback` – Supabase OAuth callback handler

### Gmail
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/gmail/connect` | Returns Google OAuth URL for Gmail scope |
| `GET` | `/api/public/gmail-oauth-callback` | OAuth callback; stores encrypted tokens |
| `POST` | `/api/gmail/sync` | Triggers Gmail order sync (auth required) |
| `POST` | `/api/gmail/disconnect` | Revokes tokens & optionally deletes imported orders |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List orders with filters (`q`, `filter`) |
| `POST` | `/api/orders` | Create manual order with tracking |
| `GET` | `/api/orders/[id]` | Get order with shipments & events |
| `DELETE` | `/api/orders/[id]` | Delete order (cascades) |

### Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tracking/register-pending` | Register unregistered shipments to AfterShip |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | List recent notifications |
| `PATCH` | `/api/notifications` | Mark as read (`{ notificationId }` or `{ markAll: true }`) |

### Webhooks (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/public/aftership-webhook` | AfterShip tracking updates (HMAC verified) |

---

## 🧪 Testing

```bash
# Unit & integration tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Format check
npm run format:check

# E2E tests (requires running dev server)
npm run test:e2e

# Full CI pipeline
npm run test && npm run typecheck && npm run lint && npm run build
```

### Test Structure

```
tests/
├── setup.ts              # Jest DOM matchers
├── security.test.ts      # OAuth state, webhook signatures, encryption
├── schemas.test.ts       # Zod validation schemas
└── parser.test.ts        # Gmail parser (courier detection, status normalization)
```

---

## 📦 Project Structure

```
orbit-order-hub/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts
│   │   ├── gmail/
│   │   │   ├── connect/route.ts
│   │   │   ├── disconnect/route.ts
│   │   │   └── sync/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── notifications/route.ts
│   │   ├── public/
│   │   │   ├── gmail-oauth-callback/route.ts
│   │   │   └── aftership-webhook/route.ts
│   │   └── tracking/register-pending/route.ts
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/status-badge.tsx
│   ├── auth-panel.tsx
│   ├── dashboard-app.tsx
│   └── query-provider.tsx
├── lib/
│   ├── constants.ts          # Order statuses, couriers, stores, Gmail query
│   ├── env.ts                # Zod-validated environment access
│   ├── schemas.ts            # Zod validation schemas
│   ├── security.ts           # Crypto: encryption, HMAC, OAuth state
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client + admin client + auth helpers
│   ├── gmail/
│   │   ├── oauth.ts          # Google OAuth flow
│   │   ├── parser.ts         # Email → order extraction
│   │   └── sync.ts           # Gmail sync orchestration
│   └── tracking/
│       ├── provider.ts       # TrackingProvider interface
│       └── aftership.ts      # AfterShip implementation + webhook parser
├── supabase/
│   └── migrations/
│       └── 202607140001_orbit_schema.sql
├── tests/
│   ├── security.test.ts
│   ├── schemas.test.ts
│   └── parser.test.ts
├── e2e/
│   └── dashboard.spec.ts
├── .env.example
├── .env.local (gitignored)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## ☁️ Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local` → **Settings → Environment Variables**
4. Update `PUBLIC_APP_URL` to production URL (e.g., `https://orbit.vercel.app`)
5. Update Google OAuth redirect URI to production callback URL
6. Update AfterShip webhook URL to production
7. Deploy

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build
docker build -t orbit-order-hub .

# Run
docker run -p 3000:3000 --env-file .env.local orbit-order-hub
```

### Supabase Production Checklist

- [ ] Run migration on production database
- [ ] Enable Realtime for `orders`, `tracking_events`, `notifications`
- [ ] Configure RLS policies (included in migration)
- [ ] Set up database backups
- [ ] Configure custom SMTP for auth emails (optional)

---

## 🔒 Security

| Measure | Implementation |
|---------|----------------|
| **Token Encryption** | AES-256-GCM with 32-byte base64 key (`TOKEN_ENCRYPTION_KEY`) |
| **OAuth State** | HMAC-SHA256 signed, 10-min TTL, nonce, user-bound |
| **Webhook Verification** | HMAC-SHA256, base64, timing-safe comparison |
| **RLS** | All tables: `auth.uid() = user_id`; `gmail_tokens` revoked from all roles |
| **Secrets** | Server-only env vars; `NEXT_PUBLIC_*` only for Supabase anon key |
| **Input Validation** | Zod schemas on all API inputs |
| **HTML Sanitization** | Raw email HTML never rendered |

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Token theft from DB | AES-256-GCM encryption at rest |
| OAuth replay/CSRF | Signed state with nonce, TTL, user binding |
| Webhook spoofing | HMAC verification + timing-safe compare |
| Cross-user data access | RLS policies on every table |
| XSS via email content | Text-only extraction; no HTML rendering |

---

## 🛠️ Development

### Commands

```bash
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm run start         # Run production build
npm run lint          # ESLint
npm run format:check  # Prettier check
npm run typecheck     # TypeScript (noEmit)
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
```

### Adding a New Courier

1. Add to `COURIERS` in `lib/constants.ts`
2. Add detection patterns (regex)
3. Test in `tests/parser.test.ts`

### Adding a New Order Status

1. Add to `ORDER_STATUSES` in `lib/constants.ts`
2. Update `normalizeStatus` in `lib/gmail/parser.ts`
3. Update `statusLabel` & `tone` in `components/ui/status-badge.tsx`
4. Add notification title in `app/api/public/aftership-webhook/route.ts`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run checks: `npm run test && npm run typecheck && npm run lint`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feat/amazing-feature`
7. Open a Pull Request

### Code Style

- **TypeScript** strict mode
- **ESLint** (Next.js core-web-vitals config)
- **Prettier** (single quotes, 2 spaces, trailing commas)
- **Conventional Commits** for commit messages

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) – Backend-as-a-Service
- [AfterShip](https://www.aftership.com/) – Tracking API
- [TanStack Query](https://tanstack.com/query) – Server state management
- [Lucide](https://lucide.dev/) – Icons
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Vitest](https://vitest.dev/) / [Playwright](https://playwright.dev/) – Testing

---

<p align="center">
  Made with ❤️ for developers who want their orders in one place.
</p>

<p align="center">
  <a href="https://github.com/omkarshirole/orbit/issues">Report Bug</a> •
  <a href="https://github.com/omkarshirole/orbit/issues">Request Feature</a> •
  <a href="https://github.com/omkarshirole/orbit/discussions">Discussions</a>
</p>
