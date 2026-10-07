# 11-Modul — pilot quruvchi topshirig'i (2 dars, 2 agent)

> «Qur» buyrug'i — foydalanuvchi, 06.10.2026 12:26 («qurishni unda boshlaymiz»). Agent ruxsati — alohida so'raladi; ruxsat vaqti jurnalga yoziladi.
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»).

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/9-Modull/`) | MD (`feedback/F-1005-11modul/`) | Ekran | Turi | Palitra | Namuna (faqat ko'rish, kod ko'chirilmaydi) |
|---|---|---|---|---|---|---|---|
| 1 | m9-01 | `PmTenIdeasLesson.jsx` | `01-PmTenIdeas-v3.md` | 15 | PM | `qolipRang('pm')` | 10-Modul `src/8-Modull/PmYearPathLesson.jsx` (fidbekdan keyin qayta qurilgan: bittalab karta, mustaqil ish, kartochka) · 9-Modul `src/7-Modull/PmProductProblemLesson.jsx` (QKod, `QKOD_ONG`) |
| 10 | m9-10 | `FoundationDayLesson.jsx` | `10-FoundationDay-v3.md` | 12 (8 + 3 blok + kartochka) | Loyiha kuni | `qolipRang('tex')` | 10-Modul `src/8-Modull/EventTrackingLesson.jsx` (telefon CHAPDA, konvert uchishi, QBlok) · 9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` (QBlok A1 shakli) |

Fayl skeletdan oldindan nusxalangan (`lessonId`: `pm-m9d1-v1` / `m9-10-v1`; LiveGate sarlavhasi tuzatilgan) va App.jsx ga ulangan — lokal serverda menyuda «11-Modul» ostida ochiladi.
`src/7-Modull` va `src/8-Modull` ni boshqa seanslar tahrirlaydi — ularni faqat o'qing.

## O'qish tartibi
1. `feedback/F-1005-11modul/QURUVCHI_SABOQ.md` — va u ko'rsatgan 9 va 10-Modul `QURUVCHI_SABOQ.md` lari TO'LIQ; 10-Modul fidbek rasmlari (o'z ekran turingizga o'xshashini) Read bilan.
2. `konveyer/2-QURUVCHI.md` (qoidalar, tartib, darvozalar, hisobot) + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1–3, 5–9-bo'limlar; 9 — o'z darsingiz raqami tilga olingan bandlar) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md` (nima uchun shunday yozilgan).
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi) va `src/qolip/QOLIP.md`.
4. Namuna fayllari — faqat qanday yechilganini ko'rish uchun (grep/sed oraliq); kod bo'lagi ko'chirilmaydi.

## Darsga xos eslatmalar
- **1-dars** (MD «B. KOD» 1–15 — band-band):
  - `GoyaKarta` / `GoyaRoyxat` — bitta vizual, uch ko'rinish; 8-ekran ustaxonasi — bir vaqtda bitta katta karta (10-SABOQ 29), qolganlari ixcham qator; ✎ — o'sha g'oyani katta karta qiladi.
  - `pm-m9d1-goyalar` = `{ goyalar: [{ muammo, kim, yechim, manba }] × 10, savedAt }` (tayanch 8); o'qiydi `pm-m7d1-muammolar`, `pm-m7d3-mvp` — kalit yo'q bo'lsa ham ekran ishlaydi.
  - 6-ekran Starbucks — QVoqea: nom yashil (`Brend`), logotipsiz, uch bosqichli jonli sahna, bosqich gapi Mentorda; bashorat ballsiz, ixcham qatorga yig'iladi.
  - 9-ekran juftlik: `PairTimer` 1 daqiqa, parda «Ochish», yakka rejimda `MENTOR_GOYALAR[2]`; `pm-m9d1-goyalar` ga yozmaydi.
  - 10-ekran QKod: `storageKey="pm-m9d1-code"`, 3 shart MD dagidek, starter matnida backtik yo'q; tekshiruv funksiyalarini `node` da MD namunalari bilan sinang (to'g'ri va xato yechim).
  - `HwCard` — yangi (yorliqlar «Kim bilan · Nechta · Muddat»), yakunda aynan shular. Nishon 4, arena 12 (✔ 3/3/3/3).
- **10-dars** (MD «KOD» 1–13 — band-band):
  - `POYDEVOR` + `PoydevorXarita` — bitta manba: telefon (uch ekran, qulf-quti `expo-secure-store`), Backend (uch yo'l, joy yorlig'i `localhost:3000 · laptop` → `….onrender.com · Render`), Database (uch jadval), «ilova ichi» (`mobil/.env`). Telefon CHAPDA, barqaror o'lcham.
  - 0-ekran — ikki telefon, «8 / 10» → «9 / 10» faqat 1-telefonda, orada «umumiy joy — hali yo'q»; 2 va 4-ekran — uch tugma navbat bilan, konvert uchadi, qator kiradi (10-SABOQ 19).
  - A1–A3 — `ScreenBlok` + `QBlok` + `QPrompt`, har blok 4 qadam; `{…}` + kulrang «masalan: …» (o'z faylingizda — QURUVCHI_SABOQ C); trek `pm-m9d8-platforma`; «Ortda qoldingizmi» `m11-dars-10-done`.
  - Kartochkalar alohida `sflash` ekran (12 karta); yakunda uyga vazifa yo'q; `narrow` faqat 3, 5, 6-ekranlarda. RECAPS 2, nishon 3.

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` — o'z faylingiz bo'yicha 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — faqat skelet klasslari.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q») va `SHOT_W=393` bilan `…/mob`.
  Bitta ekran va bosishlar: `CHROME=/usr/bin/google-chrome SHOT_W=1280 SHOT_H=800 node .shot10.tmp.mjs <fayl> <ekran>` (env `CLICK='sel1,sel2'`, `CLICK_WAIT`, `SHOT_WAIT`; zsh: o'lchamni alohida o'zgaruvchi bilan).
  Har suratni Read bilan ko'z bilan ko'ring; harakatli ekranlarda harakatdan OLDIN va KEYIN surati. Keys ekrani (1-dars 6) `PmLesson22`/`PmLesson25` bilan yonma-yon.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (ikkinchi agent scratchpad'ni baham ko'radi).
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali (qolip turi, «4/4») · KOD ro'yxati band-band · darvozalar aynan · MD dan chetlashish va «MD ga taklif» · qolip taklifi · RU-qarz · faylingizdan tashqari ishlar · surat yo'llari.
- Turn-byudjeti ≤ 120; faylni qayta-qayta to'liq o'qima (grep/sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
