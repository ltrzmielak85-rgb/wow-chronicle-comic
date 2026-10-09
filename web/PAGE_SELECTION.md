# Quest page count — confirmed

Players choose 1–5 comic pages for each completed quest. Before they approve generation, display the exact total: one page costs one credit, so 1–5 pages cost 1–5 credits. No generation begins without explicit approval.

Implementation:
- Shared input validator and quote function.
- Database generation_requests record with immutable requested_pages = quoted_credits and idempotency key.
- Only the authenticated owner may view their requests. Server-controlled writes are required.

Pending: authenticated UI, atomic multi-credit reservation (including daily UTC quota), Stripe entitlement verification, generation worker, all-or-nothing refund behavior for partial failures, and concurrency tests. The current page_ledger is per page and needs a coordinated transaction for multi-page requests. Do not activate generation before this is built.

Important product behavior: player approval must clearly identify whether a multi-page request will be fully refunded on partial failure. Recommended launch behavior: all-or-nothing (either all requested pages succeed or no credits are consumed).
