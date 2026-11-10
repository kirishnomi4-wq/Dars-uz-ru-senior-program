#!/usr/bin/env bash
# Jest-1 v2 mentor darsi — haqiqiy chiqishlar OrderBotNest ustida (F-1104-01, 04.11). Natija: manba/jest1v2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest1v2.sh
# Lokal /home/kali/Desktop/order-bot dan `tgpg-done` YANGI papkaga clone qilinadi ($S/jest1v2-run); asl repoga tegilmaydi.
# node_modules — asl repodan symlink (npm install qilinmaydi).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest1v2-out"
SRC=/home/kali/Desktop/order-bot
R="${S:?S=scratchpad kerak}/jest1v2-run"
mkdir -p "$OUT"; rm -rf "$R"
git clone -q --branch tgpg-done "$SRC" "$R" 2>/dev/null; ln -s "$SRC/node_modules" "$R/node_modules"
cd "$R"
# Jest 30 agent muhitini sezadi (CLAUDECODE …) va ixcham chiqaradi — har buyruq TOZA muhitda (jest1-out/README.md)
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
{ node --version; npm --version; date; git log -1 --format='HEAD %h %s' | cut -c1-60
  for p in jest ts-jest typescript telegraf; do echo "$p $(node -p "require('./node_modules/$p/package.json').version")"; done; } > "$OUT/00-versiyalar.txt"
T=src/api/telegram

# 01 — repoda birorta .spec.ts yo'q; jest sozlamasi package.json da tayyor
{ node -e 'const p=require("./package.json");console.log(JSON.stringify({test:p.scripts.test,jest:p.jest},null,2))'; echo
  run npm test; } > "$OUT/01-test-yoq.txt"

# 02 — birinchi test: som() → FAIL, ikki qator bir xil ko'rinadi
cat > $T/texts.spec.ts <<'TS'
import { som } from './texts';

describe('som', () => {
  it("120000 ni so'mda yozadi", () => {
    expect(som(120000)).toBe("120 000 so'm");
  });
});
TS
npx prettier --write $T/texts.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/texts.spec.ts "$OUT/kod-02-texts.spec.ts"
run npx jest texts > "$OUT/02-som-fail-probel.txt"

# 03 — sababini ko'ramiz: belgilar kodi
{ echo '$ node -e "…JSON.stringify(som) + belgilar kodi"'
  "${CLEAN[@]}" node -e "const s=(120000).toLocaleString('ru-RU')+\" so'm\";console.log(JSON.stringify(s));console.log([...s].map(c=>c.charCodeAt(0).toString(16).padStart(4,'0')).join(' '))"
  echo "[chiqish kodi: $?]"; } > "$OUT/03-belgi-kodi.txt"

# 04 — tuzatilgan etalon: \u00a0 → PASS
cat > $T/texts.spec.ts <<'TS'
import { som } from './texts';

describe('som', () => {
  it("120000 ni so'mda yozadi", () => {
    // toLocaleString('ru-RU') minglarni bo'linmas probel (U+00A0) bilan ajratadi
    expect(som(120000)).toBe("120\u00a0000 so'm");
  });

  it('kichik sonda probel yo\'q', () => {
    expect(som(500)).toBe("500 so'm");
  });
});
TS
npx prettier --write $T/texts.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/texts.spec.ts "$OUT/kod-04-texts.spec.ts"
run npx jest texts > "$OUT/04-som-pass.txt"

# 05 — yolg'on test 1: expect yo'q
cat > $T/yolgon.spec.ts <<'TS'
import { som } from './texts';

describe('som', () => {
  it("120000 ni so'mda yozadi", () => {
    console.log(som(120000));
  });
});
TS
npx prettier --write $T/yolgon.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/yolgon.spec.ts "$OUT/kod-05-yolgon.spec.ts"
run npx jest yolgon > "$OUT/05-expect-yoq.txt"

# 06 — yolg'on test 2: etalon koddan olingan (AI tajribasidagi naqsh, jest1v2-ai/ai2). Avval buzilmagan kodda — ikkalasi PASS
cat > $T/savat.spec.ts <<'TS'
import { CartItem } from '../../core/entity';
import { som, texts } from './texts';

const items = [
  { product: { name: 'Kolonka', price: 50000 }, qty: 2 },
] as CartItem[];

describe('texts.cart', () => {
  it('etalon koddan', () => {
    const t = texts.cart(items, 100000);
    expect(t).toContain(`Jami: ${som(100000)}`);
  });

  it("etalon qo'lda", () => {
    const t = texts.cart(items, 100000);
    expect(t).toContain("Jami: 100\u00a0000 so'm");
  });
});
TS
npx prettier --write $T/savat.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/savat.spec.ts "$OUT/kod-06-savat.spec.ts"
run npx jest savat --verbose > "$OUT/06a-etalon-ikkalasi-pass.txt"
# som() buzildi: ru-RU → en-US («100,000») — koddan olingan etalon ham buziladi, test yashil qoladi
sed -i "s/toLocaleString('ru-RU')/toLocaleString('en-US')/" $T/texts.ts
{ echo '# som() buzildi: ru-RU → en-US'; grep -n "export const som" $T/texts.ts; echo
  run npx jest savat --verbose; } > "$OUT/06-etalon-nusxa.txt"
git checkout -q -- $T/texts.ts
cp $T/savat.spec.ts "$OUT/savat.spec.ts"; rm -f $T/savat.spec.ts $T/yolgon.spec.ts

# 06b — toBe massivda: bir xil ko'rinadi, lekin FAIL (Object.is — havola); toEqual — PASS
cat > $T/tobe.spec.ts <<'TS'
describe('toBe va toEqual', () => {
  it('toBe', () => {
    expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);
  });

  it('toEqual', () => {
    expect([['◀', '2/3', '▶']]).toEqual([['◀', '2/3', '▶']]);
  });
});
TS
npx prettier --write $T/tobe.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/tobe.spec.ts "$OUT/kod-06b-tobe.spec.ts"
run npx jest tobe --verbose > "$OUT/06b-tobe-toequal.txt"; rm -f $T/tobe.spec.ts

# 07 — orderKeyboard: har status uchun tugmalar
cat > $T/keyboards.spec.ts <<'TS'
import { Order } from '../../core/entity';
import { catalogKeyboard, orderKeyboard } from './keyboards';

// Faqat tugmalar matni va callback'i — qolgani bizga kerak emas
const buttons = (kb: ReturnType<typeof orderKeyboard>) =>
  kb?.reply_markup.inline_keyboard.map((row) =>
    row.map((b) => [b.text, 'callback_data' in b ? b.callback_data : '']),
  );

const order = (status: Order['status']) => ({ id: 7, status }) as Order;

describe('orderKeyboard', () => {
  it('yangi buyurtma — Tasdiqlash va Bekor', () => {
    expect(buttons(orderKeyboard(order('NEW')))).toEqual([
      [
        ['✅ Tasdiqlash', 'status:7:CONFIRMED'],
        ['❌ Bekor', 'status:7:CANCELLED'],
      ],
    ]);
  });

  it('tasdiqlangan — Yetkazildi va Bekor', () => {
    expect(buttons(orderKeyboard(order('CONFIRMED')))).toEqual([
      [
        ['🚚 Yetkazildi', 'status:7:DELIVERED'],
        ['❌ Bekor', 'status:7:CANCELLED'],
      ],
    ]);
  });

  it('yetkazilgan va bekor qilingan — tugma yo\'q', () => {
    expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();
    expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();
  });
});
TS
npx prettier --write $T/keyboards.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/keyboards.spec.ts "$OUT/kod-07-keyboards.spec.ts"
run npx jest keyboards --verbose > "$OUT/07-orderKeyboard-pass.txt"

# 08 — kodni buzamiz: CANCELLED shartdan tushib qoldi → FAIL o'qish
sed -i "s/  if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return undefined;/  if (o.status === 'DELIVERED') return undefined;/" $T/keyboards.ts
{ grep -n "return undefined" $T/keyboards.ts; echo; run npx jest keyboards; } > "$OUT/08-orderKeyboard-fail.txt"
git checkout -q -- $T/keyboards.ts

# 09 — catalogKeyboard: sahifalash chegarasi
cat >> $T/keyboards.spec.ts <<'TS'

const p = (id: number, stock = 5) =>
  ({ id, name: `M${id}`, price: 1000, stock }) as any;

// Oxirgidan oldingi qator — sahifalash: ◀ · 2/3 · ▶
const nav = (kb: ReturnType<typeof catalogKeyboard>) => {
  const rows = kb.reply_markup.inline_keyboard;
  return rows[rows.length - 2].map((b) => b.text);
};

describe('catalogKeyboard', () => {
  it("birinchi sahifada ◀ yo'q", () => {
    expect(nav(catalogKeyboard([p(1), p(2)], 0, 3))).toEqual(['1/3', '▶']);
  });

  it('o\'rtada ikkalasi bor', () => {
    expect(nav(catalogKeyboard([p(3), p(4)], 1, 3))).toEqual(['◀', '2/3', '▶']);
  });

  it("oxirgi sahifada ▶ yo'q", () => {
    expect(nav(catalogKeyboard([p(5)], 2, 3))).toEqual(['◀', '3/3']);
  });

  it('bitta sahifa — faqat 1/1', () => {
    expect(nav(catalogKeyboard([p(1)], 0, 1))).toEqual(['1/1']);
  });

  it('tugagan mahsulot bosilmaydi', () => {
    const row = catalogKeyboard([p(9, 0)], 0, 1).reply_markup.inline_keyboard[0];
    expect(row[0]).toMatchObject({ text: 'M9 · tugagan', callback_data: 'noop' });
  });
});
TS
npx prettier --write $T/keyboards.spec.ts >/dev/null 2>&1   # M43: repo kodi Prettier formatida
cp $T/keyboards.spec.ts "$OUT/kod-09-keyboards.spec.ts"
run npx jest keyboards --verbose > "$OUT/09-catalogKeyboard-pass.txt"

# 10 — chegara xatosi: page < pages → page <= pages (oxirgi sahifada ham ▶)
sed -i "s/  if (page < pages - 1)/  if (page <= pages - 1)/" $T/keyboards.ts
{ grep -n "if (page <" $T/keyboards.ts; echo; run npx jest keyboards; } > "$OUT/10-chegara-fail.txt"
git checkout -q -- $T/keyboards.ts

# 11 — hammasi: npm test
run npm test -- --verbose > "$OUT/11-hammasi.txt"

# 12 — test Telegram'siz: bot tokeni ham, baza ham yo'q — .env yo'qligini ko'rsatamiz
{ echo '$ ls -a | grep env'; ls -a | grep -i env || echo "(.env yo'q)"; echo; echo '$ npm test 2>&1 | tail -5'; "${CLEAN[@]}" npm test 2>&1 | tail -5; } > "$OUT/12-env-siz.txt"

# 13 — fayl nomi .test.ts → topilmaydi
git mv -f $T/texts.spec.ts $T/texts.test.ts 2>/dev/null || mv $T/texts.spec.ts $T/texts.test.ts
mv $T/keyboards.spec.ts "$R/.kb.spec.bak" ; run npm test > "$OUT/13-test-ts-nomi.txt"; mv "$R/.kb.spec.bak" $T/keyboards.spec.ts; mv $T/texts.test.ts $T/texts.spec.ts

# 14 — test fayli src dan tashqarida (rootDir: src)
mkdir -p test && mv $T/texts.spec.ts test/ && mv $T/keyboards.spec.ts "$R/.kb.spec.bak"
run npm test > "$OUT/14-src-dan-tashqari.txt"
mv test/texts.spec.ts $T/ && mv "$R/.kb.spec.bak" $T/keyboards.spec.ts && rmdir test

# Tayyor test fayllari (jest1-done uchun manba)
cp $T/texts.spec.ts "$OUT/texts.spec.ts"; cp $T/keyboards.spec.ts "$OUT/keyboards.spec.ts"
echo "tayyor: $OUT"
