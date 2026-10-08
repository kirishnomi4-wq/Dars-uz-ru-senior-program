# 14-Modul — pilot quruvchi topshirig'i (2 dars, 2 agent; 08.10.2026, F-1008-572)

> «Qur» buyrug'i — foydalanuvchi, 08.10.2026 ertalab («qur shoshilmasdan halol aniqlikda mehr bilan yaxshi o'ylab»). Pilotlar — 13-Modul naqshida bitta TEX (modul cho'qqisi) va bitta PM (pitch zanjirining ildizi — kalitini 5 dars o'qiydi).
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»). `maydon-jamoa` repo'siga, App.jsx ga, `src/qolip`, `src/skelet`, `src/live`, `konveyer/*`, boshqa modullarga tegilmaydi.

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/12-Modull/`) | MD (`feedback/F-1008-14modul/`) | Ekran | Turi | Palitra | Namuna (faqat ko'rish, kod ko'chirilmaydi) |
|---|---|---|---|---|---|---|---|
| 1 | m12-01 | `PmInvestorPitchLesson.jsx` | `01-PmInvestorPitch-v3.md` + `01-FILTR.md` + `01-OZ-AUDIT.md` | 16 | PM (pitch ildizi) | `qolipRang('pm')` | 12-Modul `src/10-Modull/PmGrowthPitchLesson.jsx` (`BeshDaqiqaSahna`, pitch forma, detektorlar, `TEXNO_RE`, `normT`) · 13-Modul `src/11-Modull/PmMoneyTalkLesson.jsx` (QMustaqil ketma-ket karta, `.mt-katak`, yakun holatlari) |
| 3 | m12-03 | `ProductSpeedLesson.jsx` | `03-ProductSpeed-v3.md` + `03-FILTR.md` + `03-OZ-AUDIT.md` | 19 | TEX (modul cho'qqisi) | `qolipRang('tex')` | 13-Modul `src/11-Modull/PaymentWebhookLesson.jsx` (sahna, `QKod` + `HtmlCompiler`, `ScreenBlok` bloklari, tekshiruv kartasi) · 12-Modul `src/10-Modull/WebSocketBasicsLesson.jsx` (QTushuncha sahnalari, ko'p fayl kod oynasi) |

Fayl skeletdan oldindan nusxalangan: `LESSON_META` (`pm-m12d1-v1` / `m12-03-v1`, `lessonTitle` — menyu nomi), export nomi, palitra, LiveGate sarlavhasi (`tr(LESSON_META.lessonTitle)`) qo'yilgan; `npm run gates` 12/12.
App.jsx ga ulangan — lokal serverda `http://127.0.0.1:5176/#/lesson/m12-01` va `…/m12-03` (server asosiy seansniki; ishga tushirmang, to'xtatmang).
`src/11-Modull` (13-Modul) va boshqa modullarni boshqa seanslar tahrirlaydi — faqat o'qing.

## O'qish tartibi
1. `feedback/F-1008-14modul/QURUVCHI_SABOQ.md` — va u ko'rsatgan 9, 10, 11, 12, **13**-Modul `QURUVCHI_SABOQ.md` lari TO'LIQ (13-Modul P 1–9 — majburiy, oldindan qo'llanadi); fidbek rasmlaridan o'z ekran turingizga o'xshashlarini Read bilan.
2. `konveyer/2-QURUVCHI.md` (qoidalar, tartib, darvozalar, hisobot) + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1.0, 1.14 va o'z darsingiz bo'limi; 2; 3; 8; 9-bo'limda o'z darsingiz raqami tilga olingan bandlar) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md` (⚠️ qatori — tasdiqlangan matn o'zgarishlari MD ga kiritilgan).
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi) va `src/qolip/QOLIP.md`; karta `konveyer/QURISH_KARTASI.md` (U · K · J).
4. Namuna fayllari — faqat qanday yechilganini ko'rish uchun (grep / sed oraliq); kod bo'lagi ko'chirilmaydi.

## Darsga xos eslatmalar (to'liq ro'yxat — MD ning «KOD» bo'limi, band-band)

- **1-dars** (MD «B. KOD» 1–16; REPO yo'q — PM darsi):
  - Bitta vizual `OltiBolakSahna` (telefon `JamoaTelefon` CHAPDA ≈170×272, «8 / 10» → «9 / 10»; bo'laklar `rejim: 'besh' | 'olti'`; taymer chizig'i besh `[40, 20, 90, 90, 60]` / olti `[40, 30, 90, 60, 30, 50]` + «savol-javob» uzuq bo'lagi; hakamlar — **odam figurasi chizilmaydi (SABOQ P1)**: rol yorlig'i «hakam» + `HAKAM_SAVOL` pufagi / ✓; `fokus`) —
    manbalar `JAMOA_PITCH` (A-6 aynan, + `birinchi`, `vaqt`), `JAMOA_PITCH_12` (12-Modul tayanchi 1.12 — besh bo'lak), `HAKAM_SAVOL` (6; tayanch 9.3 aynan), `BOZOR_SON` (3; uchinchisi `?`), `AIRBNB_KADR` (3).
    12-Modul `BeshDaqiqaSahna` dan ko'chirilmaydi (K-020). Rangli yon chiziq yo'q. `reduced-motion`; 393 da bo'laklar telefon ostida. `// qolip-maket: …` izohi.
  - s0 `QKirish` — maket `pm-m10d12-pitch.bolaklar` dan (yo'q bo'lsa `JAMOA_PITCH_12` + yorliq «Mentor misoli»); javoblar «Aynan!» / «Qiziq fikr!», `correct: false` hammaga (J-026); QKirish maketi ustunga sig'adi (SABOQ P2).
  - s3 `QVoqea` — `AirbnbTasma` (o'nga yaqin oq slayd, son yozilmaydi; «Bozor», «Jamoa» accent), `Brend` «Airbnb» #FF5A5F logotipsiz; bashorat 2/3 da ballsiz; tugma «Voqea davomi (N/3)».
  - s5 — `BOZOR_SON` kartalari tugma (har birining o'z chegarasi — E 40); 3-karta silkinish + gap. s7 — Jamoa: rol yorliqlari (g'oya · mahsulot · kod) + asbob belgisi + «sinab ko'rganlar» qatori (6 kichik belgi — figura emas). s9 — hisoblagich 44 → 51, «Investitsiya summasi» kartasi chizilib chiqib ketadi.
  - s10 `QTartib` — 6 uya, aralash tartib `['jamoa', 'muammo', 'keyingi', 'bozor', 'raqamlar', 'yechim']` qat'iy, bosib joylash (sudrash ham), noto'g'ri — silkinish + `QXato`; nishon `rightOrder` birinchi urinishda; ballsiz `tartib: -1`, `optionalLive`.
    ⛔ Olti uzun bo'lak + olti uya 1280×800 da skrollsiz — sig'masa 2 ustun, **shrift kichraytirish yo'q (E 41, 01-FILTR 11)**; natijani hisobotda yozing (surat bilan).
  - s11 `QMustaqil` — 6 bosqichli forma, ketma-ket karta (E 53), yorliq input ichida (E 43); o'qiydi `pm-m10d12-pitch` (`bolaklar.muammo.gap`, `.muammo.dalil`, `.yechim.gap`, `.raqamlar.halolGap`, `.keyingi`), `pm-m10d10-hisobot` (`royxat.soni`, `royxat.sana`, `tuzatishQator`), `pm-m11d9-tasdiq` (hisobga olinadigan tasdiqlar soni — SABOQ C shakli; kalit yo'q bo'lsa qator ko'rinmaydi).
    Ikkinchi tugmalar: Bozor «Hali tekshirilmagan» · Raqamlar (hisobot soni, tasdiq — faqat qiymat bor bo'lsa) · Keyingi qadam «So'rov qo'shish» (`{…}` qolsa — bloklaydi). Belgi sanog'i «n / 160». Minimal → yaxshilash qatlami (9.31).
    Tekshiruv funksiyasi (bo'sh · 160 · `{…}` · telefon/akkaunt/havola · Bozor umumiy so'zlari · `TEXNO_RE` · tasdiq/«to'lov emas» · agent/a'zo · pul so'zlari · `VADA_RE`) — **PM-108: kamida 10 namuna bilan `node` da** (apostrof `normT`), natija hisobotga.
  - Saqlash `pm-m12d1-pitch` = `{ bolaklar: {6}, manba: {6}, savedAt }` (tayanch 8 aynan; har bo'lak `string` ≤160 yoki `null`; `manba`: `'12-modul' | 'tahrir' | 'yangi' | null`); har «Saqlash» birlashtiradi.
  - Testlar s4/s6/s8/s12 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` {4, 6, 8, 12}; `Q_LABELS` shu; `QuestionScreen` `vizual` propi skeletda yo'q — o'z faylingizda qo'shing (javob topilgach kichik vizual, SABOQ 4). Arena 12 (✔ 3/3/3/3). `ACHIEVEMENTS` 4 (`rightOrder`, `sixParts`, `freshNumbers`, `clearAsk`, «!» bilan). `FLASHCARDS` 12 — alohida ekran (s14). s15 yakun — 4 holat (saqlangan bo'laklar soni + Keyingi qadam), `HwCard` 3 band.
  - MD «A» bo'limidagi ⛔ (90 daqiqa, 11-ekran 22 daqiqa) — qurilishga ta'sir qilmaydi; hisobotda «sinalmagan».
- **3-dars** (MD «KOD» 1–15; REPO — sizniki emas, ⛔ o'lchovlar `null`):
  - `SCREEN_META` 19 (MD KOD 1 aynan); `INLINE_KEYS`: s3 1 · s6 3 · s8 0 · s10 2 · s12 sentinel 0; QKod (11) va bloklar (13, 14, 15) `practice: -1`.
  - Bitta manba `TEZLIK_SAHNA` + `LENDING_NAMUNA` + `LH_CHEGARA` (0–49 · 50–89 · 90–100; LCP 2,5 s; CLS 0,1; TBT 200 ms) + **`MENTOR_OLCHOV` (`oldin`, `keyin`, `desktop` — hammasi `null`; `null` → sahnada «—», `{…}` emas)** + `ISH_TARTIBI`.
  - `TezlikSahna`: chapda brauzer (≈200×360; `lending` | `ilova`; holatlar `bosh` · `matn` · `rasmKeldi` · `siljidi` · `joyBand`), o'ngda Lighthouse paneli (logotipsiz; doira ranglari — Lighthouse'ning o'z uch rangi faqat maket ichida, qolgan fon — D3 tokenlari). `// qolip-maket: tz-ochish tz-analyze tz-desktop tz-sekin tz-element tz-bos tz-olcham tz-hammasi tz-keyin tz-tepa tz-ilova tz-olib tz-qayta`. `reduced-motion`.
  - Ekranlar 0, 2, 4, 5, 7, 9 — MD KOD 4–9 aynan (0: «Ochish» → holatlar → variantlar faol → panel tug'iladi; 2: «Analyze page load» → doira `MENTOR_OLCHOV.oldin.baho` (null — «—»), «Desktop» → `desktop.baho`, o'zi «Mobile» ga qaytadi; 4: vaqt chizig'i 4 belgi, elementlar bosiladigan, to'g'risi `LENDING_NAMUNA.lcp`;
    5: bosish rasm kelishi bilan bog'liq (vaqtga tayanmaydi), kod kartalari sahna ostida (E 46); 7: «Yuklangan: n / 3», avtomatik sekin aylantirish; 9: `ilova` sahifasi, kod ustuni uch blok, qizil chiziq «brauzer band» — TBT ochilishdagi band vaqt (9.37), bosish faqat «nega muhim»).
  - 11-ekran `QKod` → `HtmlCompiler` (ikki fayl: `index.html` — o'quvchi, `namuna.js` — tayyor, yagona JS). Tekshiruvlar sinxron, atribut bo'yicha (MD KOD 10 (1)–(3)); «Tugma siljishi» — `namuna.js`; «Bajardim» shartlar ✓ bo'lgach. Qoralama `pm-m12d3-code`.
    **Haqiqiy kompilyatorda sinang** (boshlang'ich kod — 3 shart ✕ · to'g'ri kod — hammasi ✓ · tepadagi rasmga `loading="lazy"` qo'yilsa — (2) ✕); starter matnida backtik yo'q, JS satrlarida apostrofli so'z yo'q, qatorlar ≤70; natija hisobotga.
  - 13, 14, 15 — `ScreenBlok` + `QBlok` + `QPrompt`, har blok 4 qadam (Ochish · Prompt · Ishga tushirish · Tekshirish — 9.45); «Davom etish»: A1 — 2-qadamdan, A2 — 3-qadamdan, A3 — 2-qadamdan keyin; bayroq — 4-qadam «Bajardim»; «Ortda qoldingizmi» — faqat A1.
    A1 «Oldin» kartasi (bitta karta, 5 maydon, yorliq input ichida; vergul/nuqta; «kB | MB» chipi ×1000) → `pm-m12d3-tezlik.oldin`; 4-qadamda `tuzatishlar` tanlovi (0–2; «rasmlar: …», «kutubxona: …»). A2 `{rasmlar}`, `{kutubxona}` ← `tuzatishlar`; «yo'q» — band yashirin; `{avvalgidek…}` tekshiruvi (kamida ikki ish). A3 «Keyin» kartasi → `keyin`; solishtirish qatorlari (baho — oshgani yaxshi; LCP/CLS/TBT/kB — kamaygani yaxshi); «tezlashdi» so'zi yo'q — qaysi son qancha o'zgargani (9.42).
    Trek: `pm-m9d8-platforma.trek` → bo'lmasa A1 chiplari → `pm-m12d3-tezlik.trek`; `bundleTur`. Kalit — tayanch 8 aynan (6-dars o'qiydi).
  - `RECAPS` {3, 6, 8, 10, 12}; `Q_LABELS` shu; `ACHIEVEMENTS` 4 (`Shift Stopper`, `Lazy Below`, `Quick Tap`, `Measured Twice` — «!» siz; triggerlar MD KOD 12); arena 12 (3/3/3/3); flashcard 12 alohida ekran; yakun — 4 holat (`oldin`, `keyin`, A2 bayrog'i), baho taqqoslanmaydi.
  - Fayl katta (19 ekran): ekranma-ekran yozing, har 3–4 ekrandan keyin `esbuild`; turn tugab qolsa — to'xtab, nima qolganini hisobotda aniq yozing (chala ekranni «tayyor» demang).

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` — o'z faylingiz bo'yicha 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — faqat skelet klasslari.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q») va `SHOT_W=393 SHOT_H=844` bilan `…/mob`.
  Bitta ekran va bosishlar: `node konveyer/vositalar/ekran.mjs <fayl> <scratchpad>/<NN>-qurish/c "<ekran>:<selektor>|<selektor>*3"` (W/H — `SHOT_W`, `SHOT_H`).
  Kesik + ⛶ markazi + skrol + pageerror: `node feedback/F-1008-14modul/vositalar/kesik.mjs m12-NN src/12-Modull/<fayl> desk mob` (server 5176).
  Har suratni Read bilan ko'z bilan ko'ring; harakatli ekranlarda harakatdan OLDIN va KEYIN surati; ⛶ ni bosib kattalashganini ham.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (ikkinchi agent scratchpad'ni baham ko'radi).
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali (qolip turi, «4/4») · KOD ro'yxati band-band · darvozalar aynan (buyruq va natija) · MD dan chetlashish (har biri sababi va SABOQ raqami bilan) va «MD ga taklif» ·
  qolip taklifi · RU-qarz · faylingizdan tashqari ishlar · surat yo'llari · **nimani tekshirmadingiz** (ochiq yozing) · ⛔ sinalmagan ro'yxati.
- Turn-byudjeti: 3-dars ≤ 170, 1-dars ≤ 150; faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
