# 12-Modul — pilot quruvchi topshirig'i (2 dars, 2 agent)

> «Qur» buyrug'i — foydalanuvchi, 06.10.2026 («shu qurishni boshla, 2 ta pilotni ko'rib fidbek beraman»). Agent ruxsati — alohida so'raladi; ruxsat vaqti jurnalga yoziladi.
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»).

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/10-Modull/`) | MD (`feedback/F-1006-12modul/`) | Ekran | Turi | Palitra | Namuna (faqat ko'rish, kod ko'chirilmaydi) |
|---|---|---|---|---|---|---|---|
| 1 | m10-01 | `PmLandingLesson.jsx` | `01-PmLanding-v3.md` + `01-FILTR.md` | 16 | PM (K3 Instagram) | `qolipRang('pm')` | 11-Modul `src/9-Modull/PmTenIdeasLesson.jsx` (PM pilot, fidbekdan keyin qayta qurilgan: keys sahnasi, bittalab karta, kartochka) · `PmPrdLesson.jsx` (mustaqil ish, tekshiruvlar) · `FoundationDayLesson.jsx` (telefon maketi, QBlok) |
| 2 | m10-02 | `WebSocketBasicsLesson.jsx` | `02-WebSocketBasics-v3.md` + `02-FILTR.md` | 20 | TEX (cho'qqi) | `qolipRang('tex')` | 10-Modul `src/8-Modull/EventTrackingLesson.jsx` (telefon CHAPDA, konvert uchishi, QBlok) · 11-Modul `src/9-Modull/PlatformChoiceLesson.jsx` (TEX, QKod, sudrash) · `FoundationDayLesson.jsx` (ikki telefon, «8 / 10» → «9 / 10») |

Fayl skeletdan oldindan nusxalangan (`LESSON_META`: `pm-m10d1-v1` / `m10-02-v1`, export nomi, palitra, LiveGate sarlavhasi qo'yilgan; `npm run gates` 12/12) va App.jsx ga ulangan —
lokal serverda (`localhost:5173`) menyuda oxirgi modul ostida ochiladi. `src/7-Modull`, `src/8-Modull`, `src/9-Modull` ni boshqa seanslar tahrirlaydi — ularni faqat o'qing.

## O'qish tartibi
1. `feedback/F-1006-12modul/QURUVCHI_SABOQ.md` — va u ko'rsatgan 9, 10, 11-Modul `QURUVCHI_SABOQ.md` lari TO'LIQ; fidbek rasmlaridan o'z ekran turingizga o'xshashlarini Read bilan.
2. `konveyer/2-QURUVCHI.md` (qoidalar, tartib, darvozalar, hisobot) + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1.0 va o'z darsingiz bo'limi, 2, 3, 8; 9-bo'limda — o'z darsingiz raqami tilga olingan bandlar) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md`.
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi) va `src/qolip/QOLIP.md`; karta `konveyer/QURISH_KARTASI.md` (U · K · J).
4. Namuna fayllari — faqat qanday yechilganini ko'rish uchun (grep / sed oraliq); kod bo'lagi ko'chirilmaydi.

## Darsga xos eslatmalar (to'liq ro'yxat — MD ning «KOD» bo'limi, band-band)

- **1-dars** (MD «B. KOD» 1–15; 16 — REPO, sizniki emas):
  - Bitta vizual `LendingSahifa` (brauzer ramkasi + sahifa + ichida `JamoaTelefon`), olti holat; manba `MENTOR_LENDING`, `MENTOR_PRD`, `JUFTLIKLAR`. Sahifadagi uch foyda — juftliklarning o'zi (tayanch 9.2).
  - 0 va 1-ekran: MD «sarlavha joyi — kulrang uzuq qator», «skelet … matnsiz» deydi → SABOQ 33 bo'yicha: bo'sh kulrang chiziqlar yo'q; 0-ekranda sahifada haqiqatan bor narsa (nom, telefon, tugma) ko'rinadi va sarlavha yo'qligi seziladi,
    1-ekranda reja vizuali — reja qatorlarining o'z so'zlari bilan. 2-ekran kashfiyoti («kim uchun va nima foyda») ochilmasin. Odam (0-ekran) — SABOQ 36.
  - 7-ekran Instagram — `QVoqea`: «Instagram» o'z rangida, «Burbn» neytral to'q, logotipsiz; sahnada son — faqat bank soni (25 000) va sana; bashorat ballsiz, ixcham qatorga yig'iladi.
  - 9-ekran: `pm-m10d1-lending` (tayanch 8 aynan: `nom`, `hodisa` — tugma yozuvidan yasaladi va tahrirlanmaydi, `sinov.tur: 'sherik' | 'mashq'`, `sinov.mos`); tekshiruvlarni `node` da kamida 8 namuna bilan sinang (PM-032).
  - 10-ekran: `BeshSoniya` taymeri va parda; juftlik / yakka rejim matnlari MD dagidek; «5 soniya — shu mashqning qoidasi».
  - 11-ekran: `QBlok` 4 qadam + `QPrompt`; Umami ulanishi darsda yo'q — uyga vazifa ② (01-FILTR 11); Netlify va Antigravity — chizilgan, logotipsiz; tugma nomi taxmin qilinmaydi (MD dagi so'zlar).
  - Yakun — to'rt holat + sinov chipi; `HwCard` yangi. Nishon 4, arena 12 (✔ A·B·C·D ×3 — MD dagi o'rinlar), `RECAPS` 3/5/8/12.
- **2-dars** (MD «KOD» 1–16; REPO — sizniki emas):
  - Bitta vizual `IkkiTelefonSahna` («1-telefon · siz» CHAPDA, Backend tuguni «Database: N», «2-telefon · boshqa o'yinchi»; chiziq holatlari va konvert turlari) — manba `SAHNA`, `NAMUNA_OYIN`, `MENTOR_SXEMA`, `HODISA_YOLI`, `BELGILAR`.
    Ulanish belgisi `UlanishBelgisi` — uch yozuv aynan: «Ulangan» · «Ulanmoqda…» · «Ulanmagan». 4 va 5-ekran bitta sahna holatidan.
  - 2-ekran: pastga tortish — sudrash (pointer events) + klaviatura / tugma yo'li; yashirin bosish bo'lmasin (SABOQ 34): navbatdagi harakat halqada, Mentor shuni aytadi.
  - 9-ekran `QKod` → `HtmlCompiler`, uch fayl (`index.html`, `namuna.js` tayyor; `app.js` — pastini o'quvchi yozadi). Skelet tuzog'i: kompilyator faqat birinchi JS faylni ulaydi, tekshiruv async ni kutmaydi — yechimingizni haqiqiy kompilyatorda sinang
    (boshlang'ich kod 0 shart, namuna yechim hamma shart, noto'g'ri yechim yiqiladi) va hisobotda qanday hal qilganingizni yozing. Shartlar — SABOQ 37. Starter matnida backtik yo'q.
  - 13-ekran: `pm-m10d2-sxema` = `{ qatorlar: [{ id, nuqta, kimNima, hodisa, kimOladi, ekranda }] }`, `id` barqaror; bitta katta karta ketma-ket (SABOQ 29).
  - 14-ekran — final `QTartib` (sentinel `0`), `scope: 'final'`. 15, 16-ekran — `ScreenBlok` + `QBlok` + `QPrompt`; «Ortda qoldingizmi» — faqat 15-ekranda (SABOQ 39); A1 «Ulgurmasangiz» yo'li va blok bayrog'i — tayanch 9.36 h.
  - `RECAPS` 5 (3, 6, 8, 11, 14), `Q_LABELS` shu kalitlar, nishon 4, arena 12; kartochkalar alohida ekran (18); yakun — texnik standart (192/204), holatga qarab.
  - Fayl katta (20 ekran): ekranma-ekran yozing, har 3–4 ekrandan keyin `esbuild`; turn tugab qolsa — to'xtab, nima qolganini hisobotda aniq yozing (chala ekranni «tayyor» demang).

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` — o'z faylingiz bo'yicha 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — faqat skelet klasslari.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q») va `SHOT_W=393 SHOT_H=844` bilan `…/mob`.
  Bitta ekran va bosishlar: `node konveyer/vositalar/ekran.mjs <fayl> <scratchpad>/<NN>-qurish/c "<ekran>:<selektor>|<selektor>*3"` (W/H — `SHOT_W`, `SHOT_H`).
  Har suratni Read bilan ko'z bilan ko'ring; harakatli ekranlarda harakatdan OLDIN va KEYIN surati; ⛶ ni bosib kattalashganini ham. Keys ekrani (1-dars 7) `PmLesson22` / `PmLesson25` bilan yonma-yon.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (ikkinchi agent scratchpad'ni baham ko'radi).
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali (qolip turi, «4/4») · KOD ro'yxati band-band · darvozalar aynan (buyruq va natija) · MD dan chetlashish (har biri sababi va SABOQ raqami bilan) va «MD ga taklif» ·
  qolip taklifi · RU-qarz · faylingizdan tashqari ishlar · surat yo'llari · **nimani tekshirmadingiz** (ochiq yozing).
- Turn-byudjeti: 1-dars ≤ 130, 2-dars ≤ 160; faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
