# Emorva development status

As of 2026-11-10.

| Area | Status |
|---|---|
| React + TypeScript website source | Written, not build-verified |
| Vite + Cloudflare Workers application configuration | Written, not deployed |
| Velvet Romance styling | Included |
| Generated Black/African adult website photographs | Generated separately, not yet committed to \`public/assets\` |
| Interactive nested service catalogue | Implemented in React |
| Telegram read-only catalogue bot | Handler implemented, needs BotFather setup and live validation |
| Health and catalogue API | Implemented, not runtime-tested |
| Early-access email endpoint | Disabled until binding and secrets configured |
| D1 schema | Drafted, not applied |
| Live member profiles and Telegram-linked authentication | Not implemented |
| Adult-age assurance and Dojah integration | Not implemented |
| Matching engine and consent state machine | Not implemented |
| Credit ledger / paid introductions / webhook payments | Not implemented |
| Protected private contact exchange | Not implemented |
| Creator content and payouts | Not implemented |
| Moderation and Founder admin dashboard | Not implemented |
| Cloudflare deployment | Not configured |
| Legal/privacy/payment-provider approval | Outstanding |

## Non-negotiable technical controls
A website balance is not sufficient proof of payment. No contact exchange or availability-credit settlement before state-machine validation, durable idempotent ledger entries, age assurance and mutual consent. Avoid using third-party media as real member profiles.

## Build rules
Use one GitHub \`main\` branch; no GitHub Actions; do not modify the \`rea\` fork or other production projects. Do not claim the site is live without checking a deployment.
