> ⚠️ ESKI (tarix) — 04.10.2026 dan amaldagisi: **`konveyer/1-MD.md`** (zanjir: `konveyer/README.md`). Bu nusxa F-0929-QA-6m jurnalidagi havolalar uchun saqlandi.

# «MD-birinchi» — yangi dars yaratish jarayoni (loyiha, 29.09.2026, D7 tasdig'ini kutadi)

> Tasdiqlangach: CLAUDE.md → «F — YANGI DARS: MD-birinchi» retsepti; PM_PIPELINE.md / PIPELINE.md → GATE M.
> Manba: 6-Modul 14 darsi ustidagi ish (feedback/F-0929-QA-6modul/JURNAL.md, F-0929-01…17).

## Tamoyil
Avval to'liq MD — o'quvchi ko'radigan har bir so'z. Uni foydalanuvchi va ChatGPT ko'radi; men har bandni bizning o'lchovlar bilan
filtrlayman (Qabul / Qisman / Rad + sabab). MD tasdiqlangach (GATE M) kod quriladi. **MD = manba-haqiqat:** kod MD'dan chetga chiqmaydi;
chetlashsa MD yangilanadi. Bir modul — barcha darslar GATE M'dan o'tgach razrabotka.

## Bosqichlar
0. **Manba yig'ish** — dasturdagi o'rni; oldingi/keyingi dars (App.jsx `comp:` dan, taxmin emas); misol-ip (bitta olam) va uning oldingi
   darslardagi nomlari; o'tilgan atamalar ro'yxati (grep: masalan Idrok→Qaror→Amal, oshxona, ko'p kirish yo'li); test rejasi (ballik testlar soni, final turi).
1. **MD v1** — format `01-SystemArchitecture-v2.md` kabi: A-bo'lim (darsning tayanch qoidalari) · darsning ipi · reja jadvali ·
   har ekran (eyebrow, sarlavha, mentor, matn, tugmalar, xato-holatlar) · testlar (✔ belgilangan, variantlar teng) · final · amaliyot ·
   kartochkalar · yakun + keyingi dars · nishonlar · recaps · arena. Emoji qoidasi. Hook: to'g'riga «Aynan!», boshqasiga «Qiziq fikr!».
   Final joylari «1-qadam…». Kod o'zgarishi kerak bo'lsa — «KOD» belgisi.
2. **Ko'rik** — foydalanuvchi (`>> …`), ChatGPT (to'liq MD; xulosasi menga beriladi).
3. **Filtr (men)** — har band: darsda bormi (grep) → fakt (App.jsx, oldingi darslar) → qonun (MATN_ETALONI, DARS_ETALON, MATN_KORPUS) →
   kalit/pozitsiya (INLINE_KEYS, QUIZ_BANK o'zgarmaydi) → auditoriya (Toshkent o'smiri, kurs oyi). Hukm + sabab jurnalga.
   Mustaqil ov: «o'tgan darsda…» havolalari, keyingi dars, atama mosligi, texnik to'g'rilik, kafolat gaplari.
4. **MD v2 → GATE M** — foydalanuvchi tasdiqlaydi; kerak bo'lsa v3.
5. **Razrabotka** — Quruvchi (MD'dan) → Dizayn → Jonli → 👦 o'qish → Metodist (MD'ga sadoqat) → Tekshiruvchi → `npm run gates`
   (+ `lint:tell`, `lint:emoji` — D5).
6. **Muhrlash** — topilma sinflari → MATN_KORPUS (matn) · DARS_ETALON (UX) · tekshiruvchi rol-fayli (takror bug); MD saqlanadi.

## GATE M — tekshiruv ro'yxati
- [ ] Oldingi/keyingi dars — App.jsx bilan mos
- [ ] Bitta misol-ip; metafora ko'pi bilan bitta, bir marta
- [ ] Atamalar oldingi darslar bilan bir xil (grep)
- [ ] Hook javoblari tanlovga qarab
- [ ] Testlar: uzunlik teng, kalit so'z faqat to'g'rida emas, strelka/qavs faqat to'g'rida emas
- [ ] Final: joylar «1-qadam…», Mentor tartibni aytmaydi
- [ ] Emoji limiti (yangi qonun — D1)
- [ ] Kafolat gaplari yo'q («har doim», «hech qachon», «100%», «darrov»)
- [ ] Ichki kodlar yo'q (T6, Modul 9, P1)
- [ ] «KOD» belgilari ro'yxati to'liq
- [ ] Tarixiy voqea — manba ko'rsatilgan
- [ ] Keyingi dars qatori bor

## 6-Moduldan chiqqan takror sinflar (rol-fayllarga ov-bandi nomzodlari)
- Final DnD/tanlash: `hints` yoki Mentor javob tartibini ochib qo'yadi (4, 9, 10, 11, 13-darslar)
- Test to'g'ri javobi eng uzun / yagona texnik so'zli / strelkali (deyarli har darsda)
- «O'tgan darsda…» havolasi noto'g'ri (PM va texnik darslar navbatlashadi)
- Modul raqamlari matnda (Modul 3/8/9) — LMS raqami bilan mos emas
- Emoji-codemod `ico` maydonini o'chirgan (1, 4, 7) — kod belgiga emas, maydonga tayansin
- `explainWrong` kaliti to'g'ri javob indeksida (11), `explainCorrect` xato variantni tushuntiradi (12)
- Yakun sarlavhasi `tr()`siz (6, 14)
