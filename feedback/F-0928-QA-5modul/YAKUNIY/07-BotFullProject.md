# 7-dars «Loyiha kuni: bot + DB + AI» — yakuniy matn

Fayl: `src/5-Modull/BotFullProjectLesson.jsx` · 20 ekran · Keyingi dars: «Botingizni ishlatgan odamdan nimani so'raysiz?»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish — laptop yopildi
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Kechqurun laptopni yopdingiz. Soat 02:14 da botingizga mijoz yozdi.
- Mentor: Botingizda hammasi bor: token, handlerlar, baza va AI. Kunduzi u yaxshi ishladi. Tugmani bosing va tunda nima bo'lishini ko'ring.
- Chat (AvtoPizza · bot):
  - mijoz: 02:14 — Salom! Hozir buyurtma bersam bo'ladimi?
  - mijoz (tugma bosilgach): 02:21 — Hali ham javob yo'q…
- Tugma: ▶ Nima bo'lishini ko'rish → ✓ Ko'rdingiz
- Savol (tugma bosilgach): Nega bot javob bermadi?
  - Bot kodida kechasi kutilmagan xato chiqdi
  - ✔ Bot dasturi laptop bilan birga to'xtadi
  - Telegram tunda botlarga xabar yetkazmaydi
- Javob izohlari:
  - 2-variant: **Aynan!** Bot dasturi laptopingizda ishlardi — laptop yopilganda u ham to'xtadi. Bugun botni serverga joylaymiz: u laptop yopiq bo'lsa ham ishlaydi.
  - 1 yoki 3-variant: **Qiziq fikr!** Kunduzi kod yaxshi ishlagan, Telegram esa tunda ham xabar yetkazadi. Sabab boshqa: bot dasturi laptopingizda ishlardi va laptop yopilganda to'xtadi. Bugun botni serverga joylaymiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun botingizni serverga joylaysiz.
- Mentor: Yangi kod kam bo'ladi. Oldingi darslarda qo'shgan qismlarni bitta botga yig'asiz, keyin uni laptop yopiq bo'lsa ham ishlaydigan kompyuterga joylaysiz.
- Chizma: Laptop · `bot.js` · hozir shu yerda → deploy → Server · `bot.js` · dars oxirida
- Bugungi 4 qadam
  1. To'liq bot: token, handlerlar, baza va AI
  2. Bot qayerda ishlaydi: laptop va server
  3. Serverda token va xabar olish usuli
  4. Serverga joylashdan oldingi tekshiruv
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Chizmani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · To'liq bot — to'rt qism
- Eyebrow: Yig'ish · to'liq bot
- Sarlavha: To'liq botda to'rt qism birga ishlaydi.
- Mentor: Bu to'rt qismni oldingi darslarda qo'shgansiz. Har birini bosing va u botda nima qilishini eslang.
- Kartalar (bosilgani ✓ bilan belgilanadi, bir vaqtda bittasi ochiq):
  - **Token** — Botni Telegram Bot API'ga tanitadigan maxfiy qator. U `.env` faylida turadi, kodda faqat `process.env.BOT_TOKEN` yoziladi.
  - **Handlerlar** — /start, «Menyu» tugmasi, buyurtma bosqichlari: aniq hodisaga tayyor javob. Hech biri mos kelmasa, fallback handler javob beradi.
  - **Baza (PostgreSQL)** — Buyurtma, mijoz va holat shu yerda saqlanadi. Ma'lumot diskda turadi — bot qayta ishga tushsa ham yo'qolmaydi.
  - **AI** — Handlerda tayyor javobi yo'q erkin savolga javob yozadi: siz yozgan system prompt'ga qarab, AI API kaliti bilan.
- Tugmalar: Orqaga · 4 qismni ko'ring (N/4) → Davom etish

## 3 · Bot qayerda ishlaydi
- Eyebrow: Tushuncha · bot qayerda ishlaydi
- Sarlavha: Bot Telegram ichida emas. Unda javobni kim yozadi?
- Mentor: 1-darsda ko'rgansiz: bot dasturi ishlab tursagina javob beradi. Endi bu dastur qayerda ishlashini ko'ramiz. Ikkala holatda xabar yuborib ko'ring.
- Laptop yoniq · tugma: ▶ Xabar yuborish (ko'rilgach qatorga yig'iladi: ✓ Laptop yoniq ↻)
  - Yo'l: Mijoz → Telegram → bot.js (laptopda) → Telegram → Mijoz
  - Chat (AvtoPizza · bot): mijoz: Salom! · bot: Salom! Menyuni ko'rasizmi?
- Laptop yopiq · tugma: ▶ Xabar yuborish (ko'rilgach: ✓ Laptop yopiq ↻)
  - Yo'l: Mijoz → Telegram → … (bot.js ishlamayapti)
  - Chat (AvtoPizza · bot): mijoz: Salom! (javob kelmaydi)
- Xulosa (2/2 dan keyin): Xabarni Telegram qabul qiladi, javobni esa bot.js yozadi — u laptopingizda ishlaydi. Laptop yopiq bo'lsa, xabar Telegram'da kutib turadi va javob faqat dastur qayta ishga tushganda ketadi — ehtimol, ertalab.
- Tugmalar: Orqaga · Ikkalasini sinang (N/2) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mijoz buyurtmasini ertasi kungacha qaysi qism saqlaydi?
  - AI — suhbatni o'zi eslab, ertaga davom ettiradi
  - Token — har bir mijozni tanib, eslab turadi
  - ✔ Baza (PostgreSQL) — ma'lumotni diskda saqlab qoladi
  - Hech qaysi — bot ertasi kunga hech narsani eslamaydi
- Javob izohlari:
  - To'g'ri: Buyurtmani ertasi kungacha baza saqlaydi — ma'lumot diskda turadi.
  - AI: AI suhbatni o'zi eslab qolmaydi — buni 6-darsda ko'rgansiz. Saqlash — baza ishi.
  - Token: Token botni Telegram'ga tanitadi, mijozlarni esa eslamaydi. Saqlash — baza ishi.
  - Hech qaysi: Aksincha: baza bilan bot eslab qoladi. Bazani 4-darsda aynan shuning uchun qo'shgansiz.
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · To'liq botni yig'ing
- Eyebrow: Markaziy · #1
- Sarlavha: To'liq botni o'zingiz yig'ing.
- Mentor: Har vazifaga uni bajaradigan qismni tanlang.
- Vazifalar (navbat bilan; tanlangani ✓ yoki ✕ oladi):
  1. /start va «Menyu» tugmasiga tayyor javob
     - AI — har safar javobni qaytadan yozadi
     - ✔ Handler — hodisaga oldindan yozilgan javob
     - Baza — ma'lumotni saqlaydi, javob yubormaydi
  2. Menyuda yo'q erkin savol: «Achchiq bo'lmagani qaysi?»
     - Handler — faqat oldindan yozilgan javob
     - ✔ AI — savolga qarab javob yozadi
     - Token — faqat botni Telegram'ga tanitadi
  3. Telegram'ga «bu bot meniki» deb isbotlash
     - AI — o'zini bot egasi deb tanishtiradi
     - Handler — /start da egasining ismini aytadi
     - ✔ Token — so'rov sizning botingizdan ekanini tasdiqlaydi
- Bajarilgan vazifa qatori: ✓ Tez javob → Handler ↻ · ✓ Erkin savol → AI ↻ · ✓ Telegram'ga tanitish → Token
- Xato bo'lsa: Bu qism bu vazifani bajarmaydi — boshqasini tanlang.
- O'ng panel — Yig'ilayotgan bot:
  - Tez javob → … (to'g'ri tanlangach: Handler)
  - Erkin savol → … (AI)
  - Telegram'ga tanitish → … (Token)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat (panel ostida): ✓ Bot yig'ildi. Hozircha u laptopingizda ishlaydi.
- Tugmalar: Orqaga · Botni yig'ing → Davom etish

## 6 · Laptop va server
- Eyebrow: Tushuncha · server
- Sarlavha: Laptopni yopsak, qaysi bot javob beradi?
- Mentor: Bir xil bot ikki joyda ishlayapti: laptopingizda va serverda. Laptopni yoping va ikkalasini solishtiring.
- Karta: **Laptop** — ishlayapti → (yopilgach) to'xtadi — javob yo'q
- Karta: **Server** — ishlayapti → (laptop yopilgach) ishlayapti — javob berdi
- Tugma: ▶ Laptopni yopish → ✓ Ko'rdingiz
- Izoh (bosilgach): **Server** — internetga ulangan va to'xtamay ishlashga mo'ljallangan kompyuter. U uyingizda turmaydi: botlar uchun uni hosting xizmatidan ijaraga olasiz. Kodni serverga joylab, u yerda ishga tushirish **deploy** deyiladi.
- Tugmalar: Orqaga · Laptopni yoping → Davom etish

## 7 · Token serverda
- Eyebrow: Markaziy · #2
- Sarlavha: Token serverga qanday yetib boradi?
- Mentor: Kodni GitHub orqali serverga joyladingiz. Tugmani bosing va bot u yerda ishga tushadimi — ko'ring.
- Kod (bot.js · serverda):
```js
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.launch()
```
- Tugma: ▶ Serverda ishga tushirish → ✓ Ko'rdingiz
- Natija (bosilgach): Bot ishga tushmadi: `process.env.BOT_TOKEN` bo'sh. Kod serverga keldi, `.env` esa kelmadi — u `.gitignore` da, Git uni yuklamaydi.
- Savol: Serverda tokenni qayerga yozasiz?
  - bot.js ichiga — kod bilan birga serverga boradi
  - ✔ Server sozlamalariga — kod uni `process.env` dan o'qiydi
  - `.env` ni ham GitHub'ga yuklaymiz — server o'zi topadi
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Javob izohlari (natija o'rnida chiqadi):
  - To'g'ri: ✓ Token server sozlamalariga (odatda Environment yoki Variables bo'limi) yoziladi — kod uni `process.env` dan o'qiydi.
  - Xato: Bu xavfli: kod yoki `.env` GitHub'ga chiqsa, token hammaga ko'rinadi. To'g'ri yo'l — tokenni server sozlamalariga yozish; kodda faqat `process.env.BOT_TOKEN` qoladi.
- Tugmalar: Orqaga · Tokenni to'g'ri joylang → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega serverda BOT_TOKEN ni alohida sozlash kerak?
  - ✔ Token yozilgan fayl serverga kod bilan bormaydi
  - Serverda Telegram botga boshqa token beradi
  - Token faqat bir kun ishlaydi, keyin almashadi
  - Laptopdagi token serverda ishlamay qoladi
- Javob izohlari:
  - To'g'ri: Token yozilgan `.env` fayli `.gitignore` da — Git uni serverga yuklamaydi.
  - Serverda Telegram botga boshqa token beradi: Token bitta — uni @BotFather bergan. Server uchun Telegram yangi token bermaydi.
  - Token faqat bir kun ishlaydi: Token /revoke qilinmaguncha ishlayveradi — har kuni almashmaydi.
  - Laptopdagi token serverda ishlamay qoladi: Token istalgan kompyuterda ishlaydi. Muammo boshqa: u yozilgan `.env` fayli serverga bormaydi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Polling va webhook
- Eyebrow: Markaziy · #3
- Sarlavha: Serverdagi bot yangi xabarni qanday oladi?
- Mentor: 1-darsda ikki usulni ko'rgansiz. Endi bot serverda — ikkalasini yana bosib ko'ring.
- Tugmalar (navbat bilan): ▶ Polling → (ko'rilgach: ✓ Polling ↻) · ▶ Webhook → (✓ Webhook ↻)
- **Polling** — Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?».
  - bot → Telegram: Yangi xabar bormi?
  - Telegram → bot: Yo'q.
  - bot → Telegram: Yangi xabar bormi?
  - Telegram → bot: Ha, bitta: «Salom!»
  - bot javob beradi
- **Webhook** — Telegram yangi xabarni botning internetdagi manziliga (URL) yuboradi. Buning uchun ochiq manzil kerak.
  - Telegram → botning manzili: yangi xabar «Salom!»
  - bot javob beradi
- Savol (ikkalasi ko'rilgach): Kichik bot uchun qaysi usulni sozlash soddaroq?
  - Webhook
  - ✔ Polling
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Javob izohlari:
  - To'g'ri: ✓ Polling qo'shimcha sozlashsiz ishlaydi — 5-darsdagi `bot.launch()` ham shu usulda.
  - Webhook: Webhook ham ishlaydi, lekin unga serverda ochiq manzil (URL) va qo'shimcha sozlash kerak — sozlash soddaroq yo'l polling.
- Tugmalar: Orqaga · Ikkalasini sinab ko'ring → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Polling va webhook — asosiy farqi nima?
  - Polling faqat kompyuterda, webhook faqat telefonda ishlaydi
  - Polling matnli xabar uchun, webhook rasm va fayl uchun
  - Webhook faqat kechasi, polling esa kunduzi ishlaydi
  - ✔ Polling'da bot so'raydi, webhook'da Telegram o'zi yuboradi
- Javob izohlari:
  - To'g'ri: Polling'da bot so'raydi, webhook'da Telegram xabarni botning manziliga o'zi yuboradi.
  - Kompyuter / telefon: Farq qurilmada emas: ikkala usul ham serverda ishlaydi. Farq — xabarni kim boshlab uzatadi.
  - Matn / rasm va fayl: Ikkala usul ham har qanday xabarni yetkazadi: matn, rasm, fayl.
  - Kechasi / kunduzi: Ikkalasi ham istalgan vaqtda ishlaydi — farq vaqtda emas, usulda.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · Joylashdan oldin tekshiruv
- Eyebrow: Markaziy · #4
- Sarlavha: Serverga joylashdan oldin — tekshiruv.
- Mentor: Har bandni o'qing va u **to'g'ri qoidami** yoki **xato** ekanini belgilang.
- Yorliq: joylashga tayyorlik ro'yxati
- Bandlar (navbat bilan; har bandda tugmalar: ✓ To'g'ri · ✕ Xato):
  - Token kodda yozilmagan: bot uni `process.env.BOT_TOKEN` dan o'qiydi — ✔ To'g'ri
  - Kod laptopda sinalmagan — to'g'ridan-to'g'ri serverga joylaymiz — ✔ Xato
  - Fallback handler bor: mos handler topilmasa ham bot javob beradi — ✔ To'g'ri
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Javob izohlari (3/3 dan keyin):
  - Hammasi to'g'ri: ✓ Hammasi to'g'ri — kod avval laptopda sinaladi, keyin serverga joylanadi.
  - Xato bo'lsa: Qarang: sinalmagan kodni serverga joylash — xato, avval laptopda sinaladi. Token kodda emasligi va fallback handler borligi esa — to'g'ri qoidalar.
- Tugmalar: Orqaga · Har bandni tekshiring (N/3) → Davom etish

## 12 · Serverdagi bot tunda
- Eyebrow: Hayotiy · to'liq bot
- Sarlavha: Serverdagi bot 03:00 da buyurtma qabul qiladi.
- Mentor: Laptopingiz yopiq, bot serverda ishlayapti. Suhbatni qadam-baqadam oching va har javob ostida qaysi qism ishlaganiga qarang.
- Chat (AvtoPizza · bot), xabarlar navbat bilan:
  1. mijoz: 03:00 — Achchiq bo'lmagan pitsa bormi?
     bot: Ha, Margarita achchiq emas: pomidor sousi va pishloq. Buyurtma qilasizmi?
     tugma: Margarita
     ishladi: AI (bu savolga tayyor handler yo'q)
  2. mijoz: Margarita
     bot: Margarita — 35 000 so'm. Buyurtmangizni yozib oldim. Manzilingizni yuboring.
     ishladi: handler + baza (buyurtma bazaga yozildi)
  3. mijoz: Chilonzor, 5-kvartal
     bot: Qabul qilindi. Buyurtmangiz 30 daqiqada yetib boradi. Rahmat!
     ishladi: handler + baza (holatdan manzil kutilayotgani bilindi, manzil buyurtmaga qo'shildi)
- Tugma: ▶ Suhbatni boshlash → Keyingi xabar → → ✓ Suhbat tugadi
- Xulosa (3/3 dan keyin): Bu suhbatda bot, baza va AI laptopsiz ishladi. Shuning uchun serverda faqat bot.js emas: bot serverdan bazaga ulana olishi va AI API kaliti server sozlamalarida turishi kerak.
- Tugmalar: Orqaga · Suhbatni davom ettiring (N/3) → Davom etish

## 13 · Yana ikki qoida
- Eyebrow: Amalda · 2 qoida
- Sarlavha: Serverdagi bot uchun yana ikki qoida.
- Mentor: Serverdagi botni doim ko'rib o'tirmaysiz. Xato bo'lsa, buni birinchi bo'lib mijoz sezadi — shuning uchun ikkala qoidani oldindan qo'llang.
- Kartalar:
  - **1. Xatoni ushlang** — AI javob bermasa yoki bazaga ulanib bo'lmasa, kod xato beradi. Xato ushlanmasa, bot to'xtab qolishi mumkin. Telegraf'da buning uchun `bot.catch` bor: xatoni ushlab, mijozga «Uzr, hozir javob bera olmadim. Birozdan keyin qayta yozing» deb yozasiz. Bu fallback handler emas: fallback mos handler topilmaganda ishlaydi, `bot.catch` — kod xato berganda.
  - **2. Kuzatib turing** — Server ham to'xtashi mumkin. Vaqti-vaqti bilan botingizga /start yozib ko'ring. Javob kelmasa, hosting sahifasida bot holatini tekshirib, uni qayta ishga tushirasiz.
- Tugma: Tushundim → ✓ Tushundim
- Tugmalar: Orqaga · Tushundingiz ✓ → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Laptopingiz yopiq, lekin bot hali ham javob beryapti. Nega?
  - Telegram bot dasturini o'z serverida ishlatadi
  - ✔ Bot dasturi serverga joylangan, o'sha yerda ishlaydi
  - Javoblar oldindan yozilib, navbatda turgan edi
  - Mijoz botni o'z telefonida ishga tushirib qo'ygan
- Javob izohlari:
  - To'g'ri: Bot dasturi serverda ishlayapti — laptop yopilishi unga ta'sir qilmaydi.
  - Telegram … o'z serverida: Telegram faqat xabarni yetkazadi. Javobni sizning bot dasturingiz yozadi — u serverda ishlayapti.
  - Javoblar oldindan yozilib: Javoblar oldindan yozilmaydi: har xabarga bot dasturi o'sha paytda javob yozadi.
  - Mijoz … ishga tushirib: Mijoz botni ishga tushirmaydi — u faqat xabar yozadi. Dastur serverda ishlab turibdi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Deploy tartibi (final)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: deploy tartibini yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Botni yig'ing: handlerlar, baza va AI
  2. Laptopda ishga tushirib sinang
  3. Serverda BOT_TOKEN ni sozlang
  4. Kodni serverga joylab, ishga tushiring
  5. Botga /start yozib tekshiring
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Javob izohlari:
  - To'g'ri: ✓ Deploy tartibi to'g'ri: avval laptopda yig'ib sinaysiz, keyin serverda tokenni sozlab, kodni joylaysiz va /start bilan tekshirasiz.
  - To'g'ri yig'ilgach 2- va 3-qadam orasida: ↑ laptop · ↓ server
  - Xato (kod serverga tokendan oldin joylansa): Serverda token sozlanmagan bo'lsa, bot ishga tushmaydi — tokenni avval yozing.
  - Xato (boshqa holatda): Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
  - Birinchi xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · server
- Eyebrow: Amaliyot · server
- Sarlavha: Botingizni serverga joylashga tayyorlang
- Mentor: Topshiriqni **o'z kompyuteringizda** bajaring. Har qadamdan keyin **«Bajardim»** ni bosing — keyingisi ochiladi.
- TOPSHIRIQ: O'z botingizni serverga joylashga tayyorlang: laptopda sinang, sirlarni tekshiring, xatoni ushlang va deploy rejasini yozing.
- Qadamlar (navbat bilan; bajarilgani ✓ bilan qatorga yig'iladi):
  1. Botingizni laptopda ishga tushiring va tekshiring: /start, menyu, erkin savol (AI javob beradi), buyurtma bazaga yoziladi.
  2. Token va AI API kaliti `.env` faylida, `.env` esa `.gitignore` da ekanini tekshiring — kodda faqat `process.env` qolsin.
  3. `bot.catch` qo'shing: xato bo'lsa, bot mijozga «Uzr, birozdan keyin qayta yozing» deb javob yuborsin.
  4. gemini.google.com'dan so'rang: «Telegraf botini to'xtovsiz ishlatish uchun qaysi hosting xizmatlari bor va deploy qadamlari qanday?». Uchta narsaga qarang: Node.js'ni ishga tushiradimi, sozlamalarga `BOT_TOKEN` yozish mumkinmi, bepul yoki arzon rejasi bormi. Javobni Mentor bilan ko'rib, bitta xizmatni tanlang.
  5. Tanlangan xizmat uchun deploy rejasini yozing: kod qayerga yuklanadi, `BOT_TOKEN` qayerga yoziladi, bot qanday ishga tushadi.
- Tugma (har qadamda): Bajardim
- Hammasi bajarilgach: ✓ Bajarildi — Mentorni kuting · Tayyorlik tugadi. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- 18-ekran · Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq botning to'rt qismi qaysilar? | Token, handlerlar, baza, AI | Har qism o'z ishini qiladi |
| Buyurtmani ertasi kungacha qaysi qism saqlaydi? | Baza (PostgreSQL) | Diskda turadi — bot qayta ishga tushsa ham yo'qolmaydi |
| Handlerda tayyor javobi yo'q erkin savolga kim javob yozadi? | AI | Siz yozgan system prompt bo'yicha |
| Bot dasturi laptopda bo'lsa, laptop yopilganda nima bo'ladi? | Bot javob bermaydi | Xabar Telegram'da kutib turadi, dastur esa to'xtagan |
| Internetga ulangan, to'xtamay ishlashga mo'ljallangan kompyuter nima deyiladi? | Server | Uni hosting xizmatidan ijaraga olasiz |
| Kodni serverga joylab, u yerda ishga tushirish nima deyiladi? | Deploy | Shundan keyin laptop yopiq bo'lsa ham bot ishlaydi |
| Kodni Git orqali serverga joylaganda `.env` nega bormaydi? | U .gitignore da | Shuning uchun `BOT_TOKEN` serverda alohida sozlanadi |
| Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rasa, bu qaysi usul? | Polling | `bot.launch()` shu usulda ishlaydi |
| Telegram yangi xabarni botning internetdagi manziliga o'zi yuborsa, bu qaysi usul? | Webhook | Botga ochiq manzil (URL) kerak |
| Kichik bot uchun qaysi usul soddaroq? | Polling | Qo'shimcha sozlash kerak emas, serverda ham ishlaydi |
| AI yoki baza javob bermasa, bot jim qolmasligi uchun nima qilinadi? | Xato ushlanadi | Telegraf'da `bot.catch` — mijozga «birozdan keyin yozing» deyiladi |
| Kodni serverga joylashdan oldin uni qayerda sinaysiz? | Laptopda | Xatoni serverga chiqmasdan oldin topasiz |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: ✓ Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- 19-ekran · Eyebrow: Tayyor
- Belgi: ✓ Bot serverga tayyor
- Sarlavha: Endi botni serverga joylash tartibini bilasiz. (yonida ball halqasi)
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - To'liq bot — to'rt qism: token, handlerlar, baza (PostgreSQL) va AI
  - Bot dasturi laptopda bo'lsa, laptop yopilganda u ham to'xtaydi; server esa to'xtamay ishlashga mo'ljallangan
  - `.env` serverga kod bilan bormaydi — `BOT_TOKEN` va AI API kaliti server sozlamalariga yoziladi
  - Polling — bot so'raydi, sozlash oson; webhook — Telegram o'zi yuboradi, ochiq manzil kerak
  - Deploy tartibi: laptopda sinash → serverda token → kodni joylash → /start bilan tekshirish
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Tayyorlang** — botingiz laptopda to'liq ishlashini tekshiring: /start, menyu, erkin savol va buyurtma bazaga yozilishi
  - **Rejalang** — amaliyotda tanlagan xizmat uchun deploy qadamlarini yozing: kod qayerga yuklanadi, `BOT_TOKEN` qayerga yoziladi, bot qanday ishga tushadi
  - **Sinang** — botni serverga joylagach, laptopingizni yoping va botga /start yozing: javob kelsa, bot serverda ishlayapti
- Keyingi dars — **«Botingizni ishlatgan odamdan nimani so'raysiz?»** Botingizni sinab ko'rgan odamdan u aynan nima qilganini so'rashni va eshitganingizni yozib olishni o'rganamiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: Nishonlar — N/4
- **Bot Builder** — To'liq botni birinchi urinishda to'g'ri yig'dingiz (5-ekran)
- **Safe Deploy** — Tokenni serverga kodga yozmasdan yetkazdingiz (7-ekran)
- **Message Catcher** — Kichik bot uchun xabar olishning mos usulini tanladingiz (9-ekran)
- **Launch Ready** — Serverga joylashdan oldingi tekshiruvni birinchi urinishda to'g'ri bajardingiz (11-ekran)
- Nishon qoidasi yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi.
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. To'liq bot — to'rt qism (4-ekran)
   - 1 · Har qism — o'z ishi — Token botni tanitadi, handlerlar tayyor javob beradi, baza saqlaydi, AI erkin savolga javob yozadi.
   - 2 · Eslab qolish — baza ishi — Buyurtma ertasi kungacha kerak bo'lsa, u **bazaga (PostgreSQL)** yoziladi va diskda turadi.
   - 3 · Birga ishlaydi — Bitta suhbatda to'rttasi ham ishlaydi — handler tugmaga, AI erkin savolga javob beradi, baza buyurtmani saqlaydi.
   - Sinfga savol: Buyurtmani ertasi kungacha qaysi qism saqlaydi?
2. Token serverda (8-ekran)
   - `.env` · `.env` serverga bormaydi — U `.gitignore` da, Git uni yuklamaydi.
   - `BOT_TOKEN=…` · Token server sozlamalariga yoziladi — `BOT_TOKEN` nomi bilan — kod uni `process.env` dan o'qiydi.
   - `process.env.AI_API_KEY` · AI API kaliti ham shunday — Sirlar kodda emas, sozlamada turadi.
   - Sinfga savol: Nega serverda BOT_TOKEN ni alohida sozlaymiz?
3. Polling va webhook (10-ekran)
   - `bot.launch()` · Polling — Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?».
   - 2 · Webhook — Telegram yangi xabarni botning internetdagi manziliga (URL) yuboradi; buning uchun ochiq manzil kerak.
   - 3 · Kichikdan boshlang — Polling qo'shimcha sozlashsiz ishlaydi, serverda ham.
   - Sinfga savol: Kichik bot uchun qaysi usul soddaroq?
4. Nega server kerak (14-ekran)
   - 1 · Laptop yopilsa, dastur to'xtaydi — Bot javob bermaydi.
   - 2 · Server to'xtamay ishlashga mo'ljallangan — Bot laptop yopiq bo'lsa ham javob beradi.
   - 3 · Shuning uchun deploy qilamiz — Kodni serverga joylab, u yerda ishga tushiramiz.
   - Sinfga savol: Laptop yopiq, lekin bot javob beryapti — nega?
5. Deploy tartibi (15-ekran)
   - 1 · Avval — laptopda — Botni yig'ib, ishga tushirib sinaysiz.
   - 2 · Keyin — serverda — Tokenni sozlaysiz, kodni joylab, ishga tushirasiz.
   - `/start` · Oxirida — tekshiruv — Botga /start yozib, javob kelishini ko'rasiz.
   - Chizma: Yig'ish → Laptopda sinash → Serverda token → Joylash → /start bilan tekshirish
   - Sinfga savol: Nega kodni serverga joylashdan oldin laptopda sinaymiz?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: deploy · bot.js · server · polling · .env · webhook · PostgreSQL · BOT_TOKEN · bot.catch · ✓ · fallback · AI · token

1. To'liq botning to'rt asosiy qismi qaysilar?
   - Token, API, dizayn va reklama
   - ✔ Token, handlerlar, baza va AI
   - Handlerlar, rasm, video va musiqa
   - Telegram, telefon, laptop va internet
2. Buyurtmani ertasi kungacha qaysi qism saqlaydi?
   - Token
   - Handler
   - AI
   - ✔ Baza
3. Deploy nima degani?
   - ✔ Kodni serverga joylab, u yerda ishga tushirish
   - Botni butunlay o'chirib, qaytadan yaratish
   - Eski tokenni yangisiga almashtirib qo'yish
   - Botga yangi mijozlarni taklif qilib chiqish
4. Server — bu nima?
   - Telegram ichidagi maxsus kanal
   - Laptopingizdagi alohida papka
   - ✔ To'xtamay ishlashga mo'ljallangan kompyuter
   - Mijoz telefonidagi Telegram ilovasi
5. Botni serverga joylasak, nima o'zgaradi?
   - Bot ancha sekin javob bera boshlaydi
   - ✔ Laptop yopiq bo'lsa ham bot javob beradi
   - Bot faqat kunduzi javob beradigan bo'ladi
   - Hech narsa, hammasi avvalgidek qoladi
6. Serverda BOT_TOKEN qayerga yoziladi?
   - ✔ Server sozlamalariga, kod uni process.env dan o'qiydi
   - bot.js ichiga, kod bilan birga yuklanadi
   - Botning Telegram'dagi tavsifiga yoziladi
   - Hech qayerga, server uni o'zi topadi
7. Polling'da yangi xabarni kim so'raydi?
   - Mijoz — u Telegram'dan qayta-qayta so'raydi
   - Telegram — u botdan qayta-qayta so'raydi
   - Server — u mijozdan qayta-qayta so'raydi
   - ✔ Bot — u Telegram'dan qayta-qayta so'raydi
8. Webhook'da yangi xabarni botga kim yetkazadi?
   - Bot o'zi — Telegram'dan qayta-qayta so'rab oladi
   - ✔ Telegram — xabarni botning manziliga o'zi yuboradi
   - Mijoz — xabarni to'g'ridan-to'g'ri serverga yozadi
   - Hech kim — xabar botda o'zi paydo bo'ladi
9. Kichik bot uchun qaysi usul soddaroq?
   - Webhook
   - Ikkalasini birga ishlatish
   - ✔ Polling
   - Hech qaysi, bot o'zi biladi
10. Kodni serverga joylashdan oldin nima qilinadi?
    - Token kodga ochiq yozib qo'yiladi
    - Hech narsa, kod to'g'ridan-to'g'ri joylanadi
    - Laptopdagi baza o'chirib tashlanadi
    - ✔ Kod laptopda ishga tushirib sinaladi
11. AI javob bermasa ham bot jim qolmasligi uchun nima qilinadi?
    - ✔ Xato ushlanadi va mijozdan uzr so'raladi
    - Bot har safar qo'lda qayta yoqiladi
    - @BotFather'dan yangi token olinadi
    - Hech narsa, bot o'zi tiklanib ketadi
12. Laptop yopiq, lekin bot javob beryapti. Sababi?
    - Javoblar oldindan navbatda turgan edi
    - Telegram bot dasturini o'zi ishlatadi
    - ✔ Bot dasturi serverda ishlayapti
    - Mijoz botni o'zi ishga tushirgan
