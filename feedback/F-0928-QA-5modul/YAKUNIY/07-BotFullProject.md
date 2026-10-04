# 7-dars «Loyiha kuni: bot + DB + AI» — yakuniy matn

Fayl: `src/5-Modull/BotFullProjectLesson.jsx` · 11 ekran · Keyingi dars: «Botingizni ishlatgan odamdan nimani so'raysiz?»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish — soat 02:14
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Soat 02:14. Mijoz yozdi — bot nega jim?
- Mentor: Kunduzi botingiz yaxshi ishladi, kechqurun laptopni yopdingiz — «▶ Nima bo'lishini ko'rish»ni bosing.
- Chat (AvtoPizza · bot):
  - mijoz: 02:14 — Salom! Hozir buyurtma bersam bo'ladimi?
  - mijoz (tugma bosilgach): 02:21 — Hali ham javob yo'q…
- Tugma: ▶ Nima bo'lishini ko'rish → ✓ Ko'rdingiz
- Savol (tugma bosilgach): Nega bot javob bermadi?
  - Bot kodida kechasi kutilmagan xato chiqdi
  - ✔ Bot dasturi laptop bilan birga to'xtadi
  - Telegram tunda botlarga xabar yetkazmaydi
- Javob izohlari:
  - 2-variant: **Aynan!** Bot dasturi laptopingizda ishlardi — laptop yopilganda u ham to'xtadi.
  - 1 yoki 3-variant: **Qiziq fikr!** Chatga qarang: xabar yetib keldi, javob yo'q. Javobni yozadigan dastur laptopda edi — u yopildi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida botingiz laptopsiz ishlaydi.
- Mentor: Yangi kod kam — asosiy ish botni GitHub orqali serverga joylash; AvtoPizza namuna, sizniki o'z botingiz.
- Yorliq: dars oxirida — namuna: AvtoPizza · 03:00
- Chat (AvtoPizza · bot · serverda):
  - mijoz: 03:00 — /start
  - bot: Yana salom, Aziz! AvtoPizza'ga xush kelibsiz!
  - Tugmalar: Menyu · Buyurtma
  - mijoz: «Menyu» bosildi
  - bot: Tanlang:
  - Tugmalar: Margarita · Pepperoni · Pishloqli
- Izoh: laptop yopiq · bot Render'da
- Yorliq: Bugungi 3 qadam
  1. Buyurtmalar jadvali — bot buyurtmani alohida saqlaydi
  2. Serverga tayyorlash — webhook va xato-ushlagich, GitHub'ga push
  3. Deploy — Render'da server, sirlar sozlamada, telefondan sinash
- Izoh: repo `TelegramBotNest` · boshlang'ich holat `dars-07-start` · tayyor namuna `dars-07-done`
- Tugmalar (telefonda): 3 qadamni ko'rish · ↩ Botni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Tushuncha — kod serverga qanday boradi
- Eyebrow: Tushuncha · server
- Sarlavha: Kod serverga boradi. .env ham boradimi?
- Mentor: Server — to'xtamay ishlaydigan ijara kompyuter; «▶ Serverga joylash»ni bosib, nima ko'chib, nima qolishini ko'ring.
- Chizma (uch quti, o'qlar «git push» va «deploy»):
  - Laptop: `src/` · `Dockerfile` · `.env` (qulf belgisi bilan)
  - GitHub (o'z repo'ngiz): `src/` · `Dockerfile` · `.env` — yo'q — .gitignore
  - Server (Render): `src/` · `Dockerfile` · Environment: `BOT_TOKEN` · `DATABASE_URL` · `GEMINI_API_KEY`
- Tugma: ▶ Serverga joylash → ✓ Ko'rdingiz
- Natija (tugmadan keyin): `.env` serverga bormaydi. Sirlarni server sozlamalariga yozasiz, kod ularni `config` dan o'qiydi.
- Tugmalar: Orqaga · Serverga joylang → Davom etish

## 3 · Amaliyot 1 — buyurtmalar jadvali
- Eyebrow: Amaliyot 1 · baza
- Sarlavha: Buyurtmalar alohida jadvalda saqlansin.
- Mentor: 4-darsda `users` jadvalini qo'shgansiz — endi o'sha yo'l bilan ikkinchi jadval: «1 · Ochish»dan boshlang.
- Qadamlar (har biri «Bajardim» bilan tasdiqlanadi, bajarilgani ✓ bilan qisqaradi):
  1. Ochish — Antigravity'da `TelegramBotNest`, terminalda `npm run start:dev`, «Telegram bot ulandi».
  2. Prompt — qavsni o'z botingizga moslang, «Nusxalash», Antigravity'ga.
     - Prompt qutisi (Siz → Antigravity · tugma: Nusxalash → ✓ Nusxalandi):
       - src/core/entity/ da yangi entity {Buyurtma} yarat (users kabi, BaseEntity'dan): ustunlar telegram_id, {nima tanlandi}, {manzil yoki boshqa ma'lumot}.
       - {tasdiqlanadigan hodisa} da bu jadvalga yangi qator yozilsin, users.holat eskidek ishlasin.
       - /buyurtmalarim buyrug'i oxirgi 3 ta qatorni ko'rsatsin. synchronize: true qoladi — jadval o'zi yaratiladi.
  3. Ishga tushirish — terminal xatosiz; AI kodini o'qing: entity `@Entity('…')` bilanmi, service `@InjectRepository` bilanmi (4-darsdagi kabi).
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Telegramda tekshirish — buyurtmani oxirigacha bering, keyin `/buyurtmalarim` → oxirgi buyurtma chiqadi.
- Yorliq (o'ngda): kutilgan natija · namuna: AvtoPizza
- Kutilgan natija (chat):
  - mijoz: Chilonzor, 12-uy
  - bot: Buyurtma tasdiqlandi: Pepperoni · Chilonzor, 12-uy
  - mijoz: /buyurtmalarim
  - bot: 1 · Pepperoni · Chilonzor, 12-uy · 03.10 00:42
- Izoh: Ortda qoldingizmi — mentor bilan `git checkout -f dars-07-start`
- Bajarilgach: Ikkinchi jadval ham sizniki. Bot qayta ishga tushsa ham, buyurtmalar turadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega serverda BOT_TOKEN alohida sozlanadi?
  - ✔ Token yozilgan fayl serverga kod bilan bormaydi
  - Serverda Telegram botga boshqa token beradi
  - Token faqat bir kun ishlaydi, keyin almashadi
  - Laptopdagi token serverda ishlamay qoladi
- Javob izohlari:
  - To'g'ri: `.env` `.gitignore` da — Git uni serverga yuklamaydi.
  - 2-variant: Token bitta — uni @BotFather bergan.
  - 3-variant: Token /revoke qilinmaguncha ishlayveradi.
  - 4-variant: Token istalgan kompyuterda ishlaydi — fayl bormaydi.
- Nishon qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Test ekranlarining umumiy yozuvlari (4, 7-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Tushuncha — xabar yo'li
- Eyebrow: Tushuncha · xabar yo'li
- Sarlavha: Serverdagi bot yangi xabarni qanday oladi?
- Mentor: Laptopda bot o'zi so'rab turardi, bepul server esa jim turganda uxlaydi — ikkala yo'lni bosib, farqini ko'ring.
- Tugmalar (ketma-ket, bittadan): ▶ Polling — laptopda · ▶ Webhook — serverda (bosilgani ✓ bilan qoladi, ↻ qayta ochadi)
- Polling:
  - Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?». Shunday ishlaydi: `bot.launch()`.
  - bot → Telegram: Yangi xabar bormi?
  - Telegram → bot: Yo'q.
  - bot → Telegram: Yangi xabar bormi?
  - Telegram → bot: Ha, bitta: «Salom!»
  - bot javob beradi
- Webhook:
  - Telegram yangi xabarni botning internetdagi manziliga o'zi yuboradi. Ochiq manzil kerak — uni server beradi.
  - Telegram → avtopizza.onrender.com/telegram: «Salom!»
  - server → bot: uyg'ondi
  - bot javob beradi
- Natija (ikkalasi ko'rilgach): Laptopda polling — manzil yo'q. Serverda webhook — manzil bor, uxlagan server xabar kelganda uyg'onadi.
- Tugmalar: Orqaga · Ikkalasini ko'ring (0/2 → 1/2 → 2/2) → Davom etish

## 6 · Amaliyot 2 — serverga tayyorlash
- Eyebrow: Amaliyot 2 · GitHub
- Sarlavha: Botni serverga tayyorlang va GitHub'ga yuboring.
- Mentor: Serverda webhook, laptopda polling — ikkalasini bitta shart hal qiladi; «1 · Ochish»dan boshlang.
- Qadamlar (har biri «Bajardim» bilan tasdiqlanadi):
  1. Ochish — `telegram.service.ts` ochiq, `npm run start:dev` ishlayapti.
  2. Prompt — o'zgartirmasdan «Nusxalash», Antigravity'ga.
     - Prompt qutisi (Siz → Antigravity · tugma: Nusxalash → ✓ Nusxalandi):
       - config ga WEBHOOK_URL qo'sh: process.env.WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || ''.
       - TelegramService da: WEBHOOK_URL bo'sh bo'lsa — hozirgidek bot.launch() (polling); bo'lsa — bot.telegram.setWebhook(WEBHOOK_URL + '/telegram') va konsolga «Telegram bot ulandi (webhook)».
       - POST /telegram controller yarat: kelgan body'ni bot.handleUpdate ga beradi.
       - bot.catch qo'sh: xato bo'lsa mijozga «Uzr, birozdan keyin qayta yozing» deb javob bersin, xatoni konsolga yozsin.
  3. Ishga tushirish — laptopda `WEBHOOK_URL` yo'q → terminalda hali ham «Telegram bot ulandi» (polling). Telegramda /start — ishlaydi.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. GitHub'ga yuborish — terminalda uch buyruq; GitHub'dagi repo'ngizda yangi commit ko'rinadi.
     ```js
     git add -A
     git commit -m "7-dars: serverga tayyor"
     git push
     ```
- Yorliq (o'ngda): kutilgan natija · terminal
- Kutilgan natija (terminal):
  ```js
  Telegram bot ulandi
  …
  $ git push
  [main 3f2a9c1] 7-dars: serverga tayyor
   4 files changed
  To https://github.com/{siz}/TelegramBotNest.git
  ```
- Izoh: Ortda qoldingizmi — mentor bilan `git checkout -f dars-07-start`
- Bajarilgach: Kod GitHub'da. Server uni shu yerdan oladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Polling va webhook — asosiy farqi nima?
  - Polling faqat kompyuterda, webhook faqat telefonda ishlaydi
  - Polling matnli xabar uchun, webhook rasm va fayl uchun
  - Webhook faqat kechasi, polling esa kunduzi ishlaydi
  - ✔ Polling'da bot so'raydi, webhook'da Telegram o'zi yuboradi
- Javob izohlari:
  - To'g'ri: Farq — xabarni kim boshlab uzatadi: bot yoki Telegram.
  - 1-variant: Ikkala usul ham serverda ishlaydi — farq qurilmada emas.
  - 2-variant: Ikkala usul ham har qanday xabarni yetkazadi.
  - 3-variant: Ikkalasi ham istalgan vaqtda ishlaydi.
- Nishon qatori va umumiy yozuvlar — 4-ekrandagidek.

## 8 · Amaliyot 3 — Render
- Eyebrow: Amaliyot 3 · Render
- Sarlavha: Botni serverga joylang, laptopni yoping.
- Mentor: Render kodni GitHub'dan oladi, siz faqat uchta sirni yozasiz — «1 · Server ochish»dan boshlang.
- Qadamlar (har biri «Bajardim» bilan tasdiqlanadi):
  1. Server ochish — render.com → «Sign in with GitHub» → «New → Web Service» → o'z `TelegramBotNest` repo'ngizni tanlang. Render `Dockerfile`ni o'zi ko'radi, tarif **Free**.
  2. Sirlar — «Environment» bo'limiga uchta qator: `BOT_TOKEN` (BotFather), `DATABASE_URL` (Neon, 4-dars), `GEMINI_API_KEY` (6-dars). Qiymatlarni `.env` dan ko'chiring. Chatga, skrinshotga yozmang.
  3. Deploy — «Deploy Web Service». Loglarda 2–4 daqiqada: «Server …-portda ishlayapti» va «Telegram bot ulandi (webhook)».
     - Xato bo'lsa, log matnini Antigravity'ga: «Render logida shu xato: {xato}. Sabab nima?»
  4. Laptopsiz tekshirish — laptopdagi botni to'xtating (terminalda Ctrl+C — bitta token ikki joyda ishlamaydi). Telefondan `/start`, `/menu`, bitta buyurtma. Birinchi javob 30–60 soniya kechikishi mumkin — server uyg'onyapti.
- Yorliq (o'ngda): kutilgan natija · AvtoPizza · 03:00 · laptop yopiq
- Kutilgan natija (chat · bot · serverda):
  - mijoz: /start
  - bot: (… 40 s) Yana salom, Aziz! AvtoPizza'ga xush kelibsiz!
  - Tugmalar: Menyu · Buyurtma
  - mijoz: Achchiq bo'lmagani qaysi?
  - bot: Margarita achchiq emas: pomidor sousi va pishloq. Tanlaysizmi? (AI)
- Izoh: Bepul server 15 daqiqa jimlikdan keyin uxlaydi, xabar kelganda uyg'onadi.
- Bajarilgach: Botingiz serverda. Laptop yopiq — javob keladi.
- Nishon qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (nishon bonusi: oxirgi «Bajardim» da)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Bot serverda · N/2 to'g'ri
- Sarlavha: Laptop yopiq — bot javob beradi.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Yorliq: Takrorlash — kartochkalar (12 ta, "Kartochkalar" bo'limida)
- Keyingi dars — «Botingizni ishlatgan odamdan nimani so'raysiz?». Botingiz endi tunda ham ishlaydi — keyingi darsda uni sinab ko'rgan odamdan nima qilganini so'rashni o'rganasiz.
- Nishonlaringiz — N/3 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq botning to'rt qismi qaysilar? | Token, handlerlar, baza, AI | Har qism o'z ishini qiladi |
| Bot dasturi laptopda bo'lsa, laptop yopilganda nima bo'ladi? | Bot javob bermaydi | Xabar Telegram'da kutib turadi |
| Internetga ulangan, to'xtamay ishlaydigan ijara kompyuter? | Server | Botlar uchun hosting'dan olinadi |
| Kodni serverga joylab, u yerda ishga tushirish nima deyiladi? | Deploy | Bizda: GitHub → Render |
| Kod serverga qaysi yo'l bilan boradi? | GitHub orqali | Render o'z repo'ngizdan oladi |
| `.env` nega serverga bormaydi? | U .gitignore da | Sirlar «Environment» ga yoziladi |
| Serverga qaysi uch sir yoziladi? | BOT_TOKEN, DATABASE_URL, GEMINI_API_KEY | Qiymatlar `.env` dan, chatga emas |
| Bot «yangi xabar bormi?» deb so'rasa — usul? | Polling | Laptopda: `bot.launch()` |
| Telegram xabarni bot manziliga o'zi yuborsa — usul? | Webhook | Serverda: `/telegram` manzili |
| Bepul server jim turganda nima bo'ladi? | Uxlaydi | Webhook xabari kelganda uyg'onadi |
| Bitta tokenni laptop va serverda birga ishlatsa? | Ishlamaydi | Serverga joylagach laptopdagini to'xtating |
| AI yoki baza javob bermasa bot jim qolmasligi uchun? | bot.catch | Mijozga «birozdan keyin yozing» |

- Hammasi bilinganda: Hammasini bilasiz! · N/N atama yodlandi · ↻ Qaytadan takrorlash

## Nishonlar
- Safe Deploy — Tokenni serverga kodga yozmasdan yetkazdingiz (4-ekran, 1-savol)
- Message Catcher — Polling va webhook farqini topdingiz (7-ekran, 2-savol)
- Launch Ready — Botni serverga joylab, laptopsiz sinadingiz (8-ekran, Amaliyot 3)
- Nishon qatori (nishonli ekranlarda): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yakun ekranida: Nishonlaringiz — N/3

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Sirlar serverga qanday boradi»
   - 1 · Kod GitHub orqali — Server kodni sizning repo'ngizdan oladi.
   - .env · `.env` qoladi — U `.gitignore` da, Git uni yuklamaydi.
   - 3 · Sirlar sozlamada — «Environment» bo'limiga yoziladi, kod `config` dan o'qiydi.
   - Sinfga savol: Nega serverda BOT_TOKEN alohida sozlanadi?
2. 2-savol (7-ekran) — «Kim boshlab uzatadi»
   - bot.launch() · Polling — Bot Telegram'dan qayta-qayta so'raydi. Laptopda shunday.
   - setWebhook(url) · Webhook — Telegram xabarni bot manziliga o'zi yuboradi. Serverda shunday.
   - 3 · Nega serverda webhook — Bepul server uxlaydi; webhook xabari uni uyg'otadi.
   - Sinfga savol: Polling va webhook — asosiy farqi nima?

## Jonli viktorina (12 savol)
Savol vaqti 15 soniya. Arena yorliqlari: 1 — To'liq bot · 2 — Token serverda · 3 — Polling va webhook · 4 — Server · 5 — Deploy tartibi (savollar tartibi bo'yicha)
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
9. Laptopda bot qaysi usulda ishlaydi?
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
