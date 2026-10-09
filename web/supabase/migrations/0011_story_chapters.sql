-- A chapter groups completed quests owned by the same player/character.
create table if not exists public.story_chapters (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 character_id uuid not null references public.characters(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160),
 created_at timestamptz not null default now(),
 unique(id,character_id)
);
create table if not exists public.story_chapter_quests (
 chapter_id uuid not null references public.story_chapters(id) on delete cascade,
 candidate_id uuid not null references public.quest_candidates(id) on delete cascade,
 position integer not null check(position>=0),
 primary key(chapter_id,candidate_id),
 unique(chapter_id,position)
);
alter table public.story_chapters enable row level security;
alter table public.story_chapter_quests enable row level security;
create policy "read own chapters" on public.story_chapters for select to authenticated using(user_id=auth.uid());
create policy "read own chapter quests" on public.story_chapter_quests for select to authenticated using(
 exists(select 1 from public.story_chapters ch where ch.id=chapter_id and ch.user_id=auth.uid())
);
-- Writes must be validated server-side: all candidate quests must belong to
-- the chapter's character and be verified completed, with no cross-account IDs.
alter table public.generation_requests add column if not exists chapter_id uuid references public.story_chapters(id);
alter table public.generation_requests add constraint generation_request_one_source
 check ((candidate_id is not null and chapter_id is null) or (candidate_id is null and chapter_id is not null));
