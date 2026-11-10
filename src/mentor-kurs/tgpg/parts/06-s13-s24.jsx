
// ============================================================
//  13 · BIGINT: Telegram id va matn (orderbot-out/05; tgpg-out/07, 14; orderbot-ai/p2; 12-k5 Mongoose)
// ============================================================
const T13A = psql(String.raw`
shop=# SELECT telegram_id, pg_typeof(telegram_id), telegram_id > 2147483647 AS int4_sigmaydi FROM users;
 telegram_id | pg_typeof | int4_sigmaydi
-------------+-----------+---------------
         111 | bigint    | f
  5123456789 | bigint    | t
(2 rows)`, { 6: { id: 'a' } });
const T13B = term(String.raw`
$ node bigint.js          # node-pg
rows[0].telegram_id = "5123456789" · typeof: string
v === 5123456789 → false
Number(v) === 5123456789 → true
$ node sinov-typeorm.js   # TypeORM
user.telegram_id = "5123456789" · typeof: string`);
const S13 = mkS(13, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'd' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'a' && <Psql lines={T13A} focus={['a']} />}
    {seg.v !== 'a' && seg.v !== 'c' && <><Term lines={T13B} /><Pair code="User.create({ telegramId: 5123456789 })" res="typeof: number · === 5123456789 → true" /></>}
    {seg.v === 'c' && <div className="pg-two">
      <Card c={T.green} h={t("1 · tur — string (tgpg-done)", "1 · тип — string (tgpg-done)")}><p><code>telegram_id: string</code>{t(" · solishtirish ", " · сравнение ")}<code>String(ctx.from.id)</code>{t(" bilan", " через")}</p></Card>
      <Card c={PG.ai} h="2 · transformer → number (AI)"><p>{t("bazadan kelganda ", "из базы — ")}<code>Number(v)</code>{t("; Telegram id 52 bitdan oshmaydi", "; Telegram id не больше 52 бит")}</p></Card>
    </div>}
    {seg.v === 'c' && <Code k="DONE_USER" from={16} to={19} focus={['t']} ids={{ 18: 't', 19: 't' }} />}
    {seg.v === 'd' && <div className="mk-rule">{t("Diffda ikki joy: migratsiyada ", "В diff два места: в миграции ")}<b>BIGINT</b>{t("mi · entity'da qaysi tur va qayerda ", "ли · какой тип в entity и где ")}<code>===</code>{t(" bilan solishtirilgan.", " сравнивается.")}</div>}
  </>} />;
}

// ============================================================
//  14 · ON CONFLICT — ikki marta bosish (orderbot-out/07, 12-k6; 12-k5 Mongoose)
// ============================================================
const T14 = term(String.raw`
# avval SELECT, keyin INSERT — UNIQUE yo'q, 20 urinish × 2 parallel bosish:
1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
2 qator chiqqan urinishlar: 19/20
# UNIQUE (user_id, product_id) bor:
ok
ERROR: duplicate key value violates unique constraint "c2_user_id_product_id_key"
# INSERT … ON CONFLICT … DO UPDATE SET qty = qty + 1 (2 parallel):
RETURNING qty: 1, 2
[{"user_id":1,"product_id":2,"qty":2}]`, mergeMeta(rng(1, 6, { at: 1 }), rng(7, 9, { at: 2 }), { 3: { id: 'n' }, 6: { id: 'u' }, 8: { id: 'o' }, 9: { id: 'o' } }));
const S14 = mkS(14, [{ v: 'code', f: ['u'] }, { v: 'race', f: ['n', 'u'] }, { v: 'oc', f: ['o'] }, { v: 'code', f: [] }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <>
    {seg.v === 'code' && <Code k="DONE_CART" from={19} to={28} focus={['q']} ids={{ 22: 'q', 23: 'q', 24: 'q' }} active={F.cart} />}
    {seg.v !== 'code' && <Term title={t("terminal — haqiqiy parallel sinov", "терминал — настоящая параллельная проверка")} lines={upto(T14, beat)} beat={beat} focus={seg.f} />}
    {seg.v === 'oc' && <Pair code="findOneAndUpdate(…, { $inc: { qty: 1 } }, { upsert: true })" res={t("unique index'siz bir vaqtda — 2 hujjat · index bilan — 1", "без unique index одновременно — 2 документа · с index — 1")} />}
    {seg.v === 'code' && seg.f.length === 0 && <div className="mk-rule">{t("«Avval qidirib, keyin qo'shish» ko'rsangiz: jadvalda ", "Видите «сначала найти, потом добавить»: есть ли в таблице ")}<b>UNIQUE</b>{t(" bormi va so'rov ", " и идёт ли запрос через ")}<b>ON CONFLICT</b>{t(" bilanmi.", " ?")}</div>}
  </>} />;
}

// ============================================================
//  15 · State bazada (orderbot-ai/p2, p3 04b-state-restart; 12-k3-state-psql)
// ============================================================
const FLOW15 = [['u', '/start → [Sichqoncha] → [✅ Buyurtma berish]'], ['b', 'Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):'], ['sep', 'server qayta ishga tushdi'], ['u', '+998935554433'], ['b', "Buyurtma #1 qabul qilindi!\n• Sichqoncha × 1 = 75 000 so'm", 'ok']];
const FLOW15B = [['sep', '2-bosqichdan keyin (savat hali xotirada)'], ['u', '+998935554433'], ['b', "Buyurtma berilmadi: Savat bo'sh", 'bad']];
const T15 = psql(String.raw`
shop=# SELECT telegram_id, name, phone, state FROM users;
 telegram_id | name  | phone |     state
-------------+-------+-------+---------------
  5123456789 | Aziza |       | WAITING_PHONE
(1 row)`, { 4: { id: 's' } });
const S15 = mkS(15, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'b' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'a' && <><Code k="DONE_USER" from={30} to={32} focus={['s']} ids={{ 31: 's', 32: 's' }} /><Psql title={t("psql — telefon so'ralgan payt", "psql — момент запроса телефона")} lines={T15} focus={['s']} /></>}
    {seg.v === 'b' && <TgFlow title={t("Bobur — 3-bosqichdan keyin", "Бобур — после 3-го этапа")} items={FLOW15} />}
    {seg.v === 'c' && <div className="pg-two"><TgFlow title={t("2-bosqichdan keyin", "после 2-го этапа")} items={FLOW15B} /><TgFlow title={t("3-bosqichdan keyin", "после 3-го этапа")} items={FLOW15.slice(2)} /></div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — xom so'rov va "111" (orderbot-out/12-k7-tenglik.txt)
// ============================================================
const C16 = ts(String.raw`
this.bot.command('orders', async (ctx) => {
  await this.users.getOrCreate(ctx.from);
  // raw = this.ds.query — natija turi any
  const rows = await this.orders.raw(
    'SELECT telegram_id FROM users WHERE telegram_id = $1',
    [ctx.from.id],
  );
  if (rows[0].telegram_id !== 111) return ctx.reply(texts.adminOnly);`, { 8: { id: 'x' } });
const T16 = term(String.raw`
$ npx tsc --noEmit
(tsc: xato yo'q)`);
const T16_AFTER = term(String.raw`
Jasur (id 111, ADMIN_TELEGRAM_IDS=111): /orders → bot: Bu buyruq faqat admin uchun.
$ node bigint.js
v === 5123456789 → false
Number(v) === 5123456789 → true`);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="telegram.service.ts" lines={C16} focus={['x']} /><Term lines={T16} /></div>,
    after: <Term title={t("terminal — haqiqiy natija", "терминал — настоящий результат")} lines={T16_AFTER} />,
  });
}

// ============================================================
//  17 · Amaliyot 3 — 2- va 3-prompt
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []]);
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} />; }

// ============================================================
//  18 · Buyurtma — bitta tranzaksiya (orderbot-out/07-sql-log 33–41; 12-k8-trigger-rollback)
// ============================================================
const T18 = term(String.raw`
query: START TRANSACTION
query: SELECT … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 FOR UPDATE -- PARAMETERS: [2]
query: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [1,2]
query: SELECT … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 FOR UPDATE -- PARAMETERS: [1]
query: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [1,1]
query: INSERT INTO "orders"("phone", "total", "status", "created_at", "user_id") VALUES (…) RETURNING "id", "status", "created_at"
query: INSERT INTO "order_items"("qty", "price", "order_id", "product_id") VALUES (…), (…) RETURNING "id"
query: DELETE FROM "cart_items" WHERE "user_id" = $1 -- PARAMETERS: [2]
query: COMMIT`, { 1: { id: 'tx' }, 9: { id: 'tx' } });
const T18B = term(String.raw`
oldin  · products Klaviatura 8, Kolonka 10 · orders 0 · cart_items 2
query failed: INSERT INTO "order_items"(…) VALUES (…)
error: error: SINOV: order_items yozilmadi
bot: Buyurtma berilmadi: SINOV: order_items yozilmadi
keyin  · products Klaviatura 8, Kolonka 10 · orders 0 · cart_items 2`);
const S18 = mkS(18, [{ v: 'jad' }, { v: 'log' }, { v: 'rb' }, { v: 'log', f: ['tx'] }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'jad' && <div className="pg-three"><Card c={PG.pg} h="products"><p>{t("ombordan ayirish · ", "списание со склада · ")}<code>UPDATE</code></p></Card><Card c={T.green} h="orders + order_items"><p>{t("buyurtma · ", "заказ · ")}<code>INSERT</code></p></Card><Card c={T.yellow} h="cart_items"><p>{t("savatni tozalash · ", "очистка корзины · ")}<code>DELETE</code></p></Card></div>}
    {seg.v === 'jad' && <Code k="DONE_PLACE" from={24} to={29} />}
    {seg.v === 'log' && <Term title={t("DB_LOGGING=true — SQL log (SELECT ustunlari qisqartirilgan)", "DB_LOGGING=true — SQL-лог (колонки SELECT сокращены)")} lines={T18} focus={seg.f || []} />}
    {seg.v === 'rb' && <Term title={t("terminal — trigger bilan ataylab xato", "терминал — нарочная ошибка через trigger")} lines={T18B} />}
  </>} />;
}

// ============================================================
//  19 · Ikki mijoz, bitta Planshet: qulf (orderbot-out/08, 10-smoke-tgpg-done; orderbot-ai/p4/04c)
// ============================================================
const FLOW19 = [['sep', 'omborda 1 ta Planshet'], ['u', 'Aziza: [✅ Buyurtma berish]   ·   Bobur: [✅ Buyurtma berish]'], ['b', 'Aziza ← Buyurtma #4 qabul qilindi!', 'ok'], ['b', 'Bobur ← Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi', 'bad'], ['sep', 'ombor 0 · Boburning savati saqlandi']];
function Race19({ step }) {
  return <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Bitta qator, ikki tranzaksiya", "Одна строка, две транзакции")}</div>
    <div className="race">
      <div className="tx"><div className={step >= 1 ? 'ok' : ''}>{t("A: qatorni qulfladi", "A: заблокировала строку")}</div><div className={step >= 2 ? 'ok' : ''}>A: stock 1 → 0 · COMMIT</div></div>
      <div className="row">Planshet<br />stock {step >= 2 ? 0 : 1}</div>
      <div className="tx"><div className={step >= 1 ? 'w' : ''}>{t("B: kutadi…", "B: ждёт…")}</div><div className={step >= 2 ? 'bad' : ''}>{t("B: stock 0 — rad etildi · ROLLBACK", "B: stock 0 — отклонено · ROLLBACK")}</div></div>
    </div></div>;
}
const T19 = term(String.raw`
$ npm run smoke -- race
  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0
  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1`);
const S19 = mkS(19, [{ step: 0 }, { step: 1 }, { step: 2, flow: true }, { step: 2, smoke: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <Race19 step={seg.step} />
    {seg.flow && <TgFlow title={t("ikki mijoz bir vaqtda", "два клиента одновременно")} items={FLOW19} src="npm run smoke -- race" />}
    {seg.smoke && <Term lines={T19} />}
  </>} />;
}

// ============================================================
//  20 · Buzamiz: qulfsiz o'qib yozish (manba/orderbot-buzuq-order.service.ts; orderbot-out/09, 10-smoke-buzuq)
// ============================================================
const T20 = term(String.raw`
# 5 xaridor, 1 ta Planshet, bir vaqtda checkout — 5 raund
buzuq (findOneBy → if → save):  sotildi/ombor  1/0  5/0  5/0  5/0  5/0
$ npm run smoke -- race
  ✗ ortiqcha sotilmadi (sotildi/ombor): 4/0  5/0  5/0`, { 2: { id: 'b' } });
const T20_OK = term(String.raw`
tgpg-done (lock: pessimistic_write):  sotildi/ombor  1/0  1/0  1/0  1/0  1/0
$ npm run smoke -- race
  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0`);
const S20 = mkS(20, [{ v: 'code' }, { v: 'race' }, { v: 'race', chk: true }, { v: 'fix' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="BUZUQ" focus={['r', 'w']} ids={{ 31: 'r', 36: 'w', 37: 'w' }} />}
    {seg.v === 'race' && <CodePanel file="order.service.ts" lines={kod('BUZUQ', { 31: 'r', 36: 'w', 37: 'w' }, 31, 37)} focus={seg.chk ? [] : ['r']} />}
    {seg.v === 'race' && <Term title={t("terminal — haqiqiy parallel sinov", "терминал — настоящая параллельная проверка")} lines={T20} focus={['b']} />}
    {seg.chk && <div className="n2-warn">{t("Har tranzaksiya ", "Каждая транзакция ")}<b>0</b>{t(" yozdi — ", " записала — ")}<code>CHECK (stock &gt;= 0)</code>{t(" uchun 0 ruxsat etilgan: xato xabari yo'q, faqat ortiqcha buyurtmalar.", " 0 разрешён: сообщения об ошибке нет, только лишние заказы.")}</div>}
    {seg.v === 'fix' && <><CodePanel file="order.service.ts · tgpg-done" lines={kod('DONE_PLACE', { 31: 'l', 32: 'l', 33: 'l', 34: 'l' }, 29, 38)} focus={['l']} /><Term lines={T20_OK} /></>}
  </>} />;
}

// ============================================================
//  21 · Tranzaksiya ichida xato: aborted (orderbot-out/04a — o'z birinchi kodimiz)
// ============================================================
const T21 = term(String.raw`
Aziza: [✅ Buyurtma berish]     # 4 ta Planshet, omborda 3 ta
query failed: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [4,5]
error: error: new row for relation "products" violates check constraint "stock_nonneg"
query failed: SELECT "Product"."id" AS "Product_id", … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 -- PARAMETERS: [5]
error: error: current transaction is aborted, commands ignored until end of transaction block
  bot → Aziza: Buyurtma berilmadi: current transaction is aborted, commands ignored until end of transaction block`, { 3: { id: 'c' }, 5: { id: 'a' }, 6: { id: 'a' } });
const S21 = mkS(21, [{ v: 'log', f: [] }, { v: 'log', f: ['c', 'a'] }, { v: 'pg' }, { v: 'fix' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'log' && <Term title={t("terminal — birinchi kodimiz (tgpg-done yozilayotganda)", "терминал — наш первый код (пока писался tgpg-done)")} lines={T21} focus={seg.f} />}
    {seg.v === 'pg' && <div className="pg-three"><Card c={T.green} h="shop=#"><p>{t("oddiy — har buyruq o'zi saqlanadi", "обычное — каждая команда сохраняется сама")}</p></Card><Card c={T.yellow} h="shop=*#"><p>{t("tranzaksiya ochiq", "транзакция открыта")}</p></Card><Card c={T.accent} h="shop=!#" hl><p>{t("xato bo'ldi — faqat ROLLBACK", "была ошибка — только ROLLBACK")}</p></Card></div>}
    {seg.v === 'pg' && <div className="mk-rule">{t("PostgreSQL-2 dagi undov belgili prompt — kodda ", "Промпт с восклицательным знаком из PostgreSQL-2 — в коде ")}<code>current transaction is aborted</code>{t(" bo'lib chiqadi.", " выходит.")}</div>}
    {seg.v === 'fix' && <Code k="DONE_PLACE" from={31} to={45} focus={['t']} ids={{ 36: 't', 37: 't', 38: 't', 42: 'u' }} />}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — qaysi satr ortiqcha sotadi (LineCheck; buzuq fayl 29–41, xato 31 → bo'lakda 3-satr, target 2)
// ============================================================
const LC22 = kod('BUZUQ').filter((l) => l.n !== 30); // 30-satr izohi — shovqin; satr raqamlari haqiqiy
const LC22_FIXED = LC22.map((l) => (l.n === 31 ? { ...l, gone: true } : l));
LC22_FIXED.splice(2, 0, ...ts(String.raw`
        const p = await m.findOne(Product, {
          where: { id: c.product.id },
          lock: { mode: 'pessimistic_write' },
        });`).map((l) => ({ ...l, neu: true })));
function plainLines(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }
function Screen22(p) {
  const m = MDT[22];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="order.service.ts" lines={LC22} target={1}
    tree={{ root: MKCFG.root, files: compact(DONE_FILES, F.ord), active: F.ord }}
    fixed={LC22_FIXED} fixedExtra={[{ file: 'npm run smoke -- race', lines: plainLines('✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0') }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  23 · Amaliyot 4 — 4-prompt va ko'p mijoz sinovi
// ============================================================
const P23 = mkPractice(23, [[], [0, 1], [2, 3], []]);
function ScreenP23(p) { return <Practice p={p} S={P23.S} steps={P23.steps} trouble={P23.trouble} proof={P23.proof} />; }

// ============================================================
//  24 · Beshta tekshiruv (orderbot-ai/XULOSA; 10-smoke-tgpg-done — birinchi yurish ✗ bekor)
// ============================================================
const CHK24 = [['1', 'diff', 'hajm = so\'ralgan bosqich (1145 qator — yo\'q)'], ['2', 'build', 'tsc · nest build'], ['3', 'restart', 'suhbat o\'rtasida · smoke restart'], ['4', 'psql', '\\d · CHECK · bigint · SELECT'], ['5', "ko'p mijoz", 'smoke race · ikki marta bekor']];
const FOUND24 = ["so'ralmagan ishni qildi (22 fayl)", 'oraliq vaziyatni sezmadi', "sinovda Telegram'ga bitta so'rov ketdi (401)", 'bizning kodda: ikki marta «Bekor» → ombor 2'];
const T24 = term(String.raw`
$ npm run smoke        # tgpg-done, birinchi yurish
  ✗ ikki marta bekor — ombor bir marta qaytdi: 2
$ npm run smoke        # FOR UPDATE qo'shilgach
  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1
NATIJA: 5/5 ✓`);
const S24 = mkS(24, [{ on: ['1', '2'] }, { on: ['3', '4'] }, { on: ['5'], t: true }, { on: ['1', '2', '3', '4', '5'], f: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <div className="pg-four" style={{ gridTemplateColumns: 'repeat(5,minmax(0,1fr))' }}>{CHK24.map(([n, h, d]) => { const cur = seg.on.includes(n) && seg.on.length < 5; return <Card key={n} c={cur ? T.accent : T.blue} h={`${n} · ${h}`} hl={cur} dim={!seg.on.includes(n)}><p>{d}</p></Card>; })}</div>
    {seg.t && <Term lines={T24} />}
    {seg.f && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("AI aytmadi — tekshiruv topdi", "AI не сказал — нашла проверка")}</div>
      <div className="mk-plan">{FOUND24.map((x, i) => <div key={x} style={{ animation: `mk-up .4s ${i * 0.08}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}
