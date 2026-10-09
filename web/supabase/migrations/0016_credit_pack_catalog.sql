-- Proposed one-time purchase products. Stripe Price IDs must be mapped on server.
create table if not exists public.credit_pack_catalog (
 pack_id text primary key,
 credits integer not null check(credits>0),
 proposed_usd_cents integer not null check(proposed_usd_cents>0),
 active boolean not null default false
);
insert into public.credit_pack_catalog(pack_id,credits,proposed_usd_cents,active) values
 ('pack_10',10,499,false),('pack_25',25,999,false),('pack_50',50,1799,false)
on conflict(pack_id) do update set credits=excluded.credits,
 proposed_usd_cents=excluded.proposed_usd_cents;
alter table public.credit_pack_catalog enable row level security;
create policy "read credit pack catalog" on public.credit_pack_catalog
 for select to anon,authenticated using(true);
-- active remains false until cost review and verified Stripe products exist.
-- Do not trust pack price or credit quantity sent from the browser.
