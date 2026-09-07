// 0001_live_core — funksiyalar xulqi. Har band Supabase davridagi sinov-satrlariga mos (supabase/*.sql izohlari).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { freshDatabase, expectPgError } from '../helpers/db.js';
import { runMigrations } from '../../src/db/migrate.js';

const CODE = 'TEST-CODE-2026';
let db;

before(async () => {
  db = await freshDatabase();
  await db.query(`insert into app_config (key, value) values ('mentor_code', $1)`, [CODE]);
});
after(async () => { await db?.end(); });

const q = (sql, params) => db.query(sql, params).then((r) => r.rows);
const one = async (sql, params) => (await q(sql, params))[0];

async function createSession(lesson = 'test-lesson-v18') {
  return one('select * from create_session($1, $2)', [lesson, CODE]);
}

test('migratsiya idempotent: ikkinchi yurish hech narsa qo\'llamaydi', async () => {
  const r = await runMigrations({ pool: db });
  assert.deepEqual(r.applied, []);
  assert.ok(r.total >= 1);
});

test('create_session: kod noto\'g\'ri/bo\'sh → rad; to\'g\'ri → 6 xonali PIN + 32 hex token', async () => {
  await expectPgError(q('select * from create_session($1, $2)', ['l', 'NOTOGRI']), "Mentor kodi noto'g'ri");
  await expectPgError(q('select * from create_session($1)', ['l']), "Mentor kodi noto'g'ri");
  await expectPgError(q('select * from create_session($1, $2)', ['  ', CODE]), 'Dars identifikatori');
  const s = await createSession();
  assert.match(s.pin, /^\d{6}$/);
  assert.match(s.token, /^[0-9a-f]{32}$/);
  const row = await one('select * from live_sessions where pin = $1', [s.pin]);
  assert.equal(row.status, 'live');
  assert.equal(row.cur_screen, 0);
  assert.equal(row.quiz_state, 'off');
  assert.equal(row.reveal_screen, -1);
});

test('create_session eski sessiyalarni O\'CHIRMAYDI (ko\'rish rejimi uchun tarix)', async () => {
  const old = await createSession('old-lesson');
  await q(`update live_sessions set created_at = now() - interval '3 days', updated_at = now() - interval '3 days' where pin = $1`, [old.pin]);
  await createSession('new-lesson');
  const still = await one('select pin from live_sessions where pin = $1', [old.pin]);
  assert.ok(still, 'eski sessiya saqlanib qolishi kerak');
});

test('join_session: ism qoidalari, PIN topilmadi, ism band (harf farqsiz)', async () => {
  const s = await createSession();
  await expectPgError(q('select * from join_session($1, $2)', [s.pin, 'A']), 'Ism 2 dan 24 gacha');
  await expectPgError(q('select * from join_session($1, $2)', ['000000', 'Ali']), 'Bunday kod topilmadi');
  const p = await one('select * from join_session($1, $2)', [s.pin, 'Ali']);
  assert.match(p.player_id, /^[0-9a-f-]{36}$/);
  assert.match(p.token, /^[0-9a-f]{32}$/);
  await expectPgError(q('select * from join_session($1, $2)', [s.pin, 'ali']), 'Bu ism band');
  await expectPgError(q('select * from join_session($1, $2)', [s.pin, '  Ali  ']), 'Bu ism band');
});

test('set_quiz_keys: faqat mentor-kod bilan; obyekt bo\'lmasa rad; upsert', async () => {
  await expectPgError(q('select set_quiz_keys($1, $2, $3)', ['k-lesson', 'NOTOGRI', '{"s4":1}']), "Mentor kodi noto'g'ri");
  await expectPgError(q('select set_quiz_keys($1, $2, $3)', ['k-lesson', CODE, '[1,2]']), 'Kalit obyekt');
  const { set_quiz_keys: n1 } = await one('select set_quiz_keys($1, $2, $3)', ['k-lesson', CODE, '{"s4":1,"s6":-1,"quiz-0":2}']);
  assert.equal(n1, 3);
  const { set_quiz_keys: n2 } = await one('select set_quiz_keys($1, $2, $3)', ['k-lesson', CODE, '{"s4":3}']);
  assert.equal(n2, 1);
  const k = await one('select correct_idx from quiz_keys where lesson_id = $1 and question_id = $2', ['k-lesson', 's4']);
  assert.equal(k.correct_idx, 3);
});

test('submit_answer: to\'g\'rilikni SERVER hisoblaydi, mijoz p_correct e\'tiborsiz, birinchi javob qotadi', async () => {
  await q('select set_quiz_keys($1, $2, $3)', ['score-lesson', CODE, '{"s4":1,"s6":-1}']);
  const s = await createSession('score-lesson');
  const ali = await one('select * from join_session($1, $2)', [s.pin, 'Ali']);
  const vali = await one('select * from join_session($1, $2)', [s.pin, 'Vali']);

  // Ali to'g'ri variantni bosdi, lekin p_correct=false yubordi → server true deydi
  let r = await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 4, 's4', 1, false, 3500]);
  assert.equal(r.ok, true);
  let a = await one('select correct, elapsed_ms from live_answers where player_id = $1 and screen_idx = 4', [ali.player_id]);
  assert.equal(a.correct, true);
  assert.equal(a.elapsed_ms, 3500);

  // Firib: noto'g'ri variant + p_correct=true → server false
  r = await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, vali.player_id, vali.token, 4, 's4', 0, true, 0]);
  assert.equal(r.ok, true);
  a = await one('select correct from live_answers where player_id = $1 and screen_idx = 4', [vali.player_id]);
  assert.equal(a.correct, false);

  // Ikkinchi javob shu ekranga → false, birinchisi qoladi
  r = await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 4, 's4', 2, false, 100]);
  assert.equal(r.ok, false);
  a = await one('select picked from live_answers where player_id = $1 and screen_idx = 4', [ali.player_id]);
  assert.equal(a.picked, 1);

  // Ishtirok savoli (-1) → to'ldirgani = to'g'ri; noma'lum savol → false
  r = await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 6, 's6', 0, false, 10]);
  a = await one('select correct from live_answers where player_id = $1 and screen_idx = 6', [ali.player_id]);
  assert.equal(a.correct, true);
  await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 9, 'yoq-savol', 0, true, 10]);
  a = await one('select correct from live_answers where player_id = $1 and screen_idx = 9', [ali.player_id]);
  assert.equal(a.correct, false);

  // Boshqa birovning tokeni bilan → Ruxsat yo'q
  await expectPgError(
    q('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8)', [s.pin, ali.player_id, vali.token, 5, 's5', 1, false, 10]),
    "Ruxsat yo'q",
  );
});

test('quiz_control + arena vaqti: holat tekshiruvi, quiz_started_at, elapsed serverdan', async () => {
  await q('select set_quiz_keys($1, $2, $3)', ['arena-lesson', CODE, '{"quiz-0":2}']);
  const s = await createSession('arena-lesson');
  const p = await one('select * from join_session($1, $2)', [s.pin, 'Ali']);

  await expectPgError(q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'boom', 0]), "Noto'g'ri holat");
  await expectPgError(q('select quiz_control($1,$2,$3,$4)', [s.pin, 'yomon-token', 'lobby', -1]), 'Sessiya topilmadi yoki ruxsat');

  await q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'lobby', -1]);
  await q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'q', 0]);
  const st = await one('select quiz_state, quiz_q, quiz_started_at from live_sessions where pin = $1', [s.pin]);
  assert.equal(st.quiz_state, 'q');
  assert.equal(st.quiz_q, 0);
  assert.ok(st.quiz_started_at);

  // Mijoz elapsed=999999 yuboradi — server o'zi o'lchaydi (bir necha ms)
  await q('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8)', [s.pin, p.player_id, p.token, 100, 'quiz-0', 2, false, 999999]);
  const a = await one('select correct, elapsed_ms from live_answers where player_id = $1 and screen_idx = 100', [p.player_id]);
  assert.equal(a.correct, true);
  assert.ok(a.elapsed_ms >= 0 && a.elapsed_ms < 5000, `elapsed serverdan bo'lishi kerak, keldi ${a.elapsed_ms}`);

  await q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'r', 0]);
  const st2 = await one('select quiz_state, quiz_started_at from live_sessions where pin = $1', [s.pin]);
  assert.equal(st2.quiz_state, 'r');
  assert.equal(String(st2.quiz_started_at), String(st.quiz_started_at), "'r' quiz_started_at ni o'zgartirmasin");
});

test('advance_session: cur kamayadi, max monoton; yomon token jim', async () => {
  const s = await createSession();
  await q('select advance_session($1,$2,$3)', [s.pin, s.token, 8]);
  await q('select advance_session($1,$2,$3)', [s.pin, s.token, 3]);
  let r = await one('select cur_screen, max_screen from live_sessions where pin = $1', [s.pin]);
  assert.deepEqual([r.cur_screen, r.max_screen], [3, 8]);
  await q('select advance_session($1,$2,$3)', [s.pin, 'yomon', 20]); // xato yo'q, o'zgarish yo'q
  r = await one('select cur_screen, max_screen from live_sessions where pin = $1', [s.pin]);
  assert.deepEqual([r.cur_screen, r.max_screen], [3, 8]);
});

test('reveal_screen va heartbeat', async () => {
  const s = await createSession();
  await q(`update live_sessions set updated_at = now() - interval '1 hour' where pin = $1`, [s.pin]);
  await q('select session_heartbeat($1,$2)', [s.pin, s.token]);
  let r = await one('select reveal_screen, updated_at from live_sessions where pin = $1', [s.pin]);
  assert.ok(Date.now() - new Date(r.updated_at).getTime() < 10_000, 'heartbeat updated_at ni yangilasin');
  await q('select reveal_screen($1,$2,$3)', [s.pin, s.token, 4]);
  r = await one('select reveal_screen from live_sessions where pin = $1', [s.pin]);
  assert.equal(r.reveal_screen, 4);
  await expectPgError(q('select reveal_screen($1,$2,$3)', [s.pin, 'yomon', 5]), 'Sessiya topilmadi yoki ruxsat');
});

test('end_session → ended; keyin join rad, advance/quiz ta\'sir qilmaydi', async () => {
  const s = await createSession();
  await q('select end_session($1,$2)', [s.pin, s.token]);
  const r = await one('select status from live_sessions where pin = $1', [s.pin]);
  assert.equal(r.status, 'ended');
  await expectPgError(q('select * from join_session($1,$2)', [s.pin, 'Ali']), 'allaqachon yakunlangan');
  await q('select advance_session($1,$2,$3)', [s.pin, s.token, 9]);
  const r2 = await one('select cur_screen from live_sessions where pin = $1', [s.pin]);
  assert.equal(r2.cur_screen, 0);
  await expectPgError(q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'lobby', -1]), 'Sessiya topilmadi yoki ruxsat');
});

test('close_stale_live_sessions: 2 soat jim → ended; yaqinda faol → tegilmaydi; hech narsa o\'chmaydi', async () => {
  const stale = await createSession('stale-lesson');
  const fresh = await createSession('fresh-lesson');
  await q(`update live_sessions set updated_at = now() - interval '3 hours' where pin = $1`, [stale.pin]);
  const before = (await one('select count(*)::int as n from live_sessions')).n;
  const { n } = await one('select close_stale_live_sessions() as n');
  assert.ok(n >= 1);
  assert.equal((await one('select status from live_sessions where pin = $1', [stale.pin])).status, 'ended');
  assert.equal((await one('select status from live_sessions where pin = $1', [fresh.pin])).status, 'live');
  assert.equal((await one('select count(*)::int as n from live_sessions')).n, before);
});

test('cascade: sessiya o\'chsa sirlar/o\'yinchilar/javoblar ham (faqat admin-tozalash uchun)', async () => {
  const s = await createSession('cascade-lesson');
  const p = await one('select * from join_session($1,$2)', [s.pin, 'Ali']);
  await q('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8)', [s.pin, p.player_id, p.token, 4, 's4', 1, false, 1]);
  await q('delete from live_sessions where pin = $1', [s.pin]);
  assert.equal((await one('select count(*)::int as n from live_players where pin = $1', [s.pin])).n, 0);
  assert.equal((await one('select count(*)::int as n from player_secrets where player_id = $1', [p.player_id])).n, 0);
  assert.equal((await one('select count(*)::int as n from session_secrets where pin = $1', [s.pin])).n, 0);
});
