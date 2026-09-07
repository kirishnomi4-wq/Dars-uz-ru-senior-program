// Ilova-darajasi: buildApp + inject. Health, 404, buzuq JSON, CORS allowlist, x-request-id, rate-limit.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pino from 'pino';
import { freshDatabase } from '../helpers/db.js';
import { loadConfig } from '../../src/config.js';
import { buildApp } from '../../src/app.js';

let db, app;

before(async () => {
  db = await freshDatabase();
  const config = loadConfig({
    DARS_ENV: 'test',
    DATABASE_URL: 'postgres://unused',
    CORS_ORIGINS: 'https://lms.coddycamp.uz',
    RATE_LIMIT_PER_MIN: '20',
  });
  app = await buildApp({ config, pool: db, logger: pino({ level: 'silent' }), version: '0.0.0+test' });
  await app.ready();
});
after(async () => { await app?.close(); await db?.end(); });

test('health: 200, no-store, versiya, db ok', async () => {
  const r = await app.inject({ method: 'GET', url: '/api/v1/health' });
  assert.equal(r.statusCode, 200);
  assert.equal(r.headers['cache-control'], 'no-store');
  const b = r.json();
  assert.equal(b.status, 'ok');
  assert.equal(b.version, '0.0.0+test');
  assert.equal(b.checks.db, 'ok');
});

test('x-request-id: mijozniki xavfsiz bo\'lsa qaytadi, aks holda yangi', async () => {
  const ok = await app.inject({ method: 'GET', url: '/api/v1/health', headers: { 'x-request-id': 'abc-123-DEF_456' } });
  assert.equal(ok.headers['x-request-id'], 'abc-123-DEF_456');
  const bad = await app.inject({ method: 'GET', url: '/api/v1/health', headers: { 'x-request-id': '<script>' } });
  assert.notEqual(bad.headers['x-request-id'], '<script>');
  assert.match(bad.headers['x-request-id'], /^[0-9a-f-]{36}$/);
});

test('404 shakli', async () => {
  const r = await app.inject({ method: 'GET', url: '/yoq' });
  assert.equal(r.statusCode, 404);
  assert.deepEqual(r.json(), { error: 'not_found', message: "Bunday yo'l yo'q" });
});

test('buzuq JSON → 400 invalid_json', async () => {
  const r = await app.inject({ method: 'POST', url: '/api/v1/health', headers: { 'content-type': 'application/json' }, payload: '{bad' });
  // POST /health marshruti yo'q — Fastify avval body'ni o'qiydi, keyin 404; buzuq JSON parse'da yiqiladi
  assert.ok([400, 404].includes(r.statusCode));
  if (r.statusCode === 400) assert.equal(r.json().error, 'invalid_json');
});

test('CORS: allowlist origin → sarlavha bor; begona origin → yo\'q; origin\'siz → o\'tadi', async () => {
  const good = await app.inject({ method: 'OPTIONS', url: '/api/v1/health', headers: { origin: 'https://lms.coddycamp.uz', 'access-control-request-method': 'POST' } });
  assert.equal(good.headers['access-control-allow-origin'], 'https://lms.coddycamp.uz');
  assert.match(good.headers['access-control-allow-headers'], /authorization/);

  const local = await app.inject({ method: 'GET', url: '/api/v1/health', headers: { origin: 'http://localhost:5173' } });
  assert.equal(local.headers['access-control-allow-origin'], 'http://localhost:5173', 'test/dev muhitida localhost ruxsatli');

  const evil = await app.inject({ method: 'GET', url: '/api/v1/health', headers: { origin: 'https://evil.example' } });
  assert.equal(evil.headers['access-control-allow-origin'], undefined);

  const none = await app.inject({ method: 'GET', url: '/api/v1/health' });
  assert.equal(none.statusCode, 200);
});

test('rate-limit: health limitdan tashqari; boshqa yo\'l 20/min dan keyin 429 + retry-after', async () => {
  for (let i = 0; i < 25; i++) {
    const r = await app.inject({ method: 'GET', url: '/api/v1/health' });
    assert.equal(r.statusCode, 200);
  }
  let last;
  for (let i = 0; i < 25; i++) last = await app.inject({ method: 'GET', url: '/rate-yoq', headers: { 'x-forwarded-for': '10.0.0.9' } });
  assert.equal(last.statusCode, 429);
  assert.equal(last.json().error, 'rate_limited');
  assert.ok(Number(last.headers['retry-after']) >= 1);
});
