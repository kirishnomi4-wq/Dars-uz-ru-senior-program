# MD v3 agenti — umumiy topshiriq (9-Modul, konveyer 1-bosqich, 05.10.2026)

Siz LMS 9-Modul «Loyiham kim uchun va nima uchun + animatsiya» (kod `src/7-Modull`, kalit `m7-NN`) ning BITTA darsi uchun MD v3 yozasiz:
o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi («v2 dagidek» degan joy bo'lmaydi).
Suhbatda modul LMS raqami bilan aytiladi («9-Modul»), fayl va kalit — kod raqami bilan.

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1005-9modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari, MAJBURIY.
2. `feedback/F-1005-9modul/00-MODUL-TAYANCH.md` — misol-ip «Maydon» faktlari, atamalar, repo va teglar. Nom, raqam, so'z — AYNAN shunday.
3. `feedback/F-1005-9modul/00-NOMLAR.md` (dars nomlari, oldingi/keyingi dars) · `00-MANBA.md` (dastur jadvali, o'tilgan darslar).
4. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
5. `konveyer/QURISH_KARTASI.md` — T · P · S bo'limlari (PM darsda + PM). Har bandni ko'ring.
6. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgan qismi — mavzu so'zlari bo'yicha grep (masalan intervyu, sinov, pitch, animatsiya, hodisa).
7. `src/qolip/QOLIP.md` — mavjud ekran turlari va ularning maydonlari.
8. Sizning namuna MD ingiz (pastda) — tuzilish, hajm va uslub uchun. Undan matn ko'chirilmaydi.
Qonun fayllari (`PM_DARS_ETALON.md`, `DARS_ETALON.md`, `PM_Prompt_v8.md`) katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling.
O'tilgan atama yoki oldingi darsdagi so'zni tekshirish — grep (`feedback/F-0928-QA-5modul/YAKUNIY/`, `feedback/F-0929-QA-6modul/YAKUNIY/`, `src/`).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1005-9modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, qonun, konveyer, boshqa MD).
- Format — `konveyer/1-MD.md` «Format»: sarlavha qatori, Fayl/ekranlar soni, A-bo'lim (tayanch, atamalar, misol-ip, bitta vizual), darsning ipi,
  har ekran (`## N · nom ← QOLIP TURI`, eyebrow, sarlavha + belgilar soni, Mentor, tur maydonlari, «Harakat → Vizual o'zgarish», xulosa),
  keyin Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12) · Yakun (chip, sarlavha, «Endi siz bilasiz» 3–5, uyga vazifa, «Keyingi dars — …») · «KOD» belgilari (qolipda yo'q, kod kerak bo'ladigan joylar).
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til, kantselyarit va sheva yo'q. Apostrof — oddiy `'` (namunadagidek).
- O'quvchi ko'radigan matnda emoji yo'q (o'yin qatlami — arena, nishon medali, podium — mustasno). Kafolat gaplari yo'q («har doim», «100%», «darrov»).
  Ichki kodlar o'quvchi matnida yo'q (T6, P1, «Modul 9»). Sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- Testlar: 4 variant uzunligi teng, kalit so'z / strelka / qavs faqat to'g'ri variantda emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz.
- Real odam bilan ish — darsda sinfdosh bilan juftlikda (shablon), real odam — uyga vazifa (qaror 7). Amaliyot blokida Mentor misoli («Maydon») repo `maydon` da,
  teg bilan; blok oxirida bitta qadam — «shu promptni o'z g'oyangizga yozing» (qaror 8). Prompt faqat «qayerda · nima qilsin · nima buzilmasin» (173.4).
- Real kompaniya, sayt yoki raqam — faqat ishonchli manba bilan (MD da manba havolasi izohda). Manbasiz raqam o'ylab topilmaydi.
- Tayanchda yo'q tafsilot kerak bo'lsa — o'zingiz qaror qilasiz, lekin MD oxiridagi **«TAYANCHGA SAVOL»** ro'yxatiga yozasiz (nima, nega). Boshqa darslarga tegadigan nom o'ylab topmang.
- Oxirida GATE M ro'yxatini (1-MD.md) o'zingiz belgilang — MD oxirida `- [x]` / `- [ ]` + nega.

## Tekshiring
`npm run lint:til feedback/F-1005-9modul/<fayl>` — 0 error bo'lguncha tuzating.

## Hisobot (oxirgi xabaringiz, ≤20 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL ro'yxati · shubhali joylar (ishonchingiz komil bo'lmagan matn).
