UPDATE submissions
SET status = 'new'
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_submissions_campaign_status_updated
ON submissions(campaign_slug, status, updated_at);
