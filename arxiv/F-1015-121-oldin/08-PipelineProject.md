# 8-dars «Loyiha kuni: to'liq pipeline» — yakuniy matn

Fayl: `src/6-Modull/PipelineProjectLesson.jsx` · 21 ekran · Keyingi dars: «React Native — asoslari»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: 5 qism tayyor — lekin ulanmagan. Nima yetishmayapti?
- Mentor: Oldingi modullarda React, Node.js, PostgreSQL, Telegram bot va AI bilan ishladingiz. Endi ularni bitta tizimga ulaymiz. Ikki holatni bosing.
- Tugmalar (almashtirgich): Alohida · Ulangan
- Karta (tanlangan holatga qarab):
  - Alohida — 5 alohida qism: "React bor, Node bor, Database bor, bot bor, AI bor — lekin har biri alohida ishlaydi, bir-biriga ulanmagan."
  - Ulangan — Bitta tizim: "Ular ulanganda: «Buyurtma» bosiladi → backend qabul qiladi → Database saqlaydi → bot adminga xabar yuboradi. Mijoz savol bersa — AI javob beradi."
- Savol (o'ng ustun, yorliq): Nima yetishmayapti?
  - Hech narsa — har biri alohida yaxshi ishlaydi
  - ✔ Ulanish — qismlar bir-biriga ma'lumot uzatishi
  - Ko'proq yangi komponent qo'shish kerak
- Javob izohlari:
  - 2-variant: **Aynan!** Yetishmagani — **ulanish**. Bugun beshala qismni bitta ishlaydigan tizimga ulaymiz. Kodni AI yordamida yozamiz, lekin uni o'qib, tekshirib boramiz.
  - 1 yoki 3-variant: **Qiziq fikr!** Lekin qismlar alohida yaxshi ishlasa ham, bir-biriga ma'lumot uzatmasa — tizim bo'lmaydi. Yangi qism qo'shish ham yordam bermaydi. Yetishmagani — **ulanish**. Bugun shuni quramiz.
- Tugma: Davom etish
- Barcha ekranlarda umumiy: telefonda Mentor yig'ilganda — «Mentor · ko'rsatmani ochish ▾»; jonli darsda mentor hali o'tmagan sahifada oldinga tugma o'rnida — «Mentorni kuting» (sichqoncha ustida: Mentor hali bu sahifaga o'tmadi)

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Tayyor qismlarni bitta tizimga ulaymiz
- Mentor: Qismlarni noldan yozmaymiz. AI'ga aniq topshiriq berasiz, u kod yozadi, siz kodni o'qib, sinab ko'rasiz.
- Yorliq: Bugungi maqsad
  - Karta: 5 qism → bitta tizim · Ulanishlarni AI yordamida yozamiz va har birini tekshiramiz.
- Yorliq: 5 qadam
  - 01 · 5 qism: React, Node.js, PostgreSQL, Telegram, AI
  - 02 · Ma'lumot qanday o'tadi (pipeline)
  - 03 · AI bilan kod yozish: aniq prompt → kod → test → tuzat
  - 04 · Ulanishlarni qurish va sinash · jonli
  - 05 · O'z loyihangizda ulanishlarni qurasiz · amaliyot
- Tugmalar (telefonda): 5 qadamni ko'rish · ↩ Maqsadni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · 5 qism
- Eyebrow: 5 qism
- Sarlavha: Tizimning 5 qismi
- Mentor: Hammasini avval o'rgangansiz — endi ular birga ishlaydi. Har birini bosing: nima qiladi.
- Qismlar ro'yxati (bosilgani ✓ bilan): React Frontend · Node.js Backend · PostgreSQL Database · Telegram Bot · AI (Claude) Yordamchi xizmat
- Bosilganda o'ng ustunda (yorliq «<nom> · <vazifa>» va izoh):
  - React · Frontend — Mijoz ko'radigan sahifa: mahsulotlar va «Buyurtma» tugmasi.
  - Node.js · Backend — So'rovlarni qabul qiladi va boshqaradi: `GET /products`, `POST /orders`.
  - PostgreSQL · Database — Ma'lumotni saqlaydi: `products` va `orders` jadvallari.
  - Telegram · Bot — Yangi buyurtma kelganda adminga xabar yuboradi.
  - AI (Claude) · Yordamchi xizmat — Node.js uni kerak bo'lganda chaqiradi: mijoz savoliga javob yozadi, mahsulot tavsifini tayyorlaydi.
- Xulosa (5/5): Bu loyihada Node.js — asosiy boshqaruv qismi: frontend'dan kelgan so'rovlar u orqali o'tadi, Database, bot va AI bilan ham u ishlaydi.
- Tugmalar: Orqaga · N/5 qismni ko'ring → Davom etish

## 3 · Pipeline
- Eyebrow: Pipeline
- Sarlavha: Ma'lumot qismdan qismga qanday o'tadi
- Mentor: Ma'lumotning bir qismdan keyingisiga o'tish yo'lini **pipeline** deyishadi. Tizimda bunday yo'l bittadan ko'p bo'lishi mumkin. Bosib, qadamlarni ochib boring.
- Qadamlar (xira turadi, bosilgach bittadan ochiladi):
  - Yorliq: Buyurtma oqimi
    1. Mijoz saytda «Buyurtma» bosadi (React)
    2. React Node.js'ga `POST /orders` so'rovini yuboradi
    3. Node.js buyurtmani PostgreSQL'ga saqlaydi
    4. Node.js Telegram orqali adminga xabar yuboradi
  - Yorliq: Savol oqimi (alohida)
    5. Mijoz savol yozsa — Node.js uni AI'ga yuboradi, AI javobi mijozga qaytadi
- Tugma: ▶ Buyurtmani boshlash → Keyingi qadam →
- Yorliq: Sxema — React ↓ Node.js, undan uch yo'l: PostgreSQL · Telegram · AI (ochilgan qadamning qismi yonadi)
- Xulosa (5 qadamdan keyin): Hamma narsa bitta uzun zanjir emas: Node.js'dan bir nechta yo'l chiqadi. Qaysi yo'l ishlashi — qanday so'rov kelganiga bog'liq.
- Tugmalar: Orqaga · Oqimni kuzating (N/5) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: «Pipeline» nima degani?
  - Bitta katta kod fayli — hammasi bir joyda
  - Faqat ko'rinadigan frontend qismi
  - Bir-biriga ulanmagan mustaqil dasturlar
  - ✔ Ma'lumotning qismdan qismga o'tish oqimi
- Javob izohlari:
  - To'g'ri: To'g'ri! Pipeline — ma'lumot yoki ishning bir qismdan keyingisiga o'tish oqimi. Masalan, buyurtma React'dan Node.js'ga, undan PostgreSQL'ga o'tadi.
  - 1-variant: Bitta fayl emas — bir-biriga ma'lumot uzatadigan qismlar.
  - 2-variant: Faqat frontend emas — ma'lumot bir necha qism orqali o'tadi.
  - 3-variant: Aksincha — pipeline aynan qismlar bir-biriga ulanganda paydo bo'ladi.
- Test ekranlarining umumiy yozuvlari (4, 6, 10, 13-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · AI bilan kod yozish
- Eyebrow: AI bilan kod yozish
- Sarlavha: AI kod yozadi — nima qurilishini va natijani siz tekshirasiz
- Mentor: AI bilan kod yozishning ikki yo'li bor. Ikkalasini bosing.
- Tugmalar (almashtirgich): Ko'r-ko'rona · Nazorat bilan
- Ko'r-ko'rona:
  - Karta: «Sayt qil» deb yozib, AI bergan kodni o'qimasdan ishlatasiz. Xato chiqsa — nima qilishni bilmaysiz.
  - O'ngda (ogohlantirish): AI xatosini ko'rmaysiz — tizim nazoratingizdan chiqadi.
- Nazorat bilan:
  - Karta: Aniq topshiriq berasiz, AI kodini o'qiysiz, sinaysiz, kerak bo'lsa tuzatasiz.
  - O'ngda: Buni direktor ishiga o'xshatish mumkin: nima qilishni siz belgilaysiz, AI bajaradi, natijani siz tekshirasiz.
- Ikkalasi ko'rilgach:
  - AI bilan kod yozish: aniq topshiriq berish · kodni o'qish · sinash · tuzatish. Natija uchun siz javobgarsiz.
  - Izoh: Internetda bunday ishni ko'pincha **vibecoding** deyishadi. Bu so'z ba'zan «kodni o'qimay, AI'ga to'liq ishonish» ma'nosida ham ishlatiladi — biz esa aksincha, kodni o'qib, tekshirib ishlaymiz.
- Tugmalar: Orqaga · Ikkalasini ko'ring → Davom etish

## 6 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI bilan kod yozganda sizning vazifangiz nima?
  - ✔ Aniq topshiriq berish, kodni o'qish va sinash
  - AI bergan kodni o'qimasdan darhol ishlatish
  - AI'siz, hamma kodni faqat qo'lda yozish
  - Hech narsa — hammasini AI o'zi hal qiladi
- Javob izohlari:
  - To'g'ri: To'g'ri! Siz aniq topshiriq berasiz, AI kodini o'qib tushunasiz, sinaysiz va kerak bo'lsa tuzatasiz. AI tez yozadi, natijani esa siz tekshirasiz.
  - 2-variant: O'qimasdan ishlatish xavfli — kod nima qilishini tushunishingiz kerak.
  - 3-variant: Hammasini qo'lda yozish shart emas — AI yozadi, siz tekshirasiz.
  - 4-variant: AI hamma narsani o'zi hal qilmaydi — nima qurilishini siz belgilaysiz.
- Umumiy yozuvlar — 4-ekrandagidek.

## 7 · Ulanishlar · jonli
- Eyebrow: Ulanishlar · jonli
- Sarlavha: Ulanishlarni prompt bilan quring
- Mentor: Har ulanish uchun AI'ga prompt yuborasiz — AI kod yozadi, ulanish yonadi. To'rttalasini ulang, keyin «Buyurtma yuborish»ni bosing.
- Doska: React · Node.js · PostgreSQL · Telegram · AI (ulangan qism yonadi)
- Ulanish tugmalari (har birida: prompt yuborish → ulandi): React → Node · Node → PostgreSQL · Node → Telegram · Node → AI
- O'ng ustun (hech biri bosilmaganda): Ulanishni bosing — promptni va AI yozgan kodni ko'rasiz.
- Bosilganda — yorliq «<ulanish> — promptingiz», qo'shtirnoqdagi prompt va AI kodi:
  - React → Node — "Buyurtma" tugmasi POST /orders so'rov yuborsin
    ```js
    fetch(API + "/orders", { method: "POST", body })
    ```
  - Node → PostgreSQL — Buyurtmani orders jadvaliga INSERT qil
    ```js
    INSERT INTO orders(mahsulot, soni, narx) VALUES(...)
    ```
  - Node → Telegram — Adminga "Yangi buyurtma" xabar yubor
    ```js
    bot.sendMessage(ADMIN_ID, "Yangi buyurtma...")
    ```
  - Node → AI — Mijoz savolini Claude'ga yuborib javob ol
    ```js
    claude.messages.create({ messages: [...] })
    ```
- Tugma (4 ta ulangach): ▶ Buyurtma yuborish
- Natija: Tizim ishladi! — Buyurtma Database'ga saqlandi → admin Telegram'da xabar oldi. Mijoz savol yozsa — AI javob beradi.
- Tugmalar: Orqaga · Ulanishlarni quring (N/4) → Davom etish

## 8 · Prompt sifati
- Eyebrow: Prompt sifati
- Sarlavha: Aniq prompt — aniqroq kod
- Mentor: Prompt qanchalik noaniq bo'lsa, AI shunchalik ko'p taxmin qiladi. Ikkalasini bosib, natijani solishtiring.
- Tugmalar (almashtirgich): Noaniq · Aniq
- Karta «PROMPT:»
  - Noaniq: «buyurtma qismini yoz»
    - O'ngda: AI taxmin qiladi — Qaysi manzil? Qaysi jadval? Javob qanday? AI o'zicha taxmin qiladi — natija ko'pincha chala yoki noto'g'ri.
  - Aniq: «Express POST /orders: req.body'dan {mahsulot, soni} ol, orders jadvaliga INSERT qil, 201 qaytar»
    - O'ngda: AI aniqroq yozadi — Manzil, jadval va javob aniq aytilgan — AI kerakli kodni yozishi ancha osonlashadi. Baribir sinab ko'rasiz.
    - Izoh: `req.body` — mijoz yuborgan ma'lumot · `201` — «yangi yozuv yaratildi» degan server javobi
- Ikkalasi ko'rilgach: Yaxshi prompt: nima, qayerda, qanday natija — aniq ayting.
- Tugmalar: Orqaga · Ikkalasini ko'ring → Davom etish

## 9 · Sikl · jonli
- Eyebrow: Sikl · jonli
- Sarlavha: Sikl: prompt → kod → test → tuzatish
- Mentor: Bitta ulanishni qanday quramiz? Sikl orqali. Bosib, har qadamni ko'ring — xato ham chiqadi!
- Chap ustun — 5 qadam yo'lagi (o'tgani ✓): 1 · PROMPT · 2 · AI KOD · 3 · TEST · 4 · TUZATISH · 5 · QAYTA TEST
- Tugma: ▶ Siklni boshlash → Keyingi qadam →
- O'ng ustun — joriy qadam kartasi (yorliq, matn, izoh):
  1. 1 · PROMPT — «Express POST /orders yoz: req.body'dan mahsulot va soni ol, orders jadvaliga INSERT qil, 201 qaytar.» — Aniq topshiriq berasiz.
  2. 2 · AI KOD — AI kod yozadi. Siz o'qiysiz va tushunasiz.
     ```js
     app.post("/orders", async (req, res) => { await db.query("INSERT ..."); res.status(201).json(ok); })
     ```
  3. 3 · TEST — Buyurtma yuborib ko'rasiz… Xato: narx (price) bo'sh (NULL) saqlanyapti! — Sinab ko'rmasangiz, xatoni bilmaysiz.
  4. 4 · TUZATISH — «INSERT so'roviga narx (price) ustunini ham qo'sh.» — Aniq tuzatish — butun kodni qayta yozdirmaysiz.
  5. 5 · QAYTA TEST — Ishladi! Narx ham saqlandi. — Bitta ulanish tayyor — keyingisiga o'tamiz.
- Xulosa (5-qadamda): **Prompt → AI kod → Test → Xato → Tuzatish → Qayta test.** Har ulanish shunday quriladi.
- Tugmalar: Orqaga · Siklni kuzating (N/5) → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Qaysi prompt yaxshiroq natija beradi?
  - «Menga yaxshi ishlaydigan buyurtma sahifasi qilib ber»
  - «Buyurtma bilan bog'liq kerakli kodlarni o'zing yoz»
  - ✔ «POST /orders yoz: body'dan mahsulot va soni ol, Database'ga saqla»
  - «Buyurtmalarni o'zing bilganingcha qilib hal qilaver»
- Javob izohlari:
  - To'g'ri: To'g'ri! Bu promptda nima (POST /orders), kirish (body) va amal (Database'ga saqlash) aniq aytilgan. AI kerakli kodni yozishi ancha osonlashadi.
  - 1-variant: Juda umumiy — AI nimani, qanday qilishni bilmaydi.
  - 2-variant: Noaniq — qaysi kod, nima uchun?
  - 4-variant: «O'zing bilganingcha» — nazoratni yo'qotasiz.
- Umumiy yozuvlar — 4-ekrandagidek.

## 11 · AI kodini o'qish
- Eyebrow: AI kodini o'qish
- Sarlavha: AI kodiga ko'r-ko'rona ishonmang
- Mentor: AI tez yozadi, lekin xato ham qiladi. Kodni o'qib, tekshirasiz. Ikkalasini bosing.
- Tugmalar (almashtirgich): Ko'rmasdan ishlat · O'qib tushun
- Ko'rmasdan ishlat:
  - Karta: Kodni o'qimasdan ishlatasiz. AI maxfiy kalitni (token) kodga ochiq yozib qo'yibdi — siz bilmaysiz, bu xavfsizlik teshigi.
  - O'ngda (ogohlantirish): Ko'rmasdan ishonish — AI xatosi sizning xatongizga aylanadi.
- O'qib tushun:
  - Karta: Har qatorni o'qiysiz: nima qilyapti, xavfsizmi? Xatoni darrov ko'rasiz va tuzatasiz.
  - O'ngda: O'qish — tushunish. Tushunsangiz, tuzata olasiz va nazorat sizda.
- Ikkalasi ko'rilgach: Qoida: AI yozadi, lekin oxirgi qaror — sizniki. Kodni doim o'qing.
- Tugmalar: Orqaga · Ikkalasini ko'ring → Davom etish

## 12 · Ulanish xatosi
- Eyebrow: Ulanish xatosi
- Sarlavha: Ko'p uchraydigan xato: frontend backend'ga yetib bormayapti
- Mentor: Qismlarni ulaganda eng ko'p uchraydigan xatolardan biri — ulanish manzili. Belgini o'qing, sababini toping.
- Karta «BELGI»: Mijoz «Buyurtma» bosadi — lekin hech narsa bo'lmaydi. Konsolda: `Failed to fetch`. Backend ishlayapti, Database ham.
- Yorliq: Sababni tanlang
  - Mahsulot rasmining rangi noto'g'ri
  - ✔ Frontend'dagi backend manzili (URL) noto'g'ri
  - Sahifadagi logotip juda kichik
- Noto'g'ri sabab bosilsa — u ✗ bilan silkinadi, matn chiqmaydi.
- O'ngda (topilmaguncha): «Failed to fetch» — frontend backend'ga yetib bora olmadi. Backend ishlayotgan bo'lsa, u qaysi manzilga so'rov yuboryapti?
- Topilgach: Topdingiz!
  - Frontend so'rovni noto'g'ri manzilga (masalan, boshqa portga) yuboryapti. Tuzatish: to'g'ri manzilni qo'ying. Bu xatoning boshqa sabablari ham bo'ladi — server ishlamay qolgan bo'lishi yoki backend CORS orqali ruxsat bermagan bo'lishi mumkin (buni 4-Modulda ko'rgansiz). Boshidan oxirigacha (end-to-end) test shunday xatolarni tutadi.
  - Izoh: End-to-end — tizimni boshidan oxirigacha, bitta haqiqiy amal bilan tekshirish.
- Tugmalar: Orqaga · Sababni toping → Davom etish

## 13 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Ulanish xatolarini qanday topamiz?
  - Kodni sinamasdan, ishlaydi deb ishonamiz
  - ✔ Har ulanishni, keyin butun oqimni sinaymiz
  - Faqat sahifaning tashqi ko'rinishiga qaraymiz
  - AI hech qachon xato qilmaydi deb hisoblaymiz
- Javob izohlari:
  - To'g'ri: To'g'ri! Avval har ulanishni alohida, keyin butun oqimni boshidan oxirigacha (end-to-end) sinaymiz. Shunda ulanish xatolari (manzil, ruxsat, ma'lumot shakli) ko'rinadi.
  - 1-variant: Sinamasangiz, xatoni mijoz topadi.
  - 3-variant: Tashqi ko'rinish emas — ulanish ishlayaptimi, shuni sinash kerak.
  - 4-variant: AI ham xato qiladi — shuning uchun sinaymiz.
- Umumiy yozuvlar — 4-ekrandagidek.

## 14 · Namuna
- Eyebrow: Namuna
- Sarlavha: To'liq hikoya: 5 qism → bitta tizim
- Mentor: Bir o'quvchi tizimni qanday ulagani — 4 qadam. Har qatorni bosing.
- Karta «Tizimni ulash — 4 qadam» (4 qator, bosilgani ✓ bilan):
  - BO'LDI · Tizimni 4 ta ulanishga bo'ldi: React→Node, Node→Database, Node→bot, Node→AI
  - PROMPT · Har ulanish uchun aniq prompt yozdi
  - TEST · Har qadamda sinab, xato topib tuzatdi
  - ISHLADI · Bitta buyurtma Database'ga yozildi, admin xabar oldi
- Qator bosilganda o'ngda — yorliq, qo'shtirnoqdagi qator matni va sababi:
  - BO'LDI — Katta vazifani kichik, aniq qadamlarga bo'ldi.
  - PROMPT — Aniq topshiriq berdi — AI'ga taxmin qilishga joy qoldirmadi.
  - TEST — AI kodiga ko'r-ko'rona ishonmadi.
  - ISHLADI — 5 qism bitta tizim bo'lib ishladi.
- Xulosa (4/4): Bo'lish → prompt → sinash → ulash. Endi navbat sizga.
- Tugmalar: Orqaga · N/4 ko'ring → Endi navbat sizga →

## 15 · Qoida
- Eyebrow: Qoida
- Sarlavha: Tizimni ulash qoidasi: bo'lish · topshiriq · sinash · ulash
- Mentor: Yodda tuting: tizimni ulanishlarga bo'ling, aniq prompt bering, kodni o'qib sinang, qadamma-qadam ulang.
- Uch qator (orasida ↓):
  - ANIQ PROMPT — nima, qayerda, qanday natija
  - KODNI O'QING — ko'r-ko'rona ishonmang
  - SINANG VA TUZATING — har ulanishni sinab ulang
- Tugmalar: Orqaga · Yakuniy ishga →

## 16 · Yakuniy ish
- Eyebrow: Yakuniy ish
- Sarlavha: Bitta buyurtma — tizim bo'ylab
- Mentor: Mijoz «Buyurtma» bosdi. Bosqichlarni to'g'ri tartibda joylang — buyurtma qayerdan qayerga o'tadi?
- Sudrab joylash: 5 ta raqamli katak (har birida «bu yerga qo'ying»), ostida aralash bo'laklar. To'g'ri tartib:
  1. React — mijoz «Buyurtma» bosadi
  2. React — POST /orders so'rovini yuboradi
  3. Node.js — so'rovni qabul qiladi
  4. PostgreSQL — buyurtmani saqlaydi
  5. Telegram — adminga xabar boradi
- Hamma katak to'lib, tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri bo'lsa: ✓ Buyurtma yo'li tayyor: **Bosish → So'rov → Node.js → PostgreSQL → Telegram**. AI esa alohida yo'lda — mijoz savol berganda ishlaydi.
- Tugmalar: Orqaga · Buyurtma yo'lini yig'ing → Davom etish

## 17 · Amaliyot · VS Code
- Eyebrow: Amaliyot · VS Code
- Sarlavha: Tizimingizni AI bilan ulang
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- Karta «TOPSHIRIQ»: O'z mini-tizimingizni qadamma-qadam ulang: har ulanish uchun aniq prompt yozing, AI kodini o'qing, sinab ko'ring. Bugun asosiy ikki ulanishni quramiz; Telegram va AI ulanishi — qo'shimcha qadam.
- Yorliq: Bosqichlar — belgilab boring (bosilgani ✓ bilan)
  1. Loyihani oching: `frontend` (React) va `backend` (Node.js) papkalari
  2. 1-ulanish: React → Node.js — «`POST /orders` yuboradigan tugma yoz» deb prompt bering
  3. AI kodini o'qing: `fetch` to'g'ri backend manziliga ketyaptimi?
  4. 2-ulanish: Node.js → PostgreSQL — «buyurtmani `orders` jadvaliga `INSERT` qil» prompti
  5. Boshidan oxirigacha sinang: bitta «Buyurtma» bosing — buyurtma Database'da paydo bo'ldimi?
- Izoh: Qo'shimcha: Node.js → Telegram (adminga xabar) yoki Node.js → AI (savolga javob) ulanishini ham quring.
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach: Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 18 · Natijalar (podium) — jonli reyting

## 19 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar (12 ta, «Kartochkalar» bo'limida)
- Jonli dars davomida o'quvchiga bu ekran ko'rsatilmaydi — 18-ekrandan to'g'ri Yakunga o'tadi.
- Tugmalar: Orqaga · Yakunlash →

## 20 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Loyiha kuni tugadi · N/5 to'g'ri
- Sarlavha: Endi tayyor qismlarni bitta tizimga ulay olasiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Karta «Endi siz bilasiz»:
  - Qismlar bir-biriga ma'lumot uzatsa, ular bitta tizim bo'lib ishlaydi
  - Pipeline — ma'lumotning qismdan qismga o'tish oqimi; u Node.js'dan tarmoqlanadi
  - AI bilan kod yozish sikli: prompt → kod → test → tuzatish → qayta test
  - Aniq prompt aniqroq kod olishga yordam beradi; AI kodini doim o'qing
  - Ulanish xatolari boshidan oxirigacha (end-to-end) test bilan topiladi
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: amaliyot · loyiha · mashq · natija)
- Bosilgach karta «Uyga vazifa»:
  - **Bo'ling** — tizimni ulanishlarga bo'ling, har biriga aniq prompt yozing
  - **Ulang** — qadam-qadam ulang, har ulanishni alohida testlang
  - **Sinang** — bitta buyurtma bilan butun oqimni (end-to-end) tekshiring
  - Izoh: Keyingi dars — React Native: tizimingizga mobil ilova qo'shamiz!
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pipeline nima degani? | Ma'lumotning qismdan qismga o'tish oqimi | Masalan: React → Node.js → PostgreSQL |
| Tizim bilan pipeline bir narsami? | Yo'q | Tizim — hamma qismlar; pipeline — ular orasidagi oqim |
| Mijoz ko'radigan sahifani nima chizadi? | React | Frontend: mahsulotlar va «Buyurtma» tugmasi |
| Bu loyihada so'rovlarni qabul qiladigan qism qaysi? | Node.js | Backend: Database, bot va AI bilan ham u ishlaydi |
| Buyurtmalar qayerda saqlanadi? | PostgreSQL | Database: products va orders jadvallari |
| Yangi buyurtmada adminga kim xabar yuboradi? | Telegram bot | Xabarni unga Node.js yuboradi |
| AI tizimda qachon ishlaydi? | Node.js uni chaqirganda | Masalan, mijoz savol yozganda |
| AI bilan kod yozish sikli qanday? | Prompt → kod → test → tuzatish → qayta test | Har ulanish shunday quriladi |
| AI yozgan kodni nima qilish kerak? | O'qib tushunish | Ko'r-ko'rona ishonsangiz, AI xatosi sizniki bo'ladi |
| Aniq prompt nimalarni aytadi? | Nima, qayerda, qanday natija | «Sayt qil» emas, «POST /orders yoz» |
| Konsolda «Failed to fetch» chiqsa, avval nimani tekshirasiz? | Frontend so'rov yuborayotgan backend manzilini | Server ishlayaptimi va CORS ruxsat beryaptimi — ham tekshiriladi |
| Kodni yozgandagi xato inglizcha qanday ataladi? | Bug | Topib tuzatish — debugging |

- Hammasi bilinganda: Hammasini bilasiz! · N/N atama yodlandi · ↻ Qaytadan takrorlash

## Nishonlar
- Full Pipeline — Pipeline nima ekanini bildingiz (4-ekran, 1-savol)
- Clear Prompt — Aniq promptni tanidingiz (10-ekran, 3-savol)
- Bug Catcher — Ulanish xatosini test bilan topishni bildingiz (13-ekran, 4-savol)
- Order Flow — Buyurtma yo'lini to'g'ri tizdingiz (16-ekran, Yakuniy ish)
- Nishon faqat birinchi urinishda to'g'ri javob uchun beriladi; 2-savol (6-ekran) uchun nishon yo'q.
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Pipeline — ma'lumot oqimi»
   - Qismlar ulanadi — React, Node.js, Database, bot, AI.
   - Ma'lumot qismdan qismga o'tadi — Masalan, buyurtma React'dan Node.js'ga, undan **Database'ga**.
   - Node.js'dan bir nechta yo'l chiqadi — Database, bot, AI.
   - Sinfga savol: Tizim bilan pipeline'ning farqi nima?
2. 2-savol (6-ekran) — «AI bilan kod — natijani siz tekshirasiz»
   - Topshiriq berasiz — **Aniq topshiriq** berasiz.
   - Kodni o'qiysiz — AI yozgan kodni **o'qib tushunasiz**.
   - Sinab tuzatasiz — Sinab, xato topsangiz — aniq tuzatish prompti berasiz.
   - Sinfga savol: Nega kodni o'qib tushunish kerak?
3. 3-savol (10-ekran) — «Aniq prompt»
   - Nima, qayerda, qanday natija — **Nima** qilish, **qayerda**, qanday **natija** — aniq aytiladi.
   - Noaniq — taxmin — Noaniq prompt bilan AI **taxmin qiladi**.
   - Baribir sinaysiz — Aniq prompt yordam beradi, lekin **baribir sinaysiz**.
   - Sinfga savol: Qaysi prompt aniqroq: «sayt qil» yoki «POST /orders yoz»?
4. 4-savol (13-ekran) — «Ulanish xatosi»
   - Ko'p uchraydigan sabab — Frontend **noto'g'ri manzilga** so'rov yuboradi.
   - Boshqa sabablar — Server ishlamayapti, CORS ruxsat bermayapti.
   - Sinab topamiz — Har ulanishni va butun oqimni sinab, **xatoni topamiz**.
   - Sinfga savol: Ulanish xatosini qanday topamiz?

## Jonli viktorina (12 savol)
Savol vaqti 15 soniya. Reytingdagi savol yorliqlari (dars testlari): 1 — Pipeline · 2 — AI bilan kod · 3 — Prompt · 4 — Ulanish xatosi · 5 — Tartib
1. Pipeline nima degani?
   - ✔ Ma'lumotning qismdan qismga o'tish oqimi
   - Bitta katta kod fayli — hammasi ichida
   - Faqat ko'rinadigan frontend qismi
   - Bir-biriga ulanmagan mustaqil dasturlar
2. AI bilan kod yozganda sizning vazifangiz?
   - Hamma kodni qo'lda yozish
   - ✔ Aniq topshiriq berish, o'qish va sinash
   - Hech narsa qilmaslik
   - AI bergan kodni ko'rmasdan ishlatish
3. Frontend so'rovni qayerga yuboradi?
   - Brauzer tarixiga
   - Foydalanuvchining telefoniga
   - ✔ Backend manziliga
   - To'g'ridan-to'g'ri Telegram'ga
4. «Failed to fetch» xatosining ko'p uchraydigan sababi?
   - Logotip juda kichik bo'lgani
   - Mahsulot rasmining rangi
   - Sahifa sarlavhasi noto'g'riligi
   - ✔ Backend manzili noto'g'riligi
5. Aniq prompt qanday bo'ladi?
   - ✔ Nima, qayerda va qanday natija aniq aytilgan
   - «saytni yaxshi qilib yozib ber» degan
   - «hammasini o'zing bilganingcha qil»
   - Umuman aniq topshiriq bermaslik
6. AI yozgan kodni nima uchun o'qiysiz?
   - Rangini o'zgartirish uchun
   - ✔ Xato va xavfni ko'rib, tuzatish uchun
   - Faylni kattalashtirish uchun
   - Kodni chiroyliroq ko'rsatish uchun
7. Ulanish xatosini qanday topamiz?
   - Faqat rangga qaraymiz
   - Umuman sinamaymiz
   - ✔ Boshidan oxirigacha sinaymiz
   - AI xato qilmaydi deb ishonamiz
8. Buyurtma yuborilganda qaysi qism birinchi ishlaydi?
   - PostgreSQL (Database)
   - Telegram (bot)
   - AI (yordamchi xizmat)
   - ✔ React (frontend)
9. Bu loyihada Node.js qanday vazifani bajaradi?
   - ✔ So'rovlarni qabul qilib, boshqaradi
   - Faqat rasm va chizmalar chizadi
   - Ma'lumotni ko'rmay o'tkazib yuboradi
   - Foydalanuvchi parolini ko'rsatadi
10. Buyurtma ma'lumoti qayerda saqlanadi?
   - Telegram bot xabarida
   - ✔ Database'dagi orders jadvalida
   - Brauzer tarixida
   - Hech qayerda saqlanmaydi
11. AI bilan kod yozish sikli qanday?
   - Prompt → kod → darhol ishlatish
   - Kodni ko'rmasdan ishlatish
   - ✔ Prompt → kod → test → tuzatish → qayta
   - Hammasini bitta promptda yozdirish
12. «End-to-end test» nimani tekshiradi?
   - Faqat bitta tugmaning rangini
   - Faqat kirish (login) sahifasini
   - Faqat Database'ning nomini
   - ✔ Butun oqimni — buyurtma oxirigacha yetadimi
