#!/usr/bin/env bash
# Jest-2 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/jest2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest2.sh
# O'quvchi reposi GitHub'dan yangi papkaga; har `npm test` TOZA muhitda (Jest 30 agent muhitida ixcham chiqaradi — jest1-out/README).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest2-out"
R="${S:?S=scratchpad kerak}/jest2-run"
REPO=https://github.com/Azizbekcrypto/IntroNestArxitechture.git
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
nd(){ "${CLEAN[@]}" npx ts-node -T -e "$1" 2>&1; }
cd "$R" && git clone -q "$REPO" nest && cd nest && npm install --no-audit --no-fund >/dev/null 2>&1
{ node --version; for p in jest ts-jest typescript; do echo "$p $(node -p "require('$p/package.json').version")"; done; date; } > "$OUT/00-versiyalar.txt"

# 01 himoyasiz funksiya: happy + g'alati kirishlar natijasi (node bilan — test emas, «mashina nima qaytaradi»)
cat > src/order.ts <<'TS'
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}
TS
{ echo "--- himoyasiz orderTotal (price * quantity), JavaScript'da chaqirilganda:"
  node -e 'const f=(p,q)=>p*q; for (const [a,b,l] of [[10000,2,"2"],[10000,0,"0"],[10000,-1,"-1"],[10000,1,"1"],[10000,"ikki","\x27ikki\x27"],[10000,null,"null"]]) console.log(`orderTotal(10000, ${l}) → ${f(a,b)}`)'; } > "$OUT/01-himoyasiz-natijalar.txt"
# 02 TypeScript testida 'ikki' va null — ts-jest turlarni tekshiradimi? (tsconfig: isolatedModules true, strictNullChecks true)
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('matn kelsa', () => {
    expect(orderTotal(10000, 'ikki')).toBe(0);
  });
  it('null kelsa', () => {
    expect(orderTotal(10000, null)).toBe(0);
  });
});
TS
run npm test > "$OUT/02-ts-matn-null.txt"
# 03 tsc (VS Code ko'radigan) — xuddi shu fayl turlar bo'yicha
{ echo '$ npx tsc --noEmit -p tsconfig.json'; "${CLEAN[@]}" npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "order.spec" | head -6; echo "[chiqish kodi: ${PIPESTATUS[0]}]"; } > "$OUT/03-tsc-turlar.txt"
# 04 himoyasiz funksiya — edge testlari (o'quvchi kutgan: xato berishi kerak) → nima bo'ladi
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });
  it('manfiy — xato', () => {
    expect(() => orderTotal(10000, -1)).toThrow();
  });
});
TS
run npm test > "$OUT/04-himoyasiz-edge-fail.txt"
# 05 guard qo'shildi → edge testlari PASS
cat > src/order.ts <<'TS'
export function orderTotal(price: number, quantity: number): number {
  if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) {
    throw new Error("quantity musbat raqam bo'lsin");
  }
  return price * quantity;
}
TS
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('1 dona — eng kichik haqiqiy buyurtma', () => {
    expect(orderTotal(10000, 1)).toBe(10000);
  });
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });
  it('manfiy — xato', () => {
    expect(() => orderTotal(10000, -1)).toThrow();
  });
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow("quantity musbat raqam bo'lsin");
  });
});
TS
run npm test > "$OUT/05-guard-pass.txt"
# 06 () => siz: expect(orderTotal(10000, 0)).toThrow()
sed -i "s#expect(() => orderTotal(10000, 0)).toThrow();#expect(orderTotal(10000, 0)).toThrow();#" src/order.spec.ts
run npm test > "$OUT/06-orovsiz-tothrow.txt"
sed -i "s#expect(orderTotal(10000, 0)).toThrow();#expect(() => orderTotal(10000, 0)).toThrow();#" src/order.spec.ts
# 07 toThrow xabari mos emas
sed -i "s#toThrow(\"quantity musbat raqam bo'lsin\")#toThrow('narx xato')#" src/order.spec.ts
run npm test > "$OUT/07-tothrow-xabar-mos-emas.txt"
sed -i "s#toThrow('narx xato')#toThrow(\"quantity musbat raqam bo'lsin\")#" src/order.spec.ts
# 08 guard shartsiz (if yo'q) — hamma chaqiriq xato
cp src/order.ts "$R/order.ts.bak"
cat > src/order.ts <<'TS'
export function orderTotal(price: number, quantity: number): number {
  throw new Error("quantity musbat raqam bo'lsin");
  return price * quantity;
}
TS
run npm test > "$OUT/08-shartsiz-throw.txt"
cp "$R/order.ts.bak" src/order.ts
# 09 chegara xatosi: quantity <= 0 o'rniga quantity < 0 → 0 o'tib ketadi
sed -i 's/quantity <= 0/quantity < 0/' src/order.ts
run npm test > "$OUT/09-chegara-0.txt"
sed -i 's/quantity < 0/quantity <= 0/' src/order.ts
# 10 NaN: guard'siz natija va toBe(NaN)
{ echo "--- himoyasiz funksiya: orderTotal(10000, 'ikki' as any)"; nd "const f=(p:number,q:number)=>p*q; console.log(f(10000,'ikki' as any))"; } > "$OUT/10-nan.txt"
# 11 uyga vazifa: applyCoupon
cat > src/coupon.ts <<'TS'
export function applyCoupon(total: number, percent: number): number {
  if (typeof total !== 'number' || Number.isNaN(total)) {
    throw new Error('total son bo\'lsin');
  }
  if (percent < 0 || percent > 100) {
    throw new Error("percent 0 dan 100 gacha bo'lsin");
  }
  return total - (total * percent) / 100;
}
TS
cat > src/coupon.spec.ts <<'TS'
import { applyCoupon } from './coupon';

describe('applyCoupon', () => {
  it('100 000 dan 10 % — 90 000', () => {
    expect(applyCoupon(100000, 10)).toBe(90000);
  });
  it('chegara 0 % — o\'zgarmaydi', () => {
    expect(applyCoupon(100000, 0)).toBe(100000);
  });
  it('chegara 100 % — 0', () => {
    expect(applyCoupon(100000, 100)).toBe(0);
  });
  it('101 % — xato', () => {
    expect(() => applyCoupon(100000, 101)).toThrow();
  });
  it('-1 % — xato', () => {
    expect(() => applyCoupon(100000, -1)).toThrow();
  });
  it("total matn — xato", () => {
    expect(() => applyCoupon('ikki' as any, 10)).toThrow();
  });
});
TS
run npm test > "$OUT/11-uyga-vazifa-coupon.txt"
# 12 uyga vazifa chegara xatosi: percent > 100 o'rniga percent >= 100 → 100 % xato bo'lib qoladi
sed -i 's/percent > 100/percent >= 100/' src/coupon.ts
run npm test > "$OUT/12-coupon-chegara-xato.txt"
sed -i 's/percent >= 100/percent > 100/' src/coupon.ts

# ---------- 13–14 (01.11) MD «KOD 5» ----------
# 13 guard juda qattiq: quantity <= 1 → «1 dona» testi qizil
sed -i 's/quantity <= 0/quantity <= 1/' src/order.ts; run npm test > "$OUT/13-guard-juda-qattiq.txt"; sed -i 's/quantity <= 1/quantity <= 0/' src/order.ts
# 14 isolatedModules: false bo'lsa — ts-jest turlarni tekshiradi: 'ikki' (as any'siz) testi
cp tsconfig.json "$R/tsconfig.bak"; sed -i 's/"isolatedModules": true/"isolatedModules": false/' tsconfig.json
sed -i "s/orderTotal(10000, 'ikki' as any)/orderTotal(10000, 'ikki')/" src/order.spec.ts
run npm test > "$OUT/14-isolated-false-ts2345.txt"
cp "$R/tsconfig.bak" tsconfig.json; sed -i "s/orderTotal(10000, 'ikki')/orderTotal(10000, 'ikki' as any)/" src/order.spec.ts
# 15 (01.11) ikki fayl — nomlar --verbose bilan (14-ekran)
run npx jest --verbose > "$OUT/15-verbose-ikki-fayl.txt"
# 16 (01.11) Jest-1 dagi boshqa test fayllari bo'lsa — faqat order testlari: npm test -- order (7-ekran «Boshqacha chiqdimi?»)
run npm test -- order > "$OUT/16-faqat-order.txt"
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
