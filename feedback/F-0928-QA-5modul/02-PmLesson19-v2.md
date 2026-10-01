# 5-Modul (LMS: 7-Modul) · 2-dars «Botingizni birinchi kim ochadi?» — YANGI MATN (v2)

Fayl: `src/5-Modull/PmLesson19.jsx` · 16 ekran · PM darsi · o'zbekcha (ruschasi o'zbekcha tasdiqlangach) · uy vazifasi (Yakun ichidagi karta) MD'ga kirmaydi
Eski matn: `02-PmLesson19-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti `INLINE_KEYS`: `s3:1 · s5:0 · s7:2 · s11:1`; arena 12 savol: `0,3,2,1 · 1,0,2,3 · 0,2,1,3`; 6-ekran bashoratlari: `1 · 1`; 10-ekran kod-savoli: 2-variant) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56 · 1-dars v2 A-bo'limi (`01-BotIntro-v2.md`) · 29.09 v2-qoralama · **30.09: ChatGPT auditi + QA (F-0930-50…55) qo'llandi** (hukmlar — `JURNAL.md`).
✅ **Atamalar — 14-savol javobi A (30.09, F-0930-57):** birinchi yigirma → **birinchi foydalanuvchilar** · joy → **guruh** · zich joy → **yaqin guruh**.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi.

Shu darsga xos qo'shimchalar:

| Eski | Yangi (v2) | Birinchi chiqqanda (bir marta) |
|---|---|---|
| birinchi yigirma | **birinchi foydalanuvchilar** — dars atamasi; «yigirmata» — faqat bugungi maqsad soni (hisoblagich, kod, nishon) | 2-ekran xulosasi + nega aynan yigirma |
| joy (odamlar to'plami ma'nosida) · uch joy · to'rt joy | **guruh** — sinf, to'garak, hovli, o'yin guruhi; dars bo'yi bitta nom | 1-ekran namunasi |
| zich joy | **yaqin guruh** — «sizni taniydigan, bir-birini tez-tez ko'radigan odamlar» | 4-ekran xulosasi |
| katta joy · katta guruh (ikkalasi aralash edi) | **katta guruh** | — |
| uch qadam | eshitdi → ochdi → ishlatdi; qadamdan **odam** o'tadi (guruh emas) | 9-ekran topshirig'i |
| halqa | faqat 4-ekrandagi xarita elementi (atama emas) | 4-ekran Mentori |
| kompilyator | **kod oynasi** (MATN_ETALONI lug'ati, 222-qator) — eyebrow va tugma bir nomda | — |
| Telegramda | **Telegram'da** (1-dars v2 yozuvi bilan bir xil) | — |

- **Shior-gap yo'q:** «Katta joy odam bermaydi», «o'zimizniki», «joyma-joy kengaygan», «O'sha odam — siz» kabi qisqa shiorlar oddiy gapga aylantiriladi (ChatGPT, QA F-0930-53; nomzod N9).
- **Hook istisnosi:** 0-ekran savolida to'g'ri-xato yo'q (o'quvchi o'z tajribasini aytadi) — shuning uchun «Aynan! / Qiziq fikr!» qo'llanmaydi; har tanlovga o'ziga mos izoh, oxiri bir xil.
- **Ichki ko'prik:** 8-ekrandagi «Unda kimlar bor?» javobi 8-darsga o'tadi (8-dars uni ro'yxat sifatida ko'rsatadi) — bu maydonning ma'nosi o'zgarmaydi (B-2).

---

## Darsning ipi
- **Olam (bitta):** o'quvchining o'z boti (1-darsda @BotFather'da ochilgan, kodi 3-darsda yoziladi) va uning atrofidagi odamlar — sinf, to'garak, hovli. AvtoPizza bu darsda yo'q.
- **Hook:** «Telegram'da nechta botni ishlatasiz?» → botni ko'pincha kimdir aytgani uchun ochamiz → sizning botingizni ham kimdir aytmaguncha hech kim topmaydi.
- **Asosiy model (dars bo'yi bitta):** odam botga uch qadamda keladi (eshitdi → ochdi → ishlatdi); yaqin guruhda bu qadamlardan ko'p odam o'tadi, katta notanish guruhda — kam.
- **Oldingi bilimga ko'prik:** 1-darsda bot ochildi, lekin hali uni hech kim ishlatmaydi · JS'dagi `for` va `console.log` (10-ekran kodi).
- **Tajribalar:** uch halqaga bir haftadan berish (4) · Facebook tarixi, 2 bashorat (6) · o'z uchta guruhini yozish (8) · to'rt guruhdan yigirmata odam yig'ish (9) · uchta guruhni kodda sanash (10) · yoddan aytish (12).
- **Keyingi dars (App.jsx m5-03):** «Telegram Bot API + tugmalar» — botga birinchi kod. Shu darsdagi odamlardan fikr so'rash — 8-darsda (PM).

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — nechta bot | hook | o'z tajribasini tanlaydi, izohni o'qiydi | — |
| 1 | Maqsad | qoida | namuna-ro'yxat yozilib chiqadi, jami sanaladi | — |
| 2 | Ikki holat | tushuncha | «Bot tayyor» / «Botni odam ishlatdi» → birinchi foydalanuvchilar | — |
| 3 | 1-savol | test | hech kimga aytilmagan bot bir haftada nechta odam oladi | ✅ |
| 4 | Odamlar xaritasi | markaziy | 3 halqani ochadi, har biriga bir hafta beradi → yaqin guruh | — |
| 5 | 2-savol | test | 15 tanish va 500 notanish — kimdan ko'proq odam keladi | ✅ |
| 6 | Bitta sayt tarixi | case | 5 bosqich, 2 bashorat (Facebook) | — |
| 7 | 3-savol | test | sayt bitta universitetda nega tez tarqaldi | ✅ |
| 8 | Uchta guruh | amaliyot (yozish) | 3 guruh: nomi · kimlar bor · nechta odam | — |
| 9 | To'rt guruh | markaziy o'yin | iloji boricha kam guruhdan 20 odam yig'adi | — |
| 10 | Koding | koding | kod-savol → kod oynasida `yigirma.js` | — |
| 11 | 4-savol | test (yakuniy) | 900 notanishga yuborilgan havola | ✅ (final) |
| 12 | Yoddan ayting | refleksiya | eng yaqin guruhini aytadi, keyin bir qator yozadi | — |
| 13 | Natijalar | podium | jonli reyting / shaxsiy natija | — |
| 14 | Takrorlash | kartochkalar | 10 kartochka | — |
| 15 | Yakun | xulosa | asosiy fikr, 4 xulosa, arena, nishonlar, uyga vazifa, keyingi dars | — |

---

## 0 · Kirish — nechta bot  `[659 · 653]`
- Eyebrow: Kirish · botlar
- Sarlavha: **Telegram'da hozir *nechta* botni ishlatasiz?**
- Mentor: Bu savolda xato javob yo'q: o'zingizda qanday bo'lsa, shuni tanlang.
- Variantlar:
  - Bir nechtasi bor — kimdir aytgani uchun ochganman
  - Yo'q shekilli — o'zim hech qachon qidirmaganman
- Javob — 1-variant: Demak, botni siz ham kimdir aytgani uchun ochgansiz — ko'pchilik shunday ochadi. 1-darsda ochgan botingizni ham kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz.
- Javob — 2-variant: Demak, bot o'zi sizga kelmagan: kimdir aytmasa, odam botni qidirmaydi. 1-darsda ochgan botingizni ham kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz.
- Jonli darsda: ikkala variant bo'yicha sinf ovozlari foizda chiqadi.
- Tugma: Bittasini tanlang → Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor va ikki variant (tanlov variantlari birdan, teng). Tanlangach — shu variantga mos izoh; jonli darsda uning ostida ovozlar foizi.
Animatsiya: yo'q.
Olib tashlanadi: variantlardagi 🤖 🔎.

✎ Hook: ikkala javob ham o'quvchining o'z tajribasi — «Aynan! / Qiziq fikr!» kerak emas, har biriga mos izoh yozildi (hozir ikkalasiga bitta: «Ikkalasi ham bo'ladi…» — **KOD**: `HOOK_OPTS` ga har variant uchun izoh) · «Bir-ikkitasi bor» → «Bir nechtasi bor» · Mentor «ikkala javob ham to'g'ri» → «xato javob yo'q» · 30.09 ChatGPT #3 **Qabul**: «birinchi odamlarga kimdir aytishi kerak — o'sha odam siz bo'lasiz» biznes-murabbiy ohangida edi → «kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz» (uning «avval tanishlaringizga ko'rsating» varianti olinmadi — darsning javobini hookdayoq aytib qo'yardi)

## 1 · Maqsad  `[736 · 730]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun birinchi yigirmata foydalanuvchingiz keladigan *uchta guruhni* yozasiz.**
- Mentor: O'tgan darsda botingizni @BotFather'da ro'yxatdan o'tkazdingiz, kodini esa keyingi darsda yozasiz. Bugun boshqa savol: botingizni birinchi bo'lib kim ishlatadi?
- Namuna-ro'yxat: **Namuna: uchta guruh**
  - O'yin guruhi → birga o'ynaydiganlar · 12
  - Kursdoshlar → kursda haftada uch marta ko'rishadiganlar · 6
  - Qo'shnilar → bir hovlidagilar · 4
  - Jami: 22 odam
- Tugmalar: Orqaga · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → namuna qatorlari birma-bir yoziladi → oxirida «Jami».
Animatsiya: HA — har qator chiqqanda «Jami» soni o'sadi (12 → 18 → 22): maqsad sanoq ekanini ko'rsatadi (**KOD:** hozir «Jami» bir marta, tayyor son bilan chiqadi).
Olib tashlanadi: 🗂 🎮 👪 🏠 · «uch joyingiz» yorlig'i (bu o'quvchining guruhi emas, namuna).

✎ «Qarindoshlar → bayramda ko'rishadiganlar» → «Kursdoshlar → kursda haftada uch marta» (namuna dars qoidasiga zid edi — ChatGPT #4 ham shuni topgan; uning namunasi «Sinfdoshlar · To'garakdagilar» olinmadi: 9-ekran kartalarini oldindan aytib qo'yardi; **KOD:** `DEMO_JOY[1]`, u 10-ekran zaxirasiga ham tushadi) · «bir ko'chadagilar» → «bir hovlidagilar» · Mentor «Bu modulda botingizni qurasiz» → 1-darsga ko'prik · 30.09: «odamlar to'planadigan uch joy» → «uchta guruh» (14-savol A; namunaning uchala qatori ham joy emas, guruh edi)

## 2 · Ikki holat  `[766 · 762]`
- Eyebrow: Muhokama · ikki holat
- Sarlavha: **Bot tayyor bo'ldi — endi u *kimga* kerak?**
- Mentor: Tasavvur qiling: botingizning kodi yozilgan, tugmalar ishlayapti. Ikki kartani bosib solishtiring.
- Kartalar (bosilguncha «· · ·», qayta bosilsa yopiladi):
  - **Bot tayyor** — Buyruqlar ishlaydi, javob keladi. Lekin uni hali hech kim ochmagan: bot bo'sh turibdi.
  - **Botni odam ishlatdi** — Kimdir botni ochdi, /start bosdi va javob oldi.
- Xulosa (ikkalasi ochilgach): **Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.** Ularni bot o'zi olib kelmaydi: har biriga siz aytasiz. Bugungi maqsad — yigirmata: bir-ikki odam fikr aytishga kam, yuztasiga esa bittalab aytib chiqa olmaysiz.
- Tugma: Yana N kartani oching → Davom etish

**Ko'rinish:** ikki karta sarlavhasi birdan turadi (solishtirish uchun), matni bosilganda ochiladi; navbat belgisi ochilmagan kartada (hozirgidek). Xulosa ikkalasi ochilgach.
Animatsiya: yo'q.
Olib tashlanadi: 🤖 👥 👆.

✎ 30.09 QA F-0930-51 (rasm `rasm/F-0930-51-…png`) + ChatGPT #1 **Qabul**: «yigirmata odam — birinchi yigirma» — atama o'zini takrorlab ta'riflanardi (son sondan chiqadi, ma'no qo'shilmaydi) → «birinchi foydalanuvchilar» (haqiqiy atama; MATN_ETALONI 219-qator: tizim haqida gap ketganda «foydalanuvchi»); yigirma — maqsad soni, nega yigirma ekani o'sha gapda · 29.09: 2-karta «/start bosdi» (1-darsdagi hodisa bilan bog'lanadi) · «botingizning kodi yozilgan» (kod hali yo'q — «Tasavvur qiling» shuni ushlaydi)

## 3 · 1-savol ✅  `[815]`
- Eyebrow: Tekshiruv · bot va odam
- Savol: **Bot bir hafta ishlab turdi, siz hech kimga aytmadingiz. Nechta odam yozdi?**
  - Bir nechta — Telegram botni o'zi ko'rsatadi
  - ✔ Hech kim — uni topadigan odam bo'lmadi
  - Ko'p — bot qidiruvda birinchi chiqadi
- To'g'ri: Bot o'zi odam olib kelmaydi — birinchi odamlarga siz aytasiz.
- Xato izohlari:
  - (A) Telegram yangi botni hech kimga tavsiya qilmaydi: uni nomini bilgan odamgina qidirib topadi.
  - (C) Qidiruvda chiqish uchun ham kimdir botni izlashi kerak. Siz aytmagan botni kim izlaydi?
  - (umumiy) Botni topadigan odam bo'lmasa, unga hech kim yozmaydi.
- Barcha testlarda umumiy yozuvlar: Javobni tanlang → Davom etish · to'g'ri bo'lsa «To'g'ri», xato bo'lsa «Qaytadan urinib ko'ring» · jonli darsda: «Jonli dars — bitta urinish, o'ylab bosing.» · «Javobingiz qabul qilindi» · «Hozir to'g'ri javobni bilib olasiz.» · «To'g'ri javob: B — …»

✎ 🔴 FAKT: (A) izohi «bot shunchaki ro'yxatda turadi» — Telegram'da hamma botlar turadigan ochiq ro'yxat yo'q → «nomini bilgan odamgina qidirib topadi» · (C) aniqroq savol · umumiy yozuvlardagi ⚡ 📨 olindi

## 4 · Odamlar xaritasi (markaziy)  `[865 · 843]`
- Eyebrow: Sinov · odamlar xaritasi
- Sarlavha: **Sizni *o'rab* turgan odamlar kimlar?**
- Mentor: Markazda siz turasiz, halqalarda — atrofingizdagi odamlar: ichkarida yaqinlar, tashqarida notanishlar. Avval uchala halqani oching.
- Xarita: markazda «siz», atrofida 1 · 2 · 3 halqa (nuqtalar = odamlar)
- 1-bosqich — halqalarni ochish (ochilguncha «· · ·»):
  - 1 **Har kuni ko'rishadiganlar** · 12 odam — Yaqin sinfdoshlar, qo'shnilar, to'garakdagilar. Ismingizni biladi.
  - 2 **Ba'zan ko'rishadiganlar** · 40 odam — Maktabdagi tanishlar. Yuzingizdan taniydi.
  - 3 **Sizni tanimaydiganlar** · 300 odam — Katta Telegram guruhlaridagi odamlar. Sizni bilmaydi.
- 1-bosqich tugagach (yig'ilgan qator): ✓ Uch halqa ochildi · 12 · 40 · 300
- 2-bosqich — Bir hafta: **Har halqaga bir hafta bering: bot haqida faqat o'sha halqadagilarga aytasiz. Qaysi biridan boshlaysiz?**
  - Tugmalar: 1 Har kuni ko'rishadiganlarga · 2 Ba'zan ko'rishadiganlarga · 3 Sizni tanimaydiganlarga
  - Hafta ketayotganda: Bir hafta o'tmoqda…
  - 40 soniya kutsa: Qolgan halqalarga ham bir hafta bering.
- Natija-qatorlari (qalin — son, ostida — izoh):
  - 1 — **9 → 17 odam.** 9 odam ishlatdi, yana 8 odam qo'shildi.
  - 2 — **6 → 8 odam.** 6 odam ishlatdi, yana 2 odam qo'shildi.
  - 3 — **4 → 4 odam.** 4 odam ishlatdi, yangi qo'shilgan yo'q.
- Xulosa (uchalasi tugagach): **Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — yaqin guruh.** Bitta odam botni ochadi → yonidagilar ko'radi → ular ham ochadi. Birinchi foydalanuvchilar shunday guruhlardan keladi.
- Tugma: Uch halqani oching (0/3) → Har halqaga bir hafta bering (0/3) → Davom etish

**Ko'rinish:** kirganda — xarita va uch halqa qatori (matni yopiq). Uchalasi ochilgach halqa qatorlari bitta «✓ Uch halqa ochildi» qatoriga yig'iladi (**KOD**) va «Bir hafta» bloki chiqadi. Har hafta tugagach — o'sha halqaning natija-qatori; uchinchisidan keyin «Bir hafta» bloki yo'qoladi, xulosa chiqadi. Ekranning oxirgi holati: yig'ilgan qator + uch natija-qatori + xulosa (QA surati F-0930-52 dagi to'rt blok va uch karta o'rniga).
Animatsiya: HA — hafta ichida halqadagi nuqtalar birma-bir yonadi (ishlatganlar), keyin halqa tashqarisida yangi nuqtalar paydo bo'ladi (ular ko'rsatgan odamlar): xabar qanday tarqalishini ko'rsatadi (hozirgidek, ~6 s; reduced-motion'da darhol natija).
Olib tashlanadi: 🙋 🗓 🤔 · navbat yorliqlaridagi ① ② (halqa raqami xaritada CSS doira ichida qoladi) · 2-bosqichda halqalar matni (1-bosqich bilan bir ma'no, joy egallardi) · natija-qatorlaridagi «Bir hafta ichida…» (2-bosqich sarlavhasi aytadi) · Mentordagi «u yerda kimlar borligini ko'ring».

✎ 30.09 QA F-0930-52 (rasm `rasm/F-0930-52-…png`, TMI) **Qabul**: halqa va natija matnlari QA'ning qisqa variantidan olindi; ikki farq — «kishi» o'rniga «odam» (dars bo'yi bitta so'z), 1-halqada «Sinfdoshlar» o'rniga «Yaqin sinfdoshlar» (12 odam — butun sinf emas: 9-ekranda sinfdoshlar 26 ta) · ChatGPT #5 **Qisman**: «bir hafta» mexanikasi qoladi — xabar tarqalishini ko'rsatadigan yagona tajriba (12 odamli halqadan 17 foydalanuvchi), faqat matni qisqardi · «zich joy» → «yaqin guruh» (14-savol A): «zich» kundalik tilda «tiqilinch» — arena 11 dagi xato variant («tiqilib turadigan tor joy») ham, ruscha «тесное место» ham aynan shu ma'noni oladi · ta'rifga «sizni taniydigan» qo'shildi — 5-ekran testi tanish/notanish haqida, 9-ekran esa bir-birini ko'rish haqida; ta'rif ikkalasini qamraydi · QA'ning zanjiri «bitta odam ochadi → boshqalar ko'radi → ular ham ochadi» xulosaga kirdi · 29.09: «tez-tez» ta'rifi (to'garak ham kiradi), «har halqaga bir haftadan… qaysi biridan boshlaysiz?»

## 5 · 2-savol ✅  `[1015]`
- Eyebrow: Tekshiruv · tanish va notanish
- Savol: **Bot havolasini 15 tanishingizga va 500 notanishga yubordingiz. Ertasiga botga ko'proq odam qaysi tomondan keladi?**
  - ✔ O'n beshtasidan — ular havolani yonidagilarga ko'rsatadi
  - Besh yuztasidan — havolani ko'rgan odam ko'proq bo'ladi
  - Ikkalasidan teng — havola ikkalasiga ham yetib bordi
- To'g'ri: Tanishlar havolani ochib, yonidagilarga ko'rsatadi; notanishlarda u odatda qolib ketadi.
- Xato izohlari:
  - (B) Havolani ko'rgan odam ko'p, lekin ular sizni tanimaydi — ko'pchiligi uni ochmaydi ham.
  - (C) Havola ikkalasiga ham yetdi. Farqi shunda: tanishlar uni yonidagilarga ko'rsatadi, notanishlar esa odatda ko'rsatmaydi.
  - (umumiy) Odatda tanishlardan ko'proq odam keladi: ular bir-birini ko'rib turadi.

✎ ChatGPT #6 **Qisman**: qat'iylik — «odatda» (A3) izohlarning uchalasida (29.09 da biri, 30.09 da qolgan ikkitasi); uning savol shakli («…ko'rsatishi ehtimoli qaysi guruhda yuqori?») olinmadi — to'g'ri variantdagi sabab («ko'rsatadi») savolning o'ziga chiqib, javobni aytib qo'yardi · 29.09: «Xabarni…» → «Bot havolasini…», «javob» → «odam»

## 6 · Bitta sayt tarixi (case)  `[1084 · 1036]`
- Eyebrow: Biznes olamidan · bitta sayt tarixi
- Sarlavha: **Bu sayt birinchi foydalanuvchilarini *qayerdan* olgan?**
- Bosqichlar (har kartada «n / 5»):
  1. **2004-yil** — AQShdagi bitta universitetda oddiy sayt ochildi. Unga faqat o'sha universitet talabalari yozila olardi.
  2. Avval o'zingiz belgilab ko'ring · **Sayt faqat bitta universitetda ochiq edi. Sizningcha, u yerda qanday tarqaldi?**
     - Sekin — har kim o'zi qidirib topdi · ✔ Tez — u yerda hamma bir-birini tanirdi · Tarqalmadi — odam soni kam edi
     - Topsa: Topdingiz: tez — u yerda hamma bir-birini tanirdi. · Adashsa: Adashdingiz — asl javob: tez, u yerda hamma bir-birini tanirdi.
  3. **Keyin boshqa universitetlar** — Sayt boshqa universitetlarga birin-ketin ochildi, 2005-yilda — maktablarga ham.
  4. Avval o'zingiz belgilab ko'ring · **Sayt butun dunyoga qachon ochilgan?**
     - O'sha yilning o'zida · ✔ Ikki yarim yildan keyin · Bir necha oydan keyin
     - Topsa: Topdingiz: ikki yarim yildan keyin, 2006-yilda. · Adashsa: Adashdingiz — asl javob: ikki yarim yildan keyin, 2006-yilda.
  5. **Bu sayt — Facebook** — Bu voqeada odam soni emas, odamlarning bir-birini tanishi ish bergan. Sizda ham shunday guruhlar bor — bitta savoldan keyin ularni yozasiz.
- Nuqtalar ustida: Avval shu bosqichni tugating
- Tugma: Keyingi bosqich (1/5) … · bashoratda «Avval o'zingiz belgilang» → oxirida Davom etish

**Ko'rinish:** bosqichlar bittadan (hozirgidek); bashoratda variantlar birdan, tanlangach natija-qatori.
Animatsiya: yo'q (bosqichlarning o'zi voqeani ochadi).
Olib tashlanadi: eyebrow'dagi «Facebook» · bosqich emojilari 🎓 🎲 🐢 ⚡ 🚫 🎯 🔥 📅 🗓 ⏳ 🏫 🌍 🌉 (kartada bosqich raqami qoladi) · eski 3-bosqich («Sayt tez tarqaldi — o'zimizniki deb ishlata boshladi») · eski 6-bosqichdagi sana gapi.

✎ 30.09 ChatGPT #7 **Qisman**: 7 → 5 bosqich, 3 gacha emas — PM 33-qonun: keysda kamida ikki bashorat; ikkalasi ham qoldi. Olib tashlanganlar ikkita takror: eski 3-bosqich 1-bashorat natijasini qaytarardi (+ «o'zimizniki» shiori), eski 6-bosqichdagi «2006-yilda, ikki yarim yil o'tib» 2-bashorat natijasini qaytarardi; «Butun dunyoga» va «Bu voqeada… ish bergan» 5-bosqichga birlashdi (arena 10 va 10-kartochka shu gapga tayanadi — saqlandi) · QA F-0930-53 (rasmlar `rasm/F-0930-53-…png`) **Qabul**: «hamma o'ziniki edi» (29.09 da → «bir-birini tanirdi») · «bittalab, joyma-joy» → «birin-ketin» · ko'prikdagi «bitta zich joydan boshlagan, keyin joyma-joy kengaygan» → olindi (3-bosqich shuni aytadi) · 29.09: eyebrow'dagi «Facebook» olindi, 🔴 FAKT sanalar: Harvard 4.02.2004 · maktablar 2005-sentabr · hamma uchun 26.09.2006 (Wikipedia bilan tasdiqlangan) · **KOD:** `KEYS_STEPS` 7 → 5, bashorat indekslari (`1 · 1`) o'zgarmaydi

## 7 · 3-savol ✅  `[1147]`
- Eyebrow: Tekshiruv · bitta universitet
- Savol: **Sayt bitta universitetda tez tarqaldi. Buni nima tezlashtirdi?**
  - Saytda odam soni ko'p edi: butun shahar yozila olardi
  - Sayt birinchi kundan butun dunyo uchun ochiq turardi
  - ✔ Yangilik ertasiga darsda yonma-yon o'tirganlarga yetardi
- To'g'ri: Saytga faqat o'sha universitetdagilar kira olardi, ular esa bir-birini har kuni ko'rardi.
- Xato izohlari:
  - (A) Odam soni emas: saytga faqat o'sha universitetdagilar yozila olardi, butun shahar emas.
  - (B) Butun dunyo uchun sayt ikki yarim yildan keyin ochilgan — birinchi kuni emas.
  - (umumiy) Sabab bitta: u yerdagilar bir-birini har kuni ko'rardi va yangilikni yonidagiga aytardi.

✎ Eyebrow «bitta joydan» → «bitta universitet» (14-savol: «joy» atamasi olinadi) · 29.09: (B) «ikki yarim yil», umumiy izohdagi tire zanjiri olindi

## 8 · Uchta guruh (yozish)  `[1186]`
- Eyebrow: Mustaqil ish · uchta guruh
- Sarlavha: **Uchta *guruhingizni* yozing.**
- Mentor: Yaqin guruhni eslang: sizni taniydigan, bir-birini tez-tez ko'radigan odamlar.
- Qadam-doiralar: 1-guruh · 2-guruh · 3-guruh
- Maydonlar: «Qaysi guruh?» · «Unda kimlar bor?» · «Nechta?» + odam
- Javob-qatorlari (bloklamaydi):
  - son o'rniga matn: Nechta odam? Sonini yozing.
  - «hamma / odamlar / do'stlar / yoshlar / bolalar / hech kim» yozilsa: Aniqroq yozing: guruhda kimlar bor — sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi?
  - son 100 dan katta: Bu guruhda odam ko'p. Ularning nechtasi sizni taniydi? O'sha sonni yozing.
  - hammasi joyida: Guruh, kimlar va odam soni yozildi — saqlashingiz mumkin.
- Tugma yonida nima yetishmaydi: guruh nomi yozilmagan / kimlar borligi yozilmagan / odam soni yozilmagan
- Tugmalar: ✓ Saqlash · (tahrirda) ✓ Yangilash · ✎ Tahrirlash
- Uchtasi yozilgach ro'yxat: **Uchta guruhingiz** · **guruh** → kimlar → N odam ✎
- O'ng panel — Topshiriq:
  - Belgilar: ○/✓ Uchta guruh yozilgan · Har guruhda odam soni · Har guruhda kimlar borligi
  - Hozircha: N odam → Jami: N odam
  - Jami 20 dan kam bo'lsa: Yigirmaga yetmadi — bu ham natija. Kod yozganingizda u yana nechta odam kerakligini sanab beradi.
- Yordam: Bu odamlarni haftada necha marta ko'rasiz? · Ular sizni ismingiz bilan biladimi?
- Qo'shimcha: Odam soni eng ko'p guruhingizni oling. Agar ularning yarmi botni ochmasa, uchala guruhdan jami nechta odam qoladi? Javobni ovoz chiqarib ayting.
- Tugma: Birinchi guruhingizni yozing → Yana N guruh qoldi → Davom etish

**Ko'rinish:** hozirgidek navbat bilan — joriy guruhning bitta formasi (uch maydon bitta yozuv, keyingi maydon navbat belgisi bilan yonadi); saqlangan guruh doirada ✓ bo'ladi, keyingisi ochiladi. Uchtasi saqlangach forma yo'qoladi, ro'yxat chiqadi. «Yordam» va «Qo'shimcha» — yopiq, bosilganda ochiladi.
Animatsiya: yo'q.
Olib tashlanadi: o'ng paneldagi «1-joy · 2-joy · 3-joy» qatorlari (yuqoridagi doiralar bilan bir ma'no) · yakundagi «Uch joyingiz saqlandi — …» (ro'yxat va ✓ belgilar shuni aytadi) · 🤔 ✅ 🗂 📍 🎯 💡 ⭐ (**KOD**).

✎ 30.09 QA F-0930-54 (rasmlar `rasm/F-0930-54-…png`) **Qabul** → 14-savol: «joy» o'rniga «guruh» — o'quvchi bu yerga joy emas, odamlar guruhini yozadi (1-ekran namunasi ham: O'yin guruhi, Kursdoshlar, Qo'shnilar); QA jadvalidagi «Guruh» (birlik) va «Aloqa doirasi» (4-ekran halqalari) darsga mos, «Manba» va «Tarqatish joyi» — o'quvchiga yangi PM so'zlari · «U yerda kimlar bor?» → «Unda kimlar bor?» (ma'no o'sha — 8-dars shu maydonni oladi) · ChatGPT #8 («Bu hali javob emas» koyish ohangi) — 29.09 da tuzatilgan («Aniqroq yozing…») · 29.09: «Yigirmaga yetmadi — bu ham natija…», «…yozildi — saqlashingiz mumkin»

## 9 · To'rt guruh (markaziy o'yin)  `[1359 · 1341]`
- Eyebrow: Sinov · to'rt guruh
- Sarlavha: **Yigirmata odamni iloji boricha *kam guruhdan* yig'ing.**
- Mentor (faqat topshiriq bosqichida): To'rt guruh bor. Bittasini bosing — o'sha guruhdan nechta odam botni ishlatgani ko'rinadi.
- Hisoblagich: Yig'ildi · N / 20
- Topshiriq: Har odam botga uch qadamda keladi: eshitdi → ochdi → ishlatdi. Yigirmaga yetguncha guruh tanlang. · Tugma: To'rt guruhni ko'rish ▸
- Nishon-qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Kartalar (bosilgach: eshitdi · ochdi · ishlatdi):
  - **Sinfdoshlar** · 26 odam · har kuni ko'rishadi → eshitdi 26 · ochdi 18 · ishlatdi 13
  - **Notanish odamlar guruhi** · 1200 odam · umuman ko'rishmaydi → eshitdi 1200 · ochdi 46 · ishlatdi 2
  - **To'garakdagilar** · 11 odam · haftada uch marta ko'rishadi → eshitdi 11 · ochdi 9 · ishlatdi 7
  - **E'lon taxtasini o'qiydiganlar** · 300 odam · faqat o'tib ketayotganda ko'rishadi → eshitdi 300 · ochdi 12 · ishlatdi 1
- Sabab-qatorlari (bosilgan har guruh uchun):
  - Sinfdoshlar — 13: biri ochdi, yonidagilarga ko'rsatdi.
  - Notanish odamlar guruhi — 2: sizni tanimaydi, ochib yopib qo'ydi.
  - To'garakdagilar — 7: haftada uch marta uchrashadi, bir-biriga eslatadi.
  - E'lon taxtasini o'qiydiganlar — 1: o'qidi va o'tib ketdi, eslatadigan odam yo'q.
- Yordam (faqat kam natijadan keyin chiqadi): Ikki savol bering: bu odamlar bir-birini taniydimi? · Ular bir-birini haftada necha marta ko'radi?
- Yakun (20 ga yetgach): bosilgan guruhlar tasmasi «Sinfdoshlar +13 …» va
  {N} odam {ikkita/uchta/to'rtta} guruhdan yig'ildi — sinfdoshlar 13, to'garakdagilar 7 … (1200 lik guruh bosilgan bo'lsa: · 1200 odamdan atigi 2 tasi)
- Tugma: Topshiriqni o'qing → Bitta guruhni bosing → Yigirmagacha N odam qoldi → Davom etish

**Ko'rinish:** 1-bosqich — Mentor, topshiriq va «To'rt guruhni ko'rish» (hozirgidek). 2-bosqich — to'rt karta birdan (tanlov variantlari, teng); har kartada bosishdan oldin nomi, odam soni va qanchalik tez-tez ko'rishishi turadi. Karta bosilganda uch qadam birma-bir ochiladi; sabab-qatori o'ng ustunda. Yordam — faqat birinchi kam natijadan keyin. 20 ga yetgach sabab-qatorlari o'rniga yakun-tasma.
Animatsiya: HA — bosilgan kartada uch qadam ketma-ket ochiladi va son har qadamda kamayadi (26 → 18 → 13; 1200 → 46 → 2): odam qaysi qadamda yo'qolishini ko'rsatadi (hozirgidek, ~0.6 s qadam; hisoblagich chizig'i shu bilan to'ladi).
Olib tashlanadi: legenda «👥 Nechta odam ko'radi · 🔁 Odamlar qanchalik tez-tez ko'rishadi» — kartada belgi o'rniga so'z turadi («26 odam · har kuni ko'rishadi», **KOD**) · 🏅 🏫 🌐 🏀 📌 💡 ✅.

✎ 30.09: «joy» → «guruh» (14-savol A) · «Sinfdoshlar guruhi» → «Sinfdoshlar» (hammasi guruh — so'z ortiqcha) · «Maktab e'lonlar taxtasi» → «E'lon taxtasini o'qiydiganlar» (taxta — guruh emas, buyum; kartada odamlar turishi kerak; **KOD**) · ChatGPT #9 (nishon), #10 («Har joy uch qadamdan o'tadi») — 29.09 da tuzatilgan: maqsad sarlavhada («iloji boricha kam guruhdan»; faqat 13 + 7 yo'li ikki guruhda yigirmaga yetadi, kod nishonni aynan shu yo'lda qoldiradi), «Har odam botga uch qadamda keladi» · eyebrow «Sinov» (4-ekran bilan bir nom)

## 10 · Koding  `[1558 · 1516]`
- Eyebrow: Koding · kod oynasi
- Sarlavha: **Odamlarni sanaydigan *kod* yozamiz.**
- 1-bosqich (kod-savol):
  - Mentor: Avval bitta savol, keyin kodni yozasiz.
  - Qoida-qatori (savol ustida): Kod uchta guruhning odam sonini qo'shadi. Jami 20 dan kam bo'lsa — «Yana ... odam kerak», aks holda — «Yigirmata odam bor» deb yozadi.
  - Savol: **Uchta guruhda 13, 7 va 4 odam bor. Kod nima chiqaradi?**
    - Jami: 24 odam · Yana 4 odam kerak
    - ✔ Jami: 24 odam · Yigirmata odam bor
    - Jami: 20 odam · Yigirmata odam bor
  - Xato bosilsa: Ikki narsani alohida sanang: uchta son qo'shilsa nechta bo'ladi va u yigirmadan kammi?
- 2-bosqich (kod):
  - Mentor: Uchta guruhingiz kodda ro'yxat bo'lib turibdi. Sizga sanash va bitta shart qoladi.
  - Yig'ilgan savol: ✓ 13 + 7 + 4 = 24 — yigirmadan kam emas
  - **Kod nima chiqarsin:** 1. Har guruh uchun bitta qator chiqadi · 2. Jami son chiqadi · 3. Oxirgi qator: yigirmaga yetdi yoki yana nechta odam kerak
  - Yordam: Qatorni `console.log(...)` ekranga chiqaradi. Bittasidan boshlang: `console.log(guruhlar[0].nom)`. · Ishlagach, shu guruhning sonini `jami` ga qo'shing. · Qo'shimcha: eng ko'p odam beradigan guruhning nomini alohida qatorda chiqaring.
  - Uchta guruh — bitta hisob · Tugma: Kod oynasini ochish → (keyin) ↻ Kod oynasini qayta ochish · «Bajarildi — xohlasangiz kodni yana o'zgartirib ko'ring»
  - Faqat mustaqil rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: Kod uchta guruhni sanab berdi: jami son va yigirma sharti chiqdi.
- Kod oynasi ichida: Eyebrow «Koding · odamlarni sanaymiz» · Sarlavha **Odamlarni sanaydigan kod** · fayl `yigirma.js` · bo'sh qatordagi yozuv «// shu guruh uchun bitta qator chiqaring»
  - Topshiriq: Ro'yxat bo'ylab yuring: console.log ichida guruh nomi va odam soni, sonni **jami** ga qo'shing, oxirida — «Yigirmata odam bor» yoki «Yana ... odam kerak».
- Boshlang'ich kod — o'quvchi 8-ekranda uchta guruhni saqlagan bo'lsa (ro'yxat uning guruhlaridan):
  ```js
  // yigirma.js — birinchi yigirmata foydalanuvchini sanaydigan kod
  // Ro'yxat siz yozgan uchta guruhdan to'ldirildi.
  const guruhlar = [
    { nom: "<1-guruh>", nechta: <son> },
    { nom: "<2-guruh>", nechta: <son> },
    { nom: "<3-guruh>", nechta: <son> }
  ];

  let jami = 0;

  for (let i = 0; i < guruhlar.length; i++) {
    // 1) shu guruh uchun bitta qator chiqaring: console.log ichida guruh nomi va nechta odam
    // 2) jami ga shu guruhning odam sonini qo'shing
  }

  // 3) jami 20 dan kam bo'lsa: "Yana ... odam kerak"
  //    aks holda:              "Yigirmata odam bor"
  ```
- Boshlang'ich kod — 8-ekranda guruh saqlanmagan bo'lsa (masalan, jonli darsda o'tkazib yuborilgan): o'sha kod, faqat ikki qator boshqa:
  ```js
  // Ro'yxatda namunadagi uchta guruh turibdi.
  const guruhlar = [
    { nom: "O'yin guruhi", nechta: 12 },
    { nom: "Kursdoshlar", nechta: 6 },
    { nom: "Qo'shnilar", nechta: 4 }
  ];
  ```
- Tekshiruv xabarlari (shart bajarilmasa):
  - Uchala guruh nomi uchta alohida qatorda chiqsin — har guruh uchun console.log yozing
  - jami ga har guruhning sonini qo'shing va oxirida uni chiqaring
  - Oxirgi shart: kam bo'lsa "Yana ... odam kerak", aks holda "Yigirmata odam bor"
- Tugma: Avval kod-savolini yeching → Kodni yozing → Davom etish

**Ko'rinish:** hozirgidek ikki bosqich — kod-savol yechilgach u bitta «✓ 13 + 7 + 4 = 24…» qatoriga yig'iladi va 2-bosqich ochiladi. Kod oynasi to'liq ekranda ochiladi.
Animatsiya: yo'q.
Olib tashlanadi: 🛠 🔎 🤔 💡 ⭐ 🧮 ✅.

✎ 🔴 FAKT (**KOD**, DAVOM 6 tasdiqlangan; ChatGPT #12 ham shuni topgan): 8-ekranda joy saqlanmagan bo'lsa, boshlang'ich kodga `joy: {"uz":"O'yin guruhi","ru":"Игровая группа"}` tushardi (`DEMO_JOY.nom` obyekt → `JSON.stringify`, [1564] → [1519]); tuzatish: zaxirada `tr(d.nom)` · shu holatda izoh «Ro'yxat siz yozgan…» yolg'on edi → «Ro'yxatda namunadagi uchta guruh turibdi» · kod-savol ustiga qoida-qatori (**KOD**) · ChatGPT #11 («kompilyator» / «kod oynasi» aralash) — 29.09 da «Kod oynasini ochish»; uning «kod muharriri» taklifi olinmadi (lug'atda «kod oynasi») · 30.09 (14-savol A): o'quvchi ko'radigan kodda `joylar` / `joy` → `guruhlar` / `nom` (**KOD:** `kodStarter`, `HtmlCompiler` shartlari shu nomlar bilan), izohlar «guruh»

## 11 · 4-savol ✅ (final)  `[1834]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Bot havolasi 900 notanish odamga yuborildi. Ertasiga nechta odam botni ishlatadi?**
  - Yigirmatadan ko'p — havolani ochadigan odam ko'p chiqadi
  - ✔ Bir-ikki odam — ochganlar ham ishlatmay qo'yadi
  - Hech kim — bunday havolani odamlar ochmaydi
- To'g'ri: Notanish odam botni odatda ochib ko'radi va yopib qo'yadi.
- Xato izohlari:
  - (A) Ochganlar bo'ladi, lekin ishlatmay qo'yadi: notanish odam botni odatda ochib ko'radi va yopadi.
  - (C) Havola yetib bordi, ochganlar ham bo'ldi — gap ochgandan keyin nima bo'lishida.
  - (umumiy) Katta notanish guruhdan bir-ikki odam qoladi — qolganlari ochsa ham ishlatmaydi.

✎ «zich joylardan» → «yaqin guruhlardan» (14-savol A) · «Katta joydan» → «Katta notanish guruhdan» (dars bitta tushunchaga ikki nom berardi: «katta joy» va «katta guruh») · 29.09: «ishlatmay qo'yadi», «odatda» (A3)

## 12 · Yoddan ayting (refleksiya)  `[1730]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Eng yaqin guruhingizni *yoddan* ayta olasizmi?**
- Mentor: Ekranga qaramasdan ikki narsani ayting: guruh nomi va undagi odamlar bir-birini haftada necha marta ko'radi.
- 1-qadam: Ovoz chiqarib ayting (mustaqil) / Sherigingizga ayting (jonli)
  - Mustaqil: ▶ 30 soniyani boshlash → «Hozir ovoz chiqarib ayting · ekranga qaramasdan» → ✓ Vaqt tugadi — aytib bo'ldingiz. · ↻ Yana 30 soniya
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash → «Hozir A gapiradi · keyin — B navbati» / «oxirgi navbat» → ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. · ↻ Yana 1 daqiqa · To'xtatish
- 2-qadam: Endi bir qator yozing · maydon: «Eng yaqin guruhim — ..., ularni haftada ... marta ko'raman»
- Yozgach: ✓ Endi bilasiz: botni qurish — ishning yarmi, birinchi foydalanuvchilarni o'zingiz olib kelasiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor va 1-qadam. Vaqt tugagach 1-qadam «✓ Aytdingiz» qatoriga yig'iladi va 2-qadam ochiladi (**KOD:** hozir ikkala qadam birdan). «Davom etish» hozirgidek ochiq.
Animatsiya: yo'q (taymer halqasi — vaqt ko'rsatkichi).
Olib tashlanadi: «🎯 Bugungi qoida: birinchi yigirma zich joydan yig'iladi» (3 ekrandan keyin Yakunda «Bugungi asosiy fikr» aynan shu gap) · «Barakalla!» · 🗣 ✍️ ⏹.

✎ «Eng zich joyingizni» → «Eng yaqin guruhingizni» (14-savol A; «eng yaqin guruhim» — kundalik gap) · ChatGPT #13 (sarlavha uchtasini, maydon bittasini so'raydi) — 29.09 da tuzatilgan · 29.09: 1-qadam yorlig'idagi takror olindi, «botni qurish — ishning yarmi»

## 13 · Natijalar (podium)  `[2422]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «Bu sessiyaga hali hech kim qo'shilmagan» — «sessiya» → B-3.)

## 14 · Takrorlash (kartochkalar)  `[1823 · 1811]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni *sinab ko'ring*.**

| Old tomon (savol) | Orqa (javob) |
|---|---|
| Birinchi foydalanuvchilar kimlar? | Botingizni birinchi bo'lib ishlatadigan odamlar |
| Yaqin guruh nima? | Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar |
| Yaqin guruhda xabar nega tez tarqaladi? | Bittasi aytsa, qolganlar ham eshitadi |
| Katta guruhda odam ko'p — nega ishlatgani kam? | Ular sizni tanimaydi |
| Botga birinchi odamlarni kim olib keladi? | Siz aytasiz — bot o'zi olib kelmaydi |
| Bitta guruh haqida nimalarni yozib qo'yasiz? | Guruh nomi, unda kimlar borligi va odam soni |
| Odam botga kelguncha qaysi uch qadamdan o'tadi? | Eshitdi, ochdi, ishlatdi |
| Facebook sayti qayerdan boshlangan? | Bitta universitetdan — boshqalar yozila olmasdi |
| Facebook butun dunyo uchun qachon ochilgan? | Ikki yarim yildan keyin — 2006-yilda |
| Facebook voqeasida nima ish bergan? | Odam soni emas, odamlarning bir-birini tanishi |

- Tugmalar: o'zgarmaydi (↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim) · oxirida: Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

**Ko'rinish:** hozirgidek — bitta karta, bosilganda ag'dariladi.
Animatsiya: yo'q (ag'darilish — kartochka mexanikasi, hozirgidek).
Olib tashlanadi: 🎉 («Hammasini bilasiz!» oldidagi).

✎ 1, 2, 3, 6-kartochkalar — yangi atamalar (14-savol A) · 29.09: 9-kartochka sanasi (🔴 FAKT, 6-ekran), «qolganlar ham eshitadi»

## 15 · Yakun  `[2518]`
- Eyebrow: Dars yakuni · belgi: ✓ Dars tugadi
- Sarlavha: **Uchta *guruhingizni* yozdingiz.** (yonida N/4 to'g'ri javob halqasi)
- Bugungi asosiy fikr — **Birinchi foydalanuvchilar yaqin guruhlardan keladi.**
- CODE STRIKE arenasi tugmasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.
  - Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — yaqin guruh.
  - Yaqin guruhda bitta odam botni ochsa, xabar qolganlarga ham yetadi.
  - Birinchi foydalanuvchilarni bot emas, siz olib kelasiz.
- Nishonlaringiz — N/4 (quyida «Qo'shimcha matnlar»)
- Uyga vazifa · Amaliy topshiriqni bajarish → (PM uy vazifasi — mazmuni bu MD'ga kirmaydi)
- Keyingi dars — **«Telegram Bot API + tugmalar»**. 1-darsda ochgan botingizga birinchi kodni yozasiz: /start buyrug'i va menyu tugmalari.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

**Ko'rinish:** hozirgidek; «Keyingi dars» qatori uyga vazifa tugmasi ostida.
Animatsiya: yo'q.
Olib tashlanadi: ⏳ 🏅 (matn oldidagi; nishon medallari qoladi).

✎ Asosiy fikr «Birinchi yigirma zich joydan yig'iladi» → «Birinchi foydalanuvchilar yaqin guruhlardan keladi» (14-savol A; ChatGPT shior-ro'yxatidagi birinchi gap) · 29.09: 🔴 FAKT «Keyingi dars» qatori yo'q edi → App.jsx m5-03 bo'yicha qo'shildi (**KOD**) · sarlavha `tr()` siz — RU rejimda ham o'zbekcha chiqadi (**KOD**, RU bosqichida)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Circle Explorer** (hozir Map Pro!) — Uch halqani ochib solishtirdingiz (4)
- **Three Groups** (hozir My Plan!) — Uchta guruhni kimlar borligi va odam soni bilan yozdingiz (8)
- **First Twenty** (hozir 20 Done!) — Yigirmata odamni ikki guruhdan yig'dingiz (9)
- **Head Counter** (hozir Code Master!) — Kodingiz uchta guruhdagi odamlarni sanab berdi (10)
- Nishon yozuvlari: Nishonlar — N/4 · Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. (faqat 9-ekranda) · Yangi nishon · bosib davom eting

✎ «Three Spots» → «Three Groups» va tavsiflarda «joy» → «guruh» (14-savol A) · 29.09: «20 Done!» tavsifi kod mantiqiga mos («ikki guruhdan»), «Code Master!» o'rniga darsga bog'langan nom

**Jonli darsdagi sinf holati (o'quvchi ko'radi, 4 · 8 · 9 · 10-ekranlar):** Sinfda: N bajardi · N hali bajarmoqda (👥 ✏️ olindi)

**Qisqa takrorlash oynalari (RECAPS, 4)** — jonli darsda Mentor ekranidan ochiladi; yorliq «Qayta tushuntirish», 3-kartada «Sinfga savol:»; karta belgisi (`ic`) o'rniga raqam 1 · 2 · 3:
1. (3-ekran · 1-savol) **Birinchi foydalanuvchilarni siz olib kelasiz:** Birinchi foydalanuvchilar — Botingizni birinchi bo'lib ishlatadigan odamlar. · Bot o'zi olib kelmaydi — Bot bo'sh turganda uni hech kim ko'rmaydi. Birinchi odamlarning har biriga siz aytasiz. · Tayyor bo'lgani yetmaydi — Buyruqlar ishlashi — ishning yarmi. Ikkinchi yarmi: botni odam ochib ishlatishi. · Sinfga savol: Oxirgi botni siz kimning gapidan keyin ochgansiz?
2. (5-ekran · 2-savol) **Yaqin guruhdan ko'p foydalanuvchi keladi:** Yaqin guruh — Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar. · Xabar o'zi yuradi — Yaqin guruhda bitta odam aytsa, qolganlar ham eshitadi va ko'pincha o'zlari ham ochadi. · Katta guruh — Katta guruhda odam ko'p, lekin ular sizni tanimaydi: xabar odatda bitta odamda qolib ketadi. · Sinfga savol: Sizni ismingiz bilan taniydigan odamlar qaysi guruhingizda ko'p?
3. (7-ekran · 3-savol) **Facebook bitta universitetdan boshlagan:** 2004-yil — Sayt bitta universitetda ochildi: boshqalar ro'yxatdan o'ta olmasdi. · Dunyoga chiqish — Butun dunyo uchun sayt 2006-yilda, ikki yarim yil o'tib ochildi; ungacha boshqa universitetlar va maktablarga birin-ketin ochildi. · Nima ish bergan — Odam soni emas, odamlarning bir-birini tanishi ish bergan. · Sinfga savol: Sizda universitet yo'q. Uning o'rniga qaysi guruhingiz bor?
4. (11-ekran · 4-savol) **Katta guruhdan foydalanuvchi kam chiqadi:** Xabar yetadi — Katta guruhda xabar ko'p odamga yetadi, lekin ochib ishlatadigani kam qoladi. · Yigirma qayerdan — Yigirmata foydalanuvchi ikki-uchta yaqin guruhdan keladi, bitta katta guruhdan emas. · Uch qadam — Odam botga uch qadamda keladi: eshitdi, ochdi, ishlatdi. Har qadamda odam kamayadi. · Sinfga savol: Qaysi qadamda eng ko'p odam yo'qoladi?

✎ 30.09: sarlavhalar shiordan gapga («Zich joy ko'p odam beradi» → «Yaqin guruhdan ko'p foydalanuvchi keladi», «Katta joy kam odam beradi» → «Katta guruhdan foydalanuvchi kam chiqadi», «Facebook bitta joydan…» → «…bitta universitetdan…») · 3-karta «joyma-joy kengaydi» → «birin-ketin ochildi» (QA F-0930-53) · 29.09: 1-karta sarlavha takrori olindi, «bermaydi» → «kam», 3-karta sanasi (🔴 FAKT), emojilar olindi

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Birinchi foydalanuvchilar kimlar? ✔ Botni birinchi bo'lib ishlatadigan odamlar · Botni yaratishga yordam bergan odamlar · Botga faqat bir marta yozgan odamlar · Bot haqida faqat eshitgan odamlar
2. Botga birinchi odamlarni kim olib keladi? Telegram — u yangi botlarni hammaga aytib turadi · Qidiruv — bot qidiruvda o'zi yuqoriga chiqadi · Bot — u yozilgan kuni odamlarni chaqiradi · ✔ Siz — birinchi odamlarga o'zingiz aytasiz
3. Yaqin guruhda xabar nega tez tarqaladi? Chunki u yerda odam soni eng ko'p · Chunki xabarni u yerda bot o'zi aytadi · ✔ Chunki u yerdagilar bir-birini tez-tez ko'radi · Chunki u yerdagilar bir-birini izlab yuradi
4. Uch halqadan qaysi biri ko'proq odam berdi? Sizni tanimaydiganlar halqasi · ✔ Har kuni ko'rishadiganlar halqasi · Ba'zan ko'rishadiganlar halqasi · Uchala halqa ham bir xil odam berdi
5. Katta guruhda odam ko'p — nega ishlatgani kam? Chunki katta guruhda bot ochilmaydi · ✔ Chunki u yerdagilar sizni tanimaydi · Chunki xabar u yerga umuman yetmaydi · Chunki bot u yerda sekin ochiladi
6. Xabar qaysi guruhdan tez tarqaladi? ✔ Har kuni ko'rishadigan guruhdan — ular bir-biriga aytadi · Har kuni ko'rishadigan guruhdan — odam soni ko'p · Bir-birini tanimaydigan guruhdan — odam soni ko'p · Bir-birini tanimaydigan guruhdan — ular bir-biriga aytadi
7. Odam botga kelguncha qaysi uch qadamdan o'tadi? Qidirdi, topdi, yozdi · Ochdi, ishlatdi, eshitdi · ✔ Eshitdi, ochdi, ishlatdi · Ko'rdi, yozdi, o'chirdi
8. Facebook sayti 2004-yilda qayerda ochilgan? Butun dunyoda — istagan odam yozila olardi · Ikki shaharda — ikkita katta maktabda · Uchta shaharda — har birida bitta joyda · ✔ Bitta universitetda — faqat o'z talabalariga
9. Facebook butun dunyo uchun qachon ochilgan? ✔ Oradan ikki yarim yil o'tgach · Birinchi kunidan boshlab · Bir necha oydan keyin · O'sha yilning oxirida
10. Facebook voqeasida nima ish bergan? Saytning tez ochilishi · Saytga yozilgan odamlar soni · ✔ Odamlarning bir-birini tanishi · Saytdagi tugmalarning ko'pligi
11. Yaqin guruh qanday guruh? Uyingizga eng yaqin yashaydigan odamlar guruhi · ✔ Sizni taniydigan va tez-tez ko'rishadigan guruh · A'zosi ko'p va hammaga ochiq katta guruh · Siz har kuni yozadigan va o'qiydigan guruh
12. Uchta guruh yozganda har guruh haqida nimalarni yozasiz? Guruh nomi va undagi odamlarning yoshi · Faqat odam soni — qolgani kerak emas · Guruh nomi, admini va ochilgan kuni · ✔ Guruh nomi, kimlar borligi va odam soni

✎ 30.09 (14-savol A): 1, 3, 6, 11, 12-savollar yangi atamalar bilan · 1-savol: xato variantlar «yigirmata» bilan tugardi — atama endi sondan emas, ma'nodan so'raladi; «Bot haqida faqat eshitgan odamlar» — uch qadamning birinchisida qolganlar, ishonarli xato · 11-savol: xato variant «Uyingizga eng yaqin…» — «yaqin» so'zining kundalik ma'nosi (29.09 dagi «tiqilib turadigan tor joy» kabi); to'rttasi bir shaklda, ikkitasida «va» (vergul/bog'lovchi faqat to'g'rida qolmasin) · 12-savol: «u yerga borish yo'li» → «admini va ochilgan kuni» (Telegram guruhi haqida ishonarli xato; vergul endi faqat to'g'rida emas) · 29.09: 11-savol shakli (ChatGPT #14), 3-savol vergul, 9-savol sanasi, 8-savol grammatikasi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — `HOOK_OPTS` ga har variant uchun o'z izohi (ikki xil matn, oxiri bir xil); variant emojilari olinadi.
2. s1 — `DEMO_JOY[1]` «Qarindoshlar» → «Kursdoshlar», `DEMO_JOY[2].kim` → «bir hovlidagilar»; «Jami» qatorlar bilan birga o'sadi (12 → 18 → 22); yorliq «Namuna: uchta guruh».
3. s2 — xulosa (atama + nega yigirma); 2-karta matni.
4. s4 — 1-bosqich tugagach halqa qatorlari «✓ Uch halqa ochildi · 12 · 40 · 300» qatoriga yig'iladi; `HALQALAR` `qator` va `res` — qisqa matn, `res` ikki qismli (qalin «9 → 17 odam» + izoh); 2-bosqich savoli; 40 s yozuvi; xulosa (atama + zanjir).
5. s6 — eyebrow «bitta sayt tarixi»; `KEYS_STEPS` 7 → 5 (eski 3 va 6 olinadi, 5 va 6 birlashadi), `n / 5`; `ic` olinadi; bashorat indekslari `1 · 1`.
6. s7 — eyebrow «bitta universitet».
7. s8 — `joy` → `guruh` barcha yorliq, placeholder, javob-qatori, panel belgilari; o'ng paneldagi 1/2/3 qatorlari va yakundagi `done-mini` olinadi. Chiqish-artefakt kaliti (`kanallar[].kanal`, `kim`, `nechta`) O'ZGARMAYDI — 8-dars o'qiydi.
8. s9 — legenda olinadi, kartada «N odam · <tez-tezligi>» so'z bilan; 1 va 4-karta nomi; sarlavha, Mentor, topshiriq, eyebrow, yakun-tasma («guruhdan»).
9. 🔴 s10 — zaxira: `DEMO_JOY.map(d => ({ nom: tr(d.nom), nechta: d.n }))` + zaxirada 2-izoh qatori (`kodStarter` ga belgi uzatiladi); kodda `joylar/joy` → `guruhlar/nom`, `HtmlCompiler` shartlari va xabarlari shu nomlar bilan; kod-savol ustiga qoida-qatori; tugma «Kod oynasini ochish».
10. s11 — izoh matnlari.
11. s12 — 2-qadam taymer tugagach ochiladi, 1-qadam «✓ Aytdingiz» qatoriga yig'iladi; «Bugungi qoida» qatori va «Barakalla!» olinadi; sarlavha va maydon namunasi.
12. s15 — «Keyingi dars — …» qatori; sarlavha `tr()` ga o'raladi (RU); `RECAP` matnlari.
13. `ACHIEVEMENTS` (Three Groups…), `FLASHCARDS` 1, 2, 3, 6, 9, `RECAPS` 1–4, `QUIZ_BANK` 1, 3, 6, 8, 9, 11, 12 (✔ indekslari `0,3,2,1 · 1,0,2,3 · 0,2,1,3` o'zgarmaydi — tekshiruv: `correct` ketma-ketligi grep bilan).
14. Mentor matnlari (`MentorNote`, `SCREEN_INTENTS` s11 «katta joyga…», s8 «katta joylar chiqadi») — atamalar shu MD bilan bir xil (o'quvchi ko'rmaydi, lekin Mentor shu so'zlar bilan gapiradi).
16. `HwCard` (uy vazifasi) — 12-savol B: faqat emoji (📝 🗂 👆) va Botjon/daftar olinadi; boshqa matni o'zgarmaydi.
17. Test oynalaridagi to'g'ri javob izohi — bitta gap (3, 5, 11-ekran; 16-savol javobi).
15. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`): testlarning umumiy yozuvlari (⚡ 📨), `StudentPracticePulse` (👥 ✏️), `AchRule` 🏅, `Flashcards` 🎉, `PairTimer` ⏹, navbat yorliqlaridagi ① ② ③; RECAPS `ic` → raqam.

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **App.jsx m5-02** `sub` «yigirmata odam qayerdan keladi» — dars mazmuniga mos, o'zgarish kerak emas.
2. **8-dars (PmLesson20) ko'prigi:** 8-dars shu darsning chiqishidan (`pm-m5d2-yigirmata` → `kim`) ro'yxat oladi. `kim` — «Unda kimlar bor?» javobi (guruh ichidagilar), odam ismi emas; 8-dars v2 buni hisobga olgan. Bu darsda maydon ma'nosi ham, kalit ham o'zgarmaydi.
3. **«sessiya»** (podium) — barcha darslarda bir xil shablon → KATTA_TOZALASH nomzodi (1-dars v2 B-5 bilan bir).
4. **«kompilyator» → «kod oynasi»** — KATTA_TOZALASH F-0929-19 (47 fayl); bu darsda faqat o'z tugma matni o'zgaradi, `HtmlCompiler` ichidagi yozuvlar — umumiy komponent.
5. **`AchRule` matni** (MATN_KORPUS §183) — hamma darsda bir xil; bu darsda o'zgartirilmaydi, 9-ekranda maqsad sarlavha orqali aniqlandi.
6. **Uy vazifasi** — `HwCard` Yakun ichida; 12-savol javobi **B** (30.09): faqat emoji va Botjon/daftar tozalanadi, mazmuni o'zgarmaydi (KOD 16). «joy» so'zi unda bo'lsa — mazmun, tegilmaydi; foydalanuvchiga xabar qilinadi.
7. **RU matni** — o'zbekcha tasdiqlangach. QA surati (F-0930-54): «тесное место» — «tiqilinch joy» ma'nosi; 14-savol A bo'lsa «yaqin guruh» → «близкий круг», «guruh» → «группа». Facebook sanasi va «tez-tez» ta'rifi ham.
8. **3-dars v2** (`03-BotApiButtons-v2.md` 43-qator): «birinchi yigirma odam» → «birinchi foydalanuvchilar» ✅ (30.09, F-0930-57).
9. **Qonun nomzodlari → `QONUN_NOMZODLARI.md`:** N7 (birinchi urinish nishonida «to'g'ri» nima ekani topshiriqdan ko'rinsin) · N8 (dars atamasining kundalik ma'nosi darsdagi ma'noga zid bo'lmasin) · N9 (dars qoidasi shiorga qisqartirilmaydi).

---

## Eslatmalar
1. **ChatGPT auditi (F-0930-50) — 17 band:** 3 tasi Qabul (yangi tuzatish), 8 tasi Qabul — 29.09 qoralamada allaqachon tuzatilgan, 4 tasi Qisman, 2 tasi Rad. Jadval — `JURNAL.md`.
2. **QA (F-0930-51…54) — 4 band, hammasi Qabul;** «joy» haqidagi taklif → 14-savol (atama foydalanuvchi qarori).
3. **Tekshiruv:** ekran soni 16 = sozlar.md; inline ✔ (`s3:1 · s5:0 · s7:2 · s11:1`) va arena ✔ o'rinlari eski MD bilan bir xil (`v2check.py`); o'quvchi matnida Botjon/daftar/emoji yo'q; «Keyingi dars» App.jsx m5-03 ga mos.
