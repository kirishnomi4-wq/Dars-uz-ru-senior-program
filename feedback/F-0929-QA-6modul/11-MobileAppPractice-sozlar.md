# 6-Modul (LMS: 8-Modul) · 11-dars «Praktika: mobil ilova» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/MobileAppPracticeLesson.jsx` · 20 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook:** o'tgan darsda qurilgan web mini-do'kon bor, lekin mijozlar telefonda. O'quvchi «🌐 Sayt telefonda» va «📱 Mobil ilova» ko'rinishlarini almashtirib solishtiradi va mijozga nima kerakligini tanlaydi (har qanday tanlovga «To'g'ri» izohi chiqadi).
- **Markaziy mexanika:** «Mobil ilova quruvchi» (7-ekran) — 4 qadamga (List · Detail · Savat · Checkout) prompt yuboradi, telefonda qism paydo bo'ladi, keyin «▶ Xarid qil». Undan keyin savat+reduce, checkout oqimi, sayqal, telefonda bug, Expo Go QR bilan ulashish.
- **Asosiy metafora:** «Siz — direktor, AI kod yozadi (ishchi)» + «bitta tizim, ko'p eshik» (web · bot · mobil — bitta backend). Oxirida (16-ekran, nishonlar, yakun) to'satdan GASTROL tili chiqadi: sahna, port, premyera, gastrol.
- **Yakun:** 4 sahnani (Katalog → Detal → Savat → Buyurtma) sudrab tartiblash, podium, 12 kartochka, «Mobil ilovangiz gastrolga chiqdi».

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — mijozlar telefonda | hook | sayt / ilova ko'rinishini almashtiradi, 3 variantdan tanlaydi | — |
| 1 | Reja | qoida | bugungi maqsad + 5 qadam | — |
| 2 | O'sha backend — yangi eshik | tushuncha | «Mobil ilova» eshigini ulaydi | — |
| 3 | Ilova xaritasi | tushuncha | 4 ekranni (List/Detail/Savat/Checkout) bosib ko'radi | — |
| 4 | 1-savol | test | mobil ilova mahsulotni qayerdan oladi | ✅ |
| 5 | Loyiha kuni ritmi | tushuncha | Reja → Prompt → AI kod → Telefonda test → Tuzat siklini ochadi | — |
| 6 | 2-savol (Tekshiruv) | test | loyiha kunida sizning rolingiz | ✅ |
| 7 | Mobil ilova quruvchi | markaziy | 4 qadamga prompt yuboradi → «▶ Xarid qil» | — |
| 8 | Savat + jami | amaliyot | «+» bilan 2 ta mahsulot qo'shadi, badge va reduce | — |
| 9 | Checkout → backend | tushuncha | buyurtma oqimini 5 qadamda kuzatadi | — |
| 10 | 3-savol | test | «Buyurtma qil» bosilganda nima bo'ladi | ✅ |
| 11 | Dovodka · sayqal | tushuncha | chala / sayqallangan ko'rinishni solishtiradi | — |
| 12 | Telefonda test · bug | case | test → sabab → tuzatish prompti → qayta test | — |
| 13 | 4-savol | test | mobil ilovani qanday test qilamiz | ✅ |
| 14 | Expo Go · deploy | markaziy | «Chiqar» → QR → do'st skanlaydi + bir o'quvchining yo'li | — |
| 15 | Qoida | qoida | 4 narsani unutmang | — |
| 16 | Yakuniy · sahnalarni yig'ing | yakuniy | 4 sahnani sudrab tartiblaydi | ✅ (final) |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + nishonlar | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (4, 6, 10, 13-ekranlar); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
o'sha backend · bitta tizim, ko'p eshik · direktor / ishchi · prompt → kod → telefonda test → tuzat · Expo Go · haqiqiy telefon · List · Detail · Savat · Checkout · badge (savat soni) · state · reduce · POST /orders · GET /products · pipeline · dovodka = sayqal · StyleSheet · QR · deploy · (oxirida) sahna · port · premyera · gastrol

---

## 0 · Kirish — mijozlar telefonda  `[724]`
- Eyebrow: Kirish
- Sarlavha: **Do'koningiz web'da bor. Lekin mijozlar telefonda. Ularga nima beramiz?**
- Mentor: Web do'kon (o'tgan darsda qurgan) tayyor. Endi o'sha do'konning MOBIL ilovasini quramiz. Ikki holatni bosib solishtiring.
- Tugmalar (almashtirish): 🌐 Sayt telefonda · 📱 Mobil ilova
- «Sayt telefonda» telefoni: 🔒 mini-dokon.uz · Mini-do'kon · Olma — 12 000 so'm · Non — 5 000 so'm · Sut — 9 000 so'm · *matn mayda, tugmalar noqulay, har safar brauzer ochish kerak…*
- «Mobil ilova» telefoni: Mini-do'kon · (o'sha 3 mahsulot) · tugma «Savatga o'tish»
- Savol: **Mijozga nima kerak?**
  - Hech narsa — sayt brauzerda ham ochiladi
  - Mobil ilova — telefon ekraniga moslangan, qulay, App Store/Expo orqali
  - Saytni kattalashtirish
- Javobdan keyin (qaysi variant tanlansa ham): To'g'ri — telefon ekraniga moslangan **mobil ilova** kerak. Bugun mini-do'konning mobil versiyasini **quramiz**, **telefonda testlaymiz** va **Expo Go bilan ulashamiz**. Va yana o'sha falsafa: siz — direktor.
- Tugma: Davom etish

## 1 · Reja  `[778]`
- Eyebrow: Reja
- Sarlavha: **Loyiha kuni: mobil ilovani quramiz va ulashamiz**
- Mentor: Bugun yangi sintaksis emas — **amaliyot**. Siz direktor sifatida AI'ga buyurib, mobil ilovani qadam-qadam yig'asiz, telefonda testlaysiz.
- Blok «Bugungi maqsad»: **mini-do'kon → mobil ilova** — Qurib, telefonda testlab, Expo Go bilan ulashamiz.
  - → Sintaksisni T6/T7 da o'rgandingiz — bugun QURASIZ
- «5 qadam»:
  1. O'sha backendga ulanish (yangi backend qurmaymiz)
  2. List + Detail ekranlar (mahsulotlar, fetch)
  3. Savat + jami narx (state, reduce)
  4. Checkout → buyurtma backendga
  5. Telefonda test + sayqal + Expo Go deploy · *deploy* (yorliq)
- Tugmalar (telefonda): 5 qadamni ko'rish / ↩ Maqsadni ko'rish · Boshlaymiz →

## 2 · O'sha backend — yangi eshik  `[811]`
- Eyebrow: Bitta tizim
- Sarlavha: **O'sha backend — yangi eshik**
- Mentor: Mobil ilova noldan backend qurmaydi! U o'tgan darsda qurgan O'SHA Node.js + PostgreSQL'ga ulanadi. Mobil — bitta tizimning yana bir «eshigi». Mobil eshikni ulang.
- Eshiklar: Web sayt ✓ · Telegram bot ✓ · Mobil ilova — «ULA →»
- Markaz: 🟢 **Bitta backend** · Node.js + PostgreSQL (GET /products · POST /orders)
- Ulangach: Mana o'sha g'oya: **ko'p eshik — bitta tizim**. Web, bot, mobil — uchchalasi o'sha bazadagi o'sha mahsulot va buyurtmalardan foydalanadi.
- Tugma: Mobil eshikni ulang → Davom etish

## 3 · Ilova xaritasi  `[859]`
- Eyebrow: Ilova xaritasi
- Sarlavha: **Ilova — 4 ekran**
- Mentor: Mana qurmoqchi bo'lgan ilovamiz. 4 ekranni bosib, telefonda ko'ring: mahsulotlar → detal → savat → buyurtma.
- Tugmalar: List · Detail · Savat · Checkout (ko'rilganiga ✓)
- Telefon ko'rinishlari:
  - List: Mini-do'kon · Olma / Non / Sut (narxlari bilan)
  - Detail: ‹ Olma · 🍎 · 12 000 so'm · Yangi, shirin olma. Kuniga yetkazib beramiz. · «Savatga qo'shish»
  - Savat: Olma, Non · Jami: 17 000 so'm · «Buyurtma qil»
  - Checkout: Buyurtma · ✅ Rahmat! Buyurtmangiz qabul qilindi · #1042 · 17 000 so'm
- Matn: Bularning hammasi o'sha backenddan ma'lumot oladi — yangi server kerak emas.
- Hammasi ko'rilgach: 4 ekran tayyor reja. Endi ularni AI bilan birma-bir quramiz.
- Tugma: Ekranlarni ko'ring (1/4) → Davom etish

## 4 · 1-savol ✅  `[901]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilova mahsulotlarni qayerdan oladi?**
  - ✔ O'sha mavjud backenddan — GET /products bilan
  - Yangi backend yozamiz, faqat mobil uchun
  - Mahsulotlarni ilova ichiga qo'lda yozamiz
  - Hech qayerdan — mobil ilovada baza bo'lmaydi
- To'g'ri: To'g'ri! Mobil ilova o'sha Node.js + PostgreSQL backendga ulanadi (GET /products). Web, bot, mobil — bitta tizimning eshiklari, hammasi o'sha bazadan.
- Xato izohlari:
  - «Yangi backend» (B) tanlansa — umumiy izoh chiqadi: O'sha backend, GET /products — bitta tizim.
  - «Qo'lda yozamiz» (C): Qo'lda yozsangiz — yangilanmaydi. Backenddan fetch qiling.
  - «Hech qayerdan» (D): Ma'lumot backendda — ilova undan fetch qiladi.
  - (hech qachon chiqmaydi — to'g'ri javob raqamiga yozilgan) Yangi backend shart emas — o'sha bittasi hamma eshikka xizmat qiladi.
- Umumiy: Qaytadan urinib ko'ring · 📖 Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · Loyiha kuni ritmi  `[911]`
- Eyebrow: Loyiha kuni ritmi
- Sarlavha: **Ritm: prompt → kod → telefonda test → tuzat**
- Mentor: Loyiha kunida har qadam shu siklda quriladi. Yangi narsa — **telefonda** ko'rib test qilish. Bosib oching.
- Sikl: Reja → Prompt → AI kod → Telefonda test → Tuzat
- Blok «Direktor / ishchi»: Siz aniq buyurasiz, **AI kod yozadi**, siz uni o'qiysiz va **Expo Go'da telefonda** sinab ko'rasiz. Bug bo'lsa — aniq tuzatish prompti.
- Tugmalar: ▶ Siklni boshlash · Keyingi qadam →
- Oxirida: «Ishladi» degani — telefonda o'z ko'zingiz bilan ko'rdingiz, degani. Endi quramiz.
- Tugma: Siklni oching (0/5) → Davom etish

## 6 · 2-savol ✅  `[942]`
- Eyebrow: Tekshiruv · «Mustahkamlash»
- Savol: **Loyiha kunida sizning rolingiz?**
  - AI bergan kodni o'qimasdan ishlatish
  - Hamma kodni o'zingiz qo'lda yozish
  - ✔ Aniq buyurib, kodni o'qib, telefonda sinash
  - Faqat dizayn va ranglarni tanlash
- To'g'ri: To'g'ri! Siz direktorsiz: aniq buyurasiz, AI kodini o'qib tushunasiz va Expo Go'da telefonda sinab ko'rasiz. Test qilmaguningizcha «ishladi» deyolmaysiz.
- Xato izohlari:
  - «O'qimasdan» (A): O'qimasdan ishlatish — bug'larni ko'rmaysiz.
  - «Qo'lda yozish» (B) — umumiy izoh chiqadi: Buyuring, kodni o'qing, telefonda testlang.
  - «Dizayn» (D): Dizayn ham muhim, lekin asosiy — buyuring, o'qing, telefonda testlang.
  - (hech qachon chiqmaydi — to'g'ri javob raqamiga yozilgan) Hammasini qo'lda emas — AI yozadi, siz boshqarasiz.

## 7 · Mobil ilova quruvchi (markaziy)  `[952]`
- Eyebrow: Mobil ilova quruvchi · jonli
- Sarlavha: **Ilovani prompt bilan yig'ing**
- Mentor: Har qism uchun AI'ga prompt yuborasiz — kod paydo bo'ladi va telefonda o'sha qism ko'rinadi. 4 qadamni quring, keyin «Xarid qil»!
- Telefon (bo'sh): Ilova bo'sh. List ekranni qo'shing →
- Qadamlar (har biri «prompt yubor» → «qo'shildi»):
  - **List ekran** — «Mahsulotlarni o'sha backenddan fetch qilib FlatList'da ko'rsat» · `fetch(API + "/products") → <FlatList data={products} />`
  - **Detail + navigatsiya** — «Mahsulot bosilganda Detail ekranga o't (Stack Navigator)» · `navigation.navigate("Detail", { id })`
  - **Savat** — «Savatga qo'shish tugmasi + yuqorida savat soni (badge)» · `setCart([...cart, product]) · badge = cart.length`
  - **Checkout** — «Buyurtma qil tugmasi → o'sha backendga POST /orders» · `fetch(API + "/orders", { method: "POST", body })`
- Tanlangan qadam bloki: «[qadam] — promptingiz» + prompt + kod
- Hech narsa tanlanmagan: Qadamni bosing — promptni va AI yozgan kodni ko'rasiz, telefonda qism paydo bo'ladi.
- Telefonda tugma: Buyurtma qil · Pastda: ▶ Xarid qil
- Xariddan keyin telefonda: ✅ Buyurtma yuborildi! Backend qabul qildi.
- Xulosa: 📱 **Ilova ishladi!** — List → savat → buyurtma → o'sha backend. To'liq mobil ilova tayyor.
- Tugma: Ilovani quring (0/4) → Davom etish

## 8 · Savat + jami  `[1012]`
- Eyebrow: Savat + jami
- Sarlavha: **Savat va jami narx**
- Mentor: «+» bosib mahsulot qo'shing — yuqoridagi savat soni (badge) sakraydi, jami narx **reduce** bilan o'zi hisoblanadi (Modul 2 dagi callback!).
- Telefon: Mini-do'kon · 3 mahsulot «+» bilan · Jami: 0 so'm
- Blok «Jami narx — reduce bilan»:
  ```js
  const jami = cart.reduce(
    (sum, p) => sum + p.price, 0
  );
  ```
  Har mahsulot narxini qo'shib boradi. Savatda **N** ta · jami **X so'm**.
- 2 ta qo'shilgach: Badge = `cart.length`, jami = `reduce`. State o'zgarsa — ekran o'zi yangilanadi. React shu.
- Tugma: Savatga 2 ta qo'shing (0/2) → Davom etish

## 9 · Checkout → backend  `[1050]`
- Eyebrow: Checkout → backend
- Sarlavha: **«Buyurtma qil» — o'sha tizimga tushadi**
- Mentor: Mobil buyurtma ham o'tgan darsdagi pipeline'ga ulanadi: backend → baza saqlaydi → bot adminga xabar beradi. Bosib, oqimni kuzating.
- Oqim (↓):
  1. Mobil: «Buyurtma qil» bosildi
  2. Backendga POST /orders yuborildi (o'sha Node.js)
  3. PostgreSQL: buyurtma saqlandi
  4. Telegram: adminga xabar bordi
  5. Mobil: «Rahmat! Buyurtmangiz qabul qilindi»
- Tugmalar: ▶ Buyurtma qil · Keyingi qadam →
- Oxirida: Telefondan kelgan buyurtma ham bazaga tushdi va bot xabar berdi — xuddi web'dagidek. **Bitta tizim, ko'p eshik.**
- Tugma: Oqimni kuzating (0/5) → Davom etish

## 10 · 3-savol ✅  `[1077]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil «Buyurtma qil» bosilganda nima bo'ladi?**
  - Faqat telefon ichida saqlanadi, hech qayerga bormaydi
  - ✔ O'sha backendga POST /orders ketadi → baza saqlaydi → bot xabar beradi
  - Yangi mobil backend ishga tushadi
  - Hech narsa — mobil ilova buyurtma qabul qilolmaydi
- To'g'ri: To'g'ri! Mobil ilova o'sha backendga POST /orders yuboradi. Buyurtma PostgreSQL'ga saqlanadi va Telegram bot adminni xabardor qiladi — web bilan bir xil pipeline.
- Xato izohlari: Telefonda qolmaydi — backendga yuboriladi, aks holda admin ko'rmaydi. · Yangi backend yo'q — o'sha bitta backend. · Qabul qiladi — POST /orders orqali. · (umumiy) POST /orders → baza + bot. Bitta tizim.

## 11 · Dovodka · sayqal  `[1087]`
- Eyebrow: Dovodka · sayqal
- Sarlavha: **«Ishlaydi» yetarli emas — sayqallang**
- Mentor: Ilova ishlasa ham, mijoz uni ko'radi. StyleSheet bilan rang, bo'shliq, tartib qo'shamiz. Ikki holatni solishtiring.
- Tugmalar: 🩶 Chala (rangsiz) · ✨ Sayqallangan
- Chala: **Chala ko'rinish** — Rang yo'q, bo'shliq yo'q, tugmalar quruq. Ishlaydi — lekin mijoz ishonmaydi.
- Sayqallangan: **Sayqallangan** — StyleSheet: ranglar, yumshoq burchaklar, bo'shliq, soyalar. O'sha ilova — lekin haqiqiy ilovadek.
- Ikkalasi ko'rilgach: Dovodka = sayqal. «Ishlaydi»dan keyin «chiroyli va qulay»ni qo'shing — bu ham direktor ishi.
- Tugma: Ikkalasini ko'ring → Davom etish

## 12 · Telefonda test · bug  `[1126]`
- Eyebrow: Telefonda test · bug
- Sarlavha: **Telefonda test: bug topiladi → tuzatiladi**
- Mentor: Expo Go'da haqiqiy telefonda sinab ko'rasiz — va bug chiqadi! Bosib, tuzatish siklini ko'ring.
- Qadamlar (karta: matn + izoh):
  1. **TELEFONDA TEST** — Expo Go'da savatga 2 mahsulot qo'shasiz... lekin yuqoridagi badge hali «1» ko'rsatyapti! 🐞 · *Haqiqiy telefonda sinab ko'rmasangiz, bu bug'ni ko'rmaysiz.*
  2. **SABAB** — Savat soni (state) to'g'ri yangilanmayapti — kod eski qiymatdan foydalanyapti. · *Avval kodni o'qib, sabab qayerda — tushunasiz.*
  3. **TUZATISH PROMPTI** — «Savatga qo'shganda badge'ni cart.length bilan bog'la, har qo'shilganda yangilansin.» · *Aniq tuzatish — butun ilovani qayta yozdirmaysiz.*
  4. **QAYTA TEST** — ✅ Endi badge «2» ko'rsatadi. Savat to'g'ri ishlaydi! · *Sikl: test → bug → tuzat → qayta test. Dovodka shu.*
- Tugmalar: ▶ Telefonda sinash · Keyingi qadam →
- Oxirida: Mana dovodka: telefonda test → bug → aniq tuzatish → qayta test. Emulyator emas — **haqiqiy qurilma** rost bug'larni ko'rsatadi.
- Tugma: Siklni kuzating (1/4) → Davom etish

## 13 · 4-savol ✅  `[1163]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilovani qanday test qilamiz?**
  - Test qilmaymiz — AI to'g'ri yozib beradi
  - Faqat ranglar to'g'ri chiqqanini tekshirib
  - Faqat kompyuterda kodga qarab, ochmasdan
  - ✔ Expo Go bilan haqiqiy telefonda, oqimni bosib ko'rib
- To'g'ri: To'g'ri! Expo Go bilan haqiqiy telefonda ochib, har ekran va oqimni (List → savat → buyurtma) bosib sinaymiz. Real qurilma — real bug'lar (sekinlik, badge, tugma joyi).
- Xato izohlari:
  - «Test qilmaymiz» (A): AI xato qiladi — telefonda test shart.
  - «Faqat ranglar» (B) — umumiy izoh chiqadi: Expo Go, haqiqiy telefon, butun oqim.
  - «Kompyuterda kodga qarab» (C): Kod to'g'ri ko'rinishi mumkin, lekin telefonda boshqacha ishlaydi.
  - (hech qachon chiqmaydi — to'g'ri javob raqamiga yozilgan) Rang — bir qismi xolos. Butun oqimni sinang.

## 14 · Expo Go · deploy (markaziy)  `[1173]`
- Eyebrow: Expo Go · deploy
- Sarlavha: **Expo Go deploy: QR → do'st telefonida**
- Mentor: Ilova tayyor — endi ulashamiz. «Chiqar» bosing → QR paydo bo'ladi → do'stingiz skanlaydi → uning telefonida ishlaydi!
- Tushuntirish (boshida): Expo Go — telefonga o'rnatiladigan ilova. QR'ni skanlasangiz, sizning ilovangiz darrov ishga tushadi (App Store kerak emas).
- Telefonlar: Sizning telefon · (QR) → · Do'st telefoni ✓
- Tugmalar: 📤 Expo Go'da chiqar → 📲 Do'st QR'ni skanlaydi
- Oxirida — ro'yxat «Bir o'quvchining yo'li»:
  - QURDI — List → Detail → Savat → Checkout — har birini prompt bilan qurdi
  - SAYQALLADI — StyleSheet bilan ranglar, bo'shliq, tartib qo'shdi
  - TESTLADI — Expo Go'da haqiqiy telefonda xarid qilib ko'rdi, bug topdi
  - DEPLOY — Expo Go QR bilan ulashdi — do'sti telefonida ishladi
  - (izoh maydoni `why` bor, lekin ekranga chiqmaydi: «T6/T7 bilimini ishga soldi…» va h.k.)
- Xulosa: Bitta backend, ko'p telefon. Tayyor ilova boshqalar qo'lida ishlayapti. Endi o'z rejangizni yozing.
- Tugma: Ulashing → Endi navbat sizga →

## 15 · Qoida  `[1226]`
- Eyebrow: Qoida
- Sarlavha: **Mobil loyiha: quring · testlang · sayqallang · deploy**
- Mentor: Yodda tuting: o'sha backendga ulaning, telefonda sinab ko'ring, sayqallang, Expo Go bilan ulashing.
- Blok: 🎬 **Siz — direktor** — AI kod yozadi, siz telefonda test qilib, ilovani yetkazasiz.
- «4 narsani unutmang»:
  - O'SHA BACKEND — yangi server qurmaysiz
  - TELEFONDA TEST — Expo Go, haqiqiy qurilma
  - SAYQALLANG — StyleSheet bilan chiroyli qiling
  - DEPLOY — Expo Go QR bilan ulash
- Tugma: Yakuniy ishga →

## 16 · Yakuniy · sahnalarni yig'ing ✅ (final)  `[1255]`
- Eyebrow: Yakuniy · sahnalarni yig'ing
- Sarlavha: **Oxirgi qadam: mobil ilova 4 sahnasini to'g'ri tartibda yig'ing.**
- Mentor: Web-shouni mobil sahnaga port qildingiz. Endi 4 sahnani xarid oqimi tartibida joylang: mahsulotlar ro'yxati → mahsulot sahifasi → savat → buyurtma.
- Bo'laklar: Katalog (List) · Detal (Detail) · Savat (Cart) · Buyurtma (Checkout)
- Uyachalar (yo'l-ko'rsatkich): mahsulotlar ro'yxati · bitta mahsulot sahifasi · tanlangan mahsulotlar · buyurtmani yakunlash · «bu yerga joylang»
- To'g'ri: To'g'ri tartib! / To'g'ri oqim: Katalog → Detal → Savat → Buyurtma!
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Oxirida: ✓ Sahnalar tayyor: **Katalog → Detal → Savat → Buyurtma**. Bitta backend, 4 sahna — mobil ilova to'liq yig'ildi.
- Tugma: Sahnalarni yig'ing → Davom etish

## 17 · Natijalar (podium)  `[1803]`
- Umumiy shablon: **Kim g'olib?** · Natijalar · Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin · 🏆 To'liq reyting · Davom etish

## 18 · Takrorlash (kartochkalar)  `[1976]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Mobil ilova mahsulotlarni qayerdan oladi? | O'sha backenddan | GET /products so'rovi bilan, qo'lda yozilmaydi |
| Loyiha kunida sizning rolingiz qanday? | Direktor | Siz aniq buyurasiz, AI kod yozadi, siz o'qib tushunasiz |
| Kod haqiqatan ishlaganini qanday bilasiz? | Telefonda ko'rsangiz | Expo Go'da o'z ko'zingiz bilan sinaysiz |
| Savatga solingan mahsulotlar qayerda turadi? | state | state o'zgarsa, ekran o'zi yangilanadi |
| Savatdagi jami narxni qaysi usul hisoblaydi? | reduce | Ro'yxatdagi barcha narxni bitta songa yig'adi |
| Bir ekrandan ikkinchisiga nima yordamida o'tiladi? | navigation | Ekranlarni Stack Navigator boshqaradi |
| Buyurtma backendga qaysi so'rov bilan yuboriladi? | POST /orders | Buyurtma bazaga yoziladi, bot adminni ogohlantiradi |
| Ilovaga rang, bo'shliq va tartib nima orqali beriladi? | StyleSheet | Ilova shu bosqichda sayqallanadi |
| Savat ustidagi kichik son (badge) qayerdan olinadi? | cart.length | Savatdagi mahsulotlar sonini ko'rsatadi |
| Bug topilsa butun ilovani qayta yozasizmi? | Yo'q, aniq tuzatiladi | Faqat buzilgan joyga aniq prompt beriladi |
| Tayyor ilovani do'stingiz telefonida qanday ochasiz? | Expo Go QR bilan | App Store'ga qo'yish shart emas |
| Nega ilovani emulyator emas, real telefonda sinaymiz? | Rost bug chiqadi | Tugma joyi, sekinlik, badge xatosi shunda ko'rinadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[1988]`
- Eyebrow: Tayyor · belgi: ✓ Premyera bo'ldi
- Sarlavha: **Mobil ilovangiz gastrolga chiqdi.**
- Endi siz bilasiz:
  - Mobil ilova o'sha backendga ulanadi (bitta tizim, ko'p eshik) — yangi server qurmaysiz
  - List → Detail → Savat → Checkout — har sahna prompt bilan port qilinadi
  - Savat = state, jami = reduce; state o'zgarsa ekran o'zi yangilanadi
  - Telefonda test (Expo Go) bug'ni tutadi → aniq tuzatish prompti bilan tuzatiladi
  - Deploy = Expo Go QR → do'st telefonida ochiladi (App Store kerak emas)
- Uyga vazifa (tugma: **Uyga vazifa** · Amaliy topshiriqni bajarish →; fonda so'zlar: amaliyot · loyiha · mashq · natija):
  - **Quring** — o'z mobil ilovangizni boshlang, o'sha backendga ulang
  - **Testlang** — Expo Go'da telefonda har ekranni bosib sinang
  - **Ulashing** — sayqallab, QR bilan do'stingizga bering, fikr oling
- 🚀 Keyingi dars — To'liq tizim (capstone): web + mobil + bot + backend + baza bitta tizimga.
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎭 On Tour — Web bo'lakni mobil sahnaga ko'chirdingiz (1-savol) · 🎬 Dress Rehearsal — Aniq buyurib, kodni o'qishni bildingiz (2-savol) · ✨ Final Polish — Buyurtma o'sha pipeline'ga tushishini bildingiz (3-savol) · 🎉 Premiere Night — Ilovani Expo Go bilan telefonda sinadingiz (4-savol)
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (4):** (sarlavha: 📖 Qayta tushuntirish · 🗣️ Sinfga savol · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz · Yopish)
1. O'sha backend — bitta tizim: 🔌 Mobil noldan qurmaydi — Mobil ilova yangi server yozmaydi — **o'sha Node.js + PostgreSQL** backendga ulanadi. · 📥 Mahsulot fetch bilan keladi — Ilova mahsulotlarni **GET /products** orqali backenddan oladi, ichiga qo'lda yozmaydi. · 🚪 Ko'p eshik, bitta tizim — Web, bot, mobil — hammasi o'sha bazadan foydalanadi. · Sinfga savol: Mobil ilova mahsulotlarni qayerdan oladi?
2. Direktor va ishchi: 🎬 Siz — direktor — Siz aniq buyurasiz, **AI kod yozadi**, siz uni o'qib tushunasiz. · 📱 Telefonda test — «Ishladi» degani — Expo Go'da **o'z ko'zingiz** bilan ko'rdingiz, degani. · 🔁 Sikl takrorlanadi — Prompt → kod → telefonda test → tuzat. · Sinfga savol: Loyiha kunida sizning rolingiz nima?
3. Buyurtma — o'sha pipeline: 🟢 POST /orders — «Buyurtma qil» bosilganda mobil ilova **o'sha backendga** POST /orders yuboradi. · 🐘 Baza saqlaydi — Buyurtma **PostgreSQL**'ga yoziladi — web bilan bir xil. · ✈️ Bot xabar beradi — Telegram bot adminni xabardor qiladi. · Sinfga savol: Mobil «Buyurtma qil» bosilganda nima bo'ladi?
4. Telefonda test = repetitsiya: 📱 Haqiqiy qurilma — Expo Go bilan **real telefonda** ochib, har ekran va oqimni bosib sinaymiz. · 🐞 Real bug'lar — Emulyator emas — real qurilma rost bug'larni ko'rsatadi (badge, tugma joyi, sekinlik). · 🔧 Aniq tuzatish — Bug topilsa — aniq tuzatish prompti, butun ilovani qayta yozmaysiz. · Sinfga savol: Mobil ilovani qanday to'g'ri test qilamiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Mobil ilova mahsulot ma'lumotini qayerdan oladi? ✔ O'sha backenddan (GET /products) · Ilova ichiga qo'lda yozamiz · Yangi mobil server yozamiz · Hech qayerdan olmaydi
2. Loyiha kunida sizning (direktor) rolingiz nima? Kodni o'qimasdan shundoq ishlatish · ✔ Buyurish, kodni o'qish, telefonda testlash · Hamma kodni o'zingiz qo'lda yozish · Faqat ranglar va dizaynni tanlash
3. React Native'da ro'yxatni ko'rsatish uchun qaysi komponent ishlatiladi? `<div>` · `<table>` · ✔ `<FlatList>` · `<marquee>`
4. «Buyurtma qil» bosilganda nima bo'ladi? Faqat telefonda saqlanadi · Umuman hech narsa bo'lmaydi · Yangi mobil backend ishga tushadi · ✔ O'sha backendga POST /orders → baza → bot
5. Yuqoridagi savat soni (badge) nima bilan bog'lanadi? Backend fayl nomi bilan · ✔ cart.length (state) bilan · Rasm o'lchami bilan · Sahifa sarlavhasi bilan
6. Jami narxni hisoblash uchun qaysi metod eng qulay? ✔ reduce · map · filter · sort
7. Expo Go asosan nima uchun kerak? Kodni boshqa tilga tarjima qilish uchun · Yangi backend qurish uchun · Ilovaga rasm chizish uchun · ✔ Ilovani telefonda sinab, QR bilan ulash uchun
8. Mobil ilovani qanday to'g'ri test qilamiz? Umuman test qilmaymiz · Faqat kompyuterda kodga qarab · ✔ Expo Go bilan haqiqiy telefonda · Faqat ranglarni tekshirib
9. Web, bot va mobil bir xil buyurtmalarni qanday ko'radi? ✔ Bitta backend va bazaga ulanadi · Har biriga alohida baza quriladi · Ma'lumot qo'lda nusxalanadi · Buni umuman qilib bo'lmaydi
10. Ilova «ishlaydi» bo'lgandan keyin yana nima kerak? Boshqa hech narsa kerak emas · Backendni butunlay o'chirish · Hamma kodni boshidan qayta yozish · ✔ Sayqal — StyleSheet bilan chiroyli qilish
11. Detail ekranga o'tish uchun nima ishlatiladi? reduce · fetch · ✔ navigation.navigate · StyleSheet.create
12. Telefonda test nega emulyatordan ko'ra yaxshiroq? Kodni ancha tezroq yuklaydi · ✔ Real qurilma rost bug'larni ko'rsatadi · Kod yozish umuman kerak emas · Ulanish uchun internet kerak emas

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Uchta test ekranida bitta xato izohi hech qachon chiqmaydi** — 4, 6, 13-ekranlar: izoh to'g'ri javob raqamiga yozilgan, shu sabab B-variant (4, 6) va B-variant (13) umumiy izohni oladi. Yo'qolgan izohlar: «Yangi backend shart emas…», «Hammasini qo'lda emas…», «Rang — bir qismi xolos…».
- **Hook «sotilgan»** — 0-ekran: «Hech narsa» yoki «Saytni kattalashtirish» tanlansa ham «To'g'ri — … mobil ilova kerak» chiqadi.
- **Ikki metafora aralashgan** — butun dars «direktor / ishchi» va «ko'p eshik» bilan boradi, keyin 16-ekran («Web-shouni mobil sahnaga port qildingiz»), yakun («Premyera bo'ldi», «gastrolga chiqdi»), yakun xulosasi («har sahna prompt bilan port qilinadi») va nishonlar (On Tour, Premiere Night) to'satdan gastrol/sahna tilida gapiradi. «port», «shou» izohsiz. RECAPS 4-sarlavhasida «repetitsiya».
- **«Dovodka»** — ruscha so'z (11, 12-ekran, eyebrow ham). Ekranning o'zida «= sayqal» deb izoh bor, lekin nomning o'zi ruscha.
- **Izohsiz inglizcha/texnik so'zlar:** «pipeline» (9, 10-ekran, nishon, takrorlash 3), «badge» (7, 8, 12, 13, kartochkalar), «deploy» (1, 14, 15, yakun), «state», «Checkout»/«List»/«Detail» tugma nomlari (3-ekran, ruscha tarjimada ham shunday), «capstone» (yakun, keyingi dars), «emulyator» (12, 13, kartochka), «callback» (8-ekran).
- **O'quvchi tushunmaydigan havolalar:** «Sintaksisni T6/T7 da o'rgandingiz» (1-ekran) — T6/T7 nima ekani aytilmaydi; «Modul 2 dagi callback!» (8-ekran).
- **To'g'ri javob uzunligi bilan sotilgan:** 10-ekran (✔ «O'sha backendga POST /orders ketadi → baza saqlaydi → bot xabar beradi» — boshqalaridan ancha uzun va yagona strelkali); viktorina 4 va 10-savollar ham shunday (✔ eng uzun, strelkali/izohli).
- **Bir narsaning ikki nomi:** «Detail» / «detal» / «Detal (Detail)» / «mahsulot sahifasi»; «List» / «Katalog (List)» / «mahsulotlar ro'yxati»; «test qilish» / «testlash» / «sinash» — hammasi aralash.
