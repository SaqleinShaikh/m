-- =====================================================
-- Blog Likes and Comments Feature
-- =====================================================

-- Add likes_count column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_email ON blog_likes(user_email);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Trigger for updating comments count
CREATE OR REPLACE FUNCTION update_blog_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.approved = TRUE THEN
        UPDATE blog_posts SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.approved = FALSE AND NEW.approved = TRUE THEN
        UPDATE blog_posts SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' AND OLD.approved = TRUE THEN
        UPDATE blog_posts SET comments_count = comments_count - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_comments_count
AFTER INSERT OR UPDATE OR DELETE ON blog_comments
FOR EACH ROW EXECUTE FUNCTION update_blog_comments_count();

-- Trigger for updating likes count
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_posts SET likes_count = likes_count - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_likes_count
AFTER INSERT OR DELETE ON blog_likes
FOR EACH ROW EXECUTE FUNCTION update_blog_likes_count();

-- Trigger for updated_at on comments
CREATE TRIGGER update_blog_comments_updated_at 
BEFORE UPDATE ON blog_comments 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for blog_likes
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view likes" ON blog_likes;
DROP POLICY IF EXISTS "Public can add likes" ON blog_likes;
DROP POLICY IF EXISTS "Public can remove their own likes" ON blog_likes;
DROP POLICY IF EXISTS "Service role full access blog_likes" ON blog_likes;

CREATE POLICY "Public can view likes" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Public can add likes" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can remove their own likes" ON blog_likes FOR DELETE USING (true);
CREATE POLICY "Service role full access blog_likes" ON blog_likes FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Public can add comments" ON blog_comments;
DROP POLICY IF EXISTS "Service role full access blog_comments" ON blog_comments;

CREATE POLICY "Public can view approved comments" ON blog_comments FOR SELECT USING (approved = true);
CREATE POLICY "Public can add comments" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access blog_comments" ON blog_comments FOR ALL USING (auth.role() = 'service_role');
