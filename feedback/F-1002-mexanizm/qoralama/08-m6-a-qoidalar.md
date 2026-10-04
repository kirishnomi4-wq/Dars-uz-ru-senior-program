| Manba-ID | Qoida (bitta gap, o'zbek lotin, adabiy) | Qamrov | Tekshiruv | Manba |
|---|---|---|---|---|
| M6-01-A1 | Asosiy nom texnik atama (Frontend, Backend, Database, API, so'rov, javob); metafora faqat yordamchi: bir marta, «…ga o'xshatish mumkin» shaklida, keyin ishlatilmaydi. | hamma | ko'z | 01-SystemArchitecture-v2.md:12-13 |
| M6-01-A2a | Bir tushuncha — bir nom: odam = «foydalanuvchi», do'kon misolida xarid qiluvchi = «mijoz», «fuqaro» yo'q. | hamma | grep:fuqaro | 01:15 |
| M6-01-A2b | Backend texnologiyasi doim «Node.js (NestJS)» deb yoziladi. | m6 | grep:NestJS | 01:15 |
| M6-01-A2c | «Idora/bino» o'rniga «qism», «darvoza» o'rniga «kirish yo'li», «ariza» o'rniga «so'rov» deyiladi. | m6 | grep:idora\|bino\|darvoza\|ariza | 01:15-16 |
| M6-01-A3 | Qat'iy gap yumshatiladi: «hech qachon / faqat / har doim» o'rniga «bizning tizimda», «odatda», «doimiy saqlamaydi». | hamma | grep:hech qachon\|har doim | 01:17 |
| M6-01-A4a | Qiyin so'zlar almashtiriladi: slot → joy, skelet → tuzilma, capstone → «13-dars, Loyiha kuni», reyestr → yo'q. | hamma | grep:slot\|skelet\|capstone\|reyestr | 01:18 |
| M6-01-A4b | «Pattern» o'chirilmaydi (3-dars nomi), lekin «sinab ko'rilgan usul (tayyor kod emas)» deb izohlanadi. | m6 | ko'z | 01:18-19 |
| M6-01-A5 | Test variantlari taxminan bir xil uzunlikda; har xato variant ham ishonarli sabab bilan yoziladi, faqat to'g'ri javobda sabab bo'lmaydi. | hamma | ekran:test variantlari uzunligi | 01:20 |
| M6-01-A6 | Hook: to'g'ri javobga «Aynan!», boshqalariga neytral «Qiziq fikr!» — o'quvchi uyaltirilmaydi, xato ham «to'g'ri» deyilmaydi. | hamma | grep:Aynan!\|Qiziq fikr! | 01:21 |
| M6-02-§G | Dars bo'yi bitta g'oya: bitta gapni har kim boshqacha tushunadi, shuning uchun fikr yozib aniqlashtiriladi; taxmin noto'g'ri qurishga olib keladi. | m6 | ko'z | 02-PmLesson22-v2.md:12-13 |
| M6-02-§K | To'rt katak savollari dars bo'yi aynan bir xil: Muammo (nima qiynayapti), Kim, Yechim (nima quriladi), O'lchov (qaysi sondan bilamiz). | m6 | grep:Muammo\|Kim\|Yechim\|O'lchov | 02:15-18 |
| M6-03-A1 | «Pattern» — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli; tayyor kod emas. | m6 | ko'z | 03-ArchPatterns-v2.md:12 |
| M6-03-A2 | MVC kodni vazifasi bo'yicha 3 qismga ajratadi: View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi. | m6 | grep:View\|Controller\|Model | 03:13 |
| M6-03-A3 | Baza (PostgreSQL) Model emas: baza saqlaydi, Model u bilan ishlaydi (1-dars «Database saqlaydi» bilan bir xil). | m6 | ko'z | 03:14 |
| M6-03-A4 | MVC — bitta ilova ichidagi tartib; monolit yoki mikroservis — tizim nechta ilovaga bo'lingani; ikki savol aralashtirilmaydi. | m6 | ko'z | 03:15 |
| M6-03-A5 | Tanlov formulasi yo'q: kichik loyihada monolit ko'pincha qulay, katta tizimda ayrim qismlarni ajratish foydali bo'lishi mumkin. | m6 | grep:har doim\|albatta | 03:16 |
| M6-03-M | Metafora faqat 3-ekranda, bir marta, oshxona (ofitsiant=Controller, oshpaz va retsept=Model, ombor=baza, zal va menyu=View); shahar/idora/bino/mahalla/filial olib tashlanadi. | m6 | grep:shahar\|mahalla\|filial | 03:18-19 |
| M6-04-A1 | Oddiy AI (chat) savolga javob beradi: matn yozadi, tarjima qiladi, tahlil qiladi. | m6 | ko'z | 04-AgentArchitecture-v2.md:12 |
| M6-04-A2 | AI-agent maqsad berilganda keyingi qadamni o'zi tanlaydi va siz bergan asboblar bilan bir necha qadamni bajaradi. | m6 | ko'z | 04:13 |
| M6-04-A3 | Tool (asbob) — agent chaqiradigan funksiya; qaysi toolni chaqirishni AI modeli tanlaydi, toolni backend kodingiz bajaradi. | m6 | grep:Tool\|asbob | 04:14 |
| M6-04-A4 | Vakolat chegarasi (inglizcha guardrail) agentga nima mumkin, nima mumkin emasligini belgilaydi. | m6 | grep:guardrail\|Vakolat chegarasi | 04:15 |
| M6-04-S | Sikl nomlari bot darslaridagidek o'zgarmaydi: Idrok (ko'rish) → Qaror (qadam tanlash) → Amal (asbobni ishlatish). | m6 | grep:Idrok\|Qaror\|Amal | 04:17 |
| M6-04-M | Misol-ip — mini-do'kon; shahar/idora/byuro olib tashlanadi; detektiv faqat 2-ekranda bir marta, ruxsatnoma 6-ekranda bir marta. | m6 | grep:shahar\|idora\|byuro\|detektiv | 04:18-19 |
| M6-05-A1 | Skill — bitta aniq vazifani qanday bajarishni tushuntiradigan qayta ishlatiladigan yozma yo'riqnoma; papkada saqlanadi, asosiy fayl `SKILL.md`. | m6 | grep:SKILL.md | 05-ClaudeSkills-v2.md:12 |
| M6-05-A2 | SKILL.md = frontmatter (`name` kichik harf/raqam/defis + `description` nima qiladi va qachon) + body (qadamlar va misol). | m6 | grep:frontmatter\|description | 05:13 |
| M6-05-A3 | Claude oldindan faqat har Skill'ning name va description'ini ko'radi, mos bo'lsa SKILL.md'ni to'liq o'qiydi, qo'shimcha fayllarni kerak bo'lsa ochadi (progressive disclosure). | m6 | grep:progressive disclosure | 05:14 |
| M6-05-A4 | Qarorni Claude qiladi, qat'iy mexanizm emas; aniq description Skill to'g'ri paytda ishlatilish ehtimolini oshiradi. | m6 | grep:ehtimol | 05:15 |
| M6-05-A5 | Skill natijani bir xil uslubga yaqinlashtiradi, lekin AI har safar so'zma-so'z bir xil yozmaydi. | m6 | grep:so'zma-so'z | 05:16 |
| M6-05-M | Metafora faqat «yo'riqnoma/qo'llanma» (2-ekranda bir marta); «super-kuch kartasi, qahramon, jihozlash, kuch yonadi» olib tashlanadi. | m6 | grep:super-kuch\|qahramon\|jihozla\|yonadi | 05:18 |
| M6-05-O | Markaziy o'yin saqlanadi: o'quvchi «Claude o'rnida» description'larga qarab Skill tanlaydi, chunki Claude aynan shunday ishlaydi. | m6 | ekran:Skill tanlash o'yini (7-ekran) | 05:19 |
| M6-06-B | Bosh savol dars bo'yi bitta: «Bu qaror kimga tegadi?»; «kim jabr ko'radi» olib tashlanadi. | m6 | grep:jabr | 06-PmLesson23-v2.md:13 |
| M6-06-C | Chegara — ilova qaysi ishni o'zi qilishi, qaysini odamga ko'rsatishi yoki umuman qilmasligi haqida oldindan qilingan qaror. | m6 | ko'z | 06:15 |
| M6-06-D | Uch daraja: o'zi qilaversin (narx ko'rsatish), odam tasdiqlagach qilsin (buyurtma bekor qilish), o'zi umuman qilmasin (pulni qaytarish). | m6 | grep:O'zi qilaversin | 06:16-18 |
| M6-06-E | O'quvchi yozadigan «…maydi» qoidalari faqat pastki ikki daraja haqida: ilova bu ishni o'zi qilmaydi. | m6 | grep:maydi | 06:20 |
| M6-06-F | Chegara ilova ishni o'zi qilib, u odamga tegsa, ayniqsa pul, bekor qilish, mijozga va'da kabi muhim ishda kerak; 10-ekran kodining ikki sharti shu. | m6 | ekran:10-ekran kod shartlari | 06:22 |
| M6-06-G | Bosh fikr: avtomatlashtirish foydali, lekin ba'zi ishda odam nazorati kerak; hammasini odamga topshirsangiz ish sekinlashadi. | m6 | ko'z | 06:24 |
| M6-07-A1 | Skill tuzilishi (fayl): `SKILL.md` = frontmatter + body; atamalar 5-dars v2 bilan bir xil. | m6 | ko'z | 07-WriteSkill-v2.md:10-12 |
| M6-07-A2 | `name` — kichik harf, raqam, defis (masalan `mijoz-javobi`); `description` — nima qiladi va qachon ishlatiladi, qisqa; «qanday» body'da. | m6 | grep:mijoz-javobi | 07:13-15 |
| M6-07-A3 | Body — oddiy matn, sarlavha va tuzilishni o'quvchi o'zi tanlaydi (masalan «# Mijozga javob»), ichida qadamlar va misol. | m6 | ko'z | 07:16 |
| M6-07-A4 | Skill yaratish jarayoni: Yoz → Sinab ko'r → Kamchilikni top → Tuzat → Qayta sinab ko'r; tuzilish va jarayon ikki alohida narsa, aralashtirilmaydi. | m6 | grep:Yoz | 07:18-19 |
| M6-07-A5 | Qoida: bitta Skill — bitta aniq vazifa. | m6 | ko'z | 07:21 |
| M6-07-A6 | Kafolat yo'q: yaxshi Skill natijani kutilganga yaqinlashtiradi, lekin AI har safar so'zma-so'z bir xil yozmaydi. | m6 | grep:so'zma-so'z | 07:22 |
| M6-07-M | Metafora yo'q: «super-kuch kartasi», «karta yondi / xira yondi», «mashg'ulot maydoni» olib tashlanadi; asosiy so'z — Skill. | m6 | grep:super-kuch\|xira yondi\|mashg'ulot maydoni | 07:23 |
| M6-08-A1 | Bosh fikr: alohida qismlar bir-biriga ma'lumot uzatsa bitta tizim bo'lib ishlaydi; bugun tayyor qismlarni ulaymiz va tekshiramiz. | m6 | ko'z | 08-PipelineProject-v2.md:12 |
| M6-08-A2 | Tizim ≠ pipeline: tizim — barcha qismlar birgalikda; pipeline — ma'lumot yoki ishning bir qismdan keyingisiga o'tish oqimi. | m6 | grep:pipeline | 08:13 |
| M6-08-A3 | Oqim bitta zanjir emas, Node.js'dan tarmoqlanadi: buyurtma oqimi (React→Node.js→PostgreSQL, so'ng Telegram), savol oqimi (React→Node.js→AI→javob). | m6 | ekran:oqim sxemasi | 08:14-23 |
| M6-08-A4 | AI bilan kod yozish sikli (asosiy formula): Prompt → AI kod → Test → Xato → Tuzat → Qayta test. | m6 | grep:Prompt → AI kod | 08:25 |
| M6-08-A5 | Kafolat yo'q: aniq prompt AI'ga kerakli kodni yozishga yordam beradi, lekin xatosiz kodni kafolatlamaydi, shuning uchun test qilinadi. | m6 | grep:kafolat | 08:26 |
| M6-08-A6 | Metafora «shahar» (Peshtoq/Hokimlik/Arxiv/Darvoza/Ekspert-byuro) butunlay olib tashlanadi; «Direktor» faqat 5-ekranda bir marta. | m6 | grep:Peshtoq\|Hokimlik\|Arxiv\|Ekspert-byuro | 08:27 |
| M6-09-A1 | React bilimi saqlanadi (komponent, props, state `useState`, JSX); «React bilimingiz» deyiladi, «ssenariy / tafakkur» yo'q. | m6 | grep:ssenariy\|tafakkur | 09-ReactNativeBasics-v2.md:12,19 |
| M6-09-A2 | Web → mobil mos komponentlar misol sifatida (tarjima emas): div→View, p/span→Text, CSS→StyleSheet. | m6 | grep:View\|StyleSheet | 09:13 |
| M6-09-A3 | Ishga tushirish: Expo → Expo Go → telefon; odatda telefon va kompyuter bitta Wi-Fi'da bo'lishi kerak, Expo Snack'da shart emas. | m6 | grep:Wi-Fi | 09:15 |
| M6-09-A4 | Amaliyot: View + Text → birinchi ekran. | m6 | ekran:amaliyot | 09:16 |
| M6-09-M | Metafora faqat 2-ekranda bir marta — sahna; gastrol, furgon, chipta, kostyum, replika, karkas, «shisha ortida» olib tashlanadi. | m6 | grep:gastrol\|furgon\|chipta\|kostyum\|replika\|karkas\|shisha ortida | 09:20 |
| M6-10-A1 | Markaz uchlik: FlatList → Navigatsiya (bosish → Tafsilot ekrani → orqaga) → fetch; Image, ScrollView, TextInput qisqa tanishuv. | m6 | ko'z | 10-ReactNativeApp-v2.md:12-13 |
| M6-10-A2 | AsyncStorage — qo'shimcha qisqa tanishuv: testi yo'q, amaliyotda ishlatilmaydi. | m6 | grep:AsyncStorage | 10:13 |
| M6-10-A3 | `Detail` faqat kodda, matnda «Tafsilot ekrani»; «tap» → bosish, «App oqimi» → ilova oqimi, «kontent/konteyner» → matn va rasm / quti. | m6 | grep:\btap\b\|App oqimi\|kontent\|konteyner | 10:16-17 |
| M6-10-A4 | «Ko'p eshik, bitta tizim» o'rniga «ko'p kirish yo'li, bitta tizim» (1-dars v2 bilan bir xil). | m6 | grep:ko'p eshik | 10:18 |
| M6-10-A5 | Backend manzili `/products` (backend darslari va 8-darsdagidek), `/mahsulotlar` emas. | m6 | grep:/mahsulotlar | 10:19 |
| M6-10-A6 | Navigatsiya: `navigate('Detail')` — boshqa ekranga o'tish; `goBack()` yoki «Orqaga» — qaytish; push/pop — dasta ostidagi holat, navigate odatda push qiladi. | m6 | grep:push\|pop\|goBack | 10:21-24 |
| M6-10-A7 | «Real ilova», «to'liq ishlaydigan ilova» o'rniga «asosiy oqimi ishladi» (yuklanish, xato, bo'sh holat hali yo'q). | m6 | grep:real ilova\|to'liq ishlaydigan | 10:26 |
| M6-10-M | Metafora faqat 5-ekranda — kartalar dastasi; teatr (massovka, sahna, backstage) olib tashlanadi. | m6 | grep:massovka\|backstage\|teatr | 10:27 |
| M6-11-A1 | Dars rejasi: mini-do'konning mobil ilovasi, 4 ekran; backend tayyor API (Node.js + PostgreSQL), yangi server qurilmaydi. | m6 | ko'z | 11-MobileAppPractice-v2.md:12-14 |
| M6-11-A2 | AI bilan qurish: aniq topshiriq → AI kod taklif qiladi → o'quvchi loyihaga qo'shib tekshiradi. | m6 | ko'z | 11:15 |
| M6-11-A3 | Xarid oqimi: Ro'yxat → Tafsilot → Savat → Buyurtma; 3-ekranda bir marta kod nomlari (List, Detail, Cart, Checkout) bilan tanishtiriladi, keyin faqat o'zbekcha. | m6 | grep:List\|Detail\|Cart\|Checkout | 11:16,19 |
| M6-11-A4 | Test: kodni o'qish + telefonda bosib ko'rish → xato → tuzatish → qayta test; ulashish — Expo Go orqali, App Store'ga joylash emas. | m6 | grep:App Store | 11:17-18 |
| M6-11-A5 | So'zlar: deploy → ulashish, dovodka → sayqal, badge → savat soni belgisi (bir marta izoh bilan), state → holat (state), test qilish/testlash → sinash. | m6 | grep:deploy\|dovodka\|testlash | 11:20 |
| M6-11-A6 | «Pipeline» o'rniga «8-darsdagi buyurtma oqimi» deyiladi. | m6 | grep:pipeline | 11:20 |
| M6-11-M | Metafora teatr (sahna, port, premyera, gastrol) olib tashlanadi; «Direktor» 5-ekranda bir marta (8-dars v2 kabi). | m6 | grep:premyera\|gastrol\|sahna | 11:21 |
| M6-11-A7 | Kafolat yo'q: «to'liq mobil ilova tayyor» o'rniga «asosiy oqimi ishladi». | m6 | grep:to'liq mobil ilova tayyor | 11:22 |
| M6-11-A8 | O'quvchi ustoz bergan tayyor loyihada ishlaydi (Expo + navigatsiya sozlangan); backend darslaridagi server ishlab turgan bo'lishi kerak. | m6 | ko'z | 11:23 |
| M6-12-A1 | Bosh formula: Ish → unga nima kerak? → u qachon tayyor bo'ladi? → shunga qarab reja. | m6 | ko'z | 12-PmLesson24-v2.md:13 |
| M6-12-A2 | Bosh qoida yumshoq: ishni qachon boshlashni unga kerak narsalar va shartlar belgilaydi; hech narsa kutmaydigan ish bugunoq boshlanadi. | m6 | ko'z | 12:14 |
| M6-12-A3 | Uch ufq — bugungi sodda model, universal usul emas: hozir, keyinroq (uch oy), uzoqroq (olti oy). | m6 | grep:uch oy\|olti oy | 12:15 |
| M6-12-A4 | Ikki savol alohida: «Qachon boshlash mumkin?» va «Rejada qaysi ufqqa qo'yamiz?». | m6 | ko'z | 12:16 |
| M6-12-A5 | Bir nom: ufq = «vaqt bo'lagi», «reja» (yo'l emas), «ish», «bosqich» faqat Tesla misolida; «mahsulotni o'ylaydigan odam» → «ilovani yaratayotgan odam». | m6 | grep:mahsulotni o'ylaydigan | 12:18 |
| M6-13-A1 | Bosh formula: Yig' → Sina → Xatoni top → Tuzat → Qayta sina → Ishga tushir. | m6 | ko'z | 13-FullSystemProject-v2.md:12 |
| M6-13-A2 | O'quvchining roli bitta — «tizim arxitektori»; «Direktor» yo'q. | m6 | grep:Direktor | 13:13 |
| M6-13-A3 | Bu dars 1-bosqichning yakuniy loyihasi, kursning oxiri emas (keyin 14-dars PM, so'ng 7-Modul); «Kurs tamom» olib tashlanadi. | m6 | grep:Kurs tamom | 13:14 |
| M6-13-A4 | Buyurtma oqimi: Kanal → Backend → Baza, keyin Backend → Bot; AI buyurtma oqimida emas, alohida: Savol → Backend → AI → Javob (8 va 10-dars bilan bir xil). | m6 | ekran:oqim sxemasi | 13:17 |
| M6-13-A5 | «Bitta backend + bitta baza = bitta tizim» sodda formula; shu loyihada umumiy ma'lumot bitta PostgreSQL bazasida. | m6 | ko'z | 13:18 |
| M6-13-A6 | «Hech narsa ikki marta qurilmaydi» — mavjud backend'dan foydalanamiz, kerak bo'lsa yangi endpoint qo'shamiz. | m6 | ko'z | 13:19 |
| M6-13-A7 | End-to-end test va 12 katakli matritsa faqat bugungi loyiha uchun; boshqa loyihada qadamlar boshqacha. | m6 | ko'z | 13:20 |
| M6-13-A8 | Deploy — serverga joylashtirish, ishga tushirish — foydalanuvchiga berish; «Ship» va «24/7» yo'q. | m6 | grep:Ship\|24/7 | 13:21 |
| M6-13-A9 | `.env` — maxfiy kalitlar: frontend kodiga yozilmaydi, GitHub'ga yuborilmaydi (`.gitignore` qoidasi). | m6 | grep:\.env | 13:22 |
| M6-13-M | Metafora shahar (Arxiv, Hokimlik, Peshtoq, darvoza, fuqaro, ariza, idora) butunlay olib tashlanadi; «chok» qoladi, izoh bilan: qismlar ulangan joy. | m6 | grep:Arxiv\|Hokimlik\|Peshtoq\|fuqaro | 13:24 |
| M6-13-A10 | So'zlar: order trace → buyurtma yo'li, launch checklist → ishga tushirish ro'yxati, checkout → buyurtma ekrani, «grand-finali» yo'q, slot → joy. | m6 | grep:order trace\|launch checklist\|grand-final | 13:25 |
| M6-14-A1 | Bosh formula (o'zgarmaydi): Raqam → nimani sanadi → nimani ko'rsatadi. | m6 | ko'z | 14-PmLesson25-v2.md:12 |
| M6-14-A2 | «Isbot» o'rniga «dalil»: raqam odatda isbot emas, dalil beradi; dars nomi savol sifatida qoladi. | m6 | grep:isbot | 14:13 |
| M6-14-A3 | Dars bo'yi bir ibora: «tizim foydalanuvchi uchun bajargan ishni sanagan raqam»; «odam ishini sanagan», «tizim ishlaganini ko'rsatadi» yo'q. | m6 | grep:odam ishini sanagan | 14:14 |
| M6-14-A4 | Ikki tur raqam: mehnat raqami (jarayonni ko'rsatadi, «shovqin» yo'q) va natija raqami (tizim foydalanuvchi uchun bajargan ish — kuchli dalil). | m6 | grep:shovqin | 14:15-17 |
| M6-14-A5 | Natija raqamida daraja bor: «ochdi» — foydalanish boshlangani, «javob oldi» — ish oxirigacha yetgani. | m6 | ko'z | 14:18 |
| M6-14-A6 | Uchinchi qator ehtiyotkor: «41 odam ochdi»dan «tizim ishladi» emas, «foydalanish boshlandi» chiqadi. | m6 | grep:41 odam | 14:19 |
| M6-14-A7 | So'zlar: «raqamni gapirtirish» → raqamga izoh berish, «Koding» → Kod yozish, «Mustahkamlash» → O'zingiz o'ylab ko'ring, «Yo'lingizda» → Rejangizda; «kompilyator» lug'at izohi bilan qoladi. | m6 | grep:gapirtir\|Koding\|Mustahkamlash\|Yo'lingizda | 14:20 |

## Takrorlar

| Manba-ID | takror: fayllar |
|---|---|
| M6-01-A1 | takror: 03, 04, 05, 07, 08, 09, 10, 11, 13 (har dars o'z metaforasini «faqat bir marta, N-ekranda» deb qayta yozadi; M-qatorlari) |
| M6-01-A2 | takror: 10, 11, 12, 13, 14 (har dars o'z «Bir nom qoidasi» ro'yxatini beradi) |
| M6-01-A2a | takror: 12 («mahsulotni o'ylaydigan odam» → ilovani yaratayotgan odam, 6-dars bilan), 14 |
| M6-01-A3 | takror: 05, 07, 08, 10, 11 («Kafolat yo'q»), 12 (yumshatilgan bosh qoida), 03 (A5), 14 (A6) |
| M6-01-A4a | takror: 13 (slot → joy) |
| M6-01-A2c | takror: 03, 04, 08, 13 (shahar/idora/darvoza/ariza/fuqaro olib tashlanadi), 10 va 11 (ko'p eshik → ko'p kirish yo'li) |
| M6-01-A5, A6 | takror: yo'q (A-bo'limlarda qayta aytilmagan) |

Zid qoida topilmadi.
