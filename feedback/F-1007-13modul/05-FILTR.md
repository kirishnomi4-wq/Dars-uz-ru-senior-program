# 5-dars «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 4-dars MD si bilan bog'liqlik) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-05/` (05, 04, 10, 12, tayanch). Tuzatish skripti: scratchpad `f05/tuzat05.py` (05 — 42 juftlik, 04 — 2, 10 — 1, 12 — 3, tayanch — 3; birinchi yurishda arena savoli 2 joyda chiqdi (arena + O'lchov), skript 1 kutgan — to'xtatdi, fayl yozilmadi, sanoq tuzatilib qayta yurgizildi). F-1007-463.

Audit bahosi 6.5/10 (pedagogika 9 · buzish fikri 9 · to'lov to'g'riligi 5 · 4→5 bog'liqlik 4.5 · xavfsizlik 6 · 90 daqiqa 3.5). Hukm: **Qabul 11 · Qisman 3 · Rad 4 · Allaqachon 19** (sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorlarga zid bandlar — o'zgartirilmadi, sizga aytiladi:** 9 (mashq tugmalari hamma hisobda — **M-q3 A**) · 18 (`GET /oyinlar` dagi takror yaratilish — 12-darsda, **M-q4 A**) · 24 (hook javoblari — T-028, T-067) · 30 (`rejim` ustuni — 9.49). Ulardan birortasini o'zgartirmoqchi bo'lsangiz — ayting.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.5 «Mentor repo'sida `05-start` aynan shu holatda» → «agent yozgan kod, ataylab buzilmaydi; pilotda chiqmasa — 5-dars moslanadi» · 3-bo'lim jadvali (`05-start` README eslatmasi pilotdan keyin) · yangi 9.51.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 4-darsni ataylab xato kod bilan tugatish — RAD; pilot natijasi yoki alohida «buzuq» tarmoq | **Qisman** | **Ataylab buzish — haq, endi aniq yozildi:** `05-start` = `04-done` — agent 4-darsda yozgan kod; hech narsa ataylab qo'yilmaydi (A-1, A-4 ⛔ ostida qalin qator, REPO 1, TS 11, Shubhali 2, tayanch 1.5 va 3-jadval). README eslatmasi — pilotdan keyin, topilgan son bilan; topilmasa — yo'q. **Alohida «buzuq» tarmoq — Rad:** Mentor misoli natijasi tanlanmaydi (12-Modul 9.37 a) — sahnalashtirilgan xato o'sha qoidaga zid. Oqibat (sizga aytiladi): F-1007-462 dan 4-dars talabi Pro'ni yozuv bilan bitta Database ishida so'raydi — pilotda 1-muammo chiqmasligi mumkin; unda Mentor misolida ham «buzilmadi», 2, 4, 5-ekran va arena haqiqiy natijadan yoziladi. |
| 2 | 4-ekran testi xato qurilishiga bog'langan — kalit pilotdan keyin muhrlansin | **Qabul** | 4-ekran izohiga ⛔: savol, to'g'ri va xato izohlari — Mentor misolidagi 1-muammodan; takrorlanmasa savol pilot natijasidan qayta yoziladi, ✔ o'rni C qoladi. A-4 ⛔ ro'yxati kengaydi: 4-ekran savoli, qisqa takrorlash, Pro Once tavsifi. |
| 3 | «Buzildi» o'quvchining erkin «Nima kutdim» iga bog'langan — talabdagi kutilgan holat ko'rinsin | **Qabul** | Eng muhim pedagogik topilma. 2-amaliyot kartasida «Nima qildim» ostida kulrang **«Talab bo'yicha: …»** (`USULLAR[i].talab`, 3, 4-dars va bugungi 1-amaliyot talabidan): ikki marta — bir yozuv, qulaylik bir marta · kech — javobgacha «To'lov o'tmadi» yo'q, kelgach ilovada ko'rinadi · rad — qulaylik yoqilmaydi, «To'lov o'tmadi — qayta urinib ko'ring» · imzo — `401`, yozuv yo'q. Qoida (o'quvchi matnida): «**Buzildi** — ko'rganingiz «Talab bo'yicha» qatoridan farq qilsa». ✎, O'qituvchi eslatmasi, KOD 2, 7, chek-ro'yxat 7, tayanch 9.51. Kalit shakli o'zgarmadi (talab — qat'iy matn, kalitga yozilmaydi). |
| 4 | 70 soniyalik kechiktirish so'rov umriga bog'liq — pilotdan oldin muhrlanmasin | **Qabul** | ⛔ bor edi (Shubhali 3, REPO 4). Qo'shildi — **zaxira mexanika** (REPO 2, Shubhali 3): so'rov 70 soniya ochiq tura olmasa — Backend sahifaga darhol `202 { kutilmoqda: true }`, xabarni 70 soniyadan keyin o'zi yuboradi; imzo va webhook tekshiruvlari bir xil; qaysi biri — pilotda. |
| 5 | «Uxlagan Backend o'rnida» — juda kuchli; bu faqat mashq | **Qabul** | 2-ekran `QIzoh`: «"Kechiktirib yuborish" — mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi.» (113; tayanch 1.5 gapi so'zma-so'z ichida) · kartochka 3 izohi · arena 2 «nimaning o'rnida?» → «nimaning mashqi?» (✔ o'zgarmadi) · A-4 halol chegara. |
| 6 | `GET /men` oxirgi to'lov manbai — eng oxirgi boshlangan to'lov → `tolovlar` | **Qabul** | Mentor Yordami 1), A-4, REPO 2, TS 9: «shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi `tolovlar` da `tolandi` yoki `rad` — shu holat; `tolovlar` da hali yo'q — `kutilmoqda`» (faqat `tolovlar` ning oxirgi qatori yetmaydi — kech xabar hali yozilmagan). 2-amaliyot Neon so'rovi `WHERE oyinchi_id = {hisob raqami}` bilan. |
| 7 | Har urinish yangi to'lov raqami — saqlang | Allaqachon | A-4, 2-ekran «Pro yo'q — yangi to'lov raqami». |
| 8 | Boshlangan to'lov raqami taxmin qilib bo'lmaydigan bo'lsin; `m-131` — faqat ko'rinish | **Qabul** | Raqamning o'zi 4-darsda tasodifiy (F-1007-462, tayanch 9.7). Namunalar `m-131…m-134` → `m-c41e…`, `m-9b07…` (0, 2-ekran, A-6, TS 10). |
| 9 | Mashq tugmalari haqiqiy foydalanuvchilarga ochiq bo'lmasin | **Rad** | **GATE M M-q3 A** («test rejimda hamma hisob»). Auditor sababi (`tolovlar` va Pro ma'lumoti aralashadi) — hisobotda aytildi. |
| 10 | Noto'g'ri imzo Backend'da yasaladi, kalit chiqmaydi | Allaqachon | Auditor qabul qildi. |
| 11 | Takror tuzatishi atomik bo'lsin, lekin 5-darsgacha ataylab buzilmasin | Allaqachon | Atomiklik — 4-dars talabida (F-1007-462) va `05-done` da; «ataylab emas» — 1-band. |
| 12 | «Kutish tugadi — to'lov o'tmadi emas» — saqlang | Allaqachon | 2, 5-ekran, kartochka 7, arena 7. |
| 13 | «Javob kutilmoqda» ikki joyda — sun'iy; Mentor ko'prigi kerak | **Qabul** | 1-amaliyot 4-qadam (1): «Bu — ilova; mashq sahifasi kech javobda nima deyishini 2-amaliyotda «Kechiktirib yuborish» bilan ko'rasiz.» Auditorning varianti («bugun shu farqni topasiz») olinmadi — o'quvchi mahsulotida farq bo'lishi oldindan ma'lum emas (va'da — sinf 5, 16). |
| 14 | «Qayta tekshirish» tugmasi — saqlang | Allaqachon | — |
| 15 | `AppState` qaytishi — Android Expo Go va web alohida pilot | **Qabul** | Shubhali 5 da bor edi; REPO 4 pilot ro'yxatiga «va web-trekda (brauzer oynasiga qaytish)» qo'shildi. |
| 16 | Pro tugashi 4 va 5-darsda ikki xil — bittasi kanonik bo'lsin | **Qabul** | Kanonik: Backend `pro` 4-darsdan muddatga qaraydi (`pro_gacha > now()`, 04 A1 talabi); 5-dars — ilova va «Doimiy o'yin» xatti-harakati. A-4 (3), o'quvchi talabi 2) «muddati tugaganda (Backend buni 4-darsdan biladi) ilova shunday ishlasin: …», Mentor Yordami 2), tayanch 9.51. |
| 17 | «Yangi o'yin yaratilmasligi» tekshirilmaydi — halol aytilgan | Allaqachon | — |
| 18 | `GET /oyinlar` yozuv yaratadi, takror yaratilish — hozirdan himoya | **Rad** | **M-q4 A** — takror yaratilish 12-darsning topilmasi; «sodda yechim» izohi 4-darsda (F-1007-462). |
| 19 | 2-amaliyotda kod yozilmaydi — kuchli | Allaqachon | — |
| 20 | `buzildi: null` | Allaqachon | — |
| 21 | «Tuzatish qilindi» — ish fakti | Allaqachon | — |
| 22 | Agent hammasini birdan tuzatishi mumkin | Allaqachon | — |
| 23 | Agent sababi — dalil emas | Allaqachon | — |
| 24 | Hookdagi «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067; 01-FILTR 11. |
| 25 | Ballsiz hookda ✔ ko'rinmasin | Allaqachon | J-026 (`correct: false` hammaga) — ekranda belgi yo'q edi; MD da aniq yozildi: «✔ — faqat MD belgisi». |
| 26 | 2-ekran «ikkitasi» — pilotdan keyin | Allaqachon | A-4 ⛔. |
| 27 | 5-ekran bashorati — saqlang | Allaqachon | — |
| 28 | «Sahifa va ilova adashtirdi» → aniqroq | **Qabul** | «Ha — foydalanuvchiga noto'g'ri holat ko'rsatildi» (48) · ikkinchi variant tenglashtirildi: «Yo'q — Pro oxiri yoqildi, demak to'lov ishladi» (46). |
| 29 | `BUZISH.md` so'zma-so'z | Allaqachon | — |
| 30 | Mashq qatorlari `rejim` bilan ajralsin | **Rad** | 03-FILTR 5, 04-FILTR 8: kursda real qator yo'q (Qaror-0 5, 6); mashq raqami `m-` bilan ajraladi (9.49). |
| 31 | `ishlaydi` — `null` | Allaqachon | F-1007-462; 5-dars «`true` bo'lmasa» o'qiydi. |
| 32 | `pm-m11d3-oqim` o'qilmasin | Allaqachon | TS 5 — auditor qabul qildi. |
| 33 | 70 soniya kutish tempni sindiradi | **Qisman** | Kutishda oldingi yozuvni o'qish — bor; o'lchanmagan — ⛔ taymer. |
| 34 | 90 daqiqa real emas — 125–160 | **Qisman** | O'lchanmagan baho — Shubhali 6 ga yozildi; pilotda oshsa qisqartirish — **sizning qaroringiz** (masalan, darsda ikki usul — ikki marta va kech). Oldindan kesilmadi. |
| 35 | Uyga vazifa yo'q | Allaqachon | — |
| 36 | Arena'da Payme — xavfsizlik testiga brend kerak emas | **Qabul** | Arena 3: «Haqiqiy to'lov sahifasida, kartangiz bilan» (42; ±15% OK, ✔ eng uzun emas) · TS 20 · arena izohi. |
| Sarl. | Sarlavhalar | Allaqachon | Auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–21 | — | 1 — Qabul ko'prik bilan (13) · 2–10, 12–17, 19, 21 — auditor qabul qildi (7 — 16 band; 9 — 6; 10 — 8) · 11 — Qisman (1) · 18 — Qabul (o'quvchi matnida qavsda: «chiqib qaytsangiz, ilova natijani qayta so'raydi») · 20 — Qabul (36). Holat qatorlari MD da. |
| TS+ | Auditorning yangi savollari 22–27 | Javob berildi | 22 → ataylab yo'q, alohida tarmoq ham yo'q; pilot natijasi · 23 → «Talab bo'yicha» qatori · 24 → foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi · 25 → `rejim` yo'q, `m-` raqam (9.49) · 26 → cheklov yo'q (M-q3 A) · 27 → zaxira: darhol `202`, 70 soniyadan keyin Backend o'zi yuboradi. |

## Sinf-supurish (12 MD + tayanch)
- **Muammoli boshlang'ich holat «aynan shu holatda» talab qilinadi** — 04 (REPO 3, Shubhali 7: «bo'lishi kerak» → «bo'lsa chiqadi, ataylab qo'yilmaydi») · 12 (`12-start` README eslatmasi — «holat ataylab yaratilmaydi, son pilotga moslanadi») · 10 (REPO 4: katta-kichik harf — «talabda yo'q, agentning tanlovi; Mentor agenti tenglashtirsa, 12-dars moslanadi») · tayanch 1.5, 3. Boshqa darslarda 0.
- **«Buzildi» hukmi erkin taxminga bog'liq** — 12-dars 1-amaliyoti (besh tekshiruv) xuddi shu sinf: «Nima kutaman» ipuchasi → «Talab bo'yicha: ekranda yoki Neon'da nima ko'rinadi?», 4-qadam «o'sha yo'l talabi bilan solishtirilgan («Nima kutdim» — talabdagi natija, taxmin emas)». To'liq «Talab bo'yicha» qatorlari 12-dars yo'llari uchun — 12-dars auditida (2-yo'l — o'quvchining asosiy harakati, umumiy matn bo'lmaydi). Boshqa darslarda buzish yozuvi yo'q.
- **Simulyatsiya haqiqiy hodisa sifatida** («o'rnida») — o'quvchi matnida faqat 05 da edi; 08 dagi «bepul Backend uxlab qolgan bo'lsa» — haqiqiy holat, sinf emas.
- **Oxirgi to'lov holati faqat `tolovlar` dan** — 06–12 da 0; 03, 04 dagi `ORDER BY yaratilgan DESC` — ko'rish so'rovi, holat manbai emas.
- **Brend xavfsizlik testining noto'g'ri variantida** — 0 (03 arena 6, 9 — Payme darsning o'z mavzusi, pul chegarasi testi emas).

## Tekshiruv
- `lint:til`: 05 — 0 error, 2 warn (zaxirada ham 2 — o'sha turlar) · 04, 10 TOZA · 12 — 0 error, 4 warn (o'zgarmagan) · tayanch — 0 error (warn turlari o'zgarmagan). Birinchi yurishda 05 da 1 error («o'z so'zingiz» — 76-qonun) va bitta hujjat-tili warn — tuzatildi.
- `qisqa.py`: 05 — 12 ekran, sarlavha >55 yo'q (arena ✔ harfsiz — qo'lda: A·B·C·D ×3, 12/12 ±15% OK) · 04, 10, 12 — zaxira bilan bir xil (12 dagi (356, 56) — oldindan bor, 12-dars auditida).
- Python `len`: `QIzoh` 113 (birinchi variant 124 — qisqartirildi), bashorat 46/48, arena 3 [42, 42, 40, 38] — O'lchov bo'limida yangilandi. ✔ o'rinlari o'zgarmadi.
