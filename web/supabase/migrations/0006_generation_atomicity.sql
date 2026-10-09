-- All-or-nothing requests: completed pages are published only after entire request succeeds.
alter table public.generation_requests
 add column if not exists attempt_count integer not null default 0 check(attempt_count>=0),
 add column if not exists max_attempts integer not null default 3 check(max_attempts between 1 and 10),
 add column if not exists failure_reason text,
 add column if not exists completed_at timestamptz;
alter table public.comic_pages add column if not exists generation_request_id uuid references public.generation_requests(id) on delete set null;
create index if not exists comic_pages_request_idx on public.comic_pages(generation_request_id);
create table if not exists public.generation_attempts (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.generation_requests(id) on delete cascade,
 attempt_number integer not null check(attempt_number>0),
 status text not null check(status in ('started','succeeded','failed')),
 error_code text,
 started_at timestamptz not null default now(),
 finished_at timestamptz,
 unique(request_id,attempt_number)
);
alter table public.generation_attempts enable row level security;
create policy "read own attempts" on public.generation_attempts for select to authenticated
using(exists(select 1 from public.generation_requests r where r.id=request_id and r.user_id=auth.uid()));
-- No client write permissions. Workers must use trusted transactional procedures.
