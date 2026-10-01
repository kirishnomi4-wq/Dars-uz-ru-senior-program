# 5-dars «Loyiha kuni: AI bilan bot» — yakuniy matn

Fayl: `src/5-Modull/BotAiProjectLesson.jsx` · 20 ekran · Keyingi dars: «Bot ichida AI»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish — ikki prompt
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Kodni AI yozadi. Qaysi prompt yaxshiroq bot beradi?
- Mentor: Oldingi darslarda bot ichini o'rgandingiz: handler, tugmalar, holat va baza. Bugun kodni AI yozadi, lekin natija promptingizga bog'liq. Tugmani bosing va ikki promptni solishtiring.
- Karta «Noaniq prompt»: menga Telegram bot yasab ber
  - (tugma bosilgach) AI javobi: Dasturlash tilini o'zi tanladi, tugma turi noma'lum, token kodga ochiq yozildi. Buzilsa, sababini topish qiyin.
- Karta «Aniq prompt»: Node.js va Telegraf'da viktorina boti kerak: /start → «Boshlash» tugmasi, «Boshlash» → savol va A, B, C tugmalari, A/B/C → «To'g'ri» yoki «Xato». Tugmalar inline bo'lsin, token .env faylidan olinsin.
  - (tugma bosilgach) AI javobi: Telegraf kodi, inline tugmalar, token .env faylidan. Har qatorni tushunasiz — chunki nimani so'raganingizni bilasiz.
- Tugma: ▶ AI ikkalasiga javob bersin → ✓ Ikki natija solishtirildi
- Savol: Qaysi prompt yaxshiroq bot beradi?
  - Birinchisi — qisqa va tushunarli
  - ✔ Ikkinchisi — batafsil va aniq
  - Farqi yo'q — AI ikkalasini bir xil tushunadi
- Javob izohlari:
  - Ikkinchisi tanlansa: Aynan! Aniq promptda asosiy qarorlarni siz aytasiz: texnologiya, tugma va token siz so'ragandek bo'ladi. Bugun shunday prompt yozishni va AI kodini tekshirishni o'rganamiz.
  - Birinchisi yoki «Farqi yo'q» tanlansa: Qiziq fikr! Natijalarga qarang: birinchi promptda AI ko'p narsani o'zi tanladi, token esa kodga ochiq yozildi. Ikkinchisida hammasini siz aytgansiz. Bugun shunday aniq prompt yozishni va AI kodini tekshirishni o'rganamiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugungi reja: viktorina botini AI bilan yozamiz.
- Mentor: Bu usul — AI bilan dasturlash: siz promptni aniq yozasiz, AI kod yozadi, siz uni o'qib tekshirasiz. Uni ko'pincha «vibecoding» deyishadi. Bizda bitta shart bor: AI yozgan kodni tushunmasdan ishlatmaysiz.
- Yorliq: bugungi bot
- Chat «MyQuizBot» (bot · onlayn):
  - Foydalanuvchi: /start
  - Bot: Viktorinaga xush kelibsiz! Tayyormisiz? · tugma: Boshlash
- Yorliq: Bugungi 4 qadam
  1. Botni hodisa → javob juftlariga ajratish
  2. Aniq prompt yozish (4 qism)
  3. AI kodini o'qib tekshirish
  4. Test va tuzatish
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Botni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Avval reja
- Eyebrow: Tushuncha · reja
- Sarlavha: Promptdan oldin — reja. Bot nima qiladi?
- Mentor: AI'ga yozishdan oldin botingizni hodisa → javob juftlariga ajrating: qaysi hodisa kelsa, bot qanday javob beradi. Har g'oyani bosib, uning rejasini ko'ring.
- G'oya tugmalari: Viktorina boti · AvtoPizza boti · Eslatma boti (ko'rilgani oldida ✓)
- O'ng yorliq: reja → (bosilgach) «<g'oya nomi> — rejasi»
- Viktorina boti — rejasi:
  1. /start → «Boshlash» tugmali salom
  2. «Boshlash» tugmasi → savol va A, B, C tugmalari
  3. A, B yoki C bosildi → «To'g'ri» yoki «Xato»
- AvtoPizza boti — rejasi:
  1. /start → salom va «Menyu» tugmasi
  2. «Menyu» tugmasi → taomlar ro'yxati
  3. Taom tanlandi → manzil so'raydi
  4. Manzil keldi → buyurtmani tasdiqlaydi
- Eslatma boti — rejasi:
  1. /start → qisqa qo'llanma
  2. Eslatma matni → saqlaydi
  3. /royxat → eslatmalarni ko'rsatadi
  4. /ochir → eslatmani o'chiradi
- Uchalasi ko'rilgach: Botning rejasi — hodisa → javob juftlari ro'yxati. Shu ro'yxat promptga yozilsa, AI nimani yozish kerakligini biladi.
- Tugmalar: Orqaga · 3 g'oyani ko'ring (N/3) → Davom etish

## 3 · Prompt tuzilishi
- Eyebrow: Tushuncha · prompt tuzilishi
- Sarlavha: Bugungi bot uchun promptda 4 narsa aytiladi.
- Mentor: AI'ga yoziladigan bu matn prompt deyiladi. Har qismni bosing va u nega kerakligini o'qing: bu ma'lumotlarni AI o'zi bilmaydi — ularni siz aytasiz.
- Kartalar (yonida › , ko'rilgach ✓; bosilgani o'ngda ochiladi — nomi · «namuna» · nega kerak):
  - Texnologiya — «Node.js va Telegraf kutubxonasi ishlatilsin» — AI qaysi til va kutubxonani ishlatishni o'zi tanlamaydi.
  - Hodisa → javob — «/start → Boshlash tugmasi, Boshlash → savol, A/B/C → to'g'ri yoki xato» — Bot nima qilishi shu juftlarda. Ularni yozmasangiz, AI o'zi o'ylab topadi.
  - Tugma turi — «variantlar inline tugma bo'lsin» — Inline yoki reply — buni siz tanlaysiz. Ikkalasining farqini 3-darsda ko'rgansiz.
  - Token .env faylida — «token .env faylidan olinsin: process.env.BOT_TOKEN» — Aks holda AI tokenni kodga ochiq yozib qo'yishi mumkin — bu xavfli.
- Tugmalar: Orqaga · 4 qismni oching (N/4) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega «menga bot yasab ber» — noaniq prompt?
  - AI o'zbekcha yozilgan buyruqni tushunmaydi
  - «Iltimos» deyilmagan, buyruq qo'pol yozilgan
  - ✔ Unda texnologiya, tugma turi va token yo'q
  - AI Telegram uchun bot kodini yoza olmaydi
- Javob izohlari:
  - To'g'ri: Noaniq promptda AI tilni, tugma turini va token joyini o'zi tanlaydi.
  - A: AI o'zbekchani ham tushunadi. Muammo tilda emas — promptda kerakli ma'lumot yo'q.
  - B: AI uchun odob emas, aniqlik muhim: muloyim, lekin noaniq prompt ham yomon natija beradi.
  - D: AI bot kodini yoza oladi — faqat unga nima kerakligini aniq aytish kerak.
- Test ekranlarining umumiy yozuvlari (4, 8, 10, 14-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Prompt yig'ish
- Eyebrow: Amaliyot · prompt yig'ish
- Sarlavha: Endi viktorina boti uchun promptni o'zingiz yig'ing.
- Mentor: 4 qismni birma-bir qo'shing — har biri promptga yoziladi. Tayyor promptni keyingi ekranda AI'ga yuborasiz.
- Chap yorliq: qismlarni qo'shing
  - Tugmalar (navbat bilan, qo'shilgach + o'rnida ✓): Texnologiya + · Hodisa → javob + · Tugma turi + · Token .env +
- O'ng yorliq: sizning promptingiz
- Karta «Siz → AI»:
  - Bo'sh holatda: Qismlarni qo'shing — prompt shu yerda yig'iladi.
  - Yig'iladigan matn: Viktorina boti kerak. Node.js va Telegraf kutubxonasi ishlatilsin. /start → «Boshlash» tugmali salom; «Boshlash» → savol va A, B, C tugmalari; A, B yoki C → «To'g'ri» yoki «Xato». Variantlar inline tugma bo'lsin. Token .env faylidan olinsin: process.env.BOT_TOKEN.
- Tugmalar: Orqaga · Promptni yig'ing (N/4) → Davom etish

## 6 · AI kodini o'qish
- Eyebrow: AI kodi · o'qish
- Sarlavha: AI yozgan kodni o'qib tushunish — eng muhim qadam.
- Mentor: Promptni yuboring va AI yozgan kodni o'qing. Kodning deyarli hammasi oldingi darslardan tanish; yangi qator bitta — `dotenv`: u .env faylini o'qiydi.
- Tugma: AI'ga promptni yuborish → AI kod yozyapti…
- Kod (fayl `bot.js`):
```js
require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) =>
  ctx.reply('Viktorinaga xush kelibsiz! Tayyormisiz?',
    Markup.inlineKeyboard([
      Markup.button.callback('Boshlash', 'start_quiz')
    ])))

bot.action('start_quiz', (ctx) =>
  ctx.reply('Telegraf qaysi til uchun kutubxona? A: Python · B: JavaScript · C: Go',
    Markup.inlineKeyboard([
      Markup.button.callback('A', 'ans_a'),
      Markup.button.callback('B', 'ans_b'),
      Markup.button.callback('C', 'ans_c')
    ])))

bot.launch()
```
- O'ng yorliq: kod izohi
  - `bot.start` → /start uchun handler
  - `Markup.button.callback` → inline tugma — siz so'ragandek
  - `bot.action('start_quiz')` → «Boshlash» bosilganda ishlaydigan handler
  - `process.env.BOT_TOKEN` → token .env faylidan (faylni `dotenv` o'qiydi)
- Xulosa: Siz so'ragan narsalar kodda ko'rinadi: inline tugmalar va .env dagi token. Hammasi ishlaydimi — buni test ko'rsatadi.
- Tugmalar: Orqaga · Avval promptni yuboring → Davom etish

## 7 · Test va tuzatish
- Eyebrow: Markaziy · test va tuzatish
- Sarlavha: Kod tayyor. Lekin u ishlaydimi? Test qilamiz.
- Mentor: Botni ishga tushirdingiz. Tugmalarni birma-bir bosib ko'ring. Qaysidir tugma ishlamasa, sababini topib, AI'ga tuzatish promptini yuborasiz.
- Nishon qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato sabab tanlansa) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Chat «MyQuizBot (test)» (bot · onlayn):
  - Foydalanuvchi: /start
  - Bot: Viktorinaga xush kelibsiz! Tayyormisiz? · tugma: Boshlash
  - (Boshlash bosilgach) Bot: Telegraf qaysi til uchun kutubxona? A: Python · B: JavaScript · C: Go · tugmalar: A · B · C
  - (A/B/C bosilgach, tuzatishdan oldin) callback → bot.action chizig'i uzilgan; bot javobi o'rnida: …
  - (tuzatilgach) callback → bot.action; Bot: B bosilsa — To'g'ri! Telegraf — JavaScript (Node.js) uchun kutubxona. · A yoki C bosilsa — Xato. To'g'ri javob: B — JavaScript.
- «Boshlash» bosilgach: «Boshlash» ishladi. Endi A, B yoki C ni bosing — nima bo'ladi?
- A/B/C bosilgach: Tugma bosildi, lekin bot javob bermadi. Sababi nima?
  - .env faylidagi BOT_TOKEN noto'g'ri
  - ✔ A, B, C tugmalari uchun bot.action handleri yo'q
  - A, B, C tugmalari reply turida yaratilgan
- Javob izohlari:
  - Token tanlansa: Bu sabab emas: bot hozirgina «Boshlash» ga javob berdi — token ishlayapti. Qaysi tugmalar javobsiz qoldi?
  - Reply tanlansa: Chatga qarang: A, B, C xabarning tagida turibdi — bular inline tugmalar. Qaysi tugmalar javobsiz qoldi?
  - To'g'ri: Topdingiz! Kodda `bot.action('start_quiz')` bor — shuning uchun «Boshlash» ishladi. A, B, C uchun esa handler yo'q: promptda so'ralgan, lekin AI yozmagan. Endi AI'ga tuzatish promptini yuboring.
- Karta «Siz → AI (tuzatish)»: A, B, C tugmalari uchun bot.action handlerlari qo'shilsin: B bosilsa «To'g'ri!», A yoki C bosilsa «Xato. To'g'ri javob: B» deb javob berilsin.
- Tugma: Tuzatish promptini yuborish → AI handler qo'shyapti…
- Tuzatilgach: AI handlerlarni qo'shdi. A, B yoki C ni yana bosing va tekshiring.
- Yakun: Bot ishladi. Siz hozir iteratsiya qildingiz: test → xatoni topish → tuzatish → qayta test. AI bilan ishlashda bu takror odatda bir necha marta bo'ladi.
- Tugmalar: Orqaga · Botni test qilib, tuzating → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI kod bergach, birinchi nima qilasiz?
  - ✔ Kodni o'qib chiqaman va botni test qilaman
  - O'qimasdan, botni darrov mijozlarga beraman
  - Kodni o'chirib, hammasini o'zim qayta yozaman
  - AI'dan xuddi shu kodni yana bir marta so'rayman
- Javob izohlari:
  - To'g'ri: Avval kodni o'qiysiz, keyin botni test qilasiz.
  - B: Xavfli: tekshirilmagan kodda xato bo'lishi mumkin, masalan handler yetishmasligi. Avval o'qing va test qiling.
  - C: Shart emas: AI kodi ko'pincha ishlaydi. Uni tushunib, test qilib, kerak joyini tuzatasiz.
  - D: Xuddi shu so'rov odatda o'xshash kod beradi. Avval o'qib, muammoni toping, keyin aniq tuzatishni so'rang.

## 9 · AI xatolari
- Eyebrow: Tushuncha · AI xatolari
- Sarlavha: AI ham xato qiladi. Kodni tushunsangiz, xatoni topasiz.
- Mentor: AI kodida uchrashi mumkin bo'lgan 4 xato bor. Har birini bosib ko'ring.
- Kartalar (yonida › , ko'rilgach ✓; bosilgani o'ngda ochiladi):
  - Token kodda ochiq — AI ba'zan tokenni to'g'ridan-to'g'ri kodga yozadi. Siz buni ko'rib, .env fayliga ko'chirasiz.
  - Handler yetishmaydi — Tugma bor, lekin uni ushlaydigan `bot.action` yo'q. Buni test paytida topasiz — viktorina botida ko'rganingizdek.
  - Noto'g'ri tugma turi — Siz inline so'radingiz, AI reply tugma yozdi (yoki aksincha). Farqini bilganingiz uchun tuzatasiz.
  - Eski sintaksis — AI kutubxonaning eski versiyasidagi kodni berishi mumkin. Telegraf hujjatlari bilan solishtirib, yangilaysiz.
- Tugmalar: Orqaga · 4 xatoni ko'ring (N/4) → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Bot inline tugmali xabar yubordi. Tugma bosildi — bot jim. Sabab nima?
  - Token noto'g'ri, Bot API so'rovni rad etdi
  - Inline emas, reply tugma ishlatish kerak edi
  - Kod oxirida bot.launch() yozilmagan
  - ✔ Shu tugma uchun bot.action handleri yo'q
- Javob izohlari:
  - To'g'ri: Tugma bosilishini `bot.action` ushlaydi — u yozilmagan bo'lsa, bot jim qoladi.
  - A: Token ishlayapti: bot hozirgina xabar yubordi. Noto'g'ri token bilan u hech narsa yubora olmas edi.
  - B: Inline tugma to'g'ri tanlangan. U bosilganda botga callback keladi — uni ushlaydigan handler kerak.
  - C: Bot ishga tushgan: tugmali xabarni aynan u yubordi. Muammo — tugma bosilishini ushlaydigan handler yo'qligida.

## 11 · Ikki yo'l
- Eyebrow: Tushuncha · ikki yo'l
- Sarlavha: AI'dan ikki xil foydalanish mumkin. Farqi nimada?
- Mentor: Ikkala odam ham kodni AI'dan oladi. Farq — keyin nima qilishida. Avval birinchisini o'qing, keyin tugmani bosing.
- Chap karta «Kodni o'qimasdan ko'chiradi»:
  - Zanjir: prompt — ko'chirish — ishlatish — buzildi
  - «Bot yasab ber» deb yozadi → kodni ko'chiradi → ishga tushiradi. Tez, lekin buzilsa, sababini topolmaydi: kod ichida nima borligini bilmaydi. Yangi tugma qo'shish ham qiyin.
- Tugma: Ikkinchisini ko'rish → ✓ Ko'rdingiz
- O'ng karta «Kodni tushunib tekshiradi»:
  - Zanjir: test — tuzatish
  - Kodni o'qiydi, test qiladi, xatoni topib, tuzatishni aniq so'raydi. Bot buzilsa — qayerdan buzilganini topadi; yangi tugma kerak bo'lsa — uni qayerga qo'shishni biladi.
- Xulosa: Shuning uchun oldingi darslarda bot ichini o'rgandik: handler, tugmalar, holat va baza. Kodni tushunsangiz, AI yozganini tekshira olasiz.
- Tugmalar: Orqaga · Farqni ko'ring → Davom etish

## 12 · Boshqa bot — eslatma boti
- Eyebrow: Hayotiy · boshqa bot
- Sarlavha: Boshqa bot, o'sha yo'l: g'oyadan ishlaydigan botgacha.
- Mentor: Endi eslatma botini ko'ramiz: g'oya boshqa, lekin qadamlar o'sha. Tugmani bosib, har qadamni oching.
- Qadamlar (birma-bir ochiladi):
  - 1 · Reja — /start → qisqa qo'llanma · eslatma matni → saqlaydi · /royxat → hamma eslatmalar.
  - 2 · Aniq prompt — «Node.js va Telegraf'da eslatma boti kerak: /start qisqa qo'llanma bersin, yuborilgan matn eslatma bo'lib saqlansin, /royxat hamma eslatmani ko'rsatsin. Tugma kerak emas. Token .env faylidan olinsin.»
  - 3 · AI kodi va o'qish — AI uchta handler yozdi: `bot.start`, `bot.on('text')` va `bot.command('royxat')`. Hammasi tanish, lekin tartibiga e'tibor bering.
  - 4 · Test va tuzatish — /royxat yuborildi, bot esa uni ham eslatma sifatida saqladi. Sabab: `bot.on('text')` har qanday matnni ushlaydi va u `bot.command('royxat')` dan oldin yozilgan. Tuzatish prompti: «bot.on('text') handlerlarning eng oxiriga o'tkazilsin».
  - 5 · Ishladi — Eslatma saqlandi, /royxat hammasini ko'rsatdi. Bot ishlaydi va siz uning har qismini tushunasiz.
- Tugma: ▶ Boshlash → Keyingi qadam → → ✓ Bot tayyor
- Karta «Ish tartibi» (5 qadam ochilgach): G'oya har xil, yo'l bir xil: reja → aniq prompt → AI kodi → o'qish → test → tuzatish. Shu tartib bilan o'z botingizni ham yozasiz.
- Tugmalar: Orqaga · Hikoyani oching (N/5) → Davom etish

## 13 · O'z botingiz
- Eyebrow: Loyiha · o'z botingiz
- Sarlavha: Endi navbat sizniki: o'z botingiz g'oyasini tanlang.
- Mentor: Amaliyotda o'z g'oyangizni shu tartib bilan botga aylantirasiz. Boshlashdan oldin ikki narsani eslab qoling.
- Karta «1. Avval reja»: Prompt yozishdan oldin botingizni hodisa → javob juftlariga ajrating. Reja qancha aniq bo'lsa, kod ham shuncha aniq chiqadi.
- Karta «2. Hozircha kompyuteringizda»: Bot kompyuteringizda ishlaydi: kompyuter o'chsa, bot ham jim qoladi. Botni serverga joylashni 7-darsda o'rganasiz.
- Tugma: Tushundim → ✓ Tushundim
- Tugmalar: Orqaga · Tushundim → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega reja promptdan oldin yoziladi?
  - AI rejani o'zi yaxshiroq tuzib beradi
  - ✔ Promptga yoziladigan juftlar rejadan olinadi
  - Reja faqat katta botlar uchun kerak bo'ladi
  - Reja kod yozilgandan keyin tuziladi
- Javob izohlari:
  - To'g'ri: Promptga yoziladigan hodisa va javob juftlari rejadan olinadi.
  - A: AI botingiz nima qilishi kerakligini bilmaydi — rejani siz tuzasiz.
  - C: Kichik botga ham reja kerak: viktorina botining rejasi uchta juftdan iborat edi.
  - D: Kod rejadan keyin yoziladi: AI nimani yozishini reja va prompt belgilaydi.

## 15 · Tartibni yig'ing (final)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: AI bilan ishlash tartibini yig'ing.
- Mentor: Bo'laklarni sudrab, to'g'ri tartibga qo'ying.
- Bo'laklar (aralash chiqadi): Reja · Aniq prompt · AI kod yozadi · Kodni o'qish · Test · Tuzatish
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · 6-qadam
- To'g'ri: ✓ Tartib to'g'ri: reja → aniq prompt → AI kodi → o'qish → test → tuzatish. Tuzatishdan keyin yana test qilinadi — bu takror iteratsiya.
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (xato urinishdan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · Loyiha kuni
- Eyebrow: Amaliyot · Loyiha kuni
- Sarlavha: AI bilan o'z botingizni yozing
- Mentor: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Yorliq: TOPSHIRIQ
- Topshiriq: O'z bot g'oyangizni tanlang va uni 3–4 ta hodisa → javob juftiga ajrating. Keyin gemini.google.com saytini oching, 4 qismli aniq prompt yozing, AI bergan kodni o'qing va botni kompyuteringizda ishga tushirib test qiling.
- Qadamlar (bittadan ochiladi; har birida tugma «Bajardim», bajarilgani oldida ✓ va qaytarish belgisi ↻):
  1. Bot g'oyangizni 3–4 ta `hodisa → javob` juftiga ajrating.
  2. gemini.google.com da 4 qismli prompt yozing: texnologiya, juftlar, tugma turi, token `.env` faylidan.
  3. AI bergan kodni o'qing: `bot.start`, `bot.action`, `process.env` — har qismini tushunasizmi?
  4. 1-darsda olgan tokeningizni `.env` fayliga yozing va botni kompyuteringizda ishga tushiring (kerakli buyruqlarni AI javobida ko'rasiz).
  5. Har tugmani bosib test qiling. Xato bo'lsa — tuzatish promptini yozing; xato bo'lmasa — bitta yangi tugma qo'shishni so'rang.
- Hammasi bajarilgach: ✓ Bajarildi — Mentorni kuting
- Xulosa: Botingiz ishladi. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting


## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yoziladigan matn nima deyiladi? | Prompt | Qancha aniq bo'lsa, AI shuncha kam taxmin qiladi |
| Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz — bu qanday usul? | AI bilan dasturlash | Kodni AI yozadi, uni tekshirish — sizning ishingiz |
| Prompt yozishdan oldin botni nimaga ajratasiz? | Hodisa → javob juftlariga | Bu ro'yxat — botning rejasi |
| Bugungi botning promptida qaysi 4 narsa aytildi? | Texnologiya, juftlar, tugma turi, token | To'rttasi aytilsa, AI kamroq taxmin qiladi |
| «Menga bot yasab ber» nega noaniq prompt? | AI hammasini o'zi tanlaydi | Texnologiya ham, tugma ham, token ham taxmin bilan chiqadi |
| Inline tugma bosilganda botga nima keladi? | Callback | Bu ham hodisa — uni handler ushlashi kerak |
| Callback'ni qaysi handler ushlaydi? | bot.action | Masalan, `bot.action('start_quiz', ...)` |
| Tugma bosildi, bot jim qoldi — nima yetishmayapti? | Handler | Shu tugma uchun `bot.action` yozilmagan |
| Bot tokeni qaysi faylda saqlanadi? | .env | Kodda faqat `process.env.BOT_TOKEN` turadi |
| AI kod bergach, birinchi nima qilasiz? | O'qiyman va test qilaman | Tushunmagan kodni ishlatmaysiz |
| `bot.on('text')` nega handlerlarning oxirida yoziladi? | U har qanday matnni ushlaydi | Oldinda tursa, /royxat buyrug'i ham unga tushib qoladi |
| Test, tuzatish va qayta test takrori nima deyiladi? | Iteratsiya | Bot ishlamaguncha takrorlanadi |

- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar: ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · N/N atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Loyiha kuni tugadi
- Sarlavha: Endi AI bilan bot yozish tartibini bilasiz.
- Natija halqasi: N/5 · to'g'ri javob
- Arena tugmasi CodeStrike (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - AI bilan ishlash tartibi: reja → aniq prompt → AI kodi → o'qish → test → tuzatish
  - Promptdan oldin botni hodisa → javob juftlariga ajratasiz — bu botning rejasi
  - Bugungi botning promptida 4 narsa aytildi: texnologiya, juftlar, tugma turi va .env dagi token
  - AI kodini tushunmasdan ishlatmaysiz: avval o'qiysiz, keyin test qilasiz
  - AI ham xato qiladi (handler yo'q, token ochiq) — kodni tushunganingiz uchun uni topib, tuzatasiz
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish →
- (bosilganda) Uyga vazifa:
  - Tugating — amaliyotdagi botingizni oxirigacha yozing: har tugmasi ishlasin
  - Qo'shing — botga bitta yangi buyruq (masalan, /help) qo'shish uchun tuzatish promptini o'zingiz yozing va AI bilan qo'shing
  - Saqlang — bot kodini va prompt matnini saqlang: 7-darsda botni serverga joylaysiz
- Keyingi dars — «Bot ichida AI». Bugun AI botingizning kodini yozdi. Keyingi darsda AI botning ichida ishlaydi: mijoz savoliga javobni o'zi yozadi.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Prompt Smith — Noaniq va aniq promptni farqladingiz (4-ekran, 1-savol)
- Bug Catcher — Yetishmagan handlerni test bilan topdingiz (7-ekran)
- Handler Pro — Bot jim qolgani sababini topdingiz (10-ekran, 3-savol)
- Build Order — AI bilan ishlash tartibini to'g'ri yig'dingiz (15-ekran)
- Nishon qatori (faqat 7-ekranda): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Aniq prompt — aniq bot»
   - 1 · Noaniq prompt — «Menga bot yasab ber» juda umumiy: texnologiya, tugma turi va tokenni AI o'zi tanlaydi.
   - 2 · Aniq prompt — Texnologiya, hodisa → javob juftlari, tugma turi va token aytilsa, AI kamroq taxmin qiladi.
   - 3 · Natija sizga bog'liq — Nima yozilishini prompt belgilaydi, promptni esa siz yozasiz.
   - Sinfga savol: Nega «yasab ber» — noaniq prompt?
2. 2-savol (8-ekran) — «AI kodini o'qib, test qilish»
   - 1 · Avval o'qing — AI kodni tez yozadi, lekin uni tushunmasdan ishlatmang.
   - 2 · Keyin test qiling — Botni ishga tushirib, har tugmani bosib ko'ring.
   - 3 · Kerak bo'lsa tuzating — Xato topsangiz, AI'ga aniq tuzatish promptini yozasiz.
   - Sinfga savol: AI kod bergach, birinchi nima qilasiz?
3. 3-savol (10-ekran) — «Handler yo'q — javob yo'q»
   - `Markup.button.callback('A', 'ans_a')` · Tugma bosilishi — hodisa — Inline tugma bosilganda botga callback keladi.
   - `bot.action('ans_a', …)` · Uni `bot.action` ushlaydi — Shu tugma uchun `bot.action` yozilmagan bo'lsa, bot jim qoladi.
   - 3 · Yechim — handler qo'shish — Tuzatish promptida qaysi tugma uchun handler kerakligini aniq yozing.
   - Sinfga savol: Inline tugma bosildi, bot javob bermadi — sabab?
4. 4-savol (14-ekran) — «Nega avval reja»
   - 1 · Reja — Botning hodisa → javob juftlari ro'yxati.
   - 2 · Prompt shu juftlardan yoziladi — Reja aniq bo'lsa, prompt ham aniq.
   - 3 · Rejasiz — AI o'zi taxmin qiladi — Botingiz nima qilishini u bilmaydi.
   - Sinfga savol: Nega reja promptdan oldin yoziladi?
5. Final (15-ekran) — «Nega aynan shu tartib»
   - 1 · Avval reja va prompt — AI nimani yozishini ular belgilaydi.
   - 2 · O'qish testdan oldin — Kodni tushunsangiz, test paytidagi xatoning sababini tez topasiz.
   - 3 · Tuzatish oxirida — Tuzatishdan keyin yana test qilinadi; bot ishlamaguncha shu takrorlanadi.
   - Sinfga savol: Nega reja eng boshida, test esa oxirida?

## Jonli viktorina (12 savol)
1. Nega «menga bot yasab ber» — noaniq prompt?
   - AI o'zbekcha yozilgan buyruqni tushunmaydi
   - ✔ Unda texnologiya, tugma turi va token yo'q
   - «Iltimos» deyilmagan, buyruq qo'pol yozilgan
   - AI Telegram uchun bot kodini yoza olmaydi
2. AI'ga prompt yozishdan oldin nima qilinadi?
   - Boshqa botning tayyor kodi ko'chirib olinadi
   - Bot kodi darrov serverga joylab qo'yiladi
   - Token kodning birinchi qatoriga yoziladi
   - ✔ Botning hodisa va javoblari rejaga yoziladi
3. Viktorina botining promptida qaysi 4 narsa aytildi?
   - ✔ Texnologiya, juftlar, tugma turi va token
   - Bot nomi, rangi, rasmi va qisqa tavsifi
   - Token, parol, telefon raqami va login
   - Server manzili, domen, narx va logotip
4. AI kod bergach, birinchi nima qilasiz?
   - O'qimasdan, botni darrov mijozlarga beraman
   - Kodni o'chirib, hammasini o'zim qayta yozaman
   - ✔ Kodni o'qib chiqaman va botni test qilaman
   - AI'dan xuddi shu kodni yana bir marta so'rayman
5. Bot tugmali xabar yubordi, lekin tugma bosilganda jim. Sabab?
   - Token noto'g'ri, Bot API so'rovni rad etdi
   - ✔ Shu tugma uchun bot.action handleri yo'q
   - Inline emas, reply tugma ishlatish kerak edi
   - Kod oxirida bot.launch() yozilmagan
6. AI tokenni kodga ochiq yozib qo'ydi. To'g'ri yechim qaysi?
   - ✔ Tokenni .env fayliga ko'chirish
   - Tokenni bot.js faylining oxiriga ko'chirish
   - Tokenni uzunroq qilib qayta yozish
   - Hech narsa qilmay, shundayligicha qoldirish
7. AI bilan dasturlashda ish qanday bo'linadi?
   - AI hamma qarorni o'zi qabul qiladi, siz kutasiz
   - Kodni siz yozasiz, AI esa faqat uni o'qiydi
   - AI kod yozadi va o'zi tekshiradi, siz ko'rmaysiz
   - ✔ Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz
8. AI kodida qanday xato bo'lishi mumkin?
   - AI kodida xato bo'lmaydi, u mukammal yozadi
   - ✔ Tugma uchun handler yozilmay qolishi mumkin
   - Xato faqat token noto'g'ri bo'lsa chiqadi
   - Xato faqat internet sekin bo'lganda chiqadi
9. Test paytida xato topildi. Keyin nima qilinadi?
   - Loyiha tashlanadi, boshqa g'oya olinadi
   - Boshqa bot noldan yozila boshlanadi
   - ✔ AI'ga aniq tuzatish prompti yoziladi
   - Kod o'chiriladi va AI'dan qayta so'raladi
10. AI bilan bot yozishning to'g'ri tartibi qaysi?
    - Prompt → AI kodi → nusxalash → ishlatish
    - Test → reja → prompt → AI kodi → o'qish
    - AI kodi → ishlatish → buzilsa, tashlab ketish
    - ✔ Reja → prompt → AI kodi → o'qish → test → tuzatish
11. «Iteratsiya» nima?
    - ✔ Test, tuzatish va qayta test takrori
    - Botni bir marta yozib, boshqa o'zgartirmaslik
    - Eski tokenni yangisiga almashtirish
    - Bot dasturini qayta ishga tushirish
12. AI kodni yozsa ham, bot ichini bilish nega kerak?
    - AI faqat bot ichini biladiganlarga kod yozadi
    - Bilmasangiz, AI kod yozishdan bosh tortadi
    - ✔ AI yozgan kodni tekshirib, xatosini topish uchun
    - Bot ichini bilsangiz, kod tezroq ishlaydi
