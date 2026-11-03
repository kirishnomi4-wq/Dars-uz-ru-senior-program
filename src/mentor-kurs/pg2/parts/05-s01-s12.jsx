
// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["CRUD PostgreSQL terminalida", 'WHERE va xavfsiz sinash', 'Sinfdagi SQL xatolari', "Express'dan bazaga", 'Buzamiz', "O'quvchi darslarini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — sizning serveringizda</div>
    <PostmanCard m="POST" url="localhost:3000/api/cars" body={'{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'} st={201} res={'{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}'} />
  </div>} />;
}

// ============================================================
//  2 · CRUD: to'rt amal — to'rt SQL buyruq — to'rt endpoint (F-1102-21, M39)
//  Haqiqiy: pg2-out/01 (INSERT 0 1, 4 rows) · 03 (UPDATE 1, DELETE 1) · 11-crud-sorovlar (POST 201 · GET/PUT/DELETE 200)
// ============================================================
const CRUD = [
  ['C', 'Create', 'yaratish', 'INSERT', 'INSERT 0 1', 'POST /api/cars', '201'],
  ['R', 'Read', "o'qish", 'SELECT', '(4 rows)', 'GET /api/cars', '200'],
  ['U', 'Update', "o'zgartirish", 'UPDATE', 'UPDATE 1', 'PUT /api/cars/2', '200'],
  ['D', 'Delete', "o'chirish", 'DELETE', 'DELETE 1', 'DELETE /api/cars/1', '200'],
];
const S2CRUD = mkS(2, [{ sql: false, ex: false }, { sql: true, ex: false }, { sql: true, ex: true }, { sql: true, ex: true, rule: true }]);
function ScreenCrud(p) {
  return <Lesson p={p} S={S2CRUD} scene={({ seg, beat }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: '6px 12px' }}>
      <table className="pg-crud"><thead><tr>
        <th>CRUD</th><th>ma'nosi</th>
        <th className="sql">PostgreSQL</th><th className="sql">baza javobi</th>
        <th className="ex">Express</th><th className="ex">status</th>
      </tr></thead><tbody>
        {CRUD.map(([l, en, uz, q, ans, ep, st]) => <tr key={l}>
          <td><span style={{ color: T.accent, fontSize: 20 }}>{l}</span><span style={{ fontWeight: 600, color: T.ink2 }}>{en.slice(1)}</span></td>
          <td>{uz}</td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{q}</code></td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{ans}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{ep}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{st}</code></td>
        </tr>)}
      </tbody></table>
    </div>
    <Block at={3} beat={beat}><div className="mk-rule">Bitta amal — bazada <b>bitta SQL buyruq</b>, serverda <b>bitta endpoint</b>. Bugun avval terminalda qo'lda, keyin Express ichida.</div></Block>
  </div>} />;
}

// ============================================================
//  3 · shop bazasi: jadval va INSERT
// ============================================================
const PRODUCTS0 = [['1', 'Klaviatura', '120000', '8'], ['2', 'Sichqoncha', '75000', '15'], ['3', 'Quloqchin', '95000', '5'], ['4', 'Mishka', '50000', '10']];
const PCOLS = ['id', 'name', 'price', 'stock'];
const T2 = psql(String.raw`
shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
CREATE TABLE
shop=# INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);
INSERT 0 3
shop=# INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);
INSERT 0 1
shop=# SELECT * FROM products;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     8
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Mishka     |  50000 |    10
(4 rows)`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 6, { at: 1 }), rng(7, 14, { at: 2 }), { 1: { id: 'ddl' }, 4: { id: 'n' }, 6: { id: 'n' }, 7: { id: 'sel' } }));
const S2 = mkS(3, [{ focus: ['ddl'] }, { focus: ['n'] }, { focus: ['sel'] }, { focus: ['ddl'] }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={T2} beat={beat} focus={seg.focus} />
    <div className="pg-two">
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">O'quvchi darsida — jadval «chizmasi»</div><div style={{ fontSize: 13.5, lineHeight: 1.6 }}><code>id</code> SERIAL PRIMARY KEY · <code>name</code> TEXT · <code>price</code> INTEGER · <code>stock</code> INTEGER</div></div>
      <Block at={3} beat={beat}><div className="n2-warn" style={{ fontSize: 14 }}>Bu jadvalda <b>NOT NULL yo'q</b> — 12-ekranda nima bo'lishini ko'ramiz.</div></Block>
    </div>
  </>} />;
}

// ============================================================
//  4 · SELECT va WHERE
// ============================================================
const T3a = psql(String.raw`
shop=# SELECT name, price FROM products;
    name    | price
------------+--------
 Klaviatura | 120000
 Sichqoncha |  75000
 Quloqchin  |  95000
 Mishka     |  50000
(4 rows)`);
const T3b = psql(String.raw`
shop=# SELECT * FROM products WHERE price < 100000;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  3 | Quloqchin  | 95000 |     5
  4 | Mishka     | 50000 |    10
(3 rows)`, { 1: { id: 'w' } });
const T3c = psql(String.raw`
shop=# SELECT * FROM products WHERE stock < 6;
 id |   name    | price | stock
----+-----------+-------+-------
  3 | Quloqchin | 95000 |     5
(1 row)`, { 1: { id: 'w' } });
const S3 = mkS(4, [{ v: 'a', rows: [] }, { v: 'b', rows: [1, 2, 3] }, { v: 'c', rows: [2] }, { v: 'c', rows: [] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <MiniTable name="products" cols={PCOLS} rows={PRODUCTS0} hlRow={seg.rows} dimRow={seg.rows.length ? [0, 1, 2, 3].filter((i) => !seg.rows.includes(i)) : []} hlCol={seg.v === 'b' ? [2] : seg.v === 'c' && beat === 2 ? [3] : []} />
    {seg.v === 'a' && <Psql title="psql — shop" lines={T3a} />}
    {seg.v === 'b' && <Psql title="psql — shop" lines={T3b} focus={['w']} />}
    {seg.v === 'c' && <Psql title="psql — shop" lines={T3c} focus={beat === 2 ? ['w'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule"><b>SELECT</b> faqat o'qiydi · <b>WHERE</b> qatorlarni tanlaydi — UPDATE va DELETE'da ham aynan shu WHERE ishlaydi</div></Block>
  </>} />;
}

// ============================================================
//  5 · UPDATE va DELETE
// ============================================================
const T4 = psql(String.raw`
shop=# UPDATE products SET price = 99000 WHERE id = 1;
UPDATE 1
shop=# DELETE FROM products WHERE id = 3;
DELETE 1
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8
(3 rows)
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# DELETE FROM products WHERE id = 99;
DELETE 0`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 4, { at: 1 }), rng(5, 11, { at: 2 }), rng(12, 15, { at: 3 }), { 2: { id: 'u' }, 4: { id: 'd' }, 10: { id: 'kl' }, 13: { id: 'z' }, 15: { id: 'z' } }));
const S4 = mkS(5, [{ focus: ['u'] }, { focus: ['d'] }, { focus: ['kl'] }, { focus: ['z'] }, { focus: ['u', 'd', 'z'] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={T4} beat={beat} focus={seg.focus} />
    <Block at={2} beat={beat}><div className="mk-tag" style={{ margin: 0, color: T.accent }}>Klaviatura oxirida — ORDER BY yozilmagan, tartib kafolatlanmaydi · kerak bo'lsa: SELECT * FROM products ORDER BY id;</div></Block>
    <Block at={4} beat={beat}><div className="mk-rule">Javobdagi son: <b>1</b> — kutganingiz · <b>0</b> — WHERE hech narsaga mos kelmadi · <b>kutilmagan katta son</b> — WHERE noto'g'ri yoki yo'q</div></Block>
  </>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — UPDATE 0
// ============================================================
function Screen5(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Avval tekshirish — bunday id bormi</div>
      <Psql title="psql — shop" lines={psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# SELECT * FROM products;
 id |    name    | price | stock
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8
(3 rows)`)} />
      <div className="mk-rule">Jadvalda id <b>99</b> yo'q — <code>UPDATE 0</code>. Xato emas: baza hech bir qatorga tegmadi.</div>
    </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — do'konni o'zingiz boshqaring
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Baza va jadval', cmds: ['psql -U postgres', 'CREATE DATABASE shop;', '\\c shop', 'CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);'], exp: 'CREATE DATABASE · CREATE TABLE' },
  { t: 'Mahsulotlar', cmds: ["INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);", "INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);"], exp: 'INSERT 0 3 · INSERT 0 1' },
  { t: 'Filtrlar', cmds: ['SELECT * FROM products WHERE price < 100000;', 'SELECT * FROM products WHERE stock < 6;'], exp: '3 qator · 1 qator (Quloqchin)' },
  { t: "Narx va o'chirish", cmds: ['UPDATE products SET price = 99000 WHERE id = 1;', 'DELETE FROM products WHERE id = 3;', 'SELECT * FROM products;'], exp: 'UPDATE 1 · DELETE 1 · (… rows)' },
];
const P1_TROUBLE = [
  ['ERROR:  database "shop" already exists', 'baza oldin yaratilgan — \\c shop'],
  ['ERROR:  relation "products" does not exist', 'boshqa bazadasiz (prompt postgres=#) — \\c shop'],
  ['INSERT 0 3 ikki marta', "mahsulotlar ikki marta qo'shilgan — id lar 1–8; 4-qadamda id ni SELECT bo'yicha tanlang"],
  ['UPDATE 0 / DELETE 0', "bunday id yo'q — avval SELECT * bilan id ni ko'ring"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan"],
];
const P1_PROOF = { label: 'Isbot: oxirgi SELECT * natijasidagi qatorlar soni', placeholder: 'natija ostidagi sonni yozing', check: (v) => /^\s*\(?\s*3\b/.test(v), wrong: "4 ta mahsulotdan bittasi (Quloqchin) o'chirilgach nechta qoladi? Natija ostidagi qavsdagi sonni yozing" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  8 · WHERE'siz — hamma qator (pg2-out/04, bitta seans)
// ============================================================
const T7 = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 99000;
UPDATE 3
shop=*# SELECT * FROM products;
  2 | Sichqoncha | 99000 |    15
  4 | Mishka     | 99000 |    10
  1 | Klaviatura | 99000 |     8
shop=*# DELETE FROM products;
DELETE 3
shop=*# SELECT * FROM products;
(0 rows)
shop=*# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM products;
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 8, { at: 1 }), rng(9, 12, { at: 2 }), rng(13, 18, { at: 3 }), { 1: { id: 'b' }, 4: { id: 'u' }, 10: { id: 'd' }, 12: { id: 'd' }, 14: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'r' }, 18: { id: 'r' } }));
const S7 = mkS(8, [{ focus: ['b'], st: 'ok' }, { focus: ['u'], st: 'up' }, { focus: ['d'], st: 'del' }, { focus: ['r'], st: 'ok' }, { focus: [], st: 'ok' }]);
const ROWS7 = { ok: [['2', 'Sichqoncha', '75000', '15'], ['4', 'Mishka', '50000', '10'], ['1', 'Klaviatura', '99000', '8']], up: [['2', 'Sichqoncha', '99000', '15'], ['4', 'Mishka', '99000', '10'], ['1', 'Klaviatura', '99000', '8']], del: [] };
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => <div className="pg-two">
    <Psql title="psql — shop" lines={T7} beat={beat} focus={seg.focus} />
    <div style={{ display: 'grid', gap: 10 }}>
      <MiniTable name={seg.st === 'ok' ? 'products' : 'products · tranzaksiya ichida'} cols={PCOLS} rows={ROWS7[seg.st]} hlCol={seg.st === 'up' ? [2] : []} color={seg.st === 'ok' ? PG.pg : T.accent} />
      {seg.st === 'del' && <div className="n2-warn"><b>(0 rows)</b> — butun katalog yo'q. Tranzaksiya hali ochiq.</div>}
      <Block at={4} beat={beat}><div className="mk-rule">Xavfli UPDATE/DELETE — avval <code>BEGIN</code> ichida · <code>SELECT</code> bilan ko'ring · to'g'ri bo'lsa <code>COMMIT</code>, noto'g'ri bo'lsa <code>ROLLBACK</code></div></Block>
    </div>
  </div>} />;
}

// ============================================================
//  9 · Tekshiruv 2 — ROLLBACK dan keyin
// ============================================================
function Screen8(p) {
  const m = MDT[9];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Psql title="psql — shop" lines={T7.slice(12)} />
    </div>} />;
}

// ============================================================
//  10 · Amaliyot 2 — BEGIN … ROLLBACK
// ============================================================
const P2 = mkS(10, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Tranzaksiya', cmds: ['BEGIN;'], exp: 'BEGIN · prompt shop=*#' },
  { t: "WHERE'siz", cmds: ['UPDATE products SET price = 1;', 'SELECT * FROM products;'], exp: 'UPDATE 3 · hamma narx 1' },
  { t: 'Bekor', cmds: ['ROLLBACK;'], exp: 'ROLLBACK · prompt shop=#' },
  { t: 'Tekshirish', cmds: ['SELECT * FROM products;'], exp: 'narxlar eski' },
];
const P2_TROUBLE = [
  ['WARNING:  there is no transaction in progress (ROLLBACK da)', "BEGIN yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi UPDATE lar bilan tiklang"],
  ['narx 120000', "1-amaliyotning 4-qadami (99 000) bajarilmagan — 1-amaliyotni tugating"],
  ['prompt shop=!#', 'tranzaksiya ichida xato bo\'ldi — ROLLBACK; yozing'],
];
const P2_PROOF = { label: "Isbot: ROLLBACK dan keyingi Klaviatura narxi", placeholder: 'klaviatura narxini yozing', check: (v) => /^\s*99\s?000\s*$/.test(v), wrong: "ROLLBACK dan keyin narx 1-amaliyotdagidek bo'ladi — SELECT natijasidan Klaviatura qatorini o'qing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  11 · Sinfdagi SQL xatolari
// ============================================================
const E10 = [
  psql(String.raw`
shop=# SELECT * FROM product WHERE price < 100000;
ERROR:  relation "product" does not exist
LINE 1: SELECT * FROM product WHERE price < 100000;
                      ^`),
  psql(String.raw`
shop=# SELECT * FROM products WHERE narx < 100000;
ERROR:  column "narx" does not exist
LINE 1: SELECT * FROM products WHERE narx < 100000;
                                     ^
HINT:  Perhaps you meant to reference the column "products.name".`, { 5: { id: 'h' } }),
  psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet', 'arzon', 3);
ERROR:  invalid input syntax for type integer: "arzon"
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet', 300000);
ERROR:  INSERT has more target columns than expressions`),
  psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);
ERROR:  syntax error at or near "yinchoq"
LINE 1: ...ERT INTO products (name, price, stock) VALUES ('O'yinchoq', ...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
 id |   name    | price | stock
----+-----------+-------+-------
  6 | O'yinchoq | 30000 |     4
(1 row)`, { 5: { neu: true, id: 'f' }, 9: { id: 'f' } }),
];
const D10 = psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable
--------+---------+----------
 id     | integer | not null
 name   | text    |
 price  | integer |
 stock  | integer |`);
const S10 = mkS(11, [{ e: 0 }, { e: 1, focus: ['h'] }, { e: 2 }, { e: 3, focus: ['f'] }, { e: 9 }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.e <= 3 && <Psql title="psql — shop" er={seg.e !== 3} lines={E10[seg.e]} focus={seg.focus || []} />}
    {seg.e === 1 && <div className="n2-warn">HINT <b>taxmin</b> qiladi: <code>name</code> ni taklif qildi, kerakli ustun esa <code>price</code>. Ishonchli manba — <code>\d products</code>.</div>}
    {seg.e === 9 && <><div className="mk-tag" style={{ margin: 0 }}>Haqiqiy jadval tuzilishi (o'quvchi darsidagi DDL)</div><Psql title="psql — shop" lines={D10} /><div className="mk-rule">Xabardagi nomni <code>\d products</code> bilan solishtiring · so'z ichidagi apostrof — <b>ikki marta</b>: <code>'O''yinchoq'</code></div></>}
  </>} />;
}

// ============================================================
//  12 · NOT NULL yo'q — nomsiz mahsulot
// ============================================================
const T11 = psql(String.raw`
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
INSERT 0 1
shop=# SELECT * FROM products WHERE name IS NULL;
 id | name | price | stock
----+------+-------+-------
  5 |      | 30000 |     4
(1 row)`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 7, { at: 1 }), { 2: { id: 'i' }, 6: { id: 'n' } }));
const PG1_USERS = psql(String.raw`
blog=# INSERT INTO users (username) VALUES (NULL);
ERROR:  null value in column "username" of relation "users" violates not-null constraint`);
const S11 = mkS(12, [{ focus: ['i'] }, { focus: ['n'] }, { focus: [] }, { focus: [] }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <div><div className="pg-lab">PostgreSQL-1 · users — NOT NULL bor</div><Psql title="psql — blog" er lines={PG1_USERS} /></div>
      <div><div className="pg-lab">Bugun · products — NOT NULL yo'q <span className="tm">xato yo'q</span></div><Psql title="psql — shop" lines={T11} beat={beat} focus={seg.focus} /></div>
    </div>
    <Block at={2} beat={beat}><div className="pg-cmp">
      <div className="mk-card"><h5>blog · users</h5><code>username TEXT NOT NULL UNIQUE</code></div>
      <div className="mk-card" style={{ borderColor: T.accent }}><h5>shop · products</h5><code>name TEXT</code> — qoida yo'q</div>
    </div></Block>
    <Block at={3} beat={beat}><div className="mk-rule">Baza faqat <b>yozilgan</b> qoidani qo'riqlaydi. O'quvchi o'z do'koni jadvalini yaratganda: <code>name TEXT NOT NULL</code>, <code>price INTEGER NOT NULL</code>.</div></Block>
  </>} />;
}

// ============================================================
//  13 · Tekshiruv 3 — apostrof
// ============================================================
function Screen12(p) {
  const m = MDT[13];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — haqiqiy natija</div>
      <Psql title="psql — shop" lines={E10[3].slice(4)} />
    </div>} />;
}
