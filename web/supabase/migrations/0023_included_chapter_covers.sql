-- Chapter cover is a separate asset, not a billable story page.
-- Only story chapter comics may have an included cover.
alter table public.comics
 add column if not exists chapter_cover_image_path text,
 add column if not exists chapter_cover_status text
 check(chapter_cover_status in ('pending','processing','ready','failed'));
alter table public.comics add constraint chapter_cover_state_pair
 check ((chapter_cover_image_path is null) or (chapter_cover_status='ready'));
-- Do not insert covers into comic_pages: that table tracks billable story pages.
-- Trusted worker verifies the comic belongs to a chapter generation request.
-- Mark request completed only after cover and every story page are ready.
-- Terminal failure releases all reserved story-page credits.
