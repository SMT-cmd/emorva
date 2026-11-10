-- Emorva schema v1, intended for Cloudflare D1 (SQLite).
-- Real introductions/payments must remain disabled until operational controls are complete.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS early_access (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 email TEXT NOT NULL UNIQUE,
 consent_at TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 unsubscribed_at TEXT
);
CREATE TABLE IF NOT EXISTS early_access_rate (
 id TEXT PRIMARY KEY,
 day TEXT NOT NULL,
 submissions INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS members (
 id TEXT PRIMARY KEY,
 telegram_user_id TEXT UNIQUE,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','suspended','deleted')),
 adult_assurance_status TEXT NOT NULL DEFAULT 'unverified' CHECK(adult_assurance_status IN ('unverified','pending','passed','failed')),
 identity_status TEXT NOT NULL DEFAULT 'unverified' CHECK(identity_status IN ('unverified','pending','verified','rejected')),
 age_assured_at TEXT,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS member_profiles (
 member_id TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
 public_name TEXT,
 age_years INTEGER,
 city TEXT,
 area TEXT,
 bio TEXT,
 visibility TEXT NOT NULL DEFAULT 'hidden' CHECK(visibility IN ('hidden','discovery','approved-only')),
 permits_invites INTEGER NOT NULL DEFAULT 0 CHECK(permits_invites IN (0,1)),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS member_intents (
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 intent_id TEXT NOT NULL,
 enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
 PRIMARY KEY(member_id,intent_id)
);
CREATE TABLE IF NOT EXISTS profile_media (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 telegram_file_id TEXT,
 telegram_unique_id TEXT,
 media_type TEXT NOT NULL CHECK(media_type IN ('photo','video')),
 audience TEXT NOT NULL DEFAULT 'approved-only' CHECK(audience IN ('hidden','discovery','approved-only')),
 moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK(moderation_status IN ('pending','approved','rejected')),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS availability_sessions (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL REFERENCES members(id),
 intent_id TEXT NOT NULL,
 started_at TEXT NOT NULL,
 expires_at TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('reserved','completed','expired','cancelled')),
 reserve_credits INTEGER NOT NULL CHECK(reserve_credits>=0),
 settled_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_availability_on_intent ON availability_sessions(intent_id,state,expires_at);
CREATE TABLE IF NOT EXISTS introduction_requests (
 id TEXT PRIMARY KEY,
 requester_id TEXT NOT NULL REFERENCES members(id),
 recipient_id TEXT NOT NULL REFERENCES members(id),
 intent_id TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('requested','recipient_accepted','both_accepted','pending_payment','completed','declined','cancelled','expired')),
 requester_approved_at TEXT,
 recipient_approved_at TEXT,
 consent_to_contact_share_at TEXT,
 completed_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 expires_at TEXT NOT NULL,
 CHECK(requester_id<>recipient_id)
);
CREATE INDEX IF NOT EXISTS idx_intros_requester ON introduction_requests(requester_id,state);
CREATE INDEX IF NOT EXISTS idx_intros_recipient ON introduction_requests(recipient_id,state);
CREATE TABLE IF NOT EXISTS wallets (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL REFERENCES members(id),
 kind TEXT NOT NULL CHECK(kind IN ('search','connection_web','connection_telegram')),
 currency TEXT NOT NULL CHECK(currency IN ('SEARCH','WEB_CREDIT','XTR')),
 balance INTEGER NOT NULL DEFAULT 0 CHECK(balance>=0),
 reserved INTEGER NOT NULL DEFAULT 0 CHECK(reserved>=0),
 UNIQUE(member_id,kind)
);
CREATE TABLE IF NOT EXISTS ledger_entries (
 id TEXT PRIMARY KEY,
 wallet_id TEXT NOT NULL REFERENCES wallets(id),
 amount INTEGER NOT NULL,
 source TEXT NOT NULL,
 idempotency_key TEXT NOT NULL UNIQUE,
 reference_id TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ledger_wallet ON ledger_entries(wallet_id,created_at);
CREATE TABLE IF NOT EXISTS purchases (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL REFERENCES members(id),
 gateway TEXT NOT NULL,
 provider_reference TEXT UNIQUE,
 amount_minor INTEGER NOT NULL CHECK(amount_minor>=0),
 currency TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('created','paid','failed','refunded')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 verified_at TEXT
);
CREATE TABLE IF NOT EXISTS contact_permissions (
 introduction_id TEXT NOT NULL REFERENCES introduction_requests(id) ON DELETE CASCADE,
 member_id TEXT NOT NULL REFERENCES members(id),
 channel TEXT NOT NULL CHECK(channel IN ('telegram','email','whatsapp')),
 encrypted_value TEXT NOT NULL,
 encrypted_iv TEXT NOT NULL,
 explicitly_approved_at TEXT NOT NULL,
 withdrawn_at TEXT,
 PRIMARY KEY(introduction_id,member_id,channel)
);
CREATE TABLE IF NOT EXISTS reports (
 id TEXT PRIMARY KEY,
 reporter_id TEXT REFERENCES members(id),
 reported_member_id TEXT REFERENCES members(id),
 kind TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'open',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS admin_audit (
 id TEXT PRIMARY KEY,
 actor TEXT NOT NULL,
 action TEXT NOT NULL,
 subject TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
