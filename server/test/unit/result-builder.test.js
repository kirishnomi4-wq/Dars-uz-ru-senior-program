import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLivePayloads, buildSoloPayload, validatePayload, assignRanks, badgesFor, studentStats,
  lessonQuestions, arenaQuestions, liveEventId, soloEventId,
  questionOrder, buildStudentDetails, validateStudentDetails, finalizePayload, stripDetails, hasDetails, payloadBytes, DETAILS_LIMITS,
} from '../../src/modules/results/result-builder.js';
import { nextDelayMs, isRetryable, MAX_SEND_ATTEMPTS } from '../../src/modules/results/retry.js';

const keys = [{ question_id: 's4' }, { question_id: 's9' }, { question_id: 's15' }, { question_id: 'quiz-0' }, { question_id: 'quiz-1' }];
const T0 = new Date('2026-09-03T09:00:12Z');
const min = (m) => new Date(T0.getTime() + m * 60_000);
const ans = (pid, qid, screen, correct, elapsed, m) => ({ player_id: pid, question_id: qid, screen_idx: screen, correct, elapsed_ms: elapsed, answered_at: min(m) });

// Sinf: pA, pB (LMS), pC (LMS, kam), pD (LMS, hech narsa), pPIN (PIN bilan kirgan — LMS emas, lekin podiumda!)
function liveInput() {
  const answersByPlayer = new Map([
    ['pA', [ans('pA', 's4', 4, true, 2000, 5), ans('pA', 's9', 9, true, 1500, 10), ans('pA', 's15', 15, true, 1800, 20), ans('pA', 'quiz-0', 100, true, 900, 30), ans('pA', 'quiz-1', 101, true, 1100, 31)]],
    ['pB', [ans('pB', 's4', 4, false, 3000, 5), ans('pB', 's9', 9, true, 2500, 10), ans('pB', 's15', 15, true, 2200, 20), ans('pB', 'quiz-0', 100, true, 1900, 30), ans('pB', 'quiz-1', 101, true, 2100, 31)]],
    ['pC', [ans('pC', 's4', 4, false, 4000, 5), ans('pC', 's9', 9, false, 4100, 10)]],
    ['pD', []],
    // PIN-o'quvchi: 3/3 to'g'ri, pA dan TEZROQ → ekranda 1-o'rin
    ['pPIN', [ans('pPIN', 's4', 4, true, 1000, 5), ans('pPIN', 's9', 9, true, 1000, 10), ans('pPIN', 's15', 15, true, 1000, 20), ans('pPIN', 'quiz-0', 100, false, 500, 30)]],
  ]);
  return {
    session: { pin: '811222', lesson_id: 'internet-01-v18', gid: 861, teacher_id: 145, started_at: T0, finished_at: min(60) },
    lessonTitle: 'Internet qanday ishlaydi',
    keys,
    players: [
      { id: 'pA', joined_at: T0 }, { id: 'pB', joined_at: min(1) }, { id: 'pC', joined_at: T0 }, { id: 'pD', joined_at: T0 }, { id: 'pPIN', joined_at: min(2) },
    ],
    participants: [
      { subject_id: 34174, player_id: 'pA', joined_at: T0, reached_end: true },
      { subject_id: 34175, player_id: 'pB', joined_at: min(1), reached_end: true },
      { subject_id: 34176, player_id: 'pC', joined_at: T0, reached_end: false },
      { subject_id: 34177, player_id: 'pD', joined_at: T0, reached_end: false },
    ],
    answersByPlayer,
  };
}

test('event_id qoliplari (LMS §7.3) va uzunlik', () => {
  assert.equal(liveEventId('811222', T0), 'sess_811222_20260903T090012Z');
  assert.equal(liveEventId('811222', T0, 2), 'sess_811222_20260903T090012Z_p2');
  assert.match(soloEventId(34174, 'js-conditions-02-v18', T0), /^solo_34174_js-conditions-02-v18_20260903T090012Z$/);
  assert.ok(soloEventId(1, 'x'.repeat(300), T0).length <= 128);
  assert.match(soloEventId(1, 'bad id!', T0), /^solo_1_bad-id-_/);
});

test('savol-to\'plamlari: count = dars-testlari (arena tashqari), arena alohida', () => {
  assert.deepEqual([...lessonQuestions(keys)], ['s4', 's9', 's15']);
  assert.deepEqual([...arenaQuestions(keys)], ['quiz-0', 'quiz-1']);
});

// F-0916-03 (2026-09-16): PmLesson10 kalitlari — 4 ball-ekran + 4 ishtirok-kalit (-1, s-qolipsiz) + arena
const PM10_KEYS = [
  { question_id: 's3', correct_idx: 1 }, { question_id: 's5', correct_idx: 2 }, { question_id: 's7', correct_idx: 0 }, { question_id: 's11', correct_idx: 1 },
  { question_id: 'kadrlar', correct_idx: -1 }, { question_id: 'practice', correct_idx: -1 }, { question_id: 'joy', correct_idx: -1 }, { question_id: 'koding', correct_idx: -1 },
  { question_id: 'quiz-0', correct_idx: 2 }, { question_id: 'quiz-1', correct_idx: 0 },
];
test('F-0916-03: ishtirok-kalitlar (-1, s-qolipsiz) dars-savoli emas — total 4 (8 emas), arena order 5, s16:-1 qoladi', () => {
  assert.deepEqual([...lessonQuestions(PM10_KEYS)], ['s3', 's5', 's7', 's11']);
  assert.deepEqual([...arenaQuestions(PM10_KEYS)], ['quiz-0', 'quiz-1']);
  assert.deepEqual([...questionOrder(PM10_KEYS).entries()], [['s3', 1], ['s5', 2], ['s7', 3], ['s11', 4], ['quiz-0', 5], ['quiz-1', 6]]);
  // yakuniy amaliy ball-ekran (ReactApiPost s16: -1) — s-qolipda → hisobda qoladi
  assert.deepEqual([...lessonQuestions([{ question_id: 's4', correct_idx: 1 }, { question_id: 's16', correct_idx: -1 }, { question_id: 'practice', correct_idx: -1 }])], ['s4', 's16']);
  // correct_idx yo'q (eski kalit) → ishtirok emas
  assert.deepEqual([...lessonQuestions([{ question_id: 'practice' }, { question_id: 's4' }])], ['practice', 's4']);
  // solo payload: total_questions = 4, ishtirok-javob (screen_idx ≥ 500) sanalmaydi
  const solo = buildSoloPayload({
    attempt: { started_at: T0, finished_at: min(20), reached_end: true }, subjectId: 31352, lessonId: 'pm-m3d14-v1', lessonTitle: 'PM 10',
    keys: PM10_KEYS, answers: [ans('p', 's3', 3, true, 900, 1), ans('p', 's5', 5, false, 900, 2), ans('p', 's7', 7, true, 900, 3), ans('p', 's11', 11, true, 900, 4)],
  });
  assert.equal(solo.payload.total_questions, 4);
  assert.deepEqual([solo.payload.students[0].answered, solo.payload.students[0].correct_answers], [4, 3]);
  assert.deepEqual(validatePayload(solo.payload), []);
});

test('studentStats: takror savol sanalmaydi, faqat to\'plamdagi savollar', () => {
  const q = lessonQuestions(keys);
  const s = studentStats([ans('p', 's4', 4, true, 1000, 1), ans('p', 's4', 4, false, 1, 2), ans('p', 'yoq', 7, true, 1, 3), ans('p', 'quiz-0', 100, true, 1, 4)], q);
  assert.deepEqual([s.answered, s.correct, s.elapsedTotal], [1, 1, 1000]);
});

test('assignRanks — ekran-podium bilan bir xil: to\'g\'ri ↓, vaqt ↑, tenglikda avval qo\'shilgan; 0 to\'g\'ri ham (3 tadan kam bo\'lsa)', () => {
  const rows = [
    { id: 'a', joinedAt: 1, stats: { correct: 3, elapsedTotal: 5000, answered: 3 } },
    { id: 'b', joinedAt: 2, stats: { correct: 3, elapsedTotal: 4000, answered: 3 } },
    { id: 'c', joinedAt: 3, stats: { correct: 1, elapsedTotal: 100, answered: 1 } },
    { id: 'd', joinedAt: 4, stats: { correct: 0, elapsedTotal: 0, answered: 0 } },
    { id: 'e', joinedAt: 5, stats: { correct: 2, elapsedTotal: 100, answered: 2 } },
  ];
  const r = assignRanks(rows);
  assert.deepEqual([r.get('b'), r.get('a'), r.get('e'), r.get('c'), r.get('d')], [1, 2, 3, undefined, undefined]);
  // 2 ta o'yinchi + 1 ta javobsiz → ekranda 🥉 0/N — biz ham shunday
  const small = assignRanks(rows.slice(0, 2).concat(rows[3]));
  assert.equal(small.get('d'), 3);
  // arena: javob bermaganlar podiumga kirmaydi
  const arena = assignRanks(rows, { requireAnswered: true });
  assert.equal(arena.get('d'), undefined);
  // F-0911-02: LMS'ga ketadigan dars-podiumi — 0 to'g'ri yechgan rank olmaydi (javob bergan bo'lsa ham)
  const strict = assignRanks(rows.slice(0, 2).concat([{ id: 'z', joinedAt: 6, stats: { correct: 0, elapsedTotal: 10, answered: 4 } }, rows[3]]), { requireCorrect: true });
  assert.deepEqual([strict.get('b'), strict.get('a'), strict.get('z'), strict.get('d')], [1, 2, undefined, undefined]);
  // tenglik: bir xil to'g'ri va vaqt → avval qo'shilgan
  const tie = assignRanks([{ id: 'x', joinedAt: 9, stats: { correct: 1, elapsedTotal: 10, answered: 1 } }, { id: 'y', joinedAt: 1, stats: { correct: 1, elapsedTotal: 10, answered: 1 } }]);
  assert.deepEqual([tie.get('y'), tie.get('x')], [1, 2]);
});

test('badgesFor: all_correct/first_try/top/graduate/speedster/comeback/arena_top qoidalari', () => {
  const full = { answered: 5, correct: 5, avgElapsed: 1000, firstHalfCorrect: 1 };
  assert.deepEqual(badgesFor({ stats: full, total: 5, rank: 1, completed: true, groupMedianAvg: 2000, arenaRank: 2 }), ['all_correct', 'first_try', 'speedster', 'top_1', 'graduate', 'arena_top_2']);
  const cb = { answered: 6, correct: 5, avgElapsed: 3000, firstHalfCorrect: 1 / 3 };
  assert.deepEqual(badgesFor({ stats: cb, total: 6, rank: null, completed: false, groupMedianAvg: 2000 }), ['comeback']);
  const none = { answered: 2, correct: 0, avgElapsed: 500, firstHalfCorrect: 0 };
  // F-0917-02: bo'sh ro'yxat yuborilmaydi (School API `required` bo'sh massivni 422 bilan rad etadi) — faqat shu holda `participant`
  assert.deepEqual(badgesFor({ stats: none, total: 5, rank: null, completed: false, groupMedianAvg: 2000 }), ['participant']);
});

test('buildLivePayloads: count = dars-testlari; podiumda PIN-o\'quvchi ham hisobda (u 1-o\'rin → LMS-o\'quvchilar 2/3); arena nishon', () => {
  const [ev] = buildLivePayloads(liveInput());
  assert.equal(ev.event_id, 'sess_811222_20260903T090012Z');
  const p = ev.payload;
  assert.equal(p.mode, 'live');
  assert.equal(p.group_id, 861);
  assert.equal(p.teacher_id, 145);
  assert.equal(p.total_questions, 3, 'faqat s4, s9, s15 — arena kirmaydi');
  assert.equal(p.started_at, '2026-09-03T09:00:12Z');
  assert.equal(p.finished_at, '2026-09-03T10:00:12Z');
  assert.deepEqual(p.students.map((s) => s.student_id), [34174, 34175, 34176, 34177], 'PIN-o\'quvchi payloadda YO\'Q');
  const [a, b, c, d] = p.students;
  // ekran: pPIN 3/3 (3000 ms) → 1; pA 3/3 (5300 ms) → 2; pB 2/3 → 3; pC 0/2; pD 0/0
  assert.deepEqual([a.correct_answers, a.answered, a.rank, a.completed], [3, 3, 2, true]);
  assert.deepEqual([b.correct_answers, b.answered, b.rank], [2, 3, 3]);
  assert.deepEqual([c.correct_answers, c.answered, c.rank, c.completed], [0, 2, null, false]);
  assert.deepEqual([d.correct_answers, d.answered, d.rank], [0, 0, null]);
  assert.ok(a.badges.includes('all_correct') && a.badges.includes('top_2') && a.badges.includes('graduate'));
  assert.ok(a.badges.includes('arena_top_1'), `arena: pA 2/2 → arena_top_1; keldi ${a.badges}`);
  assert.ok(b.badges.includes('arena_top_2'));
  assert.ok(!c.badges.some((x) => x.startsWith('arena_')), 'arenaga javob bermagan → arena nishoni yo\'q');
  assert.equal(a.duration_sec, 31 * 60);
  assert.equal(a.badges_count, a.badges.length);
  assert.deepEqual(validatePayload(p), []);
});

test('F-0911-02: ikki o\'quvchi, biri 0 to\'g\'ri → unga rank/top_N berilmaydi (2026-09-10 dalili)', () => {
  const inp = liveInput();
  const keep = (id) => ['pA', 'pC'].includes(id);
  inp.players = inp.players.filter((p) => keep(p.id));
  inp.participants = inp.participants.filter((p) => keep(p.player_id));
  const [ev] = buildLivePayloads(inp);
  const [a, c] = ev.payload.students;
  assert.deepEqual([a.correct_answers, a.rank], [3, 1], 'to\'g\'ri yechgan 1-o\'rin');
  assert.deepEqual([c.correct_answers, c.answered, c.rank], [0, 2, null], 'ilgari bu o\'quvchi Top2 bo\'lardi');
  assert.ok(!c.badges.some((b) => b.startsWith('top_')), `top_N bo'lmasin, keldi ${c.badges}`);
  assert.deepEqual(validatePayload(ev.payload), []);
});

test('buildLivePayloads: players berilmasa participants\'dan; LMS-o\'quvchisi yo\'q → bo\'sh; 100+ → bo\'laklar', () => {
  const inp = liveInput();
  const [ev] = buildLivePayloads({ ...inp, players: undefined });
  assert.equal(ev.payload.students[0].rank, 1, 'PIN yo\'q → pA 1-o\'rin');
  assert.deepEqual(buildLivePayloads({ ...inp, participants: [] }), []);
  const many = { ...inp, players: undefined, participants: Array.from({ length: 150 }, (_, i) => ({ subject_id: 10000 + i, player_id: `p${i}`, joined_at: T0 })), answersByPlayer: new Map() };
  const evs = buildLivePayloads(many);
  assert.equal(evs.length, 2);
  assert.equal(evs[0].payload.students.length, 100);
  assert.equal(evs[1].payload.students.length, 50);
  assert.equal(evs[1].event_id, 'sess_811222_20260903T090012Z_p2');
  for (const e of evs) assert.deepEqual(validatePayload(e.payload), []);
});

test('buildSoloPayload: dars-testlari, rank null, group/teacher yo\'q, completed = reached_end', () => {
  const ev = buildSoloPayload({
    attempt: { started_at: T0, finished_at: min(25), reached_end: true },
    subjectId: 34176, lessonId: 'internet-01-v18', lessonTitle: 'Internet', keys,
    answers: [ans('p', 's4', 4, true, 1000, 1), ans('p', 's9', 9, false, 1000, 2), ans('p', 'quiz-0', 100, true, 1000, 3)],
  });
  const p = ev.payload;
  assert.equal(p.mode, 'solo');
  assert.ok(!('group_id' in p) && !('teacher_id' in p));
  assert.equal(p.total_questions, 3);
  const s = p.students[0];
  assert.deepEqual([s.student_id, s.correct_answers, s.answered, s.rank, s.completed, s.duration_sec], [34176, 1, 2, null, true, 1500]);
  assert.ok(s.badges.includes('graduate'));
  assert.deepEqual(validatePayload(p), []);
  const half = buildSoloPayload({ attempt: { started_at: T0, finished_at: T0, reached_end: false }, subjectId: 1, lessonId: 'l', lessonTitle: 'L', keys: [], answers: [] });
  assert.deepEqual([half.payload.students[0].completed, half.payload.total_questions], [false, 1]);
  assert.deepEqual(validatePayload(half.payload), []);
});

test('F-0917-02: nishonsiz o\'quvchi — bo\'sh badges YUBORILMAYDI (School API 422 «students.N.badges field is required»)', () => {
  // staging dalili: solo_31347_internet-01-v18_20260910T050107Z — answered 0, completed false, badges [] → 422 → manual_review
  const solo = buildSoloPayload({ attempt: { started_at: T0, finished_at: min(5), reached_end: false }, subjectId: 31347, lessonId: 'internet-01-v18', lessonTitle: 'Internet', keys, answers: [] });
  const s = solo.payload.students[0];
  assert.deepEqual([s.answered, s.completed, s.badges, s.badges_count], [0, false, ['participant'], 1]);
  assert.deepEqual(validatePayload(solo.payload), []);
  // jonli sinf: pC (0 to'g'ri, oxirigacha yetmagan) va pD (hech narsa) — ilgari [] edi va BUTUN guruh hodisasi yiqilardi
  const [ev] = buildLivePayloads(liveInput());
  const by = new Map(ev.payload.students.map((st) => [st.student_id, st]));
  assert.deepEqual(by.get(34176).badges, ['participant']);
  assert.deepEqual(by.get(34177).badges, ['participant']);
  for (const st of ev.payload.students) assert.ok(st.badges.length >= 1 && st.badges_count === st.badges.length, `bo'sh nishon: ${st.student_id}`);
  // faqat bo'sh holatda: boshqa nishoni bor o'quvchiga qo'shilmaydi
  assert.ok(!by.get(34174).badges.includes('participant') && !by.get(34175).badges.includes('participant'));
  assert.deepEqual(validatePayload(ev.payload), []);
  // validator bo'sh massivni navbatga tushishidan OLDIN tutadi
  const bad = structuredClone(ev.payload);
  bad.students[0].badges = []; bad.students[0].badges_count = 0;
  assert.ok(validatePayload(bad).some((e) => e.startsWith('badges bo\'sh')), `keldi: ${validatePayload(bad)}`);
});

test('validatePayload: buzilgan holatlarni topadi', () => {
  const [ev] = buildLivePayloads(liveInput());
  const p = JSON.parse(JSON.stringify(ev.payload));
  p.students[0].rank = 3; // dup rank bilan 34175
  p.students[1].correct_answers = 9; // > answered
  p.students[2].badges = ['Bad-Key'];
  p.students[2].badges_count = 1;
  const errs = validatePayload(p);
  assert.ok(errs.some((e) => e.startsWith('dup rank')));
  assert.ok(errs.some((e) => e.startsWith('counts')));
  assert.ok(errs.some((e) => e.startsWith('badge key')));
});

test('retry: jadval 1-3-10 s → daqiqalar → soat; 429/5xx/tarmoq qayta, 4xx emas', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 30].map(nextDelayMs), [1000, 3000, 10000, 60000, 300000, 900000, 3600000, 3600000]);
  assert.ok(isRetryable(null) && isRetryable(429) && isRetryable(500) && isRetryable(503));
  assert.ok(!isRetryable(401) && !isRetryable(403) && !isRetryable(409) && !isRetryable(422) && !isRetryable(404));
  assert.ok(MAX_SEND_ATTEMPTS >= 20);
});

// ---------------------------------------------------------------------------------------------------------------
// NATIJA-DETALLARI (TZ_LESSON_RESULT_DETAILS_RU §4, A-variant) — RESULT_DETAILS=a

const dKeys = [{ question_id: 's4', correct_idx: 1 }, { question_id: 's5b', correct_idx: 2 }, { question_id: 's12', correct_idx: 0 }, { question_id: 'quiz-1', correct_idx: 3 }, { question_id: 'quiz-0', correct_idx: 1 }];
const att = (screen, n, picked, correct, elapsed, m, texts) => ({ screen_idx: screen, attempt_no: n, picked, correct, elapsed_ms: elapsed, texts, answered_at: min(m) });
const tx = (lang = 'uz') => ({ question: 'Internet nima?', options: ['Bitta kompyuter', "Kompyuterlar tarmog'i", 'Brauzer', 'Sayt'], picked: 'Bitta kompyuter', correct: "Kompyuterlar tarmog'i", lang });
const CATALOG = [
  { id: 'firstwin', name: 'Bullseye!', title_uz: "Birinchi test savoliga to'g'ri javob berdingiz", title_ru: 'Вы правильно ответили на первый вопрос теста' },
  { id: 'graduate', name: 'Level Up!', title_uz: 'Darsni to\'liq yakunladingiz', title_ru: null },
];

test('questionOrder: dars-testlari ekran raqami bo\'yicha, keyin arena; qolipsiz id oxirida', () => {
  const o = questionOrder([...dKeys, { question_id: 'zeta' }, { question_id: 'alpha' }]);
  assert.deepEqual([...o.entries()], [['s4', 1], ['s5b', 2], ['s12', 3], ['alpha', 4], ['zeta', 5], ['quiz-0', 6], ['quiz-1', 7]]);
});

test('buildStudentDetails: 2 urinish (noto\'g\'ri→to\'g\'ri) → correct=false, solved=true; tarixsiz savol → ball-qatoridan 1 urinish; arena kind; lang ko\'pchilikdan', () => {
  const answers = [
    { question_id: 's4', screen_idx: 4, picked: 0, correct: false, elapsed_ms: 4200, answered_at: min(1) },
    { question_id: 's12', screen_idx: 12, picked: 0, correct: true, elapsed_ms: 900, answered_at: min(3) }, // record_attempt yo'q (eski dars)
    { question_id: 'quiz-0', screen_idx: 100, picked: 1, correct: true, elapsed_ms: 500, answered_at: min(5) },
    { question_id: 's99', screen_idx: 99, picked: 0, correct: true, elapsed_ms: 1, answered_at: min(6) }, // kalitda yo'q → kirmaydi
  ];
  const attempts = [
    att(4, 1, 0, false, 4200, 1, tx('ru')), att(4, 2, 1, true, 9800, 2, { ...tx('ru'), picked: "Kompyuterlar tarmog'i" }),
    att(4, 3, 1, true, 9900, 2, undefined),
  ];
  const d = buildStudentDetails({ answers, attempts, keys: dKeys, achievements: [{ achievement_id: 'graduate', earned_at: min(9) }, { achievement_id: 'FIRSTWIN', earned_at: min(1) }, { achievement_id: 'graduate', earned_at: min(10) }, { achievement_id: 'Bad Id!', earned_at: min(1) }], catalog: CATALOG });
  assert.equal(d.lang, 'ru');
  assert.deepEqual(d.questions.map((q) => [q.question_id, q.kind, q.order, q.correct, q.solved, q.attempts.length]), [['s4', 'test', 1, false, true, 3], ['s12', 'test', 3, true, true, 1], ['quiz-0', 'arena', 4, true, true, 1]]);
  const q4 = d.questions[0];
  assert.deepEqual([q4.question, q4.options.length, q4.correct_option, q4.correct_answer], ['Internet nima?', 4, 1, "Kompyuterlar tarmog'i"]);
  assert.deepEqual(q4.attempts.map((a) => [a.n, a.option, a.correct, a.elapsed_ms, a.answer]), [[1, 0, false, 4200, 'Bitta kompyuter'], [2, 1, true, 9800, "Kompyuterlar tarmog'i"], [3, 1, true, 9900, undefined]]);
  assert.equal(q4.attempts[0].at, '2026-09-03T09:01:12Z');
  const q12 = d.questions[1];
  assert.ok(!('question' in q12) && !('options' in q12), 'texts yo\'q → matn maydonlari yo\'q');
  assert.deepEqual(q12.attempts, [{ n: 1, option: 0, correct: true, elapsed_ms: 900, at: '2026-09-03T09:03:12Z' }]);
  assert.equal(d.questions[2].correct_option, 1);
  // yutuqlar: kichik harf, vaqt bo'yicha, takror/yaroqsiz id tashlanadi, ru title (ru yo'q bo'lsa uz)
  assert.deepEqual(d.achievements, [
    { id: 'firstwin', name: 'Bullseye!', title: 'Вы правильно ответили на первый вопрос теста', earned_at: '2026-09-03T09:01:12Z' },
    { id: 'graduate', name: 'Level Up!', title: 'Darsni to\'liq yakunladingiz', earned_at: '2026-09-03T09:09:12Z' },
  ]);
  // katalogda yo'q id → name=title=id
  const u = buildStudentDetails({ answers: [], attempts: [], keys: dKeys, achievements: [{ achievement_id: 'mystery', earned_at: min(1) }], catalog: CATALOG });
  assert.deepEqual([u.lang, u.questions, u.achievements[0].name, u.achievements[0].title], ['uz', [], 'mystery', 'mystery']);
});

test('detallar payload ichida: live + solo invariantlar (correct_answers = test&correct, answered = test soni), validatePayload toza', () => {
  const inp = liveInput();
  const attemptsByPlayer = new Map([['pB', [att(4, 1, 0, false, 3000, 5, tx()), att(4, 2, 1, true, 3500, 6, tx())]]]);
  const achievementsByPlayer = new Map([['pA', [{ achievement_id: 'firstwin', earned_at: min(5) }]]]);
  const [ev] = buildLivePayloads({ ...inp, details: { attemptsByPlayer, achievementsByPlayer, catalog: CATALOG } });
  assert.deepEqual(validatePayload(ev.payload), []);
  for (const s of ev.payload.students) {
    assert.equal(s.lang, 'uz');
    assert.equal(s.questions.filter((q) => q.kind === 'test').length, s.answered);
    assert.equal(s.questions.filter((q) => q.kind === 'test' && q.correct).length, s.correct_answers);
  }
  const b = ev.payload.students.find((s) => s.student_id === 34175); // pB
  assert.deepEqual([b.questions[0].question_id, b.questions[0].attempts.length, b.questions[0].correct, b.questions[0].solved], ['s4', 2, false, true]);
  assert.equal(ev.payload.students.find((s) => s.student_id === 34174).achievements[0].name, 'Bullseye!'); // pA
  const d = ev.payload.students.find((s) => s.student_id === 34177); // pD — hech narsa qilmagan
  assert.deepEqual([d.answered, d.questions, d.achievements, d.lang], [0, [], [], 'uz']);
  // detalsiz (bayroq off) — maydonlar umuman yo'q
  const [plain] = buildLivePayloads(inp);
  assert.ok(plain.payload.students.every((s) => !('questions' in s) && !('lang' in s) && !('achievements' in s)));
  assert.ok(!hasDetails(plain.payload) && hasDetails(ev.payload));
  assert.deepEqual(stripDetails(ev.payload), plain.payload);

  const solo = buildSoloPayload({
    attempt: { started_at: T0, finished_at: min(30), reached_end: true }, subjectId: 3003, lessonId: 'internet-01-v18', lessonTitle: 'Internet', keys,
    answers: [ans('pS', 's4', 4, false, 4200, 1)],
    details: { attempts: [att(4, 1, 0, false, 4200, 1, tx()), att(4, 2, 1, true, 8000, 2, tx())], achievements: [{ achievement_id: 'graduate', earned_at: min(30) }], catalog: CATALOG },
  });
  assert.deepEqual(validatePayload(solo.payload), []);
  const st = solo.payload.students[0];
  assert.deepEqual([st.correct_answers, st.answered, st.questions.length, st.questions[0].solved, st.achievements.length], [0, 1, 1, true, 1]);
});

test('validateStudentDetails: invariant buzilishlari topiladi', () => {
  const base = { id_type: 'lms', student_id: 1, correct_answers: 1, answered: 1, lang: 'uz' };
  const q = (over = {}) => ({ question_id: 's4', kind: 'test', order: 1, correct: true, solved: true, attempts: [{ n: 1, option: 1, correct: true, elapsed_ms: 10, at: '2026-09-03T09:00:00Z' }], ...over });
  assert.deepEqual(validateStudentDetails({ ...base, questions: [q()], achievements: [] }), []);
  assert.ok(validateStudentDetails({ ...base, lang: 'en' }).some((e) => e.startsWith('lang')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ correct: false, solved: false })] }).some((e) => e.startsWith('q first')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ solved: false })] }).some((e) => e.startsWith('q solved')));
  assert.ok(validateStudentDetails({ ...base, answered: 2, questions: [q()] }).some((e) => e.startsWith('answered≠')));
  assert.ok(validateStudentDetails({ ...base, correct_answers: 0, questions: [q()] }).some((e) => e.startsWith('correct≠')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ attempts: [{ n: 1, option: 1, correct: true, elapsed_ms: 10, at: '2026-09-03T09:00:10Z' }, { n: 2, option: 0, correct: false, elapsed_ms: 10, at: '2026-09-03T09:00:00Z' }] })] }).some((e) => e.startsWith('q at')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ kind: 'bonus' })] }).some((e) => e.startsWith('q kind')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ options: Array(7).fill('x') })] }).some((e) => e.startsWith('q options')));
  assert.ok(validateStudentDetails({ ...base, questions: [q({ question: 'x'.repeat(301) })] }).some((e) => e.startsWith('q question')));
  assert.ok(validateStudentDetails({ ...base, questions: [q(), q()] , answered: 2, correct_answers: 2 }).some((e) => e.startsWith('q id')));
  assert.ok(validateStudentDetails({ ...base, achievements: [{ id: 'Bad', name: 'x', title: 'y', earned_at: '2026-09-03T09:00:00Z' }] }).some((e) => e.startsWith('ach id')));
  assert.ok(validateStudentDetails({ ...base, achievements: [{ id: 'ok', name: 'x'.repeat(41), title: 'y', earned_at: '2026-09-03T09:00:00Z' }] }).some((e) => e.startsWith('ach name')));
  assert.ok(validateStudentDetails({ ...base, achievements: Array.from({ length: 21 }, (_, i) => ({ id: `a${i}`, name: 'n', title: 't', earned_at: '2026-09-03T09:00:00Z' })) }).some((e) => e.startsWith('achievements')));
});

test('finalizePayload: detallar buzuq → detallar tashlanadi, asosiy ketadi; hajm > 1 MB → tashlanadi; asosiy buzuq → problems', () => {
  const [ev] = buildLivePayloads({ ...liveInput(), details: { attemptsByPlayer: new Map(), achievementsByPlayer: new Map(), catalog: [] } });
  const ok = finalizePayload(ev.payload);
  assert.deepEqual([ok.problems, ok.detailsDropped, hasDetails(ok.payload)], [[], null, true]);
  // detal buzuq (solved yolg'on)
  const bad = structuredClone(ev.payload); bad.students[0].questions[0].solved = !bad.students[0].questions[0].solved;
  const r = finalizePayload(bad);
  assert.deepEqual([r.problems, hasDetails(r.payload)], [[], false]);
  assert.match(r.detailsDropped, /q solved/);
  // hajm
  const big = structuredClone(ev.payload); big.students[0].questions[0].question = 'x'.repeat(DETAILS_LIMITS.text);
  big.students[0].achievements = Array.from({ length: 20 }, (_, i) => ({ id: `a${i}`, name: 'n'.repeat(40), title: 't'.repeat(200), earned_at: '2026-09-03T09:00:00Z' }));
  big.students = Array.from({ length: 100 }, (_, i) => ({ ...structuredClone(big.students[0]), student_id: 5000 + i, rank: null, badges: big.students[0].badges.filter((b) => !b.startsWith('top_')), badges_count: big.students[0].badges.filter((b) => !b.startsWith('top_')).length }));
  for (const s of big.students) for (const q of s.questions) { q.options = Array(6).fill('o'.repeat(300)); q.question = 'q'.repeat(300); q.correct_answer = 'c'.repeat(300); for (const a of q.attempts) a.answer = 'a'.repeat(300); }
  assert.ok(payloadBytes(big) > DETAILS_LIMITS.payloadBytes, `hajm ${payloadBytes(big)}`);
  const sz = finalizePayload(big);
  assert.deepEqual([sz.problems, hasDetails(sz.payload)], [[], false]);
  assert.match(sz.detailsDropped, /^size:/);
  // asosiy buzuq — detallar bilan birga problems (manual_review)
  const broken = structuredClone(ev.payload); broken.total_questions = 0;
  const br = finalizePayload(broken);
  assert.ok(br.problems.includes('total_questions') && br.detailsDropped === null && hasDetails(br.payload));
});
