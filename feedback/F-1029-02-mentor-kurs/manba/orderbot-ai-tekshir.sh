#!/usr/bin/env bash
# AI yozgan kodni mentor ko'zi bilan tekshirish: N — prompt raqami.
# Toza baza shop_v da: build → seed (2 marta) → bot senariysi (2 jarayon, restart) → psql.
set -u
N=$1
W=${W:-/tmp/claude-1000/-home-kali-Desktop-internetLesson/93105f50-e3b6-402e-adf2-378a274a0d3c/scratchpad/ai-run/OrderBotNest}
M=/home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs/manba
OUT=$M/${RUN:-orderbot-ai}/p$N; mkdir -p "$OUT"
B=/usr/lib/postgresql/18/bin
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat PGPASSWORD=parol
PSQL="$B/psql -h localhost -p 5437 -U postgres"
cd "$W"
git add -A >/dev/null
git diff --cached --stat > "$OUT/diff-stat.txt"; git diff --cached > "$OUT/diff.patch"
git -c user.name=mentor -c user.email=mentor@local -c commit.gpgsign=false commit -q -m "prompt $N (AI)" || true
{ echo "== tsc =="; npx tsc --noEmit -p tsconfig.json && echo "tsc ✓"; echo "== nest build =="; npx nest build && echo "build ✓"; } > "$OUT/01-build.txt" 2>&1
$PSQL -d postgres -qc "DROP DATABASE IF EXISTS shop_v;" -c "CREATE DATABASE shop_v TEMPLATE template0;" >/dev/null
export DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_v BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111
{ echo "== npm run seed (1) =="; timeout 120 npm run -s seed 2>&1 | tail -n 15; echo "exit $?"; echo "== npm run seed (2) =="; timeout 120 npm run -s seed 2>&1 | tail -n 15; } > "$OUT/02-seed.txt" 2>&1
$PSQL -d shop_v -c '\dt' -c 'SELECT * FROM products ORDER BY id;' > "$OUT/03-seed-keyin.txt" 2>&1
timeout 180 node "$M/orderbot-harness.cjs" "$W" baza > "$OUT/04-senariy.txt" 2>&1; echo "harness exit $?" >> "$OUT/04-senariy.txt"
timeout 180 node "$M/orderbot-harness.cjs" "$W" state > "$OUT/04b-state-restart.txt" 2>&1; echo "harness exit $?" >> "$OUT/04b-state-restart.txt"
if [ "$N" -ge 4 ]; then timeout 180 node "$M/orderbot-harness.cjs" "$W" race > "$OUT/04c-race.txt" 2>&1; echo "harness exit $?" >> "$OUT/04c-race.txt"; fi
{ $PSQL -d shop_v -c '\dt'; for t in $($PSQL -d shop_v -Atc "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY 1"); do $PSQL -d shop_v -c "\\d $t" -c "SELECT * FROM $t ORDER BY 1 LIMIT 20;"; done; } > "$OUT/05-psql.txt" 2>&1
echo "p$N: $(cat $OUT/diff-stat.txt | tail -n1)"; grep -E "✓|error" "$OUT/01-build.txt" | head -5
