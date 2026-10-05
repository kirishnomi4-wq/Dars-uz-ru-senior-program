# 2 · Quruvchi — MD v3 → kod, skeletdan (bitta dars = bitta agent = bitta fayl)

Vazifa: `<FAYL>` darsini tasdiqlangan (GATE M) MD v3 ga keltirish. **MD = manba-haqiqat.**

## Manba
- MD: `feedback/<modul>/NN-<Nom>-v3.md` — TO'LIQ, bir marta o'qing. `✎`, «Harakat → Vizual o'zgarish», «KOD» — ko'rsatma (kodga matn sifatida yozilmaydi).
- Qolip: `src/qolip/QOLIP.md` (ekran turlari, maydonlar). Karta: `konveyer/QURISH_KARTASI.md` — U · K · J guruhlari.
- **Yangi dars:** `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` — importlar o'zgarmaydi. Skelet boshidagi «ALMASHTIRILADI» ro'yxati — sizning ish-ro'yxatingiz.
- **Bor dars (qolipga o'tkazish):** infrasi o'zida; ekranlar qolip turlariga ko'chiriladi (namuna: `src/6-Modull/SystemArchitectureLesson.jsx`).

## Qoidalar
1. **Ekran = qolip turi.** Har ekran MD'dagi turdan: `QKirish` · `QReja` · `QTushuncha` · test — `QuestionScreen` (ichida `QTest`/`QTestJavob`) · `QTartib` ·
   `QKod` · `QVoqea` · `QMustaqil` · `QNatija` · `QKartochka` · `QYakun`. O'z `div.screen` maketi, o'z tugma klassi, o'z kartochka/yakun nusxasi — YO'Q
   (`gates:qolip` q14/q15/q20/q21). Darsning o'z vizuali (xarita, maket) — bitta manbadan (massiv), bosiladigan klassi `// qolip-maket: <klass>` da.
2. **Rang:** faqat `T = { ...qolipRang('tex'|'pm'), shadowBase }` tokenlari (q13). Fon — faqat holat: tanlangan accentSoft, to'g'ri okFon, xato errFon.
3. **Matn:** o'quvchi ko'radigan har `uz` satr MD bilan aynan bir xil. Yangi elementga `ru` — qisqa ruscha (bo'sh qolmasin); `ru` sifati — 6-RU bosqichi.
4. **Kalitlar:** `INLINE_KEYS` s-kalitlari = SCREEN_META `scored: true` (keys) · `Q_LABELS` kalitlari = ballik ekran indekslari (q22) · `RECAPS` kaliti = ekran indeksi,
   har ballik testga 3 karta · arena `QUIZ_BANK` 12 savol, to'g'ri javob 3/3/3/3 · bor darsda ✔ o'rni o'zgarmaydi.
5. **Harakat → vizual:** tushuncha-ekranda o'quvchi harakati vizualni o'zgartiradi; tugagach `useTugadi` (199) — harakat paneli yopiladi, natija fokusga.
   Har vizual `zoom={Zoomable}` bilan (q17), tugagach holat `tugadi` (q18).
6. **Emoji (D4):** o'quvchi yuzasida yo'q. Qoladi: o'yin qatlami (arena, nishon medali, podium), tugma-belgilar `▶ ✓ ✕ ↻ → ←`.
7. **Faqat shu fayl.** `App.jsx`, `src/live/*`, `src/qolip/*`, boshqa darslar — TEGILMAYDI (kerak bo'lsa — hisobotga). Qolipga yangi tur kerak bo'lsa — hisobotga.
8. **Jim-buzilish:** CSS shablon-satri ichida (izohda ham) BACKTIK yo'q; bir qatorli funksiya ichida `//` izoh yo'q; `<p>` ga klass qo'ysangiz selektor `p.<klass>`
   (`.lesson-root p` reseti padding'ni yeydi — jsx-lint). Commit yo'q.
9. Savol bermang — ikkilansangiz MD'ga eng yaqin yechim, hisobotga «chetlashish/ikkilanish».
10. Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-quruvchi/` (parallel agentlar scratchpad'ni baham ko'radi).

## Tartib (token tejash)
MD (bir marta) → fayl katta bo'laklarda BIR MARTA → keyin faqat `grep -n` / `sed -n` → ekranma-ekran 0 → N → nishonlar, RECAPS, arena, kartochkalar, yakun →
«KOD» ro'yxati band-band. Har 3–4 ekrandan keyin: `npx esbuild <FAYL> --loader:.jsx=jsx --log-level=error > /dev/null`.
Oxirida (hammasi toza shart):
- `npm run gates -- <FAYL>` — **12/12**
- `npm run lint:jsx` — 0
- surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <FAYL> <scratchpad>/<NN>-quruvchi/desk` — hamma ekran «xato: yo'q»; 4–5 ta asosiy ekranni Read bilan ko'ring.
Turn-byudjeti ≤110 tool-chaqiruv.

## Hisobot (qisqa)
1. Ekranlar 0…N — ✓ / qisman (nima qoldi) · qaysi qolip turi.
2. «KOD» ro'yxati — har band: bajarildi / qisman / yo'q + sabab.
3. Darvozalar: gates N/12, lint:jsx, surat (xato soni).
4. Kalitlar: keys, q22, RECAPS, QUIZ_BANK 3/3/3/3; bor darsda ✔ o'rni o'zgarmadi (ha/yo'q).
5. MD'dan chetlashish (sabab bilan) va ikkilangan joylar.
6. RU-qarz: yangi/o'zgargan `uz` satrlar soni.
7. Faylingizdan tashqariga chiqadigan ishlar (App.jsx, qolipga yangi tur va h.k.).
