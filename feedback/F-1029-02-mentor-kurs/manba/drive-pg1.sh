#!/usr/bin/env bash
# PostgreSQL-1 mentor darsi — haqiqiy chiqishlar (F-1029-02, 31.10). Natija: manba/pg1-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg1.sh
# Tizimga tegmaydi: PostgreSQL 18 va MongoDB vaqtinchalik papkada ($S/pg1-run), oxirida to'xtatiladi va o'chiriladi.
#   A klaster (port 5433) — Windows o'rnatuvchisi kabi: superuser postgres + parol, scram-sha-256.
#   B klaster (port 5434, socket /tmp) — Homebrew kabi: superuser = kompyuter foydalanuvchisi, trust.
#   C klaster (port 5435, socket /tmp) — Postgres.app kabi: initdb -U postgres + createuser --superuser $USER, trust (Postgres/Server.swift).
#   Tizimdagi PG17 (localhost:5432) — faqat ulanish xatolari uchun (xabarda 5432 port chiqishi uchun), unda hech narsa yaratilmaydi.
#   MongoDB 6.0 standalone (127.0.0.1:27018) + Mongoose — solishtirish uchun.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg1-out"
R="${S:?S=scratchpad kerak}/pg1-run"
B=/usr/lib/postgresql/18/bin
PW=mentor123
SYS_PASS=$(sed -nE 's#^DEV_DB_URL=postgres://postgres:([^@]*)@.*#\1#p' /home/kali/Desktop/papku/IntroNestArxitechture/.env)
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R"
log(){ echo "[$(date +%T)] $*"; }
A(){ PGPASSWORD=$PW psql -h localhost -p 5433 -U postgres "$@" 2>&1; }

stop_all(){
  for d in "$R/a" "$R/b" "$R/c"; do [ -d "$d" ] && $B/pg_ctl -D "$d" -m fast stop >/dev/null 2>&1; done
  if [ -f "$R/mongo.pid" ]; then mp=$(cat "$R/mongo.pid"); kill "$mp" 2>/dev/null
    for i in $(seq 1 20); do kill -0 "$mp" 2>/dev/null || break; sleep 0.5; done; fi
}
trap stop_all EXIT

# Mongoose scratchpad'da turadi (kompyuter qayta yoqilsa /tmp tozalanadi) — yo'q bo'lsa o'rnatiladi
if [ ! -d "$S/pg1-mongo/node_modules/mongoose" ]; then
  mkdir -p "$S/pg1-mongo" && (cd "$S/pg1-mongo" && npm init -y >/dev/null && npm i mongoose@9.11.4 --no-audit --no-fund >/dev/null 2>&1)
fi

# ---------- 00 versiyalar ----------
{ psql --version; $B/postgres --version; mongod --version | head -1; echo "node $(node --version)"; echo "mongoose $(cd "$S/pg1-mongo" && node -e 'console.log(require("mongoose").version)')"; date; } > "$OUT/00-versiyalar.txt"

# ---------- A klaster: Windows o'rnatuvchisi kabi ----------
echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 > "$OUT/01-initdb.txt" 2>&1
$B/pg_ctl -D "$R/a" -o "-p 5433 -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
log "A klaster: $(A -tAc 'select 1')"

# 02 versiya (o'rnatishdan keyingi birinchi tekshiruv)
{ echo '$ psql -U postgres'; echo 'postgres=# SELECT version();'; A -c 'SELECT version();'; } > "$OUT/02-version.txt"
# 03 bazalar ro'yxati
{ echo 'postgres=# \l'; A -c '\l'; } > "$OUT/03-l.txt"

# ---------- tizim PG17 (5432): ulanish xatolari ----------
{ echo '$ psql -U postgres -h localhost   (parol noto'"'"'g'"'"'ri)'; PGPASSWORD=notogri psql -h localhost -p 5432 -U postgres -c 'select 1' 2>&1; } > "$OUT/04-parol-xato.txt"
{ echo '$ psql -U postgres -h localhost -d blog   (bunday baza yo'"'"'q)'; PGPASSWORD=$SYS_PASS psql -h localhost -p 5432 -U postgres -d blog -c 'select 1' 2>&1; } > "$OUT/05-baza-yoq.txt"

# ---------- 06 baza va 2 jadval (o'quvchi amaliyotidagi namuna) ----------
cat > "$R/06.sql" <<'SQL'
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE
);
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  izoh TEXT NOT NULL
);
\dt
\d posts
SQL
{ echo 'postgres=# CREATE DATABASE blog;'; A -c 'CREATE DATABASE blog;'; echo 'postgres=# \c blog'; echo; A -d blog -a -f "$R/06.sql"; } > "$OUT/06-jadvallar.txt"

# ---------- 07 ma'lumot ----------
cat > "$R/07.sql" <<'SQL'
INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');
INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');
SELECT * FROM users;
SELECT * FROM posts;
SQL
A -d blog -a -f "$R/07.sql" > "$OUT/07-insert.txt"

# ---------- 08 baza o'zi tekshiradi: NOT NULL, UNIQUE, FK ----------
# har buyruq alohida -c bilan — xato qo'lda yozilgandagidek chiqadi (-f rejimida oldiga fayl yo'li qo'shiladi)
{ for q in "INSERT INTO users (username) VALUES (NULL);" "INSERT INTO users (username) VALUES ('ali');" \
           "INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');" "DELETE FROM users WHERE id = 1;"; do
    echo "blog=# $q"; A -d blog -c "$q"; echo; done; } > "$OUT/08-tekshiruv-xatolari.txt"

# ---------- 09 JOIN (to'g'ri va ON satri xato) ----------
cat > "$R/09.sql" <<'SQL'
SELECT users.username, posts.izoh
FROM posts
JOIN users ON users.id = posts.user_id;
-- ON satri xato: posts.id bilan ulangan
SELECT users.username, posts.izoh
FROM posts
JOIN users ON users.id = posts.id;
-- postsiz foydalanuvchi ham chiqsin
SELECT users.username, posts.izoh
FROM users
LEFT JOIN posts ON posts.user_id = users.id;
SQL
A -d blog -a -f "$R/09.sql" > "$OUT/09-join.txt"

# ---------- 10 boshqa bazaga ulangan: relation does not exist ----------
{ echo 'postgres=# SELECT * FROM posts;   (blog emas, postgres bazasida)'; A -d postgres -c 'SELECT * FROM posts;'; } > "$OUT/10-relation-yoq.txt"

# ---------- 11 oxirgi telefon: ikki xaridor bir vaqtda ----------
cat > "$R/11a.sql" <<'SQL'
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  nomi TEXT NOT NULL,
  stock INT NOT NULL CHECK (stock >= 0)
);
INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);
SELECT * FROM products;
SQL
A -d blog -a -f "$R/11a.sql" > "$OUT/11-products.txt"
cat > "$R/11-xaridor1.sql" <<'SQL'
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;
SELECT pg_sleep(3);
COMMIT;
SQL
cat > "$R/11-xaridor2.sql" <<'SQL'
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;
SQL
t0=$(date +%s.%N)
( A -d blog -a -f "$R/11-xaridor1.sql" > "$R/x1.txt"; echo "tugadi $(echo "$(date +%s.%N) - $t0" | bc | cut -c1-4) s" >> "$R/x1.txt" ) &
sleep 1
A -d blog -a -f "$R/11-xaridor2.sql" > "$R/x2.txt"; echo "tugadi $(echo "$(date +%s.%N) - $t0" | bc | cut -c1-4) s" >> "$R/x2.txt"
wait
{ echo '=== 1-xaridor (0 s da boshladi; tranzaksiya 3 s ochiq turadi) ==='; cat "$R/x1.txt"; echo; echo '=== 2-xaridor (1 s da boshladi) ==='; cat "$R/x2.txt"; echo; echo '=== keyin ==='; A -d blog -c 'SELECT * FROM products;'; } > "$OUT/12-oxirgi-telefon.txt"
# WHERE stock > 0 siz: CHECK to'xtatadi
{ echo 'blog=# UPDATE products SET stock = stock - 1 WHERE id = 1;'; A -d blog -c 'UPDATE products SET stock = stock - 1 WHERE id = 1;'; } > "$OUT/13-check.txt"

# ---------- 19 amaliyotda tez-tez: jadval allaqachon bor · vergul tushib qolgan ----------
{ q="CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);"; echo "blog=# $q"; A -d blog -c "$q"; echo
  q="CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);"; echo "blog=# $q"; A -d blog -c "$q"; } > "$OUT/19-amaliyot-xatolari.txt"
# ---------- 20 server ishlamayapti (bu portda server yo'q) ----------
{ echo '$ psql -U postgres -h localhost   (Windows: xizmat to'"'"'xtagan)'; psql -h localhost -p 5439 -U postgres -c 'select 1' 2>&1
  echo; echo '$ psql -U postgres   (macOS: Postgres.app'"'"'da server to'"'"'xtagan)'; psql -h /tmp -p 5439 -U postgres -c 'select 1' 2>&1; } > "$OUT/20-server-yoq.txt"

# ---------- 18 hammasi yoki hech narsa: buyurtma + ombor bitta tranzaksiyada ----------
cat > "$R/18.sql" <<'SQL'
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id),
  xaridor TEXT NOT NULL
);
BEGIN;
INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;
SELECT * FROM orders;
SQL
# -f rejimida xato oldiga «psql:<fayl>:N: » qo'shiladi — qo'lda yozilganda yo'q, shuning uchun olib tashlanadi
A -d blog -a -f "$R/18.sql" | sed -E 's#^psql:[^ ]+:[0-9]+: ##' > "$OUT/18-hammasi-yoki-hech.txt"

# ---------- 14 JSONB ----------
cat > "$R/14.sql" <<'SQL'
ALTER TABLE products ADD COLUMN extra JSONB;
INSERT INTO products (nomi, stock, extra) VALUES
  ('Futbolka', 12, '{"rang": "qora", "olcham": "M"}'),
  ('Quloqchin', 5, '{"rang": "oq", "bluetooth": true}');
SELECT nomi, extra FROM products;
SELECT nomi, extra->>'rang' AS rang FROM products WHERE extra->>'rang' = 'qora';
SQL
A -d blog -a -f "$R/14.sql" > "$OUT/14-jsonb.txt"

# ---------- 15 Homebrew kabi: postgres roli yo'q ----------
$B/initdb -D "$R/b" --auth=trust --encoding=UTF8 --locale=C.UTF-8 > /dev/null 2>&1
$B/pg_ctl -D "$R/b" -o "-p 5434 -k /tmp -c listen_addresses=''" -l "$R/b.log" -w start >/dev/null
{ echo '$ psql -U postgres'; psql -h /tmp -p 5434 -U postgres -c 'select 1' 2>&1
  echo; echo "\$ createuser -s postgres"; createuser -h /tmp -p 5434 -U "$USER" -s postgres 2>&1 && echo '(xabarsiz — tayyor)'
  echo; echo '$ psql -U postgres -c "SELECT current_user;"'; psql -h /tmp -p 5434 -U postgres -d postgres -c 'SELECT current_user;' 2>&1; } > "$OUT/15-rol-yoq.txt"

# ---------- 16 Postgres.app kabi: postgres roli bor, parolsiz ----------
$B/initdb -D "$R/c" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 > /dev/null 2>&1
$B/pg_ctl -D "$R/c" -o "-p 5435 -k /tmp -c listen_addresses=''" -l "$R/c.log" -w start >/dev/null
createuser -h /tmp -p 5435 -U postgres --superuser "$USER" 2>&1; createdb -h /tmp -p 5435 -U "$USER" "$USER" 2>&1
{ echo '$ psql -U postgres -c "SELECT current_user;"   (parol so'"'"'ralmaydi)'; psql -h /tmp -p 5435 -U postgres -d postgres -c 'SELECT current_user;' 2>&1
  echo '$ psql -c "SELECT current_user, current_database();"'; psql -h /tmp -p 5435 -c 'SELECT current_user, current_database();' 2>&1; } > "$OUT/16-postgresapp.txt"

# ---------- 17 MongoDB + Mongoose (mentor biladigan tomon) ----------
mkdir -p "$R/mongo"
mongod --dbpath "$R/mongo" --port 27018 --bind_ip 127.0.0.1 --fork --logpath "$R/mongo.log" --pidfilepath "$R/mongo.pid" >/dev/null 2>&1
cat > "$S/pg1-mongo/run.cjs" <<'JS'
const mongoose = require('mongoose');
const show = (t, x) => console.log('--- ' + t + '\n' + JSON.stringify(x, null, 2));
(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27018/blog');
  await mongoose.connection.dropDatabase();
  const User = mongoose.model('User', new mongoose.Schema({ username: String }));
  const Post = mongoose.model('Post', new mongoose.Schema({ author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, izoh: String }));
  const ali = await User.create({ username: 'ali' });
  await Post.create({ author: ali._id, izoh: 'Birinchi post' });
  show("Post.find().populate('author')", await Post.find().populate('author').lean());
  // muallifi yo'q post — Mongo to'xtatmaydi
  await Post.create({ author: new mongoose.Types.ObjectId(), izoh: "Muallifi yo'q post" });
  show("muallifi yo'q post saqlandi; populate", await Post.find().populate('author').lean());
  // schema'siz yozilgan hujjat — boshqa maydonlar bilan
  await mongoose.connection.db.collection('posts').insertOne({ muallif: 'vali', matn: 'Salom', like: 5 });
  show("posts kolleksiyasi (har hujjat har xil)", await mongoose.connection.db.collection('posts').find({}, { projection: { _id: 0, __v: 0 } }).toArray());
  // tranzaksiya — standalone serverda
  const s = await mongoose.startSession();
  try { await s.withTransaction(async () => { await User.create([{ username: 'vali' }], { session: s }); }); console.log('tranzaksiya: ok'); }
  catch (e) { console.log('--- tranzaksiya (standalone mongod)\nXATO: ' + e.message); }
  await s.endSession(); await mongoose.disconnect();
  // oxirgi telefon Mongo'da: bitta hujjatni shart bilan kamaytirish — ikki xaridor bir vaqtda
  await mongoose.connect('mongodb://127.0.0.1:27018/blog');
  const Product = mongoose.model('Product', new mongoose.Schema({ nomi: String, stock: Number }));
  const tel = await Product.create({ nomi: 'Telefon', stock: 1 });
  const sotish = () => Product.updateOne({ _id: tel._id, stock: { $gt: 0 } }, { $inc: { stock: -1 } });
  const [x1, x2] = await Promise.all([sotish(), sotish()]);
  show("oxirgi telefon — 2 xaridor bir vaqtda updateOne({stock: {$gt: 0}}, {$inc: {stock: -1}})", { xaridor1: { modifiedCount: x1.modifiedCount }, xaridor2: { modifiedCount: x2.modifiedCount }, keyin: await Product.findById(tel._id, { _id: 0, __v: 0 }).lean() });
  await mongoose.disconnect();
  // xabar «retryWrites=false qo'shing» deydi — qo'shib ko'ramiz: asl sabab chiqadi
  await mongoose.connect('mongodb://127.0.0.1:27018/blog?retryWrites=false');
  const s2 = await mongoose.startSession();
  try { await s2.withTransaction(async () => { await User.create([{ username: 'vali' }], { session: s2 }); }); console.log('tranzaksiya: ok'); }
  catch (e) { console.log('--- tranzaksiya (retryWrites=false bilan)\nXATO: ' + e.message); }
  await s2.endSession(); await mongoose.disconnect();
})().catch((e) => { console.error('XATO', e.message); process.exit(1); });
JS
(cd "$S/pg1-mongo" && node run.cjs) > "$OUT/17-mongo.txt" 2>&1

# ---------- 22–24 (01.11 avtopilot): MD «KOD 6» — ⚠ belgili buyruqlar. Oldingi fayllar o'zgarmaydi: bu bo'lim oxirida yuradi ----------
Q(){ db=$1; shift; for q in "$@"; do echo "$db=# $q"; A -d "$db" -c "$q"; echo; done; }
# 22: tuzatishlar va takror yaratish (10, 13, 14, 17-ekran)
{ echo '--- 10-ekran: vergul qo'"'"'yilgan tags'
  Q blog "CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT);"
  echo '--- 14-ekran: baza ikkinchi marta'
  Q postgres "CREATE DATABASE blog;"
  echo '--- 17-ekran: FROM posts LEFT JOIN users (teskari tomondan)'
  Q blog "SELECT users.username, posts.izoh FROM posts LEFT JOIN users ON users.id = posts.user_id;"
  echo '--- 13-ekran after: avval postlar, keyin foydalanuvchi; yo'"'"'q id'
  Q blog "DELETE FROM posts WHERE user_id = 1;" "DELETE FROM users WHERE id = 1;" "DELETE FROM users WHERE id = 99;"
} > "$OUT/22-tuzatishlar.txt"
# 23: 14-ekran — REFERENCES unutilgan posts (alohida baza), DROP TABLE va qayta yaratish
A -c 'CREATE DATABASE blog_fk;' >/dev/null
{ Q blog_fk "CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);" \
    "CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL, izoh TEXT NOT NULL);" \
    "INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');" \
    "DROP TABLE posts;" \
    "CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);" \
    "INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');"
} > "$OUT/23-references-unutilgan.txt"
# 24: 22-ekran «Boshqacha chiqdimi?» — telefon holatlari
sotish(){ A -d blog -c "UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;"; }
ikki_oyna(){ # $1 — 1-oyna tranzaksiyasi ochiq turadigan soniya
  printf 'BEGIN;\nUPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;\nSELECT pg_sleep(%s);\nCOMMIT;\n' "$1" > "$R/24x1.sql"
  t0=$(date +%s.%N)
  ( A -d blog -a -f "$R/24x1.sql" > "$R/24x1.txt" ) &
  sleep 1; sotish > "$R/24x2.txt"; echo "2-oyna tugadi: $(echo "$(date +%s.%N) - $t0" | bc | cut -c1-4) s (1 s da boshlagan)" >> "$R/24x2.txt"; wait
  echo '[1-oyna]'; cat "$R/24x1.txt"; echo '[2-oyna]'; cat "$R/24x2.txt"; }
{ echo '=== A: 1-oyna COMMIT allaqachon qilgan, keyin 2-oyna ==='
  Q blog "UPDATE products SET stock = 1 WHERE id = 1;"
  printf 'BEGIN;\nUPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;\nCOMMIT;\n' > "$R/24a.sql"
  echo '[1-oyna]'; A -d blog -a -f "$R/24a.sql"
  t0=$(date +%s.%N); echo '[2-oyna]'; sotish; echo "2-oyna tugadi: $(echo "$(date +%s.%N) - $t0" | bc | cut -c1-4) s"
  echo; echo '=== B: telefon 2 ta (stock = 2), ikki oyna ==='
  Q blog "UPDATE products SET stock = 2 WHERE id = 1;"
  ikki_oyna 3
  echo; Q blog "SELECT id, nomi, stock FROM products WHERE id = 1;"
} > "$OUT/24-telefon-holatlar.txt"

log "tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
stop_all; trap - EXIT; rm -rf "$R"
