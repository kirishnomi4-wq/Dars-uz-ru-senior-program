
// ============================================================
//  MENTOR KURSI · CI/CD-2 «GitHub Actions»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/cicd2-out/ (sinov repo kirishnomi4-wq/mentor-ci-sinov — haqiqiy GitHub Actions run'lari)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd2/parts/*.jsx > GithubActionsMentorLesson.jsx
//  Yordamchilar CI/CD-1 dan nusxa; Actions oynasi — GitHub API'dagi haqiqiy run ma'lumotidan chizilgan (ActionsRun, ActionsList)
// ============================================================
const LESSON_ID = 'mentor-cicd-02-actions-v1';
const LESSON_TITLE = "GitHub Actions: run, log va o'quvchi darsidagi namunalar";
const PG = { term: '#111827', termEr: '#1F1115', gh: '#1F2328' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? T.green : /\.spec\.ts$/.test(f) ? T.purple : /\.ts$/.test(f) ? T.blue : /\.json$/.test(f) ? T.yellow : null;
// O'quvchi reposining to'liq Explorer'i (M27): mavzuga aloqasiz papkalar yopiq
const REPO_BASE = ['dist/', 'node_modules/', 'src/api/', 'src/common/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', 'test/', '.env.example', 'eslint.config.mjs', 'nest-cli.json', 'package.json', 'package-lock.json', 'tsconfig.json'];
const byTree = (a, b) => {
  const A = a.split('/'), B = b.split('/');
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] === B[i]) continue;
    const ad = i < A.length - 1 || (i === A.length - 1 && a.endsWith('/')), bd = i < B.length - 1 || (i === B.length - 1 && b.endsWith('/'));
    if (ad !== bd) return ad ? -1 : 1;
    return A[i].toLowerCase() < B[i].toLowerCase() ? -1 : 1;
  }
  return A.length - B.length;
};
const tree = (...groups) => Array.from(new Set(groups.flat())).sort(byTree);
const F = { ord: 'src/order.ts', ordSpec: 'src/order.spec.ts', ci: '.github/workflows/ci.yml', pkg: 'package.json' };
const ORD_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);
const CI_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.ci]);
MKCFG.files = ORD_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['nuqta github, workflows papkasidagi yml faylida', '.github/workflows/ci.yml faylida'], ['ci yml', 'ci.yml'],
  ['actions checkout', 'actions/checkout'], ['Actions cache', 'actions/cache'], ['actions cache', 'actions/cache'], ['Setup node', 'setup-node'], ['setup node', 'setup-node'],
  ['package json', 'package.json'], ['package lock', 'package-lock'], ['node modules', 'node_modules'],
  ['ubuntu latest', 'ubuntu-latest'], ['Runs on', 'runs-on'], ['runs on', 'runs-on'], ['On once', 'on: once'], ['on once', 'on: once'], ['my laptop', 'my-laptop'],
  ['in sync', 'in sync'], ['could not read package json', 'Could not read package.json'], ['missing from lock file', 'Missing … from lock file'],
  ['process completed with exit code', 'Process completed with exit code'], ['jest not found', 'jest: not found'], ['found in cache', 'Found in cache'],
  ['fetch depth bir', 'fetch-depth: 1'], ['node version', 'node-version'], ['matrix node', 'matrix.node'], ['cache npm', 'cache: npm'], ['contents read', 'Contents: read'],
  ['environment details', 'Environment details'], ['Set up job', 'Set up job'], ['Complete job', 'Complete job'], ['nested mappings', 'Nested mappings'],
  ['run va tik chiziqdan keyingi qatorga', 'run: | dan keyingi qatorga'], ['run echo natija ikki nuqta ok', 'run: echo "Natija: ok"'],
  ['print test', "print('test')"], ['jobs ostida', 'jobs: ostida'], ['name: CI', 'name: CI'], ['git init', 'git init'],
  ['expected yigirma ming, received o\'n ming ikki', 'Expected 20000, Received 10002'], ['tests bir passed', 'Tests: 1 passed'],
];
DIGITS.unshift(["o'n oltinchi, o'n yettinchi va o'n sakkizinchi ekranlarda", '16, 17 va 18-ekranlarda'], ["ikki yuz ellik to'rt", '254'], ["yuz yigirma yetti", '127'], ["yuz yigirma sakkiz", '128'],
  ["yetti yuz ellik to'qqiz", '759'], ["yigirma sakkiz", '28'], ["yigirma uch ekran", '23 ekran'], ["Ubuntu yigirma oltiga", 'Ubuntu 26 ga'], ["Ubuntu yigirma to'rt", 'Ubuntu 24'], ['Node yigirma ikki', 'Node 22'],
  ["node yigirma ikki, npm o'n", 'node 22, npm 10'], ["o'ttiz to'rt soniya", '34 soniya'], ["qirq to'rt soniya", '44 soniya'], ["o'n olti soniya", '16 soniya'], ["o'n besh soniyada", '15 soniyada'],
  ["o'n sakkiz, yigirma, yigirma ikki", '18, 20, 22'], ["o'n sakkiz, yigirma va yigirma ikki", '18, 20 va 22'], ["test o'n sakkiz, test yigirma, test yigirma ikki", 'test (18), test (20), test (22)'],
  ["test yigirma job'ini", "test (20) job'ini"], ["yigirma va yigirma ikki", '20 va 22'], ["Node yigirma eskirgan", 'Node 20 eskirgan'], ['yigirma ikki', '22'],
  ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'], ["O'n birinchi satr", '11-satr'], ["nol soniyada", '0 soniyada'], ['kod bir', 'kod 1'], ["exit bir", 'exit 1'], ["o'n daqiqadan", '10 daqiqadan']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /process completed with exit code/gi, /could not read package json/gi, /missing from lock file/gi, /found in cache/gi, /jest not found/gi,
  /environment details/gi, /nested mappings/gi, /set up job/gi, /complete job/gi, /fetch depth/gi, /contents read/gi, /in sync/gi, /runner/gi,
);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const JS_KW = /^(const|let|await|new|async|return|true|false|null|require)$/;
function jsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += JS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const js = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jsLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };

const TS_KW = /^(import|from|export|function|return|const|let|describe|it|expect|number|string|boolean|true|false|null|undefined|if|throw|new|typeof|as|any)$/;
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^(toBe|toEqual|toThrow)$/.test(id) ? `<span class="d">${id}</span>` : /^(Error|Number)$/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// YAML (ci.yml) rang beruvchi: kalit — binafsha, qiymat — yashil, izoh — kulrang, «- » ro'yxat belgisi
function yamlLine(src) {
  const m = /^(\s*)(- )?([\w-]+)(:)(.*)$/.exec(src);
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
const yml = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: yamlLine(l), ...(meta[i + 1] || {}) }));
// Terminal: npm/jest/eslint chiqishlari. Kod satrlari (N |) birinchi; PASS/✓/UCHIRISH yashil; xato qizil
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l) || /^\s+\|\s+\^/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*\d+ \|/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*at /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\[chiqish kodi: [1-9]\d*\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$|^UCHIRISH$|^added \d+ packages/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Expected:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/warning|WARN/.test(l) && !/error/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|No tests found|✖|XATO/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^>|^Snapshots|^Time|^Ran all|^---|^#|^\s*expect\(received\)|^In |files checked|testMatch|testPath|testRegex|Pattern|Run with/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Lenta chizig'i — o'quvchi darsidagi besh nuqta (m4c-01): holat — 'ok' | 'bad' | 'off' | 'skip' | undefined
const LENTA = [
  { k: 'install', ic: '1', n: "Yig'ish", c: 'npm install' },
  { k: 'test', ic: '2', n: 'Skaner', c: 'npm test' },
  { k: 'lint', ic: '3', n: "O'lcham ramkasi", c: 'eslint .' },
  { k: 'build', ic: '4', n: "O'rash", c: 'npm run build' },
  { k: 'deploy', ic: '5', n: 'Uchirish', c: 'deploy' },
];
const LENTA_ST = { ok: '✓ yashil', bad: '✗ qizil', skip: '— yurmadi', off: "— lentada yo'q" };
function Lenta({ st = {}, hl = [], only }) {
  const items = only ? LENTA.filter((x) => only.includes(x.k)) : LENTA;
  return <div className="c1-lenta" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
    {items.map((x) => <div key={x.k} className={`${st[x.k] || ''}${hl.includes(x.k) ? ' hl' : ''}`}>
      <span className="ic">{x.ic}</span><b>{x.n}</b><code>{x.c}</code>
      {st[x.k] && <small>{LENTA_ST[st[x.k]]}</small>}
    </div>)}
  </div>;
}
// GitHub Actions oynalari — sinov reposidagi HAQIQIY run'lar ma'lumotidan (gh api: runs, jobs, steps, log). Skrinshot emas: maket,
// lekin har nom, holat, vaqt va log satri — cicd2-out/ dagi o'sha run'dan. Pastki yozuv qaysi run ekanini aytadi.
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
// Actions bo'limi: run'lar ro'yxati (qator ko'rinishi — runlar-royxati-skrinshot.png ga moslangan). rows: [{ st, title, wf, n, sha, br, ago, dur, hl }]
function ActionsList({ rows = [], src }) {
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">mentor-ci-sinov · Actions</span><span className="src">{src}</span></div>
    <div className="lst">
      {rows.map((r, i) => <div key={i} className={`row ${r.st}${r.hl ? ' hl' : ''}${r.dim ? ' dim' : ''}`}>
        <span className="dot">{GH_ST[r.st]}</span>
        <span className="tl"><b>{r.title}</b><small>{r.wf} #{r.n}: Commit {r.sha} pushed by kirishnomi4-wq</small></span>
        <span className="brn">{r.br}</span>
        <span className="tm"><small>{r.ago}</small><small>{r.dur}</small></span>
      </div>)}
    </div>
  </div>;
}
// Bitta run sahifasi: chapda job'lar, o'ngda tanlangan job qadamlari; open — log ochilgan qadam (lines — haqiqiy log satrlari)
function ActionsRun({ run = {}, jobs = [], steps = [], open, lines = [], ann, src, hlStep, empty }) {
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{run.title}</span><span className="src">{src}</span></div>
    <div className="hd"><span className={`dot ${run.st}`}>{GH_ST[run.st]}</span><b>{run.wf} #{run.n}</b><span>{run.br} · {run.sha}</span><span className="du">{run.dur}</span></div>
    {ann && <div className={`ann${ann.k === 'notice' ? ' nt' : ann.k === 'warning' ? ' wr' : ''}`}><b>{ann.t}</b><span>{ann.m}</span></div>}
    {empty ? <div className="empty">{empty}</div> : <div className="rb">
      <div className="jobs">{jobs.map((j, i) => <div key={i} className={`jb ${j.st}${j.on ? ' on' : ''}`}><span className="dot">{GH_ST[j.st]}</span>{j.name}<small>{j.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{du}</small>
          {open === i && lines.length > 0 && <pre className="log">{lines.map((l, k) => <span key={k} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}

// CI/CD-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
/* ogohlantirish qutisi — Nest-2 dagi bilan bir xil (u bo'lak bu darsga kirmaydi) */
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
.pg-row{display:flex;gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};font:13px ${MONO};transition:opacity .3s,border-color .3s,background .3s}
.pg-row.hl{border-color:${T.accent};background:#FFF7F3}
.pg-row .v{margin-left:auto;font-weight:800;font-size:16px}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
/* Xulosa qadamida tor ekranda (1280) kod oynasi yashiriladi — xulosa ko'rinib tursin */
@media (max-width:1300px){.j2-wide-only{display:none}}
/* Lenta chizig'i — besh nuqta */
.c1-lenta{display:grid;gap:8px}
.c1-lenta>div{border:1.5px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 8px;text-align:center;transition:opacity .3s,border-color .3s,background .3s}
.c1-lenta .ic{display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font:700 12px ${MONO};color:#fff;background:${T.ink3}}
.c1-lenta .ok .ic{background:${T.green}}
.c1-lenta .bad .ic{background:${T.accent}}
.c1-lenta b{display:block;font-size:13.5px;margin-top:4px;color:${T.ink}}
.c1-lenta code{display:inline-block;font:12px ${MONO};margin-top:4px;color:${T.ink2}}
.c1-lenta small{display:block;font:600 11.5px ${SANS};margin-top:4px}
.c1-lenta .ok{border-color:${T.green};background:#E3F5EC}
.c1-lenta .ok small{color:${T.green}}
.c1-lenta .bad{border-color:${T.accent};background:#FFF0EB}
.c1-lenta .bad small{color:${T.accent}}
.c1-lenta .skip,.c1-lenta .off{opacity:.45}
.c1-lenta .hl{box-shadow:0 0 0 3px rgba(226,69,31,.18);border-color:${T.accent}}
/* GitHub Actions oynalari (haqiqiy run ma'lumotidan) */
.c2-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:${PG.gh}}
.c2-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS}}
.c2-gh .bar .lg{font-weight:800}
.c2-gh .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:#57606A;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 7px}
.c2-gh .dot{display:inline-flex;flex:none;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c2-gh .ok>.dot,.c2-gh .dot.ok{background:#1A7F37}
.c2-gh .bad>.dot,.c2-gh .dot.bad{background:#CF222E}
.c2-gh .wait>.dot,.c2-gh .dot.wait{background:#BF8700}
.c2-gh .lst{display:grid}
/* umumiy .ok/.bad rangi bu yerda matnga o'tmasin — faqat belgi (dot) rangli */
.c2-gh .row.ok,.c2-gh .row.bad,.c2-gh .row.skip,.c2-gh .row.wait,.c2-gh .row.off,.c2-gh .jb.ok,.c2-gh .jb.bad,.c2-gh .jb.wait{color:#1F2328}
.c2-gh .st.ok,.c2-gh .st.bad,.c2-gh .st.wait{color:#E6EDF3}
.c2-gh .st.skip,.c2-gh .st.off{color:#8B949E}
.c2-gh .row{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid #EAEEF2;transition:opacity .3s,background .3s}
.c2-gh .row.hl{background:#FFF8C5}
.c2-gh .row .tl{display:grid;gap:2px;min-width:0}
.c2-gh .row .tl b{font:600 14px ${SANS};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .row small{font:12px ${SANS};color:#57606A}
.c2-gh .row .brn{flex:none;font:12px ${MONO};color:#0969DA;background:#DDF4FF;border-radius:6px;padding:2px 7px}
.c2-gh .row .tm{margin-left:auto;display:grid;text-align:right;gap:2px;white-space:nowrap}
.c2-gh .hd{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid #EAEEF2;font:13px ${SANS}}
.c2-gh .hd b{font-size:15px}
.c2-gh .hd .du{margin-left:auto;color:#57606A}
.c2-gh .ann{margin:8px 12px 0;padding:8px 10px;border:1px solid #FFCECB;background:#FFEBE9;border-radius:6px;font:12.5px ${MONO};display:grid;gap:3px}
.c2-gh .ann b{font:700 12.5px ${SANS};color:#CF222E}
.c2-gh .ann.nt{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.nt b{color:#9A6700}
.c2-gh .ann.wr{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.wr b{color:#9A6700}
.c2-gh .empty{padding:18px 14px;font:13px ${SANS};color:#57606A;background:#F6F8FA}
.c2-gh .row.dim,.c2-gh .st.dim{opacity:.4}
.c2-grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.c2-grid4{grid-template-columns:1fr 1fr}}
.c2-mk{border-radius:12px;border:1px solid ${T.line};background:${T.paper};padding:12px 14px}
.c2-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};transition:opacity .3s,border-color .3s,background .3s}
.c2-code.hl{border-color:${T.accent};background:#FFF7F3}
.c2-code .n{font:800 22px ${MONO};color:${T.accent};text-align:center}
.c2-code .t{display:grid;gap:2px;font-size:13px}
.c2-code .t code{font:12px ${MONO};color:${T.ink2};overflow-wrap:anywhere}
.c2-gh .rb{display:grid;grid-template-columns:150px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA}
.c2-gh .jb small{margin-left:auto;font:11px ${SANS};color:#57606A}
.c2-gh .steps{padding:8px 10px;display:grid;gap:2px;background:#0D1117;color:#E6EDF3;min-width:0}
.c2-gh .st{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:8px;align-items:center;padding:4px 4px;border-radius:6px;font:13px ${MONO}}
.c2-gh .st small{color:#8B949E;font:12px ${MONO}}
.c2-gh .st.skip .nm,.c2-gh .st.off .nm{color:#8B949E}
.c2-gh .st.hl{background:#30363D}
.c2-gh .st .log{grid-column:2/4;margin:4px 0 6px;padding:8px 10px;background:#161B22;border-radius:6px;font:12px/1.5 ${MONO};white-space:pre-wrap;overflow-wrap:anywhere;color:#C9D1D9}
.c2-gh .log .er{color:#FF7B72}
.c2-gh .log .ok{color:#7EE787}
.c2-gh .log .cm{color:#8B949E}
.c2-gh .log .wn{color:#E3B341}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
