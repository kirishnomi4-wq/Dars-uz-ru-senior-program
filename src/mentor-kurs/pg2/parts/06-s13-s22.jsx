
// ============================================================
//  Server kodi — pg2-out/11-server.js aynan (port 5436 → 5432). Gemini promptiga mos BITTA NAMUNA (shartli)
// ============================================================
const SERVER_SRC = String.raw`
// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = 'password'; // o'z parolingizni yozing
const DATABASE = 'car_rental';

const pool = new Pool({ user: USER, password: PASSWORD, database: DATABASE, host: 'localhost', port: 5432 });
const app = express();
app.use(express.json());

// GET — hamma mashinalar
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — yangi mashina
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query('INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — narxni yangilash
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { daily_price } = req.body;
    const result = await pool.query('UPDATE cars SET daily_price = $1 WHERE id = $2 RETURNING *', [daily_price, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`;
// Kod satrlari (1-dan): bo'laklar id bilan — sahna segment bo'yicha yoritadi
const SRV_META = mergeMeta(
  rng(2, 3, { id: 'req' }), rng(5, 10, { id: 'pool' }), { 11: { id: 'app' }, 12: { id: 'json' } },
  rng(14, 23, { id: 'get' }), { 17: { id: 'getq' }, 18: { id: 'getq' } }, rng(19, 22, { id: 'catch' }),
  rng(25, 35, { id: 'post' }), { 29: { id: 'postq' } }, rng(37, 48, { id: 'put' }), { 42: { id: 'nf' } },
  rng(50, 60, { id: 'del' }), { 53: { id: 'delq' }, 54: { id: 'nf' } }, { 62: { id: 'listen' } });
const SERVER_LINES = js(SERVER_SRC, SRV_META);
const SRV_FILES = MKCFG.files;
// Bo'lak ko'rsatilsa ham satr raqami fayldagidek qoladi (n); tor ustunda — wrap
const SrvIde = ({ focus = [], lines = SERVER_LINES, children, from = 0, to, wrap }) => <Ide files={SRV_FILES} active="server.js">
  <CodePanel file="server.js" lines={lines.slice(from, to).map((l, i) => (l.n != null ? l : { ...l, n: from + i + 1 }))} focus={focus} wrap={wrap} style={{ fontSize: 12.5 }} />
  {children}
</Ide>;
const shamaNote = <div className="mk-tag" style={{ margin: 0 }}>Shartli namuna — Gemini har safar boshqacha yozadi, mazmuni shu (m4-08 promptlari)</div>;

// ============================================================
//  14 · Express'dan bazaga: Pool va GET
// ============================================================
const CARS13 = psql(String.raw`
car_rental=# CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);
CREATE TABLE
car_rental=# SELECT * FROM cars;
 id |      model       | daily_price | year | is_rented
----+------------------+-------------+------+-----------
  1 | Chevrolet Cobalt |      280000 | 2022 | f
  2 | Chevrolet Malibu |      520000 | 2023 | f
  3 | Kia K5           |      610000 | 2023 | f
(3 rows)`);
const GET13 = '[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false},\n {"id":2,"model":"Chevrolet Malibu",…}, {"id":3,"model":"Kia K5",…}]';
const S13 = mkS(14, [{ v: 'tab' }, { v: 'code', focus: ['pool'] }, { v: 'code', focus: ['getq'], pm: true }, { v: 'code', focus: ['catch'] }, { v: 'code', focus: ['pool', 'getq'], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'tab' && <><div className="pg-lab">1-qadam · o'quvchi o'zi, PostgreSQL terminalida</div><Psql title="psql — car_rental" lines={CARS13} /></>}
    {seg.v === 'code' && <SrvIde focus={seg.focus} to={23}>{shamaNote}</SrvIde>}
    {seg.pm && <PostmanCard m="GET" url="localhost:3000/api/cars" st={200} res={GET13} />}
    {seg.sum && <div className="mk-rule"><b>Pool</b> → <code>pool.query(sql)</code> → <code>result.rows</code> → <code>res.json</code> — server bazaga shu yo'l bilan ulanadi</div>}
  </>} />;
}

// ============================================================
//  15 · POST, PUT, DELETE
// ============================================================
const S14 = mkS(15, [{ focus: ['postq'], from: 24, to: 35, pm: 'post' }, { focus: ['postq'], from: 24, to: 35, pm: 'post', nul: true }, { focus: ['put', 'del'], from: 36, to: 60, pm: 'pd' }, { focus: ['nf'], from: 36, to: 60, pm: 'nf' }, { focus: [], from: 24, to: 60, pm: 'sum' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <SrvIde focus={seg.focus} from={seg.from} to={seg.to} wrap />
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {(seg.pm === 'post' || seg.pm === 'sum') && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'} st={201} res={'{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}'} hl={seg.nul} />}
      {seg.nul && <div className="n2-warn"><b>is_rented: null</b> — POST'da berilmagan, jadvalda <code>DEFAULT</code> yo'q. Kerak bo'lsa: <code>is_rented BOOLEAN DEFAULT false</code>.</div>}
      {(seg.pm === 'pd' || seg.pm === 'sum') && <><PostmanCard m="PUT" url="/api/cars/2" body={'{ "daily_price": 480000 }'} st={200} res={'{"id":2,"model":"Chevrolet Malibu","daily_price":480000,"year":2023,"is_rented":false}'} /><PostmanCard m="DELETE" url="/api/cars/1" st={200} res={'{"message":"O\'chirildi","deleted":1}'} /></>}
      {(seg.pm === 'nf' || seg.pm === 'sum') && <><PostmanCard m="PUT" url="/api/cars/99" body={'{ "daily_price": 1 }'} st={404} res={'{"error":"Mashina topilmadi"}'} hl={seg.pm === 'nf'} />{seg.pm === 'nf' && <div className="mk-rule">Baza <code>UPDATE 0</code> — xato emas. Kod <code>rowCount === 0</code> ni tekshirib <b>404</b> beradi — to'g'ri qaror: aks holda 200 «o'zgardi» deb aldaydi.</div>}</>}
    </div>
  </div>} />;
}

// ============================================================
//  16 · Nega $1 (pg2-out/17)
// ============================================================
const INJ_BAD = js(String.raw`
const result = await pool.query('DELETE FROM cars WHERE id = ' + req.params.id);  // ← yopishtirilgan`, { 1: { id: 'x' } });
const INJ_OK = js(String.raw`
const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);`, { 1: { id: 'x', neu: true } });
const INJ_AFTER_BAD = psql(String.raw`
car_rental=# SELECT id, model FROM cars;
 id | model
----+-------
(0 rows)`);
const INJ_AFTER_OK = psql(String.raw`
car_rental=# SELECT id, model FROM cars;
 id |      model
----+------------------
  3 | Kia K5
  4 | Chevrolet Spark
  2 | Chevrolet Malibu
(3 rows)`);
const S15 = mkS(16, [{ v: 'bad0' }, { v: 'bad' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="pg-lab" style={{ color: T.accent }}>Yopishtirilgan</div>
      <CodePanel file="server.js · DELETE" lines={INJ_BAD} focus={['x']} wrap style={{ fontSize: 12.5 }} />
      {seg.v !== 'bad0' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={200} res={'{"message":"O\'chirildi","deleted":3}'} hl={seg.v === 'bad'} /><Psql title="psql — car_rental" er lines={INJ_AFTER_BAD} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start', opacity: seg.v === 'both' ? 1 : 0.35 }}>
      <div className="pg-lab" style={{ color: T.green }}>$1 bilan</div>
      <CodePanel file="server.js · DELETE" lines={INJ_OK} wrap style={{ fontSize: 12.5 }} />
      {seg.v === 'both' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={500} res={'{"error":"invalid input syntax for type integer: \\"1 OR 1=1\\""}'} hl /><Psql title="psql — car_rental · jadval joyida" lines={INJ_AFTER_OK} /></>}
      {seg.sum && <div className="mk-rule">Foydalanuvchidan kelgan har qiymat — <code>$1, $2</code> + massiv. m4-08 promptida ham: «qiymatlarni SQL matniga yopishtirma».</div>}
    </div>
  </div>} />;
}

// ============================================================
//  17 · Amaliyot 3 — AvtoIjara server
// ============================================================
const P3 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Jadval', cmds: ['CREATE DATABASE car_rental;', '\\c car_rental', 'CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);', "INSERT INTO cars (model, daily_price, year, is_rented) VALUES ('Chevrolet Cobalt', 280000, 2022, false), ('Chevrolet Malibu', 520000, 2023, false), ('Kia K5', 610000, 2023, false);"], exp: 'INSERT 0 3' },
  { t: 'Loyiha', cmds: ['mkdir avto-ijara-server', 'cd avto-ijara-server', 'npm init -y', 'npm install express pg'], exp: 'added … packages' },
  { t: "Server — namuna yoki Gemini (m4-08 promptlari); parolingizni yozing", cmds: ['node server.js'], exp: 'Server 3000-portda ishlayapti' },
  { t: 'Postman', cmds: ['GET localhost:3000/api/cars', 'POST localhost:3000/api/cars   { "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'], exp: '200 · 3 mashina · POST — id bilan' },
];
const P3_CODE = [{ file: 'server.js', step: 2, lines: SERVER_LINES, copy: false }];
const P3_TROUBLE = [
  ['500 password authentication failed for user "postgres"', "PASSWORD — o'rnatishda berilgan parol (20-ekran)"],
  ['500 client password must be a string', "parol bo'sh / process.env o'qilmagan (20-ekran)"],
  ['500 database "…" does not exist', 'DATABASE nomi xato yoki baza yaratilmagan (20-ekran)'],
  ['500 {"error":""}', "PostgreSQL ishlamayapti — console.error(err) bilan ECONNREFUSED ko'rinadi (20-ekran)"],
  ["500 Cannot destructure property 'model' of 'req.body'", "app.use(express.json()) yo'q (19-ekran)"],
  ['500 column "price" of relation "cars" does not exist', 'kodda ustun nomi xato (18-ekran)'],
  ["kod o'zgardi, javob o'zgarmadi", 'eski server ishlab turibdi — 21-ekran'],
];
const P3_PROOF = { label: 'Isbot: POST javobining statusi', placeholder: "Postman ko'rsatgan statusni yozing", check: (v) => /^\s*201\b/.test(v), wrong: "Muvaffaqiyatli POST statusi uch xonali son — Postman'da javob ustida yozilgan" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={MKCFG.files} />; }

// ============================================================
//  18 · Buzamiz 1: price ustuni (pg2-out/12, 19)
// ============================================================
const POST_LINES = (bad, fixed) => {
  const src = SERVER_LINES.slice(24, 35).map((l, i) => ({ ...l, n: 25 + i }));
  return src.map((l, i) => {
    if (i !== 4) return l;
    if (bad) return { ...l, h: jsLine("    const result = await pool.query('INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);"), id: 'x' };
    return { ...l, id: 'x', neu: !!fixed };
  });
};
const PRICE_TERM = psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti
column "price" of relation "cars" does not exist`, { 3: { id: 'e' } });
const S17 = mkS(18, [{ st: 'bad' }, { st: 'bad', pm: 500 }, { st: 'fix', pm: 201 }, { st: 'fix', pm: 201, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div className="pg-two">
    <SrvIde lines={POST_LINES(seg.st === 'bad', seg.st === 'fix')} focus={['x']} wrap />
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.pm === 500 && <><PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={500} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'} hl /><Psql title="terminal — node server.js" er lines={PRICE_TERM} focus={['e']} /></>}
      {seg.pm === 201 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={201} res={'{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}'} hl />}
      {seg.sum && <div className="mk-rule">500 → <code>error</code> ichidagi nom (<code>"price"</code> · <code>"cars"</code>) → <code>\d cars</code> bilan solishtirish → tuzatish → serverni <b>qayta ishga tushirish</b></div>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Buzamiz 2: express.json() yo'q (pg2-out/13)
// ============================================================
const JSON_LINES = (gone) => SERVER_LINES.slice(9, 12).map((l, i) => ({ ...l, n: 10 + i, ...(i === 2 ? { id: 'j', gone: gone === 'gone', neu: gone === 'fix' } : {}) }));
const S18 = mkS(19, [{ st: 'gone' }, { st: 'gone', pm: 500 }, { st: 'fix', pm: 201 }, { st: 'fix', pm: 201, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    <SrvIde lines={JSON_LINES(seg.st)} focus={['j']}>
      {seg.pm === 500 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={500} res={'{"error":"Cannot destructure property \'model\' of \'req.body\' as it is undefined."}'} hl />}
      {seg.pm === 201 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={201} res={'{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}'} />}
    </SrvIde>
    {seg.st === 'gone' && !seg.pm && <div className="mk-tag" style={{ margin: 0 }}>Server baribir «Server 3000-portda ishlayapti» · GET ishlaydi — muammo faqat tanasi bor so'rovlarda (POST, PUT)</div>}
    {seg.sum && <div className="mk-rule"><code>req.body</code> — <b>undefined</b> → birinchi qaraladigan joy <code>app.use(express.json())</code> (app yaratilgandan keyin, endpointlardan oldin)</div>}
  </>} />;
}

// ============================================================
//  20 · Ulanish xatolari — birinchi so'rovda (pg2-out/14, 15)
// ============================================================
const CONN19 = [
  { k: 'pw', h: "Parol xato", code: "const PASSWORD = 'notogri';", st: 500, res: '{"error":"password authentication failed for user \\"postgres\\""}', fix: "o'rnatishda berilgan parol" },
  { k: 'pw', h: "Parol bo'sh (process.env o'qilmagan)", code: 'const PASSWORD = process.env.DB_PASSWORD;', st: 500, res: '{"error":"SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"}', fix: "parol o'zgaruvchisi bo'sh" },
  { k: 'db', h: 'Baza nomi xato', code: "const DATABASE = 'carrental';", st: 500, res: '{"error":"database \\"carrental\\" does not exist"}', fix: '\\l bilan aniq nom: car_rental' },
  { k: 'off', h: "PostgreSQL o'chiq", code: '— (server to\'xtatilgan)', st: 500, res: '{"error":""}', fix: 'console.error(err) → ECONNREFUSED → PostgreSQL\'ni ishga tushiring' },
];
const ECONN = psql(String.raw`
$ node server.js     (console.error(err.message) o'rniga console.error(err))
Server 3000-portda ishlayapti
AggregateError [ECONNREFUSED]:
    at …/node_modules/pg-pool/index.js:45:11
    at async …/server.js:17:20 {
  code: 'ECONNREFUSED',
  [errors]: [
    Error: connect ECONNREFUSED ::1:5432`, { 3: { id: 'e' }, 6: { id: 'e' }, 8: { id: 'e' } });
const S19 = mkS(20, [{ show: [] , start: true }, { show: [0, 1] }, { show: [2] }, { show: [3], econn: true }, { show: [0, 1, 2, 3] }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <Psql title="terminal — har to'rt holatda" lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} />
    {seg.start && <div className="mk-rule">Pool server ishga tushganda ulanmaydi — <b>birinchi so'rovda</b>. «Ishlayapti» faqat Express haqida.</div>}
    <div className="pg-two">{CONN19.map((c, i) => seg.show.includes(i) && <div key={i} style={{ display: 'grid', gap: 6, animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">{c.h} · <code style={{ textTransform: 'none' }}>{c.code}</code></div>
      <PostmanCard m="GET" url="/api/cars" st={c.st} res={c.res} />
      <div className="exp" style={{ fontSize: 12.5, color: T.green }}>Tuzatish: {c.fix}</div>
    </div>)}</div>
    {seg.econn && <Psql title="terminal — butun xato obyekti" er lines={ECONN} focus={['e']} />}
  </>} />;
}

// ============================================================
//  21 · Port band — «ishlayapti», lekin eski server (pg2-out/16, 20)
// ============================================================
const PORT20 = psql(String.raw`
$ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)
Server 3000-portda ishlayapti
[chiqish kodi: 0]`, { 2: { id: 'x' }, 3: { id: 'x' } });
const EXPRESS_SRC = js(String.raw`
// node_modules/express/lib/application.js (express 5.3.0)
app.listen = function listen() {
  var server = http.createServer(this)
  …
    server.once('error', done)   // xato callback'ga beriladi
  …
}
// server.js — callback xatoni o'qimaydi:
app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`, { 5: { id: 'e' }, 9: { id: 'cb' } });
const S20 = mkS(21, [{ v: 'q' }, { v: 'two' }, { v: 'src' }, { v: 'sum' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'q' && <div className="pg-two"><div className="mk-card"><h5>O'quvchi</h5><div style={{ fontSize: 15 }}>«Kodni tuzatdim, <code>node server.js</code> qildim — javob o'zgarmadi»</div></div><div className="mk-card"><h5>Sabab ko'pincha</h5><div style={{ fontSize: 15 }}>birinchi server boshqa terminalda hali ishlab turibdi</div></div></div>}
    {seg.v !== 'q' && <div className="pg-two">
      <div><div className="pg-lab">1-oyna · eski server</div><Psql title="terminal 1" lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} /></div>
      <div><div className="pg-lab">2-oyna · yangi kod <span className="tm">xato yo'q</span></div><Psql title="terminal 2" lines={PORT20} focus={seg.v === 'two' ? ['x'] : []} /></div>
    </div>}
    {(seg.v === 'src' || seg.v === 'sum') && <CodePanel file="nega — Express manbasi" lines={EXPRESS_SRC} focus={seg.v === 'src' ? ['e', 'cb'] : []} wrap style={{ fontSize: 12.5 }} />}
    {seg.v === 'sum' && <div className="mk-rule">Bitta loyiha — <b>bitta terminal</b>. Qayta ishga tushirishdan oldin <code>Ctrl+C</code>. «O'zgarmadi» desa — birinchi savol: boshqa terminalda server ochiq qolmadimi?</div>}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — qaysi satr 500 beradi (LineCheck; target 0 dan — 4-satr = 3)
// ============================================================
const LC21 = js(String.raw`
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query('INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }`);
const LC21_FIXED = LC21.map((l, i) => ({ ...l, n: i + 1, ...(i === 3 ? { gone: true } : {}) })); // n — fayldagi raqam (qo'shilgan satrdan keyin siljimasin)
LC21_FIXED.splice(4, 0, { h: jsLine("    const result = await pool.query('INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);"), n: 4, neu: true });
function Screen21(p) {
  const m = MDT[22];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="server.js" lines={LC21} target={3}
    tree={{ root: MKCFG.root, files: MKCFG.files, active: 'server.js' }}
    fixed={LC21_FIXED} fixedExtra={[{ file: 'Postman — haqiqiy javob', lines: plainLinesPm(`POST /api/cars → 201\n{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}
function plainLinesPm(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }

// ============================================================
//  23 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P4 = mkS(23, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: 'Buzish', cmds: ['INSERT INTO cars (model, price, year) …   ← server.js da', 'node server.js'], exp: '500 column "price" of relation "cars" does not exist' },
  { t: 'Tuzatish', cmds: ['price → daily_price', 'node server.js'], exp: '201' },
  { t: 'Ikki server', cmds: ['node server.js   ← 2-terminalda, 1-si ishlab turibdi'], exp: 'ikkinchisi ham «Server 3000-portda ishlayapti»' },
  { t: "To'xtatish", cmds: ['Ctrl+C   ← ikkala terminalda'], exp: "Postman: GET — javob yo'q (server yo'q)" },
];
const P4_TROUBLE = [
  ['1-qadamda 201', "server qayta ishga tushmagan — eski kod ishlayapti (21-ekran)"],
  ['column "price" does not exist (of relation siz)', "SELECT/UPDATE da xato qilingan — INSERT dagi ustunni o'zgartiring"],
  ['3-qadamda listen EADDRINUSE: address already in use :::3000', "sizning server.js ingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating"],
  ['4-qadamda javob bor', 'yana bir terminal ochiq qolgan — hammasini Ctrl+C'],
];
const P4_PROOF = { label: "Isbot: 1-qadamdagi 500 xabari", placeholder: "Postman'dagi error matnini qo'ying", check: (v) => /column\s+\\?"?price\\?"?\s+of relation\s+\\?"?cars\\?"?\s+does not exist/i.test(v), wrong: "Xabar to'liq bo'lsin: qaysi ustun va qaysi jadval (of relation …) — Postman'dagi error qiymatini nusxalang" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }
