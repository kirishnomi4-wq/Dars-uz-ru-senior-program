# F-1105-03 — 10.11.2026 kechki reliz rejasi

Abdulloh tomoni prod'da tayyor (35-xabar): CRM, School API, LMS, qabul qiluvchi. Bizda qolgani — quyidagi tartib. Har qadam oldingisi tasdiqlangandan keyin.

## 0. Tayyorlov (hozir)

| Ish | Kim | Holat |
|---|---|---|
| Paket `yuklash-20261110-prod/` (commit `9f9951b9`, ✕ yozuvi bilan) — to'liq smoke | Claude | yig'ilmoqda |
| 172 dars × 2 til: avto-yakun | Claude | ✅ 344/344 |
| 172 dars × 2 til: onFinished (tugma) | Claude | yurmoqda |
| Abdullohga: «Tamom» → keyingi bosqich, «Результат сохранён» 2–3 s | foydalanuvchi | ✅ yuborildi |

## 1. Dars API prod'ga (bayroq OFF)

Shart: jonli dars 0.
1. Tekshiruv: `! cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod tools/v2-kuzatuv.mjs https://dars-api.coddycamp.uz` → «jonli 0».
2. GitLab → dars-api-coddy → Pipelines → **#3049126359** (`main`, Blocked) → deploy ▶.
3. `! curl -s https://dars-api.coddycamp.uz/api/v1/health` → kutiladi: versiya `ab1bfa3…`, `"migrations":17`, `"result_schema_v2":"off"`, status ok.
4. Claude tekshiradi. Muammo bo'lsa — eski job'ni qayta ishga tushirish (rollback), darslar yuklanmaydi.

## 2. 172 dars LMS'ga

Shart: 1-qadam ✅, dars vaqtidan tashqari.
1. Yuklovchi seansga: `yuklash-20261110-prod/` + `YUKLASH_PROTOKOLI.md`.
2. Yuklovchi har faylni yuklaydi, md5 ni tekshiradi, `yuklangan.csv` ni to'ldiradi.
3. Tanlab tekshiruv (foydalanuvchi): prod LMS'da 2–3 darsni ochish (masalan m1-01 Internet, m10-12) — ochiladi, xato yo'q.

## 3. Muhrlash va savol kalitlari

1. Claude: `node scripts/lms-farq.mjs muhrla yuklash-20261110-prod/yuklangan.csv --kim <seans> --server ab1bfa3` → reestr + jurnal, commit.
2. Claude: `node scripts/savol-kalitlari.mjs --yoz` (yangi versiyalar bilan).
3. Foydalanuvchi: `! cd /home/kali/Desktop/internetLesson && node --env-file=server/.env.deploy.prod scripts/savol-kalitlari.mjs --yukla https://dars-api.coddycamp.uz`.

## 4. Yangi oqimni yoqish

Shart: 1–3 ✅, jonli dars 0.
1. Prod `/srv/dars-api/prod/.env.deploy` ga `RESULT_SCHEMA_V2=on` — **faylni joyida tahrirlash** (`sudo sed -i …`), keyin `getfacl` bilan `gitlab-runner` ruxsati turganini tekshirish. Konteyner qayta ishga tushadi. Kim: serverga kirish huquqi borlar (Abdulloh jamoasi).
2. `! curl -s https://dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`.
3. Shu lahzadan boshlangan urinishlargina v2 oladi (0017 chegara) — eski urinishlar qayta yuborilmaydi.

## 5. Birinchi haqiqiy dars — kuzatuv

1. Birinchi jonli darsdan keyin: `! … tools/v2-kuzatuv.mjs https://dars-api.coddycamp.uz` → `lr_` / `ap_` / `ar_` — delivered → applied.
2. Birinchi event ID'lar va Dars SHA — Abdullohga.
3. 1 soatdan keyin va kun oxirida yana bir marta.

## Qaytarish

- Muammo bo'lsa: `RESULT_SCHEMA_V2=off` → konteyner qayta ishga tushadi. Darslar keyingi kirishda eski yukka qaytadi, qayta yuklash shart emas. Hech narsa o'chirilmaydi, v1 ishlayveradi.
- Qayta yoqishda: `RESULT_SCHEMA_V2_FROM=<qayta yoqish vaqti>`.

## Keyin (bugun emas)

- LMS: «Tamom» → keyingi bosqich; «Результат сохранён» 2–3 s (Abdulloh). Darslarni qayta yuklash kerak emas.
- Shahzoda: muddatlar hujjati (29) — sanalar bilan; konnektor (Abdulloh, alohida reliz).
- Ixtiyoriy: `ar_` arena yopilishi bilanoq; amaliyotda har «Tekshirish» alohida va o'quvchi matni (keyingi bosqich).
