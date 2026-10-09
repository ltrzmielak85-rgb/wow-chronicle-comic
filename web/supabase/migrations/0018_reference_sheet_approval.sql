-- A reference sheet must be explicitly approved before use in comic generation.
alter table public.character_reference_sheets
 add column if not exists status text not null default 'draft'
 check(status in ('draft','pending_review','changes_requested','approved')),
 add column if not exists review_notes text check(char_length(review_notes)<=1200),
 add column if not exists reviewed_at timestamptz;
-- Existing sheets predate this approval policy; default draft prevents implicit approval.
create unique index if not exists character_one_approved_reference
 on public.character_reference_sheets(character_id) where status='approved';
-- Only trusted server actions may change status after checking ownership.
-- In a transaction: lock character, mark previous approved sheet as draft,
-- then approve the chosen version. Generation must verify status='approved'.
