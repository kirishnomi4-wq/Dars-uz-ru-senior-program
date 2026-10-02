# 6-Modul (LMS: 8-Modul) · 8-dars «Praktika: to'liq pipeline» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/PipelineProjectLesson.jsx` · 21 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0-ekran):** o'quvchi «🏝️ Alohida» va «🔗 Ulangan» tugmalarini bosib, 5 qism (React, Node, baza, bot, AI) alohida turgani va bir-biriga ulangani qanday farq qilishini ko'radi, keyin «Nima yetishmayapti?» savoliga javob tanlaydi (javob: ulanish).
- **Markaziy mexanika:** 6-ekranda 4 ta ulanishni «prompt yuborib» ulaydi va «▶ Buyurtma yuborish» bosadi; 8-ekranda vibecoding siklini (prompt → AI kod → test → bug → tuzatish → qayta test) qadam-baqadam ochadi; 11-ekranda «Failed to fetch» bug'ining sababini topadi.
- **Asosiy metafora:** «Siz — direktor, AI — ishchi» (dars bo'yi). Oxirida (16-ekran) SHAHAR: Peshtoq (React) → Hokimlik (Node) → Arxiv (PostgreSQL) → Darvoza (Telegram) → Ekspert-byuro (AI), bitta «ariza» shahar bo'ylab o'tadi.
- **Yakun:** ariza yo'lini sudrab tartiblaydi (final), VS Code'da o'z pipeline'ini AI bilan quradi (amaliyot), keyin reyting, 12 kartochka va xulosa.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — 5 qism ulanmagan | hook | Alohida / Ulangan holatni bosadi, «nima yetishmayapti» deb tanlaydi | — |
| 1 | Reja | qoida | bugungi maqsad + 5 qadam | — |
| 2 | 5 komponent | tushuncha | 5 komponentni bosib, har biri nima qilishini o'qiydi | — |
| 3 | Pipeline xaritasi | tushuncha | buyurtma oqimini 5 qadamda ochadi | — |
| 4 | 1-savol | test | pipeline nima degani | ✅ |
| 5 | Vibecoding | tushuncha | Ko'r-ko'rona / Direktor — ikkalasini bosadi | — |
| 6 | 2-savol (Tekshiruv) | test | vibecoding'da sizning rolingiz | ✅ |
| 7 | Pipeline quruvchi | markaziy o'yin | 4 ulanishga prompt yuboradi → «Buyurtma yuborish» | — |
| 8 | Prompt sifati | tushuncha | Noaniq / Aniq promptni solishtiradi | — |
| 9 | Vibecoding sikli | markaziy | 5 qadamli siklni ochadi (bug ham chiqadi) | — |
| 10 | 3-savol (eyebrow: «2-savol») | test | qaysi prompt yaxshi natija beradi | ✅ |
| 11 | AI kodini o'qish | tushuncha | Ko'rmasdan ishlat / O'qib tushun | — |
| 12 | Integratsiya bug'i | case | «Failed to fetch» sababini 3 variantdan topadi | — |
| 13 | 4-savol (eyebrow: «3-savol») | test | ulanish bug'larini qanday tutamiz | ✅ |
| 14 | Namuna (to'liq hikoya) | case | bir o'quvchining 4 qadamini bosib ochadi | — |
| 15 | Qoida | qoida | «bo'l · buyur · testla · ula» + 3 narsa | — |
| 16 | Yakuniy ish — ariza yo'li | yakuniy | 5 bosqichni sudrab tartiblaydi | ✅ (final) |
| 17 | Amaliyot · VS Code | praktika | o'z pipeline'ini AI bilan quradi, 5 bosqichni belgilaydi | — |
| 18 | Natijalar | podium | jonli reyting | — |
| 19 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 20 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (4, 6, 10, 13-ekranlar uchun; 16-ekranda yo'q); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
pipeline (tizim) · 5 qism / komponent · ulanish · direktor / ishchi · vibecoding · prompt (aniq / noaniq) · AI kod · test / testlash · bug · tuzatish · end-to-end (boshidan oxirigacha) · integratsiya bug'i · .env / API_URL · «Failed to fetch» · buyurtma (0–15-ekran) → ariza (16-ekran) · SHAHAR: Peshtoq · Hokimlik · Arxiv · Darvoza · Ekspert-byuro

---

## 0 · Kirish — 5 qism ulanmagan  `[720]`
- Eyebrow: Kirish
- Sarlavha: **5 qism tayyor — lekin ular bir-biriga ulanmagan. Nima yetishmayapti?**
- Mentor: Oldingi modullarda React, Node, PostgreSQL, Telegram, AI ni o'rgandingiz. Endi ularni bitta tizimga ulaymiz. Ikki holatni bosing.
- Tugmalar: 🏝️ Alohida · 🔗 Ulangan
  - **5 alohida qism** — "React bor, Node bor, baza bor, bot bor, AI bor — lekin har biri alohida ishlaydi, bir-biriga ulanmagan."
  - **Bitta tizim** — "Ular ulanganda: bitta "Buyurtma" → backend → baza → bot xabar + AI javob. Hammasi birga ishlaydi!"
- Savol: **Nima yetishmayapti?**
  - Hech narsa — har biri alohida yaxshi
  - Ulanish — ular bir-biriga ma'lumot uzatmasa, tizim emas
  - Ko'proq komponent qo'shish
- Javobdan keyin (qaysi variant tanlansa ham bir xil): To'g'ri — yetishmagani **ulanish (pipeline)**. Bugun beshala qismni bitta ishlaydigan tizimga ulaymiz. Va kodni qo'lda yozmaymiz — **AI-promptlar bilan** (vibecoding). Siz — direktor.
- Tugma: Davom etish

## 1 · Reja  `[762]`
- Eyebrow: Reja
- Sarlavha: **Hamma qismni bitta pipeline'ga ulaymiz**
- Mentor: Qismlarni noldan yozmaymiz — siz **direktor** sifatida AI'ga aniq buyurasiz, kodini o'qib testlaysiz. Bu — vibecoding.
- Blok «Bugungi maqsad»: **5 qism → bitta tizim** · AI-promptlar bilan ulaymiz (vibecoding).
  - → Siz direktor, AI ishchi — butun tizimni siz boshqarasiz
- 5 qadam:
  1. 5 komponent: React, Node, PostgreSQL, Telegram, AI
  2. Pipeline xaritasi: ma'lumot qanday oqadi
  3. Vibecoding: aniq prompt → AI kod → test → tuzat
  4. Pipeline'ni ulash + sikl (jonli) · *jonli*
  5. O'z pipeline build rejangizni yozasiz · *amaliyot*
- Tugmalar (telefonda): 5 qadamni ko'rish / ↩ Maqsadni ko'rish · Boshlaymiz →

## 2 · 5 komponent  `[795]`
- Eyebrow: 5 komponent
- Sarlavha: **Pipeline'ning 5 qismi**
- Mentor: Hammasini avval o'rgandingiz — endi ular bitta jamoa. Har birini bosing: nima qiladi va qaysi moduldan.
- Kartalar (nom · rol · modul — nima qiladi):
  - **React** · Frontend (web) · Modul 3 — Mijoz ko'radigan sahifa — mahsulotlar va "Buyurtma" tugmasi.
  - **Node.js** · Backend (markaz) · Modul 4 — So'rovlarni qabul qiladi va boshqaradi: GET /products, POST /orders.
  - **PostgreSQL** · Database · Modul 4 — Ma'lumotni saqlaydi: products va orders jadvallari.
  - **Telegram** · Bot · Modul 8 — Yangi buyurtmada adminga xabar yuboradi.
  - **AI (Claude)** · Ekspert · Modul 8/9 — Mijoz savoliga javob beradi, mahsulot tavsifini yozadi.
- Xulosa (5 tasi ko'rilgach): Markazda Node.js — barcha so'rov u orqali oqadi. U — butun tizim markazi.
- Tugma: 0/5 komponentni ko'ring → Davom etish

## 3 · Pipeline xaritasi  `[825]`
- Eyebrow: Pipeline xaritasi
- Sarlavha: **Bitta buyurtma — butun tizim harakatda**
- Mentor: Ma'lumot pipeline bo'ylab qanday oqishini ko'ring. Bosib, qadamlarni ochib boring.
- Oqim (↓ bilan):
  1. Mijoz web'da "Buyurtma" bosadi (React)
  2. React → Node'ga POST /orders yuboradi
  3. Node → PostgreSQL'ga buyurtmani saqlaydi
  4. Node → Telegram'da adminga xabar yuboradi
  5. AI mijoz savoliga javob beradi
- Tugmalar: ▶ Buyurtmani boshlash · Keyingi qadam →
- Xulosa: Mana pipeline: bitta bosish — 5 qism ketma-ket ishlaydi. Endi shuni quramiz.
- Tugma: Oqimni kuzating (0/5) → Davom etish

## 4 · 1-savol ✅  `[860]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **"Pipeline" (tizim) nima degani?**
  - Bitta katta kod fayli — hammasi bir joyda
  - Faqat ko'rinadigan frontend qismi
  - Bir-biriga ulanmagan mustaqil dasturlar
  - ✔ Komponentlar bog'lanib, ma'lumot oqadigan tizim
- To'g'ri: To'g'ri! Pipeline — komponentlar (React, Node, DB, bot, AI) bog'lanib, ma'lumot ular orasida oqadigan yagona tizim. Bitta amal butun zanjirni harakatga keltiradi.
- Xato izohlari:
  - Bitta fayl emas — bog'langan komponentlar tizimi.
  - Faqat frontend emas — barcha qismlar birga.
  - Mustaqil emas — aynan ularning BOG'LANISHI pipeline qiladi.
  - (umumiy) Pipeline = bog'langan komponentlar, ma'lumot oqadi.

## 5 · Vibecoding  `[870]`
- Eyebrow: Vibecoding
- Sarlavha: **Vibecoding: siz direktor, AI ishchi**
- Mentor: Vibecoding — AI bilan kod yozish. Lekin ikki xil yo'l bor. Ikkalasini bosing.
- Tugmalar: 🙈 Ko'r-ko'rona · 🎬 Direktor
  - 🙈 — "Sayt qil" deb yozib, AI bergan kodni o'qimasdan ishlatasiz. Bug chiqsa — nima qilishni bilmaysiz.
    - Ogohlantirish: Ko'r-ko'rona — AI xatosini ko'rmaysiz. Tizim sizning nazoratingizdan chiqadi.
  - 🎬 — Aniq buyurasiz, AI kodini o'qiysiz, testlaysiz, kerak bo'lsa tuzatasiz. Tizimni siz boshqarasiz.
    - Yashil: Direktor — AI tez yozadi, siz aql va nazoratni berasiz. Eng kuchli juftlik.
- Xulosa: Vibecoding: aniq buyur · kodni o'qi · testla · tuzat. Siz mas'ulsiz.
- Tugma: Ikkalasini ko'ring → Davom etish

## 6 · 2-savol ✅ (eyebrow: «Tekshiruv»)  `[907]`
- Eyebrow: Tekshiruv · «Mustahkamlash»
- Savol: **Vibecoding'da sizning rolingiz?**
  - ✔ Aniq buyurish, kodni o'qib tushunish va testlash
  - AI bergan har narsani o'qimasdan ishlatish
  - Hamma kodni qo'lda yozish
  - Hech narsa qilmaslik
- To'g'ri: To'g'ri! Siz direktorsiz: aniq buyurasiz, AI kodini o'qib tushunasiz, testlaysiz va tuzatasiz. AI tez yozadi, siz nazorat qilasiz.
- Xato izohlari:
  - O'qimasdan ishlatish — xavfli. Siz tushunishingiz kerak.
  - Hammasini qo'lda emas — AI yozadi, siz boshqarasiz.
  - Direktor faol: buyuradi, o'qiydi, testlaydi.
  - (umumiy) Aniq buyur, o'qib tushun, testla.

## 7 · Pipeline quruvchi (markaziy o'yin)  `[917]`
- Eyebrow: Pipeline quruvchi · jonli
- Sarlavha: **Pipeline'ni prompt bilan ulang**
- Mentor: Har ulanish uchun AI'ga prompt yuborasiz — AI kod yozadi, ulanish yonadi. 4 tasini ulang, keyin "Buyurtma yuboring"!
- Tugunlar: React · Node.js · PostgreSQL · Telegram · AI
- Ulanishlar (tugma: «prompt yubor» → «ulandi»); bosilganda «<ulanish> — promptingiz» + prompt + AI kodi:
  - **React → Node** — ""Buyurtma" tugmasi POST /orders so'rov yuborsin" · `fetch(API + "/orders", { method: "POST", body })`
  - **Node → PostgreSQL** — "Order'ni orders jadvaliga INSERT qil" · `INSERT INTO orders(mahsulot, soni, narx) VALUES(...)`
  - **Node → Telegram** — "Adminga "Yangi buyurtma" xabar yubor" · `bot.sendMessage(ADMIN_ID, "Yangi buyurtma...")`
  - **Node → AI** — "Mijoz savolini Claude'ga yuborib javob ol" · `claude.messages.create({ messages: [...] })`
- Hech biri bosilmaganda: Ulanishni bosing — promptni va AI yozgan kodni ko'rasiz.
- Tugma (4 tasi ulangach): ▶ Buyurtma yuborish
- Natija: ⚡ **Tizim ishladi!** — Buyurtma → bazaga saqlandi → admin xabardor → AI javob berdi. Bitta bosish, butun pipeline.
- Tugma: Ulanishlarni quring (0/4) → Davom etish

## 8 · Prompt sifati  `[965]`
- Eyebrow: Prompt sifati
- Sarlavha: **Aniq prompt = aniq kod**
- Mentor: AI buyruq qanaqa bo'lsa, shunaqa yozadi. Noaniq prompt — taxmin. Aniq prompt — kerakli kod. Ikkalasini bosing.
- Tugmalar: 🌫️ Noaniq · 🎯 Aniq · yorliq «PROMPT:»
  - 🌫️ — "buyurtma qismini yoz"
    - **AI taxmin qiladi** — Qaysi manzil? Qaysi jadval? Javob qanday? AI o'zicha taxmin qiladi — ko'pincha noto'g'ri yoki chala.
  - 🎯 — "Express POST /orders: req.body dan {mahsulot, soni} ol, orders jadvaliga INSERT qil, 201 qaytar"
    - **AI aniq yozadi** — Yo'l, jadval, javob aniq — AI to'g'ri kodni birinchi urinishdayoq yozadi.
- Xulosa: Yaxshi prompt: nima, qayerda, qanday format — aniq ayting.
- Tugma: Ikkalasini ko'ring → Davom etish

## 9 · Vibecoding sikli (markaziy)  `[1000]`
- Eyebrow: Vibecoding sikli · jonli
- Sarlavha: **Vibecoding sikli: prompt → kod → test → tuzat**
- Mentor: Bir ulanishni qanday quramiz? Sikl orqali. Bosib, har qadamni ko'ring — bug ham chiqadi!
- Qadamlar (yorliq — kod/matn — izoh):
  1. **1 · PROMPT** — "Express POST /orders yoz: req.body dan mahsulot va soni ol, orders jadvaliga INSERT qil, 201 qaytar." — Aniq buyruq berasiz — taxmin qoldirmaysiz.
  2. **2 · AI KOD** — `app.post("/orders", async (req, res) => { await db.query("INSERT ..."); res.status(201).json(ok); })` — AI kod yozadi. Siz o'qiysiz — tushunasiz.
  3. **3 · TEST** — Buyurtma yuborib ko'rasiz... ❌ Bug: narx (price) NULL bo'lib saqlanyapti! — Sinab ko'rmasangiz, bugni bilmaysiz.
  4. **4 · TUZATISH** — "INSERT so'roviga narx (price) ustunini ham qo'sh." — Aniq tuzatish prompti — butun kodni qayta yozdirmaysiz.
  5. **5 · QAYTA TEST** — ✅ Ishladi! Narx ham saqlandi. Bitta ulanish tayyor — keyingisiga. — Sikl: prompt → kod → test → tuzat → qayta. Vibecoding shu.
- Tugmalar: ▶ Siklni boshlash · Keyingi qadam →
- Xulosa: Mana sikl: aniq prompt → AI kod → test → bug → tuzat → ishladi. Har ulanish shunday quriladi.
- Tugma: Siklni kuzating (1/5) → Davom etish

## 10 · 3-savol ✅ (eyebrow: «Mashq · 2-savol»)  `[1038]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Qaysi prompt yaxshi natija beradi?**
  - "menga yaxshi ishlaydigan sayt qilib ber"
  - "kerakli kodlarni o'zing yozib tashla"
  - ✔ "POST /orders yoz: body dan mahsulot/soni ol, INSERT qil"
  - "hammasini o'zing bilganingcha hal qilaver"
- To'g'ri: To'g'ri! Aniq prompt — nima (POST /orders), kirish (body), amal (INSERT) aniq aytilgan. AI taxmin qilmaydi, kerakli kodni yozadi.
- Xato izohlari:
  - Juda umumiy — AI nimani, qanday qilishni bilmaydi.
  - Noaniq — qaysi kod, nima uchun?
  - "O'zing hal qil" — nazoratni yo'qotasiz.
  - (umumiy) Aniq, texnik tafsilotli prompt eng yaxshi.

## 11 · AI kodini o'qish  `[1048]`
- Eyebrow: AI kodini o'qish
- Sarlavha: **AI kodiga ko'r-ko'rona ishonmang**
- Mentor: AI tez yozadi, lekin xato ham qiladi. Direktor kodni o'qiydi. Ikkalasini bosing.
- Tugmalar: 🙈 Ko'rmasdan ishlat · 👁️ O'qib tushun
  - 🙈 — Kodni o'qimasdan ishlatasiz. AI maxfiy token'ni kodga yozib qo'yibti — siz bilmaysiz, xavfsizlik teshigi.
    - Ogohlantirish: Ko'rmasdan ishonish — AI xatosi sizning xatongizga aylanadi.
  - 👁️ — Har qatorni o'qiysiz: nima qilyapti, xavfsizmi? Xatoni darrov ko'rasiz va tuzatasiz.
    - Yashil: O'qish — tushunish. Tushunsangiz, tuzata olasiz va nazorat sizda.
- Xulosa: Qoida: AI yozadi, lekin oxirgi qaror — siznikida. Doim o'qing.
- Tugma: Ikkalasini ko'ring → Davom etish

## 12 · Integratsiya bug'i (case)  `[1085]`
- Eyebrow: Integratsiya bug'i
- Sarlavha: **Klassik bug: frontend backendga ulanmayapti**
- Mentor: Qismlarni ulaganda eng ko'p uchraydigan bug — ulanish manzili. Simptomni o'qing, sababni toping.
- 🐞 SIMPTOM: Mijoz "Buyurtma" bosadi — lekin hech narsa bo'lmaydi. Konsolda: `Failed to fetch`. Backend ishlayapti, baza ham. Nima sabab?
- Sababni tanlang:
  - Mahsulot rangi noto'g'ri
  - ✔ .env'da API_URL yo'q yoki noto'g'ri (frontend backendni topolmayapti)
  - Logotip kichik
- Maslahat (topilmaguncha): "Failed to fetch" = frontend backend manziliga yeta olmadi. Manzil qayerda saqlanadi?
- Topilgach: **Topdingiz! 🔧** — Frontend backend manzilini `.env` dan oladi. API_URL yo'q yoki noto'g'ri bo'lsa — ulanmaydi. Tuzatish: to'g'ri URL'ni qo'ying. End-to-end test shu bug'larni tutadi.
- Tugma: Sababni toping → Davom etish

## 13 · 4-savol ✅ (eyebrow: «Mashq · 3-savol»)  `[1127]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Ulanish bug'larini qanday tutamiz?**
  - Kodni umuman testlamay ishonib qo'yamiz
  - ✔ Har ulanishni va oqimni (end-to-end) sinaymiz
  - Faqat tashqi ko'rinish va rangga qaraymiz
  - AI hech qachon xato qilmaydi deb ishonamiz
- To'g'ri: To'g'ri! Har ulanishni alohida, keyin butun pipeline'ni boshidan oxirigacha (end-to-end) sinaymiz. Shunda integratsiya bug'lari (URL, .env, format) ko'rinadi.
- Xato izohlari:
  - Testlamaslik — bug'larni mijoz topadi. Yomon.
  - Rang emas — ulanish ishlayaptimi, shuni sinash kerak.
  - AI ham xato qiladi — shuning uchun testlaymiz.
  - (umumiy) Har ulanishni va end-to-end oqimni sinang.

## 14 · Namuna — to'liq hikoya (case)  `[1137]`
- Eyebrow: Namuna
- Sarlavha: **To'liq hikoya: 5 qism → bitta tizim**
- Mentor: Bir o'quvchining pipeline qurish yo'li — 4 qadam. Har qatorni bosing.
- Ro'yxat sarlavhasi: Pipeline qurish — vibecoding hikoyasi
  - **BO'LDI** — Tizimni 4 ulanishga bo'ldi (React→Node→DB→bot/AI) · Katta vazifani kichik, aniq qadamlarga bo'ldi — har biri alohida quriladi.
  - **PROMPT** — Har ulanish uchun aniq texnik prompt yozdi · Aniq buyruq = aniq kod. AI taxmin qilmadi, kerakli narsani yozdi.
  - **TEST** — Har qadamda testladi, bug topib tuzatdi · AI kodiga ko'r-ko'rona ishonmadi — o'qib, sinab, tuzatib bordi.
  - **ISHLADI** — Bitta buyurtma butun tizimni harakatga keltirdi · 5 qism — bitta tirik pipeline. Direktor siz, ishchi AI.
- Xulosa: Bo'l → prompt → test → ishlat. Mana vibecoding bilan tizim qurish. Endi o'zingiz rejalang.
- Tugma: 0/4 ko'ring → Endi navbat sizga →

## 15 · Qoida  `[1168]`
- Eyebrow: Qoida
- Sarlavha: **Vibecoding: bo'l · buyur · testla · ula**
- Mentor: Yodda tuting: tizimni qismlarga bo'l, aniq prompt ber, kodni o'qib testla, qadam-qadam ula.
- Blok: 🎬 **Siz — direktor** — AI ishlaydi, siz butun tizimni boshqarasiz.
- 3 narsani unutmang (↓ bilan):
  1. ANIQ PROMPT — nima, qayer, qanday format
  2. KODNI O'QI — ko'r-ko'rona ishonma
  3. TESTLA + TUZAT — har ulanishni sinab ula
- Tugma: Yakuniy ishga →

## 16 · Yakuniy ish — ariza yo'li ✅ (final)  `[1191]`
- Eyebrow: Yakuniy ish · Katta ochilish
- Sarlavha: **Bitta ariza — butun shahar bo'ylab**
- Mentor: Katta ochilish! Bitta ariza Peshtoqdan chiqib, butun shahar bo'ylab sayohat qiladi. Bosqichlarni **to'g'ri tartibda** joylang — ariza qayerdan qayerga o'tadi?
- Bo'laklar:
  - Peshtoq (React) — «Arizani yubor»
  - Hokimlik (Node) — so'rovni qabul qiladi
  - Arxiv (PostgreSQL) — arizani saqlaydi
  - ✈️ Darvoza (Telegram) — adminga xabar
  - Ekspert-byuro (AI) — javob yozadi
- Uyachalar: 1-bosqich · 2-bosqich · 3-bosqich · 4-bosqich · 5-bosqich · «bu yerga joylang»
- ✔ To'g'ri tartib: Peshtoq → Hokimlik → Arxiv → Darvoza → Ekspert-byuro
- To'g'ri: To'g'ri! Ariza uchidan-uchiga sayohat qildi — shahar tirik!
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang · ⚠️ Tartib xato — qayta joylang.
- Xulosa: Mana to'liq pipeline: Peshtoq → Hokimlik → Arxiv → Darvoza → Ekspert-byuro. Bitta amal — butun tizim harakatda.
- Tugma: Ariza yo'lini tartiblang → Davom etish

## 17 · Amaliyot · VS Code (praktika)  `[1917]`
- Eyebrow: Amaliyot · VS Code
- Sarlavha: **Pipeline'ingizni AI bilan quring**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z mini-tizimingizni bosqichma-bosqich ulang: har ulanish uchun aniq prompt yozing, AI kodini o'qing, testlang. Biz baholamaymiz — siz direktor, ustoz kuzatadi.
- Bosqichlar — belgilab boring:
  1. Loyihani oching: `frontend` (React) va `backend` (Node) papkalari
  2. 1-ulanish: `React -> Node` — «`POST /orders` yuboradigan tugma yoz» deb prompt bering
  3. AI kodini o'qing: `fetch(API_URL + "/orders")` to'g'ri manzilga ketyaptimi?
  4. 2-ulanish: `Node -> PostgreSQL` — «buyurtmani `orders` jadvaliga `INSERT` qil» prompti
  5. End-to-end sinang: bitta «Buyurtma» bosing — butun oqim ishladimi tekshiring
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.»
- Tugma: Avval bajaring → Davom etish

## 18 · Natijalar (podium)  `[1740]`
- Sarlavha: **Kim g'olib?** · Natijalar — umumiy shablon (5-Modul 1-darsidagi bilan bir xil).
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Savol yorliqlari: 1 — Pipeline · 2 — Direktor · 3 — Prompt · 4 — Integratsiya · 5 — Tartib

## 19 · Takrorlash (kartochkalar)  `[2004]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pipeline nima degani? | Bog'langan komponentlar tizimi | Ma'lumot ular orasida ketma-ket oqadi |
| Bizning pipeline nechta qismdan yig'ilgan? | 5 ta | React, Node.js, PostgreSQL, Telegram bot, AI |
| Mijoz ko'radigan sahifani nima chizadi? | React | Frontend: mahsulotlar va «Buyurtma» tugmasi |
| So'rovlarni qabul qilib boshqaradigan markaz qaysi? | Node.js | Backend: barcha so'rov u orqali oqadi |
| Buyurtmalar qayerda saqlanadi? | PostgreSQL | Ma'lumotlar bazasi: products va orders jadvallari |
| Yangi buyurtmada adminga kim xabar yuboradi? | Telegram bot | Xabarni Node.js unga uzatadi |
| Mijoz savoliga kim javob yozadi? | AI (Claude) | Mahsulot tavsifini ham u yozadi |
| Vibecoding nima? | AI'ga buyruq berib kod yozdirish | Siz direktorsiz, AI esa ishchi |
| AI yozgan kodni nima qilish kerak? | O'qib tushunish | Ko'r-ko'rona ishonsangiz, AI xatosi sizniki bo'ladi |
| Aniq prompt nimalarni aytadi? | Nima, qayerda, qanday formatda | «Sayt qil» emas, «POST /orders yoz» |
| Backend manzili qaysi faylda saqlanadi? | .env | Ichida API_URL yoziladi |
| Konsolda «Failed to fetch» chiqsa, avval nimani tekshirasiz? | .env ichidagi API_URL | Eng ko'p uchraydigan integratsiya bug'i |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 20 · Yakun  `[2030]`
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Endi siz butun tizim quryasiz.**
- Endi siz bilasiz:
  - Pipeline — 5 qism (React, Node, PostgreSQL, Telegram, AI) bitta tizimga ulanadi
  - Vibecoding: siz direktor, AI ishchi — buyurasiz, kodni o'qiysiz, testlaysiz
  - Aniq prompt (nima·qayer·format) = aniq kod; AI kodini doim o'qing
  - Integratsiya bug'i (URL/.env) — end-to-end test bilan tutiladi
  - Bitta ariza butun shahar bo'ylab uchidan-uchiga sayohat qiladi
- Uyga vazifa:
  - **Bo'ling** — tizimni ulanishlarga bo'ling, har biriga aniq prompt yozing
  - **Ulang** — qadam-qadam ulang, har ulanishni alohida testlang
  - **Sinang** — bitta buyurtma bilan butun oqimni (end-to-end) tekshiring
- 📝 Uyga vazifa · Amaliy topshiriqni bajarish →
- 📱 Keyingi dars — React Native: pipeline'ingizga «ko'chma darvoza» (mobil ilova) qo'shamiz!
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — 0/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4) — nomlari inglizcha:** 🔗 Full Pipeline — Pipeline — 5 qism bitta tizimda ekanini bildingiz (4-ekran) · 🚀 End to End — Aniq promptni tanidingiz: nima, qayer, format (10-ekran) · 🏙️ All Connected — Integratsiya bug'ini test bilan tutishni bildingiz (13-ekran) · 🎉 City Live — Ariza sayohatini tartibladingiz — shahar tirik! (16-ekran)
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (4)** (umumiy: 📖 Qayta tushuntirish · 🗣️ Sinfga savol: · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz):
1. (4-ekran) Pipeline — bog'langan tizim: 🔗 Qismlar ulanadi — Pipeline — 5 komponent (React, Node, DB, bot, AI) bir-biriga ulangan yagona tizim. · ➡️ Ma'lumot oqadi — Ma'lumot ular orasida ketma-ket oqadi — biridan ikkinchisiga. · ⚡ Bitta amal — butun zanjir — Bitta «Arizani yubor» butun shaharni harakatga keltiradi. · Sinfga savol: Pipeline oddiy fayldan nimasi bilan farq qiladi?
2. (6-ekran) Vibecoding — siz direktor: 🎬 Siz buyurasiz — Direktor sifatida AI'ga aniq buyruq berasiz — kodni o'zingiz yozmaysiz. · 👁️ Kodni o'qiysiz — AI yozgan kodni o'qib tushunasiz — ko'r-ko'rona ishonmaysiz. · 🔁 Testlab tuzatasiz — Sinab, bug topsangiz — aniq tuzatish prompti berasiz. · Sinfga savol: Nega kodni o'qib tushunish kerak?
3. (10-ekran) Aniq prompt = aniq kod: 🎯 Nima, qayer, format — Yaxshi prompt: nima qilish, qayerda, qanday format — aniq aytiladi. · 🌫️ Noaniq — taxmin — Noaniq prompt bilan AI taxmin qiladi — ko'pincha chala yoki xato. · ✅ Aniq — to'g'ri kod — Aniq prompt bilan AI kerakli kodni birinchi urinishda yozadi. · Sinfga savol: Qaysi prompt aniqroq: «sayt qil» yoki «POST /orders yoz»?
4. (13-ekran) Integratsiya bug'i — ulanish xatosi: 🐞 Ulanish uziladi — Eng ko'p bug — ulanish manzili (URL/.env) noto'g'ri bo'lishi. · 🔍 End-to-end sinash — Har ulanishni va butun oqimni boshidan oxirigacha sinaymiz. · 🔧 Bug ko'rinadi — Shunda «Failed to fetch» kabi integratsiya xatolari tutiladi. · Sinfga savol: Ulanish bug'ini qanday tutamiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Pipeline (tizim) nima degani? ✔ Qismlar bog'lanib, ma'lumot oqadigan tizim · Bitta katta kod fayli — hammasi ichida · Faqat ko'rinadigan frontend qismi · Bir-biriga ulanmagan mustaqil dasturlar
2. Vibecoding'da sizning rolingiz qanday? Hamma kodni qo'lda yozasiz · ✔ Direktor — buyurasiz, kodni o'qiysiz, testlaysiz · Hech narsa qilmaysiz · AI bergan narsani ko'rmasdan ishlatasiz
3. Frontend backend manzilini qayerdan oladi? Kod ichiga qattiq yozilgan · Foydalanuvchi kiritadi · ✔ .env faylidan (API_URL) · Har safar o'zi topadi
4. «Failed to fetch» xatosi ko'pincha nimadan? Logotip juda kichik bo'lganidan · Mahsulot rasmining rangidan · Sahifa sarlavhasi noto'g'riligidan · ✔ Backend manzili (URL/.env) xatoligidan
5. Aniq prompt qanday bo'ladi? ✔ Nima, qayer, qanday format — aniq aytilgan · «saytni yaxshi qilib yozib ber» degan · «hammasini o'zing bilganingcha qil» · Umuman aniq buyruq bermaslik
6. AI yozgan kodni nima uchun o'qiysiz? Rangini o'zgartirish uchun · ✔ Xato/xavfni ko'rib, tuzatish uchun · Faylni kattalashtirish uchun · AI'ni maqtash uchun
7. Integratsiya bug'ini qanday tutamiz? Faqat rangga qaraymiz · Umuman testlamaymiz · ✔ End-to-end (boshidan oxirigacha) sinaymiz · AI xato qilmaydi deb ishonamiz
8. Buyurtma yuborilganda qaysi qism birinchi ishlaydi? PostgreSQL (arxiv) · Telegram (darvoza) · AI (ekspert-byuro) · ✔ React (peshtoq/frontend)
9. Node.js (backend) pipeline'da qaysi rolni bajaradi? ✔ Markaz — so'rovlarni qabul qilib boshqaradi · Faqat rasm va chizmalar chizadi · Ma'lumotni umuman ko'rmay o'tkazadi · Foydalanuvchi parolini saqlaydi
10. Buyurtma ma'lumoti qayerda saqlanadi? Telegram bot xabarida · ✔ PostgreSQL jadvalida (orders) · Brauzer tarixida saqlanadi · Hech qayerda saqlanmaydi
11. Vibecoding sikli qanday ketadi? Faqat bitta prompt yozib to'xtab qolish · Kodni umuman ko'rmasdan ishlatish · ✔ Prompt -> AI kod -> test -> tuzat -> qayta · Hammasini bir promptda yozdirish
12. «End-to-end test» nimani tekshiradi? Faqat bitta tugmaning rangini · Faqat kirish (login) sahifasini · Faqat ma'lumotlar bazasi nomini · ✔ Butun oqimni — buyurtma zanjirdan o'tadimi

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **SHAHAR metaforasi faqat oxirida birdan chiqadi** — 0–15-ekranlarda «buyurtma», React/Node/... deyiladi; 16-ekranda to'satdan «ariza», Peshtoq, Hokimlik, Arxiv, Darvoza, Ekspert-byuro. Oldin tanishtirilmagan (4-ekran RECAPS 3-kartasida ham «Arizani yubor… shahar» tushuntirishsiz). Viktorina 8-savolida ham shu nomlar.
- **Savol raqamlari ikki xil** — 6-ekran «Tekshiruv», 10-ekran «Mashq · 2-savol», 13-ekran «Mashq · 3-savol»; podium esa 2 — Direktor, 3 — Prompt, 4 — Integratsiya deb sanaydi.
- **0-ekran hook** — qaysi variant tanlansa ham «To'g'ri — yetishmagani ulanish» chiqadi («Hech narsa» yoki «Ko'proq komponent» tanlasa ham).
- **Sotilib qolgan testlar** — 6-ekran (to'g'risi eng uzun, qolganlari «Hech narsa qilmaslik» kabi bema'ni), 10-ekran (texnik ko'rinadigan yagona variant), 13-ekran; viktorinada ham bema'ni variantlar ko'p («AI'ni maqtash uchun», «Faylni kattalashtirish uchun», «Logotip juda kichik»).
- **Izohsiz inglizcha/texnik so'zlar** — «bug», «Klassik bug», «Simptom» (12), «end-to-end» (12-ekranda birinchi marta izohsiz; 13-ekranda izohlanadi), «Failed to fetch», «req.body», «201», «Database» (2-ekran rol yorlig'i), «build rejangiz» (1-ekran), «Order'ni» (7-ekran prompti).
- **Nishon nomlari inglizcha** — Full Pipeline · End to End · All Connected · City Live.
- **2-ekran modul raqamlari** — Telegram «Modul 8», AI «Modul 8/9» (dars 6-Modul / LMS 8-Modulda turibdi; qaysi raqamlash ekani noaniq).
- **Grammatika** — 20-ekran sarlavhasi «Endi siz butun tizim quryasiz» (qurasiz / qura olasiz?); 1-ekran 5-qadam «O'z pipeline build rejangizni yozasiz» — amaliyot ekranida reja yozilmaydi, pipeline quriladi.
