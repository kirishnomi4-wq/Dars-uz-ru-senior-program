# JAVOB v6 — Backend sizning serveringizda: biz nima beramiz, sizdan nima kerak

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) jamoasi
**Sana:** 2026-09-07 · **Nimaga javoban:** «Backend'ni bizning serverga Docker'da joylaymiz, Git va CI/CD beramiz» taklifi

---

## 0. Qaror

Taklifni qabul qilamiz. Ish-tartibi: sizning Git-repo va CI/CD. Biz `staging` yoki `main` shoxiga push qilamiz, CI image yig'adi, testlarni yurgizadi va serverga joylaydi. Bizga serverga kirish kerak emas.

## 1. Biz beramiz

Hammasi repo'da tayyor:

- Kod `dars-api`: Node 22, Fastify, PostgreSQL 16. Testlar: unit 45, integratsion 60, brauzer E2E 26.
- `Dockerfile` · `docker-compose.deploy.yml` (postgres + migrate + api + backup) · `.env.deploy.example` (env ro'yxati) · `.gitlab-ci.yml` (test → image → deploy shabloni) · `DOCKER.md` (yo'riqnoma).
- Migratsiya avtomatik: `migrate` xizmati api'dan oldin bir marta yuriydi, xato bo'lsa api ko'tarilmaydi.
- Zaxira avtomatik: `backup` xizmati har 24 soatda `pg_dump`, 14 kun saqlaydi.

Server talabi: Docker Engine 24+ va Compose v2 · 2 GB RAM, 1 vCPU, 10 GB disk · ichki port 3001 (staging 3002), tashqarida sizning HTTPS reverse-proxy · `X-Forwarded-For` va `X-Forwarded-Proto` uzatilsin.

## 2. Sizdan kerak

Shu jadvalni to'ldirib qaytarsangiz kifoya.

| № | Savol | Javobingiz |
|---|---|---|
| **A-1** | API'ning ochiq HTTPS manzili, prod va staging uchun alohida. Sizga qulay shakl: subdomen (`dars-api.coddycamp.uz`) yoki yo'l (`lms.coddycamp.uz/dars-api/`) | `https://______` · `https://______` |
| **A-2** | Repo manzili (GitLab) va bizni qo'shish uchun qaysi akkaunt kerak (email yoki username) | `______` |
| **A-3** | Deploy tartibi: `staging` shoxi → staging, `main` → prod bo'ladimi; oldingi versiyaga qaytish (rollback) qanday | ha / yo'q · `______` |
| **A-4** | Env-fayl (`.env.deploy`) serverda qayerda turadi va sirlarni kim to'ldiradi. Sirlar sizda bor: `sapi_` tokenlar, JWT-secret. Ro'yxat `.env.deploy.example` da | `______` |
| **A-5** | Baza: compose'dagi PostgreSQL konteyneri va `dars-pgdata` volume qabulmi. Zaxira volume'i serverda qoladimi, undan nusxani kim oladi | ha / yo'q · `______` |
| **A-6** | Loglar: bizga o'qish-huquqi qanday beriladi (Dozzle, Portainer yoki CI-log). `/api/v1/health` va `/admin` (parol bilan) tashqaridan ochiq bo'lsin | `______` |
| **A-7** | Hodisa-kontakt: dars vaqtida muammo chiqsa kimga va qaysi kanal orqali yozamiz | `______` |

Nega muhim, bir jumladan:

- **A-1** — API manzili darslarga yig'ilish vaqtida kiradi; manzilsiz birorta dars yig'ilmaydi.
- **A-3** — staging bo'lmasa har o'zgarish to'g'ridan-to'g'ri jonli darsga tushadi.
- **A-5, A-6** — serverga kirmagach, zaxira va loglar bizning yagona ko'zimiz.

## 3. Tartib

| № | Kim | Nima | Qachon |
|---|---|---|---|
| 1 | Siz | A-1 … A-7 | shu hafta |
| 2 | Biz | Kod va Docker-paketni repo'ga, `staging` shoxi | A-2 dan keyin 1 kun |
| 3 | Siz | Staging deploy, manzil ishlaydi (`/api/v1/health` → 200) | |
| 4 | Biz | Staging'da to'liq E2E, pilot dars CRM test-materialida | 1 kun |
| 5 | Birga | Qabul-sinovi: sizning §13 21 band + bizning 8 band. Test-akkauntlarni biz o'zimiz olamiz | 7 kun |
| 6 | Siz | `main` → prod | sinovdan keyin |

Prod oldidan, bloklamaydi: coin-formula mas'uli · JWT rotatsiya `kid v2`.

Kod va Docker-paket tayyor. A-1 va A-2 kelgan kuni push qilamiz.
