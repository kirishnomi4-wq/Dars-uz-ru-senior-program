// ============================================================
//  Umumiy kod va chiqishlar (jest2-out — toza muhit)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const GUARD_SRC = (cond) => String.raw`
export function orderTotal(price: number, quantity: number): number {
  if (typeof quantity !== 'number' || Number.isNaN(quantity) || ${cond}) {
    throw new Error("quantity musbat raqam bo'lsin");
  }
  return price * quantity;
}`;
const ORDER_GUARD = ts(GUARD_SRC('quantity <= 0'), { 2: { id: 'if' }, 3: { id: 'th' }, 4: { id: 'if' }, 5: { id: 'ret' } });
// Edge testlari — himoyasiz funksiyaga (jest2-out/04)
const SPEC_EDGE = ts(String.raw`
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
});`, { 7: { id: 'e' }, 8: { id: 'e' }, 9: { id: 'e' }, 10: { id: 'e' }, 11: { id: 'e' }, 12: { id: 'e' } });
// To'liq test fayli — guard bilan (jest2-out/05; satr raqamlari 06, 07, 09 dagi bilan bir xil)
const SPEC_FULL = ts(String.raw`
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
});`, { 7: { id: 'one' }, 8: { id: 'one' }, 11: { id: 'zero' }, 17: { id: 'txt' } });
const PASS5 = jt(String.raw`
$ npm test
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma (1 ms)
    ✓ 0 dona — xato (5 ms)
    ✓ manfiy — xato (1 ms)
    ✓ matn — xato (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total`, { 2: { id: 'p' }, 11: { id: 'tot' } });
const FAIL_EDGE = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✕ 0 dona — xato (1 ms)
    ✕ manfiy — xato (1 ms)

  ● orderTotal › 0 dona — xato

    expect(received).toThrow()

    Received function did not throw

    >  8 |     expect(() => orderTotal(10000, 0)).toThrow();
         |                                        ^

Tests:       2 failed, 1 passed, 3 total`, { 2: { id: 'n' }, 3: { id: 'n' }, 4: { id: 'n' }, 5: { id: 'n' }, 6: { id: 'n' }, 8: { id: 'm' }, 10: { id: 'm' }, 12: { id: 'm' }, 14: { id: 'm' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Edge case va yashirin buzilish', 'Guard', 'Buzamiz: toThrow', "TypeScript tuzog'i", 'Uyga vazifa misoli', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — o'quvchi reposida: noto'g'ri kirish ham sinalgan</div>
    <Term lines={PASS5.slice(1, 8)} />
  </div>} />;
}

// ============================================================
//  2 · Happy path va edge case
// ============================================================
const EDGE2 = [['0', 'nol dona', 'b'], ['-1', 'manfiy', 'b'], ['1', 'eng kichik', 'b'], ["'ikki'", "so'z", 'c'], ['null', "bo'sh", 'c']];
const S2 = mkS(2, [{ on: '' }, { on: 'b' }, { on: 'bc' }, { on: 'bc', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag" style={{ color: T.green }}>Happy path — oddiy yo'l</div>
      <div className="pg-row"><span>orderTotal(10000, 2)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ color: T.green }}>20000</span></div>
    </div>
    {seg.on && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .4s ease both' }}>
      <div className="mk-tag" style={{ color: T.accent }}>Edge case — chegara holati: orderTotal(10000, …)</div>
      <div className="j2-edge">{EDGE2.map(([v, d, g]) => <div key={v} className={seg.on.includes(g) && !seg.sum ? 'on' : ''} style={{ opacity: seg.on.includes(g) ? 1 : 0.25 }}>{v}<small>{d}</small></div>)}</div>
    </div>}
    {seg.sum && <div className="mk-rule">Har funksiya uchun: <b>bitta oddiy holat</b> va <b>bir nechta chegara holati</b>. O'quvchi darsi: «chegara 0 bilan 1 orasida».</div>}
  </div>} />;
}

// ============================================================
//  3 · Yashirin buzilish (jest2-out/01)
// ============================================================
const ROWS3 = [['2', '20000', 0], ['0', '0', 'a'], ['-1', '-10000', 'b'], ['1', '10000', 'b'], ["'ikki'", 'NaN', 'c'], ['null', '0', 'c']];
const S3 = mkS(3, [{ on: 'a' }, { on: 'ab' }, { on: 'abc' }, { on: 'abc', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={tree(REPO_BASE, [F.ord])} active={F.ord}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></Ide>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Himoyasiz funksiya — haqiqiy natijalar</div>
      <div style={{ display: 'grid', gap: 6 }}>{ROWS3.map(([a, r, g]) => {
        const shown = g === 0 || seg.on.includes(g);
        const bad = g !== 0 && a !== '1';
        return <div key={a} className={`pg-row${shown && bad && !seg.sum && seg.on.endsWith(g) ? ' hl' : ''}`} style={{ opacity: shown ? 1 : 0.25 }}>
          <span>orderTotal(10000, {a})</span><span style={{ color: T.ink3 }}>→</span>
          <span className="v" style={{ color: !shown ? T.ink3 : bad ? T.accent : T.green }}>{shown ? r : '?'}</span>
          {shown && <span style={{ fontFamily: SANS, fontSize: 12, color: bad ? T.accent : T.green, minWidth: 92, textAlign: 'right' }}>{bad ? 'xato yo\'q' : "to'g'ri"}</span>}
        </div>;
      })}</div>
    </div>
    {seg.sum && <div className="mk-rule">Himoyasiz funksiya noto'g'ri kirishda <b>xato bermaydi</b>, balki noto'g'ri ishlaydi. To'g'ri yo'l: darhol rad etish.</div>}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — himoyasiz funksiya</div>
      <div className="pg-row hl"><span>orderTotal(10000, -1)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ color: T.accent }}>-10000</span></div>
      <div className="mk-rule">Xato yo'q, natija noto'g'ri — <b>himoya (guard)</b> kerak.</div>
    </div>} />;
}

// ============================================================
//  5 · Edge testlari: did not throw (jest2-out/04)
// ============================================================
const S5 = mkS(5, [{ focus: ['e'] }, { out: true, f: ['n'] }, { out: true, f: ['m'] }, { out: true, f: ['m'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={SPEC_EDGE} focus={seg.out ? [] : seg.focus} /></Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.out && <Term er lines={FAIL_EDGE} focus={seg.f} />}
      {seg.sum && <div className="mk-rule"><b>did not throw</b> — funksiyada himoya yo'q yoki shart bu qiymatni o'tkazib yubordi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  6 · Guard: if → throw → return (jest2-out/05)
// ============================================================
const S6 = mkS(6, [{ focus: ['if', 'th', 'ret'], steps: true }, { focus: ['if'] }, { focus: ['th'] }, { focus: [], out: true }, { focus: [], out: true, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={ORDER_GUARD} focus={seg.focus} /></Ide>
    {seg.steps && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>1 · Shart</h4><p><code>if (…)</code></p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>2 · Xato</h4><p><code>throw new Error(…)</code></p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>3 · Hisob</h4><p><code>return price * quantity</code></p></div>
    </div>}
    {seg.out && <Term lines={PASS5} focus={seg.sum ? ['tot'] : []} />}
    {seg.sum && <div className="mk-rule">Ikki tomon sinaladi: noto'g'ri kirish — <b>xato</b>, eng kichik to'g'ri kirish (1 dona) — <b>hisob</b>.</div>}
  </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — edge testlari va guard
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Edge testlari — order.spec.ts: 0 va -1 uchun expect(() => …).toThrow()", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Qizil', cmds: ['npm test'], exp: 'Received function did not throw (2 ta)' },
  { t: "Guard — order.ts boshiga (namuna — o'zingiz yozing)", cmds: [], exp: 'fayl saqlandi' },
  { t: "Yashil — 1 dona va 'ikki' as any testlari", cmds: ['npm test'], exp: 'Tests: 5 passed, 5 total' },
];
const P1_CODE = [{ file: F.ordSpec, step: 0, lines: SPEC_EDGE, copy: false }, { file: F.ord, step: 2, lines: ORDER_GUARD, copy: false }, { file: F.ordSpec, step: 3, lines: SPEC_FULL, copy: false }];
const P1_TROUBLE = [
  ["Tests: 8 passed yoki boshqa son, nomlar yo'q", "Jest-1 dagi delivery/discount testlari ham yurdi — npm test -- order (faqat order testlari)"],
  ['2-qadamda test xato matni bilan yiqildi', "() => yozilmagan — 8-ekran"],
  ["4-qadamda «1 dona» qizil, quantity musbat raqam bo'lsin", 'shart quantity <= 1 — 1 ham taqiqlangan; quantity <= 0 bo\'lsin'],
  ['«matn — xato» qizil, Received: NaN…', "typeof / Number.isNaN tekshiruvi yo'q — guardning 2-satri"],
];
const P1_PROOF = { label: 'Isbot: natijadagi Tests: satri', placeholder: "natijadagi Tests satrini qo'ying", check: (v) => /Tests:\s+5 passed,\s+5 total/.test(v), wrong: "Satr «Tests:» bilan boshlanadi; beshala test o'tgan bo'lishi kerak. Boshqa son bo'lsa — «Boshqacha chiqdimi?»" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={ORD_FILES} />; }

// ============================================================
//  8 · () => nega kerak (jest2-out/06)
// ============================================================
const WRAP_BAD = ts(String.raw`
  it('0 dona — xato', () => {
    expect(orderTotal(10000, 0)).toThrow();
  });`, { 2: { id: 'x' } });
const WRAP_OK = ts(String.raw`
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });`, { 2: { id: 'x' } });
const UNWRAP_OUT = jt(String.raw`
FAIL src/order.spec.ts
    ✕ 0 dona — xato

  ● orderTotal › 0 dona — xato

    quantity musbat raqam bo'lsin

    > 3 |     throw new Error("quantity musbat raqam bo'lsin");
        |           ^

      at orderTotal (order.ts:3:11)
      at Object.<anonymous> (order.spec.ts:11:22)

Tests:       1 failed, 4 passed, 5 total`, { 4: { id: 'm' }, 6: { id: 'm' }, 11: { id: 'at' }, 12: { id: 'at' } });
const S8 = mkS(8, [{ v: 'both' }, { v: 'bad', f: ['m'] }, { v: 'bad', f: ['at'] }, { v: 'both', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="mk-tag" style={{ color: T.accent, margin: 0 }}>O'ralmagan</div>
      <CodePanel file={F.ordSpec} wrap lines={WRAP_BAD} focus={['x']} />
      {seg.v === 'both' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>O'ralgan — () =&gt;</div><CodePanel file={F.ordSpec} wrap lines={WRAP_OK} focus={['x']} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'bad' && <Term er lines={UNWRAP_OUT} focus={seg.f} />}
      {seg.v === 'both' && !seg.sum && <div className="mk-card"><h5>Savol</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>Qaysi yozuv to'g'ri? Sinab ko'ramiz: <b>o'rashni olib tashlaymiz</b>.</div></div>}
      {seg.sum && <><Term lines={PASS5.slice(1, 8)} /><div className="mk-rule">Xato kutilsa — funksiya <b>() =&gt; ichida</b>: Jest uni o'zi chaqiradi va xatoni tutadi.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  9 · toThrow('xabar'): xabar mos emas (jest2-out/07)
// ============================================================
const MSG_SPEC = ts(String.raw`
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow('narx xato');
  });`, { 2: { id: 'x' } });
const MSG_OUT = jt(String.raw`
FAIL src/order.spec.ts
    ✕ matn — xato (11 ms)

  ● orderTotal › matn — xato

    expect(received).toThrow(expected)

    Expected substring: "narx xato"
    Received message:   "quantity musbat raqam bo'lsin"

      at orderTotal (order.ts:3:11)

Tests:       1 failed, 4 passed, 5 total`, { 8: { id: 'm' }, 9: { id: 'm' } });
WRAP_BAD.forEach((l, i) => { l.n = 10 + i; });
WRAP_OK.forEach((l, i) => { l.n = 10 + i; });
MSG_SPEC.forEach((l, i) => { l.n = 16 + i; });
const S9 = mkS(9, [{ v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={MSG_SPEC} focus={['x']} /></Ide>
      {seg.v === 'code' && <div className="pg-two">
        <div className="mk-box" style={{ '--c': T.ink3 }}><h4><code>toThrow()</code></h4><p>xato bo'ldimi?</p></div>
        <div className="mk-box" style={{ '--c': T.green }}><h4><code>toThrow('matn')</code></h4><p>qaysi xato?</p></div>
      </div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && <Term er lines={MSG_OUT} focus={['m']} />}
      {seg.sum && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — toThrow("quantity musbat raqam bo'lsin")</div><Term lines={PASS5.slice(7, 8).concat(PASS5.slice(10))} /></>}
      {seg.sum && <div className="mk-rule">Xato kutilgan joyda <b>xabarni ham</b> tekshiring — u qaysi shartdan kelganini aytadi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  10 · Shartsiz throw va < 0 (jest2-out/08, 09)
// ============================================================
const NOIF_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  throw new Error("quantity musbat raqam bo'lsin");
  return price * quantity;
}`, { 2: { id: 'x' } });
const LT_TS = ts(GUARD_SRC('quantity < 0'), { 2: { id: 'x' } });
const NOIF_OUT = jt(String.raw`
FAIL src/order.spec.ts
  orderTotal
    ✕ 2 kitob narxini hisoblaydi (2 ms)
    ✕ 1 dona — eng kichik haqiqiy buyurtma
    ✓ 0 dona — xato (2 ms)
    ✓ manfiy — xato (1 ms)
    ✓ matn — xato (4 ms)

Tests:       2 failed, 3 passed, 5 total`, { 3: { id: 'x' }, 4: { id: 'x' } });
const LT_OUT = jt(String.raw`
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma
    ✕ 0 dona — xato (1 ms)
    ✓ manfiy — xato (2 ms)
    ✓ matn — xato (1 ms)

  ● orderTotal › 0 dona — xato

    Received function did not throw

Tests:       1 failed, 4 passed, 5 total`, { 5: { id: 'x' }, 9: { id: 'x' }, 11: { id: 'x' } });
const S10 = mkS(10, [{ v: 'noif' }, { v: 'noif', out: true }, { v: 'lt', out: true }, { v: 'lt', out: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="mk-tag" style={{ color: T.accent, margin: 0 }}>{seg.v === 'noif' ? "1-buzish: throw bor, if yo'q" : '2-buzish: <= 0 o\'rniga < 0'}</div>
      {seg.v === 'noif'
        ? <Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={NOIF_TS} focus={['x']} /></Ide>
        : <CodePanel file={F.ord} wrap lines={LT_TS.slice(0, 3)} focus={['x']} />}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.out && <Term er lines={seg.v === 'noif' ? NOIF_OUT : LT_OUT} focus={['x']} />}
      {seg.sum && <div className="pg-row" style={{ borderColor: T.green }}><span>Tiklandi: if bilan, quantity &lt;= 0</span><span className="v" style={{ fontSize: 13, color: T.green }}>Tests: 5 passed, 5 total</span></div>}
      {seg.sum && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="mk-box" style={{ '--c': T.green }}><h4>Happy testi</h4><p>himoya <b>juda qattiq</b> bo'lsa qizil</p></div>
        <div className="mk-box" style={{ '--c': T.accent }}><h4>Edge testi</h4><p>himoya <b>teshik</b> bo'lsa qizil</p></div>
      </div>}
    </div>
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (target 0 dan: 2-satr = 1)
// ============================================================
const LC11_FIXED = LT_TS.map((l, i) => ({ ...l, id: undefined, n: i + 1, ...(i === 1 ? { gone: true } : {}) }));
LC11_FIXED.splice(2, 0, { h: tsLine("  if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) {"), n: 2, neu: true });
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ord} lines={LT_TS.map((l) => ({ ...l, id: undefined }))} target={1}
    tree={{ root: MKCFG.root, files: ORD_FILES, active: F.ord }}
    fixed={LC11_FIXED} fixedExtra={[{ file: "2-satrdagi o'zgarish", lines: [{ h: `${tsLine('quantity < 0')}   →   ${tsLine('quantity <= 0')}` }] }, { file: 'terminal — npm test (haqiqiy)', lines: PASS5.slice(1, 8).concat(PASS5.slice(10)) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — uch buzish
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: "() =>siz — 0 dona testida: expect(orderTotal(10000, 0)).toThrow();", cmds: ['npm test'], exp: "quantity musbat raqam bo'lsin · at orderTotal (order.ts:3:11)" },
  { t: "Boshqa xabar — () => ni qaytaring; matn testida toThrow('narx xato')", cmds: ['npm test'], exp: 'Expected substring · Received message' },
  { t: '< 0 — order.ts: quantity <= 0 → quantity < 0', cmds: ['npm test'], exp: '0 dona — xato · did not throw' },
  { t: 'Tiklash — hammasini qaytaring', cmds: ['npm test'], exp: '5 passed' },
];
const P2_TROUBLE = [
  ['1-qadamda PASS', "o'zgarish boshqa testda qilingan — «0 dona» testidagi () => ni oling"],
  ['2-qadamda PASS', "toThrow() bo'sh qolgan — qavs ichiga matn yozing"],
];
const P2_PROOF = { label: "2-qadamdagi Received message satri", placeholder: "Received message qatorini qo'ying", check: (v) => /Received message:\s*"?quantity musbat raqam/i.test(v), wrong: "Satr «Received message:» bilan boshlanadi va funksiyaning o'z xabarini ko'rsatadi — butun satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }
