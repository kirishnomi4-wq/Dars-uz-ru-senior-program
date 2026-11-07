// Natija-xizmat: manbadan (sessiya / urinish) payload yig'ib result_events'ga «pending» yozadi.
// Sweeper: yopilgan-lekin-hodisasiz jonli sessiyalar va tugagan solo urinishlar → navbat (idempotent: UNIQUE indekslar).
// Kim chaqiradi: worker tick (har 5 s) va end_session RPC'dan keyin darhol.
import { buildLivePayloads, buildSoloPayload, finalizePayload } from './result-builder.js';

/** Detallar uchun qo'shimcha manba (RESULT_DETAILS=a): urinish-tarixi, yutuq-vaqtlari, katalogdagi yutuq-ta'riflari */
async function loadDetailsSource(pool, { pin, playerId = null, sessionId = null, attemptId = null, lessonId }) {
  const { rows: attempts } = await pool.query(
    `select player_id, screen_idx, question_id, attempt_no, picked, correct, elapsed_ms, texts, answered_at
       from answer_attempts where pin = $1 and ($2::uuid is null or player_id = $2) and screen_idx < 500
      order by screen_idx, attempt_no`,
    [pin, playerId],
  );
  const { rows: achievements } = sessionId
    ? await pool.query(
      `select p.player_id, ae.achievement_id, ae.earned_at
         from achievement_events ae join lms_participants p on p.attempt_id = ae.attempt_id
        where p.session_id = $1 and p.role = 'student' order by ae.earned_at`,
      [sessionId],
    )
    : await pool.query('select achievement_id, earned_at from achievement_events where attempt_id = $1 order by earned_at', [attemptId]);
  const { rows: cat } = await pool.query('select achievements from lesson_catalog where lesson_id = $1', [lessonId]);
  const catalog = Array.isArray(cat[0]?.achievements) ? cat[0].achievements : [];
  const attemptsByPlayer = new Map();
  for (const a of attempts) { if (!attemptsByPlayer.has(a.player_id)) attemptsByPlayer.set(a.player_id, []); attemptsByPlayer.get(a.player_id).push(a); }
  const achievementsByPlayer = new Map();
  for (const e of achievements) { if (!achievementsByPlayer.has(e.player_id)) achievementsByPlayer.set(e.player_id, []); achievementsByPlayer.get(e.player_id).push(e); }
  return { attempts, achievements, catalog, attemptsByPlayer, achievementsByPlayer };
}

/** Sessiya uchun manba-ma'lumot */
async function loadLiveSource(pool, sessionId, opts = {}) {
  const { rows: srows } = await pool.query(
    `select s.id, s.pin, s.lesson_id, s.gid, s.teacher_id, s.started_at, coalesce(s.finished_at, ls.updated_at) as finished_at,
            lc.title_uz, lc.title_ru
       from lms_sessions s
       join live_sessions ls on ls.pin = s.pin
       left join lesson_catalog lc on lc.lesson_id = s.lesson_id
      where s.id = $1 and s.mode = 'live'`,
    [sessionId],
  );
  const session = srows[0];
  if (!session) return null;
  const { rows: participants } = await pool.query(
    `select p.subject_id, p.player_id, p.joined_at, coalesce(a.reached_end, false) as reached_end
       from lms_participants p
       left join attempts a on a.id = p.attempt_id
      where p.session_id = $1 and p.role = 'student' and p.player_id is not null`,
    [sessionId],
  );
  // HAMMA o'yinchi (PIN bilan kirganlar ham) — podium ekran bilan bir xil bo'lishi uchun
  const { rows: players } = await pool.query('select id, joined_at from live_players where pin = $1 order by joined_at asc', [session.pin]);
  const { rows: keys } = await pool.query('select question_id, correct_idx from quiz_keys where lesson_id = $1', [session.lesson_id]);
  const { rows: answers } = await pool.query(
    'select player_id, screen_idx, question_id, picked, correct, elapsed_ms, answered_at from live_answers where pin = $1 and screen_idx < 500',
    [session.pin],
  );
  const answersByPlayer = new Map();
  for (const a of answers) { if (!answersByPlayer.has(a.player_id)) answersByPlayer.set(a.player_id, []); answersByPlayer.get(a.player_id).push(a); }
  const details = opts.details ? await loadDetailsSource(pool, { pin: session.pin, sessionId, lessonId: session.lesson_id }) : null;
  return { session, players, participants, keys, answersByPlayer, details, lessonTitle: session.title_uz || session.lesson_id };
}

/**
 * Tanga-qoidasi: bir o'quvchi — bir dars — bitta tanga-hodisa. Solo yuborilishi uchun shu o'quvchida shu dars bo'yicha
 * oldin TUGALLANGAN natija (jonli — har qanday; solo — completed=true) bo'lmasligi kerak. manual_review'dagi ham hisobga olinadi
 * (u ham yuborishga mo'ljallangan). Tashlab ketilgan (completed=false) solo bloklamaydi.
 */
export async function hasRewardedResult(pool, subjectId, lessonId) {
  const { rows } = await pool.query(
    `select 1 from result_events r
      where r.lesson_id = $1 and r.mode = 'live'
        and r.payload->'students' @> jsonb_build_array(jsonb_build_object('student_id', $2::bigint))
     union all
     select 1 from result_events r
      where r.lesson_id = $1 and r.mode = 'solo'
        and (r.payload->'students'->0->>'student_id')::bigint = $2
        and (r.payload->'students'->0->>'completed')::boolean = true
     limit 1`,
    [lessonId, subjectId],
  );
  return rows.length > 0;
}

/**
 * Tanga-qoidasi, jonli tomon (F-0918-04): berilgan o'quvchilardan qaysilarida shu dars bo'yicha oldin TUGALLANGAN
 * (completed=true; jonli yoki solo) natija yuborilgan yoki yuborilmoqda (pending / retry_wait / delivered).
 * - manual_review KIRMAYDI: u LMS'ga yetmagan (masalan 422) — shunga tayanib haqiqiy jonli darsni tashlab bo'lmaydi.
 * - completed=false KIRMAYDI: uzilib qolgan sessiyadan (mentor noutbuki o'chdi) keyingi TO'LIQ dars baribir ketadi.
 * - skipped KIRMAYDI: o'zi yuborilmagan yozuv.
 * @returns {Promise<Set<string>>} student_id lar (satr ko'rinishida)
 */
export async function rewardedStudents(pool, lessonId, studentIds, exceptEventId) {
  const ids = [...new Set((studentIds || []).map(String))];
  if (!ids.length) return new Set();
  const { rows } = await pool.query(
    `select distinct st->>'student_id' as sid
       from result_events r, jsonb_array_elements(r.payload->'students') st
      where r.lesson_id = $1 and r.event_id <> $2
        and r.status in ('pending', 'retry_wait', 'delivered')
        and st->>'completed' = 'true'
        and st->>'student_id' = any($3::text[])`,
    [lessonId, exceptEventId, ids],
  );
  return new Set(rows.map((r) => r.sid));
}

async function insertEvent(pool, { event_id, mode, session_id = null, attempt_id = null, lesson_id, payload }) {
  const r = await pool.query(
    `insert into result_events (event_id, mode, session_id, attempt_id, lesson_id, payload, students_count)
     values ($1, $2, $3, $4, $5, $6::jsonb, $7)
     on conflict do nothing returning event_id`,
    [event_id, mode, session_id, attempt_id, lesson_id, JSON.stringify(payload), payload.students.length],
  );
  return r.rowCount > 0;
}

/**
 * Jonli sessiya uchun hodisa(lar) yaratish. LMS-o'quvchisi bo'lmasa (faqat PIN bilan kirganlar) — hodisa yo'q.
 * @returns {Promise<{ created: number, skipped: string|null }>}
 */
export async function enqueueLiveSession(pool, log, sessionId, opts = {}) {
  const src = await loadLiveSource(pool, sessionId, opts);
  if (!src) return { created: 0, skipped: 'no_session' };
  if (!src.participants.length) {
    // hodisa yo'q, lekin sweeper qayta-qayta urinmasin — bo'sh belgi (payload yo'q) o'rniga sessiyaga izoh qoldiramiz
    await pool.query(`update lms_sessions set end_reason = coalesce(end_reason, 'mentor'), updated_at = now() where id = $1`, [sessionId]);
    return { created: 0, skipped: 'no_lms_students' };
  }
  const events = buildLivePayloads(src);
  let created = 0;
  let skippedAll = 0;
  for (const ev of events) {
    // Tanga-qoidasi (F-0918-04): bir o'quvchi — bir dars — bitta natija. Takror o'quvchi hodisadan chiqadi (o'rinlar va
    // boshqalarning nishonlari o'zgarmaydi — ular sinfdagi haqiqiy holat). RESULT_LIVE_REPEAT=send bu qadamni o'chiradi.
    if (opts.liveRepeat !== 'send') {
      const repeat = await rewardedStudents(pool, src.session.lesson_id, ev.payload.students.map((st) => st.student_id), ev.event_id);
      if (repeat.size) {
        const kept = ev.payload.students.filter((st) => !repeat.has(String(st.student_id)));
        log.info({ sessionId, eventId: ev.event_id, repeat: [...repeat], kept: kept.length }, 'jonli natija: takror o\'quvchi(lar) chiqarildi (bu dars bo\'yicha natijasi allaqachon bor)');
        if (!kept.length) {
          // hamma takror → yuborilmaydi; yozuv qoladi (analitika + sweeper shu sessiyani qayta olmaydi)
          await pool.query(
            `insert into result_events (event_id, mode, session_id, lesson_id, payload, students_count, status, last_error)
             values ($1, 'live', $2, $3, $4::jsonb, $5, 'skipped', 'already_rewarded') on conflict do nothing`,
            [ev.event_id, sessionId, src.session.lesson_id, JSON.stringify(ev.payload), ev.payload.students.length],
          );
          skippedAll++;
          continue;
        }
        ev.payload = { ...ev.payload, students: kept };
      }
    }
    const { payload, problems, detailsDropped } = finalizePayload(ev.payload);
    if (detailsDropped) log.warn({ sessionId, eventId: ev.event_id, reason: detailsDropped }, 'natija-detallari tashlandi (asosiy payload ketadi)');
    if (problems.length) {
      log.error({ sessionId, eventId: ev.event_id, problems }, 'natija payload noto\'g\'ri — manual_review');
      await pool.query(
        `insert into result_events (event_id, mode, session_id, lesson_id, payload, students_count, status, last_error)
         values ($1, 'live', $2, $3, $4::jsonb, $5, 'manual_review', $6) on conflict do nothing`,
        [ev.event_id, sessionId, src.session.lesson_id, JSON.stringify(payload), payload.students.length, `validate: ${problems.join(', ')}`],
      );
      continue;
    }
    if (await insertEvent(pool, { event_id: ev.event_id, mode: 'live', session_id: sessionId, lesson_id: src.session.lesson_id, payload })) created++;
  }
  if (created) log.info({ sessionId, created, students: src.participants.length }, 'natija navbatga qo\'yildi (live)');
  return { created, skipped: !created && skippedAll ? 'already_rewarded' : null };
}

/** Tugagan solo urinish (tanga-qoidasidan tashqari) — enqueueSoloAttempt va rebuildEvent uchun umumiy */
async function loadSoloAttempt(pool, attemptId) {
  const { rows } = await pool.query(
    `select a.*, p.player_id, p.joined_at, s.pin, lc.title_uz
       from attempts a
       join lms_participants p on p.attempt_id = a.id and p.role = 'student'
       join lms_sessions s on s.id = a.session_id
       left join lesson_catalog lc on lc.lesson_id = a.lesson_id
      where a.id = $1 and a.kind = 'solo' and a.status = 'finished' and a.finish_reason in ('completed', 'auto_7d')`,
    [attemptId],
  );
  return rows[0] || null;
}
async function buildSoloFromAttempt(pool, a, opts = {}) {
  const { rows: keys } = await pool.query('select question_id, correct_idx from quiz_keys where lesson_id = $1', [a.lesson_id]);
  const { rows: answers } = await pool.query(
    'select player_id, screen_idx, question_id, picked, correct, elapsed_ms, answered_at from live_answers where pin = $1 and player_id = $2 and screen_idx < 500',
    [a.pin, a.player_id],
  );
  const details = opts.details ? await loadDetailsSource(pool, { pin: a.pin, playerId: a.player_id, attemptId: a.id, lessonId: a.lesson_id }) : null;
  return buildSoloPayload({ attempt: a, subjectId: Number(a.subject_id), lessonId: a.lesson_id, lessonTitle: a.title_uz || a.lesson_id, keys, answers, details });
}

/** Solo urinish uchun hodisa (completed yoki auto_7d). restarted — yuborilmaydi. */
export async function enqueueSoloAttempt(pool, log, attemptId, opts = {}) {
  const a = await loadSoloAttempt(pool, attemptId);
  if (!a) return { created: 0, skipped: 'not_eligible' };
  // Tanga-qoidasi: oldin tugallangan natija bo'lsa — bu urinish LMS'ga ketmaydi (bizda ko'rish/analitika uchun qoladi)
  if (await hasRewardedResult(pool, Number(a.subject_id), a.lesson_id)) {
    await pool.query(`update attempts set result_event_id = 'skipped:already_rewarded', updated_at = now() where id = $1`, [attemptId]);
    log.info({ attemptId, lessonId: a.lesson_id }, 'solo natija yuborilmadi: bu dars uchun tanga-hodisa allaqachon bor');
    return { created: 0, skipped: 'already_rewarded' };
  }
  const ev = await buildSoloFromAttempt(pool, a, opts);
  const { payload, problems, detailsDropped } = finalizePayload(ev.payload);
  if (detailsDropped) log.warn({ attemptId, eventId: ev.event_id, reason: detailsDropped }, 'natija-detallari tashlandi (asosiy payload ketadi)');
  if (problems.length) {
    log.error({ attemptId, problems }, 'solo payload noto\'g\'ri — manual_review');
    await pool.query(
      `insert into result_events (event_id, mode, attempt_id, lesson_id, payload, students_count, status, last_error)
       values ($1, 'solo', $2, $3, $4::jsonb, 1, 'manual_review', $5) on conflict do nothing`,
      [ev.event_id, attemptId, a.lesson_id, JSON.stringify(payload), `validate: ${problems.join(', ')}`],
    );
    return { created: 0, skipped: 'invalid' };
  }
  const created = await insertEvent(pool, { event_id: ev.event_id, mode: 'solo', attempt_id: attemptId, lesson_id: a.lesson_id, payload });
  if (created) log.info({ attemptId, eventId: ev.event_id }, 'natija navbatga qo\'yildi (solo)');
  return { created: created ? 1 : 0, skipped: null };
}

/**
 * Sweeper — manbalarni topib navbatga qo'yadi:
 *  - live: lms_sessions mode=live, status=ended YOKI live_sessions ended (mentor «Erkin qilish», auto_replaced, stale), hodisasiz
 *  - solo: attempts finished (completed|auto_7d), hodisasiz
 */
export async function sweepResults(pool, log, opts = {}) {
  const out = { live: 0, solo: 0 };
  const { rows: liveRows } = await pool.query(
    `select s.id
       from lms_sessions s
       join live_sessions ls on ls.pin = s.pin
      where s.mode = 'live' and (s.status = 'ended' or ls.status = 'ended')
        and not exists (select 1 from result_events r where r.session_id = s.id and r.mode = 'live')
        and exists (select 1 from lms_participants p where p.session_id = s.id and p.role = 'student')
      order by s.updated_at asc limit 50`,
  );
  for (const r of liveRows) {
    // lms_sessions ham yopiq bo'lsin (stale-closer faqat live_sessions'ni yopadi)
    await pool.query(`update lms_sessions set status = 'ended', end_reason = coalesce(end_reason, 'stale'), finished_at = coalesce(finished_at, now()), updated_at = now() where id = $1 and status = 'live'`, [r.id]);
    await pool.query(`update attempts set status = 'finished', finish_reason = 'live_ended', finished_at = now(), updated_at = now() where session_id = $1 and kind = 'live' and status = 'active'`, [r.id]);
    const res = await enqueueLiveSession(pool, log, r.id, opts);
    out.live += res.created;
  }
  const { rows: soloRows } = await pool.query(
    `select a.id from attempts a
      where a.kind = 'solo' and a.status = 'finished' and a.finish_reason in ('completed', 'auto_7d')
        and a.result_event_id is null
        and not exists (select 1 from result_events r where r.attempt_id = a.id and r.mode = 'solo')
      order by a.finished_at asc limit 50`,
  );
  for (const r of soloRows) {
    const res = await enqueueSoloAttempt(pool, log, r.id, opts);
    out.solo += res.created;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// F-1106-01 (2026-11-06): School API rad etgan (manual_review) hodisani manbadan QAYTA YIG'ISH.
// `requeue` eski payload'ni yuboradi (u yana 422 oladi). Bu yerda hodisa sessiya/urinishdan YANGI kod bilan yig'iladi,
// tanga-qoidasi qayta qo'llanadi (natijasi allaqachon yetkazilgan/yuborilayotgan o'quvchi chiqariladi) va o'sha qatorning
// o'zida almashtiriladi; eski holat result_event_revisions'ga ko'chadi (0011). `dry` (sukut) — hech narsa o'zgarmaydi.
// ---------------------------------------------------------------------------------------------------------------

export const REBUILD_SUFFIX_RE = /^r[1-9][0-9]?$/;
const baseEventId = (id) => String(id).replace(/_r[1-9][0-9]?$/, '');

/**
 * @param {{ dry?: boolean, suffix?: string|null, details?: boolean, planned?: Set<string>|null }} opts
 *   suffix — yangi event_id uchun (`r1` → `<asl>_r1`); berilmasa id o'zgarmaydi.
 *   planned — dry-to'plamda oldingi hodisalar «yuboriladi» deb belgilagan `lesson:student` lar (bir o'quvchi — bir tanga).
 * @returns {Promise<object>} xulosa (dry'da `payload` ham)
 */
export async function rebuildEvent(pool, log, eventId, opts = {}) {
  const dry = opts.dry !== false;
  const fail = (error, extra = {}) => ({ event_id: eventId, dry, action: 'error', error, ...extra });
  const { rows: [row] } = await pool.query('select * from result_events where event_id = $1', [eventId]);
  if (!row) return fail('not_found');
  if (row.status !== 'manual_review') return fail(`status:${row.status}`);
  const suffix = opts.suffix ?? null;
  if (suffix !== null && !REBUILD_SUFFIX_RE.test(String(suffix))) return fail('bad_suffix');
  const base = baseEventId(row.event_id);
  const newId = suffix ? `${base}_${suffix}` : row.event_id;
  if (newId.length > 128) return fail('new_id_too_long');
  if (newId !== row.event_id) {
    const { rowCount } = await pool.query('select 1 from result_events where event_id = $1', [newId]);
    if (rowCount) return fail('new_id_exists', { new_event_id: newId });
  }

  let ev = null;
  if (row.mode === 'live') {
    const src = await loadLiveSource(pool, row.session_id, { details: !!opts.details });
    if (!src) return fail('no_source');
    ev = buildLivePayloads(src).find((e) => e.event_id === base) || null;
  } else {
    const a = await loadSoloAttempt(pool, row.attempt_id);
    if (!a) return fail('no_source');
    ev = await buildSoloFromAttempt(pool, a, { details: !!opts.details });
    if (ev.event_id !== base) ev = null;
  }
  if (!ev) return fail('id_mismatch');

  // Tanga-qoidasi: shu dars bo'yicha boshqa hodisada TUGALLANGAN natijasi yuborilgan/yuborilayotgan o'quvchi chiqadi
  const built = { ...ev.payload, event_id: newId };
  const key = (sid) => `${row.lesson_id}:${sid}`;
  const rewarded = await rewardedStudents(pool, row.lesson_id, built.students.map((s) => s.student_id), row.event_id);
  for (const s of built.students) if (opts.planned?.has(key(s.student_id))) rewarded.add(String(s.student_id));
  const kept = built.students.filter((s) => !rewarded.has(String(s.student_id)));
  const excluded = built.students.filter((s) => rewarded.has(String(s.student_id))).map((s) => s.student_id);

  let payload = built;
  let detailsDropped = null;
  if (kept.length) {
    const fin = finalizePayload({ ...built, students: kept });
    if (fin.problems.length) return fail('validate', { new_event_id: newId, problems: fin.problems });
    payload = fin.payload;
    detailsDropped = fin.detailsDropped;
  }
  const action = kept.length ? 'send' : 'skip';
  if (opts.planned && kept.length) for (const s of payload.students) if (s.completed) opts.planned.add(key(s.student_id));

  const oldBy = new Map((row.payload?.students || []).map((s) => [String(s.student_id), s]));
  const newIds = new Set(built.students.map((s) => String(s.student_id)));
  const summary = {
    event_id: row.event_id, new_event_id: newId, mode: row.mode, lesson_id: row.lesson_id, dry, action,
    students_before: oldBy.size, students_after: action === 'send' ? payload.students.length : 0,
    excluded,
    not_in_source: [...oldBy.keys()].filter((sid) => !newIds.has(sid)).map(Number),
    correct_changes: (action === 'send' ? payload.students : [])
      .filter((s) => oldBy.has(String(s.student_id)) && oldBy.get(String(s.student_id)).correct_answers !== s.correct_answers)
      .map((s) => ({ student_id: s.student_id, before: oldBy.get(String(s.student_id)).correct_answers, after: s.correct_answers })),
    details_dropped: detailsDropped,
  };
  if (dry) return { ...summary, payload };

  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows: [cur] } = await client.query('select status from result_events where event_id = $1 for update', [row.event_id]);
    if (!cur || cur.status !== 'manual_review') { await client.query('rollback'); return fail(`changed:${cur?.status ?? 'gone'}`); }
    await client.query(
      `insert into result_event_revisions (event_id, new_event_id, reason, old_status, old_payload, old_response, old_last_http_status, old_last_request_id, old_last_error, old_send_attempts)
       values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9, $10)`,
      [row.event_id, newId, 'rebuild:F-1106-01', row.status, JSON.stringify(row.payload), JSON.stringify(row.response ?? null), row.last_http_status, row.last_request_id, row.last_error, row.send_attempts],
    );
    await client.query(
      `update result_events set event_id = $2, payload = $3::jsonb, students_count = $4, status = $5, send_attempts = 0, next_try_at = now(),
              last_http_status = null, last_request_id = null, last_error = $6, response = null, delivered_at = null, updated_at = now()
        where event_id = $1`,
      [row.event_id, newId, JSON.stringify(payload), payload.students.length, action === 'send' ? 'pending' : 'skipped', action === 'send' ? null : 'already_rewarded (rebuild)'],
    );
    await client.query('commit');
  } catch (e) {
    await client.query('rollback').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  log.info({ eventId: row.event_id, newEventId: newId, action, students: summary.students_after, excluded: excluded.length, correctChanges: summary.correct_changes.length }, 'natija qayta yig\'ildi (F-1106-01)');
  return summary;
}

/** Bir nechta hodisa — yaratilgan vaqti bo'yicha (eskisi oldin: bir o'quvchi — bir tanga, birinchi dars yutadi). */
export async function rebuildEvents(pool, log, eventIds, opts = {}) {
  const ids = [...new Set(eventIds || [])];
  const { rows } = await pool.query('select event_id from result_events where event_id = any($1::text[]) order by created_at asc, event_id asc', [ids]);
  const ordered = [...rows.map((r) => r.event_id), ...ids.filter((id) => !rows.some((r) => r.event_id === id))];
  const planned = opts.dry !== false ? new Set() : null;
  const results = [];
  for (const id of ordered) results.push(await rebuildEvent(pool, log, id, { ...opts, planned }));
  return results;
}
