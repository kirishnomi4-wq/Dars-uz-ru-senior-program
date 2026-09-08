# dars-api — LMS serverida Docker bilan ishga tushirish

**Tarkib:** `Dockerfile` (Node 22, faqat prod-paketlar, `node` foydalanuvchisi, healthcheck) ·
`docker-compose.deploy.yml` (postgres 16 + migrate + api + backup) · `.env.deploy.example` (env ro'yxati) ·
`.gitlab-ci.yml` (test → image → deploy shabloni).

**Bir marta (server):** papka `/srv/dars-api/prod` (va `/srv/dars-api/staging`): `docker-compose.deploy.yml` +
`.env.deploy` (sirlar to'ldirilgan). Reverse-proxy: `https://<API-manzil>` → `http://127.0.0.1:3001` (staging: 3002),
`X-Forwarded-For` va `X-Forwarded-Proto` uzatilsin (ilovada `TRUST_PROXY=loopback,172.16.0.0/12`; `true` da mijoz IP ni soxtalaydi, SON bersangiz esa req.ip hammaga bitta bo'lib qoladi).

**Har deploy (CI yoki qo'lda):** `docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d --build`.
Tartib o'zi: postgres sog'lom → `migrate` (sxema) → `seed` (dars-katalogi, idempotent) → `api`; birortasi yiqilsa api ko'tarilmaydi.
Tasvir manzili `IMAGE_REPO` (CI'da GitLab registry; lokal `--build` da default `dars-api`). CI (Kristina, 2026-09-08): `staging` shoxi → avtomatik
deploy `/srv/dars-api/staging`; `main` → `/srv/dars-api/prod` ham avtomatik (2026-09-08 dan). Health 60 s ichida javob bermasa — oldingi tasvirga o'zi qaytadi. Rollback = eski commit'ning deploy-job'ini qayta ishga tushirish.
Tekshiruv: `curl http://127.0.0.1:3001/api/v1/health` → 200, `checks.db = ok`, `checks.catalog` ≥ 1.

**Tashqaridan qabul (biz):** `node --env-file=.env.deploy.staging tools/staging-check.mjs https://<API-manzil>` — 19 band
(health, migratsiya/katalog soni, soat, TLS, CORS, JWT, proksi-IP, admin, mentor-oqim, School API ulanishi). Tartib: `STAGING_QABUL_UZ.md`.

**Zaxira:** `backup` xizmati har 24 soatda `pg_dump -Fc` → `dars-backups` volume, 14 kun. Tiklash:
`docker compose exec -T postgres pg_restore -U dars -d dars_prod --clean --if-exists < dump`.

**Loglar:** `docker compose logs -f api` (JSON, pino; token/JWT/ism yo'q). Admin: `https://<API-manzil>/admin` (basic auth).

**Resurs:** api 768 MB, postgres 512 MB, backup 128 MB limit; disk ~10 GB (baza + 14 kunlik dump).

**Talab:** Docker Engine 24+ va Compose v2 (`service_completed_successfully` uchun).
