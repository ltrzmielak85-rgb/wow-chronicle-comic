# Reference sheet approval — confirmed

1. Generate a draft identity sheet from character attributes and optional screenshot.
2. Mark the sheet pending_review and display it privately to its owner.
3. The player either explicitly approves or requests changes with written notes.
4. Requested changes create a revised candidate sheet; the player reviews again.
5. Comic generation is blocked until an approved reference sheet exists.
6. Approval and replacement must be atomic, with at most one approved sheet per character. Historical gear is selected independently at the quest timestamp.

Committed: review validation and state transitions, schema status and review notes, unique approved-sheet guard, draft tests.

Still required: authenticated owner-only review endpoints, transaction-safe replacement logic, actual image regeneration and player UI, and worker-side approved-sheet checks. No migrations or tests have been executed.
