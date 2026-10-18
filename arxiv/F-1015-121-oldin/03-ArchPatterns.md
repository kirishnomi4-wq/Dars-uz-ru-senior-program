# 3-dars «Arxitektura patternlari» — yakuniy matn

Fayl: `src/6-Modull/ArchPatternsLesson.jsx` · 20 ekran · Keyingi dars: «AI-agent nima»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Loyiha o'sdi — 100 ta fayl. Yangi dasturchi qayerdan boshlaydi?
- Mentor: 1-darsda tizimning qismlarini ko'rdik. Lekin har bir qismning ichida ham kod ko'payib boradi. Tugmani bosing — ikki xil loyiha tuzilishini solishtiring.
- Tugma: ▶ Ikki loyihani ko'rish → ✓ Solishtirildi
- (bosilgach) Kod oynasi «tartibsiz/»:
```
index.js
kod2.js
stuff.js
final_ROST.js
yana_bir.js …
```
- (bosilgach) Kod oynasi «tartibli/»:
```
views/      // ko'rinish
controllers/ // yo'naltirish
models/     // ma'lumot
```
- Savol (tugma bosilgach faollashadi): Qaysisida tez ishlaydi?
  - Tartibsizda — fayl ko'p bo'lsa, kuchli loyiha
  - ✔ Tartiblida — har narsa o'z joyida, darrov topiladi
  - Farqi yo'q — ikkalasi bir xil
- Javob izohlari:
  - 2-variant: **Aynan!** Tartibli loyihada har bir fayl o'z vazifasi bo'yicha joylashgan. Bunday tartibning sinab ko'rilgan usullari bor — ularni **pattern** deyishadi. Bugun eng mashhurlaridan biri — **MVC**, keyin tizimni bo'lish usullari — **monolit** va **mikroservis** bilan tanishamiz.
  - 1- yoki 3-variant: **Qiziq fikr!** Lekin 100 ta fayl orasidan keraklisini tartibsiz loyihada topish ancha qiyin. Tartibli loyihada har bir fayl o'z vazifasi bo'yicha joylashgan. Bunday tartibning sinab ko'rilgan usullari bor — ularni **pattern** deyishadi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Kodni tartiblashning tanilgan usuli — arxitektura patterni.
- Mentor: 1-darsda tizimning qismlarini ko'rdingiz. Bugun ularni tartibli tuzishning **sinab ko'rilgan usullari**ni o'rganamiz. Yaxshi xabar: Nest darslarida Controller yozganingizda, siz shu usullardan birini allaqachon ishlatgansiz.
- Yorliq: dars oxirida — siz shuni ayta olasiz
  - Karta: «Mening loyiham — **bitta ilova (monolit)**, ichi **MVC** bo'yicha tuzilgan.» — bir jumla, boshqa dasturchi darrov tushunadi.
- Bugungi 4 qadam
  1. MVC — 3 qism: Model, View, Controller · mvc
  2. Mini-do'koningizning kodi qaysi qismga tushadi · moslash
  3. Monolit va mikroservis — qachon qaysi biri qulay · tizimni bo'lish
  4. Tizimni bir jumlada ta'riflash · bir jumla
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Pattern nima
- Eyebrow: Tushuncha · pattern
- Sarlavha: Pattern nima?
- Mentor: Ko'p dasturchilar bir xil muammoga duch keladi. Ular yillar davomida sinab ko'rgan yechim usullariga nom berishgan — pattern shu. Tugmani bosing.
- Karta — Pattern nima?: Tez-tez uchraydigan muammoni hal qilishning sinab ko'rilgan usuli. U tayyor kod emas: usulni bilasiz, kodni esa o'z loyihangizga moslab yozasiz.
- Tugma: Hayotdan misol? → ✓ Ko'rdingiz
- O'ng (tugma bosilgach):
  - **Futbolda:** 4-4-2 sxemasi — tanilgan usul, lekin har jamoa uni o'z o'yinchilariga moslaydi
  - **Qurilishda:** sinalgan uy rejasi — har uyni noldan chizmaysiz, o'lchamini esa o'zingiz tanlaysiz
  - **Kodda:** MVC — kodni vazifasi bo'yicha 3 qismga ajratish usuli
- Xulosa: Pattern — umumiy til ham. «MVC» desangiz, boshqa dasturchilar kodingiz qanday tuzilganini tez tushunadi.
- Tugmalar: Orqaga · Misolni ko'ring → Davom etish

## 3 · MVC — 3 qism
- Eyebrow: Pattern · MVC
- Sarlavha: MVC — kodni vazifasi bo'yicha 3 qismga ajratish usuli.
- Mentor: MVC — Model, View, Controller. Nest darslaridagi **oshxona**ni eslang: ofitsiant buyurtmani oladi, oshpaz retsept bo'yicha tayyorlaydi, oziq-ovqat omborda saqlanadi. MVC ham xuddi shunday bo'lingan. Har bir qismni bosing.
- Qismlar (bosilgani ✓ bilan belgilanadi; o'ngda karta ochiladi):
  - **View · ko'rinish** — Foydalanuvchi ko'radigan qism: sahifa, tugmalar, rasmlar. Ma'lumotni ko'rsatadi. Bizning loyihada bu vazifani asosan React bajaradi. · Oshxonada: **mijoz ko'radigan zal va menyu**
  - **Controller · yo'naltiruvchi** — So'rovni qabul qiladi va ishni yo'naltiradi: Model'dan ma'lumot so'raydi, natijani View'ga beradi. Nest'dagi controllerlar aynan shu ishni qiladi. · Oshxonada: **ofitsiant**
  - **Model · ma'lumot va qoidalar** — Ma'lumot qanday bo'lishini va u bilan qanday ishlashni belgilaydi: masalan, mahsulotda nomi va narxi bo'lishi, narx manfiy bo'lmasligi. · Oshxonada: **oshpaz va retseptlar**
- Eslatma (3/3 dan keyin): **Database (PostgreSQL) — Model emas.** Database ma'lumotni saqlaydi, Model esa u bilan ishlaydi. *Oshxonada: ombor.*
- Xulosa (3/3 dan keyin): View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi. Database esa ma'lumotni saqlaydi.
- Tugmalar: Orqaga · 3 qismni oching (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: MVC'da foydalanuvchi ko'radigan qism qaysi?
  - Controller — so'rovni yo'naltiradi
  - Model — ma'lumot bilan ishlaydi
  - Hech qaysi — bu MVC'ga kirmaydi
  - ✔ View — sahifa va tugmalar
- Javob izohlari:
  - To'g'ri: To'g'ri! View — foydalanuvchi ko'radigan qism: sahifa, tugmalar, rasmlar. U ma'lumotni ko'rsatadi, qoidalar esa boshqa qismda.
  - 1-variant: Controller so'rovni yo'naltiradi, lekin foydalanuvchiga ko'rinmaydi. Ko'rinadigan qism — View.
  - 2-variant: Model ma'lumot va qoidalar bilan ishlaydi, u ko'rinmaydi. Ko'rinadigan qism — View.
  - 3-variant: Aksincha — ko'rinadigan qism aynan MVC'ning V harfi, View.
- Test yozuvlari (4, 8, 11, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · So'rov yo'li
- Eyebrow: Animatsiya · so'rov yo'li
- Sarlavha: So'rovni avval Controller qabul qiladi.
- Mentor: MVC'da so'rov uch qism orasidan o'tadi. Tugmani bosib, uning yo'lini kuzating.
- Chizma: View · ko'rinish — Controller · yo'naltiruvchi — Model · ma'lumot (faol qism yonadi)
- Tugma: ▶ So'rovni yuborish → Keyingi qadam → → ✓ Ko'rdingiz
- Qadamlar (birinchisi darrov ko'rinadi, keyingilari har bosishda):
  1. Foydalanuvchi «Mahsulotlar» tugmasini bosdi → so'rovni Controller qabul qildi.
  2. Controller Model'dan mahsulotlar ro'yxatini so'radi.
  3. Model ro'yxatni Database'dan (PostgreSQL) olib, Controller'ga qaytardi.
  4. Controller natijani View'ga berdi: «buni ko'rsat».
  5. View foydalanuvchiga mahsulotlar ro'yxatini ko'rsatdi.
- Xulosa (5/5 dan keyin): Ko'rdingizmi? So'rov Controller → Model → View yo'li bilan yurdi. Bu tuzilmada View ma'lumotni Model'dan o'zi olmaydi — Controller orqali oladi. Shuning uchun har bir ish o'z joyida qoladi.
- Tugmalar: Orqaga · So'rov yo'lini kuzating (N/5) → Davom etish

## 6 · Moslash — mini-do'kon
- Eyebrow: Moslash · mini-do'kon
- Sarlavha: Mini-do'koningizning kodi qaysi qismga tushadi?
- Mentor: MVC — texnologiyalar emas, kodning vazifalari. Shuning uchun React, Nest yoki PostgreSQL'ni emas, kod bo'laklarini joylaymiz. Har bir bo'lakni mos qismga joylang.
- Chap — «Kod bo'lagi N/3» (navbat bilan) — to'g'ri javob:
  1. Mahsulotlar ro'yxatini chiqaradigan React sahifa — View
  2. Nest'dagi controller — `/products` so'rovini qabul qiladigan kod — Controller
  3. Mahsulotda nomi va narxi bo'lishini belgilaydigan va uni Database'dan o'qiydigan kod — Model
- O'ng — yorliq «qaysi MVC qismi?» · tugmalar: View (+) · Controller (+) · Model (+)
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Bu qism mos emas — kod bo'lagi nima ish qilishini o'ylang va qayta tanlang.
- Hammasi to'g'ri bo'lsa: Hammasi to'g'ri! Sahifa — **View**, so'rovni qabul qiladigan kod — **Controller**, ma'lumot va qoidalar bilan ishlaydigan kod — **Model**. PostgreSQL esa ma'lumotni saqlaydi, Model u bilan ishlaydi. Mini-do'koningiz MVC bo'yicha tuzilgan!
- Tugmalar: Orqaga · Moslang (N/3) → Davom etish

## 7 · Nega pattern
- Eyebrow: Foyda · nega pattern
- Sarlavha: Pattern bo'yicha qurish nega foydali?
- Mentor: Pattern shunchaki «chiroyli tartib» emas — u amaliy foyda beradi. Har foydani bosing.
- Foydalar (bosilgani ✓ bilan belgilanadi; o'ngda karta ochiladi):
  - **Tartib** — Har bir kod o'z joyida: qaysi kod qayerda ekanini bilasiz.
  - **Jamoa** — Bir kishi View'da, boshqasi Model'da ishlaydi — bir-biriga kam xalaqit beradi.
  - **AI bilan ishlash** — Pattern nomini aytsangiz, AI'ga loyihangiz qanday tuzilganini tushuntirish osonroq bo'ladi.
  - **Xatoni topish** — Ma'lumot xato bo'lsa — avval Model'ga qaraysiz. Sahifa buzuq bo'lsa — View'ga. Xatoni tezroq topasiz.
- Xulosa (4/4 dan keyin): Pattern — tartib, jamoaviy ish, AI bilan oson muloqot va xatoni tez topish. Shuning uchun katta loyihalarda kodni tartibli tuzish uchun patternlardan foydalaniladi.
- Tugmalar: Orqaga · 4 foydani ko'ring (N/4) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nest backend'dagi «narx manfiy bo'lmasin» qoidasini tekshirib, mahsulotni Database'ga yozadigan kod — MVC'ning qaysi qismi?
  - View — chunki natija sahifada ko'rinadi
  - ✔ Model — ma'lumot va uning qoidalari
  - Controller — chunki kod backend'da turibdi
  - Hech qaysi — bu kod MVC'dan tashqarida
- Javob izohlari:
  - To'g'ri: To'g'ri! Ma'lumot qanday bo'lishi va qanday qoidalar bilan ishlanishi — Model'ning vazifasi. Controller so'rovni qabul qilib, shu kodni chaqiradi. Ma'lumotni esa Database (PostgreSQL) saqlaydi.
  - 1-variant: Natija sahifada ko'rinadi, lekin qoidani View tekshirmaydi — u faqat ko'rsatadi.
  - 3-variant: Kod backend'da turgani uni Controller qilmaydi: Controller so'rovni qabul qilib yo'naltiradi, qoidalar esa Model'da.
  - 4-variant: Aksincha — ma'lumot va qoidalar aynan MVC'ning M harfi, Model.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Monolit
- Eyebrow: Tizimni bo'lish · monolit
- Sarlavha: Monolit — hamma asosiy qism bitta ilovada.
- Mentor: Diqqat, bu boshqa savol. MVC — bitta ilova ichidagi kod qanday tartiblanishi haqida. Monolit va mikroservis esa butun tizim nechta alohida ilovaga bo'linishi haqida. Tugmani bosing.
- Blok: mini-do'kon — mahsulotlar, savat, to'lov, foydalanuvchilar — hammasi bitta backend ilovasida
- Tugma: Plus va minusi? → ✓ Ko'rdingiz
- Chap (tugma bosilgach): Ko'p loyihalar monolitdan boshlanadi — bu normal va to'g'ri.
- O'ng (tugma bosilgach):
  - **Plus:** sodda, tez boshlanadi, bitta joyga joylashtiriladi, tushunish oson. *(Joylashtirish, inglizcha deploy — ilovani internetda ishlaydigan qilib serverga qo'yish.)*
  - **Minus:** ilova juda kattalashsa, uni o'zgartirish og'irlashadi; bitta qismdagi jiddiy xato butun ilovani to'xtatib qo'yishi mumkin.
- Tugmalar: Orqaga · Plus/minusni ko'ring → Davom etish

## 10 · Mikroservis
- Eyebrow: Tizimni bo'lish · mikroservis
- Sarlavha: Mikroservis: bitta tizim — bir nechta xizmat
- Mentor: Tizim va jamoa kattalashganda, ayrim qismlarni alohida xizmatga ajratish foydali bo'lishi mumkin. Har biri o'z ishini qiladi. Tugmani bosib, monolit qanday bo'linishini ko'ring.
- Blok (bosilguncha): Bitta katta ilova — hammasi birga
- Blok (bosilgach, 4 xizmat, har birida yorliq «alohida»): Mahsulotlar · To'lov · Yetkazish · Foydalanuvchi
- Tugma: Mikroservislarga bo'lish → ✓ Bo'lindi
- Chap (tugma bosilgach): Har xizmat alohida ishlaydi, alohida joylashtiriladi, ko'pincha unga alohida jamoa qaraydi.
- O'ng (tugma bosilgach):
  - **Plus:** yuk ko'p tushgan xizmatni alohida kuchaytirish mumkin — buni **miqyoslash** (scaling) deyishadi; bitta xizmatdagi xato butun tizimga kamroq ta'sir qiladi; katta jamoalar bir-biriga xalaqit bermay ishlaydi.
  - **Minus:** murakkab — xizmatlar bir-biri bilan tarmoq orqali gaplashadi, ularni kuzatish va sozlash qiyinlashadi; kichik loyiha uchun ortiqcha.
- Tugmalar: Orqaga · Monolitni bo'ling → Davom etish

## 11 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Yangi, kichik loyiha, jamoada 2 kishi. Qaysi biri qulayroq?
  - ✔ Monolit — sodda, keyin bo'lish ham mumkin
  - Mikroservis — zamonaviy, shuning uchun doim yaxshi
  - Ikkalasini birga — har ehtimolga qarshi ishonch
  - Farqi yo'q — xohlaganini tanlasa bo'ladi
- Javob izohlari:
  - To'g'ri: To'g'ri! Kichik loyiha va kichik jamoa uchun monolit ko'pincha eng qulay: sodda, tez va arzon. Mikroservis murakkablik qo'shadi — u tizim va jamoa kattalashganda foydali bo'lishi mumkin. «Ortiqcha murakkablashtirmang» — dasturchilarning mashhur qoidasi.
  - 2-variant: Mikroservis doim yaxshi emas — kichik loyiha uchun u ortiqcha murakkablik.
  - 3-variant: Ikkalasini birga qilish — eng murakkab yo'l. Soddadan boshlang.
  - 4-variant: Farqi bor: kichik loyihada monolit ancha qulay.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 12 · Monolitmi yoki mikroservismi
- Eyebrow: Hayotiy · tizimni ajrating
- Sarlavha: Monolitmi yoki mikroservismi?
- Mentor: Arxitektor tizim tavsifini o'qib, u qanday tuzilganini aytadi. Har bir tizimni o'qing va tanlang.
- Chap — «Tizim N/3» (navbat bilan) — to'g'ri javob:
  1. Kichik mini-do'kon: React sahifalar, bitta Nest backend va bitta Database. — Monolit
  2. Katta onlayn bozor: to'lov, qidiruv, yetkazib berish — har biri alohida xizmat, har biriga alohida jamoa qaraydi. — Mikroservis
  3. Yangi loyihaning birinchi sodda varianti (MVP — ishlaydigan eng sodda birinchi versiya): tezda bitta ilova kerak, jamoa 2 kishi. — Monolit
- O'ng — yorliq «qaysi usul?» · tugmalar: Monolit · bitta ilova (+) · Mikroservis · alohida xizmatlar (+)
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Qaytadan o'ylang: hammasi bitta ilovadami yoki alohida xizmatlarga bo'linganmi?
- Hammasi to'g'ri bo'lsa: Barchasi to'g'ri! Endi tizim tavsifini o'qib, u qanday tuzilganini ayta olasiz.
- Tugmalar: Orqaga · Ajrating (N/3) → Davom etish

## 13 · Bir jumlada
- Eyebrow: Bir jumlada
- Sarlavha: Tizimingizni bir jumlada ta'riflang.
- Mentor: Pattern nomlari — dasturchilarning umumiy tili. Tizimingizni 100 ta fayl orqali emas, bir nechta tanish so'z bilan tushuntirasiz. Tugmani bosing.
- Karta — Patternsiz: «Bu yerda fayl bor, u boshqasini chaqiradi, keyin Database'ga…» — uzoq, chalkash.
- Tugma: Pattern bilan-chi? → ✓ Ko'rdingiz
- Karta (tugma bosilgach) — Pattern bilan:
  - «Mini-do'kon — monolit. Ichi MVC bo'yicha: View — React sahifalari, Controller — Nest controllerlari, Model — ma'lumot va qoidalar kodi. Ma'lumot PostgreSQL'da saqlanadi.»
  - → Qisqa va aniq. Boshqa dasturchi ham, AI ham tizimni tezroq tushunadi.
- Xulosa: Yangi loyihani AI bilan boshlaganda ham shu jumladan boshlang — AI'ga loyiha tuzilishini tushuntirish osonroq bo'ladi. AI yozgan kodni esa baribir o'zingiz tekshirasiz.
- Tugmalar: Orqaga · Farqni ko'ring → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Katta onlayn do'kon: 5 ta jamoa ishlaydi, bayramlarda to'lov qismiga yuk bir necha barobar oshadi. Qaysi usul mosroq bo'lishi mumkin?
  - Monolit — hammasi bitta ilovada qolsin
  - Hech qanday usul kerak emas — shunday qolsin
  - ✔ Mikroservis — to'lovni alohida xizmat qilish
  - Faqat MVC — ichki tartib hammasini hal qiladi
- Javob izohlari:
  - To'g'ri: To'g'ri! Bu holatda mikroservis mos bo'lishi mumkin: to'lov xizmatini alohida kuchaytirasiz, har jamoa o'z xizmatini alohida yangilaydi. Bunday qaror faqat foydalanuvchilar soniga qarab emas — jamoa, yuk va o'zgarishlarga qarab qilinadi.
  - 1-variant: Monolit ham ishlashi mumkin, lekin 5 jamoa bitta ilovada bir-biriga xalaqit beradi, to'lovni esa alohida kuchaytirib bo'lmaydi.
  - 2-variant: Aksincha — katta tizimda tuzilish juda muhim.
  - 4-variant: MVC — bitta ilovaning ichki tartibi. Tizimni qismlarga bo'lish esa boshqa savol.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Yakuniy — so'rov yo'lini yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: MVC'da so'rov yo'lini to'g'ri tartibda yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang.
- Joylar (raqam va bo'sh joydagi yo'llanma):
  1. birinchi nima keladi
  2. kim qabul qiladi
  3. ma'lumot qayerdan olinadi
  4. qayerda ko'rsatiladi
  5. oxiri kimga yetadi
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. So'rov
  2. Controller
  3. Model
  4. View
  5. Foydalanuvchiga
- Xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang. Maslahat: so'rovni birinchi bo'lib kim qabul qiladi?
- To'g'ri yig'ilgach: ✓ Yo'l tayyor: **So'rov → Controller → Model → View → Foydalanuvchiga**. MVC shu tartibda ishlaydi.
- Havola (xato urinishdan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Yo'lni yig'ing → Davom etish

## 16 · Amaliyot · loyiha
- Eyebrow: Amaliyot · Loyiha
- Sarlavha: O'z tizimingizni pattern bilan ta'riflang
- Mentor: Bu topshiriqni **o'z AI yordamchingizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z loyihangizni (yoki mini-do'konni) arxitektura tili bilan bir jumlada ta'riflang. Hali kod yozmaysiz — faqat rejalashtirasiz.
  - **Esda tuting:** bu yerda **ikki xil savol** bor. MVC — ilova ichidagi tartib. Monolit yoki mikroservis — tizim nechta ilovaga bo'lingani.
- Bosqichlar — belgilab boring (bosilgani ✓ bilan belgilanadi):
  1. 1-savol: tizim qanday bo'lingan — bitta ilova (`monolit`) yoki alohida xizmatlar (`mikroservis`)?
  2. 2-savol: ilova ichi qanday tartiblangan — qaysi kod `View`, qaysi `Controller`, qaysi `Model`?
  3. Nega shu tanlov: loyihangizga monolit yetadimi yoki mikroservis kerakmi?
  4. Bir band javob yozing: «Mening tizimim — …, chunki …»
- Tugma: Yana N qadam → ✓ Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach (yashil): Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium)
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pattern nima? | Sinab ko'rilgan yechim usuli | Ko'p uchraydigan muammo uchun; tayyor kod emas |
| MVC qaysi uchta so'zdan tuzilgan? | Model, View, Controller | Kodni vazifasi bo'yicha 3 qismga ajratish |
| Foydalanuvchi ko'radigan qism qaysi? | View | Sahifa, tugmalar, rasmlar |
| So'rovni qabul qilib, ishni yo'naltiradigan qism? | Controller | Nest'dagi controllerlar shu ishni qiladi |
| Ma'lumot va qoidalar bilan qaysi qism ishlaydi? | Model | Ma'lumotni esa Database saqlaydi |
| PostgreSQL — Model'ning o'zimi? | Yo'q | Database saqlaydi, Model u bilan ishlaydi |
| MVC'da so'rovni birinchi kim qabul qiladi? | Controller | Keyin Model'dan ma'lumot olib, View'ga beradi |
| MVC va monolit/mikroservis — bitta savolmi? | Yo'q, ikki xil | MVC — ilova ichi; monolit/mikroservis — tizim qanday bo'lingani |
| Hamma asosiy qism bitta ilovada — bu nima? | Monolit | Sodda, tez boshlanadi |
| Bir nechta alohida xizmatdan tuzilgan tizim? | Mikroservis | Har xizmat alohida ishlaydi va joylashtiriladi |
| Yangi kichik loyiha uchun ko'pincha nima qulay? | Monolit | Soddadan boshlang — kerak bo'lsa keyin bo'linadi |
| Yuk ko'payganda xizmat imkoniyatini oshirish nima deyiladi? | Miqyoslash (scaling) | Masalan, band xizmatga yana bir nusxa qo'shish |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Patternlarni o'rgandingiz (yonida: N/5 to'g'ri)
- Sarlavha: Endi tizimni pattern bilan ta'riflaysiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - Pattern — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli
  - MVC: View — ko'rsatadi, Controller — yo'naltiradi, Model — ma'lumot va qoidalar bilan ishlaydi
  - Database (PostgreSQL) ma'lumotni saqlaydi — Model u bilan ishlaydi
  - MVC — ilova ichi; monolit yoki mikroservis — tizim qanday bo'lingani
  - Kichik loyiha — ko'pincha monolit; tizim va jamoa kattalashsa, ayrim qismlar alohida xizmatga ajratiladi
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Ta'riflang** — loyihangiz monolitmi yoki mikroservismi? Ichi MVC bo'yicha qanday tartiblangan?
  - **Moslang** — kod bo'laklaringizni View / Controller / Model'ga ajrating
  - **Qaror** — loyihangizga monolit yetadimi? Nega?
  - Keyingi dars — AI-agent: u ham tizimning bir qismi. Arxitekturada qayerda turadi?
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4 · bosilganda: Badges — N/4 (har nishon nomi; olinmagani qulf bilan)
- **Role Mapper** — Kod bo'laklarini View, Controller va Model'ga to'g'ri joyladingiz (6-ekran)
- **Right Size** — Monolit va mikroservisni tavsifdan ajratdingiz (12-ekran)
- **Split Smart** — Qachon xizmatlarga bo'lish foydali ekanini bildingiz (14-ekran)
- **Request Flow** — MVC'da so'rov yo'lini to'g'ri tizdingiz (15-ekran)
- Nishon yozuvlari (6 va 12-ekranda): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. View — ko'rinish (4-ekran)
   - Foydalanuvchi ko'radigan qism — Sahifa, tugmalar, rasmlar.
   - Ko'rsatadi — Qoidalar **boshqa qismda**.
   - V = View — MVC'ning V harfi.
   - Sinfga savol: Foydalanuvchi ko'radigan qism qaysi?
2. Model — ma'lumot va qoidalar (8-ekran)
   - Ma'lumot va qoidalar — **Model** ma'lumot qanday bo'lishini va u bilan qanday ishlashni belgilaydi.
   - Database — Model emas — PostgreSQL **saqlaydi**, Model u bilan ishlaydi.
   - Backend'da turgan kod doim Controller emas — Qoidalar **Model**'da.
   - Sinfga savol: «Narx manfiy bo'lmasin» qoidasi qaysi qismda turadi?
3. Kichik loyiha — ko'pincha monolit (11-ekran)
   - Soddadan boshlang — Kichik loyiha uchun **monolit** sodda, tez va arzon.
   - Ortiqcha murakkablashtirmang — Mikroservis kichik loyihaga **murakkablik** qo'shadi.
   - Keyin bo'lasiz — Kerak bo'lsa, monolitni keyinroq bo'lish mumkin.
   - Sinfga savol: Kichik jamoa, yangi loyiha — nima qulay?
4. Mikroservis qachon foydali (14-ekran)
   - Jamoa ko'p — Har jamoa o'z xizmatini **alohida yangilaydi**.
   - Yuk bir qismda — O'sha xizmatni alohida kuchaytirasiz — **miqyoslash**.
   - Xato kamroq tarqaladi — Bitta xizmatdagi muammo **butun tizimga kamroq** ta'sir qiladi.
   - Sinfga savol: Qaysi holatlarda tizimni xizmatlarga bo'lish foydali bo'lishi mumkin?
5. MVC'da so'rov yo'li (15-ekran)
   - So'rov — Controller'ga — So'rovni **Controller** qabul qiladi.
   - Controller — Model'dan — Controller **Model**'dan ma'lumot oladi.
   - Natija — View'da — Natija **View**'da ko'rinadi.
     - Chizma: So'rov → Controller → Model → View → Javob
   - Sinfga savol: Nega bu tuzilmada View ma'lumotni Model'dan o'zi olmaydi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: MVC · Controller · monolit · Model · mikroservis · View · so'rov→amal · scaling · Database · xizmat · PostgreSQL

1. MVC'da foydalanuvchi ko'radigan qism qaysi?
   - ✔ View — ko'rinish
   - Controller — yo'naltiruvchi
   - Model — ma'lumot va qoidalar
   - Hech qaysi qism mos emas
2. Ma'lumot va uning qoidalari bilan MVC'ning qaysi qismi ishlaydi?
   - View — ma'lumotni ko'rsatadi
   - ✔ Model — ma'lumot va qoidalar
   - Controller — so'rovni yo'naltiradi
   - MVC'dan butunlay tashqarida
3. So'rovni qabul qilib, ishni yo'naltiradigan qism qaysi?
   - View — ko'rinish
   - Model — ma'lumot va qoidalar
   - ✔ Controller — yo'naltiruvchi
   - Database — PostgreSQL
4. «Hamma asosiy qism bitta ilovada» — bu qaysi usul?
   - Mikroservis
   - MVC
   - Frontend
   - ✔ Monolit
5. Alohida ishlaydigan va alohida joylashtiriladigan bir nechta xizmat — bu?
   - ✔ Mikroservis
   - Monolit
   - MVC
   - Frontend
6. Kichik yangi loyiha, jamoa kichik. Ko'pincha nima qulay?
   - Mikroservis — zamonaviyroq
   - ✔ Monolit — soddadan boshlang
   - Ikkalasini birga ishlatish
   - Hech qaysi usul kerak emas
7. MVC'da so'rovni birinchi bo'lib kim qabul qiladi?
   - Model
   - View
   - ✔ Controller
   - Database
8. Yuk ko'p tushgan xizmatga yana bir nusxa qo'shish nima deyiladi?
   - Qayta yozish
   - Joylashtirish (deploy)
   - Xatoni tuzatish
   - ✔ Miqyoslash (scaling)
9. Pattern nima?
   - ✔ Muammoning sinab ko'rilgan yechim usuli
   - Yangi bir dasturlash tili nomi
   - Database'ning bir turi
   - Tayyor ko'chirib olinadigan kod
10. PostgreSQL MVC tuzilmasida nima qiladi?
    - Controller'ning o'zi — so'rovni boshqaradi
    - ✔ Ma'lumotni saqlaydi — Model u bilan ishlaydi
    - View'ning o'zi — sahifani ko'rsatadi
    - Model'ning o'zi — boshqa narsa kerak emas
11. Mikroservisning asosiy foydasi nimada?
    - Soddalik va arzonlik
    - Hammasi bitta katta faylda
    - ✔ Qismlarni alohida kuchaytirish
    - Kod yozish shart emasligi
12. Nest'dagi controller MVC'da qaysi qism?
    - View — ko'rinish
    - Model — ma'lumot va qoidalar
    - Database — ma'lumot saqlash
    - ✔ Controller — yo'naltiruvchi
- Arena yozuvlari: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish
