// 0005: record_attempt (har urinish tarixi + birinchi urinishda ball-qatori) va achievement_events (yutuq-vaqtlari).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, TEST_MENTOR_CODE } from '../helpers/app.js';

let t;
before(async () => { t = await makeTestApp(); });
after(async () => { await t?.close(); });
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);

async function session(lesson) {
  await rpc('set_quiz_keys', { p_lesson_id: lesson, p_mentor_code: TEST_MENTOR_CODE, p_keys: { s4: 1, s7: 2 } });
  const s = (await rpc('create_session', { p_lesson_id: lesson, p_mentor_code: TEST_MENTOR_CODE })).json()[0];
  const p = (await rpc('join_session', { p_pin: s.pin, p_nickname: 'Ali' })).json()[0];
  return { s, p };
}
const texts = { question: 'Internet nima?', options: ['A', "Kompyuterlar tarmog'i", 'C', 'D'], picked: 'A', correct: "Kompyuterlar tarmog'i", lang: 'uz' };

test("record_attempt: urinishlar tartib bilan, to'g'rilik serverdan, birinchi urinish = ball-qatori", async () => {
  const { s, p } = await session('att-lesson-v18');
  const base = { p_pin: s.pin, p_player_id: p.player_id, p_token: p.token, p_screen: 4, p_question_id: 's4', p_elapsed_ms: 4200 };
  const r1 = await rpc('record_attempt', { ...base, p_picked: 0, p_texts: texts });
  assert.equal(r1.statusCode, 200, r1.body);
  assert.equal(r1.json(), 1);
  const r2 = await rpc('record_attempt', { ...base, p_picked: 1, p_elapsed_ms: 9800, p_texts: { ...texts, picked: "Kompyuterlar tarmog'i" } });
  assert.equal(r2.json(), 2);

  const { rows } = await t.db.query('select attempt_no, picked, correct, elapsed_ms, texts from answer_attempts where player_id = $1 order by attempt_no', [p.player_id]);
  assert.deepEqual(rows.map((r) => [r.attempt_no, r.picked, r.correct, r.elapsed_ms]), [[1, 0, false, 4200], [2, 1, true, 9800]]);
  assert.equal(rows[0].texts.question, 'Internet nima?');
  assert.equal(rows[1].texts.picked, "Kompyuterlar tarmog'i");

  // ball = birinchi urinish (noto'g'ri), ikkinchi urinish ballni o'zgartirmaydi
  const { rows: score } = await t.db.query('select picked, correct from live_answers where player_id = $1 and screen_idx = 4', [p.player_id]);
  assert.deepEqual(score, [{ picked: 0, correct: false }]);

  // jonli darsda submit_answer ham chaqiriladi — idempotent, ball o'zgarmaydi
  const dup = await rpc('submit_answer', { ...base, p_picked: 1, p_correct: true });
  assert.equal(dup.json(), false);
});

test('record_attempt: 10 tadan keyin 0 (yozilmaydi); texts 4 KB dan katta bo\'lsa null; begona token → xato', async () => {
  const { s, p } = await session('att-lesson-2-v18');
  const base = { p_pin: s.pin, p_player_id: p.player_id, p_token: p.token, p_screen: 7, p_question_id: 's7', p_elapsed_ms: 1 };
  let last;
  for (let i = 0; i < 11; i++) last = (await rpc('record_attempt', { ...base, p_picked: i % 4 })).json();
  assert.equal(last, 0);
  const { rows: [{ n }] } = await t.db.query('select count(*)::int as n from answer_attempts where player_id = $1 and screen_idx = 7', [p.player_id]);
  assert.equal(n, 10);

  // API orqali eng katta ruxsatli matn (sxema: 300 belgi × 9 maydon ≈ 2,8 KB) saqlanadi
  const big = await rpc('record_attempt', { ...base, p_screen: 8, p_question_id: 's8', p_picked: 0, p_texts: { question: 'x'.repeat(300), options: Array(6).fill('y'.repeat(300)), picked: 'z'.repeat(300), correct: 'w'.repeat(300) } });
  assert.equal(big.json(), 1);
  const { rows: [b] } = await t.db.query('select texts from answer_attempts where player_id = $1 and screen_idx = 8', [p.player_id]);
  assert.equal(b.texts.question.length, 300);
  // SQL-darajasida 4 KB dan katta jsonb (sxemani chetlab) → texts null, urinish baribir yoziladi
  const huge = JSON.stringify({ question: 'q'.repeat(5000) });
  const { rows: [{ n: n9 }] } = await t.db.query('select record_attempt($1, $2, $3, 9, $4, 0, 1, $5::jsonb) as n', [s.pin, p.player_id, p.token, 's9', huge]);
  assert.equal(n9, 1);
  const { rows: [h] } = await t.db.query('select texts from answer_attempts where player_id = $1 and screen_idx = 9', [p.player_id]);
  assert.equal(h.texts, null);

  const stolen = await rpc('record_attempt', { ...base, p_token: 'f'.repeat(32), p_picked: 0 });
  assert.equal(stolen.statusCode, 400);
  assert.equal(stolen.json().message, "Ruxsat yo'q");
  const badTexts = await rpc('record_attempt', { ...base, p_picked: 0, p_texts: { question: 'q', extra: 1 } });
  assert.equal(badTexts.statusCode, 400);
});
