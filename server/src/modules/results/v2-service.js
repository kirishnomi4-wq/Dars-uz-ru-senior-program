// v2 hodisalar xizmati (F-1105-03, 25-kontrakt): manbadan yig'ish, navbatga qo'yish, server tomonidan arena/sessiya yopish.
// Kim chaqiradi: result-worker tick (sweepV2) — RESULT_SCHEMA_V2=on bo'lganda. v1 oqimiga tegmaydi.
//
// Hodisa lahzalari (25 §4): lesson_result — birinchi reached_end yoki urinish yopilishi (live_ended → session_closed,
// auto_7d → solo_expired, version_changed); arena_participation — arena_participants qatori; arena_result — jonli sessiya
// yopilgach har LMS o'quvchisiga (arena bo'lmasa not_started). Server yopadi (25 §6): sessiya 2 soat (session_limit),
// arena 45 daqiqa (arena_limit), oxirgi savol + 1 daqiqa (last_question_timeout), sessiya yopilsa (session_closed).
import { buildLessonResult, buildArenaParticipation, buildArenaResult, validateV2 } from './v2-builder.js';
import { arenaQuestions } from './result-builder.js';

export const ARENA_QUESTION_MS = 20_000; // darsdagi arena savol vaqti (QzFX) — serverga kelmaydi; oxirgi savol chegarasi uchun baho
const LIVE_LIMIT = "interval '2 hours'";
const ARENA_LIMIT = "interval '45 minutes'";

async function keysFor(pool, lessonId, lessonVersion) {
  if (lessonVersion) {
    const { rows } = await pool.query('select question_id, correct_idx from quiz_key_versions where lesson_id = $1 and lesson_version = $2', [lessonId, lessonVersion]);
    if (rows.length) return rows;
  }
  const { rows } = await pool.query('select question_id, correct_idx from quiz_keys where lesson_id = $1', [lessonId]);
  return rows;
}

/** Urinishning to'liq manbasi (bitta o'quvchi). PIN bilan kirgan (urinishsiz) o'yinchi bu yerga tushmaydi. */
export async function loadAttemptSource(pool, attemptId) {
  const { rows: [a] } = await pool.query(
    `select a.*, p.player_id, p.crm_id, s.id as lms_session_id, s.pin, s.mode as session_mode, s.gid, s.teacher_id,
            s.started_at as session_started_at, s.finished_at as session_finished_at, s.end_reason as session_end_reason, s.status as session_status,
            ls.quiz_state, ls.quiz_first_q_at, ls.quiz_started_at, ls.quiz_done_at, ls.quiz_end_reason, ls.quiz_max_q, ls.quiz_q,
            lc.title_uz, lc.achievements as catalog
       from attempts a
       join lms_participants p on p.attempt_id = a.id and p.role = 'student'
       join lms_sessions s on s.id = p.session_id
       join live_sessions ls on ls.pin = s.pin
       left join lesson_catalog lc on lc.lesson_id = a.lesson_id
      where a.id = $1`,
    [attemptId],
  );
  if (!a) return null;
  const keys = await keysFor(pool, a.lesson_id, a.lesson_version);
  const [answers, attemptsHist, practice, screenViews, progress, achievements, attemptNo, arenaPart, players] = await Promise.all([
    pool.query('select question_id, screen_idx, picked, correct, elapsed_ms, answered_at from live_answers where pin = $1 and player_id = $2 and screen_idx < 500 order by answered_at', [a.pin, a.player_id]).then((r) => r.rows),
    pool.query('select screen_idx, question_id, attempt_no, picked, correct, elapsed_ms, texts, answered_at from answer_attempts where pin = $1 and player_id = $2 and screen_idx < 500 order by screen_idx, attempt_no', [a.pin, a.player_id]).then((r) => r.rows),
    pool.query('select screen_idx, screen_id, attempt_no, checked, correct, at from practice_attempts where attempt_id = $1 order by screen_idx, attempt_no', [attemptId]).then((r) => r.rows),
    pool.query('select screen_idx, screen_id, opened_at, closed_at, by_student from screen_views where attempt_id = $1 order by opened_at', [attemptId]).then((r) => r.rows),
    pool.query('select screen, total, updated_at from student_progress where attempt_id = $1', [attemptId]).then((r) => r.rows[0] || null),
    pool.query('select achievement_id, earned_at from achievement_events where attempt_id = $1 order by earned_at', [attemptId]).then((r) => r.rows),
    pool.query('select count(*)::int as n from attempts where subject_id = $1 and lesson_id = $2 and started_at <= $3', [a.subject_id, a.lesson_id, a.started_at]).then((r) => r.rows[0].n),
    pool.query('select first_question_id, first_question_order, first_shown_at, source from arena_participants where pin = $1 and player_id = $2', [a.pin, a.player_id]).then((r) => r.rows[0] || null),
    a.session_mode === 'live'
      ? pool.query(
        `select lp.id, lp.joined_at,
                coalesce((select json_agg(json_build_object('question_id', x.question_id, 'screen_idx', x.screen_idx, 'picked', x.picked, 'correct', x.correct, 'elapsed_ms', x.elapsed_ms, 'answered_at', x.answered_at) order by x.answered_at)
                           from live_answers x where x.player_id = lp.id and x.screen_idx >= 100 and x.screen_idx < 500), '[]'::json) as answers
           from live_players lp where lp.pin = $1 order by lp.joined_at`,
        [a.pin],
      ).then((r) => r.rows)
      : Promise.resolve([]),
  ]);
  // student_arena_no (25 §4): shu o'quvchining shu darsda QATNASHGAN arenalari, vaqt tartibida — bu arena nechanchi
  let studentArenaNo = null;
  if (arenaPart) {
    const { rows: [{ n }] } = await pool.query(
      `select count(distinct ap.pin)::int as n
         from arena_participants ap
         join lms_participants p2 on p2.player_id = ap.player_id and p2.role = 'student'
         join lms_sessions s2 on s2.id = p2.session_id
        where p2.subject_id = $1 and s2.lesson_id = $2 and ap.first_shown_at <= $3`,
      [a.subject_id, a.lesson_id, arenaPart.first_shown_at],
    );
    studentArenaNo = Math.max(1, n);
  }
  const live = a.session_mode === 'live';
  const arenaStarted = a.quiz_first_q_at || null;
  const arenaQ = arenaQuestions(keys).size;
  return {
    attempt: { id: a.id, kind: a.kind, lesson_id: a.lesson_id, lesson_version: a.lesson_version, version_source: a.version_source, started_at: a.started_at, finished_at: a.finished_at, finish_reason: a.finish_reason, reached_end: a.reached_end, reached_end_at: a.reached_end_at, status: a.status },
    student: { subject_id: a.subject_id, crm_id: a.crm_id },
    session: live ? { id: a.lms_session_id, pin: a.pin, gid: a.gid, teacher_id: a.teacher_id, started_at: a.session_started_at, finished_at: a.session_finished_at, end_reason: a.session_end_reason, status: a.session_status } : null,
    lesson: { lesson_id: a.lesson_id, title: a.title_uz || a.lesson_id },
    keys, answers, attemptsHist, practice, screenViews, progress, achievements, catalog: Array.isArray(a.catalog) ? a.catalog : [],
    attemptNo, playerId: a.player_id, participation: arenaPart ? { ...arenaPart, student_arena_no: studentArenaNo } : null, players,
    arena: live ? {
      started_at: arenaStarted,
      finished_at: a.quiz_done_at || a.session_finished_at || null,
      end_reason: arenaStarted ? (a.quiz_end_reason || (a.session_status === 'ended' ? 'session_closed' : null)) : 'not_started',
      questions_total: arenaQ,
      questions_shown: Math.max(0, Number(a.quiz_max_q ?? -1) + 1),
      players_total: players.length,
      done: !!a.quiz_done_at,
    } : null,
  };
}

/** Hodisani result_events ga yozadi (v2). Takror — jim (noyob indeks). Validator xatosi — manual_review + sabab. */
async function insertV2(pool, log, { ev, src, eventType }) {
  const problems = validateV2(ev.payload);
  const status = ev.error ? 'manual_review' : problems.length ? 'manual_review' : 'pending';
  const lastError = ev.error ? ev.error : problems.length ? `validate_v2: ${problems.join(', ')}` : null;
  const r = await pool.query(
    `insert into result_events (event_id, mode, session_id, attempt_id, lesson_id, payload, students_count, schema_version, event_type, student_id, occurred_at, status, last_error)
     values ($1, $2, $3, $4, $5, $6::jsonb, 1, 2, $7, $8, $9, $10, $11)
     on conflict do nothing returning event_id`,
    [ev.event_id, src.attempt.kind === 'live' ? 'live' : 'solo', src.session?.id ?? src.attempt.session_id ?? null, src.attempt.id, src.attempt.lesson_id,
      JSON.stringify(ev.payload), eventType, Number(src.student.subject_id), ev.payload.occurred_at, status, lastError],
  );
  const created = r.rowCount > 0;
  if (created && status !== 'pending') log.error({ eventId: ev.event_id, lastError }, 'v2 hodisa noto\'g\'ri — manual_review');
  else if (created) log.info({ eventId: ev.event_id, eventType, attemptId: src.attempt.id, bytes: ev.bytes }, 'v2 hodisa navbatga qo\'yildi');
  if (created && ev.detailsDropped) log.warn({ eventId: ev.event_id, reason: ev.detailsDropped }, 'v2 tafsilot tushirildi (asosiy ketadi)');
  return created;
}

const triggerFor = (a) => {
  if (a.reached_end && a.reached_end_at) return 'reached_end';
  if (a.finish_reason === 'auto_7d') return 'solo_expired';
  if (a.finish_reason === 'version_changed') return 'version_changed';
  return 'session_closed';
};

export async function emitLessonResult(pool, log, attemptId, { now = new Date() } = {}) {
  const src = await loadAttemptSource(pool, attemptId);
  if (!src) return false;
  const trigger = triggerFor(src.attempt);
  const ev = buildLessonResult({ ...src, trigger, now, processedAt: now });
  return insertV2(pool, log, { ev, src, eventType: 'lesson_result' });
}

export async function emitArenaParticipation(pool, log, attemptId) {
  const src = await loadAttemptSource(pool, attemptId);
  if (!src || !src.session || !src.participation || !src.arena?.started_at) return false;
  const ev = buildArenaParticipation({ attempt: src.attempt, student: src.student, session: src.session, lesson: src.lesson, arena: { started_at: src.arena.started_at, questions_total: src.arena.questions_total }, participation: src.participation });
  return insertV2(pool, log, { ev, src, eventType: 'arena_participation' });
}

export async function emitArenaResult(pool, log, attemptId, { now = new Date() } = {}) {
  const src = await loadAttemptSource(pool, attemptId);
  if (!src || !src.session) return false;
  const ev = buildArenaResult({ ...src, arena: { ...src.arena, finished_at: src.arena.finished_at || src.session.finished_at || now }, now });
  return insertV2(pool, log, { ev, src, eventType: 'arena_result' });
}

/**
 * Server tomonidan yopishlar (25 §6) va hodisalarni navbatga qo'yish. Har tick chaqiriladi (RESULT_SCHEMA_V2=on).
 * @returns {Promise<{ sessionLimit: number, arenaClosed: number, lessonResults: number, arenaParticipations: number, arenaResults: number }>}
 */
export async function sweepV2(pool, log, { now = new Date(), limit = 100 } = {}) {
  const out = { sessionLimit: 0, arenaClosed: 0, lessonResults: 0, arenaParticipations: 0, arenaResults: 0 };

  // 1) Jonli sessiya 2 soatlik mutlaq chegara: lms + live yopiladi, arena session_limit bilan, urinishlar live_ended
  const { rows: limited } = await pool.query(
    `update lms_sessions s set status = 'ended', end_reason = coalesce(s.end_reason, 'session_limit'), finished_at = coalesce(s.finished_at, s.started_at + ${LIVE_LIMIT}), updated_at = now()
      where s.mode = 'live' and s.status = 'live' and s.started_at < $1::timestamptz - ${LIVE_LIMIT}
      returning s.id, s.pin`,
    [now],
  );
  for (const s of limited) {
    await pool.query(`update live_sessions set status = 'ended', updated_at = now() where pin = $1 and status = 'live'`, [s.pin]);
    await pool.query(`select quiz_close($1, 'session_limit')`, [s.pin]);
    await pool.query(`update attempts set status = 'finished', finish_reason = 'live_ended', finished_at = now(), updated_at = now() where session_id = $1 and kind = 'live' and status = 'active'`, [s.id]);
    out.sessionLimit++;
  }

  // 2) Arena yopilishi (server): 45 daqiqa · oxirgi savol + 1 daqiqa · sessiya yopilgan
  const { rows: openArenas } = await pool.query(
    `select ls.pin, ls.lesson_id, ls.quiz_state, ls.quiz_q, ls.quiz_first_q_at, ls.quiz_started_at, s.status as lms_status,
            (select count(*)::int from quiz_keys k where k.lesson_id = ls.lesson_id and k.question_id ~ '^quiz-[0-9]+$') as arena_total
       from live_sessions ls join lms_sessions s on s.pin = ls.pin and s.mode = 'live'
      where ls.quiz_state in ('lobby', 'q', 'r') and ls.quiz_done_at is null`,
  );
  for (const ar of openArenas) {
    let reason = null;
    const t = now.getTime();
    if (ar.lms_status === 'ended') reason = 'session_closed';
    else if (ar.quiz_first_q_at && t - new Date(ar.quiz_first_q_at).getTime() > 45 * 60_000) reason = 'arena_limit';
    else if (ar.quiz_state === 'q' && ar.arena_total > 0 && Number(ar.quiz_q) >= ar.arena_total - 1 && ar.quiz_started_at && t - new Date(ar.quiz_started_at).getTime() > ARENA_QUESTION_MS + 60_000) reason = 'last_question_timeout';
    if (!reason) continue;
    const { rows: [{ quiz_close: closed }] } = await pool.query(`select quiz_close($1, $2)`, [ar.pin, reason]);
    if (closed) { out.arenaClosed++; log.info({ pin: ar.pin, reason }, 'arena server tomonidan yopildi'); }
  }

  // 3) lesson_result: reached_end yoki yopilgan urinish, hodisasi yo'q
  const { rows: lr } = await pool.query(
    `select a.id from attempts a
       join lms_participants p on p.attempt_id = a.id and p.role = 'student'
      where (a.reached_end_at is not null or (a.status = 'finished' and a.finish_reason in ('completed', 'live_ended', 'auto_7d', 'version_changed')))
        and not exists (select 1 from result_events r where r.attempt_id = a.id and r.schema_version = 2 and r.event_type = 'lesson_result')
      order by a.updated_at asc limit $1`,
    [limit],
  );
  for (const r of lr) { try { if (await emitLessonResult(pool, log, r.id, { now })) out.lessonResults++; } catch (e) { log.error({ err: e, attemptId: r.id }, 'v2 lesson_result xato'); } }

  // 4) arena_participation
  const { rows: ap } = await pool.query(
    `select ap.attempt_id from arena_participants ap
      where ap.attempt_id is not null
        and not exists (select 1 from result_events r where r.attempt_id = ap.attempt_id and r.schema_version = 2 and r.event_type = 'arena_participation')
      order by ap.first_shown_at asc limit $1`,
    [limit],
  );
  for (const r of ap) { try { if (await emitArenaParticipation(pool, log, r.attempt_id)) out.arenaParticipations++; } catch (e) { log.error({ err: e, attemptId: r.attempt_id }, 'v2 arena_participation xato'); } }

  // 5) arena_result: yopilgan jonli sessiyaning har LMS o'quvchisiga (arena yopiq yoki boshlanmagan)
  const { rows: arr } = await pool.query(
    `select p.attempt_id from lms_participants p
       join lms_sessions s on s.id = p.session_id
       join live_sessions ls on ls.pin = s.pin
      where p.role = 'student' and p.attempt_id is not null and s.mode = 'live' and s.status = 'ended'
        and (ls.quiz_done_at is not null or ls.quiz_first_q_at is null)
        and not exists (select 1 from result_events r where r.attempt_id = p.attempt_id and r.schema_version = 2 and r.event_type = 'arena_result')
      order by s.finished_at asc limit $1`,
    [limit],
  );
  for (const r of arr) { try { if (await emitArenaResult(pool, log, r.attempt_id, { now })) out.arenaResults++; } catch (e) { log.error({ err: e, attemptId: r.attempt_id }, 'v2 arena_result xato'); } }

  return out;
}

/** Qo'llash kuzatuvi jadvali (25 §7): 1, 5, 15, 60 daqiqa, keyin soatlik, 24 soatgacha */
export function nextProcessingCheck(deliveredAt, now = new Date()) {
  const ageMin = (now.getTime() - new Date(deliveredAt).getTime()) / 60_000;
  const steps = [1, 5, 15, 60];
  for (const m of steps) if (ageMin < m) return new Date(new Date(deliveredAt).getTime() + m * 60_000);
  const nextHour = Math.floor(ageMin / 60) + 1;
  return new Date(new Date(deliveredAt).getTime() + nextHour * 60 * 60_000);
}
export const PROCESSING_REVIEW_MS = 24 * 60 * 60_000;
export const PROCESSING_WARN_MS = 60 * 60_000;
