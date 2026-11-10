// ============================================================
//  Kod va chiqishlar (tgpg-out — haqiqiy Telegraf 4.16.3 + PostgreSQL 18.4, Telegram serverisiz)
// ============================================================
const HOLATSIZ_JS = js(String.raw`
bot.hears(/pitsa/i, (ctx) => ctx.reply('Ajoyib! Qaysi pitsa?'));
bot.on('text', (ctx) => ctx.reply(` + '`Nima «${ctx.message.text}»? Tushunmadim.`' + String.raw`));`, { 2: { id: 'x' } });
const XOTIRA_JS = js(`
const state = {}; // har chatning state'i — oddiy obyektda (RAM)

bot.on('text', (ctx) => {
  const id = ctx.chat.id,
    t = ctx.message.text;
  if (!state[id]) {
    state[id] = 'WAITING_PIZZA';
    return ctx.reply('Salom! Qaysi pitsa?');
  }
  if (state[id] === 'WAITING_PIZZA') {
    state[id] = 'WAITING_SIZE';
    return ctx.reply(\`\${t} — yaxshi tanlov! Qaysi o'lchamda?\`);
  }
  if (state[id] === 'WAITING_SIZE') {
    state[id] = 'WAITING_ADDRESS';
    return ctx.reply('Manzilni yuboring.');
  }
});`, { 1: { id: 'o' }, 4: { id: 'k' }, 5: { id: 'k' }, 6: { id: 'r' }, 7: { id: 'r' }, 8: { id: 'r' }, 9: { id: 'r' }, 10: { id: 'r' }, 11: { id: 'r' }, 12: { id: 'r' }, 13: { id: 'r' }, 14: { id: 'r' }, 15: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'r' } });
const BAZA_JS = js(`
const { Telegraf } = require('telegraf');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE telegram_id = $1',
    [ctx.chat.id],
  );
  if (rows.length === 0) {
    await pool.query('INSERT INTO users (telegram_id, state) VALUES ($1, $2)', [
      ctx.chat.id,
      'WAITING_NAME',
    ]);
    return ctx.reply('Ismingiz nima?');
  }
  return ctx.reply(\`Yana salom, \${rows[0].name}!\`);
});

bot.on('text', async (ctx) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE telegram_id = $1',
    [ctx.chat.id],
  );
  const u = rows[0];
  if (u && u.state === 'WAITING_NAME') {
    await pool.query(
      'UPDATE users SET name = $1, state = $2 WHERE telegram_id = $3',
      [ctx.message.text, 'READY', ctx.chat.id],
    );
    return ctx.reply(\`Tanishganimdan xursandman, \${ctx.message.text}!\`);
  }
  return ctx.reply('Buyruqni tanlang: /start');
});

bot.launch();`, { 7: { id: 'sel' }, 8: { id: 'sel' }, 9: { id: 'sel' }, 10: { id: 'sel' }, 11: { id: 'ins' }, 12: { id: 'ins' }, 13: { id: 'ins' }, 14: { id: 'ins' }, 15: { id: 'ins' }, 16: { id: 'ins' }, 17: { id: 'ins' }, 22: { id: 'sel' }, 23: { id: 'sel' }, 24: { id: 'sel' }, 25: { id: 'sel' }, 27: { id: 'upd' }, 28: { id: 'upd' }, 29: { id: 'upd' }, 30: { id: 'upd' }, 31: { id: 'upd' }, 32: { id: 'upd' }, 33: { id: 'upd' }, 37: { id: 'l' } });
const USERS_SQL = sql(String.raw`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  name TEXT,
  state TEXT,
  choice TEXT
);`, { 3: { id: 'tg' }, 5: { id: 'h' } });
const OUT01 = jt(String.raw`
$ node stateless.js
Aziza (5123456789): Pitsa buyurtma qilaman
  bot → 5123456789: Ajoyib! Qaysi pitsa?
Aziza (5123456789): Pepperoni
  bot → 5123456789: Nima «Pepperoni»? Tushunmadim.`, { 5: { id: 'x' } });
const OUT02A = jt(String.raw`
$ node memory.js 1      # 1-ishga tushirish
Aziza (5123456789): Salom
  bot → 5123456789: Salom! Qaysi pitsa?
Aziza (5123456789): Pepperoni
  bot → 5123456789: Pepperoni — yaxshi tanlov! Qaysi o'lchamda?
  [xotiradagi state] {"5123456789":"WAITING_SIZE"}`, { 5: { id: 'r' }, 6: { id: 'h' } });
const OUT02B = jt(String.raw`
# bot to'xtatildi va qayta ishga tushirildi (yangi jarayon)
$ node memory.js 2
Aziza (5123456789): Katta
  bot → 5123456789: Salom! Qaysi pitsa?
  [xotiradagi state] {"5123456789":"WAITING_PIZZA"}`, { 4: { id: 'x' }, 5: { id: 'x' } });
const OUT03 = jt(String.raw`
$ node shared.js
Aziza (5123456789): Pepperoni
  bot → 5123456789: Pepperoni. O'lcham?
Jasur (6234567890): Margarita
  bot → 6234567890: Margarita. O'lcham?
Aziza (5123456789): Katta
  bot → 5123456789: Buyurtma: Margarita, katta`, { 4: { id: 'j' }, 7: { id: 'x' } });
const UMUMIY_JS = js(`
let choice = null; // HAMMA UCHUN BITTA
bot.hears(/^(Pepperoni|Margarita)$/, (ctx) => {
  choice = ctx.message.text;
  return ctx.reply(\`\${choice}. O'lcham?\`);
});
bot.hears(/^(Katta|Kichik)$/, (ctx) =>
  ctx.reply(\`Buyurtma: \${choice}, \${ctx.message.text.toLowerCase()}\`),
);`, { 1: { id: 'x' }, 2: { id: 'w' }, 3: { id: 'w' }, 4: { id: 'w' }, 5: { id: 'w' } });
const OUT05 = jt(String.raw`
$ node db.js 1      # 1-ishga tushirish
Aziza (5123456789): /start
  bot → 5123456789: Ismingiz nima?
Aziza (5123456789): Aziza
  bot → 5123456789: Tanishganimdan xursandman, Aziza!
Jasur (6234567890): /start
  bot → 6234567890: Ismingiz nima?

# bot to'xtatildi va qayta ishga tushirildi
$ node db.js 2
Aziza (5123456789): /start
  bot → 5123456789: Yana salom, Aziza!
Jasur (6234567890): Jasur
  bot → 6234567890: Tanishganimdan xursandman, Jasur!`, { 12: { id: 'a' }, 14: { id: 'j' } });
const PSQL05 = psql(String.raw`
botdb=# SELECT telegram_id, name, state FROM users;
 telegram_id | name  | state
-------------+-------+-------
  5123456789 | Aziza | READY
  6234567890 | Jasur | READY
(2 rows)`, { 4: { id: 'r' }, 5: { id: 'r' } });
const CHAT_HOLATSIZ = [['u', 'Pitsa buyurtma qilaman'], ['b', 'Ajoyib! Qaysi pitsa?'], ['u', 'Pepperoni'], ['b', 'Nima «Pepperoni»? Tushunmadim.', 'bad']];

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['State', 'Har mijozga alohida', "State PostgreSQL'da", 'Buzamiz', "O'quvchi reposi", "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — bot qayta ishga tushsa ham eslaydi</div>
    <TgChat items={[['sep', 'bot qayta ishga tushirildi'], ['u', '/start'], ['b', 'Yana salom, Aziza! Menyu uchun /menu ni bosing.', 'ok']]} />
  </div>} />;
}

// ============================================================
//  2 · State'siz bot (tgpg-out/01)
// ============================================================
const S2 = mkS(2, [{ v: 'chat' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <TgChat items={CHAT_HOLATSIZ} />
      {seg.sum && <div className="mk-rule">State'siz bot har xabarni <b>birinchi xabardek</b> ko'radi — suhbat qayerdaligini bilmaydi.</div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'chat' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-state" files={tree(['node_modules/', 'stateless.js', 'package.json'])} active="stateless.js"><CodePanel file="stateless.js" wrap lines={HOLATSIZ_JS} focus={seg.v === 'code' ? ['x'] : []} /></Ide></div>}
      {seg.v === 'out' && <Term lines={OUT01} focus={['x']} title="terminal — haqiqiy Telegraf, Telegram serverisiz" />}
    </div>
  </div>} />;
}

// ============================================================
//  3 · State obyektda (tgpg-out/02, 1-jarayon)
// ============================================================
const S3 = mkS(3, [{ f: ['o', 'k'] }, { f: ['r'] }, { f: [], out: true }, { f: [], out: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-state" files={tree(['node_modules/', 'memory.js', 'package.json'])} active="memory.js"><CodePanel file="memory.js" wrap lines={XOTIRA_JS} focus={seg.f} /></Ide></div>
    {seg.out && <Term lines={OUT02A} focus={['r', 'h']} />}
    {seg.sum && <div className="mk-rule">State bilan suhbat davom etdi — lekin obyekt <b>dastur xotirasida</b> (RAM).</div>}
  </div>} />;
}

// ============================================================
//  4 · Qayta ishga tushirish — RAM bo'shadi (tgpg-out/02, 2-jarayon)
// ============================================================
const S4 = mkS(4, [{ v: 'r' }, { v: 'out' }, { v: 'box' }, { v: 'box', sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'r' && <Term lines={OUT02A.slice(-1).concat(jt('# Ctrl+C → node memory.js 2'))} title="terminal" />}
    {seg.v !== 'r' && <div className="pg-two">
      <Term er lines={OUT02B} focus={['x']} />
      <TgChat items={[['u', 'Pepperoni'], ['b', "Pepperoni — yaxshi tanlov! Qaysi o'lchamda?"], ['sep', 'bot qayta ishga tushirildi'], ['u', 'Katta'], ['b', 'Salom! Qaysi pitsa?', 'bad']]} />
    </div>}
    {seg.v === 'box' && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Dastur xotirasi (RAM)</h4><p>vaqtinchalik — jarayon tugasa, obyekt bo'sh boshlanadi</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>PostgreSQL</h4><p>doimiy — diskda, qayta ishga tushirishdan keyin ham joyida</p></div>
    </div>}
    {seg.sum && <div className="mk-rule">Qayta ishga tushirishdan keyin faqat <b>bazaga yozilgan</b> state qoladi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: bazadagi state qayta ishga tushirishdan keyin ham bor</div>
      <Term lines={OUT05.slice(9, 13)} focus={['a']} />
      <Psql lines={PSQL05} focus={['r']} />
    </div>} />;
}

// ============================================================
//  6 · Umumiy o'zgaruvchi (tgpg-out/03)
// ============================================================
const S6 = mkS(6, [{ v: 'two' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'two' ? <div className="pg-two">
        <TgChat title="Aziza" items={[['u', 'Pepperoni'], ['b', "Pepperoni. O'lcham?"]]} />
        <TgChat title="Jasur" items={[['u', 'Margarita'], ['b', "Margarita. O'lcham?"]]} />
      </div> : <Ide root="bot-state" files={tree(['node_modules/', 'shared.js', 'package.json'])} active="shared.js"><CodePanel file="shared.js" wrap lines={UMUMIY_JS} focus={seg.v === 'code' ? ['x', 'w'] : ['x']} /></Ide>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && <><Term er lines={OUT03} focus={['j', 'x']} /><TgChat title="Aziza" items={[['u', 'Pepperoni'], ['b', "Pepperoni. O'lcham?"], ['u', 'Katta'], ['b', 'Buyurtma: Margarita, katta', 'bad']]} /></>}
      {seg.sum && <div className="mk-rule">Umumiy o'zgaruvchi — ikki mijozning suhbati <b>xato bermay aralashadi</b>: xato chiqmaydi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  7 · chat.id bo'yicha alohida
// ============================================================
const S7 = mkS(7, [{ v: 'id' }, { v: 'obj' }, { v: 'db' }, { v: 'db', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>Aziza</h4><p><code>ctx.chat.id</code> = 5123456789</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>Jasur</h4><p><code>ctx.chat.id</code> = 6234567890</p></div>
    </div>
    {seg.v === 'obj' && <Term lines={jt(String.raw`
# 3-ekrandagi obyekt — kalit chat.id
{ "5123456789": "WAITING_SIZE",
  "6234567890": "WAITING_PIZZA" }`)} title="memory.js — state" />}
    {seg.v === 'db' && <Psql lines={PSQL05} focus={['r']} />}
    {seg.sum && <div className="mk-rule"><b>Sessiya</b> — bitta mijozning alohida state'i; kaliti — <code>chat.id</code>.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2
// ============================================================
function Screen8(p) {
  const m = MDT[8];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file="shared.js" wrap lines={UMUMIY_JS} focus={['x']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={OUT03} focus={['x']} />
    </div>} />;
}

// ============================================================
//  9 · users jadvali va BIGINT (tgpg-out/04, 09)
// ============================================================
const S9 = mkS(9, [{ f: [] }, { f: ['tg'], doc: true }, { f: ['tg'] }, { f: ['tg', 'h'], sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Psql title="psql — botdb" lines={USERS_SQL} focus={seg.f} />
    {seg.doc && <div className="mk-card"><h5>Telegram Bot API — User.id va Chat.id</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«This number may have <b>more than 32 significant bits</b> … a 64-bit integer … are safe»</div><div className="mk-tag" style={{ margin: '8px 0 0' }}>core.telegram.org/bots/api · 01.11.2026</div></div>}
    {seg.sum && <div className="mk-rule"><code>telegram_id</code> bilan qator topiladi, <code>state</code> ustunida suhbat bosqichi.</div>}
  </div>} />;
}

// ============================================================
//  10 · Oqim: SELECT → INSERT / UPDATE
// ============================================================
const S10 = mkS(10, [{ f: ['sel'] }, { f: ['ins'] }, { f: ['upd'] }, { f: ['sel', 'ins', 'upd'], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-state" files={BOT_FILES} active="bot.js"><CodePanel file="bot.js" wrap lines={BAZA_JS} focus={seg.sum ? [] : seg.f} /></Ide></div>
    {seg.sum && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>1 · SELECT</h4><p>state'ni o'qish</p></div>
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>2 · INSERT</h4><p>faqat yangi mijozga</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>3 · UPDATE</h4><p>yangi state</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Qayta ishga tushgach — «Yana salom» (tgpg-out/05)
// ============================================================
const S11 = mkS(11, [{ v: 'one' }, { v: 'two', f: ['a'] }, { v: 'two', f: ['j'] }, { v: 'two', f: ['a', 'j'], sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={seg.v === 'one' ? OUT05.slice(0, 7) : OUT05} focus={seg.sum ? [] : (seg.f || [])} /></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'two' && <TgChat title="Aziza" items={[['u', '/start'], ['b', 'Ismingiz nima?'], ['u', 'Aziza'], ['b', 'Tanishganimdan xursandman, Aziza!'], ['sep', 'bot qayta ishga tushirildi'], ['u', '/start'], ['b', 'Yana salom, Aziza!', 'ok']]} />}
      {seg.sum && <><Psql lines={PSQL05} focus={['r']} /><div className="mk-rule">State bazada — qayta ishga tushirish ham, ikki mijoz ham <b>muammo emas</b>.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  12 · Amaliyot 1 — bot eslab qolsin
// ============================================================
const P1 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Jadval — PostgreSQL terminalida botdb va users (9-ekran)", cmds: ['psql -U postgres', 'CREATE DATABASE botdb;', '\\c botdb'], exp: 'CREATE TABLE' },
  { t: 'Bot — yangi papka, paketlar, bot.js', cmds: ['mkdir bot-state && cd bot-state', 'npm init -y', 'npm i telegraf pg'], exp: 'fayl saqlandi' },
  { t: 'Ism — botni yoqing, Telegram: /start → ismingiz', cmds: ['BOT_TOKEN=… DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botdb node bot.js'], exp: '«Tanishganimdan xursandman, …!»' },
  { t: 'Qayta ishga — Ctrl+C, xuddi shu buyruq, /start', cmds: [], exp: '«Yana salom, …!»' },
];
const P1_CODE = [{ file: 'jadval.sql', step: 0, lines: USERS_SQL, copy: true }, { file: 'bot.js', step: 1, lines: BAZA_JS, copy: false }];
const P1_TROUBLE = [
  ['password authentication failed for user "postgres"', "DATABASE_URL dagi parol — PostgreSQL-1 da o'rnatgan parolingiz"],
  ['relation "users" does not exist', "jadval boshqa bazada — \\c botdb dan keyin yarating"],
  ['Bot javob bermaydi, terminalda 401: Unauthorized', "token noto'g'ri nusxalangan (19-ekran)"],
  ['Qayta ishga tushgach yana «Ismingiz nima?»', "ism UPDATE bo'lmagan — state ISM_KUTYAPMAN da qolgan; SELECT * FROM users;"],
];
const P1_PROOF = { label: '4-qadamdagi bot javobi', placeholder: 'botning javobini yozing', check: (v) => /Yana salom, .+!/i.test(v), wrong: "Qayta ishga tushirilgandan keyin /start bosing — bot ismingiz bilan salomlashadi; o'sha gapni yozing" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={tree(BOT_FILES, ['jadval.sql'])} />; }
