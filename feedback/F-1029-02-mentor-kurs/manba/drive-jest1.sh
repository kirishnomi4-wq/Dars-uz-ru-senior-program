#!/usr/bin/env bash
# Jest-1 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/jest1-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest1.sh
# O'quvchi reposi GitHub'dan YANGI papkaga clone qilinadi ($S/jest1-run) — mahalliy nusxaga tegilmaydi.
# A) Nest repo (o'quvchi m4b-01 amaliyoti «o'z loyihangiz» — m4a dan keyin): order.ts + order.spec.ts, PASS/FAIL/yolg'on PASS, rootDir tuzog'i,
#    darsdagi `npm i -D jest ts-jest` buyrug'i. B) Bo'sh JS loyiha: o'sha buyruqlar Nest'siz qanday ishlaydi.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest1-out"
R="${S:?S=scratchpad kerak}/jest1-run"
REPO=https://github.com/Azizbekcrypto/IntroNestArxitechture.git
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R"
# MUHIM (01.11): Jest 30 agent muhitini sezadi (@jest/core AGENT_ENV_VARS: CLAUDECODE, CLAUDE_CODE, CURSOR_AGENT…) va ixcham
# chiqaradi — PASS qatorlari va test nomlari yo'qoladi. O'quvchi terminalidagi chiqish uchun har buyruq TOZA muhitda (env -i).
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
{ node --version; npm --version; date; } > "$OUT/00-versiyalar.txt"

# ---------- A: Nest repo ----------
cd "$R" && git clone -q "$REPO" nest && cd nest
{ git log -1 --format='HEAD %h · %ad · %s' --date=short
  echo '$ npm ci'; npm ci --no-audit --no-fund 2>&1 | grep -v "^npm error A complete log" | head -8; echo "[chiqish kodi: ${PIPESTATUS[0]}]"
  echo '$ npm install'; npm install --no-audit --no-fund 2>&1 | tail -2; echo "[chiqish kodi: ${PIPESTATUS[0]}]"; } > "$OUT/01-clone-install.txt"
node -e 'const p=require("./package.json");console.log(JSON.stringify({test:p.scripts.test,jest:p.jest,dev:Object.fromEntries(Object.entries(p.devDependencies).filter(([k])=>/jest|typescript/.test(k)))},null,1))' >> "$OUT/01-clone-install.txt"
( for p in jest ts-jest typescript; do echo "$p $(node -p "require('$p/package.json').version")"; done ) >> "$OUT/00-versiyalar.txt"
# 02 hali birorta spec yo'q — npm test
run npm test > "$OUT/02-test-yoq.txt"
# 03 order.ts + order.spec.ts — src ichida (rootDir: src) → PASS
cat > src/order.ts <<'TS'
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}
TS
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    expect(result).toBe(20000);
  });
});
TS
run npm test > "$OUT/03-pass.txt"
# 04 kod buzildi: * → + → FAIL (Expected / Received)
sed -i 's/price \* quantity/price + quantity/' src/order.ts
run npm test > "$OUT/04-fail-kod-buzildi.txt"
sed -i 's/price + quantity/price * quantity/' src/order.ts
# 05 expect yo'q — yolg'on PASS; console.log bilan ham
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    console.log(result);
  });
});
TS
run npm test > "$OUT/05-expect-yoq.txt"
# 06 noto'g'ri etalon: toBe(10002) — kod to'g'ri, test qizil
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(10002);
  });
});
TS
run npm test > "$OUT/06-notogri-etalon.txt"
# 07 test fayli src dan tashqarida (loyiha ildizida) — rootDir: src
mkdir -p "$R/ildiz-test" && mv src/order.spec.ts ./order.spec.ts && sed -i "s#from './order'#from './src/order'#" order.spec.ts
run npm test > "$OUT/07-src-dan-tashqari.txt"
mv order.spec.ts src/order.spec.ts && sed -i "s#from './src/order'#from './order'#" src/order.spec.ts
# 08 fayl nomi .test.ts (Nest testRegex faqat .spec.ts)
mv src/order.spec.ts src/order.test.ts
run npm test > "$OUT/08-test-ts-nomi.txt"
mv src/order.test.ts src/order.spec.ts
# 09 uyga vazifa: deliveryFee — chegara 100 000
cat > src/delivery.ts <<'TS'
export function deliveryFee(total: number): number {
  return total >= 100000 ? 0 : 15000;
}
TS
cat > src/delivery.spec.ts <<'TS'
import { deliveryFee } from './delivery';

describe('deliveryFee', () => {
  it('150 000 — yetkazish bepul', () => {
    expect(deliveryFee(150000)).toBe(0);
  });
  it('aynan 100 000 — bepul', () => {
    expect(deliveryFee(100000)).toBe(0);
  });
  it('99 000 — 15 000', () => {
    expect(deliveryFee(99000)).toBe(15000);
  });
});
TS
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
});
TS
run npm test > "$OUT/09-uyga-vazifa-pass.txt"
# 10 chegara xatosi: > o'rniga >= unutilgan → aynan 100 000 qizil
sed -i 's/total >= 100000/total > 100000/' src/delivery.ts
run npm test > "$OUT/10-chegara-xato.txt"
sed -i 's/total > 100000/total >= 100000/' src/delivery.ts
# 11 darsdagi buyruq Nest reposida: npm i -D jest ts-jest — nima o'zgaradi
{ echo "--- oldin"; node -p "['jest','ts-jest'].map(p=>p+' '+require(p+'/package.json').version).join(' · ')"
  echo '$ npm i -D jest ts-jest'; npm i -D jest ts-jest --no-audit --no-fund 2>&1 | tail -6; echo "[chiqish kodi: ${PIPESTATUS[0]}]"
  echo "--- keyin"; node -p "['jest','ts-jest'].map(p=>p+' '+require(p+'/package.json').version).join(' · ')"
  echo; run npm test; } > "$OUT/11-npm-i-jest-nestda.txt" 2>&1

# ---------- B: bo'sh JS loyiha — o'sha buyruqlar Nest'siz ----------
mkdir -p "$R/bosh" && cd "$R/bosh" && npm init -y >/dev/null
cp "$R/nest/src/order.ts" "$R/nest/src/order.spec.ts" .
{ echo '$ npm i -D jest ts-jest'; npm i -D jest ts-jest --no-audit --no-fund 2>&1 | tail -3
  node -e 'const f="package.json",p=require("./"+f);p.scripts.test="jest";require("fs").writeFileSync(f,JSON.stringify(p,null,2))'
  echo '--- package.json: "test": "jest"'; echo; run npm test; } > "$OUT/12-bosh-loyiha-sozlamasiz.txt" 2>&1
{ echo '$ npx ts-jest config:init'; npx ts-jest config:init 2>&1 | tail -3; echo; ls; echo; run npm test; } > "$OUT/13-bosh-loyiha-config-init.txt" 2>&1
{ echo '$ npm i -D typescript @types/jest'; npm i -D typescript @types/jest --no-audit --no-fund 2>&1 | tail -2; echo; run npm test; } > "$OUT/14-bosh-loyiha-typescript.txt" 2>&1

{ echo '$ npm i -D typescript@5'; npm i -D typescript@5 --no-audit --no-fund 2>&1 | tail -1; node -p "'typescript '+require('typescript/package.json').version"; echo; run npm test; } > "$OUT/15-bosh-loyiha-typescript5.txt" 2>&1
cd "$R/nest" && run npx jest --verbose > "$OUT/16-verbose.txt"
# ---------- 17–20 (01.11) MD «KOD 5» ----------
# 17 o'rnatilmagan repo (clone, npm install qilinmagan) → npm test
cd "$R" && git clone -q "$REPO" yangi && cd yangi && run npm test > "$OUT/17-ornatilmagan.txt"
# 18 noto'g'ri import va sintaksis xatosi (Nest repo)
cd "$R/nest"
sed -i "s#from './order'#from './orders'#" src/order.spec.ts; run npm test > "$OUT/18-import-xato.txt"; sed -i "s#from './orders'#from './order'#" src/order.spec.ts
sed -i "s#expect(orderTotal(10000, 2)).toBe(20000);#expect(orderTotal(10000, 2).toBe(20000);#" src/order.spec.ts; run npm test > "$OUT/19-sintaksis-xato.txt"; sed -i "s#expect(orderTotal(10000, 2).toBe(20000);#expect(orderTotal(10000, 2)).toBe(20000);#" src/order.spec.ts
# 20 bo'sh loyiha: TypeScript 7 holatida npm ci (lock'dagi versiya) va .js nomli test
mkdir -p "$R/bosh2" && cd "$R/bosh2" && npm init -y >/dev/null && cp "$R/nest/src/order.ts" "$R/nest/src/order.spec.ts" .
npm i -D jest ts-jest typescript @types/jest --no-audit --no-fund >/dev/null 2>&1; npx ts-jest config:init >/dev/null 2>&1
node -e 'const f="package.json",p=require("./"+f);p.scripts.test="jest";require("fs").writeFileSync(f,JSON.stringify(p,null,2))'
{ node -p "'typescript '+require('typescript/package.json').version"; echo '$ npm ci'; npm ci --no-audit --no-fund 2>&1 | tail -1; node -p "'typescript '+require('typescript/package.json').version"; echo; run npm test
  echo '--- test faylini .js qilish (ichida TypeScript turlari qoldi)'; mv order.spec.ts order.spec.js; run npm test; } > "$OUT/20-bosh2-npm-ci-va-js.txt" 2>&1
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
