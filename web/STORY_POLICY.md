# Cinematic storytelling — confirmed product decision

Quest data is the source of truth. The story engine may enrich dialogue, atmosphere, action pacing and scene transitions, but must not change what actually happened.

## Grounded anchors
- Recorded quest IDs, quest titles and objective changes
- Recorded zone/location changes and NPC interactions
- Recorded deaths, combat markers, accepted and turned-in quests
- Character identity and appearance only when explicitly provided

## Allowed embellishments
- Short in-character dialogue, internal monologue, reactions
- Cinematic framing, weather and mood when not contradictory
- Transitions between recorded events
- Dramatic depiction of recorded combat, without inventing victories

## Not allowed as facts
- Inventing completed quests, loot, boss kills or named NPC encounters
- Reordering major quest milestones
- Claiming the player visited an unrecorded zone
- Implying unverified events were captured from screenshots

## Generation flow
1. Normalize quest events into a chronological timeline.
2. Choose one quest or coherent segment; flag sparse/incomplete event coverage.
3. Generate a validated structured page script with source event references.
4. Render consistent panels using an image generation provider.
5. Assemble the comic page and store output in private object storage.
6. Deduct a page credit only after successful page generation; failed jobs release reservations.

## Safety and commercial launch
Use original fantasy visual styling, avoid copying third-party artists' distinctive styles, and review Blizzard intellectual-property and CurseForge policies before commercial launch.

Current state: story schema and deterministic timeline helpers implemented. AI provider, image rendering, and page-credit transactions are NOT yet implemented.
