-- =====================================================
-- Navigation Settings Table
-- =====================================================

-- Create navigation_settings table
CREATE TABLE IF NOT EXISTS navigation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL,
    section_name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default navigation items
INSERT INTO navigation_settings (section_key, section_name, enabled, display_order) VALUES
    ('home', 'Home', true, 1),
    ('experience', 'Experience', true, 2),
    ('skills', 'Skills', true, 3),
    ('projects', 'Projects', true, 4),
    ('education', 'Education', true, 5),
    ('certifications', 'Certifications', true, 6),
    ('blogs', 'Blogs', true, 7),
    ('endorsements', 'Endorsements', true, 8),
    ('video', 'Video Resume', true, 9),
    ('contact', 'Contact', true, 10)
ON CONFLICT (section_key) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_navigation_settings_enabled ON navigation_settings(enabled);
CREATE INDEX IF NOT EXISTS idx_navigation_settings_order ON navigation_settings(display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_navigation_settings_updated_at 
BEFORE UPDATE ON navigation_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE navigation_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view enabled navigation" ON navigation_settings;
DROP POLICY IF EXISTS "Service role full access navigation_settings" ON navigation_settings;

CREATE POLICY "Public can view enabled navigation" ON navigation_settings FOR SELECT USING (enabled = true);
CREATE POLICY "Service role full access navigation_settings" ON navigation_settings FOR ALL USING (auth.role() = 'service_role');