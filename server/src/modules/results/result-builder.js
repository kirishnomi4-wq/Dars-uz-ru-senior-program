// Natija-payload quruvchi — SOF funksiyalar (baza yo'q), unit-test bilan qoplanadi.
// LMS v1.2 §7 qoidalari: correct <= answered <= total · rank 1..3 yoki null (bitta o'rin — bitta o'quvchi) ·
// badges lower_snake_case noyob, badges_count = uzunlik · duration 0..86400 · sanalar UTC ISO · 1..100 o'quvchi.
//
// TANGA-QARORLARI (2026-09-03, foydalanuvchi bilan kelishilgan):
//  1) count = FAQAT DARS-TESTLARI (quiz_keys'dagi `quiz-N` bo'lmagan savollar) — ekrandagi «N / jami» va onFinished bilan bir xil.
//     Arena (Mustahkamlash) count'ga kirmaydi; u alohida nishon bo'lib ketadi (arena_top_1/2/3).
//  2) TOP-3 — ekran-podium (ScreenPodium) qoidasi bilan AYNAN: dars-testlari bo'yicha to'g'ri soni ↓, vaqt yig'indisi ↑,
//     tenglikda avval qo'shilgan; HAMMA o'yinchi orasida (PIN bilan kirganlar ham) — LMS o'z o'quvchisining haqiqiy o'rnini oladi.
//  3) Bir o'quvchi — bir dars — bitta tanga-hodisa (result-service.js, solo uchun).

export const MAX_STUDENTS_PER_EVENT = 100;

/** Barqaror nishon-kalitlari (LMS saqlaydi — o'zgartirilmaydi). BACKEND_REJA §7. */
export const BADGE_KEYS = Object.freeze(['all_correct', 'first_try', 'speedster', 'top_1', 'top_2', 'top_3', 'graduate', 'comeback', 'arena_top_1', 'arena_top_2', 'arena_top_3']);

const isoBasic = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
export const isoUtc = (d) => new Date(d).toISOString().replace(/\.\d{3}Z$/, 'Z');
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** Live: sess_<pin>_<boshlanish>; solo: solo_<sub>_<lesson>_<boshlanish>. Qolip: [A-Za-z0-9][A-Za-z0-9._:@-]*, ≤128 */
export function liveEventId(pin, startedAt, part = 1) {
  return `sess_${pin}_${isoBasic(startedAt)}${part > 1 ? `_p${part}` : ''}`;
}
export function soloEventId(subjectId, lessonId, startedAt) {
  const lesson = String(lessonId).replace(/[^A-Za-z0-9._:@-]/g, '-').slice(0, 60);
  return `solo_${subjectId}_${lesson}_${isoBasic(startedAt)}`.slice(0, 128);
}

const isArenaQ = (id) => /^quiz-\d+$/.test(id);
// F-0916-03 (2026-09-16): ISHTIROK-KALIT — `correct_idx = -1` VA id `s<raqam>` qolipida EMAS (`practice`, `kadrlar`, `joy`, `koding`).
// Darsda bular amaliy ekranlar («Bajardim» → ishtirok, PRACTICE_BASE zonasi, screen_idx ≥ 500) — ball-ekran emas. Ilgari
// lessonQuestions ularni ham sanab, total_questions'ni oshirib yuborardi (PmLesson10: 8, ekranda 4; 38/70 CRM-darsda).
// `s16: -1` kabi yakuniy amaliy BALL-ekranlar s-qolipda va test-zonada yuboriladi — ular hisobda QOLADI (ekran bilan bir xil).
// Dars tomonidagi darvoza: scripts/lint-keys.mjs (s-kalitlar to'plami == scored ekranlar to'plami).
export const isParticipationKey = (k) => !!k && Number(k.correct_idx) === -1 && !/^s\d+[a-z]*$/i.test(String(k.question_id));

/** Dars-testlari to'plami (arena va ishtirok-kalitlar tashqari) — tanga-hisob va total_questions shu bo'yicha */
export function lessonQuestions(keys) {
  const ids = new Set();
  for (const k of keys || []) if (k && typeof k.question_id === 'string' && !isArenaQ(k.question_id) && !isParticipationKey(k)) ids.add(k.question_id);
  return ids;
}
/** Arena savollari (quiz-N) — faqat nishon uchun */
export function arenaQuestions(keys) {
  const ids = new Set();
  for (const k of keys || []) if (k && typeof k.question_id === 'string' && isArenaQ(k.question_id)) ids.add(k.question_id);
  return ids;
}
/** Orqaga moslik: mode bo'yicha to'plam (ikkala rejimda ham dars-testlari) */
export function questionSet(keys, _mode) { return lessonQuestions(keys); }

/**
 * Bitta o'yinchining ko'rsatkichlari (berilgan savol-to'plami bo'yicha).
 * @param {Array<{question_id: string, screen_idx: number, correct: boolean, elapsed_ms: number, answered_at: string|Date}>} answers
 * @param {Set<string>} questions
 */
export function studentStats(answers, questions) {
  const seen = new Map(); // question_id → javob (birinchisi qotgan — SQL unique (player, screen))
  for (const a of answers || []) {
    if (!questions.has(a.question_id) || seen.has(a.question_id)) continue;
    seen.set(a.question_id, a);
  }
  const list = [...seen.values()].sort((x, y) => (x.screen_idx - y.screen_idx));
  const answered = list.length;
  const correct = list.filter((a) => a.correct === true).length;
  const elapsedTotal = list.reduce((s, a) => s + clamp(Number(a.elapsed_ms) || 0, 0, 3_600_000), 0);
  const avgElapsed = answered ? elapsedTotal / answered : Infinity;
  const half = Math.floor(list.length / 2);
  const firstHalfCorrect = half ? list.slice(0, half).filter((a) => a.correct).length / half : null;
  const lastAnsweredAt = list.reduce((m, a) => { const t = new Date(a.answered_at || 0).getTime(); return t > m ? t : m; }, 0);
  return { answered, correct, elapsedTotal, avgElapsed, firstHalfCorrect, lastAnsweredAt };
}

/**
 * Podium — tartib ekran (ScreenPodium) bilan bir xil: to'g'ri ↓, vaqt ↑, tenglikda avval qo'shilgan.
 * Ekrandan FARQI (F-0911-02, 2026-09-11 qarori): LMS'ga ketadigan rank/`top_N` faqat kamida bitta
 * TO'G'RI javob bergan o'quvchiga beriladi — tanga haqiqiy natijaga berilsin. Ekranda esa hamma
 * ko'rinaveradi (rag'bat uchun 🥉 0/N), u tegilmaydi.
 * @param {Array<{ id: string, joinedAt: number, stats: {correct:number, elapsedTotal:number, answered:number} }>} rows
 * @param {{ requireAnswered?: boolean, requireCorrect?: boolean }} [opts]  arena: javob bermaganlar kirmaydi · dars-podiumi: 0 to'g'ri kirmaydi
 * @returns {Map<string, number>} player id → 1..3
 */
export function assignRanks(rows, opts = {}) {
  const list = rows
    .filter((r) => !opts.requireAnswered || r.stats.answered > 0)
    .filter((r) => !opts.requireCorrect || r.stats.correct > 0)
    .sort((a, b) => (b.stats.correct - a.stats.correct) || (a.stats.elapsedTotal - b.stats.elapsedTotal) || (a.joinedAt - b.joinedAt) || String(a.id).localeCompare(String(b.id)));
  const map = new Map();
  list.slice(0, 3).forEach((r, i) => map.set(r.id, i + 1));
  return map;
}

function median(nums) {
  const a = nums.filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return Infinity;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

/** Nishonlar (BACKEND_REJA §7). groupMedianAvg — guruh bo'yicha o'rtacha javob-vaqti medianasi. */
export function badgesFor({ stats, total, rank, completed, groupMedianAvg, arenaRank = null }) {
  const b = [];
  const ratio = total > 0 ? stats.correct / total : 0;
  if (total > 0 && stats.correct === total) b.push('all_correct');
  if (stats.answered > 0 && stats.answered === total && stats.correct === stats.answered) b.push('first_try'); // jonli testda bitta urinish — birinchi urinishda to'g'ri
  if (Number.isFinite(groupMedianAvg) && stats.answered >= 3 && stats.avgElapsed < groupMedianAvg && ratio >= 0.8) b.push('speedster');
  if (rank >= 1 && rank <= 3) b.push(`top_${rank}`);
  if (completed) b.push('graduate');
  if (stats.firstHalfCorrect !== null && stats.answered >= 4 && stats.firstHalfCorrect < 0.5 && ratio >= 0.7) b.push('comeback');
  if (arenaRank >= 1 && arenaRank <= 3) b.push(`arena_top_${arenaRank}`);
  // F-0917-02 (2026-09-17): School API (Laravel `required`) BO'SH massivni «maydon yo'q» deb 422 bilan rad etadi
  // («The students.0.badges field is required.») — jonli sinfda bitta nishonsiz o'quvchi BUTUN hodisani yiqitadi.
  // Himoya: ro'yxat bo'sh qolsa — `participant` (faqat shu holda; boshqa nishoni bor o'quvchiga qo'shilmaydi).
  if (!b.length) b.push('participant');
  return b;
}

/**
 * Live payload(lar)i — 100 tadan ko'p o'quvchi bo'lsa bo'laklarga bo'linadi (event_id _p2, _p3…).
 * @param {{ session: { pin: string, lesson_id: string, gid: number|string, teacher_id: number|string, started_at: Date|string, finished_at?: Date|string },
 *           lessonTitle: string, keys: Array<{question_id: string}>,
 *           players: Array<{ id: string, joined_at: Date|string }>,                         // HAMMA o'yinchi (PIN ham) — podium uchun
 *           participants: Array<{ subject_id: number|string, player_id: string, joined_at: Date|string, reached_end?: boolean }>, // LMS-o'quvchilar
 *           answersByPlayer: Map<string, Array<any>>, now?: Date }} input
 * @returns {Array<{ event_id: string, payload: object }>}
 */
export function buildLivePayloads(input) {
  const { session, lessonTitle, keys, participants, answersByPlayer } = input;
  const players = input.players && input.players.length ? input.players : participants.map((p) => ({ id: p.player_id, joined_at: p.joined_at }));
  const finishedAt = new Date(session.finished_at || input.now || Date.now());
  const startedAt = new Date(session.started_at);
  const lessonQ = lessonQuestions(keys);
  const arenaQ = arenaQuestions(keys);

  // Podium — hamma o'yinchi (ekran bilan bir xil)
  const allRows = players.map((p) => ({
    id: p.id,
    joinedAt: new Date(p.joined_at).getTime(),
    stats: studentStats(answersByPlayer.get(p.id) || [], lessonQ),
    arena: studentStats(answersByPlayer.get(p.id) || [], arenaQ),
  }));
  const ranks = assignRanks(allRows, { requireCorrect: true }); // F-0911-02: 0 to'g'ri → rank yo'q (correct_answers baribir ketadi)
  const arenaRanks = arenaQ.size ? assignRanks(allRows.map((r) => ({ id: r.id, joinedAt: r.joinedAt, stats: r.arena })), { requireAnswered: true }) : new Map();
  const byPlayer = new Map(allRows.map((r) => [r.id, r]));

  const rows = participants
    .map((p) => ({ subjectId: Number(p.subject_id), p, row: byPlayer.get(p.player_id) || { stats: studentStats([], lessonQ), arena: studentStats([], arenaQ) } }))
    .sort((a, b) => a.subjectId - b.subjectId);
  if (!rows.length) return [];
  const total = Math.max(1, lessonQ.size, ...rows.map((r) => r.row.stats.answered));
  const groupMedianAvg = median(allRows.map((r) => r.stats.avgElapsed));

  const details = input.details || null; // { attemptsByPlayer, achievementsByPlayer, catalog } — RESULT_DETAILS=a
  const students = rows.map(({ subjectId, p, row }) => {
    const { stats } = row;
    const rank = ranks.get(p.player_id) ?? null;
    const completed = !!p.reached_end || (stats.answered >= total && total > 0);
    const badges = badgesFor({ stats, total, rank, completed, groupMedianAvg, arenaRank: arenaRanks.get(p.player_id) ?? null });
    const end = Math.max(stats.lastAnsweredAt, row.arena.lastAnsweredAt, 0) || finishedAt.getTime();
    const duration = clamp(Math.round((Math.min(end, finishedAt.getTime()) - new Date(p.joined_at).getTime()) / 1000), 0, 86400);
    const base = {
      student_id: subjectId,
      id_type: 'lms',
      correct_answers: clamp(stats.correct, 0, total),
      answered: clamp(stats.answered, stats.correct, total),
      rank,
      badges,
      badges_count: badges.length,
      duration_sec: Number.isFinite(duration) ? duration : 0,
      completed,
    };
    if (!details) return base;
    return { ...base, ...buildStudentDetails({
      answers: answersByPlayer.get(p.player_id) || [], attempts: details.attemptsByPlayer?.get(p.player_id) || [],
      keys, achievements: details.achievementsByPlayer?.get(p.player_id) || [], catalog: details.catalog,
    }) };
  });

  const out = [];
  for (let i = 0, part = 1; i < students.length; i += MAX_STUDENTS_PER_EVENT, part++) {
    const chunk = students.slice(i, i + MAX_STUDENTS_PER_EVENT);
    const eventId = liveEventId(session.pin, startedAt, part);
    out.push({
      event_id: eventId,
      payload: {
        event_id: eventId,
        lesson_id: session.lesson_id,
        lesson_title: String(lessonTitle || session.lesson_id).slice(0, 255),
        mode: 'live',
        group_id: Number(session.gid),
        teacher_id: Number(session.teacher_id),
        started_at: isoUtc(startedAt),
        finished_at: isoUtc(finishedAt < startedAt ? startedAt : finishedAt),
        total_questions: clamp(total, 1, 1000),
        students: chunk,
      },
    });
  }
  return out;
}

/**
 * Solo payload — bitta o'quvchi, rank null, group/teacher yo'q. Count = dars-testlari (arena solo'da yozilmaydi).
 * @param {{ attempt: { started_at, finished_at, reached_end: boolean }, subjectId: number, lessonId: string, lessonTitle: string,
 *           keys: Array<{question_id: string}>, answers: Array<any> }} input
 */
export function buildSoloPayload(input) {
  const { attempt, subjectId, lessonId, lessonTitle, keys, answers } = input;
  const lessonQ = lessonQuestions(keys);
  const stats = studentStats(answers || [], lessonQ);
  const total = Math.max(1, lessonQ.size, stats.answered);
  const startedAt = new Date(attempt.started_at);
  const finishedAt = new Date(attempt.finished_at || Date.now());
  const completed = !!attempt.reached_end;
  const badges = badgesFor({ stats, total, rank: null, completed, groupMedianAvg: Infinity });
  const duration = clamp(Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000), 0, 86400);
  const eventId = soloEventId(subjectId, lessonId, startedAt);
  const student = {
    student_id: Number(subjectId),
    id_type: 'lms',
    correct_answers: clamp(stats.correct, 0, total),
    answered: clamp(stats.answered, stats.correct, total),
    rank: null,
    badges,
    badges_count: badges.length,
    duration_sec: duration,
    completed,
  };
  if (input.details) {
    Object.assign(student, buildStudentDetails({
      answers: answers || [], attempts: input.details.attempts || [], keys,
      achievements: input.details.achievements || [], catalog: input.details.catalog,
    }));
  }
  return {
    event_id: eventId,
    payload: {
      event_id: eventId,
      lesson_id: lessonId,
      lesson_title: String(lessonTitle || lessonId).slice(0, 255),
      mode: 'solo',
      started_at: isoUtc(startedAt),
      finished_at: isoUtc(finishedAt < startedAt ? startedAt : finishedAt),
      total_questions: clamp(total, 1, 1000),
      students: [student],
    },
  };
}

/**
 * Payload'ni LMS §7.3 qoidalariga qarshi tekshiradi (yuborishdan oldin — noto'g'ri narsa navbatga tushmasin).
 * @returns {string[]} muammolar (bo'sh = to'g'ri)
 */
export function validatePayload(p) {
  const errs = [];
  const idRe = /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/;
  if (!idRe.test(p.event_id || '') || p.event_id.length > 128) errs.push('event_id');
  if (!idRe.test(p.lesson_id || '') || p.lesson_id.length > 128) errs.push('lesson_id');
  if (!p.lesson_title || p.lesson_title.length > 255) errs.push('lesson_title');
  if (!['live', 'solo'].includes(p.mode)) errs.push('mode');
  if (p.mode === 'live' && !(Number.isInteger(p.group_id) && p.group_id > 0 && Number.isInteger(p.teacher_id) && p.teacher_id > 0)) errs.push('group/teacher');
  if (p.mode === 'solo' && ('group_id' in p || 'teacher_id' in p)) errs.push('solo group/teacher');
  if (!(Number.isInteger(p.total_questions) && p.total_questions >= 1 && p.total_questions <= 1000)) errs.push('total_questions');
  if (!Array.isArray(p.students) || p.students.length < 1 || p.students.length > 100) errs.push('students');
  if (p.mode === 'solo' && p.students?.length !== 1) errs.push('solo students');
  if (new Date(p.finished_at) < new Date(p.started_at)) errs.push('finished<started');
  const seen = new Set(); const ranks = new Set();
  for (const s of p.students || []) {
    const k = `${s.id_type}:${s.student_id}`;
    if (seen.has(k)) errs.push(`dup ${k}`); seen.add(k);
    if (!(s.correct_answers <= s.answered && s.answered <= p.total_questions)) errs.push(`counts ${k}`);
    if (s.rank !== null && ![1, 2, 3].includes(s.rank)) errs.push(`rank ${k}`);
    if (s.rank !== null) { if (ranks.has(s.rank)) errs.push(`dup rank ${s.rank}`); ranks.add(s.rank); }
    if (p.mode === 'solo' && s.rank !== null) errs.push('solo rank');
    if (!Array.isArray(s.badges) || s.badges_count !== s.badges.length || new Set(s.badges).size !== s.badges.length) errs.push(`badges ${k}`);
    if (s.badges.some((b) => !/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(b) || b.length > 64)) errs.push(`badge key ${k}`);
    if (Array.isArray(s.badges) && !s.badges.length) errs.push(`badges bo'sh ${k}`); // F-0917-02: School API bo'sh massivni 422 bilan rad etadi
    if (!(s.duration_sec >= 0 && s.duration_sec <= 86400)) errs.push(`duration ${k}`);
    errs.push(...validateStudentDetails(s));
  }
  return errs;
}

// ---------------------------------------------------------------------------------------------------------------
// NATIJA-DETALLARI (TZ_LESSON_RESULT_DETAILS_RU §4, A-variant): StudentResult'ga ixtiyoriy `lang`, `questions[]`,
// `achievements[]`. Bayroq RESULT_DETAILS=a bilan yoqiladi (config). Manbalar: live_answers (ball, birinchi urinish),
// answer_attempts (har bosish, texts), achievement_events + lesson_catalog.achievements (nom/ta'rif).
// QOIDA: detallar hech qachon tanga-yetkazishni to'smaydi — noto'g'ri/katta bo'lsa tashlanadi, asosiy payload ketadi (finalizePayload).
// ---------------------------------------------------------------------------------------------------------------

export const DETAILS_LIMITS = Object.freeze({
  questions: 200, attempts: 10, options: 6, text: 300, questionId: 64,
  achievements: 20, name: 40, title: 200, elapsedMs: 3_600_000, payloadBytes: 1_000_000,
});
const ACH_ID_RE = /^[a-z0-9_-]{1,32}$/;

const qNum = (id) => { const m = /^(?:s|quiz-)(\d+)([a-z]*)$/i.exec(id); return m ? [Number(m[1]), m[2]] : null; };
const cutStr = (v, n) => (typeof v === 'string' ? v.slice(0, n) : undefined);
const dropUndefined = (o) => { for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o; };

/**
 * Savol tartibi darsda (1..N): dars-testlari ekran raqami bo'yicha (s4 < s5b < s9), keyin arena (quiz-0 < quiz-1);
 * qolipsiz id'lar o'z guruhida oxirida, alifbo bo'yicha. Kalitlar (quiz_keys) manba — darsning o'zi belgilagan.
 * @returns {Map<string, number>}
 */
export function questionOrder(keys) {
  // F-0916-03: ishtirok-kalitlar tartibga kirmaydi (aks holda arena `order` siljiydi: quiz-0 → 9, 5 emas)
  const ids = [...new Set((keys || []).filter((k) => k && typeof k.question_id === 'string' && k.question_id && !isParticipationKey(k)).map((k) => k.question_id))];
  const cmp = (a, b) => {
    const na = qNum(a), nb = qNum(b);
    if (na && nb) return (na[0] - nb[0]) || na[1].localeCompare(nb[1]);
    if (na) return -1;
    if (nb) return 1;
    return a.localeCompare(b);
  };
  const map = new Map();
  [...ids.filter((id) => !isArenaQ(id)).sort(cmp), ...ids.filter(isArenaQ).sort(cmp)].forEach((id, i) => map.set(id, i + 1));
  return map;
}

/**
 * Bitta o'quvchi detallari (SOF).
 * @param {{ answers: Array<any>, attempts: Array<{screen_idx:number, attempt_no:number, picked:number, correct:boolean, elapsed_ms:number, texts?:object|null, answered_at:any}>,
 *           keys: Array<{question_id:string, correct_idx?:number}>, achievements: Array<{achievement_id?:string, id?:string, earned_at:any}>,
 *           catalog?: Array<{id:string, name:string, title_uz?:string, title_ru?:string}>, lang?: 'uz'|'ru' }} input
 * @returns {{ lang: 'uz'|'ru', questions: Array<object>, achievements: Array<object> }}
 */
export function buildStudentDetails({ answers, attempts, keys, achievements, catalog, lang: langHint }) {
  const L = DETAILS_LIMITS;
  const order = questionOrder(keys);
  const correctIdx = new Map((keys || []).filter((k) => k && typeof k.question_id === 'string').map((k) => [k.question_id, Number.isInteger(k.correct_idx) ? k.correct_idx : null]));

  const byScreen = new Map();
  const langCount = { uz: 0, ru: 0 };
  for (const a of attempts || []) {
    const sc = Number(a.screen_idx);
    if (!byScreen.has(sc)) byScreen.set(sc, []);
    byScreen.get(sc).push(a);
    const l = a.texts && a.texts.lang;
    if (l === 'ru' || l === 'uz') langCount[l]++;
  }
  for (const list of byScreen.values()) list.sort((x, y) => x.attempt_no - y.attempt_no);
  const lang = langCount.ru > langCount.uz ? 'ru' : (langCount.uz > 0 || langHint !== 'ru' ? 'uz' : 'ru');

  // studentStats bilan bir xil tanlov: har savolning BIRINCHI qatori (ball), faqat kalitdagi savollar
  const seen = new Map();
  for (const a of answers || []) { if (!order.has(a.question_id) || seen.has(a.question_id)) continue; seen.set(a.question_id, a); }
  const questions = [...seen.values()]
    .sort((x, y) => order.get(x.question_id) - order.get(y.question_id))
    .slice(0, L.questions)
    .map((a) => {
      const hist = (byScreen.get(Number(a.screen_idx)) || []).slice(0, L.attempts);
      const texts = (hist.find((h) => h.texts && typeof h.texts === 'object') || {}).texts;
      const mk = (h, i) => dropUndefined({
        n: i + 1, option: Number.isInteger(Number(h.picked)) ? Number(h.picked) : -1, answer: cutStr(h.texts && h.texts.picked, L.text), correct: h.correct === true,
        elapsed_ms: clamp(Number(h.elapsed_ms) || 0, 0, L.elapsedMs), at: isoUtc(h.answered_at || a.answered_at || 0),
      });
      // tarix yo'q (eski dars / arena / tarmoq) → ball-qatorining o'zi bitta urinish
      const atts = hist.length ? hist.map(mk) : [mk({ picked: a.picked, correct: a.correct, elapsed_ms: a.elapsed_ms, answered_at: a.answered_at }, 0)];
      const ci = correctIdx.get(a.question_id);
      return dropUndefined({
        question_id: a.question_id,
        kind: isArenaQ(a.question_id) ? 'arena' : 'test',
        order: order.get(a.question_id),
        question: cutStr(texts && texts.question, L.text),
        options: texts && Array.isArray(texts.options) ? texts.options.slice(0, L.options).map((o) => String(o ?? '').slice(0, L.text)) : undefined,
        correct_option: Number.isInteger(ci) && ci >= 0 && ci <= 5 ? ci : undefined,
        correct_answer: cutStr(texts && texts.correct, L.text),
        correct: a.correct === true,
        solved: a.correct === true || atts.some((x) => x.correct),
        attempts: atts,
      });
    });

  const cat = new Map((catalog || []).filter((c) => c && c.id).map((c) => [String(c.id).toLowerCase(), c]));
  const seenAch = new Set();
  const achs = (achievements || [])
    .map((e) => ({ id: String(e.achievement_id ?? e.id ?? '').toLowerCase(), at: new Date(e.earned_at || 0) }))
    .filter((e) => ACH_ID_RE.test(e.id) && e.at.getTime() > 0 && !seenAch.has(e.id) && seenAch.add(e.id))
    .sort((x, y) => x.at - y.at)
    .slice(0, L.achievements)
    .map((e) => {
      const c = cat.get(e.id);
      const title = c ? (lang === 'ru' ? (c.title_ru || c.title_uz) : c.title_uz) : null;
      return { id: e.id, name: String((c && c.name) || e.id).slice(0, L.name), title: String(title || (c && c.name) || e.id).slice(0, L.title), earned_at: isoUtc(e.at) };
    });

  return { lang, questions, achievements: achs };
}

/** StudentResult'dagi detallar (bo'lsa) TZ §4 qoidalari va invariantlariga mosmi. @returns {string[]} */
export function validateStudentDetails(s) {
  const L = DETAILS_LIMITS;
  const errs = [];
  const k = `${s.id_type}:${s.student_id}`;
  const isStr = (v, n) => typeof v === 'string' && v.length <= n;
  if (s.lang !== undefined && !['uz', 'ru'].includes(s.lang)) errs.push(`lang ${k}`);
  if (s.questions !== undefined) {
    if (!Array.isArray(s.questions) || s.questions.length > L.questions) errs.push(`questions ${k}`);
    else {
      let testN = 0, testCorrect = 0;
      const ids = new Set();
      for (const q of s.questions) {
        const qid = String(q.question_id);
        if (!isStr(q.question_id, L.questionId) || !q.question_id || ids.has(qid)) errs.push(`q id ${qid}`);
        ids.add(qid);
        if (!['test', 'arena'].includes(q.kind)) errs.push(`q kind ${qid}`);
        if (!(Number.isInteger(q.order) && q.order >= 1)) errs.push(`q order ${qid}`);
        if (q.question !== undefined && !isStr(q.question, L.text)) errs.push(`q question ${qid}`);
        if (q.correct_answer !== undefined && !isStr(q.correct_answer, L.text)) errs.push(`q correct_answer ${qid}`);
        if (q.options !== undefined && (!Array.isArray(q.options) || q.options.length > L.options || q.options.some((o) => !isStr(o, L.text)))) errs.push(`q options ${qid}`);
        if (q.correct_option !== undefined && !(Number.isInteger(q.correct_option) && q.correct_option >= 0 && q.correct_option <= 5)) errs.push(`q correct_option ${qid}`);
        if (typeof q.correct !== 'boolean' || typeof q.solved !== 'boolean') errs.push(`q flags ${qid}`);
        if (!Array.isArray(q.attempts) || q.attempts.length < 1 || q.attempts.length > L.attempts) errs.push(`q attempts ${qid}`);
        else {
          let prev = 0;
          q.attempts.forEach((a, i) => {
            if (a.n !== i + 1 || !Number.isInteger(a.option) || typeof a.correct !== 'boolean' || !(a.elapsed_ms >= 0 && a.elapsed_ms <= L.elapsedMs)) errs.push(`q attempt ${qid}#${i + 1}`);
            if (a.answer !== undefined && !isStr(a.answer, L.text)) errs.push(`q answer ${qid}#${i + 1}`);
            const t = new Date(a.at).getTime();
            if (!(t > 0) || t < prev) errs.push(`q at ${qid}#${i + 1}`);
            prev = Math.max(prev, t || 0);
          });
          if (q.attempts[0].correct !== q.correct) errs.push(`q first ${qid}`);
          if (q.solved !== q.attempts.some((a) => a.correct === true)) errs.push(`q solved ${qid}`);
        }
        if (q.kind === 'test') { testN++; if (q.correct === true) testCorrect++; }
      }
      if (testN !== s.answered) errs.push(`answered≠questions ${k}`);
      if (testCorrect !== s.correct_answers) errs.push(`correct≠questions ${k}`);
    }
  }
  if (s.achievements !== undefined) {
    if (!Array.isArray(s.achievements) || s.achievements.length > L.achievements) errs.push(`achievements ${k}`);
    else {
      const ids = new Set();
      for (const a of s.achievements) {
        if (!ACH_ID_RE.test(String(a.id)) || ids.has(a.id)) errs.push(`ach id ${a.id}`);
        ids.add(a.id);
        if (!isStr(a.name, L.name) || !a.name) errs.push(`ach name ${a.id}`);
        if (!isStr(a.title, L.title) || !a.title) errs.push(`ach title ${a.id}`);
        if (!(new Date(a.earned_at).getTime() > 0)) errs.push(`ach earned_at ${a.id}`);
      }
    }
  }
  return errs;
}

export function hasDetails(p) {
  return (p.students || []).some((s) => 'questions' in s || 'achievements' in s || 'lang' in s);
}
export function stripDetails(p) {
  return { ...p, students: (p.students || []).map(({ lang: _l, questions: _q, achievements: _a, ...rest }) => rest) };
}
export function payloadBytes(p) { return Buffer.byteLength(JSON.stringify(p), 'utf8'); }

/**
 * Yuborishdan oldingi yakuniy tekshiruv. Detallar bo'lsa va ular (yoki hajm ≤1 MB) buzilsa — detallar TASHLANADI,
 * asosiy payload tekshiruvdan o'tsa ketadi. Asosiy payload buzuq bo'lsa — problems qaytadi (manual_review).
 * @returns {{ payload: object, problems: string[], detailsDropped: string|null }}
 */
export function finalizePayload(p) {
  if (!hasDetails(p)) return { payload: p, problems: validatePayload(p), detailsDropped: null };
  const problems = validatePayload(p);
  if (!problems.length) {
    const bytes = payloadBytes(p);
    if (bytes <= DETAILS_LIMITS.payloadBytes) return { payload: p, problems: [], detailsDropped: null };
    const base = stripDetails(p);
    return { payload: base, problems: validatePayload(base), detailsDropped: `size:${bytes}` };
  }
  const base = stripDetails(p);
  const baseProblems = validatePayload(base);
  if (baseProblems.length) return { payload: p, problems, detailsDropped: null };
  return { payload: base, problems: [], detailsDropped: problems.join(', ') };
}
