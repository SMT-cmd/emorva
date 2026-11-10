# Emorva

**Where chemistry begins.**

Emorva is a web-first, adult-only private matchmaking and creator platform. This repository contains our **original implementation**, not copied competitor code.

## Development principles
- Cloudflare Pages first, using its free-friendly `*.pages.dev` deployment and Pages Functions.
- One working `main` branch; **no GitHub Actions**.
- Website and Telegram bot share catalogue and account backend. Future Mini App uses the same service.
- Consent before introductions and contact release; age assurance required. Optional enhanced Dojah identity checks.
- Never imply payment guarantees intimacy, a meeting, or someone's consent.
- No Telegram payment workaround: Stars for Telegram-native paid digital services; web payments for independently delivered web services, subject to processor approval.
- No production payments or contact sharing until the full safeguards and payment approvals are verified.

## Current stage
Initial website, category catalogue, cloud functions and bot transport are being established. This is a development build, **not a launched service**.

## Brand
Emorva · Velvet Romance: plum/burgundy, rose pink, ivory · African adult photography · “Where chemistry begins.”

## Deployment (after setup)
Connect this repository to Cloudflare Pages as a static project with root directory `/` and no build command. Add Cloudflare Pages secrets and D1 bindings before enabling the private backend. See `docs/DEPLOY.md`.
