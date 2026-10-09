-- Provenance is explicit and never inferred from a generated narrative.
alter table public.quest_candidates
 add column if not exists provenance text not null default 'recorded'
 check(provenance in ('recorded','historical_reconstructed')),
 add column if not exists evidence jsonb not null default '{}'::jsonb;
alter table public.comics
 add column if not exists provenance text not null default 'recorded'
 check(provenance in ('recorded','historical_reconstructed'));
comment on column public.quest_candidates.evidence is
 'Facts supporting quest completion; historical candidates must not imply witnessed combat, dialogue or equipment.';
