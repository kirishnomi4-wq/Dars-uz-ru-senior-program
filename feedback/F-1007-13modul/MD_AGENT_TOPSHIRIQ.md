# MD v3 agenti — umumiy topshiriq (13-Modul, konveyer 1-bosqich, 07.10.2026)

Siz LMS 13-Modul «O'sish va monetizatsiya» (kod `src/11-Modull`, kalit `m11-NN`) ning BITTA darsi uchun MD v3 yozasiz: o'quvchi ko'radigan har so'z, har ekran qolip turi bilan. Dars hali YO'Q — hamma ekran noldan, to'liq yoziladi.
Suhbatda va MD da modul LMS raqami bilan aytiladi («13-Modul 3-darsi», «12-Modulda»); kod raqami (`m11-03`, `src/11-Modull`) — faqat fayl yo'li va kalitda. O'quvchi matniga kod raqami ko'chmaydi.
Bu modulda tezlik emas, sifat: 12-Modulda tashqi audit har darsdan 10–24 band qabul qilgan, ko'pi bir xil sinflar edi — ular tayanch 7-bo'limda (16 sinf + 13-Modulga xos pul sinflari). Sizning MD ngiz shu sinflardan **birinchi kundanoq** toza chiqishi kerak.
⚠️ Bu modulda pul bor: **real pul yo'q, karta ma'lumoti hech qayerda, maxfiy kalit faqat `.env` da** (TAQIQLAR 1-bo'lim — har ekranga tegadi).

## O'qing (shu tartibda, har birini BIR marta)
1. `feedback/F-1007-13modul/GATE_M_JAVOB.md` — foydalanuvchi qarorlari (Qaror-0, 24 band), MAJBURIY.
2. `feedback/F-1007-13modul/00-MODUL-TAYANCH.md` — misol-ip «Maydon Jamoa» (1.0–1.13), atamalar (2), repo va teglar (3), darslar jadvali (4), keyslar (5), tekshirilgan faktlar (6),
   **oldindan tuzatiladigan sinflar (7)**, saqlash kalitlari (8), to'lqin kelishuvlari (9 — bo'sh bo'lmasa MAJBURIY), ruscha lug'at (10 — sizga faqat ma'lumot). Nom, raqam, so'z — AYNAN shunday.
3. `feedback/F-1007-13modul/00-TAQIQLAR.md` — **nima mumkin emas** (MAJBURIY).
4. `feedback/F-1007-13modul/00-NOMLAR.md` (dars nomlari, menyu osti, oldingi/keyingi dars) · `00-MANBA.md` (dastur jadvali, o'tilgan atamalar, rasmiy iqtiboslar).
5. `konveyer/1-MD.md` — format, qolip turlari, GATE M ro'yxati.
6. `konveyer/QURISH_KARTASI.md` — T · P · S bo'limlari (PM darsda + PM). Har bandni ko'ring.
7. `MATN_KORPUS.md` 1–720-qatorlar to'liq (taqlid-manba); qolgan qismi — mavzu so'zlari bo'yicha grep (narx, pul, to'lov, suhbat, tasdiq, xabar, imzo, test, hisob).
8. `src/qolip/QOLIP.md` — mavjud ekran turlari va maydonlari.
9. 12-Modul tayanchi `feedback/F-1006-12modul/00-MODUL-TAYANCH.md` — 1.0, 1.5 (buzish yozuvi), 1.6 (xavfsizlik ro'yxati, olti band), 1.7 (login, `namuna`, hodisalar, siyosat), 1.10 (Mentor tekshiruvi shakli), 1.13 (sonlar), 9 (kelishuvlar) — 13-Modul shularning ustiga quriladi.
10. Eng yaqin namuna — tayanch 4-bo'lim jadvalining oxirgi ustuni (12-Modul MD v3) **va o'sha MD ning `NN-FILTR.md` fayli** (audit aynan shu turdagi darsda nimani topgani). Tuzilish, hajm, uslub uchun; matn ko'chirilmaydi.
11. `feedback/F-1006-12modul/QURUVCHI_SABOQ.md` (A–E, ayniqsa E 40–55; 🔴 — qat'iy): MD da har ekranni shunga mos loyihalang (bo'sh skelet o'rnida haqiqiy mazmun, siluet emas — real ko'rinishdagi odam, «Ortda qoldingizmi» darsda bir marta, yakun standarti).
Qonun fayllari (`PM_DARS_ETALON.md`, `DARS_ETALON.md`, `PM_Prompt_v8.md`, `QOIDALAR.md`) katta — to'liq o'qimang; kartada raqam tilga olinsa, faqat o'sha joyni grep qiling.
O'tilgan atama — grep (`feedback/F-0928-QA-5modul/YAKUNIY/`, `feedback/F-1005-9modul/*-v3.md`, `feedback/F-1005-10modul/*-v3.md`, `feedback/F-1005-11modul/*-v3.md`, `feedback/F-1006-12modul/*-v3.md`, `src/`).

## Yozing
- **Faqat bitta fayl:** `feedback/F-1007-13modul/<sizning fayl nomingiz>`. Boshqa hech qaysi faylga tegmang (kod, App.jsx, repo, qonun, konveyer, boshqa MD, tayanch, boshqa modullar).
  Yordamchi fayllar (o'lchov skripti, qoralama) — **faqat scratchpad'dagi o'z papkangizda** `md<NN>/` (topshiriqda yo'li berilgan).
- Format — `konveyer/1-MD.md` «Format»: sarlavha qatori, Fayl/ekranlar soni, A-bo'lim (tayanch, atamalar, misol-ip, bitta vizual, **vaqt taqsimoti**), darsning ipi,
  har ekran (`## N · nom ← QOLIP TURI`, eyebrow, sarlavha + belgilar soni, Mentor, tur maydonlari, «Harakat → Vizual o'zgarish», xulosa, «Keyingi bosiladigan joy»), keyin
  Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12 savol, ✔, to'g'ri javob o'rni A/B/C/D har biri 3 marta) ·
  Kartochkalar (10–12; alohida ekran, Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →») ·
  Yakun (12-Modul SABOQ E 50 standarti: chip · ball · sarlavha **holatga qarab** · CODE STRIKE · «Endi siz bilasiz» 3–5 · uyga vazifa · «Keyingi dars — «…»» · nishonlar; «Bugungi asosiy fikr» qutisi yakunda yo'q — u A-bo'limda darsning ichki o'qi) · «KOD» belgilari.
- Ekranlar: tayanch 4-bo'lim. Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q.
- Mentor — o'qituvchi; o'ylab topilgan qahramon yo'q. Siz-forma. Adabiy til, kantselyarit va sheva yo'q. Apostrof — oddiy `'`. O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno).
  Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 («Aynan!» / «Qiziq fikr!» bilan birga) · xato izohi ≤60.
- Har harakatli ekranda: o'quvchi birinchi nimani bosadi — aniq (faol element), Mentor gapi aynan shu harakatni aytadi; bashorat tanlangach yopilmaydi («Harakat → Vizual o'zgarish» qatorida yozing).
- Testlar: 4 variant uzunligi teng (±15%), kalit so'z / tire / strelka / qavs faqat to'g'ri variantda emas; to'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz; distraktor haqiqiy hayotda rost bo'lib qolmasin; uchala noto'g'ri variant bitta turkumdan bo'lmasin.
- **Keys** — faqat tayanch 5-bo'limda darsingizga berilgani: bank matni va brend izohlari aynan; keyssiz dars keyssiz qoladi. Bank matnining ruscha asli — `PM_Prompt_v8.md` (grep «К2», «К17»).
- **Mentor misoli** — «Maydon Jamoa»; raqam, ekran yozuvi, narx, suhbat va tasdiq gapi, xabar matni — faqat tayanch 1-bo'limdan, «Mentor misolida» / «Mentorning taxmini» deb. O'quvchining o'z mahsuloti — har darsning amaliy qismida (o'z mahsuloti, o'z repo'si, o'z treki).
- **Amaliy qism** (bloklar, kod oynasi): tayanch 4 «Amaliyot bloki» — 4 band o'quvchining o'z repo'sida, `{…}` joylari, kutilgan natija «namuna: Maydon Jamoa», «Yordam» — Mentor misolidagi to'liq prompt, «Ortda qoldingizmi» (tayanch 3; darsda bir marta). Har blokda mobil va web yo'li.
- **Tashqi xizmatlar** (Click, Payme, Stripe, Render, Netlify, Neon, Expo, EAS, Telegram, BotFather, Umami, GitHub): tayanch 6 va `00-MANBA.md` 5 dagi iqtiboslar yetmasa — rasmiy hujjatdan o'zingiz tekshiring (WebFetch / WebSearch),
  manba havolasi va sanani MD «Manbalar» bo'limiga yozing; tekshirib bo'lmasa — umumiy so'z bilan yozing va «Shubhali joylar» ga qo'shing. Tugma va menyu nomini, narxni, komissiyani, limitni, vaqtni **taxmin qilmang**.
- Tayanchda yo'q tafsilot kerak bo'lsa — o'zingiz qaror qilasiz, lekin MD oxiridagi **«TAYANCHGA SAVOL»** ro'yxatiga yozasiz (nima, nega). Boshqa darslarga tegadigan nom, son yoki so'zni o'ylab topmang — savol qilib yozing.

## MD oxirida majburiy bo'limlar (shu tartibda)
1. **KOD** — qolipda yo'q, kod kerak bo'ladigan joylar.
2. **REPO** (amaliy blok bo'lsa) — Mentor repo'sida shu dars tegida nima bo'lishi kerak (tayanch 3 jadvali bilan).
3. **Manbalar** — o'zingiz tekshirgan rasmiy sahifalar (havola, sana, bir qator iqtibos).
4. **TAYANCHGA SAVOL** — o'zingiz qaror qilgan har tafsilot.
5. **Shubhali joylar** — ishonchingiz komil bo'lmagan matn va tekshirilmagan qadamlar (⛔ «qur» darvozasi bo'ladiganlari alohida belgi bilan). Yashirmang.
6. **Oldindan tuzatiladigan sinflar — o'z tekshiruvim** — tayanch 7-bo'limning 16 bandi + 13-Modulga xos pul sinflari, har biriga: `[x]` + bu darsda qayerda qo'llangani (ekran raqami) yoki `[—]` + nega bu darsga tegmasligi.
7. **O'lchov** — o'z skriptingiz natijasi: har sarlavha, xulosa, hook javobi, xato izohi uzunligi; test variantlari uzunligi (eng uzun / eng qisqa, ±15%); arena ✔ taqsimoti.
8. **GATE M — o'z tekshiruvim** — `konveyer/1-MD.md` ro'yxati, `- [x]` / `- [ ]` + nega.

## Tekshiring
`npm run lint:til feedback/F-1007-13modul/<fayl>` — 0 error bo'lguncha tuzating (warn lar — ko'rib chiqing, kerak bo'lsa hisobotda sababini ayting).
Qonun nomini to'liq yozmang — lint «fuqaro» qoidasi soxta error beradi: «FK 369-modda» va havola (TAQIQLAR 5 oxiri).
Yozib bo'lgach MD ni boshidan oxirigacha **bir marta qayta o'qing** — auditor ko'zi bilan: har da'vo chegaralanganmi, har son tayanchdami, har tashqi qadam manbalimi, pul chegarasi (TAQIQLAR 1) hech qayerda buzilmaganmi.

## Hisobot (oxirgi xabaringiz, ≤25 qator, o'zbekcha)
Ekran soni va turlari · ballik testlar va ✔ o'rinlari · arena ✔ taqsimoti · lint:til natijasi · TAYANCHGA SAVOL ro'yxati (qisqa) · shubhali joylar · 16 sinfdan qaysi biri eng qiyin bo'lgani va nega.

MD ni foydalanuvchi o'qiydi va ChatGPT auditiga beradi: har da'vo aniq, chegaralangan va tayanchga mos bo'lsin. Shoshilmang — bitta sifatli MD ikki marta tuzatilgan MD dan arzon.

---

# 1-to'lqin — pilotlar (3 dars; har agentga o'z qatori)

| № | Fayl | Tip · ekran | Oldingi → keyingi dars | Tayanch bo'limlari | Keys | Kalit (o'qiydi → yozadi) | Kod mexanikasi | Namuna (MD + uning FILTR i) |
|---|---|---|---|---|---|---|---|---|
| 1 | `01-PmUnitEconomics-v3.md` | PM (keyssiz) · 13–14 | «Zaxira dars» (12-Modul) → «Mahsulotingiz qanday pul topadi?» | 1.0 · 1.1 · 1.13 · 2 (jalb qilish narxi, foydalanuvchi keltiradigan pul, pullik obuna, Pro) · 6 · 8 (`pm-m11d1-birlik`) | keyssiz | `pm-m10d10-hisobot`, `pm-m10d6-kanallar` → `pm-m11d1-birlik` | kod oynasi (JS): `jalbNarxi`, `keltiradi` | 12M `10-PmUsersCheck-v3.md` + `10-FILTR.md` · 12M `12-PmGrowthPitch-v3.md` (kod oynasi ekrani) + `12-FILTR.md` · 12M `11-PmPitchReview-v3.md` (keyssiz shakl) |
| 3 | `03-PaymentWebhook-v3.md` | TEX (cho'qqi) · 18–20 | «Mahsulotingiz qanday pul topadi?» → «Narxni qanday belgilaysiz?» | 1.0 · 1.3 · 2 (to'lov xabari, imzo, takror xabar, rad etilgan to'lov, test rejim, mashq to'lov, to'lov sahifasi, to'lov xizmati) · 3 (teg 03) · 6 (Payme, Click, Stripe, Telegram, Render) | keyssiz | `pm-m9d8-platforma` → `pm-m11d3-oqim` | kod oynasi (takror tekshiruvi) + 2 repo bloki (A1 endpoint va jadval · A2 mashq to'lov sahifasi va webhook testi) | 12M `02-WebSocketBasics-v3.md` + `02-FILTR.md` · 12M `05-BreakAndFix-v3.md` + `05-FILTR.md` · 10M `05-SecurityBasics-v3.md` + `05-FILTR.md` |
| 6 | `06-PmMoneyTalk-v3.md` | PM (keyssiz) · 12 | «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» → «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» | 1.0 · 1.4 (narx, «Doimiy o'yin») · 1.6 · 1.13 · 2 (suhbat, narx, pullik obuna) · TAQIQLAR 1, 3 · 12M tayanch 1.6 (xavfsizlik ro'yxati) | keyssiz | `pm-m11d4-narx`, `pm-m9d3-intervyu` → `pm-m11d6-suhbat` | kod ekrani yo'q | 12M `06-PmChannels-v3.md` + `06-FILTR.md` · 11M `03-PmInterviewsOne-v3.md` + `03-FILTR.md` · 12M `11-PmPitchReview-v3.md` + `11-FILTR.md` |

## Pilotlarga xos eslatmalar
- **1:** modulning birinchi darsi — pulning ikki soni (jalb qilish narxi va foydalanuvchi keltiradigan pul) shu yerda tug'iladi (T-011: avval hodisa — Mentor 44 kishini bepul kanallardan olgan; keyin atama). Hook — o'quvchining o'z ishi (12-Modulda foydalanuvchilarni bepul kanallardan yig'di).
  Mentor sonlari — tayanch 1.1 va 1.13 aynan: kanallarga 0 so'm · narx taxmini 10 000 so'm / 30 kun · 3 oy · 30 000 so'm · «agar» hisobi 60 000 → 12 → 5 000 va 1 tashkilotchi → 60 000. Narx — «Mentorning taxmini»; 4-dars va'da qilinmaydi.
  Freemium'da o'yinchi 0 so'm keltiradi — pul faqat Pro olgan tashkilotchidan: bu 2-darsning kashfiyotini (model tanlovi) oldindan ochmasin — «Pro» faqat Mentor misolining fakti sifatida (1.0), model nomi aytilmaydi.
  Halol gap: 43% — ilovani yana ochish, obunani davom ettirish emas. O'quvchi sonlari ko'pincha 0 va taxmin — yakun holatga qarab (hisoblandi · taxmin bilan · boshlandi), «zarar» — yomon baho emas.
  Kod oynasi — `HtmlCompiler`, JS; sarlavha «…digan kod yozamiz» oilasi; namuna obyekt; `yangi` 0 — bo'lish yo'q. Keyssiz — QVoqea yo'q (tayanch 4: 13–14 ekran).
- **3:** tushuncha tartibi (T-011) — avval hodisa: 7-Moduldagi bot webhook'i (Telegram xabarni o'zi yuboradi) → bugun xabarni to'lov xizmati yuboradi → atama «to'lov xabari» (texnik nomi webhook) → keyin uch g'oya, har biri vaziyatdan:
  soxta xabar (imzo) · ikki marta kelgan xabar (takror xabar) · o'tmagan to'lov (rad etilgan to'lov). Darsning bitta vizuali — telefon (to'lov taklifi ekrani o'rnida bu darsda «mashq to'lov» sahifasi) · to'lov xizmati · Backend (ichida `tolovlar`); xabar konvert bo'lib uchadi.
  Pro va ilova bu darsda o'zgarmaydi — webhook testi Backend va `tolovlar` da (tayanch 1.3, 3). «Mashq to'lov» — o'quvchining o'z Backend'ida; Payme/Click — faqat ko'prik va maket (rasmiy iqtibos bilan; ularning ko'rinishi taqlid qilinmaydi).
  Imzo hisoblash — repo blokida (Node `crypto`, HMAC SHA-256); kod oynasida — faqat takror tekshiruvi. Kafolat yo'q: «xabar keladi» emas — «odatda keladi; javob bo'lmasa xizmat qayta yuboradi». Uxlagan Backend — bir gap, 5-dars va'da qilinmaydi.
  `TOLOV_KALITI` — `.env`; `git status` da `.env` ko'rinmasligi — A1 tekshiruvida. Tekshiruv — o'quvchining o'zi «mashq to'lov» tugmalari bilan (agent shart emas).
- **6:** real odamlar bilan ishlaydigan dars — TAQIQLAR 1 (pul suhbati bosimsiz) va 3 (xavfsizlik) to'liq. Mentor skripti — to'rt savol so'zma-so'z (tayanch 1.6); suhbat — sotish emas, savol; javob so'zma-so'z yoziladi, belgisi: ha · qimmat · yo'q · javob yo'q.
  Mentorning uch suhbati — tayanch 1.6 aynan (tashkilotchilar, tartib raqami bilan, ismsiz). Juftlikda rol o'yini + yakka rejim (12-Modul juftlik ekranlari naqshi). Real suhbatlar — darsda imkon bo'lsa bitta, qolgani uyda; sinfda sanash yo'q.
  Kichik son: «uch suhbat — narx haqida dalil, isbot emas». 9-dars (tasdiq) va'da qilinmaydi. Keyssiz — 12 ekran (tayanch 4 keyssiz PM shakli). Narx o'quvchida `pm-m11d4-narx` dan; yo'q bo'lsa o'zi yozadi.
