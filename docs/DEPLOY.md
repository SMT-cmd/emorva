# Emorva Cloudflare deployment

## Current production architecture
The main application uses React 19 + TypeScript and Cloudflare Workers + D1.
The Vite+Workers configuration remains in `wrangler.jsonc` and `vite.config.ts`.

## Cloudflare Pages staging
A GitHub-connected Pages project named `emorva` builds the React application with
`npm run build:pages` using `vite.pages.config.ts`. The existing Pages Functions
under `functions/api` provide read-only catalogue, a health check, waitlist registration
when configured, and a read-only Telegram navigation endpoint.
The Pages release is an **early-access staging release**, not an operating matchmaking service.

## Workers full-stack release
To deploy all Worker routes with static assets, use `npm run deploy` after installing
dependencies and completing required security/identity/payment integrations. Do not turn
on payments, profile discovery, contact exchange or creator withdrawals before testing
their complete access-control and reconciliation flows.

D1 schema: `database/schema.sql`. Never store raw Dojah identity documents in public
storage. Telegram native paid digital services use Stars subject to current policy.

The Cloudflare deployment is independent of GitHub Actions.
