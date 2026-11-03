# PostgreSQL-1 — haqiqiy chiqishlar (31.10.2026)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg1.sh` (repo ildizidan). Tizimga tegmaydi: klasterlar va `mongod` vaqtinchalik papkada, oxirida to'xtatiladi.
Versiyalar — `00-versiyalar.txt`: PostgreSQL 18.4 (server va `psql`), MongoDB 6.0.27, Mongoose 9.11.4, Node 24. Xabarlar inglizcha (`LC_MESSAGES=C`) — o'rnatuvchilar ham inglizcha.

| Fayl | Nima | Qaysi server |
|---|---|---|
| 01 | `initdb` (o'rnatuvchi ichida shu ish bo'ladi) | A — Windows o'rnatuvchisi kabi: superuser `postgres` + parol, scram-sha-256 |
| 02–03 | `SELECT version();`, `\l` | A |
| 04–05 | parol xato · `database "blog" does not exist` | tizimdagi PG17, `localhost:5432` (xabarda 5432 port chiqishi uchun; unda hech narsa yaratilmagan) |
| 06–09 | `blog` bazasi, `users` + `posts` (o'quvchi m4-03 amaliyotidagi namuna), INSERT, NOT NULL / UNIQUE / FK xatolari, JOIN (to'g'ri, ON xato, LEFT JOIN) | A |
| 10 | boshqa bazada: `relation "posts" does not exist` | A |
| 11–13, 18 | `products` (CHECK stock ≥ 0) · oxirgi telefon: 2 seans, 2-xaridor 1-ni kutadi → `UPDATE 0` · CHECK xatosi · buyurtma + ombor bitta tranzaksiyada → `ROLLBACK`, `orders` bo'sh | A |
| 14 | `jsonb` ustun: har xil maydonlar bitta jadvalda, `extra->>'rang'` | A |
| 15 | Homebrew kabi: `role "postgres" does not exist` → `createuser -s postgres` | B — superuser = kompyuter foydalanuvchisi, trust, socket `/tmp`, port 5434 |
| 16 | Postgres.app kabi: `psql -U postgres` parolsiz; `psql` o'zi — foydalanuvchi nomidagi baza | C — `initdb -U postgres` + `createuser --superuser $USER` + `createdb $USER`, trust (Postgres.app manbasi `Postgres/Server.swift` bilan bir xil) |
| 19 | amaliyotda tez-tez: `relation "users" already exists` · vergul tushib qolgan → `syntax error at or near "name"` | A |
| 20 | server ishlamayapti: `Connection refused` (TCP, Windows) · `No such file or directory` (socket, macOS) | bu portda server yo'q (5439) |
| 21 | `psql` kirishi: `Password for user postgres:` so'rovi, salom qatori · `;` unutilsa `postgres-#` (davom qatori) — qo'lda, `script` bilan | tizim PG17 :5432 |
| 22 | (01.11) tuzatishlar: vergulli `tags` → `CREATE TABLE` · `CREATE DATABASE blog` ikkinchi marta → `already exists` · `FROM posts LEFT JOIN users` (3 qator, sardor yo'q) · `DELETE` posts → users (`DELETE 2`, `DELETE 1`), yo'q id → `DELETE 0` | A |
| 23 | (01.11) `REFERENCES` unutilgan `posts` → `INSERT 0 1` · `DROP TABLE` · kalit bilan qayta → FK xatosi | A, `blog_fk` bazasi |
| 24 | (01.11) telefon holatlari: A — `COMMIT`dan keyin 2-oyna darhol `UPDATE 0` · B — `stock = 2`: 2-oyna kutadi, `COMMIT`dan keyin `UPDATE 1`, stock 0 | A |
| 25 | (01.11) psql promptlari: `=*#` tranzaksiya ochiq · `-*#` davom · `=!#` xato bo'ldi (`COMMIT` → `ROLLBACK`) · qavs ichida `(#` / `(*#` — qo'lda, `script`; jadval `ROLLBACK` bilan bekor | tizim PG17 :5432 |
| 17 | Mongoose: `populate` · muallifi yo'q post jim saqlanadi (`author: null`) · har hujjat har xil · oxirgi telefon Mongo'da ham bittaga sotiladi (bitta hujjat — atomik) · ko'p hujjatli tranzaksiya standalone `mongod`da ishlamaydi | MongoDB 6.0 standalone, 127.0.0.1:27018 |

**Darsga ko'chirishda farqlar (ochiq aytiladi):**
- 15-faylda socket porti 5434, 20-faylda 5439 — mentor kompyuterida 5432 bo'ladi; darsda xabarning mazmunli qismi olinadi: `FATAL:  role "postgres" does not exist`.
- 18-faylda `psql -f` xato oldiga qo'shadigan `psql:<fayl>:N:` olib tashlangan — qo'lda yozilganda bu qo'shimcha yo'q.
- Windows'ning o'z xabarlari (masalan, `psql` PATH'da bo'lmasa) bu kompyuterda sinalmaydi — darsda rasmiy hujjatdan, belgi bilan.

**Rasmiy manbalar (31.10 tekshirildi):**
- Windows: https://www.postgresql.org/download/windows/ — «Interactive installer by EDB»; jadvalda eng yangisi 18 (19 — hali RC). O'rnatuvchi qadamlari: https://www.enterprisedb.com/docs/supported-open-source/postgresql/installing/windows/ — komponentlar PostgreSQL Server · pgAdmin 4 · Stack Builder · Command Line Tools; parol `postgres` uchun; port 5432; PATH'ni o'zgartirmaydi (`…\PostgreSQL\<versiya>\bin` qo'lda qo'shiladi).
- macOS: https://postgresapp.com/ — Applications'ga ko'chirish → Initialize → PATH: `sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp`; ulanish: localhost, 5432, parolsiz. `postgres` roli BOR (manba kodi: `initdb -U postgres`, keyin `createuser --superuser <mac foydalanuvchisi>`) — bir blogdagi «yo'q» degan gap noto'g'ri.
| 26 | 6–7-ekran o'rnatish da'volari rasmiy hujjat bilan solishtirildi (EDB docs, postgresql.org, postgresapp.com — 01.11): komponentlar, port 5432, PATH o'zi qo'shilmaydi, Postgres.app PATH buyrug'i va parolsiz — hammasi mos; bu kompyuterda sinalmagan (⚠ qoladi) |
