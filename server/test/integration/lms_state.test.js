// O'quvchi-holat (HTTP): solo, server-progress, oxirgi ekranda tugash, ko'rish, qayta boshlash, jonli urinish yopilishi, xizmat-ishlar.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';
import { runLmsMaintenance } from '../../src/modules/lms/maintenance.js';
import pino from 'pino';

const LESSON = 'internet-01-v18';
const TOTAL = 22;
let t;
// sub → guruhlar: 2001/2002 → 861 (jonli sessiya bo'ladi), 2003 → 862 (dars yo'q → solo), 2004 → guruhsiz
const GROUPS = { 2001: [861], 2002: [861], 2003: [862], 2004: [] };

before(async () => {
  t = await makeTestApp({}, { lms: true, fetchImpl: fakeSchoolApi(GROUPS) });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });

const join = (token, body) => post(t.app, '/api/v1/lms/join', body, bearer(token));
const restart = (token, lessonId = LESSON) => post(t.app, '/api/v1/lms/restart', { lesson_id: lessonId }, bearer(token));
const putProgress = (token, body) => t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: body, headers: { 'content-type': 'application/json', ...bearer(token) } });
const getProgress = (token) => t.app.inject({ method: 'GET', url: `/api/v1/me/progress?lesson_id=${LESSON}`, headers: bearer(token) });
const me = (token) => t.app.inject({ method: 'GET', url: `/api/v1/lms/me?lesson_id=${LESSON}`, headers: bearer(token) });
const stu = (sub, o = {}) => mintToken({ role: 'student', sub, name: `O'quvchi ${sub}`, ...o });

let sobirTok, solo;
test('solo: guruhida jonli dars yo\'q → shaxsiy sessiya, o\'yinchi, PIN yopiq, urinish faol, progress toza', async () => {
  sobirTok = await stu(2003);
  const r = await join(sobirTok, { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  solo = r.json();
  assert.equal(solo.mode, 'solo');
  assert.match(solo.pin, /^\d{6}$/);
  assert.match(solo.playerId, /^[0-9a-f-]{36}$/);
  assert.equal(solo.nickname, "O'quvchi 2003");
  assert.equal(solo.attempt.kind, 'solo');
  assert.equal(solo.attempt.status, 'active');
  assert.equal(solo.progress.fresh, true);
  // PIN bilan begona qo'shila olmaydi (live_sessions ended), lekin javob yozish ishlaydi (server-ball)
  const live = (await t.db.query('select status from live_sessions where pin = $1', [solo.pin])).rows[0];
  assert.equal(live.status, 'ended');
  const lms = (await t.db.query('select mode, status from lms_sessions where pin = $1', [solo.pin])).rows[0];
  assert.deepEqual(lms, { mode: 'solo', status: 'live' });
  const pinJoin = await post(t.app, '/api/v1/live/rpc/join_session', { p_pin: solo.pin, p_nickname: 'Begona' });
  assert.equal(pinJoin.statusCode, 400);
  await t.db.query('select set_quiz_keys($1, $2, $3)', [LESSON, 'TEST-CODE-2026', '{"s4":1}']);
  const ans = await post(t.app, '/api/v1/live/rpc/submit_answer', { p_pin: solo.pin, p_player_id: solo.playerId, p_token: solo.playerToken, p_screen: 4, p_question_id: 's4', p_picked: 1, p_correct: false, p_elapsed_ms: 900 });
  assert.equal(ans.statusCode, 200);
  assert.equal(ans.json(), true);
  const row = (await t.db.query('select correct from live_answers where player_id = $1', [solo.playerId])).rows[0];
  assert.equal(row.correct, true);
});

test('solo: qayta kirish (yangi jti) → o\'sha urinish/o\'yinchi; me ham shuni beradi', async () => {
  const r = await join(await stu(2003), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().mode, 'solo');
  assert.equal(r.json().playerId, solo.playerId);
  assert.equal(r.json().attempt.id, solo.attempt.id);
  const m = await me(await stu(2003));
  assert.equal(m.statusCode, 200);
  assert.equal(m.json().mode, 'solo');
  assert.equal(m.json().attempt.id, solo.attempt.id);
});

test('progress PUT: yoziladi, eskirgan client_ts e\'tiborsiz, GET qaytaradi, boshqa o\'quvchi urinishi → 404', async () => {
  const base = { lesson_id: LESSON, attempt_id: solo.attempt.id, total: TOTAL, answers: { 4: { picked: 1, correct: true } }, earned: ['first_click'], started_at_ms: 1_700_000_000_000 };
  let r = await putProgress(sobirTok, { ...base, screen: 5, client_ts: 2000 });
  assert.equal(r.statusCode, 200, r.body);
  assert.deepEqual([r.json().status, r.json().reached_end, r.json().stale], ['active', false, false]);

  r = await putProgress(sobirTok, { ...base, screen: 1, client_ts: 1000 }); // eskirgan
  assert.equal(r.json().stale, true);
  const g = await getProgress(sobirTok);
  assert.equal(g.json().progress.screen, 5);
  assert.deepEqual(g.json().progress.answers, { 4: { picked: 1, correct: true } });
  assert.deepEqual(g.json().progress.earned, ['first_click']);
  assert.equal(g.json().progress.startedAt, 1_700_000_000_000);

  const other = await putProgress(await stu(2004), { ...base, screen: 2, client_ts: 3000 });
  assert.equal(other.statusCode, 404);
  const bad = await putProgress(sobirTok, { ...base, screen: 2, client_ts: 3000, extra: 1 });
  assert.equal(bad.statusCode, 400);
  const mentor = await putProgress(await mintToken({ role: 'mentor', sub: 145, gid: 861 }), { ...base, screen: 2, client_ts: 3000 });
  assert.equal(mentor.statusCode, 403);
});

test('solo: oxirgi ekran → urinish COMPLETED, sessiya yopildi; keyingi PUT → 409; join → ko\'rish rejimi (progress bilan)', async () => {
  const r = await putProgress(sobirTok, { lesson_id: LESSON, attempt_id: solo.attempt.id, screen: TOTAL - 1, total: TOTAL, answers: { 4: { picked: 1 } }, earned: ['graduate'], client_ts: 5000 });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().status, 'finished');
  assert.equal(r.json().finish_reason, 'completed');
  assert.equal(r.json().reached_end, true);
  const a = (await t.db.query('select status, finish_reason, reached_end from attempts where id = $1', [solo.attempt.id])).rows[0];
  assert.deepEqual(a, { status: 'finished', finish_reason: 'completed', reached_end: true });
  const s = (await t.db.query('select status, end_reason from lms_sessions where id = (select session_id from attempts where id = $1)', [solo.attempt.id])).rows[0];
  assert.deepEqual(s, { status: 'ended', end_reason: 'solo_done' });

  const again = await putProgress(sobirTok, { lesson_id: LESSON, attempt_id: solo.attempt.id, screen: 3, total: TOTAL, client_ts: 6000 });
  assert.equal(again.statusCode, 409);
  assert.equal(again.json().error, 'attempt_finished');

  const rv = await join(await stu(2003), { lesson_id: LESSON });
  assert.equal(rv.statusCode, 200);
  assert.equal(rv.json().mode, 'review');
  assert.equal(rv.json().attempt.id, solo.attempt.id);
  assert.equal(rv.json().progress.screen, TOTAL - 1);
  assert.deepEqual(rv.json().progress.earned, ['graduate']);
  const m = await me(await stu(2003));
  assert.equal(m.json().mode, 'review');
});

test('restart: yangi solo urinish, eskisi finished(restarted), progress toza; eski sessiya yopiq', async () => {
  // avval ko'rishdan restart (faol yo'q) — bo'ladi
  const r = await restart(await stu(2003));
  assert.equal(r.statusCode, 200, r.body);
  const s2 = r.json();
  assert.equal(s2.mode, 'solo');
  assert.notEqual(s2.attempt.id, solo.attempt.id);
  assert.notEqual(s2.pin, solo.pin);
  assert.equal(s2.progress.fresh, true);
  // faol solo'dan restart — eskisi 'restarted'
  const r2 = await restart(await stu(2003));
  assert.equal(r2.statusCode, 200);
  const prev = (await t.db.query('select status, finish_reason from attempts where id = $1', [s2.attempt.id])).rows[0];
  assert.deepEqual(prev, { status: 'finished', finish_reason: 'restarted' });
  const prevSess = (await t.db.query('select status from lms_sessions where id = (select session_id from attempts where id = $1)', [s2.attempt.id])).rows[0];
  assert.equal(prevSess.status, 'ended');
  const n = (await t.db.query(`select count(*)::int as n from attempts where subject_id = 2003 and status = 'active'`)).rows[0].n;
  assert.equal(n, 1);
});

let mentorS, aliTok, aliJoin;
test('live: jonli urinish; progress oxirgi ekran → reached_end, lekin faol qoladi (tugatish sessiya bilan)', async () => {
  const m = await join(await mintToken({ role: 'mentor', sub: 145, gid: 861, jti: 'st-m1' }), { lesson_id: LESSON });
  assert.equal(m.statusCode, 200, m.body);
  mentorS = m.json();
  aliTok = await stu(2001);
  const r = await join(aliTok, { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  aliJoin = r.json();
  assert.equal(aliJoin.mode, 'student');
  assert.equal(aliJoin.attempt.kind, 'live');
  assert.equal(aliJoin.progress.fresh, true);
  const p = await putProgress(aliTok, { lesson_id: LESSON, attempt_id: aliJoin.attempt.id, screen: TOTAL - 1, total: TOTAL, answers: {}, client_ts: 10 });
  assert.equal(p.statusCode, 200);
  assert.deepEqual([p.json().status, p.json().reached_end], ['active', true]);
  // restart jonli davomida → 409
  const rs = await restart(await stu(2001));
  assert.equal(rs.statusCode, 409);
  assert.equal(rs.json().error, 'live_attempt_active');
});

test('live: sessiya yopilgach qayta kirish → urinish live_ended → ko\'rish rejimi o\'sha progress bilan', async () => {
  await post(t.app, '/api/v1/live/rpc/end_session', { p_pin: mentorS.pin, p_token: mentorS.token });
  const r = await join(await stu(2001), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().mode, 'review');
  assert.equal(r.json().attempt.id, aliJoin.attempt.id);
  assert.equal(r.json().attempt.finish_reason, 'live_ended');
  assert.equal(r.json().progress.screen, TOTAL - 1);
});

test('guruhsiz o\'quvchi → solo (LMS token bor — dars ochiladi)', async () => {
  const r = await join(await stu(2004), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().mode, 'solo');
});

test('maintenance: 7 kunlik solo → auto_7d; jonli sessiyasi yopilgan live urinish → live_ended; 90 kun → ism o\'chadi', async () => {
  const log = pino({ level: 'silent' });
  // 2004 ning solo'sini 8 kun orqaga suramiz
  await t.db.query(`update attempts set started_at = now() - interval '8 days' where subject_id = 2004 and status = 'active'`);
  // 2002 jonli sessiyaga kiradi, keyin sessiya SQL bilan yopiladi (mentor yangi ochsin)
  const m = await join(await mintToken({ role: 'mentor', sub: 145, gid: 861, jti: 'st-m2' }), { lesson_id: LESSON });
  const r = await join(await stu(2002), { lesson_id: LESSON });
  assert.equal(r.json().mode, 'student');
  await t.db.query(`update lms_sessions set status = 'ended', end_reason = 'mentor', finished_at = now() where pin = $1`, [m.json().pin]);
  const out = await runLmsMaintenance(t.db, log);
  assert.ok(out.soloAuto >= 1, JSON.stringify(out));
  assert.ok(out.liveEnded >= 1, JSON.stringify(out));
  const a2004 = (await t.db.query(`select status, finish_reason from attempts where subject_id = 2004 order by started_at desc limit 1`)).rows[0];
  assert.deepEqual(a2004, { status: 'finished', finish_reason: 'auto_7d' });
  const a2002 = (await t.db.query(`select status, finish_reason from attempts where subject_id = 2002 order by started_at desc limit 1`)).rows[0];
  assert.deepEqual(a2002, { status: 'finished', finish_reason: 'live_ended' });
  // ismlar: 91 kun oldin tugagan deb belgilaymiz
  await t.db.query(`update attempts set finished_at = now() - interval '91 days' where subject_id = 2004 and status = 'finished'`);
  const out2 = await runLmsMaintenance(t.db, log);
  assert.ok(out2.namesPurged >= 1, JSON.stringify(out2));
  const p = (await t.db.query(`select display_name, name_purged_at from lms_participants where subject_id = 2004 and role = 'student' order by joined_at desc limit 1`)).rows[0];
  assert.equal(p.display_name, null);
  assert.ok(p.name_purged_at);
  // baza-gigiena: muddati 8 kun oldin o'tgan jti va 2 kunlik kontekst-kesh o'chadi, yangilari qoladi
  await t.db.query(`insert into lms_tokens (jti, role, subject_id, exp) values ('old-jti', 'student', 2004, now() - interval '8 days'), ('fresh-jti', 'student', 2004, now() + interval '1 hour')`);
  await t.db.query(`update context_cache set fetched_at = now() - interval '2 days' where subject_id = 2003`);
  const out3 = await runLmsMaintenance(t.db, log);
  assert.ok(out3.tokensPurged >= 1 && out3.contextPurged >= 1, JSON.stringify(out3));
  assert.equal((await t.db.query(`select count(*)::int as n from lms_tokens where jti in ('old-jti', 'fresh-jti')`)).rows[0].n, 1);
});
