-- Style choice is captured per generation request so later profile changes do not alter the order.
alter table public.generation_requests add column if not exists art_style text not null default 'classic_fantasy_comic'
 check(art_style in ('classic_fantasy_comic','dark_cinematic','vibrant_adventure'));
alter table public.comics add column if not exists art_style text not null default 'classic_fantasy_comic'
 check(art_style in ('classic_fantasy_comic','dark_cinematic','vibrant_adventure'));
