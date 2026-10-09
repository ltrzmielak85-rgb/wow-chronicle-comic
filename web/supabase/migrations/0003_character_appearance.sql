-- Appearance profile is private and belongs to a character owner.
create table if not exists public.character_appearances (
 character_id uuid primary key references public.characters(id) on delete cascade,
 race text, class text, gender text,
 appearance_description text not null default '',
 equipment_summary text not null default '',
 reference_image_path text,
 reference_version integer not null default 1 check (reference_version > 0),
 updated_at timestamptz not null default now()
);
alter table public.character_appearances enable row level security;
create policy "read own appearance" on public.character_appearances for select to authenticated
using (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "insert own appearance" on public.character_appearances for insert to authenticated
with check (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));
create policy "update own appearance" on public.character_appearances for update to authenticated
using (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()))
with check (exists(select 1 from public.characters c where c.id=character_id and c.user_id=auth.uid()));

-- Create a private Supabase Storage bucket for screenshots.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('character-references','character-references',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- Object path must begin with the authenticated user's UUID.
create policy "upload own character references" on storage.objects for insert to authenticated
with check (bucket_id='character-references' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "read own character references" on storage.objects for select to authenticated
using (bucket_id='character-references' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "delete own character references" on storage.objects for delete to authenticated
using (bucket_id='character-references' and (storage.foldername(name))[1]=auth.uid()::text);
