# MD v3 agenti — umumiy topshiriq (12-Modul, konveyer 1-bosqich, 06.10.2026)

Siz LMS 12-Modul «Real vaqt: WebSocket + ishga tushirish» (kod `src/10-Modull`, kalit `m10-NN`) ning BITTA darsi uchun MD v3 yozasiz:
o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi.
Suhbatda va MD da modul LMS raqami bilan aytiladi («12-Modul 3-darsi», «11-Modulda»); kod raqami (`m10-03`, `src/10-Modull`) — faqat fayl yo'li va kalitda. O'quvchi matniga kod raqami ko'chmaydi.
Bu modulda tezlik emas, sifat: 11-Modulda tashqi audit har darsdan 10–22 band qabul qilgan, ko'pi bir xil sinflar edi — ular tayanch 7-bo'limda. Sizning MD ngiz shu sinflardan **birinchi kundanoq** toza chiqishi kerak.

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1006-12modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari (Qaror-0, 25 band), MAJBURIY.
2. `feedback/F-1006-12modul/00-MODUL-TAYANCH.md` — misol-ip «Maydon Jamoa» (1.0–1.13), atamalar (2), repo va teglar (3), darslar jadvali (4), keyslar (5), tekshirilgan faktlar (6),
   **oldindan tuzatiladigan sinflar (7)**, saqlash kalitlari (8), to'lqin kelishuvlari (9 — bo'sh bo'lmasa MAJBURIY). Nom, raqam, so'z — AYNAN shunday.
3. `feedback/F-1006-12modul/00-TAQIQLAR.md` — **nima mumkin emas** (MAJBURIY).
4. `feedback/F-1006-12modul/00-NOMLAR.md` (dars nomlari, menyu osti, oldingi/keyingi dars) · `00-MANBA.md` (dastur jadvali, o'tilgan atamalar, rasmiy iqtiboslar).
5. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
6. `konveyer/QURISH_KARTASI.md` — T · P · S bo'limlari (PM darsda + PM). Har bandni ko'ring.
7. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgan qismi — mavzu so'zlari bo'yicha grep (lending, tugma, post, eslatma, sanoq, pitch, grafik, ulanish).
8. `src/qolip/QOLIP.md` — mavjud ekran turlari va maydonlari.
9. 11-Modul tayanchi `feedback/F-1005-11modul/00-MODUL-TAYANCH.md` — 1-bo'lim (mahsulot, ekranlar, yo'llar), 2 (atamalar), 9.2 (namuna o'yinlar), 9.29 (`GET /oyinlar` javobi), 9.74, 9.81–9.96 — 12-Modul shularning ustiga quriladi.
10. Eng yaqin namuna — tayanch 4-bo'lim jadvalining oxirgi ustuni (11-Modul yoki 10-Modul MD v3) **va o'sha MD ning `NN-FILTR.md` fayli** (audit aynan shu turdagi darsda nimani topgani). Tuzilish, hajm, uslub uchun; matn ko'chirilmaydi.
11. `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` (1–18) va `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` «C» qismi (19–31; 🔴 — qat'iy): MD da har ekranni shunga mos loyihalang.
Qonun fayllari (`PM_DARS_ETALON.md`, `DARS_ETALON.md`, `PM_Prompt_v8.md`, `QOIDALAR.md`) katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling.
O'tilgan atama — grep (`feedback/F-0928-QA-5modul/YAKUNIY/`, `feedback/F-0929-QA-6modul/YAKUNIY/`, `feedback/F-1005-9modul/*-v3.md`, `feedback/F-1005-10modul/*-v3.md`, `feedback/F-1005-11modul/*-v3.md`, `src/`).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1006-12modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, repo, qonun, konveyer, boshqa MD, tayanch, boshqa modullar).
  Yordamchi fayllar (o'lchov skripti, qoralama) — **faqat scratchpad'dagi o'z papkangizda** `md<NN>/` (topshiriqda yo'li berilgan).
- Format — `konveyer/1-MD.md` «Format»: sarlavha qatori, Fayl/ekranlar soni, A-bo'lim (tayanch, atamalar, misol-ip, bitta vizual, **vaqt taqsimoti**), darsning ipi,
  har ekran (`## N · nom ← QOLIP TURI`, eyebrow, sarlavha + belgilar soni, Mentor, tur maydonlari, «Harakat → Vizual o'zgarish», xulosa), keyin
  Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12; alohida ekran, Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →») ·
  Yakun (chip, sarlavha **holatga qarab**, «Endi siz bilasiz» 3–5, uyga vazifa, «Keyingi dars — «…»») · «KOD» belgilari (qolipda yo'q, kod kerak bo'ladigan joylar).
- Ekranlar: tayanch 4-bo'lim (PM ≈15–16 · TEX 18–20 · PM+PRAKT 12 · loyiha kuni 12 · 11-dars 12). Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q.
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til, kantselyarit va sheva yo'q. Apostrof — oddiy `'`. O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno).
  Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 («Aynan!» / «Qiziq fikr!» bilan birga) · xato izohi ≤60.
- Har harakatli ekranda: o'quvchi birinchi nimani bosadi — aniq (faol element), Mentor gapi aynan shu harakatni aytadi; bashorat tanlangach yopilmaydi («Harakat → Vizual o'zgarish» qatorida yozing).
- Testlar: 4 variant uzunligi teng (±15%), kalit so'z / tire / strelka / qavs faqat to'g'ri variantda emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz; distraktor haqiqiy hayotda rost bo'lib qolmasin.
- **Keys** — faqat tayanch 5-bo'limda darsingizga berilgani: bank matni va brend izohlari aynan; keyssiz dars keyssiz qoladi. Bank matnining ruscha asli — `PM_Prompt_v8.md` (grep «К3», «К8» …): so'zni toraytirmang ham, kuchaytirmang ham.
- **Mentor misoli** — «Maydon Jamoa»; raqam, ekran yozuvi, hodisa nomi, post va jonli xabar matni — faqat tayanch 1-bo'limdan, «Mentor misolida» deb. O'quvchining o'z mahsuloti — har darsning amaliy qismida (o'z mahsuloti, o'z repo'si, o'z treki).
- **Amaliy qism** (bloklar, VS Code topshirig'i): tayanch 4 «Amaliyot bloki» — 4 qadam o'quvchining o'z repo'sida, `{…}` joylari, kutilgan natija «namuna: Maydon Jamoa», «Yordam» — Mentor misolidagi to'liq prompt, «Ortda qoldingizmi» (tayanch 3). Har blokda mobil va web yo'li.
- **Tashqi xizmatlar** (Expo, EAS, socket.io, NestJS, Render, Netlify, Neon, Umami, GitHub, Telegram, Instagram, Android, iPhone): tayanch 6 va `00-MANBA.md` 5 dagi iqtiboslar yetmasa — rasmiy hujjatdan o'zingiz tekshiring (WebFetch / WebSearch),
  manba havolasi va sanani MD «Manbalar» bo'limiga yozing; tekshirib bo'lmasa — umumiy so'z bilan yozing va «Shubhali joylar» ga qo'shing. Tugma va menyu nomini, narxni, limitni, vaqtni **taxmin qilmang**.
- Tayanchda yo'q tafsilot kerak bo'lsa — o'zingiz qaror qilasiz, lekin MD oxiridagi **«TAYANCHGA SAVOL»** ro'yxatiga yozasiz (nima, nega). Boshqa darslarga tegadigan nom, son yoki so'zni o'ylab topmang — savol qilib yozing.

## MD oxirida majburiy bo'limlar (shu tartibda)
1. **KOD** — qolipda yo'q, kod kerak bo'ladigan joylar.
2. **Manbalar** — o'zingiz tekshirgan rasmiy sahifalar (havola, sana, bir qator iqtibos).
3. **TAYANCHGA SAVOL** — o'zingiz qaror qilgan har tafsilot.
4. **Shubhali joylar** — ishonchingiz komil bo'lmagan matn va tekshirilmagan qadamlar. Yashirmang.
5. **Oldindan tuzatiladigan sinflar — o'z tekshiruvim** — tayanch 7-bo'limning 14 bandi, har biriga: `[x]` + bu darsda qayerda qo'llangani (ekran raqami) yoki `[—]` + nega bu darsga tegmasligi.
6. **O'lchov** — o'z skriptingiz natijasi: har sarlavha, xulosa, hook javobi, xato izohi uzunligi; test variantlari uzunligi (eng uzun / eng qisqa); arena ✔ taqsimoti.
7. **GATE M — o'z tekshiruvim** — `konveyer/1-MD.md` ro'yxati, `- [x]` / `- [ ]` + nega.

## Tekshiring
`npm run lint:til feedback/F-1006-12modul/<fayl>` — 0 error bo'lguncha tuzating (warn lar — ko'rib chiqing, kerak bo'lsa hisobotda sababini ayting).
Yozib bo'lgach MD ni boshidan oxirigacha **bir marta qayta o'qing** — auditor ko'zi bilan: har da'vo chegaralanganmi, har son tayanchdami, har tashqi qadam manbalimi.

## Hisobot (oxirgi xabaringiz, ≤25 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL ro'yxati (qisqa) · shubhali joylar · 14 sinfdan qaysi biri eng qiyin bo'lgani va nega.

MD ni foydalanuvchi o'qiydi va ChatGPT auditiga beradi: har da'vo aniq, chegaralangan va tayanchga mos bo'lsin. Shoshilmang — bitta sifatli MD ikki marta tuzatilgan MD dan arzon.

---

# 1-to'lqin — pilotlar (3 dars; har agentga o'z qatori)

| № | Fayl | Tip · ekran | Oldingi → keyingi dars | Tayanch bo'limlari | Keys | Kalit (o'qiydi → yozadi) | Kod mexanikasi | Namuna (MD + uning FILTR i) |
|---|---|---|---|---|---|---|---|---|
| 1 | `01-PmLanding-v3.md` | PM · ≈15–16 | «Demo Day 7» → «WebSocket: ekran o'zi yangilanadigan ulanish» | 1.0 · 1.1 · 2 (lending, asosiy tugma, sahifa matni, foyda, besh soniyalik sinov) · 3 (teg 01) · 5 (K3) · 6 (Umami) | K3 Instagram | `pm-m9d4-final`, `pm-m9d5-prd` → `pm-m10d1-lending` | VS Code topshirig'i: `lending/` + Netlify | 11M `01-PmTenIdeas-v3.md` + `01-FILTR.md` · 11M `05-PmPrd-v3.md` + `05-FILTR.md` |
| 2 | `02-WebSocketBasics-v3.md` | TEX (cho'qqi) · 18–20 | «Mahsulotingizni bir sahifada qanday tanishtirasiz?» → «Ekran o'zi yangilanishi uchun nimani yozasiz?» | 1.0 · 1.2 · 2 (real vaqt, doimiy ulanish, WebSocket, socket.io, hodisa, tinglovchi, ulanish holatlari) · 3 (teg 02) · 6 (Render, NestJS, socket.io) | keyssiz | `pm-m9d8-platforma` → `pm-m10d2-sxema` | kod oynasi (tinglovchi yozish) + 2 repo bloki (A1 tayyor talab + 2–3 joy · A2 tayyor talab + 1–2 joy) | 11M `08-PlatformChoice-v3.md` + `08-FILTR.md` · 10M `02-EventTracking-v3.md` + `02-FILTR.md` · 10M `03-LiveDashboard-v3.md` (polling ko'prigi) |
| 7 | `07-PmFiftyUsers-v3.md` | PM+PRAKT · 12 | «Birinchi foydalanuvchilar sizni qayerdan topadi?» → «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» | 1.0 · 1.6 (kanallar, post, xavfsizlik qoidalari — o'tilgan deb) · 1.7 · 1.13 · 2 (bosqich, ro'yxatdan o'tgan, asosiy harakat, qurilma ID, APK, brauzer ko'rinishi, login) · 3 (teg 07) · 6 (EAS, brauzer ko'rinishi, Umami) | keyssiz | `pm-m10d6-kanallar`, `pm-m10d1-lending` → `pm-m10d7-reja` | 2 amaliyot bloki (A1 tayyor talab + bitta joy · A2 bitta qatorni o'quvchi yozadi) | 10M `06-PmTrustAudit-v3.md` + `06-FILTR.md` · 11M `13-PmAudienceTest-v3.md` + `13-FILTR.md` · 10M `02-EventTracking-v3.md` (`hodisaYoz`) |

## Pilotlarga xos eslatmalar
- **1:** dars markazi — matn yozish (sarlavha: kim uchun va nima foyda · uchta foyda · bitta tugma), kod emas. «Funksiyadan foydaga» mashqi va besh soniyalik sinov (juftlik + yakka rejim) — tayanch 1.1. Muammo gapi va yechim gapi 11-Moduldan o'qiladi (kalit yo'q bo'lsa — o'zi yozadi).
  Lendingda faqat hozir ishlaydigan narsa. Mobil trekda tugma — «Qanday qo'shilaman» bo'limiga; web-trekda — saytga. 2-Moduldagi «CTA» bilan bir gapli ko'prik. K3: «25 000» — o'quvchiga maqsad emas.
  Netlify qadamlari — umumiy so'z bilan yoki rasmiy hujjatdan; 9-Modulda o'quvchi Netlify'ga chiqargan (takror o'rgatilmaydi — eslatiladi). Umami hodisasi `qoshilmoqchiman` — yozilishi tayanch 6 dan.
- **2:** tushuncha tartibi — avval hodisa (ikki telefon: biri bosdi, ikkinchisida son o'zgarmadi), keyin «doimiy ulanish», keyin atama «WebSocket», keyin asbob «socket.io» (T-011). 10-Modul polling'i bilan bir gapli ko'prik (o'sha so'z: «qayta-qayta so'raydi»).
  Darsning bitta vizuali — ikki telefon va o'rtada Backend (hodisa uchib boradi). Real vaqt oqimi sxemasi — o'quvchi o'z mahsuloti uchun to'ldiradi (11-Modul 8-darsidagi real vaqt nuqtalaridan boshlab).
  2-darsda `oyin-ozgardi` hali **yuborilmaydi** (3-dars ishi) — A1 faqat ulanish va belgi, A2 — README sxemasi. Kod oynasidagi `ulanish` — namuna obyekt («haqiqiy Backend emas» izohi). React Native va gateway kodi — o'qiladigan qisqa bo'lak + telefon maketi.
  Kafolat yo'q: «ulanadi» emas — «belgi «Ulangan» bo'lishi kerak; bo'lmasa — …» (xato yo'li bitta gap). Render fakti (uyg'oq tutadi, yangi versiyada uziladi) — bir gap, 5-dars va'da qilinmaydi.
- **7:** real odamlar bilan ishlaydigan dars — TAQIQLAR 2-bo'lim to'liq. 6-dars o'tilgan deb olinadi (kanallar, birinchi post, xavfsizlik qoidalari — tayanch 1.6; `pm-m10d6-kanallar` yo'q bo'lsa — o'quvchi o'zi yozadi).
  12 ekran: kirish · reja · tushuncha (uch bosqichli reja; kutilgan son — taxmin) · test · tushuncha (ishga tushirishdan oldin uch tekshiruv: ma'lumot · o'lchov · havola) · mustaqil ish (o'z rejasi) · A1 (ma'lumot) · A2 (o'lchov va havola) · yakuniy test · podium · kartochkalar · yakun.
  Vaqt tig'iz — A-bo'limda aniq taqsimot va har blokda «ulgurmasangiz» yo'li; yakun holatga qarab (kamida to'rt holat). O'rnatish fayli 6-dars uyga vazifasidan tayyor keladi; tayyor bo'lmasa nima bo'lishi — MD da yozilgan bo'lsin.
  Brauzer ko'rinishi (iPhone yo'li) — hujjatdan, qurilmada sinalmagan: «Shubhali joylar»ga. «20 foydalanuvchi» — Mentor misoli; o'quvchiga me'yor emas, sinfdoshlar alohida sanaladi. 50 ga yetish va'da qilinmaydi.
