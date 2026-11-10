// F-1105-03 S5: version_changed (25 §9, 16 §4.3) — eski tab o'z versiyasida davom (qoida 1); sahifa yangilanib yangi fayl
// ochilsa tugallanmagan solo urinish yopiladi → lr_ (version_changed, completed:false) + yangi urinish; eski attempt_id bilan
// boshqa versiyadagi progress → 409 version_changed (qoida 2); oldin yakunlangan urinish pasaytirilmaydi.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';
import { validateV2 } from '../../src/modules/results/v2-builder.js';

const LESSON = 'internet-01-v18';
let t;
const ctxFetch = fakeSchoolApi({ 9101: [], 9102: [], 9103: [], 9104: [], 9105: [9301], 9106: [] });
async function fetchStub(url, init) {
  const u = String(url);
  if (u.endsWith('/integrations/dars-platform/lesson-results') && init?.method === 'POST') {
    const payload = JSON.parse(init.body);
    const headers = { 'content-type': 'application/json', 'x-request-id': 'req-v' };
    if (payload.schema_version === 2) return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, processing: 'queued' } }), { status: 201, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({ RESULT_SCHEMA_V2: 'on' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', { lesson_id: LESSON, ...body }, bearer(tok));
const progress = (tok, attemptId, body) => t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: attemptId, screen: 3, total: 22, answers: {}, client_ts: Date.now(), ...body }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
const q = (sql, params) => t.db.query(sql, params);
const att = async (id) => (await q('select * from attempts where id = $1', [id])).rows[0];
const settle = async () => { await new Promise((r) => setTimeout(r, 300)); await t.app.results.runOnce(); await t.app.results.runOnce(); };

test('qoida 1: eski tab o\'z versiyasi bilan qayta kiradi / progress yozadi — urinish o\'sha, rad yo\'q', async () => {
  const tok = await mintToken({ role: 'student', sub: 9101, name: 'Bir', jti: 'vv-1a' });
  const s = (await join(tok, { lesson_version: 'v5' })).json();
  assert.equal(s.mode, 'solo');
  assert.equal((await progress(tok, s.attempt.id, { lesson_version: 'v5' })).statusCode, 200);
  const again = (await join(await mintToken({ role: 'student', sub: 9101, name: 'Bir', jti: 'vv-1b' }), { lesson_version: 'v5' })).json();
  assert.equal(again.attempt.id, s.attempt.id);
  // versiyasiz yuk (eski fayl) — dalil yo'q, tegilmaydi
  const old = (await join(await mintToken({ role: 'student', sub: 9101, name: 'Bir', jti: 'vv-1c' }), {})).json();
  assert.equal(old.attempt.id, s.attempt.id);
  assert.equal((await progress(tok, s.attempt.id, {})).statusCode, 200);
  assert.equal((await att(s.attempt.id)).status, 'active');
});

test('brauzer v4 bayrog\'i serverdan: join / restart / me javobida result_schema 2 (RESULT_SCHEMA_V2=on)', async () => {
  const tok = await mintToken({ role: 'student', sub: 9106, name: 'Olti', jti: 'vv-rs' });
  const s = (await join(tok, { lesson_version: 'v5' })).json();
  assert.equal(s.result_schema, 2, JSON.stringify(s));
  const me = await t.app.inject({ method: 'GET', url: `/api/v1/lms/me?lesson_id=${LESSON}`, headers: bearer(tok) });
  assert.equal(me.statusCode, 200, me.body);
  assert.equal(me.json().result_schema, 2);
  const tok2 = await mintToken({ role: 'student', sub: 9106, name: 'Olti', jti: 'vv-rs2' }); // restart — yangi sessiya, LMS yangi token beradi
  const rs = await post(t.app, '/api/v1/lms/restart', { lesson_id: LESSON, lesson_version: 'v5' }, bearer(tok2));
  assert.equal(rs.statusCode, 200, rs.body);
  assert.equal(rs.json().result_schema, 2);
});

test('qoida 2: eski attempt_id bilan boshqa versiyadagi progress → 409 version_changed, yozilmaydi', async () => {
  const tok = await mintToken({ role: 'student', sub: 9102, name: 'Ikki', jti: 'vv-2a' });
  const s = (await join(tok, { lesson_version: 'v5' })).json();
  assert.equal((await progress(tok, s.attempt.id, { screen: 4, lesson_version: 'v5' })).statusCode, 200);
  const r = await progress(tok, s.attempt.id, { screen: 9, lesson_version: 'v6' });
  assert.equal(r.statusCode, 409, r.body);
  assert.equal(r.json().error, 'version_changed', r.body);
  assert.equal((await q('select screen from student_progress where attempt_id = $1', [s.attempt.id])).rows[0].screen, 4);
  assert.equal((await att(s.attempt.id)).status, 'active', 'progress 409 urinishni yopmaydi (yopish — join)');
});

test('sahifa yangilandi, yangi fayl: eski solo → finished/version_changed, yangi urinish v6 (ko\'rish rejimi emas), lr_ completed:false', async () => {
  const tok = await mintToken({ role: 'student', sub: 9103, name: 'Uch', jti: 'vv-3a' });
  const s = (await join(tok, { lesson_version: 'v5' })).json();
  await q('select screen_open($1, $2, $3, 2, $4, true, 1)', [s.pin, s.playerId, s.playerToken, 's2']);
  assert.equal((await progress(tok, s.attempt.id, { screen: 6, lesson_version: 'v5' })).statusCode, 200);
  const n = (await join(await mintToken({ role: 'student', sub: 9103, name: 'Uch', jti: 'vv-3b' }), { lesson_version: 'v6' })).json();
  assert.equal(n.mode, 'solo', JSON.stringify(n));
  assert.notEqual(n.attempt.id, s.attempt.id);
  assert.equal(n.progress.fresh, true, 'ekran-o\'rni ko\'chirilmaydi');
  const a1 = await att(s.attempt.id), a2 = await att(n.attempt.id);
  assert.deepEqual([a1.status, a1.finish_reason, a2.status, a2.lesson_version, a2.version_source], ['finished', 'version_changed', 'active', 'v6', 'attempt']);
  assert.equal((await q('select status from lms_sessions where id = $1', [a1.session_id])).rows[0].status, 'ended');
  await settle();
  const lr = (await q('select * from result_events where event_id = $1', [`lr_${s.attempt.id}`])).rows[0];
  assert.ok(lr, 'eski urinish lr_');
  assert.deepEqual(validateV2(lr.payload), []);
  assert.deepEqual([lr.payload.result.trigger, lr.payload.result.completed, lr.payload.lesson_version, lr.payload.result.attempt_no], ['version_changed', false, 'v5', 1]);
  const v1 = (await q(`select count(*)::int as n from result_events where attempt_id = $1 and schema_version = 1`, [s.attempt.id])).rows[0].n;
  assert.equal(v1, 0, 'v1 solo hodisasi version_changed uchun yo\'q (faqat completed / auto_7d)');
  // yangi urinish oxirigacha → lr_ attempt_no 2, completed
  const pr = await progress(tok, n.attempt.id, { screen: 21, lesson_version: 'v6' });
  assert.equal(pr.json().status, 'finished');
  await settle();
  const lr2 = (await q('select payload from result_events where event_id = $1', [`lr_${n.attempt.id}`])).rows[0];
  assert.deepEqual([lr2.payload.result.trigger, lr2.payload.result.completed, lr2.payload.result.attempt_no, lr2.payload.lesson_version], ['reached_end', true, 2, 'v6']);
});

test('T dan oldingi (versiyasiz, unknown) urinish + yangi versiyali fayl → yopiladi; oldin yakunlangan urinish pasaytirilmaydi', async () => {
  const tok = await mintToken({ role: 'student', sub: 9104, name: 'To\'rt', jti: 'vv-4a' });
  const s = (await join(tok, {})).json();
  assert.equal((await att(s.attempt.id)).version_source, 'unknown');
  const n = (await join(await mintToken({ role: 'student', sub: 9104, name: 'To\'rt', jti: 'vv-4b' }), { lesson_version: 'v6' })).json();
  assert.notEqual(n.attempt.id, s.attempt.id);
  assert.equal((await att(s.attempt.id)).finish_reason, 'version_changed');
  // yakunlaydi, keyin v7 fayl bilan kiradi → ko'rish rejimi, yakunlangan urinish o'zgarmaydi
  assert.equal((await progress(tok, n.attempt.id, { screen: 21, lesson_version: 'v6' })).json().status, 'finished');
  const r = (await join(await mintToken({ role: 'student', sub: 9104, name: 'To\'rt', jti: 'vv-4c' }), { lesson_version: 'v7' })).json();
  assert.equal(r.mode, 'review');
  assert.equal(r.attempt.id, n.attempt.id);
  assert.deepEqual([(await att(n.attempt.id)).finish_reason], ['completed']);
});

test('jonli urinish versiya bilan almashtirilmaydi (sessiya versiyasi mentorniki); o\'quvchi boshqa versiya yuborsa ham davom', async () => {
  const m = (await join(await mintToken({ role: 'mentor', sub: 9201, gid: 9301, jti: 'vv-m' }), { lesson_version: 'v6' })).json();
  assert.equal(m.mode, 'mentor');
  const tok = await mintToken({ role: 'student', sub: 9105, name: 'Besh', jti: 'vv-5a' });
  const s = (await join(tok, { lesson_version: 'v7' })).json();
  assert.equal(s.mode, 'student', JSON.stringify(s));
  assert.equal((await att(s.attempt.id)).lesson_version, 'v6', 'jonli = sessiya versiyasi');
  const again = (await join(await mintToken({ role: 'student', sub: 9105, name: 'Besh', jti: 'vv-5b' }), { lesson_version: 'v7' })).json();
  assert.equal(again.attempt.id, s.attempt.id);
  assert.equal((await att(s.attempt.id)).status, 'active');
});
