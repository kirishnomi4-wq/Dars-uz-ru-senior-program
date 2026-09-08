// Urinish (attempt) + server-progress + solo sessiya — o'quvchi-holat yadrosi (BACKEND_REJA §4.3, §6.3, §6.7).
// Hamma funksiya tranzaksiya-klient (c) bilan ishlaydi; chaqiruvchi withTransaction ichida.
import { AppError, conflict } from '../../lib/errors.js';
import { encryptText } from '../../lib/crypto.js';
import { nicknameFrom, nicknameVariant } from './names.js';

export const SOLO_AUTO_FINISH_DAYS = 7;
export const NAME_RETENTION_DAYS = 90;
const MAX_ANSWERS_BYTES = 48 * 1024;
const NAME_TAKEN_RE = /ism band/i;

/** Klientga ketadigan progress shakli (useServerProgress shuni o'qiydi). fresh=true → toza boshlash. */
export function progressPayload(row) {
  if (!row) return { screen: 0, total: null, answers: {}, earned: [], startedAt: null, updatedAt: null, fresh: true };
  return {
    screen: row.screen,
    total: row.total,
    answers: row.answers || {},
    earned: Array.isArray(row.earned) ? row.earned : [],
    startedAt: row.started_at_ms == null ? null : Number(row.started_at_ms),
    updatedAt: row.updated_at,
    fresh: false,
  };
}

export const attemptPayload = (a) => a ? ({ id: a.id, kind: a.kind, status: a.status, reached_end: a.reached_end, finished_at: a.finished_at, finish_reason: a.finish_reason }) : null;

export async function getProgress(c, attemptId) {
  const { rows } = await c.query('select * from student_progress where attempt_id = $1', [attemptId]);
  return rows[0] || null;
}

/** Faol urinish (qulflab) */
export async function activeAttempt(c, subjectId, lessonId, { lock = true } = {}) {
  const { rows } = await c.query(
    `select * from attempts where subject_id = $1 and lesson_id = $2 and status = 'active' ${lock ? 'for update' : ''}`,
    [subjectId, lessonId],
  );
  return rows[0] || null;
}

export async function latestFinishedAttempt(c, subjectId, lessonId) {
  const { rows } = await c.query(
    `select * from attempts where subject_id = $1 and lesson_id = $2 and status = 'finished' order by finished_at desc limit 1`,
    [subjectId, lessonId],
  );
  return rows[0] || null;
}

export async function finishAttempt(c, attemptId, reason) {
  const { rows } = await c.query(
    `update attempts set status = 'finished', finish_reason = $2, finished_at = now(), updated_at = now()
      where id = $1 and status = 'active' returning *`,
    [attemptId, reason],
  );
  return rows[0] || null;
}

export async function createAttempt(c, { subjectId, lessonId, kind, sessionId }) {
  const { rows } = await c.query(
    `insert into attempts (subject_id, lesson_id, kind, session_id) values ($1, $2, $3, $4) returning *`,
    [subjectId, lessonId, kind, sessionId],
  );
  return rows[0];
}

/** Jonli o'yinchi: ism JWT'dan; band bo'lsa «Ism 2», «Ism 3»… (savepoint — P0001 tranzaksiyani buzmasin) */
export async function joinLivePlayer(c, pin, claims) {
  const base = nicknameFrom(claims.name, claims.sub);
  for (let n = 1; n <= 6; n++) {
    const nick = nicknameVariant(base, n);
    await c.query('savepoint jp');
    try {
      const { rows } = await c.query('select * from join_session($1, $2)', [pin, nick]);
      await c.query('release savepoint jp');
      return { playerId: rows[0].player_id, token: rows[0].token, nick };
    } catch (e) {
      await c.query('rollback to savepoint jp');
      if (e.code === 'P0001' && NAME_TAKEN_RE.test(e.message)) continue;
      throw e;
    }
  }
  throw conflict("Bu ism bilan qo'shib bo'lmadi. Mentor bilan bog'laning.");
}

/**
 * Solo urinish: shaxsiy sessiya (o'sha SQL — server-ball ishlaydi), PIN yopiq (begona qo'shila olmaydi),
 * ishtirokchi + urinish yozuvi. Qaytaradi: { attempt, session: { pin, playerId, playerToken, nickname } }
 */
export async function createSoloAttempt(c, deps, claims, lessonId) {
  const { config, encKey } = deps;
  if (!config.liveMentorCode) throw new AppError('unavailable', 503, "Server sozlanmagan (mentor-kod yo'q).");
  const { rows: created } = await c.query('select * from create_session($1, $2)', [lessonId, config.liveMentorCode]);
  const { pin, token: mentorToken } = created[0];
  const { playerId, token, nick } = await joinLivePlayer(c, pin, claims);
  // PIN-yo'l bilan begona qo'shila olmasin: solo sessiya darhol «ended» (submit_answer holatga qaramaydi)
  await c.query(`update live_sessions set status = 'ended', updated_at = now() where pin = $1`, [pin]);
  const { rows: ls } = await c.query(
    `insert into lms_sessions (pin, lesson_id, mode, status) values ($1, $2, 'solo', 'live') returning id`,
    [pin, lessonId],
  );
  const sessionId = ls[0].id;
  const attempt = await createAttempt(c, { subjectId: claims.sub, lessonId, kind: 'solo', sessionId });
  await c.query(
    `insert into lms_participants (session_id, role, subject_id, player_id, session_token_enc, crm_id, display_name, attempt_id)
     values ($1, 'student', $2, $3, $4, $5, $6, $7)`,
    [sessionId, claims.sub, playerId, encryptText(encKey, token), claims.crmId, nick, attempt.id],
  );
  // mentor-token solo'da kerak emas, lekin sessiyani yopish uchun saqlaymiz (participants: role mentor yo'q — lms_sessions'da yetarli)
  await c.query(
    `insert into lms_participants (session_id, role, subject_id, session_token_enc) values ($1, 'mentor', $2, $3)`,
    [sessionId, claims.sub, encryptText(encKey, mentorToken)],
  );
  return { attempt, session: { pin, playerId, playerToken: token, nickname: nick } };
}

/** Solo sessiyani yopish (urinish tugaganda) */
export async function closeSoloSession(c, attempt, reason) {
  if (!attempt?.session_id) return;
  await c.query(
    `update lms_sessions set status = 'ended', end_reason = 'solo_done', finished_at = coalesce(finished_at, now()), updated_at = now()
      where id = $1 and status = 'live'`,
    [attempt.session_id],
  );
  void reason;
}

/**
 * Progress yozish. Tugagan urinishga → 409 attempt_finished. Eskirgan client_ts → jim (hozirgi holat qaytadi).
 * Solo: screen >= total-1 → urinish COMPLETED (foydalanuvchi qarori: solo tugashi = oxirgi ekran).
 * Live: reached_end belgilanadi, tugatish mentor/sessiya bilan.
 */
export async function putProgress(c, attempt, body) {
  if (attempt.status !== 'active') throw new AppError('attempt_finished', 409, 'Bu urinish yakunlangan. Qaytadan boshlash uchun «Qaytadan boshlash» ni bosing.');
  const answersJson = JSON.stringify(body.answers ?? {});
  if (Buffer.byteLength(answersJson, 'utf8') > MAX_ANSWERS_BYTES) throw new AppError('payload_too_large', 413, 'Javoblar hajmi juda katta.');

  const cur = await getProgress(c, attempt.id);
  const clientTs = Number.isFinite(body.client_ts) ? Math.trunc(body.client_ts) : 0;
  if (cur && clientTs < Number(cur.client_ts)) {
    return { status: attempt.status, reached_end: attempt.reached_end, stale: true, progress: progressPayload(cur) };
  }
  const { rows } = await c.query(
    `insert into student_progress (attempt_id, screen, total, answers, earned, started_at_ms, client_ts, updated_at)
     values ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, now())
     on conflict (attempt_id) do update set screen = excluded.screen, total = excluded.total, answers = excluded.answers,
       earned = excluded.earned, started_at_ms = excluded.started_at_ms, client_ts = excluded.client_ts, updated_at = now()
     returning *`,
    [attempt.id, body.screen, body.total ?? null, answersJson, JSON.stringify(Array.isArray(body.earned) ? body.earned : []), body.started_at_ms ?? null, clientTs],
  );
  const saved = rows[0];
  // Yutuq-vaqtlari (0005): earned ro'yxatidagi har yangi id birinchi ko'ringan paytida yoziladi (idempotent)
  // id kichik harfga keltiriladi: darslarda camelCase (`firstWin`) ko'p — cheklov [a-z0-9_-] (LMS'ga va'da qilingan qolip)
  const earnedIds = [...new Set((Array.isArray(body.earned) ? body.earned : []).map((x) => String(x).toLowerCase()))].filter((x) => /^[a-z0-9_-]{1,32}$/.test(x)).slice(0, 50);
  if (earnedIds.length) {
    await c.query(
      `insert into achievement_events (attempt_id, achievement_id) select $1, x from unnest($2::text[]) as x on conflict do nothing`,
      [attempt.id, earnedIds],
    );
  }
  const reachedEnd = Number.isInteger(body.total) && body.total > 0 && body.screen >= body.total - 1;
  let a = attempt;
  if (reachedEnd && !attempt.reached_end) {
    ({ rows: [a] } = await c.query('update attempts set reached_end = true, updated_at = now() where id = $1 returning *', [attempt.id]));
  }
  if (reachedEnd && attempt.kind === 'solo') {
    a = await finishAttempt(c, attempt.id, 'completed');
    await closeSoloSession(c, a, 'completed');
  }
  return { status: a.status, reached_end: a.reached_end, stale: false, progress: progressPayload(saved), finish_reason: a.finish_reason || null };
}
