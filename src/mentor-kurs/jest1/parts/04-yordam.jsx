// ============================================================
//  MENTOR KURSI · Jest-1 «OrderBotNest'ga birinchi testlar: yozamiz, buzamiz, AI testini tekshiramiz» (v2, F-1104-01)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/10-Jest1-mentor-v2.md (GATE M 04.11)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar jest1-start (= tgpg-done) → jest1-done
//  Kod va terminal: 03b-kod.gen.jsx (dev/jest1-kod.py — repo teglari va manba/jest1v2-out/ dan aynan, satr raqami bilan)
//  AI tajribasi: manba/jest1v2-ai/ (1-prompt: ai1 Opus, ai2 Haiku · 2-prompt: p2/)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest1/parts/*.jsx > JestUnitMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-jest-01-birinchi-unit-test-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "OrderBotNest'ga birinchi testlar";
const JC = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', jest: '#99425B', pass: '#15803D', fail: '#C2410C' };
const ESC = String.fromCharCode(92) + 'u00a0'; // bo'linmas probel escape'i matn sifatida (fayl vositasi uni belgiga aylantirmasin — 04.11)
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
  cat: 'src/api/catalog/catalog.service.ts', ord: 'src/api/order/order.service.ts', pkg: 'package.json',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', F.cat, F.ord, 'src/api/user/', F.tg, F.kb, F.tx, 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, 'README.md'];
const FILES = (...extra) => tree(BASE_FILES, extra);
MKCFG.files = FILES();
// VS Code'dagidek ixcham Explorer: faqat ochiq faylning papka zanjiri ochiq (TgPg dagi compact)
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
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) /* F-1120-02 (M52): act */ };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['backslash u nol nol a nol', ESC], ['nol nol a nol', '00a0'], ['ikki nol', '0020'],
  ['texts spec ts', 'texts.spec.ts'], ['keyboards spec ts', 'keyboards.spec.ts'], ['texts ts', 'texts.ts'], ['spec ts', '.spec.ts'], ['test ts', '.test.ts'],
  ['to strict equal', 'toStrictEqual'], ['to be undefined', 'toBeUndefined'], ['to be truthy', 'toBeTruthy'], ['to equal', 'toEqual'], ['to be', 'toBe'],
  ['to locale string', 'toLocaleString'], ['Object is', 'Object.is'], ['console log', 'console.log'], ['no tests found', 'No tests found'],
  ['Root dir src', 'rootDir: src'], ['root dir src', 'rootDir: src'], ['Test regex', 'testRegex'], ['test regex', 'testRegex'], ['transform ts jest', 'transform: ts-jest'], ['ts jest', 'ts-jest'],
  ['order keyboard', 'orderKeyboard'], ['catalog keyboard', 'catalogKeyboard'], ['Buttons yordamchisi', 'buttons() yordamchisi'], ['Nav yordamchisi', 'nav() yordamchisi'],
  ['hide false', 'hide: false'], ['git diff stat', 'git diff --stat'], ['jest bir start', 'jest1-start'], ['package json', 'package.json'],
  ['Describe som', "describe('som')"], ['npm test keyboards', 'npm test -- keyboards'], ['npm test texts', 'npm test -- texts'], ['git checkout', 'git checkout'],
  ['dollar va qavs', '${…}'], ['delivery fee', 'deliveryFee'], ['order total', 'orderTotal'], ['m4b-01', 'm4b-01'], ['env fayli', '.env fayli'], ['env faylisiz', '.env faylisiz'],
];
DIGITS.unshift(['bir yuz yigirma ming', '120 000'], ['bir yuz ming', '100 000'], ["o'ttiz olti", '36'], ["o'ttiz uch", '33'], ["o'ttizdan ortiq", '30 dan ortiq'], ["o'ttiz uchinchi", '33-'],
  ["o'nta", '10 ta'], ["yigirma bir", '21'], ["to'qson daqiqaning yigirma beshi", '90 daqiqaning 25 tasi'], ["o'n besh", '15'], ["o'n daqiqa", '10 daqiqa'], ['besh yuz', '500']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/No tests found/g, /serializes to the same string/g, /Cannot find module/g, /Object is/g);

// Kod rang beruvchi (TgPg dan). Matn — KOD (03b-kod.gen.jsx), HTML'siz.
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
// Jest terminali: PASS yashil, FAIL qizil, ✓ / ✕, ● sarlavha, Expected / Received, > satr
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*(Expected|- Expected|Expected substring)/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(Received|\+ Received|Received string|\+ )/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/No tests found|error|Error|Cannot find|\[chiqish kodi: 1\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:.*failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
// out(k, a, b, meta) — KOD.OUT[k] satrlari a..b (1 dan, bo'sh satrsiz); meta {satr: {id}} — yoritish
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re, meta) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? JC.termEr : JC.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
// Loyiha kodi (KOD — aynan, satr raqami bilan). ids: {satr: 'id'} — yoritish; from/to — satr chegarasi; edit: {satr: matn} — buzilgan/tuzatilgan satr
const kod = (k, ids = {}, from, to, edit = {}) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  return [{ ...base, gone: true }, { h: tsLine(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
});
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.txs, F.kbs), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

// AI javobi kartasi — prompt, AI javobidan qisqa parcha, git diff --stat (haqiqiy yurgizish, «namuna» belgisi bilan)
function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;

// v2 qoliplari: amaliyot MD'dan (mkPractice), tekshiruv (MC) — M42: above/after/demak
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

// Buzib tekshirish jadvali (manba/jest1v2-ai/mutatsiya.txt — aynan): qizargan testlar soni; 0 — buzilish sezilmadi
const MUT = [
  ['B1', "som: ru-RU → en-US («120,000»)", [1, 8, 1]],
  ['B2', 'savat qatori: buyurtma narxi o\'rniga hozirgi narx', [0, 1, 1]],
  ['B3', 'orderKeyboard: CANCELLED da ham tugma', [1, 1, 1]],
  ['B4', 'catalogKeyboard: oxirgi sahifada ham ▶', [2, 3, 3]],
  ['B5', 'STATUS_UZ.NEW matni o\'zgardi', [0, 0, 1]],
];
const MUT_COLS = [['Men', 10], ['1-AI', 36], ['2-AI', 33]];
function MutTable({ rows = 5, hlCol, hlRow }) {
  return <table className="mut"><thead><tr><th>{t("Buzish", "Поломка")}</th>{MUT_COLS.map(([n, c], i) => <th key={n} className={hlCol === i ? 'hl' : ''}>{n}<small>{c} test</small></th>)}</tr></thead>
    <tbody>{MUT.slice(0, rows).map(([id, d, v], r) => <tr key={id} className={hlRow === r ? 'hl' : ''} style={{ animation: `mk-up .35s ${r * 0.06}s ease both` }}><td><b>{id}</b> {d}</td>{v.map((x, i) => <td key={i} className={`${x === 0 ? 'zero' : 'red'}${hlCol === i ? ' col' : ''}`}>{x}</td>)}</tr>)}</tbody></table>;
}

// Jest-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.j1-15 td,.j1-15 th{text-align:center}
.j1-15 td.l,.j1-15 th.l{text-align:left}
.j1-15 .kb{display:inline-flex;gap:4px}
.j1-15 .kb i{font-style:normal;border:1px solid #CBD5E1;border-radius:6px;padding:1px 7px;background:#fff}
.j1-15 .kb i.x{border-color:#DC2626;background:#FEE2E2;color:#991B1B;font-weight:700}
.j1-15 .tp{color:#15803D;font-weight:700}.j1-15 .tf{color:#DC2626;font-weight:700}
.j1-15 .f0{color:#6B7280}.j1-15 .f1{color:#15803D;font-weight:700}.j1-15 .f2{color:#DC2626;font-weight:700}
.j1-15 tr.edge td{background:#FFF7ED}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
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
.chars{display:flex;flex-wrap:wrap;gap:4px;font:600 13px ${MONO}}
.chars span{display:inline-flex;flex-direction:column;align-items:center;min-width:34px;padding:4px 3px;border:1px solid ${T.line};border-radius:8px;background:${T.paper}}
.chars span i{font-style:normal;font-size:15px;color:${T.ink};min-height:18px}
.chars span small{font-size:10.5px;color:${T.ink3}}
.chars span.nb{border:2px solid ${T.accent};background:#FFF0EB}
.chars span.nb small{color:${T.accent};font-weight:800}
.chars span.sp{border:2px solid ${T.green};background:#E3F5EC}
.chars span.sp small{color:${T.green};font-weight:800}
.st-tab{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.st-tab td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:background .3s}
.st-tab td:first-child{border-left:4px solid ${JC.jest};border-radius:10px 0 0 10px;font:700 12.5px ${MONO}}
.st-tab td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.st-tab tr.hl td{background:#FFF0EB}
.st-tab .btn{display:inline-block;font:12px ${SANS};border:1px solid #BFD0E0;border-radius:8px;padding:3px 8px;margin:0 4px 0 0;background:#F4F8FC}
.pages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.pages div{border:1.5px solid ${T.line};border-radius:12px;padding:10px;text-align:center;font:700 14px ${MONO};background:${T.paper};transition:all .3s}
.pages div small{display:block;font:600 11px ${SANS};color:${T.ink3};margin-top:4px}
.pages div.hl{border-color:${T.accent};background:#FFF0EB}
.pages div.ok{border-color:${T.green};background:#E3F5EC}
.cmp-row{display:flex;align-items:stretch;gap:6px;margin:6px 0}
.cmp-lab{width:92px;display:flex;flex-direction:column;justify-content:center}
.cmp-lab b{font:700 14px ${MONO};color:${T.ink}}
.cmp-lab small{font-size:11.5px;color:${T.ink3}}
.cmp-c{width:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 2px;border:1.5px solid ${T.line};border-radius:10px;background:${T.paper};opacity:.15;transform:translateY(6px);transition:all .3s}
.cmp-c.on{opacity:1;transform:none}
.cmp-c i{font-style:normal;font:700 24px ${MONO};color:${T.ink};min-height:28px}
.cmp-c small{font:600 11px ${MONO};color:${T.ink3}}
.cmp-c.ok{border-color:${T.green};background:#E3F5EC}
.cmp-c.bad{border-color:${T.accent};background:#FFE4DA}
.cmp-c.bad small{color:${T.accent};font-weight:800}
.cmp-c.big{transform:scale(1.15);box-shadow:0 0 0 4px rgba(225,73,38,.18);animation:cmp-pulse 1.2s ease-in-out infinite}
@keyframes cmp-pulse{50%{box-shadow:0 0 0 8px rgba(225,73,38,.06)}}
.cmp-note{margin-top:10px;font-size:14px;line-height:1.5;color:${T.ink}}
.cmp-note code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.cmp-note b{color:${T.accent}}
.fl-grid{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr);gap:10px;align-items:center}
.fl-tests{display:grid;gap:8px}
.fl-row{display:grid;grid-template-columns:20px minmax(0,1fr) 58px 150px;gap:8px;align-items:center}
.fl-ar,.fl-eq{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.fl-eq{font:700 12px/1.15 ${SANS};white-space:normal}
.fl-box{border:2px solid var(--c);border-radius:12px;padding:8px 10px;background:${T.paper};transition:all .35s}
.fl-box.hl{background:#FFF0EB}
.fl-box small{display:block;font:600 11px ${MONO};color:${T.ink3};margin-bottom:3px}
.fl-box b{font:700 15px ${MONO};color:${T.ink}}
.fl-v{font:700 13px ${SANS};border-radius:10px;padding:8px 10px;text-align:center;animation:mk-up .4s ease both}
.fl-v.ok{background:#E3F5EC;color:${T.green}}
.fl-v.lie{background:#FFF6E2;color:#B45309;border:1.5px dashed #D97706}
.fl-v.bad{background:#FFE4DA;color:${T.accent}}
.fl-note{margin-top:10px;font-size:14px;color:${T.ink}}
.fl-note b{color:${T.accent}}
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
