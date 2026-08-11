-- Create analytics_sessions table
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    user_agent TEXT,
    referrer TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES public.analytics_sessions(session_id) ON DELETE CASCADE,
    path VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    duration INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow public insert to analytics_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "Allow public insert to analytics_page_views" ON public.analytics_page_views;
DROP POLICY IF EXISTS "Allow public update to analytics_page_views" ON public.analytics_page_views;
DROP POLICY IF EXISTS "Allow admin read analytics_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "Allow admin read analytics_page_views" ON public.analytics_page_views;

-- Create policies
CREATE POLICY "Allow public insert to analytics_sessions" ON public.analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to analytics_page_views" ON public.analytics_page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to analytics_page_views" ON public.analytics_page_views FOR UPDATE USING (true);
CREATE POLICY "Allow admin read analytics_sessions" ON public.analytics_sessions FOR SELECT USING (true);
CREATE POLICY "Allow admin read analytics_page_views" ON public.analytics_page_views FOR SELECT USING (true);

-- Create index on session_id for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session ON public.analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_created ON public.analytics_page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created ON public.analytics_sessions(created_at);
