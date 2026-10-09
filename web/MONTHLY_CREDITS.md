# Monthly subscription credits — confirmed

Subscription plans grant a credit allowance for each Stripe billing cycle, replacing the former daily UTC reset. Players may spend credits at any point during that cycle. One generated comic page costs one credit. Individual quests use 1–5 pages; chapters use 5–20 pages. Unused credits expire at cycle end (no rollover under this policy). The one-time free credit is tracked separately.

Credits are reserved before generation and consumed only when the entire comic succeeds. A failed comic releases the full reservation; never charge for partial delivery. Reservations count against available balance to prevent overspending. A reservation is tied to its originating billing cycle, even if the worker finishes after the cycle ends; cross-cycle refund/retry semantics require careful transactional implementation.

Implemented foundation: credit_cycles and credit_reservations tables with owner-read RLS; monthly balance helper and draft tests.

Not implemented: verified Stripe billing-cycle ingestion, server-only atomic reservation/finalization/release procedures, account credit display, payment integration, and running tests. Previous proposed subscription allowances were DAILY (3/10/25) and are NOT valid monthly plan quantities; monthly allowances and prices must be decided before enabling billing.
