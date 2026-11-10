// ============================================================
//  Umumiy kod va chiqishlar (cicd1-out — toza clone, env -i, CI=true; /tmp yo'llari …/lenta-sinov ga qisqartirilgan)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const ORDER_SPEC = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
});`);
const CHAIN_OK = jt(String.raw`
$ npm test && npm run build && echo "UCHIRISH"
UCHIRISH
[chiqish kodi: 0]`, { 2: { id: 'u' } });
const CHAIN_BAD = jt(String.raw`
$ npm test && npm run build && echo "UCHIRISH"
[chiqish kodi: 1]`, { 2: { id: 'x' } });
const TEST_OK = jt(String.raw`
$ npm test
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (5 ms)

Tests:       1 passed, 1 total
[chiqish kodi: 0]`, { 2: { id: 'p' }, 6: { id: 't' }, 7: { id: 'k' } });
const TEST_BAD = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    Expected: 20000
    Received: 10002

Tests:       1 failed, 1 total
[chiqish kodi: 1]`, { 2: { id: 'f' }, 5: { id: 'r' }, 6: { id: 'r' }, 9: { id: 'k' } });
const NPM_CI = jt(String.raw`
$ npm ci
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
npm error Missing: class-validator@0.14.4 from lock file
npm error …  (jami 26 ta Missing)
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 3: { id: 's' }, 8: { id: 'k' } });
const NPM_INSTALL = jt(String.raw`
$ npm install
added 759 packages in 8s
[chiqish kodi: 0]`, { 2: { id: 'a' } });
const NO_TESTS = jt(String.raw`
$ npm test
> jest

No tests found, exiting with code 1
Run with \`--passWithNoTests\` to exit with code 0
In …/lenta-sinov/src
  37 files checked.
  testRegex: .*\.spec\.ts$ - 0 matches
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 4: { id: 'n' }, 9: { id: 'k' } });
const BUILD = jt(String.raw`
$ npm run build
> nest build

[chiqish kodi: 0]`, { 4: { id: 'k' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['CI/CD nima', "Lenta o'quvchi reposida", 'ci.yml', 'Buzamiz', 'CD: chiqarish', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — lenta o'quvchi reposida qayerda qizil bo'lishini bilasiz</div>
    <Term lines={CHAIN_OK} />
  </div>} />;
}

// ============================================================
//  2 · Qo'lda besh qadam va lenta
// ============================================================
const S2 = mkS(2, [{ st: {}, hl: ['install', 'test', 'lint', 'build', 'deploy'] }, { st: { test: 'skip' }, warn: true }, { st: { install: 'ok', test: 'ok', lint: 'ok', build: 'ok', deploy: 'ok' } }, { st: { install: 'ok', test: 'ok', lint: 'ok', build: 'ok', deploy: 'ok' }, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">{seg.st.install ? 'Lenta — har push\'da o\'zi' : "Qo'lda — har push'dan keyin"}</div>
      <Lenta st={seg.st} hl={seg.hl || []} />
    </div>
    {seg.warn && <div className="n2-warn">Shoshilib <b>Skaner</b> tashlab ketildi — tekshirilmagan kod foydalanuvchiga chiqadi (o'quvchi darsi, 2-ekran).</div>}
    {seg.sum && <div className="mk-rule">Lentada yangi buyruq yo'q — <b>terminal buyruqlaringiz</b>, avtomatik va har safar bir xil tartibda.</div>}
  </div>} />;
}

// ============================================================
//  3 · CI: har push tekshiriladi
// ============================================================
const DEVS3 = [['Ali', 'savatcha', 'ok'], ['Vali', 'login', 'bad'], ['Sora', "mahsulot ro'yxati", 'ok']];
const S3 = mkS(3, [{ v: 'push' }, { v: 'lenta' }, { v: 'res' }, { v: 'res', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-three">{DEVS3.map(([n, f, r]) => <div key={n} className="mk-box" style={{ '--c': seg.v === 'res' ? (r === 'ok' ? T.green : T.accent) : T.blue }}>
      <h4>{n}</h4><p>{f} · <code>git push</code></p>
      {seg.v !== 'push' && <p style={{ marginTop: 6, fontFamily: MONO, fontSize: 12.5 }}>→ lenta {seg.v === 'res' ? (r === 'ok' ? '✓ yashil' : '✗ qizil') : '…'}</p>}
    </div>)}</div>
    {seg.v !== 'push' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">Bitta lenta — har push uchun, bir xil toza mashinada</div><Lenta only={['install', 'test', 'build']} st={seg.v === 'res' ? { install: 'ok', test: 'ok', build: 'ok' } : {}} /></div>}
    {seg.v === 'res' && !seg.sum && <div className="n2-warn">Vali: «Uyimda ishlagan edi». Lentada qizil — xato uyidagi sozlamada yashiringan.</div>}
    {seg.sum && <div className="mk-rule"><b>CI</b> — har push'ni <b>darhol</b> va bir xil toza sharoitda tekshiradi.</div>}
  </div>} />;
}

// ============================================================
//  4 · Lenta mashinasi: toza papka va chiqish kodi (cicd1-out/07, 08, 12)
// ============================================================
const S4 = mkS(4, [{ v: 'm' }, { v: 'm', empty: true }, { v: 'k' }, { v: 'k', sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'm' && <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">Lenta mashinasi (runner) — haqiqiy run logidan</div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div className="pg-row"><span>runs-on: ubuntu-latest</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 14 }}>Ubuntu 24.04.5</span></div>
        <div className="pg-row"><span>Node.js (oldindan o'rnatilgan)</span><span className="v" style={{ fontSize: 14 }}>22.23.4</span></div>
        {seg.empty && <div className="pg-row hl"><span>Ish papkasi boshida</span><span className="v" style={{ fontSize: 14, color: T.accent }}>bo'sh — node_modules, .env yo'q</span></div>}
      </div>
      <div className="mk-tag" style={{ margin: '10px 0 0' }}>Manba: GitHub Actions run logi «Set up job» (01.11.2026) · GitHub eslatmasi: ubuntu-latest Ubuntu 26 ga o'tkazilmoqda</div>
    </div>}
    {seg.v === 'k' && <div className="pg-row"><span>ubuntu-latest · har safar bo'sh papka</span><span style={{ color: T.ink3 }}>→</span><span>npm test</span><span className="v" style={{ fontSize: 14 }}>chiqish kodi: 0 yoki 1</span></div>}
    {seg.v === 'k' && <div className="pg-two">
      <Term lines={TEST_OK} focus={['k']} />
      <Term er lines={TEST_BAD} focus={['k']} />
    </div>}
    {seg.sum && <div className="mk-rule">Lenta = <b>toza papka</b> + sizning buyruqlaringiz + <b>chiqish kodi</b>. 0 emas — lenta to'xtaydi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — chiqish kodi
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={TEST_BAD.slice(7)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: test qizil — keyingi qadamlar yurmadi</div>
      <Term er lines={CHAIN_BAD} focus={['x']} />
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'bad', build: 'skip', deploy: 'skip' }} />
    </div>} />;
}

// ============================================================
//  6 · Toza clone: npm ci yiqildi (cicd1-out/01, 02)
// ============================================================
const S6 = mkS(6, [{ v: 'clone' }, { v: 'ci', f: [] }, { v: 'ci', f: ['s', 'k'] }, { v: 'inst' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term lines={jt(String.raw`
$ git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git lenta-sinov
$ cd lenta-sinov`)} />
    {seg.v !== 'clone' && <Term er lines={NPM_CI} focus={seg.f || []} />}
    {seg.v === 'inst' && <><Term lines={NPM_INSTALL} focus={['a']} /><div className="mk-rule">Bu repoda o'rnatish — <b>npm install</b>. <code>npm ci</code> bilan lenta birinchi qadamda qizil.</div></>}
  </div>} />;
}

// ============================================================
//  7 · npm test: test yo'q bo'lsa qizil (cicd1-out/03, 07)
// ============================================================
const S7 = mkS(7, [{ v: 'none' }, { v: 'none', f: ['n', 'k'] }, { v: 'ok' }, { v: 'ok', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div className="pg-two">
    {!seg.sum && <Ide files={seg.v === 'ok' ? ORD_FILES : REPO_BASE} active={seg.v === 'ok' ? F.ordSpec : 'src/main.ts'} fresh={seg.v === 'ok' ? [F.ord, F.ordSpec] : []}>
      {seg.v === 'ok' ? <CodePanel file={F.ordSpec} wrap lines={ORDER_SPEC} /> : <div className="mk-tag" style={{ padding: 14 }}>src/ — bitta ham .spec.ts yo'q</div>}
    </Ide>}
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'none' && <Term er lines={NO_TESTS} focus={seg.f || []} />}
      {seg.v === 'ok' && <Term lines={TEST_OK} focus={['p', 'k']} />}
      {seg.sum && <div className="mk-rule">Lentaga test qadamini qo'yishdan oldin repoda <b>kamida bitta test</b> bo'lsin.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  8 · Build va && (cicd1-out/04, 09)
// ============================================================
const S8 = mkS(8, [{ v: 'build' }, { v: 'chain' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'build' && <Term lines={BUILD} focus={['k']} />}
    {seg.v === 'chain' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">&& — oldingisi 0 qaytarsa, keyingisi yuradi</div>
      <div className="pg-row"><code>npm test</code><span style={{ color: T.ink3 }}>&amp;&amp;</span><code>npm run build</code><span style={{ color: T.ink3 }}>&amp;&amp;</span><code>echo "UCHIRISH"</code></div>
    </div>}
    {seg.v === 'both' && <div className="pg-two">
      <div style={{ display: 'grid', gap: 8 }}><div className="mk-tag" style={{ color: T.accent, margin: 0 }}>order.ts: price + quantity</div><Term er lines={CHAIN_BAD} focus={['x']} /><Lenta only={['test', 'build', 'deploy']} st={{ test: 'bad', build: 'skip', deploy: 'skip' }} /></div>
      <div style={{ display: 'grid', gap: 8 }}><div className="mk-tag" style={{ color: T.green, margin: 0 }}>order.ts: price * quantity</div><Term lines={CHAIN_OK} focus={['u']} /><Lenta only={['test', 'build', 'deploy']} st={{ test: 'ok', build: 'ok', deploy: 'ok' }} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Lenta — <b>&amp;&amp; bilan ulangan buyruqlar</b>: birinchi qizilda to'xtaydi.</div>}
  </div>} />;
}

// ============================================================
//  9 · Amaliyot 1 — lentani qo'lda yurgizish
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Toza clone', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git lenta-sinov', 'cd lenta-sinov'], exp: 'papka yaratildi' },
  { t: "O'rnatish — avval npm ci (xato), keyin npm install", cmds: ['npm ci', 'npm install'], exp: 'in sync · keyin added … packages' },
  { t: "Test fayli — src/order.ts + src/order.spec.ts (Jest-1)", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Zanjir', cmds: ['npm test && npm run build && echo "UCHIRISH"'], exp: 'oxirgi satr UCHIRISH' },
];
const P1_CODE = [{ file: F.ord, step: 2, lines: ORDER_TS, copy: false }, { file: F.ordSpec, step: 2, lines: ORDER_SPEC, copy: false }];
const P1_TROUBLE = [
  ['npm ci ham ishladi', "lock fayl repoda yangilangan bo'lishi mumkin — yaxshi, davom eting"],
  ['No tests found', "order.spec.ts src/ ichida emas yoki nomi .test.ts (Jest-1, 4-ekran)"],
  ['UCHIRISH chiqmadi, FAIL', 'order.ts dagi hisob — price * quantity'],
];
const P1_PROOF = { label: 'Zanjirning oxirgi satri', placeholder: 'oxirgi satrni yozing', check: (v) => /^\s*"?UCHIRISH"?\s*$/i.test(v), wrong: "Zanjir oxirida echo nima chiqaradi? Uchala buyruq yashil bo'lsagina chiqadi" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={ORD_FILES} />; }
