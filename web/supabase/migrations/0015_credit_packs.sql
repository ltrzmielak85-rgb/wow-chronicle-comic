-- Purchased credits are a separate, non-expiring balance.
-- All grants must originate from verified, idempotent payment webhook processing.
create table if not exists public.credit_pack_grants (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 stripe_payment_intent_id text not null unique,
 credits integer not null check(credits > 0),
 granted_at timestamptz not null default now()
);
create table if not exists public.credit_pack_allocations (
 id uuid primary key default gen_random_uuid(),
 grant_id uuid not null references public.credit_pack_grants(id) on delete restrict,
 request_id uuid not null references public.generation_requests(id) on delete restrict,
 credits integer not null check(credits > 0),
 state text not null default 'reserved' check(state in ('reserved','consumed','released')),
 created_at timestamptz not null default now(),
 settled_at timestamptz,
 unique(grant_id,request_id)
);
create index if not exists credit_pack_grants_user_idx on public.credit_pack_grants(user_id,granted_at);
create index if not exists credit_pack_allocations_grant_idx on public.credit_pack_allocations(grant_id,state);
alter table public.credit_pack_grants enable row level security;
alter table public.credit_pack_allocations enable row level security;
create policy "read own pack grants" on public.credit_pack_grants for select to authenticated using(user_id=auth.uid());
create policy "read own pack allocations" on public.credit_pack_allocations for select to authenticated using(
 exists(select 1 from public.credit_pack_grants g where g.id=grant_id and g.user_id=auth.uid())
);
-- No client-side writes. The worker must atomically lock and allocate grants
-- (oldest first) and monthly credits, preventing concurrent overspending.
