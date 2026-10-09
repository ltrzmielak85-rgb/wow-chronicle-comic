-- User-selected stable personality for cinematic dialogue; not a gameplay fact.
create table if not exists public.character_personality_profiles (
 character_id uuid primary key references public.characters(id) on delete cascade,
 traits text[] not null check(cardinality(traits) between 1 and 3),
 speaking_style text not null default 'balanced' check(speaking_style in ('balanced','formal','casual','terse')),
 updated_at timestamptz not null default now(),
 check(traits <@ array['brave','cautious','honorable','sarcastic','compassionate','mysterious','ruthless','curious','stoic','playful','loyal','ambitious']::text[]),
 check(cardinality(array_remove(traits,null))=cardinality(traits))
);
alter table public.character_personality_profiles enable row level security;
create policy "read own personality profile" on public.character_personality_profiles
 for select to authenticated using(exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
-- Trusted writes must verify character ownership and enforce unique traits.
-- Snapshot profile at generation time to avoid changes affecting queued jobs.
