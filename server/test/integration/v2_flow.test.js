// F-1105-03 S4: v2 oqimi uchidan-uchigacha (RESULT_SCHEMA_V2=on) — 25-kontrakt §4–7.
// Soxta School API: POST lesson-results (v2 → 201 processing:queued; v1 → 201 students_accepted), GET → applied.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';
import { validateV2 } from '../../src/modules/results/v2-builder.js';

const LESSON = 'internet-01-v18';
let t;
const received = [];
const gets = [];
const ctxFetch = fakeSchoolApi({ 8001: [881], 8002: [881], 8003: [881] });
async function fetchStub(url, init) {
  const u = String(url);
  if (u.endsWith('/integrations/dars-platform/lesson-results') && init?.method === 'POST') {
    const payload = JSON.parse(init.body);
    received.push(payload);
    const headers = { 'content-type': 'application/json', 'x-request-id': `req-${received.length}` };
    if (payload.schema_version === 2) return new Response(JSON.stringify({ data: { event_id: payload.event_id, event_type: payload.event_type, accepted: true, duplicate: false, processing: 'queued' } }), { status: 201, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  const g = /\/lesson-results\/([^/?]+)$/.exec(u);
  if (g) {
    const id = decodeURIComponent(g[1]); gets.push(id);
    return new Response(JSON.stringify({ data: { event_id: id, event_type: id.startsWith('lr_') ? 'lesson_result' : 'arena_result', accepted: true, processing: 'applied', class_done: id.startsWith('lr_'), learn_done: false, coins: 0, coins_reason: 'rule', error: null } }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({ RESULT_SCHEMA_V2: 'on', RESULT_DETAILS: 'a' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON], { achievements: [{ id: 'firstwin', name: 'First Win', title_uz: 'Birinchi g\'alaba' }] });
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, params) => t.db.query(sql, params);
const record = (pin, p, screen, qid, picked, elapsed, tx) => rpc('record_attempt', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_elapsed_ms: elapsed, ...(tx ? { p_texts: tx } : {}) });
const submit = (pin, p, screen, qid, picked) => rpc('submit_answer', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_correct: false, p_elapsed_ms: 1500 });
const progress = (tok, attemptId, body) => t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: attemptId, screen: 5, total: 22, answers: {}, client_ts: Date.now(), ...body }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
// Marshrutlar (end_session, progress) o'zlari runOnce'ni fon'da chaqiradi; worker chaqiriqlarni birlashtiradi (band bo'lsa
// kutib, keyin yuradi) — baribir ikki to'liq yurish kutiladi: 1-si hodisani yozadi, 2-si yuboradi/kuzatadi.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const settle = async () => { await sleep(300); let done = 0; for (let i = 0; i < 40 && done < 2; i++) { const r = await t.app.results.runOnce(); if (r?.skipped) { await sleep(100); continue; } done++; } };
const ev = async (id) => (await q('select * from result_events where event_id = $1', [id])).rows[0];
const tx = (qq, opts, ci, picked) => ({ question: qq, options: opts, picked: opts[picked ?? ci], correct: opts[ci], lang: 'uz' });
const O4 = ['A javob', 'B javob', 'C javob', 'D javob'];

let m, s1, s2, tok1, tok2;

test('jonli dars: reached_end → lr_ darhol (pending → delivered, processing queued); tafsilot full; practice; participated', async () => {
  m = (await join(await mintToken({ role: 'mentor', sub: 801, gid: 881, jti: 'v2f-m' }), { lesson_id: LESSON, lesson_version: 'v6', answer_key: { s4: 1, s9: 2, 'quiz-0': 0, 'quiz-1': 1 } })).json();
  assert.equal(m.mode, 'mentor');
  tok1 = await mintToken({ role: 'student', sub: 8001, name: 'Bir', jti: 'v2f-s1' });
  tok2 = await mintToken({ role: 'student', sub: 8002, name: 'Ikki', jti: 'v2f-s2' });
  s1 = (await join(tok1, { lesson_id: LESSON })).json();
  s2 = (await join(tok2, { lesson_id: LESSON })).json();
  assert.equal(s1.mode, 'student'); assert.equal(s2.mode, 'student');
  // 8001: ekranlar o'zi, 2 test (matnli), amaliyot «Bajardim»
  for (const [sc, by] of [[1, true], [4, true], [9, true]]) await q('select screen_open($1, $2, $3, $4, $5, $6, 1)', [m.pin, s1.playerId, s1.playerToken, sc, `s${sc}`, by]);
  assert.equal((await record(m.pin, s1, 4, 's4', 1, 2000, tx('Savol 4?', O4, 1))).statusCode, 200);
  assert.equal((await record(m.pin, s1, 9, 's9', 0, 3000, tx('Savol 9?', O4, 2, 0))).statusCode, 200);
  await q('select record_practice($1, $2, $3, 15, $4, false, true, null)', [m.pin, s1.playerId, s1.playerToken, 's15']);
  // 8002: faqat mentor ekran almashtirdi + bitta javob (texts yo'q) → participated (javob bor), details: s4 matnsiz → omitted
  await q('select screen_open($1, $2, $3, 4, $4, false, 1)', [m.pin, s2.playerId, s2.playerToken, 's4']);
  assert.equal((await submit(m.pin, s2, 4, 's4', 1)).statusCode, 200);
  await progress(tok1, s1.attempt.id, { screen: 10, total: 22, earned: ['firstWin'] });
  const pr = await progress(tok1, s1.attempt.id, { screen: 21, total: 22, earned: ['firstWin'] });
  assert.equal(pr.json().reached_end, true, pr.body);
  await settle();
  const lr1 = await ev(`lr_${s1.attempt.id}`);
  assert.ok(lr1, 'lr_ hodisa yaratildi');
  assert.deepEqual([lr1.schema_version, lr1.event_type, Number(lr1.student_id), lr1.status, lr1.processing_status, lr1.last_http_status], [2, 'lesson_result', 8001, 'delivered', 'queued', 201]);
  const p = lr1.payload;
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.event_id, p.mode, p.lesson_version, p.version_source, p.group_id, p.teacher_id, p.student.student_id], [`lr_${s1.attempt.id}`, 'live', 'v6', 'attempt', 881, 801, 8001]);
  assert.deepEqual([p.result.trigger, p.result.participated, p.result.completed, p.result.attempt_no, p.result.screens], ['reached_end', true, true, 1, { reached: 22, total: 22 }]);
  assert.deepEqual(p.result.tests, { total_questions: 2, answered: 2, correct_answers: 1 });
  assert.deepEqual(p.result.badges, ['graduate']);
  assert.deepEqual(p.practice, [{ screen_id: 's15', done: true, checked: false, correct: null }]);
  assert.deepEqual(p.details, { status: 'full', reason: null, available: 2 });
  assert.deepEqual(p.questions.map((x) => [x.question_id, x.correct]), [['s4', true], ['s9', false]]);
  assert.deepEqual(p.achievements.map((a) => a.id), ['firstwin']);
  assert.ok(p.result.completed_at && p.result.processed_at && p.result.opened_at);
  assert.ok(received.some((r) => r.event_id === `lr_${s1.attempt.id}` && r.schema_version === 2), 'School API ga v2 bilan ketdi');
  // 8002 hali yopilmagan — lr_ yo'q
  assert.equal(await ev(`lr_${s2.attempt.id}`), undefined);
});

test('arena: arena_shown → ap_; 8001 javob; mentor done → sessiya yopilgach ar_ (8001 place 1, 8002 qatnashmagan) va 8002 lr_ session_closed; v1 guruh-xabari ham ketadi', async () => {
  for (const [st, qi] of [['lobby', -1], ['q', 0]]) assert.equal((await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: st, p_q: qi })).statusCode, 204);
  assert.equal((await q('select arena_shown($1, $2, $3, $4, 1)', [m.pin, s1.playerId, s1.playerToken, 'quiz-0'])).rows[0].arena_shown, true);
  await settle();
  const ap = await ev(`ap_${s1.attempt.id}`);
  assert.ok(ap, 'ap_ yaratildi');
  assert.deepEqual(validateV2(ap.payload), []);
  assert.deepEqual([ap.payload.participation.first_question_id, ap.payload.participation.first_question_order, ap.payload.participation.source, ap.payload.participation.student_arena_no, ap.payload.arena.questions_total], ['quiz-0', 1, 'shown', 1, 2]);
  assert.equal(ap.status, 'delivered');
  assert.equal((await submit(m.pin, s1, 100, 'quiz-0', 0)).statusCode, 200);
  await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: 'q', p_q: 1 });
  await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: 'done' });
  assert.equal((await rpc('end_session', { p_pin: m.pin, p_token: m.token })).statusCode, 204);
  await settle();
  const ar1 = await ev(`ar_${s1.attempt.id}`), ar2 = await ev(`ar_${s2.attempt.id}`), lr2 = await ev(`lr_${s2.attempt.id}`);
  assert.ok(ar1 && ar2 && lr2, 'ar_ ×2 va lr_ 8002');
  for (const e of [ar1, ar2, lr2]) assert.deepEqual(validateV2(e.payload), [], e.event_id);
  assert.deepEqual([ar1.payload.arena.end_reason, ar1.payload.arena.questions_shown, ar1.payload.arena.players_total, ar1.payload.result.participated, ar1.payload.result.answered, ar1.payload.result.correct_answers, ar1.payload.result.place, ar1.payload.result.badges, ar1.payload.result.student_arena_no], ['mentor', 2, 2, true, 1, 1, 1, ['arena_top_1'], 1]);
  assert.ok(ar1.payload.result.points > 0);
  assert.deepEqual([ar2.payload.result.participated, ar2.payload.result.participated_at, ar2.payload.result.place, ar2.payload.result.student_arena_no], [false, null, null, null]);
  assert.deepEqual([lr2.payload.result.trigger, lr2.payload.result.completed, lr2.payload.result.participated, lr2.payload.result.tests, lr2.payload.details.status], ['session_closed', false, true, { total_questions: 2, answered: 1, correct_answers: 1 }, 'omitted']);
  assert.ok(!('questions' in lr2.payload));
  assert.ok(ar1.payload.details.status === 'omitted' || ar1.payload.details.status === 'full', 'arena matni darsdan kelmaguncha omitted bo\'lishi mumkin');
  const v1 = (await q(`select event_id, status, schema_version from result_events where session_id = $1 and schema_version = 1`, [m.session_id])).rows;
  assert.equal(v1.length, 1, 'v1 guruh-xabari yonma-yon');
  assert.equal(v1[0].status, 'delivered');
  const v2n = (await q(`select count(*)::int as n from result_events where session_id = $1 and schema_version = 2`, [m.session_id])).rows[0].n;
  assert.equal(v2n, 5, 'lr ×2, ap ×1, ar ×2');
});

test('kuzatuv: processing queued → GET → applied, javob saqlanadi; jadval 1/5/15/60 daqiqa', async () => {
  const id = `lr_${s1.attempt.id}`;
  await q(`update result_events set processing_next_at = now() - interval '1 second' where event_id = $1`, [id]);
  await t.app.results.runOnce();
  const e = await ev(id);
  assert.deepEqual([e.processing_status, e.processing_response?.data?.processing, e.processing_response?.data?.coins_reason, e.processing_next_at], ['applied', 'applied', 'rule', null]);
  assert.ok(gets.includes(id));
  const { nextProcessingCheck } = await import('../../src/modules/results/v2-service.js');
  const d = new Date('2026-11-10T10:00:00Z');
  assert.deepEqual([0.5, 3, 10, 30, 90, 150].map((min) => (nextProcessingCheck(d, new Date(d.getTime() + min * 60_000)).getTime() - d.getTime()) / 60_000), [1, 5, 15, 60, 120, 180]);
});

test('solo: versiyali urinish, oxirgi ekran → lr_ (reached_end, completed, session maydonlari yo\'q); boshlangan v1 solo hodisasi ham', async () => {
  const tok3 = await mintToken({ role: 'student', sub: 8003, name: 'Uch', jti: 'v2f-s3' });
  const s3 = (await join(tok3, { lesson_id: LESSON, lesson_version: 'v6' })).json();
  assert.equal(s3.mode, 'solo');
  await q('select screen_open($1, $2, $3, 2, $4, true, 1)', [s3.pin, s3.playerId, s3.playerToken, 's2']);
  assert.equal((await record(s3.pin, s3, 4, 's4', 1, 2000, tx('Savol 4?', O4, 1))).statusCode, 200);
  const pr = await progress(tok3, s3.attempt.id, { screen: 21, total: 22 });
  assert.equal(pr.json().status, 'finished');
  await settle();
  const lr = await ev(`lr_${s3.attempt.id}`);
  assert.ok(lr);
  assert.deepEqual(validateV2(lr.payload), []);
  assert.deepEqual([lr.payload.mode, lr.payload.lesson_version, lr.payload.result.trigger, lr.payload.result.completed, lr.payload.result.tests.answered, 'session_key' in lr.payload], ['solo', 'v6', 'reached_end', true, 1, false]);
  assert.equal(lr.status, 'delivered');
});

test('flag o\'chiq bo\'lsa v2 yaratilmaydi (alohida ilova)', async () => {
  const off = await makeTestApp({ RESULT_SCHEMA_V2: 'off' }, { lms: true, fetchImpl: fetchStub });
  try {
    await off.seedCatalog([LESSON]);
    const tok = await mintToken({ role: 'student', sub: 8003, name: 'Uch', jti: 'v2f-off' });
    const s = (await join_(off, tok)).json();
    await off.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: s.attempt.id, screen: 21, total: 22, answers: {}, client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
    await new Promise((r) => setTimeout(r, 300)); await off.app.results.runOnce(); await off.app.results.runOnce();
    const n = (await off.db.query(`select count(*)::int as n from result_events where schema_version = 2`)).rows[0].n;
    const v1 = (await off.db.query(`select count(*)::int as n from result_events where schema_version = 1`)).rows[0].n;
    assert.deepEqual([n, v1], [0, 1]);
  } finally { await off.close(); }
  function join_(appT, tok) { return post(appT.app, '/api/v1/lms/join', { lesson_id: LESSON }, bearer(tok)); }
});
