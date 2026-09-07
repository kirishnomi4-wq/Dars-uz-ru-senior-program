import { test } from 'node:test';
import assert from 'node:assert/strict';
import pino from 'pino';
import { extractGroups, createSchoolApi } from '../../src/modules/lms/school-api.js';

const log = pino({ level: 'silent' });

test('extractGroups: faqat active/demo + active=true + guruh active (LMS §6-6)', () => {
  const body = { data: { subscriptions: [
    { status: 'active', active: true, group: { id: 17, status: 'active' } },
    { status: 'demo', active: true, group: { id: 18, status: 'active' } },
    { status: 'active', active: false, group: { id: 19, status: 'active' } },   // active=false
    { status: 'expired', active: true, group: { id: 20, status: 'active' } },   // status
    { status: 'active', active: true, group: { id: 21, status: 'archived' } },  // guruh yopiq
    { status: 'active', active: true, group: null },                              // guruh yo'q
    { status: 'active', active: true, group: { id: 17, status: 'active' } },    // takror
    null,
  ] } };
  assert.deepEqual(extractGroups(body), [17, 18]);
  assert.deepEqual(extractGroups({}), []);
  assert.deepEqual(extractGroups({ data: { subscriptions: 'x' } }), []);
});

const stub = (status, body = {}, headers = {}) => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

test('integrationContext: 200 → guruhlar; 404 → found=false', async () => {
  const api = createSchoolApi({ baseUrl: 'https://x', contextToken: 't', log, fetchImpl: stub(200, { data: { student: { active: true }, subscriptions: [{ status: 'active', active: true, group: { id: 5, status: 'active' } }] } }) });
  assert.deepEqual(await api.integrationContext(34174), { found: true, groups: [5], studentActive: true });
  const api404 = createSchoolApi({ baseUrl: 'https://x', contextToken: 't', log, fetchImpl: stub(404) });
  assert.deepEqual(await api404.integrationContext(1), { found: false, groups: [], studentActive: false });
});

test('integrationContext: 429 (Retry-After), 401, 500, tarmoq → 503 AppError', async () => {
  const cases = [
    [stub(429, {}, { 'retry-after': '9' }), 'school_api_rate_limited'],
    [stub(401), 'school_api_auth'],
    [stub(500), 'school_api_error'],
    [async () => { throw new TypeError('fetch failed'); }, 'school_api_unavailable'],
  ];
  for (const [fetchImpl, code] of cases) {
    const api = createSchoolApi({ baseUrl: 'https://x', contextToken: 't', log, fetchImpl });
    await assert.rejects(api.integrationContext(1), (e) => { assert.equal(e.code, code); assert.equal(e.statusCode, 503); if (code === 'school_api_rate_limited') assert.equal(e.details.retry_after, 9); return true; });
  }
});

test('integrationContext: token va URL to\'g\'ri yuboriladi', async () => {
  let seen;
  const api = createSchoolApi({ baseUrl: 'https://school-api.coddycamp.uz', contextToken: 'sapi_abc', log, fetchImpl: async (url, init) => { seen = { url, auth: init.headers.Authorization }; return new Response('{"data":{}}', { status: 200 }); } });
  await api.integrationContext(34174);
  assert.equal(seen.url, 'https://school-api.coddycamp.uz/api/v1/lms/students/34174/integration-context');
  assert.equal(seen.auth, 'Bearer sapi_abc');
});
