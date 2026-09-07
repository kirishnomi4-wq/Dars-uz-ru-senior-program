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

/** Dars-testlari to'plami (arena tashqari) — tanga-hisob shu bo'yicha */
export function lessonQuestions(keys) {
  const ids = new Set();
  for (const k of keys || []) if (k && typeof k.question_id === 'string' && !isArenaQ(k.question_id)) ids.add(k.question_id);
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
 * Podium — ekran (ScreenPodium) bilan bir xil: to'g'ri ↓, vaqt ↑, tenglikda avval qo'shilgan. HAMMA o'yinchi.
 * 0 to'g'ri ham ro'yxatda (ekranda ham shunday: 3 tadan kam bo'lsa 🥉 0/N chiqadi).
 * @param {Array<{ id: string, joinedAt: number, stats: {correct:number, elapsedTotal:number, answered:number} }>} rows
 * @param {{ requireAnswered?: boolean }} [opts]  arena uchun: javob bermaganlar podiumga kirmaydi
 * @returns {Map<string, number>} player id → 1..3
 */
export function assignRanks(rows, opts = {}) {
  const list = rows
    .filter((r) => !opts.requireAnswered || r.stats.answered > 0)
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
  const ranks = assignRanks(allRows);
  const arenaRanks = arenaQ.size ? assignRanks(allRows.map((r) => ({ id: r.id, joinedAt: r.joinedAt, stats: r.arena })), { requireAnswered: true }) : new Map();
  const byPlayer = new Map(allRows.map((r) => [r.id, r]));

  const rows = participants
    .map((p) => ({ subjectId: Number(p.subject_id), p, row: byPlayer.get(p.player_id) || { stats: studentStats([], lessonQ), arena: studentStats([], arenaQ) } }))
    .sort((a, b) => a.subjectId - b.subjectId);
  if (!rows.length) return [];
  const total = Math.max(1, lessonQ.size, ...rows.map((r) => r.row.stats.answered));
  const groupMedianAvg = median(allRows.map((r) => r.stats.avgElapsed));

  const students = rows.map(({ subjectId, p, row }) => {
    const { stats } = row;
    const rank = ranks.get(p.player_id) ?? null;
    const completed = !!p.reached_end || (stats.answered >= total && total > 0);
    const badges = badgesFor({ stats, total, rank, completed, groupMedianAvg, arenaRank: arenaRanks.get(p.player_id) ?? null });
    const end = Math.max(stats.lastAnsweredAt, row.arena.lastAnsweredAt, 0) || finishedAt.getTime();
    const duration = clamp(Math.round((Math.min(end, finishedAt.getTime()) - new Date(p.joined_at).getTime()) / 1000), 0, 86400);
    return {
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
      students: [{
        student_id: Number(subjectId),
        id_type: 'lms',
        correct_answers: clamp(stats.correct, 0, total),
        answered: clamp(stats.answered, stats.correct, total),
        rank: null,
        badges,
        badges_count: badges.length,
        duration_sec: duration,
        completed,
      }],
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
    if (!(s.duration_sec >= 0 && s.duration_sec <= 86400)) errs.push(`duration ${k}`);
  }
  return errs;
}
