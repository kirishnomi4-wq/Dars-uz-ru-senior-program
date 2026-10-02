# 6-Modul (LMS: 8-Modul) · 3-dars «Arxitektura patternlari» — YANGI MATN (v2)

Fayl: `src/6-Modull/ArchPatternsLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `03-ArchPatterns-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=4-variant, s8=2, s11=1, s14=3; arena 1-2-3-4 aylanma) — faqat matn.

---

## A. Darsning 5 ta tayanch fikri (dars bo'yi shu va faqat shu)

1. **Pattern** — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli. U tayyor kod emas.
2. **MVC** — kodni vazifasi bo'yicha 3 qismga ajratish usuli: **View** ko'rsatadi · **Controller** yo'naltiradi · **Model** ma'lumot va qoidalar bilan ishlaydi.
3. **Baza (PostgreSQL) — Model emas.** Baza ma'lumotni saqlaydi, Model u bilan ishlaydi. (1-dars bilan bir xil: «Database saqlaydi»)
4. **Ikki xil savol:** MVC — bitta ilova *ichidagi* tartib. Monolit yoki mikroservis — tizim *nechta ilovaga* bo'lingani.
5. **Tanlov formulasi yo'q:** kichik loyihada monolit ko'pincha qulay; tizim va jamoa kattalashsa, ayrim qismlarni alohida xizmatga ajratish foydali bo'lishi mumkin.

**Metafora (1-dars qoidasi):** faqat 3-ekranda, bir marta — va yangisi emas, o'quvchi 4a-Modulda Nest'ni o'rgangan **oshxona**:
ofitsiant = Controller · oshpaz va retseptlar = Model · ombor = baza · zal va menyu = View.
Shahar / idora / bino / mahalla / filial — dars bo'yi olib tashlanadi.

---

## 0 · Kirish — 100 ta fayl  `[683]`
- Eyebrow: Dars · kirish
- Sarlavha: **Loyiha o'sdi — 100 ta fayl. Yangi dasturchi qayerdan boshlaydi?**
- Mentor: 1-darsda tizimning qismlarini ko'rdik. Lekin har bir qismning ichida ham kod ko'payib boradi. Tugmani bosing — ikki xil loyiha tuzilishini solishtiring.
- Tugma: ▶ Ikki loyihani ko'rish → ✓ Solishtirildi
- Papkalar: ❌ tartibsiz/ — `index.js` · `kod2.js` · `stuff.js` · `final_ROST.js` · `yana_bir.js …` · ✅ tartibli/ — `views/` // ko'rinish · `controllers/` // yo'naltirish · `models/` // ma'lumot
- Savol: **Qaysisida tez ishlaydi?**
  - Tartibsizda — fayl ko'p bo'lsa, kuchli loyiha
  - Tartiblida — har narsa o'z joyida, darrov topiladi
  - Farqi yo'q — ikkalasi bir xil
- Javob — 2-variant: **Aynan!** Tartibli loyihada har bir fayl o'z vazifasi bo'yicha joylashgan. Bunday tartibning sinab ko'rilgan usullari bor — ularni **pattern** deyishadi. Bugun eng mashhurlaridan biri — **MVC**, keyin tizimni bo'lish usullari — **monolit** va **mikroservis** bilan tanishamiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin 100 ta fayl orasidan keraklisini tartibsiz loyihada topish ancha qiyin. Tartibli loyihada har bir fayl o'z vazifasi bo'yicha joylashgan. Bunday tartibning sinab ko'rilgan usullari bor — ularni **pattern** deyishadi.

✎ 🔴 FAKT: «o'tgan darsda ko'rdik» → «1-darsda» (o'tgan dars — PM darsi, komponentlar 1-darsda edi) · javob tanlovga qarab ikki xil · `controllers/` izohi «mantiq» → «yo'naltirish» (qoidalar Model'da)

## 1 · Reja  `[732]`
- Sarlavha: **Kodni tartiblashning tanilgan usuli — arxitektura patterni.**
- Mentor: 1-darsda tizimning qismlarini ko'rdingiz. Bugun ularni tartibli tuzishning sinab ko'rilgan usullarini o'rganamiz. Yaxshi xabar: Nest darslarida Controller yozganingizda, siz shu usullardan birini allaqachon ishlatgansiz.
- Blok: dars oxirida shuni ayta olasiz → «Mening loyiham — bitta ilova (monolit), ichi MVC bo'yicha tuzilgan.» — bir jumla, boshqa dasturchi darrov tushunadi.
- Bugungi 4 qadam:
  1. MVC — 3 qism: Model, View, Controller · *mvc*
  2. Mini-do'koningizning kodi qaysi qismga tushadi · *moslash*
  3. Monolit va mikroservis — qachon qaysi biri qulay · *tizimni bo'lish*
  4. Tizimni bir jumlada ta'riflash · *bir jumla*

✎ Yakuniy jumladan «React (View), Nest (Controller), PostgreSQL (Model)» tengligi olib tashlandi · «ko'lam» → «tizimni bo'lish»

## 2 · Pattern nima  `[768]`
- Sarlavha: **Pattern — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli.**
- Mentor: Ko'p dasturchilar bir xil muammoga duch keladi. Ular yillar davomida sinab ko'rgan yechim usullariga nom berishgan — pattern shu. Tugmani bosing.
- Karta: 🧩 **Pattern nima?** — Tez-tez uchraydigan muammoni hal qilishning sinab ko'rilgan usuli. U tayyor kod emas: usulni bilasiz, kodni esa o'z loyihangizga moslab yozasiz.
- Tugma: Hayotdan misol? → ✓ Ko'rdingiz
- Misollar:
  - ⚽ **Futbolda:** 4-4-2 sxemasi — tanilgan usul, lekin har jamoa uni o'z o'yinchilariga moslaydi
  - 🏠 **Qurilishda:** sinalgan uy rejasi — har uyni noldan chizmaysiz, o'lchamini esa o'zingiz tanlaysiz
  - 💻 **Kodda:** MVC — kodni vazifasi bo'yicha 3 qismga ajratish usuli
- Xulosa: Pattern — umumiy til ham. «MVC» desangiz, boshqa dasturchilar kodingiz qanday tuzilganini tez tushunadi.

✎ «Uni o'zingiz ixtiro qilmaysiz — tayyorini olasiz» olib tashlandi (pattern ko'chiriladigan kod emas) · «tayyor mahalla rejasi» → futbol sxemasi (o'smir uchun tanish, «moslab ishlatiladi» degan fikrni aniq ko'rsatadi) · «dunyodagi har bir dasturchi» → «boshqa dasturchilar»

## 3 · MVC — 3 qism  `[800]`
- Eyebrow: Pattern · MVC
- Sarlavha: **MVC — kodni vazifasi bo'yicha 3 qismga ajratish usuli.**
- Mentor: MVC — Model, View, Controller. Nest darslaridagi oshxonani eslang: ofitsiant buyurtmani oladi, oshpaz retsept bo'yicha tayyorlaydi, masalliq omborda turadi. MVC ham xuddi shunday bo'lingan. Har bir qismni bosing.
- Qismlar:
  - **View** · ko'rinish — Foydalanuvchi ko'radigan qism: sahifa, tugmalar, rasmlar. Ma'lumotni ko'rsatadi. Bizning loyihada bu vazifani asosan React bajaradi. · *Oshxonada: mijoz ko'radigan zal va menyu*
  - **Controller** · yo'naltiruvchi — So'rovni qabul qiladi va ishni yo'naltiradi: Model'dan ma'lumot so'raydi, natijani View'ga beradi. Nest'dagi controllerlar aynan shu ishni qiladi. · *Oshxonada: ofitsiant*
  - **Model** · ma'lumot va qoidalar — Ma'lumot qanday bo'lishini va u bilan qanday ishlashni belgilaydi: masalan, mahsulotda nomi va narxi bo'lishi, narx manfiy bo'lmasligi. · *Oshxonada: oshpaz va retseptlar*
- Muhim: 🗄️ **Baza (PostgreSQL) — Model emas.** Baza ma'lumotni saqlaydi, Model esa u bilan ishlaydi. *Oshxonada: ombor.*
- Xulosa: View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi. Baza esa ma'lumotni saqlaydi.

✎ 🔴 Eng muhim tuzatish: «Model — DB … Saqlaydi va beradi (Database)» → Model ≠ baza · «Controller — Backend mantiqi» → «Nest'dagi controllerlar» (Nest'ning o'zi emas) · Peshtoq/Dispetcher/Arxiv → o'quvchi 4a-Modulda o'rgangan oshxona obrazi, bir marta · «biznes-mantiq», «DB» olib tashlandi

## 4 · 1-savol ✅  `[835]`
- Savol: **MVC'da foydalanuvchi ko'radigan qism qaysi?**
  - Controller — so'rovni yo'naltiradi
  - Model — ma'lumot bilan ishlaydi
  - Hech qaysi — bu MVC'ga kirmaydi
  - ✔ View — sahifa va tugmalar
- To'g'ri: To'g'ri! View — foydalanuvchi ko'radigan qism: sahifa, tugmalar, rasmlar. U ma'lumotni ko'rsatadi, qoidalar esa boshqa qismda.
- Xato izohlari:
  - Controller so'rovni yo'naltiradi, lekin foydalanuvchiga ko'rinmaydi. Ko'rinadigan qism — View.
  - Model ma'lumot va qoidalar bilan ishlaydi, u ko'rinmaydi. Ko'rinadigan qism — View.
  - Aksincha — ko'rinadigan qism aynan MVC'ning V harfi, View.
  - (umumiy) Ko'rinadigan qism — View.

✎ To'g'ri javob endi eng uzun va yagona qavsli variant emas

## 5 · MVC'da so'rov yo'li  `[855]`
- Eyebrow: Animatsiya · so'rov yo'li
- Sarlavha: **So'rovni avval Controller qabul qiladi.**
- Mentor: Biz o'rganayotgan MVC tuzilmasida so'rovni avval Controller qabul qiladi va ishni yo'naltiradi. Tugmani bosib, so'rov qismlar orasida qanday yurishini kuzating.
- Sxema: 🖥️ View *ko'rinish* — 🎮 Controller *yo'naltiruvchi* — 🗄️ Model *ma'lumot*
- Qadamlar:
  1. Foydalanuvchi «Mahsulotlar» tugmasini bosdi → so'rovni Controller qabul qildi.
  2. Controller Model'dan mahsulotlar ro'yxatini so'radi.
  3. Model ro'yxatni bazadan (PostgreSQL) olib, Controller'ga qaytardi.
  4. Controller natijani View'ga berdi: «buni ko'rsat».
  5. View foydalanuvchiga mahsulotlar ro'yxatini ko'rsatdi ✨
- Xulosa: Ko'rdingizmi? So'rov Controller → Model → View yo'li bilan yurdi. Bu tuzilmada View ma'lumotni Model'dan o'zi olmaydi — Controller orqali oladi. Shuning uchun har bir ish o'z joyida qoladi.

✎ «Controller — markazda turadi va hammasini bog'laydi» → «so'rovni avval Controller qabul qiladi» · «har doim», «hech qachon» → «biz o'rganayotgan tuzilmada» · 3-qadamda Model va baza ajratildi

## 6 · Mini-do'koningiz — MVC (nishon)  `[892]`
- Eyebrow: Moslash · mini-do'kon
- Sarlavha: **Mini-do'koningizning kodi qaysi qismga tushadi?**
- Mentor: MVC — texnologiyalar emas, kodning vazifalari. Shuning uchun React, Nest yoki PostgreSQL'ni emas, kod bo'laklarini joylaymiz. Har bir bo'lakni mos qismga joylang.
- Bo'laklar:
  1. 🖥️ Mahsulotlar ro'yxatini chiqaradigan React sahifa → **View**
  2. ⚙️ Nest'dagi controller — `/products` so'rovini qabul qiladigan kod → **Controller**
  3. 🗄️ Mahsulotda nomi va narxi bo'lishini belgilaydigan va uni bazadan o'qiydigan kod → **Model**
- Tugmalar: qaysi MVC qismi? — View · Controller · Model
- Xato: Bu qism mos emas — kod bo'lagi nima ish qilishini o'ylang va qayta tanlang.
- Muvaffaqiyat: Hammasi to'g'ri! Sahifa — View, so'rovni qabul qiladigan kod — Controller, ma'lumot va qoidalar bilan ishlaydigan kod — Model. PostgreSQL esa ma'lumotni saqlaydi, Model u bilan ishlaydi. Mini-do'koningiz MVC bo'yicha tuzilgan!

✎ 🔴 «Frontend = View, Backend = Controller, Database = Model» tengligi butunlay olib tashlandi — endi texnologiya emas, kod bo'laklari joylanadi

## 7 · Nega pattern  `[935]`
- Sarlavha: **Pattern bo'yicha qurish nega foydali?**
- Mentor: Pattern shunchaki «chiroyli tartib» emas — u amaliy foyda beradi. Har foydani bosing.
  - **Tartib** — Har bir kod o'z joyida: qaysi kod qayerda ekanini bilasiz.
  - **Jamoa** — Bir kishi View'da, boshqasi Model'da ishlaydi — bir-biriga kam xalaqit beradi.
  - **AI bilan ishlash** — Pattern nomini aytsangiz, AI'ga loyihangiz qanday tuzilganini tushuntirish osonroq bo'ladi.
  - **Xatoni topish** — Ma'lumot xato bo'lsa — avval Model'ga qaraysiz. Sahifa buzuq bo'lsa — View'ga. Xatoni tezroq topasiz.
- Xulosa: Pattern — tartib, jamoaviy ish, AI bilan oson muloqot va xatoni tez topish. Shuning uchun katta loyihalarda kodni tartibli tuzish uchun patternlardan foydalaniladi.

✎ «AI darrov to'g'ri joyga yozadi» (ortiqcha va'da) → «tushuntirish osonroq» · «haqiqiy loyihalar doim pattern bo'yicha quriladi» → «katta loyihalarda … foydalaniladi» · «Bug» → «Xato»

## 8 · 2-savol ✅  `[973]`
- Savol: **Nest backend'dagi «narx manfiy bo'lmasin» qoidasini tekshirib, mahsulotni bazaga yozadigan kod — MVC'ning qaysi qismi?**
  - View — chunki natija sahifada ko'rinadi
  - ✔ Model — ma'lumot va uning qoidalari
  - Controller — chunki kod backend'da turibdi
  - Hech qaysi — bu kod MVC'dan tashqarida
- To'g'ri: To'g'ri! Ma'lumot qanday bo'lishi va qanday qoidalar bilan ishlanishi — Model'ning vazifasi. Controller so'rovni qabul qilib, shu kodni chaqiradi. Ma'lumotni esa baza (PostgreSQL) saqlaydi.
- Xato izohlari:
  - Natija sahifada ko'rinadi, lekin qoidani View tekshirmaydi — u faqat ko'rsatadi.
  - Kod backend'da turgani uni Controller qilmaydi: Controller so'rovni qabul qilib yo'naltiradi, qoidalar esa Model'da.
  - Aksincha — ma'lumot va qoidalar aynan MVC'ning M harfi, Model.
  - (umumiy) Ma'lumot va qoidalar — Model.

✎ 🔴 Savol almashdi. Oldin «PostgreSQL bazasi MVC'da qaysi rol? ✔ Model» — «baza = Model» xatosini **ball bilan** mustahkamlardi. Endi savol shu xatoni tutadi: «backend'da turibdi → Controller» ham tuzoq-variant

## 9 · Monolit  `[993]`
- Eyebrow: Tizimni bo'lish · monolit
- Sarlavha: **Monolit — hamma asosiy qism bitta ilovada.**
- Mentor: Diqqat, bu boshqa savol. MVC — bitta ilova ichidagi kod qanday tartiblanishi haqida. Monolit va mikroservis esa butun tizim nechta alohida ilovaga bo'linishi haqida. Tugmani bosing.
- Rasm-blok: 🏢 mini-do'kon — mahsulotlar, savat, to'lov, foydalanuvchilar — hammasi bitta backend ilovasida
- Tugma: Plus va minusi? → ✓ Ko'rdingiz
- Ochilgach:
  - Ko'p loyihalar monolitdan boshlanadi — bu normal va to'g'ri.
  - ✅ **Plus:** sodda, tez boshlanadi, bitta joyga joylashtiriladi, tushunish oson. *(Joylashtirish, inglizcha deploy — ilovani internetda ishlaydigan qilib serverga qo'yish.)*
  - ⚠️ **Minus:** ilova juda kattalashsa, uni o'zgartirish og'irlashadi; bitta qismdagi jiddiy xato butun ilovani to'xtatib qo'yishi mumkin.

✎ «ikki xil savol» fikri endi alohida jumla bilan (tayanch fikr 4) · «bitta binoda joylashgan katta idora» olib tashlandi · 🔴 FAKT: «Frontend + Backend + Baza — hammasi bitta loyihada» → «bitta backend ilovasida» (monolit — backend haqida; baza va frontend odatda alohida ishlaydi) · deploy birinchi uchragan joyida izohlandi

## 10 · Mikroservis  `[1024]`
- Eyebrow: Tizimni bo'lish · mikroservis
- Sarlavha: **Mikroservis — tizim bir nechta alohida xizmatga bo'lingan.**
- Mentor: Tizim va jamoa kattalashganda, ayrim qismlarni alohida xizmatga ajratish foydali bo'lishi mumkin. Har bir xizmat o'z ishini qiladi. Tugmani bosib, monolit qanday bo'linishini ko'ring.
- Bo'lingach: Mahsulotlar · To'lov · Yetkazish · Foydalanuvchi — har birida «alohida»
  - Har xizmat alohida ishlaydi, alohida joylashtiriladi, ko'pincha unga alohida jamoa qaraydi.
  - ✅ **Plus:** yuk ko'p tushgan xizmatni alohida kuchaytirish mumkin — buni **miqyoslash** (scaling) deyishadi; bitta xizmatdagi xato butun tizimga kamroq ta'sir qiladi; katta jamoalar bir-biriga xalaqit bermay ishlaydi.
  - ⚠️ **Minus:** murakkab — xizmatlar bir-biri bilan tarmoq orqali gaplashadi, ularni kuzatish va sozlash qiyinlashadi; kichik loyiha uchun ortiqcha.

✎ «Tizim juda kattalashganda … ajratamiz» → «foydali bo'lishi mumkin» · «bitta xato faqat o'z xizmatini to'xtatadi» → «butun tizimga kamroq ta'sir qiladi» · miqyoslash shu yerda birinchi marta izoh bilan (oldin faqat kartochkada edi) · «idoralar mahallasi» olib tashlandi

## 11 · 3-savol ✅  `[1059]`
- Savol: **Yangi, kichik loyiha, jamoada 2 kishi. Qaysi biri qulayroq?**
  - ✔ Monolit — sodda, keyin bo'lish ham mumkin
  - Mikroservis — zamonaviy, shuning uchun doim yaxshi
  - Ikkalasini birga — har ehtimolga qarshi ishonch
  - Farqi yo'q — xohlaganini tanlasa bo'ladi
- To'g'ri: To'g'ri! Kichik loyiha va kichik jamoa uchun monolit ko'pincha eng qulay: sodda, tez va arzon. Mikroservis murakkablik qo'shadi — u tizim va jamoa kattalashganda foydali bo'lishi mumkin. «Ortiqcha murakkablashtirmang» — dasturchilarning mashhur qoidasi.
- Xato izohlari:
  - Mikroservis doim yaxshi emas — kichik loyiha uchun u ortiqcha murakkablik.
  - Ikkalasini birga qilish — eng murakkab yo'l. Soddadan boshlang.
  - Farqi bor: kichik loyihada monolit ancha qulay.
  - (umumiy) Kichik loyiha — ko'pincha monolit. Soddadan boshlang.

✎ «u faqat tizim juda kattalashganda kerak», «aniq to'g'ri tanlov» → yumshatildi · variantlar tenglashtirildi (oldin to'g'risi eng uzuni edi)

## 12 · Tizimni ajrating (nishon)  `[1079]`
- Eyebrow: Hayotiy · tizimni ajrating
- Sarlavha: **Tizim tavsifini o'qing: monolitmi yoki mikroservismi?**
- Mentor: Arxitektor tizim tavsifini o'qib, u qanday tuzilganini aytadi. Har bir tizimni o'qing va tanlang.
- Kartalar:
  1. Kichik mini-do'kon: React sahifalar, bitta Nest backend va bitta baza. → Monolit
  2. Katta onlayn bozor: to'lov, qidiruv, yetkazib berish — har biri alohida xizmat, har biriga alohida jamoa qaraydi. → Mikroservis
  3. Yangi loyihaning birinchi sodda varianti (MVP — ishlaydigan eng sodda birinchi versiya): tezda bitta ilova kerak, jamoa 2 kishi. → Monolit
- Tugmalar: qaysi usul? — 🏢 Monolit · bitta ilova · 🧩 Mikroservis · alohida xizmatlar
- Xato: Qaytadan o'ylang: hammasi bitta ilovadami yoki alohida xizmatlarga bo'linganmi?
- Muvaffaqiyat: Barchasi to'g'ri! Endi tizim tavsifini o'qib, u qanday tuzilganini ayta olasiz.
- Tugma: Ajrating (0/3) → Davom etish

✎ «tasniflang» → «ajrating» · «marketplace» → «onlayn bozor» · «startap» olib tashlandi · MVP izohlandi (MATN_ETALONI qoidasi: har darsda birinchi ko'rinishda izoh)

## 13 · Bir jumlada  `[1119]`
- Eyebrow: Bir jumlada
- Sarlavha: **Tizimingizni bir jumlada ta'riflang.**
- Mentor: Pattern nomlari — dasturchilarning umumiy tili. Tizimingizni 100 ta fayl orqali emas, bir nechta tanish so'z bilan tushuntirasiz. Tugmani bosing.
- 🙈 **Patternsiz** — «Bu yerda fayl bor, u boshqasini chaqiradi, keyin bazaga…» — uzoq, chalkash.
- Tugma: Pattern bilan-chi? → ✓ Ko'rdingiz
- 🎯 **Pattern bilan** — «Mini-do'kon — monolit. Ichi MVC bo'yicha: View — React sahifalari, Controller — Nest controllerlari, Model — ma'lumot va qoidalar kodi. Ma'lumot PostgreSQL'da saqlanadi.» → Qisqa va aniq. Boshqa dasturchi ham, AI ham tizimni tezroq tushunadi.
- Xulosa: Yangi loyihani AI bilan boshlaganda ham shu jumladan boshlang — AI'ga loyiha tuzilishini tushuntirish osonroq bo'ladi. AI yozgan kodni esa baribir o'zingiz tekshirasiz.

✎ «AI … to'g'ri tuzilishni darrov yaratadi» (ortiqcha va'da) → «tushuntirish osonroq» + «o'zingiz tekshirasiz» · «Mahorat · til» eyebrow → «Bir jumlada»

## 14 · 4-savol ✅  `[1151]`
- Savol: **Katta onlayn do'kon: 5 ta jamoa ishlaydi, bayramlarda to'lov qismiga yuk bir necha barobar oshadi. Qaysi usul mosroq bo'lishi mumkin?**
  - Monolit — hammasi bitta ilovada qolsin
  - Hech qanday usul kerak emas — shunday qolsin
  - ✔ Mikroservis — to'lovni alohida xizmat qilish
  - Faqat MVC — ichki tartib hammasini hal qiladi
- To'g'ri: To'g'ri! Bu holatda mikroservis mos bo'lishi mumkin: to'lov xizmatini alohida kuchaytirasiz, har jamoa o'z xizmatini alohida yangilaydi. Bunday qaror faqat foydalanuvchilar soniga qarab emas — jamoa, yuk va o'zgarishlarga qarab qilinadi.
- Xato izohlari:
  - Monolit ham ishlashi mumkin, lekin 5 jamoa bitta ilovada bir-biriga xalaqit beradi, to'lovni esa alohida kuchaytirib bo'lmaydi.
  - Aksincha — katta tizimda tuzilish juda muhim.
  - MVC — bitta ilovaning ichki tartibi. Tizimni qismlarga bo'lish esa boshqa savol.
  - (umumiy) Jamoa ko'p, yuk bir qismda — mikroservis mos kelishi mumkin.

✎ 🔴 «Million foydalanuvchi → mikroservis» formulasi olib tashlandi · savoldagi «alohida miqyoslanishi kerak» javobda so'zma-so'z takrorlanib, javobni ochib qo'yardi — endi vaziyat beriladi, o'quvchi o'zi xulosa qiladi · MVC-variant endi «ikki xil savol» fikrini tekshiradi

## 15 · So'rov yo'lini yig'ing ✅ (final, nishon)  `[1248]`
- Sarlavha: **Oxirgi qadam: MVC'da so'rov yo'lini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang.
- Bo'laklar: So'rov · Controller · Model · View · Foydalanuvchiga
- Joylar: birinchi nima keladi · kim qabul qiladi · ma'lumot qayerdan olinadi · qayerda ko'rsatiladi · oxiri kimga yetadi
- To'g'ri (bir marta): ✓ Yo'l tayyor: **So'rov → Controller → Model → View → Foydalanuvchiga**. MVC shu tartibda ishlaydi.
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang. Maslahat: so'rovni birinchi bo'lib kim qabul qiladi?

✎ 🔴 Mentor gapidagi javob olib tashlandi («Eslang: so'rov Dispetcher (Controller) orqali o'tadi…» — final testni o'z-o'zidan yechardi) · to'g'ri javob matni ikki marta chiqardi → bir marta · uch xil xato-yozuv → bitta

## 16 · Amaliyot · Loyiha  `[2067]`
- Eyebrow: Amaliyot · Loyiha · joy: «AI yordamchida»
- Sarlavha: **O'z tizimingizni pattern bilan ta'riflang**
- Topshiriq: O'z loyihangizni (yoki mini-do'konni) arxitektura tili bilan bir jumlada ta'riflang. Hali kod yozmaysiz — faqat rejalashtirasiz.
- 💡 Esda tuting: bu yerda **ikki xil savol** bor. MVC — ilova ichidagi tartib. Monolit yoki mikroservis — tizim nechta ilovaga bo'lingani.
- Bosqichlar:
  1. **1-savol:** tizim qanday bo'lingan — bitta ilova (`monolit`) yoki alohida xizmatlar (`mikroservis`)?
  2. **2-savol:** ilova ichi qanday tartiblangan — qaysi kod `View`, qaysi `Controller`, qaysi `Model`?
  3. Nega shu tanlov: loyihangizga monolit yetadimi yoki mikroservis kerakmi?
  4. Bir band javob yozing: «Mening tizimim — …, chunki …»
- Tugmalar: o'zgarmaydi

✎ Ikki savol endi alohida bosqich (oldin bitta bosqichda «MVC monolit (yoki mikroservis)» deb aralash edi) · Peshtoq/Dispetcher/Arxiv olib tashlandi

## 17 · Natijalar (podium)  `[1813]` — o'zgarmaydi (umumiy shablon)

## 18 · Takrorlash (kartochkalar)  `[2094]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Pattern nima? | Sinab ko'rilgan yechim usuli | Ko'p uchraydigan muammo uchun; tayyor kod emas |
| MVC qaysi uchta so'zdan tuzilgan? | Model, View, Controller | Kodni vazifasi bo'yicha 3 qismga ajratish |
| Foydalanuvchi ko'radigan qism qaysi? | View | Sahifa, tugmalar, rasmlar |
| So'rovni qabul qilib, ishni yo'naltiradigan qism? | Controller | Nest'dagi controllerlar shu ishni qiladi |
| Ma'lumot va qoidalar bilan qaysi qism ishlaydi? | Model | Ma'lumotni esa baza saqlaydi |
| PostgreSQL — Model'ning o'zimi? | Yo'q | Baza saqlaydi, Model u bilan ishlaydi |
| MVC'da so'rovni birinchi kim qabul qiladi? | Controller | Keyin Model'dan ma'lumot olib, View'ga beradi |
| MVC va monolit/mikroservis — bitta savolmi? | Yo'q, ikki xil | MVC — ilova ichi; monolit/mikroservis — tizim qanday bo'lingani |
| Hamma asosiy qism bitta ilovada — bu nima? | Monolit | Sodda, tez boshlanadi |
| Bir nechta alohida xizmatdan tuzilgan tizim? | Mikroservis | Har xizmat alohida ishlaydi va joylashtiriladi |
| Yangi kichik loyiha uchun ko'pincha nima qulay? | Monolit | Soddadan boshlang — kerak bo'lsa keyin bo'linadi |
| Yuk ko'payganda xizmat imkoniyatini oshirish nima deyiladi? | Miqyoslash (scaling) | Masalan, band xizmatga yana bir nusxa qo'shish |

✎ Olib tashlandi: «Mikroservisda xato → faqat o'sha xizmat to'xtaydi» (noto'g'ri qat'iy) · «View qaror qiladimi?» · qo'shildi: «PostgreSQL — Model'mi?» va «ikki xil savol» kartalari

## 19 · Yakun  `[2107]`
- Sarlavha: **Endi tizimni pattern bilan ta'riflaysiz.**
- Endi siz bilasiz:
  - Pattern — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli
  - MVC: View — ko'rsatadi, Controller — yo'naltiradi, Model — ma'lumot va qoidalar bilan ishlaydi
  - Baza (PostgreSQL) ma'lumotni saqlaydi — Model u bilan ishlaydi
  - MVC — ilova ichi; monolit yoki mikroservis — tizim qanday bo'lingani
  - Kichik loyiha — ko'pincha monolit; tizim va jamoa kattalashsa, ayrim qismlar alohida xizmatga ajratiladi
- Uyga vazifa:
  - **Ta'riflang** — loyihangiz monolitmi yoki mikroservismi? Ichi MVC bo'yicha qanday tartiblangan?
  - **Moslang** — kod bo'laklaringizni View / Controller / Model'ga ajrating
  - **Qaror** — loyihangizga monolit yetadimi? Nega?
- 🚀 Keyingi dars — AI-agent: u ham tizimning bir qismi. Arxitekturada qayerda turadi? *(o'zgarmaydi — to'g'ri)*

✎ «Front=View, Back=Controller, DB=Model» xulosasi olib tashlandi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — shahar nomlari mavzuga moslanadi:
- 🧩 **Role Mapper** — kod bo'laklarini View, Controller va Model'ga to'g'ri joyladingiz (6)
- 📏 **Right Size** — monolit va mikroservisni tavsifdan ajratdingiz (12)
- ✂️ **Split Smart** — qachon xizmatlarga bo'lish foydali ekanini bildingiz (14)
- 🔁 **Request Flow** — MVC'da so'rov yo'lini to'g'ri tizdingiz (15)

**Qisqa takrorlash oynalari (5):**
1. (4) **View — ko'rinish:** Foydalanuvchi ko'radigan qism — sahifa, tugmalar, rasmlar. · Ko'rsatadi — qoidalar boshqa qismda. · V = View — MVC'ning V harfi. · Sinfga savol: Foydalanuvchi ko'radigan qism qaysi?
2. (8) **Model — ma'lumot va qoidalar:** Model ma'lumot qanday bo'lishini va u bilan qanday ishlashni belgilaydi. · Baza — Model emas: PostgreSQL saqlaydi, Model u bilan ishlaydi. · Backend'da turgan kod doim Controller emas — qoidalar Model'da. · Sinfga savol: «Narx manfiy bo'lmasin» qoidasi qaysi qismda turadi?
3. (11) **Kichik loyiha — ko'pincha monolit:** Soddadan boshlang — kichik loyiha uchun monolit sodda, tez va arzon. · Ortiqcha murakkablashtirmang — mikroservis kichik loyihaga murakkablik qo'shadi. · Keyin bo'lasiz — kerak bo'lsa, monolitni keyinroq bo'lish mumkin. · Sinfga savol: Kichik jamoa, yangi loyiha — nima qulay?
4. (14) **Mikroservis qachon foydali:** Jamoa ko'p — har jamoa o'z xizmatini alohida yangilaydi. · Yuk bir qismda — o'sha xizmatni alohida kuchaytirasiz (miqyoslash). · Xato kamroq tarqaladi — bitta xizmatdagi muammo butun tizimga kamroq ta'sir qiladi. · Sinfga savol: Qaysi holatlarda tizimni xizmatlarga bo'lish foydali bo'lishi mumkin?
5. (15) **MVC'da so'rov yo'li:** So'rovni Controller qabul qiladi. · Controller Model'dan ma'lumot oladi. · Natija View'da ko'rinadi. · 🙋 So'rov → 🎮 Controller → 🗄️ Model → 🖥️ View → ✨ Javob · Sinfga savol: Nega bu tuzilmada View ma'lumotni Model'dan o'zi olmaydi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. MVC'da foydalanuvchi ko'radigan qism qaysi? ✔ View — ko'rinish · Controller — yo'naltiruvchi · Model — ma'lumot va qoidalar · Hech qaysi qism mos emas
2. Ma'lumot va uning qoidalari bilan MVC'ning qaysi qismi ishlaydi? View — ma'lumotni ko'rsatadi · ✔ Model — ma'lumot va qoidalar · Controller — so'rovni yo'naltiradi · MVC'dan butunlay tashqarida
3. So'rovni qabul qilib, ishni yo'naltiradigan qism qaysi? View — ko'rinish · Model — ma'lumot va qoidalar · ✔ Controller — yo'naltiruvchi · Baza — PostgreSQL
4. «Hamma asosiy qism bitta ilovada» — bu qaysi usul? Mikroservis · MVC · Frontend · ✔ Monolit
5. Alohida ishlaydigan va alohida joylashtiriladigan bir nechta xizmat — bu? ✔ Mikroservis · Monolit · MVC · Frontend
6. Kichik yangi loyiha, jamoa kichik. Ko'pincha nima qulay? Mikroservis — zamonaviyroq · ✔ Monolit — soddadan boshlang · Ikkalasini birga ishlatish · Hech qaysi usul kerak emas
7. MVC'da so'rovni birinchi bo'lib kim qabul qiladi? Model · View · ✔ Controller · Baza
8. Yuk ko'p tushgan xizmatga yana bir nusxa qo'shish nima deyiladi? Qayta yozish · Joylashtirish (deploy) · Xatoni tuzatish · ✔ Miqyoslash (scaling)
9. Pattern nima? ✔ Muammoning sinab ko'rilgan yechim usuli · Yangi bir dasturlash tili nomi · Ma'lumotlar bazasining bir turi · Tayyor ko'chirib olinadigan kod
10. PostgreSQL MVC tuzilmasida nima qiladi? Controller'ning o'zi — so'rovni boshqaradi · ✔ Ma'lumotni saqlaydi — Model u bilan ishlaydi · View'ning o'zi — sahifani ko'rsatadi · Model'ning o'zi — boshqa narsa kerak emas
11. Mikroservisning asosiy foydasi nimada? Soddalik va arzonlik · Hammasi bitta katta faylda · ✔ Qismlarni alohida kuchaytirish · Kod yozish shart emasligi
12. Nest'dagi controller MVC'da qaysi qism? View — ko'rinish · Model — ma'lumot va qoidalar · Baza — ma'lumot saqlash · ✔ Controller — yo'naltiruvchi

✎ 2, 10, 12-savollar «baza = Model», «Nest = Controller» tengligini tutadigan qilib o'zgardi · 4 va 8-savollardagi darsda o'tilmagan inglizcha variantlar (Serverless, Peer-to-peer, Refactoring, Debugging) o'zbekcha yoki o'tilgan atamaga almashdi · 9-savolga «tayyor ko'chiriladigan kod» tuzoq-varianti qo'shildi

---

## B. Siz hal qiladigan bitta savol
- **Metafora:** tavsiyam — 3-ekranda bir marta 4a-Moduldagi **oshxona** (o'quvchi Nest'ni shu obraz bilan o'rgangan, yangi obraz kiritilmaydi, «oshpaz ≠ ombor» Model va bazani aniq ajratadi).
  Muqobili — ChatGPT taklif qilgan «ofis». U yangi obraz bo'ladi va 1-darsdagi «boshqaruv markazi / arxiv» bilan yana aralashadi.
