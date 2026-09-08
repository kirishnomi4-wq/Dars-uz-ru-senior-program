// Test-ilova: toza baza + buildApp (jim logger). Har test-fayl o'zinikini quradi va yopadi.
// LMS-ko'prik uchun: sinov secret/kalitlar, School API o'rnida fetch-stub, katalog seed, token-yasash.
import pino from 'pino';
import { SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';
import { freshDatabase } from './db.js';
import { loadConfig } from '../../src/config.js';
import { buildApp } from '../../src/app.js';
import { keyFromSecret } from '../../src/modules/lms/jwt.js';

export const TEST_MENTOR_CODE = 'TEST-CODE-2026';
export const TEST_JWT = Object.freeze({
  secret: 'base64:' + Buffer.from('test-secret-32-bytes-long-string!!').toString('base64'),
  secretNext: 'plain-utf8-secret-for-rotation-v2',
  issuer: 'coddycamp-lms',
  audience: 'dars-platform',
  keyId: 'v1',
  keyIdNext: 'v2',
});
export const TEST_ENC_KEY = Buffer.alloc(32, 7).toString('base64');

export const LMS_ENV = Object.freeze({
  CODDYCAMP_CONTEXT_API_TOKEN: 'sapi_' + 'c'.repeat(64),
  CODDYCAMP_RESULTS_API_TOKEN: 'sapi_' + 'r'.repeat(64),
  CODDYCAMP_LIVE_JWT_SECRET: TEST_JWT.secret,
  CODDYCAMP_LIVE_JWT_ISSUER: TEST_JWT.issuer,
  CODDYCAMP_LIVE_JWT_AUDIENCE: TEST_JWT.audience,
  CODDYCAMP_LIVE_JWT_KEY_ID: TEST_JWT.keyId,
  CODDYCAMP_LIVE_JWT_SECRET_NEXT: TEST_JWT.secretNext,
  CODDYCAMP_LIVE_JWT_KEY_ID_NEXT: TEST_JWT.keyIdNext,
  TOKEN_ENC_KEY: TEST_ENC_KEY,
  CONTEXT_CACHE_TTL_SECONDS: '300',
  LIVE_MENTOR_CODE: TEST_MENTOR_CODE,
});

/**
 * Sinov JWT. `over` bilan istalgan claim/sarlavhani buzish mumkin.
 * @param {{ role?: 'student'|'mentor', sub?: string|number, name?: string, gid?: number, crm_id?: number,
 *           ttl?: number, iat?: number, nbf?: number, jti?: string, iss?: string, aud?: string, kid?: string,
 *           alg?: string, typ?: string|null, secret?: string, extra?: object }} [o]
 */
export async function mintToken(o = {}) {
  const role = o.role ?? 'student';
  const now = Math.floor(Date.now() / 1000);
  const iat = o.iat ?? now;
  const ttl = o.ttl ?? 3600;
  const payload = { role, name: o.name ?? (role === 'mentor' ? 'Test Mentor' : 'Ali Valiyev'), jti: o.jti ?? randomUUID(), ...(o.extra || {}) };
  if (role === 'mentor') { if (o.gid !== null) payload.gid = o.gid ?? 861; }
  else if (o.crm_id !== null) payload.crm_id = o.crm_id ?? 17226;
  const header = { alg: o.alg ?? 'HS256', kid: o.kid ?? TEST_JWT.keyId };
  if (o.typ !== null) header.typ = o.typ ?? 'JWT';
  const secret = o.secret ?? (header.kid === TEST_JWT.keyIdNext ? TEST_JWT.secretNext : TEST_JWT.secret);
  const s = new SignJWT(payload).setProtectedHeader(header).setIssuedAt(iat).setExpirationTime(iat + ttl);
  if (o.iss !== null) s.setIssuer(o.iss ?? TEST_JWT.issuer);
  if (o.aud !== null) s.setAudience(o.aud ?? TEST_JWT.audience);
  if (o.sub !== null) s.setSubject(String(o.sub ?? (role === 'mentor' ? 145 : 34174)));
  if (o.nbf !== null) s.setNotBefore(o.nbf ?? iat);
  return s.sign(keyFromSecret(secret));
}

/** School API o'rnida: sub → guruhlar. `map[sub]` massiv bo'lsa 200, 'missing' bo'lsa 404, son bo'lsa shu HTTP kod. */
export function fakeSchoolApi(map, calls = []) {
  return async (url) => {
    const m = /\/lms\/students\/(\d+)\/integration-context$/.exec(String(url));
    const sub = m ? Number(m[1]) : NaN;
    calls.push(sub);
    const v = map[sub];
    if (v === undefined || v === 'missing') return new Response('{"message":"not found"}', { status: 404 });
    if (typeof v === 'number') return new Response('{"message":"err"}', { status: v, headers: v === 429 ? { 'retry-after': '7' } : {} });
    const subscriptions = v.map((gid, i) => ({ id: 900 + i, status: 'active', active: true, group: { id: gid, name: `G-${gid}`, status: 'active' } }));
    return new Response(JSON.stringify({ data: { student: { id: sub, active: true }, subscriptions } }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

/**
 * @param {Record<string,string>} [envOverrides]
 * @param {{ fetchImpl?: typeof fetch, lms?: boolean }} [opts]
 */
export async function makeTestApp(envOverrides = {}, opts = {}) {
  const db = await freshDatabase();
  await db.query(`insert into app_config (key, value) values ('mentor_code', $1)`, [TEST_MENTOR_CODE]);
  const config = loadConfig({
    DARS_ENV: 'test',
    DATABASE_URL: 'postgres://unused',
    CORS_ORIGINS: 'https://lms.coddycamp.uz',
    ...(opts.lms ? LMS_ENV : {}),
    ...envOverrides,
  });
  const app = await buildApp({ config, pool: db, logger: pino({ level: 'silent' }), version: '0.0.0+test', fetchImpl: opts.fetchImpl });
  await app.ready();
  return {
    app,
    db,
    async seedCatalog(ids, { achievements = [] } = {}) {
      for (const id of ids) await db.query(`insert into lesson_catalog (lesson_id, title_uz, title_ru, achievements) values ($1, $2, $3, $4::jsonb) on conflict do nothing`, [id, `Dars ${id}`, `Урок ${id}`, JSON.stringify(achievements)]);
    },
    async close() { await app.close(); await db.end(); },
  };
}

/** JSON so'rov qisqartmasi */
export const post = (app, url, payload, headers = {}) =>
  app.inject({ method: 'POST', url, payload, headers: { 'content-type': 'application/json', ...headers } });
export const bearer = (token) => ({ authorization: `Bearer ${token}` });
