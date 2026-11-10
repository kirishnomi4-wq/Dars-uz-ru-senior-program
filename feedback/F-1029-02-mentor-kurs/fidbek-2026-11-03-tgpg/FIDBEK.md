# Fidbek 03.11.2026 (~16:00) — Vercel ko'rik sayti, foydalanuvchi mentor ko'zi bilan

Manba: https://coddycamp-mentor-kurs.vercel.app · rasmlar shu papkada `1.png … 6.png`.
Tartib (foydalanuvchi): **1-qadam — PostgreSQL fidbeki tuzatiladi, 2-qadam — Telegraf darsi.**
Foydalanuvchining umumiy gapi: «endi men darslarni ko'rib, texnik bilim olyapmanmi yo'qmi ko'rib, feedbacklarimni beraveraman · bugun darslarni haqiqiy darsday qilamiz».

---

## 1-TUR · PostgreSQL darsi

### F-1103-09 · Mongo'dagi buyruqlar bilan solishtirish
**Foydalanuvchi (aynan):** «savolim masalan create database yoki insert into lar mongodbda bor shu uchun postgresql ga qoshmaymizmi»

**Tashxis:**
- MongoDB'da `CREATE DATABASE` yo'q: `use shop` dan keyin birinchi yozuvda baza o'zi paydo bo'ladi. `CREATE TABLE` ham yo'q: kolleksiya birinchi yozuvda o'zi yaratiladi, ustun va qoida yo'q. `INSERT INTO` o'rnida `insertOne` / `insertMany`, `SELECT … WHERE` o'rnida `find({…})`, `UPDATE`/`DELETE` o'rnida `updateOne`/`deleteOne`.
- PG-1 da solishtiruv bor (MD 28, 173, 340-qator: «Mongo'da baza o'zi paydo bo'lardi, bu yerda avval `CREATE DATABASE`»).
- PG-2 (MD v2) da Mongo **0 marta** — mentor yangi buyruqni o'zi bilgan narsaga bog'lay olmaydi.

**Taklif:** PG-2 2-ekran CRUD jadvaliga «MongoDB'da» ustuni (haqiqiy `mongosh` yurgizishi bilan) + 3-ekranda `CREATE DATABASE` / `CREATE TABLE` yonida bir gap: Mongo'da bu qadam yo'q, baza va kolleksiya birinchi yozuvda paydo bo'ladi.

**Aniqlashtirish (foydalanuvchi, 03.11 kech):** fidbek Telegram darsiga emas, IKKALA PostgreSQL darsiga: «ikkita psql darsini ko'rdim, insert into'larni mongodb bilan ko'rmadim». PG-1 tushunchalarni solishtirgan, buyruqlarni emas; PG-2 da Mongo yo'q edi.

**Holat (qo'shimcha, 03.11 kech):** PG-2 v2 qurildi — 2/3/4/5/9-ekran Mongoose qatorlari va tuzoq kartasi darsda (surat ✓).

**Holat:** ✅ 03.11 kech — 8 bandli reja tasdiqlandi («tasdiqlayman, aniq, shoshilmasdan, halol»). Haqiqiy Mongoose yurgizish `pg2-out/v2d-mongoose.txt`. **PG-1 qurildi va saytda:** lug'at +4 buyruq qatori, 12-ekranda `User.create` va `Post.find()` xira qatorlari. **PG-2 v2 matnida:** 2-ekran Mongoose ustuni, 3/4/5-ekran `.mk-pair` qatorlari, 9-ekran tuzoq kartasi (`updateOne({})` → matchedCount 1 vs `WHERE`'siz UPDATE → hammasi) — qurilganda kiradi. Qonun M45. Kunduzgi mongosh varianti eskirgan deb belgilandi.

---

## 2-TUR · Telegraf + PostgreSQL darsi (TgPg, `?dars=tgpg-01`)

### F-1103-07 · «Holat» so'zi — 1.png (1-ekran, reja)
**Foydalanuvchi (aynan):** «xolat sozi vapshe tushunarsiz bunaqa sozlar ishlatmaylik holat deganda mentor korsa kulvoradi yomon tushunadi uyat bu istasang inglizcha atamasii bilan bolsin degandimku xolatni vaziyat yoki nimadr deyish kkkda»

**Tashxis:** TgPg da «holat» 207 marta: ovoz, kalit gap, reja («Holat», «Holat PostgreSQL'da»), sarlavha («holatsiz bot», «xotiradagi holat»), kodda ustun nomi `holat` va boshqa o'zbekcha kod nomlari (`tanlov`, `ism`, `'ISM_KUTYAPMAN'`) — F-1027-01 «kod nomlari inglizcha» qoidasiga ham zid. Boshqa darslarda 6–52 marta, ko'pi umumiy ma'noda («ekran holati») — ajratib ko'riladi.

**Taklif:** inglizcha atama **state**; birinchi uchragan joyda bir marta izoh («state — bot foydalanuvchi haqida eslab qolgan ma'lumot: qaysi qadamda turgani, nimani tanlagani»). Kod nomlari inglizcha (`state`, `choice`, `name`, `'WAITING_NAME'`) → haqiqiy natijalar qayta yurgiziladi.

### F-1103-04 (davomi) · Kod o'raladi — 2.png, 3.png (6-ekran `umumiy.js`)
**Foydalanuvchi (aynan):** «qara 1 qator kod 3 qator bolgan bunday qilmasligimiz kerak Mentor korib oqigisi ham kelmaydi oqisa ham tushunmaydiku» · «oynani kataligiinii qara ammo shu xolatdayam 1 qator bolishi kkli kod 3 qator bolganda bu xato Dizayn jihatiniyam korihs kkda ja bunaqa kritichne xatolar qilmaslik kk hamma narsa qolimizdan keladi nikmadr animatsiya bilan keraksizini yoqotib yuboramzmi shtobe bilmadm muammoni tushunmagan bosang sora tushuntiraaman kn yechim oylaylik»

### F-1103-04 (davomi) · Terminal kod yonida kesiladi — 4.png (14-ekran `bigint.js` + terminal)
**Foydalanuvchi (aynan):** «bu oynada ham kesilgan undan kora pastiga qoysak bolarkanku»

### F-1103-04 (davomi) · Xuddi shu — 5.png (15-ekran `bot.js`)
**Foydalanuvchi (aynan):** «bundayam shu muammo»

**Tashxis (2–5.png):** 1) dvigatel `CodePanel wrap` — `.mk-ln.wrap{white-space:pre-wrap}`: bir qator kod 2–3 qatorga o'raladi; 11 darsda 123 joyda yoqilgan. 2) Sahnada VS Code oynasi va terminal yonma-yon — kod yarim enlikda (yana 218 px Explorer), o'ng tomon bo'sh.

**Taklif (12 darsga dvigatel orqali):** 1) kod hech qachon o'ralmaydi; 2) VS Code oynasi o'ng ustunning to'liq enini oladi, terminal/Postman — kod tagida; 3) uzun qator haqiqiy loyihadagidek (Prettier) bir necha mantiqiy qatorga bo'linadi, satr raqamlari mos; 4) keraksiz qatorlar «⋯ N qator» bo'lib yig'iladi, ustoz gapirayotgan bo'lak ko'rinadi, keyingi bo'lakda animatsiya bilan almashadi. Avval bitta ekran (TgPg 14) surat bilan tasdiqqa.

### F-1103-08 · Tekshiruv ekranida katta bo'sh qora quti — 6.png (21-ekran, Tekshiruv 4)
**Foydalanuvchi (aynan):** «buni qarada katta boshliq qorada nima kerak ??»

**Tashxis:** M42 A variantida `.mc-after>.mk-panel, .mc-proof .mk-panel {flex:1 1 auto}` — panel ustun bo'yiga cho'ziladi; bitta qatorli terminal («Telegram bot ulandi») ekran yarmidan katta qora quti. 12 darsga birdan (dvigatel). Qo'shimcha: birinchi terminalda «— README, «Xatolar» jadvali» — bu terminal chiqishi emas, izoh.

**Taklif:** panel balandligi mazmuniga teng (`flex:0 0 auto`); izoh terminaldan olib tashlanadi.

**Holat:** ✅ 03.11 — dvigatelda (12 dars), 787 → 68 px. Izoh **qoldi**: tekshirildi, bu o'quvchi reposi serverining haqiqiy chiqishi (`manba/tgpg-out/13-token-xato.txt`).

**Holat (2-TUR):** ✅ 03.11 — F-1103-07 state (demo-kod inglizcha, natijalar qayta yurgizildi; repo `holat` ustuni qoldi), F-1103-04 kod oynasi 12 darsga (o'ralmaydi, bitta ustun, Prettier 7 blok; PG-2 15-ekran → v2 da 19-ekran bo'lak-bo'lak ✓ 03.11 kech), F-1103-08 panel. Qonun M43, korpus §MENTOR-STATE. Vercel qayta — shu kun.
