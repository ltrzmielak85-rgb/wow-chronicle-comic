-- Historical companion observations, keyed to a character and an observation time.
create table if not exists public.character_companions (
 id uuid primary key default gen_random_uuid(),
 character_id uuid not null references public.characters(id) on delete cascade,
 companion_kind text not null check(companion_kind in ('hunter_pet','warlock_demon','other')),
 name text,
 species text,
 created_at timestamptz not null default now()
);
create table if not exists public.companion_observations (
 id uuid primary key default gen_random_uuid(),
 character_id uuid not null references public.characters(id) on delete cascade,
 companion_id uuid references public.character_companions(id) on delete set null,
 observed_at timestamptz not null,
 source_event_seq bigint,
 observation_kind text not null check(observation_kind in ('active','none','unknown')),
 created_at timestamptz not null default now(),
 check ((observation_kind='active' and companion_id is not null) or (observation_kind<>'active' and companion_id is null)),
 unique(character_id,source_event_seq)
);
create index if not exists companion_observations_time_idx on public.companion_observations(character_id,observed_at desc,created_at desc);
create table if not exists public.companion_reference_sheets (
 id uuid primary key default gen_random_uuid(),
 companion_id uuid not null references public.character_companions(id) on delete cascade,
 version integer not null check(version>0),
 image_path text not null,
 appearance_description text not null default '',
 status text not null default 'draft' check(status in ('draft','pending_review','changes_requested','approved')),
 created_at timestamptz not null default now(),
 unique(companion_id,version)
);
create unique index if not exists one_approved_companion_sheet on public.companion_reference_sheets(companion_id) where status='approved';
alter table public.character_companions enable row level security;
alter table public.companion_observations enable row level security;
alter table public.companion_reference_sheets enable row level security;
create policy "read own companions" on public.character_companions for select to authenticated using(exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "read own companion observations" on public.companion_observations for select to authenticated using(exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "read own companion sheets" on public.companion_reference_sheets for select to authenticated using(exists(select 1 from public.character_companions p join public.characters c on c.id=p.character_id where p.id=companion_id and c.user_id=auth.uid()));
-- Writes require trusted ingestion/review logic that validates same-character IDs.
