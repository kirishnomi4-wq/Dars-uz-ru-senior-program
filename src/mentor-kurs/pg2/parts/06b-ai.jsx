// ============================================================
//  6-bosqich · AI yozgan SQL (F-1125-01, M56). HAQIQIY AI — Claude Haiku ×2, fayl va buyruqsiz (oddiy chatdagi javob).
//  Topshiriq — o'quvchi darsi m4-06 (src/4-Modull/PostgresCrudLesson.jsx) amaliyotidagi to'rt amal, darsning 1-bosqichidagi shop · products.
//  SQL aynan, vaqtinchalik PostgreSQL 18 da yurgizilgan (M10).
//  Manba: feedback/F-1125-01-nest1-kuchaytirish/ai-pg2/ — 00-promptlar.md · A-oddiy/ · A-oddiy-nomlar/ · B-tuzilish/ · A-tuzatilgan/ · qoshimcha-drop-column/ · XULOSA.md
//  Matn MD generatoridan tashqarida (MD'da «## AI-1», «## AI-2» — hujjat), RU shu faylning oxirida ru() bilan.
// ============================================================
SPOKEN.push(['drop column kolonka', 'DROP COLUMN kolonka'], ['drop column', 'DROP COLUMN']);
// Topshiriqlar AI'ga o'zbekcha berilgan — ruscha darsda ham aynan shu matn (tarjima qilinmaydi)
const AIQ_TASKS = ["1) 100 000 so'mdan arzon mahsulotlarni ko'rsat", '2) Quloqchin narxini 90 000 so\'m qil', "3) Kolonkani o'chir", "4) yangi mahsulot qo'sh: Monitor, 1 500 000 so'm, 3 dona"];
const AIQ_A_SQL = sql(String.raw`
SELECT * FROM mahsulotlar WHERE narxi < 100000;
SELECT * FROM mahsulotlar WHERE nomi ILIKE '%quloqchin%';
UPDATE mahsulotlar SET narxi = 90000 WHERE nomi ILIKE '%quloqchin%';
ALTER TABLE mahsulotlar DROP COLUMN kolonka;
INSERT INTO mahsulotlar (nomi, narxi, soni) VALUES ('Monitor', 1500000, 3);`);
const AIQ_A_ERR = psql(String.raw`
ERROR:  relation "mahsulotlar" does not exist
LINE 1: SELECT * FROM mahsulotlar WHERE narxi < 100000;
                      ^
… beshala buyruqda — xuddi shu xato`);
const AIQ_B_3 = sql(String.raw`
-- Avval tekshirish: bu kolonka bormi?
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'products';

BEGIN;
ALTER TABLE products DROP COLUMN <kolonka_nomi>;`);
// [topshiriq, A (nomlar almashtirilgan), B (butun javob)] — ai-pg2/A-oddiy-nomlar/natija.txt, B-tuzilish/natija.txt
const AIQ_ROWS = [
  [{ uz: "1 · arzonlar", ru: '1 · дешёвые' }, { r: '3 rows', ok: true }, { r: '3 rows', ok: true }],
  [{ uz: '2 · Quloqchin 90 000', ru: '2 · Quloqchin 90 000' }, { r: 'UPDATE 1', ok: true }, { r: 'BEGIN · UPDATE 1 · COMMIT', ok: true }],
  [{ uz: "3 · Kolonkani o'chir", ru: '3 · удалить Kolonka' }, { r: 'ERROR', n: { uz: 'column "kolonka" … does not exist', ru: 'column "kolonka" … does not exist' }, bad: true }, { r: 'ERROR', n: { uz: 'syntax error at or near "<"', ru: 'syntax error at or near "<"' }, bad: true }],
  [{ uz: '4 · Monitor', ru: '4 · Monitor' }, { r: 'INSERT 0 1', ok: true }, { r: 'ERROR', n: { uz: 'current transaction is aborted', ru: 'current transaction is aborted' }, bad: true }],
  [{ uz: 'yakun: SELECT *', ru: 'итог: SELECT *' }, { r: { uz: 'Kolonka joyida', ru: 'Kolonka на месте' }, bad: true }, { r: { uz: "Kolonka joyida · Monitor yo'q", ru: 'Kolonka на месте · Monitor нет' }, bad: true }],
];
const tlq = (x) => (x && typeof x === 'object' ? t(x.uz, x.ru) : x);
function AiqCell({ c }) {
  const col = c.bad ? T.accent : c.ok ? T.green : T.ink3;
  return <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap', minWidth: 0, padding: '5px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <b style={{ font: `700 12.5px/1.35 ${MONO}`, color: col }}>{tlq(c.r)}</b>
    {c.n && <span style={{ font: `12px/1.35 ${MONO}`, color: T.accent, overflowWrap: 'anywhere' }}>{tlq(c.n)}</span>}
  </div>;
}
const S_PG2AI = {
  kicker: '6-bosqich · AI yozgan SQL', title: "AI yozgan SQL bazada: to'rt amal, ikki topshiriq — Kolonka o'chmadi",
  segments: [
    sg('a', "O'quvchi amaliyotidagi to'rt amalni haqiqiy AI'ga berdik: <b>oddiy so'z bilan</b> va <b>jadval tuzilishi bilan</b>", "m4-06 da o'quvchi AI'ga oddiy so'z bilan aytadi, AI SQL yozadi. Biz ham haqiqiy AI'ga, Claude Haiku'ga, to'rt amal berdik: arzon mahsulotlarni ko'rsatish, quloqchin narxini o'zgartirish, kolonkani o'chirish va monitor qo'shish. Chapdagisiga jadval tuzilishini aytmadik, o'ngdagisiga aytdik."),
    sg('b', "A jadval nomini <b>o'ylab topdi</b> — beshala buyruq bir xil xato", "Birinchi AI jadval tuzilishini bilmagani uchun nomlarni o'ylab topdi: mahsulotlar, nomi, narxi. Bazada esa products. Beshala buyruq bir xil xato berdi: bunday jadval yo'q. O'quvchi darsidagi AI xatosining haqiqiy ko'rinishi shu: u yerda product, bu yerda mahsulotlar."),
    sg('c', "«Kolonkani o'chir» — ikkala AI ham uni <b>jadval ustuni</b> deb tushundi", "Eng muhim joy uchinchi amal. Bizning do'konda kolonka mahsulot. Ikkala AI ham uni jadval ustuni deb tushundi. A ustunni o'chiradigan alter table drop column yozdi. B jadval tuzilishini bilsa ham, qaysi ustun aniq emas, deb shablon berdi. Topshiriq qatorni o'chirish edi, ya'ni delete."),
    sg('d', "Bazada: ikkalasida <b>Kolonka joyida</b>, B da <b>Monitor ham qo'shilmadi</b>", "Endi bazadagi natija. A ning nomlarini, o'zi aytganidek, haqiqiysiga almashtirdik: narx o'zgardi, monitor qo'shildi, kolonka esa joyida qoldi. B ning javobini butunlay yurgizdik: narx begin va commit ichida to'g'ri o'zgardi, lekin shablondagi xato tranzaksiyani buzdi va monitor ham qo'shilmadi."),
    sg('e', "Xulosa: AI buyrug'ini <b>fe'l, nom va son</b> bilan tekshiring", "Xulosa. AI yozgan SQL'ni uch narsa bilan tekshiring. Fe'l topshiriqqa mosmi: ko'rish select, o'zgartirish update, o'chirish delete, qo'shish insert. Jadval va ustun nomi backslash d bilan bir xilmi. Javobdagi son kutganingizmi. Oxirida select yulduzcha bilan butun jadvalga qarang."),
  ],
};
function ScreenAI(p) {
  return <Lesson p={p} S={S_PG2AI} scene={({ beat }) => (<>
    {beat === 0 && <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('A · oddiy so\'z bilan (tuzilish aytilmagan)', 'A · простыми словами (дано на узбекском, без структуры)')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>«Do'konim bazasida mahsulotlar bor. PostgreSQL uchun SQL yozib ber:»</div>
        </div>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('B · jadval tuzilishi bilan', 'B · со структурой таблицы (дано на узбекском)')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>«PostgreSQL, shop bazasi. Jadval: <code>products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER)</code>… Har UPDATE va DELETE'da WHERE bo'lsin; avval SELECT bilan tekshirib olinadigan qilib yoz.»</div>
        </div>
      </div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("Ikkalasiga bir xil to'rt amal · baza — 1-bosqichdagi shop · products (Kolonka — mahsulot)", 'Обоим одни и те же четыре действия · база — shop · products из этапа 1 (Kolonka — товар)')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 14 }}>{AIQ_TASKS.map((x) => <div key={x}>{x}</div>)}</div>
      </div>
    </>}
    {beat === 1 && <>
      <CodePanel file={t('A · javobdagi SQL (aynan)', 'A · SQL из ответа (дословно)')} lines={AIQ_A_SQL} />
      <Psql title={t('psql — shop · A yurgizildi (haqiqiy)', 'psql — shop · запуск A (настоящий)')} er lines={AIQ_A_ERR} />
    </>}
    {beat === 2 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <div className="mk-tag" style={{ margin: 0 }}>{t('A · 3-amal (aynan)', 'A · действие 3 (дословно)')}</div>
        <CodePanel file="sql" numbers={false} lines={sql("ALTER TABLE mahsulotlar DROP COLUMN kolonka;")} />
        <div style={{ fontSize: 13.5, color: T.ink2 }}>«Qaysi ustun o'chirilishi aniq emas. Agar ustun nomi <code>kolonka</code> bo'lsa…»</div>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <div className="mk-tag" style={{ margin: 0 }}>{t('B · 3-amal (aynan)', 'B · действие 3 (дословно)')}</div>
        <CodePanel file="sql" numbers={false} lines={AIQ_B_3} />
        <div style={{ fontSize: 13.5, color: T.ink2 }}>«Qaysi kolonka ekani aniq emas. Jadvalda faqat id, name, price, stock bor…»</div>
      </div>
      <div className="mk-light" style={{ gridColumn: '1 / -1', padding: 12, fontSize: 14, lineHeight: 1.5 }}>{t(<><b>Topshiriq:</b> Kolonka — mahsulot, qatorni o'chirish → <code>DELETE … WHERE</code>. <b style={{ color: T.accent }}>AI:</b> <code>ALTER TABLE … DROP COLUMN</code> — jadval tuzilishini o'zgartiradi. Ustun bo'lsa — hamma qatordagi qiymat o'chadi, so'roqsiz (sinab ko'rildi: <code>DROP COLUMN stock</code> → <code>ALTER TABLE</code>).</>, <><b>Задание:</b> Kolonka — товар, удалить строку → <code>DELETE … WHERE</code>. <b style={{ color: T.accent }}>ИИ:</b> <code>ALTER TABLE … DROP COLUMN</code> — меняет структуру таблицы. Если колонка есть — значение пропадёт во всех строках, без вопроса (проверено: <code>DROP COLUMN stock</code> → <code>ALTER TABLE</code>).</>)}</div>
    </div>}
    {beat >= 3 && <div className="mk-light" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("Bazada · haqiqiy PostgreSQL 18 (aynan javoblar)", 'В базе · настоящий PostgreSQL 18 (дословные ответы)')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1.2fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t('Amal', 'Действие')}</span><span>{t("A · nomlar almashtirildi¹", 'A · имена заменены¹')}</span><span>{t('B · butun javob', 'B · весь ответ')}</span></div>
      {AIQ_ROWS.map(([q, a, b]) => <div key={q.uz} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1.2fr', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13.5 }}>{tlq(q)}</span><AiqCell c={a} /><AiqCell c={b} />
      </div>)}
      <div style={{ fontSize: 12.5, color: T.ink3 }}>{t("¹ A o'zi yozgan: «Haqiqiy nomlar boshqacha bo'lsa, ularni almashtiring» — mahsulotlar → products, nomi → name, narxi → price, soni → stock.", '¹ A сам написал: «если настоящие имена другие, замените их» — mahsulotlar → products, nomi → name, narxi → price, soni → stock.')}</div>
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI yozgan SQL'ni tekshirish:</b> fe'l — ko'rish <code>SELECT</code> · o'zgartirish <code>UPDATE</code> · o'chirish <code>DELETE</code> · qo'shish <code>INSERT</code> · nomlar — <code>\d products</code> bilan · javobdagi son · oxirida <code>SELECT *</code>. <code>ALTER</code> / <code>DROP</code> — topshiriqda so'ralmagan bo'lsa, yurgizmang.</>, <><b>Проверка SQL от ИИ:</b> глагол — посмотреть <code>SELECT</code> · изменить <code>UPDATE</code> · удалить <code>DELETE</code> · добавить <code>INSERT</code> · имена — по <code>\d products</code> · число в ответе · в конце <code>SELECT *</code>. <code>ALTER</code> / <code>DROP</code> — если в задании не просили, не запускайте.</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 5: A yozgan SQL (nomlar almashtirilgan) — Kolonka o'chmadi. Haqiqiy: ai-pg2/A-oddiy-nomlar/sorovlar.sql, natija.txt ---
const LCAIQ_LINES = sql(String.raw`
SELECT * FROM products WHERE price < 100000;
-- Avval tekshiring, nechta qator chiqishini ko'ring:
SELECT * FROM products WHERE name ILIKE '%quloqchin%';
-- Keyin yangilang:
UPDATE products SET price = 90000 WHERE name ILIKE '%quloqchin%';
ALTER TABLE products DROP COLUMN kolonka;
INSERT INTO products (name, price, stock) VALUES ('Monitor', 1500000, 3);`).map((l, i) => ({ ...l, n: i + 1 }));
const LCAIQ_FIXED = [
  ...LCAIQ_LINES.slice(0, 5),
  { ...LCAIQ_LINES[5], gone: true },
  { h: sqlLine("DELETE FROM products WHERE name = 'Kolonka';"), n: 6, neu: true },
  LCAIQ_LINES[6],
];
const LCAIQ_AFTER = psql(String.raw`
shop=# DELETE FROM products WHERE name = 'Kolonka';
DELETE 1
shop=# SELECT * FROM products ORDER BY id;
 id |    name    |  price  | stock
----+------------+---------+-------
  1 | Klaviatura |  120000 |     8
  2 | Sichqoncha |   75000 |    15
  3 | Quloqchin  |   90000 |     5
  5 | Monitor    | 1500000 |     3
(4 rows)`);
// chap ustun 1280×720 ga sig'sin: natijaning faqat kerakli qatorlari (to'liq — ai-pg2/A-oddiy-nomlar/natija.txt)
const LCAIQ_PRE = (tag) => '<pre class="pg-doc er" style="margin-top:12px;font-size:12px">' + escH(String.raw`shop=# SELECT * FROM products ORDER BY id;
 id |    name    |  price  | stock
 …
  4 | Kolonka    |   50000 |    10   ← ${tag}
  5 | Monitor    | 1500000 |     3`) + '</pre>';
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr xato?', 'Проверка · 5 / 5 — какая строка с ошибкой?')}
    title={t("AI yozgan SQL: to'rt amal, lekin Kolonka joyida qoldi", 'SQL от ИИ: четыре действия, но Kolonka осталась на месте')}
    task={t("Topshiriq: arzonlar · Quloqchin 90 000 · <b>Kolonkani (mahsulot) o'chirish</b> · Monitor qo'shish. A ning SQL'i, nomlari AI aytganidek almashtirilgan. Yakunda Kolonka joyida. <b>Topshiriqni bajarmagan satrni bosing.</b>", 'Задание: дешёвые · Quloqchin 90 000 · <b>удалить Kolonka (товар)</b> · добавить Monitor. SQL от A, имена заменены, как советовал ИИ. В итоге Kolonka на месте. <b>Нажмите на строку, которая не выполнила задание.</b>')
      + t(LCAIQ_PRE("o'chmadi"), LCAIQ_PRE('не удалена'))}
    q={t("Beshinchi, oxirgi tekshiruv. Bu birinchi AI yozgan SQL, nomlari haqiqiysiga almashtirilgan. To'rt amal berilgan edi, yakunda esa kolonka joyida qoldi. Qaysi satr kolonkani o'chirish topshirig'ini bajarmadi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это SQL первого ИИ, имена заменены на настоящие. Было дано четыре действия, а в итоге kolonka осталась на месте. Какая строка не выполнила задание удалить kolonka? Нажмите на эту строку.')}
    file={t('psql — shop · A yozgan SQL (nomlar almashtirilgan)', 'psql — shop · SQL от A (имена заменены)')} lines={LCAIQ_LINES} target={5}
    fixed={LCAIQ_FIXED} fixedExtra={[{ file: t("psql — shop · tuzatilgandan keyin (haqiqiy)", 'psql — shop · после исправления (настоящий)'), lines: LCAIQ_AFTER }]}
    ok={t("To'g'ri. Oltinchi satr: alter table products drop column kolonka. Topshiriq kolonka degan mahsulotni o'chirish edi, AI esa kolonka degan ustunni o'chirmoqchi bo'ldi. Bunday ustun yo'qligi uchun baza xato berdi va hech narsa o'chmadi. Ustun bo'lganida esa hamma qatordagi qiymat so'roqsiz o'chardi, buni sinab ko'rdik. Tuzatish: delete from products, where name kolonka. Bazada delete bir, kolonka o'chdi.", 'Верно. Шестая строка: alter table products drop column kolonka. Задание было удалить товар kolonka, а ИИ хотел удалить колонку kolonka. Такой колонки нет, поэтому база выдала ошибку и ничего не удалилось. А будь такая колонка, значение во всех строках пропало бы без вопроса, мы это проверили. Исправление: delete from products, where name kolonka. В базе delete один, kolonka удалена.')}
    okShort={t("6-satr: DROP COLUMN — mahsulot emas, ustun o'chiriladi; ustun yo'q → ERROR. Tuzatildi: DELETE FROM products WHERE name = 'Kolonka'; → DELETE 1 (sinab ko'rilgan).", "Строка 6: DROP COLUMN — удаляется колонка, а не товар; колонки нет → ERROR. Исправлено: DELETE FROM products WHERE name = 'Kolonka'; → DELETE 1 (проверено).")}
    hint={t("O'chirish — qaysi CRUD buyrug'i? Har satrning birinchi so'ziga qarang: qaysi biri qatorni emas, jadvalni o'zgartiradi?", 'Удаление — какая команда CRUD? Посмотрите на первое слово каждой строки: какая меняет не строку, а таблицу?')} />;
}

// --- RU: 6-bosqich · AI yozgan SQL (show = text) ---
const rsQ = (key, text) => ({ key, text, show: text });
ru(S_PG2AI, {
  kicker: 'Этап 6 · SQL от ИИ', title: 'SQL от ИИ в базе: четыре действия, два задания — Kolonka не удалена',
  segments: {
    a: rsQ('Четыре действия из практики ученика дали настоящему ИИ: <b>простыми словами</b> и <b>со структурой таблицы</b>', 'В m4-06 ученик говорит ИИ простыми словами, а ИИ пишет SQL. Мы тоже дали настоящему ИИ, Claude Haiku, четыре действия: показать дешёвые товары, изменить цену quloqchin, удалить kolonka и добавить monitor. Левому не сказали структуру таблицы, правому сказали.'),
    b: rsQ('A <b>придумал</b> имя таблицы — все пять команд с одной ошибкой', 'Первый ИИ не знал структуру таблицы и придумал имена: mahsulotlar, nomi, narxi. А в базе products. Все пять команд дали одну ошибку: такой таблицы нет. Это настоящий вид ошибки ИИ из урока ученика: там product, здесь mahsulotlar.'),
    c: rsQ('«Удалить Kolonka» — оба ИИ поняли это как <b>колонку таблицы</b>', 'Самое важное — третье действие. В нашем магазине kolonka — это товар. Оба ИИ поняли его как колонку таблицы. A написал alter table drop column, который удаляет колонку. B, хотя знал структуру таблицы, ответил: неясно, какая колонка, и дал шаблон. Задание было удалить строку, то есть delete.'),
    d: rsQ('В базе: в обоих <b>Kolonka на месте</b>, у B <b>не добавился и Monitor</b>', 'Теперь результат в базе. Имена A мы, как он сам советовал, заменили на настоящие: цена изменилась, monitor добавлен, а kolonka осталась. Ответ B запустили целиком: цена верно изменилась внутри begin и commit, но ошибка в шаблоне сломала транзакцию, и monitor тоже не добавился.'),
    e: rsQ('Вывод: команду ИИ проверяйте <b>глаголом, именем и числом</b>', 'Вывод. SQL от ИИ проверяйте по трём вещам. Глагол соответствует заданию: посмотреть — select, изменить — update, удалить — delete, добавить — insert. Имя таблицы и колонок совпадает с backslash d. Число в ответе такое, как вы ждали. В конце посмотрите всю таблицу через select со звёздочкой.'),
  },
});
