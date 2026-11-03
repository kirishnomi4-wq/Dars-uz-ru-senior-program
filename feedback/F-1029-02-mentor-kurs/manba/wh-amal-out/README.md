# wh-amal-out — Webhook amaliyotlari mentor yo'lida (01.11.2026 05:52, avtopilot)

Skript: `manba/drive-wh-amaliyot.sh`. `cp .env.example .env`, `TOLOV_KALITI` — `node -e "…randomBytes(32)…"`, `npm run start`, `/royxat` (login), **brauzerda** `localhost:3000/tolov-mashq?oyinchi=11&summa=10000` — tugmalar haqiqiy bosilgan (headless Chrome), sahifadagi javob satrlari olingan.

| Fayl | Nima ko'rindi |
|---|---|
| 01 | kalit 64 belgi · start ✓ · `{"id":11,"ism":"Ali"}` |
| 02 | sahifa: `To'lash (mashq) · m-… — 200 {"ok":true}` · `Rad etish (mashq) · m-… — 200 {"ok":true}`; `tolovlar`: tolandi, rad |
| 03 | `Ikki marta yuborish · m-… — 200 {"ok":true}` va `— 200 {"takror":true}` · `Imzosiz yuborish · m-… — 401 {"message":"Imzo mos emas",…}`; jadvalda 3 qator |
| 04 | `main.ts` dan `rawBody` olib tashlandi → `To'lash (mashq) · m-… — 401` |
| 05 | qaytarildi → `200 {"ok":true}` |
