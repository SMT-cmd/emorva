# Emorva

**Where chemistry begins.**

An original, web-first adults-only matchmaking and future creator ecosystem. The site is available at **https://emorva.pages.dev**, but the matchmaking product is **in development**. It is not accepting paid introductions, creator purchases or private contact exchanges.

## Application stack

- **Web:** React 19 + TypeScript + Vite, branded in the Velvet Romance identity.
- **Server:** Cloudflare Workers in TypeScript (\`worker/index.ts\`).
- **Data:** Cloudflare D1 schema in \`database/schema.sql\` and \`database/0002_member_features.sql\` has been applied to the Emorva D1 database.
- **Telegram:** Read-only nested category bot menus; actual matchmaking not yet enabled.
- **Images:** Four original African adult romantic photographs and the accepted Emorva ribbon mark are committed to `public/assets/`.
- **No Vercel and no GitHub Actions.** One working branch: \`main\`.

## First local run

\`\`\`bash
npm install
npm run dev
npm run build
npm test
\`\`\`

To deploy, use Cloudflare Workers and follow [docs/DEPLOY_WORKERS.md](docs/DEPLOY_WORKERS.md). The Worker offers \`/api/catalog\`, \`/api/health\`, \`/api/early-access\` and \`/api/telegram/webhook\`. Waitlist collection is disabled unless configured with a D1 binding and secret.

## Product principles

- Age assurance is required for adult access, while enhanced Dojah identity verification is a separate trust tier.
- Explicit mutual consent is required before introductions and contact sharing.
- Free search credit allowance; commercial fees are **proposals**, not a live checkout.
- The 24-hour "I'm Available" credit reserve returns automatically if no qualifying mutual introduction completes, once implemented.
- Web and Telegram channels have separate payment compliance rules; Telegram-native digital services use Stars unless explicit authorization says otherwise.
- No one can purchase another person's romantic or sexual consent.
- No commercial sexual-service brokerage, no illicit data gathering, and no copied competitor code/assets.

## Project documents

- [Current status](docs/BUILD_STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Cloudflare setup](docs/DEPLOY_WORKERS.md)

The reference fork [SMT-cmd/rea](https://github.com/SMT-cmd/rea) is an **independent research tool**, not the Emorva application's source code.
