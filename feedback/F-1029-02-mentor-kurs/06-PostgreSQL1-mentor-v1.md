# Mentor kursi · PostgreSQL-1 «Siz bilgan Mongo'dan PostgreSQL jadvallariga» — MD v1

F-ID: F-1029-02 (PostgreSQL-1) · Sana: 2026-10-31 · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `05-PostgreSQL1-PRD.md` v1 (4 javob: Mongo · qo'l bilan · macOS + Windows · sinfga mentor o'rnatadi)
Fayl (quriladi): `src/mentor-kurs/PgIntroMentorLesson.jsx` · bo'laklar `src/mentor-kurs/pg1/parts/` · dvigatel — umumiy `src/mentor-kurs/parts/01–02` (`MKCFG`)
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/pg1-out/` (skript `manba/drive-pg1.sh`; 21-fayl qo'lda, `script` bilan)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Express'ni va **MongoDB'ni (Mongoose)** biladigan mentor. PostgreSQL'ni o'rnatmagan, `psql` ochmagan, jadval yaratmagan. PK/FK g'oyasi m4-01 dan tanish. |
| Dars oxirida mentor | 1) Mongo tushunchalarini PostgreSQL'dagi juftiga o'giradi (collection ↔ jadval, `ref` ↔ `REFERENCES`, `populate` ↔ `JOIN`) · 2) PostgreSQL'ni Windows va macOS'da o'zi o'rnatadi, `psql -U postgres` bilan ulanadi · 3) ikki bog'langan jadval yaratadi, bazaning o'zi qaytargan xatolarni o'qiydi · 4) `JOIN` va `LEFT JOIN` yozadi · 5) «oxirgi telefon»ni ikki oynada o'z ko'zi bilan ko'radi va tranzaksiyani tushuntiradi · 6) m4-03 ni o'tishni, undagi soddalashtirishlarni va sinf kompyuterlarini tayyorlashni biladi |
| O'quvchi darsi | **m4-03** «SQL vs NoSQL — nega PostgreSQL» (`src/4-Modull/DbSqlNosqlLesson.jsx`, 21 ekran, **kodsiz**). Oldingi: m4-01 (JSON, jadval, sxema). Keyingi: m4-06 CRUD, m4-08 AvtoIjara (`psql -U postgres`). |
| Kursdagi o'rni | Kursdagi birinchi mentor darsi → keyingisi «PostgreSQL: CRUD so'rovlar» (M31: raqam yozilmaydi) |
| Til | O'zbekcha, adabiy, «siz». Atama inglizcha + birinchi marta qavsda izoh: table (jadval), row (qator), column (ustun), primary key, foreign key (tashqi kalit), constraint (qoida), transaction (tranzaksiya). M9 lug'ati: **terminal** (jurnal emas), **o'ylab ko'ring**, **PostgreSQL'ni ishga tushiring** + OS yo'li. «so'rov, javob, ro'yxat, jadval, qator, ustun» — o'zbekcha qoladi. |
| Misol-ip | **`blog` bazasi: `users` + `posts`** — o'quvchi m4-03 amaliyotidagi namuna aynan shu: `users(id, username)` va `posts(id, user_id, izoh)`. Mongo tomonida xuddi shu blog (User, Post). 5-bosqichda shu bazaga `products` va `orders` qo'shiladi («oxirgi telefon»). |
| Mongo bilan halollik | Mongo yomonlanmaydi. Sinovda chiqqan haqiqat ochiq aytiladi: **oxirgi telefon Mongo'da ham bittaga sotiladi** (bitta hujjat atomik). PostgreSQL farqi — bir nechta jadval bitta tranzaksiyada (oddiy o'rnatishda) va qoidalarni (`NOT NULL`, `UNIQUE`, `REFERENCES`, `CHECK`) bazaning o'zi qo'riqlashi. |
| Haqiqiylik (M10) | Har `psql` satri va xato — 31.10.2026 yurgizishdan (PostgreSQL 18.4, `psql` 18.4, MongoDB 6.0.27, Mongoose 9.11.4, Node 24). Xabarlar inglizcha. Windows/macOS o'rnatuvchi oynalari bu kompyuterda sinalmaydi — **maket, rasmiy hujjatdan**, ekranda belgi: «⚠ rasmiy hujjatdan, sinalmagan». `SELECT version();` qatorida bu yerda `Debian … linux` — ekranda ochiq aytiladi: sizda Windows yoki macOS yozuvi bo'ladi. |
| Hajm | **29 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savollik sinov · ovoz ≈ 30 daqiqa (taxmin: ~3200 so'z, 106 so'z/daq) · amaliyotlar ≈ 35–45 daqiqa · **jami ≈ 1 soat 10 daqiqa** |
| Me'yor | Har `Lesson` ≤ 5 segment, segment ovozi ≤ 60 so'z; 1-gap — ko'prik (M17), oxirgisi — «Xulosa» (M5); kalit ibora 8–14 so'z (M6) |

---

## A. Darsning tayanchi

**Tushunchalar (bir ma'no — bir so'z):**
- **baza (database)** — jadvallar turadigan joy; bitta PostgreSQL serverida bir nechta baza (`\l`). Mongo'da baza birinchi yozuvda o'zi paydo bo'ladi, PostgreSQL'da avval `CREATE DATABASE`.
- **jadval (table)** — Mongo'dagi collection'ning jufti; har **qator (row)** — bitta yozuv (Mongo'da document), har **ustun (column)** — maydon, **turi bilan** (`INT`, `TEXT`).
- **`SERIAL PRIMARY KEY`** — `id` o'zi o'sadi (1, 2, 3) va takrorlanmaydi; Mongo'dagi `_id` vazifasi.
- **qoida (constraint)** — bazaning o'zi tekshiradigan shart: `NOT NULL` (bo'sh bo'lmaydi) · `UNIQUE` (takrorlanmaydi) · `REFERENCES` (tashqi kalit, foreign key) · `CHECK` (shart, masalan `stock >= 0`). Buzilsa — `ERROR`, yozuv saqlanmaydi.
- **tashqi kalit (foreign key)** — `posts.user_id` → `users.id`: Mongo'dagi `ref: 'User'`, lekin bazaning o'zida; yo'q foydalanuvchiga post yozilmaydi, posti bor foydalanuvchi o'chirilmaydi.
- **`JOIN`** — ikki jadvalni bitta so'rovda ulash, `ON` satrida qaysi ustun qaysiga teng; Mongo'dagi `populate()`. **`LEFT JOIN`** — juftsiz qatorlar ham chiqadi.
- **tranzaksiya (transaction)** — `BEGIN … COMMIT`: ichidagi hamma buyruq birga bajariladi yoki birortasi ham bajarilmaydi (`ROLLBACK`).
- **«oxirgi telefon»** — o'quvchi darsidagi misol: bitta telefon, ikki xaridor. Uni **so'rovdagi shart** (`WHERE … stock > 0`) va **qator qulfi** saqlaydi: ikkinchi xaridor birinchisini kutadi, keyin `UPDATE 0` oladi.
- **`jsonb`** — PostgreSQL ustuni ichida erkin JSON; har qatorda har xil maydon.
- **xato o'qish formulasi** (M18 ning baza varianti): **qaysi jadval** (`on table "posts"`) · **qaysi qoida** (`foreign key constraint "posts_user_id_fkey"`) · **qaysi qiymat** (`DETAIL: Key (user_id)=(99)`).

**Darsning ipi:** siz bilgan Mongo bloggi → o'sha blog PostgreSQL'da: o'rnatish → `psql` → `blog` bazasi → `users`, `posts` va tashqi kalit → baza o'zi qo'riqlaydi → `JOIN` → bitta do'kon jadvali bilan ishonchlilik (oxirgi telefon, hammasi yoki hech narsa, `jsonb`) → sinf. Vizual: Mongo — yashil hujjat kartalari `{ }`, PostgreSQL — ko'k jadval; qoida xatolari qizil, tuzatilgani yashil.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | SQL va NoSQL: bitta ma'lumot — ikki shakl | Lesson | 1 · Mongo bilan solishtirish |
| 3 | Siz bilgan Mongoose | Lesson | 1 |
| 4 | Mongo xato bermaydigan joylar | Lesson | 1 |
| 5 | Mongo ↔ PostgreSQL lug'ati | Lesson | 1 |
| 6 | Tekshiruv 1 — `populate` ning jufti | MCRetry | 1 |
| 7 | Windows: rasmiy o'rnatuvchi | Lesson | 2 · o'rnatish |
| 8 | macOS: Postgres.app va Homebrew tuzog'i | Lesson | 2 |
| 9 | Birinchi ulanish: `psql` | Lesson | 2 |
| 10 | Amaliyot 1 — o'rnating va ulaning | Practice | 2 |
| 11 | `blog` bazasi va `users` jadvali | Lesson | 3 · jadval va bog'lanish |
| 12 | `posts` va tashqi kalit | Lesson | 3 |
| 13 | Baza o'zi tekshiradi | Lesson | 3 |
| 14 | Tekshiruv 2 — `DELETE` rad etildi | MCRetry | 3 |
| 15 | Amaliyot 2 — ikki bog'langan jadval | Practice | 3 |
| 16 | `JOIN` va `LEFT JOIN` | Lesson | 4 · JOIN |
| 17 | Tekshiruv 3 — xatosiz, lekin noto'g'ri natija | LineCheck | 4 |
| 18 | Amaliyot 3 — JOIN | Practice | 4 |
| 19 | Oxirgi telefon | Lesson | 5 · ishonchlilik |
| 20 | Hammasi yoki hech narsa | Lesson | 5 |
| 21 | JSON ham saqlaydi | Lesson | 5 |
| 22 | Tekshiruv 4 — buyurtma qayerda? | MCRetry | 5 |
| 23 | Amaliyot 4 — ikki oyna | Practice | 5 |
| 24 | Sinf kompyuterlari: m4-06 dan oldin | Lesson | 6 · ko'prik |
| 25 | m4-03 xaritasi | Lesson | 6 |
| 26 | O'quvchi darsidagi so'zlar | Lesson | 6 |
| 27 | Darsdagi soddalashtirishlar va o'quvchi savollari | Lesson | 6 |
| 28 | O'z-sinov — 8 savol | Screen27 | — |
| 29 | Yakun | Screen28 | — |

**Sahna turlari (KOD, 1-band):** `psql` sahnasi — **terminal oynasi** (sarlavha `psql — blog`, prompt `blog=#` ko'rinadi); loyiha fayli yo'q, shuning uchun Explorer yo'q (M1 istisnosi — «Ochiq savollar» 1). Mongo sahnasi (3–4-ekran) — VS Code oynasi `mongo-blog`: `node_modules/` (yopiq) · `blog.js` · `package.json`. Uyga vazifa — `blog-db`: `schema.sql` · `data.sql` · `queries.sql` · `README.md`.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · PostgreSQL` · Sarlavha: **Siz Mongo'ni bilasiz. Bugun o'sha blog PostgreSQL'da.**
- Sahna: chapda reja (6 bosqich, ovoz bilan yonadi); o'ngda natija — `psql` oynasi: `JOIN` so'rovi va 3 qatorli javob (`ali | Birinchi post` …).
- Reja: 01 Mongo bilan solishtirish · 02 O'rnatish va ulanish · 03 Jadval va bog'lanish · 04 JOIN · 05 Ishonchlilik: oxirgi telefon · 06 O'quvchi darsini o'tish
1. **Siz Mongo'da blog yozgansiz — bugun xuddi shu blogni PostgreSQL'da quramiz**
   Ovoz: «Assalomu alaykum. Siz MongoDB bilan, Mongoose orqali ishlagansiz: modellar, ref, populate. AI Startup kursidagi o'quvchilar PostgreSQL bilan ishlaydi. Bugun siz bilgan narsadan boshlaymiz: Mongo'dagi oddiy blogni olamiz va uni PostgreSQL'da qaytadan quramiz.»
2. **Dars oxirida PostgreSQL sizda ishlaydi, ikki jadval va JOIN o'z qo'lingizda**
   Ovoz: «Dars oxirida PostgreSQL kompyuteringizda o'rnatilgan bo'ladi. Ikki bog'langan jadvalni o'zingiz yaratasiz, baza qaytargan xatolarni o'qiysiz va JOIN bilan ikki jadvalni bitta javobda ko'rasiz.» · reja 01–04
3. **O'quvchi darsidagi «oxirgi telefon»ni ikki oynada o'z ko'zingiz bilan ko'rasiz**
   Ovoz: «O'quvchi darsida bitta telefonni ikki kishi bir vaqtda sotib olmoqchi bo'ladigan misol bor. Uni gap bilan emas, ikkita terminal oynasida o'zingiz sinab ko'rasiz va nima uni saqlab qolishini aniq bilasiz.» · reja 05
4. **Sinf kompyuterlariga PostgreSQL'ni siz o'rnatasiz — o'quvchi darsida bu qism yo'q**
   Ovoz: «Yana bir muhim narsa: o'quvchi darslarida PostgreSQL'ni o'rnatish o'rgatilmaydi. Sinf kompyuterlariga uni siz o'rnatasiz, keyingi darslar shunga tayanadi. Buni ham, o'quvchi darsini qanday o'tishni ham oxirgi bosqichda ko'ramiz.» · reja 06
5. **Olti bosqich, to'rt amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.»
- Manba: `pg1-out/09-join.txt`; PRD «Manbadan topilgan muhim fakt» (o'quvchi darslarida o'rnatish yo'q; m4-08 `psql -U postgres` kutadi).

---

## 2 · SQL va NoSQL: bitta ma'lumot — ikki shakl  ← `Lesson`
- Kicker: `1-bosqich · Mongo bilan solishtirish` · Sarlavha: **SQL va NoSQL: bitta ma'lumot ikki xil shaklda saqlanadi**
- Sahna (F-1102-21, ma'lumot galma-gal): 1-segmentda ikki bo'sh karta — chapda «MongoDB · NoSQL», o'ngda «PostgreSQL · SQL»; 2-segmentda chap kartada `users` kolleksiyasining ikki hujjati (ikkinchisi — qo'shimcha `shahar` maydoni bilan, boshqa rangda); 3-segmentda o'ng kartada `users` jadvali (ustun sarlavhalari va 1-qator yoritiladi) va ostida `shahar` yozilganda chiqqan xato (qizil); 4-segmentda SQL so'rovi va javobi; 5-segmentda moslik qoidasi: hujjat ↔ qator · maydon ↔ ustun · collection ↔ jadval.
  ```
  // MongoDB (mongosh) — users kolleksiyasi
  { _id: ObjectId('6ae871ed092c9346048de666'), username: 'ali' }
  { _id: ObjectId('6ae871ed092c9346048de667'), username: 'vali', shahar: 'Toshkent' }
  ```
  ```
  blog=# SELECT * FROM users;
   id | username
  ----+----------
    1 | ali
    2 | vali
  (2 rows)
  blog=# INSERT INTO users (username, shahar) VALUES ('sardor', 'Toshkent');
  ERROR:  column "shahar" of relation "users" does not exist
  blog=# SELECT username FROM users WHERE id = 2;
   username
  ----------
   vali
  (1 row)
  ```
1. **Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL — farqi ma'lumot shaklida**
   Ovoz: «Mongo'ni PostgreSQL bilan solishtirishdan oldin bitta asosiy farqni aniq ko'rib olamiz. Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL. MongoDB NoSQL bazasi, PostgreSQL esa SQL bazasi. Ularning asosiy farqi ma'lumot qanday shaklda saqlanishida.»
2. **MongoDB'da har yozuv — jingalak qavs ichidagi hujjat, hujjatlar `collection`ga yig'iladi**
   Ovoz: «Chapda MongoDB. Bu yerda har bir yozuv hujjat, inglizchasi document: jingalak qavs ichida maydon va qiymat, masalan username, ali. Hujjatlar collection'ga yig'iladi. Qarang: vali'ning hujjatida shahar degan qo'shimcha maydon bor, ali'nikida yo'q. Mongo buni qabul qiladi: hujjatlar har xil shaklda bo'lishi mumkin.»
3. **PostgreSQL'da ma'lumot jadvalda: tepada ustunlar, har yozuv bitta qator**
   Ovoz: «O'ngda o'sha ma'lumot PostgreSQL'da. Bu yerda ma'lumot jadvalda, inglizchasi table. Tepada ustunlar, ya'ni column: id va username. Har bir yozuv bitta qator, ya'ni row: bir, ali. Har qatorda ustunlar bir xil. Shaharni yozib ko'rdik: jadvalda bunday ustun yo'q, shuning uchun PostgreSQL xato berdi.»
4. **SQL — jadvalga so'rov yozish tili; NoSQL — «SQL emas», hujjat bilan ishlaydi**
   Ovoz: «Endi nomlarning ma'nosi. SQL bu jadvalga so'rov yozish tili: select, insert, update. Ekranda shunday so'rov: ikkinchi foydalanuvchining username'ini so'radik, javob vali. PostgreSQL shu tilda ishlagani uchun SQL bazasi deyiladi. NoSQL esa «SQL emas» degani: MongoDB jadval o'rniga hujjat bilan ishlaydi.»
5. **Xulosa: Mongo — `collection` va hujjat, PostgreSQL — jadval, ustun va qator**
   Ovoz: «Xulosa: MongoDB'da ma'lumot hujjat ko'rinishida turadi va hujjatlar collection'ga yig'iladi. PostgreSQL'da ma'lumot jadvalda: ustunlar va qatorlar. Demak, Mongo'dagi bitta hujjat PostgreSQL'dagi bitta qatorga, hujjatdagi maydon esa ustunga to'g'ri keladi. Darsning qolgan hammasi shu farqdan kelib chiqadi.»
- Manba: `manba/drive-pg1-sqlnosql.sh` → `pg1-out/25-sqlnosql-mongo.txt` (mongosh, 02.11.2026), `pg1-out/26-sqlnosql-pg.txt` (PostgreSQL 18). O'quvchi darsi m4-03 ham shu farqdan boshlaydi (Screen2: «Excel jadvaliga o'xshaydi» · «papkadagi turli qog'ozlar kabi»).

---

## 3 · Siz bilgan Mongoose  ← `Lesson`
- Kicker: `1-bosqich · Mongo bilan solishtirish` · Sarlavha: **Mongo'dagi blog: ikki model, bitta `ref`, bitta `populate`**
- Sahna: VS Code oynasi `mongo-blog` (Explorer: `node_modules/` yopiq · `blog.js` faol · `package.json`); `blog.js` — sinov skriptidan qisqartirilgan; 3-segmentda terminal — haqiqiy `populate` natijasi. Ekranda kichik belgi: «sinov skriptidan, qisqartirilgan».
  ```js
  const User = mongoose.model('User', new mongoose.Schema({ username: String }));
  const Post = mongoose.model('Post', new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    izoh: String
  }));

  await Post.find().populate('author');
  ```
1. **Boshlanish nuqtasi — siz bilgan Mongo: ikki model, foydalanuvchi va uning posti**
   Ovoz: «Shakldagi farqni ko'rdik, endi uni tanish koddan boshlab ochamiz. Ekranda Mongoose'dagi oddiy blog: ikkita model. User'da faqat username, Post'da muallif va izoh. Bu kodni haqiqiy MongoDB'da yurgizib ko'rdik.»
2. **Post'dagi `author` — ObjectId va `ref: 'User'`: post shu foydalanuvchiga bog'langan**
   Ovoz: «Post modelidagi author maydoniga qarang: turi ObjectId, yonida ref, User. Ya'ni postda foydalanuvchining o'zi emas, faqat uning id'si saqlanadi, ref esa bu id qaysi modelga tegishli ekanini aytadi.» · 3–4-satr yonadi
3. **`populate('author')` id o'rniga butun foydalanuvchi hujjatini javobga qo'yib beradi**
   Ovoz: «populate so'rov paytida shu id bo'yicha foydalanuvchini topadi va javobga qo'yib beradi. Terminalga qarang: author ichida endi id emas, butun hujjat, username ali.» · terminal:
   ```
   [ { "_id": "6ae62798721f5b830b674729",
       "author": { "_id": "6ae62798721f5b830b674728", "username": "ali", "__v": 0 },
       "izoh": "Birinchi post", "__v": 0 } ]
   ```
4. **Xulosa: `ref` — bog'lanish, `populate` — birlashtirish; PostgreSQL'da ikkalasi ham bor**
   Ovoz: «Xulosa: Mongo'da bog'lanish ikki qismdan iborat. ref ikki modelni bog'laydi, populate ularni bitta javobda birlashtiradi. PostgreSQL'da ham xuddi shu ikki qism bor, faqat nomlari boshqa. Lekin avval Mongo xato bermay o'tkazib yuboradigan ikki holatni ko'raylik.»
- Manba: `manba/drive-pg1.sh` 17-bo'lim (model va `populate` kodi); `pg1-out/17-mongo.txt` (1-blok).

## 4 · Mongo xato bermaydigan joylar  ← `Lesson`
- Kicker: `1-bosqich · Mongo bilan solishtirish` · Sarlavha: **Mongo ikki holatda xato bermaydi: yo'q muallif va har xil hujjat**
- Sahna: o'sha VS Code oynasi; 2-segmentda `blog.js` ga bitta satr qo'shiladi (yashil), terminalda natija; 3-segmentda kolleksiyaning uch hujjati yonma-yon kartalar (uchinchisi boshqa rangda); 4-segmentda qoida-karta.
1. **Mongo'da tartibni kim saqlaydi? Ikki tajriba bilan tekshirib ko'ramiz**
   Ovoz: «Mongo'da bog'lanish bor ekan. Endi savol: bu bog'lanishni kim qo'riqlaydi? Ikkita tajriba qildik. Ikkalasida ham MongoDB xato bermadi, va aynan shu xato bermaslik PostgreSQL bilan asosiy farq.»
2. **Mavjud bo'lmagan muallifga post saqlandi, `populate` esa `author: null` qaytardi**
   Ovoz: «Birinchi tajriba: postni bazada yo'q foydalanuvchining id'si bilan yaratdik. Mongo uni saqladi, xato yo'q. populate qilganda esa author null bo'lib chiqdi. Ya'ni muallifi yo'q post bazada turibdi va bu haqda hech qanday xato chiqmadi.» · `blog.js`: `await Post.create({ author: new mongoose.Types.ObjectId(), izoh: "Muallifi yo'q post" });` · terminal: `{ "author": null, "izoh": "Muallifi yo'q post" }`
3. **Sxemani chetlab yozilgan hujjat boshqa maydonlar bilan o'sha kolleksiyaga tushdi**
   Ovoz: «Ikkinchi tajriba: Mongoose sxemasini chetlab, kolleksiyaning o'ziga boshqa maydonli hujjat yozdik: muallif, matn va like. Bu boshqa skript yoki boshqa xizmat yozganday holat. Kolleksiya uni ham qabul qildi: endi bitta posts ichida har xil shakldagi hujjatlar.» · kartalar: `{ author, izoh }` · `{ author, izoh }` · `{ muallif: "vali", matn: "Salom", like: 5 }`
4. **Xulosa: Mongo'da tartibni Mongoose kodi saqlaydi, PostgreSQL'da — bazaning o'zi**
   Ovoz: «Xulosa: oddiy holatda, alohida tekshiruv yozilmagan bo'lsa, Mongo'da tartibni sizning kodingiz, Mongoose sxemasi saqlaydi. Kodni chetlab o'tgan yozuvni baza qabul qiladi. PostgreSQL'da qoida jadvalning o'zida yoziladi va uni hech kim chetlab o'ta olmaydi. Buni uchinchi bosqichda sinab ko'ramiz.»
- Qoida-karta: «Mongo: qoida — kodda (Mongoose). PostgreSQL: qoida — jadvalda (`NOT NULL`, `REFERENCES`…)».
- Manba: `drive-pg1.sh` 17-bo'lim (`Post.create` yo'q id bilan; `collection('posts').insertOne` — sxemasiz); `pg1-out/17-mongo.txt` (2–3-blok). Eslatma: MongoDB'da `$jsonSchema` validator bor — darsda «alohida tekshiruv yozilmagan bo'lsa» deyiladi.

## 5 · Mongo ↔ PostgreSQL lug'ati  ← `Lesson`
- Kicker: `1-bosqich · Mongo bilan solishtirish` · Sarlavha: **Siz bilgan har so'zning PostgreSQL'dagi jufti**
- Sahna: ikki ustunli lug'at (chap yashil — Mongo, o'ng ko'k — PostgreSQL), qatorlar segment bilan yonadi; o'ng tomonda shu qatorga mos `CREATE TABLE posts` bo'lagi yonadi.
  | MongoDB (Mongoose) | PostgreSQL |
  |---|---|
  | baza | baza (database) — `\l` |
  | collection `posts` | jadval (table) `posts` |
  | document | qator (row) |
  | maydon (field) | ustun (column) — **turi bilan**: `INT`, `TEXT` |
  | `_id` (ObjectId) | `id SERIAL PRIMARY KEY` — 1, 2, 3 |
  | `ref: 'User'` | `REFERENCES users(id)` — tashqi kalit (foreign key) |
  | `populate()` | `JOIN` |
  | `Schema` — kodda | `CREATE TABLE` — bazada |
  | `required: true` · `unique: true` | `NOT NULL` · `UNIQUE` |
  | `mongosh` | `psql` |
1. **Har Mongo tushunchasining PostgreSQL'da jufti bor — lug'atni bir marta ko'rib olamiz**
   Ovoz: «Mongo qayerda xato bermasligini ko'rdik. Endi lug'at: siz bilgan har so'zning PostgreSQL'dagi jufti. Bu lug'at sinfda ham kerak bo'ladi, chunki o'quvchi darsi ham jadval va hujjatni solishtiradi.»
2. **Collection — jadval, document — qator, maydon esa turi aniq ustun**
   Ovoz: «Collection jadval bo'ladi, document jadvaldagi bitta qator. Maydon ustun bo'ladi, lekin bitta farq bor: ustunning turi oldindan yoziladi, son yoki matn. Jadvaldagi har qatorda ustunlar bir xil.» · 1–4-qator
3. **`_id` o'rnida o'zi o'sadigan raqam, `ref` — tashqi kalit, `populate` — `JOIN`**
   Ovoz: «Mongo'dagi id o'rnida PostgreSQL'da odatda o'zi o'sadigan raqam: bir, ikki, uch. ref'ning jufti tashqi kalit, inglizchasi foreign key: posts jadvalidagi user id ustuni users jadvaliga ishora qiladi. populate'ning jufti esa JOIN.» · 5–7-qator
4. **Mongoose sxemasi kodda turadi, `CREATE TABLE` esa jadval qoidasini bazaning o'ziga yozadi**
   Ovoz: «Eng katta farq shu qatorda. Mongoose sxemasi sizning kodingizda turadi. CREATE TABLE esa jadvalni va uning qoidalarini bazaning o'ziga yozadi: bo'sh bo'lmasin, takrorlanmasin, muallif mavjud bo'lsin. mongosh o'rnida esa PostgreSQL terminali, uning dastur nomi psql.» · 8–10-qator
5. **Xulosa: tushunchalar deyarli bir xil — farq qoidalar qayerda turishida**
   Ovoz: «Xulosa: tushunchalarning ko'pi sizga tanish, faqat nomi boshqa. Asosiy farq qoidalar qayerda turishida: Mongo'da kodda, PostgreSQL'da jadvalda. O'quvchi «Mongo'dagi populate qani?» desa, javob: JOIN. Tekshirib olaylik.»
- Manba: `pg1-out/06-jadvallar.txt` (`CREATE TABLE posts`, `\d posts`); Mongo tomoni — `drive-pg1.sh` 17-bo'lim.

## 6 · Tekshiruv 1 — `populate` ning jufti  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Mongo'da `ref` ham, `populate` ham bor edi. PostgreSQL'da `populate` o'rnida qaysi biri?**
- Ovoz: «Lug'atni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Mongo'da ikki narsa bor edi: ref bog'laydi, populate esa so'rov paytida birlashtiradi. PostgreSQL'da populate'ning ishini qaysi biri qiladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 `REFERENCES users(id)` · 2 `SERIAL PRIMARY KEY` · 3 `JOIN … ON …` · 4 `CREATE TABLE`
- To'g'ri (ovoz): «To'g'ri, JOIN. U so'rov paytida ikki jadvalni ulaydi va bitta javob beradi, populate kabi. REFERENCES esa ref'ning jufti: u faqat bog'lanishni belgilaydi va qo'riqlaydi, javobga hech narsa qo'shmaydi. Demak, PostgreSQL'da bog'lanishni REFERENCES belgilaydi, ikki jadvalni bitta javobga esa JOIN birlashtiradi.» · qisqa: «`JOIN` — so'rov paytida ulaydi (populate). `REFERENCES` — bog'lanishni belgilaydi va qo'riqlaydi (ref).»
- Xato izohlari: 1 — «Bu `ref`ning jufti: bog'lanishni belgilaydi, lekin so'rov natijasini birlashtirmaydi.» · 2 — «Bu `_id`ning jufti: qatorning raqami.» · 4 — «Bu `Schema`ning jufti: jadval va uning qoidalarini yaratadi.»
- Maslahat (xato bo'lsa): «So'rov paytida ishlaydigan va ikki jadvalni bitta javobga yig'adigan buyruqni qidiring.»
- Manba: `pg1-out/09-join.txt`, `06-jadvallar.txt`.

---

## 7 · Windows: rasmiy o'rnatuvchi  ← `Lesson`
- Kicker: `2-bosqich · o'rnatish` · Sarlavha: **Windows: postgresql.org → o'rnatuvchi → parol, port, PATH**
- Sahna: o'rnatuvchi oynalari maketi (ketma-ket, segment bilan almashadi), har oyna burchagida «⚠ rasmiy hujjatdan, sinalmagan» belgisi; 4-segmentda Windows sozlamasi maketi «Environment Variables → Path» va yangi satr; 5-segmentda qoida-karta (3 band).
1. **Mongo bilan solishtirdik — endi o'rnatamiz; Windows yo'li rasmiy saytdan boshlanadi**
   Ovoz: «Tushunchalar tayyor, endi PostgreSQL'ni o'rnatamiz. Avval Windows, keyingi ekranda macOS. Sizda qaysi bo'lishidan qat'i nazar ikkalasini ham ko'ring: sinf kompyuterlari boshqacha bo'lishi mumkin. Windows'da postgresql org saytidagi download sahifasidan rasmiy o'rnatuvchi olinadi, eng yangi barqaror versiyasi o'n sakkiz.» · `postgresql.org/download/windows/` → «Interactive installer by EDB» → 18
2. **Komponentlar: Server, pgAdmin va Command Line Tools kerak, Stack Builder kerak emas**
   Ovoz: «Komponentlar oynasida to'rtta band bor. Server, ya'ni bazaning o'zi. pgAdmin, grafik oyna, ixtiyoriy. Command Line Tools: PostgreSQL terminali shu yerda, u albatta kerak. Stack Builder qo'shimcha dasturlar uchun, bizga kerak emas.» · ☑ PostgreSQL Server · ☑ pgAdmin 4 · ☐ Stack Builder · ☑ Command Line Tools
3. **Parolni yozib qo'ying: o'quvchi keyingi darslarda aynan shu parolni so'raydi**
   Ovoz: «Keyin parol: bu postgres foydalanuvchisining paroli. Uni albatta yozib qo'ying, o'quvchi keyingi darslarda PostgreSQL terminalini ochganda va loyiha sozlamasida aynan shu parolni so'raydi. Port besh ming to'rt yuz o'ttiz ikki, o'zgartirmang. Qolgan oynalarni o'zgartirmasdan o'tkazing.» · parol oynasi · `Port: 5432`
4. **O'rnatuvchi PATH'ga qo'shmaydi: `bin` papkasini qo'lda qo'shing yoki SQL Shell'ni oching**
   Ovoz: «Muhim joy: o'rnatuvchi psql buyrug'ini PATH'ga qo'shmaydi. Shuning uchun terminalda psql yozilsa, Windows uni tanimaydi. Ikki yo'l bor: PostgreSQL'ning bin papkasini Path'ga qo'shib, terminalni yangidan ochish, yoki Start menyusidan SQL Shell, ya'ni PostgreSQL terminalini ochish.» · `C:\Program Files\PostgreSQL\18\bin`
5. **Xulosa: Windows'da uch narsani tekshiring — parol yozilgan, port 5432, PATH'da `bin`**
   Ovoz: «Xulosa: Windows'da o'rnatgandan keyin uch narsani tekshiring. Parol yozib qo'yilgan, port besh ming to'rt yuz o'ttiz ikki, va bin papkasi Path'da. Sinfda eng ko'p uchraydigan muammo uchinchisi bo'ladi: psql buyrug'i tanilmaydi.»
- Manba (⚠ rasmiy, sinalmagan): https://www.postgresql.org/download/windows/ (31.10: 18 — eng yangisi, 19 — RC) · EDB qo'llanmasi https://www.enterprisedb.com/docs/supported-open-source/postgresql/installing/windows/ (komponentlar, parol, port 5432, PATH o'zgartirilmaydi).

## 8 · macOS: Postgres.app va Homebrew tuzog'i  ← `Lesson`
- Kicker: `2-bosqich · o'rnatish` · Sarlavha: **macOS: Postgres.app — Initialize, PATH va parolsiz `postgres`**
- Sahna: Postgres.app oynasi maketi («Initialize» tugmasi → «Running», «⚠ rasmiy hujjatdan, sinalmagan»); 3-segmentda terminal — PATH buyrug'i; 4-segmentda terminal — haqiqiy Homebrew holati (xato → tuzatish → yashil); 5-segmentda qoida-karta.
1. **Mac'da eng sodda yo'l — Postgres.app: dastur, server va `psql` bitta faylda**
   Ovoz: «Windows'ni ko'rdik, endi macOS. Mac uchun eng sodda yo'l Postgres.app. Bu bitta dastur: ichida server ham, PostgreSQL terminali ham bor. postgresapp com saytidan yuklab olinadi va Applications papkasiga ko'chiriladi.»
2. **Dasturni ochib Initialize bosiladi — server ishga tushadi, port yana 5432**
   Ovoz: «Dasturni ochib, Initialize tugmasini bosasiz. Server ishga tushadi, port yana besh ming to'rt yuz o'ttiz ikki. Parol so'ralmaydi: o'z kompyuteringizdan parolsiz ulanasiz. Postgres.app postgres foydalanuvchisini ham o'zi yaratadi.» · maket: «Initialize» → «Running» · terminal (haqiqiy, Postgres.app kabi sozlangan server): `$ psql -U postgres -c "SELECT current_user;"` → `postgres`
3. **Terminal `psql`ni topishi uchun bitta PATH buyrug'i, keyin terminalni yangidan oching**
   Ovoz: «Terminal psql buyrug'ini topishi uchun rasmiy saytda bitta buyruq bor, u Postgres.app papkasini PATH'ga qo'shadi. Uni bir marta yurgizasiz, kompyuter parolingizni so'raydi. Keyin terminalni yopib, yangidan oching.»
   ```
   sudo mkdir -p /etc/paths.d &&
   echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```
4. **Homebrew bilan o'rnatilsa `postgres` roli yo'q — `createuser -s postgres` bilan tuzatiladi**
   Ovoz: «Ehtiyot bo'ling: ba'zi mentorlar Homebrew bilan o'rnatadi. U holda server bazaga sizning Mac foydalanuvchi nomingiz bilan kiradi, postgres degan foydalanuvchi bo'lmaydi. Sinab ko'rdik: psql minus U postgres xato beradi. Tuzatish bitta buyruq: createuser minus s postgres. Shundan keyin ulanish ishlaydi.»
   ```
   $ psql -U postgres
   psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  role "postgres" does not exist
   $ createuser -s postgres
   $ psql -U postgres -c "SELECT current_user;"
    current_user
   --------------
    postgres
   ```
5. **Xulosa: Mac'da Postgres.app; Homebrew bo'lsa — avval `postgres` foydalanuvchisini yarating**
   Ovoz: «Xulosa: Mac'da Postgres.app'ni o'rnating, Initialize bosing va PATH buyrug'ini yurgizing. Homebrew bilan o'rnatilgan bo'lsa, createuser minus s postgres yozing. O'quvchi darslari psql minus U postgres buyrug'ini kutadi, shuning uchun bu foydalanuvchi har kompyuterda bo'lishi shart.»
- Manba: https://postgresapp.com/ (⚠ rasmiy, sinalmagan: Initialize, PATH buyrug'i, parolsiz) · `postgres` roli bor — Postgres.app manba kodi `Postgres/Server.swift` (`initdb -U postgres` + `createuser --superuser <mac foydalanuvchisi>`) · `pg1-out/16-postgresapp.txt` (C klaster), `15-rol-yoq.txt` (B klaster; sinovda socket porti 5434 edi — ekranda 5432, README farqlar bo'limi).

## 9 · Birinchi ulanish: `psql`  ← `Lesson`
- Kicker: `2-bosqich · ulanish` · Sarlavha: **`psql -U postgres`: parol, prompt, birinchi so'rov**
- Sahna: terminal oynasi; har segmentda haqiqiy satrlar qo'shiladi; prompt (`postgres=#`, `postgres-#`) alohida rang bilan yoritiladi; 4-segmentda `\l` jadvali (3 baza).
1. **O'rnatildi — endi ulanamiz: `psql` siz bilgan `mongosh` kabi buyruq oynasi**
   Ovoz: «PostgreSQL o'rnatildi, endi unga ulanamiz. PostgreSQL terminali, dastur nomi psql, mongosh kabi: terminalda bazaga buyruq yozasiz, javob shu yerda chiqadi. Buyruq: psql minus U postgres, ya'ni postgres foydalanuvchisi nomidan.»
2. **Windows parol so'raydi; yozayotganda ekranda belgi chiqmaydi — bu normal**
   Ovoz: «Windows'da parol so'raladi, o'rnatishda yozgan parolingiz. Diqqat: yozayotganingizda ekranda hech qanday belgi chiqmaydi, yulduzcha ham. Bu normal, yozib Enter bosing. Mac'da Postgres.app bilan parol so'ralmaydi. Kirgach prompt chiqadi: postgres, panjara. Bu siz hozir postgres bazasidasiz degani.»
   ```
   $ psql -U postgres
   Password for user postgres:
   psql (18.4 (Debian 18.4-1+b1), server 17.2 (Debian 17.2-1+b2))
   Type "help" for help.

   postgres=#
   ```
3. **Har buyruq nuqta-vergul bilan tugaydi; unutilsa prompt `postgres-#` bo'lib kutadi**
   Ovoz: «Birinchi so'rov: select version. Har SQL buyrug'i nuqta-vergul bilan tugaydi. Unutsangiz, PostgreSQL terminali xato bermaydi, prompt'dagi panjara oldida tire paydo bo'ladi va davomini kutadi. Shunchaki nuqta-vergul yozib Enter bosing. Sinfda bu eng ko'p beriladigan savol.»
   ```
   postgres=# SELECT 1
   postgres-# ;
    ?column?
   ----------
           1
   (1 row)

   postgres=# SELECT version();
    PostgreSQL 18.4 (Debian 18.4-1+b1) on x86_64-pc-linux-gnu, compiled by … 64-bit
   (1 row)
   ```
   Ekranda izoh: «Bu yerda Linux. Sizda `PostgreSQL 18…` dan keyin Windows yoki macOS yozuvi bo'ladi.»
4. **`\l` — bazalar ro'yxati: `postgres` va ikki shablon; `\q` — PostgreSQL terminalidan chiqish**
   Ovoz: «Teskari chiziqcha bilan boshlanadigan buyruqlar PostgreSQL terminalining o'zi uchun, ularga nuqta-vergul kerak emas. Teskari chiziqcha l bazalar ro'yxatini ko'rsatadi: postgres va ikkita template, ya'ni shablon. Shablonlarga tegmaysiz. Teskari chiziqcha q PostgreSQL terminalidan chiqaradi.»
   ```
   postgres=# \l
      Name    |  Owner   | Encoding | …
   -----------+----------+----------+
    postgres  | postgres | UTF8     |
    template0 | postgres | UTF8     |
    template1 | postgres | UTF8     |
   (3 rows)
   ```
5. **Xulosa: prompt qaysi bazada turganingizni aytadi; SQL — nuqta-vergul bilan, `\` buyruqlari — usiz**
   Ovoz: «Xulosa: prompt'ga doim qarang, u qaysi bazada turganingizni aytadi. SQL buyrug'i nuqta-vergul bilan tugaydi, teskari chiziqchali buyruqlar esa usiz. Endi o'zingiz o'rnatib, ulanib ko'ring.»
- Manba: `pg1-out/21-psql-kirish.txt` (parol so'rovi, salom qatori, `postgres-#`), `02-version.txt`, `03-l.txt`.

## 10 · Amaliyot 1 — o'rnating va ulaning  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 15–20 daqiqa` · Sarlavha: **PostgreSQL'ni o'rnating va `psql` bilan ulaning** · `tableAt: 3`
1. **Endi siz: PostgreSQL'ni o'z kompyuteringizga o'rnatib, birinchi so'rovni yurgizasiz**
   Ovoz: «Endi navbat sizga: PostgreSQL'ni o'z kompyuteringizga o'rnatasiz. To'rt qadam, o'n besh-yigirma daqiqa. Windows bo'lsa yettinchi ekrandagi yo'l, Mac bo'lsa sakkizinchi ekrandagi yo'l.»
2. **1–2-qadam: o'rnatish va PATH; parolni yozib qo'ymasdan oldinga o'tmang**
   Ovoz: «Birinchi: o'rnatish. Windows'da parolni albatta yozib qo'ying. Ikkinchi: PATH. Windows'da bin papkasini Path'ga qo'shing, Mac'da rasmiy buyruqni yurgizing, keyin terminalni yangidan oching.»
3. **3–4-qadam: `psql -U postgres`, `SELECT version();`; isbot — natija qatorining boshi**
   Ovoz: «Uchinchi: psql minus U postgres bilan ulaning. To'rtinchi: select version so'rovini yurgizing va teskari chiziqcha l bilan bazalarni ko'ring. Isbot maydoniga version natijasini nusxalang, PostgreSQL so'zidan boshlab.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, sinf kompyuterlarida ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin PostgreSQL kompyuteringizda o'rnatilgan va siz unga terminaldan ulana olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | O'rnatish | Windows: postgresql.org → EDB installer 18 (Server · pgAdmin 4 · Command Line Tools; parol; port 5432) · Mac: postgresapp.com → Applications → Initialize | o'rnatuvchi tugadi / «Running» |
  | 2 | PATH | Windows: `C:\Program Files\PostgreSQL\18\bin` → Path, yangi terminal · Mac: `sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin \| sudo tee /etc/paths.d/postgresapp`, yangi terminal | `psql --version` → `psql (PostgreSQL) 18…` |
  | 3 | Ulanish | `psql -U postgres` | Windows: `Password for user postgres:` → `postgres=#` · Mac: darhol `postgres=#` |
  | 4 | Birinchi so'rov | `SELECT version();` · `\l` · `\q` | `PostgreSQL 18…` · 3 baza: `postgres`, `template0`, `template1` |
- Isbot: «`SELECT version();` natijasi — `PostgreSQL` so'zidan boshlab» · placeholder: «natija qatorini shu yerga qo'ying» · KOD: `/^\s*PostgreSQL \d{2}/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `FATAL:  password authentication failed for user "postgres"` | parol noto'g'ri: o'rnatishda yozgan parolingiz; klaviatura tilini (EN/RU) va katta harfni tekshiring |
  | `Connection refused` · `Is the server running on that host and accepting TCP/IP connections?` | PostgreSQL ishlamayapti — **PostgreSQL'ni ishga tushiring**: Windows: Services → `postgresql-x64-18` → Start ⚠ · Mac: Postgres.app → Start |
  | `connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory` | Mac: Postgres.app ochilmagan yoki server to'xtagan — dasturni oching, Start |
  | `FATAL:  role "postgres" does not exist` | Homebrew bilan o'rnatilgan — `createuser -s postgres` (8-ekran) |
  | `'psql' is not recognized as an internal or external command` ⚠ · `zsh: command not found: psql` ⚠ | PATH: 2-qadam, keyin terminalni **yangidan** oching; Windows'da vaqtincha Start → SQL Shell (psql) |
  | `WARNING: Console code page (866) differs from Windows code page (1251)` ⚠ | Windows ogohlantirishi: ishga xalaqit bermaydi, davom eting |
  | Prompt `postgres-#` bo'lib qoldi | nuqta-vergul unutilgan — `;` yozib Enter |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg1-out/04-parol-xato.txt`, `20-server-yoq.txt` (sinovda port 5439 — ekranda 5432), `15-rol-yoq.txt`, `21-psql-kirish.txt`, `02-version.txt`, `03-l.txt`. ⚠ — Windows/zsh xabarlari va Windows xizmat nomi bu kompyuterda sinalmagan (psql hujjati «Notes for Windows Users», EDB qo'llanmasi).

---

## 11 · `blog` bazasi va `users` jadvali  ← `Lesson`
- Kicker: `3-bosqich · jadval va bog'lanish` · Sarlavha: **`CREATE DATABASE blog` → `\c blog` → `users` jadvali**
- Sahna: terminal oynasi (`psql`); 3-segmentda `CREATE TABLE users` satrlari yonida izoh-chiziqlar (`id` — o'zi o'sadi · `username` — bo'sh bo'lmaydi, takrorlanmaydi); 4-segmentda ikki xato va tuzatish (qizil → yashil).
1. **Ulandik — endi o'quvchi amaliyotidagi namuna: `users` va `posts`, ikki bog'langan jadval**
   Ovoz: «PostgreSQL terminali ishlayapti. Endi Mongo'dagi blogni PostgreSQL'da quramiz. Namuna tasodifiy emas: o'quvchi m4-03 amaliyotida qog'ozda aynan shu ikki jadvalni yozadi, users va posts. Siz ularni haqiqiy bazada yaratasiz.»
2. **Mongo'da baza o'zi paydo bo'lardi, bu yerda avval `CREATE DATABASE`, keyin `\c`**
   Ovoz: «Mongo'da baza birinchi yozuvda o'zi paydo bo'lardi. PostgreSQL'da uni avval yaratasiz: create database blog. Keyin teskari chiziqcha c blog bilan unga o'tasiz. Prompt'ga qarang: endi postgres emas, blog.»
   ```
   postgres=# CREATE DATABASE blog;
   CREATE DATABASE
   postgres=# \c blog
   blog=#
   ```
3. **`users`: `id` o'zi o'sadi va takrorlanmaydi, `username` bo'sh bo'lmaydi va takrorlanmaydi**
   Ovoz: «Birinchi jadval users. id ustuni serial primary key: raqam o'zi o'sadi va hech qachon takrorlanmaydi. username matn, yonida ikki qoida: not null, ya'ni bo'sh bo'lmaydi, va unique, ya'ni ikki foydalanuvchida bir xil nom bo'lmaydi.»
   ```
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username TEXT NOT NULL UNIQUE
   );
   CREATE TABLE
   ```
4. **Yozishda ikki xato tez-tez chiqadi: jadval allaqachon bor va tushib qolgan vergul**
   Ovoz: «Qo'lda yozganda ikki xato tez-tez chiqadi. Jadval allaqachon bor bo'lsa, already exists: demak siz uni oldin yaratgansiz. Vergul tushib qolsa, syntax error, va PostgreSQL terminali strelka bilan qaysi so'z oldida xato borligini ko'rsatadi. Vergulni qo'yib, buyruqni qayta yurgizasiz.»
   ```
   blog=# CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);
   ERROR:  relation "users" already exists

   blog=# CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
   ERROR:  syntax error at or near "name"
   LINE 1: CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
                                                    ^
   ```
   Tuzatish (yashil): `CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT);` → `CREATE TABLE`
5. **Xulosa: baza avval yaratiladi; `syntax error` bo'lsa — strelka ko'rsatgan so'zdan oldin qarang**
   Ovoz: «Xulosa: PostgreSQL'da baza oldin yaratiladi va unga teskari chiziqcha c bilan o'tiladi. Ustunning turi va qoidalari jadval bilan birga yoziladi. Syntax error chiqsa, strelka ko'rsatgan so'zdan oldingi joyni tekshiring, odatda u yerda vergul yo'q.»
- Manba: `pg1-out/06-jadvallar.txt`, `19-amaliyot-xatolari.txt`, `22-tuzatishlar.txt` (tuzatilgan `tags`).

## 12 · `posts` va tashqi kalit  ← `Lesson`
- Kicker: `3-bosqich · jadval va bog'lanish` · Sarlavha: **`REFERENCES users(id)` — Mongo'dagi `ref`, lekin bazaning o'zida**
- Sahna: terminal oynasi; 2-segmentda `\d posts` jadvali, pastdagi «Foreign-key constraints» qatori qizil ramkada; 4-segmentda xato (qizil) → `\c blog` → natija (yashil).
1. **`users` jadvali tayyor. Endi ikkinchi jadval — `posts`: har post `user_id` orqali muallifiga bog'lanadi**
   Ovoz: «users jadvali tayyor. Endi ikkinchi jadvalni yaratamiz: postlar saqlanadigan posts jadvali. Har postda muallifning id'si saqlanadi, xuddi Mongo'dagi author kabi. Farqi user id qatorining oxirida: references users id. Bu tashqi kalit: user id ustunida faqat users jadvalida bor id turishi mumkin.»
   ```
   CREATE TABLE posts (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id),
     izoh TEXT NOT NULL
   );
   CREATE TABLE
   ```
2. **`\d posts` — jadval tuzilishi; pastda baza o'zi nom bergan tashqi kalit qatori**
   Ovoz: «Teskari chiziqcha dt jadvallar ro'yxatini, teskari chiziqcha d posts esa jadval tuzilishini ko'rsatadi: ustunlar, turlari, bo'sh bo'la oladimi. Eng pastda Foreign-key constraints qatori. Nomini baza o'zi berdi: jadval, ustun va fkey. Bu nomni keyin xato xabarida ko'rasiz.»
   ```
   blog=# \d posts
    Column  |  Type   | Nullable |              Default
   ---------+---------+----------+-----------------------------------
    id      | integer | not null | nextval('posts_id_seq'::regclass)
    user_id | integer | not null |
    izoh    | text    | not null |
   Foreign-key constraints:
       "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
   ```
3. **Uch foydalanuvchi va uch post qo'shildi: `INSERT 0 3` — oxirgi raqam qatorlar soni**
   Ovoz: «Endi ma'lumot. Uch foydalanuvchi: ali, vali va sardor. Uch post: ikkitasi ali'niki, bittasi vali'niki. sardor'ning posti yo'q, bu to'rtinchi bosqichda kerak bo'ladi. Javobdagi insert, nol, uch: oxirgi raqam qo'shilgan qatorlar soni.»
   ```
   INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');
   INSERT 0 3
   INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');
   INSERT 0 3
   ```
   Ekranda izoh: «SQL matnida apostrof ikki marta yoziladi: `o''rgandim`».
4. **Boshqa bazada tursangiz jadval «yo'q» bo'ladi: prompt'ga qarang va `\c blog` qiling**
   Ovoz: «Sinfda eng ko'p chiqadigan xatolardan biri. O'quvchi PostgreSQL terminalini qayta ochadi va darhol select qiladi: relation posts does not exist. Jadval bor, faqat u postgres bazasida turibdi. Prompt'ga qarang: postgres. Teskari chiziqcha c blog qilinsa, o'sha so'rov uchala postni ko'rsatadi.»
   ```
   postgres=# SELECT * FROM posts;
   ERROR:  relation "posts" does not exist
   LINE 1: SELECT * FROM posts;
                         ^
   postgres=# \c blog
   blog=# SELECT * FROM posts;
    id | user_id |         izoh
   ----+---------+----------------------
     1 |       1 | Birinchi post
     2 |       1 | Bugun Nest o'rgandim
     3 |       2 | Salom hammaga
   (3 rows)
   ```
5. **Xulosa: tashqi kalit bog'lanishni bazaga yozadi; `does not exist` bo'lsa — avval prompt**
   Ovoz: «Xulosa: references bog'lanishni bazaning o'ziga yozadi, Mongo'dagi ref'dan farqi shu. Teskari chiziqcha d bilan istalgan jadval tuzilishini ko'rasiz. Relation does not exist chiqsa, jadvalni qayta yaratishga shoshilmang: avval prompt'dagi baza nomini tekshiring.»
- Manba: `pg1-out/06-jadvallar.txt` (`CREATE TABLE posts`, `\dt`, `\d posts`), `07-insert.txt`, `10-relation-yoq.txt` (`postgres` bazasida). `\c blog` dan keyingi `SELECT` — `07-insert.txt` dagi natija.

## 13 · Baza o'zi tekshiradi  ← `Lesson`
- Kicker: `3-bosqich · jadval va bog'lanish` · Sarlavha: **Mongo xato bermagan joyda PostgreSQL `ERROR` beradi**
- Sahna: tepada qoida-chiziq «qaysi jadval · qaysi qoida · qaysi qiymat» — har xatoda xabarning shu uch bo'lagi uch rangda yonadi; ostida terminal (har segmentda bitta xato); 4-segmentda Mongo kartasi (`author: null`) bilan yonma-yon.
1. **Mongo'dagi ikki tajribani PostgreSQL'da takrorlaymiz — xabarni uch savol bilan o'qiymiz**
   Ovoz: «To'rtinchi ekranda Mongo yo'q muallifga postni xato bermay saqlagan edi. Endi o'sha tajribalarni PostgreSQL'da qilamiz. Har xato xabarini uch savol bilan o'qiymiz: qaysi jadval, qaysi qoida va qaysi qiymat. To'rtta xato bor, hammasini haqiqiy bazada oldik.»
2. **Bo'sh `username` va takrorlangan `ali`: `NOT NULL` va `UNIQUE` rad etdi**
   Ovoz: «Birinchi ikkitasi oddiy. Bo'sh username: users jadvali, not null qoidasi, yozuv saqlanmadi. Yana ali: unique qoidasi, detail qatorida aniq qiymat, ali allaqachon bor. Mongo'da bu qoidalar Mongoose sxemasida edi, bu yerda jadvalning o'zida.»
   ```
   blog=# INSERT INTO users (username) VALUES (NULL);
   ERROR:  null value in column "username" of relation "users" violates not-null constraint
   DETAIL:  Failing row contains (4, null).

   blog=# INSERT INTO users (username) VALUES ('ali');
   ERROR:  duplicate key value violates unique constraint "users_username_key"
   DETAIL:  Key (username)=(ali) already exists.
   ```
3. **Yo'q muallifga post: Mongo saqlagan edi, PostgreSQL tashqi kalit bilan rad etdi**
   Ovoz: «Endi asosiysi: to'qson to'qqizinchi foydalanuvchiga post. Mongo buni xato bermay saqlagan edi. PostgreSQL rad etdi. O'qiymiz: jadval posts, qoida posts user id fkey, ya'ni tashqi kalit, qiymat esa detail qatorida: user id to'qson to'qqiz users jadvalida yo'q.»
   ```
   blog=# INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');
   ERROR:  insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"
   DETAIL:  Key (user_id)=(99) is not present in table "users".
   ```
4. **Teskari tomoni ham qo'riqlanadi: posti bor foydalanuvchini o'chirib bo'lmaydi**
   Ovoz: «Tashqi kalit teskari tomondan ham ishlaydi. ali'ni o'chirib ko'rdik: rad etildi, chunki uning postlari bor. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda. Ya'ni bazada egasiz post qolmaydi.»
   ```
   blog=# DELETE FROM users WHERE id = 1;
   ERROR:  update or delete on table "users" violates foreign key constraint "posts_user_id_fkey" on table "posts"
   DETAIL:  Key (id)=(1) is still referenced from table "posts".
   ```
5. **Xulosa: xabarda jadval, qoida nomi va `DETAIL`dagi qiymat — sababi shu uchtasida**
   Ovoz: «Xulosa: PostgreSQL'da qoida buzilsa, yozuv saqlanmaydi va xabar sababni o'zi aytadi. O'quvchi xato ko'rsatsa, uchta savol bilan birga o'qing: qaysi jadval, qoida nomi va detail qatoridagi qiymat. Javob deyarli doim detail qatorida.»
- Manba: `pg1-out/08-tekshiruv-xatolari.txt` (4 xato); Mongo tomoni — `17-mongo.txt` (2-blok).

## 14 · Tekshiruv 2 — `DELETE` rad etildi  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **O'quvchi `DELETE FROM users WHERE id = 1;` yozdi va shu xabarni oldi. Nega?**
- Xabar (sahnada, haqiqiy):
  ```
  ERROR:  update or delete on table "users" violates foreign key constraint "posts_user_id_fkey" on table "posts"
  DETAIL:  Key (id)=(1) is still referenced from table "posts".
  ```
- Ovoz: «Xatolarni o'qishni ko'rdingiz, endi o'zingiz o'qing. Ikkinchi tekshiruv. O'quvchi birinchi foydalanuvchini o'chirmoqchi bo'ldi va ekrandagi xabarni oldi. Uch savolni eslang: qaysi jadval, qaysi qoida, qaysi qiymat. Nega o'chmadi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Bu foydalanuvchining postlari bor — `posts` unga ishora qiladi · 2 `users` jadvali `blog` bazasida yo'q · 3 `id = 1` bo'lgan foydalanuvchi topilmadi · 4 `DELETE` uchun boshqa foydalanuvchining paroli kerak
- To'g'ri (ovoz): «To'g'ri. Qoida posts user id fkey, tashqi kalit. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda, ya'ni bu foydalanuvchining postlari bor. Baza egasiz post qoldirmaydi. Demak, foydalanuvchini o'chirish kerak bo'lsa, avval uning postlari, keyin uning o'zi o'chiriladi.» · qisqa: «`posts_user_id_fkey`: `Key (id)=(1)` hali `posts`da bor — avval postlar, keyin foydalanuvchi.»
- Xato izohlari: 2 — «Jadval yo'q bo'lsa xabar `relation "users" does not exist` bo'lardi.» · 3 — «Topilmasa xato bo'lmaydi: `DELETE 0`. Bu yerda baza qoida nomini aytyapti.» · 4 — «Xabarda parol haqida hech narsa yo'q. Qoida nomini o'qing.»
- Maslahat: «Xabardagi qoida nomini va `DETAIL` qatorini o'qing: qaysi jadval hali bu foydalanuvchiga ishora qilyapti?»
- Tuzatilgan (`after`, M2): `DELETE FROM posts WHERE user_id = 1;` → `DELETE 2` · `DELETE FROM users WHERE id = 1;` → `DELETE 1` (yashil).
- Manba: `pg1-out/08-tekshiruv-xatolari.txt` (4-blok), `10-relation-yoq.txt`, `22-tuzatishlar.txt` (`DELETE 2` · `DELETE 1` · yo'q id → `DELETE 0`).

## 15 · Amaliyot 2 — ikki bog'langan jadval  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **`blog` bazasi: `users`, `posts` va tashqi kalit** · `tableAt: 3`
1. **Endi siz: `blog` bazasini va ikki bog'langan jadvalni o'zingiz yaratasiz**
   Ovoz: «Endi o'zingiz qilasiz: blog bazasi, users va posts jadvallari, keyin ma'lumot. Besh qadam, o'n-o'n besh daqiqa. Buyruqlarni nusxalash mumkin, lekin har birini o'qib, nima qilishini aytib ko'ring.»
2. **1–4-qadam: baza, ikki jadval va ma'lumot; har buyruqdan keyin javob satrini tekshiring**
   Ovoz: «Birinchi: baza va teskari chiziqcha c. Ikkinchi va uchinchi: users, keyin posts. Tartib muhim: posts users'ga ishora qiladi, shuning uchun users birinchi. To'rtinchi: uch foydalanuvchi va uch post.»
3. **5-qadam: tashqi kalit xatosini o'zingiz chiqaring; isbot — `\d posts`dagi kalit qatori**
   Ovoz: «Beshinchi: to'qson to'qqizinchi foydalanuvchiga post yozib, tashqi kalit xatosini o'zingiz chiqaring va detail qatorini o'qing. Isbot maydoniga teskari chiziqcha d posts natijasidagi Foreign-key qatorini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ikki bog'langan jadval bor va baza noto'g'ri yozuvni o'zi rad etishini o'z ko'zingiz bilan ko'rasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Baza | `psql -U postgres` · `CREATE DATABASE blog;` · `\c blog` | `CREATE DATABASE` · prompt `blog=#` |
  | 2 | `users` | `CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);` | `CREATE TABLE` |
  | 3 | `posts` | `CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);` · `\dt` | `CREATE TABLE` · 2 jadval |
  | 4 | Ma'lumot | `INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');` · `INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');` | `INSERT 0 3` · `INSERT 0 3` |
  | 5 | Xatoni chiqaring | `INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');` · `\d posts` | `violates foreign key constraint "posts_user_id_fkey"` · `Key (user_id)=(99) is not present` |
- Isbot: «`\d posts` natijasidagi Foreign-key qatori» · placeholder: «`\d posts` chiqishidan kalit qatorini shu yerga qo'ying» · KOD: `/posts_user_id_fkey/` va `/references\s+users\s*\(id\)/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `ERROR:  relation "users" already exists` | jadval oldin yaratilgan — `\d users` bilan ko'ring, keyingi qadamga o'ting |
  | `ERROR:  syntax error at or near "…"` | `^` ko'rsatgan so'zdan oldin vergul yoki qavs tushib qolgan |
  | `ERROR:  relation "posts" does not exist` | boshqa bazadasiz (prompt `postgres=#`) — `\c blog` |
  | `ERROR:  database "blog" already exists` | baza oldin yaratilgan — `\c blog` va davom eting |
  | Prompt `postgres-#` / `blog-#` | `;` unutilgan — `;` yozib Enter |
  | 5-qadamda `INSERT 0 1` | `REFERENCES users(id)` yozilmagan — `\d posts`da kalit qatori yo'q; `DROP TABLE posts;` va 3-qadamni qayta |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg1-out/06-jadvallar.txt`, `07-insert.txt`, `08-tekshiruv-xatolari.txt`, `10-relation-yoq.txt`, `19-amaliyot-xatolari.txt`, `22-tuzatishlar.txt` (`already exists`), `23-references-unutilgan.txt` (kalitsiz `INSERT 0 1` → `DROP TABLE` → kalit bilan xato).

---

## 16 · `JOIN` va `LEFT JOIN`  ← `Lesson`
- Kicker: `4-bosqich · JOIN` · Sarlavha: **`JOIN … ON users.id = posts.user_id` — PostgreSQL'dagi `populate`**
- Sahna: chapda ikki kichik jadval (`users` 3 qator, `posts` 3 qator), `ON` segmentida `posts.user_id` va `users.id` orasida chiziqlar; o'ngda terminal — so'rov va natija; 3-segmentda `sardor` qatori (bo'sh izoh) yonadi.
1. **Ikki jadval bog'langan — endi «har post muallifi bilan» bitta javobda kerak**
   Ovoz: «Ikki jadval bor va ular bog'langan. Endi Mongo'dagi populate kabi natija kerak: har post yonida muallifning nomi. PostgreSQL'da buni bitta so'rov qiladi, JOIN.»
2. **`FROM posts` — asosiy jadval, `JOIN users` — qo'shiladigan, `ON` — qaysi ustun qaysiga teng**
   Ovoz: «So'rovni bo'lakma-bo'lak o'qiymiz. Select qaysi ustunlar kerakligini aytadi: muallif nomi va izoh. From posts, asosiy jadval. Join users, unga qo'shiladigan jadval. On satri esa eng muhimi: users jadvalidagi id posts'dagi user id'ga teng bo'lsin. Natija uch qator, har post o'z muallifi bilan.»
   ```
   SELECT users.username, posts.izoh
   FROM posts
   JOIN users ON users.id = posts.user_id;
    username |         izoh
   ----------+----------------------
    ali      | Birinchi post
    ali      | Bugun Nest o'rgandim
    vali     | Salom hammaga
   (3 rows)
   ```
3. **`sardor` ko'rinmadi: posti yo'q; `LEFT JOIN` juftsiz foydalanuvchini ham chiqaradi**
   Ovoz: «Natijada sardor yo'q, chunki uning posti yo'q. JOIN faqat jufti topilgan qatorlarni chiqaradi. Hamma foydalanuvchi kerak bo'lsa, users'dan boshlaymiz va left join yozamiz. Endi to'rt qator, sardor'ning izohi bo'sh.»
   ```
   SELECT users.username, posts.izoh
   FROM users
   LEFT JOIN posts ON posts.user_id = users.id;
    username |         izoh
   ----------+----------------------
    ali      | Birinchi post
    ali      | Bugun Nest o'rgandim
    vali     | Salom hammaga
    sardor   |
   (4 rows)
   ```
4. **O'quvchi darsida JOIN — «ikki jadvalni id orqali bog'lash»; siz `ON` satrini ko'rsatasiz**
   Ovoz: «O'quvchi darsida JOIN kodsiz ko'rsatiladi: ikki jadvalni id orqali bog'lash. Sinfda o'quvchi so'rasa, siz aynan shu on satrini ko'rsatasiz: qaysi jadvalning qaysi ustuni qaysisiga teng. Xatoning ko'pi ham shu satrda bo'ladi.»
5. **Xulosa: `JOIN` — juftlari borlar, `LEFT JOIN` — chapdagining hammasi; tekshiruv `ON` satrida**
   Ovoz: «Xulosa: JOIN faqat jufti borlarni chiqaradi, left join esa chapdagi jadvalning hamma qatorini. On satrida tashqi kalit, user id, boshqa jadvalning id'siga tenglanadi. Bu satr xato yozilsa nima bo'lishini keyingi tekshiruvda ko'rasiz.»
- Manba: `pg1-out/09-join.txt` (1- va 3-so'rov); o'quvchi darsi `DbSqlNosqlLesson.jsx` Screen5 («Ikki jadvalni id orqali bog'lang»).

## 17 · Tekshiruv 3 — xatosiz, lekin noto'g'ri natija  ← `LineCheck`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4 — qaysi satr xato?` · Sarlavha: **So'rov xatosiz ishladi, lekin «Bugun Nest o'rgandim»ni vali yozgandek chiqdi**
- Shart (`task`): «Qoida: `ON` satri `posts`dagi tashqi kalitni — `user_id`ni — `users.id`ga tenglaydi. Bu so'rov xato bermadi, lekin natija noto'g'ri: ikkinchi postni ali yozgan, natijada esa vali. **Xato satrni bosing.**»
- Ovoz (`q`): «JOIN'ni ko'rdingiz, endi xato topamiz. Uchinchi tekshiruv. Bu so'rov xato bermadi, baza javob qaytardi. Lekin natija noto'g'ri: «Bugun Nest o'rgandim» ali'niki, bu yerda esa vali'niki bo'lib chiqqan. Qoidani eslang: on satri tashqi kalitni tenglaydi. Xato satrni bosing.»
- Sahna: terminal (Explorer yo'q — KOD 1); yonida haqiqiy noto'g'ri natija:
  ```
   username |         izoh
  ----------+----------------------
   ali      | Birinchi post
   vali     | Bugun Nest o'rgandim      ← noto'g'ri
   sardor   | Salom hammaga             ← noto'g'ri
  (3 rows)
  ```
- Kod (`target` — 3-satr):
  ```sql
  1  SELECT users.username, posts.izoh
  2  FROM posts
  3  JOIN users ON users.id = posts.id;      ← xato satr
  ```
- Tuzatilgan (`fixed`): 3-satr `posts.id` chizilgan, yashil `posts.user_id`; `fixedExtra`: to'g'ri natija (ali · ali · vali, 3 rows).
- To'g'ri (ovoz, `ok`): «To'g'ri. Uchinchi satrda users id posts'ning o'z id'siga tenglangan, tashqi kalitga emas. Baza xato bermaydi, chunki ikkalasi ham son: u shunchaki birinchi postni birinchi foydalanuvchiga, ikkinchisini ikkinchisiga ulaydi. Ekranda tuzatilgan holat: posts user id, va natija to'g'ri. Demak, on satrida doim tashqi kalit ustuni turadi, ya'ni posts user id.»
- Qisqa (`okShort`): «3-satr: `posts.id` — postning raqami, muallif emas. Xato chiqmaydi, lekin natija noto'g'ri. Tuzatildi: `posts.user_id`.»
- Maslahat (`hint`): «1- va 2-satr nimani va qayerdan olishni aytadi. Ikki jadval qaysi ustunlar bo'yicha ulanayotganini qidiring.»
- Manba: `pg1-out/09-join.txt` (2-so'rov — «ON satri xato» va 1-so'rov — to'g'ri natija).

## 18 · Amaliyot 3 — JOIN  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **`JOIN`, xato `ON` va `LEFT JOIN` — o'z bazangizda** · `tableAt: 3`
1. **Endi siz: o'z `blog` bazangizda uch so'rovni yurgizasiz va natijalarni solishtirasiz**
   Ovoz: «Endi o'z blog bazangizda uchta so'rov yurgizasiz. O'n daqiqa. Har birining natijasini oldingisi bilan solishtiring: qaysi qatorlar bor, qaysi biri yo'q va nega.»
2. **1–2-qadam: to'g'ri `JOIN`, keyin `ON`ni ataylab buzing va natijani solishtiring**
   Ovoz: «Birinchi: to'g'ri JOIN, uch qator. Ikkinchi: on satrida user id o'rniga id yozing. Xato chiqmaydi, lekin mualliflar almashadi. Buni o'z ko'zingiz bilan ko'ring, sinfda o'quvchiga aynan shuni ko'rsatasiz.»
3. **3–4-qadam: `LEFT JOIN` va sardor; isbot — natija ostidagi qatorlar soni**
   Ovoz: «Uchinchi: left join, users'dan boshlab. sardor bo'sh izoh bilan chiqishi kerak. To'rtinchi: natija ostida qavs ichida qatorlar soni yozilgan. Isbot maydoniga left join natijasidagi qatorlar sonini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, JOIN natijasining to'g'riligini on satri hal qiladi: xato on xato bermaydi, lekin mualliflarni almashtirib yuboradi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | JOIN | `SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.user_id;` | 3 qator: ali · ali · vali |
  | 2 | Xato ON | o'sha so'rov, `ON users.id = posts.id` | xato yo'q; ali · vali · sardor — mualliflar noto'g'ri |
  | 3 | LEFT JOIN | `SELECT users.username, posts.izoh FROM users LEFT JOIN posts ON posts.user_id = users.id;` | sardor — bo'sh izoh bilan |
  | 4 | Sanash | 3-qadam natijasining oxirgi satri | `(… rows)` |
- Isbot: «`LEFT JOIN` natijasidagi qatorlar soni» · placeholder: «natija ostidagi sonni yozing» · KOD: `/^\s*\(?\s*4\b/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `ERROR:  relation "posts" does not exist` | boshqa bazadasiz — `\c blog` |
  | `(0 rows)` | `INSERT`lar boshqa bazada qilingan yoki qilinmagan — `SELECT * FROM posts;` bilan tekshiring, Amaliyot 2 ning 4-qadami |
  | `ERROR:  syntax error at or near "…"` | `^` ko'rsatgan joydan oldin vergul yoki nuqta tushib qolgan |
  | sardor `LEFT JOIN`da ham yo'q | `FROM posts LEFT JOIN users` yozilgan — `FROM users` dan boshlang |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg1-out/09-join.txt`, `10-relation-yoq.txt`, `19-amaliyot-xatolari.txt`, `22-tuzatishlar.txt` (`FROM posts LEFT JOIN users` — 3 qator, sardor yo'q).

---

## 19 · Oxirgi telefon  ← `Lesson`
- Kicker: `5-bosqich · ishonchlilik` · Sarlavha: **Bitta telefon, ikki xaridor: ikkinchisi kutadi va `UPDATE 0` oladi**
- Sahna: tepada `products` qatori (`Telefon | stock 1` → `0`); ostida **ikki terminal oynasi yonma-yon** («1-xaridor», «2-xaridor»), vaqt chizig'i (0 s · 1 s · 3 s); 2-oynada kutish belgisi ⏳ (3-segment), keyin natija (4-segment).
1. **O'quvchi darsidagi eng esda qoladigan misol: bitta telefon, ikki xaridor bir lahzada**
   Ovoz: «Endi o'quvchi darsidagi eng esda qoladigan misol. Do'konda bitta telefon qoldi, ikki kishi bir lahzada sotib olish tugmasini bosdi. O'quvchi darsi aytadi: SQL uni faqat bittasiga sotadi. Biz buni ikkita PostgreSQL terminali oynasida haqiqatan sinab ko'rdik.»
2. **`products` jadvali: `stock` — qoldiq, `CHECK (stock >= 0)` — manfiy bo'lishi taqiq**
   Ovoz: «Avval jadval: products. Nomi va stock, ya'ni omborda nechta qolgani. stock yonida check qoidasi: qoldiq noldan kichik bo'lmasin. Telefondan bitta.»
   ```
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     nomi TEXT NOT NULL,
     stock INT NOT NULL CHECK (stock >= 0)
   );
   INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);
   ```
3. **1-xaridor telefonni oldi, tranzaksiya hali ochiq; 2-xaridorning so'rovi kutib turibdi**
   Ovoz: «Birinchi xaridor: begin, keyin update: stock'ni bittaga kamaytir, faqat stock noldan katta bo'lsa. Javob: qoldiq nol, update bir. Tranzaksiya hali yopilmagan. Bir soniyadan keyin ikkinchi xaridor xuddi shu update'ni yuboradi. U javob olmaydi, kutib turadi: birinchi xaridor bu qatorni band qilgan.»
   ```
   -- 1-xaridor (0 s)                         -- 2-xaridor (1 s)
   BEGIN;                                       UPDATE products SET stock = stock - 1
   UPDATE products SET stock = stock - 1          WHERE id = 1 AND stock > 0 RETURNING stock;
     WHERE id = 1 AND stock > 0 RETURNING stock;  ⏳ kutyapti…
    stock
   -------
        0
   UPDATE 1
   ```
4. **1-xaridor `COMMIT` qildi — 2-xaridor darhol `UPDATE 0`: telefon tugagan**
   Ovoz: «Uchinchi soniyada birinchi xaridor commit qiladi. Shu zahoti ikkinchi xaridorning so'rovi davom etadi, shartni qayta tekshiradi: stock endi nol, noldan katta emas. Javob: nol qator, update nol. Ilova shu nolni ko'rib «Kechirasiz, mahsulot tugagan» deydi. Oxirida stock nol, telefon bitta sotildi.»
   ```
   COMMIT;                                      (0 rows)
   COMMIT                                       UPDATE 0
   ```
5. **Xulosa: telefonni so'rovdagi shart va qator qulfi saqladi; `CHECK` — ikkinchi himoya**
   Ovoz: «Xulosa: telefonni ikki narsa saqladi. Birinchisi so'rovdagi shart, stock noldan katta. Ikkinchisi qator qulfi: ikkinchi xaridor birinchisini kutdi. Shart yozilmasa, check qoidasi to'xtatadi: sinab ko'rdik, qoldiq minus bir bo'ladigan update rad etildi.»
   ```
   UPDATE products SET stock = stock - 1 WHERE id = 1;
   ERROR:  new row for relation "products" violates check constraint "products_stock_check"
   DETAIL:  Failing row contains (1, Telefon, -1).
   ```
- Manba: `pg1-out/11-products.txt`, `12-oxirgi-telefon.txt` (2-xaridor 1 s da boshladi, ikkalasi 3,08 s da tugadi — kutgan), `13-check.txt`.

## 20 · Hammasi yoki hech narsa  ← `Lesson`
- Kicker: `5-bosqich · ishonchlilik` · Sarlavha: **Tranzaksiya: buyurtma va ombor birga yoziladi — yoki birortasi ham yozilmaydi**
- Sahna: terminal; tepada ikki jadval kartasi (`orders` · `products`), har qadamda o'zgarish rangli: buyurtma qatori paydo bo'ladi (sariq, «hali tasdiqlanmagan») → xato (qizil) → `ROLLBACK` — qator yo'qoladi; 4-segmentda Mongo kartasi.
1. **Haqiqiy do'konda sotish ikki ish: buyurtma yoziladi va ombor kamayadi**
   Ovoz: «Oxirgi telefonni bitta update himoya qildi. Lekin haqiqiy do'konda sotish ikki ish: orders jadvaliga buyurtma yoziladi va products'da qoldiq kamayadi. Biri bajarilib, ikkinchisi bajarilmasa, bazada yolg'on paydo bo'ladi: buyurtma bor, telefon esa omborda turibdi.»
   ```
   CREATE TABLE orders (
     id SERIAL PRIMARY KEY,
     product_id INT NOT NULL REFERENCES products(id),
     xaridor TEXT NOT NULL
   );
   ```
2. **`BEGIN` ichida buyurtma yozildi, ombor esa `CHECK` bilan rad etildi — telefon allaqachon tugagan**
   Ovoz: «Telefon allaqachon sotilgan, stock nol. vali uchun ikkala ishni bitta tranzaksiyada qilamiz. Begin, buyurtma yozildi, insert bir. Keyin ombor: check qoidasi rad etdi, qoldiq minus bir bo'lardi.»
   ```
   BEGIN;
   INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
   INSERT 0 1
   UPDATE products SET stock = stock - 1 WHERE id = 1;
   ERROR:  new row for relation "products" violates check constraint "products_stock_check"
   ```
3. **`COMMIT` yozildi, lekin baza `ROLLBACK` qildi: `orders` bo'sh, yarim ish saqlanmadi**
   Ovoz: «Endi commit yozamiz. Lekin javobga qarang: commit emas, rollback. Tranzaksiya ichida xato bo'lgani uchun baza hammasini bekor qildi. orders jadvali bo'sh: vali'ning buyurtmasi ham saqlanmadi. Bu hammasi yoki hech narsa degani.»
   ```
   COMMIT;
   ROLLBACK
   SELECT * FROM orders;
    id | product_id | xaridor
   ----+------------+---------
   (0 rows)
   ```
4. **Halol solishtirish: oxirgi telefonni Mongo ham bittaga sotdi, farq — bir nechta jadvalda**
   Ovoz: «Endi halol solishtirish. Oxirgi telefonni MongoDB'da ham sinadik: shartli update bilan u ham bittaga sotdi, chunki bitta hujjatni o'zgartirish Mongo'da ham bo'linmaydi. Farq bir nechta hujjatda: oddiy o'rnatilgan MongoDB serverida tranzaksiya ishlamadi. PostgreSQL'da esa bir nechta jadval oddiy o'rnatishda ham bitta tranzaksiyada.»
   Mongo kartasi: `updateOne({ stock: { $gt: 0 } }, { $inc: { stock: -1 } })` → xaridor1 `modifiedCount: 0` · xaridor2 `modifiedCount: 1` · `stock: 0` | tranzaksiya → `XATO: This MongoDB deployment does not support retryable writes.`
5. **Xulosa: bir nechta jadval birga o'zgarsa — `BEGIN … COMMIT`; xato bo'lsa hammasi bekor**
   Ovoz: «Xulosa: bir nechta jadval birga o'zgarishi kerak bo'lsa, ularni begin va commit orasiga olasiz. Ichida bitta xato bo'lsa, baza hammasini bekor qiladi. O'quvchi darsi oxirgi telefonni tranzaksiya deb atagan, bu soddalashtirish: buni yigirma yettinchi ekranda ko'ramiz.»
- Manba: `pg1-out/18-hammasi-yoki-hech.txt`, `17-mongo.txt` (4–6-blok: oxirgi telefon, standalone `mongod`da tranzaksiya xatosi; `retryWrites=false` bilan ham o'sha xabar). MongoDB rasmiy hujjati: tranzaksiya replica set yoki sharded cluster'da ishlaydi (darsda «oddiy o'rnatilgan server» deyiladi).

## 21 · JSON ham saqlaydi  ← `Lesson`
- Kicker: `5-bosqich · ishonchlilik` · Sarlavha: **`jsonb` ustuni: har qatorda har xil maydon — jadval ichida**
- Sahna: terminal; 3-segmentda natija jadvali — `extra` ustunidagi JSON yashil `{ }` kartalar ko'rinishida (4-ekrandagi Mongo kartalariga o'xshash); 4-segmentda filtrlangan natija.
1. **Mongo'da har hujjat har xil edi — PostgreSQL'da ham shunday ustun bor**
   Ovoz: «O'quvchi darsida PostgreSQL'ning yana bir afzalligi aytiladi: JSON ham saqlaydi. To'rtinchi ekranda Mongo'da har hujjat har xil bo'lishini ko'rgan edik. PostgreSQL'da ham shunday joy bor: jsonb turidagi ustun.»
2. **`ALTER TABLE` bilan `extra JSONB` ustuni qo'shildi — eski qatorlar bo'sh qoladi**
   Ovoz: «products jadvaliga alter table bilan extra degan ustun qo'shamiz, turi jsonb. Jadval o'zgardi, telefon qatorida bu ustun bo'sh.»
   ```
   ALTER TABLE products ADD COLUMN extra JSONB;
   ALTER TABLE
   ```
3. **Futbolkada rang va o'lcham, quloqchinda rang va bluetooth — bitta jadvalda**
   Ovoz: «Ikki mahsulot qo'shamiz. Futbolkada rang va o'lcham, quloqchinda rang va bluetooth. Maydonlar har xil, lekin ikkalasi bitta jadvalda. Nom va qoldiq esa oddiy ustunlarda, ularning qoidalari joyida qoladi.»
   ```
   INSERT INTO products (nomi, stock, extra) VALUES
     ('Futbolka', 12, '{"rang": "qora", "olcham": "M"}'),
     ('Quloqchin', 5, '{"rang": "oq", "bluetooth": true}');
      nomi    |               extra
   -----------+-----------------------------------
    Telefon   |
    Futbolka  | {"rang": "qora", "olcham": "M"}
    Quloqchin | {"rang": "oq", "bluetooth": true}
   ```
4. **JSON ichidagi maydon bo'yicha qidirish mumkin: rangi qora mahsulot — futbolka**
   Ovoz: «JSON ichidagi maydon bo'yicha qidirish ham mumkin. Strelka va ikki burchak qavs bilan rang maydonining matnini olamiz va qora rangni qidiramiz. Javob: futbolka.»
   ```
   SELECT nomi, extra->>'rang' AS rang FROM products WHERE extra->>'rang' = 'qora';
      nomi   | rang
   ----------+------
    Futbolka | qora
   ```
5. **Xulosa: asosiy maydon — ustun va qoida bilan, erkin qo'shimcha — `jsonb`da**
   Ovoz: «Xulosa: muhim va hamma qatorda bor maydon oddiy ustunda turadi, qoidasi bilan. Har mahsulotda har xil bo'ladigan qo'shimcha esa jsonb'da. O'quvchi «PostgreSQL JSON ham saqlaydi» degan gapni so'rasa, aynan shu misolni ko'rsating.»
- Manba: `pg1-out/14-jsonb.txt`; o'quvchi darsi Screen10 («JSON ham saqlaydi»).

## 22 · Tekshiruv 4 — buyurtma qayerda?  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **`BEGIN` → buyurtma yozildi → ombor `CHECK` xatosi → `COMMIT`. `orders` jadvalida nima bor?**
- Sahna (haqiqiy, oxiri yopiq):
  ```
  BEGIN;
  INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
  INSERT 0 1
  UPDATE products SET stock = stock - 1 WHERE id = 1;
  ERROR:  new row for relation "products" violates check constraint "products_stock_check"
  COMMIT;
  ????
  ```
- Ovoz: «Tranzaksiyani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Tranzaksiya ichida buyurtma yozildi, insert bir, keyin ombor check qoidasi bilan rad etildi va commit yozildi. orders jadvalida nima qoldi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 vali'ning buyurtmasi, chunki `INSERT 0 1` chiqqan edi · 2 Hech narsa: baza hammasini bekor qildi, `ROLLBACK` · 3 Buyurtma va `stock = -1` · 4 Buyurtma bor, lekin `COMMIT` xato beradi
- To'g'ri (ovoz): «To'g'ri, hech narsa. Tranzaksiya ichida xato bo'lgani uchun commit'ga baza rollback deb javob berdi va hammasini bekor qildi. insert bir chiqqan edi, lekin u hali tasdiqlanmagan edi. orders bo'sh, nol qator. Demak, tranzaksiya ichida bitta xato bo'lsa, undagi hamma o'zgarish bekor bo'ladi.» · qisqa: «`COMMIT` → `ROLLBACK`: xatoli tranzaksiya to'liq bekor. `orders` — `(0 rows)`.»
- Xato izohlari: 1 — «`INSERT 0 1` tranzaksiya ichida edi va tasdiqlanmagan. `COMMIT`ning javobiga qarang.» · 3 — «`CHECK` qoidasi `-1` ni rad etdi — bunday qator yozilmaydi.» · 4 — «`COMMIT` xato bermaydi, javobi boshqa so'z. U nima deydi?»
- Maslahat: «Xatoli tranzaksiyada `COMMIT` nima deb javob berishini eslang — 20-ekranning 3-qadami.»
- Manba: `pg1-out/18-hammasi-yoki-hech.txt`.

## 23 · Amaliyot 4 — ikki oyna  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **Oxirgi telefonni ikki terminal oynasida o'zingiz soting** · `tableAt: 3`
1. **Endi siz: ikki terminal oynasini yonma-yon ochib, oxirgi telefonni o'zingiz sotasiz**
   Ovoz: «Oxirgi amaliyot, eng qiziqarlisi. Ikkita terminal oynasini yonma-yon oching, ikkalasida PostgreSQL terminalini ochib, teskari chiziqcha c blog yozing. Biri birinchi xaridor, ikkinchisi ikkinchi xaridor. O'n-o'n besh daqiqa.»
2. **1–2-qadam: `products` va bitta telefon; 1-oynada `BEGIN` va `UPDATE`, `COMMIT`siz**
   Ovoz: «Birinchi: products jadvali va bitta telefon. Ikkinchi: birinchi oynada begin, keyin update. Qoldiq nol bo'ladi. Muhim: commit'ni hali yozmang, tranzaksiya ochiq tursin.»
3. **3–4-qadam: 2-oyna kutadi, 1-oynada `COMMIT`; isbot — 2-oynadagi oxirgi satr**
   Ovoz: «Uchinchi: ikkinchi oynada xuddi shu update'ni yuboring. U javob bermaydi, kutib turadi. To'rtinchi: birinchi oynada commit yozing va ikkinchi oynaga qarang. Isbot maydoniga ikkinchi oynada chiqqan oxirgi satrni yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi qadam ixtiyoriy, jsonb. To'rtta majburiy katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, oxirgi telefonni shart va tranzaksiya saqlab qoladi: ikkinchi xaridor kutadi va hech narsa olmaydi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadval | `CREATE TABLE products (id SERIAL PRIMARY KEY, nomi TEXT NOT NULL, stock INT NOT NULL CHECK (stock >= 0));` · `INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);` | `CREATE TABLE` · `INSERT 0 1` |
  | 2 | 1-oyna | `BEGIN;` · `UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;` — **`COMMIT`siz** | `stock 0` · `UPDATE 1` |
  | 3 | 2-oyna | `UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;` | javob yo'q — kutyapti |
  | 4 | 1-oyna | `COMMIT;` → 2-oynaga qarang | 1-oyna: `COMMIT` · 2-oyna: `(0 rows)` va oxirgi satr |
  | 5 | (ixtiyoriy) jsonb | `ALTER TABLE products ADD COLUMN extra JSONB;` · 21-ekrandagi `INSERT` va `SELECT` | `Futbolka | qora` |
- Isbot: «2-oynadagi oxirgi satr» · placeholder: «ikkinchi oynada chiqqan oxirgi satrni yozing» · KOD: `/^\s*update\s+0\s*$/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2-oyna kutmadi, darhol `UPDATE 0` | 1-oynada `COMMIT` allaqachon yozilgan (yoki `BEGIN` yo'q) — telefon oldin sotilgan; `UPDATE products SET stock = 1 WHERE id = 1;` va 2-qadamdan qayta |
  | 2-oyna kutdi, lekin `UPDATE 1` | telefon 1 tadan ko'p (`INSERT` ikki marta) — `SELECT id, nomi, stock FROM products;` bilan ko'ring, `UPDATE products SET stock = 1 WHERE id = 1;` va 2-qadamdan qayta |
  | `violates check constraint "products_stock_check"` | `WHERE … stock > 0` tushib qolgan — `CHECK` to'xtatdi (19-ekran, 5-qadam) |
  | `ERROR:  relation "products" does not exist` | 2-oyna boshqa bazada — `\c blog` |
  | `ERROR:  relation "products" already exists` | jadval oldin yaratilgan (masalan 21-ekrandan) — 2-qadamga o'ting |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg1-out/11-products.txt`, `12-oxirgi-telefon.txt`, `13-check.txt`, `10-relation-yoq.txt`, `19-amaliyot-xatolari.txt`, `14-jsonb.txt`, `24-telefon-holatlar.txt` (A: `COMMIT`dan keyin 2-oyna 0,08 s da `UPDATE 0` · B: `stock = 2` — 2-oyna kutdi, 3,08 s da `UPDATE 1`).

---

## 24 · Sinf kompyuterlari: m4-06 dan oldin  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Sarlavha: **Sinf kompyuterlari: har birida `psql -U postgres` ochilsin**
- Sahna: «Darsdan oldin» tekshiruv ro'yxati (4 band, segment bilan yonadi, har birida ☐ → ☑); 2-segmentda o'quvchi darslari chizig'i: m4-03 (kodsiz) → m4-06 CRUD → m4-08 `psql -U postgres` (qizil belgi «PostgreSQL shu yerda kerak»); 4-segmentda terminal — tekshiruv buyrug'i va javobi.
1. **O'zingizda ishladi — endi sinf: o'quvchi kompyuterlariga PostgreSQL'ni siz o'rnatasiz**
   Ovoz: «Mavzuni o'zingiz qo'l bilan o'tdingiz. Endi sinf. O'quvchi darslarida PostgreSQL'ni o'rnatish hech qayerda o'rgatilmaydi: m4-08 darsi psql minus U postgres buyrug'ini va o'rnatishda berilgan parolni tayyor deb kutadi. Shuning uchun sinf kompyuterlariga uni siz o'rnatasiz.»
2. **m4-03 kodsiz — PostgreSQL m4-06 dan kerak; o'rnatishni m4-03 dan keyin, m4-06 dan oldin qiling**
   Ovoz: «Vaqti: m4-03 kodsiz dars, unda baza kerak emas. m4-06 da o'quvchi so'rov yozishni boshlaydi. Demak, o'rnatishni m4-03 va m4-06 orasida qiling. Har kompyuterga yettinchi va sakkizinchi ekrandagi yo'l bilan, PATH'ni unutmang.»
3. **Hamma kompyuterda bitta parol: o'quvchi uni loyiha sozlamasiga yozadi**
   Ovoz: «Parol hamma kompyuterda bir xil bo'lsin va o'quvchilarga aytiladi, chunki keyingi darslarda u loyihaning env faylida kerak. Bir fakt: kursdagi Nest loyihasining env example faylida parol password deb yozilgan. Sinf paroli shu bo'lsa, o'quvchi faylni o'zgartirmaydi.»
4. **Har kompyuterda bitta buyruq bilan tekshiring — kompyuterni qayta yoqqandan keyin ham**
   Ovoz: «Tekshiruv har kompyuterda bitta buyruq: psql minus U postgres, minus c va select version. PostgreSQL versiyasi chiqsa, kompyuter tayyor. Kompyuterni qayta yoqib, yana bir marta tekshiring: server o'zi ishga tushishi kerak.»
   ```
   $ psql -U postgres -c "SELECT version();"
    PostgreSQL 18.4 … 64-bit
   (1 row)
   ```
5. **Xulosa: m4-06 dan oldin har kompyuterda — o'rnatish, PATH, bitta parol, tekshiruv buyrug'i**
   Ovoz: «Xulosa: m4-06 dan oldin har sinf kompyuterida to'rt narsa. PostgreSQL o'rnatilgan, psql buyrug'i PATH'da, parol hammada bir xil va tekshiruv buyrug'i qayta yoqilgandan keyin ham versiyani ko'rsatadi. Xato chiqsa, birinchi amaliyotdagi jadval sizga yordam beradi.»
- Ro'yxat (sahna va eslatma): ☐ PostgreSQL 18 (Windows: EDB · Mac: Postgres.app) · ☐ `psql` PATH'da (yangi terminalda `psql --version`) · ☐ sinf paroli — hammada bir xil · ☐ `psql -U postgres -c "SELECT version();"` — qayta yoqilgandan keyin ham.
- Manba: PRD (o'quvchi darslarida o'rnatish yo'q; m4-08 `psql -U postgres`); `IntroNestArxitechture/.env.example` (`DEV_DB_URL=postgres://postgres:password@localhost:5432/…` — M10); `pg1-out/02-version.txt` (`-c` bilan).

## 25 · m4-03 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4-03 · «SQL vs NoSQL — nega PostgreSQL»` · Sarlavha: **m4-03: kodsiz dars — siz bugun hammasini qo'l bilan qildingiz**
- Sahna: o'quvchi darsi xaritasi — 5 blok kartasi (segment bilan yonadi), har kartada «Siz qo'shasiz» qatori; 5-segmentda vaqt chizig'i.
- Bloklar (o'quvchi darsidan, `SCREEN_META` 21):
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 savol: «SQL ko'rinishimi, NoSQL ko'rinishimi?» → «Ikkalasi ham to'g'ri — vazifaga bog'liq» · s1 reja (5 qadam) | Mongo bilan ishlagan bo'lsangiz — bir gap bilan ayting (3-ekran) |
  | 2 Ikki tur va shakl | s2 jadval / hujjat · s3 kartalarni jadvalga joylash · s4 test | jadvalda ustun turi oldindan, hujjatda erkin (5-ekran) |
  | 3 Kuchlar | s5 JOIN — id orqali bog'lash · s5b test · s6 oxirgi telefon · s7 chat oqimi (NoSQL — hajm) | `ON` satri (16-ekran) · telefonni nima saqlashi (19-ekran) |
  | 4 Qaror | s8 4 mezon: bog'lanish · shakl · ishonchlilik · hajm · s9 test (bank) · s10 nega PostgreSQL (5 sabab) · s11 AI tavsiyasi · s12 test | «JSON ham saqlaydi» — `jsonb` misoli (21-ekran) |
  | 5 Mustahkamlash | s13 moslashtirish (bank, chat, do'kon, loglar) · s14 mif-buster · s15 yakuniy · amaliyot · s15b · kartochkalar · s16 yakun | amaliyotdagi 2 jadval — siz bugun yaratgan `users` / `posts` |
1. **m4-03 kodsiz: o'quvchi jadval va hujjatni ko'radi, lekin `psql` ochmaydi**
   Ovoz: «Endi o'quvchi darsi, m4-03, yigirma bir ekran. U kodsiz: o'quvchi jadval va hujjatni ko'radi, solishtiradi, tanlaydi, lekin PostgreSQL terminalini ochmaydi. Siz bugun hammasini qo'l bilan qildingiz, shuning uchun har blokda bitta qo'shimcha gapingiz bor.»
2. **Kirish va shakl: «ikkalasi ham to'g'ri», keyin jadval va hujjat farqi**
   Ovoz: «Dars savol bilan boshlanadi: SQL ko'rinishimi yoki NoSQL? To'g'ri javob: ikkalasi ham, vazifaga bog'liq. Keyin ikki tur va shakl: o'quvchi kartalarni jadval ustunlariga joylaydi. Siz qo'shasiz: jadvalda ustun turi oldindan yoziladi, hujjatda esa maydon erkin.» · 1–2-blok
3. **Kuchlar bloki — siz bugun ko'rgan JOIN va oxirgi telefon; chat esa NoSQL kuchi**
   Ovoz: «Uchinchi blok sizga eng tanish: JOIN, oxirgi telefon va chat oqimi. O'quvchi JOIN'ni id orqali bog'lash deb ko'radi, siz on satrini aytasiz. Chat misolida NoSQL kuchi: juda ko'p oddiy xabar, bog'lanish kam. Buni inkor qilmang, bu to'g'ri.» · 3-blok
4. **Qaror ko'rsatkichi to'rtta savoldan iborat; amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi**
   Ovoz: «To'rtinchi va beshinchi blokda o'quvchi qaror qabul qilishni o'rganadi. Qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. Keyin nega PostgreSQL tanlanganini va AI tavsiyasini loyihaga moslashtirishni ko'radi. Amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi va ikki jadvalni qog'ozda yozadi: namunasi siz bugun yaratgan users va posts.» · 4–5-blok
5. **Xulosa: o'quvchi tanlashni o'rganadi, siz har gapni bazada ko'rsata olasiz**
   Ovoz: «Xulosa: m4-03 da o'quvchi tanlashni o'rganadi, kod yozmaydi. Vaqt, taklif: to'qson daqiqa. Kirish va shakl yigirma, kuchlar yigirma besh, qaror va nega PostgreSQL yigirma, mustahkamlash va amaliyot yigirma, yakun besh. Kuchli o'quvchi so'rasa, bugungi PostgreSQL terminalingizni ochib ko'rsating.»
- Manba: `src/4-Modull/DbSqlNosqlLesson.jsx` — `SCREEN_META` (21 qator), Screen0 variantlari, Screen5 (JOIN), Screen6 (oxirgi telefon), Screen7 (chat.uz), Screen8 (4 mezon), Screen10 (5 sabab), amaliyot matni («namuna: `users(id, username)` va `posts(id, user_id, izoh)`»). Vaqt — taklif.

## 26 · O'quvchi darsidagi so'zlar  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Sarlavha: **O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi — siz ularni atama bilan bog'laysiz**
- Sahna: ikki ustunli lug'at kartalari (Nest-2 25-ekran uslubi), guruh-guruh yonadi.
- Lug'at (o'quvchi darsidan aynan):
  | O'quvchi aytadi | Siz bilasiz | Qayerdan |
  |---|---|---|
  | jadval — «Excel jadvaliga o'xshaydi», har qatorda bir xil ustunlar | table, row, column | s2 |
  | hujjat — «papkadagi turli qog'ozlar kabi», `{ }` | document (MongoDB, Firebase) | s2, kartochkalar |
  | ikki jadvalni id orqali bog'lash | `JOIN … ON …`, tashqi kalit | s5 |
  | oxirgi telefon — «SQL bir lahzada faqat bittasiga sotadi», «SQL nazorati» | shartli `UPDATE` + qator qulfi; tranzaksiya | s6, kartochkalar |
  | qaror ko'rsatkichi — 4 savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi, ulkan-oddiy-tez kerakmi | baza tanlash mezonlari | s8, s15 |
  | «NoSQL zamonaviyroq» — mif | tanlov vazifaga bog'liq | s14 |
  | «JSON ham saqlaydi» | `jsonb` | s10 |
1. **O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi, siz esa ikkalasini birga aytasiz**
   Ovoz: «Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi: jadval o'rniga Excel jadvali, hujjat o'rniga papkadagi qog'ozlar. Siz ikkalasini bilasiz va sinfda birga aytasiz: avval o'quvchi darsidagi so'z, keyin haqiqiy atama.»
2. **Jadval — Excel jadvali, hujjat — papkadagi turli qog'ozlar**
   Ovoz: «Jadval Excel jadvaliga o'xshaydi: har qatorda bir xil ustunlar. Hujjat esa papkadagi turli qog'ozlar kabi: har birida o'z maydonlari, jingalak qavs ichida. MongoDB va Firebase o'quvchi darsida hujjatli baza misoli.» · 1–2-juft
3. **O'quvchi darsida JOIN — «id orqali bog'lash», oxirgi telefon esa «SQL nazorati» deb ataladi**
   Ovoz: «O'quvchi darsida JOIN ikki jadvalni id orqali bog'lash deb tushuntiriladi. Oxirgi telefon misoli esa SQL nazorati deb ataladi, uning atamasi tranzaksiya. Darsdagi qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. O'quvchi shu to'rt savolni yodda tutishi kerak.» · 3–5-juft
4. **Xulosa: avval o'quvchining so'zi, keyin atama — «Excel jadvaliga o'xshaydi, ya'ni table»**
   Ovoz: «Xulosa: sinfda so'zlarni juft qilib ayting, masalan: Excel jadvaliga o'xshaydi, buning atamasi table, har qator bitta yozuv. O'xshatish vazifani tushuntiradi. Farqini esa siz ko'rsatasiz: Excel qoidani tekshirmaydi, PostgreSQL esa bo'sh nomni ham, yo'q muallifni ham rad etadi.» · 6–7-juft
- Manba: `DbSqlNosqlLesson.jsx` — Screen2 («Excel jadvaliga o'xshaydi», «Papkadagi turli qog'ozlar kabi»), Screen5, Screen6 («Bu nazorat tranzaksiya deb ataladi»), Screen8, Screen10, Screen14, `DB_FLASHCARDS` («MongoDB, Firebase», «SQL bir lahzada faqat bittasiga sotadi»).

## 27 · Darsdagi soddalashtirishlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Ikki soddalashtirish va o'quvchining besh savoli — tayyor javoblar**
- Sahna: tepada ikki karta «Darsda aytiladi → Aslida» (segment bilan yonadi); pastda «O'quvchi so'rasa» — 5 ta ochiladigan karta (`QA`, ovozsiz, bosib o'qiladi).
- Soddalashtirishlar:
  | Darsda aytiladi | Aslida (sinovdan) | Sinfda nima deysiz |
  |---|---|---|
  | Oxirgi telefonni «SQL nazorati — tranzaksiya» saqlaydi | so'rovdagi shart (`stock > 0`) + qator qulfi; tranzaksiya — bir nechta ishni birga bajarish; Mongo ham bitta hujjatda bittaga sotdi | darsdagi gap yetarli; kuchli o'quvchi so'rasa — «baza shartni qayta tekshiradi, ikkinchi xaridor kutadi» |
  | NoSQL'da «alohida hujjatlarni bog'lash qiyin» | bog'lash bor (`populate`), lekin baza bog'lanishni qo'riqlamaydi: `author: null` xato bermay saqlandi | «bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas» |
- O'quvchi so'rasa (QA kartalari):
  - «Mongo yomonmi?» → Yo'q. Chat, loglar kabi juda ko'p oddiy ma'lumotda qulay. Tanlov vazifaga bog'liq: buni qaror ko'rsatkichining 4 savoli bilan tekshiring.
  - «MySQL'dan farqi nima?» → Ikkalasi ham SQL: jadval, `JOIN`, qoidalar bir xil g'oya. Kursda PostgreSQL, chunki keyingi darslardagi loyihalar shu bilan ishlaydi.
  - «Excel'ning o'zi-ku?» → Ko'rinishi o'xshaydi. Lekin baza qoidani o'zi tekshiradi (bo'sh nom, yo'q muallif — rad) va bir vaqtda ko'p odam yozsa ham adashmaydi (oxirgi telefon).
  - «Firebase nima?» → Google'ning hujjatli bazasi, NoSQL; darsda MongoDB bilan birga misol.
  - «Nega `id` 1, 2, 3, Mongo'dagidek uzun emas?» → `SERIAL` — o'zi o'sadigan raqam; Mongo'da `_id` ObjectId. Ikkalasi ham noyob.
1. **Darsning ikki joyi soddalashtirilgan — sinovda ko'rganingiz bilan solishtiramiz**
   Ovoz: «Oxirgi tayyorgarlik. O'quvchi darsida ikki joy soddalashtirilgan. Bu xato emas, o'smir uchun shunday aytilgan. Lekin siz haqiqatni bilishingiz kerak, chunki kuchli o'quvchi albatta so'raydi.»
2. **Oxirgi telefon: darsda «tranzaksiya», aslida shart va qulf — Mongo ham bittaga sotdi**
   Ovoz: «Birinchisi oxirgi telefon. Darsda uni SQL nazorati, tranzaksiya saqlaydi deyiladi. Sinovda ko'rdingiz: telefonni so'rovdagi shart va qator qulfi saqladi, Mongo ham bittaga sotdi. Darsdagi gap yetarli. So'rashsa ayting: baza shartni qayta tekshiradi, ikkinchi xaridor kutadi.» · 1-karta
3. **NoSQL'da bog'lash bor, lekin uni baza emas, kod qo'riqlaydi**
   Ovoz: «Ikkinchisi: darsda NoSQL'da hujjatlarni bog'lash qiyin deyiladi. Aslida bog'lash bor, populate'ni o'zingiz bilasiz. Farqi boshqa joyda: Mongo yo'q muallifni xato bermay saqladi. Sinfda shunday ayting: bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas.» · 2-karta
4. **O'quvchining besh savoli: Mongo, MySQL, Excel, Firebase va qisqa `id`**
   Ovoz: «Pastda o'quvchining besh savoliga tayyor javoblar bor: Mongo yomonmi, MySQL'dan farqi, Excel'ning o'zi emasmi, Firebase nima va nega id qisqa. Kartani bosib o'qing. Eng ko'p beriladigani Excel haqidagi savol.»
5. **Xulosa: Mongo'ni yomonlamang — tanlov to'rt savol bilan, farqni bazada ko'rsating**
   Ovoz: «Xulosa: sinfda Mongo'ni yomonlamang, o'zingiz ko'rdingiz, u ko'p narsani qila oladi. Tanlovni doim qaror ko'rsatkichining to'rt savoli bilan asoslang. Farqni so'z bilan emas, PostgreSQL terminalida ko'rsating: yo'q muallifga post yozing va xabarni birga o'qing.»
- Manba: `pg1-out/12-oxirgi-telefon.txt`, `17-mongo.txt`; `DbSqlNosqlLesson.jsx` Screen6 («Bu nazorat tranzaksiya deb ataladi»), Screen5 test izohi («Alohida hujjatlarni bog'lash qiyin — ma'lumot takrorlanadi»), `DB_FLASHCARDS` («MongoDB, Firebase»); repo `IntroNestArxitechture` (PostgreSQL, TypeORM).

## 28 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz** (mexanika va ovoz Nest-1 S27 bilan bir xil; qaytganda M12 bo'yicha).
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — xato bo'lsa qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Mongo'dagi `populate()` PostgreSQL'da nima bilan qilinadi? | `REFERENCES` · `JOIN … ON …` · `CREATE TABLE` · `SERIAL` | 2 | `JOIN` so'rov paytida ikki jadvalni ulaydi; `REFERENCES` — `ref`ning jufti. | 5 |
  | 2 | Mac'da `psql -U postgres` → `role "postgres" does not exist`. Nima qilasiz? | `createuser -s postgres` · Parolni qayta kiritaman · Postgres.app'ni qayta Initialize qilaman · `CREATE DATABASE postgres;` | 1 | Homebrew bilan o'rnatilgan: superuser — Mac foydalanuvchisi, `postgres` roli yo'q. | 8 |
  | 3 | `users`da 99-foydalanuvchi yo'q. `INSERT INTO posts (user_id, izoh) VALUES (99, '…');` nima qaytaradi? | `INSERT 0 1`, muallif bo'sh · `users`ga 99 qo'shiladi · Tashqi kalit xatosi, post saqlanmaydi · `NOT NULL` xatosi | 3 | `posts_user_id_fkey`: `Key (user_id)=(99) is not present in table "users"`. | 13 |
  | 4 | Prompt `postgres=#`. `SELECT * FROM posts;` → `relation "posts" does not exist`, lekin jadvalni yaratgansiz. Nima qilasiz? | Jadvalni qayta yarataman · Serverni qayta ishga tushiraman · Parolni tekshiraman · `\c blog` | 4 | Jadval `blog` bazasida; prompt boshqa bazani ko'rsatyapti. | 12 |
  | 5 | Postsiz foydalanuvchi ham natijada chiqishi kerak. Qaysi so'rov? | `FROM users LEFT JOIN posts ON …` · `FROM posts JOIN users ON …` · `JOIN`siz `SELECT * FROM users, posts` · `ON` satrini olib tashlash | 1 | `LEFT JOIN` chapdagi jadvalning hamma qatorini chiqaradi; sardor — bo'sh izoh bilan. | 16 |
  | 6 | 1-xaridor `BEGIN` + `UPDATE … WHERE stock > 0` qildi, `COMMIT` hali yo'q. 2-xaridor xuddi shu `UPDATE`ni yubordi. Nima bo'ladi? | Darhol `UPDATE 1`, telefon ikkalasiga · Kutadi, 1-xaridor `COMMIT`dan keyin `UPDATE 0` · Darhol `CHECK` xatosi · `stock = -1` bo'ladi | 2 | Qator band — 2-xaridor kutadi, keyin shartni qayta tekshiradi: `stock` 0. | 19 |
  | 7 | Tranzaksiya ichida xato chiqdi, keyin `COMMIT;` yozildi. psql nima deb javob beradi? | `COMMIT` · `ERROR` · Hech narsa · `ROLLBACK` | 4 | Xatoli tranzaksiya bekor qilinadi: `COMMIT;` → `ROLLBACK`, `orders` bo'sh. | 20 |
  | 8 | O'quvchi: «NoSQL zamonaviyroq, onlayn do'konimga MongoDB olaman». Nima deysiz? | To'g'ri, NoSQL yangiroq · MongoDB sekin, olmang · 4 savol: buyurtma, mahsulot, to'lov bog'langan, xato qimmat — PostgreSQL · Farqi yo'q, istaganini oling | 3 | Tanlov modaga emas, vazifaga qarab; do'konda 3 mezon SQL tomonda. | 27 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan` (Nest-1 bilan bir xil); `onFinished` maydonlari o'zgarmaydi.

## 29 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13: (1) Barakalla / qayta topshirish maslahati → (2) animatsion xulosa — ma'lumot yo'li sxemasi (nuqta yuradi: so'rov → `psql` → qoidalar `NOT NULL · UNIQUE · REFERENCES · CHECK` → jadval → `JOIN` → javob), 6 band birin-ketin yonadi → (3) uyga vazifa → (4) eslatma → (5) «Darsni yakunlash».
- Xulosa 6 band (har biri 1–2 gap ovozda, sxemaning o'z bekati yonadi):
  1. Mongo ↔ PostgreSQL: collection — jadval, document — qator, `ref` — `REFERENCES`, `populate` — `JOIN`; qoida Mongo'da kodda, PostgreSQL'da jadvalda.
  2. O'rnatish: Windows — EDB o'rnatuvchisi, parol, port 5432, `bin` PATH'ga; Mac — Postgres.app; Homebrew bo'lsa `createuser -s postgres`.
  3. Baza o'zi tekshiradi: `NOT NULL` · `UNIQUE` · tashqi kalit · `CHECK`; xabar — qaysi jadval · qaysi qoida · qaysi qiymat (`DETAIL`).
  4. `JOIN`: `ON`da tashqi kalit `id`ga tenglanadi; xato `ON` — xatosiz, lekin noto'g'ri natija; `LEFT JOIN` — juftsizlar ham.
  5. Oxirgi telefon: shart + qator qulfi → `UPDATE 0`; tranzaksiya — hammasi yoki hech narsa; `jsonb` — erkin qo'shimcha.
  6. Sinf: m4-06 dan oldin har kompyuterda `psql -U postgres -c "SELECT version();"`; m4-03 kodsiz — har blokda bitta qo'shimcha gapingiz bor.
- Segment ovozlari: a — «Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.» / o'tmagan: «Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.» · b1…b6 — yuqoridagi bandlar · hw — uyga vazifa · c — eslatma · z — «Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.»
- **Uyga vazifa** (M14; ovoz `hw`): «Uyga vazifa: o'quvchining amaliyotini o'zingiz to'liq qiling, lekin haqiqiy bazada. Bitta loyiha g'oyasini oling, masalan onlayn do'kon. README'da to'rt savolga javob yozing va bazani tanlang. Keyin uchta fayl: schema'da ikki bog'langan jadval, data'da ma'lumot, queries'da JOIN va left join. Bir marta tashqi kalit xatosini ataylab chiqaring va detail qatorini README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Repo va g'oya | `blog-db` (yoki o'z nomingiz) · `README.md`: g'oya bir gapda + qaror ko'rsatkichining 4 savoliga javob (bog'langanmi, shakli qat'iymi, xato qimmatmi, ulkan-oddiy-tez kerakmi) + tanlov | README'da 4 javob va «PostgreSQL» / «NoSQL» + sabab |
  | 2 | `schema.sql` | 2 bog'langan jadval: `PRIMARY KEY`, kamida bitta `NOT NULL`, bitta `UNIQUE`, `REFERENCES` · `psql -U postgres -c "CREATE DATABASE <baza>;"` · `psql -U postgres -d <baza> -f schema.sql` | `CREATE TABLE` ×2 · `\d <jadval>`da Foreign-key qatori |
  | 3 | `data.sql` | har jadvalga 3+ qator, bitta qator juftsiz (sardor kabi) · `psql -U postgres -d <baza> -f data.sql` | `INSERT 0 …` |
  | 4 | `queries.sql` | `JOIN` va `LEFT JOIN` · `psql -U postgres -d <baza> -f queries.sql` | `LEFT JOIN`da qatorlar `JOIN`dan bittaga ko'p |
  | 5 | Buzish | yo'q `id` bilan `INSERT` → xabar → `DETAIL` satri README'ga | `violates foreign key constraint` · `is not present in table` |
  | 6 | Topshirish | `git add . && git commit -m "blog-db"` · `git push` → repo linki platformadagi uyga vazifaga (Telegram, skrinshot yo'q — M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi nimaga qaraydi: README'da 4 javob va asoslangan tanlov · `schema.sql`da `REFERENCES` · `queries.sql`da `JOIN` va `LEFT JOIN` · README'da haqiqiy `DETAIL` satri. Eslatma: `-f` bilan yurgizilganda xato oldiga `psql:schema.sql:N:` qo'shiladi — bu qaysi satr ekanini aytadi.
- **Eslatma** (bir sahifa, nusxalash / `.md`): Mongo ↔ PostgreSQL lug'ati · o'rnatish: Windows (EDB, parol, 5432, PATH) va Mac (Postgres.app, PATH buyrug'i, Homebrew → `createuser -s postgres`) · `psql` buyruqlari (`-U`, `-d`, `-c`, `-f`, `\l`, `\c`, `\dt`, `\d`, `\q`; `;` va `postgres-#`) · `CREATE DATABASE` / `CREATE TABLE` namunasi · qoidalar va xabar o'qish formulasi · `JOIN` / `LEFT JOIN` · oxirgi telefon (2 oyna) va `BEGIN … COMMIT` / `ROLLBACK` · `jsonb` · ulanish xatolari jadvali (Amaliyot 1) · sinf kompyuterlari ro'yxati (24-ekran) · m4-03 xaritasi va ikki soddalashtirish · o'quvchi tili (7 juft) · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **PostgreSQL: CRUD so'rovlar** — `INSERT`, `SELECT`, `UPDATE`, `DELETE` o'quvchi m4-06 darsi va m4-08 AvtoIjara loyihasi uchun».

---

## «KOD» — qurishda (dvigatelga tegmay, faqat shu darsning bo'laklarida)
1. **`psql` sahnasi:** terminal oynasi komponenti (sarlavha `psql — blog`, prompt rangi alohida, natija jadvali monospace). Explorer yo'q (loyiha fayli yo'q — «Ochiq savollar» 1). 19- va 23-ekranda ikki oyna yonma-yon (1280 da ustma-ust).
2. **Mongo sahnasi (2–3):** `Ide`, `root: 'mongo-blog'`, fayllar `node_modules/` (yopiq) · `blog.js` · `package.json`; `blog.js` — `drive-pg1.sh` 17-bo'limidan qisqartirilgan, ekranda belgi.
3. **Maketlar (6, 7):** o'rnatuvchi va Postgres.app oynalari — CSS maket, haqiqiy skrinshot emas; har birida «⚠ rasmiy hujjatdan, sinalmagan».
4. **Chiqishlar:** `pg1-out/` dan aynan; sinovdagi portlar (5434, 5439) ekranda 5432; `psql -f` qo'shimchasi `psql:<fayl>:N:` olib tashlangan (README farqlar). Uzun `version` va `\l` qatorlari `…` bilan qisqartiriladi.
5. **LineCheck `target` 0 dan sanaladi:** 17-ekran: MD'dagi 3-satr → `target={2}`; `tree` berilmaydi (psql).
6. **✅ 01.11 avtopilot: yurgizildi** (`drive-pg1.sh` 22–24-bo'lim → `pg1-out/22…24`); bitta tuzatish: «telefon 2 ta» holatida 2-oyna darhol emas, kutib `UPDATE 1` oladi — 23-ekran jadvali moslandi. Avvalgi ro'yxat: 11-ekran tuzatilgan `CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT);` · 14-ekran `after`: `DELETE FROM posts WHERE user_id = 1;` → `DELETE FROM users WHERE id = 1;` va topilmagan `id` uchun `DELETE 0` · 15-ekran: `CREATE DATABASE blog;` ikkinchi marta, `DROP TABLE posts;` · 18-ekran: `FROM posts LEFT JOIN users` natijasi · 23-ekran: `COMMIT`dan keyin 2-oyna (darhol `UPDATE 0`), `stock = 2` holati, `UPDATE products SET stock = 1`. Natija mos kelmasa — MD matni natijaga moslanadi.
7. **Isbotlar:** 9 — `/^\s*PostgreSQL \d{2}/` · 14 — `/posts_user_id_fkey/` va `/references\s+users\s*\(id\)/i` · 17 — `/^\s*\(?\s*4\b/` · 22 — `/^\s*update\s+0\s*$/i`.
8. **27-ekran QA kartalari** — Nest-1 S26 komponenti, ovozsiz (bosib ochiladi).
9. **29-ekran xulosa sxemasi** — `SummaryMap`ning yangi varianti: 6 bekat (so'rov · psql · qoidalar · jadval · JOIN · javob).
10. **RU** — UZ yopilgandan keyin, `pg1/parts/08-ru.jsx` (M24); atamalar inglizcha, SQL ichidagi o'zbekcha qiymatlar (`'Birinchi post'`, `izoh`) — haqiqiy chiqish, tarjima qilinmaydi (qaror kerak — «Ochiq savollar» 5).

## Ochiq savollar ([GATE M] da hal qilinadi)
1. **Explorer'siz `psql` sahnasi** — M1 «loyiha fayli ko'rsatilgan har sahnada» deydi; bu darsning ko'p sahnasi terminal, fayl yo'q. Taklif: terminal oynasi, Explorer'siz (uyga vazifada — `blog-db` Explorer bilan).
2. **O'rnatuvchi maketlari** — haqiqiy Windows/Mac skrinshoti yo'q (bu kompyuter Linux). Taklif: CSS maket + «⚠ rasmiy hujjatdan». Muqobil: siz Windows/Mac'da skrinshot olib berasiz.
3. **Sinf paroli** — 24-ekranda «Nest loyihasining `.env.example`ida `password`» fakti aytiladi va «shu bo'lsa, o'zgartirmaydi» deyiladi. Bu tavsiya sifatida qolsinmi yoki faqat «bitta parol» deyilsinmi?
4. **Hajm** — 29 ekran, ~1 soat 10 daqiqa (PRD taxmini 22–26 ekran, ~1 soat). Qisqartirish kerak bo'lsa nomzodlar: 21-ekran (`jsonb`) 20-ga qo'shiladi · 26-ekran 25-ga qo'shiladi.
5. **RU'da SQL qiymatlari** — `'Birinchi post'`, `izoh` ustuni o'zbekcha; ruscha versiyada ham shunday qolsinmi (haqiqiy chiqish) yoki ruscha yurgizish qilinsinmi?

## O'quvchi darslari uchun alohida ish (qaror kerak; mentor darsida aytiladi, o'quvchi darsiga hozir tegilmaydi)
1. **m4-03 amaliyot matni:** «Kod yozilmaydi — daftar yoki og'zaki bo'ladi» — «daftar» so'zi taqiq (memory `daftar-sozi-taqiq`).
2. **m4-03 Screen6 / kartochka:** «Bu nazorat tranzaksiya deb ataladi» — soddalashtirish (27-ekran); o'zgartirish kerakmi — qaror.
3. **O'rnatish o'quvchi darslarida yo'q** — m4-06 dan oldin sinf kompyuterlari mentor zimmasida (24-ekran); o'quvchi darsiga «PostgreSQL ishlayaptimi?» tekshiruvi qo'shilsinmi — qaror.
