# 5-Modul (LMS: 7-Modul) · 5-dars «Loyiha kuni: AI bilan bot» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotAiProjectLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

Fayl ichidagi dars nomi (LMS natijasiga ketadi): «Loyiha kuni: AI bilan istalgan bot» `[73]` · jonli dars kirish oynasi sarlavhasi: «Botjon darsi» `[3177]`

---

## Darsning ipi

- **Hook:** o'quvchi ikki topshiriqni — «menga Telegram bot yasab ber» va aniq Telegraf-viktorina topshirig'ini — «AI'ga yuboradi», ikki natijani solishtiradi va qaysi topshiriq yaxshiroq bot berishini tanlaydi.
- **Misol-ip:** MyQuizBot — viktorina boti (0, 1, 5, 6, 7-ekranlar); yonida buyurtma va eslatma botlari (2, 12-ekranlar).
- **Markaziy o'yin (7-ekran):** AI yozgan viktorina botini sinaydi → «Boshlash» ishlaydi, A/B/C javob bermaydi → sababini tanlaydi (handler yo'q) → tuzatish topshirig'ini yuboradi → qayta sinaydi. Unga olib boradigan yo'l: reja (2) → 4 qismli topshiriq (3, 5) → AI kodini o'qish (6).
- **Asosiy metafora:** «siz — direktor, AI — yozuvchi» (vibecoding); «rul sizda»; Botjon to'liq jihozlangan (8/8 buyum).
- **Yakun:** 6 bo'lakli yo'lni tartibga soladi (Reja → Aniq topshiriq → AI kod yozadi → Kodni o'qish → Test → Iteratsiya), keyin o'z botini AI bilan qurish praktikasi, 12 kartochka, 5 xulosa + uyga vazifa. Yakun ekranida «modulning so'nggi darsi» deyiladi, keyingi dars aytilmaydi.

---

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — ikki topshiriq | hook | ikki topshiriqni AI'ga yuboradi, natijani solishtiradi, yaxshisini tanlaydi | — |
| 1 | Reja | qoida | «direktor / yozuvchi», MyQuizBot natijasi, 8/8 jihoz paneli, bugungi 4 qadam | — |
| 2 | Avval reja | tushuncha | 3 bot g'oyasini bosib, har birining trigger → action rejasini ko'radi | — |
| 3 | Topshiriq tuzilishi | tushuncha | yaxshi topshiriqning 4 qismini bosib o'qiydi | — |
| 4 | 1-savol | test | nega «menga bot yasab ber» yomon topshiriq | ✅ |
| 5 | Topshiriq yig'ish | amaliyot | 4 qismni qo'shib, viktorina boti topshirig'ini yig'adi | — |
| 6 | AI kodi · o'qish | case | topshiriqni yuboradi, AI kodini va uning izohini o'qiydi | — |
| 7 | Vibecoding sikli | markaziy o'yin | botni sinaydi, xatoni topadi, tuzatish topshirig'ini beradi, qayta sinaydi | — (nishon) |
| 8 | 2-savol | test | AI kod bergach birinchi nima qilinadi | ✅ |
| 9 | AI xatolari | tushuncha | AI'ning 4 tez-tez xatosini bosib o'qiydi | — |
| 10 | 3-savol | test | inline tugma bosildi, bot jim — sabab | ✅ |
| 11 | Falsafa · direktor | tushuncha | «ko'r-ko'rona nusxalovchi» va «direktor»ni solishtiradi | — |
| 12 | To'liq qurish (eslatma boti) | case | eslatma boti hikoyasini 5 qadamda ochadi | — |
| 13 | O'zingiznikini | tushuncha | ikki eslatma (reja, lokal/hosting) + «to'liq jihozlangan» | — |
| 14 | 4-savol | test | AI bilan bot qurishning to'g'ri tartibi | ✅ |
| 15 | Jarayonni yig'ing | yakuniy | 6 bo'lakni sudrab to'g'ri tartibga qo'yadi | ✅ (final) |
| 16 | Amaliyot · Loyiha kuni | praktika | o'z botini AI chat bilan quradi (5 bosqich) | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa + nishonlar | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta (4, 8, 10, 14, 15-ekran uchun; 15-ekranda uni ochadigan tugma yo'q); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
direktor (siz) · yozuvchi (AI) · vibecoding · topshiriq / buyruq (prompt) · noaniq topshiriq · aniq topshiriq · reja · trigger → action (juftliklar) ·
4 qism: texnologiya, trigger → action, tugma turi, token · AI kodini o'qish · ko'r-ko'rona · test → tuzatish · iteratsiya · handler · bot.action · callback ·
inline / reply tugma · token .env'dan · rul sizda · naqsh · xato detektori · Botjon to'liq jihozlangan: kalit, varaq, daftar, maslahatchi, sumka

---

## 0 · Kirish — ikki topshiriq  `[765]`
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Bugun AI bilan to'liq bot yasaymiz. Lekin qaysi topshiriq yaxshiroq bot beradi?**
- Mentor: Bot ichini butun modul davomida o'rgandingiz. Endi kodni AI yozadi — lekin natija sizning buyrug'ingizga bog'liq. Tugmani bosing va ikki topshiriqni solishtiring.
- Karta «Noaniq topshiriq»: menga Telegram bot yasab ber
  - bosilgach: 🤖 AI: tasodifiy til, noma'lum tugma turi, token kodda ochiq — ko'p narsa o'zi to'qildi. Buzilsa, qayerdan ekanini bilmaysiz.
- Karta «Aniq topshiriq»: Telegraf'da viktorina boti: /start → Boshlash inline tugma → savol + A/B/C inline variant → javobga to'g'ri/xato. Token .env'dan olinsin.
  - bosilgach: 🤖 AI: aniq Telegraf kodi, inline tugmalar, token xavfsiz. Har qatorni tushunasiz, chunki o'zingiz buyurdingiz.
- Tugma: ▶ AI ikkalasiga javob bersin → ✓ Ikki natija solishtirildi
- Savol (tugma bosilmaguncha xira): **Qaysi topshiriq yaxshiroq bot beradi?**
  - Chapdagi — "bot yasab ber" — qisqa va oson
  - O'ngdagi — aniq: trigger→action va texnologiya bilan
  - Farqi yo'q — AI baribir o'zi to'g'ri qiladi
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! **Aniq topshiriq** yaxshi bot beradi — chunki nima xohlayotganingizni bilasiz. Bugun shunday aniq buyruq yozishni va AI kodini tekshirishni o'rganamiz.
- Tugma: Davom etish

## 1 · Reja  `[806]`
- Eyebrow: Reja
- Sarlavha: **Bugun siz — direktor. AI — yozuvchi. Birga bot quramiz.**
- Mentor: Loyiha kuni! Botjon endi to'liq jihozlangan — **8/8 buyum** yondi: kalit, varaq, daftar, maslahatchi va sumka. AI kodni yozadi, lekin **rul sizda**: rejani, buyruqni, tekshiruvni siz qilasiz.
- Yorliq: dars oxirida — shu botni AI bilan qurib, tekshirasiz
- Chat «MyQuizBot»: foydalanuvchi /start → bot «🧠 Viktorinaga xush kelibsiz! Tayyormisiz?» · tugma ▶ Boshlash
- Izoh: Siz buyurasiz — AI yozadi — siz tekshirasiz. Bugungi maqsad: AI bilan **ishonchli** bot qurish, ko'r-ko'rona emas.
- Jihozlar paneli — 8 tasi ham yonadi: Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · Yo'l-yo'riq · Vositalar · AI yordamchi
- Bugungi 4 qadam:
  1. G'oya → trigger → action rejasi · *reja*
  2. Aniq topshiriq yozish (4 qism) · *buyruq*
  3. AI kodini o'qib tekshirish · *nazorat*
  4. Test va tuzatish (iteratsiya) · *sikl*
- Tugmalar: (telefonda) 4 qadamni ko'rish / ↩ Natijani ko'rish · Orqaga · Boshlaymiz →

## 2 · Avval reja  `[846]`
- Eyebrow: Reja · trigger→action
- Sarlavha: **Topshiriqdan oldin — reja. Bot nimani qiladi?**
- Mentor: AI'ga buyruq berishdan oldin botingizni **trigger → action** juftliklariga ajrating. Rejasiz topshiriq — noaniq bot. Har g'oyani bosib, uning rejasini ko'ring.
- G'oya tugmalari: Viktorina boti · Buyurtma boti · Eslatma boti (ko'rilgani ✓ bilan belgilanadi)
- O'ng yorliq: «reja» → bosilgach «<g'oya nomi> — rejasi»
- **Viktorina boti:** 1) /start → boshlash tugmasi · 2) Boshlash tugmasi → savol + A/B/C variant · 3) Javob tanlandi → to'g'ri/xato deydi · 4) /ball → yig'ilgan ballni ko'rsatadi
- **Buyurtma boti:** 1) /start → salom + menyu tugmasi · 2) Menyu tugmasi → taomlar ro'yxati · 3) Taom tanlandi → manzil so'raydi · 4) Manzil yuborildi → buyurtmani tasdiqlaydi
- **Eslatma boti:** 1) /start → qisqa qo'llanma · 2) Eslatma matni → saqlaydi · 3) /royxat → eslatmalarni ko'rsatadi · 4) /ochir → eslatmani o'chiradi
- Uchalasi ko'rilgach: Har bot — bu trigger → action ro'yxati, xolos. Shu ro'yxatni AI'ga bersangiz, u aniq kod yozadi.
- Tugma: 3 g'oyani ko'ring (0/3) → Davom etish

## 3 · Topshiriq tuzilishi  `[879]`
- Eyebrow: Topshiriq tuzilishi
- Sarlavha: **Yaxshi topshiriq — 4 qismdan iborat.**
- Mentor: Aniq topshiriq 4 narsani aytadi: texnologiya, trigger→action, tugma turi va token. Har qismni bosib, nega muhimligini ko'ring — bularning hammasini siz bilasiz, AI emas.
- Kartalar (bosilganda: nomi · "namuna" · nega muhim) `[746]`:
  - **Texnologiya** — "Node.js va Telegraf kutubxonasida yoz" — AI qaysi texnologiyani ishlatishini aniq biladi — tasodifiy tanlamaydi.
  - **trigger → action** — "/start → menyu, Boshlash → savol, javob → to'g'ri/xato" — Botning butun mantig'i. Buni bermasangiz, AI o'zi to'qib chiqaradi.
  - **Tugma turi** — "variantlar uchun inline tugma ishlat" — Inline yoki reply — buni siz hal qilasiz, AI emas (o'tgan darsda o'rgandingiz).
  - **Token .env** — "token .env'dan (process.env.BOT_TOKEN) olinsin" — Aks holda AI tokenni kodga ochiq yozib qo'yishi mumkin — bu xavfli.
- Yakun: 4 qism = aniq buyruq. AI taxmin qilmaydi, siz aytganini qiladi. Mana bu — direktorlik.
- Tugma: 4 qismni oching (0/4) → Davom etish

## 4 · 1-savol ✅  `[917]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega "menga bot yasab ber" yomon topshiriq?**
  - A — AI o'zbek tilini umuman tushunmay qoladi
  - B — Juda uzun — AI bunday uzun va chalkash matnni o'qiy olmaydi
  - C — ✔ Juda noaniq — AI texnologiya va tokenni o'zi to'qiydi
  - D — Bot yasash umuman AI ning qo'lidan kelmaydi
- To'g'ri: To'g'ri! Noaniq topshiriq AI'ga juda ko'p qaror qoldiradi — u o'zi tanlaydi va siz nima chiqishini nazorat qila olmaysiz. Aniq topshiriq bilan natijani siz boshqarasiz.
- Xato izohlari:
  - A: AI o'zbekchani ham tushunadi. Muammo tilda emas — buyruq noaniqligida.
  - B: Aksincha — u juda QISQA (noaniq). AI uzun, batafsil topshiriqlarni yaxshi tushunadi.
  - D: Bot yasash AI bilan zo'r ishlaydi — faqat aniq buyruq bering. Muammo shunda.
  - (umumiy) Noaniq topshiriq → AI o'zi to'qiydi → nazorat yo'qoladi.
- Nishon: 🎯 Prompt Smith (birinchi urinishda to'g'ri bo'lsa)

## 5 · Topshiriq yig'ish  `[937]`
- Eyebrow: Topshiriq yig'ish
- Sarlavha: **Endi siz viktorina boti uchun aniq topshiriq yig'ing.**
- Mentor: Pastdagi 4 qismni bosib, topshirig'ingizga qo'shing. Har qism qo'shilgani sayin o'ngdagi topshiriq to'liqlashib boradi — mana shu buyruqni AI'ga berasiz.
- Chap yorliq: qismlarni qo'shing · tugmalar: Texnologiya + · trigger → action + · Tugma turi + · Token .env + (qo'shilgach ✓)
- O'ng yorliq: sizning topshirig'ingiz · karta «🧑‍💻 Siz → AI»
  - bo'sh holatda: Qismlarni qo'shing — topshiriq shu yerda yig'iladi…
  - yig'iladigan matn: Viktorina boti yoz. + Node.js + Telegraf'da. + /start → Boshlash tugma → savol + A/B/C variant → javobga to'g'ri/xato. + Variantlar uchun inline tugma ishlat. + Token .env'dan (process.env.BOT_TOKEN) olinsin.
- Yakun: Mana — aniq, to'liq buyruq. AI endi taxmin qilmaydi. Keyingi ekranda u shu topshiriq asosida kod yozadi.
- Tugma: Topshiriqni yig'ing (0/4) → Davom etish

## 6 · AI kodi · o'qish  `[972]`
- Eyebrow: AI kodi · o'qish
- Sarlavha: **AI kod yozdi. Endi eng muhim qadam: uni o'qib tushunish.**
- Mentor: AI kodni soniyada yozadi. Lekin uni **ko'r-ko'rona qabul qilmang** — har qismini tushuning. Yaxshiyamki, bularning hammasini o'tgan darslarda o'rgandingiz. Tugmani bosing.
- Tugma: AI'ga topshiriqni yuborish → «🤖 AI kod yozyapti…»
- Kod (fayl nomi `quiz.bot.js`):
  ```js
  const bot = new Telegraf(process.env.BOT_TOKEN)

  bot.start((ctx) =>
    ctx.reply('🧠 Tayyormisiz?',
      Markup.inlineKeyboard([
        Markup.button.callback('▶ Boshlash', 'start_quiz')
      ])))
  ```
- O'ng yorliq: kod tushuntirilishi
  - bot.start → /start trigger — botni boshlaydi
  - Markup.button.callback → inline tugma — siz so'ragandek
  - process.env.BOT_TOKEN → token .env'dan — xavfsiz
- Yakun: Har qatorni tanidingiz: bot.start (trigger), inline tugma, .env token. Siz so'raganingiz aynan bajarildi — buni tekshira oldingiz.
- Tugma: AI kodini yozsin → Davom etish

## 7 · Vibecoding sikli (markaziy o'yin)  `[1015]`
- Eyebrow: Vibecoding · test → tuzatish
- Sarlavha: **Kod tayyor — lekin ishlaydimi? Test qilib, tuzatamiz.**
- Mentor: AI yozgan kodni doim **test qiling**. Botni ishga tushiring, tugmalarni bosing. Nimadir ishlamasa — tushunganingiz uchun muammoni topasiz va aniq tuzatish topshirig'ini berasiz.
- Nishon qatori: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato tanlansa) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Chat «MyQuizBot (test)»: /start → «🧠 Tayyormisiz?» [▶ Boshlash] → (bosilgach) «Savol: Telegraf qaysi tilda? (A: Python B: JS/Node C: Go)» [A · B · C]
- «Boshlash» bosilgach: ⚠️ "Boshlash" ishladi, lekin **A/B/C tugmalarini bosing** — nima bo'ladi?
- A/B/C bosilgach (tuzatishdan oldin): 🐞 Tugmani bosdingiz — bot **javob bermadi**! Sababi nima deb o'ylaysiz?
  - ✔ 'start_quiz' tugmasiga bot.action handleri yozilmagan
  - Token noto'g'ri
  - Internet yo'q
- Xato sabab tanlansa: Bu sabab emas — qaytadan o'ylang. (Maslahat: tugma bosilsa-yu javob bo'lmasa, handler yetishmaydi.)
- To'g'ri sabab: ✓ Topdingiz! AI bot.action('start_quiz') dan keyingi javob tugmalariga handler yozmagan. Endi AI'ga aniq tuzatish buyrug'ini bering.
- Karta «Siz → AI (tuzatish)»: A/B/C javob tugmalari uchun bot.action handlerini qo'sh: to'g'ri javob B bo'lsa "To'g'ri", aks holda "Xato" deb javob bersin.
- Tugma: Tuzatish topshirig'ini yuborish → «🤖 AI handlerni qo'shyapti…»
- Tuzatilgach: ✓ AI handler qo'shdi! Endi chapda **A/B/C tugmasini qayta bosing** — ishlaydimi, tekshiring.
- Bot javobi: B → «✅ To'g'ri! Telegraf — Node.js (JS).» · A yoki C → «❌ Xato. To'g'ri javob: B (Node.js).»
- Yakun: 🎉 Bot to'liq ishladi! Mana sikl: **test → muammoni topish → aniq tuzatish → qayta test**. Bu — AI bilan ishlashning to'g'ri yo'li.
- Tugma: Botni test qilib, tuzating → Davom etish
- Nishon: 🐞 Bug Catcher (sabab birinchi urinishda topilsa)

## 8 · 2-savol ✅  `[1077]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AI kod bergach, birinchi nima qilasiz?**
  - A — ✔ Kodni o'qib tushunaman va botni test qilaman
  - B — Hech narsa o'qimasdan to'g'ridan-to'g'ri ishlatib yuboraman
  - C — Kodni o'chiraman va o'zim qaytadan yozaman
  - D — AI'dan yana bir marta so'rayman, baribir
- To'g'ri: To'g'ri! AI kodini doim o'qib tushunish va test qilish kerak. Shunda xato/kamchilikni topib, aniq tuzatish topshirig'ini bera olasiz. Bu — direktorlik.
- Xato izohlari:
  - B: Xavfli — tekshirilmagan kod buzuq bo'lishi mumkin (masalan handler yetishmasligi). Avval o'qing va test qiling.
  - C: Shart emas — AI kodi ko'pincha yaxshi. Faqat uni tushunib, tekshirib, kerak bo'lsa tuzatish kerak.
  - D: Maqsadsiz qayta so'rash yordam bermaydi. Avval o'qib, muammoni aniqlab, keyin aniq tuzatish so'rang.
  - (umumiy) AI kodini o'qib tushunib, test qilish kerak.

## 9 · AI xatolari  `[1097]`
- Eyebrow: AI xatolari
- Sarlavha: **AI ham xato qiladi. Tushunsangiz — tutasiz.**
- Mentor: AI kuchli, lekin mukammal emas. Mana eng tez-tez uchraydigan 4 xato. Har birini bosing — va e'tibor bering: ularning hammasini siz **tushunganingiz uchun** topa olasiz.
- Kartalar:
  - **Token kodda ochiq** — AI ba'zan tokenni to'g'ridan-to'g'ri kodga yozadi. Siz buni payqab, .env'ga ko'chirasiz.
  - **Handler yetishmaydi** — Tugma bor, lekin uni ushlaydigan bot.action/hears yo'q. Siz test qilib topasiz.
  - **Noto'g'ri tugma turi** — Siz inline so'radingiz, AI reply qildi (yoki aksincha). Farqini bilganingiz uchun tuzatasiz.
  - **Eski sintaksis** — AI eski versiya kodini berishi mumkin. Siz hujjat bilan solishtirib, yangilaysiz.
- Yakun: Bilim — bu sizning "xato detektoringiz". AI tezlikni beradi, siz to'g'rilikni ta'minlaysiz.
- Tugma: 4 xatoni ko'ring (0/4) → Davom etish

## 10 · 3-savol ✅  `[1135]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Inline tugma bosildi, bot javob bermadi. Sabab?**
  - A — Internet juda tez ishlab yuborgani uchun
  - B — Telegram bu tugma turini umuman qo'llab-quvvatlamaydi
  - C — Bot ko'p ishlab charchab qolgani uchun
  - D — ✔ Callback'ni ushlaydigan bot.action(...) yozilmagan
- To'g'ri: To'g'ri! Inline tugma callback yuboradi, lekin uni ushlaydigan bot.action(...) bo'lmasa — bot jim qoladi. Yechim: o'sha tugma uchun handler qo'shishni so'rash (aniq tuzatish topshirig'i).
- Xato izohlari:
  - A: Internet tezligi bunga sabab emas. Tugma bosilsa-yu javob yo'q bo'lsa — handler yetishmaydi.
  - B: Telegram tugmalarni 'yoqtirmaydi' degan narsa yo'q. Muammo — handler yo'qligida.
  - C: Botlar charchamaydi 🙂 Javob bo'lmasa, demak callback'ni ushlaydigan kod yozilmagan.
  - (umumiy) Javob yo'q → bot.action handleri yetishmaydi.
- Nishon: 🔌 Handler Pro (birinchi urinishda to'g'ri bo'lsa)

## 11 · Falsafa · direktor  `[1155]`
- Eyebrow: Falsafa · direktor
- Sarlavha: **Ikki xil odam AI ishlatadi. Farqni his qiling.**
- Mentor: Bugun siz aniq buyurdingiz, kodni o'qidingiz, test qildingiz, muammoni topib tuzatdingiz. Bu — sizni boshqalardan ajratadigan ko'nikma. Tugmani bosing.
- Chap karta **🙈 Ko'r-ko'rona nusxalovchi**: "Yasab ber" → nusxalab qo'yadi → ishladi, deydi. Buzilsa — boshi berk ko'chada. Botni o'stira olmaydi, chunki ichini bilmaydi.
- Tugma: Direktor-chi? → ✓ Ko'rdingiz
- O'ng karta **🎬 DIREKTOR (SIZ)**: Rejani tuzasiz → aniq buyurasiz → kodni o'qiysiz → test qilasiz → muammoni topib aniq tuzatasiz. AI — sizning tezligingiz, siz — uning aqli va nazorati. **Istalgan botni** qura olasiz.
- Yakun: Shuning uchun butun modul davomida bot ichini o'rgandik. Tushunish — AI bilan istalgan narsani qurish kaliti.
- Tugma: Farqni ko'ring → Davom etish

## 12 · To'liq qurish — eslatma boti (case)  `[1189]`
- Eyebrow: Hayotiy · to'liq qurish
- Sarlavha: **Boshqa bot, bir xil yo'l: g'oyadan ishlaydigan botgacha.**
- Mentor: Endi eslatma botini ko'ramiz — boshqa g'oya, lekin aynan o'sha 5 qadam. Tugmani bosib har qadamni oching.
- Qadamlar (birma-bir ochiladi):
  1. **Reja** — Eslatma boti: /start → qo'llanma, matn → saqlash, /royxat → ko'rsatish.
  2. **Aniq topshiriq** — "Telegraf'da eslatma boti: /start qo'llanma bersin, matnni eslatma sifatida saqlasin, /royxat hammasini ko'rsatsin. Token .env'dan."
  3. **AI yozdi** — bot.start, bot.on('text'), bot.command('royxat') — uchta handler tayyor.
  4. **Test + tuzatish** — /royxat bo'sh chiqdi — chunki saqlash massivga yozilmagan. Aniq tuzatish topshirig'i bilan hal qildingiz.
  5. **Ishladi** — Eslatma qo'shildi, ro'yxatda ko'rindi. Bot tayyor — va siz har qismini tushunasiz.
- Tugma: ▶ Boshlash → Keyingi qadam → → ✓ Bot tayyor
- O'ng karta **💡 NAQSH**: G'oya har xil, lekin yo'l doim bir xil: **reja → aniq topshiriq → AI kodi → o'qish → test → tuzatish**. Shu naqshni bilsangiz — istalgan botni qurasiz.
- Yakun: Viktorina, buyurtma, eslatma — texnologiya bir xil, faqat trigger → action'lar farq qiladi. Siz endi naqshni bilasiz.
- Tugma: Hikoyani oching (0/5) → Davom etish

## 13 · O'zingiznikini  `[1227]`
- Eyebrow: O'zingiznikini
- Sarlavha: **Endi navbat sizniki. O'z botingizni o'ylab toping.**
- Mentor: Bugungi naqsh bilan istalgan oddiy botni qura olasiz. Uyga vazifada o'z g'oyangizni hayotga tatbiq qilasiz. Ikki eslatmani esda tuting.
- Karta **🗺️ 1. Avval reja**: Topshiriq yozishdan oldin botingizni trigger → action juftliklariga ajrating. Reja qancha aniq — kod shuncha aniq.
- Karta **🖥️ 2. Hozircha lokalda**: `bot.launch()` bilan bot kompyuteringizda ishlaydi (polling). Doim onlayn bo'lishi uchun **hosting** kerak — buni keyingi bosqichda o'rganasiz.
- Tugma: Tushundim ✓ → ✓ Tushundim
- O'ng karta **🎒 BOTJON — TO'LIQ JIHOZLANGAN**: 🔑 kalit · 📋 varaq · 📓 daftar · 🧭 maslahatchi · 🧰 sumka — hammasi sizda. Endi AI bilan istalgan botni qurish uchun barcha buyum bor.
- Yakun: Bugun: AI bilan istalgan oddiy botni qura olasiz. Rul — sizda.
- Tugma: Tushundim ✓ → Davom etish

## 14 · 4-savol ✅  `[1253]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **AI bilan bot qurishda eng to'g'ri tartib?**
  - A — Topshiriq → nusxalash → tamom (o'qimasdan)
  - B — ✔ Reja → aniq topshiriq → AI kodi → o'qish → test → tuzatish
  - C — AI kodi → darrov ishlatish → buzilsa butunlay tashlab ketish
  - D — Test → reja → topshiriq (oxirida rejalashtirish)
- To'g'ri: To'g'ri! Avval reja (trigger→action), keyin aniq topshiriq, AI kod yozadi, siz o'qib tushunasiz, test qilasiz va kerak bo'lsa tuzatasiz. Bu — ishonchli yo'l.
- Xato izohlari:
  - A: O'qimasdan nusxalash — eng xavfli yo'l. Buzilsa, nima bo'lganini bilmaysiz.
  - C: Tashlab ketish — yechim emas. Test qilib, muammoni topib, aniq tuzatish kerak.
  - D: Reja eng oxirida emas, eng boshida bo'ladi. Avval reja — keyin topshiriq va test.
  - (umumiy) Reja → topshiriq → AI kodi → o'qish → test → tuzatish.

## 15 · Jarayonni yig'ing ✅ (final)  `[1273]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: AI bilan bot qurish jarayonini to'g'ri tartibda yig'ing.**
- Mentor: Bugun o'rgangan yo'lni eslang: rejadan boshlanadi, aniq topshiriq bilan davom etadi, AI yozadi, siz o'qib, test qilib, tuzatasiz. Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash chiqadi): Reja (trigger→action) · Aniq topshiriq · AI kod yozadi · Kodni o'qish · Test · Iteratsiya
- Uyachalar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · 6-qadam
- ✔ To'g'ri tartib: Reja (trigger→action) → Aniq topshiriq → AI kod yozadi → Kodni o'qish → Test → Iteratsiya
- To'g'ri: ✓ AI-build workflow tayyor! · ✓ Mana yo'l: **Reja → Aniq topshiriq → AI kodi → O'qish → Test → Iteratsiya**. Shu naqsh bilan istalgan botni qurasiz.
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Nishon: 🎬 Director (birinchi to'liq urinishda to'g'ri bo'lsa)
- Tugma: Jarayonni yig'ing → Davom etish

## 16 · Amaliyot · Loyiha kuni  `[2100]`
- Eyebrow: Amaliyot · Loyiha kuni · joy: «kompyuteringizda»
- Sarlavha: **AI bilan o'z botingizni quring**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z bot g'oyangizni tanlang va uni 3-4 ta trigger→action juftligiga ajrating. Keyin AI chat (masalan, Claude yoki ChatGPT) oching, 4 qismli aniq topshiriq yozing, AI kodini o'qib tushuning va lokalda test qilib ko'ring.
- Bosqichlar — belgilab boring:
  1. Bot g'oyangizni 3-4 ta `trigger → action` juftligiga ajrating
  2. 4 qismli topshiriq yozing: `texnologiya + juftliklar + tugma turi + token .env'dan`
  3. AI chatga topshiriqni yuboring va kodni oling
  4. Kodni o'qing: `bot.start`, tugma, `process.env` — har qismini tushunasizmi?
  5. Botni lokalda ishga tushirib test qiling, kamida bitta narsani tuzating
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1847]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Umumiy shablon: Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (… to'g'ri) · 🏆 To'liq reyting
- Savol yorliqlari (nuqtalar ustida): 1 — Aniq prompt · 2 — Kodni tekshirish · 3 — Handler · 4 — To'g'ri tartib · 5 — Workflow

## 18 · Takrorlash (kartochkalar)  `[2114]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga beriladigan aniq buyruq nima deb ataladi? | Topshiriq | prompt — qanchalik aniq bo'lsa, natija shunchalik aniq |
| Siz buyurasiz, AI yozadi, siz tekshirasiz — bu usul nima deyiladi? | Vibecoding | siz buyurtmachi, AI ijrochi |
| Vibecodingda siz qanday rolda bo'lasiz? | Direktor | rul sizda: nima bo'lishini siz aytasiz |
| Prompt yozishdan oldin botni nimalarga ajratasiz? | Trigger va action juftliklariga | bu ro'yxat reja deb ataladi |
| Aniq topshiriqda qaysi 4 narsa aytiladi? | Texnologiya, juftliklar, tugma, token | to'rttasi aytilsa, AI taxmin qilmaydi |
| «Menga bot yasab ber» nega yomon topshiriq? | AI hammasini o'zicha tanlaydi | texnologiya ham, tugma ham taxmin bilan chiqadi |
| Inline tugma bosilganda nima jo'natiladi? | Callback signal | bu signalni biror kod ushlashi kerak |
| Callback signalini ushlaydigan kod qanday yoziladi? | bot.action | signalni ushlaydigan kod handler deyiladi |
| Tugma bosildi, bot jim qoldi — nima yetishmayapti? | Handler | shu tugma uchun bot.action yozilmagan |
| Bot tokeni qaysi faylda saqlanadi? | .env | kodga process.env.BOT_TOKEN orqali olinadi |
| AI kod bergach, birinchi navbatda nima qilasiz? | O'qib tushunaman | ko'r-ko'rona ishlatilmaydi |
| Test qilish, tuzatish va qayta test aylanasi nima deb ataladi? | Iteratsiya | har aylanishda bot yaxshilanadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2141]`
- Eyebrow: Tayyor
- Belgi: ✓ Botjon to'liq jihozlandi 🎒
- Sarlavha: **Endi siz — AI bilan istalgan botni quradigan direktorsiz.**
- Arena tugmasi (CodeStrike) · jonli darsda: ⏳ Mentorni kuting
- Endi siz bilasiz:
  - AI bilan bot qurish sikli: reja → aniq prompt → AI kodi → o'qish → test → tuzatish (iteratsiya)
  - Promptdan oldin botni trigger → action juftliklariga rejalashtirasiz — aniq reja, aniq kod
  - Yaxshi topshiriq 4 qism: texnologiya, trigger→action, tugma turi, token .env'dan
  - AI kodini ko'r-ko'rona qabul qilmaysiz — har qismini o'qib tushunib, botni test qilasiz
  - AI ham xato qiladi (handler yo'q, token ochiq…) — tushunganingiz uchun topib, aniq tuzatasiz
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda ochiladi) 📝 Uyga vazifa:
  - **Reja** — o'z bot g'oyangizni tanlab, uni 3-4 ta trigger → action juftligiga ajrating
  - **Prompt** — 4 qismli (texnologiya, juftliklar, tugma, token) aniq topshiriq yozing
  - **Quring** — AI bilan kod oling, o'qing, lokalda test qiling va kamida bitta narsani tuzating
- Uyga vazifa ostidagi izoh: 🎉 Bu — modulning so'nggi darsi. Botjon endi to'liq jihozlangan: kalit, varaq, daftar, maslahatchi va sumka — hammasi sizda!
- Keyingi dars matni: **yo'q** (ekranda keyingi dars haqida gap yo'q)
- 🏅 Nishonlaringiz — N/4 · Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎯 Prompt Smith — Noaniq va aniq topshiriqni farqladingiz (4-ekran) · 🐞 Bug Catcher — Yetishmagan handlerni test bilan topdingiz (7-ekran) · 🔌 Handler Pro — Bot jim qolgani sababini aniqladingiz (10-ekran) · 🎬 Director — Reja → prompt → kod → test siklini yig'dingiz (15-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon: … · bosib davom eting

**Test ekranlarining umumiy yozuvlari:** To'g'ri javobni toping · To'g'ri · Qaytadan urinib ko'ring · ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: X — … · (xato bo'lsa) 📖 Qisqa takrorlash — mavzuni yana bir ko'rish

**Qisqa takrorlash oynalari (5)** — oyna: 📖 Qayta tushuntirish · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz · Yopish · 🗣️ Sinfga savol:
1. (4-ekran) **Aniq topshiriq — aniq bot:** 🌫️ Noaniq topshiriq — «Menga bot yasab ber» — juda umumiy. AI texnologiya, tugma turi, tokenni o'zicha tanlaydi. · 🎯 Aniq topshiriq — Texnologiya, trigger→action, tugma turi va token — hammasi aytilsa, AI taxmin qilmaydi. · 🎬 Rul sizda — Aniq topshiriq bilan natijani siz boshqarasiz — direktor sizsiz. · Savol: Nega «yasab ber» yomon topshiriq?
2. (8-ekran) **AI kodini o'qib, test qilish:** 🔍 Avval o'qing — AI kodni soniyada yozadi — lekin uni ko'r-ko'rona ishlatmang, har qismini o'qib tushuning. · 🧪 Keyin test qiling — Botni ishga tushirib, tugmalarni bosib sinang — ishlashiga ishonch hosil qiling. · 🔧 Kerak bo'lsa tuzating — Xato topsangiz — aniq tuzatish topshirig'ini berasiz. Tushunganingiz uchun tuzata olasiz. · Savol: AI kod bergach, birinchi nima qilasiz?
3. (10-ekran) **Handler yetishmasa — bot jim qoladi:** 🔘 Tugma callback yuboradi — Inline tugma bosilganda u callback signal jo'natadi — biror kod uni ushlashi kerak. · 🔌 Handler yo'q — javob yo'q — Agar shu signalni ushlaydigan bot.action(...) yozilmagan bo'lsa, bot jim qoladi. · 🔧 Yechim — handler qo'shish — O'sha tugma uchun handler qo'shishni so'rasangiz — bot javob beradi. · Savol: Inline tugma bosildi, bot javob bermadi — sabab?
4. (14-ekran) **AI bilan bot qurish tartibi:** 🗺️ Avval — reja — Botni trigger → action juftliklariga ajratish — hamma narsa shundan boshlanadi. · 📝 Keyin — aniq prompt va kod — Aniq topshiriq yoziladi, AI kod yozadi, siz uni o'qib tushunasiz. · 🔁 Oxiri — test va tuzatish — Botni sinab ko'rasiz, xato bo'lsa aniq tuzatish topshirig'i bilan hal qilasiz. (🗺️ Reja → 📝 Prompt → 🤖 AI kodi → 🔍 O'qish → 🧪 Test → 🔧 Tuzatish) · Savol: AI bilan bot qurishning to'g'ri tartibi qaysi?
5. (15-ekran — ekranda ochadigan tugma yo'q) **AI-build workflow:** 🗺️ Reja va aniq prompt — Trigger→action rejasi tuziladi, so'ng 4 qismli aniq topshiriq yoziladi. · 🤖 AI yozadi, siz o'qiysiz — AI kodni yaratadi — siz har qatorni tushunib tekshirasiz. · 🔁 Test va iteratsiya — Botni sinab, muammoni topib, aniq tuzatish bilan yaxshilaysiz. (🗺️ Reja → 📝 Prompt → 🤖 AI kodi → 🔍 O'qish → 🧪 Test → 🔧 Iteratsiya) · Savol: Nega reja eng boshida, test oxirida bo'ladi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Nega «menga bot yasab ber» yomon topshiriq? AI o'zbek tilini umuman tushunmay qoladi · ✔ Juda noaniq — AI hammasini o'zicha to'qiydi · Juda uzun — AI bunday uzun matnni o'qiy olmaydi · Bot yasash umuman AI ning ishi emas
2. AI'ga topshiriq berishdan oldin birinchi nima qilinadi? Tayyor kodni boshqa bir botdan nusxalab olish · Botni to'g'ridan-to'g'ri serverga joylash · Kalitni kodga ochiq yozib qo'yish · ✔ Botni trigger→action rejaga ajratish
3. Yaxshi topshiriq (prompt) qaysi 4 qismdan iborat? ✔ Texnologiya, trigger→action, tugma turi, token · Faqat botning nomi, rangi va chiroyli rasmi · Faqat token, parol va telefon raqami · Server manzili, domen, reklama narxi va logotip
4. AI kodni bergach, birinchi navbatda nima qilasiz? Hech narsa o'qimasdan darrov ishlatib yuboraman · O'chirib, o'zim qaytadan yozib chiqaman · ✔ Kodni o'qib tushunaman va test qilaman · AI'dan yana bir marta so'rab olaman
5. Inline tugma bosildi, bot javob bermadi. Eng ehtimoliy sabab? Internet juda tez ishlab yuborgani uchun · ✔ Callback'ni ushlaydigan bot.action(...) yozilmagan · Telegram bu tugma turini umuman qo'llab-quvvatlamaydi · Bot ko'p ishlaganidan charchab qolgani uchun
6. AI token (kalit)ni kodga ochiq yozib qo'ysa, to'g'ri yechim qaysi? ✔ Tokenni .env'ga ko'chirish (process.env) · Tokenni yana ham uzunroq qilib qayta yozish · Botni butunlay o'chirib qo'yish · Hech narsa qilmay, shundoqligicha qoldirish
7. «Vibecoding» (direktor va yozuvchi) nimani anglatadi? AI hamma qarorni o'zi mustaqil qabul qiladi · Faqat AI kodni o'qiydi, siz esa yozasiz · Kodni umuman yozmaslik, faqat kutib turish · ✔ Siz buyurasiz, AI yozadi, siz tekshirasiz
8. AI xato qilishi mumkin bo'lgan holat qaysi? Bot hech qachon xato qilmaydi · ✔ Handler yozmay qoldirishi mumkin · AI faqat token bilan ishlaydi · Xato faqat internetdan bo'ladi
9. Botni test qilib, muammo topilsa, keyin nima qilinadi? Loyihani butunlay tashlab, voz kechish · Noldan boshqa bir bot yozishni boshlash · ✔ Aniq tuzatish topshirig'ini berish · Butun kodni o'chirib tashlash
10. AI bilan bot qurishning to'g'ri tartibi qaysi? Prompt → nusxalash → tamom, tekshiruvsiz · Test → reja → prompt, keyin yana qaytadan · AI kodi → darrov ishlatish → tashlab ketish · ✔ Reja → prompt → AI kodi → o'qish → test → tuzatish
11. «Iteratsiya» nima? ✔ Test → tuzatish → qayta test sikli · Botni bir marta yozib tashlash · Tokenni almashtirish · Serverni qayta ishga tushirish
12. Vibecoding'da (direktor va yozuvchi) siz qaysi rolni bajarasiz? Yozuvchi — hamma kodni boshidan oxirigacha o'zingiz yozasiz · Kuzatuvchi — hech narsaga aralashmaysiz · ✔ Direktor — buyurasiz, AI yozadi, siz tekshirasiz · Mijoz — faqat tayyor natijani kutasiz

Arena shablon yozuvlari (umumiy, qisqa): ▶ Testni boshlash · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi! · Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱ · Adashdingiz — 0 ball. Keyingisida olasiz! 💪 · 🏆 Test yakunlandi! · 🏆 TOP-5 · eng uzun streak

---

## Mening dastlabki belgilarim (qonun-ro'yxatlar bo'yicha — faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Dars o'zini modulning oxirgi darsi deb biladi** — 19-ekran «🎉 Bu — modulning so'nggi darsi», 0-ekran «Bot ichini butun modul davomida o'rgandingiz», 11-ekran «butun modul davomida bot ichini o'rgandik». Aslida bu 14 darsli modulning 5-darsi. Keyingi dars («Bot ichida AI») yakun ekranida umuman aytilmaydi.
- **«o'tgan darsda» tartibga zid** — 3-ekran, «Tugma turi» kartasi: «Inline yoki reply … (o'tgan darsda o'rgandingiz)». Inline/reply 3-darsda («Telegram Bot API + tugmalar») o'tilgan; o'tgan dars — 4-dars «Stateful logika + PostgreSQL».
- **1-dars lug'atidan uzilgan, inglizcha so'zlar izohsiz** — 1-dars «signal → amal», «qoidalar varag'i» deb o'rgatgan; bu dars hamma joyda «trigger → action» deydi (2, 3, 5, 13, 14-ekran, praktika, yakun). «signal» faqat «callback signal» bo'lib bir marta chiqadi. Izohsiz qolganlari: «vibecoding», «AI-build workflow» (15-ekran, 5-takrorlash oynasi), «callback», «lokalda», «polling», «hosting» (13-ekran), inglizcha nishon nomlari (Prompt Smith, Bug Catcher, Handler Pro, Director).
- **7-ekran: to'g'ri variant bilan izoh bir-biriga zid** — to'g'ri tashxis «'start_quiz' tugmasiga bot.action handleri yozilmagan». Lekin chatda «Boshlash» (start_quiz) ishladi, javob bermagani A/B/C tugmalari. «✓ Topdingiz!» izohi ham «bot.action('start_quiz') dan keyingi javob tugmalariga handler yozmagan» deydi. Bundan tashqari to'g'ri variant yolg'iz uzun va texnik, qolgan ikkitasi 2 so'zdan.
- **Javob oldindan aytilib qo'yiladi / test «sotilgan»** — 15-ekran (final) Mentor tartibni to'liq aytib beradi: «rejadan boshlanadi, aniq topshiriq bilan davom etadi, AI yozadi, siz o'qib, test qilib, tuzatasiz». Xuddi shu tartib 12-ekran NAQSH kartasida va 14-ekran to'g'ri variantida (B) ham so'zma-so'z bor. 10-ekran xato variantlari kulgili («Internet juda tez», «Bot charchab qolgani»), shuning uchun to'g'ri javob darrov ko'rinadi.
- **0-ekran: har qanday tanlovga «Aynan!»** — «Chapdagi — bot yasab ber» yoki «Farqi yo'q» ni tanlagan o'quvchi ham «Aynan! Aniq topshiriq yaxshi bot beradi…» degan javobni ko'radi.
- **«daftar» taqiqi va bir narsaning ikki xil nomi/soni** — «daftar» 1-ekran Mentor gapida, 1-ekran panelida («Holat daftari»), 13-ekranda («📓 daftar») va 19-ekranda bor. «8/8 buyum» deyilgan joyda 5 ta nom sanaladi (kalit, varaq, daftar, maslahatchi, sumka). Paneldagi 8 ta nom esa boshqacha: Tugmalar, Konvert (ctx), Yo'l-yo'riq, Vositalar, AI yordamchi. 12-ekran Mentor «aynan o'sha 5 qadam» deydi, o'sha ekrandagi NAQSH va 15-ekran esa 6 qadamdan iborat. 9-ekran «to'g'rilikni ta'minlaysiz» — LUG'AT bo'yicha rasmiy fe'l. 13-ekrandagi «hayotga tatbiq qilasiz» ham rasmiy ohangda.
- **AI-vosita nomi** — 16-ekran topshirig'i: «AI chat (masalan, Claude yoki ChatGPT) oching». Sinfda gemini.google.com ishlatiladi.
