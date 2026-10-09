-- Explicit player decisions for quests lacking historical companion evidence.
create table if not exists public.quest_companion_reconstructions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 candidate_id uuid not null references public.quest_candidates(id) on delete cascade,
 choice text not null check(choice in ('companion','none')),
 companion_id uuid references public.character_companions(id) on delete restrict,
 provenance text not null default 'player_reconstructed' check(provenance='player_reconstructed'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,candidate_id),
 check ((choice='companion' and companion_id is not null) or (choice='none' and companion_id is null))
);
alter table public.quest_companion_reconstructions enable row level security;
create policy "read own companion reconstructions" on public.quest_companion_reconstructions
 for select to authenticated using(user_id=auth.uid());
-- Trusted write endpoint must verify user owns candidate and companion, that
-- both belong to the same character, and that history is genuinely missing.
-- Never overwrite a recorded 'none' or a known active companion.
