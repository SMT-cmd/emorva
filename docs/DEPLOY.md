# Deploy Emorva to Cloudflare Pages

**Status:** staged foundation only. Do not enable real member matching, payments, content exchange, or verification until trust/safety and payment-provider approval are complete.

## Cloudflare Pages (free-friendly)
1. In Cloudflare > Workers & Pages > Create application > Pages > Connect to Git, select \`SMT-cmd/emorva\`.
2. Production branch: \`main\`. Framework preset: **None**. Root directory: \`/\`. Build command: **none**. Build output: \`/\` (repository root).
3. Cloudflare will provide a project address such as \`<your-project>.pages.dev\`. The actual URL is only known after creation.
4. Create a D1 database in Cloudflare > Storage & databases > D1. Run \`database/schema.sql\` in the D1 SQL console, then bind it to the Pages project as **DB** in Settings > Bindings. Redeploy.
5. For early-access email collection, set Pages environment variables \`WAITLIST_ENABLED=true\` and secret \`RATE_LIMIT_SALT\` (long cryptographically random value). Until configured, the API deliberately responds with HTTP 503 instead of pretending to save email.
6. Add WAF / rate limiting protections when available. Add Turnstile and double-opt-in email confirmation before a public marketing campaign.

## Telegram bot (not yet accepting matches)
1. Create a bot in Telegram through the official BotFather.
2. In Pages > Settings > Variables and Secrets, add **encrypted** \`TELEGRAM_BOT_TOKEN\` and \`TELEGRAM_WEBHOOK_SECRET\` (random secret token; Telegram allows A-Z, a-z, 0-9, _, -).
3. After deployment, register \`https://YOUR-PAGES-URL/api/telegram/webhook\` as your webhook via Telegram's \`setWebhook\` API, including the same \`secret_token\`. Never commit these values.
4. Verify \`/start\` and nested category menus. The bot is deliberately read-only: no member matches, contacts, charges, or identity records are enabled.
5. Configure the right production domain before making links available publicly.

## Before live onboarding
- Apply an age-assurance solution and documented compliance rules for the launch region.
- Connect enhanced Dojah identity verification and protect its webhook/signature.
- Select a payment provider that has **explicitly approved** the exact business model.
- Implement double-consent checks and encrypted contact storage before exchange.
- Add privacy policy, terms, deletion requests, blocking, moderation, admin roles, incident handling, refunds, fraud checks and audit trails.
- Confirm Telegram Stars requirements for all bot / Mini App paid digital services.
- Add generated photos and test all mobile breakpoints, image crops, accessibility and reduced-motion controls.
- Enable onboarding and transactions only after end-to-end staging verification.

**No GitHub Actions.** Cloudflare Pages' own Git integration can deploy changes from \`main\`.
