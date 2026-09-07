// LMS-ko'prik marshrutlari — prefiks /api/v1 (hammasi Authorization: Bearer <liveToken>)
//   POST /lms/join      { lesson_id, lesson_version?, answer_key?, session_id? } → mentor | student | solo | review | choose
//   POST /lms/restart   { lesson_id }                       → yangi solo urinish (ko'rishdan «Qaytadan boshlash»)
//   GET  /lms/me?lesson_id=…                                → bor holatni qaytaradi, yaratmaydi
//   PUT  /me/progress   { lesson_id, attempt_id, screen, total, answers, earned, started_at_ms, client_ts }
//   GET  /me/progress?lesson_id=…                           → { attempt, progress }
// Ko'prik sozlanmagan bo'lsa (dev) → 503 lms_bridge_disabled; dars PIN-yo'lida ishlayveradi.
import { AppError, unauthorized, notFound, forbidden } from '../../lib/errors.js';
import { LESSON_ID } from '../live/rpc-registry.js';
import { createVerifier, TokenError } from './jwt.js';
import { createSchoolApi } from './school-api.js';
import { loadEncKey } from '../../lib/crypto.js';
import { joinMentor, joinStudent, restartStudent, whoAmI } from './join-service.js';
import { activeAttempt, latestFinishedAttempt, getProgress, putProgress, progressPayload, attemptPayload } from './progress-service.js';
import { withTransaction } from '../../db/pool.js';

const KEYS_SCHEMA = {
  type: 'object',
  minProperties: 1,
  maxProperties: 500,
  propertyNames: { pattern: '^[A-Za-z0-9._-]{1,64}$' },
  additionalProperties: { type: 'integer', minimum: -1, maximum: 99 },
};
const UUID = { type: 'string', format: 'uuid' };

/** @param {import('fastify').FastifyInstance} app @param {{ fetchImpl?: typeof fetch }} opts */
export async function lmsRoutes(app, opts = {}) {
  const { config } = app;

  if (!config.lmsBridgeEnabled) {
    app.log.warn("LMS-ko'prik o'chiq: CODDYCAMP_* / TOKEN_ENC_KEY berilmagan — /lms/* va /me/* 503 qaytaradi");
    const disabled = async () => { throw new AppError('lms_bridge_disabled', 503, 'LMS ulanishi bu serverda sozlanmagan.'); };
    app.post('/lms/join', disabled);
    app.post('/lms/restart', disabled);
    app.get('/lms/me', disabled);
    app.put('/me/progress', disabled);
    app.get('/me/progress', disabled);
    return;
  }

  const verify = createVerifier(config.jwt);
  const deps = {
    pool: app.db,
    config,
    log: app.log,
    encKey: loadEncKey(config.tokenEncKey),
    schoolApi: opts.schoolApi || createSchoolApi({
      baseUrl: config.schoolApiUrl,
      contextToken: config.contextApiToken,
      resultsToken: config.resultsApiToken,
      fetchImpl: opts.fetchImpl,
      timeoutMs: config.schoolApiTimeoutMs,
      log: app.log,
    }),
  };

  async function requireLiveToken(req) {
    const h = req.headers.authorization;
    if (typeof h !== 'string' || !h.startsWith('Bearer ')) throw unauthorized('Kirish tokeni berilmagan.');
    try {
      req.claims = await verify(h.slice(7).trim());
    } catch (e) {
      if (e instanceof TokenError) req.log.info({ reason: e.reason }, 'lms: token rad etildi');
      throw e;
    }
  }

  // Sinf bitta NAT ortida: kirish 120/min/IP; progress (har 2 s debounce × 30 o'quvchi) 2000/min/IP. RATE_LIMIT_SCALE bilan.
  const scale = config.rateLimitScale || 1;
  const JOIN_LIMIT = { rateLimit: { max: 120 * scale, timeWindow: '1 minute' } };
  const PROGRESS_LIMIT = { rateLimit: { max: 2000 * scale, timeWindow: '1 minute' } };

  app.post('/lms/join', {
    preHandler: requireLiveToken,
    config: JOIN_LIMIT,
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['lesson_id'],
        properties: {
          lesson_id: LESSON_ID,
          lesson_version: { type: 'string', maxLength: 32 },
          answer_key: KEYS_SCHEMA,
          session_id: UUID,
        },
      },
    },
  }, async (req) => {
    const { claims } = req;
    if (claims.role === 'mentor') return joinMentor(deps, claims, req.body);
    return joinStudent(deps, claims, req.body);
  });

  app.post('/lms/restart', {
    preHandler: requireLiveToken,
    config: JOIN_LIMIT,
    schema: { body: { type: 'object', additionalProperties: false, required: ['lesson_id'], properties: { lesson_id: LESSON_ID } } },
  }, async (req) => restartStudent(deps, req.claims, req.body.lesson_id));

  app.get('/lms/me', {
    preHandler: requireLiveToken,
    config: JOIN_LIMIT,
    schema: { querystring: { type: 'object', additionalProperties: false, required: ['lesson_id'], properties: { lesson_id: LESSON_ID } } },
  }, async (req) => whoAmI(deps, req.claims, req.query.lesson_id));

  // ---- Progress (faqat o'quvchi, faqat o'z faol urinishi)
  app.put('/me/progress', {
    preHandler: requireLiveToken,
    config: PROGRESS_LIMIT,
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['lesson_id', 'attempt_id', 'screen', 'client_ts'],
        properties: {
          lesson_id: LESSON_ID,
          attempt_id: UUID,
          screen: { type: 'integer', minimum: 0, maximum: 9999 },
          total: { type: 'integer', minimum: 1, maximum: 9999 },
          answers: { type: 'object' },
          earned: { type: 'array', maxItems: 200, items: { type: 'string', maxLength: 64 } },
          started_at_ms: { type: 'integer', minimum: 0 },
          client_ts: { type: 'integer', minimum: 0 },
        },
      },
    },
  }, async (req) => {
    const { claims, body } = req;
    if (claims.role !== 'student') throw forbidden("Progress faqat o'quvchi uchun.");
    return withTransaction(app.db, async (c) => {
      const { rows } = await c.query('select * from attempts where id = $1 and subject_id = $2 and lesson_id = $3 for update', [body.attempt_id, claims.sub, body.lesson_id]);
      const attempt = rows[0];
      if (!attempt) throw notFound('Urinish topilmadi.');
      const r = await putProgress(c, attempt, body);
      return { status: r.status, reached_end: r.reached_end, stale: r.stale, finish_reason: r.finish_reason ?? null, updated_at: r.progress.updatedAt };
    });
  });

  app.get('/me/progress', {
    preHandler: requireLiveToken,
    config: PROGRESS_LIMIT,
    schema: { querystring: { type: 'object', additionalProperties: false, required: ['lesson_id'], properties: { lesson_id: LESSON_ID } } },
  }, async (req) => {
    const { claims } = req;
    if (claims.role !== 'student') throw forbidden("Progress faqat o'quvchi uchun.");
    return withTransaction(app.db, async (c) => {
      const a = (await activeAttempt(c, claims.sub, req.query.lesson_id, { lock: false })) || (await latestFinishedAttempt(c, claims.sub, req.query.lesson_id));
      if (!a) throw notFound("Urinish yo'q.");
      return { attempt: attemptPayload(a), progress: progressPayload(await getProgress(c, a.id)) };
    });
  });
}
