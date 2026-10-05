# 6-Modul · Kichik tuzatishlar (yopishdan oldin, F-1004-65, 05.10.2026) — QAYTA QURISH YO'Q

Foydalanuvchi qarori: 6-Modul darslari **hozirgi kodida qoladi** (MD v3 bo'yicha qayta qurilmaydi). Faqat quyidagi kelishilgan kichik tuzatishlar.
Ekranlar soni, tuzilma, mexanika, kalitlar (`INLINE_KEYS`, `correctIdx`, `QUIZ_BANK` `correct`, `Q_LABELS`, `RECAPS` kalitlari) — O'ZGARMAYDI.
Faqat o'zingizga berilgan fayl(lar). `App.jsx`, `src/qolip`, `src/live`, `src/skelet`, boshqa darslar, MD fayllar, repo — TEGILMAYDI. Commit YO'Q.

## Bandlar (qaysi darsga qaysi — topshiriq xabarida)
**A · «baza» → «Database»** (GATE M M-q0). O'quvchi ko'radigan matnda (uz, JSX ichidagi matn ham, arena savollari, fon so'zlari) «baza» ma'lumotlar bazasi
ma'nosida bo'lsa — «Database». Qo'shimchalar 1-dars uslubida: Database'ga · Database'da · Database'dan · Database'ni · Database'dagi · Database'ning.
Ruschasi ham «Database» (1-dars: «работает с Database»). «ma'lumotlar bazasi» izohi bo'lsa — bitta so'z qoladi: «Database» (sinonim yo'q).
O'ZGARMAYDI: kod identifikatorlari, SQL/buyruqlar, fayl nomlari, Neon konsolidagi asl nomlar, analitika-payload. Avval `grep -n "baza\|база" <FAYL>` — hammasini ko'rib chiqing.

**B · «vakolat chegarasi» → «chegara»** (M-q1). Gap grammatikasi to'g'ri qolsin. Ruschasi — «ограничение» (5-Modul `BotAiAgentLesson` bilan bir xil).

**C · PM testlariga 4-variant** (M-q6). Har ballik test (`QuestionScreen`, 3 variant) — `options` OXIRIGA 4-variant (indeks 3): ishonarli, lekin aniq noto'g'ri,
darsning o'z keysidan; uzunligi qolganlari bilan teng (to'g'ri javob eng uzun/eng qisqa bo'lib qolmasin — `lint:tell`); `explainWrong[3]` = `{ uz, ru }` ≤60 belgi,
sababni aytadi. `correctIdx`, `questionText`, savol matni O'ZGARMAYDI. 4 variant kompyuter va telefonda sig'ishini suratda ko'ring.

**D · Dars nomlari** (08-q0, 11-q0, DE-205 — menyu allaqachon yangi): m6-08 «Loyiha kuni: to'liq pipeline» (ru «Проектный день: полный pipeline»),
m6-11 «Loyiha kuni: mobil ilova» (ru «Проектный день: мобильное приложение»). O'z darsida `lessonTitle` va ko'rinadigan nom; boshqa darsdagi
«keyingi dars / oldingi dars» ishoralari (7 → 8, 10 → 11, 9 ← 8, 12 ← 11) shu nomlarga.

**E · Darvoza topilmalari:** `lint-dizayn` D1 (chap chiziq `inset 3px 0 0`) → chiziq o'rniga to'liq ramka yoki holat foni (5-Modul `.sess-box` kabi);
`ru-walk` qoldig'i → tarjima (bot chiqishi/kod bo'lsa — `// ru-qoldiq-istisno sN: so'z` izohi, RU_I18N_SPEC §10).

## Tekshiruv (har fayl, hammasi toza shart)
`npm run gates -- <FAYL>` 12/12 · `node lint-dizayn.mjs <FAYL>` 0 error · `CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru` ✓ TOZA ·
`npm run lint:jsx` 0 · o'zgargan ekranlar surati: `node konveyer/vositalar/ekran.mjs <FAYL> $S/<NN>-kichik/c "<ekran>:<bosish>"` (W=1280 H=773 va W=390 H=844) — Read bilan ko'ring.
`git diff -- <FAYL>` da kalitlar o'zgarmagan. Brauzer sinovi TimeoutError bersa — yolg'iz qayta (parallel agentlar Chrome'ni band qiladi).
Vaqtinchalik fayllar — `$S/<NN>-kichik/`. Turn-byudjeti ≤50 (bitta fayl uchun).

## Hisobot (qisqa)
Har band: nima o'zgardi (eski → yangi, file:line) · soni · darvozalar natijasi · kalitlar o'zgarmadi (ha/yo'q) · ikkilangan joylar.
