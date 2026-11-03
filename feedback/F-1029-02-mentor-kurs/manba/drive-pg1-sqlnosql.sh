#!/bin/bash
# F-1102-21 · PG-1 yangi 2-ekran «SQL va NoSQL» uchun haqiqiy chiqishlar.
# Vaqtinchalik PG18 klaster (5436) va mongod (27019) — S papkada; ish oxirida to'xtatiladi.
set -u
S=${S:?scratchpad papkasi kerak}; R="$S/sqlnosql"; OUT="$(dirname "$0")/pg1-out"; B=/usr/lib/postgresql/18/bin
rm -rf "$R"; mkdir -p "$R/mongo"
$B/initdb -D "$R/pg" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p 5436 -k /tmp -c listen_addresses=''" -l "$R/pg.log" -w start >/dev/null
mongod --dbpath "$R/mongo" --port 27019 --bind_ip 127.0.0.1 --fork --logpath "$R/mongo.log" --pidfilepath "$R/mongo.pid" >/dev/null 2>&1
{
echo '--- MongoDB (mongosh): users collection, ikki hujjat — ikkinchisida qo'"'"'shimcha maydon'
mongosh --quiet "mongodb://127.0.0.1:27019/blog" --eval '
db.users.insertMany([{ username: "ali" }, { username: "vali", shahar: "Toshkent" }]);
printjson(db.users.find().toArray());'
} > "$OUT/25-sqlnosql-mongo.txt" 2>&1
psql -h /tmp -p 5436 -U postgres -c "CREATE DATABASE blog;" >/dev/null
{
echo '--- PostgreSQL (psql): users jadvali — ustunlar va qatorlar'
psql -h /tmp -p 5436 -U postgres -d blog -e <<'SQL'
CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);
INSERT INTO users (username) VALUES ('ali'), ('vali');
SELECT * FROM users;
INSERT INTO users (username, shahar) VALUES ('sardor', 'Toshkent');
SELECT username FROM users WHERE id = 2;
SQL
} > "$OUT/26-sqlnosql-pg.txt" 2>&1
$B/pg_ctl -D "$R/pg" -m fast stop >/dev/null; mongosh --quiet "mongodb://127.0.0.1:27019/admin" --eval 'db.shutdownServer()' >/dev/null 2>&1
echo tayyor
