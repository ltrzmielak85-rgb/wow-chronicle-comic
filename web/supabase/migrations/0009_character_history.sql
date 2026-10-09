-- Immutable snapshots record known character appearance and gear at an event time.
create table if not exists public.character_appearance_snapshots (
 id uuid primary key default gen_random_uuid(),
 character_id uuid not null references public.characters(id) on delete cascade,
 observed_at timestamptz not null,
 source_event_seq bigint,
 level integer check(level between 1 and 100),
 race text, class text, gender text,
 appearance_description text,
 equipment jsonb not null default '{}'::jsonb,
 reference_image_path text,
 created_at timestamptz not null default now(),
 unique(character_id,source_event_seq)
);
create index if not exists appearance_snapshots_time_idx
 on public.character_appearance_snapshots(character_id,observed_at desc,created_at desc);
alter table public.character_appearance_snapshots enable row level security;
create policy "read own appearance snapshots" on public.character_appearance_snapshots
 for select to authenticated using (
 exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid())
 );
-- Historical snapshots are written by a trusted ingestion service only.
