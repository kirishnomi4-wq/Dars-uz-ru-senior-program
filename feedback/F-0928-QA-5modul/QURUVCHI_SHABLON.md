> ⚠️ ESKI (tarix) — 04.10.2026 dan amaldagisi: **`konveyer/2-QURUVCHI.md`** (zanjir: `konveyer/README.md`). Bu nusxa F-0928-QA-5m jurnalidagi havolalar uchun saqlandi.

# Quruvchi topshiriq-shabloni — 5-Modul v2 → kod (bitta dars = bitta agent = bitta fayl)

F-1001-50 · namuna: `feedback/F-0929-QA-6modul/QURUVCHI_SHABLON.md` (6-Modul). Farqi: 5-Modul MD'larida KOD bandlari ko'p
(navbat bilan ochilish, animatsiya, UI qoidalari) — har MD oxirida o'z «KOD ro'yxati» bor.

Vazifa: `<FAYL>` darsini tasdiqlangan MD v2 ga keltiring («MD-birinchi», CLAUDE.md F-retsepti). **MD = manba-haqiqat.**

## Manba
- `feedback/F-0928-QA-5modul/<NN>-<NOM>-v2.md` — TO'LIQ o'qing. `[NNN]` — taxminiy qator. `✎`, «Ko'rinish:», «Olib tashlanadi:»,
  «Animatsiya:» — ko'rsatma (kodga matn sifatida yozilmaydi). «## B. … tashqariga chiqadigan ishlar» — TEGILMAYDI.
- Modul qoidalari: `feedback/F-0928-QA-5modul/01-BotIntro-v2.md` 11–76-qatorlar (A1–A9, U1–U3) — har darsga amal qiladi.
- Eski matn (solishtirish uchun): `feedback/F-0928-QA-5modul/arxiv/<NN>-<NOM>-sozlar.md`.

## Qoidalar
1. **Matn:** o'quvchi ko'radigan har `uz` satr MD'dagi bilan aynan bir xil (sarlavha, eyebrow, Mentor, karta, tugma, chat, variant,
   javob izohi, xulosa, nishon, RECAPS, kartochka, viktorina, yakun). MD'da «olib tashlanadi» deyilgan blok kodda ham yo'qoladi.
2. **`ru:` TEGILMAYDI** (RU — alohida bosqich). Yangi `uz` yonida eski `ru` qoladi. Yangi element qo'shilsa — `ru` ga qisqa ruscha
   tarjima yozing (bo'sh qolmasin).
3. **Kalitlar:** ballik testlar (`INLINE_KEYS`, `correctIdx`, `QUIZ_BANK.correct`, arena) — ✔ O'RNI O'ZGARMAYDI. MD sarlavhasidagi
   kalit qatori bilan har testni solishtiring. Ballsiz tanlovlar (nishon beradigan) — MD aralash desa, aralashtiring va nishon shartini
   variant `id`/matni bo'yicha qiling (indeks emas).
4. **KOD ro'yxati** (MD oxirida) — HAR band bajariladi. Bajarib bo'lmasa — sababini hisobotga yozing, o'zingizcha boshqa narsa qilmang.
5. **Emoji (A4):** o'quvchi matnida emoji YO'Q. Qoladi: nishon medali, podium, tugma-belgilar `▶ ✓ ✕ ↻ → ←`. Holat rangi — CSS nuqta.
   RECAPS `ic` → kod misoli yoki raqam (U3, MD'dagi «Belgilar» qatori).
6. **Navbat bilan ochilish (A6), animatsiya (A7), UI (U1–U3)** — MD'dagi «Ko'rinish» bloki bo'yicha. Animatsiya: CSS `@keyframes`,
   0.6–1.2 s, `@media (prefers-reduced-motion: reduce)` da o'chadi; fayldagi mavjud uslub/klasslardan foydalaning.
7. **Faqat shu fayl.** `App.jsx`, `src/live/*`, boshqa darslar, umumiy fayllar — TEGILMAYDI (kerak bo'lsa — hisobotga). Podium
   «sessiya» so'zi — tegilmaydi. PM darsida uy vazifasi kartasi (`HwCard`/homework) — faqat emoji va Botjon/daftar (12-savol B).
8. **Jim-buzilish:** CSS shablon-satri ichida (izohda ham) BACKTIK yo'q; bir qatorli funksiya ichida `//` izoh yo'q. Commit yo'q.
9. Savol bermang — ikkilansangiz MD'ga eng yaqin yechimni tanlang va hisobotga «chetlashish/ikkilanish» deb yozing.
10. Vaqtinchalik fayllar — faqat o'z papkangizda: scratchpad ichida `<dars-raqami>-<rol>/` (masalan `09-quruvchi/`). Parallel agentlar scratchpad'ni baham ko'radi — umumiy nomli fayl (`walk.mjs`) boshqa agentnikini yozib yuboradi (F-1001-56).

## Tartib (token tejash)
MD (bir marta) → JSX faylni katta bo'laklarda BIR MARTA o'qing → keyin faqat `grep -n` / `sed -n` bilan nuqtali qarang (faylni qayta-qayta
to'liq o'qimang) → ekranma-ekran 0 → N → Qo'shimcha matnlar (nishonlar, RECAPS, viktorina, kartochkalar, yakun) → KOD ro'yxatini
band-band tekshiring. Har 3–4 ekrandan keyin: `node esbuild-gate.mjs <FAYL>`.
Oxirida (ikkalasi 0 xato shart):
- `npm run gates -- <FAYL>` — 9/9 (tell va emoji ham)
- `npm run lint:jsx`
- residue-grep `uz` satrlarda 0: `Botjon`, `daftar`, `signal`, `qoidalar varag`, `aylana` (9-darsdan tashqari), «ustoz», emoji.
Turn-byudjeti ≤110 tool-chaqiruv.

## Hisobot (qisqa)
1. Ekranlar: 0…N — har biri ✓ / qisman (nima qoldi).
2. KOD ro'yxati: har band — bajarildi / qisman / yo'q + sabab.
3. Darvozalar: gates N/9, lint:jsx, residue.
4. Kalitlar: ballik testlar ✔ o'rni o'zgarmadi (ha/yo'q); ballsiz tanlovlarda nima o'zgardi.
5. MD'dan chetlashish (sabab bilan) va ikkilangan joylar.
6. RU-qarz: `uz` o'zgargan satrlar soni (taxminan).
7. Faylingizdan tashqariga chiqadigan ishlar (App.jsx va h.k.) — ro'yxat.
