# Personality changes over time — confirmed

Players may edit their character's selected traits and speaking style. New comic generation requests capture a snapshot of the latest profile and its revision; later edits do not alter that request or previously generated comics. This is generation-time personality, NOT a historical level-by-level personality timeline. Recorded quest facts always take precedence over personality embellishment.

Committed: profile revision field, append-only revision table, generation request snapshot columns, snapshot validation helpers and draft tests.

Outstanding: transactional authenticated profile update endpoint, request-creation snapshot integration, worker enforcement, rendered comic provenance metadata, migrations execution and tests. Older queued requests without snapshots need a defined fallback or migration before launch.
