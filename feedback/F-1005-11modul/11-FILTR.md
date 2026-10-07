# 11-dars «Loyiha kuni: 1-asosiy funksiya» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 7/10 (pedagogika 9 · talab yozish zinapoyasi 9 · texnik aniqlik 6.5 · o'z mahsulotiga ko'chirish 6 · 90 daqiqaga sig'ishi 5.5). Hukm: **Qabul 16 · Qisman 3 · Rad 4 · Allaqachon / o'zgarishsiz 13** + o'z topilmam 1.
Tekshirilgan manbalar: MD o'zi (grep) · `GATE_M_JAVOB.md` (**11-q0 A** — Neon `UPDATE` qoladi) · tayanch 4 (blok modeli, «trek farqi — bir gap»), 9.29, 9.31, 9.32, 9.35, 9.36, 9.74, 9.76, 9.77, 9.81 ·
8-dars MD (web-trekda «Yangilash» tugmasi) · 12, 14-dars MD (web gapi, `holat` o'tishlari) · `QOIDALAR.md` T-028, T-038, T-067.
Zaxira: scratchpad `md11/` (11–14, tayanch).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Uch blok (yaratish → harakat → yangilanish) — har o'quvchi funksiyasiga mos emas | **Qabul** | Bloklar — Mentor misoli: A1 «Ochish» «Mentor misolida: 1 — e'lon berish · 2 — qo'shilish · 3 — ekran yangilanishi. Funksiyangizda yangisini qo'shish bo'lmasa — bu blokda uning birinchi ko'rinadigan qismini quring.» · A1 sarlavhasi **«Funksiyangizning birinchi qismi telefonda ishlasin.»** (51) · vazifa va yashil qator umumiy; tayanch 9.86. MD TS 8 yopildi. |
| 2, 9, 18, 26, 28, 34, 35 | Talabda holatlarni yozish · 2-ekran (egasi tokendan) · 4-ekran (ikki telefon) · uch qator o'quvchidan · Yordam Mentorniki · «Ali» · tashkilotchi — token egasi | O'zgarishsiz | Auditor tasdiqladi. |
| 3 | Hookdagi «10 / 10» — umumiy agent xulqi bo'lib qolmasin | Allaqachon | Javoblar va Mentor «bu misolda», «Mentor misolida» bilan chegaralangan; kartochkada «taxmin qilishi mumkin». |
| 4 | Hookda «Qiziq fikr!» | **Rad** | QOIDALAR T-028, T-067 — kurs qonuni (tayanch 9.76). |
| 5 | Ikki marta qo'shilishni faqat Backend tekshiruvi bilan himoyalash yetmaydi | **Qabul** | A2 «Yordam» talabiga: «Bitta o'yinchi bitta o'yinda bir marta yozilsin — Database qoidasi bilan ham.»; A-bo'lim, REPO; tayanch 9.83. O'quvchi matniga SQL atamasi kiritilmadi. |
| 6 | Ikki `409` — xabarlar farqli bo'lsin | Allaqachon | «O'yin to'ldi» · «Siz bu o'yinga qo'shilgansiz» (tayanch 9.32). |
| 7, 8 | `GET /oyinlar` javobi kanonik bo'lsin; `/:id` kerak emas | Allaqachon | Tayanch 9.29 (06.10 01:51) — `qoshilgan`, `menQoshilganman` va «`/:id` yo'q»; MD TS 5 yopildi. |
| 10 | «Token kim yuborganini aytadi» | **Qabul** | 2-ekran joriy qatori: «Backend tokendan kirgan o'yinchini taniydi va e'lon egasini shundan yozadi.» |
| 11 | Bo'sh maydonni Backend ham qabul qilmasin | **Qabul** | A1 «Yordam»: «… — Backend yozmasin (`400`), ilova nima yetmaganini aytsin.» (9.32). |
| 12 | A1 SQL tekshiruvi `ORDER BY id` | **Qabul** | `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` — «birinchi qator sizning e'loningiz» (9.29). |
| 13, 14 | «9 namuna o'yinchi» va 8 + 6 + 4 + 9 = 27 — chalkash; o'quvchi o'zi namunaga tushib qolmasin | **Qabul** | A2 «Yordam»: «9 ta namuna o'yinchi qo'sh (kirgan o'yinchi ular qatorida bo'lmasin) va ulardan qo'shilishlar … — bitta namuna o'yinchi bir necha o'yinda bo'lishi mumkin»; REPO «jami 27 qator». |
| 15 | A2 tekshiruvi (3) «tez ikki bosish» Backend himoyasini isbotlamaydi | **Qisman** | O'quvchi tekshiruvi qoladi (natija to'g'ri bo'lishi kerak); A2 izohiga: «natijani ko'rsatadi; ikkinchi bosishni ilova yoki Backend to'xtatganini ajratmaydi — Backend himoyasi 4-ekranda va Database qoidasida». |
| 16, 33 | `kerak = 6` — o'yinni to'ldirish emas, sig'imni kamaytirish | **Qisman** | Usul qoladi — **GATE M 11-q0 A** (foydalanuvchi qarori; bitta namuna o'yinchi bilan 10 / 10 yasab bo'lmaydi: 9 namuna o'yinchidan 6 tasi Shanba 20:00 da). So'z tuzatildi: A2 (4) va A3 (1) — «test holati: … kerakli odam sonini vaqtincha kamaytirasiz»; kartochka «Kerakli sonni vaqtincha kamaytirasiz, keyin qaytarasiz»; A-bo'lim va izohda «boshqa o'yinchi o'rnini bosadi» olindi; tayanch 9.85. |
| 17 | A3 sarlavhasi «boshqalar qilgani» — test bilan mos emas | **Qabul** | **«Ro'yxat yangilansin: Database'dagi o'zgarish ko'rinsin.»** (55). |
| 19 | O'quvchi matnida «bugungi tekshiruv ketma-ket bosish uchun» | **Rad** | O'quvchi matni bir vaqtdagi bosishni da'vo qilmaydi (4-ekranda bosishlar ketma-ket); qo'shimcha gap javobsiz savol ochadi, 14-dars — va'da (T-038). Chegara MD izohida bor. |
| 20 | (`oyin_id`, `oyinchi_id`) noyob — 12, 14 da ham buzilmasin | **Qabul** | Tayanch 9.83: keyingi darslarda holat shu qatorda o'zgaradi, yangi qator — faqat o'yinda hali yo'q o'yinchi uchun. 12 (`qoshildi` → `keladi`) va 14 (navbat — yangi o'yinchi) bunga mos (grep). |
| 21, 22 | `qoshilgan` faqat `qoshildi` ni sanasa, 12-darsda `keladi` dan keyin joy «bo'shaydi» | **Qabul** | Qaror avvaldan bor — tayanch 9.74 (`qoshildi` yoki `keladi`); lekin 11-dars REPO `holat = 'qoshildi'` deb yozgan edi — **tuzatildi:** `holat IN ('qoshildi', 'keladi')`, «O'yin to'ldi» tekshiruvi ham shu sanoqdan. |
| 23 | A3 web-trek brauzerning pastga tortishiga tayanadi | **Qabul** | 8 va 12-darslarda web-trekda «Yangilash» tugmasi bor edi — 11-dars ulardan farq qilardi. A3 web gapi: «pastga tortish o'rniga «Yangilash» tugmasi — sahifa ochilganda va shu tugma bosilganda `GET /oyinlar` dan qayta olinsin»; vazifa va tekshiruv (1) ham; tayanch 9.84. **Sinf-supurish:** 14-dars A3 web gapi — xuddi shunday tuzatildi. |
| 24 | `pm-m9d8-platforma` yo'q bo'lsa ikkala qator — yaxshi emas | **Rad** | M-q5 naqshi (10, 12, 14-darslar bilan bir); har qator trek nomi bilan boshlanadi; kalit 9-darsda ham yoziladi (9.77). |
| 25 | Har blokda to'liq web Yordam prompti | **Rad** | Tayanch 4: trek farqi — «Yordam»da bir gap; Backend qismi ikkala trekda bir xil, talabni o'quvchi o'zi yozadi. 10-darsda to'liq web prompti — faqat ilovani Backend'ga ulash bloki uchun (9.82): CORS, token joyi — bugun ular tayyor. |
| 27 | `{nima qilsin}` ostidagi savol — bitta ipuchada 4 savol | **Qabul** | «Bosilganda nima bo'lsin — Backend'da va ekranda? Qachon bo'lmasin?»; MD TS 7 yopildi. 12, 14-darslarda bu matn yo'q (grep). |
| 29, 30 | 90 daqiqa zich; ikki deploy | O'zgarishsiz (sinov) | A1 va A2 deploylarini birlashtirish — har blok alohida tekshiriladi (auditor ham shuni aytgan). Blok vaqti — 10-dars sinovida (o'sha tuzilma, Render bilan) taymer bilan o'lchanadi; A3 da Backend o'zgarmaydi. |
| 31 | «Expo Go o'zi qayta yuklaydi» — kafolat | **Qabul** | «odatda o'zi qayta yuklaydi, bo'lmasa — `r`» (A1, A2, A3). |
| 32 | Agentga xato yuborishda `.env` qiymatlari | **Qabul** | Uch blokda: «Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlarini emas): …» (9.81). **Sinf-supurish:** 12 (3 joy), 13 (1), 14 (3) — tuzatildi. |
| 36 | Yakun — holatga qarab | **Qabul** | A3 — «Birinchi funksiya ishlayapti: talabni siz yozdingiz.» · A2 — «Asosiy harakat ishlaydi — yangilanish qoldi.» · A1 — «Birinchi qism ishlaydi — asosiy harakat qoldi.» · yo'q — «Birinchi funksiya boshlandi — qolgan qadamni tugating.»; belgi faqat A3 da. |
| TS 4 | Tashkilotchi «0 / N» — «tayanchda yo'q» | Allaqachon | Tayanch 9.31. |
| O'z topilmam | A3 web-trekda «`npm run dev`» | Tuzatildi | Telefon laptopdagi `localhost` ni ochmaydi (9-dars hooki) — telefonda tekshirish uchun web-trekda `git push`, Netlify saytni o'zi yangilaydi. |

**MD TAYANCHGA SAVOL holati:** 1 — GATE M 11-q0 A + 9.35 · 2 — 9.36 · 3, 5 — 9.29 · 4 — 9.31 · 6 — 9.32 · 7, 8 — shu Filtr · 9 — ochiq (sinov taymeri).

Tekshiruv: `lint:til` 11 — toza; 12, 13, 14 — 0 error (ogohlantirishlar avvalgidek: 2 · 6 · 2) · o'zaro tekshiruv 11–14 — arena 3/3/3/3 («skelet» — MD izohidagi atama, o'quvchi matni emas).
