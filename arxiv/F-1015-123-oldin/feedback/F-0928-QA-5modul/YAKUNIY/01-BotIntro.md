# 1-dars «Bot nima» — yakuniy matn

Fayl: `src/5-Modull/BotIntroLesson.jsx` · 20 ekran · Keyingi dars: «Botingizni birinchi kim ochadi?»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish — 03:00
- Eyebrow: Kirish
- Sarlavha: Soat 03:00. Mijoz yozdi — kim javob beradi?
- Mentor: Tasavvur qiling: siz AvtoPizza uchun Telegram-bot yozgansiz va hozir uxlayapsiz. Tugmani bosing va nima bo'lishini ko'ring.
- Chat (AvtoPizza · bot · onlayn):
  - mijoz: Salom, hali ochiqmisiz?
  - bot: Salom! Ha, buyurtma qabul qilyapmiz. Menyuni ko'rasizmi?
  - tugmalar: Menyu · Buyurtma · Manzil
- Tugma: ▶ Mijoz xabar yozdi (03:00) → ✓ Bot javob berdi (03:00)
- Savol: Sizningcha, kim javob berdi?
  - Men — telefonni olib, qo'lda javob berdim
  - ✔ Bot — men uxlaganimda ham o'zi javob berdi
  - Hech kim — mijoz kutib, ketib qoldi
- Javob izohlari:
  - 2-variant: **Aynan!** Javobni bot berdi: u odam emas, dastur boshqaradigan akkaunt. Dasturi ishlab tursa, kechasi ham javob beradi.
  - 1 yoki 3-variant: **Qiziq fikr!** Chatga qarang: javob 03:00 da keldi, siz uxlab yotgan edingiz. Demak, javobni bot berdi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun: bot xabarga qanday javob beradi?
- Mentor: JS darslarida hodisani ko'rgansiz: tugma bosiladi — kod ishlaydi. Bot ham shunday: xabar keladi — handler ishlaydi va javob yuboradi.
- Chizma: /start (hodisa) → bot.start (handler) → Salom! (javob)
- Bugungi 4 qadam:
  1. Token, handler va sikl — botning uchta asosiy tushunchasi
  2. Hodisa → handler → javob
  3. Tokenni qayerda saqlash kerak
  4. 03:00 sinovi — handlerlarni o'zingiz yozasiz
- Tugma (telefonda): 4 qadamni ko'rish / ↩ Chizmani ko'rish
- Tugma: Boshlaymiz →

## 2 · Uch tushuncha
- Eyebrow: Tushuncha · uch asos
- Sarlavha: Botning uchta asosiy tushunchasi: token, handler, sikl.
- Mentor: Haqiqiy botda qismlar ko'proq bo'ladi, lekin hammasi shu uchtasiga tayanadi. Har birini bosing.
- Kartalar:
  - Token — Bot aynan sizniki ekanini tasdiqlaydigan maxfiy qator. Uni @BotFather beradi. Telegram uni botning kaliti deb ataydi: Bot API faqat to'g'ri token bilan kelgan so'rovni qabul qiladi.
  - Handler — «Shu hodisa kelsa, shuni qil» deydigan kod qismi. Masalan: /start kelsa — salom va menyu yuborilsin. Botda odatda bir nechta handler bo'ladi.
  - Sikl — Bot dasturi ishlab turadi va hodisani kutadi: kutadi → hodisa keladi → handler ishlaydi → javob ketadi → yana kutadi.
- Tugma: 3 tushunchani oching (N/3) → Davom etish

## 3 · Skript va bot
- Eyebrow: Tushuncha · skript va bot
- Sarlavha: Bitta xabar, uch holat. Farqi nimada?
- Mentor: Soat 03:00 da xabar keldi. Uni kim qanday kutib olishini bosib ko'ring.
- Kartalar:
  - Siz — Uxlab yotibsiz. Xabar javobsiz qoladi, uni ertalab ko'rasiz.
  - Oddiy skript — Yuqoridan pastga bir marta ishlaydi va tugaydi. Xabar kelganda u allaqachon to'xtagan — xabarni ko'rmaydi.
  - Bot — Dasturi ishlab turibdi va hodisani kutyapti. Xabar kelishi bilan mos handler ishlaydi va javob ketadi.
- Xulosa: Skript ishlab tugaydi; bot ishlab turadi va keyingi hodisani kutadi. Shuning uchun kechasi ham javob beradi.
- Tugma: Uchalasini sinang (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Ko'rsatma: To'g'ri javobni tanlang
- Savol: Bot oddiy skriptdan nimasi bilan farq qiladi?
  - Internetsiz, faqat kompyuter ichida ishlaydi
  - Faqat bitta odam bilan gaplasha oladi
  - Bir marta yuqoridan pastga ishlab, to'xtaydi
  - ✔ Ishlab turadi va yangi hodisani kutadi
- Javob izohlari:
  - To'g'ri: Bot sikl ichida ishlaydi — dasturi yoniq tursa, kechasi ham hodisani kutib, javob beradi.
  - A: Aksincha, bot Telegram orqali ishlaydi — internetsiz xabar kelmaydi.
  - B: Bot bir vaqtda ko'p odamdan xabar oladi — buni keyinroq sinab ko'rasiz.
  - C: Bu — oddiy skriptning ta'rifi. Bot esa ishlab tugamaydi, keyingi hodisani kutadi.
  - Umumiy: Bot — ishlab turadigan dastur: hodisani kutadi va unga javob beradi.
- Javob oynasi yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping → Davom etish

## 5 · Bot API
- Eyebrow: Tushuncha · Bot API
- Sarlavha: Tokensiz Bot API so'rovni qabul qilmaydi.
- Mentor: Tokenni joyidan sudrab oling va nima bo'lishini kuzating. Keyin joyiga qaytaring.
- Sxema: Mijoz → Telegram → Bot API [token] → bot.js (handlerlar) → javob
- Ko'rsatma: tokenni shu yerga sudrang → / token olindi — qaytarish uchun Bot API'ga sudrang →
- Token olinganda: Token yo'q — Bot API so'rovni rad etdi. Xabar botingizga yetib kelmaydi, handler ishlamaydi.
- Token qaytarilganda: Token joyida — xabar yana botga yetib keladi.
- Tugma: Tokenni sudrab oling → Tokenni qaytaring → Davom etish

## 6 · Tokenni qayerda saqlaysiz
- Eyebrow: Markaziy · token
- Sarlavha: Tokenni qayerda saqlaysiz?
- Mentor: @BotFather botingizni ro'yxatdan o'tkazdi va token berdi. Uni qayerda saqlashni o'zingiz tanlaysiz — keyin nima bo'lishini ko'ramiz.
- @BotFather — Token: 7***:AA***xZ · tugma: Botni token bilan ishga tushirish →
- ✓ Bot onlayn
- Tanlov:
  - A — bot.js ichida, kodning o'zida
  - B — .env faylida
- A tanlansa — oqibat (1/4 … 4/4; tugma: Keyingisi →, oxirida Tuzatamiz →):
  1. Kod GitHub'ga chiqdi — token qatorda ochiq turibdi.
  2. Notanish odam tokenni ko'rib, nusxalab oldi.
  3. Endi u o'z kodidan botingiz nomidan yozadi: mijozlarga «Chegirma! Shu kartaga pul o'tkazing» degan soxta xabar ketdi.
  4. Mijozlar shikoyat qilyapti. Botni endi ikki kishi boshqaryapti: siz va u.
- Tuzatish 1/3 … 3/3 (tugma: Keyingisi →, oxirida Bajarildi ✓):
  1. @BotFather'da /revoke — eski token ishlamay qoladi, notanish odam botni boshqara olmaydi.
  2. @BotFather yangi token beradi.
  3. Yangi tokenni .env fayliga yozasiz — kodda faqat `process.env.BOT_TOKEN` qoladi.
- Natija: ✓ Token .env faylida
  ```
  # .env fayli .gitignore'da — Git uni commit qilmaydi
  BOT_TOKEN=7***:AA***xZ
  ```
- Bot holati: oflayn — token yo'q · xavfda — tokenni notanish odam oldi · botni boshqa odam ham boshqaryapti · onlayn — token sizda
- Xulosa: Token kimda bo'lsa, botni o'sha boshqaradi. Shuning uchun u kodga emas, .env fayliga yoziladi.
- Tugma: Voqeani oxirigacha ko'ring → Davom etish

## 7 · 03:00 sinovi
- Eyebrow: Markaziy · handlerlar
- Sarlavha: Botning handlerlarini o'zingiz yozasiz.
- Mentor: Har qatorga hodisani va unga javobni tanlang. Hamma qator to'lmasa ham botni ishga tushirib ko'rishingiz mumkin — xato bo'lsa, tuzatib, qayta sinaysiz.
- Handlerlar (bot.js) — 5 qator, har qatorda: hodisa → javob
- hodisalar: /start · «Menyu» tugmasi · /help · Boshqa har qanday xabar · /settings · Rasm yuborildi
- javoblar: Salom va menyu yuboradi · Taomlar ro'yxatini yuboradi · Yordam matnini yuboradi · «Uzr, tushunmadim. /help ni bosing» · «Buyurtmangiz qabul qilindi» deydi · Botni butunlay o'chiradi
- To'ldirilgan qator: /start → Salom va menyu yuboradi ✓ (↻ — o'zgartirish)
- Tugma: ▶ Botni ishga tushirish (03:00) → ↻ Qayta sinash
- Mijozlar: Aziza · /start · Bek · «Menyu» tugmasi · Dilnoza · /help · Sardor · «Pitsa bormi?»
- Mijoz natijasi: Javob oldi · Javobsiz qoldi — ketib qoldi · «Nima? Men hali hech narsa buyurtma qilmadim» · <javob> (mos emas)
- Sanoq: Javob oldi N/4 · Ketib qoldi N
- Xato bo'lsa: Bir javob noto'g'ri hodisaga ulangan — qayta tekshiring.
- Muvaffaqiyat: 4/4 — Sardor ham javob oldi: unga fallback handler javob berdi. Javob faqat siz yozgan handlerdan keladi.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (birinchi urinish xato bo'lsa: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.)
- Tugma: Sinovni yakunlang → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Ko'rsatma: To'g'ri javobni tanlang
- Savol: Mos handler topilmasa, bot nima qiladi?
  - ✔ Hech narsa yubormay, jim qoladi
  - O'zicha tasodifiy javob o'ylab topadi
  - Xabarni boshqa botga uzatib yuboradi
  - Xato chiqarib, butunlay o'chib qoladi
- Javob izohlari:
  - To'g'ri: Javobni faqat siz yozgan handler beradi — mos handler bo'lmasa, bot jim qoladi.
  - B: Bu bot javobni o'zi o'ylab topmaydi — faqat handlerda yozilganini bajaradi. Javobni o'zi yozadigan AI-botni 6-darsda ko'rasiz.
  - C: Bunday avtomatik uzatish yo'q: mos handler bo'lmasa, javob ham bo'lmaydi.
  - D: Bot o'chmaydi: ishlashda davom etadi, faqat shu xabarga javob bermaydi.
  - Umumiy: Mos handler topilmasa, bot jim qoladi — fallback handler bo'lmasa.
- Javob oynasi yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping → Davom etish

## 9 · Bir vaqtda uch mijoz
- Eyebrow: Hayotiy · bir vaqtda
- Sarlavha: Uch mijoz bir vaqtda yozdi. Bot adashadimi?
- Mentor: Avval har mijozni alohida bosing, keyin «Uchalasi birdan yozsin» tugmasini bosing.
- Chapda mijoz tugmalari (bosilganda mijoz xabari va bot javobi chatda chiqadi):
  - Aziza — /start
  - Bek — «Menyu» tugmasi
  - Dilnoza — /help
- Tugma: ▶ Uchalasi birdan yozsin → ✓ Uchalasi o'z javobini oldi
- O'ngda chat (AvtoPizza):
  - Aziza: /start → bot: Salom! Buyurtma uchun «Menyu» ni bosing.
  - Bek: Menyu → bot: Taomlar: Margarita, Pepperoni, To'rt pishloq.
  - Dilnoza: /help → bot: Yordam: /start — boshlash, /help — shu matn.
- Xulosa: Har xabar — alohida hodisa. Bot har biriga o'z handlerini ishga tushiradi — javoblar aralashmaydi.
- Tugma: Uchalasini birdan sinang → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Ko'rsatma: To'g'ri javobni tanlang
- Savol: Token ochiq kodda qolib ketsa, qanday xavf bor?
  - Hech qanday xavf yo'q, uni hech kim ko'rmaydi
  - Bot o'zi ishlashdan to'xtab qoladi
  - ✔ Boshqa odam bot nomidan xabar yubora oladi
  - Telegram botni darhol o'chirib qo'yadi
- Javob izohlari:
  - To'g'ri: Token botni boshqarish huquqini beradi — uni ko'rgan odam botingiz nomidan yoza oladi.
  - A: Ochiq kod (masalan, GitHub'da) hammaga ko'rinadi — token ham.
  - B: Bot o'zi to'xtamaydi: ishlashda davom etadi, lekin endi uni boshqa odam ham boshqaradi.
  - D: Telegram buni o'zi bilmaydi — tokenni siz @BotFather'da bekor qilasiz (/revoke).
  - Umumiy: Token oshkor bo'lsa, boshqa odam bot nomidan yozishi mumkin.
- Javob oynasi yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping → Davom etish

## 11 · Polling va webhook
- Eyebrow: Tushuncha · polling va webhook
- Sarlavha: Bot yangi xabarni qanday biladi? Ikki usul bor.
- Mentor: Bot Telegram'dan xabarni ikki usulda oladi. Ikkalasini bosib ko'ring.
- Kartalar (chizma: Bot — Telegram):
  - Polling — Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?». Sozlash oson, shuning uchun o'rganishda shu usul ishlatiladi.
  - Webhook — Yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.
- Xulosa: Ikkala usul ham xabarni botga yetkazadi. Avval polling bilan ishlaymiz, webhook — 7-darsda.
- Tugma: Ikkala usulni sinang (N/2) → Davom etish

## 12 · To'liq suhbat
- Eyebrow: Hayotiy · to'liq suhbat
- Sarlavha: Butun buyurtma — ketma-ket hodisa va javoblar.
- Mentor: Suhbatni qadam-baqadam oching va har qadamda qaysi hodisa kelganini kuzating.
- Chat (AvtoPizza · bot · onlayn):
  1. mijoz: /start → bot: Salom! AvtoPizza botiga xush kelibsiz. Nima qilamiz? · tugmalar: Menyu · Buyurtma
  2. mijoz: Menyu → bot: Bizda: Margarita, Pepperoni, To'rt pishloq. Qaysi birini?
  3. mijoz: Pepperoni → bot: Ajoyib tanlov! Manzilingizni yuboring.
  4. mijoz: Chilonzor 5-kvartal → bot: Qabul qilindi. 25 daqiqada yetib boradi. Rahmat!
- Yonida (har javobdan keyin):
  1. hodisa: /start → salom va tugmalar
  2. hodisa: «Menyu» tugmasi → taomlar ro'yxati
  3. hodisa: taom tanlandi → manzil so'raladi
  4. hodisa: manzil keldi → buyurtma tasdiqlandi
- Tugma: ▶ Suhbatni boshlash → Keyingi xabar → → ✓ Buyurtma yakunlandi
- Xulosa: 4 hodisa — 4 javob. 4-qadamda bot tanlangan pitsani eslab qolishi kerak — bu holat, uni 4-darsda qo'shamiz.
- Tugma: Suhbatni davom ettiring (N/4) → Davom etish

## 13 · Handlerlar kodda
- Eyebrow: Amaliyot · kod
- Sarlavha: Handlerlar kodda qanday yoziladi?
- Mentor: Bu — bot.js. Kod Node.js uchun Telegraf kutubxonasi bilan yozilgan, uni 3-darsda o'rnatasiz. Uchta bo'shliqni navbat bilan to'ldiring.
- Kod (bot.js):
  ```js
  // hodisa → javob:
  // sinovda yozgan handlerlaringiz
  bot.____((ctx) =>
    ctx.____('Salom!'))
  bot.____('Menyu', (ctx) =>
    ctx.reply('Bizning taomlar…'))
  ```
- Bo'shliqlar (navbat bilan):
  1. `bot.____((ctx) => …)`
     - hears
     - ✔ start
     - launch
  2. `ctx.____('Salom!')`
     - delete
     - forward
     - ✔ reply
  3. `bot.____('Menyu', …)`
     - start
     - stop
     - ✔ hears
- Xato izohlari:
  - hears — matnli xabar uchun handler; /start uchun `start` bor.
  - launch — botni ishga tushiradi, handler emas.
  - delete — xabarni o'chiradi, javob yubormaydi.
  - forward — xabarni boshqa joyga uzatadi, bu javob emas.
  - start — faqat /start buyrug'i uchun; bu yerda «Menyu» matni keladi.
  - stop — botni to'xtatadi, handler emas.
- Muvaffaqiyat: `bot.start` — /start, `bot.hears` — matn, `ctx.reply` — javob.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (birinchi urinish xato bo'lsa: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.)
- Tugma: Bo'shliqlarni to'ldiring → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Ko'rsatma: To'g'ri javobni tanlang
- Savol: Botga bir vaqtda uch mijoz yozsa, nima bo'ladi?
  - Faqat birinchi xabarga javob berib, qolganini tashlab ketadi
  - Xabarlarni adashtirib, hammasiga tasodifiy javob beradi
  - Uchala xabarni bitta xabar deb qo'shib yuboradi
  - ✔ Har xabarni alohida ko'rib, har biriga mos javob beradi
- Javob izohlari:
  - To'g'ri: Har xabar — alohida hodisa, shuning uchun har mijoz o'z javobini oladi.
  - A: Bot birinchi xabar bilan cheklanmaydi — har xabarga alohida javob beradi.
  - B: Bot tasodifiy ishlamaydi — har xabar uchun mos handlerni topadi.
  - C: Xabarlar qo'shilmaydi — har biri alohida hodisa.
  - Umumiy: Har xabar — alohida hodisa; bot har biriga mos javob beradi.
- Javob oynasi yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping → Davom etish

## 15 · Siklni yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: botning ish siklini tartibga soling.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (✔ to'g'ri tartib; ekranda aralash):
  1. Kutadi
  2. Hodisa keladi
  3. Mos handler topiladi
  4. Handler ishni bajaradi
  5. Javob yuboriladi
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam (bo'sh joyda: bu yerga qo'ying)
- Javob ishdan oldin bo'lsa: Bot hali ishni qilmasdan «tayyor» dedi. Javob ishdan oldin ketsa, mijoz bajarilmagan ishni bajarildi deb o'ylaydi.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri: ✓ Sikl tayyor: kutadi → hodisa keladi → handler topiladi → ish bajariladi → javob yuboriladi → yana kutadi.
- Havola (xato qilingan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Siklni yig'ing → Davom etish

## 16 · Amaliyot · Telegram
- Eyebrow: Amaliyot · Telegram
- Sarlavha: Birinchi botingizni ro'yxatdan o'tkazing
- Mentor: Topshiriqni o'z Telegram'ingizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- TOPSHIRIQ: Telegram'da @BotFather orqali o'z botingizni oching va tokenni xavfsiz saqlang. Bugun kod yozmaysiz — faqat botni yaratasiz.
- Qadamlar (bittadan; har birida tugma: Bajardim):
  1. Telegram qidiruvida @BotFather'ni toping va oching (ismi yonida ko'k tasdiq belgisi bor).
  2. `/newbot` buyrug'ini yuboring.
  3. Botga ism bering, keyin foydalanuvchi nomi. Foydalanuvchi nomi «bot» bilan tugashi shart: masalan, `ismingiz_pizza_bot`.
  4. @BotFather bergan tokenni nusxalab, xavfsiz joyga saqlang. Uni hech kimga yubormang.
  5. Botingizni qidiruvdan topib, /start bosing. Bot hozircha jim turadi — uni ishlatadigan kod hali yo'q. Kodni 3-darsda yozasiz.
- Bajarilgach: ✓ Bajarildi — Mentorni kuting
- Xulosa: Bot ro'yxatdan o'tdi. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugma: Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting


## 18 · Kartochkalar
18-ekran
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Botga kelgan xabar, buyruq yoki tugma bosilishi nima deb ataladi? | Hodisa | Masalan, foydalanuvchi /start yubordi |
| «Shu hodisa kelsa, shuni qil» deydigan kod qismi nima? | Handler | Masalan, `bot.start(...)` — /start uchun handler |
| Handler ichida javob qaysi buyruq bilan yuboriladi? | ctx.reply | Masalan, `ctx.reply('Salom!')` |
| Bot javob yuborgandan keyin nima qiladi? | Yana kutadi | Sikl: kutadi → hodisa → handler → javob → yana kutadi |
| Bot aynan sizniki ekanini tasdiqlaydigan maxfiy qator nima? | Token | Token kimda bo'lsa, botni o'sha boshqaradi |
| Yangi bot ochish va token olish uchun Telegram'da kimga yozasiz? | @BotFather | Telegram'ning bot ochadigan rasmiy boti |
| Tokenni qaysi faylda saqlaysiz? | .env | Kodda faqat `process.env.BOT_TOKEN` ko'rinadi |
| Bot dasturi Telegram bilan nima orqali bog'lanadi? | Telegram Bot API | Token noto'g'ri bo'lsa, 401 (Unauthorized) xatosi qaytadi |
| Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rasa, bu usul nima? | Polling | Sozlash oson — o'rganishda shu ishlatiladi |
| Telegram yangi xabarni o'zi bot manziliga yuborsa, bu usul nima? | Webhook | Botga internetda ochiq manzil (URL) kerak |
| Hech bir handler mos kelmasa, bot jim qolmasligi uchun nima yoziladi? | Fallback handler | Oxirgi umumiy handler — hech kim javobsiz qolmaydi |
| Tokeningiz begona odamga ko'rinib qolsa, birinchi nima qilasiz? | /revoke — tokenni bekor qilish | Eski token ishlamay qoladi, yangisini .env ga yozasiz |

- Hisob: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar: ✗ Takrorlash · ✓ Bildim
- Hammasi tugagach: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugma: Yakunlash →

## 19 · Yakun
19-ekran
- Eyebrow: Tayyor
- Belgi: ✓ Bot qanday ishlashini bilasiz
- Sarlavha: Endi bot qanday ishlashini bilasiz.
- Natija: N/5 to'g'ri javob
- Arena tugmasi: CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Bot — dastur boshqaradigan Telegram akkaunti
  - Botga kelgan har xabar — hodisa; unga handler javob beradi
  - Token bot sizniki ekanini tasdiqlaydi — u kodda emas, .env faylida saqlanadi
  - Mos handler bo'lmasa, bot jim qoladi — shuning uchun fallback handler yoziladi
  - Bot sikli: kutadi → hodisa → handler → javob → yana kutadi
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish →
- Uyga vazifa:
  - O'ylang — kundalik hayotda qaysi ishni bot bajarishi mumkin? 3 ta g'oya yozing
  - Yozing — har g'oya uchun kamida bitta «hodisa → javob» juftini yozing (masalan: /start → salom va menyu)
  - Saqlang — @BotFather bergan tokenni xavfsiz joyda saqlang: u 3-darsda kerak bo'ladi
- Keyingi dars — «Botingizni birinchi kim ochadi?» Botingizni birinchi bo'lib ishlatadigan yigirma kishini qayerdan topishni rejalashtiramiz.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Token Keeper — Tokenni .env fayliga joyladingiz
- All Served — 03:00 sinovida 4 mijozning hammasi javob oldi
- Never Silent — Fallback handler yozdingiz: hech kim javobsiz qolmadi
- Handler Writer — bot.js dagi handlerlarni birinchi urinishda to'g'ri to'ldirdingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · bosib davom eting
- Hisoblagich: Nishonlar — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savoldan keyin — Bot — ishlab turadigan dastur
   - `bot.launch()` — Kutadi — Dasturi ishlab turadi va yangi hodisani kutadi.
   - `bot.start((ctx) => …)` — Hodisa kelsa, handler ishlaydi — Mos handler javob yuboradi.
   - 3 — Yana kutadi — Javobdan keyin sikl boshiga qaytadi.
   - Sinfga savol: Bot oddiy skriptdan nimasi bilan farq qiladi?
2. 2-savoldan keyin — Fallback — jim qolmaslik
   - `bot.hears('Menyu', …)` — Bot mos handlerni qidiradi.
   - 2 — Topilmasa, jim qoladi — Bu bot javobni o'zi o'ylab topmaydi.
   - `bot.on('text', …)` — Yechim — fallback handler — Oxirgi umumiy handler hech kimni javobsiz qoldirmaydi.
   - Sinfga savol: Mos handler topilmasa, bot nima qiladi?
3. 3-savoldan keyin — Token oshkor bo'lsa
   - `BOT_TOKEN=...` — Token botni boshqarish huquqini beradi.
   - `new Telegraf('1234…')` — Ochiq kodda qolsa, boshqa odam bot nomidan yoza oladi.
   - `/revoke` — Yechim — /revoke va yangi tokenni .env ga yozish.
   - Sinfga savol: Token oshkor bo'lsa, nima xavfli?
4. 4-savoldan keyin — Bir vaqtda ko'p xabar
   - 1 — Har xabar — alohida hodisa.
   - `(ctx) => …` — Har biri uchun o'z handleri ishlaydi.
   - `ctx.reply(…)` — Javoblar aralashmaydi — Har mijoz o'z javobini oladi.
   - Sinfga savol: Uch mijoz bir vaqtda yozsa, bot nima qiladi?
5. Siklni yig'ishdan keyin — Sikl — tartib muhim
   - 1 — Avval — kutish.
   - 2 — Keyin — handler topiladi va ish bajariladi.
   - 3 — Eng oxiri — javob — Faqat ish bajarilgach.
   - Sinfga savol: Nega javob ishdan oldin ketmasligi kerak?

## Jonli viktorina (12 savol)
1. «Shu hodisa kelsa, shuni qil» deydigan kod qismi nima deyiladi?
   - ✔ Handler
   - Token
   - Webhook
   - .env fayli
2. Token nima uchun kerak?
   - Botning rangini belgilaydi
   - Xabarlarni boshqa tilga o'giradi
   - ✔ Bot aynan sizniki ekanini tasdiqlaydi
   - Foydalanuvchi parolini saqlaydi
3. Foydalanuvchi botga /start yubordi. Bu nima?
   - Bu — botning javobi
   - ✔ Bu — botga kelgan hodisa
   - Bu — botning tokeni
   - Bu — handlerlar ro'yxati
4. Mos handler topilmasa (fallback ham yo'q), bot nima qiladi?
   - Xato chiqarib o'chib qoladi
   - Tasodifiy javob o'ylab topadi
   - Boshqa botga ulanib qoladi
   - ✔ Hech narsa yubormay, jim qoladi
5. Bot tokenini kim beradi?
   - Telegram administratori
   - Foydalanuvchining o'zi o'ylab topadi
   - ✔ @BotFather
   - Bot API'ning o'zi yaratadi
6. Token ochiq kodda qolib ketsa, qanday xavf bor?
   - ✔ Boshqa odam bot nomidan xabar yozadi
   - Bot o'zi tezroq ishlay boshlaydi
   - Hech qanday xavf yo'q, tinch bo'ling
   - Telegram botni darhol o'chirib qo'yadi
7. Token oshkor bo'lsa, birinchi qadam nima?
   - Botni /deletebot bilan butunlay o'chirish
   - Telegram'ni qayta o'rnatish
   - Yangi Telegram akkaunt ochish
   - ✔ Tokenni /revoke bilan bekor qilish
8. Token odatda qayerda saqlanadi?
   - bot.js faylining o'zida
   - ✔ .env faylida
   - Telegram profil sozlamasida
   - Brauzer qidiruv tarixida
9. Bot nega 03:00 da ham javob bera oladi?
   - Uni uxlamaydigan odam boshqaradi
   - ✔ Dasturi ishlab turadi va hodisani kutadi
   - U faqat kunduzi ishlashga sozlangan
   - U tasodifiy vaqtda ishga tushadi
10. Uch mijoz bir vaqtda yozsa, bot nima qiladi?
    - Faqat birinchi mijozga javob beradi
    - Uchala xabarni bitta deb qo'shib yuboradi
    - Hammasini ertalabgacha kutdirib qo'yadi
    - ✔ Har xabarni alohida ko'rib, javob beradi
11. Hech bir handlerga mos kelmagan xabar kelsa, nima yordam beradi?
    - ✔ Oxirgi, umumiy fallback handler
    - Botni o'chirib, qayta yoqish
    - Bot API'ni vaqtincha yopish
    - Yangi token olish
12. Bugun o'rgangan uchta asosiy tushuncha qaysi?
    - Rang, shrift va sayt dizayni
    - Ekran, sichqoncha, klaviatura
    - ✔ Token, handler va sikl
    - Rasm, video va ovoz fayli
