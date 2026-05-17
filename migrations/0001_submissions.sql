CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  campaign_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  title TEXT,
  description TEXT,
  portfolio_url TEXT,
  preview_link TEXT,
  full_resolution_link_optional TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  file_count INTEGER NOT NULL DEFAULT 0,
  total_bytes INTEGER NOT NULL DEFAULT 0,
  r2_prefix TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_magic_link_sent_at TEXT,
  UNIQUE (campaign_slug, email_hash)
);

CREATE INDEX IF NOT EXISTS idx_submissions_updated_at
ON submissions (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_status
ON submissions (status);

CREATE TABLE IF NOT EXISTS magic_links (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_magic_links_email_created
ON magic_links (email_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_magic_links_token
ON magic_links (token_hash);
