# Missing historical companion information — confirmed

If an old quest lacks trustworthy companion observations, pause before comic generation and ask the player to choose a known companion or **No companion**. Save the explicit decision against that quest, mark it as player-reconstructed, and disclose that the choice is not verified gameplay history. Never silently substitute the latest pet. A recorded active companion or recorded absence takes precedence over a manual reconstruction.

Implemented: decision schema, provenance-aware resolver, SQL table with owner-read RLS, and draft tests.

Not implemented: selection UI, authenticated ownership-checked write endpoint, worker preflight enforcement, or live tests. For story chapters, missing history must be resolved for each included quest before generation. If a player chooses a companion, verify it belongs to the same character and has an approved visual reference when depicted.
