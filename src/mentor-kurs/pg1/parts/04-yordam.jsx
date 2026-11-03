
// ============================================================
//  MENTOR KURSI · PostgreSQL-1 «Siz bilgan Mongo'dan PostgreSQL jadvallariga»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/06-PostgreSQL1-mentor-v1.md (MD v1, GATE M kutilmoqda)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/pg1-out/ (00–24)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg1/parts/*.jsx > PgIntroMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-pg-01-mongo-dan-postgresql-v1';
const LESSON_TITLE = "Siz bilgan Mongo'dan PostgreSQL jadvallariga";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0' };
MKCFG.root = 'mongo-blog';
MKCFG.kind = (f) => /\.js$/.test(f) ? T.yellow : /\.sql$/.test(f) ? PG.pg : /\.json$/.test(f) ? T.ink2 : null;
MKCFG.files = ['node_modules/', 'blog.js', 'package.json'];

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['psql minus U postgres, minus c va select version', 'psql -U postgres -c "SELECT version();"'],
  ['psql minus U postgres', 'psql -U postgres'], ['createuser minus s postgres', 'createuser -s postgres'],
  ['teskari chiziqcha c blog', '\\c blog'], ['teskari chiziqcha d posts', '\\d posts'], ['teskari chiziqcha dt', '\\dt'],
  ['teskari chiziqcha l', '\\l'], ['teskari chiziqcha q', '\\q'], ['teskari chiziqcha c', '\\c'], ['teskari chiziqcha d', '\\d'],
  ['create database blog', 'CREATE DATABASE blog'], ['serial primary key', 'SERIAL PRIMARY KEY'], ['references users id', 'REFERENCES users(id)'],
  ['posts user id fkey', 'posts_user_id_fkey'], ['user id', 'user_id'], ['users id', 'users.id'],
  ['insert, nol, uch', 'INSERT 0 3'], ['update nol', 'UPDATE 0'], ['update bir', 'UPDATE 1'], ['insert bir', 'INSERT 0 1'],
  ['select version', 'SELECT version();'], ['alter table', 'ALTER TABLE'], ['left join', 'LEFT JOIN'],
  ['postgresql org', 'postgresql.org'], ['postgresapp com', 'postgresapp.com'], ['env example', '.env.example'],
];
DIGITS.unshift(["besh ming to'rt yuz o'ttiz ikki", '5432'], ["to'qson to'qqizinchi", '99-'], ['yigirma oltinchi', '26-'], ['yigirma bir', '21'],
  ['yigirma besh', '25'], ["o'n sakkiz", '18'], ["o'n besh-yigirma", '15–20'], ['bir, ikki, uch', '1, 2, 3'], ['id bir', 'id 1']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /violates foreign key constraint/g, /is not present in table/g, /is still referenced from table/g, /violates check constraint/g,
  /violates not-null constraint/g, /duplicate key value/g, /already exists/g, /syntax error/g, /Connection refused/g,
  /Foreign-key constraints/g, /Command Line Tools/g, /Stack Builder/g, /SQL Shell/g, /Environment Variables/g,
);

// Kod rang beruvchi: JS (Mongo sahnasi) va SQL/psql (qolgan hammasi). Matn — String.raw, HTML'siz.
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
const SQL_KW = /^(SELECT|FROM|WHERE|JOIN|LEFT|ON|AND|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|ALTER|ADD|COLUMN|DROP|PRIMARY|KEY|REFERENCES|NOT|NULL|UNIQUE|CHECK|SERIAL|INT|TEXT|JSONB|BEGIN|COMMIT|ROLLBACK|RETURNING|DEFAULT)$/;
function sqlLine(src) {
  const re = /(--.*$)|('(?:[^']|'')*')|([A-Za-z_][\w]*)|(\d+)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += SQL_KW.test(id) ? `<span class="k">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const sql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: sqlLine(l), ...(meta[i + 1] || {}) }));
// psql terminali: prompt (blog=# · postgres-# · $) alohida rangda; xato qizil, DETAIL/LINE sariq, buyruq javobi yashil
const RESULT_OK = /^(CREATE TABLE|CREATE DATABASE|ALTER TABLE|DROP TABLE|INSERT \d+ \d+|UPDATE [1-9]\d*|DELETE \d+|BEGIN|COMMIT)\s*$/;
function psqlLine(l) {
  let m = /^(\w+[=\-(][*!]?# ?)(.*)$/.exec(l); // blog=# · blog-# · blog(# · tranzaksiyada blog=*# · xatoda blog=!# (pg1-out/25)
  if (m) return `<span class="p">${escH(m[1])}</span>${/^\\/.test(m[2]) ? `<span class="m">${escH(m[2])}</span>` : sqlLine(m[2])}`;
  m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/ERROR:|FATAL:|psql: error|XATO:|not recognized|command not found/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^(DETAIL|HINT|LINE \d|WARNING)|^\s+\^\s*$|Is the server running/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^(UPDATE 0|ROLLBACK)\s*$/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (RESULT_OK.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^(Password for user|Type "help"|psql \()/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*--/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*(SELECT|FROM|JOIN|LEFT|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|BEGIN|COMMIT|\(|\)|id |user_id|izoh|username|nomi|stock|product_id|xaridor|\('|  \(')/.test(l) && !/\|/.test(l)) return sqlLine(l);
  return escH(l);
}
const psql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: psqlLine(l), ...(meta[i + 1] || {}) }));
// Bitta qatorga «at» (qadam) va «id» (yoritish) beruvchi qisqa yozuv: rng(2, 5, {at: 1}) → {2:{at:1}, …, 5:{at:1}}
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});

const Psql = ({ lines, title = 'psql — blog', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Rasmiy hujjatdan olingan maket (bu kompyuterda sinalmagan) — har oynada belgi (MD Ochiq savol 2)
function Win({ title, os = 'win', children, hl }) {
  return <div className={`pg-win${os === 'mac' ? ' mac' : ''}${hl ? ' hl' : ''}`}>
    <div className="bar">{os === 'mac' ? <><i /><i /><i /></> : <span className="ico">▣</span>}<span className="tt">{title}</span><span className="warn">{t('⚠ rasmiy hujjatdan, sinalmagan', '⚠ по официальной документации, не проверено')}</span></div>
    <div className="bd">{children}</div>
  </div>;
}
function MiniTable({ name, cols, rows, hlRow = [], hlCol = [], color = PG.pg, dimRow = [], hlHead = false }) {
  return <div className="pg-mt" style={{ '--c': color }}>
    <div className="nm">{name}</div>
    <table><thead><tr>{cols.map((c, i) => <th key={c} className={hlHead || hlCol.includes(i) ? 'hl' : ''}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className={`${hlRow.includes(i) ? 'hl' : ''}${dimRow.includes(i) ? ' dim' : ''}`}>{r.map((c, j) => <td key={j} className={hlCol.includes(j) ? 'hlc' : ''}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
const Doc = ({ children, odd, er }) => <pre className={`pg-doc${odd ? ' odd' : ''}${er ? ' er' : ''}`}>{children}</pre>;

// PG-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
/* ogohlantirish qutisi — Nest-2 dagi bilan bir xil (u bo'lak bu darsga kirmaydi) */
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-win{background:${T.paper};border:1px solid #CBD2DC;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(15,17,21,.10);transition:box-shadow .3s,border-color .3s}
.pg-win.hl{border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.14),0 10px 30px rgba(15,17,21,.10)}
.pg-win .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F3F3F3;border-bottom:1px solid #DADDE3;font:600 12px ${SANS};color:${T.ink2}}
.pg-win.mac .bar{background:#E8E8EA}
.pg-win .bar i{width:10px;height:10px;border-radius:50%;display:inline-block;background:#FF5F57}
.pg-win .bar i:nth-child(2){background:#FEBC2E}.pg-win .bar i:nth-child(3){background:#28C840}
.pg-win .bar .ico{color:${PG.win};font-size:13px}
.pg-win .bar .warn{margin-left:auto;font:600 10.5px ${MONO};letter-spacing:.04em;color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:3px 7px}
.pg-win .bd{padding:14px 16px;font-size:14px;line-height:1.5}
.pg-win .bd h4{margin:0 0 10px;font-size:16px}
.pg-chk{display:grid;gap:6px;margin:4px 0}
.pg-chk div{display:flex;gap:10px;align-items:center;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;font-size:14px}
.pg-chk div.off{color:${T.ink3};text-decoration:line-through}
.pg-chk div b{font-family:${MONO};font-size:13px;min-width:18px}
.pg-field{display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center;margin:6px 0;font-size:14px}
.pg-field span:last-child{font:13px ${MONO};border:1px solid #BFC6D1;border-radius:6px;padding:6px 10px;background:#fff}
.pg-btn{display:inline-block;margin-top:10px;padding:8px 18px;border-radius:6px;background:${PG.win};color:#fff;font-weight:700;font-size:14px}
.pg-win.mac .pg-btn{background:#1E6FD9}
.pg-mt{border:1.5px solid var(--c);border-radius:12px;overflow:hidden;background:${T.paper}}
.pg-mt .nm{font:700 12px/1 ${MONO};color:#fff;background:var(--c);padding:7px 10px;letter-spacing:.04em}
.pg-mt table{width:100%;border-collapse:collapse;font:12.5px ${MONO}}
.pg-mt th,.pg-mt td{padding:5px 10px;border-bottom:1px solid ${T.line};text-align:left;transition:background .3s}
.pg-mt th{color:${T.ink3};font-weight:600}
.pg-mt th.hl{color:${T.accent};background:#FFF0EB}
.pg-mt td.hlc{background:#FFF7F3;color:${T.accent};font-weight:700}
.pg-mt tr.hl td{background:#FFF0EB}
.pg-mt tr.dim td{opacity:.4}
.pg-doc{margin:0;font:12.5px/1.5 ${MONO};white-space:pre-wrap;word-break:break-word;color:#0B5A33;background:#E9F7EF;border:1.5px solid ${PG.mongo};border-radius:10px;padding:10px 12px}
.pg-doc.odd{color:#7A4B00;background:#FFF6E2;border-color:#E3B341}
.pg-doc.er{color:#8A1C1C;background:#FDECEC;border-color:#F3A6A6}
.pg-dict{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.pg-dict td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:opacity .3s,background .3s}
.pg-dict td:first-child{border-left:4px solid ${PG.mongo};border-radius:10px 0 0 10px}
.pg-dict td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.pg-dict td:nth-child(2){color:${T.ink3};width:28px;text-align:center}
.pg-dict td:nth-child(3){border-left:0}
.pg-dict tr.hl td{background:#FFF7F3}
.pg-dict tr.hl td:first-child{border-left-color:${T.accent}}
.pg-dict tr.dim td{opacity:.4}
.pg-dict code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.pg-dict th{font:600 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;text-align:left;padding:0 12px 4px}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
.pg-lab{font:700 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;color:${T.ink3};margin:0 0 6px;display:flex;gap:8px;align-items:center}
.pg-lab .tm{color:${T.accent}}
.pg-wait{display:inline-flex;gap:8px;align-items:center;font:600 13px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:8px;padding:6px 10px;animation:mk-pulse 1.6s ease-in-out infinite}
.pg-row{display:flex;gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};font:13px ${MONO}}
.pg-row .v{margin-left:auto;font-weight:800;font-size:18px}
.pg-row .v.z{color:${T.accent}}
.pg-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pg-cmp .mk-card h5{display:flex;gap:8px;align-items:center}
.pg-cmp .mk-card h5 i{width:10px;height:10px;border-radius:50%;display:inline-block}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-pg1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-pg1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
