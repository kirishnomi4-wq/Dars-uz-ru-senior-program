// Jonli-API (HTTP): RPC allowlist, sxema, PostgREST-mos javob shakllari, o'qish-yo'llari, ETag, limitlar.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, TEST_MENTOR_CODE } from '../helpers/app.js';

let t;
before(async () => { t = await makeTestApp(); });
after(async () => { await t?.close(); });

const rpc = (fn, body, headers) => post(t.app, `/api/v1/live/rpc/${fn}`, body, headers);

async function mentorSession(lesson = 'api-lesson-v18') {
  const r = await rpc('create_session', { p_lesson_id: lesson, p_mentor_code: TEST_MENTOR_CODE });
  assert.equal(r.statusCode, 200, r.body);
  return r.json()[0];
}
async function student(pin, nick) {
  const r = await rpc('join_session', { p_pin: pin, p_nickname: nick });
  assert.equal(r.statusCode, 200, r.body);
  return r.json()[0];
}

test('noma\'lum funksiya → 404; noto\'g\'ri metod → 404', async () => {
  const r = await rpc('drop_everything', {});
  assert.equal(r.statusCode, 404);
  const g = await t.app.inject({ method: 'GET', url: '/api/v1/live/rpc/create_session' });
  assert.equal(g.statusCode, 404);
});

test('create_session: sxema (majburiy maydon, ortiqcha maydon, lesson_id qolipi) → 400 validation_failed', async () => {
  let r = await rpc('create_session', { p_lesson_id: 'x' });
  assert.equal(r.statusCode, 400);
  assert.equal(r.json().error, 'validation_failed');
  assert.match(r.json().details.join(' '), /p_mentor_code/);

  r = await rpc('create_session', { p_lesson_id: 'x', p_mentor_code: 'c', extra: 1 });
  assert.equal(r.statusCode, 400);
  assert.match(r.json().details.join(' '), /additional/);

  r = await rpc('create_session', { p_lesson_id: 'bo\'sh joy bor', p_mentor_code: 'c' });
  assert.equal(r.statusCode, 400);
});

test('F-0918-01: create_session kod noto\'g\'ri → 403 forbidden (klient «Mentor kodi noto\'g\'ri.» ko\'rsatadi; 400 «Server javob bermadi» edi), SQL xabari o\'zgarmagan', async () => {
  const r = await rpc('create_session', { p_lesson_id: 'x-v18', p_mentor_code: 'NOTOGRI' });
  assert.equal(r.statusCode, 403);
  assert.deepEqual(r.json(), { error: 'forbidden', message: "Mentor kodi noto'g'ri" });
  // boshqa PL/pgSQL raise'lar avvalgidek 400 domain_error
  const e = await rpc('create_session', { p_lesson_id: '', p_mentor_code: process.env.LIVE_MENTOR_CODE || '' });
  assert.ok([400, 403].includes(e.statusCode));
});

test('to\'liq oqim: create → join → set_quiz_keys → submit → o\'qishlar', async () => {
  const s = await mentorSession('flow-lesson-v18');
  assert.match(s.pin, /^\d{6}$/);
  assert.match(s.token, /^[0-9a-f]{32}$/);

  // rows shakli: massiv (klient rows[0] oladi)
  const ali = await student(s.pin, 'Ali');
  assert.match(ali.player_id, /^[0-9a-f-]{36}$/);

  // Ism band — domen-xato, xabar aynan
  const dup = await rpc('join_session', { p_pin: s.pin, p_nickname: 'ali' });
  assert.equal(dup.statusCode, 400);
  assert.equal(dup.json().message, 'Bu ism band — boshqa ism tanlang');

  // PIN shakli — sxema, SQL'gacha bormaydi
  const badPin = await rpc('join_session', { p_pin: '12', p_nickname: 'Vali' });
  assert.equal(badPin.statusCode, 400);
  assert.equal(badPin.json().error, 'validation_failed');

  // scalar: set_quiz_keys → son
  const keys = await rpc('set_quiz_keys', { p_lesson_id: 'flow-lesson-v18', p_mentor_code: TEST_MENTOR_CODE, p_keys: { s4: 1, 'quiz-0': 2, s6: -1 } });
  assert.equal(keys.statusCode, 200);
  assert.equal(keys.json(), 3);

  // void: advance → 204 tanasiz
  const adv = await rpc('advance_session', { p_pin: s.pin, p_token: s.token, p_screen: 4 });
  assert.equal(adv.statusCode, 204);
  assert.equal(adv.body, '');

  // scalar: submit_answer → true, keyin false (birinchisi qotadi); to'g'rilik serverdan
  const a1 = await rpc('submit_answer', { p_pin: s.pin, p_player_id: ali.player_id, p_token: ali.token, p_screen: 4, p_question_id: 's4', p_picked: 1, p_correct: false, p_elapsed_ms: 2500 });
  assert.equal(a1.statusCode, 200);
  assert.equal(a1.json(), true);
  const a2 = await rpc('submit_answer', { p_pin: s.pin, p_player_id: ali.player_id, p_token: ali.token, p_screen: 4, p_question_id: 's4', p_picked: 0, p_correct: true, p_elapsed_ms: 1 });
  assert.equal(a2.json(), false);

  // Boshqa o'quvchi, arena javobi
  const vali = await student(s.pin, 'Vali');
  await rpc('quiz_control', { p_pin: s.pin, p_token: s.token, p_state: 'q', p_q: 0 });
  await rpc('submit_answer', { p_pin: s.pin, p_player_id: vali.player_id, p_token: vali.token, p_screen: 100, p_question_id: 'quiz-0', p_picked: 2, p_correct: false, p_elapsed_ms: 0 });

  // o'qishlar
  const players = await t.app.inject({ method: 'GET', url: `/api/v1/live/players/${s.pin}` });
  assert.equal(players.statusCode, 200);
  assert.deepEqual(players.json().map((p) => p.nickname), ['Ali', 'Vali']);
  assert.deepEqual(Object.keys(players.json()[0]).sort(), ['id', 'joined_at', 'nickname']);

  const lesson = await t.app.inject({ method: 'GET', url: `/api/v1/live/answers/${s.pin}` });
  assert.equal(lesson.json().length, 1);
  assert.equal(lesson.json()[0].correct, true);
  assert.deepEqual(Object.keys(lesson.json()[0]).sort(), ['correct', 'elapsed_ms', 'picked', 'player_id', 'screen_idx']);

  const arena = await t.app.inject({ method: 'GET', url: `/api/v1/live/answers/${s.pin}?range=arena` });
  assert.equal(arena.json().length, 1);
  assert.equal(arena.json()[0].screen_idx, 100);

  const one = await t.app.inject({ method: 'GET', url: `/api/v1/live/answers/${s.pin}?screen=4` });
  assert.equal(one.json().length, 1);

  const badQ = await t.app.inject({ method: 'GET', url: `/api/v1/live/answers/${s.pin}?range=hamma` });
  assert.equal(badQ.statusCode, 400);

  // sessiya qatori + ETag/304
  const sess = await t.app.inject({ method: 'GET', url: `/api/v1/live/session/${s.pin}` });
  assert.equal(sess.statusCode, 200);
  const row = sess.json();
  assert.equal(row.cur_screen, 4);
  assert.equal(row.quiz_state, 'q');
  assert.equal(row.status, 'live');
  assert.ok(!('mentor_token' in row) && !('token' in row), 'sir ustunlar chiqmasin');
  const etag = sess.headers.etag;
  assert.match(etag, /^W\/"/);
  assert.equal(sess.headers['cache-control'], 'no-cache');

  const notMod = await t.app.inject({ method: 'GET', url: `/api/v1/live/session/${s.pin}`, headers: { 'if-none-match': etag } });
  assert.equal(notMod.statusCode, 304);
  assert.equal(notMod.body, '');

  await rpc('session_heartbeat', { p_pin: s.pin, p_token: s.token });
  const changed = await t.app.inject({ method: 'GET', url: `/api/v1/live/session/${s.pin}`, headers: { 'if-none-match': etag } });
  assert.equal(changed.statusCode, 200, 'heartbeat updated_at ni o\'zgartirdi → yangi ETag');

  // end → ended; join rad
  const end = await rpc('end_session', { p_pin: s.pin, p_token: s.token });
  assert.equal(end.statusCode, 204);
  const after = await t.app.inject({ method: 'GET', url: `/api/v1/live/session/${s.pin}` });
  assert.equal(after.json().status, 'ended');
  const late = await rpc('join_session', { p_pin: s.pin, p_nickname: 'Kech' });
  assert.equal(late.json().message, 'Bu dars allaqachon yakunlangan');
});

test('session GET: yo\'q PIN → 404 not_found (klient null deb oladi); yomon PIN → 400', async () => {
  const r = await t.app.inject({ method: 'GET', url: '/api/v1/live/session/000000' });
  assert.equal(r.statusCode, 404);
  assert.equal(r.json().error, 'not_found');
  const bad = await t.app.inject({ method: 'GET', url: '/api/v1/live/session/abc' });
  assert.equal(bad.statusCode, 400);
});

test('players/answers: yo\'q PIN → bo\'sh massiv (PostgREST bilan bir xil)', async () => {
  const p = await t.app.inject({ method: 'GET', url: '/api/v1/live/players/000000' });
  assert.deepEqual(p.json(), []);
  const a = await t.app.inject({ method: 'GET', url: '/api/v1/live/answers/000000' });
  assert.deepEqual(a.json(), []);
});

test('quiz_control: p_q default -1; holat enum sxemada', async () => {
  const s = await mentorSession('qc-lesson-v18');
  const r = await rpc('quiz_control', { p_pin: s.pin, p_token: s.token, p_state: 'lobby' });
  assert.equal(r.statusCode, 204);
  const bad = await rpc('quiz_control', { p_pin: s.pin, p_token: s.token, p_state: 'boom' });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.json().error, 'validation_failed');
});

test('submit_answer: uuid/token qolipi sxemada; begona token → domen-xato', async () => {
  const s = await mentorSession('sa-lesson-v18');
  const p = await student(s.pin, 'Ali');
  const bad = await rpc('submit_answer', { p_pin: s.pin, p_player_id: 'not-a-uuid', p_token: p.token, p_screen: 1, p_question_id: 's1', p_picked: 0, p_correct: false, p_elapsed_ms: 0 });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.json().error, 'validation_failed');
  const stolen = await rpc('submit_answer', { p_pin: s.pin, p_player_id: p.player_id, p_token: 'f'.repeat(32), p_screen: 1, p_question_id: 's1', p_picked: 0, p_correct: false, p_elapsed_ms: 0 });
  assert.equal(stolen.statusCode, 400);
  assert.equal(stolen.json().message, "Ruxsat yo'q");
});

test('set_quiz_keys: kalit nomlari va qiymatlari sxemada', async () => {
  const bad1 = await rpc('set_quiz_keys', { p_lesson_id: 'k-v18', p_mentor_code: TEST_MENTOR_CODE, p_keys: { 's4': 'bir' } });
  assert.equal(bad1.statusCode, 400);
  const bad2 = await rpc('set_quiz_keys', { p_lesson_id: 'k-v18', p_mentor_code: TEST_MENTOR_CODE, p_keys: {} });
  assert.equal(bad2.statusCode, 400);
  const bad3 = await rpc('set_quiz_keys', { p_lesson_id: 'k-v18', p_mentor_code: TEST_MENTOR_CODE, p_keys: { 'bo sh': 1 } });
  assert.equal(bad3.statusCode, 400);
});

test('rate-limit: join_session 20/min/IP → 429 + retry-after (PIN-perebor)', async () => {
  let last;
  for (let i = 0; i < 25; i++) {
    last = await rpc('join_session', { p_pin: '000000', p_nickname: 'Bot' });
  }
  assert.equal(last.statusCode, 429);
  assert.equal(last.json().error, 'rate_limited');
  assert.ok(Number(last.headers['retry-after']) >= 1);
  // o'qish-yo'li alohida hisoblanadi — bloklanmagan
  const read = await t.app.inject({ method: 'GET', url: '/api/v1/live/players/000000' });
  assert.equal(read.statusCode, 200);
});
