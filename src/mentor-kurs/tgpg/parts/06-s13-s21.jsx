// ============================================================
//  Buzamiz chiqishlari (tgpg-out/06, 07, 08) va o'quvchi reposi (TelegramBotNest dars-04-done — 10…13)
// ============================================================
const OUT06 = psql(String.raw`
botdb=# CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);
CREATE TABLE
botdb=# INSERT INTO users_int (telegram_id) VALUES (5123456789);
ERROR:  integer out of range`, { 4: { id: 'x' } });
const OUT06_OK = psql(String.raw`
botdb=# INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');
INSERT 0 1`);
const BIGINT_JS = js(String.raw`
const { rows } = await pool.query('SELECT telegram_id FROM users WHERE telegram_id = $1', [5123456789]);
const v = rows[0].telegram_id;
console.log('rows[0].telegram_id =', JSON.stringify(v), '· typeof:', typeof v);
console.log('v === 5123456789 →', v === 5123456789);
console.log('Number(v) === 5123456789 →', Number(v) === 5123456789);`, { 4: { id: 'x' }, 5: { id: 'ok' } });
const OUT07 = jt(String.raw`
$ node bigint.js
rows[0].telegram_id = "5123456789" · typeof: string
v === 5123456789 → false
Number(v) === 5123456789 → true`, { 2: { id: 's' }, 3: { id: 'x' }, 4: { id: 'ok' } });
const OUT08 = psql(String.raw`
botdb=# INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');
ERROR:  duplicate key value violates unique constraint "users_telegram_id_key"
DETAIL:  Key (telegram_id)=(5123456789) already exists.`, { 2: { id: 'x' }, 3: { id: 'd' } });
const START_INSERT = js(String.raw`
bot.start(async (ctx) => {
  await pool.query('INSERT INTO users (telegram_id, holat) VALUES ($1, $2)', [ctx.chat.id, 'ISM_KUTYAPMAN']);
  return ctx.reply('Ismingiz nima?');
});`, { 2: { id: 'x' } });
const ENTITY_TS = ts(String.raw`
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

// 4-dars: users jadvali — kim yozdi, ismi nima, suhbat qaysi holatda
@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'telegram_id', type: 'bigint', unique: true })
  telegram_id: string;

  @Column({ type: 'varchar', nullable: true })
  ism: string | null;

  @Column({ type: 'varchar', default: 'yangi' })
  holat: string; // 'yangi' → 'ism_kutilmoqda' → 'tayyor'
}`, { 7: { id: 'tg' }, 8: { id: 'tg' }, 13: { id: 'h' }, 14: { id: 'h' } });
const USVC_TS = ts(String.raw`
  // Bor bo'lsa topadi, bo'lmasa yangi qator ochadi
  async topOrYarat(telegramId: number): Promise<User> {
    const id = String(telegramId);
    const bor = await this.repo.findOne({ where: { telegram_id: id } });
    if (bor) return bor;
    return this.repo.save(this.repo.create({ telegram_id: id }));
  }

  async ismQoy(user: User, ism: string): Promise<User> {
    user.ism = ism;
    user.holat = 'tayyor';
    return this.repo.save(user);
  }`, { 3: { id: 's' }, 4: { id: 'sel' }, 5: { id: 'sel' }, 6: { id: 'ins' }, 9: { id: 'upd' }, 10: { id: 'upd' }, 11: { id: 'upd' }, 12: { id: 'upd' } });
USVC_TS.forEach((l, i) => { l.n = i < 7 ? 12 + i : 24 + (i - 7); }); // fayldagi raqamlar: topOrYarat 12–18, (holatQoy 20–23 tushirilgan), ismQoy 25–29
const TGSVC_TS = ts(String.raw`
    this.bot.start(async (ctx) => {
      const user = await this.users.topOrYarat(ctx.from.id);
      if (user.ism) {
        await ctx.reply(` + '`Yana salom, ${user.ism}! Menyu uchun /menu ni bosing.`' + String.raw`);
        return;
      }
      await this.users.holatQoy(user, 'ism_kutilmoqda');
      await ctx.reply('Salom! Ismingiz nima?');
    });
    ...
    this.bot.on('text', async (ctx) => {
      const user = await this.users.topOrYarat(ctx.from.id);
      if (user.holat === 'ism_kutilmoqda') {
        await this.users.ismQoy(user, ctx.message.text.trim());`, { 2: { id: 'h' }, 3: { id: 'h' }, 12: { id: 'h' }, 13: { id: 'h' } });
const OUT12 = jt(String.raw`
$ node sinov-nest.js   # dars-04-done kodi, haqiqiy PostgreSQL, Telegram serverisiz
# 1-ishga tushirish
Telegram bot ulandi
Aziza (5123456789): /start
  bot → 5123456789: Salom! Ismingiz nima?
Aziza (5123456789): Aziza
  bot → 5123456789: Xush kelibsiz, Aziza! Endi sizni eslab qolaman.
Jasur (6234567890): /start
  bot → 6234567890: Salom! Ismingiz nima?
# bot to'xtatildi (app.close) va qayta ishga tushirildi
Telegram bot ulandi
Aziza (5123456789): /start
  bot → 5123456789: Yana salom, Aziza! Menyu uchun /menu ni bosing.
Jasur (6234567890): Jasur
  bot → 6234567890: Xush kelibsiz, Jasur! Endi sizni eslab qolaman.`, { 13: { id: 'a' }, 15: { id: 'j' } });
const PSQL12 = psql(String.raw`
botnest=# \d users
   Column    |            Type             | Collation | Nullable |          Default
-------------+-----------------------------+-----------+----------+----------------------------
 id          | uuid                        |           | not null | uuid_generate_v4()
 created_at  | timestamp without time zone |           | not null | now()
 updated_at  | timestamp without time zone |           | not null | now()
 telegram_id | bigint                      |           | not null |
 ism         | character varying           |           |          |
 holat       | character varying           |           | not null | 'yangi'::character varying
    "UQ_1a1e4649fd31ea6ec6b025c7bfc" UNIQUE CONSTRAINT, btree (telegram_id)
botnest=# SELECT telegram_id, ism, holat FROM users;
 telegram_id |  ism  | holat
-------------+-------+--------
  5123456789 | Aziza | tayyor
  6234567890 | Jasur | tayyor
(2 rows)`, { 7: { id: 't' }, 10: { id: 't' }, 14: { id: 'r' }, 15: { id: 'r' } });
const OUT13 = jt(String.raw`
$ npm run start   # BOT_TOKEN=123:SOXTA, DATABASE_URL — lokal PostgreSQL
Server 3000-portda ishlayapti
Telegram ulanmadi: 401: Unauthorized — README, «Xatolar» jadvali`, { 2: { id: 's' }, 3: { id: 'x' } });
const OUT11 = jt(String.raw`
$ npm run start   # .env yo'q
…/dist/infrastructure/database.module.js:14
    throw new Error('DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).');
Error: DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).`, { 4: { id: 'x' } });

// ============================================================
//  13 · INTEGER sig'maydi (tgpg-out/06)
// ============================================================
const S13 = mkS(13, [{ v: 'sql' }, { v: 'err' }, { v: 'err', small: true }, { v: 'fix', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Psql er={seg.v !== 'sql' && seg.v !== 'fix'} lines={seg.v === 'sql' ? OUT06.slice(0, 2) : OUT06} focus={seg.v === 'err' ? ['x'] : []} />
    {seg.small && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.green }}><h4>INTEGER</h4><p>eng katta: 2 147 483 647</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Mijoz raqami</h4><p>5 123 456 789 — sig'maydi</p></div>
    </div>}
    {seg.v === 'fix' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — BIGINT ustunli users jadvali (9-ekran)</div><Psql lines={OUT06_OK} /><div className="mk-rule"><code>telegram_id</code> — doim <b>BIGINT</b>.</div></>}
  </div>} />;
}

// ============================================================
//  14 · BIGINT matn bo'lib keladi (tgpg-out/07)
// ============================================================
const S14 = mkS(14, [{ v: 'code', f: [] }, { v: 'out', f: ['s', 'x'] }, { v: 'repo' }, { v: 'fix', f: ['ok'], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'repo' ? <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.ent}><CodePanel file={RF.ent} wrap lines={ENTITY_TS} focus={['tg']} /></Ide>
        : <Ide root="bot-holat" files={tree(BOT_FILES, ['bigint.js'])} active="bigint.js"><CodePanel file="bigint.js" wrap lines={BIGINT_JS} focus={seg.v === 'fix' ? ['ok'] : ['x']} /></Ide>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'code' && seg.v !== 'repo' && <Term er={seg.v === 'out'} lines={OUT07} focus={seg.f} />}
      {seg.v === 'repo' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.usv}><CodePanel file={RF.usv} wrap lines={USVC_TS} focus={['s']} /></Ide>}
      {seg.sum && <div className="mk-rule">Bazadagi <code>telegram_id</code> — <b>matn</b>; solishtirishdan oldin <code>Number()</code> yoki <code>String()</code>.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  15 · SELECT'siz takror INSERT (tgpg-out/08)
// ============================================================
const S15 = mkS(15, [{ v: 'code' }, { v: 'err', f: ['x'] }, { v: 'err', f: ['d'] }, { v: 'fix', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-holat" files={BOT_FILES} active="bot.js"><CodePanel file="bot.js" wrap lines={seg.v === 'fix' ? BAZA_JS.slice(5, 13) : START_INSERT} focus={seg.v === 'fix' ? [] : ['x']} /></Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'err' && <Psql er lines={OUT08} focus={seg.f} />}
      {seg.v === 'fix' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — avval SELECT (10-ekran): ikkinchi /start</div><Term lines={OUT05.slice(10, 12)} focus={['a']} /><div className="mk-rule">Avval <b>SELECT</b> — qator topilsa INSERT qilinmaydi.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — LineCheck (3-satr = 2)
// ============================================================
const LC16 = sql(String.raw`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id INTEGER NOT NULL UNIQUE,
  ism TEXT,
  holat TEXT
);`);
const LC16_FIXED = LC16.map((l, i) => ({ ...l, n: i + 1, ...(i === 2 ? { gone: true } : {}) }));
LC16_FIXED.splice(3, 0, { h: sqlLine('  telegram_id BIGINT NOT NULL UNIQUE,'), n: 3, neu: true });
function Screen16(p) {
  const m = MDT[16];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="jadval.sql" lines={LC16} target={2}
    tree={{ root: 'bot-holat', files: tree(BOT_FILES, ['jadval.sql']), active: 'jadval.sql' }}
    fixed={LC16_FIXED} fixedExtra={[{ file: 'psql — botdb (haqiqiy, BIGINT jadval)', lines: OUT06_OK }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  17 · Amaliyot 2 — ikki buzish
// ============================================================
const P2 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Sinov jadvali — INTEGER ustun', cmds: ['CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);'], exp: 'CREATE TABLE' },
  { t: 'Katta raqam', cmds: ['INSERT INTO users_int (telegram_id) VALUES (5123456789);'], exp: 'ERROR:  integer out of range' },
  { t: "Takror — users dagi o'z raqamingiz bilan yana INSERT", cmds: ['SELECT telegram_id FROM users;'], exp: 'duplicate key value violates unique constraint' },
  { t: 'Tozalash', cmds: ['DROP TABLE users_int;'], exp: 'DROP TABLE' },
];
const P2_TROUBLE = [
  ['2-qadamda INSERT 0 1', 'raqam kichik yozilgan — 5123456789 kabi 2147483647 dan katta raqam'],
  ['3-qadamda INSERT 0 1', "jadvalda bu raqam yo'q edi — avval SELECT dagi raqamni oling"],
];
const P2_PROOF = { label: '2-qadamdagi xato xabari', placeholder: "ERROR qatorini qo'ying", check: (v) => /integer out of range/i.test(v), wrong: 'ERROR: bilan boshlanadigan satrni butunligicha nusxalang' };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  18 · O'quvchi reposi dars-04-done (tgpg-out/10, 12)
// ============================================================
const S18 = mkS(18, [{ v: 'out1' }, { v: 'ent' }, { v: 'svc' }, { v: 'out2', sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out1' && <Term lines={jt(String.raw`
$ git clone https://github.com/Azizbekcrypto/TelegramBotNest.git
$ git checkout -f dars-04-done
46c67e7 4-dars: users jadvali (PostgreSQL), bot ismni so'raydi va eslab qoladi (dars-04-done)
$ npm ci
added 394 packages, and audited 395 packages in 4s`)} />}
      {seg.v === 'ent' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.ent}><CodePanel file={RF.ent} wrap lines={ENTITY_TS} focus={['tg', 'h']} /></Ide>}
      {seg.v === 'svc' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.usv}><CodePanel file={RF.usv} wrap lines={USVC_TS} focus={['sel', 'ins']} /></Ide>}
      {seg.v === 'out2' && <Term lines={OUT12} focus={['a', 'j']} />}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'ent' && <><div className="mk-tag" style={{ margin: 0 }}>TypeORM yaratgan jadval (synchronize) — \d users dan parcha</div><Psql title="psql — botnest" lines={[PSQL12[0], PSQL12[6], PSQL12[8], PSQL12[9]]} focus={['t']} /></>}
      {seg.v === 'svc' && <CodePanel file={RF.tg + ' (parcha)'} numbers={false} wrap lines={TGSVC_TS} focus={['h']} />}
      {seg.v === 'out2' && <><Psql title="psql — botnest" lines={PSQL12.slice(10)} focus={['r']} /><div className="mk-rule">O'quvchi yechimi haqiqiy PostgreSQL bilan — qayta ishga tushgach <b>«Yana salom»</b>, ikki mijoz alohida.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Token xato va .env yo'q (tgpg-out/11, 13)
// ============================================================
const S19 = mkS(19, [{ v: 'tok', f: ['s'] }, { v: 'tok', f: ['s', 'x'] }, { v: 'env' }, { v: 'env', sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term er lines={OUT13} focus={seg.v === 'tok' ? seg.f : []} />
    {seg.v === 'env' && <Term er lines={OUT11} focus={['x']} />}
    {seg.sum && <div className="mk-rule">Bot javob bermasa — <b>«Telegram bot ulandi»</b> satrini qidiring; yo'q bo'lsa, o'rnidagi xato sababni aytadi (repo README — «Xatolar»).</div>}
  </div>} />;
}

// ============================================================
//  20 · Amaliyot 3 — o'quvchi reposi
// ============================================================
const P3 = mkS(20, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Repo — clone, dars-04-done, npm ci', cmds: ['git clone https://github.com/Azizbekcrypto/TelegramBotNest.git', 'cd TelegramBotNest', 'git checkout -f dars-04-done', 'npm ci'], exp: 'added … packages' },
  { t: ".env — o'z tokeningiz va lokal baza", cmds: ['psql -U postgres -c "CREATE DATABASE botnest;"'], exp: 'CREATE DATABASE · .env: BOT_TOKEN=… · DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botnest' },
  { t: 'Ishga — Telegram: /start → ismingiz', cmds: ['npm run start'], exp: 'Telegram bot ulandi · «Xush kelibsiz, …!»' },
  { t: 'Qayta ishga — Ctrl+C, npm run start, /start, keyin psql', cmds: ['psql -U postgres -d botnest -c "SELECT ism, holat FROM users;"'], exp: '«Yana salom, …!» · tayyor' },
];
const P3_TROUBLE = [
  ['DATABASE_URL topilmadi', ".env fayli loyiha ildizida emas yoki nomi .env.example (19-ekran)"],
  ['Telegram ulanmadi: 401: Unauthorized', "token — BotFather'dan qayta nusxalang (19-ekran)"],
  ['409: Conflict ⚠', "shu bot boshqa terminalda ham ishlayapti (12-amaliyotdagi bot.js) — eskisini to'xtating (README; sinalmagan)"],
  ['holat — ism_kutilmoqda', "ism yozilmagan — Telegram'da ismingizni yuboring"],
];
const P3_PROOF = { label: 'holat ustunidagi qiymat', placeholder: 'psql natijasidagi holatni yozing', check: (v) => /^\s*tayyor\s*$/i.test(v), wrong: 'psql natijasida ism yonidagi ikkinchi ustun — holat; ism yozilgandan keyin u nima bo\'ladi?' };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  21 · Tekshiruv 4
// ============================================================
function Screen21(p) {
  const m = MDT[21];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={OUT13.slice(1)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>To'g'ri token bilan — repo kodidagi satr</div>
      <Term lines={jt('Telegram bot ulandi')} />
    </div>} />;
}
