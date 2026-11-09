// F-1105-03 S1 (2026-11-09): migratsiya 0012 — v2 sxemasi va yangi SQL funksiyalar (arena_shown, screen_open, record_practice,
// quiz_close, set_quiz_keys_v, quiz_control kengaytmasi). Kontrakt: 25-YAKUNIY (Abdulloh), Shahzoda 04/05.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
let t;

before(async () => {
  t = await makeTestApp({}, { lms: true, fetchImpl: fakeSchoolApi({ 7001: [871], 7002: [871], 7101: [872], 7102: [872], 7103: [872] }) });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, { authorization: `Bearer ${tok}` });
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, params) => t.db.query(sql, params);

test('0012: jadvallar va ustunlar bor; result_events noyoblik v1/v2 ajratilgan', async () => {
  const { rows } = await q(`select table_name from information_schema.tables where table_schema = 'public' and table_name = any($1::text[]) order by 1`,
    [['arena_participants', 'screen_views', 'practice_attempts', 'quiz_key_versions', 'question_keys']]);
  assert.deepEqual(rows.map((r) => r.table_name), ['arena_participants', 'practice_attempts', 'question_keys', 'quiz_key_versions', 'screen_views']);
  const cols = (await q(`select column_name from information_schema.columns where table_name = 'result_events' and column_name = any($1::text[])`,
    [['schema_version', 'event_type', 'student_id', 'occurred_at', 'processing_status', 'processing_next_at', 'processing_checked_at', 'processing_response']])).rows.length;
  assert.equal(cols, 8);
  const att = (await q(`select column_name from information_schema.columns where table_name = 'attempts' and column_name in ('lesson_version', 'version_source')`)).rows.length;
  assert.equal(att, 2);
  const idx = (await q(`select indexname from pg_indexes where tablename = 'result_events' and indexname like 'result_events_%' order by 1`)).rows.map((r) => r.indexname);
  assert.ok(idx.includes('result_events_v2_attempt_type_idx') && idx.includes('result_events_live_session_idx') && idx.includes('result_events_solo_attempt_idx'));
});

test('0012: version_source/lesson_version moslik cheklovi; finish_reason version_changed; end_reason session_limit', async () => {
  await assert.rejects(q(`insert into attempts (subject_id, lesson_id, kind, lesson_version, version_source) values (1, 'x', 'solo', 'v5', 'unknown')`), /attempts_version_source_consistent/);
  const { rows: [a] } = await q(`insert into attempts (subject_id, lesson_id, kind, lesson_version, version_source) values (1, 'x', 'solo', 'v5', 'attempt') returning id`);
  await q(`update attempts set status = 'finished', finish_reason = 'version_changed', finished_at = now() where id = $1`, [a.id]);
  const { rows: [b] } = await q(`select finish_reason from attempts where id = $1`, [a.id]);
  assert.equal(b.finish_reason, 'version_changed');
  await assert.rejects(q(`update attempts set finish_reason = 'boshqa' where id = $1`, [a.id]), /attempts_finish_reason_check/);
});

test('0012: set_quiz_keys_v — joriy va versiyali kalitlar; versiyasiz faqat joriy', async () => {
  const n = (await q(`select set_quiz_keys_v($1, $2, $3, $4)`, ['v-dars', 'v5', TEST_MENTOR_CODE, '{"s4":1,"s9":2,"quiz-0":0}'])).rows[0].set_quiz_keys_v;
  assert.equal(n, 3);
  assert.equal((await q(`select count(*)::int as n from quiz_keys where lesson_id = 'v-dars'`)).rows[0].n, 3);
  assert.equal((await q(`select count(*)::int as n from quiz_key_versions where lesson_id = 'v-dars' and lesson_version = 'v5'`)).rows[0].n, 3);
  await q(`select set_quiz_keys_v($1, $2, $3, $4)`, ['v-dars', 'v6', TEST_MENTOR_CODE, '{"s4":3}']); // yangi versiya — eski v5 kaliti o'zgarmaydi
  assert.deepEqual((await q(`select lesson_version, correct_idx from quiz_key_versions where lesson_id = 'v-dars' and question_id = 's4' order by 1`)).rows, [{ lesson_version: 'v5', correct_idx: 1 }, { lesson_version: 'v6', correct_idx: 3 }]);
  assert.equal((await q(`select correct_idx from quiz_keys where lesson_id = 'v-dars' and question_id = 's4'`)).rows[0].correct_idx, 3, 'joriy kalit yangilanadi (eski xulq)');
  await q(`select set_quiz_keys_v($1, $2, $3, $4)`, ['v-dars', null, TEST_MENTOR_CODE, '{"s4":2}']);
  assert.equal((await q(`select count(*)::int as n from quiz_key_versions where lesson_id = 'v-dars'`)).rows[0].n, 4, 'versiyasiz chaqiruv versiyali jadvalga yozmaydi');
  await assert.rejects(q(`select set_quiz_keys_v($1, $2, $3, $4)`, ['v-dars', 'v7', 'notogri', '{"s4":2}']), /Mentor kodi/);
});

test('0012: jonli dars — quiz_control quiz_max_q/quiz_end_reason; arena_shown bir marta; screen_open; record_practice; quiz_close', async () => {
  const m = (await join(await mintToken({ role: 'mentor', sub: 701, gid: 871, jti: 'v2-m-1' }), { lesson_id: LESSON })).json();
  const stok = await mintToken({ role: 'student', sub: 7001, name: 'O7001', jti: 'v2-s-1' });
  const s = (await join(stok, { lesson_id: LESSON })).json();
  assert.equal(s.mode, 'student');

  // arena hali boshlanmagan — ko'rsatish yozilmaydi
  assert.equal((await q(`select arena_shown($1, $2, $3, 'quiz-0', 1)`, [m.pin, s.playerId, s.playerToken])).rows[0].arena_shown, false);
  // mentor arenani boshladi: lobby → q(0) → q(1)
  for (const [st, qi] of [['lobby', -1], ['q', 0], ['q', 1]]) assert.equal((await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: st, p_q: qi })).statusCode, 204);
  const ls1 = (await q(`select quiz_state, quiz_max_q, quiz_end_reason from live_sessions where pin = $1`, [m.pin])).rows[0];
  assert.deepEqual(ls1, { quiz_state: 'q', quiz_max_q: 1, quiz_end_reason: null });
  // o'quvchi 2-savolni ko'rdi (kech kirgan): birinchi marta true, ikkinchi marta false
  assert.equal((await q(`select arena_shown($1, $2, $3, 'quiz-1', 2)`, [m.pin, s.playerId, s.playerToken])).rows[0].arena_shown, true);
  assert.equal((await q(`select arena_shown($1, $2, $3, 'quiz-1', 2)`, [m.pin, s.playerId, s.playerToken])).rows[0].arena_shown, false);
  const ap = (await q(`select first_question_id, first_question_order, source, attempt_id from arena_participants where pin = $1`, [m.pin])).rows;
  assert.deepEqual([ap.length, ap[0].first_question_id, ap[0].first_question_order, ap[0].source, ap[0].attempt_id], [1, 'quiz-1', 2, 'shown', s.attempt.id]);
  await assert.rejects(q(`select arena_shown($1, $2, $3, 'quiz-1', 2)`, [m.pin, s.playerId, 'f'.repeat(32)]), /Ruxsat/);

  // ekranlar: 1 (o'zi), 2 (mentor almashtirdi), 2 takror (yozilmaydi), 3 (o'zi) → 3 yozuv, 1 va 2 yopilgan
  assert.equal((await q(`select screen_open($1, $2, $3, 1, 's1', true, 1)`, [m.pin, s.playerId, s.playerToken])).rows[0].screen_open, true);
  assert.equal((await q(`select screen_open($1, $2, $3, 2, 's2', false, 2)`, [m.pin, s.playerId, s.playerToken])).rows[0].screen_open, true);
  assert.equal((await q(`select screen_open($1, $2, $3, 2, 's2', false, 3)`, [m.pin, s.playerId, s.playerToken])).rows[0].screen_open, true);
  assert.equal((await q(`select screen_open($1, $2, $3, 3, 's3', true, 4)`, [m.pin, s.playerId, s.playerToken])).rows[0].screen_open, true);
  const sv = (await q(`select screen_idx, by_student, closed_at is not null as closed from screen_views where attempt_id = $1 order by id`, [s.attempt.id])).rows;
  assert.deepEqual(sv, [{ screen_idx: 1, by_student: true, closed: true }, { screen_idx: 2, by_student: false, closed: true }, { screen_idx: 3, by_student: true, closed: false }]);

  // amaliyot: tekshiruvsiz «Bajardim» (correct null bo'ladi, true bersa ham), tekshirilgan 2 urinish, matn 300 ga qirqiladi
  assert.equal((await q(`select record_practice($1, $2, $3, 15, 's15', false, true, null)`, [m.pin, s.playerId, s.playerToken])).rows[0].record_practice, 1);
  assert.equal((await q(`select record_practice($1, $2, $3, 16, 's16', true, false, $4)`, [m.pin, s.playerId, s.playerToken, 'x'.repeat(400)])).rows[0].record_practice, 1);
  assert.equal((await q(`select record_practice($1, $2, $3, 16, 's16', true, true, 'h1 { color: red; }')`, [m.pin, s.playerId, s.playerToken])).rows[0].record_practice, 2);
  const pa = (await q(`select screen_idx, attempt_no, checked, correct, length(text) as len from practice_attempts where attempt_id = $1 order by screen_idx, attempt_no`, [s.attempt.id])).rows;
  assert.deepEqual(pa, [
    { screen_idx: 15, attempt_no: 1, checked: false, correct: null, len: null },
    { screen_idx: 16, attempt_no: 1, checked: true, correct: false, len: 300 },
    { screen_idx: 16, attempt_no: 2, checked: true, correct: true, len: 18 },
  ]);

  // server arenani yopadi (45 daqiqa): birinchi marta true, keyin false; sabab saqlanadi, mentor 'done' uni almashtirmaydi
  assert.equal((await q(`select quiz_close($1, 'arena_limit')`, [m.pin])).rows[0].quiz_close, true);
  assert.equal((await q(`select quiz_close($1, 'session_closed')`, [m.pin])).rows[0].quiz_close, false);
  await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: 'done' });
  const ls2 = (await q(`select quiz_state, quiz_end_reason, quiz_done_at is not null as done from live_sessions where pin = $1`, [m.pin])).rows[0];
  assert.deepEqual(ls2, { quiz_state: 'done', quiz_end_reason: 'arena_limit', done: true });
  // yopiq arenada ko'rsatish yozilmaydi
  const s2 = (await join(await mintToken({ role: 'student', sub: 7002, name: 'O7002', jti: 'v2-s-2' }), { lesson_id: LESSON })).json();
  assert.equal((await q(`select arena_shown($1, $2, $3, 'quiz-2', 3)`, [m.pin, s2.playerId, s2.playerToken])).rows[0].arena_shown, false);

  // v2 result_events noyobligi: bir urinish — har tur bir marta; v1 qatori bilan to'qnashmaydi
  const pl = JSON.stringify({ x: 1 });
  await q(`insert into result_events (event_id, mode, session_id, attempt_id, lesson_id, payload, schema_version, event_type, student_id) values ('lr_a', 'live', $1, $2, $3, $4::jsonb, 2, 'lesson_result', 7001)`, [s.session_id ?? m.session_id, s.attempt.id, LESSON, pl]);
  await q(`insert into result_events (event_id, mode, session_id, attempt_id, lesson_id, payload, schema_version, event_type, student_id) values ('ar_a', 'live', $1, $2, $3, $4::jsonb, 2, 'arena_result', 7001)`, [m.session_id, s.attempt.id, LESSON, pl]);
  await assert.rejects(q(`insert into result_events (event_id, mode, session_id, attempt_id, lesson_id, payload, schema_version, event_type, student_id) values ('lr_b', 'live', $1, $2, $3, $4::jsonb, 2, 'lesson_result', 7001)`, [m.session_id, s.attempt.id, LESSON, pl]), /result_events_v2_attempt_type_idx/);
  await assert.rejects(q(`insert into result_events (event_id, mode, session_id, lesson_id, payload, schema_version) values ('lr_c', 'live', $1, $2, $3::jsonb, 2)`, [m.session_id, LESSON, pl]), /result_events_v2_consistent/);
  await q(`insert into result_events (event_id, mode, session_id, lesson_id, payload) values ('sess_v1', 'live', $1, $2, $3::jsonb)`, [m.session_id, LESSON, pl]); // v1 — sessiyaga bitta
  await assert.rejects(q(`insert into result_events (event_id, mode, session_id, lesson_id, payload) values ('sess_v1b', 'live', $1, $2, $3::jsonb)`, [m.session_id, LESSON, pl]), /result_events_live_session_idx/);
});

// S2: urinish versiyasi (25 §9): join'dagi lesson_version → attempts (attempt); yo'q → null/unknown; jonli — sessiya versiyasi; mentor kalitlari versiyali
test('S2: solo join lesson_version bilan → attempt/vN; versiyasiz → unknown; mentor answer_key → quiz_key_versions; jonli o\'quvchi sessiya versiyasini oladi', async () => {
  const solo1 = (await join(await mintToken({ role: 'student', sub: 7101, name: 'S1', jti: 'v2-ver-1' }), { lesson_id: LESSON, lesson_version: 'v5' })).json();
  assert.equal(solo1.mode, 'solo');
  assert.deepEqual((await q(`select lesson_version, version_source from attempts where id = $1`, [solo1.attempt.id])).rows[0], { lesson_version: 'v5', version_source: 'attempt' });
  const solo2 = (await join(await mintToken({ role: 'student', sub: 7102, name: 'S2', jti: 'v2-ver-2' }), { lesson_id: LESSON })).json();
  assert.deepEqual((await q(`select lesson_version, version_source from attempts where id = $1`, [solo2.attempt.id])).rows[0], { lesson_version: null, version_source: 'unknown' });

  // mentor v6 bilan ochdi, kalit yubordi → sessiya v6, kalitlar v6 ostida; o'quvchi yuki v5 desa ham urinish v6 (mentor ochgan versiya)
  const m = (await join(await mintToken({ role: 'mentor', sub: 702, gid: 872, jti: 'v2-ver-m' }), { lesson_id: LESSON, lesson_version: 'v6', answer_key: { s4: 1, s9: 2 } })).json();
  assert.equal(m.mode, 'mentor');
  assert.equal((await q(`select lesson_version from lms_sessions where id = $1`, [m.session_id])).rows[0].lesson_version, 'v6');
  assert.equal((await q(`select count(*)::int as n from quiz_key_versions where lesson_id = $1 and lesson_version = 'v6'`, [LESSON])).rows[0].n, 2);
  const live = (await join(await mintToken({ role: 'student', sub: 7103, name: 'S3', jti: 'v2-ver-3' }), { lesson_id: LESSON, lesson_version: 'v5' })).json();
  assert.equal(live.mode, 'student');
  assert.deepEqual((await q(`select lesson_version, version_source from attempts where id = $1`, [live.attempt.id])).rows[0], { lesson_version: 'v6', version_source: 'attempt' });
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
});
