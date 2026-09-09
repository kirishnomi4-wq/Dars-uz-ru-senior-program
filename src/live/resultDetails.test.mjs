// node --test src/live/resultDetails.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildResultDetails, logAttempt, noteEarned, resetResultDetails, _forgetMemory } from './resultDetails.js';

// Brauzer saqlovi o'rnida (F-0909-02): modul localStorage'ga faqat chaqiruv paytida murojaat qiladi
const mem = new Map();
globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => { mem.set(k, String(v)); }, removeItem: (k) => { mem.delete(k); } };

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

test('F-0909-03: jonli dars (bitta urinish) — xato javobda dars solved:true yozsa ham LMS uchun solved=false', () => {
  resetResultDetails('L4');
  logAttempt('L4', 2, { picked: 0, texts: { picked: 'A' }, elapsedMs: 3100 });
  const answers = { 2: { question: 'Q', options: ['A', 'B'], correctIndex: 1, correctAnswer: 'B', picked: 0, lastPicked: 0, studentAnswer: 'A', correct: false, firstAttemptCorrect: false, solved: true } };
  const q = buildResultDetails({ lessonId: 'L4', screenMeta: META, answers, lang: 'uz', now: T0 }).questions[0];
  assert.deepEqual([q.correct, q.solved, q.attempts.length, q.attempts[0].correct, q.attempts[0].elapsed_ms], [false, false, 1, false, 3100]);
  // to'g'ri javob — ikkalasi true
  resetResultDetails('L4');
  logAttempt('L4', 2, { picked: 1, elapsedMs: 900 });
  const ok = buildResultDetails({ lessonId: 'L4', screenMeta: META, answers: { 2: { correctIndex: 1, picked: 1, lastPicked: 1, correct: true, solved: true } }, lang: 'uz', now: T0 }).questions[0];
  assert.deepEqual([ok.correct, ok.solved, ok.attempts.length], [true, true, 1]);
});

test('zaxira-yo\'l (tarix yo\'q): birinchi xato + oxirida to\'g\'ri → 2 urinish (birinchisi noma\'lum), solved=true; yechilmagan → 1 urinish, solved=false', () => {
  resetResultDetails('L5');
  const a = { options: ['A', 'B', 'C'], correctIndex: 1, correctAnswer: 'B', picked: 1, lastPicked: 1, studentAnswer: 'B', correct: false, solved: true };
  const q = buildResultDetails({ lessonId: 'L5', screenMeta: META, answers: { 2: a }, lang: 'uz', now: T0 }).questions[0];
  assert.deepEqual([q.correct, q.solved], [false, true]);
  assert.deepEqual(q.attempts.map((t) => [t.n, t.option, t.correct, t.answer]), [[1, -1, false, undefined], [2, 1, true, 'B']]);
  const u = buildResultDetails({ lessonId: 'L5', screenMeta: META, answers: { 2: { ...a, picked: 2, lastPicked: 2, studentAnswer: 'C', solved: false } }, lang: 'uz', now: T0 }).questions[0];
  assert.deepEqual([u.correct, u.solved, u.attempts.length, u.attempts[0].option], [false, false, 1, 2]);
});

test('F-0909-02: saqlov — sahifa yangilansa urinishlar (elapsed_ms, at) va earned_at birinchi vaqti qoladi; reset saqlovni ham tozalaydi', () => {
  resetResultDetails('L6');
  const before = Date.now();
  logAttempt('L6', 2, { picked: 0, texts: { picked: 'A' }, elapsedMs: 4200 });
  logAttempt('L6', 2, { picked: 1, texts: { picked: 'B' }, elapsedMs: 7700 });
  noteEarned('L6', ['firstWin']);
  assert.ok(mem.has('ccDetails:L6'), 'saqlovga yozildi');
  _forgetMemory('L6'); // «sahifa yangilandi»
  const answers = { 2: { options: ['A', 'B'], correctIndex: 1, picked: 1, lastPicked: 1, correct: false, solved: true } };
  const later = T0 + 3_600_000;
  const d = buildResultDetails({ lessonId: 'L6', screenMeta: META, answers, earned: ['firstWin', 'graduate'], achievements: ACH, lang: 'uz', now: later });
  assert.deepEqual(d.questions[0].attempts.map((t) => [t.n, t.option, t.correct, t.elapsed_ms]), [[1, 0, false, 4200], [2, 1, true, 7700]], 'tarix saqlovdan tiklandi');
  assert.ok(Date.parse(d.questions[0].attempts[0].at) >= Math.floor(before / 1000) * 1000, 'at — haqiqiy bosish vaqti, tugash vaqti emas');
  const fw = d.achievements.find((x) => x.id === 'firstwin');
  const fwAt = Date.parse(fw.earned_at);
  assert.ok(fwAt >= Math.floor(before / 1000) * 1000 && fwAt <= Date.now() + 1000, 'earned_at — noteEarned chaqirilgan real vaqt');
  assert.notEqual(fw.earned_at, new Date(later).toISOString().replace(/\.\d{3}Z$/, 'Z'), 'earned_at tugash vaqtiga tenglashib qolmadi');
  assert.equal(d.achievements.find((x) => x.id === 'graduate').earned_at, new Date(later).toISOString().replace(/\.\d{3}Z$/, 'Z'), 'saqlovda yo\'q yutuq → yakun vaqti');
  resetResultDetails('L6');
  assert.equal(mem.has('ccDetails:L6'), false, 'reset saqlovni tozaladi');
  _forgetMemory('L6');
  const e = buildResultDetails({ lessonId: 'L6', screenMeta: META, answers, lang: 'uz', now: later }).questions[0];
  assert.deepEqual([e.attempts.length, e.attempts[0].elapsed_ms, e.solved], [2, 0, true], 'saqlovsiz → zaxira-yo\'l');
});
