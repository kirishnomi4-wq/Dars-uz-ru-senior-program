// Tanga-qoidasi, jonli tomon (F-0918-04): bir o'quvchi — bir dars — bitta natija.
// Oldin TUGALLANGAN natijasi bor o'quvchi yangi jonli hodisadan chiqariladi; hammasi takror bo'lsa hodisa 'skipped'.
// Uzilgan (completed=false) va LMS'ga yetmagan (manual_review) natija keyingi haqiqiy darsni TO'SMAYDI.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
let t;
const received = [];
let resultMode = 'ok'; // ok | 422
const ctxFetch = fakeSchoolApi({ 4001: [871], 4002: [871], 4003: [871], 4004: [871] });
async function fetchStub(url, init) {
  if (String(url).endsWith('/integrations/dars-platform/lesson-results')) {
    const payload = JSON.parse(init.body);
    received.push(payload);
    const headers = { 'content-type': 'application/json', 'x-request-id': `req-${received.length}` };
    if (resultMode === '422') return new Response(JSON.stringify({ message: 'Validation failed', errors: { x: ['bad'] } }), { status: 422, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  return ctxFetch(url, init);
}

before(async () => {
  t = await makeTestApp({}, { lms: true, fetchImpl: fetchStub }); // RESULT_LIVE_REPEAT berilmagan → 'skip' (prod xulqi)
  await t.seedCatalog([LESSON]);
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, TEST_MENTOR_CODE, '{"s4":1,"s9":2}']);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const answer = (pin, p, screen, qid, picked) => rpc('submit_answer', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_correct: false, p_elapsed_ms: 900 });
const eventOf = async (pin) => (await t.db.query(`select * from result_events where event_id like $1`, [`sess_${pin}%`])).rows[0];

let n = 0;
/** Bitta jonli dars: `plan` = { sub: 'full' | 'half' } — full = ikkala savolga javob (completed), half = bittasiga (uzilgan). */
async function runSession(msub, plan) {
  n++;
  const m = (await join(await mintToken({ role: 'mentor', sub: msub, gid: 871, jti: `rp-m-${n}` }), { lesson_id: LESSON })).json();
  for (const [sub, how] of Object.entries(plan)) {
    const s = (await join(await mintToken({ role: 'student', sub: Number(sub), name: `O${sub}`, jti: `rp-s-${n}-${sub}` }), { lesson_id: LESSON })).json();
    assert.equal(s.mode, 'student', `o'quvchi ${sub} jonli darsga kirdi`);
    await answer(m.pin, s, 4, 's4', 1);
    if (how === 'full') await answer(m.pin, s, 9, 's9', 2);
  }
  assert.equal((await rpc('end_session', { p_pin: m.pin, p_token: m.token })).statusCode, 204);
  await new Promise((res) => setTimeout(res, 300));
  await t.app.results.runOnce();
  return m.pin;
}

test('1-dars: 4001 to\'liq, 4002 uzilgan → ikkalasi ham ketadi (201)', async () => {
  const ev = await eventOf(await runSession(301, { 4001: 'full', 4002: 'half' }));
  assert.equal(ev.status, 'delivered', ev.last_error);
  assert.deepEqual(ev.payload.students.map((s) => [s.student_id, s.completed]), [[4001, true], [4002, false]]);
});

test('2-dars (mentor qayta o\'tdi): 4001 TAKROR → chiqariladi; 4002 (oldin uzilgan) va yangi 4003 ketadi', async () => {
  const before = received.length;
  const ev = await eventOf(await runSession(302, { 4001: 'full', 4002: 'full', 4003: 'full' }));
  assert.equal(ev.status, 'delivered', ev.last_error);
  assert.deepEqual(ev.payload.students.map((s) => s.student_id), [4002, 4003], '4001 ning tugallangan natijasi allaqachon yuborilgan');
  assert.equal(ev.students_count, 2);
  assert.equal(received.length, before + 1);
  assert.ok(!received.at(-1).students.some((s) => s.student_id === 4001), 'LMS 4001 ni ikkinchi marta olmadi');
  assert.ok(ev.payload.students.every((s) => Array.isArray(s.badges) && s.badges.length), 'qolganlarning nishonlari joyida');
});

test('3-dars: hamma takror → hodisa YUBORILMAYDI, yozuv «skipped»; sweeper qayta olmaydi', async () => {
  const before = received.length;
  const pin = await runSession(303, { 4001: 'full', 4002: 'full' });
  const ev = await eventOf(pin);
  assert.equal(ev.status, 'skipped');
  assert.equal(ev.last_error, 'already_rewarded');
  assert.equal(ev.students_count, 2, 'analitika uchun payload saqlanadi');
  assert.equal(received.length, before, 'School API\'ga hech narsa ketmadi');
  await t.app.results.runOnce();
  await t.app.results.runOnce();
  const { rows } = await t.db.query(`select count(*)::int as c from result_events where event_id like $1`, [`sess_${pin}%`]);
  assert.equal(rows[0].c, 1, 'idempotent');
  assert.equal(received.length, before);
});

test('LMS\'ga yetmagan natija (422 → manual_review) keyingi haqiqiy darsni TO\'SMAYDI', async () => {
  resultMode = '422';
  const ev1 = await eventOf(await runSession(304, { 4004: 'full' }));
  assert.equal(ev1.status, 'manual_review');
  resultMode = 'ok';
  const ev2 = await eventOf(await runSession(305, { 4004: 'full' }));
  assert.equal(ev2.status, 'delivered', ev2.last_error);
  assert.deepEqual(ev2.payload.students.map((s) => s.student_id), [4004]);
});
