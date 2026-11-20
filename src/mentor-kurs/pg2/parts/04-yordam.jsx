
// ============================================================
//  MENTOR KURSI · PostgreSQL-2 «CRUD so'rovlar va Express'dan bazaga»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/08-PostgreSQL2-mentor-v2.md (MD v2 — M41 «avval mentor o'rganadi», GATE M 03.11: 1A·2C·3A·4A)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/pg2-out/ — v2b (3→11 uzluksiz), v2e (ikki psql seansi), v2f (14–18 uzluksiz), v2d (Mongoose), 10–20 (Express)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg2/parts/*.jsx > PgCrudMentorLesson.jsx
//  Yordamchilar PG-1 dan nusxa (pg1/parts/04-yordam.jsx) — darslar bir-biriga bog'liq emas
// ============================================================
const LESSON_ID = 'mentor-pg-02-crud-express-v1';
const LESSON_TITLE = "CRUD so'rovlar va Express'dan bazaga";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0', post: '#FF6C37' };
MKCFG.root = 'avto-ijara-server';
MKCFG.kind = (f) => /\.js$/.test(f) ? T.yellow : /\.sql$/.test(f) ? PG.pg : /\.json$/.test(f) ? T.ink2 : null;
MKCFG.files = ['node_modules/', 'package.json', 'server.js'];
// Mongoose jufti — bitta xira qator (M45): dvigatel .mk-pair
const Pair = ({ code, res }) => <div className="mk-pair"><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>{code}</code>{res ? <> → {res}</> : null}</div>;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  // F-1120-02 (M52): 4-element — act (mentor o'zi bosadi, chap paneldagi ko'rsatma)
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['psql minus U postgres', 'psql -U postgres'], ['backslash d products', '\\d products'], ['backslash d cars', '\\d cars'],
  ['backslash l', '\\l'], ['backslash d', '\\d'], ['backslash c', '\\c'],
  ['app use express json', 'app.use(express.json())'], ['express json', 'express.json()'], ['pool query', 'pool.query'], ['res json', 'res.json'],
  ['req body', 'req.body'], ['node server js', 'node server.js'], ['server js', 'server.js'], ['console error', 'console.error'], ['err message', 'err.message'],
  ['daily price', 'daily_price'], ['is rented', 'is_rented'], ['car rental', 'car_rental'], ['avto ijara server', 'avto-ijara-server'], ['rowCount', 'rowCount'],
  ['dollar bir, dollar ikki', '$1, $2'], ['dollar bir', '$1'], ['dollar ikki', '$2'], ['bir or bir teng bir', '1 OR 1=1'],
  ['order by id', 'ORDER BY id'], ['order by', 'ORDER BY'], ['returning yulduzcha', 'RETURNING *'], ['select yulduzcha', 'SELECT *'],
  ['insert, nol, uch', 'INSERT 0 3'], ['insert nol bir', 'INSERT 0 1'], ['update bir', 'UPDATE 1'], ['update nol', 'UPDATE 0'], ['update uch', 'UPDATE 3'],
  ['delete bir', 'DELETE 1'], ['delete uch', 'DELETE 3'], ['deleted uch', 'deleted: 3'], ['not null', 'NOT NULL'], ['default false', 'DEFAULT false'],
  ['where name is null', 'WHERE name IS NULL'], ['process env', 'process.env'], ['Ctrl C', 'Ctrl+C'], ['npm init', 'npm init -y'],
  // v2 (03.11)
  ['create database', 'CREATE DATABASE'], ['create table', 'CREATE TABLE'], ['insert into', 'INSERT INTO'], ['nol vergul olti', '(0,6)'], ['nol vergul besh', '(0,5)'],
  ['matchedCount nol', 'matchedCount: 0'], ['dollar lt', '$lt'], ['check stock katta yoki teng nol', 'CHECK (stock >= 0)'], ['alter table', 'ALTER TABLE'], ['set not null', 'SET NOT NULL'],
  ['rowcount', 'rowCount'], ['Rowcount', 'rowCount'], ['update nol', 'UPDATE 0'], ['insert nol to\'rt', 'INSERT 0 4'], ['teng, yulduzcha, panjara', '=*#'], ['undov belgisi', '!'],
];
DIGITS.unshift(["sakson to'qqiz ming", '89 000'], ["to'qson to'qqiz ming", '99 000'], ['yuz ming', '100 000'], ['ellik ming', '50 000'], ["o'ttiz ming", '30 000'],
  ["to'qson to'qqizinchi", '99-'], ['yigirma bir', '21'], ['yigirma beshi', '25 tasi'], ["o'n besh-yigirma", '15–20'], ["besh-o'n", '5–10'],
  ['bir, ikki, uch, to\'rt', '1, 2, 3, 4'], ['id bir', 'id 1'], ['id uch', 'id 3'], ["to'qqiz ekran", '9 ekran']);
// F-1109-01: gap boshidagi «Backslash l» ham «Matn»da kod bo'lib ko'rinsin
SPOKEN.push(...SPOKEN.filter(([a]) => a.startsWith('backslash')).map(([a, b]) => ['B' + a.slice(1), b]));
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /violates foreign key constraint/g, /is not present in table/g, /is still referenced from table/g, /violates check constraint/g,
  /violates not-null constraint/g, /duplicate key value/g, /already exists/g, /syntax error/g, /Connection refused/g,
  /Cannot destructure property/g, /client password must be a string/g, /there is no transaction in progress/g, /permission denied/g,
  /invalid input syntax for type integer/g, /has more target columns than expressions/g, /address already in use/g, /Perhaps you meant/g,
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
// Galma-gal terminal: faqat oxirgi kelgan qadam guruhi (at) — eski buyruqlar ekrandan ketadi (memory «ma'lumot galma-gal»)
const cur = (lines, beat) => { const ats = lines.map((l) => l.at).filter((x) => x != null && x <= beat); const m = ats.length ? Math.max(...ats) : null; return lines.filter((l) => l.at == null || l.at === m); };
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});

const Psql = ({ lines, title = 'psql — blog', er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
// Rasmiy hujjatdan olingan maket (bu kompyuterda sinalmagan) — har oynada belgi (MD Ochiq savol 2)
function Win({ title, os = 'win', children, hl }) {
  return <div className={`pg-win${os === 'mac' ? ' mac' : ''}${hl ? ' hl' : ''}`}>
    <div className="bar">{os === 'mac' ? <><i /><i /><i /></> : <span className="ico">▣</span>}<span className="tt">{title}</span><span className="warn">{t('⚠ rasmiy hujjatdan, sinalmagan', '⚠ по официальной документации, не проверено')}</span></div>
    <div className="bd">{children}</div>
  </div>;
}
function MiniTable({ name, cols, rows, hlRow = [], hlCol = [], color = PG.pg, dimRow = [] }) {
  return <div className="pg-mt" style={{ '--c': color }}>
    <div className="nm">{name}</div>
    <table><thead><tr>{cols.map((c, i) => <th key={c} className={hlCol.includes(i) ? 'hl' : ''}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className={`${hlRow.includes(i) ? 'hl' : ''}${dimRow.includes(i) ? ' dim' : ''}`}>{r.map((c, j) => <td key={j} className={hlCol.includes(j) ? 'hlc' : ''}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Postman ko'rinishidagi karta (PRD Q2): javob — haqiqiy, curl bilan olingan (pg2-out)
const METHOD_C = { GET: '#61AFFE', POST: '#49CC90', PUT: '#FCA130', DELETE: '#F93E3E' };
function PostmanCard({ m, url, body, st, res, hl }) {
  const c = String(st)[0];
  return <div className={`pg-pm${hl ? ' hl' : ''}`}>
    <div className="top"><span className="lg">Postman</span><span className="m" style={{ background: METHOD_C[m] }}>{m}</span><span className="u">{url}</span><span className="tg">{t("haqiqiy javob", "настоящий ответ")}</span></div>
    {body && <pre className="b">{body}</pre>}
    <div className="r"><span className={`st s${c}`}>{st}</span><pre>{res}</pre></div>
  </div>;
}
const Doc = ({ children, odd, er }) => <pre className={`pg-doc${odd ? ' odd' : ''}${er ? ' er' : ''}`}>{children}</pre>;

// PG-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.p2-vs-card{background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:14px 10px 8px}
.p2-vs-card svg{display:block;width:100%;height:auto}
.p2-vs-card .nd{font:700 20px ui-monospace,Menlo,Consolas,monospace}
.p2-vs-card .in{font:13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:#CBD5E1}
.p2-vs-card .lb{font:700 14px ui-monospace,Menlo,Consolas,monospace}
.p2-lanes{display:grid;grid-template-columns:92px 1fr 1fr 1fr;background:#fff;border:1px solid #D7DCE3;border-radius:14px;overflow:hidden}
.p2-lanes>div{padding:10px 12px;border-bottom:1px solid #EEF0F3;font-size:14px;line-height:1.35;display:flex;align-items:center;gap:8px;min-height:46px}
.p2-lanes .h{font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;background:#F8FAFC}
.p2-lanes .tm{font:600 12px ui-monospace,Menlo,Consolas,monospace;color:#6B7280;background:#F8FAFC}
.p2-lanes code{font:13px ui-monospace,Menlo,Consolas,monospace;background:#F1F3F6;border-radius:5px;padding:1px 6px}
.p2-cn{display:flex;align-items:center;gap:6px;flex:1}
.p2-cn i{flex:1;height:0;border-top:2px dashed #C3CAD4}
.p2-cn.on i{border-top:3px solid #336791}
.p2-pid{font:700 13px ui-monospace,Menlo,Consolas,monospace;color:#fff;background:#336791;border-radius:6px;padding:2px 8px;white-space:nowrap}
.p2-bad{border:2px solid #E2451F;border-radius:14px;background:#FFF5F2;padding:12px 14px;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;align-items:center;font-size:14px}
.p2-bad>b{color:#E2451F}
.p2-s19 td.st{text-align:center;font-weight:700;width:64px}
.p2-s19 td.st.s2{color:#15803D}.p2-s19 td.st.s4{color:#B45309}.p2-s19 td.st.s5{color:#B91C1C}
.p2-s19 tr.k td{background:#FFFBEB}
.p2-s19 td.ar{color:#9CA3AF;text-align:center;width:22px}
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
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1000px){.pg-three{grid-template-columns:1fr}}
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
@media (max-width:1000px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.pg-pm{background:${T.paper};border:1px solid #D8DDE5;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.pg-pm.hl{border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.14)}
.pg-pm .top{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F7F8FA;border-bottom:1px solid #E6E9EE;font:12.5px ${MONO}}
.pg-pm .lg{font:700 11px ${SANS};color:${PG.post};letter-spacing:.04em}
.pg-pm .m{font:700 11px ${MONO};color:#fff;border-radius:5px;padding:3px 7px}
.pg-pm .u{color:${T.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pg-pm .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.06em;text-transform:uppercase}
.pg-pm .b{margin:0;padding:8px 12px;font:12px/1.45 ${MONO};color:${T.ink2};border-bottom:1px dashed #E6E9EE;white-space:pre-wrap}
.pg-pm .r{display:flex;gap:10px;align-items:flex-start;padding:8px 12px}
.pg-pm .r pre{margin:0;font:12px/1.45 ${MONO};white-space:pre-wrap;word-break:break-word;color:${T.ink}}
.pg-pm .st{font:700 12px ${MONO};border-radius:6px;padding:3px 8px;flex:0 0 auto}
.pg-pm .st.s2{background:#E3F5EC;color:${T.green}}.pg-pm .st.s4{background:#FFF6E2;color:${T.yellow}}.pg-pm .st.s5{background:#FDECEC;color:#B91C1C}
/* F-1102-21 · 2-ekran CRUD jadvali (ustunlar galma-gal ochiladi) */
.pg-crud{width:100%;border-collapse:separate;border-spacing:0 8px;font-size:15px}
.pg-crud th{font:700 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;color:${T.ink3};text-align:left;padding:0 12px 2px}
.pg-crud th.sql{color:${PG.pg}}.pg-crud th.ex{color:${T.green}}
.pg-crud td{padding:12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:opacity .35s}
.pg-crud td:first-child{border-left:4px solid ${T.accent};border-radius:10px 0 0 10px;font-weight:800}
.pg-crud td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.pg-crud td.off>*{opacity:0}
.pg-crud code{font:13px ${MONO};background:#EEF0F4;padding:2px 7px;border-radius:5px}
.pg-crud td.sql code{background:#E8F0F8;color:${PG.pg}}.pg-crud td.ex code{background:#E3F5EC;color:${T.green}}
.pg-crud th.mg{color:${PG.mongo}}.pg-crud td.mg code{background:#E9F7EF;color:#0B5A33}
/* v2 (03.11): Mongoose bloki, fayl sahifasi (ctid), uch holat, Pool chizmasi, karta qatori */
.pg-mg{margin:0;font:12px/1.55 ${MONO};color:${T.ink2};background:#F1F8F4;border:1px dashed ${PG.mongo};border-radius:10px;padding:8px 12px;white-space:pre-wrap}
.pg-mg b{color:${PG.mongo}}
.pg-page{background:${T.paper};border:1px solid ${T.line};border-radius:12px;padding:12px 14px}
.pg-page .slots{display:grid;gap:6px}
.pg-page .slot{display:flex;gap:10px;align-items:center;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;font:13px ${MONO};transition:background .3s,border-color .3s}
.pg-page .slot b{min-width:44px;color:${T.ink3};font-weight:600}
.pg-page .slot.old span{text-decoration:line-through;color:${T.ink3}}
.pg-page .slot.gone{border-style:dashed;color:${T.ink3}}
.pg-page .slot.now{border-color:${PG.pg};background:#E8F0F8;font-weight:700}
.pg-page .slot.hl{border-color:${T.accent};background:#FFF0EB}
.pg-states{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.pg-states .mk-box code{font:700 14px ${MONO};background:transparent;padding:0}
.pg-pool{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:center}
.pg-pool .ar{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.pg-cards3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-cards3,.pg-states{grid-template-columns:1fr}}
.pg-rules{display:grid;gap:6px;font:13px ${MONO}}
.pg-rules div{display:flex;gap:10px;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;background:${T.paper};transition:background .3s}
.pg-rules div.on{background:#E3F5EC;border-color:${T.green}}
.pg-rules div.new{animation:mk-up .4s ease both}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-pg2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-pg2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
