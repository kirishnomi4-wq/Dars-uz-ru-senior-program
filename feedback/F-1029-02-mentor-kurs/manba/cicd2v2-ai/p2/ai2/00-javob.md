# 2-AI (Haiku) — CI/CD-2 p2 javobi, aynan (26.11, agent yakuniy hisoboti)

Smoke job added to CI. Only one file changed: .github/workflows/ci.yml (+33 lines). Nothing committed or pushed, no other files touched.

What changed:
- The existing `test` job is unchanged (checkout, setup-node 24, npm ci, tsc, npm test, build).
- New `smoke` job with `needs: test`, so it runs only when the test job is green.
- Steps in smoke: checkout, setup-node 24 with npm cache, npm ci, then:
  1. Start a temporary `postgres:16` container (`pg-smoke`, user postgres, DB `shop`, port 5432).
  2. Wait loop: up to 30 tries, 2 s apart, using `docker exec pg-smoke pg_isready -h 127.0.0.1`. It dumps the container logs and fails if PostgreSQL is not ready after 60 s.
  3. `npm run smoke`, with `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shop` set on this step only.
  4. Cleanup with `if: always()`: `docker rm -f pg-smoke`.

How I checked it:
- Parsed ci.yml with js-yaml. It has two jobs (test, smoke), smoke needs test, the test steps are unchanged, and DATABASE_URL appears only on the smoke step.
- Ran `npm run smoke` locally with DATABASE_URL unset. It fails immediately with "DATABASE_URL topilmadi". So smoke has no in-memory fallback in the app code, and it needs a database as your request says.
- I did not run the full smoke against PostgreSQL. You told me not to start or stop a database server on this machine, and smoke would create and drop a `shop_smoke` database on whatever server it reaches. The first real check is the CI run itself.

Notes:
- The local smoke run created a `dist/` build in the project folder. It is a build artifact, not a source change.
- I did not verify the postgres:16 image tag against GitHub's runner behavior beyond the wait loop. If the first run shows the wait loop timing out, check the `docker logs` output printed by that step.
