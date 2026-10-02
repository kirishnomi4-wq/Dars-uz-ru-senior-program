# 6-Modul (LMS: 8-Modul) · 8-dars «Praktika: to'liq pipeline» — YANGI MATN (v2)

Fayl: `src/6-Modull/PipelineProjectLesson.jsx` · 21 ekran · faqat o'zbekcha
Eski matn: `08-PipelineProject-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (4-ekran=4-variant, 6-ekran=1, 10-ekran=3, 13-ekran=2; arena 1-2-3-4 aylanma) — faqat matn.

---

## A. Darsning tayanchi

1. **Bosh fikr:** alohida ishlayotgan qismlar bir-biriga ma'lumot uzatsa, ular bitta tizim bo'lib ishlaydi. Bugun tayyor qismlarni **ulaymiz** va ishlashini **tekshiramiz**.
2. **Tizim ≠ pipeline:** *tizim* — barcha qismlar birgalikda (1-darsda o'tilgan). *Pipeline* — ma'lumot yoki ishning bir qismdan keyingisiga o'tish **oqimi**.
3. **Oqim bitta uzun zanjir emas — Node.js'dan tarmoqlanadi.** Ikki oqim bor:
   - **Buyurtma oqimi:** React → Node.js → PostgreSQL (saqlash), keyin Node.js → Telegram (adminga xabar)
   - **Savol oqimi:** React → Node.js → AI → javob mijozga qaytadi
   ```
           React
             ↓
          Node.js
        ↙    ↓     ↘
   PostgreSQL Telegram  AI
   ```
4. **AI bilan kod yozish sikli (darsning asosiy formulasi):** Prompt → AI kod → Test → Xato → Tuzat → Qayta test.
5. **Kafolat yo'q:** aniq prompt AI'ga kerakli kodni aniqroq yozishga **yordam beradi**, lekin xatosiz kodni kafolatlamaydi — shuning uchun test qilamiz.
6. **Metafora:** shahar (Peshtoq/Hokimlik/Arxiv/Darvoza/Ekspert-byuro) — butunlay olib tashlanadi (1-darsdagi qaror). «Direktor» — faqat 5-ekranda bir marta.

---

## 0 · Kirish — 5 qism ulanmagan  `[720]`
- Sarlavha: **5 qism tayyor — lekin ular bir-biriga ulanmagan. Nima yetishmayapti?**
- Mentor: Oldingi modullarda React, Node.js, PostgreSQL, Telegram bot va AI bilan ishladingiz. Endi ularni bitta tizimga ulaymiz. Ikki holatni bosing.
- Tugmalar: 🏝️ Alohida · 🔗 Ulangan
  - **5 alohida qism** — «React bor, Node bor, baza bor, bot bor, AI bor — lekin har biri alohida ishlaydi, bir-biriga ulanmagan.»
  - **Bitta tizim** — «Ular ulanganda: «Buyurtma» bosiladi → backend qabul qiladi → baza saqlaydi → bot adminga xabar yuboradi. Mijoz savol bersa — AI javob beradi.»
- Savol: **Nima yetishmayapti?**
  - Hech narsa — har biri alohida yaxshi ishlaydi
  - Ulanish — qismlar bir-biriga ma'lumot uzatishi
  - Ko'proq yangi komponent qo'shish kerak
- Javob — 2-variant: **Aynan!** Yetishmagani — **ulanish**. Bugun beshala qismni bitta ishlaydigan tizimga ulaymiz. Kodni AI yordamida yozamiz, lekin uni o'qib, tekshirib boramiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin qismlar alohida yaxshi ishlasa ham, bir-biriga ma'lumot uzatmasa — tizim bo'lmaydi. Yangi qism qo'shish ham yordam bermaydi. Yetishmagani — **ulanish**. Bugun shuni quramiz.

✎ Javob tanlovga qarab ikki xil (oldin hammasiga «To'g'ri» chiqardi) · «Ulangan» kartasida AI buyurtma zanjirining oxirgi bo'g'ini emas — alohida savol oqimi · to'g'ri variant tenglashtirildi

## 1 · Reja  `[762]`
- Sarlavha: **Tayyor qismlarni bitta tizimga ulaymiz**
- Mentor: Qismlarni noldan yozmaymiz. AI'ga aniq topshiriq berasiz, u kod yozadi, siz kodni o'qib, sinab ko'rasiz.
- Blok «Bugungi maqsad»: **5 qism → bitta tizim** · ulanishlarni AI yordamida yozamiz va har birini tekshiramiz.
- 5 qadam:
  1. 5 qism: React, Node.js, PostgreSQL, Telegram, AI
  2. Ma'lumot qanday o'tadi (pipeline)
  3. AI bilan kod yozish: aniq prompt → kod → test → tuzat
  4. Ulanishlarni qurish va sinash · *jonli*
  5. O'z loyihangizda ulanishlarni qurasiz · *amaliyot*

✎ «Siz direktor, AI ishchi — butun tizimni siz boshqarasiz» (takror) olib tashlandi · «O'z pipeline build rejangizni yozasiz» (grammatika + amaliyotda reja emas, qurish bor) → «ulanishlarni qurasiz»

## 2 · 5 qism  `[795]`
- Eyebrow: 5 qism
- Sarlavha: **Tizimning 5 qismi**
- Mentor: Hammasini avval o'rgangansiz — endi ular birga ishlaydi. Har birini bosing: nima qiladi.
- Kartalar (nom · rol — nima qiladi):
  - **React** · Frontend — Mijoz ko'radigan sahifa: mahsulotlar va «Buyurtma» tugmasi.
  - **Node.js** · Backend — So'rovlarni qabul qiladi va boshqaradi: `GET /products`, `POST /orders`.
  - **PostgreSQL** · Ma'lumotlar bazasi — Ma'lumotni saqlaydi: `products` va `orders` jadvallari.
  - **Telegram** · Bot — Yangi buyurtma kelganda adminga xabar yuboradi.
  - **AI (Claude)** · Yordamchi xizmat — Node.js uni kerak bo'lganda chaqiradi: mijoz savoliga javob yozadi, mahsulot tavsifini tayyorlaydi.
- Xulosa: Bu loyihada Node.js — asosiy boshqaruv qismi: frontend'dan kelgan so'rovlar u orqali o'tadi, baza, bot va AI bilan ham u ishlaydi.

✎ 🔴 FAKT: kartalardagi modul raqamlari («Modul 3», «Modul 4», «Modul 8», «Modul 8/9») olib tashlandi — Telegram va AI bot darslarida o'tilgan, «Modul 8» esa shu modulning LMS raqami; o'quvchi chalkashadi · «U — butun tizim markazi» (umumiy qoidadek) → «Bu loyihada … asosiy boshqaruv qismi» · AI «Ekspert» → «Node.js kerak bo'lganda chaqiradigan xizmat» · «Database» → «Ma'lumotlar bazasi»

## 3 · Ma'lumot qanday o'tadi (pipeline)  `[825]`
- Eyebrow: Pipeline
- Sarlavha: **Ma'lumot qismdan qismga qanday o'tadi**
- Mentor: Ma'lumotning bir qismdan keyingisiga o'tish yo'lini **pipeline** deyishadi. Tizimda bunday yo'l bittadan ko'p bo'lishi mumkin. Bosib, qadamlarni ochib boring.
- Buyurtma oqimi:
  1. Mijoz saytda «Buyurtma» bosadi (React)
  2. React Node.js'ga `POST /orders` so'rovini yuboradi
  3. Node.js buyurtmani PostgreSQL'ga saqlaydi
  4. Node.js Telegram orqali adminga xabar yuboradi
- Savol oqimi (alohida):
  5. Mijoz savol yozsa — Node.js uni AI'ga yuboradi, AI javobi mijozga qaytadi
- Sxema: React → Node.js, Node.js'dan uch tarmoq: PostgreSQL · Telegram · AI
- Tugmalar: ▶ Buyurtmani boshlash · Keyingi qadam →
- Xulosa: Hamma narsa bitta uzun zanjir emas: Node.js'dan bir nechta yo'l chiqadi. Qaysi yo'l ishlashi — qanday so'rov kelganiga bog'liq.

✎ 🔴 TEXNIK: oldin «bitta bosish — 5 qism ketma-ket ishlaydi» deyilardi (AI buyurtma zanjirining 5-bosqichi sifatida). Aslida AI buyurtma oqimida emas — u alohida savol oqimida ishlaydi. Oqim Node.js'dan tarmoqlanadi · pipeline shu yerda to'g'ri ta'rif bilan kiritildi

## 4 · 1-savol ✅  `[860]`
- Savol: **«Pipeline» nima degani?**
  - Bitta katta kod fayli — hammasi bir joyda
  - Faqat ko'rinadigan frontend qismi
  - Bir-biriga ulanmagan mustaqil dasturlar
  - ✔ Ma'lumotning qismdan qismga o'tish oqimi
- To'g'ri: To'g'ri! Pipeline — ma'lumot yoki ishning bir qismdan keyingisiga o'tish oqimi. Masalan, buyurtma React'dan Node.js'ga, undan PostgreSQL'ga o'tadi.
- Xato izohlari:
  - Bitta fayl emas — bir-biriga ma'lumot uzatadigan qismlar.
  - Faqat frontend emas — ma'lumot bir necha qism orqali o'tadi.
  - Aksincha — pipeline aynan qismlar bir-biriga ulanganda paydo bo'ladi.
  - (umumiy) Pipeline — ma'lumotning qismdan qismga o'tish oqimi.

✎ «"Pipeline" (tizim)» — pipeline va tizim bir narsa emas (1-darsdagi «tizim» bilan aralashardi)

## 5 · AI bilan kod yozish  `[870]`
- Eyebrow: AI bilan kod yozish
- Sarlavha: **AI kod yozadi — nima qurilishini va natijani siz tekshirasiz**
- Mentor: AI bilan kod yozishning ikki yo'li bor. Ikkalasini bosing.
- Tugmalar: 🙈 Ko'r-ko'rona · 🎬 Nazorat bilan
  - 🙈 — «Sayt qil» deb yozib, AI bergan kodni o'qimasdan ishlatasiz. Xato chiqsa — nima qilishni bilmaysiz. · Ogohlantirish: AI xatosini ko'rmaysiz — tizim nazoratingizdan chiqadi.
  - 🎬 — Aniq topshiriq berasiz, AI kodini o'qiysiz, sinaysiz, kerak bo'lsa tuzatasiz. · Yashil: Buni direktor ishiga o'xshatish mumkin: nima qilishni siz belgilaysiz, AI bajaradi, natijani siz tekshirasiz.
- Xulosa: AI bilan kod yozish: aniq topshiriq ber · kodni o'qi · sina · tuzat. Natija uchun siz javobgarsiz.
- Eslatma: Internetda bunday ishni ko'pincha **vibecoding** deyishadi. Bu so'z ba'zan «kodni o'qimay, AI'ga to'liq ishonish» ma'nosida ham ishlatiladi — biz esa aksincha, kodni o'qib, tekshirib ishlaymiz.

✎ «Siz direktor, AI ishchi» sarlavhadan olib tashlandi — «direktor» bir marta, o'xshatish sifatida · 🔴 halol eslatma: «vibe coding» atamasi dastlab aynan «kodni o'qimay ishonish» ma'nosida paydo bo'lgan — dars esa buning aksini o'rgatadi; bu farq endi ochiq aytiladi (atama kursning 19 ta darsida bor, shuning uchun almashtirilmadi) · «Eng kuchli juftlik» olib tashlandi

## 6 · 2-savol ✅  `[907]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AI bilan kod yozganda sizning vazifangiz nima?**
  - ✔ Aniq topshiriq berish, kodni o'qish va sinash
  - AI bergan kodni o'qimasdan darhol ishlatish
  - AI'siz, hamma kodni faqat qo'lda yozish
  - Hech narsa — hammasini AI o'zi hal qiladi
- To'g'ri: To'g'ri! Siz aniq topshiriq berasiz, AI kodini o'qib tushunasiz, sinaysiz va kerak bo'lsa tuzatasiz. AI tez yozadi, natijani esa siz tekshirasiz.
- Xato izohlari:
  - O'qimasdan ishlatish xavfli — kod nima qilishini tushunishingiz kerak.
  - Hammasini qo'lda yozish shart emas — AI yozadi, siz tekshirasiz.
  - AI hamma narsani o'zi hal qilmaydi — nima qurilishini siz belgilaysiz.
  - (umumiy) Aniq topshiriq, o'qish va sinash.

✎ Eyebrow «Tekshiruv · Mustahkamlash» → «Mashq · 2-savol» (podium raqamlari bilan bir xil) · to'g'ri javob eng uzuni, qolganlari «Hech narsa qilmaslik» kabi bema'ni edi → tenglashtirildi

## 7 · Ulanishlarni quramiz (markaziy o'yin)  `[917]`
- Eyebrow: Ulanishlar · jonli
- Sarlavha: **Ulanishlarni prompt bilan quring**
- Mentor: Har ulanish uchun AI'ga prompt yuborasiz — AI kod yozadi, ulanish yonadi. To'rttalasini ulang, keyin «Buyurtma yuborish»ni bosing.
- Tugunlar: React · Node.js · PostgreSQL · Telegram · AI
- Ulanishlar (prompt · AI kodi) — o'zgarmaydi, faqat: «Order'ni orders jadvaliga INSERT qil» → «Buyurtmani orders jadvaliga INSERT qil»
- Tugma (4 tasi ulangach): ▶ Buyurtma yuborish
- Natija: ⚡ **Tizim ishladi!** — Buyurtma bazaga saqlandi → admin Telegram'da xabar oldi. Mijoz savol yozsa — AI javob beradi.
- Tugma: Ulanishlarni quring (0/4) → Davom etish

✎ Natijada AI buyurtma zanjiriga qo'shib aytilmaydi — alohida oqim · «Order'ni» (ingliz so'zi o'zbek qo'shimchasi bilan) → «Buyurtmani»

## 8 · Prompt sifati  `[965]`
- Eyebrow: Prompt sifati
- Sarlavha: **Aniq prompt — aniqroq kod**
- Mentor: Prompt qanchalik noaniq bo'lsa, AI shunchalik ko'p taxmin qiladi. Aniq prompt kerakli kodni olishga yordam beradi. Ikkalasini bosing.
- 🌫️ «buyurtma qismini yoz» → **AI taxmin qiladi** — Qaysi manzil? Qaysi jadval? Javob qanday? AI o'zicha taxmin qiladi — natija ko'pincha chala yoki noto'g'ri.
- 🎯 «Express POST /orders: req.body'dan {mahsulot, soni} ol, orders jadvaliga INSERT qil, 201 qaytar» → **AI aniqroq yozadi** — Manzil, jadval va javob aniq aytilgan — AI kerakli kodni yozishi ancha osonlashadi. Baribir sinab ko'rasiz.
  - Izohlar: `req.body` — mijoz yuborgan ma'lumot · `201` — «yangi yozuv yaratildi» degan server javobi
- Xulosa: Yaxshi prompt: nima, qayerda, qanday natija — aniq ayting.

✎ 🔴 «Aniq prompt = aniq kod», «AI to'g'ri kodni birinchi urinishdayoq yozadi» (kafolat) → «aniqroq kod olishga yordam beradi, baribir sinaysiz» · `req.body` va `201` birinchi uchragan joyida izohlandi

## 9 · AI bilan kod yozish sikli (markaziy)  `[1000]`
- Eyebrow: Sikl · jonli
- Sarlavha: **Sikl: prompt → kod → test → tuzat**
- Mentor: Bitta ulanishni qanday quramiz? Sikl orqali. Bosib, har qadamni ko'ring — xato ham chiqadi!
- Qadamlar:
  1. **PROMPT** — «Express POST /orders yoz: req.body'dan mahsulot va soni ol, orders jadvaliga INSERT qil, 201 qaytar.» — Aniq topshiriq berasiz.
  2. **AI KOD** — `app.post("/orders", …)` — AI kod yozadi. Siz o'qiysiz va tushunasiz.
  3. **TEST** — Buyurtma yuborib ko'rasiz… ❌ Xato: narx (price) bo'sh (NULL) saqlanyapti! — Sinab ko'rmasangiz, xatoni bilmaysiz.
  4. **TUZATISH** — «INSERT so'roviga narx (price) ustunini ham qo'sh.» — Aniq tuzatish — butun kodni qayta yozdirmaysiz.
  5. **QAYTA TEST** — ✅ Ishladi! Narx ham saqlandi. Bitta ulanish tayyor — keyingisiga o'tamiz.
- Xulosa: **Prompt → AI kod → Test → Xato → Tuzat → Qayta test.** Har ulanish shunday quriladi.

✎ «bug» → «xato» (dars bo'yi; inglizcha «bug» kartochkada bir marta) · sikl formulasi ajratib ko'rsatildi (auditda ham eng kuchli joy)

## 10 · 3-savol ✅  `[1038]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Qaysi prompt yaxshiroq natija beradi?**
  - «Menga yaxshi ishlaydigan buyurtma sahifasi qilib ber»
  - «Buyurtma bilan bog'liq kerakli kodlarni o'zing yoz»
  - ✔ «POST /orders yoz: body'dan mahsulot va soni ol, bazaga saqla»
  - «Buyurtmalarni o'zing bilganingcha qilib hal qilaver»
- To'g'ri: To'g'ri! Bu promptda nima (POST /orders), kirish (body) va amal (bazaga saqlash) aniq aytilgan. AI kerakli kodni yozishi ancha osonlashadi.
- Xato izohlari:
  - Juda umumiy — AI nimani, qanday qilishni bilmaydi.
  - Noaniq — qaysi kod, nima uchun?
  - «O'zing bilganingcha» — nazoratni yo'qotasiz.
  - (umumiy) Aniq, tafsilotli prompt.

✎ Eyebrow «2-savol» → «3-savol» (raqamlash xatosi) · 🔴 test «sotilib» qolgan edi: yagona texnik ko'rinishli variant — to'g'ri javob. Endi hammasi «buyurtma» haqida, bir xil uzunlikda; farq faqat aniqlikda

## 11 · AI kodini o'qish  `[1048]` — deyarli o'zgarmaydi
- Sarlavha: **AI kodiga ko'r-ko'rona ishonmang**
- Mentor: AI tez yozadi, lekin xato ham qiladi. Kodni o'qib, tekshirasiz. Ikkalasini bosing.
- 🙈 Ko'rmasdan ishlat — AI maxfiy kalitni (token) kodga ochiq yozib qo'yibdi — siz bilmaysiz, bu xavfsizlik teshigi. · 👁️ O'qib tushun — (o'zgarmaydi)
- Xulosa: Qoida: AI yozadi, lekin oxirgi qaror — sizniki. Kodni doim o'qing.

✎ «Direktor kodni o'qiydi» → «Kodni o'qib, tekshirasiz» · «token'ni … yozib qo'yibti» → imlo

## 12 · Ulanish xatosi (case)  `[1085]`
- Eyebrow: Ulanish xatosi
- Sarlavha: **Ko'p uchraydigan xato: frontend backend'ga yetib bormayapti**
- Mentor: Qismlarni ulaganda eng ko'p uchraydigan xatolardan biri — ulanish manzili. Belgini o'qing, sababini toping.
- 🐞 BELGI: Mijoz «Buyurtma» bosadi — lekin hech narsa bo'lmaydi. Konsolda: `Failed to fetch`. Backend ishlayapti, baza ham.
- Sababni tanlang:
  - Mahsulot rasmining rangi noto'g'ri
  - ✔ Frontend'dagi backend manzili (URL) noto'g'ri
  - Sahifadagi logotip juda kichik
- Maslahat: «Failed to fetch» — frontend backend'ga yetib bora olmadi. Backend ishlayotgan bo'lsa, u qaysi manzilga so'rov yuboryapti?
- Topilgach: **Topdingiz! 🔧** — Frontend so'rovni noto'g'ri manzilga (masalan, boshqa portga) yuboryapti. Tuzatish: to'g'ri manzilni qo'ying. Bu xatoning boshqa sabablari ham bo'ladi — server ishlamay qolgan bo'lishi yoki backend CORS orqali ruxsat bermagan bo'lishi mumkin (buni 4-Modulda ko'rgansiz). Boshidan oxirigacha (end-to-end) test shunday xatolarni tutadi.
- *End-to-end — tizimni boshidan oxirigacha, bitta haqiqiy amal bilan tekshirish.*

✎ 🔴 TEXNIK: «.env'da API_URL yo'q yoki noto'g'ri» yagona sabab sifatida berilgan edi. «Failed to fetch» bir nechta sababdan chiqadi (manzil, server ishlamaydi, CORS) — endi manzil «ko'p uchraydigan sabablardan biri», boshqalari ham aytiladi · 🔴 frontend `.env`/`API_URL` kursda o'tilmagan (4-Modulda `.env` faqat backend maxfiy kalitlari uchun); ustiga Vite loyihasida frontend o'zgaruvchisi `VITE_` bilan boshlanishi shart — oddiy `API_URL` brauzerga umuman chiqmaydi. Shuning uchun asosiy matn «backend manzili (URL)» deydi · «Klassik bug», «Simptom» → «Ko'p uchraydigan xato», «Belgi» · end-to-end birinchi uchragan joyida izohlandi (oldin 13-ekranda edi)

## 13 · 4-savol ✅  `[1127]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Ulanish xatolarini qanday topamiz?**
  - Kodni sinamasdan, ishlaydi deb ishonamiz
  - ✔ Har ulanishni, keyin butun oqimni sinaymiz
  - Faqat sahifaning tashqi ko'rinishiga qaraymiz
  - AI hech qachon xato qilmaydi deb hisoblaymiz
- To'g'ri: To'g'ri! Avval har ulanishni alohida, keyin butun oqimni boshidan oxirigacha (end-to-end) sinaymiz. Shunda ulanish xatolari (manzil, ruxsat, ma'lumot shakli) ko'rinadi.
- Xato izohlari:
  - Sinamasangiz, xatoni mijoz topadi.
  - Tashqi ko'rinish emas — ulanish ishlayaptimi, shuni sinash kerak.
  - AI ham xato qiladi — shuning uchun sinaymiz.
  - (umumiy) Har ulanishni va butun oqimni sinang.

✎ Eyebrow «3-savol» → «4-savol» · «bug'larini tutamiz» → «xatolarini topamiz»

## 14 · Namuna — to'liq hikoya (case)  `[1137]`
- Sarlavha: **To'liq hikoya: 5 qism → bitta tizim**
- Mentor: Bir o'quvchi tizimni qanday ulagani — 4 qadam. Har qatorni bosing.
- Qatorlar:
  - **BO'LDI** — Tizimni 4 ta ulanishga bo'ldi: React→Node, Node→baza, Node→bot, Node→AI · Katta vazifani kichik, aniq qadamlarga bo'ldi.
  - **PROMPT** — Har ulanish uchun aniq prompt yozdi · Aniq topshiriq berdi — AI'ga taxmin qilishga joy qoldirmadi.
  - **TEST** — Har qadamda sinab, xato topib tuzatdi · AI kodiga ko'r-ko'rona ishonmadi.
  - **ISHLADI** — Bitta buyurtma bazaga yozildi, admin xabar oldi · 5 qism bitta tizim bo'lib ishladi.
- Xulosa: Bo'l → prompt → sina → ula. Endi navbat sizga.

✎ «React→Node→DB→bot/AI» (yana chiziqli zanjir) → Node'dan tarmoqlanadigan 4 ulanish · «Aniq buyruq = aniq kod» (kafolat) → yumshatildi · «Direktor siz, ishchi AI» olib tashlandi

## 15 · Qoida  `[1168]`
- Sarlavha: **Tizimni ulash qoidasi: bo'l · buyur · sina · ula**
- Mentor: Yodda tuting: tizimni ulanishlarga bo'ling, aniq prompt bering, kodni o'qib sinang, qadamma-qadam ulang.
- 3 narsani unutmang: 1. ANIQ PROMPT — nima, qayerda, qanday natija · 2. KODNI O'QING — ko'r-ko'rona ishonmang · 3. SINANG VA TUZATING — har ulanishni sinab ulang

✎ «🎬 Siz — direktor» bloki olib tashlandi (5-ekranda bir marta aytilgan)

## 16 · Buyurtma yo'lini yig'ing ✅ (final)  `[1191]`
- Eyebrow: Yakuniy ish
- Sarlavha: **Bitta buyurtma — tizim bo'ylab**
- Mentor: Mijoz «Buyurtma» bosdi. Bosqichlarni to'g'ri tartibda joylang — buyurtma qayerdan qayerga o'tadi?
- Bo'laklar:
  - React — mijoz «Buyurtma» bosadi
  - React — `POST /orders` so'rovini yuboradi
  - Node.js — so'rovni qabul qiladi
  - PostgreSQL — buyurtmani saqlaydi
  - Telegram — adminga xabar boradi
- Joylar: har katakda raqam (1…5) + «bu yerga qo'ying»
✎ QAROR F-0929-27 (29.09, foydalanuvchi Q1-B): katak izohi «bu yerga qo'ying» — katakda raqam allaqachon bor, «1 · 1-qadam» takrorlanardi; joylashuv ikki ustun (kataklar chapda, bo'laklar o'ngda)
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Buyurtma yo'li tayyor: **Bosish → So'rov → Node.js → PostgreSQL → Telegram**. AI esa alohida yo'lda — mijoz savol berganda ishlaydi.

✎ 🔴 Ikki xato bir joyda edi: (1) 0–15-ekranlarda texnik nomlar, 16-ekranda birdan tanishtirilmagan shahar tili (Peshtoq/Hokimlik/Arxiv/Darvoza/Ekspert-byuro, «ariza») · (2) TEXNIK: to'g'ri javob «… → Darvoza → Ekspert-byuro» — AI buyurtma zanjirining 5-bosqichi deb o'rgatardi. Endi final — haqiqiy buyurtma oqimi, AI alohida yo'l ekani yakunda aytiladi · ⚠️ KOD: DragDrop bo'laklari almashadi (Quruvchi) · ikki xil xato-yozuv → bitta

## 17 · Amaliyot · VS Code  `[1917]`
- Sarlavha: **Tizimingizni AI bilan ulang**
- Mentor: Bu topshiriqni o'z kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: O'z mini-tizimingizni qadamma-qadam ulang: har ulanish uchun aniq prompt yozing, AI kodini o'qing, sinab ko'ring. Bugun asosiy ikki ulanishni quramiz; Telegram va AI ulanishi — qo'shimcha qadam.
- Bosqichlar:
  1. Loyihani oching: `frontend` (React) va `backend` (Node.js) papkalari
  2. 1-ulanish: React → Node.js — «`POST /orders` yuboradigan tugma yoz» deb prompt bering
  3. AI kodini o'qing: `fetch` to'g'ri backend manziliga ketyaptimi?
  4. 2-ulanish: Node.js → PostgreSQL — «buyurtmani `orders` jadvaliga `INSERT` qil» prompti
  5. Boshidan oxirigacha sinang: bitta «Buyurtma» bosing — buyurtma bazada paydo bo'ldimi?
  - ⭐ Qo'shimcha: Node.js → Telegram (adminga xabar) yoki Node.js → AI (savolga javob) ulanishini ham quring.
- Tugmalar — o'zgarmaydi

✎ 🔴 Darsda 5 qism o'rgatilib, amaliyotda faqat 2 ulanish qurilardi — o'quvchi «Telegram va AI qani?» deb qolardi. Endi bu ochiq aytilgan va qo'shimcha qadam qo'shilgan · `fetch(API_URL + …)` → «to'g'ri backend manziliga» (API_URL kursda o'tilmagan)

## 18 · Natijalar (podium)  `[1740]` — o'zgarmaydi · savol yorliqlari: 1 — Pipeline · 2 — AI bilan kod · 3 — Prompt · 4 — Ulanish xatosi · 5 — Tartib

## 19 · Takrorlash (kartochkalar)  `[2004]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Pipeline nima degani? | Ma'lumotning qismdan qismga o'tish oqimi | Masalan: React → Node.js → PostgreSQL |
| Tizim bilan pipeline bir narsami? | Yo'q | Tizim — hamma qismlar; pipeline — ular orasidagi oqim |
| Mijoz ko'radigan sahifani nima chizadi? | React | Frontend: mahsulotlar va «Buyurtma» tugmasi |
| Bu loyihada so'rovlarni qabul qiladigan qism qaysi? | Node.js | Backend: baza, bot va AI bilan ham u ishlaydi |
| Buyurtmalar qayerda saqlanadi? | PostgreSQL | Ma'lumotlar bazasi: products va orders jadvallari |
| Yangi buyurtmada adminga kim xabar yuboradi? | Telegram bot | Xabarni unga Node.js yuboradi |
| AI tizimda qachon ishlaydi? | Node.js uni chaqirganda | Masalan, mijoz savol yozganda |
| AI bilan kod yozish sikli qanday? | Prompt → kod → test → tuzat → qayta test | Har ulanish shunday quriladi |
| AI yozgan kodni nima qilish kerak? | O'qib tushunish | Ko'r-ko'rona ishonsangiz, AI xatosi sizniki bo'ladi |
| Aniq prompt nimalarni aytadi? | Nima, qayerda, qanday natija | «Sayt qil» emas, «POST /orders yoz» |
| Konsolda «Failed to fetch» chiqsa, avval nimani tekshirasiz? | Frontend so'rov yuborayotgan backend manzilini | Server ishlayaptimi va CORS ruxsat beryaptimi — ham tekshiriladi |
| Kodni yozgandagi xato inglizcha qanday ataladi? | Bug | Topib tuzatish — debugging |

✎ Qo'shildi: «tizim ≠ pipeline», «AI qachon ishlaydi» · «Backend manzili .env'da, ichida API_URL» (kursda o'tilmagan, Vite'da noto'g'ri nom) → olib tashlandi · «Vibecoding — siz direktor, AI ishchi» → sikl kartasi · «bug» shu yerda bir marta izohlandi

## 20 · Yakun  `[2030]`
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Endi tayyor qismlarni bitta tizimga ulay olasiz.**
- Endi siz bilasiz:
  - Qismlar bir-biriga ma'lumot uzatsa, ular bitta tizim bo'lib ishlaydi
  - Pipeline — ma'lumotning qismdan qismga o'tish oqimi; u Node.js'dan tarmoqlanadi
  - AI bilan kod yozish sikli: prompt → kod → test → tuzat → qayta test
  - Aniq prompt aniqroq kod olishga yordam beradi; AI kodini doim o'qing
  - Ulanish xatolari boshidan oxirigacha (end-to-end) test bilan topiladi
- Uyga vazifa — o'zgarmaydi (Bo'ling · Ulang · Sinang)
- 📱 Keyingi dars — React Native: tizimingizga mobil ilova qo'shamiz!

✎ Sarlavha «Endi siz butun tizim quryasiz» (grammatika) → tuzatildi · «Bitta ariza butun shahar bo'ylab sayohat qiladi» → olib tashlandi · «ko'chma darvoza» → «mobil ilova»

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, mazmunga moslanadi:
- 🔗 **Full Pipeline** — pipeline nima ekanini bildingiz (4)
- 🎯 **Clear Prompt** — aniq promptni tanidingiz (10)
- 🧪 **Bug Catcher** — ulanish xatosini test bilan topishni bildingiz (13)
- 🚚 **Order Flow** — buyurtma yo'lini to'g'ri tizdingiz (16)

✎ «End to End — aniq promptni tanidingiz», «All Connected — xatoni tutishni bildingiz» — nomlar mazmunga mos emas edi · «City Live — shahar tirik!» (shahar) → «Order Flow»

**Qisqa takrorlash oynalari (4):**
1. (4) **Pipeline — ma'lumot oqimi:** Qismlar ulanadi — React, Node.js, baza, bot, AI. · Ma'lumot qismdan qismga o'tadi — masalan, buyurtma React'dan Node.js'ga, undan bazaga. · Node.js'dan bir nechta yo'l chiqadi — baza, bot, AI. · Sinfga savol: Tizim bilan pipeline'ning farqi nima?
2. (6) **AI bilan kod — natijani siz tekshirasiz:** Aniq topshiriq berasiz. · AI yozgan kodni o'qib tushunasiz. · Sinab, xato topsangiz — aniq tuzatish prompti berasiz. · Sinfga savol: Nega kodni o'qib tushunish kerak?
3. (10) **Aniq prompt:** Nima qilish, qayerda, qanday natija — aniq aytiladi. · Noaniq prompt bilan AI taxmin qiladi. · Aniq prompt yordam beradi, lekin baribir sinaysiz. · Sinfga savol: Qaysi prompt aniqroq: «sayt qil» yoki «POST /orders yoz»?
4. (13) **Ulanish xatosi:** Ko'p uchraydigan sabab — frontend noto'g'ri manzilga so'rov yuboradi. · Boshqa sabablar: server ishlamayapti, CORS ruxsat bermayapti. · Har ulanishni va butun oqimni sinab, xatoni topamiz. · Sinfga savol: Ulanish xatosini qanday topamiz?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Pipeline nima degani? ✔ Ma'lumotning qismdan qismga o'tish oqimi · Bitta katta kod fayli — hammasi ichida · Faqat ko'rinadigan frontend qismi · Bir-biriga ulanmagan mustaqil dasturlar
2. AI bilan kod yozganda sizning vazifangiz? Hamma kodni qo'lda yozish · ✔ Aniq topshiriq berish, o'qish va sinash · Hech narsa qilmaslik · AI bergan kodni ko'rmasdan ishlatish
3. Frontend so'rovni qayerga yuboradi? Brauzer tarixiga · Foydalanuvchining telefoniga · ✔ Backend manziliga (URL) · To'g'ridan-to'g'ri Telegram'ga
4. «Failed to fetch» xatosining ko'p uchraydigan sababi? Logotip juda kichik bo'lgani · Mahsulot rasmining rangi · Sahifa sarlavhasi noto'g'riligi · ✔ Backend manzili noto'g'riligi
5. Aniq prompt qanday bo'ladi? ✔ Nima, qayerda, qanday natija — aniq aytilgan · «saytni yaxshi qilib yozib ber» degan · «hammasini o'zing bilganingcha qil» · Umuman aniq topshiriq bermaslik
6. AI yozgan kodni nima uchun o'qiysiz? Rangini o'zgartirish uchun · ✔ Xato va xavfni ko'rib, tuzatish uchun · Faylni kattalashtirish uchun · Kodni chiroyliroq ko'rsatish uchun
7. Ulanish xatosini qanday topamiz? Faqat rangga qaraymiz · Umuman sinamaymiz · ✔ Boshidan oxirigacha (end-to-end) sinaymiz · AI xato qilmaydi deb ishonamiz
8. Buyurtma yuborilganda qaysi qism birinchi ishlaydi? PostgreSQL (baza) · Telegram (bot) · AI (yordamchi xizmat) · ✔ React (frontend)
9. Bu loyihada Node.js qanday vazifani bajaradi? ✔ So'rovlarni qabul qilib, boshqaradi · Faqat rasm va chizmalar chizadi · Ma'lumotni ko'rmay o'tkazib yuboradi · Foydalanuvchi parolini ko'rsatadi
10. Buyurtma ma'lumoti qayerda saqlanadi? Telegram bot xabarida · ✔ PostgreSQL jadvalida (orders) · Brauzer tarixida · Hech qayerda saqlanmaydi
11. AI bilan kod yozish sikli qanday? Bitta prompt yozib to'xtash · Kodni ko'rmasdan ishlatish · ✔ Prompt → kod → test → tuzat → qayta · Hammasini bitta promptda yozdirish
12. «End-to-end test» nimani tekshiradi? Faqat bitta tugmaning rangini · Faqat kirish (login) sahifasini · Faqat bazaning nomini · ✔ Butun oqimni — buyurtma oxirigacha yetadimi

✎ 3-savol («.env faylidan (API_URL)» — kursda o'tilmagan va Vite'da noto'g'ri) → «backend manziliga» · 4-savol: «ko'pincha» → «ko'p uchraydigan sabab» · 8-savol shahar nomlari → texnik nomlar · 9-savol «Markaz» → «so'rovlarni qabul qilib, boshqaradi» · 6-savol «AI'ni maqtash uchun» (bema'ni) → ishonarli variant
