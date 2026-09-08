# Staging qabul — Kristina manzil bergan kun (qadam-baqadam)

> Maqsad: manzil kelgan kuni 15 daqiqada «server tayyor / tayyor emas, sabab X, javobgar Y» degan aniq hukmga chiqish
> va tayyor bo'lsa pilot-darsni CRM'ga chiqarish. Hamma tekshiruv bitta buyruq: `tools/staging-check.mjs`.

## 0. Oldindan qilinadigan (manzil kelmasdan)

| # | Nima | Holat |
|---|---|---|
| 0.1 | ✅ 2026-09-08 14:06: staging = 91c93f6e, qabul 18 ✓ / 0 ✗. GitLab akkaunt tasdiqlandi (shared-runner sharti). `server/` o'zgarishlari GitLab `dars-api-coddy` ga sinxron: `bash scripts/sync-dars-api.sh staging` (buyruq bilan). **Kristina CI'si (2026-09-08 13:14, 302baef): `staging` shoxiga push → staging AVTOMATIK deploy; `main` shoxiga push → prod ham AVTOMATIK (health 60 s javob bermasa oldingi tasvirga o'zi qaytadi, log `/var/log/dars-api/deploy.log`). 🔴 `sync-dars-api.sh main` = darhol prod-deploy — faqat cutover qarori bilan.** Sync'dan oldin uning infra-commitlari (`.gitlab-ci.yml`, compose `seed` xizmati, `IMAGE_REPO`) `server/` ga qabul qilinadi — aks holda sync ularni yo'qotadi | ⬜ bugungi kod kutmoqda; infra qabul qilindi |
| 0.2 | **Env o'zgarishi = Kristinaga Telegram'da yozamiz, u qo'yadi (kelishuv 2026-09-08).** Env-fayllar Kristinada: `.env.deploy.staging` / `.env.deploy.prod` (2026-09-07 yuborilgan). Yangi kalitlar ixtiyoriy: `RESULT_DETAILS=off` (default), `TRUST_PROXY=1` (faqat `proxy_ip` ⚠ desa) | ✅ yuborilgan |
| 0.3 | Sinov-bazasi shart emas — tekshiruv tashqaridan, HTTPS orqali | — |

## 1. Manzil keldi

Kristina ikki shakldan birini beradi:

- **subdomen** — `https://staging-dars-api.coddycamp.uz` (TZ 4.1 bo'yicha, `127.0.0.1:3002`);
- **yo'l-prefiks** — `https://lms.coddycamp.uz/dars-api-staging`. Bunda Apache prefiksni KESIB uzatishi shart
  (`ProxyPass /dars-api-staging/ http://127.0.0.1:3002/`), chunki ilova `/api/v1/...` ni kutadi. Ikkala shakl ham bizga to'g'ri keladi:
  `liveClient` manzilni o'zgartirmasdan oxiriga `/api/v1/live` qo'shadi.

```
STAGING=https://staging-dars-api.coddycamp.uz     # Kristina 2026-09-08: → 127.0.0.1:3002 (tasdiqlandi)
PROD=https://dars-api.coddycamp.uz                # → 127.0.0.1:3001 (tasdiqlandi)
```
**2026-09-08 birinchi tekshiruv (eski image, kod sync'siz):** ikkalasida ham Apache/TLS/301/CORS/ETag-304/JWT/admin/School API ✓,
kechikish p95 ≈140 ms. ✗ faqat `migrations`/`catalog` (health'da maydon yo'q — eski image), sync + deploy'dan keyin qayta tekshiriladi.

## 2. Qabul-tekshiruv (bitta buyruq)

```
cd server
node --env-file=.env.deploy.staging tools/staging-check.mjs $STAGING
```

Env-fayl — Kristinaga yuborilgan faylning o'zi. Skript undan `DARS_ENV`, JWT-sirlar (sinov-token yasash), `CORS_ORIGINS`,
`ADMIN_*`, `RESULT_DETAILS` ni oladi va **serverdagi bilan solishtiradi** — shuning uchun serverda boshqa fayl tursa darrov ko'rinadi.

Kutilgan yakun: `Qabul: server tayyor` va `0 ✗`. Ruxsatli ⚠ (to'xtatmaydi):

| ⚠ | Ma'nosi | Nima qilamiz |
|---|---|---|
| `version` GIT_SHA yo'q | CI `--build-arg GIT_SHA` uzatmagan | Kristinaga eslatma; keyingi deploy'da `--sha <qisqa>` bilan tekshiramiz |
| `proxy_ip` XFF soxtalanadi | `TRUST_PROXY=true` hamma zanjirga ishonadi | Apache yagona proksi bo'lsa env'da `TRUST_PROXY=1`, keyingi deploy |
| `admin` o'chiq | `ADMIN_*` env'da yo'q | Yuborilgan faylda bor — Kristina eski faylni qo'ygan; so'raymiz |
| `catalog` soni farq | serverdagi image eski katalog bilan | keyingi deploy yangilaydi, to'xtatmaydi |

## 3. ✗ chiqsa — kimga, nima

| ✗ band | Sabab (eng ehtimoliy) | Kimga | Nima so'raladi |
|---|---|---|---|
| `health` tarmoq/`5xx` | DNS yo'q, TLS sertifikat, konteyner o'lik, proksi 3002 ga emas | Kristina | `docker compose ps`, `curl http://127.0.0.1:3002/api/v1/health` serverda |
| `health` baza `fail` | postgres konteyneri/parol | Kristina | `docker compose logs postgres api` |
| `env` farq | staging o'rniga prod (yoki aksincha) ulangan | Kristina | port/`DARS_ENV` |
| `migrations` farq | eski image yoki `migrate` yiqilgan | Kristina | `docker compose logs migrate`; image tag |
| `catalog` 0 | `migrate` xizmatida seed yo'q (2026-09-08 gacha compose) | biz → Kristina | yangi compose (migrate && seed) bilan qayta `up -d` |
| `features` ko'prik o'chiq | `CODDYCAMP_*`/`TOKEN_ENC_KEY` env'da yetmayapti | Kristina | yuborilgan `.env.deploy.staging` to'liq qo'yilsin |
| `clock` | server soati NTP'siz | Kristina | `timedatectl` |
| `tls` | http | Kristina | Let's Encrypt / yo'naltirish |
| `not_found` JSON emas | so'rov ilovaga yetmayapti (Apache default sahifa) | Kristina | `ProxyPass` yo'li/prefiks |
| `cors_allow`/`cors_deny` | `CORS_ORIGINS` yoki Apache `Header set` | Kristina | Apache CORS sarlavha qo'shmasin; env `https://lms.coddycamp.uz` |
| `body_path` 413/403 | `LimitRequestBody`/WAF | Kristina | kamida 128 KB |
| `bridge_401` 503 | ko'prik o'chiq | Kristina | env |
| `jwt_reject` 401 emas | verifikator ishlamayapti (2xx/5xx) | biz | log |
| `proxy_ip` xususiy IP | Apache `X-Forwarded-For` uzatmayapti — butun maktab bitta IP | Kristina | `ProxyPreserveHost On` + `RequestHeader set X-Forwarded-Proto` (TZ 4.1 namunasi) |
| `admin` parol bilan 401 | serverdagi env boshqa | Kristina | faylni qayta qo'yish |
| `mentor_flow` token rad | JWT env serverda boshqa | Kristina | `.env.deploy.staging` aynan |
| `mentor_flow` dars yo'q | katalog | Kristina | `catalog` bandi |
| `mentor_flow` ETag/304 | `mod_deflate` ETag'ni buzadi | Kristina | `DeflateAlterETag NoChange` yoki API uchun deflate o'chiq |
| `school_api` `school_api_auth` | `CODDYCAMP_CONTEXT_API_TOKEN` rad | Axadulla | token rotatsiya qilinganmi |
| `school_api` `school_api_unavailable` | konteynerdan `school-api.coddycamp.uz` ga chiqish yo'q | Kristina | DNS/egress |
| `latency` p95 > 1,5 s | server/tarmoq | Kristina | resurs |

Har ✗ uchun skriptning o'zi qisqa sababni yozadi; Kristinaga shu qatorni ko'chirib yuboramiz.

## 4. Qabul o'tdi — pilot

```
# 1) pilot yig'ish (staging manziliga ishora qiladi)
DARS_API_URL=$STAGING node scripts/build-lms.mjs src/1-Modull/InternetLesson.jsx      # → lms/InternetLesson.jsx
# 2) yig'ma brauzerda ochiladimi
CHROME=/usr/bin/google-chrome node scripts/smoke-lms.mjs lms/InternetLesson.jsx
# 3) tarkibida staging manzili bor, eski manzil yo'q
grep -c "$STAGING" lms/InternetLesson.jsx; grep -c "azizbek.site\|supabase" lms/InternetLesson.jsx   # birinchisi ≥1, ikkinchisi 0
```

Keyin: CRM «Umumiy modullar» → `lms/InternetLesson.jsx` → test-material (`type=jsx`) G-1 sahifasiga → M-1 CRM'da, O-1 LMS'da ochadi →
`SINOV_PROTOKOLI_LMS.md` §1 (LMS 21 band) + §2 (B1–B7). Natijalar staging admin-sahifasida: `$STAGING/admin`.

### 4.1 Cutover kuni — 90 fayl bir yo'la

```
CHROME=/usr/bin/google-chrome node scripts/cutover-mashq.mjs --url $PROD --out lms --smoke
```
`CRM_YUKLASH_ROYXATI.md` bo'yicha 90 faylni yig'adi (yakka + shared), har birini tekshiradi (manba/lesson_id/katalog/API-manzil/Supabase yo'q)
va brauzerda ochadi (kompilyator qatlami bilan). 2026-09-08 mashqida 90/90 o'tgan. Yig'ishdan OLDIN `lms/` ildizidagi eski
`PmLesson9.shared.jsx` va `PmUserStoryLesson.shared.jsx` o'chiriladi (ular endi `lms/4-M/` ga tushadi). Keyin CRM'ga papka-papka yuklash.

## 5. Prod (keyinroq, alohida kun)

```
node --env-file=.env.deploy.prod tools/staging-check.mjs https://dars-api.coddycamp.uz --read-only --sha <qisqa>
```
`--read-only` sessiya yaratmaydi va token ro'yxatga olmaydi. Prod'ga chiqarish = `bash scripts/sync-dars-api.sh main` (CI o'zi deploy qiladi,
rollback avtomatik) — faqat staging'da §13 sinovi o'tgach. Prod oldidan: sirlar rotatsiyasi (kid v2 + yangi `sapi_`),
`src/live/liveClient.js` `DEFAULT_API_URL` = prod manzil, `build-lms` 90 fayl (`CRM_YUKLASH_ROYXATI.md`).

## 6. Skript nimani TEKSHIRMAYDI (faqat serverda ko'rinadi — TZ §6)

Zaxira-dump (`dars-backups`), log-rotatsiya, konteyner resurs-limitlari, `.env.deploy` Git'da yo'qligi, rollback. Bular Kristinaning qabul-checklisti.
