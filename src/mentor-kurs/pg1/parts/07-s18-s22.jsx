
// ============================================================
//  19 · Oxirgi telefon — ikki oyna yonma-yon (pg1-out/12: 2-xaridor 1 s da boshladi, 3,08 s da tugadi)
// ============================================================
const PROD18 = psql(String.raw`
blog=# CREATE TABLE products (
blog(#   id SERIAL PRIMARY KEY,
blog(#   nomi TEXT NOT NULL,
blog(#   stock INT NOT NULL CHECK (stock >= 0)
blog(# );
CREATE TABLE
blog=# INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);
INSERT 0 1`, { 4: { id: 'ck' } });
const X1_18 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# UPDATE products SET stock = stock - 1
blog-*#   WHERE id = 1 AND stock > 0 RETURNING stock;
 stock
-------
     0
(1 row)

UPDATE 1
blog=*# COMMIT;
COMMIT`, mergeMeta(rng(1, 10, { at: 2 }), rng(11, 12, { at: 3 }), { 11: { id: 'cm' }, 12: { id: 'cm' } }));
const X2_18 = psql(String.raw`
blog=# UPDATE products SET stock = stock - 1
blog-#   WHERE id = 1 AND stock > 0 RETURNING stock;
 stock
-------
(0 rows)

UPDATE 0`, mergeMeta(rng(1, 2, { at: 2 }), rng(3, 7, { at: 3 }), { 7: { id: 'z' } }));
const CHECK18 = psql(String.raw`
blog=# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
DETAIL:  Failing row contains (1, Telefon, -1).`);
const S18 = mkS(19, [{ v: 'intro' }, { v: 'tab' }, { v: 'two' }, { v: 'two' }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg, beat }) => <>
    <div className="pg-row"><span>products · id 1 · Telefon</span><span className={`v${beat >= 3 ? ' z' : ''}`}>stock {beat >= 3 ? 0 : 1}</span></div>
    {seg.v === 'intro' && <div className="pg-two">
      <div className="mk-card"><h5>{t('1-xaridor · Ali', 'Покупатель 1 · Ali')}</h5><div style={{ fontSize: 15 }}>{t('«Sotib olish» — 0 s', '«Купить» — 0 с')}</div></div>
      <div className="mk-card"><h5>{t('2-xaridor · Vali', 'Покупатель 2 · Vali')}</h5><div style={{ fontSize: 15 }}>{t('«Sotib olish» — 1 s', '«Купить» — 1 с')}</div></div>
    </div>}
    {seg.v === 'tab' && <Psql lines={PROD18} focus={['ck']} />}
    {seg.v === 'two' && <div className="pg-two">
      <div><div className="pg-lab">{t('1-oyna · 1-xaridor', 'Окно 1 · покупатель 1')} <span className="tm">{t('0 s', '0 с')}</span></div><Psql lines={X1_18} beat={beat >= 4 ? 3 : beat} focus={beat === 3 ? ['cm'] : []} /></div>
      <div><div className="pg-lab">{t('2-oyna · 2-xaridor', 'Окно 2 · покупатель 2')} <span className="tm">{t('1 s', '1 с')}</span></div><Psql lines={X2_18} beat={beat >= 4 ? 3 : beat} focus={beat === 3 ? ['z'] : []} />
        {beat === 2 && <div style={{ marginTop: 8 }}><span className="pg-wait">{t('⏳ kutyapti — qator 1-oynada band', '⏳ ждёт — строка занята в окне 1')}</span></div>}
        {beat >= 3 && <div className="mk-tag" style={{ marginTop: 8 }}>{t('3,08 s da tugadi — 1-oyna COMMIT qilguncha kutdi', 'завершилось через 3,08 с — ждало, пока окно 1 сделает COMMIT')}</div>}
      </div>
    </div>}
    {seg.v === 'sum' && <><Psql er lines={CHECK18} /><div className="mk-rule">{t(<>Telefonni <b>so'rovdagi shart</b> (<code>stock &gt; 0</code>) va <b>qator qulfi</b> saqladi. Shart yozilmasa — <code>CHECK</code> to'xtatadi.</>, <>Телефон сохранили <b>условие в запросе</b> (<code>stock &gt; 0</code>) и <b>блокировка строки</b>. Если условие не написано — остановит <code>CHECK</code>.</>)}</div></>}
  </>} />;
}

// ============================================================
//  20 · Hammasi yoki hech narsa
// ============================================================
const ORD19 = psql(String.raw`
blog=# CREATE TABLE orders (
blog(#   id SERIAL PRIMARY KEY,
blog(#   product_id INT NOT NULL REFERENCES products(id),
blog(#   xaridor TEXT NOT NULL
blog(# );
CREATE TABLE`);
const TX19 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
INSERT 0 1
blog=*# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
blog=!# COMMIT;
ROLLBACK
blog=# SELECT * FROM orders;
 id | product_id | xaridor
----+------------+---------
(0 rows)`, mergeMeta(rng(1, 6, { at: 1 }), rng(7, 12, { at: 2 }), { 3: { id: 'ins' }, 4: { id: 'ins' }, 6: { id: 'er' }, 8: { id: 'rb' }, 12: { id: 'rb' } }));
const S19 = mkS(20, [{ v: 'ddl' }, { v: 'tx', focus: ['ins', 'er'] }, { v: 'tx', focus: ['rb'] }, { v: 'mongo' }, { v: 'tx', focus: [], sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <MiniTable name="orders" cols={['id', 'product_id', 'xaridor']} rows={beat === 1 ? [['1', '1', t('vali  · tasdiqlanmagan', 'vali  · не подтверждено')]] : []} hlRow={beat === 1 ? [0] : []} />
      <MiniTable name="products" cols={['id', 'nomi', 'stock']} rows={[['1', 'Telefon', '0']]} hlCol={beat === 1 ? [2] : []} />
    </div>
    {seg.v === 'ddl' && <Psql lines={ORD19} />}
    {seg.v === 'tx' && <Psql lines={TX19} beat={seg.sum ? 2 : beat} focus={seg.focus} />}
    {seg.v === 'tx' && beat >= 1 && <div className="mk-tag" style={{ margin: 0 }}>{t(<>Prompt: <code>blog=*#</code> — tranzaksiya ochiq · <code>blog=!#</code> — tranzaksiyada xato bo'ldi</>, <>Приглашение: <code>blog=*#</code> — транзакция открыта · <code>blog=!#</code> — в транзакции произошла ошибка</>)}</div>}
    {seg.v === 'mongo' && <div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />{t('MongoDB — oxirgi telefon', 'MongoDB — последний телефон')}</h5><Doc>{t(`updateOne({ stock: { $gt: 0 } }, { $inc: { stock: -1 } })\nxaridor1 → modifiedCount: 0\nxaridor2 → modifiedCount: 1\nstock: 0   ← bittaga sotildi`, `updateOne({ stock: { $gt: 0 } }, { $inc: { stock: -1 } })\nxaridor1 → modifiedCount: 0\nxaridor2 → modifiedCount: 1\nstock: 0   ← продан одному`)}</Doc>
        <Doc er>{t(`tranzaksiya (oddiy mongod):\nXATO: This MongoDB deployment does not support\nretryable writes.`, `транзакция (обычный mongod):\nОШИБКА: This MongoDB deployment does not support\nretryable writes.`)}</Doc></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><div style={{ fontSize: 14, lineHeight: 1.5 }}>{t(<>Bir nechta jadval (<code>orders</code> + <code>products</code>) <b>bitta tranzaksiyada</b> — oddiy o'rnatishda ham. Xato bo'lsa — <code>ROLLBACK</code>, yarim ish qolmaydi.</>, <>Несколько таблиц (<code>orders</code> + <code>products</code>) <b>в одной транзакции</b> — даже при обычной установке. Если ошибка — <code>ROLLBACK</code>, полдела не остаётся.</>)}</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">{t(<>Bir nechta jadval birga o'zgarsa — <code>BEGIN … COMMIT</code>. Ichida xato bo'lsa, <code>COMMIT</code> javobi <b>ROLLBACK</b>: hammasi bekor.</>, <>Если несколько таблиц меняются вместе — <code>BEGIN … COMMIT</code>. Если внутри ошибка, ответ на <code>COMMIT</code> — <b>ROLLBACK</b>: всё отменено.</>)}</div>}
  </>} />;
}

// ============================================================
//  21 · JSON ham saqlaydi
// ============================================================
const ALT20 = psql(String.raw`
blog=# ALTER TABLE products ADD COLUMN extra JSONB;
ALTER TABLE`);
const INS20 = psql(String.raw`
blog=# INSERT INTO products (nomi, stock, extra) VALUES
blog-#   ('Futbolka', 12, '{"rang": "qora", "olcham": "M"}'),
blog-#   ('Quloqchin', 5, '{"rang": "oq", "bluetooth": true}');
INSERT 0 2
blog=# SELECT nomi, extra FROM products;
   nomi    |               extra
-----------+-----------------------------------
 Telefon   |
 Futbolka  | {"rang": "qora", "olcham": "M"}
 Quloqchin | {"rang": "oq", "bluetooth": true}
(3 rows)`);
const Q20 = psql(String.raw`
blog=# SELECT nomi, extra->>'rang' AS rang FROM products WHERE extra->>'rang' = 'qora';
   nomi   | rang
----------+------
 Futbolka | qora
(1 row)`, { 1: { id: 'q' } });
const S20 = mkS(21, [{ v: 'mongo' }, { v: 'alt' }, { v: 'ins' }, { v: 'q' }, { v: 'q', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'mongo' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-lab">{t("4-ekran: Mongo'da har hujjat har xil", '4-й экран: в Mongo каждый документ разный')}</div><div className="pg-three"><Doc>{`{ "author": "…", "izoh": "…" }`}</Doc><Doc>{`{ "author": "…", "izoh": "…" }`}</Doc><Doc odd>{`{ "muallif": "vali", "matn": "Salom", "like": 5 }`}</Doc></div></div>}
    {seg.v !== 'mongo' && <Psql lines={ALT20} />}
    {(seg.v === 'ins' || seg.v === 'q') && <Psql lines={INS20} />}
    {seg.v === 'q' && <Psql lines={Q20} focus={['q']} />}
    {seg.sum && <div className="mk-rule">{t(<>Hamma qatorda bor muhim maydon — <b>oddiy ustun</b> (qoidasi bilan) · har xil qo'shimcha — <code>jsonb</code>. «PostgreSQL JSON ham saqlaydi» — mana shu misol.</>, <>Важное поле, которое есть в каждой строке, — <b>обычная колонка</b> (со своим правилом) · разные дополнения — <code>jsonb</code>. «PostgreSQL хранит и JSON» — вот этот пример.</>)}</div>}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — buyurtma qayerda?
// ============================================================
const TX21 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
INSERT 0 1
blog=*# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
blog=!# COMMIT;
?        ← baza COMMIT'ga nima deb javob berdi? Variantni tanlang`);
function Screen21(p) {
  const m = MDT[22];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Psql lines={TX21} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>{t('Haqiqiy natija', 'Реальный результат')}</div>
      <Psql lines={psql(String.raw`
blog=!# COMMIT;
ROLLBACK
blog=# SELECT * FROM orders;
 id | product_id | xaridor
----+------------+---------
(0 rows)`)} />
    </div>} />;
}

// ============================================================
//  23 · Amaliyot 4 — ikki oyna
// ============================================================
const P4 = mkS(23, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { tableAt: 3 });
const P4_STEPS = [
  { t: 'Jadval', cmds: ['CREATE TABLE products (id SERIAL PRIMARY KEY, nomi TEXT NOT NULL, stock INT NOT NULL CHECK (stock >= 0));', "INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);"], exp: 'CREATE TABLE · INSERT 0 1' },
  { t: '1-oyna — COMMITsiz', cmds: ['BEGIN;', 'UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;'], exp: 'stock 0 · UPDATE 1 · tranzaksiya ochiq qolsin' },
  { t: '2-oyna', cmds: ['UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;'], exp: "javob yo'q — kutyapti" },
  { t: '1-oyna — COMMIT', cmds: ['COMMIT;'], exp: '1-oyna: COMMIT · 2-oyna: (0 rows) va oxirgi satr' },
  { t: '(ixtiyoriy) jsonb', cmds: ['ALTER TABLE products ADD COLUMN extra JSONB;'], exp: "21-ekrandagi INSERT va SELECT → Futbolka | qora; bajarmasangiz ham katakchani belgilang" },
];
const P4_TROUBLE = [
  ['2-oyna kutmadi, darhol UPDATE 0', "1-oynada COMMIT allaqachon yozilgan (yoki BEGIN yo'q) — telefon oldin sotilgan; UPDATE products SET stock = 1 WHERE id = 1; va 2-qadamdan qayta"],
  ['2-oyna kutdi, lekin UPDATE 1', "telefon 1 tadan ko'p (INSERT ikki marta) — SELECT id, nomi, stock FROM products; bilan ko'ring, UPDATE products SET stock = 1 WHERE id = 1; va 2-qadamdan qayta"],
  ['violates check constraint "products_stock_check"', "WHERE … stock > 0 tushib qolgan — CHECK to'xtatdi (19-ekran, 5-qadam)"],
  ['ERROR:  relation "products" does not exist', '2-oyna boshqa bazada — \\c blog'],
  ['ERROR:  relation "products" already exists', "jadval oldin yaratilgan (masalan 21-ekrandan) — 2-qadamga o'ting"],
];
const P4_PROOF = { label: '2-oynadagi oxirgi satr', placeholder: 'ikkinchi oynada chiqqan oxirgi satrni yozing', check: (v) => /^\s*update\s+0\s*$/i.test(v), wrong: "2-oyna 1-oyna COMMIT qilgandan keyin javob beradi — eng oxirgi satrni aynan yozing" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }
