-- Migration: add fps, duration, title columns to prompts
alter table prompts add column if not exists asset_fps int;
alter table prompts add column if not exists asset_duration int;  -- seconds
alter table prompts add column if not exists asset_title text;
