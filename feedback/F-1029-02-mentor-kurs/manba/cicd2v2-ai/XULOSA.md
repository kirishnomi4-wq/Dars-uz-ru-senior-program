# CI/CD-2 v2 · AI tajribasi — xulosa (F-1104-21, 04.11)

Loyiha: OrderBotNest `cicd1-done` (b842475: tavsiya `ci.yml`, node 24). Har agent alohida nusxada (scratchpad `cicd2-ai1`, `cicd2-ai2`, tarmoq `ish`), bitta oddiy prompt (`p1-prompt.txt`):
«OrderBotNest'da `npm run smoke` buyrug'i bor — Telegram'siz tekshiruv, unga PostgreSQL kerak (DATABASE_URL). GitHub Actions workflow'iga shu smoke'ni ham qo'shib ber: har push'da testlar va smoke yursin.»
Ishorasiz: `services`, image, `secrets`, `env`, `needs`, versiya so'zlari yo'q.

| | 1-AI (Opus) | 2-AI (Haiku) |
|---|---|---|
| O'zgargan fayl | faqat `.github/workflows/ci.yml` (+20 satr, 35) | faqat `.github/workflows/ci.yml` (+17 satr, 32) |
| Postgres | `services: postgres` `image: postgres:18` (README'dagi versiyadan), `POSTGRES_USER/PASSWORD/DB: shop`, port 5432, `pg_isready` healthcheck | xuddi shu |
| `DATABASE_URL` | faqat `smoke` qadamining `env:`ida (`postgresql://postgres:postgres@localhost:5432/shop`) | job darajasida `env:` (hamma qadamga) |
| `secrets` | **ishlatmadi** — izoh: «faqat job ichidagi vaqtinchalik konteyner — Secrets kerak emas» (to'g'ri fikr) | ishlatmadi |
| Node | 24 (mavjud fayldan saqladi) | 24 |
| Tartib | `npm ci` → `tsc` → `test` → `build` → **`smoke`** (oxirida, alohida job emas) | xuddi shu |
| Izohlar | yml ichida 3 ta o'zbekcha izoh; «smoke ichida yana `nest build` — build ikki marta» ni o'zi sezdi | yo'q |
| YAML (rasmiy tahlilchi) | ✓ | ✓ |

## Haqiqiy lentada (`ci-sinov`, `drive-cicd2v2-actions-ai.sh`)

| Run | Workflow | Natija | Qadamlar |
|---|---|---|---|
| `40-ai1` | 1-AI, o'zgartirilmagan | ✓ success (43 s) | `Initialize containers` 12 s (Postgres) → checkout → setup-node → ci 9 s → tsc → test → build → **smoke 8 s: `NATIJA: 5/5 ✓`** (restart 3, race 2) → `Stop containers` |
| `41-ai2` | 2-AI, o'zgartirilmagan | ✓ success | xuddi shu, smoke ✓ |

## Xulosa (darsga kiradi — AI ekranlari)
1. **Bu safar ikkala AI birinchi urinishda yashil** — CI/CD-1 dagidan farqli (u yerda node 22 tuzog'i). Sabab: mavjud `ci.yml` (node 24) bor edi — AI uni **o'zgartirdi, noldan yozmadi**: tayanch to'g'ri bo'lsa, AI ham to'g'ri davom etadi.
2. Ikkalasi `services: postgres` ni bildi, healthcheck qo'ydi (bazasiz boshlab ketmasin), `POSTGRES_DB: shop` — smoke `shop_smoke`ni o'zi ochadi.
3. Ikkalasi `secrets` ishlatmadi — **to'g'ri**: konteyner paroli sir emas, u job bilan birga o'ladi. Secret haqiqiy tashqi resurs uchun (prod baza, bot token). Mentor farqini bilishi kerak (34-run: maska).
4. Farq: `env` qayerda — 2-AI job darajasida (hamma qadam ko'radi), 1-AI faqat smoke qadamida (torroq — yaxshiroq). 1-AI build ikki marta yurishini aytdi (smoke o'zi `nest build` qiladi) — mentor `npm run build` qadamini olib tashlashi yoki qoldirishi mumkin.
5. Smoke alohida job emas (bitta job'da oxirida) — tavsiyada `smoke` job `needs: test` bilan alohida: test qizil bo'lsa Postgres ko'tarilmaydi (vaqt va resurs), Actions'da ikki job ko'rinadi.
6. Mentor uchun to'rt savol (AI workflow'i, smoke bilan): `services` + healthcheck bormi · `DATABASE_URL` qadamga yetib boradimi (`env`) · tartib (smoke build'dan keyin) · secret kerakmi (konteyner — yo'q; tashqi baza — ha).

Fayllar: `ai1/.github/workflows/ci.yml`, `ai2/.github/workflows/ci.yml`, `ai*/diff.patch`, `ai*/diff-stat.txt`, `cicd2v2-out/40-ai1.txt`, `41-ai2.txt`.
