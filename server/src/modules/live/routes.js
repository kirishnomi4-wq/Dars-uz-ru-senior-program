// Jonli-API marshrutlari — Supabase REST/RPC o'rnini bosadi. Prefiks: /api/v1
//   POST /live/rpc/<fn>          — 10 ta SQL funksiya (allowlist, sxema, per-route limit)
//   GET  /live/session/:pin      — sessiya qatori (polling 2,5 s; ETag → 304)
//   GET  /live/players/:pin      — o'yinchilar (id, nickname, joined_at)
//   GET  /live/answers/:pin      — javoblar: ?screen=N | ?range=lesson (<100, default) | ?range=arena (>=100)
import { createHash } from 'node:crypto';
import { RPC, RPC_DEFAULT_LIMIT, PIN, sqlFor } from './rpc-registry.js';
import { notFound } from '../../lib/errors.js';

const SESSION_COLUMNS =
  'pin, lesson_id, cur_screen, max_screen, status, quiz_state, quiz_q, quiz_started_at, reveal_screen, created_at, updated_at';

// Sinf bitta NAT-IP ortida: 30 o'quvchi × 24 so'rov/daqiqa (2,5 s polling) = 720; katta maktabda 4 guruh bir vaqtda
// bitta IP'dan ≈ 3000 → o'qish limiti 6000/min (100/s, arzon so'rovlar). RATE_LIMIT_SCALE bilan ko'paytiriladi.
const READ_LIMIT_PER_MIN = 6000;

const etagOf = (row) => `W/"${createHash('sha1').update(JSON.stringify(row)).digest('hex').slice(0, 20)}"`;

export async function liveRoutes(app) {
  const scale = app.config.rateLimitScale || 1;
  const READ_LIMIT = { max: READ_LIMIT_PER_MIN * scale, timeWindow: '1 minute' };

  // ---- RPC: har funksiya alohida marshrut (aniq sxema + aniq limit; noma'lum nom → oddiy 404)
  for (const [fn, def] of Object.entries(RPC)) {
    const sql = sqlFor(fn, def);
    app.post(`/live/rpc/${fn}`, {
      schema: { body: def.body },
      config: { rateLimit: { max: (def.rateLimit?.max ?? RPC_DEFAULT_LIMIT) * scale, timeWindow: '1 minute' } },
    }, async (req, reply) => {
      const params = def.args.map((a) => (req.body[a] === undefined ? null : req.body[a]));
      const { rows } = await app.db.query(sql, params);
      // Mentor «Erkin qilish» / darsni tugatish — LMS sessiyasi bo'lsa: sabab 'mentor' (sweeper 'stale' deb yozmasin, F-0908-01)
      // va natija darhol navbatga (sweeper 5 s kutmasin)
      if (fn === 'end_session') {
        await app.db.query(`update lms_sessions set status = 'ended', end_reason = coalesce(end_reason, 'mentor'), finished_at = coalesce(finished_at, now()), updated_at = now() where pin = $1 and mode = 'live' and status = 'live'`, [req.body.p_pin]).catch((e) => req.log.warn({ err: e }, 'lms_sessions end_reason'));
        if (app.results) setTimeout(() => app.results.runOnce().catch(() => {}), 200);
      }
      if (def.returns === 'void') return reply.code(204).send();
      if (def.returns === 'scalar') return reply.send(rows[0]?.result ?? null);
      return reply.send(rows);
    });
  }

  // ---- Sessiya qatori (o'quvchi polling'i). ETag: qator o'zgarmagan bo'lsa 304 — tarmoq va JSON-parse tejaladi.
  app.get('/live/session/:pin', {
    schema: { params: { type: 'object', properties: { pin: PIN }, required: ['pin'] } },
    config: { rateLimit: READ_LIMIT },
  }, async (req, reply) => {
    const { rows } = await app.db.query(`select ${SESSION_COLUMNS} from live_sessions where pin = $1`, [req.params.pin]);
    if (!rows[0]) throw notFound('Bunday kod topilmadi');
    const row = rows[0];
    const etag = etagOf(row);
    reply.header('etag', etag).header('cache-control', 'no-cache'); // no-cache = har safar qayta so'raladi, lekin 304 bo'lsa tanasiz
    if (req.headers['if-none-match'] === etag) return reply.code(304).send();
    return row;
  });

  app.get('/live/players/:pin', {
    schema: { params: { type: 'object', properties: { pin: PIN }, required: ['pin'] } },
    config: { rateLimit: READ_LIMIT },
  }, async (req) => {
    const { rows } = await app.db.query(
      'select id, nickname, joined_at from live_players where pin = $1 order by joined_at asc',
      [req.params.pin],
    );
    return rows;
  });

  app.get('/live/answers/:pin', {
    schema: {
      params: { type: 'object', properties: { pin: PIN }, required: ['pin'] },
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          // query-string doim matn (ajv coerceTypes o'chiq) — shakl shu yerda, son handler'da
          screen: { type: 'string', pattern: '^[0-9]{1,4}$' },
          range: { type: 'string', enum: ['lesson', 'arena'] },
        },
      },
    },
    config: { rateLimit: READ_LIMIT },
  }, async (req) => {
    const { pin } = req.params;
    const { screen, range } = req.query;
    let where = 'screen_idx < 100';
    const params = [pin];
    if (screen !== undefined) { where = 'screen_idx = $2'; params.push(Number(screen)); }
    else if (range === 'arena') where = 'screen_idx >= 100';
    const { rows } = await app.db.query(
      `select player_id, screen_idx, picked, correct, elapsed_ms from live_answers where pin = $1 and ${where} order by answered_at asc`,
      params,
    );
    return rows;
  });
}
