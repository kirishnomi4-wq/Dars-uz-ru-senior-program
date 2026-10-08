# 11-dars «Qaysi xalqaro dasturga ariza berasiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-569)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-11/`. Skript: scratchpad `f11_tuzat.py` (60 juftlik, har biri faylda aynan bir marta — skript tekshirgan; bitta uzunlik tuzatib qayta yurgizildi).
Audit bahosi 6.5/10 (uch «blocker»: 3-ekranda yosh yo'q; «boshqa dastur»ga Diamond shartlari yopishtirilgan; «hamma shart ✓» da'vosi). Hukm: **Qabul 27 · Qisman 1 · Rad 2 · Allaqachon 10** (40 band + sarlavha + 14 TS + 8 savol + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) 3-ekran savoli yosh sharti bilan scope qilindi (T14 ichida); (b) «boshqa dastur» uchun jamoa/maslahatchi/ro'yxat belgilari ✓/✕ emas — «?» (TS7 qisman rad); `jamoa` ga `'hali'` (tayanch 8); (c) 4-ekran sarlavhasi «ariza bera olasizmi?» → «bugun sizga mos yo'lmi?» va xulosa ikki gap (rasmiy fakt / kurs qarori); (d) 6-ekran sarlavhasi va bashorati «arizaga aynan ko'chadi» → «qoralamani pitchdan boshlash» (TS4 — kurs qoralamasi); (e) konsept va xalqaro dastur ta'riflari «bu darsda» bilan (TS10; tayanch 2 izohi); (f) 8-ekran savoli Diamond Challenge'ga scope; (g) reja sarlavhasi «ariza qoralamasini»; (h) 7-ekran `optionalLive` olindi. Tayanch 1.11 matni o'zgarmadi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 3-ekran savolida yosh yo'q — 10–13 yoshli o'quvchi uchun B himoyalanmaydi | **Qabul** | → «Yoshingiz Diamond Challenge'ga mos, mahsulotni yolg'iz qurdingiz. Endi nima qilasiz?» (10 so'z). 9.79. |
| 2 | «Boshqa dastur»da Diamond'ning 2–4 / maslahatchi ✓✕ mantig'i | **Qabul** | 7-ekran harakati ikkiga bo'lindi: Diamond — ✓/✕/?; boshqa — faqat «?» va «rasmiy sahifadan tekshiriladi»; 1-karta varianti «Boshqa dastur — shartini tekshiraman»; A-13, KOD 8, tayanch 8. 9.79. |
| 3 | Program Picked! — «dastur tanlandi» emas | **Qabul** | Tavsif → «Dastur yo'lini va jamoangizni belgiladingiz» (43); izoh. |
| 4 | Boshqa dastur yakun holati — rost, 7-ekran belgilari moslansin | **Qabul** | 2-band bilan. |
| 5 | «To'liq va shartlar ✓» — yosh, til, muddat saqlanmaydi | **Qabul** | A-1 holat ta'rifi, 7-ekran xulosa 1 → «Qoralama tayyor; yosh, til va muddatni uyda rasmiy sahifadan tekshirasiz.», varaq ostida kulrang qator, yakun 1-holat izohi. 9.79. |
| 6 | 4-ekran sarlavhasi «ariza bera olasizmi?» — huquqiy savol, javob esa tavsiya | **Qabul** | → «Y Combinator bugun sizga mos yo'lmi?» (36). 9.80. |
| 7 | Xulosa — rasmiy fakt va kurs qarori ajratilsin | **Qabul** | → «Sahifada yosh chegarasi yo'q; bu kursda to'liq vaqt va yuzma-yuz format sabab u bugungi yo'l emas.» (98); «Endi siz bilasiz» 3 «bu kursda». 9.80. |
| 8 | «O'qiyotgan odam» → «maktab o'quvchisi» kengaytirilmasin | **Qabul** | A-6 qatori va 4-ekran: «Sahifa: o'qiyotgan yoki ishlayotgan odam ham ariza berishi mumkin» — xulosa chiqarilmaydi. 9.80. |
| 9 | «Pitch bo'laklari arizaga aynan ko'chadi» — rasmiy forma xaritasi emas | **Qabul** | 6-ekran sarlavhasi → «Konsept qoralamasini pitchdan qanday boshlaysiz?» (48), bashorat «Qoralamaga nechta pitch bo'lagidan boshlang'ich gap olasiz?», Mentor gapi, harakat 1/3 «boshlang'ich gap sifatida», xulosa, dars ipi, kartochka 11, «Endi siz bilasiz» 4, A-4. 9.81. |
| 10 | Muammo va Yechim «aynan» majburiy emas | **Qabul** | 9-band bilan («keyin moslashtiriladi»). |
| 11 | Konsept ta'rifi — universal emas, kurs qolipi | **Qabul** | → «Bu darsdagi konsept qoralamasi uch narsani aytadi: muammo, kim uchun va yechim.» — A-4, 6-ekran `QIzoh`, kartochka 10 (savol ham), «Endi siz bilasiz» 4. 9.81. |
| 12 | «Xalqaro dastur» ta'rifi — «bu darsda» | **Qabul** | → «Bu darsda xalqaro dastur — ariza topshiriladigan va qatnashchilar tanlanadigan xalqaro tanlov yoki dastur.» — A-4, 2-ekran `QIzoh`, kartochka 1; tayanch 2 izohi. TS10. 9.81. |
| 13 | 8-ekran generic savol, Diamond-specific javob | **Qabul** | → «Diamond Challenge arizasini qanday topshirasiz?» (6 so'z). 9.79. |
| 14 | Uyga ③ — Diamond'ga shartli | **Qabul** | «Diamond Challenge'ni tanlagan va davom ettirmoqchi bo'lsangiz…; boshqa dastur bo'lsa — rasmiy shartini Mentor va ota-onangiz bilan tekshiring». |
| 15 | `royxat` — «shart bajarildi» ma'nosida emas | **Qabul** | «Ha» → «ro'yxatdan o'tilgan» (fakt), «Hali yo'q» → «?» neytral. |
| 16 | Maslahatchi «Hali yo'q» → ✕ emas | **Qabul** | → «?» (hali topilmagan — xato emas); A-13 izohi. 9.79. |
| 17, 18 | `jamoa: null` ikki holatni aralashtiradi | **Qabul** | `jamoa: 1 \| 2 \| 3 \| 4 \| 'hali' \| null` — A-13, KOD 8, 9, 13, tayanch 8. TS7. 9.79. |
| 19 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | Kurs qolipi (02/05/08/10-FILTR). |
| 20 | 1-ekran 02 «qaysi dastur sizga mos» — 10–13 yoshga rost emas | **Qabul** | → «Ikki dasturning shartlari sizga qanday mos kelishini solishtirasiz». 9.80. |
| 21 | 14 yoshga to'lmagan o'quvchini «Boshqa dastur»ga itarmaslik | **Qabul** | O'qituvchi eslatmasi qayta yozildi; 1-karta varianti nomi. 9.79. |
| 22 | Sanalar — bitta konstanta, MD da ko'paytirilmasin | Qisman | KOD 3: `DASTUR_SHART.diamond.sanalar` — bitta manba, hamma joy shundan; MD matnlari (o'quvchi ko'radigan) qoldi; ⛔ «qur» kuni qayta ochiladi. 9.82. |
| 23, 24 | Toshkent 03:00 — o'qituvchi eslatmasi · Diamond videosi 9-dars bilan bog'lanmaydi | Allaqachon | O'zgarishsiz. TS11, 13 ✓. |
| 25 | Business/Social yo'nalish maydoni — RAD | Allaqachon | Maydon yo'q edi; TS8 — RAD deb belgilandi. |
| 26 | Mentor yoshi to'qilmaydi — QAT'IY QABUL | Allaqachon | TS5 ✓. |
| 27 | Sinab ko'rganlar — jamoa a'zosi emas (UI qatori) | **Qabul** | 7-ekran 2-karta kulrang qatori. TS6. |
| 28 | «Siz taniydigan 21+» — rasmiy va kurs qoidasi aralash | **Qabul** | 3-karta savoli «Diamond Challenge uchun 21 yoshdan katta maslahatchi bormi?» (rasmiy), kulrang «kim bo'lishini ota-onangiz bilan» (kurs); Manbalar. 9.80. |
| 29 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067. |
| 30 | Hook — «har doim birinchi» demaslik | Allaqachon | O'zgarishsiz. |
| 31 | Reja sarlavhasi «ariza boshlaysiz» → «qoralamasini» | **Qabul** | → «Bugun shartlarni o'qib, ariza qoralamasini boshlaysiz.» (54). 9.82. |
| 32 | 3-ekran C «25 yoshli akam» — yangi son | **Qabul** | → «Katta yoshli akamni jamoaga qo'shib qo'yaman» (41); Izoh, Shubhali, A-8. 9.82. |
| 33, 34 | Arena rasmiy sonlari · «maktab o'quvchisi» tarjimasi | Allaqachon | O'zgarishsiz (⛔ yangilik darvozasi bor). |
| 35 | 5-karta raqam detektori — «raqam xato» qoidasi emas | **Qabul** | Xabar → «Asosiy javob — odamlarning roli; son pitchda qoladi.» (52). 9.81. |
| 36, 37 | «Konseptda son bo'lmaydi»ga aylanmasin; Muammo gapidagi 5/4 qoladi | **Qabul** | A-8: «Bozor sonlari Kim uchun qatoriga ko'chmaydi — Muammo gapidagi 5 dan 4 qoralamada qoladi»; kartochka 11 izohi. 9.81. |
| 38 | 8-ekran D — ethical distraktor | Allaqachon | O'zgarishsiz. |
| 39 | «Maslahatchi va ota-ona» — rasmiy shart va kurs qoidasi ajratilsin | **Qabul** | To'g'ri izohi → «Maslahatchi — rasmiy shart; ota-ona bilan — kurs qoidasi.» (57); «Endi siz bilasiz» 5. 9.80. |
| 40 | 90 daqiqa — 95–115; 7-ekran `optionalLive` bo'lmasin | **Qabul** / Qisman | `optionalLive` olindi (asosiy artefakt), arena va kartochkalar uyga; A-14 ga auditor bahosi ⛔. 9.82. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; 4, 6-ekran va reja | **Qabul** | 6, 9, 31-bandlar. |
| TS | 1 ✓ (⛔ «qur» kuni, 22) · 2 ✓ · 3 ✓ · 4 ✓ (kurs qoralamasi — 9) · 5 ✓ · 6 → 27 · 7 → 2, 17 · 8 ✓ (maydon yo'q) · 9 ✓ · 10 → 12 · 11 ✓ · 12 ✓ · 13 ✓ · 14 ✓ | | Savollar 15–22: 15 → 1 · 16 → 2 · 17 → 5 · 18 → 6 · 19 → 9 · 20 → 11 · 21 → 13 · 22 → 17. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 ✓ · 10 ✓ (`optionalLive` olindi; 90 daqiqa ⛔).

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (3-ekran savol 10 so'z, C 41; 4-ekran sarlavha 36, xulosa 98; 6-ekran sarlavha 48, xulosa 88, `QIzoh` 78; 2-ekran `QIzoh` 106; 8-ekran savol 6 so'z, to'g'ri izoh 57; reja 54; nishon 43; detektor 52).

## Sinf-supurish (13 MD + tayanch, grep)
- **`pm-m12d11-dastur` o'quvchilari** — 12 MD: `dastur` va `maslahatchi` ni o'qiydi; `'boshqa'` ni «11-darsdagi dasturingiz» deb ko'rsatadi — 12-dars auditida (auditor 20-bandi) moslanadi; `jamoa` ni o'qimaydi (`'hali'` ta'sirsiz).
- **«ariza boshlaysiz» / «ariza berasiz»** — dars nomi (menyu, DE-205) o'zgarmaydi; faqat reja sarlavhasi qoralama deb aytildi.
- **Rasmiy fakt ↔ kurs qarori ajratish** — 10 (profil qoidasi — 10-FILTR 21), 11 (YC, maslahatchi); 12 MD Diamond muddatini o'qiydi — 12 auditida.
- **Universal ta'rif → «bu darsda»** — 08 (final pitch), 09 (video-portfolio), 10 (frilans), 11 (konsept, xalqaro dastur) — bir naqsh.
- **Tayanchdan tashqari son testda** — 10 («bir hafta», «o'nta» olindi), 11 («25» olindi).

## Tekshiruv
`lint:til` 11, tayanch — TOZA / 0 error · `mdtekshir.py` 11 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
