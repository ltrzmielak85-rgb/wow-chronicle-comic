# Quest approval workflow — confirmed

1. Addon records events; manual upload or Windows companion synchronizes them.
2. Backend recognizes QUEST_TURNED_IN and creates a reviewable quest candidate, idempotently.
3. Website lists candidates per character, with quest title, completion date and available event coverage.
4. Player explicitly approves a candidate and requests comic generation.
5. Trusted backend atomically reserves a page slot; queue processes narrative, image rendering and page assembly.
6. On success, mark page ready and consume credit. On failure, release reservation so the user does not lose a credit.
7. Repeated requests for the same candidate must be idempotent; no double billing.
8. Free tier allows one successful page lifetime per account. Paid tiers have UTC daily quotas.

Implemented in this commit: quest candidate schema and pure turn-in detector.
Not implemented yet: automatic candidate ingestion, review UI, approval endpoint, atomic quota reservation/finalization, worker, AI generation and rendering.

Important: a completed quest may span several pages; user must approve each page or an explicitly displayed page count before credits are reserved. Do not generate extra pages without consent.
