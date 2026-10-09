# Web MVP (implementation in progress)

Next.js website and Supabase schema for WoW Comic Chronicle.

## Setup
1. Create a Supabase project and run `supabase/migrations/0001_initial.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local` and configure public Supabase URL and anon key. Never commit secrets.
3. In `web/`, run `npm install` and `npm run dev`.
4. Deploy `web/` to Vercel after configuring environment variables.

## Implemented
- Landing page.
- Database tables for characters, events, comics, pages, subscriptions and page ledger.
- Row-level security; server-only billing writes by design.
- Authenticated adventure event upload API with idempotent event sequence handling.

## Not yet implemented
- Signup/login UI and SavedVariables upload parser.
- Companion pairing and automated sync.
- Comic image generation and credit reservation/consumption.
- Stripe checkout and verified webhook handling.
- CurseForge publishing and addon ZIP release pipeline.

Subscription pricing is proposed in USD, not live. Free credit is once per account, to be enforced by a future atomic server-side operation.
