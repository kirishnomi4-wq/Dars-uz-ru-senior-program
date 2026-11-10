// ============================================================
//  10 · Checkout'siz va tartib xato (cicd2-out/13, 24, 26)
// ============================================================
const LOG_NOCO = lg(String.raw`
npm error code ENOENT
npm error syscall open
npm error path /home/runner/work/mentor-ci-sinov/mentor-ci-sinov/package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
##[error]Process completed with exit code 254.`);
const LOG_ORDER = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
sh: 1: jest: not found
##[error]Process completed with exit code 127.`);
const S10 = mkS(10, [{ v: 'noco', open: 2 }, { v: 'noco', open: 2, path: true }, { v: 'order', open: 3 }, { v: 'fix', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'noco' && <RunView k="13" open={seg.open} lines={LOG_NOCO} hlStep={seg.open} />}
    {seg.path && <div className="pg-row hl" style={{ animation: 'mk-up .4s ease both' }}><span>/home/runner/work/mentor-ci-sinov/mentor-ci-sinov</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>ish papkasi · checkout'siz bo'sh</span></div>}
    {seg.v === 'order' && <RunView k="24" open={seg.open} lines={LOG_ORDER} hlStep={[3, 4, 5]} />}
    {seg.v === 'fix' && <div className="pg-two">
      <RunView k="26" hlStep={[1, 2, 3, 4, 5]} steps={RUNS['26'].jobs[0].steps.filter((s) => !/^(Post |Complete job)/.test(s[0]))} />
    </div>}
    {seg.sum && <div className="mk-rule">Tartib: <b>checkout → setup-node → npm install → npm test → build</b>.</div>}
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (11-satr = 10) · run 24
// ============================================================
const YML_ORDER = yml(String.raw`
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
      - run: npm test
      - run: npm install
      - run: npm run build`);
const LC11_FIXED = YML_ORDER.map((l, i) => ({ ...l, n: i + 1, ...(i === 10 ? { gone: true } : {}) }));
LC11_FIXED.splice(12, 0, { h: yamlLine('      - run: npm test'), n: 12, neu: true });
const LC11_EXTRA = lg(['Set up job', 'Run actions/checkout@v7', 'Run actions/setup-node@v7', 'Run npm install', 'Run npm test', 'Run npm run build'].map((n) => { const s = RUNS['26'].jobs[0].steps.find((x) => x[0] === n); return `✓ ${n}  ${s ? s[2] : ''}`; }).join('\n'));
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ci} lines={YML_ORDER} target={10}
    tree={{ root: MKCFG.root, files: CI_FILES, active: F.ci }}
    fixed={LC11_FIXED} fixedExtra={[{ file: `Actions · run #${RUNS['26'].n} (haqiqiy) — ✓ ${RUNS['26'].dur}`, lines: LC11_EXTRA.map((l) => ({ h: `<span class="ok">${escH(l.t)}</span>` })) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — tartibni buzish va kod
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: "Buzish — ci.yml: «- run: npm test» qatorini «- run: npm install» dan oldinga", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git commit -am "sinov: tartib"', 'git push'], exp: "Actions'da qizil" },
  { t: "O'qish — qizil Run npm test qadami va izoh", cmds: [], exp: 'jest: not found va kod' },
  { t: 'Tuzatish — tartibni tiklang · commit · push', cmds: ['git commit -am "tartib tiklandi"', 'git push'], exp: 'yashil' },
];
const P2_TROUBLE = [
  ['Run yashil qoldi', "o'zgarish push qilinmagan yoki npm test qatori hali ham npm install'dan keyin"],
  ["Kod 1, jest: not found emas", "testlar yiqildi — avvalgi buzish tuzatilmagan (Expected / Received ni o'qing)"],
  ['Run umuman boshlanmadi', "qator ko'chirilganda surilish buzilgan (13-ekran)"],
];
const P2_PROOF = { label: "3-qadamdagi chiqish kodi (izohdagi son)", placeholder: 'izohdagi sonni yozing', check: (v) => /^\s*127\s*$/.test(v), wrong: "Run sahifasidagi izoh: «Process completed with exit code …» — oxiridagi son" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  13 · Fayl xatosi: run darhol qizil (cicd2-out/30–32, 34, 05; tuzatish — 61)
// ============================================================
// GitHub izohlari — run #16–#19 sahifalari skrinshotlaridan (cicd2-out/30, 31, 32, 34-actions-sahifa-skrinshot.png); tahlilchi — cicd2-out/07
const YERR13 = [
  { k: '30', t: 'on: once', code: 'on: once', msg: "(Line: 2, Col: 5): Unexpected value 'once'", gh: "#L1 · (Line: 2, Col: 5): Unexpected value 'once'", same: true },
  { k: '31', t: "runs-on yo'q", code: '  test:\n    steps:', msg: '(Line: 5, Col: 5): Required property is missing: runs-on', gh: '#L1 · (Line: 5, Col: 5): Required property is missing: runs-on', same: true },
  { k: '32', t: 'surilish', code: '      - uses: actions/checkout@v7\n    - run: npm test', msg: 'A block sequence may not be used as an implicit map key at line 8', gh: '#L4 · You have an error in your yaml syntax on line 4' },
  { k: '34', t: "echo ichida «: »", code: '      - run: echo "Natija: ok"', msg: 'Nested mappings are not allowed in compact mappings at line 8', gh: '#L8 · You have an error in your yaml syntax on line 8' },
];
const YML_BLOCK = yml(String.raw`
      - run: |
          echo "Kalit: \${{ secrets.API_KEY }}"`.replace(/\\\$/g, '$'));
// run #18 (32) sahifasi — foydalanuvchi skrinshoti (cicd2-out/32-actions-sahifa-skrinshot.png): izoh aynan
const YML32 = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
    - run: npm test`, { 4: { id: 'g' }, 8: { id: 'x' } });
const ANN32 = { t: 'Annotations · 1 error', m: 'Invalid workflow file: .github/workflows/ci.yml#L4 — You have an error in your yaml syntax on line 4' };
const S13 = mkS(13, [{ hl: [0, 1, 2] }, { hl: [0, 1, 2], run: '32' }, { hl: [2], run: '32', ann: true }, { hl: [3], run: '34' }, { hl: [], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {!seg.sum && <div className="c2-grid4">{YERR13.map((e, i) => <div key={i} className={`mk-box${seg.hl.includes(i) ? ' hl' : ''}`} style={{ '--c': T.accent, opacity: seg.hl.length && !seg.hl.includes(i) ? 0.35 : 1 }}>
      <h4>{e.t} <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11.5, color: T.ink3 }}>run #{RUNS[e.k].n} · ✗ {RUNS[e.k].dur}</span></h4>
      <pre style={{ margin: '6px 0', font: `12px/1.45 ${MONO}`, whiteSpace: 'pre-wrap' }}>{e.code}</pre>
      <p style={{ fontFamily: MONO, fontSize: 11, color: T.ink3 }}>tahlilchi: {e.msg}</p>
      <p style={{ fontFamily: MONO, fontSize: 11.5, color: T.accent, marginTop: 4 }}>GitHub: {e.gh}{e.same ? ' — aynan' : ''}</p>
    </div>)}</div>}
    {seg.run && !seg.ann && <RunView k={seg.run} ann={null} />}
    {seg.run && !seg.ann && <div className="mk-tag" style={{ margin: 0 }}>{`Run #${RUNS[seg.run].n} sahifasida (skrinshot): «This workflow graph cannot be shown» · Total duration – · Annotations: Invalid workflow file`}</div>}
    {seg.ann && <div className="pg-two">
      <CodePanel file=".github/workflows/ci.yml (run #18)" lines={YML32} focus={['g', 'x']} />
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <RunView k="32" ann={ANN32} />
        <div className="pg-row"><span>GitHub izohi</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>4-qator · test:</span></div>
        <div className="pg-row hl"><span>Tahlilchi (at line 8, column 1)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>8-qator · - run: npm test</span></div>
        <div className="mk-tag" style={{ margin: 0 }}>Izoh — run #18 sahifasining skrinshotidan (01.11 19:27) · #16, #17 da matn tahlilchi bilan aynan</div>
      </div>
    </div>}
    {seg.sum && <div className="pg-two">
      <CodePanel file="ci.yml — tuzatilgan (run: |)" lines={YML_BLOCK} />
      <RunView k="61" hlStep={1} />
    </div>}
    {seg.sum && <div className="mk-rule">Qadamsiz qizil run — <b>fayl xatosi</b>. Ikki nuqtali buyruq — <code>run: |</code> dan keyingi qatorda.</div>}
  </div>} />;
}

// ============================================================
//  14 · Run yo'q yoki cheksiz kutadi (cicd2-out/18, 33, 26)
// ============================================================
const OUT18 = jt(String.raw`
$ find .github -type f
.github/workflow/ci.yml
$ gh run list --commit 75260e4     # push'dan 90 s keyin
(soni: 0)`, { 2: { id: 'p' }, 4: { id: 'z' } });
// 33 — runlar-api.tsv: #20 «yaml: runs-on my-laptop», cancelled (qadamlar yo'q, shuning uchun RUNS da emas)
const RUNS33 = { n: 20 };
const WAIT33 = [['20 s', 'queued'], ['60 s', 'queued'], ['180 s', 'queued'], ['bekor qilindi', 'cancelled']];
const S14 = mkS(14, [{ v: 'none' }, { v: 'none', f: ['p', 'z'] }, { v: 'wait' }, { v: 'fix', sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'none' && <Term title="terminal · .github/workflow (s yo'q)" lines={OUT18} focus={seg.f || []} />}
    {seg.v === 'wait' && <div className="c2-mk" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="mk-tag">runs-on: my-laptop · run #{RUNS33.n} · job test · labels=my-laptop</div>
      <div style={{ display: 'grid', gap: 6 }}>{WAIT33.map(([a, b], i) => <div key={i} className="pg-row"><span>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 14, color: b === 'queued' ? T.yellow : T.ink3 }}>{b === 'queued' ? '● queued — kutmoqda' : '○ cancelled'}</span></div>)}</div>
    </div>}
    {seg.v === 'fix' && <ActionsList rows={runRows(['26'], ['26'])} src={runSrc('26')} />}
    {seg.sum && <div className="pg-two">
      <div className="pg-row"><span>run yo'q</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>.github/workflows</span></div>
      <div className="pg-row"><span>sariq, kutmoqda</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>runs-on: ubuntu-latest</span></div>
    </div>}
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — sariq run
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: runs-on: my-laptop — 180 s dan keyin ham queued</div>
      <div className="pg-row"><span>runs-on: my-laptop</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>● queued</span></div>
      <div className="pg-row" style={{ borderColor: T.green }}><span>runs-on: ubuntu-latest</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.green }}>✓ run #{RUNS['26'].n}</span></div>
    </div>} />;
}

// ============================================================
//  16 · matrix (cicd2-out/40, 41)
// ============================================================
const YML_MX_BAD = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
      - run: npm test`, { 3: { id: 'm' }, 4: { id: 'm' }, 5: { id: 'm' }, 9: { id: 's' } });
const YML_MX_OK = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: \${{ matrix.node }}
      - run: npm test`.replace(/\\\$/g, '$'), { 10: { id: 's', neu: true }, 11: { id: 's', neu: true } });
const MX_V = { '40': { 'test (18)': 'v22.23.4', 'test (20)': 'v22.23.4', 'test (22)': 'v22.23.4' }, '41': { 'test (18)': 'v18.20.8', 'test (20)': 'v20.20.2', 'test (22)': 'v22.23.4' } };
function MatrixJobs({ k, ver }) {
  const jobs = [...RUNS[k].jobs].sort((a, b) => a.name.localeCompare(b.name));
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{RUNS[k].title}</span><span className="src">{runSrc(k)}</span></div>
    <div className="lst">{jobs.map((j) => <div key={j.name} className={`row ${j.st}`}><span className="dot">{GH_ST[j.st]}</span><span className="tl"><b>{j.name}</b><small>{j.dur}</small></span>
      {ver && <span className="tm"><b style={{ font: `700 14px ${MONO}`, color: MX_V[k][j.name] === 'v22.23.4' && k === '40' ? '#CF222E' : '#1A7F37' }}>node --version → {MX_V[k][j.name]}</b></span>}
    </div>)}</div>
  </div>;
}
const S16 = mkS(16, [{ k: '40', f: ['m'] }, { k: '40' }, { k: '40', ver: true, f: ['s'] }, { k: '41', ver: true, sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className={seg.sum ? 'j2-wide-only' : ''}><CodePanel file={seg.k === '41' ? 'ci.yml — ulangan' : "ci.yml — o'quvchi darsi (s13)"} lines={seg.k === '41' ? YML_MX_OK : YML_MX_BAD} focus={seg.f || []} /></div>
      {seg.f && seg.f[0] === 'm' && !seg.ver ? <div className="mk-tag" style={{ margin: 0 }}>Push qilinadi →</div> : <MatrixJobs k={seg.k} ver={seg.ver} />}
    </div>
    {seg.sum && <div className="mk-rule">Matrix ishlashi uchun — <code>node-version: {'${{ matrix.node }}'}</code>. Tekshiruv — <b>logdagi versiya</b>, yashil belgi emas.</div>}
  </div>} />;
}

// ============================================================
//  17 · cache (cicd2-out/50–53)
// ============================================================
const YML_CACHE_BAD = yml(String.raw`
      - uses: actions/cache@v4
        with:
          path: node_modules`, { 1: { id: 'c' }, 2: { id: 'c' }, 3: { id: 'c' } });
const YML_CACHE_OK = yml(String.raw`
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm`, { 4: { id: 'c', neu: true } });
const LOG_CACHE_BAD = lg(String.raw`
with:
  path: node_modules
##[error]Input required and not supplied: key`);
const MEASURE17 = [['51', "cache'siz", '44 s', '52 s', ''], ['52', 'cache: npm · 1-run', '45 s', '58 s', 'oxirida «Cache saved»'], ['53', 'cache: npm · 2-run', '16 s', '30 s', '«Cache restored» · ~57 MB']];
const S17 = mkS(17, [{ v: 'bad' }, { v: 'bad', open: 3 }, { v: 'ok', rows: 2 }, { v: 'ok', rows: 3, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'bad' && <div className="pg-two">
      <CodePanel file="ci.yml — o'quvchi darsi (s14)" lines={YML_CACHE_BAD} focus={['c']} />
      <RunView k="50" open={seg.open} lines={LOG_CACHE_BAD} hlStep={[3, 4, 5]} ann={seg.open != null ? annOf('50') : null} />
    </div>}
    {seg.v === 'ok' && <div className="pg-two">
      <CodePanel file="ci.yml — tavsiya" lines={YML_CACHE_OK} focus={['c']} />
      <div className="c2-mk">
        <div className="mk-tag">O'quvchi reposi · npm install (759 paket) · haqiqiy run'lar</div>
        <div style={{ display: 'grid', gap: 6 }}>{MEASURE17.slice(0, seg.rows).map(([k, a, b, c, d]) => <div key={k} className={`pg-row${k === '53' ? ' hl' : ''}`} style={{ animation: 'mk-up .4s ease both' }}>
          <span>#{RUNS[k].n} {a}</span><span style={{ color: T.ink3, fontSize: 11.5 }}>{d}</span><span className="v" style={{ fontSize: 14, color: k === '53' ? T.green : T.ink }}>{b} · job {c}</span>
        </div>)}</div>
      </div>
    </div>}
    {seg.sum && <div className="mk-rule">Kesh <b>ikkinchi run'dan</b> ishlaydi: o'rnatish 44 → 16 s (taxminan 2,8 baravar), «5 baravar» emas.</div>}
  </div>} />;
}

// ============================================================
//  18 · secrets (cicd2-out/60, 61)
// ============================================================
const LOG61 = {
  1: lg('Kalit: ***'),
  2: lg("env:\n  API_KEY: ***\nUzunligi: 25\nBo'lib yozilsa: sk_test _mentor_sinov_7f3a"),
  3: lg("Yo'q secret: []"),
};
const S18 = mkS(18, [{ open: null }, { open: 1 }, { open: 2, also: 3 }, { open: null, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.open == null && !seg.sum && <div className="c2-mk">
      <div className="mk-tag">Repoga secret qo'yildi (sinov qiymati, 25 belgi)</div>
      <Term lines={jt('$ gh secret set API_KEY -R kirishnomi4-wq/mentor-ci-sinov\n$ gh secret list\nAPI_KEY   2026-11-01T13:40:56Z')} />
      <div className="mk-tag" style={{ margin: '8px 0 0' }}>Repo sahifasida: Settings → Secrets and variables → Actions (⚠ GitHub hujjatidan)</div>
    </div>}
    {seg.open != null && <RunView k="61" open={seg.open} lines={LOG61[seg.open]} hlStep={seg.also ? [seg.open, seg.also] : seg.open} />}
    {seg.also && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>Bo'laklab chiqarilgan kalit — <b>logda to'liq ochiq</b>. Yozilmagan secret — bo'sh qator: <code>{"Yo'q secret: []"}</code>, run yashil.</div>}
    {seg.sum && <RunView k="61" />}
    {seg.sum && <div className="mk-rule">Secret'ni <b>logga umuman chiqarmang</b>: <code>***</code> faqat aynan qiymatni yashiradi.</div>}
  </div>} />;
}

// ============================================================
//  19 · Amaliyot 3 — matrix'ni ulash (cicd2-out/41)
// ============================================================
const YML_P3 = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: \${{ matrix.node }}
      - run: node --version
      - run: npm install
      - run: npm test`.replace(/\\\$/g, '$'));
const P3 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'matrix — job ichida strategy: matrix: node: [20, 22]', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ulash — setup-node: node-version: ${{ matrix.node }}', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push — setup-node dan keyin - run: node --version', cmds: ['git commit -am "ci: matrix"', 'git push'], exp: 'ikki job: test (20), test (22)' },
  { t: 'Log — test (20) → Run node --version', cmds: [], exp: 'v20.…' },
];
const P3_CODE = [{ file: F.ci, step: 0, lines: YML_P3, copy: false }];
const P3_TROUBLE = [
  ["Ikkala job'da ham v22…", "node-version qatori yo'q yoki matrix.node yozilmagan (16-ekran)"],
  ["Job bitta, nomida son yo'q", "strategy job ichida emas — surilishni tekshiring"],
  ['Run qadamsiz qizil', 'fayl xatosi, surilish (13-ekran)'],
];
const P3_PROOF = { label: "test (20) job'idagi node --version natijasi", placeholder: 'versiyani yozing', check: (v) => /^\s*v20\.\d+\.\d+\s*$/.test(v), wrong: "test (20) job'ini oching, Run node --version qadamidagi v bilan boshlanadigan satr" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={CI_FILES} />; }
