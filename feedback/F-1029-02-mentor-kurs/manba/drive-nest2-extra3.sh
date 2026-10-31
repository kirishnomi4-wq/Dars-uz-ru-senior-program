#!/usr/bin/env bash
# drive-nest2-extra3.sh — MD v4 6-ekran yechimi: bo'sh superadmin satrini o'chirib qayta ishga tushirish → superadmin .env'dan
# yangidan yaratiladimi, signin ishlaydimi. 27-superadmin-reset.*
# Ishlatish: bash drive-nest2-extra3.sh <ish-papka> <out-papka>
set -u
WORK=${1:?}; OUT=${2:?}; R="$WORK/IntroNestArxitechture"; cd "$R" || exit 1
PG_PASS=$(sed -nE 's#^DEV_DB_URL=postgres://postgres:([^@]*)@.*#\1#p' /home/kali/Desktop/papku/IntroNestArxitechture/.env)
DB=nest2_mentor
PGF='^WARNING:  database .* collation version mismatch\|^DETAIL:  The database was created using collation\|^HINT:  Rebuild all objects in this database'
dbq(){ psql "postgres://postgres:${PG_PASS}@localhost:5432/$DB" -c "$1" 2>&1 | grep -v "$PGF"; }
port_pid(){ ss -ltnp 'sport = :3000' 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2; }
SRV=""
stop(){ pkill -f "nest start" 2>/dev/null; [ -n "$SRV" ] && kill "$SRV" 2>/dev/null; local p; for _ in $(seq 1 20); do p=$(port_pid); [ -z "$p" ] && break; kill "$p" 2>/dev/null; sleep 0.5; done; [ -n "$SRV" ] && wait "$SRV" 2>/dev/null; SRV=""; sleep 1; }
up(){ for _ in $(seq 1 180); do curl -s -o /dev/null localhost:3000/api/v1 && return 0; kill -0 "$SRV" 2>/dev/null || return 1; sleep 0.5; done; return 2; }
start(){ : > "$OUT/$1"; ( npx nest start >> "$OUT/$1" 2>&1 ) & SRV=$!; up; local rc=$?; echo "   $1 → $rc"; return $rc; }
req(){ local f="$OUT/$1" m=$2 p=$3 b=${4:-}; { echo "### $m $p${b:+   body: $b}"; curl -s -X "$m" "localhost:3000$p" -H 'Content-Type: application/json' ${b:+-d "$b"} -w '\n-- status: %{http_code}\n'; echo; } >> "$f" 2>&1; }
trap 'stop' EXIT
stop
F=27-superadmin-reset.txt; : > "$OUT/$F"
cp .env "$WORK/bak-env3"
# 1) bo'sh superadmin holatini qayta yaratish: superadminni o'chirib, .env Superadmin blokini bo'shatib ishga tushirish
dbq "DELETE FROM admins WHERE role='superAdmin';" >/dev/null
sed -i -E 's/^(USER_NAME|EMAIL|FULL_NAME|PHONE|PASSWORD)=.*/\1=/' .env
start 27a-blank.log
{ echo "## 1) .env Superadmin bo'sh → ishga tushirish"; echo "Super admin created: $(grep -c 'Super admin created' "$OUT/27a-blank.log")"; dbq "select username, role from admins order by created_at;"; } >> "$OUT/$F"
stop
# 2) .env to'ldirildi, superadmin satri o'chirilmadi → qayta ishga tushirish
cp "$WORK/bak-env3" .env
start 27b-filled-no-delete.log
{ echo "## 2) .env to'ldirildi, bo'sh superadmin satri bazada qoldi → qayta ishga tushirish"; echo "Super admin created: $(grep -c 'Super admin created' "$OUT/27b-filled-no-delete.log")"; dbq "select username, role from admins order by created_at;"; } >> "$OUT/$F"
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"Superadmin1!"}'
stop
# 3) MD 6-ekran yechimi: satrni o'chirish → qayta ishga tushirish
{ echo "## 3) DELETE FROM admins WHERE role='superAdmin'; → qayta ishga tushirish"; dbq "DELETE FROM admins WHERE role='superAdmin';"; } >> "$OUT/$F"
start 27c-after-delete.log
{ echo "Super admin created: $(grep -c 'Super admin created' "$OUT/27c-after-delete.log")"; grep -m1 'Super admin created' "$OUT/27c-after-delete.log"; dbq "select username, role from admins order by created_at;"; } >> "$OUT/$F"
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"Superadmin1!"}'
stop
echo "TUGADI (extra3)"
