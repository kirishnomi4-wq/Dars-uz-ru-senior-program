# 5-Modul · 1-dars «Bot nima» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotIntroLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — tungi mijoz | hook | tugma bosadi, 03:00 da kim javob berganini tanlaydi | — |
| 1 | Reja | qoida | «signal → amal» jumlasi + bugungi 4 qadam | — |
| 2 | Uch buyum | tushuncha | kalit / varaq / aylana kartalarini bosib o'qiydi | — |
| 3 | Kim javob beradi | tushuncha | Siz / Skript / Botjon — uchalasini sinaydi | — |
| 4 | 1-savol | test | Botjon skriptdan nimasi bilan farq qiladi | ✅ |
| 5 | Xizmat oynasi | tushuncha | kalitni sudrab chiqaradi → 401 → qaytaradi | — |
| 6 | Kalit kimda | markaziy | BotFather kalit beradi → A (ochiq kod) / B (.env) tanlaydi → oqibat → tuzatish | — |
| 7 | Tungi smena | markaziy o'yin | qoidalar varag'ini yig'adi, 4 mijozga smena o'tkazadi, fallback | — |
| 8 | 2-savol | test | mos qator topilmasa nima bo'ladi | ✅ |
| 9 | Parallel | case | uch mijoz birdan yozadi | — |
| 10 | 3-savol | test | kalit ochiq kodda qolsa xavf | ✅ |
| 11 | Ulanish | tushuncha | «o'zi so'rab turish» (polling) vs «qo'ng'iroq» (webhook) | — |
| 12 | To'liq suhbat | hayotiy | AvtoPizza buyurtma suhbatini qadam-baqadam ochadi | — |
| 13 | Varaq kodda | amaliyot | `bot.js` dagi 3 bo'shliqni to'ldiradi | — |
| 14 | 4-savol | test | uch mijozdan birdan signal | ✅ |
| 15 | Aylanani yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Telegram | praktika | @BotFather orqali bot ochadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon (bot) · signal · amal · qoidalar varag'i (handler-lar ro'yxati) · kalit (token) · Ro'yxat idorasi (BotFather) ·
xizmat oynasi (Bot API) · qulfli tortma (.env) · to'xtamaydigan aylana (loop) · fallback qator · reaksiya · hodisa ·
o'zi so'rab turish (polling) · qo'ng'iroq (webhook) · revoke · tungi smena

---

## 0 · Kirish — tungi mijoz  `[751]`
- Sarlavha: **Soat 03:00. Siz uxlayapsiz. Mijoz botga yozdi — kim javob beradi?**
- Mentor: Tasavvur qiling: kechasi mijoz savol beradi. Siz uxlayapsiz. Tugmani bosing — nima bo'lishini ko'ring.
- Chat: mijoz «Salom, hali ochiqmisiz? 🍕» → bot «Salom! Ha, men 24/7 ishlayman 🤖 Menyuni ko'rasizmi?» · tugmalar 🍕 Menyu · 🛒 Buyurtma · 📍 Manzil
- Tugma: ▶ Mijoz xabar yozdi (03:00) → ✓ Botjon o'zi javob berdi (03:00)
- Izoh: Siz uxladingiz — lekin Botjon uxlamaydi. Signal keldi, u darhol amal qildi. U buni har kuni, har soatda, charchamasdan qiladi.
- Savol: **Sizningcha, kim javob berdi?**
  - Men — telefonni olib, qo'lda javob berdim
  - Botjon — men uxlasam ham, signalga o'zi javob berdi
  - Hech kim — mijoz javob kutib, ketib qoldi
- Javobdan keyin: Aynan! Bugun sizga Botjonni tanishtiramiz — u signalga o'zi reaksiya qiladigan, uxlamaydigan yordamchi. Uning ichida nima borligini bugun ochamiz.
- Tugma: Davom etish

## 1 · Reja  `[796]`
- Sarlavha: **Botjon — oddiy mantiq: signal keladi, javob qaytadi.**
- Mentor: Botjon — signalga reaksiya qiladigan, uxlamaydigan yordamchi. Uning uchta buyumi bor: 🔑 kalit, 📋 qoidalar varag'i va to'xtamaydigan aylana. Mana natija va unga olib boradigan 4 qadam.
- Blok: Botjonning butun mantig'i — bitta jumlada → «Salom! 👋» misoli
  - Signal keladi → Botjon qoidalar varag'idan mos qatorni qidiradi → amal bajaradi. Shu — botning butun ishi. Mana shu darsda buni to'liq ochamiz.
- Jihozlar paneli — bugun 2 tasi yonadi: Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · Yo'l-yo'riq · Vositalar · AI yordamchi
- Bugungi 4 qadam:
  1. Botjonning uch buyumi — kalit, varaq, aylana · *tushuncha*
  2. signal → amal — botning butun mantig'i · *asos*
  3. Kalit kimda — Botjon o'shaniki · *himoya*
  4. Tungi smena — o'zingiz varaq yozasiz · *amaliyot*
- Tugmalar: 4 qadamni ko'rish / ↩ Mantiqni ko'rish · Boshlaymiz →

## 2 · Uch buyum  `[834]`
- Eyebrow: Tushuncha · uch buyum
- Mentor: Botjonning uch buyumi bilan tanishing.
- Matn: Botjon — bu murakkab emas. Unda bor-yo'g'i uchta narsa bor. Har buyumni bosib, u nima ekanini o'qing.
- Kartalar:
  - 🔑 **Kalit** — Botjonning kim ekanini isbotlaydigan maxfiy kalit. Ro'yxat idorasi (BotFather) beradi. Xizmat oynasi (Bot API) shu kalitni tekshirib, faqat egasini kiritadi.
  - 📋 **Qoidalar varag'i** — Har qatorda bitta juftlik: signal keladi → shu amalni qil. Signal kelganda Botjon shu varaqdan mos qatorni qidiradi.
  - ↻ **Aylana** — Botjon to'xtamaydi: kutadi → signal keladi → varaqdan qator topadi → amal bajaradi → javob qaytaradi → yana kutadi.
- Yakun: Uchoviga ega bo'lsangiz — botingiz tayyor: 🔑 kalit bilan kiradi, 📋 varaq bilan bilib oladi, ↻ aylana bilan to'xtamaydi.
- Tugma: Buyumlarni ko'ring → Davom etish

## 3 · Kim javob beradi  `[873]`
- Eyebrow: Tushuncha · kim javob beradi
- Sarlavha: **Bitta signal — uch "ishchi". Farqi nimada?**
- Matn: Soat 03:00. Bitta xabar keladi. Uni uchta "ishchi" qanday kutib olishini bosib ko'ring.
  - **Siz** — Uxlaysiz. 03:00 da kelgan xabar javobsiz to'planib qoladi — ertalab uyg'onganda ko'rasiz.
  - **Skript** — Bir marta yuqoridan-pastga ishlab tugaydi. Yangi xabar kelganda u allaqachon to'xtagan — ko'rmaydi ham.
  - **Botjon** — To'xtamaydigan aylanada kutib turibdi. Signal kelishi bilan darhol qoidalar varag'idan qator topib, javob beradi.
- Xulosa: Mana farqi: faqat Botjon to'xtamaydigan aylanada — shuning uchun u har doim, har signalga darhol javob bera oladi.
- Tugma: Uchalasini sinang → Davom etish

## 4 · 1-savol ✅  `[913]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Botjon oddiy skriptdan nimasi bilan farq qiladi?**
  - U faqat internetsiz, tashqi tarmoqqa umuman ulanmasdan mustaqil ishlaydi
  - U saytning ranglarini avtomatik tarzda to'g'ri tanlab beradi
  - U faqat bir marta yuqoridan-pastga ishlab, so'ng to'xtab qoladi
  - ✔ U to'xtamaydigan aylanada doim kutib, har signalga reaksiya qiladi
- To'g'ri: To'g'ri! Botjon — to'xtamaydigan aylanada yashaydi: doim kutadi, signal kelsa amal qiladi va yana kutadi. Aynan shuning uchun 24/7 javob bera oladi.
- Xato izohlari:
  - Internet bilan aloqasi yo'q — Botjon aksincha, Telegram (internet) orqali ishlaydi.
  - Dizayn — bu boshqa ish. Botjon signalga reaksiya qilish bilan shug'ullanadi.
  - Bu — oddiy skript ta'rifi. Botjon esa bir marta ishlab to'xtamaydi, doim kutadi.
  - (umumiy) Botjon — to'xtamaydigan aylanada doim kutadigan, signalga reaksiya qiladigan yordamchi.

## 5 · Xizmat oynasi  `[933]`
- Eyebrow: Tushuncha · xizmat oynasi
- Sarlavha: **Kalitsiz xizmat oynasi ochilmaydi.**
- Mentor: Zanjir shunday: Mijoz → Telegram → 🔑 Xizmat oynasi → 📋 Varaq → javob. Kalitni uyasidan sudrab chetga oling — nima bo'lishini ko'ring, keyin qaytaring.
- Sxema yorliqlari: Mijoz · Xizmat oynasi · Varaq · javob
- Ko'rsatma: kalitni shu yerga sudrab olib chiqing → / kalit chetga olindi — qaytarish uchun oynaga sudrang →
- Kalitsiz: Kalit yo'q — xizmat oynasi 401 qaytardi. Xabar hech qachon 📋 varaqqa yetib bormaydi, Botjon uni ko'rmaydi ham.
- Qaytargach: Kalitni qaytardingiz — oqim tiklandi. Xizmat oynasi kalitsiz hech qachon ochilmaydi.
- Tugmalar: Kalitni sudrab oling → Kalitni qaytaring → Davom etish

## 6 · Kalit kimda (markaziy)  `[987]`
- Eyebrow: Markaziy · kalit
- Sarlavha: **Kalit kimda — Botjon o'shaniki.**
- Mentor: Ro'yxat idorasi (BotFather) Botjonni ro'yxatdan o'tkazadi va 🔑 kalit beradi. Endi shu kalitni qayerda saqlashni o'zingiz tanlaysiz — keyin nima bo'lishini ko'ramiz.
- 1-qadam: Ro'yxat idorasi (BotFather) · «Kalitni xizmat oynasiga olib boring →» → ✓ Xizmat oynasi ochildi — Botjon oflayn → onlayn · «Tanlovga o'tish →»
- Savol: Endi eng muhim savol: bu kalitni qayerda saqlaysiz? · **Kalitni qayerda saqlaysiz? — sinab ko'ring**
  - A — bot.js ochiq kod ichida
  - B — .env qulfli tortmada
- A tanlansa (oqibat zanjiri):
  1. Kod ochiq — kalit qatorda ochiq yotibdi 👀
  2. Notanish odam 📸 skrinshot oldi va kalitni nusxaladi
  3. Sizning botingiz nomidan mijozlarga soxta xabar ketdi: «🎁 Chegirma! Shu kartaga 50 000 so'm o'tkazing»
  4. Mijozlar shikoyat qilmoqda. Siz tugmani bossangiz ham — Botjon endi sizga javob bermaydi
- Tuzatish (Keyingisi → / Tuzatamiz → / Bajarildi ✓):
  1. 🔴 Kalitni bekor qilasiz (revoke) — notanish odamning kaliti endi sinadi
  2. Ro'yxat idorasi yangi kalit beradi
  3. Yangi kalitni qulfli tortmaga (.env) joylaysiz — kodda faqat process.env.BOT_TOKEN ko'rinadi
- B natija: ✓ Kalit qulfli tortmada (.env) · `# .gitignore ichida .env ham bor — GitHub'ga chiqmaydi`
- Botjon holati: 🔴 oflayn — kalit yo'q · 🟡 sizga javob bermayapti — kalit boshqa qo'lda · 🔴 xavfda — kalitni notanish odam oldi · 🟢 onlayn — sizniki
- Xulosa: Kalit — Botjonning kim ekanini isbotlaydi. Kalit kimda bo'lsa, Botjon o'shanga bo'ysunadi. Shuning uchun kalit hech qachon ochiq kodda yotmaydi.
- Tugma: Voqeani oxirigacha ko'ring → Davom etish

## 7 · Tungi smena (markaziy o'yin)  `[1224]`
- Eyebrow: Markaziy · tungi smena
- Sarlavha: **Bugun siz Botjonning qoidalar varag'ini yozasiz.**
- Mentor: Signal va amal chiplarini varaqqa joylang. Varaq yarim bo'lsa ham smenani boshlashingiz mumkin — xato qilish MUMKIN. Soat 03:00, 4 mijoz keladi: Aziza, Bek, Dilnoza va Sardor (u oddiy matn yozadi — hech qaysi qatorga aynan mos kelmaydi).
- Varaq: 📋 qoidalar varag'i (siz yozasiz) · ustunlar: signal · amal · bo'limlar: signallar · amallar
- Signallar: /start · "Menyu" tugmasi · /help · Hech biri mos kelmasa · /settings · Rasm yuborildi
- Amallar: Salom beradi, menyuni ko'rsatadi · Taomlar ro'yxatini yuboradi · Yordam matnini yuboradi · Uzr, tushunmadim. /help ni bosing · Buyurtmangiz qabul qilindi deydi · Botni butunlay o'chiradi
- Mijozlar: Aziza (/start) · Bek ("Menyu" tugmasi) · Dilnoza (/help) · Sardor («Pitsa bormi?»)
- Smena natijalari: Xizmat ko'rsatildi · Ketib qoldi · 💤 javob yo'q — ketib qoldi · «Nima? Men hali hech narsa buyurtma qilmadim 😕» · «(mos emas)»
- Xato bo'lsa: Varaqni to'g'rilang: har signalga to'g'ri amal ulanishi kerak, va hech biriga mos kelmagan signal uchun oxirgi (fallback) qator kerak.
- Muvaffaqiyat: ✓ 4/4! Barcha mijoz xizmat oldi — hatto Sardor ham, chunki siz fallback qatorini qo'shdingiz.
- Tugmalar: ▶ Tungi smenani boshlash (03:00) · ↻ Smenani qayta o'tkazish · Smenani yakunlang → Davom etish
- Xulosa: Botjon o'zicha o'ylamaydi. U faqat varaqda yozilgan narsani qiladi. Varaqda yo'q signal — javob yo'q. Kodda ham xuddi shunday: qator yozmasangiz, handler yo'q.

## 8 · 2-savol ✅  `[1248]`
- Savol: **Qoidalar varag'ida mos qator topilmasa, Botjon nima qiladi?**
  - ✔ Javob bermaydi — jim qoladi
  - Tasodifiy javob o'ylab topadi
  - Boshqa botga signalni uzatib yuboradi
  - Xatolik chiqarib o'chib qoladi
- To'g'ri: To'g'ri! Botjon o'zidan hech narsa o'ylab topmaydi. Varaqda mos qator bo'lmasa — u jim qoladi. Shuning uchun har doim oxirgi, umumiy javob beradigan qator (fallback) kerak.
- Xato izohlari: Botjon o'zidan hech narsani o'ylab topmaydi — u faqat varaqda yozilganini bajaradi. · Bunday avtomatik uzatish yo'q — mos qator bo'lmasa, oddiygina javob kelmaydi. · Botjon o'chib qolmaydi — u aylanada davom etadi, faqat shu signalga javob bermaydi. · (umumiy) Mos qator topilmasa — Botjon jim qoladi (fallback qator bo'lmasa).

## 9 · Parallel (case)  `[1273]`
- Eyebrow: Case · parallel
- Sarlavha: **Uch mijoz bir vaqtda yozdi. Botjon adashadimi?**
- Mentor: Har signalni Botjon alohida hodisa deb ko'radi. Avval birma-bir bosib ko'ring, keyin "Uchalasi birdan yozsin" tugmasini bosing.
- Qatorlar: Aziza (/start) → Salom + menyu · Bek → "Menyu" tugmasi → Taomlar ro'yxati · Dilnoza (/help) → Yordam matni
- Tugma: ▶ Uchalasi birdan yozsin → ✓ Uchalasi birdan javob oldi
- Xulosa: Botjon har signalni mustaqil hodisa deb ko'radi — shuning uchun minglab mijoz bilan bir vaqtda "gaplasha" oladi.
- Tugma: Uchalasini birdan sinang → Davom etish

## 10 · 3-savol ✅  `[1314]`
- Savol: **Kalit ochiq kodda qolib ketsa, qanday xavf bor?**
  - Hech qanday xavf yo'q — kalit hech qachon ochiq bo'lmaydi
  - Bot avtomatik ravishda butunlay o'chib qoladi
  - ✔ Boshqa odam uni olib, bot nomingizdan xabar yubora oladi
  - Telegram botni darhol butunlay o'chirib tashlaydi
- To'g'ri: To'g'ri! Kalit — botning kim ekanini isbotlaydi. Kimda kalit bo'lsa, Botjon o'shaniki. Kalit oshkor bo'lsa, notanish odam sizning nomingizdan xabar yubora oladi.
- Xato izohlari: Aksincha — ochiq kalit katta xavf. Kalitni ko'rgan har kim botdan foydalana oladi. · Bot o'zi o'chmaydi — u ishlashda davom etadi, lekin endi kim boshqarayotgani noaniq. · Telegram avtomatik o'chirmaydi — muammoni siz o'zingiz kalitni bekor qilib (revoke) hal qilasiz. · (umumiy) Kalit oshkor bo'lsa, boshqa odam bot nomidan yozishi mumkin.

## 11 · Ulanish  `[1338]`
- Eyebrow: Tushuncha · ulanish
- Sarlavha: **Botjon signalni qanday biladi?**
- Mentor: Botjon xizmat oynasi bilan ikki xil usulda "gaplashadi". Ikkalasini sinang.
  - **O'zi so'rab turish** — Botjon xizmat oynasidan tinmay so'raydi: «menga signal bormi?». Javob bo'lmasa, yana va yana so'raydi. Sodda, lekin doim so'rab turadi.
  - **Qo'ng'iroq** — Xizmat oynasi signal kelganda o'zi Botjonga qo'ng'iroq qiladi. Botjon bekor so'ramaydi — faqat qo'ng'iroq kutadi.
- Xulosa: Ikkalasi ham signalni Botjonga yetkazadi.
- Tugma: Ikkala usulni sinang → Davom etish

## 12 · To'liq suhbat  `[1378]`
- Eyebrow: Hayotiy · to'liq suhbat
- Sarlavha: **Butun buyurtma — bu shunchaki signal → amal zanjiri.**
- Mentor: Murakkab ko'rinadigan bot ham, aslida, ketma-ket signal → amal qatorlaridan iborat. Suhbatni qadam-baqadam oching.
- Suhbat (signal → amal):
  1. /start → «Salom! 🍕 AvtoPizza botiga xush kelibsiz. Nima qilamiz?» [🍕 Menyu · 🛒 Buyurtma] — *salom + menyu tugmalari*
  2. 🍕 Menyu → «Bizda: Margarita, Pepperoni, To'rt pishloq. Qaysi birini?» — *"Menyu" tugmasi → taomlar ro'yxati*
  3. Pepperoni → «Zo'r tanlov! 📍 Manzilingizni yuboring.» — *taom tanlandi → manzil so'raydi*
  4. Chilonzor 5-kvartal → «Qabul qilindi ✅ 25 daqiqada yetib boradi. Rahmat!» — *manzil yuborildi → buyurtmani tasdiqlaydi*
- Yorliq: har qadamning signal → amal'i
- Tugmalar: ▶ Suhbatni boshlash · Keyingi xabar → · ✓ Buyurtma yakunlandi
- Xulosa: 4 signal → 4 amal. Mana shu — to'liq ishlaydigan bot. Bu — bugun siz yig'gan qoidalar varag'ining aynan o'zi.

## 13 · Varaq kodda  `[1431]`
- Eyebrow: Amaliyot · varaq kodda
- Sarlavha: **Qoidalar varag'i kodda qanday yoziladi?**
- Mentor: Bu — bot.js: sizning varag'ingiz shu tarzda yoziladi. Uchta bo'shliqni to'g'ri chipdan tanlab to'ldiring.
- Kod:
  ```js
  // signal → amal — xuddi siz tungi smenada yig'gandek
  bot.____((ctx) => ctx.____('Salom! 👋'))
  bot.____('Menyu', (ctx) => ctx.reply('Bizning taomlar…'))
  ```
- Bo'shliqlar: 1) start / hears / launch · 2) reply / delete / forward · 3) hears / start / stop
- Xato izohlari: «hears» — matn signali uchun ishlatiladi, /start uchun emas. · «launch» — botni ishga tushirish buyrug'i, signal nomi emas. · «delete» xabarni o'chiradi — javob yubormaydi. · «forward» boshqa joyga yuboradi — bu javob emas. · «start» faqat /start buyrug'i uchun — bu yerda matn signali kerak. · Bunday signal turi yo'q. · Bu to'g'ri emas.
- Muvaffaqiyat: Varaq to'ldi! bot.start = /start signali, bot.hears = matn signali, ctx.reply = amal.
- Tugma: Bo'shliqlarni to'ldiring → Davom etish

## 14 · 4-savol ✅  `[1490]`
- Savol: **Botjon bir vaqtda uch mijozdan signal olsa, nima bo'ladi?**
  - Faqat birinchi mijozga javob beradi, qolganlarini butunlay e'tiborsiz qoldiradi
  - Adashib ketib, hammasiga tasodifiy javob yuboraveradi
  - Barcha signallarni bitta signal deb qo'shib yuboraveradi
  - ✔ Har signalni alohida hodisa deb ko'rib, har biriga mos javob beradi
- To'g'ri: To'g'ri! Botjon har signalni mustaqil hodisa deb ko'radi — shuning uchun minglab mijoz bilan bir vaqtda ishlay oladi, hech kim boshqasini kutmaydi.
- Xato izohlari: Yo'q — Botjon hech kimni e'tiborsiz qoldirmaydi, har signalga alohida javob beradi. · Botjon tasodifiy ishlamaydi — u har doim varaqdagi mos qatorni topib javob beradi. · Signallar qo'shilmaydi — har biri alohida hodisa sifatida ko'riladi. · (umumiy) Har signal — alohida hodisa; Botjon har biriga mos amal bilan javob beradi.

## 15 · Aylanani yig'ing ✅ (final)  `[1519]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: Botjon aylanasini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Diqqat: agar 💬 Javobni ⚡ Amaldan oldin qo'ysangiz — oqibatini ko'rasiz.
- Bo'laklar: Kutadi · Signal keldi · Varaqdan qator topadi · Amal bajaradi · Javob qaytaradi
- Uyachalar: birinchi nima bo'ladi · keyin nima keladi · keyin nima qidiriladi · keyin nima bajariladi · eng oxiri nima qaytariladi · «bu yerga joylang»
- To'g'ri: ✓ Aylana tayyor: Kutadi → Signal keldi → Qator topadi → Amal bajaradi → Javob qaytaradi → va yana kutadi ↻.
- Javob amaldan oldin bo'lsa: 😕 Botjon hali ish qilmasdan "tayyor" dedi! — Javob amaldan oldin ketsa, mijoz hali bajarilmagan ishni tayyor deb o'ylab qoladi.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.
- Havola: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Aylanani yig'ing → Davom etish

## 16 · Amaliyot · Telegram  `[2369]`
- Eyebrow: Amaliyot · Telegram · joy: «Telegram'ingizda»
- Sarlavha: **Botjoningizni ro'yxatdan o'tkazing**
- Topshiriq: Telegram'da @BotFather bilan gaplashib, o'zingizning birinchi botingizni ro'yxatdan o'tkazing va kalitni xavfsiz saqlang. Hali kod yozmaysiz — faqat botni yaratasiz.
- Umumiy matn: Bu topshiriqni o'z Telegram'ingizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Bosqichlar — belgilab boring:
  1. Telegram'da `@BotFather`ni toping va oching
  2. `/newbot` buyrug'ini yuboring
  3. Botga ism va foydalanuvchi nomi bering (masalan, mening_botim)
  4. BotFather bergan 🔑 kalitni nusxalab, xavfsiz joyga saqlang — hech kimga yubormang
  5. Botingizni Telegram qidiruvidan toping va /start bosing (hozircha jim bo'lishi mumkin — bu normal, qoidalar varag'i hali yo'q)
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.»

## 17 · Natijalar (podium)  `[2116]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz · -o'rin · to'g'ri · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2383]`
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Botni ishga tushiradigan xabar yoki buyruq nima deb ataladi? | Signal | Masalan, /start tugmasini bosish |
| Botjon signalga javoban bajaradigan ishni nima deymiz? | Amal | Masalan, javob xabarini yuborish |
| Qaysi signalga qaysi amal kerakligi qayerda yozib qo'yiladi? | Qoidalar varag'ida | Har qatorda bitta signal va uning amali turadi |
| Botjon amalni bajargandan keyin nima qiladi? | Yana kutadi | Kutadi, signal oladi, amal qiladi va yana kutadi — aylana to'xtamaydi |
| Botning kim ekanini isbotlaydigan maxfiy belgilar nima deyiladi? | Kalit (token) | Kalit kimda bo'lsa, bot o'shaniki |
| Yangi bot ochish va kalit olish uchun Telegramda kim bilan gaplashasiz? | @BotFather | Bu — botlarni ro'yxatdan o'tkazadigan rasmiy bot |
| Kalitni qaysi faylda saqlaysiz? | .env | Qulfli tortma: kodda faqat process.env.BOT_TOKEN ko'rinadi |
| Telegram bilan kodingiz orasidagi xizmat oynasi qanday nomlanadi? | Bot API | Kalitsiz ochilmaydi — javob o'rniga 401 qaytadi |
| Botjonning o'zi «menga signal bormi?» deb so'rab turishi qanday ataladi? | Polling | O'zi so'rab turadi — signal bo'lmasa ham qayta so'raydi |
| Xizmat oynasi signal kelganda o'zi bildirsa, bu usul qanday ataladi? | Webhook | Qo'ng'iroq: Botjon bekor so'ramaydi, faqat kutadi |
| Varaqda mos qator topilmasa, Botjon jim qolmasligi uchun nima qo'shiladi? | Fallback | Eng oxirgi umumiy qator — hech kim javobsiz qolmaydi |
| Kalitingiz begona odamga ko'rinib qolsa, birinchi nima qilasiz? | Kalitni bekor qilish (revoke) | Eski kalit ishlamay qoladi, yangisini .env ga qo'yasiz |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2410]`
- Sarlavha: **Botjon nima ekanini tushundingiz** / Tayyor
- Endi Botjon siz uchun aniq mantiq: signal keladi — amal bajariladi.
- Endi siz bilasiz:
  - Botjon — signalga reaksiya qiladigan, to'xtamaydigan yordamchi
  - signal → amal — botning butun mantig'i, qoidalar varag'ida yoziladi
  - Kalit (token) — botning kim ekanini isbotlaydi, hech qachon ochiq kodda saqlanmaydi
  - Mos qator topilmasa — Botjon jim qoladi, shuning uchun fallback qator kerak
  - Botjon aylanasi: kutadi → signal keladi → qator topadi → amal bajaradi → javob qaytaradi → yana kutadi
- Uyga vazifa:
  - **O'ylang** — kundalik hayotda qaysi ishni Botjon avtomatlashtirishi mumkin? 3 ta g'oya yozing
  - **Yozing** — har g'oya uchun kamida bitta signal → amal qatorini daftarga yozing
  - **Saqlang** — BotFather'dan olgan kalitingizni xavfsiz joyda saqlab qo'ying — ertaga kerak bo'ladi
- 📝 Uyga vazifa · Amaliy topshiriqni bajarish →
- 🚀 Keyingi dars — Telegram Bot API: @BotFather bilan birinchi haqiqiy botingizni yaratamiz va tugmalarni qo'shamiz!
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** Kalitni qulfli tortmaga (.env) joyladingiz · Tungi smenani 4/4 bajardingiz · Fallback qo'shdingiz — hamma javob oldi · Qoidalar varag'ini xatosiz yozdingiz
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5):**
1. Botjon — to'xtamaydigan aylana: Doim kutadi · Signal kelsa — reaksiya · Yana kutadi
2. Fallback — jim qolmaslik: Botjon varaqdan qidiradi · Topilmasa — jim qoladi · Fallback qator — yechim
3. Kalit oshkor bo'lsa — xavf: Kalit — kim ekanini isbotlaydi · Ochiq kodda qolsa · Yechim — revoke + .env
4. Parallel signal — event-driven: Har mijoz — alohida hodisa · Hech kim kutmaydi · Adashish yo'q
5. Botjon aylanasi — tartib muhim: Avval — kutish · Keyin — topish va bajarish · Eng oxiri — javob (Kutadi → Signal → Qator → Amal → Javob)

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Botning ichida signal → amal juftligi qanday nomlanadi? ✔ Varaqdagi signal-amal qatori · Bot ishga tushish buyrug'i · Server xatolik jurnali yozuvi · Botning profil surati fayli
2. Token (kalit) nima uchun kerak? Botning rangini belgilaydi · Xabarlarni boshqa tilga o'giradi · ✔ Botning kim ekanini isbotlaydi · Foydalanuvchi parolini saqlaydi
3. Botga /start yuborilishi — bu nima? Bu — amal, botning ichki javobi (action atamasi) · ✔ Bu — signal, botga tashqaridan kelgan buyruq (trigger) · Bu — kalit, botning shaxsini isbotlaydigan token · Bu — varaq, signal-amal juftlik qatorlari ro'yxati (handler)
4. Qoidalar varag'ida mos qator topilmasa, Botjon nima qiladi? Xatolik chiqarib o'chib qoladi · Tasodifiy javob o'ylab topadi · Boshqa botga ulanib qoladi · ✔ Javob bermaydi — jim qoladi
5. Kalitni odatda kim beradi? Telegram tizim administratori beradi · Foydalanuvchining o'zi kiritadi · ✔ Ro'yxat idorasi (BotFather) beradi · Xizmat oynasining o'zi yaratadi
6. Kalit ochiq kodda qolib ketsa qanday xavf bor? ✔ Notanish odam bot nomidan xabar yozadi · Bot avtomatik ravishda tezroq ishlay boshlaydi · Hech qanday real xavf yo'qdir, tinch bo'ling · Telegram botni darhol butunlay o'chiradi
7. Kalit oshkor bo'lsa, birinchi qadam nima? Botni butunlay o'chirib tashlash · Telegramni qayta o'rnatish · Yangi foydalanuvchi ro'yxatdan o'tish · ✔ Eski kalitni bekor qilish (revoke)
8. Kalit odatda qayerda xavfsiz saqlanadi? Ochiq kod faylining o'zida · ✔ Qulfli tortmada (.env) · Telegram profil sozlamasida · Brauzer qidiruv tarixida
9. Botjon nega 03:00 da ham javob bera oladi? U uxlamaydigan odam tomonidan yoziladi · ✔ U to'xtamaydigan aylanada doim kutadi · U faqat kunduzi ishlashga sozlangan · U tasodifiy vaqtlarda ishga tushadi
10. Uch mijoz bir vaqtda yozsa, Botjon nima qiladi? Faqat birinchi mijozga javob beradi · Barcha signalni bitta deb qo'shib yuboradi · Navbatga qo'yib, keyinroq javob beradi · ✔ Har birini alohida signal deb ko'radi
11. Hech qaysi qatorga mos kelmagan signal kelsa, nima yordam beradi? ✔ Oxirgi, umumiy fallback qatori yordam beradi · Botni to'xtatib, qaytadan ishga tushirish kerak bo'ladi · Xizmat oynasini yopib qo'yish kerak bo'ladi · Yangi token yaratish shart bo'lib qoladi
12. Botjonning uch asosiy buyumi qaysi? Server, baza, sayt dizayni · Ekran, sichqoncha, klaviatura · ✔ Kalit, varaq va aylana · Rasm, video, ovoz fayli

---

## Mening dastlabki belgilarim (qonun-ro'yxatlar bo'yicha — faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«chip»** — 7-ekran («Signal va amal chiplarini») va 13-ekran («to'g'ri chipdan») · lug'atda taqiqlangan so'z
- **«daftar»** — 19-ekran uyga vazifa («daftarga yozing») va 1-ekran panelida «Holat daftari» · «daftar» taqiqlangan so'z
- **«reaksiya»** — 0, 1, 4, 19-ekranlarda · o'rniga «javob beradi» bo'lishi mumkin
- Inglizcha so'zlar izohsiz: «handler» (7-ekran, viktorina 3-savol), «trigger», «action atamasi», «event-driven» (takrorlash 4), «Case · parallel» (9-ekran)
- «Konvert (ctx)», «Yo'l-yo'riq», «Vositalar» (1-ekran panel) — bu darsda ochilmaydi, faqat nom bo'lib turadi
- «24/7» — o'smir uchun tushunarli, lekin «kecha-kunduz» deb yozsa ham bo'ladi
