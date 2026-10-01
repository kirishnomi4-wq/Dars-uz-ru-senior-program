# 4-dars «Bot eslab qoladi — holat va PostgreSQL» — yakuniy matn

Fayl: `src/5-Modull/BotStatefulMemoryLesson.jsx` · 20 ekran · Keyingi dars: «Loyiha kuni: AI bilan bot»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Aziza «Pepperoni» deb yozdi, bot esa tushunmadi. Nega?
- Mentor: 3-darsda botingizga handler va tugmalar yozdingiz. Endi mijoz bir necha xabar bilan buyurtma beryapti. Tugmani bosing va bot qanday javob berishini kuzating.
- Chat «AvtoPizza bot» (bot · onlayn):
  - bot: Salom! Nima buyurtma qilasiz?
  - (tugmadan keyin) mijoz: Pitsa buyurtma qilaman
  - bot: Ajoyib! Qaysi pitsa?
  - mijoz: Pepperoni
  - bot: Nima pepperoni? Tushunmadim.
- Tugma: ▶ Suhbatni davom ettirish → ✓ Suhbatni ko'rdingiz
- Savol (tugmadan keyin chiqadi): Sizningcha, bot nega adashdi?
  - Bot buzilgan, dasturi ishlamay qoldi
  - ✔ Bot har xabarni alohida ko'radi, oldingisini eslamaydi
  - Internet sekin, xabarning bir qismi yo'qoldi
- Javob izohlari:
  - 2-variant: **Aynan!** Bu bot oldingi xabarlarni saqlamaydi: «Pepperoni» kelganda o'zi «Qaysi pitsa?» deb so'raganini bilmaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
  - 1-variant: **Qiziq fikr!** Lekin bot ishlayapti: u «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
  - 3-variant: **Qiziq fikr!** Lekin xabar yetib keldi: bot «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
- Tugma (pastda): Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun botingiz suhbatni eslab qolishni o'rganadi.
- Mentor: 1-darsda buyurtma suhbatini ko'rgansiz: manzil kelganda bot qaysi pitsa tanlanganini bilishi kerak edi. Buning uchun holat kerak. Bugun botga holat qo'shamiz va uni backend darslaridan tanish PostgreSQL'da saqlaymiz.
- Yorliq: dars oxirida — bot suhbatni eslab qoladi
- Chat «AvtoPizza bot · holat bilan»:
  - mijoz: Katta
  - bot: Yaxshi, Aziza: katta Pepperoni. Endi manzilingizni yuboring.
- Bugungi 4 qadam:
  1. Bot nega unutadi — holatsiz bot
  2. Holat: dastur xotirasida va PostgreSQL'da
  3. Ikki mijoz — har biriga alohida sessiya
  4. Xabar oqimi: SELECT → tekshirish → UPDATE, yangi mijozga INSERT
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar (pastda): Orqaga · Boshlaymiz →

## 2 · Holatsiz bot
- Eyebrow: Tajriba · holatsiz bot
- Sarlavha: Holatsiz bot har xabarni birinchi marta ko'rgandek qabul qiladi.
- Mentor: Aziza pitsa buyurtma qilmoqchi. Botda hali holat yo'q. Tugmani bosib suhbatni davom ettiring va o'ngda bot nimani bilishini kuzating.
- Chat «AvtoPizza bot · holatsiz» (har bosishda bitta juftlik):
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Nima pepperoni? Tushunmadim.
  3. Pepperoni pitsa haqida gapiryapman → Qaysi o'lchamda? Kichikmi, kattami?
  4. Katta → Nima katta? Tushunmadim.
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Aziza buyurtmasiz ketdi
- Bot nimani biladi: Hali hech narsa — birinchi xabarni kutyapti. → (birinchi xabardan keyin) Faqat hozirgi xabarni. Oldingilarini eslamaydi.
- Oxirida: Aziza ikki marta «Tushunmadim» javobini oldi. Bot «Pepperoni» va «Katta» ni oldi, lekin ular qaysi savolga javob ekanini bilmadi: o'zi nima so'raganini eslamaydi. Unga **holat** kerak.
- Tugma (pastda): Suhbatni davom ettiring (N/4) → Davom etish

## 3 · Botga holat qo'shamiz
- Eyebrow: Markaziy · holat
- Sarlavha: Botga holat qo'shamiz — endi u suhbatni eslab qoladi.
- Mentor: **Holat** — bot suhbat haqida eslab qoladigan yozuv: suhbat qaysi bosqichda va mijoz nimani tanlagan. Holat qo'shing, keyin xabarlarni birma-bir oching va o'ngda holat qanday o'zgarishini kuzating.
- Boshida: Botda hali holat yo'q. · Tugma: Holat qo'shish
- Chat «AvtoPizza bot · holat bilan»:
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Pepperoni — yaxshi tanlov! Qaysi o'lchamda?
  3. Katta → Rahmat! Buyurtmangiz: katta Pepperoni. Manzilni yuboring.
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Buyurtma qabul qilindi
- Suhbat holati (mijoz · holat · tanlov):
  - qo'shishdan oldin: — · — · —
  - qo'shilgach: Aziza · — · —
  - 1-xabar: Aziza · `PITSA_KUTYAPMAN` · —
  - 2-xabar: Aziza · `OLCHAM_KUTYAPMAN` · Pepperoni
  - 3-xabar: Aziza · `MANZIL_KUTYAPMAN` · Pepperoni, katta
- Oxirida: Har xabardan keyin holat yangilandi. Shuning uchun «Katta» endi ma'noli: bot holatdan o'zi o'lcham so'raganini biladi. Holatni eslab qoladigan bot **holatli (stateful) bot** deb ataladi.
- Tugma (pastda): Holat qo'shing → Suhbatni kuzating (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- To'g'ri javobni tanlang
- Savol: Bot o'zi o'lcham so'radi, lekin «Katta» javobini tushunmadi. Nega?
  - Internet sekin bo'lib, xabar Bot API'ga yetmadi
  - Mijoz juda tez yozdi, handler ulgurmay qoldi
  - ✔ Bot holatni saqlamaydi, o'z savolini eslamaydi
  - Telegram xabarlarni aralash tartibda yetkazdi
- Javob izohlari:
  - To'g'ri: Bot holatni saqlamaydi, shuning uchun «Katta» qaysi savolga javob ekanini bilmaydi.
  - 1-variant: Xabar yetib kelgan: bot unga javob berdi. Muammo — bot o'z savolini eslamaydi.
  - 2-variant: Tezlik sabab emas: handler har xabarni oladi. Muammo — oldingi xabar hech qayerda saqlanmaydi.
  - 4-variant: Telegram bitta chatdagi xabarlarni kelgan tartibida yetkazadi. Muammo boshqa joyda.
  - (umumiy) Holat saqlanmasa, bot har xabarni alohida ko'radi va oldingisini eslamaydi.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda (bitta urinish): Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · xato bo'lsa: To'g'ri javob: <harf> — <variant> · Tugma (pastda): Javob tanlang
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): To'g'ri javobni toping → Davom etish

## 5 · Holat koddagi obyektda
- Eyebrow: Kod · dastur xotirasi
- Sarlavha: Holatni saqlashning eng sodda yo'li — koddagi obyekt.
- Mentor: Holatni oddiy JavaScript obyektida saqlash mumkin. Mijoz bot bilan shaxsiy chatda yozadi, shuning uchun uning holati chat raqami — `ctx.chat.id` bo'yicha yoziladi. Bu ishlaydi, lekin bitta jiddiy kamchiligi bor. Tugmani bosing.
- Kod:
```js
// Har chatning holati — oddiy obyektda
const holatlar = {}   // { chat.id: holat }

// Mijoz pitsani tanladi:
holatlar[ctx.chat.id] = "OLCHAM_KUTYAPMAN"

// Keyingi xabar kelganda:
const holat = holatlar[ctx.chat.id]
```
- Tugma: Kamchiligi nimada? → ✓ Ko'rdingiz
- Kamchilik: Bu obyekt **dastur xotirasida (RAM)** turadi. Bot qayta ishga tushsa, xotira tozalanadi va barcha holatlar yo'qoladi: suhbat o'rtasidagi mijozlar boshidan boshlashga majbur bo'ladi. React darslarida ham shunday edi: sahifani yangilasangiz, xotiradagi ro'yxat yo'qolardi. Yechim — holatni **PostgreSQL'ga** yozish.
- Tugma (pastda): Kamchiligini ko'ring → Davom etish

## 6 · Qayta ishga tushirish
- Eyebrow: Markaziy · qayta ishga tushirish
- Sarlavha: Botni qayta ishga tushiring: nima qoladi, nima yo'qoladi?
- Mentor: Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Tugmani bosing va ikkala qutiga qarang.
- Qutilar:
  - Dastur xotirasi (RAM) — vaqtinchalik: `holatlar = { 558210300: "MANZIL_KUTYAPMAN" }` → qayta ishga tushgach: bo'sh — holatlar yo'qoldi
  - PostgreSQL — doimiy: `users: 558210300 · Aziza · MANZIL_KUTYAPMAN`
- Tugma: Botni qayta ishga tushirish → ✓ Bot qayta ishga tushdi
- Natija: Dastur xotirasi bo'shab qoldi, **PostgreSQL'dagi qator esa joyida**. Shuning uchun holatni PostgreSQL'ga yozamiz: bot qayta ishga tushgach, Azizaning holatini bazadan o'qiydi va suhbat shu joydan davom etadi.
- Tugma (pastda): Botni qayta ishga tushiring → Davom etish

## 7 · Ikki mijoz — umumiy holat
- Eyebrow: Muammo · ikki mijoz
- Sarlavha: Aziza va Bek bir vaqtda yozyapti. Holat ikkalasiga bitta bo'lsa-chi?
- Mentor: Faraz qiling: kodda holat `chat.id` bo'yicha ajratilmagan — hamma mijoz uchun bitta o'zgaruvchi. Tugmani bosing va holat qanday o'zgarishini kuzating.
- Xabarlar:
  1. Aziza: Pepperoni olmoqchiman
  2. Bek: Menga Margarita
  3. Aziza: Katta o'lchamda, iltimos
- Tugma: ▶ Xabarlarni boshlash → Keyingi xabar → → ✓ Hammasi ko'rildi
- Umumiy holat (hamma uchun bitta): mijoz ? · holat `OLCHAM_KUTYAPMAN` · tanlov: — → Pepperoni (Aziza) → Margarita (Bek) → Margarita, katta (kimniki?)
- Oxirida: Oxirgi qatorda «Margarita, katta» turibdi, lekin «Katta» ni **Aziza** yozgan edi. Holat bitta bo'lgani uchun Bekning Margaritasi Azizaning Pepperonisi ustiga yozildi. Endi Aziza Bekning pitsasini oladi.
- Tugma (pastda): Xabarlarni ko'ring (N/3) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- To'g'ri javobni tanlang
- Savol: Bot serveri birdan o'chib qoldi. Qaysi holat yo'qolmaydi?
  - Koddagi oddiy JavaScript obyektiga yozilgan holat
  - ✔ PostgreSQL'dagi users jadvaliga yozilgan holat
  - Handler ichidagi o'zgaruvchiga yozilgan holat
  - Hech qaysi: server o'chsa, hammasi yo'qoladi
- Javob izohlari:
  - To'g'ri: PostgreSQL ma'lumotni diskka yozadi — server qayta ishga tushsa ham u joyida qoladi.
  - 1-variant: Bu obyekt dastur xotirasida (RAM) turadi — bot qayta ishga tushsa, bo'shab qoladi.
  - 3-variant: Handler ichidagi o'zgaruvchi ham dastur xotirasida — u keyingi xabargacha ham saqlanmaydi.
  - 4-variant: PostgreSQL'ga yozilgan holat saqlanib qoladi — hammasi yo'qolmaydi.
  - (umumiy) Qayta ishga tushgandan keyin faqat PostgreSQL'ga yozilgan holat qoladi.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): To'g'ri javobni toping → Davom etish

## 9 · Har mijozga sessiya
- Eyebrow: Tuzatish · sessiya
- Sarlavha: Har mijozga alohida holat.
- Mentor: **Sessiya** — bitta mijozning holati, boshqalarnikidan alohida. Bot uni `chat.id` bo'yicha topadi. Avval har mijozni bosing, keyin ikkalasini birdan sinang.
- Kartalar (bosilganda sessiya ochiladi):
  - Aziza · o'z sessiyasi → chat.id `558210300` · holat `OLCHAM_KUTYAPMAN` · tanlov Pepperoni
  - Bek · o'z sessiyasi → chat.id `604417829` · holat `OLCHAM_KUTYAPMAN` · tanlov Margarita
- Tugma (ikkala karta ochilgach): ▶ Ikkalasi birdan yozsin → ✓ Ikkalasi birdan yozdi
- Tugma bosilganda ikki xabar birdan: Aziza «Katta» · Bek «Kichik»
- Sessiyalar yangilanadi: Aziza — holat `MANZIL_KUTYAPMAN` · tanlov Pepperoni, katta · Bek — holat `MANZIL_KUTYAPMAN` · tanlov Margarita, kichik
- Natija: **Aziza** — Pepperoni, katta · **Bek** — Margarita, kichik · Ikkala javob bir vaqtda keldi, lekin har biri o'z sessiyasiga tushdi — hech narsa aralashmadi.
- Tugma (pastda): Ikkalasini birdan sinang → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- To'g'ri javobni tanlang
- Savol: Aziza va Bek bir vaqtda buyurtma beryapti. Ularning suhbati aralashmasligi uchun nima kerak?
  - Ikkala mijozning holatini bitta umumiy o'zgaruvchida saqlash
  - Har mijoz uchun alohida bot ochib, alohida token berish
  - Umumiy holatni obyektda emas, PostgreSQL'da saqlash
  - ✔ Har mijozga alohida sessiya ochib, holatini unda saqlash
- Javob izohlari:
  - To'g'ri: Har mijozning holati o'z `chat.id` si bo'yicha alohida saqlanadi.
  - 1-variant: Bitta umumiy o'zgaruvchi aralashuvga olib keladi: oxirgi yozuv oldingisining ustiga yoziladi.
  - 2-variant: Har mijozga alohida bot kerak emas: bitta bot holatni `chat.id` bo'yicha ajratsa yetadi.
  - 3-variant: PostgreSQL holatni saqlab qoladi, lekin u hammaga bitta bo'lsa, baribir aralashadi.
  - (umumiy) Har mijozning holatini alohida sessiyada saqlash kerak.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): To'g'ri javobni toping → Davom etish

## 11 · users jadvali
- Eyebrow: PostgreSQL · users jadvali
- Sarlavha: Holat PostgreSQL'da: users jadvali.
- Mentor: Backend darslarida PostgreSQL'da jadval yaratgansiz. Bot uchun ham shunday jadval kerak: har mijoz — bitta qator, uning sessiyasi shu qatorda saqlanadi. Har ustunni bosib, nima saqlashini o'qing.
- Kod:
```sql
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  telegram_id  BIGINT NOT NULL UNIQUE,
  ism          TEXT,
  holat        TEXT NOT NULL,
  tanlov       TEXT
)
```
- Ustun tugmalari (bosilganda izoh):
  - `telegram_id` — Mijozning Telegram raqami; shaxsiy chatda u `ctx.chat.id` ga teng. Bot mijozning qatorini shu raqam bilan topadi.
  - `ism` — Mijozning ismi. Bir marta so'raladi va keyingi safar ham kerak bo'ladi.
  - `holat` — Suhbat hozir qaysi bosqichda, masalan `MANZIL_KUTYAPMAN`. Keyingi xabarni bot shu qiymatga qarab tushunadi.
  - `tanlov` — Mijoz hozirgacha nimani tanlagani, masalan «Pepperoni, katta». Buyurtma oxirida bot shu yerdan o'qiydi.
- Jadval (4 ustun ochilgach) — jadval: users

| id | telegram_id | ism | holat | tanlov |
|---|---|---|---|---|
| 1 | 558210300 | Aziza | MANZIL_KUTYAPMAN | Pepperoni, katta |

- Tugma (pastda): 4 ustunni oching (N/4) → Davom etish

## 12 · AvtoPizza buyurtmasi
- Eyebrow: Hayotiy · buyurtma
- Sarlavha: AvtoPizza buyurtmasi qadam-baqadam.
- Mentor: Buyurtmani qadam-baqadam oching va har javobdan keyin holat qanday o'zgarishini kuzating.
- Chat «AvtoPizza bot»:
  1. /start → Salom! Pitsa o'lchamini tanlang: kichik yoki katta?
  2. Katta → Yaxshi! Qo'shimcha pishloq qo'shaymi? (ha / yo'q)
  3. Ha → Qo'shdim. Endi manzilingizni yuboring.
  4. Chilonzor 5-uy → Rahmat! Buyurtma: katta, qo'shimcha pishloq bilan, Chilonzor 5-uy. Qabul qilindi.
- Suhbat holati · Aziza (holat · tanlov):
  - boshida: — · —
  - 1-qadam: `OLCHAM_KUTYAPMAN` · —
  - 2-qadam: `QOSHIMCHA_KUTYAPMAN` · katta
  - 3-qadam: `MANZIL_KUTYAPMAN` · katta, pishloq
  - 4-qadam: `TAYYOR` · katta, pishloq, Chilonzor 5-uy
- Tugma: ▶ Buyurtmani boshlash → Keyingi javob → → ✓ Buyurtma qabul qilindi
- Oxirida: Bot «Katta» va «Ha» kabi qisqa javoblarni holatga qarab tushundi. Har xabarda u holatni bazadan o'qiydi va yangisini yozadi — shuning uchun o'rtada qayta ishga tushsa ham, suhbat shu joydan davom etadi.
- Tugma (pastda): Buyurtmani yig'ing (N/4) → Davom etish

## 13 · SQL so'rovlari
- Eyebrow: Amaliyot · SQL
- Sarlavha: Holat bilan ishlaydigan uchta SQL so'rovi.
- Mentor: Handler bu so'rovlarni backend darslaridagidek `pool.query(...)` bilan yuboradi. Bo'shliqlarni navbat bilan to'ldiring.
- Kod yorlig'i: SQL
```sql
____ * FROM users WHERE telegram_id = $1

____ users SET holat = $1 WHERE telegram_id = $2

____ INTO users (telegram_id, holat) VALUES ($1, $2)
```
- Bo'shliqlar (navbat bilan, faqat joriysining variantlari ko'rinadi):
  - 1-bo'shliq: UPDATE · ✔ SELECT · INSERT
  - 2-bo'shliq: SELECT · DELETE · ✔ UPDATE
  - 3-bo'shliq: SELECT · ✔ INSERT · UPDATE
- Xato izohlari:
  - 1-bo'shliq: UPDATE — ma'lumotni o'zgartiradi; bu yerda esa avval o'qish kerak. · INSERT — yangi qator qo'shadi; bu yerda mavjud qatorni o'qiymiz.
  - 2-bo'shliq: SELECT faqat o'qiydi; bu yerda holatni yangilash kerak. · DELETE qatorni o'chiradi; bizga esa holatni yangilash kerak.
  - 3-bo'shliq: SELECT mavjud qatorni o'qiydi, yangi qator qo'shmaydi. · UPDATE faqat mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.
  - (zaxira) Bu to'g'ri emas.
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: To'g'ri: `SELECT` holatni o'qiydi, `UPDATE` holatni yangilaydi, `INSERT` yangi mijozga qator qo'shadi.
- Tugma (pastda): Bo'shliqlarni to'ldiring → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- To'g'ri javobni tanlang
- Savol: Mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?
  - ✔ INSERT — jadvalga yangi qator qo'shadi
  - SELECT — mavjud qatorni o'qiydi
  - UPDATE — mavjud qatorni o'zgartiradi
  - DELETE — mavjud qatorni o'chiradi
- Javob izohlari:
  - To'g'ri: Yangi mijozni SELECT topmaydi, shuning uchun unga INSERT bilan qator qo'shiladi.
  - 2-variant: SELECT o'qiydi, lekin yangi mijozning qatori hali yo'q — u hech narsa topmaydi.
  - 3-variant: UPDATE mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.
  - 4-variant: DELETE o'chiradi — bizga esa yangi qator kerak.
  - (umumiy) Yangi qator INSERT bilan qo'shiladi.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): To'g'ri javobni toping → Davom etish

## 15 · Oqimni yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: holatli botning xabar oqimini yig'ing.
- Mentor: Aziza jadvalda bor va yangi xabar yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash chiqadi; to'g'ri tartib):
  1. Xabar keladi
  2. SELECT — holat bazadan o'qiladi
  3. Holat tekshiriladi
  4. Javob va yangi holat tanlanadi
  5. UPDATE — yangi holat yoziladi
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam (bo'sh joyda: bu yerga qo'ying)
- To'g'ri: ✓ Oqim tayyor: **xabar keladi → SELECT → holat tekshiriladi → javob va yangi holat tanlanadi → UPDATE**, keyin bot javobni yuboradi. Yangi mijozni SELECT topmaydi — shunda bot avval INSERT bilan qator qo'shadi.
- UPDATE SELECT'dan oldin bo'lsa: **Bot holatni o'qimasdan yozib yubordi.** UPDATE SELECT'dan oldin bo'lsa, bot suhbat qaysi bosqichda ekanini bilmay turib yangi holat yozadi — mijoz noto'g'ri savol olishi mumkin.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): Oqimni yig'ing → Davom etish

## 16 · Amaliyot · loyihalash
- Eyebrow: Amaliyot · loyihalash
- Sarlavha: Botingiz uchun users jadvalini loyihalang
- Mentor: Topshiriqni qog'ozda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Karta «TOPSHIRIQ»: 1-darsda ochgan botingiz uchun users jadvalini qog'ozda loyihalang: qaysi ustunlar kerak, holat qayerda saqlanadi va qaysi SQL qachon ishlatiladi. Bugun kod yozmaysiz — faqat loyihalaysiz.
- Qadamlar (bittadan ochiladi, har birida tugma «Bajardim»):
  1. Botingizga qaysi ustunlar kerakligini yozing: `telegram_id`, `ism`, …
  2. Ro'yxatga `holat` ustunini qo'shing (`TEXT NOT NULL`).
  3. Xabar kelganda avval qaysi SQL ishlatilishini yozing.
  4. Holat o'zgarganda qaysi SQL ishlatilishini yozing.
  5. Yangi mijoz uchun qaysi SQL kerakligini yozing.
- Oxirida: ✓ Bajarildi — Mentorni kuting · Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugma (pastda): Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
- Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Tugma (pastda): Yakunlash →
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Holati yo'q bot bir necha xabardan keyin nega adashadi? | Oldingi xabarni eslamaydi | Har xabarni alohida hodisa deb ko'radi — bu holatsiz bot |
| Suhbat hozir qaysi bosqichda ekanini bildiradigan yozuv nima? | Holat (state) | Masalan: `MANZIL_KUTYAPMAN` — bot manzil kutyapti |
| Holatni eslab qoladigan bot qanday ataladi? | Holatli bot (stateful) | U suhbat qayerda to'xtaganini biladi |
| Bitta mijozning boshqalarnikidan alohida saqlanadigan holati nima? | Sessiya | Bot uni `chat.id` bo'yicha topadi |
| Hamma mijozning holati bitta o'zgaruvchida bo'lsa, nima bo'ladi? | Buyurtmalar aralashadi | Oxirgi yozuv oldingisining ustiga yoziladi |
| Koddagi oddiy obyektdagi holat bot qayta ishga tushsa nima bo'ladi? | Yo'qoladi | Obyekt dastur xotirasida (RAM) turadi — u vaqtinchalik |
| Bot qayta ishga tushsa ham holat qolishi uchun uni qayerga yozasiz? | PostgreSQL | Baza ma'lumotni diskka yozadi |
| Bot mijozlari haqidagi yozuvlar qaysi jadvalda turadi? | users | Ustunlari: id, telegram_id, ism, holat, tanlov |
| Yangi mijoz birinchi marta /start bosganda qaysi SQL buyrug'i ishlatiladi? | INSERT | Jadvalga yangi qator qo'shiladi |
| Mijozning holatini bazadan o'qish uchun qaysi buyruq kerak? | SELECT | Mijoz qatori `telegram_id` bo'yicha topiladi |
| Holat o'zgarganda mavjud qatorni qaysi buyruq yangilaydi? | UPDATE | Yangi qator qo'shilmaydi — bori yangilanadi |
| Xabar kelganda bot birinchi navbatda nima qiladi? | Holatni o'qiydi (SELECT) | Keyin holatni tekshiradi, javob va yangi holatni tanlaydi, yangi holatni yozadi (UPDATE) |

Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Holatni saqlashni bilasiz
- Sarlavha: Endi botingiz suhbatni eslab qoladi. (yonida ball halqasi: N/5 to'g'ri javob)
- Arena tugmasi: CODE STRIKE (jonli darsda kutish: Mentorni kuting)
- Endi siz bilasiz:
  - Holat saqlanmasa, bot qisqa javob qaysi savolga tegishli ekanini bilmaydi
  - Holat — suhbat qaysi bosqichda ekani va mijoz nimani tanlagani
  - Dastur xotirasidagi holat qayta ishga tushganda yo'qoladi — PostgreSQL'dagisi qoladi
  - Har mijozga alohida sessiya kerak — holat `chat.id` bo'yicha ajratiladi
  - Xabar oqimi: SELECT → holatni tekshirish → javob va yangi holat → UPDATE; yangi mijozga avval INSERT
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda ochiladi) Uyga vazifa:
  - **Holatlarni yozing** — botingiz suhbati qaysi holatlardan o'tadi? Masalan: `OLCHAM_KUTYAPMAN` → `MANZIL_KUTYAPMAN` → `TAYYOR`
  - **Ajrating** — botingizdagi qaysi ma'lumot vaqtinchalik bo'lsa bo'ladi, qaysi biri PostgreSQL'da saqlanishi kerak?
  - **Gemini'dan so'rang** — gemini.google.com'ga botingizning users jadvalini va holatlarini yozing, so'ng ikki mijoz uchun kod so'rang: yangi mijoz (INSERT) va jadvalda bor mijoz (SELECT → UPDATE).
- Keyingi dars — **«Loyiha kuni: AI bilan bot».** Aniq topshiriq yozib, botni AI yordamida qurasiz, uning kodini o'qiysiz va sinab ko'rasiz.
- Nishonlaringiz — N/4 (qarang: «Nishonlar»)
- Tugmalar (pastda): Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Safe Storage** (8-ekran) — Bot qayta ishga tushsa ham yo'qolmaydigan joyni tanladingiz
- **No Mix-Up** (10-ekran) — Ikki mijozning suhbati aralashmaydigan yo'lni tanladingiz
- **SQL Writer** (13-ekran) — SQL bo'shliqlarini birinchi urinishda to'g'ri to'ldirdingiz
- **State Flow** (15-ekran) — Holatli botning xabar oqimini birinchi urinishda to'g'ri yig'dingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · bosib davom eting

## Qisqa takrorlash oynalari
Oyna sarlavhasi: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. (4-ekran) **Bot nega unutadi**
   - [1] Holat saqlanmasa, har xabar — alohida hodisa — Bot hodisani oladi, javob beradi va keyingisini yangidan boshlaydi.
   - [2] Shuning uchun «Tushunmadim» deydi — «Katta» kabi qisqa javob qaysi savolga tegishli ekanini bilmaydi.
   - [`holat = "OLCHAM_KUTYAPMAN"`] Yechim — holat — Suhbat qaysi bosqichda ekanini saqlasak, bot qayerda to'xtaganini biladi.
   - Sinfga savol: Bot nega bir necha xabardan keyin adashadi?
2. (8-ekran) **Dastur xotirasi va PostgreSQL**
   - [`const holatlar = {}`] Koddagi obyekt — tez, lekin vaqtinchalik — U dastur xotirasida (RAM) turadi.
   - [2] Qayta ishga tushsa — yo'qoladi — Xotiradagi hamma holat o'chadi.
   - [`CREATE TABLE users`] PostgreSQL — doimiy — Ma'lumot diskda, bot qayta ishga tushsa ham qoladi.
   - Sinfga savol: Bot o'chib-yonganda qaysi ma'lumot saqlanib qoladi?
3. (10-ekran) **Ikki mijoz aralashmasligi uchun**
   - [1] Bitta umumiy holat — xavfli — Oxirgi yozuv oldingisining ustiga yoziladi.
   - [`holatlar[ctx.chat.id]`] Har mijozga o'z sessiyasi — Holat `chat.id` bo'yicha alohida saqlanadi.
   - [3] Natija — Har kim o'z buyurtmasini oladi.
   - Sinfga savol: Ikki mijoz aralashib ketmasligi uchun nima kerak?
4. (14-ekran) **INSERT, SELECT, UPDATE**
   - [`INSERT`] INSERT — yangi qator — Yangi mijoz kelganda jadvalga qator qo'shiladi.
   - [`SELECT`] SELECT — o'qish — Mavjud mijozning holatini o'qib olish uchun.
   - [`UPDATE`] UPDATE — yangilash — Holat o'zgarganda mavjud qator yangilanadi, yangisi qo'shilmaydi.
   - Sinfga savol: Yangi mijoz uchun qaysi SQL ishlatiladi?
5. (15-ekran) **Holatli botning xabar oqimi**
   - [1] Avval — xabar keladi — Hammasi shundan boshlanadi.
   - [`SELECT`] Keyin — o'qish va tekshirish — Bot mijoz holatini o'qiydi (SELECT) va tekshiradi.
   - [`UPDATE`] Eng oxiri — saqlash — Yangi holat bazaga yoziladi (UPDATE).
   - Chizma: Xabar → SELECT → Tekshirish → Javob → UPDATE
   - Sinfga savol: Xabar kelganda bot birinchi nima qiladi?

## Jonli viktorina (12 savol)
1. Bot nega bir necha xabardan keyin oldingi javobni unutadi?
   - Internet aloqasi beqaror bo'lib, xabar yo'qoladi
   - Mijoz xabarlarni juda tez ketma-ket yuborib turadi
   - ✔ Bot holatni saqlamaydi, har xabarni alohida ko'radi
   - Telegram xabarlarni tasodifiy tartibda yetkazadi
2. Aziza va Bek bir vaqtda botga yozsa, suhbatlari aralashmasligi uchun nima kerak?
   - Ikkalasining holatini bitta o'zgaruvchida saqlash
   - Har mijozga alohida bot ochib, alohida token berish
   - Umumiy holatni obyektda emas, PostgreSQL'da saqlash
   - ✔ Har mijozga alohida sessiya ochib, holatni saqlash
3. Bot serveri qayta ishga tushganda qaysi ma'lumot saqlanib qoladi?
   - ✔ PostgreSQL jadvaliga yozilgan ma'lumot
   - Koddagi JavaScript obyektidagi holat ma'lumoti
   - Hech qaysi, hammasi birdan yo'qoladi
   - Handler ichidagi o'zgaruvchidagi ma'lumot
4. Bot «pitsa o'lchamini kutyapman» degan yozuvni saqladi. Bu yozuv nima deyiladi?
   - Webhook — Telegram xabarni botga o'zi yuboradigan usul
   - ✔ Holat — suhbat hozir qaysi bosqichda ekanini bildiradi
   - Token — bot sizniki ekanini tasdiqlaydigan maxfiy qator
   - Fallback — hech bir handler mos kelmaganda ishlaydi
5. SELECT buyrug'i botga nima uchun kerak?
   - Yangi mijozni jadvalga qo'shib qo'yish uchun
   - Mavjud ma'lumotni bazadan o'chirish uchun
   - Jadval tuzilishini o'zgartirib qurish uchun
   - ✔ Mijoz va uning holatini bazadan o'qish uchun
6. Yangi mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?
   - SELECT — mavjud qatorni bazadan o'qiydi
   - ✔ INSERT — jadvalga yangi qator qo'shadi
   - UPDATE — mavjud qatorni o'zgartiradi
   - DELETE — mavjud qatorni o'chiradi
7. Mijoz javob bergach, bot holatni keyingi bosqichga qanday o'tkazadi?
   - ✔ UPDATE bilan holatni yangi qiymatga o'zgartiradi
   - INSERT bilan har safar yangi qator qo'shib boradi
   - SELECT bilan holatni bazadan qayta o'qib oladi
   - DELETE bilan eski holatni o'chirib tashlaydi
8. Koddagi oddiy JavaScript obyektida saqlangan holatning eng katta kamchiligi nima?
   - Bu usul botni juda sekinlashtirib qo'yadi
   - Bu usul diskda juda ko'p joy egallaydi
   - ✔ Bot qayta ishga tushsa, hammasi yo'qoladi
   - Uni bir vaqtda faqat bitta mijoz ishlata oladi
9. users jadvalidagi `holat` ustuni nima uchun kerak?
   - Mijozning ismini saqlab qo'yish uchun
   - Mijoz tanlagan pitsani saqlab qo'yish uchun
   - ✔ Suhbat qaysi bosqichda ekanini saqlash uchun
   - Xabar yuborilgan vaqtni yozib qo'yish uchun
10. Nega har mijozga alohida sessiya berish muhim?
    - ✔ Har kimning suhbati o'zida qoladi, aralashmaydi
    - Bot shundan keyin ancha tezroq ishlay boshlaydi
    - Bot qayta ishga tushsa ham, holat saqlanib qoladi
    - Bu faqat juda katta va murakkab botlarga kerak
11. Holatli bot xabar olganda birinchi nima qiladi?
    - Har safar mijozni jadvalga yangidan INSERT qiladi
    - ✔ Mijoz va uning holatini SELECT bilan o'qiydi
    - Avval yangi holatni UPDATE bilan yozib qo'yadi
    - Mijozdan ismini har safar qaytadan so'raydi
12. Bot qayta ishga tushgandan keyin ham suhbatni davom ettirishi uchun nima kerak?
    - Mijoz /start buyrug'ini qaytadan bosishi kerak
    - Bot internetga avvalgidan tezroq ulanishi kerak
    - Holat koddagi oddiy obyektda saqlanib turishi kerak
    - ✔ Holat PostgreSQL bazasida saqlangan bo'lishi kerak
