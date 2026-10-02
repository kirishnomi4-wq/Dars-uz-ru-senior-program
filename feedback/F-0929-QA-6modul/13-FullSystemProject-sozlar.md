# 6-Modul (LMS: 8-Modul) · 13-dars «Loyiha kuni: to'liq tizim» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/FullSystemProjectLesson.jsx` · 21 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** «Hamma qism tayyor» — web, mobil, bot, backend, baza, AI tayyor, lekin birga ishlashini hech kim tekshirmagan. O'quvchi ishga tushirishdan oldingi oxirgi qadamni 3 variantdan tanlaydi (har qanday tanlovdan keyin: «avval end-to-end test va bug tuzatish»).
- **Markaziy o'yin/mexanika:** ikkita «jonli» ekran — (1) order trace: bir kanalni tanlab buyurtma yuboradi, u backend → baza/bot/AI ga boradi (uchala kanal); (2) test matritsasi: 3 kanal × 4 qadam = 12 katak, bittasi qizil (Mobil × «Bot xabar») → keyin 4 qadamli bug tuzatish sikli.
- **Asosiy metafora:** «ko'p eshik (darvoza), bitta tizim (shahar)»; shahar lug'ati (Arxiv = baza, Hokimlik = backend, Peshtoq = frontend, Ekspert-byuro = AI, «chok» = qismlar ulangan joy) asosan takrorlash oynalari, yakuniy ekran, kartochka va viktorinada chiqadi.
- **Yakun:** «Katta ochilish» — shaharni to'g'ri tartibda ishga tushirish (Arxiv → Hokimlik → Peshtoq → Ikkinchi darvoza), keyin VS Code amaliyoti, podium, 12 kartochka va «Kursni tamomladingiz» yakuni.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — hamma qism tayyor | hook | oxirgi qadamni 3 variantdan tanlaydi | — |
| 1 | Reja | qoida | bugungi maqsad + 5 qadam | — |
| 2 | To'liq tizim xaritasi | tushuncha | 6 komponentni bosib, nima qilishi va qaysi moduldan ekanini o'qiydi | — |
| 3 | Ko'p kanal, bitta tizim | tushuncha | Web / Mobil / Bot kanallarini bosadi | — |
| 4 | 1-savol | test | nega uch kanal bitta tizim | ✅ |
| 5 | End-to-end | tushuncha | buyurtma oqimining 5 qadamini ketma-ket ochadi | — |
| 6 | Tekshiruv (2-savol) | test | end-to-end test nimani tekshiradi | ✅ |
| 7 | Order trace · jonli | markaziy | uchala kanaldan buyurtma yuboradi | — |
| 8 | Integratsiya choklari | tushuncha | 4 chokni bosib, nima buzilishini o'qiydi | — |
| 9 | Test matritsasi · jonli | markaziy | testni ishga tushiradi, qizil katakni ko'radi | — |
| 10 | 3-savol (Mashq · 2-savol) | test | integratsiya bug'ini qanday tutamiz | ✅ |
| 11 | Bug tuzatish · jonli | amaliyot | 4 qadamli tuzatish siklini ochadi | — |
| 12 | Ishga tushirish | tushuncha | launch checklist'ni belgilaydi (4 band) | — |
| 13 | 4-savol (Mashq · 3-savol) | test | ishga tushirishdan oldin nima shart | ✅ |
| 14 | Ishga tushdi | case | bir o'quvchining 4 qadamli yo'lini ochadi | — |
| 15 | Qoida | qoida | yig' · test · tuzat · ship | — |
| 16 | Amaliyot · VS Code | praktika | o'z loyihasida tizimni yig'ib sinaydi, «Bajardim» | — |
| 17 | Yakuniy · katta ochilish | yakuniy | 4 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 18 | Natijalar | podium | jonli reyting | — |
| 19 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 20 | Yakun | xulosa | 5 xulosa + uyga vazifa + nishonlar + jonli viktorina | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (4, 6, 10, 13-ekranlar); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
kanal (web / mobil / bot) · bitta backend · baza · yadro · ko'p eshik (darvoza), bitta tizim (shahar) · end-to-end (boshidan oxirigacha) · oqim ·
order trace · chok (qismlar ulangan joy) · integratsiya bug'i · test matritsasi (kanal × qadam) · qizil/yashil katak · tuzatish prompti ·
.env (API_URL, BOT_TOKEN, AI kaliti) · launch checklist · deploy / ship · Arxiv (baza) · Hokimlik (backend) · Peshtoq (frontend) · Ekspert-byuro (AI) · Ikkinchi darvoza (bot) · katta ochilish · tizim arxitektori

---

## 0 · Kirish — hamma qism tayyor  `[749]`
- Eyebrow: Kirish · Kurs finali
- Sarlavha: **Hamma qism tayyor. Ishga tushirishdan oldingi oxirgi qadam nima?**
- Mentor: Kurs davomida web, mobil, bot, backend, baza, AI — hammasini qurdingiz. Bugun ularni bitta tizimga yig'amiz va ishga tushiramiz. Lekin avval bitta narsa shart.
- Blok: **Sizda tayyor turgan qismlar** — 💻 Web · 📱 Mobil · ✈️ Bot · 🟢 Backend · 🐘 Baza · 🤖 AI
  - Olti qism — lekin ular birga, xatosiz ishlashini hali hech kim tekshirmadi.
- Savol: **Birinchi nima qilamiz?**
  - Darrov e'lon qilish — vaqt ketmasin
  - Butun tizimni boshidan oxirigacha test qilib, bug'larni tuzatish
  - Yana yangi funksiyalar qo'shish
- Javobdan keyin (qaysi tanlansa ham): To'g'ri — avval **end-to-end test va bug tuzatish**. Bugun: hamma qismni yig'amiz, butun tizimni sinaymiz, bug'ni topib tuzatamiz va ishga tushiramiz. Bu — **kursning yakuniy loyiha kuni**.
- Tugma: Davom etish

## 1 · Reja  `[788]`
- Eyebrow: Reja
- Sarlavha: **Kursning yakuniy loyiha kuni**
- Mentor: Bugun yangi narsa o'rganmaymiz — bilganlarimizni **bitta to'liq tizimga** yig'amiz va ishga tushiramiz. Bu — kursning grand-finali.
- Blok «Bugungi maqsad»: **Hamma qism → bitta tizim** — Yig'amiz, sinaymiz, tuzatamiz, ishga tushiramiz.
  - → Siz endi tizim arxitektori — butun tizimni boshqarasiz
- **5 qadam:**
  1. Hamma qismni bitta tizimga yig'ish (web + mobil + bot)
  2. Ko'p kanal — bitta backend (order trace) · *jonli*
  3. End-to-end test — butun oqimni sinash · *jonli*
  4. Integratsiya bug'ini topish va tuzatish
  5. Ishga tushirish (ship) + kursni yakunlash · *finale*
- Tugmalar (telefonda): 5 qadamni ko'rish / ↩ Maqsadni ko'rish · Boshlaymiz →

## 2 · To'liq tizim xaritasi  `[821]`
- Eyebrow: To'liq tizim xaritasi
- Sarlavha: **Bularning hammasini siz qurdingiz**
- Mentor: Mana to'liq tizim: yuqorida 3 ta kanal (kirish), pastda yadro. Har birini bosing — nima qiladi va qaysi moduldan.
- Guruh **Kanal (kirish)**:
  - **Web (React)** · Web sahifa — Brauzerda mahsulotlar va «Buyurtma» tugmasi. · *Modul 3*
  - **Mobil (RN)** · Mobil ilova — Telefonda o'sha do'kon — Expo Go bilan. · *Modul 9*
  - **Telegram bot** · Bot kanal — Buyurtma va xabarlar Telegram orqali. · *Modul 8*
- Guruh **Yadro**:
  - **Node.js** · Backend (Hokimlik) — Barcha kanaldan so'rovni qabul qilib boshqaradi. · *Modul 4*
  - **PostgreSQL** · Baza (Arxiv) — Mahsulot va buyurtmalarni saqlaydi — bitta joyda. · *Modul 4*
  - **AI (Claude)** · Ekspert-byuro — Mijoz savoliga javob, tavsif yozadi. · *Modul 8/9*
- Yakun: 6 qism, 6 modul mehnati — bitta tizim. Endi ularni birga ishlatamiz.
- Tugma: N/6 komponentni ko'ring → Davom etish

## 3 · Ko'p kanal, bitta tizim  `[859]`
- Eyebrow: Ko'p kanal, bitta tizim
- Sarlavha: **Uch kanal — bitta backend**
- Mentor: Mijoz web, mobil yoki bot orqali keladi — lekin uchchasi ham o'sha backend va bazadan foydalanadi. Har kanalni bosing.
- Tugmalar: Web · Mobil · Bot → sxema markazida «Backend + Baza»
- Karta: **«[kanal] kanali»** — Bu kanal ham **o'sha** Node.js backendga so'rov yuboradi va **o'sha** PostgreSQL bazasidan o'qiydi. Hech narsa ikki marta qurilmaydi.
- Xulosa: Mana o'sha g'oya to'liq miqyosda: **ko'p eshik, bitta tizim**. Ma'lumot bitta joyda — shuning uchun hammasi mos.
- Tugma: Kanallarni ko'ring (N/3) → Davom etish

## 4 · 1-savol ✅  `[895]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega bu uch kanal bitta tizim?**
  - ✔ Uchchasi o'sha bitta backend va bazadan foydalanadi
  - Har birining o'z alohida backendi va bazasi bor
  - Ular bir-biriga bog'lanmagan — butunlay alohida
  - Faqat ranglari va tashqi ko'rinishi bir xil
- To'g'ri: To'g'ri! Web, mobil, bot — uchala kanal o'sha bitta backend va PostgreSQL bazasidan foydalanadi. Ma'lumot bitta joyda bo'lgani uchun hamma kanal bir xil holatni ko'radi — bu bitta tizim.
- Xato izohlari:
  - Alohida backend emas — bitta backend hamma kanalga xizmat qiladi.
  - Aynan bog'liq — bitta backend orqali.
  - Rang emas — umumiy backend va baza.
  - (umumiy) Bitta backend + bitta baza = bitta tizim.

## 5 · End-to-end  `[915]`
- Eyebrow: End-to-end
- Sarlavha: **End-to-end: boshidan oxirigacha**
- Mentor: «End-to-end» — bitta amalni boshidan (mijoz) oxirigacha (tasdiq) kuzatish. Har qism birga ishlayaptimi, shu sinaladi. Bosing.
- Oqim (bittadan ochiladi):
  1. Mijoz mobildan «Buyurtma» bosadi
  2. Backend so'rovni qabul qiladi
  3. Buyurtma bazaga saqlanadi
  4. Bot adminga xabar yuboradi
  5. Mijozga tasdiq qaytadi
- Tugmalar: ▶ Oqimni boshlash · Keyingi qadam →
- Xulosa: End-to-end test = shu 5 qadamni birga sinash. Bitta qadam ishlamasa — tizim chala. Shuni tutamiz.
- Tugma: Oqimni kuzating (N/5) → Davom etish

## 6 · Tekshiruv (2-savol) ✅  `[949]`
- Eyebrow: Tekshiruv · «Mustahkamlash»
- Savol: **End-to-end test nimani tekshiradi?**
  - Faqat bitta funksiyani alohida holda tekshiradi
  - Faqat sahifaning ranglari va dizaynini
  - ✔ Butun oqimni boshidan oxirigacha tekshiradi
  - Faqat backend kodini o'qib chiqadi
- To'g'ri: To'g'ri! End-to-end test butun oqimni (mijoz → backend → baza → bot → tasdiq) boshidan oxirigacha sinaydi. Bu integratsiya bug'larini — qismlar orasidagi choklarni — ochib beradi.
- Xato izohlari:
  - Bitta funksiya emas — butun zanjirni birga.
  - Rang emas — oqim ishlayaptimi.
  - Faqat o'qish kam — amalda sinash kerak.
  - (umumiy) Butun oqimni boshidan oxirigacha sinaydi.

## 7 · Order trace · jonli (markaziy)  `[969]`
- Eyebrow: Order trace · jonli
- Sarlavha: **Qaysi kanaldan kelsa ham — o'sha tizim javob beradi**
- Mentor: Kanalni tanlang, «Buyurtma yubor» bosing — buyurtma o'sha backendga borib, bazaga saqlanadi, bot xabar beradi, AI javob qaytaradi. Uchala kanalni sinab ko'ring — natija bir xil!
- Kanal tugmalari: Web · Mobil · Bot (sinalgani ✓ bilan)
- Sxema: [kanal] → 🟢 Backend → 🐘 Baza · ✈️ Bot · 🤖 AI
- Tugmalar: ▶ [Kanal]dan buyurtma yubor · (oqayotganda) Buyurtma oqyapti… · Yana yubor →
- Oldin (maslahat): Buyurtma yuboring — o'sha bitta backend uni qabul qilib, baza/bot/AI ga tarqatadi.
- Har yuborishdan keyin: **[Kanal]dan keldi — tizim ishladi** — Bazaga saqlandi · admin xabardor · AI javob berdi. Boshqa kanal ham xuddi shunday.
- Xulosa (3/3): Uchala kanal — bitta natija. Mana **tirik tizim**: kirish ko'p, yadro bitta.
- Tugma: Uch kanalni sinang (N/3) → Davom etish

## 8 · Integratsiya choklari  `[1031]`
- Eyebrow: Integratsiya choklari
- Sarlavha: **Tizim choklarda siniydi**
- Mentor: Qismlar yaxshi ishlaydi — lekin ular ULANGAN joyda (chok) bug chiqadi. Har chokni bosing: bu yerda nima buziladi?
- Oldin (maslahat): Bir chokni bosing — qaysi sozlama yoki ulanish buzilishini ko'rasiz.
- Choklar (bosilganda «🐞 BU YERDA NIMA BUZILADI»):
  - **Frontend ↔ Backend** — API_URL noto'g'ri (.env) — «Failed to fetch»
  - **Mobil ↔ Backend** — Mobil eski manzilga ulanyapti yoki maydon yetishmaydi
  - **Bot ↔ Backend** — BOT_TOKEN yo'q yoki xato — bot xabar yubormaydi
  - **Backend ↔ AI** — AI kaliti yo'q yoki limit tugagan — javob kelmaydi
- Xulosa: Aksar bug'lar — bitta yo'qolgan sozlama (.env) yoki yetishmagan maydon. End-to-end test aynan shularni tutadi.
- Tugma: Choklarni ko'ring (N/4) → Davom etish

## 9 · Test matritsasi · jonli (markaziy)  `[1071]`
- Eyebrow: Test matritsasi · jonli
- Sarlavha: **End-to-end test: har kanal × har qadam**
- Mentor: Har kanaldan butun oqimni sinaymiz. «Test ishga tushir» bosing — kataklar yashil bo'lib boradi. Bittasiga e'tibor bering!
- Matritsa: qatorlar Web · Mobil · Bot × ustunlar Buyurtma · Bazada · Bot xabar · AI javob
- Oldin (maslahat): Har katak = bitta kanaldan bitta qadam. Yashil — ishladi, qizil — bug.
- Tugmalar: ▶ Test ishga tushir · (davomida) Sinalyapti…
- Natija: **🐞 BUG TOPILDI** — **Mobil × «Bot xabar»** qizil: mobildan buyurtma berilganda admin Telegram xabarini olmadi. Web va bot ishlaydi — demak chok mobilda.
- Xulosa: Mana end-to-end testning kuchi: 11 katak yashil, lekin 1 qizil — yashirin integratsiya bug'i ko'rindi. Endi tuzatamiz.
- Tugma: Testni ishga tushiring → Davom etish

## 10 · 3-savol ✅  `[1122]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Integratsiya bug'larini qanday tutamiz?**
  - Faqat bitta kanalni bir marta sinab ko'ramiz
  - Faqat kodga qaraymiz, ishlatib ko'rmaymiz
  - Umuman test qilmaymiz, to'g'ridan chiqaramiz
  - ✔ Har kanaldan butun oqimni (end-to-end) sinaymiz
- To'g'ri: To'g'ri! Har kanaldan butun oqimni end-to-end sinaymiz. Matritsa ko'rsatadi: qaysi kanal × qaysi qadam buzilgan. Shunday qilib chok qayerda ekanini aniq topamiz.
- Xato izohlari:
  - Bitta kanal kam — bug boshqa kanalda bo'lishi mumkin (mobildagidek).
  - Faqat o'qish kam — amalda sinash kerak.
  - Test qilmaslik — bug'ni mijoz topadi.
  - (umumiy) Har kanal × har qadam — end-to-end.

## 11 · Bug tuzatish · jonli  `[1142]`
- Eyebrow: Bug tuzatish · jonli
- Sarlavha: **Bug'ni topdik → tuzatamiz**
- Mentor: Qizil katakni topdik. Endi direktor sifatida sababni aniqlab, aniq tuzatish prompti beramiz va qayta sinaymiz. Bosing.
- Sikl (bittadan ochiladi; karta: yorliq · matn · izoh):
  1. **1 · BUG** — Test matritsasida bitta qizil katak: Mobil × «Bot xabar». Mobildan buyurtma berilganda admin Telegram xabarini olmadi. — *End-to-end test integratsiya bug'ini tutdi — web ishlaydi, mobil yo'q.*
  2. **2 · SABAB** — Mobil checkout POST /orders so'rovida buyurtma to'liq emas, shuning uchun backend bot xabari bosqichini o'tkazib yubordi. — *Web ishlaydi, mobil yo'q — demak chok mobil↔backend orasida.*
  3. **3 · TUZATISH PROMPTI** — «Mobil checkout barcha buyurtma maydonlarini yuborsin; backend HAR buyurtmada, kanal qaysi bo'lishidan qat'i nazar, bot xabarini yuborsin.» — *Aniq, nishonli tuzatish — butun tizimni qayta yozmaysiz.*
  4. **4 · QAYTA TEST** — Matritsa endi to'liq yashil ✅ — uchala kanaldan ham bot xabari keladi. — *Bug tuzatildi. Tizim end-to-end ishlaydi.*
- Tugmalar: ▶ Tuzatishni boshlash · Keyingi qadam →
- Xulosa: Topildi → sabab → aniq prompt → qayta test. Bitta chok yamaldi, butun tizim yana yashil. Endi ishga tushiramiz.
- Tugma: Siklni kuzating (N/4) → Davom etish

## 12 · Ishga tushirish  `[1179]`
- Eyebrow: Ishga tushirish
- Sarlavha: **Ishga tushirishdan oldin — launch checklist**
- Mentor: Tizimni ishga tushirishdan oldin shu ro'yxatni belgilang. Hammasi tayyor bo'lsa — ship!
- Ro'yxat **Launch checklist** (bosib belgilanadi):
  - Barcha sozlamalar (.env) to'g'ri: API_URL, DATABASE_URL, BOT_TOKEN, AI kaliti
  - End-to-end test o'tdi — matritsa to'liq yashil
  - Mobil ilova Expo Go'da haqiqiy telefonda sinaldi
  - Backend deploy qilindi — 24/7 ishlaydi
- Oldin (maslahat): Har bandni bosib belgilang. Bular bo'lmasa — tizim mijozda buziladi.
- Natija: 🚀 **Ishga tushirishga tayyor!** — Sozlama to'g'ri, test o'tdi, mobil sinaldi, backend jonli. Endi mijozlar foydalanadi.
- Tugma: Belgilang (N/4) → Davom etish

## 13 · 4-savol ✅  `[1212]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Ishga tushirishdan oldin nima shart?**
  - Hech narsa — darrov mijozga chiqaramiz
  - ✔ End-to-end test o'tgan va .env to'g'ri bo'lishi
  - Faqat ko'proq rang va bezak qo'shish
  - Faqat logotip va nom tayyor bo'lishi
- To'g'ri: To'g'ri! Ishga tushirishdan oldin end-to-end test o'tgan bo'lishi (barcha kanal × qadam yashil) va sozlamalar to'g'ri bo'lishi shart. Aks holda bug'ni mijoz topadi.
- Xato izohlari:
  - Darrov chiqarish — bug'lar mijozga tushadi.
  - Rang muhim, lekin test va sozlama shart.
  - Logotip yetarli emas — tizim ishlashi kerak.
  - (umumiy) End-to-end test o'tgan + sozlama to'g'ri.

## 14 · Ishga tushdi (case)  `[1232]`
- Eyebrow: Ishga tushdi
- Sarlavha: **Tizim jonli — bir o'quvchining yo'li**
- Mentor: Mana bir o'quvchi to'liq tizimni qanday yetkazdi — 4 qadam. Har qatorni bosing.
- Ro'yxat sarlavhasi: Yig'→test→tuzat→ship
  - **YIG'DI** — Web + mobil + bot — uchala kanalni bitta backendga uladi · *Hammasi o'sha baza va mantiqdan foydalanadi. Ko'p eshik, bitta tizim.*
  - **TESTLADI** — End-to-end: har kanaldan buyurtma berib, butun oqimni sinadi · *Bitta amal butun tizimni boshidan oxirigacha tekshiradi.*
  - **TUZATDI** — Integratsiya bug'ini topdi va aniq prompt bilan tuzatdi · *Chok qayerda ekanini topib, nishonli yamadi.*
  - **ISHGA TUSHIRDI** — Tizimni deploy qildi — mijozlar uch kanaldan kelyapti · *Tayyor, sinangan, jonli tizim. Kurs tamom!*
- Xulosa: Yig' → test → tuzat → ship. Mana to'liq tizimni yetkazish. Endi o'zingiz rejalang.
- Tugma: N/4 ko'ring → Endi navbat sizga →

## 15 · Qoida  `[1263]`
- Eyebrow: Qoida
- Sarlavha: **To'liq tizim: yig' · test · tuzat · ship**
- Mentor: Yodda tuting: hamma qismni yig', butun oqimni end-to-end sinab ko'r, chokdagi bug'ni tuzat, keyin ishga tushir.
- Karta: 🎬 **Siz — tizim arxitektori** — Qismlarni yig'asiz, sinaysiz va ishlaydigan tizimni yetkazasiz.
- **4 narsani unutmang:**
  1. YIG' — ko'p kanal, bitta backend
  2. END-TO-END TEST — har kanal × har qadam
  3. BUG TUZAT — chokni topib nishonli yama
  4. SHIP — sozlama+test tayyor bo'lsa ishga tushir
- Tugma: Yakuniy ishga →

## 16 · Amaliyot · VS Code  `[2030]`
- Eyebrow: Amaliyot · VS Code · joy: «kompyuteringizda (VS Code)»
- Sarlavha: **Endi navbat sizga — tizimni yig'ing va sinang**
- TOPSHIRIQ: O'z loyihangizda barcha kanalni (web/mobil/bot) bitta backendga ulang, keyin har kanaldan bitta buyurtma berib, butun oqimni (baza + bot xabar) end-to-end sinab ko'ring. Kod bu yerda yozilmaydi — o'z VS Code'ingizda bajarasiz, ustoz kuzatib turadi.
- Umumiy matn: Bu topshiriqni **o'z kompyuteringizda (VS Code)** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- Bosqichlar — belgilab boring:
  1. Loyihani VS Code'da oching va backendni ishga tushiring (`npm run dev`)
  2. Web (yoki mobil) kanaldan bitta buyurtma bering
  3. Buyurtma Arxivga (bazaga) tushganini tekshiring
  4. Bot admin xabarini yuborganini tekshiring
  5. Bitta chok buzilsa — matritsadagi qizil katakni toping
  6. Tugagach «Bajardim» tugmasini bosing
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Yakuniy · katta ochilish ✅ (final)  `[1293]`
- Eyebrow: Yakuniy · katta ochilish
- Sarlavha: **Katta ochilish: shaharni to'g'ri tartibda ishga tushiring.**
- Mentor: Butun tizimni yig'dik, sinadik, tuzatdik — endi ishga tushiramiz. Lekin tartib muhim: avval Arxiv (baza) turadi, keyin unga Hokimlik (backend) ulanadi, so'ng Peshtoq (frontend) ochiladi, oxirida ikkinchi darvoza (bot). Bo'laklarni to'g'ri slotlarga joylang.
- Bo'laklar: Arxiv (baza) · Hokimlik (backend) · Peshtoq (frontend) · Ikkinchi darvoza (bot)
- Uyachalar (maslahat): 1) avval ma'lumot ombori tayyor bo'lsin · 2) keyin markaz arxivga ulansin · 3) so'ng mijozga yuz ochilsin · 4) oxirida ikkinchi kirish yo'li ochilsin
- To'g'ri: ✓ Shahar ochildi: Arxiv → Hokimlik → Peshtoq → Ikkinchi darvoza!
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Xulosa: ✓ Katta ochilish tartibi: **Arxiv → Hokimlik → Peshtoq → Ikkinchi darvoza**. Hamma yo'l yondi — fuqarolar uchidan-uchiga oqyapti. Tizim tirik!
- Tugma: Tartibni yig'ing → Davom etish

## 18 · Natijalar (podium)  `[1853]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🏆 To'liq reyting

## 19 · Takrorlash (kartochkalar)  `[2137]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Web, mobil va bot qaysi umumiy qismga ulanadi? | Bitta backendga | Darvoza uchta, lekin shahar bitta |
| Nega web va bot bir xil buyurtmani ko'radi? | Baza bitta | Barcha buyurtma bitta Arxivda saqlanadi |
| Bitta amalni boshidan oxirigacha sinaydigan test qanday nomlanadi? | End-to-end | Ariza fuqarodan boshlanib, tasdiq bilan tugaydi |
| Qismlar alohida ishlab, birga ishlamasa bu qanday xato? | Integratsiya bug'i | U qismlar ulangan joyda, chokda yashiringan |
| Qaysi kanal qaysi qadamda buzilganini nima ko'rsatadi? | Test matritsasi | Har kanal va har qadam katak bo'ladi, qizili chok |
| Tizimni ishga tushirib foydalanuvchiga yetkazish qanday ataladi? | Deploy (ship) | Bu shaharning katta ochilish kuni |
| Ishga tushirishdan oldin test matritsasi qanday bo'lishi shart? | To'liq yashil | Bitta qizil katak qolsa, ship qilinmaydi |
| API_URL va BOT_TOKEN kabi sozlamalar qaysi faylda turadi? | .env | Noto'g'ri bo'lsa, tizim mijozda buziladi |
| Buyurtmalar doimiy saqlanadigan joy qanday nomlanadi? | Baza (Arxiv) | PostgreSQL |
| Qaror qabul qilib, butun oqimni boshqaradigan qism qaysi? | Backend (Hokimlik) | Node.js |
| Mijoz ko'radigan sahifa va tugmalar qaysi qism? | Frontend (Peshtoq) | React |
| Katta ochilishda eng birinchi nima ishga tushiriladi? | Arxiv (baza) | Keyin Hokimlik, so'ng Peshtoq va Ikkinchi darvoza |

- Tugma: Yakunlash →

## 20 · Yakun  `[2150]`
- Eyebrow: Kursni tamomladingiz
- Belgi: ✓ Shahar ochildi — tizim tirik
- Sarlavha: **Siz endi to'liq tizim quryasiz.** (yonida ball halqasi)
- Jonli viktorina tugmasi (o'quvchi kutayotganda: ⏳ Mentorni kuting)
- Endi siz bilasiz:
  - Ko'p kanal (web/mobil/bot) — bitta backend, bitta tizim (ko'p darvoza, bitta shahar)
  - End-to-end test butun oqimni boshidan oxirigacha sinaydi
  - Integratsiya bug'i chokda bo'ladi — topib, nishonli tuzatasiz
  - Sozlama + test tayyor bo'lsa — ishga tushirasiz (deploy / ship)
  - Katta ochilish tartibi: Arxiv → Hokimlik → Peshtoq → Ikkinchi darvoza
- Uyga vazifa (tugma: **Uyga vazifa** · Amaliy topshiriqni bajarish →) → 📝 Uyga vazifa:
  - **Yig'ing** — o'z loyihangizning barcha kanalini bitta backendga ulang
  - **Sinang** — har kanaldan buyurtma berib, butun oqimni end-to-end tekshiring
  - **Ishga tushiring** — .env to'g'ri va test o'tgach, tizimni deploy qiling
  - 🎓 Kurs tamom — endi o'z g'oyangizni oling, qismlarga bo'ling, yig'ing, sinang va ishga tushiring. Siz buni endi qila olasiz.
- 🏅 Nishonlaringiz — N/4
- Keyingi dars matni: **yo'q** (bu yakunda «Keyingi dars» qatori yozilmagan)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** Grand Opening — Ko'p darvoza — bitta shahar g'oyasini topdingiz · Full System — End-to-end — butun tizimni sinashni bildingiz · City Live — Integratsiya bug'i chokda bo'lishini topdingiz · Launch Day — Test o'tsa — ship g'oyasini o'zlashtirdingiz

**Qisqa takrorlash oynalari (4):**
1. (4-ekran) Ko'p darvoza — bitta shahar: 🏛️ Markaz bitta — Web, mobil va bot — uch darvoza, lekin hammasi **bitta Hokimlik va Arxivga** ulanadi. · 🗄️ Ma'lumot bitta joyda — Buyurtmalar bitta Arxivda (baza) saqlanadi — shuning uchun hamma darvoza bir xil holatni ko'radi. · 🏙️ Ko'p eshik, bitta tizim — Har darvoza alohida tizim emas — bitta shahar, ko'p kirish. · Savol: Nega web va bot bir xil buyurtmani ko'radi?
2. (6-ekran) End-to-end — boshidan oxirigacha: 🚶 Bitta amalni to'liq kuzatish — End-to-end test bitta arizani **boshidan (fuqaro) oxirigacha (tasdiq)** kuzatadi. · 🔗 Barcha idora birga — Peshtoq, Hokimlik, Arxiv, darvoza — hammasi **birga** ishlayaptimi, shu tekshiriladi. · 🐞 Chokni ochadi — Bitta qadam ishlamasa — tizim chala. End-to-end aynan shuni tutadi. · Savol: Nega bitta funksiyani alohida sinash yetarli emas?
3. (10-ekran) Integratsiya bug'i — chokda: ⚙️ Qismlar yaxshi, chok yomon — Har idora alohida ishlaydi — lekin ular **ulangan joyda** (chok) bug chiqadi. · 🎯 Matritsa chokni ko'rsatadi — Har darvoza × har qadam — qaysi katak qizil bo'lsa, chok o'sha yerda. · 🔧 Nishonli tuzatish — Chokni topib, aniq prompt bilan yamaysiz — butun tizimni qayta yozmaysiz. · Savol: Integratsiya bug'i qayerda bo'ladi?
4. (13-ekran) Ishga tushirish — test o'tsa, ship: ✅ Avval end-to-end o'tsin — Ishga tushirishdan oldin matritsa **to'liq yashil** bo'lishi shart. · 🔑 Sozlama to'g'ri — .env sozlamalari (API_URL, BOT_TOKEN, AI kaliti) to'g'ri bo'lsin — aks holda mijozda buziladi. · 🚀 Keyin ship — Sinangan, sozlangan tizimni **deploy** qilasiz — shahar ochiladi. · Savol: Nima bo'lmasa ishga tushirmaymiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Web, mobil va bot «bitta tizim» deyilishining sababi nima? ✔ Uchchasi bitta backend va bazadan foydalanadi · Har birida o'z alohida bazasi bor · Ular bir-biriga umuman bog'liq emas · Faqat ranglari o'xshash, boshqasi yo'q
2. «Ko'p darvoza, bitta shahar» nimani anglatadi? ✔ Web, bot, mobil — bitta markaz · Bitta kanal hammaga yetarli · Har kanalga alohida tizim kerak · Faqat web bo'lishi mumkin
3. End-to-end test nimani tekshiradi? Faqat bitta funksiyani alohida · Faqat ranglar va dizaynni · ✔ Butun oqimni boshidan oxirigacha · Faqat backend kodini o'qib
4. Integratsiya (chok) bug'i qayerda bo'ladi? ✔ Qismlar ulangan joyda — chokda · Faqat frontend rangida · Hech qachon paydo bo'lmaydi · Faqat bazaning ichida
5. Test matritsasida bitta qizil katak nimani bildiradi? Hammasi to'g'ri — bug umuman yo'q · ✔ O'sha kanal × qadamda bug bor · Dizayn ishlari to'liq tugadi · Baza juda tez ishlayapti
6. Integratsiya bug'ini qanday tuzatamiz? Butun tizimni noldan qayta yozamiz · Umuman e'tibor bermaymiz · ✔ Chokni topib nishonli yamaymiz · Faqat rang o'zgartiramiz
7. Tizimni ishga tushirishdan oldin nima SHART? Hech narsa — darrov mijozga chiqaramiz · ✔ End-to-end test o'tgan va .env to'g'ri · Faqat ko'proq rang va bezak qo'shish · Faqat logotip va nom tayyor bo'lishi
8. «Deploy / ship» nima demak? Kodni butunlay o'chirib tashlash · Faqat chiroyli dizayn chizib qo'yish · ✔ Tizimni ishga tushirib mijozga berish · Yangi dasturlash tili o'rganish
9. Buyurtma bir kanaldan berilsa, boshqa kanalda ko'rinadimi? Yo'q — har kanal alohida saqlaydi · Faqat qo'lda nusxalab qo'ysa · Buni umuman qilib bo'lmaydi · ✔ Ko'rinadi — ma'lumot bitta bazada
10. Mavjud tizimga yangi kanal (mobil) qo'shishning eng oson yo'li? Butun tizimni noldan qaytadan yozish · ✔ Yangi frontend yozib o'sha backendga ulash · Mobil uchun butunlay alohida baza qurish · Buni umuman qilib bo'lmaydi, imkonsiz
11. AI (Ekspert-byuro) tizimda qanday rol o'ynaydi? Ma'lumotni doimiy saqlaydi · Barcha qarorni yakka o'zi qiladi · Foydalanuvchi bilan to'g'ridan gaplashadi · ✔ Savolga javob va tavsif yozadi
12. Shaharni ishga tushirish tartibi qanday? Peshtoq → Arxiv → Hokimlik → darvoza · Darvoza → Peshtoq → Hokimlik → Arxiv · Hokimlik → Peshtoq → Arxiv → darvoza · ✔ Arxiv → Hokimlik → Peshtoq → darvoza

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«slot»** — 17-ekran mentor gapi: «Bo'laklarni to'g'ri slotlarga joylang» · lug'atda taqiqlangan (o'rniga «joyiga»)
- **Bir narsaning ikki nomi (metafora bo'linib qolgan):** 0–16-ekranlarda oddiy so'zlar (backend, baza, frontend, kanal); shahar so'zlari (Arxiv, Hokimlik, Peshtoq, Ekspert-byuro, darvoza, fuqaro, ariza, idora) faqat 2-ekran yorlig'ida, takrorlash oynalari, 17-ekran, kartochka va viktorinada chiqadi — o'quvchi «Peshtoq»ni darsda birinchi marta yakuniy topshiriqda ko'radi. «Idora», «fuqaro», «ariza» asosiy ekranlarda umuman yo'q
- **«Ikkinchi darvoza (bot)»** — 17-ekran, 20-ekran, kartochka 12: darsda kanal uchta (web, mobil, bot), bot uchinchi; mobil esa katta ochilish tartibiga umuman kirmagan
- **Izohsiz inglizcha so'zlar:** «order trace» (1, 7-ekran), «ship» (1, 12–15, 20-ekran; faqat 20-ekranda «deploy / ship» birga), «launch checklist» (12-ekran), «checkout», «POST /orders» (11-ekran), «Failed to fetch» (8-ekran), «Expo Go» (2, 12-ekran), «grand-finali» (1-ekran)
- **Bir rolning ikki nomi:** 1 va 15-ekran «tizim arxitektori», 11-ekran «direktor sifatida»
- **Test javobi «sotilib» qolgan:** 6-ekran to'g'ri javobi «Butun oqimni boshidan oxirigacha…» — 5-ekran sarlavhasini («boshidan oxirigacha») aynan takrorlaydi; 10-ekran to'g'ri javobi — «end-to-end» so'zi bor yagona variant; 13-ekran to'g'ri javobi — «end-to-end» va «.env» bor yagona variant
- **Mazmun shubhasi:** 2-ekran «6 qism, 6 modul mehnati» deydi, kartalarda esa Modul 3 · 9 · 8 · 4 · 4 · 8/9 (6 xil modul emas; mobil — «Modul 9», ya'ni bu darsdan keyinroqdagi modul). 0-ekran «Kurs davomida … mobil … qurdingiz» — mobil hali o'tilganmi?
- **«Kurs tamom» / «Kursni tamomladingiz»** — 14, 20-ekran; 6-Modulning 13-darsi uchun to'g'rimi, tekshirish kerak. 20-ekranda «Keyingi dars» qatori yo'q
