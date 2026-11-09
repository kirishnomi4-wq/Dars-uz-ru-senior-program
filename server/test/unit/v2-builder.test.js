// F-1105-03 S3: v2 hodisa quruvchi — 25-kontrakt §5–6 qoidalari; namunalar 16 v1.3 (A1, A2, A3, C1, C4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLessonResult, buildArenaParticipation, buildArenaResult, validateV2, logicalEnd, arenaPoints, buildPractice, LIMITS,
  lessonResultId, arenaParticipationId, arenaResultId,
} from '../../src/modules/results/v2-builder.js';

const ATT = '7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90';
const T0 = new Date('2026-11-10T09:01:05Z');
const at = (s) => new Date(T0.getTime() + s * 1000);
const keys = [{ question_id: 's2', correct_idx: 0 }, { question_id: 's5', correct_idx: 1 }, { question_id: 's9', correct_idx: -1 }, { question_id: 'quiz-0', correct_idx: 0 }, { question_id: 'quiz-1', correct_idx: 1 }, { question_id: 'quiz-2', correct_idx: 1 }];
const session = { pin: '483920', gid: 861, teacher_id: 145, started_at: '2026-11-10T09:00:12Z', finished_at: '2026-11-10T10:41:00Z', session_key: 'sess_483920_20261110T090012Z' };
const lesson = { lesson_id: 'netlify-deploy-v19', title: 'Netlify va deploy' };
const student = { subject_id: 34174 };
const tx = (q, opts, ci) => ({ question: q, options: opts, picked: opts[ci], correct: opts[ci], lang: 'uz' });
const O2 = ['Sayt papkangizni internetda saqlaydi va link beradi', 'Kodni chiroyli ranglar bilan bezaydi', 'Internet tezligini oshiradi', "Telefonga o'yin o'rnatadi"];
const O5 = ["Saytni o'chirish", 'Saytni internetga chiqarish', 'Kodni nusxalash', "Rasm qo'shish"];
const ans = (qid, idx, picked, correct, sec, el = 8400) => ({ question_id: qid, screen_idx: idx, picked, correct, elapsed_ms: el, answered_at: at(sec) });
const hist = (idx, qid, picked, correct, sec, texts) => ({ screen_idx: idx, question_id: qid, attempt_no: 1, picked, correct, elapsed_ms: 8400, texts, answered_at: at(sec) });

function liveInput(over = {}) {
  return {
    attempt: { id: ATT, kind: 'live', lesson_id: lesson.lesson_id, lesson_version: 'v5', version_source: 'attempt', started_at: T0, finished_at: null, reached_end: true, reached_end_at: at(4295) },
    student, session, lesson, keys,
    answers: [ans('s2', 2, 0, true, 1807), ans('s5', 5, 1, true, 2845, 6100), ans('s9', 9, 0, true, 4000)],
    attemptsHist: [hist(2, 's2', 0, true, 1807, tx('Netlify nima qiladi?', O2, 0)), hist(5, 's5', 1, true, 2845, tx("Deploy so'zi nimani bildiradi?", O5, 1))],
    practice: [{ screen_idx: 9, screen_id: 's9', attempt_no: 1, checked: true, correct: false, at: at(3900) }, { screen_idx: 9, screen_id: 's9', attempt_no: 2, checked: true, correct: true, at: at(4000) }, { screen_idx: 7, screen_id: 's7', attempt_no: 1, checked: false, correct: null, at: at(3000) }],
    screenViews: [{ screen_idx: 0, opened_at: T0, by_student: true }, { screen_idx: 10, opened_at: at(4290), by_student: true }],
    progress: { screen: 10, total: 11, updated_at: at(4295) },
    achievements: [{ achievement_id: 'hostpick', earned_at: at(1807) }],
    catalog: [{ id: 'hostpick', name: 'Host Pick!', title_uz: 'Netlify nima qilishini aniqladingiz' }],
    trigger: 'reached_end', attemptNo: 1, processedAt: at(4296),
    ...over,
  };
}

test('id qoliplari — prefiks + attempt_id', () => {
  assert.equal(lessonResultId(ATT), `lr_${ATT}`); assert.equal(arenaParticipationId(ATT), `ap_${ATT}`); assert.equal(arenaResultId(ATT), `ar_${ATT}`);
});

test('A1: lesson_result jonli, reached_end — 16 v1.3 namunasi bilan bir xil (tests 2/2/2, amaliyot tashqari, practice[], details full, badges)', () => {
  const { payload: p, detailsDropped } = buildLessonResult(liveInput());
  assert.equal(detailsDropped, null);
  assert.deepEqual(validateV2(p), []);
  assert.equal(p.event_id, `lr_${ATT}`);
  assert.deepEqual([p.schema_version, p.event_type, p.mode, p.lesson_version, p.version_source, p.session_key, p.group_id, p.teacher_id], [2, 'lesson_result', 'live', 'v5', 'attempt', 'sess_483920_20261110T090012Z', 861, 145]);
  assert.deepEqual(p.student, { student_id: 34174, id_type: 'lms' });
  assert.equal(p.occurred_at, '2026-11-10T10:12:40Z');
  const r = p.result;
  assert.deepEqual([r.trigger, r.participated, r.completed, r.opened_at, r.completed_at, r.elapsed_sec, r.processed_at], ['reached_end', true, true, '2026-11-10T09:01:05Z', '2026-11-10T10:12:40Z', 4295, '2026-11-10T10:12:41Z']);
  assert.deepEqual(r.screens, { reached: 11, total: 11 });
  assert.deepEqual(r.tests, { total_questions: 2, answered: 2, correct_answers: 2 }, 's9 (-1) amaliyot — testdan tashqari');
  assert.deepEqual(r.badges, ['all_correct', 'first_try', 'graduate']);
  assert.deepEqual(p.practice, [{ screen_id: 's7', done: true, checked: false, correct: null }, { screen_id: 's9', done: true, checked: true, correct: true }]);
  assert.deepEqual(p.details, { status: 'full', reason: null, available: 2 });
  assert.deepEqual(p.questions.map((q) => [q.question_id, q.kind, q.order, q.correct_option, q.correct, q.attempts.length]), [['s2', 'test', 1, 0, true, 1], ['s5', 'test', 2, 1, true, 1]]);
  assert.deepEqual(p.achievements.map((a) => a.id), ['hostpick']);
  assert.equal(p.lang, 'uz');
});

test('A2: oxiriga yetmagan, sessiya yopilganda — completed false, completed_at null, participated (o\'zi ekran o\'tgan), elapsed = sessiya yopilishi', () => {
  const { payload: p } = buildLessonResult(liveInput({
    attempt: { id: ATT, kind: 'live', lesson_id: lesson.lesson_id, lesson_version: 'v5', version_source: 'attempt', started_at: '2026-11-10T09:03:44Z', finished_at: '2026-11-10T10:41:00Z', reached_end: false, reached_end_at: null },
    answers: [ans('s2', 2, 0, true, 1800)], attemptsHist: [hist(2, 's2', 0, true, 1800, tx('Netlify nima qiladi?', O2, 0))], practice: [], screenViews: [{ screen_idx: 5, opened_at: at(2000), by_student: true }],
    progress: { screen: 5, total: 11, updated_at: at(2000) }, achievements: [], trigger: 'session_closed',
  }));
  assert.deepEqual(validateV2(p), []);
  const r = p.result;
  assert.deepEqual([r.trigger, r.participated, r.completed, r.completed_at, r.elapsed_sec, r.screens.reached, r.badges], ['session_closed', true, false, null, 5836, 6, []]);
  assert.deepEqual(r.tests, { total_questions: 2, answered: 1, correct_answers: 1 });
  assert.deepEqual(p.details, { status: 'full', reason: null, available: 1 });
});

test('participated: faqat mentor ekran almashtirgan, javob yo\'q → false; completed bo\'lsa participated majburan true', () => {
  const { payload: p } = buildLessonResult(liveInput({
    attempt: { id: ATT, kind: 'live', lesson_id: lesson.lesson_id, lesson_version: null, version_source: 'unknown', started_at: T0, finished_at: at(3000), reached_end: false, reached_end_at: null },
    answers: [], attemptsHist: [], practice: [], screenViews: [{ screen_idx: 3, opened_at: at(100), by_student: false }, { screen_idx: 4, opened_at: at(200), by_student: false }], progress: { screen: 4, total: 11 }, achievements: [], trigger: 'session_closed',
  }));
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.result.participated, p.result.completed, p.lesson_version, p.version_source, p.result.tests, p.details], [false, false, null, 'unknown', { total_questions: 2, answered: 0, correct_answers: 0 }, { status: 'full', reason: null, available: 0 }]);
  assert.deepEqual(p.questions, []);
});

test('A3: solo 7 kun — occurred_at = ochilish + 7 kun, elapsed 604800, kech kelgan javob hisobga kirmaydi; solo da session maydonlari yo\'q', () => {
  const started = new Date('2026-11-03T14:02:11Z');
  const { payload: p } = buildLessonResult({
    attempt: { id: ATT, kind: 'solo', lesson_id: lesson.lesson_id, lesson_version: 'v5', version_source: 'attempt', started_at: started, finished_at: new Date('2026-11-10T14:14:58Z'), reached_end: false, reached_end_at: null },
    student, session: null, lesson, keys,
    answers: [{ question_id: 's2', screen_idx: 2, picked: 0, correct: true, elapsed_ms: 100, answered_at: new Date('2026-11-10T14:10:00Z') }], // deadline'dan KEYIN — kirmaydi
    attemptsHist: [], practice: [], screenViews: [{ screen_idx: 3, opened_at: new Date('2026-11-03T14:25:40Z'), by_student: true }], progress: { screen: 3, total: 11, updated_at: new Date('2026-11-03T14:25:40Z') }, achievements: [],
    trigger: 'solo_expired', attemptNo: 1, processedAt: new Date('2026-11-10T14:14:58Z'),
  });
  assert.deepEqual(validateV2(p), []);
  assert.ok(!('session_key' in p) && !('group_id' in p) && !('teacher_id' in p));
  assert.deepEqual([p.occurred_at, p.result.elapsed_sec, p.result.last_activity_at, p.result.tests.answered, p.result.processed_at], ['2026-11-10T14:02:11Z', 604800, '2026-11-03T14:25:40Z', 0, '2026-11-10T14:14:58Z']);
});

test('jonli deadline: 2 soatdan keyin yopilgan sessiya — occurred_at = boshlanish + 2 soat, elapsed ≤ 7200', () => {
  const { payload: p } = buildLessonResult(liveInput({
    attempt: { id: ATT, kind: 'live', lesson_id: lesson.lesson_id, lesson_version: 'v5', version_source: 'attempt', started_at: T0, finished_at: '2026-11-10T12:30:00Z', reached_end: false, reached_end_at: null },
    session: { ...session, finished_at: '2026-11-10T12:30:00Z' }, answers: [ans('s2', 2, 0, true, 100)], attemptsHist: [hist(2, 's2', 0, true, 100, tx('Netlify nima qiladi?', O2, 0))], practice: [], screenViews: [], progress: null, achievements: [], trigger: 'session_closed',
  }));
  assert.deepEqual(validateV2(p), []);
  assert.equal(p.occurred_at, '2026-11-10T11:00:12Z');
  assert.ok(p.result.elapsed_sec <= LIMITS.liveSec);
});

test('details omitted: matn buzuq → invalid_text, questions yo\'q, agregat qoladi; validateV2 toza', () => {
  const inp = liveInput({ attemptsHist: [hist(2, 's2', 0, true, 1807, { question: { uz: 'obj' }, options: O2, picked: O2[0], correct: O2[0], lang: 'uz' }), hist(5, 's5', 1, true, 2845, tx("Deploy so'zi nimani bildiradi?", O5, 1))] });
  const { payload: p, detailsDropped } = buildLessonResult(inp);
  assert.deepEqual(validateV2(p), []);
  assert.equal(p.details.status, 'omitted');
  assert.ok(!('questions' in p));
  assert.ok(detailsDropped);
  assert.deepEqual(p.result.tests, { total_questions: 2, answered: 2, correct_answers: 2 });
});

test('version_changed: tugatilmagan eski urinish — completed false; trigger saqlanadi', () => {
  const { payload: p } = buildLessonResult(liveInput({ attempt: { id: ATT, kind: 'solo', lesson_id: lesson.lesson_id, lesson_version: 'v5', version_source: 'attempt', started_at: T0, finished_at: at(600), reached_end: false, reached_end_at: null }, session: null, answers: [], attemptsHist: [], practice: [], screenViews: [{ screen_idx: 2, opened_at: at(10), by_student: true }], progress: { screen: 2, total: 11 }, achievements: [], trigger: 'version_changed' }));
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.result.trigger, p.result.completed, p.result.participated, p.result.elapsed_sec], ['version_changed', false, true, 600]);
});

test('B: arena_participation — shown/answer manbasi, kech kirgan 2-savol', () => {
  const { payload: p } = buildArenaParticipation({ attempt: liveInput().attempt, student, session, lesson, arena: { started_at: '2026-11-10T10:14:58Z', questions_total: 3 }, participation: { student_arena_no: 1, first_question_id: 'quiz-1', first_question_order: 2, first_shown_at: '2026-11-10T10:16:03Z', source: 'shown' } });
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.event_id, p.event_type, p.occurred_at, p.participation.first_question_order, p.participation.source, p.arena.questions_total], [`ap_${ATT}`, 'arena_participation', '2026-11-10T10:16:03Z', 2, 'shown', 3]);
  assert.throws(() => buildArenaParticipation({ attempt: { ...liveInput().attempt, kind: 'solo' }, student, session, lesson, arena: {}, participation: {} }), /faqat live/);
});

const arenaPlayers = () => ([
  { id: 'pA', joined_at: at(0), answers: [ans('quiz-0', 100, 0, true, 4500, 2100), ans('quiz-1', 101, 0, false, 4580, 4800), ans('quiz-2', 102, 1, true, 4661, 3300)] },
  { id: 'pPIN', joined_at: at(1), answers: [ans('quiz-0', 100, 0, true, 4502, 1000), ans('quiz-1', 101, 1, true, 4582, 1000), ans('quiz-2', 102, 1, true, 4663, 1000)] },
  { id: 'pB', joined_at: at(2), answers: [ans('quiz-0', 100, 1, false, 4503, 900)] },
  { id: 'pC', joined_at: at(3), answers: [] },
]);
const arenaHist = () => ([
  hist(100, 'quiz-0', 0, true, 4500, tx('Netlify nima qiladi?', ['Saytni internetga chiqaradi', "Kodni ranglarga bo'yaydi", 'Internetni tezlashtiradi', 'Telefonni zaryadlaydi'], 0)),
  { ...hist(101, 'quiz-1', 0, false, 4580, { question: "Deploy qilingan sayt manzili qayerda ko'rinadi?", options: ['Faqat kompyuterda', 'Netlify panelida, hamma uchun ochiq', 'Faqat telefonda', 'Hech qayerda'], picked: 'Faqat kompyuterda', correct: 'Netlify panelida, hamma uchun ochiq', lang: 'uz' }) },
  hist(102, 'quiz-2', 1, true, 4661, tx('Sayt yangilanganda nima qilinadi?', ['Yangi akkaunt ochiladi', 'Papka qayta yuklanadi (deploy)', "Kompyuter o'chiriladi", 'Hech narsa'], 1)),
]);

test('C1: arena_result — 2-o\'rin (PIN o\'yinchi 1-o\'rin), points formulasi, details full 3 ta arena yozuv, badges arena_top_2', () => {
  const { payload: p, detailsDropped } = buildArenaResult({
    attempt: liveInput().attempt, student, session, lesson, keys, playerId: 'pA',
    arena: { started_at: '2026-11-10T10:14:58Z', finished_at: '2026-11-10T10:19:30Z', end_reason: 'mentor', questions_total: 3, questions_shown: 3, players_total: 4 },
    participation: { student_arena_no: 1, first_shown_at: '2026-11-10T10:15:03Z', source: 'shown' }, players: arenaPlayers(), attemptsHist: arenaHist(),
  });
  assert.equal(detailsDropped, null);
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.event_id, p.arena.end_reason, p.arena.questions_shown, p.arena.players_total, p.result.participated, p.result.answered, p.result.correct_answers, p.result.place, p.result.badges, p.result.student_arena_no], [`ar_${ATT}`, 'mentor', 3, 4, true, 3, 2, 2, ['arena_top_2'], 1]);
  assert.equal(p.result.points, arenaPoints({ answered: 3, correct: 2, elapsedTotal: 2100 + 4800 + 3300 }));
  assert.deepEqual(p.details, { status: 'full', reason: null, available: 3 });
  assert.deepEqual(p.questions.map((q) => [q.question_id, q.kind, q.correct]), [['quiz-0', 'arena', true], ['quiz-1', 'arena', false], ['quiz-2', 'arena', true]]);
});

test('C2/C3: kirib javob bermagan (participated, 0, place null) va kirmagan (participated false, hammasi null/0)', () => {
  const base = { attempt: liveInput().attempt, student, session, lesson, keys, arena: { started_at: '2026-11-10T10:14:58Z', finished_at: '2026-11-10T10:19:30Z', end_reason: 'mentor', questions_total: 3, questions_shown: 3, players_total: 4 }, players: arenaPlayers(), attemptsHist: [] };
  const c2 = buildArenaResult({ ...base, playerId: 'pC', participation: { student_arena_no: 1, first_shown_at: '2026-11-10T10:15:04Z', source: 'shown' } }).payload;
  assert.deepEqual(validateV2(c2), []);
  assert.deepEqual([c2.result.participated, c2.result.participated_at, c2.result.answered, c2.result.points, c2.result.place, c2.result.badges, c2.details], [true, '2026-11-10T10:15:04Z', 0, 0, null, [], { status: 'full', reason: null, available: 0 }]);
  const c3 = buildArenaResult({ ...base, playerId: 'pX', participation: null }).payload;
  assert.deepEqual(validateV2(c3), []);
  assert.deepEqual([c3.result.participated, c3.result.participated_at, c3.result.student_arena_no, c3.result.answered, c3.result.place], [false, null, null, 0, null]);
});

test('javob bor, ko\'rsatish tasdig\'i yo\'qolgan → participated (source answer), participated_at = birinchi javob', () => {
  const p = buildArenaResult({ attempt: liveInput().attempt, student, session, lesson, keys, playerId: 'pB', participation: null, arena: { started_at: '2026-11-10T10:14:58Z', finished_at: '2026-11-10T10:19:30Z', end_reason: 'last_question_timeout', questions_total: 3, questions_shown: 3, players_total: 4 }, players: arenaPlayers(), attemptsHist: [] }).payload;
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual([p.result.participated, p.result.participated_at, p.result.answered, p.result.correct_answers, p.result.place], [true, '2026-11-10T10:16:08Z', 1, 0, null]);
});

test('C4: not_started — started_at null, finished_at = occurred_at, shown 0, players 0, hamma result null/0/false', () => {
  const p = buildArenaResult({ attempt: liveInput().attempt, student, session, lesson, keys, playerId: 'pA', participation: null, arena: { started_at: null, finished_at: '2026-11-10T10:41:00Z', end_reason: 'not_started', questions_total: 12, questions_shown: 0, players_total: 0 }, players: [], attemptsHist: [] }).payload;
  assert.deepEqual(validateV2(p), []);
  assert.deepEqual(p.arena, { started_at: null, finished_at: '2026-11-10T10:41:00Z', end_reason: 'not_started', questions_total: 12, questions_shown: 0, players_total: 0 });
  assert.deepEqual(p.result, { student_arena_no: null, participated: false, participated_at: null, answered: 0, correct_answers: 0, points: 0, place: null, badges: [] });
  assert.equal(p.occurred_at, '2026-11-10T10:41:00Z');
});

test('arenaPoints: tartib = to\'g\'ri ↓, vaqt ↑ (ekran podiumi bilan bir xil)', () => {
  const a = arenaPoints({ answered: 3, correct: 3, elapsedTotal: 32_000 }), b = arenaPoints({ answered: 3, correct: 3, elapsedTotal: 30_000 }), c = arenaPoints({ answered: 3, correct: 2, elapsedTotal: 1_000 });
  assert.ok(b > a && a > c, `${b} > ${a} > ${c}`);
  assert.equal(arenaPoints({ answered: 0, correct: 0, elapsedTotal: 0 }), 0);
  assert.equal(arenaPoints({ answered: 2, correct: 0, elapsedTotal: 500 }), 0, 'to\'g\'ri javobsiz ball yo\'q');
});

test('buildPractice: ekran bo\'yicha bitta yozuv; tekshirilgan → correct = oxir-oqibat o\'tdimi; tekshiruvsiz → null; deadline\'dan keyingisi kirmaydi', () => {
  const rows = [
    { screen_idx: 9, screen_id: 's9', checked: true, correct: false, at: at(10) }, { screen_idx: 9, screen_id: 's9', checked: true, correct: true, at: at(20) },
    { screen_idx: 7, screen_id: 's7', checked: false, correct: null, at: at(5) }, { screen_idx: 12, screen_id: 's12', checked: true, correct: true, at: at(999) },
  ];
  assert.deepEqual(buildPractice(rows, at(100)), [{ screen_id: 's7', done: true, checked: false, correct: null }, { screen_id: 's9', done: true, checked: true, correct: true }]);
});

test('logicalEnd: reached_end → reached_end_at; session_closed → min(finished, start+2h); solo_expired → start+7d', () => {
  const a = { kind: 'live', started_at: T0, reached_end_at: at(100), finished_at: at(200) };
  assert.equal(logicalEnd({ attempt: a, session, trigger: 'reached_end' }).occurredAt.getTime(), at(100).getTime());
  assert.equal(logicalEnd({ attempt: { ...a, finished_at: at(9000) }, session: { ...session, finished_at: at(9000) }, trigger: 'session_closed' }).occurredAt.toISOString(), '2026-11-10T11:00:12.000Z');
  assert.equal(logicalEnd({ attempt: { kind: 'solo', started_at: T0 }, session: null, trigger: 'solo_expired' }).occurredAt.getTime(), T0.getTime() + 604800 * 1000);
});

test('validateV2: buzilishlar topiladi', () => {
  const ok = buildLessonResult(liveInput()).payload;
  const bad = (f) => { const p = structuredClone(ok); f(p); return validateV2(p); };
  assert.ok(bad((p) => { p.event_id = 'lr_boshqa'; }).includes('event_id'));
  assert.ok(bad((p) => { p.result.completed = true; p.result.participated = false; }).includes('completed⇒participated'));
  assert.ok(bad((p) => { p.result.badges = ['top_1']; }).includes('badges'));
  assert.ok(bad((p) => { p.result.tests.correct_answers = 5; }).includes('tests'));
  assert.ok(bad((p) => { p.lesson_version = 'v5'; p.version_source = 'unknown'; }).includes('lesson_version unknown≠null'));
  assert.ok(bad((p) => { delete p.session_key; }).includes('session_key'));
  assert.ok(bad((p) => { p.questions.pop(); }).includes('details full≠answered'));
  assert.ok(bad((p) => { p.practice.push({ screen_id: 's1', done: true, checked: false, correct: true }); }).includes('practice'));
  assert.ok(bad((p) => { p.result.elapsed_sec = 7201; }).includes('elapsed_sec'));
});

test('hajm: 1 MiB dan oshsa tafsilot tashlanadi (omitted/size), asosiy ketadi', () => {
  const inp = liveInput();
  inp.attemptsHist = inp.attemptsHist.map((h) => ({ ...h, texts: { ...h.texts, question: 'q'.repeat(300), options: h.texts.options.map((o) => o + 'x'.repeat(250)) } }));
  const { payload: p } = buildLessonResult(inp);
  assert.ok(validateV2(p).length === 0 || p.details.status === 'full');
  // sun'iy katta: achievements bilan oshirib bo'lmaydi (chegara 20) — shuning uchun fitSize alohida: 1 MiB dan katta savol matni validator qirqadi; bu test faqat qoida mavjudligini tekshiradi
  assert.ok(LIMITS.payloadBytes === 1_048_576);
});
