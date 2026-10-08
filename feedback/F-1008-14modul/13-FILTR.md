# 13-dars «Demo Day'ga tayyormisiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-571)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-13/`. Skript: scratchpad `f13_tuzat.py` (63 juftlik + 4 qo'lda, har biri faylda aynan bir marta — skript tekshirgan; bitta uzunlik tuzatib qayta yurgizildi).
Audit bahosi 6.5/10 (to'rt «blocker»: tayyorlov reload'da yo'qoladi; bitta laptopda hakam taymeri; «Tekshirib aytaman» yashirin; 3 savol talab qilinmaydi). Hukm: **Qabul 33 · Qisman 2 · Rad 1 · Allaqachon 14** (50 band + sarlavha + 17 TS + 7 savol + 11 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) tayanch 1.13 «Backend uyg'otildi» → «demo yo'li ochildi» (xatti-harakat); `tayyorlov` kalitda (TS2 RAD); (b) sxema: `savolJavobTugadi`, `boshqa:1..3`, `tur`, `tayyorlov` (tayanch 8); (c) «B reja» belgisi — faqat video ko'rsatilganda (A-4); (d) «Navbatim kelmadi» — faqat Mentor favqulodda yo'li, «4-kishi uyga» RAD (TS7); (e) hakam taymeri — hakam qurilmasida (⛔ pilot); (f) «Keyingi bo'lak» 13 da ham olindi (08 bilan bir); (g) Ready Check! → Four Checks!; (h) «30 soniya» qoidasi olindi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 5-ekran tayyorlov faqat `ccProgress` — reload'da yo'qoladi | **Qabul** | `tayyorlov: { backend, video, namuna, qurilma }` kuzatilgan qiymatlar bilan kalitda — 5-ekran Saqlash, A-12, KOD 8, tayanch 8. TS2 RAD. 9.87. |
| 2 | Bitta laptopda hakam taymeri — hakam gapiruvchi laptopini boshqaradi | **Qabul** (⛔) | «Pitchdan oldin»: taymer va savollar — hakam qurilmasida (hakam rejimi), zaxira — ikkinchi oyna; KOD 4, Shubhali 3 — ⛔ pilot. 9.88. |
| 3 | «To'xtamasdan» — oyna almashmaslik emas | **Qabul** | A-5: chiqish boshidan boshlanmaydi, taymer to'xtamaydi; oyna almashish, hakam tugmasi — to'xtash emas. 9.88. |
| 4, 5 | 1 savoldan keyin «Davom etish» — 3 savol mashqi emas | **Qabul** | «Davom etish» — 3 savoldan keyin; fallback «Savol-javob tugamadi» (`savolJavobTugadi: false`); yakun «Pitch o'tdi — savol-javob {n}/3 da qoldi»; 6-ekran xulosa; A-11, KOD 9, A-12. 9.87. |
| 6 | «Tekshirib aytaman» top-state'ga tushmasin | **Qabul** | Yakun: «ochiq savol qolmadi» (nishon) / «tekshiriladigan savol qoldi» (✓, nishonsiz) / «tuzatiladigan joy bor»; 7-ekran xulosa ham; Shubhali 6 yopildi; O'qituvchi eslatmasi. 9.87. |
| 7, 8, 9 | Tekshiraman — accent · «tegmadi» yorlig'i · izoh maydoni yo'q | Allaqachon | O'zgarishsiz. |
| 10 | 7-ekran sarlavhasi yakka rejimda yolg'on | **Qabul** | `tur` ga qarab: «Mashq varag'iga qanday belgi qo'yasiz?» (39). |
| 11, 12 | `tur: 'hakam'` Mentor+mehmon · hakam va guruh bir evidence | Allaqachon | O'zgarishsiz. |
| 13, 14 | Guruh rotatsiyasi core; «4-kishi uyga» RAD; «Navbatim kelmadi» learner bosmasin | **Qabul** | Parallel guruhlar — hamma chiqadi; «Navbatim kelmadi» — faqat Mentor rejimida yoqiladigan favqulodda yo'l; A-11, 6-ekran tugmalari, KOD 9, Shubhali 1, RAD ro'yxati. TS7. 9.89. |
| 15, 16 | Uyga ② majburiy tanish odam; faqat qolgan ish bo'lsa | **Qabul** | ② shartli (varaqda tuzatiladigan joy yoki tugamagan), «Xohlasangiz tanish odam; bo'lmasa taymer bilan yakka»; Kim bilan yorlig'i. 9.89. |
| 17 | Ready Check! — «tayyor» deb o'qiladi | **Qabul** | → Four Checks! (`fourChecks`); 5-ekran, nishonlar, KOD 13, TS16. 9.90. |
| 18 | «{k} tasi tayyor» hisobi aniq bo'lsin | **Qabul** | 5-ekran Saqlash izohi: tayyor = ochildi · ochildi · namuna · telefon/quvvat; boshqa-oyna — zaxira, video yo'q — og'zaki yo'l. |
| 19, 20 | B reja faqat video; og'zaki = «Ishlamadi»; 2-ekran xulosa absolut | **Qabul** | A-4 belgilar, 5-ekran 2-karta qatori, 2-ekran xulosa («video bo'lsa B reja, bo'lmasa og'zaki»), kartochka 5, «Endi siz bilasiz» 3, 7-ekran O'qituvchi eslatmasi. 9.88. |
| 21 | 4-ekran «video tayyor» scope — saqlang | Allaqachon | O'zgarishsiz. |
| 22, 23 | Render 15/1 daqiqa — xatti-harakat; «Demo yo'li ochildi» | **Qabul** | 5-ekran 1-karta «demo yo'lingizni oching va ro'yxat chiqqanini ko'ring», «Ochilmadi» qatori sonsiz; 6-ekran «navbat uzoq cho'zilsa»; Yordam; kartochka 9; A-7; tayanch 1.13. 9.90. |
| 24 | `otishVaqt > 90` ogohlantirish — 6-dars semantikasi | Qisman | 06-FILTR 38 da `otishVaqt` = demo o'tishi soniyasi (muhrlangan); 6-ekran qatori ogohlantirishdan ma'lumotga («6-darsda {s} soniya edi — bu mashqda Yechim 90»). TS17. |
| 25 | 8-dars savollari matn bilan solishtirish — RAD, id | Allaqachon (08-FILTR 7) | 13 endi `savollar[].id` bilan solishtiradi (6-ekran, KOD 9, A-12 o'qiydi, TS4 ✓). 9.90. |
| 26, 27 | `boshqa` bir nechta mehmon savolini ajratmaydi; matn saqlanmaydi | **Qabul** | `boshqa:1`, `boshqa:2`, `boshqa:3` (A-12, tayanch 8); matn — yozilmaydi (maxfiylik ustun). 9.90. |
| 28 | 1 daqiqa — mashq taymeri, hakam mezoni emas | **Qabul** | 6-ekran yo'riq ostida kulrang qator; KOD 4. 9.88. |
| 29, 30 | 8 daqiqa «bu mashqda» · bashorat | Allaqachon | O'zgarishsiz. |
| 31 | 2-ekran chizilgan «Qaytadan» — rasmiy qoidadek | **Qabul** | Ustida kulrang yorliq «bu mashqda». |
| 32 | «Birinchi 30 soniya» qoidasi — arbitrary son | **Qabul** | → «Bekor qilish» faqat gap boshlanmasdan oldin; 6-ekran, KOD 4, Shubhali 7. 9.88. |
| 33 | Vaqt — taymerdan avtomatik | Allaqachon | O'zgarishsiz. |
| 34, 35 | «Eng uzun bo'lakdan bitta gap» — mexanik | **Qabul** | 7-ekran `QIzoh`, takrorlash 8-2, kartochka 11, uyga ① «Oshdi» → «takrorlangan yoki ortiqcha gapni qisqartirib…» (08-FILTR 18 bilan bir); 8-ekran A o'zgarmadi. 9.90. |
| 36–38 | B reja → «tuzatiladigan joy», accent, top-state faqat «Ishladi» | Allaqachon | O'zgarishsiz. |
| 39 | Namuna izolyatsiyasi — upstream gate | Allaqachon | 9.59. |
| 40 | B reja video privacy qayta o'rgatilmaydi | Allaqachon | O'zgarishsiz. |
| 41 | Mehmon — «ota-onalardan biri» standart emas | **Qabul** | TS6 → «tashkilotchi tasdiqlagan katta yoshli mehmon (tashkilot qarori)». 9.89. |
| 42 | Mehmonga safety brief majburiy | **Qabul** | 6-ekran O'qituvchi eslatmasi. 9.89. |
| 43 | «hakam» ma'nosi kengaygan — QABUL | Allaqachon | O'zgarishsiz. |
| 44 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067 (01–12 bilan bir). |
| 45–47 | Reja · 5-ekran · 6-ekran sarlavhalari | Allaqachon | O'zgarishsiz. |
| 48 | 90 daqiqa — 95–115 risk, parallel guruhlar | Qisman | Shubhali 1 ga auditor bahosi; «4-kishi uyga» RAD. |
| 49 | Parallel demo — umumiy xizmat muammosi individual «Ishlamadi» emas | **Qabul** | 6-ekran O'qituvchi eslatmasi (qoidasi). 9.89. |
| 50 | «Uyda o'ting» — to'liq sharoit uyda bo'lmasligi mumkin | **Qabul** | Yakun → «keyingi imkoniyatda»; uyga ① «yakka rejim ham bo'ladi». 9.89. |
| + | «Keyingi bo'lak» 13 da (08-FILTR 16 sinf-supurish) | **Qabul** | 6-ekran taymer, 7-ekran 1-karta, A-3, TS18 — olindi. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; 7-ekran yakka — dinamik | **Qabul** | 10-band. |
| TS | 1 → 1, 4, 5, 26 (qisman) · 2 → 1 (RAD) · 3 ✓ · 4 → 25 ✓ · 5 ✓ · 6 → 41 · 7 → 13 ✓ · 8 → 3, 31 · 9 ✓ · 10 → 6 · 11 ✓ · 12 ✓ · 13 ✓ · 14 ✓ · 15 ✓ · 16 → 17 · 17 → 24 (qisman) | | Savollar 18–24: 18 → 4 · 19 → 6 · 20 → 19 · 21 → 26 · 22 → 2 · 23 → 1 · 24 → 32. |

**11 hard fix:** 1 ✓ · 2 ✓ (⛔ pilot) · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ (08-FILTR 7) · 8 ✓ · 9 ✓ · 10 ✓ · 11 ✓.

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (2-ekran xulosa 97, 7-ekran `QIzoh` 87, yakun sarlavhalari 52 / 49 / 52, 7-ekran yakka sarlavha 39, 6-ekran kulrang qatorlar 73 / 60 / 56, 5-ekran 61 / 58, «Endi siz bilasiz» 3 — 71).

## Sinf-supurish (13 MD + tayanch, grep)
- **«Keyingi bo'lak»** — 08 (olingan), 13 (olindi); boshqa MD larda yo'q.
- **Render soni o'quvchi matnida** — 06, 07 (dars mavzusi — qoldi), 08, 09, 13 (olindi).
- **«Eng uzun bo'lakdan kes»** — 08, 09, 13 (olindi).
- **«Navbatim kelmadi» o'quvchi tugmasi** — 12 (suhbat — alohida navbat, qoldi: suhbat tugallikka kirmaydi), 13 (faqat Mentor favqulodda).
- **Hook neytrallashtirish** — hamma darsda Rad (qonun).
- **`pm-m12d8-final.savollar[].id`** — 08 yozadi, 13 o'qiydi — mos.

## Tekshiruv
`lint:til` 13, 12, tayanch — 0 error / TOZA · `mdtekshir.py` 13, 12 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
