-- User-scoped idempotent promotion of recorded turn-ins into reviewable quest candidates.
-- Runs after event ingestion; the invoker must own the character.
create or replace function public.refresh_quest_candidates(p_character_id uuid)
returns integer language plpgsql security definer
set search_path = public, pg_temp
as $$
declare inserted_count integer;
begin
 if auth.uid() is null or not exists (
  select 1 from public.characters where id=p_character_id and user_id=auth.uid()
 ) then raise exception 'Character not found or access denied' using errcode='42501'; end if;
 with turnins as (
  select e.character_id,
         coalesce(nullif(e.payload->>'questID',''),nullif(e.payload->>'questId',''),nullif(e.payload->>'id','')) as raw_id,
         nullif(e.payload->>'title','') as title,
         e.event_time
  from public.adventure_events e
  where e.character_id=p_character_id and upper(e.event_type)='QUEST_TURNED_IN'
 ), normalized as (
  select character_id, raw_id::bigint as quest_id, left(title,200) as title, event_time
  from turnins where raw_id ~ '^[0-9]{1,15}$' and raw_id::numeric>0
 ), inserted as (
  insert into public.quest_candidates(user_id,character_id,quest_id,quest_title,completed_at)
  select auth.uid(),character_id,quest_id,max(title),event_time
  from normalized group by character_id,quest_id,event_time
  on conflict(character_id,quest_id,completed_at) do nothing
  returning id
 )
 select count(*) into inserted_count from inserted;
 return inserted_count;
end;
$$;
revoke all on function public.refresh_quest_candidates(uuid) from public;
grant execute on function public.refresh_quest_candidates(uuid) to authenticated;
