# Dars v2 — biz tomon prod'da tayyor, `RESULT_SCHEMA_V2=on` qilish

10 noyabr 2026 · 35-hujjatga javob

Salom. Biz tomondan production tayyor. Endi faqat sizning qadamingiz qoldi — Dars API'da yangi oqimni yoqish.

## 1. Biz tomonda bajarildi

| Nima | Holat |
|---|---|
| Dars API production | `0.1.0+[SHA]`, migratsiya **17** (`0017_v2_cutoff`), `result_schema_v2: off` |
| Darslar LMS'da | **172 dars** yangi versiyada (Internet darsi — `v6`), production serverga ulangan |
| Chegara (cutoff) | v2 hodisalar faqat bayroq yoqilgandan keyin boshlangan urinishlarga — eski urinishlar qayta yuborilmaydi |
| QA jonli sinov | `lr_`, `ap_`, `ar_` — applied; Class va Learn yopildi; 39 coin |

## 2. Sizdan: bayroqni yoqish

Jonli dars yo'q paytda, serverda (`/srv/dars-api/prod`). Fayl **joyida** tahrirlanadi — qayta yaratilmaydi, `gitlab-runner` ruxsati saqlanadi (staging'dagi `chmod 600` holati takrorlanmasin):
```
cd /srv/dars-api/prod
grep -q '^RESULT_SCHEMA_V2=' .env.deploy && sudo sed -i 's/^RESULT_SCHEMA_V2=.*/RESULT_SCHEMA_V2=on/' .env.deploy || echo 'RESULT_SCHEMA_V2=on' | sudo tee -a .env.deploy >/dev/null
getfacl .env.deploy | grep gitlab-runner
docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d
```
Tekshiruv: `https://dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`, `"migrations":17`.

Yoqilgan vaqtni bizga yozing — birinchi darsni kuzatamiz.

## 3. Yoqilgandan keyin nima bo'ladi

- O'quvchi oxirgi ekranga yetganda `lr_` darhol; yetmasa — sessiya yopilganda.
- Arenaning birinchi savoli ko'rsatilganda `ap_`.
- Sessiya yopilganda har o'quvchiga `ar_` (arena bo'lmasa — `not_started`).
- Darslar shu zahoti yangi `onFinished` yukiga o'tadi (`schema_version: 2`, `dars_api`) — darslarni qayta yuklash kerak emas.
- Eski (v1) oqim yonma-yon ishlayveradi.

## 4. Muammo bo'lsa

`RESULT_SCHEMA_V2=off` (xuddi shu buyruq, `on` → `off`) va konteynerni qayta ishga tushirish. Hammasi eskicha ishlaydi, darslarni qayta yuklash kerak emas, hech narsa o'chirilmaydi.
Qayta yoqishda `RESULT_SCHEMA_V2_FROM=<qayta yoqish vaqti, ISO>` qo'shing — o'chiq turgan paytdagi urinishlar uchun v2 yaratilmasin.

## 5. Ochiq (LMS, darslarga tegmaydi)

1. «Tamom» / «Darsni yakunlash» → keyingi bosqich: dars `onFinished` ni ikki marta chaqiradi — oxirgi ekranda avtomatik (chiqarmang) va tugma bosilganda (xuddi o'sha yuk, o'sha `lr_`). Ikkinchisida keyingisiga o'tkazing. Ungacha darsda «✕ ni bosib chiqing» yozuvi chiqadi.
2. «Результат сохранён» xabari 2–3 soniyada yo'qolsin — hozir darsning pastki tugmasini yopadi.

Birinchi haqiqiy dars hodisalarining ID'larini kuzatuvdan keyin yuboramiz.
