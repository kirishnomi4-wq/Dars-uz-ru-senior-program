
// ============================================================
//  v2 yordamchilar: amaliyot MD'dan (mkPractice), tekshiruv (MC) qolipi — M42: above/after/demak
// ============================================================
const mkPractice = (n, hls, extra = {}) => {
  const m = MDT[n]; const pr = m.proof;
  return {
    S: mkS(n, hls.map((hl) => ({ hl })), { tableAt: 3 }), steps: m.steps, trouble: m.trouble,
    proof: { label: pr.label, placeholder: pr.placeholder, check: (v) => new RegExp(pr.re, pr.flags).test(v), wrong: pr.wrong }, ...extra,
  };
};
// Qadam-baqadam terminal: faqat shu qadamgacha kelgan qatorlar (yashirin qatorlar bo'sh qora joy egallamasin — F-1103-08 sinfi)
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);
const Demak = (n) => <span dangerouslySetInnerHTML={html(MDT[n].demak)} />;
function MC(p, n, more) {
  const m = MDT[n];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong} demak={Demak(n)} {...more} />;
}
const PCOLS = ['id', 'name', 'price', 'stock'];

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['CRUD terminalida', 'Tranzaksiya: xavfsiz sinash va atomik ish', "Baza qo'riqlaydi", "Express'dan bazaga", 'Buzamiz va tuzatamiz', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — so'rov bazagacha va qaytib (CrudMachine, 04b-mashina.jsx); reja pastda
const S1M = [
  { path: 'both', back: 'rows[0] → res.status(201).json', st: 201, newRow: 3, ro: ['server.js:36', "<span class=\"n1-s\">'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *'</span>,"] },
  { path: 'psql', on: ['psql', 'shop'], ro: ['psql · shop', 'UPDATE products SET price = 99000 WHERE id = 1; <span class="n1-ok">→ UPDATE 1</span>'] },
  { path: 'api', on: ['pm', 'json', 'route', 'pool', 'cars'], back: 'rows[0] → res.status(201).json', st: 201, newRow: 3, ro: ['server.js:36', "<span class=\"n1-s\">'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *'</span>,"] },
  { path: 'both', back: 'rows[0] → res.status(201).json', st: 201, newRow: 3 },
];
const CARS1 = [...CARS0, ['4', 'Chevrolet Spark', '190000']];
const PRODS1 = [['1', 'Klaviatura', '99000'], ['2', 'Sichqoncha', '75000']];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <CrudMachine {...m} cars={CARS1} prods={PRODS1} res='{"id":4,"model":"Chevrolet Spark",…}' req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }}
      tag={t("Bugungi darsning rasmi — bitta baza, ikki yo'l: terminal va Express", 'Картина урока — одна база, два пути: терминал и Express')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · CRUD: to'rt amal — to'rt buyruq — to'rt endpoint (M39, galma-gal; M45: siz bilgan Mongoose ustuni)
//  Haqiqiy: v2b-01 (INSERT 0 4 · 4 rows · UPDATE 1 · DELETE 1) · v2d-mongoose (matchedCount 1 · deletedCount 1) · 11-crud-sorovlar (201/200)
// ============================================================
const CRUD = [
  ['C', 'Create', 'yaratish', 'INSERT', 'INSERT 0 4', 'Product.create(…)', 'POST /api/cars', '201'],
  ['R', 'Read', "o'qish", 'SELECT', '(4 rows)', 'Product.find(…)', 'GET /api/cars', '200'],
  ['U', 'Update', "o'zgartirish", 'UPDATE', 'UPDATE 1', 'Product.updateOne(…) → matchedCount: 1', 'PUT /api/cars/2', '200'],
  ['D', 'Delete', "o'chirish", 'DELETE', 'DELETE 1', 'Product.deleteOne(…) → deletedCount: 1', 'DELETE /api/cars/1', '200'],
];
const S2 = mkS(2, [{ sql: false, mg: false, ex: false }, { sql: true, mg: true, ex: false }, { sql: true, mg: true, ex: true }, { sql: true, mg: true, ex: true, rule: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: '6px 12px' }}>
      <table className="pg-crud"><thead><tr>
        <th>CRUD</th><th>{t("ma'nosi", "смысл")}</th>
        <th className="sql">PostgreSQL</th><th className="sql">{t("baza javobi", "ответ базы")}</th>
        <th className="mg">{t("siz bilgan Mongoose", "знакомый вам Mongoose")}</th>
        <th className="ex">Express</th><th className="ex">status</th>
      </tr></thead><tbody>
        {CRUD.map(([l, en, uz, q, ans, mg, ep, st]) => <tr key={l}>
          <td><span style={{ color: T.accent, fontSize: 20 }}>{l}</span><span style={{ fontWeight: 600, color: T.ink2 }}>{en.slice(1)}</span></td>
          <td>{uz}</td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{q}</code></td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{ans}</code></td>
          <td className={`mg${seg.mg ? '' : ' off'}`} style={{ opacity: seg.mg ? 0.8 : 1 }}><code>{mg}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{ep}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{st}</code></td>
        </tr>)}
      </tbody></table>
    </div>
    <Block at={3} beat={beat}><div className="mk-rule">{t("Bitta amal — bazada ", "Одно действие — в базе ")}<b>{t("bitta SQL buyruq", "одна SQL-команда")}</b>{t(", serverda ", ", на сервере ")}<b>{t("bitta endpoint", "один endpoint")}</b>{t(". Avval terminalda qo'lda va ichini ko'ramiz, keyin Express ichida.", ". Сначала вручную в терминале и смотрим внутрь, потом внутри Express.")}</div></Block>
  </div>} />;
}

// ============================================================
//  3 · shop bazasi: CREATE DATABASE → \c → jadval → INSERT (v2c-baza, v2b-01; Mongoose — v2d)
// ============================================================
const T3 = psql(String.raw`
postgres=# CREATE DATABASE shop;
CREATE DATABASE
postgres=# \c shop
You are now connected to database "shop" as user "postgres".
shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
CREATE TABLE
shop=# INSERT INTO products (name, price, stock) VALUES
shop-#   ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15),
shop-#   ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
INSERT 0 4
shop=# SELECT * FROM products;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     8
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Kolonka    |  50000 |    10
(4 rows)`, mergeMeta(rng(1, 6, { at: 0 }), rng(7, 10, { at: 1 }), rng(11, 18, { at: 2 }), { 1: { id: 'db' }, 3: { id: 'db' }, 5: { id: 'ddl' }, 10: { id: 'n' }, 11: { id: 'sel' } }));
const MG3 = `await mongoose.connect('mongodb://localhost/shop')
bazalar: admin · config · local          (shop hali yo'q)
await Product.create([ …4 ta… ])         → 4 ta hujjat
bazalar: admin · config · local · shop`;
const S3 = mkS(3, [{ focus: ['db', 'ddl'], v: 'mg' }, { focus: ['n'], v: 'pair' }, { focus: ['sel'], v: 'sel' }, { focus: ['ddl'], v: 'warn' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <Psql title="psql" lines={seg.v === 'warn' ? T3.filter((l) => l.at === 1) : upto(T3, beat)} beat={beat} focus={seg.focus} />
    <div className="pg-two">
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("products — ustun va turi", "products — колонки и тип")}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.7 }}><code>id</code>{t(" SERIAL PRIMARY KEY — o'zi o'sadi · ", " SERIAL PRIMARY KEY — растёт сам · ")}<code>name</code> TEXT · <code>price</code> INTEGER · <code>stock</code> INTEGER<div style={{ color: T.ink3, fontSize: 12.5 }}>{t("hozircha hech qanday qoida yo'q — ataylab", "пока никаких правил — нарочно")}</div></div></div>
      <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        {seg.v === 'mg' && <pre className="pg-mg">{t(<><b>Mongoose'da</b> (siz bilgan):</>, <><b>В Mongoose</b> (знакомое вам):</>)}{'\n'}{t(MG3, RS('MG3'))}</pre>}
        {seg.v === 'pair' && <Pair code="await Product.create([ …4 ta… ])" res={t("4 ta hujjat", "4 документа")} />}
        {seg.v === 'warn' && <div className="n2-warn">{t("Bu jadvalda hozircha ", "В этой таблице пока ")}<b>{t("NOT NULL ham, boshqa qoida ham yo'q", "нет ни NOT NULL, ни другого правила")}</b>{t(" — baza faqat yozilgan qoidani qo'riqlaydi. 3-bosqichda ko'rasiz.", " — база охраняет только записанное правило. Увидите на 3-м этапе.")}</div>}
      </div>
    </div>
  </>} />;
}

// ============================================================
//  4 · SELECT va WHERE (v2b-01)
// ============================================================
const PRODUCTS0 = [['1', 'Klaviatura', '120000', '8'], ['2', 'Sichqoncha', '75000', '15'], ['3', 'Quloqchin', '95000', '5'], ['4', 'Kolonka', '50000', '10']];
const T4a = psql(String.raw`
shop=# SELECT name, price FROM products;
    name    | price
------------+--------
 Klaviatura | 120000
 Sichqoncha |  75000
 Quloqchin  |  95000
 Kolonka    |  50000
(4 rows)`);
const T4b = psql(String.raw`
shop=# SELECT * FROM products WHERE price < 100000;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  3 | Quloqchin  | 95000 |     5
  4 | Kolonka    | 50000 |    10
(3 rows)`, { 1: { id: 'w' } });
const T4c = psql(String.raw`
shop=# SELECT * FROM products WHERE stock < 6;
 id |   name    | price | stock
----+-----------+-------+-------
  3 | Quloqchin | 95000 |     5
(1 row)`, { 1: { id: 'w' } });
const S4 = mkS(4, [{ v: 'a', rows: [] }, { v: 'b', rows: [1, 2, 3] }, { v: 'c', rows: [2] }, { v: 'c', rows: [] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => <>
    <MiniTable name="products" cols={PCOLS} rows={PRODUCTS0} hlRow={seg.rows} dimRow={seg.rows.length ? [0, 1, 2, 3].filter((i) => !seg.rows.includes(i)) : []} hlCol={seg.v === 'b' ? [2] : seg.v === 'c' && beat === 2 ? [3] : []} />
    {seg.v === 'a' && <Psql title="psql — shop" lines={T4a} />}
    {seg.v === 'b' && <><Psql title="psql — shop" lines={T4b} focus={['w']} /><Pair code="await Product.find({ price: { $lt: 100000 } })" res={t("3 ta hujjat", "3 документа")} /></>}
    {seg.v === 'c' && <Psql title="psql — shop" lines={T4c} focus={beat === 2 ? ['w'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule"><b>SELECT</b>{t(" faqat o'qiydi · ", " только читает · ")}<b>WHERE</b>{t(" qatorlarni tanlaydi — UPDATE va DELETE'da ham aynan shu WHERE ishlaydi", " выбирает строки — в UPDATE и DELETE работает тот же WHERE")}</div></Block>
  </>} />;
}

// ============================================================
//  5 · UPDATE, DELETE va javobdagi son; RETURNING (v2b-01, uzluksiz holat)
// ============================================================
const T5 = psql(String.raw`
shop=# UPDATE products SET price = 99000 WHERE id = 1;
UPDATE 1
shop=# DELETE FROM products WHERE id = 3;
DELETE 1
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# DELETE FROM products WHERE id = 99;
DELETE 0
shop=# UPDATE products SET stock = stock - 1 WHERE id = 1 RETURNING id, name, stock;
 id |    name    | stock
----+------------+-------
  1 | Klaviatura |     7
(1 row)
UPDATE 1`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 4, { at: 1 }), rng(5, 8, { at: 2 }), rng(9, 14, { at: 3 }), { 2: { id: 'u' }, 4: { id: 'd' }, 6: { id: 'z' }, 8: { id: 'z' }, 9: { id: 'r' }, 12: { id: 'r' } }));
const S5 = mkS(5, [{ focus: ['u'] }, { focus: ['d'] }, { focus: ['z'] }, { focus: ['r'] }, { focus: ['u', 'd', 'z'] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={upto(T5, beat)} beat={beat} focus={seg.focus} />
    <div style={{ display: 'grid', gap: 6 }}>
      <Block at={0} beat={beat}><Pair code="await Product.updateOne({ _id: 1 }, { price: 99000 })" res="matchedCount: 1, modifiedCount: 1" /></Block>
      <Block at={1} beat={beat}><Pair code="await Product.deleteOne({ _id: 3 })" res="deletedCount: 1" /></Block>
      <Block at={2} beat={beat}><Pair code="await Product.updateOne({ _id: 99 }, { price: 1 })" res="matchedCount: 0" /></Block>
    </div>
    <Block at={4} beat={beat}><div className="mk-rule">{t("Javobdagi son: ", "Число в ответе: ")}<b>1</b>{t(" — kutganingiz · ", " — ожидаемое · ")}<b>0</b>{t(" — WHERE hech narsaga mos kelmadi (xato emas) · ", " — WHERE ни к чему не подошёл (не ошибка) · ")}<b>{t("kutilmagan katta son", "неожиданно большое число")}</b>{t(" — WHERE noto'g'ri yoki yo'q", " — WHERE неверный или его нет")}</div></Block>
  </>} />;
}

// ============================================================
//  6 · Nega Klaviatura oxiriga tushdi — qator tartibi, ctid, ORDER BY (v2b-01: ikki UPDATE → ikki yangi nusxa → (0,6))
// ============================================================
const T6 = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7
(3 rows)
shop=# SELECT ctid, id, name, price FROM products;
 ctid  | id |    name    | price
-------+----+------------+-------
 (0,2) |  2 | Sichqoncha | 75000
 (0,4) |  4 | Kolonka    | 50000
 (0,6) |  1 | Klaviatura | 99000
(3 rows)
shop=# SELECT * FROM products ORDER BY id;
 id |    name    | price | stock
----+------------+-------+-------
  1 | Klaviatura | 99000 |     7
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
(3 rows)`, mergeMeta(rng(1, 7, { at: 0 }), rng(8, 14, { at: 2 }), rng(15, 21, { at: 3 }), { 6: { id: 'kl' }, 13: { id: 'ct' }, 15: { id: 'ob' }, 18: { id: 'ob' } }));
// Fayl sahifasi 0 — qatorlarning joyi (ctid): eski nusxalar chizilgan, o'chirilgan joy bo'sh, hozirgisi ko'k
const PAGE6 = [['1', 'Klaviatura · 120000 · 8 — birinchi nusxa', 'old'], ['2', 'Sichqoncha · 75000 · 15', ''], ['3', "Quloqchin — o'chirilgan (5-ekran)", 'gone'], ['4', 'Kolonka · 50000 · 10', ''], ['5', 'Klaviatura · 99000 · 8 — narx o\'zgarganda yozilgan nusxa', 'old'], ['6', 'Klaviatura · 99000 · 7 — hozirgi qator', 'now']];
function FilePage({ hl = [] }) {
  return <div className="pg-page"><div className="pg-lab">{t("Fayl sahifasi 0 — har qatorning joyi (ctid)", "Страница файла 0 — место каждой строки (ctid)")}</div>
    <div className="slots">{PAGE6.map(([n, txt, k]) => <div key={n} className={`slot ${k}${hl.includes(n) ? ' hl' : ''}`}><b>(0,{n})</b><span>{txt}</span></div>)}</div></div>;
}
const S6 = mkS(6, [{ focus: ['kl'], page: null }, { focus: ['kl'], page: ['1', '5', '6'] }, { focus: ['ct'], page: ['6'] }, { focus: ['ob'], page: null, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={cur(T6, beat)} beat={beat} focus={seg.focus} />
    {seg.page && <FilePage hl={seg.page} />}
    {seg.sum && <div className="mk-rule"><code>ORDER BY</code>{t(" yozilmasa — baza qatorlarni ", " не написан — база отдаёт строки ")}<b>{t("fayldagi tartibda", "в порядке файла")}</b>{t(" beradi, har UPDATE yangi nusxa yozadi (", " , каждый UPDATE пишет новую копию (")}<code>ctid</code>{t("). Tartib kerak bo'lsa — ", "). Если нужен порядок — ")}<code>ORDER BY id</code>.</div>}
  </>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — UPDATE 0 (M42: material savoldan oldin, isbot keyin, Demak)
// ============================================================
const T7_ABOVE = psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0`);
const T7_AFTER = psql(String.raw`
shop=# SELECT * FROM products WHERE id = 99;
 id | name | price | stock
----+------+-------+-------
(0 rows)`);
function Screen7(p) { return MC(p, 7, { above: <Psql title="psql — shop" lines={T7_ABOVE} />, after: <Psql title={t("psql — shop · tekshirib ko'rdik", "psql — shop · проверили")} lines={T7_AFTER} /> }); }

// ============================================================
//  8 · Amaliyot 1 — do'konni o'zingiz boshqaring (qadamlar, isbot, jadval — MD'dan)
// ============================================================
const P8 = mkPractice(8, [[], [0, 1, 2], [3], []]);
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} />; }

// ============================================================
//  9 · WHERE'siz — hamma qator; BEGIN … ROLLBACK (v2b-02) · Mongo'dan kelganlar tuzog'i (v2d)
// ============================================================
const T9 = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 99000;
UPDATE 3
shop=*# SELECT * FROM products;
  2 | Sichqoncha | 99000 |    15
  4 | Kolonka    | 99000 |    10
  1 | Klaviatura | 99000 |     7
shop=*# DELETE FROM products;
DELETE 3
shop=*# SELECT * FROM products;
(0 rows)
shop=*# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM products;
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 8, { at: 1 }), rng(9, 12, { at: 2 }), rng(13, 18, { at: 3 }), { 1: { id: 'b' }, 4: { id: 'u' }, 10: { id: 'd' }, 12: { id: 'd' }, 14: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'r' }, 18: { id: 'r' } }));
const ROWS9 = { ok: [['2', 'Sichqoncha', '75000', '15'], ['4', 'Kolonka', '50000', '10'], ['1', 'Klaviatura', '99000', '7']], up: [['2', 'Sichqoncha', '99000', '15'], ['4', 'Kolonka', '99000', '10'], ['1', 'Klaviatura', '99000', '7']], del: [] };
const S9 = mkS(9, [{ focus: ['b'], st: 'ok' }, { focus: ['u'], st: 'up' }, { focus: ['d'], st: 'del' }, { focus: ['r'], st: 'ok' }, { focus: [], st: 'ok' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={cur(T9, beat)} beat={beat} focus={seg.focus} />
    <div className="pg-two">
      <MiniTable name={seg.st === 'ok' ? 'products' : t('products · tranzaksiya ichida', "products · внутри транзакции")} cols={PCOLS} rows={ROWS9[seg.st]} hlCol={seg.st === 'up' ? [2] : []} color={seg.st === 'ok' ? PG.pg : T.accent} />
      <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        {seg.st === 'del' && <div className="n2-warn"><b>(0 rows)</b>{t(" — butun katalog yo'q. Tranzaksiya hali ochiq.", " — всего каталога нет. Транзакция ещё открыта.")}</div>}
        <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Mongo'dan kelganlar aynan shu yerda xato qiladi", "Пришедшие из Mongo ошибаются именно здесь")}</h5>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>await Product.updateOne({'{}'}, {'{ price: 99000 }'})</code> → <b>matchedCount: 1</b>{t(" — shartsiz ham ", " — даже без условия ")}<b>{t("bitta", "один")}</b>{t(" hujjat; hammasi uchun alohida ", " документ; для всех — отдельно ")}<code>updateMany({'{}'}, …)</code> → matchedCount: 3</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6 }}><b style={{ color: PG.pg }}>{t("PostgreSQL'da:", "В PostgreSQL:")}</b> {t(<><code>WHERE</code>'siz <code>UPDATE</code> — <b>hammasi</b></>, <><code>UPDATE</code> без <code>WHERE</code> — <b>все строки</b></>)}{t(". Alohida «many» yo'q.", ". Отдельного «many» нет.")}</div></div></Block>
        <Block at={4} beat={beat}><div className="mk-rule">{t(<>Xavfli UPDATE/DELETE — avval <code>BEGIN</code> ichida · <code>SELECT</code> bilan ko'ring · to'g'ri bo'lsa <code>COMMIT</code>, noto'g'ri bo'lsa <code>ROLLBACK</code></>, <>Опасный UPDATE/DELETE — сначала внутри <code>BEGIN</code> · проверьте через <code>SELECT</code> · если верно — <code>COMMIT</code>, если нет — <code>ROLLBACK</code></>)}</div></Block>
      </div>
    </div>
  </>} />;
}

// ============================================================
//  10 · Tranzaksiya ichida nima bo'ladi — IKKI HAQIQIY psql seansi (v2e-ikki-seans, GATE M 2C), uch holat
// ============================================================
const A10 = {
  a: psql(String.raw`
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000`),
  b: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 89000 WHERE id = 1;
UPDATE 1
shop=*# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 89000
shop=*# COMMIT;
COMMIT`, { 3: { id: 'u' }, 6: { id: 'u' } }),
  c: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# SELECT 1/0;
ERROR:  division by zero
shop=!# SELECT name FROM products WHERE id = 1;
ERROR:  current transaction is aborted, commands ignored until end of transaction block
shop=!# COMMIT;
ROLLBACK`, { 5: { id: 'x' }, 7: { id: 'x' }, 8: { id: 'x' } }),
};
const B10 = {
  a: psql(String.raw`
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000`),
  b: psql(String.raw`
-- A hali COMMIT qilmagan:
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000
-- A COMMIT qilgandan keyin:
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 89000`, { 3: { id: 'o' }, 6: { id: 'n' } }),
};
const STATES10 = [['shop=#', 'oddiy — har buyruq darhol saqlanadi (autocommit)'], ['shop=*#', "tranzaksiya ochiq — o'zgarish faqat shu seansda"], ['shop=!#', 'xato bo\'ldi (aborted) — faqat ROLLBACK']];
// F-1109-06: xulosa — uch alohida prompt kartasi o'rniga bitta holat sxemasi (BEGIN, xato, COMMIT, ROLLBACK strelka bilan)
function States10() {
  return <div className="z">
    <div className="p2-vs-card">
      <svg viewBox="0 0 780 300" role="img" aria-label="psql prompt: BEGIN, xato, COMMIT, ROLLBACK">
        <defs>
          <marker id="p2vsA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#374151" /></marker>
          <marker id="p2vsR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#E2451F" /></marker>
          <marker id="p2vsG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#15803D" /></marker>
        </defs>
        <rect x="20" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#15803D" strokeWidth="3" />
        <text x="120" y="58" textAnchor="middle" className="nd" fill="#86EFAC">shop=#</text>
        <text x="120" y="88" textAnchor="middle" className="in">{t("har buyruq darhol saqlanadi", "каждая команда сразу сохраняется")}</text>
        <rect x="290" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#336791" strokeWidth="3" />
        <text x="390" y="58" textAnchor="middle" className="nd" fill="#93C5FD">shop=*#</text>
        <text x="390" y="88" textAnchor="middle" className="in">{t("o'zgarish faqat shu seansda", "изменение только в этом сеансе")}</text>
        <rect x="560" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#E2451F" strokeWidth="3" />
        <text x="660" y="58" textAnchor="middle" className="nd" fill="#FCA5A5">shop=!#</text>
        <text x="660" y="88" textAnchor="middle" className="in">{t("xato — buyruqlar rad etiladi", "ошибка — команды отклоняются")}</text>
        <line x1="223" y1="64" x2="285" y2="64" stroke="#374151" strokeWidth="2.5" markerEnd="url(#p2vsA)" />
        <text x="254" y="52" textAnchor="middle" className="lb" fill="#374151">BEGIN</text>
        <line x1="493" y1="64" x2="555" y2="64" stroke="#E2451F" strokeWidth="2.5" markerEnd="url(#p2vsR)" />
        <text x="524" y="52" textAnchor="middle" className="lb" fill="#E2451F">{t("xato", "ошибка")}</text>
        <path d="M360 110 V160 H150 V114" fill="none" stroke="#15803D" strokeWidth="2.5" markerEnd="url(#p2vsG)" />
        <rect x="172" y="150" width="167" height="21" rx="4" fill="#fff" /><text x="255" y="165" textAnchor="middle" className="lb" fill="#15803D">{t("COMMIT · saqlanadi", "COMMIT · сохраняется")}</text>
        <path d="M420 110 V212 H110 V114" fill="none" stroke="#374151" strokeWidth="2.5" strokeDasharray="7 5" markerEnd="url(#p2vsA)" />
        <rect x="190" y="202" width="150" height="21" rx="4" fill="#fff" /><text x="265" y="217" textAnchor="middle" className="lb" fill="#374151">{t("ROLLBACK · bekor", "ROLLBACK · отмена")}</text>
        <path d="M660 110 V264 H70 V114" fill="none" stroke="#E2451F" strokeWidth="2.5" strokeDasharray="7 5" markerEnd="url(#p2vsR)" />
        <rect x="141" y="254" width="448" height="21" rx="4" fill="#fff" /><text x="365" y="269" textAnchor="middle" className="lb" fill="#E2451F">{t("faqat ROLLBACK · COMMIT yozsangiz ham bekor bo'ladi", "только ROLLBACK · даже COMMIT станет отменой")}</text>
      </svg>
    </div>
    <div className="z-rule"><code>!#</code>{t(" ko'rsangiz — ", " видите — ")}<b>{t("boshqa buyruq yozmang, ROLLBACK", "не пишите других команд, ROLLBACK")}</b></div>
  </div>;
}
const S10 = mkS(10, [{ v: 'a', st: [0] }, { v: 'b', st: [1] }, { v: 'c', st: [2] }, { v: 'sum', st: [0, 1, 2] }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v !== 'sum' && <div className="pg-two">
      <div><div className="pg-lab">{t("A oynasi", "Окно A")}</div><Psql title="psql — shop · A" lines={A10[seg.v]} focus={seg.v === 'b' ? ['u'] : seg.v === 'c' ? ['x'] : []} /></div>
      <div><div className="pg-lab">{t("B oynasi", "Окно B")}</div>{B10[seg.v] ? <Psql title="psql — shop · B" lines={B10[seg.v]} focus={seg.v === 'b' ? ['o', 'n'] : []} /> : <div className="mk-card" style={{ color: T.ink3, fontSize: 14 }}>{t("B oynasi bu holatda hech narsa yozmaydi — xato faqat A seansida.", "Окно B в этом состоянии ничего не пишет — ошибка только в сеансе A.")}</div>}</div>
    </div>}
    {seg.v !== 'sum' && <div className="pg-states">{STATES10.map(([pr, d], i) => <div key={pr} className={`mk-box${seg.st.includes(i) ? ' hl' : ''}`} style={{ '--c': [T.green, PG.pg, T.accent][i], opacity: seg.st.includes(i) ? 1 : 0.4 }}><h4><code>{pr}</code></h4><p>{d}</p></div>)}</div>}
    {seg.v === 'sum' && <States10 />}
  </>} />;
}

// ============================================================
//  11 · Ikki jadval, bitta ish: orders, CHECK, atomik (v2b-04)
// ============================================================
const T11 = {
  a: psql(String.raw`
shop=# ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
ALTER TABLE
shop=# CREATE TABLE orders (id SERIAL PRIMARY KEY,
shop(#   product_id INTEGER NOT NULL REFERENCES products(id),
shop(#   qty INTEGER NOT NULL CHECK (qty > 0),
shop(#   created_at TIMESTAMP DEFAULT now());
CREATE TABLE`, { 1: { id: 'c' }, 3: { id: 'o' }, 4: { id: 'o' }, 5: { id: 'o' }, 6: { id: 'o' } }),
  b: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET stock = stock - 1 WHERE id = 2 RETURNING name, stock;
 Sichqoncha |    14
shop=*# INSERT INTO orders (product_id, qty) VALUES (2, 1) RETURNING *;
  1 |          2 |   1 | 2026-11-03 14:32:57
shop=*# COMMIT;
COMMIT`, { 4: { id: 'r' }, 6: { id: 'r' } }),
  c: psql(String.raw`
shop=# BEGIN;
shop=*# INSERT INTO orders (product_id, qty) VALUES (4, 12) RETURNING id, product_id, qty;
  2 |          4 |  12
shop=*# UPDATE products SET stock = stock - 12 WHERE id = 4;
ERROR:  new row for relation "products" violates check constraint "stock_nonneg"
DETAIL:  Failing row contains (4, Kolonka, 50000, -2).
shop=!# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM orders;
  1 |          2 |   1 | 2026-11-03 14:32:57
(1 row)`, { 5: { id: 'x' }, 6: { id: 'x' }, 10: { id: 'k' } }),
};
const PROD11 = { a: [['1', 'Klaviatura', '7'], ['2', 'Sichqoncha', '15'], ['4', 'Kolonka', '10']], b: [['1', 'Klaviatura', '7'], ['2', 'Sichqoncha', '14'], ['4', 'Kolonka', '10']] };
const ORD11 = [['1', '2', '1', '14:32:57']];
const S11 = mkS(11, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'sum' }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    {seg.v !== 'sum' && <Psql title="psql — shop" lines={T11[seg.v]} focus={seg.v === 'a' ? ['c'] : seg.v === 'b' ? ['r'] : ['x', 'k']} />}
    <div className="pg-two">
      <MiniTable name="products" cols={['id', 'name', 'stock']} rows={PROD11[seg.v === 'a' ? 'a' : 'b']} hlRow={seg.v === 'b' ? [1] : seg.v === 'c' ? [2] : []} hlCol={[2]} />
      <MiniTable name="orders" cols={['id', 'product_id', 'qty', 'created_at']} rows={seg.v === 'a' ? [] : ORD11} hlRow={seg.v === 'b' ? [0] : []} color={T.green} />
    </div>
    {seg.v === 'c' && <div className="n2-warn">{t("2-buyurtma ", "2-й заказ ")}<b>{t("yozilmadi", "не записан")}</b>{t(", Kolonka qoldig'i ", ", остаток Kolonka ")}<b>10</b>{t(" da qoldi — tranzaksiya butunlay bekor bo'ldi. Yolg'on buyurtma qolmadi.", " осталось — транзакция полностью отменена. Ложного заказа не осталось.")}</div>}
    {seg.v === 'sum' && <div className="mk-rule">{t("Bir ishga tegishli buyruqlar — ", "Команды одного дела — ")}<b>{t("bitta tranzaksiyada", "в одной транзакции")}</b>{t(": yo hammasi, yo hech biri (atomik). Qoida bazada bo'lsa (", ": либо всё, либо ничего (атомарно). Если правило в базе (")}<code>CHECK</code>{t("), kod xato qilsa ham yarim ish qolmaydi.", "), даже если код ошибётся, полдела не останется.")}</div>}
  </>} />;
}

// ============================================================
//  12 · Tekshiruv 2 — ROLLBACK dan keyin
// ============================================================
const T12_ABOVE = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# DELETE FROM products;
DELETE 3
shop=*# ROLLBACK;
ROLLBACK
shop=#`);
const T12_AFTER = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7
(3 rows)`);
function Screen12(p) { return MC(p, 12, { above: <Psql title="psql — shop" lines={T12_ABOVE} />, after: <Psql title={t("psql — shop · haqiqiy natija", "psql — shop · настоящий результат")} lines={T12_AFTER} /> }); }

// ============================================================
//  13 · Amaliyot 2 — BEGIN … ROLLBACK
// ============================================================
const P13 = mkPractice(13, [[], [0, 1], [2, 3], []]);
function ScreenP13(p) { return <Practice p={p} S={P13.S} steps={P13.steps} trouble={P13.trouble} proof={P13.proof} />; }
