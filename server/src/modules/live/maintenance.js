// Davriy xizmat-ishlar (pg_cron o'rnini bosadi). Bitta jarayon = bitta baza, qulf shart emas.
// Har 15 daqiqa; birinchi yurish start'dan 1 daqiqa keyin (deploy paytida baza bandligi bilan to'qnashmasin).
// Ishlar ketma-ket, har biri o'z xatosini o'zi yutadi — bittasi yiqilsa qolgani ishlaydi.

/** Tashlandiq «live» sessiyalarni yopish (heartbeat 10 s; `minutes` jimlik = tashlandiq; default 30 — STALE_SESSION_MINUTES) */
export async function closeStaleSessionsJob(pool, log, minutes = 30) {
  const { rows } = await pool.query(`select close_stale_live_sessions(($1::int * interval '1 minute')) as n`, [minutes]);
  const n = rows[0]?.n ?? 0;
  if (n > 0) log.info({ closed: n, minutes }, 'tashlandiq jonli sessiyalar yopildi');
  return n;
}

/**
 * F-0911-01: jonli qatori yopilgan, ammo O'QUVCHISIZ qolgan `lms_sessions` abadiy «live» bo'lib turardi —
 * sweeper ularga tegmaydi (uning sharti: kamida bitta student ishtirokchi), shuning uchun admin panelidagi
 * «faol» hisoblagichi yolg'on ko'rsatardi. O'quvchisi borlarini sweeper yopadi (natija bilan birga) — bu ish
 * faqat bo'sh qolganlarini tozalaydi.
 */
export async function closeOrphanLmsSessionsJob(pool, log) {
  const { rowCount } = await pool.query(
    `update lms_sessions s
        set status = 'ended', end_reason = coalesce(s.end_reason, 'stale'), finished_at = coalesce(s.finished_at, now()), updated_at = now()
      from live_sessions ls
      where ls.pin = s.pin and s.mode = 'live' and s.status = 'live' and ls.status = 'ended'
        and not exists (select 1 from lms_participants p where p.session_id = s.id and p.role = 'student')`,
  );
  if (rowCount > 0) log.info({ closed: rowCount }, 'o\'quvchisiz qolgan LMS sessiyalari yopildi');
  return rowCount;
}

/**
 * @param {{ pool: import('pg').Pool, log: import('pino').Logger, jobs?: Array<{ name: string, run: (pool, log) => Promise<any> }>,
 *           intervalMs?: number, initialDelayMs?: number }} opts
 */
export function startMaintenance({ pool, log, jobs, intervalMs = 15 * 60_000, initialDelayMs = 60_000 }) {
  const list = jobs ?? [
    { name: 'close_stale_sessions', run: closeStaleSessionsJob },
    { name: 'close_orphan_lms_sessions', run: closeOrphanLmsSessionsJob },
  ];
  let running = false;
  let interval = null;

  const runOnce = async () => {
    if (running) return null;
    running = true;
    const results = {};
    try {
      for (const job of list) {
        try {
          results[job.name] = await job.run(pool, log);
        } catch (err) {
          results[job.name] = null;
          log.error({ err, job: job.name }, 'maintenance: ish yiqildi');
        }
      }
      return results;
    } finally {
      running = false;
    }
  };

  const first = setTimeout(() => {
    runOnce();
    interval = setInterval(runOnce, intervalMs);
    interval.unref();
  }, initialDelayMs);
  first.unref();

  return {
    runOnce,
    stop() { clearTimeout(first); if (interval) clearInterval(interval); },
  };
}
