// ============================================================
//  MENTOR KURSI · Telegraf + PostgreSQL «Buyurtma boti: AI bilan bazaga ko'chiramiz» (v2, F-1103-10)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/17-TgPg-mentor-v2.md (GATE M 04.11)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar tgpg-start → tgpg-done; kod bo'laklari 03b-kod.gen.jsx (aynan, satr raqami bilan)
//  Haqiqiy chiqishlar: manba/orderbot-out/ (loyiha, smoke, KOD 3–8) · manba/orderbot-ai/ (Opus) · manba/orderbot-ai2/ (Haiku)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx tgpg/parts/*.jsx > TgPgMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-tgpg-01-holat-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Buyurtma boti: AI bilan bazaga ko'chiramiz";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', tg: '#5B8DB8', tgBg: '#DCE7F0', ai: '#6D3BE4' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.entity\.ts$/.test(f) ? T.purple : /migrations\//.test(f) ? PG.pg : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
  cat: 'src/api/catalog/catalog.service.ts', usr: 'src/api/user/user.service.ts', cart: 'src/api/cart/cart.service.ts', ord: 'src/api/order/order.service.ts',
  types: 'src/core/types.ts', cfg: 'src/config/index.ts', main: 'src/main.ts',
  prod: 'src/core/entity/product.entity.ts', uent: 'src/core/entity/user.entity.ts', mig: 'src/infrastructure/migrations/1762200000000-init.ts', ds: 'src/infrastructure/data-source.ts',
};
const START_FILES = tree(['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.cart, F.cat, F.ord, F.tg, F.kb, F.tx, F.usr, F.cfg, F.types, F.main, '.env', 'package.json', 'README.md']);
const DONE_FILES = tree(['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.cart, F.cat, F.ord, F.tg, F.kb, F.tx, F.usr, F.cfg, 'src/core/entity/cart-item.entity.ts', 'src/core/entity/order.entity.ts', 'src/core/entity/order-item.entity.ts', F.prod, F.uent, F.ds, 'src/infrastructure/database.module.ts', F.mig, 'src/infrastructure/seed.ts', F.main, '.env', 'package.json', 'README.md']);
MKCFG.files = START_FILES;
// VS Code'dagidek ixcham Explorer: faqat ochiq faylning papka zanjiri ochiq, qolgan papkalar yopiq (M27: '/' — yopiq papka).
// Ildizdagi fayllar va yopiq papkalar ko'rinib turadi — loyiha strukturasi yo'qolmaydi, lekin 1280 da sahnaga sig'adi.
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
  // F-1120-02 (M52): 4-element — act (mentor o'zi bosadi, chap paneldagi ko'rsatma)
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['backslash d products', '\\d products'], ['backslash d users', '\\d users'], ['backslash d', '\\d'],
  ['insert on conflict do update', 'INSERT … ON CONFLICT DO UPDATE'], ['on conflict', 'ON CONFLICT'], ['select for update', 'SELECT … FOR UPDATE'],
  ['update where stock katta yoki teng qty', 'UPDATE … WHERE stock >= qty'], ['update stock minus qty where stock katta yoki teng qty', 'UPDATE stock - qty WHERE stock >= qty'],
  ['check stock katta yoki teng nol', 'CHECK (stock >= 0)'], ['lock pessimistic write', "lock: 'pessimistic_write'"], ['find one by', 'findOneBy'],
  ['dataSource transaction', 'dataSource.transaction'], ['start transaction', 'START TRANSACTION'], ['migrations run true', 'migrationsRun: true'],
  ['synchronize false', 'synchronize: false'], ['synchronize true', 'synchronize: true'], ['Synchronize false', 'synchronize: false'],
  ['git diff stat', 'git diff --stat'], ['db logging true', 'DB_LOGGING=true'], ['database url', 'DATABASE_URL'], ['env example', '.env.example'],
  ['sslmode require', 'sslmode=require'], ['tgpg start', 'tgpg-start'], ['tgpg done', 'tgpg-done'], ['telegram service', 'telegram.service'],
  ['catalog service', 'catalog.service'], ['bot command catalog', "bot.command('catalog')"], ['bot action', 'bot.action'], ['bot start', 'bot.start'],
  ['cart items', 'cart_items'], ['order items', 'order_items'], ['telegram id', 'telegram_id'], ['user id', 'user_id'], ['product id', 'product_id'],
  ['WAITING PHONE', 'WAITING_PHONE'], ['big int', 'BIGINT'], ['Ctrl C', 'Ctrl+C'], ['userinfobot', '@userinfobot'], ['dars uchdagi', 'dars-03-done'],
  ['Entity decorator', '@Entity'], ['Column decorator', '@Column'], ['up metodida', 'up()'], ['down metodida', 'down()'],
];
DIGITS.unshift(["ming bir yuz qirq besh", '1145'], ['yigirma ikki fayl', '22 fayl'], ["ikki milliard bir yuz qirq yetti milliondan", '2 147 483 647 dan'],
  ['besh milliarddan', '5 milliarddan'], ['ellik ikki bitdan', '52 bitdan'], ['ikki yuz yigirma ming', '220 000'], ["o'n to'qqiz marta", '19 marta'],
  ['yigirma marta', '20 marta'], ['bir yuz o\'n birga', '111 ga'], ['bir yuz o\'n bir', '111'], ["to'rt yuz bir", '401'], ['m5-04', 'm5-04']);
// F-1109-01: gap boshidagi «Backslash l» ham «Matn»da kod bo'lib ko'rinsin
SPOKEN.push(...SPOKEN.filter(([a]) => a.startsWith('backslash')).map(([a, b]) => ['B' + a.slice(1), b]));
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(
  /current transaction is aborted/g, /is out of range for type integer/g, /violates check constraint/g, /duplicate key value/g, /Missing script/g,
  /out of range for type integer/g, /Unauthorized/g, /Conflict/g,
);

// Kod rang beruvchilar. Matn — String.raw yoki KOD (03b-kod.gen.jsx), HTML'siz.
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string)$/;
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
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
const SQL_KW = /^(SELECT|FROM|WHERE|JOIN|ON|AND|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|ALTER|ADD|COLUMN|DROP|PRIMARY|KEY|REFERENCES|NOT|NULL|UNIQUE|CHECK|SERIAL|INTEGER|BIGINT|VARCHAR|BEGIN|COMMIT|ROLLBACK|RETURNING|DEFAULT|CONFLICT|DO|FOR|ORDER|BY|LIMIT|CONSTRAINT|START|TRANSACTION)$/;
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
// psql: prompt (shop=#) alohida rangda; xato qizil; buyruq javobi yashil
function psqlLine(l) {
  let m = /^(\w+[=\-(][*!]?# ?)(.*)$/.exec(l);
  if (m) return `<span class="p">${escH(m[1])}</span>${/^\\/.test(m[2]) ? `<span class="m">${escH(m[2])}</span>` : sqlLine(m[2])}`;
  m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/ERROR:|FATAL:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^(DETAIL|HINT)/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  return escH(l);
}
const psql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: psqlLine(l), ...(meta[i + 1] || {}) }));
// Oddiy terminal (npm, node, smoke, TypeORM logi)
function termLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^\s*✗|error|Error|ERROR|query failed|Unauthorized|aborted|out of range|XATO|berilmadi/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*✓|NATIJA: 5\/5|qabul qilindi|ulandi|ishlayapti|tsc: xato yo'q|COMMIT/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^query: /.test(l)) return `<span class="cm">query: </span>${sqlLine(l.slice(7))}`;
  if (/^\s*(#|—|\(|Eslatma)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const term = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: termLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);

const Term = ({ lines, title = t('terminal', "терминал"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const Psql = ({ lines, title = 'psql — shop', er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Loyiha kodi (KOD — aynan, satr raqami bilan). ids: {satr: 'id'} — yoritish uchun; from/to — satr chegarasi
const kod = (k, ids = {}, from, to) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).map((l) => ({ h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) }));
const Code = ({ k, ids, from, to, focus, beat, files, active, fresh, style }) => <Ide files={compact(files || (KOD[k].tag === 'tgpg-start' ? START_FILES : DONE_FILES), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={baseName(KOD[k].file)} lines={kod(k, ids, from, to)} focus={focus} beat={beat} />
</Ide>;
// Mongoose jufti — bitta xira qator (M45): dvigatel .mk-pair
const Pair = ({ code, res }) => <div className="mk-pair"><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>{code}</code>{res ? <> → {res}</> : null}</div>;

// Bot oqimi kartasi — haqiqiy Nest + Telegraf kodi, Telegram serverisiz (handleUpdate + javob ushlanadi). Telegram ilovasi ko'rinishi EMAS (GATE M 04.11).
// items: [kim, matn, belgi] — kim: 'u' mijoz · 'b' bot · 'sep' ajratgich · 'kb' tugmalar qatori
function TgFlow({ title = t('Bot oqimi', "Поток бота"), items = [], note, src }) {
  return <div className="tg-flow">
    <div className="bar"><span className="av">🤖</span><span className="tt">{title}</span><span className="src">{src || t("haqiqiy bot javoblari · Telegram'siz sinov", "настоящие ответы бота · проверка без Telegram")}</span></div>
    <div className="bd">{items.map(([who, tx, extra], i) => who === 'sep'
      ? <div key={i} className="sep">{tx}</div>
      : who === 'kb' ? <div key={i} className="kb">{tx.split(' | ').map((b) => <span key={b}>{b}</span>)}</div>
        : <div key={i} className={`m ${who}${extra ? ' ' + extra : ''}`}>{tx}</div>)}</div>
    {note && <div className="nt">{note}</div>}
  </div>;
}
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

// TgPg v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
.pg-four{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:stretch}
@media (max-width:1300px){.pg-three,.pg-four{grid-template-columns:1fr 1fr}}
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
.tg-flow{background:${PG.tgBg};border:1px solid #C5D3E0;border-radius:12px;overflow:hidden}
.tg-flow .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#fff;border-bottom:1px solid #D7E0EA;font:600 13px ${SANS};color:${T.ink}}
.tg-flow .bar .av{width:24px;height:24px;border-radius:50%;background:${PG.tg};display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.tg-flow .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:${T.green};background:#E3F5EC;border:1px solid #A8D8C1;border-radius:6px;padding:3px 7px}
.tg-flow .bd{padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.tg-flow .m{max-width:86%;padding:6px 10px;border-radius:12px;font-size:13.5px;line-height:1.4;background:#fff;color:${T.ink};white-space:pre-wrap;box-shadow:0 1px 1px rgba(0,0,0,.06)}
.tg-flow .m.u{align-self:flex-end;background:#E1FEC6}
.tg-flow .m.b{align-self:flex-start}
.tg-flow .m.bad{border:1.5px solid ${T.accent}}
.tg-flow .m.ok{border:1.5px solid ${T.green}}
.tg-flow .kb{align-self:flex-start;display:flex;flex-wrap:wrap;gap:4px;max-width:86%}
.tg-flow .kb span{font:12px ${SANS};background:rgba(255,255,255,.75);border:1px solid #BFD0E0;border-radius:8px;padding:4px 8px;color:${PG.tg}}
.tg-flow .sep{align-self:center;font:600 11px ${MONO};color:#5E6B78;background:rgba(255,255,255,.75);border-radius:10px;padding:3px 10px}
.tg-flow .nt{padding:6px 12px 10px;font:12px ${MONO};color:#5E6B78}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${PG.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${PG.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${PG.ai}}
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${PG.term};white-space:pre;overflow-x:auto}
.pr5{margin:0;font:13px/1.6 ${MONO};white-space:pre-wrap;background:${T.paper};border:1px solid ${T.line};border-radius:12px;padding:12px 14px}
.pr5 span{transition:background .3s,color .3s;border-radius:4px;padding:1px 0}
.pr5 span.on{background:#FFF0EB;color:${T.accent}}
.pr5 span.dim{color:${T.ink3}}
.pr5 i{font-style:normal;font:700 10.5px ${MONO};color:#fff;background:${T.accent};border-radius:4px;padding:1px 5px;margin-right:6px}
.race{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
.race .row{font:700 13px ${MONO};text-align:center;padding:10px;border:2px solid ${PG.pg};border-radius:12px;background:#E8F0F8}
.race .tx{display:grid;gap:6px}
.race .tx div{font:12.5px ${MONO};padding:6px 10px;border-radius:8px;border:1px solid ${T.line};background:${T.paper};color:${T.ink3};transition:all .3s}
.race .tx div.w{border-color:${T.yellow};background:#FFF6E2;color:${T.ink}}
.race .tx div.ok{border-color:${T.green};background:#E3F5EC;color:${T.ink}}
.race .tx div.bad{border-color:${T.accent};background:#FFF0EB;color:${T.ink}}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-tg');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-tg'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
