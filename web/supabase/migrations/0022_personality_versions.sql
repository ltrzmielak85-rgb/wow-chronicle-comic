-- Snapshot the player's selected personality on each generation request.
-- This preserves already-created comics and freezes queued jobs against edits.
alter table public.character_personality_profiles
 add column if not exists revision integer not null default 1 check(revision>0);
alter table public.generation_requests
 add column if not exists personality_snapshot jsonb,
 add column if not exists personality_revision integer;
alter table public.generation_requests
 add constraint generation_personality_snapshot_pair
 check ((personality_snapshot is null and personality_revision is null)
 or (personality_snapshot is not null and personality_revision is not null and personality_revision>0));
create table if not exists public.character_personality_revisions (
 character_id uuid not null references public.characters(id) on delete cascade,
 revision integer not null check(revision>0),
 traits text[] not null,
 speaking_style text not null,
 changed_at timestamptz not null default now(),
 primary key(character_id,revision)
);
alter table public.character_personality_revisions enable row level security;
create policy "read own personality revisions" on public.character_personality_revisions
 for select to authenticated using(exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
-- Trusted update transaction: verify ownership, lock profile, increment revision,
-- append revision row. Trusted request creation copies current profile and revision
-- into generation_requests in the same transaction; worker uses snapshot ONLY.
-- Existing requests with null snapshot require explicit legacy handling.
