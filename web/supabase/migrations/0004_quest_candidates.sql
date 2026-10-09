-- Completed quests become reviewable candidates, never automatically charged.
create table if not exists public.quest_candidates (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 character_id uuid not null references public.characters(id) on delete cascade,
 quest_id bigint not null check(quest_id>0),
 quest_title text,
 completed_at timestamptz not null,
 status text not null default 'ready' check(status in ('ready','requested','generated','dismissed')),
 comic_id uuid references public.comics(id) on delete set null,
 created_at timestamptz not null default now(),
 unique(character_id,quest_id,completed_at)
);
create index if not exists quest_candidates_owner_status_idx on public.quest_candidates(user_id,status,completed_at desc);
alter table public.quest_candidates enable row level security;
create policy "read own quest candidates" on public.quest_candidates for select to authenticated using(user_id=auth.uid());
-- Candidate insertion and status transitions are server-controlled.
