# 5-Modul · 7-dars «Loyiha kuni: bot + DB + AI» — YANGI MATN (v2, amaliyot-qolip)

Fayl: `src/5-Modull/BotFullProjectLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (20 edi) · uz + ru
**Holat: 03.10 01:08 — KODGA MOS (F-1002-109).** Farqlar `⚙` bilan.
Eski matn: `feedback/F-0928-QA-5modul/YAKUNIY/07-BotFullProject.md`. Har ekran ostida `✎` — eski ekranlardan nima qayerga ketgani.
Qolip: 5-dars v2 A-bo'limi (`05-BotAiProject-v2.md`) — shu yerda faqat 7-darsga xos qoidalar.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) kod. Vaqt ≈ 90 daqiqa, amaliyot ≈ 58.

---

## A. 7-darsga xos qoidalar

1. **Bitta natija:** dars oxirida bot serverda — laptop yopiq, telefondan /start, javob keladi. Buyurtmalar alohida jadvalda.
2. **Hosting qarori (reja 7-bo'lim, 2-savol — HAL):** **Render** bepul web-xizmat, karta so'ramaydi, GitHub bilan kiriladi, Dockerfile'ni o'zi topadi.
   Halol chegara: bepul server **15 daqiqa jimlikdan keyin uxlaydi**, HTTP so'rov kelganda 30–60 soniyada uyg'onadi. Shuning uchun
   serverda **webhook**: Telegram xabarni server manziliga yuboradi — server uyg'onadi va javob beradi. Laptopda **polling** qoladi.
   Rad etilganlar: Railway (30 kundan keyin karta), Koyeb (karta yoki uxlash), Fly (karta). Manbalar jurnalda (F-1002-108).
3. **Nima o'zgaradi:** darsning eski o'qi «polling sodda, webhook murakkab» edi. Yangi o'q: **laptopda polling, serverda webhook** — ikkalasi ham o'z joyida.
   Bitta token ikki joyda ishlamaydi: serverga joylagach laptopdagi bot to'xtatiladi (A3, 4-qadam).
4. **Kod serverga GitHub orqali boradi** → o'quvchida o'z GitHub nusxasi (fork) bo'lishi kerak. Bu 3-dars amaliyotiga kiradi (B-bo'lim); 7-darsda «o'z repo'ngiz» deb aytiladi.
5. **Sirlar:** `.env` serverga bormaydi — Render'da «Environment» bo'limiga uchta kalit yoziladi: `BOT_TOKEN`, `DATABASE_URL`, `GEMINI_API_KEY`. Webhook manzilini Render o'zi beradi (`RENDER_EXTERNAL_URL`), kod uni o'qiydi.
6. **Bir dars — bitta yangi narsa:** webhook + deploy. Buyurtmalar jadvali — 4-darsdagi `users` ning takrori (yangi entity, bir xil yo'l). `bot.catch` — A2 da bitta qator.
7. Tushib qolgan: «To'liq botni yig'ing» (5), «Joylashdan oldin tekshiruv» (11), «Serverdagi bot tunda» (12), «Yana ikki qoida» (13), final (15) — kartochkalar va arena; tunda-suhbat A3 kutilgan natijasida qayta tiriladi.

---

## Darsning ipi
- **Hook:** laptop yopildi, 02:14 da mijoz yozdi — javob yo'q → «Nega?»
- **Model:** bot laptopda ishlardi → kod GitHub orqali serverga → sirlar sozlamada → Telegram webhook bilan serverga yozadi → laptop yopiq, bot javob beradi.
- **Namuna:** AvtoPizza (5-dars `dars-05-done` + 6-dars AI). O'quvchi — o'z boti.
- **Yakun:** bot serverda · keyingi dars — PM: «Botingizni ishlatgan odamdan nimani so'raysiz?».

---

## 0 · Kirish — laptop yopildi
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Soat 02:14. Mijoz yozdi — bot nega jim?**
- Mentor: Kunduzi botingiz yaxshi ishladi, kechqurun laptopni yopdingiz — <b>«▶ Nima bo'lishini ko'rish»</b>ni bosing.
- Chat «AvtoPizza»:
  - mijoz: 02:14 — Salom! Hozir buyurtma bersam bo'ladimi?
  - (bosilgach) mijoz: 02:21 — Hali ham javob yo'q…
- Tugma: ▶ Nima bo'lishini ko'rish → ✓ Ko'rdingiz
- Savol: **Nega bot javob bermadi?**
  - Bot kodida kechasi kutilmagan xato chiqdi
  - ✔ Bot dasturi laptop bilan birga to'xtadi
  - Telegram tunda botlarga xabar yetkazmaydi
- Javob — 2-variant: **Aynan!** Bot dasturi laptopingizda ishlardi — laptop yopilganda u ham to'xtadi.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Chatga qarang: xabar yetib keldi, javob yo'q. Javobni yozadigan dastur laptopda edi — u yopildi.
- Tugma: Davom etish

✎ Eski 0-ekran, 162-qonun: javoblar ≤2 gap, «bugun serverga joylaymiz» quyrug'i olindi (1-ekran aytadi).

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: **Dars oxirida botingiz laptopsiz ishlaydi.**
- Mentor: Yangi kod kam — asosiy ish botni GitHub orqali serverga joylash; AvtoPizza namuna, sizniki o'z botingiz.
- Chat «AvtoPizza» (server · 03:00):
  - mijoz: 03:00 — /start
  - bot: Yana salom, Aziz! AvtoPizza'ga xush kelibsiz! · tugmalar: 🍕 Menyu · 📦 Buyurtma
  - mijoz: (🍕 Menyu bosdi)
  - bot: Tanlang: · tugmalar: Margarita · Pepperoni · Pishloqli
  - pastki yozuv (kulrang, mono): laptop yopiq · bot Render'da
- Bugungi 3 qadam (tex-karta):
  1. Buyurtmalar jadvali — bot buyurtmani alohida saqlaydi
  2. Serverga tayyorlash — webhook va xato-ushlagich, GitHub'ga push
  3. Deploy — Render'da server, sirlar sozlamada, telefondan sinash
- Pastki qator: repo `TelegramBotNest` · boshlang'ich holat `dars-07-start` · tayyor namuna `dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz →

⚙ F-1003-06 (03.10): qadam ostidagi kichik teglar olib tashlandi — qadam matni o'zi yetadi (QA «olib tashlaylik», 5-Modul 8 kod darsi).

✎ Eski 1-ekran (laptop → server chizmasi + 4 qadam) → tayyor natija chati + 3 qadam. Eski 2-ekran «to'liq bot — to'rt qism» → kartochka.

## 2 · Tushuncha 1 — bot serverga qanday boradi
- Eyebrow: Tushuncha · server
- Sarlavha: **Kod serverga boradi. `.env` ham boradimi?**
- Mentor: Server — to'xtamay ishlaydigan ijara kompyuter; <b>«▶ Serverga joylash»</b>ni bosib, nima ko'chib, nima qolishini ko'ring.
- Bitta vizual — uch karta bir qatorda, orasida strelka (bosilgach animatsiya):
  - **Laptop:** `src/` · `Dockerfile` · `.env` 🔒
  - → **GitHub** (o'z repo'ngiz): `src/` · `Dockerfile` · `.env` — yo'q (`.gitignore`)
  - → **Server (Render):** `src/` · `Dockerfile` · **Environment:** `BOT_TOKEN` · `DATABASE_URL` · `GEMINI_API_KEY`
- Tugma: ▶ Serverga joylash → ✓ Ko'rdingiz
- Bosilgach — yashil: `.env` serverga bormaydi. Sirlarni server sozlamalariga yozasiz, kod ularni `config` dan o'qiydi.
- Tugmalar: Orqaga · Serverga joylang → Davom etish

✎ Eski 3 («bot qayerda ishlaydi»), 6 («laptop va server»), 7 («token serverda», nishon keyMaster) bitta vizualga: ko'chish yo'li + sirlar. «Deploy» so'zi shu yerda kiradi: «kodni serverga joylab, u yerda ishga tushirish».

## A1 · Amaliyot 1 — buyurtmalar jadvali  `(≈18 daq)`
- Eyebrow: Amaliyot 1 · baza
- Sarlavha: **Buyurtmalar alohida jadvalda saqlansin.**
- Mentor: 4-darsda `users` jadvalini qo'shgansiz — endi o'sha yo'l bilan ikkinchi jadval: <b>«1 · Ochish»</b>dan boshlang.
- Qadamlar:
  1. **Ochish** — Antigravity'da `TelegramBotNest`, terminalda `npm run start:dev`, «Telegram bot ulandi».
  2. **Prompt** — qavsni o'z botingizga moslang, «Nusxalash», Antigravity'ga:
     > `src/core/entity/` da yangi entity **{Buyurtma}** yarat (`users` kabi, BaseEntity'dan): ustunlar `telegram_id`, **{nima tanlandi}**, **{manzil yoki boshqa ma'lumot}**.
     > **{tasdiqlanadigan hodisa}** da bu jadvalga yangi qator yozilsin, `users.holat` eskidek ishlasin.
     > `/buyurtmalarim` buyrug'i oxirgi 3 ta qatorni ko'rsatsin. `synchronize: true` qoladi — jadval o'zi yaratiladi.
  3. **Ishga tushirish** — terminal xatosiz; AI kodini o'qing: entity `@Entity('…')` bilanmi, service `@InjectRepository` bilanmi (4-darsdagi kabi). Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — buyurtmani oxirigacha bering, keyin `/buyurtmalarim` → oxirgi buyurtma chiqadi.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - mijoz: Chilonzor, 12-uy
  - bot: Buyurtma tasdiqlandi: Pepperoni · Chilonzor, 12-uy
  - mijoz: /buyurtmalarim
  - bot: 1 · Pepperoni · Chilonzor, 12-uy · 03.10 00:42
- Hammasi bajarilgach (yashil): Ikkinchi jadval ham sizniki. Bot qayta ishga tushsa ham, buyurtmalar turadi.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-07-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 5-ekran «to'liq botni yig'ing» (vazifaga qism tanlash, nishon assembleMaster) → haqiqiy baza ishi. Eski 12-ekran «serverdagi bot tunda» chatidagi «buyurtma bazaga yozildi» shu yerda.

## 3 · 1-savol ✅ (jonli ball)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega serverda BOT_TOKEN alohida sozlanadi?**
  - ✔ Token yozilgan fayl serverga kod bilan bormaydi
  - Serverda Telegram botga boshqa token beradi
  - Token faqat bir kun ishlaydi, keyin almashadi
  - Laptopdagi token serverda ishlamay qoladi
- To'g'ri: To'g'ri! `.env` `.gitignore` da — Git uni serverga yuklamaydi.
- Xato izohlari (≤60):
  - B: Token bitta — uni @BotFather bergan.
  - C: Token /revoke qilinmaguncha ishlayveradi.
  - D: Token istalgan kompyuterda ishlaydi — fayl bormaydi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 8-ekran (2-savol), kalit o'rni (A) o'zgarmadi, izohlar qisqardi.

## 4 · Tushuncha 2 — polling va webhook
- Eyebrow: Tushuncha · xabar yo'li
- Sarlavha: **Serverdagi bot yangi xabarni qanday oladi?**
- Mentor: Laptopda bot o'zi so'rab turardi, bepul server esa jim turganda uxlaydi — ikkala yo'lni bosib, farqini ko'ring.
- Ikki tugma (navbat bilan, ko'rilgani ✓): ▶ Polling — laptopda · ▶ Webhook — serverda
- Bitta vizual — oqim-sahna (bosilgan yo'l chiziladi, 1-dars «xabar yo'li» sahnasi qayta ishlatiladi):
  - **Polling:** bot → Telegram «Yangi xabar bormi?» → «Yo'q» → yana so'raydi → «Ha: Salom!» → bot javob beradi. Yozuv: bot so'raydi — `bot.launch()`.
  - **Webhook:** Telegram → `https://avtopizza.onrender.com/telegram` «Salom!» → server uyg'onadi → bot javob beradi. Yozuv: Telegram yuboradi — ochiq manzil kerak.
- Ikkalasi ko'rilgach (yashil): Laptopda polling — manzil yo'q. Serverda webhook — manzil bor, uxlagan server xabar kelganda uyg'onadi.
- Tugmalar: Orqaga · Ikkalasini ko'ring (N/2) → Davom etish

✎ Eski 9-ekran (markaziy #3, nishon linkMaster, savol «qaysi soddaroq → polling») → tushuncha; savol olindi, chunki yangi o'q «har biri o'z joyida». Sahna 1-darsdagi xabar-yo'li (DE-167).

## A2 · Amaliyot 2 — serverga tayyorlash  `(≈25 daq)`
- Eyebrow: Amaliyot 2 · GitHub
- Sarlavha: **Botni serverga tayyorlang va GitHub'ga yuboring.**
- Mentor: Serverda webhook, laptopda polling — ikkalasini bitta shart hal qiladi; <b>«1 · Ochish»</b>dan boshlang.
- Qadamlar:
  1. **Ochish** — `telegram.service.ts` ochiq, `npm run start:dev` ishlayapti.
  2. **Prompt** — o'zgartirmasdan «Nusxalash», Antigravity'ga:
     > `config` ga `WEBHOOK_URL` qo'sh: `process.env.WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || ''`.
     > `TelegramService` da: `WEBHOOK_URL` bo'sh bo'lsa — hozirgidek `bot.launch()` (polling); bo'lsa — `bot.telegram.setWebhook(WEBHOOK_URL + '/telegram')` va konsolga «Telegram bot ulandi (webhook)».
     > `POST /telegram` controller yarat: kelgan body'ni `bot.handleUpdate` ga beradi.
     > `bot.catch` qo'sh: xato bo'lsa mijozga «Uzr, birozdan keyin qayta yozing» deb javob bersin, xatoni konsolga yozsin.
  3. **Ishga tushirish** — laptopda `WEBHOOK_URL` yo'q → terminalda hali ham «Telegram bot ulandi» (polling). Telegramda /start — ishlaydi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **GitHub'ga yuborish** — terminalda:
     ```
     git add -A
     git commit -m "7-dars: serverga tayyor"
     git push
     ```
     GitHub'dagi repo'ngizda yangi commit ko'rinadi.
- O'ng tomon — «Kutilgan natija»: bu safar chat emas, **terminal** (bitta vizual):
  ```
  Telegram bot ulandi
  …
  [main 3f2a9c1] 7-dars: serverga tayyor
   4 files changed
  To https://github.com/{siz}/TelegramBotNest.git
  ```
- Hammasi bajarilgach (yashil): Kod GitHub'da. Server uni shu yerdan oladi.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-07-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 13-ekran «ikki qoida» (`bot.catch`) → promptning oxirgi qatori. Eski 11-ekran «joylashdan oldin tekshiruv» → 3-qadam (laptopda ishladimi). Eski 16-ekran amaliyoti (hosting'ni Gemini'dan so'rash, deploy rejasi) → A3 da haqiqiy deploy.

## 5 · 2-savol ✅ (jonli ball)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Polling va webhook — asosiy farqi nima?**
  - Polling faqat kompyuterda, webhook faqat telefonda ishlaydi
  - Polling matnli xabar uchun, webhook rasm va fayl uchun
  - Webhook faqat kechasi, polling esa kunduzi ishlaydi
  - ✔ Polling'da bot so'raydi, webhook'da Telegram o'zi yuboradi
- To'g'ri: To'g'ri! Farq — xabarni kim boshlab uzatadi: bot yoki Telegram.
- Xato izohlari (≤60):
  - A: Ikkala usul ham serverda ishlaydi — farq qurilmada emas.
  - B: Ikkala usul ham har qanday xabarni yetkazadi.
  - C: Ikkalasi ham istalgan vaqtda ishlaydi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 10-ekran (3-savol), kalit o'rni (D) o'zgarmadi.

## A3 · Amaliyot 3 — deploy  `(≈15 daq + kutish)`
- Eyebrow: Amaliyot 3 · Render
- Sarlavha: **Botni serverga joylang, laptopni yoping.**
- Mentor: Render kodni GitHub'dan oladi, siz faqat uchta sirni yozasiz — <b>«1 · Server ochish»</b>dan boshlang.
- Qadamlar:
  1. **Server ochish** — render.com → «Sign in with GitHub» → «New → Web Service» → o'z `TelegramBotNest` repo'ngizni tanlang. Render `Dockerfile`ni o'zi ko'radi, tarif **Free**.
  2. **Sirlar** — «Environment» bo'limiga uchta qator: `BOT_TOKEN` (BotFather), `DATABASE_URL` (Neon, 4-dars), `GEMINI_API_KEY` (6-dars). Qiymatlarni `.env` dan ko'chiring. Chatga, skrinshotga yozmang.
  3. **Deploy** — «Deploy Web Service». Loglarda 2–4 daqiqada: «Server …-portda ishlayapti» va «Telegram bot ulandi (webhook)». Xato bo'lsa: log matnini Antigravity'ga: «Render logida shu xato: {xato}. Sabab nima?»
  4. **Laptopsiz tekshirish** — laptopdagi botni to'xtating (terminalda Ctrl+C — bitta token ikki joyda ishlamaydi). Telefondan `/start`, `/menu`, bitta buyurtma. Birinchi javob 30–60 soniya kechikishi mumkin — server uyg'onyapti.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza · 03:00 · laptop yopiq)»:
  - mijoz: /start
  - bot (… 40 s): Yana salom, Aziz! AvtoPizza'ga xush kelibsiz! · tugmalar: 🍕 Menyu · 📦 Buyurtma
  - mijoz: Achchiq bo'lmagani qaysi?
  - bot: Margarita achchiq emas: pomidor sousi va pishloq. Tanlaysizmi? (AI)
- Hammasi bajarilgach (yashil): Botingiz serverda. Laptop yopiq — javob keladi.
- Pastki qator: Bepul server 15 daqiqa jimlikdan keyin uxlaydi, xabar kelganda uyg'onadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 12-ekran «tunda suhbat» chati — kutilgan natija. Eski 15-final «deploy tartibi» — o'quvchi uni A1–A3 da o'zi bosib o'tdi (arena 10-savolda qoladi).

## 6 · Natijalar (podium) — o'zgarmaydi
- 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).

## 7 · Yakun — kartochkalar va keyingi dars
- Eyebrow: Tayyor
- Belgi: ✓ Bot serverda
- Sarlavha: **Laptop yopiq — bot javob beradi.**
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CodeStrike (jonli darsda: Mentorni kuting)
- Kartochkalar (12):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq botning to'rt qismi qaysilar? | Token, handlerlar, baza, AI | Har qism o'z ishini qiladi |
| Bot dasturi laptopda bo'lsa, laptop yopilganda nima bo'ladi? | Bot javob bermaydi | Xabar Telegram'da kutib turadi |
| Internetga ulangan, to'xtamay ishlaydigan ijara kompyuter? | Server | Botlar uchun hosting'dan olinadi |
| Kodni serverga joylab, u yerda ishga tushirish nima deyiladi? | Deploy | Bizda: GitHub → Render |
| Kod serverga qaysi yo'l bilan boradi? | GitHub orqali | Render o'z repo'ngizdan oladi |
| `.env` nega serverga bormaydi? | U `.gitignore` da | Sirlar «Environment» ga yoziladi |
| Serverga qaysi uch sir yoziladi? | BOT_TOKEN, DATABASE_URL, GEMINI_API_KEY | Qiymatlar `.env` dan, chatga emas |
| Bot «yangi xabar bormi?» deb so'rasa — usul? | Polling | Laptopda: `bot.launch()` |
| Telegram xabarni bot manziliga o'zi yuborsa — usul? | Webhook | Serverda: `/telegram` manzili |
| Bepul server jim turganda nima bo'ladi? | Uxlaydi | Webhook xabari kelganda uyg'onadi |
| Bitta tokenni laptop va serverda birga ishlatsa? | Ishlamaydi | Serverga joylagach laptopdagini to'xtating |
| AI yoki baza javob bermasa bot jim qolmasligi uchun? | `bot.catch` | Mijozga «birozdan keyin yozing» |

- Keyingi dars — «Botingizni ishlatgan odamdan nimani so'raysiz?». Botingiz endi tunda ham ishlaydi — keyingi darsda uni sinab ko'rgan odamdan nima qilganini so'rashni o'rganasiz.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

✎ Eski 18 + 19 bitta ekran; «Endi siz bilasiz» va uyga vazifa olindi (bot serverda, 9-dars shu bot ustida). Kartochkalardan 4 ta yangi (GitHub yo'li, uch sir, uxlash, bitta token).

---

## Nishonlar (3)
- Safe Deploy — Tokenni serverga kodga yozmasdan yetkazdingiz (3-ekran, 1-savol)
- Message Catcher — Polling va webhook farqini topdingiz (5-ekran, 2-savol)
- Launch Ready — Botni serverga joylab, laptopsiz sinadingiz (A3 oxirgi «Bajardim») — bonus
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

✎ Eski 4 nishondan Bot Builder (5-ekran yig'ish) olindi — ekrani yo'q, nomi 5-darsda ishlatilgan.

## Qisqa takrorlash oynalari (2)
1. 1-savol (3-ekran) — «Sirlar serverga qanday boradi»
   - 1 · Kod GitHub orqali — Server kodni sizning repo'ngizdan oladi.
   - 2 · `.env` qoladi — U `.gitignore` da, Git uni yuklamaydi.
   - 3 · Sirlar sozlamada — «Environment» bo'limiga yoziladi, kod `config` dan o'qiydi.
   - Sinfga savol: Nega serverda BOT_TOKEN alohida sozlanadi?
2. 2-savol (5-ekran) — «Kim boshlab uzatadi»
   - `bot.launch()` · Polling — Bot Telegram'dan qayta-qayta so'raydi. Laptopda shunday.
   - `setWebhook(url)` · Webhook — Telegram xabarni bot manziliga o'zi yuboradi. Serverda shunday.
   - 3 · Nega serverda webhook — Bepul server uxlaydi; webhook xabari uni uyg'otadi.
   - Sinfga savol: Polling va webhook — asosiy farqi nima?

## Jonli viktorina (arena, 12 savol)
`QUIZ_BANK` qoladi, ikki savol darsga moslanadi (o'rni o'zgarmaydi):
- 9-savol «Kichik bot uchun qaysi usul soddaroq? ✔ Polling» → «Laptopda bot qaysi usulda ishlaydi? ✔ Polling».
- 6-savol «Serverda BOT_TOKEN qayerga yoziladi?» — o'zgarmaydi («server sozlamalariga»).

---

## KOD — razrabotkada o'zgargan narsalar (03.10, F-1002-109 — bajarildi)
1. `SCREEN_META` 20 → 11, `INLINE_KEYS` `{ s3: 0, s5: 3 }`, RECAPS indeks 4 va 7, nishon 4 → 3 (`launchReady` = a3 bonus).
2. `ScreenBlok` + `PromptBox` 5-darsdan ko'chirildi; A2 o'ng tomoni `Term` (`term` prop), 4-qadamda uch git buyrug'i ham kichik terminalda (`code` prop). ⚙ 7-darsda chat tugmalari `TgBtns` (bu faylda `Bubble` ning `inline` prop'i yo'q).
3. 2-ekran: `DeployMap3` (eski `dpl` kartalari + fayl ro'yxati, `.env` chizilgan, Environment uch kalit); 4-ekran: ⚙ 1-dars xabar-yo'li emas, shu darsning o'z `Exchange` sahnasi (polling 4 qator, webhook 2 qator: Telegram → manzil, server → bot «uyg'ondi») — bor komponent, 163.3.
4. Eski Screen3…15, DragDropOrder, final, uyga vazifa olindi; `Flashcards` summary ichida. ⚙ Yakunda «Keyingi dars» qatori qo'shildi — eski kodda yo'q edi (YAKUNIY MD da bor edi).
5. `QUIZ_BANK` 9-savol matni.
6. ru — uz bilan birga.

## B. Bu darsdan tashqariga chiqadigan narsalar
- **3-dars amaliyoti:** «clone» → «fork, keyin clone» (o'z GitHub nusxasi — 7-darsda deploy uchun). README 1-qadam ham shunga o'zgaradi.
- **Repo:** `config.WEBHOOK_URL`, `POST /telegram`, `bot.catch` — `dars-07-done` tegida (A2 natijasi); `Buyurtma` entity — A1 natijasi. `dars-07-start` = `dars-06-done`.
- **6-dars** (`dars-06-done`): Gemini javob + system prompt — 6-dars amaliyot ekrani repo'ga o'tganda yoziladi.
- **9-dars:** laptopda tuzatish (polling webhook'ni o'chiradi) → push → Render qayta deploy qiladi va webhook'ni o'zi tiklaydi. 9-dars MD shu yo'lni aytadi.
- **Hosting halolligi:** Render shartlari o'zgarsa (uxlash vaqti, tarif) — 2-ekran va A3 matni yangilanadi; manba jurnalda.
