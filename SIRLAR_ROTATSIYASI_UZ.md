# Sirlar rotatsiyasi — prod'dan oldin (runbook)

> Nega: LMS sirlari (JWT-secret, ikki `sapi_` token) 2026-08-26 da ochiq Telegram-chatda kelgan (LMS'ning o'z §1/§10 qoidasiga zid).
> Prod'ga chiqishdan oldin ular yangilanadi. Bizning o'z sirlarimiz (POSTGRES, TOKEN_ENC_KEY, ADMIN, LIVE_MENTOR_CODE) 2026-09-07 da
> lokal yaratilgan, faqat Kristinaga fayl sifatida ketgan — rotatsiya shart emas.
> Rollar: **Axadulla** — yangi qiymatlarni beradi (LMS/School API tomoni) · **Kristina** — `.env.deploy` ga qo'yadi, api'ni qayta ishga tushiradi ·
> **biz** — `tools/staging-check.mjs` bilan tekshiramiz. Yangi sirlar faqat yopiq kanalda (fayl yoki parol-menejer), chatga matn sifatida EMAS.

## 1. JWT-secret (liveToken) — uzilishsiz, ikki kalit parallel

Server ikkita `kid`ni bir vaqtda qabul qiladi (`CODDYCAMP_LIVE_JWT_SECRET_NEXT` + `CODDYCAMP_LIVE_JWT_KEY_ID_NEXT`), tokenning `kid`
sarlavhasiga qarab kalit tanlanadi. Shuning uchun tartib:

| # | Kim | Nima | Tekshiruv |
|---|---|---|---|
| J1 | Axadulla | Yangi secret (48 bayt, base64; `openssl rand -base64 48`) va `kid=v2`. LMS hali **v1** bilan imzolayveradi | — |
| J2 | Kristina | staging `.env.deploy`: `CODDYCAMP_LIVE_JWT_SECRET_NEXT=<v2>`, `CODDYCAMP_LIVE_JWT_KEY_ID_NEXT=v2` → api restart | biz: `node --env-file=.env.deploy.staging tools/staging-check.mjs <staging>` → `jwt_next` ✓ (v2 qabul), `jwt_reject` ✓ |
| J3 | Kristina | prod'da xuddi shu (J2) | `--read-only` bilan prod: `jwt_next` ✓ |
| J4 | Axadulla | LMS imzolashni **v2** ga o'tkazadi (staging, keyin prod). v1 tokenlar hali yashaydi (TTL ≤ 12 soat) | O-1 darsga kiradi (PIN'siz) — admin-sahifada sessiya |
| J5 | — | ≥ 12 soat kutish (eng uzun v1 token muddati, `CODDYCAMP_LIVE_JWT_MAX_TTL_SECONDS`) | — |
| J6 | Kristina | `CODDYCAMP_LIVE_JWT_SECRET=<v2>`, `CODDYCAMP_LIVE_JWT_KEY_ID=v2`, `_NEXT` ikkalasi o'chiriladi → restart | staging-check: `jwt_next` «o'tkazildi» (endi bitta kalit), `jwt_reject` ✓; eski v1 token → 401 |
| J7 | Axadulla | v1 secret yo'q qilinadi | — |

Rollback: J2–J5 oralig'ida hech narsa buzilmaydi (ikkalasi ham ishlaydi). J6 dan keyin muammo chiqsa — J2 holatiga qaytish (v1 ni `_NEXT` sifatida qo'shish).

## 2. School API tokenlari (`sapi_` — kontekst va natija)

Serverda bittadan qiymat, ikki-token rejimi yo'q → almashtirish = env + restart (≈5 soniya; natija-navbat qayta urinadi, hech narsa yo'qolmaydi).

| # | Kim | Nima | Tekshiruv |
|---|---|---|---|
| T1 | Axadulla | Yangi `sapi_` kontekst-token va natija-token; eskilari **kamida 1 kun** ishlab turadi | — |
| T2 | Kristina | staging `.env.deploy`: `CODDYCAMP_CONTEXT_API_TOKEN`, `CODDYCAMP_RESULTS_API_TOKEN` → restart | staging-check `school_api` ✓ (kontekst); natija: bitta sinov-dars → admin `results/:id/verify` 200 |
| T3 | Kristina | prod'da xuddi shu | `--read-only` prod: `features` ✓; birinchi haqiqiy natija `delivered` |
| T4 | Axadulla | eski tokenlarni bekor qiladi | staging-check `school_api` hali ✓ (yangisi ishlayapti) |

Agar T2 dan keyin `school_api` → `school_api_auth` ✗ chiqsa: yangi token noto'g'ri nusxalangan (bo'sh joy/qator-oxiri) yoki hali faollashmagan.

## 3. Bizning sirlar (rotatsiya shart emas; kerak bo'lsa)

- `TOKEN_ENC_KEY` — sessiya-tokenlarini bazada shifrlaydi; o'zgartirilsa **faol jonli sessiyalar uziladi** → faqat darslar yo'q vaqtda, `LIVE`=0 bo'lganda.
- `POSTGRES_PASSWORD` — bazada ham (`alter role dars password`), env'da ham; Kristina bilan birga.
- `ADMIN_PASSWORD`, `LIVE_MENTOR_CODE` — env + restart, boshqa ta'siri yo'q (mentor-kod zaxira-saytdagi mentorlarga aytiladi).

## 4. Qachon

J1–J3 va T1–T2 — **staging'da LMS-sinov o'tgach, prod'ga chiqishdan oldin** (bir kun). J4–J7, T3–T4 — prod'ga chiqqan kuni va ertasi.
Bugungi holat (2026-09-08): boshlanmagan; Axadulla'ga so'rov-xati tayyor (quyida).

## 5. Axadulla'ga xat (nusxa)

```
Axadulla aka, prod'ga chiqishdan oldin LMS sirlarini yangilashimiz kerak — ular 26-avgustda ochiq chatda kelgan edi (sizning §10 qoidangiz).
So'rov:
1) liveToken uchun yangi JWT-secret (48 bayt, base64) va kid=v2. Serverimiz ikki kalitni parallel qabul qiladi, shuning uchun uzilish bo'lmaydi:
   avval biz v2 ni qo'shamiz, keyin siz imzolashni v2 ga o'tkazasiz, 12 soatdan keyin v1 o'chiriladi.
2) School API uchun yangi sapi_ kontekst-token va natija-token; eskilari kamida 1 kun ishlab tursin.
Qiymatlarni chatga emas, fayl yoki parol-menejer orqali Kristinaga (u .env ga qo'yadi) va bizga bering.
Vaqti: staging'da sinov tugagach, prod'dan bir kun oldin — biz aytamiz. Tartib: SIRLAR_ROTATSIYASI_UZ.md (bizda).
```
