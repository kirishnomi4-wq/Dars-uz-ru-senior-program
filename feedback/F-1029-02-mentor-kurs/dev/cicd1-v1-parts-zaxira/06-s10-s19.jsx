// ============================================================
//  ci.yml variantlari (manba/cicd1-yml; tahlil — cicd1-out/10)
// ============================================================
const YML_OQ = yml(String.raw`
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm test`, { 1: { id: 'on' }, 4: { id: 'ro' }, 5: { id: 'st' }, 6: { id: 'st' }, 7: { id: 'st' } });
const YML_OK = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm test
      - run: npm run build`, { 7: { id: 'co' }, 8: { id: 'sn' }, 9: { id: 'sn' }, 10: { id: 'sn' }, 11: { id: 'run' }, 12: { id: 'run' }, 13: { id: 'run' } });
const YML_CI = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`);
const TAHLIL_OQ = jt(String.raw`
$ node tekshir (@actions/workflow-parser 0.3.61) ci.yml
--- 1-oquvchi-darsi.yml
  ✓ xato yo'q (schema bo'yicha to'g'ri)`, { 3: { id: 'v' } });
const TAHLIL_OK = jt(String.raw`
--- 2-tavsiya.yml
  ✓ xato yo'q (schema bo'yicha to'g'ri)`);
const BOSH = jt(String.raw`
# bo'sh papka — checkout qadami yo'q bo'lsa
$ ls -a
.  ..
$ npm install
npm error code ENOENT
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '…/bosh-papka/package.json'
[chiqish kodi: 254]`, { 3: { id: 'e' }, 6: { id: 'm' }, 7: { id: 'k' } });
const CI_FILES_ONLY = tree(REPO_BASE, [F.ord, F.ordSpec, F.ci]);

// ============================================================
//  10 · ci.yml tuzilishi
// ============================================================
const S10 = mkS(10, [{ focus: [] }, { focus: ['on'] }, { focus: ['ro', 'st'] }, { focus: ['on', 'ro', 'st'], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={CI_FILES_ONLY} active={F.ci} fresh={[F.ci]}><CodePanel file={F.ci} lines={YML_OQ} focus={seg.focus} /></Ide>
    {seg.sum && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4><code>on</code></h4><p>qachon — har push</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4><code>runs-on</code></h4><p>qayerda — lenta mashinasi</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4><code>steps</code></h4><p>nima — buyruqlar, tartib bilan</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Checkout yo'q — papka bo'sh (cicd1-out/10, 11, 12)
// ============================================================
const S11 = mkS(11, [{ v: 'parse' }, { v: 'doc' }, { v: 'empty' }, { v: 'empty', sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><CodePanel file={F.ci} lines={YML_OQ} focus={seg.v === 'parse' || seg.sum ? [] : ['st']} /></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'parse' && <Term title="GitHub'ning rasmiy tahlilchisi" lines={TAHLIL_OQ} focus={['v']} />}
      {seg.v === 'doc' && <div className="mk-card"><h5>actions/checkout — hujjatidan</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«This action <b>checks-out your repository</b> under <code>$GITHUB_WORKSPACE</code>, so your workflow can access it.»</div><div className="mk-tag" style={{ margin: '8px 0 0' }}>Bu faylda checkout qadami yo'q → ish papkasi bo'sh</div></div>}
      {seg.v === 'empty' && <Term er lines={BOSH} focus={['m', 'k']} />}
      {seg.v === 'empty' && <div className="mk-tag" style={{ margin: 0 }}>Bo'sh papkada lokal · GitHub'da ham sinaldi: checkout'siz lenta — xuddi shu xato, qizil</div>}
      {seg.sum && <div className="mk-rule">Har lentaning <b>birinchi qadami</b> — <code>actions/checkout</code>. Amaliyotda o'quvchilarga qo'shtiring.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  12 · Tavsiya ci.yml (cicd1-yml/2-tavsiya.yml)
// ============================================================
const S12 = mkS(12, [{ focus: ['co', 'sn'] }, { focus: ['run'] }, { focus: ['co', 'sn'], ver: true }, { focus: [], sum: true }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <div className="pg-two">
    {!seg.sum && <Ide files={CI_FILES_ONLY} active={F.ci}><CodePanel file={F.ci} lines={YML_OK} focus={seg.focus} /></Ide>}
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {!seg.ver && !seg.sum && <Lenta only={['install', 'test', 'build']} hl={seg.focus.includes('run') ? ['install', 'test', 'build'] : []} />}
      {seg.ver && <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">So'nggi relizlar (GitHub, 01.11.2026)</div>
        <div className="pg-row"><span>actions/checkout</span><span className="v" style={{ fontSize: 14 }}>v7.0.1</span></div>
        <div className="pg-row" style={{ marginTop: 6 }}><span>actions/setup-node</span><span className="v" style={{ fontSize: 14 }}>v7.1.0</span></div>
        <div className="mk-tag" style={{ margin: '8px 0 0' }}>O'quvchi m4c-03 da — @v4: ishlaydi, lekin har run'da «Node.js 20 is deprecated» ogohlantirishi</div>
      </div>}
      {seg.sum && <><Term lines={TAHLIL_OK} /><div className="mk-rule">O'quvchi reposi uchun besh qadam; <b>lint qadami yo'q</b> — sababi 15-ekranda.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  13 · Tekshiruv 2 — LineCheck (11-satr = 10)
// ============================================================
const LC13_FIXED = YML_CI.map((l, i) => ({ ...l, n: i + 1, ...(i === 10 ? { gone: true } : {}) }));
LC13_FIXED.splice(11, 0, { h: yamlLine('      - run: npm install'), n: 11, neu: true });
function Screen13(p) {
  const m = MDT[13];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ci} lines={YML_CI} target={10}
    tree={{ root: MKCFG.root, files: CI_FILES_ONLY, active: F.ci }}
    fixed={LC13_FIXED} fixedExtra={[{ file: 'terminal (haqiqiy, toza clone)', lines: jt('$ npm ci\nnpm error `npm ci` can only install packages when … are in sync.\n[chiqish kodi: 1]').concat(NPM_INSTALL) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  14 · Amaliyot 2 — ci.yml GitHub'da
// ============================================================
const P2 = mkS(14, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Fayl — .github/workflows/ci.yml (12-ekrandagi)', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git add .github && git commit -m "ci: lenta"', 'git push'], exp: "push o'tdi" },
  { t: "Actions — GitHub → repo → Actions → oxirgi lenta", cmds: [], exp: 'yashil belgi' },
  { t: 'Log — test ishi ichida npm test qadamini oching', cmds: [], exp: 'Tests: … passed' },
];
const P2_CODE = [{ file: F.ci, step: 0, lines: YML_OK, copy: true }];
const P2_TROUBLE = [
  ["Actions'da lenta umuman yo'q", "papka nomi aniq .github/workflows emas yoki fayl push qilinmagan"],
  ['in sync', 'npm ci yozilgan — npm install (13-ekran)'],
  ['Could not read package.json', "checkout qadami yo'q (11-ekran)"],
  ['No tests found', "repoda test fayli yo'q (7-ekran)"],
];
const P2_PROOF = { label: "npm test qadamidagi Tests: satri", placeholder: "Tests satrini qo'ying", check: (v) => /Tests:\s+\d+ passed,\s+\d+ total/.test(v), wrong: "Lenta logida npm test qadamini oching — Tests: bilan boshlanadigan satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P2_CODE} tree={CI_FILES_ONLY} />; }

// ============================================================
//  15 · Lint qadami: 46 error (cicd1-out/05, 06)
// ============================================================
const LINT_OUT = jt(String.raw`
$ npm run lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix

…/src/api/admin/admin.controller.ts
  11:3  error  'HttpStatus' is defined but never used  @typescript-eslint/no-unused-vars
…/src/api/auth/auht.service.ts
  25:11  error  Unsafe assignment of an \`any\` value  @typescript-eslint/no-unsafe-assignment
  …

✖ 49 problems (46 errors, 3 warnings)
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 10: { id: 'n' }, 11: { id: 'k' } });
const LINT_GIT = jt(String.raw`
$ git status --short
 M src/api/admin/admin.service.ts
 M src/api/app.module.ts
 M src/main.ts
 …  (jami 14 fayl + package-lock.json)`, { 1: { id: 'g' } });
const LINT_NOFIX = jt(String.raw`
$ npx eslint "{src,apps,libs,test}/**/*.ts"
✖ 120 problems (116 errors, 4 warnings)
[chiqish kodi: 1]`);
const S15 = mkS(15, [{ v: 'lenta' }, { v: 'out' }, { v: 'git' }, { v: 'git', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'lenta' && <Lenta hl={['lint']} />}
    {seg.v === 'out' && <Term er lines={LINT_OUT} focus={['n', 'k']} />}
    {seg.v === 'git' && <div className="pg-two">
      <Term lines={LINT_GIT} />
      <div style={{ display: 'grid', gap: 10 }}><div className="mk-tag" style={{ margin: 0 }}>--fix siz (o'zgartirmasdan)</div><Term er lines={LINT_NOFIX} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Bu repoda lint — <b>alohida ish</b>: avval xatolar tozalanadi. Lentaga hozircha test va build.</div>}
  </div>} />;
}

// ============================================================
//  16 · Test qizil — lenta to'xtaydi (cicd1-out/08, 09)
// ============================================================
const ORDER_BAD = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price + quantity;
}`, { 2: { id: 'x' } });
const S16 = mkS(16, [{ v: 'code' }, { v: 'fail' }, { v: 'lenta' }, { v: 'fix', sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={seg.v === 'fix' ? ORDER_TS.map((l, i) => (i === 1 ? { ...l, neu: true } : l)) : ORDER_BAD} focus={seg.v === 'fix' ? [] : ['x']} /></Ide></div>
      {seg.v !== 'code' && seg.v !== 'fix' && <Term er lines={TEST_BAD} focus={['r', 'k']} />}
      {seg.v === 'fix' && <Term lines={TEST_OK} focus={['k']} />}
    </div>
    {seg.v === 'lenta' && <div className="pg-two">
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'bad', build: 'skip', deploy: 'skip' }} />
      <ActionsMaket title="Actions · sinov: buzildi" status="bad" note="lenta qizil" steps={[['Run actions/checkout@v7', 'ok'], ['Run actions/setup-node@v7', 'ok'], ['Run npm install', 'ok'], ['Run npm test', 'bad'], ['Run npm run build', 'skip']]} />
    </div>}
    {seg.v === 'fix' && <Lenta only={['install', 'test', 'build']} st={{ install: 'ok', test: 'ok', build: 'ok' }} />}
    {seg.sum && <div className="mk-rule">Qizil lenta — <b>yomon emas</b>: xato foydalanuvchidan oldin ushlandi. Tuzatib push qilingach — yana yashil.</div>}
  </div>} />;
}

// ============================================================
//  17 · YAML xatolari (cicd1-out/10; cicd1-yml/3…5)
// ============================================================
const YERR = [
  { t: 'on: once', code: 'on: once', msg: "Unexpected value 'once'", line: '(Line: 1, Col: 5)' },
  { t: "runs-on yo'q", code: 'test:\n    steps:', msg: 'Required property is missing: runs-on', line: '(Line: 4, Col: 5)' },
  { t: 'surilish', code: '    - run: npm install\n      - run: npm test', msg: 'A block sequence may not be used as an implicit map key', line: 'at line 7, column 1' },
];
const S17 = mkS(17, [{ hl: [0] }, { hl: [0, 1] }, { hl: [2] }, { hl: [0, 1, 2], sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-three">{YERR.map((e, i) => <div key={i} className={`mk-box${seg.hl.includes(i) && !seg.sum ? ' hl' : ''}`} style={{ '--c': T.accent, opacity: seg.hl.includes(i) ? 1 : 0.35 }}>
      <h4>{e.t}</h4><pre style={{ margin: '6px 0', font: `12px/1.45 ${MONO}`, whiteSpace: 'pre-wrap' }}>{e.code}</pre>
      <p style={{ fontFamily: MONO, fontSize: 12, color: T.accent }}>{e.msg}</p><p style={{ fontFamily: MONO, fontSize: 11.5, color: T.ink3, marginTop: 4 }}>{e.line}</p>
    </div>)}</div>
    <div className="mk-tag" style={{ margin: 0 }}>Xabarlar — GitHub'ning rasmiy tahlilchisidan (@actions/workflow-parser 0.3.61)</div>
    {seg.sum && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>GitHub sahifasida: <code>on: once</code> va <code>runs-on</code> — matn aynan shu. Surilish — umumiy <code>You have an error in your yaml syntax on line N</code>, va <b>N blok boshini ko'rsatishi mumkin</b> (sinov run'ida: 4-qator, xato 8-qatorda).</div>}
    {seg.sum && <div className="pg-row" style={{ borderColor: T.green }}><span>Tuzatilgan: on: push · runs-on: ubuntu-latest · «- run» bir xil surilishda</span><span className="v" style={{ fontSize: 13, color: T.green }}>✓ xato yo'q</span></div>}
    {seg.sum && <div className="mk-rule">YAML xatosida avval <b>qator raqami</b>, keyin o'sha qatorning surilishini yuqoridagi qator bilan solishtiring.</div>}
  </div>} />;
}

// ============================================================
//  18 · Tekshiruv 3 — in sync
// ============================================================
function Screen18(p) {
  const m = MDT[18];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={NPM_CI.slice(0, 4)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: shu repoda npm install ishlaydi</div>
      <Term lines={NPM_INSTALL} focus={['a']} />
    </div>} />;
}

// ============================================================
//  19 · Amaliyot 3 — GitHub'da qizil va yashil
// ============================================================
const P3 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Buzish — src/order.ts: price * quantity → price + quantity', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git commit -am "sinov: buzildi"', 'git push'], exp: "Actions'da qizil" },
  { t: "O'qish — qizil npm test qadamini oching", cmds: [], exp: 'Expected: 20000 · Received: 10002' },
  { t: 'Tuzatish — price * quantity · commit · push', cmds: ['git commit -am "tuzatildi"', 'git push'], exp: 'yashil' },
];
const P3_TROUBLE = [
  ['Lenta yashil qoldi', "o'zgarish push qilinmagan yoki order.spec.ts yo'q"],
  ['Build qadami ham qizil', "build test'dan oldin turibdi — tartib: install → test → build"],
];
const P3_PROOF = { label: '3-qadamdagi Received qiymati', placeholder: 'Received yonidagi sonni yozing', check: (v) => /^\s*10\s?002\s*$/.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 va 2 ni qo'shganda nima chiqadi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }
