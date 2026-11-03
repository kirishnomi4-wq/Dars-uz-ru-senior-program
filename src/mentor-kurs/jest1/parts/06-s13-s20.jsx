
// ============================================================
//  13 · Chegara: deliveryFee va 100 000 (jest1-out/09, 10)
// ============================================================
const DEL_TS = (bad) => ts(String.raw`
export function deliveryFee(total: number): number {
  return total ${bad ? '>' : '>='} 100000 ? 0 : 15000;
}`, { 2: { id: 'c', neu: bad === false ? false : undefined } });
const DEL_SPEC = ts(String.raw`
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
});`, { 7: { id: 'a' }, 8: { id: 'a' }, 9: { id: 'a' } });
const DEL_PASS = jt(String.raw`
PASS src/delivery.spec.ts
PASS src/order.spec.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total`);
const DEL_FAIL = jt(String.raw`
FAIL src/delivery.spec.ts
  ● deliveryFee › aynan 100 000 — bepul

    Expected: 0
    Received: 15000

    >  8 |     expect(deliveryFee(100000)).toBe(0);
         |                                 ^

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 3 passed, 4 total`, { 2: { id: 'x' }, 4: { id: 'x' }, 5: { id: 'x' } });
const DEL_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.del, F.delSpec]);
const S13 = mkS(13, [{ v: 'code', file: F.del }, { v: 'pass', file: F.delSpec }, { v: 'fail', file: F.del }, { v: 'fail', file: F.delSpec, sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div className="pg-two">
    <Ide files={DEL_FILES} active={seg.file} fresh={[F.del, F.delSpec]}>
      {seg.file === F.del ? <CodePanel file={F.del} wrap lines={DEL_TS(seg.v === 'fail')} focus={seg.v === 'fail' ? ['c'] : []} /> : <CodePanel file={F.delSpec} wrap lines={DEL_SPEC} focus={seg.sum ? ['a'] : []} />}
    </Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'pass' && <Term lines={DEL_PASS} />}
      {seg.v === 'fail' && <Term er lines={DEL_FAIL} focus={['x']} />}
      {seg.sum && <div className="mk-rule">Shart bor joyda <b>uch test</b>: chegaradan yuqori · <b>aynan chegara</b> · chegaradan past</div>}
    </div>
  </div>} />;
}

// ============================================================
//  14 · AI yozgan testni tekshirish (o'quvchi darsi Screen15 — 5 test)
// ============================================================
const AI14 = [
  ["expect(orderTotal(10000, 2)).toBe(20000)", true, '10000 × 2 = 20000 ✓', 'haqiqiy'],
  ['const r = orderTotal(10000, 2);', false, '—', "yolg'on — doim yashil"],
  ['expect(orderTotal(10000, 2)).toBe(10002)', true, '✗ 20000 bo\'lishi kerak', "noto'g'ri etalon"],
  ['console.log(orderTotal(5000, 3))', false, '—', "yolg'on"],
  ['expect(orderTotal(5000, 3)).toBe(15000)', true, '5000 × 3 = 15000 ✓', 'haqiqiy'],
];
const S14 = mkS(14, [{ q: 0 }, { q: 1 }, { q: 2 }, { q: 3 }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">AI orderTotal uchun yozgan 5 test (o'quvchi darsidan)</div>
    <table className="mk-tbl"><thead><tr><th>test</th><th>expect bormi</th><th>etalon</th><th>hukm</th></tr></thead><tbody>
      {AI14.map(([c, e, r, h], i) => {
        const bad1 = !e, bad2 = r.startsWith('✗');
        const show = seg.q === 0 ? false : seg.q === 1 ? bad1 : seg.q === 2 ? bad2 : true;
        return <tr key={i} className={show && (bad1 || bad2) ? 'hl' : ''}><td><code>{c}</code></td><td style={{ color: seg.q >= 1 ? (e ? T.green : T.accent) : T.ink3 }}>{seg.q >= 1 ? (e ? 'ha' : "yo'q") : '?'}</td><td style={{ color: seg.q >= 2 ? (bad2 ? T.accent : T.ink2) : T.ink3 }}>{seg.q >= 2 ? r : '?'}</td><td style={{ fontWeight: 700, color: seg.q >= 3 ? (h === 'haqiqiy' ? T.green : T.accent) : T.ink3 }}>{seg.q >= 3 ? h : ''}</td></tr>;
      })}
    </tbody></table>
    {seg.q === 3 && <div className="mk-rule" style={{ marginTop: 12 }}>Har AI testiga <b>ikki savol</b>: <code>expect</code> bormi? Etalon qo'lda hisoblaganda to'g'rimi?</div>}
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — kim xato
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={FAIL_REF.slice(0, 5)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — etalon 20000</div>
      <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} lines={ORDER_SPEC} focus={['exp']} /><Term lines={PASS_OUT.slice(4, 7)} /></Ide>
    </div>} />;
}

// ============================================================
//  16 · Amaliyot 3 — deliveryFee
// ============================================================
const P3 = mkS(16, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Funksiya — src/delivery.ts', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Testlar — src/delivery.spec.ts, 3 ta it', cmds: ['npm test'], exp: 'Tests: 4 passed, 4 total' },
  { t: 'Chegarani buzish — total >= 100000 → total > 100000', cmds: ['npm test'], exp: '1 failed, 3 passed' },
  { t: "O'qish va tiklash — ● satr, >= qaytaring", cmds: ['npm test'], exp: '4 passed' },
];
const P3_CODE = [{ file: F.del, step: 0, lines: DEL_TS(false), copy: false }, { file: F.delSpec, step: 1, lines: DEL_SPEC, copy: false }];
const P3_TROUBLE = [
  ['3-qadamda hammasi yashil', "aynan 100 000 testi yo'q — vazifadagi uchinchi holatni qo'shing"],
  ['3-qadamda ikki test qizil', "99 000 testida etalon xato (15 000 bo'lishi kerak)"],
  ['Tests: 3 passed', "order.spec.ts o'chirilgan — mayli, uchtasi ham yetarli"],
];
const P3_PROOF = { label: 'Qizil testning nomi (● satridan)', placeholder: 'qizil it nomini yozing', check: (v) => /100\s?000/.test(v) && /bepul/i.test(v), wrong: "● satridagi › belgisidan keyingi nomni yozing — u qaysi summani sinaydi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={DEL_FILES} />; }

// ============================================================
//  17 · Sinfdagi tuzoqlar: joy, nom, npm ci
// ============================================================
const CI17 = jt(String.raw`
$ npm ci
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
$ npm install
…  (o'rnatildi)`.replace(/\\`/g, '`'), { 3: { id: 'c' } });
const TRAP17 = [
  ['Fayl loyiha ildizida', 'order.spec.ts (src/ dan tashqarida)', 'No tests found — rootDir: src'],
  ['Nomi .test.ts', 'src/order.test.ts', 'No tests found — testRegex: .spec.ts'],
  ['npm ci', 'lock fayl sinxron emas', 'npm install'],
];
const S17 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2] }, { hl: [0, 1, 2] }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    <div className="pg-three">{TRAP17.map(([h, w, r], i) => <div key={i} className={`mk-box${seg.hl.includes(i) ? ' hl' : ''}`} style={{ '--c': [T.accent, T.yellow, PG.pg][i], opacity: seg.hl.length && !seg.hl.includes(i) ? 0.4 : 1 }}><h4>{h}</h4><p><code>{w}</code></p><p style={{ marginTop: 6 }}>{r}</p></div>)}</div>
    {(seg.hl.includes(0) && !seg.hl.includes(2)) && <Term er lines={NOTESTS.slice(3)} focus={['nt', 'rx']} />}
    {seg.hl.includes(2) && seg.hl.length === 1 && <Term er lines={CI17} focus={['c']} />}
    {seg.hl.length === 3 && <div className="mk-rule"><code>No tests found</code> — joy va nom · <code>npm ci</code> xatosi — <code>npm install</code>. Ikkalasi kodda emas, sozlamada.</div>}
  </>} />;
}

// ============================================================
//  18 · Nest bo'lmagan loyiha: to'rt qadamli zanjir (jest1-out/12–15, 20)
// ============================================================
const CHAIN18 = [
  { cmd: 'npm i -D jest ts-jest · "test": "jest"', out: 'Must use import to load ES Module', fix: 'npx ts-jest config:init' },
  { cmd: 'npx ts-jest config:init', out: "TS2593: Cannot find name 'describe'", fix: 'npm i -D @types/jest typescript' },
  { cmd: 'npm i -D typescript @types/jest', out: 'The TypeScript compiler "typescript" (version 7.0.2) does not expose the JavaScript compiler API required by ts-jest', fix: 'npm i -D typescript@5' },
  { cmd: 'npm i -D typescript@5', out: 'PASS ./order.spec.ts · ✓ 2 kitob narxini hisoblaydi', fix: '', ok: true },
];
const S18 = mkS(18, [{ upto: -1 }, { upto: 0 }, { upto: 2 }, { upto: 3 }, { upto: 3, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div className="pg-two">
    <Ide root="bosh" files={["node_modules/", "jest.config.js", "order.spec.ts", "order.ts", "package.json"]} active="order.spec.ts"><CodePanel file="order.spec.ts" wrap lines={ORDER_SPEC} /></Ide>
    <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
      {CHAIN18.map((c, i) => i <= seg.upto && <div key={i} className="mk-step" style={{ animation: 'mk-up .4s ease both', borderColor: c.ok ? T.green : T.accent }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: c.ok ? T.green : T.accent, minWidth: 20 }}>{i + 1}</span>
        <div className="t"><b><code>{c.cmd}</code></b><div style={{ fontFamily: MONO, fontSize: 12, color: c.ok ? T.green : T.accent, margin: '4px 0' }}>{c.out}</div>{c.fix && <div className="exp">→ keyingi: <code>{c.fix}</code></div>}</div>
      </div>)}
      {seg.upto >= 2 && <div className="mk-tag" style={{ margin: 0 }}>To'rt paket bitta buyruqda o'rnatilsa — TypeScript 6.0.3; u ham TS2593 beradi. ts-jest uchun — TypeScript 5.</div>}
      {seg.sum && <div className="mk-rule">Testni <b>o'quvchi reposida</b> yozdiring — u yerda hammasi tayyor (TypeScript 5.9).</div>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — TypeScript 7
// ============================================================
function Screen19(p) {
  const m = MDT[19];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — bo'sh loyiha</div>
      <Term lines={jt(String.raw`
$ npm i -D typescript@5
typescript 5.9.3
$ npm test
PASS ./order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)`)} />
    </div>} />;
}

// ============================================================
//  20 · Amaliyot 4 — No tests found
// ============================================================
const P4 = mkS(20, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: "Ildizga — order.spec.ts → loyiha ildizi, import './src/order'", cmds: [], exp: "fayl ko'chdi" },
  { t: 'Sinash', cmds: ['npm test'], exp: 'No tests found, exiting with code 1' },
  { t: 'Nom — src/order.test.ts', cmds: ['npm test'], exp: 'No tests found' },
  { t: 'Tiklash — src/order.spec.ts', cmds: ['npm test'], exp: 'PASS' },
];
const P4_TROUBLE = [
  ['2-qadamda PASS', "src/ da eski nusxa qolgan (ikkita fayl) — bittasini o'chiring"],
  ['delivery.spec.ts ham yurdi', "PASS src/delivery.spec.ts — u joyida, bu normal; order yo'qligiga qarang"],
];
const P4_PROOF = { label: 'Xabarning birinchi satri', placeholder: 'npm test natijasining birinchi qatorini qo\'ying', check: (v) => /No tests found/i.test(v), wrong: "Jest testni topmaganda nima deydi? O'sha birinchi qatorni nusxalang" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }
