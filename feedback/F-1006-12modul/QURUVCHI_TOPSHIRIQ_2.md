# 12-Modul — 2-to'lqin quruvchi topshirig'i (10 dars: A to'lqin 03–07, B to'lqin 08–12)

> «Qur» va 2-to'lqin — foydalanuvchi buyrug'i (07.10.2026: «ha boshla shoshilmasdan aniq»; B to'lqin — «istasang paralelni jo'nat boshqa agentlarni ham»). Agent ruxsati har to'lqinga alohida; ruxsat vaqti jurnalga yoziladi.
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»).
> Pilotlar (1, 2-dars) foydalanuvchi ko'rigidan o'tdi va to'liq tuzatildi (F-1006-368…388, commit `95912f6`) — ular endi **ishlaydigan namuna**: savol tug'ilsa, avval pilotda qanday yechilganini qarang.

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/10-Modull/`) | MD (`feedback/F-1006-12modul/`) | Ekran | Turi | Palitra | Asosiy namuna (pilot) |
|---|---|---|---|---|---|---|---|
| 3 | m10-03 | `PmRealtimeSpecLesson.jsx` | `03-PmRealtimeSpec-v3.md` + `03-FILTR.md` | 12 | PM + amaliyot | pm | 1-pilot (PM, QBlok) · 2-pilot (sahna, sxema) |
| 4 | m10-04 | `LiveNotifyDayLesson.jsx` | `04-LiveNotifyDay-v3.md` + `04-FILTR.md` | 12 | Proyekt (3 blok) | tex | 2-pilot (sahna, `ScreenBlok`) · 11-Modul `FeatureOneLesson.jsx` (loyiha kuni) |
| 5 | m10-05 | `BreakAndFixLesson.jsx` | `05-BreakAndFix-v3.md` + `05-FILTR.md` | 19 | TEX | tex | 2-pilot (sahna — MD «nusxa, import emas», `QKod`, `QTartib`) |
| 6 | m10-06 | `PmChannelsLesson.jsx` | `06-PmChannels-v3.md` + `06-FILTR.md` | 16 | PM (K8 Facebook) | pm | 1-pilot (`LendingSahifa`, keys `QVoqea`, bittadan karta) |
| 7 | m10-07 | `PmFiftyUsersLesson.jsx` | `07-PmFiftyUsers-v3.md` + `07-FILTR.md` | 12 | PM + amaliyot | pm | 1-pilot (QBlok, bittadan karta) |
| 8 | m10-08 | `PmDropOffLesson.jsx` | `08-PmDropOff-v3.md` + `08-FILTR.md` | 12 | PM + amaliyot (K6 Netflix) | pm | 1-pilot (QBlok, bittadan karta) · A: 7-dars (`PmFiftyUsersLesson.jsx` — reja, ikki blok) |
| 9 | m10-09 | `RetentionDayLesson.jsx` | `09-RetentionDay-v3.md` + `09-FILTR.md` | 12 | Proyekt (3 blok) | tex | 2-pilot (sahna) · A: 4-dars (`LiveNotifyDayLesson.jsx` — loyiha kuni, 3 blok, `JonliSahna`) |
| 10 | m10-10 | `PmUsersCheckLesson.jsx` | `10-PmUsersCheck-v3.md` + `10-FILTR.md` | 16 | PM (K5 Duolingo) | pm | 1-pilot · A: 6-dars (`PmChannelsLesson.jsx` — 16 ekranli PM, `HtmlCompiler`, juft rejim) |
| 11 | m10-11 | `PmPitchReviewLesson.jsx` | `11-PmPitchReview-v3.md` + `11-FILTR.md` | 12 | PM (qisqa) | pm | 1-pilot · A: 3-dars (`PmRealtimeSpecLesson.jsx` — bittadan karta, varaq) |
| 12 | m10-12 | `PmGrowthPitchLesson.jsx` | `12-PmGrowthPitch-v3.md` + `12-FILTR.md` | 16 | PM (K1 Uzum) | pm | 1-pilot · A: 6-dars (16 ekran, `HtmlCompiler`) · 7-dars |

Fayllar skeletdan oldindan ochilgan: `LESSON_META` (PM — `pm-m10dN-v1`, Kod/Proyekt — `m10-NN-v1`; uz + ru nom), export nomi, palitra, LiveGate sarlavhasi `tr(LESSON_META.lessonTitle)`,
**to'g'ri ⛶ qoidasi** (`.zoomable.zoom-on` + `.lesson-root :has(.zoom-on)` — SABOQ E 48, o'chirmang); `npm run gates` 12/12; App.jsx ga ulangan (`comp` bor) — `http://127.0.0.1:5174/#/lesson/m10-NN` da ochiladi.
**5173 — boshqa loyiha (AILM): unga tegmang. Server ishga tushirmang / to'xtatmang.** `src/7-Modull`, `src/8-Modull`, `src/9-Modull` — boshqa seanslarniki, faqat o'qing. Pilot fayllarga (`PmLandingLesson.jsx`, `WebSocketBasicsLesson.jsx`) ham tegmang — faqat o'qing.

## O'qish tartibi
1. `QURUVCHI_SABOQ.md` — TO'LIQ, ayniqsa **C (12-Modul kelishuvlari) va E 40–55 (pilot ko'rigi — foydalanuvchining eng yangi qarorlari)**; u ko'rsatgan 9, 10, 11-Modul saboqlari. E — eng ustun: E va C/D yoki MD to'qnashsa — **E to'g'ri**.
2. `konveyer/2-QURUVCHI.md` + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1.0 va o'z darsingiz bo'limi, 2, 3, **8 — kalitlar jadvali aynan**, 9 — o'z darsingiz tilga olingan bandlar) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md`.
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi), `src/qolip/QOLIP.md`, karta `konveyer/QURISH_KARTASI.md`.
4. Fidbek rasmlari: `feedback/F-1006-12modul/rasm-1007/` — foydalanuvchi pilotlarda nimani yoqtirmagani (har rasm nomida F-ID; tafsilot — `JURNAL.md` 07.10 yozuvlari).

## Pilotdagi tayyor yechimlar — avval shularni qarang (grep bilan; nusxa olsangiz — o'z prefiksingizga o'zgartiring, darslar mustaqil)
- **Har variantning o'z chegarasi** (E 40): 2-pilot CSS «ws-chorla», `.ws-k.faol .q-variant`, `.ws-halqa-g .q-chip`; 1-pilot `.ld-halqa-guruh > .ld-tanlov`, `.q-bashorat:not(:has(.q-chip.on)) .q-chip`. Bitta tugma — `.ws-halqa` (puls 3 marta, `scale` YO'Q).
- **Taxmin va izoh yashil qutida** (E 42): 2-pilot `Natija` + `XulosaQ` (qolipning `natija` propi ishlatilmaydi); 1-pilot `TaxminQ`. Format: «Taxminingiz to'g'ri chiqdi ✓» / «Taxminingiz ✕ — aslida: …».
- **Bittadan karta** (E 53, 9-Modul SABOQ 9/13): 1-pilot `Screen9` — `fi`, `juftOch`, `s9TekshirJuft`, `.ld-foy-ok`, `.ld-kirish`; uchish — `useUchish`.
- **Yorliq input ichida** (E 43): 2-pilot `Screen13` — `.ws-ms-n` (doimiy raqam) + placeholder savol, `YordamTugma`, tugmalar bir qatorda; «masalan» — Yordam ichida.
- **Ikki telefon va Backend sahnasi** (E 46, 47): 2-pilot `Sahna`, `Telefon` (pointer capture tugmani yutmaydi — `pd` dagi `closest('button')`), `Chiziq`, `Konvert`, `BackendTugun` (`ok`/`xato` holati), `.ws-kodlar` (kod kartalari sahna ostida), tik sahnada konvert telefon ostida.
- **Jadval «ma'lumot» bo'lib** (E 45): 2-pilot `SxJadval`, `JadvalIc`, `.ws-sx-ram`, `.ws-sx-bar`. **Tartib bo'laklari** (E 44): 2-pilot `.ws-tartib .q-dd-*`.
- **Sahifa maketi** (E 41): 1-pilot `LendingSahifa` (+ `.ls-tel { zoom: 0.72 }` — telefon kesilmaydi). **Amaliyot bloki**: 2-pilot `ScreenBlok`, `WsPrompt`, `A1_KOD_PROMPT` (real prompt — E 52); 1-pilot `ScreenA1`.
- **Yakun** (E 50, 54): 1-pilot `SummaryScreen` (holatlar, jumladan «hali yozilmagan»), 2-pilot yakuni («hali tugamagan»). Kartochka halqasi — 2-pilot `.ws-flash.yangi` (E 49).

## MD ↔ E: MD lar 07.10 dan oldin yozilgan — quyidagilarda E bo'yicha quring (matn MD dan o'zgarmaydi; har holat hisobotda «MD dan chetlashish (E N)»)
- Yakunda «Bugungi asosiy fikr», sarlavha ostidagi holat qatori/chipi («Talabingizda N chekka holat yozilgan», sinov chipi va sh.k.), artefakt-strip — **yo'q** (E 50; MD dagi «Bugungi asosiy fikr» qatori «KO'RSATILMAYDI» deb belgilangan).
- `QTaxmin` / `TaxminIxcham` xulosadan alohida qator — yo'q: taxmin qatori yashil xulosa ichida (E 42). QIzoh xulosadan keyin — o'sha qutining oxirgi kichik qatori.
- «Guruhda bitta halqa» — yo'q, har variant o'z chegarasi (E 40). Yakun sarlavhalari — har holatda rost (E 54). «Ortda qoldingizmi» — darsda bir marta, bitta qator (SABOQ 39, E 52 yonida).
- «Vaqt qolsa» bloki o'quvchini ushlab qolmaydi (E 55). Ko'p maydonli forma — bittadan karta (E 53).

## Darsga xos eslatmalar — A to'lqin (to'liq ro'yxat — MD «KOD» bo'limi, band-band; «REPO» — sizniki emas)
- **3-dars** `PmRealtimeSpecLesson` (≤ 140 turn): bitta vizual `TalabSahna`; s0 — ikki telefon va bo'sh quti (gap harfma-harf); s2 «Keyingi bo'lim» ×3; s4 uch ssenariy (har biri `8 / 10` dan boshlanadi).
  s5 — bittadan karta: o'qiydi `pm-m10d2-sxema.qatorlar` (2-dars yozadi; yo'q bo'lsa «Qator qo'shish»), yozadi `pm-m10d3-talab` (tayanch 8 shakli aynan — 4, 5-darslar o'qiydi). A1/A2 — `ScreenBlok` + prompt joylari. Yakun — besh holat (rost).
- **4-dars** `LiveNotifyDayLesson` (≤ 140): bitta vizual `JonliSahna` — 2-pilot sahnasi yo'li bilan (nusxa, import emas) + Backend ichida xona `oyin-1` va nuqtalar; 0-ekran — bitta telefon va eslatma kartasi;
  5-ekran — to'rt qadam navbat bilan (qulf). Uch amaliyot bloki, har biri 4 qadam; blok bayrog'i faqat 4-qadam «Bajardim»idan (3-qadamdan keyin «Davom etish» ochilsa ham). Trek — `pm-m9d8-platforma`. Prompt matnlari (expo-notifications va h.k.) — MD aynan.
- **5-dars** `BreakAndFixLesson` (19 ekran, ≤ 170): `IkkiTelefonSahna` — 2-pilotdagi **hozirgi** (tuzatilgan) sahna bilan bir xil ko'rinish; `BuzishYozuvi` (9, 11, 14, 15-ekran); 9-ekran — bittadan uch karta.
  8-ekran `QKod` → `HtmlCompiler` ko'p faylli: skelet tuzog'i — faqat birinchi JS fayl ulanadi, tekshiruv async ni kutmaydi; haqiqiy kompilyatorda sinang (boshlang'ich — 0 shart, namuna yechim — hammasi, noto'g'ri — yiqiladi) va hisobotda yozing.
  12-ekran o'qiydi `pm-m10d3-talab.chekka`, yozadi `pm-m10d5-buzish`. Fayl katta: ekranma-ekran yozing, har 3–4 ekrandan keyin `esbuild`; turn tugasa — nima qolganini aniq yozing.
- **6-dars** `PmChannelsLesson` (≤ 160): bitta vizual `ChatTelefon` («Telegram» o'z rangida, logotipsiz); s2 — olti javob ketma-ket; s6 — `VAZIYATLAR` bittadan karta → `XAVFSIZLIK` ro'yxati (tayanch 1.6 so'zma-so'z);
  s7 Facebook — `QVoqea`, nom o'z rangida, bankda yo'q son yo'q; s9 o'qiydi `pm-m9d3-intervyu` (11-Modul kaliti — `src/9-Modull` da qanday yozilganini grep bilan tekshiring, faqat o'qing); s10 o'qiydi `pm-m10d1-lending`;
  s11 `HtmlCompiler` (`kanalniOl`); yozadi `pm-m10d6-kanallar`. `HookMaket` — 1-pilot `LendingSahifa` yo'li bilan (nusxa; telefon kesilmasin — E 41).
- **7-dars** `PmFiftyUsersLesson` (≤ 140): bitta vizual `IshgaTushirish`; s2 «Keyingi bosqich» ×3 va «Ishga tushirish kuni»; s4 uch nuqta tartibda; s5 — bittadan karta, o'qiydi `pm-m10d6-kanallar.kanallar[].nom`,
  yozadi `pm-m10d7-reja`; A1/A2 — `ScreenBlok`; yakun besh holat (rost). Sonlarni o'quvchi o'zi kiritadi (tayanch 9.39).

## A to'lqindan saboq (07.10 — A agentlari topgan tuzoqlar; B to'lqin uchun MAJBURIY)
- **«Maydon Jamoa» nomi rangi — `#2E9E4F`** (11-Modul tayanch 9.62: «PM palitrasining `ok` yashilidan farqli»; SABOQ C). Pilotlar va A darslari `T.ok` bilan qurilgan — ular keyin tuzatiladi; **siz `#2E9E4F` (bitta const) ishlating, `T.ok` emas.**
- **`QBlok` qadam matni `<p>` ichida chiziladi** — ichiga `div` qo'yib bo'lmaydi: prompt va forma o'rovchisi faqat `span` / `input` bilan (A darslari: `FuPrompt`, `RtPrompt`, `JxPrompt`, `BfPrompt` — o'xshashini qarang).
- **E 54 amalda:** qoralama saqlanmasa, «boshlandi» yolg'on — «… hali yozilmagan / hali tugamagan» (A: 3, 4, 5, 6, 7-darslar shunday qildi). Har holat sarlavhasini brauzerda kalit bilan yasab tekshiring.
- **E 55:** avval MD/FILTR aniq qarori (masalan 09-FILTR 39 — 4-banddan keyin); MD jim bo'lsa — «Davom etish» tekshiruvdan oldingi qadamdan keyin, «vaqt qolsa» blokida — 1-qadamdan keyin; bayroq faqat oxirgi «Bajardim»dan.
- **`pm-m10d7-reja.bosqichlar[].qachon`** — 7-dars kod bilan yozadi: `'bugun' | 'hafta' | 'keyinroq'` (tayanch 8 da yozilmagan — shu qiymatlarni o'qing). **`pm-m10d6-kanallar.kanallar[].ruxsat`** — `'bor' | 'soraladi'`.
- **`tell` darvozasi:** texnik atama (SQL, `id`, backtik) faqat to'g'ri variantda bo'lsa — yiqiladi; matnni MD dan saqlab, atamani distraktorga ham qo'shing yoki backtikni olib tashlang, hisobotda yozing.
- **`lint:til` sen-imperativ:** agentga yoziladigan prompt sen-formada (MD aynan) — «och —» kabi joy error bersa, satrni ikkiga bo'lish yo'li bilan A darslari hal qildi (T-002 istisnosi); matnni o'zgartirmang.
- **`rgba(255,79,40,…)` → `fon(T.accent, …)`** (skeletda 29 joy), `practice: ou(eyebrow)` — skelet tuzoqlari, hammasi yopilsin.
- **Kichik telefon (170×272) ichiga uzun matn sig'maydi** (6-dars 4-ekran) — telefonda faqat qisqa ko'rinish, to'liq matn yonidagi kartada yoki yakunda keng oynada; mayda shrift bilan tiqmang.
- **Darslararo kalitlar** — `node feedback/F-1006-12modul/vositalar/darslararo.mjs` (A uchun yozilgan) namunasi: o'quvchi dars yozuvchi dars kalitini haqiqatan ko'rsatishini brauzerda tekshiring (kalitni tayanch 8 shaklida qo'lda qo'yib).

## Darsga xos eslatmalar — B to'lqin (to'liq ro'yxat — MD «KOD»; «REPO» — sizniki emas)
- **8-dars** `PmDropOffLesson` (≤ 140): bitta vizual `QadamSanoq` (to'rt qadam 46 · 27 · 12 · 9, oraliq foizlari); s2 — uch oraliq tartibda; s5 Netflix `QVoqea` (nom qizil, logotipsiz, bankda yo'q son yo'q);
  s6 — bittadan karta, yozadi `pm-m10d8-qadamlar` (tayanch 8 aynan; 9, 10-darslar o'qiydi); A1 o'qiydi `pm-m10d1-lending.manzil`, `pm-m10d7-reja` (`qachon` kodlari — yuqorida); A2 «Qayerda» — `pm-m10d8-qadamlar` dagi ★ qadam.
- **9-dars** `RetentionDayLesson` (≤ 140): `QaytishSahna` — 2-pilot / 4-dars sahnasi yo'li bilan (nusxa); 0-ekran qulf ekrani + hisoblagich 46 · 17; 5-ekran `MATNLAR` bittadan + `KATAKLAR` ✓/✗; uch blok, har biri 4 band;
  o'qiydi `pm-m10d8-qadamlar`, `pm-m9d8-platforma`; yakun — bloklar holati va trekdan (rost; ✓ faqat 3-blokdan). Prompt matnlari (expo-notifications, `cancelScheduledNotificationAsync` va h.k.) — MD aynan.
- **10-dars** `PmUsersCheckLesson` (≤ 160): bitta vizual `HisobotVaraq` (holatlar, muhr); `MENTOR_HISOBOT` bitta manba; s6 Duolingo `QVoqea` (olov SVG, raqamsiz); s9 Neon maketi (chizilgan, logotipsiz) + SQL bo'sh joy bilan, kunlar formasi;
  s10 — yozadi `pm-m10d10-hisobot` (tayanch 8 aynan; 11, 12-darslar o'qiydi); o'qiydi `pm-m10d6-kanallar`, `pm-m10d7-reja`, `pm-m10d8-qadamlar`; s11 juft/yakka (`LiveGate` rejimi) — yakka yo'lni oxirigacha sinang.
- **11-dars** `PmPitchReviewLesson` (≤ 140): bitta vizual `PitchDalil` (manba oynasi rejimlari); `MENTOR_PITCH` bitta manba (A-7 aynan); s5 o'qiydi `pm-m9d16-pitch` (11-Modul — `src/9-Modull` da yozilishini grep bilan tekshiring);
  s6 o'qiydi `pm-m10d10-hisobot`; s7 — dalilsiz da'volar bittadan; yozadi `pm-m10d11-pitch` (12-dars o'qiydi). Kalitlar yo'q bo'lsa ham ekranlar ishlasin (Mentor misoli bilan).
- **12-dars** `PmGrowthPitchLesson` (≤ 160): `BeshDaqiqaSahna` + `OsishGrafigi` (bitta komponent; `buzilgan` holat); `JAMOA_PITCH` bitta manba; s6 Uzum `QVoqea`; s9 `HtmlCompiler` (grafik ustunlari — haqiqiy kompilyatorda sinang);
  s10 o'qiydi `pm-m10d11-pitch`; s11 `PitchTaymer` (5 daqiqa); yozadi `pm-m10d12-pitch` (tayanch 8 aynan). `INLINE_KEYS` — MD KOD 13.

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — faqat skelet klasslari.
- **Kesik, ⛶, skrol, pageerror:** `node feedback/F-1006-12modul/vositalar/kesik.mjs m10-NN src/10-Modull/<Fayl>.jsx` — **«JAMI topilma: 0»** bo'lishi shart (desk 1100, keng 1440, mob 390; ⛶ markazda).
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` va `SHOT_W=393 SHOT_H=844` bilan `…/mob`; bosishlar — `konveyer/vositalar/ekran.mjs`.
  Har suratni Read bilan ko'z bilan ko'ring; harakatli ekranlarda harakatdan OLDIN va KEYIN. **Har yozish oqimini va har harakatli tugmani brauzerda oxirigacha, haqiqiy click bilan (force'siz), `pageerror` tinglab sinang** (E 47, 51) —
  Playwright `playwright-core` + `/usr/bin/google-chrome`, `http://127.0.0.1:5174/#/lesson/m10-NN`; ekranga to'g'ridan o'tish: `localStorage` `ccProgress:<lessonId>` = `{ screen, answers: {}, total, savedAt: Date.now() }`, `liveSession:<lessonId>` = `{ mode: 'self' }`.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (boshqa agentlar ham shu scratchpad'da). Repo ildiziga vaqtinchalik fayl qoldirmang.
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali · KOD band-band · darvozalar aynan (buyruq va natija, kesik.mjs natijasi) · MD dan chetlashish (har biri sababi va SABOQ raqami) · «MD ga taklif» ·
  qolip taklifi · RU-qarz · faylingizdan tashqari ishlar (bo'lmasligi kerak) · surat yo'llari · **nimani tekshirmadingiz** (ochiq yozing).
- Faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Savol bermang — ikkilansangiz E → C → MD tartibida eng yaqin yechim va hisobotda yozing.
