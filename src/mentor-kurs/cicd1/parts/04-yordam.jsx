// ============================================================
//  MENTOR KURSI · CI/CD-1 «Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi» (v2, F-1104-20)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml)
//  Kod, yml, terminal va HAQIQIY GitHub Actions run'lari: 03b-kod.gen.jsx (dev/cicd1-kod.py — repo teglari, manba/cicd1v2-yml, manba/cicd1v2-out, gh api)
//  AI tajribasi: manba/cicd1v2-ai/ (ai1 Opus · ai2 Haiku — ikkalasi node-version 22, tsc/build yo'q; run 19/20 qizil, 21 yashil)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd1/parts/*.jsx > CiCdIntroMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-cicd-01-lenta-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', gh: '#1F2328', ci: '#1F6FEB', cd: '#B45309', yml: '#7C3AED' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? C1.yml : /\.spec\.ts$/.test(f) ? '#99425B' : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
  ci: '.github/workflows/ci.yml', ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts',
  usr: 'src/api/user/user.service.ts', pkg: 'package.json', lock: 'package-lock.json',
  tg: 'src/api/telegram/telegram.service.ts', ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts',
  app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.app, F.apps, 'src/api/cart/', 'src/api/catalog/', F.ord, F.ors, F.usr, F.tg, F.ph, F.phs, 'src/api/telegram/keyboards.ts', 'src/api/telegram/texts.ts', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, F.lock, 'README.md'];
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

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['npx tsc no emit', 'npx tsc --noEmit'], ['npm si ay', 'npm ci'], ['ci yml', 'ci.yml'], ['package lock json', 'package-lock.json'], ['package json', 'package.json'],
  ['actions checkout', 'actions/checkout'], ['setup node', 'setup-node'], ['node version', 'node-version'], ['runs on', 'runs-on'], ['ubuntu latest', 'ubuntu-latest'],
  ['order service ts', 'order.service.ts'], ['user service ts', 'user.service.ts'], ['git checkout jest ikki done', 'git checkout jest2-done'], ['jest ikki done', 'jest2-done'],
  ['node dist main', 'node dist/main'], ['pull request', 'pull_request'], ['on push', 'on: push'], ['nest build', 'nest build'], ['git remote', 'git remote'],
  ['process completed with exit code one', 'Process completed with exit code 1'], ['missing webpack from lock file', 'Missing: webpack@5.112.2 from lock file'],
  ['could not read package json', 'Could not read package.json'], ['workflow file issue', 'workflow file issue'], ['TS ikki uch ikki ikki', 'TS2322'],
  ['DATABASE URL', 'DATABASE_URL'], ['env', '.env'], ['Node js', 'Node.js'], ['Actions', 'Actions'], ['m4c-01', 'm4c-01'], ['npm install', 'npm install'],
];
DIGITS.unshift(["o'ttiz oltinchi satr", '36-satr'], ["o'ttiz yettinchi satr", '37-satr'], ["o'n oltinchi satr", '16-satr'], ["yigirmanchi satr", '20-satr'], ["o'ttizinchi satr", '30-satr'],
  ["sakkizinchi satr", '8-satr'], ["yettinchi satr", '7-satr'], ["uchinchidan beshinchi satrgacha", '3–5-satrlar'], ["birinchi ikki satr", '1–2-satrlar'], ["oxirgi to'rt satr", '12–15-satrlar'],
  ["olti yuz o'ttiz uchta", '633 ta'], ["o'n besh soniya", '15 soniya'], ["olti soniya", '6 soniya'], ["uch soniya", '3 soniya'], ["ikki soniya", '2 soniya'], ["to'rt soniya", '4 soniya'],
  ["yuz yigirma yetti", '127'], ["yigirma to'rt", '24'], ["yigirma ikki", '22'], ["to'rt o'n olti nol", '4.16.0'], ["to'rt o'n olti uch", '4.16.3'], ["o'n besh satr", '15 satr'], ["o'n bir", '11'], ["o'n", '10'],
  ["yigirma besh", '25'], ["yigirma olti", '26'], ["yigirma daqiqa", '20 daqiqa'], ["o'n ikki daqiqa", '12 daqiqa'], ['yigirma ekran', '20 ekran'], ['besh nuqta', '5 nuqta']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Continuous Integration/g, /Continuous Delivery/g, /Continuous Deployment/g, /Process completed with exit code/gi, /workflow file issue/gi, /from lock file/gi, /Missing: webpack/gi,
  /could not read package json/gi, /can only install with an existing package lock json/gi, /in sync/gi, /clean install/gi, /not found/gi, /skipped/g, /Set up job/gi, /no emit/gi, /runner/gi, /Secrets/g);

// Kod rang beruvchilar: TypeScript (Jest-2 dan), YAML (CI/CD-2 dan), terminal (npm · jest · tsc · GitHub log)
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown)$/;
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
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓|^npm ci ✓|^tsc ✓|^added \d+ packages/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●|^npm error|^##\[error\]|error TS\d+|^Error:|^X |^sh: |not found|^\s*throw new Error/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^Tests:.*failed|\[chiqish kodi: [1-9]\d*/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—|>|\d+ \||\|)|^npm warn|^Snapshots|^Time:|^Ran all|^Test Suites|^\s*Types of|^\s*Type '|^\s*Overload|^\s*Object literal|^  [a-z]|^---/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
// Terminal chiqishlari — cicd1v2-out/0N (aynan)
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
// reA dan (shu qator bilan) reB gacha (shu qator bilan; null — oxirigacha), keep — filtr
const outRange = (k, reA, reB, keep = () => true) => { const L = outLines(k); let a = L.findIndex((l) => reA.test(l)); if (a < 0) a = 0; let b = reB ? L.findIndex((l, i) => i >= a && reB.test(l)) : L.length - 1; if (b < 0) b = L.length - 1; return L.slice(a, b + 1).filter(keep).map((l) => ({ h: jestLine(l) })); };
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: jestLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Kod bo'laklari — KOD[k] (repo teglari / yml fayllari), satr raqami bilan; fayl turiga qarab rang
const hlOf = (f) => (/\.ya?ml$/.test(f) ? yamlLine : tsLine);
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.ci), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;
const Yml = ({ k = 'CI_DONE', ids, from, to, edit, focus, beat, title, style }) => <CodePanel file={title || `.github/workflows/ci.yml${KOD[k].tag && KOD[k].tag !== 'cicd1-done' ? ' · ' + KOD[k].tag : ''}`} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} style={style} />;

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

// Lenta chizig'i — OrderBotNest'ning to'rt qadami (holat: ok | bad | skip), savol qatori, soniya
const LENTA = [['ci', 'npm ci', "paketlar o'rnatildimi?"], ['tsc', 'npx tsc --noEmit', "turlar to'g'rimi?"], ['test', 'npm test', 'testlar yashilmi?'], ['build', 'npm run build', "dist yig'ildimi?"]];
const L_ST = { ok: '✓ yashil', bad: '✗ qizil', skip: '— yurmadi' };
function Lenta4({ st = {}, hl = [], q, dur = {}, dim }) {
  return <div className="c1-lenta">
    {LENTA.map(([k, cmd, qq], i) => <div key={k} className={`${st[k] || ''}${hl.includes(k) ? ' hl' : ''}${dim && !hl.includes(k) ? ' dim' : ''}`} style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}>
      <span className="ic">{i + 1}</span><code>{cmd}</code>{q && <em>{qq}</em>}{st[k] && <small>{L_ST[st[k]]}</small>}{dur[k] && <b>{dur[k]}</b>}
    </div>)}
  </div>;
}
// Ikki mashina kartasi: sizniki ↔ runner
function Machines({ left, right, hl }) {
  const box = (m, side) => <div className={`c1-mach ${m.st || ''}${hl === side ? ' hl' : ''}`}>
    <h4>{m.h}</h4>{(m.rows || []).map(([a, b]) => <div key={a} className="r"><span>{a}</span><code>{b}</code></div>)}{m.note && <p>{m.note}</p>}
  </div>;
  return <div className="pg-two">{box(left, 'l')}{box(right, 'r')}</div>;
}

// GitHub Actions run oynasi — HAQIQIY run ma'lumotidan (KOD.RUNS: gh api — job, qadam, soniya, annotatsiya, log). Skrinshot emas: maket, lekin har nom, holat, vaqt va log satri o'sha run'dan.
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const lg = (arr = []) => arr.map((t) => ({ t, c: /^\$ /.test(t) ? 'cmd' : /^##\[error\]|npm error|^FAIL|✕|●|Received|not found|error TS|^X /.test(t) ? 'er' : /^PASS|✓|passed|^added \d+/.test(t) ? 'ok' : /warn|deprecated/.test(t) ? 'wn' : /^\s*(>|\d+ \||\|)|^>/.test(t) ? 'cm' : '' }));
const runLog = (k, step, keep) => lg((KOD.RUNS[k].log[step] || []).filter(keep || (() => true)));
const stepIdx = (k, step) => visibleSteps(k).findIndex((s) => s[0] === step);
const visibleSteps = (k) => { const r = KOD.RUNS[k]; return r.jobs.length ? r.jobs[0].steps.filter((s) => !/^Post /.test(s[0])) : []; };
function RunView({ k, open, lines, hlStep, ann, note, only }) {
  const r = KOD.RUNS[k]; const j = r.jobs[0]; const steps = visibleSteps(k).filter((s) => !only || only.test(s[0]));
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  const oi = typeof open === 'string' ? stepIdx(k, open) : open;
  const a = ann === undefined ? (r.ann || []).find(([lv]) => lv === 'failure') : ann;
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run · #", "настоящий run · #")}{r.n}</span></div>
    <div className="hd"><span className={`dot ${r.st}`}>{GH_ST[r.st]}</span><b>{r.title}</b><span>{r.br} · {r.sha}</span><span className="du">{r.dur !== '0 s' ? r.dur : ''}{r.at ? ` · ${hhmm(r.at)}` : ''}</span></div>
    {a && <div className="ann"><b>Annotations · {j ? j.name : 'test'}</b><span>{a[1]}</span></div>}
    {note && <div className="ann nt"><b>{note[0]}</b><span>{note[1]}</span></div>}
    {r.wfIssue ? <div className="empty"><b style={{ color: '#CF222E' }}>✗ This run likely failed because of a workflow file issue.</b><br />{t("job yo'q · qadam yo'q · log yo'q — GitHub faylni o'qiy olmadi", "job нет · шагов нет · лога нет — GitHub не смог прочитать файл")}</div> : <div className="rb">
      <div className="jobs">{r.jobs.map((x, i) => <div key={i} className={`jb ${x.st}${i === 0 ? ' on' : ''}`}><span className="dot">{GH_ST[x.st]}</span>{x.name}<small>{x.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(n) || hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{st === 'skip' ? 'skipped' : du}</small>
          {oi === i && lines && lines.length > 0 && <pre className="log">{lines.map((l, q) => <span key={q} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}
// Run ro'yxati (Actions bo'limi) — bir nechta haqiqiy run qatori
function RunRows({ keys, hl = [] }) {
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run'lar", "настоящие run")}</span></div>
    <div className="lst">{keys.map((k) => { const r = KOD.RUNS[k]; return <div key={k} className={`row ${r.st}${hl.includes(k) ? ' hl' : ''}`}><span className="dot">{GH_ST[r.st]}</span><span className="tl"><b>{r.title}</b><small>CI #{r.n} · {r.sha}</small></span><span className="brn">{r.br}</span><span className="tm"><small>{hhmm(r.at)}</small><small>{r.dur}</small></span></div>; })}</div>
  </div>;
}

// CI/CD-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.c1-l3 .z-tbl th,.c1-l3 .z-tbl td{text-align:center;vertical-align:middle}
.c1-l3 .z-tbl .l{text-align:left}
.c1-l3 .c0{background:#DCFCE7;color:#15803D;font-weight:700}
.c1-l3 .cx{background:#FEE2E2;color:#B91C1C;font-weight:700}
.c1-l3 .sk{color:#9CA3AF;background:repeating-linear-gradient(135deg,#fff 0 6px,#F3F4F6 6px 12px)}
.c1-l3 small{display:block;font:11px system-ui,sans-serif;font-weight:400;color:#6B7280}
.c1-l3 .r{font:700 12px system-ui,sans-serif;border-radius:999px;padding:2px 8px;white-space:nowrap}
.c1-l3 .r.g{background:#DCFCE7;color:#15803D}.c1-l3 .r.x{background:#DC2626;color:#fff}
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
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${C1.term};white-space:pre;overflow-x:auto}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
/* Lenta chizig'i — to'rt qadam */
.c1-lenta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.c1-lenta>div{border:1.5px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 8px;text-align:center;display:grid;gap:4px;justify-items:center;transition:opacity .3s,border-color .3s,background .3s}
.c1-lenta .ic{display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font:700 12px ${MONO};color:#fff;background:${T.ink3}}
.c1-lenta .ok .ic{background:${T.green}}
.c1-lenta .bad .ic{background:${T.accent}}
.c1-lenta code{font:12.5px ${MONO};color:${T.ink}}
.c1-lenta em{font:12.5px ${SANS};font-style:normal;color:${T.ink2}}
.c1-lenta small{font:600 11.5px ${SANS}}
.c1-lenta b{font:700 12px ${MONO};color:${T.ink2}}
.c1-lenta .ok{border-color:${T.green};background:#E3F5EC}
.c1-lenta .ok small{color:${T.green}}
.c1-lenta .bad{border-color:${T.accent};background:#FFF0EB}
.c1-lenta .bad small{color:${T.accent}}
.c1-lenta .skip{opacity:.45}
.c1-lenta .dim{opacity:.35}
.c1-lenta .hl{box-shadow:0 0 0 3px rgba(226,69,31,.18);border-color:${T.accent}}
/* Ikki mashina */
.c1-mach{border:2px solid ${T.line};border-radius:14px;background:${T.paper};padding:12px 14px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-mach h4{margin:0 0 2px;font:800 14px ${SANS};color:${T.ink}}
.c1-mach .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font-size:13px;color:${T.ink2}}
.c1-mach .r code{font:12.5px ${MONO};background:#F4F5F7;border-radius:6px;padding:2px 7px;color:${T.ink}}
.c1-mach p{margin:4px 0 0;font-size:13px;line-height:1.45;color:${T.ink2}}
.c1-mach.ok{border-color:${T.green};background:#F1FAF5}
.c1-mach.bad{border-color:${T.accent};background:#FFF5F1}
.c1-mach.hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
/* Chiqish kodi qatorlari */
.c1-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper}}
.c1-code .n{font:800 22px ${MONO};text-align:center}
.c1-code .t{font-size:13.5px;line-height:1.4}
.c1-code .t code{font:12px ${MONO};color:${T.ink2}}
/* CD oqimi */
.c1-cd{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:stretch}
.c1-cd>div{border:2px solid var(--c);border-radius:12px;padding:10px;background:${T.paper};display:grid;gap:4px;align-content:start;transition:opacity .3s}
.c1-cd h4{margin:0;font:800 13px ${SANS};color:var(--c)}
.c1-cd p{margin:0;font-size:12.5px;line-height:1.4;color:${T.ink2}}
.c1-cd .dim{opacity:.35}
/* Bosqich kartasi (AI) */
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
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
.c2-gh .hd{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid #EAEEF2;font:13px ${SANS};min-width:0}
.c2-gh .hd b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .hd .du{margin-left:auto;color:#57606A;white-space:nowrap}
.c2-gh .ann{margin:8px 12px 0;padding:8px 10px;border:1px solid #FFCECB;background:#FFEBE9;border-radius:6px;font:12.5px ${MONO};display:grid;gap:3px}
.c2-gh .ann b{font:700 12.5px ${SANS};color:#CF222E}
.c2-gh .ann.nt{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.nt b{color:#9A6700}
.c2-gh .empty{padding:18px 14px;font:13px ${SANS};color:#57606A;background:#F6F8FA;line-height:1.6}
.c2-gh .rb{display:grid;grid-template-columns:130px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA}
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
