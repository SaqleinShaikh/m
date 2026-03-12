-- =====================================================
-- Saqlein Portfolio Database Schema - COMPLETE
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (CLEAN SLATE)
-- =====================================================
-- Uncomment these lines if you want to start fresh
-- WARNING: This will delete all existing data!

-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS email_messages CASCADE;
-- DROP TABLE IF EXISTS admin_settings CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS certifications CASCADE;
-- DROP TABLE IF EXISTS experience CASCADE;
-- DROP TABLE IF EXISTS education CASCADE;
-- DROP TABLE IF EXISTS skills CASCADE;

-- =====================================================
-- 1. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    designation TEXT,
    organization TEXT,
    testimonial TEXT NOT NULL,
    image TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- =====================================================
-- 2. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author TEXT DEFAULT 'Saqlein Shaikh',
    category TEXT DEFAULT 'Technology',
    tags TEXT[],
    read_time TEXT,
    visible BOOLEAN DEFAULT FALSE,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_visible ON blog_posts(visible);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);

-- =====================================================
-- 3. EMAIL MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('contact', 'testimonial')),
    from_name TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    phone TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_messages_type ON email_messages(type);
CREATE INDEX IF NOT EXISTS idx_email_messages_read ON email_messages(read);
CREATE INDEX IF NOT EXISTS idx_email_messages_created_at ON email_messages(created_at DESC);

-- =====================================================
-- 4. ADMIN SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO admin_settings (setting_key, setting_value) VALUES
    ('admin_email', 'saqleinsheikh43@gmail.com'),
    ('admin_username', 'AppAdmin'),
    ('admin_password', 'S@qlein050505')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- 5. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image TEXT,
    technologies TEXT[],
    functionality TEXT[],
    github_url TEXT,
    live_url TEXT,
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order);

-- =====================================================
-- 6. CERTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    image TEXT,
    description TEXT,
    credential_url TEXT,
    type TEXT DEFAULT 'certification' CHECK (type IN ('certification', 'award')),
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_visible ON certifications(visible);
CREATE INDEX IF NOT EXISTS idx_certifications_type ON certifications(type);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications(display_order);

-- =====================================================
-- 7. EXPERIENCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[],
    is_current BOOLEAN DEFAULT FALSE,
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_visible ON experience(visible);
CREATE INDEX IF NOT EXISTS idx_experience_current ON experience(is_current);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(display_order);

-- =====================================================
-- 8. EDUCATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'GraduationCap',
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_visible ON education(visible);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(display_order);

-- =====================================================
-- 9. SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    category TEXT NOT NULL CHECK (category IN ('language', 'tool', 'framework')),
    subcategory TEXT,
    visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_visible ON skills(visible);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(display_order);

-- =====================================================
-- ALTER EXISTING TABLES (Add missing columns if tables already exist)
-- =====================================================

-- Add type column to email_messages if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='email_messages' AND column_name='type') THEN
        ALTER TABLE email_messages ADD COLUMN type TEXT NOT NULL DEFAULT 'contact' CHECK (type IN ('contact', 'testimonial'));
    END IF;
END $$;

-- Add type column to certifications if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='certifications' AND column_name='type') THEN
        ALTER TABLE certifications ADD COLUMN type TEXT DEFAULT 'certification' CHECK (type IN ('certification', 'award'));
    END IF;
END $$;

-- Add tags and read_time to blog_posts if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='blog_posts' AND column_name='tags') THEN
        ALTER TABLE blog_posts ADD COLUMN tags TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='blog_posts' AND column_name='read_time') THEN
        ALTER TABLE blog_posts ADD COLUMN read_time TEXT;
    END IF;
END $$;

-- Add missing columns to projects if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='short_description') THEN
        ALTER TABLE projects ADD COLUMN short_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='full_description') THEN
        ALTER TABLE projects ADD COLUMN full_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='functionality') THEN
        ALTER TABLE projects ADD COLUMN functionality TEXT[];
    END IF;
END $$;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view visible blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view visible projects" ON projects;
DROP POLICY IF EXISTS "Public can view visible certifications" ON certifications;
DROP POLICY IF EXISTS "Public can view visible experience" ON experience;
DROP POLICY IF EXISTS "Public can view visible education" ON education;
DROP POLICY IF EXISTS "Public can view visible skills" ON skills;
DROP POLICY IF EXISTS "Public can submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can send messages" ON email_messages;
DROP POLICY IF EXISTS "Service role full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Service role full access blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role full access email_messages" ON email_messages;
DROP POLICY IF EXISTS "Service role full access admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Service role full access projects" ON projects;
DROP POLICY IF EXISTS "Service role full access certifications" ON certifications;
DROP POLICY IF EXISTS "Service role full access experience" ON experience;
DROP POLICY IF EXISTS "Service role full access education" ON education;
DROP POLICY IF EXISTS "Service role full access skills" ON skills;

-- Public read policies
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Public can view visible blog posts" ON blog_posts FOR SELECT USING (visible = true);
CREATE POLICY "Public can view visible projects" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public can view visible certifications" ON certifications FOR SELECT USING (visible = true);
CREATE POLICY "Public can view visible experience" ON experience FOR SELECT USING (visible = true);
CREATE POLICY "Public can view visible education" ON education FOR SELECT USING (visible = true);
CREATE POLICY "Public can view visible skills" ON skills FOR SELECT USING (visible = true);

-- Public insert policies
CREATE POLICY "Public can submit testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can send messages" ON email_messages FOR INSERT WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access email_messages" ON email_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access admin_settings" ON admin_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access projects" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access certifications" ON certifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access experience" ON experience FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access education" ON education FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access skills" ON skills FOR ALL USING (auth.role() = 'service_role');
