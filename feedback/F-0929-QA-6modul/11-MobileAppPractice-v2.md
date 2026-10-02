# 6-Modul (LMS: 8-Modul) · 11-dars «Praktika: mobil ilova» — YANGI MATN (v2)

Fayl: `src/6-Modull/MobileAppPracticeLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `11-MobileAppPractice-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=1-variant, s6=3, s10=2, s13=4; arena kaliti o'zgarmaydi) — faqat matn.
⚠️ KOD XATOSI (Jonli tuzatadi): 4, 6, 13-ekranlarda xato-izohlar kaliti noto'g'ri — pastda aniq yozilgan.

---

## A. Darsning tayanchi (6 blok)

1. **Reja** — nima quramiz: mini-do'konning mobil ilovasi, 4 ekran.
2. **Backend** — tayyor API'dan foydalanamiz (backend darslaridagi Node.js + PostgreSQL). Yangi server qurilmaydi.
3. **AI bilan qurish** — aniq topshiriq → AI kod taklif qiladi → siz loyihaga qo'shib, tekshirasiz.
4. **Xarid oqimi** — Ro'yxat → Tafsilot → Savat → Buyurtma.
5. **Test** — kodni o'qish + telefonda oqimni bosib ko'rish → xato → tuzatish → qayta test.
6. **Ulashish** — Expo Go orqali boshqa telefonda ochib ko'rish. Bu **App Store'ga joylash emas**.

**Bir nom qoidasi (3-ekranda bir marta tanishtiriladi, keyin faqat o'zbekchasi):** Ro'yxat (kodda `List`) · Tafsilot (kodda `Detail`) · Savat (kodda `Cart`) · Buyurtma (kodda `Checkout`).
**Boshqa so'zlar:** «deploy» → **ulashish** · «dovodka» → **sayqal** · «badge» → **savat soni belgisi** (bir marta «badge» izoh bilan) · «state» → **holat (state)** · «ko'p eshik» → **ko'p kirish yo'li** (1-dars v2) · «pipeline» → **8-darsdagi buyurtma oqimi** · «test qilish / testlash / sinash» → **sinash**.
**Metafora:** teatr (sahna, port, premyera, gastrol) — olib tashlanadi. «Direktor» — 5-ekranda bir marta (8-dars v2 kabi).
**Kafolat yo'q:** «to'liq mobil ilova tayyor» → «asosiy oqimi ishladi».
**Infratuzilma (10-dars qarori B-1):** o'quvchi ustoz bergan tayyor loyihada ishlaydi (Expo + navigatsiya sozlangan); backend darslaridagi server ishlab turgan bo'lishi kerak.

---

## 0 · Kirish — mijozlar telefonda  `[724]`
- Sarlavha: **Do'koningiz web'da bor. Lekin mijozlar telefonda. Ularga nima beramiz?**
- Mentor: React va backend darslarida web do'kon qurgansiz. Endi o'sha do'konning mobil ilovasini quramiz. Ikki holatni bosib solishtiring.
- Telefonlar — o'zgarmaydi (🌐 Sayt telefonda: matn mayda, tugmalar noqulay · 📱 Mobil ilova)
- Savol: **Qaysi variantni tanlaysiz?**
  - Hech narsa — sayt brauzerda ham ochiladi
  - Mobil ilova — telefon ekraniga moslangan
  - Saytni telefonda kattaroq ko'rsatish
- Javob — 2-variant: **Aynan!** Bugun mini-do'konning mobil ilovasini quramiz, telefonda sinaymiz va Expo Go bilan ulashamiz.
- Javob — 1-variant: **Qiziq fikr!** Sayt ishlaydi, lekin telefonda qulaylikni alohida tekshirish kerak: matn mayda, tugmalar noqulay. Bugun telefon uchun alohida ilova quramiz.
- Javob — 3-variant: **Qiziq fikr!** Bu vaqtinchalik yechim: harflar kattalashadi, lekin tugmalar va oqim baribir telefon uchun mo'ljallanmagan. Bugun mobil ilovani alohida quramiz.

✎ 🔴 FAKT: «Web do'kon (o'tgan darsda qurgan)» — o'tgan dars React Native edi, web do'kon React va backend darslarida qurilgan · javob tanlovga qarab uch xil (oldin hammasiga «To'g'ri») · to'g'ri variantdagi «App Store/Expo orqali» (uzun, texnik) olib tashlandi · «siz — direktor» olib tashlandi

## 1 · Reja  `[778]`
- Sarlavha: **Loyiha kuni: mobil ilovani quramiz va ulashamiz**
- Mentor: Bugun yangi sintaksis yo'q — amaliyot. AI yordamida mobil ilovani qadam-qadam yig'asiz, kodni tekshirasiz va telefonda sinaysiz.
- Blok «Bugungi maqsad»: **mini-do'kon → mobil ilova** — quramiz, telefonda sinaymiz, Expo Go bilan ulashamiz. · → 9 va 10-darslarda sintaksisni o'rgandingiz — bugun qurasiz
- 5 qadam:
  1. Tayyor backend'ga ulanish (yangi backend qurilmaydi)
  2. Ro'yxat va Tafsilot ekranlari (mahsulotlar, fetch)
  3. Savat va jami narx (holat, reduce)
  4. Buyurtma → backend'ga
  5. Telefonda sinash, sayqal, Expo Go bilan ulashish

✎ «T6/T7 da» → «9 va 10-darslarda» · «Expo Go deploy» → «ulashish» · «Siz direktor sifatida AI'ga buyurib» → «AI yordamida … kodni tekshirasiz»

## 2 · Tayyor backend — yangi kirish yo'li  `[811]`
- Eyebrow: Bitta tizim
- Sarlavha: **Tayyor backend — yangi kirish yo'li**
- Mentor: Mobil ilova uchun yangi backend qurmaymiz. U backend darslarida qurgan o'sha Node.js + PostgreSQL serverga ulanadi. Mobil — bitta tizimning yana bir kirish yo'li. Uni ulang.
- Kirish yo'llari: Web sayt ✓ · Telegram bot ✓ · Mobil ilova — «ULA →»
- Markaz: 🟢 **Bitta backend** · Node.js + PostgreSQL (`GET /products` · `POST /orders`)
- Ulangach: 1-darsdagi g'oya: **ko'p kirish yo'li — bitta tizim**. Web, bot, mobil — uchalasi bitta bazadagi mahsulot va buyurtmalardan foydalanadi.

✎ «o'tgan darsda qurgan O'SHA Node.js» (FAKT: o'tgan dars RN edi) → «backend darslarida» · «eshik» → «kirish yo'li» (1-v2)

## 3 · Ilova xaritasi  `[859]`
- Sarlavha: **Ilova — 4 ekran**
- Mentor: Mana bugun quradigan ilovamiz. Har ekranning o'zbekcha nomi va kodda ishlatiladigan nomi bor. 4 ekranni bosib, telefonda ko'ring.
- Tugmalar: Ro'yxat (`List`) · Tafsilot (`Detail`) · Savat (`Cart`) · Buyurtma (`Checkout`)
- Telefon ko'rinishlari — o'zgarmaydi
- Matn: Bularning hammasi tayyor backend'dan ma'lumot oladi.
- Hammasi ko'rilgach: 4 ekran — tayyor reja. Endi ularni AI yordamida birma-bir quramiz.

✎ Ekran nomlari shu yerda bir marta ikki tilda; keyin dars bo'yi faqat o'zbekcha (oldin List/Detail/detal/Katalog/mahsulot sahifasi — bir narsaning 4 nomi) · «yangi server kerak emas» takrori olib tashlandi

## 4 · 1-savol ✅  `[901]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilova mahsulotlarni qayerdan oladi?**
  - ✔ Tayyor backend'dan — `GET /products` bilan
  - Faqat mobil uchun yozilgan yangi backend'dan
  - Ilova ichiga qo'lda yozilgan ro'yxatdan
  - Hech qayerdan — mobil ilovada baza bo'lmaydi
- To'g'ri: To'g'ri! Mobil ilova backend darslaridagi Node.js + PostgreSQL serverga ulanadi (`GET /products`). Web, bot, mobil — bitta tizimning kirish yo'llari.
- Xato izohlari (har variantga o'ziniki):
  - 2-variant: Yangi backend shart emas — bittasi hamma kirish yo'liga xizmat qiladi.
  - 3-variant: Qo'lda yozsangiz — yangilanmaydi. Backend'dan fetch qiling.
  - 4-variant: Ma'lumot backend'da — ilova undan fetch qiladi.

✎ 🔴 KOD: `explainWrong` kalitlari `{0, 2, 3}` — 2-variant (indeks 1) uchun izoh yo'q, «Yangi backend shart emas…» esa indeks 0 (to'g'ri javob) ostida yozilgan, hech qachon chiqmaydi → izoh indeks 1 ga ko'chiriladi

## 5 · Loyiha kuni ritmi  `[911]`
- Sarlavha: **Ritm: topshiriq → kod → telefonda sinov → tuzatish**
- Mentor: Loyiha kunida har qadam shu siklda quriladi. Yangi narsa — telefonda ko'rib sinash. Bosib oching.
- Sikl: Reja → Topshiriq (prompt) → AI kod → Telefonda sinov → Tuzatish
- Blok: Siz aniq topshiriq berasiz, AI kod taklif qiladi, siz kodni o'qib loyihaga qo'shasiz va Expo Go'da telefonda sinaysiz. Xato bo'lsa — aniq tuzatish topshirig'i. Buni direktor ishiga o'xshatish mumkin: nima qurilishini siz belgilaysiz, natijani siz tekshirasiz.
- Oxirida: «Ishladi» degani — telefonda o'z ko'zingiz bilan ko'rdingiz, degani. Endi quramiz.

✎ «Direktor / ishchi» — bir marta, o'xshatish sifatida (oldin 0, 1, 5, 6, 15, 19-ekranlarda)

## 6 · 2-savol ✅  `[942]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Loyiha kunida sizning vazifangiz nima?**
  - AI bergan kodni o'qimasdan ishlatish
  - Hamma kodni o'zingiz qo'lda yozish
  - ✔ Aniq topshiriq berish, kodni o'qish va telefonda sinash
  - Faqat dizayn va ranglarni tanlash
- To'g'ri: To'g'ri! Siz aniq topshiriq berasiz, AI kodini o'qib tushunasiz va Expo Go'da telefonda sinaysiz. Sinamaguningizcha «ishladi» deyolmaysiz.
- Xato izohlari:
  - 1-variant: O'qimasdan ishlatish — xatolarni ko'rmaysiz.
  - 2-variant: Hammasini qo'lda yozish shart emas — AI taklif qiladi, siz tekshirasiz.
  - 4-variant: Dizayn ham muhim, lekin asosiysi — topshiriq, o'qish, sinash.

✎ Eyebrow «Tekshiruv · Mustahkamlash» → «Mashq · 2-savol» (podium bilan mos) · 🔴 KOD: `explainWrong` kalitlari `{0, 2, 3}`, «Hammasini qo'lda emas…» indeks 2 (to'g'ri javob) ostida → indeks 1 ga ko'chiriladi

## 7 · Ilovani AI bilan yig'ing (markaziy)  `[952]`
- Eyebrow: Ilova quruvchi · jonli
- Sarlavha: **Ilovani AI yordamida yig'ing**
- Mentor: Har qism uchun AI'ga aniq topshiriq berasiz. AI kod taklif qiladi — siz uni loyihaga qo'shib, telefonda tekshirasiz. Bu ekranda 4 qadamni bosib, har biri qanday qurilishini ko'ring, keyin «Xarid qil»!
- Qadamlar (topshiriq · kod):
  - **Ro'yxat ekrani** — «Mahsulotlarni backend'dan fetch qilib FlatList'da ko'rsat» · `fetch(BACKEND + "/products") → <FlatList data={products} />`
  - **Tafsilot + navigatsiya** — «Mahsulot bosilganda Tafsilot ekraniga o't» · `navigation.navigate("Detail", { id })`
  - **Savat** — «Savatga qo'shish tugmasi + yuqorida savat soni belgisi» · `setCart([...cart, product]) · soni = cart.length`
  - **Buyurtma** — «Buyurtma qil tugmasi → backend'ga POST /orders» · `fetch(BACKEND + "/orders", { method: "POST", body })`
- Hech narsa tanlanmagan: Qadamni bosing — topshiriqni va AI taklif qilgan kodni ko'rasiz.
- Xariddan keyin telefonda: ✅ Buyurtma yuborildi! Backend qabul qildi.
- Xulosa: 📱 **Asosiy oqim ishladi!** — Ro'yxat → savat → buyurtma → backend. Real loyihada har qadamdan keyin kodni o'qib, telefonda sinab borasiz.

✎ «prompt yuborasiz — kod paydo bo'ladi va telefonda o'sha qism ko'rinadi» (sehrli) → AI taklif qiladi, siz qo'shib tekshirasiz · «To'liq mobil ilova tayyor» → «asosiy oqim ishladi» · `API` → `BACKEND` (10-dars v2 bilan bir xil) · «badge» → «savat soni belgisi»

## 8 · Savat va jami  `[1012]`
- Sarlavha: **Savat va jami narx**
- Mentor: «+» bosib mahsulot qo'shing — yuqoridagi savat soni belgisi (inglizcha *badge*) o'zgaradi, jami narx **reduce** bilan hisoblanadi. `reduce`ni JavaScript darslarida (funksiyalar) ko'rgansiz.
- Blok «Jami narx — reduce bilan» — kod o'zgarmaydi · Izoh: `cart.length` — savatdagi mahsulotlar **soni**; `reduce` — ularning **narxlarini** yig'adi. Ikkalasi alohida narsa: savatda **N** ta · jami **X so'm**.
- 2 ta qo'shilgach: Savat — holat (state). Holat o'zgarsa, ekran o'zi yangilanadi — React'dagi kabi.

✎ «Modul 2 dagi callback!» → «JavaScript darslarida (funksiyalar)» (reduce `JsFunctionsLesson`da o'tilgan — tekshirildi) · `cart.length` va `reduce` farqi aniq aytildi · «badge», «state» bir marta izoh bilan

## 9 · Buyurtma → backend  `[1050]`
- Sarlavha: **«Buyurtma qil» — o'sha tizimga tushadi**
- Mentor: Mobil buyurtma ham 8-darsdagi buyurtma oqimiga qo'shiladi: backend → baza saqlaydi → bot adminga xabar beradi. Bosib, oqimni kuzating.
- Oqim (5 qadam) — o'zgarmaydi
- Oxirida: Telefondan kelgan buyurtma ham bazaga tushdi va bot xabar berdi — xuddi web'dagidek.

✎ «o'tgan darsdagi pipeline» (o'tgan dars — 10, pipeline 8-darsda) → «8-darsdagi buyurtma oqimi» · «Bitta tizim, ko'p eshik» takrori olib tashlandi

## 10 · 3-savol ✅  `[1077]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilovada «Buyurtma qil» bosilganda nima bo'ladi?**
  - Buyurtma faqat telefon ichida saqlanadi
  - ✔ Backend'ga `POST /orders` so'rovi ketadi
  - Faqat mobil uchun yangi backend ishga tushadi
  - Hech narsa — mobil ilova buyurtma qabul qilolmaydi
- To'g'ri: To'g'ri! Mobil ilova backend'ga `POST /orders` yuboradi. Buyurtma PostgreSQL'ga saqlanadi, Telegram bot adminni xabardor qiladi — web bilan bir xil oqim.
- Xato izohlari — o'zgarmaydi

✎ 🔴 Eyebrow «2-savol» → «3-savol» (raqamlash xatosi) · to'g'ri javob eng uzun va yagona strelkali edi → tenglashtirildi (zanjir endi izohda)

## 11 · Sayqal  `[1087]`
- Eyebrow: Sayqal
- Sarlavha: **«Ishlaydi» yetarli emas — sayqallang**
- Mentor: Ilova ishlashi — birinchi qadam. Endi uni chiroyli va qulay qilamiz: StyleSheet bilan rang, bo'shliq, tartib. Ikki holatni solishtiring.
- Chala / Sayqallangan — o'zgarmaydi
- Ikkalasi ko'rilgach: «Ishlaydi»dan keyin «chiroyli va qulay» keladi — bu ham sizning ishingiz.

✎ «Dovodka» (ruscha) → «Sayqal» · «direktor ishi» → «sizning ishingiz»

## 12 · Telefonda sinov · xato  `[1126]`
- Eyebrow: Telefonda sinov · xato
- Sarlavha: **Telefonda sinov: xato topiladi → tuzatiladi**
- Mentor: Expo Go'da telefonda sinab ko'rasiz — va xato chiqadi! Bosib, tuzatish siklini ko'ring.
- Qadamlar:
  1. **TELEFONDA SINOV** — Savatga 2 mahsulot qo'shasiz… lekin yuqoridagi savat soni hali «1» ko'rsatyapti! 🐞 · *Sinab ko'rmasangiz, bu xatoni ko'rmaysiz.*
  2. **SABAB** — Savat soni (holat) to'g'ri yangilanmayapti — kod eski qiymatdan foydalanyapti. · *Avval kodni o'qib, sabab qayerda ekanini tushunasiz.*
  3. **TUZATISH TOPSHIRIG'I** — «Savat soni belgisini cart.length bilan bog'la — har qo'shilganda yangilansin.» · *Aniq tuzatish — butun ilovani qayta yozdirmaysiz.*
  4. **QAYTA SINOV** — ✅ Endi «2» ko'rsatadi. · *Sikl: sinov → xato → tuzatish → qayta sinov.*
- Oxirida: Sinov shu: telefonda sinash → xato → aniq tuzatish → qayta sinash. Emulyator ham foydali, lekin haqiqiy telefonda sinash qurilmaga xos muammolarni (sekinlik, tugma joyi) ko'rsatishi mumkin — shuning uchun real qurilmada ham sinab ko'ring.

✎ «Haqiqiy telefonda sinab ko'rmasangiz, bu bug'ni ko'rmaysiz» — FAKT: bu xato emulyatorda ham ko'rinadi → «Sinab ko'rmasangiz» · «Emulyator emas — haqiqiy qurilma rost bug'larni ko'rsatadi» (qat'iy) → yumshatildi · «dovodka», «bug» → «sayqal», «xato»

## 13 · 4-savol ✅  `[1163]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilovani qanday sinaymiz?**
  - Sinamaymiz — AI to'g'ri yozib beradi
  - Faqat ranglar to'g'ri chiqqanini tekshirib
  - Faqat kompyuterda kodga qarab, ochmasdan
  - ✔ Kodni tekshirib, telefonda oqimni bosib ko'rib
- To'g'ri: To'g'ri! Avval kodni o'qiysiz, keyin Expo Go bilan telefonda har ekran va oqimni (ro'yxat → savat → buyurtma) bosib sinaysiz. Qurilmada ba'zi xatolar (sekinlik, tugma joyi) shunda ko'rinadi.
- Xato izohlari (har variantga o'ziniki):
  - 1-variant: AI xato qiladi — sinov shart.
  - 2-variant: Rang — bir qismi xolos. Butun oqimni sinang.
  - 3-variant: Kod to'g'ri ko'rinishi mumkin, lekin telefonda boshqacha ishlaydi.

✎ 🔴 Eyebrow «3-savol» → «4-savol» · 🔴 KOD: `explainWrong` kalitlari `{0, 2, 3}`, «Rang — bir qismi xolos…» indeks 3 (to'g'ri javob) ostida → indeks 1 ga ko'chiriladi · to'g'ri javob «faqat telefonda» emas — kod tekshiruvi ham (test tushunchasi keyin kengayadi)

## 14 · Expo Go bilan ulashing (markaziy)  `[1173]`
- Eyebrow: Expo Go · ulashish
- Sarlavha: **Expo Go bilan ilovani ulashing: QR → do'st telefonida**
- Mentor: Ilovaning asosiy oqimi tayyor — endi uni boshqa telefonda ochib ko'ramiz. «Ulash» bosing → QR paydo bo'ladi → do'stingiz Expo Go bilan skanerlaydi → uning telefonida ochiladi.
- Tushuntirish: Bu — ilovani sinash va ulashish usuli, **App Store yoki Play Market'ga joylash emas**. Do'stingiz telefonida Expo Go o'rnatilgan bo'lishi kerak (va odatda ikkalangiz bitta Wi-Fi'da bo'lasiz). Do'konga chiqarish — alohida bosqich, keyin.
- Tugmalar: 📤 Expo Go'da ulash → 📲 Do'st QR'ni skanerlaydi
- «Bir o'quvchining yo'li»: QURDI — Ro'yxat → Tafsilot → Savat → Buyurtma, har birini AI yordamida · SAYQALLADI — StyleSheet bilan · SINADI — Expo Go'da telefonda xarid qilib ko'rdi, xato topib tuzatdi · ULASHDI — Expo Go QR bilan, do'sti telefonida ochildi
- Xulosa: Bitta backend, ko'p telefon. Endi o'z rejangizni yozing.

✎ 🔴 TEXNIK: «Expo Go deploy» — bu deploy emas (App Store'ga chiqarish emas), ulashish/sinash usuli → «ulashish», farqi ochiq aytildi · Expo Go va Wi-Fi sharti (9-dars v2 bilan mos) · `why` maydonidagi «T6/T7» matnlari ekranga chiqmaydi — o'zgarishsiz

## 15 · Qoida  `[1226]`
- Sarlavha: **Mobil loyiha: quring · sinang · sayqallang · ulashing**
- Mentor: Yodda tuting: tayyor backend'ga ulaning, telefonda sinab ko'ring, sayqallang, Expo Go bilan ulashing.
- Asosiy qoida: **AI kod yozishda yordam beradi. Siz vazifani belgilaysiz, kodni tekshirasiz va natijani sinaysiz.**
- 4 narsani unutmang: TAYYOR BACKEND — yangi server qurmaysiz · TELEFONDA SINOV — Expo Go bilan · SAYQALLANG — StyleSheet bilan · ULASHING — Expo Go QR bilan

✎ «🎬 Siz — direktor» bloki → asosiy qoida jumlasi · «deploy» → «ulashing»

## 16 · Xarid oqimini yig'ing ✅ (final)  `[1255]`
- Eyebrow: Yakuniy · xarid oqimi
- Sarlavha: **Oxirgi qadam: mobil ilovaning 4 ekranini xarid oqimi tartibida yig'ing.**
- Mentor: Mijoz ilovada xarid qiladi. 4 ekranni u bosib o'tadigan tartibda joylang.
- Bo'laklar: Ro'yxat (List) · Tafsilot (Detail) · Savat (Cart) · Buyurtma (Checkout)
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Xarid oqimi tayyor: **Ro'yxat → Tafsilot → Savat → Buyurtma**. Mini-do'konning asosiy oqimi shu.

✎ 🔴 Javob ochiq turardi: Mentor tartibni aytardi («mahsulotlar ro'yxati → mahsulot sahifasi → savat → buyurtma»), bo'sh joylarda ham tartib bilan tavsif yozilgan edi (kodda `hints`) — 4, 9, 10-darslardagi xato bilan bir sinf → «1-qadam…4-qadam» · «Web-shouni mobil sahnaga port qildingiz», «sahnalar», «Katalog/Detal» → xarid oqimi, 3-ekrandagi nomlar · «mobil ilova to'liq yig'ildi» → «asosiy oqimi» · ⚠️ KOD: `hints` massivi almashadi

## 17 · Natijalar (podium)  `[1803]` — o'zgarmaydi · savol yorliqlari: 1 — Manba · 2 — Sizning vazifangiz · 3 — Buyurtma · 4 — Sinov · 5 — Xarid oqimi

✎ «Direktor», «Sahnalar», «Test» → mos nomlar

## 18 · Takrorlash (kartochkalar)  `[1976]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Mobil ilova mahsulotlarni qayerdan oladi? | Tayyor backend'dan | `GET /products` so'rovi bilan, qo'lda yozilmaydi |
| Loyiha kunida sizning vazifangiz? | Topshiriq berish, kodni o'qish, sinash | AI kod taklif qiladi — siz tekshirasiz |
| Kod haqiqatan ishlaganini qanday bilasiz? | Telefonda sinab ko'rsangiz | Expo Go'da oqimni o'zingiz bosib ko'rasiz |
| Savatdagi mahsulotlar qayerda turadi? | Holatda (state) | Holat o'zgarsa, ekran o'zi yangilanadi |
| Savatdagi jami narxni qaysi usul hisoblaydi? | reduce | Narxlarni bitta songa yig'adi |
| Savatdagi mahsulotlar sonini nima beradi? | cart.length | Yuqoridagi savat soni belgisi shundan olinadi |
| Bir ekrandan ikkinchisiga nima yordamida o'tiladi? | navigation.navigate | Ekranlarni Stack Navigator boshqaradi |
| Buyurtma backend'ga qaysi so'rov bilan yuboriladi? | POST /orders | Bazaga yoziladi, bot adminga xabar beradi |
| Ilovaga rang, bo'shliq va tartib nima orqali beriladi? | StyleSheet | Sayqal bosqichi |
| Xato topilsa butun ilovani qayta yozasizmi? | Yo'q — aniq joyi tuzatiladi | Faqat buzilgan joyga aniq topshiriq |
| Tayyor ilovani do'stingiz telefonida qanday ochasiz? | Expo Go va QR bilan | Bu ulashish usuli, App Store'ga joylash emas |
| Nega telefonda ham sinash kerak? | Qurilmaga xos xatolar ko'rinadi | Sekinlik, tugma joyi; emulyator ham foydali |

✎ «Direktor» kartasi → vazifa · «emulyator emas» → yumshatildi · cart.length va reduce alohida kartalarda

## 19 · Yakun  `[1988]`
- Eyebrow: Tayyor · belgi: ✓ Mobil ilova tayyor
- Sarlavha: **Mini-do'kon mobil ilovangizning asosiy oqimi ishladi.**
- Endi siz bilasiz:
  - Mobil ilova tayyor backend'ga ulanadi — bitta tizim, ko'p kirish yo'li
  - Ro'yxat → Tafsilot → Savat → Buyurtma — har ekran AI yordamida quriladi, siz tekshirasiz
  - Savat — holat (state), jami — reduce; holat o'zgarsa ekran yangilanadi
  - Telefonda sinov xatoni topadi → aniq tuzatish topshirig'i bilan tuzatiladi
  - Expo Go va QR — ilovani boshqa telefonda ochib ko'rish (App Store'ga joylash emas)
- Uyga vazifa:
  - **Quring** — ustoz bergan tayyor loyihada o'z mobil ilovangizni davom ettiring; backend darslaridagi serveringizga ulang
  - **Sinang** — Expo Go'da telefonda har ekranni bosib ko'ring
  - **Ulashing** — sayqallab, QR bilan do'stingizga bering, fikr oling
- 🚀 Keyingi dars — PM: **Bugun qaysi ish boshlanadi?** Loyihangizdagi ishlarni uch ufqqa ajratamiz: hozir, uch oydan keyin, olti oydan keyin.

✎ «Premyera bo'ldi», «gastrolga chiqdi», «har sahna … port qilinadi» (teatr) olib tashlandi · 🔴 FAKT: «Keyingi dars — To'liq tizim (capstone)» — keyingi dars 12 (PM), «Loyiha kuni: to'liq tizim» 13-dars · «Deploy =» → ulashish · uyga vazifa infratuzilmasi: tayyor loyiha (B-1)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, teatr nomlari dars atamalariga moslanadi:
- 🔌 **API Connected** — mobil ilova tayyor backend'ga ulanishini bildingiz (1-savol)
- 🧑‍💻 **Project Builder** — topshiriq berib, kodni o'qib sinashni bildingiz (2-savol)
- 🧾 **Checkout Done** — buyurtma backend'ga `POST /orders` bilan ketishini bildingiz (3-savol)
- 📱 **Mobile Test** — ilovani kod va telefonda sinashni bildingiz (4-savol)

**Qisqa takrorlash oynalari (4):**
1. (4) **Tayyor backend — bitta tizim:** Mobil ilova yangi server yozmaydi — backend darslaridagi Node.js + PostgreSQL'ga ulanadi. · Mahsulotlar `GET /products` orqali keladi, qo'lda yozilmaydi. · Web, bot, mobil — bitta bazadan foydalanadi. · Sinfga savol: Mobil ilova mahsulotlarni qayerdan oladi?
2. (6) **Sizning vazifangiz:** Aniq topshiriq berasiz — AI kod taklif qiladi. · Kodni o'qib tushunasiz va loyihaga qo'shasiz. · Telefonda sinaysiz — sikl: topshiriq → kod → sinov → tuzatish. · Sinfga savol: Loyiha kunida sizning vazifangiz nima?
3. (10) **Buyurtma — o'sha oqim:** «Buyurtma qil» bosilganda mobil ilova backend'ga `POST /orders` yuboradi. · Buyurtma PostgreSQL'ga yoziladi — web bilan bir xil. · Telegram bot adminni xabardor qiladi. · Sinfga savol: «Buyurtma qil» bosilganda nima bo'ladi?
4. (13) **Sinov — kod va telefon:** Avval kodni o'qiysiz. · Keyin Expo Go bilan telefonda har ekran va oqimni bosib sinaysiz. · Xato topilsa — aniq tuzatish topshirig'i, butun ilova qayta yozilmaydi. · Sinfga savol: Mobil ilovani qanday sinaymiz?

✎ 4-oyna «repetitsiya», «Emulyator emas» → olib tashlandi

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Mobil ilova mahsulot ma'lumotini qayerdan oladi? ✔ Tayyor backend'dan (`GET /products`) · Ilova ichiga qo'lda yozilgan ro'yxatdan · Faqat mobil uchun yozilgan yangi serverdan · Hech qayerdan — baza bo'lmaydi
2. Loyiha kunida sizning vazifangiz nima? Kodni o'qimasdan shundoq ishlatish · ✔ Topshiriq berish, kodni o'qish, sinash · Hamma kodni o'zingiz qo'lda yozish · Faqat ranglar va dizaynni tanlash
3. React Native'da ro'yxatni ko'rsatish uchun qaysi komponent? `<div>` · `<table>` · ✔ `<FlatList>` · `<ScrollView>`
4. «Buyurtma qil» bosilganda nima bo'ladi? Buyurtma faqat telefonda saqlanadi · Umuman hech narsa bo'lmaydi · Yangi mobil backend ishga tushadi · ✔ Backend'ga `POST /orders` ketadi
5. Yuqoridagi savat soni belgisi nima bilan bog'lanadi? Backend fayl nomi bilan · ✔ `cart.length` (holat) bilan · Rasm o'lchami bilan · Sahifa sarlavhasi bilan
6. Jami narxni hisoblash uchun qaysi usul qulay? ✔ reduce · map · filter · sort
7. Expo Go asosan nima uchun kerak? Kodni boshqa tilga tarjima qilish uchun · Yangi backend qurish uchun · Ilovaga rasm chizish uchun · ✔ Ilovani telefonda sinash va ulashish uchun
8. Mobil ilovani qanday sinaymiz? Umuman sinamaymiz · Faqat kompyuterda kodga qarab · ✔ Kodni o'qib, telefonda oqimni bosib · Faqat ranglarni tekshirib
9. Web, bot va mobil bir xil buyurtmalarni qanday ko'radi? ✔ Bitta backend va bazaga ulanadi · Har biriga alohida baza quriladi · Ma'lumot qo'lda nusxalanadi · Buni umuman qilib bo'lmaydi
10. Ilova «ishlaydi» bo'lgandan keyin yana nima kerak? Boshqa hech narsa kerak emas · Backend'ni butunlay o'chirish · Hamma kodni boshidan qayta yozish · ✔ Sayqal — StyleSheet bilan
11. Tafsilot ekraniga o'tish uchun nima ishlatiladi? reduce · fetch · ✔ navigation.navigate · StyleSheet.create
12. Nega telefonda ham sinash kerak? Kodni ancha tezroq yuklaydi · ✔ Qurilmaga xos xatolar ko'rinadi · Kod yozish umuman kerak emas · Ulanish uchun internet kerak emas

✎ 3-savol `<marquee>` (bema'ni) → `<ScrollView>` (ishonarli, darsda bor) · 4, 10-savollar: to'g'ri javob eng uzun/strelkali edi → tenglashtirildi · 12-savol «emulyatordan ko'ra yaxshiroq» → «nega telefonda ham»
