# Individual quests and multi-quest story chapters — confirmed

Players can approve a comic for one completed quest or manually select two or more related completed quests from the same character to form a story chapter. Chapter quest order follows verified completion timestamps when available. For reconstructed quests with unknown dates, ask the player to confirm order rather than inventing chronology. Chapters with any reconstructed quests carry a reconstruction disclosure.

The same 1–5 page request limit and all-or-nothing credit handling applies per comic request, including chapters. A longer chapter may need multiple comic requests to become a book; this remains a future design decision.

Committed foundation: chapter and membership tables, generation request chapter reference, selection/ordering helpers, draft tests.

Pending: chapter creation APIs, server validation of candidate ownership and completion, chapter selection UI, chapter story assembly, and end-to-end tests. The migration's new source constraint assumes generation_requests.candidate_id can be made nullable; review the prior schema and alter nullability before applying.
