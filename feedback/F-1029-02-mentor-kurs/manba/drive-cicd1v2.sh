#!/usr/bin/env bash
# CI/CD-1 v2 mentor darsi — haqiqiy chiqishlar OrderBotNest ustida, GitHub'siz qism (F-1104-20, 04.11). Natija: manba/cicd1v2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd1v2.sh
# CI mashinasi kabi: `jest2-done` YANGI papkaga clone, node_modules YO'Q, har buyruq toza muhitda (env -i … CI=true).
# GitHub Actions'dagi haqiqiy run'lar — alohida skript (drive-cicd1v2-actions.sh, workflow scope kerak).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1v2-out"
SRC=/home/kali/Desktop/order-bot
R="${S:?S=scratchpad kerak}/cicd1v2-run"
mkdir -p "$OUT"; rm -rf "$R"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0 CI=true)
run(){ echo "\$ $*"; local t0=$(date +%s.%N); "${CLEAN[@]}" "$@" 2>&1; local rc=$?; local t1=$(date +%s.%N); printf '[chiqish kodi: %d · %.1f s]\n\n' "$rc" "$(echo "$t1 - $t0" | bc)"; return $rc; }
git -c advice.detachedHead=false clone -q --branch jest2-done "$SRC" "$R" 2>/dev/null; cd "$R"
{ node --version; npm --version; git log -1 --format='HEAD %h %s' | cut -c1-70; date; } > "$OUT/00-versiyalar.txt"

# 01 — lenta qo'lda: to'rt qadam ketma-ket, har biri chiqish kodi bilan (node_modules yo'q — toza mashina)
{ echo '# Toza clone (node_modules yo\x27q) — CI mashinasidagi kabi'; echo '$ ls'; ls; echo
  run npm ci --no-audit --no-fund
  run npx tsc --noEmit
  run npm test
  run npm run build
  echo '$ ls dist | head'; ls dist | head; } > "$OUT/01-lenta-yashil.txt"

# 02 — test qizil → lenta shu yerda to'xtaydi (&& zanjiri)
sed -i 's/        if (p.stock < c.qty) {/        if (p.stock <= c.qty) {/' src/api/order/order.service.ts
{ echo '# order.service.ts 36: < → <= (chegara buzildi)'; echo '$ npm ci && npx tsc --noEmit && npm test && npm run build'
  "${CLEAN[@]}" sh -c 'npm ci --no-audit --no-fund >/dev/null 2>&1 && echo "npm ci ✓" && npx tsc --noEmit && echo "tsc ✓" && npm test && npm run build' 2>&1 | grep -vE "^\s+at |^\s*$"; echo "[chiqish kodi: ${PIPESTATUS[0]}]"; } > "$OUT/02-test-qizil-lenta-toxtadi.txt"
git checkout -q -- src

# 03 — package.json qo'lda o'zgartirildi, lock emas → npm ci yiqiladi (CI mashinasida npm install emas, npm ci)
node -e 'const p=require("./package.json");p.dependencies["dayjs"]="^1.11.13";require("fs").writeFileSync("package.json",JSON.stringify(p,null,2)+"\n")'
{ echo '# package.json ga dayjs qo\x27shildi, package-lock.json o\x27zgarmadi'; run npm ci --no-audit --no-fund; } > "$OUT/03-npm-ci-lock-sinxron-emas.txt"
git checkout -q -- package.json

# 04 — npm ci unutildi: node_modules yo'q holatda test
rm -rf node_modules
{ echo '# node_modules yo\x27q (lentada npm ci qadami tushib qolgan)'; run npm test; } > "$OUT/04-npm-ci-yoq.txt"
"${CLEAN[@]}" npm ci --no-audit --no-fund >/dev/null 2>&1

# 05 — build bor, lekin ishga tushirish .env'siz: CD uchun secret kerak
{ run npm run build; echo '$ node dist/main'; "${CLEAN[@]}" timeout 20 node dist/main 2>&1 | head -8; echo "[chiqish kodi: ${PIPESTATUS[0]}]"; } > "$OUT/05-dist-main-envsiz.txt"

# 06 — tsc qizil: turi buzilgan kod (lenta test'dan oldin to'xtaydi)
sed -i "s/  const telegram_id = String(from.id);/  const telegram_id = from.id;/" src/api/user/user.service.ts
{ echo '# user.service.ts: telegram_id = from.id (string ustuniga number)'; run npx tsc --noEmit; echo '# test baribir yashilmi? (ts-jest diagnostics)'; run npm test -- --silent 2>&1 | tail -6; } > "$OUT/06-tsc-qizil.txt"
git checkout -q -- src

# 07 — har qadam vaqti (lenta necha soniya) — 01 dan yig'iladi
grep -hE '^\$ |chiqish kodi' "$OUT/01-lenta-yashil.txt" > "$OUT/07-qadam-vaqtlari.txt"
echo "tayyor: $OUT"

# 03b — versiya nomuvofiqligi: package.json da telegraf ^4 → ^5, lock eski → npm ci (04.11: 03 dayjs bilan yiqilmagan edi)
cd "$R"; sed -i 's/"telegraf": "^4.16.3"/"telegraf": "^5.0.0"/' package.json
{ echo '# package.json: telegraf ^4.16.3 → ^5.0.0, package-lock.json eski'; grep -n '"telegraf"' package.json | head -1; run npm ci --no-audit --no-fund; } > "$OUT/03b-npm-ci-versiya-nomuvofiq.txt"
git checkout -q -- package.json
# 03c — lock sinxron emas (mavjud versiya): telegraf ^4.16.3 → 4.16.0, lockda 4.16.3 → npm ci «in sync» xatosi
cd "$R"; sed -i 's/"telegraf": "^4.16.3"/"telegraf": "4.16.0"/' package.json
{ echo '# package.json: telegraf ^4.16.3 → 4.16.0 (mavjud versiya), package-lock.json da 4.16.3'; grep -n '"telegraf"' package.json | head -1; run npm ci --no-audit --no-fund; } > "$OUT/03c-npm-ci-lock-sinxron-emas.txt"
git checkout -q -- package.json

