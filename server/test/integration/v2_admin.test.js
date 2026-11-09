// F-1105-03 S6: admin — v2 hodisalar ko'rinishi (filtr, qo'llash holati), v2 qayta yig'ish (o'sha id, processed_at saqlanadi,
// revisions), sessiya sahifasida arena/screen_views/practice; admin HTML skripti buzilmagan.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
const ADMIN = { authorization: `Basic ${Buffer.from('admin:test-admin-parol-12').toString('base64')}` };
let t;
let mode422 = false;
const ctxFetch = fakeSchoolApi({ 9401: [] });
async function fetchStub(url, init) {
  const u = String(url);
  if (u.endsWith('/integrations/dars-platform/lesson-results') && init?.method === 'POST') {
    const payload = JSON.parse(init.body);
    const headers = { 'content-type': 'application/json', 'x-request-id': 'req-a' };
    if (payload.schema_version === 2) {
      if (mode422) return new Response(JSON.stringify({ message: 'validation' }), { status: 422, headers });
      return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, processing: 'queued' } }), { status: 201, headers });
    }
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  return ctxFetch(url, init);
}
before(async () => {
  t = await makeTestApp({ ADMIN_USER: 'admin', ADMIN_PASSWORD: 'test-admin-parol-12', RESULT_SCHEMA_V2: 'on' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const get = (url) => t.app.inject({ method: 'GET', url, headers: ADMIN });
const q = (sql, p) => t.db.query(sql, p);
const settle = async () => { await new Promise((r) => setTimeout(r, 300)); await t.app.results.runOnce(); await t.app.results.runOnce(); };

let lrId, attemptId, firstProcessedAt;

test('v2 hodisa 422 → manual_review; admin ro\'yxati schema=2 filtri bilan ko\'rsatadi', async () => {
  mode422 = true;
  const tok = await mintToken({ role: 'student', sub: 9401, name: 'Admin', jti: 'va-1' });
  const s = (await post(t.app, '/api/v1/lms/join', { lesson_id: LESSON, lesson_version: 'v6' }, bearer(tok))).json();
  attemptId = s.attempt.id; lrId = `lr_${attemptId}`;
  await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: attemptId, screen: 21, total: 22, answers: {}, client_ts: 1, lesson_version: 'v6' }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
  await settle();
  const e = (await q('select * from result_events where event_id = $1', [lrId])).rows[0];
  assert.equal(e.status, 'manual_review');
  firstProcessedAt = e.payload.result.processed_at;
  const list = (await get('/admin/api/results?schema=2&status=manual_review')).json();
  assert.ok(list.some((r) => r.event_id === lrId && r.event_type === 'lesson_result' && r.schema_version === 2 && r.student_id === '9401'));
  const v1 = (await get('/admin/api/results?schema=1')).json();
  assert.ok(v1.every((r) => r.schema_version === 1));
  assert.equal((await get('/admin/api/results?schema=3')).statusCode, 400);
  const ov = (await get('/admin/api/overview')).json();
  assert.ok(ov.attention.some((r) => r.event_id === lrId));
  assert.equal(typeof ov.v2_processing, 'object');
});

test('rebuild v2: dry → o\'zgarmaydi; real → o\'sha id, pending → delivered, processed_at saqlangan, revisions 1', async () => {
  mode422 = false;
  const dry = await t.app.inject({ method: 'POST', url: '/admin/api/results/rebuild', payload: { event_ids: [lrId] }, headers: { ...ADMIN, 'content-type': 'application/json' } });
  assert.equal(dry.statusCode, 200, dry.body);
  const d = dry.json();
  assert.deepEqual([d.dry, d.results[0].event_id, d.results[0].action, d.results[0].event_type], [true, lrId, 'send', 'lesson_result']);
  assert.equal((await q('select status from result_events where event_id = $1', [lrId])).rows[0].status, 'manual_review');
  const real = (await t.app.inject({ method: 'POST', url: '/admin/api/results/rebuild', payload: { event_ids: [lrId], dry: false, suffix: 'r1' }, headers: { ...ADMIN, 'content-type': 'application/json' } })).json();
  assert.equal(real.results[0].action, 'send');
  await settle();
  const e = (await q('select * from result_events where event_id = $1', [lrId])).rows[0];
  assert.deepEqual([e.status, e.processing_status, e.payload.result.processed_at], ['delivered', 'queued', firstProcessedAt]);
  const rev = (await q('select * from result_event_revisions where event_id = $1', [lrId])).rows;
  assert.deepEqual([rev.length, rev[0].new_event_id, rev[0].reason, rev[0].old_status], [1, lrId, 'rebuild:v2', 'manual_review']);
  // qayta: endi manual_review emas → xato
  const again = (await t.app.inject({ method: 'POST', url: '/admin/api/results/rebuild', payload: { event_ids: [lrId], dry: false }, headers: { ...ADMIN, 'content-type': 'application/json' } })).json();
  assert.equal(again.results[0].error, 'status:delivered');
  assert.ok((await get('/admin/api/results?processing=queued')).json().some((r) => r.event_id === lrId));
});

test('sessiya sahifasi: versiya, screen_views, practice, v2 hodisalar ustunlari', async () => {
  const sid = (await q('select session_id from attempts where id = $1', [attemptId])).rows[0].session_id;
  const r = (await get(`/admin/api/sessions/${sid}`)).json();
  const p = r.participants.find((x) => x.attempt_id === attemptId);
  assert.deepEqual([p.lesson_version, p.version_source, typeof p.screen_views, typeof p.practice_attempts], ['v6', 'attempt', 'number', 'number']);
  assert.ok('arena_started_at' in r.session && 'arena_end_reason' in r.session);
  assert.ok(r.results.some((x) => x.event_id === lrId && x.schema_version === 2 && x.event_type === 'lesson_result'));
});

test('admin HTML: ichki skript sintaksisi buzilmagan', async () => {
  const html = (await get('/admin/')).body;
  const js = /<script>([\s\S]*?)<\/script>/.exec(html)[1];
  assert.doesNotThrow(() => new Function(js));
  assert.match(js, /v2_processing/);
});
