#!/usr/bin/env bash
# ESKIRGAN (03.11 kech): mentor Mongoose'ni biladi — o'rniga drive-pg2-mongoose.sh → v2d-mongoose.txt; bu mongosh natijasi pg2-out/eski-2026-11-03-mongosh/ da.
# PG-2 (F-1103-09, 03.11): o'sha do'kon MongoDB'da — CREATE DATABASE / CREATE TABLE / INSERT / SELECT / UPDATE / DELETE ning Mongo'dagi o'rni.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-mongo.sh  → manba/pg2-out/v2c-mongo.txt
# Tizimga tegmaydi: vaqtinchalik mongod ($S/pg2mongo, port 27019), oxirida to'xtatiladi.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out/v2c-mongo.txt"
R="${S:?S=scratchpad kerak}/pg2mongo-$(date +%s)"; PORT=27019   # har yurgizish — yangi bo'sh papka
mkdir -p "$R/db"
mongod --dbpath "$R/db" --port $PORT --bind_ip 127.0.0.1 --fork --logpath "$R/mongo.log" --pidfilepath "$R/mongo.pid" >/dev/null 2>&1
trap 'mongosh --quiet --port '$PORT' --eval "db.getSiblingDB(\"admin\").shutdownServer()" >/dev/null 2>&1' EXIT
cat > "$R/shop.js" <<'JS'
let P = 'test';
const show = (cmd, v) => { print(P + '> ' + cmd); if (v !== undefined) printjson(v); };
print('mongosh ' + version() + ' · server ' + db.version());
show('show dbs', db.adminCommand({ listDatabases: 1, nameOnly: true }).databases.map((d) => d.name));
db = db.getSiblingDB('shop');
print("test> use shop\nswitched to db shop"); P = 'shop';
show('show dbs   // shop hali yo\'q', db.adminCommand({ listDatabases: 1, nameOnly: true }).databases.map((d) => d.name));
show("db.products.insertMany([...])", db.products.insertMany([
  { _id: 1, name: 'Klaviatura', price: 120000, stock: 8 },
  { _id: 2, name: 'Sichqoncha', price: 75000, stock: 15 },
  { _id: 3, name: 'Quloqchin', price: 95000, stock: 5 },
  { _id: 4, name: 'Kolonka', price: 50000, stock: 10 },
]));
show('show dbs   // birinchi yozuvdan keyin', db.adminCommand({ listDatabases: 1, nameOnly: true }).databases.map((d) => d.name));
show('show collections', db.getCollectionNames());
show('db.products.find({ price: { $lt: 100000 } })', db.products.find({ price: { $lt: 100000 } }).toArray());
show('db.products.updateOne({ _id: 1 }, { $set: { price: 99000 } })', db.products.updateOne({ _id: 1 }, { $set: { price: 99000 } }));
show('db.products.deleteOne({ _id: 3 })', db.products.deleteOne({ _id: 3 }));
show('db.products.updateOne({ _id: 99 }, { $set: { price: 1 } })', db.products.updateOne({ _id: 99 }, { $set: { price: 1 } }));
show('db.products.insertOne({ nomi: "Planshet" })   // ustun qoidasi yo\'q', db.products.insertOne({ nomi: 'Planshet' }));
show('db.products.find()', db.products.find().toArray());
JS
mongosh --quiet --port $PORT --file "$R/shop.js" > "$OUT" 2>&1
echo "TAYYOR: $OUT"
