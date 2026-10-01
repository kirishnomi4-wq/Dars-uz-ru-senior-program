# 5-Modul (LMS: 7-Modul) · 11-dars «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» — YANGI MATN (v2-qoralama)

Fayl: `src/pm/PmMetricsLesson.jsx` · 18 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `11-PmMetrics-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s3:1 · s6:2 · s8:0 · s13:1` · amaliyot zonalari `stat · foiz · raqamlar · yozuv · koding` = −1, ishtirok) — faqat matn. Jonli viktorina: `0,3,2,1 · 1,0,2,3 · 0,2,1,3`.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (U1–U3, A8 — to'g'ri javob izohi bitta gap) · **30.09: ChatGPT matn auditi (F-0930-113) filtrlandi** — hukmlar `JURNAL.md` · 4-savol A (ballsiz tanlov aralash) · **23-savol A** (01.10, F-1001-83): /stat — bugun kelganlar + bosh raqam; qaytganlar kodi 12-darsda.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

**A1-qo'shimcha (shu darsning atamalari).** Asosiy nom — o'zbekcha nom; inglizchasi faqat 5-ekranda va kartochkada, izohi bilan (testlar va arenada inglizcha nom yo'q).

| Tushuncha | Asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| metric | **metrika** | 2-ekran: «bot haqida sanab tekshirib bo'ladigan raqam» («metr» izohi olindi — 30.09) |
| jami foydalanuvchi | **jami** (Jami /start bosganlar) | 5-ekran: «botga /start bosgan hamma odam, har biri bir marta» — qancha odam yig'ilganini aytadi (30.09: /start hodisalari soni emas) |
| DAU | **bugun kelganlar** | 5-ekran: «Inglizchasi: DAU (kunlik faol foydalanuvchilar)» |
| retention | **qaytganlar foizi** | 5-ekran: «Inglizchasi: retention (ushlab qolish)» — oldin izohsiz edi |
| North Star | **bosh raqam** | 5-ekran: «bot o'z ishini bajarganini sanaydigan raqam; bu botda — keragini olganlar» · «Inglizchasi: North Star (Qutb yulduzi — yo'l ko'rsatadigan yulduz)» (30.09: tushuncha va shu botdagi tanlov ajratildi) |
| log | **bot yozuvi** («log» so'zi ishlatilmaydi) | 11-ekran: «har qator — botga kelgan hodisa yoki botning javobi» |
| chip (mentor eslatmasida) | variant | — |
| «8-darsda odamlardan eshitganingiz» · «ulardan so'ragan edingiz» | 8-darsda **bitta** odam uchta savolga javob bergan → «8-darsda eshitgan javoblaringiz» · «botingizni ishlatgan odamdan so'ragan edingiz» (8-dars atamasi; 12-dars F-0930-110 bilan bir xato) | — |
| Booking «bir vaqtda 1000 dan ortiq sinov» | olinadi — o'rniga «nega avval bir guruhga?» (30.09) | — |

**A4-qo'shimcha (qator belgilari).** Bu darsda emoji qatorni tanitish uchun ishlatilgan (👥 jami · 🙋 bugun · ↩️ qaytgan · ✅ keragini olgan · ⭐ bosh · 🔢 boshqa).
Endi qatorni **nomi** tanitadi (matn), ko'rinishda — CSS rang-nuqta: bosh raqam — to'q, qolganlari — och, jami — kulrang (**KOD**). `ctx.reply` matnida ham emoji yo'q.
Shu bilan eski muammo ham yo'qoladi: 👥 bir joyda «jami», 12-ekranda «bugun» degani edi.

**A8-istisno (hook).** 0-ekranda to'g'ri javob yo'q: ikkala tanlov ham to'liq javob emas (bosh raqam 5-ekranda ochiladi) — 104-qonun, §119. Shuning uchun «Aynan!/Qiziq fikr!» qo'llanmaydi, ikkalasiga bitta neytral javob qoladi.

**A12-qo'shimcha. Har raqam — o'z savoli (30.09).** Jami — «qancha odam yig'ildi?», bugun kelganlar — «bugun odam keldimi?», qaytganlar foizi — «kechagilar qaytdimi?», bosh raqam — «bot o'z ishini bajardimi?». Bitta raqamdan «bot yaxshi / yomon» xulosasi chiqarilmaydi (13-ekran, 4-oyna). «Jami hech narsa aytmaydi» ham deyilmaydi — u faqat yolg'iz yetmaydi.

**PM ohangi.** Texnik atamalar (hodisa, handler, baza) faqat 10, 11, 12-ekranda va 1-dars A1 bo'yicha. Jihozlar paneli (`GearPanel`) bu darsda yo'q (tekshirildi).

---

## Darsning ipi
- **Olam (bitta):** o'quvchining o'z Telegram-boti va unga keladigan odamlar. PM ipi: 2-dars — birinchi odamlar · 8-dars — bitta odamdan so'rash · bugun — raqam · 12-dars — qaytganlar kun-bakun · Demo Day. Bitta tashqi voqea — Booking.com.
- **Hook:** bot yaxshi ishlayotganini qaysi raqam aytadi — jami yoki bugungi son? Javob: jami faqat o'sadi.
- **Asosiy model (dars bo'yi bitta):** fikr ≠ metrika · jami (faqat o'sadi) ≠ uch raqam: bugun kelganlar · qaytganlar foizi · bosh raqam (keragini olganlar) · foiz = yuzta odamga keltirish · «bir odam bir marta».
- **Oldingi bilimga ko'prik:** 8-dars — eshitgan javoblar (0, 10-ekran) · 9-dars — fikrga qarab tuzatish: yordam berdimi? (9-ekran) · 3-dars — `bot.command`, `bot.action`, fallback (10, 12-ekran) · 4-dars — PostgreSQL (12-ekran).
- **Tajribalar:** ikki dushanba (4) · uch nom (5) · foiz to'ri (7) · Booking.com (9) · to'rt raqam (10) · bot yozuvi (11) · /stat kodi (12).
- **Keyingi dars (App.jsx, n:12):** PM — «Kecha kelgan odam bugun ham keldimi?».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — qaysi raqam | hook | jami yoki bugungi sonni tanlaydi | — |
| 1 | Maqsad | qoida | /stat javobida to'rt «?» qatorini ko'radi | — |
| 2 | Ikki gap | tushuncha | fikr va sanaladigan gap kartalarini ochadi → «metrika» | — |
| 3 | 1-savol | test | qaysi javobni sanab tekshirib bo'ladi | ✅ |
| 4 | Ikki dushanba | markaziy | /stat yuboradi → bashorat → yana 3 raqamni so'raydi | ishtirok |
| 5 | Uch nom | tushuncha | qatorlarni bosib, nomlarini ochadi | — |
| 6 | 2-savol | test | kechagilardan bugun kelganlar — qaysi raqam | ✅ |
| 7 | Foiz | markaziy | holatni tanlaydi → ikki foizni navbat bilan hisoblaydi | ishtirok |
| 8 | 3-savol | test | qaysi kunda foiz katta | ✅ |
| 9 | Booking.com | haqiqiy misol | 5 bosqich, 2 bashorat | — |
| 10 | To'rt raqam | mustaqil ish | o'z botining 4 raqamini bittalab yozadi | ishtirok |
| 11 | Bot yozuvi | amaliyot | yozuvdan 3 savol bo'yicha odamlarni sanaydi | ishtirok |
| 12 | Koding · /stat | koding | kod-savol → `bot.js` ga /stat yozadi | ishtirok |
| 13 | 4-savol | yakuniy test | /stat javobidagi foiz nimani aytishini topadi | ✅ (final) |
| 14 | Mustahkamlash | refleksiya | bosh raqamni aytadi, keyin bir qator yozadi | — |
| 15 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 16 | Takrorlash | kartochkalar | 10 kartochka | — |
| 17 | Yakun | xulosa | 5 xulosa, arena, nishonlar, uyga vazifa, keyingi dars | — |

---

## 0 · Kirish — qaysi raqam  `[662]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Bot yaxshi ishlayotganini qaysi raqamga qarab bilasiz?**
- Mentor: Botingizga odamlar /start bosib kelyapti. 8-darsda botingizni ishlatgan odamdan so'ragan edingiz — bugun raqamlarga qaraymiz.
- Tanlov:
  - Jami nechta odam /start bosganiga
  - Bugun nechta odam botga yozganiga
- Javobdan keyin:
  - «Jami» → Jami faqat o'sadi: bot bir hafta ishlamay tursa ham u kamaymaydi.
  - «Bugun» → Bugungi son har kuni o'zgaradi, lekin odam botdan keragini oldimi — buni aytmaydi.
  - Ikkalasidan keyin (bitta qator): Demak bittasi yolg'iz yetmaydi — qaysi raqamlar kerakligini bugun topamiz.
- Jonli darsda: ovozlar diagrammasi (har variant nechta ovoz olgani)
- Tugma: Bittasini tanlang → Davom etish
- Mentorga eslatma (faqat mentor): Ovozlar bo'linadi — ikkala raqam ham yolg'iz yetmaydi, buni bolalar javobdan ko'radi. «Faqat o'sadi» degan joyda to'xtang va so'rang: bot bir hafta ishlamasa, jami soni nima bo'ladi?

**Ko'rinish:** kirganda — sarlavha, Mentor va ikki variant (teng, birdan — A6 istisnosi: tanlov). Tanlangach — javob izohi (bitta ramka); jonli darsda uning ostida ovozlar diagrammasi.
Animatsiya: yo'q.
Olib tashlanadi: variantlar oldidagi 🔢 🙋 (ovozlar diagrammasida ham).

✎ Mentor'ga 8-darsga ko'prik (PM ipi) · «bot bir hafta jim tursa» → «ishlamay tursa» («jim» — javob bermaydi degani; bu yerda bot umuman ishlamasligi nazarda tutilgan) · «darsda ikkalasini… ko'rasiz» → «Birozdan keyin … ko'ramiz» (4-ekranda) · hook'da to'g'ri javob yo'q — bitta neytral javob qoladi (A8-istisno)
✎ 30.09 ChatGPT #4, #25 **Qisman**: savol «qaysi raqam?» — ikkala variant ham yolg'iz yetmaydi, eski javob buni aytmasdi («ikkalasi ham halol») → har tanlovga o'z gapi + «bittasi yolg'iz yetmaydi»; savol va ikki variant qoladi (ovoz — jonli diagramma; 3-variant «hali bilmaymiz» hookni testga aylantirardi) · 🔴 FAKT: «8-darsda ulardan so'ragan edingiz» — 8-darsda bitta odam (F-0930-110 bilan bir sinf)

## 1 · Maqsad  `[733]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun botingiz uchun to'rt raqam tanlaysiz.**
- Mentor: Bittasi — eng muhimi, uchtasi — unga yordam beradi. Dars oxirida shulardan ikkitasini — bugun kelganlar va bosh raqamni — sanaydigan /stat buyrug'ini botingizga yozasiz.
- Vizual: Telegram-suhbat — siz «/stat» → bot javobi yoziladi: to'rt qator, har birida «?». Birinchi qator kattaroq (eng muhimi).
  - 10-ekran to'ldirilgan bo'lsa (orqaga qaytganda): birinchi qatorda bosh raqam nimani sanashi, qolganlarida o'quvchining o'z raqam nomlari — har birida «?».
- Tugmalar: Orqaga · Boshlaymiz →
- Mentorga eslatma (faqat mentor): Pufak yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

**Ko'rinish:** sarlavha + Mentor → pufak qatorlari birma-bir yoziladi (hozirgidek). Qator belgisi — CSS nuqta: birinchisi to'q va kattaroq, qolgan uchtasi och (**KOD**).
Animatsiya: yo'q (qatorlarning ketma-ket chiqishi — chatning o'z ko'rinishi; chizish yo'q).
Olib tashlanadi: ⭐ 🔢 🙋 ↩️ qator belgilari.

✎ 🔴 FAKT: «ikkitasini dars oxirida botingiz /stat buyrug'i bilan o'zi sanaydigan bo'ladi» → 12-ekrandagi /stat qo'lda yozilgan ro'yxatdan sanaydi, botga kelgan haqiqiy odamlarni emas (haqiqiy sanash — baza bilan, uy vazifasining qo'shimcha qismi). «Sanaydigan /stat buyrug'ini yozasiz» — rost
✎ 30.09 ChatGPT #9 **Qabul**: «ikkitasi» — 12-ekranda uch qator (bugun, qaytgan, foiz) → qaysi ikkitasi aytildi (qaytgan soni — foizning bir qismi); 23-savol A bo'lsa — «bugun kelganlar va bosh raqamni»
✎ 01.10 **23-savol A** (F-1001-83): Mentor — «bugun kelganlar va bosh raqamni» (12-ekrandagi /stat aynan shu ikkitasini sanaydi)

## 2 · Ikki gap  `[764]`
- Eyebrow: Muhokama · ikki gap
- Sarlavha: **Qaysi gapni tekshirib ko'rsa bo'ladi?**
- Mentor: Botingiz haqida ikki gap. Ikkala kartani bosing.
- Kartalar (bosilsa ochiladi, qayta bosilsa yopiladi):
  - **«Botim juda yaxshi ishlayapti»** — Buni sanab bo'lmaydi: har kim «yaxshi»ni o'zicha tushunadi.
  - **«Bugun botga 12 odam yozdi»** — Buni sanasa bo'ladi: botga kelgan xabarlarni sanab, 12 ta ekanini tekshirasiz.
- Xulosa (2/2 dan keyin): **Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.** Nimani sanashingiz aniq bo'lsa, uni har kim qayta sanab, o'sha sonni oladi.
- Tugma: Yana N kartani oching → Davom etish
- Mentorga eslatma (faqat mentor): Kimdir «metrika — guvohnoma-ku» desa: so'z bir xil, ma'no boshqa — bu yerda o'lchash.

**Ko'rinish:** ikki karta yonma-yon — ikkala gap solishtirish uchun ko'rinib turadi, izohi bosilganda ochiladi (1-dars 2-ekran naqshi); xulosa 2/2 dan keyin.
Animatsiya: yo'q.
Olib tashlanadi: 💬 🔢 karta belgilari — fikr kartasi kulrang, raqam kartasi asosiy rangda (**KOD**).

✎ 🔴 FAKT (mayda): «So'z "metr" dan olingan» → metrika metrdan olinmagan, ikkalasi ham yunoncha «metron» (o'lchov) dan — «bir o'zakdan» · «bot yozuvidan» → «botga kelgan xabarlarni sanab» (bot yozuvi 11-ekrangacha tanish emas) · Mentor'dagi tire olindi
✎ 30.09 ChatGPT #2, #13 **Qisman**: «metrika = son bor gap» deb tushunilmasin — ta'rif qoladi (sanab tekshirib bo'ladigan raqam), ikkinchi gap mezonni aytadi: kim sanasa ham o'sha son (uning «oldindan belgilangan ko'rsatkich» ta'rifi 10–17 yosh uchun og'ir) · #33 «metr» izohi olindi (darsga kerak emas) · mentor eslatmasi «metrika — guvohnoma-ku» qoladi (o'zbek tilida so'z shu ma'noda ham ishlatiladi) · #36 kartalar bir-birini yopmaydi — 29.09 da yonma-yon

## 3 · 1-savol ✅  `[806]`
- Eyebrow: Tekshiruv · sanab bo'ladigan raqam
- Savol: **Sizdan «Botingiz qanday ishlayapti?» deb so'rashdi. Qaysi javobni sanab tekshirib bo'ladi?**
  - Men botimga 10 dan 9 ball beraman
  - ✔ Bugun botdan 9 odam javob oldi
  - Botim sinfdagi 5 ta botning eng qulayi
- To'g'ri: 9 odamni botga kelgan xabarlardan sanab tekshirasiz, «9 ball» va «eng qulay» esa — fikr.
- Xato izohlari:
  - (A) 9 ball — sizning bahoyingiz. Son bor, lekin boshqa odam o'zicha boshqa ball beradi: bu fikr.
  - (C) 5 ta botni sanasa bo'ladi, lekin «eng qulay»ini emas: kimgadir qulay, kimgadir yo'q.
  - (umumiy) Sanab tekshirib bo'ladigan gapni botga kelgan xabarlardan tekshirasiz: nechta odam keldi, nechtasi javob oldi.
- Test ekranlarining umumiy yozuvlari (3, 6, 8, 13): Javobni tanlang · To'g'ri · Qaytadan urinib ko'ring · jonlida: «Jonli dars — bitta urinish, o'ylab tanlang!» · «Javobingiz qabul qilindi» / «Hozir to'g'ri javobni bilib olasiz.» · «To'g'ri javob: B — …»

**Ko'rinish:** test — variantlar birdan va teng (A6 istisnosi).
Animatsiya: yo'q.
Olib tashlanadi: savol boshidagi 🤖 · umumiy yozuvlardagi ⚡ 📨.

✎ Test halolligi: oldin son faqat to'g'ri javobda edi — javobni o'qimasdan topsa bo'lardi. Endi uchala variantda son bor; farq — sonni tekshirib bo'ladimi (2-ekran qoidasi, yangi bilim emas) · «Mentor botingiz haqida so'radi» → «Sizdan … deb so'rashdi» · ✔ o'rni B (s3:1) — o'zgarmadi
✎ 30.09: to'g'ri izoh bitta gap (A8) · ChatGPT #24 «son faqat to'g'rida» — 29.09 da tuzatilgan; uning variantlari («9 odam «qulay» deb baholadi») rad: baholarni ham sanasa bo'ladi — ikki to'g'ri javob chiqardi

## 4 · Ikki dushanba (markaziy)  `[836]`
- Eyebrow: Amaliyot · ikki dushanba
- Sarlavha: **/stat yuboring va ikki dushanbani solishtiring.**
- Mentor (holatga qarab):
  - boshida: Chapda — o'tgan dushanba, o'ngda — bu dushanba. Bot bitta, kunlar ikki xil.
  - javob tanlangach: Endi botdan yana uch raqamni so'rang va ikki suhbatni yonma-yon o'qing.
- Ikki ustun: **O'tgan dushanba** · **Bu dushanba** — har birida Telegram-suhbat (boshida «· · ·»)
- Tugma: /stat → ikkala suhbatda bot: Jami: 100 · Jami: 120
- Bashorat: **Faqat shu raqamga qarab: bot yaxshilandimi?**
  - Ha, 20 odam qo'shildi
  - Bu raqamdan bilib bo'lmaydi
- Tanlangach (bitta qator): ✓ Javobingiz: {tanlangan variant}
- So'rash tugmalari (bosilganda ikkala suhbatga qator qo'shiladi, ostida izoh chiqadi):
  - + Bugun kelganlar → Bugun kelganlar: 18 / 6 — *Bu dushanba botga uch barobar kam odam yozdi: 18 emas, 6.*
  - + Kechagilardan qaytgani → Kechagilardan qaytgani: 20 tadan 9 / 8 tadan 1 — *O'tgan safar kechagi 20 odamdan 9 tasi qaytgan edi, bu safar 8 tadan 1 tasi.*
  - + Keragini olganlar → Keragini olganlar: 15 / 4 — *Botdan kerakli javob olganlar ham kamaydi: 15 tadan 4 taga.*
- Xulosa: **Jami 100 dan 120 ga o'sdi — qolgan uch raqam esa tushdi.** Jami faqat o'sadi, shuning uchun bot qanday ishlayotganini u yolg'iz aytmaydi.
- Tugma: ① «/stat» buyrug'ini yuboring → ② Savolga javob bering → ③ Yana N raqamni so'rang → Davom etish
- Jonlida o'quvchiga: Sinfda: N bajardi · N hali bajarmoqda
- Mentorga eslatma (faqat mentor): «Jami 120 — ko'payibdi!» degan ovozlar chiqadi. Shunda o'ng suhbatdagi qolgan qatorlarni birga o'qing — xulosani bolalar o'zi aytsin. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:**
1. Kirganda: ikki bo'sh suhbat va /stat tugmasi.
2. /stat bosilgach: ikkala suhbatda «Jami», ostida bashorat savoli.
3. Javob tanlangach: savol «✓ Javobingiz: …» qatoriga yig'iladi (**KOD**), birinchi so'rash tugmasi chiqadi («+ Bugun kelganlar»). Bosilgach — keyingisi («+ Kechagilardan qaytgani»), keyin oxirgisi («+ Keragini olganlar»); bosilgani ✓ bo'lib qoladi (A6; **KOD:** hozir uchalasi birdan).
4. Izoh — bitta, oxirgi so'ralgan raqamniki (hozirgidek).
5. Uchalasi so'ralgach — xulosa (bitta ramka).

Animatsiya: HA — uchala raqam so'ralgach, har qator yonida o'tgan dushanbadan bu dushanbaga yo'nalish strelkasi chiziladi: Jami — yuqoriga, qolgan uchtasi — pastga (~1 s; rang neytral, qizil emas). Farqning o'zi — yo'nalish.
Olib tashlanadi: 40 soniyadan keyingi «Tugmalarni bosing va ikki suhbatni yonma-yon o'qing» maslahati (Mentor shu gapni aytadi) · «Tanlovingiz yozildi. Endi botdan yana uch raqamni so'rang.» (✓ qator va Mentor bilan bir ma'no) · 👥 🙋 ↩️ ✅ 📈 🤔 💡 ✏️.

✎ Mentor boshida sarlavhani takrorlardi («avval /stat tugmasini bosing») → ustunlarni tanishtiradi; javobdan keyin — keyingi qadam (**KOD:** hozir Mentor faqat boshida) · «20 dan 9» → «20 tadan 9» · bashorat variantidagi tire olindi
✎ 30.09 ChatGPT #8, #38 **Qabul**: so'rash tugmalari navbat bilan (A6 — 29.09 da «tartib ahamiyatsiz» deb uchalasi birdan qoldirilgan edi) · #5: «u aytmaydi» → «yolg'iz aytmaydi»; «Buni qolgan uchtasi aytadi» olindi (13-ekran bilan zid bo'lmasin — bitta raqamdan xulosa yo'q) · #1 bu ekran — darsning yuragi, saqlandi

## 5 · Uch nom  `[944]`
- Eyebrow: Muhokama · uch nom
- Sarlavha: **Har raqam qaysi savolga javob beradi?**
- Mentor: Har qatorni birma-bir bosing.
- Chapda: «Bu dushanba» — /stat → Jami: 120 · Bugun kelganlar: 6 · Kechagilardan qaytgani: 8 tadan 1 · Keragini olganlar: 4
- Qator bosilsa o'ngda karta ochiladi:
  - Jami: 120 → «Botga jami qancha odam keldi?» · Botga /start bosgan hamma odam, har biri bir marta. U faqat o'sadi: bot qanday ishlayotganini yolg'iz aytmaydi.
  - Bugun kelganlar → «Botga bugun odam keldimi?» · **Bugun kelganlar** · Bugun botga yozgan yoki tugma bosgan odamlar — har biri bir marta sanaladi. · Inglizchasi: **DAU** («kunlik faol foydalanuvchilar»)
  - Kechagilardan qaytgani → «Odamlar botga qaytyaptimi?» · **Qaytganlar foizi** · Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi. · Inglizchasi: **retention** («ushlab qolish»)
  - Keragini olganlar → «Bot o'z ishini bajardimi?» · **Bosh raqam** · Bot o'z ishini bajarganini sanaydigan raqam. Bu botda — keragini olgan odamlar. · Inglizchasi: **North Star** («Qutb yulduzi» — yo'l ko'rsatadigan yulduz)
- Tugma: Yana N qatorni oching → Davom etish

**Ko'rinish:** hozirgidek — bir vaqtda bitta karta; ochilgan qator ✓ bilan belgilanadi.
Animatsiya: yo'q (4-ekranda strelka bor).
Olib tashlanadi: xulosa «Bot qanday ishlayotganini jami emas, shu uch raqam aytadi.» (4-ekran xulosasining oxirgi gapi bilan bir ma'no) · 👥 🙋 ↩️ ✅.

✎ Bosh raqam ta'rifi o'zini takrorlardi («eng muhim raqami — shuning uchun bosh raqam») → nimani sanashi aytiladi · retention'ga izoh qo'shildi (DAU va North Star'da bor edi) · «Shimol yulduzi» → «Qutb yulduzi» (Polaris'ning o'zbekcha nomi; taklif — eslatma 4)
✎ 30.09 ChatGPT #5 **Qabul**: «Jami hech bir savolga javob bermaydi» — noto'g'ri: u «qancha odam yig'ildi?»ga javob beradi → o'z savoli + «yolg'iz aytmaydi» · #3 **Qabul**: jami — /start bosishlar soni emas, odamlar soni («har biri bir marta») · #6, #12 **Qabul**: bosh raqam — tushuncha («bot o'z ishini bajardimi»), «keragini olganlar» — shu botdagi tanlov · #34 inglizcha nomlar bir marta — 29.09 da · #35 «asosiy ko'rsatkich» — Rad: «bosh raqam» dars bo'yi bitta nom (A2), 14-ekranda o'quvchi o'zi aytadi

## 6 · 2-savol ✅  `[1002]`
- Eyebrow: Tekshiruv · qaysi raqam
- Savol: **Kecha 10 odam keldi. Ulardan 3 tasi bugun ham keldi. Bu qaysi raqam haqida?**
  - Bugun kelganlar soni
  - Botning bosh raqami
  - ✔ Qaytganlar foizi
- To'g'ri: Kechagi 10 odamdan bugun ham kelgan 3 tasi sanalyapti — bu qaytganlar foizi.
- Xato izohlari:
  - (A) Bugun kelganlar — bugun botga yozgan hamma odam. Bu yerda esa faqat kechagilardan kelganlar sanalyapti.
  - (B) Bosh raqam odam keragini olganini sanaydi. Bu yerda esa kechagi odamlar qaytgani sanalyapti.
  - (umumiy) Kechagi odamlardan bugun ham kelganlar — qaytganlar.

**Ko'rinish:** test. Animatsiya: yo'q.
Olib tashlanadi: 🤖.

✎ To'g'ri izohi aniqlandi («o'ndan uchtasi» → nomi bilan) · ✔ o'rni C (s6:2)

## 7 · Foiz (markaziy)  `[1028]`
- Eyebrow: Amaliyot · foiz
- Sarlavha: **Qaysi holat yaxshiroq: 8 odam yoki 4 odam?**
- Mentor (holatga qarab):
  - boshida: Ikki holatni o'qing va birini tanlang — keyin foizni hisoblaymiz.
  - tanlagach: Odam soni har kuni har xil — shuning uchun har yuztadan nechtasi qaytishini sanaymiz. Bu — foiz.
  - tugagach, B tanlangan bo'lsa: Aynan! Foiz ham shuni ko'rsatdi.
  - tugagach, A tanlangan bo'lsa: Qiziq fikr! Ko'pchilik shunday tanlaydi — foiz esa boshqacha chiqdi.
- Tanlov tugmalari: A holat · B holat
- Tanlangach (bitta qator): ✓ Tanlovingiz: A holat (yoki B holat)
- Holatlar (har birida 100 katakli to'r):
  - **A** — Dushanba 40 odam keldi, seshanba ulardan 8 tasi qaytdi → [Foizni hisoblash] → 8 ÷ 40 × 100 = **20** · yuzta odamdan 20 tasi
  - **B** — Payshanba 10 odam keldi, juma ulardan 4 tasi qaytdi → [Foizni hisoblash] → 4 ÷ 10 × 100 = **40** · yuzta odamdan 40 tasi
  - tanlovdan oldin tugma yozuvi: Avval holatni tanlang
- Xulosa: **8 odam 4 tadan ko'p, lekin foiz B da ikki barobar katta: 40 va 20.** Odam soni har xil bo'lsa — foizni solishtiring.
- Tugma: ① Qaysi holat yaxshiroq — tanlang → ② Yana N holatda foizni hisoblang → Davom etish
- Mentorga eslatma (faqat mentor): Ko'pchilik «A — 8 odam qaytdi» deb tanlaydi. Hisobni bolalar o'zi ochsin, keyin so'rang: 40 kishilik va 10 kishilik guruhni qanday solishtiramiz? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:**
1. Kirganda: ikki holat kartasi (matn va bo'sh to'r) hamda tanlov tugmalari — ikkala holat birdan ko'rinadi, chunki tanlov solishtirishni talab qiladi.
2. Tanlangach: tanlov «✓ Tanlovingiz: …» qatoriga yig'iladi; faqat A holatdagi «Foizni hisoblash» faol (**KOD:** hozir ikkalasi birdan).
3. A hisoblangach — B tugmasi faol. 4. Ikkalasi hisoblangach — Mentor tanlovga qarab gapiradi, ostida xulosa.

Animatsiya: HA — «Foizni hisoblash» bosilganda to'rda kataklar birma-bir yonadi (A da 20, B da 40; ~1.2 s): foiz — yuzta katakdan nechtasi, ko'z bilan ko'rinadi. Hozirgi `DotGrid` shunday ishlaydi — qoladi.
Olib tashlanadi: tanlov yorlig'i «Qaysi holatda odamlar botga yaxshiroq qaytdi?» (sarlavha shu savolni beradi) · Mentorning «tugagach» ta'rifi «Foiz — har yuzta odamdan nechtasi qaytgani» («tanlagach» gapini takrorlardi).

✎ Tanlovga javob yo'q edi — endi Mentor tanlovga qarab «Aynan!» / «Qiziq fikr!» (**KOD**); natija faqat xulosada · tugma «A»/«B» → «A holat»/«B holat» · «Avval yuqorida tanlang» → «Avval holatni tanlang»

## 8 · 3-savol ✅  `[1096]`
- Eyebrow: Tekshiruv · foiz
- Savol: **Bir kuni 20 odamdan 5 tasi qaytdi, boshqa kuni 6 odamdan 3 tasi. Qaysi kunda foiz katta?**
  - ✔ Ikkinchi kunda — 6 odamdan 3 tasi
  - Birinchi kunda — 20 odamdan 5 tasi
  - Ikkala kunda teng — har kuni qaytgan bor
- To'g'ri: Yuzta odamga keltirilsa, ikkinchi kunda 50, birinchisida 25 odam qaytgan bo'lardi.
- Xato izohlari:
  - (B) 5 ta 3 tadan ko'p, lekin guruhlar har xil: 20 odamdan 5 tasi — yuztadan 25, 6 odamdan 3 tasi — yuztadan 50.
  - (C) Ikkala kunda ham odam qaytgan, lekin foizlari har xil: 25 va 50.
  - (umumiy) Guruhlar har xil kattalikda — foizni solishtiring.

**Ko'rinish:** test. Animatsiya: yo'q.
Olib tashlanadi: 🤖.

✎ faqat 🤖 olindi (variantlar teng, tire uchalasida bor) · ✔ o'rni A (s8:0)

## 9 · Booking.com (haqiqiy voqea)  `[1134]`
- Eyebrow: Haqiqiy misol
- Sarlavha: **Booking.com'dagi yangi tugma rangi.**
- Bosqich yorlig'i: «Booking.com · N / 5» · bashorat bosqichida: «Avval o'zingiz belgilab ko'ring · N / 5»
  1. **Joy band qilinadigan sayt** — Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. U yerda deyarli har bir o'zgarish — tugma rangi, matn, sahifadagi bo'limlar tartibi — **hammaga birdan ko'rsatilmaydi**.
  2. **Yangi tugma rangi avval kimga ko'rsatiladi?** — Saytdagi hamma odamga birdan · ✔ Odamlarning bir qismiga · Faqat kompaniya xodimlariga
     - Topsa: Aynan! Odamlarning bir qismiga. · Topmasa: Qiziq fikr! Aslida — odamlarning bir qismiga.
  3. **Nega hammaga birdan emas?** — Yangi rang hali tayyor bo'lmagani uchun · Hamma bir vaqtda saytga kirmagani uchun · ✔ Ikki guruhning raqamini solishtirish uchun
     - Topsa: Aynan! Ikki guruhning raqami solishtiriladi. · Topmasa: Qiziq fikr! Aslida — ikki guruhning raqamini solishtirish uchun.
  4. **Ikki guruh — ikki raqam** — Yangi rangni odamlarning bir qismi ko'radi, qolganlari eskisini ko'rib turadi. Keyin **ikki guruhning raqamlari solishtiriladi**: qaysi rangda raqam yaxshiroq bo'lsa, o'sha qoladi.
  5. (ko'prik) Botingizda biror narsani o'zgartirsangiz — tugma qo'shsangiz yoki 9-darsdagidek fikrga qarab tuzatsangiz — shu savol chiqadi: bot yaxshi bo'ldimi? Buni bilish uchun bosh raqamni o'zgarishdan **oldin** o'lchab qo'yasiz, keyin yangi raqam bilan solishtirasiz.
- Nuqtalar: «Avval shu bosqichni tugating»
- Tugma: Avval javobingizni belgilang / Keyingi bosqich (N/5) → Davom etish
- Mentorga eslatma (faqat mentor): Booking qaysi raqamga qaraganini manba aytmaydi — o'zingizdan qo'shmang. Sinov usulini (odamlar guruhlarga qanday bo'linadi, qancha kutiladi) batafsil ochmang: bu darsda faqat g'oya kerak — o'zgarishni avval odamlarning bir qismi ko'radi va ikki guruhning raqami solishtiriladi.

**Ko'rinish:** bosqichlar bittadan (hozirgidek); bashoratda javob belgilanmaguncha keyingi bosqich yopiq. Variantlar birdan va teng.
Animatsiya: yo'q.
Olib tashlanadi: ⚡ 🏨 🎲 🎯 🌍 👥 🏢 🔢 · 30.09: «2017-yilda nechta sinov» bashorati va «Mingta sinov bir vaqtda» bosqichi.

✎ 🔴 FAKT (mentor eslatmasi): «Sinovning nomini va usulini ochmang: u keyinroq alohida dars» → bunday dars yo'q: senariyda bu eski rejadagi alohida analitika darsi edi; hozirgi App.jsx'da 12 — qaytganlar, 13 — zaxira, 14 — Demo Day (eslatma 1) · ko'prikka 9-dars qo'shildi (tuzatish yordam berdimi — buni raqam aytadi) · «bank» (ichki so'z) → «manba» · Booking faktlari manbaga mos (2017 · bir vaqtda 1000 dan ortiq · har o'zgarish odamlarning bir qismida) — o'zgarmadi
✎ 30.09 ChatGPT #12, #32 **Qabul**: «2017-yilda 1000 dan ortiq sinov» bashorati darsning ko'nikmasiga xizmat qilmasdi → «Nega hammaga birdan emas?» bashorati (ikki guruh — ikki raqam — shu ekranning asosiy g'oyasi); 6 → 5 bosqich, bashorat 2 ta qoladi (PM 33-qonun); faktlar manbadagi «har o'zgarish bir qismida» bilan qoladi · 3-bosqich xato variantlari ishonarli, lekin to'g'ri emas («xato bo'lsa hamma ko'rmasin» varianti qo'yilmadi — u ham rost sabab, ikki to'g'ri javob bo'lardi) · #26 ko'prik: «oldin o'lchab — keyin solishtirasiz» · sarlavha «Biznes olamidan mashhur voqea» → aniq (12-dars «Bizning olamdan» bilan bir sinf) · «Topdingiz!/Aslida» → «Aynan!/Qiziq fikr!» (12-dars bilan bir) · ✔ o'rni: 2-bashorat 2-o'rinda, 3-bashorat 3-o'rinda (4-savol A)

## 10 · To'rt raqam (mustaqil ish)  `[1231]`
- Eyebrow: Mustaqil ish · to'rt raqam
- Sarlavha: **Botingiz nimani sanaydi?**
- Tasma (8-darsda javoblar yozilgan bo'lsa): 8-darsda eshitgan javoblaringiz: … · … · …
- Mentor (boshida): tasma bo'lsa — «Tepada — 8-darsda eshitgan javoblaringiz. Ularni botingiz sanay oladigan raqamga aylantiring.» · bo'lmasa — «Botingiz odamga nima beradi? Shuni sanaydigan raqamlarni yozing.»
- Qadamlar qatori: 1 Bosh raqam · 2 Bugun kelganlar · 3 Qaytganlar foizi · 4 O'z raqamingiz (bajarilgani ✓)
- Kartani to'ldirish:
  - (faqat 4-karta) nom maydoni: «Masalan: Menyu bosganlar»
  - Nimani sanaydi: (oldindan yozilgan: 2-karta — «bugun botga yozgan yoki tugma bosgan odamlar» · 3-karta — «kecha kelganlardan bugun ham kelganlar, foizda») · bo'sh joyda: «Nimani sanaysiz?» / 4-kartada «Masalan: «Menyu» tugmasini bosgan odamlar»
  - Nima bo'lganda sanaladi (bir nechtasini tanlash mumkin): /start bosilganda · xabar kelganda · tugma bosilganda · bot kerakli javobni yuborganda
  - Kartaning ostida (maydon emas, doim ko'rinadi): Bir odam bir kunda bir marta sanaladi.
    - tahrirlashda yonida kod: = bot.start · = bot.on('text') · = bot.action / bot.hears · = ctx.reply
  - Tugma: Saqlash → / ✓ Yangilash
- Yetishmasa: Nimani sanashini yozing. · Raqamingizga qisqa nom bering. · Bu raqam allaqachon yozilgan — boshqasini tanlang. · Nima bo'lganda sanalishini tanlang — kamida bittasini.
- Saqlagach (4 soniya): ✓ {nom} yozildi: «{nimani sanaydi}» — bot uni {tanlanganlar, «yoki» bilan} sanaydi.
- Topshiriq paneli: Topshiriq · **To'rt raqam** · ○ Bosh raqam — bot o'z ishini bajarganini sanaydi · ○ «Nima bo'lganda» tanlangan · ○ 4-raqam takrorlanmaydi
- Yordam (yig'iq): Botingiz odamga nima beradi? Odam shuni olsa — **bitta sanaladi**. Bot buni odamdan so'ramaydi: o'zi yuborgan kerakli javobdan sanaydi (masalan, «buyurtmangiz saqlandi»).
- Tugagach: **Botingizning to'rt raqami** (ro'yxat; har qator yonida «Tahrirlash»)
- Qo'shimcha (yig'iq, tugagach): Bugun botingizni kimlar ishlatganini eslang (masalan, sinfdoshlaringiz) va ularni sanang — bir odam bir marta.
- Tugma: ① Bosh raqamni yozing → ② Yana N raqamni yozing → Davom etish
- Mentorga eslatma (faqat mentor): «Odamlar mamnun» deb yozganlarga bitta savol: buni bot qaysi xabardan biladi? Javob topilmasa — raqam emas, fikr yozilgan. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:** kartalar bittadan (hozirgidek, A6 bilan mos): joriy karta ochiq, bajarilgani qadamlar qatorida ✓; 4-karta saqlangach — ro'yxat. Karta ichida ham maydonlar navbat bilan: «Nimani sanaydi» to'lgach — «Nima bo'lganda sanaladi» (**KOD:** hozir birdan). Natija — bitta (ro'yxat).
Animatsiya: yo'q.
Olib tashlanadi: yakundagi «To'rt raqamingiz yozildi — har birida nima bo'lganda sanalishi tanlangan» qatori (ro'yxat va topshiriq panelidagi ✓ lar shuni ko'rsatadi) · 🎙 ⭐ 🙋 ↩️ 🔢 🤔 ✅ 🎯 💡.

✎ 🔴 FAKT: «tugma bosilganda = bot.hears» → 3-darsda botingizga xabar ustidagi tugmalarni qo'shgansiz, ularni `bot.action` ushlaydi; `bot.hears` — pastdagi tugma yoki oddiy matn uchun → «bot.action / bot.hears» · 🔴 FAKT: «terminaldagi yozuvlardan sanang» → o'quvchi botida terminal yozuvi yo'q (oldingi darslarda kelgan xabarni terminalga chiqarish o'rgatilmagan) → sinfdoshlar misolida sanash · Mentor «Uch odamdan eshitganingizni raqamda yozing» — nima qilish kerakligi noaniq edi → «sanay oladigan raqamga aylantiring» · tasmaga «(8-dars)» qo'shildi
✎ 30.09 🔴 FAKT: «8-darsda odamlardan eshitganingiz» — 8-darsda bitta odam → «eshitgan javoblaringiz» (8-dars atamasi) · ChatGPT #15 **Qabul**: «bir odam bir marta» qoidasi kartaning o'zida (bot 5 marta javob yuborsa ham odam bir marta) · #14 Qisman: «bot javob yuborganda» (`ctx.reply`) hodisa emas — to'g'ri; lekin bosh raqam aynan shu joyda sanaladi (odam keragini olgan payt) → variant qoladi, nomi aniq: «bot **kerakli** javobni yuborganda» (1-dars A1: hodisa — kiradi, javob — bot yuboradi) · #7 **Qabul**: «keragini oldi» — bot yuborgan kerakli javobdan sanalishi ochiq aytildi (Yordam) · #13, #39 Qisman: karta ichida maydonlar navbat bilan (A6); yangi maydon («qaysi savolga javob beradi») qo'shilmadi — 5-ekranda berilgan, 2 va 3-karta oldindan to'ldirilgan

## 11 · Bot yozuvi (amaliyot)  `[1410]`
- Eyebrow: Tekshiruv · bot yozuvi
- Sarlavha: **Botning bir kunlik yozuvidan uch raqamni sanang.**
- Mentor: Har qator — botga kelgan hodisa (xabar, /start yoki tugma) yoki botning javobi. «Keragini oldi» — bot kerakli javobni yuborgan qator. Savolga mos qatorlarni bosing: bir odam bir marta sanaladi.
- Yozuv: **Seshanba · bot yozuvi** (odam qatori va bot qatori rang bilan ajraladi — **KOD**)
  1. 08:40 Kamola — /start bosdi
  2. 08:40 bot → Kamola — kerakli javobni yubordi
  3. 09:15 Otabek — «salom» deb yozdi
  4. 09:15 bot → Otabek — «Tushunmadim» dedi
  5. 12:02 Kamola — tugma bosdi
  6. 12:02 bot → Kamola — kerakli javobni yubordi
  7. 16:30 Bekzod — tugma bosdi
  8. 16:30 bot → Bekzod — kerakli javobni yubordi
  9. 18:10 Sevara — /start bosdi
  10. 18:10 bot → Sevara — salom berdi
- Savollar («Savol N / 3» · «Belgilandi: N» · [Tekshirish]):
  1. **Bugun kelganlar — kimlar botga keldi?** (to'g'risi: Kamola, Otabek, Bekzod, Sevara)
     - To'g'ri: Bugun 4 odam keldi: Kamola ikki marta yozdi, lekin bir marta sanaladi.
     - Xato: Bu qatorni bot yozgan — odam emas. · {Ism} allaqachon sanalgan — bir odam bir marta. · (sabab topilmasa) Hali hammasi emas — yozuvni oxirigacha ko'ring.
  2. **Bosh raqam — kim keragini oldi?** (faqat bot qatorlari; to'g'risi: Kamola, Bekzod)
     - To'g'ri: Keragini 2 odam oldi: Kamola va Bekzod.
     - Xato: Otabek javob oldi, lekin keragini emas — bu raqamga qo'shilmaydi. · Salom — hali odamga kerakli javob emas. · {Ism} allaqachon sanalgan — bir odam bir marta. · (sabab topilmasa) Kerakli javob olgan yana bir odam bor.
  3. **Qaytganlar — kechagilardan kim bugun ham keldi?** (faqat odam qatorlari) · tasma: Kecha kelganlar: Kamola · Otabek · Dilshod · Madina (to'g'risi: Kamola, Otabek)
     - To'g'ri: Kecha kelgan 4 odamdan 2 tasi bugun ham keldi — qaytganlar foizi 50.
     - Xato: {Ism} allaqachon sanalgan — bir odam bir marta. · {Ism} kecha kelmagan — u bugun birinchi marta keldi. · (sabab topilmasa) Kechagi ro'yxatdan yana bir ism bugun ham bor.
  - Tugmalar: Keyingi savol → / Natijani ko'rish →
  - Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xulosa: **Bugun kelganlar: 4 · Qaytganlar foizi: 50 · Bosh raqam: 2** — Bir kunning o'zidan uch xil raqam chiqdi — har biri boshqa savolga javob beradi.
- Tugma: Yana N savolni tekshiring → Davom etish
- Mentorga eslatma (faqat mentor): Eng ko'p adashiladigan joy — Kamolaning ikkinchi qatori va Otabek: u keldi va qaytdi, lekin keragini olmadi. Uchala raqam har xil chiqishi — darsning o'zi. Juftlikda: sherigingiz oldingi ekranda yozgan bosh raqamni o'qing va so'rang: «Bot buni qaysi xabardan biladi?» Javob topilmasa — karta birga qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:** yozuv chapda, savol o'ngda — savollar bittadan (hozirgidek, A6 bilan mos). Xato bo'lsa — **bitta** izoh: sabab bo'lsa sabab, bo'lmasa maslahat (**KOD:** hozir sabab va maslahat birga chiqadi, 3-savolda esa bir xil gap ikki marta ko'rinadi).
Animatsiya: HA — «Tekshirish» to'g'ri chiqqach, belgilangan qatorlardan natijadagi ismlarga chiziq chiziladi; bir odamning ikki qatori bitta ismga qo'shiladi (Kamola: 2 qator → 1). «Bir odam bir marta» ko'z bilan ko'rinadi (**KOD**).
Olib tashlanadi: xato izohi ostidagi ikkinchi maslahat qatori · 3-savoldagi takror («Bu ism kechagi ro'yxatda bormi?» — sabab ham, maslahat ham shu edi) · 🗒 👤 🤖 ✅ 🤷 👋 🎯 💡 🏅 🙋 ↩️ ⭐ · «▸».

✎ Mentor gapiga 1-darsdagi «hodisa» ulandi · sabab topilmagandagi maslahat endi haqiqiy xatoga mos: bu holatda o'quvchi kimnidir belgilamagan bo'ladi, eski «Bu odamning ismi yuqoriroqda ham bormi?» esa takror sanash haqida edi (noto'g'ri yo'l ko'rsatardi) · 3-savolga alohida sabab «{Ism} kecha kelmagan…» · «qaytganlar foizi 50 foiz» → «qaytganlar foizi 50» · mentor eslatmasidagi «⭐ bosh raqam» → «oldingi ekranda yozgan bosh raqam»
✎ 30.09 ChatGPT #7 **Qabul**: «keragini oldi» qanday belgilangani Mentorda (10-ekran Yordami bilan bir gap) · #16 «har qator — xabar yoki javob» (tugma yo'q) — 29.09 da «hodisa (xabar, /start yoki tugma)» · #17 «bir odam bir marta» — saqlandi

## 12 · Koding · /stat  `[1566]`
- Eyebrow: Koding · VS Code
- Sarlavha: **Botingiz raqamlarni o'zi aytadigan /stat buyrug'ini yozamiz.**
- 1-bosqich — Mentor: Avval bitta savol — keyin kod yoziladi.
  - Savol: `bot.command('stat', …)` qachon ishlaydi?
    - Bot ishga tushgan zahoti · ✔ Odam botga /stat deb yozganda · Odam har qanday xabar yozganda
  - Xato bo'lsa: `bot.command` faqat o'z nomi bilan kelgan buyruqqa javob beradi: `'stat'` — demak /stat. 3-darsda buyruqni ham shunday yozgansiz.
- 2-bosqich — Mentor: 11-ekranda yozuvdan qo'lda sanaganingizni endi kod sanaydi — o'sha seshanba yozuvidan. Kodda ikki joyni siz to'ldirasiz: 1 va 2. Kodni bot.js faylingizga, bot.launch() qatoridan oldin yozing.
  - Yig'ilgan savol: ✓ bot.command('stat', …) — odam botga /stat deb yozganda
  - VS Code oynasi: bot.js · qo'lda yoziladi («Kod nusxalanmaydi — o'zingiz terib yozasiz»)
  ```js
  // bot.js — bot.launch() qatoridan oldin qo'shing.
  // Seshanba yozuvi (11-ekran): har qator — botning bitta javobi.
  // telegram_id — odamning Telegram raqami (4-darsdagi users jadvalidagidek).
  // kerakli: true — bot kerakli javobni yubordi.
  // Hozircha ro'yxatni qo'lda yozdik. Haqiqiy botda bunday
  // qatorlar bazada turadi (PostgreSQL — 4-darsda o'tgansiz).
  const javoblar = [
    { telegram_id: 101, kerakli: true },  // Kamola
    { telegram_id: 102, kerakli: false }, // Otabek — «Tushunmadim»
    { telegram_id: 101, kerakli: true },  // Kamola
    { telegram_id: 103, kerakli: true },  // Bekzod
    { telegram_id: 104, kerakli: false }, // Sevara — salom
  ];

  function stat(javoblar) {
    // Bugun kelganlar — tayyor: bir odam bir marta
    // includes — ro'yxatda bormi? push — ro'yxatga qo'shadi
    const kelganlar = [];
    for (const j of javoblar) {
      if (!kelganlar.includes(j.telegram_id)) {
        kelganlar.push(j.telegram_id);
      }
    }

    // 1) Keragini olganlarni yig'ing: yuqoridagi sikl,
    //    shartga j.kerakli qo'shiladi
    const keraginiOlganlar = [];

    // 2) Natijaga bosh raqamni qo'shing: keraginiOlganlar soni
    return { bugun: kelganlar.length, kerakli: 0 };
  }

  bot.command('stat', (ctx) => {
    const s = stat(javoblar);
    ctx.reply('Bugun kelganlar: ' + s.bugun + '\nKeragini olganlar: ' + s.kerakli);
  });
  ```
  - Kutilgan javob (Telegram pufagi, «Bajardim» bosilguncha xira): /stat → Bugun kelganlar: 4 · Keragini olganlar: 2
  - Yordam (yig'iq):
    - Kelganlarni yig'adigan uch qatorga qarang: keragini olganlar uchun shartga **bitta narsa** qo'shiladi — `j.kerakli &&`.
    - Bot ishga tushmasa — bot.launch() qatoridan oldin **console.log(stat(javoblar));** yozing va terminalda **node bot.js** bilan natijani ko'ring. Terminalda `{ bugun: 4, kerakli: 2 }` chiqsa — vazifa bajarilgan.
    - Qo'shimcha: javobga uchinchi qator qo'shing — bugun kelganlarning necha foizi keragini oldi (2 ÷ 4 × 100 = 50).
  - Tugma: Bajardim — bot /stat ga javob berdi → ✓ Bajarildi
  - Yakka rejimda: ✓ Bu mashqni sinfda bajarganman — davom etish →
- Tugma (pastda): Avval kod-savolini yeching → ② Kodni yozing va «Bajardim» tugmasini bosing → Davom etish
- Mentorga eslatma (faqat mentor): Eng foydali xato — bir odamni ikki marta sanash (Kamola — 101 — bugun ikki marta kerakli javob oldi). Bot ishga tushmasa — zaxira yo'l: console.log bilan terminalda tekshirish. To'rt raqam ekranidagi «bot kerakli javobni yuborganda» varianti — kodda `kerakli: true`. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:**
1. Kirganda: Mentor va kod-savoli (3 variant birdan — test).
2. To'g'ri tanlangach: savol «✓ …» qatoriga yig'iladi, kod oynasi va kutilgan javob chiqadi (hozirgidek).
3. «Bajardim» bosilgach: kutilgan javob pufagi yonadi.

Animatsiya: yo'q (11-ekranda chiziq bor; bu yerda pufakning yonishi — holat o'zgarishi).
Olib tashlanadi: «Bot nima javob bersin: 1) Bot /stat ga javob berdi · 2) Bugun 3, qaytgan 2 · 3) Foiz 40% chiqdi» ro'yxati (kutilgan javob pufagi aynan shuni ko'rsatadi) · kod va pufakdagi 👥 ↩️ 📈 · ⌨️ 🔒 🔎 🤔 🛟 ⭐ ✅.

✎ 🔴 FAKT: «Hozircha ro'yxatni qo'lda yozdik — keyin u bazadan keladi» → PostgreSQL 4-darsda o'tilgan (`users` jadvali, INSERT/SELECT) — «keyin» emas, «haqiqiy botda bazada turadi» + 4-darsga havola · 🔴 FAKT (mayda): «Terminalda 3 · 2 · 40 chiqsa» → console.log obyektni `{ bugun: 3, qaytgan: 2, foiz: 40 }` ko'rinishida chiqaradi · console.log «faylning oxiriga» → «bot.launch() qatoridan oldin» (3-darsdagi qoida: bot.launch() — faylning oxirida) · «OLDIN» katta harfi → «oldin» · Mentor «endi botingiz o'zi sanaydi» → «endi kod sanaydi — hozircha qo'lda yozilgan ro'yxatdan» · 3-darsga ko'prik · «chipi» → «varianti» · kod mantig'i tekshirildi: kecha 5 kishi, bugun 3 (101, 104, 106), qaytgan 2 → 40
✎ 30.09 ChatGPT #19 Qisman: kod «ishlamaydi» — bu topshiriq (uch bo'sh joy), xato emas; lekin Mentor buni aytmasdi → «Kodda uch joyni siz to'ldirasiz: 1, 2 va 3» · #41 **Qabul**: izohlar aniq qadam bilan (1 — qaysi shart, 2 — nima qo'shiladi) · #42 **Qabul**: `telegram_id` izohi (4-darsdagi users jadvaliga havola) · #20, #21 — 29.09 da (`{ bugun: 3, … }`, «bazada turadi») · kod-savol ✔ 2-o'ringa (ballsiz, 4-savol A) · 23-savol A bo'lsa, /stat bugun kelganlar va bosh raqamni sanaydi — kod o'zgaradi (qarang: QARORLAR)
✎ 01.10 **23-savol A** (F-1001-83): /stat endi **bugun kelganlar va bosh raqamni** sanaydi; qaytganlarni kodda sanash — 12-darsda (`hisob`). Ma'lumot — 11-ekrandagi seshanba yozuvining bot qatorlari (Kamola 101, Otabek 102, Bekzod 103, Sevara 104): o'quvchi qo'lda topgan 4 va 2 ni endi kod topadi. Bo'sh joy 3 → 2: keragini olganlar sikli (tayyor sikl + `j.kerakli`) va natijadagi `kerakli`. Kod tekshirildi (node): `{ bugun: 4, kerakli: 2 }`. Pufak yorliqlari 4-ekrandagi /stat bilan bir xil («Bugun kelganlar», «Keragini olganlar»). Qo'shimcha — foiz (7-ekran ko'nikmasi). Qaytganlar foizi darsda qoladi: nomi, foiz o'yini, 6 va 8-savol, 11-ekran 3-savoli

## 13 · 4-savol ✅ (yakuniy)  `[1681]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **/stat javobi: jami 300, bugun 6, qaytganlar foizi 5. Bu javobdan nimani bilasiz?**
  - Bot tez o'syapti: jami 300 ga yetdi
  - ✔ Kechagi har yuzta odamdan 5 tasi bugun ham keldi
  - Botga har kuni 6 ta yangi odam keladi
- To'g'ri: Foiz shuni aytadi: kechagi yuzta odamdan 5 tasi bugun ham keldi.
- Xato izohlari:
  - (A) 300 — jami yig'ilgan odam: u faqat o'sadi, bot tez o'syaptimi — buni aytmaydi.
  - (C) 6 — bugun kelgan hamma odam; ularning nechtasi yangi ekanini bu son aytmaydi.
  - (umumiy) Har raqam o'z savoliga javob beradi: foiz — kechagilar bugun ham keldimi.

**Ko'rinish:** test — variantlar birdan va teng.
Animatsiya: yo'q.
Olib tashlanadi: 🤖.

✎ Variantlar tenglashtirildi (to'g'ri javob eng uzuni edi) · umumiy izoh xulosa emas, yo'l ko'rsatadi · ✔ o'rni B (s13:1)
✎ 30.09 ChatGPT #22, #23 **Qabul**: «Bot qanday ishlayapti?» — bitta foizdan butun bot haqida xulosa (bir martalik xizmat botida 5 foiz yomon bo'lmasligi ham mumkin); o'zim: «Bot qanday ishlayotganini … qaytganlar foizi aytadi» izohi 5-ekranga zid edi (bot o'z ishini bajardimi — bosh raqam) → savol «Bu javobdan nimani bilasiz?», ✔ — foizning ma'nosi; xato variantlar — ikki haqiqiy adashish (jamini o'sish deb o'qish · bugungini yangilar deb o'qish); «Jamiga qarang / Foizga qarang» boshlanishi olindi (to'g'ri javob eng mazmunlisi edi); ✔ o'rni B o'sha · A12-qo'shimcha

## 14 · Mustahkamlash (refleksiya)  `[1744]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Botingizning bosh raqamini yoddan ayta olasizmi?**
- Mentor: Ekranga qaramay ayting: botingizning bosh raqami nima, u nima bo'lganda sanaladi va nega aynan shu?
- 1-qadam: Avval ovoz chiqarib o'zingizga ayting (yakka) / Sherigingizga ayting (jonli)
  - Yakka: ▶ 30 soniyani boshlash · To'xtatish · ✓ Vaqt tugadi — aytib bo'ldingiz. · ↻ Yana 30 soniya
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi / keyin — B navbati / oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. · ↻ Yana 1 daqiqa
- 2-qadam: Endi bir qator yozing — maydon: «Bosh raqamim — ..., u ... bo'lganda sanaladi, chunki ...»
- Yozgach: ✓ Endi botingiz haqida «yaxshi ishlayapti» emas, raqam aytasiz.
- Tugma: Davom etish
- Mentorga eslatma (faqat mentor): Uchdan biri «nima bo'lganda sanaladi»ni aytolmasa — bot yozuvi ekranini qayta oching va kerakli javob olgan qatorlarni birga sanang.

**Ko'rinish (KOD — hozir ikki qadam birdan):** 1-qadam ochiq; vaqt tugagach u «✓ Aytib bo'ldingiz» qatoriga yig'iladi va 2-qadam chiqadi. «Davom etish» hozirgidek majburiy emas.
Animatsiya: yo'q (taymer halqasi vaqtni ko'rsatadi — qoladi).
Olib tashlanadi: «Bugungi qoida: faqat jamiga qarab bot haqida xulosa qilinmaydi» (yakuniy test izohi va Yakunning 2-bandi bilan bir ma'no) · «Barakalla!» · 🗣 ✍️ 🎯 ⏹.

✎ Mentor eslatmasidagi «✅ qatorlar» → «kerakli javob olgan qatorlar» (belgi olindi)
✎ 30.09 ChatGPT #27, #43 **Qabul**: «nega aynan shu?» — raqam yodlanmaydi, tanlov sababi aytiladi; bitta qator qoladi (uch qatorli shakl — ortiqcha)

## 15 · Natijalar (podium)  `[2418]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. Savol yorliqlari: 1 — Sanab bo'ladigan raqam · 2 — Qaysi raqam · 3 — Foiz · 4 — Yakuniy savol. «sessiya» so'zi — 1-dars B-5.)

## 16 · Takrorlash (kartochkalar)  `[1836]`
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) |
|---|---|
| Metrika nima? | Bot haqida sanab tekshirib bo'ladigan raqam |
| Qaysi raqam faqat o'sadi va nega u yolg'iz yetmaydi? | Jami /start bosganlar (har odam bir marta) — bot yomonlashsa ham kamaymaydi |
| «Bugun kelganlar» nimani sanaydi? | Bugun botga yozgan yoki tugma bosgan odamlarni — bir odam bir marta |
| Odam qachon «qaytgan» deb sanaladi? | Kecha kelgan odam bugun ham kelsa |
| Qaytganlar foizini qanday topasiz? | Qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytirasiz (inglizchasi: retention) |
| Nega odam soni emas, foiz solishtiriladi? | Guruhlar har xil kattalikda — foiz ularni yuzta odamga keltiradi |
| Bosh raqam nimani sanaydi? | Bot o'z ishini bajarganini — bu botda keragini olganlarni (inglizchasi: North Star) |
| Bot «Tushunmadim» desa, bosh raqamga qo'shiladimi? | Yo'q — odam javob oldi, lekin keragini emas |
| Booking yangi o'zgarishni qanday sinaydi? | Avval odamlarning bir qismiga ko'rsatadi va ikki guruhning raqamini solishtiradi |
| /stat buyrug'i nimani aytadi? | Bugun kelganlar sonini va bosh raqamni — keragini olganlar sonini |

- Tugmalar: o'zgarmaydi (↻ O'rganilmoqda · ✓ Bildim · ✗ Takrorlash · Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish)

✎ 4-karta: «… — u qaytgan deb sanaladi» olindi (savolni takrorlardi) · 5-karta: «qanday hisoblanadi» → «qanday topasiz» · 9-karta: «o'tkazgan» → «o'tkazishini aytgan» (manbadagi shakl) · 10-karta: «ularning foizi» (kimning?) → «qaytganlar foizi» · «Hammasini bilasiz!» oldidagi 🎉 olindi
✎ 30.09: 2-karta — «yolg'iz», «har odam bir marta» (ChatGPT #3, #5, #28) · 7-karta — bosh raqam tushunchasi va shu botdagi tanlov (#6) · 9-karta — «1000 dan ortiq» olindi, ikki guruh (#12)
✎ 01.10 23-savol A: 10-karta — /stat bugun kelganlar va bosh raqamni aytadi (12-ekran kodi)

## 17 · Yakun  `[2514]`
- Eyebrow: Dars yakuni · belgi: ✓ Dars tugadi
- Sarlavha: **Botingizning bosh raqami tanlandi.** (yonida ball-halqa)
- Arena tugmasi: CodeStrike · 12 SAVOL · 15 SONIYA · PODIUM (jonlida kutganda: Mentorni kuting)
- Endi siz bilasiz:
  - Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.
  - Jami soni faqat o'sadi — bot qanday ishlayotganini u yolg'iz aytmaydi.
  - Qaytganlar foizi — kecha kelgan har yuzta odamdan nechtasi bugun ham keldi; odam soni har xil kunlar foizda solishtiriladi.
  - Bosh raqam — bot o'z ishini bajarganini sanaydi: bu botda keragini olganlar.
  - O'zgarishdan oldin bosh raqamni o'lchab qo'ying — keyin yangi raqam bilan solishtirasiz.
- Nishonlaringiz — N/4 (nishon nomi + tavsif)
- Uyga vazifa · Amaliy topshiriqni bajarish → (PM uy vazifasi — MD'ga kirmaydi)
- Keyingi dars — **«Kecha kelgan odam bugun ham keldimi?»** Botingizning bir necha kunini yonma-yon qo'yasiz: kanalga e'lon bersangiz, kelganlar ko'payadi — qaytganlar-chi?
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Mentorga eslatma (faqat mentor): Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy vazifasi: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Boti kam odam yig'gan bolalar sinfdoshining botida sanaydi — qoida o'sha. Tekshirishda: har kun uchun raqamlar yozilganmi, qaytganlar foizi foizda hisoblanganmi, bosh raqam qaysi bot-javobidan sanalgani yozilganmi.

**Ko'rinish:** hozirgidek; «Keyingi dars» qatori — «Endi siz bilasiz» va nishonlardan keyin, uy vazifasi tugmasidan oldin (**KOD** — yangi blok).
Olib tashlanadi: 🏆 ⏳ 📝 🏅 (matn oldidagi).

✎ 🔴 FAKT: «Keyingi dars» qatori yo'q edi → App.jsx bo'yicha keyingisi 12-dars PM «Kecha kelgan odam bugun ham keldimi?» (uning 4-ekrani: kanalga e'lon → kelganlar sakraydi, qaytganlar deyarli o'zgarmaydi — javob ochilmaydi, faqat savol) · 4-band qo'shildi: foizda solishtirish (7, 8-ekranning asosiy xulosasi, ro'yxatda yo'q edi)
✎ 30.09 ChatGPT #44 **Qabul**: «o'zgarishdan oldin o'lchang» (9-ekran g'oyasi) yakunda yo'q edi → 5-band; 3 va 4-band birlashdi (5 band qoladi) · 2-band «yolg'iz», 4-band bosh raqam tushunchasi (#5, #6) · #48.8 keyingi dars — 29.09 da qo'shilgan

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), «!» siz; medal belgisi — o'yin qatlami:
- **Two Mondays** (hozir Two Mondays!) — Ikki dushanbani to'rt raqamda solishtirdingiz
- **North Star** (hozir Star Picker!) — Botingiz uchun bosh raqam va uch yordamchi raqam yozdingiz
- **Fair Counter** (hozir Fair Counter!) — Birinchi urinishda yozuvdan har odamni bir martadan sanadingiz
- **Stat Builder** (hozir Stat Command!) — Botingizga /stat buyrug'ini yozdingiz
- Nishon beriladigan ekranlar: 4 · 10 · 11 · 12. Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting · Nishonlar — N/4

✎ «North Star» — bosh raqamning inglizcha nomi, 5-ekranda o'tiladi · Fair Counter tavsifiga «birinchi urinishda» (11-ekranda nishon faqat birinchi urinishga beriladi — tavsif rost aytsin)

**Qayta tushuntirish oynalari (4)** — faqat mentor test ekranida ochadi; karta belgisi (`ic`) o'rniga raqam 1 · 2 · 3; yozuvlar: «Qayta tushuntirish» · «Sinfga savol:» · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
1. (3) **Sanab tekshiriladigan raqam:** Metrika nima — Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi. · Son bor — lekin fikr — «Juda qulay», «10 dan 9 ball» — bu fikr: har kim o'zicha baholaydi, uni sanab tekshirib bo'lmaydi. · Yozuvdan tekshiring — «Bugun 12 odam yozdi» degan gapni botga kelgan xabarlardan birma-bir sanab tekshirasiz. · Sinfga savol: «Botim foydali» va «bugun 5 odam tugma bosdi» — qaysi birini sanab tekshirsa bo'ladi?
2. (6) **Uch raqam — uch savol:** Bugun kelganlar — Bu raqam bitta savolga javob beradi: botga bugun odam keldimi? · Qaytganlar foizi va bosh raqam — Qaytganlar foizi — odamlar botga qaytyaptimi? Bosh raqam — bot o'z ishini bajardimi? · Jami-chi? — Jami «qancha odam yig'ildi?» degan savolga javob beradi, bu uch savolga esa — yo'q. · Sinfga savol: Kecha 20 odam keldi, bugun ulardan 6 tasi yana keldi. Bu qaysi raqam haqida?
3. (8) **Foizda solishtiring:** Foizni qanday topamiz — Qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytiring. · Guruhlar har xil bo'lsa — Odam soni har xil bo'lsa — qaytganlar sonini emas, foizni solishtiring. · Yuzta odamga keltiring — Foiz aytadi: yuzta odam kelganda ulardan nechtasi qaytgan bo'lardi. · Sinfga savol: Bir kuni 50 odamdan 10 tasi qaytdi, boshqa kuni 5 odamdan 2 tasi. Qaysi kunda foiz katta?
4. (13) **Faqat jamiga qaramang:** Jami soni — Jami soni faqat o'sadi — bot yomonlashsa ham kamaymaydi. · Odamlar qaytyaptimi — Odamlar botda qolyaptimi — buni qaytganlar foizi aytadi. · Bosh raqam — Bot o'z ishini bajardimi — buni bosh raqam aytadi. · Sinfga savol: /stat javobi: jami 500, qaytganlar foizi 3. 3 foiz nimani aytadi?

✎ 1-oyna 2-kartasi: «Fikr raqam emas» → «Son bor — lekin fikr» (3-ekranning yangi variantlariga mos: sonli fikr ham fikr) · «Bot yozuvidan» → «botga kelgan xabarlardan» · 🔢 💬 🔎 🙋 ↩️ 👥 🧮 ⚖️ 💯 ⭐ 📖 🗣️ olindi
✎ 30.09: 2-oyna — jami o'z savoliga javob beradi (A12-qo'shimcha) · 4-oyna — bosh raqam tushunchasi, savol 13-ekranning yangi matni bilan · ChatGPT #29 (12-dars auditida) mustaqil rejimda ham ochilsin — **KOD** 14b

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Metrika nima? ✔ Sanab tekshirib bo'ladigan raqam · Bot haqidagi yaxshi fikr · Botga o'zingiz qo'ygan ball · Botdagi har qanday son
2. Qaysi raqam faqat o'sadi? Bugun /start bosganlar · Qaytganlar foizi · Bosh raqam · ✔ Jami /start bosganlar
3. Kamola bugun botga 3 marta yozdi. «Bugun kelganlar» soniga nechta qo'shiladi? 3 ta · 2 ta · ✔ 1 ta · 0 ta
4. Kecha 10 odam keldi, bugun ulardan 5 tasi qaytdi. Qaytganlar necha foiz? 5 foiz · ✔ 50 foiz · 10 foiz · 15 foiz
5. Bir kunda botga 7 xil odam yozdi. Bu son qaysi raqam? Jami /start bosganlar · ✔ Bugun kelganlar · Qaytganlar foizi · Bosh raqam
6. Bu darsdagi botda bosh raqam nimani sanaydi? ✔ Keragini olgan odamlarni · Botga kelgan hamma odamni · Javob olgan hamma odamni · Bot yozgan xabarlar sonini
7. Guruhlar har xil kattalikda bo'lsa, nimani solishtirasiz? Qaytgan odamlar sonini · Kelgan odamlar sonini · ✔ Qaytganlar foizini · Jami /start sonini
8. Bot «Tushunmadim» deb javob berdi. Bu bosh raqamga qo'shiladimi? Ha — bot javob yubordi · Ha — odam botga yozdi · Yo'q — odam /start bosmagan · ✔ Yo'q — odam keragini olmadi
9. Booking yangi o'zgarishni avval kimga ko'rsatadi? ✔ Odamlarning bir qismiga · Faqat o'z xodimlariga · Hamma odamga birdan · Faqat eski mijozlarga
10. Booking yangi o'zgarishni nega avval bir guruhga ko'rsatadi? Rang hali tayyor bo'lmagani uchun · Hamma bir vaqtda kirmagani uchun · ✔ Ikki guruh raqamini solishtirish uchun · Server og'irlashmasligi uchun
11. Qaytganlar foizi qaysi savolga javob beradi? Bugun nechta odam keldi? · ✔ Kechagilar bugun ham keldimi? · Bot odamga keragini berdimi? · Jami nechta odam yig'ildi?
12. /stat buyrug'ining kodini qayerga yozdingiz? users jadvaliga · Telegram kanaliga · @BotFather'ga · ✔ bot.js faylingizga

✎ 1-savol: «Botning chiroyli nomi» — ishonarsiz distraktor → «Botga o'zingiz qo'ygan ball» (son, lekin fikr — 3-ekran bilan bir g'oya); «qanday raqam?» → «nima?» («raqam» so'zi faqat to'g'ri javobda qolmasin) ·
5-savol: savoldagi «bugun … keldimi» to'g'ri javob nomini aks-sado qilardi («Bugun kelganlar») → vaziyat bilan so'raladi · 10-savol: «o'tkazgan» → «o'tkazishini aytgan» (manba) · 12-savol: «BotFather» → «@BotFather» (A1)
✎ 01.10 quruvchi (`lint:tell`): 2-savol 1-variant «Bugun kelganlar» → «Bugun /start bosganlar» — «/start» faqat to'g'ri variantda edi; ✔ o'rni o'zgarmadi
✎ 30.09 ChatGPT #31 Qisman: 1-savol «Mentor qo'ygan baho» → «Botdagi har qanday son» (darsning asosiy adashishi: son bor — metrika emas) · 6-savol — «bu darsdagi botda» (#6), «Botdagi tugmalar soni» → «Javob olgan hamma odam» (Otabek — javob oldi, keragini emas) · #32 10-savol «1000 dan ortiq» → «nega avval bir guruhga?» · #30 12-savol — «kodini» (Telegram'da /stat yoziladi, kodi — bot.js da) · ✔ o'rinlari o'zgarmadi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — variant belgilari olinadi (ovozlar diagrammasida ham); javob matni.
2. s1 — pufak qator belgilari: emoji → CSS nuqta (birinchisi to'q va kattaroq); Mentor matni.
3. s2 — karta belgilari olinadi; fikr/raqam kartasi rang bilan ajraladi.
4. s4 — Mentor holatga qarab (boshida / javobdan keyin); bashorat tanlangach «✓ Javobingiz: …» qatoriga yig'iladi; «Tanlovingiz yozildi…» va 40 soniyalik maslahat olinadi; yakunda yo'nalish strelkalari (Jami yuqoriga, qolgan uchtasi pastga).
5. s5 — xulosa ramkasi olinadi; `NOMLAR` ta'riflari (bosh raqam, retention izohi, North Star izohi).
6. s7 — tanlov yorlig'i olinadi; tugma «A holat/B holat»; tanlov ✓ qatorga yig'iladi; «Foizni hisoblash» navbat bilan (A → B); Mentor «tugagach» tanlovga qarab («Aynan!»/«Qiziq fikr!»).
7. s9 — 5-bosqich matni qisqaradi; ko'prik matni; mentor eslatmasi; emoji.
8. s10 — `QACHON` kod yozuvi: tugma → `bot.action / bot.hears`; Mentor va tasma matni; «Qo'shimcha» matni; yakundagi `done-mini` qatori olinadi.
9. s11 — xato bo'lsa bitta izoh (sabab yoki maslahat); `YZ_Q` maslahatlari savolga moslanadi; 3-savolga «kecha kelmagan» sababi; odam/bot qatori rang bilan (👤 🤖 o'rniga); to'g'ri javobda qator → ism chizig'i.
10. s12 — `KOD_MATN` izohi (baza, 4-dars; «oldin» kichik harf) va `ctx.reply` emojisiz; `KD_SHART` ro'yxati olinadi; pufak qatorlari emojisiz; Yordam va 2-bosqich Mentor matni.
11. s13 — variant va izoh matnlari.
12. s14 — 2-qadam 1-qadamdan keyin chiqadi (1-qadam ✓ qatorga yig'iladi); «Bugungi qoida» qatori va «Barakalla!» olinadi.
13. s17 — «Keyingi dars» bloki; `RECAP` ga 5-band.
14. Butun dars — emoji A4 (`npm run lint:emoji`): sarlavha, eyebrow, Mentor, karta, tugma, chat, kod, test (umumiy yozuvlar ⚡ 📨 ham), kartochka, RECAPS (`ic` → raqam, oyna yozuvlari 📖 🗣️), MentorNote belgisi; nishon `name` (inglizcha, «!» siz); `QUIZ_BANK` (1, 5, 10, 12-savol) va `FLASHCARDS` (4, 5, 9, 10) matnlari.
14a. 30.09 (ChatGPT auditi F-0930-113): s0 — har tanlovga o'z javobi + bitta umumiy qator · s1 — Mentor («bugun kelganlar va qaytganlar foizini») · s2 — xulosaning 2-gapi · s4 — so'rash tugmalari navbat bilan; xulosa · s5 — `NOMLAR` (jami savoli va ta'rifi, bosh raqam) · s9 — `BK_STEPS` 6 → 5 (2017 bashorati o'rniga «Nega hammaga birdan emas?», ✔ indeksi 2; «Aynan!/Qiziq fikr!») · s10 — tasma va Mentor («eshitgan javoblaringiz»), `QACHON` 4-yorlig'i «bot kerakli javobni yuborganda», karta ostida «Bir odam bir kunda bir marta sanaladi», maydonlar navbat bilan, Yordam · s11 — Mentor · s12 — kod-savol ✔ 2-o'ringa (nishon/ishtirok sharti matn bo'yicha), Mentor, `KOD_MATN` izohlari · s13 — savol, variantlar, izohlar (`questionText` ham; ✔ indeksi 1) · s14 — Mentor va maydon namunasi · s17 — `RECAP` · `FLASHCARDS` 2, 7, 9 · `QUIZ_BANK` 1, 6, 10, 12 (✔ indekslari 0, 0, 2, 3 o'zgarmaydi) · `RECAPS` 2, 4.
14c. **01.10 (23-savol A, F-1001-83):** s1 — Mentor «bugun kelganlar va bosh raqamni» · s12 — `KOD_MATN` butunlay yangi (12-ekrandagidek: `javoblar` ro'yxati, `stat(javoblar)`, ikki bo'sh joy), 2-bosqich Mentor, kutilgan javob pufagi (2 qator: Bugun kelganlar: 4 · Keragini olganlar: 2), Yordam (3 qator), mentor eslatmasi · `FLASHCARDS` 10 · kodda /stat natijasini tekshiradigan joy bo'lsa (`bugun: 3`, `qaytgan`, `40`) — yangi qiymatlarga.
14b. RECAPS mustaqil rejimda ham: test ekranida birinchi xatodan keyin «Qisqa takrorlash — mavzuni yana bir ko'rish» havolasi (12-dars KOD 13a bilan bir; hozir faqat mentor ochadi).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **11 va 12-dars takrori (DAVOM 6).** 11-dars qaytganlarni allaqachon to'liq o'tadi: 5, 6, 7, 8-ekran, 11-ekran 3-savol (kechagi ro'yxat bilan bittalab solishtirish), 12-ekran (/stat — qaytgan soni), kartochka 4–5, arena 4 va 11. 12-dars 2-ekranidagi «O'tgan darsda buni foizda hisoblagansiz» — to'g'ri; lekin «bugun esa … bittalab sanaysiz» yangilik emas (11-ekranda bor). Taklif: 12-dars v2 da farqni «bugun bir necha kunni yonma-yon qo'yasiz, e'lon ta'sirini ko'rasiz» deb aytish. Tuzilma o'zgarmadi — qaror foydalanuvchida. → 30.09: ikkala dars ChatGPT auditi ham buni asosiy muammo dedi (11 #10, #18, #45; 12 #1). 12-dars tomoni qilindi (F-0930-109). 11-dars tomoni — 23-savol: /stat nimani sanaydi. → 01.10 javob A: /stat bugun kelganlar va bosh raqamni sanaydi, qaytganlar kodi faqat 12-darsda (F-1001-83).
2. **Uy vazifasi (tegilmadi, faqat xabar):** `HW_STEPS` «Botning yozuvini oching» — o'quvchi botida yozuv (log) yo'q (10-ekrandagi bilan bir muammo); to'liq variantdagi qo'shimcha band (har xabarda bazaga INSERT) 4-darsga mos.
3. **App.jsx:** kalit `m5-14` n:11 (tartib m5-10 → m5-14 → m5-11) va izoh «(M8-D1)» — ichki, o'quvchiga ko'rinmaydi; LMS yuklashda kalit/tartib mosligini tekshirish kerak.
4. **PmLesson20 izohi** «pm-m5d8-javoblar -> m5-11 (qaytish-kalendari) o'qiydi» — 11-dars ham o'qiydi (10-ekran tasmasi); ichki izoh.
5. **PM qolipidagi umumiy emojilar** (QuestionScreen ⚡ 📨, RecapOverlay 📖 🗣️, MentorNote 📋 🧑‍🏫, Flashcards 🎉, AchCounter) — 2, 8, 12-darslardagi nusxalar bilan bir xil tozalansin.
6. **Oyna nomi:** PM darslarida «Qayta tushuntirish», 1-dars v2 da «Qisqa takrorlash» — modul bo'yicha bitta nom.
7. **Qonun nomzodi (N7):** test shakl-teli — «son/raqam faqat to'g'ri variantda bo'lmasin» (3-ekran misoli) → `QONUN_NOMZODLARI.md`.
8. **RU matni** — o'zbekcha tasdiqlangach.

---

## Agent eslatmalari
1. **DAVOM 7 · 9-ekran «u keyinroq alohida dars» — tekshirdim:** gap qaytganlar haqida emas, sinov usuli (guruhlarga bo'lish, «A/B test» nomi) haqida. Senariyda (`pm-senariylar/M5-D11-Metrika.md`, 6-bo'lim) bu eski rejadagi alohida analitika darsi uchun qoldirilgan. Hozirgi App.jsx'da bunday dars yo'q (12 — qaytganlar, 13 — zaxira, 14 — Demo Day; 6-Modul PM darslarida ham yo'q). Shuning uchun «keyingi darsda» deb yozish ham noto'g'ri bo'lardi — gap olib tashlandi. **Savol:** o'quvchi so'rasa, mentor «A/B test» nomini aytsinmi? (29-qonun sababi endi yo'q.) → 30.09: hal — «A/B test» nomi aytilmaydi (QARORLAR «o'zim hal qilganlar» 9).
2. **DAVOM 7 · 12-ekran «keyin bazadan keladi» — tasdiqlandi:** 4-darsda PostgreSQL `users` jadvali (`telegram_id`, INSERT/SELECT/UPDATE) o'tilgan → kod izohi 4-darsga havola bilan.
3. **DAVOM 6 · 11↔12 takrori** — B-1 da ro'yxat; tuzilma o'zgarmadi. 12-dars 2-ekranidagi havola to'g'ri. → 30.09: 23-savol. → 01.10: A (F-1001-83).
4. **«Qutb yulduzi»** (hozir «Shimol yulduzi» — kalka): o'zbekcha nomi shu, lekin bu taklif. Foydalanuvchi qarori. → 30.09: qabul (QARORLAR «o'zim hal qilganlar» 9, e'tiroz yo'q).
5. **3-ekran variantlari** endi uchalasida son bor («10 dan 9 ball», «5 ta botning»). Bu test halolligi uchun (oldin son faqat to'g'ri javobda edi). ChatGPT buni «qiyinlashdi» deyishi mumkin: mezon 2-ekranda o'tilgan («tekshirib bo'ladimi»), RECAPS 1 ham moslandi.
6. **Emoji olinganda qator belgilari yo'qoladi** (🙋 ↩️ ✅ ⭐ butun dars bo'yi qatorni tanitardi) — o'rniga nom + CSS rang-nuqta (A4-qo'shimcha). Buni dizayn bosqichida ko'z bilan tekshirish kerak (4, 5, 11, 12-ekran).
7. **✔ o'rinlari:** `INLINE_KEYS` `s3:1 · s6:2 · s8:0 · s13:1` = har ekrandagi `correctIdx`; MD'da ✔ shu o'rinlarda. `QUIZ_BANK.correct` `0,3,2,1,1,0,2,3,0,2,1,3` — 12 savolning hammasida ✔ o'z o'rnida (1, 5-savolda savol matni ham o'zgardi, o'rin emas). 12-ekran kod-savoli va Booking bashoratlari (ballsiz) tartibi ham o'zgarmadi.
8. **sozlar.md dagi dastlabki belgilar — hammasi ko'rib chiqildi:** 👥 ikki ma'noda (emoji olinishi bilan hal) · retention izohsiz (qo'shildi) · 3-ekran shakl-teli (hal) · «chip» (varianti) · inglizcha nishon nomlari (qoida bo'yicha qoladi, mavzuga moslandi) · 9 va 12-ekran — 1, 2-band.
