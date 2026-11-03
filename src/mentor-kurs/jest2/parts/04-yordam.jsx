
// ============================================================
//  MENTOR KURSI · Jest-2 «Edge cases va error path: noto'g'ri kirishni sinash»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/jest2-out/ (00–16; har npm test toza muhitda)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest2/parts/*.jsx > JestEdgeMentorLesson.jsx
//  Yordamchilar Jest-1 dan nusxa (SQL/psql/Postman qismlari olib tashlangan — bu darsda kerak emas)
// ============================================================
const LESSON_ID = 'mentor-jest-02-edge-cases-v1';
const LESSON_TITLE = "Edge cases va error path: noto'g'ri kirishni sinash";
const PG = { term: '#111827', termEr: '#1F1115' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.spec\.ts$/.test(f) ? T.purple : /\.ts$/.test(f) ? T.blue : /\.json$/.test(f) ? T.yellow : null;
// O'quvchi reposining to'liq Explorer'i (M27): mavzuga aloqasiz papkalar yopiq; test fayllari ekranga qarab qo'shiladi
const REPO_BASE = ['dist/', 'node_modules/', 'src/api/', 'src/common/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', 'test/', '.env.example', 'nest-cli.json', 'package.json', 'tsconfig.json'];
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
const F = { ord: 'src/order.ts', ordSpec: 'src/order.spec.ts', cup: 'src/coupon.ts', cupSpec: 'src/coupon.spec.ts', ts: 'tsconfig.json' };
const ORD_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);
const CUP_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.cup, F.cupSpec]);
MKCFG.files = ORD_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['received function did not throw', 'Received function did not throw'], ['expected substring', 'Expected substring'], ['received message', 'Received message'],
  ['expected va received', 'Expected va Received'], ['Throw new error', 'throw new Error'], ['throw new error', 'throw new Error'],
  ['isolated modules', 'isolatedModules'], ['ts jest', 'ts-jest'], ['Npm test', 'npm test'], ['Tsc buyrug', 'tsc buyrug'],
  ['npx jest minus minus verbose', 'npx jest --verbose'], ['ikki as any', "'ikki' as any"], ['coupon spec ts', 'coupon.spec.ts'], ['coupon ts', 'coupon.ts'],
  ['apply coupon', 'applyCoupon'], ['order ts', 'order.ts'], ['to throw', 'toThrow'], ['Ikki degan so', "'ikki' degan so"], ['ikki degan so', "'ikki' degan so"],
];
DIGITS.unshift(["minus o'n ming", '−10 000'], ["o'n ming ko'paytirish nol", '10 000 × 0'], ["o'n ming va ikki", '10 000 va 2'], ["to'qson ming", '90 000'],
  ["minus bir dona", '−1 dona'], ['minus bir', '−1'], ['nol dan yuz gacha', '0 dan 100 gacha'], ['nol bilan yuz', '0 bilan 100'], ['nol bilan bir', '0 bilan 1'],
  ['nol va yuz', '0 va 100'], ['yuz bir', '101'], ['yuz foiz', '100 %'], ["o'n foiz", '10 %'], ['nol foiz', '0 %'], ['nol dona', '0 dona'], ["nol so'm", "0 so'm"],
  ['bir dona', '1 dona'], ['ikki dona', '2 dona'], ['ikki kitob', '2 kitob'], ["o'n bir", '11'], ['yigirma bir', '21'], ["to'qson daqiqaning yigirma beshi", '90 daqiqaning 25 tasi'],
  ["besh-o'n daqiqa", '5–10 daqiqa'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'], ["sakkizinchi ekran", '8-ekran'], ["o'ninchi ekran", '10-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /received function did not throw/gi, /did not throw/gi, /expected substring/gi, /received message/gi, /not a number/gi, /isolated modules/gi,
  /happy path/gi, /edge case/gi, /throw new error/gi,
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
// VS Code qizil to'lqin chizig'i (maket, 13-ekran): rang beruvchi chiqargan HTML ichida 'ikki' va null ni o'raydi
const wavy = (line) => ({ ...line, h: line.h.replace(`<span class="s">'ikki'</span>`, `<span class="s j2-wavy">'ikki'</span>`).replace(`<span class="k">null</span>`, `<span class="k j2-wavy">null</span>`) });
// Jest terminali: kod satrlari (N |) birinchi — ular ichidagi «Error» qizil bo'lmasin; PASS/✓ yashil, FAIL/●/✕ qizil
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l) || /^\s+\|\s+\^/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*\d+ \|/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*at /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Expected( substring)?:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received( message)?:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/WARN/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|did not throw|musbat raqam|gacha bo'lsin|suite failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^>|^Snapshots|^Time|^Ran all|^---|^\s*expect\(received\)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal — npm test', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Jest-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* VS Code qizil to'lqin chiziq maketi — 13-ekran */
.j2-wavy{text-decoration:underline wavy #F14C4C;text-decoration-thickness:1.5px;text-underline-offset:4px}
.j2-edge{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
@media (max-width:1300px){.j2-edge{grid-template-columns:repeat(3,minmax(0,1fr))}}
.j2-edge div{border:1.5px solid ${T.line};border-radius:10px;background:${T.paper};padding:10px 8px;text-align:center;font:600 14px ${MONO};transition:opacity .3s,border-color .3s}
.j2-edge div small{display:block;font:500 11.5px ${SANS};color:${T.ink3};margin-top:4px}
.j2-edge div.on{border-color:${T.accent}}
.j2-line{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:6px}
.j2-line div{border-radius:10px;padding:10px 8px;text-align:center;font:700 15px ${MONO};border:1.5px solid}
.j2-line div small{display:block;font:500 12px ${SANS};margin-top:4px}
.j2-line .in{color:${T.green};border-color:${T.green};background:#E3F5EC}
.j2-line .out{color:${T.accent};border-color:${T.accent};background:#FFF0EB}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
