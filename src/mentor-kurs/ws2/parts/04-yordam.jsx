
// ============================================================
//  MENTOR KURSI · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/21-WS2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/ws2-out/ (00–06) va ws2-amal-out/ (00–04; amaliyotlar mentor yo'lida)
//  O'quvchi loyihasi maydon-jamoa (m12-dars-05-start = 04-done kodi · m12-dars-05-done): Backend haqiqiy, ilova o'rniga Node klient
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws2/parts/*.jsx > WsReconnectMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws2-01-qayta-ulanish-v1';
const LESSON_TITLE = "Ulanish uzilsa: buzamiz va tuzatamiz";
const WS = { term: '#111827', termEr: '#1F1115', amber: '#D08A1E', grey: '#8A94A3' };
MKCFG.root = 'maydon-jamoa';
MKCFG.kind = (f) => /\.gateway\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|tsx|js)$/.test(f) ? T.blue : /\.json$|^\.env|\.env/.test(f) ? T.yellow : null;
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
// O'quvchi reposi maydon-jamoa (m12-dars-05-done) — haqiqiy fayl nomlari; mentorning kichik klienti (ws2-klient.js)
const RF = { gw: 'backend/src/oyinlar.gateway.ts', ul: 'mobil/src/ulanish.ts', app: 'mobil/src/app/index.tsx', oyin: 'mobil/src/app/oyin/[id].tsx', buz: 'BUZISH.md', env: 'backend/.env' };
const REPO_FILES = tree(['backend/node_modules/', 'backend/src/app.module.ts', 'backend/src/main.ts', RF.gw, 'backend/src/oyinlar.controller.ts', 'backend/src/royxat.controller.ts', 'backend/src/kirish.controller.ts', 'backend/.env.example', RF.env, 'backend/package.json', 'mobil/src/api.ts', RF.app, RF.oyin, RF.ul, 'mobil/package.json', RF.buz, 'README.md']);
const KLIENT_FILES = tree(['node_modules/', 'klient.js', 'package.json', 'package-lock.json']);
MKCFG.files = REPO_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['m12 dars besh start', 'm12-dars-05-start'], ['m12 dars besh done', 'm12-dars-05-done'], ['m12 dars uch', 'm12-dars-03'],
  ['socket io', 'socket.io'], ['Socket io', 'socket.io'], ['oyin ozgardi', 'oyin-ozgardi'], ['Oyin ozgardi', 'oyin-ozgardi'], ['oyin ochildi', 'oyin-ochildi'],
  ['ulanish ts', 'ulanish.ts'], ['Ulanish ts', 'ulanish.ts'], ['klient js', 'klient.js'], ['Connect', 'connect'], ['Ctrl C', 'Ctrl+C'],
];
DIGITS.unshift(["ikki yuz bir", '201'], ["o'n to'qqiz ekran", '19 ekran'], ["o'n beshinchi ekranda", '15-ekranda'], ["sakkizinchi ekrandagi", '8-ekrandagi'],
  ["Ikkinchi, to'rtinchi, oltinchi ekranlarga", '2, 4, 6-ekranlarga'], ["Ellikinchi satr", '50-satr'], ["o'n besh daqiqa", '15 daqiqa'], ["Besh daqiqa", '5 daqiqa'],
  ["qirq-oltmish daqiqa", '40–60 daqiqa'], ["o'yin uch", "o'yin 3"], ["uchinchi o'yinga", "3-o'yinga"], ['ekranda olti', 'ekranda 6'], ['ilovani ochdi: olti', 'ilovani ochdi: 6'],
  ['hali olti', 'hali 6'], ["Backend'da esa yetti", "Backend'da esa 7"], ['sakkiz oldi', '8 ni oldi'], ["Backend'da ham sakkiz", "Backend'da ham 8"], ['Vali bir ko\'rdi', "Vali 1 ni ko'rdi"],
  ['ikkalasi ikki ko\'radi', "ikkalasi 2 ni ko'radi"], ['Hozir ko\'ryapti: bir', "Hozir ko'ryapti: 1"], ['To\'g\'ri, bir', "To'g'ri, 1"]);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(/transport close/gi, /xhr poll error/gi);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|function|return|const|let|class|implements|private|readonly|constructor|this|if|new|typeof|as|any|type|null|true|false|async|await|void)$/;
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|(@?[A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^@/.test(id) ? `<span class="d">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// Terminal: klient holatlari — ulangan yashil, ulanmoqda sariq, ulanmagan qizil; HODISA yashil; Backend LOG yashil, ERROR qizil
function termLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*#/.test(l) || /^\s*[\d.]+s\s+---/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/HODISA|successfully started|^LOG |\bulangan\b|\[HTTP 20\d\]|^added \d+|CREATE DATABASE|HEAD is now/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\bulanmoqda\b|Retrying|transport:/.test(l)) return `<span class="wn">${escH(l)}</span>`; // connect_error ham sariq — holat «ulanmoqda»
  if (/\bulanmagan\b|ERROR|error:|\[HTTP 4\d\d\]|ECONNREFUSED/.test(l)) return `<span class="er">${escH(l)}</span>`;
  return escH(l);
}
const tm = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: termLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? WS.termEr : WS.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Ilova ekrani — MAKET (telefon/Expo'da sinamadik): belgi matni va rangi o'quvchi ilovasidan (mobil/src/app/index.tsx BELGI), sonlar haqiqiy chiqishdan
const BELGI = { ulangan: ['Ulangan', T.green], ulanmoqda: ['Ulanmoqda…', WS.amber], ulanmagan: ['Ulanmagan', WS.grey] };
function Phone({ who, holat = 'ulangan', rows = [], note, mark, badge = true, ekran = "O'yinlar" }) {
  const [m, c] = BELGI[holat];
  return <div className={`ws-ph${mark ? ' ' + mark : ''}`}>
    <div className="top"><span className="who">{who}</span><span className="warn">⚠ maket · sonlar haqiqiy</span></div>
    <div className="hd"><b>{ekran}</b>{badge && <span className="bg" style={{ color: c }}><i style={{ background: c }} />{m}</span>}</div>
    {rows.map(([n, v, hl], i) => <div key={i} className={`rw${hl ? ' ' + hl : ''}`}><span>{n}</span><b>{v}</b></div>)}
    {note && <div className="nt">{note}</div>}
  </div>;
}

// WebSocket-2 ga xos qo'shimcha CSS (WebSocket-1 dan nusxa; dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
/* Xulosa qadamida tor ekranda (1280) katta oyna yashiriladi — xulosa ko'rinib tursin */
@media (max-width:1300px){.j2-wide-only{display:none}}
/* Ilova ekrani maketi (ikki telefon yonma-yon) */
.ws-phones{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
.ws-ph{background:#fff;border:1px solid ${T.line};border-radius:18px;padding:10px 12px 12px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.ws-ph.bad{border-color:${T.accent}}
.ws-ph.good{border-color:${T.green}}
.ws-ph .top{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.ws-ph .who{font:700 13px ${SANS};color:${T.ink}}
.ws-ph .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:2px 6px}
.ws-ph .hd{display:flex;align-items:center;gap:8px;padding:6px 2px 8px;border-bottom:1px solid ${T.line}}
.ws-ph .hd b{font-size:16px}
.ws-ph .bg{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font:700 12.5px ${SANS}}
.ws-ph .bg i{width:9px;height:9px;border-radius:50%;display:inline-block}
.ws-ph .rw{display:flex;gap:8px;align-items:center;padding:9px 2px;border-bottom:1px dashed ${T.line};font-size:13.5px}
.ws-ph .rw b{margin-left:auto;font:800 16px ${MONO}}
.ws-ph .rw.old b{color:${T.accent}}
.ws-ph .rw.new b{color:${T.green}}
.ws-ph .nt{margin-top:8px;font:12px ${MONO};color:${T.ink3}}
/* Uch holat belgisi */
.ws-badges{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ws-badge{border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px;transition:opacity .3s,border-color .3s}
.ws-badge.hl{border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset}
.ws-badge.dim{opacity:.4}
.ws-badge .bg{display:inline-flex;align-items:center;gap:7px;font:800 15px ${SANS};color:var(--c)}
.ws-badge .bg i{width:11px;height:11px;border-radius:50%;background:var(--c);display:inline-block}
.ws-badge p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.ws-badge code{font-size:12px}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-ws2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
