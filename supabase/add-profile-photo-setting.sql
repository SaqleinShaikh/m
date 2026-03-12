-- Add profile photo setting to navigation_settings table

INSERT INTO navigation_settings (section_key, section_name, enabled, display_order) VALUES
    ('profile_photo', 'Profile Photo', true, 0)
ON CONFLICT (section_key) DO NOTHING;

-- Update display_order for existing items to make room for profile photo at the top
UPDATE navigation_settings SET display_order = display_order + 1 WHERE section_key != 'profile_photo';