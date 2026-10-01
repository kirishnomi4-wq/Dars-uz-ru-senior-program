# 5-Modul (LMS: 7-Modul) · 3-dars «Telegram Bot API + tugmalar» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotApiButtonsLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** o'quvchi Telegram'dagi @BotFather bilan 3 qadamli suhbatni tugma bosib ochadi (/newbot → AvtoPizza → avto_pizza_bot) va 🔑 kalit oladi; keyin «Botjon yaratilgach, birinchi nima muhim?» savoliga javob beradi.
- **Markaziy o'yin:** «Tugmalar taxtasi» (9-ekran) — 3 xil signalni (/menu chaqiruv so'zi, 🍕 xabar ustidagi tugma, ℹ️ pastdagi taxta tugmasi) avval ulanmagan holda bosadi (mijoz kutadi / ketib qoladi), keyin 📋 qoidalar varag'iga qator qo'shib, qayta sinaydi.
- **Asosiy metafora:** 1-darsdagi Botjon + signal → amal + 📋 qoidalar varag'i davom etadi; yangi: ✉️ konvert (ctx), chaqiruv so'zi (/start, /menu), «xabar ustidagi tugma» (inline) va «pastdagi tugmalar taxtasi» (reply), oxirgi qator (fallback).
- **Yakun:** bot.ts qatorlarini to'g'ri tartibda yig'adi (kalit → Botjon → /start → tugma → oxirgi qator → ishga tushirish), VS Code'da o'z botiga menyu tugmalarini qo'shadi, keyingi dars — Stateful logika + PostgreSQL.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — BotFather'da tug'ilish | hook | BotFather suhbatini 3 qadamda ochadi, kalit oladi, «birinchi nima muhim?»ni tanlaydi | — |
| 1 | Reja | qoida | /menu → salom + tugmalar natijasi + bugungi 4 qadam | — |
| 2 | Kalit · .env | tushuncha | kodda ochiq kalit (xato) → .env (to'g'ri) ni ochadi | — |
| 3 | Arxitektura | tushuncha | Telegram → Telegraf → Bot Service → Nest Module qatlamlarini bosadi | — |
| 4 | 1-savol | test | kalitni qayerda saqlash to'g'ri | ✅ |
| 5 | Kod · /start | tushuncha | `bot.start` / `ctx` / `ctx.reply` qismlarini ochadi | — |
| 6 | Kod · ✉️ konvert | tushuncha | ctx ichidagi 3 maydonni ochadi | — |
| 7 | Tugmalar · maydon | tushuncha | inline va reply rejimlarini almashtirib, tugmalarni bosadi | — |
| 8 | 2-savol | test | inline va reply farqi | ✅ |
| 9 | Tugmalar taxtasi | markaziy o'yin | 3 signalni sinaydi → varaqqa qator qo'shadi → qayta sinaydi | — |
| 10 | 3-savol | test | xabar ustidagi tugma signalini qaysi qator ushlaydi | ✅ |
| 11 | Konvert · xato manzil | case | javob Valiga ketadi → manzilni tuzatadi → qayta sinaydi | — |
| 12 | Oxirgi qator · fallback | case | noma'lum xabar → jim → fallback qo'shadi; «Pizza»ni 8 marta bosib 429 ni ko'radi | — (bonus nishon) |
| 13 | Chaqiruv so'zlari | amaliyot | /start, /help, /menu buyruqlar ro'yxatini to'ldiradi | — (nishon) |
| 14 | 4-savol | test | chaqiruv so'zlari nimasi bilan alohida | ✅ |
| 15 | bot.ts'ni yig'ing | yakuniy | 6 kod qatorini sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · VS Code | praktika | o'z botiga /menu, 2 tugma va fallback qo'shadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa + kalit so'zlar | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon (bot) · signal → amal · 📋 qoidalar varag'i · qator (bot.start / bot.hears / bot.action / bot.command) · 🔑 kalit (token) · qulfli tortma (.env) ·
@BotFather · xizmat oynasi (Bot API) · ✉️ konvert (ctx, context) · chaqiruv so'zi (/start, /help, /menu) · buyruqlar ro'yxati ·
xabar ustidagi tugma (inline) · pastdagi tugmalar taxtasi (reply) · yashirin signal (callback) · oxirgi qator (fallback) ·
tezlik cheklovi (rate limit, 429) · Telegraf · Bot Service · Nest Module · ishga tushirish (bot.launch)

---

## 0 · Kirish — BotFather'da tug'ilish  `[706]`
- Eyebrow: Kirish
- Sarlavha: **1-darsda Botjonning sxemasini chizdingiz. Lekin u qog'ozda. Haqiqiy Botjon qanday tug'iladi?**
- Mentor: Telegram'da bot yaratadigan rasmiy bot bor — @BotFather. U bilan suhbatlashib Botjoningizni ochasiz. Tugmani bosib, butun jarayonni ko'ring.
- Chat (BotFather ✓ · rasmiy · bot yaratuvchi):
  1. /newbot → «Salom! Yangi bot yaratamiz. Botingizga qanday nom (ko'rinadigan ism) qo'yamiz?»
  2. AvtoPizza → «Yaxshi tanlov. Endi bot uchun username tanlang — u majburiy ravishda 'bot' bilan tugashi kerak.»
  3. avto_pizza_bot → «Tabriklayman! 🎉 Botingiz tayyor. Mana uning kaliti (token) — uni hech kimga bermang:» → 🔑 `7843129005:AAH9zK_mQ2vNqL8xQ`
- Tugma: ▶ BotFather bilan suhbat → Keyingi qadam (1/3) → Keyingi qadam (2/3) → ✓ Botjon yaratildi — kalit olindi
- Izoh: 3 ta xabar bilan Botjon tug'ildi — va sizga 🔑 kalit berildi. Bu kalit — kalit kimda bo'lsa, Botjon o'shaniki.
- Savol (suhbat tugagach ochiladi): **Botjon yaratilgach, birinchi nima muhim?**
  - Avval chiroyli logo va rang tanlayman
  - Kalitni (tokenni) olaman — usiz Botjonim xizmat oynasi bilan gaplasha olmaydi
  - Hech narsa — Botjon allaqachon o'zi ishlaydi
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! 🔑 Kalit — eng muhim narsa. Bugun: Botjonga muloqot qo'shamiz — chaqiruv so'zlari, ✉️ konvert va tugmalar.
- Tugma: Davom etish

## 1 · Reja  `[754]`
- Eyebrow: Reja
- Sarlavha: **Endi Botjonga `muloqotni` qo'shamiz.**
- Mentor: 1-darsda signal → amal sxemasini tushundingiz. Bugun Botjon gapiradigan bo'ladi: kalit olamiz, chaqiruv so'zi va ✉️ konvertni o'rganamiz, keyin tugmalar taxtasini o'zingiz qurasiz. Mana natija va 4 qadam.
- Blok: dars oxirida — shu ishlaydigan menyuni tushunasiz
  - Chat: /menu → «Salom! 👋 AvtoPizza'ga xush kelibsiz. Nima qilamiz?» · tugmalar 🍕 Menyu · 🛒 Buyurtma · ℹ️ Biz haqimizda
  - /menu (chaqiruv so'zi) → salom + tugmalar. Har tugma o'z signalini yuboradi, 📋 varaqdagi qator ushlaydi. Mana shuni quramiz.
- Bugungi 4 qadam:
  1. 🔑 Kalit va qulfli tortma (.env) · *kalit*
  2. Arxitektura: NestJS + Telegraf · *tuzilma*
  3. Chaqiruv so'zi va ✉️ konvert (ctx) · *kod*
  4. Tugmalar taxtasini quring — 📋 qoidalar varag'i · *markaziy o'yin*
- Tugmalar: 4 qadamni ko'rish / ↩ Natijani ko'rish (telefonda) · Orqaga · Boshlaymiz →

## 2 · Kalit · .env  `[793]`
- Eyebrow: Kalit · .env
- Sarlavha: **Kalit — Botjonning eng qadrli buyumi. Uni `qayerda saqlash` kerak?**
- Mentor: Kalit maxfiy. Agar uni to'g'ridan-to'g'ri kodga yozsangiz va git'ga yuborsangiz — hamma ko'radi va Botjoningizni o'g'irlaydi. Tugmani bosib, to'g'ri usulni ko'ring.
- Chap — ❌ Xato — kodda ochiq · `bot.ts`:
  ```js
  const bot = new Telegraf('7843129005:AAH9zK_mQ2vNqL8xQ')
  // ❌ git'ga tushadi — hamma o'qiydi!
  ```
- Tugma: To'g'ri usul qanday? → ✓ Ko'rdingiz
- O'ng (bosilgach) — ✅ To'g'ri — qulfli tortmada (.env):
  ```js
  // .env
  BOT_TOKEN=7843129005:AAH9zK_mQ2vNqL8xQ
  // .gitignore'da → git'ga TUSHMAYDI

  // bot.ts
  const bot = new Telegraf(process.env.BOT_TOKEN)
  // ✅ kod toza, kalit maxfiy
  ```
- Xulosa: Kalit .env — qulfli tortmada yashaydi (4-modulda auth'da ko'rgansiz). Kod undan process.env.BOT_TOKEN orqali o'qiydi. Kalit hech qachon git'ga tushmaydi.
- Pastki tugma: Xavfsiz usulni ko'ring → Davom etish

## 3 · Arxitektura  `[835]`
- Eyebrow: Arxitektura
- Sarlavha: **Botjoningiz `NestJS` ichida yashaydi.**
- Mentor: Yodingizdami — 4-modulda NestJS resurslari (Car, Book) qurgansiz. Botjon ham xuddi shunday: Telegraf kutubxonasi xizmat oynasi bilan gaplashadi, sizning 📋 qoidalar varag'ingiz esa Nest service ichida yashaydi. Har qatlamni bosing.
- Sxema: Telegram → Telegraf → Bot Service → Nest Module
- Qatlamlar (bosilganda ochiladi):
  - **Telegram** — Mijozning xabarlari shu yerda. Tashqi dunyoga xizmat oynasi (Bot API) orqali ulanadi.
  - **Telegraf** — Node.js kutubxonasi — xizmat oynasi bilan gaplashishni o'zi bajaradi. Siz kalitni berasiz, u ulanadi.
  - **Bot Service** — Botjonning o'zi — sizning qoidalar varag'ingiz: bot.start, bot.hears, bot.action. signal → amal shu yerda yoziladi.
  - **Nest Module** — Servisni Nest ilovasiga ulaydi — xuddi 4-modulda Car / Book resurslari kabi. Tanish, to'g'rimi?
- Xulosa: Siz faqat Bot Servicega 📋 qatorlar yozasiz (signal → amal). Telegraf va xizmat oynasi aloqasini o'zi hal qiladi. Nest bilimingiz to'g'ridan-to'g'ri ishlaydi.
- Tugma: Qatlamlarni ko'ring (0/4) → Davom etish

## 4 · 1-savol ✅  `[877]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot kalitini qayerda saqlash to'g'ri?**
  - To'g'ridan-to'g'ri bot.ts faylining ichida ochiq yozib qo'yamiz
  - ✔ .env faylda — u .gitignore'da turadi, git'ga hech qachon tushmaydi
  - README.md faylida, boshqalar ham ko'rib turishi uchun ochiq qoldiramiz
  - Hech qayerda saqlamaymiz, har safar BotFather'dan qayta so'raymiz
- To'g'ri: To'g'ri! Kalit .env faylda saqlanadi, u .gitignore'ga qo'shiladi — shuning uchun git'ga (va GitHub'ga) tushmaydi. Kod undan process.env.BOT_TOKEN orqali o'qiydi. Maxfiylik saqlanadi.
- Xato izohlari:
  - (bot.ts) Xavfli — kodda ochiq kalit git'ga tushadi va hamma ko'radi, Botjoningizni o'g'irlaydi. .env ishlating.
  - (README) README — ochiq hujjat, hamma o'qiydi. Kalit maxfiy bo'lishi kerak — .env'da saqlang.
  - (BotFather) BotFather kalitni faqat bir marta beradi (yoki qayta tiklash kerak). Uni .env'da xavfsiz saqlash kerak.
  - (umumiy) Kalit .env faylda saqlanadi — maxfiy va git'ga tushmaydi.
- Qisqa takrorlash havolasi: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish (oynasi pastda, 1-oyna)

## 5 · Kod · /start  `[897]`
- Eyebrow: Kod · /start
- Sarlavha: **Birinchi qator: `/start` kelganda Botjon javob bersin.**
- Mentor: Mana 1-darsdagi "/start → salom" sxemasi tirik kodda. Pastdagi 3 qismni bosib, har biri nima qilishini oching.
- Kod (`bot.service.ts`):
  ```js
  bot.start((ctx) => {
    ctx.reply('Salom! 👋')
  })
  ```
- Qismlar (bosilganda):
  - `bot.start` — signal: mijoz /start chaqiruv so'zini yuborganda ishga tushadi (1-darsdagi signal — endi kodda).
  - `ctx` — ✉️ konvert — kelgan xabar haqida hamma narsa: kim yubordi (ctx.from), matn (ctx.message.text) va qayerga javob berish (ctx.reply).
  - `ctx.reply` — amal: Botjonning javobi — mijozga xabar qaytaradi. Bu — 1-darsdagi amal.
- Xulosa: bot.start = signal, ctx.reply = amal. Aynan 1-darsdagi mantiq — faqat endi Telegraf yozilish qoidasida.
- Tugma: 3 qismni oching (0/3) → Davom etish

## 6 · Kod · ✉️ konvert  `[941]`
- Eyebrow: Kod · ✉️ konvert
- Sarlavha: **`ctx` — har xabar bilan keladigan ✉️ konvert.**
- Mentor: Har qatorga ctx (context) keladi — bu signal bilan birga kelgan "konvert": kim yozdi, nima yozdi va qayerga javob berish kerak. Ichidagi 3 narsani bosib ko'ring.
- Konvert: ✉️ ctx — konvert ichida
  - `ctx.from` · `{ id: 5012, first_name: "Aziza" }` — Kim yozdi — mijoz haqidagi ma'lumot.
  - `ctx.message.text` · `"Salom"` — Mijoz yuborgan matn.
  - `ctx.reply(...)` · → qayerga javob berish — Javob qanday va kimga qaytarilishi (amal).
- Xulosa: Demak ctx orqali Botjoningiz kim bilan, nima haqida gaplashayotganini biladi va to'g'ri manzilga javob bera oladi. Keyinroq bu manzil xato bo'lsa nima bo'lishini ko'ramiz.
- Tugma: Konvert ichini oching (0/3) → Davom etish

## 7 · Tugmalar · maydon  `[978]`
- Eyebrow: Tugmalar · maydon
- Sarlavha: **Ikki xil tugma: `xabar ustidagi` va `pastdagi taxta`. Farqini his qiling.**
- Mentor: Yuqoridagi tugmalar bilan rejimni almashtiring va tugmalarni bosib ko'ring. Xabar ustidagi tugma (inline) — bosilsa hech narsa yozilmaydi, signal jimgina ketadi. Pastdagi tugmalar taxtasi (reply) — bosilsa matn yoziladi.
- Rejim tugmalari: 🔘 Xabar ustidagi tugma · ⌨️ Tugmalar taxtasi (sinalgani ✓ oladi)
- **A — xabar ustidagi tugma rejimi:**
  - Chat: /menyu → «Menyuni tanlang:» · tugmalar 🍕 Pizza · 🥤 Ichimlik · 🛒 Savat
  - Karta: 🔘 Xabar ustidagi tugma — Xabarning tagiga yopishadi. Bosilganda matn YUBORMAYDI — yashirin signal jo'natadi. Botjon uni bot.action(...) bilan ushlaydi.
  - Bosilgach: ⚡ signal keldi → action: 'pizza' (yoki 'drink' / 'cart') · (chat tarixiga yangi xabar qo'shilmadi)
- **B — tugmalar taxtasi rejimi:**
  - Chat: «Tugmani bosing — u xabar bo'lib yuboriladi:» · pastki taxta 🍕 Pizza · 🥤 Ichimlik · 🛒 Savat · maydonda «Tugmani tanlang…»
  - Karta: ⌨️ Pastdagi tugmalar taxtasi — Klaviatura o'rnida turadi. Bosilganda u oddiy matn xabar sifatida yuboriladi. Botjon uni bot.hears(...) bilan ushlaydi.
  - Bosilgach: Ko'rdingizmi — bosilgan tugma mijozning xabari bo'lib chatga qo'shildi. Xabar ustidagi tugmada bunday bo'lmagandi.
- Xulosa (ikkalasi sinalgach): Qoida: tez tanlov/menyu uchun xabar ustidagi tugma, doimiy klaviatura (asosiy buyruqlar) uchun pastdagi taxta ishlatiladi.
- Tugma: Ikkala turni sinab ko'ring → Davom etish

## 8 · 2-savol ✅  `[1031]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Xabar ustidagi tugma va pastdagi taxta orasidagi asosiy farq?**
  - Ikkalasi bir xil ishlaydi, faqat rangi va shakli farq qiladi, xolos
  - Xabar ustidagi tugma faqat rasm yuboradi, taxta esa faqat matn yuborishi mumkin
  - Pastdagi taxta pulga, xabar ustidagi tugma esa bepulga ishlatiladi hozircha
  - ✔ Xabar ustidagi tugma yashirin signal yuboradi, taxta esa matn xabar yuboradi
- To'g'ri: To'g'ri! Xabar ustidagi tugma (inline) xabarga yopishadi va yashirin signal (bot.action ushlaydi) yuboradi. Pastdagi taxta (reply) esa oddiy matn xabar (bot.hears ushlaydi) yuboradi.
- Xato izohlari:
  - (rang) Rang emas — xulq-atvori farq qiladi: biri yashirin signal, ikkinchisi ochiq matn yuboradi.
  - (rasm) Ikkalasi ham matn yoki menyu uchun ishlatiladi. Farq — qanday signal yuborishida.
  - (pul) Pullik/bepul degan narsa yo'q — ikkalasi ham bepul. Farq — signal turi.
  - (umumiy) Xabar ustidagi tugma → signal (yashirin); pastdagi taxta → matn (ochiq).

## 9 · Tugmalar taxtasi (markaziy o'yin)  `[1056]`
- Eyebrow: Markaziy · tugmalar taxtasi
- Sarlavha: **Botjonga `tugmalar taxtasini` o'zingiz ulang.**
- Mentor: Pastda 3 xil signal bor: chaqiruv so'zi, xabar ustidagi tugma va pastdagi taxta tugmasi. Avval ularni sinab ko'ring — ulanmagan holda hech narsa bo'lmaydi. Keyin 📋 qoidalar varag'iga qo'shib, qayta sinang.
- Chat (AvtoPizza bot): «Signal yuboring, natijani ko'ring 👇»
- Signal tugmalari: 📜 /menu · 🔘 🍕 Pizza · ⌨️ ℹ️ Biz haqimizda (sinalgani ✓ oladi)
- 📋 Qoidalar varag'i (signal → amal) — har qatorda «+ qator qo'shish» → ✓:
  - `bot.command('menu', ...)`
  - `bot.action('pizza', ...)`
  - `bot.hears('ℹ️ Biz haqimizda', ...)`
- Ulangan signalga Botjon javobi:
  - /menu → «Menyu: 🍕 Pizza · 🥤 Ichimlik · 🛒 Buyurtma»
  - 🍕 Pizza → «🍕 Pizza tanlandi! Buyurtma qabul qilindi.»
  - ℹ️ Biz haqimizda → «AvtoPizza — 2020 yildan beri xizmatingizdamiz!»
- Ulanmagan signal bosilsa: 😐 Mijoz signal yubordi, javob kutmoqda . . . · bitta signal 3 marta bosilsa: 😕 Mijoz: "Buzuqmi bu?" — va ketib qoldi.
- Qisman ulanganda: Ulanmagan signal bosilsa — tugma bor, lekin varaqda qator yo'q. Chapdagi tugmani qayta bosib tekshiring.
- Muvaffaqiyat: 🎉 3 ta signal ham ulandi va ishladi: chaqiruv so'zi, xabar ustidagi tugma, pastdagi taxta. Tugma — bu faqat ko'rinish; ish 📋 varaqdagi qatordan chiqadi.
- Tugma: Barchasini ulang va sinang (0/3 ulandi, 0/3 sinaldi) → Davom etish

## 10 · 3-savol ✅  `[1129]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Xabar ustidagi tugma bosilganda kelgan signalni qaysi qator ushlaydi?**
  - ✔ bot.action('pizza', ...) — xabar ustidagi tugmadan kelgan signalni ushlaydi
  - bot.hears('pizza', ...) — faqat oddiy matn xabarlarni ushlaydi, tugmani emas
  - bot.start(...) — faqat /start chaqiruv so'zini ushlaydi, tugma signalini emas
  - bot.launch() — Botjonni ishga tushiradi, hech qanday signalni ushlamaydi
- To'g'ri: To'g'ri! Xabar ustidagi tugma yashirin signal yuboradi — uni bot.action(...) ushlaydi. (Pastdagi taxta tugmasi esa matn yuboradi va uni bot.hears(...) ushlaydi.)
- Xato izohlari:
  - (hears) bot.hears matn xabarni (pastdagi taxta) ushlaydi. Xabar ustidagi tugma uchun bot.action kerak.
  - (start) bot.start faqat /start chaqiruv so'zini ushlaydi, tugma signalini emas.
  - (launch) bot.launch() — Botjonni ishga tushiradi, qator emas. Xabar ustidagi tugma uchun bot.action ishlatiladi.
  - (umumiy) Xabar ustidagi tugma signali → bot.action(...) ushlaydi.
- Nishon: Button Master (birinchi urinishda to'g'ri bo'lsa)

## 11 · Konvert · xato manzil (case)  `[1149]`
- Eyebrow: ✉️ Konvert · xato manzil
- Sarlavha: **Javob `noto'g'ri odamga` ketsa nima bo'ladi?**
- Mentor: ✉️ Konvertda "qayerga javob berish" maydoni bor. Kod xato yozilsa, javob boshqa mijozga ketadi. Aziza savol yubordi, lekin kod Valining manziliga javob yozadi — buni sinab ko'ring, keyin tuzating.
- Chap: «Aziza — savol yubordi, javob kutmoqda» · chat Aziza: «Pizza qancha turadi?»
- Kod (`bot.service.ts`):
  ```js
  bot.hears('narx', (ctx) => {
    valiChatId.reply('30 000 so'm…')   // (valiChatId ustidan chizilgan)
  })
  // ❌ noto'g'ri manzilga (Vali) yozilgan
  ```
  Tuzatilgach: `ctx.reply('30 000 so'm…')` · `// ✅ ctx — signal yuborgan Azizaga javob beradi`
- O'ng: «Vali — bunday savol bermagan edi» · chat Vali
- Tugma: ▶ Signalni sinash
- Tuzatishdan oldin sinalsa: Aziza chatida «⏳ Javob kelmadi…» · Vali chatida «30 000 so'm, yetkazib berish bilan!» + «😳 Vali: "Men bunday savol bermagandim!"»
  - Ogohlantirish: Javob Valiga ketdi — Aziza hech narsa olmadi! Kod konvertdagi ctx'ni emas, boshqa mijozning manzilini ishlatgan. · Tugma: Konvert manzilini tuzatish
- Tuzatilgach: Tugma ▶ Qayta sinash → Aziza chatida «30 000 so'm, yetkazib berish bilan!» · Vali chatida «Endi bu chatga hech narsa kelmaydi ✓»
- Xulosa: ✅ Endi kod ctx.reply(...) ishlatadi — u har doim signal yuborgan mijozga javob beradi, boshqa hech kimga emas.
- Pastki tugma: Manzilni tuzating va sinang → Davom etish

## 12 · Oxirgi qator · fallback (case)  `[1206]`
- Eyebrow: Oxirgi qator · fallback
- Sarlavha: **Botjon hech qachon `jim qolmasin`.**
- Mentor: Mijoz varaqdagi hech bir qatorga mos kelmaydigan narsa yozsa nima bo'ladi? Avval sinab ko'ring, keyin oxirgi qator (fallback) qo'shib, Botjonni "jim qolmaslikka" o'rgating. Keyin «Pizza» tugmasini tez-tez bosib, xizmat oynasi qanday himoyalanishini kuzating.
- **1) Noma'lum xabar yuborish**
  - Chat (AvtoPizza bot): «Salom! /menu bosing.»
  - Tugma: ✉️ Noma'lum xabar yuborish → mijoz: «Necha soatda yetib boradi?»
  - Fallback yo'q bo'lsa: «🔇 Botjon jim qoldi…» · Ogohlantirish: Hech bir qatorga mos kelmadi — Botjon jim qoldi. Mijoz tashvishlanadi: "Ishlayaptimi bu?" · Tugma: Oxirgi qatorni varaqqa qo'shish
  - Fallback qo'shilgach (yana yuborilsa): bot «Kechirasiz, tushunmadim 🤔 /menu bosing yordam uchun.»
  - Xulosa: ✅ Endi bot.on('text', ...) — oxirgi qator — hech qanday qatorga mos kelmagan xabarga ham javob beradi. Botjon endi hech qachon jim qolmaydi.
- **2) Tezlik cheklovi (rate limit)**
  - (ostidagi ma'lumot qutisi bo'sh — matn yo'q)
  - Tugma: Pizza (0/8) → 8 marta bosilsa:
  - Ogohlantirish: ⏱ 429 — xizmat oynasi vaqtincha yopildi. Juda tez-tez signal yuborilsa, Telegram javob berishni to'xtatadi. Sekinroq yuboring. · Tugma: ↻ Qayta urinish
- Pastki tugma: Fallback qo'shing va sinang → Davom etish
- Nishon: Never Silent (darsning yagona bonus nishoni)

## 13 · Chaqiruv so'zlari (amaliyot)  `[1285]`
- Eyebrow: Amaliyot · chaqiruv so'zlari
- Sarlavha: **Telegram ko'rsatadigan `buyruqlar ro'yxatini` o'zingiz to'ldiring.**
- Mentor: Chaqiruv so'zlari / bilan boshlanadi — Telegram ularni avtomatik ro'yxatga chiqaradi. Har buyruq nima qilishini to'g'ri chipdan tanlab to'ldiring.
- Chap: 📋 Telegram — buyruqlar ro'yxati · /start ____ · /help ____ · /menu ____
- Variantlar (✔ = to'g'ri):
  - /start — ✔ Botni ishga tushiradi · Botni butunlay o'chirib tashlaydi · Faqat rasm yuboradi
  - /help — ✔ Yordam va buyruqlar ro'yxatini ko'rsatadi · Mijozning parolini qayta tiklaydi · Botni butunlay qayta o'rnatadi
  - /menu — ✔ Menyuni qayta ochadi · Mijozni chatdan chiqarib yuboradi · Botning kalitini ko'rsatadi
- Xato izohlari:
  - /start Botjonni O'CHIRMAYDI — u ishga tushirib, salomlashadi. · /start rasm bilan bog'liq emas — u suhbatni boshlaydi.
  - Botlarda odatda parol tizimi yo'q — /help yordam ko'rsatadi. · /help hech narsani o'rnatmaydi — faqat ma'lumot beradi.
  - /menu hech kimni chiqarib yubormaydi — u menyuni ko'rsatadi. · Kalit hech qachon mijozga ko'rsatilmaydi — bu maxfiy.
  - (umumiy) Bu to'g'ri emas.
- Nishon yozuvi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: Ro'yxat to'ldi! Mijoz endi / yozganda Telegram unga tanish buyruqlarni taklif qiladi.
- Tugma: Ro'yxatni to'ldiring → Davom etish
- Nishon: Command Writer

## 14 · 4-savol ✅  `[1343]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **/start va /help kabi chaqiruv so'zlari nimasi bilan alohida?**
  - Ular faqat mentor kompyuterida ishlaydi, boshqa hech joyda ishlamaydi
  - Ular botni butunlay o'chirib qo'yadi va qayta yoqish kerak bo'ladi
  - ✔ Ular / bilan boshlanadi, Telegram esa ularni ro'yxatda ko'rsatadi
  - Ular faqat rasm va video yuborish uchun ishlatiladigan buyruqlar, xolos
- To'g'ri: To'g'ri! Chaqiruv so'zlari / bilan boshlanadi va Telegram ularni avtomatik ravishda buyruqlar ro'yxatida ko'rsatadi — mijoz ularni bir qarashda ko'radi.
- Xato izohlari:
  - (mentor) Bunday cheklov yo'q — chaqiruv so'zlari istalgan qurilmada bir xil ishlaydi.
  - (o'chiradi) Chaqiruv so'zi botni o'chirmaydi — u faqat tegishli qatorni ishga tushiradi.
  - (rasm) Chaqiruv so'zlari matn bilan bog'liq, rasm/video bilan emas.
  - (umumiy) Chaqiruv so'zlari / bilan boshlanadi va ro'yxatga chiqadi.
- Nishon: Command Spotter (birinchi urinishda to'g'ri bo'lsa)

## 15 · bot.ts'ni yig'ing ✅ (final)  `[1372]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: `bot.ts`ni to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Diqqat: agar 🚀 ishga tushirishni 🔕 oxirgi qatordan oldin qo'ysangiz — oqibatini ko'rasiz.
- Bo'laklar (to'g'ri tartibda; ekranda aralash chiqadi):
  ```js
  const token = process.env.BOT_TOKEN
  const bot = new Telegraf(token)
  bot.start((ctx) => ctx.reply('Salom!', menu))
  bot.action('pizza', (ctx) => ctx.reply('🍕'))
  bot.on('text', (ctx) => ctx.reply('Tushunmadim'))
  bot.launch()
  ```
- Uyachalar yozuvi (1→6): avval kalit o'qiladi · keyin Botjon yaratiladi · keyin /start javob beradi · keyin tugma signalini ushlaydi · keyin oxirgi qator qo'shiladi · eng oxiri ishga tushiriladi
- To'g'ri: ✓ To'g'ri: kalit → Botjon → /start → tugma → oxirgi qator → ishga tushirish.
- Launch fallback'dan oldin bo'lsa: 😕 Botjon ishga tushdi, lekin oxirgi qator hali yo'q! — Notanish xabarlarga Botjon hamon jim qoladi. Tartibni to'g'rilang.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang. · ⚠️ Tartib xato — qayta joylang.
- Yakun: ✓ Tayyor bot fayli: kalit → Botjon → 📋 signal → 🔘 tugma → 🔕 oxirgi qator → 🚀 ishga tushirish. Mana shu — to'liq muloqot qiladigan Botjon.
- Havola (xato bo'lgan bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: bot.ts'ni yig'ing → Davom etish

## 16 · Amaliyot · VS Code  `[2189]`
- Eyebrow: Amaliyot · VS Code
- Sarlavha: **O'z Botjoningizga menyu tugmalari qo'shing**
- Mentor: Bu topshiriqni o'z kompyuteringizda — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — mentor kuzatib turadi.
- TOPSHIRIQ: BotFather'dan olgan (yoki mashq uchun yaratgan) botingizga /menu chaqiruv so'zini va kamida 2 ta xabar ustidagi tugmani qo'shing. Har tugma uchun bot.action qatorini yozing va oxiriga fallback (bot.on('text', ...)) qatorini qo'shing.
- Bosqichlar — belgilab boring:
  1. `.env` faylga `BOT_TOKEN` (kalitni) yozing
  2. `bot.command('menu', ...)` bilan 2 ta xabar ustidagi tugmali menyu chiqaring
  3. Har tugma uchun `bot.action(...)` qatorini yozing
  4. Oxiriga `bot.on('text', ...)` — oxirgi qator (fallback) qo'shing
  5. `bot.launch()` bilan Botjonni ishga tushiring va Telegram'da sinab ko'ring
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — mentorni kuting · «Zo'r! Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.» · pastda: Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[2018]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (x/N to'g'ri) · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2278]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Xizmat oynasi bilan gaplashishni siz o'rniga qaysi Node.js kutubxonasi bajaradi? | Telegraf | Siz kalitni berasiz — u o'zi ulanadi |
| Botjonning kalitini kodga ochiq yozmasdan qaysi fayldan olasiz? | .env | Kodda faqat process.env.BOT_TOKEN turadi, kalit git'ga tushmaydi |
| Har kelgan xabar bilan birga keladigan konvert kodda qanday yoziladi? | ctx | Ichida kim yozgani (ctx.from), matn (ctx.message.text) va javob yo'li bor |
| Mijozga javob xabarini qaysi buyruq yuboradi? | ctx.reply(...) | Bu — 1-darsdan tanish amal |
| /start chaqiruv so'zini qaysi qator ushlaydi? | bot.start(...) | Mijoz botni birinchi marta ochganda shu qator ishlaydi |
| Chaqiruv so'zlari qaysi belgi bilan boshlanadi? | Qiyshiq chiziq (/) | Telegram bunday so'zlarni buyruqlar ro'yxatida ko'rsatadi |
| Xabarning ustiga yopishib turadigan tugma qanday ataladi? | Inline tugma | Bosilganda suhbatga hech qanday matn yozilmaydi |
| Klaviatura o'rnida turadigan tugmalar taxtasi qanday ataladi? | Reply tugmalar | Bosilsa, matn xuddi o'zingiz yozgandek yuboriladi |
| Xabar ustidagi tugma bosilganda ketadigan yashirin signal nima deyiladi? | Callback | Jim signal — suhbatda ko'rinmaydi |
| Callback signalini qaysi qator ushlaydi? | bot.action(...) | Reply tugma matnini esa bot.hears(...) ushlaydi |
| Hech qaysi qatorga mos kelmagan xabarga kim javob beradi? | Fallback qatori | U bo'lmasa, Botjon jim qoladi |
| Botjonni ishga tushiradigan va faylning eng oxirida turadigan buyruq qaysi? | bot.launch() | Avval hamma qoidalar yoziladi, keyin bot ishga tushadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Orqaga · Yakunlash →

## 19 · Yakun  `[2305]`
- Eyebrow: Tayyor
- Belgi: ✓ Botjoningiz endi muloqot qiladi
- Sarlavha: **Botjon endi `gapiradi` va tugmalari bor.** (yonida ball halqasi)
- Jonli viktorina tugmasi (CodeStrike) · o'quvchida: ⏳ Mentorni kuting
- Endi siz bilasiz:
  - Botjon @BotFather orqali yaratiladi va 🔑 kalit (token) oladi
  - Kalit .env — qulfli tortmada saqlanadi, git'ga tushmaydi
  - Har qatorga ✉️ konvert (ctx) keladi — kim yozdi va qayerga javob berish
  - Xabar ustidagi tugma (inline) → signal; pastdagi taxta (reply) → matn
  - 📋 Qoidalar varag'i signal → amal bog'laydi; oxirgi qator (fallback) hech qachon jim qoldirmaydi
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish →
- 📝 Uyga vazifa:
  - **Yarating** — Telegram'da @BotFather'ga /newbot yuborib, o'z Botjoningizni oching
  - **Saqlang** — olgan kalitingizni .env faylga BOT_TOKEN sifatida yozing (hech kimga bermang)
  - **Qo'shing** — botingizga /menu chaqiruv so'zi, 2 ta tugma va bitta oxirgi qator (fallback) qo'shing
- 🚀 Keyingi dars — Stateful logika + PostgreSQL: Botjonga 📓 xotira beramiz, mijoz va suhbat holatini saqlaymiz!
- 🏅 Nishonlaringiz — N/4 (olinmaganlari 🔒)
- 💡 Kalit so'zlar (takrorlash) — ochiladigan ro'yxat: **BotFather** — bot yaratadigan rasmiy Telegram bot · **token** — Botjonning maxfiy kaliti (.env'da) · **Telegraf** — Node.js bot kutubxonasi · **ctx** — context: xabar haqidagi ✉️ konvert · **bot.start** — /start chaqiruv so'zini ushlaydi · **inline** — xabar ustidagi tugma (signal) · **reply** — pastdagi tugmalar taxtasi (matn) · **bot.action** — xabar ustidagi tugma signalini ushlaydi · **bot.hears** — matn / reply tugma signalini ushlaydi · **fallback** — oxirgi qator, hech qachon jim qolmaslik uchun · **rate limit** — tezlik cheklovi (429) · **bot.launch** — Botjonni ishga tushiradi
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** Button Master — Tugma signalini qaysi qator ushlashini topdingiz (10-ekran) · Command Spotter — Chaqiruv so'zlarining farqini topdingiz (14-ekran) · Never Silent — Fallback qo'shib, Botjonni jim qoldirmadingiz (12-ekran, bonus) · Command Writer — Buyruqlar ro'yxatini xatosiz to'ldirdingiz (13-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

**Test ekranlari umumiy yozuvlari:** Javob tanlang · Qaytadan urinib ko'ring · To'g'ri javobni toping · ✓ To'g'ri javob: B — … · ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · Avval natijani oching

**Qisqa takrorlash oynalari (5):** (oyna tugmalari: ← Oldingi · Keyingisi → · 📖 Qayta tushuntirish · 🗣️ Sinfga savol: · ✓ Tushunarli — davom etamiz · Yopish)
1. Kalit — .env ichida (4-ekran): Token — Botjonning kaliti — Token — Botjon uchun kalit. U kimda bo'lsa, bot o'sha kishiniki. · Qulfli tortma — .env — Kalit .env — qulfli tortmada saqlanadi, u git'ga tushmaydi. · Kodda ochiq yozilmaydi — Kalitni kodning ichiga ochiq yozsangiz — hamma ko'radi va Botjonni o'g'irlaydi. · Sinfga savol: Token nega .env"da saqlanadi?
2. Ikki xil tugma (8-ekran): Xabar ustidagi tugma (inline) — Xabarga yopishadi. Bosilsa hech narsa yozilmaydi — yashirin signal ketadi. · Pastdagi tugmalar taxtasi (reply) — Klaviatura o'rnida turadi. Bosilsa — matn xuddi o'zi yozgandek yuboriladi. · Farqni eslab qoling — Inline = callback (jim signal). Reply = matn xabar. · Sinfga savol: Ikkalasi qanday farq qiladi?
3. Qator — signalni ushlaydi (10-ekran): Tugma signali → shu qator — Xabar ustidagi tugma signalini bot.action(...) qatori ushlaydi. · Matn signali → boshqa qator — bot.hears(...) — reply tugma yoki oddiy matnni ushlaydi. · Qator yo'q bo'lsa — Signal ketadi, lekin uni ushlaydigan qator bo'lmasa — Botjon hech narsa qilmaydi. · Sinfga savol: Signalni qator qanday ushlaydi?
4. / chaqiruv so'zlari (14-ekran): / bilan boshlanadi — Chaqiruv so'zlari (/start, /help) qiyshiq chiziq bilan boshlanadi. · Telegram ro'yxatga chiqaradi — Bunday so'zlarni Telegram avtomatik buyruqlar ro'yxatida ko'rsatadi. · Qator yo'q — Botjon jim — Chaqiruv so'zi yozilsa-yu, varaqda qatori bo'lmasa — Botjon javob bermaydi. · Sinfga savol: Chaqiruv so'zlari nimasi bilan alohida?
5. bot.ts tartibi (15-ekran): Avval — kalit o'qiladi — Birinchi qator — token .env'dan o'qiladi. · Keyin — Botjon yaratiladi — Token bilan Botjon (Telegraf obyekti) yaratiladi. · Qoidalar, so'ng ishga tushirish — Handlerlar (start, action, fallback) yoziladi — eng oxiri launch(). (🔑 Token → 🤖 Bot → 📋 start → 🔘 action → 🔕 fallback → 🚀 launch) · Sinfga savol: Nega launch() eng oxirida turadi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Bot kaliti (tokeni) qayerda saqlanishi kerak? Kodning ichida ochiq, hammaga ko'rinadigan joyda saqlanadi · README faylida, hujjat sifatida yozib qo'yiladi doim · ✔ .env faylda — git'ga tushmaydigan alohida maxfiy joyda · Hech qayerda, har ishga tushirishda qo'lda kiritiladi doim
2. Telegraf nima? ✔ Bot API bilan gaplashishga yordam beruvchi Node.js kutubxonasi · Foydalanuvchi xabarlarini saqlaydigan alohida ma'lumotlar bazasi · Botga rasm va video yuklab beradigan tashqi servis nomi · Telegram ilovasining o'zi, kutubxona bilan aloqasi yo'q narsa
3. `ctx` (context) nimani anglatadi? Botning umumiy sozlamalari saqlanadigan alohida konfiguratsiya fayli · Foydalanuvchining shaxsiy Telegram parolini doimiy saqlaydigan maxfiy obyekt · Serverning joriy vaqtini ko'rsatadigan texnik yordamchi funksiya · ✔ Har xabar bilan keladigan konvert — kim yozdi va qayerga javob berish
4. Inline tugma bosilganda nima yuboriladi? Foydalanuvchi yozgandek oddiy matn xabari chatga qo'shiladi · ✔ Chatga hech narsa yozilmaydi, yashirin signal (callback) ketadi · Avtomatik ravishda darhol yangi surat fayli serverga yuklab yuboriladi · Bot darhol o'zini o'zi qayta ishga tushiradi va qayta ochiladi
5. Reply tugma bosilganda nima sodir bo'ladi? Hech narsa bo'lmaydi, tugma faqat bezak sifatida turaveradi · ✔ Tugmadagi matn xuddi o'zi yozgandek chatga xabar bo'lib qo'shiladi · Bot darhol suhbatni butunlay to'xtatib, chatni tark etadi · Foydalanuvchining shaxsiy Telegram akkaunti avtomatik butunlay o'chirib yuboriladi
6. `bot.action(...)` qaysi signalni ushlaydi? Faqat /start kabi chaqiruv so'zlarini, boshqasini ushlamaydi · Reply tugmadan kelgan oddiy matn xabarlarini shu yerda doimo ushlaydi · ✔ Xabar ustidagi tugma bosilganda kelgan yashirin signalni ushlaydi · Faqat rasm va fayllarni qabul qilish uchun ishlatiladi doimo
7. `bot.hears(...)` qaysi signalni ushlaydi? ✔ Reply tugma yoki foydalanuvchi yozgan oddiy matn xabarini ushlaydi · Faqat xabar ustidagi tugmadan kelgan yashirin signalni ushlaydi · Botning doimiy ishga tushish-o'chirish holatini kuzatadigan texnik signalni ushlaydi · Faqat ovozli xabarlarni tinglab, matnga aylantiradigan funksiya
8. Fallback (oxirgi qator) nima uchun kerak? Botni tezroq ishga tushirish uchun, boshqa foydasi yo'q unda · Faqat rasm yuborilganda xato xabarini chiqarish uchun kerak · Kalitni maxfiy saqlash uchun qo'shimcha himoya qatlami sifatida · ✔ Hech qaysi qatorga mos kelmagan xabarga ham javob berish uchun
9. Tezlik cheklovi (rate limit) nimani anglatadi? Botning internetga ulanish tezligini sekinlashtiradigan sozlama · Foydalanuvchining telefon tezligini o'lchaydigan ichki funksiya · Bot javobining shrift o'lchamini avtomatik kichraytiradigan qoida · ✔ Juda tez-tez signal yuborilsa xizmat oynasi vaqtincha yopiladi
10. Polling nimani bildiradi? Telegram serveri botga qo'ng'iroq qilib xabar yetkazishi · ✔ Bot o'zi Telegram'dan yangi xabar bormi deb so'rab turishi · Foydalanuvchi ovozini yozib olib, matnga aylantirish jarayoni · Botning barcha xabarlarini butunlay o'chirib tashlash amali
11. `bot.launch()` nima qiladi? Yangi maxfiy kalit avtomatik yaratadi va eskisini butunlay bekor qilib tashlaydi · Botni Telegram'dan butunlay o'chirib, hisobni yopib qo'yadi · ✔ Botni ishga tushiradi — u signallarni kutib, qatorlarga javob beradi · Faqat bot rasmini va nomini yangilaydigan texnik buyruq
12. /start va /help kabi chaqiruv so'zlari qanday belgi bilan boshlanadi? ✔ Qiyshiq chiziq (/) bilan — Telegram ularni ro'yxatda ko'rsatadi · Yulduzcha (*) bilan — bular maxsus admin buyruqlari hisoblanadi · Ikki nuqta (:) bilan — bular faqat kod ichida ishlatiladigan belgi · Hech qanday belgisiz — oddiy so'z sifatida yoziladi va yuboriladi

Viktorina natijasi yozuvi: ball · x/12 to'g'ri · eng uzun streak 🔥xN

---

## Mening dastlabki belgilarim (qonun-ro'yxatlar bo'yicha — faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **15-ekran (final) javobni ochib qo'yadi:** uyachalarda «avval kalit o'qiladi · keyin Botjon yaratiladi · keyin /start javob beradi · keyin tugma signalini ushlaydi · keyin oxirgi qator qo'shiladi · eng oxiri ishga tushiriladi» deb yozilgan — bu tayyor tartib, bo'laklarni shunchaki moslab qo'yish qoladi. Mentor gapi ham launch fallback'dan keyin turishini aytadi.
- **10-ekran testi «sotilgan»:** xato variantlarning o'zi «…tugmani emas», «…tugma signalini emas», «…hech qanday signalni ushlamaydi» deb o'zini inkor qiladi — faqat to'g'ri variantda «tugmadan kelgan signalni ushlaydi» deyilgan.
- **Bir narsa, ikki xil joy:** tugma «xabar **ustidagi**» deb ataladi (7, 8, 9, 10, 19-ekran, kartochkalar), lekin 7-ekran kartasida «Xabarning **tagiga** yopishadi» deyiladi (ruschasi ham «под сообщением»). O'quvchi tugma qayerdaligini ikki xil eshitadi.
- **Bir narsa, ikki xil nom:** buyruq 7-ekranda «/menyu», qolgan hamma joyda «/menu» (1, 9, 12, 13, 16, 19-ekran). 13-ekranda bitta gapda «chaqiruv so'zlari» va «Har buyruq» — bir narsaning ikki nomi. 1-darsdagi «Ro'yxat idorasi (BotFather)» bu darsda umuman ishlatilmaydi — faqat «@BotFather».
- **Izohsiz / ekranda o'rgatilmagan inglizcha so'zlar:** «Callback» — hech bir ekranda aytilmagan (7-ekran «yashirin signal» deydi), lekin kartochka 9–10, Qisqa takrorlash 2 («Inline = callback») va viktorina 4-savolda atama sifatida so'raladi. Yana: «Handlerlar» (Qisqa takrorlash 5), «username» (0-ekran), «streak» (viktorina natijasi), «Bot Service» / «Nest Module» / «Nest service» (3-ekran).
- **0-ekran hook — har javobga «Aynan!»:** «Avval chiroyli logo va rang tanlayman» yoki «Hech narsa — Botjon allaqachon o'zi ishlaydi» tanlaganga ham «Aynan! 🔑 Kalit — eng muhim narsa» chiqadi. Shu ekrandagi «Bu kalit — kalit kimda bo'lsa, Botjon o'shaniki» jumlasi ham chalkash («kalit» ikki marta).
- **Oldingi darslarga havolalar:** 1-dars amaliyoti (16-ekran) va uyga vazifasida o'quvchi allaqachon @BotFather → /newbot → kalit qilgan; bu darsda 0-ekran shu jarayonni «Haqiqiy Botjon qanday tug'iladi?» deb yangidek ko'rsatadi, uyga vazifaning «Yarating — /newbot yuborib, o'z Botjoningizni oching» bandi ham takror. 0-ekrandagi «1-darsda Botjonning sxemasini chizdingiz. Lekin u qog'ozda» ham chalg'itadi — 1-darsning 16-ekranida o'quvchi botni Telegram'da haqiqatan ochgan, «qog'ozda» emas. 2- va 3-ekranda «4-modulda» — LMS'da bu dars 7-Modul, NestJS (Car, Book) esa dasturda 4a-bo'limda; o'quvchi uchun «4-modul» qaysi ekani noaniq.
- **Taqiq-ro'yxatdagi so'zlar:** «chip» — 13-ekran Mentor («to'g'ri chipdan tanlab to'ldiring»); «hisoblanadi» — viktorina 12-savol B varianti («maxsus admin buyruqlari hisoblanadi»).
