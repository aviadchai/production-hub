-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard → your project → SQL Editor → New query

ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS notes          text,
  ADD COLUMN IF NOT EXISTS asset_fps      integer,
  ADD COLUMN IF NOT EXISTS asset_duration integer,
  ADD COLUMN IF NOT EXISTS asset_title    text,
  ADD COLUMN IF NOT EXISTS asset_width    integer,
  ADD COLUMN IF NOT EXISTS asset_height   integer,
  ADD COLUMN IF NOT EXISTS asset_ratio    text;

-- Verify:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'prompts'
ORDER BY ordinal_position;
