# 5-Modul (LMS: 7-Modul) · 3-dars «Telegram Bot API + tugmalar» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotApiButtonsLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `03-BotApiButtons-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti `INLINE_KEYS`, 0 dan sanaladi: `s4:1 · s8:3 · s10:0 · s14:2 · s15` tartib — sentinel 0; viktorina ✔: C·A·D·B·B·C·A·D·D·B·C·A; hook ✔ — 2-variant; 13-ekran — ballsiz, variantlar aralash (4-savol A)) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi · 29.09 v2-qoralama · **30.09: ChatGPT auditi + QA (F-0930-58…64) qo'llandi** (hukmlar — `JURNAL.md`) · QARORLAR 5-savol **A** (`bot.js`) va 9-savol **B** (kerakli minimum, `/setcommands` — «Qo'shimcha») — F-0930-65.
⚠️ Viktorina 9-savolning mazmuni almashdi (rate limit → `ctx.reply`), ✔ o'rni (D) o'sha.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Quyida faqat shu darsga xos qo'shimchalar.

**A1-qo'shimcha (shu darsda birinchi chiqadigan atamalar):**

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| chaqiruv so'zi | **buyruq** (command) | «/ bilan boshlanadigan xabar: /start, /help, /menu» (1-ekran) |
| xabar ustidagi tugma | **inline tugma** | «xabarning tagida, unga yopishib turadigan tugma» (7-ekran) |
| pastdagi tugmalar taxtasi | **reply klaviatura** | «oddiy klaviatura o'rnida chiqadigan tugmalar; bosilsa, tugma matni xabar bo'lib ketadi» (7-ekran) |
| yashirin signal | **callback** | «inline tugma bosilganda botga keladigan hodisa; ichida tugma ma'lumoti bor (masalan, `'pizza'`), chatda ko'rinmaydi» (7-ekran) |
| — | **Markup** | «Telegraf'ning tugma yasaydigan yordamchisi: `inlineKeyboard` — inline tugmalar, `keyboard` — reply klaviatura» (7-ekran) |
| Botjon (Telegraf obyekti) | **bot** (Telegraf obyekti) | «`new Telegraf(token)` yaratadigan obyekt» (2-ekran) |
| konvert (ctx) | **ctx** | «context — hodisa haqidagi ma'lumot»; konvert o'xshatishi bir marta — 6-ekran Mentorida |
| qoidalar varag'i · qator · oxirgi qator | **handler** · **fallback handler** (A1 bo'yicha) | — |
| xizmat oynasi | **Telegram Bot API** (A1 bo'yicha) | — |
| tezlik cheklovi · rate limit · 429 | — (bu darsda yo'q: 12-ekrandan olindi, F-0930-62) | — |
| Bot Service · Nest Module | — (3-ekranda yo'q; NestJS bir gapda: «katta loyihada handlerlar NestJS service ichiga joylanadi») | — |

**A1-qoida (shu darsdan butun modulga):** «buyruq» — faqat `/` bilan boshlanadigan buyruq. `ctx.reply`, `bot.launch` — «buyruq» emas (kod qismi, metod).
**Tugma yozuvi va tugma ma'lumoti farq qiladi (ataylab):** tugmada «Pitsa» yoziladi, callback ma'lumoti — `'pizza'`. 10-ekran testi shu farqni tekshiradi.
**Imlo:** matnda «pitsa» (1-dars v2 kabi); kodda ma'lumot `'pizza'`. Buyruq — hamma joyda `/menu` (`/menyu` emas).
**Fayl nomi (5-savol A):** darsdagi kod bitta `bot.js` faylida (1-dars bilan bir xil; eski `bot.ts`, `bot.service.ts` — `bot.js`). Kod CommonJS: `require(...)` — backend darslari ham `require('express')` bilan yozilgan. Ishga tushirish — `node bot.js`.
**Token namunasi:** darsda haqiqiyga o'xshash token ko'rsatilmaydi — `1234567890:AA-namuna-token` (shakli o'sha: raqam, ikki nuqta, harflar; soxtaligi ko'rinib turadi).
**Harakat tugmasi:** «shuni bosing» tugmasi (▶ …) hamma ekranda bitta — asosiy (to'q) uslubda; och ko'rinish faqat tanlov variantlari va ikkinchi darajali tugmalar uchun. Hozir bir xil vazifa goh `btn-soft`, goh `btn` — QA uni tugma deb tanimagan (F-0930-62; 4-darsda ham F-0930-66, 68). **KOD**, nomzod N10.

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza — 1-darsdagi pitsa boti. O'quvchi uni 1-darsda (16-ekran) @BotFather'da ochgan va token olgan.
- **Hook:** 1-darsda ochilgan botga /start yuboriladi — javob yo'q. Sababi: botda hali kod yo'q, /start ni ushlaydigan handler yo'q.
- **Asosiy model (dars bo'yi bitta):** 1-darsdagi hodisa → handler → javob, endi Telegraf kodida. Har hodisa turiga o'z handleri:
  buyruq → `bot.start` / `bot.command` · inline tugma → callback → `bot.action` · reply klaviatura → matn → `bot.hears` · qolgan matn → `bot.on('text')` (fallback handler).
- **Oldingi bilimga ko'prik:** 1-dars (hodisa, handler, token, .env, fallback handler) · 2-dars PM (birinchi foydalanuvchilar avval /start bosadi) ·
  backend darslari («Autentifikatsiya va .env» — `process.env.JWT_SECRET`; NestJS darslari — CarService, CarModule, KitobShop).
- **Tajribalar:** token kodda (2) · xabar yo'li: Telegram → Telegraf → bot.js (3) · /start handleri (5) · ctx ichi (6) · ikki xil tugma (7) · uch hodisa — uch handler (9) · javob boshqa chatga ketsa (11) · fallback handler (12) · /help javobi (13) · `bot.js` ni yig'ish (15) · o'z botiga menyu (16).
- **Keyingi dars (App.jsx m5-04):** «Stateful logika + PostgreSQL».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — /start ga javob yo'q | hook | 1-darsdagi botga /start yuboradi, sababni tanlaydi | — |
| 1 | Reja | qoida | dars oxiridagi menyu + 4 qadam | — |
| 2 | Token kodda | tushuncha | kodda ochiq token → .env va `dotenv` | — |
| 3 | Xabar yo'li | tushuncha | Telegram → Telegraf → bot.js qatlamlarini ochadi | — |
| 4 | 1-savol | test | tokenni qayerda saqlash to'g'ri | ✅ |
| 5 | /start handleri | tushuncha | `bot.start` / `ctx` / `ctx.reply` qismlarini ochadi | — |
| 6 | ctx ichida nima bor | tushuncha | `ctx.from` / `ctx.message.text` / `ctx.chat` ni ochadi | — |
| 7 | Ikki xil tugma | tushuncha | avval inline tugmani, keyin reply klaviaturani sinaydi | — |
| 8 | 2-savol | test | inline va reply farqi | ✅ |
| 9 | Uch hodisa — uch handler | markaziy o'yin | buyruq, inline tugma, reply klaviatura: navbat bilan yuboradi → handler qo'shadi → qayta sinaydi | — |
| 10 | 3-savol | test | inline tugma bosilishini qaysi handler ushlaydi | ✅ |
| 11 | Javob boshqa chatga ketsa | hayotiy | javob Valiga ketadi → kodni tuzatadi → qayta sinaydi | — |
| 12 | Fallback handler | hayotiy | noma'lum xabar → jim → fallback handler qo'shadi → qayta yuboradi | — (bonus nishon) |
| 13 | /help javobi | amaliyot | /help javobidagi uch buyruq tavsifini navbat bilan tanlaydi | — (nishon) |
| 14 | 4-savol | test | buyruq oddiy xabardan nimasi bilan farq qiladi | ✅ |
| 15 | `bot.js` ni yig'ing | yakuniy | 6 kod qatorini tartiblaydi | ✅ (final) |
| 16 | Amaliyot · VS Code | praktika | o'z botiga /menu, 2 inline tugma va fallback handler qo'shadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — /start ga javob yo'q  `[51]`
- Eyebrow: Kirish
- Sarlavha: **1-darsda ochgan botingizga /start yuboring. Nima bo'larkin?**
- Mentor: O'tgan darsda botingizning birinchi foydalanuvchilari qaysi guruhlardan kelishini rejalashtirdingiz. Ularning har biri avval /start bosadi. Tugmani bosing va ular nimani ko'rishini kuzating.
- Eslatma qatori (chat tepasida, kichik): 1-darsda: @BotFather botingizni ochdi va token berdi — `7***:AA***xZ`
- Chat (AvtoPizza bot · sizning botingiz): bo'sh
- Tugma: ▶ /start yuborish → ✓ /start yuborildi
- /start dan keyin (chat ostida, kulrang): Javob kelmadi.
- Savol: **Bot nega javob bermadi?**
  - Bot hali @BotFather tekshiruvidan o'tib bo'lmagan
  - Botda hali kod yo'q, /start ni ushlaydigan handler ham yo'q
  - Yangi bot bir kun o'tgach javob bera boshlaydi
- Javob — 2-variant: **Aynan!** @BotFather botni ochdi va token berdi, lekin javobni kod beradi: /start kelganda uni handler ushlashi kerak. Bugun shu kodni yozamiz — buyruqlar, inline tugmalar va reply klaviatura.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Bot @BotFather'da ochilgan zahoti ishlashi mumkin: tekshiruv ham, kutish ham yo'q. Jim turishining sababi boshqa — botda hali kod yo'q, /start ni ushlaydigan handler yo'q. Bugun shu kodni yozamiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, eslatma qatori, bo'sh chat va tugma. Savol va variantlar hali yo'q.
Tugma bosilgach: chatda «/start» (foydalanuvchi xabari) → ~1.5 s hech narsa bo'lmaydi → «Javob kelmadi.» → shundan keyin savol va 3 variant chiqadi → tanlangach javob izohi.
Animatsiya: yo'q (kutishning o'zi ma'noni beradi).
Olib tashlanadi: @BotFather bilan 3 qadamli suhbat (/newbot → AvtoPizza → avto_pizza_bot) · «3 ta xabar bilan Botjon tug'ildi… kalit kimda bo'lsa, Botjon o'shaniki» ramkasi · to'liq token ko'rinishi.

✎ 🔴 FAKT: eski hook botni @BotFather'da qaytadan «tug'dirardi» va «1-darsda Botjonning sxemasini chizdingiz. Lekin u qog'ozda» derdi — o'quvchi 1-darsning 16-ekranida botni Telegram'da haqiqatan ochgan, 1-dars esa «Bot hozircha jim turadi… Kodni 3-darsda yozasiz» deb tugaydi. Yangi hook aynan shu joydan davom etadi · 2-dars (PM) bilan ko'prik qo'shildi («birinchi yigirma») · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · ✔ o'rni saqlandi (2-variant), mazmuni «token olaman» → «kod yo'q» (token 1-darsda olingan) · savol tugmadan keyin chiqadi (**KOD:** hozir xira turadi) · «username», «xizmat oynasi» olindi · emoji olindi · 30.09: QA F-0930-59 (rasm, «Botjon — global») va ChatGPT #2–3, #30 — 29.09 qoralamasida yopilgan; ChatGPT'ning «bot yaratish — 2-darsdagi ish» fakti **Rad**: bot 1-darsning 16-ekranida ochilgan, 2-dars — PM · Mentor 2-dars atamasi bilan («birinchi foydalanuvchilar», 14-savol A) · «▶ /start yuborish» — asosiy tugma uslubida (A, **KOD**)

## 1 · Reja  `[68]`
- Eyebrow: Reja
- Sarlavha: **Bugun botingiz javob beradi va tugmalar ko'rsatadi.**
- Mentor: 1-darsda hodisa → handler → javob modelini ko'rdingiz. Bugun uni Telegraf kodida yozasiz. Chapdagi menyuda uch xil hodisa bor: buyruq, inline tugma va reply klaviatura — har biriga o'z handleri kerak.
- Yozuv (chat ustida): Dars oxirida bu menyuning har qismini tushuntirib bera olasiz
- Chat: /menu → «Salom! AvtoPizza'ga xush kelibsiz. Nima qilamiz?» · inline tugmalar: Pitsa · Ichimlik · pastda reply klaviatura: Biz haqimizda
- Izoh (bir marta): Buyruq — / bilan boshlanadigan xabar: /start, /help, /menu.
- Bugungi 4 qadam:
  1. Token kodda: .env va dotenv
  2. Xabar botga qanday yetib keladi: Telegram → Telegraf → bot.js
  3. /start handleri va ctx
  4. Buyruqlar, inline tugma va reply klaviatura
- Tugmalar: 4 qadamni ko'rish / ↩ Menyuni ko'rish (telefonda) · Orqaga · Boshlaymiz →

**Ko'rinish:** hozirgidek — kompyuterda chat va 4 qadam yonma-yon, telefonda avval chat, tugma bilan 4 qadam. O'ngdagi 4 qadam — oddiy raqamli ro'yxat, bosilmaydi va tugmaga o'xshamaydi (ramka-soyasiz); ekranda harakat tugmasi bitta — «Boshlaymiz →» (**KOD**).
Animatsiya: yo'q.
Olib tashlanadi: chat ostidagi izoh-karta «/menu (chaqiruv so'zi) → salom + tugmalar. Har tugma o'z signalini yuboradi, 📋 varaqdagi qator ushlaydi. Mana shuni quramiz.» (Mentor bilan bir ma'no) · qadam yorliqlari «kalit · tuzilma · kod · markaziy o'yin» — «markaziy o'yin» MD-jadvalning ichki yorlig'i o'quvchiga chiqib qolgan [759] · «Jihozlar paneli» — bu darsda yo'q (tekshirildi).

✎ «Endi Botjonga muloqotni qo'shamiz» → yangi sarlavha · Mentor sarlavhani takrorlamaydi — 1-darsdagi modelga ko'prik · «signal → amal», «kalit», «qulfli tortma», «✉️ konvert», «📋 qoidalar varag'i» → A1 atamalari · chat preview'ga reply klaviatura qo'shildi — 9-ekrandagi uch hodisa oldindan ko'rinadi (**KOD:** `TgChat replyKb`) · «Menyu / Buyurtma / Biz haqimizda» inline tugmalari → «Pitsa / Ichimlik» + reply «Biz haqimizda» (9-ekran bilan bir xil) · emoji olindi · 30.09: QA F-0930-60 (rasm, «ba'zi so'zlar to'g'ridan-to'g'ri tarjima qilingan»: muloqotni qo'shamiz, Botjon gapiradigan, chaqiruv so'zi, tugmalar taxtasi, qoidalar varag'i) — hammasi 29.09 da A1 atamalariga almashgan; ChatGPT #5–8 shu bilan yopiladi · ChatGPT #11–13 **Qisman**: QA'ning «sahifa mantiqi tushunarsiz, o'ngda nimadir bo'lishi kerakmi?» izohi bu ekran haqida emas — 12-ekran (13/20) suratlari bilan kelgan; lekin «o'ngdagi qadamlar bosiladigan ko'rinmasin» — qabul (Ko'rinish); chap/o'ng yorliqlar («Dars oxirida…», «Bugungi 4 qadam») allaqachon bor · 2-qadam 3-ekranning yangi mazmuniga moslandi

## 2 · Token kodda  `[82]`
- Eyebrow: Tushuncha · token
- Sarlavha: **Token kodda qanday o'qiladi?**
- Mentor: 1-darsda tokenni .env faylida saqlash kerakligini ko'rdingiz. Endi bu kodda qanday ko'rinishini ko'ramiz. Tugmani bosing.
- Chap — Xato: token kodda ochiq · `bot.js`:
  ```js
  const bot = new Telegraf('1234567890:AA-namuna-token')
  // kod Git'ga chiqsa, token ham u bilan chiqadi
  ```
- Tugma: To'g'ri usul qanday? → ✓ Ko'rdingiz
- O'ng (bosilgach) — To'g'ri: token .env faylida:
  ```
  # .env
  BOT_TOKEN=1234567890:AA-namuna-token
  # .env fayli .gitignore'da — Git uni commit qilmaydi
  ```
  ```js
  // bot.js
  require('dotenv').config()   // .env faylini process.env ga yuklaydi
  const bot = new Telegraf(process.env.BOT_TOKEN)
  ```
- Xulosa: Xuddi «Autentifikatsiya va .env» darsidagi `JWT_SECRET` kabi: kodda token yo'q, faqat uning nomi — `process.env.BOT_TOKEN`. .env faylini `dotenv` paketi yuklaydi; usiz `process.env.BOT_TOKEN` bo'sh qoladi va bot ishga tushmaydi.
- Pastki tugma: Xavfsiz usulni ko'ring → Davom etish

**Ko'rinish:** hozirgidek — chapda xato kod va tugma; bosilgach o'ngda .env va `bot.js`, ostida xulosa (bitta yashil ramka). Uzun kod qatori o'z panelida qoladi (qatorga o'raladi yoki panel ichida suriladi) — qo'shni panel ustiga chiqmaydi (**KOD**).
Animatsiya: yo'q.
Olib tashlanadi: sarlavhadagi «Kalit — Botjonning eng qadrli buyumi» · Mentordagi «Botjoningizni o'g'irlaydi» · kod izohlaridagi «hamma o'qiydi!», «kod toza, kalit maxfiy» · xulosadagi «Kalit hech qachon git'ga tushmaydi».

✎ 🔴 FAKT: `.env` faylida izoh `#` bilan yoziladi — eski kodda `// .gitignore'da…` edi (`//` .env'da izoh emas) · 🔴 FAKT: `process.env.BOT_TOKEN` .env'dan o'zi o'qilmaydi — `dotenv` kerak (backend darslarida ham ko'rsatilmagan, tekshirildi: `src/4-Modull`, `src/4a-Modull` da `dotenv`/`ConfigModule` yo'q); `import 'dotenv/config'` qatori qo'shildi (**KOD**) · 🔴 FAKT: «4-modulda auth'da ko'rgansiz» → «Autentifikatsiya va .env» darsi (App.jsx m4-11; modul raqami — A9) · 1-darsda saqlash o'rgatilgan — bu ekran endi kodni ko'rsatadi, takror emas · «hech qachon» olindi · `bot` (Telegraf obyekti) birinchi marta shu yerda · 30.09: QA F-0930-61 (rasm): kattalashtirilgan oynada chapdagi token qatori o'ng panelga chiqib, `.env` qatori bilan ustma-ust tushgan (**KOD**) · ChatGPT #4 **Qabul**: token haqiqiyga juda o'xshardi → `1234567890:AA-namuna-token` · 5-savol A: `bot.ts` → `bot.js`, `import 'dotenv/config'` → `require('dotenv').config()`

## 3 · Xabar yo'li  `[105]`
- Eyebrow: Tushuncha · xabar yo'li
- Sarlavha: **Xabar botingizga qanday yetib keladi?**
- Mentor: 1-darsda bu yo'lni sxemada ko'rdingiz. Endi har qismini kod bilan bog'laymiz. Har qatlamni bosing.
- Sxema: Telegram → Telegraf → bot.js (handlerlar), javob esa shu yo'l bilan Telegram'ga qaytadi
- Qatlamlar (bosilganda ochiladi):
  - **Telegram** — Foydalanuvchi xabar yozadigan joy. Botlar Telegram bilan Telegram Bot API orqali gaplashadi.
  - **Telegraf** — Node.js kutubxonasi. Telegram Bot API bilan aloqani o'zi bajaradi — siz unga faqat token berasiz.
  - **bot.js** — Siz yozadigan fayl. Handlerlar shu yerda: `bot.start`, `bot.command`, `bot.hears`, `bot.action`. Handler javob yozadi, Telegraf uni Telegram'ga yuboradi.
- Xulosa (3/3 dan keyin): Siz faqat handlerlarni yozasiz — Telegram bilan aloqani Telegraf bajaradi. Katta loyihada shu handlerlar NestJS service ichiga joylanadi (CarService kabi); bugun hammasi bitta bot.js faylida.
- Tugma: Qatlamlarni ko'ring (N/3) → Davom etish

**Ko'rinish:** uch qatlam bitta qatorda; bosilgan qatlam izohi shu qator ostida, bitta kartada; ochilgan qatlamda ✓ uning o'zida turadi (ikkinchi «✓ …» qatori yo'q). Xulosa 3/3 dan keyin, karta ostida (**KOD**).
✎ 01.10 (F-1001-67, razrabotka): «karta o'rnida» → «karta ostida» — karta almashsa 3-qatlam izohi o'qilmay qolardi.
Animatsiya: HA — kirganda xabar yo'li chiziladi: Telegram → Telegraf → bot.js, keyin javob strelkasi bot.js dan Telegram'ga qaytadi (~1.2 s): hodisa kiradi, javob chiqadi.
Olib tashlanadi: Nest Module qatlami (29.09 qoralamasida — Bot Service atrofidagi ramka) · Bot Service → bot.js · tugmalar ostidagi ikkinchi «✓ Telegram ✓ Telegraf ✓ Bot Service ✓ Nest Module» qatori (tugmalar bilan bir ma'no) · o'ng ustundagi alohida karta · Mentordagi «📋 qoidalar varag'ingiz esa Nest service ichida yashaydi» · «Tanish, to'g'rimi?».

✎ 30.09 ChatGPT #10 **Qabul**: «Telegram → Telegraf → Bot Service → Nest Module» xabar yo'li bilan loyiha tuzilmasini aralashtirardi — Nest Module xabar yo'lida turmaydi · 5-savol A (butun modulda `bot.js`): darsdagi kod NestJS emas, bitta `bot.js` — sxema endi 1-dars 5-ekrandagi yo'l bilan bir xil (Mijoz → Telegram → Bot API → bot.js → javob); NestJS ko'prigi bitta gapga qoldi · QA F-0930-61 (rasm, «alignment»): tugmalar qatori, ostida takror ✓ qatori, izoh esa o'ng chetda — ko'z o'ngga borib, chapga qaytardi → bitta qator, izoh uning ostida · 29.09: «4-modulda NestJS resurslari (Car, Book)» → «NestJS darslarida» (ChatGPT #29 shu bilan yopiladi) · **KOD:** `Screen3` — qatlamlar 4 → 3, qaytish strelkasi

## 4 · 1-savol ✅  `[118]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot tokenini qayerda saqlash to'g'ri?**
  - bot.js ichida — new Telegraf(...) qatorining o'zida
  - ✔ .env faylida — kod uni process.env.BOT_TOKEN orqali o'qiydi
  - README.md ichida — jamoa tokenni tez topishi uchun
  - Bot tavsifida — @BotFather'dagi tavsif maydonida
- To'g'ri: Token .env faylida turadi, kod uni process.env.BOT_TOKEN orqali o'qiydi.
- Xato izohlari:
  - Kod Git'ga chiqsa, token ham u bilan chiqadi — kodni ko'rgan odam botingizni boshqara oladi.
  - README — hammaga ochiq hujjat. Uni o'qigan har kim tokenni ko'radi.
  - Bot tavsifini botni ochgan har bir odam ko'radi — token hammaga ochiq bo'lib qoladi.
  - (umumiy) Token .env faylida saqlanadi: kod uni process.env.BOT_TOKEN orqali o'qiydi, Git esa .env ni commit qilmaydi.
- Havola: Qisqa takrorlash — mavzuni yana bir ko'rish

✎ Variantlar bir shaklga keltirildi («joy — sabab»), to'g'ri javobdagi «git'ga hech qachon tushmaydi» olindi · 🔴 FAKT: eski 4-variant izohi «BotFather kalitni faqat bir marta beradi» — noto'g'ri: token @BotFather'da (/mybots → bot → API Token) qayta ko'rinadi; bu variant ham qisman ishlaydigan yo'l edi («har safar so'raymiz») → «Bot tavsifida» (ishonarli, lekin to'liq xato) · «Botjoningizni o'g'irlaydi» → «botingizni boshqara oladi»

## 5 · /start handleri  `[133]`
- Eyebrow: Kod · /start
- Sarlavha: **Birinchi handler: /start kelganda bot salom yozadi.**
- Mentor: 1-darsdagi «/start → salom» endi haqiqiy kodda. Uch qismni bosib, har biri nima qilishini oching.
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
- Tugma: 3 qismni oching (N/3) → Davom etish

**Ko'rinish:** hozirgidek — kod, ostida 3 tugma; bosilgani o'ngda bitta kartada ochiladi.
Animatsiya: yo'q.
Olib tashlanadi: xulosa ramkasi «bot.start = signal, ctx.reply = amal. Aynan 1-darsdagi mantiq…» (Mentor bilan bir ma'no).

✎ «Botjon javob bersin» → «bot salom yozadi» · «signal: …», «amal: Botjonning javobi» → handler / javob · `ctx` izohi 6-ekranni takrorlamaydi (ichidagi maydonlar — 6-ekranda) · `'Salom! 👋'` → `'Salom!'` · fayl `bot.service.ts` → `bot.js` (**KOD**, 5-savol A) · «chaqiruv so'zi» → «buyruq» · 30.09 ChatGPT #9 **Qabul**: `ctx.reply` — maydon emas, metod (6-ekranda 29.09 da tuzatilgan; bu yerda «metod» so'zi qo'shildi)

## 6 · ctx ichida nima bor  `[150]`
- Eyebrow: Kod · ctx
- Sarlavha: **ctx ichida nima bor?**
- Mentor: ctx — context so'zining qisqartmasi. Har handler uni hodisa bilan birga oladi. Uni konvertga o'xshatish mumkin: ichida xat, ustida qaytish manzili. Ichidagi uch maydonni bosib ko'ring.
- ctx (sarlavha-yorliq): ctx — Aziza «Salom» deb yozdi
  - `ctx.from` · `{ id: 5012, first_name: "Aziza" }` — Kim yozdi: foydalanuvchining id raqami va ismi.
  - `ctx.message.text` · `"Salom"` — Foydalanuvchi yuborgan matn.
  - `ctx.chat` · `{ id: 5012, type: "private" }` — Xabar kelgan chat. ctx.reply javobni aynan shu chatga yuboradi.
- Xulosa (3/3 dan keyin): ctx har hodisada yangi: Aziza yozsa — Azizaning ma'lumoti, Bek yozsa — Bekniki. Shuning uchun ctx.reply javobni xabar kimdan kelgan bo'lsa, o'shanga yuboradi.
- Tugma: ctx ichini oching (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 qator; bosilgani o'ngda ochiladi; xulosa 3/3 dan keyin.
Animatsiya: yo'q.
Olib tashlanadi: sarlavhadagi «✉️ konvert» · «Keyinroq bu manzil xato bo'lsa nima bo'lishini ko'ramiz» (11-ekranni oldindan aytardi).

✎ «konvert» metaforasi — bir marta, Mentorda (A1) · 🔴 FAKT: 3-maydon `ctx.reply(...)` — maydon emas, metod; «qayerga javob berish» ma'lumoti `ctx.chat` da turadi → `ctx.chat` (**KOD:** `CTX_FIELDS`) · xulosa endi yangi ma'no: ctx har hodisada o'zgaradi (1-darsdagi «bir vaqtda uch mijoz» bilan bog'lanadi) · «Botjoningiz» olindi

## 7 · Ikki xil tugma  `[161]`
- Eyebrow: Tushuncha · ikki xil tugma
- Sarlavha: **Inline tugma va reply klaviatura: bosilganda nima ketadi?**
- Mentor: Telegram botlarida tugmaning ikki turi bor. Avval inline tugmani, keyin reply klaviaturani bosib ko'ring va chatga qarang.
- **1-qadam · Inline tugma**
  - Izoh: Inline tugma — xabarning tagida, unga yopishib turadigan tugma.
  - Chat: /menu → «Menyuni tanlang:» · inline tugmalar: Pitsa · Ichimlik
  - Kod:
    ```js
    ctx.reply('Menyuni tanlang:', Markup.inlineKeyboard([
      Markup.button.callback('Pitsa', 'pizza'),
      Markup.button.callback('Ichimlik', 'drink'),
    ]))
    ```
  - Kod ostida (bir marta): Markup — Telegraf'ning tugma yasaydigan yordamchisi.
  - Bosilgach: Botga callback keldi: `'pizza'`. Chatga yangi xabar qo'shilmadi. · Callback — inline tugma bosilganda botga keladigan hodisa. Ichida tugma ma'lumoti bor — kodda yozilgan `'pizza'`. Uni `bot.action('pizza', ...)` ushlaydi.
  - Yig'ilgan qator: ✓ Inline tugma → callback `'pizza'` → `bot.action`
- **2-qadam · Reply klaviatura**
  - Izoh: Reply klaviatura — oddiy klaviatura o'rnida chiqadigan tugmalar.
  - Chat: «Tugmani bosing:» · pastda reply klaviatura: Pitsa · Ichimlik · yozish maydonida «Tugmani tanlang…»
  - Kod:
    ```js
    ctx.reply('Tugmani bosing:', Markup.keyboard([['Pitsa', 'Ichimlik']]).resize())
    ```
  - Bosilgach: chatga foydalanuvchi xabari «Pitsa» qo'shiladi · Tugma matni oddiy xabar bo'lib ketdi. Uni `bot.hears('Pitsa', ...)` ushlaydi.
  - Yig'ilgan qator: ✓ Reply klaviatura → matn «Pitsa» → `bot.hears`
- Xulosa (ikkalasi sinalgach): Inline tugma — shu xabarga tegishli tanlov uchun: menyudan taom tanlash, «Ha / Yo'q». Reply klaviatura — tez-tez kerak bo'ladigan tugmalar uchun: Menyu, Savat, Yordam.
- Tugma: Ikkala turni sinang (N/2) → Davom etish

**Ko'rinish (KOD — hozir rejim tugmalari tepada, ikki rejim erkin almashadi, har rejimda alohida yashil ramka):**
1. Kirganda: faqat 1-qadam (chat + kod), inline tugmalar bosiladi.
2. Tugma bosilgach — callback yozuvi; keyin 1-qadam «✓ Inline tugma → callback 'pizza' → bot.action» qatoriga yig'iladi (`↻` bilan qayta ochiladi), 2-qadam ochiladi.
3. Reply tugma bosilgach — chatga «Pitsa» tushadi, izoh chiqadi; 2-qadam ham yig'iladi, xulosa chiqadi (ekranda bitta yashil ramka).
Animatsiya: HA — inline tugma bosilganda tugmadan kod oynasidagi `'pizza'` ga strelka chiziladi (~0.8 s): callback chatga emas, botga ketadi. Reply qadamida strelka yo'q — matnning chatga tushishining o'zi farqni ko'rsatadi.
Olib tashlanadi: Mentordagi ikki tugma ta'rifi (qadamlar izohi bilan bir ma'no) · har rejimdagi alohida yashil ramka · «matn YUBORMAYDI» katta harfi.

✎ 🔴 FAKT (DAVOM 7): «Callback» hech bir ekranda o'rgatilmagan, lekin kartochka 9–10, Qisqa takrorlash 2 va viktorina 4-savolda so'raladi → shu ekranda bir gap bilan kiritildi · 🔴 FAKT: tugmalar qanday yasalishi (Markup) darsda yo'q edi, amaliyot esa «2 ta inline tugma qo'shing» deydi; 5-dars ham `Markup.button.callback` ni «o'tgan darslarda o'rgandingiz» deydi (`BotAiProjectLesson.jsx` [977]) → ikkala kod qo'shildi (**KOD**) · 🔴 FAKT (DAVOM 7): «/menyu» [1003] → «/menu» (qolgan hamma joyda /menu) · 🔴 FAKT: «xabar **ustidagi** tugma», lekin kartada «xabarning **tagiga** yopishadi» — Telegram'da inline tugmalar xabar ostida turadi → «inline tugma, xabarning tagida» · «pastdagi tugmalar taxtasi» → «reply klaviatura» · «Qoida: tez tanlov/menyu uchun… doimiy klaviatura» → misollar bilan · «Savat» tugmasi olindi (kod qisqa bo'lsin), «Pizza» → «Pitsa» (yozuv), `'pizza'` (ma'lumot) · emoji olindi · «Tugmalar · maydon» eyebrow → «Tushuncha · ikki xil tugma» · 30.09 ChatGPT #7 **Qisman**: «inline tugma» — qabul (29.09); «Reply tugmalar» o'rniga «reply klaviatura» qoladi — Telegram'dagi nomi (reply keyboard), kodda `Markup.keyboard`; #28 (callback — yarim o'rgatilgan) — 29.09 da shu ekranda kiritilgan

## 8 · 2-savol ✅  `[177]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Inline tugma va reply klaviatura tugmasi bosilganda nima farq qiladi?**
  - Ikkalasi ham tugma matnini chatga oddiy xabar qilib yuboradi
  - Inline tugma rasm yuboradi, reply tugmasi esa faqat matn yuboradi
  - Inline tugma faqat guruhda, reply tugmasi faqat shaxsiy chatda ishlaydi
  - ✔ Inline tugma chatga matn yozmaydi, reply tugmasi matnini xabar qiladi
- To'g'ri: Inline tugma botga callback yuboradi, reply tugma esa o'z matnini chatga xabar qilib yuboradi.
- Xato izohlari:
  - Bu faqat reply klaviaturaga to'g'ri. Inline tugma bosilganda chatga matn yozilmaydi — botga callback keladi.
  - Inline tugma rasm yubormaydi: bosilganda botga tugma ma'lumoti keladi, masalan 'pizza'.
  - Ikkala tugma ham guruhda ham, shaxsiy chatda ham ishlaydi. Farq — bosilganda nima yuborilishida.
  - (umumiy) Inline tugma → callback (chatda ko'rinmaydi); reply klaviatura → oddiy matnli xabar.

✎ «Pullik/bepul» varianti ishonarsiz edi → «guruh / shaxsiy chat» (ishonarli noto'g'ri tasavvur) · to'g'ri variantdagi «yashirin signal» → «chatga matn yozmaydi» (atama faqat to'g'rida qolmasin — «callback» izohlarda) · «xolos», «hozircha» olindi · variantlar uzunligi tenglashtirildi

## 9 · Uch hodisa — uch handler (markaziy o'yin)  `[191]`
- Eyebrow: Markaziy · uch hodisa
- Sarlavha: **Uch xil hodisa — uch handler. Ularni o'zingiz ulang.**
- Mentor: Har qadamda avval hodisani yuboring: handler yo'q bo'lsa, bot jim turadi. Keyin handler qo'shing va qayta yuboring.
- Chat (AvtoPizza bot): «Buyruq yuboring yoki tugmani bosing.»
- Handlerlar paneli: `bot.js` — handlerlar
- **1-qadam · Buyruq**
  - Tugma: ▶ /menu yuborish
  - Handler yo'q: Hodisa keldi, lekin uni ushlaydigan handler yo'q — bot jim.
  - Handler qatori: `bot.command('menu', ...)` · + handler qo'shish → ✓
  - Qayta yuborilgach — bot: «Menyu. Tanlang:» · inline tugmalar: Pitsa · Ichimlik
  - Yig'ilgan qator: ✓ /menu → `bot.command('menu')`
- **2-qadam · Inline tugma**
  - Ko'rsatma: Chatdagi «Pitsa» tugmasini bosing.
  - Handler yo'q: Tugma bosildi, chatga matn tushmadi — callback keldi, lekin uni ushlaydigan handler yo'q.
  - Handler qatori: `bot.action('pizza', ...)` · + handler qo'shish → ✓
  - Qayta bosilgach — bot: «Pitsa tanlandi. Narxi — 30 000 so'm.»
  - Yig'ilgan qator: ✓ Pitsa → callback `'pizza'` → `bot.action`
- **3-qadam · Reply klaviatura**
  - Ko'rsatma: Pastdagi «Biz haqimizda» tugmasini bosing.
  - Handler yo'q: Chatga «Biz haqimizda» matni tushdi, lekin uni ushlaydigan handler yo'q — bot jim.
  - Handler qatori: `bot.hears('Biz haqimizda', ...)` · + handler qo'shish → ✓
  - Qayta bosilgach — bot: «AvtoPizza — 2020 yildan beri pitsa yetkazib beramiz.»
  - Yig'ilgan qator: ✓ Biz haqimizda → matn → `bot.hears`
- Handler yo'q paytda bir hodisa 3 marta yuborilsa: Mijoz: «Buzuqmi bu?» — va ketib qoldi.
- Muvaffaqiyat: Uchala hodisa o'z handleriga ulandi. Tugmaning o'zi hech narsa qilmaydi — javobni handler beradi.
- Tugma: Uchala handlerni ulang (N/3) → Davom etish

**Ko'rinish (KOD — hozir 3 signal tugmasi va 3 handler qatori birdan, istalgan tartibda):**
1. Kirganda: faqat 1-qadam (tugma + uning handler qatori, qator hali qo'shilmagan).
2. Hodisa yuborilgach → «handler yo'q» yozuvi → handler qatori «+ handler qo'shish» bilan yonadi → qo'shilgach «qayta yuborish».
3. Javob kelgach → qadam bitta ✓ qatorga yig'iladi, keyingisi ochiladi. 2-qadamdagi «Pitsa» — 1-qadamda /menu javobi bilan chiqqan inline tugma; 3-qadamda chat ostida reply klaviatura paydo bo'ladi.
4. Oxirida bitta yashil ramka (muvaffaqiyat).
Animatsiya: HA — handler qo'shilgach hodisa qayta yuborilganda chatdagi xabar/tugmadan panel ichidagi handler qatoriga chiziq chiziladi, keyin javob chiqadi; handler yo'q paytda chiziq chizilmaydi (bog'lanish yo'q). Bir qadamda bitta chiziq.
Olib tashlanadi: Mentordagi signal turlari ro'yxati (qadamlar o'zi ko'rsatadi) · «Qisman ulanganda» sariq ramkasi («tugma bor, lekin varaqda qator yo'q…» — har qadamning o'z «handler yo'q» yozuvi bor) · «😐 … javob kutmoqda . . .» · «🎉».

✎ «Botjonga tugmalar taxtasini o'zingiz ulang» → yangi sarlavha (ekran tugmalar taxtasi haqida emas, uch hodisa haqida) · «📋 Qoidalar varag'i (signal → amal)» → «bot.ts — handlerlar» · «+ qator qo'shish» → «+ handler qo'shish» · /menu javobi inline tugmalar bilan chiqadi — 2-qadamdagi «Pitsa» shu tugma, uch hodisa bitta suhbatga bog'lanadi (**KOD**) · «Pizza tanlandi! Buyurtma qabul qilindi» → «Pitsa tanlandi. Narxi — 30 000 so'm» (manzilsiz buyurtma qabul qilinmaydi; narx 11-ekran bilan bir xil) · `bot.hears('ℹ️ Biz haqimizda')` → `bot.hears('Biz haqimizda')` (reply tugma matni bilan aynan bir xil bo'lishi shart) · «Tugma — bu faqat ko'rinish; ish 📋 varaqdagi qatordan chiqadi» → «javobni handler beradi»

## 10 · 3-savol ✅  `[210]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Inline tugma bosilishini qaysi handler ushlaydi?**
  - ✔ bot.action('pizza', ...) — tugma ma'lumoti 'pizza' bo'lgani uchun
  - bot.hears('Pitsa', ...) — tugma yozuvi 'Pitsa' bo'lgani uchun
  - bot.start(...) — tugma /start javobidagi menyuda turgani uchun
  - bot.launch() — botni ishga tushiradigan qator bo'lgani uchun
- To'g'ri: Inline tugma bosilganda callback keladi — uni bot.action('pizza', ...) ushlaydi.
- Xato izohlari:
  - bot.hears matnli xabarni ushlaydi. Inline tugma bosilganda «Pitsa» matni yuborilmaydi — callback keladi.
  - bot.start faqat /start buyrug'ini ushlaydi. Tugma qaysi xabarda turgani ahamiyatsiz — uning bosilishini bot.action ushlaydi.
  - bot.launch() botni ishga tushiradi, lekin o'zi hech bir hodisani ushlamaydi — bu handler emas.
  - (umumiy) Inline tugma bosilishi — callback. Uni bot.action(...) ushlaydi.
- Nishon: Callback Catcher (birinchi urinishda to'g'ri bo'lsa)

✎ Test «sotilgan» edi: xato variantlar o'zini o'zi inkor qilardi («…tugmani emas», «…tugma signalini emas», «…hech qanday signalni ushlamaydi») → har variant ishonarli sabab aytadi; B va A tugma **yozuvi** va **ma'lumoti** farqini tekshiradi (A1-qo'shimcha) · «Botjonni» olindi · «Button Master» → «Callback Catcher» (mavzuga aniqroq) · 30.09 ChatGPT #15 («test sotilgan») — 29.09 da tuzatilgan; uning variantlari («— /start signalini qabul qiladi») boshqa savol uchun, bu savolda sabab-shakl qoladi

## 11 · Javob boshqa chatga ketsa (hayotiy)  `[225]`
- Eyebrow: Hayotiy · xato chat
- Sarlavha: **Javob noto'g'ri odamga ketsa nima bo'ladi?**
- Mentor: Aziza narxni so'radi. Lekin kodda sinovdan qolgan qator bor: javob doim Valining chatiga yuboriladi. Avval sinab ko'ring, keyin tuzating.
- Chap: «Aziza — «Narxlar» tugmasini bosdi, javob kutyapti» · chat Aziza: «Narxlar»
- Kod (`bot.js`):
  ```js
  bot.hears('Narxlar', (ctx) => {
    ctx.telegram.sendMessage(VALI_ID, "Pitsa — 30 000 so'm")
  })
  // sinovdan qolgan: VALI_ID — Valining chat id'si
  ```
  Kod ostida (bir marta): `ctx.telegram.sendMessage(id, matn)` — matnni ko'rsatilgan id'dagi chatga yuboradi.
  Tuzatilgach: `ctx.reply("Pitsa — 30 000 so'm")` · `// ctx.reply — xabar kelgan chatga, ya'ni Azizaga`
- O'ng: «Vali — hech narsa so'ramagan» · chat Vali
- Tugma: ▶ Sinab ko'rish
- Tuzatishdan oldin sinalsa: Aziza chatida «Javob kelmadi.» · Vali chatida «Pitsa — 30 000 so'm» (Vali hech narsa so'ramagan)
  - Ogohlantirish: Javob Valiga ketdi, Aziza hech narsa olmadi. Kod ctx dagi chatni emas, qo'lda yozilgan VALI_ID ni ishlatgan. · Tugma: Kodni tuzatish
- Tuzatilgach: Tugma ▶ Qayta sinash → Aziza chatida «Pitsa — 30 000 so'm» · Vali chatida «Yangi xabar kelmadi ✓»
- Xulosa: Endi javob ctx.reply orqali ketadi: xabar qaysi chatdan kelgan bo'lsa, javob ham o'sha chatga boradi.
- Pastki tugma: Kodni tuzating va sinang → Davom etish

**Ko'rinish:** hozirgidek — qadamlar navbat bilan (sinash → ogohlantirish + tuzatish → qayta sinash → xulosa); ekranda bir vaqtda bitta ramka (sariq yoki yashil).
Animatsiya: HA — «Sinab ko'rish» bosilganda Aziza xabaridan kod oynasiga, koddan Vali chatiga chiziq chiziladi (javob noto'g'ri tomonga ketadi); tuzatilgach chiziq koddan Aziza chatiga chiziladi.
Olib tashlanadi: Mentordagi «✉️ Konvertda "qayerga javob berish" maydoni bor» (6-ekranda aytilgan) · «😳», «⏳», «✅».

✎ 🔴 FAKT: `bot.hears('narx', ...)` Azizaning «Pizza qancha turadi?» xabarida ishlamaydi — Telegraf'da `hears` qatori berilsa, xabar matni aynan shu qatorga teng bo'lishi kerak → Aziza reply klaviaturadagi «Narxlar» tugmasini bosadi, kod `bot.hears('Narxlar', ...)` (7-ekrandagi reply klaviatura bilan bog'lanadi) · 🔴 FAKT: `valiChatId.reply(...)` — Telegraf'da bunday yozuv yo'q (id — oddiy son, uning `.reply` metodi yo'q) → haqiqiy xato: `ctx.telegram.sendMessage(VALI_ID, ...)` — sinovdan qolgan id, o'smir dasturchi haqiqatan qiladigan xato (**KOD**) · «Konvert manzilini tuzatish» → «Kodni tuzatish» · «har doim… boshqa hech kimga emas» → yumshatildi · «30 000 so'm, yetkazib berish bilan» → «Pitsa — 30 000 so'm» (9-ekran bilan bir xil) · «✉️ Konvert · xato manzil» eyebrow → «Hayotiy · xato chat» · 30.09 ChatGPT #16 **Qabul**: Valining «Men hech narsa so'ramagandim!» gapi olindi — ikki chatning o'zi farqni ko'rsatadi · `bot.ts` → `bot.js`

## 12 · Fallback handler (hayotiy)  `[246]`
- Eyebrow: Hayotiy · fallback handler
- Sarlavha: **Mos handler topilmagan matnga ham bot javob bersin.**
- Mentor: 1-darsda fallback handler kerakligini ko'rdingiz. Endi uni kodda yozamiz. Avval noma'lum xabar yuboring va nima bo'lishini ko'ring.
- Chat (AvtoPizza bot): «Salom! Menyu uchun /menu ni bosing.»
- Tugma: ▶ Noma'lum xabar yuborish → mijoz: «Necha daqiqada yetib keladi?»
- Fallback handler yo'q bo'lsa: «Bot jim qoldi…» · Ogohlantirish: Bu xabarga mos handler yo'q — bot jim qoldi. Mijoz o'ylaydi: «Ishlayaptimi bu?» · Tugma: Fallback handler qo'shish
- Qo'shilgach — kod:
  ```js
  bot.on('text', (ctx) => ctx.reply('Tushunmadim. Menyu uchun /menu ni bosing.'))
  ```
  Tugma: ▶ Qayta yuborish → bot: «Tushunmadim. Menyu uchun /menu ni bosing.»
- Xulosa: bot.on('text', ...) mos handler topilmagan matnli xabarga javob beradi. Shuning uchun u boshqa handlerlardan keyin yoziladi: oldinroq tursa, /start va /menu ni ham o'zi ushlab oladi.
- Pastki tugma: Fallback handler qo'shing va sinang → Davom etish
- Nishon: Fallback Coder (darsning yagona bonus nishoni)

**Ko'rinish (KOD — hozir ikki ustun: chapda chat, o'ngda rate limit qismi va bo'sh quti):** bitta ustun. Kirganda — chat va «▶ Noma'lum xabar yuborish» (asosiy tugma uslubida — QA hozirgi och tugmani tugma deb tanimagan). Yuborilgach — «Bot jim qoldi…», ogohlantirish va «Fallback handler qo'shish»; qo'shilgach kod qatori va «▶ Qayta yuborish»; javob kelgach ogohlantirish o'rnida xulosa. Ekranda bir vaqtda bitta ramka.
Animatsiya: yo'q (11-ekranda chiziq bor — qo'shni ekranda takrorlanmaydi).
Olib tashlanadi: 2-qism — rate limit: «Pitsa (N/8)» tugmasi, bo'sh ma'lumot qutisi, «429 — xizmat oynasi vaqtincha yopildi…» ogohlantirishi va «↻ Qayta urinish» · Mentordagi «Keyin «Pizza» tugmasini tez-tez bosib, xizmat oynasi qanday himoyalanishini kuzating» · «🔇», «🤔», «✉️», «⏱», «✅».

✎ 30.09 QA F-0930-62 (2 rasm): «sahifa mantiqi tushunarsiz, keyingi bosqichga o'tolmayapman — chapdagi tugma ekan, o'ngdagi komponentda nimadir bo'lishi kerakmi?» — ikki sabab: o'ngdagi rate limit qutisi bo'sh (29.09 da tasdiqlangan [1253–1254]), chapdagi yuborish tugmasi och «chip» (`btn-soft` [1247]) — tugma deb tanilmaydi · ChatGPT #17–18 **Qabul**: fallback va 429 bir-biriga bog'liq emas, ekran ikki mavzuga bo'linardi → rate limit qismi olindi (29.09 qoralamasida navbat bilan qoldirilgan edi; o'shandagi agent eslatmasi 7 ham olib tashlashni taklif qilgan). Viktorina 9-savol mazmuni almashdi (✔ o'rni o'sha), glossariydan «rate limit» olindi · sarlavha: «bot javobsiz qoldirmasin» (kimni? — to'ldiruvchi yo'q edi) → «matnga ham bot javob bersin» · 29.09: «hech qachon jim qolmaydi» → «matnli xabarga» (`bot.on('text')` rasm, stikerni ushlamaydi), fallback nega oxirida turadi · ChatGPT #19 («Never Silent» → texnik nom) — 29.09 da «Fallback Coder»

## 13 · /help javobi (amaliyot)  `[263]`
- Eyebrow: Amaliyot · buyruqlar
- Sarlavha: **/help javobini to'ldiring: har buyruq nima qiladi?**
- Mentor: /help bosilganda bot buyruqlar ro'yxatini yuboradi. Har buyruqqa to'g'ri tavsifni tanlang.
- Chap — chat: foydalanuvchi «/help» · bot: «Buyruqlar:» · `/start — ____` · `/help — ____` · `/menu — ____`
- Variantlar (✔ = to'g'ri; ballsiz — o'rni aralash, 4-savol A):
  - /start — Botni butunlay o'chirib tashlaydi · ✔ Suhbatni boshlaydi: salom va menyu yuboradi · Faqat rasm yuboradi
  - /help — Mijozning parolini qayta tiklaydi · Botni qayta o'rnatadi · ✔ Yordam va buyruqlar ro'yxatini ko'rsatadi
  - /menu — Mijozni chatdan chiqarib yuboradi · ✔ Menyuni qayta ochadi · Botning tokenini ko'rsatadi
- Xato izohlari:
  - /start botni o'chirmaydi — u suhbatni boshlaydi: bot salom va menyu yuboradi. · /start rasm bilan bog'liq emas — u suhbatni boshlaydi.
  - Botlarda odatda parol bo'lmaydi — /help yordam matnini ko'rsatadi. · /help hech narsani o'rnatmaydi — faqat yordam beradi.
  - /menu hech kimni chiqarib yubormaydi — u menyuni ko'rsatadi. · Token maxfiy — uni bot hech kimga ko'rsatmaydi.
  - (umumiy) Bu buyruq bunday ishni bajarmaydi — boshqasini tanlang.
- Nishon yozuvi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: /help javobi tayyor. Uyga vazifada uni botingizga o'zingiz qo'shasiz.
- Tugma: Ro'yxatni to'ldiring → Davom etish
- Nishon: Command Writer

**Ko'rinish (KOD — hozir 3 qatorning 9 varianti birdan):** faqat joriy buyruq qatori yonadi va uning 3 varianti ko'rinadi; to'g'ri tanlangach tavsif chapdagi bot javobiga tushadi, qator ✓ bilan yig'iladi, keyingi buyruq ochiladi. Xato izohi — bitta, joriy qator ostida.
Animatsiya: yo'q.

✎ 30.09 (9-savol B — `/setcommands` «Qo'shimcha»ga): ekran @BotFather'dagi ro'yxat o'rniga botning /help javobi bo'ldi — uch buyruq, tavsiflar va ✔ tartibi o'sha; uyga vazifaning «/help qo'shing» bandi shu ekrandan davom etadi · 29.09: 🔴 FAKT «Telegram ularni avtomatik ro'yxatga chiqaradi» — noto'g'ri (ro'yxatni bot egasi beradi) → olindi; /start «Botni ishga tushiradi» → «Suhbatni boshlaydi» (`bot.launch()` bilan chalkashardi) — ChatGPT #20–21 shu bilan yopiladi · «to'g'ri chipdan tanlab» olindi · 🏅 olindi · **KOD:** chap panel — chat ko'rinishi (@BotFather yorlig'i o'rniga)

## 14 · 4-savol ✅  `[282]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **/start va /help kabi buyruqlar oddiy xabardan nimasi bilan ajralib turadi?**
  - Ularni faqat bot egasi yubora oladi, boshqalar yubora olmaydi
  - Ular bot dasturini qayta ishga tushiradi va suhbatni tozalaydi
  - ✔ Ular / bilan boshlanadi va kodda alohida handler bilan ushlanadi
  - Ular xabar emas: Telegram ularni botga umuman yubormaydi
- To'g'ri: Buyruq / bilan boshlanadi va kodda uni bot.command ushlaydi.
- Xato izohlari:
  - Buyruqni har qanday foydalanuvchi yubora oladi — /start ni har yangi mijoz birinchi bo'lib bosadi.
  - Buyruq bot dasturini qayta ishga tushirmaydi: u oddiy hodisa, unga mos handler javob beradi.
  - Buyruq ham botga xabar bo'lib keladi — / bilan boshlanadigan matnli xabar. Shuning uchun uni handler ushlaydi.
  - (umumiy) Buyruq — / bilan boshlanadigan xabar; kodda uni bot.command ushlaydi.
- Nishon: Command Spotter (birinchi urinishda to'g'ri bo'lsa)

✎ «Ular faqat mentor kompyuterida ishlaydi» va «faqat rasm va video uchun» — ishonarsiz variantlar → haqiqiy noto'g'ri tasavvurlar (/start botni qayta ishga tushiradi; buyruq botga yetib bormaydi) · 4-variant 12-ekrandagi faktga bog'landi (buyruq — matn, shuning uchun fallback handler uni ushlab olishi mumkin) · «chaqiruv so'zi» → «buyruq» · 30.09 QA F-0930-63 (rasm): «nimasi bilan alohida?» → «nimasi bilan ajralib turadi?» · 9-savol B: to'g'ri variant @BotFather ro'yxatiga tayanardi → «kodda alohida handler bilan ushlanadi» (✔ o'rni o'sha, uzunligi boshqalar bilan teng) · 29.09: «avtomatik ravishda» olingan

## 15 · bot.js ni yig'ing ✅ (final)  `[297]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: bot.js ni to'g'ri tartibda yig'ing.**
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
- To'g'ri: ✓ Tayyor: token → bot → /start handleri → tugma handleri → fallback handler → bot.launch(). Telegraf handlerlarni yozilgan tartibda tekshiradi — shuning uchun fallback handler ulardan keyin turadi. (3-qatordagi `menu` — 7-ekrandagidek `Markup.inlineKeyboard` bilan yasalgan tugmalar.)
- Fallback handler /start dan oldin bo'lsa: Fallback handler /start dan oldin turibdi. U har qanday matnni ushlaydi — /start ham matn, shuning uchun salom o'rniga «Tushunmadim» keladi. Tartibni to'g'rilang.
- bot.launch() oxirida bo'lmasa: bot.launch() handlerlardan oldin turibdi. Avval hamma handler yoziladi, keyin bot ishga tushiriladi — launch() faylning oxirgi qatori.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: bot.js ni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Xato holatda bitta sariq ramka (yuqoridagi uchtadan biri), to'g'ri bo'lsa bitta yashil ramka.
Animatsiya: HA — to'g'ri yig'ilgach 3–5-qadam (handlerlar) yonida yuqoridan pastga strelka chiziladi (~1 s): hodisa handlerlarni shu tartibda aylanib chiqadi, fallback handler — oxirgisi. Faqat to'g'ri javobdan keyin.
Olib tashlanadi: Mentordagi «Diqqat: agar 🚀 ishga tushirishni 🔕 oxirgi qatordan oldin qo'ysangiz — oqibatini ko'rasiz» · uyacha yozuvlari («avval kalit o'qiladi · keyin Botjon yaratiladi · … · eng oxiri ishga tushiriladi») · ikkinchi yashil ramka («Tayyor bot fayli: kalit → Botjon → 📋 … Mana shu — to'liq muloqot qiladigan Botjon» — `dd-done` bilan bir ma'no) · `DragDropOrder` ning ichki «⚠️ Tartib xato — qayta joylang» va hovuz-yozuvi (sariq ramka bilan bir ma'no).

✎ 🔴 FAKT (DAVOM 7): uyacha yozuvlari tayyor tartibni aytardi [1405–1412], Mentor esa launch/fallback tartibini [1402] → «1-qadam…», Mentor faqat vazifa · 🔴 FAKT: eski xato-izoh «Botjon ishga tushdi, lekin oxirgi qator hali yo'q! Notanish xabarlarga Botjon hamon jim qoladi» — aniq emas: `bot.launch()` dan keyingi qatorlar ham darhol bajariladi, handler ro'yxatga tushadi → haqiqiy tartib-xato qo'shildi: fallback handler /start dan oldin tursa, /start ni o'zi ushlab oladi (**KOD:** `onChange` da yangi holat `fallback-early`); launch yozuvi qoida sifatida qoldi · `ctx.reply('🍕')` → `'Pitsa tanlandi'` · `menu` izohsiz edi → bir qavs-gap · Kod-bo'laklar tartibi o'zgarmadi · start ↔ action tartibi — ikkalasi to'g'ri (QARORLAR «o'zim hal qilganlar» 3) · 30.09 ChatGPT #22–23 (final javobni ochadi; «launch fallbackdan oldin — jim») — 29.09 da tuzatilgan · `bot.ts` → `bot.js`

## 16 · Amaliyot · VS Code  `[318]`
- Eyebrow: Amaliyot · VS Code
- Sarlavha: **O'z botingizga menyu tugmalari qo'shing**
- Mentor: Bu topshiriqni o'z kompyuteringizda, VS Code'da bajaring. Har qadamni bajarib, «Bajardim» ni bosing — keyingisi ochiladi. Oxirida Mentor tekshiradi.
- TOPSHIRIQ: 1-darsda @BotFather'da ochgan botingizga /menu buyrug'ini va kamida 2 ta inline tugmani qo'shing. Har tugma uchun bot.action handlerini, oxiriga fallback handler — bot.on('text', ...) ni yozing.
- Qadamlar:
  1. Loyiha papkasida `npm install telegraf dotenv` ni ishga tushiring.
  2. `.env` fayliga 1-darsda saqlagan tokeningizni yozing: `BOT_TOKEN=...`. `.env` ni `.gitignore` ga qo'shing. Tokenni hech kimga yubormang, skrinshotga ham tushirmang.
  3. `bot.js` boshiga ikki qator yozing: `require('dotenv').config()` va `const { Telegraf, Markup } = require('telegraf')`.
  4. `bot.command('menu', ...)` ichida `Markup.inlineKeyboard` bilan 2 ta inline tugma chiqaring.
  5. Har tugma uchun `bot.action(...)` handlerini yozing. Ichida `ctx.answerCbQuery()` ni ham chaqiring — tugmadagi yuklanish belgisi to'xtaydi.
  6. Handlerlardan keyin `bot.on('text', ...)` — fallback handler qo'shing.
  7. Oxirgi qator — `bot.launch()`. Botni `node bot.js` bilan ishga tushiring va Telegram'da /menu yuborib sinang.
- Qo'shimcha (majburiy emas): @BotFather'da /setcommands bilan buyruqlar ro'yxatini kiriting — foydalanuvchi / yozganda Telegram shu ro'yxatni taklif qiladi.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.» · pastda: Avval bajaring → Davom etish

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi (1-dars v2 16-ekran bilan bir xil naqsh).
Animatsiya: yo'q.

✎ 🔴 FAKT: 1-dars v2 13-ekran «Telegraf… uni 3-darsda o'rnatasiz» deydi, bu darsda o'rnatish qadami yo'q edi → 1-qadam · 🔴 FAKT: `dotenv` va importlarsiz bot ishga tushmaydi (2-ekran) → 3-qadam · 🔴 FAKT: «BotFather'dan olgan (yoki mashq uchun yaratgan) botingizga» → «1-darsda ochgan botingizga» · `ctx.answerCbQuery()` — Telegram'da callback'ga javob berilmasa, tugmada soat belgisi bir necha soniya aylanib turadi; o'quvchi «buzildi» deb o'ylamasligi uchun (**Agent eslatmalari 6**) · `.ts` fayl `node` bilan to'g'ridan-to'g'ri ishlamasligi mumkin → `npx tsx bot.ts` (fayl nomi savoli — B-2) · «Zo'r!» olindi · «mentor» → «Mentor» · «(kalitni)» olindi · 30.09: 5-savol A — `bot.js`, `require`, `node bot.js` (`npx tsx` kerak emas) · ChatGPT #4: skrinshot ogohlantirishi (o'smirlar skrinshotni guruhga tashlaydi) · 9-savol B: /setcommands — «Qo'shimcha» · ChatGPT #24 (amaliyot va uyga vazifa bir xil) — 29.09 da uyga vazifa yangi bosqichga aylangan (/help)

## 17 · Natijalar (podium)  `[331]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — 1-dars B-5.)

## 18 · Takrorlash (kartochkalar)  `[336]`
- Sarlavha: **O'zingizni sinab ko'ring.**

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

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Orqaga · Yakunlash →)

✎ «Xizmat oynasi», «Botjonning kaliti», «konvert», «qator», «Fallback qatori» → A1 atamalari · 4-kartochka «qaysi buyruq yuboradi» → «kodda nima yuboradi» (buyruq — faqat /buyruq, A1-qo'shimcha) · 9-kartochka «yashirin signal» → «hodisa» (callback 7-ekranda endi o'rgatilgan) · 7-kartochka «ustiga yopishib» → «tagida» (7-ekran bilan bir xil) · 8-kartochka «Reply tugmalar» → «Reply klaviatura» · 6-kartochka izohi: ro'yxat avtomatik emas — /setcommands · 11-kartochka javobi — kodning o'zi (fallback handler izohga o'tdi) · «Mijoz botni birinchi marta ochganda shu qator ishlaydi» → foydalanuvchi /start yuboradi · «🎉» (tugash ekrani) — **KOD** (A4) · 30.09: 6-kartochka izohi `/setcommands` o'rniga `bot.command` (9-savol B) · 12-kartochka izohi pollingni 1-dars bilan bog'laydi (viktorina 10-savol shunga tayanadi — ChatGPT #27) · ChatGPT #26 (12 → 7–8 kartochka) **Rad**: har kartochka shu darsda o'rgatilgan narsani so'raydi; o'rgatilmagani (rate limit) glossariydan olindi

## 19 · Yakun  `[357]`
- Eyebrow: Tayyor · belgi: ✓ Handlerlar yozildi
- Sarlavha: **Botingiz endi buyruqlarga va tugmalarga javob beradi.** (yonida ball halqasi)
- Jonli viktorina tugmasi · o'quvchida: Mentorni kuting
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
- Nishonlaringiz — N/4 (olinmaganlari qulf belgisi bilan)
- Kalit so'zlar (takrorlash) — ochiladigan ro'yxat: **token** — botning maxfiy kaliti (.env faylida) · **Telegraf** — Node.js uchun bot kutubxonasi · **ctx** — hodisa haqidagi ma'lumot (context) · **bot.start** — /start buyrug'i uchun handler · **bot.command** — /menu kabi buyruq uchun handler · **inline tugma** — xabar tagidagi tugma, bosilsa callback keladi · **reply klaviatura** — klaviatura o'rnidagi tugmalar, bosilsa matn ketadi · **bot.action** — callback uchun handler · **bot.hears** — aniq matn uchun handler · **fallback handler** — mos handler topilmagan matnga javob beradi · **bot.launch** — botni ishga tushiradi (polling bilan)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

Olib tashlanadi: «Botjon @BotFather orqali yaratiladi va 🔑 kalit oladi» (1-darsning bilimi) · «oxirgi qator (fallback) hech qachon jim qoldirmaydi» · «📝», «🚀», «📓», «🏅», «💡», «⏳» (matn oldidagi).

✎ 🔴 FAKT: uyga vazifadagi «Yarating — @BotFather'ga /newbot yuborib, o'z Botjoningizni oching» — bot 1-darsda ochilgan (1-dars uyga vazifasi ham tokenni «3-darsda kerak bo'ladi» deb saqlatgan) → «Sinang / Qo'shing / Tekshiring» · keyingi dars qatori App.jsx m5-04 bilan mos; «Botjonga 📓 xotira beramiz» → «Bot mijoz tanlagan pitsani eslab qoladi» (1-dars v2 12-ekran bilan bir xil ip) · «Botjon endi gapiradi» → yangi sarlavha · glossariy: «BotFather» (1-darsda o'tilgan) → «bot.command» (shu darsda yangi, glossariyda yo'q edi) · «hech qachon» olindi · 30.09: glossariydan «rate limit» olindi (12-ekran) · uyga vazifa «Qo'shing» bandidan /setcommands 16-ekran «Qo'shimcha»siga o'tdi (9-savol B) · ChatGPT #25 **Rad**: keyingi dars nomi App.jsx'dan (A9); PostgreSQL backend darslarida o'tilgan — o'quvchi uchun yangi so'z emas

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Callback Catcher** (hozir Button Master) — Inline tugma bosilishini qaysi handler ushlashini birinchi urinishda topdingiz (10-ekran)
- **Command Spotter** — Buyruq oddiy xabardan nimasi bilan farq qilishini birinchi urinishda topdingiz (14-ekran)
- **Fallback Coder** (hozir Never Silent) — Fallback handlerni kodda qo'shib, sinab ko'rdingiz (12-ekran, bonus)
- **Command Writer** — Buyruqlar ro'yxatini birinchi urinishda xatosiz to'ldirdingiz (13-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

✎ «Button Master» → «Callback Catcher» (aynan callback'ni tekshiradi) · «Never Silent» → «Fallback Coder» (1-dars v2 da «Never Silent» — boshqa nishon; ikki darsda bir nom chalkashtiradi) · «Botjonni jim qoldirmadingiz» → «kodda qo'shib, sinab ko'rdingiz» (bonus — tavsif qilingan ishni aytadi) · `ACH_TRIGGERS` o'zgarmaydi

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida:
1. (4) **Token — .env faylida:** Token kodda yozilmaydi — kod Git'ga chiqsa, tokenni ko'rgan odam botni boshqara oladi. · .env faylida saqlanadi — .env .gitignore'da, Git uni commit qilmaydi. · Kod faqat nomini o'qiydi — process.env.BOT_TOKEN; faylni dotenv yuklaydi. · Sinfga savol: Token nega .env faylida saqlanadi?
2. (8) **Ikki xil tugma:** Inline tugma — xabar tagida turadi. Bosilsa, chatga matn yozilmaydi, botga callback keladi. · Reply klaviatura — klaviatura o'rnida turadi. Bosilsa, tugma matni oddiy xabar bo'lib ketadi. · Farqni eslab qoling — inline → callback → bot.action; reply → matn → bot.hears. · Sinfga savol: Ikkalasi bosilganda nima farq qiladi?
3. (10) **Handler hodisani ushlaydi:** Callback → bot.action — bot.action('pizza') tugma ma'lumoti 'pizza' bo'lganda ishlaydi. · Matn → bot.hears — bot.hears('Pitsa') matn aynan «Pitsa» bo'lganda ishlaydi. · Handler yo'q — javob yo'q — hodisa keladi, lekin uni ushlaydigan handler bo'lmasa, bot jim qoladi. · Sinfga savol: Inline tugma bosilishini qaysi handler ushlaydi?
4. (14) **Buyruqlar:** / bilan boshlanadi — /start, /help, /menu — buyruqlar. · Kodda — bot.command — bot.command('menu', ...) /menu ni ushlaydi; /start uchun — bot.start. · Handler yo'q — javob yo'q — buyruq keldi, lekin unga handler bo'lmasa, bot javob bermaydi. · Sinfga savol: Buyruq oddiy xabardan nimasi bilan farq qiladi?
5. (15) **bot.js tartibi:** Avval — token o'qiladi (process.env.BOT_TOKEN). · Keyin — bot yaratiladi: new Telegraf(token), ya'ni bot (Telegraf obyekti). · Handlerlar, so'ng ishga tushirish — start, action, keyin fallback handler; eng oxiri launch(). · Chizma: Token → Bot → start → action → fallback → launch · Sinfga savol: Nega launch() eng oxirida, fallback esa handlerlardan keyin turadi?
- Belgilar (U3): 1-oyna — `new Telegraf('1234…')` · `BOT_TOKEN=...` · `process.env.BOT_TOKEN` | 2-oyna — `Markup.button.callback('Pitsa', 'pizza')` · `Markup.keyboard([['Pitsa']])` · 3 | 3-oyna — `bot.action('pizza', …)` · `bot.hears('Pitsa', …)` · 3 | 4-oyna — `/menu` · `bot.command('menu', …)` · 3 | 5-oyna — `process.env.BOT_TOKEN` · `new Telegraf(token)` · `bot.launch()`

✎ «Kalit», «qulfli tortma», «signal», «qator», «varaq», «Botjon» → A1 atamalari · 2-oynadagi «Inline = callback (jim signal)» → strelkali juftlik · 5-oynadagi RcFlow emojilari (🔑 🤖 📋 🔘 🔕 🚀) olindi · 1-oynadagi «Botjonni o'g'irlaydi» → «botni boshqara oladi» · 1-oyna sinf savolidagi `.env"da` (qo'shtirnoq xatosi) → «.env faylida» · 3–4-oyna «Qator yo'q — Botjon jim» → «Handler yo'q — javob yo'q» · 30.09: 4-oyna 2-bandi `/setcommands` o'rniga `bot.command` (9-savol B) · 5-oyna `bot.js`

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Bot tokeni qayerda saqlanadi? Kodning o'zida, new Telegraf(...) qatorida · README faylida, jamoa ko'rishi uchun · ✔ .env faylida, Git'ga tushmaydigan joyda · Bot tavsifida, @BotFather sozlamasida
2. Telegraf nima? ✔ Bot API bilan ishlashni osonlashtiradigan Node.js kutubxonasi · Foydalanuvchi xabarlarini saqlaydigan SQL ma'lumotlar bazasi · Botga rasm va video yuklab beradigan tashqi xizmat · Telegram ilovasining kompyuterda ishlaydigan versiyasi
   ✎ 01.10 (F-1001-59, razrabotka): 2-variant «SQL» — `lint:tell` (texnik atama faqat to'g'rida edi); RECAPS 4-oyna «keldi-yu» → «keldi, lekin» (`lint:til` sheva-yuklama); ✔ o'rni o'sha.
3. ctx nima? Bot sozlamalari saqlanadigan konfiguratsiya fayli · Foydalanuvchining Telegram parolini saqlaydigan obyekt · Serverning joriy vaqtini ko'rsatadigan funksiya · ✔ Hodisa haqidagi ma'lumot: kim yozdi va qaysi chatdan
4. Inline tugma bosilganda nima bo'ladi? Tugma matni chatga oddiy xabar bo'lib qo'shiladi · ✔ Chatga matn yozilmaydi, botga tugma ma'lumoti keladi · Serverga avtomatik yangi rasm fayli yuklanadi · Bot o'zini qayta ishga tushirib, suhbatni tozalaydi
5. Reply klaviatura tugmasi bosilganda nima bo'ladi? Hech narsa: tugma faqat bezak bo'lib turadi · ✔ Tugma matni chatga oddiy xabar bo'lib ketadi · Bot suhbatni to'xtatib, chatdan chiqib ketadi · Foydalanuvchi akkaunti vaqtincha bloklanadi
6. bot.action(...) nimani ushlaydi? Faqat / bilan boshlanadigan buyruqlarni · Reply klaviaturadan kelgan oddiy matnni · ✔ Inline tugma bosilganda keladigan hodisani · Foydalanuvchi yuborgan rasm va fayllarni
7. bot.hears(...) nimani ushlaydi? ✔ Aniq matnli xabarni, masalan reply tugma matnini · Faqat inline tugma bosilganda keladigan hodisani · Botning yoqilgani yoki o'chganini bildiradigan hodisani · Faqat ovozli xabarlarni, ularni matnga aylantirib
8. Fallback handler nima uchun kerak? Bot dasturi tezroq ishga tushishi uchun · Faqat rasm kelganda xato xabarini chiqarish uchun · Tokenni qo'shimcha qatlam bilan himoyalash uchun · ✔ Mos handler topilmagan xabarga ham javob berish uchun
9. ctx.reply(...) javobni qaysi chatga yuboradi? Bot egasining shaxsiy chatiga · Botga oxirgi yozgan odamning chatiga · Hamma foydalanuvchilarning chatiga · ✔ Xabar kelgan chatning o'ziga
10. Polling nimani bildiradi? Telegram xabarni o'zi botning internetdagi manziliga yuborishi · ✔ Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rashi · Foydalanuvchi ovozini yozib, matnga aylantirish · Botning barcha xabarlarini o'chirib tashlash
11. bot.launch() nima qiladi? Yangi token yaratib, eskisini butunlay bekor qiladi · Botni Telegram'dan o'chirib, uning akkauntini yopadi · ✔ Botni ishga tushiradi: bot hodisalarni kuta boshlaydi · Faqat botning rasmi va nomini yangilab qo'yadi
12. /start va /help qanday belgi bilan boshlanadi? ✔ Qiyshiq chiziq (/) bilan · Yulduzcha (*) bilan · Ikki nuqta (:) bilan · Hech qanday belgisiz

- Viktorina natijasi yozuvi: ball · x/12 to'g'ri · eng uzun ketma-ketlik (hozir «streak 🔥xN» — umumiy shablon, B-6)

✎ ✔ o'rinlari tekshirildi (`QUIZ_BANK.correct`: 2·0·3·1·1·2·0·3·3·1·2·0) — o'zgarmadi · 1-savol: «doim» (ikki variantda), «Hech qayerda… qo'lda kiritiladi» (qisman ishlaydigan yo'l) → «Bot tavsifida» · 3-savol: to'g'ri javobdagi «konvert» → «Hodisa haqidagi ma'lumot» · 4-savol: «yashirin signal (callback)» qavsi faqat to'g'rida edi → olindi · 6-savol: to'g'ri javobdagi «Xabar ustidagi» → «Inline tugma» · 7-savol: «funksiya» faqat bitta xato variantda turardi → hammasi «…ni» shaklida · 9-savol: «xizmat oynasi vaqtincha yopiladi» → texnik aniq shakl (12-ekran bilan bir xil) · 10-savol: «Telegram serveri botga qo'ng'iroq qilib» → webhook'ning haqiqiy ta'rifi (1-dars v2 11-ekran) · 11-savol: «signallarni kutib, qatorlarga javob beradi» → «hodisalarni kuta boshlaydi»; «texnik buyruq» → olindi (A1-qo'shimcha) · 12-savol: «hisoblanadi» (taqiq-so'z) va to'g'ri javobdagi qo'shimcha izoh olindi, variantlar tenglashtirildi · «doimo», «doim», «darhol», «butunlay» ortiqcha joylarda olindi · 30.09: 9-savol mazmuni almashdi — rate limit darsdan olindi (12-ekran); yangi savol 11-ekranni tekshiradi (u ekranga savol yo'q edi), ✔ o'rni (D) o'sha; «oxirgi yozgan odam» — 11-ekrandagi xatoga yaqin ishonarli xato · 10-savol (polling) **Qisman** (ChatGPT #27): 1-darsda o'tilgan, 3-darsda 12-kartochka va glossariy bilan bog'landi — qoladi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — `BF_STEPS` suhbati olinadi; yangi hook: eslatma qatori + bo'sh chat + «▶ /start yuborish» → ~1.5 s → «Javob kelmadi.»; savol va variantlar shundan keyin chiqadi (hozir xira turadi); javob izohi tanlovga qarab ikki xil («Aynan!» — b, «Qiziq fikr!» — a/c; `onAnswer` payload o'zgarmaydi).
2. s1 — preview chatga `replyKb` («Biz haqimizda») qo'shiladi, inline tugmalar «Pitsa · Ichimlik»; `sk-info` izoh-kartasi olinadi; 4 qadam matni yangilanadi.
3. s2 — `.env` izohi `#` bilan; `bot.js` ga `require('dotenv').config()` qatori; token namunasi `1234567890:AA-namuna-token`; uzun kod qatori o'z panelida o'raladi/suriladi (kattalashtirilgan oynada ham); kod izohlaridagi emoji olinadi.
4. s3 — qatlamlar 4 → 3 (Telegram · Telegraf · bot.js); bitta qator, izoh-karta qator ostida, ✓ qatlamning o'zida (ikkinchi ✓ qatori olinadi); kirishda yo'l va qaytish strelkasi chiziladi.
5. s5, s11 — `CodeFile name` `bot.service.ts` → `bot.js`; s5 xulosa `frame-success` olinadi; `'Salom! 👋'` → `'Salom!'`; s11 Valining gap-pufakchasi olinadi.
6. s6 — `CTX_FIELDS` 3-maydon `ctx.reply(...)` → `ctx.chat` · `{ id: 5012, type: "private" }`.
7. s7 — rejim tugmalari o'rniga navbatli qadamlar (inline → ✓ → reply → ✓ → xulosa); har qadamda `Markup` kodi; inline chat `/menyu` → `/menu`, tugmalar 2 ta; callback strelka animatsiyasi; har rejimdagi alohida `frame-success` olinadi.
8. s9 — `Screen9` navbatli ochilish (buyruq → inline → reply; har qadam: yuborish → handler yo'q → + handler → qayta → ✓); /menu javobi inline tugmalar bilan, 2-qadam shu tugmadan; 3-qadamda `replyKb`; `bot.hears('Biz haqimizda')`; hodisa → handler chizig'i; «Qisman ulanganda» ramkasi olinadi.
9. s11 — kod: `bot.hears('Narxlar', …)` + `ctx.telegram.sendMessage(VALI_ID, …)` → `ctx.reply(…)`; Aziza xabari «Narxlar»; javob yo'nalishi chizig'i.
10. s12 — rate limit qismi to'liq olinadi (8 marta bosish, 429 holati, bo'sh `sk-info`); bitta ustun; «▶ Noma'lum xabar yuborish» `btn-soft` → asosiy uslub; fallback handler qo'shilgach kod qatori ko'rinadi.
11. s13 — `CMD_BLANKS` navbatli ochilish (joriy qator variantlari); /start to'g'ri varianti matni «Suhbatni boshlaydi: salom va menyu yuboradi»; chap panel — chat (/help → bot javobi); variant tartibi o'zgarmaydi.
11a. s14 — to'g'ri variant va izoh matnlari; savol matni («ajralib turadi»).
11c. 30.09 javoblari: 4 ta testning to'g'ri javob izohi — bitta gap, «To'g'ri!» siz (16-savol); 13-ekran variantlari aralash, nishon sharti variant matni bo'yicha (4-savol A); 12-ekran «▶ Noma'lum xabar yuborish» — asosiy tugma, rate limit qismi olingan (15-savol izohi).
11b. s1 — qadam yorliqlari (`tag`) olinadi; o'ngdagi qadamlar bosilmaydigan ro'yxat ko'rinishida; qadamlar matni.
12. s15 — `hints` → «1-qadam…6-qadam»; Mentor gapi qisqaradi; `onChange` ga `fallback-early` holati (fallback start'dan oldin); launch yozuvi yangilanadi; ikkinchi `frame-success` va `DragDropOrder` ichki xato-yozuvlari (`dd-wrong`, `dd-pool-empty`) olinadi; to'g'ri yig'ilgach handlerlar bo'ylab strelka; bo'lak matnidagi emoji olinadi.
13. s15 (taklif, foydalanuvchi qarori — Agent eslatmalari 3) — start ↔ action o'rin almashgan tartib ham to'g'ri deb qabul qilinadi (`solved` tekshiruvi); `picked` sentinel o'zgarmaydi.
14. s16 — `ScreenLivePractice` checklist navbat bilan (1-dars v2 KOD 12 naqshi); 7 qadam (`bot.js`, `require`, `node bot.js`) + «Qo'shimcha» qatori.
14a. Butun dars — `bot.ts` → `bot.js`; UI qoidalari U1–U3 (`01-BotIntro-v2.md`): harakat tugmalari (▶ …) bitta asosiy uslubda (`btn`), `btn-soft` — faqat ikkinchi darajali; 3, 5, 6-ekrandagi ochiladigan qismlarda `›` / `✓`; `TgChat` oraliqlari va so'z bo'linmasligi; RECAPS `ic` → kod misoli («Belgilar»); `QUIZ_BANK[8]` mazmuni (✔ indeksi 3); glossariydan «rate limit».
15. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`): sarlavha, Mentor, chat pufakchalari, kod bo'laklari, `QZ_BG_SHAPES` dagi 🔑 ✉️, test umumiy yozuvlari (⚡ 📨 📖), flashcard tugash ekrani 🎉; RECAPS `ic` → raqam, `RcFlow` emojisiz; nishon `name`/`desc`; «Botjon» 0 ta qolishi (grep).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **App.jsx m5-03 `sub`** «BotFather, token, /start, inline» → «buyruqlar, inline tugma, reply klaviatura» (@BotFather va token 1-darsda) — App.jsx chegaradan tashqarida.
2. **Modul bo'yicha fayl nomi — hal bo'ldi (5-savol A, F-0930-65):** hamma darsda `bot.js`, `require`, `node bot.js`. 3-dars moslandi; 4, 6-dars (`index.js`) va 7-dars (`bot.js`/`index.js`) — o'z v2 larida.
3. **5-dars:** 6-ekrandagi «bularning hammasini o'tgan darslarda o'rgandingiz» (`Markup.button.callback`) — 3-dars v2 dan keyin rost bo'ladi; DAVOM 7 dagi «5-dars 3-ekran inline/reply — aslida 3-dars» — tasdiqlanadi: inline/reply 3-darsda o'rgatiladi.
4. **1-dars v2:** 18-ekran 3-kartochka «javob qaysi **buyruq** bilan yuboriladi? — ctx.reply» → «buyruq» 3-darsdan boshlab faqat /buyruq ma'nosida (A1-qo'shimcha) — «nima bilan» deb o'zgartirish kerak. 13-ekrandagi «Telegraf'ni 3-darsda o'rnatasiz» — endi 3-dars 16-ekranida bor.
5. **Nishon nomlari modul bo'yicha takrorlanmasin:** 1-dars «Never Silent» ↔ 3-dars (hozir) «Never Silent» — 3-darsda «Fallback Coder».
6. **Umumiy shablon (KATTA_TOZALASH nomzodi):** arena natijasidagi «eng uzun streak 🔥xN», test ekranlaridagi «⚡ Jonli dars…», «📨 Javobingiz qabul qilindi» — barcha darslarda bir xil.
7. **A1 jadvaliga (1-dars v2) qo'shish nomzodi:** buyruq · inline tugma · reply klaviatura · callback · Markup — 4, 5, 7-darslar ham shu nomlarni oladi → `QONUN_NOMZODLARI.md`.
8. **RU matni** — o'zbekcha tasdiqlangach.
9. **Harakat tugmasi uslubi (nomzod N10):** 3-darsda (12-ekran) va 4-darsda (0, 2-ekran — QA F-0930-66, 68) bir xil vazifa goh och `btn-soft`, goh to'q `btn`; QA och tugmani tugma deb tanimagan → butun modulda bitta qoida.
10. **Rate limit (429)** — darsdan olindi; kerak bo'lsa 7-darsda (bot + DB + AI, xatolar) — 7-dars v2 ko'rigida.
11. **4-dars QA (F-0930-66…74)** shu xabar bilan kelgan — 4-dars auditi bilan birga `04-BotStatefulMemory-v2.md` ga kiradi.

---

## Agent eslatmalari
1. **DAVOM 6–7 bandlari — tekshiruv natijasi:** «4-modulda NestJS resurslari (Car, Book)» — tasdiqlandi (2-ekran xulosa, 3-ekran Mentor va karta; Car/Book `src/4a-Modull` da bor) → «NestJS darslarida», «Autentifikatsiya va .env» darsi · «/menyu vs /menu» — tasdiqlandi, faqat 7-ekran [1003] → /menu · «Callback o'rgatilmagan» — tasdiqlandi (kartochka 9–10, oyna 2, viktorina 4) → 7-ekranda kiritildi · 12-ekran rate limit qutisi bo'sh — tasdiqlandi [1253–1254] · final uyacha yozuvlari javobni ochadi — tasdiqlandi [1405–1412] + Mentor [1402].
2. ~~Savol — fayl va ishga tushirish~~ → 5-savol A: `bot.js`, `require`, `node bot.js` (30.09).
3. **Savol — final tartibi:** `bot.start` va `bot.action` texnik jihatdan istalgan tartibda ishlaydi (har xil hodisa turlari), lekin final faqat bitta tartibni qabul qiladi — o'quvchi to'g'ri kodni «xato» deb eshitadi. Taklif: KOD 13 (ikkala tartibni qabul qilish). Rad etilsa — 3 va 4-bo'lakni bog'laydigan boshqa bo'lak kerak bo'ladi.
4. **13-ekran:** har uch qatorda to'g'ri variant birinchi turadi (4-dars 13-ekrandagi kabi). Ballik emas, lekin nishon beradi — qoida bo'yicha tartibni o'zim o'zgartirmadim; aralashtirishga ruxsat so'rayman.
5. **Hook:** ✔ o'rni (2-variant) va variantlar soni saqlandi, mazmuni butunlay yangi (token → kod yo'q) — hook ballik emas (`correct: true` hammaga), jonli kalitga ta'siri yo'q.
6. **Yangi texnik narsalar** (30.09: 9-savol B — `Markup`, callback, `answerCbQuery`, `dotenv` qoladi; `/setcommands` 16-ekran «Qo'shimcha»siga): `Markup` (7), `import 'dotenv/config'` (2), `ctx.telegram.sendMessage` (11), `ctx.answerCbQuery()` (16), `/setcommands` (13). Har biri ishlaydigan bot uchun zarur yoki xato-faktni tuzatadi; har biriga bitta gap izoh berildi. Ortiqcha deb topilsa, birinchi olinadiganlar — `answerCbQuery` va `/setcommands`.
7. **12-ekran rate limit** — 30.09 da olindi (QA F-0930-62 + ChatGPT #17–18); viktorina 9-savol mazmuni almashdi, glossariydan olindi.
8. **Tekshirilgan, xato emas:** `bot.start` = `bot.command('start')` qisqa yozuvi · `bot.command('menu')` /menu ni ushlaydi · `bot.action('pizza')` callback ma'lumotini tekshiradi · `bot.hears('…')` matnni aynan solishtiradi (11-ekran xatosi shundan) · `Markup.inlineKeyboard([...])`, `Markup.keyboard([[...]]).resize()` — Telegraf v4 yozuvi · `ctx.reply` xabar kelgan chatga yuboradi · `bot.launch()` sukut bo'yicha polling bilan ishga tushadi.
