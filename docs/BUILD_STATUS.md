# Build status — Emorva

Last reviewed: 2026-11-10. The code in this repository is a **foundation**, not a launched production matchmaking service.

| Area | Status |
|---|---|
| Original mobile-responsive landing page / approved brand styling | Implemented (image assets being added) |
| Nested pricing exploration and transparent proposed fees | Implemented |
| Public API catalogue and health endpoint | Implemented |
| Early access form + D1 endpoint | Implemented; disabled until D1 and secrets configured |
| Telegram /start, nested menus and price previews | Implemented transport; requires bot setup |
| D1 database schema for member and financial records | Drafted; not yet migrated |
| Dojah adult and identity verification | NOT implemented |
| Member authentication / profiles / media moderation | NOT implemented |
| Verified matches, safe contact exchange / consent | NOT implemented |
| Credit reservations / double-entry ledger / payment webhook | NOT implemented |
| Production payment provider approval and Telegram Stars | NOT confirmed |
| Creator marketplace / subscriptions / live streaming | NOT implemented |
| Admin dashboard / role access / abuse reports | NOT implemented |
| Deployment to Cloudflare | NOT configured |
| Legal, privacy, policy and operations review | NOT complete |

## Architecture boundaries
Website payments must fund independently delivered website services, subject to PSP approval. Telegram-native digital services require Telegram Stars unless Telegram confirms another arrangement. This repository never implements web-credit payments for Telegram-native paid features as a circumvention route.

## Brand assets
The accepted style uses deep plum / burgundy and rose pink with African adult photography. We must use actual generated site assets, not a poster screenshot. All marketing images are fictional illustrations and must not be presented as real member profiles.

## Development workflow
One repository, one \`main\` working branch. No GitHub Actions, no copying closed-source competitor implementations, no deployment claims without verification.
