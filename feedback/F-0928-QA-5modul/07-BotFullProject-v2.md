# 5-Modul (LMS: 7-Modul) · 7-dars «Loyiha kuni: bot + DB + AI» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotFullProjectLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `07-BotFullProject-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:2 · s8:0 · s10:3 · s14:1 · s15` tartib; nishon ekranlari (ballsiz — to'g'ri variant o'rni aralash, 4-savol A; nishon sharti variant matni bo'yicha): s5 `1·1·2`, s7 `env` (2-o'rin), s9 `polling` (2-o'rin), s11 `to'g'ri·xato·to'g'ri`; arena `1·3·0·2·1·0·3·1·2·3·0·2`) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (U1–U3, A8 — to'g'ri javob izohi bitta gap) · 29.09 v2-qoralama · **30.09: ChatGPT matn auditi (F-0930-99) filtrlandi** — hukmlar `JURNAL.md` · qaror sahifasi javoblari: 6-savol A (hosting nomsiz; emoji qisqartiriladi — A4), 4-savol A, 19-savol A (6-dars nomlari: AI, system prompt, AI API kaliti).

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Quyida faqat shu darsga xos qo'shimchalar.

**A-7.1. Yangi atamalar (A1 qoidasi bilan: asosiy nom — haqiqiy atama, o'xshatish ko'pi bilan bir marta).**

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| to'liq Botjon — 4 buyum | **to'liq bot — to'rt qism:** token · handlerlar · baza · AI | 2-ekran |
| 📓 daftar (DB) | **baza (PostgreSQL)** | «4-darsda qo'shgansiz» |
| 🧭 maslahatchi | **AI** | «handlerda tayyor javobi yo'q erkin savolga javob yozadi» (6-dars v2 nomi bilan tekshiriladi — B-5) |
| 📋 qoidalar varag'i · varaq | **handlerlar** | — (1-dars) |
| 🔑 kalit | **token** | — (1-dars) |
| 🏠 doimiy joy | **server** | «internetga ulangan, to'xtamay ishlashga mo'ljallangan kompyuter; hosting xizmatidan ijaraga olinadi» (6-ekran) |
| ko'chirish · ko'chirmoq | **deploy** · «serverga joylash» (fe'l) | «kodni serverga joylab, u yerda ishga tushirish» (6-ekran) |
| 💻 laptop — vaqtinchalik joy · «kompyuter» (laptop ma'nosida) | **laptop** (o'quvchining kompyuteri) | — |
| qulfli tortma (.env) | **.env fayli** (A1) · serverda — **server sozlamalari** | «hosting xizmatlarida bu bo'lim odatda Environment yoki Variables deb ataladi» (7-ekran) |
| o'zi-so'rab-turish · qo'ng'iroq | **polling · webhook** | 1-dars v2 11-ekran ta'rifi so'zma-so'z (9-ekran) |
| yiqilmaslik qoidasi · yiqilmaslik qatori · oxirgi qator (fallback) — «xato bo'lsa» ma'nosida | **xatoni ushlash** (`bot.catch`) | «kod xato berganda ishlaydi; fallback handler emas» (13-ekran) |
| lokal test | **laptopda sinash** | — |
| 24/7 jonli · doim jonli · doim yoqilgan · hech qachon o'chmaydi | «laptop yopiq bo'lsa ham ishlaydi» · «to'xtamay ishlashga mo'ljallangan» | A3 |
| jihozlar paneli | olib tashlanadi | B-1 |

**A-7.2. Fallback handler — faqat 1-dars ma'nosida** (mos handler topilmasa ishlaydigan oxirgi handler). Kod xato berganda ishlaydigan narsa — boshqa tushuncha, «xatoni ushlash».

**A-7.3. Telegram'da bot sarlavhasida faqat «bot» yoziladi** — onlayn/oflayn holati ko'rinmaydi. Laptop va server holati — kartadagi rangli CSS nuqta va matn («ishlayapti» / «to'xtadi»).

**A-7.4. Server ham to'xtashi mumkin** (13-ekran «kuzatib turing»). Shuning uchun «hech qachon o'chmaydi», «yagona yo'li» kabi gaplar yo'q.

**A-7.5. Hosting xizmati nomi yo'q** — kurs qaysi xizmatdan foydalanishi hali aniq emas (Agent eslatmalari, 1-band). Dars joylashni tayyorlaydi va rejalaydi; joylashning o'zi — Mentor bilan tanlangan xizmatda.

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza boti (1-darsdan) — endi to'liq: token, handlerlar, baza va AI. Amaliyotda — o'quvchining o'z boti.
- **Hook:** kechqurun laptop yopildi → 02:14 da mijoz yozdi → javob kelmadi → nega?
- **Asosiy model (dars bo'yi bitta):** bot dasturi qaysi kompyuterda ishlasa, javob o'sha kompyuterdan ketadi. Laptop yopilsa — dastur to'xtaydi; server to'xtamay ishlashga mo'ljallangan. Deploy — kodni serverga joylab, u yerda ishga tushirish. `.env` serverga kod bilan bormaydi → token serverda alohida sozlanadi.
- **Oldingi bilimga ko'prik:** 1-dars (token, `.env`, `.gitignore`, fallback handler, polling/webhook — «webhook'ni 7-darsda, botni serverga joylaganda yana ko'rasiz») · 4-dars (baza, PostgreSQL, holat) · 5-dars (`bot.launch()` polling bilan ishlaydi, «hosting kerak») · 6-dars (AI, AI API kaliti `.env` da).
- **Tajribalar:** tunda javob yo'q (0) · xabar yo'li: laptop yoniq/yopiq (3) · to'liq botni yig'ish (5) · laptopni yopish: laptop va server (6) · serverda token (7) · polling/webhook (9) · joylashdan oldin tekshiruv (11) · serverdagi bot bilan tungi suhbat (12) · deploy tartibi (15) · o'z botini joylashga tayyorlash (16).
- **Keyingi dars (App.jsx m5-08):** PM — «Botingizni ishlatgan odamdan nimani so'raysiz?».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — laptop yopildi | hook | tugmani bosadi, nega bot javob bermaganini tanlaydi | — |
| 1 | Reja | qoida | laptop → server chizmasi + 4 qadam | — |
| 2 | To'liq bot — to'rt qism | tushuncha | token / handlerlar / baza / AI kartalarini ochadi | — |
| 3 | Bot qayerda ishlaydi | tushuncha | laptop yoniq va yopiq holatda xabar yuboradi | — |
| 4 | 1-savol | test | buyurtmani ertasi kungacha qaysi qism saqlaydi | ✅ |
| 5 | To'liq botni yig'ing | markaziy #1 | 3 vazifaga mos qismni ulaydi | 🏅 |
| 6 | Laptop va server | tushuncha | laptopni yopadi, ikki botni solishtiradi | — |
| 7 | Token serverda | markaziy #2 | botni serverda ishga tushiradi → token qayerga yozilishini tanlaydi | 🏅 |
| 8 | 2-savol | test | nega serverda token alohida sozlanadi | ✅ |
| 9 | Polling va webhook | markaziy #3 | ikki usulni ko'radi → kichik bot uchun birini tanlaydi | 🏅 |
| 10 | 3-savol | test | polling va webhook farqi | ✅ |
| 11 | Joylashdan oldin tekshiruv | markaziy #4 | 3 bandni «To'g'ri / Xato» deb belgilaydi | 🏅 |
| 12 | Serverdagi bot tunda | hayotiy | 03:00 dagi suhbatni qadam-baqadam ochadi | — |
| 13 | Yana ikki qoida | tushuncha | xatoni ushlash va kuzatish, «Tushundim» | — |
| 14 | 4-savol | test | laptop yopiq, bot nega javob beryapti | ✅ |
| 15 | Deploy tartibi | yakuniy | 5 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · server | praktika | o'z botini serverga joylashga tayyorlaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — laptop yopildi  `[736]`
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Kechqurun laptopni yopdingiz. Soat 02:14 da botingizga mijoz yozdi.**
- Mentor: Botingizda hammasi bor: token, handlerlar, baza va AI. Kunduzi u yaxshi ishladi. Tugmani bosing va tunda nima bo'lishini ko'ring.
- Chat (AvtoPizza · bot): mijoz «02:14 — Salom! Hozir buyurtma bersam bo'ladimi?»
- Tugma: ▶ Nima bo'lishini ko'rish → ✓ Ko'rdingiz
- Bosilgach chatda: mijoz «02:21 — Hali ham javob yo'q…»
- Savol: **Nega bot javob bermadi?**
  - Bot kodida kechasi kutilmagan xato chiqdi
  - Bot dasturi laptop bilan birga to'xtadi
  - Telegram tunda botlarga xabar yetkazmaydi
- Javob — 2-variant: **Aynan!** Bot dasturi laptopingizda ishlardi — laptop yopilganda u ham to'xtadi. Bugun botni serverga joylaymiz: u laptop yopiq bo'lsa ham ishlaydi.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Kunduzi kod yaxshi ishlagan, Telegram esa tunda ham xabar yetkazadi. Sabab boshqa: bot dasturi laptopingizda ishlardi va laptop yopilganda to'xtadi. Bugun botni serverga joylaymiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, chat (faqat birinchi xabar) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi).
Tugma bosilgach: chatda vaqt o'tadi (02:14 → 02:21), ikkinchi xabar chiqadi, javob yo'q → shundan keyin savol va 3 variant → tanlangach javob izohi.
Animatsiya: yo'q.
Olib tashlanadi: chat sarlavhasidagi «bot · oflayn ⚫» (A-7.3) · «💻 Laptop yopiq — Botjon oflayn» qatori (javobni savoldan oldin aytib qo'yardi) · Mentordagi «u sizning laptopingizda yashardi» (javobni oldindan aytardi).

✎ Botjon → bot · «🔑 kalit, 📋 varaq, 📓 daftar, 🧭 maslahatchi» → «token, handlerlar, baza va AI» · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · «u 24/7 uxlamasin» → «laptop yopiq bo'lsa ham ishlaydi» (A3) · variantlardagi tire faqat to'g'ri javobda edi → olindi, uzunlik tenglashtirildi · savol tugmadan keyin chiqadi (**KOD**) · 😕 olindi

## 1 · Reja  `[778]`
- Eyebrow: Reja
- Sarlavha: **Bugun botingizni serverga joylaysiz.**
- Mentor: Yangi kod kam bo'ladi. Oldingi darslarda qo'shgan qismlarni bitta botga yig'asiz, keyin uni laptop yopiq bo'lsa ham ishlaydigan kompyuterga joylaysiz.
- Chizma: [Laptop · bot.js — hozir shu yerda] → deploy → [Server · bot.js — dars oxirida]
- Bugungi 4 qadam:
  1. To'liq bot: token, handlerlar, baza va AI
  2. Bot qayerda ishlaydi: laptop va server
  3. Serverda token va xabar olish usuli
  4. Serverga joylashdan oldingi tekshiruv
- Tugmalar: 4 qadamni ko'rish / ↩ Chizmani ko'rish (telefonda) · Orqaga · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → chizma chiziladi → shundan keyin 4 qadam birma-bir chiqadi.
Animatsiya: HA — `bot.js` qutisi laptopda → «deploy» strelkasi chiziladi → serverdagi `bot.js` qutisi yonadi (~1 s; darsning yo'nalishini ko'rsatadi).
Olib tashlanadi: natija-chat (03:00 suhbati 12-ekranda to'liq bor) · «Kalit, varaq, daftar, maslahatchi — birga ishlayapti, doimiy joyda 24/7…» kartasi · «Jihozlar paneli» va «Yangi jihoz yondi: 🏠 Doimiy joy» (qaror F-0929-63 — B-1).

✎ 30.09: qadam yorliqlari («yig'ish · server · sozlash · deploy») olindi, o'ngdagi qadamlar bosilmaydigan ro'yxat (U1) · ChatGPT #3 (jihozlar paneli) — 29.09 da olingan · 🔴 FAKT: 4-qadam «Ko'chirish: sina → sozla → ko'chir → 24/7 jonli» final (15) javobining 2–5 o'rnini oldindan ochib qo'yardi → «Serverga joylashdan oldingi tekshiruv» · «Bo'laklardan — doim yashaydigan Botjon» → yangi sarlavha · «doimiy joy» → «server», «ko'chirish» → «serverga joylash / deploy» (A-7.1) · Mentor sarlavhani takrorlamaydi

## 2 · To'liq bot — to'rt qism  `[819]` (kartalar `[728]`)
- Eyebrow: Yig'ish · to'liq bot
- Sarlavha: **To'liq botda to'rt qism birga ishlaydi.**
- Mentor: Bu to'rt qismni oldingi darslarda qo'shgansiz. Har birini bosing va u botda nima qilishini eslang.
- Kartalar (bosilgani ✓ bilan belgilanadi):
  - **Token** — Botni Telegram Bot API'ga tanitadigan maxfiy qator. U `.env` faylida turadi, kodda faqat `process.env.BOT_TOKEN` yoziladi.
  - **Handlerlar** — /start, «Menyu» tugmasi, buyurtma bosqichlari: aniq hodisaga tayyor javob. Hech biri mos kelmasa, fallback handler javob beradi.
  - **Baza (PostgreSQL)** — Buyurtma, mijoz va holat shu yerda saqlanadi. Ma'lumot diskda turadi — bot qayta ishga tushsa ham yo'qolmaydi.
  - **AI** — Handlerda tayyor javobi yo'q erkin savolga javob yozadi: siz yozgan system prompt'ga qarab, AI API kaliti bilan.
- Tugma: 4 qismni ko'ring (N/4) → Davom etish

**Ko'rinish:** hozirgidek — 4 tugma; bosilgani bitta kartada ochiladi (bir vaqtda bittasi).
Animatsiya: yo'q.
Olib tashlanadi: 4/4 dan keyingi «To'liq Botjon tayyor: oddiy buyruqqa 📋 varaq, erkin savolga 🧭 maslahatchi…» ramkasi (kartalarni qaytaradi).

✎ 30.09: AI kartasi — «yo'riqnoma (system prompt)» → «system prompt» (6-dars v2 nomi, 19-savol A: bir tushuncha — bir nom) va bitta gap (ChatGPT #5: bu darsda AI — faqat bitta qism) · ChatGPT #4 (token / handlerlar / baza / AI) — 29.09 da · «Har dars sizga bitta buyum berdi» → «Bu to'rt qismni oldingi darslarda qo'shgansiz» (har dars buyum bermagan: PM darslari, 3-dars tugmalar) · kalit/varaq/daftar/maslahatchi → token/handlerlar/baza/AI · «Usiz Botjon Telegram bilan gaplasha olmaydi» → Bot API'ga tanitadi (1-dars v2 ta'rifi) · «qulfli tortma» → `.env` · handler kartasiga fallback handler (1-dars ma'nosida, A-7.2) · 🔑 📋 📓 🧭 olindi

## 3 · Bot qayerda ishlaydi  `[851]`
- Eyebrow: Tushuncha · bot qayerda ishlaydi
- Sarlavha: **Bot Telegram ichida emas. Unda javobni kim yozadi?**
- Mentor: 1-darsda ko'rgansiz: bot dasturi ishlab tursagina javob beradi. Endi bu dastur qayerda ishlashini ko'ramiz. Ikkala holatda xabar yuborib ko'ring.
- Chap: **Laptop yoniq** · tugma ▶ Xabar yuborish → ✓ Ko'rdingiz
  - Yo'l: Mijoz → Telegram → bot.js (laptopda) → Telegram → Mijoz
  - Chat (AvtoPizza · bot): mijoz «Salom!» → bot «Salom! Menyuni ko'rasizmi?»
- O'ng: **Laptop yopiq** · tugma ▶ Xabar yuborish → ✓ Ko'rdingiz
  - Yo'l: Mijoz → Telegram → … (bot.js ishlamayapti)
  - Chat (AvtoPizza · bot): mijoz «Salom!» · javob yo'q
- Xulosa (2/2 dan keyin): Xabarni Telegram qabul qiladi, javobni esa bot.js yozadi — u laptopingizda ishlaydi. Laptop yopiq bo'lsa, xabar Telegram'da kutib turadi va javob faqat dastur qayta ishga tushganda ketadi — ehtimol, ertalab.
- Tugma: Ikkalasini sinang (N/2) → Davom etish

**Ko'rinish:** avval faqat «Laptop yoniq» tugmasi; ko'rilgach u «✓ Laptop yoniq» qatoriga yig'iladi va «Laptop yopiq» chiqadi (**KOD:** hozir ikkalasi birdan). Xulosa 2/2 dan keyin.
Animatsiya: HA — xabar yo'li strelkasi chiziladi: yoniq holatda Mijoz → Telegram → bot.js → Telegram → Mijoz (aylana yopiladi); yopiq holatda strelka Telegram'da to'xtaydi, bot.js ga chiziq chizilmaydi (~1 s). Farqning o'zi — javob qaytadimi, yo'qmi.
Olib tashlanadi: «🏠 doimiy joy — doim yoqilgan» ustuni (server 6-ekranda) · «Ha, men 24/7 shu yerdaman 🟢» · «doimiy joy esa hech qachon o'chmaydi».

✎ Ekran ma'nosi o'zgardi: eski 3-ekran (laptop yoki doimiy joy — tunda) 0 va 6-ekran bilan bir gapni aytardi → endi xabar yo'lini ko'rsatadi: Telegram faqat yetkazadi, javobni laptopdagi dastur yozadi (14-savolning «Telegram botni yuritadi» xato variantiga tayyorlaydi). Mexanika o'sha: 2 tugma + 2 chat · 🔴 FAKT: «doimiy joy hech qachon o'chmaydi» — 13-ekrandagi «to'xtab qolsa, qayta yoqasiz» gapiga zid, server ham to'xtashi mumkin (A-7.4) · «oflayn ⚫ / onlayn 🟢» olindi (A-7.3) · 1-darsga ko'prik qo'shildi

## 4 · 1-savol ✅  `[881]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz buyurtmasini ertasi kungacha qaysi qism saqlaydi?**
  - AI — suhbatni o'zi eslab, ertaga davom ettiradi
  - Token — har bir mijozni tanib, eslab turadi
  - ✔ Baza (PostgreSQL) — ma'lumotni diskda saqlab qoladi
  - Hech qaysi — bot ertasi kunga hech narsani eslamaydi
- To'g'ri: Buyurtmani ertasi kungacha baza saqlaydi — ma'lumot diskda turadi.
- Xato izohlari:
  - AI suhbatni o'zi eslab qolmaydi — buni 6-darsda ko'rgansiz. Saqlash — baza ishi.
  - Token botni Telegram'ga tanitadi, mijozlarni esa eslamaydi. Saqlash — baza ishi.
  - Aksincha: baza bilan bot eslab qoladi. Bazani 4-darsda aynan shuning uchun qo'shgansiz.
  - (umumiy) Buyurtmani ertasi kungacha baza (PostgreSQL) saqlaydi.

**Test ekranlarining umumiy yozuvlari (4, 8, 10, 14):** ✓ To'g'ri javob: X — … · To'g'ri · Qaytadan urinib ko'ring · Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · Mentor hali bu sahifaga o'tmadi (📖 ⚡ 📨 olinadi).

✎ 🔴 FAKT: «Aynan shuning uchun o'tgan darsda daftar qo'shdik» — baza 4-darsda («Stateful logika + PostgreSQL») qo'shilgan, o'tgan dars — 6 «Bot ichida AI» → «Bazani 4-darsda … qo'shgansiz» · «Maslahatchi — chunki u aqlli» / «Qoidalar varag'i — chunki u ekranda ko'rinib turadi» → har variant eslab qolish haqida ishonarli, lekin xato da'vo (test halolligi) · 2-variant «varaq» → «Token» (5-ekrandagi 3-vazifa bilan birga — 5-ekran ✎) · variant uzunliklari tenglashtirildi · emoji olindi

## 5 · To'liq botni yig'ing 🏅  `[906]` (variantlar `[901]`)
- Eyebrow: Markaziy · #1
- Sarlavha: **To'liq botni o'zingiz yig'ing.**
- Mentor: Har vazifaga uni bajaradigan qismni tanlang.
- Vazifalar (har birida 3 variant, tanlangani ✓ yoki ✕ oladi; ballsiz — to'g'ri variant o'rni aralash, 4-savol A):
  - **/start va «Menyu» tugmasiga tayyor javob** — AI — har safar javobni qaytadan yozadi · ✔ Handler — hodisaga oldindan yozilgan javob · Baza — ma'lumotni saqlaydi, javob yubormaydi
  - **Menyuda yo'q erkin savol: «Achchiq bo'lmagani qaysi?»** — Handler — faqat oldindan yozilgan javob · ✔ AI — savolga qarab javob yozadi · Token — faqat botni Telegram'ga tanitadi
  - **Telegram'ga «bu bot meniki» deb isbotlash** — AI — o'zini bot egasi deb tanishtiradi · Handler — /start da egasining ismini aytadi · ✔ Token — so'rov sizning botingizdan ekanini tasdiqlaydi
- O'ng panel: Yig'ilayotgan bot · «Tez javob → … · Erkin savol → … · Telegram'ga tanitish → …» (tanlangan qism nomi qo'yiladi)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Bu qism bu vazifani bajarmaydi — boshqasini tanlang.
- Muvaffaqiyat (panel ostida): ✓ Bot yig'ildi. Hozircha u laptopingizda ishlaydi.
- Tugma: Botni yig'ing → Davom etish

**Ko'rinish (KOD — hozir 3 vazifaning 9 varianti birdan):** faqat 1-vazifa va uning 3 varianti ochiq; to'g'ri tanlangach vazifa «✓ Tez javob → Handler» qatoriga yig'iladi (`↻` bilan o'zgartiriladi), panelga yoziladi, keyingi vazifa ochiladi. Xato tanlansa — ✕, izoh joriy vazifa ostida, qayta tanlanadi.
Natija-ramka bitta: panel oxirida yashil bo'lib, muvaffaqiyat qatori chiqadi.
Animatsiya: HA — to'g'ri qism tanlanganda paneldagi «vazifa → qism» qatorida bog'lanish chizig'i chiziladi (vazifa va qism bog'lanadi); xato tanlovda chiziq chizilmaydi.
✎ 01.10 (F-1001-66, razrabotka): chiziq ustunlar orasida emas, panel qatori ichida — telefonda ustunlar ustma-ust turadi, ular orasidagi chiziq ma'nosiz bo'lardi; ma'no («Tez javob → Handler») qatorda saqlanadi.
Olib tashlanadi: Mentordagi «Noto'g'ri buyum ham tanlanishi mumkin — ehtiyot bo'ling» (ortiqcha ogohlantirish) · alohida muvaffaqiyat ramkasi «Zo'r! Har vazifa o'z buyumiga bog'landi: 📋 varaq, 🧭 maslahatchi, 📓 daftar…» (panelni takrorlardi) · «🤖 Botjon» panel sarlavhasi.

✎ 30.09 4-savol A (ChatGPT #8 ham): 1-vazifada to'g'ri variant birinchi turardi → 2-o'rinda (uchala vazifada 2 · 2 · 3); nishon sharti variant matni bo'yicha (**KOD**) · 3-vazifa «Buyurtmani ertaga ham eslab qolish? → Daftar» → «Telegram'ga isbotlash → Token»: eski vazifa 4-savol bilan so'zma-so'z bir xil edi (bitta savol ketma-ket ikki ekranda); ✔ o'rni (2) o'sha · buyum → qism · «/start, menyu» qavsi → vazifa matni · xato yozuvi «✗ belgisini toping» → navbatli ochilishda kerak emas · 🏅 📋 🧭 📓 🔑 🤖 olindi

## 6 · Laptop va server  `[963]`
- Eyebrow: Tushuncha · server
- Sarlavha: **Laptopni yopsak, qaysi bot javob beradi?**
- Mentor: Bir xil bot ikki joyda ishlayapti: laptopingizda va serverda. Laptopni yoping va ikkalasini solishtiring.
- Karta 1: **Laptop** — holat (nuqta + matn): ishlayapti → (yopilgach) to'xtadi — javob yo'q
- Karta 2: **Server** — holat: ishlayapti → (laptop yopilgach ham) ishlayapti — javob berdi
- Tugma: ▶ Laptopni yopish → ✓ Ko'rdingiz
- Izoh (bosilgach): **Server** — internetga ulangan va to'xtamay ishlashga mo'ljallangan kompyuter. U uyingizda turmaydi: botlar uchun uni hosting xizmatidan ijaraga olasiz. Kodni serverga joylab, u yerda ishga tushirish **deploy** deyiladi.
- Tugma: Laptopni yoping → Davom etish

**Ko'rinish:** kirganda — ikki karta (ikkalasida «ishlayapti») va tugma. Bosilgach laptop kartasi xiralashadi va «to'xtadi» bo'ladi, server kartasi o'zgarmaydi; ostida bitta izoh-ramka.
Animatsiya: yo'q (holat almashadi, chizish yo'q; 3-ekrandagi strelka takrorlanmaydi).
Olib tashlanadi: «Laptop o'chdi — undagi Botjon jim. Lekin doimiy joydagi Botjon ishlayveradi. Shuning uchun jiddiy Botjonni doimo doimiy joyga qo'yamiz» ramkasi (kartalar shuni ko'rsatadi; ikki ramka yonma-yon edi) · «qaysi xizmatni tanlashni AI'dan so'rashingiz mumkin» (xizmatni tanlash — 16-ekranda) · 🟢 ⚫ ✅ 💻 🏠.

✎ «Kompyuterni o'chirsak» / «💻 Kompyuterni o'chirish» / Mentor «laptopni o'chiring» aralash edi (server ham kompyuter) → hamma joyda «laptopni yopish» · «Doimiy joy» → «Server», «ko'chirish» → «deploy» (birinchi chiqishi shu yerda) · «24/7 ishlaydi» → «to'xtamay ishlashga mo'ljallangan» (A3, A-7.4) · «Siz uchun muhimi — Botjon doim jonli turishi» olindi

## 7 · Token serverda 🏅  `[1003]` (variantlar `[998]`)
- Eyebrow: Markaziy · #2
- Sarlavha: **Token serverga qanday yetib boradi?**
- Mentor: Kodni GitHub orqali serverga joyladingiz. Tugmani bosing va bot u yerda ishga tushadimi — ko'ring.
- Kod (bot.js · serverda):
  ```js
  const bot = new Telegraf(process.env.BOT_TOKEN)
  bot.launch()
  ```
- Tugma: ▶ Serverda ishga tushirish → ✓ Ko'rdingiz
- Bosilgach (natija): Bot ishga tushmadi: `process.env.BOT_TOKEN` bo'sh. Kod serverga keldi, `.env` esa kelmadi — u `.gitignore` da, Git uni yuklamaydi.
- Savol: **Serverda tokenni qayerga yozasiz?** (bitta urinish)
  - bot.js ichiga — kod bilan birga serverga boradi
  - ✔ Server sozlamalariga — kod uni `process.env` dan o'qiydi
  - `.env` ni ham GitHub'ga yuklaymiz — server o'zi topadi
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- To'g'ri: ✓ Token server sozlamalariga (odatda Environment yoki Variables bo'limi) yoziladi — kod uni `process.env` dan o'qiydi.
- Xato: Bu xavfli: kod yoki `.env` GitHub'ga chiqsa, token hammaga ko'rinadi. To'g'ri yo'l — tokenni server sozlamalariga yozish; kodda faqat `process.env.BOT_TOKEN` qoladi.
- Tugma: Tokenni to'g'ri joylang → Davom etish

**Ko'rinish:** kirganda — kod oynasi va tugma. Savol va variantlar tugmadan keyin chiqadi (hozir savol yorlig'i boshidan ko'rinadi — **KOD**).
Natija-ramka bitta: avval ishga tushirish natijasi; variant tanlangach uning o'rnida to'g'ri/xato yozuvi chiqadi — ikkalasi bir vaqtda turmaydi (**KOD**).
Animatsiya: yo'q.
Olib tashlanadi: «// 🔑 kalit ochiq kodda: const token = "12345:AbC-xizmat-kaliti"» namoyishi (1-dars 6-ekrandagi voqeaning takrori) · «Mijozga chatda yuborib qo'yamiz» varianti (ishonarsiz edi) · ⚠️ 🔑.

✎ 30.09: to'g'ri javob izohi bitta gap (A8); «AI API kalitini ham shu yerga» — 12-ekran xulosasi va 2-oynada bor · ChatGPT #10 (`process.env` xom ko'rinadi) — 29.09 KOD; #11 (git izohsiz) **Qisman**: «Git / GitHub» 1-dars v2 6-ekranda ishlatilgan («token GitHub'ga chiqdi»), bu darsda `.gitignore` mantig'i uchun kerak — qoldi · Ekran markazi o'zgardi: «kalitni kodda ochiq qoldirsak» — 1-darsda to'liq o'tilgan → serverga xos yangi fakt: `.env` `.gitignore` da, shuning uchun serverda token alohida sozlanadi. Mexanika o'sha (namoyish tugmasi → 3 variantli bitta tanlov), ✔ o'rni (2-variant, `env`) o'sha · 🔴 FAKT: final (15) 3-bo'lagi «Kalitni .env'ga sozla» laptopda sinashdan KEYIN turardi — token esa 1-darsdan beri `.env` da; aslida keyin sozlanadigan narsa — serverdagi token. Bu ekran shuni o'rgatadi · «git'da» / «git'ga tushmaydi» izohsiz edi → «GitHub», «Git uni yuklamaydi» (1-dars v2 6-ekran bilan bir xil) · natija matnidagi `process.env` hozir xom teskari tirnoq bilan ko'rinadi (**KOD:** `fmtCode`) · «qulfli tortma» olindi

## 8 · 2-savol ✅  `[1047]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Nega serverda BOT_TOKEN ni alohida sozlash kerak?**
  - ✔ Token yozilgan fayl serverga kod bilan bormaydi
  - Serverda Telegram botga boshqa token beradi
  - Token faqat bir kun ishlaydi, keyin almashadi
  - Laptopdagi token serverda ishlamay qoladi
- To'g'ri: Token yozilgan `.env` fayli `.gitignore` da — Git uni serverga yuklamaydi.
- Xato izohlari:
  - Token bitta — uni @BotFather bergan. Server uchun Telegram yangi token bermaydi.
  - Token /revoke qilinmaguncha ishlayveradi — har kuni almashmaydi.
  - Token istalgan kompyuterda ishlaydi. Muammo boshqa: u yozilgan `.env` fayli serverga bormaydi.
  - (umumiy) Token yozilgan `.env` fayli kod bilan birga serverga bormaydi.

✎ Savol mavzusi o'zgardi: «Doimiy joy (server) Botjonga nima beradi?» 14-savol bilan bir ma'noni tekshirardi (ikkisi ham «laptop o'chsa ham ishlaydi») → 7-ekrandagi yangi fakt tekshiriladi; ✔ o'rni (0) o'sha · eski variantlar «rangga bo'yaydi», «uy internetini tezlashtiradi» ishonarsiz edi, to'g'ri javob esa tire bilan va eng uzun · to'g'ri variantda `.env` / `.gitignore` atamasi yo'q (atama faqat to'g'rida bo'lmasin) · Q_LABELS va RECAPS[8] shunga moslanadi (**KOD**)

## 9 · Polling va webhook 🏅  `[1071]` (demo `[1067]`)
- Eyebrow: Markaziy · #3
- Sarlavha: **Serverdagi bot yangi xabarni qanday oladi?**
- Mentor: 1-darsda ikki usulni ko'rgansiz. Endi bot serverda — ikkalasini yana bosib ko'ring.
- Tugmalar: Polling · Webhook
- **Polling** — Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?».
  - Demo: bot: Yangi xabar bormi? → Telegram: Yo'q. → bot: Yangi xabar bormi? → Telegram: Ha, bitta: «Salom!» → bot javob beradi
- **Webhook** — Telegram yangi xabarni botning internetdagi manziliga (URL) yuboradi. Buning uchun ochiq manzil kerak.
  - Demo: Telegram → botning manzili: yangi xabar «Salom!» → bot javob beradi
- Savol (ikkalasi ko'rilgach, bitta urinish): **Kichik bot uchun qaysi usulni sozlash soddaroq?** · Webhook · Polling ✔
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- To'g'ri: ✓ Polling qo'shimcha sozlashsiz ishlaydi — 5-darsdagi `bot.launch()` ham shu usulda.
- Webhook tanlansa: Webhook ham ishlaydi, lekin unga serverda ochiq manzil (URL) va qo'shimcha sozlash kerak — sozlash soddaroq yo'l polling.
- Tugma: Ikkalasini sinab ko'ring → Davom etish

**Ko'rinish:** avval «Polling» tugmasi; demo ko'rilgach «✓ Polling» qatoriga yig'iladi (bosib qayta ochiladi) va «Webhook» chiqadi; ikkalasi ko'rilgach savol va 2 variant (**KOD:** hozir ikki tugma birdan; «Tanlov» yorlig'i savolsiz, boshidan ko'rinadi → savol matni bilan almashadi).
Animatsiya: HA — Polling: bot → Telegram strelkasi demodagi har so'rovda qayta chiziladi, oxirgisida xabar qaytadi (F-1001-66: demo 2 so'rov — «uch marta» olindi); Webhook: bot jim turadi, xabar kelganda bitta strelka Telegram → bot chiziladi. Farqning o'zi — strelka yo'nalishi va soni.
Olib tashlanadi: Mentordagi «kichik do'kon boti uchun qaysi soddaroq ekanini tanlang» (savol endi tanlov ustida) · 🔁 🔔 · «darhol javob beraman».

✎ 30.09 ChatGPT #13 **Qisman**: «foydalanuvchi ko'paysa — webhook'ga o'tasiz» qoidasi 29.09 da olingan; savol endi «qaysi usulni sozlash soddaroq?» — to'g'ri javob sozlash haqida, qaysi biri «yaxshiroq» haqida emas · to'g'ri variant ikkinchi o'ringa (4-savol A) · to'g'ri javob izohi bitta gap (A8) · «O'zi-so'rab-turish / Qo'ng'iroq» → «Polling / Webhook», ta'rif 1-dars v2 11-ekran bilan so'zma-so'z · «qo'ng'iroq» metaforasi olindi · «Qo'ng'iroq (webhook) tezroq» → olindi (polling ham xabarni tez oladi; farq — kim boshlaydi va ochiq manzil kerakmi) · «Foydalanuvchi ko'paysa, qo'ng'iroqqa o'tasiz» → «Bot kattalashsa, webhook'ni sozlash mumkin» (A3) · 5-darsga ko'prik: `bot.launch()` (5-dars 13-ekran: «bot kompyuteringizda ishlaydi (polling)»)

## 10 · 3-savol ✅  `[1117]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Polling va webhook — asosiy farqi nima?**
  - Polling faqat kompyuterda, webhook faqat telefonda ishlaydi
  - Polling matnli xabar uchun, webhook rasm va fayl uchun
  - Webhook faqat kechasi, polling esa kunduzi ishlaydi
  - ✔ Polling'da bot so'raydi, webhook'da Telegram o'zi yuboradi
- To'g'ri: Polling'da bot so'raydi, webhook'da Telegram xabarni botning manziliga o'zi yuboradi.
- Xato izohlari:
  - Farq qurilmada emas: ikkala usul ham serverda ishlaydi. Farq — xabarni kim boshlab uzatadi.
  - Ikkala usul ham har qanday xabarni yetkazadi: matn, rasm, fayl.
  - Ikkalasi ham istalgan vaqtda ishlaydi — farq vaqtda emas, usulda.
  - (umumiy) Polling — bot so'raydi; webhook — Telegram o'zi yuboradi.

✎ Variantlar tenglashtirildi: to'g'ri javob eng uzuni emas; «Ikkalasi mutlaqo bir xil» va «chiroyliroq va zamonaviyroq» ishonarsiz edi → har variantda ikkala atama bor, har biri ishonarli xato da'vo · «O'zi-so'rab-turish / qo'ng'iroq» → atama · «Botjon tinmay so'raydi» → «bot qayta-qayta so'raydi» (1-dars ta'rifi)

## 11 · Joylashdan oldin tekshiruv 🏅  `[1142]` (bandlar `[1137]`)
- Eyebrow: Markaziy · #4
- Sarlavha: **Serverga joylashdan oldin — tekshiruv.**
- Mentor: Har bandni o'qing va u to'g'ri qoidami yoki xato ekanini belgilang.
- Yorliq: joylashga tayyorlik ro'yxati · har bandda: ✓ To'g'ri · ✕ Xato (bitta urinish)
  - Token kodda yozilmagan: bot uni `process.env.BOT_TOKEN` dan o'qiydi — ✔ To'g'ri
  - Kod laptopda sinalmagan — to'g'ridan-to'g'ri serverga joylaymiz — ✔ Xato
  - Fallback handler bor: mos handler topilmasa ham bot javob beradi — ✔ To'g'ri
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Hammasi to'g'ri: ✓ Hammasi to'g'ri — kod avval laptopda sinaladi, keyin serverga joylanadi.
- Xato bo'lsa: Qarang: sinalmagan kodni serverga joylash — xato, avval laptopda sinaladi. Token kodda emasligi va fallback handler borligi esa — to'g'ri qoidalar.
- Tugma: Har bandni tekshiring (N/3) → Davom etish

**Ko'rinish (KOD — hozir 3 band va 6 tugma birdan):** faqat 1-band va uning ikki tugmasi faol; belgilangach band «✓ To'g'ri» yoki «✕ Xato» belgisi bilan yig'iladi, keyingisi ochiladi. Natija-ramka bitta — 3/3 dan keyin.
Animatsiya: yo'q.
Olib tashlanadi: Mentordagi «3 ta band bor» (son yorliqda ko'rinadi) · tugmalardagi ✅ ❌ (tugma-belgi ✓ ✕ qoladi) · 🔑.

✎ 3-band «Doimiy joy (server) doim yoqilgan — 24/7 jonli turadi» → «Fallback handler bor…»: eski band tekshiruv qadami emas, serverning xossasi edi, «24/7» — qat'iy da'vo; yangi band 1-darsdagi fallback handlerni 1-dars ma'nosida takrorlaydi (A-7.2); qiymat (to'g'ri) o'sha · 1-band `.env` → `process.env.BOT_TOKEN` (7-ekrandan keyin «qulfli tortma» emas, kod qatori) · «Ko'chirishdan oldin» → «Serverga joylashdan oldin»

## 12 · Serverdagi bot tunda  `[1187]`
- Eyebrow: Hayotiy · to'liq bot
- Sarlavha: **Serverdagi bot 03:00 da buyurtma qabul qiladi.**
- Mentor: Laptopingiz yopiq, bot serverda ishlayapti. Suhbatni qadam-baqadam oching va har javob ostida qaysi qism ishlaganiga qarang.
- Suhbat (AvtoPizza · bot):
  1. mijoz «03:00 — Achchiq bo'lmagan pitsa bormi?» → bot «Ha, Margarita achchiq emas: pomidor sousi va pishloq. Buyurtma qilasizmi?» — *ishladi: AI (bu savolga tayyor handler yo'q)*
  2. mijoz [Margarita tugmasini bosdi] → bot «Margarita — 35 000 so'm. Buyurtmangizni yozib oldim. Manzilingizni yuboring.» — *ishladi: handler + baza (buyurtma bazaga yozildi)*
  3. mijoz «Chilonzor, 5-kvartal» → bot «Qabul qilindi. Buyurtmangiz 30 daqiqada yetib boradi. Rahmat!» — *ishladi: handler + baza (holatdan manzil kutilayotgani bilindi, manzil buyurtmaga qo'shildi)*
- Tugmalar: ▶ Suhbatni boshlash · Keyingi xabar → · ✓ Suhbat tugadi
- Xulosa (3/3 dan keyin): Bu suhbatda bot, baza va AI laptopsiz ishladi. Shuning uchun serverda faqat bot.js emas: bot serverdan bazaga ulana olishi va AI API kaliti server sozlamalarida turishi kerak.
- Tugma: Suhbatni davom ettiring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — xabarlar navbat bilan; har javob ostidagi kichik «ishladi: …» izohi faqat o'sha javob chiqqanda (**KOD:** izoh yangi).
Animatsiya: «yozmoqda…» (chatning o'z ko'rinishi); chizish yo'q.
Olib tashlanadi: «🏠 Har javob ortida — Botjon doimiy joyda (serverda) — 🧭 maslahatchi o'ylaydi, 📓 daftar buyurtmani saqlaydi» kartasi (Mentor bilan bir ma'no; endi har javob ostida aniq) · bot xabaridagi «Men 24/7 shu yerdaman» · «ertaga ham eslayman» · 🌙 🟢 🌿 🎉 📓 📝 📍 ✅.

✎ 🔴 FAKT: «glutensiz pizza bormi?» → «yupqa Margarita yengil bo'ladi» — Margarita glutenli: bot sog'liqqa oid savolga noto'g'ri tavsiya bergan, 6-darsdagi «AI o'ylab topishi» sabog'idan keyin bu yomon namuna → «achchiq bo'lmagan pitsa» (6-dars suhbatidagi Margarita bilan bir xil) · 2-qadam erkin matn → tugma (handler aniq ko'rinsin) · xulosaga yangi fakt: baza va AI kaliti ham serverdan ochilishi kerak (laptopdagi baza laptop bilan yopiladi) · «To'liq mahsulot — doimiy joyda, 24/7 jonli» olindi (A3)

## 13 · Yana ikki qoida  `[1232]`
- Eyebrow: Amalda · 2 qoida
- Sarlavha: **Serverdagi bot uchun yana ikki qoida.**
- Mentor: Serverdagi botni doim ko'rib o'tirmaysiz. Xato bo'lsa, buni birinchi bo'lib mijoz sezadi — shuning uchun ikkala qoidani oldindan qo'llang.
- Kartalar:
  - **1. Xatoni ushlang** — AI javob bermasa yoki bazaga ulanib bo'lmasa, kod xato beradi. Xato ushlanmasa, bot to'xtab qolishi mumkin. Telegraf'da buning uchun `bot.catch` bor: xatoni ushlab, mijozga «Uzr, hozir javob bera olmadim. Birozdan keyin qayta yozing» deb yozasiz. Bu fallback handler emas: fallback mos handler topilmaganda ishlaydi, `bot.catch` — kod xato berganda.
  - **2. Kuzatib turing** — Server ham to'xtashi mumkin. Vaqti-vaqti bilan botingizga /start yozib ko'ring. Javob kelmasa, hosting sahifasida bot holatini tekshirib, uni qayta ishga tushirasiz.
- Tugma: Tushundim → ✓ Tushundim
- Pastki tugma: Tushundingiz ✓ → Davom etish

**Ko'rinish:** ikki karta birdan (faqat o'qiladi, bosiladigan qism bitta); tugma ostida.
Animatsiya: yo'q.
Olib tashlanadi: «📍 Bugungi qoidalar — qisqacha: 🧩 4 buyumni yig' → 🔑 kalitni .env'ga → 🏠 doimiy joyga ko'chir → …» kartasi (final tartibini ikki ekran oldin ochib qo'yardi) · «Ana shu qoidalar bilan Botjon … doim jonli yordamchiga aylanadi» ramkasi (yangi ma'no yo'q) · 🛟 📈 🙏.

✎ 🔴 FAKT: «Yiqilmaslik qoidasi … Oxirgi qator (fallback) tayyor bo'lsin» — 1-darsda fallback handler «mos handler topilmasa» ishlaydi; kod xatosida u ishlamaydi → alohida tushuncha «xatoni ushlash» (`bot.catch`, A-7.2) · «Botjon doimiy joyda 24/7 ishlaydi» (Mentor) → server ham to'xtashi mumkin (A-7.4) · «Doimiy joy jonli ekanini tekshiring» → aniq harakat: /start yozib ko'rish · «Doimiy joyga qo'yishdan oldin — 2 ta amaliy nuqta» → yangi sarlavha (bu qoidalar serverda ishlagan bot uchun)

## 14 · 4-savol ✅  `[1258]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Laptopingiz yopiq, lekin bot hali ham javob beryapti. Nega?**
  - Telegram bot dasturini o'z serverida ishlatadi
  - ✔ Bot dasturi serverga joylangan, o'sha yerda ishlaydi
  - Javoblar oldindan yozilib, navbatda turgan edi
  - Mijoz botni o'z telefonida ishga tushirib qo'ygan
- To'g'ri: Bot dasturi serverda ishlayapti — laptop yopilishi unga ta'sir qilmaydi.
- Xato izohlari:
  - Telegram faqat xabarni yetkazadi. Javobni sizning bot dasturingiz yozadi — u serverda ishlayapti.
  - Javoblar oldindan yozilmaydi: har xabarga bot dasturi o'sha paytda javob yozadi.
  - Mijoz botni ishga tushirmaydi — u faqat xabar yozadi. Dastur serverda ishlab turibdi.
  - (umumiy) Sabab — bot dasturi serverga joylangan va o'sha yerda ishlayapti.

✎ 3-variant «Chunki laptop aslida o'chmagan» qisman to'g'ri bo'lishi mumkin edi (uyqu rejimi o'chirilgan laptop ishlab turadi) → «Javoblar oldindan yozilib, navbatda turgan edi» · 1-variantga «server» so'zi qo'shildi (atama faqat to'g'rida bo'lmasin; 3-ekran shu xatoga tayyorlaydi) · «Chunki …» boshlanishi olindi · «24/7 jonli ishlayveradi» → «javob berishda davom etadi» (A3)

## 15 · Deploy tartibi ✅ (final)  `[1286]` (bo'laklar `[1278]`)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: deploy tartibini yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash beriladi; tartib — kod kaliti, o'zgarmaydi):
  - Botni yig'ing: handlerlar, baza va AI
  - Laptopda ishga tushirib sinang
  - Serverda BOT_TOKEN ni sozlang
  - Kodni serverga joylab, ishga tushiring
  - Botga /start yozib tekshiring
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- To'g'ri: ✓ Deploy tartibi to'g'ri: avval laptopda yig'ib sinaysiz, keyin serverda tokenni sozlab, kodni joylaysiz va /start bilan tekshirasiz.
- Xato (umumiy): Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Xato («Kodni serverga joylab, ishga tushiring» tokendan oldin bo'lsa): Serverda token sozlanmagan bo'lsa, bot ishga tushmaydi — tokenni avval yozing.
- Havola (birinchi xato yig'ishdan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Tartibni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Natija-yozuv bitta: to'g'ri yoki xato (hozir ikkitadan: «✓ Ko'chirish tartibi tayyor!» + yashil ramka; «⚠️ Tartib xato — qayta joylang.» + «Tartib xato — bo'lakni bosib qaytaring…» — **KOD**). «Qisqa takrorlash» havolasi test ekranlaridagidek — birinchi xato urinishdan keyin (hozir RECAPS[15] bor, ochish tugmasi yo'q — **KOD**).
Animatsiya: HA — to'g'ri yig'ilgach 2- va 3-qadam orasida «laptop | server» chegara chizig'i chiziladi (qaysi qadam qayerda bajarilishini ko'rsatadi); faqat to'g'ri javobdan keyin.
Olib tashlanadi: Mentordagi «avval nima quriladi, keyin nima sinaladi, oxirida nima jonli bo'ladi?» · muvaffaqiyat qatoridagi «Qur → Lokal test → .env sozla → Ko'chir → 24/7 jonli».

✎ 🔴 FAKT: Mentor gapi 5 o'rindan 3 tasini (1, 2, 5) oldindan aytardi → olindi · 🔴 FAKT: 3-bo'lak «Kalitni .env'ga sozla» laptopda sinashdan keyin — token `.env` da 1-darsdan beri turadi; laptopdan keyin sozlanadigan narsa serverdagi token (7-ekran) → «Serverda BOT_TOKEN ni sozlang» · 5-bo'lak «24/7 jonli — tayyor» harakat emas edi → «Botga /start yozib tekshiring» · 4-bo'lak «ishga tushiring» qo'shildi: token ishga tushirishdan oldin bo'lishi shart, shuning uchun 3 va 4 o'rin almashsa javob aniq xato (tartib bitta) · «Lokal test» izohsiz edi → «laptopda sinash» · tartib (build → test → env → move → live) o'zgarmadi

## 16 · Amaliyot · server  `[2112]` (shablon `[1984]`)
- Eyebrow: Amaliyot · server · joy: «kompyuteringizda»
- Sarlavha: **Botingizni serverga joylashga tayyorlang**
- Topshiriq: O'z botingizni serverga joylashga tayyorlang: laptopda sinang, sirlarni tekshiring, xatoni ushlang va deploy rejasini yozing.
- Umumiy matn: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Qadamlar:
  1. Botingizni laptopda ishga tushiring va tekshiring: /start, menyu, erkin savol (AI javob beradi), buyurtma bazaga yoziladi.
  2. Token va AI API kaliti `.env` faylida, `.env` esa `.gitignore` da ekanini tekshiring — kodda faqat `process.env` qolsin.
  3. `bot.catch` qo'shing: xato bo'lsa, bot mijozga «Uzr, birozdan keyin qayta yozing» deb javob yuborsin.
  4. gemini.google.com'dan so'rang: «Telegraf botini to'xtovsiz ishlatish uchun qaysi hosting xizmatlari bor va deploy qadamlari qanday?». Uchta narsaga qarang: Node.js'ni ishga tushiradimi, sozlamalarga `BOT_TOKEN` yozish mumkinmi, bepul yoki arzon rejasi bormi. Javobni Mentor bilan ko'rib, bitta xizmatni tanlang.
  5. Tanlangan xizmat uchun deploy rejasini yozing: kod qayerga yuklanadi, `BOT_TOKEN` qayerga yoziladi, bot qanday ishga tushadi.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Tayyorlik tugadi. Mentor tekshirib, keyingi qadamga o'tkazadi.» · pastki: Avval bajaring → Davom etish
- Mentor ko'rinishida: Kim bajardi — N/M · Yuklanmoqda… · Hali hech kim qo'shilmagan.

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi.
Animatsiya: yo'q.
Olib tashlanadi: Mentor gapidagi «Har bosqichni bajarib, belgilab boring» (topshiriq matni bilan ikki marta) · «ustoz kuzatib turadi» · 👀 ✅ 🔑 📋 📓 🧭.

✎ 30.09 ChatGPT #21–24: reja/deploy aralashligi va uyga vazifa — 29.09 da tuzatilgan (A-7.5: dars joylashni tayyorlaydi va rejalaydi); #24 **Qabul** (qisman): «AI'dan so'rang» yolg'iz qolmasin — 4-qadamga uchta tanlash mezoni qo'shildi (Node.js, sozlamada token, narx); 6-savol A — xizmat nomi aytilmaydi · 🔴 FAKT: sarlavha «rejasini yozing» deydi, bosqichlar esa bajarishni so'raydi, hosting nomi va joylash qadamlari darsda yo'q → bosqichlar darsda o'rgatilgan va bajarib bo'ladigan ishlarga keltirildi: sinash, sirlar, xatoni ushlash, xizmat tanlash (gemini.google.com + Mentor), reja (A-7.5) · «Yiqilmaslik qatorini (fallback)» → `bot.catch` (A-7.2) · «4 buyumni tekshiring» → aniq tekshiruv ro'yxati · «ustoz» → Mentor · «Doimiy joy (hosting xizmati)ni … AI'dan so'rab aniqlang» → aniq so'rov matni

## 17 · Natijalar (podium)  `[1859]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — B-8.)
- Savol yorliqlari: 1 — To'liq bot · 2 — Token serverda · 3 — Polling va webhook · 4 — Server · 5 — Deploy tartibi

✎ Yorliqlar yangi savol mavzulariga moslandi (**KOD:** `Q_LABELS`)

## 18 · Takrorlash (kartochkalar)  `[2140]` (kartalar `[2126]`)
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq botning to'rt qismi qaysilar? | Token, handlerlar, baza, AI | Har qism o'z ishini qiladi |
| Buyurtmani ertasi kungacha qaysi qism saqlaydi? | Baza (PostgreSQL) | Diskda turadi — bot qayta ishga tushsa ham yo'qolmaydi |
| Handlerda tayyor javobi yo'q erkin savolga kim javob yozadi? | AI | Siz yozgan system prompt bo'yicha |
| Bot dasturi laptopda bo'lsa, laptop yopilganda nima bo'ladi? | Bot javob bermaydi | Xabar Telegram'da kutib turadi, dastur esa to'xtagan |
| Internetga ulangan, to'xtamay ishlashga mo'ljallangan kompyuter nima deyiladi? | Server | Uni hosting xizmatidan ijaraga olasiz |
| Kodni serverga joylab, u yerda ishga tushirish nima deyiladi? | Deploy | Shundan keyin laptop yopiq bo'lsa ham bot ishlaydi |
| Kodni Git orqali serverga joylaganda `.env` nega bormaydi? | U `.gitignore` da | Shuning uchun `BOT_TOKEN` serverda alohida sozlanadi |
| Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rasa, bu qaysi usul? | Polling | `bot.launch()` shu usulda ishlaydi |
| Telegram yangi xabarni botning internetdagi manziliga o'zi yuborsa, bu qaysi usul? | Webhook | Botga ochiq manzil (URL) kerak |
| Kichik bot uchun qaysi usul soddaroq? | Polling | Qo'shimcha sozlash kerak emas, serverda ham ishlaydi |
| AI yoki baza javob bermasa, bot jim qolmasligi uchun nima qilinadi? | Xato ushlanadi | Telegraf'da `bot.catch` — mijozga «birozdan keyin yozing» deyiladi |
| Kodni serverga joylashdan oldin uni qayerda sinaysiz? | Laptopda | Xatoni serverga chiqmasdan oldin topasiz |

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …); «🎉 Hammasini bilasiz!» dagi 🎉 olinadi

✎ 🔴 FAKT: 12-kartochka «Kodni ko'chirishdan oldin oxirgi qadam qaysi? → Laptopda sinash» finalga zid edi (finalda sinash bilan joylash orasida token turadi) → «oxirgi» olindi: «…qayerda sinaysiz? → Laptopda» · 🔴 11-kartochka «Yiqilmaslik qatori — fallback — zaxira javob har doim chiqadi» → «Xato ushlanadi (`bot.catch`)», «har doim» olindi (A-7.2, A3) · 8/9-kartochka «webhook — tezroq, foydalanuvchi ko'p bo'lganda» → ta'rif 1-dars v2 bilan bir xil · 9-kartochka «Kichik Botjon…» 7-kartochka bilan bir javob berardi → izohi yangi fakt bilan (serverda ham ishlaydi) · 7-kartochka yangi (7-ekran fakti) · emoji olindi

## 19 · Yakun  `[2153]`
- Eyebrow: Tayyor · belgi: ✓ Bot serverga tayyor
- Sarlavha: **Endi botni serverga joylash tartibini bilasiz.** (yonida ball halqasi)
- Jonli viktorina tugmasi · Mentorni kuting
- Endi siz bilasiz:
  - To'liq bot — to'rt qism: token, handlerlar, baza (PostgreSQL) va AI
  - Bot dasturi laptopda bo'lsa, laptop yopilganda u ham to'xtaydi; server esa to'xtamay ishlashga mo'ljallangan
  - `.env` serverga kod bilan bormaydi — `BOT_TOKEN` va AI API kaliti server sozlamalariga yoziladi
  - Polling — bot so'raydi, sozlash oson; webhook — Telegram o'zi yuboradi, ochiq manzil kerak
  - Deploy tartibi: laptopda sinash → serverda token → kodni joylash → /start bilan tekshirish
- Uyga vazifa · Amaliy topshiriqni bajarish →
- Uyga vazifa:
  - **Tayyorlang** — botingiz laptopda to'liq ishlashini tekshiring: /start, menyu, erkin savol va buyurtma bazaga yozilishi
  - **Rejalang** — amaliyotda tanlagan xizmat uchun deploy qadamlarini yozing: kod qayerga yuklanadi, `BOT_TOKEN` qayerga yoziladi, bot qanday ishga tushadi
  - **Sinang** — botni serverga joylagach, laptopingizni yoping va botga /start yozing: javob kelsa, bot serverda ishlayapti
- Keyingi dars — **«Botingizni ishlatgan odamdan nimani so'raysiz?»** Botingizni sinab ko'rgan odamdan u aynan nima qilganini so'rashni va eshitganingizni yozib olishni o'rganamiz.
- Nishonlaringiz — N/4 · Orqaga · Qaytadan · Yakunlash ✓

Olib tashlanadi: «Botjoningiz endi laptopda emas — doimiy joyda, 24/7 jonli» sarlavhasi (o'quvchi hali serverga joylamagan bo'lishi mumkin — halol emas) · «Yiqilmaslik qoidasi (fallback)…» xulosasi (xulosalar 5 ta qoladi; xatoni ushlash 13-ekranda va amaliyotda bor) · 🚀 📝 ⏳ 🏅 ⭐ 🔑 🏠 (matn oldidagi).

✎ 🔴 FAKT: «Keyingi dars — Botjon to'liq jihozlanadi: barcha buyumlar bilan yakuniy AI-loyihani boshdan-oxir quramiz!» → App.jsx bo'yicha keyingi dars PM (m5-08) «Botingizni ishlatgan odamdan nimani so'raysiz?» (sub: «bo'lib o'tgan ishini so'rash va eshitganini yozib olish») · 🔴 FAKT: uyga vazifa «doimiy joy (hosting) tanlang va Botjonni u yerga ko'chiring» — darsda xizmat nomi ham, joylash qadamlari ham yo'q → «Tayyorlang / Rejalang / Sinang»; «Sinang» joylashdan keyin bajariladi (A-7.5) · «Ko'chirish (deploy): laptopda sina → kalitni .env'ga sozla → …» → final bilan bir xil tartib · «qo'ng'iroq (webhook) — tez, ko'p foydalanuvchiga» → ta'rif

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Bot Builder** (hozir Assemble Master) — To'liq botni birinchi urinishda to'g'ri yig'dingiz
- **Safe Deploy** (hozir Key Master) — Tokenni serverga kodga yozmasdan yetkazdingiz
- **Message Catcher** (hozir Link Master) — Kichik bot uchun xabar olishning mos usulini tanladingiz
- **Launch Ready** (hozir Check Master) — Serverga joylashdan oldingi tekshiruvni birinchi urinishda to'g'ri bajardingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

✎ «Master» to'rt marta takrorlanardi, «Key Master» 1-darsdagi eski nom bilan bir xil edi · «Botjonga to'g'ri aloqa usulini tanladingiz» → «xabar olishning mos usuli» (A-7.1)

**Qisqa takrorlash oynalari (5)** — sarlavha «Qayta tushuntirish», oxirgi kartada «Sinfga savol:»; karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida:
1. (4) **To'liq bot — to'rt qism:** Har qism — o'z ishi: token botni tanitadi, handlerlar tayyor javob beradi, baza saqlaydi, AI erkin savolga javob yozadi. · Eslab qolish — baza ishi: buyurtma ertasi kungacha kerak bo'lsa, u bazaga (PostgreSQL) yoziladi va diskda turadi. · Birga ishlaydi: bitta suhbatda to'rttasi ham ishlaydi — handler tugmaga, AI erkin savolga javob beradi, baza buyurtmani saqlaydi. · Sinfga savol: Buyurtmani ertasi kungacha qaysi qism saqlaydi?
2. (8) **Token serverda:** `.env` serverga bormaydi — u `.gitignore` da, Git uni yuklamaydi. · Token server sozlamalariga yoziladi — `BOT_TOKEN` nomi bilan, kod uni `process.env` dan o'qiydi. · AI API kaliti ham shunday — sirlar kodda emas, sozlamada turadi. · Sinfga savol: Nega serverda BOT_TOKEN ni alohida sozlaymiz?
3. (10) **Polling va webhook:** Polling — bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?». · Webhook — Telegram yangi xabarni botning internetdagi manziliga (URL) yuboradi; buning uchun ochiq manzil kerak. · Kichikdan boshlang — polling qo'shimcha sozlashsiz ishlaydi, serverda ham. · Sinfga savol: Kichik bot uchun qaysi usul soddaroq?
4. (14) **Nega server kerak:** Laptop yopilsa, dastur to'xtaydi — bot javob bermaydi. · Server to'xtamay ishlashga mo'ljallangan — bot laptop yopiq bo'lsa ham javob beradi. · Shuning uchun deploy qilamiz: kodni serverga joylab, u yerda ishga tushiramiz. · Sinfga savol: Laptop yopiq, lekin bot javob beryapti — nega?
5. (15) **Deploy tartibi:** Avval — laptopda: botni yig'ib, ishga tushirib sinaysiz. · Keyin — serverda: tokenni sozlaysiz, kodni joylab, ishga tushirasiz. · Oxirida — tekshiruv: botga /start yozib, javob kelishini ko'rasiz. + chizma: Yig'ish → Laptopda sinash → Serverda token → Joylash → /start bilan tekshirish · Sinfga savol: Nega kodni serverga joylashdan oldin laptopda sinaymiz?
- Belgilar (U3): 1-oyna — 1 · 2 · 3 | 2-oyna — `.env` · `BOT_TOKEN=…` · `process.env.AI_API_KEY` | 3-oyna — `bot.launch()` · 2 · 3 | 4-oyna — 1 · 2 · 3 | 5-oyna — 1 · 2 · `/start`

✎ 2-oyna mavzusi 8-savol bilan birga o'zgardi · 🔴 4-oyna «Doimiy joy (server) hech qachon o'chmaydi», «24/7 jonli qilishning yagona yo'li» → olindi (A-7.4, A3) · 5-oyna tartibi yangi final bo'laklariga moslandi · «Qo'ng'iroq … tezroq, ko'p foydalanuvchi uchun» → 1-dars ta'rifi · 🧩 📓 🤝 💻 🏠 🚚 🔁 🔔 🌱 🌙 ✅ 🔧 🔑 🧪 🌐 olindi

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. To'liq botning to'rt asosiy qismi qaysilar? Token, API, dizayn va reklama · ✔ Token, handlerlar, baza va AI · Handlerlar, rasm, video va musiqa · Telegram, telefon, laptop va internet
   ✎ 01.10 (F-1001-58, razrabotka): 1-variant `lint:tell` uchun — «AI» faqat to'g'ri variantda edi; ✔ o'rni o'sha.
2. Buyurtmani ertasi kungacha qaysi qism saqlaydi? Token · Handler · AI · ✔ Baza
3. Deploy nima degani? ✔ Kodni serverga joylab, u yerda ishga tushirish · Botni butunlay o'chirib, qaytadan yaratish · Eski tokenni yangisiga almashtirib qo'yish · Botga yangi mijozlarni taklif qilib chiqish
4. Server — bu nima? Telegram ichidagi maxsus kanal · Laptopingizdagi alohida papka · ✔ To'xtamay ishlashga mo'ljallangan kompyuter · Mijoz telefonidagi Telegram ilovasi
5. Botni serverga joylasak, nima o'zgaradi? Bot ancha sekin javob bera boshlaydi · ✔ Laptop yopiq bo'lsa ham bot javob beradi · Bot faqat kunduzi javob beradigan bo'ladi · Hech narsa, hammasi avvalgidek qoladi
6. Serverda BOT_TOKEN qayerga yoziladi? ✔ Server sozlamalariga, kod uni process.env dan o'qiydi · bot.js ichiga, kod bilan birga yuklanadi · Botning Telegram'dagi tavsifiga yoziladi · Hech qayerga, server uni o'zi topadi
7. Polling'da yangi xabarni kim so'raydi? Mijoz — u Telegram'dan qayta-qayta so'raydi · Telegram — u botdan qayta-qayta so'raydi · Server — u mijozdan qayta-qayta so'raydi · ✔ Bot — u Telegram'dan qayta-qayta so'raydi
8. Webhook'da yangi xabarni botga kim yetkazadi? Bot o'zi — Telegram'dan qayta-qayta so'rab oladi · ✔ Telegram — xabarni botning manziliga o'zi yuboradi · Mijoz — xabarni to'g'ridan-to'g'ri serverga yozadi · Hech kim — xabar botda o'zi paydo bo'ladi
9. Kichik bot uchun qaysi usul soddaroq? Webhook · Ikkalasini birga ishlatish · ✔ Polling · Hech qaysi, bot o'zi biladi
10. Kodni serverga joylashdan oldin nima qilinadi? Token kodga ochiq yozib qo'yiladi · Hech narsa, kod to'g'ridan-to'g'ri joylanadi · Laptopdagi baza o'chirib tashlanadi · ✔ Kod laptopda ishga tushirib sinaladi
11. AI javob bermasa ham bot jim qolmasligi uchun nima qilinadi? ✔ Xato ushlanadi va mijozdan uzr so'raladi · Bot har safar qo'lda qayta yoqiladi · @BotFather'dan yangi token olinadi · Hech narsa, bot o'zi tiklanib ketadi
12. Laptop yopiq, lekin bot javob beryapti. Sababi? Javoblar oldindan navbatda turgan edi · Telegram bot dasturini o'zi ishlatadi · ✔ Bot dasturi serverda ishlayapti · Mijoz botni o'zi ishga tushirgan

✎ 1-savol: to'g'ri javob eng uzuni va emojili edi, «Umuman buyum kerak emas — Telegram…» ishonarsiz → to'rt variant bir xil shaklda · 2-savol: «(DB)» qavsi faqat to'g'rida edi → olindi · 6-savol: «Qulfli tortmada (.env)» → serverga xos savol (7-ekran), «Mijozga chatda yuboriladi» ishonarsiz edi · 7/8-savol: to'g'ri javob tire bilan eng uzuni edi → hammasi bir shaklda · 9-savol: «Ikkala usul ham umuman kerak bo'lmaydigan narsa» ishonarsiz · 🔴 11-savol: «Oxirgi qator (fallback)» → «Xato ushlanadi» (A-7.2) · 12-savol: «Laptop aslida umuman o'chmagan bo'lishi kerak» qisman to'g'ri bo'lishi mumkin (14-savol ✎) → almashtirildi · emoji olindi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» / «Qiziq fikr!»); chat sarlavhasi «bot» (onlayn/oflayn yo'q); «Laptop yopiq — Botjon oflayn» qatori olinadi.
2. s1 — `Preview` (natija-chat + `sk-info` + `GearPanel`) o'rniga laptop → server chizmasi (strelka chiziladi); keyin 4 qadam birma-bir; mobil tugma «↩ Chizmani ko'rish».
3. s2 — 4/4 dan keyingi `frame-success` olinadi.
4. s3 — ekran ma'nosi yangi: «Laptop yoniq» / «Laptop yopiq» tugmalari navbat bilan; xabar yo'li chizmasi va strelka animatsiyasi; ikki chat matni.
5. s5 — vazifalar navbat bilan (joriy vazifa → ✓ yig'iladi → keyingisi); 3-vazifa matni (token, `right: 2` o'sha); alohida `frame-success` olinadi — panel yakuniy holatga o'tadi; vazifadan panelga chiziq animatsiyasi.
6. s6 — `frame-success` olinadi; izoh (server + deploy) bitta ramka; tugma va kartalar matni («laptopni yopish»).
7. s7 — yangi namoyish (kod `new Telegraf(process.env.BOT_TOKEN)`, «Serverda ishga tushirish»); savol yorlig'i namoyishdan keyin; namoyish natijasi va tanlov natijasi bitta joyda almashadi; natija matnlari `fmtCode` orqali (hozir `process.env` xom teskari tirnoq bilan).
8. s8 — savol va variantlar matni (✔ 0 o'sha); `RECAPS[8]`, `Q_LABELS[8]`.
9. s9 — ko'rish tugmalari navbat bilan; «Tanlov» yorlig'i o'rniga savol matni, faqat ikkala demo ko'rilgach; polling/webhook strelka animatsiyasi.
10. s11 — bandlar navbat bilan (joriy band → belgi bilan yig'iladi → keyingisi); tugmalar «✓ To'g'ri» / «✕ Xato».
11. s12 — `STEPS` matni; har javob ostida «ishladi: …» izohi; «Har javob ortida» kartasi olinadi.
12. s13 — «Bugungi qoidalar — qisqacha» kartasi va yakuniy `frame-success` olinadi; kartalar matni.
13. s15 — `DEPLOY_FLOW` yorliqlari (tartib va `id` o'zgarmaydi); bitta muvaffaqiyat va bitta xato yozuvi (`dd-done` + `frame-success`, `dd-wrong` + `dd-pool-empty` juftlari birlashadi); «joylash tokendan oldin» xatosi uchun alohida izoh (ixtiyoriy); birinchi xato yig'ishdan keyin «Qisqa takrorlash» havolasi (RECAPS[15] ochiladi); to'g'ri yig'ilgach «laptop | server» chegara chizig'i.
14. s16 — `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa); «ustoz» → Mentor; Mentor gapidagi takror jumla olinadi.
15. s19 — `RECAP`, `HOMEWORK`, «Keyingi dars» qatori, sarlavha va belgi matni.
15a. 30.09: UI qoidalari U1–U3 (harakat tugmalari bir uslubda; ochiladigan kartalarda `›` / `✓`; hook tanlovi neytral; 1-ekran qadam teglari olinadi; `TgChat` oraliqlari; RECAPS `ic` → kod misoli) · to'g'ri javob izohlari bitta gap (4, 7, 8, 9, 10, 11, 14-ekran) · s5 va s9 variant o'rni aralash, nishon sharti variant matni bo'yicha (4-savol A) · 2-ekran va kartochka 3 — «system prompt».
16. Butun dars — emoji A4 bo'yicha (6-savol izohi: «emojilar juda ko'p — qisqartir»; `npm run lint:emoji`): test yozuvlari (📖 ⚡ 📨), `AchRule` (🏅), flashcard (🎉), amaliyot (👀 ✅), yakun kartalari; RECAPS `ic` → raqam, `RcFlow` bo'laklari; nishon `name`/`desc`; `Q_LABELS`; arena fonidagi `QZ_BG_SHAPES` «daftar» → «PostgreSQL», «doimiy joy» → «server», emoji tokenlar.

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — 1-dars v2 B-1 (qaror F-0929-63); bu darsda KOD 2-band.
2. **App.jsx m5-07 `sub`** «to'liq ishlaydigan bot + hosting» — hosting qarori bilan birga ko'riladi (Agent eslatmalari, 1-band): xizmat tanlanmasa → «to'liq bot + serverga joylash» kabi.
3. **1-dars v2 A1 jadvali** — modul etaloni: «server», «deploy», «xatoni ushlash (`bot.catch`)», «baza (PostgreSQL)», «AI» qatorlari qo'shilishi kerak (A-7.1).
4. **5-dars v2:** 13-ekran «Doim onlayn bo'lishi uchun hosting kerak — buni keyingi bosqichda o'rganasiz» → «7-darsda»; «Botjon — to'liq jihozlangan (8/8 buyum)» jihozlar paneli bilan birga.
5. **6-dars v2:** «Maslahatchi» uchun asosiy nom tanlanadi — bu dars «AI» deb oladi; «AI API kaliti» nomi ikkala darsda bir xil bo'lsin.
6. **`ScreenLivePractice`, `QuestionScreen`, `AchRule` matnlari** har darsda o'z nusxasida — emoji/«ustoz» tuzatishi har dars KOD ro'yxatida (bu dars: 14, 16-band).
7. **RU matni** — o'zbekcha tasdiqlangach (kod ichidagi ruscha satrlarda ham Botjon, daftar, doimiy joy tarjimalari bor — o'zbekcha nomlar bilan birga almashadi).
8. **«sessiya»** (podium) — 1-dars v2 B-5 (KATTA_TOZALASH nomzodi).

---

## Agent eslatmalari
1. **Hosting — 6-savol A (30.09): nomsiz, qoralamadagidek.** Kurs botlarni qaysi xizmatga joylaydi? Nomi aytilsa, 6-ekran izohi, 16-ekran 4–5-qadami va uyga vazifaga aniq qadamlar (kod qayerga yuklanadi, `BOT_TOKEN` qayerga yoziladi, qanday ishga tushadi) yoziladi. Hozirgi halol variant (A-7.5): dars joylashni tayyorlaydi va rejalaydi, xizmat gemini.google.com + Mentor bilan tanlanadi, «Sinang» — joylashdan keyin.
2. **Ma'nosi o'zgargan joylar (mexanika va ✔ o'rni o'sha):** 3-ekran (laptop/doimiy joy → xabar yo'li; 0, 3, 6 bir gapni uch marta aytardi) · 5-ekran 3-vazifa (4-savol bilan bir xil edi → token) · 7-ekran (1-dars 6-ekran takrori → serverda token) · 8-savol (14-savol bilan bir ma'no → serverda token). Rad etilsa — eski mavzu qoladi, faqat atama/emoji/variant balansi tuzatiladi.
3. **`bot.catch` bu darsda yangi** — 1-dars fallback handleri bilan aralashmasligi uchun kiritildi (13, 16-ekran, kartochka 11, arena 11). Mentor sinfda ko'rsatadimi yoki faqat nomi aytiladimi — qaror kerak; 16-ekran 3-qadamida o'quvchi uni o'zi qo'shadi.
4. **DAVOM 6–7 tekshiruvi (kodda):** «Keyingi dars — yakuniy AI-loyiha» `[2207]` — tasdiqlandi, tuzatildi · 4-ekran «o'tgan darsda daftar» `[895]` — tasdiqlandi (baza 4-darsda) · final 5 dan 3 o'rinni ochadi `[1299]` — tasdiqlandi; bundan tashqari 1-ekran 4-qadam `[783]` va 13-ekran qisqacha qatori `[1248]` ham ochardi · hosting nomi/qadamlari yo'q, uyga vazifa ko'chirishni so'raydi `[989]` `[2120]` `[2182]` — tasdiqlandi · 12-kartochka finalga zid `[2138]` — tasdiqlandi. Hammasi tuzatildi.
5. **O'zim topgan qo'shimcha faktlar:** fallback «xato bo'lsa» ma'nosida (1-darsga zid) · «doimiy joy hech qachon o'chmaydi» (13-ekranga zid) · 12-ekran glutensiz savolga Margarita (glutenli) tavsiyasi · final 3-bo'lagi «.env'ga sozla» sinashdan keyin · Telegram bot sarlavhasida onlayn/oflayn yo'q · 7-ekran natija matnida xom teskari tirnoq (`[1037]` `[1038]`, render nuqsoni).
6. **15-ekran tartibining yagonaligi:** 3 va 4-bo'lak o'rin almashishi mumkin emasligi «ishga tushiring» so'zi bilan ta'minlandi (tokensiz bot ishga tushmaydi — 7-ekran). 2 va 3 ning tartibi 11-ekran qoidasiga tayanadi («avval laptopda sinang»). Foydalanuvchi ko'rigida bu qadam alohida ko'rilsin.
7. **12-ekran xulosasi yangi fakt qo'shadi:** bot serverdan bazaga ulana olishi kerak (laptopdagi PostgreSQL laptop bilan yopiladi). Bu hosting qaroriga ham bog'liq (baza qayerda turadi) — 1-band bilan birga ko'rilsin.
8. ~~6-dars v2 nomlari~~ → 30.09: 6-dars v2 bilan bir — «AI», «system prompt», «AI API kaliti».
