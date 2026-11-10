#!/usr/bin/env bash
# Jest-1 v2 — KOD 2–4 (F-1104-01, GATE M dan keyin): qurishdan oldingi qo'shimcha haqiqiy chiqishlar → manba/jest1v2-out/2N-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest1v2-kod.sh
# DIQQAT: bo'linmas probel escape'i fayl ichida NBSPESC belgisi bilan yozilgan va ishga tushganda almashtiriladi
# (Write vositasi escape'ni haqiqiy belgiga aylantiradi — memory tekshiruv-vositalari-tuzoqlari, 04.11).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest1v2-out"
AI="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest1v2-ai"
SRC=/home/kali/Desktop/order-bot
R="${S:?S=scratchpad kerak}/jest1v2-kod"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
esc(){ python3 -c "import sys;p=sys.argv[1];t=open(p).read();open(p,'w').write(t.replace('NBSPESC',chr(92)+'u00a0'))" "$1"; }
rm -rf "$R"; mkdir -p "$R"
T=src/api/telegram

# ---------- KOD 2a: git — teg yo'q · o'z o'zgarishlar ustidan checkout ----------
git -c advice.detachedHead=false clone -q "$SRC" "$R/g" 2>/dev/null; cd "$R/g"
git tag -d jest1-start >/dev/null 2>&1   # teg hali mentor nusxasida yo'q holat
{ run git checkout jest1-start
  git checkout -q tgpg-start 2>/dev/null
  echo "// mentor o'zgarishi" >> src/api/order/order.service.ts
  echo '$ git status --short'; git status --short; echo
  run git checkout tgpg-done; } > "$OUT/20-git-checkout-xatolar.txt"

# ---------- KOD 2b: import xatosi va TS xatosi ----------
git -c advice.detachedHead=false clone -q --branch tgpg-done "$SRC" "$R/t" 2>/dev/null; ln -s "$SRC/node_modules" "$R/t/node_modules"; cd "$R/t"
cat > src/api/texts.spec.ts <<'TS'
import { som } from './texts';

describe('som', () => {
  it("120000 ni so'mda yozadi", () => {
    expect(som(120000)).toBe("120NBSPESC000 so'm");
  });
});
TS
npx prettier --write src/api/texts.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
esc src/api/texts.spec.ts
{ echo '# texts.spec.ts boshqa papkada: src/api/ (texts.ts esa src/api/telegram/ da)'; run npx jest texts; } > "$OUT/21-import-xato.txt"
rm src/api/texts.spec.ts
cat > $T/kb.spec.ts <<'TS'
import { Order } from '../../core/entity';
import { orderKeyboard } from './keyboards';

describe('orderKeyboard', () => {
  it('yangi buyurtma', () => {
    const kb = orderKeyboard({ id: 7, status: 'NEW' } as Order);
    const data = kb?.reply_markup.inline_keyboard[0].map((b) => b.callback_data);
    expect(data).toEqual(['status:7:CONFIRMED', 'status:7:CANCELLED']);
  });
});
TS
npx prettier --write $T/kb.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
{ echo "# yordamchisiz: b.callback_data to'g'ridan-to'g'ri"; run npx jest kb; } > "$OUT/22-ts-callback-data.txt"
rm $T/kb.spec.ts

# ---------- KOD 3: 11-ekran LineCheck — orderPlaced, etalon koddan ----------
cat > $T/texts.spec.ts <<'TS'
import { Order } from '../../core/entity';
import { som, texts } from './texts';

const order = {
  id: 42,
  phone: '+998901234567',
  total: 50000,
  status: 'NEW',
  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],
} as unknown as Order;

describe('texts.orderPlaced', () => {
  it('buyurtma qatori va jami', () => {
    const t = texts.orderPlaced(order);
    expect(t).toContain('Buyurtma #42 qabul qilindi!');
    expect(t).toContain(`Jami: ${som(50000)}`);
    expect(t).toContain('Telefon: +998901234567');
  });
});
TS
npx prettier --write $T/texts.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
{ echo '# LineCheck fayli (satr raqamlari):'; cat -n $T/texts.spec.ts; echo
  run npx jest texts
  sed -i "s/toLocaleString('ru-RU')/toLocaleString('en-US')/" $T/texts.ts
  echo "# som() buzildi: ru-RU → en-US"; run npx jest texts
  git checkout -q -- $T/texts.ts; } > "$OUT/23-linecheck-buzuq.txt"
sed -i "s/    expect(t).toContain(\`Jami: \${som(50000)}\`);/    expect(t).toContain(\"Jami: 50NBSPESC000 so'm\");/" $T/texts.spec.ts; esc $T/texts.spec.ts
sed -i "s/^import { som, texts } from '.\/texts';/import { texts } from '.\/texts';/" $T/texts.spec.ts
{ echo '# Tuzatilgan (satr raqamlari):'; cat -n $T/texts.spec.ts; echo
  run npx jest texts
  sed -i "s/toLocaleString('ru-RU')/toLocaleString('en-US')/" $T/texts.ts
  echo "# som() buzildi: ru-RU → en-US"; run npx jest texts
  git checkout -q -- $T/texts.ts; } > "$OUT/24-linecheck-tuzatilgan.txt"
cp $T/texts.spec.ts "$OUT/orderplaced.spec.ts"; rm $T/texts.spec.ts

# ---------- KOD 4: 20-ekran — CANCELLED matni «🆕 Yangi», Opus va Haiku to'plamlari ----------
{ for n in ai1 ai2; do
    d="$R/m-$n"; git -c advice.detachedHead=false clone -q --branch tgpg-done "$SRC" "$d" 2>/dev/null; ln -s "$SRC/node_modules" "$d/node_modules"
    cp "$AI/$n/"*.spec.ts "$d/$T/"; cd "$d"
    echo "## $n buzilmagan: $("${CLEAN[@]}" npx jest --silent 2>&1 | grep -E '^Tests:')"
    sed -i "s/CANCELLED: '❌ Bekor qilingan',/CANCELLED: '🆕 Yangi',/" $T/texts.ts; grep -n "CANCELLED:" $T/texts.ts
    echo "## $n CANCELLED → «🆕 Yangi»: $("${CLEAN[@]}" npx jest --silent 2>&1 | grep -E '^Tests:')"
    "${CLEAN[@]}" npx jest 2>&1 | grep -E '✕|●' | head -6; echo
  done; } > "$OUT/25-b5-cancelled.txt"
echo "tayyor: $OUT/20…25"
