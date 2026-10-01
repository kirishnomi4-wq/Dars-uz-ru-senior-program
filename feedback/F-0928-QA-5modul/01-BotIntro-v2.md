# 5-Modul (LMS: 7-Modul) · 1-dars «Bot nima» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotIntroLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `01-BotIntro-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:3 · s8:0 · s10:2 · s14:3 · s15` tartib) — faqat matn.
Kirish: ChatGPT auditi (F-0929-57) · QA rasmlari (F-0929-58…61, `rasm/`) · foydalanuvchining umumiy qoidalari (F-0929-53…56).

---

## A. Shu darsdan boshlab butun modulda qo'llanadigan qoidalar (keyingi 11 dars uchun namuna)

**A1. Asosiy nom — haqiqiy atama.** Metafora ko'pi bilan bir marta, tushuncha birinchi chiqqanda. Keyin faqat atama.

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| Botjon | bot · botingiz | — (F-0929-51) |
| signal | **hodisa** (✅ F-0929-63) | «botga kelgan har narsa: xabar, buyruq (/start), tugma bosilishi» · JS darslaridagi hodisa bilan bir xil g'oya |
| amal | **javob** (bot yuboradigan xabar) · boshqa ish — «ish» | — |
| qoidalar varag'i · varaq · qator | **handler** · handlerlar | «"shu hodisa kelsa, shuni qil" deydigan kod qismi» |
| kalit | **token** | «Telegram uni botning kaliti deb ataydi» |
| Ro'yxat idorasi | **@BotFather** | «Telegram'ning bot ochadigan rasmiy boti» |
| xizmat oynasi | **Telegram Bot API** | «Telegram'ning botlar uchun API'si» (API backend darslarida o'tilgan) |
| qulfli tortma | **.env fayli** | — (backend darslarida o'tilgan) |
| to'xtamaydigan aylana | **sikl** (botning ish sikli) | «kutadi → hodisa → handler → javob → yana kutadi» (sikl — JS darslaridan) |
| fallback qator | **fallback handler** | «hech bir handler mos kelmasa ishlaydigan oxirgi handler» |
| o'zi so'rab turish · qo'ng'iroq | **polling · webhook** | har biriga bitta gap |
| tungi smena | **03:00 sinovi** | — |
| konvert (ctx) | **ctx** | 3-darsda |
| reaksiya qiladi | javob beradi | — |
| trigger · action · event-driven | ishlatilmaydi | — |
| chip | variant · bo'lak | — |
| daftar | (kerak joyda) «yozing» | — (F-0929-51) |
| ustoz | Mentor | — |

**A2. Bir tushuncha — bir nom** butun modulda. 30.09 (foydalanuvchi, F-0930-102): sinonim iboralar ham yo'q — bir ma'noni ikki xil so'z bilan aytmaymiz, bittasi qoladi; matn qisqa bo'ladi. «Aylana» 9-darsda boshqa ma'noda ishlatilgan (B-4).

**A3. Qat'iy gaplar yumshatiladi:** «24/7», «har doim», «hech qachon», «minglab», «darhol», «botning butun ishi» →
«dasturi ishlab tursa», «odatda», «bu botda». Bot ishlashi uchun dasturi yoniq turishi kerak — buni aytamiz.

**A4. Emoji — yo'q (F-0929-53, 161-qonundan qattiqroq).** Sarlavha, eyebrow, Mentor, kartalar, tugmalar, chat pufakchalari, kod,
test, kartochka, recap, yakun — hammasi emojisiz. Qoladi: nishon medali va podium (o'yin qatlami), tugma-belgilar `▶ ✓ ✕ ↻ → ←`.
Holat rangi (onlayn/xavfda) — CSS nuqta, emoji emas.

**A5. Bir ma'no — bir blok (F-0929-54, 159/7).** Mentor aytgan gapni boshqa blok takrorlamaydi — Mentor qoladi, blok ketadi.
Sarlavha va Mentor bir gapni aytmaydi. Xulosa-ramka faqat yangi ma'no bersa turadi. Ekranda bir vaqtda bitta natija-ramka.

**A6. Navbat bilan ochilish (F-0929-55, PM 94-qonun texnik darsga).** Ekranda 2 va undan ko'p bosiladigan yoki to'ldiriladigan qism bo'lsa,
birdan chiqmaydi: faqat joriy qadam ochiq; bajarilgani `✓` bilan bitta qatorga yig'iladi (`↻` bilan o'zgartiriladi); keyingisi shundan keyin chiqadi.
Istisno: test variantlari va final bo'laklari — hammasi birdan va teng ko'rinadi (aks holda javobga undash bo'ladi).

**A7. Animatsiya faqat ma'no ko'rsatadigan joyda (F-0929-56).** Chiziladi: yo'nalish, bog'lanish, sikl (strelka o'sadi, chiziq chiziladi).
Bezak uchun animatsiya yo'q. Har ekranda «Animatsiya: HA — nima» yoki «yo'q» aniq yoziladi. Bir ekranda bitta chizilish, 0.6–1.2 s,
`prefers-reduced-motion` da o'chadi. Ikki qo'shni ekranda bir xil animatsiya takrorlanmaydi.

**A8. Test:** variantlar taxminan teng uzunlikda; atama, tire, strelka yoki qavs faqat to'g'rida bo'lmaydi; xato variant ham ishonarli.
**Hook:** to'g'ri tanlovga «Aynan!», boshqasiga neytral «Qiziq fikr!». **Final:** joylar «1-qadam…», Mentor tartibni aytmaydi.
**To'g'ri javob izohi (30.09, 16-savol javobi):** bitta qisqa gap, «To'g'ri!» so'zisiz — oyna yorlig'i buni aytadi; chuqur tushuntirish kerak emas. **Ballsiz tanlovlar (4-savol A):** to'g'ri variant o'rni aralashtiriladi, nishon sharti variant matni bo'yicha tekshiriladi (indeks emas).

**A9. Yakunda «Keyingi dars — …» qatori App.jsx bilan mos** (PM darslarida ham). Ichki kod va modul raqami yo'q; darslarga «N-darsda» deb havola beriladi.

**UI qoidalari (30.09, QA 3–5-dars suratlari + ChatGPT UI auditi; butun modul uchun):**

**U1. Bosiladigan narsa birinchi qarashdayoq bosiladigandek ko'rinadi** (F-0930-62, 66, 68, 77).
- «Shuni bosing» tugmasi (▶ …) hamma ekranda bitta asosiy (to'q) uslubda; och ko'rinish — faqat ikkinchi darajali tugma va tanlov variantlari uchun. Hozir bir xil vazifa goh och `btn-soft`, goh to'q `btn` — QA och tugmani tugma deb tanimagan.
- Ochiladigan karta yoki qatorda doimiy `›` belgisi (telefonda hover yo'q), bosilgach `✓`. Ma'lumot kartasi — belgisiz va soyasiz, tugmaga o'xshamaydi. Butun karta bitta tugma — ichidagi mayda element emas.
- Hook tanlovi ballsiz: tanlangan variant neytral to'q ramka bilan belgilanadi, qizil yoki yashil emas (hozir urg'u rangi qizilga yaqin — to'g'ri tanlov ham xatoga o'xshaydi).
- Reja ekranidagi qadamlar — oddiy raqamli ro'yxat: bosilmaydi, yorliq-teglarsiz (hozir «markaziy o'yin», «sikl», «oqim» kabi ichki yorliqlar o'quvchiga chiqib qolgan).

**U2. Matn o'z joyida qoladi** (F-0930-61, 73, 76, 78, 82).
- Chat: xabarlar orasida bir xil oraliq (~10 px), xabar bilan uning tugmalari orasida kattaroq (~14 px); pufakcha so'z ichida bo'linmaydi («/st art», «Tayyormisiz ?» kabi) — telefonda ham.
- Kod bloki va matn ichidagi `kod` o'z kartasidan chiqmaydi: qatorga o'raladi yoki kartaning o'zida suriladi; qo'shni panel ustiga tushmaydi.
- Kattalashtirish belgisi (⛶) matn ustiga tushmaydi — unga joy ajratiladi.

**U3. Qisqa takrorlash oynasida emoji o'rniga koddan misol** (F-0930-80). Texnik darsda har karta belgisi — shu kartaga tegishli bitta qisqa kod qatori; kodga bog'lanmagan karta — raqam. PM darsida — raqam.

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza — pitsa yetkazib beradigan joyning Telegram-boti (3-darsda ham shu bot).
- **Hook:** 03:00 da mijoz yozadi → javobni bot beradi → Telegram ta'rifi: bot — dastur boshqaradigan akkaunt.
- **Asosiy model (dars bo'yi bitta):** hodisa → handler → javob, sikl ichida.
- **Oldingi bilimga ko'prik:** JS darslaridagi hodisa (tugma bosiladi → kod ishlaydi) · backend darslaridagi API, 401 va `.env`.
- **Tajribalar:** token (5, 6) · handlerlarni yozish (7) · bir vaqtda uch mijoz (9) · polling/webhook (11) · to'liq suhbat (12) · kod (13) · sikl (15) · @BotFather'da bot ochish (16).
- **Keyingi dars (App.jsx m5-02):** PM — «Botingizni birinchi kim ochadi?».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — 03:00 | hook | tugmani bosadi, kim javob berganini tanlaydi | — |
| 1 | Reja | qoida | hodisa → handler → javob chizmasi + 4 qadam | — |
| 2 | Uch tushuncha | tushuncha | token / handler / sikl kartalarini ochadi | — |
| 3 | Skript va bot | tushuncha | siz / skript / bot — uchalasini sinaydi | — |
| 4 | 1-savol | test | bot skriptdan nimasi bilan farq qiladi | ✅ |
| 5 | Bot API | tushuncha | tokenni sudrab oladi → so'rov rad etiladi → qaytaradi | — |
| 6 | Tokenni qayerda saqlaysiz | markaziy | @BotFather token beradi → kod ichida / .env → oqibat → tuzatish | — |
| 7 | 03:00 sinovi | markaziy o'yin | handlerlarni navbat bilan yozadi, botni ishga tushiradi, fallback | — |
| 8 | 2-savol | test | mos handler topilmasa nima bo'ladi | ✅ |
| 9 | Bir vaqtda uch mijoz | hayotiy | uch mijoz birdan yozadi | — |
| 10 | 3-savol | test | token ochiq kodda qolsa xavf | ✅ |
| 11 | Polling va webhook | tushuncha | ikki usulni sinaydi | — |
| 12 | To'liq suhbat | hayotiy | buyurtma suhbatini qadam-baqadam ochadi | — |
| 13 | Handlerlar kodda | amaliyot | `bot.js` dagi 3 bo'shliqni navbat bilan to'ldiradi | — |
| 14 | 4-savol | test | uch mijozdan birdan xabar | ✅ |
| 15 | Siklni yig'ing | yakuniy | 5 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Telegram | praktika | @BotFather orqali bot ochadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — 03:00  `[751]`
- Eyebrow: Kirish
- Sarlavha: **Soat 03:00. Siz uxlayapsiz. Mijoz botga yozdi — kim javob beradi?**
- Mentor: Tasavvur qiling: siz AvtoPizza uchun Telegram-bot yozgansiz. Tugmani bosing va nima bo'lishini ko'ring.
- Chat (AvtoPizza): mijoz «Salom, hali ochiqmisiz?» → bot «Salom! Ha, buyurtma qabul qilyapmiz. Menyuni ko'rasizmi?» · tugmalar: Menyu · Buyurtma · Manzil
- Tugma: ▶ Mijoz xabar yozdi (03:00) → ✓ Bot javob berdi (03:00)
- Savol: **Sizningcha, kim javob berdi?**
  - Men — telefonni olib, qo'lda javob berdim
  - Bot — men uxlaganimda ham o'zi javob berdi
  - Hech kim — mijoz kutib, ketib qoldi
- Javob — 2-variant: **Aynan!** Javobni bot berdi. Telegram botni shunday ta'riflaydi: odam emas, dastur boshqaradigan akkaunt. Dasturi ishlab tursa, bot kechasi ham javob beradi. Bugun u qanday ishlashini ko'ramiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Chatga qarang: javob 03:00 da, siz uxlab yotganingizda keldi. Uni bot yubordi — dastur boshqaradigan Telegram akkaunti. Bugun u qanday ishlashini ko'ramiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, chat (faqat mijoz xabari) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi).
Tugma bosilgach: chatda «yozmoqda…» (~0.8 s) → bot javobi va tugmalari → shundan keyin savol va 3 variant chiqadi → tanlangach javob izohi.
Animatsiya: «yozmoqda…» uch nuqtasi (chatning o'z ko'rinishi); chizish yo'q.
Olib tashlanadi: «Siz uxladingiz — lekin Botjon uxlamaydi…» ramkasi (javob izohi bilan bir ma'no).

✎ Botjon → bot · bot xabaridagi «24/7» olindi · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · Telegram ta'rifi qo'shildi (manba: telegram.org/blog/bot-revolution, 24.06.2015 — QA havolasi, F-0929-61) · savol tugmadan keyin chiqadi (**KOD**) · 🍕 🤖 olindi

## 1 · Reja  `[796]`
- Eyebrow: Reja
- Sarlavha: **Bugun: bot xabarni qanday qabul qiladi va qanday javob beradi.**
- Mentor: JS darslarida hodisani ko'rgansiz: tugma bosiladi — kod ishlaydi. Bot ham shunday: xabar keladi — handler ishlaydi va javob yuboradi.
- Chizma: `/start` (hodisa) → `bot.start` (handler) → «Salom!» (javob)
- Bugungi 4 qadam:
  1. Token, handler va sikl — botning uchta asosiy tushunchasi · *tushuncha*
  2. Hodisa → handler → javob · *asos*
  3. Tokenni qayerda saqlash kerak · *xavfsizlik*
  4. 03:00 sinovi — handlerlarni o'zingiz yozasiz · *amaliyot*
- Tugmalar: 4 qadamni ko'rish / ↩ Chizmani ko'rish (telefonda) · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → chizma chiziladi → shundan keyin 4 qadam birma-bir chiqadi.
Animatsiya: HA — `/start` qutisi → strelka chiziladi → `bot.start` → strelka chiziladi → «Salom!» (~1.2 s; hodisaning yo'nalishini ko'rsatadi; mavjud `SignalFlow playKey` shunga moslanadi).
Olib tashlanadi: «Signal keladi → Botjon qoidalar varag'idan mos qatorni qidiradi → amal bajaradi. Shu — botning butun ishi…» kartasi (QA F-0929-59: chizma bilan bir ma'no; «butun ishi» — ortiqcha da'vo) ·
«Jihozlar paneli» (qaror F-0929-63: butun moduldan olib tashlanadi — B-1).

✎ QA F-0929-58/60: sarlavha, Mentor va 01/03-qadamdagi «Botjon» olindi · «uch buyumi — kalit, varaq, aylana» → «uchta asosiy tushunchasi: token, handler, sikl» · «Kalit kimda — Botjon o'shaniki» → «Tokenni qayerda saqlash kerak» · Mentor sarlavhani takrorlamaydi — o'rniga JS'dagi hodisaga ko'prik (o'quvchi 2-Modulda «hodisa → reaksiya → o'zgarish» ni o'rgangan)

## 2 · Uch tushuncha  `[834]`
- Eyebrow: Tushuncha · uch asos
- Sarlavha: **Botning uchta asosiy tushunchasi: token, handler, sikl.**
- Mentor: Haqiqiy botda qismlar ko'proq bo'ladi, lekin hammasi shu uchtasiga tayanadi. Har birini bosing.
- Kartalar:
  - **Token** — Bot aynan sizniki ekanini tasdiqlaydigan maxfiy qator. Uni @BotFather beradi. Telegram uni botning kaliti deb ataydi: Bot API faqat to'g'ri token bilan kelgan so'rovni qabul qiladi.
  - **Handler** — «Shu hodisa kelsa, shuni qil» deydigan kod qismi. Masalan: /start kelsa — salom va menyu yuborilsin. Botda odatda bir nechta handler bo'ladi.
  - **Sikl** — Bot dasturi ishlab turadi va hodisani kutadi: kutadi → hodisa keladi → handler ishlaydi → javob ketadi → yana kutadi.
- Tugma: 3 tushunchani oching (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 tugma; bosilgani bitta kartada ochiladi (bir vaqtda bittasi).
Animatsiya: yo'q (sikl chizmasi 3-ekranda — ikki qo'shni ekranda takrorlanmaydi).
Olib tashlanadi: «Uchoviga ega bo'lsangiz — botingiz tayyor: 🔑 … 📋 … ↻ …» ramkasi (kartalarni qaytaradi; «tayyor» — ortiqcha da'vo).

✎ ChatGPT #5 va QA F-0929-60: «Unda bor-yo'g'i uchta narsa bor» → «hammasi shu uchtasiga tayanadi» (bot uch narsadan iborat degan noto'g'ri tasavvur qolmasin) · Ro'yxat idorasi / xizmat oynasi → @BotFather / Bot API · «isbotlaydigan» → «tasdiqlaydigan»

## 3 · Skript va bot  `[873]`
- Eyebrow: Tushuncha · skript va bot
- Sarlavha: **Bitta xabar, uch holat. Farqi nimada?**
- Mentor: Soat 03:00 da xabar keldi. Uni kim qanday kutib olishini bosib ko'ring.
- Kartalar:
  - **Siz** — Uxlab yotibsiz. Xabar javobsiz qoladi, uni ertalab ko'rasiz.
  - **Oddiy skript** — Yuqoridan pastga bir marta ishlaydi va tugaydi. Xabar kelganda u allaqachon to'xtagan — xabarni ko'rmaydi.
  - **Bot** — Dasturi ishlab turibdi va hodisani kutyapti. Xabar kelishi bilan mos handler ishlaydi va javob ketadi.
- Xulosa (3/3 dan keyin): Farq shunda: skript ishlab tugaydi, bot esa ishlab turadi va keyingi hodisani kutadi. Shuning uchun dasturi yoniq tursa, bot kechasi ham javob beradi.
- Tugma: Uchalasini sinang (N/3) → Davom etish

**Ko'rinish:** kartalar navbat bilan (hozirgidek); xulosa 3/3 dan keyin.
Animatsiya: HA — «Oddiy skript» kartasida chiziq yuqoridan pastga chiziladi va «tugadi» nuqtasida to'xtaydi; «Bot» kartasida chiziq doira bo'lib boshiga qaytadi (~0.8 s). Farqning o'zi — tugaydi ↔ qaytadi.

✎ «uch "ishchi"» olindi · «faqat Botjon … har doim, har signalga darhol» → «dasturi yoniq tursa» (ChatGPT #4) · «Skript» → «Oddiy skript»

## 4 · 1-savol ✅  `[913]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot oddiy skriptdan nimasi bilan farq qiladi?**
  - Internetsiz, faqat kompyuter ichida ishlaydi
  - Faqat bitta odam bilan gaplasha oladi
  - Bir marta yuqoridan pastga ishlab, to'xtaydi
  - ✔ Ishlab turadi va yangi hodisani kutadi
- To'g'ri: Bot sikl ichida ishlaydi — dasturi yoniq tursa, kechasi ham hodisani kutib, javob beradi.
- Xato izohlari:
  - Aksincha, bot Telegram orqali ishlaydi — internetsiz xabar kelmaydi.
  - Bot bir vaqtda ko'p odamdan xabar oladi — buni keyinroq sinab ko'rasiz.
  - Bu — oddiy skriptning ta'rifi. Bot esa ishlab tugamaydi, keyingi hodisani kutadi.
  - (umumiy) Bot — ishlab turadigan dastur: hodisani kutadi va unga javob beradi.

✎ Variantlar tenglashtirildi (oldin to'g'ri javob eng uzuni, «saytning ranglarini tanlaydi» — ishonarsiz variant edi) · «24/7» → «dasturi yoniq tursa»

## 5 · Bot API  `[933]`
- Eyebrow: Tushuncha · Bot API
- Sarlavha: **Tokensiz Bot API so'rovni qabul qilmaydi.**
- Mentor: Tokenni joyidan sudrab oling va nima bo'lishini kuzating. Keyin joyiga qaytaring.
- Sxema: Mijoz → Telegram → Bot API [token] → bot.js (handlerlar) → javob
- Ko'rsatma: tokenni shu yerga sudrang → / token olindi — qaytarish uchun Bot API'ga sudrang →
- Tokensiz: Token yo'q — Bot API so'rovni rad etdi. Xabar botingizga yetib kelmaydi, handler ishlamaydi.
- Qaytargach: Token joyida — xabar yana botga yetib keladi.
- Tugmalar: Tokenni sudrab oling → Tokenni qaytaring → Davom etish

**Ko'rinish:** sxema + token. Natija yozuvi bitta: «Tokensiz» chiqadi, token qaytarilgach uning o'rniga «Qaytargach» chiqadi — ikkalasi bir vaqtda turmaydi (**KOD**).
Animatsiya: HA — token olinganda Bot API dan bot.js ga boruvchi chiziq uziladi (xiralashadi); qaytarilganda qaytadan chiziladi.
Olib tashlanadi: Mentor gapidagi zanjir («Mijoz → Telegram → 🔑 Xizmat oynasi → 📋 Varaq → javob») — sxemaning o'zi shuni ko'rsatadi.

✎ «xizmat oynasi» → «Bot API» (ChatGPT #7; o'quvchi backend darslarida API'ni o'tgan) · «401 qaytardi» matndan olindi: tokensiz so'rovga Telegram aslida 404 beradi, 401 — noto'g'ri token uchun (kartochkada to'g'ri shaklda qoldi) · «hech qachon» olindi

## 6 · Tokenni qayerda saqlaysiz (markaziy)  `[987]`
- Eyebrow: Markaziy · token
- Sarlavha: **Tokenni qayerda saqlaysiz?**
- Mentor: @BotFather botingizni ro'yxatdan o'tkazdi va token berdi. Uni qayerda saqlashni o'zingiz tanlaysiz — keyin nima bo'lishini ko'ramiz.
- 1-qadam: @BotFather — `Token: 7***:AA***xZ` · tugma: Botni token bilan ishga tushirish → → ✓ Bot onlayn
- Tanlov:
  - A — bot.js ichida, kodning o'zida
  - B — .env faylida
- A tanlansa (oqibat, bittadan «Keyingisi →»):
  1. Kod GitHub'ga chiqdi — token qatorda ochiq turibdi.
  2. Notanish odam tokenni ko'rib, nusxalab oldi.
  3. Endi u o'z kodidan botingiz nomidan yozadi: mijozlarga «Chegirma! Shu kartaga pul o'tkazing» degan soxta xabar ketdi.
  4. Mijozlar shikoyat qilyapti. Botni endi ikki kishi boshqaryapti: siz va u.
- Tuzatish (Keyingisi → / Tuzatamiz → / Bajarildi ✓):
  1. @BotFather'da /revoke — eski token ishlamay qoladi, notanish odam botni boshqara olmaydi.
  2. @BotFather yangi token beradi.
  3. Yangi tokenni .env fayliga yozasiz — kodda faqat `process.env.BOT_TOKEN` qoladi.
- B natija: ✓ Token .env faylida · `# .env fayli .gitignore'da — Git uni commit qilmaydi` · `BOT_TOKEN=7***:AA***xZ`
- Bot holati (rangli nuqta + matn): oflayn — token yo'q · onlayn — token sizda · xavfda — tokenni notanish odam oldi · botni boshqa odam ham boshqaryapti
- Xulosa (oxirida): Token kimda bo'lsa, botni o'sha boshqaradi. Shuning uchun token kodga yozilmaydi — .env faylida saqlanadi, xuddi backend darslaridagi sirlar kabi.
- Tugma: Voqeani oxirigacha ko'ring → Davom etish

**Ko'rinish:** bosqichlar bittadan (hozirgidek). «Endi eng muhim savol: bu kalitni qayerda saqlaysiz?» + «Tanlovga o'tish →» bosqichi olinadi — sarlavha shu savolni beradi, «✓ Bot onlayn» dan keyin tanlov darhol chiqadi (**KOD**).
Oxirida bitta yashil ramka: xulosa (holat kartasi ostida); `.env` natijasi — ramkasiz kod oynasi (hozir ikki yashil ramka yonma-yon).
Animatsiya: yo'q (bosqichlarning o'zi voqeani ko'rsatadi).
Olib tashlanadi: 🔴 🟡 🟢 👀 📸 🎁 · «Tanlovga o'tish» bosqichi.

✎ QA F-0929-58: «Kalit kimda — Botjon o'shaniki» → «Tokenni qayerda saqlaysiz?» · ChatGPT #8 **Qisman:** voqea qoladi (Telegram'dagi «kartaga pul o'tkazing» firibgarligi o'smirga tanish, xavfni aniq ko'rsatadi), «50 000 so'm», emoji va dramatik gaplar olindi · «skrinshot oldi» → «kod GitHub'ga chiqdi» (tokenning eng ko'p oshkor bo'ladigan yo'li, 9-band bilan bog'liq) · «Botjon endi sizga javob bermaydi» → «botni ikki kishi boshqaryapti» (texnik jihatdan aniqroq) · ChatGPT #9: «.gitignore — GitHub'ga chiqmaydi» → «Git uni commit qilmaydi» · «revoke» → BotFather buyrug'i nomi bilan (/revoke) · «hech qachon ochiq kodda yotmaydi» → «kodga yozilmaydi»

## 7 · 03:00 sinovi (markaziy o'yin)  `[1224]`
- Eyebrow: Markaziy · handlerlar
- Sarlavha: **Bugun AvtoPizza botining handlerlarini o'zingiz yozasiz.**
- Mentor: Har qatorga hodisani va unga javobni tanlang. Hamma qator to'lmasa ham botni ishga tushirib ko'rishingiz mumkin — xato bo'lsa, tuzatib, qayta sinaysiz.
- Handlerlar (bot.js) · ustunlar: hodisa → javob · 5 qator
- Hodisalar: /start · «Menyu» tugmasi · /help · Boshqa har qanday xabar · /settings · Rasm yuborildi
- Javoblar: Salom va menyu yuboradi · Taomlar ro'yxatini yuboradi · Yordam matnini yuboradi · «Uzr, tushunmadim. /help ni bosing» · «Buyurtmangiz qabul qilindi» deydi · Botni butunlay o'chiradi
- Mijozlar (sinovda chiqadi): Aziza — /start · Bek — «Menyu» tugmasi · Dilnoza — /help · Sardor — «Pitsa bormi?»
- Natija yozuvlari: Javob oldi · Javobsiz qoldi — ketib qoldi · «Nima? Men hali hech narsa buyurtma qilmadim» · (mos emas)
- Sanoq: Javob oldi N/4 · Ketib qoldi N
- Xato bo'lsa: Handlerlarni tuzating: har hodisaga to'g'ri javob ulansin. Hech biriga mos kelmagan xabar uchun oxirgi qatorga fallback handler kerak.
- Muvaffaqiyat: 4/4 — hamma javob oldi, Sardor ham: uning xabariga fallback handler javob berdi. Bu botda javob faqat siz yozgan handlerdan keladi.
- Tugmalar: ▶ Botni ishga tushirish (03:00) · ↻ Qayta sinash · Sinovni yakunlang → Davom etish

**Ko'rinish (KOD — hozir 5 qator, 12 variant va tugma birdan chiqadi):**
1. Kirganda: faqat 1-qator va hodisalar ro'yxati.
2. Hodisa tanlangach → shu qator uchun javoblar ro'yxati ochiladi (hodisalar yig'iladi).
3. Qator to'lgach → «/start → Salom va menyu ✓» bitta qatorga yig'iladi (`↻` bilan o'zgartiriladi), keyingi qator ochiladi, «▶ Botni ishga tushirish» tugmasi chiqadi.
4. Ishga tushirilganda mijozlar birma-bir keladi (~1 s oraliq); natija-ramka (xato yoki muvaffaqiyat) — bittasi, sanoq ostida.

Animatsiya: HA — har mijoz xabaridan mos qatorga chiziq chiziladi, keyin javob chiqadi; mos qator bo'lmasa chiziq chizilmaydi, «…» qoladi (handler yo'q — bog'lanish ham yo'q).
Olib tashlanadi: Mentor gapidagi mijozlar ro'yxati va Sardor haqidagi ishora («hech qaysi qatorga aynan mos kelmaydi» — fallback kerakligini oldindan aytib qo'yardi, o'quvchi o'zi topmay qolardi) ·
«xato qilish MUMKIN» katta harfi · 📋 💤 ✅ 🟡 😕 · alohida xulosa ramkasi («Botjon o'zicha o'ylamaydi…» — muvaffaqiyat yozuvi bilan birlashdi).

✎ «tungi smena / qoidalar varag'i / signal / amal / chip» → «03:00 sinovi / handlerlar / hodisa / javob / —» · «Hech biri mos kelmasa» → «Boshqa har qanday xabar» (fallback — alohida xabar turi emas, qolgan hamma xabar) · «Botjon o'zicha o'ylamaydi» → «Bu botda» (6-darsda AI javobni o'zi yozadigan bot o'tiladi — umumiy gap u darsga zid bo'lardi)

## 8 · 2-savol ✅  `[1248]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Mos handler topilmasa, bot nima qiladi?**
  - ✔ Hech narsa yubormay, jim qoladi
  - O'zicha tasodifiy javob o'ylab topadi
  - Xabarni boshqa botga uzatib yuboradi
  - Xato chiqarib, butunlay o'chib qoladi
- To'g'ri: Javobni faqat siz yozgan handler beradi — mos handler bo'lmasa, bot jim qoladi.
- Xato izohlari:
  - Bu bot javobni o'zi o'ylab topmaydi — faqat handlerda yozilganini bajaradi. Javobni o'zi yozadigan AI-botni 6-darsda ko'rasiz.
  - Bunday avtomatik uzatish yo'q: mos handler bo'lmasa, javob ham bo'lmaydi.
  - Bot o'chmaydi: ishlashda davom etadi, faqat shu xabarga javob bermaydi.
  - (umumiy) Mos handler topilmasa, bot jim qoladi — fallback handler bo'lmasa.

✎ «Javob bermaydi — jim qoladi» → «Hech narsa yubormay, jim qoladi» (tire faqat to'g'ri javobda edi) · «Botjon o'zidan hech narsa o'ylab topmaydi» → «Bu bot…» + 6-darsga havola

## 9 · Bir vaqtda uch mijoz  `[1273]`
- Eyebrow: Hayotiy · bir vaqtda
- Sarlavha: **Uch mijoz bir vaqtda yozdi. Bot adashadimi?**
- Mentor: Avval har mijozni alohida bosing, keyin «Uchalasi birdan yozsin» tugmasini bosing.
- Qatorlar: Aziza — /start → salom va menyu · Bek — «Menyu» tugmasi → taomlar ro'yxati · Dilnoza — /help → yordam matni
- Tugma: ▶ Uchalasi birdan yozsin → ✓ Uchalasi o'z javobini oldi
- Xulosa: Har xabar — alohida hodisa. Bot har biri uchun o'z handlerini ishga tushiradi, shuning uchun javoblar aralashib ketmaydi.
- Tugma: Uchalasini birdan sinang → Davom etish

**Ko'rinish:** qatorlar bosilganda bittadan ochiladi; «Uchalasi birdan yozsin» tugmasi uchala qator ko'rilgach chiqadi (**KOD:** hozir boshidan bosiladi).
Animatsiya: HA — «Uchalasi birdan» bosilganda uch chiziq bir vaqtda chiziladi (har mijozdan o'z handleriga), keyin uch javob chiqadi.
Olib tashlanadi: Mentordagi «Har signalni Botjon alohida hodisa deb ko'radi» — javobni tajribadan oldin aytib qo'yardi; xulosa uni tajribadan keyin aytadi.

✎ «minglab mijoz bilan bir vaqtda "gaplasha" oladi» → olindi (ChatGPT #4: bu server va resursga bog'liq) · «Case · parallel» → «Hayotiy · bir vaqtda»

## 10 · 3-savol ✅  `[1314]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Token ochiq kodda qolib ketsa, qanday xavf bor?**
  - Hech qanday xavf yo'q, uni hech kim ko'rmaydi
  - Bot o'zi ishlashdan to'xtab qoladi
  - ✔ Boshqa odam bot nomidan xabar yubora oladi
  - Telegram botni darhol o'chirib qo'yadi
- To'g'ri: Token botni boshqarish huquqini beradi — uni ko'rgan odam botingiz nomidan yoza oladi.
- Xato izohlari:
  - Ochiq kod (masalan, GitHub'da) hammaga ko'rinadi — token ham.
  - Bot o'zi to'xtamaydi: ishlashda davom etadi, lekin endi uni boshqa odam ham boshqaradi.
  - Telegram buni o'zi bilmaydi — tokenni siz @BotFather'da bekor qilasiz (/revoke).
  - (umumiy) Token oshkor bo'lsa, boshqa odam bot nomidan yozishi mumkin.

✎ «Kimda kalit bo'lsa, Botjon o'shaniki» → «Token botni boshqarish huquqini beradi» · «kalit hech qachon ochiq bo'lmaydi» (distraktor) → «uni hech kim ko'rmaydi»

## 11 · Polling va webhook  `[1338]`
- Eyebrow: Tushuncha · polling va webhook
- Sarlavha: **Bot yangi xabarni qanday biladi? Ikki usul bor.**
- Mentor: Bot Telegram'dan xabarni ikki usulda oladi. Ikkalasini bosib ko'ring.
- Kartalar:
  - **Polling** — Bot Telegram'dan qayta-qayta so'raydi: «Yangi xabar bormi?». Sozlash oson, shuning uchun o'rganishda shu usul ishlatiladi.
  - **Webhook** — Yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.
- Xulosa: Ikkala usul ham xabarni botga yetkazadi. Darslarda avval polling bilan ishlaymiz; webhook'ni 7-darsda, botni serverga joylaganda yana ko'rasiz.
- Tugma: Ikkala usulni sinang (N/2) → Davom etish

**Ko'rinish:** 2 karta navbat bilan (bosilgani ochiladi).
Animatsiya: HA — Polling: bot → Telegram strelkasi uch marta qayta chiziladi, uchinchisida xabar qaytadi; Webhook: bot jim turadi, xabar kelganda bitta strelka Telegram → bot chiziladi. Farqning o'zi — strelka yo'nalishi va soni.

✎ «O'zi so'rab turish / Qo'ng'iroq» → «Polling / Webhook» (asosiy nom — atama; kartochkada ham shu nom) · webhook uchun ochiq manzil sharti qo'shildi · ChatGPT #10 (polling/webhook'ni keyingi darsga ko'chirish) — **Rad:** 3-dars buni o'rgatmaydi, 7-dars esa tayyor bilim sifatida ishlatadi

## 12 · To'liq suhbat  `[1378]`
- Eyebrow: Hayotiy · to'liq suhbat
- Sarlavha: **Butun buyurtma — ketma-ket hodisa va javoblar.**
- Mentor: Suhbatni qadam-baqadam oching va har qadamda qaysi hodisa kelganini kuzating.
- Suhbat:
  1. /start → «Salom! AvtoPizza botiga xush kelibsiz. Nima qilamiz?» [Menyu · Buyurtma] — *hodisa: /start → salom va tugmalar*
  2. Menyu → «Bizda: Margarita, Pepperoni, To'rt pishloq. Qaysi birini?» — *hodisa: «Menyu» tugmasi → taomlar ro'yxati*
  3. Pepperoni → «Ajoyib tanlov! Manzilingizni yuboring.» — *hodisa: taom tanlandi → manzil so'raladi*
  4. Chilonzor 5-kvartal → «Qabul qilindi. 25 daqiqada yetib boradi. Rahmat!» — *hodisa: manzil keldi → buyurtma tasdiqlandi*
- Tugmalar: ▶ Suhbatni boshlash · Keyingi xabar → · ✓ Buyurtma yakunlandi
- Xulosa: 4 hodisa — 4 javob. Lekin 4-qadamda bot qaysi pitsa tanlanganini eslab qolishi kerak — buning uchun holat kerak. Uni 4-darsda qo'shamiz.

**Ko'rinish:** hozirgidek — xabarlar navbat bilan; har xabar ostidagi izoh faqat o'sha xabar chiqqanda.
Animatsiya: «yozmoqda…» (0-ekrandagi bilan bir xil); chizish yo'q.

✎ 🔴 FAKT: «Mana shu — to'liq ishlaydigan bot. Bu — bugun siz yig'gan qoidalar varag'ining aynan o'zi» → noto'g'ri: 4-qadamda tanlangan pitsani eslab qolish kerak, 7-ekrandagi handlerlarda bu yo'q (holat — 4-dars) · Mentor sarlavhani takrorlardi → kuzatish vazifasi · 🍕 📍 ✅ olindi · «Zo'r tanlov» → «Ajoyib tanlov»

## 13 · Handlerlar kodda  `[1431]`
- Eyebrow: Amaliyot · kod
- Sarlavha: **Handlerlar kodda qanday yoziladi?**
- Mentor: Bu — bot.js. Kod Node.js uchun Telegraf kutubxonasi bilan yozilgan, uni 3-darsda o'rnatasiz. Uchta bo'shliqni navbat bilan to'ldiring.
- Kod:
  ```js
  // hodisa → javob:
  // sinovda yozgan handlerlaringiz
  bot.____((ctx) =>
    ctx.____('Salom!'))
  bot.____('Menyu', (ctx) =>
    ctx.reply('Bizning taomlar…'))
  ```
  ✎ 01.10 (F-1001-72, razrabotka): qatorlar qo'lda bo'lingan — telefonda satr string ichida bo'linardi (so'zlar o'sha).
- Bo'shliqlar (variantlar aralash — 4-savol A; to'g'risi: start · reply · hears): 1) hears / start / launch · 2) delete / forward / reply · 3) start / stop / hears
- Xato izohlari:
  - hears — matnli xabar uchun handler; /start uchun `start` bor.
  - launch — botni ishga tushiradi, handler emas.
  - delete — xabarni o'chiradi, javob yubormaydi.
  - forward — xabarni boshqa joyga uzatadi, bu javob emas.
  - start — faqat /start buyrug'i uchun; bu yerda «Menyu» matni keladi.
  - stop — botni to'xtatadi, handler emas.
- Muvaffaqiyat: To'g'ri: `bot.start` — /start uchun handler, `bot.hears` — matnli xabar uchun handler, `ctx.reply` — javob yuborish.
- Tugma: Bo'shliqlarni to'ldiring → Davom etish

**Ko'rinish (KOD — hozir 3 bo'shliqning 9 varianti birdan):** faqat joriy bo'shliq yonadi va uning 3 varianti ko'rinadi; to'g'ri tanlangach so'z kodga tushadi, keyingi bo'shliq ochiladi. Xato izohi — bitta, joriy bo'shliq ostida.
Animatsiya: yo'q.

✎ ChatGPT: Telegraf nomi — **Qabul** (3-darsda `new Telegraf(...)` shu kutubxona) · «Varaq to'ldi!» → atamalar bilan · `'Salom! 👋'` → `'Salom!'` (kodda emoji yo'q) · `stop` izohi aniqlandi (oldin «Bunday signal turi yo'q» — Telegraf'da `bot.stop()` bor) · «to'g'ri chipdan» olindi

## 14 · 4-savol ✅  `[1490]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Botga bir vaqtda uch mijoz yozsa, nima bo'ladi?**
  - Faqat birinchi xabarga javob berib, qolganini tashlab ketadi
  - Xabarlarni adashtirib, hammasiga tasodifiy javob beradi
  - Uchala xabarni bitta xabar deb qo'shib yuboradi
  - ✔ Har xabarni alohida ko'rib, har biriga mos javob beradi
- To'g'ri: Har xabar — alohida hodisa, shuning uchun har mijoz o'z javobini oladi.
- Xato izohlari:
  - Bot birinchi xabar bilan cheklanmaydi — har xabarga alohida javob beradi.
  - Bot tasodifiy ishlamaydi — har xabar uchun mos handlerni topadi.
  - Xabarlar qo'shilmaydi — har biri alohida hodisa.
  - (umumiy) Har xabar — alohida hodisa; bot har biriga mos javob beradi.

✎ «minglab mijoz bilan… hech kim boshqasini kutmaydi» → olindi (ChatGPT #4) · variantlarda hammasida «xabar» so'zi — atama faqat to'g'rida qolmasin

## 15 · Siklni yig'ing ✅ (final)  `[1519]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: botning ish siklini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar: Kutadi · Hodisa keladi · Mos handler topiladi · Handler ishni bajaradi · Javob yuboriladi
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · «bu yerga qo'ying»
- To'g'ri: ✓ Sikl tayyor: kutadi → hodisa keladi → handler topiladi → ish bajariladi → javob yuboriladi → yana kutadi.
- Javob ishdan oldin bo'lsa: Bot hali ishni qilmasdan «tayyor» dedi. Javob ishdan oldin ketsa, mijoz bajarilmagan ishni bajarildi deb o'ylaydi.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Siklni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi).
Animatsiya: HA — to'g'ri yig'ilgach 5-qadamdan 1-qadamga qaytuvchi strelka chiziladi (sikl yopiladi); faqat to'g'ri javobdan keyin.

✎ 🔴 Mentor «Diqqat: agar 💬 Javobni ⚡ Amaldan oldin qo'ysangiz — oqibatini ko'rasiz» → olindi: 4- va 5-qadam tartibini oldindan aytib qo'yardi · joy izohlari («keyin nima qidiriladi», «eng oxiri nima qaytariladi») → «1-qadam…» (tartibni ochib qo'yardi) · «Varaqdan qator topadi / Amal bajaradi» → «Mos handler topiladi / Handler ishni bajaradi» · 😕 📖 olindi

## 16 · Amaliyot · Telegram  `[2369]`
- Eyebrow: Amaliyot · Telegram · joy: «Telegram'ingizda»
- Sarlavha: **Birinchi botingizni ro'yxatdan o'tkazing**
- Topshiriq: Telegram'da @BotFather orqali o'z botingizni oching va tokenni xavfsiz saqlang. Bugun kod yozmaysiz — faqat botni yaratasiz.
- Umumiy matn: Topshiriqni o'z Telegram'ingizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Qadamlar:
  1. Telegram qidiruvida @BotFather'ni toping va oching (ismi yonida ko'k tasdiq belgisi bor).
  2. `/newbot` buyrug'ini yuboring.
  3. Botga ism bering, keyin foydalanuvchi nomi. Foydalanuvchi nomi «bot» bilan tugashi shart: masalan, `ismingiz_pizza_bot`.
  4. @BotFather bergan tokenni nusxalab, xavfsiz joyga saqlang. Uni hech kimga yubormang.
  5. Botingizni qidiruvdan topib, /start bosing. Bot hozircha jim turadi — uni ishlatadigan kod hali yo'q. Kodni 3-darsda yozasiz.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Bot ro'yxatdan o'tdi. Mentor tekshirib, keyingi qadamga o'tkazadi.»

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi.
Animatsiya: yo'q.

✎ 🔴 FAKT: «masalan, mening_botim» — @BotFather bu nomni qabul qilmaydi (foydalanuvchi nomi «bot» bilan tugashi shart) · ko'k belgi qo'shildi (soxta «BotFather» akkauntlari bor) · «jim bo'lishi mumkin — qoidalar varag'i hali yo'q» → «jim turadi — kod hali yo'q» · «ustoz» → «Mentor» (darsning boshqa joylarida Mentor) · 🔑 ✅ olindi · Botjoningizni → botingizni

## 17 · Natijalar (podium)  `[2116]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — B-5.)

## 18 · Takrorlash (kartochkalar)  `[2383]`
- Sarlavha: **O'zingizni sinab ko'ring.**

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

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …)

✎ 3-kartochka «Qoidalar varag'ida» → «ctx.reply» (13-ekranda o'tilgan) · 8-kartochka: «Kalitsiz ochilmaydi — javob o'rniga 401» → «Token noto'g'ri bo'lsa, 401» (texnik aniq) · qolgani A1 jadvali bo'yicha

## 19 · Yakun  `[2410]`
- Eyebrow: Tayyor · belgi: ✓ Bot qanday ishlashini bilasiz
- Sarlavha: **Endi bot qanday ishlashini bilasiz.**
- Endi siz bilasiz:
  - Bot — dastur boshqaradigan Telegram akkaunti
  - Botga kelgan har xabar — hodisa; unga handler javob beradi
  - Token bot sizniki ekanini tasdiqlaydi — u kodda emas, .env faylida saqlanadi
  - Mos handler bo'lmasa, bot jim qoladi — shuning uchun fallback handler yoziladi
  - Bot sikli: kutadi → hodisa → handler → javob → yana kutadi
- Uyga vazifa:
  - **O'ylang** — kundalik hayotda qaysi ishni bot bajarishi mumkin? 3 ta g'oya yozing
  - **Yozing** — har g'oya uchun kamida bitta «hodisa → javob» juftini yozing (masalan: /start → salom va menyu)
  - **Saqlang** — @BotFather bergan tokenni xavfsiz joyda saqlang: u 3-darsda kerak bo'ladi
- Uyga vazifa · Amaliy topshiriqni bajarish →
- Keyingi dars — **«Botingizni birinchi kim ochadi?»** Botingizni birinchi bo'lib ishlatadigan yigirma kishini qayerdan topishni rejalashtiramiz.
- Arena tugmasi · Mentorni kuting · Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

Olib tashlanadi: «Endi Botjon siz uchun aniq mantiq: signal keladi — amal bajariladi» (ro'yxatning 2-bandi bilan bir ma'no) · 🚀 📝 ⏳ 🏅 (matn oldidagi).

✎ 🔴 FAKT: «Keyingi dars — Telegram Bot API: @BotFather bilan birinchi haqiqiy botingizni yaratamiz» → App.jsx bo'yicha keyingi dars PM (m5-02); bundan tashqari bot 16-ekranda allaqachon yaratilgan · 🔴 «kalitingiz ertaga kerak bo'ladi» → «3-darsda» (keyingi dars — PM, token unda kerak emas) · «daftarga yozing» → «yozing» (F-0929-51) · «Botjon nima ekanini tushundingiz» → yangi sarlavha

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Token Keeper** (hozir Key Master) — Tokenni .env fayliga joyladingiz
- **All Served** (hozir Sheet Master) — 03:00 sinovida 4 mijozning hammasi javob oldi
- **Never Silent** — Fallback handler yozdingiz: hech kim javobsiz qolmadi
- **Handler Writer** (hozir Sheet Writer) — bot.js dagi handlerlarni birinchi urinishda to'g'ri to'ldirdingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; har oyna ostida «Belgilar» qatori:
1. (4) **Bot — ishlab turadigan dastur:** Kutadi — dasturi ishlab turadi va yangi hodisani kutadi. · Hodisa kelsa, handler ishlaydi — mos handler javob yuboradi. · Yana kutadi — javobdan keyin sikl boshiga qaytadi. · Sinfga savol: Bot oddiy skriptdan nimasi bilan farq qiladi?
2. (8) **Fallback — jim qolmaslik:** Bot mos handlerni qidiradi. · Topilmasa, jim qoladi — bu bot javobni o'zi o'ylab topmaydi. · Yechim — fallback handler: oxirgi umumiy handler hech kimni javobsiz qoldirmaydi. · Sinfga savol: Mos handler topilmasa, bot nima qiladi?
3. (10) **Token oshkor bo'lsa:** Token botni boshqarish huquqini beradi. · Ochiq kodda qolsa, boshqa odam bot nomidan yoza oladi. · Yechim — /revoke va yangi tokenni .env ga yozish. · Sinfga savol: Token oshkor bo'lsa, nima xavfli?
4. (14) **Bir vaqtda ko'p xabar:** Har xabar — alohida hodisa. · Har biri uchun o'z handleri ishlaydi. · Javoblar aralashmaydi — har mijoz o'z javobini oladi. · Sinfga savol: Uch mijoz bir vaqtda yozsa, bot nima qiladi?
5. (15) **Sikl — tartib muhim:** Avval — kutish. · Keyin — handler topiladi va ish bajariladi. · Eng oxiri — javob: faqat ish bajarilgach. · Sinfga savol: Nega javob ishdan oldin ketmasligi kerak?
- Belgilar (U3): 1-oyna — `bot.launch()` · `bot.start((ctx) => …)` · 3 | 2-oyna — `bot.hears('Menyu', …)` · 2 · `bot.on('text', …)` | 3-oyna — `BOT_TOKEN=...` · `new Telegraf('1234…')` · `/revoke` | 4-oyna — 1 · `(ctx) => …` · `ctx.reply(…)` | 5-oyna — 1 · 2 · 3 (tartibning o'zi — raqam)

✎ «Parallel signal — event-driven» → «Bir vaqtda ko'p xabar» · «Hech kim kutmaydi» → olindi (kafolat) · 👂 📩 ↻ olindi

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. «Shu hodisa kelsa, shuni qil» deydigan kod qismi nima deyiladi? ✔ Handler · Token · Webhook · .env fayli
2. Token nima uchun kerak? Botning rangini belgilaydi · Xabarlarni boshqa tilga o'giradi · ✔ Bot aynan sizniki ekanini tasdiqlaydi · Foydalanuvchi parolini saqlaydi
3. Foydalanuvchi botga /start yubordi. Bu nima? Bu — botning javobi · ✔ Bu — botga kelgan hodisa · Bu — botning tokeni · Bu — handlerlar ro'yxati
4. Mos handler topilmasa (fallback ham yo'q), bot nima qiladi? Xato chiqarib o'chib qoladi · Tasodifiy javob o'ylab topadi · Boshqa botga ulanib qoladi · ✔ Hech narsa yubormay, jim qoladi
5. Bot tokenini kim beradi? Telegram administratori · Foydalanuvchining o'zi o'ylab topadi · ✔ @BotFather · Bot API'ning o'zi yaratadi
6. Token ochiq kodda qolib ketsa, qanday xavf bor? ✔ Boshqa odam bot nomidan xabar yozadi · Bot o'zi tezroq ishlay boshlaydi · Hech qanday xavf yo'q, tinch bo'ling · Telegram botni darhol o'chirib qo'yadi
7. Token oshkor bo'lsa, birinchi qadam nima? Botni /deletebot bilan butunlay o'chirish · Telegram'ni qayta o'rnatish · Yangi Telegram akkaunt ochish · ✔ Tokenni /revoke bilan bekor qilish
8. Token odatda qayerda saqlanadi? bot.js faylining o'zida · ✔ .env faylida · Telegram profil sozlamasida · Brauzer qidiruv tarixida
   ✎ 01.10 (F-1001-64, razrabotka): 7, 8-savolda bitta xato variant `lint:tell` uchun («/revoke», «.env» — texnik atama faqat to'g'rida edi); ✔ o'rni o'sha.
9. Bot nega 03:00 da ham javob bera oladi? Uni uxlamaydigan odam boshqaradi · ✔ Dasturi ishlab turadi va hodisani kutadi · U faqat kunduzi ishlashga sozlangan · U tasodifiy vaqtda ishga tushadi
10. Uch mijoz bir vaqtda yozsa, bot nima qiladi? Faqat birinchi mijozga javob beradi · Uchala xabarni bitta deb qo'shib yuboradi · Hammasini ertalabgacha kutdirib qo'yadi · ✔ Har xabarni alohida ko'rib, javob beradi
11. Hech bir handlerga mos kelmagan xabar kelsa, nima yordam beradi? ✔ Oxirgi, umumiy fallback handler · Botni o'chirib, qayta yoqish · Bot API'ni vaqtincha yopish · Yangi token olish
12. Bugun o'rgangan uchta asosiy tushuncha qaysi? Rang, shrift va sayt dizayni · Ekran, sichqoncha, klaviatura · ✔ Token, handler va sikl · Rasm, video va ovoz fayli

✎ 3-savol: «(action atamasi) / (trigger) / (handler)» qavslari faqat variantlarda edi → olindi · 7-savol: to'g'ri javob eng uzuni va qavsli edi → qisqartirildi ·
🔴 10-savol: «Navbatga qo'yib, keyinroq javob beradi» distraktori qisman to'g'ri (bot xabarlarni navbat bilan, lekin tez ishlaydi) → «Hammasini ertalabgacha kutdirib qo'yadi» ·
12-savol: «Server, baza, sayt dizayni» distraktori qisman to'g'ri (bot serverda ishlaydi, 4-darsda baza qo'shiladi) → «Rang, shrift va sayt dizayni»

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» / «Qiziq fikr!»).
2. s1 — sk-info kartasi va `GearPanel` olinadi; `SignalFlow` strelkalari chiziladi, keyin 4 qadam birma-bir chiqadi.
3. s2 — xulosa `frame-success` olinadi.
4. s3 — skript/bot kartalarida chiziq animatsiyasi.
5. s5 — ikki natija-ramka bitta joyda o'rin almashadi; token olinganda chiziq uziladi/qaytadi.
6. s6 — `lock` bosqichi olinadi (register → choice); oxirida bitta yashil ramka; holat emojisi olinadi (CSS nuqta qoladi).
7. s7 — `NightShift` navbatli ochilish (qator → hodisa → javob → ✓ yig'ilish → keyingi qator); ishga tushirish tugmasi 1-qatordan keyin; mijozdan qatorga chiziq animatsiyasi; alohida xulosa ramkasi olinadi.
8. s9 — «Uchalasi birdan» tugmasi 3/3 dan keyin; uch chiziq animatsiyasi.
9. s11 — polling/webhook strelka animatsiyasi.
10. s13 — bo'shliqlar navbat bilan (faqat joriy bo'shliq variantlari).
11. s15 — slot yorliqlari «1-qadam…»; to'g'ri yig'ilgach qaytuvchi strelka.
12. s16 — `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa; boshqa 7 darsda o'z nusxasi bor).
12b. 30.09 javoblari: test oynalaridagi to'g'ri javob izohi — bitta gap, «To'g'ri!» siz (4 ta test); 13-ekran bo'shliq variantlari aralash, nishon sharti variant matni bo'yicha.
12a. Butun dars — UI qoidalari U1–U3 (30.09): harakat tugmalari bitta asosiy uslubda, ochiladigan kartalarda `›` / `✓`, hook tanlovi neytral rangda, `TgChat` oraliqlari va so'z bo'linmasligi, kod o'z kartasida o'raladi, ⛶ matn ustiga tushmaydi, RECAPS `ic` → kod misoli («Belgilar» qatori).
13. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`), RECAPS `ic` → kod misoli yoki raqam (U3), nishon nomlari (`name` maydoni).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — ✅ qaror F-0929-63: 7 darsning (1, 4, 5, 6, 7, 9, 10) Reja ekranidan olib tashlanadi; Yakunga ham qo'yilmaydi. Har dars v2 KOD ro'yxatida.
2. **App.jsx m5-01 `sub`** «signal keladi, bot amal qiladi» → «hodisa keladi, bot javob beradi» (App.jsx — chegaradan tashqarida).
3. **3-dars v2:** hook @BotFather'da bot ochishni qayta ko'rsatadi, holbuki o'quvchi botni 1-darsda (16-ekran) ochgan. 3-dars «1-darsda ochgan botingiz» dan boshlanishi kerak. 3-darsda «Botjon (Telegraf obyekti)» ham bor.
4. **«Aylana» 9-darsda** boshqa ma'noda (fikr → yaxshilash takrori, 41 marta). 9-dars v2 da o'z nomi tanlanadi (masalan, «iteratsiya»), botning ish sikli bilan aralashmasin.
5. **«sessiya»** (podium) — barcha darslarda bir xil shablon → KATTA_TOZALASH nomzodi (umumiy fayl — yozilmaydi).
6. **RU matni** — o'zbekcha tasdiqlangach.
7. **Qonun nomzodlari** N3–N6 → `QONUN_NOMZODLARI.md`.
