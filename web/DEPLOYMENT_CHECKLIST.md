# Deployment checklist (do not deploy until prerequisites are met)

## Supabase — needed FIRST for a real connected test
1. Create a Supabase project.
2. Apply SQL migrations 0001 through 0024 in order in SQL Editor (ideally via Supabase CLI migrations).
3. Enable Email/Password authentication; create a test account in Authentication > Users.
4. Copy project URL and publishable/anon key to web/.env.local as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
5. Never expose the service role key to the browser.
6. Confirm quest_candidates and refresh_quest_candidates function exist.

## Local development — before Vercel
1. Install Node.js LTS; from web/ run npm install, npm test, npm run lint, npm run build, npm run dev.
2. Open localhost:3000, sign in, import SavedVariables for a test character, verify quests.
3. Re-import same file; verify no duplicate candidates.

## Vercel — after local connected test succeeds
Import GitHub repository; set Root Directory to web. Configure the two NEXT_PUBLIC_SUPABASE_* variables and deploy Next.js.
Add the Vercel domain to Supabase Auth URL configuration if using auth redirects.

## Render — NOT needed for this first slice
Consider Render (or another long-running worker host) later for queued AI comic/image generation. Do not pay for it now.

## Stripe and AI providers — NOT needed yet
Only connect once generation worker, storage, costs, and reservation/refund logic are ready.

## Important
This checklist documents steps, not verified deployments. Current code has not been built or integration-tested against Supabase. Verify the full migration chain before entering real data. The manual import UI requires a logged-in account.
