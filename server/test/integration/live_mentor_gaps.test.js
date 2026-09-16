// 0008_mentor_gaps — F-0914-11: mentor 180 s dan ko'p jim bo'lib qaytsa, bo'shliq yoziladi.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { freshDatabase } from '../helpers/db.js';

const CODE = 'TEST-CODE-2026';
let db;

before(async () => {
  db = await freshDatabase();
  await db.query(`insert into app_config (key, value) values ('mentor_code', $1)`, [CODE]);
});
after(async () => { await db?.end(); });

const q = (sql, params) => db.query(sql, params).then((r) => r.rows);
const one = async (sql, params) => (await q(sql, params))[0];
const createSession = () => one('select * from create_session($1, $2)', ['gap-lesson-v1', CODE]);
const setSilence = (pin, sql) => q(`update live_sessions set updated_at = now() - interval '${sql}' where pin = $1`, [pin]);
const gaps = (pin) => q('select * from live_mentor_gaps where pin = $1 order by id', [pin]);

test('qisqa jimlik (60 s) yozilmaydi', async () => {
  const s = await createSession();
  // setSilence o'zi ham updated_at ni o'zgartiradi — lekin orqaga (manfiy sakrash), trigger shartiga tushmaydi
  await setSilence(s.pin, '60 seconds');
  await q('select session_heartbeat($1,$2)', [s.pin, s.token]);
  assert.equal((await gaps(s.pin)).length, 0);
});

test('heartbeat 5 daqiqalik jimlikdan keyin → bitta bo\'shliq, ended_by=mentor, ekran saqlanadi', async () => {
  const s = await createSession();
  await q('select advance_session($1,$2,$3)', [s.pin, s.token, 7]);
  await setSilence(s.pin, '5 minutes');
  await q('select session_heartbeat($1,$2)', [s.pin, s.token]);
  const g = await gaps(s.pin);
  assert.equal(g.length, 1);
  assert.equal(g[0].ended_by, 'mentor');
  assert.equal(g[0].lesson_id, 'gap-lesson-v1');
  assert.equal(g[0].cur_screen, 7);
  assert.ok(Number(g[0].gap_ms) >= 299_000 && Number(g[0].gap_ms) < 310_000, `gap_ms=${g[0].gap_ms}`);
  // darhol keyingi heartbeat — yangi bo'shliq yo'q
  await q('select session_heartbeat($1,$2)', [s.pin, s.token]);
  assert.equal((await gaps(s.pin)).length, 1);
});

test('advance_session ham bo\'shliqni yopadi (mentor fon-tabdan qaytib bosgan holat)', async () => {
  const s = await createSession();
  await setSilence(s.pin, '4 minutes');
  await q('select advance_session($1,$2,$3)', [s.pin, s.token, 3]);
  const g = await gaps(s.pin);
  assert.equal(g.length, 1);
  assert.equal(g[0].ended_by, 'mentor');
});

test('jimlikdan keyin end_session → ended_by=session_end; yopilgandan keyin hech narsa yozilmaydi', async () => {
  const s = await createSession();
  await setSilence(s.pin, '10 minutes');
  await q('select end_session($1,$2)', [s.pin, s.token]);
  let g = await gaps(s.pin);
  assert.equal(g.length, 1);
  assert.equal(g[0].ended_by, 'session_end');
  await setSilence(s.pin, '10 minutes');
  await q('select end_session($1,$2)', [s.pin, s.token]); // ended → ended
  g = await gaps(s.pin);
  assert.equal(g.length, 1);
});

test('yomon token bilan heartbeat — yangilanish yo\'q, bo\'shliq yo\'q', async () => {
  const s = await createSession();
  await setSilence(s.pin, '5 minutes');
  await q('select session_heartbeat($1,$2)', [s.pin, '0'.repeat(32)]);
  assert.equal((await gaps(s.pin)).length, 0);
});

test('close_stale_live_sessions (2 soat) — session_end sifatida yoziladi', async () => {
  const s = await createSession();
  await setSilence(s.pin, '3 hours');
  await q('select close_stale_live_sessions()');
  const g = await gaps(s.pin);
  assert.equal(g.length, 1);
  assert.equal(g[0].ended_by, 'session_end');
});
