// Yagona xato-ishlov: har qanday xato bitta shaklda chiqadi — { error, message, details?, request_id? }.
// Tartib muhim: validatsiya → domen-xato → pg → Fastify'ning o'z 4xx → 500.
import fp from 'fastify-plugin';
import { AppError, fromPgError } from '../lib/errors.js';

const GENERIC_500 = "Serverda xato. Bir ozdan keyin qayta urinib ko'ring.";

function validationDetails(list) {
  return list.map((v) => {
    const where = v.instancePath ? v.instancePath.replace(/^\//, '').replace(/\//g, '.') : (v.params?.missingProperty ?? '');
    return `${where ? where + ': ' : ''}${v.message}`;
  });
}

export const errorHandlerPlugin = fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    // 1) JSON-schema (ajv) validatsiyasi
    if (err.validation) {
      return reply.code(400).send({
        error: 'validation_failed',
        message: "So'rov shakli noto'g'ri",
        details: validationDetails(err.validation),
      });
    }

    // 2) Bizning domen-xatolar
    if (err instanceof AppError) {
      if (err.statusCode >= 500) req.log.error({ err, code: err.code }, 'domen-xato 5xx');
      const body = { error: err.code, message: err.message };
      if (err.details !== undefined) body.details = err.details;
      return reply.code(err.statusCode).send(body);
    }

    // 3) PostgreSQL: PL/pgSQL `raise exception` xabari o'quvchiga mo'ljallangan → 400
    const pgMapped = fromPgError(err);
    if (pgMapped) {
      if (pgMapped.statusCode >= 500) req.log.warn({ err, code: err.code }, 'pg xato');
      return reply.code(pgMapped.statusCode).send({ error: pgMapped.code, message: pgMapped.message });
    }

    // 4) Fastify/plugin xatolari (buzuq JSON, juda katta body, rate-limit va h.k.)
    if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 500) {
      if (err.statusCode === 429) {
        return reply.code(429).send({ error: 'rate_limited', message: "Juda ko'p so'rov. Bir ozdan keyin qayta urinib ko'ring." });
      }
      if (err.statusCode === 413) {
        return reply.code(413).send({ error: 'payload_too_large', message: "So'rov hajmi juda katta" });
      }
      if (err.code === 'FST_ERR_CTP_INVALID_JSON_BODY' || err.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
        return reply.code(400).send({ error: 'invalid_json', message: "So'rov tanasi JSON emas" });
      }
      return reply.code(err.statusCode).send({ error: 'bad_request', message: "So'rov noto'g'ri" });
    }

    // 5) Qolgani — 500; tafsilot faqat log'da, mijozga request_id (qo'llab-quvvatlash uchun)
    req.log.error({ err }, 'kutilmagan xato');
    return reply.code(500).send({ error: 'internal_error', message: GENERIC_500, request_id: req.id });
  });

  // 404 ham limitga kiradi (yo'l-skanerlash botlari uchun) — rate-limit plagini oldin ro'yxatdan o'tgan bo'lsa
  const notFoundOpts = typeof app.rateLimit === 'function' ? { preHandler: app.rateLimit() } : {};
  app.setNotFoundHandler(notFoundOpts, (req, reply) => {
    reply.code(404).send({ error: 'not_found', message: "Bunday yo'l yo'q" });
  });
}, { name: 'error-handler' });
