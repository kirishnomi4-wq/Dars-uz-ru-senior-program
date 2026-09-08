// RESULT_DETAILS=a: natija-hodisasi ichida lang + questions[] (har urinish, matnlar) + achievements[] (katalogdan nom/ta'rif).
// Manba: answer_attempts (record_attempt), live_answers (ball), achievement_events (progress earned), lesson_catalog.achievements.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
const CATALOG_ACH = [
  { id: 'firstwin', name: 'Bullseye!', title_uz: "Birinchi test savoliga to'g'ri javob berdingiz", title_ru: 'Вы правильно ответили на первый вопрос теста' },
  { id: 'graduate', name: 'Level Up!', title_uz: 'Internet darsini to\'liq yakunladingiz', title_ru: 'Вы полностью прошли урок об интернете' },
];
let t;
const received = [];
const ctxFetch = fakeSchoolApi({ 3001: [861], 3003: [862] });
async function fetchStub(url, init) {
  if (String(url).endsWith('/integrations/dars-platform/lesson-results')) {
    const payload = JSON.parse(init.body);
    received.push({ payload, bytes: Buffer.byteLength(init.body, 'utf8') });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [], reward_status: 'pending_policy' } }), { status: 201, headers: { 'content-type': 'application/json', 'x-request-id': `req-${received.length}` } });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({ RESULT_DETAILS: 'a' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON], { achievements: CATALOG_ACH });
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, TEST_MENTOR_CODE, '{"s4":1,"s9":2,"quiz-0":0}']);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const stu = (sub, name, jti) => mintToken({ role: 'student', sub, name, jti });
const texts = (lang, picked) => ({ question: lang === 'ru' ? 'Что такое интернет?' : 'Internet nima?', options: ['A', 'B', 'C', 'D'], picked, correct: 'B', lang });
const record = (pin, p, screen, qid, picked, elapsed, tx) => rpc('record_attempt', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_elapsed_ms: elapsed, ...(tx ? { p_texts: tx } : {}) });
const submit = (pin, p, screen, qid, picked) => rpc('submit_answer', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_correct: false, p_elapsed_ms: 1000 });
const progress = (tok, attemptId, body) => t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: attemptId, screen: 5, total: 22, answers: {}, client_ts: Date.now(), ...body }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
const events = async (where = '') => (await t.db.query(`select * from result_events ${where} order by created_at`)).rows;

test('jonli: s4 ikki urinish (noto\'g\'ri→to\'g\'ri) + s9 faqat submit_answer + arena; earned camelCase → payloadda questions/achievements', async () => {
  const mentor = (await join(await mintToken({ role: 'mentor', sub: 145, gid: 861, jti: 'd-m1' }), { lesson_id: LESSON })).json();
  const ali = (await join(await stu(3001, 'Ali Valiyev', 'd-s1'), { lesson_id: LESSON })).json();
  assert.ok(ali.attempt?.id, 'join urinish qaytaradi');
  assert.equal((await record(mentor.pin, ali, 4, 's4', 0, 4200, texts('ru', 'A'))).json(), 1);
  assert.equal((await record(mentor.pin, ali, 4, 's4', 1, 9800, texts('ru', 'B'))).json(), 2);
  assert.equal((await submit(mentor.pin, ali, 4, 's4', 1)).json(), false, 'ball-qatori record_attempt bilan allaqachon qo\'yilgan');
  assert.equal((await submit(mentor.pin, ali, 9, 's9', 2)).json(), true); // eski uslub: tarixsiz
  await rpc('quiz_control', { p_pin: mentor.pin, p_token: mentor.token, p_state: 'q', p_q: 0 });
  await submit(mentor.pin, ali, 100, 'quiz-0', 0);
  const pr = await progress(await stu(3001, 'Ali Valiyev', 'd-s1p'), ali.attempt.id, { earned: ['firstWin', 'Graduate', 'firstWin', 'yomon id'] });
  assert.equal(pr.statusCode, 200, pr.body);
  const evRows = (await t.db.query('select achievement_id from achievement_events where attempt_id = $1 order by achievement_id', [ali.attempt.id])).rows;
  assert.deepEqual(evRows.map((r) => r.achievement_id), ['firstwin', 'graduate'], 'kichik harfga keltirildi, yaroqsiz tashlandi');

  await rpc('end_session', { p_pin: mentor.pin, p_token: mentor.token });
  await new Promise((r) => setTimeout(r, 400));
  await t.app.results.runOnce();
  const [ev] = await events(`where mode = 'live'`);
  assert.ok(ev, 'hodisa kerak');
  assert.equal(ev.status, 'delivered', ev.last_error);
  const s = ev.payload.students[0];
  assert.deepEqual([s.student_id, s.correct_answers, s.answered, s.lang], [3001, 1, 2, 'ru']);
  assert.deepEqual(s.questions.map((q) => [q.question_id, q.kind, q.order, q.correct, q.solved, q.attempts.length]), [['s4', 'test', 1, false, true, 2], ['s9', 'test', 2, true, true, 1], ['quiz-0', 'arena', 3, true, true, 1]]);
  const q4 = s.questions[0];
  assert.deepEqual([q4.question, q4.options, q4.correct_option, q4.correct_answer], ['Что такое интернет?', ['A', 'B', 'C', 'D'], 1, 'B']);
  assert.deepEqual(q4.attempts.map((a) => [a.n, a.option, a.answer, a.correct, a.elapsed_ms]), [[1, 0, 'A', false, 4200], [2, 1, 'B', true, 9800]]);
  assert.ok(q4.attempts.every((a) => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(a.at)));
  assert.ok(new Date(q4.attempts[0].at) <= new Date(q4.attempts[1].at));
  const q9 = s.questions[1];
  assert.ok(!('question' in q9) && !('options' in q9) && q9.correct_option === 2, 'tarixsiz savol: matn yo\'q, kalit bor');
  assert.deepEqual([q9.attempts[0].n, q9.attempts[0].option, q9.attempts[0].correct], [1, 2, true]);
  assert.deepEqual(s.achievements.map((a) => [a.id, a.name, a.title]), [
    ['firstwin', 'Bullseye!', 'Вы правильно ответили на первый вопрос теста'],
    ['graduate', 'Level Up!', 'Вы полностью прошли урок об интернете'],
  ]);
  // School API'ga aynan shu detallar ketdi
  const sent = received.find((r) => r.payload.event_id === ev.event_id);
  assert.ok(sent && sent.payload.students[0].questions.length === 3 && sent.bytes < 1_000_000);
});

test('solo: record_attempt → oxirgi ekran → hodisada questions (uz) + achievements; katalogda yo\'q id → name=id', async () => {
  const s = (await join(await stu(3003, 'Sobir', 'd-s3'), { lesson_id: LESSON })).json();
  assert.equal(s.mode, 'solo');
  assert.equal((await record(s.pin, s, 4, 's4', 1, 3000, texts('uz', 'B'))).json(), 1);
  assert.equal((await record(s.pin, s, 9, 's9', 0, 2000, texts('uz', 'A'))).json(), 1);
  assert.equal((await record(s.pin, s, 9, 's9', 2, 2500, texts('uz', 'C'))).json(), 2);
  const pr = await progress(await stu(3003, 'Sobir', 'd-s3p'), s.attempt.id, { screen: 21, earned: ['graduate', 'secretBadge'] });
  assert.equal(pr.json().status, 'finished');
  await t.app.results.runOnce();
  const ev = (await events(`where mode = 'solo'`))[0];
  assert.ok(ev && ev.status === 'delivered', ev?.last_error);
  const st = ev.payload.students[0];
  assert.deepEqual([st.correct_answers, st.answered, st.completed, st.lang], [1, 2, true, 'uz']);
  assert.deepEqual(st.questions.map((q) => [q.question_id, q.correct, q.solved, q.attempts.length]), [['s4', true, true, 1], ['s9', false, true, 2]]);
  assert.equal(st.questions[0].question, 'Internet nima?');
  assert.deepEqual(st.achievements.map((a) => [a.id, a.name, a.title]), [['graduate', 'Level Up!', 'Internet darsini to\'liq yakunladingiz'], ['secretbadge', 'secretbadge', 'secretbadge']]);
});

test('bayroq off: o\'sha manbadan hodisa detalsiz (maydonlar umuman yo\'q)', async () => {
  const off = await makeTestApp({}, { lms: true, fetchImpl: fetchStub });
  try {
    await off.seedCatalog([LESSON], { achievements: CATALOG_ACH });
    await off.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, TEST_MENTOR_CODE, '{"s4":1}']);
    const s = (await post(off.app, '/api/v1/lms/join', { lesson_id: LESSON }, bearer(await stu(3003, 'Sobir', 'd-off')))).json();
    await post(off.app, '/api/v1/live/rpc/record_attempt', { p_pin: s.pin, p_player_id: s.playerId, p_token: s.playerToken, p_screen: 4, p_question_id: 's4', p_picked: 1, p_elapsed_ms: 10, p_texts: texts('uz', 'B') });
    await off.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: s.attempt.id, screen: 21, total: 22, answers: {}, earned: ['graduate'], client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(await stu(3003, 'Sobir', 'd-off2')) } });
    await off.app.results.runOnce();
    const ev = (await off.db.query(`select payload, status from result_events where mode = 'solo'`)).rows[0];
    assert.ok(ev && ev.status === 'delivered');
    const st = ev.payload.students[0];
    assert.deepEqual([st.correct_answers, st.answered], [1, 1]);
    assert.ok(!('questions' in st) && !('achievements' in st) && !('lang' in st));
  } finally { await off.close(); }
});
