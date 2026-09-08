# dars-api — Dars-platforma backend

Bitta Node-xizmat + PostgreSQL 16. Uch qatlam: **jonli-API** (Supabase o'rnini bosadi, 98 dars shu bilan ishlaydi),
**LMS-ko'prik** (JWT tekshiruv, guruh-mosligi, natija-navbat), **o'quvchi-holat** (progress, ko'rish rejimi, solo).
Reja va qarorlar: `../BACKEND_REJA_UZ.md`.

## Lokal ishga tushirish

```bash
cd server
docker compose up -d          # PostgreSQL 16 → 127.0.0.1:5433 (dars_dev + dars_test)
cp .env.example .env          # kerak bo'lsa qiymatlarni o'zgartiring
npm install
npm run migrate               # migrations/*.sql tartib bilan
npm run dev                   # http://127.0.0.1:3001/api/v1/health
```

## Testlar

```bash
npm test                      # unit (bazasiz)
npm run test:int              # integratsion — docker'dagi dars_test bazasi, har fayl toza sxemadan boshlaydi
npm run test:all
```

## Tuzilma

```
src/
  index.js            kirish nuqtasi: config → logger → pool → migratsiya-tekshiruv → app → listen → nazokatli yopish
  app.js              buildApp(): Fastify + CORS allowlist + rate-limit + xato-ishlov + marshrutlar (testlar inject bilan ishlatadi)
  config.js           env → tekshirilgan, muzlatilgan config (qiymat hech qachon log'da yo'q)
  lib/logger.js       pino; token/JWT/ism/kod redact
  lib/errors.js       AppError + pg SQLSTATE → HTTP moslik (P0001 xabari o'quvchiga ko'rsatiladi)
  db/pool.js          pg.Pool (statement_timeout 5 s) + withTransaction
  db/migrate.js       SQL-migratsiya yurgizgich: tartib, checksum, advisory lock, CRLF-normalizatsiya
  plugins/            error-handler
  modules/health      GET /api/v1/health
  modules/live        app-config sinxron (mentor_code env'dan) — jonli-API marshrutlari 1-bosqichda qo'shiladi
migrations/           0001_live_core.sql — Supabase'dagi 12 faylning yakuniy holati (imzo va xabarlar o'zgarmagan)
test/unit             config, migrate
test/integration      live_core (SQL funksiyalar xulqi)
deploy/               Caddyfile, systemd unit, deploy.sh, setup-droplet.sh (0-bosqich davomida)
```

## LMS-ko'prik (liveToken) — lokal sinov

`/api/v1/lms/join` va `/api/v1/lms/me` — Coddy Camp LMS bergan JWT bilan PIN'siz kirish (LMS v1.2 §5–§6).
Yoqilishi uchun `.env` da `CODDYCAMP_*` + `TOKEN_ENC_KEY` bo'lishi kerak; bo'lmasa 503 `lms_bridge_disabled` (jonli-API ishlayveradi).

```bash
# dev: School API o'rnida soxta server (guruhlar: 34174/34175 → 861, 34176 → 862, 34177 → 861+862)
node tools/fake-school-api.mjs                       # :3999  (.env: CODDYCAMP_SCHOOL_API_URL=http://127.0.0.1:3999)
npm run migrate && npm run seed:catalog              # 0002 + lesson_catalog (server/data/lesson-catalog.json)
npm run mint -- --role mentor  --sub 145   --gid 861 # sinov JWT (server secret'i bilan; prod'da ISHLATILMAYDI)
npm run mint -- --role student --sub 34174 --name "Ali Valiyev"
# brauzer E2E (repo ildizida): DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort
node ../tools/e2e-lms.mjs                            # /lms-harness.html — LMS-simulyator (token kechikib keladi)
```

Katalog: `node scripts/gen-lesson-catalog.mjs` (repo ildizida) → `server/data/lesson-catalog.json` → `npm run seed:catalog`.
Backend brauzerdan kelgan `lesson_id` ga ishonmaydi — faqat katalogdagisi ochiladi.

**O'quvchi-holat (3-bosqich):** `join` daraxti — faol urinish → jonli sessiya → ko'rish (tugagan urinish) → solo.
`PUT /me/progress` (dars ildizi har 2 s, `src/live/progressSync.js`) — solo'da `screen >= total-1` → urinish
`completed`; `POST /lms/restart` — yangi solo. Xizmat-ishlar (15 daqiqa): jonli sessiyasi yopilgan urinish → `live_ended`,
7 kunlik solo → `auto_7d`, 90 kundan keyin ism o'chadi. Testlar: `test/integration/lms_state.test.js`.

**Natija-navbat (4-bosqich):** sessiya yopilgach (mentor «Erkin qilish», TA almashtirdi, tashlandiq) yoki solo urinish
tugagach (`completed` / `auto_7d`; `restarted` yuborilmaydi) sweeper `result_events(pending)` yozadi, ishchi har 5 s
School API `lesson-results` ga yuboradi: 201/200 → `delivered` · tarmoq/429 (Retry-After)/5xx → `retry_wait`
(1-3-10 s, 1-5-15-60 daqiqa, 30 urinish) · 401/403/409/422 → `manual_review` + Telegram. PIN bilan kirganlar payload'ga
kirmaydi (identifikatsiya yo'q). Payload qoidalari `modules/results/result-builder.js` (sof, unit-test) + `validatePayload`.
Admin: `/admin` (basic auth, `ADMIN_USER`/`ADMIN_PASSWORD`) — navbat, e'tibor kerak, «qayta yubor».

## Serverga chiqarish — LMS serverida Docker (2026-09-07 qarori; DigitalOcean varianti BEKOR)

Haqiqiy tartib: `DOCKER.md` (compose: postgres → migrate → seed → api → backup) + `STAGING_QABUL_UZ.md` (qabul, runbook).
Deploy = GitLab `dars-api-coddy` ga push (`bash scripts/sync-dars-api.sh staging|main`) → CI o'zi deploy qiladi (`main` = prod, avtomatik!).
Manzillar: staging `https://staging-dars-api.coddycamp.uz`, prod `https://dars-api.coddycamp.uz`. Env-o'zgarish — Kristinaga yoziladi.

### (arxiv) DigitalOcean varianti — ishlatilmaydi, `deploy/` skriptlari zaxira sifatida qoldi

Bir marta (root): `deploy/setup-droplet.sh` — PostgreSQL 16 (ikki baza, owner/app rollar), Node 22, Caddy, systemd,
sparse-clone (`/opt/dars-api/{prod,staging}/repo`, faqat `server/`), ufw, fail2ban, backup-cron, `/etc/dars-api/*.env` shablonlar.

Har reliz (staging avval, keyin prod):

```bash
ssh dars@api.azizbek.site 'sudo /opt/dars-api/bin/deploy.sh staging main'
ssh dars@api.azizbek.site 'sudo /opt/dars-api/bin/deploy.sh prod v0.3.0'
```

`deploy.sh`: fetch → checkout → `npm ci --omit=dev` → `migrate` (owner roli) → `systemctl restart` → health. Yiqilsa oldingi
commit `/opt/dars-api/<env>/PREV` da, qaytish buyrug'i chiqadi. Loglar: `journalctl -u dars-api@prod -f`.
Caddy kirish-logida Authorization/Cookie o'chirib yoziladi (`deploy/caddy/Caddyfile`). Zaxira: `deploy/backup.sh` (03:00, 14 kun).

## Deploy qilingan serverni tashqaridan tekshirish

`node --env-file=.env.deploy.staging tools/staging-check.mjs https://<manzil>` — 19 band, chiqish kodi = ✗ soni.
`--read-only` (prod), `--local` (127.0.0.1), `--sha <qisqa>`, `--lesson <id>`. Tartib va ✗ → kimga jadvali: `../STAGING_QABUL_UZ.md`.

## Yuklama-sinov (2026-09-03, lokal Windows + Docker PG — droplet'da 2–3 barobar past bo'lishi mumkin)

`LOG_LEVEL=warn RATE_LIMIT_SCALE=100 node --env-file=.env src/index.js` → `node tools/loadtest.mjs` (10 guruh × 30 o'quvchi):

| Stsenariy | Natija |
|---|---|
| Polling, 300 o'quvchi, 120 so'rov/s (haqiqiy sur'at) | p50 20 ms · p95 99 ms · 0 xato |
| Polling maksimal (100 ulanish) | ~3100 so'rov/s · p99 50 ms · 0 xato |
| Javob-portlash (300 javob bir vaqtda) | p95 430 ms · 0 xato |
| Aralash (polling + mentor-statistika + heartbeat) | p95 74 ms · 0 xato |

Xulosa: 10 parallel guruh uchun 25× zaxira. Prod env'da `DB_POOL_MAX=20` (javob-portlash navbati qisqaradi).
`RATE_LIMIT_SCALE` faqat sinov / juda katta NAT uchun; prod'da 1.

## Tiklash mashqi (bajarildi 2026-09-03, docker'da)

```bash
pg_dump -U dars -Fc --no-owner dars_dev > dars_dev.dump          # backup.sh bilan bir xil format
createdb -U dars dars_restore && pg_restore -U dars -d dars_restore --no-owner dars_dev.dump
psql -U dars -d dars_restore -c "select id from schema_migrations" # 4 migratsiya, 16 jadval, 10 funksiya
```
Serverda: `/var/backups/dars-api/dars_prod-<sana>.dump` → yangi dropletda `setup-droplet.sh` → `pg_restore -U dars_prod_owner -d dars_prod --no-owner <fayl>` → `deploy.sh prod`. Maqsad: 30 daqiqa.

## Hodisa-yo'riqnoma (dars vaqtida)

| Belgi | Nima qilish |
|---|---|
| Health 503 / o'quvchilarda «Qayta ulanmoqda…» | `tools/staging-check.mjs <prod>` → Kristinaga yozish (log: Dozzle / `docker compose logs api`); GitLab'da oxirgi yashil deploy-job'ni qayta ishga tushirish = restart/rollback. (eski droplet: `journalctl -u dars-api@prod -n 100`; baza: `systemctl status postgresql`. Restart: `sudo systemctl restart dars-api@prod` (3 s). |
| Server umuman javob bermaydi | DO panelida droplet holati; qayta ishga tushirish. Dars davomida: mentor **PIN-yo'l** bilan davom etadi (dars fayli oq ekran bermaydi, «Qayta ulanmoqda» ko'rsatadi); o'quvchilar javoblari 3 marta qayta uriniladi. |
| LMS-token bilan kirish ishlamayapti, PIN ishlayapti | `journalctl -u dars-api@prod | grep "token rad"` → reason (kid/iss/aud/expired). LMS jamoasiga reason yuboriladi. Dars PIN bilan davom etadi. |
| Natija LMS'ga ketmayapti | `/admin` → `manual_review`/`retry_wait` → `last_http_status`, `last_error`. 401/403 → `sapi_` token; 422 → payload (LMS bilan); 5xx/429 → o'zi qayta uradi. «Qayta yubor» tugmasi. |
| Disk to'ldi / loglar | `journalctl --disk-usage`; Caddy loglari 50 MB × 7 rotatsiya; `/var/backups/dars-api` 14 kun. |
| Yomon deploy | `sudo /opt/dars-api/bin/deploy.sh prod $(cat /opt/dars-api/prod/PREV)` |

## Qoidalar

- **Migratsiya qayta tahrirlanmaydi.** Qo'llanilgan faylning checksum'i o'zgarsa yurgizgich to'xtaydi. Yangi `NNNN_nom.sql` yoziladi.
- **Ilova start'da migratsiya qilmaydi.** `deploy.sh` avval `npm run migrate`, keyin restart. Start'da qolgan migratsiya bo'lsa xato bilan chiqadi.
- **Sirlar env'da.** Mentor-kod `LIVE_MENTOR_CODE` → startda `app_config` ga sinxron. SQL fayllarda sir yo'q.
- **Loglarda** token, JWT, `sapi_`, ism, to'liq payload yo'q (pino redact). Har javobda `x-request-id`.
- **Xato shakli** hamma joyda bir xil: `{ error, message, details? }`. Klient `message` ni o'quvchiga ko'rsatadi.
- Prod/staging: `HOST=127.0.0.1` (Caddy orqasida), `CORS_ORIGINS` faqat https, `TRUST_PROXY=true`.
