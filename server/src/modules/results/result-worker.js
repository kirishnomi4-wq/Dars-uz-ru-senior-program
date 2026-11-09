// Navbat-ishchi: har tick'da (5 s) sweeper + kutilayotgan hodisalarni School API'ga yuboradi.
// Statuslar (LMS §8, §10): 201/200 → delivered (duplicate flag saqlanadi) · tarmoq/429/5xx → retry_wait (jadval retry.js) ·
// 401/403/409/422/404 → manual_review + Telegram. Loglarda: event_id, HTTP kod, X-Request-ID — payload/token YO'Q.
// Bitta jarayon; ustma-ust tick'lar `running` bilan to'siladi; qatorlar `for update skip locked` bilan olinadi.
import { sweepResults, rebuildEvents } from './result-service.js';
import { sweepV2, nextProcessingCheck, PROCESSING_REVIEW_MS, PROCESSING_WARN_MS } from './v2-service.js';
import { nextDelayMs, isRetryable, MAX_SEND_ATTEMPTS } from './retry.js';

/**
 * @param {{ pool: import('pg').Pool, log: import('pino').Logger, schoolApi: { submitLessonResult: Function, getLessonResult?: Function },
 *           notify?: (text: string) => Promise<void>, batch?: number, v2?: boolean }} deps
 *   v2 — F-1105-03 (25-kontrakt): sweepV2 (hodisalar + server yopishlari) va qo'llash kuzatuvi (processing) yoqiladi.
 */
export function createResultWorker({ pool, log, schoolApi, notify, batch = 10, details = false, liveRepeat = 'skip', v2 = false }) {
  let running = false;
  const sweepOpts = { details: !!details, liveRepeat };

  async function claimDue(client) {
    const { rows } = await client.query(
      `select event_id, payload, send_attempts, mode, schema_version
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
    const d = res.body?.data;
    if (ev.schema_version === 2) {
      // 25 §7: 201 = saqlandi + qabul qilindi; qo'llash holati (processing) alohida kuzatiladi. 200 = takror, saqlangan holat.
      const processing = ['queued', 'applied', 'failed'].includes(d?.processing) ? d.processing : 'queued';
      await client.query(
        `update result_events set status = 'delivered', send_attempts = send_attempts + 1, last_http_status = $2, last_request_id = $3,
                response = $4::jsonb, last_error = null, delivered_at = coalesce(delivered_at, now()), updated_at = now(),
                processing_status = $5, processing_next_at = case when $5 = 'queued' then now() + interval '1 minute' else null end,
                processing_checked_at = case when $5 = 'queued' then null else now() end,
                processing_response = case when $5 = 'queued' then null else $4::jsonb end
          where event_id = $1`,
        [ev.event_id, res.status, res.requestId, JSON.stringify(res.body ?? null), processing],
      );
      log.info({ eventId: ev.event_id, status: res.status, requestId: res.requestId, duplicate: d?.duplicate, processing }, 'v2 hodisa yetkazildi');
      if (processing === 'failed') await notify?.(`🔴 v2 ${ev.event_id}: School API qo'llay olmadi (${d?.error?.code || 'failed'}). ${String(d?.error?.message || '').slice(0, 120)}`);
      return;
    }
    await client.query(
      `update result_events set status = 'delivered', send_attempts = send_attempts + 1, last_http_status = $2, last_request_id = $3,
              response = $4::jsonb, last_error = null, delivered_at = now(), updated_at = now() where event_id = $1`,
      [ev.event_id, res.status, res.requestId, JSON.stringify(res.body ?? null)],
    );
    await client.query(`update attempts set result_event_id = $1 where id in (select attempt_id from result_events where event_id = $1 and attempt_id is not null)`, [ev.event_id]);
    log.info({ eventId: ev.event_id, status: res.status, requestId: res.requestId, duplicate: d?.duplicate, accepted: d?.students_accepted, rejected: d?.students_rejected }, 'natija yetkazildi');
    if (d?.students_rejected > 0) {
      await notify?.(`⚠️ Natija ${ev.event_id}: ${d.students_rejected} o'quvchi LMS'da topilmadi (rejected_students saqlandi).`);
    }
  }

  /**
   * v2 qo'llash kuzatuvi (25 §7): GET 1/5/15/60 daqiqada, so'ng soatlik, 24 soatgacha; 60 daqiqadan oshgan queued — ogohlantirish;
   * 24 soatdan keyin `review` (hodisa yo'qolmaydi, mas'ul ko'radi). GET javobi saqlanadi.
   */
  async function trackProcessing(client, now = new Date()) {
    if (!v2 || typeof schoolApi.getLessonResult !== 'function') return 0;
    const { rows } = await client.query(
      `select event_id, delivered_at, processing_next_at from result_events
        where schema_version = 2 and status = 'delivered' and processing_status = 'queued' and processing_next_at <= $1
        order by processing_next_at asc limit $2 for update skip locked`,
      [now, batch],
    );
    let n = 0;
    for (const ev of rows) {
      n++;
      let res;
      try { res = await schoolApi.getLessonResult(ev.event_id); } catch (e) { res = { status: null, body: null, error: e?.message }; }
      const d = res.status === 200 ? res.body?.data : null;
      const state = d?.processing;
      const ageMs = now.getTime() - new Date(ev.delivered_at).getTime();
      if (state === 'applied' || state === 'failed') {
        await client.query(
          `update result_events set processing_status = $2, processing_checked_at = now(), processing_next_at = null, processing_response = $3::jsonb, updated_at = now() where event_id = $1`,
          [ev.event_id, state, JSON.stringify(res.body ?? null)],
        );
        log.info({ eventId: ev.event_id, processing: state, coins: d?.coins, coinsReason: d?.coins_reason, classDone: d?.class_done, learnDone: d?.learn_done }, 'v2 qo\'llash holati');
        if (state === 'failed') await notify?.(`🔴 v2 ${ev.event_id}: qo'llash failed (${d?.error?.code || '?'}). ${String(d?.error?.message || '').slice(0, 120)}`);
        continue;
      }
      if (ageMs >= PROCESSING_REVIEW_MS) {
        await client.query(
          `update result_events set processing_status = 'review', processing_checked_at = now(), processing_next_at = null, processing_response = $2::jsonb, updated_at = now() where event_id = $1`,
          [ev.event_id, JSON.stringify(res.body ?? { error: res.error ?? null, status: res.status })],
        );
        log.error({ eventId: ev.event_id, status: res.status }, 'v2 qo\'llash 24 soatda tugamadi — review');
        await notify?.(`🟠 v2 ${ev.event_id}: 24 soatdan beri qo'llanmadi (processing ${state || res.status || 'javob yo\'q'}) — mas'ul tekshiruv ro'yxatiga o'tdi.`);
        continue;
      }
      const next = nextProcessingCheck(ev.delivered_at, now);
      const prevNext = new Date(ev.processing_next_at).getTime() - new Date(ev.delivered_at).getTime();
      await client.query(
        `update result_events set processing_checked_at = now(), processing_next_at = $2, processing_response = $3::jsonb, updated_at = now() where event_id = $1`,
        [ev.event_id, next, JSON.stringify(res.body ?? { error: res.error ?? null, status: res.status })],
      );
      if (prevNext < PROCESSING_WARN_MS && ageMs >= PROCESSING_WARN_MS) {
        log.warn({ eventId: ev.event_id, ageMin: Math.round(ageMs / 60_000) }, 'v2 qo\'llash 60 daqiqadan oshdi');
        await notify?.(`⚠️ v2 ${ev.event_id}: 60 daqiqadan beri processing=queued (School API). Kuzatuv davom etadi.`);
      }
    }
    return n;
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
    const out = { swept: null, sent: 0, v2: null, tracked: 0 };
    try {
      try { out.swept = await sweepResults(pool, log, sweepOpts); } catch (e) { log.error({ err: e }, 'sweeper xato'); }
      if (v2) { try { out.v2 = await sweepV2(pool, log); } catch (e) { log.error({ err: e }, 'v2 sweeper xato'); } }
      const client = await pool.connect();
      try {
        await client.query('begin');
        const due = await claimDue(client);
        for (const ev of due) { await sendOne(client, ev); out.sent++; }
        if (v2) { try { out.tracked = await trackProcessing(client); } catch (e) { log.error({ err: e }, 'v2 kuzatuv xato'); } }
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
    /** Admin (F-1106-01): manual_review hodisalarni manbadan yangi kod bilan qayta yig'ish. dry (sukut) — hech narsa o'zgarmaydi. */
    async rebuild(eventIds, { dry = true, suffix = null } = {}) {
      const results = await rebuildEvents(pool, log, eventIds, { dry, suffix, details: !!details });
      if (!dry && results.some((r) => r.action === 'send')) setTimeout(() => runOnce().catch(() => {}), 50);
      return results;
    },
    /** Admin: qayta navbatga (manual_review → pending) */
    async requeue(eventId) {
      const r = await pool.query(`update result_events set status = 'pending', next_try_at = now(), last_error = null, updated_at = now() where event_id = $1 and status <> 'delivered'`, [eventId]);
      return r.rowCount > 0;
    },
  };
}
