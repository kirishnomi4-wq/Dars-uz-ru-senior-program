# MD v3 agenti — umumiy topshiriq (14-Modul, konveyer 1-bosqich, 08.10.2026, F-1008-554)

Siz LMS 14-Modul «Bitiruvchi va mahsulot tezligi» (kod `src/12-Modull`, kalit `m12-NN`) ning BITTA darsi uchun MD v3 yozasiz: o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi.
Suhbatda va MD da modul LMS raqami bilan aytiladi («14-Modul 3-darsi», «13-Modulda»); kod raqami (`m12-03`, `src/12-Modull`) — faqat fayl yo'li va kalitda.
Bu kursning oxirgi moduli: o'quvchi o'z final mahsulotini hakamlar oldida himoya qiladi. Tezlik emas, sifat: 12 va 13-Modulda tashqi audit har darsdan 10–24 band qabul qilgan, ko'pi bir xil sinflar — ular tayanch 7-bo'limda (18 sinf). MD ngiz shu sinflardan **birinchi kundanoq** toza chiqishi kerak.
⚠️ **TAXMIN:** foydalanuvchi qaror savollariga hali javob bermagan; tayanchdagi `(Tn)` belgili joylar — tavsiya qilingan variant. MD da shu joyga tayangan har qator yoniga `<!-- TAXMIN Tn -->` qo'ying (masalan olti bo'lak — `<!-- TAXMIN T1 -->`). Ertalab javob boshqacha bo'lsa — aynan shu joylar tuzatiladi.
⚠️ Bu modulda real odamlar va o'smir xavfsizligi: **investitsiya so'ralmaydi, video ommaviy emas, yosh chegarasi taxmin qilinmaydi** (TAQIQLAR 1 — har ekranga tegadi).

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` — misol-ip (1.0–1.14), atamalar (2), repo (3), darslar jadvali (4), keyslar (5), faktlar (6), **oldindan tuzatiladigan sinflar (7)**, saqlash kalitlari (8), to'lqin kelishuvlari (9 — bo'sh bo'lmasa MAJBURIY), ruscha lug'at (10 — faqat ma'lumot). Nom, raqam, so'z — AYNAN shunday.
2. `feedback/F-1008-14modul/00-TAQIQLAR.md` (MAJBURIY) · `00-NOMLAR.md` (nomlar, oldingi/keyingi dars) · `00-MANBA.md` (dastur, rasmiy iqtiboslar) · `qaror-0.json` (TAXMIN savollari — nima taxmin qilinganini bilish uchun).
3. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati · `konveyer/QURISH_KARTASI.md` — T · P · S (+ PM) · `src/qolip/QOLIP.md`.
4. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgani — mavzu so'zlari bo'yicha grep (pitch, hikoya, demo, tezlik, video, xat, reja).
5. 13-Modul tayanchi `feedback/F-1007-13modul/00-MODUL-TAYANCH.md` — 1.0, 1.11, 1.12, 1.13, 2, 7 (14-Modul shu ustiga quriladi) · 13-Modul `00-TAQIQLAR.md` (to'liq — 14-Modul TAQIQLARI uning qisqasi).
6. Eng yaqin namuna — pastdagi qatoringizdagi MD **va uning `NN-FILTR.md` fayli** (audit aynan shu turdagi darsda nimani topgani). Tuzilish, hajm, uslub uchun; matn ko'chirilmaydi.
7. `feedback/F-1006-12modul/QURUVCHI_SABOQ.md` E 40–55 (🔴 — foydalanuvchi didi): har ekranni shunga mos loyihalang (bittadan karta, yorliq input ichida, taxmin qatori yashil xulosa ichida, yakun standarti — «Bugungi asosiy fikr» yakunda yo'q, sarlavha har holatda rost).
Qonun fayllari katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling. O'tilgan atama — grep (`feedback/F-100*-*/*-v3.md`, `feedback/*/YAKUNIY/`, `src/`).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1008-14modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, repo, qonun, konveyer, boshqa MD, tayanch, boshqa modullar).
  Yordamchi fayllar — **faqat scratchpad'dagi o'z papkangizda** `md<NN>/` (yo'li quyida).
- Format — `konveyer/1-MD.md` «Format»: sarlavha qatori, Fayl/ekranlar soni, A-bo'lim (tayanch, atamalar, misol-ip, bitta vizual, **vaqt taqsimoti 90 daqiqa**), darsning ipi,
  har ekran (`## N · nom ← QOLIP TURI`, eyebrow, sarlavha + belgilar soni, Mentor, tur maydonlari, «Harakat → Vizual o'zgarish», xulosa, «Keyingi bosiladigan joy»), keyin
  Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12; alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», «Yakunlash →») · Yakun (chip · ball · sarlavha **holatga qarab, 3–5 holat, «hech narsa qilinmagan» ham** · CODE STRIKE · «Endi siz bilasiz» 3–5 · uyga vazifa · «Keyingi dars — «…»» · nishonlar) · «KOD».
- Ekranlar soni — tayanch 4 (majburiy). Uyga vazifa — yakun kartasida.
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til. Apostrof — oddiy `'`. O'quvchi matnida emoji yo'q (arena, medal, podium — mustasno).
  Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 («Aynan!» / «Qiziq fikr!» bilan) · xato izohi ≤60.
- Har harakatli ekranda: o'quvchi birinchi nimani bosadi — aniq; Mentor gapi aynan shu harakatni aytadi; bashorat tanlangach yopilmaydi.
- Testlar: 4 variant uzunligi teng (±15%), kalit so'z / tire / strelka / qavs faqat to'g'rida emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» siz; distraktor haqiqiy hayotda rost bo'lib qolmasin; uchala noto'g'ri bitta turkumdan emas.
- **Keys** — faqat tayanch 5 (1 — K12, 2 — K19); bank matni aynan (ruscha asli — `PM_Prompt_v8.md`, grep «К12», «К19»); keyssiz dars keyssiz.
- **Mentor misoli** — «Maydon Jamoa»; raqam, gap, pitch bo'lagi — faqat tayanch 1-bo'limdan, «Mentor misolida». Lighthouse, bundle, buzish natijasi — `{…}` yoki «⛔ pilotda o'lchanadi». O'quvchining o'z mahsuloti — amaliy qismda (o'z repo'si, o'z treki).
- **Amaliy qism** (bloklar): har blok — talab (qayerda · nima qilsin · nima buzilmasin) o'quvchining o'z repo'sida, `{…}` joylari, kutilgan natija «namuna: Maydon Jamoa», «Yordam» — Mentor misolidagi to'liq prompt, «Ortda qoldingizmi» (tayanch 3; darsda bir marta), mobil va web yo'li.
- **Tashqi faktlar** (Lighthouse, Expo, Render, Netlify, Upwork, YC, Diamond Challenge): tayanch 6 va `00-MANBA.md` 5 yetmasa — rasmiy hujjatdan tekshiring (WebFetch/WebSearch), havola va sanani «Manbalar»ga; tekshirib bo'lmasa — umumiy so'z + «Shubhali joylar». Taxmin qilmang.
- Tayanchda yo'q tafsilot — o'zingiz qaror qilasiz va **«TAYANCHGA SAVOL»** ga yozasiz. Boshqa darslarga tegadigan nom, son yoki so'zni o'ylab topmang — savol qiling.

## MD oxirida majburiy bo'limlar (shu tartibda)
1. **KOD** · 2. **REPO** (amaliy blok bo'lsa; tayanch 3 jadvali bilan) · 3. **Manbalar** · 4. **TAYANCHGA SAVOL** · 5. **Shubhali joylar** (⛔ «qur» darvozasi alohida) ·
6. **Oldindan tuzatiladigan sinflar — o'z tekshiruvim** (tayanch 7, 18 band: `[x]` + ekran yoki `[—]` + sabab) · 7. **O'lchov** (o'z skriptingiz: har sarlavha/xulosa/hook/xato izohi uzunligi; test variantlari ±15%; arena ✔ taqsimoti) ·
8. **TAXMIN belgilari** — MD dagi `<!-- TAXMIN Tn -->` joylari ro'yxati (Tn · ekran) · 9. **GATE M — o'z tekshiruvim** (`konveyer/1-MD.md`).

## Tekshiring
`npm run -s lint:til -- feedback/F-1008-14modul/<fayl>` — 0 error bo'lguncha. Yozib bo'lgach MD ni boshidan oxirigacha **bir marta qayta o'qing** — auditor ko'zi bilan: har da'vo chegaralanganmi, har son tayanchdami, har tashqi qadam manbalimi, TAQIQLAR 1 buzilmaganmi.

## Hisobot (oxirgi xabaringiz, ≤25 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL (qisqa) · shubhali joylar · TAXMIN belgilari soni · 18 sinfdan eng qiyini va nega.

---

# 1-to'lqin — pilotlar (3 dars; har agentga o'z qatori)

| № | Fayl | Tip · ekran | Oldingi → keyingi dars | Tayanch | Keys | Kalit (o'qiydi → yozadi) | Kod / amaliyot | Namuna (MD + FILTR) |
|---|---|---|---|---|---|---|---|---|
| 1 | `01-PmInvestorPitch-v3.md` | PM (keysli) · 16 | «Zaxira dars» (13-Modul) → «Mahsulotingiz hikoyasini qanday aytasiz?» | 1.0 · 1.1 · 1.14 · 2 (pitch bo'laklari, bozor, savol-javob, hakam) · 5 · 8 (`pm-m12d1-pitch`) | K12 | `pm-m10d12-pitch`, `pm-m10d10-hisobot`, `pm-m11d9-tasdiq` → `pm-m12d1-pitch` | QMustaqil — olti bo'lak bittadan karta; kod ekrani yo'q | 12M `12-PmGrowthPitch-v3.md` + `12-FILTR.md` · 10M pitch darsi (K12 — grep «Airbnb» `feedback/F-1005-10modul`) |
| 3 | `03-ProductSpeed-v3.md` | TEX (cho'qqi) · 19 | «Mahsulotingiz hikoyasini qanday aytasiz?» → «Loyiha kuni: demo uchun sayqal» | 1.0 · 1.3 · 1.14 · 2 (tezlik, Lighthouse bahosi, yuklanadigan kod hajmi, keyin yuklash) · 3 (teg 03) · 6 (Lighthouse, Expo Atlas, lazy load) | — | `pm-m9d8-platforma` → `pm-m12d3-tezlik` | kod oynasi (JS/HTML: `loading="lazy"`, `width`/`height`) + 3 blok (o'lchash · ikki tuzatish · qayta o'lchash) | 13M `03-PaymentWebhook-v3.md` + `03-FILTR.md` · 12M `02-WebSocketBasics-v3.md` |
| 7 | `07-PmDemoTest-v3.md` | PM+PRAKT · 12 | «Demoga tayyorgarlik: risklar va B reja» → «Final pitchingiz 5 daqiqaga tayyormi?» | 1.0 · 1.6 · 1.7 · 2 (demo tekshiruvi, demo o'tishi, buzish yozuvi, B reja) · 7 (5, 10) | — | `pm-m12d6-demo` → `pm-m12d7-tekshiruv` | 2 amaliyot bloki (buzish uch usul · uch demo o'tishi + B reja) | 13M `07-PmTerms-v3.md` + `07-FILTR.md` (PM+PRAKT shakli) · 12M `05-BreakAndFix-v3.md` + `05-FILTR.md` (buzish yozuvi) |
Scratchpad: `/tmp/claude-1000/-home-kali-Desktop-internetLesson/55e53e99-c879-4594-8956-6aafe5996e69/scratchpad/m14/md<NN>/`.

## Pilotlarga xos eslatmalar
- **1:** modulning birinchi darsi — olti bo'lak shu yerda tug'iladi (T-011: avval hodisa — o'quvchi 12-Modulda besh bo'lakli pitch aytgan, hakam esa «bozor qancha?», «kim qiladi?» deb so'raydi → yangi ikki bo'lak). Hook — o'quvchining o'z tajribasi (12-Modul pitchi).
  K12 — QVoqea, slaydlar maketi (logotipsiz, raqamsiz). Mentor qoralamasi — tayanch 1.1 aynan; «Raqamlar»da halol gap. QMustaqil — o'z pitchi, bittadan karta (olti karta), `pm-m10d12-pitch` dan oldindan to'ldirish; Bozor — «hali tekshirilmagan» ham to'g'ri javob.
  Investitsiya summasi yo'q (TAQIQLAR 1). 2-dars (hikoya) va'da qilinmaydi. Keysli PM — 16 ekran.
- **3:** cho'qqi — tushuncha tartibi (T-011): avval hodisa (demo paytida sahifa sekin ochiladi — hakam kutadi) → o'lchov (Lighthouse bahosi) → uch metrika (LCP · CLS · TBT, har biri vaziyatdan) → ikki tuzatish → qayta o'lchov.
  Bitta vizual — brauzer maketi (sahifa yuklanishi, rasm siljishi) + baho doirasi (0–100, rang chegaralari rasmiy). Mentor sonlari — yo'q (`{…}`, ⛔ pilot). Mobil trek — Expo Atlas (rasmiy buyruqlar, SDK 51+), web — Lighthouse; ikkalasi teng yo'l.
  `loading="lazy"` — faqat pastdagi rasmga (rasmiy ogohlantirish — test mavzusi bo'lishi mumkin). «Tezlashdi» — faqat oldin/keyin soni bilan. 4-dars va'da qilinmaydi.
- **7:** PM+PRAKT — 12 ekran: nazariya (investor demoda nimaga qaraydi; uch risk) → 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun. Buzish — **o'z mahsulotida**, buzish yozuvi uch qator; agent tuzatadi — «Tuzatish qilindi» + qayta tekshiruv.
  Uch demo o'tishi — taymer; bittasida B reja (video) ochiladi. Mentor misoli natijasi — ⛔ pilot (kutilgan natija «buzilishi mumkin», sabab to'qilmaydi). Yakun holatlari: 3 o'tish xatosiz · tuzatish qildi, o'tish qoldi · buzish boshlandi · hech narsa — rost.
  «Sinov» so'zi yo'q (demo tekshiruvi — o'z ishi). 8-dars va'da qilinmaydi.
