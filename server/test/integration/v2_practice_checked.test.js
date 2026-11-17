// F-1112-06 / F-1117-01: kalitli amaliyot ekranlari (question_keys kind=practice, kaliti 0, matnsiz) v2 lesson_result'da
// tests'ga kirmaydi va tafsilotni buzmaydi. Prod holati: data-intro-04-01 — 4 test + s15/s15b sxema topshiriqlari → «jami 6»,
// 45 hodisaning birortasida 6/6 yo'q, tafsilot omitted:invalid_text (Shahzoda paneli: «сдали 0 из 128»).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';
import { validateV2 } from '../../src/modules/results/v2-builder.js';

const LESSON = 'data-intro-04-01-v18';
let t;
const ctxFetch = fakeSchoolApi({ 8101: [891], 8102: [891] });
async function fetchStub(url, init) {
  const u = String(url);
  if (u.endsWith('/integrations/dars-platform/lesson-results') && init?.method === 'POST') {
    const payload = JSON.parse(init.body);
    const headers = { 'content-type': 'application/json' };
    if (payload.schema_version === 2) return new Response(JSON.stringify({ data: { event_id: payload.event_id, event_type: payload.event_type, accepted: true, duplicate: false, processing: 'queued' } }), { status: 201, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({ RESULT_SCHEMA_V2: 'on', RESULT_DETAILS: 'a' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, params) => t.db.query(sql, params);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const settle = async () => { await sleep(300); let done = 0; for (let i = 0; i < 40 && done < 2; i++) { const r = await t.app.results.runOnce(); if (r?.skipped) { await sleep(100); continue; } done++; } };
const ev = async (id) => (await q('select * from result_events where event_id = $1', [id])).rows[0];
const O4 = ['A javob', 'B javob', 'C javob', 'D javob'];
const base = (pin, p) => ({ p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken });

test('kalitli amaliyot (s15, s15b) testlar sonidan va tafsilotdan chiqadi; practice[] da qoladi', async () => {
  // reliz skripti yuklaydigan savol kalitlari (prod'dagi bilan bir xil: s15/s15b — practice)
  for (const [qid, kind] of [['s4', 'test'], ['s15', 'practice'], ['s15b', 'practice'], ['quiz-0', 'arena']]) {
    await q(`insert into question_keys (lesson_key, lesson_version, question_id, question_key, revision, kind)
             values ('data-intro-04-01', 'v8', $1, 'data-intro-04-01:' || $1, 'aaaaaaaaaaaa', $2)`, [qid, kind]);
  }
  const m = (await join(await mintToken({ role: 'mentor', sub: 811, gid: 891, jti: 'v2p-m' }), { lesson_id: LESSON, lesson_version: 'v8', answer_key: { s4: 0, s15: 0, s15b: 0, 'quiz-0': 0 } })).json();
  assert.equal(m.mode, 'mentor');
  const tok = await mintToken({ role: 'student', sub: 8101, name: 'Bir', jti: 'v2p-s1' });
  const s = (await join(tok, { lesson_id: LESSON })).json();
  assert.equal(s.attempt.lesson_version, 'v8');
  // s4 — matnli test (to'g'ri); s15/s15b — sxema topshiriqlari: ball-qatori matnsiz (dars shunday yozadi) + amaliyot yozuvi
  assert.equal((await rpc('record_attempt', { ...base(m.pin, s), p_screen: 4, p_question_id: 's4', p_picked: 0, p_elapsed_ms: 2000, p_texts: { question: 'Savol 4?', options: O4, picked: O4[0], correct: O4[0], lang: 'uz' } })).statusCode, 200);
  for (const [sc, qid] of [[15, 's15'], [16, 's15b']]) {
    assert.equal((await rpc('submit_answer', { ...base(m.pin, s), p_screen: sc, p_question_id: qid, p_picked: 1, p_correct: false, p_elapsed_ms: 1500 })).statusCode, 200);
    await q('select record_practice($1, $2, $3, $4, $5, true, true, null)', [m.pin, s.playerId, s.playerToken, sc, qid]);
  }
  const pr = await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: s.attempt.id, screen: 22, total: 23, answers: {}, client_ts: Date.now() }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
  assert.equal(pr.json().reached_end, true, pr.body);
  await settle();
  const lr = await ev(`lr_${s.attempt.id}`);
  assert.ok(lr, 'lr_ yaratildi');
  const p = lr.payload;
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual(p.result.tests, { total_questions: 1, answered: 1, correct_answers: 1 }); // tuzatishsiz: 3 / 3 / 1
  assert.deepEqual(p.result.badges, ['all_correct', 'first_try', 'graduate']);
  assert.deepEqual(p.details, { status: 'full', reason: null, available: 1 }); // tuzatishsiz: omitted:invalid_text
  assert.deepEqual(p.questions.map((x) => [x.question_id, x.kind, x.correct]), [['s4', 'test', true]]);
  assert.deepEqual(p.practice.map((x) => [x.screen_id, x.checked, x.correct]), [['s15', true, true], ['s15b', true, true]]);
});
