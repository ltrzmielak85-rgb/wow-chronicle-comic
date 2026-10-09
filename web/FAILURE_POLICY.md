# Generation failure policy — confirmed

All-or-nothing. When the player approves N pages (1–5), reserve N credits atomically. A request is successful only if all N pages are generated, assembled, verified, and stored. Only then publish the complete comic and consume the N credits.

On transient errors, retry with a bounded count and backoff. Do not expose partially generated pages as a completed comic. After final failure, mark the request failed, release all N reserved credits, and discard or expire temporary generated assets. The user may explicitly retry later with a new request.

The database now tracks attempt count and individual attempts, and a pure state decision helper encodes retry/failure outcomes. This is NOT a working queue or transactional quota implementation. Worker leases, retry scheduling, storage cleanup, atomic reservation/finalization/refund procedures, and concurrency tests remain required before production use.
