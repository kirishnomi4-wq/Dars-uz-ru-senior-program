# 5-Modul (LMS: 7-Modul) · 8-dars «Botingizni ishlatgan odamdan nimani so'raysiz?» — YANGI MATN (v2)

Fayl: `src/5-Modull/PmLesson20.jsx` · 16 ekran · PM darsi · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `08-PmLesson20-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti `INLINE_KEYS`: `s3:1 · s5:0 · s7:2 · s11:1` · amaliy zonalar `stol · javoblar · elak · koding = -1`; arena ✔: `0,3,2,1 · 1,0,2,3 · 0,2,1,3`) — faqat matn. Ball bermaydigan tanlovlar (4-savol A — to'g'ri variant o'rni aralash, nishon sharti variant matni bo'yicha): 4-ekran varaq qatori ✔ 2-o'rin · 6-ekran bashoratlari ✔ 3- va 2-o'rin · 9-ekran yo'llari · 10-ekran kod-savoli ✔ 2-o'rin (hozir 1-o'rin — **KOD**).
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (U1–U3; A8 — to'g'ri javob izohi bitta gap) · DAVOM 6–7 (8-dars bandlari) · **30.09: ChatGPT matn auditi (F-0930-101) filtrlandi** — hukmlar `JURNAL.md` · foydalanuvchi: «bir ma'noli so'zlardan bittasi qolsin» (F-0930-102) — A11. PM uy vazifasi (dars ichidagi `HwCard`) MD'ga kirmaydi.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

**A1-qo'shimcha — shu darsning metafora-atamalari**

| Eski (olib tashlanadi) | Yangi asosiy nom | Sabab |
|---|---|---|
| stol ortida · odamning oldida (2, 6-ekran, oyna 1 va 3) | **o'zingiz o'ylab topasiz · odamning oldiga borasiz** | «stol» darsda ikki qarama-qarshi ma'noda edi: 2-ekranda yolg'iz o'ylash (noto'g'ri yo'l), 4-ekranda suhbat joyi (to'g'ri yo'l). Endi «stol» so'zi darsda yo'q |
| Suhbat stoli · Stol | **Suhbat** | 4-ekran nomi |
| savol-elak · elak · to'siq · «O'tdi — varaqqa» | **savolni tekshirish** · javoblar: «Ish hali bo'lmagan» / «Javob savolda aytilgan» / «Varaqqa tushadi» | elak — faqat animatsiyada (savol varaqqa tushadi yoki to'xtab qoladi), matnda yo'q |
| Javob savolning ichida · savolda yozib qo'yilgan · savolning o'zi aytib tursa | **javob savolda aytilgan** | bir tushuncha uch xil aytilgan edi (A2); 9-ekran Mentori uni boshida aytadi |
| o'z so'zi bilan · odamning o'z gapi · odam aytgan gap · o'zgartirmasdan · so'zma-so'z | atama — **eshitgan javob**; qoida — **u aytganidek yozing** | 30.09 (F-0930-102): bir ma'noni besh ibora aytardi — bittasi qoladi |
| qora oyna | **terminal** | 10-ekran |
| takrorlash-sikli · if-sharti | **`for` sikli · `if` sharti** | A1 «sikl» |

**A10. Varaq qoidasiga testning o'zi ham bo'ysunadi (DAVOM 7).** Dars «varaqqa odam aytgan gap o'zgartirmasdan tushadi» deydi. Shuning uchun ✔ varaq qatori ham manbadagi gapning so'zma-so'z nusxasi (4, 11-ekran, 10-ekrandagi namuna yozuv). Xato variantlar — xulosa va hammaga yoyilgan gap, ✔ bilan taxminan teng uzunlikda.

**A11. Dars atamalari (PM, dars bo'yi bir xil; har tushunchaga bitta so'z — F-0930-102):** suhbat · suhbatdosh · voqea savoli · bo'sh savol · va'da · eshitgan javob (yozilishi: u aytganidek) · suhbat varag'i (varaq). Sinonimlar ishlatilmaydi. Bu darsdagi «varaq» — suhbat yozilgan varaq; 1-darsdagi «qoidalar varag'i» (→ handler) bilan aloqasi yo'q, u v2 da olib tashlangan.

**A12. Hook:** 0-ekranda to'g'ri javob yo'q (ikkalasi ham fikr), izoh ikkala tanlovga bir xil — «Aynan! / Qiziq fikr!» qoidasi bu ekranga tegishli emas.

**A13. Tugma-belgilar:** A4 ro'yxatiga `✎` (tahrirlash) qo'shiladi. Aylana raqamlar (① ② ③) tugma yorlig'idan olinadi, `▸ ◂` → `→ ←`.

---

## Darsning ipi
- **Olam (bitta):** o'quvchining o'z boti va uni ko'rgan odam — yonidagi sinfdosh. Suhbat misoli bitta: guruhda yozilgan uy vazifasi (unutish → qidirish). Biznes misoli: Airbnb asoschilari Nyu-Yorkda (6, 7-ekran).
- **Hook:** botni yonidagi odamga ko'rsatdingiz → u «Zo'r ekan» deydi yoki kamchilik aytadi → ikkalasi ham fikr: botda nima qilgani yo'q.
- **Asosiy model (dars bo'yi bitta):** bo'lib o'tgan ishni so'raysiz → odam aytganini u aytganidek yozasiz → varaqqa xulosa emas, eshitgan javob tushadi.
- **Oldingi bilimga ko'prik:** 7-dars (bot, baza va AI bitta loyihada) → endi botni odamga ko'rsatasiz · 2-dars (yozgan odamlar ro'yxati) → 8-ekran lentasi va uy vazifasi · backend darslari (`node server.js`) → 10-ekranda `node suhbat.js`.
- **Tajribalar:** ikki yo'l (2) · to'rt savol va varaq qatori (4) · Airbnb bashoratlari (6) · o'z uch savoli (8) · to'rt savolni tekshirish (9) · `suhbat.js` (10) · yoddan aytish (12).
- **Chiqish-ma'lumot:** 8-ekrandagi uch javob (`pm-m5d8-javoblar`) 11 va 12-darslarda jim o'qiladi — matn o'zgarishi unga tegmaydi.
- **Keyingi dars (App.jsx m5-09):** «Fikr va iteratsiya».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — botingiz | hook | odam nima deyishini tanlaydi (2 variant) → ikkalasi ham fikr | — |
| 1 | Maqsad | qoida | suhbat varag'ining uch qatori yozilib chiqadi | — |
| 2 | Ikki yo'l | tushuncha | «O'zingiz o'ylab topasiz» / «Odamning oldiga borasiz» → suhbat ta'rifi | — |
| 3 | 1-savol | test | «Zo'r ekan» gapidan nima bilinadi | ✅ |
| 4 | Suhbat | markaziy o'yin | 4 savolni beradi → bilinganlarni solishtiradi → varaq qatorini tanlaydi | — (nishon) |
| 5 | 2-savol | test | kelasi hafta haqidagi savolga qanday javob keladi | ✅ |
| 6 | Biznes olamidan · Airbnb | case | 5 bosqich, 2 bashorat | — |
| 7 | 3-savol | test | asoschilar uy egalarining oldida nimani bilib oldi | ✅ |
| 8 | Uch savol | praktika | o'z 3 savolini yonidagi odamga beradi, javobini yozib oladi | — (nishon) |
| 9 | To'rt savolni tekshiring | tekshiruv-amaliyot | har savolga javob: hali bo'lmagan / javob savolda / varaqqa | — (nishon) |
| 10 | Koding · VS Code | koding | kod-savoli → `suhbat.js` yozadi | — (nishon) |
| 11 | 4-savol | test (yakuniy) | suhbatdosh gapidan varaqqa qaysi qator tushadi | ✅ (final) |
| 12 | Mustahkamlash | refleksiya | eng aniq javobni yoddan aytadi (taymer) + bir qator yozadi | — |
| 13 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 kartochka | — |
| 15 | Yakun | xulosa | asosiy fikr, arena, 4 xulosa, nishonlar, uyga vazifa, keyingi dars | — |

---

## 0 · Kirish — botingiz  `[672]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Botingizni ko'rgan odam nima deydi?**
- Mentor: O'tgan darsda bot, baza va AI'ni bitta loyihaga yig'dingiz. Endi botingizni yoningizdagi odamga ko'rsatdingiz.
- Tanlov (2 ta, teng):
  - «Zo'r ekan» deydi
  - «Mana bu joyi qiyin ekan» deydi
- Tanlovdan keyin (ikkalasiga bir xil): Ikkalasi ham fikr: odam botda nima qilganini aytmadi. Bugun odamdan nimani so'rash kerakligini ko'rasiz.
- Jonli darsda: sinf ovozi diagrammasi (ikki variant · foiz)
- Tugma: Bittasini tanlang → Davom etish
- Mentorga eslatma: Ovozlar bo'linadi — ikkalasi ham halol javob. «Botga nima qo'shish kerakligi bilinmaydi» degan joyda to'xtang: bugungi dars aynan shu bo'shliqni to'ldiradi. Qanday so'rash kerakligini oldindan aytmang.

**Ko'rinish:** kirganda — sarlavha, Mentor va 2 variant (teng, hozirgidek). Tanlangach — bitta izoh ramkasi; jonli darsda uning ostida ovoz diagrammasi.
Animatsiya: yo'q.
Olib tashlanadi: stol ortidagi odam paneli («👤 {nom} 💬 · · ·») — yangi ma'no bermaydi, ustiga nom o'rniga 2-darsdagi guruh yozuvi tushardi (masalan, «birga o'ynaydiganlar») · 🙂 🤔.

✎ 30.09 ChatGPT #6 **Qabul**: variantlar suhbatdoshning ichki sababini taxmin qilardi («xafa qilgisi kelmaydi», «to'g'risini aytadi») → ikkalasi ham faqat gapi · izoh 4 gapdan 2 gapga (F-0930-102: bir ma'no — bir gap) · 🔴 FAKT: panel nomi «2-darsdagi ro'yxatning birinchi odami» deb olinardi, lekin 2-darsda bu maydon «U yerda kimlar bor?» — guruh yoziladi, bitta odam nomi emas (`PmLesson19` `kim`) → panel olindi (**KOD**) · sarlavha va Mentor bir gapni aytmaydi; Mentor 7-darsga ko'prik bo'ldi (App.jsx: «Loyiha kuni: bot + DB + AI») · «to'g'risini aytadi» → «nima yoqmaganini» (kamchilik ham fikr ekani aniq bo'lsin) · «javobi ish berishini» → «javobi foydali bo'lishini» · A12.

## 1 · Maqsad  `[752]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun uch savol va uch javobdan varaq tuzasiz.**
- Mentor: Avval to'rtta namuna savolni sinaysiz, keyin uchtasini o'zingiz yozib, odamga berasiz.
- Namuna (qatorlar yozilib chiqadi): Suhbat varag'i
  - 1-savol → odamning javobi ✓
  - 2-savol → odamning javobi ✓
  - 3-savol → odamning javobi ✓
- Tugmalar: Orqaga · Boshlaymiz →
- Mentorga eslatma: Varaq yozilib bo'lgunicha gapirmang — varaqning o'zi tanishtiradi.

**Ko'rinish:** sarlavha + Mentor → varaq qatorlari birma-bir yoziladi (hozirgidek).
Animatsiya: HA — har qatorda «N-savol» chiqqach strelka javob tomonga chiziladi, keyin «odamning javobi ✓» chiqadi (~0.8 s har qator). Savoldan javobga yo'nalish — darsning modeli. Mavjud `s1row` kechikishlari shunga moslanadi.
Olib tashlanadi: 📄 🗣️ ✅.

✎ 30.09 ChatGPT #3 **Qabul**: sarlavha «uch savol», 4 va 9-ekranda esa to'rt savol — Mentor ikkalasini bog'laydi (to'rtta namuna → uchta o'zingizniki) · Mentor «javobni kimdan» deganiga «savolni kim yozadi» qo'shildi — ikki rol ajraldi · «vizual o'zi tanishtiradi» → «varaqning o'zi».

## 2 · Ikki yo'l  `[780]`
- Eyebrow: Muhokama · ikki yo'l
- Sarlavha: **Botingizga nima kerakligini kim biladi?**
- Mentor: Ikki kartani bosib solishtiring.
- Kartalar (bosilmaguncha «· · ·»; qayta bosilsa yopiladi):
  - **O'zingiz o'ylab topasiz** — Botga qanday tugma kerakligini o'zingiz o'ylab topasiz. Tugmani qo'shasiz, lekin uni hech kim bosmasligi mumkin.
  - **Odamning oldiga borasiz** — Botni ishlatgan odamdan o'tgan hafta nima qilganini so'raysiz. Javobida kun ham, qilingan ish ham bo'ladi.
- Xulosa (ikkala karta ko'rilgach, kartalar o'rniga): **Botni ishlatgan odamning oldiga borib so'rash — suhbat deyiladi.** Suhbatda odamning fikri emas, bo'lib o'tgan ishi so'raladi.
- Tugmalar: Yana N kartani oching → Davom etish · ← Kartalarga qaytish

**Ko'rinish:** hozirgidek — 2 karta birga (solishtirish uchun ikkalasi ko'rinadi); ikkalasi ochilgach ~0.7 s dan keyin xulosa kartalar o'rniga chiqadi.
Animatsiya: yo'q.
Olib tashlanadi: 💭 🚶 👆 · xulosadagi takror (oldin sarlavha-gap ham, izoh ham «bo'lib o'tgan ishini so'rash» derdi).

✎ «Stol ortida / Odamning oldida» → «O'zingiz o'ylab topasiz / Odamning oldiga borasiz» (A-bo'lim) · «uni hech kim bosmaydi» → «bosmasligi mumkin» (A3) · xulosa: 1-gap — ta'rif (kimdan, qayerda), 2-gap — nima so'raladi · «◂» → «←».

## 3 · 1-savol ✅  `[835]`
- Eyebrow: Tekshiruv · maqtov gapi
- Savol: **Sinfdoshingiz botingizni ko'rib «Zo'r ekan» dedi. Bundan botingiz haqida nimani bilib oldingiz?**
  - A — Botda hamma narsa joyida ekanini — o'zgartirish shart emas
  - B — ✔ Hech narsani — u botda qilgan biror ishini aytmadi
  - C — Botni ishlatib ko'rganini — shuning uchun maqtadi
- To'g'ri: Maqtov gapida odamning botda qilgan biror ishi yo'q.
- Xato izohlari:
  - A: Bitta maqtovdan botda hamma narsa joyida ekani chiqmaydi — u botda nima qilganini aytmadi.
  - C: U botni ishlatganini aytmadi: maqtov gapida qilingan ish yo'q.
  - (umumiy) Maqtov gapida odamning botda qilgan biror ishi yo'q.
- Barcha testlarda bir xil yozuvlar: Javobni tanlang · To'g'ri · Qaytadan urinib ko'ring · jonli darsda: Jonli dars: bitta urinish, o'ylab bosing · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: X — …

**Ko'rinish:** variantlar hammasi birdan (A6 istisnosi). Animatsiya: yo'q.

✎ Test halolligi: A «Bot unga yoqqanini» qisman to'g'ri edi («Zo'r ekan» — yoqqanini bildiradi) → «Botda hamma narsa joyida ekanini» (bitta maqtovdan chiqmaydigan xulosa) · savolga «botingiz haqida» qo'shildi — ✔ «hech narsani» aniq bo'lsin · jonli yozuvlardan ⚡ 📨 olindi (**KOD**: `QuestionScreen` shu darsdagi nusxa).

## 4 · Suhbat (markaziy o'yin)  `[868]`
- Eyebrow: Suhbat
- Sarlavha: **To'rt savol — to'rt javob. Qaysi biridan ko'proq narsa bilinadi?**
- Mentor (1–2-bosqichda): Qarshingizda suhbatdosh o'tiribdi. Savolni bosing — u javob beradi.
- **1-bosqich — so'rash (navbat bilan).** Joriy savol bitta karta; bosilgach o'ngda javob pufakda yozilib chiqadi, ostida «nima bilindi» qatori; «Keyingi savol →» bilan u «✓ n-savol — …» qatoriga yig'iladi va keyingi savol chiqadi. Savollar:
  1. «Botim yoqdimi?» → «Ha, zo'r ekan!» → Hech narsa bilinmadi — u qilgan biror ishini aytmadi
  2. «Botga eslatma tugmasi qo'shsam, ishlatasizmi?» → «Ha, ishlataman.» → Bu ish hali bo'lmagan — javobi va'da, qilingan ish emas
  3. «Uy vazifasini oxirgi marta qachon unutgansiz?» → «O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.» → Kun ham, o'sha kuni bo'lgan ish ham aytildi
  4. «O'sha kuni vazifani qanday topdingiz?» → «Guruhdagi xabarlarni yuqoriga surib qidirdim, o'n daqiqa ketdi.» → O'sha kuni vazifani qanday qidirgani aytildi
- **2-bosqich — bilinganlar:** to'rtala «nima bilindi» qatori birga · Berilgan savol · 4/4 · tugma «Keyingisi →»
- **3-bosqich — varaq qatori:** ✓ To'rt savol berildi · «O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.»
  - **Shu javobdan varaqqa qaysi qator tushadi?**
  - Sinfdoshlarim kechqurun yozilgan vazifani ko'pincha ertalab ko'radi → Buni u aytmadi: u faqat o'zi haqida gapirdi. Bitta odamning gapini hammaga yoydingiz.
  - ✔ O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan. → Aynan shu: eshitgan javob, u aytganidek.
  - Botga kechqurun yozilgan vazifani ertalab eslatadigan tugma kerak → Bu sizning xulosangiz — u tugma haqida hech narsa demadi.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (birinchi tanlov xato bo'lsa) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- **4-bosqich — xulosa** (to'g'ri qatordan 2,5 s keyin): **Bo'lib o'tgan ishni so'ragan savol — voqea savoli.** Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol. Varaqqa xulosangiz emas, eshitgan javob tushadi — u aytganidek.
- Tugma: Savolni bosing / Keyingi savol → → Bilingan qatorlarni o'qing → Varaqqa tushadigan qatorni tanlang → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda · (mentorda) To'rt savolni berganlar — n/N
- Mentorga eslatma: 1-savoldagi «ha, zo'r» javobiga bolalar odatda kuladi. To'rttasi ham berilgach so'rang: qaysi ikki javobda bo'lib o'tgan kun va ish bor? Farqni ular aytsin, siz aytmang. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish (KOD):** bosqichlar bittadan: so'rash → bilinganlar → varaq qatori → xulosa. 1-bosqichda savollar ham bittadan (A6): joriy savol ochiq, berilgani «✓» qatoriga yig'iladi — hozirgi 4 karta birdan chiqmaydi (29.09 dagi «tanlov ro'yxati» istisnosi bekor: to'rttasini ham berish kerak, bu tanlov emas). 3-bosqichda 3 qator birga (variantlar, teng). Bir vaqtda bitta izoh-qatori.
Animatsiya: HA — to'g'ri qator tanlangach iqtibos bilan shu qator orasida chiziq chiziladi (~0.8 s): varaqqa aynan eshitilgan gap tushdi. (Javob pufagidagi yozilib chiqish — chatning o'z ko'rinishi.)
Olib tashlanadi: «Stol» yorlig'i va 🪑 · 👤 (suhbatdosh — harf-doira, ostida nom emas, «Suhbatdosh») · 🤔 ✅ 💬 🏅 · ① ② ③.

✎ 30.09 ChatGPT #9 **Qabul**: 4 savol-kartasi, javob, «nima bilindi», natijalar birdan — telefonda ayniqsa to'lib ketardi → savollar navbat bilan (A6), 45 soniyalik maslahat keraksiz bo'ldi · #4, #22 **Qabul**: «javobi va'da bo'ldi» → «va'da, qilingan ish emas» (va'da ham ma'lumot — niyat; faqat qilingan ish emas) · xulosa 5 gapdan 3 gapga, «eshitgan javob» ta'rifi bitta (F-0930-102) · 🔴 DAVOM 7 (tasdiqlandi): ✔ qator «Payshanba kuni vazifani unutgan — kechqurun yozilgan ekan» odamning gapini o'zgartirgan («unutdim» demagan, «ertalab guruhni ochsam» tushib qolgan), izoh esa «odamning o'z gapi» derdi → ✔ = so'zma-so'z iqtibos (o'rni o'sha, 2-qator); xato qatorlar uzaytirildi (teng uzunlik), har biri o'z xatosini saqladi · 🔴 FAKT: 4-qator «vazifani **hozir** qanday topayotgani» — savol «o'sha kuni» ni so'raydi → «o'sha kuni … qidirgani» · «Suhbat stoli» → «Suhbat»; suhbatdosh nomi — 0-ekrandagi sabab bilan (**KOD**) · sarlavha («Savolni tanlang va javobni eshiting») Mentor bilan bir gapni aytardi → sarlavha vazifani beradi (solishtirish) · mentor eslatmasi: «qaysi ikki javobdan payshanba kuni chiqdi» → «qaysi ikki javobda kun va ish bor» (4-javobda payshanba so'zi yo'q) · «o'z so'zi bilan» → «u aytganidek».

## 5 · 2-savol ✅  `[1016]`
- Eyebrow: Tekshiruv · javob turi
- Savol: **«Kelasi haftadan boshlab botni ishlatasizmi?» — bu savolga qanday javob keladi?**
  - A — ✔ Hali bo'lmagan ish haqida va'da
  - B — Bo'lib o'tgan ish haqida hikoya
  - C — Kuni va soati aytilgan voqea
- To'g'ri: Kelasi hafta hali kelmagan — javob faqat va'da bo'ladi.
- Xato izohlari:
  - B: Savol kelasi haftani so'rayapti — bo'lib o'tgan ish bu javobdan chiqmaydi.
  - C: Kelasi hafta hali kelmagan: odam kun ham, soat ham ayta olmaydi, faqat va'da beradi.
  - (umumiy) Hali bo'lmagan ish haqida odam faqat va'da bera oladi.

**Ko'rinish:** variantlar birdan. Animatsiya: yo'q.

✎ Savol boshidagi ⏳ olindi — darsda bu belgi «ish hali bo'lmagan» ma'nosida (9-ekran, oyna 2), to'g'ri javobga ishora qilardi (DAVOM belgisi, tasdiqlandi) · «va'da» atamasi faqat ✔ da edi (A8) → har variantda dars so'zi bor (va'da / bo'lib o'tgan ish / voqea), uzunlik teng · «Kelasi haftadan» → «Kelasi haftadan boshlab».

## 6 · Biznes olamidan · Airbnb (case)  `[1062]`
- Eyebrow: Biznes olamidan (har bosqichda: «Biznes olamidan · n / 5»)
- Sarlavha: **Airbnb asoschilari javobni qayerdan topdi?**
- Mentor: — (bu ekranda Mentor gapi yo'q)
- Bosqichlar:
  1. **2007-yil. San-Frantsiskoda katta yig'in bo'ldi, mehmonxonalarda joy qolmadi** — Airbnb — begona odamning uyida ijaraga turish xizmati. Uni boshlagan odamlar — asoschilar — o'shanda o'z uyiga uchta havo to'shagi qo'yib, kelganlarga joy berishdi. Kompaniya shundan boshlandi.
  2. Bashorat — «Avval o'zingiz belgilab ko'ring»: **Keyinroq saytdagi uylarni deyarli hech kim band qilmay qo'ydi. Asoschilar nima qildi?**
     - Saytga yangi tugma qo'shdi · Uy egalariga xat yozdi · ✔ Nyu-Yorkka jo'nab ketdi
     - Topsa: Topdingiz: ular Nyu-Yorkka jo'nashdi. · Adashsa: Aslida ular Nyu-Yorkka jo'nashdi.
  3. **Nyu-Yorkda uy-ma-uy** — Saytdagi uylarning ko'pi Nyu-Yorkda edi. Asoschilar uy egalarining oldiga kirib, ular bilan gaplashishdi va uylarni ko'rishdi.
  4. Bashorat: **Uy egalarining yonida ular nimani topdi?**
     - Uy egalari narxni oshirib yuborgan · ✔ Saytdagi suratlar yomon chiqqan · Sayt telefonda sekin ochilgan
     - Topsa: Topdingiz: suratlar yomon chiqqan edi. · Adashsa: Aslida suratlar yomon chiqqan edi.
  5. **Shunda ma'lum bo'ldi** — Saytdagi suratlar xira va qorong'i edi. Asoschilar uylarni qaytadan suratga olishdi, band qilishlar ko'paydi. Javobni ular kompyuter oldida emas, uy egalarining yonida topishdi — botingizda ham javob uni ishlatgan odamda.
- Tugmalar: Avval o'zingiz belgilang · Keyingi bosqich (n/5) → Davom etish · nuqtalar ustida: Avval shu bosqichni tugating
- Mentorga eslatma: Bolalar «nega o'zlari surat olgan, suratchi yollashsa bo'lmasmidi?» deb so'raydi. Javob berib qo'ymang — so'rang: suratchi yuborilsa, asoschilar uy egasining gapini eshitarmidi?

**Ko'rinish:** hozirgidek — bosqichlar bittadan, bashoratda 3 variant birga (teng); tanlangach bitta natija-qatori. Bosqichlar 7 → 5 (**KOD** `KEYS_STEPS`), bashoratlar va ✔ o'rinlari o'zgarmaydi.
Animatsiya: yo'q.
Olib tashlanadi: 🏠 📉 🚪 📸 🌉 🎲 🎯 🖱 ✉️ ✈️ 💸 📷 🐌 · 3-bosqichdagi takror («Asoschilar javobni izlab Nyu-Yorkka jo'nashdi» — oldingi bashorat javobini qaytarardi) · 4-bosqichdagi «uylarni o'zlari suratga olishdi» (keyingi bashoratning javobini — suratni — oldindan aytib qo'yardi; 6-bosqichga ko'chdi).

✎ 30.09 ChatGPT #7 **Qisman**: 7 → 5 bosqich («Nega aynan Nyu-York?» va «uy-ma-uy» birlashdi; «Shunda ma'lum bo'ldi» va ko'prik birlashdi), 4 gacha emas — PM 33-qonun: keysda kamida 2 bashorat, ikkalasi qoldi · DAVOM belgisi (tasdiqlandi): «Airbnb» izohi faqat mentor oynasida edi (u oyna mentor tugmasi bilan ochiladi) → 1-bosqichga bitta gap · 2-bosqich bashorati «o'sish to'xtadi» slaydidan oldin kelardi, 3-slayd esa javobni takrorlardi → vaziyat bashorat savolining o'ziga qo'shildi, 3-bosqich yangi ma'lumot beradi («Nega Nyu-York») · 🔴 FAKT: «Saytga yangi odamlar qo'shilmay qo'ydi» → aslida uylar saytda bor edi, ularni kam band qilishardi (2009-yil) · «stolida emas» → «kompyuter oldida o'tirib emas» (A-bo'lim) · «Adashdingiz» → neytral «Aslida…» · «Endi … yozasiz» → «Keyin» (keyingi ekran — test).

## 7 · 3-savol ✅  `[1126]`
- Eyebrow: Tekshiruv · uy egalarining oldida
- Savol: **Airbnb asoschilari uy egalarining oldiga borib nimani bilib oldi?**
  - A — Uy egalari narxni juda baland qo'yib yuborganini
  - B — Uy egalari saytga kam kirib turishini
  - C — ✔ Yomon surat qo'yilgan uy band qilinmasligini
- To'g'ri: Buni ular uzoqdan emas, uy egalarining yonida turib bilishdi.
- Xato izohlari:
  - A: Narx haqida hech narsa chiqmagan: ular uylarning suratlarini ko'rishdi.
  - B: Uy egalari saytga qancha kirishi emas — yomon surat tufayli uy band qilinmayotgani ma'lum bo'ldi.
  - (umumiy) Yomon surat qo'yilgan uy band qilinmas ekan — buni ular joyida bilishdi.

**Ko'rinish:** variantlar birdan. Animatsiya: yo'q.

✎ Variantlar o'zgarmadi (teng, xatolari ishonarli) · B izohi soddalashdi («band qilishni to'xtatayotgani» → «uy band qilinmayotgani»).

## 8 · Uch savol (praktika)  `[1152]`
- Eyebrow: Mustaqil ish · uch savol
- Sarlavha: **Uchta savolingizni yozing.**
- Lenta (2-darsda ro'yxat yozilgan bo'lsa): 2-darsda yozganingiz: {1} · {2} · {3} — uyda savollarni ularga ham berasiz.
- Mentor: Yoningizdagi odam avval botingizni ishlatib ko'rsin. Keyin unga uchta savol bering va har javobni o'sha zahoti yozib oling.
- Qadam doiralari: 1-savol · 2-savol · 3-savol
- **1-qadam:** maydon «Nimani so'raysiz?» → tugma «Savolni odamga o'qib bering»
  - kelajak haqidagi savol bo'lsa: Bu ish hali bo'lmagan — javobi va'da bo'ladi. Allaqachon bo'lgan kunni so'rang.
  - «-mi» bilan tugagan, javobi «ha» bo'ladigan savol bo'lsa: Bunday savolga odam shunchaki «ha» deydi. Bo'lib o'tgan ishni so'rang: oxirgi marta qachon…?
- **2-qadam:** savol o'qish holatida (✎ tahrirlash) · maydon «U nima dedi?»
  - xulosa so'zi bo'lsa (kerak, muhim, qulay…): Bu sizning xulosangiz — eshitgan javobni u aytganidek yozing.
  - boshqa holatda: Savol kelajakni so'ramayapti, javobda xulosa so'zi yo'q — saqlashingiz mumkin.
  - Tugma: ✓ Saqlash / ✓ Yangilash · yetishmasa yonida: savol yozilmagan · savol hali berilmagan · eshitgan javob yozilmagan
- Uchtasi tayyor bo'lgach: Suhbat varag'ingiz — «1 {savol} → «{eshitgan}» ✎» (×3)
- O'ng panel — Topshiriq (shartlar, ○ → ✓): Uch savol yozilgan · Savol bo'lib o'tgan ishni so'raydi · Har javob — u aytganidek
- Yordam: Savolingizni «Oxirgi marta qachon …?» yoki «O'sha kuni qanday qildingiz?» deb boshlang. · Bu ish allaqachon bo'lganmi? Bu gapni odam aytdimi yoki siz chiqardingizmi?
- Qo'shimcha: Uch javobingizni qayta o'qing: ikkitasida bir xil narsa takrorlanganmi? Topganingizni ovoz chiqarib ayting.
- Tugma: Birinchi savolingizni yozing / Yana N savol qoldi → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda · (mentorda) Uch javobni yozganlar — n/N
- Mentorga eslatma: «Yoqdimi?», «Kerakmi?» kabi savollar ko'p chiqadi — bu eng foydali xato. Javob-qatori uni tutadi; siz 1-savol javobini eslating: «Ha, zo'r ekan». Juftlik almashinuvini o'zingiz boshqaring — har o'quvchiga 3 daqiqadan. Baholash mezoni: uch savol bo'lib o'tgan ishni so'raydi · har javob u aytganidek yozilgan. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:** hozirgidek navbat bilan (A6 bajarilgan): savol maydoni → «o'qib bering» → javob maydoni → saqlash → keyingi savol. Yozilganlari yozish paytida ko'rinmaydi, uchtasi tayyor bo'lgach varaq ochiladi. Izoh-qatori bir vaqtda bitta. Yordam va Qo'shimcha — yopiq tugma ortida.
Animatsiya: yo'q.
Olib tashlanadi: Topshiriq panelidagi 3 qator «1-savol va eshitgan javob …» (qadam doiralari bilan bir ma'no — shartlar qoladi) · pastdagi «Uch savolingiz varaqda» yozuvi (varaq sarlavhasi bilan bir ma'no) · Mentorning «ro'yxat bor / yo'q» ikki tarmog'i · 👥 🗣 🎯 💡 ⭐ 🤔 ✅ 📄.

✎ 30.09 ChatGPT #8 **Qabul**: botni ishlatmagan odamdan «oxirgi marta qachon ochgansiz?» deb so'rab bo'lmaydi → Mentor: suhbatdosh avval botni ishlatib ko'radi (sinfda juftlik — sherik botingizni ochadi) · «odamning o'z gapi» → «u aytganidek» (F-0930-102) · ChatGPT #18 («takrorlanganmi?» asosiy bo'lsin) **Rad**: qo'shimcha bo'lib qoladi — uch javobdan takror topish 9-darsning ishi, bu darsni uzaytiradi · 🔴 FAKT: «Siz yozgan odamlar: …» va «Ro'yxatdan bitta odamni tanlang» — 2-darsda «U yerda kimlar bor?» (guruh) yozilgan; bundan tashqari sinfda savol juftlikdagi sherikka beriladi (mentor eslatmasi, 12-ekran «Sherigingizga ayting»), ro'yxatdagi odamlar sinfda yo'q → Mentor bitta tarmoq, lenta uy vazifasiga ko'prik (**KOD**) · 🔴 «Savolingiz bo'lib o'tgan ishni so'radi, javobda odamning o'z gapi turibdi» — tekshiruv faqat kelajak va xulosa so'zlarini qidiradi, buni tasdiqlay olmaydi → aytilgani rost bo'ldi (A3) · «deb qo'ya qoladi» → «shunchaki «ha» deydi» · «o'z so'zi bilan» → «u aytganidek».

## 9 · To'rt savolni tekshiring  `[1343]`
- Eyebrow: Tekshiruv · to'rt savol
- Sarlavha: **To'rt savol: qaysi biri varaqqa tushadi?**
- Mentor: Har savolni ikki narsaga tekshiring: so'ralgan ish hali bo'lmaganmi? Javob savolning o'zida aytilmaganmi? Ikkalasi ham yo'q bo'lsa, savol varaqqa tushadi.
- Karta: Savol · n / 4
- Javob tugmalari: Ish hali bo'lmagan · Javob savolda aytilgan · Varaqqa tushadi
- Savollar (✔ to'g'ri yo'l → sabab):
  1. Botni oxirgi marta qachon ochgansiz? — ✔ Varaqqa tushadi → Bo'lib o'tgan kun so'raldi — odam kunni o'zi aytadi.
  2. Botga o'yin qo'shsam, ko'proq ishlatasizmi? — ✔ Ish hali bo'lmagan → Bu o'yin hali qo'shilmagan — javobi va'da bo'ladi.
  3. Guruhda vazifani topish qiyin, shundaymi? — ✔ Javob savolda aytilgan → «Qiyin» degan javobni savolning o'zi aytib qo'ydi — odam shunchaki «ha» deydi.
  4. Kecha botni ochganingizda birinchi nimani bosdingiz? — ✔ Varaqqa tushadi → Kechagi ish so'raldi — odam nima qilganini o'zi aytadi.
- To'g'ri tanlansa: ✓ {sabab}. Xato tanlansa: to'g'ri yo'lni aytuvchi qator + {sabab}:
  - (to'g'risi «Varaqqa tushadi») Bu savolda xato yo'q — u varaqqa tushadi.
  - (to'g'risi «Ish hali bo'lmagan») Bu savol hali bo'lmagan ishni so'rayapti — varaqqa tushmaydi.
  - (to'g'risi «Javob savolda aytilgan») Bu savolda javob aytilgan — varaqqa tushmaydi.
- Tugma: Keyingisi →
- Yakun lentasi: 1 varaqqa · 2 hali bo'lmagan · 3 javob savolda · 4 varaqqa
  - Varaqqa faqat bo'lib o'tgan ishni so'ragan savol tushadi. Qolganlariga odam va'da beradi yoki shunchaki «ha» deydi.
- Tugma: Birinchi savolni tekshiring / Yana N savol qoldi → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda · (mentorda) To'rt savolni tekshirganlar — n/N
- Mentorga eslatma: Eng ko'p adashiladigan joy — 3-savol: «vazifa topish qiyin, bu to'g'ri gap». Mentor gapidagi ikkinchi tekshiruvni eslating: javob savolning o'zida aytilganmi? Ha — demak odam faqat «ha» deydi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:** hozirgidek — savollar bittadan; tanlovdan keyin izoh va «Keyingisi →»; to'rtinchi savoldan ~2 s keyin karta o'rniga yakun lentasi (bitta natija-ramka). 3 javob tugmasi birga (variantlar).
Animatsiya: HA — «Varaqqa tushadi» bo'lsa savol kartasi pastga tushadi, boshqa javobda joyida to'xtab qoladi (~0.6 s; mavjud `fall / hold`). Savolning yo'li ko'rinadi: varaqqa yoki yo'q.
Olib tashlanadi: «Yordam» bloki (birinchi xatodan keyin chiqardi) — endi Mentor gapidagi ikki tekshiruvni takrorlaydi · «elak», «to'siq», «Elakdagi savol» so'zlari (A-bo'lim) · 🕳️ ⏳ 🗣️ ⬇️ 🤔 📄 ✅ · ① ②.

✎ 🔴 DAVOM 7 (tasdiqlandi): Mentor «To'rt yangi savol» derdi, 4-savol esa 4-ekrandagi 4-savol bilan so'zma-so'z bir xil («O'sha kuni vazifani qanday topdingiz?») → yangi voqea savoli, to'g'ri yo'li o'sha («Varaqqa tushadi») · DAVOM belgisi (tasdiqlandi): «Javob savolning ichida» darsda birinchi marta shu yerda, oldindan tushuntirilmagan va uch xil aytilgan edi → Mentor ikki tekshiruvni boshida aytadi, nom bitta («javob savolda aytilgan») · yakundagi «qolgan savollarga odam «ha» deb qo'ya qoladi» → kelajak savoliga javob — va'da; ikki holat alohida aytildi.

## 10 · Koding · VS Code  `[1508]`
- Eyebrow: Koding · VS Code
- Sarlavha: **Suhbat varag'ini chiqaradigan kod yozamiz.**
- **1-bosqich (kod-savoli):**
  - Mentor: Avval bitta savol, keyin kod yozasiz.
  - Savol: Kod `javoblar[0].savol` ni chiqarsa, terminalda nima ko'rinadi?
    - Uchala yozuvdagi savollar ketma-ket · ✔ Birinchi yozuvdagi savol matni · Birinchi yozuvdagi javob matni
  - Xato bosilsa (tugma silkinadi) va maslahat: Ikki bo'lakni alohida o'qing: **javoblar[0]** — birinchi yozuv, **.savol** — shu yozuvning savol bo'lagi.
- **2-bosqich (kod yozish):**
  - Mentor: Kodda bitta namuna yozuv bor. Bo'sh yozuvlarga o'zingiz yozgan savol va javoblarni qo'ying, keyin bitta `for` sikli va bitta `if` shartini yozing.
  - ✓ javoblar[0].savol — birinchi savol matni
  - Kod nima chiqarsin: 1) `node suhbat.js` har yozuv uchun bitta qator chiqaradi · 2) Har qatorda savol va javobi · 3) Javobi bo'sh yozuv ostida «javob hali yozilmagan» qatori
  - Yordam:
    - Backend darslarida kodni `node` bilan ishga tushirgansiz: terminalga **node suhbat.js** deb yozing.
    - Avval bitta qatorni chiqarib ko'ring: **javoblar[0].savol**. Ishlagach siklni, keyin **if** ni qo'shing.
    - Javob matnini qo'shtirnoq (`"..."`) ichida yozing: yakka tirnoq (`'...'`) ichidagi apostrof kodni buzadi.
    - Qo'shimcha: javobi bo'sh yozuvlarni sanab boring va oxirida bitta qatorda chiqaring: «n ta javob yozilmagan».
  - Tugma: ✓ Yozdim — kod ishladi → ✓ Bajarildi · (mustaqil rejimda) ✓ Bu mashqni sinfda bajarganman — davom etish →
  - VS Code oynasi: suhbat.js · qo'lda yoziladi (sichqoncha ustida: «Kod nusxalanmaydi — o'zingiz terib yozasiz») · terminal: `$ node suhbat.js`
  - Boshlang'ich kod:
    ```js
    // suhbat.js — suhbat varag'i
    const javoblar = [
      { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?",
        eshitgan: "O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan." },
      { savol: "", eshitgan: "" },
      { savol: "", eshitgan: "" },
    ];

    for (let i = 0; i < javoblar.length; i++) {
      const j = javoblar[i];

      // 1) har yozuvni bitta qatorda chiqaring:
      //    console.log((i + 1) + ") " + j.savol + "  ->  " + j.eshitgan);
      // 2) j.eshitgan bo'sh ("") bo'lsa, yana bir qator chiqaring:
      //    "   javob hali yozilmagan"
    }
    ```
- Tugma: Avval kod-savolini yeching → Kodni yozing va tugmani bosing → Davom etish
- Jonli darsda (mentorda): Kodni yozib bo'lganlar — n/N
- Mentorga eslatma: Javoblari hali to'liq yozilmagan bolalar namuna yozuvni qoldiradi — kod baribir ishlaydi. Javob matnini qo'shtirnoq ichida yozishni ayting. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

**Ko'rinish:** hozirgidek 2 bosqich (A6 bajarilgan): kod-savoli yechilgach u «✓» qatoriga yig'iladi, keyin shartlar va kod oynasi chiqadi. Yordam — yopiq tugma ortida.
Animatsiya: yo'q.
Olib tashlanadi: ⌨️ 🔒 🔎 🤔 ✅ 💡 ⭐.

✎ 30.09 ChatGPT #11A **Qabul**: `length < 25` → «qisqa javob — ish ko'rinmayapti» noto'g'ri model edi («Payshanba» qisqa, lekin voqea) → shart endi bo'sh javobni tekshiradi: boshlang'ich kodda ikkita bo'sh yozuv bor, shart ma'noli (**KOD** `KOD_MATN`, `KD_SHART`, tekshiruv) · #11B **Rad**: apostrof haqidagi yordam to'g'ri — «yakka tirnoq (`'...'`) ichidagi apostrof kodni buzadi»; ChatGPT uni qo'shtirnoq haqida deb o'qigan · #11C — 29.09 da tuzatilgan · #12 (kodingni olib tashlash) **Rad**: PM darsidagi koding ekrani — dars shabloni (87-qonun), kod qisqa (`for` + `if`) · kod-savolida to'g'ri variant 2-o'ringa (4-savol A) · 🔴 FAKT: Mentor «Uch javobingiz endi kodda turadi» — boshlang'ich kodda bitta namuna va ikkita bo'sh yozuv bor, 8-ekrandagi javoblar kodga o'zi tushmaydi (`KOD_MATN` o'zgarmas) → o'quvchi ularni o'zi qo'yadi · 🔴 FAKT (DAVOM belgisi, tasdiqlandi): «uch qatorni chiqaradi» / «Yozdim — uch qator chiqdi» — qisqa javob uchun (bo'sh yozuv ham — uzunligi 0) qo'shimcha qator chiqadi → «har yozuv uchun bitta qator», «kod ishladi» · 🔴 namunadagi `eshitgan` 4-ekran iqtibosidan boshqacha edi («…ertalab guruhni ochsam yozilgan ekan») — darsning o'z qoidasiga zid (A10) → so'zma-so'z · «pastdagi qora oyna» → «terminal» · «yurgizgansiz» → «ishga tushirgansiz» (manba: backend darslarida `node server.js`) · «takrorlash-sikli, if-sharti» → «`for` sikli, `if` sharti» · «bitta tirnoq» → «yakka tirnoq (`'...'`)», qo'shtirnoq namunasi bilan.

## 11 · 4-savol ✅ (final)  `[1773]`
- Eyebrow: Yakuniy tekshiruv
- Iqtibos: Suhbatdosh: «Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim.»
- Savol: **Qaysi qator varaqqa tushadi?**
  - A — Botdagi tugmalarni ko'zga ko'rinadigan joyga qayta qo'yish kerak
  - B — ✔ Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim
  - C — Odamlar kechqurun botni ochadi, lekin tugmani topolmay chiqib ketadi
- To'g'ri: Varaqqa eshitgan javob u aytganidek tushadi.
- Xato izohlari:
  - A: Bu sizning xulosangiz — u tugmalarni qayta qo'yish haqida hech narsa demadi.
  - C: U o'zi haqida gapirdi: bitta odamning gapi hammaga yoyilmaydi.
  - (umumiy) Varaqqa eshitgan javob u aytganidek tushadi.
- Bu ekranda Mentor gapi ham, maslahat ham yo'q.

**Ko'rinish:** iqtibos, savol va 3 variant birdan. Animatsiya: yo'q (iqtibos-qator chizig'i 4-ekranda; final — sof tekshiruv).
Olib tashlanadi: 💬.

✎ 30.09 ChatGPT #13 **Rad**: uning to'g'ri varianti («Odam tugmani qidirib, topolmay chiqib ketganini aytdi») gapni qayta aytib beradi — darsning o'z qoidasiga (u aytganidek) zid bo'lardi; farqlash xato variantlarda: A — xulosa, C — hammaga yoyilgan gap · to'g'ri javob izohi bitta gap (A8) · 🔴 DAVOM 7 (tasdiqlandi): ✔ «Kecha tugmani topolmay chiqib ketgan» — odam «ketdim» degan, «kechqurun botni ochdim» tushib qolgan; takrorlash oynasi 4 va arena 12 esa «o'zgartirmasdan» deydi → ✔ = so'zma-so'z (o'rni B) · xato variantlar ✔ bilan teng uzunlikka keltirildi va o'z xatosini saqladi (A — xulosa, C — hammaga yoyilgan gap) · «qayta joylash» → «qayta qo'yish».

## 12 · Mustahkamlash (refleksiya)  `[1667]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Qaysi savolingizga eng aniq javob keldi?**
- Mentor: Ekranga qaramasdan eslang: savolingiz qanday edi va odam aynan nima dedi?
- **1-qadam:** (mustaqil rejimda) Ovoz chiqarib o'zingizga ayting: savol va javob / (jonli darsda) Sherigingizga ayting: savol va javob
  - Mustaqil taymer (30 s): ▶ 30 soniyani boshlash · Hozir ovoz chiqarib ayting · ekranga qaramasdan · To'xtatish · ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli taymer (1 daqiqa): Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi · keyin — B navbati · oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- **2-qadam:** Endi bir qator yozing · maydon «Eng aniq javob ... savolimdan keldi, unda ...»
- Yozib bo'lgach: Bugungi qoida: bo'lib o'tgan ishni so'rang, eshitgan javobni u aytganidek yozing.
- Tugma: Davom etish
- Mentorga eslatma: Uchdan biri «odam aynan nima dedi» savoliga javob berolmasa — suhbat ekranini qayta oching va 3-savol javobini birga o'qing.

**Ko'rinish (KOD — hozir ikki qadam birdan):** kirganda faqat 1-qadam (taymer); taymer tugagach yoki to'xtatilgach u «✓ Aytildi» qatoriga yig'iladi va 2-qadam (maydon) chiqadi. Yozilgach — bitta qoida-qatori.
Animatsiya: yo'q (taymer halqasi — vaqt ko'rsatkichi, bezak emas).
Olib tashlanadi: «Endi siz odam nima deydi deb o'ylab o'tirmaysiz — borib so'raysiz.» (tabrik-gap; ekranda bitta natija-qatori qoladi) · 🗣 ✍️ 🎯 ⏹.

✎ Sarlavha («uchta savolni yoddan») va Mentor («eng aniq javob») ikki xil vazifa berardi → sarlavha Mentor so'raganini so'raydi, Mentor — qanday qilib (ekranga qaramasdan) · «o'z so'zi bilan» → «odam aytganidek» · «suhbat stoli ekranini» → «suhbat ekranini».

## 13 · Natijalar (podium)  `[2360]` — o'zgarmaydi
(Tizim-UI, umumiy shablon: ball halqasi «n/4 to'g'ri javob», nishonlar qatori, jonli reyting, podium belgilari qoladi. «sessiya» va shablon — 1-dars B-5.)

## 14 · Takrorlash (kartochkalar)  `[1761]` (kartalar `[1749]`)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) |
|---|---|
| Suhbat nima? | Botni ishlatgan odamdan bo'lib o'tgan ishini so'rash |
| Voqea savoli nima? | Bo'lib o'tgan ishni so'ragan savol |
| Bo'sh savol nima? | Javobidan bo'lib o'tgan ish bilinmaydigan savol |
| Voqea savoliga javobda nima bo'ladi? | Kun, joy yoki qilingan ish |
| «Guruhda vazifani topish qiyin, shundaymi?» — bu savolda nima xato? | Javob savolda aytilgan: odam shunchaki «ha» deydi |
| Hali bo'lmagan ish haqida so'rasangiz, qanday javob keladi? | Va'da: bu ish hali bo'lmagan |
| Varaqqa nima yoziladi? | Eshitgan javob — u aytganidek |
| Varaqqa nima yozilmaydi? | Sizning xulosangiz va bitta odamning gapidan chiqarilgan umumiy gap |
| Airbnb asoschilari uy egalarining oldida nimani bilib oldi? | Yomon surat qo'yilgan uy band qilinmasligini |
| Suhbatni kimdan boshlaysiz? | Botingizni ishlatgan odamdan: sinfdosh, to'garakdosh yoki qo'shni |

- Tugmalar: o'zgarmaydi (↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim · Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish)

✎ 5-kartochka «Botim yoqdimi? — qanday savol?» (3-kartochka va arena 5 bilan bir ma'no) → 9-ekrandagi «javob savolda aytilgan» (bu tushuncha kartochkalarda yo'q edi) · 1, 6, 7-kartochka — A-bo'lim bo'yicha · «Hammasini bilasiz!» oldidagi 🎉 olindi.

## 15 · Yakun  `[2456]`
- Eyebrow: Dars yakuni · belgi: ✓ Suhbat varag'i tayyor
- Sarlavha: **Uchta savol berdingiz va eshitganingizni yozdingiz.** (yonida ball halqasi «n/4 to'g'ri javob»)
- Bugungi asosiy fikr — Javob sizda emas: uni botingizni ishlatgan odam biladi.
- CODE STRIKE arena tugmasi: 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda mentor boshlamaguncha) Mentorni kuting
- ✓ Endi siz bilasiz:
  - Botni ishlatgan odamdan bo'lib o'tgan ishini so'rash — suhbat.
  - Bo'lib o'tgan ishni so'ragan savol — voqea savoli.
  - Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol.
  - Varaqqa xulosangiz emas, eshitgan javob tushadi — u aytganidek.
- Nishonlaringiz — n/4
- Uyga vazifa · Amaliy topshiriqni bajarish → (ichi bu MD'ga kirmaydi — PM uy vazifasi)
- Keyingi dars — **«Fikr va iteratsiya».** Botga kelgan fikrlarni saralab, qaysi birini birinchi tuzatishni tanlaysiz.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓ · (jonli) Mentorni kuting
- Mentorga eslatma: Arena tugagach g'oliblarni nomlab tabriklang. Uy vazifasi: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Tekshirishda bitta narsaga qarang: javob u aytganidek yozilganmi — kun, joy yoki qilingan ish bormi?

**Ko'rinish:** hozirgidek; «Keyingi dars» qatori uy vazifasi tugmasi ostida (**KOD**).
Animatsiya: yo'q.
Olib tashlanadi: «Dars tugadi» belgisi (eyebrow «Dars yakuni» bilan bir ma'no) → mazmunli belgi · matn oldidagi 🏆 ⏳ 🏅 📝 · uy vazifasi tugmasi fonidagi 🗣 📄.

✎ 🔴 FAKT: «Keyingi dars» qatori yo'q edi (DAVOM 6) → App.jsx m5-09 «Fikr va iteratsiya» («foydalanuvchi nima dedi va nimani tuzatamiz»; 9-dars hook — botga kelgan fikrlar) · 1-xulosa 2-ekrandagi ta'rif bilan bir xil · 4-xulosa A-bo'lim bo'yicha.

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha, undov belgisisiz (1-dars bilan bir xil); medal belgisi — o'yin qatlami:
- **Good Listener** (4-ekran) — To'rt savolni berdingiz va varaqqa tushadigan qatorni birinchi urinishda topdingiz
- **Note Taker** (8-ekran) — Uch savol berdingiz va uch javobni yozib oldingiz
- **Question Checker** (hozir Sharp Sifter, 9-ekran) — To'rt savolning har birini tekshirdingiz
- **Sheet Maker** (10-ekran) — Suhbat varag'ini kod bilan chiqardingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting · hisoblagich «Nishonlar — n/4»

✎ 🔴 FAKT: Good Listener tavsifi «To'rt javobni oxirigacha eshitdingiz» — nishon aslida varaq qatorini birinchi urinishda to'g'ri tanlaganga beriladi (`AchRule` faqat 4-ekranda, `achMiss` — qator tanlovida) → tavsif shartni aytadi · «Sharp Sifter» — elak metaforasi matndan olindi (medal ikoni 🚧 ham mavzuga moslanadi — **KOD**) · matn oldidagi 🏅 olindi.

**Qisqa takrorlash oynalari (4)** — mentor jonli natijani ochgach tugma orqali; karta belgisi (`ic`) o'rniga raqam 1 · 2 · 3; yorliq «Qayta tushuntirish», oxirida «Sinfga savol:»:
1. (3) **Javob odamning oldida:** Suhbat nima — Botni ishlatgan odamning oldiga borib, **bo'lib o'tgan ishini so'rash** — suhbat. Unda fikr emas, bo'lib o'tgan ish so'raladi. · O'zingiz o'ylab topsangiz — O'zingiz o'ylab topgan javobni hech kim tasdiqlamagan: tugmani qo'shasiz, lekin uni **hech kim bosmasligi** mumkin. · Maqtov gapi — «Zo'r ekan» degan gapda odamning **botda qilgan biror ishi** yo'q — undan botga nima qo'shish kerakligi bilinmaydi. · Sinfga savol: Botingizni oxirgi marta kimga ko'rsatgan edingiz?
2. (5) **Bo'lib o'tgan ishni so'rang:** Voqea savoli — Bo'lib o'tgan ishni so'ragan savol — **voqea savoli**. Uning javobida kun ham, qilingan ish ham bo'ladi. · Hali bo'lmagan ish — Hali bo'lmagan ish haqida odam faqat **va'da** beradi: «ha, ishlataman» — bu va'da, qilingan ish emas. · Bo'sh savol — Javobidan bo'lib o'tgan ish bilinmaydigan savol — **bo'sh savol**. · Sinfga savol: «Botim yoqdimi?» degan savolga sinfdoshingiz nima deydi?
3. (7) **Javob odamning yonida topiladi:** Nyu-Yorkka borishdi — Saytdagi uylar kam band qilinayotganda Airbnb asoschilari Nyu-Yorkka jo'nashdi va u yerda **uy-ma-uy** yurishdi. · Nimani topishdi — Saytdagi suratlar yomon edi, bunday uyni **odamlar band qilmayotgan** edi. Buni ular uy egalarining yonida turib bilishdi. · Nega borishdi — Javob ularning kompyuterida emas, **uy egalarining yonida** edi. · Sinfga savol: Botingizni ishlatgan odam yoningizda o'tiribdimi?
4. (11) **Eshitganingizni yozing:** Varaqqa nima tushadi — Varaqqa **eshitgan javob** tushadi — u aytganidek. · Nima tushmaydi — Sizning xulosangiz ham, bitta odamning gapidan chiqarilgan **umumiy gap** ham. · Qachon yoziladi — Eshitgan javobni **o'sha zahoti** yozib olasiz — keyin gap boshqacha eslanadi. · Sinfga savol: Oxirgi eshitgan javobingizni u aytganidek ayta olasizmi?
- Oyna tugmalari: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

✎ «Stol ortida» kartasi → «O'zingiz o'ylab topsangiz» · «stolida emas» → «kompyuterida emas» · Airbnb izohi 6-ekranga ko'chdi · «O'sish to'xtaganda» → «uylar kam band qilinayotganda» (6-ekran fakti bilan bir xil) · «ko'rsatgandingiz» → «ko'rsatgan edingiz» · 📖 🗣️ 💭 🙋 📅 ⏳ 🕳️ ✈️ 📸 🚶 📄 🤔 ✍️ olindi.

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Suhbat nima? ✔ Botni ishlatgan odamdan bo'lib o'tgan ishini so'rash · Bo'lib o'tgan ishni odamsiz, o'zingiz taxmin qilish · Kelasi haftada nima qilishini oldindan so'rash · Botingizni ko'rsatib, u haqdagi fikrini so'rash
2. Suhbatda nima so'raladi? Bo'lib o'tgan ishga odam qo'ygan baho · Odamning kelasi haftadagi rejasi · Odamning bot haqidagi fikri · ✔ Odam o'tgan kunlarda qilgan ish
3. Voqea savoli nima? Bo'lib o'tgan ishni emas, kelajakni so'ragan savol · Botga qanday tugma kerakligini so'ragan savol · ✔ Bo'lib o'tgan ishni so'ragan savol · Javobi «ha» bo'lib qoladigan savol
4. Bo'sh savol nima? Javobida bo'lib o'tgan ish juda ko'p aytiladigan savol · ✔ Javobidan bo'lib o'tgan ish bilinmaydigan savol · Suhbatning oxirida beriladigan savol · Bir kunda ikki marta berilgan savol
5. «Botim yoqdimi?» — bu qanday savol va nega? Voqea savoli — botni tilga oldi · ✔ Bo'sh savol — qilingan ish so'ralmadi · Bo'sh savol — savol juda qisqa · Voqea savoli — javobi bir og'iz
6. «Oxirgi marta qachon unutgansiz?» — bu qanday savol va nega? ✔ Voqea savoli — bo'lgan kunni so'radi · Voqea savoli — javobi «ha» bo'ladi · Bo'sh savol — kelajakni so'radi · Bo'sh savol — botni tilga olmadi
7. Suhbatdosh «Ha, ishlataman» dedi — bundan nima bilinadi? U botni har kuni ochib turishi · U eslatma tugmasini bosgani · ✔ Faqat uning va'dasi · U vazifani payshanba unutgani
8. Varaqqa qaysi gap tushadi? Siz chiqargan xulosa · Botga kerak bo'lgan tugmalar ro'yxati · Hammaga taalluqli umumiy gap · ✔ Eshitgan javobning o'zi
9. Saytdagi uylar kam band qilinayotganda Airbnb asoschilari qayerga bordi? ✔ Nyu-Yorkka — uy egalarining oldiga · San-Frantsiskodagi yig'inga · Mehmonxonalarga — joy so'rashga · Hech qayerga — saytni o'zgartirishdi
10. Ular uy egalarining oldida nimani bilib oldi? Uy egalari narxni baland qo'yganini · Uy egalari saytga kam kirishini · ✔ Yomon surat qo'yilgan uy band qilinmasligini · Mehmonlar band qilgan uyni bekor qilishini
11. Suhbatni kimdan boshlaysiz? Bot haqida eshitmagan odamdan · ✔ Botingizni ishlatgan odamdan · Sinfda eng yaxshi o'qiydigan odamdan · Botni yozishga yordam bergan odamdan
12. Eshitgan javobni varaqqa qanday yozasiz? «Hamma shunday deydi» deb yozib qo'yaman · Qisqartirib, o'z xulosam bilan yozaman · Yozmayman — esimda qoladi · ✔ U aytganidek yozaman

✎ 30.09: 7-savol ✔ «Hech narsa bilinmaydi» → «Faqat uning va'dasi» (ChatGPT #4: va'da ham ma'lumot, faqat qilingan ish emas; o'rni o'sha) · 8 va 12-savol — bitta atama (F-0930-102) · 5, 6: «qanday savol?» → «qanday savol va nega?» — 2×2 naqshda sabab ham so'raladi, shunda «Bo'sh savol — savol juda qisqa» qisman to'g'ri bo'lib qolmaydi · 7: tire faqat ✔ da edi («Hech narsa — bu ish hali bo'lmagan», A8) → tiresiz · 8, 12: A-bo'lim («o'z so'zi bilan» → «gapning o'zi / u aytganidek») · 🔴 10: «Uy egalari surat olishni bilmasligini» qisman to'g'ri (suratlarni uy egalari yomon olgan) → «Mehmonlar band qilgan uyni bekor qilishini» · 11: «Eng ko'p kitob o'qigan odamdan» ishonarsiz → «Sinfda eng yaxshi o'qiydigan odamdan» · 2: ✔ eng qisqasi edi → «Odam o'tgan kunlarda qilgan ish» · 9: «o'sish to'xtaganda» → 6-ekran fakti bilan bir xil.

Arena (umumiy shablon, barcha darslarda bir xil): ▶ Testni boshlash · Mentor testni boshlashini kuting… · Savol n/12 · ✓ Javob qabul qilindi — natijani kuting… · Vaqt tugadi — 0 ball · Adashdingiz — 0 ball. Keyingisida olasiz. · TOP-5 · Test yakunlandi! · ↻ Testni qayta yechish — mashq (jadvalga yozilmaydi) · Arenani yopish. (Shablon belgilari — B-bo'lim.)

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — `StolBar` olinadi; `HOOK_OPTS` ikonlari (🙂 🤔) va ovoz diagrammasidagi ikonlar olinadi; sarlavha, Mentor, variant 2 va izoh matni yangi.
2. s1 — `DEMO_QATOR` ikonlari va «📄» yorliqdan olinadi; har qatorda savoldan javobga strelka chiziladi (`s1row` kechikishlari bilan).
3. s2 — `S2_CARDS` nomlari/matni/ikonlari; tugmadan 👆; «◂» → «←»; xulosa matni.
4. s3, s5, s7, s11 — variant va izoh matnlari (o'rinlar joyida); s5 savolidan ⏳; s11 iqtibosdan 💬; `QuestionScreen` jonli yozuvlaridan ⚡ 📨.
5. s4 — «Stol» yorliqlari (🪑) olinadi, 👤 → harf-doira + «Suhbatdosh» (nom 2-darsdan olinmaydi); `SAVOLLAR[2..3].bil`, `YOZUV` matnlari (✔ = so'zma-so'z iqtibos); to'g'ri qatordan keyin iqtibos↔qator chizig'i; nav yorliqlaridan ① ② ③, «▸» → «→»; sarlavha va Mentor.
6. s6 — `KEYS_STEPS` matni (1-bosqichga Airbnb izohi, 2-bashorat savoliga vaziyat, 3-bosqich «Nega aynan Nyu-York?», 4-bosqichdan surat olindi, 6-bosqichga surat va natija); hit/miss yozuvlari; barcha ikonlar va eyebrow'dan 🏠.
7. s8 — Mentor bitta tarmoq; lenta matni; Topshiriq panelidagi 3 qator va pastki `done-mini` olinadi; `sfb ok` matni yumshatiladi; izohlar matni; emoji.
8. s9 — `TOSIQLAR` yorliqlari/ikonlari, `ELAK_SAVOL[3]` yangi savol (yo'l `otdi` o'zgarmaydi), `ELAK_TUZAT`, yakun lentasi va `done-mini` matni; Yordam bloki olinadi; eyebrow, sarlavha, Mentor, karta yorlig'i.
9. s10 — 2-bosqich Mentori, `KD_SHART[0]`, tugma yorlig'i («Yozdim — kod ishladi»), `KOD_MATN` namuna `eshitgan` = 4-ekran iqtibosi va 1-izoh; Yordam matni; ⌨️ 🔒 🔎 🤔 ✅ 💡 ⭐.
10. s12 — 2-qadam 1-qadam (taymer) tugagach/to'xtatilgach chiqadi, 1-qadam «✓ Aytildi» qatoriga yig'iladi; mukofot bloki bitta qoida-qatori; sarlavha, Mentor; ⏹ 🗣 ✍️ 🎯.
11. s14 — `FLASHCARDS` 1, 5, 6, 7-karta; `fc-done` dan 🎉.
12. s15 — «Keyingi dars» qatori qo'shiladi; `done-chip` matni; `RECAP` 1 va 4-band; `HW_TOKENS` fonidan 🗣 📄 (uy vazifasi kartasining ichiga tegilmaydi).
12a. 30.09: s4 — savollar navbat bilan (joriy savol → «✓ n-savol» qatori → keyingisi), 45 s maslahat olinadi · s6 — `KEYS_STEPS` 7 → 5 · s10 — `if` sharti bo'sh javob (`j.eshitgan === ""`), `KD_SHART`, tekshiruv va yordam matni; kod-savolida to'g'ri variant 2-o'rin · s0 variantlari · U1 (2-ekran kartalarida `›` / `✓`; harakat tugmalari bir uslubda) · test izohlari bitta gap (A8) · atamalar: «eshitgan javob» / «u aytganidek» (A11).
13. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`): `RECAPS` (`ic` → raqam, yorliqlar 📖 🗣️), `ACHIEVEMENTS` (nom, tavsif, 🚧 ikon), `AchRule` oldidagi 🏅, `StudentPracticePulse` (👥 ✏️), `MentorPracticeStats` yorliqlari, `QZ_BG_SHAPES` («elak» so'zi va 🗣 📄 ✍️), `QUIZ_BANK` (1, 2, 5, 6, 7, 8, 9, 10, 11, 12-savol matni; `correct` indekslari o'zgarmaydi).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **9-dars v2:** 3-ekran «Umumiy savol / Aniq savol» («Yoqdimi?» / «Qayerda qiynaldingiz?») — shu darsdagi «bo'sh savol / voqea savoli» bilan bir tushuncha. 9-dars shu nomlarni olsin va «8-darsda ko'rgansiz» deb bog'lansin (A2).
2. **PM uy vazifasi** (dars ichidagi `HwCard`; alohida `PmLesson20.homework.jsx` fayli yo'q) — tegilmaydi, MD'ga kirmadi. Unda «o'z so'zi bilan» 2 joyda bor (`HW_STEPS`) — uy vazifasi ko'rilganda «u aytganidek» bilan tenglashsin.
3. **2-dars (`PmLesson19`) ↔ 8-dars:** 2-darsdagi «U yerda kimlar bor?» maydoni guruhni oladi; 8-dars endi uni odam nomi sifatida ishlatmaydi. 2-dars v2 ga o'zgarish kerak emas — faqat bog'liqlik eslatmasi.
4. **Umumiy shablon belgilari** (podium 🥇🥈🥉, arena 🏆 ⏳, `MentorNote` 📋 🧑‍🏫, «sessiya») — barcha darslarda bir xil → 1-dars B-5 bilan bitta ish.
5. **RU matni** — dars ikki tilli (`tr({uz, ru})`); o'zbekcha tasdiqlangach ruscha qatorlar ham shu MD bo'yicha yangilanadi.
6. **Qonun nomzodlari → `QONUN_NOMZODLARI.md`:** (a) «Dars qoidasi test variantiga ham tegishli: qoida "o'zgartirmasdan" desa, ✔ — manbaning so'zma-so'z nusxasi» · (b) «Bir so'z darsda ikki qarama-qarshi ma'noda ishlatilmaydi (8-dars "stol")».

---

## Agent eslatmalari
1. **DAVOM 7, «o'z so'zi» qoidasiga ✔ zid — tekshirdim, TO'G'RI.** `YOZUV[1]` («Payshanba kuni vazifani unutgan…») va `ScreenFinalTest` opts[1] («…chiqib ketgan») gapni o'zgartirgan; `KOD_MATN` namunasi ham. Yechim — ✔ so'zma-so'z, «o'z so'zi bilan» → «u aytganidek». O'rinlar (`YOZUV` ✔ 2-o'rin, `s11:1`) o'zgarmadi.
2. **DAVOM 7, 9-ekran «to'rt yangi savol» — tekshirdim, TO'G'RI:** `ELAK_SAVOL[3].t` = `SAVOLLAR[3].q`. Yangi voqea savoli yozildi, `yol: 'otdi'` o'zgarmadi.
3. **Savol — 11-ekran ✔ iqtibosning aynan o'zi.** O'quvchi matnni solishtirib topishi mumkin, lekin darsda aynan shu sinaladi: gapni o'zgartirmasdan yozish. Xato variantlar ham iqtibos so'zlaridan tuzilgan (C deyarli bir xil, faqat hammaga yoyilgan). Boshqacha variant kerak bo'lsa: iqtibos 2 gapli bo'ladi, ✔ — uning bitta gapi.
4. **Savol — 8-ekranda kimga savol beriladi?** Kodda Mentor 2-darsdagi ro'yxatdan «bitta odam»ni tanlatardi, sinfda esa savol sherikka beriladi (mentor eslatmasi «juftlik almashinuvi», 12-ekran «Sherigingizga»). Men Mentorni «yoningizdagi odam» qildim, lentani uy vazifasiga ko'prik qildim. Tasdiqlang.
5. **Savol — «elak / to'siq» metaforasi matndan olindi** (A1: asosiy nom — «savolni tekshirish»), faqat tushish animatsiyasida qoladi; nishon «Sharp Sifter» → «Question Checker». Agar «savol-elak» nomi PM etalonida qat'iy mexanika nomi bo'lsa, Mentorda bir marta qaytaramiz: «savolni elakdan o'tkazgandek tekshiring».
6. **Airbnb faktlari:** 2007 — San-Frantsiskodagi yig'in, 3 havo to'shagi; 2009 — tushum oz, asoschilar Nyu-Yorkka (e'lonlarning ko'pi o'sha yerda) borib, uylarni o'zlari qayta suratga olishgan, keyin band qilishlar ko'paygan. «Saytga yangi odamlar qo'shilmay qo'ydi» shu sababli tuzatildi. Bosqichlar tartibi o'zgarmadi — faqat matn.
7. **`GearPanel` bu darsda yo'q** (grep: 0) — qaror F-0929-63 bo'yicha ish yo'q. «Botjon», «daftar», «signal» ham yo'q (grep: 0). Hook — PM, to'g'ri javobsiz (A12), shuning uchun «Aynan!» bo'yicha KOD yo'q.
8. **Arena 5/6 (2×2 naqsh, §107):** savol «… va nega?» bo'ldi — sabab so'raladi va «to'g'ri tur, xato sabab» varianti qisman to'g'ri bo'lib qolmaydi. Agar naqshni butunlay olib tashlash kerak bo'lsa, bu KOD emas — faqat matn (o'rinlar joyida).
