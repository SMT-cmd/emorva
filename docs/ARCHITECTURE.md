# Emorva architecture — React + TypeScript + Cloudflare

## Platform choice
- **Website UI:** React 19 + TypeScript with Vite, mobile first, accessible components.
- **API + Telegram:** TypeScript Worker at \`worker/index.ts\` with all endpoints under \`/api/\`.
- **Hosted assets:** Cloudflare Workers Static Assets; generated African romantic photography is maintained as separate optimized WebP files in \`public/assets\`.
- **Data:** D1 for profiles, search policies, availability and audit; encrypted private storage only if necessary.
- **Identity:** secure age assurance is a prerequisite; enhanced Dojah verification can be optional for certain features.
- **Payments:** provider-approved web services versus Telegram-native digital Stars; never fake balances or webhooks.
- **Back office:** protected member moderation, finance and support services will be added after authentication is implemented.
- **Creator economy:** separate module for compliant content, user consent and earning ledger; no unrestricted commercial sexual brokerage.

## Why this over plain HTML?
HTML remains browser output, but a component-driven TypeScript application makes nested navigation, complex profile forms, credit ledgers, realtime matching and future Mini App reuse maintainable. Workers process APIs independently of React rendering.

## Safety state
All matching, paid services, adult profile uploads and contact sharing are **disabled** until full implementation, verification, privacy and payment-provider clearance. The current Telegram bot only shows proposed categories and prices.

## Development constraints
Single \`main\` branch, **no GitHub Actions**. Review and test locally or through Cloudflare Workers Builds if configured. Do not claim a build succeeds without actually running it.
