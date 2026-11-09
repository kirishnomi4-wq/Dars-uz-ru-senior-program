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
    // attempt_no: solishtirish SQL ichida (o'z qatorining started_at i) — JS Date millisekundga kesadi, mikrosekundli
    // started_at o'zini sanamay qolardi (har doim bittaga kam, `|| 1` yashirgan; S5 testi ochdi)
    pool.query('select count(*)::int as n from attempts x where x.subject_id = $1 and x.lesson_id = $2 and x.started_at <= (select started_at from attempts where id = $3)', [a.subject_id, a.lesson_id, attemptId]).then((r) => r.rows[0].n),
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
        where p2.subject_id = $1 and s2.lesson_id = $2
          and ap.first_shown_at <= (select first_shown_at from arena_participants where pin = $3 and player_id = $4)`, // attempt_no bilan bir xil sabab (ms kesilishi)
      [a.subject_id, a.lesson_id, a.pin, a.player_id],
    );
    studentArenaNo = Math.max(1, n);
  }
  const live = a.session_mode === 'live';
  const arenaStarted = a.quiz_first_q_at || null;
  const arenaQ = arenaQuestions(keys).size;
  return {
    attempt: { id: a.id, kind: a.kind, session_id: a.session_id, lesson_id: a.lesson_id, lesson_version: a.lesson_version, version_source: a.version_source, started_at: a.started_at, finished_at: a.finished_at, finish_reason: a.finish_reason, reached_end: a.reached_end, reached_end_at: a.reached_end_at, status: a.status },
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

/** Manbadan bitta v2 hodisa yig'ish (yaratish ham, qayta yig'ish ham shu yo'ldan). null — bu tur uchun manba yetarli emas. */
function buildV2For(eventType, src, { now = new Date(), processedAt = null } = {}) {
  if (eventType === 'lesson_result') return buildLessonResult({ ...src, trigger: triggerFor(src.attempt), now, processedAt: processedAt || now });
  if (eventType === 'arena_participation') {
    if (!src.session || !src.participation || !src.arena?.started_at) return null;
    return buildArenaParticipation({ attempt: src.attempt, student: src.student, session: src.session, lesson: src.lesson, arena: { started_at: src.arena.started_at, questions_total: src.arena.questions_total }, participation: src.participation });
  }
  if (eventType === 'arena_result') {
    if (!src.session) return null;
    return buildArenaResult({ ...src, arena: { ...src.arena, finished_at: src.arena.finished_at || src.session.finished_at || now }, now, ...(processedAt ? { processedAt } : {}) });
  }
  return null;
}

async function emitV2(pool, log, eventType, attemptId, opts) {
  const src = await loadAttemptSource(pool, attemptId);
  if (!src) return false;
  const ev = buildV2For(eventType, src, opts);
  if (!ev) return false;
  return insertV2(pool, log, { ev, src, eventType });
}
export const emitLessonResult = (pool, log, attemptId, { now = new Date() } = {}) => emitV2(pool, log, 'lesson_result', attemptId, { now });
export const emitArenaParticipation = (pool, log, attemptId) => emitV2(pool, log, 'arena_participation', attemptId, {});
export const emitArenaResult = (pool, log, attemptId, { now = new Date() } = {}) => emitV2(pool, log, 'arena_result', attemptId, { now });

/**
 * S6: v2 hodisani manbadan JORIY kod bilan qayta yig'ish (faqat manual_review). event_id o'zgarmaydi (lr_/ap_/ar_ +
 * attempt_id — deterministik, School API takrorni shu id bilan taniydi), `processed_at` birinchi yig'ilgandagisi saqlanadi
 * (25 §5). Eski holat result_event_revisions'ga. dry (sukut) — hech narsa o'zgarmaydi.
 */
export async function rebuildV2(pool, log, eventId, { dry = true } = {}) {
  const fail = (error, extra = {}) => ({ event_id: eventId, dry, action: 'error', error, ...extra });
  const { rows: [row] } = await pool.query('select * from result_events where event_id = $1', [eventId]);
  if (!row) return fail('not_found');
  if (Number(row.schema_version) !== 2) return fail('not_v2');
  if (row.status !== 'manual_review') return fail(`status:${row.status}`);
  const src = await loadAttemptSource(pool, row.attempt_id);
  if (!src) return fail('no_source');
  const processedAt = row.payload?.result?.processed_at ? new Date(row.payload.result.processed_at) : null;
  const ev = buildV2For(row.event_type, src, { processedAt });
  if (!ev) return fail('no_source');
  if (ev.event_id !== row.event_id) return fail('id_mismatch', { built_event_id: ev.event_id });
  const problems = ev.error ? [ev.error] : validateV2(ev.payload);
  const summary = { event_id: row.event_id, event_type: row.event_type, dry, action: problems.length ? 'error' : 'send', problems, details_dropped: ev.detailsDropped || null, old_error: row.last_error };
  if (dry) return { ...summary, payload: ev.payload };
  if (problems.length) return summary;
  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows: [cur] } = await client.query('select status from result_events where event_id = $1 for update', [row.event_id]);
    if (!cur || cur.status !== 'manual_review') { await client.query('rollback'); return fail(`changed:${cur?.status ?? 'gone'}`); }
    await client.query(
      `insert into result_event_revisions (event_id, new_event_id, reason, old_status, old_payload, old_response, old_last_http_status, old_last_request_id, old_last_error, old_send_attempts)
       values ($1, $1, 'rebuild:v2', $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8)`,
      [row.event_id, row.status, JSON.stringify(row.payload), JSON.stringify(row.response ?? null), row.last_http_status, row.last_request_id, row.last_error, row.send_attempts],
    );
    await client.query(
      `update result_events set payload = $2::jsonb, occurred_at = $3, status = 'pending', send_attempts = 0, next_try_at = now(), last_http_status = null,
              last_request_id = null, last_error = null, response = null, delivered_at = null, processing_status = null, processing_next_at = null,
              processing_checked_at = null, processing_response = null, updated_at = now()
        where event_id = $1`,
      [row.event_id, JSON.stringify(ev.payload), ev.payload.occurred_at],
    );
    await client.query('commit');
  } catch (e) {
    await client.query('rollback').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  log.info({ eventId: row.event_id, eventType: row.event_type }, 'v2 hodisa qayta yig\'ildi');
  return summary;
}

/**
 * Server tomonidan yopishlar (25 §6) va hodisalarni navbatga qo'yish. Har tick chaqiriladi (RESULT_SCHEMA_V2=on).
 * @returns {Promise<{ sessionLimit: number, liveEnded: number, arenaClosed: number, lessonResults: number, arenaParticipations: number, arenaResults: number }>}
 */
export async function sweepV2(pool, log, { now = new Date(), limit = 100 } = {}) {
  const out = { sessionLimit: 0, liveEnded: 0, arenaClosed: 0, lessonResults: 0, arenaParticipations: 0, arenaResults: 0 };

  // 1) Jonli sessiya 2 soatlik mutlaq chegara: lms + live yopiladi, arena session_limit bilan, urinishlar live_ended
  const { rows: limited } = await pool.query(
    `update lms_sessions s set status = 'ended', end_reason = coalesce(s.end_reason, 'session_limit'), finished_at = coalesce(s.finished_at, s.started_at + ${LIVE_LIMIT}), updated_at = now()
      where s.mode = 'live' and s.status = 'live' and s.started_at < $1::timestamptz - ${LIVE_LIMIT}
      returning s.id, s.pin, s.finished_at`,
    [now],
  );
  for (const s of limited) {
    await pool.query(`update live_sessions set status = 'ended', updated_at = now() where pin = $1 and status = 'live'`, [s.pin]);
    await pool.query(`select quiz_close($1, 'session_limit', $2)`, [s.pin, s.finished_at]); // 0015: yakun = start + 2 soat
    await pool.query(`update attempts set status = 'finished', finish_reason = 'live_ended', finished_at = now(), updated_at = now() where session_id = $1 and kind = 'live' and status = 'active'`, [s.id]);
    out.sessionLimit++;
  }

  // 1a) Yopilgan jonli sessiyaning FAOL urinishlari → finished (live_ended), finished_at = sessiya yopilgan vaqti.
  //     Mentor «Darsni tugatish» (end_session), stale-closer, auto_replaced — hammasi lms_sessions'ni yopadi, urinishni emas;
  //     uni LMS xizmat-ishi 15 daqiqada bir yopardi → 8002 kabi oxiriga yetmagan o'quvchining lesson_result (session_closed)
  //     hodisasi 15 daqiqagacha kechikardi, testda esa umuman chiqmasdi (F-1105-03 S4). Endi har tick'da, 3-qadamdan oldin.
  const { rowCount: liveEnded } = await pool.query(
    `update attempts a set status = 'finished', finish_reason = 'live_ended', finished_at = coalesce(s.finished_at, now()), updated_at = now()
       from lms_sessions s
      where a.session_id = s.id and a.kind = 'live' and a.status = 'active' and s.mode = 'live' and s.status = 'ended'`,
  );
  out.liveEnded = liveEnded;

  // 2) Arena yopilishi (server): 45 daqiqa · oxirgi savol + 1 daqiqa · sessiya yopilgan
  const { rows: openArenas } = await pool.query(
    `select ls.pin, ls.lesson_id, ls.quiz_state, ls.quiz_q, ls.quiz_first_q_at, ls.quiz_started_at, s.status as lms_status, s.finished_at as lms_finished_at,
            (select count(*)::int from quiz_keys k where k.lesson_id = ls.lesson_id and k.question_id ~ '^quiz-[0-9]+$') as arena_total
       from live_sessions ls join lms_sessions s on s.pin = ls.pin and s.mode = 'live'
      where ls.quiz_state in ('lobby', 'q', 'r') and ls.quiz_done_at is null`,
  );
  for (const ar of openArenas) {
    let reason = null;
    let at = null; // 0015: mantiqiy yakun lahzasi (ishchi kechikishi o'yin vaqtini uzaytirmaydi — 25 §12 band 11)
    const t = now.getTime();
    const firstQ = ar.quiz_first_q_at ? new Date(ar.quiz_first_q_at).getTime() : null;
    const lastQ = ar.quiz_started_at ? new Date(ar.quiz_started_at).getTime() : null;
    const isLast = ar.quiz_state === 'q' && ar.arena_total > 0 && Number(ar.quiz_q) >= ar.arena_total - 1 && lastQ !== null;
    const cands = [];
    if (firstQ !== null && t - firstQ > 45 * 60_000) cands.push(['arena_limit', firstQ + 45 * 60_000]);
    if (isLast && t - lastQ > ARENA_QUESTION_MS + 60_000) cands.push(['last_question_timeout', lastQ + ARENA_QUESTION_MS + 60_000]);
    if (ar.lms_status === 'ended') cands.push(['session_closed', ar.lms_finished_at ? new Date(ar.lms_finished_at).getTime() : t]);
    if (cands.length) { cands.sort((a, b) => a[1] - b[1]); [reason, at] = cands[0]; } // eng erta chegara haqiqiy sabab
    if (!reason) continue;
    const { rows: [{ quiz_close: closed }] } = await pool.query(`select quiz_close($1, $2, $3)`, [ar.pin, reason, new Date(at)]);
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
