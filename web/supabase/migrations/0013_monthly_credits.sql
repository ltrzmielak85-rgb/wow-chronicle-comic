-- Monthly billing-cycle credits replace daily quotas for new generation requests.
-- Cycle dates must come from verified Stripe subscription state, not the browser.
create table if not exists public.credit_cycles (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 stripe_subscription_id text,
 cycle_start timestamptz not null,
 cycle_end timestamptz not null,
 allowance integer not null check (allowance >= 0),
 created_at timestamptz not null default now(),
 check(cycle_end>cycle_start),
 unique(user_id,cycle_start)
);
create index if not exists credit_cycles_user_idx on public.credit_cycles(user_id,cycle_end desc);
create table if not exists public.credit_reservations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 request_id uuid not null unique references public.generation_requests(id) on delete cascade,
 cycle_id uuid references public.credit_cycles(id),
 source text not null check(source in ('free','subscription')),
 credits integer not null check(credits between 1 and 20),
 state text not null default 'reserved' check(state in ('reserved','consumed','released')),
 created_at timestamptz not null default now(),
 settled_at timestamptz,
 check ((source='subscription' and cycle_id is not null) or (source='free' and cycle_id is null))
);
create index if not exists credit_reservations_cycle_idx on public.credit_reservations(cycle_id,state);
alter table public.credit_cycles enable row level security;
alter table public.credit_reservations enable row level security;
create policy "read own credit cycles" on public.credit_cycles for select to authenticated using(user_id=auth.uid());
create policy "read own reservations" on public.credit_reservations for select to authenticated using(user_id=auth.uid());
-- No direct client writes. Production RPCs must lock the entitlement/cycle row,
-- reserve all requested credits atomically and settle once, idempotently.
-- Do not reset/refund a failed request by changing its billing-cycle assignment.
-- Legacy page_ledger/quota_day retained for migration of existing records.
