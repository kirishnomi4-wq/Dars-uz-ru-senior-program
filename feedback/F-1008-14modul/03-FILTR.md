# 3-dars «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-561)

Filtr tartibi — `01-FILTR.md` dagidek (grep → fakt (rasmiy hujjat: Lighthouse TBT, Metro/Vite bundling) → qonun → GATE M → auditoriya). Zaxira: scratchpad `zaxira-03/`. Skript: scratchpad `f03_tuzat.py` (103 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 6/10 (pedagogika 9 · Lighthouse 8 · LCP/CLS 8 · TBT 4 · kod hajmi 4 · amaliyot 7 · deploy 6 · 90 daqiqa 2,5). Hukm: **Qabul 24 · Qisman 6 · Rad 4 · Allaqachon 12** (46 band + sarlavha + 20 TS + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnni o'zgartiradigan Qabul (foydalanuvchiga alohida):** tayanch 1.3 (GATE M «T ✓», T5): (a) TBT izohi «sahifa javob bermagan vaqt» → «sahifa ochilayotganda brauzer kod bilan band bo'lgan vaqt» (1-band) · (b) 2-tuzatish — «import qilingan, lekin kerak emas»; `package.json` dagi import qilinmagan kutubxona tuzatish emas; tuzatishlar 0–2 (3-band) · (c) web kod hajmi — eng katta `.js` fayl (6-band) · (d) ilovaning yangi versiyasi (APK, eksport) darsdan uyga (45-band). Ikkala texnik da'vo rasmiy hujjat bilan to'g'ri: TBT — FCP va TTI orasidagi 50 ms dan uzun ishlarning ortig'i yig'indisi (Lighthouse hujjati, Manbalar 5); import qilinmagan kutubxona Metro/Vite bundle'iga kirmaydi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | TBT — «tugma bosishga javob bermagan vaqt» noto'g'ri model; load-time main-thread blocking | **Qabul** | Haq: MD ta'rifi Lighthouse hujjatining birinchi gapi («blocked from responding to user input»), lekin sahna TBT ni bosish kechikishiga bog'lagan edi. A-5 ta'rif, 9-ekran sahnasi (bloklar sahifa ochilayotganda ishlaydi, qizil chiziq «brauzer band» — TBT; bosish faqat «nega muhim»), nom qatori «Sahifa ochilayotganda brauzer kod bilan band bo'lib, bosishga javob berolmagan vaqt — TBT» (104), kartochka 5, «Endi siz bilasiz» 2, Q_LABELS, takrorlash 4, Quick Tap, O'qituvchi eslatmasi, tayanch 1.3 (⚠️). Sarlavha «tugma nega bosilmayapti?» — hodisa, qoldi. 9.37. |
| 2 | 10-ekran savoli shu modelga bog'langan | **Qabul** | Savol → «Sahifa ochilayotganda brauzer kod bilan band bo'ldi. Qaysi son buni ko'rsatadi?» (10 so'z); ✔ «TBT — band bo'lgan vaqt» (23 — ±15% ichida); to'g'ri izohi, A izohi. |
| 3 | `package.json` da bor, import qilinmagan kutubxonani o'chirish bundle'ni kamaytirmaydi | **Qabul** | Haq — bundler import qilinmaganini kiritmaydi. A-4, 9-ekran (blok «import qilingan, lekin kerak emas»; ustun — yuklanadigan kodga kirgan narsa), O'qituvchi eslatmasi, REPO 4, tayanch 1.3 (⚠️). Ikki xil narsa ochiq: A — tozalik (tuzatish emas) · B — yuklanadigan, lekin kerak emas (tuzatish). 9.38. |
| 4 | Agent promptini qayta yozish | **Qabul** | A1 3-qadam 2) → «kodga import qilingan, lekin hozirgi mahsulotda kerak bo'lmagan kutubxona yoki fayl … qayerda import qilingani va nega kerak emasligi; `package.json` dagi import qilinmagan kutubxonani ro'yxatga kiritma» (Yordam ham); A2 2) → importi va unga tegishli kodni olib tashlash, kutubxona bo'lsa `package.json` dan ham; 3-qadam dalil mezoni. Auditorning «eng katta 3 modul» varianti olinmadi — Vite chiqishi modul emas, fayl ko'rsatadi (web-trekda deterministik emas); Atlas — mobil trekda agent dalilining manbasi bo'la oladi (ro'yxat). |
| 5 | 2-tuzatishni majburlamaslik; A2 sarlavhasi | **Qabul** | Sarlavha → «Dalili bor tuzatishlarni qiling: rasm, keraksiz kod.» (52); Mentor «tanlagan tuzatishingiz». |
| 6 | Web `npm run build` barcha `.js` jami — yuklanadigan kod emas | **Qabul** | Birgina son: **eng katta `.js` fayl** (33-band bilan); o'quvchiga «builddagi fayl hajmi — ilova ochilganda yuklanadigan hamma kod emas» (A-4, A1 2-qadam, kartochka 10, TS2). 9.39. |
| 7 | Expo Atlas qaysi son — hard gate | Allaqachon | ⛔ Shubhali 3 (qaysi ko'rinish, Android, raw/gzip) — «qur»da. |
| 8 | `bundleKb` yoniga o'lchov turi | **Qabul** | `bundleTur: 'atlas-android' \| 'build-eng-katta-js' \| null` — A-12, tayanch 8; A1 5-maydon yonida kulrang yorliq. To'liq obyekt (qiymat · birlik · manba · tur) olinmadi — trek + `bundleTur` yetadi, 6-dars `bundleKb` ni o'qimaydi. |
| 9 | LCP bashorati «odam qachon ochildi deb sezadi» — his, ta'rif emas | **Qabul** | → «Lighthouse qaysi narsaning ko'rinish vaqtini kuzatadi?» · Birinchi harfning · Eng katta narsaning · Oxirgi rasmning; natija «eng katta narsaning» (S-015 vaqt tartibi saqlandi). 9.44. |
| 10 | LCP elementi pilotda boshqa chiqishi mumkin — saqlang | Allaqachon | 4-ekran O'qituvchi eslatmasi, KOD 6 `LENDING_NAMUNA.lcp`. |
| 11 | CLS «band qiladi — siljimaydi» absolyut | **Qabul** | «Endi siz bilasiz» 3 → «band qilishga yordam beradi — bu misolda tugma siljimadi»; 5-ekran xulosasi «Bu misolda» bor edi. 9.44. |
| 12 | 180×320 — faqat namuna | Allaqachon | 5-ekran kod kartasi, 11-ekran ✎, TS4; A2 promptda «haqiqiy width va height». |
| 13 | Lazy «pastdagi» — kurs soddalashtirishi; kartochkada «birinchi ekrandan tashqaridagi» | Qisman | «Endi siz bilasiz» 4 → «birinchi ekrandan tashqaridagi rasmga»; kartochka 7 shundoq ham «ekrandan tashqaridagi»; 8-ekran test ✔ «Sahifaning pastidagi rasmga» qoldi (dars so'zi «pastdagi rasm» — A-5 ta'rifi «birinchi ekrandan pastdagi»). |
| 14 | 7-ekran «1/3 → 3/3» deterministik sahna | **Qabul** | 2-qadam sahnasida kulrang yorliq «soddalashtirilgan sahna»; O'qituvchi eslatmasida brauzer oldinroq yuklashi bor edi. 9.44. |
| 15 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067, tayanch 7 (202) — 01/02-FILTR bilan bir. |
| 16 | Reja sarlavhasi — natija va'dasi; «ikki joy» | Qisman | Savol shakli RAD (P-014 — natija va'dasi); lekin «ikki joyni tuzatasiz» va'dasi olindi → «Bugun lendingingizni o'lchab, dalil bilan tuzatasiz.» (49). TS19. |
| 17 | A1 «ikki tuzatishni tanlang» → 0–2 dalilli | **Qabul** | A1 4-qadam (3): «0, 1 yoki 2 ta … Ikkalasi «yo'q» — ham to'g'ri natija»; A-1, A-4, Reja 03 («Yuklanadigan keraksiz kodni topish»), 12-ekran bo'lak 4 («Dalili bor tuzatishni tanlab qilish»), takrorlash 5, A1 yashil (2 holat), A3 prompt `{tuzatishlar}`; `tuzatishlar` 0–2 (A-12, tayanch 8, TS6). 9.38. |
| 18 | `tuzatishlar` 0 — valid; A2 skip, «bu safar tanlanmadi» | **Qabul** | A2 talab zinapoyasi: 0 bo'lsa 2–4-qadam yashirin, yashil «Bu safar dalili bor tuzatish topilmadi — qayta o'lchov baribir qilinadi.» (72); A3 `TEZLIK.md` «bu safar tuzatish tanlanmadi». |
| 19 | A2: lokal tekshiruv push'dan OLDIN | **Qabul** | 3-qadam qayta tuzildi: agent tugatgach → (1) ilova lokal (expo start / npm run dev, asosiy yo'l) · (2) `lending/index.html` brauzerda → ishlasa `git status` → push → 4-qadam Netlify'dagi lending telefonda. **Sinf-supurish:** 04-dars uch blok (203, 301, 363), 07-dars (308) — lokal tekshiruv push'dan oldinga; 06 — faqat `DEMO.md` (hujjat), 09 — push yo'q. 9.40. |
| 20 | Tekshirilmagan kod prodga — 13-Modul 12-dars №1 tuzatish | **Qabul** | 19-band bilan bir. |
| 21 | «katta bo'lmaydigan» — retina xiralik | **Qabul** | A2 prompt (ikkala) → «kerak bo'ladigan o'lchamdan ortiqcha katta bo'lmaydigan … rasm xira bo'lib qolmasin»; 4-qadam (1) «xira yoki cho'zilgan emasmi» bor edi. |
| 22 | Fayl turi o'zgarmasligi — scope qarori; «eng yaxshi» demang | Allaqachon | «eng yaxshi» / «optimizatsiya» — o'quvchi matnida 0 (O'lchov grep). |
| 23 | `.expo/` tracked bo'lsa ignore yetmaydi | **Qabul** | A1 2-qadam: bir marta `git ls-files .expo` — bo'sh; bo'lmasa agentga «.gitignore ga qo'sh va kuzatuvdan chiqar». Sabab: 13-Modul tayanchi 3 qoidasi — yangi maxfiy/sozlama fayl paydo bo'lgan darsda `git ls-files`; Atlas fayli shunday fayl. 9.41. |
| 24 | `.env` `git status` isbot emas — `git ls-files` | **Rad** | 13-Modul tayanchi 3 (M-q qarori, `12-FILTR.md` 11): `git ls-files` faqat **yangi kalit qo'shiladigan** darsda; bu darsda `.env` ga yangi kalit yo'q. 23-band `.expo/` uchun aynan shu qoida bilan qabul qilindi. |
| 25 | A3 qayta o'lchov — sxema bitta `keyin` | **Qabul** | Shartnoma: «kartada oxirgi o'lchov qoladi, ikkala son `TEZLIK.md` izoh qatoriga» — A3 2-qadam qatori, 3-qadam prompt `{izoh}` («Izoh: qayta o'lchov — {oldingi} → {oxirgi}»). Sxema o'zgarmadi. 9.42. |
| 26 | Yakun baho-markazli bo'lmasin | **Qabul** | Yakun 1–2-holat birlashdi: «Oldin va keyin o'lchandi — farq TEZLIK.md da sonlarda.» (54), baho taqqoslanmaydi (KOD 13 — 4 holat); A3 yashil: «Ikki o'lchov yozildi — o'zgargan sonlar: {ro'yxat}». TS8. 9.42. |
| 27 | «Lighthouse bahosi = tezlik» kuchli | **Qabul** | 2-ekran xulosasi → «Bu darsda tezlik Lighthouse bahosi va uch soni bilan tekshiriladi: oldin va keyin — o'sha sahifa, o'sha rejim.» (108). |
| 28 | CLS — sekinlashgan joy emas; A-2 | **Qabul** | A-2 (ichki o'q) → «… sahifa ochilishida nima bo'lganini ko'rsatadi — katta narsa kech ko'rindimi, sahifa siljidimi, brauzer kod bilan band bo'ldimi …». |
| 29 | Dars nomi o'zgarmaydi; «tezlik» umbrella | Allaqachon | A-5 «tezlik — qanchalik tez ochilishi va javob berishi»; 27-band xulosasi. |
| 30 | Chegaralar time-sensitive — build kuni qayta | Allaqachon + ⛔ | Shubhali 1 ga «rasmiy chegaralar va vaznlar «qur» kuni qayta tekshiriladi». |
| 31 | Lighthouse UI yozuvlari — ⛔ qolsin | Allaqachon | Shubhali 2, REPO 6. |
| 32 | «Bir xil sharoit» — o'sha kompyuter/internet qatori | **Qabul** | A1 1-qadam va A3 1-qadam: «iloji bo'lsa — o'sha kompyuter va o'sha internet». |
| 33 | Barcha `.js` qo'shish — arifmetika yuki; bitta canonical son | **Qabul** | 6-band: eng katta `.js` fayl — bitta son, qo'shish yo'q. TS2 shartli qabul — qo'llandi. |
| 34 | A1 5 son bir kartada — QABUL | Allaqachon | TS16. |
| 35 | `TEZLIK.md` kuchli; `measuredAt` | Qisman | Artefakt saqlandi; sana `TEZLIK.md` sarlavha qatorida bor; kalitga `measuredAt` — Rad (`savedAt` kurs qolipi — 02-FILTR 18 bilan bir). |
| 36 | `TEZLIK.md` ga xulosa so'zi yo'q — saqlang | Allaqachon | A3 3-qadam prompti. |
| 37 | «Tezlashdi» — aynan qaysi son o'zgargani | **Qabul** | «Endi siz bilasiz» 5 → «aynan qaysi son qancha o'zgargani bilan; «tezlashdi» so'zi o'rniga son»; A3 yashil — o'zgargan sonlar ro'yxati. Misol sonlari (3,1 → 2,4) yozilmadi — T6 (son to'qilmaydi), `{oldin} s → {keyin} s`. 9.42. |
| 38 | «Ikki tuzatish» program goal — 0–2 model | **Qabul** | 17-band. |
| 39 | Hook vizuali — saqlang | Allaqachon | O'zgarishsiz (javob matnlari — 15-band). |
| 40 | «Hakamlar oldida kutish uzoq tuyuladi» — acceptable | Allaqachon | Hakam gapsiz, ismsiz. |
| 41 | 11-ekran «0 px» — sandbox natijasi, kafolat emas | **Qabul** | `QIzoh` → «…«0 px» shu oynaning natijasi, lendingingizniki 3-amaliyotda o'lchanadi.» (103). |
| 42 | Platforma tugmasi «Kompilyatorni ochish» ↔ «kod oynasi» | Qisman | Yorliq platformaniki (bu dars tegmaydi); TAYANCHGA SAVOL 0 + MEXANIZM-TAKLIF 5 (jurnal) — migratsiya asosiy seans qarori. |
| 43 | «Yangi kutubxona qo'shma» — saqlang | Allaqachon | A2 prompt. |
| 44 | Buzilgan removal — «git revert emas, agentga xato» xavfli; «faqat shu o'chirishni qaytar» | **Qabul** | A2 3-qadam xato yo'li: «O'chirilgan {kutubxona} ni qayta qo'y — faqat shu o'chirishni qaytar, boshqa joyga tegma.»; O'qituvchi eslatmasi; 2-tuzatish qilinmagan sanaladi. 9.38. |
| 45 | A3 «yangi versiya» (eksport, APK) darsni og'irlashtiradi — uyga | **Qabul** | A3 4-qadam → «Tekshirish» (lending telefonda, `TEZLIK.md` GitHub'da); eksport va APK — uyga vazifa 1 (buyruqlar bilan); kutilgan natijadan terminal kartasi chiqdi; A-1, A-11, TS15, O'qituvchi eslatmasi. Tayanch 1.3 «A3 … va yangi versiya» — ⚠️. 9.43. |
| 46 | 90 daqiqa real emas (150–200) | Allaqachon + Qabul | ⛔ pilot taymeri bor edi; A-11 ga auditor bahosi (105–125) va kengaytirilgan qisqartirish tartibi (Desktop · 9-ekran 3-qadam · 4-ekran 2-qadam · A2 faqat rasm · kartochkalar uyda); APK uyga — 45-band. «Sig'adi» deyilmagan. 9.43. |
| S | Sarlavhalar: asosiy QABUL; Reja → savol; A2 → «Dalili bor joylarni tuzating» | Qisman | Reja — 16-band; A2 — «Dalili bor tuzatishlarni qiling: rasm, keraksiz kod.» (auditor subtext bilan). |
| TS | 1 ✓ (ikki alohida o'lchov — A1 qatori) · 2 shartli → 6, 33 · 3, 4, 7, 9, 10, 11, 12, 13, 14, 16, 17, 20 ✓ · 5 → 3 · 6 → 17 · 8 → 26 · 15 → 45 · 18 → uyga vazifa 2 «xohlasangiz» · 19 → 16 | — | Qo'shimcha 21–30 savollar — 1, 3, 6, 7, 17, 19, 25, 23, 26, 45-bandlarda javob. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ (optional + import mezoni) · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ (`.expo/`; `.env` — qoida bo'yicha Rad) · 9 ✓ · 10 ✓ (APK uyga; 90 — ⛔ reja).

## Sinf-supurish (13 MD + tayanch, grep)
- Push'dan oldin lokal tekshiruv — 03 A2, **04 (uch blok), 07** tuzatildi; 06 (faqat hujjat push), 09 (push yo'q) — tegilmadi.
- TBT / «javob bermagan vaqt» — boshqa MD larda yo'q (tayanch 1.3 tuzatildi).
- «ishlatilmaydigan kutubxona» modeli — faqat 03 va tayanch 1.3/3 (teg qatori ⛔ pilot natijasi — qoldi).
- `.expo/` — faqat 03. «tezlashdi» va'da shakli — 04 (626 — taqiq ro'yxatida), boshqa yo'q.
- Baho-markazli yakun — faqat 03 (boshqa darslarda Lighthouse yo'q); 06-dars `pm-m12d3-tezlik.keyin.baho` ni «shu son bilan gapiring» uchun o'qiydi — mos.

## Tekshiruv
`lint:til` 03, 04, 07, tayanch — 0 error · `mdtekshir.py` 03/04/07 — 19/12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
