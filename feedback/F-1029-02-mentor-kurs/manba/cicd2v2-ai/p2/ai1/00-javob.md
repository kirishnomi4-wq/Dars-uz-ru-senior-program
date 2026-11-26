# 1-AI (Opus) — CI/CD-2 p2 javobi, aynan (26.11, agent yakuniy hisoboti)

I changed one file: `.github/workflows/ci.yml` (32 lines added). I did not touch any other file, and nothing was committed or pushed. I did not run the smoke itself, because that needs a running PostgreSQL and I was not allowed to start one here. It will first actually run on GitHub.

**What I added:** a new `smoke` job after the existing `test` job.
- **Only after tests pass:** with `needs: test`, the smoke job does not start if the `test` job fails.
- **Temporary PostgreSQL:** a `postgres:18` database starts inside the job (user `postgres`, password `postgres`, database `shop`, port 5432). It is deleted when the job ends. The password is only for that throwaway database, not a real secret.
- **Waits until the database is ready:** `pg_isready` checks the database every 5 seconds, up to 10 tries. The job's steps start only once it answers "ready".
- **Steps:** checkout, then Node 24 with the npm cache, then `npm ci`, then `npm run smoke`.
- **DATABASE_URL in one place:** it is set only on the `npm run smoke` step, as `postgresql://postgres:postgres@localhost:5432/shop`. It is not set for the whole workflow or for the job.

**How I checked:**
- The file parses without errors in two YAML readers (Python and js-yaml).
- I compared it with the previous version in git: the `test` job and the triggers (`push`, `pull_request`) are exactly the same, and only the `smoke` job was added.
- `DATABASE_URL` appears in only one place in the file, the smoke step.
- I read `scripts/smoke.js` to make sure the job gives it what it needs. It reads `DATABASE_URL`, connects to the `postgres` database, creates and later deletes its own `shop_smoke` database, and builds the project itself. The `postgres` user has the rights for this, and `npm ci` installs the tools it uses, including the ones for `nest build` and the seed.
- I ran the same commands the `test` job runs: `npx tsc --noEmit` passed, and `npx jest` passed 25 of 25 tests. So the `test` job should pass and the smoke job will get its turn.
- `actionlint`, a tool that checks GitHub workflow files, is not installed here, so the file was not checked against GitHub's workflow rules.
