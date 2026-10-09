# Subscription prices and monthly allowances — confirmed provisionally

| Plan | Proposed monthly price (USD) | Monthly page credits |
| --- | ---: | ---: |
| Free | $0 | 1 lifetime free page |
| Adventurer | $7.99 | 20 |
| Hero | $14.99 | 50 |
| Legend | $24.99 | 100 |

Each comic page costs one credit. Quests allow 1–5 pages; chapters 5–20. Paid credits are granted per verified Stripe billing cycle and expire at cycle end, with no rollover currently. Credits are reserved before generation, consumed only when the full comic is delivered, and entirely released after terminal failure.

These prices and allowances are PROVISIONAL pending measured AI image generation, retries, storage, bandwidth, PDF assembly, Stripe fees and tax economics. Do not activate billing until costs and margin thresholds are reviewed. This commit defines typed plan metadata, reference SQL and draft tests; it does not configure Stripe products or webhooks.
