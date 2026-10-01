# 6-dars «Bot ichida AI» — yakuniy matn

Fayl: `src/5-Modull/BotAiBrainLesson.jsx` · 20 ekran · Keyingi dars: «Loyiha kuni: bot + DB + AI»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Mijoz pitsa haqida so'radi. AI nima deb javob beradi?
- Mentor: 1-darsda bot faqat handlerda yozilgan javobni yuborardi. Endi AvtoPizza botining handleri mijoz xabarini AI'ga yuboradi va javobni undan oladi. AI'ga hali hech narsa aytilmagan. Tugmani bosing va nima bo'lishini ko'ring.
- Chat «AvtoPizza» · AI ulangan · system prompt yo'q:
  - mijoz: Pitsa haqida ayting
  - (bosilgach) bot: Pitsa Italiyaning Neapol shahrida paydo bo'lgan taom. Uning tarixi bir necha asrga boradi: Margarita, Marinara kabi turlari bor. Bugun u ko'p mamlakatda mashhur, har birida o'z retsepti bor…
  - (keyin) mijoz: Menga do'koningizdagi pitsalar kerak edi
- Tugma: ▶ Xabarni AI'ga yuborish → ✓ AI javob berdi
- Savol: Nega AI shunday javob berdi?
  - AI'ga vazifasi aytilmagan, u qaysi do'kon boti ekanini bilmaydi
  - Bot savolni AI'ga emas, qidiruv saytiga yubordi
  - Internet sekin ishlab, javob chalkashib ketdi
- Javob izohlari:
  - 1-variant: **Aynan!** AI juda ko'p narsani biladi, lekin unga vazifasi aytilmagan: u AvtoPizza boti ekanini ham, nima haqida gapirishini ham bilmaydi. Bugun buni system prompt bilan hal qilamiz.
  - 2 yoki 3-variant: **Qiziq fikr!** Chatga qarang: AI to'liq va tartibli javob yozdi — faqat do'kon haqida emas. Unga u AvtoPizza boti ekani aytilmagan edi. Bugun buni system prompt bilan hal qilamiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun: bot javobni AI'dan qanday oladi va AI'ni qanday boshqaramiz.
- Mentor: 1-darsda handler javobni o'zi yozilgan matndan olardi. Bugun u javobni AI'dan oladi. AI yaxshi javob yozishi uchun unga nima yuborishni o'rganamiz.
- Chizma: Mijoz xabari (hodisa) → handler → AI API → javob
  - AI API ostida: system prompt · suhbat tarixi · temperature
- Bugungi 4 qadam:
  1. AI nimani biladi va nimani bilmaydi
  2. System prompt yozamiz
  3. Suhbat tarixi va temperature'ni sinaymiz
  4. Faktni tekshiramiz
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Chizmani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · AI nimani biladi
- Eyebrow: Tushuncha · AI
- Sarlavha: Bot ulanadigan AI nimani biladi va nimani bilmaydi?
- Mentor: Bot javobni AI modelidan oladi, masalan, Gemini'dan. Uning uchta xususiyatini bosib ko'ring.
- Kartalar (bosilgani ochiladi):
  - Ko'p matndan o'rgangan — AI modeli juda ko'p matn asosida o'qitilgan, shuning uchun turli mavzularda gapira oladi. Lekin AvtoPizza menyusini u bilmaydi — buni unga aytish kerak.
  - Har safar biroz boshqacha yozadi — AI javobni so'zma-so'z tanlab yozadi. Shuning uchun bir xil savolga ikki marta bir xil javob bermasligi mumkin.
  - Oldingi so'rovni o'zi eslamaydi — Bot yuborgan har so'rov AI uchun alohida. Oldingi xabarlarni AI faqat bot ularni so'rovga qo'shib yuborsa biladi — buni tez orada sinab ko'rasiz.
- Tugmalar: Orqaga · Uchalasini oching (N/3) → Davom etish

## 3 · Noaniq va aniq prompt
- Eyebrow: Tushuncha · prompt
- Sarlavha: Noaniq prompt va aniq prompt.
- Mentor: Prompt — AI'ga yuboriladigan matn (5-darsda bot kodi uchun yozgansiz). Ikkala promptni yuborib, qaysi javob foydaliroq ekanini solishtiring.
- Chap — yorliq «noaniq prompt»:
  - Karta «prompt»: Yordam bering
  - Tugma: ▶ Yuborish → ✓ Yuborildi
  - AI: Albatta. Nimada yordam kerak? Savol juda keng — qaysi mavzu, qaysi vazifa ekanini aniqroq yozing.
- O'ng — yorliq «aniq prompt»:
  - Karta «prompt»: AvtoPizza do'konining Telegram-boti uchun 3 ta qisqa salomlashuv gapi yozing
  - Tugma (chap javobdan keyin): ▶ Yuborish → ✓ Yuborildi
  - AI: 1) Xush kelibsiz! AvtoPizza'da bugun qaysi pitsani tanlaysiz? 2) Assalomu alaykum! Menyuni ko'rish uchun «Menyu» tugmasini bosing. 3) Salom! Buyurtma berishga yordam beraymi?
- Xulosa: Aniq prompt — foydali javob. Bot ichida ham shunday: AI'ga u kim ekani va nima qilishi aniq yozib beriladi. Buni system prompt deyiladi — uni birozdan keyin o'zingiz yozasiz.
- Tugmalar: Orqaga · Ikkalasini yuboring (N/2) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI'dan foydali javob olish uchun prompt qanday yozilishi kerak?
  - Iloji boricha qisqa, bir-ikki so'z bilan
  - Katta harflar va undov belgilari bilan
  - ✔ Kim uchun va nima kerakligini aniq aytib
  - Bitta savolni bir necha marta takrorlab
- Javob izohlari:
  - To'g'ri: AI faqat promptda yozilganini ko'radi — kim uchun va nima kerakligini aniq yozing.
  - 1-variant: Qisqa prompt ko'pincha noaniq bo'ladi: «Yordam bering» ga AI aniqlashtiruvchi savol qaytardi.
  - 2-variant: Katta harf AI'ga yangi ma'lumot bermaydi. Muhimi — nima kerakligi aniq yozilgani.
  - 4-variant: Takrorlash promptni aniqroq qilmaydi: AI'ga yangi ma'lumot qo'shilmaydi.
- Test yozuvlari: Jonli dars — bitta urinish, o'ylab bosing! · To'g'ri · Qaytadan urinib ko'ring · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: C — … · Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · System prompt yozing
- Eyebrow: Markaziy · system prompt
- Sarlavha: AvtoPizza boti uchun system prompt yozing.
- Mentor: System prompt — AI'ga har so'rovdan oldin beriladigan doimiy ko'rsatma: u kim, qanday gapiradi, nima haqida gapiradi. Har savolga bitta javob tanlang.
- Savollar (bittadan ochiladi; tanlangani ✓ yoki ✗):
  - Kim?
    - Istalgan savolga javob beradigan ensiklopediya
    - ✔ AvtoPizza do'konining yordamchisi
    - Faqat o'zi haqida gapiradigan yordamchi
  - Qanday gapirsin?
    - Imkon qadar uzun va batafsil
    - Faqat «ha» yoki «yo'q» deb
    - ✔ Qisqa, samimiy, aniq
  - Nima haqida?
    - Istalgan mavzuda erkin gaplashaver
    - ✔ Faqat menyu va buyurtma haqida gaplash
    - Hech qanday savolga javob berma
- Javob berilgan savol bitta qatorga yig'iladi: Kim? — AvtoPizza do'konining yordamchisi ✓ · ↻ (O'zgartirish)
- Yorliq: yig'ilayotgan system prompt
- Karta «SYSTEM PROMPT»: Sen …san. … gapir. ….
  - to'g'ri yig'ilganda: Sen AvtoPizza do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat menyu va buyurtma haqida gaplash.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Bu javob AvtoPizza boti uchun mos emas — ✗ belgisini ko'ring va boshqasini tanlang.
- To'g'ri: Tayyor — endi AI biladi: u kim, qanday gapiradi va nima haqida gapiradi.
- Tugmalar: Orqaga · System prompt'ni yig'ing → Davom etish

## 6 · Ikki alohida so'rov
- Eyebrow: Sinov · xotira
- Sarlavha: Ikki xabar — ikki alohida so'rov.
- Mentor: Bot har mijoz xabarini AI'ga alohida so'rov qilib yuboradi. Aziza avval ismini aytdi, keyin «Ismim nima edi?» deb so'radi. Ikkinchi xabarni yuboring: AI eslaydimi?
- Chat «1-so'rov»:
  - mijoz: Salom, mening ismim Aziza.
  - AI: Salom, Aziza! Sizga qanday yordam beray?
- Strelka: bot → AI
- Tugma: ▶ Ikkinchi xabarni yuborish → ✓ Yuborildi
- Chat «2-so'rov» · AI'ga ketdi — faqat shu xabar:
  - mijoz: Ismim nima edi?
  - Tugma: Javobni ko'rish
  - AI: Kechirasiz, ismingizni bilmayman. Uni menga hali aytmagansiz.
- Strelka: bot → AI
- Xulosa: AI ismni bilmadi: 2-so'rovda faqat «Ismim nima edi?» bor edi. Eslashi uchun bot har so'rovga suhbat tarixini — oldingi xabarlarni — qo'shib yuboradi. Tarix uzaysa nima bo'ladi — keyingi ekranda ko'ramiz.
- Tugmalar: Orqaga · Ikkinchi xabarni yuborish → Davom etish

## 7 · Kontekst oynasi sinovi
- Eyebrow: Markaziy · kontekst oynasi
- Sarlavha: Suhbat tarixi uzaysa nima bo'ladi?
- Mentor: Endi bot har so'rovga suhbat tarixini qo'shadi. AI bir so'rovda ko'ra oladigan matn hajmi kontekst oynasi deyiladi. Xabarlarni birma-bir yuboring va oynani kuzating.
- Yorliq: kontekst oynasi · sinovda 4 ta xabar sig'adi
  - ostida: Haqiqiy AI'da oyna ancha katta, lekin cheksiz emas.
- Oyna (boshida: bo'sh) — xabarlar navbati:
  - Salom!
  - Ismim: Aziza
  - Bugun ob-havo yaxshi ekan
  - Menga Margarita kerak
  - Manzil: Chilonzor 5-kvartal
- 4 ta to'lganda: Oyna to'ldi — keyingi xabar kelsa, bot eng eskisini tarixdan olib tashlaydi
- 5-xabardan keyin: «Salom!» — oynadan chiqdi
- Tugma: ▶ Xabar yuborish (N/5) → ✓ Hammasi yuborildi
- Savol (hammasi yuborilgach): Keyingi xabar kelsa, qaysi muhim ma'lumot oynadan chiqib ketadi?
  - Bugun ob-havo yaxshi ekan
  - ✔ Ismim: Aziza
  - Manzil: Chilonzor 5-kvartal
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi.
- Javob izohlari:
  - To'g'ri: «Ismim: Aziza» endi eng eski xabar — keyingi xabar kelsa, u oynadan chiqadi.
  - Xato: Oynadan birinchi eng eski xabar chiqadi. Hozir eng eskisi — «Ismim: Aziza»: keyingi xabarda AI ismni bilmay qoladi. Shuning uchun muhim ma'lumot bazaga saqlanadi va har so'rovda system prompt'ga qo'shiladi.
- Tugmalar: Orqaga · Sinovni bajaring → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Suhbat tarixi kontekst oynasiga sig'may qolsa, nima bo'ladi?
  - ✔ Eng eski xabarlar chiqadi va AI ularni ko'rmaydi
  - AI butunlay ishlashdan to'xtab qoladi
  - Bot yangi xabarlarni qabul qilmay qo'yadi
  - Eski xabarlar o'zi bazaga yozilib qoladi
- Javob izohlari:
  - To'g'ri: Oyna cheklangan: odatda eng eski xabarlar chiqadi va AI ularni endi ko'rmaydi.
  - 2-variant: AI ishlashda davom etadi — faqat eski xabarlarni endi ko'rmaydi.
  - 3-variant: Yangi xabarlar qabul qilinadi — oynadan eskisi chiqadi.
  - 4-variant: O'zi hech narsa saqlanmaydi: muhim ma'lumotni bazaga bot kodi yozadi.
- Test yozuvlari: Jonli dars — bitta urinish, o'ylab bosing! · To'g'ri · Qaytadan urinib ko'ring · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: A — … · Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 9 · Temperature
- Eyebrow: Markaziy · temperature
- Sarlavha: Temperature: javob qat'iy bo'lsinmi yoki erkin?
- Mentor: Temperature — javob qanchalik erkin bo'lishini belgilaydigan son, Gemini'da 0 dan 2 gacha. Bitta savolni — «Bizda qanday pitsalar bor?» — uch marta beramiz. Ikkala qiymatni navbat bilan bosib, javoblarni solishtiring.
- Chap:
  - Tugma: ▶ 0.1 bilan so'rash → ✓ 0.1 sinaldi
  - Chat «AvtoPizza · temperature 0.1»:
    - Bizda Margarita, Pepperoni va To'rt pishloq bor.
    - Bizda Margarita, Pepperoni va To'rt pishloq bor.
    - Bizda Margarita, Pepperoni va To'rt pishloq bor.
- O'ng (0.1 dan keyin):
  - Tugma: ▶ 1.5 bilan so'rash → ✓ 1.5 sinaldi
  - Chat «AvtoPizza · temperature 1.5»:
    - Bizda Margarita va Pepperoni bor — qaysi birini tanlaysiz?
    - Bugun Margarita bilan boshlang, Pepperoni ham bor — albatta sinab ko'ring!
    - Menyuda Pepperoni va To'rt pishloq — ikkalasi ham mazali!
- Savol (ikkalasi ko'rilgach): Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos?
  - ✔ Past (0.1)
  - Baland (1.5)
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi.
- Javob izohlari:
  - To'g'ri: Past temperature'da javob deyarli bir xil chiqadi — menyu uchun shu mos.
  - Baland (1.5): Baland temperature'da javob har safar boshqacha: birida To'rt pishloq bor, boshqasida yo'q. Menyuni har safar bir xil aytish kerak bo'lganda bu noqulay. Baland qiymat reklama matni kabi ijodiy ish uchun qulay.
- Tugmalar: Orqaga · Ikkalasini sinab ko'ring → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Temperature baland qilib qo'yilsa, nima bo'ladi?
  - AI javobni ancha tezroq yozib beradi
  - Javoblar har safar aynan bir xil chiqadi
  - Bot internetni ancha ko'proq sarflaydi
  - ✔ Javoblar har safar boshqacha bo'lishi mumkin
- Javob izohlari:
  - To'g'ri: Baland temperature'da javoblar har safar boshqacha bo'lishi mumkin.
  - 1-variant: Tezlikka aloqasi yo'q — temperature javob qanchalik erkin bo'lishini belgilaydi.
  - 2-variant: Aksincha: bir xil javob past temperature'da bo'ladi.
  - 3-variant: Internet sarfiga aloqasi yo'q — temperature faqat javob matniga ta'sir qiladi.
- Test yozuvlari: Jonli dars — bitta urinish, o'ylab bosing! · To'g'ri · Qaytadan urinib ko'ring · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: D — … · Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 11 · Faktni tekshirish
- Eyebrow: Markaziy · faktni tekshirish
- Sarlavha: Faktni tekshiring.
- Mentor: AI menyu haqida uchta gap aytdi. Har birini haqiqiy menyu bilan solishtiring — buni inglizcha fact-checking deyishadi.
- Yorliq «AI javobidagi gaplar» (bittadan ochiladi; har birida tugmalar: Rost · To'qib chiqarilgan):
  - Margarita — 35 000 so'm → ✔ Rost
  - Ananasli pitsa — 30 000 so'm → ✔ To'qib chiqarilgan
  - Pepperoni — 42 000 so'm → ✔ Rost
- Belgilangan gap bitta qatorga yig'iladi: Margarita — 35 000 so'm · Rost ✓ (ananasli pitsa yonida: menyuda yo'q)
- Yorliq «haqiqiy menyu (bazadan)»:
  - Margarita — 35 000 so'm
  - Pepperoni — 42 000 so'm
  - To'rt pishloq — 48 000 so'm
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi.
- Javob izohlari:
  - Hammasi to'g'ri: To'g'ri. «Ananasli pitsa» menyuda yo'q — AI uni o'zi to'qib chiqardi. Bu hallutsinatsiya deb ataladi: AI ishonch bilan aytadi, lekin gap haqiqatga to'g'ri kelmaydi. Bu temperature past bo'lganda ham bo'lishi mumkin — narx va taom nomini menyu bilan solishtiring.
  - Xato bo'lsa: Menyuga qarang: Margarita va Pepperoni narxi mos, «Ananasli pitsa» esa menyuda yo'q — AI uni to'qib chiqardi. Bu hallutsinatsiya deb ataladi.
- Tugmalar: Orqaga · Har gapni tekshiring (N/3) → Davom etish

## 12 · AvtoPizza suhbati
- Eyebrow: Hayotiy · AvtoPizza
- Sarlavha: AvtoPizza boti AI bilan: buyurtmagacha bitta suhbat.
- Mentor: Suhbatni qadam-baqadam oching. O'ng tomonda — AI'ga har so'rovda nima borishi.
- Chat «AvtoPizza» (har bosishda bitta juftlik):
  1. mijoz: Salom! Juda ochman, nima tavsiya qilasiz?
     bot: Salom! Menyudan Pepperoni'ni tavsiya qilaman — go'shtli va to'yimli. Yoki klassik Margarita?
  2. mijoz: Achchiq narsani yoqtirmayman
     bot: Unda Margarita sizga mos: achchiq emas, yumshoq pishloqli. Buyurtma qilamizmi?
  3. mijoz: Ha, bittasini olaman
     bot: Ajoyib! Margarita — 35 000 so'm. Manzilingizni yuboring, buyurtmani rasmiylashtiramiz.
- Tugma: ▶ Suhbatni boshlash → Keyingi savol → → ✓ Buyurtma qabul qilindi
- Karta «So'rov ichida»:
  - System prompt: «Sen AvtoPizza do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat menyu va buyurtma haqida gaplash.»
  - Menyu (bazadan): Margarita — 35 000 so'm · Pepperoni — 42 000 so'm · To'rt pishloq — 48 000 so'm
  - Suhbat tarixi: shu suhbatdagi oldingi xabarlar
- Xulosa: 3-xabarda mijoz «bittasini» dedi — AI bu Margarita ekanini suhbat tarixidan bildi. Narx esa AI'ning o'zidan emas, bazadagi menyudan olindi.
- Tugmalar: Orqaga · Suhbatni davom ettiring (N/3) → Davom etish

## 13 · AI botga qanday ulanadi
- Eyebrow: Amalda · AI API
- Sarlavha: AI botga qanday ulanadi?
- Mentor: Bot AI bilan AI API orqali gaplashadi — Telegram bilan Bot API orqali gaplashgani kabi. Kodni ko'rib chiqing.
- Kod oynasi «bot.js · soddalashtirilgan»:
```js
// /start va «Menyu» — oddiy handlerlar. Qolgan erkin savol — AI'ga:
bot.on('text', async (ctx) => {
  const tarix = await suhbatTarixi(ctx.from.id) // bazadan: oldingi xabarlar
  const javob = await soraAI({
    systemPrompt,             // kim · qanday · nima haqida + menyu
    tarix,
    xabar: ctx.message.text,
    temperature: 0.2,
  })
  await ctx.reply(javob)
})
```
- Kod ostida: `suhbatTarixi` va `soraAI` — loyiha kunida AI yordamida yozadigan funksiyalaringiz.
- Kartalar:
  - AI API kaliti — .env faylida — Kodda faqat `process.env.AI_API_KEY` turadi.
  - Har so'rov hisobga olinadi — AI API odatda matn hajmiga qarab haq oladi, shuning uchun oddiy ishlarni handler bajaradi.
- Tugma: Tushundim ✓ → ✓ Tushundim
- Tugmalar: Orqaga · Kodni o'qing → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI «Bizda ananasli pitsa bor» deb yozdi. Nima qilish kerak?
  - Ishonib, mijozga shundayligicha yuborish
  - ✔ Menyu bilan solishtirib, tekshirib ko'rish
  - Mijozdan savolni qaytadan yozishni so'rash
  - Botni to'xtatib, qayta ishga tushirish
- Javob izohlari:
  - To'g'ri: AI menyuda yo'q narsani ham aytishi mumkin — narx va nomni menyu bilan solishtiring.
  - 1-variant: Tekshirmasdan yuborish xavfli: mijoz menyuda yo'q pitsani buyurtma qiladi.
  - 3-variant: Muammo mijozning savolida emas, AI javobida. Javob menyu bilan tekshiriladi.
  - 4-variant: Qayta ishga tushirish javobni to'g'rilamaydi — AI yana shunday yozishi mumkin.
- Test yozuvlari: Jonli dars — bitta urinish, o'ylab bosing! · To'g'ri · Qaytadan urinib ko'ring · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: B — … · Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 15 · Handler tartibini yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: handler AI bilan qanday ishlashini tartibga soling.
- Mentor: Mijoz AvtoPizza botiga erkin savol yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Bo'laklar (aralash chiqadi) — to'g'ri tartib:
  1. Mijoz xabari keladi
  2. Xabarga system prompt va suhbat tarixi qo'shiladi
  3. AI API javob yozadi
  4. Javob menyu bilan tekshiriladi
  5. Javob yuboriladi va tarixga yoziladi
- Javob izohlari:
  - To'g'ri: ✓ Tartib to'g'ri: **xabar keladi → system prompt va tarix qo'shiladi → AI javob yozadi → javob tekshiriladi → mijozga ketadi**. Keyin bot 1-darsdagi siklga qaytadi: yana keyingi hodisani kutadi.
  - Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (birinchi xatodan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · AI chat
- Eyebrow: Amaliyot · AI chat
- Sarlavha: O'z botingiz uchun system prompt yozing
- Mentor: Topshiriqni **o'z kompyuteringizda** bajaring. Har qadamdan keyin **«Bajardim»** ni bosing — keyingisi ochiladi.
- Karta «TOPSHIRIQ»: gemini.google.com'ni oching. O'z botingiz uchun system prompt yozing: u kim, qanday gapiradi, nima haqida gapiradi. Oddiy chatda system prompt birinchi xabar qilib yuboriladi — botda esa u kodda alohida beriladi. Keyin AI chegarada qolishini va to'g'ri javob berishini tekshirasiz.
- Qadamlar (bittadan ochiladi; har birida tugma «Bajardim»):
  1. gemini.google.com'ni oching va yangi chat boshlang.
  2. Birinchi xabarga system prompt yozing: `Sen ... yordamchisisan. ... gapir. Faqat ... haqida gaplash.` Oxiriga menyu yoki o'z ma'lumotlaringizni qo'shing.
  3. Mavzuga oid savol bering va javob system prompt'ga mos kelganini tekshiring.
  4. Mavzudan tashqari savol bering (masalan, «Ertaga ob-havo qanday?»). AI chegarada qoladimi?
  5. Menyudagi narxni so'rang va o'zingiz yozgan menyu bilan solishtiring. Mos kelmasa — bu hallutsinatsiya.
  6. aistudio.google.com'ni oching (o'sha Gemini, o'sha Google akkaunti). Temperature'ni 0.1 qilib bitta savolni ikki marta bering, keyin 1.5 qilib yana ikki marta — javoblarni solishtiring.
- Hammasi bajarilgach: ✓ Bajarildi — Mentorni kuting
  - Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yuboriladigan so'rov matni nima deyiladi? | Prompt | Aniq prompt — foydali javob |
| AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadigan doimiy ko'rsatma nima? | System prompt | Har so'rovdan oldin beriladi: kim · qanday · nima haqida |
| Bot AI'ga qo'shib yuboradigan oldingi xabarlar nima deyiladi? | Suhbat tarixi | AI API oldingi so'rovni o'zi eslamaydi |
| AI bir so'rovda ko'ra oladigan matn hajmi nima deyiladi? | Kontekst oynasi | Katta, lekin cheksiz emas |
| Tarix oynaga sig'masa, qaysi xabar birinchi chiqib ketadi? | Eng eski xabar | AI uni endi ko'rmaydi |
| Ism, manzil kabi muhim ma'lumot yo'qolmasligi uchun qayerda saqlanadi? | Bazada | Har so'rovda system prompt'ga qo'shiladi |
| Javob qanchalik erkin bo'lishini qaysi sozlama belgilaydi? | Temperature | Gemini'da 0 dan 2 gacha |
| Temperature past bo'lsa, javob qanday bo'ladi? | Deyarli bir xil | Menyu, narx kabi aniq ma'lumot uchun |
| Temperature baland bo'lsa, javob qanday bo'ladi? | Xilma-xil | Ijodiy matn uchun qulay; to'g'rilikni esa tekshirish ko'rsatadi |
| AI ishonch bilan aytgan, lekin haqiqatga to'g'ri kelmaydigan javob nima deyiladi? | Hallutsinatsiya | Masalan, menyuda yo'q «ananasli pitsa» |
| AI aytgan narxni qanday tekshirasiz? | Menyu bilan solishtiraman | Narx bazadagi menyudan olinadi |
| AI API kaliti qaysi faylda saqlanadi? | .env faylida | Kodda faqat `process.env.AI_API_KEY` ko'rinadi |

- Kartochka yozuvlari: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim
- Hammasi yodlanganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Bot javobni AI'dan oladi
- Sarlavha: Endi botingiz javobni AI'dan oladi — va siz uni boshqarasiz.
- Natija halqasi: N/5 to'g'ri javob
- Arena tugmasi: CODE STRIKE (jonli darsda kutilsa: Mentorni kuting)
- Endi siz bilasiz:
  - AI API oldingi so'rovni eslamaydi — bot unga system prompt va suhbat tarixini har so'rovda yuboradi
  - System prompt AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadi
  - Kontekst oynasi cheklangan — muhim ma'lumot tarixda emas, bazada saqlanadi
  - Temperature: past — deyarli bir xil javob, baland — xilma-xil. Javob to'g'riligini temperature emas, tekshirish ko'rsatadi
  - AI hallutsinatsiya qilishi mumkin — narx va faktni menyu bilan solishtiring
- Uyga vazifa · Amaliy topshiriqni bajarish → (tugma fonida: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Yozing** — o'z botingiz uchun system prompt yozing: kim, qanday gapiradi, nima haqida gapiradi
  - **Ajrating** — botingizga keladigan 5 ta xabarni yozing va har biri yoniga belgilang: unga handler javob beradimi yoki AI
  - **Tekshiring** — gemini.google.com'da system prompt'ingizni sinang va bitta faktni o'z ma'lumotingiz bilan solishtiring
  - Keyingi dars — **«Loyiha kuni: bot + DB + AI»**. Handler, baza va AI'ni bitta botga yig'asiz va uni kompyuteringiz yopiq bo'lsa ham ishlaydigan serverga joylaysiz.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Prompt Writer — AvtoPizza boti uchun system prompt yozdingiz
- Context Keeper — Oynadan chiqib ketadigan muhim ma'lumotni topdingiz
- Temperature Tuner — Menyu uchun to'g'ri temperature tanladingiz
- Fact Checker — To'qib chiqarilgan pitsani menyu bilan tutdingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · bosib davom eting

## Qisqa takrorlash oynalari
Umumiy yozuvlar: Qayta tushuntirish · ← Oldingi · Keyingisi → · Sinfga savol: · ✓ Tushunarli — davom etamiz

1. Aniq prompt — foydali javob (4-ekran)
   - 1 · AI promptni o'qiydi — AI faqat promptda yozilganini ko'radi, qolganini o'zi taxmin qiladi.
   - 2 · Noaniq prompt — «Yordam bering» dan AI nima kerakligini bilmaydi va aniqlashtiruvchi savol beradi.
   - 3 · Aniq prompt — Kim uchun va nima kerakligi yozilsa, javob foydali bo'ladi.
   - Sinfga savol: «Yordam bering» promptini qanday aniqroq qilasiz?
2. Kontekst oynasi (8-ekran)
   - 1 · Oyna cheklangan — AI bir so'rovda ma'lum hajmdagi matnni ko'radi: system prompt, suhbat tarixi va yangi xabar shunga sig'ishi kerak.
   - 2 · Eng eskisi chiqadi — Tarix uzaysa, bot eng eski xabarlarni olib tashlaydi va AI ularni endi ko'rmaydi.
   - 3 · Yechim — baza — Ism, manzil kabi muhim ma'lumot bazaga saqlanadi va har so'rovda system prompt'ga qo'shiladi.
   - Sinfga savol: Tarix uzaysa, qaysi xabar birinchi chiqib ketadi?
3. Temperature (10-ekran)
   - `temperature: 0.1` · Past — qat'iy — Temperature past bo'lsa, AI deyarli bir xil javob beradi; aniq ma'lumot uchun shu tanlanadi.
   - `temperature: 1.5` · Baland — erkin — Baland bo'lsa, javob har safar boshqacha; ijodiy matn uchun qulay.
   - 3 · To'g'rilikni kafolatlamaydi — Past qiymatda ham javob menyu bilan tekshiriladi.
   - Sinfga savol: Menyuni bir xil aytish uchun qaysi temperature tanlanadi?
4. Faktni tekshirish — hallutsinatsiya (14-ekran)
   - 1 · Ishonchli ohang — AI noto'g'ri javobni ham ishonch bilan yozadi.
   - 2 · To'qib chiqarilgan fakt — «Ananasli pitsa» kabi menyuda yo'q narsani ham aytishi mumkin; bu hallutsinatsiya.
   - 3 · Yechim — manba bilan solishtirish — Narx va taom nomi bazadagi menyu bilan solishtiriladi.
   - Sinfga savol: AI javobidagi qaysi ma'lumotni albatta tekshirish kerak?
5. Handler AI bilan: 5 qadam (15-ekran)
   - `ctx.message.text` · Avval — xabar va kontekst — Mijoz xabari keladi, bot unga system prompt va suhbat tarixini qo'shadi.
   - `soraAI({ systemPrompt, tarix, xabar })` · Keyin — AI javobi — AI API shu hammasini o'qib, javob yozadi.
   - `ctx.reply(javob)` · Oxiri — tekshirish va yuborish — Javob menyu bilan tekshiriladi, keyin mijozga ketadi va tarixga yoziladi.
     - Chizma: Xabar → System prompt + tarix → AI javobi → Tekshirish → Yuborish
   - Sinfga savol: Nega javob yuborishdan oldin tekshiriladi?

## Jonli viktorina (12 savol)
1. AI'ga system prompt berilmasa, u mijozga qanday javob beradi?
   - Umuman javob bermay, jim qoladi
   - ✔ Umumiy, mavzudan chetga chiqqan javob
   - Faqat «tushunmadim» deb yozadi
   - Bot o'zi o'chib, qayta yonadi
2. System prompt nimani belgilaydi?
   - AI'ning javob yozish tezligini
   - Botning rangi va shriftini
   - Server joylashgan shaharni
   - ✔ AI'ning xulqi va chegarasini
3. Prompt nima?
   - ✔ AI'ga yuboriladigan so'rov matni
   - Botning xatolar jurnali
   - AI API'ning internet manzili
   - Telegram kanalining nomi
4. Kontekst oynasi nima?
   - AI'ning javob yozish tezligi
   - Botning Telegram'dagi chat oynasi
   - ✔ AI bir so'rovda ko'radigan matn hajmi
   - Bazadagi jadvallar soni
5. Suhbat tarixi oynaga sig'masa, qaysi xabar birinchi chiqib ketadi?
   - Eng yangi xabar
   - ✔ Eng eski xabar
   - Eng qisqa xabar
   - Tasodifiy bir xabar
6. Mijoz ismi yo'qolmasligi uchun bot nima qiladi?
   - ✔ Ismni bazaga saqlab, promptga qo'shadi
   - Kontekst oynasini o'zi kattalashtiradi
   - Temperature'ni pastroq qilib qo'yadi
   - AI'ni har safar qayta ishga tushiradi
7. Temperature past bo'lsa (masalan, 0.1), javob qanday bo'ladi?
   - Har safar butunlay boshqacha
   - Har safar xato chiqadi
   - Juda uzun va batafsil
   - ✔ Qat'iy va deyarli bir xil
8. Temperature baland bo'lsa (masalan, 1.5), menyu uchun nima noqulay?
   - Bot butunlay to'xtab qoladi
   - ✔ Javob har safar boshqacha chiqadi
   - Internet uzilib qoladi
   - API kaliti oshkor bo'ladi
9. Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos?
   - Baland (1.5)
   - O'rtacha, xohlagancha
   - ✔ Past (0.1)
   - Har so'rovda almashtirib
10. AI «Bizda ananasli pitsa bor» dedi, menyuda esa bunday pitsa yo'q. Bu nima?
    - To'g'ri javob, hammasi joyida
    - Telegram Bot API'ning xatosi
    - API kalitining oshkor bo'lishi
    - ✔ Hallutsinatsiya, tekshirish kerak
11. AI javobidagi narxni qachon tekshirish kerak?
    - ✔ Mijozga yuborishdan oldin
    - Hech qachon, AI adashmaydi
    - Faqat temperature past bo'lsa
    - Faqat mijoz shikoyat qilsa
12. AI API kaliti qayerda saqlanadi?
    - bot.js kodining ichida, ochiq holda
    - Mijozga chatda yuboriladi
    - ✔ .env faylida, kodda emas
    - Telegram profil sozlamasida
- Arena yozuvlari: Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish
