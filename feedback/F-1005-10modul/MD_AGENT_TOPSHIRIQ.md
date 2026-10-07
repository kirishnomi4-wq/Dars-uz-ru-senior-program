# MD v3 agenti — umumiy topshiriq (10-Modul, konveyer 1-bosqich, 05.10.2026)

Siz LMS 10-Modul «Gipotezani qanday tekshirish + texnik MVP praktikasi» (kod `src/8-Modull`, kalit `m8-NN`) ning BITTA darsi uchun MD v3 yozasiz:
o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi.
Suhbatda modul LMS raqami bilan aytiladi («10-Modul»), fayl va kalit — kod raqami bilan.

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1005-10modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari, MAJBURIY.
2. `feedback/F-1005-10modul/00-MODUL-TAYANCH.md` — misol-ip «Maydon» davomi, raqamlar, atamalar, repo va teglar, keyslar, tekshirilgan faktlar,
   9-Modul auditidagi takroriy xatolar (7-bo'lim). Nom, raqam, so'z — AYNAN shunday.
3. `feedback/F-1005-10modul/00-TAQIQLAR.md` — **nima mumkin emas** (umumiy qonun fayllaridan yig'ilgan, MAJBURIY): keys banki, taqiq so'zlar, lug'at, ekran va test qoidalari.
4. `feedback/F-1005-10modul/00-NOMLAR.md` (dars nomlari) · `00-MANBA.md` (dastur jadvali, o'tilgan darslar).
5. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
6. `konveyer/QURISH_KARTASI.md` — T · P · S bo'limlari (PM darsda + PM). Har bandni ko'ring.
7. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgan qismi — mavzu so'zlari bo'yicha grep.
8. `src/qolip/QOLIP.md` — mavjud ekran turlari va ularning maydonlari.
9. Eng yaqin namuna — 9-Modulning tasdiqlangan va auditdan o'tgan MD si (tayanch 4-bo'lim jadvalida; `feedback/F-1005-9modul/`) va uning `NN-FILTR.md` fayli —
   tuzilish, hajm, uslub va audit nimani topgani uchun. Matn ko'chirilmaydi. 9-Modul fayllariga yozilmaydi.
10. **1-to'lqin MD lari** `01-PmOkr-v3.md`, `02-EventTracking-v3.md`, `03-LiveDashboard-v3.md` — sizdan oldingi darslar: atama, raqam, repo nomi, javob shakli ular bilan bir xil bo'lsin
    (to'liq o'qish shart emas — o'zingizga kerak joyini grep qiling). Tayanch **9-bo'lim** — 1-to'lqindan chiqqan kelishuvlar, MAJBURIY.
Qonun fayllari (`PM_DARS_ETALON.md`, `DARS_ETALON.md`, `PM_Prompt_v8.md`) katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling.
O'tilgan atama — grep (`feedback/F-0928-QA-5modul/YAKUNIY/`, `feedback/F-0929-QA-6modul/YAKUNIY/`, `feedback/F-1005-9modul/*-v3.md`, `src/`).
«Maydon» kodining hozirgi holati — `git -C ~/Desktop/maydon show dars-11-done:<yo'l>` (faqat o'qish).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1005-10modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, repo, qonun, konveyer, boshqa MD).
- Format — `konveyer/1-MD.md` «Format». Oxirida: Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12) · Yakun (chip, sarlavha, «Endi siz bilasiz» 3–5, uyga vazifa, «Keyingi dars — …») · «KOD» belgilari.
- Ekranlar: PM+PRAKT — 11 ekran (PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → yakun) · loyiha kuni — 8 ekran + 3 blok · TEX va PM — tegishli namuna hajmida.
  Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q.
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til, kantselyarit va sheva yo'q. Apostrof — oddiy `'`.
- O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno). Kafolat gaplari yo'q («har doim», «100%», «darrov»).
  Ichki kodlar o'quvchi matnida yo'q. Sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- Testlar: 4 variant uzunligi teng, kalit so'z / strelka / qavs faqat to'g'ri variantda emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz.
- Amaliyot blokida Mentor misoli («Maydon») repo `maydon` da, teg `m10-dars-NN-…` bilan; oxirgi qadam — «O'z g'oyangiz». Prompt — «qayerda · nima qilsin · nima buzilmasin».
- **Xavfsizlik (5, 6-darslar):** faqat himoya tomoni — zaiflik turi, nega xavfli, kodda qanday topiladi, qanday yopiladi. Hujum qatorlari va boshqa saytni tekshirish yo'riqlari yozilmaydi (tayanch 3-bo'lim).
- Keys — faqat tayanch 5-bo'limda darsingizga berilgani (K1–K19 banki); keyssiz dars keyssiz qoladi. Boshqa real fakt — faqat tayanch 6-bo'limdan. Manbasiz raqam o'ylab topilmaydi.
- Tayanchda yo'q tafsilot kerak bo'lsa — o'zingiz qaror qilasiz, lekin MD oxiridagi **«TAYANCHGA SAVOL»** ro'yxatiga yozasiz (nima, nega). Boshqa darslarga tegadigan nom o'ylab topmang.
- Oxirida GATE M ro'yxatini (1-MD.md) o'zingiz belgilang — `- [x]` / `- [ ]` + nega.

- **1-to'lqin saboqlari:** bitta so'z bitta ma'noda («qator» — faqat jadval qatori; «inkognito oyna», «yashirin oyna» emas) · sanoq sharti har raqam yonida aniq · xavfli buyruq (`DELETE`, `DROP`)
  faqat `WHERE` bilan · tayanchda yo'q qaror — «TAYANCHGA SAVOL» ga, boshqa darslarga tegadigan nom o'ylab topilmaydi · PM darsidagi kod mexanikasi — tayanch 9.1.
- **Tashqi xizmatlar (Netlify, Render, UptimeRobot, GitHub, Neon, Chrome):** menyu va tugma nomlarini taxmin qilmang (P-028) — rasmiy hujjatdan tekshiring (WebFetch / WebSearch) va manba havolasini
  MD izohida yozing; tekshirib bo'lmasa — umumiy so'z bilan yozing va «shubhali joylar» ga qo'shing.

## Tekshiring
`npm run lint:til feedback/F-1005-10modul/<fayl>` — 0 error bo'lguncha tuzating. `kelajak-okr` ogohlantirishi bu modulda kutilgan (OKR — 1-dars mavzusi).

## Hisobot (oxirgi xabaringiz, ≤20 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL ro'yxati · shubhali joylar (ishonchingiz komil bo'lmagan matn).

MD ni foydalanuvchi o'qiydi va ChatGPT auditiga beradi: har da'vo aniq, chegaralangan va tayanchga mos bo'lsin. Ishonchingiz komil bo'lmagan joyni yashirmang — «shubhali joylar» ga yozing.
