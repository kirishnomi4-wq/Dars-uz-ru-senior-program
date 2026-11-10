// PG-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['CRUD в терминале', 'Транзакция: безопасная проверка и атомарное дело', 'База охраняет', 'Из Express в базу', 'Ломаем и чиним', 'Подготовка к классу'] },
};
ru(CRUD, [[null, null, 'создать', null, null, null, null, null], [null, null, 'прочитать', null, null, null, null, null], [null, null, 'изменить', null, null, null, null, null], [null, null, 'удалить', null, null, null, null, null]]);
RU_S.MG3 = `await mongoose.connect('mongodb://localhost/shop')
базы: admin · config · local          (shop ещё нет)
await Product.create([ …4 шт… ])         → 4 документа
базы: admin · config · local · shop`;
ru(PAGE6, [[null, 'Klaviatura · 120000 · 8 — первая копия', null], null, [null, 'Quloqchin — удалена (экран 5)', null], null, [null, 'Klaviatura · 99000 · 8 — копия, записанная при смене цены', null], [null, 'Klaviatura · 99000 · 7 — текущая строка', null]]);
ru(STATES10, [[null, 'обычное — каждая команда сохраняется сразу (autocommit)'], [null, 'транзакция открыта — изменения видны только в этом сеансе'], [null, 'была ошибка (aborted) — только ROLLBACK']]);
ru(RULES14, [null, null, null, null, null, null, [null, 'CHECK (stock >= 0) — экран 11', null], null, [null, 'product_id REFERENCES products(id) — экран 11', null]]);
ru(CONN24, [
  { h: 'Неверный пароль', fix: 'пароль, заданный при установке' },
  { h: 'Пароль пустой (process.env не прочитан)', fix: 'переменная пароля пустая' },
  { h: 'Неверное имя базы', fix: 'точное имя через \\l: car_rental' },
  { h: 'PostgreSQL выключен', code: '— (сервер остановлен)', fix: 'console.error(err) → ECONNREFUSED → запустите PostgreSQL' },
]);
ru(CLS28, [
  { s: '21 экран', t: 'Запросы PostgreSQL — CRUD + с AI', d: ['магазин кнопками: INSERT · SELECT · WHERE · UPDATE · DELETE', 'таблица — ровно та products, что вы создали сегодня', 'практика: настоящий терминал PostgreSQL или VS Code + AI — свой магазин'] },
  { s: '9 экранов', t: 'Практика: Backend CRUD — AvtoIjara', d: ['таблица cars — вручную в терминале', 'server.js — от Gemini, проверка в Postman', 'найти ошибку AI: price → daily_price'] },
]);
ru(ADD28, [['число в ответе (UPDATE 1 / 0)', 'блок CRUD m4-06'], ['без WHERE — на проекторе BEGIN … ROLLBACK', 'm4-06 UPDATE/DELETE'], ['ORDER BY — вопрос «место изменилось»', 'm4-06 SELECT'], ['апостроф \'\', совет про NOT NULL', 'практика m4-06 (свой магазин)'], ['и HINT ошибается', 'блок ошибки AI в m4-06'], ['Четыре отличия: текст ошибки короткий · код Gemini разный · is_rented: null · порт занят, а «работает»', null]]);
ru(PRE28, ['На каждом компьютере открывается терминал PostgreSQL и установлен Postman', 'Пароль класса всем известен', 'Правило: один проект — один терминал', 'Время: в m4-06 из 90 минут 25 на практику · в m4-08 40 на сервер и Postman']);
ru(STUMBLE29, [
  ['Имя таблицы/колонки', null, 'сравнить с \\d таблица'],
  ['Апостроф', null, null],
  ['Без WHERE', null, 'BEGIN … ROLLBACK; если удалено — INSERT заново'],
  ['Пароль/база', null, 'настройки Pool, пароль класса'],
  ['Пустая ошибка', null, 'console.error(err) → ECONNREFUSED → запустите PostgreSQL'],
  ['Не изменилось', 'ответ старый', 'второй терминал; Ctrl+C'],
]);
ru(QA29, [
  ['«Почему место товара изменилось?»', 'Нет ORDER BY — база пишет обновлённую строку на новое место (экран 6); ORDER BY id.'],
  ['«Что такое $1?»', 'значение передаётся отдельно, в текст SQL не попадает; пример 1 OR 1=1 (экран 20).'],
  ['«Postman обязателен?»', 'нет, любая программа, которая шлёт запросы; на уроке Postman, потому что удобно для класса.'],
  ['«В NestJS пишем так же?»', 'нет: в Nest Repository сам пишет эти запросы (find, save…). Не волнуйтесь: это полностью, с кодом, разберёте на следующих уроках курса для менторов.'],
  ['«SQL обязательно писать заглавными?»', 'нет, ключевые слова работают и строчными (проверили: select name, price from PRODUCTS сработал); заглавные — привычка, чтобы легче читать.'],
]);
ru(SUM31, [
  { t: 'CRUD = INSERT · SELECT · UPDATE · DELETE; число в ответе — сколько строк затронуто; RETURNING — сама строка; без ORDER BY порядок не гарантирован (ctid)' },
  { t: 'Транзакция: autocommit · BEGIN → только в вашем сеансе → COMMIT / ROLLBACK; !# — aborted, только ROLLBACK; две таблицы — одно дело — атомарно' },
  { t: 'База охраняет только записанное правило: NOT NULL, DEFAULT, UNIQUE, CHECK; в сообщении есть имя — сравните с \\d; апостроф \'\'' },
  { t: 'Express: Pool подключается на первом запросе и переиспользует соединение → pool.query(sql, [$1…]) → rows / rowCount → res.json; 200 · 201 · 404 · 500' },
  { t: '$1 — безопасность: приклеенный 1 OR 1=1 опустошил таблицу; ошибки сервера: имя колонки · express.json() · пароль/база на первом запросе · пустое сообщение → console.error(err) · второй сервер «работает»' },
  { t: 'Класс: практика m4-06 в настоящем psql; до m4-08 пароль, Postman, один терминал; шесть случаев и ответы на вопросы готовы' },
]);
ru(HOMEWORK31, [
  { t: 'Таблицы — schema.sql: products (NOT NULL имя и цена, CHECK (stock >= 0), DEFAULT 0), orders (REFERENCES products(id), CHECK (qty > 0), created_at DEFAULT now())' },
  { t: 'Сервер — server.js: GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), все значения через $1' },
  { t: 'Проверка — Postman: 4 запроса + несуществующий id → 200 · 201 · 200 · 200 · 404' },
  { t: 'Транзакция — psql: BEGIN → UPDATE … stock - 1 … RETURNING → INSERT INTO orders → COMMIT; потом нехватка остатка → ошибка CHECK → ROLLBACK — оба вывода в README' },
  { t: 'Сдача — выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе' },
]);
RU_S.SPOKEN = [['бэкслеша ', 'backslash '], ['Бэкслеш ', 'Backslash '], ['бэкслеш ', 'backslash ']];  // F-1109-01: ruscha ovoz → «Matn»da `\d products` kabi kod
RU_S.TITLE = 'CRUD-запросы и из Express в базу';
RU_S.COVER = ['Всего около 1 часа 20 минут: озвучка ~27 минут · четыре практики 45–55 минут · 4 проверки · самопроверка 8 вопросов. После экрана 13 можно сделать перерыв', 'Нужно: пройден урок PostgreSQL-1 · работающий PostgreSQL · Node.js 20+ · VS Code · Postman', 'Проекты: база shop (products, orders) и сервер AvtoIjara (car_rental, server.js)'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: CRUD, транзакция, Pool и ошибки сервера. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь ошибки из m4-06 и m4-08 будут вам в классе знакомы.';
RU_S.NEXT_T = 'Архитектура NestJS — Module, Controller, Service';
RU_S.NEXT_D = 'Как этот же CRUD из Express пишется в Nest и в каком порядке';
RU_S.FILE = 'postgresql-2-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['CRUD — четыре команды; <b>число в ответе</b> и RETURNING; без ORDER BY порядок не гарантирован', 'Первое: CRUD — четыре команды: insert, select, update и delete. Число в ответе говорит, сколько строк затронуто, а returning возвращает саму строку. Если не написан order by, порядок не гарантирован: база пишет обновлённую строку на новое место.'],
  b2: ['Транзакция: <b>BEGIN — только в вашем сеансе</b>, COMMIT или ROLLBACK; две таблицы — одно дело', 'Второе: обычно каждая команда сохраняется сразу. После begin изменения только в вашем сеансе, commit сохраняет, rollback отменяет. Если вышел восклицательный знак — только rollback. Команды одного дела — в одной транзакции: либо всё, либо ничего.'],
  b3: ['База охраняет <b>только записанное правило</b>; имя из сообщения сравните с \\d', 'Третье: база охраняет только записанное правило: not null, default, unique и check. В каждом сообщении есть имя таблицы или правила, сравните его с бэкслеш d. Апостроф пишется дважды.'],
  b4: ['Express: <b>Pool подключается на первом запросе</b> → pool.query → rows / rowCount → res.json', 'Четвёртое: путь из Express в базу. Pool настраивается один раз, подключается на первом запросе и переиспользует соединение. Pool query отправляет запрос, из результата берётся rows или rowcount, res json возвращает ответ. Статусы: двести, двести один, четыреста четыре, пятьсот.'],
  b5: ['<b>$1 — безопасность</b>; ошибки сервера: имя колонки, express.json, пароль, пустое сообщение, второй сервер', 'Пятое: значение от пользователя — всегда через доллар один, приклеенный текст опустошил всю таблицу. Ошибки сервера: имя колонки, express json, пароль и база — на первом запросе. Если сообщение пустое, дайте console error всю ошибку. Второй сервер тоже говорит «работает».'],
  b6: ['Класс: практика m4-06 <b>в настоящем psql</b>; до m4-08 пароль, Postman, один терминал', 'Шестое, для класса: практика m4-06 — в настоящем терминале PostgreSQL, PostgreSQL нужен на каждом компьютере. До m4-08 — пароль класса, Postman и правило одного терминала. Шесть случаев и ответы на вопросы учеников у вас готовы.'],
  hw: ['<b>Домашнее задание</b>: shop-api для своего магазина — две таблицы, четыре endpoint, README', 'Домашнее задание: shop api для своего магазина. В файле schema две таблицы: товары с not null и check stock больше или равно нулю, заказы с внешним ключом. В server js четыре endpoint, все значения через доллар один, если не найдено — четыреста четыре. В README на каждый endpoint один запрос и его ответ.'],
  hw2: ['В терминале <b>одна продажа и ошибка CHECK</b> — в README; ссылка на репозиторий — на платформу', 'В терминале сделайте одну продажу через begin, update, insert и commit, потом получите ошибку check при нехватке остатка: оба запишите в README. Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе. Пятьдесят–семьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: CRUD, транзакция, правила, ошибки и сервер — на одной странице', 'Внизу памятка на одну страницу: CRUD и число в ответе, состояния транзакции, правила базы, ошибки SQL и сервера, путь Express и подготовка к классу. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# PostgreSQL-2 — памятка ментора (CRUD, транзакция, Express)
## CRUD (psql) и число в ответе
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Число: 1 — как ожидали · 0 — WHERE ни к чему не подошёл (не ошибка) · большое число — WHERE неверный/его нет · RETURNING — сама изменённая строка
Нет ORDER BY — порядок как в файле (UPDATE пишет новую копию: ctid (0,5) → (0,6)) → ORDER BY id
## Транзакция
autocommit: каждая команда сразу · BEGIN → только в вашем сеансе (сеанс B видит старое значение) → COMMIT сохраняет / ROLLBACK отменяет · приглашение: =# обычное · =*# открыта · =!# ошибка (aborted) — только ROLLBACK, и COMMIT вернёт ROLLBACK
Атомарно: две таблицы — одно дело — UPDATE stock + INSERT orders в одном BEGIN … COMMIT; если CHECK отклонил — не сохранится ничего
## База охраняет
Правило не записано — не охраняет (строка без имени сохраняется). NOT NULL (сначала уберите пустые строки) · DEFAULT 0 · UNIQUE (name) → duplicate key value · CHECK (stock >= 0) · \\d products — всё в одном месте
## Ошибки SQL (в сообщении есть имя)
relation "product" / column "narx" (и HINT ошибается) → сравнить с \\d · 'arzon' → invalid input syntax for type integer · число колонок/значений → more target columns than expressions · апостроф → '' (O''yinchoq)
## Express → база
Pool: при создании не подключается, подключается на первом запросе, переиспользует соединение (3 запроса — один pid) · pool.query(sql, [значения]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Зачем $1: приклеенный '… WHERE id = ' + id и URL "1 OR 1=1" → удалены все строки (deleted: 3); с $1 → 500 invalid input syntax, таблица на месте
## Ошибки сервера
column "price" of relation "cars" does not exist → имя колонки в коде (\\d cars) · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → пароль · client password must be a string → пароль пустой (process.env) · database "…" does not exist → имя · {"error":""} → console.error(err) → ECONNREFUSED → запустите PostgreSQL
«Server … ishlayapti» — только про Express — ошибка базы на первом запросе · Порт занят: в Express 5 второй сервер тоже пишет «работает» и выходит без ошибки, отвечает старый → один терминал, Ctrl+C
## Подготовка к классу
m4-06 (21 экран): практика в настоящем терминале PostgreSQL — PostgreSQL на каждом компьютере; вы добавляете: число в ответе, BEGIN … ROLLBACK на проекторе, ORDER BY, совет про апостроф и NOT NULL, HINT тоже ошибается
m4-08 (9 экранов): пароль класса, Postman, один терминал; четыре отличия — текст ошибки короткий · код Gemini разный · is_rented null (нет DEFAULT) · порт занят, а «работает»
## Ваше домашнее задание (50–70 минут)
shop-api: schema.sql (products NOT NULL + CHECK, orders FK) + server.js (4 endpoint, $1, 404) + README (5 запросов и ответов, продажа BEGIN…COMMIT и ошибка CHECK) → GitHub → ссылка на репозиторий в домашнее задание на платформе`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari
ru(FORMULA15, [['Какая таблица?'], ['Какая колонка или правило?'], ['Какое значение?']]);
ru(STEPS18, [[null, 'подключается'], [null, 'запрос к базе'], [null, 'результат'], [null, 'ответ']]);
