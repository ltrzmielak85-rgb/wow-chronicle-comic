# Recorded and reconstructed quests — confirmed

Two sources are supported:
1. **Recorded adventure:** Detailed quest and gameplay events captured after addon installation.
2. **Reconstructed adventure:** Previously completed quest verified from available WoW completion information but without a detailed event timeline.

Both may be eligible for player review and 1–5-page generation, with the same credit cost. The selection screen, finished comic reader and exports must display the provenance label and disclosure. Reconstructed stories may add cinematic atmosphere but must never portray unsupported encounters, equipment or rewards as observed facts.

Implementation foundation: provenance fields on quest candidates and comics; typed labels and story policy helpers; draft tests.

Pending: verify TBC Anniversary API support for reading prior quest completion flags; import historical completions without manufacturing timestamps; prevent duplicates between recorded and reconstructed candidates; surface provenance in UI and generated PDF; integrate policy into AI generation. No claim is made that WoW exposes a complete historical quest timeline.
