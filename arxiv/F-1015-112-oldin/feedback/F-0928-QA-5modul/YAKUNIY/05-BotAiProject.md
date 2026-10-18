# 5-dars «Loyiha kuni: AI bilan bot» — yakuniy matn

Fayl: `src/5-Modull/BotAiProjectLesson.jsx` · 11 ekran (8 ekran + 3 amaliyot bloki A1–A3) · Keyingi dars: «Bot ichida AI»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish — ikki prompt
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Qaysi prompt yaxshiroq bot beradi?
- Mentor: Bugun kodni AI yozadi, natija esa promptingizga bog'liq — «▶ AI ikkalasiga javob bersin»ni bosib, ikki promptni solishtiring.
- Karta «Noaniq prompt»: menga Telegram bot yasab ber
  - (tugma bosilgach) AI javobi: Tilni o'zi tanladi, tugma turi noma'lum, token kodga ochiq yozildi.
- Karta «Aniq prompt»: AvtoPizza boti: /start → salom va «Menyu» tugmasi; «Menyu» → 3 ta pitsa tugmasi; pitsa tanlandi → «Buyurtma qabul qilindi». Tugmalar inline.
  - (tugma bosilgach) AI javobi: Uch handler, inline tugmalar — hammasi siz aytgandek.
- Tugma: ▶ AI ikkalasiga javob bersin → ✓ Solishtirildi
- Savol (tugma bosilgach ochiladi): Qaysi prompt yaxshiroq bot beradi?
  - Birinchisi — qisqa va tushunarli
  - ✔ Ikkinchisi — batafsil va aniq
  - Farqi yo'q — AI ikkalasini bir xil tushunadi
- Javob izohlari:
  - Ikkinchisi tanlansa: Aynan! Aniq promptda qarorlarni siz aytasiz: tugma, javob, tartib. AI faqat yozadi.
  - Birinchisi yoki «Farqi yo'q» tanlansa: Qiziq fikr! Natijaga qarang: birinchi promptda AI ko'p narsani o'zi tanladi. Ikkinchisida hammasini siz aytgansiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida o'z botingiz shunday ishlaydi.
- Mentor: Bu AvtoPizza — namuna; sizniki o'z g'oyangiz bilan bo'ladi, qadamlar esa bir xil.
- Yorliq: dars oxirida — namuna: AvtoPizza
- Chat «AvtoPizza» (bot · onlayn):
  - Mijoz: /start
  - Bot: AvtoPizza'ga xush kelibsiz! · tugmalar: Menyu · Buyurtma
  - Mijoz: «Menyu» bosildi
  - Bot: Tanlang: · tugmalar: Margarita · Pepperoni · Pishloqli
  - Bot: Pepperoni qabul qilindi. Manzilingizni yozing.
- Yorliq: Bugungi 3 qadam
  1. Reja — botingizni hodisa → javob juftlariga ajratasiz
  2. Qurish — Antigravity'ga prompt, AI kod yozadi, siz o'qiysiz
  3. Sinash — Telegramda har tugmani bosasiz, xatoni tuzatasiz
- Pastki qator: repo `TelegramBotNest` · boshlang'ich holat `dars-05-start` · tayyor namuna `dars-05-done`
- Tugmalar (telefonda): 3 qadamni ko'rish · ↩ Botni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Tushuncha · reja
- Eyebrow: Tushuncha · reja
- Sarlavha: Promptdan oldin bot nima qilishini kim hal qiladi?
- Mentor: AI botingiz nima qilishini bilmaydi — g'oyalarni bosib, har birining rejasi qanday yozilganini ko'ring.
- G'oya tugmalari: Viktorina boti · AvtoPizza · Eslatma boti (ko'rilgani oldida ✓)
- O'ng yorliq: reja → (bosilgach) «<g'oya nomi> — rejasi»
- Viktorina boti — rejasi:
  1. /start → «Boshlash» tugmasi
  2. «Boshlash» → savol va A, B, C
  3. A, B, C → to'g'ri yoki xato
- AvtoPizza — rejasi:
  1. /start → salom va «Menyu» tugmasi
  2. «Menyu» tugmasi → pitsalar
  3. Pitsa tanlandi → manzil so'raydi
  4. Manzil keldi → tasdiqlaydi
- Eslatma boti — rejasi:
  1. /start → qisqa qo'llanma
  2. Matn keldi → saqlaydi
  3. /royxat → ro'yxat
- Uchalasi ko'rilgach: Reja — hodisa → javob juftlari ro'yxati. Shu ro'yxat promptga ko'chadi.
- Tugmalar: Orqaga · 3 g'oyani ko'ring (N/3) → Davom etish

## 3 · Amaliyot 1 · reja va /start (A1)
- Eyebrow: Amaliyot 1 · reja va /start
- Sarlavha: Rejangizni yozing, /start ni o'zgartiring.
- Mentor: Birinchi juft — /start: bot sizning nomingiz bilan salomlashsin va o'z tugmalaringizni ko'rsatsin — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida tugma «Bajardim»; bajarilgani ✓ va ↻ qaytarish):
  1. Ochish — Antigravity'da `TelegramBotNest` papkasini oching. Terminalda: `npm run start:dev`. «Telegram bot ulandi» chiqsin.
  2. Prompt — qavs ichini o'z g'oyangiz bilan to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring.
     - Prompt qutisi («Siz → Antigravity» · tugma: Nusxalash → ✓ Nusxalandi):
       - src/api/telegram/telegram.service.ts faylida bot {bot nomi} boti bo'ladi.
       - /start → «{salom matni}» va inline tugmalar: {1-tugma}, {2-tugma}.
       - Ism so'rash va baza ishlashi o'zgarmasin. Har tugma uchun bot.action yoz, hozircha «Tez orada» deb javob bersin.
  3. Ishga tushirish — terminal o'zi qayta yukladi, xato yo'q.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Telegramda tekshirish — botingizga `/start` yuboring: o'z salomingiz va o'z tugmalaringiz chiqadi.
- Yorliq (o'ngda): kutilgan natija · namuna: AvtoPizza
- Chat «AvtoPizza»:
  - Mijoz: /start
  - Bot: AvtoPizza'ga xush kelibsiz! · tugmalar: Menyu · Buyurtma
  - Mijoz: «Menyu» bosildi
  - Bot: Tez orada
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-05-start`
- Hammasi bajarilgach: /start sizniki. Endi tugmalar haqiqiy javob beradi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega «menga bot yasab ber» — noaniq prompt?
  - AI o'zbekcha yozilgan buyruqni tushunmaydi
  - «Iltimos» deyilmagan, buyruq qo'pol yozilgan
  - ✔ Unda hodisa → javob juftlari va tugma turi yo'q
  - AI Telegram uchun bot kodini yoza olmaydi
- Javob izohlari:
  - To'g'ri: Juftlar va tugma turi aytilmasa, AI ularni o'zi taxmin qiladi.
  - A: AI o'zbekchani tushunadi — promptda ma'lumot yetishmayapti.
  - B: AI uchun odob emas, aniqlik muhim.
  - D: AI bot kodini yoza oladi — unga nima kerakligi aytilmagan.
- Test ekranlarining umumiy yozuvlari (4 va 7-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Tushuncha · AI kodi
- Eyebrow: Tushuncha · AI kodi
- Sarlavha: AI yozgan kodni ishlatishdan oldin nimani tekshirasiz?
- Mentor: Siz hozir AI kodini ko'rdingiz — chapdagi 4 tekshiruvni bosib, har biri kodda qayerda ekanini ko'ring.
- Chapda 4 tekshiruv (bosilgani o'ngda kodda yoritiladi, ko'rilgani ✓):
  - Har tugmaga handler bormi — `bot.action('menu', …)` — Tugma bor, handler yo'q — bot jim.
  - Tugma turi siz aytgandekmi — `Markup.inlineKeyboard` — Inline so'radingiz — AI reply yozmadimi.
  - Token kodda ochiq emasmi — `config.BOT_TOKEN` — AI tokenni qatorga yozib qo'ysa, `.env` ga qaytaring.
  - bot.on('text') eng oxiridami — `bot.on('text', …)` — U har matnni ushlaydi — oldinda tursa, buyruqlar unga tushib qoladi.
- Kod-karta `telegram.service.ts`:
```ts
this.bot = new Telegraf(config.BOT_TOKEN);

this.bot.start((ctx) =>
  ctx.reply('AvtoPizza\'ga xush kelibsiz!',
    Markup.inlineKeyboard([
      Markup.button.callback('Menyu', 'menu'),
      Markup.button.callback('Buyurtma', 'order'),
    ])));

this.bot.action('menu', (ctx) => ctx.reply('Tez orada'));
// 'order' uchun handler yo'q — tugma jim qoladi

this.bot.on('text', (ctx) => ctx.reply('Bu buyruqni bilmayman.'));
```
- 4 tekshiruv ko'rilgach: Kodni tushunsangiz, AI xatosini test paytida emas, o'qiyotganda topasiz.
- Tugmalar: Orqaga · 4 tekshiruvni ko'ring (N/4) → Davom etish

## 6 · Amaliyot 2 · juftlar (A2)
- Eyebrow: Amaliyot 2 · juftlar
- Sarlavha: Har tugma o'z ishini qilsin.
- Mentor: Rejangizdagi qolgan juftlarni AI yozadi, siz esa 4 tekshiruv bilan o'qiysiz — «1 · Ochish»dan boshlang.
- Qadamlar:
  1. Ochish — Antigravity'da `telegram.service.ts` ochiq, terminalda `npm run start:dev` ishlayapti.
  2. Prompt — rejangizdagi juftlarni yozing (2–3 ta), «Nusxalash», Antigravity'ga.
     - Prompt qutisi («Siz → Antigravity» · Nusxalash):
       - Rejadagi juftlarni qo'sh:
       - «{1-tugma}» bosilsa → {javob yoki yangi tugmalar}.
       - «{2-tugma}» bosilsa → {javob}.
       - {matn keladigan hodisa} → {javob} — buning uchun users.holat dan foydalan (4-darsdagi kabi).
       - bot.on('text') eng oxirida qolsin.
  3. Ishga tushirish — terminal xatosiz. AI kodini 4 tekshiruv bilan o'qing: handler bormi, inline'mi, token `.env` da, `on('text')` oxirida.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Telegramda tekshirish — `/start` → har tugmani bosing → har biri o'z javobini bersin; matn yuboring → bot kutgan javobni bersin.
- Yorliq (o'ngda): kutilgan natija · namuna: AvtoPizza
- Chat «AvtoPizza»:
  - Mijoz: «Menyu» bosildi
  - Bot: Tanlang: · tugmalar: Margarita · Pepperoni · Pishloqli
  - Mijoz: «Pepperoni» bosildi
  - Bot: Pepperoni — buyurtma qabul qilindi. Manzilingizni yozing.
  - Mijoz: Chilonzor, 12-uy
  - Bot: Buyurtma tasdiqlandi: Pepperoni · Chilonzor, 12-uy
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-05-start`
- Hammasi bajarilgach: Rejangiz kodga aylandi. Qolgani — sinash.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Tugma bosildi — bot jim. Sabab nima?
  - Token noto'g'ri, Bot API so'rovni rad etdi
  - Inline emas, reply tugma ishlatish kerak edi
  - Kod oxirida bot.launch() yozilmagan
  - ✔ Shu tugma uchun bot.action handleri yo'q
- Javob izohlari:
  - To'g'ri: Tugma bosilishini `bot.action` ushlaydi — yozilmagan bo'lsa, bot jim.
  - A: Token ishlayapti — bot tugmali xabarni yubordi.
  - B: Inline to'g'ri — callback keldi, uni kim ushlaydi?
  - C: Bot ishga tushgan — tugmali xabarni u yubordi.
  - D: (to'g'ri javob — yuqoridagi izoh)
- Umumiy yozuvlar — 4-ekrandagidek.

## 8 · Amaliyot 3 · sinash (A3)
- Eyebrow: Amaliyot 3 · sinash
- Sarlavha: Avval buzing, keyin bitta yangisini qo'shing.
- Mentor: Haqiqiy foydalanuvchi tugmalarni siz kutmagan tartibda bosadi — avval shuni qiling, keyin bitta o'z o'zgarishingizni qo'shing: «1 · Sinash».
- Qadamlar:
  1. Sinash — Telegramda tugmani ikki marta bosing, tartibni buzing, tasodifiy matn yozing. Bot jim qolgan yoki noto'g'ri javob bergan joyni toping.
  2. Tuzatish prompti — topilgan xatoni aniq yozing, «Nusxalash», Antigravity'ga.
     - Prompt qutisi («Siz → Antigravity» · Nusxalash):
       - «{tugma yoki xabar}» da bot {nima qildi}. Kerak: {nima qilishi kerak}. Tuzat, boshqa joyga tegma.
  3. O'zingizniki — bitta yangi narsa: yangi tugma, `/help` buyrug'i yoki boshqacha javob — promptni o'zingiz yozing.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Telegramda tekshirish — tuzatilgan joy va yangi narsa ishlaydi. Qo'shningizga botingizni bering: u ham bossin.
- Yorliq (o'ngda): kutilgan natija · namuna: AvtoPizza
- Chat «AvtoPizza»:
  - Mijoz: /help
  - Bot: /start — boshlash · /menu — pitsalar · /buyurtma — buyurtmam
  - Mijoz: «Pepperoni» ikki marta bosildi
  - Bot: Pepperoni allaqachon tanlangan. Manzilingizni yozing.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-05-start`
- Hammasi bajarilgach: Siz iteratsiya qildingiz: test → xato → tuzatish → qayta test.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Loyiha kuni tugadi
- Natija halqasi: N/2 · to'g'ri javob
- Sarlavha: Botingiz ishlaydi — tartibni ham bilasiz.
- Arena tugmasi CodeStrike (jonli darsda: Mentorni kuting)
- Yorliq: Takrorlash — kartochkalar
- Kartochkalar (12 ta):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yoziladigan matn nima deyiladi? | Prompt | Qancha aniq bo'lsa, AI shuncha kam taxmin qiladi |
| Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz — bu qanday usul? | AI bilan dasturlash | Kodni AI yozadi, tekshirish — sizning ishingiz |
| Prompt yozishdan oldin botni nimaga ajratasiz? | Hodisa → javob juftlariga | Bu ro'yxat — botning rejasi |
| Repo bo'lgani uchun promptda nima aytilmaydi? | Texnologiya va token | Ular `TelegramBotNest` va `.env` da |
| Inline tugma bosilganda botga nima keladi? | Callback | Bu ham hodisa — uni handler ushlashi kerak |
| Tugma bosildi, bot jim — nima yetishmayapti? | Handler | Shu tugma uchun `bot.action` yozilmagan |
| AI tokenni kodga ochiq yozdi — nima qilasiz? | .env ga qaytaraman | Kodda faqat `config.BOT_TOKEN` turadi |
| `bot.on('text')` nega eng oxirida yoziladi? | U har qanday matnni ushlaydi | Oldinda tursa, buyruqlar ham unga tushadi |
| AI kod bergach, birinchi nima qilasiz? | O'qiyman va test qilaman | Tushunmagan kodni ishlatmaysiz |
| Test, tuzatish va qayta test takrori nima deyiladi? | Iteratsiya | Bot ishlamaguncha takrorlanadi |
| Kodni o'qimay ko'chirgan odam nimada yutqazadi? | Buzilsa, sababini topolmaydi | Tushungan odam qayerdan buzilganini biladi |
| Terminalda xato chiqdi — Antigravity'ga nima deysiz? | Xato matnini yuboraman | «Shu xato chiqdi: … Tuzat» — taxmin emas, aniq xabar |

- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar: ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · N/N atama yodlandi · ↻ Qaytadan takrorlash
- Keyingi dars — «Bot ichida AI». Bugun AI botingizning kodini yozdi. Keyingi darsda AI botning ichida ishlaydi: mijoz savoliga javobni o'zi yozadi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Prompt Smith — Noaniq va aniq promptni farqladingiz (4-ekran, 1-savol)
- Handler Pro — Bot jim qolgani sababini topdingiz (7-ekran, 2-savol)
- Bot Builder — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, A3 oxirgi «Bajardim»)
- Nishon olinganda: Yangi nishon: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Aniq prompt — aniq bot»
   - 1 · Noaniq prompt — «Bot yasab ber» juda umumiy: juftlar va tugma turini AI o'zi tanlaydi.
   - 2 · Aniq prompt — Hodisa → javob juftlari va tugma turi aytilsa, AI kamroq taxmin qiladi.
   - 3 · Natija sizga bog'liq — Nima yozilishini prompt belgilaydi, promptni esa siz yozasiz.
   - Sinfga savol: Nega «yasab ber» — noaniq prompt?
2. 2-savol (7-ekran) — «Handler yo'q — javob yo'q»
   - `Markup.button.callback('Menyu', 'menu')` · Tugma bosilishi — hodisa — Inline tugma bosilganda botga callback keladi.
   - `this.bot.action('menu', …)` · Uni `bot.action` ushlaydi — Yozilmagan bo'lsa, bot jim qoladi.
   - 3 · Yechim — handler qo'shish — Tuzatish promptida qaysi tugma uchun handler kerakligini aniq yozing.
   - Sinfga savol: Inline tugma bosildi, bot javob bermadi — sabab?

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
3. Bugungi promptda nima aytiladi?
   - ✔ Hodisa va javob juftlari, tugma turi
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
