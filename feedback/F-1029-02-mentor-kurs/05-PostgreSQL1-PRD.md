# Mentor darsi · PostgreSQL-1: SQL va NoSQL, nega PostgreSQL — PRD v1 (31.10: 4 savolga javob olindi)

> 31.10.2026 · PRD Ilova A shabloni · kursdagi ichki tartib №1 (M31: o'quvchi ko'radigan matnda raqam yo'q).
> **Foydalanuvchi qarorlari (31.10, https://claude.ai/artifact/2vejgmEVhoB8UMc1EDiWrZ):**
> 1. Mentorlar eski dasturda **MongoDB (Mongoose)** bilan ishlagan → «Nega» bosqichi va butun dars ipi: «siz bilgan Mongo hujjati ↔ PostgreSQL jadvali».
> 2. Chuqurlik — **tushuncha + qo'l bilan** (o'rnatish, `psql`, 2 jadval, JOIN, «oxirgi telefon»).
> 3. Mentor kompyuteri — **har xil: macOS ham, Windows ham** → o'rnatish ekranida ikki yo'l (tanlanadi); `psql` chiqishlari umumiy.
> 4. Sinf kompyuterlarida PostgreSQL'ni **mentor o'rnatadi** (darsdan oldin) → ko'prikda sinf uchun tekshiruv ro'yxati (m4-06 dan oldin har kompyuterda).

**O'quvchi darsi:** m4-03 «SQL vs NoSQL — nega PostgreSQL» (`src/4-Modull/DbSqlNosqlLesson.jsx`, 21 ekran, **kodsiz**).
Ichida: ikki tur (jadval / hujjat) → shakl farqi (kartalar) → SQL kuchi: JOIN (id bilan ulash), ishonchlilik (oxirgi telefon ikki kishiga sotilmaydi) → NoSQL kuchi: hajm (chat oqimi) →
qaror ko'rsatkichi (4 mezon: bog'lanish · shakl · ishonchlilik · hajm) → nega PostgreSQL (bog'langan, ishonchli, bepul, JSON ham, bizning to'plam) → AI tavsiyasi →
moslashtirish (bank, chat, do'kon, loglar) → mif-buster («NoSQL zamonaviyroq») → 4 test + yakuniy · amaliyot: o'z loyihasiga baza tanlash + 2 bog'langan jadval nomi va ustunlari (qog'ozda) ·
CodeStrike · uyga vazifa: 4 yozma topshiriq (ilova, 4 mezon, 2 jadval yoki { } hujjat, postgresql.org).
**Oldin:** m4-01 «Ma'lumot va bog'lanishlar: JSON, jadval, sxema» (PK/FK — mentorga tanish, NEW ro'yxatida yo'q). **Keyin:** m4-06 CRUD (mentor PostgreSQL-2), m4-08 AvtoIjara (Express + `pg`).
**Kursdagi o'rni:** mentor kursining birinchi darsi → PostgreSQL-2 (CRUD). Nest-1/Nest-2 dan oldin turadi (M8: mentor hammasini o'tadi).

**Manbadan topilgan muhim fakt:** o'quvchi darslarida PostgreSQL'ni **o'rnatish hech qayerda o'rgatilmaydi** — m4-08 «`psql -U postgres` (parol — PostgreSQL o'rnatilganda berilgan)» deb tayyor holatni kutadi. Sinf kompyuterida PostgreSQL bo'lmasa, m4-06 va m4-08 to'xtaydi.

1. **Biladi (3 gap):** o'zi biladigan MongoDB'ni PostgreSQL bilan solishtira oladi (collection ↔ jadval, document ↔ qator, `populate` ↔ JOIN, schema ↔ ustun turlari) va SQL/NoSQL farqini o'quvchi darsi tilida (jadval / hujjat, 4 mezon) tushuntiradi; sinfdagi savollarga («Mongo yomonmi?», «MySQL'dan farqi?», «Excel'ning o'zi-ku?») javob beradi.
   O'quvchi darsidagi har da'voni (JOIN, tranzaksiya, JSON) PostgreSQL'da **o'z ko'zi bilan ko'rgan**. Sinf kompyuterlariga PostgreSQL'ni **o'zi o'rnatadi** (Windows yoki macOS) va m4-06 dan oldin har kompyuterda `psql -U postgres` ochilishini tekshiradi.
2. **Qo'li bilan (taklif — 4 amaliyot, isbot bilan):**
   P1 PostgreSQL o'rnatish (Windows: rasmiy o'rnatuvchi · macOS: tanlanadi) + `psql -U postgres` ulanish → isbot: `SELECT version();` qatori ·
   P2 baza + o'quvchi amaliyotidagi 2 jadval `users(id, username)`, `posts(id, user_id, izoh)` (PK, `REFERENCES`) → isbot: `\d posts` dagi Foreign-key qatori ·
   P3 JOIN — «har post muallifi bilan» → isbot: natija qatorlar soni ·
   P4 «oxirgi telefon» — tranzaksiya / `UPDATE … WHERE stock > 0` ikki marta → isbot: ikkinchisi `UPDATE 0` (+ `jsonb` ustun bir qatorda).
3. **Haqiqiy loyiha:** noldan, lokal PG17 (`pg1_mentor` bazasi, `TEMPLATE template0`) + solishtirish uchun lokal MongoDB 6.0 (scratchpad'da vaqtinchalik `mongod`, standalone) · `manba/drive-pg1.sh` → `manba/pg1-out/`:
   version · baza yo'q · parol xato · rol yo'q · jadval yaratish · FK buzilishi · PK takror · NOT NULL · JOIN · tranzaksiya (2 seans) · `jsonb` so'rov · `\dt`, `\d` ·
   Mongo tomoni: har xil maydonli hujjatlar · `$lookup` · standalone'da tranzaksiya xatosi. Windows/macOS o'rnatuvchi qadamlari — rasmiy hujjatdan (postgresql.org, postgresapp.com), havola bilan.
4. **Buzamiz (3–4 haqiqiy xato):** `password authentication failed for user "postgres"` · `database "…" does not exist` · `relation "posts" does not exist` (boshqa bazaga ulangan) ·
   `insert or update on table "posts" violates foreign key constraint` — har biri: xabar → qaysi qadam / qaysi buyruq / qaysi baza → tuzatish → yashil natija (M3, M18).
5. **Ko'prik:** m4-03 xaritasi (21 ekran → «siz nima deysiz») · o'quvchi tili (jadval = «Excel jadvaliga o'xshaydi», hujjat = «papkadagi turli qog'ozlar», qaror ko'rsatkichi) ·
   qoqiladigan joylar (JOIN ekrani, tranzaksiya, «NoSQL zamonaviyroq» mifi, AI tavsiyasi, Firebase/MongoDB nomlari) · sinfdagi eng ko'p savol · vaqt rejasi ·
   **m4-06 dan oldin: sinf kompyuterlarida PostgreSQL ishlayaptimi** (qanday tekshirish).
6. **Tekshiruv ~4 + o'z-sinov 8** — mavzular: tanlov mezoni, JOIN natijasi, FK xatosi, tranzaksiya natijasi, xato xabarini o'qish; savol matni MD'da.
7. **Uyga vazifa:** GitHub repo — `schema.sql` (2 jadval + JOIN so'rovi) + README'da o'z loyihasi uchun 4 mezon javobi → **faqat GitHub linki** platformaga (M30).
8. **Hajm (taxmin):** ~22–26 ekran · ovoz ~30–35 daqiqa · jami ~1 soat (o'quvchi darsi kichik va kodsiz — Nest'dan qisqa, §9-4).
9. **Xavf / ochiq savollar (artifact'da):**
   - ~~4 savol~~ — javob olindi (yuqorida).
   - Windows/macOS o'rnatuvchi oynalari bu kompyuterda sinalmaydi (Linux) — matn rasmiy hujjatdan, havola bilan; `psql` chiqishlari haqiqiy (M10).
   - macOS'da Homebrew bilan o'rnatilsa `postgres` roli bo'lmasligi mumkin — m4-08 `psql -U postgres` kutadi; rasmiy hujjat bilan tekshiriladi va darsda yo'l tanlanadi.
   - Yo'l-yo'lakay: o'quvchi amaliyotida «daftar yoki og'zaki» — «daftar» so'zi taqiq (memory `daftar-sozi-taqiq`); o'quvchi darsi — alohida qaror.
