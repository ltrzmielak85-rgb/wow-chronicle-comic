-- Approved visual identity sheets. Equipment is resolved separately per quest timestamp.
create table if not exists public.character_reference_sheets (
 id uuid primary key default gen_random_uuid(),
 character_id uuid not null references public.characters(id) on delete cascade,
 identity_version integer not null check(identity_version>0),
 reference_image_path text not null check(char_length(reference_image_path) between 1 and 500),
 identity_description text not null check(char_length(identity_description) between 1 and 1200),
 approved_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(character_id,identity_version)
);
create index if not exists character_reference_sheets_latest_idx
 on public.character_reference_sheets(character_id,identity_version desc);
alter table public.character_reference_sheets enable row level security;
create policy "read own approved reference sheets" on public.character_reference_sheets
 for select to authenticated using(
 exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid())
);
-- Trusted service handles approval and versioning; no direct client writes.
-- Image objects remain in private storage, with owner-scoped access.
