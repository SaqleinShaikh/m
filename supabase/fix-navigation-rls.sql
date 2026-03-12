-- Fix RLS policy for navigation settings
-- The public should be able to see ALL navigation settings (both enabled and disabled)
-- so the frontend knows which sections to hide

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can view enabled navigation" ON navigation_settings;

-- Create a new policy that allows public to view ALL navigation settings
CREATE POLICY "Public can view all navigation settings" ON navigation_settings FOR SELECT USING (true);

-- Keep the service role policy for admin operations
-- (This should already exist, but adding it just in case)
DROP POLICY IF EXISTS "Service role full access navigation_settings" ON navigation_settings;
CREATE POLICY "Service role full access navigation_settings" ON navigation_settings FOR ALL USING (auth.role() = 'service_role');