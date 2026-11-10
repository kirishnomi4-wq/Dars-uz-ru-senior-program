// ============================================================
//  MENTOR KURSI · Jest-2 «Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi» (v2, F-1104-19)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar jest2-start (= jest1-done) → jest2-done
//  Kod va terminal: 03b-kod.gen.jsx (dev/jest2-kod.py — repo teglari va manba/jest2v2-out/ dan aynan, satr raqami bilan)
//  AI tajribasi: manba/jest2v2-ai/ (ai1 Opus 50 test · ai2 Haiku 42 test · mutatsiya-men/ai.txt)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest2/parts/*.jsx > JestEdgeMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-jest-02-edge-cases-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi";
const JC = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', jest: '#99425B', pass: '#15803D', fail: '#C2410C', happy: '#1F7A4D', edge: '#B45309', err: '#C2362B' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.spec\.ts$/.test(f) ? JC.jest : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
  tg: 'src/api/telegram/telegram.service.ts', kb: 'src/api/telegram/keyboards.ts', tx: 'src/api/telegram/texts.ts',
  txs: 'src/api/telegram/texts.spec.ts', kbs: 'src/api/telegram/keyboards.spec.ts',
  ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts',
  ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts',
  app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
  cat: 'src/api/catalog/catalog.service.ts', pkg: 'package.json',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.app, 'src/api/cart/', F.cat, F.ord, 'src/api/user/', F.tg, F.kb, F.tx, F.txs, F.kbs, 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, 'README.md'];
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
  ['rejects to throw', 'rejects.toThrow'], ['to throw', 'toThrow'], ['it each', 'it.each'], ['is phone', 'isPhone'],
  ['phone spec ts', 'phone.spec.ts'], ['phone ts', 'phone.ts'], ['order service spec ts', 'order.service.spec.ts'], ['order service ts', 'order.service.ts'],
  ['telegram service ts', 'telegram.service.ts'], ['app controller spec ts', 'app.controller.spec.ts'], ['app controller', 'app.controller'],
  ['mock resolved value', 'mockResolvedValue'], ['not to have been called', 'not.toHaveBeenCalled'], ['to have been called times', 'toHaveBeenCalledTimes'],
  ['jest fn', 'jest.fn'], ['data source', 'DataSource'], ['create nest application', 'createNestApplication'], ['before all', 'beforeAll'], ['after all', 'afterAll'],
  ['git diff stat', 'git diff --stat'], ['npm i minus D supertest', 'npm i -D supertest'], ['types supertest', '@types/supertest'], ['set status', 'setStatus'],
  ['npm test order service', 'npm test -- order.service'], ['npm test phone', 'npm test -- phone'], ['npm test app controller', 'npm test -- app.controller'],
  ['jest ikki start', 'jest2-start'], ['Object is', 'Object.is'], ['cannot get nope', 'Cannot GET /nope'], ['did not throw', 'did not throw'],
  ['plus to\'qqiz to\'qqiz sakkiz', '+998'], ['m4b-03', 'm4b-03'], ['Test module', 'Test.createTestingModule'],
];
DIGITS.unshift(["o'ttiz yettinchi satr", '37-satr'], ["o'ttiz oltinchi satr", '36-satr'], ["yigirma to'rtinchi satr", '24-satr'], ["yigirma besh va yigirma oltinchi satr", '25–26-satr'],
  ["bir yuz ellik yettinchi satr", '157-satr'], ["o'n ikkinchi satr", '12-satr'], ["o'n oltinchi satr", '16-satr'], ["yigirma uchinchi satr", '23-satr'], ["sakkizinchi satr", '8-satr'], ["to'rtinchi satr", '4-satr'], ["ellik birinchi satr", '51-satr'],
  ["bir yuz qirq to'qqiz", '149'], ['yigirma besh', '25'], ['ellik', '50'], ['qirq ikki', '42'], ['bir yuz ming', '100 000'], ["to'qqizdan o'n uchtagacha", '9–13'], ["to'qqizni sakkizga", '9 ni 8 ga'],
  ["o'n ikki daqiqa", '12 daqiqa'], ["o'n to'rtta", '14 ta'], ['sakkizta', '8 ta'], ["to'qqizta", '9 ta'], ['yigirma bir', '21']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Received function did not throw/g, /Cannot GET/g, /Expected substring/g, /Received message/g);

// Kod rang beruvchi (Jest-1 dan). Matn — KOD (03b-kod.gen.jsx), HTML'siz.
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
// Jest terminali: PASS yashil, FAIL qizil, ✓ / ✕, ● sarlavha, Expected / Received, > satr, Node.js qulashi qizil
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*○/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*(Expected|- Expected|Expected substring)/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(Received|\+ Received|Received string|Received message|\+ )/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/No tests found|^Error:|Error \[|JestAssertionError|Cannot find|\[chiqish kodi: 1\]|Node\.js v/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:.*failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
// outPick — faqat kerakli qatorlar (uzun qulash chiqishlari uchun): keep(l) true bo'lganlari
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? JC.termEr : JC.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
const kod = (k, ids = {}, from, to, edit = {}) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  return [{ ...base, gone: true }, { h: tsLine(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
});
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.ph, F.phs, F.ors, F.apps), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;

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

// Buzib tekshirish jadvali (manba/jest2v2-ai/mutatsiya-men.txt, mutatsiya-ai.txt — aynan): qizargan testlar soni
const MUT = [
  ['B1', "regex 9–13 → 8–13 raqam (8 ta raqam o'tadi)", [1, 1, 2]],
  ['B2', 'place: stock < qty → stock <= qty', [1, 1, 1]],
  ['B3', 'place: UPDATE ombor tekshiruvidan OLDIN', [1, 2, 1]],
  ['B4', "xabar «Telefon raqami yo'q» → «Raqam yo'q»", [1, 3, 3]],
  ['B5', "place: bo'sh savat tekshiruvi olib tashlandi", [1, 1, 1]],
];
const MUT_COLS = [['Men', 25], ['1-AI', 50], ['2-AI', 42]];
function MutTable({ rows = 5, hlCol, hlRow }) {
  return <table className="mut"><thead><tr><th>{t("Buzish", "Поломка")}</th>{MUT_COLS.map(([n, c], i) => <th key={n} className={hlCol === i ? 'hl' : ''}>{n}<small>{c} test</small></th>)}</tr></thead>
    <tbody>{MUT.slice(0, rows).map(([id, d, v], r) => <tr key={id} className={hlRow === r ? 'hl' : ''} style={{ animation: `mk-up .35s ${r * 0.06}s ease both` }}><td><b>{id}</b> {d}</td>{v.map((x, i) => <td key={i} className={`${x === 0 ? 'zero' : 'red'}${hlCol === i ? ' col' : ''}`}>{x}</td>)}</tr>)}</tbody></table>;
}

// Jest-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.j2-15 .flow{display:grid;grid-template-columns:1fr 26px 1fr 26px 1fr 26px 1fr;align-items:stretch;background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:14px}
.j2-15 .st{border:1.5px solid #D7DCE3;border-radius:10px;padding:10px;display:grid;gap:6px;align-content:start;background:#F8FAFC;min-width:0}
.j2-15 .st h6{margin:0;font:700 11px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.j2-15 .st .ln{font:11.5px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.j2-15 .ar{display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:20px}
.j2-15 .st.x{border-color:#DC2626;background:#FEF2F2}
.j2-15 .st.off{border-style:dashed;background:#fff}
.j2-15 .st.off .zm{color:#6B7280}
.j2-15 .st .z-tag{white-space:normal}
.j2-15 .as{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.j2-15 .a{border:2px solid #C2410C;border-radius:12px;background:#fff;padding:10px 12px;display:grid;gap:6px;align-content:start}
.j2-15 .a>b{color:#C2410C;font-size:14px}
.j2-15 .a .zm{background:#F1F3F6;border-radius:6px;padding:6px 8px;white-space:pre-wrap}
.j2-15 .a small{color:#6B7280;font-size:12.5px}
.j2-5 td.c,.j2-5 th.c,.j2-6 td.c,.j2-6 th.c{text-align:center}
.j2-5 .grp td{background:#F8FAFC;font:700 11.5px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.j2-5 .p,.j2-6 .p{color:#15803D;font-weight:700}.j2-5 .f,.j2-6 .f{color:#DC2626;font-weight:700}
.j2-nl{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;text-align:center;font:13px ui-monospace,Menlo,Consolas,monospace}
.j2-nl div{border-radius:6px;padding:6px 0;background:#DCFCE7;color:#15803D;font-weight:700}
.j2-nl div.x{background:#FEE2E2;color:#991B1B}
.j2-nl small{display:block;font:11px system-ui,sans-serif;font-weight:400;color:inherit;opacity:.85}
.j2-6 tr.tor td{background:#FFF7ED}.j2-6 tr.keng td{background:#EFF6FF}
.j2-6 .lab{font:700 11px system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:1px 7px;white-space:nowrap}
.j2-6 .lab.o{background:#FFEDD5;color:#C2410C}.j2-6 .lab.b{background:#DBEAFE;color:#1D4ED8}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
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
.mk-panel .jp{background:${JC.pass};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.mk-panel .jf{background:${JC.fail};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${JC.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${JC.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${JC.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px}
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${JC.term};white-space:pre;overflow-x:auto}
.mut{width:100%;border-collapse:separate;border-spacing:0 5px;font-size:13.5px}
.mut th{font:700 12px ${SANS};color:${T.ink2};text-align:center;padding:4px 8px}
.mut th:first-child{text-align:left}
.mut th small{display:block;font-weight:500;color:${T.ink3}}
.mut th.hl{color:${T.accent}}
.mut td{padding:8px 10px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};text-align:center;font:700 14px ${MONO}}
.mut td:first-child{text-align:left;font:13px ${SANS};border-left:1px solid ${T.line};border-radius:10px 0 0 10px}
.mut td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.mut td.zero{background:#FFE4DA;color:${T.accent}}
.mut td.red{color:${T.green}}
.mut td.col{box-shadow:inset 0 0 0 2px ${T.accent}}
.mut tr.hl td{border-color:${T.accent}}
.path{border:2px solid var(--c);border-radius:14px;padding:12px 14px;background:${T.paper};transition:all .35s;display:grid;gap:6px;align-content:start}
.path.dim{opacity:.35}
.path.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.path h4{margin:0;font:800 14px ${SANS};color:var(--c)}
.path .ex{font:13px ${MONO};background:#F4F5F7;border-radius:8px;padding:5px 8px;color:${T.ink}}
.path .q{font-size:13.5px;color:${T.ink2};line-height:1.45}
.path .t{font:600 12.5px ${SANS};color:var(--c);border-top:1px dashed ${T.line};padding-top:6px;margin-top:2px}
.fl-grid{display:grid;grid-template-columns:minmax(0,200px) minmax(0,1fr);gap:10px;align-items:center}
.fl-tests{display:grid;gap:8px}
.fl-row{display:grid;grid-template-columns:20px minmax(0,1fr) 150px;gap:8px;align-items:center}
.fl-ar{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.fl-box{border:2px solid var(--c);border-radius:12px;padding:8px 10px;background:${T.paper};transition:all .35s}
.fl-box.hl{background:#FFF0EB}
.fl-box small{display:block;font:600 11px ${MONO};color:${T.ink3};margin-bottom:3px}
.fl-box b{font:700 13.5px ${MONO};color:${T.ink}}
.fl-v{font:700 13px ${SANS};border-radius:10px;padding:8px 10px;text-align:center;animation:mk-up .4s ease both}
.fl-v.ok{background:#E3F5EC;color:${T.green}}
.fl-v.bad{background:#FFE4DA;color:${T.accent}}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
