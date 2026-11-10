// ============================================================
//  13 · TypeScript: test yuradi, VS Code qizil (jest2-out/02, 03, 05)
// ============================================================
const TS_SPEC = ts(String.raw`
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
});`, { 8: { id: 'x' }, 11: { id: 'x' } });
const TS_SPEC_WAVY = TS_SPEC.map((l, i) => (i === 7 || i === 10 ? wavy(l) : l));
const TS_RUN = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✕ matn kelsa (2 ms)
    ✓ null kelsa

  ● orderTotal › matn kelsa

    Expected: 0
    Received: NaN

Tests:       1 failed, 2 passed, 3 total`, { 5: { id: 'x' }, 6: { id: 'x' }, 11: { id: 'x' } });
const TSC_OUT = jt(String.raw`
$ npx tsc --noEmit -p tsconfig.json
src/order.spec.ts(8,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/order.spec.ts(11,30): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.`);
const ASANY = ts(String.raw`
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow("quantity musbat raqam bo'lsin");
  });`, { 2: { id: 'x' } });
ASANY.forEach((l, i) => { l.n = 16 + i; });
const S13 = mkS(13, [{ v: 'code' }, { v: 'run' }, { v: 'tsc', wavy: true }, { v: 'any', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div className={seg.v === 'any' ? '' : 'pg-two'} style={seg.v === 'any' ? { display: 'grid', gap: 10 } : undefined}>
    {seg.v !== 'any' && <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={seg.wavy ? TS_SPEC_WAVY : TS_SPEC} focus={['x']} /></Ide>
      {seg.wavy && <div className="mk-tag" style={{ margin: 0 }}>Qizil to'lqin chiziq — VS Code ko'rinishi maketi; xabar matni — haqiqiy tsc chiqishi</div>}
    </div>}
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'code' && <div className="mk-card"><h5>Funksiya son kutadi</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}><code>orderTotal(price: number, quantity: number)</code> — testda esa <code>'ikki'</code> va <code>null</code>.</div></div>}
      {seg.v === 'run' && <Term er lines={TS_RUN} focus={['x']} />}
      {seg.v === 'run' && <div className="mk-tag" style={{ margin: 0 }}>tsconfig.json: "isolatedModules": true — ts-jest turlarni tekshirmaydi</div>}
      {seg.v === 'tsc' && <Term er title="terminal — tsc (VS Code ko'radigani)" lines={TSC_OUT} />}
      {seg.v === 'any' && <><CodePanel file={F.ordSpec} wrap lines={ASANY} focus={['x']} /><Term lines={PASS5.slice(7, 8)} /><div className="mk-rule">Noto'g'ri turni <b>ataylab</b> sinashda — <code>'ikki' as any</code>: qizil chiziq yo'qoladi, guard bilan test yashil.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  14 · Ikki fayl — test nomlari ko'rinmaydi (jest2-out/11, 15)
// ============================================================
const TWO_OUT = jt(String.raw`
$ npm test
PASS src/order.spec.ts
PASS src/coupon.spec.ts

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total`, { 2: { id: 'f' }, 3: { id: 'f' }, 6: { id: 't' } });
const VERB_OUT = jt(String.raw`
$ npx jest --verbose
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma (1 ms)
    ✓ 0 dona — xato (5 ms)
    ✓ manfiy — xato
    ✓ matn — xato (1 ms)

PASS src/coupon.spec.ts
  applyCoupon
    ✓ 100 000 dan 10 % — 90 000
    ✓ chegara 0 % — o'zgarmaydi
    ✓ chegara 100 % — 0
    ✓ 101 % — xato (2 ms)
    ✓ -1 % — xato (1 ms)
    ✓ total matn — xato

Tests:       11 passed, 11 total`, { 1: { id: 'c' }, 19: { id: 't' } });
const S14 = mkS(14, [{ v: 'two', f: ['f'] }, { v: 'verb', f: ['c', 't'] }, { v: 'verb', f: [], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {!seg.sum && <Term lines={TWO_OUT} focus={seg.v === 'two' ? seg.f : ['t']} />}
      {seg.v === 'two' && <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>O'quvchi</h5><div style={{ fontSize: 14.5 }}>«Testlarim qayoqqa ketdi?»</div></div>}
      {seg.sum && <div className="mk-rule">Nom ko'rinmasa — <b>xato emas</b>: avval jami son, keyin <code>--verbose</code>. FAIL'da qizil test nomi baribir chiqadi.</div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'verb' && <Term lines={VERB_OUT} focus={seg.f} />}
    </div>
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — did not throw
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={FAIL_EDGE.slice(7, 12)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Uch xabar — uch sabab (haqiqiy)</div>
      <div className="pg-three">
        <div className="mk-box hl" style={{ '--c': T.accent }}><h4>did not throw</h4><p>xato tashlanmadi — guard yo'q yoki shart teshik</p></div>
        <div className="mk-box" style={{ '--c': T.yellow }}><h4>Received message</h4><p>xato bor, lekin boshqa xabar</p></div>
        <div className="mk-box" style={{ '--c': T.blue }}><h4>funksiya xabari + at orderTotal</h4><p>() =&gt; yozilmagan</p></div>
      </div>
      <CodePanel file={F.ord} lines={ORDER_GUARD} focus={['if']} />
    </div>} />;
}

// ============================================================
//  16 · Amaliyot 3 — 'ikki' va as any (jest2-out/02, 03, 05, 14)
// ============================================================
const P3 = mkS(16, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Guardni olish — order.ts: if (…) { throw … } satrlarini izohga oling", cmds: [], exp: 'return price * quantity qoldi' },
  { t: "as any'siz — matn testi: expect(orderTotal(10000, 'ikki')).toBe(0);", cmds: ['npm test'], exp: "VS Code: qizil chiziq · terminal: Received: NaN" },
  { t: "as any — 'ikki' as any", cmds: [], exp: "qizil chiziq yo'q" },
  { t: 'Tiklash — guard va toThrow testi', cmds: ['npm test'], exp: '5 passed' },
];
const P3_TROUBLE = [
  ['2-qadamda Received: 0', 'null testini sinadingiz — matn testini oling'],
  ['2-qadamda Test suite failed to run · TS2345', "tsconfig.json da isolatedModules: false — ts-jest turlarni tekshiradi (o'quvchi reposida true); as any yozing"],
];
const P3_PROOF = { label: '2-qadamdagi Received qiymati', placeholder: 'Received yonidagini yozing', check: (v) => /^\s*NaN\s*$/i.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 ni so'zga ko'paytirsak, son chiqadimi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  17 · applyCoupon: chegaraning ikki tomoni (jest2-out/11, 12)
// ============================================================
const CUP_SRC = (op) => String.raw`
export function applyCoupon(total: number, percent: number): number {
  if (typeof total !== 'number' || Number.isNaN(total)) {
    throw new Error('total son bo\'lsin');
  }
  if (percent < 0 || percent ${op} 100) {
    throw new Error("percent 0 dan 100 gacha bo'lsin");
  }
  return total - (total * percent) / 100;
}`;
const CUP_TS = ts(CUP_SRC('>'), { 2: { id: 'g1' }, 3: { id: 'g1' }, 5: { id: 'g2' }, 6: { id: 'g2' }, 8: { id: 'r' } });
const CUP_BAD = ts(CUP_SRC('>='), { 5: { id: 'x' } });
const CUP_SPEC = ts(String.raw`
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
});`, { 7: { id: 'in' }, 8: { id: 'in' }, 10: { id: 'in' }, 11: { id: 'in' }, 13: { id: 'out' }, 14: { id: 'out' }, 16: { id: 'out' }, 17: { id: 'out' } });
const CUP_FAIL = jt(String.raw`
$ npm test
PASS src/order.spec.ts
FAIL src/coupon.spec.ts
  ● applyCoupon › chegara 100 % — 0

    percent 0 dan 100 gacha bo'lsin

    > 6 |     throw new Error("percent 0 dan 100 gacha bo'lsin");
        |           ^

      at applyCoupon (coupon.ts:6:11)
      at Object.<anonymous> (coupon.spec.ts:11:23)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 10 passed, 11 total`, { 4: { id: 'x' }, 6: { id: 'x' }, 15: { id: 'x' } });
const LINE17 = [['0 %', 'ishlaydi', 'in'], ['100 %', 'ishlaydi', 'in'], ['−1 %', 'xato', 'out'], ['101 %', 'xato', 'out']];
const S17 = mkS(17, [{ v: 'code', file: F.cup }, { v: 'pass', file: F.cupSpec }, { v: 'fail', file: F.cup }, { v: 'line', file: F.cupSpec, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={CUP_FILES} active={seg.file} fresh={[F.cup, F.cupSpec]}>
      {seg.file === F.cup
        ? <CodePanel file={F.cup} wrap lines={seg.v === 'fail' ? CUP_BAD : CUP_TS} focus={seg.v === 'fail' ? ['x'] : ['g1', 'g2']} />
        : <CodePanel file={F.cupSpec} wrap lines={CUP_SPEC} />}
    </Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'pass' && <Term lines={TWO_OUT} focus={['t']} />}
      {seg.v === 'fail' && <Term er lines={CUP_FAIL} focus={['x']} />}
      {seg.v === 'line' && <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">Chegaraning ikki tomoni</div>
        <div className="j2-line">{LINE17.map(([v, d, k]) => <div key={v} className={k}>{v}<small>{d}</small></div>)}</div>
      </div>}
      {seg.sum && <div className="mk-rule">O'quvchi vazifasida shu <b>to'rt qiymat</b> bormi — 0, 100, −1, 101.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  18 · Tekshiruv 4 — >= 100
// ============================================================
function Screen18(p) {
  const m = MDT[18];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file={F.cup} wrap lines={CUP_BAD} focus={['x']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={CUP_FAIL} focus={['x']} />
    </div>} />;
}

// ============================================================
//  19 · Amaliyot 4 — applyCoupon
// ============================================================
const P4 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: "Funksiya — src/coupon.ts (namuna — o'zingiz yozing)", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Testlar — src/coupon.spec.ts, 6 ta it', cmds: ['npm test'], exp: 'PASS src/coupon.spec.ts' },
  { t: 'Buzish — percent > 100 → percent >= 100', cmds: ['npm test'], exp: '1 failed' },
  { t: "O'qish va tiklash — ● satr, > ni qaytaring", cmds: ['npm test'], exp: 'hammasi yashil' },
];
const P4_CODE = [{ file: F.cup, step: 0, lines: CUP_TS, copy: false }, { file: F.cupSpec, step: 1, lines: CUP_SPEC, copy: false }];
const P4_TROUBLE = [
  ['3-qadamda hammasi yashil', "100 % testi yo'q — chegaraning ichki tomonini qo'shing"],
  ["90000 kutilgan joyda boshqa son", 'formula: total - (total * percent) / 100'],
  ["'ikki' qatorida qizil chiziq", "'ikki' as any (13-ekran)"],
];
const P4_PROOF = { label: 'Qizil testning nomi (● satridan)', placeholder: '● satrdagi test nomini yozing', check: (v) => /100\s?%/.test(v), wrong: "● satridagi › belgisidan keyingi nomni yozing — u qaysi foizni sinaydi?" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} code={P4_CODE} tree={CUP_FILES} />; }
