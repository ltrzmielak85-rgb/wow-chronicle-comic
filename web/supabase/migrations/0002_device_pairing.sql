-- Device pairing: only trusted backend with service-role access may create/redeem codes.
create table if not exists public.sync_devices (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null default 'Windows companion',
 token_hash text not null unique,
 last_seen_at timestamptz,
 revoked_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.device_pairing_codes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 code_hash text not null unique,
 expires_at timestamptz not null,
 redeemed_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists pairing_expiry_idx on public.device_pairing_codes(expires_at);
create index if not exists devices_user_idx on public.sync_devices(user_id);
alter table public.sync_devices enable row level security;
alter table public.device_pairing_codes enable row level security;
create policy "read own devices" on public.sync_devices for select to authenticated using(user_id=auth.uid());
-- Pairing codes and device credentials intentionally have no browser-client policies.
-- Future pairing endpoints must use short-lived hashed codes, token rotation, and revocation.
