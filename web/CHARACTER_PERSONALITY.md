# Player-selected personality — confirmed

Players select 1–3 distinct traits from a controlled list: brave, cautious, honorable, sarcastic, compassionate, mysterious, ruthless, curious, stoic, playful, loyal, ambitious. They may choose balanced, formal, casual, or terse speech. The profile guides recurring dialogue, reactions and narration consistently across comics without changing actual recorded events. Personality is user-authored roleplay direction, not an addon-observed fact.

Implemented: profile schema, prompt helper, database table with owner-read RLS and draft tests.

Outstanding: authenticated profile editor, server ownership validation and write endpoint, worker prompt integration, generation-time profile snapshots and executed tests. The list and maximum trait count can be revised after UX feedback.
