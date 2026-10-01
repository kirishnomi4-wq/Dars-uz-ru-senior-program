# 5-Modul (LMS: 7-Modul) · 6-dars «Bot ichida AI» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotAiBrainLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** mijoz «Pitsa haqida ayting» deb yozadi. O'quvchi «▶ Topshiriqni yuborish» tugmasini bosadi — yo'riqnomasiz 🧭 Maslahatchi pitsaning tarixini gapirib beradi, mijoz esa «Menga do'koningizdagi pitsalar kerak edi 😕» deydi. O'quvchi «Nega Maslahatchi shunday javob berdi?» savoliga 3 variantdan birini tanlaydi.
- **Markaziy o'yin/mexanika:** to'rtta markaziy ekran — (#1) yo'riqnomani «Kim? · Qanday gapirsin? · Chegara?» javoblaridan yig'ish; (#2) «stol usti» sinovi — 5 xabar yuboriladi, stolga 4 tasi sig'adi, eng eskisi tushib ketadi, keyin qaysi ma'lumot daftarga yozilishi kerakligini tanlash; (#3) erkinlik murvati — past/baland holatda bir xil savolga 3 tadan javob; (#4) Fact Checker — Maslahatchining 3 da'vosini haqiqiy menyu bilan solishtirish.
- **Asosiy metafora:** 🧭 Maslahatchi (AI) — juda ko'p o'qigan, lekin sizni eslamaydi; 📜 yo'riqnoma (system prompt); stol usti (kontekst oynasi); 📓 daftar; erkinlik murvati (temperature); o'ylab topish (hallutsinatsiya). Misol-do'kon — «Pitsa Bek».
- **Yakun:** xavfsiz ishlash siklini (5 bo'lak) sudrab tartiblash → AI chatda o'z yo'riqnomasini yozish (amaliyot) → podium → 12 kartochka → «Endi Maslahatchi siz uchun boshqariladigan vosita».

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — «Pitsa haqida ayting» | hook | topshiriqni yuboradi, nega Maslahatchi hammasini gapirganini tanlaydi | — |
| 1 | Reja | qoida | natija-namunani ko'radi + bugungi 4 qadam | — |
| 2 | Maslahatchi kim? | tushuncha | 3 faktni bosib o'qiydi | — |
| 3 | Yomon va yaxshi topshiriq | tushuncha | ikki topshiriqni yuborib, javoblarni solishtiradi | — |
| 4 | 1-savol | test | nega Maslahatchi keraksiz narsani gapirdi | ✅ |
| 5 | Yo'riqnomani o'zingiz yozing | markaziy #1 | kim / qanday / chegara — 3 savolga javob tanlab yo'riqnoma yig'adi | — · 🏅 |
| 6 | Ikki xabar — eslaydimi? | case | ikkinchi xabarni yuboradi, Maslahatchi ismni unutganini ko'radi | — |
| 7 | Stol usti sinovi | markaziy #2 | 5 xabarni birma-bir yuboradi, eng eskisi tushadi; daftarga nima yozishni tanlaydi | — · 🏅 |
| 8 | 2-savol | test | stol usti to'lsa nima bo'ladi | ✅ |
| 9 | Erkinlik murvati | markaziy #3 | past/baland javoblarni solishtiradi, menyu uchun murvat tanlaydi | — · 🏅 |
| 10 | 3-savol | test | murvat baland bo'lsa nima bo'ladi | ✅ |
| 11 | Fact Checker | markaziy #4 | 3 da'voni menyu bilan solishtirib Rost / O'ylab topilgan deb belgilaydi | — · 🏅 |
| 12 | Pitsa Bek suhbati | hayotiy | yo'riqnomali Maslahatchi bilan suhbatni qadam-baqadam ochadi | — |
| 13 | 2 ta amaliy nuqta | tushuncha | API kalit (.env) va xarajat haqida o'qiydi | — |
| 14 | 4-savol | test | «ananasli pitsa bor» desa nima qilish kerak | ✅ |
| 15 | Xavfsiz ishlash sikli | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Maslahatchi | praktika | AI chatda o'z yo'riqnomasini yozib sinaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon (bot) · 🧭 Maslahatchi (AI, LLM) · topshiriq (prompt) · 📜 yo'riqnoma (system prompt) · kim / qanday / chegara ·
stol usti (kontekst oynasi) · varaq (xabar) · «eng eski varaq tushib ketadi» · 📓 daftar · erkinlik murvati (temperature) ·
past (0.1) / baland (1.5) murvat · o'ylab topish / o'ylab topilgan (hallutsinatsiya) · tekshirish (menyu bilan solishtirish) ·
xavfsiz ishlash sikli · API kalit (.env) · Pitsa Bek · jihoz: Yo'l-yo'riq

---

## 0 · Kirish — «Pitsa haqida ayting»  `[732]`
- Eyebrow: Loyiha · kirish
- Sarlavha: **Mijoz «Pitsa haqida ayting» deb yozdi. 🧭 Maslahatchi esa hammasini gapirib berdi.**
- Mentor: Botimizga endi 🧭 **Maslahatchi** (AI) ulanmoqda. Lekin unga hali hech narsa aytmadik — nima bo'lishini ko'ring. Tugmani bosing.
- Chat «🧭 Maslahatchi» · holati: yo'riqnomasiz
  - mijoz: «Pitsa haqida ayting»
  - (bosilgach) Maslahatchi: «Pitsa — Italiyada, Neapol shahrida paydo bo'lgan taom 🍕 Uning tarixi asrlar davomida rivojlangan: Margarita, Marinara, Kalzone kabi turlari bor. Yevropa va Amerikada juda mashhur, har mamlakatda o'ziga xos retsepti bor...»
- Tugma: ▶ Topshiriqni yuborish → ✓ Topshiriq yuborildi
- Chat «Mijoz» · holati: do'kon chatida → (bosilgach) «Menga do'koningizdagi pitsalar kerak edi 😕»
- Savol: **Nega Maslahatchi shunday javob berdi?** (tugma bosilmaguncha variantlar xira)
  - Maslahatchiga vazifasi aytilmagan — u nima haqida gapirish kerakligini bilmaydi
  - Maslahatchi mijozni tanimay qoldi
  - Internet sekin ishlagan edi
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! 🧭 Maslahatchi juda ko'p biladi, lekin unga **vazifasi** aytilmasa — u nima haqida, qanday gapirishni bilmaydi. Bugun unga **📜 yo'riqnoma** yozishni o'rganamiz.
- Tugma: Davom etish

## 1 · Reja  `[776]`
- Eyebrow: Reja
- Sarlavha: **Botjoningizga `o'ylaydigan maslahatchi` ulaymiz.**
- Mentor: Hozirgacha Botjon faqat 📋 qoidalar varag'idan qator qidirdi. Bugun unga 🧭 **Maslahatchi** (AI) ulanadi — u o'ylab javob yozadi. Yangi jihoz yondi: 🧭 **Yo'l-yo'riq**.
- Chap blok — yorliq: dars oxirida — aniq va ishonchli javob
  - Chat «🧭 Maslahatchi» · holati: yo'riqnoma bilan
  - mijoz: «Bolalarim uchun nimani tavsiya qilasiz?»
  - Maslahatchi: «Bizning menyuda Margarita zo'r tanlov — achchiq emas, hammaga yoqadi 🧀 Kichik o'lcham ham bor. Buyurtma beraylikmi?»
  - Izoh: Tayyor javob emas — Maslahatchi 📜 yo'riqnomaga qarab, aniq va mavzuga mos javob yozadi. Mana shuni bugun quramiz.
- Jihozlar paneli — 6 tasi yonadi: Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · Yo'l-yo'riq (yonmaydi: Vositalar · AI yordamchi)
- Bugungi 4 qadam:
  1. 🧭 Maslahatchini tanishtiramiz · *kim u*
  2. 📜 Yo'riqnoma yozamiz · *xulq*
  3. Stol usti va murvatni sinaymiz · *xotira · erkinlik*
  4. Javobni tekshirishni o'rganamiz · *ishonch*
- Tugmalar: (mobil) 4 qadamni ko'rish / ↩ Natijani ko'rish · Orqaga · Boshlaymiz →

## 2 · Maslahatchi kim?  `[816]`
- Eyebrow: Tanishuv · Maslahatchi
- Sarlavha: **Maslahatchi — u kim o'zi?**
- Mentor: Maslahatchi — botning yangi buyumi. U hech qachon uxlamaydi, lekin bitta g'alati xususiyati bor. Har faktni bosing.
- Faktlar (bosilganda ochiladi):
  - **Juda ko'p o'qigan** — 🧭 Maslahatchi juda ko'p matn o'qib "o'rgangan" — deyarli har qanday mavzuda gapira oladi.
  - **Charchamaydi** — U tunu-kun, minglab savolga bir vaqtning o'zida javob bera oladi — hech qachon charchamaydi.
  - **Sizni ESLAMAYDI** — Eng muhimi: har safar u siz bilan **birinchi marta** gaplashayotgandek. Avvalgi suhbatni o'zi eslamaydi — hammasini qayta aytish kerak.
- Yakun (3 tasi ko'rilgach): Eng muhimi — **u sizni eslamaydi**. Shuning uchun uni to'g'ri yo'naltirish (📜 yo'riqnoma) juda muhim. Buni keyingi ekranlarda sinaymiz.
- Tugma: 3 faktni ko'ring (0/3) → Davom etish

## 3 · Yomon va yaxshi topshiriq  `[848]`
- Eyebrow: Sinov · topshiriq
- Sarlavha: **Yomon topshiriq va yaxshi topshiriq.**
- Mentor: Topshiriq (prompt) qanchalik aniq bo'lsa, javob ham shunchalik foydali bo'ladi. Ikkala tugmani bosib solishtiring.
- Chap — yorliq «yomon topshiriq»:
  - Karta [topshiriq]: «Yordam bering»
  - Tugma: ▶ Yomon topshiriqni yuborish → ✓ Yuborildi
  - Maslahatchi: «Albatta, nimada yordam kerak? Bu juda keng savol — aniqroq ayta olasizmi: qaysi mavzu, qaysi vazifa?»
- O'ng — yorliq «yaxshi topshiriq»:
  - Karta [topshiriq]: «Pitsa Bek do'koni uchun 3 ta qisqa salomlashuv jumlasi yozing»
  - Tugma: ▶ Yaxshi topshiriqni yuborish → ✓ Yuborildi
  - Maslahatchi: «1) Xush kelibsiz, Pitsa Bek sizga eng mazali pitsani taklif qiladi! 🍕 2) Assalomu alaykum! Qaysi pitsani xohlaysiz? 3) Salom! Bugun sizga qanday yordam beray?»
- Xulosa: Aniq topshiriq — aniq javob. Xuddi shu mantiq 📜 yo'riqnoma uchun ham amal qiladi: keyingi ekranda uni yozamiz.
- Tugma: Ikkalasini yuboring (0/2) → Davom etish

## 4 · 1-savol ✅  `[880]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega Maslahatchi mijozga kerak bo'lmagan narsalar haqida gapirdi?**
  - Chunki internet sekin ishlagan edi shu payt
  - Chunki mijoz savolni harflar bilan noto'g'ri yozgan
  - ✔ Chunki unga aniq vazifa (yo'riqnoma) aytilmagan edi
  - Chunki Maslahatchi charchab, dam olishga chiqib ketgan
- To'g'ri: To'g'ri! Maslahatchi juda ko'p biladi, lekin unga vazifasi (📜 yo'riqnoma) aytilmasa — u nima haqida, qanday gapirishni bilmaydi. Shuning uchun keng va tartibsiz javob beradi.
- Xato izohlari:
  - (internet) Internet tezligiga aloqasi yo'q — muammo javobning mazmunida.
  - (harflar) Savol tushunarli yozilgan edi. Muammo — Maslahatchiga vazifa aytilmaganida.
  - (charchab) Maslahatchi charchamaydi. Muammo — unga vazifasi aytilmaganida.
  - (umumiy) Sabab — Maslahatchiga vazifasi (yo'riqnoma) aytilmagan edi.

## 5 · Yo'riqnomani o'zingiz yozing (markaziy #1)  `[900]`
- Eyebrow: Markaziy · #1
- Sarlavha: **Yo'riqnomani o'zingiz yozing.**
- Mentor: Har savolga bittadan javob tanlang — birga qo'shilib, Maslahatchiga beriladigan 📜 yo'riqnoma bo'ladi. Noto'g'ri variant ham tanlanishi mumkin — ehtiyot bo'ling.
- Savollar va variantlar (tanlanganda ✓ yoki ✗ chiqadi):
  - **Kim?** — ✔ Pitsa Bek do'konining yordamchisi · Umuman hamma narsani biladigan ensiklopediya · Faqat o'zi haqida gapiradigan yordamchi
  - **Qanday gapirsin?** — ✔ Qisqa, samimiy, aniq · Imkon qadar uzun va batafsil, hech narsani qisqartirmasin · Faqat 'ha' yoki 'yo'q' deb javob bersin
  - **Chegara?** — ✔ Faqat do'kon menyusi haqida gaplashsin · Istalgan mavzuda erkin gaplashaversin · Hech qanday savolga javob bermasin
- Yorliq: yig'ilayotgan yo'riqnoma · karta «📜 YO'RIQNOMA»: «Sen …san. … gapir. ….» (tanlangan javoblar o'rniga qo'yiladi)
  - to'g'ri yig'ilganda ko'rinishi: «Sen Pitsa Bek do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat do'kon menyusi haqida gaplashsin.»
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Ba'zi javoblar hali noto'g'ri — ✗ belgisini toping va to'g'risini tanlang.
- To'g'ri: Zo'r! Endi Maslahatchiga aniq vazifa berildi: **kim, qanday, qaysi chegarada**. Shu 3 savol — har qanday yo'riqnomaning skeleti.
- Tugma: Yo'riqnomani yig'ing → Davom etish

## 6 · Ikki xabar — eslaydimi? (case)  `[958]`
- Eyebrow: Sinov · xotira
- Sarlavha: **Ikki xabar — Maslahatchi eslaydimi?**
- Mentor: Bir suhbatda ikki marta yozamiz. Ikkinchisida Maslahatchi birinchisini eslab qoladimi? Tugmani bosing.
- 1-chat «🧭 Maslahatchi»: mijoz «Salom, mening ismim Aziz.» → «Salom, Aziz! Sizga qanday yordam bera olaman?»
- Tugma: ▶ Ikkinchi xabarni yuborish → ✓ Yuborildi
- 2-chat «🧭 Maslahatchi»: mijoz «Ismim nima edi?» → (o'ylamoqda …) → «Kechirasiz, ismingizni bilmayman 😅 Menga har safar hammasini qaytadan aytishingiz kerak.»
- Tugma: Javobni ko'rish
- Xulosa: Ko'rdingizmi? Ismini unutdi. Sabab shu — Maslahatchi sizni eslamaydi. Lekin muammo battarroq: suhbat uzayganda ham ma'lumot yo'qolib ketishi mumkin. Buni keyingi ekranda ko'ramiz.
- Tugma: Ikkinchi xabarni yuborish → Davom etish

## 7 · Stol usti sinovi (markaziy #2)  `[1029]`
- Eyebrow: Markaziy · #2
- Sarlavha: **Stol usti sinovi — joyi cheklangan.**
- Mentor: Suhbat uzun bo'lsa, xabarlar «stol ustiga» to'planadi. Stol to'lsa — eng eski varaq tushib ketadi. Xabarlarni birma-bir yuboring va kuzating.
- Stol (`[995]`): yorliq «stol usti — sig'imi 4 varaq» · bo'sh holatda: «bo'sh»
  - Xabarlar navbati: Salom! · Ismim: Aziz · Bugun ob-havo yaxshi ekan · Menga Margarita kerak · Manzil: Chilonzor
  - 4 ta to'lganda: ⚠️ Stol to'ldi — keyingi xabar kelsa, eng eskisi tushib ketadi
  - 5-xabardan keyin: «Salom! — tushib ketdi 🍂»
- Tugma: ▶ Xabar yuborish (0/5) → ✓ Barchasi yuborildi
- Savol (yorliq): **qaysi ma'lumot 📓 daftarga yozilishi kerak edi?** (hammasi yuborilgach chiqadi)
  - Bugun ob-havo yaxshi ekan
  - ✔ Ismim: Aziz
  - Manzil: Chilonzor
- To'g'ri: ✓ To'g'ri! «Ismim: Aziz» — muhim ma'lumot, u tushib ketishga eng yaqin edi. Uni 📓 daftarga yozib qo'yish kerak.
- Xato: Bu unchalik muhim emas. Eng muhimi — «Ismim: Aziz» edi, chunki u eng eski va tushib ketishga yaqin turgan mijoz ma'lumoti.
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Tugma: Sinovni bajaring → Davom etish

## 8 · 2-savol ✅  `[1068]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Stol usti (kontekst oynasi) to'lib ketsa, nima sodir bo'ladi?**
  - ✔ Eng eski xabar tushib ketadi va unutiladi
  - Maslahatchi butunlay o'chib qoladi
  - Yangi xabarlar qabul qilinmay qoladi
  - Barcha eski xabarlar avtomatik daftarga yoziladi
- To'g'ri: To'g'ri! Stol usti (kontekst oynasi) cheklangan. To'lganda eng eski varaq (xabar) tushib ketadi va Maslahatchi shu ma'lumotni endi bilmaydi — shuning uchun muhim narsani daftarga yozib qo'yish kerak.
- Xato izohlari:
  - (o'chib qoladi) Maslahatchi ishlashda davom etadi — faqat eski xabarni unutadi.
  - (qabul qilinmaydi) Yangi xabarlar bemalol qabul qilinadi — muammo faqat eskisining unutilishida.
  - (avtomatik daftarga) Avtomatik hech narsa yozilmaydi — muhimini o'zingiz daftarga yozishingiz kerak.
  - (umumiy) Stol to'lsa, eng eski xabar tushib ketadi va unutiladi.

## 9 · Erkinlik murvati (markaziy #3)  `[1087]`
- Eyebrow: Markaziy · #3
- Sarlavha: **Erkinlik murvati — qat'iymi, erkinmi?**
- Mentor: Bir xil savolni 3 marta beramiz — «Bizda qanday pitsalar bor?». Murvatni bosib, javoblarni solishtiring. Vaziyat: menyuni har doim bir xil va aniq aytish kerak — qaysi murvat to'g'ri keladi?
- Tugmalar: ❄️ Past (0.1) · Baland (1.5)
- «🧭 Maslahatchi · past» javoblari: «Bizda Margarita va Pepperoni bor.» · «Bizda Margarita va Pepperoni bor.» · «Bizda Margarita va Pepperoni bor.»
- «🧭 Maslahatchi · baland» javoblari: «Bizda Margarita, Pepperoni va ajoyib taomlar bor!» · «Menyuda ko'p narsa bor — masalan ananasli pitsa 3 000 so'm 🍍» · «Bugun Margarita va yangi maxsus taklifimiz bor, albatta sinab ko'ring!»
- Savol (yorliq): **Qaysi murvat?** (ikkalasi ko'rilgach) — ✔ ❄️ Past (0.1) · 🔥 Baland (1.5)
- To'g'ri: ✓ To'g'ri! Past murvat — qat'iy va bir xil javob beradi. Menyu kabi aniqlik kerak bo'lgan joyda shu tanlanadi.
- Xato (Baland): Baland murvatda javob har safar boshqacha bo'ladi — hatto «ananasli pitsa» kabi yo'q narsani ham aytishi mumkin. Menyu uchun bu xavfli.
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- Tugma: Ikkalasini sinab ko'ring → Davom etish

## 10 · 3-savol ✅  `[1133]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Erkinlik murvati baland qilib qo'yilsa, nima bo'ladi?**
  - Maslahatchi har doim sezilarli darajada tezroq javob qaytaradi
  - Javoblar har doim bir xil bo'lib qoladi
  - Internetni sezilarli darajada ko'proq sarflaydi
  - ✔ Javoblar xilma-xil, hatto o'ylab topilishi mumkin
- To'g'ri: To'g'ri! Murvat baland bo'lsa, Maslahatchi erkin va xilma-xil javob beradi — lekin bu ba'zan haqiqatga to'g'ri kelmaydigan (o'ylab topilgan) javobga ham olib kelishi mumkin.
- Xato izohlari:
  - (tezroq) Tezlikka aloqasi yo'q — murvat javobning xilma-xilligini boshqaradi.
  - (bir xil) Aksincha — past murvat bir xil javob beradi, baland murvat xilma-xil.
  - (internet) Internet sarfiga aloqasi yo'q.
  - (umumiy) Baland murvat — xilma-xil, ba'zan noto'g'ri o'ylab topilgan javob.

## 11 · Fact Checker (markaziy #4)  `[1154]`
- Eyebrow: Markaziy · #4
- Sarlavha: **Fact Checker — Maslahatchi rost aytdimi?**
- Mentor: Maslahatchi menyu haqida 3 ta gap aytdi. Har birini haqiqiy menyu bilan solishtirib, ✅ Rost yoki ❌ O'ylab topilgan deb belgilang.
- Yorliq «haqiqiy menyu»: Margarita — 35 000 so'm · Pepperoni — 42 000 so'm · To'rt pishloqli — 48 000 so'm
- Yorliq «Maslahatchining da'volari» (har qatorda: ✅ Rost · ❌ O'ylab topilgan):
  - Margarita — 35 000 so'm → ✔ Rost
  - Ananasli pitsa — 30 000 so'm → ✔ O'ylab topilgan
  - Pepperoni — 42 000 so'm → ✔ Rost
- Hammasi to'g'ri: ✓ Ajoyib! «Ananasli pitsa» menyuda yo'q edi — bu Maslahatchining o'ylab topgan (hallutsinatsiya) javobi. Har doim shunday tekshiring.
- Xato bo'lsa: Diqqat: «Ananasli pitsa» aslida menyuda YO'Q — Maslahatchi buni o'zi o'ylab topgan. Narx va faktlarni har doim manba bilan solishtiring.
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- Tugma: Har da'voni tekshiring (0/3) → Davom etish

## 12 · Pitsa Bek suhbati (hayotiy)  `[1201]`
- Eyebrow: Hayotiy · Pitsa Bek
- Sarlavha: **Yo'riqnoma bilan — javob endi aniq va ishonchli.**
- Mentor: Endi 📜 yo'riqnoma va menyu bilan qurollangan Maslahatchi qanday ishlashini ko'ring. Tugmani bosib suhbatni davom ettiring.
- Suhbat «🧭 Maslahatchi» (har bosishda bitta juftlik):
  1. mijoz «Salom! Och qornimga nima maslahat berasiz? 😅» → «Salom! 😊 Pitsa Bek menyusidan Pepperoni tavsiya qilaman — go'shtli va to'yimli 🍕 Yoki klassik Margarita?»
  2. mijoz «Achchiq narsa yoqmaydi menga» → «Unda Margarita aynan siz uchun — achchiq emas, yumshoq pishloqli 🧀 Olib beraymi?»
  3. mijoz «Ha, bittasini olaman» → «Zo'r tanlov! 🎉 Margarita — 35 000 so'm. Manzilingizni yuborsangiz, buyurtmani rasmiylashtiramiz 📍»
- Tugma: ▶ Suhbatni boshlash · Keyingi savol → · ✓ Buyurtma yo'lga qo'yildi
- Karta «📜 Har javob ortida»: Yo'riqnoma («Pitsa Bek yordamchisisan, faqat menyu haqida gapir») + haqiqiy menyu — javoblar aniq va tekshirilgan.
- Xulosa: Ko'rdingizmi farqni? Hozirgi javoblar to'qib chiqarilmagan — narxlar ham haqiqiy menyudan. Aniq yo'riqnoma + tekshirish = ishonchli Maslahatchi.
- Tugma: Suhbatni davom ettiring (0/3) → Davom etish

## 13 · 2 ta amaliy nuqta  `[1246]`
- Eyebrow: Amalda · 2 nuqta
- Sarlavha: **Maslahatchini ulashdan oldin — 2 ta amaliy nuqta.**
- Mentor: Maslahatchi zo'r, lekin ikki narsani yodda tuting: kalit xavfsizligi va xarajat.
- Kartalar:
  - **🔑 1. API kalit — .env'da** — AI API kaliti ham token kabi maxfiy — `.env`'da saqlanadi, kodda ochiq emas, git'ga tushmaydi.
  - **💰 2. Har topshiriq — xarajat** — Maslahatchiga har murojaat ozgina pul sarflaydi. Shuning uchun oddiy ishlarni tugmalar bilan, faqat erkin savollarni Maslahatchi bilan hal qiling.
- Tugma: Tushundim ✓ → ✓ Tushundim
- Karta «📍 Bugungi qoidalar — qisqacha»: 📜 aniq yo'riqnoma → 📓 muhimini daftarga → 🎚️ vaziyatga mos murvat → 🔍 javobni tekshirish.
- Xulosa: Ana shu 4 qoida bilan Maslahatchi ishonchli yordamchiga aylanadi.
- Pastki tugma: Tushunding ✓ → Davom etish

## 14 · 4-savol ✅  `[1272]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Maslahatchi «Bizda ananasli pitsa bor» desa, nima qilish kerak?**
  - Darhol ishonib, mijozga aytaverish kerak
  - ✔ Menyu bilan solishtirib tekshirish kerak
  - Erkinlik murvatini butunlay o'chirib qo'yish kerak
  - Botni darhol butunlay o'chirish kerak
- To'g'ri: To'g'ri! Maslahatchi ba'zan o'zi o'ylab topgan (hallutsinatsiya) javob berishi mumkin. Har qanday faktni, ayniqsa narx va mahsulotlarni, haqiqiy manba (menyu) bilan solishtirib tekshirish kerak.
- Xato izohlari:
  - (darhol ishonib) Tekshirmasdan ishonish xavfli — Maslahatchi o'ylab topgan bo'lishi mumkin.
  - (murvatni o'chirib) Murvatni o'chirish yechim emas — javobni har doim tekshirish kerak.
  - (botni o'chirish) Botni o'chirish shart emas — muammo yechimi tekshirishda.
  - (umumiy) Har doim menyu/fakt bilan solishtirib tekshiring.

## 15 · Xavfsiz ishlash sikli ✅ (final)  `[1296]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: xavfsiz ishlash siklini yig'ing.**
- Mentor: Maslahatchidan foydalanishning to'g'ri tartibini eslang: avval nima yoziladi, so'ng nima sozlanadi, oxirida nima tekshiriladi?
- Bo'laklar (aralash chiqadi; to'g'ri tartib): 1 Aniq yo'riqnoma yozish · 2 Murvatni vaziyatga sozlash · 3 Maslahatchidan javob olish · 4 Javobni tekshirish · 5 Muhimini daftarga yozish
- Uyachalar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- To'g'ri: ✓ Xavfsiz ishlash sikli tayyor! · ✓ Tartib: **Yo'riqnoma → Murvat → Javob → Tekshirish → Daftar**. Shu sikl bilan Maslahatchi ishonchli yordamchiga aylanadi.
- Xato: ⚠️ Tartib xato — qayta joylang. / Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Tugma: Siklni yig'ing → Davom etish

## 16 · Amaliyot · Maslahatchi  `[2116]`
- Eyebrow: Amaliyot · Maslahatchi
- Sarlavha: **O'z Maslahatchingiz uchun yo'riqnoma yozing**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: AI chat (masalan, Claude yoki ChatGPT) oching. O'z do'koningiz (yoki istalgan mavzu) uchun aniq 📜 yo'riqnoma yozing: kim, qanday ohangda gapiradi va qaysi chegarada. Keyin bir xil savolni ikki marta bering va javoblarni solishtiring.
- Bosqichlar — belgilab boring:
  1. AI chat sahifasini oching (masalan, `claude.ai`)
  2. `Sen ... yordamchisisan. Faqat ... haqida gaplash.` shaklida yo'riqnoma yozing
  3. Bitta savolni yuboring va javobni o'qing
  4. Xuddi shu savolni yana bir marta yuboring — javoblarni solishtiring
  5. Imkoni bo'lsa, murvat (temperature)ni past/baland qilib ikki xil javob oling
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · pastda: Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1863]`
- Eyebrow: Natijalar · Sarlavha: **Kim g'olib?**
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (X/Y to'g'ri) · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2144]` (kartalar `[2130]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Juda ko'p o'qigan, lekin sizni eslamaydigan yordamchini nima deb ataymiz? | Maslahatchi | LLM — har suhbatni noldan boshlaydi |
| Maslahatchiga yuborgan savolingiz nima deb ataladi? | Topshiriq | prompt — bir savol, bir topshiriq |
| Maslahatchi kim ekanini va qanday gapirishini nima belgilaydi? | Yo'riqnoma | system prompt: kim, qanday ohangda, qaysi chegarada |
| Suhbat sig'adigan, joyi cheklangan maydonni nima deb ataymiz? | Stol usti | kontekst oynasi — faqat oxirgi bir necha xabar sig'adi |
| Stol usti to'lganda qaysi xabar tushib ketadi? | Eng eski xabar | Maslahatchi uni butunlay unutadi |
| Muhim ma'lumot yo'qolmasligi uchun qayerga yoziladi? | Daftarga | ism va buyurtma daftarda saqlanadi |
| Javob qat'iy yoki erkin bo'lishini qaysi sozlama belgilaydi? | Erkinlik murvati | temperature — past yoki baland qilinadi |
| Murvat past bo'lganda javob qanday bo'ladi? | Qat'iy va bir xil | menyu narxini aytishga shu mos |
| Murvat baland bo'lganda javob qanday bo'ladi? | Erkin va har safar boshqacha | ijodiy matn uchun qulay |
| Maslahatchi o'ylab topgan, haqiqatga to'g'ri kelmaydigan javob nima deyiladi? | Hallutsinatsiya | masalan menyuda yo'q «ananasli pitsa» |
| Maslahatchi aytgan narxni qanday ishonchli qilasiz? | Menyu bilan solishtiraman | javobni haqiqiy manba bilan tekshirish |
| AI kaliti qaysi faylda saqlanadi? | .env | kalit maxfiy, kodga ochiq yozilmaydi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2157]`
- Eyebrow: Tayyor · belgi: ✓ Botjon o'ylay boshladi
- Sarlavha: **Endi Maslahatchi siz uchun `boshqariladigan vosita`.** (yonida ball-halqa)
- Jonli viktorina tugmasi (CodeStrike) · ⏳ Mentorni kuting
- Endi siz bilasiz:
  - 🧭 Maslahatchi juda ko'p biladi, lekin sizni ESLAMAYDI — har safar hammasini qayta aytish kerak
  - 📜 Yo'riqnoma (system prompt) — kim, qanday ohangda va qaysi chegarada gapirishini belgilaydi
  - Stol usti (kontekst oynasi) cheklangan — to'lsa eng eski xabar tushib ketadi, muhimini daftarga yozib qo'ying
  - Erkinlik murvati (temperature): past — qat'iy va bir xil, baland — erkin, lekin ba'zan o'ylab topadi
  - Maslahatchi yolg'on gapirishi (hallutsinatsiya) mumkin — javobini har doim faktlar bilan solishtirib tekshiring
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (ichida uchib yuruvchi so'zlar: amaliyot · loyiha · mashq · natija)
- 📝 Uyga vazifa:
  - **Yozing** — o'z loyihangiz uchun aniq yo'riqnoma (system prompt) yozing: kim, qanday, qaysi chegarada
  - **Sinang** — bir xil savolni ikki marta bering va Maslahatchi eslay olmasligini o'z ko'zingiz bilan ko'ring
  - **Tekshiring** — Maslahatchidan biror fakt so'rang va uni haqiqiy manba bilan solishtirib tasdiqlang
- 🚀 Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi!
- 🏅 Nishonlaringiz — N/4 · Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 📜 Rule Writer — Maslahatchiga aniq yo'riqnoma yozdingiz (5-ekran) · 📓 Table Manager — Muhim ma'lumotni daftarga ko'chirdingiz (7-ekran) · 🎚️ Dial Master — Erkinlik murvatini to'g'ri sozladingiz (9-ekran) · 🔍 Fact Checker — O'ylab topilgan pitsani menyu bilan tutdingiz (11-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

**Test ekranlarining umumiy yozuvlari:** ⚡ Jonli dars — bitta urinish, o'ylab bosing! · Javob tanlang · Qaytadan urinib ko'ring · ✓ To'g'ri javob: X — … · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · 📖 Qisqa takrorlash — mavzuni yana bir ko'rish

**Qisqa takrorlash oynalari (5)** — umumiy yozuvlar: 📖 Qayta tushuntirish · 1-karta · ← Oldingi · Keyingisi → · 🗣️ Sinfga savol: · ✓ Tushunarli — davom etamiz · Yopish
1. (4-ekran) **Maslahatchiga vazifa aytish kerak:** 📚 Juda ko'p biladi — 🧭 Maslahatchi ko'p mavzuni biladi — lekin unga nima haqida gapirish kerakligi aytilmagan bo'lsa, hammasini gapiraveradi. · 🙈 Vazifasiz — adashadi — Vazifasi (📜 yo'riqnoma) aytilmagan Maslahatchi mijozga kerak bo'lmagan narsalarni ham aytadi. · 📜 Yechim — yo'riqnoma — Kim, qanday, qaysi chegarada gapirishini yozib bersangiz — javob aniq bo'ladi. · Sinfga savol: Yo'riqnomasiz Maslahatchi nega adashadi?
2. (8-ekran) **Stol usti — kontekst oynasi:** 🗂️ Joyi cheklangan — Suhbat uchun ajratilgan «stol usti» cheklangan — u faqat oxirgi bir necha xabarni sig'diradi. · 🍂 Eng eski varaq tushadi — Stol to'lsa, eng eski xabar tushib ketadi va Maslahatchi uni unutadi. · 📓 Yechim — daftar — Muhim ma'lumotni (ism, buyurtma) 📓 daftarga yozib qo'ysangiz, u yo'qolmaydi. · Sinfga savol: Stol to'lganda qaysi xabar birinchi tushib ketadi?
3. (10-ekran) **Erkinlik murvati — temperature:** ❄️ Past — qat'iy — Murvat past bo'lsa, Maslahatchi deyarli bir xil javob beradi — aniqlik kerak bo'lganda shu tanlanadi. · 🔥 Baland — erkin — Murvat baland bo'lsa, javob har safar boshqacha bo'ladi — ijodkorlik uchun yaxshi. · ⚠️ Xavf — o'ylab topish — Baland murvatda Maslahatchi ba'zan haqiqatga to'g'ri kelmaydigan narsa aytishi mumkin. · Sinfga savol: Menyuni bir xil aytish uchun qaysi murvat tanlanadi?
4. (14-ekran) **Faktlarni tekshirish — hallutsinatsiya:** 🧭 Maslahatchi ishonchli tuyuladi — Maslahatchi hatto noto'g'ri javobni ham ishonchli ohangda aytadi. · 🍍 O'ylab topilgan fakt — «Ananasli pitsa» kabi mavjud bo'lmagan narsani ham aytib qo'yishi mumkin — bu hallutsinatsiya. · 🔍 Yechim — solishtirib tekshirish — Narx va faktlarni har doim haqiqiy manba (menyu) bilan solishtiring. · Sinfga savol: Maslahatchi javobini qachon tekshirish kerak?
5. (15-ekran; faylda bor, lekin 15-ekranda uni ochadigan tugma yo'q) **Xavfsiz ishlash sikli:** 📜 Avval — yo'riqnoma — Birinchi qadam — Maslahatchiga aniq vazifa berish (kim, qanday, chegara). · 🎚️ Keyin — murvat va javob — Vaziyatga mos murvat tanlanadi, so'ng Maslahatchidan javob olinadi. · 🔍 Eng oxiri — tekshirish va daftar — Javob tekshiriladi, muhimi 📓 daftarga yoziladi. (📜 Yo'riqnoma → 🎚️ Murvat → 💬 Javob → 🔍 Tekshirish → 📓 Daftar) · Sinfga savol: Nega tekshirish javobni olishdan keyin bo'ladi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Maslahatchiga vazifasi aytilmasa (yo'riqnomasiz), u qanday javob beradi? Hech qanday javob bermaydi · ✔ Keng va tartibsiz javob beradi · Faqat 'tushunmadim' deydi · Avtomatik ravishda o'chib qoladi
2. 📜 Yo'riqnoma (system prompt) nimani belgilaydi? Internetning ulanish tezligini · Botning rangi va shriftini · Serverning jismoniy joylashuvini · ✔ Uning xulqi va chegarasini
3. Topshiriq (prompt) nima? ✔ Foydalanuvchi yuborgan savol · Botning ichki xatolik jurnali · Server manzili · Telegram kanali nomi
4. Stol usti (kontekst oynasi) nima uchun cheklangan? Chunki Maslahatchi charchaydi · Chunki internet tezligi juda past ekan · ✔ Joyi cheklangan, hammasi sig'maydi · Chunki bu qonun talabi
5. Stol to'lib ketsa, qaysi varaq tushib ketadi? Eng yangi varaq · ✔ Eng eski varaq · Eng qisqa varaq · Tasodifiy varaq
6. Muhim ma'lumot (masalan, mijoz ismi) yo'qolib ketmasligi uchun nima qilinadi? ✔ Uni 📓 daftarga yozib qo'yish · Stol ustini kattalashtirish · Erkinlik murvatini pasaytirish · Maslahatchini qayta ishga tushirish
7. Erkinlik murvati past bo'lsa (masalan 0.1), javob qanday bo'ladi? Har safar butunlay boshqacha · Har doim xato · Juda uzun · ✔ Qat'iy va deyarli bir xil
8. Erkinlik murvati baland bo'lganda (masalan 1.5) qanday xavf paydo bo'lishi mumkin? Bot butunlay to'xtaydi · ✔ O'zi o'ylab topgan narsa aytishi mumkin · Internet butunlay va qaytarilmas tarzda uzilib qoladi · Kalit oshkor bo'ladi
9. Do'kon menyusini har doim bir xil va aniq aytish kerak bo'lsa, qaysi murvat tanlanadi? Baland (1.5) · O'rtacha, xohlagancha · ✔ Past (0.1) · Murvat ahamiyatsiz
10. Maslahatchi 'Bizda ananasli pitsa bor' desa-yu, menyuda bunday pitsa bo'lmasa, bu nima deyiladi? To'g'ri javob · Bu doim xizmat oynasining jiddiy texnik xatoligi · Kalit xavfi · ✔ O'ylab topish — tekshirish kerak
11. Maslahatchi javobini qachon tekshirish kerak? ✔ Har doim tekshirish kerak · Hech qachon, u doim to'g'ri · Faqat murvat past bo'lsa · Faqat mijoz so'rasa
12. AI API kaliti qayerda saqlanadi? Ochiq kodda, hammaga ko'rinadigan joyda · Chatda mijozga yuboriladi · ✔ .env faylda — maxfiy, git'ga tushmaydi · Hech qayerda saqlanmaydi

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Tartib bir-biriga zid (13 ↔ 15):** 13-ekran «Bugungi qoidalar» — «yo'riqnoma → **daftarga** → murvat → tekshirish» (daftar 2-o'rinda); 15-ekran yakuniy testda to'g'ri tartib — «Yo'riqnoma → Murvat → Javob → Tekshirish → **Daftar**» (daftar oxirida). 15-ekran Mentori ham «oxirida nima tekshiriladi?» deydi, to'g'ri javobda esa oxirgisi daftar.
- **Mantiq zid (6 ↔ 7, uyga vazifa):** 6-ekran Mentori «**Bir suhbatda** ikki marta yozamiz» deydi, ikkinchi xabardayoq ism unutiladi. 7-ekranda esa stolga 4 varaq sig'adi, ya'ni 2 ta xabar hali stolda turishi kerak. Uyga vazifadagi «bir xil savolni ikki marta bering va Maslahatchi eslay olmasligini … ko'ring» bandi ham shunga bog'liq: oddiy AI chatda bitta suhbat ichida AI odatda eslab qoladi.
- **Hook har qanday javobni maqtaydi (0):** 3 variantning qaysi biri tanlansa ham (masalan, «Internet sekin ishlagan edi») «Aynan! …» chiqadi. Bundan tashqari 4-ekrandagi 1-savol hook savolini deyarli so'zma-so'z takrorlaydi (javobi hookda allaqachon aytilgan).
- **Javob «sotilgan» (5 · arena):** 5-ekranda uchala savolda (Kim? / Qanday? / Chegara?) to'g'ri javob doim **birinchi** variant, tartibi aralashtirilmaydi. Arena 12-savolda to'g'ri javob («.env faylda — maxfiy, git'ga tushmaydi») eng uzun va izohli. Arena 4-savol aylanma: «nima uchun cheklangan?» → «Joyi cheklangan».
- **«O'tgan/keyingi» gaplar:** Yakundagi «🚀 Keyingi dars — Botjon … fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi» App.jsx tartibiga zid: 7-dars «Loyiha kuni: bot + DB + AI», fidbek esa 9-dars («Fikr va iteratsiya»). 3-ekrandagi «keyingi ekranda uni yozamiz» ham to'g'ri emas: undan keyin test (4) keladi, yo'riqnoma 5-ekranda yoziladi.
- **AI vosita nomi (16):** amaliyotda «AI chat (masalan, Claude yoki ChatGPT)» va «`claude.ai`» yozilgan. Sinfda gemini.google.com ishlatiladi.
- **Bir narsa — ikki xil nom / ip:** dars ichidagi nom «Botjon o'ylay boshladi» (19-ekran belgisi), App.jsx'dagi nom esa «Bot ichida AI». Misol-do'kon «Pitsa Bek», modulning qolgan darslarida (1, 3, 4, 9) esa «AvtoPizza». 1-ekranda «Yangi jihoz yondi: 🧭 **Yo'l-yo'riq**» deyiladi, dars bo'yi esa «📜 **yo'riqnoma**» ishlatiladi. 🧭 belgisi ham Maslahatchiniki, ham Yo'l-yo'riqniki, «AI yordamchi» jihozi esa yonmaydi. Ananasli pitsa narxi 9-ekranda «3 000 so'm», 11-ekranda «30 000 so'm».
- **Til:** 13-ekrandagi pastki tugma «**Tushunding ✓**» — sen-forma (ekrandagi tugma «Tushundim ✓»). **«daftar»** 7, 8, 13, 15-ekranlarda, kartochkada, takrorlashda va nishon tavsifida uchraydi (taqiq-ro'yxatda bor; 4-darsdagi «Holat daftari» ipining davomi). Izohsiz inglizcha so'zlar: «Fact Checker» (11-ekran sarlavhasi), «LLM» (1-kartochka izohi), «API», «git» (13-ekran), «0.1 / 1.5» raqamlari ham izohsiz (9-ekran).
