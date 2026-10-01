# 5-Modul (LMS: 7-Modul) · 4-dars «Stateful logika + PostgreSQL» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotStatefulMemoryLesson.jsx` · 20 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** bola Botjonga pitsa buyurtma qiladi: «Pitsa buyurtma qilaman» → «Qaysi pitsa?» → «Pepperoni» → Botjon: «Nima pepperoni? Tushunmadim.» O'quvchi suhbatni tugma bilan ochadi va 3 variantdan «nega adashdi?» ni tanlaydi.
- **Markaziy o'yin/mexanika:** Botjonga «📓 daftar» biriktiriladi va har xabarda daftar sahifasi (mijoz · bosqich · tanlov) jonli yangilanadi (3-ekran); keyin botni «o'chir-yoqish» — cho'ntak (RAM) bo'shaydi, javon (PostgreSQL) qoladi (6-ekran); Aziza va Bek bitta umumiy sahifada aralashadi (7) → har biriga o'z sahifasi (9).
- **Asosiy metafora:** daftarsiz Botjon (xotirasiz bot) · 📓 daftar (holat) · daftar sahifasi (sessiya) · cho'ntakdagi varaqcha (koddagi oddiy obyekt, RAM) · javondagi doimiy daftar (PostgreSQL).
- **Yakun:** stateful xabar oqimini sudrab tartiblash: Xabar keladi → SELECT → Bosqichni tekshir → Amal bajar → UPDATE (15-ekran, final); amaliyot — o'z loyihasida `holat` ustunini loyihalash.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — «Pepperoni» | hook | suhbatni ochadi, Botjon nega adashganini tanlaydi | — |
| 1 | Reja | qoida | natija-chat (Botjon Azizani eslaydi) + bugungi 4 qadam + jihozlar paneli | — |
| 2 | Daftarsiz Botjon | tushuncha (tajriba) | 4 xabar yuboradi, Botjon 2 marta «Tushunmadim» deydi | — |
| 3 | Daftar beriladi | markaziy | daftar biriktiradi, 3 xabarda sahifa jonli yangilanadi | — |
| 4 | 1-savol | test | bot nega oldingi xabarni unutadi | ✅ |
| 5 | Cho'ntakdagi varaqcha | tushuncha (kod) | oddiy obyekt kodini ko'radi, kamchiligini ochadi | — |
| 6 | Cho'ntak vs javon | markaziy | botni qayta ishga tushiradi — nima qoladi, nima yo'qoladi | — |
| 7 | Ikki mijoz — umumiy sahifa | muammo | 3 xabarni ochadi, buyurtmalar aralashadi | — |
| 8 | 2-savol | test | server o'chsa qaysi ma'lumot qoladi | ✅ |
| 9 | Har mijozga o'z sahifasi | case | Aziza / Bekni bosadi, keyin «ikkalasi birdan» | — |
| 10 | 3-savol | test | ikki suhbat aralashmasligi uchun nima kerak | ✅ |
| 11 | users jadvali | tushuncha | `CREATE TABLE` kodi, 4 ustunni bosib o'qiydi | — |
| 12 | AvtoPizza buyurtmasi | hayotiy | 4 qadamli buyurtma, daftar sahifasini kuzatadi | — |
| 13 | Daftar kodda | amaliyot | 3 SQL bo'shlig'ini to'ldiradi (nishon bor) | — |
| 14 | 4-savol | test | yangi mijoz uchun qaysi SQL buyrug'i | ✅ |
| 15 | Oqimni yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · loyihalash | praktika | o'z loyihasida `holat` ustuni + SELECT → UPDATE oqimini chizadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon (bot) · daftarsiz (stateless, xotirasiz) · 📓 daftar (holat / xotira) · daftar sahifasi (sessiya) · bosqich (holat) · tanlov ·
cho'ntak / cho'ntakdagi varaqcha (kod ichidagi oddiy obyekt, RAM) · javon / javondagi doimiy daftar (PostgreSQL) · restart (o'chir-yoqish) ·
umumiy sahifa (aralashuv) · o'z sahifasi · users jadvali · `holat` ustuni · SELECT (o'qi) → tekshir → UPDATE (yoz) · INSERT (yangi qator) · stateful ·
1-darsdan: signal · amal · hodisa · qoidalar varag'i · kalit · Jihozlar paneli (bu darsda «Holat daftari» uyachasi)

---

## 0 · Kirish — «Pepperoni»  `[758]`
- Eyebrow: Dars · kirish
- Sarlavha: **Bola Botjonga «Pepperoni» deydi. Botjon: «Nima pepperoni? Tushunmadim.» Nega?**
- Mentor: Botjon savolga javob bera oladi va muloqot qiladi (o'tgan darslarda ko'rdingiz) — lekin u **bir necha soniya oldin nima gaplashganini eslay olmaydi**. Tugmani bosing va o'z ko'zingiz bilan ko'ring.
- Chat «Botjon (daftarsiz)» · bot · onlayn:
  - bot: Salom! Nima buyurtma qilasiz?
  - (tugmadan keyin) mijoz: Pitsa buyurtma qilaman → bot: Ajoyib! Qaysi pitsa? → mijoz: Pepperoni → bot: Nima pepperoni? Tushunmadim. 😳
- Tugma: ▶ Suhbatni davom ettirish → ✓ Suhbatni ko'rdingiz
- Savol (tugmadan keyin ochiladi): **Nega Botjon adashdi?**
  - Botjon buzuq — kodda xatolik bor
  - Botjon har xabarni alohida ko'radi — oldingi gapni eslamaydi
  - Internet sekin ishlagani uchun xabar yo'qolgan
- Javobdan keyin (qaysi variant tanlansa ham): Aynan! Botjon tabiatan **daftarsiz** — har xabarni «birinchi marta ko'rgandek» qabul qiladi. Bugun unga **📓 daftar** beramiz — endi u eslab qoladi.
- Tugma: Davom etish

## 1 · Reja  `[794]`
- Eyebrow: Reja
- Sarlavha: **Botjonga xotira beramiz.**
- Mentor: Bu — modulning eng «texnik» darsi, lekin g'oya oddiy: Botjon daftarsiz, biz unga **📓 daftar** beramiz. PostgreSQL'ni oldingi modulda o'rgangansiz — endi uni Botjonga ulaymiz.
- Yorliq: dars oxirida — Botjon eslab qoladi
- Chat «Botjon (daftar bilan)»: mijoz «Salom!» → bot «Yana xush kelibsiz, Aziza! 😊 O'tgan safargi Margaritani yana olasizmi?»
- Izoh: Botjon ismni va o'tgan buyurtmani esladi — chunki ularni **daftarga** yozib qo'ygan. Mana shuni quramiz.
- Jihozlar paneli — bugun 3-uyacha yonadi: Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · Yo'l-yo'riq · Vositalar · AI yordamchi (yonganlari: Kalit, Qoidalar varag'i, Tugmalar, Konvert (ctx), Holat daftari)
- Bugungi 4 qadam:
  1. Botjon nega unutadi — daftarsiz muammosi · *muammo*
  2. Cho'ntak (vaqtinchalik) va javon (doimiy) daftar · *xotira*
  3. Ikki mijoz — aralashmasligi uchun alohida sahifa · *sessiya*
  4. Xabar oqimi: SELECT → tekshir → UPDATE · *oqim*
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Orqaga · Boshlaymiz →

## 2 · Daftarsiz Botjon  `[842]`
- Eyebrow: Tajriba · daftarsiz
- Sarlavha: **Daftarsiz Botjon — har xabar unga «birinchi marta» ko'rinadi.**
- Mentor: Bola pitsa buyurtma qilishga urinmoqda. Botjonda hali daftar yo'q. Tugmani bosib, suhbatni davom ettiring va Botjonning holatini kuzating.
- Chat «Botjon (daftarsiz)» (har bosishda bitta juftlik):
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Nima pepperoni? Tushunmadim. 😳
  3. Pepperoni pitsa haqida gapiryapman → Qaysi o'lchamda? Kichikmi, kattami?
  4. Katta → Nima katta? Tushunmadim. 😳
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Bola charchab qoldi
- 📍 Botjon nimani biladi: Hali hech narsa — birinchi xabarni kutmoqda. → (keyin) Faqat oxirgi xabarni. Undan oldingi hech narsani eslamaydi.
- Oxirida: 😕 Bola 2 marta bir xil xatoga duch keldi — «Pepperoni» va «Katta» so'zlari Botjon uchun ma'nosiz, chunki u qaysi savolga javob berilayotganini bilmaydi. Unga **📓 daftar** kerak.
- Tugma (pastda): Suhbatni davom ettiring (0/4) → Davom etish

## 3 · Daftar beriladi (markaziy)  `[876]`
- Eyebrow: Markaziy · daftar
- Sarlavha: **Botjonga 📓 daftar beramiz — endi u eslab qoladi.**
- Mentor: Bola Botjonga daftar biriktiradi. Endi har xabarda daftar sahifasi **jonli yangilanadi** — o'ng tomondan kuzating.
- Boshida: Botjonda hali daftar yo'q. · Tugma: Daftar biriktirish
- Chat «Botjon (daftar bilan)»:
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Pepperoni, zo'r! Qaysi o'lchamda?
  3. Katta → Rahmat! Buyurtmangiz: Katta Pepperoni. Manzilni yuboring 📍
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Buyurtma qabul qilindi
- 📓 Daftar sahifasi (mijoz · bosqich · tanlov):
  - biriktirishdan oldin: — · — · —
  - biriktirilgach: Aziza · Kutilmoqda · —
  - 1-xabar: Aziza · Pitsa tanlash · —
  - 2-xabar: Aziza · O'lcham tanlash · Pepperoni
  - 3-xabar: Aziza · Manzil kutilmoqda · Pepperoni · Katta
- Oxirida: Ko'rdingizmi? Har xabarda daftar sahifasi yangilandi. Endi «Pepperoni» yoki «Katta» so'zlari Botjon uchun ma'noli — chunki u daftardan **qaysi savolga javob berilayotganini** biladi.
- Tugma (pastda): Daftar biriktiring → Suhbatni kuzating (0/3) → Davom etish

## 4 · 1-savol ✅  `[917]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot nima uchun oldingi xabarni tez-tez unutib qoladi?**
  - Internet aloqasi doimo beqaror bo'lgani sababli shunday bo'ladi
  - Foydalanuvchi xabarlarni juda tez ketma-ket yuborayotgani sababli
  - ✔ Bot tabiatan daftarsiz — har xabarni birinchi marta deb qabul qiladi
  - Telegram serverlari xabarlarni tasodifiy tartibda yetkazgani sababli
- To'g'ri: To'g'ri! Bot tabiatan daftarsiz (stateless) — u har xabarni alohida, mustaqil hodisa deb ko'radi. Eslab qolishi uchun unga daftar (holat) kerak.
- Xato izohlari:
  - Internet holati bunga sabab emas — muammo botning ichki tabiatida.
  - Xabar tezligi sabab emas — muammo Botjonning daftarsizligida.
  - Telegram xabarlarni tartib bilan yetkazadi — muammo boshqa joyda.
  - (umumiy) Bot tabiatan daftarsiz — shuning uchun eslay olmaydi.

## 5 · Cho'ntakdagi varaqcha  `[933]`
- Eyebrow: Kod · cho'ntak
- Sarlavha: **Daftarning eng sodda shakli — cho'ntakdagi varaqcha.**
- Mentor: Bosqichni shunchaki kod ichidagi oddiy obyektda saqlash mumkin — bu «cho'ntakdagi varaqcha». Ishlaydi, lekin bitta jiddiy kamchiligi bor. Tugmani bosing.
- Kod:
  ```js
  // Bosqichni oddiy obyektda (cho'ntakda) saqlash
  const chontak = {}  // { [mijozId]: bosqich }

  // Bola pitsa tanlaganda:
  chontak[ctx.chat.id] = "OLCHAM_KUTYAPMAN"

  // Xabar kelganda:
  const bosqich = chontak[ctx.chat.id]
  ```
- Tugma: Kamchiligi nimada? 🤔 → ✓ Ko'rdingiz
- Kamchilik: ❌ **Bu obyekt RAM'da — dasturning cho'ntagida** yashaydi. Server o'chsa yoki qayta ishga tushsa — cho'ntak bo'shab qoladi. Barcha bosqichlar **g'oyib bo'ladi**, yuzlab mijoz suhbat o'rtasida qolib ketadi.
- 📍 YECHIM: Cho'ntak emas — **javondagi doimiy daftar** kerak. Mana shu yerda **PostgreSQL** kiradi.
- Tugma (pastda): Kamchiligini ko'ring → Davom etish

## 6 · Cho'ntak vs javon (markaziy)  `[968]`
- Eyebrow: Markaziy · cho'ntak vs javon
- Sarlavha: **Botni o'chir-yoqing — nima qoladi, nima yo'qoladi?**
- Mentor: Serverlar har kuni qayta ishga tushadi (yangilanish, nosozlik, deploy). Tugmani bosib, restart paytida cho'ntak va javonga nima bo'lishini ko'ring.
- Qutilar:
  - 👖 Cho'ntak — vaqtinchalik xotira: `chontak = { 5582: "MANZIL_KUTYAPMAN" }` → restartdan keyin: 💨 bo'sh — hammasi to'kilib ketdi!
  - 🗄️ Javon — doimiy daftar (PostgreSQL): `users: Aziza · MANZIL_KUTYAPMAN ✅`
- Tugma: 🔌 Botni qayta ishga tushirish → ✓ Restart bo'ldi
- Natija: Ko'rdingizmi? Cho'ntak bo'shab qoldi, lekin **javondagi daftar joyida**. Shuning uchun bosqichni ham, ma'lumotni ham javonga (PostgreSQL'ga) yozamiz.
- Xulosa: Xulosa: **cho'ntak — vaqtinchalik**, **javon — doimiy**. Ishonchli bot ma'lumotni javonga yozadi.
- Tugma (pastda): Botni qayta ishga tushiring → Davom etish

## 7 · Ikki mijoz — umumiy sahifa  `[1012]`
- Eyebrow: Muammo · ikki mijoz
- Sarlavha: **Aziza va Bek bir vaqtda yozishmoqda — bitta umumiy sahifada.**
- Mentor: Botjonda bitta umumiy daftar sahifasi bor — hamma mijoz uchun bitta. Har xabar keyingi qatorda shu sahifaga yoziladi. Tugmani bosib, nima bo'lishini kuzating.
- Xabarlar:
  1. Aziza: Pitsa buyurtma qilaman — Margarita
  2. Bek: Menga ham pitsa — Pepperoni
  3. Aziza: Katta o'lchamda, iltimos
- Tugma: ▶ Xabarlarni boshlash → Keyingi xabar → → ✓ Hammasi ko'rildi
- 📓 Daftar sahifasi: mijoz «? (umumiy sahifa)» · bosqich «Tanlov» · tanlov: — → Margarita (Aziza) → Pepperoni (Bek) → Pepperoni · Katta (kim buyurtma qildi?)
- Oxirida: 😳 Oxirgi qatorda «Pepperoni · Katta» yozilgan — lekin buni **Aziza** yubordi! Sahifa umumiy bo'lgani uchun Bekning Pepperonisi Azizaning Margaritasi ustiga yozilib ketdi. Ikkalasining buyurtmasi **aralashib qoldi**.
- Tugma (pastda): Xabarlarni ko'ring (0/3) → Davom etish

## 8 · 2-savol ✅  `[1041]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Bot serveri birdan o'chib qolsa, qaysi joyda saqlangan ma'lumot yo'qolmaydi?**
  - Kod ichidagi oddiy JavaScript obyektida saqlangan ma'lumot
  - ✔ PostgreSQL — doimiy daftarga yozilgan ma'lumot
  - Faqat brauzer xotirasida turgan ma'lumot
  - Hech qanday ma'lumot saqlanib qolmaydi
- To'g'ri: To'g'ri! PostgreSQL — javondagi doimiy daftar, diskda saqlanadi. Server o'chib-yonsa ham bu yozuvlar joyida qoladi. Faqat cho'ntakdagi (RAM'dagi) vaqtinchalik holat yo'qoladi.
- Xato izohlari:
  - Aksincha — bu cho'ntakdagi (RAM'dagi) vaqtinchalik varaqcha, restart'da yo'qoladi.
  - Bot serverida brauzer xotirasi ishlamaydi — bu bot bilan bog'liq emas.
  - Javonga (PostgreSQL'ga) yozilgan ma'lumot saqlanib qoladi — hammasi yo'qolmaydi.
  - (umumiy) Faqat doimiy daftarga (PostgreSQL) yozilgan ma'lumot restart'dan keyin ham qoladi.

## 9 · Har mijozga o'z sahifasi (case)  `[1061]`
- Eyebrow: Case · tuzatish
- Sarlavha: **Har mijozga o'z sahifasi — endi aralashmaydi.**
- Mentor: Endi Botjon bitta umumiy sahifa emas, har mijozga **alohida daftar sahifasi** (sessiya) ochadi. Avval birma-bir bosing, keyin ikkalasini birdan sinang.
- Kartalar: Aziza · o'z sahifasi · Bek · o'z sahifasi (bosilgach ✓)
- Tugma: ▶ Ikkalasi birdan yozsin → ✓ Ikkalasi birdan yozdi
- Natija: Aziza ✅ Margarita · Katta · Bek ✅ Pepperoni · Kichik
- Oxirida: Endi hech narsa aralashmaydi — Azizaning Margaritasi va Bekning Pepperonisi **o'z sahifasida** to'g'ri saqlanadi.
- Tugma (pastda): Ikkalasini birdan sinang → Davom etish

## 10 · 3-savol ✅  `[1102]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Aziza va Bek bir vaqtda buyurtma bersa, ularning suhbati aralashib ketmasligi uchun bot nimani ishlatishi kerak?**
  - Ikkalasiga ham bitta umumiy o'zgaruvchida holatni birga saqlash
  - Faqat birinchi yozgan mijozga navbat bilan javob berish
  - Kelgan xabarlarni tasodifiy tartibda aralashtirib javoblash
  - ✔ Har mijoz uchun alohida sessiya — o'z sahifasini saqlash
- To'g'ri: To'g'ri! Har mijozga alohida sessiya (o'z daftar sahifasi) berilsa, ularning bosqichi va tanlovi bir-biriga tegmaydi — Aziza va Bek hech qachon aralashmaydi.
- Xato izohlari:
  - Aynan shu — bitta umumiy sahifa — aralashuvga olib keladi. Har kimga alohida sahifa kerak.
  - Botjon hech kimni e'tiborsiz qoldirmaydi — muammo umumiy sahifada, e'tiborsizlikda emas.
  - Tasodifiylik muammoni yechmaydi — kerakli narsa aniq: har mijozga o'z sahifasi.
  - (umumiy) Har mijozga alohida sessiya (sahifa) berish — aralashuvning yagona to'g'ri yechimi.

## 11 · users jadvali  `[1123]`
- Eyebrow: Javon · users jadvali
- Sarlavha: **PostgreSQL — Botjonning users jadvali.**
- Mentor: Bu — Botjonning doimiy daftari. Har ustunni bosib, u nima saqlashini o'qing.
- Kod:
  ```sql
  CREATE TABLE users (
    id           SERIAL PRIMARY KEY,
    telegram_id  BIGINT UNIQUE,
    ism          TEXT,
    holat        TEXT,
    created_at   TIMESTAMP DEFAULT now()
  )
  ```
- Ustun tugmalari (bosilganda izoh):
  - `telegram_id` — Har mijozning noyob raqami — Botjon uni shu orqali taniydi (ctx.chat.id).
  - `ism` — Mijoz ismi — uzoq muddatli ma'lumot, bir marta so'rab saqlanadi.
  - `holat` — Suhbat hozir qaysi bosqichda — daftarning eng muhim ustuni, restart'da yo'qolmasin.
  - `created_at` — Mijoz qachon qo'shilgani — standart vaqt ustuni.
- Oxirida: Diqqat: `holat` ham shu yerda — suhbat bosqichini ham javonga yozamiz, restart'da yo'qolmasin.
- Jadval «🗄️ jadval: users»: id · telegram_id · ism · holat → 1 · 558210300 · Aziza · MANZIL_KUTYAPMAN (bo'sh bo'lsa: — jadval bo'sh —)
- Tugma (pastda): 4 ustunni oching (0/4) → Davom etish

## 12 · AvtoPizza buyurtmasi (hayotiy)  `[1173]`
- Eyebrow: Hayotiy · buyurtma
- Sarlavha: **AvtoPizza buyurtmasi — har javob daftarga yoziladi, bosqich siljiydi.**
- Mentor: Bu — to'liq stateful suhbat. Botjon har javobni daftarga yozadi va keyingi bosqichga o'tadi. O'ng tomondan daftar sahifasini kuzating.
- Chat «Botjon (buyurtma)» (signal → javob · daftardagi bosqich):
  1. /start → «Salom! 🍕 Pitsa o'lchamini tanlang: kichik yoki katta?» · *O'lcham kutilmoqda*
  2. Katta → «Zo'r! Qo'shimcha pishloq qo'shaymi? (ha / yo'q)» · *Qo'shimcha kutilmoqda*
  3. Ha → «Mazza 🧀 Endi manzilingizni yuboring 📍» · *Manzil kutilmoqda*
  4. Chilonzor 5-uy → «Rahmat! Buyurtma: Katta + pishloq, Chilonzor 5-uy. Qabul qilindi ✅» · *TAYYOR*
- 📓 Daftar sahifasi: mijoz Aziza · bosqich BO'SH → (yuqoridagilar) · tanlov: — → 1/4 qadam … 4/4 qadam
- Tugma: ▶ Buyurtmani boshlash → Keyingi javob → → ✓ Buyurtma qabul qilindi
- Oxirida: Buyurtma bosqichma-bosqich yig'ildi — chunki Botjon har lahzada «qayerda turganini» esladi. Bot restart bo'lsa ham, holat javonda — suhbat davom etadi.
- Tugma (pastda): Buyurtmani yig'ing (0/4) → Davom etish

## 13 · Daftar kodda (amaliyot)  `[1215]`
- Eyebrow: Amaliyot · daftar kodda
- Sarlavha: **Daftar kodda qanday yoziladi?**
- Mentor: Uchta SQL so'rovi shu tarzda yoziladi. Har biri uchun to'g'ri variantni tanlab to'ldiring.
- Fayl yorlig'i: handler.ts
- Kod:
  ```js
  // o'qi → tekshir → yoz — xuddi daftar bilan ishlagandek
  ____ * FROM users WHERE telegram_id=$1

  ____ users SET holat=$1 WHERE telegram_id=$2

  ____ INTO users(telegram_id, holat) VALUES($1, $2)
  ```
- Bo'shliqlar (tugmalar shu tartibda turadi):
  1. `____ * FROM users WHERE telegram_id=$1` → ✔ SELECT / UPDATE / INSERT
  2. `____ users SET holat=$1 WHERE telegram_id=$2` → ✔ UPDATE / SELECT / DELETE
  3. `____ INTO users(telegram_id, holat) VALUES($1, $2)` → ✔ INSERT / SELECT / UPDATE
- Xato izohlari:
  - 1-bo'shliq: UPDATE — ma'lumotni o'zgartiradi, o'qish uchun emas. · INSERT — yangi qator qo'shadi, o'qish uchun emas.
  - 2-bo'shliq: SELECT faqat o'qiydi — bu yerda yozish (o'zgartirish) kerak. · DELETE qatorni o'chiradi — bizga holatni yangilash kerak.
  - 3-bo'shliq: SELECT — mavjud qatorni o'qiydi, yangi qator qo'shmaydi. · UPDATE — faqat mavjud qatorni o'zgartiradi, yangisini qo'shmaydi.
  - (zaxira) Bu to'g'ri emas.
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: Daftar to'ldi! `SELECT` = o'qish, `UPDATE` = yangilash, `INSERT` = yangi qator qo'shish.
- Tugma (pastda): Bo'shliqlarni to'ldiring → Davom etish

## 14 · 4-savol ✅  `[1273]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Foydalanuvchi birinchi marta /start bossa, uni jadvalga qo'shish uchun qaysi buyruq ishlatiladi?**
  - ✔ INSERT — yangi qator qo'shadi
  - SELECT — faqat mavjud qatorni o'qiydi
  - UPDATE — faqat mavjud qatorni o'zgartiradi
  - DELETE — qatorni butunlay o'chiradi
- To'g'ri: To'g'ri! Yangi foydalanuvchi bazada hali yo'q, shuning uchun INSERT bilan yangi qator qo'shiladi. Keyin o'qish uchun SELECT, holatni o'zgartirish uchun UPDATE ishlatiladi.
- Xato izohlari:
  - SELECT faqat o'qiydi — yangi qator qo'shmaydi. Yangi mijoz uchun INSERT kerak.
  - UPDATE mavjud qatorni o'zgartiradi. Lekin yangi mijoz hali yo'q — avval INSERT kerak.
  - DELETE o'chiradi — bizga aksincha, yangi qator qo'shish (INSERT) kerak.
  - (umumiy) Yangi qator qo'shish uchun INSERT ishlatiladi.

## 15 · Oqimni yig'ing ✅ (final)  `[1297]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: stateful xabar oqimini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Diqqat: agar 💾 UPDATE'ni 🔍 SELECT'dan oldin qo'ysangiz — Botjon hali o'qimasdan yozib yuboradi.
- Bo'laklar (aralash chiqadi): Xabar keladi · SELECT — daftardan o'qi · Bosqichni tekshir · Amal bajar / javob tayyorla · UPDATE — daftarga yoz
- Uyachalar: birinchi nima bo'ladi · keyin nima o'qiladi · keyin nima tekshiriladi · keyin nima bajariladi · eng oxiri nima yoziladi
- To'g'ri: ✓ To'g'ri: Xabar keladi → SELECT → Bosqichni tekshir → Amal bajar → UPDATE. · ✓ Oqim tayyor: **Xabar → SELECT → Bosqichni tekshir → Amal bajar → UPDATE** → va yana keyingi xabarni kutadi.
- UPDATE SELECT'dan oldin bo'lsa: 😕 Botjon hali o'qimasdan daftarga yozib yubordi! — UPDATE SELECT'dan oldin bo'lsa, Botjon eski holatni bilmay turib yangi qiymat yozadi — bosqich noto'g'ri qolib ketishi mumkin.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang. · ⚠️ Tartib xato — qayta joylang.
- Havola (xato bo'lgan bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): Oqimni yig'ing → Davom etish

## 16 · Amaliyot · loyihalash  `[2145]`
- Eyebrow: Amaliyot · loyihalash
- Sarlavha: **Users jadvaliga 'holat' ustunini qo'shing**
- Mentor: Bu topshiriqni **o'z loyihangizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z loyihangiz uchun users jadvaliga suhbat holatini saqlaydigan 'holat' ustunini qo'shing va SELECT → UPDATE oqimini qog'ozga chizib chiqing. Hali kod yozmaysiz — faqat loyihalaysiz.
- Bosqichlar — belgilab boring:
  1. users jadvalida qaysi ustunlar borligini ro'yxat qiling (`telegram_id`, `ism`, ...)
  2. Yangi `holat` nomli ustun qo'shing (TEXT turi)
  3. Xabar kelganda avval qaysi SQL ishlatilishini yozing (`SELECT`)
  4. Holat o'zgarganda qaysi SQL ishlatilishini yozing (`UPDATE`)
  5. Yangi mijoz uchun qaysi SQL kerakligini yozing (`INSERT`)
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · pastda: Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1889]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Umumiy shablon: Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🏆 To'liq reyting
- Savol yorliqlari (nuqtalar ustida): 1 — Xotirasiz muammo · 2 — Cho'ntak vs javon · 3 — Ikki mijoz · 4 — INSERT/SELECT/UPDATE · 5 — Oqim tartibi

## 18 · Takrorlash (kartochkalar)  `[2159]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bot bir necha xabardan keyin nega adashib qoladi? | Chunki eslamaydi | Har xabarni alohida hodisa deb oladi — bu daftarsiz (stateless) bot |
| Suhbat hozir qaysi bosqichda ekanini saqlaydigan yozuv nima deyiladi? | Holat (state) | Masalan: mijoz menyuni tanlab bo'ldi, endi manzil kutilmoqda |
| Suhbat holatini eslab qoladigan botni qanday ataymiz? | Stateful | Daftarli bot — qayerda to'xtaganini biladi |
| Har mijozga alohida daftar sahifasi berilishi nima deb ataladi? | Sessiya | Bitta mijoz — bitta sahifa, ular bir-biriga tegmaydi |
| Hamma mijoz bitta umumiy sahifaga yozsa nima bo'ladi? | Buyurtmalar aralashadi | Oxirgi yozuv avvalgisini bosib yuboradi |
| Kod ichidagi oddiy obyektda saqlangan holat server qayta ishga tushsa nima bo'ladi? | Yo'qoladi | Cho'ntak xotira (RAM) tez ishlaydi, lekin vaqtinchalik |
| Server o'chib-yonsa ham holat saqlanib qolishi uchun uni qayerga yozasiz? | PostgreSQL | Javon: yozuv diskda turadi, restart unga ta'sir qilmaydi |
| Botning mijozlari haqidagi yozuvlar qaysi jadvalda turadi? | users | Ustunlari: id, telegram_id, ism, holat |
| Yangi mijoz birinchi marta /start bosganda qaysi SQL buyrug'i ishlatiladi? | INSERT | Jadvalga yangi qator qo'shiladi |
| Mijozning holatini bazadan o'qish uchun qaysi buyruq kerak? | SELECT | SELECT users jadvalidan mijozni telegram_id bo'yicha topadi |
| Holat o'zgarganda mavjud qatorni qaysi buyruq yangilaydi? | UPDATE | Yangi qator qo'shilmaydi — bori yangilanadi |
| Xabar kelganda bot birinchi navbatda nima qiladi? | Daftardan o'qiydi (SELECT) | Keyin holatni tekshiradi, amalni bajaradi va oxirida yangi holatni yozadi (UPDATE) |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2186]`
- Eyebrow: Tayyor
- Belgi: ✓ Botjoningizga xotira berdingiz
- Sarlavha: **Endi Botjon eslab qoladi.** (yonida ball halqasi)
- Endi siz bilasiz:
  - Bot tabiatan daftarsiz — har xabarni alohida hodisa deb qabul qiladi
  - Bosqichni (holatni) daftarda saqlasak, bot 'qayerda to'xtaganini' biladi
  - Cho'ntak (RAM) tez, lekin restart'da yo'qoladi — javon (PostgreSQL) doimiy
  - Har mijozga alohida sessiya (sahifa) kerak — aks holda suhbatlar aralashadi
  - Xabar oqimi: SELECT (o'qi) → holatni tekshir → amal → UPDATE (saqla)
- Arena tugmasi (jonli darsda kutish): ⏳ Mentorni kuting
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda ochiladi) 📝 Uyga vazifa:
  - **Loyihalang** — o'z botingiz uchun users jadvali sxemasini chizing: qaysi ustunlar kerak?
  - **Ajrating** — qaysi ma'lumot vaqtinchalik (cho'ntak), qaysi doimiy (javon)?
  - **Yozing** — AI'ga: 'yangi mijozni INSERT qil, holatga qarab UPDATE qil' deb topshiriq yozing
- 🚀 Keyingi dars — Botjon bilimlaringizni yanada chuqurlashtiramiz!
- 🏅 Nishonlaringiz — n/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🗄️ Safe Notes — Yo'qolmaydigan saqlash turini tanladingiz (8-ekran) · 👥 No Mix-Up — Ikki suhbat aralashib ketgan sababini topdingiz (10-ekran) · 📓 Memory Keeper — Buyurtmani boshidan oxirigacha olib bordingiz (15-ekran) · 📝 SQL Writer — SQL bo'shliqlarini xatosiz to'ldirdingiz (13-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon: · bosib davom eting

**Qisqa takrorlash oynalari (5):**
1. Bot nega unutadi (4-ekran): Har xabar — alohida hodisa · Shuning uchun «tushunmadim» deydi · Yechim — daftar · Sinfga savol: Bot nega bir necha xabardan keyin adashadi?
2. Cho'ntak vs javon (8-ekran): Cho'ntak — tez, lekin vaqtinchalik · Restart — hammasi yo'qoladi · Javon — doimiy · Sinfga savol: Bot o'chib-yonganda qaysi ma'lumot saqlanib qoladi?
3. Ikki mijoz aralashmasligi uchun (10-ekran): Bitta umumiy sahifa — xavfli · Har mijoz — o'z sahifasi · Natija — toza suhbat · Sinfga savol: Ikki mijoz aralashib ketmasligi uchun nima kerak?
4. INSERT, SELECT, UPDATE (14-ekran): INSERT — yangi qator · SELECT — o'qish · UPDATE — yangilash · Sinfga savol: Yangi mijoz uchun qaysi SQL ishlatiladi?
5. Stateful xabar oqimi (15-ekran): Avval — xabar keladi · Keyin — o'qi va tekshir · Eng oxiri — saqla (Xabar → 🔍 SELECT → Tekshir → Amal → 💾 UPDATE) · Sinfga savol: Xabar kelganda bot birinchi nima qiladi?
Karta matnlari: «Bot signalni oladi, amalni bajaradi va **unutadi** — u tabiatan daftarsiz.» · «Oldingi javobga bog'liq savol kelsa, bot uni tanimaydi — chunki hech narsani eslamaydi.» · «Bosqichni (holatni) alohida joyda saqlasak, bot endi «qayerda to'xtaganini» biladi.» · «Kod ichidagi oddiy obyekt tez ishlaydi, lekin **RAM'da** yashaydi.» · «Server qayta ishga tushsa, cho'ntakdagi hamma yozuv **g'oyib bo'ladi**.» · «PostgreSQL diskda saqlanadi — restart unga ta'sir qilmaydi.» · «Hamma mijoz bitta sahifaga yozsa, oxirgi yozuv **avvalgisini bosib yuboradi**.» · «Har mijozga alohida sessiya (sahifa) berilsa, ular **bir-biriga tegmaydi**.» · «Aziza va Bekning buyurtmasi endi hech qachon aralashmaydi.» · «Yangi mijoz kelganda jadvalga **yangi qator qo'shiladi**.» · «Mavjud mijozning holatini **o'qib olish** uchun ishlatiladi.» · «Holat o'zgarganda mavjud qator **yangilanadi**, yangisi qo'shilmaydi.» · «Har narsa **xabar kelishidan** boshlanadi.» · «Bot daftardan mijozni **o'qiydi** (SELECT), holatni tekshiradi.» · «Amal bajarilgach, yangi holat **daftarga yoziladi** (UPDATE).»

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Bot nega bir necha xabardan keyin oldingi javobni unutadi? Internet aloqasi doimo beqaror bo'lib turgani sababli shunday bo'ladi · Foydalanuvchi xabarlarni juda tez ketma-ket jo'natayotgani sababli · ✔ Bot tabiatan daftarsiz — har xabarni birinchi marta deb biladi · Telegram serverlari xabarlarni tasodifiy tartibda yetkazib berishi
2. Ikkita mijoz — Aziza va Bek — bir vaqtda botga yozsa, ularning suhbati aralashmasligi uchun nima kerak? Ikkalasi uchun bitta umumiy sahifada bosqichni birga saqlash · Faqat birinchi xabar yuborgan mijozga javob qaytarib turish · Kelgan barcha xabarlarni tasodifiy tartibda aralashtirib javoblash · ✔ Har mijoz uchun alohida sessiya — o'z sahifasini ochish
3. Bot serveri o'chib-yonganda (restart) qaysi ma'lumot saqlanib qoladi? ✔ Doimiy daftarga (PostgreSQL) yozilgan ma'lumot · Cho'ntakdagi vaqtinchalik varaqchadagi holat ma'lumoti · Hech qanday ma'lumot hech qayerda saqlanib qolmaydi · Faqat foydalanuvchi telefonidagi ilova xotirasi
4. Suhbat holati (masalan, 'pitsa o'lchamini kutyapman') odatda nima deb ataladi? Webhook — signal kelganda ishlaydigan ulanish usuli · ✔ Sessiya bosqichi — suhbat hozir qaysi joyda turgani · Token — botning kim ekanini isbotlovchi maxfiy kalit · Fallback — hech nimaga mos kelmagan holatdagi qator
5. SELECT buyrug'i botga nima uchun kerak? Yangi mijozni butunlay ro'yxatdan o'tkazish uchun · Mavjud ma'lumotni bazadan butunlay o'chirish uchun · Jadval tuzilishini o'zgartirib qurish uchun · ✔ Mijoz va uning holatini bazadan o'qib olish uchun
6. Yangi foydalanuvchi birinchi marta /start bossa, uni jadvalga qo'shish uchun qaysi buyruq ishlatiladi? SELECT — mavjud qatorni bazadan o'qib chiqadi · ✔ INSERT — yangi qator jadvalga qo'shib beradi · UPDATE — mavjud qatorni o'zgartirib yozadi · DELETE — mavjud qatorni butunlay o'chiradi
7. Mijoz javob berganda, bot holatni keyingi bosqichga o'tkazish uchun nima qiladi? ✔ UPDATE bilan holatni yangi qiymatga yangilaydi · Butunlay yangi bot yaratib, eskisini butunlay almashtiradi · Eski xabarni serverdan butunlay va qaytarilmas holda o'chiradi · Foydalanuvchini jadvaldan butunlay va qaytarilmas holda o'chiradi
8. Cho'ntakdagi oddiy JavaScript obyektida saqlangan holatning eng katta kamchiligi nima? Bu usul ishlash tezligini juda sezilarli darajada pasaytiradi · Bu usul diskda juda ko'p ortiqcha joy egallab yuboradi · ✔ Server qayta ishga tushsa, saqlangan hammasi yo'qoladi · Buni faqat bitta mijoz bir vaqtning o'zida ishlata oladi
9. PostgreSQL jadvalidagi 'holat' ustuni nima uchun kerak? Foydalanuvchi ismini alohida saqlab qo'yish uchun · Botning joriy versiya raqamini alohida belgilab qo'yish uchun · ✔ Suhbat qaysi bosqichda ekanini eslab qolish uchun · Xabar yuborilgan aniq vaqtni yozib qo'yish uchun
10. Nega har mijozga alohida sessiya (sahifa) berish muhim? ✔ Har kimning suhbati o'zinikida qolib aralashmaydi · Bu botning ishlash tezligini sezilarli darajada ancha oshiradi · Bu PostgreSQL talab qiladigan majburiy va qat'iy texnik qoida · Bu faqat juda katta va murakkab hajmdagi botlar uchun kerak
11. Bot xabar olganda avval nima qiladi (stateful oqim boshida)? Darhol yangi mijoz sifatida jadvalga INSERT qiladi · ✔ Foydalanuvchi va uning holatini SELECT bilan o'qiydi · Butun serverni qaytadan ishga tushirib yuboradi · Foydalanuvchini jadvaldan butunlay o'chirib tashlaydi
12. Bot restart bo'lgandan keyin ham mijoz bilan suhbatni davom ettira olishi uchun nima shart? Mijoz botga qaytadan /start buyrug'ini bosishi shart · Bot internetga avvalgidan tezroq ulanib turishi shart · Cho'ntakdagi vaqtinchalik oddiy obyekt hali ham ishlatilishi shart · ✔ Holat doimiy bazada (PostgreSQL) saqlangan bo'lishi shart

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«daftar» — taqiqlangan so'z, lekin darsning markaziy metaforasi** — 0, 1, 2, 3, 5–13, 15, 18, 19-ekranlar, RECAPS, arena, panelda «Holat daftari». Yana bitta so'z bir necha narsani anglatadi: holat (0, 3), bitta mijozning sahifasi = sessiya (9, 10), butun PostgreSQL = «javondagi doimiy daftar» (5, 6, 8, 11), hatto RAM'dagi obyekt ham «daftarning eng sodda shakli» (5). 4-Modul lug'atida esa «daftar» = jadval. 1-darsdagi «varaq» (qoidalar varag'i) bu darsda «cho'ntakdagi varaqcha» (RAM) bo'lib qaytadi.
- **1-ekran: «Jihozlar paneli — bugun 3-uyacha yonadi»**, lekin 5 ta uyacha yonadi (Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari). Bugungi yangi buyum «Holat daftari» — 5-uyacha.
- **19-ekran, keyingi dars:** «Keyingi dars — Botjon bilimlaringizni yanada chuqurlashtiramiz!» — grammatikasi noto'g'ri («Botjon haqidagi…» bo'lishi kerak) va dars nomi aytilmagan. App.jsx bo'yicha keyingi dars — 5 «Loyiha kuni: AI bilan bot».
- **To'g'ri javob shakli bilan «sotilib» qolgan:** 4, 8, 10-ekranlarda tire («—») faqat to'g'ri variantda bor va o'sha variantda dars metaforasi turadi («daftarsiz», «doimiy daftar», «alohida sessiya — o'z sahifasi»). Qolgan variantlar «…sababli» yoki oddiy ibora. Arena 1- va 2-savol ham xuddi shunday. 13-ekranda har bo'shliqning to'g'ri tugmasi doim birinchi turadi (SELECT / UPDATE / INSERT) — shu ekran nishon beradi.
- **Izohsiz inglizcha so'zlar:** «deploy» (6, Mentor), «stateful» (12-ekran Mentori, 15-ekran sarlavhasi — faqat 18-ekrandagi kartochkada izohlanadi), «stateless» (4, izohda), «Case · tuzatish» (9, eyebrow — lug'atda «Case» taqiqlangan), «restart» (6, 8, 11, 12, 19 — 6-ekran sarlavhasi «o'chir-yoqing» deb ochib beradi). Nishon nomlari inglizcha: Safe Notes, No Mix-Up, Memory Keeper, SQL Writer.
- **«sessiya» ikki ma'noda:** darsda = bitta mijozning daftar sahifasi (1, 9, 10, 18); 17-ekrandagi podium shablonida esa «Bu sessiyaga hali hech kim qo'shilmagan» = jonli dars (lug'atda: sessiya → dars).
- **Nishon tavsifi ekranga mos emas:** «Memory Keeper — Buyurtmani boshidan oxirigacha olib bordingiz» 15-ekranda (oqimni tartiblash) beriladi, buyurtma esa 12-ekranda (ballsiz). «No Mix-Up — …aralashib ketgan sababini topdingiz» 10-ekranda beriladi, u yerda esa sabab emas, yechim so'raladi.
- **0-ekran, hook:** qaysi variant tanlansa ham javob «Aynan! Botjon tabiatan daftarsiz…» bo'ladi — «Botjon buzuq» yoki «Internet sekin» tanlagan o'quvchi ham «Aynan!» eshitadi.
