-- Migration: add notes column to prompts + allow empty prompt_text
alter table prompts add column if not exists notes text;
alter table prompts alter column prompt_text set default '';
