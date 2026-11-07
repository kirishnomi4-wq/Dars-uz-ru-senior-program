// F-1106-01 (2026-11-06): prod navbatida 49 hodisa School API'dan 422 olgan (21.09–02.11).
// 1) yig'ishda `correct` kalitdan (urinish paytida kalit yo'q edi) · 2) jonlida bitta urinish · 3) answer = options[option]
// 4) admin POST /admin/api/results/rebuild — manual_review hodisani manbadan qayta yig'ish: dry (sukut) hech narsa
//    o'zgartirmaydi; haqiqiy — o'sha qator almashtiriladi (ixtiyoriy `_rN`), eski holat result_event_revisions'da;
//    tanga-qoidasi: boshqa hodisada natijasi yetkazilgan o'quvchi chiqadi; to'plamda eskisi oldin.
// Soxta School API prod'da ko'rilgan uch qoidani AYNAN tekshiradi.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi, TEST_MENTOR_CODE } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
const LESSON_NOKEY = 'pm-m1d2-v1'; // urinish paytida kaliti yo'q dars (prod: 8 hodisa)
let t;
const received = [];
let schoolMode = 'rules'; // rules — prod qoidalari · reject — har qanday natijaga 422 (eski hodisa yasash uchun)
const ctxFetch = fakeSchoolApi({ 5001: [881], 5002: [881], 5003: [881], 5004: [881], 5005: [882], 5006: [883] });

function schoolRules(p) {
  const errs = {};
  p.students.forEach((st, i) => (st.questions || []).forEach((q, j) => {
    const b = `students.${i}.questions.${j}`;
    if (p.mode === 'live' && q.attempts.length !== 1) errs[`${b}.attempts`] = ['Live mode permits exactly one attempt per question.'];
    q.attempts.forEach((a, k) => {
      if (Number.isInteger(q.correct_option) && a.correct !== (a.option === q.correct_option)) errs[`${b}.attempts.${k}.correct`] = ['The correct flag does not match the selected option.'];
      if (a.answer !== q.options[a.option]) errs[`${b}.attempts.${k}.answer`] = ['The answer must match options[option].'];
    });
  }));
  return errs;
}
async function fetchStub(url, init) {
  if (String(url).endsWith('/integrations/dars-platform/lesson-results')) {
    const payload = JSON.parse(init.body);
    received.push(payload);
    const headers = { 'content-type': 'application/json', 'x-request-id': `req-${received.length}` };
    const errs = schoolMode === 'reject' ? { total_questions: ['Validation failed'] } : schoolRules(payload);
    const ks = Object.keys(errs);
    if (ks.length) return new Response(JSON.stringify({ message: errs[ks[0]][0] + (ks.length > 1 ? ` (and ${ks.length - 1} more errors)` : ''), errors: errs }), { status: 422, headers });
    const n = payload.students.length;
    return new Response(JSON.stringify({ data: { event_id: payload.event_id, accepted: true, duplicate: false, students_received: n, students_accepted: n, students_rejected: 0, rejected_students: [] } }), { status: 201, headers });
  }
  return ctxFetch(url, init);
}

const ADMIN = { authorization: `Basic ${Buffer.from('admin:test-admin-parol-12').toString('base64')}` };
before(async () => {
  t = await makeTestApp({ ADMIN_USER: 'admin', ADMIN_PASSWORD: 'test-admin-parol-12', RESULT_DETAILS: 'a' }, { lms: true, fetchImpl: fetchStub });
  await t.seedCatalog([LESSON, LESSON_NOKEY]);
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, TEST_MENTOR_CODE, '{"s4":1,"s9":2}']);
});
after(async () => { await t?.close(); });

const join = (tok, body) => post(t.app, '/api/v1/lms/join', body, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const OPTS = ['A', 'B', 'C', 'D'];
const tx = (picked, qid = 's4') => ({ question: 'Internet nima?', options: OPTS, picked: OPTS[picked], correct: qid === 's9' ? 'C' : 'B', lang: 'uz' }); // F-1107-01: kalit bilan mos
const record = (pin, p, screen, qid, picked, elapsed, texts = tx(picked, qid)) => rpc('record_attempt', { p_pin: pin, p_player_id: p.playerId, p_token: p.playerToken, p_screen: screen, p_question_id: qid, p_picked: picked, p_elapsed_ms: elapsed, p_texts: texts });
const rebuild = (body) => post(t.app, '/admin/api/results/rebuild', body, ADMIN);
const row = async (id) => (await t.db.query('select * from result_events where event_id = $1', [id])).rows[0];
const eventOf = async (pin) => (await t.db.query(`select * from result_events where event_id like $1`, [`sess_${pin}%`])).rows[0];
const settle = async () => { await new Promise((r) => setTimeout(r, 300)); await t.app.results.runOnce(); };

let n = 0;
/** Jonli dars: plan = { sub: [[screen, qid, picked, elapsed], ...] } */
async function liveLesson(msub, gid, plan) {
  n++;
  const m = (await join(await mintToken({ role: 'mentor', sub: msub, gid, jti: `rb-m-${n}` }), { lesson_id: LESSON })).json();
  for (const [sub, steps] of Object.entries(plan)) {
    const s = (await join(await mintToken({ role: 'student', sub: Number(sub), name: `O${sub}`, jti: `rb-s-${n}-${sub}` }), { lesson_id: LESSON })).json();
    assert.equal(s.mode, 'student', `o'quvchi ${sub} jonli darsga kirdi`);
    for (const [screen, qid, picked, elapsed] of steps) await record(m.pin, s, screen, qid, picked, elapsed);
  }
  assert.equal((await rpc('end_session', { p_pin: m.pin, p_token: m.token })).statusCode, 204);
  await settle();
  return eventOf(m.pin);
}
const FULL = [[4, 's4', 1, 2000], [9, 's9', 2, 3000]];

test('1) kalitsiz yozilgan urinish (prod: «correct flag does not match») — yig\'ishda kalitdan: correct_answers ham tuzaladi', async () => {
  const tok = await mintToken({ role: 'student', sub: 5006, name: 'Solo', jti: 'rb-solo-1' });
  const s = (await join(tok, { lesson_id: LESSON_NOKEY })).json();
  assert.equal(s.mode, 'solo');
  assert.equal((await record(s.pin, s, 4, 's4', 3, 1000)).json(), 1);
  assert.equal((await record(s.pin, s, 4, 's4', 1, 2500)).json(), 2);
  const raw = (await t.db.query('select correct from answer_attempts where pin = $1 order by attempt_no', [s.pin])).rows.map((r) => r.correct);
  assert.deepEqual(raw, [false, false], 'urinish paytida kalit yo\'q — bazada ikkalasi false (prod holati)');
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON_NOKEY, TEST_MENTOR_CODE, '{"s4":1}']); // kalit keyin keldi
  const pr = await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON_NOKEY, attempt_id: s.attempt.id, screen: 21, total: 22, answers: {}, client_ts: 1 }, headers: { 'content-type': 'application/json', ...bearer(tok) } });
  assert.equal(pr.json().status, 'finished');
  await settle();
  const ev = (await t.db.query(`select * from result_events where mode = 'solo' and lesson_id = $1`, [LESSON_NOKEY])).rows[0];
  assert.equal(ev.status, 'delivered', ev.last_error);
  const q = ev.payload.students[0].questions[0];
  assert.deepEqual([q.correct_option, q.correct, q.solved, q.attempts.map((a) => [a.option, a.correct])], [1, false, true, [[3, false], [1, true]]]);
});

let liveId;
test('2) eski jonli hodisa manual_review → dry (sukut): hech narsa o\'zgarmaydi, natija ko\'rinadi', async () => {
  schoolMode = 'reject';
  // 5001 s4 ga ikki marta (prod: ≈25 daq keyin, elapsed kamaygan) — eski kod buni yuborib 422 olgan
  const ev = await liveLesson(301, 881, { 5001: [[4, 's4', 0, 4000], [4, 's4', 1, 900], [9, 's9', 2, 3000]], 5002: FULL });
  schoolMode = 'rules';
  assert.equal(ev.status, 'manual_review');
  liveId = ev.event_id;
  const sent = received.length;
  const r = await rebuild({ event_ids: [liveId], include_payload: true });
  assert.equal(r.statusCode, 200, r.body);
  const b = r.json();
  assert.deepEqual([b.dry, b.totals.events, b.totals.send, b.totals.error, b.totals.students], [true, 1, 1, 0, 2]);
  const x = b.results[0];
  assert.deepEqual([x.event_id, x.new_event_id, x.action, x.students_before, x.students_after, x.excluded, x.details_dropped], [liveId, liveId, 'send', 2, 2, [], null]);
  assert.ok(x.payload.students.every((s) => s.questions.every((q) => q.attempts.length === 1)), 'jonli: bitta urinish');
  assert.deepEqual(schoolRules(x.payload), {}, 'yangi payload School API qoidalaridan o\'tadi');
  const after = await row(liveId);
  assert.deepEqual([after.status, after.send_attempts, received.length], ['manual_review', ev.send_attempts, sent], 'dry — baza va yuborish o\'zgarmagan');
  assert.equal((await t.db.query('select count(*)::int as n from result_event_revisions')).rows[0].n, 0);
});

test('3) haqiqiy + suffix r1: o\'sha qator yangi id bilan → delivered; eski holat revisions\'da', async () => {
  const old = await row(liveId);
  const r = await rebuild({ event_ids: [liveId], dry: false, suffix: 'r1' });
  assert.equal(r.statusCode, 200, r.body);
  assert.deepEqual([r.json().results[0].action, r.json().results[0].new_event_id], ['send', `${liveId}_r1`]);
  assert.ok(!('payload' in r.json().results[0]), 'haqiqiy rejimda payload qaytmaydi');
  await settle();
  assert.equal(await row(liveId), undefined, 'eski id qolmadi (bitta sessiya — bitta qator)');
  const now = await row(`${liveId}_r1`);
  assert.equal(now.status, 'delivered', now.last_error);
  assert.equal(now.session_id, old.session_id);
  assert.equal(received.at(-1).event_id, `${liveId}_r1`);
  const rev = (await t.db.query('select * from result_event_revisions where event_id = $1', [liveId])).rows;
  assert.deepEqual([rev.length, rev[0].new_event_id, rev[0].old_status, rev[0].old_last_http_status, rev[0].reason], [1, `${liveId}_r1`, 'manual_review', 422, 'rebuild:F-1106-01']);
  assert.deepEqual(rev[0].old_payload, old.payload);
  // takror chaqiruv: endi delivered — tegilmaydi
  const again = (await rebuild({ event_ids: [`${liveId}_r1`], dry: false })).json().results[0];
  assert.deepEqual([again.action, again.error], ['error', 'status:delivered']);
});

test('4) tanga-qoidasi: o\'quvchining natijasi keyingi darsda yetkazilgan → chiqariladi; hamma chiqsa — skipped', async () => {
  schoolMode = 'reject';
  const first = await liveLesson(302, 882, { 5005: FULL }); // 1-dars: 422
  schoolMode = 'rules';
  assert.equal(first.status, 'manual_review');
  const second = await liveLesson(303, 882, { 5005: FULL }); // 2-dars: yetkazildi (manual_review to'smaydi)
  assert.equal(second.status, 'delivered', second.last_error);
  const dry = (await rebuild({ event_ids: [first.event_id] })).json().results[0];
  assert.deepEqual([dry.action, dry.excluded, dry.students_after], ['skip', [5005], 0]);
  const real = (await rebuild({ event_ids: [first.event_id], dry: false })).json().results[0];
  assert.equal(real.action, 'skip');
  const r = await row(first.event_id);
  assert.deepEqual([r.status, r.last_error], ['skipped', 'already_rewarded (rebuild)']);
});

test('5) to\'plam: eskisi oldin; dry ham to\'plam ichidagi takrorni ko\'radi; haqiqiy ham shunday', async () => {
  schoolMode = 'reject';
  const a = await liveLesson(304, 881, { 5003: FULL, 5004: FULL });
  const b = await liveLesson(305, 881, { 5003: FULL });
  schoolMode = 'rules';
  assert.deepEqual([a.status, b.status], ['manual_review', 'manual_review']);
  const dry = (await rebuild({ event_ids: [b.event_id, a.event_id] })).json(); // teskari tartibda berildi
  assert.deepEqual(dry.results.map((x) => [x.event_id, x.action, x.excluded]), [[a.event_id, 'send', []], [b.event_id, 'skip', [5003]]]);
  const real = (await rebuild({ event_ids: [b.event_id, a.event_id], dry: false })).json();
  assert.deepEqual(real.results.map((x) => [x.event_id, x.action]), [[a.event_id, 'send'], [b.event_id, 'skip']]);
  await settle();
  assert.deepEqual([(await row(a.event_id)).status, (await row(b.event_id)).status], ['delivered', 'skipped']);
});

test('6) himoya: topilmagan / noto\'g\'ri suffix / auth yo\'q', async () => {
  assert.deepEqual((await rebuild({ event_ids: ['sess_000000_20260101T000000Z'] })).json().results[0].error, 'not_found');
  assert.equal((await rebuild({ event_ids: [liveId], suffix: 'x1' })).statusCode, 400);
  assert.equal((await rebuild({ event_ids: [] })).statusCode, 400);
  assert.equal((await post(t.app, '/admin/api/results/rebuild', { event_ids: [liveId] })).statusCode, 401);
});
