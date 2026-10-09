# Optional non-expiring credit packs — confirmed

Subscribers may purchase additional credits without changing subscription. Purchased credits never expire, unlike monthly credits which expire at the billing-cycle boundary. Charge one credit per generated page. Spend monthly credits first to preserve purchased balances. A request may combine monthly and purchased credits, but its full 1–20-page cost must be reserved atomically and released completely if the comic fails.

Foundation committed: Stripe payment-intent-idempotent grant table, per-request pack allocations, owner-read RLS, deterministic credit source allocation helper, and draft tests.

Pending: credit pack denominations and prices, Stripe one-time Checkout/webhook integration, robust SQL locking and idempotent allocation/settlement, refunds/chargeback reconciliation, credit purchase UI, and executed tests. Credit grants must only be created from verified successful payments, never client claims. No Stripe product or price has been created.
