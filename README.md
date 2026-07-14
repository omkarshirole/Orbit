# Orbit

Every order. One orbit.

Orbit Order Hub is a full-stack Next.js application for tracking online orders from Gmail and courier updates from AfterShip. It separates Google sign-in from Gmail mailbox consent, stores Gmail tokens encrypted, and keeps user data isolated with Supabase Row Level Security.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, and Realtime
- TanStack Query
- Zod validation
- Google OAuth 2.0 and Gmail API
- AfterShip tracking API and webhooks
- Vitest and Playwright

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill the values through your local secret manager or shell environment. Do not paste secrets into chat or commit them.

3. Create a 32-byte token encryption key:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Store it as `TOKEN_ENCRYPTION_KEY`.

4. Apply `supabase/migrations/202607140001_orbit_schema.sql` to your Supabase project.

5. Run the app:

   ```bash
   npm run dev
   ```

## Environment Variables

- `PUBLIC_APP_URL`: canonical app URL, for example `http://localhost:3000` locally.
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: browser-safe Supabase anon/publishable key.
- `SUPABASE_SERVICE_ROLE_KEY`: backend-only service role key.
- `GOOGLE_OAUTH_CLIENT_ID`: Google OAuth web client ID.
- `GOOGLE_OAUTH_CLIENT_SECRET`: Google OAuth web client secret.
- `GMAIL_OAUTH_STATE_SECRET`: long random secret for signing OAuth state.
- `AFTERSHIP_API_KEY`: AfterShip API key.
- `AFTERSHIP_WEBHOOK_SECRET`: AfterShip webhook signing secret. This must not be the API key.
- `TOKEN_ENCRYPTION_KEY`: base64-encoded 32-byte key for Gmail token encryption.

## Google OAuth Setup

1. Create a Google Cloud project.
2. Enable the Gmail API.
3. Configure the OAuth consent screen and add test users while the app is in testing mode.
4. Create an OAuth web client.
5. Add this authorized redirect URI:

   ```text
   PUBLIC_APP_URL/api/public/gmail-oauth-callback
   ```

6. Authentication uses Supabase Google sign-in with identity scopes only. Gmail read access is requested separately from the dashboard with:

   ```text
   openid email profile https://www.googleapis.com/auth/gmail.readonly
   ```

## AfterShip Setup

1. Create an AfterShip account and API key.
2. Add `AFTERSHIP_API_KEY` to your secure environment.
3. Configure a webhook pointing to:

   ```text
   PUBLIC_APP_URL/api/public/aftership-webhook
   ```

4. Store the webhook secret in `AFTERSHIP_WEBHOOK_SECRET`.

The webhook route validates the raw body with `aftership-hmac-sha256`, HMAC SHA-256, base64 encoding, and a timing-safe comparison.

## Deployment Guide

Deploy to Vercel, Netlify, or another Next.js host that supports Node.js route handlers. Use Supabase free tier for database/auth/realtime. Configure all environment variables in the host secret manager, run the Supabase migration, and update `PUBLIC_APP_URL` to the production HTTPS URL before testing OAuth callbacks.

## Security Notes

- Gmail tokens are encrypted before storage.
- `gmail_tokens` has RLS enabled and direct frontend access revoked.
- Public endpoints validate signatures or session state.
- Backend routes derive user IDs from the authenticated session.
- Raw email HTML is never rendered.
- Webhook processing is idempotent through unique constraints and upserts.
- Destructive account/data actions should keep confirmation dialogs enabled in UI.

## Verification

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Credential-dependent checks require configured Supabase, Google OAuth, Gmail API, and AfterShip secrets.
