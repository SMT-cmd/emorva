-- Requires database/schema.sql first.
CREATE TABLE IF NOT EXISTS monthly_search_grants(
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 period TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(member_id,period)
);
CREATE TABLE IF NOT EXISTS search_requests(
 id TEXT PRIMARY KEY, member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 intent_id TEXT NOT NULL, units INTEGER NOT NULL CHECK(units>=0),
 results_json TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_searches_member ON search_requests(member_id,created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_city_visibility ON member_profiles(city,visibility,permits_invites);
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_availability_member ON availability_sessions(member_id,intent_id) WHERE state='reserved';
