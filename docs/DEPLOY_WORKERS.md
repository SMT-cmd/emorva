# Cloudflare Workers + Vite deployment

The previous Pages-only prototype has been upgraded to React + TypeScript with a TypeScript Cloudflare Worker.

1. Use Node.js version supported by your installed Vite and Cloudflare plugin.
2. Run \`npm install\`, then \`npm run build\` and \`npm test\`.
3. Run \`npm run dev\` for local development, then \`npm run preview\` to test the Worker build.
4. Use \`wrangler login\` and \`npm run deploy\` to deploy to \`*.workers.dev\`, or connect this repository to Cloudflare Workers Builds using \`main\` (not GitHub Actions).
5. D1: create a database, apply \`database/schema.sql\`, then add a D1 binding named \`DB\` to the Worker.
6. The early-access API is disabled by default. Only enable after the D1 database is bound and a long random \`RATE_LIMIT_SALT\` secret is configured. Set \`WAITLIST_ENABLED=true\`.
7. Configure \`TELEGRAM_BOT_TOKEN\` and \`TELEGRAM_WEBHOOK_SECRET\` via \`wrangler secret put\`, then register the Worker URL \`/api/telegram/webhook\` through BotFather's Telegram bot and the official setWebhook endpoint.
8. Member registration, payments, media uploads, identity verification and contact sharing are not live. The current bot is for read-only navigation.

**Note:** The original Pages Functions files under \`functions/\` are legacy reference code. The Worker is the only active production backend with the new Vite configuration.

## Image assets
The Emorva visual system references \`/assets/hero.webp\`, \`/assets/story.webp\`, \`/assets/creator.webp\`, and \`/assets/closing.webp\`. Upload optimized generated photographic assets to \`public/assets/\` before presenting the website. Until then, those sections use their graceful burgundy CSS background.
