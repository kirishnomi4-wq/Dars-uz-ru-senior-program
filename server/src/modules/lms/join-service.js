// LMS-ko'prik: liveToken bilan kirish (BACKEND_REJA §6.1, §6.2, §6.3, §6.4, §6.6, §6.7).
// Hamma yozuvlar bitta tranzaksiyada; sessiya-tokenlar bazada shifrlangan; jti bir sessiyaga bog'lanadi.
// Javob shakli darsdagi `liveStore` shakliga TENG + attempt/progress — dars uni saqlab, rejimga o'tadi.
//
// O'quvchi qaror-daraxti:
//   0) faol urinish bor → davom (live: sessiya tirik bo'lsa; solo: har doim)
//   1) guruhlarida jonli sessiya → kiradi (1 ta) / tanlov (ko'p)
//   2) tugagan urinish bor → KO'RISH rejimi (javoblar saqlangan, natija ko'rinadi, yozilmaydi)
//   3) aks holda → SOLO (shaxsiy sessiya, server-ball, oxirgi ekranda tugaydi)
import { withTransaction } from '../../db/pool.js';
import { AppError, notFound, conflict, forbidden } from '../../lib/errors.js';
import { encryptText, decryptText } from '../../lib/crypto.js';
import {
  progressPayload, attemptPayload, getProgress, activeAttempt, latestFinishedAttempt,
  finishAttempt, createAttempt, createSoloAttempt, closeSoloSession, joinLivePlayer,
} from './progress-service.js';

const TOKEN_BOUND_ELSEWHERE = "Bu kirish tokeni boshqa sessiyaga bog'langan. Sahifani yangilang.";

/** @param {import('pg').PoolClient} c */
async function lockGroupLesson(c, gid, lessonId) {
  await c.query('select pg_advisory_xact_lock(hashtext($1))', [`lms:${gid}:${lessonId}`]);
}
async function lockStudentLesson(c, sub, lessonId) {
  await c.query('select pg_advisory_xact_lock(hashtext($1))', [`lms:student:${sub}:${lessonId}`]);
}

async function assertLessonKnown(c, lessonId) {
  const { rows } = await c.query('select 1 from lesson_catalog where lesson_id = $1 and active', [lessonId]);
  if (!rows[0]) throw notFound("Bu dars katalogda yo'q. Mentor bilan bog'laning.");
}

/** jti ro'yxatga olinadi. Qaytaradi: oldin qaysi sessiyaga bog'langani (null = hali yo'q). */
async function registerToken(c, claims) {
  const { rows } = await c.query(
    `insert into lms_tokens (jti, role, subject_id, exp) values ($1, $2, $3, $4)
     on conflict (jti) do nothing returning session_id`,
    [claims.jti, claims.role, claims.sub, claims.exp],
  );
  if (rows[0]) return { boundSessionId: null };
  const { rows: ex } = await c.query('select role, subject_id, session_id from lms_tokens where jti = $1', [claims.jti]);
  const t = ex[0];
  if (!t || t.role !== claims.role || Number(t.subject_id) !== claims.sub) throw new AppError('invalid_token', 401, 'Kirish tokeni yaroqsiz.');
  return { boundSessionId: t.session_id };
}

async function bindToken(c, jti, sessionId) {
  const r = await c.query(
    'update lms_tokens set session_id = $2 where jti = $1 and (session_id is null or session_id = $2)',
    [jti, sessionId],
  );
  if (r.rowCount === 0) throw conflict(TOKEN_BOUND_ELSEWHERE);
}

/** live_sessions «live» bo'lmasa lms_sessions'ni ham yopadi (stale-closer yoki PIN-yo'lida tugatilgan). */
async function ensureStillLive(c, lmsSession) {
  const { rows } = await c.query('select status, cur_screen, max_screen from live_sessions where pin = $1', [lmsSession.pin]);
  const live = rows[0];
  if (live && live.status === 'live') return live;
  await c.query(
    `update lms_sessions set status = 'ended', end_reason = coalesce(end_reason, 'stale'), finished_at = coalesce(finished_at, now()), updated_at = now() where id = $1`,
    [lmsSession.id],
  );
  return null;
}

// ============================================================ MENTOR

/**
 * @param {{ pool: import('pg').Pool, config: any, encKey: Buffer, log: import('pino').Logger }} deps
 * @param {import('./jwt.js').LiveClaims} claims
 * @param {{ lesson_id: string, lesson_version?: string, answer_key?: Record<string, number> }} body
 */
export async function joinMentor(deps, claims, body) {
  const { pool, config, encKey, log } = deps;
  const lessonId = body.lesson_id;
  if (!config.liveMentorCode) throw new AppError('unavailable', 503, "Server sozlanmagan (mentor-kod yo'q).");

  return withTransaction(pool, async (c) => {
    await assertLessonKnown(c, lessonId);
    await lockGroupLesson(c, claims.gid, lessonId);
    const { boundSessionId } = await registerToken(c, claims);

    const { rows: existing } = await c.query(
      `select s.*, p.session_token_enc
         from lms_sessions s
         left join lms_participants p on p.session_id = s.id and p.role = 'mentor'
        where s.mode = 'live' and s.status = 'live' and s.gid = $1 and s.lesson_id = $2
        for update of s`,
      [claims.gid, lessonId],
    );
    let old = existing[0] || null;
    if (old && !(await ensureStillLive(c, old))) old = null;
    if (old && boundSessionId && boundSessionId !== old.id) throw conflict(TOKEN_BOUND_ELSEWHERE);

    // O'sha o'qituvchi qayta kirdi (F5, boshqa qurilma, yangi jti) → DAVOM (LMS §5.4)
    if (old && Number(old.teacher_id) === claims.sub && old.session_token_enc) {
      await bindToken(c, claims.jti, old.id);
      const token = decryptText(encKey, old.session_token_enc);
      if (body.answer_key) await c.query('select set_quiz_keys($1, $2, $3)', [lessonId, config.liveMentorCode, JSON.stringify(body.answer_key)]);
      log.info({ sessionId: old.id, gid: claims.gid, lessonId }, 'lms: mentor sessiyani davom ettirdi');
      return { mode: 'mentor', pin: old.pin, token, gid: claims.gid, session_id: old.id, resumed: true };
    }

    // Boshqa o'qituvchi (TA, o'rinbosar) → eskisi avto-yopiladi (§6.6). Avval eskisi ended (UNIQUE), keyin yangisi.
    let replacedId = null;
    if (old) {
      if (old.session_token_enc) await c.query('select end_session($1, $2)', [old.pin, decryptText(encKey, old.session_token_enc)]);
      else await c.query(`update live_sessions set status = 'ended', updated_at = now() where pin = $1`, [old.pin]);
      await c.query(
        `update lms_sessions set status = 'ended', end_reason = 'auto_replaced', finished_at = now(), updated_at = now() where id = $1`,
        [old.id],
      );
      replacedId = old.id;
    }

    const { rows: created } = await c.query('select * from create_session($1, $2)', [lessonId, config.liveMentorCode]);
    const { pin, token } = created[0];
    if (body.answer_key) await c.query('select set_quiz_keys($1, $2, $3)', [lessonId, config.liveMentorCode, JSON.stringify(body.answer_key)]);

    const { rows: ins } = await c.query(
      `insert into lms_sessions (pin, lesson_id, lesson_version, mode, gid, teacher_id, mentor_jti)
       values ($1, $2, $3, 'live', $4, $5, $6) returning id`,
      [pin, lessonId, body.lesson_version ?? null, claims.gid, claims.sub, claims.jti],
    );
    const sessionId = ins[0].id;
    if (replacedId) await c.query('update lms_sessions set auto_ended_by = $2 where id = $1', [replacedId, sessionId]);
    await c.query(
      `insert into lms_participants (session_id, role, subject_id, session_token_enc, display_name) values ($1, 'mentor', $2, $3, $4)`,
      [sessionId, claims.sub, encryptText(encKey, token), claims.name || null],
    );
    await bindToken(c, claims.jti, sessionId);
    log.info({ sessionId, gid: claims.gid, lessonId, replaced: !!replacedId }, 'lms: mentor sessiya ochdi');
    return { mode: 'mentor', pin, token, gid: claims.gid, session_id: sessionId, resumed: false, replaced_session_id: replacedId };
  });
}

// ============================================================ O'QUVCHI — yordamchilar

async function groupsFor(deps, c, claims) {
  const { config, schoolApi } = deps;
  const ttl = config.contextCacheTtlSeconds;
  if (ttl > 0) {
    const { rows } = await c.query(
      `select groups, found from context_cache where subject_id = $1 and fetched_at > now() - ($2::int * interval '1 second')`,
      [claims.sub, ttl],
    );
    if (rows[0]) return { groups: rows[0].groups, found: rows[0].found, cached: true };
  }
  const ctx = await schoolApi.integrationContext(claims.sub);
  await c.query(
    `insert into context_cache (subject_id, groups, found, fetched_at) values ($1, $2, $3, now())
     on conflict (subject_id) do update set groups = excluded.groups, found = excluded.found, fetched_at = now()`,
    [claims.sub, JSON.stringify(ctx.groups), ctx.found],
  );
  return { groups: ctx.groups, found: ctx.found, cached: false };
}

const studentPayload = (row, playerToken, attempt, progressRow) => ({
  mode: 'student',
  pin: row.pin,
  playerId: row.player_id,
  playerToken,
  nickname: row.display_name,
  lastScreen: row.cur_screen ?? 0,
  maxScreen: Math.max(row.max_screen ?? 0, row.cur_screen ?? 0),
  session_id: row.session_id,
  attempt: attemptPayload(attempt),
  progress: progressPayload(progressRow),
});

const soloPayload = (sess, attempt, progressRow) => ({
  mode: 'solo',
  pin: sess.pin,
  playerId: sess.playerId,
  playerToken: sess.playerToken,
  nickname: sess.nickname,
  attempt: attemptPayload(attempt),
  progress: progressPayload(progressRow),
});

const reviewPayload = (attempt, progressRow) => ({
  mode: 'review',
  attempt: attemptPayload(attempt),
  progress: progressPayload(progressRow),
});

/** Urinishning ishtirokchi + sessiya qatori (o'quvchi) */
async function participationOf(c, attempt) {
  const { rows } = await c.query(
    `select p.session_id, p.player_id, p.session_token_enc, p.display_name, s.pin, s.mode, s.status as lms_status,
            ls.cur_screen, ls.max_screen, ls.status as live_status
       from lms_participants p
       join lms_sessions s on s.id = p.session_id
       join live_sessions ls on ls.pin = s.pin
      where p.attempt_id = $1 and p.role = 'student'
      limit 1`,
    [attempt.id],
  );
  return rows[0] || null;
}

/** Faol urinishni qaytaradi (live tirik bo'lsa / solo) yoki uni yopadi va null qaytaradi. */
async function resumeActive(c, deps, claims, lessonId, boundSessionId) {
  const { encKey } = deps;
  const active = await activeAttempt(c, claims.sub, lessonId);
  if (!active) return null;
  const part = await participationOf(c, active);
  if (!part || !part.session_token_enc) { await finishAttempt(c, active.id, 'live_ended'); return null; }
  if (boundSessionId && boundSessionId !== part.session_id) throw conflict(TOKEN_BOUND_ELSEWHERE);

  if (active.kind === 'live') {
    if (part.lms_status !== 'live' || part.live_status !== 'live') {
      await finishAttempt(c, active.id, 'live_ended');
      return null;
    }
    await bindToken(c, claims.jti, part.session_id);
    return studentPayload(part, decryptText(encKey, part.session_token_enc), active, await getProgress(c, active.id));
  }
  // solo — har doim davom
  await bindToken(c, claims.jti, part.session_id);
  return soloPayload({ pin: part.pin, playerId: part.player_id, playerToken: decryptText(encKey, part.session_token_enc), nickname: part.display_name }, active, await getProgress(c, active.id));
}

async function liveSessionsFor(c, lessonId, groups) {
  if (!groups.length) return [];
  const { rows } = await c.query(
    `select s.id, s.pin, s.gid, s.started_at, ls.cur_screen, ls.max_screen, lc.title_uz, lc.title_ru
       from lms_sessions s
       join live_sessions ls on ls.pin = s.pin
       left join lesson_catalog lc on lc.lesson_id = s.lesson_id
      where s.mode = 'live' and s.status = 'live' and s.lesson_id = $1 and s.gid = any($2::bigint[]) and ls.status = 'live'
      order by s.started_at desc`,
    [lessonId, groups],
  );
  return rows;
}

async function enterLive(c, deps, claims, lessonId, target) {
  const { encKey, log } = deps;
  const { playerId, token, nick } = await joinLivePlayer(c, target.pin, claims);
  const attempt = await createAttempt(c, { subjectId: claims.sub, lessonId, kind: 'live', sessionId: target.id });
  await c.query(
    `insert into lms_participants (session_id, role, subject_id, player_id, session_token_enc, crm_id, display_name, attempt_id)
     values ($1, 'student', $2, $3, $4, $5, $6, $7)`,
    [target.id, claims.sub, playerId, encryptText(encKey, token), claims.crmId, nick, attempt.id],
  );
  await bindToken(c, claims.jti, target.id);
  log.info({ sessionId: target.id, lessonId, attemptId: attempt.id }, "lms: o'quvchi jonli darsga qo'shildi");
  return studentPayload({ ...target, session_id: target.id, player_id: playerId, display_name: nick }, token, attempt, null);
}

async function enterSolo(c, deps, claims, lessonId) {
  const { attempt, session } = await createSoloAttempt(c, deps, claims, lessonId);
  await bindToken(c, claims.jti, attempt.session_id);
  deps.log.info({ lessonId, attemptId: attempt.id }, "lms: o'quvchi solo boshladi");
  return soloPayload(session, attempt, null);
}

// ============================================================ O'QUVCHI — kirish

/**
 * @param {{ pool, config, encKey, schoolApi, log }} deps
 * @param {import('./jwt.js').LiveClaims} claims
 * @param {{ lesson_id: string, session_id?: string }} body
 */
export async function joinStudent(deps, claims, body) {
  const { pool } = deps;
  const lessonId = body.lesson_id;

  return withTransaction(pool, async (c) => {
    await assertLessonKnown(c, lessonId);
    await lockStudentLesson(c, claims.sub, lessonId);
    const { boundSessionId } = await registerToken(c, claims);

    // 0) faol urinish
    const resumed = await resumeActive(c, deps, claims, lessonId, boundSessionId);
    if (resumed) return resumed;

    // 1) guruhlarida jonli sessiya
    const { groups, found } = await groupsFor(deps, c, claims);
    if (!found) throw forbidden("LMS'da profilingiz topilmadi. Administratorga murojaat qiling.");
    const sessions = await liveSessionsFor(c, lessonId, groups);
    if (sessions.length) {
      let target = sessions[0];
      if (sessions.length > 1) {
        if (!body.session_id) {
          return { choose: sessions.map((s) => ({ session_id: s.id, lesson_title: { uz: s.title_uz, ru: s.title_ru }, started_at: s.started_at })) };
        }
        target = sessions.find((s) => s.id === body.session_id);
        if (!target) throw notFound('Tanlangan sessiya topilmadi yoki yopilgan.');
      }
      if (boundSessionId && boundSessionId !== target.id) throw conflict(TOKEN_BOUND_ELSEWHERE);
      return enterLive(c, deps, claims, lessonId, target);
    }

    // 2) tugagan urinish → ko'rish rejimi
    const last = await latestFinishedAttempt(c, claims.sub, lessonId);
    if (last) return reviewPayload(last, await getProgress(c, last.id));

    // 3) solo
    return enterSolo(c, deps, claims, lessonId);
  });
}

/** Ko'rishdan yangi urinish. Jonli urinish faol bo'lsa — rad (dars ketmoqda). */
export async function restartStudent(deps, claims, lessonId) {
  const { pool } = deps;
  if (claims.role !== 'student') throw forbidden("Faqat o'quvchi uchun.");
  return withTransaction(pool, async (c) => {
    await assertLessonKnown(c, lessonId);
    await lockStudentLesson(c, claims.sub, lessonId);
    await registerToken(c, claims);
    const active = await activeAttempt(c, claims.sub, lessonId);
    if (active) {
      if (active.kind === 'live') {
        const part = await participationOf(c, active);
        if (part && part.lms_status === 'live' && part.live_status === 'live') {
          throw new AppError('live_attempt_active', 409, "Jonli dars davom etmoqda — qaytadan boshlash keyinroq.");
        }
        await finishAttempt(c, active.id, 'live_ended');
      } else {
        const fin = await finishAttempt(c, active.id, 'restarted');
        await closeSoloSession(c, fin, 'restarted');
      }
    }
    return enterSolo(c, deps, claims, lessonId);
  });
}

// ============================================================ ME (F5 / boshqa qurilma — yaratmaydi)

export async function whoAmI(deps, claims, lessonId) {
  const { pool, encKey } = deps;
  if (claims.role === 'mentor') {
    const { rows } = await pool.query(
      `select s.id, s.pin, s.gid, p.session_token_enc, ls.status as live_status
         from lms_sessions s
         join lms_participants p on p.session_id = s.id and p.role = 'mentor' and p.subject_id = $1
         join live_sessions ls on ls.pin = s.pin
        where s.mode = 'live' and s.status = 'live' and s.lesson_id = $2
        order by s.started_at desc limit 1`,
      [claims.sub, lessonId],
    );
    const s = rows[0];
    if (!s || s.live_status !== 'live') throw notFound("Ochiq sessiya yo'q.");
    return { mode: 'mentor', pin: s.pin, token: decryptText(encKey, s.session_token_enc), gid: Number(s.gid), session_id: s.id, resumed: true };
  }
  return withTransaction(pool, async (c) => {
    const active = await activeAttempt(c, claims.sub, lessonId, { lock: false });
    if (active) {
      const part = await participationOf(c, active);
      if (part && part.session_token_enc) {
        const tok = decryptText(encKey, part.session_token_enc);
        const prog = await getProgress(c, active.id);
        if (active.kind === 'solo') return soloPayload({ pin: part.pin, playerId: part.player_id, playerToken: tok, nickname: part.display_name }, active, prog);
        if (part.lms_status === 'live' && part.live_status === 'live') return studentPayload(part, tok, active, prog);
      }
    }
    const last = await latestFinishedAttempt(c, claims.sub, lessonId);
    if (last) return reviewPayload(last, await getProgress(c, last.id));
    throw notFound("Ochiq sessiya yo'q.");
  });
}
