-- Shreya's Wellness — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

-- 1) Whole-app state for the single user (synced from the client).
create table if not exists app_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2) Web-push subscriptions (one per device/browser).
create table if not exists push_subscriptions (
  endpoint text primary key,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table app_state enable row level security;
alter table push_subscriptions enable row level security;

-- Personal single-user app: the anon key may read/write. Data is gated behind the
-- in-app passcode. For stronger security, switch to Supabase Auth + per-user policies.
drop policy if exists "anon all app_state" on app_state;
create policy "anon all app_state" on app_state for all to anon using (true) with check (true);

drop policy if exists "anon all push_subscriptions" on push_subscriptions;
create policy "anon all push_subscriptions" on push_subscriptions for all to anon using (true) with check (true);

-- 3) (Optional) Daily reminder schedule.
-- Requires the pg_cron + pg_net extensions (enable under Database -> Extensions),
-- and the 'send-reminders' edge function deployed. Replace the placeholders, then run:
--
-- select cron.schedule(
--   'daily-reminders',
--   '30 1 * * *',  -- 01:30 UTC = 07:00 IST
--   $$
--     select net.http_post(
--       url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
--       headers := jsonb_build_object(
--         'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
--         'Content-Type', 'application/json'
--       )
--     );
--   $$
-- );
