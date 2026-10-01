# 3-dars «Telegram Bot API + tugmalar» — yakuniy matn

Fayl: `src/5-Modull/BotApiButtonsLesson.jsx` · 20 ekran · Keyingi dars: «Stateful logika + PostgreSQL»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish — /start ga javob yo'q
- Eyebrow: Kirish
- Sarlavha: 1-darsda ochgan botingizga /start yuboring. Nima bo'larkin?
- Mentor: O'tgan darsda botingizning birinchi foydalanuvchilari qaysi guruhlardan kelishini rejalashtirdingiz. Ularning har biri avval /start bosadi. Tugmani bosing va ular nimani ko'rishini kuzating.
- Eslatma qatori: 1-darsda: @BotFather botingizni ochdi va token berdi — `7***:AA***xZ`
- Chat (AvtoPizza bot · sizning botingiz): bo'sh
- Tugma: ▶ /start yuborish → ✓ /start yuborildi
- Chatda: /start
- Chat ostida: Javob kelmadi.
- Savol: Bot nega javob bermadi?
  - Bot hali @BotFather tekshiruvidan o'tib bo'lmagan
  - ✔ Botda hali kod yo'q, /start ni ushlaydigan handler ham yo'q
  - Yangi bot bir kun o'tgach javob bera boshlaydi
- Javob izohlari:
  - 2-variant: **Aynan!** @BotFather botni ochdi va token berdi, lekin javobni kod beradi: /start kelganda uni handler ushlashi kerak. Bugun shu kodni yozamiz — buyruqlar, inline tugmalar va reply klaviatura.
  - 1 yoki 3-variant: **Qiziq fikr!** Bot @BotFather'da ochilgan zahoti ishlashi mumkin: tekshiruv ham, kutish ham yo'q. Jim turishining sababi boshqa — botda hali kod yo'q, /start ni ushlaydigan handler yo'q. Bugun shu kodni yozamiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun botingiz javob beradi va tugmalar ko'rsatadi.
- Mentor: 1-darsda **hodisa → handler → javob** modelini ko'rdingiz. Bugun uni Telegraf kodida yozasiz. Chapdagi menyuda uch xil hodisa bor: buyruq, inline tugma va reply klaviatura — har biriga o'z handleri kerak.
- Yozuv: Dars oxirida bu menyuning har qismini tushuntirib bera olasiz
- Chat (AvtoPizza bot · bot · onlayn):
  - Foydalanuvchi: /menu
  - Bot: Salom! AvtoPizza'ga xush kelibsiz. Nima qilamiz? · inline tugmalar: Pitsa · Ichimlik
  - Reply klaviatura: Biz haqimizda
- Izoh: Buyruq — / bilan boshlanadigan xabar: /start, /help, /menu.
- Bugungi 4 qadam:
  1. Token kodda: .env va dotenv
  2. Xabar botga qanday yetib keladi: Telegram → Telegraf → bot.js
  3. /start handleri va ctx
  4. Buyruqlar, inline tugma va reply klaviatura
- Tugma (telefonda): 4 qadamni ko'rish · ↩ Menyuni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Token kodda
- Eyebrow: Tushuncha · token
- Sarlavha: Token kodda qanday o'qiladi?
- Mentor: 1-darsda tokenni .env faylida saqlash kerakligini ko'rdingiz. Endi bu kodda qanday ko'rinishini ko'ramiz. Tugmani bosing.
- Chap — Xato: token kodda ochiq
- Kod (`bot.js`):
```js
const bot = new Telegraf('1234567890:AA-namuna-token')
// kod Git'ga chiqsa, token ham u bilan chiqadi
```
- Tugma: To'g'ri usul qanday? → ✓ Ko'rdingiz
- O'ng — To'g'ri: token .env faylida
- Kod (`.env`):
```
BOT_TOKEN=1234567890:AA-namuna-token
# .env fayli .gitignore'da — Git uni commit qilmaydi
```
- Kod (`bot.js`):
```js
require('dotenv').config()   // .env faylini process.env ga yuklaydi
const bot = new Telegraf(process.env.BOT_TOKEN)
```
- Xulosa: Xuddi «Autentifikatsiya va .env» darsidagi `JWT_SECRET` kabi: kodda token yo'q, faqat uning nomi — `process.env.BOT_TOKEN`. .env faylini `dotenv` paketi yuklaydi; usiz `process.env.BOT_TOKEN` bo'sh qoladi va bot ishga tushmaydi.
- Tugmalar: Orqaga · Xavfsiz usulni ko'ring → Davom etish

## 3 · Xabar yo'li
- Eyebrow: Tushuncha · xabar yo'li
- Sarlavha: Xabar botingizga qanday yetib keladi?
- Mentor: 1-darsda bu yo'lni sxemada ko'rdingiz. Endi har qismini kod bilan bog'laymiz. Har qatlamni bosing.
- Sxema: Telegram → Telegraf → bot.js (handlerlar) · qaytish chizig'i: javob
- Qatlamlar (bosilganda ochiladi):
  - **Telegram** — Foydalanuvchi xabar yozadigan joy. Botlar Telegram bilan Telegram Bot API orqali gaplashadi.
  - **Telegraf** — Node.js kutubxonasi. Telegram Bot API bilan aloqani o'zi bajaradi — siz unga faqat token berasiz.
  - **bot.js** — Siz yozadigan fayl. Handlerlar shu yerda: `bot.start`, `bot.command`, `bot.hears`, `bot.action`. Handler javob yozadi, Telegraf uni Telegram'ga yuboradi.
- Xulosa: Siz faqat handlerlarni yozasiz — Telegram bilan aloqani Telegraf bajaradi. Katta loyihada shu handlerlar NestJS service ichiga joylanadi (CarService kabi); bugun hammasi bitta bot.js faylida.
- Tugmalar: Orqaga · Qatlamlarni ko'ring (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yozuv: To'g'ri javobni tanlang
- Savol: Bot tokenini qayerda saqlash to'g'ri?
  - bot.js ichida — new Telegraf(...) qatorining o'zida
  - ✔ .env faylida — kod uni process.env.BOT_TOKEN orqali o'qiydi
  - README.md ichida — jamoa tokenni tez topishi uchun
  - Bot tavsifida — @BotFather'dagi tavsif maydonida
- Javob izohlari:
  - To'g'ri: Token .env faylida turadi, kod uni process.env.BOT_TOKEN orqali o'qiydi.
  - 1-variant: Kod Git'ga chiqsa, token ham u bilan chiqadi — kodni ko'rgan odam botingizni boshqara oladi.
  - 3-variant: README — hammaga ochiq hujjat. Uni o'qigan har kim tokenni ko'radi.
  - 4-variant: Bot tavsifini botni ochgan har bir odam ko'radi — token hammaga ochiq bo'lib qoladi.
  - Umumiy: Token .env faylida saqlanadi: kod uni process.env.BOT_TOKEN orqali o'qiydi, Git esa .env ni commit qilmaydi.
- Javob sarlavhasi: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish (jonli darsda: Javob tanlang)

## 5 · /start handleri
- Eyebrow: Kod · /start
- Sarlavha: Birinchi handler: /start kelganda bot salom yozadi.
- Mentor: 1-darsdagi «**/start → salom**» endi haqiqiy kodda. Uch qismni bosib, har biri nima qilishini oching.
- Kod (`bot.js`):
```js
bot.start((ctx) => {
  ctx.reply('Salom!')
})
```
- Qismlar (bosilganda):
  - `bot.start` — /start buyrug'i uchun handler. Foydalanuvchi botni ochib /start bosganda ishga tushadi.
  - `ctx` — Shu hodisa haqidagi ma'lumot: kim yozdi, nima yozdi, qaysi chatdan. Ichini keyingi ekranda ochamiz.
  - `ctx.reply` — Javob yuboradigan metod: xabarni kelgan chatning o'ziga yuboradi. Bu — 1-darsdagi javob.
- Tugmalar: Orqaga · 3 qismni oching (N/3) → Davom etish

## 6 · ctx ichida nima bor
- Eyebrow: Kod · ctx
- Sarlavha: ctx ichida nima bor?
- Mentor: ctx — context so'zining qisqartmasi. Har handler uni hodisa bilan birga oladi. Uni konvertga o'xshatish mumkin: ichida xat, ustida qaytish manzili. Ichidagi uch maydonni bosib ko'ring.
- Karta: ctx — Aziza «Salom» deb yozdi
  - `ctx.from` · `{ id: 5012, first_name: "Aziza" }` — Kim yozdi: foydalanuvchining id raqami va ismi.
  - `ctx.message.text` · `"Salom"` — Foydalanuvchi yuborgan matn.
  - `ctx.chat` · `{ id: 5012, type: "private" }` — Xabar kelgan chat. ctx.reply javobni aynan shu chatga yuboradi.
- Xulosa: ctx har hodisada yangi: Aziza yozsa — Azizaning ma'lumoti, Bek yozsa — Bekniki. Shuning uchun ctx.reply javobni xabar kimdan kelgan bo'lsa, o'shanga yuboradi.
- Tugmalar: Orqaga · ctx ichini oching (N/3) → Davom etish

## 7 · Ikki xil tugma
- Eyebrow: Tushuncha · ikki xil tugma
- Sarlavha: Inline tugma va reply klaviatura: bosilganda nima ketadi?
- Mentor: Telegram botlarida tugmaning ikki turi bor. Avval inline tugmani, keyin reply klaviaturani bosib ko'ring va chatga qarang.
- **1-qadam · Inline tugma**
  - Izoh: Inline tugma — xabarning tagida, unga yopishib turadigan tugma.
  - Chat (AvtoPizza bot · bot · onlayn): Foydalanuvchi: /menu · Bot: Menyuni tanlang: · inline tugmalar: Pitsa · Ichimlik
  - Kod (`bot.js`):
```js
ctx.reply('Menyuni tanlang:', Markup.inlineKeyboard([
  Markup.button.callback('Pitsa', 'pizza'),
  Markup.button.callback('Ichimlik', 'drink'),
]))
```
  - Kod ostida: Markup — Telegraf'ning tugma yasaydigan yordamchisi.
  - Bosilgach («Pitsa» — `'pizza'`, «Ichimlik» — `'drink'`): Botga callback keldi: `'pizza'`. Chatga yangi xabar qo'shilmadi. · Callback — inline tugma bosilganda botga keladigan hodisa. Ichida tugma ma'lumoti bor — kodda yozilgan `'pizza'`. Uni `bot.action('pizza', ...)` ushlaydi.
  - Yig'ilgan qator: ✓ Inline tugma → callback `'pizza'` → `bot.action` ↻
- **2-qadam · Reply klaviatura**
  - Izoh: Reply klaviatura — oddiy klaviatura o'rnida chiqadigan tugmalar.
  - Chat (AvtoPizza bot · bot · onlayn): Bot: Tugmani bosing: · reply klaviatura: Pitsa · Ichimlik · yozish maydonida: Tugmani tanlang…
  - Kod (`bot.js`):
```js
ctx.reply('Tugmani bosing:', Markup.keyboard([['Pitsa', 'Ichimlik']]).resize())
```
  - Bosilgach: chatga foydalanuvchi xabari «Pitsa» qo'shiladi · Tugma matni oddiy xabar bo'lib ketdi. Uni `bot.hears('Pitsa', ...)` ushlaydi.
  - Yig'ilgan qator: ✓ Reply klaviatura → matn «Pitsa» → `bot.hears` ↻
- Xulosa: Inline tugma — shu xabarga tegishli tanlov uchun: menyudan taom tanlash, «Ha / Yo'q». Reply klaviatura — tez-tez kerak bo'ladigan tugmalar uchun: Menyu, Savat, Yordam.
- Tugmalar: Orqaga · Ikkala turni sinang (N/2) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yozuv: To'g'ri javobni tanlang
- Savol: Inline tugma va reply klaviatura tugmasi bosilganda nima farq qiladi?
  - Ikkalasi ham tugma matnini chatga oddiy xabar qilib yuboradi
  - Inline tugma rasm yuboradi, reply tugmasi esa faqat matn yuboradi
  - Inline tugma faqat guruhda, reply tugmasi faqat shaxsiy chatda ishlaydi
  - ✔ Inline tugma chatga matn yozmaydi, reply tugmasi matnini xabar qiladi
- Javob izohlari:
  - To'g'ri: Inline tugma botga callback yuboradi, reply tugma esa o'z matnini chatga xabar qilib yuboradi.
  - 1-variant: Bu faqat reply klaviaturaga to'g'ri. Inline tugma bosilganda chatga matn yozilmaydi — botga callback keladi.
  - 2-variant: Inline tugma rasm yubormaydi: bosilganda botga tugma ma'lumoti keladi, masalan 'pizza'.
  - 3-variant: Ikkala tugma ham guruhda ham, shaxsiy chatda ham ishlaydi. Farq — bosilganda nima yuborilishida.
  - Umumiy: Inline tugma → callback (chatda ko'rinmaydi); reply klaviatura → oddiy matnli xabar.
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 9 · Uch hodisa — uch handler
- Eyebrow: Markaziy · uch hodisa
- Sarlavha: Uch xil hodisa — uch handler. Ularni o'zingiz ulang.
- Mentor: Har qadamda avval hodisani yuboring: handler yo'q bo'lsa, bot jim turadi. Keyin handler qo'shing va qayta yuboring.
- Chat (AvtoPizza bot · bot · onlayn): Buyruq yuboring yoki tugmani bosing.
- Handlerlar paneli: bot.js — handlerlar
- **1-qadam · Buyruq**
  - Tugma: ▶ /menu yuborish
  - Handler yo'q: Hodisa keldi, lekin uni ushlaydigan handler yo'q — bot jim.
  - Handler qatori: `bot.command('menu', ...)` · + handler qo'shish → ✓
  - Qayta yuborilgach — bot: Menyu. Tanlang: · inline tugmalar: Pitsa · Ichimlik
  - Yig'ilgan qator: ✓ /menu → `bot.command('menu')`
- **2-qadam · Inline tugma**
  - Ko'rsatma: Chatdagi «Pitsa» tugmasini bosing.
  - Handler yo'q: Tugma bosildi, chatga matn tushmadi — callback keldi, lekin uni ushlaydigan handler yo'q.
  - Handler qatori: `bot.action('pizza', ...)` · + handler qo'shish → ✓
  - Qayta bosilgach — bot: Pitsa tanlandi. Narxi — 30 000 so'm.
  - Yig'ilgan qator: ✓ Pitsa → callback `'pizza'` → `bot.action`
- **3-qadam · Reply klaviatura**
  - Ko'rsatma: Pastdagi «Biz haqimizda» tugmasini bosing.
  - Handler yo'q: Chatga «Biz haqimizda» matni tushdi, lekin uni ushlaydigan handler yo'q — bot jim.
  - Handler qatori: `bot.hears('Biz haqimizda', ...)` · + handler qo'shish → ✓
  - Qayta bosilgach — bot: AvtoPizza — 2020 yildan beri pitsa yetkazib beramiz.
  - Yig'ilgan qator: ✓ Biz haqimizda → matn → `bot.hears`
- Handler yo'q paytda bir hodisa 3 marta yuborilsa: Mijoz: «Buzuqmi bu?» — va ketib qoldi.
- Muvaffaqiyat: Uchala hodisa o'z handleriga ulandi. Tugmaning o'zi hech narsa qilmaydi — javobni handler beradi.
- Tugmalar: Orqaga · Uchala handlerni ulang (N/3) → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yozuv: To'g'ri javobni tanlang
- Savol: Inline tugma bosilishini qaysi handler ushlaydi?
  - ✔ bot.action('pizza', ...) — tugma ma'lumoti 'pizza' bo'lgani uchun
  - bot.hears('Pitsa', ...) — tugma yozuvi 'Pitsa' bo'lgani uchun
  - bot.start(...) — tugma /start javobidagi menyuda turgani uchun
  - bot.launch() — botni ishga tushiradigan qator bo'lgani uchun
- Javob izohlari:
  - To'g'ri: Inline tugma bosilganda callback keladi — uni bot.action('pizza', ...) ushlaydi.
  - 2-variant: bot.hears matnli xabarni ushlaydi. Inline tugma bosilganda «Pitsa» matni yuborilmaydi — callback keladi.
  - 3-variant: bot.start faqat /start buyrug'ini ushlaydi. Tugma qaysi xabarda turgani ahamiyatsiz — uning bosilishini bot.action ushlaydi.
  - 4-variant: bot.launch() botni ishga tushiradi, lekin o'zi hech bir hodisani ushlamaydi — bu handler emas.
  - Umumiy: Inline tugma bosilishi — callback. Uni bot.action(...) ushlaydi.
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Nishon: Callback Catcher (birinchi urinishda to'g'ri bo'lsa)
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 11 · Javob boshqa chatga ketsa
- Eyebrow: Hayotiy · xato chat
- Sarlavha: Javob noto'g'ri odamga ketsa nima bo'ladi?
- Mentor: Aziza narxni so'radi. Lekin kodda sinovdan qolgan qator bor: javob doim Valining chatiga yuboriladi. Avval sinab ko'ring, keyin tuzating.
- Chap — yozuv: Aziza — «Narxlar» tugmasini bosdi, javob kutyapti
- Chat (Aziza): Foydalanuvchi: Narxlar
- Kod (`bot.js`):
```js
bot.hears('Narxlar', (ctx) => {
  ctx.telegram.sendMessage(VALI_ID, "Pitsa — 30 000 so'm")
})
// sinovdan qolgan: VALI_ID — Valining chat id'si
```
- Kod ostida: `ctx.telegram.sendMessage(id, matn)` — matnni ko'rsatilgan id'dagi chatga yuboradi.
- O'ng — yozuv: Vali — hech narsa so'ramagan
- Chat (Vali): bo'sh
- Tugma: ▶ Sinab ko'rish
- Tuzatishdan oldin sinalsa: Aziza chatida: Javob kelmadi. · Vali chatida — bot: Pitsa — 30 000 so'm
  - Ogohlantirish: Javob Valiga ketdi, Aziza hech narsa olmadi. Kod ctx dagi chatni emas, qo'lda yozilgan VALI_ID ni ishlatgan.
  - Tugma: Kodni tuzatish
- Tuzatilgach — kod (`bot.js`):
```js
bot.hears('Narxlar', (ctx) => {
  ctx.reply("Pitsa — 30 000 so'm")
})
// ctx.reply — xabar kelgan chatga, ya'ni Azizaga
```
- Tugma: ▶ Qayta sinash → Aziza chatida — bot: Pitsa — 30 000 so'm · Vali chatida: Yangi xabar kelmadi ✓
- Xulosa: Endi javob ctx.reply orqali ketadi: xabar qaysi chatdan kelgan bo'lsa, javob ham o'sha chatga boradi.
- Tugmalar: Orqaga · Kodni tuzating va sinang → Davom etish

## 12 · Fallback handler
- Eyebrow: Hayotiy · fallback handler
- Sarlavha: Mos handler topilmagan matnga ham bot javob bersin.
- Mentor: 1-darsda fallback handler kerakligini ko'rdingiz. Endi uni kodda yozamiz. Avval noma'lum xabar yuboring va nima bo'lishini ko'ring.
- Chat (AvtoPizza bot · bot · onlayn): Bot: Salom! Menyu uchun /menu ni bosing.
- Tugma: ▶ Noma'lum xabar yuborish → Foydalanuvchi: Necha daqiqada yetib keladi?
- Chatda: Bot jim qoldi…
- Ogohlantirish: Bu xabarga mos handler yo'q — bot jim qoldi. Mijoz o'ylaydi: «Ishlayaptimi bu?»
- Tugma: Fallback handler qo'shish
- Qo'shilgach — kod (`bot.js`):
```js
bot.on('text', (ctx) => ctx.reply('Tushunmadim. Menyu uchun /menu ni bosing.'))
```
- Tugma: ▶ Qayta yuborish → Foydalanuvchi: Necha daqiqada yetib keladi? · Bot: Tushunmadim. Menyu uchun /menu ni bosing.
- Xulosa: `bot.on('text', ...)` mos handler topilmagan matnli xabarga javob beradi. Shuning uchun u boshqa handlerlardan keyin yoziladi: oldinroq tursa, /start va /menu ni ham o'zi ushlab oladi.
- Nishon: Fallback Coder (bonus)
- Tugmalar: Orqaga · Fallback handler qo'shing va sinang → Davom etish

## 13 · /help javobi
- Eyebrow: Amaliyot · buyruqlar
- Sarlavha: /help javobini to'ldiring: har buyruq nima qiladi?
- Mentor: /help bosilganda bot buyruqlar ro'yxatini yuboradi. Har buyruqqa to'g'ri tavsifni tanlang.
- Chat (AvtoPizza bot · bot · onlayn): Foydalanuvchi: /help · Bot: Buyruqlar: · `/start` — ____ · `/help` — ____ · `/menu` — ____
- Variantlar (navbat bilan, joriy buyruq qatori):
  - /start —
    - Botni butunlay o'chirib tashlaydi
    - ✔ Suhbatni boshlaydi: salom va menyu yuboradi
    - Faqat rasm yuboradi
  - /help —
    - Mijozning parolini qayta tiklaydi
    - Botni qayta o'rnatadi
    - ✔ Yordam va buyruqlar ro'yxatini ko'rsatadi
  - /menu —
    - Mijozni chatdan chiqarib yuboradi
    - ✔ Menyuni qayta ochadi
    - Botning tokenini ko'rsatadi
- Javob izohlari:
  - /start: Botni butunlay o'chirib tashlaydi — /start botni o'chirmaydi — u suhbatni boshlaydi: bot salom va menyu yuboradi. · Faqat rasm yuboradi — /start rasm bilan bog'liq emas — u suhbatni boshlaydi.
  - /help: Mijozning parolini qayta tiklaydi — Botlarda odatda parol bo'lmaydi — /help yordam matnini ko'rsatadi. · Botni qayta o'rnatadi — /help hech narsani o'rnatmaydi — faqat yordam beradi.
  - /menu: Mijozni chatdan chiqarib yuboradi — /menu hech kimni chiqarib yubormaydi — u menyuni ko'rsatadi. · Botning tokenini ko'rsatadi — Token maxfiy — uni bot hech kimga ko'rsatmaydi.
  - Umumiy: Bu buyruq bunday ishni bajarmaydi — boshqasini tanlang.
- Nishon yozuvi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: /help javobi tayyor. Uyga vazifada uni botingizga o'zingiz qo'shasiz.
- Nishon: Command Writer
- Tugmalar: Orqaga · Ro'yxatni to'ldiring → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yozuv: To'g'ri javobni tanlang
- Savol: /start va /help kabi buyruqlar oddiy xabardan nimasi bilan ajralib turadi?
  - Ularni faqat bot egasi yubora oladi, boshqalar yubora olmaydi
  - Ular bot dasturini qayta ishga tushiradi va suhbatni tozalaydi
  - ✔ Ular / bilan boshlanadi va kodda alohida handler bilan ushlanadi
  - Ular xabar emas: Telegram ularni botga umuman yubormaydi
- Javob izohlari:
  - To'g'ri: Buyruq / bilan boshlanadi va kodda uni bot.command ushlaydi.
  - 1-variant: Buyruqni har qanday foydalanuvchi yubora oladi — /start ni har yangi mijoz birinchi bo'lib bosadi.
  - 2-variant: Buyruq bot dasturini qayta ishga tushirmaydi: u oddiy hodisa, unga mos handler javob beradi.
  - 4-variant: Buyruq ham botga xabar bo'lib keladi — / bilan boshlanadigan matnli xabar. Shuning uchun uni handler ushlaydi.
  - Umumiy: Buyruq — / bilan boshlanadigan xabar; kodda uni bot.command ushlaydi.
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Nishon: Command Spotter (birinchi urinishda to'g'ri bo'lsa)
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 15 · bot.js ni yig'ing (final)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: bot.js ni to'g'ri tartibda yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (to'g'ri tartibda; ekranda aralash chiqadi):
```js
const token = process.env.BOT_TOKEN
const bot = new Telegraf(token)
bot.start((ctx) => ctx.reply('Salom!', menu))
bot.action('pizza', (ctx) => ctx.reply('Pitsa tanlandi'))
bot.on('text', (ctx) => ctx.reply('Tushunmadim'))
bot.launch()
```
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · 6-qadam
- Fallback handler /start dan oldin bo'lsa: Fallback handler /start dan oldin turibdi. U har qanday matnni ushlaydi — /start ham matn, shuning uchun salom o'rniga «Tushunmadim» keladi. Tartibni to'g'rilang.
- bot.launch() oxirida bo'lmasa: bot.launch() handlerlardan oldin turibdi. Avval hamma handler yoziladi, keyin bot ishga tushiriladi — launch() faylning oxirgi qatori.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri: ✓ Tayyor: token → bot → /start handleri → tugma handleri → fallback handler → bot.launch(). Telegraf handlerlarni yozilgan tartibda tekshiradi — shuning uchun fallback handler ulardan keyin turadi. (3-qatordagi `menu` — 7-ekrandagidek `Markup.inlineKeyboard` bilan yasalgan tugmalar.)
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · bot.js ni yig'ing → Davom etish

## 16 · Amaliyot · VS Code
- Eyebrow: Amaliyot · VS Code
- Sarlavha: O'z botingizga menyu tugmalari qo'shing
- Mentor: Bu topshiriqni o'z kompyuteringizda, VS Code'da bajaring. Har qadamni bajarib, «Bajardim» ni bosing — keyingisi ochiladi. Oxirida Mentor tekshiradi.
- TOPSHIRIQ: 1-darsda @BotFather'da ochgan botingizga /menu buyrug'ini va kamida 2 ta inline tugmani qo'shing. Har tugma uchun `bot.action` handlerini, oxiriga fallback handler — `bot.on('text', ...)` ni yozing.
- Qadamlar (bittadan ochiladi):
  1. Loyiha papkasida `npm install telegraf dotenv` ni ishga tushiring.
  2. `.env` fayliga 1-darsda saqlagan tokeningizni yozing: `BOT_TOKEN=...`. `.env` ni `.gitignore` ga qo'shing. Tokenni hech kimga yubormang, skrinshotga ham tushirmang.
  3. `bot.js` boshiga ikki qator yozing: `require('dotenv').config()` va `const { Telegraf, Markup } = require('telegraf')`.
  4. `bot.command('menu', ...)` ichida `Markup.inlineKeyboard` bilan 2 ta inline tugma chiqaring.
  5. Har tugma uchun `bot.action(...)` handlerini yozing. Ichida `ctx.answerCbQuery()` ni ham chaqiring — tugmadagi yuklanish belgisi to'xtaydi.
  6. Handlerlardan keyin `bot.on('text', ...)` — fallback handler qo'shing.
  7. Oxirgi qator — `bot.launch()`. Botni `node bot.js` bilan ishga tushiring va Telegram'da /menu yuborib sinang.
- Tugma: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting
- Muvaffaqiyat: Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Qo'shimcha (majburiy emas): @BotFather'da /setcommands bilan buyruqlar ro'yxatini kiriting — foydalanuvchi / yozganda Telegram shu ro'yxatni taklif qiladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Telegram Bot API bilan aloqani siz o'rniga qaysi Node.js kutubxonasi bajaradi? | Telegraf | Siz token berasiz — u Bot API'ga ulanadi |
| Tokenni kodga yozmasdan qaysi fayldan olasiz? | .env | Kodda faqat process.env.BOT_TOKEN; faylni dotenv yuklaydi |
| Hodisa haqidagi ma'lumot — kim yozdi, qaysi chatdan — kodda qanday ataladi? | ctx | ctx.from — kim yozdi, ctx.chat — qaysi chat, ctx.message.text — matn |
| Xabar kelgan chatga javobni kodda nima yuboradi? | ctx.reply(...) | 1-darsdagi javob — endi kodda |
| /start buyrug'ini qaysi handler ushlaydi? | bot.start(...) | Foydalanuvchi botni birinchi ochganda /start yuboradi |
| Buyruq qaysi belgi bilan boshlanadi? | Qiyshiq chiziq (/) | Kodda uni bot.command ushlaydi (/start uchun — bot.start) |
| Xabarning tagida, unga yopishib turadigan tugma qanday ataladi? | Inline tugma | Bosilganda chatga matn yozilmaydi |
| Oddiy klaviatura o'rnida chiqadigan tugmalar qanday ataladi? | Reply klaviatura | Bosilsa, tugma matni oddiy xabar bo'lib ketadi |
| Inline tugma bosilganda botga keladigan hodisa nima deyiladi? | Callback | Ichida tugma ma'lumoti bor, masalan 'pizza'; chatda ko'rinmaydi |
| Callback'ni qaysi handler ushlaydi? | bot.action(...) | Reply tugma matnini esa bot.hears(...) ushlaydi |
| Mos handler topilmagan matnli xabarga qaysi handler javob beradi? | bot.on('text', ...) | Fallback handler — boshqa handlerlardan keyin yoziladi |
| Botni ishga tushiradigan, faylning oxirida turadigan qator qaysi? | bot.launch() | Polling bilan ishlaydi: bot Telegram'dan yangi xabarlarni so'rab turadi (1-darsda ko'rgansiz) |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim
- Tugash: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Handlerlar yozildi
- Sarlavha: Botingiz endi buyruqlarga va tugmalarga javob beradi.
- Ball halqasi: N/5 · to'g'ri javob
- Jonli viktorina tugmasi (CODE STRIKE) · o'quvchida: Mentorni kuting
- Endi siz bilasiz:
  - Token .env faylida turadi; kod uni dotenv orqali process.env.BOT_TOKEN dan o'qiydi
  - bot.start, bot.command, bot.hears, bot.action — har xil hodisa uchun handler
  - ctx — hodisa haqidagi ma'lumot; ctx.reply javobni xabar kelgan chatga yuboradi
  - Inline tugma bosilsa — botga callback keladi; reply klaviatura bosilsa — oddiy matn
  - Fallback handler boshqa handlerlardan keyin yoziladi, bot.launch() — eng oxirida
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish →
- Uyga vazifa:
  - **Sinang** — amaliyotdagi botni ishga tushirib, uch hodisani tekshiring: /menu buyrug'i, inline tugma, reply klaviatura
  - **Qo'shing** — /help buyrug'ini qo'shing: u 13-ekrandagi buyruqlar ro'yxatini yuborsin
  - **Tekshiring** — kodda token yo'qligini, .env esa .gitignore'da ekanini tekshiring
- Keyingi dars — **«Stateful logika + PostgreSQL»**. Bot mijoz tanlagan pitsani eslab qoladi: suhbat holatini PostgreSQL bazasida saqlaymiz.
- Nishonlaringiz — N/4
- Kalit so'zlar (takrorlash): **token** — botning maxfiy kaliti (.env faylida) · **Telegraf** — Node.js uchun bot kutubxonasi · **ctx** — hodisa haqidagi ma'lumot (context) · **bot.start** — /start buyrug'i uchun handler · **bot.command** — /menu kabi buyruq uchun handler · **inline tugma** — xabar tagidagi tugma, bosilsa callback keladi · **reply klaviatura** — klaviatura o'rnidagi tugmalar, bosilsa matn ketadi · **bot.action** — callback uchun handler · **bot.hears** — aniq matn uchun handler · **fallback handler** — mos handler topilmagan matnga javob beradi · **bot.launch** — botni ishga tushiradi (polling bilan)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Callback Catcher** — Inline tugma bosilishini qaysi handler ushlashini birinchi urinishda topdingiz (10-ekran)
- **Command Spotter** — Buyruq oddiy xabardan nimasi bilan farq qilishini birinchi urinishda topdingiz (14-ekran)
- **Fallback Coder** — Fallback handlerni kodda qo'shib, sinab ko'rdingiz (12-ekran, bonus)
- **Command Writer** — Buyruqlar ro'yxatini birinchi urinishda xatosiz to'ldirdingiz (13-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yozuvlari: Qayta tushuntirish · Sinfga savol: · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. (4-ekran) **Token — .env faylida**
   - `new Telegraf('1234…')` · Token kodda yozilmaydi — Kod Git'ga chiqsa, tokenni ko'rgan odam botni boshqara oladi.
   - `BOT_TOKEN=...` · .env faylida saqlanadi — .env .gitignore'da, Git uni commit qilmaydi.
   - `process.env.BOT_TOKEN` · Kod faqat nomini o'qiydi — process.env.BOT_TOKEN; faylni dotenv yuklaydi.
   - Sinfga savol: Token nega .env faylida saqlanadi?
2. (8-ekran) **Ikki xil tugma**
   - `Markup.button.callback('Pitsa', 'pizza')` · Inline tugma — Xabar tagida turadi. Bosilsa, chatga matn yozilmaydi, botga callback keladi.
   - `Markup.keyboard([['Pitsa']])` · Reply klaviatura — Klaviatura o'rnida turadi. Bosilsa, tugma matni oddiy xabar bo'lib ketadi.
   - 3 · Farqni eslab qoling — inline → callback → bot.action; reply → matn → bot.hears.
   - Sinfga savol: Ikkalasi bosilganda nima farq qiladi?
3. (10-ekran) **Handler hodisani ushlaydi**
   - `bot.action('pizza', …)` · Callback → bot.action — bot.action('pizza') tugma ma'lumoti 'pizza' bo'lganda ishlaydi.
   - `bot.hears('Pitsa', …)` · Matn → bot.hears — bot.hears('Pitsa') matn aynan «Pitsa» bo'lganda ishlaydi.
   - 3 · Handler yo'q — javob yo'q — Hodisa keladi, lekin uni ushlaydigan handler bo'lmasa, bot jim qoladi.
   - Sinfga savol: Inline tugma bosilishini qaysi handler ushlaydi?
4. (14-ekran) **Buyruqlar**
   - `/menu` · / bilan boshlanadi — /start, /help, /menu — buyruqlar.
   - `bot.command('menu', …)` · Kodda — bot.command — bot.command('menu', ...) /menu ni ushlaydi; /start uchun — bot.start.
   - 3 · Handler yo'q — javob yo'q — Buyruq keldi, lekin unga handler bo'lmasa, bot javob bermaydi.
   - Sinfga savol: Buyruq oddiy xabardan nimasi bilan farq qiladi?
5. (15-ekran) **bot.js tartibi**
   - `process.env.BOT_TOKEN` · Avval — Token o'qiladi (process.env.BOT_TOKEN).
   - `new Telegraf(token)` · Keyin — Bot yaratiladi: new Telegraf(token), ya'ni bot (Telegraf obyekti).
   - `bot.launch()` · Handlerlar, so'ng ishga tushirish — start, action, keyin fallback handler; eng oxiri launch().
   - Chizma: Token → Bot → start → action → fallback → launch
   - Sinfga savol: Nega launch() eng oxirida, fallback esa handlerlardan keyin turadi?

## Jonli viktorina (12 savol)
1. Bot tokeni qayerda saqlanadi?
   - Kodning o'zida, new Telegraf(...) qatorida
   - README faylida, jamoa ko'rishi uchun
   - ✔ .env faylida, Git'ga tushmaydigan joyda
   - Bot tavsifida, @BotFather sozlamasida
2. Telegraf nima?
   - ✔ Bot API bilan ishlashni osonlashtiradigan Node.js kutubxonasi
   - Foydalanuvchi xabarlarini saqlaydigan SQL ma'lumotlar bazasi
   - Botga rasm va video yuklab beradigan tashqi xizmat
   - Telegram ilovasining kompyuterda ishlaydigan versiyasi
3. `ctx` nima?
   - Bot sozlamalari saqlanadigan konfiguratsiya fayli
   - Foydalanuvchining Telegram parolini saqlaydigan obyekt
   - Serverning joriy vaqtini ko'rsatadigan funksiya
   - ✔ Hodisa haqidagi ma'lumot: kim yozdi va qaysi chatdan
4. Inline tugma bosilganda nima bo'ladi?
   - Tugma matni chatga oddiy xabar bo'lib qo'shiladi
   - ✔ Chatga matn yozilmaydi, botga tugma ma'lumoti keladi
   - Serverga avtomatik yangi rasm fayli yuklanadi
   - Bot o'zini qayta ishga tushirib, suhbatni tozalaydi
5. Reply klaviatura tugmasi bosilganda nima bo'ladi?
   - Hech narsa: tugma faqat bezak bo'lib turadi
   - ✔ Tugma matni chatga oddiy xabar bo'lib ketadi
   - Bot suhbatni to'xtatib, chatdan chiqib ketadi
   - Foydalanuvchi akkaunti vaqtincha bloklanadi
6. `bot.action(...)` nimani ushlaydi?
   - Faqat / bilan boshlanadigan buyruqlarni
   - Reply klaviaturadan kelgan oddiy matnni
   - ✔ Inline tugma bosilganda keladigan hodisani
   - Foydalanuvchi yuborgan rasm va fayllarni
7. `bot.hears(...)` nimani ushlaydi?
   - ✔ Aniq matnli xabarni, masalan reply tugma matnini
   - Faqat inline tugma bosilganda keladigan hodisani
   - Botning yoqilgani yoki o'chganini bildiradigan hodisani
   - Faqat ovozli xabarlarni, ularni matnga aylantirib
8. Fallback handler nima uchun kerak?
   - Bot dasturi tezroq ishga tushishi uchun
   - Faqat rasm kelganda xato xabarini chiqarish uchun
   - Tokenni qo'shimcha qatlam bilan himoyalash uchun
   - ✔ Mos handler topilmagan xabarga ham javob berish uchun
9. `ctx.reply(...)` javobni qaysi chatga yuboradi?
   - Bot egasining shaxsiy chatiga
   - Botga oxirgi yozgan odamning chatiga
   - Hamma foydalanuvchilarning chatiga
   - ✔ Xabar kelgan chatning o'ziga
10. Polling nimani bildiradi?
    - Telegram xabarni o'zi botning internetdagi manziliga yuborishi
    - ✔ Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rashi
    - Foydalanuvchi ovozini yozib, matnga aylantirish
    - Botning barcha xabarlarini o'chirib tashlash
11. `bot.launch()` nima qiladi?
    - Yangi token yaratib, eskisini butunlay bekor qiladi
    - Botni Telegram'dan o'chirib, uning akkauntini yopadi
    - ✔ Botni ishga tushiradi: bot hodisalarni kuta boshlaydi
    - Faqat botning rasmi va nomini yangilab qo'yadi
12. /start va /help qanday belgi bilan boshlanadi?
    - ✔ Qiyshiq chiziq (/) bilan
    - Yulduzcha (*) bilan
    - Ikki nuqta (:) bilan
    - Hech qanday belgisiz

- Arena yozuvlari (umumiy shablon): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Arenani yopish · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish
- Natija yozuvi: ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash
