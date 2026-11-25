#!/bin/bash
# F-1125-01 · Nest-2 AI bloki — AI uchun asos nusxa: o'quvchi reposi (IntroNestArxitechture, 45071ac = GitHub HEAD)
# + mentor 2-amaliyotda qo'shgan car resursi (manba/drive-nest2.sh 11-qadam, car-qoshish.sh) + o'z bazasi va .env.
# Ishlatish: bash baza.sh <ish-papka> <variant> <baza-nomi>   (masalan: … oddiy nest2_ai_a)
# Parol faqat .env ga yoziladi (o'quvchi loyihasidagidek), chiqishlarga yozilmaydi.
set -eu
W="${1:?ish papka}"; V="${2:?variant}"; DB="${3:?baza}"
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC=/home/kali/Desktop/papku/IntroNestArxitechture
PG_PASS=$(sed -nE 's#^DEV_DB_URL=postgres://postgres:([^@]*)@.*#\1#p' "$SRC/.env")
PGADMIN="postgres://postgres:${PG_PASS}@localhost:5432/postgres"
PGF='^WARNING:  database .* collation version mismatch\|^DETAIL:  The database was created using collation\|^HINT:  Rebuild all objects in this database'
D="$W/$V/IntroNestArxitechture"
mkdir -p "$W/$V"
[ -e "$D" ] && { echo "$D allaqachon bor — to'xtadim"; exit 1; }
git clone -q "$SRC" "$D"
cp -a "$SRC/node_modules" "$D/node_modules"
cd "$D"
bash "$HERE/car-qoshish.sh"
{ echo "PORT=3000"; echo; echo "NODE_ENV=dev"; echo; echo "# DB"
  echo "DEV_DB_URL=postgres://postgres:${PG_PASS}@localhost:5432/${DB}"
  echo "PROD_DB_URL=postgres://postgres:${PG_PASS}@localhost:5432/${DB}_prod"; echo
  cat <<'EOT'
# JWT
Access_Token_Key=mentor-kurs-access-key
Access_Token_Time=24h
Refresh_Token_Key=mentor-kurs-refresh-key
Refresh_Token_Time=30d

# Superadmin
USER_NAME=superadmin
EMAIL=super@admin.uz
FULL_NAME=Super Admin
PHONE=+998901234567
PASSWORD=Superadmin1!
EOT
} > .env
psql "$PGADMIN" -q -c "DROP DATABASE IF EXISTS $DB WITH (FORCE);" 2>&1 | grep -v "$PGF" || true
psql "$PGADMIN" -q -c "CREATE DATABASE $DB TEMPLATE template0;" 2>&1 | grep -v "$PGF" || true
git add -A && git -c user.name=baza -c user.email=baza@localhost commit -qm "baza: car resursi (mentor 2-amaliyoti)"
echo "tayyor: $D · baza $DB · $(git log --oneline | head -1)"
