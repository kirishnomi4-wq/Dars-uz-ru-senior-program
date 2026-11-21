
// ============================================================
//  14 · Qoida yozilmasa — qo'riqlamaydi: NOT NULL, DEFAULT, UNIQUE (v2f-ekran14, uzluksiz holat: nomsiz qator id 5, Planshet id 7)
// ============================================================
const T14 = {
  a: psql(String.raw`
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
INSERT 0 1
shop=# SELECT * FROM products WHERE name IS NULL;
 id | name | price | stock
  5 |      | 30000 |     4
(1 row)`, { 2: { id: 'x' }, 5: { id: 'x' } }),
  b: psql(String.raw`
shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
ERROR:  column "name" of relation "products" contains null values
shop=# DELETE FROM products WHERE name IS NULL;
DELETE 1
shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
ALTER TABLE
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
ERROR:  null value in column "name" of relation "products" violates not-null constraint`, { 2: { id: 'x' }, 6: { id: 'ok' }, 8: { id: 'ok' } }),
  c: psql(String.raw`
shop=# ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
ALTER TABLE
shop=# INSERT INTO products (name, price) VALUES ('Planshet', 300000) RETURNING *;
  7 | Planshet | 300000 |     0
shop=# ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
ALTER TABLE
shop=# INSERT INTO products (name, price, stock) VALUES ('Kolonka', 1, 1);
ERROR:  duplicate key value violates unique constraint "products_name_unique"
DETAIL:  Key (name)=(Kolonka) already exists.`, { 4: { id: 'ok' }, 8: { id: 'x' }, 9: { id: 'x' } }),
  d: psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable |               Default
--------+---------+----------+--------------------------------------
 id     | integer | not null | nextval('products_id_seq'::regclass)
 name   | text    | not null |
 price  | integer |          |
 stock  | integer |          | 0
Indexes:
    "products_name_unique" UNIQUE CONSTRAINT, btree (name)
Check constraints:
    "stock_nonneg" CHECK (stock >= 0)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)`),
};
// Qoidalar kartasi — qoshilib boradi (k: '' — doim; boshqasi — seg.on ichida bo'lsa)
const RULES14 = [['id', 'SERIAL PRIMARY KEY', ''], ['name', 'TEXT', ''], ['name', 'NOT NULL', 'nn'], ['price', 'INTEGER', ''], ['stock', 'INTEGER', ''], ['stock', 'DEFAULT 0', 'def'], ['stock', 'CHECK (stock >= 0) — 11-ekran', 'chk'], ['name', 'UNIQUE', 'uq'], ['orders', 'product_id REFERENCES products(id) — 11-ekran', 'fk']];
const S14 = mkS(14, [{ e: 'a', on: ['chk', 'fk'] }, { e: 'b', on: ['chk', 'fk', 'nn'], neu: ['nn'] }, { e: 'c', on: ['chk', 'fk', 'nn', 'def', 'uq'], neu: ['def', 'uq'] }, { e: 'd', on: ['chk', 'fk', 'nn', 'def', 'uq'], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    <div style={{ display: 'grid', gap: 12 }}>
      {!seg.sum && <Psql title="psql — shop" er={seg.e !== 'd'} lines={T14[seg.e]} focus={seg.e === 'a' ? ['x'] : seg.e === 'b' ? ['ok'] : seg.e === 'c' ? ['ok', 'x'] : []} />}
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("products — qoidalar", "products — правила")}</div>
        <div className="pg-rules" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>{RULES14.filter(([, , k]) => !k || seg.on.includes(k)).map(([c, r, k]) => <div key={c + r} className={`${k ? 'on' : ''}${(seg.neu || []).includes(k) ? ' new' : ''}`}><b style={{ minWidth: 70, whiteSpace: 'nowrap' }}>{c}</b><span>{r}</span></div>)}</div></div>
    </div>
    {seg.e === 'a' && <div className="n2-warn">{t("Xato yo'q, nomsiz qator saqlandi — jadvalda ", "Ошибки нет, строка без имени сохранилась — в таблице ")}<b>{t("NOT NULL yo'q", "нет NOT NULL")}</b>{t(" edi. Baza faqat yozilgan qoidani qo'riqlaydi.", " . База охраняет только записанное правило.")}</div>}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — psql'dagi nomsiz yozuvni endi baza o'zi rad etadi (haqiqiy xato, T14.d) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><CrudMachine path="psql" on={['psql', 'shop']} prods={[['1', 'Klaviatura', '120000'], ['2', 'Sichqoncha', '75000']]} psqlLine={['shop=#', 'INSERT INTO products (price, stock) VALUES (30000, 4);', 'ERROR: null value in column "name" … violates not-null constraint']} ro={['psql · shop', '<span class="n1-er">ERROR:  null value in column "name" of relation "products" violates not-null constraint</span>']} max={1} tag={t("Qoida bazada — xatoni kod emas, baza ushlaydi; xabarda qoida nomi bor", 'Правило в базе — ошибку ловит не код, а база; в сообщении есть имя правила')} /></div>}
  </>} />;
}

// ============================================================
//  15 · Xabarni o'qish: beshta xato (v2f-ekran15-16; O'yinchoq id 9)
// ============================================================
const E15 = {
  a: psql(String.raw`
shop=# SELECT * FROM product WHERE price < 100000;
ERROR:  relation "product" does not exist
LINE 1: SELECT * FROM product WHERE price < 100000;
                      ^`),
  b: psql(String.raw`
shop=# SELECT * FROM products WHERE narx < 100000;
ERROR:  column "narx" does not exist
LINE 1: SELECT * FROM products WHERE narx < 100000;
                                     ^
HINT:  Perhaps you meant to reference the column "products.name".`, { 5: { id: 'h' } }),
  c: psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet2', 'arzon', 3);
ERROR:  invalid input syntax for type integer: "arzon"
LINE 1: ...roducts (name, price, stock) VALUES ('Planshet2', 'arzon', 3...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet2', 300000);
ERROR:  INSERT has more target columns than expressions
LINE 1: INSERT INTO products (name, price, stock) VALUES ('Planshet2...
                                           ^`),
  d: psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);
ERROR:  syntax error at or near "yinchoq"
LINE 1: ...ERT INTO products (name, price, stock) VALUES ('O'yinchoq', ...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
 id |   name    | price | stock
----+-----------+-------+-------
  9 | O'yinchoq | 30000 |     4
(1 row)`, { 5: { neu: true, id: 'f' }, 8: { id: 'f' } }),
  e: psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable | Default
--------+---------+----------+---------
 id     | integer | not null |
 name   | text    | not null |
 price  | integer |          |
 stock  | integer |          | 0`),
};
const FORMULA15 = [['Qaysi jadval?', 'relation "…"', PG.pg], ['Qaysi ustun yoki qoida?', 'column "…" · constraint "…"', T.accent], ['Qaysi qiymat?', 'DETAIL / LINE … ^', T.yellow]];
const S15 = mkS(15, [{ e: 'a' }, { e: 'b', focus: ['h'] }, { e: 'c' }, { e: 'd', focus: ['f'] }, { e: 'e', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    <div className="pg-three">{FORMULA15.map(([h, d, c]) => <div key={h} className="mk-box" style={{ '--c': c }}><h4>{h}</h4><p style={{ fontFamily: MONO, fontSize: 12 }}>{d}</p></div>)}</div>
    <Psql title="psql — shop" er={seg.e !== 'e'} lines={E15[seg.e]} focus={seg.focus || []} />
    {seg.e === 'b' && <div className="n2-warn">{t(<>HINT <b>taxmin</b> qiladi: <code>name</code> ni taklif qildi, kerakli ustun esa <code>price</code>. Ishonchli manba — <code>\d products</code>.</>, <>HINT <b>гадает</b>: предложил <code>name</code>, а нужная колонка — <code>price</code>. Надёжный источник — <code>\d products</code>.</>)}</div>}
    {seg.sum && <div className="mk-rule">{t(<>Xabardagi nomni <code>\d products</code> bilan solishtiring · </>, <>Сравните имя из сообщения с <code>\d products</code> · </>)}<code>^</code>{t(" xato joyni ko'rsatadi · so'z ichidagi apostrof — ", " показывает место ошибки · апостроф внутри слова — ")}<b>{t("ikki marta", "дважды")}</b>: <code>'O''yinchoq'</code></div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — apostrof
// ============================================================
function Screen16(p) { return MC(p, 16, { above: <Psql title="psql — shop" er lines={E15.d.slice(0, 4)} />, after: <Psql title={t("psql — shop · tuzatildi", "psql — shop · исправлено")} lines={E15.d.slice(4)} focus={['f']} /> }); }

// ============================================================
//  Server kodi — pg2-out/11-server-80.js (Prettier 80, M43; parol o'rniga 'password'). Satr raqamlari fayldagidek:
//  Pool 10–16 · app/json 17–18 · GET 21–29 · POST 32–44 (SQL 36) · PUT 47–61 (404: 54–55) · DELETE 64–76 (404: 69–70) · listen 78
// ============================================================
const SERVER_SRC = String.raw`
// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = 'password'; // o'z parolingizni yozing
const DATABASE = 'car_rental';

const pool = new Pool({
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  host: 'localhost',
  port: 5432,
});
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
    const result = await pool.query(
      'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *',
      [model, daily_price, year],
    );
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
    const result = await pool.query(
      'UPDATE cars SET daily_price = $1 WHERE id = $2 RETURNING *',
      [daily_price, req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cars WHERE id = $1', [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`;
const SRV_META = mergeMeta(
  rng(10, 16, { id: 'pool' }), { 17: { id: 'app' }, 18: { id: 'json' } },
  rng(21, 29, { id: 'get' }), { 23: { id: 'getq' }, 24: { id: 'getq' } }, rng(25, 28, { id: 'catch' }),
  rng(32, 44, { id: 'post' }), rng(35, 38, { id: 'postq' }), { 36: { id: 'sqlp' } },
  rng(47, 61, { id: 'put' }), rng(50, 53, { id: 'putq' }), rng(54, 55, { id: 'nf' }),
  rng(64, 76, { id: 'del' }), rng(66, 68, { id: 'delq' }), rng(69, 70, { id: 'nf' }), { 78: { id: 'listen' } });
const SERVER_LINES = js(SERVER_SRC, SRV_META);
const SRV_FILES = MKCFG.files;
// Bo'lak: fayl satrlari a..b (1-asosli), raqamlar fayldagidek (n)
const srvSlice = (a, b, lines = SERVER_LINES) => lines.slice(a - 1, b).map((l, i) => (l.n != null ? l : { ...l, n: a + i }));
const SrvIde = ({ focus = [], a, b, lines, children }) => <Ide files={SRV_FILES} active="server.js">
  <CodePanel file="server.js" lines={lines || srvSlice(a, b)} focus={focus} style={{ fontSize: 12.5 }} />
  {children}
</Ide>;
function ShamaNoteC() { return <div className="mk-tag" style={{ margin: 0 }}>{t("Shartli namuna — Gemini har safar boshqacha yozadi, mazmuni shu", "Условный образец — Gemini каждый раз пишет по-разному, суть такая")}</div>; } // t() render paytida (modul darajasida LANG hali uz)
const shamaNote = <ShamaNoteC />;
const PM_POST = { m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }', st: 201, res: '{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}' };
const PM_ELANTRA = (st) => ({ m: 'POST', url: '/api/cars', body: '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }', st, res: st === 201 ? '{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}' : '' });

// ============================================================
//  17 · Pool nima va qachon ulanadi — o'lchab ko'rdik (v2f-pool: pid 378069, ulanish 0 → 1)
// ============================================================
const POOL17 = psql(String.raw`
$ node pool-pid.js
Pool yaratildi · ulanishlar: 0
so'rov 1: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
so'rov 2: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
so'rov 3: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1`, { 2: { id: 'z' }, 3: { id: 'one' }, 4: { id: 'one' }, 5: { id: 'one' } });
const BAD17 = psql(String.raw`
xato parol bilan Pool yaratildi — xato yo'q (hali ulanmadi)
birinchi so'rovda: password authentication failed for user "postgres"`, { 2: { id: 'x' } });
function PoolDiagram({ conn, pid, note }) {
  return <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">Server ↔ Pool ↔ PostgreSQL</div>
    <div className="pg-pool">
      <div className="mk-box" style={{ '--c': T.ink }}><h4>Express</h4><p>server.js</p></div><div className="ar">→</div>
      <div className="mk-box hl" style={{ '--c': T.purple }}><h4>Pool</h4><p>{t("ulanishlar: ", "соединения: ")}<b>{conn}</b></p></div><div className="ar">→</div>
      <div className="mk-box" style={{ '--c': PG.pg }}><h4>PostgreSQL</h4><p>{pid ? <>{t("jarayon pid ", "процесс pid ")}<b>{pid}</b></> : t('hali ulanmagan', "ещё не подключено")}</p></div>
    </div>
    {note && <div className="exp" style={{ marginTop: 8, color: T.ink2 }}>{note}</div>}
  </div>;
}
// F-1109-06: xulosa — uch karta o'rniga Kod · Pool · PostgreSQL yo'laklari (ulanish 0 → birinchi so'rovda ochiladi → o'sha pid) va parol xatosi
function Lanes17() {
  const PID = 378069; // shu ekrandagi terminal (POOL17) bilan bir xil
  const row = (tm, code, pool, on) => <><div className="tm">{tm}</div><div><code>{code}</code></div><div>{pool}</div><div>{on ? <><span className="p2-cn on"><i /></span><span className="p2-pid">pid {PID}</span></> : <><span className="p2-cn"><i /></span><span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>{t("hali bog'lanmagan", "ещё не связан")}</span></>}</div></>;
  return <div className="z">
    <div className="p2-lanes">
      <div className="h" /><div className="h" style={{ color: '#6D3BE4' }}>{t("Kod · server.js", "Код · server.js")}</div><div className="h" style={{ color: '#336791' }}>Pool</div><div className="h" style={{ color: '#336791' }}>PostgreSQL</div>
      {row(t("ishga tushdi", "запуск"), 'new Pool({…})', <>{t("yaratildi · ", "создан · ")}<b>{t("ulanish: 0", "соединений: 0")}</b></>, false)}
      {row(t("so'rov 1", "запрос 1"), 'pool.query(…)', <b>{t("ulanish ochdi", "открыл соединение")}</b>, true)}
      {row(t("so'rov 2", "запрос 2"), 'pool.query(…)', t("o'sha ulanish", "то же соединение"), true)}
      {row(t("so'rov 3", "запрос 3"), 'pool.query(…)', t("o'sha ulanish", "то же соединение"), true)}
    </div>
    <div className="p2-bad">
      <b>{t("Parol xato", "Неверный пароль")}</b>
      <div>{t("Ishga tushganda ", "При запуске ")}<span style={{ color: '#15803D', fontWeight: 700 }}>{t("✓ xato yo'q", "✓ ошибки нет")}</span>{t(" — Pool hali bazaga bormagan", " — Pool ещё не ходил в базу")}</div>
      <span />
      <div className="z-term">Server 3000-portda ishlayapti{'\n'}<span className="r">{t("so'rov 1", "запрос 1")} → password authentication failed for user "postgres"</span></div>
    </div>
  </div>;
}
const S17 = mkS(17, [{ v: 'code' }, { v: 'pid' }, { v: 'bad' }, { v: 'sum' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {seg.v === 'code' && <SrvIde a={2} b={16} focus={['pool']}>{shamaNote}</SrvIde>}
    {seg.v === 'pid' && <><Psql title={t("terminal — node pool-pid.js (shop bazasida)", "терминал — node pool-pid.js (в базе shop)")} lines={POOL17} focus={['z', 'one']} /><PoolDiagram conn={1} pid={378069} note={t("Uch so'rov — bitta ulanish, bitta pid: Pool borini qayta ishlatadi.", "Три запроса — одно соединение, один pid: Pool переиспользует имеющееся.")} /></>}
    {seg.v === 'bad' && <><Psql title={t("terminal — xato parol bilan", "терминал — с неверным паролем")} er lines={BAD17} focus={['x']} /><PoolDiagram conn={0} pid={null} note={t("Pool yaratildi, lekin ulanmadi — xato faqat birinchi so'rovda chiqadi.", "Pool создан, но не подключился — ошибка выходит только на первом запросе.")} /></>}
    {seg.v === 'sum' && <Lanes17 />}
  </>} />;
}

// ============================================================
//  18 · GET: pool.query → rows, rowCount → res.json (11-crud-sorovlar GET 200; rowCount — v2f-pool)
// ============================================================
const GET18 = '[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false},\n {"id":2,"model":"Chevrolet Malibu",…}, {"id":3,"model":"Kia K5",…}]';
const RC18 = psql(String.raw`
rowCount: 3 · rows: [{"name":"Klaviatura","price":89000},{"name":"Sichqoncha","price":75000},{"name":"Kolonka","price":50000}]
UPDATE id=99 → rowCount: 0 · rows: []`, { 1: { id: 'r' }, 2: { id: 'z' } });
const STEPS18 = [['Pool', 'ulanadi', T.purple], ['pool.query(sql)', "so'rov bazaga", PG.pg], ['rows / rowCount', 'natija', T.green], ['res.json', 'javob', T.ink]];
// F-1109-06: xulosa — to'rt kichik karta o'rniga GET /api/cars yo'li haqiqiy qiymatlar bilan, rowCount jadvali va catch (12-price-xato)
// F-1120-02 (M51): yuqoridagi oqim kartasi o'rniga darsning rasmi — o'sha GET yo'li (CrudMachine)
function Flow18() {
  return <div className="z">
    <div className="z-card" style={{ padding: 12 }}>
      <CrudMachine path="api" on={['pm', 'route', 'pool', 'cars']} req={{ m: 'GET', url: '/api/cars', body: null }} st={200} res={'[{"id":1,"model":"Chevrolet Cobalt",…}, …]'}
        route={"app.<span class=\"n1-k\">get</span>(<span class=\"n1-s\">'/api/cars'</span>)"} sql={"pool.query(<span class=\"n1-s\">'SELECT * FROM cars'</span>)"} rc="rows: 3 · rowCount: 3" back="result.rows → res.json → 200"
        ro={['server.js:24', 'res.json(result.rows);']} tag={t("GET /api/cars — so'rov serverdan bazaga va qaytib", 'GET /api/cars — запрос от сервера к базе и обратно')} />
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("rowCount — terminaldagi son", "rowCount — число из терминала")}</p>
        <table className="z-tbl"><tbody>
          <tr><th>{t("terminalda", "в терминале")}</th><th>{t("pool.query natijasida", "в результате pool.query")}</th></tr>
          <tr><td>(3 rows)</td><td>rowCount: 3</td></tr>
          <tr className="hl"><td>UPDATE 0</td><td>rowCount: 0 · rows: []</td></tr>
        </tbody></table>
        <span className="z-mut">{t("UPDATE … WHERE id = 99 — mos qator yo'q, xato emas", "UPDATE … WHERE id = 99 — подходящей строки нет, это не ошибка")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
        <p className="z-h" style={{ color: 'var(--bad)' }}>{t("xato bo'lsa — catch", "при ошибке — catch")}</p>
        <div className="z-term">res.status(500).json({'{'} error: err.message {'}'}){'\n'}<span className="m">→</span> <span className="r">500</span> {'{'}"error":"column \"price\" of relation \"cars\" does not exist"{'}'}</div>
        <span className="z-mut">{t("5-bosqichdagi hamma xato shu yo'ldan keladi", "все ошибки 5-го этапа приходят этим путём")}</span>
      </div>
    </div>
  </div>;
}
const S18 = mkS(18, [{ v: 'code', focus: ['getq'], pm: true }, { v: 'rc' }, { v: 'code', focus: ['catch'] }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'code' && <SrvIde a={21} b={29} focus={seg.focus} />}
    {seg.pm && <PostmanCard m="GET" url="localhost:3000/api/cars" st={200} res={GET18} />}
    {seg.v === 'rc' && <><Psql title={t("node — shop bazasida sinov (pool-pid.js)", "node — проверка в базе shop (pool-pid.js)")} lines={RC18} focus={['r', 'z']} /><div className="mk-rule"><code>rowCount</code>{t(" — terminaldagi ", " — из терминала: ")}<code>UPDATE 1</code> / <code>(3 rows)</code>{t(" ning o'zi · ", " — то же самое · ")}<code>rowCount: 0</code>{t(" — 1-bosqichdagi ", " — тот самый ")}<code>UPDATE 0</code>{t(" shu yerga keladi", " с 1-го этапа приходит сюда")}</div></>}
    {seg.v === 'code' && seg.focus[0] === 'catch' && <div className="n2-warn"><code>await</code>{t(" — so'rov kutiladi, funksiya ", " — запрос ожидается, функция ")}<code>async</code>{t(" · xato bo'lsa ", " · при ошибке ")}<code>catch</code>: status <b>500</b>{t(" va xato matni — 5-bosqichdagi hamma xato shu yerdan chiqadi", " и текст ошибки — все ошибки 5-го этапа выходят отсюда")}</div>}
    {seg.v === 'sum' && <Flow18 />}
  </>} />;
}

// ============================================================
//  19 · POST, PUT, DELETE: RETURNING *, statuslar, 404 (11-crud-sorovlar)
// ============================================================
const STATUS19 = [['GET', '200', PG.pg], ['POST', '201', T.green], ['PUT · DELETE', '200', T.green], ['topilmasa', '404', T.yellow], ['xato', '500', '#B91C1C']];
// F-1109-06: xulosa — beshta status qutichasi o'rniga «so'rov · SQL · baza javobi → status» jadvali (11-crud-sorovlar) va server.js dagi 404 satri
const ROWS19 = [
  ['GET /api/cars', 'SELECT *', ['3 ta qator', '3 строки'], '200', 's2'],
  ['POST /api/cars', 'INSERT … RETURNING *', ['yangi qator, id 4', 'новая строка, id 4'], '201', 's2'],
  ['PUT /api/cars/2', 'UPDATE … WHERE id = $2', ['rowCount: 1', 'rowCount: 1'], '200', 's2'],
  ['DELETE /api/cars/1', 'DELETE … WHERE id = $1', ['rowCount: 1', 'rowCount: 1'], '200', 's2'],
];
function Table19() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Kim qaysi statusni beradi — server.js, haqiqiy javoblar", "Кто какой статус даёт — server.js, настоящие ответы")}</p>
      <table className="z-tbl p2-s19"><tbody>
        <tr><th>{t("so'rov", "запрос")}</th><th>SQL</th><th>{t("baza javobi", "ответ базы")}</th><th /><th>status</th></tr>
        {ROWS19.map(([q, sql, [uz, ruT], st, c]) => <tr key={q}><td>{q}</td><td>{sql}</td><td>{t(uz, ruT)}</td><td className="ar">→</td><td className={'st ' + c}>{st}</td></tr>)}
        <tr className="k"><td>PUT /api/cars/99</td><td>UPDATE … WHERE id = $2</td><td><b>rowCount: 0</b>{t(" — xato emas", " — не ошибка")}</td><td className="ar">→</td><td className="st s4">404</td></tr>
        <tr><td>{t("har qaysi", "любой")}</td><td colSpan={2}>{t("baza xato berdi → catch", "база вернула ошибку → catch")}</td><td className="ar">→</td><td className="st s5">500</td></tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: '#B45309' }}>
        <p className="z-h" style={{ color: '#B45309' }}>{t("404 ni rowCount hal qiladi", "404 решает rowCount")}</p>
        <div className="z-term"><span className="c">if</span> (result.rowCount === <span className="y">0</span>){'\n'}  <span className="c">return</span> res.status(<span className="y">404</span>).json({'{'} error: <span className="g">'Mashina topilmadi'</span> {'}'});</div>
        <span className="z-mut">{t("Bu tekshiruv bo'lmasa javob 200 — yolg'on «o'zgardi»", "Без этой проверки ответ 200 — ложное «изменено»")}</span>
      </div>
      <div className="z-card">
        <p className="z-h">{t("POST javobida", "В ответе POST")}</p>
        <div className="z-term">{'{'}"id":4,"model":"Chevrolet Spark",…,<span className="hl">"is_rented":null</span>{'}'}</div>
        <span className="z-mut">{t("ustun berilmadi, jadvalda DEFAULT yo'q → null", "колонку не передали, в таблице нет DEFAULT → null")}</span>
      </div>
    </div>
  </div>;
}
const S19 = mkS(19, [{ v: 'post' }, { v: 'post', nul: true }, { v: 'pd' }, { v: 'sum' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'post' && <><SrvIde a={32} b={44} focus={['sqlp']} /><PostmanCard {...PM_POST} hl={seg.nul} />
      {seg.nul && <div className="n2-warn"><b>is_rented: null</b>{t(" — POST'da berilmagan, jadvalda ", " — не передан в POST, а в таблице ")}<code>DEFAULT</code>{t(" yo'q (3-bosqich). Yechim jadvalda: ", " нет (3-й этап). Решение в таблице: ")}<code>ALTER TABLE cars ALTER COLUMN is_rented SET DEFAULT false</code>.</div>}</>}
    {seg.v === 'pd' && <><Ide files={SRV_FILES} active="server.js">
        <CodePanel file="server.js · PUT" lines={srvSlice(50, 56)} focus={['nf']} style={{ fontSize: 12.5 }} />
        <CodePanel file="server.js · DELETE" lines={srvSlice(66, 71)} focus={['nf']} style={{ fontSize: 12.5 }} />
      </Ide>
      <div className="pg-cards3">
        <PostmanCard m="PUT" url="/api/cars/2" body={'{ "daily_price": 480000 }'} st={200} res={'{"id":2,"model":"Chevrolet Malibu","daily_price":480000,"year":2023,"is_rented":false}'} />
        <PostmanCard m="DELETE" url="/api/cars/1" st={200} res={'{"message":"O\'chirildi","deleted":1}'} />
        <PostmanCard m="PUT" url="/api/cars/99" body={'{ "daily_price": 1 }'} st={404} res={'{"error":"Mashina topilmadi"}'} hl />
      </div>
      <div className="mk-rule">{t("Baza ", "База ")}<code>UPDATE 0</code>{t(" — xato emas. Kod ", " — не ошибка. Код ")}<code>rowCount === 0</code>{t(" ni tekshirib ", " проверяет и ")}<b>404</b>{t(" beradi; usiz javob 200 bo'lardi — yolg'on «o'zgardi».", " даёт; без этого ответ был бы 200 — ложное «изменено».")}</div></>}
    {seg.v === 'sum' && <Table19 />}
  </>} />;
}

// ============================================================
//  20 · Nega $1 — injection'ni o'zimiz qildik (pg2-out/17)
// ============================================================
const INJ_BAD = js(`
const result = await pool.query('DELETE FROM cars WHERE id = ' + req.params.id); // ← yopishtirilgan`, { 1: { id: 'x' } });
const INJ_OK = js(`
const result = await pool.query('DELETE FROM cars WHERE id = $1', [
  req.params.id,
]);`, { 1: { id: 'x', neu: true }, 2: { id: 'x', neu: true }, 3: { id: 'x', neu: true } });
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
const S20 = mkS(20, [{ v: 'bad0' }, { v: 'bad' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="pg-lab" style={{ color: T.accent }}>{t("Yopishtirilgan", "Приклеено")}</div>
      <CodePanel file="server.js · DELETE" lines={INJ_BAD} focus={['x']} style={{ fontSize: 12.5 }} />
      {seg.v === 'bad' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={200} res={'{"message":"O\'chirildi","deleted":3}'} hl={seg.v === 'bad'} /><Psql title="psql — car_rental" er lines={INJ_AFTER_BAD} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start', opacity: seg.v === 'both' ? 1 : 0.35 }}>
      <div className="pg-lab" style={{ color: T.green }}>{t("$1 bilan", "с $1")}</div>
      <CodePanel file="server.js · DELETE" lines={INJ_OK} style={{ fontSize: 12.5 }} />
      {seg.v === 'both' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={500} res={'{"error":"invalid input syntax for type integer: \\"1 OR 1=1\\""}'} hl /><Psql title={t("psql — car_rental · jadval joyida", "psql — car_rental · таблица на месте")} lines={INJ_AFTER_OK} /></>}
      {seg.sum && <div className="mk-rule">{t("Foydalanuvchidan kelgan har qiymat — ", "Каждое значение от пользователя — ")}<code>$1, $2</code>{t(" + massiv. SQL matniga ", " + массив. В текст SQL ")}<b>{t("hech qachon", "никогда")}</b>{t(" yopishtirilmaydi: bu uslub emas, xavfsizlik.", " не приклеивается: это не стиль, а безопасность.")}</div>}
    </div>
  </div>} />;
}

// ============================================================
//  21 · Amaliyot 3 — AvtoIjara server (kod: namuna, nusxalash yo'q)
// ============================================================
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], { code: [{ file: 'server.js', step: 2, lines: SERVER_LINES, copy: false }], tree: MKCFG.files });
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={P21.tree} />; }

// ============================================================
//  22 · Buzamiz 1: price ustuni (pg2-out/12, 19) — POST bo'lagi 32–44, xato 36-satr
// ============================================================
// F-1120-02 (M52): 1-segment (x) — mentor 36-satrdagi daily_price ni o'zi bosadi; 'ok' holatida so'z yonib turadi (data-act)
const POST_LINES = (st) => srvSlice(32, 44).map((l, i) => {
  if (i !== 4) return l;
  if (st === 'bad') return { ...l, h: jsLine("      'INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *',"), id: 'x' };
  if (st === 'ok') return { ...l, id: 'x', h: l.h.replace('daily_price', '<span class="n1-act" data-act="1">daily_price</span>') };
  return { ...l, id: 'x', neu: st === 'fix' };
});
const PRICE_TERM = psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti
column "price" of relation "cars" does not exist`, { 3: { id: 'e' } });
const S22 = mkS(22, [{ st: 'ok' }, { st: 'bad' }, { st: 'bad', pm: 500 }, { st: 'fix', pm: 201 }, { sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={(b) => <Scene22 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (javob «?») · 2 POST → 500, bo'laklar 1·2 · 3 tuzatildi → 201 · 4 xulosa — darsning rasmi
// Postman chiqqan qadamlarda kod 35–42-satr (1280×720 da kichik rasm va javob ko'rinib tursin)
function Scene22({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const st = beat === 0 ? (act.hit ? 'bad' : 'ok') : seg.st;
  if (seg.sum) return <>
    <div className="mk-light" style={{ padding: 14 }}>
      <CrudMachine path="api" on={['pm', 'json', 'route', 'pool', 'cars']} st={500} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'}
        req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }' }}
        sql={"INSERT … (model, <b style=\"color:#DC2626\">price</b>, …)"} col={'id · model · <b style="color:#12805A">daily_price</b>'} bad={{ at: 'cars', why: t("cars'da price ustuni yo'q", 'в cars нет колонки price') }}
        back="catch → res.status(500)" ro={['\\d cars', 'Column: id · model · <span class="n1-ok">daily_price</span> · year · is_rented']}
        tag={t("Xabardagi nom — jadvaldagi nom bilan solishtiring", 'Имя из сообщения — сравните с именем в таблице')} />
    </div>
    <div className="mk-rule">{t("Xabar nimani tuzatishni ", "Что исправить, сообщение ")}<b>{t("o'zi aytdi", "сказал сам")}</b>{t(": ustun ", ": колонка ")}<code>price</code>{t(", jadval ", ", таблица ")}<code>cars</code>{t(". Kod o'zgargandan keyin serverni albatta qayta ishga tushiring.", ". После изменения кода обязательно перезапустите сервер.")}</div>
  </>;
  return <>
    <Ide files={SRV_FILES} active="server.js">
      <div onClick={act.onClick}><CodePanel key={st + (seg.pm ? 'p' : '')} file="server.js" lines={seg.pm ? POST_LINES(st).slice(3, 11) : POST_LINES(st)} focus={['x']} style={{ fontSize: 12.5 }} /></div>
      <N1Mini><CrudMini broken={st === 'ok' ? null : 'col'} known={beat >= 2} fixed={st === 'fix'} pins={beat === 2 ? { a: 1, b: 2 } : {}} /></N1Mini>
    </Ide>
    {seg.pm === 500 && <div className="pg-two"><PostmanCard {...PM_ELANTRA(500)} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'} hl /><Psql title={t("terminal — node server.js", "терминал — node server.js")} er lines={PRICE_TERM} focus={['e']} marks={{ 2: 'n1-p1' }} /></div>}
    {seg.pm === 201 && <PostmanCard {...PM_ELANTRA(201)} hl />}
  </>;
}

// ============================================================
//  23 · Buzamiz 2: express.json() yo'q (pg2-out/13) — 16–18-satrlar
// ============================================================
// F-1120-02 (M52): 'ok' — 18-satr yonib turadi (data-act), mentor bosgach 'gone'
const JSON_LINES = (st) => srvSlice(16, 18).map((l, i) => (i === 2 ? { ...l, id: 'j', gone: st === 'gone', neu: st === 'fix', ...(st === 'ok' ? { h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : {}) } : l));
// F-1109-06: xulosa — kod yashirilib uch quti qolardi; endi bitta POST ikki yo'lda (13-express-json-yoq), satr joyi va belgisi
function Two23() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bitta POST — ikki yo'l", "Один POST — два пути")}</p>
      <div className="z-term"><span className="m">POST /api/cars</span>  {'{'} "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 {'}'}</div>
      <div className="z-flow">
        <div className="z-st bad"><b>{t("app.use(express.json()) yo'q", "app.use(express.json()) нет")}</b><span className="z-mut">{t("tana o'qilmaydi", "тело не читается")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>req.body</b><span className="zm">undefined</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>{t("javob", "ответ")}</b><span className="z-tag r">500</span><span className="zm" style={{ fontSize: 12 }}>Cannot destructure property 'model' of 'req.body' as it is undefined.</span></div>
      </div>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("app.use(express.json()) bor", "app.use(express.json()) есть")}</b><span className="z-mut">{t("JSON tana obyektga aylanadi", "JSON-тело становится объектом")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>req.body</b><span className="zm">{'{'} model, daily_price, year {'}'}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("javob", "ответ")}</b><span className="z-tag g">201</span><span className="zm" style={{ fontSize: 12 }}>{'{'}"id":5,"model":"Hyundai Elantra",…{'}'}</span></div>
      </div>
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("server.js — joyi", "server.js — место")}</p>
        <div className="z-term"><span className="c">const</span> app = express();{'\n'}<span className="hl">app.use(express.json());</span></div>
        <span className="z-mut">{t("app yaratilgandan keyin, endpoint'lardan oldin — har so'rovdan oldin ishlaydi", "после создания app, до endpoint — срабатывает перед каждым запросом")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--pg)' }}>
        <p className="z-h" style={{ color: 'var(--pg)' }}>{t("Belgisi", "Признак")}</p>
        <div><span className="z-tag g">GET 200</span> <span className="z-tag r">POST 500</span></div>
        <span className="z-mut">{t("Server «ishlayapti» deydi, GET ishlaydi — tanasi bor so'rov (POST, PUT) yiqiladi. Birinchi qaraladigan joy — shu satr.", "Сервер говорит «работает», GET работает — падает запрос с телом (POST, PUT). Первое, куда смотреть, — эта строка.")}</span>
      </div>
    </div>
  </div>;
}
const S23 = mkS(23, [{ st: 'ok' }, { st: 'gone' }, { st: 'gone', pm: 500 }, { st: 'fix', pm: 201 }, { sum: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={(b) => <Scene23 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 o'chdi (GET ishlaydi, POST «?») · 2 POST → 500, bo'lak 1 · 3 qaytdi → 201 · 4 xulosa (Two23)
function Scene23({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const st = beat === 0 ? (act.hit ? 'gone' : 'ok') : seg.st;
  if (seg.sum) return <Two23 />;
  return <>
    <Ide files={SRV_FILES} active="server.js">
      <div onClick={act.onClick}><CodePanel key={st} file="server.js" lines={JSON_LINES(st)} focus={['j']} style={{ fontSize: 12.5 }} /></div>
      <N1Mini><CrudMini broken={st === 'ok' ? null : 'json'} known={beat >= 2} fixed={st === 'fix'} pins={beat === 2 ? { a: 1 } : {}} /></N1Mini>
    </Ide>
    {st === 'gone' && !seg.pm && <div className="mk-tag" style={{ margin: 0 }}>{t("Server baribir «Server 3000-portda ishlayapti» · GET ishlaydi — muammo faqat tanasi bor so'rovlarda (POST, PUT)", "Сервер всё равно «Server 3000-portda ishlayapti» · GET работает — проблема только в запросах с телом (POST, PUT)")}</div>}
    {seg.pm === 500 && <PostmanCard {...PM_ELANTRA(500)} res={'{"error":"Cannot destructure property \'model\' of \'req.body\' as it is undefined."}'} hl />}
    {seg.pm === 201 && <PostmanCard {...PM_ELANTRA(201)} hl />}
  </>;
}

// ============================================================
//  24 · Ulanish xatolari — birinchi so'rovda (pg2-out/14, 15)
// ============================================================
const CONN24 = [
  { h: 'Parol xato', code: "const PASSWORD = 'notogri';", st: 500, res: '{"error":"password authentication failed for user \\"postgres\\""}', fix: "o'rnatishda berilgan parol" },
  { h: "Parol bo'sh (process.env o'qilmagan)", code: 'const PASSWORD = process.env.DB_PASSWORD;', st: 500, res: '{"error":"SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"}', fix: "parol o'zgaruvchisi bo'sh" },
  { h: 'Baza nomi xato', code: "const DATABASE = 'carrental';", st: 500, res: '{"error":"database \\"carrental\\" does not exist"}', fix: '\\l bilan aniq nom: car_rental' },
  { h: "PostgreSQL o'chiq", code: "— (server to'xtatilgan)", st: 500, res: '{"error":""}', fix: "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring" },
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
const S24 = mkS(24, [{ show: [], start: true }, { show: [0, 1] }, { show: [2] }, { show: [3], econn: true }, { show: [0, 1, 2, 3] }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <Psql title={t("terminal — har to'rt holatda", "терминал — во всех четырёх случаях")} lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} />
    {seg.start && <div className="mk-rule">Pool server ishga tushganda ulanmaydi (17-ekran) — <b>birinchi so'rovda</b>. «Ishlayapti» faqat Express haqida.</div>}
    <div className="pg-two">{CONN24.map((c, i) => seg.show.includes(i) && <div key={i} style={{ display: 'grid', gap: 6, animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">{c.h} · <code style={{ textTransform: 'none' }}>{c.code}</code></div>
      <PostmanCard m="GET" url="/api/cars" st={c.st} res={c.res} />
      <div className="exp" style={{ fontSize: 12.5, color: T.green }}>Tuzatish: {c.fix}</div>
    </div>)}</div>
    {seg.econn && <Psql title="terminal — butun xato obyekti" er lines={ECONN} focus={['e']} />}
  </>} />;
}

// ============================================================
//  25 · Port band — «ishlayapti», lekin eski server (pg2-out/16, 20)
// ============================================================
const PORT25 = psql(String.raw`
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
const S25 = mkS(25, [{ v: 'q' }, { v: 'two' }, { v: 'src' }, { v: 'sum' }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    {seg.v === 'q' && <div className="pg-two"><div className="mk-card"><h5>{t("Mentor yoki o'quvchi", "Ментор или ученик")}</h5><div style={{ fontSize: 15 }}>{t("«Kodni tuzatdim, ", "«Исправил код, ")}<code>node server.js</code>{t(" qildim — javob o'zgarmadi»", " сделал — ответ не изменился»")}</div></div><div className="mk-card"><h5>{t("Sabab ko'pincha", "Причина обычно")}</h5><div style={{ fontSize: 15 }}>{t("birinchi server boshqa terminalda hali ishlab turibdi", "первый сервер ещё работает в другом терминале")}</div></div></div>}
    {seg.v !== 'q' && <div className="pg-two">
      <div><div className="pg-lab">{t("1-oyna · eski server", "1-е окно · старый сервер")}</div><Psql title={t("terminal 1", "терминал 1")} lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} /></div>
      <div><div className="pg-lab">{t("2-oyna · yangi kod ", "2-е окно · новый код ")}<span className="tm">{t("xato yo'q", "ошибки нет")}</span></div><Psql title={t("terminal 2", "терминал 2")} lines={PORT25} focus={seg.v === 'two' ? ['x'] : []} /></div>
    </div>}
    {(seg.v === 'src' || seg.v === 'sum') && <CodePanel file={t("nega — Express manbasi", "почему — исходник Express")} lines={EXPRESS_SRC} focus={seg.v === 'src' ? ['e', 'cb'] : []} style={{ fontSize: 12.5 }} />}
    {seg.v === 'sum' && <div className="mk-rule">{t(<>Bitta loyiha — <b>bitta terminal</b>. Qayta ishga tushirishdan oldin <code>Ctrl+C</code>. «O'zgarmadi» desa — birinchi savol: boshqa terminalda server ochiq qolmadimi?</>, <>Один проект — <b>один терминал</b>. Перед перезапуском — <code>Ctrl+C</code>. Если говорят «не изменилось» — первый вопрос: не остался ли сервер открыт в другом терминале?</>)}</div>}
  </>} />;
}

// ============================================================
//  26 · Tekshiruv 4 — qaysi satr 500 beradi (LineCheck; fayl satrlari 32–43, xato 36 → target 4)
// ============================================================
const LC26 = srvSlice(32, 43).map((l, i) => (i === 4 ? { ...l, h: jsLine("      'INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *',") } : l)).map((l) => ({ h: l.h, n: l.n }));
const LC26_FIXED = LC26.map((l, i) => ({ ...l, ...(i === 4 ? { gone: true } : {}) }));
LC26_FIXED.splice(5, 0, { h: jsLine("      'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *',"), n: 36, neu: true });
function plainLinesPm(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }
function Screen26(p) {
  const m = MDT[26];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="server.js" lines={LC26} target={4}
    tree={{ root: MKCFG.root, files: MKCFG.files, active: 'server.js' }}
    fixed={LC26_FIXED} fixedExtra={[{ file: t('Postman — haqiqiy javob', "Postman — настоящий ответ"), lines: plainLinesPm(`POST /api/cars → 201\n{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  27 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P27 = mkPractice(27, [[], [0, 1], [2, 3], []]);
function ScreenP27(p) { return <Practice p={p} S={P27.S} steps={P27.steps} trouble={P27.trouble} proof={P27.proof} />; }
