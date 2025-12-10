-- Shares tracking table
-- Tracks each share event for a report
-- Uses gen_random_uuid() for id generation

CREATE TABLE IF NOT EXISTS shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    platform TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional index to speed up aggregation
CREATE INDEX IF NOT EXISTS idx_shares_report_id ON shares(report_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
