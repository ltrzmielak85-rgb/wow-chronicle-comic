# Quest capture → upload → candidate dashboard

1. Install the addon and complete a quest; /wcc status confirms event capture.
2. Exit game or /reload to persist SavedVariablesPerCharacter to disk.
3. Authenticated POST /api/import with multipart file, characterName, realm.
4. API parses Lua without executing it, validates events, upserts character and events by (character_id,seq).
5. Authenticated owner-scoped refresh_quest_candidates RPC promotes QUEST_TURNED_IN events to reviewable candidates, idempotently.
6. Authenticated GET /api/quest-candidates?characterId=... lists candidates for dashboard use.

This is a code-level vertical slice, not yet a verified in-game deployment. Migrations must be applied. No in-game test, live Supabase request, web build or Vitest run has been performed here. Uploaded file must belong to the selected character; the current API accepts manually supplied name/realm and should add character identity binding before production. No credits are charged by import.
