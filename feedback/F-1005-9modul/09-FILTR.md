# 9-dars «Loyiha kuni: MVP tayyor» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7.5/10. Hukm: Qabul 13 · Qisman 2 · Rad 2. Tayanchga tegadigan qaror yo'q (K7 ga ikki yangi nom qo'shildi — `WEB_ORIGIN`, `VITE_API_URL`) — qo'llandi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Production CORS hal qilinmagan — Netlify saytdan Render'ga so'rov bloklanadi | **Qabul** | Fakt to'g'ri (7-darsda CORS faqat `localhost:5173`). A3 prompti: Backend `localhost:5173` va `WEB_ORIGIN` dagi Netlify manzilidan ruxsat beradi; Netlify manzili Render'da `WEB_ORIGIN` ga yoziladi. KOD va README. |
| 2 | `JWT_SECRET` yo'qolgan — token imzolanmaydi | **Qabul** | A2 1-qadam: `EGA_PAROLI` va `JWT_SECRET`; prompt «kodda ham, repo'da ham bo'lmasin»; Render Environment — uchala sir; KOD. |
| 3 | Double booking: o'quvchi matnida faqat «Backend tekshiradi» | **Qisman** | 2-ekran xulosasi, 3-ekran izohi, yakun: «Backend tekshiradi, Database bir katakni ikki marta yozdirmaydi». Test savoli va ✔ o'rni (B) o'zgarmadi — bitta javobli test; himoyaning ikkinchi qavati izohda (4-dars bilan bir xil). |
| 4 | Netlify: base `web` bo'lsa publish `dist` | **Qabul** | «publish `dist` (base'ga nisbatan)». Netlify interfeysi «qur» da tekshiriladi. |
| 5 | Render: «30–60 soniya» kafolat | **Qabul** | «Bepul Backend 15 daqiqa ishlatilmasa uxlab qolishi mumkin — keyingi birinchi so'rov sekinroq javob beradi.» |
| H | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | Qonun talab qiladi (T-028, M5-03). To'g'ri javob matni «shu versiya» bilan aniqlashtirildi. |
| MVP | «MVP … ishlaganda tayyor» — universal ta'rif bo'lmasin | **Qabul** | Hook, yakun, kartochka: «Biz belgilagan shu MVP versiyasi …». |
| Auth | Bitta egali sodda kirish — chegara | **Qabul** | A2 natijasi ostida izoh-qator (4-dars bilan bir xil fikr). |
| 5-ekran | ✔ «parol `.env` da» — xavfsizlikning asl sababi emas | **Qabul** | ✔ «Yo'q — tokensiz `GET /bandlar` 401 qaytaradi» (o'rni C); izoh: «Backend ro'yxatni faqat to'g'ri token bilan beradi». Yakun: «Shaxsiy ma'lumotni Backend faqat token bilan beradi». |
| `band-qildi` | Faqat saqlangach — to'g'ri | **Qabul** | O'zgarmadi. |
| Manzil | `VITE_API_URL` — manzil sozlamada | **Qabul** | A3 prompti va Netlify sozlamasi; tayanch K7. |
| S1 | Reja sarlavhasi → savol | **Rad** | Reja ekrani — natija-gap (1–8-darslar bilan bir xil). |
| S-yakun | «MVP endi boshqa odam ishlata oladigan holatdami?» | **Qisman** | Yakun shakliga moslab: «MVP tayyor: boshqa odam ishlata oladi.» — 10-darsga ko'prik. |
| Ismlar | Jasur/Bekzod — ma'lumot qatori | **Qabul** | Qoldi. |
| O'zim 1 | 9-darsda o'quvchi 18:00 ni band qiladi — 10-dars sinov vazifasi «Shanba 18:00» uning Database'ida band bo'lib qoladi | — | A1 testi 19:00, A3 testi 21:00; A1 da «18:00 ni band qilmang» izohi; tayanch K7. |
| O'zim 2 | A1 SQL tekshiruvi «bitta qator» — 7-darsdagi ikki namuna band ham chiqadi | — | `WHERE soat = '19:00'` — bitta qator. |
| O'zim 3 | Jadval ko'rinishida `kun` = «shanba» — K2 (sana) ga zid | — | `2026-10-10`. |
