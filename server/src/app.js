// Ilova-fabrika: buildApp({ config, pool, logger, version }) → Fastify nusxasi (listen qilinmagan).
// Testlar shu fabrikani chaqirib app.inject() bilan ishlaydi; index.js esa listen qiladi.
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'node:crypto';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { healthRoutes } from './modules/health/routes.js';
import { liveRoutes } from './modules/live/routes.js';
import { lmsRoutes } from './modules/lms/routes.js';
import { adminRoutes } from './modules/admin/routes.js';
import { createSchoolApi } from './modules/lms/school-api.js';
import { createNotifier } from './lib/notify.js';
import { createResultWorker } from './modules/results/result-worker.js';

const REQUEST_ID_RE = /^[A-Za-z0-9._-]{8,64}$/;

/**
 * CORS: faqat allowlist. Origin'siz so'rov (curl, server-to-server) brauzer emas — CORS tegishli emas, o'tkaziladi.
 * Dev/test'da localhost qo'shimcha ruxsatli. Ruxsat yo'q origin'ga sarlavha QO'YILMAYDI (brauzer o'zi bloklaydi).
 */
function corsOriginCheck(config) {
  const allow = new Set(config.corsOrigins);
  const localRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  return (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allow.has(origin)) return cb(null, true);
    if (!config.isProdLike && localRe.test(origin)) return cb(null, true);
    return cb(null, false);
  };
}

/**
 * @param {{ config: ReturnType<import('./config.js').loadConfig>, pool: import('pg').Pool,
 *           logger: import('pino').Logger, version: string }} deps
 */
export async function buildApp({ config, pool, logger, version, fetchImpl }) {
  const app = Fastify({
    loggerInstance: logger,
    trustProxy: config.trustProxy,
    // Mijoz bergan X-Request-ID faqat xavfsiz shaklda qabul qilinadi, aks holda o'zimizniki
    requestIdHeader: false,
    genReqId: (req) => {
      const h = req.headers['x-request-id'];
      return typeof h === 'string' && REQUEST_ID_RE.test(h) ? h : randomUUID();
    },
    // Eng katta so'rov — set_quiz_keys (bir necha KB). 64 KB — xavfsiz shift.
    bodyLimit: 64 * 1024,
    // Har so'rovni log'lamaymiz: polling 2,5 s × 300 o'quvchi = 120 qator/s — foydasiz va qimmat.
    // Kirish-log Caddy'da (polling yo'li istisno); ilova faqat voqea va xatolarni yozadi.
    disableRequestLogging: true,
    ajv: {
      customOptions: {
        removeAdditional: false, // ortiqcha maydon xato (jim tashlanmaydi)
        coerceTypes: false,      // "5" ≠ 5 — mijoz to'g'ri tur yuborsin
        allErrors: true,
        useDefaults: true,
      },
    },
  });

  app.decorate('config', config);
  app.decorate('db', pool);
  app.decorate('appVersion', version); // `version` nomi Fastify'ning o'zida band

  app.addHook('onRequest', async (req, reply) => {
    reply.header('x-request-id', req.id);
  });

  await app.register(cors, {
    origin: corsOriginCheck(config),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['content-type', 'authorization', 'if-match', 'if-none-match', 'x-request-id'],
    exposedHeaders: ['x-request-id', 'etag', 'retry-after'],
    maxAge: 600,
  });

  await app.register(rateLimit, {
    global: true,
    max: config.rateLimitPerMin,
    timeWindow: '1 minute',
    // trustProxy bilan req.ip = X-Forwarded-For dagi haqiqiy mijoz
    keyGenerator: (req) => req.ip,
    addHeadersOnExceeding: { 'x-ratelimit-limit': false, 'x-ratelimit-remaining': false, 'x-ratelimit-reset': false },
    addHeaders: { 'x-ratelimit-limit': false, 'x-ratelimit-remaining': false, 'x-ratelimit-reset': false, 'retry-after': true },
  });

  await app.register(errorHandlerPlugin);

  // LMS-ko'prik + natija-navbat — bitta School API mijozi, bitta ogohlantiruvchi, bitta ishchi (start index.js'da)
  let schoolApi = null;
  let results = null;
  if (config.lmsBridgeEnabled) {
    schoolApi = createSchoolApi({
      baseUrl: config.schoolApiUrl,
      contextToken: config.contextApiToken,
      resultsToken: config.resultsApiToken,
      fetchImpl,
      timeoutMs: config.schoolApiTimeoutMs,
      log: logger,
    });
    const notify = createNotifier({ botToken: config.telegramBotToken, chatId: config.telegramChatId, log: logger, env: config.env });
    results = createResultWorker({ pool, log: logger, schoolApi, notify });
  }
  app.decorate('schoolApi', schoolApi);
  app.decorate('results', results);

  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(liveRoutes, { prefix: '/api/v1' });
  await app.register(lmsRoutes, { prefix: '/api/v1', fetchImpl, schoolApi });
  await app.register(adminRoutes, { prefix: '/admin' });

  return app;
}
