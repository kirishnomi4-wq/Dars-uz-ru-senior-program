# 5-Modul (LMS: 7-Modul) · 12-dars «Kecha kelgan odam bugun ham keldimi?» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/PmLesson21.jsx` · 16 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook** (0-ekran): Mentor «Botingizni ishga tushirganingizga anchadan beri bo'ldi» deydi, sarlavha so'raydi: «Kecha kelgan odam bugun ham keldimi?». O'quvchi ikki javobdan birini tanlaydi («Ayta olaman…» / «Ayta olmayman…»). Qaysini tanlasa ham bir xil javob ochiladi: «kechagi odamlardan bugun nechtasi yana keldi» boshqa son, u ikki kunning ro'yxatini solishtirib topiladi. Yonida ikki ustun (kecha / bugun) sahnasi chiqadi: bugungi belgilardan uchtasi yashilga o'tadi.
- **Markaziy mexanika** (4-ekran): «Botingizning kunlari»: o'quvchi besh kunlik ustunni birma-bir ochadi, 3-kundan keyin «📣 Kanalga e'lon berish» tugmasini bosadi. E'lon kuni kelganlar 23 taga sakraydi, qaytganlar esa 4, 4, 4, 5 bo'lib qoladi. 9-ekranda shu mantiqni qo'lda tekshiradi: to'rt odamning besh kunlik qatorida qaytish kunlarini belgilaydi (mezon: chap yonidagi katak ham yashilmi?).
- **Keys** (6-ekran): Duolingo'dagi 🔥 raqam ketma-ket kunlarni sanaydi, bir kun tashlansa noldan boshlanadi (2 ta bashorat bor).
- **Asosiy metafora:** alohida metafora yo'q. Dars bo'yi bitta vizual takrorlanadi: «ikki kun yonma-yon» (yashil katak + chap yon).
- **Yakun:** o'quvchi o'z botining uch kunlik hisobini yozadi (8-ekran), shu hisobni kodda sanaydi (10-ekran, `hisob`), keyin yakuniy test va 2-kunning ikki sonini yoddan aytish. Yakun sarlavhasi: «Uch kunlik hisobingiz yozildi.»

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish: kecha kelgan odam | hook | ikki javobdan birini tanlaydi, bir xil javob ochiladi | — |
| 1 | Maqsad | qoida | «uch kunlik hisob» jadvali o'zi yozilib chiqadi (kataklarda «?») | — |
| 2 | Ikki karta | tushuncha | «Bugun kelganlar» / «Kecha ham kelganlar» kartalarini ochib solishtiradi | — |
| 3 | 1-savol | test | seshanbagi 5 odamdan kim qaytgan | ✅ |
| 4 | Botingizning kunlari | markaziy | 5 kunni ochadi, 3-kundan keyin e'lon beradi, ikki qatorni kuzatadi | — |
| 5 | 2-savol | test | katta e'londan keyin ertasiga nima bo'ladi | ✅ |
| 6 | Duolingo | case | 7 bosqich, 2 bashorat | — |
| 7 | 3-savol | test | 🔥 raqam qachon o'sadi | ✅ |
| 8 | Uch kun | amaliyot | o'z botining 3 kunini yozadi: keldi + qaytdi | — |
| 9 | Besh kunlik ro'yxat | amaliyot (tekshiruv) | 4 odamning qatorida qaytish kunlarini belgilaydi | — |
| 10 | Koding | koding | darvoza-savol, keyin kompilyatorda `hisob` kod bo'lagini yozadi | — |
| 11 | 4-savol | test | chorshanba kunining hisob-qatori | ✅ (final) |
| 12 | Mustahkamlash | refleksiya | 2-kunning ikki sonini yoddan aytadi va bir qatorda yozadi | — |
| 13 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Dars yakuni | xulosa | arena, «Endi siz bilasiz», nishonlar, uyga vazifa tugmasi | — |

Qo'shimcha: jonli viktorina (arena) 12 savol; «Qayta tushuntirish» oynalari (RECAPS) 4 ta (ularni faqat jonli darsda mentor test natijasidan ochadi); nishonlar 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
👥 Keldi · ↩️ Qaytdi · kelganlar · qaytganlar / qaytgan · kecha ham kelgan (odam) · birinchi marta kelgan odam · qaytish kuni ·
ikki kun yonma-yon · chap yon · 🟩 yashil katak · ro'yxat (kechagi / bugungi) · e'lon (kanalga) · ertasiga · 🔥 raqam (Duolingo) · ketma-ket kunlar ·
«muzlatish» · uch kunlik hisob · hisob-qatori · yozuv · kod bo'lagi (`hisob`) · kompilyator / kod oynasi

---

## 0 · Kirish: kecha kelgan odam  `[664]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Kecha kelgan odam bugun ham keldimi?**
- Mentor: Botingizni ishga tushirganingizga anchadan beri bo'ldi.
- Tanlov (ikki tugma):
  - 🟢 Ayta olaman — kelganlarni o'zim sanab turaman
  - 🤷 Ayta olmayman — hech kim ularni sanamagan
- Tanlagandan keyin (ikkala tanlovda bir xil): Qaysi javobni tanlasangiz ham, «kechagi odamlardan bugun nechtasi yana keldi» — bu boshqa son: uni ikki kunning ro'yxatini solishtirib topasiz. Bugun shu ikki sonni o'zingiz yozasiz.
- Sahna (so'zsiz): ikki ustun, chapda kecha (6 belgi), o'ngda bugun (5 belgi); bugungi 3 belgi birin-ketin yashilga o'tadi.
- Jonli darsda: har variant yonida ovozlar soni (diagramma).
- Tugma: Bittasini tanlang → Davom etish

## 1 · Maqsad  `[753]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun botingiz uchun uch kunlik hisob yozasiz.**
- Mentor: Jadvalni kuzating.
- Jadval (o'zi yozilib chiqadi): ustunlar **Kun · Keldi · Kecha ham kelgan** · qatorlar 1-kun / 2-kun / 3-kun · kataklarda «?»
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Ikki karta  `[782]`
- Eyebrow: Muhokama · ikki karta
- Sarlavha: **Bugun kelganlarning nechtasi kecha ham kelgan edi?**
- Mentor: Botingizga har kuni odam keladi. Ikki kartani bosib solishtiring — ular bir xil sonni aytmaydi.
- Kartalar (yopiq holatda «· · ·»; bittasi ochilsa ikkinchisi yopiladi):
  - 👥 **Bugun kelganlar**: Bugun botni ochgan hamma odam. Kim birinchi marta kelganini bu son aytmaydi
  - ↩️ **Kecha ham kelganlar**: Bugun kelganlardan kecha ham kelganlari. Bu son kelganlardan oshmaydi; uni kechagi ro'yxatdan topasiz
- Ikkalasi ochilgach xulosa:
  - **Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi.**
  - Demak har kunda ikki son bo'ladi: nechta odam keldi va ulardan nechtasi qaytdi.
  - O'tgan darsda buni foizda hisoblagansiz — qaytganlar foizi. Bugun esa botingizning o'z kunlarida qaytganlarni bittalab sanaysiz.
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[826]`
- Eyebrow: Tekshiruv · kim qaytgan
- Savol: **Seshanbagi 5 odamdan 3 tasi dushanba ham kelgan. Kim qaytgan hisoblanadi?**
  - A · Seshanbada kelgan besh odamning barchasi
  - B · ✔ Dushanba ham, seshanba ham kelgan uch odam
  - C · Dushanba kelmay, seshanba kelgan ikki odam
- To'g'ri: Qaytgan degani kecha ham kelgani: uch odam ikkala kunda ham bor.
- Xato izohlari:
  - A: Besh odam seshanba kuni kelgan, lekin ularning hammasi kecha ham kelgan emas.
  - C: Bu ikki odam dushanba kelmagan — ular qaytgan emas, birinchi marta kelgan.
  - (umumiy) Qaytgan — kecha ham, bugun ham kelgan odam.
- Tugma va holat-yozuvlari (4 ta testda bir xil): Javobni tanlang → Davom etish · to'g'ri: «To'g'ri» · xato: «Qaytadan urinib ko'ring» + izoh
- Jonli darsda: ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi / Hozir to'g'ri javobni bilib olasiz. · xato bo'lsa: «To'g'ri javob: B — …» + xato izohi

## 4 · Botingizning kunlari (markaziy)  `[848]`
- Eyebrow: Amaliyot · besh kun
- Sarlavha: **Kunlarni oching va ikki qatorni birga kuzating.**
- Mentor (faqat boshida): Har ustun — botingizning bitta kuni, ostida esa o'sha kunning ikki soni.
- Panel sarlavhasi: 🤖 Botingizning kunlari · rang-kaliti: **🟩 kecha ham kelgan odam** · **⬜ birinchi marta kelgan odam** · hisoblagich «n / 5»
- Jadval: ustunlar 1-kun … 5-kun · har ustunda odam-belgilari · qatorlar **👥 Keldi** · **↩️ Qaytdi** (1-kunda «—»)
- O'ng panel (faqat oxirgi ochilgan kun ko'rinadi):
  1. **1-kun**: 9 odam keldi. Bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani ham yo'q
  2. **2-kun**: 7 odam keldi — ulardan 4 tasi kecha ham kelgan edi
  3. **3-kun**: 6 odam keldi — ulardan 4 tasi kecha ham kelgan edi
  4. **4-kun**: 23 odam keldi — ulardan 4 tasi kecha ham kelgan edi
  5. **5-kun**: 8 odam keldi — ulardan 5 tasi kecha ham kelgan edi
- Sahnadagi tugma: ▶ Keyingi kun (×3) → 📣 Kanalga e'lon berish → (4- va 5-kun o'zi ochiladi)
  - E'lon tugmasi ostida: E'lon kanalga chiqadi — ikki qatorni birga kuzating.
  - E'londan keyin: Ustunlar ketma-ket ochilmoqda.
  - E'lon bosqichida 42 soniya harakatsiz tursa: 💡 Tugmani bosing va ikki qatorni birga kuzating.
- Yakun (5 kun ochilgach):
  - **E'lon berilgan kuni 23 odam keldi — kecha 6 odam kelgan edi. Pastki qatorda esa 2-kundan beri 4, 4, 4, 5 turibdi.**
  - E'lon kelganlar sonini ko'taradi, qaytganlar soni esa deyarli o'zgarmaydi.
- Pastdagi tugma: ① Yana N kunni oching → ② E'lon tugmasini bosing → ③ Yana N kunni oching → Davom etish

## 5 · 2-savol ✅  `[975]`
- Eyebrow: Tekshiruv · ertasiga nima bo'ladi
- Savol: **Do'stingiz e'lon berdi: bir kunda 40 yangi odam keldi. Ertasiga u nimani ko'radi?**
  - A · ✔ Ozchiligi ertasiga yana keldi
  - B · Deyarli hammasi ertasiga yana keldi
  - C · Ertasiga yangi 40 odam keldi
- To'g'ri: E'lon yangi odam olib keladi, lekin ulardan ertasiga ozchiligi qaytadi.
- Xato izohlari:
  - B: Kelganlar soni ko'tarildi, qaytganlar soni esa deyarli o'zgarmadi — buni kunlar ustunida ko'rdingiz.
  - C: E'lon ertasiga takrorlanmaydi: 5-kuni kelganlar soni yana tushib qoldi.
  - (umumiy) E'lon kelganlar sonini ko'taradi, qaytganlar soni esa deyarli o'zgarmaydi.

## 6 · Duolingo (case)  `[1044]` (slaydlar `[1016]`)
- Eyebrow: ⚡ Haqiqiy voqea
- Sarlavha: **Bizning olamdan mashhur voqea**
- Mentor: bu ekranda yo'q
- Bosqichlar (yorliq «🦉 Duolingo · N / 7»):
  1. 🦉 **Duolingo — til o'rgatadigan ilova**: Uni ochganingizda birinchi ko'zga tashlanadigan narsa — ekran tepasidagi **🔥 raqam**. U sizning darslaringizni emas, boshqa narsani sanaydi.
  2. 🔮 Bashorat («🎲 Avval o'zingiz belgilab ko'ring»): **Ekran tepasidagi 🔥 raqam nimani sanaydi?**
     - 🔤 Jami yodlagan so'zlaringiz sonini
     - 📅 ✔ Ketma-ket dars qilgan kunlaringizni
     - ⏱ Ilovada o'tkazgan umumiy vaqtingizni
     - Topsa: 🎯 Topdingiz! Ketma-ket dars qilgan kunlaringizni · Adashsa: Adashdingiz — asl javob: ketma-ket dars qilgan kunlaringizni
  3. 🔥 **Raqam kunlarni sanaydi**: chizma, ikki qator («🔥 7»: yetti kun ketma-ket · «🔥 0»: 4-kun tashlangan) · chizma ostida: bitta kun tashlandi — raqam noldan boshlanadi · Matn: 🔥 raqam ketma-ket necha kun dars qilganingizni sanaydi. Kecha ham, bugun ham dars qilgan bo'lsangiz — u o'sadi. Bitta kunni tashlab ketsangiz, **yana noldan boshlanadi**.
  4. 🔮 Bashorat: **Bu raqam uzilib qolmasligi uchun ilova nima qiladi?**
     - 📚 Yangi darslar ro'yxatini ochadi
     - 🔔 ✔ Kunlik eslatma xabarini yuboradi
     - 🎁 Bepul sovg'a va ball beradi
     - Topsa: 🎯 Topdingiz! Kunlik eslatma xabarini yuboradi · Adashsa: Adashdingiz — asl javob: kunlik eslatma xabarini yuboradi
  5. 🔔 **Eslatma va «muzlatish»**: Shuning uchun ilova **har kuni eslatma yuboradi**, va bitta kunni yopib turadigan «muzlatish» ham beradi: bir kun kelolmagan odamning raqami saqlanib qoladi.
  6. 📅 **Nega aynan kun**: Demak bu raqam bitta savolga tayanadi: kecha kelgan odam bugun ham keldimi. U kunlarni sanaydi — soatlarni ham, haftalarni ham emas.
  7. Ko'prik: Duolingo'ning savoli sizning botingizda ham turadi: kecha kelgan odam bugun ham keldimi. Duolingo buni 🔥 raqami bilan sanaydi — siz esa ikki kunning ro'yxatini solishtirib sanaysiz.
- Tugmalar: Avval o'zingiz belgilang (bashorat berilguncha) · Keyingi bosqich (N/7) → Davom etish · yopiq nuqta ustida: «Avval shu bosqichni tugating»

## 7 · 3-savol ✅  `[1120]`
- Eyebrow: Tekshiruv · raqam qachon o'sadi
- Savol: **Duolingo'dagi 🔥 raqam o'sishi uchun odam nima qilishi kerak?**
  - A · Bir kunda bir nechta dars qilishi
  - B · Bir haftada bir marta dars qilishi
  - C · ✔ Kunini tashlamay dars qilishi
- To'g'ri: Bu raqam kunlarni sanaydi: kecha dars qilgan odam bugun ham qilsagina u o'sadi.
- Xato izohlari:
  - A: Raqam darslarni sanamaydi — bir kunda o'nta dars qilsangiz ham u bitta kun bo'lib qoladi.
  - B: Haftada bir marta qilsangiz kunlar uziladi va raqam yana noldan boshlanadi.
  - (umumiy) Raqam ketma-ket kunlarni sanaydi.

## 8 · Uch kun (amaliyot)  `[1154]`
- Eyebrow: Mustaqil ish · uch kun
- Sarlavha: **Botingizning uch kunini yozing.**
- Tasma (8-dars «Botingizni ishlatgan odamdan nimani so'raysiz?» yozuvlari saqlangan bo'lsa): 🎙 Eshitganingiz: … · … · …
- Mentor (birinchi son yozilguncha):
  - 8-dars yozuvlari bo'lsa: Uch odamning gapini eshitgansiz — endi nechtasi qaytganini son aytadi.
  - bo'lmasa: Botingizga odamlar kelyapti — endi nechtasi qaytganini son aytadi.
- Qadam-doiralar: 1-kun · 2-kun · 3-kun (yozilgani ✓)
- Ikki katak: «Nechta odam keldi?» · «Ulardan nechtasi kecha ham kelgan?»
- 1-kunning birinchi soni yozilgach: 1-kundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0.
- Xato yozuvlari:
  - 🤔 Bu katakka son yoziladi: nechta odam kelgan bo'lsa, shuni yozing.
  - 🤔 Qaytganlar o'sha kuni kelganlardan ko'p bo'lolmaydi — ular o'sha kelganlarning ichidan sanaladi.
- Tugma: Saqlash → (tahrirda: ✓ Yangilash) · yonida: ① Nechta odam kelganini yozing / ② Ulardan nechtasi qaytganini yozing / ② Qaytganlar kelganlardan oshmasin
- Saqlagach (4 soniya turadi): ✅ N-kun yozildi: X odam keldi, Y tasi qaytdi.
- Topshiriq kartasi: 🎯 Topshiriq · **Uch kun — har kunda ikki son** · ○/✓ Uch kun ham yozilgan · ○/✓ Har kunda ikki son bor · ○/✓ Qaytganlar kelganlardan oshmaydi
- 💡 Yordam: Kechagi ro'yxatni oching va bugungisi bilan solishtiring: **ikkalasida ham bor odamlar** — qaytganlar.
- Uch kun yozilgach jadval: 🗓 Uch kunlik hisobingiz · «N-kun · 👥 Keldi X · ↩️ Qaytdi Y» + ✎ (Tahrirlash)
- ⭐ Qo'shimcha (hisob to'lgach ochiladi): Uch kunning qaytgan sonlarini yonma-yon qo'ying: qaysi kuni eng ko'p odam qaytdi? O'sha kuni botingizda nima boshqacha bo'lganini bir qatorda yozing.
- Yakun: ✅ Uch kunlik hisobingiz yozildi — har kunda ikki son turibdi
- Pastdagi tugma: ① 1-kunning ikki sonini yozing → ② Yana N kun yozing → Davom etish

## 9 · Besh kunlik ro'yxat (tekshiruv)  `[1331]` (qatorlar `[1312]`)
- Eyebrow: Tekshiruv · besh kun
- Sarlavha: **Har qatorda qaytish kunlarini belgilang.**
- Mentor (boshida): Yashil katak — odam o'sha kuni kelgan. Chap yonidagi katak ham yashil bo'lsa, o'sha kunni bosing: bu qaytish kuni.
- Panel: 🗓 Besh kunlik ro'yxat · kalit: **🟩 odam kelgan kun** · ↩️ belgilangan qaytish kuni (birinchi belgidan keyin chiqadi) · ↩️ to'g'ri qaytish kuni (tekshiruvdan keyin chiqadi) · «n / 4»
- Jadval: 1-kun … 5-kun · qatorlar navbat bilan ochiladi:

| Odam | Kelgan kunlari (🟩) | ✔ Qaytish kunlari | Tekshiruvdan keyingi izoh |
|---|---|---|---|
| 👤 Aziz | 1, 2, 5 | 2 | 2-kun: chap yonida 1-kun ham yashil — Aziz kecha ham kelgan edi |
| 👤 Dilnoza | 2, 3, 4 | 3, 4 | 3- va 4-kun: Dilnoza uch kun ketma-ket kelgan, demak ikki qaytish kuni |
| 👤 Shohrux | 1, 3, 5 | yo'q | Shohrux kunlarini oralab kelgan — hech qaysi kunning chap yoni yashil emas |
| 👤 Malika | 3, 4, 5 | 4, 5 | 4- va 5-kun: Malika 3-kundan boshlab uzilmay kelgan |

- Tugmalar: Tekshirish · ↩︎ Bu odam qaytmagan · yonida: ① Qaytish kunlarini bosing yoki «qaytmagan»ni tanlang / ② Endi tekshiring
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · (adashgach) Nishon birinchi urinish uchun edi.
- Javob (izoh jadvaldagi qator izohi bilan birga chiqadi):
  - to'g'ri: ✅ To'g'ri.
  - «qaytmagan» bosilgan, lekin qaytish kuni bor: 🤔 Bu odam qaytgan: ikki yashil katak yonma-yon turgan kuni bor.
  - ortiqcha kun belgilangan: 🤔 Bu kunning chap yoni bo'sh — bu odam kecha kelmagan edi.
  - kam belgilangan: 🤔 Yana qaytish kuni bor — chap yoni ham yashil kunni qidiring.
- Tugma: Keyingisi ▸
- 💡 Yordam (birinchi xatodan keyin chiqadi): Bitta savol bering: shu katakning **chap yonidagi kun** ham yashilmi?
- Yakun: natija-tasma «👤 Aziz 2-kun · 👤 Dilnoza 3-kun · 4-kun · 👤 Shohrux qaytmagan · 👤 Malika 4-kun · 5-kun»
  - ✅ Besh kunda to'rt odamdan uchtasi qaytdi: jami 5 ta qaytish kuni. — Qaytish bitta katakdan emas, ikki kunning yonma-yon turishidan ko'rinadi.
- Pastdagi tugma: Yana N qatorni belgilang → Davom etish

## 10 · Koding  `[1531]` (topshiriq `[1516]`)
- Eyebrow: Koding · 🛠 kod oynasi
- Sarlavha: **Qaytganlarni sanaydigan kod yozamiz.**
- **1-bosqich (darvoza-savol):**
  - Mentor: Siz qo'lda sanagan ishni endi kod bajaradi. Sizga faqat bitta kod bo'lagini yozish qoladi.
  - Savol: 🔎 2-kuni kelganlar: Dilnoza · Shohrux · Nodira. Kecha ro'yxatda Dilnoza va Shohrux bor edi. Bu kunning qaytgani nechta?
    - 3 — bugungi ro'yxatdagi hamma odam
    - ✔ 2 — kecha ham ro'yxatda bo'lgan odam
    - 1 — kecha ro'yxatda bo'lmagan odam
  - Xato bosilsa: 🤔 Bu boshqa narsani sanaydi. Kecha ham, bugun ham ro'yxatda turgan odamlarni sanang.
- **2-bosqich:**
  - Mentor: Qatorlarda qo'lda qilgan ishingiz kodda bitta savolga aylanadi: bu odam kechagi ro'yxatda ham bormi?
  - Yig'ilgan qator: ✓ Qaytgan — kecha ham, bugun ham ro'yxatda bor odam
  - Kod nima qilsin: 1. Uch kun uchun uch yozuv qaytadi · 2. Har yozuvda kun, kelgan, qaytgan bor · 3. Birinchi kunning qaytgani 0
  - 💡 Yordam: Bitta kundan boshlang: kechagi ro'yxatni oling va bugungi har odamni undan qidiring. Birinchi kundan oldin kun yo'q — uning qaytgani 0. · ⭐ Qo'shimcha: uch kunning qaytgan sonlarini qo'shib chiqaring — shunda butun uch kunlik natijani bitta son aytib beradi.
  - O'ng karta: 🧮 Uch kun — bitta kod bo'lagi · Kompilyator — kod yoziladigan oyna: chapda kod, o'ngda natija. · Tugma: 🛠 Kompilyatorni ochish (bajarilgach: ↻ Kompilyatorni qayta ochish · Bajarildi — xohlasangiz kodni yana sayqallang)
  - Yakka rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: ✅ Uch yozuv chiqdi — kod endi qaytganlarni o'zi sanaydi
- **Kompilyator oynasi:**
  - Eyebrow: Koding · qaytganlarni sanash · Sarlavha: **app.js — hisob kod bo'lagini to'ldiring**
  - Topshiriq: Kodda tayyor kod bo'lagi turibdi, nomi — `hisob`. U har kun uchun bitta yozuv qaytarsin: `kun`, `kelgan` va `qaytgan`. Pastdagi `console.log` natijani ko'rsatadi.
  - Fayl: app.js · bo'sh fayldagi izoh: `// har kun uchun bitta yozuv tayyorlang`
  - Boshlang'ich kod `[1477]`:
    ```js
    // kunlar — botingizning uch kuni, har kuni kim kelgani
    const kunlar = [
      { kun: 1, kelganlar: ["aziz", "dilnoza", "shohrux", "malika"] },
      { kun: 2, kelganlar: ["dilnoza", "shohrux", "nodira"] },
      { kun: 3, kelganlar: ["shohrux", "nodira", "jasur", "aziz"] },
    ];

    function hisob(kunlar) {
      // Har kun uchun bitta yozuv tayyorlang: { kun, kelgan, qaytgan }.
      // qaytgan — kechagi royxatda ham bor odamlar soni.
      // Birinchi kundan oldin kun yoq: uning qaytgani 0.
      return [];
    }

    console.log(hisob(kunlar));
    // [{ kun: 1, kelgan: 4, qaytgan: 0 },
    //  { kun: 2, kelgan: 3, qaytgan: 2 },
    //  { kun: 3, kelgan: 4, qaytgan: 2 }]
    ```
  - Shartlar va o'tmasa chiqadigan xabar:
    - Uch kun uchun uch yozuv qaytadi: «Uch kunga uch yozuv kerak — bo'sh ro'yxat o'tmaydi»
    - Har yozuvda kun, kelgan, qaytgan bor: «Har yozuvda kun raqami, o'sha kuni kelganlar soni va qaytgan soni bo'lsin»
    - Birinchi kunning qaytgani 0: «Birinchi kundan oldin kun yo'q: uning qaytgani 0; qolgan kunlar kechagi ro'yxat bilan solishtiriladi»
- Pastdagi tugma: ① Qaytgan sonini belgilang → ② Kodni yozing → Davom etish

## 11 · 4-savol ✅ (yakuniy)  `[1810]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Chorshanba 15 odam keldi; ulardan 4 tasi seshanba ham kelgan edi. Nimani yozasiz?**
  - A · Chorshanba: keldi 15, qaytdi 15
  - B · ✔ Chorshanba: keldi 15, qaytdi 4
  - C · Chorshanba: keldi 4, qaytdi 15
- To'g'ri: «Qaytdi» katagiga faqat kecha ham kelganlar yoziladi: to'rt odam.
- Xato izohlari:
  - A: Kelganlarning hammasi qaytgan emas: 15 odamdan faqat 4 tasi seshanba ham kelgan edi.
  - C: Ikki sonning o'rni almashib ketdi: qaytganlar kelganlardan oshmaydi.
  - (umumiy) «Keldi» katagida o'sha kuni kelganlar, «qaytdi» katagida kecha ham kelganlar turadi.

## 12 · Mustahkamlash  `[1705]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Ikki sonni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramay javob bering: 2-kuni botingizga nechta odam keldi va ulardan nechtasi qaytdi? Avval ovoz chiqarib o'zingizga ayting, keyin bir qatorda yozing. (jonli darsda: «…Avval sherigingizga ayting…»)
- 1-qadam: 🗣 Ovoz chiqarib ayting (jonli: 🗣 Sherigingizga ayting)
  - Yakka: ▶ 30 soniyani boshlash → taymer → ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya · ⏹ To'xtatish
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi / keyin — B navbati / oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- 2-qadam: ✍️ Endi bir qator yozing · katak: «2-kuni ... odam keldi, ... tasi qaytdi»
- Yozgach:
  - ✓ Endi botingizga kelgan odamlarni sanabgina qolmaysiz — ulardan nechtasi qaytganini ham bilasiz.
  - 🎯 Bugungi qoida: qaytish ikki kunning yonma-yon turishidan ko'rinadi.
- Tugma: Davom etish

## 13 · Natijalar (podium)  `[2400]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (jonli: **Bugungi g'oliblarimiz**)
- Yakka: to'g'ri javoblar halqasi + 🏅 Nishonlar (4 ta, olinmagani 🔒) + «Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.»
- Jonli: Natijalar kelmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🥇🥈🥉 · Siz — N-o'rin (X/4 to'g'ri) · 🏆 To'liq reyting
- Tugma: Davom etish

## 14 · Takrorlash (kartochkalar)  `[1797]` (kartalar `[1785]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Qaytgan odam kim? | Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi | — |
| Bir kunda qanday ikki son bo'ladi? | Nechta odam keldi va ulardan nechtasi kecha ham kelgan edi | — |
| Qaytganlar soni kelganlardan ko'p bo'ladimi? | Yo'q — ular o'sha kelganlarning ichidan sanaladi | — |
| Qaytish nimadan ko'rinadi? | Ikki kunning yonma-yon turishidan; bitta kundan ko'rinmaydi | — |
| Birinchi kunning qaytgani nechta? | 0 — undan oldingi kun yo'q | — |
| E'lon qaysi sonni ko'taradi? | Kelganlar sonini — qaytganlar soni deyarli o'zgarmaydi | — |
| Duolingo'dagi 🔥 raqam nimani sanaydi? | Ketma-ket dars qilingan kunlarni | — |
| Bir kun dars qilinmasa, o'sha raqam nima bo'ladi? | Yana noldan boshlanadi; «muzlatish» esa bir kunni yopib turadi | — |
| Botingizning uch kunlik hisobida nima yoziladi? | Har kun uchun: kun, kelgan soni, qaytgan soni | — |
| 2-kunning qaytgan soni qayerdan olinadi? | 1-kuni kelganlardan 2-kuni yana kelganlarini sanaysiz | — |

(Bu darsda kartochkalarda izoh qatori yo'q.)
- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim · 🎉 Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Dars yakuni  `[2497]`
- Eyebrow: Dars yakuni · belgi: ✓ Dars tugadi
- Sarlavha: **Uch kunlik hisobingiz yozildi.** + to'g'ri javoblar halqasi
- CodeStrike arena tugmasi (jonli o'quvchida: ⏳ Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi.
  - Har kunda ikki son bo'ladi: nechta odam keldi va ulardan nechtasi qaytdi.
  - E'lon kelganlar sonini ko'taradi — qaytganlar soni esa deyarli o'zgarmaydi.
  - Qaytish ikki kunning yonma-yon turishidan ko'rinadi — bitta kundan emas.
- 🏅 Nishonlaringiz — N/4 (nom + tavsif, olinmagani 🔒)
- Uyga vazifa tugmasi: **Uyga vazifa** · Amaliy topshiriqni bajarish → (ichida ochiladigan topshiriq-karta `[1846]` PM uy vazifasi, topshiriq bo'yicha MD'ga kiritilmadi)
- Keyingi dars haqida matn: **yo'q** (1-dars namunasidagi «🚀 Keyingi dars — …» qatori bu darsda yo'q; keyingisi 13 Zaxira dars, 14 Demo Day)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🗓 Day Two! — Kunlarni ochib ikki sonni yonma-yon ko'rdingiz (4-ekran) · 🧮 Count Keeper! — Uch kunning hisobini yozdingiz (8-ekran) · 🔁 Two In A Row! — To'rt qatorda qaytish kunlarini belgiladingiz (9-ekran, faqat birinchi urinishda) · 🛠 Code Counter! — Qaytganlarni kod bilan sanadingiz (10-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Yangi nishon: … · bosib davom eting

**Qayta tushuntirish oynalari (RECAPS, 4)**: sarlavha «📖 Qayta tushuntirish»; oxirgi kartada «🗣️ Sinfga savol:»; tugmalar ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz:
1. (3-ekran) Qaytgan — kecha ham kelgan odam: ↩️ Qaytgan kim — Kecha kelgan odam bugun ham kelsa — **u bugun qaytgan hisoblanadi**. · 👥 Kelganlar soni nimani aytmaydi — Bugun kelganlar soni faqat bugun botni ochgan odamlarni sanaydi: kim birinchi marta kelganini bu son aytmaydi. · 🔎 Ikki kunni yonma-yon qo'ying — Kechagi ro'yxatni bugungisi bilan solishtiring: ikkalasida ham bor odamlar — qaytganlar. · Sinfga savol: Seshanbagi 5 odamdan 3 tasi dushanba ham kelgan. Kim qaytgan hisoblanadi?
2. (5-ekran) Ikki son bir yo'nalishda yurmaydi: 🔢 Har kunda ikki son — Har kunda ikki son bo'ladi: **nechta odam keldi** va **ulardan nechtasi qaytdi**. · 📣 E'lon nimani ko'taradi — E'lon kelganlar sonini ko'taradi, qaytganlar soni esa deyarli o'zgarmaydi. · 🗓 Ikkovini birga o'qing — Bitta kunning yuqori qatoriga qarab xulosa chiqarmang — pastki qator boshqa narsani aytadi. · Sinfga savol: Do'stingiz e'lon berdi: bir kunda 40 yangi odam keldi. Ertasiga u nimani ko'radi?
3. (7-ekran) Raqam kunlarni sanaydi: 🔥 Duolingo'dagi 🔥 raqam — Duolingo — chet tili o'rgatadigan ilova. Bu raqam **ketma-ket dars qilingan kunlarni** sanaydi — darslarni ham, so'zlarni ham emas. · 0️⃣ Bir kun tashlansa — Bir kun dars qilinmasa, raqam yana noldan boshlanadi; «muzlatish» esa bitta kunni yopib turadi. · 📅 Nega aynan kun — Bu raqam soat bilan ham, hafta bilan ham sanamaydi — u faqat kunlarni sanaydi. · Sinfga savol: Duolingo'dagi 🔥 raqam o'sishi uchun odam nima qilishi kerak?
4. (11-ekran) Qaytish ikki kundan ko'rinadi: 🟩 Qaytish kuni qanaqa kun — Qaytish kuni — **chap yonidagi kun ham to'lgan** kun: odam kecha ham kelgan edi. · ⚖️ Qancha bo'lishi mumkin — Qaytganlar soni o'sha kuni kelganlardan oshmaydi — ular o'sha kelganlarning ichidan sanaladi. · ✍️ Hisob-qatori — Har kun uchun bitta qator yoziladi: kun, kelgan soni, qaytgan soni. · Sinfga savol: Chorshanba 15 odam keldi; ulardan 4 tasi seshanba ham kelgan edi. Nimani yozasiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Qaytgan odam kim? ✔ Kecha ham, bugun ham kelgan odam · Bugun birinchi marta kelgan odam · Kecha kelib, bugun kelmagan odam · Kanalga e'lon bergan odam
2. Bir kunda qaysi ikki son yoziladi? Kelganlar va e'lonlar soni · Qaytganlar va yozilgan so'zlar soni · Kunlar va soatlar soni · ✔ Kelganlar va qaytganlar soni
3. Birinchi kunning qaytgani nechta? Shu kuni kelganlar soniga teng · Oldingi kundan ko'chirib olinadi · ✔ 0 — undan oldingi kun yo'q · Hisoblab bo'lmaydi, kun tashlanadi
4. Qaytganlar soni o'sha kuni kelganlardan ko'p bo'lishi mumkinmi? Ha — kecha kelganlar ham qo'shib sanaladi · ✔ Yo'q — qaytganlar shu kelganlar ichidan · Ha — kun uzun bo'lsa son oshib ketadi · Yo'q — bot ularni ikki marta sanamaydi
5. E'lon qaysi sonni ko'taradi? Ertasiga qaytganlar sonini · ✔ O'sha kuni kelganlar sonini · Ikkala sonni bir xil ko'taradi · Hech qaysi sonni ko'tarmaydi
6. Bugun 10 odam keldi, 3 tasi kecha ham kelgan — qaytgani nechta? ✔ 3 — ikkala kunda ham kelganlar · 10 — bugun kelganlarning hammasi · 7 — kecha kelmaganlar · 13 — ikki kunning yig'indisi
7. Nega bitta kunlik son yetmaydi? Chunki bir kunda kelgan odam kam bo'ladi · Chunki e'lon ikki kunda bir marta beriladi · ✔ Chunki bitta son oldingi kunni ko'rsatmaydi · Chunki bot ikki kunlik yozuvni saqlamaydi
8. Qaytish nimadan ko'rinadi? Bitta kunning yakka katagiga qarashdan · Ikki kunda kelganlar sonining o'sishidan · Botga yozilgan xabarlarning sonidan · ✔ Kecha va bugungi ro'yxatni solishtirishdan
9. Duolingo'dagi 🔥 raqam nimani sanaydi? ✔ Ketma-ket dars qilingan kunlarni · Yodlangan so'zlarning umumiy sonini · Ilovada o'tkazilgan soatlarni · Do'stlar bilan bo'lishilgan ballarni
10. Bir kun dars qilinmasa, o'sha raqam nima bo'ladi? O'sha joyida turaveradi · Bir kunga orqaga suriladi · ✔ Yana noldan boshlanadi · Sekinroq o'sishda davom etadi
11. Odam 1, 3 va 5-kunlari kelgan — nechta qaytish kuni bor? Uchta — uch kunda ham kelgani uchun · ✔ Bittasi ham yo'q — har safar oldingi kun bo'sh · Ikkita — 3-kun va 5-kun qaytish kuni · Bittasi — 5-kunning oldingi kuni to'lgan
12. Botingizning uch kunlik hisobini kim yozadi? Bot uni o'zi sanab yozib boradi · Kanalga e'lon bergan odam · Kodni yozgan dasturchi · ✔ Botni yuritayotgan odam — siz

---

## Mening dastlabki belgilarim (qonun-ro'yxatlar bo'yicha — faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«hisoblanadi» (bog'lama)**: «u bugun qaytgan hisoblanadi» / «Kim qaytgan hisoblanadi?» 2-ekran xulosasida, 3-ekran savolida, 14-ekran 1-kartasida, 15-ekran «Endi siz bilasiz» 1-bandida va RECAPS 1 da uchraydi. Lug'atda: «X Y hisoblanadi → X — bu Y» (kantselyarit).
- **Yashil rang ikki ma'noda**: 0-ekran sahnasi va 4-ekranda 🟩 = «kecha ham kelgan odam» (qaytgan), 9-ekranda esa 🟩 = «odam kelgan kun», qaytish ↩️ bilan belgilanadi. 4-ekrandan keyin o'quvchi 9-ekrandagi har yashil katakni «qaytgan» deb o'qishi mumkin.
- **Bir son uchta nom bilan**: «Kecha ham kelgan» (1-ekran jadval ustuni, 2-ekran kartasi, 8-ekran katagi «Ulardan nechtasi kecha ham kelgan?»), «↩️ Qaytdi» (4-ekran, 8-ekran jadvali, 11-ekran) va «qaytgan». 1-ekran ustunlari («Keldi / Kecha ham kelgan») 4- va 8-ekrandagi «👥 Keldi / ↩️ Qaytdi» yorlig'idan farq qiladi.
- **«Kompilyator» va «kod oynasi»**: 10-ekran eyebrow'ida «🛠 kod oynasi» deyilgan, karta va tugmada esa «Kompilyator — kod yoziladigan oyna», «🛠 Kompilyatorni ochish». Lug'atda: kompilyator (kod oynasi ma'nosida) → «kod oynasi» (KATTA_TOZALASH F-0929-19).
- **«sessiya»**: 13-ekran, jonli darsda: «Bu sessiyaga hali hech kim qo'shilmagan.» Lug'atda: sessiya → dars.
- **Arena 12-savol ikki ma'noli**: «Botingizning uch kunlik hisobini kim yozadi?» savolida ✔ javob «siz». Lekin 10-ekranda «kod endi qaytganlarni o'zi sanaydi» deyilgan va kodni o'quvchining o'zi yozgan. Shuning uchun «Bot uni o'zi sanab yozib boradi» va «Kodni yozgan dasturchi» variantlari ham to'g'ri tuyulishi mumkin.
- **Arena 4-savol**: ikki variant «Yo'q —» bilan boshlanadi (✔ «Yo'q — qaytganlar shu kelganlar ichidan» va «Yo'q — bot ularni ikki marta sanamaydi»). Javobning o'zi ikkalasida to'g'ri, faqat sababi farq qiladi.
- **Kod izohida apostrofsiz so'zlar**: 10-ekran boshlang'ich kodida «kechagi royxatda» va «kun yoq» deb yozilgan. O'quvchi buni ko'radi; ASCII ataylab qilingan, lekin «yoq» boshqa so'z bo'lib o'qiladi.

Tekshirildi, muammo topilmadi: 2-ekrandagi «O'tgan darsda … qaytganlar foizi» gapi yangi tartibga mos (11-dars `src/pm/PmMetricsLesson.jsx` da «Qaytganlar foizi» bor). O'quvchi matnida modul raqami va ichki kod yo'q. Test izohlari (explainWrong) o'z variantiga bog'langan, `INLINE_KEYS` (s3:1 · s5:0 · s7:2 · s11:1) `correctIdx` bilan mos. Dars sarlavhasi App.jsx nomi bilan bir xil. Arena kalitlari 3/3/3/3.
