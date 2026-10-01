# 5-Modul (LMS: 7-Modul) · 8-dars «Botingizni ishlatgan odamdan nimani so'raysiz?» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/PmLesson20.jsx` · 16 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** o'quvchi botini yonidagi odamga ko'rsatgan. U ikki javobdan birini tanlaydi: odam «Zo'r ekan» deydi yoki bir-ikki kamchilik aytadi. Qaysi birini tanlamasin, bir xil xulosa chiqadi: ikkalasi ham fikr, odam o'zi nima qilganini aytmadi, shuning uchun botga nima qo'shish kerakligi bilinmaydi.
- **Markaziy o'yin:** «Suhbat stoli» (4-ekran). O'quvchi stol ortidagi suhbatdoshga to'rt savolni birma-bir beradi va javobni eshitadi. Keyin 3-javobdan varaqqa qaysi qator tushishini tanlaydi. Shundan keyin «savol-elak» keladi (9-ekran): to'rt savolni to'siqlarga ajratadi.
- **Asosiy metafora:** suhbat varag'i (savol → eshitgan javob) · «stol ortida» va «odamning oldida» · savol-elak va uning to'siqlari. Biznes misoli: Airbnb asoschilari Nyu-Yorkda uy-ma-uy yurgani.
- **Yakun:** o'quvchi o'z uchta savolini odamga beradi va javobini yozib oladi (8), suhbat varag'ini kod bilan chiqaradi (10). Dars «Javob sizda emas: uni botingizni ishlatgan odam biladi» degan asosiy fikr, arena va uy vazifasi bilan tugaydi.

---

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — botingiz | hook | odam nima deyishini tanlaydi (2 variant) → ikkalasi ham fikr | — |
| 1 | Maqsad | qoida | «Suhbat varag'i»: 3 savol → 3 javob qatori o'zi yozilib chiqadi | — |
| 2 | Ikki yo'l | tushuncha | «Stol ortida» / «Odamning oldida» kartalarini ochadi → «suhbat» ta'rifi | — |
| 3 | 1-savol | test | «Zo'r ekan» gapidan nima bilinadi | ✅ |
| 4 | Suhbat stoli | markaziy o'yin | 4 savolni beradi, javoblarni eshitadi → varaqqa tushadigan qatorni tanlaydi | — (nishon) |
| 5 | 2-savol | test | «Kelasi haftadan…» savoliga javob qanday bo'ladi | ✅ |
| 6 | Biznes olamidan · Airbnb | case | 7 bosqich, ikkita bashorat | — |
| 7 | 3-savol | test | asoschilar uy egalarining oldida nimani bilib oldi | ✅ |
| 8 | Uch savol | praktika | o'z 3 savolini yozadi, odamga beradi, eshitgan javobini yozib oladi | — (nishon) |
| 9 | Savol-elak | tekshiruv-amaliyot | 4 savolni to'siqlarga ajratadi | — (nishon) |
| 10 | Koding · VS Code | koding | kod haqidagi savolga javob beradi → `suhbat.js` yozadi | — (nishon) |
| 11 | 4-savol | test (yakuniy) | suhbatdosh gapidan varaqqa qaysi qator tushadi | ✅ (final) |
| 12 | Mustahkamlash | refleksiya | savollarini yoddan aytadi (taymer) + bir qator yozadi | — |
| 13 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Yakun | xulosa | asosiy fikr, arena, 4 xulosa, nishonlar, uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (3, 5, 7, 11-ekran testlari uchun); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
suhbat · suhbatdosh · stol ortida / odamning oldida · maqtov gapi · fikr · bo'lib o'tgan ish · hali bo'lmagan ish · va'da ·
voqea savoli · bo'sh savol · eshitgan javob · odamning o'z gapi («o'z so'zi bilan») · xulosa · umumiy gap («hammaga yoyish») ·
suhbat varag'i (varaq) · varaqqa tushadi · savol-elak · to'siq («Ish hali bo'lmagan» · «Javob savolning ichida» · «O'tdi — varaqqa») · uy-ma-uy

---

## 0 · Kirish — botingiz  `[672]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Botingizni ko'rsatsangiz, u nima deydi?**
- Mentor: Botingizni yoningizdagi odamga ko'rsatdingiz.
- Tanlov (2 ta, teng):
  - 🙂 «Zo'r ekan» deydi — meni xafa qilgisi kelmaydi
  - 🤔 Bir-ikki kamchilik aytadi — to'g'risini aytadi
- Tanlovdan keyin (ikkalasida bir xil): stol ortidagi odam paneli — 👤 {suhbatdosh nomi} 💬 · · · (nom = 2-darsda yozilgan ro'yxatdagi birinchi odam; ro'yxat bo'lmasa «sinfdosh»)
- Matn: Ikkalasi ham bo'ladi. Lekin ikkala javob ham fikr — odam o'zi nima qilganini aytmadi, shuning uchun botga nima qo'shish kerakligi bilinmaydi. Bugun undan nimani so'rasangiz javobi ish berishini ko'rasiz.
- Jonli darsda: sinf ovozi diagrammasi (ikki variant · foiz)
- Tugma: Bittasini tanlang → Davom etish
- Mentorga eslatma (faqat mentor ekranida): Ovozlar bo'linadi — ikkalasi ham halol javob. «Nima qo'shish kerakligi bilinmaydi» degan joyda to'xtang: bugungi dars aynan shu bo'shliqni to'ldiradi. Qanday so'rash kerakligini oldindan aytmang.

## 1 · Maqsad  `[752]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun uch savol va uch javobdan varaq tuzasiz.**
- Mentor: Javoblarni odamning o'zidan eshitasiz.
- Namuna (qatorlar o'zi yozilib chiqadi): 📄 Suhbat varag'i
  - 🗣️ 1-savol → odamning javobi ✅
  - 🗣️ 2-savol → odamning javobi ✅
  - 🗣️ 3-savol → odamning javobi ✅
- Tugmalar: Orqaga · Boshlaymiz →
- Mentorga eslatma: Varaq yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

## 2 · Ikki yo'l  `[780]`
- Eyebrow: Muhokama · ikki yo'l
- Sarlavha: **Botingizga nima kerakligini kim biladi?**
- Mentor: Ikki kartani bosib solishtiring.
- Kartalar (bosilmaguncha «· · ·»; qayta bosilsa yopiladi):
  - 💭 **Stol ortida** — Botga qanday tugma kerakligini o'zingiz o'ylab topasiz. Tugma tayyor bo'ladi, lekin uni hech kim bosmaydi
  - 🚶 **Odamning oldida** — Botni ishlatgan odamdan o'tgan hafta nima qilganini so'raysiz. Javobida kun ham, qilingan ish ham chiqadi
- Xulosa (ikkala karta ko'rilgach, kartalar o'rniga chiqadi): **Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat deyiladi.** Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz.
- Tugmalar: 👆 Yana N kartani oching → Davom etish · ◂ Kartalarga qaytish

## 3 · 1-savol ✅  `[835]`
- Eyebrow: Tekshiruv · maqtov gapi
- Savol: **Sinfdoshingiz botingizni ko'rib «Zo'r ekan» dedi. Bundan nimani bilib oldingiz?**
  - A — Bot unga yoqqanini — endi shu yo'ldan ketaverasiz
  - B — ✔ Hech narsani — u qilgan biror ishini aytmadi
  - C — Botni ishlatib ko'rganini — shuning uchun maqtadi
- To'g'ri: Maqtov gapida odamning o'zi qilgan biror ish yo'q.
- Xato izohlari:
  - A: Maqtov gapidan botga nima qo'shish kerakligi bilinmaydi — u qilgan ishini aytmadi.
  - C: U botni ishlatganini aytmadi: maqtov gapida qilingan ish yo'q.
  - (umumiy) Maqtov gapida odamning o'zi qilgan biror ish yo'q.
- Barcha testlarda bir xil yozuvlar: Javobni tanlang · To'g'ri · Qaytadan urinib ko'ring · jonli darsda: ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: X — …

## 4 · Suhbat stoli (markaziy o'yin)  `[868]`
- Eyebrow: Suhbat stoli
- Sarlavha: **Savolni tanlang va javobni eshiting.**
- Mentor (1–2-bosqichda): Stol ortida suhbatdosh o'tiribdi — unga to'rt savoldan birini bering.
- **1-bosqich — so'rash.** Chapda savol-kartalari (berilgan savol ro'yxatdan chiqadi), o'ngda stol: 🪑 Stol · Berilgan savol · n/4 · 👤 {suhbatdosh nomi}. Javob pufakda yozilib chiqadi, ostida «nima bilindi» qatori:
  1. «Botim yoqdimi?» → «Ha, zo'r ekan!» → Hech narsa bilinmadi — u qilgan biror ishini aytmadi
  2. «Botga eslatma tugmasi qo'shsam, ishlatasizmi?» → «Ha, ishlataman.» → Bu hali qilinmagan ish — javobi va'da bo'ldi
  3. «Uy vazifasini oxirgi marta qachon unutgansiz?» → «O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.» → ✅ Payshanba kuni ham, o'sha kuni bo'lgan ish ham aytildi
  4. «O'sha kuni vazifani qanday topdingiz?» → «Guruhdagi xabarlarni yuqoriga surib qidirdim, o'n daqiqa ketdi.» → ✅ Vazifani hozir qanday topayotgani ko'rindi
- 45 soniyadan keyin maslahat: 🤔 Qolgan savollarni ham bering — javoblarni solishtiring.
- **2-bosqich — bilinganlar:** to'rtala «nima bilindi» qatori birga turadi · 🪑 Stol · Berilgan savol · 4/4 · tugma «Keyingisi ▸»
- **3-bosqich — yozuv:** ✓ To'rt savol berildi · 💬 «O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.»
  - **Shu javobdan varaqqa qaysi qator tushadi?**
  - Sinfdoshlarim vazifani ko'p unutadi → 🤔 Buni u aytmadi — bitta odam aytgan gapni hammaga yoydingiz
  - ✔ Payshanba kuni vazifani unutgan — kechqurun yozilgan ekan → ✅ Aynan shu — odamning o'z gapi
  - Botga eslatma tugmasi kerak → 🤔 Bu sizning xulosangiz — u tugma haqida hech narsa demadi
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (birinchi urinish xato bo'lsa) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- **4-bosqich — xulosa** (to'g'ri qatordan 2,5 soniya keyin): **Bo'lib o'tgan ishni so'ragan savol — voqea savoli.** Uning javobida kun ham, qilingan ish ham bo'ladi. Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol. Odam aytgan gapni o'z so'zi bilan yozib qo'ysangiz — bu eshitgan javob. Varaqqa sizning xulosangiz emas, o'sha eshitgan javob tushadi.
- Tugma: ① Savol-kartasini bosing / ① Yana N savol bering → ② Bilingan qatorlarni o'qing → ③ Varaqqa tushadigan qatorni tanlang → Davom etish
- Jonli darsda: 👥 Sinfda: N bajardi · ✏️ N hali bajarmoqda · (mentorda) 🗣 To'rt savolni bergani — n/N
- Mentorga eslatma: Bolalar odatda 1-savoldan boshlaydi va «ha, zo'r» javobiga kuladi. To'rttasi ham berilgach so'rang: qaysi ikki javobdan payshanba kuni chiqdi? Farqni shu yerda ular aytsin, siz aytmang. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 5 · 2-savol ✅  `[1016]`
- Eyebrow: Tekshiruv · javob turi
- Savol: **⏳ «Kelasi haftadan botni ishlatasizmi?» — bu savolga javob qanday bo'ladi?**
  - A — ✔ Hali qilmagan ishi haqida va'da bo'ladi
  - B — O'tgan haftada qilgan ishi haqida gap bo'ladi
  - C — Botni ochgan aniq kun va soat bo'ladi
- To'g'ri: Hali bo'lmagan ish haqida odam faqat va'da bera oladi.
- Xato izohlari:
  - B: Savol kelasi haftani so'rayapti — o'tgan haftada qilgan ishi bu javobdan chiqmaydi.
  - C: Bunday savolga odam kun ham, soat ham aytmaydi: u faqat va'da beradi.
  - (umumiy) Hali bo'lmagan ish haqida odam faqat va'da bera oladi.

## 6 · Biznes olamidan · Airbnb (case)  `[1062]`
- Eyebrow: 🏠 Biznes olamidan (har bosqichda: «🏠 Biznes olamidan · n / 7»)
- Sarlavha: **Airbnb asoschilari javobni qayerdan topdi?**
- Mentor: — (bu ekranda Mentor gapi yo'q)
- Bosqichlar:
  1. 🏠 **2007-yil. San-Frantsiskoda katta yig'in bo'ldi, mehmonxonalarda joy qolmadi** — Shunda Airbnb'ni boshlagan odamlar — asoschilar — o'z uyiga uchta havo to'shagi qo'yib, kelganlarga joy berishdi. Kompaniya shundan boshlandi.
  2. Bashorat — «🎲 Avval o'zingiz belgilab ko'ring»: **Saytga yangi odamlar qo'shilmay qolganda asoschilar nima qildi?**
     - 🖱 Saytga yangi tugma qo'shdi · ✉️ Uy egalariga xat yozdi · ✔ ✈️ Nyu-Yorkka jo'nab ketdi
     - Topsa: 🎯 Topdingiz! Nyu-Yorkka jo'nab ketdi · Adashsa: Adashdingiz — asl javob: Nyu-Yorkka jo'nab ketdi
  3. 📉 **Keyinroq o'sish to'xtadi** — Saytga yangi odamlar qo'shilmay qo'ydi. Asoschilar javobni izlab Nyu-Yorkka jo'nashdi.
  4. 🚪 **Nyu-Yorkda uy-ma-uy yurishdi** — Uy egalarining oldiga kirib, uylarni o'zlari suratga olishdi.
  5. Bashorat: **Uylarni ko'rib ular nimani topdi?**
     - 💸 Uy egalari narxni oshirgan · ✔ 📷 Suratlar yomon chiqqan · 🐌 Sayt sekin ochilib qolgan
     - Topsa: 🎯 Topdingiz! Suratlar yomon chiqqan · Adashsa: Adashdingiz — asl javob: suratlar yomon chiqqan
  6. 📸 **Shunda ma'lum bo'ldi** — Suratlari yomon chiqqan uyga hech kim kelmas ekan — odamlar bunday uyni band qilmaydi. Buni ular uy egalarining yonida turib topishdi.
  7. 🌉 (ko'prik) — Javob ularning stolida emas, uy egalarining yonida turgan edi. Sizning botingiz ham shunday: javob sizda emas, uni ishlatgan odamda. Endi shu odamga beradigan uchta savolni o'zingiz yozasiz.
- Tugmalar: Avval o'zingiz belgilang · Keyingi bosqich (n/7) → Davom etish · nuqtalar ustida: Avval shu bosqichni tugating
- Mentorga eslatma: Bolalar «nega o'zlari surat olgan, suratchi yollashsa bo'lmasmidi?» deb so'raydi. Javob berib qo'ymang — so'rang: suratchi yuborilsa, asoschilar uy egasining gapini eshitarmidi?

## 7 · 3-savol ✅  `[1126]`
- Eyebrow: Tekshiruv · uy egalarining oldida
- Savol: **Airbnb asoschilari uy egalarining oldiga borib nimani bilib oldi?**
  - A — Uy egalari narxni juda baland qo'yib yuborganini
  - B — Uy egalari saytga kam kirib turishini
  - C — ✔ Yomon surat qo'yilgan uy band qilinmasligini
- To'g'ri: Buni ular uzoqdan emas, uy egalarining yonida turib bilishdi.
- Xato izohlari:
  - A: Narx haqida hech narsa chiqmagan: ular uylarning suratlarini ko'rishdi.
  - B: Uy egalari saytga qancha kirishi emas — yomon surat band qilishni to'xtatayotgani ma'lum bo'ldi.
  - (umumiy) Yomon surat qo'yilgan uy band qilinmas ekan — buni ular joyida bilishdi.

## 8 · Uch savol (praktika)  `[1152]`
- Eyebrow: Mustaqil ish · uch savol
- Sarlavha: **Uchta savolingizni yozing.**
- Lenta (2-darsda odamlar yozilgan bo'lsa): 👥 Siz yozgan odamlar: {1-odam} · {2-odam} · {3-odam}
- Mentor: (ro'yxat bo'lsa) Ro'yxatdan bitta odamni tanlang — uchta savolni o'shanga berasiz. / (ro'yxat bo'lmasa) Yoningizdagi odamlardan birini tanlang — uchta savolni o'shanga berasiz.
- Qadam doiralari: 1-savol · 2-savol · 3-savol
- **1-qadam:** maydon «Nimani so'raysiz?» → tugma 🗣 Savolni o'qib bering
  - kelajak haqidagi savol bo'lsa: 🤔 Bu ish hali bo'lmagan — javobi va'da bo'ladi. Allaqachon bo'lgan kunni so'rang.
  - «-mi» bilan tugagan, javobi «ha» bo'ladigan savol bo'lsa: 🤔 Bunga odam «ha» deb qo'ya qoladi. Bo'lib o'tgan ishni so'rang: oxirgi marta qachon?
- **2-qadam:** savol o'qish holatida turadi (✎ Tahrirlash) · maydon «U nima dedi?»
  - xulosa so'zi bo'lsa (kerak, muhim, qulay…): 🤔 Bu sizning xulosangiz. Odam aytgan gapni o'z so'zi bilan yozing.
  - hammasi joyida bo'lsa: ✅ Savolingiz bo'lib o'tgan ishni so'radi, javobda odamning o'z gapi turibdi.
  - Tugma: ✓ Saqlash / ✓ Yangilash · yetishmasa yonida: savol yozilmagan · savol hali berilmagan · eshitgan javob yozilmagan
- Uchtasi tayyor bo'lgach: 📄 Suhbat varag'ingiz — «1 {savol} → «{eshitgan}» ✎» (×3) · ✅ Uch savolingiz varaqda
- O'ng panel — 🎯 Topshiriq: 🗣 1-savol va eshitgan javob · 🗣 2-savol va eshitgan javob · 🗣 3-savol va eshitgan javob
  - Shartlar (○ → ✓): Uch savol yozilgan · Savol bo'lib o'tgan ishni so'raydi · Har javob odamning o'z gapi
- 💡 Yordam: Savolingizni «Oxirgi marta qachon …?» yoki «O'sha kuni qanday qildingiz?» deb boshlang. · Bu ish allaqachon bo'lganmi? Bu gapni odam aytdimi, siz chiqardingizmi?
- ⭐ Qo'shimcha: Uch javobingizni qayta o'qing: ikkitasida bir xil narsa takrorlanganmi? Topganingizni ovoz chiqarib ayting.
- Tugma: ① Birinchi savolingizni yozing / ② Yana N savol qoldi → Davom etish
- Jonli darsda (mentorda): ✍️ Uch javobni yozganlar — n/N
- Mentorga eslatma: «Yoqdimi?», «Kerakmi?» kabi savollar ko'p chiqadi — eng foydali xato. Javob-qatori uni tutadi; siz 1-savol javobini eslating: «Ha, zo'r ekan». Juftlik almashinuvini o'zingiz boshqaring — har o'quvchiga 3 daqiqadan. Baholash-mezoni: uch savol bo'lib o'tgan ishni so'raydi · har javobda odamning o'z gapi bor. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 9 · Savol-elak  `[1343]`
- Eyebrow: Tekshiruv · savol-elak
- Sarlavha: **Har savolni elakdan o'tkazing.**
- Mentor: To'rt yangi savolning har birini ushlab qolgan to'siqni tanlang. Hech biri ushlamasa — «O'tdi».
- Karta: 🕳️ Elakdagi savol · n / 4
- To'siq-tugmalari: ⏳ Ish hali bo'lmagan · 🗣️ Javob savolning ichida · ⬇️ O'tdi — varaqqa
- Savollar (✔ to'g'ri yo'l → sabab):
  1. Botni oxirgi marta qachon ochgansiz? — ✔ O'tdi — varaqqa → Bo'lib o'tgan kun so'raldi — odam kunni o'zi aytadi
  2. Botga o'yin qo'shsam, ko'proq ishlatasizmi? — ✔ Ish hali bo'lmagan → Bu o'yin hali qo'shilmagan — javobi va'da bo'ladi
  3. Guruhda vazifani topish qiyin, shundaymi? — ✔ Javob savolning ichida → Javob savolda yozib qo'yilgan — odam «ha» deb qo'ya qoladi
  4. O'sha kuni vazifani qanday topdingiz? — ✔ O'tdi — varaqqa → Bo'lib o'tgan ish so'raldi — odam qadamlarini o'zi aytadi
- To'g'ri tanlansa: ✅ {sabab}. Xato tanlansa: to'g'ri yo'lni aytuvchi qator + 📄 {sabab}:
  - (to'g'risi «O'tdi») 🤔 Hech bir to'siq ushlamadi — savol varaqqa tushdi
  - (to'g'risi «Ish hali bo'lmagan») 🤔 Ish hali bo'lmagan — savol shu to'siqda qoldi
  - (to'g'risi «Javob savolning ichida») 🤔 Javobi savolning ichida — savol shu to'siqda qoldi
- Tugma: Keyingisi ▸
- 💡 Yordam (faqat birinchi xatodan keyin chiqadi): Savol so'ragan ish hali bo'lmagan bo'lsa — elak uni ushlab qoladi. · Javobni savolning o'zi aytib tursa, odam faqat «ha» deydi — elak uni ham ushlaydi.
- Yakun lentasi: 1 ⬇️ varaqqa · 2 ⏳ to'siqda · 3 🗣 to'siqda · 4 ⬇️ varaqqa
  - ✅ Elakdan faqat bo'lib o'tgan ishni so'ragan savol o'tadi — qolgan savollarga odam bir og'iz «ha» deb qo'ya qoladi
- Tugma: ① Birinchi savolni elakka tashlang / ② Yana N savol qoldi → Davom etish
- Jonli darsda (mentorda): 🕳 To'rt savolni o'tkazganlar — n/N
- Mentorga eslatma: Eng ko'p adashiladigan joy — 3-savol: «vazifa topish qiyin, bu to'g'ri aytilgan». Ikkinchi savolni eslating: javobni savolning o'zi aytib turibdimi? Ha — demak odam faqat «ha» deydi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 10 · Koding · VS Code  `[1508]`
- Eyebrow: Koding · ⌨️ VS Code
- Sarlavha: **Suhbat varag'ini chiqaradigan kod yozamiz.**
- **1-bosqich (kod haqida savol):**
  - Mentor: Avval bitta savol — keyin kod yoziladi.
  - 🔎 Kod `javoblar[0].savol` ni chiqarsa, terminalda nima ko'rinadi?
    - ✔ Birinchi yozuvdagi savol matni · Uchala yozuvdagi savollar ketma-ket · Birinchi yozuvdagi javob matni
  - Xato bosilsa (tugma silkinadi) va maslahat: 🤔 Ikki bo'lakni alohida o'qing: **javoblar[0]** — birinchi yozuv, **.savol** — o'sha yozuvning savol bo'lagi.
- **2-bosqich (kod yozish):**
  - Mentor: Uch javobingiz endi kodda turadi. Siz bitta takrorlash-sikli va bitta if-sharti yozasiz.
  - ✓ javoblar[0].savol — birinchi savol matni
  - Kod nima chiqarsin: 1) `node suhbat.js` uch qatorni chiqaradi · 2) Har qatorda savol va javobi · 3) Qisqa javobga belgi qo'yildi
  - 💡 Yordam:
    - Kodni **node** buyrug'i bilan ilgari ham yurgizgansiz — pastdagi qora oynaga **node suhbat.js** deb yozasiz.
    - Avval bitta qatorni chiqarib ko'ring: **javoblar[0].savol**. Ishlagach siklni, keyin **if** ni qo'shing.
    - Javob matnini doim qo'shtirnoq ichida yozing: bitta tirnoq ichidagi apostrof kodni sindiradi.
    - ⭐ Qo'shimcha: qisqa javoblarni sanab boring va oxirida bitta qatorda chiqaring: «n ta javob qisqa».
  - Tugma: ✅ Yozdim — uch qator chiqdi → ✓ Bajarildi · (mustaqil rejimda) ✓ Bu mashqni sinfda bajarganman — davom etish →
  - VS Code oynasi: ⌨️ suhbat.js · 🔒 qo'lda yoziladi (sichqoncha ustida: «Kod nusxalanmaydi — o'zingiz terib yozasiz») · terminal: `$ node suhbat.js`
  - Boshlang'ich kod:
    ```js
    // suhbat.js — suhbat varag'i
    const javoblar = [
      { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?",
        eshitgan: "O'tgan payshanba, ertalab guruhni ochsam yozilgan ekan" },
      { savol: "", eshitgan: "" },
      { savol: "", eshitgan: "" },
    ];

    for (let i = 0; i < javoblar.length; i++) {
      const j = javoblar[i];

      // 1) har qatorni chiqaring:
      //    console.log((i + 1) + ") " + j.savol + "  ->  " + j.eshitgan);
      // 2) j.eshitgan.length 25 dan kichik bo'lsa, yana bir qator chiqaring:
      //    "   qisqa javob — bo'lib o'tgan ish ko'rinmayapti"
    }
    ```
- Tugma: 🔒 Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish
- Jonli darsda (mentorda): ⌨️ Kodni yozib bo'lganlar — n/N
- Mentorga eslatma: Javoblari hali to'liq yozilmagan bolalar boshlang'ich koddagi namuna qatorni qoldiradi — kod baribir ishlaydi. Javob matnini doim qo'shtirnoq ichida yozishni ayting. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 11 · 4-savol ✅ (final)  `[1773]`
- Eyebrow: Yakuniy tekshiruv
- Iqtibos: 💬 Suhbatdosh: «Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim.»
- Savol: **Qaysi qator varaqqa tushadi?**
  - A — Botning tugmalarini qayta joylash kerak
  - B — ✔ Kecha tugmani topolmay chiqib ketgan
  - C — Odamlar kecha tugmani topa olmadi
- To'g'ri: Varaqqa odamning o'z gapi tushadi; nima qilish kerakligini keyin o'zingiz hal qilasiz.
- Xato izohlari:
  - A: Bu sizning xulosangiz — u tugmalarni qayta joylash haqida hech narsa demadi.
  - C: U o'zi haqida gapirdi: bitta odam aytgan gap hammaga yoyilmaydi.
  - (umumiy) Varaqqa odamning o'z gapi tushadi.
- Bu ekranda Mentor gapi ham, maslahat ham yo'q.

## 12 · Mustahkamlash (refleksiya)  `[1667]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Uchta savolingizni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramasdan ayting: qaysi savolingizdan eng aniq javob keldi va o'sha javobda nima bor edi?
- **1-qadam:** 🗣 (mustaqil rejimda) Ovoz chiqarib o'zingizga ayting: savol va javob / (jonli darsda) Sherigingizga ayting: savol va javob
  - Mustaqil rejim taymeri (30 s): ▶ 30 soniyani boshlash · Hozir ovoz chiqarib ayting · ekranga qaramasdan · ⏹ To'xtatish · ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli dars taymeri (1 daqiqa): Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi · keyin — B navbati · oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- **2-qadam:** ✍️ Endi bir qator yozing · maydon «Eng aniq javob ... savolimdan keldi, unda ...»
- Yozib bo'lgach: ✓ Endi siz odam nima deydi deb o'ylab o'tirmaysiz — borib so'raysiz. · 🎯 Bugungi qoida: bo'lib o'tgan ishni so'rang, eshitganingizni o'z so'zi bilan yozing
- Tugma: Davom etish
- Mentorga eslatma: Uchdan biri «javobda nima bor edi» savoliga javob berolmasa — suhbat stoli ekranini qayta oching va 3-savol javobini birga o'qing.

## 13 · Natijalar (podium)  `[2360]`
- Sarlavha: **Bugungi natijangiz** (mustaqil rejim) / **Bugungi g'oliblarimiz** (jonli dars) · Eyebrow: Natijalar
- Mustaqil rejim: ball halqasi «n/4 to'g'ri javob» · 🏅 Nishonlar · «Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalar ro'yxati va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.»
- Jonli dars: Natijalar yuklanmoqda… · Bu darsga hali hech kim qo'shilmagan. · 🥇🥈🥉 · Siz — N-o'rin (n/4 to'g'ri) · 🏆 Natijalar ro'yxati
- Mentorga eslatma: G'oliblarni nomlab tabriklang — arena yakun sahifasida ochiladi.

## 14 · Takrorlash (kartochkalar)  `[1761]` (kartalar `[1749]`)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Suhbat nima? | Odamning oldiga borib, bo'lib o'tgan ishini so'rash | — |
| Voqea savoli nima? | Bo'lib o'tgan ishni so'ragan savol | — |
| Bo'sh savol nima? | Javobidan bo'lib o'tgan ish bilinmaydigan savol | — |
| Voqea savoliga javobda nima bo'ladi? | Kun, joy yoki qilingan ish | — |
| «Botim yoqdimi?» — qanday savol? | Bo'sh savol: javobida qilingan ish qolmaydi | — |
| Hali qilinmagan ish haqida so'rasangiz, javob qanday bo'ladi? | Va'da bo'ladi — bunday ish hali bo'lmagan | — |
| Varaqqa nima yoziladi? | Odam aytgan gap, uning o'z so'zi bilan | — |
| Varaqqa nima yozilmaydi? | Sizning xulosangiz va bitta odamning gapidan chiqarilgan umumiy gap | — |
| Airbnb asoschilari uy egalarining oldida nimani bilib oldi? | Yomon surat qo'yilgan uy band qilinmasligini | — |
| Suhbatni kimdan boshlaysiz? | Botingizni ishlatgan odamdan: sinfdosh, to'garakdosh yoki qo'shni | — |

- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim · 🎉 Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Yakun  `[2456]`
- Eyebrow: Dars yakuni · belgi: ✓ Dars tugadi
- Sarlavha: **Uchta savol berdingiz va eshitganingizni yozdingiz.** (yonida ball halqasi «n/4 to'g'ri javob»)
- Bugungi asosiy fikr — Javob sizda emas: uni botingizni ishlatgan odam biladi.
- CODE STRIKE arena tugmasi: 12 SAVOL · 15 SONIYA · 🏆 PODIUM · (jonli darsda mentor boshlamaguncha) ⏳ Mentorni kuting
- ✓ Endi siz bilasiz:
  - Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat.
  - Bo'lib o'tgan ishni so'ragan savol — voqea savoli.
  - Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol.
  - Varaqqa odamning o'z gapi tushadi, sizning xulosangiz emas.
- 🏅 Nishonlaringiz — n/4 (olinmaganlari 🔒)
- Uyga vazifa · Amaliy topshiriqni bajarish → (uyga vazifa ichi bu MD'ga kiritilmadi — PM darsi)
- Keyingi dars haqida gap yo'q.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓ · (jonli) ⏳ Mentorni kuting
- Mentorga eslatma: Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Tekshirishda bitta savolga qarang: yozilgan javobda odamning o'z gapi turibdimi — kun, joy yoki qilingan ish bormi?

---

## Qo'shimcha matnlar

**Nishonlar (4):** 👂 Good Listener! — To'rt javobni oxirigacha eshitdingiz (4-ekran) · 📝 Note Taker! — Uch savol va uch javobni yozdingiz (8-ekran) · 🚧 Sharp Sifter! — To'rt savolning to'sig'ini tanladingiz (9-ekran) · 📄 Sheet Maker! — Suhbat varag'ini kod bilan chiqardingiz (10-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · bosib davom eting · yuqorida hisoblagich «🏅 Nishonlar — n/4»

**Qisqa takrorlash oynalari (4)** — «📖 Qayta tushuntirish», mentor jonli natijani ochgach chiqadigan tugma orqali; har birida 3 karta + «🗣️ Sinfga savol»:
1. (3-ekran) Javob odamning oldida: 🗣️ Suhbat nima — Odamning oldiga borib, **bo'lib o'tgan ishini so'rash** — suhbat. Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz. · 💭 Stol ortida — Stol ortida o'ylab topilgan javobni hech kim tasdiqlamaydi: tugmani qo'shasiz, lekin uni **hech kim bosmaydi**. · 🙋 Maqtov gapi — «Zo'r ekan» degan gapda odamning **o'zi qilgan biror ishi** yo'q — undan botga nima qo'shish kerakligi bilinmaydi. · Sinfga savol: Botingizni oxirgi marta kimga ko'rsatgandingiz?
2. (5-ekran) Bo'lib o'tgan ishni so'rang: 📅 Voqea savoli — Bo'lib o'tgan ishni so'ragan savol — **voqea savoli**. Uning javobida kun ham, qilingan ish ham bo'ladi. · ⏳ Hali bo'lmagan ish — Hali qilinmagan ish haqida odam faqat **va'da** beradi: «ha, ishlataman» — bundan hech narsa bilinmaydi. · 🕳️ Bo'sh savol — Javobidan bo'lib o'tgan ish bilinmaydigan savol — **bo'sh savol**. · Sinfga savol: «Botim yoqdimi?» degan savolga sinfdoshingiz nima deydi?
3. (7-ekran) Javob odamning yonida topiladi: ✈️ Nyu-Yorkka borishdi — O'sish to'xtaganda Airbnb (begonaning uyida ijaraga turish xizmati) asoschilari javobni izlab Nyu-Yorkka jo'nashdi va u yerda **uy-ma-uy** yurishdi. · 📸 Nimani topishdi — Yomon surat qo'yilgan uyni **hech kim band qilmas ekan** — buni ular uy egalarining yonida turib bilishdi. · 🚶 Nega borishdi — Javob ularning stolida emas, **uy egalarining yonida** turgan edi. · Sinfga savol: Botingizni ishlatgan odam yoningizda o'tiribdimi?
4. (11-ekran) Eshitganingizni yozing: 📄 Varaqqa nima tushadi — Varaqqa **odamning o'z gapi** tushadi — uni o'zgartirmasdan yozib qo'yasiz. · 🤔 Nima tushmaydi — Sizning xulosangiz ham, bitta odamning gapidan chiqarilgan **umumiy gap** ham javob emas. · ✍️ Qachon yoziladi — Eshitgan javobni **o'sha zahoti** yozib olasiz — keyin gap boshqacha eslanadi. · Sinfga savol: Oxirgi eshitgan javobingizni so'zma-so'z ayta olasizmi?
Oyna tugmalari: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Suhbat nima? ✔ Odamning oldiga borib, bo'lib o'tgan ishini so'rash · Bo'lib o'tgan ishni odamsiz, o'zingiz taxmin qilish · Kelasi haftada nima qilishini oldindan so'rash · Botingizni ko'rsatib, u haqdagi fikrini so'rash
2. Suhbatda nima so'raladi? Bo'lib o'tgan ishga odam qo'ygan bahosi · Odamning kelasi hafta rejasi · Odamning bot haqidagi fikri · ✔ Odamning bo'lib o'tgan ishi
3. Voqea savoli nima? Bo'lib o'tgan ishni emas, kelajakni so'ragan savol · Botga qanday tugma kerakligini so'ragan savol · ✔ Bo'lib o'tgan ishni so'ragan savol · Javobi «ha» bo'lib qoladigan savol
4. Bo'sh savol nima? Javobida bo'lib o'tgan ish juda ko'p aytiladigan savol · ✔ Javobidan bo'lib o'tgan ish bilinmaydigan savol · Suhbatning oxirida beriladigan savol · Bir kunda ikki marta berilgan savol
5. «Botim yoqdimi?» — bu qanday savol? Voqea savoli — botni tilga olgan savol · ✔ Bo'sh savol — qilgan ish so'ralmadi · Bo'sh savol — savol juda qisqa · Voqea savoli — javobi bir og'iz
6. «Oxirgi marta qachon unutgansiz?» — bu qanday savol? ✔ Voqea savoli — bo'lgan kunni so'radi · Voqea savoli — javobi «ha» bo'lib qoladi · Bo'sh savol — kelajakni so'radi · Bo'sh savol — botni tilga olmadi
7. Suhbatdosh «Ha, ishlataman» dedi — bundan nima bilinadi? U botni har kuni ochib turgani · U eslatma tugmasini bosgani · ✔ Hech narsa — bu ish hali bo'lmagan · U vazifani payshanba unutgani
8. Varaqqa qaysi gap tushadi? Siz chiqargan xulosa · Botga kerak bo'lgan tugmalar ro'yxati · Hammaga taalluqli umumiy gap · ✔ Odam aytgan gap, uning o'z so'zi bilan
9. Airbnb asoschilari o'sish to'xtaganda qayerga bordi? ✔ Nyu-Yorkka — uy egalarining oldiga · San-Frantsiskodagi yig'inga · Mehmonxonalarga — joy so'rashga · Hech qayerga — saytni o'zgartirishdi
10. Ular uy egalarining oldida nimani bilib oldi? Uy egalari narxni baland qo'yganini · Uy egalari saytga kam kirishini · ✔ Yomon surat qo'yilgan uy band qilinmasligini · Uy egalari surat olishni bilmasligini
11. Suhbatni kimdan boshlaysiz? Bot haqida eshitmagan odamdan · ✔ Botingizni ishlatgan odamdan · Eng ko'p kitob o'qigan odamdan · Botni yozishga yordam bergan odamdan
12. Bir odam aytgan gapni varaqqa qanday yozasiz? «Hamma shunday deydi» deb yozib qo'yaman · Qisqartirib, o'z xulosam bilan yozaman · Yozmayman — esimda qoladi · ✔ Uning o'z so'zi bilan, o'zgartirmasdan

Arena (umumiy shablon, barcha darslarda bir xil): ▶ Testni boshlash · ⏳ Mentor testni boshlashini kuting… · Savol n/12 · ✔ Javob qabul qilindi — natijani kuting… · Vaqt tugadi — 0 ball · Adashdingiz — 0 ball. Keyingisida olasiz. · 🏆 TOP-5 · 🏆 Test yakunlandi! · ↻ Testni qayta yechish — mashq (jadvalga yozilmaydi) · Arenani yopish.

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«O'z so'zi bilan / o'zgartirmasdan» qoidasiga to'g'ri javobning o'zi zid** — 4-ekranda ✔ qator «Payshanba kuni vazifani unutgan — kechqurun yozilgan ekan». Bu odamning gapini boshqacha aytib bergan: u «unutdim» demagan, «ertalab guruhni ochsam» esa tushib qolgan. Shunga qaramay izoh «✅ Aynan shu — odamning o'z gapi» deydi. 11-ekranda ✔ «…chiqib ketgan» (odam «…chiqib ketdim» degan). Holbuki takrorlash oynasi 4 va viktorina 12 «o'zgartirmasdan» deydi. Yana: «o'z so'zi bilan» (4, 8, 12, kartochka 7, viktorina 8) o'quvchiga «o'z so'zim bilan» bo'lib eshitilishi mumkin.
- **4-ekran, 4-savol:** savol «O'sha kuni vazifani qanday topdingiz?», lekin ostidagi qator «Vazifani **hozir** qanday topayotgani ko'rindi». «O'sha kuni» bilan «hozir» bir-biriga zid.
- **9-ekran — yangi tushuncha tekshiruv ekranida:** «Javob savolning ichida» to'sig'i darsda birinchi marta shu yerda chiqadi. 4-ekranda faqat maqtov va va'da ko'rsatilgan, 8-ekrandagi ««ha» deb qo'ya qoladi» ogohlantirishi esa faqat o'quvchi shunday savol yozsagina chiqadi. Bitta narsa uch xil aytilgan: «Javob savolning ichida» · «Javob savolda yozib qo'yilgan» · «Javobni savolning o'zi aytib tursa».
- **9-ekran Mentor gapi «To'rt yangi savol»** — lekin 4-savol («O'sha kuni vazifani qanday topdingiz?») 4-ekrandagi 4-savol bilan so'zma-so'z bir xil.
- **6-ekran — «Airbnb» izohsiz:** izoh «(begonaning uyida ijaraga turish xizmati)» faqat takrorlash oynasi 3 da bor, u oyna esa faqat mentor tugmasi bilan ochiladi. Tartib ham g'alati: 2-bosqichdagi bashorat («Saytga yangi odamlar qo'shilmay qolganda…») «Keyinroq o'sish to'xtadi» slaydidan OLDIN keladi. 3-slayd esa bashorat javobini («Nyu-Yorkka jo'nashdi») yana takrorlaydi.
- **5-ekran savoli ⏳ belgisi bilan boshlanadi.** Darsda bu belgi «Ish hali bo'lmagan» / «Hali bo'lmagan ish» ma'nosida ishlatiladi (9-ekran, takrorlash oynasi 2), shuning uchun u to'g'ri javobga («Hali qilmagan ishi haqida va'da») ishora qilib qo'yadi. Boshqa test savollarida bunday belgi yo'q.
- **10-ekran:** «`node suhbat.js` uch qatorni chiqaradi» va «✅ Yozdim — uch qator chiqdi» deyilgan. Lekin 2-shart qisqa javobga «yana bir qator» qo'shadi, boshlang'ich koddagi 2- va 3-yozuv esa bo'sh (""). Demak terminalda uch qatordan ko'p chiqadi.
- **15-ekran — keyingi dars haqida gap yo'q:** namunadagi «🚀 Keyingi dars — …» qatori bu darsda yo'q, 9-dars «Fikr va iteratsiya»ga o'tish ham aytilmaydi. Matnda «o'tgan dars / keyingi dars», modul raqami va ichki kod (M5-D8 va h.k.) ham uchramaydi. Faqat 10-ekran Yordamida «ilgari ham yurgizgansiz» degan gap bor.
