# 6-Modul · Quruvchi topshirig'i (konveyer 3-bosqich) — `konveyer/2-QURUVCHI.md` ustiga 6-Modulga xos qism (05.10.2026, F-1004-64)

Siz bitta darsni tasdiqlangan MD v3 ga keltirasiz. **Faqat o'z `.jsx` faylingiz va o'z MD v3 faylingiz.**

## O'qish tartibi (bir marta)
1. `konveyer/2-QURUVCHI.md` — qoidalar, tartib, darvozalar, hisobot formati (ASOSIY).
2. `feedback/F-0929-QA-6modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari (MAJBURIY; MD bilan zid bo'lsa — shu fayl yutadi). Modul bo'yi + o'z darsingiz bo'limi.
3. O'z MD v3: `feedback/F-0929-QA-6modul/NN-<Nom>-v3.md` — to'liq.
4. `src/qolip/QOLIP.md` va namuna `src/6-Modull/SystemArchitectureLesson.jsx` (1-dars — qolipga o'tkazilgan bor dars; ekran turlari, `useTugadi`, `Zoomable`, `qolip-maket`, `QKartochka`/`QYakun` ulanishi). Grep/sed bilan — butun faylni qayta-qayta o'qimang.
5. `konveyer/QURISH_KARTASI.md` — U · K · J (PM darsda + PM).

## 0-qadam — MD'ni qarorlarga moslash (kodga tegishdan oldin)
`GATE_M_JAVOB.md` dagi o'z darsingizga va modul bo'yiga tegishli bandlarni MD v3 ga qo'llang (faqat shu bandlar: atama «Database», «chegara», repo nomlari
`taom`/`manba`/`BACKEND`, teglar va `git fetch … --tags` qatori, 4-variant, uyga vazifa olinishi, dars nomlari). MD oxiriga bo'lim qo'shing:
`## GATE M javobi qo'llandi (05.10)` — band · nima o'zgardi (1 qatordan). «## Foydalanuvchi hal qiladigan savollar» bo'limini «hal qilindi: A» deb belgilang.

## 1-qadam — kod (konveyer/2-QURUVCHI.md bo'yicha)
- **Bor dars → qolipga o'tkazish:** infra (Stage, jonli ball, QuestionScreen, arena, podium) faylingizda qoladi; ekran tanalari qolip turlariga ko'chadi.
  `gates:qolip` q16 (qolipsiz dars) — sizning faylingizda 0 bo'lishi kerak; q13–q23 — 0.
- **Testlar:** ✔ o'rni (`INLINE_KEYS`, `correctIdx`, arena `correct`) o'zgarmaydi. MD ekran soni o'zgargan darsda (G3) — MD'dagi «eski → yangi» jadvali bo'yicha kalitlar ko'chadi.
- **Amaliyot bloki** (04, 08, 09, 10, 11, 13; 03/05/07 amaliyot ekrani ham): `QBlok` (qolip) + darsdagi ulagich `ScreenBlok` — namunasi `src/skelet/NamunaDars.jsx` da
  (asosiy seans qo'shadi; topshiriq xabarida «QBlok tayyor» deyilmagan bo'lsa, blok ekranlarini oxirgi navbatga qoldiring).
- **Repo'ga TEGILMAYDI** (`/home/kali/Desktop/TelegramBotNest` — repo-agent ishi). Endpoint/fayl nomlari — `GATE_M_JAVOB.md` M-q3 bo'yicha.
- **Matn o'lchovi** (162/164): faylingizda `lint:olchov` ogohlantirishi 0 ga intiling; sarlavha bitta qator.
- **Fon so'zlari** (R-008): arena/banner so'zlari `{ uz, ru }`.
- **Menyu/App.jsx** — TEGILMAYDI (asosiy seans). Dars ichidagi «keyingi dars» nomi — `GATE_M_JAVOB.md` oxiridagi yangi nomlar.
- PM darsda `HwCard`/uy vazifasi o'zgarmaydi. `*.homework.jsx` — TEGILMAYDI.
- `ru`: yangi/o'zgargan `uz` ga qisqa ruscha (bo'sh qolmasin) — sifat 6-RU bosqichida.

## Yakun (hammasi toza shart)
`npm run gates -- <FAYL>` **12/12** · `npm run lint:jsx` 0 · `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <FAYL> $S/<NN>-quruvchi/desk` — hamma ekran «xato: yo'q»,
4–6 asosiy ekranni Read bilan ko'ring (harakat → vizual ekranlari albatta). Vaqtinchalik fayllar — `$S/<NN>-quruvchi/` (S — scratchpad).
Turn-byudjeti ≤130. Commit YO'Q. Hisobot — `konveyer/2-QURUVCHI.md` formatida + «0-qadam: MD'ga qo'llangan qarorlar» ro'yxati.
