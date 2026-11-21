
// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Mongo bilan solishtirish', "O'rnatish va ulanish", "Jadval va bog'lanish", 'JOIN', 'Ishonchlilik: oxirgi telefon', "O'quvchi darsini o'tish"];
const JOIN_OK = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM posts
blog-# JOIN users ON users.id = posts.user_id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
(3 rows)`);
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1, 2, 3] }, { hl: [4] }, { hl: [5] }, { hl: [] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — blog bazasi (BlogDb, parts/02d-pg.jsx): users ← posts, JOIN natijasi + reja
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 14 }}>
    <BlogDb join="inner" rules hl={{ users: [0], posts: [1] }} tag={t("Bugungi darsning rasmi — blog bazasi sizning kompyuteringizda", 'Картина урока — база blog на вашем компьютере')}
      read={['blog=#', 'SELECT users.username, posts.izoh FROM posts <span class="n1-k">JOIN</span> users ON users.id = posts.user_id;']} out={t('ali — Birinchi post · ali — Bugun Nest o\'rgandim · vali — Salom hammaga · (3 rows)', 'ali — Birinchi post · ali — Bugun Nest o\'rgandim · vali — Salom hammaga · (3 rows)')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>} />;
}

// ============================================================
//  2 · SQL va NoSQL: bitta ma'lumot — ikki shakl (F-1102-21)
//  Haqiqiy: manba/pg1-out/25-sqlnosql-mongo.txt (mongosh) · 26-sqlnosql-pg.txt (PostgreSQL 18)
// ============================================================
const SQL_ERR = psql(String.raw`
blog=# INSERT INTO users (username, shahar) VALUES ('sardor', 'Toshkent');
ERROR:  column "shahar" of relation "users" does not exist`);
const SQL_SEL = psql(String.raw`
blog=# SELECT username FROM users WHERE id = 2;
 username
----------
 vali
(1 row)`, { 1: { id: 'q' }, 4: { id: 'a' } });
const S2SQL = mkS(2, [{}, { mongo: true }, { mongo: true, pg: true }, { mongo: true, pg: true, sql: true }, { mongo: true, pg: true, sql: true, rule: true }]);
// F-1109-06: xulosa qadamida hujjat va jadval yashirilmaydi — moslik rang bilan ularning ustida (collection↔jadval, hujjat↔qator, maydon↔ustun)
function ScreenSqlNosql(p) {
  return <Lesson p={p} S={S2SQL} scene={({ seg, beat }) => <div className={'pg1-ms' + (seg.rule ? ' on' : '')} style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-card" style={{ borderColor: PG.mongo }}>
        <h5 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><i style={{ width: 10, height: 10, borderRadius: '50%', background: PG.mongo, display: 'inline-block' }} />MongoDB · NoSQL</h5>
        {seg.mongo ? <div style={{ display: 'grid', gap: 8, animation: 'mk-up .4s ease both' }}>
          <div className="pg-lab mc">{t('users — collection · 2 ta hujjat (document)', 'users — collection · 2 документа (document)')}</div>
          <Doc>{`{ _id: ObjectId('6ae8…e666'),\n  `}<span className="f">username</span>{`: 'ali' }`}</Doc>
          <Doc odd>{`{ _id: ObjectId('6ae8…e667'),\n  `}<span className="f">username</span>{`: 'vali',\n  shahar: 'Toshkent' }   ← ` + t("qo'shimcha maydon", 'дополнительное поле')}</Doc>
          <div style={{ fontSize: 13.5, color: T.ink2 }}>{t(<>Har yozuv — <b>hujjat</b>: jingalak qavs ichida <b>maydon: qiymat</b>. Shakli har xil bo'lishi mumkin.</>, <>Каждая запись — <b>документ</b>: в фигурных скобках <b>поле: значение</b>. Форма может быть разной.</>)}</div>
        </div> : <div className="pg-lab" style={{ margin: 0 }}>{t("ma'lumot — hujjat ko'rinishida", 'данные — в виде документа')}</div>}
      </div>
      <div className="mk-card" style={{ borderColor: PG.pg }}>
        <h5 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><i style={{ width: 10, height: 10, borderRadius: '50%', background: PG.pg, display: 'inline-block' }} />PostgreSQL · SQL</h5>
        {seg.pg ? <div style={{ display: 'grid', gap: 8, animation: 'mk-up .4s ease both' }}>
          <MiniTable name={t('users — jadval (table)', 'users — таблица (table)')} cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali']]} hlHead={beat === 2} hlRow={beat === 2 ? [0] : []} />
          <div style={{ fontSize: 13.5, color: T.ink2 }}>{t(<>Tepada — <b>ustunlar (column)</b>: id, username. Har yozuv — bitta <b>qator (row)</b>: 1 | ali.</>, <>Сверху — <b>колонки (column)</b>: id, username. Каждая запись — одна <b>строка (row)</b>: 1 | ali.</>)}</div>
          <Psql er title={t("psql — blog · shahar ustuni yo'q", 'psql — blog · колонки shahar нет')} lines={SQL_ERR} />
        </div> : <div className="pg-lab" style={{ margin: 0 }}>{t("ma'lumot — jadval ko'rinishida", 'данные — в виде таблицы')}</div>}
      </div>
    </div>
    {seg.sql && !seg.rule && <div style={{ animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">{t("SQL — jadvalga so'rov yozish tili", 'SQL — язык запросов к таблице')}</div>
      <Psql lines={SQL_SEL} focus={beat === 3 ? ['q', 'a'] : []} />
    </div>}
    {seg.rule && <div className="pg1-key" style={{ animation: 'mk-up .4s ease both' }}>
      <b>{t("Moslik", "Соответствие")}</b>
      <span><i style={{ background: '#DCFCE7', outline: '1.5px solid #15803D' }} />collection ↔ {t("jadval (table)", "таблица (table)")}</span>
      <span><i style={{ background: '#DBEAFE', outline: '1.5px solid #1D4ED8' }} />{t("hujjat (document) ↔ qator (row)", "документ (document) ↔ строка (row)")}</span>
      <span><i style={{ background: '#FFEDD5', outline: '1.5px solid #C2410C' }} />{t("maydon (field) ↔ ustun (column)", "поле (field) ↔ колонка (column)")}</span>
    </div>}
  </div>} />;
}

// ============================================================
//  3 · Siz bilgan Mongoose
// ============================================================
const BLOG_JS = js(String.raw`
const User = mongoose.model('User', new mongoose.Schema({ username: String }));
const Post = mongoose.model('Post', new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  izoh: String
}));

await Post.find().populate('author');`, { 1: { id: 'm' }, 2: { id: 'm' }, 3: { id: 'ref' }, 4: { id: 'm' }, 5: { id: 'm' }, 7: { id: 'pop' } });
const POP_OUT = psql(String.raw`
$ node blog.js
[ { "_id": "6ae62798721f5b830b674729",
    "author": { "_id": "6ae62798721f5b830b674728", "username": "ali", "__v": 0 },
    "izoh": "Birinchi post", "__v": 0 } ]`, { 3: { id: 'au' } });
const S2 = mkS(3, [{ focus: ['m', 'ref'] }, { focus: ['ref'] }, { focus: ['pop'], out: true }, { focus: [], out: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <Ide files={MKCFG.files} active="blog.js">
    <CodePanel file="blog.js" lines={BLOG_JS} focus={seg.focus} />
    <div className="mk-tag" style={{ margin: 0 }}>{t('Sinov skriptidan, qisqartirilgan · MongoDB 6.0 · Mongoose 9.11', 'Из тестового скрипта, сокращено · MongoDB 6.0 · Mongoose 9.11')}</div>
    {seg.out && <Psql title={t("terminal", "терминал")} lines={POP_OUT} focus={beat === 2 ? ['au'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule">{t(<><b>ref</b> — bog'lanish (post ichida faqat id) · <b>populate</b> — birlashtirish (so'rov paytida id o'rniga hujjat)</>, <><b>ref</b> — связь (в посте только id) · <b>populate</b> — объединение (во время запроса вместо id подставляется документ)</>)}</div></Block>
  </Ide>} />;
}

// ============================================================
//  4 · Mongo xato bermaydigan joylar
// ============================================================
const BLOG3_JS = js(`
const User = mongoose.model('User', new mongoose.Schema({ username: String }));
const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    izoh: String,
  }),
);

// 1-tajriba: bazada yo'q foydalanuvchining id'si bilan post
await Post.create({
  author: new mongoose.Types.ObjectId(),
  izoh: "Muallifi yo'q post",
});
await Post.find().populate('author');

// 2-tajriba: Mongoose sxemasini chetlab, kolleksiyaning o'ziga
await mongoose.connection.db
  .collection('posts')
  .insertOne({ muallif: 'vali', matn: 'Salom', like: 5 });`, { 5: { id: 'ref' }, 10: { at: 1 }, 11: { at: 1, neu: true, id: 'e1' }, 12: { at: 1, neu: true, id: 'e1' }, 13: { at: 1, neu: true, id: 'e1' }, 14: { at: 1, neu: true, id: 'e1' }, 15: { at: 1, id: 'e1' }, 17: { at: 2 }, 18: { at: 2, neu: true, id: 'e2' }, 19: { at: 2, neu: true, id: 'e2' }, 20: { at: 2, neu: true, id: 'e2' } });
const NULL_OUT = psql(String.raw`
$ node blog.js
… { "author": { "username": "ali" }, "izoh": "Birinchi post" },
  { "_id": "6ae62798721f5b830b67472b", "author": null, "izoh": "Muallifi yo'q post", "__v": 0 } ]`, { 3: { id: 'nl' } });
const S3 = mkS(4, [{ focus: ['ref'] }, { focus: ['e1'] }, { focus: ['e2'] }, { focus: [] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <Ide files={MKCFG.files} active="blog.js">
    <CodePanel file="blog.js" lines={beat >= 3 ? BLOG3_JS.slice(9).map((l, k) => ({ ...l, n: 10 + k })) : BLOG3_JS} beat={beat} focus={seg.focus} />
    {beat === 1 && <Psql title={t("terminal — xato yo'q", 'терминал — ошибки нет')} lines={NULL_OUT} focus={['nl']} />}
    {beat === 2 && <div style={{ display: 'grid', gap: 6 }}>
      <div className="pg-lab">{t(<>posts kolleksiyasi — uch hujjat <span className="tm">xato yo'q</span></>, <>коллекция posts — три документа <span className="tm">ошибки нет</span></>)}</div>
      <div className="pg-three">
        <Doc>{`{ "author": "…a728",\n  "izoh": "Birinchi post" }`}</Doc>
        <Doc>{`{ "author": "…a72a",\n  "izoh": "Muallifi yo'q post" }`}</Doc>
        <Doc odd>{`{ "muallif": "vali",\n  "matn": "Salom",\n  "like": 5 }`}</Doc>
      </div>
    </div>}
    <Block at={3} beat={beat}><div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />MongoDB</h5><div style={{ fontSize: 14 }}>{t(<>Qoida — <b>kodda</b> (Mongoose sxemasi). Kodni chetlab yozilgan hujjat ham qabul qilinadi.</>, <>Правило — <b>в коде</b> (схема Mongoose). Документ, записанный в обход кода, тоже принимается.</>)}</div></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><div style={{ fontSize: 14 }}>{t(<>Qoida — <b>jadvalda</b>: <code>NOT NULL</code>, <code>REFERENCES</code>… Uni hech kim chetlab o'ta olmaydi.</>, <>Правило — <b>в таблице</b>: <code>NOT NULL</code>, <code>REFERENCES</code>… Обойти его не может никто.</>)}</div></div>
    </div></Block>
  </Ide>} />;
}

// ============================================================
//  5 · Mongo ↔ PostgreSQL lug'ati
// ============================================================
const DICT4 = [
  ['baza', 'baza (database) — \\l'], ['collection posts', 'jadval (table) posts'], ['document', 'qator (row)'], ['maydon (field)', 'ustun (column) — turi bilan: INT, TEXT'],
  ['_id (ObjectId)', 'id SERIAL PRIMARY KEY — 1, 2, 3'], ["ref: 'User'", 'REFERENCES users(id) — tashqi kalit'], ['populate()', 'JOIN'],
  ['Schema — kodda', 'CREATE TABLE — bazada'], ['required: true · unique: true', 'NOT NULL · UNIQUE'], ['mongosh', 'psql'],
  // F-1103-09 (03.11): buyruq juftlari — mentor bilgan Mongoose buyrug'i yonida PostgreSQL buyrug'i (haqiqiy: pg2-out/v2d-mongoose.txt)
  ['Post.create({ … })', 'INSERT INTO posts (…) VALUES (…)'], ['Post.find({ author: id })', 'SELECT * FROM posts WHERE user_id = 1'],
  ['Post.updateOne({ _id }, { izoh })', 'UPDATE posts SET izoh = … WHERE id = 1'], ['Post.deleteOne({ _id })', 'DELETE FROM posts WHERE id = 1'],
];
const POSTS_DDL = sql(String.raw`
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  izoh TEXT NOT NULL
);`, { 1: { id: 'ddl' }, 2: { id: 'pk' }, 3: { id: 'fk' }, 4: { id: 'col' }, 5: { id: 'ddl' } });
const S4 = mkS(5, [{ rows: [], focus: [] }, { rows: [0, 1, 2, 3], focus: ['col'] }, { rows: [4, 5, 6], focus: ['pk', 'fk'] }, { rows: [7, 8, 9], focus: ['ddl', 'fk', 'col'] }, { rows: [10, 11, 12, 13], focus: [] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div className="pg-two" style={{ gridTemplateColumns: seg.rows.includes(10) ? '1fr' : 'minmax(0,1.5fr) minmax(0,1fr)' }}>
    <div className="mk-light" style={{ padding: 12 }}>
      <table className="pg-dict"><thead><tr><th style={{ color: PG.mongo }}>MongoDB (Mongoose)</th><th /><th style={{ color: PG.pg }}>PostgreSQL</th></tr></thead><tbody>
        {DICT4.map(([a, b], i) => ((seg.rows.includes(10) && !seg.rows.includes(i)) || (!seg.rows.includes(10) && i >= 10)) ? null : /* F-1120-02: buyruq qatorlari (10–13) faqat xulosada — 1280 da sahna sig'sin */ <tr key={a} className={seg.rows.includes(i) ? 'hl' : (seg.rows.length ? 'dim' : '')}><td><code>{a}</code></td><td>↔</td><td><code>{b}</code></td></tr>)}
      </tbody></table>
    </div>
    <div style={{ display: 'grid', gap: 10 }}>
      {!seg.rows.includes(10) && <Psql title="CREATE TABLE posts" lines={POSTS_DDL} focus={seg.focus} />}
      {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — qoida jadvalning o'zida, populate o'rnida JOIN */}
      {seg.rows.includes(10) ? <div className="mk-light" style={{ padding: 12 }}><BlogDb rules fk join="inner" compact max={1} tag={t("Mongo'da qoida kodda — PostgreSQL'da jadvalning o'zida; populate o'rnida JOIN", 'В Mongo правило в коде — в PostgreSQL в самой таблице; вместо populate — JOIN')} /></div>
        : <div className="mk-rule">{t(<>Mongo'da qoida <b>kodda</b> (Mongoose sxemasi), PostgreSQL'da <b>jadvalda</b>. O'quvchi «populate qani?» desa — <b>JOIN</b>.</>, <>В Mongo правило <b>в коде</b> (схема Mongoose), в PostgreSQL — <b>в таблице</b>. Если ученик спросит «где populate?» — <b>JOIN</b>.</>)}</div>}
    </div>
  </div>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — populate ning jufti
// ============================================================
function Screen5(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>{t("JOIN — so'rov paytida ikki jadval bitta javobda (populate kabi)", 'JOIN — во время запроса две таблицы в одном ответе (как populate)')}</div>
      <Psql lines={JOIN_OK} />
      <div className="mk-rule">{t(<><code>REFERENCES</code> — <b>ref</b>ning jufti: bog'lanishni belgilaydi va qo'riqlaydi, javobga hech narsa qo'shmaydi.</>, <><code>REFERENCES</code> — пара для <b>ref</b>: задаёт и охраняет связь, в ответ ничего не добавляет.</>)}</div>
    </div>} />;
}

// ============================================================
//  7 · Windows: rasmiy o'rnatuvchi
// ============================================================
const S6 = mkS(7, [{ v: 'dl' }, { v: 'comp' }, { v: 'pw' }, { v: 'path' }, { v: 'sum' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'dl' && <Win title="postgresql.org/download/windows/">
      <h4>Download PostgreSQL · Windows</h4>
      <div style={{ fontSize: 14, marginBottom: 8 }}>Interactive installer by <b>EDB</b> → Download the installer</div>
      <div className="pg-chk"><div style={{ borderColor: T.accent }}><b>18</b>{t('eng yangi barqaror versiya — shuni tanlang', 'последняя стабильная версия — выбирайте её')}</div><div className="off"><b>19</b>{t('hali RC (sinov versiyasi), 31.10.2026', 'пока RC (тестовая версия), 31.10.2026')}</div></div>
    </Win>}
    {seg.v === 'comp' && <Win title="Setup — PostgreSQL 18 · Select Components">
      <h4>Select Components</h4>
      <div className="pg-chk">
        <div><b>☑</b>{t("PostgreSQL Server — bazaning o'zi", 'PostgreSQL Server — сама база')}</div>
        <div><b>☑</b>{t('pgAdmin 4 — grafik oyna (ixtiyoriy)', 'pgAdmin 4 — графическое окно (по желанию)')}</div>
        <div className="off"><b>☐</b>{t('Stack Builder — kerak emas', 'Stack Builder — не нужен')}</div>
        <div style={{ borderColor: T.accent }}><b>☑</b>{t(<>Command Line Tools — psql shu yerda, <b>albatta kerak</b></>, <>Command Line Tools — здесь psql, <b>обязательно нужен</b></>)}</div>
      </div>
    </Win>}
    {seg.v === 'pw' && <Win title="Setup — PostgreSQL 18 · Password / Port" hl>
      <h4>Password</h4>
      <div className="pg-field"><span>Password</span><span>••••••••</span></div>
      <div className="pg-field"><span>Retype password</span><span>••••••••</span></div>
      <div className="pg-field"><span>Port</span><span>5432</span></div>
      <div className="n2-warn" style={{ marginTop: 10, fontSize: 14 }}>{t(<><b>Parolni yozib qo'ying</b> — o'quvchi keyingi darslarda <code>psql</code>da va loyiha sozlamasida aynan shu parolni so'raydi.</>, <><b>Запишите пароль</b> — на следующих уроках ученик спросит именно этот пароль в <code>psql</code> и в настройках проекта.</>)}</div>
    </Win>}
    {seg.v === 'path' && <Win title="Environment Variables → Path → Edit">
      <h4>Edit environment variable · Path</h4>
      <div className="pg-chk"><div>C:\Windows\system32</div><div>C:\Program Files\nodejs\</div><div style={{ borderColor: T.green, background: '#E3F5EC' }}><b>+</b><code>C:\Program Files\PostgreSQL\18\bin</code></div></div>
      <div style={{ fontSize: 13.5, color: T.ink2, marginTop: 8 }}>{t(<>Keyin terminalni <b>yangidan</b> oching. Muqobil: Start → <b>SQL Shell (psql)</b>.</>, <>Потом откройте терминал <b>заново</b>. Альтернатива: Пуск → <b>SQL Shell (psql)</b>.</>)}</div>
    </Win>}
    {seg.v === 'sum' && <div className="mk-light"><div className="mk-tag">{t("Windows — o'rnatgandan keyin uch narsa", 'Windows — три вещи после установки')}</div>
      <div className="mk-plan"><div><b>01</b><span>{t("Parol yozib qo'yilgan", 'Пароль записан')}</span></div><div><b>02</b><span>{t('Port', 'Порт')} <code>5432</code></span></div><div className="hl"><b>03</b><span><code>…\PostgreSQL\18\bin</code> {t(<>— Path'da (aks holda <code>psql</code> tanilmaydi)</>, <>— в Path (иначе <code>psql</code> не распознаётся)</>)}</span></div></div>
    </div>}
    <div className="mk-tag" style={{ margin: 0, color: T.yellow }}>{t("Maket — rasmiy hujjatdan (postgresql.org, EDB qo'llanmasi); bu kompyuterda sinalmagan", 'Макет — по официальной документации (postgresql.org, руководство EDB); на этом компьютере не проверялось')}</div>
  </>} />;
}

// ============================================================
//  8 · macOS: Postgres.app va Homebrew tuzog'i
// ============================================================
const APP_OUT = psql(String.raw`
$ psql -U postgres -c "SELECT current_user;"
 current_user
--------------
 postgres
(1 row)`);
const MAC_PATH = psql(String.raw`
$ sudo mkdir -p /etc/paths.d &&
  echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
Password:
/Applications/Postgres.app/Contents/Versions/latest/bin`);
const BREW_OUT = psql(String.raw`
$ psql -U postgres
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  role "postgres" does not exist
$ createuser -s postgres
$ psql -U postgres -c "SELECT current_user;"
 current_user
--------------
 postgres
(1 row)`, { 2: { id: 'er' }, 3: { id: 'fix', neu: true } });
const S7 = mkS(8, [{ v: 'app' }, { v: 'init' }, { v: 'path' }, { v: 'brew' }, { v: 'sum' }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {(seg.v === 'app' || seg.v === 'init') && <Win os="mac" title="Postgres.app" hl={seg.v === 'init'}>
      {seg.v === 'app'
        ? <><h4>postgresapp.com → Download</h4><div style={{ fontSize: 14 }}>{t(<>Yuklab olingan <b>Postgres.app</b> → <b>Applications</b> papkasiga ko'chiriladi → ochiladi</>, <>Скачанный <b>Postgres.app</b> → переносится в папку <b>Applications</b> → открывается</>)}</div></>
        : <><h4>Postgres.app</h4><div style={{ fontSize: 14 }}>Server · Port <code>5432</code> · <span style={{ color: T.green, fontWeight: 700 }}>Running</span></div><span className="pg-btn">Initialize</span></>}
    </Win>}
    {seg.v === 'init' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Haqiqiy: Postgres.app kabi sozlangan server (parol so'ralmaydi)", 'Реально: сервер, настроенный как Postgres.app (пароль не спрашивается)')}</div><Psql title={t("terminal", "терминал")} lines={APP_OUT} /></>}
    {seg.v === 'path' && <><Psql title={t("terminal — rasmiy PATH buyrug'i", 'терминал — официальная команда для PATH')} lines={MAC_PATH} /><div className="mk-tag" style={{ margin: 0, color: T.yellow }}>{t('⚠ rasmiy hujjatdan (postgresapp.com), bu kompyuterda sinalmagan · keyin terminalni yopib, yangidan oching', '⚠ по официальной документации (postgresapp.com), на этом компьютере не проверялось · потом закройте терминал и откройте заново')}</div></>}
    {seg.v === 'brew' && <><div className="mk-tag" style={{ margin: 0 }}>{t('Haqiqiy: Homebrew kabi sozlangan server (superuser — kompyuter foydalanuvchisi)', 'Реально: сервер, настроенный как Homebrew (superuser — пользователь компьютера)')}</div><Psql title={t("terminal — Homebrew", "терминал — Homebrew")} lines={BREW_OUT} focus={['er', 'fix']} /></>}
    {seg.v === 'sum' && <div className="mk-light"><div className="mk-tag">{t('macOS — xulosa', 'macOS — вывод')}</div>
      <div className="mk-plan"><div><b>01</b><span>Postgres.app → Applications → <b>Initialize</b></span></div><div><b>02</b><span>{t("PATH buyrug'i, terminal yangidan", 'Команда для PATH, терминал заново')}</span></div><div className="hl"><b>03</b><span>{t(<>Homebrew bo'lsa: <code>createuser -s postgres</code> — o'quvchi darslari <code>psql -U postgres</code> kutadi</>, <>Если Homebrew: <code>createuser -s postgres</code> — уроки ученика ожидают <code>psql -U postgres</code></>)}</span></div></div>
    </div>}
  </>} />;
}

// ============================================================
//  9 · Birinchi ulanish: psql
// ============================================================
const FIRST8 = psql(String.raw`
$ psql -U postgres
Password for user postgres:
psql (18.4 (Debian 18.4-1+b1), server 17.2 (Debian 17.2-1+b2))
Type "help" for help.

postgres=# SELECT 1
postgres-# ;
 ?column?
----------
        1
(1 row)

postgres=# SELECT version();
 PostgreSQL 18.4 (Debian 18.4-1+b1) on x86_64-pc-linux-gnu, compiled by … 64-bit
(1 row)

postgres=# \l
   Name    |  Owner   | Encoding | …
-----------+----------+----------+
 postgres  | postgres | UTF8     |
 template0 | postgres | UTF8     |
 template1 | postgres | UTF8     |
(3 rows)

postgres=# \q`, mergeMeta(rng(1, 1, { at: 0 }), rng(2, 6, { at: 1 }), rng(7, 16, { at: 2 }), rng(17, 25, { at: 3 }), { 2: { id: 'pw' }, 6: { id: 'pr' }, 7: { id: 'semi' }, 13: { id: 'ver' }, 14: { id: 'ver' }, 17: { id: 'l' }, 21: { id: 'l' }, 22: { id: 'l' }, 23: { id: 'l' }, 25: { id: 'q' } }));
const S8 = mkS(9, [{ focus: [] }, { focus: ['pw', 'pr'] }, { focus: ['semi', 'ver'] }, { focus: ['l', 'q'] }, { focus: [] }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => <>
    <Psql title={t("terminal — psql", "терминал — psql")} lines={FIRST8} beat={beat} focus={seg.focus} />
    <Block at={2} beat={beat}><div className="mk-tag" style={{ margin: 0 }}>{t(<>Bu yerda Linux. Sizda <code>PostgreSQL 18…</code> dan keyin Windows yoki macOS yozuvi bo'ladi.</>, <>Здесь Linux. У вас после <code>PostgreSQL 18…</code> будет надпись Windows или macOS.</>)}</div></Block>
    <Block at={4} beat={beat}><div className="mk-rule">{t(<>Prompt — qaysi bazadasiz (<code>postgres=#</code>) · <code>-#</code> — davomini kutyapti · SQL — <b>nuqta-vergul</b> bilan · <code>\l</code> <code>\c</code> <code>\d</code> <code>\q</code> — usiz</>, <>Приглашение — в какой вы базе (<code>postgres=#</code>) · <code>-#</code> — ждёт продолжения · SQL — с <b>точкой с запятой</b> · <code>\l</code> <code>\c</code> <code>\d</code> <code>\q</code> — без неё</>)}</div></Block>
  </>} />;
}

// ============================================================
//  10 · Amaliyot 1 — o'rnating va ulaning
// ============================================================
const P1 = mkS(10, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "O'rnatish — Windows: postgresql.org → EDB installer 18 (Server · pgAdmin 4 · Command Line Tools; parol; port 5432) · Mac: postgresapp.com → Applications → Initialize", cmds: [], exp: "o'rnatuvchi tugadi / Postgres.app'da «Running»" },
  { t: "PATH — Windows: C:\\Program Files\\PostgreSQL\\18\\bin → Path, yangi terminal · Mac: rasmiy buyruq, yangi terminal", cmds: ['sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp', 'psql --version'], exp: 'psql (PostgreSQL) 18…' },
  { t: 'Ulanish', cmds: ['psql -U postgres'], exp: 'Windows: Password for user postgres: → postgres=# · Mac: darhol postgres=#' },
  { t: "Birinchi so'rov", cmds: ['SELECT version();', '\\l', '\\q'], exp: 'PostgreSQL 18… · 3 baza: postgres, template0, template1' },
];
const P1_TROUBLE = [
  ['FATAL:  password authentication failed for user "postgres"', "parol noto'g'ri: o'rnatishda yozgan parolingiz; klaviatura tilini (EN/RU) va katta harfni tekshiring"],
  ['Connection refused · Is the server running on that host and accepting TCP/IP connections?', "PostgreSQL ishlamayapti — PostgreSQL'ni ishga tushiring: Windows: Services → postgresql-x64-18 → Start ⚠ · Mac: Postgres.app → Start"],
  ['connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory', "Mac: Postgres.app ochilmagan yoki server to'xtagan — dasturni oching, Start"],
  ['FATAL:  role "postgres" does not exist', "Homebrew bilan o'rnatilgan — createuser -s postgres (8-ekran)"],
  ["'psql' is not recognized as an internal or external command ⚠ · zsh: command not found: psql ⚠", "PATH: 2-qadam, keyin terminalni yangidan oching; Windows'da vaqtincha Start → SQL Shell (psql)"],
  ['WARNING: Console code page (866) differs from Windows code page (1251) ⚠', "Windows ogohlantirishi: ishga xalaqit bermaydi, davom eting"],
  ['Prompt postgres-# bo\'lib qoldi', "nuqta-vergul unutilgan — ; yozib Enter"],
];
const P1_PROOF = { label: "Isbot: SELECT version(); natijasi — PostgreSQL so'zidan boshlab", placeholder: "natija qatorini shu yerga qo'ying", check: (v) => /^\s*PostgreSQL \d{2}/.test(v), wrong: "Natija «PostgreSQL» so'zi va versiya raqami bilan boshlanadi — terminaldan butun qatorni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }
