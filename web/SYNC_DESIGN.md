# Two supported upload paths

## Manual
Signed-in player selects their WoW character name and realm and uploads the per-character SavedVariables file (WoWComicChronicle.lua). The server parses a restricted Lua table, never executes Lua, and deduplicates events by character ID and sequence number.

API prototype: POST /api/import, multipart fields file, characterName, realm. Requires Supabase access token in Authorization: Bearer. Login UI not yet built.

## Automatic
Windows companion will read SavedVariables after /reload or logout and send a normalized event batch. Website issues short-lived pairing codes; companion exchanges code for a device credential stored hashed server-side. User can revoke the companion. The pairing exchange and device authentication endpoints are not yet implemented.

## Important technical details
- WoW Lua addon cannot send HTTP requests.
- Data may be incomplete until /reload or logout.
- Users may have several characters and multiple game installations.
- Legacy addon versions differ in event key names and SavedVariables structure. Parser integration tests against real exports are needed.
- Character name + realm is user-supplied and is not proof of in-game ownership.
- Screenshots are separate opt-in uploads, not included in the first event importer.
