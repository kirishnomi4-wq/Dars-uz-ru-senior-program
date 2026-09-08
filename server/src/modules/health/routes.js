// GET /api/v1/health — UptimeRobot, Docker healthcheck, proksi va tools/staging-check.mjs uchun. Baza tekshiriladi; yiqilgan bo'lsa 503.
// Qo'shimcha (qabul-tekshiruv uchun, sir emas): server vaqti (JWT ±60 s), mijoz-IP proksi orqali to'g'ri kelyaptimi,
// migratsiya va katalog soni (eski image / seed yo'qligi), xususiyat-bayroqlari.
export async function healthRoutes(app) {
  app.get('/health', { config: { rateLimit: false } }, async (req, reply) => {
    const t0 = process.hrtime.bigint();
    let db = 'ok';
    let migrations = null;
    let catalog = null;
    try {
      await app.db.query('select 1');
      const { rows } = await app.db.query(
        `select (select count(*)::int from schema_migrations) as migrations,
                (select count(*)::int from lesson_catalog where active) as catalog`,
      ).catch(() => ({ rows: [{}] })); // jadval hali yo'q (migratsiyadan oldin) — health baribir javob beradi
      migrations = rows[0]?.migrations ?? null;
      catalog = rows[0]?.catalog ?? null;
    } catch (err) {
      db = 'fail';
      req.log.error({ err }, 'health: baza javob bermadi');
    }
    const dbMs = Number(process.hrtime.bigint() - t0) / 1e6;
    reply.header('cache-control', 'no-store').code(db === 'ok' ? 200 : 503);
    return {
      status: db === 'ok' ? 'ok' : 'degraded',
      env: app.config.env,
      version: app.appVersion,
      uptime_s: Math.round(process.uptime()),
      time: new Date().toISOString(),
      client: { ip: req.ip, forwarded: typeof req.headers['x-forwarded-for'] === 'string' },
      checks: { db, db_ms: Math.round(dbMs * 10) / 10, migrations, catalog },
      features: {
        lms_bridge: !!app.config.lmsBridgeEnabled,
        results_worker: !!app.config.resultsWorkerEnabled,
        result_details: app.config.resultDetails || 'off',
      },
    };
  });
}
