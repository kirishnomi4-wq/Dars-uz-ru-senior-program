#!/usr/bin/env bash
# PG-1 va PG-2 (F-1103-09, 03.11, foydalanuvchi tasdig'i): mentor bilgan MONGOOSE buyruqlari — PostgreSQL buyruqlarining jufti, haqiqiy natija bilan.
# PG-1: blog (User/Post) — User.create, Post.find. PG-2: shop (Product) — create ×4, find $lt, updateOne, deleteOne, updateOne yo'q id,
# updateOne({}) shartsiz (bitta hujjat!), updateMany({}) — WHERE'siz UPDATE tuzog'i uchun.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-mongoose.sh → manba/pg2-out/v2d-mongoose.txt
# Tizimga tegmaydi: vaqtinchalik mongod ($S/pg2mgs-<vaqt>, port 27020), mongoose PG-1 dagi kabi $S/pg1-mongo da (yo'q bo'lsa o'rnatiladi).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out/v2d-mongoose.txt"
S="${S:?S=scratchpad kerak}"; R="$S/pg2mgs-$(date +%s)"; PORT=27020
mkdir -p "$R/db"
if [ ! -d "$S/pg1-mongo/node_modules/mongoose" ]; then
  mkdir -p "$S/pg1-mongo" && (cd "$S/pg1-mongo" && npm init -y >/dev/null && npm i mongoose@9.11.4 --no-audit --no-fund >/dev/null 2>&1)
fi
mongod --dbpath "$R/db" --port $PORT --bind_ip 127.0.0.1 --fork --logpath "$R/mongo.log" --pidfilepath "$R/mongo.pid" >/dev/null 2>&1
trap 'kill "$(cat "$R/mongo.pid" 2>/dev/null)" 2>/dev/null' EXIT
cat > "$S/pg1-mongo/pg2-shop.cjs" <<JS
const mongoose = require('mongoose');
const show = (t, v) => { console.log('--- ' + t); if (v !== undefined) console.log(JSON.stringify(v, null, 2)); };
const slim = (d) => { const o = d.toObject ? d.toObject() : d; delete o.__v; return o; };
(async () => {
  console.log('mongoose ' + mongoose.version + ' · mongod ' + require('child_process').execSync('mongod --version').toString().split('\\n')[0]);
  // ===== PG-1: blog =====
  await mongoose.connect('mongodb://127.0.0.1:${PORT}/blog');
  await mongoose.connection.dropDatabase();
  const User = mongoose.model('User', new mongoose.Schema({ username: String }));
  const Post = mongoose.model('Post', new mongoose.Schema({ author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, izoh: String }));
  const us = await User.create([{ username: 'ali' }, { username: 'vali' }, { username: 'sardor' }]);
  show("PG-1 12-ekran · await User.create([{ username: 'ali' }, { username: 'vali' }, { username: 'sardor' }]) → " + us.length + ' ta hujjat', us.map(slim));
  await Post.create([{ author: us[0]._id, izoh: 'Birinchi post' }, { author: us[0]._id, izoh: "Bugun Nest o'rgandim" }, { author: us[1]._id, izoh: 'Salom hammaga' }]);
  show('PG-1 12-ekran · await Post.find()', (await Post.find()).map(slim));
  await mongoose.disconnect();
  // ===== PG-2: shop =====
  await mongoose.connect('mongodb://127.0.0.1:${PORT}/shop');
  await mongoose.connection.dropDatabase();
  const dbs = async () => (await mongoose.connection.db.admin().listDatabases({ nameOnly: true })).databases.map((d) => d.name);
  show("PG-2 3-ekran · mongoose.connect('mongodb://localhost/shop') dan keyin bazalar (shop hali yo'q)", await dbs());
  const Product = mongoose.model('Product', new mongoose.Schema({ _id: Number, name: String, price: Number, stock: Number }));
  const ps = await Product.create([
    { _id: 1, name: 'Klaviatura', price: 120000, stock: 8 },
    { _id: 2, name: 'Sichqoncha', price: 75000, stock: 15 },
    { _id: 3, name: 'Quloqchin', price: 95000, stock: 5 },
    { _id: 4, name: 'Kolonka', price: 50000, stock: 10 },
  ]);
  show('PG-2 3-ekran · await Product.create([ …4 ta… ]) → ' + ps.length + ' ta hujjat', ps.map(slim));
  show('PG-2 3-ekran · birinchi create dan keyin bazalar', await dbs());
  show('PG-2 4-ekran · await Product.find({ price: { \$lt: 100000 } })', (await Product.find({ price: { \$lt: 100000 } })).map(slim));
  show('PG-2 5-ekran · await Product.updateOne({ _id: 1 }, { price: 99000 })', await Product.updateOne({ _id: 1 }, { price: 99000 }));
  show('PG-2 5-ekran · await Product.deleteOne({ _id: 3 })', await Product.deleteOne({ _id: 3 }));
  show('PG-2 5-ekran · await Product.updateOne({ _id: 99 }, { price: 1 })   // bunday id yo\\'q', await Product.updateOne({ _id: 99 }, { price: 1 }));
  show('PG-2 9-ekran · await Product.updateOne({}, { price: 99000 })   // SHARTSIZ — nechta hujjat?', await Product.updateOne({}, { price: 99000 }));
  show('PG-2 9-ekran · shundan keyin Product.find()', (await Product.find().sort({ _id: 1 })).map(slim));
  show('PG-2 9-ekran · await Product.updateMany({}, { price: 99000 })   // hammasi uchun alohida buyruq', await Product.updateMany({}, { price: 99000 }));
  show('PG-2 9-ekran · shundan keyin Product.find()', (await Product.find().sort({ _id: 1 })).map(slim));
  await mongoose.disconnect();
})().catch((e) => { console.error('XATO', e); process.exit(1); });
JS
(cd "$S/pg1-mongo" && node pg2-shop.cjs) > "$OUT" 2>&1
echo "TAYYOR: $OUT ($(wc -l < "$OUT") qator)"
