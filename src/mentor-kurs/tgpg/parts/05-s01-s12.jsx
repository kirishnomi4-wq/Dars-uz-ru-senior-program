
// ============================================================
//  1 · Kirish — dars oxiridagi natija: bot buyurtmani bazaga yozdi (orderbot-out/04, 05)
// ============================================================
const PLAN1 = ['Loyiha va muammo', 'Reja va prompt', 'Ulanish va katalog', 'Foydalanuvchi, state, savat', 'Buyurtma va tranzaksiya', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0] }, { hl: [1, 2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
const ORDER1 = "Buyurtma #1 qabul qilindi!\n• Klaviatura × 1 = 120 000 so'm\n• Kolonka × 2 = 100 000 so'm\n\nJami: 220 000 so'm\nTelefon: +998901234567\nHolati: 🆕 Yangi";
const T1 = psql(String.raw`
shop=# SELECT id, user_id, phone, total, status FROM orders;
 id | user_id |     phone     | total  |  status
----+---------+---------------+--------+-----------
  1 |       2 | +998901234567 | 220000 | CONFIRMED
(1 row)`);
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>{t("Dars oxirida — bot buyurtmani PostgreSQL'ga yozadi", "В конце урока — бот пишет заказ в PostgreSQL")}</div>
    <div className="pg-two">
      <TgFlow title="OrderBotNest" items={[['u', '+998901234567'], ['b', ORDER1, 'ok']]} />
      <Psql lines={T1} />
    </div></>}
  </div>} />;
}

// ============================================================
//  2 · OrderBotNest: modullar va bot oqimi (tgpg-start; orderbot-out/01 1-jarayon)
// ============================================================
const SVC2 = [['catalog', 'mahsulotlar va ombor', T.green], ['user', 'foydalanuvchi, rol, state', T.green], ['cart', 'savat', T.green], ['order', 'buyurtma, admin statusi', T.green]];
const FLOW2 = [
  ['u', '/catalog'], ['b', 'Katalog (1/3-sahifa). Qo\'shish uchun mahsulotni bosing:'], ['kb', 'Klaviatura · 120 000 so\'m | Sichqoncha · 75 000 so\'m | 1/3 | ▶ | …'],
  ['u', '[Kolonka · 50 000 so\'m] ×2'], ['b', "Kolonka savatga qo'shildi (2 ta)."], ['u', '[✅ Buyurtma berish]'],
  ['b', 'Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):'], ['u', '+998901234567'], ['b', 'Buyurtma #1 qabul qilindi! … Jami: 220 000 so\'m'],
  ['sep', 'admin Jasur'], ['b', "🆕 Yangi buyurtma #1 — Aziza, 220 000 so'm. /orders"], ['u', '[✅ Tasdiqlash]'], ['b', 'Buyurtmangiz #1: ✅ Tasdiqlangan', 'ok'],
];
const S2 = mkS(2, [{ v: 'tg' }, { v: 'svc' }, { v: 'flow' }, { v: 'map' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {(seg.v === 'tg' || seg.v === 'svc') && <Code k="START_START" />}
    {seg.v === 'svc' && <div className="pg-four">{SVC2.map(([n, d, c]) => <Card key={n} c={c} h={`${n}.service.ts`}><p>{d}</p></Card>)}</div>}
    {seg.v === 'flow' && <TgFlow title="OrderBotNest · tgpg-start" items={FLOW2} />}
    {seg.v === 'map' && <Ide files={compact(START_FILES, F.usr)} active={F.usr}>
      <CodePanel file="user.service.ts" lines={kod('START_USER', { 8: 'm' }, 6, 8)} focus={['m']} />
      <CodePanel file="order.service.ts" lines={kod('START_ORDER', { 14: 'a' }, 12, 14)} focus={['a']} style={{ marginTop: 10 }} />
    </Ide>}
  </>} />;
}

// ============================================================
//  3 · Restart (orderbot-out/01-xotira-senariy — Map'lar yangidan; telefon qatori — 10-smoke-tgpg-start, alohida node jarayoni)
// ============================================================
const FLOW3A = [['sep', '1-jarayon'], ['u', '[Klaviatura] → [Kolonka] ×2 → telefon'], ['b', "Buyurtma #1 qabul qilindi! … Jami: 220 000 so'm", 'ok'], ['u', '/orders (admin) → [✅ Tasdiqlash]'], ['b', 'Buyurtmangiz #1: ✅ Tasdiqlangan'], ['u', '[Sichqoncha]'], ['b', "Sichqoncha savatga qo'shildi (1 ta)."]];
const FLOW3B = [['sep', 'server qayta ishga tushdi'], ['u', '/cart'], ['b', "Savat bo'sh. /catalog dan mahsulot tanlang.", 'bad'], ['u', '/orders (admin)'], ['b', "Hozircha buyurtma yo'q.", 'bad'], ['sep', 'telefon so\'ralgan paytda restart'], ['u', '+998901234567'], ['b', 'Tushunmadim. /help ni bosing.', 'bad']];
const LIST3 = ['mahsulot va ombor (stock)', 'foydalanuvchi va uning roli', 'telefon va state', 'savat', 'buyurtma'];
const S3 = mkS(3, [{ v: 'a' }, { v: 'b' }, { v: 'map' }, { v: 'list' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-two">
      <TgFlow title={t("1-jarayon", "1-й процесс")} items={FLOW3A} />
      {seg.v === 'b' ? <TgFlow title="Restart" items={FLOW3B} /> : <div />}
    </div>}
    {seg.v === 'map' && <div className="pg-three">
      <Card c={T.blue} h={t("Node jarayoni", "Процесс Node")}><p>{t("ishga tushadi → ", "запускается → ")}<code>new Map()</code>{t(" bo'sh", " пустой")}</p></Card>
      <Card c={T.accent} h="RAM" hl><p>{t("Map, massiv — jarayon to'xtasa o'chadi", "Map, массив — остановился процесс, и они стёрты")}</p></Card>
      <Card c={PG.pg} h={t("Disk (baza)", "Диск (база)")} dim><p>{t("hozir yo'q", "сейчас нет")}</p></Card>
    </div>}
    {seg.v === 'list' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Bazaga ko'chadigan beshta ma'lumot", "Пять данных, которые переезжают в базу")}</div>
      <div className="mk-plan">{LIST3.map((x, i) => <div key={x} style={{ animation: `mk-up .4s ${i * 0.08}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — restartdan keyin Kolonka (orderbot-out/12-k3-stock-restart.txt — ikki alohida jarayon)
// ============================================================
const T4_AFTER = term(String.raw`
$ node k3p.cjs tgpg-start 1
jarayon 276989: Buyurtma #1 qabul qilindi! · Kolonka stock = 8
$ node k3p.cjs tgpg-start 2
jarayon 277003 (qayta ishga tushdi): Kolonka stock = 10`);
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="catalog.service.ts" lines={kod('START_CAT', { 11: 'mi' }, 7, 14)} focus={['mi']} /><div className="mk-pair">{t("1-jarayon: Aziza [Kolonka] ×2 → «Buyurtma #1 qabul qilindi!» → qoldiq 8", "процесс 1: Азиза [Kolonka] ×2 → «Buyurtma #1 qabul qilindi!» → остаток 8")}</div></div>,
    after: <Term title={t("terminal — ikki alohida jarayon", "терминал — два отдельных процесса")} lines={T4_AFTER} />,
  });
}

// ============================================================
//  5 · Amaliyot 1 — clone, ishga tushirish, restart
// ============================================================
const P5 = mkPractice(5, [[], [0, 1], [2, 3], []]);
function ScreenP5(p) { return <Practice p={p} S={P5.S} steps={P5.steps} trouble={P5.trouble} proof={P5.proof} />; }

// ============================================================
//  6 · Reja: to'rt bosqich (orderbot-ai2 — oddiy prompt, 22 fayl / 1145 qator)
// ============================================================
const STAGES6 = [['1', 'Ulanish + katalog', 'TypeORM, migratsiya, products, seed'], ['2', 'Foydalanuvchi + state', 'users, BIGINT, WAITING_PHONE'], ['3', 'Savat', 'cart_items, UNIQUE, ON CONFLICT'], ['4', 'Buyurtma', 'orders, order_items, tranzaksiya']];
const DIFF6 = ` src/db/database.module.ts               |  29 ++
 src/db/migrations/1762000000000-Init.ts |  69 +++
 22 files changed, 1145 insertions(+), 210 deletions(-)`;
const S6 = mkS(6, [{ v: 'st', hl: -1 }, { v: 'chk', hl: -1 }, { v: 'haiku' }, { v: 'st', hl: 'all' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    <div className="pg-four">{STAGES6.map(([n, h, d], i) => <Card key={n} c={T.accent} h={`${n} · ${h}`} style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><p>{d}</p>
      {seg.v === 'chk' && <p style={{ marginTop: 6, color: T.green, fontFamily: MONO }}>✓ build · restart · psql → commit</p>}</Card>)}</div>
    {seg.v === 'haiku' && <AiReply who={t("Oddiy prompt (2-tajriba)", "Обычный промпт (2-й опыт)")} prompt="Katalogni postgresqlga ko'chirib ber, TypeORM ishlat. .env da DATABASE_URL bor." said={<>{t("AI: «katalog va holat xotiradan PostgreSQL'ga ko'chirildi» — ", "AI: «каталог и состояние перенесены из памяти в PostgreSQL» — ")}<b>{t("hamma servis", "все сервисы")}</b>{t(" o'zgardi, chetga chiqqani alohida aytilmadi.", " изменены, выход за рамки отдельно не назван.")}</>} diff={DIFF6} hl />}
    {seg.v === 'st' && seg.hl === 'all' && <div className="mk-rule">{t("Bitta prompt — ", "Один промпт — ")}<b>{t("bitta bosqich", "один этап")}</b>{t(". Tekshirmaguncha keyingisi yozilmaydi.", ". Пока не проверено, следующий не пишется.")}</div>}
  </>} />;
}

// ============================================================
//  7 · Besh qismli prompt (orderbot-ai/00-promptlar.md — Prompt 1, aynan)
// ============================================================
const PROMPT1 = [
  ['1', "Bu NestJS + Telegraf loyihasi (Telegram buyurtma boti). Hozir katalog, savat, foydalanuvchilar va buyurtmalar xotirada (Map va array) — server qayta ishga tushsa hammasi yo'qoladi. Ularni PostgreSQL'ga bosqichma-bosqich ko'chiramiz.\n\n"],
  ['2', "1-bosqich — faqat bazaga ulanish va katalog:\n"],
  ['3', "- TypeORM ulang (@nestjs/typeorm, pg). Manzil .env dagi DATABASE_URL dan, src/config/index.ts orqali o'qilsin.\n- synchronize ishlatmang: jadvallar migratsiya bilan yaratilsin, server ko'tarilganda yurmagan migratsiya o'zi yursin.\n- products jadvali: id, name (takrorlanmas), price, stock; stock manfiy bo'lmasin — bazada CHECK.\n- Seed skript (npm run seed): hozirgi 6 mahsulotni kiritsin, ikkinchi marta yurganda takror qo'shmasin.\n- CatalogService bazadan o'qisin, sahifalash qolsin (2 tadan).\n"],
  ['4', "- User, savat, buyurtma servislariga hali tegmang.\n\n"],
  ['5', "Javobingizda: qaysi fayllar o'zgardi, qanday ishga tushirish va psql'da nimani tekshirish kerak."],
];
const PART7 = ['kontekst', 'maqsad', 'shartlar', 'chegara', 'javob'];
const S7 = mkS(7, [{ on: ['1'] }, { on: ['2', '3'] }, { on: ['4', '5'] }, { on: [] }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag" style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t("1-prompt — nusxalanadi (12-ekran)", "1-й промпт — копируется (экран 12)")}</span><CopyBtn text={PROMPT1.map((x) => x[1]).join('')} /></div>
      <pre className="pr5">{PROMPT1.map(([k, tx]) => <span key={k} className={seg.on.includes(k) ? 'on' : seg.on.length ? 'dim' : ''}><i>{k} · {PART7[k - 1]}</i>{tx}</span>)}</pre></div>
    {seg.on.length === 0 && <div className="mk-rule">{t("Har shart — keyin ", "Каждое условие — потом ")}<b>{t("tekshiriladigan bitta band", "один проверяемый пункт")}</b>: CHECK → <code>UPDATE … SET stock = -1</code>{t(" xato beradi; seed → ikkinchi marta 0 ta.", " даёт ошибку; seed → во второй раз 0.")}</div>}
  </>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — qaysi prompt (orderbot-ai/p1, orderbot-ai2/p1)
// ============================================================
const DIFF8B = ` src/api/order/order.service.ts                     |  11 +-
 src/api/telegram/telegram.service.ts               |  25 +-
 (15 fayl, shundan package-lock.json 536 qator)`;
function Screen8(p) {
  return MC(p, 8, {
    above: <div style={{ display: 'grid', gap: 10 }}>
      <AiReply who="A · «Katalogni postgresqlga ko'chirib ber, TypeORM ishlat.»" said={t("«katalog va holat xotiradan PostgreSQL'ga ko'chirildi»", "«каталог и состояние перенесены из памяти в PostgreSQL»")} diff=" 22 files changed, 1145 insertions(+), 210 deletions(-)" />
      <AiReply who={t("B · besh qismli prompt (faqat 1-bosqich, «tegmang»)", "B · промпт из пяти частей (только 1-й этап, «не трогай»)")} said={<>«<b>{t("Bitta chetga chiqish:", "Один выход за рамки:")}</b>{t(" order va telegram servislarida bir nechta qatorni o'zgartirdim… await qo'shilmasa, kod kompilyatsiyadan o'tmaydi.»", " в сервисах order и telegram я изменил несколько строк… если не добавить await, код не скомпилируется.»")}</>} diff=" 15 files changed, 721 insertions(+), 77 deletions(-)" />
    </div>,
    after: <Term title={t("B · git diff --stat (parcha)", "B · git diff --stat (фрагмент)")} lines={term(DIFF8B)} />,
  });
}

// ============================================================
//  9 · TypeORM ichida: entity → migratsiya → migrations (tgpg-done; orderbot-out/03; Mongoose — pg2-out/v2d-mongoose.txt)
// ============================================================
const T9 = psql(String.raw`
shop=# \dt
             List of tables
 Schema |    Name     | Type  |  Owner
--------+-------------+-------+----------
 public | cart_items  | table | postgres
 public | migrations  | table | postgres
 public | order_items | table | postgres
 public | orders      | table | postgres
 public | products    | table | postgres
 public | users       | table | postgres
(6 rows)

shop=# SELECT * FROM migrations;
 id |   timestamp   |       name
----+---------------+-------------------
  1 | 1762200000000 | Init1762200000000
(1 row)`, { 13: { id: 'm' }, 16: { id: 'm' } });
const S9 = mkS(9, [{ v: 'ent' }, { v: 'mig' }, { v: 'tbl' }, { v: 'tbl', rule: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'ent' && <><Code k="DONE_PRODUCT" focus={['d']} ids={{ 4: 'd', 9: 'd', 12: 'd', 15: 'd' }} /><Pair code="new Schema({ _id: Number, name: String, price: Number, stock: Number })" res={t("migratsiya yo'q — shop bazasi birinchi create'da o'zi paydo bo'ldi", "миграции нет — база shop появилась сама при первом create")} /></>}
    {seg.v === 'mig' && <><Code k="DONE_MIG" focus={['c']} ids={{ 13: 'c' }} active={F.mig} /><div className="mk-rule"><code>synchronize: false</code>{t(" — jadvalni faqat migratsiya o'zgartiradi · ", " — таблицу меняет только миграция · ")}<code>migrationsRun: true</code>{t(" — server ko'tarilganda yurmagani o'zi yuradi", " — при подъёме сервера незапущенная запускается сама")}</div></>}
    {seg.v === 'tbl' && <Psql lines={T9} focus={seg.rule ? ['m'] : []} />}
    {seg.rule && <div className="mk-rule">{t("Ustun qo'shish — ", "Добавить колонку — ")}<b>{t("yangi migratsiya fayli", "новый файл миграции")}</b>{t(". Yurgan migratsiyani tahrirlash foyda bermaydi: ", ". Править уже выполненную миграцию бесполезно: ")}<code>migrations</code>{t(" jadvalida u allaqachon bor.", " она уже есть в таблице.")}</div>}
  </>} />;
}

// ============================================================
//  10 · AI javobini o'qish (orderbot-ai/p1: 00-ai-javobi, diff-stat, 02-seed, 05-psql)
// ============================================================
const DIFF10 = ` .env.example                                       |   3 +
 README.md                                          |  12 +-
 package-lock.json                                  | 536 +++++++++++++++++++--
 package.json                                       |  13 +-
 src/api/app.module.ts                              |   4 +-
 src/api/catalog/catalog.module.ts                  |   3 +
 src/api/catalog/catalog.service.ts                 |  71 +--
 src/api/catalog/product.entity.ts                  |  20 +
 src/api/order/order.service.ts                     |  11 +-
 src/api/telegram/telegram.service.ts               |  25 +-
 src/config/index.ts                                |   2 +
 src/database/data-source.ts                        |   6 +
 .../migrations/1793733128247-CreateProducts.ts     |  23 +
 src/database/seed.ts                               |  42 ++
 src/database/typeorm.config.ts                     |  27 ++
 15 files changed, 721 insertions(+), 77 deletions(-)`;
const DIFF10L = term(DIFF10, { 9: { id: 'x' }, 10: { id: 'x' } });
const T10 = term(String.raw`
$ npm run seed
Seed: 6 ta mahsulot qo'shildi, 0 tasi bazada bor edi.
$ npm run seed
Seed: 0 ta mahsulot qo'shildi, 6 tasi bazada bor edi.
$ psql -U postgres -d shop -c '\d products'
    "UQ_products_name" UNIQUE CONSTRAINT, btree (name)
    "CHK_products_stock" CHECK (stock >= 0)`);
const S10 = mkS(10, [{ v: 'diff' }, { v: 'out' }, { v: 'run' }, { v: 'run' }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v !== 'run' && <Term title={t("git diff --stat — 1-tajriba, 1-prompt", "git diff --stat — 1-й опыт, 1-й промпт")} lines={DIFF10L} focus={seg.v === 'out' ? ['x'] : []} />}
    {seg.v === 'out' && <AiReply who={t("1-tajriba · 1-prompt", "1-й опыт · 1-й промпт")} said={<>«<b>{t("Bitta chetga chiqish (buni bilib qo'ying):", "Один выход за рамки (имейте в виду):")}</b>{t(" order va telegram servislarida bir nechta qatorni o'zgartirdim. Bazaga so'rov asinxron, shuning uchun CatalogService metodlari endi Promise qaytaradi…»", " в сервисах order и telegram я изменил несколько строк. Запрос к базе асинхронный, поэтому методы CatalogService теперь возвращают Promise…»")}</>} hl />}
    {seg.v === 'run' && <Term title={t("terminal — o'zingiz yurgizasiz", "терминал — запускаете сами")} lines={T10} />}
  </>} />;
}

// ============================================================
//  11 · Oraliq vaziyat (orderbot-ai/p1: 04-senariy, 05-psql)
// ============================================================
const T11 = psql(String.raw`
shop=# SELECT * FROM products ORDER BY id;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     7
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Kolonka    |  50000 |     8
  5 | Planshet   | 300000 |     3
  6 | O'yinchoq  |  30000 |     4
(6 rows)`, { 4: { id: 'k' }, 7: { id: 'k' } });
const FLOW11A = [['sep', '1-bosqichdan keyin'], ['u', '[Klaviatura] → [Kolonka] ×2 → telefon'], ['b', "Buyurtma #1 qabul qilindi! … Jami: 220 000 so'm"]];
const FLOW11B = [['sep', 'server qayta ishga tushdi'], ['u', '/orders (admin)'], ['b', "Hozircha buyurtma yo'q.", 'bad']];
const S11 = mkS(11, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'c' }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    {seg.v !== 'c' && <div className="pg-two"><TgFlow title={t("buyurtma — xotirada", "заказ — в памяти")} items={FLOW11A} />{seg.v === 'b' && <TgFlow title="restart" items={FLOW11B} />}</div>}
    {seg.v === 'b' && <Psql lines={T11} focus={['k']} />}
    {seg.v === 'c' && <div className="pg-two"><Card c={PG.pg} h={t("ombor → bazaga yozildi", "склад → записан в базу")}><p>Klaviatura 8 → 7 · Kolonka 10 → 8</p></Card><Card c={T.accent} h={t("buyurtma → xotirada edi", "заказ → был в памяти")} hl><p>{t("restart o'chirdi — kim olgani noma'lum", "стёр перезапуск — кто взял, неизвестно")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  12 · Amaliyot 2 — 1-prompt o'z AI'ingiz bilan
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []]);
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} />; }
