# Historical character progression — confirmed

The character's identity (face, skin tone, tusks, hairstyle, defining features) remains consistent, while level and gear evolve with recorded game progression. A comic for an earlier quest must not show equipment first recorded later.

Implemented: private historical appearance snapshot schema; pure point-in-time selector; continuity instructions; draft tests.

Planned: addon capture of equipment/level snapshots and timestamps, importer persistence, quest-specific visual reference selection, user correction of missing historical data, and image-generation integration. Existing addon versions may not capture gear; when historical information is absent, avoid claiming an exact reconstruction.

Snapshots are immutable observations, not a promise that every equipment change was recorded.
