// F-1105-03 S7: qabul ssenariylari (16 §6 1–23 + 25 §12 1–18, bizning tomon — Dars API nima yuboradi).
// Boshqa fayllarda: 1/18 jonli reached_end + practice (v2_flow) · 9 session_closed (v2_flow) · 16/22/25§15 versiya (v2_version)
// · 23 jadval (v2_flow kuzatuv) · 25§17 v1 yonma-yon (v2_flow) · rebuild (v2_admin). CRM tomoni (coin/Learn) — Abdulloh testlari.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';
import { validateV2 } from '../../src/modules/results/v2-builder.js';
import { ARENA_QUESTION_MS } from '../../src/modules/results/v2-service.js';

const LESSON = 'internet-01-v18';
const KEYS = { s4: 1, 'quiz-0': 0, 'quiz-1': 1 };
let t;
let getState = 'queued';
const ctxFetch = fakeSchoolApi({ 9501: [9601], 9502: [9601], 9511: [9611], 9521: [9621], 9531: [9631], 9541: [9641], 9542: [9641], 9551: [9651], 9561: [], 9571: [9671], 9581: [9681] });
async function fetchStub(url, init) {
  const u = String(url);
  if (u.endsWith('/integrations/dars-platform/lesson-results') && init?.method === 'POST') {
    const payload = JSON.parse(init.body);
    const headers = { 'content-type': 'application/json', 'x-request-id': 'req-s' };
    if (payload.schema_version === 2) return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, processing: 'queued' } }), { status: 201, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  const g = /\/lesson-results\/([^/?]+)$/.exec(u);
  if (g) return new Response(JSON.stringify({ data: { event_id: decodeURIComponent(g[1]), accepted: true, processing: getState, error: null } }), { status: 200, headers: { 'content-type': 'application/json' } });
  return ctxFetch(url, init);
}
before(async () => {
  t = await makeTestApp({ RESULT_SCHEMA_V2: 'on' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const join = (tok, body = {}) => post(t.app, '/api/v1/lms/join', { lesson_id: LESSON, ...body }, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, p) => t.db.query(sql, p);
const ev = async (id) => (await q('select * from result_events where event_id = $1', [id])).rows[0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const settle = async () => { await sleep(300); await t.app.results.runOnce(); await t.app.results.runOnce(); };
const progress = (tok, attemptId, body) => t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: attemptId, screen: 3, total: 22, answers: {}, client_ts: Date.now(), ...body }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
let jti = 0;
const tokOf = (o) => mintToken({ jti: `sc-${++jti}`, ...o });
async function liveClass(gid, mentorSub, studentSubs) {
  const m = (await join(await tokOf({ role: 'mentor', sub: mentorSub, gid }), { lesson_version: 'v6', answer_key: KEYS })).json();
  assert.equal(m.mode, 'mentor', JSON.stringify(m));
  const st = [];
  for (const sub of studentSubs) {
    const tok = await tokOf({ role: 'student', sub, name: `S${sub}` });
    const s = (await join(tok)).json();
    assert.equal(s.mode, 'student', JSON.stringify(s));
    st.push({ ...s, tok, sub });
  }
  return { m, st };
}
const qc = (m, state, qi = -1) => rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: state, p_q: qi });
const shown = (m, s, qid = 'quiz-0', order = 1) => q('select arena_shown($1, $2, $3, $4, $5)', [m.pin, s.playerId, s.playerToken, qid, order]);
const iso = (d) => new Date(d).toISOString();
const isoSec = (d) => new Date(Math.floor(new Date(d).getTime() / 1000) * 1000).toISOString().replace('.000Z', 'Z'); // hodisa vaqtlari soniyagacha

test('16#2 / 25§3: arenaga kirdi, javob bermadi → ap_ (shown) + ar_ participated, answered 0, place null, nishonsiz', async () => {
  const { m, st: [a, b] } = await liveClass(9601, 9701, [9501, 9502]);
  await qc(m, 'lobby'); await qc(m, 'q', 0);
  await shown(m, a);
  assert.equal((await rpc('submit_answer', { p_pin: m.pin, p_player_id: b.playerId, p_token: b.playerToken, p_screen: 100, p_question_id: 'quiz-0', p_picked: 0, p_correct: false, p_elapsed_ms: 900 })).statusCode, 200);
  await qc(m, 'done');
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  await settle();
  const apA = await ev(`ap_${a.attempt.id}`), arA = await ev(`ar_${a.attempt.id}`), arB = await ev(`ar_${b.attempt.id}`), apB = await ev(`ap_${b.attempt.id}`);
  for (const e of [apA, arA, arB]) { assert.ok(e); assert.deepEqual(validateV2(e.payload), [], e.event_id); }
  assert.equal(apA.payload.participation.source, 'shown');
  assert.deepEqual([arA.payload.result.participated, arA.payload.result.answered, arA.payload.result.correct_answers, arA.payload.result.place, arA.payload.result.badges, arA.payload.result.points], [true, 0, 0, null, [], 0]);
  assert.deepEqual([arA.payload.details.status, arA.payload.details.available], ['full', 0], '25§12 #12: haqiqiy javobsizlik omitted emas');
  // b: ko'rsatish tasdig'i yo'q, javob bor → participated (manba answer), 1-o'rin
  assert.deepEqual([arB.payload.result.participated, arB.payload.result.answered, arB.payload.result.place, arB.payload.result.badges], [true, 1, 1, ['arena_top_1']]);
  assert.ok(!apB || apB.payload.participation.source === 'answer');
  assert.equal(arA.payload.arena.end_reason, 'mentor');
});

test('16#7 / 25§12 #7: 1-arena nol, 2-arena yuqori → 2-arena student_arena_no 2; 1-ar_ o\'zgarmaydi', async () => {
  const first = await liveClass(9611, 9711, [9511]);
  await qc(first.m, 'lobby'); await qc(first.m, 'q', 0); await shown(first.m, first.st[0]);
  await qc(first.m, 'done'); await rpc('end_session', { p_pin: first.m.pin, p_token: first.m.token });
  await settle();
  const ar1 = await ev(`ar_${first.st[0].attempt.id}`);
  assert.deepEqual([ar1.payload.result.student_arena_no, ar1.payload.result.correct_answers], [1, 0]);
  const before1 = JSON.stringify(ar1.payload);
  const second = await liveClass(9611, 9711, [9511]);
  assert.notEqual(second.st[0].attempt.id, first.st[0].attempt.id);
  await qc(second.m, 'lobby'); await qc(second.m, 'q', 0); await shown(second.m, second.st[0]);
  await rpc('submit_answer', { p_pin: second.m.pin, p_player_id: second.st[0].playerId, p_token: second.st[0].playerToken, p_screen: 100, p_question_id: 'quiz-0', p_picked: 0, p_correct: false, p_elapsed_ms: 800 });
  await qc(second.m, 'done'); await rpc('end_session', { p_pin: second.m.pin, p_token: second.m.token });
  await settle();
  const ar2 = await ev(`ar_${second.st[0].attempt.id}`);
  assert.deepEqual([ar2.payload.result.student_arena_no, ar2.payload.result.correct_answers, ar2.payload.result.place], [2, 1, 1]);
  assert.equal(JSON.stringify((await ev(`ar_${first.st[0].attempt.id}`)).payload), before1);
  const lr2 = await ev(`lr_${second.st[0].attempt.id}`);
  assert.equal(lr2.payload.result.attempt_no, 2);
});

test('16#8 / 25§12 #11: arena_limit — yakun = boshlanish + 45 daqiqa (ishchi kechikishi uzaytirmaydi), chegaradan keyingi javob kirmaydi', async () => {
  const { m, st: [a] } = await liveClass(9621, 9721, [9521]);
  await qc(m, 'lobby'); await qc(m, 'q', 0); await shown(m, a);
  const firstQ = new Date(Date.now() - 50 * 60_000);
  await q('update live_sessions set quiz_first_q_at = $2, quiz_started_at = $2 where pin = $1', [m.pin, firstQ]);
  // ichidagi javob (44-daqiqa) va chegaradan keyingisi (hozir)
  await q(`insert into live_answers (pin, player_id, screen_idx, question_id, picked, correct, elapsed_ms, answered_at) values ($1, $2, 100, 'quiz-0', 0, true, 1000, $3)`, [m.pin, a.playerId, new Date(firstQ.getTime() + 44 * 60_000)]);
  await q(`insert into live_answers (pin, player_id, screen_idx, question_id, picked, correct, elapsed_ms, answered_at) values ($1, $2, 101, 'quiz-1', 1, true, 1000, now())`, [m.pin, a.playerId]);
  await t.app.results.runOnce();
  const ls = (await q('select quiz_state, quiz_done_at, quiz_end_reason from live_sessions where pin = $1', [m.pin])).rows[0];
  assert.deepEqual([ls.quiz_state, ls.quiz_end_reason, iso(ls.quiz_done_at)], ['done', 'arena_limit', iso(firstQ.getTime() + 45 * 60_000)]);
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  await settle();
  const ar = await ev(`ar_${a.attempt.id}`);
  assert.deepEqual(validateV2(ar.payload), []);
  assert.deepEqual([ar.payload.arena.end_reason, ar.payload.arena.finished_at, ar.payload.occurred_at, ar.payload.result.answered, ar.payload.result.correct_answers],
    ['arena_limit', isoSec(firstQ.getTime() + 45 * 60_000), isoSec(firstQ.getTime() + 45 * 60_000), 1, 1]);
});

test('16#8: last_question_timeout — oxirgi savol + 20 s + 1 daqiqa', async () => {
  const { m, st: [a] } = await liveClass(9631, 9731, [9531]);
  await qc(m, 'lobby'); await qc(m, 'q', 0); await shown(m, a); await qc(m, 'q', 1);
  const lastQ = new Date(Date.now() - 3 * 60_000);
  await q('update live_sessions set quiz_started_at = $2 where pin = $1', [m.pin, lastQ]);
  await t.app.results.runOnce();
  const ls = (await q('select quiz_done_at, quiz_end_reason from live_sessions where pin = $1', [m.pin])).rows[0];
  assert.deepEqual([ls.quiz_end_reason, iso(ls.quiz_done_at)], ['last_question_timeout', iso(lastQ.getTime() + ARENA_QUESTION_MS + 60_000)]);
});

test('16#8 / 25§12 #11: session_limit — 2 soat: sessiya, arena, urinishlar yopiladi; yakun = boshlanish + 2 soat; lr_ (session_closed) + ar_', async () => {
  const { m, st: [a, b] } = await liveClass(9641, 9741, [9541, 9542]);
  await qc(m, 'lobby'); await qc(m, 'q', 0); await shown(m, a);
  const start = new Date(Date.now() - 2 * 3600_000 - 10 * 60_000);
  await q('update lms_sessions set started_at = $2 where pin = $1', [m.pin, start]);
  await q('update live_sessions set quiz_first_q_at = $2, quiz_started_at = $2 where pin = $1', [m.pin, new Date(start.getTime() + 100 * 60_000)]);
  await settle();
  const s = (await q('select status, end_reason, finished_at from lms_sessions where pin = $1', [m.pin])).rows[0];
  assert.deepEqual([s.status, s.end_reason, iso(s.finished_at)], ['ended', 'session_limit', iso(start.getTime() + 2 * 3600_000)]);
  const ls = (await q('select status, quiz_end_reason, quiz_done_at from live_sessions where pin = $1', [m.pin])).rows[0];
  assert.deepEqual([ls.status, ls.quiz_end_reason, iso(ls.quiz_done_at)], ['ended', 'session_limit', iso(start.getTime() + 2 * 3600_000)]);
  for (const x of [a, b]) {
    const lr = await ev(`lr_${x.attempt.id}`), ar = await ev(`ar_${x.attempt.id}`);
    assert.ok(lr && ar, `lr_/ar_ ${x.sub}`);
    assert.deepEqual(validateV2(lr.payload), []); assert.deepEqual(validateV2(ar.payload), []);
    assert.deepEqual([lr.payload.result.trigger, lr.payload.result.completed], ['session_closed', false]);
    assert.ok(lr.payload.result.elapsed_sec <= 7200, 'jonli ≤ 2 soat');
    assert.equal(ar.payload.arena.end_reason, 'session_limit');
  }
});

test('16#14b / 25§12 #12: arena boshlanmadi → har o\'quvchiga ar_ not_started; javobsiz lr_ details full available 0', async () => {
  const { m, st: [a] } = await liveClass(9671, 9771, [9571]);
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  await settle();
  const ar = await ev(`ar_${a.attempt.id}`), lr = await ev(`lr_${a.attempt.id}`);
  assert.deepEqual(validateV2(ar.payload), []);
  assert.deepEqual([ar.payload.arena.end_reason, ar.payload.arena.started_at, ar.payload.arena.questions_shown, ar.payload.result.participated, ar.payload.result.place], ['not_started', null, 0, false, null]);
  assert.equal(ar.payload.arena.finished_at, ar.payload.occurred_at);
  assert.deepEqual([lr.payload.result.tests.answered, lr.payload.details.status, lr.payload.details.available], [0, 'full', 0]);
  assert.equal(await ev(`ap_${a.attempt.id}`), undefined);
});

test('16#11 / 25§12 #2: jonlida tugatmadi → uyda birinchi marta yakunladi: lr_ #1 completed false, lr_ #2 completed true', async () => {
  const { m, st: [a] } = await liveClass(9651, 9751, [9551]);
  await progress(a.tok, a.attempt.id, { screen: 8 });
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  await settle();
  const lr1 = await ev(`lr_${a.attempt.id}`);
  assert.deepEqual([lr1.payload.mode, lr1.payload.result.trigger, lr1.payload.result.completed, lr1.payload.result.attempt_no], ['live', 'session_closed', false, 1]);
  // keyinroq uyda: LMS yangi token beradi (yangi jti — eskisi jonli sessiyaga bog'langan)
  const home = await tokOf({ role: 'student', sub: 9551, name: 'S9551' });
  const again = (await join(home)).json();
  assert.equal(again.mode, 'review');
  const rr = await post(t.app, '/api/v1/lms/restart', { lesson_id: LESSON, lesson_version: 'v6' }, bearer(home));
  const r = rr.json();
  assert.equal(r.mode, 'solo', rr.body);
  assert.equal((await progress(home, r.attempt.id, { screen: 21, lesson_version: 'v6' })).json().status, 'finished');
  await settle();
  const lr2 = await ev(`lr_${r.attempt.id}`);
  assert.deepEqual(validateV2(lr2.payload), []);
  assert.deepEqual([lr2.payload.mode, lr2.payload.result.trigger, lr2.payload.result.completed, lr2.payload.result.attempt_no, 'session_key' in lr2.payload], ['solo', 'reached_end', true, 2, false]);
  assert.equal(await ev(`ar_${r.attempt.id}`), undefined, 'uyda arena hodisasi yo\'q');
});

test('16#14a / 16#19 / 16#21: uyda 7 kun tugatmadi (versiyasiz) → solo_expired, occurred_at = ochilish + 7 kun, elapsed 604800, version unknown', async () => {
  const tok = await tokOf({ role: 'student', sub: 9561, name: 'S9561' });
  const s = (await join(tok)).json();
  assert.equal(s.mode, 'solo');
  await q('select screen_open($1, $2, $3, 2, $4, true, 1)', [s.pin, s.playerId, s.playerToken, 's2']);
  const opened = new Date(Date.now() - 8 * 86400_000);
  await q('update attempts set started_at = $2 where id = $1', [s.attempt.id, opened]);
  const { runLmsMaintenance } = await import('../../src/modules/lms/maintenance.js');
  await runLmsMaintenance(t.db, { info() {}, warn() {}, error() {} });
  await settle();
  const lr = await ev(`lr_${s.attempt.id}`);
  assert.ok(lr);
  assert.deepEqual(validateV2(lr.payload), []);
  assert.deepEqual([lr.payload.result.trigger, lr.payload.result.completed, lr.payload.result.elapsed_sec, lr.payload.lesson_version, lr.payload.version_source],
    ['solo_expired', false, 604800, null, 'unknown']);
  assert.equal(new Date(lr.payload.occurred_at).getTime(), opened.getTime() + 7 * 86400_000 - (opened.getTime() % 1000));
  assert.equal(lr.status, 'delivered', 'manual_review emas');
});

test('16#23 / 25§12 #16: 201 dan keyin uzoq queued — 60 daqiqadan keyin ogohlantirish, 24 soatdan keyin review; applied/failed yakuniy', async () => {
  const id = (await q(`select event_id from result_events where schema_version = 2 and status = 'delivered' order by created_at limit 1`)).rows[0].event_id;
  getState = 'queued';
  await q(`update result_events set processing_status = 'queued', delivered_at = now() - interval '25 hours', processing_next_at = now() - interval '1 second' where event_id = $1`, [id]);
  await t.app.results.runOnce();
  const e = await ev(id);
  assert.deepEqual([e.processing_status, e.processing_next_at], ['review', null]);
  // ikkinchisi: 90 daqiqa — hali kuzatiladi (review emas), keyingi tekshiruv rejalashtirilgan
  const id2 = (await q(`select event_id from result_events where schema_version = 2 and status = 'delivered' and event_id <> $1 order by created_at limit 1`, [id])).rows[0].event_id;
  await q(`update result_events set processing_status = 'queued', delivered_at = now() - interval '90 minutes', processing_next_at = now() - interval '1 second' where event_id = $1`, [id2]);
  await t.app.results.runOnce();
  const e2 = await ev(id2);
  assert.equal(e2.processing_status, 'queued');
  assert.ok(new Date(e2.processing_next_at) > new Date());
  getState = 'failed';
  await q(`update result_events set processing_next_at = now() - interval '1 second' where event_id = $1`, [id2]);
  await t.app.results.runOnce();
  assert.equal((await ev(id2)).processing_status, 'failed');
  getState = 'queued';
});

test('S10/L3/L6: screen_open, arena_shown, record_practice HTTP orqali; begona token → xato; ortiqcha maydon → 400', async () => {
  const { m, st: [a] } = await liveClass(9681, 9781, [9581]);
  const base = { p_pin: m.pin, p_player_id: a.playerId, p_token: a.playerToken };
  assert.equal((await rpc('screen_open', { ...base, p_screen: 2, p_screen_id: 's2', p_by_student: true, p_client_ts: Date.now() })).json(), true);
  assert.equal((await rpc('screen_open', { ...base, p_screen: 3, p_by_student: false })).json(), true);
  const sv = (await q('select screen_idx, by_student, closed_at is not null as closed from screen_views where attempt_id = $1 order by opened_at', [a.attempt.id])).rows;
  assert.deepEqual(sv.map((x) => [x.screen_idx, x.by_student, x.closed]), [[2, true, true], [3, false, false]]);
  assert.equal((await rpc('record_practice', { ...base, p_screen: 15, p_screen_id: 's15', p_checked: true, p_correct: false, p_text: 'console.log(1)' })).json(), 1);
  assert.equal((await rpc('record_practice', { ...base, p_screen: 15, p_screen_id: 's15', p_checked: false, p_correct: null })).json(), 2);
  await qc(m, 'lobby'); await qc(m, 'q', 0);
  assert.equal((await rpc('arena_shown', { ...base, p_question_id: 'quiz-0', p_order: 1 })).json(), true);
  assert.equal((await rpc('arena_shown', { ...base, p_question_id: 'quiz-1', p_order: 2 })).json(), false, 'bir marta');
  assert.ok((await rpc('screen_open', { ...base, p_token: '0'.repeat(32), p_screen: 4, p_by_student: true })).statusCode >= 400);
  assert.equal((await rpc('screen_open', { ...base, p_screen: 4, p_by_student: true, x: 1 })).statusCode, 400);
});
