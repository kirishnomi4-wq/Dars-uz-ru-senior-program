// Navbat-ishchi: har tick'da (5 s) sweeper + kutilayotgan hodisalarni School API'ga yuboradi.
// Statuslar (LMS §8, §10): 201/200 → delivered (duplicate flag saqlanadi) · tarmoq/429/5xx → retry_wait (jadval retry.js) ·
// 401/403/409/422/404 → manual_review + Telegram. Loglarda: event_id, HTTP kod, X-Request-ID — payload/token YO'Q.
// Bitta jarayon; ustma-ust tick'lar `running` bilan to'siladi; qatorlar `for update skip locked` bilan olinadi.
import { sweepResults } from './result-service.js';
import { nextDelayMs, isRetryable, MAX_SEND_ATTEMPTS } from './retry.js';

/**
 * @param {{ pool: import('pg').Pool, log: import('pino').Logger, schoolApi: { submitLessonResult: Function },
 *           notify?: (text: string) => Promise<void>, batch?: number }} deps
 */
export function createResultWorker({ pool, log, schoolApi, notify, batch = 10, details = false }) {
  let running = false;
  const sweepOpts = { details: !!details };

  async function claimDue(client) {
    const { rows } = await client.query(
      `select event_id, payload, send_attempts, mode
         from result_events
        where status in ('pending', 'retry_wait') and next_try_at <= now()
        order by next_try_at asc
        limit $1
        for update skip locked`,
      [batch],
    );
    return rows;
  }

  async function markDelivered(client, ev, res) {
    await client.query(
      `update result_events set status = 'delivered', send_attempts = send_attempts + 1, last_http_status = $2, last_request_id = $3,
              response = $4::jsonb, last_error = null, delivered_at = now(), updated_at = now() where event_id = $1`,
      [ev.event_id, res.status, res.requestId, JSON.stringify(res.body ?? null)],
    );
    await client.query(`update attempts set result_event_id = $1 where id in (select attempt_id from result_events where event_id = $1 and attempt_id is not null)`, [ev.event_id]);
    const d = res.body?.data;
    log.info({ eventId: ev.event_id, status: res.status, requestId: res.requestId, duplicate: d?.duplicate, accepted: d?.students_accepted, rejected: d?.students_rejected }, 'natija yetkazildi');
    if (d?.students_rejected > 0) {
      await notify?.(`⚠️ Natija ${ev.event_id}: ${d.students_rejected} o'quvchi LMS'da topilmadi (rejected_students saqlandi).`);
    }
  }

  async function markRetry(client, ev, res, err) {
    const n = ev.send_attempts + 1;
    if (n >= MAX_SEND_ATTEMPTS) return markManual(client, ev, res, err || 'max_attempts');
    let delayMs = nextDelayMs(n);
    if (res?.status === 429) delayMs = Math.max(delayMs, (Number(res.retryAfter) || 30) * 1000);
    await client.query(
      `update result_events set status = 'retry_wait', send_attempts = $2, next_try_at = now() + ($3::int * interval '1 millisecond'),
              last_http_status = $4, last_request_id = $5, last_error = $6, updated_at = now() where event_id = $1`,
      [ev.event_id, n, delayMs, res?.status ?? null, res?.requestId ?? null, String(err || res?.status || 'retry').slice(0, 500)],
    );
    log.warn({ eventId: ev.event_id, status: res?.status ?? null, requestId: res?.requestId, attempt: n, delayMs }, 'natija qayta yuboriladi');
  }

  async function markManual(client, ev, res, err) {
    await client.query(
      `update result_events set status = 'manual_review', send_attempts = send_attempts + 1, last_http_status = $2, last_request_id = $3,
              response = $4::jsonb, last_error = $5, updated_at = now() where event_id = $1`,
      [ev.event_id, res?.status ?? null, res?.requestId ?? null, JSON.stringify(res?.body ?? null), String(err || res?.status || 'manual').slice(0, 500)],
    );
    log.error({ eventId: ev.event_id, status: res?.status ?? null, requestId: res?.requestId, err: String(err || '') }, 'natija manual_review');
    await notify?.(`🔴 Natija ${ev.event_id} → manual_review (HTTP ${res?.status ?? 'tarmoq'}${res?.requestId ? `, req ${res.requestId}` : ''}). ${String(err || '').slice(0, 120)}`);
  }

  async function sendOne(client, ev) {
    let res;
    try {
      res = await schoolApi.submitLessonResult(ev.payload);
    } catch (e) {
      return markRetry(client, ev, null, e?.message || 'network');
    }
    if (res.status === 200 || res.status === 201) return markDelivered(client, ev, res);
    if (isRetryable(res.status)) return markRetry(client, ev, res, res.body?.message);
    return markManual(client, ev, res, res.body?.message || `HTTP ${res.status}`);
  }

  /** Bitta tick: sweeper + due hodisalar. Test uchun ham chaqiriladi. */
  async function runOnce() {
    if (running) return { skipped: true };
    running = true;
    const out = { swept: null, sent: 0 };
    try {
      try { out.swept = await sweepResults(pool, log, sweepOpts); } catch (e) { log.error({ err: e }, 'sweeper xato'); }
      const client = await pool.connect();
      try {
        await client.query('begin');
        const due = await claimDue(client);
        for (const ev of due) { await sendOne(client, ev); out.sent++; }
        await client.query('commit');
      } catch (e) {
        await client.query('rollback').catch(() => {});
        log.error({ err: e }, 'natija-ishchi xato');
      } finally {
        client.release();
      }
      return out;
    } finally {
      running = false;
    }
  }

  let timer = null;
  return {
    runOnce,
    start(tickMs = 5000, initialDelayMs = 3000) {
      const first = setTimeout(() => { runOnce(); timer = setInterval(runOnce, tickMs); timer.unref(); }, initialDelayMs);
      first.unref();
      this._first = first;
    },
    stop() { clearTimeout(this._first); if (timer) clearInterval(timer); timer = null; },
    /** Admin: qayta navbatga (manual_review → pending) */
    async requeue(eventId) {
      const r = await pool.query(`update result_events set status = 'pending', next_try_at = now(), last_error = null, updated_at = now() where event_id = $1 and status <> 'delivered'`, [eventId]);
      return r.rowCount > 0;
    },
  };
}
