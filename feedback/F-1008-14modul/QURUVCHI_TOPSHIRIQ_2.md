# 14-Modul — 2-to'lqin quruvchi topshirig'i (11 dars; 08.10.2026, F-1008-595)

> Buyruq — foydalanuvchi, 08.10: «2 ta pilot tugagach barcha darslarni qurishga ruxsat»; keyin «hammasini Opus da qildir, go, tez va sifatli» — model hamma darsda Opus.
> Har agent — faqat o'z fayli. Commit, push, deploy — YO'Q. MD, App.jsx, `src/qolip`, `src/skelet`, `src/live`, `konveyer/*`, boshqa darslar — TEGILMAYDI. Server ishga tushirmang/to'xtatmang (127.0.0.1:5176).
> Fayl skeletdan tayyor (`LESSON_META`, palitra, export nomi, LiveGate; gates 12/12), App.jsx ga ulangan: `http://127.0.0.1:5176/#/lesson/m12-NN`.

## O'qish (TEJAMKOR — faqat shular; 9–13-Modul SABOQ larini to'liq O'QIMANG, ularning muhimi pastdagi faylda jamlangan)
1. `feedback/F-1008-14modul/QURUVCHI_SABOQ.md` — **A4, C va P1–P11 (foydalanuvchi ko'rigi — eng muhimi)**.
2. `konveyer/2-QURUVCHI.md` · o'z MD (TO'LIQ, bir marta) + o'z `NN-FILTR.md` (⚠️ qatori) · `00-MODUL-TAYANCH.md` — 1.0, 1.14, o'z darsingiz 1.N, 2, 8 (o'z kalitingiz va o'qiydiganlaringiz), 9-bo'limda o'z dars raqamingiz tilga olingan bandlar, **9.91** · `00-TAQIQLAR.md`.
3. **Namuna — tasdiqlangan pilotlar (grep/sed oraliq, kod ko'chirilmaydi, darslar mustaqil):**
   PM: `src/12-Modull/PmInvestorPitchLesson.jsx` — `Investor` kartasi (`.ip-ivr`, P1) · `TartibJoy` karta dastasi (P4) · fokus ekranlarida nomlar bir qatorda (`.ip-fk-qator`) · 5-ekran «uchib boradi» (`.ip-uchar`, P3) · `.ip-sahna.katta` (P5) · kartochka/⛶ uslubi (P7, P10) · QMustaqil 6 bo'lak forma, detektorlar.
   TEX: `src/12-Modull/ProductSpeedLesson.jsx` — sahna, Lighthouse paneli, `ScreenBlok`/`QBlok`, `TartibDasta`, `.tz-blok.tugadi` (P9), tanish sayt maketi (9.91) — *bu fayl hozir qayta qurilmoqda; uni faqat o'qing*.
4. `src/skelet/NamunaDars.jsx` (faylingiz nusxasi) va `src/qolip/QOLIP.md` — kerak joyida.

## Darslar va to'lqinlar

| To'lqin | Dars | Kalit | Fayl (`src/12-Modull/`) | MD | Ekran | Palitra | Model | Turn |
|---|---|---|---|---|---|---|---|---|
| A | 2 | m12-02 | `PmStoryPitchLesson.jsx` | `02-PmStoryPitch-v3.md` | 15 | pm | Opus | ≤120 |
| A | 4 | m12-04 | `PolishDayLesson.jsx` | `04-PolishDay-v3.md` | 12 | tex | Opus | ≤120 |
| A | 5 | m12-05 | `PmPitchTrainingLesson.jsx` | `05-PmPitchTraining-v3.md` | 12 | pm | Opus | ≤110 |
| A | 6 | m12-06 | `DemoPrepLesson.jsx` | `06-DemoPrep-v3.md` | 12 | tex | Opus | ≤120 |
| B | 7 | m12-07 | `PmDemoTestLesson.jsx` | `07-PmDemoTest-v3.md` | 12 | pm | Opus | ≤120 |
| B | 8 | m12-08 | `PmFinalPitchLesson.jsx` | `08-PmFinalPitch-v3.md` | 12 | pm | Opus | ≤110 |
| B | 9 | m12-09 | `VideoPortfolioLesson.jsx` | `09-VideoPortfolio-v3.md` | 12 | tex | Opus | ≤120 |
| B | 10 | m12-10 | `PmFreelanceLesson.jsx` | `10-PmFreelance-v3.md` | 12 | pm | Opus | ≤110 |
| C | 11 | m12-11 | `PmProgramsLesson.jsx` | `11-PmPrograms-v3.md` | 12 | pm | Opus | ≤110 |
| C | 12 | m12-12 | `PmNextStepsLesson.jsx` | `12-PmNextSteps-v3.md` | 12 | pm | Opus | ≤110 |
| C | 13 | m12-13 | `PmDressRehearsalLesson.jsx` | `13-PmDressRehearsal-v3.md` | 12 | pm | Opus | ≤120 |

## Har dars uchun (eng muhim — foydalanuvchi buni ko'rib baholaydi)
- **MD = manba-haqiqat** (o'quvchi ko'radigan `uz` — MD dan so'zma-so'z), MD «KOD» bo'limi band-band; MD ↔ SABOQ P ziddiyatida — SABOQ P (vizual), matn MD dan; har chetlashish hisobotda.
- **P1:** MD dagi «uchta qiyofa», «hakam pufaklari», «kichik qiyofalar» → bitta urg'uli rol kartasi (01 `Investor` naqshi; rol nomi MD dagi rol — 5, 8, 13-darslarda «hakam», belgi — odam figurasi emas). Ko'p odam — doirachalar qatori.
- **P4/P8:** gap/ish tartiblash — karta dastasi (bittadan oq karta, «n / N», uyani bosish yoki sudrash); to'q to'ldirilgan chip — faqat kod bo'lagi.
- **P3, P11:** «uchadi / to'ladi / o'zgaradi» deyilgan harakat ekranda ko'rinib sodir bo'ladi; maket katta va tanish, bo'sh/«—» to'la joy yo'q; tugagach sahna butun enga.
- **P5:** sahna matni ≥14px, asosiy natija 15px, «…» bilan kesilmaydi. **P7:** ⛶ vizual burchagida. **P10:** kartochka neytral. **P9:** blok tugagach kam element.
- **9.91 (texnik darslar 4, 6, 7):** sahnada sayt xatti-harakati (yuklanish, bo'sh holat, xato, sekinlik) ko'rsatilsa — tanish sayt soddalashtirilgan maketi, sonlar faqat `vositalar/olchov-2026-10-08.json` dan (sana, «bir o'lchov»), logotip/skrinshot/sayt haqida baho yo'q. **Demo mavzusi — o'quvchining va Mentorning o'z mahsuloti (MD dagi «Maydon Jamoa» demo ssenariysi) — qoladi.** Ikkilansangiz — MD, hisobotda yozing.
- **P6 — tugagan holat 1280×800 ga sig'adi — o'zingiz o'lchang:** `N=12 node feedback/F-1008-14modul/vositalar/yur.mjs m12-NN <lessonId> <ekran> 1280 800 <scratchpad>/NN-qurish/sK "t=<tugma>" "s=<css>" "w=<ms>" "shot=nom" "m=.q-xulosa"` — `.q-xulosa` pastki chegarasi ≤ 722; Read bilan ko'ring. (02-dars: `N=15`.)
- Detektorlar (PII, `{…}`, pul so'zlari — MD dagi) — PM-108: `node` da kamida 10 namuna.

## Tekshiruv (hammasi toza; hisobotga aynan) — tejamkor
`npm run gates -- <fayl>` 12/12 · `npm run -s lint:jsx` toza · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · `node feedback/F-1008-14modul/vositalar/kesik.mjs m12-NN <fayl> desk mob` 0 ·
`SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/NN-qurish/desk` (hamma ekran «xato: yo'q»; 4–5 asosiysini Read bilan) · harakatli ekranlar — `yur.mjs` bilan oxirigacha (yuqorida). Mobil suratni faqat 2–3 ekranga.
Vaqtinchalik fayllar — faqat `/tmp/claude-1000/-home-kali-Desktop-internetLesson/5f3d18e7-c151-4318-b2c5-70d13245287d/scratchpad/NN-qurish/` (boshqa papkalarga tegmang).
CSS shablon-satri ichida (izohda ham) BACKTIK YO'Q · bir qatorli funksiyada `//` yo'q · kirill/belgilarni to'g'ridan-to'g'ri yozing · `tr()` modul darajasida chaqirilmaydi · regex ikki tilli.

## Hisobot (qisqa)
Ekranlar jadvali (qolip turi, holat) · MD «KOD» band-band · darvozalar aynan · `yur.mjs` o'lchovlari (har tushuncha ekrani `.q-xulosa` pastki chegarasi) · MD dan chetlashish (sabab, SABOQ raqami) va «MD ga taklif» · qolip taklifi · RU-qarz · faylingizdan tashqari ishlar · **nimani tekshirmadingiz** (ochiq).
