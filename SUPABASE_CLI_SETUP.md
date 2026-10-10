# Supabase CLI + GitHub setup (Windows)

The original 24 SQL files live in web/supabase/migrations as numbered source history. Their 0001_* filenames are **not** Supabase CLI migration names. Do not run db push directly against that directory.

## One-time local setup

1. Install Git, Node.js LTS, Docker Desktop and Supabase CLI (use `npx supabase` from project root if not globally installed).
2. Clone `https://github.com/ltrzmielak85-rgb/wow-chronicle-comic.git` and open PowerShell in the repository root.
3. Run `npx supabase init` to create the local Supabase configuration (if already initialized, skip this step). Then run `powershell -ExecutionPolicy Bypass -File scripts/prepare-supabase-migrations.ps1`.
4. Check that `supabase/migrations/` contains 24 files with 14-digit timestamp prefixes.
5. Run `git add supabase/migrations && git commit -m "Prepare Supabase CLI migrations" && git push`.
6. Start Docker Desktop, then run `npx supabase start` and `npx supabase db reset`. **Stop and fix errors if any migration fails.** This resets LOCAL development data only.
7. Log in using `npx supabase login`. Find your project ref in Supabase Dashboard → Project Settings → General.
8. Run `npx supabase link --project-ref YOUR_PROJECT_REF`. Enter database password only into the local CLI prompt, never into GitHub or ChatGPT.
9. Check migration status with `npx supabase migration list`.
10. On a **new empty cloud project only**, after local migration tests succeed, run `npx supabase db push --dry-run`, inspect output, then `npx supabase db push`.
11. Verify `public.characters`, `public.adventure_events`, `public.quest_candidates` and the `public.refresh_quest_candidates(uuid)` function in Supabase.

Do not run `db reset --linked` or use destructive commands on the cloud project. Do not put database passwords, access tokens, service role keys or other secrets in git.

## Web app

In web/.env.local set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (use legacy anon JWT key with current client configuration). Enable email/password auth in Supabase. Run `cd web; npm install; npm test; npm run lint; npm run build; npm run dev`. A production deployment to Vercel comes after a successful local import test.

## CI

.github/workflows/supabase-check.yml checks migration files but does NOT automatically deploy. A future deployment workflow should require explicit approval and protected environments.

## Status

The migrations have not been run or verified against a real database by the assistant. The script prepares CLI-compatible filenames; it does not prove that SQL executes successfully.
