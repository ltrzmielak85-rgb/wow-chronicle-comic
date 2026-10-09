-- Comics remain private. Sharing requires an explicit owner action.
create table if not exists public.comic_share_links (
 id uuid primary key default gen_random_uuid(),
 comic_id uuid not null references public.comics(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 token_hash text not null unique,
 created_at timestamptz not null default now(),
 revoked_at timestamptz,
 expires_at timestamptz,
 constraint valid_expiry check(expires_at is null or expires_at>created_at)
);
create index if not exists comic_share_links_owner_idx on public.comic_share_links(owner_id,comic_id);
alter table public.comic_share_links enable row level security;
create policy "owners can view their share links" on public.comic_share_links for select to authenticated
 using(owner_id=auth.uid() and exists(select 1 from public.comics c where c.id=comic_id and c.user_id=auth.uid()));
-- Token hashes never readable to anonymous users. Public access must go through a
-- narrowly scoped server endpoint validating a token and revocation/expiry.
-- Do not add public SELECT policies to comics, pages or private storage buckets.
