// node --test src/live/resultDetails.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildResultDetails, logAttempt, logArena, noteEarned, resetResultDetails, _forgetMemory, sealPayload, unsealPayload, noteProgressCleared, capPayload, CAP_BYTES, buildCodestrike, codestrikeNeed, arenaStart, arenaDone, arenaPlace, podiumExpected } from './resultDetails.js';
import { progWrite, progClear } from './liveClient.js';

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
  assert.deepEqual([e.lang, e.questions, e.achievements, e.detailsVersion, e.retake], ['uz', [], [], 3, null]); // v3 (F-1023-01 codestrike; v2 F-0924-20): boshqa maydonlar alohida testda
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

test('arena (2026-09-10): jonli arena javoblari testlardan KEYIN kind=arena; matnlar bank\'dan (uz/ru); bank yo\'q → matnsiz; birinchi javob qoladi; saqlovdan tiklanadi; reset tozalaydi', () => {
  resetResultDetails('L7');
  logAttempt('L7', 2, { picked: 1, texts: { picked: 'B' }, elapsedMs: 1000 });
  // Savollar doim oldinga keladi (0 → 3; 1–2 taymautda). BUG-01 dan beri orqaga qaytgan javob = yangi o'yin (birinchisi yopiladi).
  assert.equal(logArena('L7', 'quiz-0', { picked: 1, correct: false, elapsedMs: 2500 }), true);
  assert.equal(logArena('L7', 'quiz-3', { picked: 2, correct: true, elapsedMs: 4120 }), true);
  assert.equal(logArena('L7', 'quiz-0', { picked: 0, correct: true, elapsedMs: 9000 }), false, 'takror javob — jonli qoida: bir urinish');
  assert.equal(logArena('L7', 's4', { picked: 0, correct: true, elapsedMs: 10 }), false, 'test-savol arena emas');
  const answers = { 2: { options: ['A', 'B'], correctIndex: 1, picked: 1, lastPicked: 1, correct: true, solved: true } };
  const BANK = [
    { q: { uz: 'Savol 0', ru: 'Вопрос 0' }, opts: [{ uz: 'a', ru: 'а' }, { uz: 'b', ru: 'б' }], correct: 0 },
    null, null,
    { q: 'Savol 3', opts: ['x', 'y', 'z'], correct: 2 },
  ];
  _forgetMemory('L7'); // «sahifa yangilandi» — saqlovdan tiklanadi
  const d = buildResultDetails({ lessonId: 'L7', screenMeta: META, answers, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK });
  assert.deepEqual(d.questions.map((q) => [q.question_id, q.kind, q.order]), [['s4', 'test', 1], ['quiz-0', 'arena', 2], ['quiz-3', 'arena', 3]], 'tartib: testlar, keyin arena raqam bo\'yicha');
  const q0 = d.questions[1];
  assert.equal(q0.correct, false); assert.equal(q0.solved, false);
  assert.deepEqual(q0.attempts.map((t) => [t.n, t.option, t.correct, t.elapsed_ms, t.answer]), [[1, 1, false, 2500, 'b']]);
  assert.match(q0.attempts[0].at, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/);
  assert.equal(q0.question, 'Savol 0'); assert.deepEqual(q0.options, ['a', 'b']); assert.equal(q0.correct_option, 0); assert.equal(q0.correct_answer, 'a');
  const q3 = d.questions[2];
  assert.equal(q3.correct, true); assert.equal(q3.solved, true); assert.equal(q3.attempts[0].answer, 'z'); assert.equal(q3.correct_answer, 'z'); assert.equal(q3.question, 'Savol 3');
  const ru = buildResultDetails({ lessonId: 'L7', screenMeta: META, answers, earned: [], achievements: ACH, lang: 'ru', arenaBank: BANK });
  assert.equal(ru.questions[1].question, 'Вопрос 0'); assert.deepEqual(ru.questions[1].options, ['а', 'б']);
  const noBank = buildResultDetails({ lessonId: 'L7', screenMeta: META, answers, earned: [], achievements: ACH, lang: 'uz' });
  assert.equal(noBank.questions.length, 3);
  assert.equal(noBank.questions[1].question, undefined); assert.equal(noBank.questions[1].options, undefined); assert.equal(noBank.questions[1].correct_option, undefined);
  assert.equal(noBank.questions[1].attempts[0].option, 1);
  resetResultDetails('L7');
  assert.equal(mem.has('ccDetails:L7'), false);
  const after = buildResultDetails({ lessonId: 'L7', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK });
  assert.equal(after.questions.length, 0, 'reset arena tarixini ham tozaladi');
});

// ── F-0918-07: onFinished yukini muhrlash ───────────────────────────────────────────────────────────────
const mkPayload = (dur, extra = {}) => ({ lessonId: 'S1', lessonTitle: { uz: 'Dars', ru: 'Урок' }, livePin: null, liveMode: 'self', durationSec: dur, answers: [{ picked: 1, correct: true }], ...extra });

test('sealPayload: ikkinchi bosishda AYNAN birinchi yuk qaytadi (durationSec o\'sgan bo\'lsa ham)', () => {
  unsealPayload('S1');
  const a = sealPayload('S1', mkPayload(603));
  const b = sealPayload('S1', mkPayload(615, { answers: [{ picked: 2, correct: false }] }));
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.equal(b.durationSec, 603);
  assert.equal(JSON.stringify(a), JSON.stringify(mkPayload(603))); // birinchi yuk simda o'zgarmagan
});

test('sealPayload: qabul qiluvchi obyektni o\'zgartirsa ham muhr buzilmaydi (har safar yangi nusxa)', () => {
  resetResultDetails('S1');
  const a = sealPayload('S1', mkPayload(10));
  a.durationSec = 999; a.answers.push({ hacked: true });
  const b = sealPayload('S1', mkPayload(20));
  assert.equal(b.durationSec, 10);
  assert.equal(b.answers.length, 1);
  assert.notEqual(a, b);
});

test('sealPayload: boshqa sessiya (PIN yoki rejim) — yangi yuk muhrlanadi', () => {
  resetResultDetails('S1');
  sealPayload('S1', mkPayload(10, { livePin: '111111', liveMode: 'mentor' }));
  const b = sealPayload('S1', mkPayload(20, { livePin: '222222', liveMode: 'mentor' }));
  assert.equal(b.livePin, '222222'); assert.equal(b.durationSec, 20);
  const c = sealPayload('S1', mkPayload(30, { livePin: '222222', liveMode: 'mentor' }));
  assert.equal(c.durationSec, 20);
});

// F-0920-01 dan keyin: `unsealPayload` faqat XOTIRANI bo'shatadi — o'sha urinish qayta yuklansa yuk o'zgarmaydi;
// muhrni butunlay olib tashlaydigan yagona yo'l — `resetResultDetails` (yangi urinish / «Qaytadan boshlash»).
test('sealPayload: unsealPayload yukni saqlaydi, resetResultDetails muhrni tozalaydi', () => {
  resetResultDetails('S1');
  sealPayload('S1', mkPayload(10));
  unsealPayload('S1');
  assert.equal(sealPayload('S1', mkPayload(20)).durationSec, 10, 'F5 dan keyin yuk o\'zgardi — LMS 409 beradi');
  resetResultDetails('S1');
  assert.equal(sealPayload('S1', mkPayload(30)).durationSec, 30);
});

test('sealPayload: darslar bir-biriga aralashmaydi; yaroqsiz kirish o\'zgarishsiz qaytadi', () => {
  unsealPayload('S1'); unsealPayload('S2');
  sealPayload('S1', mkPayload(10));
  assert.equal(sealPayload('S2', mkPayload(77)).durationSec, 77);
  assert.equal(sealPayload('', mkPayload(5)).durationSec, 5);
  assert.equal(sealPayload('S1', null), null);
  const loop = { lessonId: 'S3' }; loop.self = loop; // JSON bo'lmaydigan yuk — yiqilmaydi, o'zini qaytaradi
  assert.equal(sealPayload('S3', loop), loop);
});

// ── Y1 (B to'lqin tekshiruvi, 19.09): LMS shartnomasiga to'liq mos bo'lmagan test-yozuv detallarga kirmaydi ────────────
test('maxsus test-ekran (variantsiz, picked 0/1) questions[] ga kirmaydi; MCQ kiradi; har yozuv shartnoma shaklida', () => {
  const meta = [{ id: 's4', scored: true }, { id: 's15', scored: true }, { id: 's16', scored: true }, { id: 's17', scored: true }];
  const answers = {
    0: { question: 'Savol?', options: ['a', 'b', 'c'], correctIndex: 1, correctAnswer: 'b', picked: 1, lastPicked: 1, correct: true, firstAttemptCorrect: true, solved: true },
    1: { correct: false, firstAttemptCorrect: false, solved: true, picked: 1 },                                         // tartiblash, birinchi urinish xato
    2: { stage: 'module-mikro', question: "Tartibda yig'ing", correct: true, firstAttemptCorrect: true, solved: true, picked: 0 }, // savol bor, variant yo'q
    3: { question: "Qatlamlarni tartibda joylang", options: ['🎨 Ekran', '🔍 Detal', '🗄️ Baza'], correct: false, firstAttemptCorrect: false, solved: true, picked: 1 }, // Y1b: variantlar bor, correctIndex yo'q
  };
  resetResultDetails('Y1');
  const r = buildResultDetails({ lessonId: 'Y1', screenMeta: meta, answers, earned: [], achievements: {}, lang: 'uz', now: T0 });
  assert.deepEqual(r.questions.map((q) => q.question_id), ['s4']);
  for (const q of r.questions) {
    assert.ok(q.question && Array.isArray(q.options) && q.options.length >= 2 && Number.isInteger(q.correct_option) && typeof q.correct_answer === 'string');
  }
});


// ── F-0920-01 (20.09 staging dalili): muhr F5 dan keyin ham saqlanadi; yangi urinishda esa yangilanadi ──────────────
test('muhr saqlovda: F5 dan keyin AYNAN o\'sha yuk; urinish almashsa — yangi yuk', () => {
  resetResultDetails('F5');
  localStorage.setItem('liveSession:F5', JSON.stringify({ mode: 'solo', pin: '869331', attemptId: 'att-1' }));
  const a = sealPayload('F5', { lessonId: 'F5', livePin: '869331', liveMode: 'solo', durationSec: 473 });
  unsealPayload('F5');                                        // sahifa qayta yuklandi — xotira bo'sh
  const b = sealPayload('F5', { lessonId: 'F5', livePin: '869331', liveMode: 'solo', durationSec: 654 }); // yangi vaqt bilan
  assert.deepEqual(b, a, 'F5 dan keyin yuk o\'zgardi — LMS 409 beradi');
  assert.equal(b.durationSec, 473);
  localStorage.setItem('liveSession:F5', JSON.stringify({ mode: 'solo', pin: '112233', attemptId: 'att-2' })); // «Qaytadan boshlash»
  const c = sealPayload('F5', { lessonId: 'F5', livePin: '112233', liveMode: 'solo', durationSec: 91 });
  assert.equal(c.durationSec, 91, 'yangi urinishda eski yuk qaytdi');
  resetResultDetails('F5');
  const d = sealPayload('F5', { lessonId: 'F5', livePin: '112233', liveMode: 'solo', durationSec: 12 });
  assert.equal(d.durationSec, 12, 'reset dan keyin muhr qolib ketdi');
});

// ── v2 (F-0924-20): «Qaytadan», missed, ekranlar, vaqtlar, hajm-shifti ─────────────────────────────────────────────
test('v2: detailsVersion=2, missed = birinchi urinishda xato test-savollar, totalScreens, finishedAt; saqlov yo\'q → retake=null', () => {
  resetResultDetails('V1');
  const answers = {
    2: { question: 'Q1', options: ['A', 'B'], correctIndex: 1, correctAnswer: 'B', picked: 0, studentAnswer: 'A', correct: false, solved: true, lastPicked: 1 },
    3: { question: 'Q2', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A', picked: 0, studentAnswer: 'A', correct: true, solved: true },
    4: { question: 'Q3', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A', picked: 1, studentAnswer: 'B', correct: false, solved: false },
  };
  const d = buildResultDetails({ lessonId: 'V1', screenMeta: META, answers, earned: [], achievements: ACH, lang: 'uz', now: T0 });
  assert.equal(d.detailsVersion, 3); // v3 (F-1023-01)
  assert.deepEqual(d.missed, ['s4', 's9']);
  assert.equal(d.totalScreens, 5);
  assert.equal(d.finishedAt, '2026-09-08T10:00:00Z');
  assert.equal(d.truncated, false);
  assert.equal(d.retake, null);          // progClear chaqirilmagan — bilib bo'lmadi
  assert.equal('startedAt' in d, false); // boshlanish vaqti noma'lum — maydon yo'q, soxta qiymat yo'q
});

test('v2: progClear tozalashdan OLDIN holatni beradi — «Qaytadan» bosilmagan → retake.pressed=false, startedAt saqlovdan', () => {
  resetResultDetails('V2');
  progWrite('V2', { screen: 4, answers: { 2: { picked: 1, correct: true } }, earned: [], missed: [], firstPass: null, startedAt: T0 - 90_000, total: 5, savedAt: T0 });
  progClear('V2'); // finishLesson tartibi: progClear → payload
  assert.equal(localStorage.getItem('ccProgress:V2'), null);
  const d = buildResultDetails({ lessonId: 'V2', screenMeta: META, answers: { 2: { question: 'Q', options: ['A', 'B'], correctIndex: 1, correctAnswer: 'B', picked: 1, studentAnswer: 'B', correct: true, solved: true } }, earned: [], achievements: ACH, lang: 'uz', now: T0 });
  assert.deepEqual(d.retake, { pressed: false });
  assert.equal(d.startedAt, '2026-09-08T09:58:30Z');
  // ikkinchi bosish: saqlov allaqachon bo'sh — progClear yana chaqirilsa ham oldingi holat QOLADI
  progClear('V2');
  const d2 = buildResultDetails({ lessonId: 'V2', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', now: T0 });
  assert.deepEqual(d2.retake, { pressed: false });
});

test('v2: «Qaytadan» bosilgan — retake.pressed=true, lastPass oxirgi o\'tish saqlovdagi javoblardan; asosiy questions[] birinchi o\'tishdan', () => {
  resetResultDetails('V3');
  const firstAns = { 2: { question: 'Q1', options: ['A', 'B'], correctIndex: 1, correctAnswer: 'B', picked: 0, studentAnswer: 'A', correct: false, solved: false }, 3: { question: 'Q2', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A', picked: 0, studentAnswer: 'A', correct: true, solved: true } };
  const lastAns = { 2: { picked: 1, correct: true }, 3: { picked: 0, correct: true }, 4: { picked: 0, correct: true } };
  progWrite('V3', { screen: 4, answers: lastAns, earned: [], missed: [], firstPass: { answers: firstAns, durationSec: 300 }, startedAt: T0 - 120_000, total: 5, savedAt: T0 });
  progClear('V3');
  const d = buildResultDetails({ lessonId: 'V3', screenMeta: META, answers: firstAns, earned: [], achievements: ACH, lang: 'uz', now: T0 });
  assert.deepEqual(d.questions.map((q) => [q.question_id, q.correct]), [['s4', false], ['s5b', true]]); // birinchi o'tish (151-qonun)
  assert.deepEqual(d.retake, { pressed: true, lastPass: { totalQuestions: 3, correctAnswers: 3, scorePercent: 100, durationSec: 120 } });
  // dars o'zi uzatsa — ustun keladi
  const e = buildResultDetails({ lessonId: 'V3', screenMeta: META, answers: firstAns, earned: [], achievements: ACH, lang: 'uz', now: T0, firstPass: null, startedAt: T0 - 5000, totalScreens: 9 });
  assert.deepEqual([e.retake, e.startedAt, e.totalScreens], [{ pressed: false }, '2026-09-08T09:59:55Z', 9]);
  resetResultDetails('V3'); // reset yakun-kontekstini ham tozalaydi
  assert.equal(buildResultDetails({ lessonId: 'V3', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', now: T0 }).retake, null);
});

test('v2 + muhr: yangi maydonlar (finishedAt, retake) muhr ICHIDA — ikkinchi bosishda AYNAN bir xil bayt (409 qaytmaydi)', () => {
  resetResultDetails('V4');
  const mk = (now) => ({ lessonId: 'V4', livePin: '111', liveMode: 'student', durationSec: Math.floor((now - T0) / 1000), ...buildResultDetails({ lessonId: 'V4', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', now }) });
  const a = JSON.stringify(sealPayload('V4', mk(T0)));
  const b = JSON.stringify(sealPayload('V4', mk(T0 + 7000))); // 7 s keyin yana bosildi: finishedAt/durationSec boshqa bo'lardi
  assert.equal(a, b);
  assert.match(a, /"detailsVersion":3/); assert.match(a, /"finishedAt":"2026-09-08T10:00:00Z"/);
});

test('v2 hajm-shifti: kichik yuk o\'zgarmaydi; katta yuk — avval answers[] tushadi, truncated:true + truncatedFields, shift ostida; muhr qisqartirilganini oladi', () => {
  resetResultDetails('V5');
  const small = { lessonId: 'V5', answers: [{ a: 1 }], questions: [], truncated: false };
  assert.strictEqual(capPayload(small), small);
  const big = { lessonId: 'V5', livePin: '5', liveMode: 'self', truncated: false, answers: Array.from({ length: 900 }, (_, i) => ({ i, question: 'x'.repeat(60) })), questions: [{ question_id: 's1', attempts: [1, 2, 3, 4, 5].map((n) => ({ n, option: 0, answer: 'A' })), question: 'q'.repeat(200) }] };
  assert.ok(Buffer.byteLength(JSON.stringify(big)) > CAP_BYTES);
  const c = capPayload(big);
  assert.equal('answers' in c, false); assert.equal(c.truncated, true); assert.deepEqual(c.truncatedFields, ['answers']);
  assert.equal(c.questions[0].attempts.length, 5); // yetgani uchun keyingi qadamlar ishlamadi
  assert.ok(Buffer.byteLength(JSON.stringify(c)) <= CAP_BYTES);
  assert.equal(big.answers.length, 900); // asl obyekt o'zgarmagan
  const sealed = sealPayload('V5', big);
  assert.equal('answers' in sealed, false); assert.equal(sealed.truncated, true);
  assert.equal(JSON.stringify(sealPayload('V5', big)), JSON.stringify(sealed)); // ikkinchi bosish — bir xil
  // juda katta savol-ro'yxati: attempts → text → questions qadamlari ham shift ostiga tushiradi
  const huge = { lessonId: 'V6', truncated: false, questions: Array.from({ length: 300 }, (_, i) => ({ question_id: 's' + i, question: 'q'.repeat(300), options: ['o'.repeat(300), 'p'.repeat(300)], attempts: Array.from({ length: 10 }, (_, n) => ({ n: n + 1, option: 0, answer: 'a'.repeat(300) })) })) };
  const h = capPayload(huge, 20_000);
  assert.deepEqual(h.truncatedFields, ['answers', 'attempts', 'text', 'questions']);
  assert.ok(Buffer.byteLength(JSON.stringify(h)) <= 20_000); assert.ok(h.questions.length >= 1);
});

// ── F-1023-01: CodeStrike → Learn (`codestrike` ustki maydoni, chegara 7/12, birinchi o'yin) ─────────────────────
const BANK12 = Array.from({ length: 12 }, (_, i) => ({ q: `S${i}`, opts: ['a', 'b', 'c', 'd'], correct: i % 4 }));
const playArena = (id, mode, correctN, totalN = 12) => { for (let i = 0; i < totalN; i++) logArena(id, `quiz-${i}`, { picked: i < correctN ? i % 4 : (i % 4 + 1) % 4, correct: i < correctN, elapsedMs: 1000 + i, mode }); };

test('codestrike: jonli 8/12 → passed=true, mode=student; percent 67; questions[] arena yozuvlari o\'z joyida', () => {
  resetResultDetails('CS1');
  playArena('CS1', 'student', 8);
  const d = buildResultDetails({ lessonId: 'CS1', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 });
  assert.equal(d.detailsVersion, 3);
  assert.deepEqual(d.codestrike, { played: true, total: 12, answered: 12, correct: 8, percent: 67, passed: true, mode: 'student' });
  assert.equal(d.questions.filter((q) => q.kind === 'arena').length, 12);
});

test('codestrike: solo 5/12 → passed=false, mode=solo; 7/12 → passed=true (chegara aynan 7)', () => {
  resetResultDetails('CS2'); playArena('CS2', 'solo', 5);
  const a = buildResultDetails({ lessonId: 'CS2', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }).codestrike;
  assert.deepEqual([a.passed, a.correct, a.mode, a.percent], [false, 5, 'solo', 42]);
  resetResultDetails('CS3'); playArena('CS3', 'solo', 7);
  const b = buildResultDetails({ lessonId: 'CS3', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }).codestrike;
  assert.deepEqual([b.passed, b.correct], [true, 7]);
  assert.equal(codestrikeNeed(12), 7); assert.equal(codestrikeNeed(10), 6); assert.equal(codestrikeNeed(6), 4);
});

test('codestrike: o\'ynalmagan → played=false, passed=false, mode=null; bank yo\'q → total 12 sukut', () => {
  resetResultDetails('CS4');
  const d = buildResultDetails({ lessonId: 'CS4', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 });
  assert.deepEqual(d.codestrike, { played: false, total: 12, answered: 0, correct: 0, percent: 0, passed: false, mode: null });
  assert.equal(buildResultDetails({ lessonId: 'CS4', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz' }).codestrike.total, 12);
  assert.deepEqual(buildCodestrike([], 0), { played: false, total: 12, answered: 0, correct: 0, percent: 0, passed: false, mode: null });
});

test('codestrike: qayta o\'ynash (solo replay) hisobga kirmaydi — birinchi javoblar qoladi; saqlovdan tiklanganda mode saqlanadi', () => {
  resetResultDetails('CS5'); playArena('CS5', 'solo', 3);
  playArena('CS5', 'solo', 12); // qayta o'ynab 12/12 — e'tiborsiz
  _forgetMemory('CS5'); // «sahifa yangilandi»
  const d = buildResultDetails({ lessonId: 'CS5', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }).codestrike;
  assert.deepEqual([d.correct, d.passed, d.mode], [3, false, 'solo']);
});

test('codestrike: muhr ichida — ikkinchi bosishda aynan o\'sha baytlar; hajm-shiftida tushmaydi', () => {
  resetResultDetails('CS6'); playArena('CS6', 'student', 9);
  const p = { lessonId: 'CS6', ...buildResultDetails({ lessonId: 'CS6', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }) };
  const a = JSON.stringify(sealPayload('CS6', p)); const b = JSON.stringify(sealPayload('CS6', { ...p, finishedAt: 'x' }));
  assert.equal(a, b); assert.match(a, /"codestrike":\{"played":true,"total":12,"answered":12,"correct":9,"percent":75,"passed":true,"mode":"student"\}/);
  const big = { ...p, answers: Array.from({ length: 4000 }, () => ({ t: 'x'.repeat(40) })) };
  assert.deepEqual(capPayload(big).codestrike, p.codestrike);
});

// ── BUG-01 (LMS QA, 23.10): qayta o'yin taymautda bo'sh qolgan savolni to'ldirib, birinchi o'yin natijasini o'zgartirardi ──────────
// seq[i]: true — to'g'ri · false — xato · null — taymaut (javob yo'q). Savollar doim 0 → 11 tartibda keladi.
const playSeq = (id, mode, seq) => seq.forEach((v, i) => { if (v !== null) logArena(id, `quiz-${i}`, { picked: v ? i % 4 : (i % 4 + 1) % 4, correct: v, elapsedMs: 1000 + i, mode }); });
const cs = (id) => buildResultDetails({ lessonId: id, screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }).codestrike;
const SEQ_6_5_SKIP = [true, true, true, true, true, true, false, false, false, false, false, null];
const ALL12 = Array(12).fill(true);

test('BUG-01 · 1: 6 to\'g\'ri + 5 xato + taymaut → qayta 12/12 → answered 11, correct 6, percent 50, passed false', () => {
  resetResultDetails('B1'); playSeq('B1', 'solo', SEQ_6_5_SKIP); playSeq('B1', 'solo', ALL12);
  assert.deepEqual(cs('B1'), { played: true, total: 12, answered: 11, correct: 6, percent: 50, passed: false, mode: 'solo' });
});

test('BUG-01 · 2: bir necha qayta o\'yin, sahifa yangilanishi, review\'da qayta «Tamom» va yangi urinish — natija o\'zgarmaydi', () => {
  resetResultDetails('B2'); playSeq('B2', 'solo', SEQ_6_5_SKIP);
  playSeq('B2', 'solo', ALL12); playSeq('B2', 'solo', ALL12);
  _forgetMemory('B2'); playSeq('B2', 'solo', ALL12); // qayta yuklangandan keyin ham yopiq
  assert.deepEqual([cs('B2').answered, cs('B2').correct, cs('B2').passed], [11, 6, false]);
  const p = { lessonId: 'B2', ...buildResultDetails({ lessonId: 'B2', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }) };
  const a = JSON.stringify(sealPayload('B2', p)); _forgetMemory('B2'); playSeq('B2', 'solo', ALL12);
  assert.equal(JSON.stringify(sealPayload('B2', { ...p, codestrike: cs('B2') })), a); // review: muhr — aynan birinchi yuk
  resetResultDetails('B2', { keepArena: true }); playSeq('B2', 'solo', ALL12); // «yangi urinish» (restartAttempt)
  assert.deepEqual([cs('B2').answered, cs('B2').correct, cs('B2').passed], [11, 6, false]);
});

test('BUG-01 · 3: qayta o\'yin bo\'sh savolga javob qo\'shmaydi — questions[] arena tafsiloti va codestrike bir xil', () => {
  resetResultDetails('B3'); playSeq('B3', 'solo', SEQ_6_5_SKIP); playSeq('B3', 'solo', ALL12);
  const d = buildResultDetails({ lessonId: 'B3', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 });
  const ar = d.questions.filter((q) => q.kind === 'arena');
  assert.equal(ar.length, 11); assert.equal(ar.filter((q) => q.correct === true).length, 6);
  assert.equal(ar.some((q) => q.questionId === 'quiz-11' || q.id === 'quiz-11'), false);
  // o'rtadagi savol taymautda (quiz-5) — qayta o'yin ham to'ldirmaydi
  resetResultDetails('B3b'); playSeq('B3b', 'student', [true, true, true, true, true, null, true, false, false, false, false, false]); playSeq('B3b', 'student', ALL12);
  assert.deepEqual([cs('B3b').answered, cs('B3b').correct, cs('B3b').passed], [11, 6, false]);
});

test('BUG-01 · 4–5: 3/12 → qayta 12/12 = 3/12; 6/12 false, 7/12 true; muvaffaqiyatli birinchi natija yomon qayta o\'yindan keyin qoladi', () => {
  resetResultDetails('B4'); playArena('B4', 'solo', 3); playSeq('B4', 'solo', ALL12);
  assert.deepEqual([cs('B4').correct, cs('B4').passed], [3, false]);
  resetResultDetails('B5a'); playArena('B5a', 'solo', 6); assert.equal(cs('B5a').passed, false);
  resetResultDetails('B5b'); playArena('B5b', 'solo', 7); assert.equal(cs('B5b').passed, true);
  playSeq('B5b', 'solo', Array(12).fill(false)); // qayta o'yin 0/12
  assert.deepEqual([cs('B5b').correct, cs('B5b').passed], [7, true]);
});

test('BUG-01 · 6: javobsiz → played false; solo\'dan jonli darsga o\'tish (yangi jonli urinish) arenani tozalaydi', () => {
  resetResultDetails('B6');
  assert.deepEqual(cs('B6'), { played: false, total: 12, answered: 0, correct: 0, percent: 0, passed: false, mode: null });
  playSeq('B6', 'solo', SEQ_6_5_SKIP); playSeq('B6', 'solo', ALL12);
  resetResultDetails('B6'); // useLiveSession: solo → student (jonli dars boshlandi) — ataylab toza
  playSeq('B6', 'student', ALL12);
  assert.deepEqual([cs('B6').correct, cs('B6').passed, cs('B6').mode], [12, true, 'student']);
});

// ── BUG-01 v2 (Abdulloh review, 23.10): o'yin chegarasi — arenaStart(run) / arenaDone. Dars: arena har ochilishida yangi run. ──
// Abdullohning 6 ta yopish sharti. Dars xatti-harakati: birinchi savol ko'rinsa arenaStart(run); oxirgi savoldan keyin arenaDone;
// «Qayta ishlash» / mashq — avval arenaDone, keyin soloMode (submitAnswer chaqirilmaydi). Bu yerda mashq himoyasi YO'Q deb faraz
// qilinadi (logArena baribir chaqiriladi) — modul o'zi yetarli bo'lishi kerak.
const game = (id, run, seq, { mode = 'solo', pin = null, done = true } = {}) => {
  seq.forEach((v, i) => { arenaStart(id, { run, mode, pin }); if (v !== null) logArena(id, `quiz-${i}`, { picked: v ? i % 4 : (i % 4 + 1) % 4, correct: v, elapsedMs: 900 + i, mode }); });
  if (done) arenaDone(id);
};
const SKIP11_LAST = [...Array(11).fill(null), true];
const NONE12 = Array(12).fill(null);

test('BUG-01 v2 · 1: 6 + 5 xato + taymaut → «Qayta ishlash» 12/12 → 11 / 6 / false', () => {
  resetResultDetails('V1'); game('V1', 'r1', SEQ_6_5_SKIP);
  arenaDone('V1'); game('V1', 'r1', ALL12); // o'sha ochilishda qayta o'yin
  assert.deepEqual(cs('V1'), { played: true, total: 12, answered: 11, correct: 6, percent: 50, passed: false, mode: 'solo' });
});

test('BUG-01 v2 · 2: yopib qayta ochish → 1–11 taymaut, 12-savol to\'g\'ri → birinchi natija o\'zgarmaydi (arenaDone bo\'lmasa ham)', () => {
  resetResultDetails('V2'); game('V2', 'r1', SEQ_6_5_SKIP); game('V2', 'r2', SKIP11_LAST);
  assert.deepEqual([cs('V2').answered, cs('V2').correct, cs('V2').passed], [11, 6, false]);
  resetResultDetails('V2b'); game('V2b', 'r1', SEQ_6_5_SKIP, { done: false }); game('V2b', 'r2', SKIP11_LAST); // natija oynasida yopildi
  assert.deepEqual([cs('V2b').answered, cs('V2b').correct, cs('V2b').passed], [11, 6, false]);
});

test('BUG-01 v2 · 3: o\'sha stsenariy sahifa qayta yuklangandan keyin — birinchi natija qoladi', () => {
  resetResultDetails('V3'); game('V3', 'r1', SEQ_6_5_SKIP, { done: false });
  _forgetMemory('V3'); game('V3', 'r2', SKIP11_LAST); // qayta yuklash: xotira yo'q, saqlovdan o'qiladi, yangi run
  _forgetMemory('V3');
  assert.deepEqual([cs('V3').answered, cs('V3').correct, cs('V3').passed], [11, 6, false]);
});

test('BUG-01 v2 · 4: birinchi o\'yin javobsiz → qayta ochish yoki qayta yuklash → muvaffaqiyatli o\'yin → played false', () => {
  resetResultDetails('V4a'); game('V4a', 'r1', NONE12); game('V4a', 'r2', ALL12);
  assert.deepEqual(cs('V4a'), { played: false, total: 12, answered: 0, correct: 0, percent: 0, passed: false, mode: null });
  resetResultDetails('V4b'); game('V4b', 'r1', NONE12, { done: false }); _forgetMemory('V4b'); game('V4b', 'r2', ALL12);
  assert.deepEqual([cs('V4b').played, cs('V4b').answered, cs('V4b').passed], [false, 0, false]);
});

test('BUG-01 v2 · 5: yomon birinchi solo o\'yin → avtomatik jonli darsga o\'tish → muvaffaqiyatli o\'yin → birinchi natija qoladi', () => {
  resetResultDetails('V5'); game('V5', 'r1', SEQ_6_5_SKIP, { done: false });
  resetResultDetails('V5', { keepArena: true }); // useLiveSession: solo → student (jonli dars boshlandi)
  game('V5', 'r1', ALL12, { mode: 'student', pin: '483920' }); // arena ochiq qolgan (o'sha run) yoki yangi ochilgan — farqsiz
  game('V5', 'r9', ALL12, { mode: 'student', pin: '483920' });
  assert.deepEqual([cs('V5').answered, cs('V5').correct, cs('V5').passed, cs('V5').mode], [11, 6, false, 'solo']);
  // solo arena boshlanmagan bo'lsa — jonli o'yin birinchi bo'ladi
  resetResultDetails('V5b'); resetResultDetails('V5b', { keepArena: true }); game('V5b', 'r7', ALL12, { mode: 'student', pin: '483920' });
  assert.deepEqual([cs('V5b').correct, cs('V5b').passed, cs('V5b').mode], [12, true, 'student']);
});

test('BUG-01 v2 · 6: muvaffaqiyatli birinchi o\'yin → yomon qayta o\'yinlar → natija va questions[] mos', () => {
  resetResultDetails('V6'); game('V6', 'r1', [...Array(7).fill(true), ...Array(5).fill(false)]);
  game('V6', 'r1', Array(12).fill(false)); game('V6', 'r2', Array(12).fill(false)); _forgetMemory('V6'); game('V6', 'r3', Array(12).fill(false));
  const d = buildResultDetails({ lessonId: 'V6', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 });
  assert.deepEqual([d.codestrike.answered, d.codestrike.correct, d.codestrike.passed], [12, 7, true]);
  const ar = d.questions.filter((q) => q.kind === 'arena');
  assert.equal(ar.length, d.codestrike.answered); assert.equal(ar.filter((q) => q.correct === true).length, d.codestrike.correct);
});

test('BUG-01 v2 · jonli: o\'sha mentor sessiyasiga qayta ulanish (o\'sha PIN) o\'yinni davom ettiradi; boshqa PIN — yangi o\'yin, hisobga kirmaydi', () => {
  resetResultDetails('V7');
  game('V7', 'a1', [true, true, true, true, null, null, null, null, null, null, null, null], { mode: 'student', pin: '111111', done: false });
  // o'quvchi arenani yopib qayta ochdi (yangi run), jonli test o'sha — 5–12 savollar davom etadi
  [4, 5, 6, 7, 8, 9, 10, 11].forEach((i) => { arenaStart('V7', { run: 'a2', mode: 'student', pin: '111111' }); logArena('V7', `quiz-${i}`, { picked: i % 4, correct: true, elapsedMs: 800, mode: 'student' }); });
  arenaDone('V7');
  assert.deepEqual([cs('V7').answered, cs('V7').correct, cs('V7').passed], [12, 12, true]);
  resetResultDetails('V8'); game('V8', 'b1', SEQ_6_5_SKIP, { mode: 'student', pin: '111111', done: false });
  game('V8', 'b2', SKIP11_LAST, { mode: 'student', pin: '222222' });
  assert.deepEqual([cs('V8').answered, cs('V8').correct], [11, 6]);
});

test('BUG-01 v2 · saqlov: arenaGame va arenaClosed qayta yuklashdan o\'tadi; boshqa darsga ta\'sir qilmaydi', () => {
  resetResultDetails('V9'); resetResultDetails('V9x');
  arenaStart('V9', { run: 'q1', mode: 'solo' });
  const raw = JSON.parse(globalThis.localStorage.getItem('ccDetails:V9')); assert.deepEqual(raw.arenaGame, { run: 'q1', mode: 'solo', pin: null }); assert.equal(raw.arenaClosed, undefined);
  arenaStart('V9', { run: 'q2', mode: 'solo' }); assert.equal(JSON.parse(globalThis.localStorage.getItem('ccDetails:V9')).arenaClosed, true);
  game('V9x', 'z1', ALL12); assert.equal(cs('V9x').correct, 12);
  arenaDone('V9y'); assert.equal(globalThis.localStorage.getItem('ccDetails:V9y'), null); // o'yin boshlanmagan — hech narsa yozilmaydi
});

// ── Podium (Abdulloh, 28.10; QA tuzatishlari PODIUM-01…04): codestrike.podium { game_id, place, finalized } ──
// useLiveSession mentor yakunlagach serverdan qayta yuklangan jadvaldan o'rinni beradi (arenaPlace). Bu yerda modul qoidalari:
// faqat birinchi o'yin, jonli, o'sha PIN, kamida 1 javob · BIR MARTA yoziladi · place 4+ → null.
const GID = '6f1c2e9a-0000-4000-8000-000000000001';
test('podium · 1: jonli o\'yin → o\'rin codestrike ichida; podiumExpected o\'rin yozilguncha true; qayta yuklashdan o\'tadi', () => {
  resetResultDetails('P1'); game('P1', 'p1', ALL12, { mode: 'student', pin: '483920' });
  assert.equal(podiumExpected('P1', '483920'), true); assert.equal(podiumExpected('P1', '999999'), false);
  assert.equal(cs('P1').podium, undefined);
  assert.equal(arenaPlace('P1', { gameId: GID, pin: '483920', place: 2 }), true);
  assert.equal(podiumExpected('P1', '483920'), false);
  assert.deepEqual(cs('P1').podium, { game_id: GID, place: 2, finalized: true });
  _forgetMemory('P1');
  assert.deepEqual(cs('P1').podium, { game_id: GID, place: 2, finalized: true });
});
test('podium · PODIUM-04: yozilgan o\'rin almashmaydi — boshqa o\'rin, boshqa game_id, qayta yuklash, yangi urinish', () => {
  resetResultDetails('P4'); game('P4', 'p4', ALL12, { mode: 'student', pin: '483920' });
  assert.equal(arenaPlace('P4', { gameId: GID, pin: '483920', place: 1 }), true);
  assert.equal(arenaPlace('P4', { gameId: GID, pin: '483920', place: 2 }), false);
  assert.equal(arenaPlace('P4', { gameId: 'boshqa', pin: '483920', place: 3 }), false);
  _forgetMemory('P4'); assert.equal(arenaPlace('P4', { gameId: GID, pin: '483920', place: 2 }), false);
  resetResultDetails('P4', { keepArena: true }); assert.equal(arenaPlace('P4', { gameId: GID, pin: '483920', place: 3 }), false);
  game('P4', 'p4b', ALL12, { mode: 'student', pin: '483920' }); // qayta o'yin
  assert.deepEqual(cs('P4').podium, { game_id: GID, place: 1, finalized: true });
});
test('podium · PODIUM-01: 4-o\'rin va pasti → place null (LMS 422 bermaydi), 1–3 o\'zi', () => {
  for (const [id, place, want] of [['Q1', 1, 1], ['Q3', 3, 3], ['Q4', 4, null], ['Q5', 5, null], ['Q12', 12, null]]) {
    resetResultDetails(id); game(id, 'r' + id, ALL12, { mode: 'student', pin: '111111' });
    assert.equal(arenaPlace(id, { gameId: GID, pin: '111111', place }), true);
    assert.deepEqual(cs(id).podium, { game_id: GID, place: want, finalized: true }, id);
  }
  _forgetMemory('Q4'); assert.deepEqual(cs('Q4').podium, { game_id: GID, place: null, finalized: true }); // null ham saqlovdan tiklanadi
});
test('podium · 2: solo, boshqa PIN, javobsiz, o\'yin boshlanmagan, noto\'g\'ri place — yozilmaydi va kutilmaydi', () => {
  resetResultDetails('P2'); game('P2', 's1', ALL12); // solo
  assert.equal(podiumExpected('P2', '483920'), false); assert.equal(arenaPlace('P2', { gameId: GID, pin: '483920', place: 1 }), false); assert.equal(cs('P2').podium, undefined);
  resetResultDetails('P3'); game('P3', 'p3', ALL12, { mode: 'student', pin: '111111' });
  assert.equal(arenaPlace('P3', { gameId: GID, pin: '222222', place: 1 }), false); assert.equal(cs('P3').podium, undefined);
  resetResultDetails('P5'); game('P5', 'p5', NONE12, { mode: 'student', pin: '111111' });
  assert.equal(podiumExpected('P5', '111111'), false); assert.equal(arenaPlace('P5', { gameId: GID, pin: '111111', place: 1 }), false);
  resetResultDetails('P6'); assert.equal(podiumExpected('P6', '111111'), false); assert.equal(arenaPlace('P6', { gameId: GID, pin: '111111', place: 1 }), false);
  resetResultDetails('P7'); game('P7', 'p7', ALL12, { mode: 'student', pin: '111111' });
  for (const place of [0, -1, 2.5, null, '1']) assert.equal(arenaPlace('P7', { gameId: GID, pin: '111111', place }), false);
  assert.equal(arenaPlace('P7', { gameId: '', pin: '111111', place: 1 }), false);
  assert.equal(podiumExpected('P7', '111111'), true);
});
test('podium · 3: birinchi o\'yin solo bo\'lsa jonli o\'yin o\'rni kutilmaydi; yangi urinish (keepArena) o\'rinni saqlaydi', () => {
  resetResultDetails('P8'); game('P8', 's8', SEQ_6_5_SKIP, { done: false });
  resetResultDetails('P8', { keepArena: true }); game('P8', 'p8', ALL12, { mode: 'student', pin: '483920' });
  assert.equal(podiumExpected('P8', '483920'), false); assert.equal(arenaPlace('P8', { gameId: GID, pin: '483920', place: 1 }), false);
  resetResultDetails('P9'); game('P9', 'p9', ALL12, { mode: 'student', pin: '483920' }); arenaPlace('P9', { gameId: GID, pin: '483920', place: 2 });
  resetResultDetails('P9', { keepArena: true });
  assert.deepEqual(cs('P9').podium, { game_id: GID, place: 2, finalized: true });
});
test('podium · 4: muhr — «Tamom»dan keyin kelgan o\'rin muhrlangan yukni o\'zgartirmaydi (dars holdFinish bilan kutadi)', () => {
  resetResultDetails('P10'); unsealPayload('P10'); game('P10', 'p10', ALL12, { mode: 'student', pin: '483920' });
  const mk = () => ({ livePin: '483920', liveMode: 'student', resultDetails: buildResultDetails({ lessonId: 'P10', screenMeta: META, answers: {}, earned: [], achievements: ACH, lang: 'uz', arenaBank: BANK12 }) });
  assert.equal(sealPayload('P10', mk()).resultDetails.codestrike.podium, undefined);
  arenaPlace('P10', { gameId: GID, pin: '483920', place: 1 });
  assert.equal(sealPayload('P10', mk()).resultDetails.codestrike.podium, undefined);
});
