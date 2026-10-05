# 11-dars «Loyiha kuni: mobil ilova» — yakuniy matn

Fayl: `src/6-Modull/MobileAppPracticeLesson.jsx` · 20 ekran · Keyingi dars: «Bugun qaysi ish boshlanadi?»
Holat: 05.10.2026 — kodga mos (dars eski qolipda, MD v3 bo'yicha qayta qurilmagan)

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Do'koningiz web'da, mijozlar — telefonda. Nima beramiz?
- Mentor: React va backend darslarida web do'kon qurgansiz. Endi o'sha do'konning mobil ilovasini quramiz. Ikki holatni bosib solishtiring.
- Almashtirgich: Sayt telefonda · Mobil ilova
- «Sayt telefonda» (telefonda brauzer):
  - manzil qatori: mini-dokon.uz (qulf belgisi bilan)
  - Mini-do'kon
  - Olma — 12 000 so'm · Non — 5 000 so'm · Sut — 9 000 so'm
  - matn mayda, tugmalar noqulay, har safar brauzer ochish kerak…
- «Mobil ilova» (telefonda ilova):
  - sarlavha: Mini-do'kon · savat belgisi: 0
  - Olma 12 000 so'm (+) · Non 5 000 so'm (+) · Sut 9 000 so'm (+)
  - Tugma: Savatga o'tish
- Yorliq: Qaysi variantni tanlaysiz?
  - Hech narsa — sayt brauzerda ham ochiladi
  - ✔ Mobil ilova — telefon ekraniga moslangan
  - Saytni telefonda kattaroq ko'rsatish
- Javob izohlari:
  - 2-variant: **Aynan!** Bugun mini-do'konning mobil ilovasini quramiz, telefonda sinaymiz va Expo Go bilan ulashamiz.
  - 1-variant: **Qiziq fikr!** Sayt ishlaydi, lekin telefonda qulaylikni alohida tekshirish kerak: matn mayda, tugmalar noqulay. Bugun telefon uchun alohida ilova quramiz.
  - 3-variant: **Qiziq fikr!** Bu vaqtinchalik yechim: harflar kattalashadi, lekin tugmalar va oqim baribir telefon uchun mo'ljallanmagan. Bugun mobil ilovani alohida quramiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Loyiha kuni: mobil ilovani quramiz va ulashamiz
- Mentor: Bugun yangi sintaksis yo'q — **amaliyot**. AI yordamida mobil ilovani qadam-qadam yig'asiz, kodni tekshirasiz va telefonda sinaysiz.
- Yorliq: Bugungi maqsad
  - Karta: mini-do'kon → mobil ilova · Quramiz, telefonda sinaymiz, Expo Go bilan ulashamiz.
  - Izoh: → 9 va 10-darslarda sintaksisni o'rgandingiz — bugun qurasiz
- Yorliq: 5 qadam
  1. Tayyor backend'ga ulanish (yangi backend qurilmaydi)
  2. Ro'yxat va Tafsilot ekranlari (mahsulotlar, fetch)
  3. Savat va jami narx (holat, reduce)
  4. Buyurtma → backend'ga
  5. Telefonda sinash, sayqal, Expo Go bilan ulashish
- Tugmalar (telefonda): 5 qadamni ko'rish · ↩ Maqsadni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Bitta tizim
- Eyebrow: Bitta tizim
- Sarlavha: Tayyor backend — yangi kirish yo'li
- Mentor: Mobil ilova siz backend darslarida qurgan o'sha Node.js + PostgreSQL serverga ulanadi. Uni ulang.
- Kirish yo'llari (chapda, har biridan o'ng tomonga o'q):
  - Web sayt ✓
  - Telegram bot ✓
  - Mobil ilova — tugma: ULASH → (bosilgach ✓)
- O'ngda quti: Bitta backend · Node.js + PostgreSQL (GET /products · POST /orders)
- Natija (ulangach): 1-darsdagi g'oya: **ko'p kirish yo'li — bitta tizim**. Web, bot, mobil — uchalasi bitta Database'dagi mahsulot va buyurtmalardan foydalanadi.
- Tugmalar: Orqaga · Mobil ilovani ulang → Davom etish

## 3 · Ilova xaritasi
- Eyebrow: Ilova xaritasi
- Sarlavha: Ilova — 4 ekran
- Mentor: Mana bugun quradigan ilovamiz. Har ekranning o'zbekcha nomi va kodda ishlatiladigan nomi bor. 4 ekranni bosib, telefonda ko'ring.
- Tugmalar (ko'rilgani ✓ bilan): Ro'yxat (List) · Tafsilot (Detail) · Savat (Cart) · Buyurtma (Checkout)
- Izoh: Bularning hammasi tayyor backend'dan ma'lumot oladi.
- Telefonda:
  - Ro'yxat: Mini-do'kon · savat belgisi: 0 · Olma 12 000 so'm › · Non 5 000 so'm › · Sut 9 000 so'm ›
  - Tafsilot: ‹ Olma · (olma rasmi) · Olma · 12 000 so'm · Yangi, shirin olma. O'sha kuni yetkazib beramiz. · Tugma: Savatga qo'shish
  - Savat: Savat · savat belgisi: 2 · Olma 12 000 so'm · Non 5 000 so'm · Jami: 17 000 so'm · Tugma: Buyurtma qil
  - Buyurtma: Buyurtma · (yashil belgi) · Rahmat! Buyurtmangiz qabul qilindi · #1042 · 17 000 so'm
- Natija (4 ekran ko'rilgach): 4 ekran — tayyor reja. Endi ularni AI yordamida birma-bir quramiz.
- Tugmalar: Orqaga · Ekranlarni ko'ring (N/4) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mobil ilova mahsulotlarni qayerdan oladi?
  - ✔ Tayyor backend'dan — `GET /products` bilan
  - Faqat mobil uchun yozilgan yangi backend'dan
  - Ilova ichiga qo'lda yozilgan ro'yxatdan
  - Hech qayerdan — mobil ilovada Database bo'lmaydi
- Javob izohlari:
  - To'g'ri: To'g'ri! Mobil ilova backend darslaridagi Node.js + PostgreSQL serverga ulanadi (`GET /products`). Web, bot, mobil — bitta tizimning kirish yo'llari.
  - 2-variant: Yangi backend shart emas — bittasi hamma kirish yo'liga xizmat qiladi.
  - 3-variant: Qo'lda yozsangiz — yangilanmaydi. Backend'dan fetch qiling.
  - 4-variant: Ma'lumot backend'da — ilova undan fetch qiladi.
- Test ekranlarining umumiy yozuvlari (4, 6, 10, 13-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Birinchi urinish xato bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Loyiha kuni ritmi
- Eyebrow: Loyiha kuni ritmi
- Sarlavha: Ritm: topshiriq → kod → telefonda sinov → tuzatish
- Mentor: Loyiha kunida har qadam shu siklda quriladi. Yangi narsa — **telefonda** ko'rib sinash. Bosib oching.
- Sikl (bosilgan sari yonadi): Reja → Topshiriq (prompt) → AI kod → Telefonda sinov → Tuzatish
- Tugma: ▶ Siklni boshlash → Keyingi qadam →
- Karta «Siz va AI»: Siz aniq topshiriq berasiz, **AI kod taklif qiladi**, siz kodni o'qib loyihaga qo'shasiz va **Expo Go'da telefonda** sinaysiz. Xato bo'lsa — aniq tuzatish topshirig'i. Buni direktor ishiga o'xshatish mumkin: nima qurilishini siz belgilaysiz, natijani siz tekshirasiz.
- Natija (sikl ochilgach): «Ishladi» degani — telefonda o'z ko'zingiz bilan ko'rdingiz, degani. Endi quramiz.
- Tugmalar: Orqaga · Siklni oching (N/5) → Davom etish

## 6 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Loyiha kunida sizning vazifangiz nima?
  - AI bergan kodni o'qimasdan ishlatish
  - Hamma kodni o'zingiz qo'lda yozish
  - ✔ Aniq topshiriq berish, kodni o'qish va telefonda sinash
  - Faqat dizayn va ranglarni tanlash
- Javob izohlari:
  - To'g'ri: To'g'ri! Siz aniq topshiriq berasiz, AI kodini o'qib tushunasiz va Expo Go'da telefonda sinaysiz. Sinamaguningizcha «ishladi» deyolmaysiz.
  - 1-variant: O'qimasdan ishlatish — xatolarni ko'rmaysiz.
  - 2-variant: Hammasini qo'lda yozish shart emas — AI taklif qiladi, siz tekshirasiz.
  - 4-variant: Dizayn ham muhim, lekin asosiysi — topshiriq, o'qish, sinash.
- Umumiy yozuvlar — 4-ekrandagidek.

## 7 · Ilova quruvchi
- Eyebrow: Ilova quruvchi · jonli
- Sarlavha: Ilovani AI yordamida yig'ing
- Mentor: Har qism uchun AI'ga aniq topshiriq berasiz. AI kod taklif qiladi — siz uni loyihaga qo'shib, telefonda tekshirasiz. Bu ekranda 4 qadamni bosib, har biri qanday qurilishini ko'ring, keyin «Xarid qil»!
- Telefon (boshida): Mini-do'kon · Ilova bo'sh. Ro'yxat ekranini qo'shing →
- Qadamlar (o'ngda, har biri tugma; yozuvi: topshiriq bering → bosilgach: qo'shildi):
  1. Ro'yxat ekrani
  2. Tafsilot + navigatsiya
  3. Savat
  4. Buyurtma
- Hech qaysi bosilmaganda: Qadamni bosing — topshiriqni va AI taklif qilgan kodni ko'rasiz.
- Bosilgan qadam kartasi: <qadam nomi> — topshirig'ingiz · «topshiriq» · kod:
  - Ro'yxat ekrani — «Mahsulotlarni backend'dan fetch qilib FlatList'da ko'rsat» · `fetch(BACKEND + "/products") → <FlatList data={products} />`
  - Tafsilot + navigatsiya — «Mahsulot bosilganda Tafsilot ekraniga o't» · `navigation.navigate("Detail", { id })`
  - Savat — «Savatga qo'shish tugmasi + yuqorida savat soni belgisi» · `setCart([...cart, product]) · soni = cart.length`
  - Buyurtma — «Buyurtma qil tugmasi → backend'ga POST /orders» · `fetch(BACKEND + "/orders", { method: "POST", body })`
- Telefon qadamlar bilan to'ladi: Ro'yxat — Olma 12 000 so'm · Non 5 000 so'm · Sut 9 000 so'm; Tafsilot — har qatorda ›; Savat — har qatorda «+» va savat belgisi: 0; Buyurtma — tugma: Buyurtma qil
- Tugma (4 qadam qo'shilgach): ▶ Xarid qil
- Telefon (xariddan keyin, savat belgisi: 2):
  - Buyurtma №1042
  - Olma 12 000 so'm · Non 5 000 so'm
  - Jami 17 000 so'm
  - Holat: qabul qilindi
- Natija (xariddan keyin): Ro'yxat → savat → buyurtma → backend: asosiy oqim ishladi.
- Tugmalar: Orqaga · Ilovani quring (N/4) → Davom etish

## 8 · Savat + jami
- Eyebrow: Savat + jami
- Sarlavha: reduce savatni hisoblaydi
- Mentor: «+» bosib mahsulot qo'shing — tepadagi belgi (inglizcha *badge*) soni o'zgaradi, jami narx qayta hisoblanadi. `reduce`ni JavaScript darslarida (funksiyalar) ko'rgansiz.
- Telefon: Mini-do'kon · savat belgisi: N · Olma 12 000 so'm (+) · Non 5 000 so'm (+) · Sut 9 000 so'm (+) · Jami: N so'm
- Karta «Jami narx — reduce bilan»:
  ```js
  const jami = cart.reduce(
    (sum, p) => sum + p.price, 0
  );
  ```
  `cart.length` — savatdagi mahsulotlar **soni**; `reduce` — ularning **narxlarini** yig'adi. Ikkalasi alohida narsa: savatda **N** ta · jami **N so'm**.
- Natija (2 ta qo'shilgach): Savat — holat (state). Holat o'zgarsa, ekran o'zi yangilanadi — React'dagi kabi.
- Tugmalar: Orqaga · Savatga 2 ta qo'shing (N/2) → Davom etish

## 9 · Buyurtma → backend
- Eyebrow: Buyurtma → backend
- Sarlavha: «Buyurtma qil» — o'sha tizimga tushadi
- Mentor: Mobil buyurtma ham 8-darsdagi buyurtma oqimiga qo'shiladi: backend → Database saqlaydi → bot adminga xabar beradi. Bosib, oqimni kuzating.
- Oqim (yuqoridan pastga, bosilgan sari yonadi):
  1. Mobil: «Buyurtma qil» bosildi
  2. Backendga POST /orders yuborildi (o'sha Node.js)
  3. PostgreSQL: buyurtma saqlandi
  4. Telegram: adminga xabar bordi
  5. Mobil: «Rahmat! Buyurtmangiz qabul qilindi»
- Tugma: ▶ Buyurtma qil → Keyingi qadam →
- Natija (oqim tugagach): Telefondan kelgan buyurtma ham Database'ga tushdi va bot xabar berdi — xuddi web'dagidek.
- Tugmalar: Orqaga · Oqimni kuzating (N/5) → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mobil ilovada «Buyurtma qil» bosilganda nima bo'ladi?
  - Buyurtma faqat telefon ichida saqlanadi
  - ✔ Backend'ga `POST /orders` so'rovi ketadi
  - Faqat mobil uchun yangi backend ishga tushadi
  - Hech narsa — mobil ilova buyurtma qabul qilolmaydi
- Javob izohlari:
  - To'g'ri: To'g'ri! Mobil ilova backend'ga `POST /orders` yuboradi. Buyurtma PostgreSQL'ga saqlanadi, Telegram bot adminni xabardor qiladi — web bilan bir xil oqim.
  - 1-variant: Telefonda qolmaydi — backendga yuboriladi, aks holda admin ko'rmaydi.
  - 3-variant: Yangi backend yo'q — o'sha bitta backend.
  - 4-variant: Qabul qiladi — POST /orders orqali.
- Umumiy yozuvlar — 4-ekrandagidek.

## 11 · Sayqal
- Eyebrow: Sayqal
- Sarlavha: «Ishlaydi» yetarli emas — sayqallang
- Mentor: Ilova ishlashi — birinchi qadam. Endi uni chiroyli va qulay qilamiz: StyleSheet bilan rang, bo'shliq, tartib. Ikki holatni solishtiring.
- Almashtirgich: Chala (rangsiz) · Sayqallangan
- Telefon (ikkala holatda bir xil mazmun, chalasi rangsiz): Mini-do'kon · savat belgisi: 2 · Olma 12 000 so'm (+) · Non 5 000 so'm (+) · Sut 9 000 so'm (+) · Tugma: Buyurtma qil
- «Chala» kartasi — Chala ko'rinish: Rang yo'q, bo'shliq yo'q, tugmalar quruq. Ishlaydi — lekin mijoz ishonmaydi.
- «Sayqallangan» kartasi — Sayqallangan: StyleSheet: ranglar, yumshoq burchaklar, bo'shliq, soyalar. O'sha ilova — lekin haqiqiy ilovadek.
- Natija (ikkalasi ko'rilgach): «Ishlaydi»dan keyin «chiroyli va qulay» keladi — bu ham sizning ishingiz.
- Tugmalar: Orqaga · Ikkalasini ko'ring → Davom etish

## 12 · Telefonda sinov · xato
- Eyebrow: Telefonda sinov · xato
- Sarlavha: Telefonda sinov: xato topiladi → tuzatiladi
- Mentor: Expo Go'da telefonda sinab ko'rasiz — va xato chiqadi! Bosib, tuzatish siklini ko'ring.
- Qadamlar (chapda, bosilgan sari yonadi): 1 · TELEFONDA SINOV · 2 · SABAB · 3 · TUZATISH TOPSHIRIG'I · 4 · QAYTA SINOV
- Tugma: ▶ Telefonda sinash → Keyingi qadam →
- Joriy qadam kartasi (o'ngda):
  1. 1 · TELEFONDA SINOV — Savatga 2 mahsulot qo'shasiz… lekin yuqoridagi savat soni hali «1» ko'rsatyapti! — Sinab ko'rmasangiz, bu xatoni ko'rmaysiz.
  2. 2 · SABAB — Savat soni (holat) to'g'ri yangilanmayapti — kod eski qiymatdan foydalanyapti. — Avval kodni o'qib, sabab qayerda ekanini tushunasiz.
  3. 3 · TUZATISH TOPSHIRIG'I — «Savat soni belgisini cart.length bilan bog'la — har qo'shilganda yangilansin.» — Aniq tuzatish — butun ilovani qayta yozdirmaysiz.
  4. 4 · QAYTA SINOV — Endi «2» ko'rsatadi. — Sikl: sinov → xato → tuzatish → qayta sinov.
- Natija (4-qadamda): Sinov shu: telefonda sinash → xato → aniq tuzatish → qayta sinash. Emulyator ham foydali, lekin **haqiqiy telefonda** sinash qurilmaga xos muammolarni (sekinlik, tugma joyi) ko'rsatishi mumkin — shuning uchun real qurilmada ham sinab ko'ring.
- Tugmalar: Orqaga · Siklni kuzating (N/4) → Davom etish

## 13 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mobil ilovani qanday sinaymiz?
  - Sinamaymiz — AI to'g'ri yozib beradi
  - Faqat ranglar to'g'ri chiqqanini tekshirib
  - Faqat kompyuterda kodga qarab, ochmasdan
  - ✔ Kodni tekshirib, telefonda oqimni bosib ko'rib
- Javob izohlari:
  - To'g'ri: To'g'ri! Avval kodni o'qiysiz, keyin Expo Go bilan telefonda har ekran va oqimni (ro'yxat → savat → buyurtma) bosib sinaysiz. Qurilmada ba'zi xatolar (sekinlik, tugma joyi) shunda ko'rinadi.
  - 1-variant: AI xato qiladi — sinov shart.
  - 2-variant: Rang — bir qismi xolos. Butun oqimni sinang.
  - 3-variant: Kod to'g'ri ko'rinishi mumkin, lekin telefonda boshqacha ishlaydi.
- Umumiy yozuvlar — 4-ekrandagidek.

## 14 · Expo Go · ulashish
- Eyebrow: Expo Go · ulashish
- Sarlavha: Expo Go bilan ilovani ulashing: QR → do'st telefonida
- Mentor: Asosiy oqim tayyor. «Expo Go'da ulash» tugmasini bosing — do'stingiz QR'ni skanerlaydi.
- Telefon: Mini-do'kon · savat belgisi: 0 · Olma 12 000 so'm › · Non 5 000 so'm › · Sut 9 000 so'm › — ostida: Sizning telefon
- Tugma: Expo Go'da ulash → QR kod paydo bo'ladi → Tugma: Do'st QR'ni skanerlaydi → ikkinchi telefon (xuddi shu ilova), ostida: Do'st telefoni ✓
- Izoh (ulashishdan oldin): Bu — ilovani sinash va ulashish usuli, **App Store yoki Play Market'ga joylash emas**. Do'stingiz telefonida Expo Go o'rnatilgan bo'lishi kerak (va odatda ikkalangiz bitta Wi-Fi'da bo'lasiz). Do'konga chiqarish — alohida bosqich, keyin.
- Ulashgach — ro'yxat «Bir o'quvchining yo'li» (har qatori ✓ bilan):
  - QURDI — Ro'yxat → Tafsilot → Savat → Buyurtma, har birini AI yordamida
  - SAYQALLADI — StyleSheet bilan
  - SINADI — Expo Go'da telefonda xarid qilib ko'rdi, xato topib tuzatdi
  - ULASHDI — Expo Go QR bilan, do'sti telefonida ochildi
- Natija: Bitta backend, ko'p telefon. Keyin qoidani ko'rasiz va 4 ekranni xarid oqimi tartibida o'zingiz yig'asiz.
- Tugmalar: Orqaga · Ulashing → Endi navbat sizga →

## 15 · Qoida
- Eyebrow: Qoida
- Sarlavha: Mobil loyiha: quring · sinang · sayqallang · ulashing
- Mentor: Yodda tuting: tayyor backend'ga ulaning, telefonda sinab ko'ring, sayqallang, Expo Go bilan ulashing.
- Karta «Asosiy qoida»: AI kod yozishda yordam beradi. Siz vazifani belgilaysiz, kodni tekshirasiz va natijani sinaysiz.
- Ro'yxat (yuqoridan pastga, ↓ bilan):
  - TAYYOR BACKEND — yangi server qurmaysiz
  - TELEFONDA SINOV — Expo Go bilan
  - SAYQALLANG — StyleSheet bilan
  - ULASHING — Expo Go QR bilan
- Tugmalar: Orqaga · Yakuniy ishga →

## 16 · Xarid oqimini yig'ing
- Eyebrow: Yakuniy · xarid oqimi
- Sarlavha: Oxirgi qadam: 4 ekranni xarid oqimi tartibida yig'ing.
- Mentor: Mijoz ilovada xarid qiladi. 4 ekranni u bosib o'tadigan tartibda joylang.
- Bo'laklar (✔ to'g'ri tartib; ekranda aralash):
  1. Ro'yxat (List)
  2. Tafsilot (Detail)
  3. Savat (Cart)
  4. Buyurtma (Checkout)
- Joylar: 1 · 2 · 3 · 4 (bo'sh joyda: bu yerga qo'ying)
- Xato tartib: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri: ✓ Xarid oqimi tayyor: **Ro'yxat → Tafsilot → Savat → Buyurtma**. Mini-do'konning asosiy oqimi shu.
- Tugmalar: Orqaga · Ekranlarni yig'ing → Davom etish

## 17 · Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Mobil ilova mahsulotlarni qayerdan oladi? | Tayyor backend'dan | GET /products so'rovi bilan, qo'lda yozilmaydi |
| Loyiha kunida sizning vazifangiz? | Topshiriq berish, kodni o'qish, sinash | AI kod taklif qiladi — siz tekshirasiz |
| Kod haqiqatan ishlaganini qanday bilasiz? | Telefonda sinab ko'rsangiz | Expo Go'da oqimni o'zingiz bosib ko'rasiz |
| Savatdagi mahsulotlar qayerda turadi? | Holatda (state) | Holat o'zgarsa, ekran o'zi yangilanadi |
| Savatdagi jami narxni qaysi usul hisoblaydi? | reduce | Narxlarni bitta songa yig'adi |
| Savatdagi mahsulotlar sonini nima beradi? | cart.length | Yuqoridagi savat soni belgisi shundan olinadi |
| Bir ekrandan ikkinchisiga nima yordamida o'tiladi? | navigation.navigate | Ekranlarni Stack Navigator boshqaradi |
| Buyurtma backend'ga qaysi so'rov bilan yuboriladi? | POST /orders | Database'ga yoziladi, bot adminga xabar beradi |
| Ilovaga rang, bo'shliq va tartib nima orqali beriladi? | StyleSheet | Sayqal bosqichi |
| Xato topilsa butun ilovani qayta yozasizmi? | Yo'q — aniq joyi tuzatiladi | Faqat buzilgan joyga aniq topshiriq |
| Tayyor ilovani do'stingiz telefonida qanday ochasiz? | Expo Go va QR bilan | Bu ulashish usuli, App Store'ga joylash emas |
| Nega telefonda ham sinash kerak? | Qurilmaga xos xatolar ko'rinadi | Sekinlik, tugma joyi; emulyator ham foydali |

- Hisob: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar: ✗ Takrorlash · ✓ Bildim
- Hammasi tugagach: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugma: Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Mobil ilova tayyor · N/5 to'g'ri
- Sarlavha: Mini-do'kon mobil ilovangizning asosiy oqimi ishladi.
- Arena tugmasi: CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Mobil ilova tayyor backend'ga ulanadi — bitta tizim, ko'p kirish yo'li
  - Ro'yxat → Tafsilot → Savat → Buyurtma — har ekran AI yordamida quriladi, siz tekshirasiz
  - Savat — holat (state), jami — reduce; holat o'zgarsa ekran yangilanadi
  - Telefonda sinov xatoni topadi → aniq tuzatish topshirig'i bilan tuzatiladi
  - Expo Go va QR — ilovani boshqa telefonda ochib ko'rish (App Store'ga joylash emas)
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish →
- Uyga vazifa (bosilgach):
  - **Quring** — Mentor bergan tayyor loyihada o'z mobil ilovangizni davom ettiring; backend darslaridagi serveringizga ulang
  - **Sinang** — Expo Go'da telefonda har ekranni bosib ko'ring
  - **Ulashing** — sayqallab, QR bilan do'stingizga bering, fikr oling
  - Keyingi dars — PM: **Bugun qaysi ish boshlanadi?** Loyihangizdagi ishlarni uch ufqqa ajratamiz: hozir, uch oydan keyin, olti oydan keyin.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- API Connected — Mobil ilova tayyor backend'ga ulanishini bildingiz (4-ekran, 1-savol)
- Project Builder — Topshiriq berib, kodni o'qib sinashni bildingiz (6-ekran, 2-savol)
- Checkout Done — Buyurtma backend'ga POST /orders bilan ketishini bildingiz (10-ekran, 3-savol)
- Mobile Test — Ilovani kod va telefonda sinashni bildingiz (13-ekran, 4-savol)
- Nishon birinchi urinishda to'g'ri javob uchun beriladi (ekranda bu haqda yozuv yo'q).
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Hisoblagich (yuqorida, bosilganda): Badges — N/4
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Tayyor backend — bitta tizim»
   - Yangi server yo'q — Mobil ilova yangi server yozmaydi — backend darslaridagi **Node.js + PostgreSQL**'ga ulanadi.
   - Mahsulot fetch bilan keladi — Mahsulotlar **GET /products** orqali keladi, qo'lda yozilmaydi.
   - Bitta Database — Web, bot, mobil — bitta Database'dan foydalanadi.
   - Sinfga savol: Mobil ilova mahsulotlarni qayerdan oladi?
2. 2-savol (6-ekran) — «Sizning vazifangiz»
   - Aniq topshiriq — Aniq topshiriq berasiz — **AI kod taklif qiladi**.
   - Kodni o'qiysiz — Kodni **o'qib tushunasiz** va loyihaga qo'shasiz.
   - Telefonda sinaysiz — Telefonda sinaysiz — sikl: topshiriq → kod → sinov → tuzatish.
   - Sinfga savol: Loyiha kunida sizning vazifangiz nima?
3. 3-savol (10-ekran) — «Buyurtma — o'sha oqim»
   - POST /orders — «Buyurtma qil» bosilganda mobil ilova backend'ga **POST /orders** yuboradi.
   - Database saqlaydi — Buyurtma **PostgreSQL**'ga yoziladi — web bilan bir xil.
   - Bot xabar beradi — Telegram bot adminni xabardor qiladi.
   - Sinfga savol: «Buyurtma qil» bosilganda nima bo'ladi?
4. 4-savol (13-ekran) — «Sinov — kod va telefon»
   - Avval kod — Avval **kodni o'qiysiz**.
   - Keyin telefon — Keyin Expo Go bilan **telefonda** har ekran va oqimni bosib sinaysiz.
   - Aniq tuzatish — Xato topilsa — aniq tuzatish topshirig'i, butun ilova qayta yozilmaydi.
   - Sinfga savol: Mobil ilovani qanday sinaymiz?

## Jonli viktorina (12 savol)
Savol vaqti 15 soniya.
1. Mobil ilova mahsulot ma'lumotini qayerdan oladi?
   - ✔ Tayyor backend'dan (`GET /products`)
   - Ilova ichiga qo'lda yozilgan ro'yxatdan
   - Faqat mobil uchun yozilgan yangi API serverdan
   - Hech qayerdan — Database bo'lmaydi
2. Loyiha kunida sizning vazifangiz nima?
   - Kodni o'qimasdan shundoq ishlatish
   - ✔ Topshiriq berish, kodni o'qish, sinash
   - Hamma kodni o'zingiz qo'lda yozish
   - Faqat ranglar va dizaynni tanlash
3. React Native'da ro'yxatni ko'rsatish uchun qaysi komponent?
   - `<div>`
   - `<table>`
   - ✔ `<FlatList>`
   - `<ScrollView>`
4. «Buyurtma qil» bosilganda nima bo'ladi?
   - Buyurtma faqat telefonda saqlanadi
   - Umuman hech narsa bo'lmaydi
   - Yangi mobil API ishga tushadi
   - ✔ Backend'ga `POST /orders` ketadi
5. Yuqoridagi savat soni belgisi nima bilan bog'lanadi?
   - Backend fayl nomi bilan
   - ✔ `cart.length` (holat) bilan
   - Rasm o'lchami (`width`) bilan
   - Sahifa sarlavhasi bilan
6. Jami narxni hisoblash uchun qaysi usul qulay?
   - ✔ reduce
   - map
   - filter
   - sort
7. Expo Go asosan nima uchun kerak?
   - Kodni boshqa tilga tarjima qilish uchun
   - Yangi backend qurish uchun
   - Ilovaga rasm chizish uchun
   - ✔ Ilovani telefonda sinash va ulashish uchun
8. Mobil ilovani qanday sinaymiz?
   - Umuman sinamaymiz
   - Faqat kompyuterda kodga qarab
   - ✔ Kodni o'qib, telefonda oqimni bosib
   - Faqat ranglarni tekshirib
9. Web, bot va mobil bir xil buyurtmalarni qanday ko'radi?
   - ✔ Bitta backend va Database'ga ulanadi
   - Har biriga alohida Database quriladi
   - Ma'lumot qo'lda nusxalanadi
   - Buni umuman qilib bo'lmaydi
10. Ilova «ishlaydi» bo'lgandan keyin yana nima kerak?
   - Boshqa hech narsa kerak emas
   - Backend'ni o'chirish — API endi kerak emas
   - Hamma kodni boshidan qayta yozish
   - ✔ Sayqal — StyleSheet bilan
11. Tafsilot ekraniga o'tish uchun nima ishlatiladi?
   - reduce
   - fetch
   - ✔ navigation.navigate
   - StyleSheet.create
12. Nega telefonda ham sinash kerak?
   - Kodni ancha tezroq yuklaydi
   - ✔ Qurilmaga xos xatolar ko'rinadi
   - Kod yozish umuman kerak emas
   - Ulanish uchun internet kerak emas
