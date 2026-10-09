# Page limits and credit pricing — confirmed

Individual quest comics: 1–5 pages. Multi-quest chapters: 5–20 pages. One page costs one credit in both cases. The player sees the exact cost and must approve before generation. The complete chapter is all-or-nothing: reserve the full quoted amount, retry transient failures, and release every reserved credit if any page prevents successful delivery.

Implemented: source-aware validation and quoting; SQL check constraints; draft tests.

Not yet implemented: atomic 20-credit reservations, quota entitlement compatibility, asynchronous batch rendering and PDF assembly, and UI. The current proposed subscription tiers (3/10/25 daily credits) can restrict chapter size; the purchase and entitlement UX must account for that before launch.
