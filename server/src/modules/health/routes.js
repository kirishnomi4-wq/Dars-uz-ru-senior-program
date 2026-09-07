// GET /api/v1/health — UptimeRobot, deploy.sh va Caddy uchun. Baza tekshiriladi; yiqilgan bo'lsa 503.
export async function healthRoutes(app) {
  app.get('/health', { config: { rateLimit: false } }, async (req, reply) => {
    const t0 = process.hrtime.bigint();
    let db = 'ok';
    try {
      await app.db.query('select 1');
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
      checks: { db, db_ms: Math.round(dbMs * 10) / 10 },
    };
  });
}
