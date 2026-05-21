-- =====================================================
-- Saqlein Portfolio Database Schema - EMAIL TRIGGER LOGS
-- =====================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL CHECK (email_type IN ('contact_notification', 'contact_auto_response', 'endorsement_submission', 'endorsement_approval', 'password_reset', 'unknown')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'fail')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance and lookup
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Service role full access email_logs" ON email_logs;

-- Restrict read/write only to service_role (Admin clients)
-- Anonymous and Authenticated users will have NO access, keeping audit logs secure.
CREATE POLICY "Service role full access email_logs" ON email_logs FOR ALL USING (auth.role() = 'service_role');
