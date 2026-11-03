# wh-out — Webhook: to'lov xabari, haqiqiy Backend bilan (01.11.2026, avtopilot)

Skript: `manba/drive-wh.sh`. O'quvchi loyihasi `maydon-jamoa` `m13-dars-03-done` (6a1ed16): `POST /tolov/webhook`, `backend/src/tolov/imzo.ts` (HMAC SHA-256, `timingSafeEqual`), `GET /tolov-mashq` + `POST /tolov-mashq/yubor` («Mashq to'lov» — to'lov xizmati o'rnida, Backend'ning o'zida). Lokal PostgreSQL, `TOLOV_KALITI` — tasodifiy 64 hex (qiymat yozilmagan).
Bu tegda ro'yxat `{ ism, login, parol }` (telefon emas) — Ali `id 11`.

| Fayl | Nima ko'rindi |
|---|---|
| 01 | mashq sahifasi: «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 10 000 so'm» · to'rt tugma |
| 02–05 | To'lash → `200 {"ok":true}` · Ikki marta → `200 ok` va `200 {"takror":true}` (bitta raqam) · Rad → `200 ok` · Imzosiz → `401 Imzo mos emas` |
| 06 | `tolovlar`: 3 qator (tolandi, tolandi, rad); imzosiz yozilmagan |
| 07 | soxta: imzo yo'q · `abc` · boshqa kalit · to'g'ri imzo, lekin summa o'zgartirilgan — hammasi `401`, `soxta-1` jadvalda 0 |
| 08 | xom tana: ma'nosi bir xil, bo'sh joylari boshqa JSON → `401`; aynan o'sha matn → `200 ok` |
| 09 | imzo to'g'ri, maydon xato → `400` («holat — tolandi yoki rad», «summa — musbat butun son (so'm)», «oyinchiId — mavjud hisob») |
| 10 | bir vaqtda ikki bir xil xabar → biri `ok`, biri `takror`; jadvalda 1 qator. `10b`: PostgreSQL logida yagona `duplicate key … (tolov_raqami)=(m-bir-vaqtda)` — ikkinchisi oldindan tekshiruvdan o'tib ketgan, uni noyob ustun to'xtatgan, kod `23505` ni takror qilgan |
| 11 | `TOLOV_KALITI=` bo'sh → «To'lash» ham `401` |
| 12 | `main.ts` da `rawBody: true` yo'q → haqiqiy «To'lash» ham `401` |
| 13 | **tartib buzilgan** (imzo tekshiruvi yozuvdan keyin): «Imzosiz» → `401`, lekin `tolovlar` da yangi qator `tolandi` |

README «To'lov»: «Hozir ishlaydi: … Pro va ilova hali o'zgarmaydi» — reja jadvalidagi «Pro muddatini uzaytiradi» hali qurilmagan (kodda yo'q).
