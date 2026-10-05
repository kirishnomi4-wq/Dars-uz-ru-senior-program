> ⚠️ ESKI (tarix) — 04.10.2026 dan amaldagisi: **`konveyer/3-SADOQAT.md`** (zanjir: `konveyer/README.md`). Bu nusxa F-0928-QA-5m jurnalidagi havolalar uchun saqlandi.

# Sadoqat-tekshiruvi: kod ↔ MD v2 (faqat O'QISH, TUZATMAYSIZ) — 5-Modul

Namuna: `feedback/F-0929-QA-6modul/SADOQAT_TOPSHIRIQ.md`. Siz yengil tekshiruvchisiz. Savol: **darsdagi o'quvchi ko'radigan o'zbekcha matn va
ekran xatti-harakati tasdiqlangan MD v2 bilan mosmi?** Hech qanday faylni tahrirlamaysiz. Faqat Read / Grep / Bash (`git diff`, `grep`, `sed -n`).

## Kirish
- MD: `feedback/F-0928-QA-5modul/<NN>-<NOM>-v2.md` (to'liq o'qing; «## B.» bo'limi — tekshirilmaydi).
- Modul qoidalari: `feedback/F-0928-QA-5modul/01-BotIntro-v2.md` 11–76-qatorlar (A1–A9, U1–U3).
- Kod: `<FAYL>` (bo'lib bir marta o'qing; keyin grep/sed). O'zgarishlar: `git diff -- <FAYL>`.
- Quruvchi aytgan chetlashishlar: `feedback/F-0928-QA-5modul/JURNAL.md` oxiridagi «Razrabotka (01.10…)» bo'limi — shu dars qatorlari.

## Nimani tekshirasiz (ekranma-ekran, MD tartibida; keyin «Qo'shimcha matnlar»: nishonlar, RECAPS, viktorina, kartochkalar, yakun)
1. **QOLIB KETGAN** — MD'dagi matn (sarlavha, eyebrow, Mentor, karta, chat, variant, izoh, tugma, xulosa) kodda yo'q yoki eski holatda.
2. **CHETLASHGAN** — kodda bor, lekin MA'NOSI MD'dan farq qiladi. `lint:tell`/emoji sababli kichik o'zgarish ma'no saqlangan bo'lsa — «OQLANGAN».
3. **QOLDIQ** — `uz` da MD'da yo'q eski gap yoki eski atama (A1 jadvali: Botjon, daftar, signal, qoidalar varag'i, kalit (token ma'nosida),
   aylana (9-darsdan tashqari), ustoz…); MD «Olib tashlanadi:» degan blok kodda hali ko'rinadi.
4. **KOD** — MD oxiridagi «KOD ro'yxati» va ekranlardagi «Ko'rinish:» bandlari bajarilganmi (ha / yo'q / qisman): navbat bilan ochilish (A6),
   animatsiya (A7: bor bo'lsa reduced-motion'da o'chadimi), U1 (tugma uslubi, `›`/`✓`, hook neytral rang), U3 (RECAPS belgisi).
5. **KALIT** — `git diff` da `INLINE_KEYS`, `correctIdx`, `QUIZ_BANK` `correct:` qiymatlari O'ZGARMAGANI; har ballik testda MD ✔ variant kodda
   o'sha pozitsiyada. Ballsiz tanlovda MD aralash desa — aralashganmi va nishon sharti indeksga bog'liq emasmi.
6. **SIZ-FORMA va EMOJI** — o'quvchiga buyruqlar «-ing / -ng»; o'quvchi matnida emoji yo'q (nishon medali, podium, ▶ ✓ ✕ ↻ → ← dan tashqari).
Ruscha (`ru:`) TEKSHIRILMAYDI — alohida bosqich.
Vaqtinchalik fayllar — faqat scratchpad ichida o'z papkangizda (`<dars>-sadoqat/`).

## Hisobot (qisqa, jadval)
| ekran | tur (QOLIB KETGAN / CHETLASHGAN / QOLDIQ / KOD / KALIT / SIZ-FORMA / EMOJI) | file:line | MD'da | kodda |
Oxirida: jami topilmalar; «OQLANGAN» ro'yxati (1 qatordan); quruvchi chetlashishlariga baho (oqlanadimi); yakuniy hukm: **MOS** (0 topilma) yoki **QAYTARISH** (ro'yxat).
Turn-byudjeti ≤40 tool-chaqiruv.
