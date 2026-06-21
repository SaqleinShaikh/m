-- =====================================================
-- Saqlein Portfolio Database Schema - RESUME REQUESTS
-- =====================================================

-- Create resume_requests table
CREATE TABLE IF NOT EXISTS resume_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for lookup speed and order
CREATE INDEX IF NOT EXISTS idx_resume_requests_status ON resume_requests(status);
CREATE INDEX IF NOT EXISTS idx_resume_requests_created_at ON resume_requests(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can submit resume requests" ON resume_requests;
DROP POLICY IF EXISTS "Service role full access resume_requests" ON resume_requests;

-- Policies
-- Anyone can request a resume (insert)
CREATE POLICY "Public can submit resume requests" ON resume_requests FOR INSERT WITH CHECK (true);

-- Only admin (service_role) can view, update, or delete requests to keep contact info private
CREATE POLICY "Service role full access resume_requests" ON resume_requests FOR ALL USING (auth.role() = 'service_role');

-- Trigger to update updated_at automatically using existing helper function
DROP TRIGGER IF EXISTS update_resume_requests_updated_at ON resume_requests;
CREATE TRIGGER update_resume_requests_updated_at BEFORE UPDATE ON resume_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
