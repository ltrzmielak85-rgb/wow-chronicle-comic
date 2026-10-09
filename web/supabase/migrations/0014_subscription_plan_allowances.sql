-- Server-side reference allowances; do not accept allowance amounts from clients.
create table if not exists public.subscription_plan_allowances (
 plan text primary key check(plan in ('adventurer','hero','legend')),
 monthly_credits integer not null check(monthly_credits>0),
 proposed_usd_cents integer not null check(proposed_usd_cents>0),
 updated_at timestamptz not null default now()
);
insert into public.subscription_plan_allowances(plan,monthly_credits,proposed_usd_cents) values
 ('adventurer',20,799),('hero',50,1499),('legend',100,2499)
on conflict(plan) do update set monthly_credits=excluded.monthly_credits,
 proposed_usd_cents=excluded.proposed_usd_cents,updated_at=now();
alter table public.subscription_plan_allowances enable row level security;
create policy "anyone can read subscription plans" on public.subscription_plan_allowances
 for select to anon,authenticated using(true);
-- No client write policies. Billing and cycle creation use verified Stripe state.
