// Natija-navbat: sessiya tugadi → sweeper → payload → School API (stub) → statuslar; solo; retry; manual_review; admin.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
let t;
// School API stub: kontekst + lesson-results. `mode` bilan javobni boshqaramiz.
const received = [];
let resultMode = 'ok'; // ok | dup | 422 | 429 | 500 | net
const GROUPS = { 3001: [861], 3002: [861], 3003: [862], 3004: [] };
const ctxFetch = fakeSchoolApi(GROUPS);
async function fetchStub(url, init) {
  if (String(url).endsWith('/integrations/dars-platform/lesson-results')) {
    const payload = JSON.parse(init.body);
    received.push(payload);
    const headers = { 'content-type': 'application/json', 'x-request-id': `req-${received.length}` };
    if (resultMode === 'net') throw new TypeError('fetch failed');
    if (resultMode === '422') return new Response(JSON.stringify({ message: 'Validation failed', errors: { total_questions: ['bad'] } }), { status: 422, headers });
    if (resultMode === '429') return new Response(JSON.stringify({ message: 'Too many' }), { status: 429, headers: { ...headers, 'retry-after': '3' } });
    if (resultMode === '500') return new Response(JSON.stringify({ message: 'boom' }), { status: 500, headers });
    const dup = resultMode === 'dup';
    const students = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: dup, students_received: students, students_accepted: students - (payload.students.some((s) => s.student_id === 3002) ? 1 : 0), students_rejected: payload.students.some((s) => s.student_id === 3002) ? 1 : 0, rejected_students: payload.students.some((s) => s.student_id === 3002) ? [{ student_id: 3002, id_type: 'lms', reason: 'identity_not_found_or_unavailable' }] : [], reward_status: 'pending_policy' } }), { status: dup ? 200 : 201, headers });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({ ADMIN_USER: 'admin', ADMIN_PASSWORD: 'test-admin-parol-12' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON]);
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, TEST_MENTOR_CODE, '{"s4":1,"s9":2,"quiz-0":0}']);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const stu = (sub, name) => mintToken({ role: 'student', sub, name });
const answer = (pin, p, screen, qid, picked) => rpc('submit_answer', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_correct: false, p_elapsed_ms: 1000 });
const events = async (where = '') => (await t.db.query(`select * from result_events ${where} order by created_at`)).rows;
const adminGet = (url) => t.app.inject({ method: 'GET', url, headers: { authorization: 'Basic ' + Buffer.from('admin:test-admin-parol-12').toString('base64') } });

let mentor, ali, vali;
test('jonli: 2 LMS-o\'quvchi + 1 PIN-o\'quvchi javob beradi; sessiya tugaguncha hodisa yo\'q', async () => {
  mentor = (await join(await mintToken({ role: 'mentor', sub: 145, gid: 861, jti: 'r-m1' }), { lesson_id: LESSON })).json();
  ali = (await join(await stu(3001, 'Ali Valiyev'), { lesson_id: LESSON })).json();
  vali = (await join(await stu(3002, 'Vali Aliyev'), { lesson_id: LESSON })).json();
  const pinGuy = (await rpc('join_session', { p_pin: mentor.pin, p_nickname: 'Mehmon' })).json()[0];
  assert.equal((await answer(mentor.pin, ali, 4, 's4', 1)).json(), true);
  assert.equal((await answer(mentor.pin, ali, 9, 's9', 2)).json(), true);
  await rpc('quiz_control', { p_pin: mentor.pin, p_token: mentor.token, p_state: 'q', p_q: 0 });
  await answer(mentor.pin, ali, 100, 'quiz-0', 0);
  await answer(mentor.pin, vali, 4, 's4', 0);
  await answer(mentor.pin, vali, 9, 's9', 2);
  await rpc('submit_answer', { p_pin: mentor.pin, p_player_id: pinGuy.player_id, p_token: pinGuy.token, p_screen: 4, p_question_id: 's4', p_picked: 1, p_correct: false, p_elapsed_ms: 10 });
  await t.app.results.runOnce();
  assert.equal((await events()).length, 0);
});

test('mentor «Erkin qilish» (end_session RPC) → sweeper → payload to\'g\'ri → 201 delivered; PIN-o\'quvchi kirmaydi; rejected saqlanadi', async () => {
  const r = await rpc('end_session', { p_pin: mentor.pin, p_token: mentor.token });
  assert.equal(r.statusCode, 204);
  await new Promise((res) => setTimeout(res, 400)); // end_session'dan keyingi darhol-tick
  await t.app.results.runOnce();
  const evs = await events();
  assert.equal(evs.length, 1);
  const ev = evs[0];
  assert.equal(ev.status, 'delivered', ev.last_error);
  assert.equal(ev.mode, 'live');
  assert.equal(ev.students_count, 2);
  assert.equal(ev.last_http_status, 201);
  assert.equal(ev.last_request_id, 'req-1');
  const p = ev.payload;
  assert.match(p.event_id, /^sess_\d{6}_\d{8}T\d{6}Z$/);
  assert.equal(p.group_id, 861);
  assert.equal(p.teacher_id, 145);
  assert.equal(p.total_questions, 2, 'count = dars-testlari (s4, s9); arena quiz-0 kirmaydi');
  assert.deepEqual(p.students.map((s) => s.student_id), [3001, 3002], 'PIN-o\'quvchi Mehmon payloadda yo\'q');
  const a = p.students[0], v = p.students[1];
  // Ekran-podium: Ali 2/2 → 1; Mehmon (PIN) 1/1 to'g'ri, 10 ms → 2; Vali 1/2, 2000 ms → 3
  assert.deepEqual([a.correct_answers, a.answered, a.rank], [2, 2, 1]);
  assert.deepEqual([v.correct_answers, v.answered, v.rank], [1, 2, 3]);
  assert.ok(a.badges.includes('all_correct') && a.badges.includes('top_1'));
  assert.ok(a.badges.includes('arena_top_1'), `arena nishoni: ${a.badges}`);
  assert.equal(ev.response.data.students_rejected, 1);
  assert.equal(ev.response.data.rejected_students[0].student_id, 3002);
  // urinishlar yopildi va hodisaga bog'landi
  const at = (await t.db.query(`select status, finish_reason, result_event_id from attempts where subject_id in (3001, 3002) order by subject_id`)).rows;
  assert.ok(at.every((x) => x.status === 'finished' && x.finish_reason === 'live_ended'));
  // idempotent: qayta sweeper hech narsa qo'shmaydi
  await t.app.results.runOnce();
  assert.equal((await events()).length, 1);
  assert.equal(received.length, 1);
});

test('solo: oxirgi ekran → completed → hodisa (arena tashqari, rank null) → delivered', async () => {
  const s = (await join(await stu(3003, 'Sobir'), { lesson_id: LESSON })).json();
  assert.equal(s.mode, 'solo');
  await answer(s.pin, s, 4, 's4', 1);
  const pr = await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: s.attempt.id, screen: 21, total: 22, answers: {}, client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(await stu(3003, 'Sobir')) } });
  assert.equal(pr.json().status, 'finished');
  await t.app.results.runOnce();
  const ev = (await events(`where mode = 'solo'`))[0];
  assert.ok(ev, 'solo hodisa bo\'lishi kerak');
  assert.equal(ev.status, 'delivered');
  assert.match(ev.payload.event_id, /^solo_3003_internet-01-v18_/);
  assert.equal(ev.payload.total_questions, 2); // s4, s9 (quiz-0 tashqari)
  assert.deepEqual([ev.payload.students[0].correct_answers, ev.payload.students[0].answered, ev.payload.students[0].rank, ev.payload.students[0].completed], [1, 1, null, true]);
  assert.ok(!('group_id' in ev.payload));
});

test('tanga-qoidasi: 3003 ning ikkinchi tugallangan solo\'si YUBORILMAYDI (skipped:already_rewarded); restarted ham yo\'q', async () => {
  const before = (await events(`where mode = 'solo'`)).length;
  const r = await post(t.app, '/api/v1/lms/restart', { lesson_id: LESSON }, bearer(await stu(3003, 'Sobir')));
  assert.equal(r.statusCode, 200);
  const a1 = r.json().attempt.id;
  const r2 = await post(t.app, '/api/v1/lms/restart', { lesson_id: LESSON }, bearer(await stu(3003, 'Sobir')));
  const a2 = r2.json().attempt.id; // a1 → restarted (yuborilmaydi)
  const pr = await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: a2, screen: 21, total: 22, answers: {}, client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(await stu(3003, 'Sobir')) } });
  assert.equal(pr.json().status, 'finished');
  await t.app.results.runOnce();
  const evs = await events(`where mode = 'solo'`);
  assert.equal(evs.length, before, 'yangi solo hodisa bo\'lmasligi kerak');
  assert.ok(!evs.some((e) => e.attempt_id === a1 || e.attempt_id === a2));
  const marks = (await t.db.query('select id, result_event_id from attempts where id in ($1, $2)', [a1, a2])).rows;
  assert.equal(marks.find((m) => m.id === a2).result_event_id, 'skipped:already_rewarded');
  assert.equal(marks.find((m) => m.id === a1).result_event_id, null, 'restarted — sweeper unga tegmaydi');
  await t.app.results.runOnce(); // idempotent
  assert.equal((await events(`where mode = 'solo'`)).length, before);
});

test('auto_7d (tashlab ketilgan, tugallanmagan) → hodisa completed:false; keyingi TO\'LIQ urinish baribir yuboriladi', async () => {
  // 3004 — guruhsiz, tarixda hodisa yo'q
  const s = (await join(await stu(3004, 'Dilnoza'), { lesson_id: LESSON })).json();
  assert.equal(s.mode, 'solo');
  await t.db.query(`update attempts set started_at = now() - interval '8 days' where id = $1`, [s.attempt.id]);
  const { runLmsMaintenance } = await import('../../src/modules/lms/maintenance.js');
  await runLmsMaintenance(t.db, { info() {}, error() {}, warn() {} });
  await t.app.results.runOnce();
  const auto = (await events(`where mode = 'solo'`)).find((e) => e.attempt_id === s.attempt.id);
  assert.ok(auto, 'auto_7d hodisasi bo\'lishi kerak');
  assert.deepEqual([auto.payload.students[0].completed, auto.status], [false, 'delivered']);
  // tugallanmagan hodisa bloklamaydi: qayta boshlab oxirigacha o'tsa → yuboriladi
  const r = await post(t.app, '/api/v1/lms/restart', { lesson_id: LESSON }, bearer(await stu(3004, 'Dilnoza')));
  const a2 = r.json().attempt.id;
  await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: a2, screen: 21, total: 22, answers: {}, client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(await stu(3004, 'Dilnoza')) } });
  await t.app.results.runOnce();
  const done = (await events(`where mode = 'solo'`)).find((e) => e.attempt_id === a2);
  assert.ok(done, 'to\'liq urinish yuborilishi kerak');
  assert.equal(done.payload.students[0].completed, true);
});

test('School API 429 → retry_wait (Retry-After), 500 → retry_wait, keyin 201 → delivered; 422 → manual_review; 200 duplicate → delivered', async () => {
  const mk = async (gid, msub) => {
    const m = (await join(await mintToken({ role: 'mentor', sub: msub, gid, jti: `r-m-${gid}-${msub}` }), { lesson_id: LESSON })).json();
    const s = (await join(await mintToken({ role: 'student', sub: 3001, name: 'Ali', jti: `r-s-${gid}-${msub}` }), { lesson_id: LESSON })).json();
    await answer(m.pin, s, 4, 's4', 1);
    await rpc('end_session', { p_pin: m.pin, p_token: m.token });
    await new Promise((res) => setTimeout(res, 300));
    return m.pin;
  };
  // 429
  resultMode = '429';
  const pin429 = await mk(861, 201);
  await t.app.results.runOnce();
  let ev = (await events(`where payload->>'event_id' like 'sess_${pin429}%'`))[0];
  assert.equal(ev.status, 'retry_wait');
  assert.equal(ev.last_http_status, 429);
  assert.ok(new Date(ev.next_try_at).getTime() - Date.now() >= 2000, 'Retry-After 3 s hisobga olinsin');
  // navbatdagi vaqt kelmagani uchun keyingi tick yubormaydi
  resultMode = 'ok';
  const before = received.length;
  await t.app.results.runOnce();
  assert.equal(received.length, before);
  await t.db.query(`update result_events set next_try_at = now() where event_id = $1`, [ev.event_id]);
  await t.app.results.runOnce();
  ev = (await events(`where event_id = '${ev.event_id}'`))[0];
  assert.equal(ev.status, 'delivered');
  assert.equal(ev.send_attempts, 2);

  // 500 → retry_wait (1 s), keyin ok
  resultMode = '500';
  const pin500 = await mk(861, 202);
  await t.app.results.runOnce();
  ev = (await events(`where payload->>'event_id' like 'sess_${pin500}%'`))[0];
  assert.deepEqual([ev.status, ev.last_http_status], ['retry_wait', 500]);
  resultMode = 'ok';
  await t.db.query(`update result_events set next_try_at = now() where event_id = $1`, [ev.event_id]);
  await t.app.results.runOnce();
  assert.equal((await events(`where event_id = '${ev.event_id}'`))[0].status, 'delivered');

  // 422 → manual_review, avto-takror yo'q
  resultMode = '422';
  const pin422 = await mk(861, 203);
  await t.app.results.runOnce();
  ev = (await events(`where payload->>'event_id' like 'sess_${pin422}%'`))[0];
  assert.deepEqual([ev.status, ev.last_http_status], ['manual_review', 422]);
  assert.match(ev.last_error, /Validation/);
  const cnt = received.length;
  await t.db.query(`update result_events set next_try_at = now() - interval '1 hour' where event_id = $1`, [ev.event_id]);
  await t.app.results.runOnce();
  assert.equal(received.length, cnt, 'manual_review qayta yuborilmaydi');

  // admin requeue → pending → yuboriladi (dup=200 → delivered)
  resultMode = 'dup';
  const rq = await t.app.inject({ method: 'POST', url: `/admin/api/results/${ev.event_id}/requeue`, headers: { authorization: 'Basic ' + Buffer.from('admin:test-admin-parol-12').toString('base64') } });
  assert.equal(rq.statusCode, 200);
  await new Promise((res) => setTimeout(res, 200));
  await t.app.results.runOnce();
  ev = (await events(`where event_id = '${ev.event_id}'`))[0];
  assert.deepEqual([ev.status, ev.last_http_status, ev.response.data.duplicate], ['delivered', 200, true]);
});

test('tarmoq xatosi → retry_wait; admin overview/results; auth yo\'q → 401', async () => {
  resultMode = 'net';
  const m = (await join(await mintToken({ role: 'mentor', sub: 204, gid: 861, jti: 'r-net' }), { lesson_id: LESSON })).json();
  const s = (await join(await mintToken({ role: 'student', sub: 3001, name: 'Ali', jti: 'r-net-s' }), { lesson_id: LESSON })).json();
  await answer(m.pin, s, 4, 's4', 1);
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  await new Promise((res) => setTimeout(res, 300));
  await t.app.results.runOnce();
  const ev = (await events(`where payload->>'event_id' like 'sess_${m.pin}%'`))[0];
  assert.deepEqual([ev.status, ev.last_http_status], ['retry_wait', null]);
  resultMode = 'ok';

  const ov = await adminGet('/admin/api/overview');
  assert.equal(ov.statusCode, 200);
  const o = ov.json();
  assert.ok(o.queue.delivered >= 4, JSON.stringify(o.queue));
  assert.ok(Array.isArray(o.recent) && o.recent.length > 0);
  const list = await adminGet('/admin/api/results?status=retry_wait');
  assert.ok(list.json().some((e) => e.event_id === ev.event_id));
  assert.ok(!('payload' in list.json()[0]), 'ro\'yxatda payload yo\'q');
  const one = await adminGet(`/admin/api/results/${ev.event_id}`);
  assert.equal(one.json().payload.mode, 'live');
  const html = await adminGet('/admin');
  assert.match(html.headers['content-type'], /text\/html/);
  const noauth = await t.app.inject({ method: 'GET', url: '/admin/api/overview' });
  assert.equal(noauth.statusCode, 401);
  assert.match(noauth.headers['www-authenticate'], /Basic/);
  const wrong = await t.app.inject({ method: 'GET', url: '/admin/api/overview', headers: { authorization: 'Basic ' + Buffer.from('admin:yomon').toString('base64') } });
  assert.equal(wrong.statusCode, 401);
});

test('admin o\'chiq (env yo\'q) → 404', async () => {
  const off = await makeTestApp({}, { lms: true, fetchImpl: fetchStub });
  try {
    const r = await off.app.inject({ method: 'GET', url: '/admin/api/overview' });
    assert.equal(r.statusCode, 404);
  } finally { await off.close(); }
});
