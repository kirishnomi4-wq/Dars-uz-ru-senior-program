# 6-Modul · MD v3 topshirig'i (13 dars, G1–G4) — konveyer `1-MD.md` ustiga 6-Modulga xos qism (04.10.2026, F-1004-63)

Siz bitta dars uchun `feedback/F-0929-QA-6modul/NN-<Nom>-v3.md` yozasiz. **Kodga tegilmaydi** (`.jsx` — faqat o'qish). Boshqa fayllar — TEGILMAYDI.

## O'qish tartibi (bir marta, to'liq)
1. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
2. **Namuna:** `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md` (1-dars pilot — foydalanuvchi ko'rgan va ma'qullagan; uslubni shundan oling).
3. Darsingizning `feedback/F-0929-QA-6modul/NN-<Nom>-v2.md` (asos) va kodi `src/6-Modull/<Fayl>.jsx` (hozirgi holat — grep/sed bilan, butun faylni qayta-qayta o'qimang).
4. QA fidbeki: `grep -n "m6-NN\|<Nom>" feedback/F-0929-QA-6modul/JURNAL.md` — sizning darsingizga tegishli F-1004 topilmalari (hammasi MD'da hisobga olinadi).
5. `konveyer/QURISH_KARTASI.md` — T · P · S (PM darsda + PM) guruhlari.

## 6-Modul qarorlari (foydalanuvchi tasdiqlagan — o'zgartirilmaydi)
- **F-1004 Q1 A:** HAR tushuncha-ekran harakat-ekranga aylanadi: o'quvchi bitta ish qiladi → vizual o'zgaradi (DE-184). «Bosasiz → yangi matn-karta» yo'q. Har ekran ostida
  **Harakat → Vizual o'zgarish** qatori. Ish tugagach harakat paneli yopiladi, natija fokusga (199). Iloji bo'lsa ballsiz bashorat (181).
- **Bitta vizual dars bo'yi** (163/180): pilotdagi tizim xaritasi kabi — darsning bitta chizilgan maketi/xaritasi (CSS/SVG, logotip va emoji yo'q — F-1004 Q3 A, D4).
- **Matn o'lchovi** (162/164, MK §225): sarlavha bitta qator ≤55, Mentor ≤2 gap va sarlavhani takrorlamaydi, xulosa ≤110, hook javobi ≤120, xato izohi ≤60.
  Hozirgi kodda 6-Modulda 200 ta o'lchov ogohlantirishi bor — MD v3 ularni yopadi.
- **Toza yuza** (185, D4): tugma/variantda emoji yo'q. **Rang** (D3): faqat holat foni. **Siz-forma**, zanjir/yorliq ot-shaklda (§222/224).
- **Testlar:** ballik testlarda ✔ O'RNI o'zgarmaydi (`INLINE_KEYS`, `correctIdx` — kodda qarang, MD'da kalit qatorini yozing); variantlar uzunligi teng.
  Arena 12 savol — kodda qanday bo'lsa (✔ o'rni o'zgarmaydi), faqat matn sifati.
- **Fon so'zlari** (R-008): arena/banner so'zlari ikki tilda — MD'da «Fon so'zlari: …» qatori (uz; kod bosqichida {uz,ru}).
- **Menyu nomi = dars nomi** (DE-205): sarlavha `App.jsx` dagi nom bilan bir xil; o'zgartirsangiz — «KOD: App.jsx nom» belgisi.
- Uyga vazifa yakun ekranida (QYakun `uyga`), PM darsda — HwCard (o'zgarmaydi, faqat xabar qilinadi).

## Guruhga xos
- **G1 texnik (03 ArchPatterns · 04 AgentArchitecture · 05 ClaudeSkills · 07 WriteSkill):** 20 ekranli kod-darsi tuzilmasi qoladi; tushuncha-ekranlar harakatli.
  Amaliyot ekrani (16) — 173-qonun: bloki repo ustida yoki o'z kompyuteridagi aniq ish (Claude Skills — haqiqiy `SKILL.md` fayli); «KOD» bilan.
- **G2 mobil (09 ReactNativeBasics · 10 ReactNativeApp):** amaliyot repo-blokiga (F-1004 Q6 A, 173): o'quvchi o'z kompyuterida Expo ilovasini ochadi va
  `TelegramBotNest` dagi AvtoPizza backend'iga ulaydi (bitta backend — ko'p kirish yo'li, 1-dars g'oyasi). Repo teglari nomi: `dars-6-09-start/done`, `dars-6-10-start/done`.
  Repo'da nima bo'lishi kerakligini «REPO» belgisi bilan yozing (masalan `mobile/` papka, `GET /menyu` endpoint).
- **G3 loyiha kunlari (08 PipelineProject · 11 MobileAppPractice · 13 FullSystemProject):** **172-qonun qolipi** — 8 ekran + 3 amaliyot bloki = 11 ekran
  (0 hook · 1 «bugun quramiz» (tayyor natija + 3 qadam + repo teglari) · 2 tushuncha-1 · A1 · 3 test-1 · 4 tushuncha-2 · A2 · 5 test-2 · A3 · 6 podium · 7 yakun).
  Repo — `TelegramBotNest` davomi (F-1004 Q5 A; `/home/kali/Desktop/TelegramBotNest`, oxirgi teg `dars-10-done`). Teglar `dars-6-NN-start/done`.
  Namuna: `feedback/F-1002-mexanizm/05-BotAiProject-v2.md` (MD) va `src/5-Modull/BotAiProjectLesson.jsx` `ScreenBlok` (kod). Har blok: 4 qadam · prompt qutisi `{…}` ·
  kutilgan natija (chat/terminal/ekran) · «Ortda qoldingizmi — `git checkout -f dars-6-NN-done`». Tushib qolgan ekranlar — kartochkalar/YAKUNIY arxiviga (✎ bilan).
  Ballik testlar 2 ta (3 va 5), arena 12 savol saqlanadi. «REPO» ro'yxati — repo'ga nima qo'shilishi.
- **G4 PM (02 PmLesson22 · 06 PmLesson23 · 12 PmLesson24 · 14 PmLesson25):** PM-107 — avval aniq misol yoki artefakt, keyin atama (bir marta); keys — «Biznes olamidan»,
  «{Brend} · N/M», chizilgan maket (PM-028/029). Mustaqil ish — QMustaqil. F-1004 PM 2-to'lqinida tuzatilganlar saqlanadi.

## Natija va hisobot
- Fayl: `feedback/F-0929-QA-6modul/NN-<Nom>-v3.md` (namuna formatida: A-bo'lim · ip va bitta vizual · har ekran «← QOLIP TURI» bilan · oxirgi bo'limlar · «KOD»/«REPO» ro'yxati).
- Har ekran sarlavhasi yonida belgilar soni `(NN)`. Har tushuncha-ekranda «Harakat → Vizual o'zgarish».
- GATE M ro'yxatini (`konveyer/1-MD.md`) o'zingiz belgilang — MD oxirida «## GATE M — o'z tekshiruvim» bo'limi (✓/✗ + izoh).
- **Hisobot (qisqa):** fayl · ekranlar soni · qaysi ekranlar qayta qurildi (tushuncha → harakat) · eng muhim 3–5 o'zgarish · «KOD»/«REPO» bandlari soni ·
  foydalanuvchi hal qilishi kerak bo'lgan savollar (agar bo'lsa — har biri 1 qator, tavsiya bilan). Turn-byudjeti ≤60. Vaqtinchalik fayllar — scratchpad ichida `NN-mdv3/`.
