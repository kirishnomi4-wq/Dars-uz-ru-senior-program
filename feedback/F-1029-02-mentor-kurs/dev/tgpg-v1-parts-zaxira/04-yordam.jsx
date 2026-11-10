
// ============================================================
//  MENTOR KURSI · Telegraf + PostgreSQL «Bot eslab qoladi: state bazada»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/17-TgPg-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/tgpg-out/ (00–13; haqiqiy Telegraf + PostgreSQL, Telegram serverisiz)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx tgpg/parts/*.jsx > TgPgMentorLesson.jsx
//  Yordamchilar CI/CD-1 dan nusxa + SQL/psql (PG darslaridan) + Telegram chat maketi (⚠)
// ============================================================
const LESSON_ID = 'mentor-tgpg-01-holat-v1';
const LESSON_TITLE = "Bot eslab qoladi: state bazada";
const PG = { term: '#111827', termEr: '#1F1115', tg: '#5B8DB8', tgBg: '#DCE7F0' };
MKCFG.root = 'bot-state';
MKCFG.kind = (f) => /\.sql$/.test(f) ? T.green : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
// Mentorning kichik boti (12-amaliyot) va o'quvchi reposi TelegramBotNest (dars-04-done, haqiqiy fayllar ro'yxati — tgpg-out/12)
const BOT_FILES = tree(['node_modules/', 'bot.js', 'package.json', 'package-lock.json']);
const RF = { ent: 'src/core/entity/user.entity.ts', base: 'src/core/entity/base.entity.ts', usv: 'src/api/user/user.service.ts', tg: 'src/api/telegram/telegram.service.ts', db: 'src/infrastructure/database.module.ts', env: '.env' };
const REPO_FILES = tree(['dist/', 'node_modules/', 'src/api/app.controller.ts', 'src/api/app.module.ts', 'src/api/telegram/telegram.module.ts', RF.tg, 'src/api/user/user.module.ts', RF.usv, 'src/config/', RF.base, RF.ent, RF.db, 'src/main.ts', '.env', '.env.example', 'Dockerfile', 'nest-cli.json', 'package.json', 'README.md', 'tsconfig.json']);
MKCFG.files = BOT_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['ctx chat id', 'ctx.chat.id'], ['chat id', 'chat.id'], ['Telegram id', 'telegram_id'], ['telegram id', 'telegram_id'], ['Big int', 'BIGINT'], ['big int', 'BIGINT'],
  ['Not null unique', 'NOT NULL UNIQUE'], ['integer out of range', 'integer out of range'], ['duplicate key', 'duplicate key'], ['already exists', 'already exists'],
  ['waiting name', 'WAITING_NAME'], ['waiting size', 'WAITING_SIZE'], ['waiting pizza', 'WAITING_PIZZA'], ['waiting phone', 'WAITING_PHONE'], ['ism kutilmoqda', 'ism_kutilmoqda'],
  ['dars to\'rt done', 'dars-04-done'], ['Top yoki yarat', 'topOrYarat'], ['database url topilmadi', 'DATABASE_URL topilmadi'], ['sslmode require', 'sslmode=require'],
  ['env fayli', '.env fayli'], ['Env fayli', '.env fayli'], ['bot js', 'bot.js'], ['npm run start', 'npm run start'], ['Ctrl C', 'Ctrl+C'], ['uch tenglik', '==='],
  ['select', 'SELECT'], ['insert', 'INSERT'], ['update', 'UPDATE'], ['Insert', 'INSERT'], ['Update', 'UPDATE'], ['Number yoki String', 'Number() yoki String()'],
];
DIGITS.unshift(["to'rt yuz bir", '401'], ["uch ming portda", '3000-portda'], ["besh milliard bir yuz yigirma uch million", '5 123 456 789'], ['besh milliard', '5 000 000 000'],
  ["o'ttiz ikki bit", '32 bit'], ["yigirma bir ekran", '21 ekran'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'],
  ["o'n beshinchi ekran", '15-ekran'], ["o'ninchi ekran", '10-ekran'], ["to'qqizinchi ekran", '9-ekran'], ["to'rtinchi ekran", '4-ekran'], ["Uchinchi ekran", '3-ekran'], ["o'nlab", "o'nlab"]);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(/integer out of range/gi, /duplicate key/gi, /already exists/gi, /not null unique/gi, /stateful/gi);

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
const Psql = ({ lines, title = 'psql — botdb', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Terminal: npm/jest/eslint chiqishlari. Kod satrlari (N |) birinchi; PASS/✓/UCHIRISH yashil; xato qizil
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l) || /^\s+\|\s+\^/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*\d+ \|/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*at /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\[chiqish kodi: [1-9]\d*\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$|^UCHIRISH$|^added \d+ packages/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Expected:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/warning|WARN/.test(l) && !/error/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|No tests found|✖|XATO/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^>|^Snapshots|^Time|^Ran all|^---|^#|^\s*expect\(received\)|^In |files checked|testMatch|testPath|testRegex|Pattern|Run with/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Telegram chat — MAKET (Telegram serveriga ulanmadik): javob matnlari haqiqiy Telegraf handler'idan (tgpg-out), oyna esa maket
function TgChat({ title = 'AvtoPizza bot', items = [], note }) {
  return <div className="c1-tg">
    <div className="bar"><span className="av">🍕</span><span className="tt">{title}</span><span className="warn">⚠ Telegram oynasi maket · javoblar haqiqiy</span></div>
    <div className="bd">{items.map(([who, t, extra], i) => who === 'sep' ? <div key={i} className="sep">{t}</div> : <div key={i} className={`m ${who}${extra ? ' ' + extra : ''}`}>{t}</div>)}</div>
    {note && <div className="nt">{note}</div>}
  </div>;
}

// Telegraf+PG ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* Telegram chat maketi */
.c1-tg{background:${PG.tgBg};border:1px solid #C5D3E0;border-radius:12px;overflow:hidden}
.c1-tg .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#fff;border-bottom:1px solid #D7E0EA;font:600 13px ${SANS};color:${T.ink}}
.c1-tg .bar .av{width:24px;height:24px;border-radius:50%;background:${PG.tg};display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.c1-tg .bar .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:3px 7px}
.c1-tg .bd{padding:12px;display:flex;flex-direction:column;gap:6px}
.c1-tg .m{max-width:78%;padding:7px 11px;border-radius:12px;font-size:14px;line-height:1.4;background:#fff;color:${T.ink};box-shadow:0 1px 1px rgba(0,0,0,.06)}
.c1-tg .m.u{align-self:flex-end;background:#E1FEC6}
.c1-tg .m.b{align-self:flex-start}
.c1-tg .m.bad{border:1.5px solid ${T.accent}}
.c1-tg .m.ok{border:1.5px solid ${T.green}}
.c1-tg .sep{align-self:center;font:600 11px ${MONO};color:#5E6B78;background:rgba(255,255,255,.7);border-radius:10px;padding:3px 10px}
.c1-tg .nt{padding:6px 12px 10px;font:12px ${MONO};color:#5E6B78}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-tg');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-tg'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
