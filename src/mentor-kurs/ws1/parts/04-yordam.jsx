// ============================================================
//  MENTOR KURSI · WebSocket-1 «Jonli panel: server o'zi xabar yuboradi» (v2, F-1104-22)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/19-WS1-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar ws1-start (= cicd2-done) → ws1-done (jonli panel: socket.io gateway, /admin)
//  Kod, terminal, panel holatlari va AI natijalari: 03b-kod.gen.jsx (dev/ws1-kod.py — repo teglari va manba/ws1v2-out, ws1v2-ai dan aynan)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws1/parts/*.jsx > WsBasicsMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws1-01-ulanish-v1'; // M44: id o'zgarmaydi
const LESSON_TITLE = "Jonli panel: server o'zi xabar yuboradi";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', ws: '#0E7490', live: '#B45309', bad: '#C2362B' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.html$/.test(f) ? '#E34F26' : /\.spec\.ts$/.test(f) ? '#99425B' : /\.gateway\.ts$/.test(f) ? C1.ws : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.controller\.ts$/.test(f) ? T.purple : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : /\.md$/.test(f) ? T.ink3 : null;
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
  gw: 'src/api/live/live.gateway.ts', tok: 'src/api/live/admin-token.ts', ctrl: 'src/api/live/admin.controller.ts', mod: 'src/api/live/live.module.ts',
  gws: 'src/api/live/live.gateway.spec.ts', ctrls: 'src/api/live/admin.controller.spec.ts',
  tg: 'src/api/telegram/telegram.service.ts', tgm: 'src/api/telegram/telegram.module.ts', html: 'public/admin.html', cli: 'scripts/live-client.js',
  env: '.env.example', readme: 'README.md',
};
const BASE_FILES = ['node_modules/', F.html, F.cli, 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', 'src/api/catalog/', F.ctrl, F.ctrls, F.tok, F.gw, F.gws, F.mod, 'src/api/order/', F.tg, F.tgm, 'src/api/user/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', F.env, 'package.json', F.readme];
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
  ['npm run live', 'npm run live'], ['npm run smoke live', 'npm run smoke -- live'], ['npm run start dev', 'npm run start:dev'], ['ws1 done', 'ws1-done'],
  ['get admin orders', 'GET /admin/orders'], ['admin orders', '/admin/orders'], ['localhost uch ming admin', 'localhost:3000/admin'], ['get admin', 'GET /admin'],
  ['live gateway ts', 'live.gateway.ts'], ['admin token ts', 'admin-token.ts'], ['is admin token', 'isAdminToken'], ['admin controller', 'AdminController'], ['live module', 'LiveModule'], ['telegram module', 'TelegramModule'],
  ['telegram service ts', 'telegram.service.ts'], ['admin html', 'admin.html'], ['socket io js', 'socket.io.js'], ['live client', 'live-client'],
  ['WebSocket gateway', '@WebSocketGateway'], ['WebSocket server', '@WebSocketServer'], ['handle connection', 'handleConnection'], ['handshake auth token', 'handshake.auth.token'], ['handshake auth', 'handshake.auth'],
  ['client disconnect', 'client.disconnect()'], ['client data admin true', 'client.data.admin = true'], ['order changed', 'order-changed'], ['orders place', 'orders.place'], ['orders set status', 'orders.setStatus'], ['place order', 'placeOrder'],
  ['server emit', 'server.emit'], ['io server disconnect', 'io server disconnect'], ['transport close', 'transport close'], ['xhr poll error', 'xhr poll error'], ['ping timeout', 'ping timeout'], ['connect error', 'connect_error'],
  ['ulanish on', 'ulanish.on'], ['io, auth, token', 'io({ auth: { token } })'], ['admin panel token', 'ADMIN_PANEL_TOKEN'], ['kill minus STOP', 'kill -STOP'], ['Ctrl C', 'Ctrl+C'],
  ['savol belgisi token', '?token='], ['git diff stat', 'git diff --stat'], ['oyin ozgardi', 'oyin-ozgardi'], ['ulanish ts', 'ulanish.ts'], ['m10-02', 'm10-02'], ['m12-dars', 'm12-dars'],
];
DIGITS.unshift(["uch ming bir yuz", '3100'], ["to'rt ming to'rt yuz bir", '4401'], ["bir ming sakkiz", '1008'], ["sakkiz yuz ellik besh", '855'], ["besh yuz o'n ikki", '512'],
  ["to'rt yuz to'rt", '404'], ["to'rt yuz bir", '401'], ["yigirma besh soniyada", '25 soniyada'], ["yigirma soniya", '20 soniya'], ["qirq besh soniya", '45 soniya'], ["qirq uch soniya", '43 soniya'],
  ["o'n besh soniya", '15 soniya'], ["beshdan besh", '5/5'], ["to'qqizdan to'qqiz", '9/9'], ["oxirgi yigirma", 'oxirgi 20'], ["o'n besh daqiqa", '15 daqiqa'], ["yigirma daqiqa", '20 daqiqa'], ["yigirma ekran", '20 ekran'],
  ["sakkizdan o'n", '8 / 10'], ["Uchinchi, beshinchi, oltinchi ekranlarga", '3, 5, 6-ekranlarga'], ["o'ninchi ekran", '10-ekran'], ["oltinchi ekran", '6-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/io server disconnect/gi, /transport close/gi, /xhr poll error/gi, /ping timeout/gi, /connect error/gi, /order changed/gi, /handle connection/gi, /handshake auth token/gi,
  /WebSocket gateway/gi, /WebSocket server/gi, /client disconnect/gi, /server emit/gi, /polling/g, /websocket/g, /socket\.io/g, /snapshot/g, /created/g, /updated/g, /Ctrl C/g, /kill minus STOP/g);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|implements|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown|type|require)$/;
function tsLine(src) {
  const re = /(\/\/.*$|\/\*.*?\*\/|<!--.*?-->)|(`(?:[^`\\]|\\.)*`?|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|(<\/?[a-zA-Z][\w-]*)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, tag, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (tag) out += `<span class="k">${escH(tag)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const mdLine = (src) => /^#/.test(src) ? `<span class="k">${escH(src)}</span>` : /^\|/.test(src) ? escH(src) : `<span class="cm">${escH(src)}</span>`;
// Terminal: server logi va npm run live — ulangan yashil, uzilish/xato qizil, ulanmoqda sariq, hodisa ko'k
function liveLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/order-changed|xabar (snapshot|created|updated|order\/)/.test(l)) return `<span class="ev">${escH(l)}</span>`;
  if (/connect · ulangan|transport: websocket|\[Live\] panel ulandi|NATIJA: \d+\/\d+ ✓|^\s*✓|O'ZGARDI|Tests:\s+\d+ passed|PASS |\bopen$/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/io server disconnect|close \d{4}|Cannot GET|"statusCode":404|^401$|O'ZGARMADI|SERVER XATO|✕|✗/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/ulanmoqda|xhr poll error|transport close|ping timeout|transport: polling|— server/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*#|^LOG \[|^\d\d:\d\d:\d\d — |bot →|bot \(/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const outRange = (k, reA, reB, keep = () => true) => { const L = outLines(k); let a = reA ? L.findIndex((l) => reA.test(l)) : 0; if (a < 0) a = 0; let b = reB ? L.findIndex((l, i) => i > a && reB.test(l)) : L.length; if (b < 0) b = L.length; return L.slice(a, b).filter(keep).map((l) => ({ h: liveLine(l) })); };
const outPick = (k, keep) => outLines(k).filter(keep).map((l) => ({ h: liveLine(l) }));
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: liveLine(l) }));
const txtLines = (s) => s.split('\n').filter((l) => l.trim() !== '').map((l) => ({ h: liveLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const hlOf = (f) => (/\.md$/.test(f) ? mdLine : tsLine);
const lineN = (k, re, from = 1) => { const l = KOD[k].lines.find((x) => x.n >= from && re.test(x.t)); return l ? l.n : 1; };
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

function AiReply({ who, prompt, said, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
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

// Brauzerdagi panel — HAQIQIY bosqichlardan (KOD.PANEL: headless Chrome, 10-panel.txt). Maket: ko'rinish chizilgan, har qator va belgi haqiqiy.
const PCOLS = ['#', 'Mijoz', 'Telefon', 'Mahsulotlar', 'Jami', 'Holat', 'Vaqt'];
const pstage = (k) => KOD.PANEL.find((x) => x.k === k);
function PanelView({ k, note, small }) {
  const st = pstage(k); if (!st) return null;
  const cls = st.belgi === 'Ulangan' ? 'ulangan' : st.belgi === 'Ulanmagan' ? 'ulanmagan' : 'ulanmoqda';
  return <div className={`c1-br${small ? ' sm' : ''}`}>
    <div className="bar"><span className="dots"><i /><i /><i /></span><span className="url">localhost:3000/admin</span><span className="src">{t("haqiqiy brauzer · ", "настоящий браузер · ")}{st.t}</span></div>
    <div className="hd"><b>Buyurtmalar — jonli panel</b><span className={`belgi ${cls}`}>{st.belgi}</span></div>
    {note && <div className="note">{note}</div>}
    <table><thead><tr>{PCOLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{st.rows.map((r, i) => r.msg ? <tr key={i}><td colSpan={7}>{r.msg}</td></tr> : <tr key={i} className={r.yangi ? 'yangi' : ''}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Oqim: bot → tranzaksiya → hodisa → panel → GET → baza
const FLOW = [['bot', 'Bot', "Bobur «Buyurtma berish»", T.blue], ['tx', 'place()', 'tranzaksiya · COMMIT', T.green], ['ev', 'order-changed', '{ orderId, reason }', C1.ws], ['pn', 'Panel', 'tinglovchi → yukla()', C1.live], ['get', 'GET /admin/orders', 'token bilan · bazadan', T.purple]];
function Flow({ hl = [] }) {
  return <div className="c1-flow">{FLOW.map(([k, h, tx, c], i) => <React.Fragment key={k}>
    {i > 0 && <span className="ar">→</span>}
    <div className={hl.includes(k) ? 'hl' : hl.length ? 'dim' : ''} style={{ '--c': c }}><b>{h}</b><small>{tx}</small></div>
  </React.Fragment>)}</div>;
}
// Uch holat kartasi
const STATES = [['ulangan', 'Ulangan', T.green, 'connect · hodisalar keladi', 'ulanish ochiq'], ['ulanmoqda', 'Ulanmoqda…', '#B7791F', 'transport close · xhr poll error · ping timeout', 'active=true — klient o\'zi qayta urinadi'], ['ulanmagan', 'Ulanmagan', T.accent, 'io server disconnect', 'active=false — server yopdi (token), klient urinmaydi']];
function States({ on = -1 }) {
  return <div className="pg-three">{STATES.map(([k, h, c, x, y], i) => <div key={k} className={`c1-state${on === i ? ' hl' : ''}${on >= 0 && on !== i ? ' dim' : ''}`} style={{ '--c': c }}><span className="belgi">{h}</span><code>{x}</code><p>{y}</p></div>)}</div>;
}

// WebSocket-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.w1-sq{display:grid;grid-template-columns:66px minmax(0,1fr) minmax(0,1fr);background:#fff;border:1px solid #D7DCE3;border-radius:14px;overflow:hidden}
.w1-sq>div{padding:7px 10px;border-bottom:1px solid #EEF0F3;font-size:13.5px;display:flex;align-items:center;gap:6px;min-height:40px;min-width:0;overflow-wrap:anywhere}
.w1-sq .hd{font:700 12px system-ui,sans-serif;color:#4B5563;background:#F8FAFC}
.w1-sq .tm{font:600 11.5px ui-monospace,Menlo,Consolas,monospace;color:#6B7280;background:#F8FAFC;white-space:nowrap}
.w1-sq.r{grid-template-columns:66px minmax(0,.75fr) minmax(0,1.25fr)}
.w1-sq .r2l{color:#1D4ED8}.w1-sq .l2r{color:#374151;font:12px ui-monospace,Menlo,Consolas,monospace;white-space:nowrap}.w1-sq .push{color:#15803D;font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;flex-direction:column;align-items:flex-start;gap:0}
.w1-sq .stale{background:#FEF2F2;color:#991B1B;font-weight:600}
.w1-sq .ok{background:#F0FDF4;color:#166534;font-weight:600}
.w1-sq .hl{box-shadow:inset 0 0 0 2px #E2451F}
.w1-a17 td:first-child{font-family:system-ui,sans-serif;font-weight:700;color:#374151;white-space:nowrap}
.w1-a17 td{vertical-align:top}
.w1-a17 tr.w td{background:#FFF7ED}
.w1-a17 .f{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#FFEDD5;color:#C2410C}
.w1-a17 .g{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#DCFCE7;color:#15803D}
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
.mk-panel .ev{color:#7DD3FC;font-weight:700}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${C1.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${C1.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${C1.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px;overflow-wrap:anywhere}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
/* Brauzer paneli (haqiqiy bosqichlardan) */
.c1-br{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:#1F2328}
.c1-br .bar{display:flex;gap:10px;align-items:center;padding:7px 12px;background:#EEF1F4;border-bottom:1px solid #D0D7DE;font:12px ${SANS}}
.c1-br .dots{display:inline-flex;gap:5px}
.c1-br .dots i{width:10px;height:10px;border-radius:50%;background:#C9CED6;display:inline-block}
.c1-br .url{flex:1;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 10px;font:12px ${MONO};color:#57606A}
.c1-br .src{font:600 10.5px ${MONO};color:#57606A}
.c1-br .hd{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #EAEEF2}
.c1-br .hd b{font-size:15px}
.c1-br .belgi{margin-left:auto;padding:3px 10px;border-radius:999px;font:700 12px ${SANS};color:#fff;background:#57606A}
.c1-br .belgi.ulangan{background:#1A7F37}
.c1-br .belgi.ulanmoqda{background:#9A6700}
.c1-br .belgi.ulanmagan{background:#CF222E}
.c1-br .note{padding:6px 14px;font:12.5px ${SANS};color:#57606A;background:#F6F8FA;border-bottom:1px solid #EAEEF2}
.c1-br table{width:100%;border-collapse:collapse;font-size:13px}
.c1-br th,.c1-br td{padding:7px 10px;text-align:left;border-bottom:1px solid #EAEEF2}
.c1-br th{background:#F6F8FA;font-size:12px;color:#57606A}
.c1-br tr.yangi td{background:#FFF8C5;transition:background .4s}
.c1-br.sm table{font-size:12px}
.c1-br.sm th,.c1-br.sm td{padding:5px 8px}
/* Oqim */
.c1-flow{display:flex;align-items:stretch;gap:6px;flex-wrap:wrap}
.c1-flow>div{flex:1;min-width:110px;border:2px solid var(--c);border-radius:12px;padding:9px 10px;background:${T.paper};display:grid;gap:3px;transition:opacity .3s,box-shadow .3s}
.c1-flow>div b{font:800 13px ${MONO};color:var(--c)}
.c1-flow>div small{font-size:12px;color:${T.ink2};line-height:1.35}
.c1-flow>div.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.c1-flow>div.dim{opacity:.35}
.c1-flow .ar{align-self:center;font:700 18px ${MONO};color:${T.ink3}}
/* Uch holat */
.c1-state{border:2px solid var(--c);border-radius:14px;padding:12px 14px;background:${T.paper};display:grid;gap:6px;align-content:start;transition:opacity .3s,box-shadow .3s}
.c1-state .belgi{justify-self:start;padding:3px 10px;border-radius:999px;font:700 12.5px ${SANS};color:#fff;background:var(--c)}
.c1-state code{font:12px ${MONO};color:${T.ink};background:#F4F5F7;border-radius:6px;padding:4px 7px;overflow-wrap:anywhere}
.c1-state p{margin:0;font-size:13px;color:${T.ink2};line-height:1.4}
.c1-state.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.c1-state.dim{opacity:.35}
.c1-res{width:100%;border-collapse:separate;border-spacing:0 5px;font-size:13px}
.c1-res th{font:700 12px ${SANS};color:${T.ink2};text-align:left;padding:3px 10px}
.c1-res td{padding:7px 10px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};font:12.5px ${MONO}}
.c1-res td:first-child{font:600 13px ${SANS};border-left:1px solid ${T.line};border-radius:8px 0 0 8px}
.c1-res td:last-child{border-right:1px solid ${T.line};border-radius:0 8px 8px 0}
.c1-res .ok{color:${T.green};font-weight:700}
.c1-small .mk-panel{font-size:12px}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-ws1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
