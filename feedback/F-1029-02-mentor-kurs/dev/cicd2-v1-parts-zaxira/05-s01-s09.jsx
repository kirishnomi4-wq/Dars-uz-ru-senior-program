// ============================================================
//  Umumiy: Actions oynalari RUNS (04-runlar.gen.jsx) dan; log satrlari — cicd2-out/NN-*.txt dan aynan
// ============================================================
// UTC → Toshkent (+05:00), «01.11 18:20»
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const runRows = (keys, hl = [], dim = []) => keys.map((k) => { const r = RUNS[k]; return { st: r.st, title: r.title, wf: 'CI', n: r.n, sha: r.sha, br: r.br, ago: hhmm(r.at), dur: r.dur, hl: hl.includes(k), dim: dim.includes(k) }; });
const runSrc = (...ks) => `haqiqiy run ma'lumotidan · run #${ks.map((k) => RUNS[k].n).join(', #')}`;
const annOf = (k) => { const a = (RUNS[k].ann || []).find(([lv]) => lv === 'failure'); return a ? { t: 'Annotations · test', m: a[1] } : null; };
// Log satri rangi: xato — qizil, o'tdi — yashil, xizmat satri — kulrang
const lg = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((t) => ({ t,
  c: /Expected:/.test(t) ? 'ok' : /error|FAIL|✕|Received:|not found|fatal|syntax error|failed|Missing:/.test(t) ? 'er' : /PASS|✓|passed|^added \d+|restored|Cache hit|Cache saved/.test(t) ? 'ok' : /warning|deprecated|migrate/.test(t) ? 'wn' : /^>|^\s*with:|^\s{2}[\w-]+: |^Download|^Image|^Version|^Operating|^Ubuntu|^GITHUB_TOKEN|^Contents|^\[command\]/.test(t) ? 'cm' : '' }));
function RunView({ k, job = 0, open, lines, hlStep, ann, steps }) {
  const r = RUNS[k]; const j = r.jobs[job];
  return <ActionsRun run={{ title: r.title, st: r.st, wf: 'CI', n: r.n, br: r.br, sha: r.sha, dur: r.dur }}
    jobs={r.jobs.map((x, i) => ({ name: x.name, st: x.st, dur: x.dur, on: i === job }))}
    steps={steps || (j ? j.steps : [])} open={open} lines={lines} ann={ann === undefined ? annOf(k) : ann} src={runSrc(k)} hlStep={hlStep}
    empty={!r.jobs.length ? "Job yo'q · qadam yo'q · log yo'q — fayl o'qilmadi" : null} />;
}
const MAIN7 = ['26', '25', '24', '23', '22', '21', '20'];
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
      - run: npm run build`, { 1: { id: 'nm' }, 3: { id: 'jb' }, 4: { id: 'jb' }, 7: { id: 'us' }, 8: { id: 'us' }, 9: { id: 'us' }, 10: { id: 'us' }, 11: { id: 'rn' }, 12: { id: 'rn' }, 13: { id: 'rn' } });
const LOG_TEST_BAD = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
FAIL src/order.spec.ts
  orderTotal
    ✕ 2 kitob narxini hisoblaydi (4 ms)
  ● orderTotal › 2 kitob narxini hisoblaydi
    Expected: 20000
    Received: 10002
Tests:       1 failed, 1 total
##[error]Process completed with exit code 1.`);
const LOG_TEST_OK = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (3 ms)
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total`);

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Actions oynasi', "Qizilni o'qish", 'Fayl xatolari', "O'quvchi darsidagi namunalar", "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>O'quvchi reposining nusxasi GitHub'da — «main» tarmog'idagi 7 run</div>
    <ActionsList rows={runRows(MAIN7)} src={runSrc('20', '26').replace(', #', '–#')} /></>}
  </div>} />;
}

// ============================================================
//  2 · Actions oynasi: run ro'yxati (runlar-api.tsv)
// ============================================================
const S2 = mkS(2, [{ hl: ['26'] }, { hl: ['20'], name: true }, { hl: ['21', '23', '24'] }, { hl: ['21', '22'], sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <ActionsList rows={runRows(MAIN7, seg.hl)} src={runSrc('20', '26').replace(', #', '–#')} />
    {seg.name && <div className="c2-mk" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="pg-row"><span>«ci: lenta (CI/CD-1 tavsiya)»</span><span style={{ color: T.ink3 }}>→</span><span>commit xabari: <code>git commit -m "…"</code></span></div>
      <div className="pg-row" style={{ marginTop: 6 }}><span>CI #1: Commit adfcfbf pushed by …</span><span style={{ color: T.ink3 }}>→</span><span>workflow <code>name: CI</code> · run raqami · commit · kim push qilgan</span></div>
      <div className="pg-row" style={{ marginTop: 6 }}><span>main</span><span style={{ color: T.ink3 }}>→</span><span>tarmoq (o'ngdagi belgi)</span></div>
    </div>}
    {seg.sum && <div className="mk-rule">Har push — <b>bitta run</b>, tarix saqlanadi: #2 qizil → #3 yashil — xato topildi va tuzatildi.</div>}
  </div>} />;
}

// ============================================================
//  3 · Run → job → step (cicd2-out/20)
// ============================================================
const S3 = mkS(3, [{ f: ['jb'], hs: [] }, { f: ['us', 'rn'], hs: [1, 2, 3, 4, 5] }, { f: [], hs: [0, 6, 7, 8] }, { f: [], hs: [], sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      {!seg.sum && <Ide files={CI_FILES} active={F.ci}><CodePanel file={F.ci} lines={YML_OK} focus={seg.f} /></Ide>}
      <RunView k="20" hlStep={seg.hs} />
    </div>
    {seg.sum && <div className="pg-three" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="mk-box" style={{ '--c': T.green }}><h4>yo'l xaritasi</h4><p><code>.github/workflows/ci.yml</code></p></div>
      <div className="mk-box" style={{ '--c': T.blue }}><h4>nuqta</h4><p>job — <code>test</code></p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>amal</h4><p>qadam (step) — <code>Run npm test</code></p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  4 · uses ichida: Set up job, checkout, setup-node logi (cicd2-out/20)
// ============================================================
const LOG_SETUP = lg(String.raw`
Operating System: Ubuntu 24.04.5 LTS
Image: ubuntu-24.04 · Version: 20261025.353.1
GITHUB_TOKEN Permissions: Contents: read
Download action repository 'actions/checkout@v7' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)
Download action repository 'actions/setup-node@v7' (SHA:949feb2413d6458794dcd2491c4babbbce0c15c1)`);
const LOG_CHECKOUT = lg(String.raw`
with:
  repository: kirishnomi4-wq/mentor-ci-sinov
  fetch-depth: 1
Deleting the contents of '/home/runner/work/mentor-ci-sinov/mentor-ci-sinov'
[command]/usr/bin/git init /home/runner/work/mentor-ci-sinov/mentor-ci-sinov
[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +adfcfbf…:refs/remotes/origin/main
[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main
Switched to a new branch 'main'`);
const LOG_NODE = lg(String.raw`
with:
  node-version: 22
Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64
Environment details
node: v22.23.4
npm: 10.9.9`);
const S4 = mkS(4, [{ open: 0, lines: LOG_SETUP }, { open: 1, lines: LOG_CHECKOUT }, { open: 2, lines: LOG_NODE }, { sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <RunView k="20" open={seg.open} lines={seg.lines || []} hlStep={seg.open} ann={seg.sum ? { k: 'notice', t: 'Izoh (notice) · har run\'da', m: 'The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026.' } : null} />
    {seg.sum && <div className="mk-rule"><code>uses</code> — qora quti emas: <b>logini oching</b>, qadamma-qadam nima qilganini aytadi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — GitHub qo'shgan qadam
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy run #1: sariq fonda — GitHub qo'shgan qadamlar</div>
      <RunView k="20" hlStep={[0, 6, 7, 8]} />
    </div>} />;
}

// ============================================================
//  6 · Amaliyot 1 — o'z run'ingizni o'qish
// ============================================================
const P1 = mkS(6, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Run — GitHub → repo → Actions → oxirgi run', cmds: [], exp: '✓ yoki ✗ belgili qator' },
  { t: "Job — test → qadamlar ro'yxati", cmds: [], exp: 'Set up job … Complete job' },
  { t: 'Mashina — Set up job → Operating System', cmds: [], exp: 'Ubuntu 24.04.5 LTS (yoki yangiroq)' },
  { t: 'Node — Run actions/setup-node → Environment details', cmds: [], exp: 'node: v22.…' },
];
const P1_TROUBLE = [
  ["Actions'da run umuman yo'q", "fayl .github/workflows/ da emas (s harfi) yoki push qilinmagan (14-ekran)"],
  ['Run sariq, «kutmoqda»', "runs-on'da GitHub'da yo'q mashina nomi (14-ekran)"],
  ['Ubuntu 26 chiqdi', "ubuntu-latest yangilangan — GitHub eslatgan o'tish; xato emas"],
];
const P1_PROOF = { label: "setup-node logidagi node: satri", placeholder: "node satrini qo'ying", check: (v) => /^\s*node:\s*v\d+\.\d+\.\d+\s*$/.test(v), wrong: "Run actions/setup-node qadamida Environment details guruhini oching — node: bilan boshlanadigan satr" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  7 · Qizil run: qadam, log va tuzatish (cicd2-out/21, 22)
// ============================================================
const S7 = mkS(7, [{ v: 'list' }, { v: 'run', hs: [4, 5, 6] }, { v: 'log' }, { v: 'fix', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'list' && <ActionsList rows={runRows(['21', '20'], ['21'])} src={runSrc('20', '21')} />}
    {seg.v === 'run' && <RunView k="21" hlStep={seg.hs} />}
    {seg.v === 'log' && <RunView k="21" open={4} lines={LOG_TEST_BAD} hlStep={4} />}
    {seg.v === 'fix' && <RunView k="22" open={4} lines={LOG_TEST_OK} hlStep={4} />}
    {seg.sum && <div className="mk-rule">Qizil run'da: avval <b>qizil qadamni oching</b>, sababni logdan o'qing — izohda faqat kod.</div>}
  </div>} />;
}

// ============================================================
//  8 · Chiqish kodi — qaysi turdagi xato (izohlar: 21, 23, 24, 13, 16, 17)
// ============================================================
const CODES8 = [
  { n: '1', s: 'npm test', m: 'FAIL · Expected / Received', r: '21', g: 1 },
  { n: '1', s: 'npm ci', m: 'npm error code EUSAGE · in sync', r: '23', g: 1 },
  { n: '127', s: 'npm test', m: 'sh: 1: jest: not found', r: '24', g: 2 },
  { n: '254', s: 'npm install', m: 'npm error enoent Could not read package.json', r: '13', g: 2 },
  { n: '2', s: "print('test')", m: 'syntax error near unexpected token', r: '16', g: 2 },
  { n: '128', s: 'git push', m: "fatal: unable to access … 403", r: '17', g: 2 },
];
const S8 = mkS(8, [{ g: 0 }, { g: 1 }, { g: 2 }, { g: 0, sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    <div className="mk-tag" style={{ margin: 0 }}>Izoh: «Process completed with exit code N» — haqiqiy run'lardan</div>
    {CODES8.map((c, i) => <div key={i} className={`c2-code${seg.g && c.g === seg.g ? ' hl' : ''}`} style={{ opacity: seg.g && c.g !== seg.g ? 0.4 : 1 }}>
      <span className="n">{c.n}</span>
      <span className="t"><b>{c.s} <span style={{ fontWeight: 500, color: T.ink3, fontSize: 12 }}>· run #{RUNS[c.r].n}</span></b><code>{c.m}</code></span>
    </div>)}
    {seg.sum && <div className="mk-rule" style={{ animation: 'mk-up .4s ease both' }}>Formula: <b>qizil qadam → kod → logdagi birinchi error satri</b>. Kod — yo'nalish, sabab — log.</div>}
  </div>} />;
}

// ============================================================
//  9 · O'rnatish qadami qizil: npm ci (cicd2-out/23, 11, 26)
// ============================================================
const LOG_CI_SYNC = lg(String.raw`
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: @types/jsonwebtoken@9.0.10 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
npm error …
##[error]Process completed with exit code 1.`.replace(/\\`/g, '`'));
const LOG_CI_NOLOCK = lg(String.raw`
npm error code EUSAGE
npm error The \`npm ci\` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
##[error]Process completed with exit code 1.`.replace(/\\`/g, '`'));
const LOG_INSTALL_OK = lg(String.raw`
added 759 packages, and audited 760 packages in 33s`);
const S9 = mkS(9, [{ v: 'sync', open: null }, { v: 'sync', open: 3 }, { v: 'nolock' }, { v: 'fix', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'sync' && <RunView k="23" open={seg.open} lines={LOG_CI_SYNC} hlStep={3} />}
    {seg.v === 'nolock' && <><div className="mk-tag" style={{ margin: 0 }}>«Repongiz yo'qmi?» namunasi — package-lock.json yo'q</div><RunView k="11" open={3} lines={LOG_CI_NOLOCK} hlStep={3} /></>}
    {seg.v === 'fix' && <RunView k="26" open={3} lines={LOG_INSTALL_OK} hlStep={3} />}
    {seg.sum && <div className="mk-rule">O'quvchi repolarida — <b>npm install</b>. <code>npm ci</code> uchun avval lock faylni yangilab push qilish kerak.</div>}
  </div>} />;
}
