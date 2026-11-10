// ============================================================
//  MENTOR KURSI · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz» (v2, F-1104-23)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/21-WS2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar ws2-start (= ws1-done) → ws2-done (connect'da qayta so'rash, BUZISH.md)
//  Kod, terminal, panel holatlari va AI natijalari: 03b-kod.gen.jsx (dev/ws2-kod.py — repo teglari va manba/ws2v2-out, ws2v2-ai dan aynan)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws2/parts/*.jsx > WsReconnectMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws2-01-qayta-ulanish-v1'; // M44: id o'zgarmaydi (v1 dagi qiymat)
const LESSON_TITLE = "Ulanish uzilsa: buzamiz va tuzatamiz";
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
  tg: 'src/api/telegram/telegram.service.ts', html: 'public/admin.html', cli: 'scripts/live-client.js', buz: 'BUZISH.md', readme: 'README.md',
};
const BASE_FILES = ['node_modules/', F.html, F.cli, 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', 'src/api/catalog/', F.ctrl, F.tok, F.gw, F.mod, 'src/api/order/', F.tg, 'src/api/user/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', 'package.json', F.buz, F.readme];
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
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};
const SPOKEN = [
  ['npm run live', 'npm run live'], ['npm run start dev', 'npm run start:dev'], ['ws2 start', 'ws2-start'], ['ws2 done', 'ws2-done'], ['ws1 done', 'ws1-done'],
  ['get admin orders', 'GET /admin/orders'], ['localhost uch ming admin', 'localhost:3000/admin'],
  ['admin html', 'admin.html'], ['live client', 'live-client'], ['telegram service', 'telegram.service'], ['on module init', 'onModuleInit'], ['bot launch', 'bot.launch'],
  ['order changed', 'order-changed'], ['server emit', 'server.emit'], ['transport close', 'transport close'], ['xhr poll error', 'xhr poll error'], ['ping timeout', 'ping timeout'],
  ['connection state recovery', 'connectionStateRecovery'], ['socket recovered true', 'socket.recovered = true'], ['recovered true', 'recovered=true'], ['recovered false', 'recovered=false'],
  ['No throttling', 'No throttling'], ['Ctrl C', 'Ctrl+C'], ['F12', 'F12'], ['BUZISH fayli', 'BUZISH.md fayli'], ['oyin ochildi', 'oyin-ochildi'], ['ulanish ts', 'ulanish.ts'],
  ['m10-05', 'm10-05'], ['ulanish on', 'ulanish.on'],
];
DIGITS.unshift(["o'n to'qqiz ekran", '19 ekran'], ["o'ttiz ikki", '32'], ["to'qqizdan to'qqiz", '9/9'], ["o'n besh daqiqa", '15 daqiqa'], ["yigirma daqiqa", '20 daqiqa'],
  ["yigirma besh va yigirma", '25 va 20'], ["qirq besh soniya", '45 soniya'], ["olti soniya", '6 soniya'], ["O'ttiz uchinchi soniyada", '33-soniyada'], ["sakkizinchi ekran", '8-ekran'], ["to'rtinchi ekran", '4-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/transport close/gi, /xhr poll error/gi, /ping timeout/gi, /order changed/gi, /server emit/gi, /connection state recovery/gi, /socket recovered true/gi, /recovered (true|false)/gi,
  /on module init/gi, /bot launch/gi, /No throttling/g, /Offline/g, /Online/g, /Network/g, /websocket/g, /socket\.io/g, /jsdom/g, /Chrome/g, /Ctrl C/g, /deploy/g);

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
  if (/order-changed|kadr keldi/.test(l)) return `<span class="ev">${escH(l)}</span>`;
  if (/recovered=false|YO'Q —|SERVER XATO|✕|✗/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/connect · ulangan|recovered=true|transport: websocket|\[Live\] panel ulandi|NATIJA: \d+\/\d+ ✓|^\s*✓|Tests:\s+\d+ passed|PASS |WebSocket ochildi|→ «Ulangan»|GET \/admin\/orders → \d+ ta/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/io server disconnect|Token noto'g'ri|«Ulanmagan»/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/ulanmoqda|Ulanmoqda|xhr poll error|transport close|ping timeout|WebSocket yopildi|Offline yoqildi|TARMOQ UZILDI|— server|tarmoq uzildi/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*#|^LOG \[|^\d\d:\d\d:\d\d — |bot →|bot \(/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const outRange = (k, reA, reB, keep = () => true) => { const L = outLines(k); let a = reA ? L.findIndex((l) => reA.test(l)) : 0; if (a < 0) a = 0; let b = reB ? L.findIndex((l, i) => i > a && reB.test(l)) : L.length; if (b < 0) b = L.length; return L.slice(a, b).filter(keep).map((l) => ({ h: liveLine(l) })); };
const outPick = (k, keep) => outLines(k).filter(keep).map((l) => ({ h: liveLine(l) }));
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: liveLine(l) }));
const txtLines = (s) => s.split('\n').filter((l) => l.trim() !== '').map((l) => ({ h: liveLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
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

// Brauzerdagi panel — HAQIQIY suratlardan (KOD.PANEL: headless Chrome, ws2v2-panel.mjs SURAT qatorlari). Maket: ko'rinish chizilgan, har qator va belgi haqiqiy.
const PCOLS = ['#', 'Mijoz', 'Telefon', 'Mahsulotlar', 'Jami', 'Holat', 'Vaqt'];
const pstage = (k) => KOD.PANEL.find((x) => x.k === k);
function PanelView({ k, note, small, label }) {
  const st = pstage(k); if (!st) return null;
  const cls = st.belgi === 'Ulangan' ? 'ulangan' : st.belgi === 'Ulanmagan' ? 'ulanmagan' : 'ulanmoqda';
  return <div className={`c1-br${small ? ' sm' : ''}`}>
    <div className="bar"><span className="dots"><i /><i /><i /></span><span className="url">localhost:3000/admin</span><span className="src">{label || t('haqiqiy brauzer', "настоящий браузер")} · {st.t}</span></div>
    <div className="hd"><b>Buyurtmalar — jonli panel</b><span className={`belgi ${cls}`}>{st.belgi}</span></div>
    {note && <div className="note">{note}</div>}
    <table><thead><tr>{PCOLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{st.rows.map((r, i) => r.msg ? <tr key={i}><td colSpan={7}>{r.msg}</td></tr> : <tr key={i} className={r.yangi ? 'yangi' : ''}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Vaqt chizig'i: [kalit, sarlavha, izoh, rang]
function Flow({ items, hl = [] }) {
  return <div className="c1-flow">{items.map(([k, h, tx, c], i) => <React.Fragment key={k}>
    {i > 0 && <span className="ar">→</span>}
    <div className={hl.includes(k) ? 'hl' : hl.length ? 'dim' : ''} style={{ '--c': c }}><b>{h}</b><small>{tx}</small></div>
  </React.Fragment>)}</div>;
}
// Chiqish faylining bo'limi: «## <nom>» dan keyingi «## » gacha (bo'sh qatorlarsiz); panel logida millisekund olib tashlanadi
const secRaw = (k, name) => { const L = KOD.OUT[k].split('\n'); const a = L.findIndex((l) => l.startsWith('## ' + name)); if (a < 0) return []; const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a + 1, b < 0 ? L.length : b).filter((l) => l.trim() !== '' && !/^\s{4}/.test(l)); };
const ms = (l) => l.replace(/^(\d\d:\d\d:\d\d)\.\d{3}/, '$1').replace(/SURAT \S+ \([^)]*\) — /, t('ekranda: ', "на экране:"));
const sec = (k, name, keep = () => true) => secRaw(k, name).filter(keep).map((l) => ({ h: liveLine(ms(l)) }));
const lastLine = (k, re) => (KOD.OUT[k].split('\n').filter((l) => re.test(l)).pop() || '');
// Network: har order-changed kadridan keyin nechta GET /admin/orders (06 — tinglovchi connect ichida)
function netGroups(k) {
  const L = secRaw(k, 'Brauzer'); const out = []; let rc = -1;
  L.forEach((l, i) => {
    if (/WebSocket ochildi/.test(l)) rc++;
    if (/kadr keldi/.test(l)) { const id = (l.match(/"orderId":(\d+)/) || [])[1]; let n = 0; for (let j = i + 1; j < L.length && /GET \/admin\/orders/.test(L[j]); j++) n++; out.push({ id, rc: Math.max(rc, 0), n }); }
  });
  return out;
}
function NetList({ k, upto = 99 }) {
  const G = netGroups(k).slice(0, upto);
  return <div className="c2-net"><div className="hd"><b>Network</b><span>{t("filtr: orders", "фильтр: orders")}</span></div>
    {G.map((g, i) => <div key={i} className="row" style={{ animation: `mk-up .35s ${i * 0.12}s ease both` }}>
      <span className="ev">order-changed #{g.id}</span><span className="rc">{g.rc === 0 ? t('birinchi ulanish', "первое подключение") : t(`${g.rc} qayta ulanishdan keyin`, `после ${g.rc}-го переподключения`)}</span>
      <span className="gets">{Array.from({ length: g.n }, (_, j) => <i key={j}>GET</i>)}</span><b className={g.n > 1 ? 'bad' : ''}>×{g.n}</b>
    </div>)}
  </div>;
}

// WebSocket-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.w2-r13 td,.w2-r14 td,.w2-a2 td{vertical-align:top}
.w2-r13 .bz{display:inline-block;font:700 11.5px system-ui,sans-serif;border-radius:999px;padding:1px 7px;background:#DC2626;color:#fff;white-space:nowrap}
.w2-r13 .tk{display:inline-block;font:700 11.5px system-ui,sans-serif;border-radius:999px;padding:1px 7px;background:#DCFCE7;color:#15803D;white-space:nowrap}
.w2-r13 td.s{background:#FEF2F2}.w2-r13 td.d{background:#F0FDF4}
.w2-r14 .y{color:#15803D;font-weight:700}.w2-r14 .n{color:#DC2626;font-weight:700}.w2-r14 td.c,.w2-r14 th.c{text-align:center}
.w2-a2 td:first-child{font-family:system-ui,sans-serif;font-weight:700;color:#374151;white-space:nowrap}
.w2-a2 tr.w td{background:#FFF7ED}
.w2-a2 .f{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#FFEDD5;color:#C2410C}
.w2-a2 .g{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#DCFCE7;color:#15803D}
.w2-b3 td{vertical-align:top}
.w2-b3 tr.w td{color:#9CA3AF}
.w2-b3 .bz{display:inline-block;font:700 12px system-ui,sans-serif;border-radius:999px;padding:2px 8px;background:#DC2626;color:#fff;white-space:nowrap}
.w2-vw-card{background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:12px 10px 6px}
.w2-vw-card svg{display:block;width:100%;height:auto}
.w2-vw-card .tt{font:12px ui-monospace,Menlo,Consolas,monospace;fill:#6B7280}
.w2-vw-card .ll{font:700 13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:#374151}
.w2-vw-card .ss{font:12.5px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.w2-res{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:10px}
.w2-res>div{border-radius:12px;padding:10px 12px;display:grid;gap:4px;font-size:14px;background:#fff;border:1.5px solid #D7DCE3;align-content:start}
.w2-res small{font:600 11px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.w2-res b{font:700 18px ui-monospace,Menlo,Consolas,monospace}
.w2-res .bad{border-color:#E2451F;background:#FFF5F2}
.w2-res .fix{border-color:#0E7490}
.w2-res .fix code{font:13px ui-monospace,Menlo,Consolas,monospace;background:#ECFEFF;color:#0E7490;border-radius:5px;padding:1px 5px}
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
.c1-br td{white-space:nowrap}
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
/* Network ro'yxati (06) */
.c2-net{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;font:12.5px ${MONO};color:#1F2328}
.c2-net .hd{display:flex;gap:10px;align-items:center;padding:7px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE}
.c2-net .hd span{color:#57606A}
.c2-net .row{display:grid;grid-template-columns:150px minmax(0,1fr) auto 36px;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid #EAEEF2}
.c2-net .ev{color:${C1.ws};font-weight:700}
.c2-net .rc{color:#57606A;font-family:${SANS}}
.c2-net .gets{display:flex;gap:4px}
.c2-net .gets i{font-style:normal;background:#DDF4FF;color:#0969DA;border-radius:5px;padding:2px 6px;font-size:11px}
.c2-net b{text-align:right}
.c2-net b.bad{color:${T.accent}}
/* DevTools maketi */
.c2-dev{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;font:12.5px ${SANS};color:#1F2328}
.c2-dev .tabs{display:flex;gap:16px;padding:7px 12px;background:#F3F3F3;border-bottom:1px solid #D0D7DE;color:#57606A}
.c2-dev .tabs b{color:#1A73E8;border-bottom:2px solid #1A73E8;padding-bottom:4px}
.c2-dev .tool{display:flex;gap:12px;align-items:center;padding:8px 12px;border-bottom:1px solid #EAEEF2}
.c2-dev .sel{border:1px solid #D0D7DE;border-radius:5px;padding:3px 8px;background:#fff}
.c2-dev .sel.off{border-color:${T.accent};color:${T.accent};font-weight:700;box-shadow:0 0 0 3px rgba(194,54,43,.12)}
.c2-dev .list{display:grid;gap:2px;padding:8px 12px}
.c2-dev .list span{color:#57606A}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-ws2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
