# Mentor kursi · Telegraf + PostgreSQL «Bot eslab qoladi: holat bazada» — MD v1

F-ID: F-1029-02 (Telegraf+PG) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `16-TgPg-PRD.md` v1 (avtopilot takliflari Q1–Q3)
Fayl (quriladi): `src/mentor-kurs/TgPgMentorLesson.jsx` · bo'laklar `src/mentor-kurs/tgpg/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/tgpg-out/` (skript `manba/drive-tgpg.sh`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Telegraf'ni biladigan mentor (eski dastur): handler, `ctx.reply`, BotFather. PostgreSQL-1/2 ni o'tgan. Bot holatini bazada saqlamagan. |
| Dars oxirida mentor | 1) holat nimaligini va nega RAM'da yo'qolishini ko'rsatadi · 2) har mijozni `chat.id` bo'yicha ajratadi · 3) SELECT → INSERT/UPDATE oqimini yozadi · 4) tuzoqlarni biladi: `INTEGER`, BIGINT matn, takror INSERT, token xato · 5) o'quvchi reposi `dars-04-done` ni ishga tushiradi · 6) m5-04 ni o'tadi |
| O'quvchi darsi | **m5-04** «Bot eslab qoladi — holat va PostgreSQL» (21 ekran). |
| Kursdagi o'rni | GitHub Actions → **shu** → WebSocket-1 (M31: raqamsiz) |
| Til | M9. Atamalar: holat (state), holatli bot (stateful), sessiya, `chat.id`, `BIGINT`. |
| Misol-ip | **O'quvchi darsidagi aynan:** AvtoPizza bot, Aziza va Jasur, `users` jadvali (`telegram_id BIGINT NOT NULL UNIQUE`, `ism`, `holat`); o'quvchi reposi `TelegramBotNest` (`dars-04-done`). |
| Haqiqiylik (M10) | 01.11.2026: Telegraf 4.16.3 · pg 8.23.1 · PostgreSQL 18.4 · Node 24. Handler, SQL va qayta ishga tushirish — haqiqiy; **Telegram serveri ishlatilmagan**: xabar `handleUpdate` bilan berildi, javob ushlandi. Telegram ilovasidagi chat — maket «⚠ rasmiy hujjatdan, sinalmagan». Neon — sinalmagan. |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **holat** — suhbat hozir qaysi bosqichda: `ISM_KUTYAPMAN`, `OLCHAM_KUTYAPMAN`. Holatsiz bot har xabarni alohida ko'radi.
- **RAM va baza** — obyektdagi holat dastur xotirasida, qayta ishga tushganda yo'qoladi; PostgreSQL'dagi qoladi.
- **`chat.id`** — har mijozning raqami; holat shu bo'yicha alohida saqlanadi. Umumiy o'zgaruvchi — aralashish.
- **oqim** — har xabarda: SELECT (holatni o'qish) → yo'q bo'lsa INSERT → javob → UPDATE (yangi holat).
- **tuzoqlar** — Telegram id 32 bitdan katta → `INTEGER` sig'maydi, `BIGINT` kerak; node-pg va TypeORM `bigint`ni matn qaytaradi; SELECT'siz takror INSERT → UNIQUE xatosi; token xato → server ishlaydi, bot javob bermaydi.

**Darsning ipi:** holatsiz bot adashadi → RAM'da holat → qayta ishga tushirish → ikki mijoz aralashadi → `chat.id` → `users` jadvali va oqim → qayta ishga tushgach «Yana salom» → buzamiz → o'quvchi reposi `dars-04-done` → m5-04 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Holatsiz bot | Lesson | 1 · holat |
| 3 | Holat obyektda | Lesson | 1 |
| 4 | Qayta ishga tushirish — RAM bo'shadi | Lesson | 1 |
| 5 | Tekshiruv 1 — qaysi holat qoladi | MCRetry | 1 |
| 6 | Umumiy o'zgaruvchi — ikki mijoz aralashdi | Lesson | 2 · alohida |
| 7 | `chat.id` bo'yicha alohida | Lesson | 2 |
| 8 | Tekshiruv 2 — Aziza nima oladi | MCRetry | 2 |
| 9 | `users` jadvali va `BIGINT` | Lesson | 3 · PostgreSQL |
| 10 | Oqim: SELECT → INSERT / UPDATE | Lesson | 3 |
| 11 | Qayta ishga tushgach — «Yana salom» | Lesson | 3 |
| 12 | Amaliyot 1 — bot eslab qolsin | Practice | 3 |
| 13 | `INTEGER` sig'maydi | Lesson | 4 · buzamiz |
| 14 | `BIGINT` matn bo'lib keladi | Lesson | 4 |
| 15 | SELECT'siz takror INSERT | Lesson | 4 |
| 16 | Tekshiruv 3 — qaysi satr | LineCheck | 4 |
| 17 | Amaliyot 2 — ikki buzish | Practice | 4 |
| 18 | O'quvchi reposi `dars-04-done` | Lesson | 5 · o'quvchi reposi |
| 19 | Token xato va `.env` yo'q | Lesson | 5 |
| 20 | Amaliyot 3 — o'quvchi reposi | Practice | 5 |
| 21 | Tekshiruv 4 — server ishlayapti, bot javob bermaydi | MCRetry | 5 |
| 22 | m5-04 xaritasi | Lesson | 6 · ko'prik |
| 23 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** Telegram chat maketi (⚠, javob matnlari — haqiqiy handler'dan) + VS Code (`bot-holat` loyihasi yoki `TelegramBotNest` to'liq Explorer) + terminal/psql (haqiqiy).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Telegraf` · Sarlavha: **Bot javob beradi. Lekin bir daqiqa oldingi gapni eslaydimi?**
- Sahna: reja (6 bosqich); natija — chat: qayta ishga tushirilgandan keyin /start → «Yana salom, Aziza! Menyu uchun /menu ni bosing.» (`12`).
- Reja: 01 Holat · 02 Har mijozga alohida · 03 Holat PostgreSQL'da · 04 Buzamiz · 05 O'quvchi reposi · 06 O'quvchi darsini o'tish
1. **Telegraf'ni bilasiz — bugun botga xotira beramiz: holat bazada**
   Ovoz: «Assalomu alaykum. Telegraf'ni bilasiz: handler, reply, BotFather. Bugun botga xotira beramiz: suhbat qaysi bosqichda ekanini bot eslab qolsin, server qayta ishga tushsa ham.»
2. **Avval holatsiz bot, keyin xotiradagi holat va nega u yo'qoladi**
   Ovoz: «Avval holatsiz bot qanday adashishini ko'ramiz. Keyin holatni dastur xotirasida saqlaymiz va qayta ishga tushirganda nima bo'lishini ko'ramiz.» · reja 01–02
3. **Keyin PostgreSQL'da holat, uni ataylab buzamiz va o'quvchi reposini ishga tushiramiz**
   Ovoz: «Keyin holatni PostgreSQL'ga ko'chiramiz, uni ataylab buzamiz va o'quvchi reposini o'z kompyuteringizda ishga tushiramiz.» · reja 03–05
4. **Olti bosqich, uch amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06
- Manba: `tgpg-out/12-repo-holat-qayta-ishga.txt`.

---

## 2 · Holatsiz bot  ← `Lesson`
- Kicker: `1-bosqich · holat` · Sarlavha: **«Pepperoni» — «Tushunmadim»: bot o'z savolini eslamaydi**
- Sahna: chat maketi + `holatsiz.js` (ikki handler); terminal (haqiqiy, `01`):
  ```
  Aziza (5123456789): Pitsa buyurtma qilaman
    bot → 5123456789: Ajoyib! Qaysi pitsa?
  Aziza (5123456789): Pepperoni
    bot → 5123456789: Nima «Pepperoni»? Tushunmadim.
  ```
1. **O'quvchi darsi shu suhbatdan boshlanadi: bot savol beradi, javobni tushunmaydi**
   Ovoz: «O'quvchi darsi shu suhbatdan boshlanadi. Aziza pitsa buyurtma qilmoqchi. Bot qaysi pitsa deb so'raydi, Aziza pepperoni deydi, bot esa tushunmadim deydi.»
2. **Har xabar alohida keladi: handler oldingi xabarni bilmaydi**
   Ovoz: «Nega? Telegraf'da har xabar alohida keladi va handler faqat shu xabarni ko'radi. Pepperoni so'zi kelganda bot o'zi pitsa so'raganini bilmaydi.»
3. **Javob matnlari haqiqiy Telegraf handler'idan — Telegram oynasi esa maket**
   Ovoz: «Ekrandagi javoblar haqiqiy Telegraf handler'idan olingan. Telegram serveriga ulanmadik: xabarni kod bilan berdik va botning javobini ushladik. Chat oynasi esa maket.»
4. **Xulosa: holatsiz bot har xabarni birinchi xabardek ko'radi — suhbat qayerdaligini bilmaydi**
   Ovoz: «Xulosa: holatsiz bot har xabarni birinchi xabardek ko'radi. Suhbat qayerda turganini biladigan yozuv kerak. Uni holat deymiz.»
- Manba: `tgpg-out/01-holatsiz.txt`; o'quvchi darsi Screen0, Screen2.

## 3 · Holat obyektda  ← `Lesson`
- Kicker: `1-bosqich · holat` · Sarlavha: **`holat[chat.id]`: bot savolini eslab qoldi — suhbat davom etdi**
- Sahna: `xotira.js` (obyekt + uch shart); terminal (`02`, 1-jarayon):
  ```
  Aziza (5123456789): Salom
    bot → 5123456789: Salom! Qaysi pitsa?
  Aziza (5123456789): Pepperoni
    bot → 5123456789: Pepperoni — yaxshi tanlov! Qaysi o'lchamda?
    [xotiradagi holat] {"5123456789":"OLCHAM_KUTYAPMAN"}
  ```
1. **Holatsiz botdan keyin eng oddiy yechim: holatni obyektda saqlash**
   Ovoz: «Eng oddiy yechim: holatni oddiy obyektda saqlash. Kalit chat id, qiymat suhbat bosqichi, masalan pitsa kutyapman.»
2. **Har xabarda bot avval holatga qaraydi, keyin javob beradi va holatni o'zgartiradi**
   Ovoz: «Endi har xabarda bot avval holatga qaraydi. Pitsa kutayotgan bo'lsa, kelgan so'z pitsa nomi. Javob beradi va holatni o'lcham kutyapman qiladi.»
3. **Natija: «Pepperoni — yaxshi tanlov!», xotirada esa holat `OLCHAM_KUTYAPMAN` bo'ldi**
   Ovoz: «Natija: pepperoni, yaxshi tanlov, qaysi o'lchamda. Suhbat davom etdi. Xotirada esa Azizaning holati: o'lcham kutyapman.»
4. **Xulosa: holat bilan bot suhbatni davom ettiradi — lekin bu holat dastur xotirasida turibdi**
   Ovoz: «Xulosa: holat bilan bot suhbatni davom ettiradi. Lekin bu obyekt dastur xotirasida, RAM'da turibdi. Keyingi ekranda botni qayta ishga tushiramiz.»
- Manba: `tgpg-out/02-xotira-qayta-ishga.txt`; o'quvchi darsi Screen5.

## 4 · Qayta ishga tushirish — RAM bo'shadi  ← `Lesson`
- Kicker: `1-bosqich · holat` · Sarlavha: **Bot qayta ishga tushdi — «Katta» ga «Salom! Qaysi pitsa?»**
- Sahna: terminal (`02`, 2-jarayon): `Aziza (5123456789): Katta` → `bot → 5123456789: Salom! Qaysi pitsa?` · `[xotiradagi holat] {"5123456789":"PITSA_KUTYAPMAN"}`; ikki quti: RAM (bo'sh) · PostgreSQL (o'quvchi darsi Screen6).
1. **Server vaqti-vaqti bilan qayta ishga tushadi: yangi versiya yoki nosozlikdan keyin**
   Ovoz: «Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Biz ham botni to'xtatib, qayta ishga tushirdik.»
2. **Aziza «Katta» deb yozdi — bot uni yangi mijozdek kutib oldi**
   Ovoz: «Aziza o'lchamni yozdi: katta. Bot esa salom, qaysi pitsa deydi. Obyekt bo'sh boshlandi, Azizaning holati yo'q, bot uni yangi mijoz deb o'yladi.»
3. **RAM — dastur yashaganicha; jarayon tugasa, obyekt ham yo'qoladi**
   Ovoz: «Sabab: obyekt dastur xotirasida, jarayon tugasa u ham yo'qoladi. O'quvchi darsi buni ikki quti bilan ko'rsatadi: dastur xotirasi vaqtinchalik, PostgreSQL doimiy.»
4. **Xulosa: qayta ishga tushirishdan keyin faqat bazaga yozilgan holat qoladi**
   Ovoz: «Xulosa: qayta ishga tushirishdan keyin faqat bazaga yozilgan holat qoladi. Shuning uchun haqiqiy botda holat PostgreSQL'da turadi.»
- Manba: `tgpg-out/02-xotira-qayta-ishga.txt`; o'quvchi darsi Screen6.

## 5 · Tekshiruv 1 — qaysi holat qoladi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Bot qayta ishga tushdi. Qaysi holat saqlanib qoladi?**
- Ovoz: «Qayta ishga tushirishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Bot qayta ishga tushdi. Qaysi holat saqlanib qoladi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Koddagi obyektga yozilgan holat · 2 PostgreSQL'dagi `users` jadvaliga yozilgan holat · 3 Handler ichidagi o'zgaruvchi · 4 Hech qaysi
- To'g'ri (ovoz, `ok`): «To'g'ri, PostgreSQL'dagisi. Baza ma'lumotni diskka yozadi, bot qayta ishga tushsa ham u joyida. Obyekt va o'zgaruvchi dastur xotirasida, ular yo'qoladi. Demak, bot qayta ishga tushgandan keyin ham kerak bo'ladigan holat bazaga yoziladi.» · qisqa: «PostgreSQL — diskda, qoladi. Obyekt — RAM'da, yo'qoladi.»
- Xato izohlari: 1 — «Obyekt RAM'da: qayta ishga tushganda bo'sh boshlanadi (4-ekran).» · 3 — «Handler o'zgaruvchisi keyingi xabargacha ham yashamaydi.» · 4 — «Bazaga yozilgani qoladi.»
- Maslahat: «Qaysi biri diskka yoziladi?»
- Manba: `tgpg-out/02`, `05`; o'quvchi darsi Screen8.

---

## 6 · Umumiy o'zgaruvchi — ikki mijoz aralashdi  ← `Lesson`
- Kicker: `2-bosqich · alohida` · Sarlavha: **Bitta `tanlov` o'zgaruvchisi: Aziza Jasurning Margaritasini oldi**
- Sahna: `umumiy.js` (`let tanlov = null`); terminal (haqiqiy, `03`):
  ```
  Aziza (5123456789): Pepperoni
    bot → 5123456789: Pepperoni. O'lcham?
  Jasur (6234567890): Margarita
    bot → 6234567890: Margarita. O'lcham?
  Aziza (5123456789): Katta
    bot → 5123456789: Buyurtma: Margarita, katta
  ```
1. **Bitta mijoz bilan ishladi — endi ikki mijoz bir vaqtda yozadi**
   Ovoz: «Bitta mijoz bilan holat ishladi. Lekin botga bir vaqtda o'nlab odam yozadi. O'quvchi darsidagi holat: Aziza va Jasur.»
2. **Holat bitta umumiy o'zgaruvchida: har yangi xabar oldingisining ustiga yozadi**
   Ovoz: «Bu kodda tanlov bitta umumiy o'zgaruvchida, hamma uchun bitta. Aziza pepperoni yozdi, keyin Jasur margarita yozdi va uning ustiga yozildi.»
3. **Aziza «Katta» deydi — bot «Buyurtma: Margarita, katta» javobini beradi**
   Ovoz: «Aziza katta deb yozdi va javob oldi: buyurtma margarita, katta. Aziza margarita so'ramagan. Xato hech qayerda chiqmadi, buyurtma xato bermay aralashdi.»
4. **Xulosa: umumiy o'zgaruvchi — ikki mijozning suhbati xato bermay aralashadi**
   Ovoz: «Xulosa: umumiy o'zgaruvchida ikki mijozning suhbati xato bermay aralashadi. Har mijozning holati alohida turishi kerak.»
- Manba: `tgpg-out/03-umumiy-aralashdi.txt`; o'quvchi darsi Screen7, Screen9.

## 7 · `chat.id` bo'yicha alohida  ← `Lesson`
- Kicker: `2-bosqich · alohida` · Sarlavha: **Har mijozning holati o'z `chat.id` si ostida: obyekt kaliti yoki jadval qatori**
- Sahna: ikki ko'rinish yonma-yon: `holat[5123456789]` / `holat[6234567890]` (obyekt) · `users` jadvali, har mijozga bitta qator (`05` dagi ikki qator).
1. **Har mijozning Telegram raqami bor: shaxsiy chatda u `ctx.chat.id`**
   Ovoz: «Aralashmaslik uchun har mijozni raqami bilan ajratamiz. Telegram'da har mijozning raqami bor, shaxsiy chatda u ctx chat id.»
2. **3-ekrandagi obyekt shunday edi: kalit — `chat.id`, har mijozga o'z holati**
   Ovoz: «Uchinchi ekrandagi obyekt aynan shunday edi: kalit chat id, qiymat holat. Azizaning holati Jasurnikiga tegmaydi.»
3. **Bazada ham xuddi shu: har mijozga bitta qator, `telegram_id` ustuni bilan topiladi**
   Ovoz: «Bazada ham xuddi shunday: users jadvalida har mijozga bitta qator. Bot qatorni telegram id ustuni bilan topadi.»
4. **Xulosa: sessiya — bitta mijozning alohida holati; kaliti — `chat.id`**
   Ovoz: «Xulosa: bitta mijozning alohida holati sessiya deyiladi, uning kaliti chat id. O'quvchi darsi shu so'zni ishlatadi.»
- Manba: `tgpg-out/05`; o'quvchi darsi Screen10.

## 8 · Tekshiruv 2 — Aziza nima oladi  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **Umumiy `tanlov`: Aziza «Pepperoni», Jasur «Margarita», Aziza «Katta». Azizaga qanday javob keladi?**
- Ovoz: «Aralashishni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Tanlov bitta umumiy o'zgaruvchida. Aziza pepperoni, Jasur margarita, keyin Aziza katta deb yozdi. Azizaga qanday javob keladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 «Buyurtma: Pepperoni, katta» · 2 Xato chiqadi, bot to'xtaydi · 3 «Buyurtma: Margarita, katta» · 4 Bot javob bermaydi
- To'g'ri (ovoz, `ok`): «To'g'ri, margarita. Jasurning xabari umumiy o'zgaruvchining ustiga yozildi. Xato chiqmaydi, shuning uchun bunday xatoni sezish qiyin. Demak, har mijozning holati uning chat id'si bo'yicha alohida saqlanishi kerak.» · qisqa: «Margarita — Jasurniki ustiga yozildi, xato chiqmadi.»
- Xato izohlari: 1 — «Pepperoni Jasurning xabarida ustidan yozildi.» · 2 — «Kod to'g'ri ishlaydi — faqat holat umumiy.» · 4 — «Handler javob beradi, lekin noto'g'ri pitsa bilan.»
- Maslahat: «Oxirgi marta `tanlov` ga kim yozdi?»
- Manba: `tgpg-out/03`.

---

## 9 · `users` jadvali va `BIGINT`  ← `Lesson`
- Kicker: `3-bosqich · PostgreSQL` · Sarlavha: **`telegram_id BIGINT NOT NULL UNIQUE`: Telegram raqami 32 bitga sig'maydi**
- Sahna: psql:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL UNIQUE,
    ism TEXT,
    holat TEXT,
    tanlov TEXT
  );
  ```
  yonida Telegram Bot API hujjatidan: «This number may have more than 32 significant bits … a 64-bit integer … are safe» (`09`).
1. **O'quvchi darsidagi jadval: har mijoz — bitta qator, holati shu qatorda**
   Ovoz: «Endi holatni PostgreSQL'ga ko'chiramiz. O'quvchi darsidagi jadval: users. Har mijoz bitta qator, uning ismi va holati shu qatorda.»
2. **`telegram_id` — `BIGINT`: Telegram hujjati raqam 32 bitdan katta bo'lishi mumkin deydi**
   Ovoz: «Telegram id ustuni big int. Nega oddiy int emas? Telegram Bot API hujjati aytadi: bu raqam o'ttiz ikki bitdan katta bo'lishi mumkin. Oddiy int esa o'ttiz ikki bit.»
3. **`NOT NULL UNIQUE` — har mijozga faqat bitta qator, ikkinchisini baza o'zi rad etadi**
   Ovoz: «Not null unique: raqamsiz qator yo'q va bitta mijozga faqat bitta qator. Ikkinchi qatorni baza o'zi rad etadi, buni o'n beshinchi ekranda ko'ramiz.»
4. **Xulosa: jadval tayyor — `telegram_id` bilan qator topiladi, `holat` ustunida suhbat bosqichi**
   Ovoz: «Xulosa: jadval tayyor. Telegram id bilan mijozning qatori topiladi, holat ustunida suhbat bosqichi turadi.»
- Manba: `tgpg-out/04-jadval.txt`, `09-telegram-hujjat.txt`; o'quvchi darsi Screen11, `DB_COLS`.

## 10 · Oqim: SELECT → INSERT / UPDATE  ← `Lesson`
- Kicker: `3-bosqich · PostgreSQL` · Sarlavha: **Har xabarda: avval o'qish, yangi mijozga INSERT, keyin yangi holat UPDATE bilan**
- Sahna: `bot.js` (`baza.js` dan aynan: `bot.start` va `bot.on('text')`, `pool.query` uch xil) — qadam-qadam yoritiladi.
1. **Har xabarda birinchi ish — SELECT: bu mijozning qatori bormi, holati qanday**
   Ovoz: «Bazali bot har xabarda birinchi bo'lib o'qiydi: select, telegram id shu raqam bo'lgan qator. Qator bor bo'lsa, holat ma'lum.»
2. **Qator yo'q bo'lsa — yangi mijoz: INSERT, holat `ISM_KUTYAPMAN`, «Ismingiz nima?»**
   Ovoz: «Qator topilmasa, bu yangi mijoz. Insert bilan qator qo'shamiz, holat ism kutyapman. Javob: ismingiz nima.»
3. **Holat `ISM_KUTYAPMAN` bo'lsa — kelgan matn ism: UPDATE, holat `TAYYOR`**
   Ovoz: «Keyingi xabarda holat ism kutyapman bo'lsa, kelgan matn ism. Update bilan ismni yozamiz va holatni tayyor qilamiz.»
4. **Xulosa: SELECT → (yo'q bo'lsa INSERT) → javob → UPDATE; tartibni almashtirib bo'lmaydi**
   Ovoz: «Xulosa: avval select, yo'q bo'lsa insert, keyin javob va update. O'quvchi darsida bu tartib bo'laklardan yig'iladi: update select'dan oldin bo'lsa, bot holatni bilmay turib yozib yuboradi.»
- Manba: `manba/drive-tgpg.sh` (`baza.js`), `tgpg-out/05`; o'quvchi darsi Screen12–15.

## 11 · Qayta ishga tushgach — «Yana salom»  ← `Lesson`
- Kicker: `3-bosqich · PostgreSQL` · Sarlavha: **Bot qayta ishga tushdi — «Yana salom, Aziza!», Jasur o'z joyidan davom etdi**
- Sahna: terminal (haqiqiy, `05`):
  ```
  # 1-ishga tushirish
  Aziza: /start → Ismingiz nima? · Aziza: Aziza → Tanishganimdan xursandman, Aziza! · Jasur: /start → Ismingiz nima?
  # bot to'xtatildi va qayta ishga tushirildi
  Aziza: /start → Yana salom, Aziza!
  Jasur: Jasur → Tanishganimdan xursandman, Jasur!
  ```
  psql: `5123456789 | Aziza | TAYYOR` · `6234567890 | Jasur | TAYYOR`.
1. **4-ekrandagi sinovni takrorlaymiz: bot to'xtaydi va qayta ishga tushadi**
   Ovoz: «To'rtinchi ekrandagi sinovni bazali bot bilan takrorlaymiz. Aziza ismini aytdi, Jasur esa endigina start bosdi. Botni to'xtatib, qayta ishga tushiramiz.»
2. **Aziza /start — «Yana salom, Aziza!»: ism bazadan o'qildi**
   Ovoz: «Aziza start bosdi: yana salom, Aziza. Bot ismni bazadan o'qidi, qayta ishga tushirish hech narsani o'chirmadi.»
3. **Jasur ismini yozdi — bot uni ism deb tushundi, chunki holat bazada qolgan**
   Ovoz: «Jasur qayta ishga tushgandan keyin ismini yozdi. Bot uni ism deb tushundi, chunki uning holati, ism kutyapman, bazada qolgan edi.»
4. **Xulosa: holat bazada — qayta ishga tushirish ham, ikki mijoz ham muammo emas**
   Ovoz: «Xulosa: holat bazada bo'lsa, qayta ishga tushirish ham, ikki mijoz ham muammo emas. Endi buni o'z botingizda qilasiz.»
- Manba: `tgpg-out/05-baza-qayta-ishga.txt`.

## 12 · Amaliyot 1 — bot eslab qolsin  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **O'z botingiz: `users` jadvali, ism va qayta ishga tushirish** · `tableAt: 3`
1. **Endi siz: kichik bot yasaysiz, u ismingizni bazada eslab qoladi**
   Ovoz: «Endi navbat sizga. Kichik bot yasaysiz, u ismingizni bazada eslab qoladi. Baza: PostgreSQL birinchi darsda o'rnatgan PostgreSQL'ingiz. O'n besh daqiqa.»
2. **1–2-qadam: jadval va bot fayli — BotFather tokeni, lokal baza**
   Ovoz: «Birinchi: PostgreSQL terminalida botdb bazasi va users jadvali. Ikkinchi: yangi papka, telegraf va pg paketlari, bot js fayli. Token BotFather'dan, o'zingiz bilasiz.»
3. **3–4-qadam: /start va ism, keyin Ctrl+C va qayta ishga tushirish; isbot — javob matni**
   Ovoz: «Uchinchi: botni yoqing, start bosing, ismingizni yozing. To'rtinchi: Ctrl C bilan to'xtating, yana yoqing, start bosing. Isbot maydoniga botning javobini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz ismingizni bazada saqlaydi va qayta ishga tushgandan keyin ham uni eslab qoladi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadval | `psql -U postgres` → `CREATE DATABASE botdb;` → `\c botdb` → `CREATE TABLE users (…)` (9-ekran) | `CREATE TABLE` |
  | 2 | Bot | `mkdir bot-holat && cd bot-holat` · `npm init -y` · `npm i telegraf pg` · `bot.js` — «Kodni ochish» | fayl saqlandi |
  | 3 | Ism | `BOT_TOKEN=… DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botdb node bot.js` · Telegram: /start → ism | «Tanishganimdan xursandman, …!» |
  | 4 | Qayta ishga | Ctrl+C · xuddi shu buyruq · /start | «Yana salom, …!» |
- Isbot: «4-qadamdagi bot javobi» · placeholder: «botning javobini yozing» · KOD: `/Yana salom, .+!/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `password authentication failed for user "postgres"` | `DATABASE_URL` dagi parol — PostgreSQL-1 da o'rnatgan parolingiz |
  | `relation "users" does not exist` | jadval boshqa bazada — `\c botdb` dan keyin yarating |
  | Bot javob bermaydi, terminalda `401: Unauthorized` | token noto'g'ri nusxalangan (19-ekran) |
  | Qayta ishga tushgach yana «Ismingiz nima?» | ism `UPDATE` bo'lmagan — `holat` `ISM_KUTYAPMAN` da qolgan; `SELECT * FROM users;` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `manba/drive-tgpg.sh` (`baza.js` — handler'lar aynan), `tgpg-out/05`; `bot.launch()` va haqiqiy token bilan Telegram — sinalmagan (⚠; Telegraf'ning odatiy ishga tushirishi).

---

## 13 · `INTEGER` sig'maydi  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **`telegram_id INTEGER` — `ERROR: integer out of range`**
- Sahna: psql (haqiqiy, `06`):
  ```
  botdb=# CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);
  botdb=# INSERT INTO users_int (telegram_id) VALUES (5123456789);
  ERROR:  integer out of range
  ```
1. **Birinchi buzish: o'quvchi `BIGINT` o'rniga odatdagi `INTEGER` yozadi**
   Ovoz: «Birinchi buzish, sinfda albatta chiqadi. O'quvchi yoki AI telegram id uchun big int emas, odatdagi integer yozadi.»
2. **Katta raqamli mijoz yozdi — `integer out of range`, qator saqlanmadi**
   Ovoz: «Besh milliard bilan boshlanadigan raqamli mijoz yozdi. Natija: integer out of range. Qator saqlanmadi va bot bu mijozga javob bera olmaydi.»
3. **Kichik raqamli akkaunt bilan sinasa — hammasi ishlaydi, xato keyin chiqadi**
   Ovoz: «Xavfli tomoni: o'quvchining o'z akkaunti eski bo'lsa, raqami kichik va hammasi ishlaydi. Xato boshqa mijoz kelganda chiqadi. Tuzatish: ustun big int.»
4. **Xulosa: `telegram_id` — doim `BIGINT`; `INTEGER` bilan xato yangi mijozda chiqadi**
   Ovoz: «Xulosa: telegram id doim big int. Tuzatilgan jadvalda shu raqam saqlandi, to'qqizinchi ekrandagi jadval aynan shunday.»
- Manba: `tgpg-out/06-integer-sigmadi.txt`, `05` (BIGINT bilan saqlangan), `09`.

## 14 · `BIGINT` matn bo'lib keladi  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **node-pg `BIGINT`ni matn qaytaradi: `'5123456789' === 5123456789` — `false`**
- Sahna: `bigint.js` + terminal (haqiqiy, `07`):
  ```
  rows[0].telegram_id = "5123456789" · typeof: string
  v === 5123456789 → false
  Number(v) === 5123456789 → true
  ```
  yonida o'quvchi reposidagi entity: `telegram_id: string;` (`tgpg-out/12` dagi repo).
1. **Ikkinchi tuzoq: bazadan o'qilgan `telegram_id` son emas, matn**
   Ovoz: «Ikkinchi tuzoq yashirinroq. Bazadan o'qilgan telegram id son emas, matn bo'lib keladi. Node pg big int'ni JavaScript soniga aylantirmaydi.»
2. **Natija: `===` bilan solishtirish `false` — masalan admin tekshiruvi ishlamaydi**
   Ovoz: «Natija: uch tenglik bilan ctx chat id ga solishtirsangiz, false. Masalan, admin raqamini shunday tekshirsa, bot adminni tanimaydi va xato chiqmaydi.»
3. **O'quvchi reposida entity'da `telegram_id: string` — muallif buni bilgan**
   Ovoz: «O'quvchi reposida entity'da telegram id string deb yozilgan, servisda esa raqam string'ga aylantirib qidiriladi. Bu to'g'ri qaror: TypeORM ham big int'ni matn qaytaradi.»
4. **Xulosa: bazadagi `telegram_id` — matn; solishtirishdan oldin `Number()` yoki `String()`**
   Ovoz: «Xulosa: bazadan kelgan telegram id matn. Solishtirishdan oldin ikkalasini bir turga keltiring: Number yoki String. Tuzatilganda natija true.»
- Manba: `tgpg-out/07-bigint-matn.txt`, `14-typeorm-bigint.txt` (TypeORM ham: `"5123456789"`, `typeof: string`); repo `src/core/entity/user.entity.ts`, `src/api/user/user.service.ts` (`String(telegramId)`).

## 15 · SELECT'siz takror INSERT  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **Ikkinchi /start'da yana INSERT — `duplicate key value violates unique constraint`**
- Sahna: psql (haqiqiy, `08`):
  ```
  ERROR:  duplicate key value violates unique constraint "users_telegram_id_key"
  DETAIL:  Key (telegram_id)=(5123456789) already exists.
  ```
  yonida tuzatilgan oqim (10-ekran): SELECT → topilsa INSERT yo'q.
1. **Uchinchi buzish: /start har safar INSERT qiladi, SELECT yo'q**
   Ovoz: «Uchinchi buzish: o'quvchi start handler'ida faqat insert yozadi, avval select qilmaydi. Birinchi start ishlaydi.»
2. **Ikkinchi /start — `duplicate key … already exists`: UNIQUE uni to'xtatdi**
   Ovoz: «Ikkinchi start'da baza rad etadi: duplicate key, already exists. To'qqizinchi ekrandagi unique aynan shu yerda ishladi: bitta mijozga ikkita qator bo'lmaydi.»
3. **Xabar `DETAIL` qatorida: qaysi ustun va qaysi raqam takrorlandi**
   Ovoz: «Xabarni o'qing: detail qatorida qaysi ustun va qaysi raqam takrorlangani yozilgan. Telegram id, besh milliard bir yuz yigirma uch million. Demak, kodda select yo'q.»
4. **Xulosa: tuzatish — avval SELECT, qator topilsa INSERT qilinmaydi**
   Ovoz: «Xulosa: tuzatish o'ninchi ekrandagi oqim: avval select, topilsa insert qilinmaydi. Tuzatilgan bot ikkinchi start'ga yana salom deydi.»
- Manba: `tgpg-out/08-unique-takror.txt`, `05` (SELECT bilan — «Yana salom»).

## 16 · Tekshiruv 3 — qaysi satr  ← `LineCheck`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4 — qaysi satr xato?` · Sarlavha: **Yangi mijoz yozdi — `ERROR: integer out of range`**
- Shart (`task`): «Qoida: Telegram raqami 32 bitdan katta bo'lishi mumkin. Bu jadvalda yangi mijozning raqami saqlanmadi: `integer out of range`. **Shu xatoga sabab bo'lgan satrni bosing.**»
- Ovoz (`q`): «Buzishlarni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Yangi mijoz yozdi va baza integer out of range dedi. Sabab bo'lgan satrni bosing.»
- Fayl: `jadval.sql`:
  ```sql
  1  CREATE TABLE users (
  2    id SERIAL PRIMARY KEY,
  3    telegram_id INTEGER NOT NULL UNIQUE,   ← xato satr
  4    ism TEXT,
  5    holat TEXT
  6  );
  ```
- Tuzatilgan (`fixed`): 3-satr `INTEGER` → yashil `BIGINT`; `fixedExtra`: psql `INSERT … (5123456789)` → `INSERT 0 1` (`05` dagi BIGINT jadvali).
- To'g'ri (ovoz, `ok`): «To'g'ri, uchinchi satr. Integer o'ttiz ikki bit, Telegram raqami esa undan katta bo'lishi mumkin. Big int bo'lsa saqlanadi, tuzatilgan jadval ekranda ko'rinib turibdi. Demak, Telegram raqami saqlanadigan ustun doim big int bo'ladi.»
- Qisqa (`okShort`): «3-satr: `INTEGER` — 32 bit. To'g'risi `BIGINT`.»
- Maslahat (`hint`): «Xabar raqam turidan: qaysi satr raqamni saqlaydi?»
- Manba: `tgpg-out/06`, `05`.

## 17 · Amaliyot 2 — ikki buzish  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **`INTEGER` va takror INSERT — xabarlarni o'z bazangizda o'qing** · `tableAt: 3`
1. **Endi siz: o'z bazangizda ikki xatoni ataylab chiqarasiz va xabarlarni o'qiysiz**
   Ovoz: «Endi o'z bazangizda ikki xatoni ataylab chiqarasiz. O'n daqiqa. Har xabarni o'qing, o'quvchi aynan shularni ko'rsatadi.»
2. **1–2-qadam: `INTEGER` jadval va katta raqam — `integer out of range`**
   Ovoz: «Birinchi: botdb'da integer ustunli sinov jadvali. Ikkinchi: besh milliard bilan boshlanadigan raqamni qo'shing va xabarni o'qing.»
3. **3–4-qadam: `users` ga takror INSERT, keyin sinov jadvalini o'chirish; isbot — xabar**
   Ovoz: «Uchinchi: users jadvalingizga o'z raqamingizni yana bir marta insert qiling, duplicate key chiqadi. To'rtinchi: sinov jadvalini o'chiring. Isbot maydoniga ikkinchi qadamdagi xatoni yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz integer out of range va duplicate key xabarlarini o'z bazangizda ko'rgan bo'lasiz va o'quvchida chiqqanda darhol taniysiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Sinov jadvali | `CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);` | `CREATE TABLE` |
  | 2 | Katta raqam | `INSERT INTO users_int (telegram_id) VALUES (5123456789);` | `ERROR:  integer out of range` |
  | 3 | Takror | `SELECT telegram_id FROM users;` · shu raqam bilan `INSERT INTO users (telegram_id, holat) VALUES (…, 'ISM_KUTYAPMAN');` | `duplicate key value violates unique constraint` |
  | 4 | Tozalash | `DROP TABLE users_int;` | `DROP TABLE` |
- Isbot: «2-qadamdagi xato xabari» · placeholder: «ERROR qatorini qo'ying» · KOD: `/integer out of range/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2-qadamda `INSERT 0 1` | raqam kichik yozilgan — 5123456789 kabi 2147483647 dan katta raqam |
  | 3-qadamda `INSERT 0 1` | jadvalda bu raqam yo'q edi — avval `SELECT` dagi raqamni oling |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `tgpg-out/06`, `08`.

---

## 18 · O'quvchi reposi `dars-04-done`  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi reposi` · Sarlavha: **`TelegramBotNest`: entity, `topOrYarat` va holat — xuddi shu oqim, TypeORM bilan**
- Sahna: VS Code — `TelegramBotNest` Explorer; `user.entity.ts` → `user.service.ts` (`topOrYarat`) → `telegram.service.ts` (`/start`, `on('text')`); terminal (haqiqiy, `12`): ikki ishga tushirish, «Yana salom, Aziza! Menyu uchun /menu ni bosing.»; `\d users` (TypeORM yaratgan).
1. **O'quvchi amaliyoti TelegramBotNest reposida: AI shu kodni yozadi, tayyor yechim `dars-04-done`**
   Ovoz: «O'quvchi amaliyoti TelegramBotNest reposida. O'quvchi AI'ga prompt beradi, tayyor yechim esa dars to'rt done tegida. Shu kodni ochamiz.»
2. **Entity: `telegram_id` — `bigint`, `unique`; `holat` — default `'yangi'`**
   Ovoz: «Entity'da telegram id big int va unique, ism bo'sh bo'lishi mumkin, holat boshida yangi. Jadvalni TypeORM o'zi yaratadi, synchronize yoqilgan.»
3. **`topOrYarat` — SELECT va kerak bo'lsa INSERT; handler holatga qarab javob beradi**
   Ovoz: «Top yoki yarat: avval qidiradi, topilmasa qator qo'shadi. Handler esa holatga qaraydi: ism kutilmoqda bo'lsa, matnni ism qiladi. O'ninchi ekrandagi oqimning o'zi.»
4. **Xulosa: shu kodni haqiqiy PostgreSQL bilan yurgizdik — qayta ishga tushgach «Yana salom»**
   Ovoz: «Xulosa: shu repo kodini haqiqiy PostgreSQL bilan yurgizdik. Qayta ishga tushgandan keyin yana salom, Aziza. Ikki mijoz alohida qoldi.»
- Manba: `tgpg-out/10`, `12`; repo `dars-04-done` (46c67e7).

## 19 · Token xato va `.env` yo'q  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi reposi` · Sarlavha: **«Server ishlayapti», lekin «Telegram ulanmadi: 401» — bot javob bermaydi**
- Sahna: terminal (haqiqiy, `13`):
  ```
  Server 3000-portda ishlayapti
  Telegram ulanmadi: 401: Unauthorized — README, «Xatolar» jadvali
  ```
  va (`11`): `Error: DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).`
1. **Sinfda eng ko'p chiqadigan holat: o'quvchi «bot javob bermayapti» deydi**
   Ovoz: «Repo kodini ko'rdik, endi sinfda eng ko'p chiqadigan holat. O'quvchi bot javob bermayapti deydi. Terminalda server ishlayapti yozuvi turibdi.»
2. **Ikki satrni o'qing: server ishlaydi, Telegram esa `401: Unauthorized`**
   Ovoz: «Ikki satrni birga o'qing. Server uch ming portda ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Token noto'g'ri: server ishlaydi, bot esa javob bermaydi. Biz soxta token bilan sinadik.»
3. **`.env` yo'q bo'lsa server umuman yonmaydi: `DATABASE_URL topilmadi`**
   Ovoz: «Env fayli yo'q bo'lsa, server umuman yonmaydi: database url topilmadi. Bu xabarni repo muallifi o'zi yozgan, nima qilishni ham aytadi.»
4. **Xulosa: «bot javob bermaydi» bo'lsa — avval «Telegram bot ulandi» satri bormi, qarang**
   Ovoz: «Xulosa: bot javob bermasa, terminalda Telegram bot ulandi satrini qidiring. Yo'q bo'lsa, uning o'rnidagi xato sababni aytadi. Repo README'sida xatolar jadvali ham bor.»
- Manba: `tgpg-out/11-env-yoq.txt`, `13-token-xato.txt`; repo README «Xatolar».

## 20 · Amaliyot 3 — o'quvchi reposi  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`dars-04-done` ni o'z kompyuteringizda: lokal baza, o'z tokeningiz** · `tableAt: 3`
1. **Endi siz: o'quvchi yechimini o'z kompyuteringizda ishga tushirasiz**
   Ovoz: «Oxirgi amaliyot: o'quvchi yechimini o'z kompyuteringizda ishga tushirasiz. Neon o'rniga lokal PostgreSQL. O'n besh daqiqa.»
2. **1–2-qadam: clone, `dars-04-done`, `npm ci`; `.env` — token va lokal baza**
   Ovoz: «Birinchi: clone, dars to'rt done, npm ci. Ikkinchi: env fayli: o'z tokeningiz va lokal bazaning manzili. Bazani avval yarating.»
3. **3–4-qadam: /start, ism, qayta ishga tushirish; isbot — `holat` ustuni**
   Ovoz: «Uchinchi: npm run start, Telegram'da start va ismingiz. To'rtinchi: qayta ishga tushiring, yana start. Isbot maydoniga PostgreSQL terminalidagi holat ustuni qiymatini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi yechimi sizning kompyuteringizda ishlaydi va siz uning holatini bazadan o'qiy olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Repo | `git clone https://github.com/Azizbekcrypto/TelegramBotNest.git` · `cd TelegramBotNest` · `git checkout -f dars-04-done` · `npm ci` | `added … packages` |
  | 2 | `.env` | `psql -U postgres -c "CREATE DATABASE botnest;"` · `.env`: `BOT_TOKEN=…` · `DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botnest` | `CREATE DATABASE` |
  | 3 | Ishga | `npm run start` · Telegram: /start → ism | `Telegram bot ulandi` · «Xush kelibsiz, …!» |
  | 4 | Qayta ishga | Ctrl+C · `npm run start` · /start · `psql -U postgres -d botnest -c "SELECT ism, holat FROM users;"` | «Yana salom, …!» · `tayyor` |
- Isbot: «`holat` ustunidagi qiymat» · placeholder: «psql natijasidagi holatni yozing» · KOD: `/^\s*tayyor\s*$/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `DATABASE_URL topilmadi` | `.env` fayli loyiha ildizida emas yoki nomi `.env.example` (19-ekran) |
  | `Telegram ulanmadi: 401: Unauthorized` | token — BotFather'dan qayta nusxalang (19-ekran) |
  | `409: Conflict` ⚠ | shu bot boshqa terminalda ham ishlayapti (12-amaliyotdagi `bot.js`) — eskisini to'xtating (README; sinalmagan) |
  | `holat` — `ism_kutilmoqda` | ism yozilmagan — Telegram'da ismingizni yuboring |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `tgpg-out/10–13`; haqiqiy token bilan Telegram — sinalmagan (⚠).

## 21 · Tekshiruv 4 — server ishlayapti, bot javob bermaydi  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Terminal: «Server 3000-portda ishlayapti» va «Telegram ulanmadi: 401: Unauthorized». Sabab?**
- Ovoz: «Repo xatolarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Server ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 PostgreSQL ishlamayapti · 2 Port 3000 band · 3 `users` jadvali yo'q · 4 `BOT_TOKEN` noto'g'ri
- To'g'ri (ovoz, `ok`): «To'g'ri, token. To'rt yuz bir, ruxsat yo'q: Telegram tokenni tanimadi. Server va baza ishlayapti, shuning uchun server ishlayapti yozuvi bor. Tokenni BotFather'dan qayta nusxalang. Demak, server ishga tushgan, lekin bot javob bermasa, birinchi navbatda tokenni tekshiring.» · qisqa: «401 — token noto'g'ri; server va baza ishlayapti.»
- Xato izohlari: 1 — «Baza ishlamasa server yonmaydi.» · 2 — «Port band bo'lsa «Server ishlayapti» chiqmaydi.» · 3 — «TypeORM jadvalni o'zi yaratadi (`synchronize`).»
- Maslahat: «401 — kim kimni tanimadi?»
- Manba: `tgpg-out/13`.

---

## 22 · m5-04 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m5-04 · «Bot eslab qoladi»` · Sarlavha: **m5-04: AvtoPizza, ikki quti va users jadvali**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 adashgan suhbat · s1 reja | holatsiz handler (2-ekran) |
  | 2 Holat | s2 holatsiz · s3 holat bilan · s4 test · s5 obyekt · s6 qayta ishga tushirish · s8 test | RAM'da yo'qolishi haqiqiy (4-ekran) |
  | 3 Alohida | s7 ikki mijoz · s9 ikkalasi birdan · s10 test | yashirin aralashish (6-ekran) |
  | 4 Baza | s11 users jadvali · s12 qadam-baqadam · s13 SQL bo'shliqlari · s14 test · s15 oqim tartibi | `BIGINT` va matn (13–14-ekran) · takror INSERT (15-ekran) |
  | 5 Yakun | amaliyot (Neon + AI + TelegramBotNest) · kartochkalar · s16 | token, `.env` (19-ekran) |
1. **m5-04 — 21 ekran: AvtoPizza bot, ikki quti va `users` jadvali**
   Ovoz: «Endi o'quvchi darsi, m5-04, yigirma bir ekran. AvtoPizza bot, Aziza va Jasur, dastur xotirasi va PostgreSQL qutilari, users jadvali.»
2. **O'quvchi amaliyoti Neon'da: `DATABASE_URL` oxiridagi `sslmode=require` o'chirilmasligi kerak**
   Ovoz: «O'quvchi amaliyoti Neon'da, internetdagi bepul bazada. Ulanish manzili oxiridagi sslmode require qolishi kerak, repo kodi shunga qarab ssl yoqadi. Neon'ni biz sinamadik.»
3. **AI kod yozadi: `telegram_id` turi va SELECT borligini o'quvchi bilan birga tekshiring**
   Ovoz: «Kodni AI yozadi. Siz ikki narsani o'quvchi bilan birga tekshiring: telegram id big int'mi va start'da avval qidirish bormi. Sinfdagi xatolarning ko'pi shu ikkisidan.»
4. **Xulosa: vaqt — ikki mijoz va qayta ishga tushirishni sinfda jonli ko'rsating**
   Ovoz: «Xulosa: vaqt, taklif: ikki mijoz va qayta ishga tushirishni sinfda jonli ko'rsating, ikki telefon yoki ikki akkaunt bilan. O'quvchi aralashishni o'z ko'zi bilan ko'rsin.»
- Manba: `src/5-Modull/BotStatefulMemoryLesson.jsx` — `SCREEN_META` (21), `ScreenDbPractice`, `HW_V2`; repo `src/infrastructure/database.module.ts` (`sslmode=require` → `ssl`).

## 23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Holat, sessiya, holatli bot — va olti holat**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | holat · holatli bot | state · stateful bot |
  | sessiya | bitta mijozning holati, kaliti `chat.id` |
  | dastur xotirasi · PostgreSQL qutisi | RAM · disk |
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Ism unutildi | qayta ishga tushgach «Ismingiz nima?» | holat RAM'da — bazaga |
  | 2 | Buyurtma aralashdi | xato yo'q | umumiy o'zgaruvchi — `chat.id` |
  | 3 | Katta raqam | `integer out of range` | `BIGINT` |
  | 4 | Ikkinchi /start | `duplicate key` | avval SELECT |
  | 5 | Bot javob bermaydi | `401: Unauthorized` | token |
  | 6 | Server yonmaydi | `DATABASE_URL topilmadi` | `.env` |
- O'quvchi so'rasa:
  - «Holatni fayl (JSON)da saqlasa bo'lmaydimi?» → bitta jarayonda ishlaydi, lekin bir vaqtda ko'p yozuvda va serverni almashtirganda baza ishonchli.
  - «Nega `ctx.chat.id`, ism emas?» → ism takrorlanadi, raqam — yo'q.
  - «Neon'ni o'chirsam, holat nima bo'ladi?» → baza bilan birga yo'qoladi.
  - «Telegram raqam beradi-ku, nega matn bo'lib keldi?» → node-pg va TypeORM `bigint`ni matn qaytaradi (14-ekran).
1. **O'quvchi darsidagi so'zlar: holat, sessiya, holatli bot — siz inglizchasini birga aytasiz**
   Ovoz: «Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: holat, sessiya va holatli bot. O'quvchi shu so'zni aytganda, siz inglizchasini ham ayting: state va stateful.»
2. **Uch holat xabarsiz yoki xabar bilan: unutish, aralashish, `integer out of range`**
   Ovoz: «Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi ikkisida xato xabari chiqmaydi: bot ismni unutadi yoki ikki mijozning buyurtmasi aralashadi. Uchinchisida baza integer out of range xatosini beradi.» · 1–3-karta
3. **Qolgan uchtasi xabardan taniladi: `duplicate key`, `401`, `DATABASE_URL topilmadi`**
   Ovoz: «To'rtinchi holat: duplicate key xatosi, sababi kodda select yo'q. Beshinchi holat: to'rt yuz bir, ya'ni token noto'g'ri. Oltinchi holat: database url topilmadi, bunda env fayli yo'q yoki o'qilmagan.» · 4–6-karta
4. **Xulosa: xato chiqmasa — holat qayerda saqlanayotganiga qarang**
   Ovoz: «Xulosa va usul: xato chiqmagan holatlar eng qiyin. O'quvchi bilan birga holat qayerda saqlanayotganiga qarang: obyektdami, bazadami. Pastda savollarga tayyor javoblar.» · QA
- Manba: `tgpg-out/01…13`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Holatsiz bot «Pepperoni» ni nega tushunmadi? | oldingi xabarni bilmaydi · internet sekin · token xato · Telegram aralashtirdi | 1 | Har xabar alohida keladi. | 2 |
  | 2 | Obyektdagi holat bot qayta ishga tushgach? | saqlanadi · yo'qoladi · bazaga o'tadi · ikki baravar bo'ladi | 2 | RAM — jarayon bilan birga. | 4 |
  | 3 | Umumiy `tanlov` bilan Aziza nima oladi? | o'z buyurtmasini · xato · Jasurning pitsasini · javob yo'q | 3 | Ustiga yozildi, xatosiz. | 6 |
  | 4 | Holat qaysi kalit bilan ajratiladi? | ism · vaqt · token · `chat.id` | 4 | Raqam takrorlanmaydi. | 7 |
  | 5 | Har xabarda birinchi SQL? | SELECT · INSERT · UPDATE · DELETE | 1 | Avval holatni o'qish. | 10 |
  | 6 | `telegram_id INTEGER` — katta raqamda? | saqlanadi · `integer out of range` · matn bo'ladi · `duplicate key` | 2 | Telegram id 32 bitdan katta bo'lishi mumkin. | 13 |
  | 7 | node-pg'dan kelgan `telegram_id` turi? | number · boolean · string (matn) · object | 3 | `===` bilan solishtirish false. | 14 |
  | 8 | «Server ishlayapti», «Telegram ulanmadi: 401» — sabab? | baza · port · jadval · token | 4 | 401 — token tanilmadi. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) holat — suhbat bosqichi; holatsiz bot adashadi · (2) RAM'dagi holat qayta ishga tushganda yo'qoladi, PostgreSQL'dagi qoladi · (3) har mijoz `chat.id` bo'yicha; umumiy o'zgaruvchi xato bermay aralashtiradi · (4) oqim: SELECT → (yo'q bo'lsa INSERT) → UPDATE · (5) tuzoqlar: `BIGINT`, matn, takror INSERT · (6) o'quvchi reposi: `dars-04-done`, token 401 — server ishlaydi, bot javob bermaydi.
- **Uyga vazifa** (M14): «12-amaliyotdagi botingizga ikkinchi bosqich qo'shing: ismdan keyin telefon raqamini so'rasin, holat ikki bosqichli bo'lsin. Telefon bosqichida botni qayta ishga tushiring: bot telefonni kutishda davom etsin. Bir marta INTEGER bilan buzib ko'ring. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Ustun | `ALTER TABLE users ADD COLUMN telefon TEXT;` | `ALTER TABLE` |
  | 2 | Holat | `ISM_KUTYAPMAN` → `TELEFON_KUTYAPMAN` → `TAYYOR` | — |
  | 3 | Qayta ishga | telefon bosqichida Ctrl+C → qayta → raqam yuboring | bot davom etadi |
  | 4 | Buzish | `INTEGER` sinovi (17-amaliyot) | `integer out of range` |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: holat bazada · `chat.id` bo'yicha · SELECT avval · `BIGINT`.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **WebSocket: doimiy ulanish** — Backend o'zi xabar yuboradi». (01.11 sifat ko'rigi B2: WebSocket-1 darsi nomiga moslandi.)

---

## «KOD» — qurishda
1. CI/CD-1 yordamchilari (`ts()`/`js()`, `jt()`, `Term`, Explorer, `Psql`) — bo'lakda nusxa; Telegram chat maketi (`TgChat`, ⚠); generator `dev/tgpg-matn.py`.
2. Chiqishlar `tgpg-out/` dan aynan; `/tmp/claude-…` yo'llari qisqartiriladi.
3. LineCheck (16-ekran): 3-satr → `target={2}`; `fixed` da har satrga `n`.
4. Isbotlar: 12 — `/Yana salom, .+!/i` · 17 — `/integer out of range/i` · 20 — `/^\s*tayyor\s*$/i`.

## Ochiq savollar ([GATE M])
1. Mentor amaliyotida **lokal PostgreSQL** (Neon emas) — PRD Q1; tasdiqlang.
2. Telegram chat — maket ⚠; haqiqiy token bilan sinov (BotFather'da sinov bot) ruxsat bersangiz — 12, 20-amaliyot «kutilgan»larini haqiqiy Telegram bilan tekshiraman.
3. 20-amaliyotdagi `409 Conflict` — README'dan, sinalmagan.

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m5-04** amaliyoti: Telegram tekshiruvida kutilgan javob «Xush kelibsiz, …!» — o'quvchi darsidagi chat namunasi ham shu; repo kodi ham shu (mos). Uyga vazifa matni esa «Tanishganimdan xursandman, <ism>!» deydi — ikki xil matn.
2. **m5-04**: `BIGINT` matn bo'lib kelishi aytilmagan (repo to'g'ri yozilgan — AI boshqacha yozsa, o'quvchi adashadi).
