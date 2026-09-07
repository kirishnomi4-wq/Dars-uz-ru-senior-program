// LMS xizmat-ishlari (har 15 daqiqa, live/maintenance.js orqali):
//  1) jonli sessiyasi yopilgan «live» urinishlar → finished (live_ended)
//  2) 7 kundan oshgan faol solo urinishlar → finished (auto_7d) + sessiyasi yopiladi (LMS'ga «boshladi, tugatmadi» ketadi — 4-bosqich)
//  3) 90 kundan oshgan tugagan urinishlarda ism o'chiriladi (display_name null) — saqlash muddati (§4.4)
import { SOLO_AUTO_FINISH_DAYS, NAME_RETENTION_DAYS } from './progress-service.js';

/** @param {import('pg').Pool} pool @param {import('pino').Logger} log */
export async function runLmsMaintenance(pool, log) {
  const out = { liveEnded: 0, soloAuto: 0, namesPurged: 0 };

  const r1 = await pool.query(
    `update attempts a set status = 'finished', finish_reason = 'live_ended', finished_at = now(), updated_at = now()
       from lms_sessions s
      where a.session_id = s.id and a.kind = 'live' and a.status = 'active' and s.status = 'ended'`,
  );
  out.liveEnded = r1.rowCount;

  const r2 = await pool.query(
    `with fin as (
       update attempts set status = 'finished', finish_reason = 'auto_7d', finished_at = now(), updated_at = now()
        where kind = 'solo' and status = 'active' and started_at < now() - ($1::int * interval '1 day')
        returning session_id
     )
     update lms_sessions s set status = 'ended', end_reason = 'solo_done', finished_at = coalesce(s.finished_at, now()), updated_at = now()
       from fin where s.id = fin.session_id and s.status = 'live'`,
    [SOLO_AUTO_FINISH_DAYS],
  );
  out.soloAuto = r2.rowCount;

  const r3 = await pool.query(
    `update lms_participants p set display_name = null, name_purged_at = now()
       from attempts a
      where p.attempt_id = a.id and p.display_name is not null and a.status = 'finished'
        and a.finished_at < now() - ($1::int * interval '1 day')`,
    [NAME_RETENTION_DAYS],
  );
  out.namesPurged = r3.rowCount;

  // 4) baza-gigiena: muddati o'tgan jti'lar (LMS §5.4: bog'lanish kamida exp'gacha saqlanadi — 7 kun zaxira bilan)
  //    va eskirgan kontekst-kesh (TTL 5 daqiqa; 1 kundan keyin keraksiz)
  const r4 = await pool.query(`delete from lms_tokens where exp < now() - interval '7 days'`);
  out.tokensPurged = r4.rowCount;
  const r5 = await pool.query(`delete from context_cache where fetched_at < now() - interval '1 day'`);
  out.contextPurged = r5.rowCount;

  if (out.liveEnded || out.soloAuto || out.namesPurged || out.tokensPurged || out.contextPurged) log.info(out, 'lms maintenance');
  return out;
}
