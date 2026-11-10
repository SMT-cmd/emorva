# Emorva privacy and release gates

The signed Telegram Mini App data is validated server-side before member API access.
The user ID from `initDataUnsafe`, URL query parameters and browser memory is never trusted.
A self-declared age is never proof of adulthood. Matching requires `status=active` and
`adult_assurance_status=passed`, set only after verified provider processing.
Dojah verification must authenticate provider responses before changing those fields.

Search requests return opted-in, adult-assured profiles with no contact fields and
deduct only free SEARCH credits. Requests use idempotency keys and a server-side ledger.
Interest requests do not unlock private contacts or debit paid credits.

To launch real introductions, implement recipient consent, both-party approved
contact methods, provider-verified payment, refund policy, moderation, deletion,
abuse controls, audit logs, and legal/payment-platform approval. These must be tested
before enabling the release gates. Do not enable commercial sexual-service brokerage.

Telegram-native digital services must use Telegram Stars (XTR) as required by Telegram.
No alternative web-credit checkout should be disguised as a Stars transaction.

Protected APIs: `GET/POST /api/me`, `POST /api/search`, and
`GET/POST /api/introductions` require a signed Telegram Mini App session and D1.
