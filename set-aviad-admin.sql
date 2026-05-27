-- Grant admin access to Aviad
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- Option 1: by username (most reliable if you know it)
UPDATE users SET is_admin = true WHERE username = 'aviad';

-- Option 2: by display name (fallback)
-- UPDATE users SET is_admin = true WHERE display_name ILIKE 'aviad%';

-- Verify the update:
SELECT id, username, display_name, is_admin FROM users ORDER BY created_at;

-- ⚠️  After running this SQL, you must LOG OUT and LOG BACK IN
--     on the website for the change to take effect in your session.
