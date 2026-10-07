# MD v3 agenti — umumiy topshiriq (11-Modul, konveyer 1-bosqich, 06.10.2026)

Siz LMS 11-Modul «Final loyiha: g'oya va rivojlantirish + React Native» (kod `src/9-Modull`, kalit `m9-NN`) ning BITTA darsi uchun MD v3 yozasiz:
o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi.
Suhbatda modul LMS raqami bilan aytiladi («11-Modul»), fayl va kalit — kod raqami bilan. O'quvchi matnida modul raqami — LMS raqami («9-Modulda»).

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1005-11modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari, MAJBURIY.
2. `feedback/F-1005-11modul/00-MODUL-TAYANCH.md` — misol-ip «Maydon Jamoa», Mentor raqamlari, atamalar, repo va teglar, darslar jadvali, keyslar, tekshirilgan faktlar,
   auditdagi takroriy xatolar, saqlash kalitlari. Nom, raqam, so'z — AYNAN shunday. **9-bo'lim** (to'lqin kelishuvlari) — bo'lsa MAJBURIY.
3. `feedback/F-1005-11modul/00-TAQIQLAR.md` — **nima mumkin emas** (MAJBURIY).
4. `feedback/F-1005-11modul/00-NOMLAR.md` (dars nomlari, menyu osti, oldingi/keyingi dars) · `00-MANBA.md` (dastur jadvali, o'tilgan atamalar).
5. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
6. `konveyer/QURISH_KARTASI.md` — T · P · S bo'limlari (PM darsda + PM). Har bandni ko'ring.
7. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgan qismi — mavzu so'zlari bo'yicha grep (g'oya, intervyu, pitch, prototip, telefon, roadmap, sinov).
8. `src/qolip/QOLIP.md` — mavjud ekran turlari va ularning maydonlari.
9. Eng yaqin namuna — tayanch 4-bo'lim jadvalida (9/10-Modul MD v3 yoki 6-Modul YAKUNIY) va 9/10-Modul MD ning `NN-FILTR.md` fayli (audit nimani topgani) —
   tuzilish, hajm, uslub uchun. Matn ko'chirilmaydi. Boshqa modul fayllariga yozilmaydi.
10. 9-Modul `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` — 18 band va 10-Modul `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` «C» qismi 19–31 (foydalanuvchining pilot fidbeki; 🔴 — qat'iy: jonli ekran, bo'sh ustun yo'q, maket chapda,
    ≤3 blok, yakuniy holat ixcham, mustaqil ish — bitta katta karta). MD da har ekranni shunga mos loyihalang (masalan keys sahnasi jonli, kartochka ekranida Mentor yo'q).
11. **1-to'lqin MD lari** `01-PmTenIdeas-v3.md` (PM namunasi), `07-LivePrototype-v3.md` (TEX), `10-FoundationDay-v3.md` (loyiha kuni) — eng yaqiniga tuzilish va uslub uchun qarang; atama, raqam, nom ular bilan bir xil.
Qonun fayllari (`PM_DARS_ETALON.md`, `DARS_ETALON.md`, `PM_Prompt_v8.md`) katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling.
O'tilgan atama — grep (`feedback/F-0928-QA-5modul/YAKUNIY/`, `feedback/F-0929-QA-6modul/YAKUNIY/`, `feedback/F-1005-9modul/*-v3.md`, `feedback/F-1005-10modul/*-v3.md`, `src/`).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1005-11modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, repo, qonun, konveyer, boshqa MD, tayanch).
  Yordamchi fayllar (o'lchov skripti, qoralama) — **faqat scratchpad'dagi o'z papkangizda** `md<NN>/` (topshiriqda yo'li berilgan); boshqa agentning faylini o'zgartirmang.
- Format — `konveyer/1-MD.md` «Format»: sarlavha qatori, Fayl/ekranlar soni, A-bo'lim (tayanch, atamalar, misol-ip, bitta vizual), darsning ipi,
  har ekran (`## N · nom ← QOLIP TURI`, eyebrow, sarlavha + belgilar soni, Mentor, tur maydonlari, «Harakat → Vizual o'zgarish», xulosa), keyin
  Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12; alohida ekran, Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →») ·
  Yakun (chip, sarlavha, «Endi siz bilasiz» 3–5, uyga vazifa, «Keyingi dars — «…»») · «KOD» belgilari (qolipda yo'q, kod kerak bo'ladigan joylar).
- Ekranlar: tayanch 4-bo'lim (PM ≈16 · TEX 18–20 · loyiha kuni va PM+PRAKT 12 · 15-dars 12). Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q.
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til, kantselyarit va sheva yo'q. Apostrof — oddiy `'`.
- O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno). Kafolat gaplari yo'q. Ichki kodlar yo'q (F1, `m9-04`).
  Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 («Aynan!» bilan birga) · xato izohi ≤60.
- Har harakatli ekranda: o'quvchi birinchi nimani bosadi — aniq (faol element), Mentor gapi aynan shu harakatni aytadi; bashorat tanlangach yopilmaydi («Harakat → Vizual o'zgarish» qatorida yozing).
- Testlar: 4 variant uzunligi teng (±15%), kalit so'z / tire / strelka / qavs faqat to'g'ri variantda emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz.
- **Keys** — faqat tayanch 5-bo'limda darsingizga berilgani, bank matnidagi faktlar bilan; keyssiz dars keyssiz qoladi. Keys sahnasi — nom o'z rangida, tanish maket, bosqichma-bosqich o'zgaradi (SABOQ 2–3, 8).
- **Mentor misoli** — «Maydon Jamoa», raqamlar faqat tayanch 1-bo'limdan, «Mentor misolida» deb. O'quvchining o'z mahsuloti — har darsning amaliy qismida (o'z g'oyasi, o'z repo'si, o'z treki).
- **Amaliyot bloki** (loyiha kunlari, 7–9 va 13-darslar): o'quvchi 4 qadamning HAMMASINI o'z repo'sida, o'z mahsuloti va trekida bajaradi; Mentor misoli — namuna (5-qadam YO'Q — tayanch 4 «Amaliyot bloki», MAJBURIY); prompt — «qayerda · nima qilsin · nima buzilmasin», `{…}` joylari o'z mahsuloti nomlari bilan;
  o'ngda kutilgan natija (telefon maketi); pastda «Ortda qoldingizmi» (tayanch 3). Talab zinapoyasi — tayanch 4.
- **React Native kodi** — o'qiladigan qisqa bo'lak + chizilgan telefon maketi (harakat → telefon ekrani o'zgaradi); kod oynasida RN ishga tushirilmaydi.
- **Tashqi xizmatlar** (Expo, Expo Go, GitHub, Render, Neon, Netlify, Antigravity, Chrome, Safari): tugma va menyu nomlarini taxmin qilmang (P-028) — tayanch 6-bo'limdagisi yetmasa,
  rasmiy hujjatdan tekshiring (WebFetch / WebSearch) va manba havolasini MD izohida yozing; tekshirib bo'lmasa — umumiy so'z bilan yozing va «shubhali joylar» ga qo'shing.
- Tayanchda yo'q tafsilot kerak bo'lsa — o'zingiz qaror qilasiz, lekin MD oxiridagi **«TAYANCHGA SAVOL»** ro'yxatiga yozasiz (nima, nega). Boshqa darslarga tegadigan nom o'ylab topmang.
- Oxirida GATE M ro'yxatini (1-MD.md) o'zingiz belgilang — `- [x]` / `- [ ]` + nega.

## Tekshiring
`npm run lint:til feedback/F-1005-11modul/<fayl>` — 0 error bo'lguncha tuzating (warn lar — ko'rib chiqing, kerak bo'lsa hisobotda sababini ayting).
Sarlavha, xulosa, hook javobi, xato izohi uzunligini o'z skriptingiz bilan sanang (scratchpad'dagi o'z papkangizda).

## Hisobot (oxirgi xabaringiz, ≤20 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL ro'yxati · shubhali joylar (ishonchingiz komil bo'lmagan matn).

MD ni foydalanuvchi o'qiydi va ChatGPT auditiga beradi: har da'vo aniq, chegaralangan va tayanchga mos bo'lsin. Ishonchingiz komil bo'lmagan joyni yashirmang — «shubhali joylar» ga yozing.
