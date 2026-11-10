
// ============================================================
//  Umumiy kod va chiqishlar (jest1-out — toza muhit; /tmp yo'llari qisqartirilgan)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const ORDER_SPEC = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    expect(result).toBe(20000);
  });
});`, { 1: { id: 'imp' }, 3: { id: 'desc' }, 8: { id: 'desc' }, 4: { id: 'it' }, 7: { id: 'it' }, 5: { id: 'act' }, 6: { id: 'exp' } });
const PASS_OUT = jt(String.raw`
$ npm test
> IntroNestArxitechture@0.0.1 test
> jest

PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.389 s, estimated 1 s
Ran all test suites.`, { 5: { id: 'pass' }, 6: { id: 'name' }, 7: { id: 'name' }, 9: { id: 'tot' }, 10: { id: 'tot' } });
const FAIL_OUT = jt(String.raw`
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    expect(received).toBe(expected) // Object.is equality

    Expected: 20000
    Received: 10002

      4 |   it('2 kitob narxini hisoblaydi', () => {
      5 |     const result = orderTotal(10000, 2);
    > 6 |     expect(result).toBe(20000);
        |                    ^
      7 |   });

      at Object.<anonymous> (order.spec.ts:6:20)

Tests:       1 failed, 1 total`, { 1: { id: 'f' }, 2: { id: 'f' }, 6: { id: 'er' }, 7: { id: 'er' }, 11: { id: 'ln' }, 12: { id: 'ln' }, 15: { id: 'ln' } });
const NOTESTS = jt(String.raw`
$ npm test
> jest

No tests found, exiting with code 1
Run with \`--passWithNoTests\` to exit with code 0
In …/IntroNestArxitechture/src
  37 files checked.
  testMatch:  - 0 matches
  testPathIgnorePatterns: /node_modules/ - 37 matches
  testRegex: .*\.spec\.ts$ - 0 matches
Pattern:  - 0 matches`.replace(/\\`/g, '`'), { 4: { id: 'nt' }, 11: { id: 'rx' } });
const SPEC_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Unit-test va Jest', 'Birinchi test', "Buzamiz: FAIL va yolg'on testlar", 'Chegara va AI testi', 'Sinfdagi tuzoqlar', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4, 5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — o'quvchi reposida</div>
    <Term lines={PASS_OUT.slice(4, 10)} />
  </div>} />;
}

// ============================================================
//  2 · Unit-test: funksiya — mashina
// ============================================================
const PAIRS2 = [['orderTotal(10000, 2)', '20000'], ['orderTotal(5000, 3)', '15000'], ['orderTotal(120000, 1)', '120000']];
const S2 = mkS(2, [{ v: 'm' }, { v: 'pair' }, { v: 'code' }, { v: 'code', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">Funksiya — mashina: kirish → natija</div>
      <div style={{ display: 'grid', gap: 8 }}>{PAIRS2.map(([a, b], i) => <div key={i} className="pg-row" style={{ opacity: seg.v === 'm' && i > 0 ? 0.35 : 1 }}><span>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 16, color: T.green }}>{b}</span></div>)}</div>
      {seg.v !== 'm' && <div className="mk-rule" style={{ marginTop: 10 }}>Unit-test — <b>shu juftni yozib qo'yish</b>: «shu kirishga aynan shu chiqish». Bitta funksiya, bazasiz, serversiz.</div>}
    </div>
    {seg.v === 'code' && <Ide files={tree(REPO_BASE, [F.ord])} active={F.ord}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></Ide>}
  </>} />;
}

// ============================================================
//  3 · Jest o'quvchi reposida allaqachon bor
// ============================================================
const PKG3 = js(String.raw`
"scripts": {
  "test": "jest",
  …
},
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "testEnvironment": "node"
}`, { 2: { id: 't' }, 7: { id: 'r' }, 8: { id: 'r' }, 9: { id: 'r' } });
const S3 = mkS(3, [{ focus: ['t'] }, { focus: ['r'] }, { focus: [], nt: true }, { focus: ['r'], nt: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <Ide files={MKCFG.files} active={F.pkg}>
    {!seg.sum && <CodePanel file="package.json" lines={PKG3} focus={seg.focus} />}
    {seg.nt && <Term er lines={NOTESTS} focus={seg.sum ? ['nt', 'rx'] : []} />}
    {seg.sum && <div className="mk-rule">Test fayli — <code>src/</code> ichida va nomi <b>.spec.ts</b> bilan tugaydi. Biri buzilsa — <code>No tests found</code>.</div>}
  </Ide>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: fayl ildizda yoki .test.ts — topilmaydi; src/order.spec.ts — topiladi</div>
      <Ide files={tree(REPO_BASE, ['order.spec.ts', F.ord, F.ordSpec])} active={F.ordSpec}>
        <Term lines={PASS_OUT.slice(4, 7)} />
      </Ide>
    </div>} />;
}

// ============================================================
//  5 · Birinchi test: describe · it · expect
// ============================================================
const S5 = mkS(5, [{ focus: ['imp'] }, { focus: ['desc'] }, { focus: ['it'] }, { focus: ['act', 'exp'], aaa: true }, { focus: ['exp'] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <Ide files={SPEC_FILES} active={F.ordSpec} fresh={[F.ordSpec]}>
    <CodePanel file={F.ordSpec} lines={ORDER_SPEC} focus={seg.focus} />
    {seg.aaa && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>Tayyorlash</h4><p>10000, 2</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>Chaqirish</h4><p><code>orderTotal(10000, 2)</code></p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>Tekshirish</h4><p><code>expect(…).toBe(20000)</code></p></div>
    </div>}
  </Ide>} />;
}

// ============================================================
//  6 · PASS'ni o'qish
// ============================================================
const S6 = mkS(6, [{ focus: ['pass'] }, { focus: ['name'] }, { focus: ['tot'] }, { focus: ['pass', 'tot'], sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    <Term lines={PASS_OUT} focus={seg.focus} />
    {seg.sum && <div className="mk-rule"><b>PASS</b> — fayl va holatlar o'tdi · <code>Tests:</code> — nechta <code>it</code> · lekin PASS faqat <code>expect</code> bo'lsa ma'noli (10-ekran)</div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — birinchi test
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo va bo\'sh test', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git', 'npm install', 'npm test'], exp: 'No tests found, exiting with code 1' },
  { t: 'Funksiya — src/order.ts', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Test — src/order.spec.ts (namuna — o\'zingiz yozing)', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ishga tushirish', cmds: ['npm test'], exp: 'PASS src/order.spec.ts · ✓ 2 kitob narxini hisoblaydi' },
];
const P1_CODE = [{ file: F.ord, step: 1, lines: ORDER_TS, copy: false }, { file: F.ordSpec, step: 2, lines: ORDER_SPEC, copy: false }];
const P1_TROUBLE = [
  ['npm ci … can only install packages when your package.json and package-lock.json … are in sync', 'bu repoda lock fayl sinxron emas — npm install'],
  ['No tests found (fayl yozilgandan keyin)', 'fayl src/ dan tashqarida yoki nomi .test.ts — 4-ekran'],
  ["Cannot find module './orders' from 'order.spec.ts'", "import'dagi nom fayl nomiga mos emas — ikkalasi src/ ichida, yonma-yon"],
  ['FAIL · Expected: 20000', "order.ts dagi hisobni tekshiring — 8-ekran"],
];
const P1_PROOF = { label: 'Isbot: natijadagi Tests: satri', placeholder: 'natijadagi Tests satrini qo\'ying', check: (v) => /Tests:\s+1 passed,\s+1 total/.test(v), wrong: "Satr «Tests:» bilan boshlanadi va nechta test o'tganini aytadi — terminaldan butun satrni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={SPEC_FILES} />; }

// ============================================================
//  8 · FAIL'ni o'qish: kod buzildi
// ============================================================
const ORDER_BAD = [ORDER_TS[0], { ...ORDER_TS[1], gone: true }, { h: tsLine('  return price + quantity;'), neu: false, id: 'bad', n: 2 }, ORDER_TS[2]];
const S8 = mkS(8, [{ v: 'bad' }, { v: 'fail', focus: ['f'] }, { v: 'fail', focus: ['er'] }, { v: 'fail', focus: ['ln'] }, { v: 'fix' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ord}>
      <CodePanel file={F.ord} wrap lines={seg.v === 'fix' ? ORDER_TS.map((l, i) => i === 1 ? { ...l, neu: true } : l) : ORDER_BAD} focus={seg.v === 'fix' ? [] : ['bad']} />
    </Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'fail' && <Term er lines={FAIL_OUT} focus={seg.focus} />}
      {seg.v === 'fix' && <><Term lines={PASS_OUT.slice(4, 7)} /><div className="mk-rule">FAIL o'qish: <b>●</b> satr → <b>Expected</b> / <b>Received</b> → funksiya. Javobni aytmang — birga o'qing.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  9 · Noto'g'ri etalon
// ============================================================
const SPEC_BADREF = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(10002);
  });
});`, { 5: { id: 'x' } });
const FAIL_REF = jt(String.raw`
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    Expected: 10002
    Received: 20000

    > 5 |     expect(orderTotal(10000, 2)).toBe(10002);
        |                                  ^`, { 4: { id: 'e' }, 5: { id: 'e' } });
const S9 = mkS(9, [{ v: 'code' }, { v: 'fail' }, { v: 'fail', calc: true }, { v: 'fix', calc: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={seg.v === 'fix' ? SPEC_BADREF.map((l, i) => i === 4 ? { h: tsLine('    expect(orderTotal(10000, 2)).toBe(20000);'), neu: true } : l) : SPEC_BADREF} focus={seg.v === 'fix' ? [] : ['x']} /></Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'code' && <Term er={seg.v === 'fail'} lines={seg.v === 'fix' ? PASS_OUT.slice(4, 7) : FAIL_REF} focus={['e']} />}
      {seg.calc && <div className="pg-row"><span>Qo'lda: 10 000 × 2</span><span className="v" style={{ color: T.green }}>= 20 000</span></div>}
      {seg.v === 'fix' && <div className="mk-rule">FAIL'da birinchi savol: <b>kim xato</b> — funksiyami yoki etalonmi?</div>}
    </div>
  </div>} />;
}

// ============================================================
//  10 · Yolg'on PASS: expect yo'q
// ============================================================
const SPEC_LOG = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    console.log(result);
  });
});`, { 6: { id: 'x' } });
const LOG_OUT = jt(String.raw`
  console.log
    20000

      at Object.<anonymous> (order.spec.ts:6:13)

PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (14 ms)

Tests:       1 passed, 1 total`, { 6: { id: 'p' }, 8: { id: 'p' } });
const S10 = mkS(10, [{ v: 'code' }, { v: 'out' }, { v: 'out', why: true }, { v: 'out', why: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={SPEC_LOG} focus={['x']} /></Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && !seg.sum && <Term lines={LOG_OUT} focus={['p']} />}
      {seg.why && !seg.sum && <div className="n2-warn">Jest qoidasi: <code>it</code> ichida xato chiqmasa — holat o'tdi. Xato chiqaradigan yagona narsa — <b>expect</b>.</div>}
      {seg.sum && <div className="mk-rule">Har <code>it</code>da kamida bitta <code>expect</code> — aks holda PASS <b>yolg'on</b>.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (target 0 dan: 6-satr = 5)
// ============================================================
const LC11_FIXED = SPEC_LOG.map((l, i) => ({ ...l, n: i + 1, ...(i === 5 ? { gone: true } : {}) })); // n — fayldagi raqam (qo'shilgan satrdan keyin siljimasin)
LC11_FIXED.splice(6, 0, { h: tsLine('    expect(result).toBe(20000);'), n: 6, neu: true });
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ordSpec} lines={SPEC_LOG.map((l) => ({ ...l, id: undefined }))} target={5}
    tree={{ root: MKCFG.root, files: SPEC_FILES, active: F.ordSpec }}
    fixed={LC11_FIXED} fixedExtra={[{ file: 'terminal — npm test (haqiqiy)', lines: PASS_OUT.slice(4, 7) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — uch xil buzish
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Kodni buzish — order.ts: price + quantity', cmds: ['npm test'], exp: 'FAIL · Expected: 20000 · Received: …' },
  { t: "Etalonni buzish — order.ts tiklang, order.spec.ts: toBe(10002)", cmds: ['npm test'], exp: 'FAIL · Expected: 10002 · Received: 20000' },
  { t: "expect'siz — expect(…) o'rniga console.log(result)", cmds: ['npm test'], exp: 'console.log 20000 · PASS' },
  { t: 'Tiklash — expect(result).toBe(20000);', cmds: ['npm test'], exp: 'PASS' },
];
const P2_TROUBLE = [
  ['1-qadamda PASS', 'fayl saqlanmagan — Ctrl+S, qayta npm test'],
  ["error TS1005: ')' expected.", "qavs tushib qolgan — xabardagi satr va ~ belgisi joyni ko'rsatadi"],
  ['3-qadamda FAIL', 'expect hali qolgan — u satrni butunlay almashtiring'],
];
const P2_PROOF = { label: '1-qadamdagi Received qiymati', placeholder: 'Received yonidagi sonni yozing', check: (v) => /^\s*10\s?002\s*$/.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 va 2 ni qo'shganda nima chiqadi?" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }
