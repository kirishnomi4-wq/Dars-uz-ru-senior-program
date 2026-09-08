# BACKEND REJA v2 — hammasi bitta serverda

**Sana:** 2026-09-03 · **Holat:** TASDIQLANGAN YO'NALISH (v1 gibrid rad etildi, Supabase yopiladi) · **Asos:** LMS v1.2 + v5-javob + `dars-platform-openapi (3).yaml` + 2026-09-03 muhokama

Qabul qilingan qarorlar: hammasi DigitalOcean'da · Frankfurt · o'z domenimiz · staging bor · Docker bor · solo natija 1-versiyada · solo tugashi = oxirgi ekran · ismlar 90 kun, javoblar 1 yil · bir guruh-bir dars ikkinchi sessiya ochilsa eskisi avto-yopiladi · vaqt va sifat: «senior» darajada, shoshilmasdan.

---

## 0. Qaror bir jumlada

Bitta droplet, bitta PostgreSQL, bitta Node-xizmat (prod + staging nusxalari). Jonli-dars SQL mantiqi (12 fayl, 10 funksiya) **o'zgarishsiz** shu bazaga ko'chadi. Node ustiga uch qatlam quriladi: jonli-API (Supabase o'rnini bosadi), LMS-ko'prik (JWT, guruh, natija), o'quvchi-holat (progress, ko'rish rejimi, solo). Darslardagi 98 ta inline jonli-blok bitta umumiy modulga (`src/live/`) yig'iladi.

---

## 1. Hozirgi holat va tashxis

| Nima | Fakt |
|---|---|
| Jonli mexanika | Supabase: 7 jadval, 10 PL/pgSQL funksiya (976 qator, hammasi repoda `supabase/`), RLS, server-ball. Realtime ishlatilmaydi, faqat polling 2,5 s |
| Klient | 98 src + 90 lms faylda `useLiveSession` + `LiveGate` + `LiveBadge` INLINE. Mantiq fayllar bo'ylab bir xil, farq faqat izohlarda (2026-09-03 diff bilan tasdiqlandi) |
| LMS-yig'uvchi | `scripts/build-lms.mjs` esbuild `bundle:true` — importlar bitta faylga yig'iladi. Umumiy modul mumkin |
| Backend | yo'q |
| Sirlar | `.env.coddycamp.local` (gitignored): 2 `sapi_`, JWT secret, iss/aud/kid |

**Tashxis — «uyga borib ko'ra olmaydi» (F-0903-01):** darvozada faqat PIN+ism yo'li bor; `selfStudy` funksiyasi yozilgan, tugmasi yo'q. Boshqa qurilma yoki tozalangan localStorage → eski PIN → «Bu dars allaqachon yakunlangan» → berk ko'cha. Ustiga sahifa-holat saqlovi 6 soatlik (`ccProgress`), 7–8 soatdan keyin javoblar yo'q. 97 darsda bir xil. Yechim §6.3 (ko'rish rejimi) + §4.3 (server-progress).

---

## 2. Maqsadli arxitektura

```
 lms.coddycamp.uz (LMS/CRM ichida JSX)      coddycamp-*.vercel.app (demo, mentor-zaxira)
          │ liveToken (JWT)                            │ PIN (tokensiz)
          ▼                                            ▼
 ┌──────────────────── api.<domen> · Caddy TLS ────────────────────┐
 │  Node 22 + Fastify (dars-api)                                   │
 │  ├─ /api/v1/live/*      jonli-API  (10 SQL funksiya + 3 o'qish) │
 │  ├─ /api/v1/lms/*       LMS-ko'prik (JWT 12 band, join, finish) │
 │  ├─ /api/v1/me/*        progress · ko'rish · solo               │
 │  ├─ /admin              kuzatuv-sahifa (basic auth)             │
 │  └─ worker              natija-navbat (in-process, advisory lock)│
 │  PostgreSQL 16 ── dars_prod · dars_staging                      │
 └────────────┬────────────────────────────────────────────────────┘
              │ server-to-server (sapi_ tokenlar)
              ▼
 school-api.coddycamp.uz  (integration-context · lesson-results)
```

Nega bitta jarayon: 2 GB serverda ikki xizmat (API + alohida worker) ortiqcha; worker modul sifatida ajratilgan, kerak bo'lsa 1 satr bilan alohida jarayonga chiqadi.

---

## 3. Server tarkibi

| Qism | Tanlov | Izoh |
|---|---|---|
| Droplet | Basic 2 GB / 1 vCPU / 50 GB, **fra1**, Ubuntu 24.04 | $12; yetmasa 4 GB ($24) — ko'chirish emas, resize |
| Domen | **azizbek.site** (qabul qilindi 2026-09-03), DNS DO'da | `api.azizbek.site` prod · `staging-api.azizbek.site` staging · admin = `api.azizbek.site/admin` |
| TLS/proxy | Caddy | avto-sertifikat, 6 qator config |
| Ishga tushirish | Node 22 LTS, Fastify 5, `pg`, `jose`, `pino` | TypeScript emas — JS + JSDoc (loyiha odati), lekin `zod`/JSON-schema validatsiya majburiy |
| Baza | PostgreSQL 16, lokal, ikki baza | `dars_prod`, `dars_staging`; migratsiyalar `node-pg-migrate` |
| Jarayonlar | systemd: `dars-api@prod` (:3001), `dars-api@staging` (:3002) | bitta unit-shablon, ikki env-fayl |
| Sirlar | `/etc/dars-api/prod.env`, `staging.env` (root:dars-api 640) | repo'ga tushmaydi; scp bilan qo'lda |
| Zaxira | `pg_dump` har kecha 03:00 → DO Spaces (30 kun) + haftalik droplet-snapshot | tiklash mashqi 1 marta majburiy (§10) |
| Xavfsizlik | ufw 22/80/443 · SSH faqat kalit · fail2ban · unattended-upgrades · NTP (JWT 60 s bardoshi uchun) | |
| Kuzatuv | `/api/v1/health` · UptimeRobot (bepul) · Telegram-bot: server yiqildi, `manual_review`, disk 80% | |
| Deploy | `deploy.sh <prod|staging>`: `git pull` → `npm ci` → migrate → restart → health | staging avval, prod keyin |
| Loglar | journald 14 kun; pino JSON; JWT/sapi/ism/payload **yo'q** | |

Repo: `server/` (`src/`, `sql/`, `migrations/`, `test/`, `deploy/`, `docker-compose.yml`, `README.md`). Lokal ishlab chiqish: Docker'da PostgreSQL 16 + Node lokal.

---

## 4. Ma'lumotlar modeli

### 4.1 Jonli qatlam — o'zgarishsiz
`supabase/*.sql` → `server/sql/live/` ga ko'chadi, tartib bilan yuritiladi (`live_sessions`, `session_secrets`, `live_players`, `player_secrets`, `live_answers`, `quiz_keys`, `app_config` + 10 funksiya). Supabase'ga xos qismlar olib tashlanadi: `grant … to anon`, `supabase_realtime` publication, RLS (endi baza brauzerga ochiq emas — faqat Node kiradi). Mentor-kod `app_config`da qoladi (zaxira-sayt PIN-yo'li uchun).

### 4.2 LMS-ko'prik (yangi)
```sql
lms_tokens        (jti PK, role, subject_id, exp, first_seen_at, session_id)              -- UNIQUE(jti)
lms_sessions      (id PK, pin → live_sessions, lesson_id, lesson_version, mode live|solo,
                   gid, teacher_id, mentor_jti, status live|ended, started_at, finished_at,
                   auto_ended_by session_id)                                              -- §6.6
lms_participants  (session_id, role, subject_id, player_id, player_token_enc, crm_id,
                   display_name, joined_at, name_purged_at,
                   UNIQUE(session_id, role, subject_id))
result_events     (event_id PK, session_id, payload jsonb, status pending|retry_wait|delivered|manual_review,
                   attempts, next_try_at, http_code, request_id, response jsonb, created_at, updated_at)
context_cache     (subject_id PK, groups jsonb, fetched_at)                                -- 5 daqiqa
lesson_catalog    (lesson_id PK, title_uz, title_ru, version, total_questions, active)     -- generatordan
```

### 4.3 O'quvchi-holat (yangi — «uyga borib ko'rish» yechimi)
```sql
student_progress  (subject_id, lesson_id, attempt_id, screen, answers jsonb, earned jsonb,
                   started_at, updated_at, PRIMARY KEY(subject_id, lesson_id, attempt_id))
attempts          (id PK, subject_id, lesson_id, kind live|solo, session_id, status active|finished,
                   started_at, finished_at, result_event_id)
```
Progress har 2 s (debounce) yoziladi; localStorage kesh bo'lib qoladi (TTL olib tashlanadi, server ustun).

### 4.4 Saqlash muddati (cron, har kecha)
- `display_name` → `null` natija yetkazilganidan 90 kun keyin (`name_purged_at`).
- `live_answers`, `student_progress` xom holda 1 yil, keyin yig'ma jadval (`attempt_stats`) qolib, xom o'chadi.
- `live_sessions` eski 24-soatlik tozalash **bekor** — endi `lms_sessions` bilan bog'liq, ko'rish rejimi uchun kerak.

---

## 5. API (`/api/v1`, hammasi JSON, versiyalangan)

### 5.1 Jonli-API (Supabase o'rnini bosadi; klient `src/live/` orqali)
| Yo'l | Nima | Eslatma |
|---|---|---|
| `POST /live/rpc/:fn` | allowlist: 10 funksiya nomi → `select * from fn($1…)` | argumentlar JSON-schema bilan; `set_quiz_keys` mentor-kod O'RNIGA sessiya-token qabul qiladi (yangi SQL-variant `set_quiz_keys_by_token`) |
| `GET /live/session/:pin` | `live_sessions` qatori | 2,5 s polling; `ETag`/304 bilan trafik 5 barobar kamayadi |
| `GET /live/players/:pin` · `GET /live/answers/:pin?screen=` | statistika | hozirgi 3 so'rov shakli |
| Rate-limit | `join_session` IP bo'yicha 20/min, keyin 10 daqiqa blok | PIN-perebor himoyasi |

Keyinchalik (v2.1): `GET /live/stream/:pin` SSE — polling o'rniga; klientda bitta modul o'zgaradi.

### 5.2 LMS-ko'prik
| Yo'l | Kim | Nima | Javob |
|---|---|---|---|
| `POST /lms/join` `{lesson_id, lesson_version, answer_key?, session_id?}` | mentor | JWT 12 band → katalog → `jti` → (bor bo'lsa eski live sessiya avto-yopish §6.6) → `create_session` + kalit yuklash → `lms_sessions` | `{mode:'mentor', pin, token, gid}` |
| `POST /lms/join` | o'quvchi | JWT → kontekst (kesh) → faol sessiya izlash → **qaror daraxti §6.2** | `{mode:'student'…}` · `{mode:'review'…}` · `{mode:'solo'…}` · `{choose:[…]}` |
| `GET /lms/me?lesson_id=` | ikkalasi | F5/qayta kirish: ochiq attempt yoki ko'rish | `liveStore` shakli + progress |
| `POST /lms/finish` `{pin}` | mentor | snapshot → payload → `result_events(pending)` | `{event_id, status}` |
| `POST /lms/solo/finish` `{attempt_id}` | o'quvchi | oxirgi ekranga yetganda; server-javoblardan payload | `{event_id}` |
| `POST /lms/restart` `{lesson_id}` | o'quvchi | ko'rishdan yangi solo-urinish | `{mode:'solo'…}` |

### 5.3 O'quvchi-holat
`PUT /me/progress` (debounce 2 s, `If-Match` bilan eskisi yangisini bosmaydi) · `GET /me/progress?lesson_id=` · `GET /me/review?lesson_id=` (javoblar + ball + podium o'rni, faqat o'ziniki).

### 5.4 Admin va xizmat
`GET /admin` (basic auth): faol sessiyalar, ishtirokchilar soni, natija-navbat statuslari, `manual_review` ro'yxati + «qayta yubor» tugmasi, oxirgi 100 xato · `GET /health` (DB, School API ping, navbat uzunligi, disk) · `GET /metrics` (Prometheus-format, keyinroq).

---

## 6. Oqimlar

### 6.1 Mentor kiradi (CRM → JSX)
`liveToken` → `join` → 12 band → `lesson_id` katalogda → `jti`: yangi → yoziladi; shu sessiyaniki → qaytariladi; boshqa sessiyaniki → `409` → shu `gid+lesson_id` uchun live sessiya bormi → bor bo'lsa avto-yopish (§6.6) → `create_session` (mentor-kod serverda) → `set_quiz_keys_by_token(answer_key)` → `lms_sessions` → javob. Ekranda PIN baribir ko'rinadi (zaxira).

### 6.2 O'quvchi kiradi (LMS → JSX) — qaror daraxti
1. JWT 12 band → `sub`, `name`, `crm_id`.
2. `attempts` da shu `lesson_id` uchun **faol** urinish bormi → bor: `me` mantiqi (davom etadi, §6.4).
3. Kontekst → ruxsatli guruhlar → `lms_sessions` da `status=live AND lesson_id AND gid IN (…)`:
   - **1 ta** → `join_session(pin, name)` → `attempts(live)` → `{mode:'student'}`.
   - **ko'p** → `{choose:[{session_id, lesson_title, started_at}]}` (guruh nomi yo'q) → tanlov → shu yerga qaytadi.
   - **yo'q** → 4-qadam.
4. Shu o'quvchining shu darsda **tugagan** urinishi bormi → bor: `{mode:'review', attempt_id, answers, score, rank}` — **ko'rish rejimi** (§6.3).
5. Yo'q → `{mode:'solo'}`: shaxsiy sessiya (`create_session` solo-bayroq bilan, PIN ko'rsatilmaydi), `attempts(solo)`.

### 6.3 Ko'rish rejimi (F-0903-01 yechimi)
Barcha ekranlar ochiq, testlar javob berilgan holatda (to'g'ri/noto'g'ri ko'rinadi), arena va podium natijasi ko'rinadi, `submit_answer` **chaqirilmaydi**, LMS'ga hech narsa ketmaydi. Yuqori o'ngda «Qaytadan boshlash» → `restart` → yangi solo-urinish (natijasi alohida solo-hodisa; jonli natija rasmiy bo'lib qoladi).

### 6.4 F5 / boshqa qurilma
Klient avval `me` ni chaqiradi (token bo'lsa) → server ochiq urinishni `role+sub` bo'yicha topadi → o'sha `player_id` + progress. localStorage bo'sh bo'lsa ham ishlaydi. Yangi `jti` qayta tekshiriladi va shu sessiyaga bog'lanadi.

### 6.5 Tamom → natija (live)
Mentor «Erkin qilish/Tamom» → `end_session` + `finish` → snapshot (`live_players`, `live_answers`, `quiz_keys`, `lms_participants`) → har o'quvchi: `correct_answers` (SCORED indekslar), `answered`, `total_questions` (katalog/kalit), `duration_sec` (join → oxirgi javob), `rank` 1–3 (ball ↓, `elapsed_ms` yig'indisi ↑, tenglik → quyi), `badges` (§7), `completed` (oxirgi ekranga yetgan yoki barcha SCORED javob bergan) → validatsiya → `result_events(pending)` → `attempts.finished`. PIN bilan (tokensiz) kirganlar `lms_participants`da yo'q → payload'ga kirmaydi (identifikatsiya yo'q), lekin podiumda qoladi.

Navbat-ishchi (5 s): `POST lesson-results` → 201/200 → `delivered` · tarmoq/429 (`Retry-After`)/500/503 → 1-3-10 s, keyin 1-5-15-60 daqiqa → `retry_wait` · 401/403/409/422 → `manual_review` + Telegram. `rejected_students` saqlanadi. Idempotent: `event_id = sess_<pin>_<started_at>` / `solo_<sub>_<lesson>_<started_at>`.

### 6.6 Bir guruh, bir dars, ikkinchi sessiya (qabul qilindi)
Mentor qayta ochsa va eski sessiya `live` bo'lsa: eskisi `ended` (`auto_ended_by = yangi id`), eskining natijasi navbatga tushadi (ishtirokchisi bo'lsa), yangisi ochiladi. O'quvchilar polling'da `ended` ko'radi, `me` orqali yangisiga o'tadi (klient: `ended` + token bor → avto `join`).

### 6.7 Solo tugashi
Oxirgi ekranga yetganda klient `solo/finish` → server o'z bazasidagi javoblardan payload (klient sonlariga ishonmaydi) → navbat. Yarim qolgan solo 7 kundan keyin `finished(completed:false)` bilan yopiladi va yuboriladi (LMS «boshladi, tugatmadi» ni ko'rsin) — **qabul qilindi (2026-09-03): yuboriladi.**

### 6.8 Tokensiz (mentor zaxira-sayti, demo)
PIN-yo'l hozirgidek + darvozada yangi «O'zim ko'raman» tugmasi (`selfStudy`). Natija LMS'ga ketmaydi (kim ekani noma'lum).

---

## 7. Natija-payload: nishonlar va qoidalar

Darslardagi mavjud yutuqlar (`earned`) → barqaror kalitlar (bir marta belgilanadi, o'zgarmaydi):

| Kalit | Shart |
|---|---|
| `all_correct` | SCORED hammasi to'g'ri |
| `first_try` | har savolga birinchi urinishda to'g'ri (oneShot rejimda = all_correct) |
| `speedster` | o'rtacha javob vaqti guruh medianasidan tez va ≥80% to'g'ri |
| `top_1` / `top_2` / `top_3` | podium o'rni |
| `graduate` | `completed = true` |
| `comeback` | birinchi yarmida <50%, yakunda ≥70% |

Dars-ichidagi boshqa yutuqlar (`ach-badge`) LMS'ga ketmaydi, faqat bizda. `badges_count = badges.length`, `correct<=answered<=total`, bir o'quvchi bir marta, sanalar UTC ISO.

---

## 8. Klient: `src/live/` umumiy modul va codemod

**Modul tarkibi:** `liveClient.js` (API URL bitta joyda, fetch, 401/429 ishlov) · `useLiveSession.js` (hozirgi hook + `liveToken` oqimi + `me` + review + solo) · `LiveGate.jsx` (PIN + «O'zim ko'raman» + tanlov-ekrani) · `LiveBadge.jsx` · `useProgress.js` (server-sync + localStorage kesh) · `reviewMode.js` (javoblarni ekranlarga tarqatish).

**Codemod (`scripts/codemod-live-module.mjs`):** har faylda `const LIVE_SUPABASE_URL` dan `LiveBadge` funksiyasi oxirigacha bo'lgan blokni topadi (langar: boshi va `^function LiveBadge` + yopilishi), o'chiradi, `import { useLiveSession, LiveGate, LiveBadge, useProgress } from '../live'` qo'yadi; `export default function X({ lang, onFinished })` → `({ lang, onFinished, liveToken })`; `useLiveSession(id, key)` → `useLiveSession(id, key, { liveToken, lessonVersion })`. Langar aynan-1 bo'lmasa fayl ro'yxatga tushadi, qo'lda. Har fayldan keyin `npm run gates`. Dry-run hisobot avval.

**Progress:** `progWrite/progRead` (ccProgress) → `useProgress` ga ko'chadi; darsdagi `answers/screen/earned` shu hookdan.

**Cutover (bir kun):** staging'da 98 dars smoke → prod deploy → `build-lms` 90 fayl → CRM'ga yuklash (siz, ~yarim kun) → Vercel demo/mentor saytlar qayta build → Supabase 7 kun o'qish-rejimida turadi, keyin o'chadi.

---

## 9. Xavfsizlik

- JWT: `jose`, faqat HS256, `kid` allowlist (`v1`; rotatsiyada ikkitasi), `base64:` dekod, `clockTolerance 60`, `exp-iat ≤ 43200`, `jti`, `role`, `sub` — 12 band = 12 unit-test + salbiy holatlar.
- CORS allowlist: `https://lms.coddycamp.uz`, bizning Vercel saytlar, `http://localhost:5173` (faqat staging/dev env'da).
- Baza brauzerdan yopiq; `pg` faqat lokal socket; Node bazaga `dars_app` roli bilan (DDL yo'q).
- Rate-limit: `join_session` 20/min/IP, `lms/join` 30/min/sub, umumiy 300/min/IP.
- `player_token`/`mentor_token` bazada AES-256-GCM (kalit env'da).
- Loglarda token/JWT/ism/payload yo'q; `X-Request-ID` har so'rovga.
- Admin: basic auth + IP-allowlist (ixtiyoriy), faqat HTTPS.
- Sirlar rotatsiyasi hujjatlashtiriladi (`server/README.md`): JWT `kid v2`, `sapi_`, DB paroli.

---

## 10. Test strategiyasi

| Daraja | Vosita | Nima |
|---|---|---|
| Unit | `node:test` | JWT 12 band, payload-qurish (rank, badges, chegaralar), event_id, retry-jadval |
| Integratsion | Docker PostgreSQL + Fastify inject | 10 SQL funksiya (hozirgi sinov-satrlari), `join` daraxti (5 shox), `me`, `finish` idempotent, avto-yopish §6.6, progress `If-Match` |
| Kontrakt | `dars-platform-openapi (3).yaml` | payload sxema-validatsiya testda; School API **mock** (201/200/409/422/429+Retry-After/503) |
| Smoke (darslar) | mavjud `_smoke.mjs`/`smoke-lms.mjs` | 98 dars staging API'ga qarshi: PIN-oqim, token-oqim (o'z generatorimiz), review, solo |
| E2E | Playwright | mentor + 2 o'quvchi + F5 + uyga-qaytish (review) + boshqa qurilma |
| Tiklash mashqi | qo'lda, 1 marta | dump'dan yangi dropletga 30 daqiqada |
| LMS bilan | §13 21 band + bizning 5 | test-akkauntlar (S-1) kelgach |

Test-token generatori (`server/tools/mint-token.mjs`) — secret bizda, staging uchun o'zimiz token yasaymiz; prod'da faqat LMS tokenlari.

---

## 11. Bosqichlar (ketma-ket, har biri qabul-mezoni bilan)

| # | Ish | Qabul | Vaqt |
|---|---|---|---|
| 0 | Domen + droplet + Caddy + PG (2 baza) + systemd + zaxira + Telegram + `server/` skelet + Docker-compose lokal | `https://api.<d>/api/v1/health` 200; staging ham; `pg_dump` Spaces'da | 2 kun |
| 1 | Jonli-API: SQL ko'chirish + 10 RPC + 3 o'qish + rate-limit + ETag; `src/live/` modul (hozirgi mantiq, Supabase'siz) | InternetLesson staging API bilan PIN-oqimda to'liq ishlaydi (mentor+2 o'quvchi, arena, podium) | 4 kun |
| 2 | LMS-ko'prik: JWT + `lms_*` jadvallar + `join` daraxti + `me` + kontekst-kesh + §6.6 | integratsion testlar yashil; token bilan PIN'siz kirish | 4 kun |
| 3 | O'quvchi-holat: progress-sync, ko'rish rejimi, solo, restart, «O'zim ko'raman» | E2E «uyga qaytish» o'tadi; F-0903-01 yopiq | 4 kun |
| 4 | Natija: snapshot, badges, navbat-ishchi, retry, `manual_review`, admin-sahifa, solo/finish, 7-kunlik yopish | mock bilan 201/200/409/422/429/503 stsenariylari; admin'da ko'rinadi | 4 kun |
| 5 | Codemod 98 dars + gates + smoke; `build-lms` 90; Vercel saytlar | 98/98 gates, smoke yashil staging'da | 3 kun |
| 6 | LMS bilan birga sinov (§13 + 5) real akkauntlar bilan | protokol + skrinshotlar | +7 kun (LMS) |
| 7 | Cutover: prod, CRM'ga 90 fayl, Supabase o'qish-rejimi → 7 kundan keyin o'chirish | birinchi real dars natijasi LMS'da `delivered` | 1 kun + 7 kun kuzatuv |

Bizning kod: **~4 hafta**; LMS bilan sinov va cutover: **+2 hafta**. Har bosqich oxirida `PIPELINE_STATE.md` ga yozuv, commit faqat buyruq bilan.

---

## 12. Xavflar va chora

| Xavf | Chora |
|---|---|
| Bitta server — dars vaqtida yiqilsa hamma to'xtaydi | systemd auto-restart, UptimeRobot + Telegram, snapshot; 6 oydan keyin ikkinchi droplet/managed PG ko'rib chiqiladi |
| Codemod bir nechta faylda langarni topmaydi | dry-run ro'yxat, qo'lda tuzatish, har faylga gates |
| O'tish davrida eski (Supabase) va yangi fayl aralash | bir kunlik cutover, Supabase 7 kun tirik |
| Polling yuk (30×0,4 so'rov/s guruh) | ETag/304; 10 guruh = 120 so'rov/s — 2 GB ga oson; SSE v2.1 |
| LMS `lang` manbasi har xil, UZ/RU material ikki xil `lesson_id` bilan yuklansa | katalogda `lesson_id` bitta, `lang` faqat prop; CRM'ga yuklashda tekshiruv-bandi |
| Ism-ma'lumotlar bizda | 90 kun purge, shifrlangan tokenlar, loglarda yo'q |
| Test-akkauntlar kechiksa | 0–5 bosqichlar o'z generatorimiz bilan; S-1 faqat 6-bosqichga |

---

## 13. Ochiq savollar — yopildi (2026-09-03)
1. §6.7 yarim solo 7 kunda yuboriladi — **ha**.
2. Domen — **azizbek.site**; DNS: `api` va `staging-api` A-yozuvlari droplet IP'ga (0-bosqichda beriladi).
3. DO akkaunt sizniki; droplet yaratishda `~/.ssh/dars_do.pub` ochiq kaliti qo'shiladi (0-bosqichda yaratildi).

## 14. Xarajat
Droplet 2 GB $12 · Spaces $5 · domen ~$3/yil · **≈ $17/oy**. 4 GB kerak bo'lsa $29/oy.

---

## 15. Jurnal (nima qilindi)

**2026-09-03 — 0-bosqich, lokal qism TAYYOR (serverda hali sinalmagan).**
- `server/` skelet: config (env → tekshirilgan/muzlatilgan, qiymat log'da yo'q) · pino redact (token/JWT/ism/kod) · AppError + pg SQLSTATE → HTTP (P0001 xabari o'quvchiga) · pg pool (statement_timeout 5 s) · migratsiya-yurgizgich (tartib, checksum, advisory lock, CRLF-normalizatsiya; ilova start'da faqat tekshiradi) · Fastify: CORS allowlist, rate-limit (404 ham), x-request-id, health.
- `migrations/0001_live_core.sql` — Supabase 12 faylning yakuniy holati: 7 jadval, 10 funksiya (imzo va xabarlar o'zgarmagan) + `close_stale_live_sessions()`. Farqlar: RLS/grant/realtime/pg_cron yo'q, `create_session` o'chirmaydi, seed yo'q, mentor-kod env → `app_config`.
- Testlar: unit 10/10 · integratsion 18/18 (Docker PostgreSQL 16.15: SQL xulqi — server-ball, firib, arena vaqti, cur/max, stale; ilova — health/404/CORS/request-id/rate-limit). Lint toza. Jonli tekshiruv: health 200, sir log'da yo'q.
- Deploy fayllari: `Caddyfile` (Authorization/Cookie log'dan o'chiriladi) · `dars-api@.service` (hardening) · `deploy.sh` (fetch→ci→migrate→restart→health, PREV bilan qaytish) · `setup-droplet.sh` (PG owner/app rollar, Node 22, Caddy, ufw, fail2ban, sparse-clone, cron) · `backup.sh` (pg_dump -Fc, 14 kun, yakshanba tekshiruv). `bash -n` toza.
- SSH kalit: `~/.ssh/dars_do` (ed25519) — droplet yaratishda `.pub` qo'shiladi.
- Topilma: Node 24 da `node --test <papka>` ishlamaydi → glob; Fastify'da `version` dekorator nomi band → `appVersion` (ilova-darajali test qo'shildi, endi tutadi).

**Keyingi:** 1-bosqich — jonli-API marshrutlari (`/api/v1/live/*`: 10 RPC allowlist + 4 o'qish, ETag, PIN rate-limit) va `src/live/` klient-moduli; dropletni siz ochganingizda 0-bosqichning server qismi (`setup-droplet.sh`) sinovdan o'tadi.

**2026-09-03 (davomi) — 1-bosqich TAYYOR (lokal).**
- Jonli-API: `POST /api/v1/live/rpc/<fn>` (10 funksiya, har biri alohida marshrut: JSON-sxema + per-route limit — join_session 20/min, create/set_keys 10/min, qolgani 600/min; sinf bitta NAT-IP ortida bo'lgani hisobga olindi) · `GET /live/session/:pin` (ETag/304, no-cache) · `GET /live/players/:pin` · `GET /live/answers/:pin?screen=|range=arena`. Javob shakllari PostgREST bilan mos (setof→massiv, scalar→qiymat, void→204). Maintenance: `close_stale_live_sessions()` har 15 daqiqa in-process.
- `src/live/` umumiy modul: `i18n.js` (setLiveLang/tr) · `liveClient.js` (URL `__DARS_API_URL__` define → default api.azizbek.site) · `useLiveSession.js` (mantiq aynan) · `LiveUI.jsx` (LiveGate + **«Kodsiz, o'zim ko'raman»** tugmasi, LiveBadge, LiveBigCode) · `index.js`. `vite.config.js` va `scripts/build-lms.mjs` ga `define` qo'shildi (`DARS_API_URL` env).
- `scripts/codemod-live-module.mjs`: inline blok → import; dry-run 74/98 toza, 24 ta FAIL (15 tasida blok ichida `pracRead/pracWrite/pracClear/codeKeyOf/PRACTICE_DONE_BASE/AchCtx` bor — codemod blokni bo'laklab kesishi kerak; 9 PM darsda `__lang = lang;` yo'q — setLiveLang qo'yilmaydi, default uz). 5-bosqichda hal qilinadi.
- Pilot `src/1-Modull/InternetLesson.jsx` modulga o'tkazildi (−312 qator, 14 import). Gates: esbuild/jsx/prompt toza; dark 11 va til 1+3 topilma — asl fayl bilan AYNAN bir xil (eski, refaktorniki emas). Modulning o'zi 5/5 toza (bitta «ushbu»→«shu» tuzatildi).
- Testlar: server unit 10 + integratsion 28 (live_api 10 ta yangi) · **E2E brauzer `tools/e2e-live.mjs` 10/10**: mentor kod → PIN → o'quvchi qo'shildi → ism band xabari → darvoza qulfi → mentor o'tdi → polling 2/22 → Erkin qilish → server ended → «o'zim ko'raman» → konsol toza. LMS-yig'ma (`build-lms`) bir faylga yig'ildi, smoke-lms o'tdi; `lms/InternetLesson.jsx` ESKI holida qoldirildi (server yo'q — CRM'ga tasodifan tushmasin), cutover'da qayta yig'iladi.
- Ish-tartibi (lokal E2E): `server: node --env-file=.env src/index.js` · `DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort` · `node tools/e2e-live.mjs m1-01`.

**Keyingi:** 2-bosqich — LMS-ko'prik (JWT 12 band `jose`, `lms_*` jadvallar 0002-migratsiya, `join` daraxti, `me`, kontekst-kesh, §6.6, test-token generatori).

**2026-09-03 (davomi) — 2-bosqich TAYYOR (lokal): LMS-ko'prik server + klient + E2E.**
- Server: `migrations/0002_lms_bridge.sql` (lms_sessions [bir guruh-bir dars UNIQUE], lms_tokens [UNIQUE jti], lms_participants [UNIQUE session,role,subject; tokenlar AES-256-GCM], context_cache, lesson_catalog) · `modules/lms/jwt.js` (jose, 12 band, kid allowlist + rotatsiya) · `school-api.js` (integration-context, 404/429/401/5xx → 503, kesh 5 daq) · `join-service.js` (mentor: create/resume/§6.6 replace; o'quvchi: faol ishtirok → kontekst → 1/ko'p/yo'q; nickname JWT'dan, band bo'lsa «Ism 2»; `me`) · `routes.js` (`/lms/join`, `/lms/me`, Bearer; ko'prik o'chiq → 503) · config LMS-qatlam (prod'da majburiy) · `tools/mint-token.mjs` · `tools/fake-school-api.mjs` · `tools/seed-catalog.mjs` + `scripts/gen-lesson-catalog.mjs` (115 dars; takror id: `pm-m1d2-v1` PmAudienceLesson+PmLesson1 — tozalash kerak).
- **§6.6 aniqlashtirildi:** o'sha o'qituvchi qayta kirsa (F5, boshqa qurilma, yangi jti) sessiya DAVOM etadi (LMS §5.4); boshqa o'qituvchi (TA/o'rinbosar) kirsa eskisi `auto_replaced`, yangisi ochiladi.
- Klient: `src/live/` — `lmsJoin/lmsMe/peekTokenRole`, hook `useLiveSession(id, key, { liveToken })`: token kelganda avto-`join` (server haqiqati ustun), `lms.state` (joining/choose/joined/none/error), `joinWithToken(session_id)`; LiveGate: kutish-kartasi, xavfsiz tanlov (guruh nomisiz), izohlar. Pilot InternetLesson `liveToken` propini oladi.
- Dev-simulyator: `lms-harness.html` + `src/lms-harness/main.jsx` (token LMS kabi kechikib keladi); `server/.env` (gitignored) da dev LMS qiymatlari + soxta School API :3999.
- Testlar: unit 35 (jwt 12 band + salbiylar, crypto, school-api, names, config, migrate) · integratsion 43 (lms_join 15 ta yangi) · **E2E `tools/e2e-lms.mjs` 11/11**: mentor token → PIN'siz; Ali/Vali token → ism JWT'dan; F5 va boshqa qurilma (yangi jti) → dublikat yo'q; guruhda dars yo'q → darvoza+izoh; yaroqsiz token → izoh; Erkin qilish. Gates: modul 5/5; pilot til 5→4 xato (kamaydi), dark 11 (eski).
- Ish-tartibi: `server: node tools/fake-school-api.mjs` · `node --env-file=.env src/index.js` · `DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort` · `node tools/e2e-lms.mjs`.

**Keyingi:** 3-bosqich — o'quvchi-holat: 0003 migratsiya (attempts, student_progress), server-progress (`PUT /me/progress`, If-Match), ko'rish rejimi (review), solo (join daraxtining 4–5 shoxlari), `restart`; klientda `useProgress` va review-rejim.

**2026-09-03 (davomi) — 3-bosqich TAYYOR (lokal): o'quvchi-holat.**
- Server: `migrations/0003_student_state.sql` (attempts [bir faol urinish UNIQUE], student_progress, lms_participants.attempt_id) · `progress-service.js` (solo sessiya — o'sha SQL, PIN yopiq, server-ball; putProgress: eskirgan client_ts e'tiborsiz, solo `screen>=total-1` → completed; live → reached_end) · `join-service.js` daraxti: faol urinish → jonli → **ko'rish** (tugagan urinish, progress bilan) → **solo**; `restart` (jonli davomida 409) · `routes.js`: `/lms/restart`, `PUT/GET /me/progress` · `lms/maintenance.js`: live_ended, auto_7d, 90-kun ism-purge (live/maintenance.js endi ish-ro'yxati bilan).
- Klient: `progressSync.js` (progWrite → 2 s debounce → PUT, pagehide/hidden'da keepalive; tugagan urinishda to'xtaydi) · `useServerProgress(live, {setScreen,setAnswers,setEarned,earnedRef,startTimeRef,total})` — dars ildiziga BITTA qator · hook: `solo`/`review` rejimlari (darslar uchun `self` kabi), `attempt`, `serverProgress`, `restartAttempt`, submitAnswer solo'da ham · LiveBadge: «📘 Mustaqil rejim» / «✓ Yakunlandi» / «👁 Ko'rish rejimi» + «↻ Qaytadan boshlash». Pilot ulandi.
- Testlar: unit 35 · integratsion 52 (lms_state 9 ta yangi) · **E2E LMS 15/15** (jonli 7 + solo→progress→boshqa qurilma→oxirgi ekran→ko'rish→qaytadan 5 + xato/yakun 3) · E2E PIN 10/10 qayta o'tdi. Topilma: darsning onboarding-tur roli `learner` — E2E seed'ida yo'q edi, tur-qatlami kliklarni to'sgan (test-seed tuzatildi).
- Codemod v2 (`scripts/codemod-live-module.mjs`): blok ichidagi dars-yordamchilar joyida qoladi, blokdan tashqaridagi `LiveGateCtx` kabi top-level jonli-deklaratsiyalar ham olib tashlanadi (PmLesson19), `liveToken` prop + `useServerProgress` qatori, RU'siz darsda setLiveLang yo'q, ildiz-nomlari tekshiriladi. **Dry-run 97/97**; 4 xil dars (CssLesson1, PmLesson19, PmUserStory, JsIntro) real qo'llanib esbuild/jsx toza, keyin qaytarildi. 5-bosqich uchun tayyor.
- Qaror (kod bilan muhrlangan): solo'da arena (Mustahkamlash) mashq bo'lib qoladi, serverga yozilmaydi (mentor boshqaruvi yo'q); solo natijada faqat dars-testlari (screen<100) hisoblanadi.

**Keyingi:** 4-bosqich — natija: snapshot (live_answers + lms_participants + quiz_keys) → payload (badges, rank, completed) → `result_events` navbat → School API (retry 1-3-10 s, 429 Retry-After, 401/403/409/422 → manual_review) → admin-sahifa + Telegram; `finish` (mentor «Erkin qilish» → natija), solo completed → natija, auto_7d → natija (completed:false).

**2026-09-03 (davomi) — 4-bosqich TAYYOR (lokal): natija-navbat → School API.**
- Server: `migrations/0004_result_events.sql` (bir sessiya = bir hodisa, bir solo urinish = bir hodisa — UNIQUE) · `results/result-builder.js` — SOF payload-quruvchi: savol-to'plami (live: barcha kalitlar; solo: arena tashqari), rank (ball ↓, vaqt ↑, 0 to'g'ri → null, faqat 1–3), nishonlar (all_correct/first_try/speedster/top_1-3/graduate/comeback), duration, completed, 100+ → bo'laklar, `validatePayload` (LMS §7.3) · `result-service.js` (enqueue live/solo, **sweeper** — yopilgan sessiya / tugagan solo hodisasiz bo'lsa navbatga; idempotent) · `result-worker.js` (5 s tick, `for update skip locked`, 201/200 → delivered, tarmoq/429/5xx → retry_wait, 401/403/409/422 → manual_review + Telegram, `requeue`) · `retry.js` (1-3-10 s → 1-5-15-60 daq, 30 urinish) · `lib/notify.js` (Telegram, ixtiyoriy) · `admin/routes.js` (basic auth: overview, results, requeue, HTML sahifa) · `end_session` RPC'dan keyin darhol tick · School API `submitLessonResult` (kodlarni tashlamaydi, X-Request-ID).
- **Qaror:** rejadagi `POST /lms/finish` KERAK EMAS — sweeper hamma yopilish yo'llarini (mentor, auto_replaced, stale, solo completed/auto_7d) qamraydi; `restarted` solo yuborilmaydi (tanlab tashlangan urinish). PIN bilan kirganlar payload'da yo'q.
- Testlar: unit 45 (result-builder 10 ta) · integratsion 59 (results 7 ta: to'liq oqim, PIN-o'quvchi chetda, rejected saqlanadi, idempotent, solo, restarted/auto_7d, 429/500/422/dup/tarmoq, admin) · **E2E LMS 16/16** — brauzer → API → navbat → soxta School API: jonli (Ali+Vali, group 861) va solo (Sobir) natijalari yetib bordi. Lint toza.
- Dev: `server/.env` ga ADMIN_USER/ADMIN_PASSWORD (dev) qo'shildi; `fake-school-api` da `GET /_debug/results`.

**Keyingi:** 5-bosqich — codemod --write (97 dars) + gates + smoke; `build-lms` 90 fayl; Vercel saytlar. Keyin droplet kelganda 0-bosqich server qismi (setup-droplet.sh), staging deploy, LMS bilan §13 sinov (test-akkauntlar), cutover.

**2026-09-03 (davomi) — 5-bosqich (src qismi) TAYYOR: 98 dars modulda.**
- `scripts/codemod-live-module.mjs --all --write` → 97 dars (pilot bilan 98) `src/live/` moduliga o'tdi: Supabase qoldig'i 0; har darsda `liveToken` prop, `useLiveSession(…, { liveToken })`, `useServerProgress(...)`, RU-i18n bo'lsa `setLiveLang`.
- Topilma va tuzatish: 3 darsda (HtmlPractice, PracticeLesson3/4) `earnedRef/setEarned` hook'dan pastda e'lon qilinar ekan → TDZ oq ekran. Codemod endi `useServerProgress` qatorini ildiz-deklaratsiyalarning oxirgisidan KEYIN qo'yadi; 3 fayl qaytarilib qayta o'tkazildi.
- Darvozalar (98 fayl): esbuild 98/98 · jsx-lint 7 ta yiqilgan — hammasi asl faylda ham bor (eski o'lik-kalit topilmalari, codemod'niki emas) · til: 0 yomonlashdi, 52 yaxshilandi, 46 o'zgarmadi · dark: 0 yomonlashdi · **brauzer-smoke 109/109 toza** (`_smoke.mjs`).
- `lms/` yig'malariga TEGILMADI (Supabase'ga ishora qiladi) — cutover kuni `build-lms` bilan 90 fayl qayta yig'iladi va CRM'ga yuklanadi. Vercel demo/mentor saytlar ham cutover kuni qayta build qilinadi (hozir src prod URL `api.azizbek.site` ga ishora qiladi — server yo'qligida deploy QILINMASIN).
- Holat: hammasi UNCOMMITTED (`uyga-vazifa-pilot` shoxi): server/ (yangi), src/live/ (yangi), 98 dars (M), vite.config.js, scripts/build-lms.mjs, tools/e2e-*.mjs, lms-harness.html, src/lms-harness/, BACKEND_REJA_UZ.md.

**Keyingi (droplet kelganda):** `setup-droplet.sh` → DNS (api/staging-api) → `/etc/dars-api/*.env` to'ldirish (haqiqiy `.env.coddycamp.local` qiymatlari, LIVE_MENTOR_CODE, ADMIN, Telegram) → `deploy.sh staging main` → `seed:catalog` → staging'da E2E (DARS_API_URL=https://staging-api.azizbek.site) → prod → LMS'ga S-5 skrinshot/§13 sinov → cutover (build-lms 90 + CRM yuklash + Vercel qayta build) → Supabase 7 kun → o'chirish.

**2026-09-03 (kech) — droplet kutish davrida mustahkamlash.**
- **Yuklama-sinov** (`server/tools/loadtest.mjs`, autocannon; 10 guruh × 30 o'quvchi, lokal): polling 120 so'rov/s → p95 99 ms, 0 xato; maksimal ~3100 so'rov/s, p99 50 ms; 300 javob bir vaqtda → p95 430 ms; aralash p95 74 ms. Xulosa: 25× zaxira. Tuzatishlar: o'qish-limit 3000→6000/min/IP (katta maktab NAT'i), `RATE_LIMIT_SCALE` (sinov/NAT), prod `DB_POOL_MAX=20`, **har-so'rov log o'chirildi** (`disableRequestLogging`; Caddy'da polling `log_skip`).
- **Tiklash mashqi** bajarildi (docker): pg_dump -Fc → yangi baza → 16 jadval, 4 migratsiya, 10 funksiya, funksiya ishlaydi. README'da tartib.
- **Baza-gigiena:** maintenance endi `lms_tokens` (exp+7 kun) va `context_cache` (1 kun) ni tozalaydi (test bilan).
- **`SINOV_PROTOKOLI_LMS.md`** — LMS §13 21 band + bizning 5 + uyga-qaytish 3: kim bosadi, nima kutiladi, dalil; natija-jadval. Server kelgach shu bo'yicha.
- **CI:** `.github/workflows/server-tests.yml` — `server/**` o'zgarsa lint + unit + integratsion (PG16 xizmat-konteyner).
- **Hodisa-yo'riqnoma** (README): health 503, server o'lik, token rad, natija ketmayapti, disk, yomon deploy → nima qilinadi.
- `setup-droplet.sh` env-shabloni to'liq: LMS-ko'prik, TOKEN_ENC_KEY avto, admin paroli avto, Telegram joyi.
- Testlar: 45 unit + 59 integratsion, lint toza.

**2026-09-03 (kech) — TANGA-QOIDALARI (foydalanuvchi bilan kelishildi, kodga kirdi).**
- LMS nimadan tanga beradi: o'quvchi ID + `correct_answers` (count); jonli darsda top-3 → `rank` 1/2/3, qolganlar count. LMS `onFinished`ni saqlaydi, lekin tanga bizning `lesson-results`dan (server-hisob) bo'lishi kerak — LMS'ga aytiladi.
- **Qoida 1 — count = faqat dars-testlari** (quiz_keys'dagi `quiz-N` bo'lmaganlar): ekrandagi «N / jami» va onFinished bilan bir xil; jonli va solo bir o'lchovda. Arena count'ga kirmaydi, nishon bo'lib ketadi: `arena_top_1/2/3` (arena javob berganlar orasida).
- **Qoida 2 — top-3 ekran-podium bilan AYNAN:** dars-testlari bo'yicha to'g'ri ↓, vaqt ↑, tenglikda avval qo'shilgan; HAMMA o'yinchi orasida (PIN bilan kirganlar ham). PIN g'olib tangasiz qoladi — mentorlarga: tanga faqat LMS orqali kirganlarga.
- **Qoida 3 — bir o'quvchi, bir dars, bitta tanga-hodisa:** jonli har doim ketadi; solo faqat shu dars bo'yicha oldin TUGALLANGAN natija (jonli — har qanday; solo — completed) bo'lmasa ketadi; qolgan urinishlar bizda (`attempts.result_event_id = 'skipped:already_rewarded'`), ko'rish/analitika uchun. Tashlab ketilgan (auto_7d, completed:false) hodisa keyingi to'liq urinishni bloklamaydi; `restarted` yuborilmaydi.
- Tashlandiq sessiya muddati 2 soat → **30 daqiqa** (`STALE_SESSION_MINUTES`; 15 daqiqalik tanaffusni qamraydi, kamaytirilmasin). 7 darsdagi «o'lik kalit» (jsx-lint) cutover'gacha tozalanadi — aks holda jami savol +1.
- Bitta dars bilan sinov qarori: 97 darsdagi codemod QAYTARILDI (git), faqat pilot InternetLesson modulda; server+domen kelgach pilot sinovdan o'tadi, keyin `codemod --all --write` (97/97 tayyor, 1 daqiqa).
- Testlar: unit 45 · integratsion 60 · E2E LMS 16/16 (toza-tarixli o'quvchi 900000+ bilan) · lint toza. Kod: `result-builder.js` (lessonQuestions/arenaQuestions, assignRanks hamma o'yinchi, arena nishonlari), `result-service.js` (players, `hasRewardedResult`, sweeper), `live/maintenance.js` (minutes), config `staleSessionMinutes`.

**2026-09-07 — YO'NALISH O'ZGARDI: droplet o'rniga LMS serveri (Docker + ularning Git/CI-CD).**
- LMS taklifi: backend ularning serverida Docker'da, repo va CI/CD ulardan, bizga server-kirish shart emas. Qabul qilindi. §3 dagi droplet/domen/Caddy/systemd bosqichi bekor; `deploy/` skriptlari zaxira sifatida qoladi.
- Tayyorlandi: `server/Dockerfile` (node:22-alpine, prod-paketlar, node foydalanuvchisi, healthcheck) · `docker-compose.deploy.yml` (postgres16 + `migrate` bir martalik + api + `backup` har 24 soat pg_dump, 14 kun) · `.env.deploy.example` · `.gitlab-ci.yml` (test→build→deploy shabloni) · `DOCKER.md`. Kod o'zgarmadi: migratsiya compose'da alohida xizmat, api `service_completed_successfully` dan keyin.
- Xat: `JAVOB_DARS_PLATFORM_INTEGRATION_UZ_v6.md` — A-1…A-7 (API manzili, repo, deploy tartibi, env, baza/zaxira, loglar, hodisa-kontakt). Test-akkauntlar endi bizning zimmamizda (foydalanuvchi oladi).
- Ochiq: API manzili kelgach `src/live/liveClient.js` DEFAULT_API_URL va build-lms izohlari yangilanadi; Kali'da Docker yo'q — image CI'da yoki foydalanuvchi Docker o'rnatgach sinaladi.

**2026-09-07 (kech) — kutish davri rejasi (LMS javoblari kelguncha, hech biri LMS'ga bog'liq emas).**
- Tekshirildi: School API klientimiz hujjatdagi aynan ikki manzilni ishlatadi (`/api/v1/lms/students/{id}/integration-context`, `/api/v1/integrations/dars-platform/lesson-results`); JWT 12 band `jwt.js` da; `GET lesson-results/{event_id}` tekshiruvi hali YO'Q (§13-20 uchun admin'ga qo'shiladi).
- Foydalanuvchi: (1) S-1 test-akkauntlar (G-1/G-2, O-1…O-5, M-1/M-2, T-1, X-1) · (2) S-5 pilot skrinshot — `pilot/InternetLesson.liveToken.jsx` CRM «Umumiy modullar» → test-material, O-1 LMS + M-1 CRM · (3) Telegram-bot (BotFather) → TELEGRAM_* env.
- Biz: (4) 7 darsdagi 25 o'lik kalit (DeployLesson 7, GitLesson 2, PmAudienceLesson 7, PmLesson1 1, PmLesson4 3, PmLesson5 4, ReactApiGetLesson 1) — cutover'gacha SHART · (5) codemod 97 dars + gates + smoke; `build-lms` 90 fayl staging-URL kelgach · (6) `answer_attempts` jadvali + solo-natija nuqsoni (solo'da MCQ submit qilmaydi → answered=0) — ichki saqlash Axadulla formatiga bog'liq emas · (7) admin'da School API GET-tekshiruv · (8) CRM-yuklash ro'yxati 90 fayl + UZ/RU lesson_id juftligi (S-6) · (9) monorepo commit.
- Prod oldidan (LMS): sirlar 2026-08-26 da ochiq Telegram-chatda kelgan → rotatsiya shart: JWT `kid v2` + yangi `sapi_` tokenlar (ularning §10 qoidasi).

**2026-09-07 (kech) — kutish-rejasi 1–2 BAJARILDI.**
- (1) 6 darsdan 18 o'lik mashq-kalit (`-1`, scored:false ekranlar) INLINE_KEYS'dan olib tashlandi: DeployLesson 7, GitLesson 2, PmLesson1 1, PmLesson4 3, PmLesson5 4, ReactApiGetLesson 1. jsx-lint: faqat PmAudienceLesson'ning 7 ta boshqa-turdagi (uy-vazifa joylashuvi, CSS aniqlik) topilmasi qoldi — ball bilan aloqasiz. Mentor-panel qatorlar sonini sanaydi, `correct`ga qaramaydi → xavfsiz.
- (2) `migrations/0005_answer_attempts.sql`: `answer_attempts` (har bosish, savolga 10 tagacha, texts jsonb ≤4 KB, UNIQUE player+screen+attempt_no) + `achievement_events` (attempt+id, earned_at) + `record_attempt()` RPC (auth/kalit/arena-vaqt submit_answer bilan bir xil; birinchi urinishda live_answers ball-qatorini ham qo'yadi → SOLO NUQSONI YOPIQ). Registry: `record_attempt` (p_texts sxemasi: question/options≤6/picked/correct ≤300, lang). progress-service: earned ro'yxatidagi yangi id → achievement_events. Klient: `useLiveSession().recordAttempt(screen, id, picked, elapsed, texts)`. `scripts/codemod-record-attempt.mjs` → 98 darsning QuestionScreen.pick'iga (oneShot if/else'dan keyin) `live.recordAttempt(...)` — ifodalar darsning o'z onAnswer'idan (ouz/ou/optTexts/options), lang `__lang`dan; 16 fayl oneShot'siz (App/main/css-praktika, M3 PmLesson7, M7 12 dars — alohida test-mexanika, keyin). Guard: modulsiz inline darsda recordAttempt yo'q → o'tkazib yuboradi.
- Tekshiruv: unit 45 · int 62 (attempts.test.js 2 yangi) · esbuild 98/98 · E2E LMS **17/17** (yangi qadam: Sobir solo'da s4 bosadi → live_answers faqat record_attempt orqali) · E2E PIN 10/10 · bazada texts+lang. GitLab staging/main sinxron.
- Qolgan: payload'ga `questions`/`achievements` — Axadulla javobidan keyin (result-builder + validatePayload). Keyingi: (3) codemod 97 dars → src/live moduli.

**2026-09-07 (kech) — (3) CODEMOD 97 DARS → `src/live/` MODULI BAJARILDI.** `scripts/codemod-live-module.mjs --all --write` 97/97; Supabase qoldig'i 0; 101 dars modulda. Darvozalar (99 fayl): esbuild toza · jsx-lint faqat PmAudience 7 (eski) · til 🔴 300→249, 51 fayl yaxshilandi, 0 yomonlashdi, 🟡 242=242 · dark 283=283 · **brauzer-smoke 109/109 toza** (`_smoke.mjs`, CHROME env). `lms/` yig'malari va Vercel saytlar hali TEGILMAGAN — cutover kuni `build-lms` (DARS_API_URL = Kristina bergan manzil). E2E (pilot) 17/17 + 10/10 avvalroq o'tgan. Skriptlarda Chrome yo'li endi `CHROME` env orqali (_smoke, e2e-*, pilot/smoke).

**2026-09-07 (kech) — (7) admin School API tekshiruvi + (8) CRM ro'yxati BAJARILDI; TOPILMA: M7 jonli-ballsiz.**
- (7) `school-api.getLessonResult(eventId)` (GET lesson-results/{id}, results-token) · admin `GET /api/results/:id/verify` → `{local, remote:{status,found,data}}` (LMS §13-20 endi curl'siz) · `tools/fake-school-api.mjs` GET qo'llaydi · results.test.js: verify testi (bazani tozalaydigan «admin o'chiq» testidan OLDIN turadi). Int 63/63, unit 45/45, lint toza. GitLab staging/main sinxron. SINOV_PROTOKOLI §13-20 yangilandi.
- (8) `CRM_YUKLASH_ROYXATI.md` — 90 lms-fayl (ildiz M1–M2, 4-M, 5-M, 6-M) × lesson_id × manba × tur (shared/yakka); PmLesson1 takror-id (`pm-m1d2-v1`, PmAudienceLesson bilan) cutover'gacha alohida id oladi. S-6 qoidasi: UZ va RU material bir xil faylga.
- **TOPILMA (yangi ish):** `src/7-Modull/*` 12 dars + `src/3-Modull/PmLesson7.jsx` — `scored: true` ekranlar bor (5 tadan), lekin `INLINE_KEYS` ham, `live.submitAnswer` ham YO'Q → jonli darsda ball nol, LMS natijasida answered=0. Sabab: M7 boshqa test-komponenti bilan qurilgan (oneShot naqshi yo'q). Har dars uchun darslik-jonli roli ishi (13 dars), cutover'gacha yoki M7 LMS'ga chiqishidan oldin.
- Qolgan kutish-ro'yxati: (9) monorepo commit — foydalanuvchi buyrug'i bilan.


**2026-09-08 — HOLAT MUHRLANDI, monorepo commit + push (foydalanuvchi ruxsati: «istasang gitga chiqar»).**
- Darvozalar qayta yurgizildi: `vite build` toza · jsx-lint faqat PmAudienceLesson 7 (eski, boshqa-tur) · prompt-lint toza · server lint toza · unit 45/45 · integratsion 63/63 (Kali'da PG18 sinov-klasteri 5433 scratchpad'da qayta yaratildi — retsept memory'da).
- Uch mantiqiy commit: (1) server — Docker/GitLab deploy-paket, 0005 `answer_attempts` + `record_attempt`, admin verify, config TRUST_PROXY, testlar, sync/codemod skriptlari; (2) darslar — 97 dars `src/live/` moduliga, `recordAttempt` ilgagi 98 darsda, 18 o'lik kalit 6 darsdan; (3) hujjatlar — JAVOB v6, server-TZ RU/UZ, natija-detallar TZ, CRM yuklash ro'yxati, jurnallar.
- Kutilmoqda: Kristina — staging manzili (env fayllari 2026-09-07 kech yuborilgan, «ertagacha sozlayman»); Axadulla — `questions`/`achievements` payload-kontrakti; foydalanuvchi — S-1 test-akkauntlar, S-5 pilot skrinshot, Telegram-bot.
- Keyingi qadam (manzil kelgach): health → `src/live/liveClient.js` DEFAULT_API_URL → `build-lms` pilot → CRM «Umumiy modullar» → §13 sinov. Alohida navbat: M7 12 dars + PmLesson7 jonli-ball (darslik-jonli roli).

**2026-09-08 — KUTISH DAVRI (Axadulla/Kristina javobi yo'q): natija-detallari A-variant bayroq ostida TAYYOR.**
- Maqsad: Axadulla `questions`/`achievements` kontraktini tasdiqlagan kuni ish «bir bayroq» bo'lsin. `RESULT_DETAILS=off|a` (config; default `off`, ikkala deploy-env'da ham `off`). `a` — TZ_LESSON_RESULT_DETAILS_RU §4 A-variant: StudentResult ichida `lang`, `questions[]` (question_id, kind test|arena, order, question/options/correct_option/correct_answer, correct = birinchi urinish, solved, attempts[] {n, option, answer, correct, elapsed_ms, at}), `achievements[]` ({id, name, title, earned_at}).
- Manbalar: `live_answers` (ball, studentStats bilan aynan bir xil tanlov → invariantlar `answered`/`correct_answers` bilan mos), `answer_attempts` (har bosish + texts), `achievement_events` + **yangi `lesson_catalog.achievements`** (0006 migratsiya; `scripts/gen-lesson-catalog.mjs` darsning ACHIEVEMENTS blokini vm-sandbox'da o'qiydi → 98 dars, 391 ta'rif; 18 dars bo'sh = M7 13 + eski 5). Tarixsiz savol (eski uslub `submit_answer`, arena) → ball-qatorining o'zi bitta urinish, matnsiz.
- Savol tartibi (`order`) kalitdan: dars-testlari ekran raqami bo'yicha (s4 < s5b < s9), keyin arena (quiz-0 < quiz-1). `lang` — urinishlardagi ko'pchilik tili.
- **QOIDA:** detallar tanga-yetkazishni hech qachon to'smaydi — `finalizePayload`: detal-invariant buzilsa yoki hodisa 1 MB dan oshsa detallar tashlanadi (log warn `natija-detallari tashlandi`), asosiy payload ketadi; asosiy buzuq bo'lsa avvalgidek manual_review.
- **NUQSON TOPILDI va YOPILDI:** progress-service yutuq-id'ni `[a-z0-9_-]` bilan filtrlar edi, darslarda esa 222/395 id camelCase (`firstWin`) — ular `achievement_events`ga umuman yozilmas edi. Endi id kichik harfga keltiriladi (katalogda ham). LMS'ga ketadigan id kichik harfda (TZ qolipi).
- Testlar: unit 45→51 · integratsion 63→66 (`results_details.test.js`: jonli 2 urinish + tarixsiz s9 + arena + camelCase earned; solo; bayroq off) · lint toza · 0006 dev-bazada qo'llanildi, seed 115 dars. `tools/fake-school-api.mjs` endi 1 MB chegara va detallar logi.
- B-variant kelsa: transport farqi (alohida endpoint), builder o'sha-o'zi. Maydon nomi o'zgarsa — `buildStudentDetails`/`validateStudentDetails` ichida rename.
- Qolgan: Axadulla javobi → `RESULT_DETAILS=a` (env, Kristina orqali) + SINOV_PROTOKOLI B6/B7. GitLab `dars-api-coddy` sync — buyruq bilan.

**2026-09-08 — KUTISH DAVRI (2): staging-qabul skripti + runbook TAYYOR; deploy-paketda 2 nuqson yopildi.**
- `server/tools/staging-check.mjs <URL>` — tashqaridan 19 band, env-fayl (`--env-file=.env.deploy.staging`) bilan serverdagini SOLISHTIRADI: health/env/version(`--sha`)/migrations(lokal soni bilan)/catalog(115)/features(ko'prik, worker, RESULT_DETAILS)/clock(±30 s)/tls(http→https)/not_found(JSON, x-powered-by)/cors_allow+deny(`*` ham ushlanadi)/body_path(48 KB → 400 JSON)/bridge_401/jwt_reject(muddati o'tgan, begona secret, noma'lum kid)/proxy_ip(XFF uzatilyaptimi, soxtalanadimi)/admin(401 + kirish + navbat)/mentor_flow(join → ETag/304 → heartbeat → me → end_session, tozalab ketadi)/school_api(noma'lum o'quvchi → 403 = ulanish ✓; auth/unavailable ajratiladi)/latency. `--read-only` (prod), `--local`. Lokal 4 stsenariyda sinaldi (to'g'ri env 0 ✗; noto'g'ri secret/env → aniq ✗; o'chiq server).
- Health kengaydi (sir emas): `time`, `client.ip/forwarded`, `checks.migrations/catalog`, `features`. Test yangilandi.
- **NUQSON 1 (deploy-bloker):** Docker-image'ga `data/` kirmas, compose `migrate` faqat sxemani yurgizar edi → serverda katalog BO'SH, har `join` «dars topilmadi». Yopildi: `COPY data`, `migrate` = `migrate-cli && seed-catalog` (idempotent). TZ UZ/RU §2 jadvali, DOCKER.md, SINOV §0 yangilandi.
- **NUQSON 2 (xavfsizlik/rate-limit):** `TRUST_PROXY=true` hamma zanjirga ishonadi → mijoz `X-Forwarded-For` ni soxtalab IP-limitni aylanib o'tadi. Endi `TRUST_PROXY=N` (proksi soni) ham qabul qilinadi; default `true` qoldi (topologiya noma'lum), staging-check `proxy_ip` ⚠ bilan ko'rsatadi → tasdiqlangach env'da `1`.
- `scripts/smoke-lms.mjs` endi `CHROME` env oladi (Kali). Runbook: `STAGING_QABUL_UZ.md` (0-oldindan, 1-manzil shakli, 2-buyruq, 3-✗→kimga jadvali, 4-pilot, 5-prod, 6-tekshirilmaydiganlar).
- Testlar: unit 51 · int 66 · lint toza. Qolgan: GitLab sync (buyruq bilan) — Kristina yangi compose'ni olishi uchun SHART.

**2026-09-08 — KUTISH DAVRI (3): lesson_id takrorlari yopildi (katalog 115 → 110, takror 0).**
- `pm-m1d2-v1`: haqiqiy M1-D2 = `PmLesson1.jsx` (App.jsx `m1-02`); `PmAudienceLesson.jsx` 2026-07-28 da App'dan o'chirilgan o'lik nusxa edi, hech qayerdan import qilinmaydi → `.homework.jsx` bilan birga `src/eski/1-Modull/` ga ko'chirildi (git mv). `pm-m1d2-v1` endi PmLesson1'niki (4 yutuq-ta'rifi ham). jsx-lint: 7 eski topilma yo'qoldi — **0**.
- `scripts/gen-lesson-catalog.mjs`: `SKIP_DIRS` (live · eski · 2-moodull eski) — til/jsx/dark-lint bilan bir xil; takror topilsa chiqish kodi 1 (CI darvozasi). 5 eski `js-*-01-v16` katalogdan chiqdi (seed dev'da active=false).
- `CRM_YUKLASH_ROYXATI.md` PmLesson1 qatorlari tozalandi. lms/ yig'malariga tegilmadi (cutover).

**2026-09-08 — KUTISH DAVRI (4): CUTOVER-MASHQI — 90 LMS-fayl boshidan yig'ildi va brauzerda ochildi.**
- `scripts/cutover-mashq.mjs` (yangi): `CRM_YUKLASH_ROYXATI.md` ni o'qiydi (90 qator: chiqish-fayl, lesson_id, manba, yakka/shared), har manbani tekshiradi (bor · lessonId ro'yxatdagi bilan bir xil · id server-katalogida), `build-lms` bilan boshqa papkaga yig'adi (`LMS_OUT_DIR`, `lms/` tegilmaydi), chiqishni tekshiradi (yo'l ro'yxatdagidek · API-manzil bor · Supabase yo'q · sarlavha-manba · shared import / yakka bundle) va `--smoke` bilan har faylni Chrome'da ochadi (yakka → smoke-lms, shared → smoke-shared). Cutover kuni: `--url <manzil> --out lms --smoke`.
- Yig'ish: 90/90, 2 s, 33 MB; hammasida yangi API-manzil, Supabase 0. Eski `lms/` dagi 90 faylning HAMMASI hali Supabase'ga ishora qiladi (17-avgust yig'malari) — cutover'da to'liq almashadi (o'rtacha +21 KB, src/live + recordAttempt).
- **TOPILMA 1 (ro'yxat):** `PmLesson9.shared.jsx` va `PmUserStoryLesson.shared.jsx` ro'yxatda ildizda, yig'uvchi esa `4-M/` ga chiqaradi (OUT_MAP) — cutover kuni eski nusxa yuklanib ketardi. Ro'yxat to'g'rilandi (4-M 16 fayl · ildiz 45), eski ildiz-nusxalarini cutover kuni o'chirish belgilandi.
- **TOPILMA 2 (smoke-evristikasi):** `VsCodeLesson` (yakka+shared) smoke'da «kompilyator ochilmadi» — regressiya EMAS: dars uy-vazifa seed'ini (`ccPractice {kind:'hw'}`) 21-avgustdan beri ataylab bekor qiladi (uy vazifasi kompilyatorda emas), kompilyator faqat dars-ichi praktikasi orqali ochiladi; eski 17-avgust yig'masida bu mantiq yo'q edi, shuning uchun o'tar edi. smoke-lms/smoke-shared'ga uchinchi nomzod-seed qo'shildi: `PRACTICE_AFTER[N]` bo'lsa darsning o'z shakli `{kind:'sN', screen:N}` (esbuild `const→var` qilgani uchun regex `(?:const|let|var)`). Ikkala fayl ✓, nazorat-dars (Htmllesson1) ✓.
- Muhit-tuzatishlar: smoke-lms/smoke-shared `nodePaths` (fayl repo tashqarisida bo'lsa ham `react` topiladi), `CHROME` env, `LMS_DIR`/`LMS_OUT_DIR`. Tashqi kompilyator-modul (`lms/html-compiler.jsx`, HC_NASHR 2026-08-17) manba bilan bir xil — qayta yuklash shart emas.
