# Mentor kursi · Telegraf + PostgreSQL «Buyurtma boti: AI bilan bazaga ko'chiramiz» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (Telegraf+PG) · **F-1103-10** (qayta rejalash) · Sana: 2026-11-04 · Holat: **GATE M O'TDI 04.11** (3 smoke ✓, 4 push, qolganlari ma'qul) → KOD 3–8 → qurish · Fidbek: qator yoniga `>> …`
Oldingi: `17-TgPg-mentor-v1.md` (01.11, avtopilot, o'quvchi m5-04 dan olingan — foydalanuvchi: «nimani o'rgatdik? o'ta yomon») · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/TgPgMentorLesson.jsx` · bo'laklar `src/mentor-kurs/tgpg/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/tgpg-matn.py` (v2, PG-2 dagi kabi `==…==` va `Demak:`)
Qonun: `MENTOR_DARS_ETALON.md` M1–M45 · Haqiqiy chiqishlar: `manba/orderbot-out/` (loyiha, `drive-orderbot.sh`) · `manba/orderbot-ai/` (1-tajriba: Opus, to'liq prompt) · `manba/orderbot-ai2/` (2-tajriba: Haiku, oddiy prompt) · eski `manba/tgpg-out/` (faqat `07`, `13`, `14`)
Loyiha: **OrderBotNest** — lokal `/home/kali/Desktop/order-bot`, teglar `tgpg-start` (10a4954) · `tgpg-done` (38b6c22); GitHub `Azizbekcrypto/OrderBotNest` — push buyruq bilan (GATE M dan keyin)

**v1 → v2 nima o'zgardi (F-1103-10, foydalanuvchi qarorlari 03.11):**
- Mavzu Notion «BACKEND for mentors 2026» dan: mentor «Telegraf bilan ishlash» va «Telegrafda inline keyboard» videodarslarini ko'rgan. Bu dars — ularning davomi: tayyor botni PostgreSQL'ga ko'chirish. State'siz bot, RAM, `chat.id` tushuntirish ekranlari (v1 2–8) olib tashlandi — mentor buni biladi.
- O'yinchoq `bot-state` o'rniga **haqiqiy loyiha**: Nest + Telegraf + TypeORM + PostgreSQL 18, katalog (inline tugmalar, sahifalash), savat, buyurtma, admin roli. Mentor uni clone qiladi.
- Ish usuli — **AI bilan, bosqichma-bosqich**: mentor 4 ta prompt yozadi, har bosqichdan keyin o'zi tekshiradi. Promptlar va AI javoblari haqiqiy (ikki tajriba, 04.11).
- Asosiy saboq ikki tajribadan: AI kodni ko'pincha to'g'ri yozadi, xavf — **nazoratda**: bir promptda butun loyiha o'zgaradi (1145 qator), oraliq vaziyat ma'lumotni buzadi, mayda sxema bo'shlig'i diffni o'qimasa ko'rinmaydi. Mentor AI'ni bosqichlab boshqaradi va tekshiradi.
- Har bosqichda «ichida nima bo'ladi» ekrani (M41-5): TypeORM migratsiyasi, `BIGINT` matn bo'lib kelishi, `ON CONFLICT`, tranzaksiya va qulf, aborted tranzaksiya.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Telegraf'ni biladigan mentor (videodarslar: `bot.start`, `bot.command`, `bot.action`, inline keyboard, BotFather). PostgreSQL-1 va PostgreSQL-2 ni o'tgan (psql, CRUD, tranzaksiya, `CHECK`). NestJS mentor darslarini o'tgan (Module, Service, Repository). Tartib — GATE M 04.11: shu. |
| Dars oxirida mentor | 1) tayyor Nest + Telegraf loyihasini clone qilib ishga tushiradi, qaysi ma'lumot xotirada ekanini topadi · 2) ishni bosqichlarga bo'lib, besh qismli prompt yozadi · 3) AI javobini o'qiydi: o'zgargan fayllar, chetga chiqish, tekshirish buyruqlari · 4) TypeORM migratsiyasi qanday ishlashini biladi (`migrations` jadvali, `synchronize: false`) · 5) Telegram id uchun `BIGINT` va u kodga matn bo'lib kelishini biladi · 6) `INSERT … ON CONFLICT` bilan takror qatorning oldini oladi · 7) buyurtmani tranzaksiyada yozadi va ikki mijoz oxirgi mahsulotni olganda ortiqcha sotilmasligini tekshiradi · 8) har bosqichdan keyin restart + psql + build bilan tekshiradi · 9) m5-04 ni o'tishga tayyor (2 ekran) |
| O'quvchi darsi (faqat 6-bosqich) | **m5-04** «Bot eslab qoladi — holat va PostgreSQL» (`src/5-Modull/BotStatefulMemoryLesson.jsx`, `SCREEN_META` 20 ekran): reposi `TelegramBotNest` (`dars-04-done`), Neon, Antigravity'ga 3 qatorli prompt. |
| Kursdagi o'rni | Notion: Telegraf bilan ishlash · Telegrafda inline keyboard (videodarslar) → **shu** → (M31: raqam yozilmaydi). Keyingi mentor darsi kartasi — Ochiq savol 7. |
| Til | M9 + §MENTOR-STATE: state, stateful; atamalar inglizcha: entity, migration, repository, transaction, lock, diff, commit, seed, upsert. Ovozda «psql» emas — «PostgreSQL terminali» (M32). |
| Misol-ip | **OrderBotNest — CoddyCamp do'koni boti.** Katalog — PG-2 dagi `products` (Klaviatura 120 000 · Sichqoncha 75 000 · Quloqchin 95 000 · Kolonka 50 000) + Planshet 300 000 (3 ta) · O'yinchoq 30 000. Mijoz Aziza (id 5 123 456 789 — 32 bitdan katta), admin Jasur (id 111), ikkinchi mijoz Bobur. |
| AI | Promptlar bitta AI dasturiga bog'lanmaydi: «Antigravity, Claude Code, Codex yoki Copilot — qaysi biri bo'lsa ham». Ekranda AI javobi — **haqiqiy**, ikki tajribadan (`orderbot-ai/` Opus 5.5, `orderbot-ai2/` Haiku); belgi: «namuna — sizning AI'ingiz boshqacha yozadi, tekshiruv bir xil». AI oynasining surati qo'yilmaydi (maket bo'lardi). |
| Telegram | Bot logikasi haqiqiy: Telegram serverisiz `bot.handleUpdate` + javob ushlanadi (`manba/orderbot-harness.cjs`). Telegram ilovasidagi chat o'rniga — bot oqimi kartasi (GATE M 04.11). |
| Haqiqiylik (M10) | 03–04.11: Node 24.18 · NestJS 11.2.8 · Telegraf 4.16.3 · TypeORM 1.1.2 · pg 8.23.1 · PostgreSQL 18.4. Sinov portlari 5436/5437 → ekranda 5432. |
| Hajm | **28 ekran** · 6 bosqich · 4 amaliyot (AI bilan) · 4 tekshiruv · 8 savol · ovoz ≈ 27 daq · amaliyot ≈ 70–90 daq · jami ≈ 1 s 40 daq – 2 s |
| Me'yor | PG-2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, ko'prik M17, «Xulosa», kalit 8–14 so'z, M32 to'liq gap, M33 «Demak», M43 kod sahnasi) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **xotiradagi ma'lumot** — `Map` va massiv Node jarayonining RAM'ida; server qayta ishga tushsa bo'shaydi. Botda bu: savat, foydalanuvchi, telefon, state, buyurtma.
- **bosqichlab ko'chirish** — bir promptda bitta qism (katalog → foydalanuvchi va state → savat → buyurtma); har bosqichdan keyin tekshiruv va commit. Sabab — haqiqiy: oddiy promptda AI 22 faylni, 1145 qatorni bir yo'la o'zgartirdi.
- **besh qismli prompt** — kontekst (loyiha nima, hozir qanday) · bitta bosqich maqsadi · qat'iy shartlar · nimaga tegmaslik · javobda nima bo'lsin (fayllar + tekshirish buyrug'i).
- **AI javobini o'qish** — o'zgargan fayllar ro'yxati, «chetga chiqdim» qismi, tekshirish buyruqlari; keyin `git diff --stat` bilan solishtirish.
- **oraliq vaziyat** — qism bazada, qism xotirada: restartdan keyin buyurtma yo'qoldi, ombor esa kamayib qoldi.
- **TypeORM migratsiyasi** — jadval SQL fayli bilan yaratiladi, `migrations` jadvali qaysi migratsiya yurganini eslaydi; `synchronize: false`, `migrationsRun: true` — server ko'tarilganda yurmagani o'zi yuradi.
- **`BIGINT` va matn** — Telegram id 2 147 483 647 dan katta bo'lishi mumkin → `BIGINT`; node-pg va TypeORM uni **matn** qaytaradi: `"5123456789" === 5123456789` → `false`.
- **`ON CONFLICT`** — `UNIQUE` ustiga bitta so'rov: yo'q bo'lsa `INSERT`, bor bo'lsa `DO UPDATE` yoki `DO NOTHING`; ikki marta tez bosish ham bitta qator.
- **tranzaksiya va qulf** — buyurtma bitta ish: ombordan ayirish + buyurtma yozish + savatni tozalash; qator `FOR UPDATE` bilan qulflanadi yoki `UPDATE … WHERE stock >= qty` — ikki mijoz oxirgi mahsulotni ola olmaydi.
- **aborted** — tranzaksiya ichida xato chiqqach, keyingi har so'rov rad etiladi: «current transaction is aborted» (PG-2 dagi `shop=!#` ning kodi).
- **mentor tekshiruvi** — build · restart · psql (`\d`, `SELECT`) · ko'p mijoz sinovi · diff.

**Darsning ipi:** tayyor bot ishlaydi, lekin restartdan keyin hamma narsani unutadi → ishni to'rt bosqichga bo'lamiz va prompt yozamiz → 1-bosqich: ulanish, migratsiya, katalog — va oraliq vaziyat tuzog'i → 2–3-bosqich: foydalanuvchi, state, savat — `BIGINT` va `ON CONFLICT` → 4-bosqich: buyurtma tranzaksiyada — ikki mijoz, bitta Planshet → mentorning tekshiruv ro'yxati → oxirida ikki ekran: sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | OrderBotNest: modullar va bot oqimi | Lesson | 1 · loyiha va muammo |
| 3 | Restart — savat, buyurtma, telefon yo'qoldi | Lesson | 1 · ichida |
| 4 | Tekshiruv 1 — restartdan keyin nima qoladi | MCRetry | 1 |
| 5 | Amaliyot 1 — clone, ishga tushirish, restart | Practice | 1 |
| 6 | Reja: to'rt bosqich — nega bir promptda emas | Lesson | 2 · reja va prompt |
| 7 | Besh qismli prompt | Lesson | 2 |
| 8 | Tekshiruv 2 — qaysi prompt | MCRetry | 2 |
| 9 | TypeORM ichida: entity → migratsiya → `migrations` jadvali | Lesson | 3 · ulanish va katalog · ichida |
| 10 | AI javobini o'qish: fayllar, chetga chiqish, tekshirish | Lesson | 3 |
| 11 | Oraliq vaziyat: ombor kamaydi, buyurtma yo'q | Lesson | 3 · ichida |
| 12 | Amaliyot 2 — 1-prompt o'z AI'ingiz bilan | Practice | 3 |
| 13 | `BIGINT`: Telegram id va matn | Lesson | 4 · foydalanuvchi, state, savat · ichida |
| 14 | Bitta so'rov: `ON CONFLICT` — ikki marta bosish | Lesson | 4 · ichida |
| 15 | State bazada: telefon kutish restartdan o'tadi | Lesson | 4 |
| 16 | Tekshiruv 3 — `===` bilan solishtirish | MCRetry | 4 |
| 17 | Amaliyot 3 — 2- va 3-prompt | Practice | 4 |
| 18 | Buyurtma — bitta tranzaksiya | Lesson | 5 · buyurtma · ichida |
| 19 | Ikki mijoz, bitta Planshet: qulf | Lesson | 5 · ichida |
| 20 | Buzamiz: o'qib yozish — ikki marta sotildi | Lesson | 5 · buzamiz |
| 21 | Tranzaksiya ichida xato: aborted | Lesson | 5 · ichida |
| 22 | Tekshiruv 4 — qaysi satr ortiqcha sotadi | LineCheck | 5 |
| 23 | Amaliyot 4 — 4-prompt va ko'p mijoz sinovi | Practice | 5 |
| 24 | AI natijasini qabul qilish: beshta tekshiruv | Lesson | 5 · xulosa |
| 25 | Sinfga tayyorgarlik: m5-04 xaritasi | Lesson | 6 · sinfga tayyorgarlik |
| 26 | O'quvchilar xato qiladigan joylar va savollari | Lesson | 6 |
| 27 | O'z-sinov — 8 savol | Screen27 | — |
| 28 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code oynasi `OrderBotNest` (Explorer: `src/api/{telegram,catalog,user,cart,order}`, `core/entity`, `infrastructure`, `package.json`, `.env`) + terminal; psql — terminal oynasi (PG-2 dagidek); **bot oqimi kartasi** — «Aziza: /cart → bot: Savat bo'sh…» (harness chiqishi, Telegram ilovasi ko'rinishi emas — Ochiq savol 2); **AI javobi kartasi** — prompt (yuqorida) + AI javobidan qisqa parcha + `git diff --stat` (haqiqiy, «namuna» belgisi bilan). **Tekshiruv (M42):** chapda savol va variantlar, o'ngda material savoldan oldin, isbot javobdan keyin, ostida `Demak`.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Telegraf + PostgreSQL` · Sarlavha: **Tayyor buyurtma boti bor. Uni AI bilan PostgreSQL'ga ko'chiramiz — bosqichma-bosqich va har qadamni tekshirib**
- Sahna: chapda reja (6 bosqich); o'ngda ikki natija: bot oqimi kartasi «Buyurtma #1 qabul qilindi! … Jami: 220 000 so'm» va psql `SELECT id, total, status FROM orders;` → `1 | 220000 | CONFIRMED`.
- Reja: 01 Loyiha va muammo · 02 Reja va prompt · 03 Ulanish va katalog · 04 Foydalanuvchi, state, savat · 05 Buyurtma va tranzaksiya · 06 Sinfga tayyorgarlik
1. **Telegraf bilan bot yozishni bilasiz — bugun ==bot ma'lumotini PostgreSQL'da saqlaymiz==**
   Ovoz: «Assalomu alaykum. Telegraf bilan bot yozishni, buyruq va inline tugmalarni videodarslarda ko'rgansiz. Bugun keyingi qadam: bot ma'lumotini PostgreSQL'da saqlaymiz. Shunda server qayta ishga tushsa ham savat, buyurtma va telefon raqami yo'qolmaydi.»
2. **Loyiha tayyor: ==katalog, savat, buyurtma va admin== — Nest va Telegraf'da**
   Ovoz: «Loyiha noldan yozilmaydi. GitHub'da tayyor buyurtma boti bor: katalog, savat, buyurtma va admin paneli, NestJS va Telegraf'da. U to'liq ishlaydi, faqat hamma ma'lumot xotirada turadi. Siz uni clone qilib, kamchiligini o'z ko'zingiz bilan ko'rasiz.» · reja 01
3. **Kodni AI yozadi, siz ==bosqichlab boshqarasiz va har bosqichni tekshirasiz==**
   Ovoz: «Kodni AI yozadi: Antigravity, Claude Code, Codex yoki Copilot, qaysi biri bo'lsa ham. Sizning ishingiz boshqarish: ishni to'rt bosqichga bo'lasiz, har biriga prompt yozasiz va natijani o'zingiz tekshirasiz. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik, ekrandagi javoblar o'sha yurgizishlardan.» · reja 02–05
4. **Olti bosqich, to'rt amaliyot; oxirida ==ikki ekran sinfga tayyorgarlik==. Shoshilmang**
   Ovoz: «Dars olti bosqichdan iborat, to'rtta amaliyotda AI bilan o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz.» · reja 06
- Manba: `orderbot-out/04-baza-senariy.txt` (#1, 220 000), `05-psql-natija.txt` (`orders`).

## 2 · OrderBotNest: modullar va bot oqimi  ← `Lesson`
- Kicker: `1-bosqich · loyiha va muammo` · Sarlavha: **Loyiha besh moduldan iborat: telegram, catalog, user, cart va order**
- Sahna: VS Code — Explorer (`src/api/telegram/{telegram.service.ts, keyboards.ts, texts.ts}` · `catalog/` · `user/` · `cart/` · `order/` · `core/types.ts` · `config/index.ts`); o'ngda bot oqimi kartasi segment bilan yozilib boradi (`orderbot-out/01-xotira-senariy.txt` dan).
1. **Bot buyruqlari bitta faylda: ==`telegram.service.ts` — siz bilgan Telegraf handler'lari==**
   Ovoz: «Loyihani Explorer'da ochamiz. Bot buyruqlari bitta faylda: telegram service. Ichida siz bilgan Telegraf handler'lari turadi: bot start, bot command catalog va bot action. Tugmalar keyboards faylida, bot matnlari texts faylida.» · kod: `telegram.service.ts` 1–40 (Prettier, haqiqiy satrlar)
2. **Logika to'rt Service'da: ==katalog, foydalanuvchi, savat va buyurtma== — har biri o'z modulida**
   Ovoz: «Handler'lar logikani o'zi yozmaydi, Service'ga beradi. Loyihada to'rtta Service bor: catalog mahsulotlar va omborni boshqaradi, user foydalanuvchi va uning state'ini, cart savatni, order buyurtmani. Har biri o'z modulida, Nest ularni telegram service'ga inject qiladi.»
3. **Mijoz yo'li: ==katalog → savat → telefon → buyurtma==, keyin admin tasdiqlaydi**
   Ovoz: «Mijoz yo'lini ko'ramiz. Aziza katalogni ochadi, mahsulotlar ikkitadan sahifada. Tugmani bosib savatga qo'shadi, buyurtma beradi, bot telefon so'raydi. Raqam kelgach buyurtma yaratiladi va adminga xabar ketadi. Admin Jasur buyurtmani tasdiqlaydi, Azizaga xabar boradi.» · oqim kartasi
4. **Xulosa: bot to'liq ishlaydi, lekin ==hamma ma'lumot `Map` va massivda== turibdi**
   Ovoz: «Xulosa: bot to'liq ishlaydi, admin roli ham bor. Lekin Service'larni ochsangiz, foydalanuvchilar Map'da, savatlar Map'da, buyurtmalar oddiy massivda turibdi. Bu ma'lumot qayerda yashashini keyingi ekranda ko'ramiz.» · kod: `user.service.ts` `private readonly users = new Map<number, User>()`, `order.service.ts` `private readonly orders: Order[] = []`
- Manba: `order-bot` `tgpg-start` (10a4954) fayllari; `orderbot-out/01-xotira-senariy.txt` (1-jarayon).

## 3 · Restart — savat, buyurtma, telefon yo'qoldi  ← `Lesson`
- Kicker: `1-bosqich · ichida` · Sarlavha: **`Map` Node jarayonining xotirasida yashaydi: jarayon to'xtasa — u ham yo'qoladi**
- Sahna: ikki ustunli bot oqimi kartasi — chapda «1-jarayon» (buyurtma #1, savatda Sichqoncha), o'ngda «server qayta ishga tushdi» (`/cart` → «Savat bo'sh», `/orders` → «Hozircha buyurtma yo'q»); ostida chizma: Node jarayoni ↔ RAM (`Map`) · disk (yo'q).
1. **1-jarayonda hammasi bor: ==buyurtma #1, savatda Sichqoncha, Azizaning telefoni==**
   Ovoz: «Birinchi jarayonda bot ishlayapti. Aziza buyurtma berdi, raqami bir, jami ikki yuz yigirma ming so'm. Admin uni tasdiqladi. Keyin Aziza savatga yana Sichqoncha qo'shdi. Telefoni ham botda saqlangan.» · chap ustun
2. **Server qayta ishga tushdi: ==savat bo'sh, buyurtma yo'q==, telefon yana so'raladi**
   Ovoz: «Endi serverni to'xtatib, qayta ishga tushiramiz. Aziza savatni ochadi: savat bo'sh. Admin buyurtmalarni ko'radi: hozircha buyurtma yo'q. Telefon raqami ham yo'qoldi, keyingi buyurtmada bot uni yana so'raydi. Xato xabari chiqmadi, ma'lumot shunchaki yo'q.» · o'ng ustun
3. **Sabab: `Map` — ==jarayon xotirasidagi obyekt==; jarayon bilan birga tug'iladi va o'ladi**
   Ovoz: «Sababi oddiy. Map Node jarayonining operativ xotirasidagi obyekt. Jarayon ishga tushganda u bo'sh yaratiladi, jarayon to'xtaganda xotira bo'shaydi. Hosting serverni har deploy'da qayta ishga tushiradi, ya'ni haqiqiy botda bu kuniga bir necha marta bo'ladi.» · chizma
4. **Xulosa: ==saqlanishi kerak bo'lgan har narsa bazaga== — beshta ma'lumot ro'yxati**
   Ovoz: «Xulosa: restartdan keyin qolishi kerak bo'lgan har narsa bazada turishi kerak. Botda bunday ma'lumot beshta: mahsulot va ombor, foydalanuvchi va uning roli, telefon va state, savat, buyurtma. Bugun shu beshtasini PostgreSQL'ga ko'chiramiz.» · ro'yxat kartasi
- Manba: `orderbot-out/01-xotira-senariy.txt` (2 jarayon, aynan).

## 4 · Tekshiruv 1 — restartdan keyin nima qoladi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Katalog kodda yozilgan massiv, ombordagi son ham shu massivda. Restartdan keyin Kolonka qoldig'i nechta bo'ladi?**
- Material (`above`, M42): kod `catalog.service.ts`: `const PRODUCTS: Product[] = [ … { id: 4, name: 'Kolonka', price: 50000, stock: 10 }, …]` + bot oqimi: «Aziza: Kolonka × 2 — buyurtma #1» (qoldiq 8 bo'ldi).
- Ovoz: «Xotirani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Katalog kodda yozilgan massiv, ombordagi son ham shu massivda turadi. Aziza ikkita Kolonka oldi, qoldiq sakkiz bo'ldi. Server qayta ishga tushsa, Kolonka qoldig'i nechta bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 8 — server oxirgi qiymatni eslab qoladi · 2 10 — massiv koddan qaytadan yaratiladi · 3 0 — RAM bo'shaydi, massiv ham bo'sh qoladi · 4 Server xato beradi — ombor sinxron emas
- To'g'ri (ovoz): «To'g'ri. Massiv kodda yozilgan, jarayon ishga tushganda u yana koddagi qiymat bilan yaratiladi: o'n. Ya'ni restart buyurtmani o'chirdi va omborni ham o'n ga qaytardi. Ikkalasi bir-biriga mos, faqat noto'g'ri. Demak, xotiradagi ma'lumot har restartda kod yozilgan boshlang'ich qiymatiga qaytadi.» · qisqa: «Massiv koddan qayta yaratiladi — `stock: 10`. Buyurtma yo'qoldi, ombor ham qaytdi.»
- Isbot (`after`): terminal — ikki alohida jarayon: `jarayon 276989: Buyurtma #1 qabul qilindi! · Kolonka stock = 8` → `jarayon 277003 (qayta ishga tushdi): Kolonka stock = 10`.
- Demak: «Xotiradagi ma'lumot har restartda koddagi boshlang'ich qiymatga qaytadi.»
- Xato izohlari: 1 — «Eslab qolish uchun disk kerak; `Map` va massiv faqat RAM'da.» · 3 — «Xotira bo'shaydi, lekin massiv kodda yozilgan — u qayta yaratiladi.» · 4 — «Restart xato emas: server odatdagidek ko'tariladi.»
- Maslahat: «Massiv qayerda yozilgan — kodda yoki bazada? Jarayon ishga tushganda kod massivga qaysi qiymatni beradi?»
- Manba: `order-bot` `tgpg-start` `catalog.service.ts`; `orderbot-out/01` (buyurtma #1: Kolonka × 2).

## 5 · Amaliyot 1 — clone, ishga tushirish, restart  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **Loyihani o'z kompyuteringizda ishga tushiring va restartda nima yo'qolishini ko'ring** · `tableAt: 3`
1. **Endi siz: loyihani clone qilasiz, ==o'z botingiz tokeni bilan== ishga tushirasiz**
   Ovoz: «Endi navbat sizga. Loyihani clone qilasiz va o'z botingiz bilan ishga tushirasiz. Token uchun BotFather'da yangi sinov boti oching, videodarsdagi kabi. O'n besh daqiqa ketadi.»
2. **1–2-qadam: clone, `tgpg-start` tegi, `npm install`, `.env` — ==token va o'z id'ingiz==**
   Ovoz: «Birinchi qadamda reponi clone qilib, tgpg start tegiga o'tasiz va npm install qilasiz. Ikkinchisida env example'dan env fayl yasaysiz: bot token va admin uchun o'z Telegram id'ingiz. Id'ni userinfobot'dan olasiz.»
3. **3–4-qadam: bot oqimi, keyin restart; isbot — ==restartdan keyin `/cart` javobi==**
   Ovoz: «Uchinchi qadamda Telegram'da start, catalog, ikki mahsulot va buyurtmani sinaysiz, admin sifatida orders'ni ko'rasiz. To'rtinchisida savatga mahsulot qo'shib, serverni Ctrl C bilan to'xtatib qayta yoqasiz. Isbot maydoniga cart buyrug'iga kelgan javobni yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin loyiha kompyuteringizda ishlaydi va qaysi ma'lumot restartda yo'qolishini o'zingiz ko'rgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Clone | `git clone https://github.com/Azizbekcrypto/OrderBotNest.git` · `cd OrderBotNest` · `git checkout tgpg-start` · `npm install` | `added … packages` |
  | 2 | `.env` — `BOT_TOKEN` (BotFather) va `ADMIN_TELEGRAM_IDS` (@userinfobot) yozing, keyin ishga tushiring | `cp .env.example .env` · `npm run start:dev` | `Server 3000-portda ishlayapti` · `Telegram bot ulandi` |
  | 3 | Bot oqimi — Telegram'da: /start → /catalog → ▶ → mahsulot → /cart → «✅ Buyurtma berish» → telefon → /orders | `/start` · `/catalog` · `/orders` | «Buyurtma #1 qabul qilindi!» · admin tugmalari |
  | 4 | Restart — savatga mahsulot qo'shing, serverni to'xtatib qayta yoqing, Telegram'da /cart va /orders | `Ctrl+C` · `npm run start:dev` · `npm run smoke -- restart` | «Savat bo'sh…» · «Hozircha buyurtma yo'q.» · `NATIJA: 0/3` |
- Isbot: «Restartdan keyin `/cart` ga kelgan javob» · placeholder: «bot javobini nusxalang» · KOD: `/savat\s+bo.?sh/i` · xato: «Restartdan keyin savat ochilganmi? Server `Ctrl+C` bilan to'xtab, qayta yoqilganini tekshiring.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `BOT_TOKEN topilmadi` | `.env` yo'q yoki bo'sh — `cp .env.example .env`, token yozing |
  | `Server … ishlayapti` va `Telegram ulanmadi: 401: Unauthorized` | token noto'g'ri; server ishlaydi, bot javob bermaydi — BotFather'dan qayta oling |
  | `409: Conflict: terminated by other getUpdates request` | shu token bilan ikkinchi nusxa ishlayapti — eski terminalni to'xtating (⚠ Telegram hujjatidan, sinalmagan — haqiqiy token kerak) |
  | `/orders` → «faqat admin uchun» | `ADMIN_TELEGRAM_IDS` da boshqa id — @userinfobot'dagi raqamni yozing |
  | `EADDRINUSE :::3000` | port band — eski server; `Ctrl+C` yoki `.env` da `PORT=3001` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `order-bot` README «Xatolar»; `orderbot-out/12-k4-401.txt` (OrderBotNest, soxta token, Telegram'ning haqiqiy serveri: `Server 3021-portda ishlayapti` · `Telegram ulanmadi: 401: Unauthorized`), `12-k4-xatolar.txt` (`BOT_TOKEN topilmadi`); `409` — Telegram Bot API hujjati, ⚠ sinalmagan.

---

## 6 · Reja: to'rt bosqich — nega bir promptda emas  ← `Lesson`
- Kicker: `2-bosqich · reja va prompt` · Sarlavha: **Beshta ma'lumot — to'rt bosqich: har bosqichdan keyin tekshiruv va commit**
- Sahna: to'rt bosqich kartasi (galma-gal): 1 ulanish + katalog · 2 foydalanuvchi + state · 3 savat · 4 buyurtma + tranzaksiya; 3-segmentda «oddiy prompt» kartasi: `Katalogni postgresqlga ko'chirib ber, TypeORM ishlat.` → `git diff --stat`: `22 files changed, 1145 insertions(+), 210 deletions(-)`.
1. **Ishni ==to'rt bosqichga== bo'lamiz: ulanish va katalog, foydalanuvchi, savat, buyurtma**
   Ovoz: «Beshta ma'lumotni bir yo'la ko'chirmaymiz. Ishni to'rt bosqichga bo'lamiz: avval bazaga ulanish va katalog, keyin foydalanuvchi va uning state'i, keyin savat, oxirida buyurtma va tranzaksiya. Tartib bog'liqlikka qarab: savat foydalanuvchi va mahsulotga, buyurtma hammasiga tayanadi.»
2. **Har bosqichdan keyin: ==build, restart, psql — keyin commit==**
   Ovoz: «Har bosqichdan keyin to'xtaymiz va tekshiramiz: loyiha build bo'ladimi, restartdan keyin nima qoladi, PostgreSQL terminalida jadval qanday. Hammasi to'g'ri bo'lsa, commit qilamiz. Keyingi bosqich xato qilsa, oxirgi ishlagan joyga qaytish oson bo'ladi.»
3. **Bir gapli promptda AI ==1145 qatorni bir yo'la== o'zgartirdi — buni ko'rib chiqib bo'lmaydi**
   Ovoz: «Nega bosqichlab? Biz sinab ko'rdik. AI'ga bir gapli prompt berdik: katalogni PostgreSQL'ga ko'chir. U faqat katalogni emas, hammasini ko'chirdi: yigirma ikki fayl, ming bir yuz qirq besh yangi qator. Kod ishladi, lekin bunday o'zgarishni mentor o'qib chiqa olmaydi, xato bo'lsa qayerdaligini topa olmaydi.» · oddiy prompt kartasi
4. **Xulosa: ==bitta prompt — bitta bosqich==, natijani tekshirmaguncha keyingisiga o'tmaymiz**
   Ovoz: «Xulosa: bitta prompt, bitta bosqich. Bosqich kichik bo'lsa, AI javobini o'qiysiz, diffni ko'rasiz va xatoni darhol topasiz. Tekshirmaguncha keyingi promptni yozmang. Endi promptning o'zini qanday yozishni ko'ramiz.»
- Manba: `orderbot-ai2/00-promptlar.md` (1-prompt), `orderbot-ai2/p1/diff-stat.txt` (22 files, 1145/210), `orderbot-ai2/p1/00-ai-javobi.md`.

## 7 · Besh qismli prompt  ← `Lesson`
- Kicker: `2-bosqich · reja va prompt` · Sarlavha: **Yaxshi prompt beshta qismdan iborat: kontekst, maqsad, shartlar, chegara va javob**
- Sahna: 1-prompt matni (`orderbot-ai/00-promptlar.md`) — besh qism rang bilan yonadi (galma-gal): kontekst · bitta bosqich maqsadi · qat'iy shartlar · nimaga tegmaslik · javobda nima bo'lsin.
1. **Birinchi qism — ==kontekst==: loyiha nima va hozir qanday ishlaydi**
   Ovoz: «Promptning birinchi qismi kontekst: loyiha nima va hozir qanday ishlaydi. AI loyihani o'qiy oladi, lekin sizning maqsadingizni bilmaydi. Shuning uchun bitta gap yetadi: bu NestJS va Telegraf'dagi buyurtma boti, hamma ma'lumot xotirada, bosqichma-bosqich PostgreSQL'ga ko'chiramiz.» · 1-qism
2. **Ikkinchi va uchinchi qism — ==bitta bosqich maqsadi va qat'iy shartlar==**
   Ovoz: «Ikkinchi qism maqsad: faqat shu bosqich, bizda ulanish va katalog. Uchinchisi qat'iy shartlar: manzil env'dan o'qilsin, synchronize ishlatilmasin, jadval migratsiya bilan yaratilsin, stock manfiy bo'lmasin, seed ikkinchi marta takror qo'shmasin. Har shart keyin tekshiriladigan narsa.» · 2–3-qism
3. **To'rtinchi va beshinchi qism — ==nimaga tegmaslik va javobda nima bo'lishi==**
   Ovoz: «To'rtinchi qism chegara: user, savat va buyurtma servislariga hali tegma. Beshinchisi javob: qaysi fayllar o'zgardi, qanday ishga tushirish va PostgreSQL terminalida nimani tekshirish. Shu qism AI'ni o'z ishini tushuntirishga majburlaydi, siz esa tekshirish ro'yxatini tayyor olasiz.» · 4–5-qism
4. **Xulosa: har shart — ==keyin tekshiriladigan bitta band==; tekshirib bo'lmaydigan shart yozilmaydi**
   Ovoz: «Xulosa: prompt beshta qismdan iborat. Har shartni keyin tekshirish mumkin bo'lsin: stock manfiy bo'lmasin degan shartni PostgreSQL terminalida minus bir yozib tekshirasiz. Chiroyli qilib yoz degan shartni tekshirib bo'lmaydi, uni yozmang.»
- Manba: `orderbot-ai/00-promptlar.md` (Prompt 1, aynan).

## 8 · Tekshiruv 2 — qaysi prompt  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **Ikki AI'ga bir xil vazifa berildi. Qaysi natijani ko'rib chiqib, commit qilish mumkin?**
- Material (`above`): ikki karta. A: prompt «Katalogni postgresqlga ko'chirib ber, TypeORM ishlat.» → `22 files changed, 1145 insertions(+), 210 deletions(-)` · AI: «katalog va holat xotiradan PostgreSQL'ga ko'chirildi». B: besh qismli 1-prompt → `15 files changed` (shundan `package-lock.json`) · AI: «Bitta chetga chiqish: order va telegram servislarida bir nechta qatorni o'zgartirdim… `await` qo'shilmasa, kod kompilyatsiyadan o'tmaydi.»
- Ovoz: «Prompt qolipini ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Ikki AI'ga bir xil vazifa berildi: katalogni bazaga ko'chirish. Ekranda ikkala prompt, o'zgarish hajmi va AI javobidan parcha. Qaysi natijani ko'rib chiqib, commit qilish mumkin? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 A — hammasini bir yo'la qilgan, vaqt tejaldi · 2 Ikkalasi bir xil — ikkalasi ham ishlaydi · 3 B — faqat so'ralgan bosqich, chetini aytgan · 4 Hech biri — AI kodini commit qilib bo'lmaydi
- To'g'ri (ovoz): «To'g'ri. B faqat katalogni ko'chirdi va boshqa servislarga nega tekkanini o'zi aytdi: async bo'lgani uchun await kerak edi. Bu asosli va tekshirish oson. A ham ishladi, lekin so'ralmagan to'rt bosqichni bir yo'la qildi va buni aytmadi. Demak, commit qilinadigan natija hajmi siz so'ragan bosqichga teng bo'ladi.» · qisqa: «B — so'ralgan bosqich, chetga chiqish aytilgan. A — 1145 qator, so'ralmagan ish, aytilmagan.»
- Isbot (`after`): B ning `git diff --stat` (fayllar: catalog, config, app.module, database/…, `order.service.ts | 11`, `telegram.service.ts | 25` — aynan chetga chiqish).
- Demak: «Commit qilinadigan o'zgarish hajmi siz so'ragan bosqichga teng bo'ladi.»
- Xato izohlari: 1 — «Ko'p ish — ko'p ko'rib chiqish: 1145 qatorda xatoni topish qiyin.» · 2 — «Ishlashi yetmaydi: siz har qatorga javob berasiz.» · 4 — «Commit qilinadi — o'qib, tekshirib bo'lgandan keyin.»
- Maslahat: «Qaysi AI faqat so'ralgan ishni qildi? Qaysi biri qayerda chetga chiqqanini aytdi?»
- Manba: `orderbot-ai2/p1/diff-stat.txt`, `orderbot-ai2/p1/00-ai-javobi.md`; `orderbot-ai/p1/diff-stat.txt`, `orderbot-ai/p1/00-ai-javobi.md`.

---

## 9 · TypeORM ichida: entity → migratsiya → `migrations` jadvali  ← `Lesson`
- Kicker: `3-bosqich · ulanish va katalog · ichida` · Sarlavha: **Entity jadvalni tasvirlaydi, migratsiya uni yaratadi, `migrations` jadvali nima yurganini eslaydi**
- Sahna: VS Code — `core/entity/product.entity.ts` (1–17) → `infrastructure/migrations/1762200000000-init.ts` `products` bo'lagi (`CREATE TABLE … CONSTRAINT "stock_nonneg" CHECK ("stock" >= 0)`) → terminal: psql `\dt` va `SELECT * FROM migrations;`.
1. **Entity — ==jadvalning kod ko'rinishi==: klass, ustunlar decorator bilan**
   Ovoz: «Birinchi bosqich ichida nima bo'lishini ko'ramiz. TypeORM'da jadval entity klassi bilan tasvirlanadi: Entity decorator jadval nomini, Column decorator har ustunni beradi. Siz bilgan Mongoose'da bu schema edi.» · kod: `product.entity.ts` · `.mk-pair`: `Mongoose'da: new Schema({ telegramId: { type: Number, unique: true }, … })` → kolleksiya birinchi yozuvda o'zi paydo bo'ldi
2. **Migratsiya — ==jadvalni yaratadigan SQL fayli==; `synchronize` o'chiq**
   Ovoz: «Jadvalni entity emas, migratsiya yaratadi. Migratsiya oddiy SQL fayli: up metodida create table, down metodida drop table. Synchronize false, ya'ni TypeORM jadvalni o'zi o'zgartirmaydi. Mongoose'da migratsiya yo'q edi, chunki kolleksiyada ustun qoidasi yo'q. PostgreSQL'da qoida bor, uni fayl bilan o'zgartiramiz.» · kod: migratsiya `products` bo'lagi
3. **`migrations` jadvali — ==qaysi fayl yurganini eslaydi==; server ko'tarilganda yurmagani o'zi yuradi**
   Ovoz: «Migratsiya yurgach, TypeORM migrations jadvaliga bitta qator yozadi: fayl nomi va vaqti. Server har ko'tarilganda shu jadvalga qaraydi va faqat yurmagan migratsiyani yurgizadi, bu migrations run true sozlamasi. Ikkinchi ishga tushirishda hech narsa takrorlanmaydi.» · terminal: `\dt` (6 jadval) · `migrations`: `1 | 1762200000000 | Init1762200000000`
4. **Xulosa: jadvalni o'zgartirish — ==yangi migratsiya fayli==, eskisi tahrirlanmaydi**
   Ovoz: «Xulosa: entity jadvalni kodda tasvirlaydi, migratsiya uni bazada yaratadi, migrations jadvali qaysi fayl yurganini eslaydi. Keyin ustun qo'shmoqchi bo'lsangiz, yangi migratsiya yozasiz. Yurgan migratsiyani tahrirlash foyda bermaydi: baza uni qayta yurgizmaydi.»
- Manba: `order-bot` `tgpg-done` (`product.entity.ts`, `1762200000000-init.ts`, `data-source.ts`); `orderbot-out/03-jadvallar.txt` (`\dt`, `migrations`); Mongoose — `12-k5-mongoose.txt` (Mongoose 9.11.4 · MongoDB 6.0.27: kolleksiyalar `cartitems`, `users` — migratsiyasiz).

## 10 · AI javobini o'qish: fayllar, chetga chiqish, tekshirish  ← `Lesson`
- Kicker: `3-bosqich · ulanish va katalog` · Sarlavha: **AI javobini uch qismga ajrating: nima o'zgardi, qayerda chetga chiqdi, qanday tekshiriladi**
- Sahna: AI javobi kartasi (1-tajriba, Prompt 1 — qisqa parchalar) → `git diff --stat` (haqiqiy) → terminal: siz yurgizgan tekshiruv (`npm run seed` ×2, `\d products`).
1. **Birinchi: ==o'zgargan fayllar ro'yxatini `git diff --stat` bilan== solishtiring**
   Ovoz: «AI ishini tugatdi va javob yozdi. Uni uch qismga ajratib o'qing. Birinchisi: qaysi fayllar o'zgardi. AI'ning ro'yxatini git diff stat bilan solishtiring. Bu safar ro'yxat mos keldi: entity, migratsiya, seed, config va catalog service.» · diff-stat
2. **Ikkinchi: ==«chetga chiqdim» qismini== toping va sababini baholang**
   Ovoz: «Ikkinchisi: AI qayerda chetga chiqdi. Biz user, savat va buyurtmaga tegma degan edik. AI order va telegram servislarini o'zgartirgan va buni ochiq yozgan: catalog service endi async, chaqiruvlarga await kerak. Sabab asosli. Agar sabab yozilmagan bo'lsa, diffdan o'zingiz qidirasiz.» · AI parchasi
3. **Uchinchi: tekshirish buyruqlarini ==o'zingiz yurgizing== — AI'ning «sinadim» degan gapi isbot emas**
   Ovoz: «Uchinchisi: tekshirish. AI o'zim sinadim deydi, lekin bu isbot emas. Buyruqlarni o'zingiz yurgizing. Seed birinchi marta olti mahsulot qo'shdi, ikkinchi marta nol. Backslash d products'da UNIQUE va CHECK bor. Build toza.» · terminal: `Seed: 6 ta mahsulot qo'shildi…` · `Seed: 0 ta mahsulot qo'shildi, 6 tasi bazada bor edi.` · `"CHK_products_stock" CHECK (stock >= 0)`
4. **Xulosa: o'qing, solishtiring, yurgizing — ==shundan keyin commit==**
   Ovoz: «Xulosa: AI javobi uch qismdan o'qiladi: fayllar, chetga chiqish va tekshiruv. Fayllarni diff bilan solishtirasiz, chetga chiqish sababini baholaysiz, tekshiruvni o'zingiz yurgizasiz. Hammasi to'g'ri bo'lsa, commit qilasiz. Lekin bu bosqichda yana bitta yashirin muammo bor, uni keyingi ekranda ko'ramiz.»
- Manba: `orderbot-ai/p1/00-ai-javobi.md`, `p1/diff-stat.txt`, `p1/02-seed.txt`, `p1/05-psql.txt`.

## 11 · Oraliq vaziyat: ombor kamaydi, buyurtma yo'q  ← `Lesson`
- Kicker: `3-bosqich · ichida` · Sarlavha: **Katalog bazada, buyurtma xotirada: restartdan keyin buyurtma yo'qoldi, ombor esa kamayib qoldi**
- Sahna: ikki ustun — chapda bot oqimi (1-jarayon: buyurtma #1 · Klaviatura × 1 · Kolonka × 2; restart → `/orders` «Hozircha buyurtma yo'q»); o'ngda psql `SELECT * FROM products ORDER BY id;` (Klaviatura **7**, Kolonka **8**, qizil) ↔ seed qiymatlari (8, 10).
1. **1-bosqichdan keyin bot ishlaydi: ==katalog bazadan, buyurtma esa hali xotirada==**
   Ovoz: «Birinchi bosqich tayyor, testlar toza. Endi bot oqimini restart bilan sinaymiz. Aziza buyurtma berdi: bitta klaviatura va ikkita kolonka. Ombor bazada kamaydi. Buyurtmaning o'zi esa hali xotiradagi massivda, chunki uni to'rtinchi bosqichda ko'chiramiz.» · chap ustun
2. **Restart: ==buyurtma yo'qoldi, ombor esa 7 va 8 da qoldi==**
   Ovoz: «Serverni qayta ishga tushiramiz. Admin buyurtmalarni ochadi: hozircha buyurtma yo'q. PostgreSQL terminalida esa klaviatura yetti, kolonka sakkiz. Ya'ni mahsulot ombordan ketgan, lekin uni kim olgani haqida hech qanday yozuv yo'q. Bu xato xabari bermaydigan, eng yomon turdagi buzilish.» · o'ng ustun
3. **Sabab: ==bir ish ikki joyda yozildi== — biri doimiy, biri vaqtinchalik**
   Ovoz: «Sababi: bitta sotuv ikki joyga yozildi. Ombordan ayirish bazaga, buyurtma esa xotiraga. Restart xotirani o'chirdi, bazaga tegmadi. Tekshiruv buni ko'rsatdi, chunki biz faqat build emas, restart bilan butun oqimni sinadik.»
4. **Xulosa: ==oraliq bosqichni prodga chiqarmang==; har bosqichdan keyin restart bilan sinang**
   Ovoz: «Xulosa: bosqichma-bosqich ko'chirishda oraliq vaziyat bo'ladi, unda ma'lumot ikki joyda yashaydi. Oraliq bosqichni ishlab turgan botga chiqarmang, avval hamma bosqichni tugating. Har bosqichdan keyin restart bilan to'liq oqimni sinang: buni build ham, AI'ning o'z testlari ham ushlamaydi.»
- Manba: `orderbot-ai/p1/04-senariy.txt` (restartdan keyin «Hozircha buyurtma yo'q»), `p1/05-psql.txt` (Klaviatura 7, Kolonka 8), `p1/06-mentor-tekshiruvi.md`.

## 12 · Amaliyot 2 — 1-prompt o'z AI'ingiz bilan  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **Ulanish, migratsiya va katalog — o'z AI'ingiz bilan, keyin o'zingiz tekshirasiz** · `tableAt: 3`
1. **Endi siz: ==1-promptni o'z AI'ingizga== berasiz va natijani tekshirasiz**
   Ovoz: «Endi navbat sizga. Birinchi promptni o'z AI'ingizga berasiz: Antigravity, Claude Code yoki boshqasi. AI javobi bizdagidan boshqacha bo'ladi, bu normal. Tekshiruv bir xil. Yigirma daqiqa ketadi.»
2. **1–2-qadam: baza, prompt, ==AI javobini uch qismga ajratib o'qish==**
   Ovoz: «Birinchi qadamda PostgreSQL terminalida shop bazasini yaratasiz va env faylga database url yozasiz. Ikkinchisida promptni nusxalab AI'ga berasiz, javobini o'qiysiz: fayllar, chetga chiqish va tekshirish buyruqlari.»
3. **3–4-qadam: seed ikki marta va `\d products`; isbot — ==ikkinchi seed'dan keyingi mahsulotlar soni==**
   Ovoz: «Uchinchi qadamda seed'ni ikki marta yurgizasiz va backslash d products bilan CHECK borligini ko'rasiz. To'rtinchisida stock'ni minus bir qilib ko'rasiz: xato chiqishi kerak. Isbot maydoniga select count'dan chiqqan sonni yozing. Hammasi to'g'ri bo'lsa, commit qiling.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz katalogni PostgreSQL'dan o'qiydi va siz AI ishini o'zingiz tekshirgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Baza — PostgreSQL terminalida yarating, manzilini `.env` ga yozing | `psql -U postgres` · `CREATE DATABASE shop;` · `DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/shop` | `CREATE DATABASE` |
  | 2 | Prompt — 1-promptni AI'ga bering, javobni uch qismga ajratib o'qing: fayllar · chetga chiqish · tekshirish | `git diff --stat` | ro'yxat diff bilan mos |
  | 3 | Seed va jadval | `npm run seed` ×2 · `psql -U postgres -d shop` · `\d products` · `SELECT * FROM migrations;` | 2-marta 0 qo'shildi · `CHECK (stock >= 0)` · 1 qator |
  | 4 | Qoida va commit | `UPDATE products SET stock = -1 WHERE id = 1;` · `SELECT count(*) FROM products;` · `git add -A && git commit -m "1-bosqich: katalog"` | `violates check constraint` · `6` |
- Isbot: «`SELECT count(*) FROM products;` natijasi» · placeholder: «natijadagi sonni yozing» · KOD: `/^\s*6\s*$/` · xato: «Seed ikki marta yurdi — takror qo'shmaganmi? 12 chiqsa, seed takrorlanmaslik shartini AI bajarmagan: unga shu haqida yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `count` = 12 | seed takror qo'shdi — AI'ga: «seed ikkinchi marta yurganda takror qo'shmasin, `ON CONFLICT (name) DO NOTHING`» |
  | `UPDATE` xatosiz o'tdi | CHECK yo'q — `\d products`; AI'ga: «stock uchun bazada CHECK (stock >= 0) bo'lsin, yangi migratsiya bilan» |
  | `relation "products" does not exist` | migratsiya yurmagan — serverni bir marta ishga tushiring yoki `npm run migration:run` |
  | `Unable to connect to the database. Retrying (1)...` va `error: database "shop" does not exist` | 1-qadam: `CREATE DATABASE shop;` |
  | `Unable to connect to the database. Retrying (1)...` va `error: password authentication failed for user "postgres"` | `.env` dagi parol — PostgreSQL-1 da qo'ygan parolingiz |
  | `npm error Missing script: "seed"` | AI seed'ni boshqa nom bilan yozgan yoki migratsiya ichiga qo'ygan — javobidan qidiring (2-tajribada shunday bo'ldi) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `orderbot-ai/p1/*`, `orderbot-ai2/p1/06-mentor-tekshiruvi.md` (seed yo'q), `orderbot-out/06-check-xato.txt`; parol/baza/seed xatolari — `12-k4-xatolar.txt`, `12-k4-seed-yoq.txt` (OrderBotNest, haqiqiy).

---

## 13 · `BIGINT`: Telegram id va matn  ← `Lesson`
- Kicker: `4-bosqich · foydalanuvchi, state, savat · ichida` · Sarlavha: **Telegram id `INTEGER`ga sig'maydi — `BIGINT` kerak; lekin `BIGINT` kodga matn bo'lib keladi**
- Sahna: psql `SELECT telegram_id, pg_typeof(telegram_id), telegram_id > 2147483647 AS int4_sigmaydi FROM users;` → terminal `node`: `typeof: string`, `=== 5123456789 → false`, `Number(v) === 5123456789 → true` → ikki yechim kartasi (string · transformer).
1. **Azizaning id'si 5 123 456 789 — ==`INTEGER` chegarasidan katta==, shuning uchun `BIGINT`**
   Ovoz: «Ikkinchi bosqich: foydalanuvchilar. Birinchi tuzoq id'da. Telegram id ikki milliard bir yuz qirq yetti milliondan katta bo'lishi mumkin, bu integer'ning chegarasi. Azizaning id'si besh milliarddan oshadi. Shuning uchun ustun big int bo'ladi. Ikkala AI ham big int tanladi.» · psql: `5123456789 | bigint | t`
2. **Lekin node-pg va TypeORM `BIGINT` ustunini kodga ==matn qilib qaytaradi==: `"5123456789"`**
   Ovoz: «Ikkinchi tuzoq ko'rinmaydi. Big int JavaScript'ning oddiy sonidan katta bo'lishi mumkin, shuning uchun pg kutubxonasi uni matn qilib qaytaradi. TypeORM ham xuddi shunday. Matn bilan son uch tenglik bilan solishtirilsa, false chiqadi. Siz bilgan Mongoose'da bu son edi va true chiqardi.» · terminal: `typeof: string` · `=== 5123456789 → false` · `.mk-pair`: `Mongoose'da: typeof: number · === 5123456789 → true`
3. **Ikki to'g'ri yo'l: ==ustun turi `string`== yoki ==transformer bilan `number`==**
   Ovoz: «Ikki to'g'ri yo'l bor. Birinchisi: entity'da telegram id'ni string deb yozish va har joyda matn bilan ishlash. Ikkinchisi: transformer bilan bazadan kelganda songa aylantirish. Telegram id ellik ikki bitdan oshmaydi, JavaScript soni uni sig'diradi. Bizdagi tayyor kod birinchi yo'lni, AI ikkinchisini tanladi. Ikkalasi ishlaydi.» · ikki karta
4. **Xulosa: entity'dagi ==id turini va solishtirishni== diffdan albatta tekshiring**
   Ovoz: «Xulosa: Telegram id uchun big int, va kodda u matnmi yoki sonmi, buni bilib turing. AI kodini ko'rganda ikki joyga qarang: migratsiyada ustun turi big int'mi, entity'da qaysi tur va qayerda uch tenglik bilan solishtirilgan.»
- Manba: `orderbot-out/05-psql-natija.txt` (`pg_typeof`, `int4_sigmaydi`), `tgpg-out/07-bigint-matn.txt` (node-pg), `tgpg-out/14-typeorm-bigint.txt` (TypeORM), `orderbot-ai/p2/00-ai-javobi.md` (transformer), `order-bot` `user.entity.ts` (string), `orderbot-ai2/p1/06` (Haiku ham `BIGINT`), `12-k5-mongoose.txt` (Mongoose: `number`, `true`).

## 14 · Bitta so'rov: `ON CONFLICT` — ikki marta bosish  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **Mijoz tugmani ikki marta tez bosdi: avval qidirib keyin qo'shish ikki qator ochishi mumkin — `ON CONFLICT` bitta so'rovda hal qiladi**
- Sahna: SQL log (TypeORM `logging`) — `INSERT INTO cart_items … ON CONFLICT (user_id, product_id) DO UPDATE SET qty = cart_items.qty + 1 RETURNING qty`; chizma: ikki bosish → bitta qator, `qty` 1 → 2; `.mk-pair`: `Mongoose'da: findOneAndUpdate(…, { $inc: { qty: 1 } }, { upsert: true })` — unique index'siz bir vaqtda ikki chaqiruv → 2 hujjat; index bilan → 1.
1. **Savatda bitta mahsulot — bitta qator: ==`UNIQUE (user_id, product_id)`==**
   Ovoz: «Uchinchi bosqich: savat. Bitta mijozda bitta mahsulot faqat bitta qator bo'ladi, qayta qo'shilsa qty bittaga oshadi. Bu qoidani kod ham, baza ham ushlaydi: cart items jadvalida user id va product id juftligi UNIQUE.»
2. **Avval qidirib keyin qo'shish — ==ikki tez bosishda ikkalasi «yo'q» ko'radi==**
   Ovoz: «Oddiy yo'l: avval select bilan qidirish, yo'q bo'lsa insert. Lekin mijoz tugmani ikki marta tez bossa, ikki so'rov bir vaqtda qidiradi va ikkalasi ham yo'q deb ko'radi. Biz yigirma marta sinadik: o'n to'qqiz marta savatda ikki qator paydo bo'ldi. UNIQUE bo'lsa, ikkinchisi duplicate key xatosini oladi.» · terminal: `2 qator chiqqan urinishlar: 19/20` · `ERROR: duplicate key value violates unique constraint "c2_user_id_product_id_key"`
3. **`ON CONFLICT … DO UPDATE` — ==bitta so'rov==: yo'q bo'lsa qo'shadi, bor bo'lsa oshiradi**
   Ovoz: «Yechim bitta so'rov: insert on conflict do update. Qator yo'q bo'lsa qo'shiladi, bor bo'lsa qty bittaga oshadi. Baza buni o'zi navbatga qo'yadi. Siz bilgan Mongoose'da bu upsert edi, lekin u ham unique index bo'lmasa ikki hujjat ochdi. Ikkala AI ham to'g'ri yo'lni tanladi.» · SQL log
4. **Xulosa: ==qidirib qo'shish== ko'rsangiz, `UNIQUE` va `ON CONFLICT` borligini tekshiring**
   Ovoz: «Xulosa: avval qidirib keyin qo'shish bir mijozda ishlaydi, lekin tez bosishda buziladi. AI kodida shunday joy ko'rsangiz, ikki narsani tekshiring: jadvalda UNIQUE qoidasi bormi va so'rov on conflict bilanmi. Foydalanuvchida ham xuddi shu qoida: start ikki marta bosilsa ham bitta qator.»
- Manba: `orderbot-out/07-sql-log.txt` (`ON CONFLICT … RETURNING qty -- PARAMETERS: [2,1]`), `12-k6-ikki-bosish.txt` (o'zimiz: UNIQUE'siz 19/20 urinishda 2 qator; UNIQUE bilan `duplicate key`; `ON CONFLICT` → `RETURNING qty: 1, 2`, 1 qator), `12-k5-mongoose.txt` (upsert: index'siz 2 hujjat, index bilan 1), `orderbot-ai/p3/00-ai-javobi.md` (AI o'z sinovi), `orderbot-ai/p2/00-ai-javobi.md` (users `ON CONFLICT DO NOTHING`).

## 15 · State bazada: telefon kutish restartdan o'tadi  ← `Lesson`
- Kicker: `4-bosqich · foydalanuvchi, state, savat` · Sarlavha: **`WAITING_PHONE` bazada: bot telefon so'radi, server qayta ishga tushdi — raqam kelganda bot uni taniydi**
- Sahna: bot oqimi (`orderbot-ai/p3/04b-state-restart.txt`): Bobur → Sichqoncha → «Buyurtma berish» → «telefon raqamingizni yozing» → RESTART → `+998935554433` → «Buyurtma #1 qabul qilindi!»; ostida psql `SELECT telegram_id, name, phone, state FROM users;` → `5123456789 | Aziza |  | WAITING_PHONE` (telefon so'ralgan payt, `12-k3-state-psql.txt`).
1. **State — ==bot mijoz haqida eslab qolgan bosqich==: `IDLE` yoki `WAITING_PHONE`**
   Ovoz: «State'ni ko'ramiz. State bot foydalanuvchi haqida eslab qolgan ma'lumot: qaysi qadamda turgani. Bizning botda ikkita: IDLE, ya'ni oddiy, va WAITING PHONE, ya'ni telefon kutilmoqda. Mijoz buyurtma berishni bosganda state WAITING PHONE bo'ladi.»
2. **Restartdan keyin raqam keldi — ==bot uni telefon deb tanidi==, «Tushunmadim» demadi**
   Ovoz: «Bobur buyurtma berishni bosdi, bot telefon so'radi. Shu payt server qayta ishga tushdi. Bobur raqamini yozdi. State bazada bo'lgani uchun bot raqamni telefon deb tanidi va buyurtmani yaratdi. State xotirada bo'lganda bot tushunmadim degan bo'lardi.»
3. **Ikkinchi va uchinchi bosqichdan keyin ==state ham, savat ham== restartdan o'tdi**
   Ovoz: «Bu natija uchinchi bosqichdan keyin chiqdi. Ikkinchi bosqichdan keyin bot telefonni tanigan, lekin savat bo'sh edi, chunki savat hali xotirada edi. Bu yana oraliq vaziyat. Uchinchi bosqichdan keyin savat ham bazada, buyurtma raqami bir bo'lib yaratildi.»
4. **Xulosa: state'ni sinash uchun ==restartni suhbat o'rtasida== qiling**
   Ovoz: «Xulosa: state'ni oddiy sinov ushlamaydi, chunki bitta jarayonda hamma narsa ishlaydi. Restartni suhbat o'rtasida qiling: bot savol berdi, server qayta yondi, keyin javob yozing. Bot davom etsa, state bazada.»
- Manba: `orderbot-ai/p2/04b-state-restart.txt` («Savat bo'sh»), `p3/04b-state-restart.txt` («Buyurtma #1 qabul qilindi!»), `order-bot` `user.entity.ts`.

## 16 · Tekshiruv 3 — `===` bilan solishtirish  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Admin tekshiruvi xom so'rov natijasi bilan yozilgan: `rows[0].telegram_id !== 111`. Jasur (id 111) `/orders` bosdi. Nima bo'ladi?**
- Material (`above`): kod `const rows = await this.orders.raw('SELECT telegram_id FROM users WHERE telegram_id = $1', [ctx.from.id]); // raw = this.ds.query` · `if (rows[0].telegram_id !== 111) return ctx.reply(texts.adminOnly);` · terminal: `npx tsc --noEmit` — xato yo'q.
- Ovoz: «Big int'ni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin tekshiruvi xom so'rov bilan yozilgan: bazadan telegram id olinadi va bir yuz o'n birga teng emasmi deb solishtiriladi. TypeScript xato bermadi. Jasurning id'si haqiqatan bir yuz o'n bir. U orders bosdi. Nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 Jasur buyurtmalarni ko'radi — id 111 to'g'ri · 2 Server ishga tushmaydi — tsc turni rad etadi · 3 Baza xato beradi — id matn bilan so'raldi · 4 «faqat admin uchun» chiqadi — `"111" !== 111`
- To'g'ri (ovoz): «To'g'ri. Bazadan telegram id matn bo'lib keladi, bir yuz o'n bir qo'shtirnoq ichida. Matn bilan son hech qachon teng emas, shuning uchun Jasur admin bo'lmay qoladi. Xato xabari yo'q, bot faqat admin uchun deydi. Demak, big int ustunini solishtirishdan oldin turini bir xil qiling: matn bilan matn yoki son bilan son.» · qisqa: «`"111" !== 111` → `true`: admin tekshiruvi o'tmaydi, xato yo'q.»
- Isbot (`after`): bot oqimi: `Jasur (id 111, ADMIN_TELEGRAM_IDS=111): /orders → bot: Bu buyruq faqat admin uchun.` · terminal: `v === 5123456789 → false` · `Number(v) === 5123456789 → true`.
- Demak: «`BIGINT` ustunini solishtirishdan oldin ikki tomonning turi bir xil bo'lsin.»
- Xato izohlari: 1 — «Bazadan matn keladi: `"111"` — son emas.» · 2 — «Server ishlaydi va `tsc` ham xato bermaydi: `raw` (ichida `ds.query`) natijasi `any`. Entity'dagi `string` bilan solishtirilganda esa `tsc` TS2367 beradi — sinadik.» · 3 — «Baza so'rovni bajardi; solishtirish JavaScript'da.»
- Maslahat: «Bazadan `telegram_id` qaysi turda keladi? `===` turi har xil qiymatlarga nima deydi?»
- Manba: `orderbot-out/12-k7-tenglik.txt` (xom so'rov: tsc xatosiz, bot «faqat admin uchun»; entity `string`: `error TS2367: This comparison appears to be unintentional…`), `tgpg-out/07-bigint-matn.txt`.

## 17 · Amaliyot 3 — 2- va 3-prompt  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 25 daqiqa` · Sarlavha: **Foydalanuvchi, state va savat — ikki prompt, har biridan keyin restart** · `tableAt: 3`
1. **Endi siz: ==ikki prompt, ikki commit== — foydalanuvchi va state, keyin savat**
   Ovoz: «Endi ikkita bosqichni o'zingiz qilasiz: foydalanuvchi va state, keyin savat. Har promptdan keyin tekshiruv va commit. Yigirma besh daqiqa ketadi.»
2. **1–2-qadam: 2-prompt, javobni o'qish, ==`\d users` — id turi `bigint`==**
   Ovoz: «Birinchi qadamda ikkinchi promptni AI'ga berasiz va javobni uch qismga ajratib o'qiysiz. Ikkinchisida backslash d users bilan telegram id turini ko'rasiz: big int bo'lishi kerak. Entity'da tur qanday ekaniga ham qarang.»
3. **3–4-qadam: 3-prompt, keyin ==suhbat o'rtasida restart==; isbot — `state` ustuni**
   Ovoz: «Uchinchi qadamda uchinchi promptni berasiz. To'rtinchisida savatga mahsulot qo'shib, buyurtma berishni bosasiz, bot telefon so'raydi. Shu payt PostgreSQL terminalida users jadvalidan state'ni ko'ring va isbot maydoniga yozing. Keyin restart qilib raqam yuboring: bot buyurtma yaratishi kerak.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz foydalanuvchini, state'ni va savatni bazada saqlaydi va siz buni restart bilan isbotlagansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | 2-prompt — AI'ga bering, javobni uch qismga ajratib o'qing | `git diff --stat` | yangi migratsiya, birinchisi o'zgarmagan |
  | 2 | `users` — /start ni ikki marta bosing, tekshiring, commit qiling | `\d users` · `SELECT telegram_id, count(*) FROM users GROUP BY 1;` | `bigint` · har id 1 marta |
  | 3 | 3-prompt — AI'ga bering; Telegram'da bitta mahsulotni 3 marta bosing; tekshirib commit qiling | `\d cart_items` · `SELECT * FROM cart_items;` | `UNIQUE` · bitta qator, `qty` 3 |
  | 4 | Restart — «✅ Buyurtma berish» bosing; telefon so'ralganda state'ni ko'ring; serverni qayta yoqib raqam yuboring | `SELECT state FROM users WHERE telegram_id = <id>;` · `Ctrl+C` · `npm run start:dev` | `WAITING_PHONE` · «Buyurtma #… qabul qilindi!» |
- Isbot: «Telefon so'ralgan paytdagi `state` qiymati» · placeholder: «psql natijasini yozing» · KOD: `/WAITING_PHONE/i` · xato: «Buyurtma berishni bosgandan keyin, raqam yozishdan oldin tekshiring. `IDLE` chiqsa — state bazaga yozilmagan: AI'ga state'ni bazada saqlash shartini qayta yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `telegram_id` — `integer` | AI turni noto'g'ri tanladi — yangi migratsiya: `ALTER COLUMN … TYPE BIGINT`; katta id'da terminalda `value "5123456789" is out of range for type integer`, bot «Tushunmadim» deydi |
  | `/start` ikki marta — ikki qator | `UNIQUE` yo'q — AI'ga: «telegram_id takrorlanmasin, bazada ham» |
  | `duplicate key value violates unique constraint` | avval qidirmasdan qo'shilyapti — `ON CONFLICT` (14-ekran) |
  | Restartdan keyin «Tushunmadim» | state bazaga yozilmagan yoki o'qilmayapti — `SELECT state …` |
  | Restartdan keyin «Savat bo'sh» | savat hali xotirada — 3-prompt bajarilganmi |
  | Admin `/orders` — «faqat admin uchun» | `"111" === 111` (16-ekran) — tur |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `orderbot-ai/p2/*`, `p3/*`; `orderbot-out/12-k4-integer.txt` (OrderBotNest, ustun `INTEGER`: id 111 ✓, 5123456789 → `out of range`, bot «Tushunmadim»), `tgpg-out/08-unique-takror.txt` (duplicate key).

---

## 18 · Buyurtma — bitta tranzaksiya  ← `Lesson`
- Kicker: `5-bosqich · buyurtma · ichida` · Sarlavha: **Buyurtma uch ish: ombordan ayirish, buyurtma yozish, savatni tozalash — yo hammasi, yo hech biri**
- Sahna: SQL log (`orderbot-out/07-sql-log.txt` 33–41): `START TRANSACTION` → `SELECT … FOR UPDATE` → `UPDATE products …` ×2 → `INSERT INTO "orders"` → `INSERT INTO "order_items"` → `DELETE FROM "cart_items"` → `COMMIT`; yonida PG-2 eslatma kartasi: `BEGIN … COMMIT`, `shop=*#`.
1. **Buyurtma ==uch jadvalga tegadi==: `products`, `orders` va `cart_items`**
   Ovoz: «To'rtinchi bosqich: buyurtma. Bitta buyurtma uch jadvalga tegadi: products'dan ombor ayiriladi, orders va order items'ga buyurtma yoziladi, cart items'dan savat o'chiriladi. PostgreSQL-2 da ikki jadval bitta ish ekranini ko'rgansiz, bu o'shaning o'zi, faqat kod ichida.»
2. **TypeORM `transaction` — ==`START TRANSACTION` … `COMMIT`== — SQL logda ko'rinadi**
   Ovoz: «Kodda bu dataSource transaction. Ichidagi hamma so'rov bitta tranzaksiyada yuradi. SQL logni yoqsangiz, uning o'zini ko'rasiz: start transaction, ikkita update, ikkita insert, delete va commit. Bu PostgreSQL terminalidagi begin va commit'ning aynan o'zi.» · SQL log
3. **Birortasi yiqilsa — ==`ROLLBACK`==: ombor, buyurtma va savat o'zgarmaydi**
   Ovoz: «Ichida bitta so'rov yiqilsa, TypeORM rollback qiladi. Ombor ham, buyurtma ham, savat ham o'zgarmaydi. Biz buni ataylab sinadik: order items'ga yozishda xato beradigan trigger qo'ydik. Bot buyurtma berilmadi dedi, ombor sakkiz va o'nda, buyurtma nol, savat joyida qoldi.»
4. **Xulosa: bitta ishning ==hamma so'rovi bitta tranzaksiyada==; SQL log — isbot**
   Ovoz: «Xulosa: bir nechta jadvalga tegadigan bitta ish bitta tranzaksiyada bo'ladi. AI tranzaksiya qildim desa, SQL logni yoqib ko'ring: start transaction va commit orasida hamma so'rov bormi. Bu tekshiruv bir daqiqa oladi.»
- Manba: `orderbot-out/07-sql-log.txt`, `orderbot-out/12-k8-trigger-rollback.txt` (oldin = keyin: Klaviatura 8, Kolonka 10, orders 0, cart_items 2; trigger olingach #2 qabul qilindi), `orderbot-ai/p4/00-ai-javobi.md` (AI ham shunday sinagan).

## 19 · Ikki mijoz, bitta Planshet: qulf  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Omborda bitta Planshet, ikki mijoz bir vaqtda «Buyurtma berish» bosdi: bittasiga sotiladi, ikkinchisi aniq xabar oladi**
- Sahna: bot oqimi (race) — `ombor oldin: Planshet 1` → Aziza va Bobur bir vaqtda `checkout` → Aziza «Buyurtma #… qabul qilindi!» · Bobur «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi» → `ombor keyin: 0`; chizma: ikki tranzaksiya, bitta qator, qulf (B kutadi).
1. **Sinov: omborda ==bitta Planshet qoldi, ikki tranzaksiya bir vaqtda== boshlanadi**
   Ovoz: «Endi eng og'ir sinov. Omborda bitta Planshet qoldi. Aziza va Bobur bir vaqtda buyurtma berishni bosadi. Ikki tranzaksiya bir vaqtda boshlanadi va ikkalasi ham Planshet qatoriga yetib boradi.»
2. **Birinchi tranzaksiya qatorni ==qulflaydi==, ikkinchisi u tugashini kutadi**
   Ovoz: «Birinchi tranzaksiya Planshet qatorini qulflaydi. Bizdagi kodda bu select for update, AI kodida update where stock katta yoki teng qty. Ikkinchi tranzaksiya shu qatorga yetganda kutadi. Birinchisi commit qilgach, ikkinchisi yangi qoldiqni ko'radi: nol.» · chizma
3. **Natija: ==bitta sotildi, ombor 0==, Bobur aniq xabar oldi, savati saqlandi**
   Ovoz: «Natija: Azizaga sotildi, ombor nol, manfiy emas. Bobur aniq xabar oldi: Planshet, omborda faqat nol ta qoldi. Uning tranzaksiyasi rollback bo'ldi, savati saqlanib qoldi. Biz bu sinovni o'zimizdagi kod va AI kodi bilan yurgizdik, natija bir xil.» · bot oqimi
4. **Xulosa: «ortiqcha sotilmasin» sharti ==faqat bir vaqtdagi ko'p mijoz sinovi bilan== tekshiriladi**
   Ovoz: «Xulosa: bitta mijoz bilan bu xato hech qachon ko'rinmaydi, faqat bir vaqtdagi ikki so'rov bilan. Ikki mijoz ham kam: tranzaksiya tez tugaydi va qulfsiz kod ham ko'pincha to'g'ri chiqadi. Shuning uchun smoke beshta mijozni uch raund yurgizadi. Qulf bo'lmasa nima bo'lishini keyingi ekranda ko'ramiz.»
- Manba: `orderbot-out/08-race-tgpg-done.txt` (o'zimizdagi kod), `orderbot-ai/p4/04c-race.txt` (AI kodi), `orderbot-ai2/p1/04c-race.txt` (Haiku kodi) — uchalasida 1 sotildi, ombor 0.

## 20 · Buzamiz: o'qib yozish — ikki marta sotildi  ← `Lesson`
- Kicker: `5-bosqich · buzamiz` · Sarlavha: **Qulfsiz «o'qi, tekshir, yoz»: hamma tranzaksiya qoldiq 1 ni ko'radi — bitta Planshet besh kishiga sotiladi, `CHECK` ham ushlamaydi**
- Sahna: buzuq kod (VS Code, `order.service.ts` 29–41, haqiqiy satr raqamlari) → race natijasi: `sotildi/ombor: 1/0  5/0  5/0  5/0  5/0` → tuzatilgan kod (`lock: { mode: 'pessimistic_write' }`) → race qayta: `1/0  1/0  1/0  1/0  1/0`; smoke: `✗ ortiqcha sotilmadi (sotildi/ombor): 4/0  5/0  5/0`.
  ```ts
  const p = await m.findOneBy(Product, { id: c.product.id });   ← qulfsiz o'qish
  if (p.stock < c.qty) throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);
  p.stock = p.stock - c.qty;
  await m.save(p);
  ```
- F-1120-02 (M52): 0-band — mentor tuzatilgan koddagi (`tgpg-done`, 29–38) `lock: { mode: 'pessimistic_write' }` ni o'zi bosadi → kod buzuq holatga o'tadi. Kod ostida kichik rasm (M51): ×5 mijoz → order.service (o'qish) → products · Planshet, javob «?» → 5/0 → 1/0; bo'laklar 1 (31-satr, qulfsiz o'qish) · 2 (36–37, yozish).
0. **Endi ==o'zingiz buzasiz==: kodda yonib turgan `lock` ustiga bosing**
   Ovoz: «Buyurtma ishlaydi, race sinovi ham toza. Endi ataylab buzamiz, chunki AI'lar ko'pincha aynan shunday yozadi. Buzishni o'zingiz qilasiz: order service'ning o'ttiz uchinchi satrida lock yonib turibdi, ustiga bosing: qulf olib tashlanadi.»
   Bosish: «**order.service.ts** 33-satridagi **`lock: { mode: 'pessimistic_write' }`** ustiga bosing — qulf olib tashlanadi, o'qish oddiy `findOneBy` bo'ladi.»
1. **Qulf yo'q: qatorni ==qulfsiz o'qiymiz==, qoldiqni kodda hisoblab, yangisini yozamiz**
   Ovoz: «Qulfni olib tashladingiz. Endi mahsulot oddiy find bilan o'qiladi, qoldiq yetadimi deb kodda tekshiriladi, yangi qoldiq hisoblanib save qilinadi. AI'lar ko'pincha aynan shunday yozadi, ko'rinishi to'g'ri.» · buzuq kod
2. **Besh tranzaksiya ==bir vaqtda «qoldiq 1» ni ko'radi== — hammasi tekshiruvdan o'tadi**
   Ovoz: «Besh mijoz bir vaqtda bosadi. Hamma tranzaksiya qoldiqni o'qiydi: bir. Hammasi yetadi deb hisoblaydi va nolni yozadi. Biz buni besh raund yurgizdik: to'rt raundda bitta Planshet besh kishiga sotildi. Birinchi raundda tasodifan bittaga, shuning uchun bir marta sinash yetmaydi.» · race natijasi
3. **`CHECK (stock >= 0)` ==ushlamaydi==: yozilgan qiymat 0, manfiy emas**
   Ovoz: «Baza qoidasi ham yordam bermaydi. Check stock katta yoki teng nol faqat manfiy qiymatni rad etadi. Har tranzaksiya nol yozdi, nol esa ruxsat etilgan. Ya'ni bu vaziyatda xato xabari yo'q, faqat bitta ortiqcha buyurtma bor.»
4. **Tuzatish ikki xil: ==qulf bilan o'qish== yoki ==bitta `UPDATE … WHERE`== — yana 1 sotildi**
   Ovoz: «Tuzatish ikki xil. Birinchisi: o'qishda qulf, find'ga lock pessimistic write qo'shiladi, ikkinchi tranzaksiya kutadi. Ikkinchisi: hisobni bazaga berish, update stock minus qty where stock katta yoki teng qty. Race qayta yurgizildi: besh raundda ham bitta sotildi, ombor nol. Demak, qoldiqni kodda hisoblab yozish qulfsiz ishlamaydi.» · tuzatilgan kod + race ✓
- Manba: `orderbot-out/09-race-buzuq.txt` (5 xaridor × 5 raund, `manba/orderbot-race5.cjs`), `10-smoke-buzuq.txt` (smoke ✗), `10-smoke-tgpg-done.txt` (✓); 2 xaridorli sinov buzuq variantni ushlamagani — `09` oxiri (SQL log: 2-chi `START` 1-chi `COMMIT`dan keyin).

## 21 · Tranzaksiya ichida xato: aborted  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **`CHECK` rad etgandan keyin o'sha tranzaksiyada yana so'rov: «current transaction is aborted» — PG-2 dagi `shop=!#` kod ichida**
- Sahna: terminal (TypeORM log, `orderbot-out/04a-aborted-tx-xato.txt`): `query failed: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [4,5]` · `error: new row for relation "products" violates check constraint "stock_nonneg"` · `query failed: SELECT … FROM "products" … -- PARAMETERS: [5]` · `error: current transaction is aborted, commands ignored until end of transaction block`; bot: «Buyurtma berilmadi: current transaction is aborted…»
1. **Bu xatoni ==biz o'zimiz qildik==: loyihani yozayotganda birinchi kod shunday edi**
   Ovoz: «Bu xatoni AI emas, biz o'zimiz qildik: tayyor loyihani yozayotganda birinchi kod shunday edi. Fikr to'g'ri ko'ringan: avval ayiramiz, check rad etsa, mahsulotni qayta o'qib, mijozga qancha qolganini aytamiz.»
2. **`CHECK` rad etdi — keyingi `SELECT` ==«transaction is aborted»== oldi**
   Ovoz: «Mijoz to'rtta Planshet so'radi, uchta bor edi. Update check'ga urildi. Keyin kod qoldiqni bilish uchun select qildi va xato oldi: current transaction is aborted. Mijozga esa tushunarsiz inglizcha xabar ketdi.» · terminal
3. **PostgreSQL qoidasi: tranzaksiyada xato chiqqandan keyin ==faqat `ROLLBACK` yordam beradi==**
   Ovoz: «Bu PostgreSQL-2 dagi undov belgili prompt'ning o'zi. Tranzaksiya ichida bitta xato bo'lsa, rollback'gacha hamma so'rov rad etiladi. Kodda ham shunday: xatodan keyin shu tranzaksiyada hech narsa so'rab bo'lmaydi.»
4. **Tuzatish: ==avval tekshirish, keyin yozish==; `CHECK` — oxirgi qo'riqchi**
   Ovoz: «Tuzatish: tekshiruvni update'dan oldinga oldik. Qatorni qulf bilan o'qiymiz, yetmasa xabarni o'sha yerda beramiz. Check esa oxirgi qo'riqchi bo'lib qoladi: kod xato qilsa ham ombor manfiy bo'lmaydi. Demak, tranzaksiya ichida xatoni ushlab, so'rovni davom ettirib bo'lmaydi.» · tuzatilgan kod (`order.service.ts`, tgpg-done)
- Manba: `orderbot-out/04a-aborted-tx-xato.txt` (aynan), `order-bot` `tgpg-done` `order.service.ts`.

## 22 · Tekshiruv 4 — qaysi satr ortiqcha sotadi  ← `LineCheck`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4 — qaysi satr xato?` · Sarlavha: **Bitta Planshet besh kishiga sotildi. Xato satrni toping**
- Shart (`task`): «Qoida: tranzaksiya ichida o'qilgan qoldiq boshqa tranzaksiya uni o'zgartirmasligi uchun qulflanadi — yoki hisob bitta `UPDATE … WHERE` ichida bo'ladi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. **O'sha satrni bosing.**»
- Ovoz (`q`): «Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Besh mijoz oxirgi Planshetni bir vaqtda oldi va besh buyurtma yaratildi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. O'sha satrni bosing.»
- Fayl: `order.service.ts` (Explorer faol), `place` bo'lagi 29–41 (buzuq nusxa, Prettier 80, M43): 29 `for (const c of cart) {` · **31 `const p = await m.findOneBy(Product, { id: c.product.id });` ← xato satr** · 32 `if (!p) throw …` · 33–35 `if (p.stock < c.qty) { throw … }` · 36 `p.stock = p.stock - c.qty;` · 37 `await m.save(p);` · 38–40 `items.push(…)` · 41 `}` → `target` = 31-satr (bo'lakda 2-satr; 30-satrdagi izoh ekranda ko'rsatilmaydi, raqamlar haqiqiy).
- Tuzatilgan (`fixed`): `findOneBy(...)` → `findOne(Product, { where: { id }, lock: { mode: 'pessimistic_write' } })` (eski qizil, yangisi yashil, satr raqamlari haqiqiy — F-1103-01); `fixedExtra`: race — «1 sotildi, ombor 0».
- To'g'ri (ovoz, `ok`): «To'g'ri. Find one by qatorni qulfsiz o'qiydi, shuning uchun hamma tranzaksiya bir xil qoldiqni ko'radi. Tekshiruv va hisob to'g'ri, lekin ular eski qiymat ustida ishlaydi. Ekranda tuzatilgan kod: lock pessimistic write, race'da bitta sotildi. Demak, ikki mijoz xatosida avval qoldiq qayerda o'qilganini qidiring.»
- Qisqa (`okShort`): «`findOneBy` — qulfsiz o'qish: hamma tranzaksiya qoldiq 1 ni ko'radi. `lock: pessimistic_write` bilan qolganlari navbat kutadi.»
- Maslahat (`hint`): «Tekshiruv satri to'g'ri hisoblaydi — lekin qaysi qiymat ustida? O'sha qiymat qaysi satrda va qanday o'qilgan?»
- Manba: `orderbot-out/09-race-buzuq.txt`, buzuq nusxa (scratchpad `buzuq/`, qurishda qayta yasaladi: `tgpg-done` + 31–37-satr).

## 23 · Amaliyot 4 — 4-prompt va ko'p mijoz sinovi  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 25 daqiqa` · Sarlavha: **Buyurtma tranzaksiyada — va besh mijoz oxirgi mahsulotni oladi** · `tableAt: 3`
1. **Oxirgi bosqich: ==4-prompt==, SQL log va ko'p mijoz sinovi**
   Ovoz: «Oxirgi bosqich: buyurtmalarni bazaga ko'chirasiz. Keyin uchta tekshiruv: SQL logda tranzaksiya, ko'p mijoz sinovi va bekor qilish. Yigirma besh daqiqa ketadi.»
2. **1–2-qadam: 4-prompt, javob, ==SQL logda `START TRANSACTION` … `COMMIT`==**
   Ovoz: «Birinchi qadamda to'rtinchi promptni AI'ga berib, javobni uch qismga ajratib o'qiysiz. Ikkinchisida env'da db logging true qilib, bitta buyurtma berasiz va terminalda start transaction va commit orasidagi so'rovlarni ko'rasiz.»
3. **3–4-qadam: ==ko'p mijoz sinovi== va bekor qilish; isbot — ikkinchi mijozga kelgan xabar**
   Ovoz: «Uchinchi qadamda smoke skriptini race rejimida yurgizasiz: besh mijoz bitta Planshetni bir vaqtda oladi. To'rtinchisida admin sifatida buyurtmani ikki marta bekor qilasiz: ombor bir marta qaytishi kerak. Isbot maydoniga ikkinchi mijozga kelgan xabarni yozing. Hammasi to'g'ri bo'lsa, commit.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingizning hamma ma'lumoti PostgreSQL'da va ortiqcha sotilmasligini o'zingiz isbotlagansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | 4-prompt — AI'ga bering, javobni o'qing, yangi jadvallarni ko'ring | `git diff --stat` · `\d orders` · `\d order_items` | yangi migratsiya · `texts.ts`/`keyboards.ts` o'zgarmagan |
  | 2 | SQL log — `.env` ga qo'shing (AI boshqa nom bergan bo'lsa — javobidan), Telegram'da buyurtma bering | `DB_LOGGING=true` | `START TRANSACTION` … `COMMIT` |
  | 3 | Besh mijoz | `npm run smoke -- race` (vaqtinchalik bazada, sizning bazangiz o'zgarmaydi) | `✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0` |
  | 4 | Bekor — admin sifatida /orders da «❌ Bekor» ni ikki marta bosing, qoldiqni ko'ring, commit | `SELECT stock FROM products WHERE name = 'Planshet';` | 1-chi «Bekor qilingan», 2-chi «allaqachon bekor qilingan» · `1` |
- Isbot: «Ikkinchi mijozga kelgan xabar» · placeholder: «smoke natijasidan nusxalang» · KOD: `/omborda\s+faqat\s+0\s+ta/i` · xato: «Ikkalasiga ham "qabul qilindi" chiqdimi? Unda qulf yo'q — 20-ekran: `place` ichida qoldiq qanday o'qilganini qarang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `✗ ortiqcha sotilmadi` (masalan `5/0`) | qulfsiz o'qish (20, 22-ekran) — AI'ga: «qatorni FOR UPDATE bilan qulfla yoki UPDATE … WHERE stock >= qty» |
  | `current transaction is aborted` xatosi | xatodan keyin tranzaksiyada so'rov (21-ekran) — tekshiruv `UPDATE`dan oldin |
  | Bekor 2 marta — ombor 2 ga oshdi | bekor qilishda buyurtma qatori qulflanmagan yoki status tekshirilmagan — AI'ga shu haqida |
  | SQL logda `START TRANSACTION` yo'q | so'rovlar tranzaksiyasiz — `dataSource.transaction` |
  | `smoke` — `Missing script` | AI `package.json` dagi `smoke` qatorini o'chirgan — `git checkout tgpg-start -- scripts/smoke.js` va qatorni qaytaring |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `orderbot-ai/p4/*`, `orderbot-out/07`, `08`, `04a`, `10-smoke-*.txt`, `11-clone-smoke-*.txt`.

## 24 · AI natijasini qabul qilish: beshta tekshiruv  ← `Lesson`
- Kicker: `5-bosqich · xulosa` · Sarlavha: **Har bosqichdan keyin beshta tekshiruv: diff, build, restart, psql va ko'p mijoz**
- Sahna: besh band kartasi galma-gal (har biri — shu darsdagi haqiqiy topilma bilan): 1 diff — 1145 qator (6-ekran) · 2 build — `tsc`, `nest build` · 3 restart — oraliq vaziyat (11-ekran), state (15-ekran), `npm run smoke -- restart` · 4 psql — `\d`, CHECK, `bigint` (9, 13-ekran) · 5 ko'p mijoz — `npm run smoke -- race` (19–20-ekran; ikki marta bekor xatosi `tgpg-done` da topildi va tuzatildi); pastda «AI o'zi aytmagan, tekshiruv topgan» ro'yxati.
1. **Birinchi ikki tekshiruv: ==diff hajmi va build== — so'ralgan ish va toza kompilyatsiya**
   Ovoz: «To'rt bosqichni o'tdingiz. Endi tekshiruvlarni bitta ro'yxatga yig'amiz, chunki ular har bosqichda bir xil. Birinchisi diff: o'zgarish hajmi so'ralgan bosqichga tengmi. Ikkinchisi build: loyiha xatosiz kompilyatsiya bo'ladimi.»
2. **Uchinchi va to'rtinchi: ==restart va PostgreSQL terminali== — ma'lumot qayerda yashaydi**
   Ovoz: «Uchinchisi restart: suhbat o'rtasida serverni qayta yoqing va nima qolganini ko'ring. Oraliq vaziyat va state faqat shu bilan ko'rinadi. To'rtinchisi PostgreSQL terminali: backslash d bilan ustun turlari va qoidalar, select bilan haqiqiy qatorlar.»
3. **Beshinchi: ==bir vaqtdagi ko'p mijoz== — smoke bizning kodimizda ham xato topdi**
   Ovoz: «Beshinchisi bir vaqtdagi ko'p mijoz: buni smoke'ning race rejimi qiladi. U bizning o'z kodimizda ham xato topdi: admin bekorni bir vaqtda ikki marta bossa, ombor ikki marta qaytardi. Buyurtma qatori qulflanmagan edi, tuzatdik. Ikki AI'ning kodi bu sinovdan o'tdi.»
4. **Xulosa: AI'ning ==«sinadim» degan gapi — tekshiruv emas==; besh band — sizning qo'lingizda**
   Ovoz: «Xulosa: ikki tajribada AI kodni ko'pincha to'g'ri yozdi. Lekin so'ralmagan ishni qildi, oraliq vaziyatni sezmadi, bir marta haqiqiy Telegram'ga so'rov yubordi. Buni AI aytmadi, tekshiruv topdi. Besh band har bosqichda sizning qo'lingizda, keyin commit.»
- Manba: `orderbot-ai/XULOSA.md`, `orderbot-ai/p2/00-ai-javobi.md` (Telegram'ga 1 so'rov, 401), `orderbot-out/10-smoke-tgpg-done.txt` (birinchi yurgizish: `✗ ikki marta bekor — ombor bir marta qaytdi: 2`; `FOR UPDATE` dan keyin 5/5).

---

## 25 · Sinfga tayyorgarlik: m5-04 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m5-04 · «Bot eslab qoladi»` · Sarlavha: **O'quvchi darsi: bitta `users` jadvali, Neon va uch qatorli prompt — siz bilgan yo'lning kichik varianti**
- Sahna: ikki karta yonma-yon: «O'quvchi (m5-04)» — `TelegramBotNest`, `dars-03-done → dars-04-done`, Neon, `synchronize: true`, ustunlar `ism`, `holat`, Antigravity'ga 3 qatorli prompt · «Siz (bugun)» — OrderBotNest, 4 bosqich, migratsiya, `name`, `state`, besh tekshiruv; 3-segmentda «Siz qo'shasiz» jadvali; 4-segmentda «Darsdan oldin» uch band.
1. **m5-04 — 20 ekran: o'quvchi boti ==ismni eslab qoladi==, bitta `users` jadvali**
   Ovoz: «Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m5-04, yigirma ekran. O'quvchi boti ismni eslab qolishi kerak: bitta users jadvali, unda telegram id big int, ism va holat ustunlari, ya'ni name va state. Siz bugun beshta jadval bilan ishladingiz, bu uning kichik varianti.»
2. **Amaliyot: ==Neon va Antigravity==, `synchronize: true` — migratsiyasiz**
   Ovoz: «O'quvchi amaliyotida baza internetdagi Neon'da, ulanish manzili oxirida sslmode require turadi. Kodni Antigravity uch qatorli prompt bilan yozadi. Jadvalni synchronize true o'zi yaratadi, migratsiya yo'q. O'quv loyiha uchun bu yetadi, siz farqini bilasiz.»
3. **Siz qo'shasiz: ==`\d users` — `bigint`==, ikki marta `/start`, restart suhbat o'rtasida**
   Ovoz: «Darsga siz qo'shadigan narsalar: AI yozgandan keyin o'quvchi bilan backslash d users'ni ko'ring, telegram id big int bo'lsin. Start'ni ikki marta bosib, qator bitta qolganini ko'rsating. Restartni ism so'ralgan paytda qiling: bot davom etsa, state bazada.»
   | Siz qo'shasiz | Qayerda |
   |---|---|
   | `\d users` — `telegram_id bigint` | amaliyot, AI yozgandan keyin |
   | `/start` ikki marta — `SELECT count(*)` | amaliyot, Telegram tekshiruvi |
   | restart ism so'ralganda | amaliyot oxiri |
   | `sslmode=require` o'chirilmasin | Neon qadami |
   | AI javobidagi fayllar ro'yxati — `git diff --stat` | Antigravity qadami |
4. **Xulosa: darsdan oldin — ==Neon akkaunti, BotFather sinov boti==, `dars-03-done` ishga tushgan**
   Ovoz: «Xulosa: darsdan oldin uch narsani tekshiring: har o'quvchida Neon akkaunti ochiladi, BotFather'da sinov boti bor, va dars uchdagi bot ishlab turibdi. Vaqt bo'yicha taklif: amaliyotga eng ko'p vaqt bering, Neon va token bosqichida ko'pchilik xato qiladi.»
- Manba: `src/5-Modull/BotStatefulMemoryLesson.jsx` (`SCREEN_META` 20, `ScreenDbPractice`: Neon, 3 qatorli prompt, `synchronize: true`, `git checkout -f dars-04-done`), `TelegramBotNest` `dars-04-done` (`user.entity.ts`: `telegram_id bigint unique`, `ism`, `holat`; `database.module.ts`: `sslmode=require` → `ssl`).

## 26 · O'quvchilar xato qiladigan joylar va savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **To'rtta vaziyat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz**
- Sahna: 4 karta (vaziyat · xabar · yechim) segment bilan yonadi; pastda «O'quvchi so'rasa» — 5 ochiladigan karta (ovozsiz).
- Kartalar:
  | # | Vaziyat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Bot javob bermaydi | `Telegram ulanmadi: 401: Unauthorized` (server «ishlayapti») | token — BotFather |
  | 2 | Server yonmaydi | `DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing` | `.env` |
  | 3 | Restartdan keyin ism unutildi | xato yo'q, «Salom! Ismingiz nima?» | state bazaga yozilmayapti — `SELECT … FROM users` |
  | 4 | Katta id | `value "5123456789" is out of range for type integer` · yoki ikkinchi `/start`da `duplicate key` | `bigint`; avval qidirish yoki `ON CONFLICT` |
- O'quvchi so'rasa:
  - «AI yozdi, ishlayapti — yana nega tekshiramiz?» → bitta sinovda ko'rinmaydigan xato bor: restart va ikki marta bosish (11, 14-ekran).
  - «Nega `synchronize: true`, ishlab turgan loyihada ham shundaymi?» → yo'q: u ustunni ogohlantirmasdan o'chirishi mumkin; ishlab turgan loyihada migratsiya (9-ekran). Nest-2 mentor darsida buni haqiqiy ko'rgansiz.
  - «Telegram id raqam-ku, nega bazadan matn keldi?» → `bigint` JavaScript sonidan katta bo'lishi mumkin, kutubxona matn beradi (13-ekran).
  - «Neon o'rniga o'z kompyuterimdagi PostgreSQL bo'ladimi?» → ha, `DATABASE_URL` ni o'zgartirasiz; botni hostingga chiqarganda baza internetda bo'lishi kerak.
  - «Ikki kishi bir vaqtda yozsa, ismlar aralashadimi?» → yo'q, har qator `telegram_id` bo'yicha alohida.
1. **Darsda albatta chiqadigan to'rt vaziyat — ==ikkitasi xabar bilan, ikkitasi xabarsiz==**
   Ovoz: «Endi o'quvchi darsida albatta chiqadigan to'rtta vaziyatni ko'ramiz. Ikkitasi xabar bilan keladi, ikkitasi xabarsiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman.»
2. **401 va `DATABASE_URL topilmadi` — ==xabardan darhol taniladi==**
   Ovoz: «Birinchisi: server ishlayapti deydi, lekin bot javob bermaydi, terminalda to'rt yuz bir. Token noto'g'ri. Ikkinchisi: server umuman yonmaydi, database url topilmadi. Env fayli yo'q yoki manzil yozilmagan.» · 1–2-karta
3. **Ism unutildi va katta id — ==restart va `\d users` bilan== topiladi**
   Ovoz: «Uchinchisi xabarsiz: restartdan keyin bot ismni yana so'raydi. State bazaga yozilmayapti, users jadvaliga qarang. To'rtinchisi: terminalda out of range for type integer yoki ikkinchi start'da duplicate key. Ustun turi va avval qidirish bormi, shuni tekshiring.» · 3–4-karta
4. **Xulosa: o'quvchi «AI yozdi, ishlayapti» desa — ==restart va ikki marta `/start`== qildiring**
   Ovoz: «Xulosa va usul: o'quvchi AI yozdi, ishlayapti desa, ikki narsani o'zi qilsin: restartni suhbat o'rtasida va start'ni ikki marta. Javobni darhol aytmang, natijani birga ko'ring. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `tgpg-out/13-token-xato.txt`, `11-env-yoq.txt` (TelegramBotNest — haqiqiy), `06-integer-sigmadi.txt`, `08-unique-takror.txt`, `12-repo-holat-qayta-ishga.txt`.

## 27 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Bot savat va buyurtmani `Map`da saqlaydi. Server qayta ishga tushdi. Nima bo'ladi? | Savat va buyurtma yo'qoladi, xato chiqmaydi · Server xato beradi — Map ichi buzilgan · Hammasi joyida qoladi — Map diskka yoziladi · Faqat buyurtma qoladi — u alohida massivda | 1 | `Map` — jarayon xotirasida. | 3 |
  | 2 | AI'ga bir gapli prompt: «Katalogni ko'chir». U 22 fayl, 1145 qatorni o'zgartirdi, kod ishlaydi. To'g'ri qadam? | Darhol commit — kod ishlayapti, shu yetadi · Bekor qilib, bitta bosqichli prompt berish · AI'ni almashtirib, xuddi shu promptni berish · Hech narsa — 1145 qator ham oddiy hajm | 2 | Commit qilinadigan hajm — so'ralgan bosqich. | 6 |
  | 3 | Katalog bazada, buyurtma hali xotirada. Buyurtmadan keyin restart. Natija? | Hammasi joyida — katalog bazada saqlangan · Ikkalasi yo'qoladi — restart bazani tozalaydi · Buyurtma yo'qoladi, ombor esa kamayib qoladi · Server yonmaydi — baza va xotira mos emas | 3 | Oraliq vaziyat: bir ish ikki joyda. | 11 |
  | 4 | Yurgan migratsiyaga ustun qo'shib tahrirladingiz, server qayta yondi. Ustun paydo bo'ladimi? | Ha — migratsiya har restartda qayta yuradi · Ha — `synchronize` ustunni o'zi qo'shadi · Server xato beradi — fayl o'zgargani uchun · Yo'q — u yurgan, yangi migratsiya kerak | 4 | Migratsiya bir marta yuradi. | 9 |
  | 5 | Bazadan `telegram_id` keldi, `user.telegram_id === 111` false chiqdi, id esa 111. Sabab? | `BIGINT` bazadan matn bo'lib keladi: `"111"` · Id noto'g'ri — Telegram boshqa id bergan · Baza ulanmagan — qiymat `undefined` keldi · `===` katta sonlarda doim `false` beradi | 1 | node-pg `bigint`ni matn qaytaradi. | 13 |
  | 6 | Mijoz tugmani ikki marta tez bosdi, savatda ikki bir xil qator paydo bo'ldi. Nima yetishmayapti? | Tranzaksiya — ikki bosish ketma-ket emas · `UNIQUE (user_id, product_id)` + `ON CONFLICT` · `BIGINT` — id sig'magani uchun ikki qator · Migratsiya — savat jadvali eskirib qolgan | 2 | Avval qidirib qo'shish — ikki so'rov ikkalasi «yo'q» ko'radi. | 14 |
  | 7 | Bitta Planshet, besh mijoz bir vaqtda; kod: `findOneBy` → `if (stock < qty)` → `save`. `CHECK (stock >= 0)` bor. Natija? | Faqat biriga — `CHECK` qolganlarini to'xtatadi · `CHECK` xato beradi — ombor manfiy bo'ladi · Bir nechtasiga sotiladi, ombor 0, xato yo'q · Deadlock — tranzaksiyalar bir-birini kutadi | 3 | Har biri 0 yozdi — manfiy emas (sinovda 5 tasiga). | 20 |
  | 8 | Tranzaksiyada `CHECK` xato berdi, kod shu tranzaksiyada `SELECT` qildi. Nima chiqadi? | Oddiy natija — `SELECT` alohida ishlaydi · Baza o'zi `COMMIT` qiladi va natija beradi · `0 rows` — jadval bo'shab qoladi · `current transaction is aborted` xatosi | 4 | Xatodan keyin faqat `ROLLBACK`. | 21 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan`.

## 28 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. Xotiradagi ma'lumot (`Map`, massiv) restartda yo'qoladi yoki koddagi boshlang'ich qiymatga qaytadi; saqlanishi kerak bo'lgan har narsa — bazada.
  2. AI bilan ish: bitta prompt — bitta bosqich; prompt besh qismli (kontekst · maqsad · shartlar · chegara · javob); javob uch qismdan o'qiladi (fayllar · chetga chiqish · tekshiruv).
  3. TypeORM: entity tasvirlaydi, migratsiya yaratadi, `migrations` jadvali eslaydi; `synchronize: false`; o'zgarish — yangi migratsiya.
  4. Telegram id — `BIGINT`, kodga matn bo'lib keladi; takror qator — `UNIQUE` + `ON CONFLICT`; state bazada — suhbat o'rtasidagi restartdan o'tadi.
  5. Buyurtma — bitta tranzaksiya; qoldiq qulf bilan o'qiladi yoki bitta `UPDATE … WHERE stock >= qty`; tranzaksiyada xatodan keyin faqat `ROLLBACK`.
  6. Besh tekshiruv har bosqichda: diff · build · restart · psql · ko'p mijoz. Sinf: m5-04 — `\d users`, ikki marta `/start`, restart ism so'ralganda.
- **Uyga vazifa** (M14, M30): «OrderBotNest'ning o'z nusxangizga admin uchun ikki imkoniyat qo'shing, AI bilan, ikki bosqichda. Birinchi bosqich: report buyrug'i, bugungi buyurtmalar soni va summasi va eng ko'p sotilgan uchta mahsulot, bekor qilinganlar hisobga olinmaydi. Ikkinchi bosqich: buyurtmadan keyin qoldiq ikkitadan kam qolsa, adminga ogohlantirish. Har bosqichdan keyin besh tekshiruv. README'ga AI nimani to'g'ri, nimani noto'g'ri qilgani va siz uni qanday ushlaganingizni yozing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | O'z nusxa | GitHub'da yangi repo · `git remote set-url origin <sizning repo>` · `git push` (`tgpg-done` tegi yoki o'z 4-bosqichingiz) | repo ochildi |
  | 2 | `/report` | prompt (besh qism): faqat admin; bugungi `orders` soni va summasi, `CANCELLED` hisobga olinmaydi; `order_items` bo'yicha top-3 (`JOIN`, `GROUP BY`, `SUM`) · psql'da o'sha SQL'ni o'zingiz yozib natijani solishtiring | bot javobi = psql natijasi |
  | 3 | Ogohlantirish | prompt: `COMMIT`dan keyin qoldiq < 2 bo'lgan mahsulotlar haqida adminga xabar; tranzaksiya ichida Telegram'ga so'rov yuborilmasin | Planshet 1 qolganda adminga xabar |
  | 4 | Besh tekshiruv | diff · build · restart · psql · ko'p mijoz (`npm run smoke -- race`) | hammasi ✓ |
  | 5 | README va topshirish | README «AI bilan ish»: har bosqich prompti, AI chetga chiqqan joylar, tekshiruv topgan xatolar · `git push` → repo linki platformadagi uyga vazifaga | — |
  Vaqt: 60–90 daqiqa. Tekshiruvchi qaraydi: `/report` raqamlari psql bilan mos · `CANCELLED` chiqarilgan · ogohlantirish tranzaksiyadan keyin · README'da AI tahlili (kamida bitta topilma).
- **Eslatma:** to'rt bosqich va to'rt prompt (nusxalash) · besh qismli prompt qolipi · AI javobini o'qish (3 qism) · migratsiya faktlari · `BIGINT` va matn · `ON CONFLICT` · state va restart · tranzaksiya, qulf, aborted · besh tekshiruv · xatolar jadvali · sinfga tayyorgarlik · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Jest: OrderBotNest'ga birinchi testlar** — yozamiz, buzamiz va AI yozgan testni tekshiramiz» (F-1104-01, 04.11: foydalanuvchi «xa» — Jest-1 OrderBotNest ustida; avval GATE M 04.11 da WebSocket edi).

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — ✅ 04.11 hammasi yurgizildi (`manba/drive-orderbot-kod.sh` → `orderbot-out/12-*`; qolgan ⚠ faqat `409 Conflict` — haqiqiy token kerak):**
3. ✅ Harness'ga: restartdan keyin `catalog.find(4).stock` (4-ekran isboti, `tgpg-start`) va telefon so'ralgan paytdagi `SELECT state` (15-ekran).
4. ✅ OrderBotNest'da xato chiqishlari: `401: Unauthorized` (haqiqiy noto'g'ri token bilan — Telegram'ga bitta so'rov, foydalanuvchi ruxsati bilan yoki eski `tgpg-out/13` qoladi), `BOT_TOKEN topilmadi`, `DATABASE_URL topilmadi`, `database "shop" does not exist`, `password authentication failed`, `integer out of range` (ustun `INTEGER` bo'lganda), `Missing script: "seed"`.
5. ✅ Mongoose juftlari (M45): `new Schema({…})`, `findOneAndUpdate(…, { upsert: true, new: true })` — `drive-pg2-mongoose.sh` kabi haqiqiy yurgizish (Mongoose 9.11.4 · MongoDB 6.0.27).
6. ✅ Ikki marta tez bosish: avval qidirib qo'shish varianti (`UNIQUE`siz → ikki qator; `UNIQUE` bilan → `duplicate key`) va `ON CONFLICT` varianti → bitta qator — harness'da parallel `tap`.
7. ✅ `"111" === 111`: shu kod bilan bot javobi va `tsc` chiqishi (`This comparison appears to be unintentional…` chiqadimi — `string` turida).
8. ✅ Tranzaksiya o'rtasida xato (trigger) — o'zimizdagi kod bilan qayta: ROLLBACK, savat saqlandi.
9. ✅ 04.11 **Buzuq variant** `findOneBy` → `save`: 5 xaridor × 5 raund → `1/0 5/0 5/0 5/0 5/0` (`orderbot-out/09`), smoke ✗; satr raqamlari 29–41.
10. ✅ 04.11 **`npm run smoke`** (`scripts/smoke.js`, ikkala tegda): `restart` (3 band) + `race` (5 mijoz × 3 raund + ikki marta bir vaqtda bekor); vaqtinchalik `<baza>_smoke`, Telegram'siz. Toza clone: `tgpg-start` 0/3, `tgpg-done` 5/5, AI Opus 5/5, AI Haiku 5/5, buzuq 4/5 (`orderbot-out/10-*`, `11-*`). Smoke `tgpg-done` da xato topdi (ikki marta bekor → ombor 2) — `FOR UPDATE` bilan tuzatildi.

**Qurish:**
1. Generator `dev/tgpg-matn.py` v2 (`pg2-matn.py` dan): MD yo'li `17-TgPg-mentor-v2.md`; `==…==`, `Demak:`, amaliyot jadvallari MD'dan, ovoz ≤ 60 so'z tekshiruvi.
2. Bo'laklar `tgpg/parts/` yangidan (v1 bo'laklari git `5e3ea262` da): `05-s01-s12.jsx` · `06-s13-s24.jsx` · `07-s25-s28.jsx`; `04-yordam.jsx` — VS Code (OrderBotNest Explorer), terminal, psql, **bot oqimi kartasi** (`TgFlow`: «Aziza: /cart» → «bot: …», tugmalar qatorlari), **AI javobi kartasi** (`AiReply`: prompt · parcha · diff-stat, «namuna» belgisi), race chizmasi.
3. Kodli sahnalar M43: har segmentda bitta bo'lak (8–12 satr, haqiqiy satr raqamlari `order-bot` fayllaridan, Prettier 80); natija kod tagida.
4. Chiqishlar aynan: `orderbot-out/`, `orderbot-ai/p1…p4/`, `orderbot-ai2/p1/`, `tgpg-out/07,13,14`; port 5436/5437 → 5432; scratchpad yo'llari ko'rsatilmaydi.
5. Isbotlar: 5 — `/savat\s+bo.?sh/i` · 12 — `/^\s*6\s*$/` · 17 — `/WAITING_PHONE/i` · 23 — `/omborda\s+faqat\s+0\s+ta/i`.
6. LineCheck (22-ekran): KOD 9 dagi buzuq fayl satri → `target`; `fixed` da haqiqiy satr raqamlari (`n`).
7. Promptlar matni (12, 17, 23-ekran «nusxalash») — `orderbot-ai/00-promptlar.md` dan aynan; eslatma (.md) ga ham.
8. `LESSON_ID` o'zgarmaydi (M44: ekranlar soni 25 → 28, saqlov o'zi boshidan).
9. Eski TgPg ovoz keshi — yangi matn bilan qayta; Vercel qayta (memory `mentor-kurs-vercel`).

## Ochiq savollar ([GATE M]) — ✅ 04.11 foydalanuvchi: «smoke qo'sh, push qil, qolganlari ma'qul» (1 — PG-1/2 va Nest'dan keyin; 2 — bot oqimi kartasi; 5, 6, 7 — yozilganidek)
1. **Tartib:** dars mentor PostgreSQL-1, PostgreSQL-2 va NestJS mentor darslarini o'tgan deb yozilgan (psql, tranzaksiya, Module/Service/Repository). Notion'da esa «Telegraf va PostgreSQL» PostgreSQL bo'limidan **oldin** turadi, NestJS umuman yo'q. Mentor bu darsga qaysi tartibda keladi? (Agar PG'dan oldin bo'lsa — 9, 18, 21-ekranlarga PG asoslari qo'shiladi, dars uzayadi.)
2. **Telegram ko'rinishi:** bot oqimi hozir harness kartasi («Aziza: /cart → bot: …»). Siz o'z test botingizda `tgpg-done` ni yurgizib 4–5 ta haqiqiy Telegram surati berasizmi (1, 3, 15, 19-ekran), yoki karta qoladi? Men tokendan foydalanmayman.
3. **`npm run smoke`:** repoga tekshiruv skripti qo'shilsinmi (mentor AI kodini ko'p mijoz rejimida o'zi tekshiradi; uyga vazifada ham)? Qo'shilmasa — 23-ekran 3-qadami ikki Telegram akkaunti bilan qo'lda bo'ladi (ishonchsiz: «bir vaqtda» bosib bo'lmaydi).
4. **Repo:** `Azizbekcrypto/OrderBotNest` nomi va push — qurishdan oldin kerak (5-ekrandagi clone manzili). Push qilaymi?
5. **Hajm:** 28 ekran, ovoz ≈ 27 daqiqa, amaliyot AI bilan 70–90 daqiqa — jami ≈ 1 s 40 daq – 2 s. Ma'qulmi, yoki 20/21-ekrandan biri qisqartirilsinmi?
6. **Uyga vazifa:** `/report` (JOIN + GROUP BY + SUM, `CANCELLED`siz) + kam qoldiq ogohlantirishi + README'da AI tahlili, 60–90 daqiqa — ma'qulmi?
7. **Keyingi dars kartasi:** v1 dagi «WebSocket: doimiy ulanish» qolsinmi, yoki Notion tartibi bo'yicha boshqa dars?
