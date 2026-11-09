// v2 hodisa quruvchi — SOF funksiyalar (baza yo'q), unit-test bilan qoplanadi.
// Kontrakt: feedback/F-1105-03-analitika/25-YAKUNIY-JSX-DARS-LMS-KONTRAKT-UZ.md (Abdulloh, 09.11.2026) — zid joyda 25 ustun;
// JSON namunalari: 16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md v1.3.
//
// Uch hodisa, har biri BITTA o'quvchi va BITTA urinish uchun, event_id = prefiks + attempt_id (deterministik):
//   lesson_result       lr_<attempt_id>   — birinchi reached_end yoki urinish yopilishi
//   arena_participation ap_<attempt_id>   — birinchi arena savoli ko'rsatildi (yoki buni tasdiqlagan javob)
//   arena_result        ar_<attempt_id>   — arena yakuni; boshlanmagan bo'lsa sessiya yopilishi (not_started)
// v1 (guruh-xabar) bu faylga tegmaydi — u result-builder.js da avvalgidek.
import {
  lessonQuestions, arenaQuestions, studentStats, assignRanks, rescoreAnswers, buildStudentDetails, validateStudentDetails,
  isoUtc, clamp, liveEventId, payloadBytes, DETAILS_LIMITS,
} from './result-builder.js';

export const SCHEMA_VERSION = 2;
export const LIMITS = Object.freeze({
  liveSec: 7200,          // 25 §6: live sessiya boshlanish + 2 soat
  soloSec: 604800,        // solo ochilish + 7 kun
  arenaSec: 45 * 60,      // arena boshlanish + 45 daqiqa
  lastQuestionGraceSec: 60,
  payloadBytes: 1_048_576, // 1 MiB (25 §5)
  idLen: 128, titleLen: 255,
});
export const TRIGGERS = Object.freeze(['reached_end', 'session_closed', 'solo_expired', 'version_changed']);
export const ARENA_END_REASONS = Object.freeze(['mentor', 'last_question_timeout', 'arena_limit', 'session_limit', 'session_closed', 'not_started']);
/** O'quv qismida guruhga bog'liq nishonlar (rank, tezlik) yuborilmaydi — 25 §5 */
const LESSON_BADGES = new Set(['all_correct', 'first_try', 'graduate', 'comeback']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ms = (d) => (d == null ? null : new Date(d).getTime());
const maxDate = (...ds) => { const t = ds.map(ms).filter((x) => Number.isFinite(x) && x > 0); return t.length ? new Date(Math.max(...t)) : null; };
const minDate = (...ds) => { const t = ds.map(ms).filter((x) => Number.isFinite(x) && x > 0); return t.length ? new Date(Math.min(...t)) : null; };
const iso = (d) => (d == null ? null : isoUtc(d));

export const lessonResultId = (attemptId) => `lr_${attemptId}`;
export const arenaParticipationId = (attemptId) => `ap_${attemptId}`;
export const arenaResultId = (attemptId) => `ar_${attemptId}`;

/** Umumiy qism (25 §5 «Umumiy maydonlar») */
function commonFields({ eventType, eventId, occurredAt, attempt, lesson, session, student }) {
  const live = attempt.kind === 'live';
  const base = {
    schema_version: SCHEMA_VERSION,
    event_type: eventType,
    event_id: eventId,
    occurred_at: isoUtc(occurredAt),
    lesson_id: lesson.lesson_id,
    lesson_version: attempt.lesson_version ?? null,
    version_source: attempt.version_source || (attempt.lesson_version ? 'attempt' : 'unknown'),
    lesson_title: String(lesson.title || lesson.lesson_id).slice(0, LIMITS.titleLen),
    mode: live ? 'live' : 'solo',
    attempt_id: attempt.id,
    student: { student_id: Number(student.subject_id), id_type: 'lms' },
  };
  if (live) {
    base.session_key = session.session_key || liveEventId(session.pin, session.started_at);
    base.group_id = Number(session.gid);
    base.teacher_id = Number(session.teacher_id);
  }
  return base;
}

/**
 * Mantiqiy yakun vaqti (25 §6): deadline'dan keyingi harakat urinishni davom ettirmaydi.
 * @returns {{ occurredAt: Date, deadline: Date }}
 */
export function logicalEnd({ attempt, session, trigger, now = new Date() }) {
  const started = new Date(attempt.started_at);
  const live = attempt.kind === 'live';
  const deadline = new Date(started.getTime() + (live ? LIMITS.liveSec : LIMITS.soloSec) * 1000);
  let end;
  if (trigger === 'reached_end') end = attempt.reached_end_at ? new Date(attempt.reached_end_at) : null;
  else if (trigger === 'solo_expired') end = deadline;
  else end = attempt.finished_at ? new Date(attempt.finished_at) : (live && session?.finished_at ? new Date(session.finished_at) : now);
  if (!end || end < started) end = started;
  const occurredAt = minDate(end, deadline, live && session?.started_at ? new Date(new Date(session.started_at).getTime() + LIMITS.liveSec * 1000) : null) || end;
  return { occurredAt, deadline };
}

/** Deadline'dan keyingi javoblar/harakatlar hisobga kirmaydi */
const upTo = (rows, key, limit) => (rows || []).filter((r) => { const t = ms(r[key]); return !Number.isFinite(t) || t <= limit.getTime(); });

/** practice[] — amaliyot ekranlari (25 §5): har ekran bitta yozuv */
export function buildPractice(practiceRows, limit) {
  const byScreen = new Map();
  for (const r of upTo(practiceRows, 'at', limit)) {
    const k = r.screen_id || `s${r.screen_idx}`;
    if (!byScreen.has(k)) byScreen.set(k, { screen_id: k, done: true, checked: false, correct: null, _idx: Number(r.screen_idx) });
    const p = byScreen.get(k);
    if (r.checked) { p.checked = true; p.correct = p.correct === true || r.correct === true; }
  }
  return [...byScreen.values()].sort((a, b) => a._idx - b._idx).map(({ _idx, ...p }) => p);
}

/** details holati: full (available = questions.length = answered) yoki omitted (size | invalid_text | version_mismatch) */
function detailsBlock({ student, mode, kindFilter }) {
  const qs = (student.questions || []).filter((q) => q.kind === kindFilter);
  const answered = Number(student.answered || 0), correct = Number(student.correct_answers || 0);
  // Tuzilma tekshiruvi (matn, variant, kalit, urinish) — v1 validatori; test-tengligini u faqat kind:test uchun biladi,
  // arenada tenglik shu yerda alohida tekshiriladi (25 §5: savollar soni = answered, to'g'ri birinchi javoblar = correct_answers)
  const probe = kindFilter === 'arena' ? { ...student, questions: qs, answered: 0, correct_answers: 0 } : { ...student, questions: qs };
  const errs = validateStudentDetails(probe, mode);
  if (kindFilter === 'arena') {
    if (qs.length !== answered) errs.push(`arena answered≠questions`);
    if (qs.filter((q) => q.correct === true).length !== correct) errs.push(`arena correct≠questions`);
  }
  if (!errs.length && qs.length === answered) return { details: { status: 'full', reason: null, available: qs.length }, questions: qs, dropped: null };
  const txt = errs.join(', ');
  const reason = /text obyekt|q question|q options|q answer|q correct_answer/.test(txt) ? 'invalid_text'
    : /key≠text|answer≠option|correct≠key|q correct≠key/.test(txt) ? 'version_mismatch' : 'invalid_text';
  return { details: { status: 'omitted', reason, available: qs.length }, questions: undefined, dropped: txt || `questions ${qs.length} ≠ answered ${answered}` };
}

/**
 * lesson_result (25 §5 «lesson_result»).
 * @param {{ attempt: object, student: { subject_id: number|string }, session: object|null, lesson: { lesson_id: string, title?: string },
 *           keys: Array<{question_id: string, correct_idx?: number}>, answers: Array<any>, attemptsHist: Array<any>, practice: Array<any>,
 *           screenViews: Array<{screen_idx:number, opened_at:any, by_student:boolean}>, progress: { screen?: number, total?: number, updated_at?: any }|null,
 *           achievements: Array<any>, catalog: Array<any>, trigger: string, attemptNo: number, processedAt?: Date, now?: Date }} input
 */
export function buildLessonResult(input) {
  const { attempt, student, session, lesson, keys, trigger, attemptNo } = input;
  if (!TRIGGERS.includes(trigger)) throw new Error(`v2: noma'lum trigger ${trigger}`);
  const live = attempt.kind === 'live';
  const mode = live ? 'live' : 'solo';
  const { occurredAt } = logicalEnd({ attempt, session, trigger, now: input.now });
  const answers = rescoreAnswers(upTo(input.answers, 'answered_at', occurredAt).filter((a) => Number(a.screen_idx) < 100), keys);
  const lessonQ = lessonQuestions(keys);
  const stats = studentStats(answers, lessonQ);
  const total = lessonQ.size; // v2: testsiz darsda 0 bo'lishi mumkin
  const views = upTo(input.screenViews, 'opened_at', occurredAt);
  const practiceRows = upTo(input.practice, 'at', occurredAt);
  const completed = !!attempt.reached_end && trigger !== 'version_changed' ? true : !!attempt.reached_end;
  const participated = completed || views.some((v) => v.by_student) || answers.length > 0 || practiceRows.length > 0;
  const openedAt = new Date(attempt.started_at);
  const completedAt = completed && attempt.reached_end_at ? new Date(attempt.reached_end_at) : null;
  const lastActivity = maxDate(
    ...answers.map((a) => a.answered_at), ...practiceRows.map((p) => p.at), ...views.map((v) => v.opened_at),
    input.progress?.updated_at, completedAt,
  );
  const lastActivityAt = lastActivity ? minDate(lastActivity, occurredAt) : null;
  const elapsedSec = clamp(Math.round((occurredAt.getTime() - openedAt.getTime()) / 1000), 0, live ? LIMITS.liveSec : LIMITS.soloSec);
  const maxView = views.reduce((m, v) => Math.max(m, Number(v.screen_idx) + 1), 0);
  const reached = Math.max(maxView, Number.isInteger(input.progress?.screen) ? input.progress.screen + 1 : 0, completed && input.progress?.total ? input.progress.total : 0);
  const screens = { reached: reached || null, total: Number.isInteger(input.progress?.total) ? input.progress.total : null };

  const ratio = total > 0 ? stats.correct / total : 0;
  const badges = [];
  if (total > 0 && stats.correct === total) badges.push('all_correct');
  if (stats.answered > 0 && stats.answered === total && stats.correct === stats.answered) badges.push('first_try');
  if (completed) badges.push('graduate');
  if (stats.firstHalfCorrect !== null && stats.answered >= 4 && stats.firstHalfCorrect < 0.5 && ratio >= 0.7) badges.push('comeback');

  const det = buildStudentDetails({ answers, attempts: upTo(input.attemptsHist, 'answered_at', occurredAt), keys, achievements: input.achievements || [], catalog: input.catalog || [], mode });
  const studentRow = { id_type: 'lms', student_id: Number(student.subject_id), answered: stats.answered, correct_answers: stats.correct, lang: det.lang, questions: det.questions, achievements: det.achievements };
  const d = detailsBlock({ student: studentRow, mode, kindFilter: 'test' });

  const payload = {
    ...commonFields({ eventType: 'lesson_result', eventId: lessonResultId(attempt.id), occurredAt, attempt, lesson, session, student }),
    result: {
      attempt_no: Number(attemptNo) || 1,
      trigger,
      participated,
      completed,
      opened_at: iso(openedAt),
      completed_at: iso(completedAt),
      last_activity_at: iso(lastActivityAt),
      elapsed_sec: elapsedSec,
      processed_at: iso(input.processedAt || input.now || new Date()),
      screens,
      tests: { total_questions: total, answered: clamp(stats.answered, 0, total || stats.answered), correct_answers: clamp(stats.correct, 0, total || stats.correct) },
      badges: badges.filter((b) => LESSON_BADGES.has(b)),
    },
    practice: buildPractice(practiceRows, occurredAt),
    lang: det.lang,
    details: d.details,
    ...(d.questions ? { questions: d.questions } : {}),
    achievements: det.achievements,
  };
  return fitSize({ event_id: payload.event_id, payload, detailsDropped: d.dropped });
}

/** Hajm (1 MiB): sig'masa tafsilot tashlanadi va belgi qo'yiladi; asosiy qism ham sig'masa — xato (jim qisqartirish yo'q) */
function fitSize(ev) {
  const bytes = payloadBytes(ev.payload);
  if (bytes <= LIMITS.payloadBytes) return { ...ev, bytes };
  const { questions, ...rest } = ev.payload;
  const base = { ...rest, details: { status: 'omitted', reason: 'size', available: Array.isArray(questions) ? questions.length : ev.payload.details?.available ?? 0 } };
  const baseBytes = payloadBytes(base);
  if (baseBytes > LIMITS.payloadBytes) return { ...ev, payload: base, bytes: baseBytes, error: `payload ${baseBytes} bayt > 1 MiB` };
  return { ...ev, payload: base, bytes: baseBytes, detailsDropped: [ev.detailsDropped, `size:${bytes}`].filter(Boolean).join('; ') };
}

/** Arena bali: to'g'ri × 1 000 000 + (999 999 − umumiy javob vaqti/10 ms) — ekran podiumi tartibi (to'g'ri ↓, vaqt ↑) bilan bir xil. */
export function arenaPoints(stats) {
  if (!stats || !stats.answered || !stats.correct) return 0; // to'g'ri javobsiz — ball yo'q (25 §3: podium kamida bitta to'g'ri)
  return stats.correct * 1_000_000 + Math.max(0, 999_999 - Math.floor((Number(stats.elapsedTotal) || 0) / 10));
}

/**
 * arena_participation (25 §5): birinchi arena savoli ko'rsatildi.
 * @param {{ attempt, student, session, lesson, arena: { started_at, questions_total }, participation: { student_arena_no, first_question_id, first_question_order, first_shown_at, source } }} input
 */
export function buildArenaParticipation(input) {
  const { attempt, student, session, lesson, arena, participation } = input;
  if (attempt.kind !== 'live') throw new Error('v2: arena hodisasi faqat live');
  const occurredAt = new Date(participation.first_shown_at);
  const payload = {
    ...commonFields({ eventType: 'arena_participation', eventId: arenaParticipationId(attempt.id), occurredAt, attempt, lesson, session, student }),
    arena: { started_at: iso(arena.started_at), questions_total: Number(arena.questions_total) || 0 },
    participation: {
      student_arena_no: participation.student_arena_no ?? null,
      first_question_id: String(participation.first_question_id),
      first_question_order: Number(participation.first_question_order) || 1,
      first_shown_at: isoUtc(participation.first_shown_at),
      source: participation.source === 'answer' ? 'answer' : 'shown',
    },
  };
  return { event_id: payload.event_id, payload, bytes: payloadBytes(payload) };
}

/**
 * arena_result (25 §5). players — HAMMA o'yinchi (PIN bilan kirganlar ham) arena javoblari bilan: o'rin ular orasida.
 * @param {{ attempt, student, session, lesson, keys, arena: { started_at, finished_at, end_reason, questions_total, questions_shown, players_total },
 *           participation: { student_arena_no, first_shown_at, source }|null, playerId: string,
 *           players: Array<{ id: string, joined_at: any, answers: Array<any> }>, attemptsHist: Array<any>, now?: Date }} input
 */
export function buildArenaResult(input) {
  const { attempt, student, session, lesson, keys, arena, participation } = input;
  if (attempt.kind !== 'live') throw new Error('v2: arena hodisasi faqat live');
  const notStarted = !arena.started_at || arena.end_reason === 'not_started';
  const endReason = notStarted ? 'not_started' : (ARENA_END_REASONS.includes(arena.end_reason) ? arena.end_reason : 'session_closed');
  const finishedAt = new Date(arena.finished_at || input.now || Date.now());
  const occurredAt = finishedAt;
  const arenaQ = arenaQuestions(keys);
  const limit = finishedAt;
  const rows = (input.players || []).map((p) => ({
    id: p.id, joinedAt: ms(p.joined_at) || 0,
    stats: studentStats(rescoreAnswers(upTo(p.answers, 'answered_at', limit).filter((a) => Number(a.screen_idx) >= 100), keys), arenaQ),
  }));
  const ranks = notStarted ? new Map() : assignRanks(rows, { requireCorrect: true }); // o'rin faqat kamida bitta to'g'ri javob bilan (25 §3, F-0911-02)
  const me = rows.find((r) => r.id === input.playerId) || { stats: studentStats([], arenaQ) };
  const myAnswers = upTo((input.players || []).find((p) => p.id === input.playerId)?.answers, 'answered_at', limit).filter((a) => Number(a.screen_idx) >= 100);
  const participated = !notStarted && !!(participation || myAnswers.length);
  const participatedAt = participated ? iso(participation?.first_shown_at || myAnswers.reduce((m, a) => (!m || new Date(a.answered_at) < m ? new Date(a.answered_at) : m), null)) : null;
  const place = participated ? (ranks.get(input.playerId) ?? null) : null;
  const badges = place ? [`arena_top_${place}`] : [];
  const shown = notStarted ? 0 : Math.max(0, Number(arena.questions_shown) || 0);
  const answered = Math.min(me.stats.answered, shown || me.stats.answered);
  const correct = Math.min(me.stats.correct, answered);

  const det = buildStudentDetails({ answers: rescoreAnswers(myAnswers, keys), attempts: upTo(input.attemptsHist, 'answered_at', limit), keys, achievements: [], catalog: [], mode: 'live' });
  const studentRow = { id_type: 'lms', student_id: Number(student.subject_id), answered, correct_answers: correct, lang: det.lang, questions: det.questions };
  const d = answered ? detailsBlock({ student: studentRow, mode: 'live', kindFilter: 'arena' }) : { details: { status: 'full', reason: null, available: 0 }, questions: [], dropped: null };

  const payload = {
    ...commonFields({ eventType: 'arena_result', eventId: arenaResultId(attempt.id), occurredAt, attempt, lesson, session, student }),
    arena: {
      started_at: notStarted ? null : iso(arena.started_at),
      finished_at: isoUtc(finishedAt),
      end_reason: endReason,
      questions_total: Number(arena.questions_total) || arenaQ.size,
      questions_shown: shown,
      players_total: notStarted ? 0 : (Number(arena.players_total) || rows.length),
    },
    result: {
      student_arena_no: participated ? (participation?.student_arena_no ?? null) : null,
      participated,
      participated_at: participatedAt,
      answered,
      correct_answers: correct,
      points: participated ? arenaPoints({ ...me.stats, answered, correct }) : 0,
      place,
      badges,
    },
    lang: det.lang,
    details: d.details,
    ...(d.questions ? { questions: d.questions } : {}),
  };
  return fitSize({ event_id: payload.event_id, payload, detailsDropped: d.dropped });
}

/** v2 payload tekshiruvi (25 §5) — yuborishdan oldin. @returns {string[]} */
export function validateV2(p) {
  const errs = [];
  const idRe = /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/;
  if (p.schema_version !== 2) errs.push('schema_version');
  if (!['lesson_result', 'arena_participation', 'arena_result'].includes(p.event_type)) errs.push('event_type');
  if (!UUID_RE.test(String(p.attempt_id || ''))) errs.push('attempt_id');
  const prefix = { lesson_result: 'lr_', arena_participation: 'ap_', arena_result: 'ar_' }[p.event_type];
  if (!idRe.test(p.event_id || '') || p.event_id.length > LIMITS.idLen || (prefix && p.event_id !== `${prefix}${p.attempt_id}`)) errs.push('event_id');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(p.occurred_at || '')) errs.push('occurred_at');
  if (!idRe.test(p.lesson_id || '') || p.lesson_id.length > LIMITS.idLen) errs.push('lesson_id');
  if (!p.lesson_title || p.lesson_title.length > LIMITS.titleLen) errs.push('lesson_title');
  if (!['attempt', 'backfill', 'unknown'].includes(p.version_source)) errs.push('version_source');
  if (p.version_source === 'unknown' && p.lesson_version !== null) errs.push('lesson_version unknown≠null');
  if (p.lesson_version !== null && (typeof p.lesson_version !== 'string' || !p.lesson_version || p.lesson_version.length > 32)) errs.push('lesson_version');
  if (!['live', 'solo'].includes(p.mode)) errs.push('mode');
  if (p.event_type !== 'lesson_result' && p.mode !== 'live') errs.push('arena mode');
  if (!(p.student && Number.isInteger(p.student.student_id) && p.student.student_id > 0 && p.student.id_type === 'lms')) errs.push('student');
  if (p.mode === 'live') {
    if (typeof p.session_key !== 'string' || !p.session_key) errs.push('session_key');
    if (!(Number.isInteger(p.group_id) && p.group_id > 0 && Number.isInteger(p.teacher_id) && p.teacher_id > 0)) errs.push('group/teacher');
  } else if ('session_key' in p || 'group_id' in p || 'teacher_id' in p) errs.push('solo session fields');
  if (p.event_type !== 'arena_participation' && !['uz', 'ru'].includes(p.lang)) errs.push('lang');

  if (p.event_type === 'lesson_result') {
    const r = p.result || {};
    if (!TRIGGERS.includes(r.trigger)) errs.push('trigger');
    if (typeof r.participated !== 'boolean' || typeof r.completed !== 'boolean') errs.push('participated/completed');
    if (r.completed && !r.participated) errs.push('completed⇒participated');
    if (r.completed ? !r.completed_at : r.completed_at !== null) errs.push('completed_at');
    if (!(Number.isInteger(r.attempt_no) && r.attempt_no >= 1)) errs.push('attempt_no');
    if (!(r.elapsed_sec === null || (Number.isInteger(r.elapsed_sec) && r.elapsed_sec >= 0 && r.elapsed_sec <= (p.mode === 'live' ? LIMITS.liveSec : LIMITS.soloSec)))) errs.push('elapsed_sec');
    if (!r.processed_at) errs.push('processed_at');
    const t = r.tests || {};
    if (!(Number.isInteger(t.total_questions) && Number.isInteger(t.answered) && Number.isInteger(t.correct_answers) && t.correct_answers >= 0 && t.correct_answers <= t.answered && t.answered <= t.total_questions)) errs.push('tests');
    if (!Array.isArray(r.badges) || new Set(r.badges).size !== r.badges.length || r.badges.some((b) => !LESSON_BADGES.has(b))) errs.push('badges');
    if (!Array.isArray(p.practice) || p.practice.some((x) => typeof x.screen_id !== 'string' || typeof x.done !== 'boolean' || typeof x.checked !== 'boolean' || (x.checked ? typeof x.correct !== 'boolean' : x.correct !== null))) errs.push('practice');
    if (!Array.isArray(p.achievements)) errs.push('achievements');
    errs.push(...validateDetails(p, t.answered, t.correct_answers, 'test'));
  } else if (p.event_type === 'arena_participation') {
    const a = p.arena || {}, q = p.participation || {};
    if (!a.started_at || !(Number.isInteger(a.questions_total) && a.questions_total >= 0)) errs.push('arena');
    if (!q.first_question_id || !(Number.isInteger(q.first_question_order) && q.first_question_order >= 1) || !q.first_shown_at || !['shown', 'answer'].includes(q.source)) errs.push('participation');
    if (!(q.student_arena_no === null || (Number.isInteger(q.student_arena_no) && q.student_arena_no >= 1))) errs.push('student_arena_no');
  } else if (p.event_type === 'arena_result') {
    const a = p.arena || {}, r = p.result || {};
    if (!ARENA_END_REASONS.includes(a.end_reason)) errs.push('end_reason');
    if (!a.finished_at || a.finished_at !== p.occurred_at) errs.push('finished_at');
    if (a.end_reason === 'not_started' ? (a.started_at !== null || a.questions_shown !== 0 || a.players_total !== 0) : !a.started_at) errs.push('not_started');
    if (!(Number.isInteger(a.questions_total) && Number.isInteger(a.questions_shown) && a.questions_shown >= 0 && a.questions_shown <= a.questions_total)) errs.push('questions_total/shown');
    if (!(Number.isInteger(r.answered) && Number.isInteger(r.correct_answers) && r.correct_answers >= 0 && r.correct_answers <= r.answered && r.answered <= a.questions_shown)) errs.push('arena counts');
    if (typeof r.participated !== 'boolean') errs.push('participated');
    if (r.participated ? !r.participated_at : (r.participated_at !== null || r.student_arena_no !== null || r.answered !== 0 || r.place !== null)) errs.push('participated fields');
    if (!(r.place === null || [1, 2, 3].includes(r.place))) errs.push('place');
    if (r.place !== null && r.answered === 0) errs.push('place javobsiz');
    if (!(Number.isInteger(r.points) && r.points >= 0)) errs.push('points');
    if (!Array.isArray(r.badges) || r.badges.some((b) => !/^arena_top_[123]$/.test(b))) errs.push('arena badges');
    errs.push(...validateDetails(p, r.answered, r.correct_answers, 'arena'));
  }
  return errs;
}

function validateDetails(p, answered, correct, kind) {
  const errs = [];
  const d = p.details || {};
  if (!['full', 'omitted'].includes(d.status)) errs.push('details.status');
  if (d.status === 'full') {
    if (d.reason !== null) errs.push('details.reason');
    if (!Array.isArray(p.questions) || p.questions.length !== answered || d.available !== answered) errs.push('details full≠answered');
    else {
      const qs = p.questions;
      if (qs.some((q) => q.kind !== kind)) errs.push('details kind');
      if (qs.filter((q) => q.correct === true).length !== correct) errs.push('details correct');
      const probe = kind === 'arena' ? { answered: 0, correct_answers: 0 } : { answered, correct_answers: correct }; // v1 tengligi faqat kind:test
      const sErrs = validateStudentDetails({ id_type: 'lms', student_id: p.student?.student_id, ...probe, lang: p.lang, questions: qs }, p.mode);
      errs.push(...sErrs.map((e) => `details ${e}`));
    }
  } else {
    if (!['size', 'invalid_text', 'version_mismatch'].includes(d.reason)) errs.push('details.reason');
    if ('questions' in p) errs.push('omitted questions');
    if (!(Number.isInteger(d.available) && d.available >= 0)) errs.push('details.available');
  }
  return errs;
}

export { DETAILS_LIMITS };
