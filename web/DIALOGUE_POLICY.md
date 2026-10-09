# Cinematic, lore-faithful dialogue — confirmed

Preserve recorded quest facts, NPC identities, significant dialogue, and the order of milestones. Permit original conversations, reactions, inner thoughts, and dramatic narration that fit Warcraft lore and do not contradict gameplay evidence. Original lines are cinematic adaptations, not purported verbatim quest dialogue. A line marked recorded must be tied to a source event; creative lines are marked cinematic_original.

Implemented: explicit dialogue provenance schema, prompt policy, and draft tests. Existing panel scripts already distinguish dialogue embellishment. Still pending: actual model integration, grounding checks against stored event text, review UI, and executed tests. A source event ID alone does not prove that a line is a verbatim quotation; the worker must validate quoted text before marking it recorded.
