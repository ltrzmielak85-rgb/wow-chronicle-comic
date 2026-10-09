-- Explicit user-approved page count and immutable credit quote.
create table if not exists public.generation_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 candidate_id uuid not null references public.quest_candidates(id) on delete cascade,
 requested_pages smallint not null check (requested_pages between 1 and 5),
 quoted_credits smallint not null check (quoted_credits between 1 and 5),
 status text not null default 'pending' check(status in ('pending','reserved','processing','completed','failed','cancelled')),
 idempotency_key uuid not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,idempotency_key),
 check(requested_pages=quoted_credits)
);
create index if not exists generation_requests_user_idx on public.generation_requests(user_id,created_at desc);
alter table public.generation_requests enable row level security;
create policy "read own generation requests" on public.generation_requests for select to authenticated using(user_id=auth.uid());
-- Mutations only through trusted server-side approval/quota transaction.
