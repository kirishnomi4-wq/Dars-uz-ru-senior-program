// ============================================================
//  MENTOR KURSI · CI/CD-2 «GitHub Actions ichida: qizil run'dan PR'gacha» (v2, F-1104-21)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar cicd2-start (= cicd1-done) → cicd2-done (PR #1 merge: smoke job + badge)
//  Kod, yml va HAQIQIY GitHub Actions run'lari: 03b-kod.gen.jsx (dev/cicd2-kod.py — repo teglari, cicd2v2-yml, cicd1v2-out 10/11/15/18, cicd2v2-out 30–41, gh api)
//  AI tajribasi: manba/cicd2v2-ai/ (ai1 Opus · ai2 Haiku — ikkalasi services: postgres, yashil; secret ishlatmadi)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd2/parts/*.jsx > GithubActionsMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-cicd-02-actions-v1'; // M44: id o'zgarmaydi
const LESSON_TITLE = "GitHub Actions ichida: qizil run'dan PR'gacha";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', gh: '#1F2328', ci: '#1F6FEB', cd: '#B45309', yml: '#7C3AED', pg: '#336791' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? C1.yml : /\.spec\.ts$/.test(f) ? '#99425B' : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : /\.md$/.test(f) ? T.ink3 : null;
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
const F = {
  ci: '.github/workflows/ci.yml', readme: 'README.md', smoke: 'scripts/smoke.js', pkg: 'package.json', lock: 'package-lock.json',
  ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts', usr: 'src/api/user/user.service.ts',
  tg: 'src/api/telegram/telegram.service.ts', ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts', app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
};
const BASE_FILES = ['node_modules/', F.ci, F.smoke, 'src/api/app.module.ts', F.app, F.apps, 'src/api/cart/', 'src/api/catalog/', F.ord, F.ors, F.usr, F.tg, F.ph, F.phs, 'src/api/telegram/keyboards.ts', 'src/api/telegram/texts.ts', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, F.lock, F.readme];
const FILES = (...extra) => tree(BASE_FILES, extra);
MKCFG.files = FILES();
const dirOf = (f) => (f.endsWith('/') ? f.slice(0, -1) : f).split('/').slice(0, -1).join('/');
function compact(files, active) {
  const A = active ? dirOf(active) : '';
  const out = files.map((f) => {
    const d = dirOf(f);
    if (!d || d === A || A.startsWith(d + '/') || f.endsWith('/')) return f;
    const ps = d.split('/'), as = A ? A.split('/') : [];
    let k = 0; while (k < ps.length && ps[k] === as[k]) k++;
    return ps.slice(0, k + 1).join('/') + '/';
  });
  return tree(out);
}

const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) /* F-1120-02 (M52): act */ };
};
const SPOKEN = [
  ['set up job', 'Set up job'], ['post run', 'Post Run'], ['complete job', 'Complete job'], ['initialize containers', 'Initialize containers'], ['stop containers', 'Stop containers'],
  ['npx tsc no emit', 'npx tsc --noEmit'], ['npm si ay', 'npm ci'], ['ci yml', 'ci.yml'], ['package lock json', 'package-lock.json'], ['package json', 'package.json'], ['smoke js', 'smoke.js'],
  ['setup node', 'setup-node'], ['node version', 'node-version'], ['fail fast false', 'fail-fast: false'], ['fail fast', 'fail-fast'], ['matrix node version', 'matrix.node-version'],
  ['git fetch depth bir', 'git fetch --depth=1'], ['fetch depth bir', 'fetch --depth=1'], ['git init', 'git init'], ['found in cache', 'Found in cache'], ['cache saved with the key', 'Cache saved with the key'], ['cache hit for', 'Cache hit for'],
  ['npm cache is not found', 'npm cache is not found'], ['cache npm', 'cache: npm'], ['cache hit', 'Cache hit'], ['cache saved', 'Cache saved'],
  ['services postgres', 'services: postgres'], ['postgres o\'n sakkiz', 'postgres:18'], ['pg is ready', 'pg_isready'], ['needs test', 'needs: test'], ['npm run smoke', 'npm run smoke'],
  ['DATABASE URL', 'DATABASE_URL'], ['secrets DATABSE URL', 'secrets.DATABSE_URL'], ['secrets DATABASE URL', 'secrets.DATABASE_URL'], ['SMOKE XATO', 'SMOKE XATO'], ['shop smoke', 'shop_smoke'],
  ['pull request', 'pull request'], ['lenta smoke', 'lenta-smoke'], ['badge svg', 'badge.svg'], ['on push', 'on: push'], ['on pull request', 'on: pull_request'],
  ['GITHUB TOKEN', 'GITHUB_TOKEN'], ['contents read', 'Contents: read'], ['download action repository', 'Download action repository'], ['image ubuntu yigirma olti nol to\'rt', 'Image: ubuntu-26.04'],
  ['process completed with exit code one', 'Process completed with exit code 1'], ['process completed with exit code two', 'Process completed with exit code 2'],
  ['TS ikki uch ikki ikki', 'TS2322'], ['no overload matches this call', 'No overload matches this call'], ['missing webpack from lock file', 'Missing: webpack@5.112.2 from lock file'],
  ['the strategy configuration was canceled because test yigirma ikki failed', 'The strategy configuration was canceled because "test._22" failed'], ['cancelled', 'cancelled'],
  ['echo ok', 'echo ok'], ['exit nol', 'exit 0'], ['exit bir', 'exit 1'], ['m4c-03', 'm4c-03'], ['Node js', 'Node.js'], ['checkout v to\'rt', 'checkout@v4'], ['Actions', 'Actions'],
];
DIGITS.unshift(["o'ttiz yettinchi satr", '37-satr'], ["yigirmanchi satr", '20-satr'], ["yigirma ikkinchi satr", '22-satr'], ["qirq ikkinchi ustun", '42-ustun'], ["o'ninchi soniyada", '10-soniyada'], ["yigirma ikkinchi soniyada", '22-soniyada'],
  ["besh ming to'rt yuz o'ttiz ikki", '5432'], ["yigirma to'rt yigirma ikki bir", '24.22.1'], ["o'n bir o'n to'qqiz", '11.19'], ["yigirma olti nol to'rt", '26.04'], ["yigirma to'rt", '24'], ["yigirma ikki", '22'], ["yigirma uch ekran", '23 ekran'],
  ["o'n bir soniya", '11 s'], ["besh soniya", '5 s'], ["o'n ikki soniya", '12 s'], ["ikki soniya", '2 s'], ["besh besh", '5/5'], ["o'n ikki daqiqa", '12 daqiqa'], ["o'n besh daqiqa", '15 daqiqa'], ['yigirma besh daqiqa', '25 daqiqa'], ['yigirma sakkiz', '28'], ['uch narsa', '3 narsa']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Set up job/gi, /Post Run/gi, /Complete job/gi, /Initialize containers/gi, /Stop containers/gi, /Found in cache/gi, /Cache saved with the key/gi, /Cache hit for/gi, /npm cache is not found/gi,
  /Process completed with exit code/gi, /No overload matches this call/gi, /from lock file/gi, /Missing: webpack/gi, /The strategy configuration was canceled because/gi, /failed/g, /cancelled/gi, /canceled/gi,
  /Download action repository/gi, /Contents: read/gi, /Syncing repository/gi, /Deleting the contents/gi, /Secrets and variables/gi, /pull request/gi, /checks/g, /merge/gi, /badge/gi, /healthcheck/gi, /services/g, /runner/gi, /matrix/gi, /fail-fast/gi, /needs/g, /secret/gi, /image/gi, /workflow/gi);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown|require|process)$/;
function tsLine(src) {
  const re = /(\/\/.*$|\/\*.*?\*\/)|(`(?:[^`\\]|\\.)*`?|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
function yamlLine(src) {
  const m = /^(\s*)(- )?([\w-]+)(:)(.*)$/.exec(src);
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : /^\s*- /.test(src) ? `<span class="p">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
const mdLine = (src) => /^\[!\[/.test(src) ? `<span class="s">${escH(src)}</span>` : /^#/.test(src) ? `<span class="k">${escH(src)}</span>` : escH(src);
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓|^NATIJA: \d+\/\d+ ✓|^ok$|^added \d+ packages|Cache hit|Cache saved|^Found in cache/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●|^npm error|^##\[error\]|error TS\d+|^Error:|^X |^sh: |not found|SMOKE XATO|canceled|^xato/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^Tests:.*failed|\[chiqish kodi: [1-9]\d*|^\[1\]|^\[2\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0|^\[0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—|>|\d+ \||\|)|^npm warn|^Snapshots|^Time:|^Ran all|^Test Suites|^\s*Types of|^\s*Type '|^\s*Overload|^\s*Object literal|^  [a-z]|^---|^==|^\[command\]|^\s+\w[\w-]*: /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: jestLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const hlOf = (f) => (/\.ya?ml$/.test(f) ? yamlLine : /\.md$/.test(f) ? mdLine : tsLine);
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const lineN = (k, re) => { const l = KOD[k].lines.find((x) => re.test(x.t)); return l ? l.n : 1; };
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;
const Yml = ({ k = 'CI_DONE', ids, from, to, edit, focus, beat, title, style }) => <CodePanel file={title || `.github/workflows/ci.yml${KOD[k].tag && !/done|start/.test(KOD[k].tag) ? ' · ' + KOD[k].tag : ''}`} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} style={style} />;

function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;
function Cause({ items, on, bad }) {
  return <div className="cause">{items.map((x, i) => <div key={i} className={`${i < on ? 'on' : ''}${bad === i ? ' bad' : ''}`}><i>{i + 1}</i><span>{x}</span></div>)}</div>;
}
const mkPractice = (n, hls, extra = {}) => {
  const m = MDT[n]; const pr = m.proof;
  return {
    S: mkS(n, hls.map((hl) => ({ hl })), { tableAt: 3 }), steps: m.steps, trouble: m.trouble,
    proof: { label: pr.label, placeholder: pr.placeholder, check: (v) => new RegExp(pr.re, pr.flags).test(v), wrong: pr.wrong }, ...extra,
  };
};
const Demak = (n) => <span dangerouslySetInnerHTML={html(MDT[n].demak)} />;
function MC(p, n, more) {
  const m = MDT[n];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong} demak={Demak(n)} {...more} />;
}

// GitHub Actions run oynasi — HAQIQIY run ma'lumotidan (KOD.RUNS). Ko'p job'li run: chapda job'lar, `job` — tanlangan job (nom yoki indeks).
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const lg = (arr = []) => arr.map((t) => ({ t, c: /^\$ /.test(t) ? 'cmd' : /^##\[error\]|npm error|^FAIL|✕|●|Received|not found|error TS|^X |SMOKE XATO|canceled/.test(t) ? 'er' : /^PASS|✓|passed|^added \d+|Cache hit|Cache saved|Found in cache|NATIJA/.test(t) ? 'ok' : /warn|deprecated/.test(t) ? 'wn' : /^\s*(>|\d+ \||\|)|^>|^\[command\]|^\s+[\w-]+: |^with:|^env:/.test(t) ? 'cm' : '' }));
const jobIdx = (k, job) => { const J = KOD.RUNS[k].jobs; if (job == null) return 0; if (typeof job === 'number') return job; const i = J.findIndex((j) => j.name === job); return i < 0 ? 0 : i; };
const logKey = (k, step, job) => (KOD.RUNS[k].jobs.length > 1 ? `${KOD.RUNS[k].jobs[jobIdx(k, job)].name} · ${step}` : step);
const runLog = (k, step, keep, job) => lg((KOD.RUNS[k].log[logKey(k, step, job)] || []).filter(keep || (() => true)));
const runLogLines = (k, step, keep, job) => runLog(k, step, keep, job).map((l) => ({ h: jestLine(l.t) }));
const stepsOf = (k, job, post) => { const j = KOD.RUNS[k].jobs[jobIdx(k, job)]; return j ? j.steps.filter((s) => post || !/^Post /.test(s[0])) : []; };
const stepDur = (k, step, job) => { const s = stepsOf(k, job, true).find((x) => x[0] === step); return s ? s[2] : ''; };
function RunView({ k, job, open, lines, hlStep, ann, annAll, note, only, post, src }) {
  const r = KOD.RUNS[k]; const ji = jobIdx(k, job); const j = r.jobs[ji]; const steps = stepsOf(k, job, post).filter((s) => !only || only.test(s[0]));
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  const oi = typeof open === 'string' ? steps.findIndex((s) => s[0] === open) : open;
  const anns = annAll ? (r.ann || []).filter(([lv]) => lv === 'failure') : ann === undefined ? (r.ann || []).filter(([lv]) => lv === 'failure').slice(0, 1) : ann ? [ann] : [];
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{src || t(`haqiqiy run · #${r.n}${r.ev === 'pull_request' ? ' · pull_request' : ''}`, `настоящий run · #${r.n}${r.ev === 'pull_request' ? ' · pull_request' : ''}`)}</span></div>
    <div className="hd"><span className={`dot ${r.st}`}>{GH_ST[r.st]}</span><b>{r.title}</b><span>{r.br} · {r.sha}</span><span className="du">{r.dur !== '0 s' && r.dur !== '-' ? r.dur : ''}{r.at ? ` · ${hhmm(r.at)}` : ''}</span></div>
    {anns.map((a, i) => <div key={i} className="ann"><b>Annotations · {j ? j.name : 'test'}</b><span>{a[1]}</span></div>)}
    {note && <div className="ann nt"><b>{note[0]}</b><span>{note[1]}</span></div>}
    {r.wfIssue ? <div className="empty"><b style={{ color: '#CF222E' }}>✗ This run likely failed because of a workflow file issue.</b><br />{t("job yo'q · qadam yo'q · log yo'q", "job нет · шагов нет · лога нет")}</div> : <div className="rb">
      <div className="jobs">{r.jobs.map((x, i) => <div key={i} className={`jb ${x.st}${i === ji ? ' on' : ''}`}><span className="dot">{GH_ST[x.st]}</span>{x.name}<small>{x.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(n) || hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{st === 'skip' ? 'skipped' : st === 'off' ? 'cancelled' : du}</small>
          {oi === i && lines && lines.length > 0 && <pre className="log">{lines.map((l, q) => <span key={q} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}
function RunRows({ keys, hl = [] }) {
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run'lar", "настоящие run")}</span></div>
    <div className="lst">{keys.map((k) => { const r = KOD.RUNS[k]; return <div key={k} className={`row ${r.st}${hl.includes(k) ? ' hl' : ''}`}><span className="dot">{GH_ST[r.st]}</span><span className="tl"><b>{r.title}</b><small>#{r.n} · {r.sha} · {r.ev}</small></span><span className="brn">{r.br}</span><span className="tm"><small>{hhmm(r.at)}</small><small>{r.dur}</small></span></div>; })}</div>
  </div>;
}
// Cache zanjiri — uch run (haqiqiy log satrlari va npm ci soniyasi)
function CacheChain({ hl }) {
  const items = [
    { k: 'c1-10', h: t("1-run · ci-sinov", "1-й run · ci-sinov"), find: [/npm cache is not found/, /Cache saved with the key/], st: 'save' },
    { k: 'c1-11', h: t("2-run · ci-sinov", "2-й run · ci-sinov"), find: [/Cache hit for/], st: 'hit' },
    { k: 'c1-18', h: "1-run · main", find: [/npm cache is not found/], st: 'miss' },
  ];
  return <div className="c1-chain">{items.map((it, i) => {
    const r = KOD.RUNS[it.k]; const logs = [...(r.log['Run actions/setup-node@v4'] || []), ...(r.log['Post Run actions/setup-node@v4'] || [])];
    const ls = it.find.map((re) => logs.find((l) => re.test(l)) || '').filter(Boolean);
    return <div key={it.k} className={`${it.st}${hl === i ? ' hl' : ''}${hl != null && hl !== i ? ' dim' : ''}`}>
      <h4>{it.h} <small>#{r.n}</small></h4>{ls.map((l) => <code key={l}>{l.replace(/node-cache-Linux-x64-npm-([0-9a-f]{8})[0-9a-f]*/, 'node-cache-Linux-x64-npm-$1…')}</code>)}
      <b>npm ci · {stepDur(it.k, 'Run npm ci')}</b>
    </div>;
  })}</div>;
}
// PR kartasi — gh pr view / pr checks (36b) + pull_request run'i (36)
function PrCard({ checks, merged }) {
  const tl = (KOD.TXT_36B || '').split('\n'); const g = (key) => (tl.find((l) => l.startsWith(key + ':')) || '').split(':').slice(1).join(':').trim();
  const r36 = KOD.RUNS['36'];
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Pull request #{g('number') || '1'}</span><span className="src">{t("gh pr view · haqiqiy", "gh pr view · настоящий")}</span></div>
    <div className="hd"><span className={`dot ${merged ? 'ok' : 'wait'}`}>{merged ? '✓' : '●'}</span><b>{g('title')}</b><span>lenta-smoke → main</span><span className="du">{merged ? 'Merged' : g('state')}</span></div>
    {checks && r36 && <div className="c1-checks"><div className="t">Checks · pull_request run #{r36.n}</div>{r36.jobs.map((j) => <div key={j.name} className={j.st}><span className="dot">{GH_ST[j.st]}</span><b>{j.name}</b><small>{j.st === 'ok' ? 'Successful' : 'Failing'} in {j.dur}</small></div>)}
      <div className="mg">{merged ? 'Pull request successfully merged and closed' : 'All checks have passed · Merge pull request'}</div></div>}
  </div>;
}
function Badge({ ok = true }) { return <span className="c1-badge"><span>CI</span><b style={{ background: ok ? '#4C1' : '#E05D44' }}>{ok ? 'passing' : 'failing'}</b></span>; }

// CI/CD-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.c2-n2{border:2px solid #1D4ED8;border-radius:14px;padding:12px;display:grid;gap:10px;background:#F8FBFF}
.c2-n2 .jobs{display:grid;grid-template-columns:1fr 34px 1fr;align-items:stretch}
.c2-n2 .job{border:2px solid #15803D;border-radius:12px;padding:10px;display:grid;gap:6px;background:#fff;align-content:start}
.c2-n2 .st{display:flex;justify-content:space-between;gap:8px;border:1px solid #E5E7EB;border-left:4px solid #6D3BE4;border-radius:6px;padding:3px 8px;font:12.5px ui-monospace,Menlo,Consolas,monospace;color:#1F2937;background:#fff}
.c2-n2 .st span{color:#6B7280}
.c2-n2 .st.pre{border-left-color:#9CA3AF;color:#6B7280}
.c2-n2 .lab{font:700 12px system-ui,sans-serif;letter-spacing:.03em;color:#1D4ED8}
.c2-n2 .job .lab{color:#15803D}
.c2-n2 .need{display:flex;align-items:center;justify-content:center;flex-direction:column;font:700 11px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.c2-t3{display:flex;height:34px;border-radius:8px;overflow:hidden;border:1px solid #D7DCE3}
.c2-t3 div{display:flex;align-items:center;justify-content:center;font:600 11px ui-monospace,Menlo,Consolas,monospace;color:#fff;white-space:nowrap;overflow:hidden;border-right:1px solid rgba(255,255,255,.6)}
.c2-t3 .h{background:#1D4ED8}.c2-t3 .m{background:#94A3B8}.c2-t3 .p{background:#CBD5E1;color:#334155}
.c2-t3l{display:flex;justify-content:space-between;gap:10px;font:11px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.c2-s3 .z-term{font-size:12px}
.c2-m8{display:grid;grid-template-columns:86px 1fr;gap:6px 10px;align-items:center}
.c2-m8 .lb{white-space:nowrap;font:600 13px ui-monospace,Menlo,Consolas,monospace;color:#374151}
.c2-m8 .tr{position:relative;height:30px;background:#F3F4F6;border-radius:6px}
.c2-m8 .bar{position:absolute;top:0;bottom:0;border-radius:6px;display:flex;align-items:center;padding:0 8px;font:700 12px system-ui,sans-serif;color:#fff;white-space:nowrap}
.c2-m8 .bad{background:#DC2626}.c2-m8 .ok{background:#15803D}.c2-m8 .can{background:repeating-linear-gradient(135deg,#9CA3AF 0 6px,#B6BCC6 6px 12px);color:#111827}
.c2-m8 .ax{grid-column:2;display:flex;justify-content:space-between;font:11px ui-monospace,Menlo,Consolas,monospace;color:#9CA3AF}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:stretch}
@media (max-width:1000px){.pg-three{grid-template-columns:1fr 1fr}}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1000px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.pg-dict{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.pg-dict td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
.pg-dict td:first-child{border-left:4px solid ${T.accent};border-radius:10px 0 0 10px}
.pg-dict td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0;color:${T.ink2}}
.pg-dict code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.mk-panel .jp{background:${C1.pass};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.mk-panel .jf{background:${C1.fail};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${C1.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${C1.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${C1.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
.c1-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper}}
.c1-code .n{font:800 20px ${MONO};text-align:center}
.c1-code .t{font-size:13.5px;line-height:1.4}
.c1-code .t code{font:12px ${MONO};color:${T.ink2}}
.c1-res{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.c1-res th{font:700 12px ${SANS};color:${T.ink2};text-align:left;padding:4px 10px}
.c1-res td{padding:9px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};vertical-align:top;line-height:1.45;color:${T.ink}}
.c1-res td:first-child{border-left:1px solid ${T.line};border-radius:10px 0 0 10px;font-weight:700;white-space:nowrap}
.c1-res td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.c1-res b{font-weight:600}.c1-res b.ok{color:${T.green}}
.c1-res code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px}
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
/* Cache zanjiri */
.c1-chain{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media (max-width:1000px){.c1-chain{grid-template-columns:1fr}}
.c1-chain>div{border:2px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 12px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-chain h4{margin:0;font:800 13.5px ${SANS};color:${T.ink}}
.c1-chain h4 small{font:600 11px ${MONO};color:${T.ink3};margin-left:6px}
.c1-chain code{font:11.5px/1.4 ${MONO};background:#F4F5F7;border-radius:6px;padding:4px 7px;color:${T.ink};overflow-wrap:anywhere}
.c1-chain b{font:700 13px ${MONO};color:${T.ink2}}
.c1-chain .hit{border-color:${T.green};background:#F1FAF5}
.c1-chain .hit code{background:#E3F5EC;color:${T.green}}
.c1-chain .save{border-color:${C1.ci}}
.c1-chain .miss{border-color:${T.accent}}
.c1-chain .hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
.c1-chain .dim{opacity:.4}
/* PR checks */
.c1-checks{padding:8px 12px;display:grid;gap:4px;font:13px ${SANS}}
.c1-checks .t{font:700 12px ${SANS};color:#57606A;margin-bottom:2px}
.c1-checks>div.ok,.c1-checks>div.bad{display:flex;gap:8px;align-items:center;padding:6px 8px;border:1px solid #D0D7DE;border-radius:6px;color:#1F2328}
.c1-checks small{margin-left:auto;color:#57606A}
.c1-checks .mg{margin-top:4px;padding:8px 10px;border-radius:6px;background:#DAFBE1;color:#1A7F37;font-weight:600}
.c1-badge{display:inline-flex;font:700 12px ${SANS};border-radius:4px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.c1-badge span{background:#555;color:#fff;padding:3px 7px}
.c1-badge b{color:#fff;padding:3px 7px}
/* env ↔ secrets, services */
.c1-mach{border:2px solid ${T.line};border-radius:14px;background:${T.paper};padding:12px 14px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-mach h4{margin:0 0 2px;font:800 14px ${SANS};color:${T.ink}}
.c1-mach .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font-size:13px;color:${T.ink2}}
.c1-mach .r code{font:12px ${MONO};background:#F4F5F7;border-radius:6px;padding:2px 7px;color:${T.ink};overflow-wrap:anywhere}
.c1-mach p{margin:4px 0 0;font-size:13px;line-height:1.45;color:${T.ink2}}
.c1-mach p code{font:12px ${MONO};overflow-wrap:anywhere;word-break:break-all}
.c1-mach.ok{border-color:${T.green};background:#F1FAF5}
.c1-mach.bad{border-color:${T.accent};background:#FFF5F1}
.c1-mach.pg{border-color:${C1.pg};background:#F0F5FA}
.c1-mach.hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
/* GitHub Actions oynalari (haqiqiy run ma'lumotidan) */
.c2-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:${C1.gh}}
.c2-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS}}
.c2-gh .bar .lg{font-weight:800}
.c2-gh .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:#57606A;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 7px}
.c2-gh .dot{display:inline-flex;flex:none;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c2-gh .ok>.dot,.c2-gh .dot.ok{background:#1A7F37}
.c2-gh .bad>.dot,.c2-gh .dot.bad{background:#CF222E}
.c2-gh .wait>.dot,.c2-gh .dot.wait{background:#BF8700}
.c2-gh .lst{display:grid}
.c2-gh .row.ok,.c2-gh .row.bad,.c2-gh .row.skip,.c2-gh .row.wait,.c2-gh .row.off,.c2-gh .jb.ok,.c2-gh .jb.bad,.c2-gh .jb.wait,.c2-gh .jb.off{color:#1F2328}
.c2-gh .st.ok,.c2-gh .st.bad,.c2-gh .st.wait{color:#E6EDF3}
.c2-gh .st.skip,.c2-gh .st.off{color:#8B949E}
.c2-gh .row{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid #EAEEF2;transition:opacity .3s,background .3s}
.c2-gh .row.hl{background:#FFF8C5}
.c2-gh .row .tl{display:grid;gap:2px;min-width:0}
.c2-gh .row .tl b{font:600 14px ${SANS};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .row small{font:12px ${SANS};color:#57606A}
.c2-gh .row .brn{flex:none;font:12px ${MONO};color:#0969DA;background:#DDF4FF;border-radius:6px;padding:2px 7px}
.c2-gh .row .tm{margin-left:auto;display:grid;text-align:right;gap:2px;white-space:nowrap}
.c2-gh .hd{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid #EAEEF2;font:13px ${SANS};min-width:0}
.c2-gh .hd b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .hd .du{margin-left:auto;color:#57606A;white-space:nowrap}
.c2-gh .ann{margin:8px 12px 0;padding:8px 10px;border:1px solid #FFCECB;background:#FFEBE9;border-radius:6px;font:12.5px ${MONO};display:grid;gap:3px}
.c2-gh .ann b{font:700 12.5px ${SANS};color:#CF222E}
.c2-gh .ann.nt{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.nt b{color:#9A6700}
.c2-gh .empty{padding:18px 14px;font:13px ${SANS};color:#57606A;background:#F6F8FA;line-height:1.6}
.c2-gh .rb{display:grid;grid-template-columns:140px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA;box-shadow:inset 0 0 0 1px #D0D7DE}
.c2-gh .jb small{margin-left:auto;font:11px ${SANS};color:#57606A}
.c2-gh .steps{padding:8px 10px;display:grid;gap:2px;background:#0D1117;color:#E6EDF3;min-width:0;align-content:start}
.c2-gh .st{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:8px;align-items:center;padding:4px 4px;border-radius:6px;font:13px ${MONO}}
.c2-gh .st small{color:#8B949E;font:12px ${MONO}}
.c2-gh .st.skip .nm,.c2-gh .st.off .nm{color:#8B949E}
.c2-gh .st.hl{background:#30363D}
.c2-gh .st .log{grid-column:2/4;margin:4px 0 6px;padding:8px 10px;background:#161B22;border-radius:6px;font:12px/1.5 ${MONO};white-space:pre-wrap;overflow-wrap:anywhere;color:#C9D1D9}
.c2-gh .log .er{color:#FF7B72}
.c2-gh .log .ok{color:#7EE787}
.c2-gh .log .cm{color:#8B949E}
.c2-gh .log .wn{color:#E3B341}
.c2-gh .log .cmd{color:#79C0FF;font-weight:700}
.c1-small .c2-gh .steps{font-size:12px}
.c1-small .c2-gh .rb{grid-template-columns:110px minmax(0,1fr)}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
