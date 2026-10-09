-- Replace earlier universal 1-5 page checks with source-aware limits.
alter table public.generation_requests drop constraint if exists generation_requests_requested_pages_check;
alter table public.generation_requests drop constraint if exists generation_requests_quoted_credits_check;
alter table public.generation_requests add constraint generation_requests_requested_pages_check
 check ((candidate_id is not null and chapter_id is null and requested_pages between 1 and 5)
 or (chapter_id is not null and candidate_id is null and requested_pages between 5 and 20));
alter table public.generation_requests add constraint generation_requests_quoted_credits_check
 check (quoted_credits between 1 and 20);
-- Existing equality check requested_pages=quoted_credits remains in force.
