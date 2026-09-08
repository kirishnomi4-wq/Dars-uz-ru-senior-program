// node --test src/live/resultDetails.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildResultDetails, logAttempt, noteEarned, resetResultDetails } from './resultDetails.js';

const META = [{ id: 's0' }, { id: 's1' }, { id: 's4', scored: true }, { id: 's5b', scored: true }, { id: 's9', scored: true }];
const ACH = { firstWin: { name: 'Bullseye!', desc: { uz: 'Birinchi savol', ru: 'Первый вопрос' } }, graduate: { name: 'Level Up!', desc: 'Darsni tugatdingiz' } };
const T0 = Date.parse('2026-09-08T10:00:00Z');

test('savollar: faqat scored+javob berilgan; birinchi urinish = correct; tarixdan urinishlar; matnlar', () => {
  resetResultDetails('L1');
  logAttempt('L1', 2, { picked: 0, texts: { picked: 'A' }, elapsedMs: 4200 });
  logAttempt('L1', 2, { picked: 1, texts: { picked: 'B' }, elapsedMs: 9800 });
  const answers = {
    2: { question: 'Internet nima?', options: ['A', 'B', 'C', 'D'], correctIndex: 1, correctAnswer: 'B', picked: 0, studentAnswer: 'A', correct: false, solved: true },
    3: { question: 'Ikkinchi', options: [{ uz: 'bir', ru: 'один' }, { uz: 'ikki', ru: 'два' }], correctIndex: 0, picked: 0, correct: true },
    4: { mentorRevealed: true },
  };
  const d = buildResultDetails({ lessonId: 'L1', screenMeta: META, answers, earned: new Set(['firstWin', 'graduate']), achievements: ACH, lang: 'uz', now: T0 });
  assert.equal(d.lang, 'uz');
  assert.deepEqual(d.questions.map((q) => [q.question_id, q.order, q.correct, q.solved, q.attempts.length]), [['s4', 1, false, true, 2], ['s5b', 2, true, true, 1]]);
  const q = d.questions[0];
  assert.deepEqual([q.question, q.options, q.correct_option, q.correct_answer], ['Internet nima?', ['A', 'B', 'C', 'D'], 1, 'B']);
  assert.deepEqual(q.attempts.map((a) => [a.n, a.option, a.answer, a.correct, a.elapsed_ms]), [[1, 0, 'A', false, 4200], [2, 1, 'B', true, 9800]]);
  assert.match(q.attempts[0].at, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/);
  const q2 = d.questions[1];
  assert.deepEqual(q2.options, ['bir', 'ikki']); // obyekt-variantlar tilga qarab
  assert.deepEqual(q2.attempts, [{ n: 1, option: 0, correct: true, elapsed_ms: 0, at: '2026-09-08T10:00:00Z', answer: 'bir' }]);
  assert.deepEqual(d.achievements.map((a) => [a.id, a.name, a.title]), [['firstwin', 'Bullseye!', 'Birinchi savol'], ['graduate', 'Level Up!', 'Darsni tugatdingiz']]);
});

test('ru tili: ta\'rif ru, variantlar ru; earned_at noteEarned dan; takror/yaroqsiz id tashlanadi; chegaralar', () => {
  resetResultDetails('L2');
  noteEarned('L2', ['firstWin']);
  const d = buildResultDetails({ lessonId: 'L2', screenMeta: META, answers: { 3: { options: [{ uz: 'bir', ru: 'один' }], correctIndex: 0, picked: 0, correct: true } }, earned: ['firstWin', 'firstWin', 'Bad Id!', 'graduate'], achievements: ACH, lang: 'ru', now: T0 });
  assert.equal(d.lang, 'ru');
  assert.deepEqual(d.questions[0].options, ['один']);
  assert.equal(d.achievements.length, 2);
  const fw = d.achievements.find((a) => a.id === 'firstwin');
  assert.equal(fw.title, 'Первый вопрос');
  assert.ok(Date.parse(fw.earned_at) <= Date.now() && Date.parse(fw.earned_at) > Date.now() - 60_000, 'noteEarned vaqti');
  assert.equal(d.achievements.find((a) => a.id === 'graduate').earned_at, '2026-09-08T10:00:00Z', 'noteEarned bo\'lmagan id → yakun vaqti');
  // 10 dan ortiq urinish qirqiladi
  for (let i = 0; i < 15; i++) logAttempt('L2', 3, { picked: i % 2, elapsedMs: i });
  const d2 = buildResultDetails({ lessonId: 'L2', screenMeta: META, answers: { 3: { correctIndex: 0, picked: 1, correct: false } }, lang: 'uz', now: T0 });
  assert.equal(d2.questions[0].attempts.length, 10);
  assert.equal(d2.questions[0].attempts[0].correct, false, 'birinchi urinish darsning correct maydoniga moslanadi');
  assert.equal(d2.questions[0].solved, true, 'keyingi urinishda to\'g\'ri topilgan');
  // bo'sh
  const e = buildResultDetails({ lessonId: 'L3', screenMeta: META, answers: {}, lang: 'uz' });
  assert.deepEqual(e, { lang: 'uz', questions: [], achievements: [] });
});
