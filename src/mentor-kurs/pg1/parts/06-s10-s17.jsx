
// ============================================================
//  11 · blog bazasi va users jadvali
// ============================================================
const DB10 = psql(String.raw`
postgres=# CREATE DATABASE blog;
CREATE DATABASE
postgres=# \c blog
blog=# CREATE TABLE users (
blog(#   id SERIAL PRIMARY KEY,
blog(#   username TEXT NOT NULL UNIQUE
blog(# );
CREATE TABLE`, mergeMeta(rng(1, 3, { at: 1 }), rng(4, 8, { at: 2 }), { 3: { id: 'c' }, 4: { id: 'c' }, 5: { id: 'id' }, 6: { id: 'un' } }));
const ERR10 = psql(String.raw`
blog=# CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);
ERROR:  relation "users" already exists

blog=# CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
ERROR:  syntax error at or near "name"
LINE 1: CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
                                                 ^`, { 4: { id: 'se' }, 5: { id: 'se' }, 6: { id: 'se' }, 7: { id: 'se' } });
const FIX10 = psql(String.raw`
blog=# CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE`, { 1: { neu: true } });
const S10 = mkS(11, [{ focus: [] }, { focus: ['c'] }, { focus: ['id', 'un'] }, { err: true, focus: ['se'] }, { err: true, focus: [] }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg, beat }) => <>
    {beat === 0 && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi m4-03 amaliyotidagi namuna — qog'ozda</div>
      <div className="pg-two"><MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} /><MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} /></div>
    </div>}
    {beat >= 1 && !seg.err && <Psql title="psql" lines={DB10} beat={beat} focus={seg.focus} />}
    {seg.err && <><Psql title="psql — blog" er lines={ERR10} focus={seg.focus} /><Psql lines={FIX10} /></>}
    <Block at={4} beat={beat}><div className="mk-rule">Baza <b>oldin yaratiladi</b> (<code>CREATE DATABASE</code>), unga <code>\c</code> bilan o'tiladi · ustun turi va qoidalari jadval bilan birga · <code>syntax error</code> — <code>^</code> ko'rsatgan so'zdan <b>oldin</b> qarang</div></Block>
  </>} />;
}

// ============================================================
//  12 · posts va tashqi kalit
// ============================================================
const POSTS11 = psql(String.raw`
blog=# CREATE TABLE posts (
blog(#   id SERIAL PRIMARY KEY,
blog(#   user_id INT NOT NULL REFERENCES users(id),
blog(#   izoh TEXT NOT NULL
blog(# );
CREATE TABLE`, { 3: { id: 'fk' } });
const D11 = psql(String.raw`
blog=# \dt
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | posts | table | postgres
 public | users | table | postgres
(2 rows)

blog=# \d posts
 Column  |  Type   | Nullable |              Default
---------+---------+----------+-----------------------------------
 id      | integer | not null | nextval('posts_id_seq'::regclass)
 user_id | integer | not null |
 izoh    | text    | not null |
Foreign-key constraints:
    "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)`, { 14: { id: 'fk' }, 15: { id: 'fk' } });
const INS11 = psql(String.raw`
blog=# INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');
INSERT 0 3
blog=# INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');
INSERT 0 3`, { 2: { id: 'n' }, 4: { id: 'n' } });
const REL11 = psql(String.raw`
postgres=# SELECT * FROM posts;
ERROR:  relation "posts" does not exist
LINE 1: SELECT * FROM posts;
                      ^
postgres=# \c blog
blog=# SELECT * FROM posts;
 id | user_id |         izoh
----+---------+----------------------
  1 |       1 | Birinchi post
  2 |       1 | Bugun Nest o'rgandim
  3 |       2 | Salom hammaga
(3 rows)`, { 1: { id: 'pr' }, 2: { id: 'pr' }, 5: { id: 'fix', neu: true }, 6: { id: 'fix' } });
const S11 = mkS(12, [{ v: 'ddl', focus: ['fk'] }, { v: 'd', focus: ['fk'] }, { v: 'ins', focus: ['n'] }, { v: 'rel', focus: ['pr', 'fix'] }, { v: 'rel', focus: [] }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg, beat }) => <>
    {seg.v === 'ddl' && <Psql lines={POSTS11} focus={seg.focus} />}
    {seg.v === 'd' && <Psql lines={D11} focus={seg.focus} />}
    {seg.v === 'ins' && <><Psql lines={INS11} focus={seg.focus} /><div className="mk-tag" style={{ margin: 0 }}>SQL matnida apostrof ikki marta yoziladi: <code>o''rgandim</code></div>
      <div className="pg-two"><MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} hlRow={[2]} /><MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} hlCol={[1]} /></div></>}
    {seg.v === 'rel' && <Psql title="psql — qayta ochildi" lines={REL11} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule"><code>REFERENCES</code> bog'lanishni <b>bazaga</b> yozadi · <code>\d jadval</code> — tuzilish · <code>does not exist</code> — avval <b>prompt</b>dagi baza nomi</div></Block>
  </>} />;
}

// ============================================================
//  13 · Baza o'zi tekshiradi
// ============================================================
const E12 = [
  psql(String.raw`
blog=# INSERT INTO users (username) VALUES (NULL);
ERROR:  null value in column "username" of relation "users" violates not-null constraint
DETAIL:  Failing row contains (4, null).

blog=# INSERT INTO users (username) VALUES ('ali');
ERROR:  duplicate key value violates unique constraint "users_username_key"
DETAIL:  Key (username)=(ali) already exists.`),
  psql(String.raw`
blog=# INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');
ERROR:  insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"
DETAIL:  Key (user_id)=(99) is not present in table "users".`),
  psql(String.raw`
blog=# DELETE FROM users WHERE id = 1;
ERROR:  update or delete on table "users" violates foreign key constraint "posts_user_id_fkey" on table "posts"
DETAIL:  Key (id)=(1) is still referenced from table "posts".`),
];
// Xabarning uch bo'lagi: qaysi jadval · qaysi qoida · qaysi qiymat
const READ12 = [
  null,
  [['users', 'jadval'], ['not-null · unique', 'qoida'], ['(4, null) · (ali)', 'qiymat']],
  [['on table "posts"', 'jadval'], ['"posts_user_id_fkey"', 'qoida'], ['Key (user_id)=(99)', 'qiymat']],
  [['on table "users" … "posts"', 'jadval'], ['"posts_user_id_fkey"', 'qoida'], ['Key (id)=(1)', 'qiymat']],
];
const S12 = mkS(13, [{ e: -1 }, { e: 0 }, { e: 1 }, { e: 2 }, { e: 9 }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => <>
    <div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">Xabarni o'qish — uch savol</div>
      <div className="pg-three">{(READ12[seg.e === 9 ? 2 : beat] || [['qaysi jadval', 'jadval'], ['qaysi qoida', 'qoida'], ['qaysi qiymat (DETAIL)', 'qiymat']]).map(([v, k], i) => <div key={i} className="mk-box" style={{ '--c': [PG.pg, T.accent, T.yellow][i] }}><h4>{['Qaysi jadval', 'Qaysi qoida', 'Qaysi qiymat'][i]}</h4><p><code>{v}</code></p></div>)}</div>
    </div>
    {seg.e >= 0 && seg.e <= 2 && <Psql er lines={E12[seg.e]} />}
    {seg.e === 1 && <div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />MongoDB — 4-ekran</h5><Doc>{`{ "author": null, "izoh": "Muallifi yo'q post" }   ← saqlandi`}</Doc></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><Doc er>{'ERROR … foreign key constraint   ← saqlanmadi'}</Doc></div>
    </div>}
    {seg.e === 9 && <Psql er lines={E12[1]} />}
    {seg.e === 9 && <div className="mk-rule">Qoida buzilsa yozuv <b>saqlanmaydi</b>. O'quvchi bilan birga o'qing: jadval · qoida nomi · <b>DETAIL</b> qatoridagi qiymat — javob deyarli doim shu qatorda.</div>}
  </>} />;
}

// ============================================================
//  14 · Tekshiruv 2 — DELETE rad etildi
// ============================================================
function Screen13(p) {
  const m = MDT[14];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Psql er lines={E12[2]} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatish — avval postlar, keyin foydalanuvchi (haqiqiy natija)</div>
      <Psql lines={psql(String.raw`
blog=# DELETE FROM posts WHERE user_id = 1;
DELETE 2
blog=# DELETE FROM users WHERE id = 1;
DELETE 1`, { 1: { neu: true }, 3: { neu: true } })} />
      <div className="mk-rule">Bunday <code>id</code> yo'q bo'lsa xato chiqmaydi: <code>DELETE 0</code>. Xato — qoida buzilganda.</div>
    </div>} />;
}

// ============================================================
//  15 · Amaliyot 2 — ikki bog'langan jadval
// ============================================================
const P2 = mkS(15, [{ hl: [] }, { hl: [0, 1, 2, 3] }, { hl: [4] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Baza', cmds: ['psql -U postgres', 'CREATE DATABASE blog;', '\\c blog'], exp: 'CREATE DATABASE · prompt blog=#' },
  { t: 'users', cmds: ['CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);'], exp: 'CREATE TABLE' },
  { t: 'posts', cmds: ['CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);', '\\dt'], exp: 'CREATE TABLE · 2 jadval' },
  { t: "Ma'lumot", cmds: ["INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');", "INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');"], exp: 'INSERT 0 3 · INSERT 0 3' },
  { t: 'Xatoni o\'zingiz chiqaring', cmds: ["INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');", '\\d posts'], exp: 'violates foreign key constraint "posts_user_id_fkey" · Key (user_id)=(99) is not present' },
];
const P2_TROUBLE = [
  ['ERROR:  relation "users" already exists', "jadval oldin yaratilgan — \\d users bilan ko'ring, keyingi qadamga o'ting"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan so'zdan oldin vergul yoki qavs tushib qolgan"],
  ['ERROR:  relation "posts" does not exist', 'boshqa bazadasiz (prompt postgres=#) — \\c blog'],
  ['ERROR:  database "blog" already exists', "baza oldin yaratilgan — \\c blog va davom eting"],
  ['Prompt postgres-# / blog-#', "; unutilgan — ; yozib Enter"],
  ['5-qadamda INSERT 0 1', "REFERENCES users(id) yozilmagan — \\d posts'da kalit qatori yo'q; DROP TABLE posts; va 3-qadamni qayta"],
];
const P2_PROOF = { label: "Isbot: \\d posts natijasidagi Foreign-key qatori", placeholder: "\\d posts chiqishidan kalit qatorini shu yerga qo'ying", check: (v) => /posts_user_id_fkey/.test(v) && /references\s+users\s*\(id\)/i.test(v), wrong: "Qatorda kalit nomi (posts_user_id_fkey) va REFERENCES users(id) bo'lsin — \\d posts natijasining oxirgi qatori" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  16 · JOIN va LEFT JOIN
// ============================================================
const LEFT15 = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM users
blog-# LEFT JOIN posts ON posts.user_id = users.id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
 sardor   |
(4 rows)`, { 3: { id: 'lj' }, 9: { id: 'sa' } });
const JOIN15 = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM posts
blog-# JOIN users ON users.id = posts.user_id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
(3 rows)`, { 1: { id: 'sel' }, 2: { id: 'from' }, 3: { id: 'on' } });
const S15 = mkS(16, [{ v: 'tab', on: false }, { v: 'join', on: true, focus: ['sel', 'from', 'on'] }, { v: 'left', on: true, focus: ['lj', 'sa'] }, { v: 'join', on: true, focus: ['on'] }, { v: 'join', on: true, focus: [] }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} hlCol={seg.on ? [1] : []} />
      <MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} hlCol={seg.on ? [0] : []} hlRow={seg.v === 'left' ? [2] : []} />
    </div>
    {seg.on && <div className="mk-tag" style={{ margin: 0, color: T.accent }}>ON: users.id = posts.user_id — users'dagi id posts'dagi user_id'ga teng</div>}
    {seg.v === 'join' && <Psql lines={JOIN15} focus={seg.focus} />}
    {seg.v === 'left' && <Psql lines={LEFT15} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule"><b>JOIN</b> — faqat jufti borlar · <b>LEFT JOIN</b> — chapdagi jadvalning hammasi · <code>ON</code>da tashqi kalit (<code>user_id</code>) boshqa jadvalning <code>id</code>'siga tenglanadi</div></Block>
  </>} />;
}

// ============================================================
//  17 · Tekshiruv 3 — xatosiz, lekin noto'g'ri natija (LineCheck; target 0 dan — 3-satr = 2)
// ============================================================
const LC16 = sql(String.raw`
SELECT users.username, posts.izoh
FROM posts
JOIN users ON users.id = posts.id;`);
const LC16_FIXED = [
  { h: sqlLine('SELECT users.username, posts.izoh'), n: 1 },
  { h: sqlLine('FROM posts'), n: 2 },
  { h: sqlLine('JOIN users ON users.id = posts.id;'), n: 3, gone: true },
  { h: sqlLine('JOIN users ON users.id = posts.user_id;') + '  <span class="cm">-- tashqi kalit</span>', n: 3, neu: true },
];
// Noto'g'ri natija — topshiriq matni ichida (bosiladigan kod satrlari orasida emas: jadval qatori «xato satr» deb bosilmasin)
const WRONG16_TXT = String.raw`
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 vali     | Bugun Nest o'rgandim      ← noto'g'ri
 sardor   | Salom hammaga             ← noto'g'ri
(3 rows)`;
const WRONG16_HTML = '<pre class="pg-doc er" style="margin-top:12px;font-size:12px">' + escH(WRONG16_TXT.replace(/^\n/, '')) + '</pre>';
function Screen16(p) {
  const m = MDT[17];
  return <>
    <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task + WRONG16_HTML} q={m.q} file="psql — blog · so'rov" lines={LC16} target={2}
      fixed={LC16_FIXED} fixedExtra={[{ file: "natija — to'g'ri (haqiqiy)", lines: JOIN15.slice(3) }]}
      ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />
  </>;
}

// ============================================================
//  18 · Amaliyot 3 — JOIN
// ============================================================
const P3 = mkS(18, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'JOIN', cmds: ['SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.user_id;'], exp: '3 qator: ali · ali · vali' },
  { t: 'Xato ON', cmds: ['SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.id;'], exp: "xato yo'q; ali · vali · sardor — mualliflar noto'g'ri" },
  { t: 'LEFT JOIN', cmds: ['SELECT users.username, posts.izoh FROM users LEFT JOIN posts ON posts.user_id = users.id;'], exp: 'sardor — bo\'sh izoh bilan' },
  { t: 'Sanash', cmds: [], exp: '3-qadam natijasining oxirgi satri: (… rows)' },
];
const P3_TROUBLE = [
  ['ERROR:  relation "posts" does not exist', 'boshqa bazadasiz — \\c blog'],
  ['(0 rows)', "INSERT'lar boshqa bazada qilingan yoki qilinmagan — SELECT * FROM posts; bilan tekshiring, Amaliyot 2 ning 4-qadami"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan joydan oldin vergul yoki nuqta tushib qolgan"],
  ["sardor LEFT JOIN'da ham yo'q", 'FROM posts LEFT JOIN users yozilgan — FROM users dan boshlang'],
];
const P3_PROOF = { label: 'Isbot: LEFT JOIN natijasidagi qatorlar soni', placeholder: 'natija ostidagi sonni yozing', check: (v) => /^\s*\(?\s*4\b/.test(v), wrong: "LEFT JOIN natijasi ostida qavs ichida qatorlar soni yozilgan — sardor ham sanaladi" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }
