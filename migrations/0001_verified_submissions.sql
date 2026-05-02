CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  opens_at TEXT,
  closes_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
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
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_magic_link_sent_at TEXT,
  FOREIGN KEY (campaign_slug) REFERENCES campaigns(slug),
  UNIQUE (campaign_slug, email_hash)
);

CREATE TABLE IF NOT EXISTS magic_links (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_submissions_campaign_email ON submissions(campaign_slug, email_hash);
CREATE INDEX IF NOT EXISTS idx_submissions_updated_at ON submissions(updated_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_email_created ON magic_links(email_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash ON magic_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON magic_links(expires_at);

INSERT OR IGNORE INTO campaigns (id, slug, name, status)
VALUES ('campaign_open_call_2026', 'open-call', 'Anti-Fascist Art Exhibition Open Call', 'open');
