-- Run in Supabase SQL editor. All player tables use row-level security.
create extension if not exists pgcrypto;
create table if not exists public.characters (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, realm text not null, game_version text not null default 'tbc-anniversary',
 created_at timestamptz not null default now(),
 unique(user_id,realm,name,game_version)
);
create table if not exists public.adventure_events (
 id bigint generated always as identity primary key,
 character_id uuid not null references public.characters(id) on delete cascade,
 seq bigint not null, event_time timestamptz not null,
 event_type text not null, payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 unique(character_id,seq)
);
create table if not exists public.comics (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 character_id uuid references public.characters(id) on delete set null,
 title text not null, created_at timestamptz not null default now()
);
create table if not exists public.comic_pages (
 id uuid primary key default gen_random_uuid(),
 comic_id uuid not null references public.comics(id) on delete cascade,
 page_number integer not null check(page_number>0),
 image_path text, status text not null default 'pending' check(status in ('pending','processing','ready','failed')),
 created_at timestamptz not null default now(),
 unique(comic_id,page_number)
);
create table if not exists public.entitlements (
 user_id uuid primary key references auth.users(id) on delete cascade,
 free_pages_used integer not null default 0 check(free_pages_used between 0 and 1),
 plan text not null default 'free' check(plan in ('free','adventurer','hero','legend')),
 stripe_customer_id text unique,
 stripe_subscription_id text unique,
 subscription_status text,
 updated_at timestamptz not null default now()
);
create table if not exists public.page_ledger (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 page_id uuid not null unique references public.comic_pages(id) on delete cascade,
 quota_day date not null default (now() at time zone 'utc')::date,
 source text not null check(source in ('free','subscription')),
 state text not null default 'reserved' check(state in ('reserved','consumed','refunded')),
 created_at timestamptz not null default now()
);
alter table public.characters enable row level security;
alter table public.adventure_events enable row level security;
alter table public.comics enable row level security;
alter table public.comic_pages enable row level security;
alter table public.entitlements enable row level security;
alter table public.page_ledger enable row level security;
create policy "own characters" on public.characters for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own events read" on public.adventure_events for select to authenticated using (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "own events insert" on public.adventure_events for insert to authenticated with check (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "own comics read" on public.comics for select to authenticated using (user_id=auth.uid());
create policy "own pages read" on public.comic_pages for select to authenticated using (exists(select 1 from public.comics c where c.id=comic_id and c.user_id=auth.uid()));
create policy "own entitlements read" on public.entitlements for select to authenticated using (user_id=auth.uid());
create policy "own ledger read" on public.page_ledger for select to authenticated using (user_id=auth.uid());
-- Intentionally no client-side write policies for credits, subscriptions, comics or pages.
-- Trusted server functions will reserve, finalize and refund generation credits atomically.
