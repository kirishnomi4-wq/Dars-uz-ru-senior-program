
// ============================================================
//  MENTOR KURSI · CI/CD-1 «CI/CD nima va nega: lenta o'quvchi reposida»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/cicd1-out/ (00–12; toza clone, env -i, CI=true)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd1/parts/*.jsx > CiCdIntroMentorLesson.jsx
//  Yordamchilar Jest-2 dan nusxa + YAML rang beruvchi, lenta chizig'i, Actions oynasi (haqiqiy run qadamlaridan, cicd2-out/21)
// ============================================================
const LESSON_ID = 'mentor-cicd-01-lenta-v1';
const LESSON_TITLE = "CI/CD nima va nega: lenta o'quvchi reposida";
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
  ['nuqta github, workflows papkasidagi yml faylida', '.github/workflows/ci.yml faylida'], ['nuqta github, workflows papkasida ci yml', '.github/workflows/ci.yml'],
  ['ci yml', 'ci.yml'], ['actions checkout', 'actions/checkout'], ['Setup node', 'setup-node'], ['setup node', 'setup-node'], ['npm ci', 'npm ci'],
  ['package json', 'package.json'], ['package lock', 'package-lock'], ['node modules', 'node_modules'], ['env faylingiz', '.env faylingiz'],
  ['ubuntu latest', 'ubuntu-latest'], ['Runs on', 'runs-on'], ['runs on', 'runs-on'], ['On once', 'on: once'], ['on once', 'on: once'], ['on push', 'on: push'],
  ['in sync', 'in sync'], ['could not read package json', 'Could not read package.json'], ['no tests found, exiting with code one', 'No tests found, exiting with code 1'],
  ['order spec', 'order.spec.ts'], ['order ts', 'order.ts'], ['Nest build', 'nest build'], ['npm run lint', 'npm run lint'],
  ['Ikki ampersand', '&&'], ['ikki ampersand', '&&'], ['my laptop', 'my-laptop'], ['unexpected value', 'Unexpected value'], ['required property is missing', 'Required property is missing'],
  ['expected yigirma ming, received o\'n ming ikki', 'Expected 20000, Received 10002'], ['received qiymatini', 'Received qiymatini'],
];
DIGITS.unshift(["yetti yuz ellik to'qqiz", '759'], ["qirq olti", '46'], ["o'n to'rt", '14'], ["Ubuntu yigirma to'rt", 'Ubuntu 24.04'], ['Node yigirma ikki', 'Node 22'],
  ['yigirma ikki', '22'], ["to'qson daqiqaning o'ttizi", '90 daqiqaning 30 tasi'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'],
  ["o'n beshinchi ekran", '15-ekran'], ["o'n ikkinchi ekran", '12-ekran'], ["O'n birinchi satr", '11-satr'], ['yigirma bir ekran', '21 ekran'],
  ['chiqish kodi bir', 'chiqish kodi 1'], ['chiqish kodi nol', 'chiqish kodi 0'], ['kod bir', 'kod 1'], ["o'n marta", '10 marta']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /could not read package json/gi, /no tests found, exiting with code one/gi, /continuous integration/gi, /continuous delivery/gi, /continuous deployment/gi,
  /required property is missing/gi, /unexpected value/gi, /block sequence/gi, /implicit map key/gi, /in sync/gi, /pipeline/gi, /runner/gi,
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
// GitHub Actions oynasi — haqiqiy run qadamlaridan (01.11.2026, cicd2-out/21: nomlar va holatlar aynan)
function ActionsMaket({ title = 'Actions', steps = [], status = 'ok', note }) {
  return <div className="c1-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{title}</span><span className="warn">haqiqiy run ma'lumotidan</span></div>
    <div className="bd">
      <div className={`run ${status}`}><span className="dot">{status === 'ok' ? '✓' : status === 'bad' ? '✗' : '●'}</span><b>test</b><span className="nm">{note}</span></div>
      {steps.map(([n, s], i) => <div key={i} className={`st ${s}`}><span className="dot">{s === 'ok' ? '✓' : s === 'bad' ? '✗' : '○'}</span>{n}</div>)}
    </div>
  </div>;
}

// CI/CD-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* GitHub Actions maketi */
.c1-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden}
.c1-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS};color:${PG.gh}}
.c1-gh .bar .lg{font-weight:800}
.c1-gh .bar .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.green};background:#EAF6EE;border:1px solid #A9D9B5;border-radius:6px;padding:3px 7px}
.c1-gh .bd{padding:10px 12px;display:grid;gap:4px;font:13px ${MONO};color:${PG.gh}}
.c1-gh .run{display:flex;gap:8px;align-items:center;font:600 14px ${SANS};padding-bottom:6px;border-bottom:1px solid #EAEEF2;margin-bottom:4px}
.c1-gh .run .nm{font:400 12.5px ${SANS};color:#57606A}
.c1-gh .dot{display:inline-flex;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c1-gh .ok .dot{background:#1A7F37}
.c1-gh .bad .dot{background:#CF222E}
.c1-gh .st{display:flex;gap:8px;align-items:center;padding:2px 0;color:${PG.gh}}
.c1-gh .st.skip{color:#8C959F}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
