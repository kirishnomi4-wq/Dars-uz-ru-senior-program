# 3 · Sadoqat-tekshiruvi: kod ↔ MD v3 (faqat O'QISH, TUZATMAYSIZ)

Savol: **darsdagi o'quvchi ko'radigan o'zbekcha matn va ekran xatti-harakati tasdiqlangan MD v3 bilan mosmi?** Faqat Read / Grep / Bash (`git diff`, `grep`, `sed -n`).

## Kirish
- MD: `feedback/<modul>/NN-<Nom>-v3.md` (to'liq). Karta: `konveyer/QURISH_KARTASI.md` (T · P · S, PM darsda + PM).
- Kod: `<FAYL>` (bo'lib bir marta o'qing; keyin grep/sed). O'zgarishlar: `git diff -- <FAYL>`.
- Quruvchi aytgan chetlashishlar: modul jurnalidagi shu dars qatorlari.

## Nimani tekshirasiz (MD tartibida ekranma-ekran; keyin nishonlar, RECAPS, arena, kartochkalar, yakun)
1. **QOLIB KETGAN** — MD'dagi matn kodda yo'q yoki eski holatda.
2. **CHETLASHGAN** — kodda bor, lekin MA'NOSI MD'dan farq qiladi (darvoza sababli kichik o'zgarish, ma'no saqlangan — «OQLANGAN»).
3. **QOLDIQ** — `uz` da MD'da yo'q eski gap/atama; MD «olib tashlanadi» degan blok kodda ko'rinadi.
4. **TUR** — ekran MD'dagi qolip turida emas (o'z `div.screen` maketi, o'z tugmasi); «Harakat → Vizual o'zgarish» bajarilmagan (harakat vizualni o'zgartirmaydi,
   faqat matn-karta chiqadi); tugagach panel yopilmaydi (199).
5. **KALIT** — `git diff` da `INLINE_KEYS`, `correctIdx`, `QUIZ_BANK correct` (bor dars) o'zgarmagan; `Q_LABELS` = ballik ekranlar; MD ✔ variant kodda o'sha pozitsiyada.
6. **SIZ-FORMA va EMOJI** — buyruqlar «-ing/-ng», zanjir/yorliq ot-shaklda; o'quvchi yuzasida emoji yo'q (o'yin qatlamidan tashqari).
Ruscha (`ru:`) TEKSHIRILMAYDI — 6-RU bosqichi. Vaqtinchalik fayllar — scratchpad ichida `<NN>-sadoqat/`.

## Hisobot (jadval)
| ekran | tur (QOLIB KETGAN / CHETLASHGAN / QOLDIQ / TUR / KALIT / SIZ-FORMA / EMOJI) | file:line | MD'da | kodda |
Oxirida: jami; «OQLANGAN» ro'yxati; quruvchi chetlashishlariga baho; hukm **MOS** (0 topilma) yoki **QAYTARISH** (ro'yxat). Turn-byudjeti ≤40.
