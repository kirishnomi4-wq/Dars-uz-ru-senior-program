// Junior kursi — sinf aloqasi (18.11.2026). Prefiks: /api/v1
//   POST /junior/yubor  { pin, kim, token, x }   → 204        — xabar yozish (ustoz yoki o'quvchi)
//   POST /junior/oqi    { pin, kim, token, dan } → { n, x: [xabar…] } — `dan` dan keyingi xabarlar; dan = -1 → faqat n
// `kim`: 'ustoz' (token = mentor_token) yoki o'yinchi id'si (token = player token) — ikkalasi ham /lms/join javobidan.
// Ustoz hammaning xabarini oladi, o'quvchi faqat ustoznikini. Mantiq va kalit tekshiruvi — SQL'da (0019_junior_sinf.sql).
// Ikkala yo'l ham POST: kalit URL'ga (va server log'iga) tushmasin.
import { PIN } from '../live/rpc-registry.js';
import { AppError } from '../../lib/errors.js';

const TOKEN = { type: 'string', pattern: '^[0-9a-f]{32}$' };
const KIM = { type: 'string', pattern: '^(ustoz|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$' };
// Bitta xabar: bolaning bloklari ro'yxati eng kattasi (~1–2 KB). 16 KB — katta zaxira.
const XABAR_MAX = 16 * 1024;

// Sinf bitta NAT-IP ortida: o'quvchi ~1 s da so'raydi → 30 bola × 60 = 1800/min; bir maktabda bir necha guruh.
const OQI_PER_MIN = 6000;
const YUBOR_PER_MIN = 3000;

export async function juniorRoutes(app) {
  const scale = app.config.rateLimitScale || 1;

  app.post('/junior/yubor', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['pin', 'kim', 'token', 'x'],
        properties: { pin: PIN, kim: KIM, token: TOKEN, x: { type: 'object', maxProperties: 40 } },
      },
    },
    config: { rateLimit: { max: YUBOR_PER_MIN * scale, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const { pin, kim, token, x } = req.body;
    if (JSON.stringify(x).length > XABAR_MAX) throw new AppError('xabar_katta', 413, 'Xabar juda katta.');
    await app.db.query('select junior_yubor($1, $2, $3, $4::jsonb)', [pin, kim, token, JSON.stringify(x)]);
    return reply.code(204).send();
  });

  app.post('/junior/oqi', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['pin', 'kim', 'token', 'dan'],
        properties: { pin: PIN, kim: KIM, token: TOKEN, dan: { type: 'integer', minimum: -1 } },
      },
    },
    config: { rateLimit: { max: OQI_PER_MIN * scale, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const { pin, kim, token, dan } = req.body;
    const { rows } = await app.db.query('select n, xabar from junior_oqi($1, $2, $3, $4)', [pin, kim, token, dan]);
    reply.header('cache-control', 'no-store');
    const [bosh, ...qolgan] = rows;
    return { n: Number(bosh?.n ?? 0), x: qolgan.map((r) => r.xabar) };
  });
}

/** Davriy tozalash: 1 kundan eski Junior xabarlari (dars 90 daqiqa; hisoblagich sessiya bilan qoladi) */
export async function juniorTozalashJob(pool, log) {
  const { rowCount } = await pool.query(`delete from junior_xabarlar where at < now() - interval '1 day'`);
  if (rowCount > 0) log.info({ ochirildi: rowCount }, 'eski Junior xabarlari tozalandi');
  return rowCount;
}
