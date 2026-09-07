// LMS-ko'prik (HTTP): mentor/o'quvchi join daraxti, jti bog'lash, resume, §6.6, me, xato holatlari.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
const OTHER = 'css-01-v18';
let t;
const calls = [];
// sub → guruhlar
const GROUPS = { 1001: [861], 1002: [861], 1003: [862], 1004: [861, 862], 1005: [], 1006: 'missing', 1007: 500 };

before(async () => {
  t = await makeTestApp({}, { lms: true, fetchImpl: fakeSchoolApi(GROUPS, calls) });
  await t.seedCatalog([LESSON, OTHER]);
});
after(async () => { await t?.close(); });

const join = async (token, body) => post(t.app, '/api/v1/lms/join', body, bearer(token));
const me = async (token, lessonId) => t.app.inject({ method: 'GET', url: `/api/v1/lms/me?lesson_id=${lessonId}`, headers: bearer(token) });
const mentorTok = (o = {}) => mintToken({ role: 'mentor', sub: 145, gid: 861, ...o });
const studentTok = (o = {}) => mintToken({ role: 'student', sub: 1001, name: 'Ali Valiyev', ...o });

test('token yo\'q → 401; buzuq → 401 invalid_token; sxema → 400', async () => {
  let r = await post(t.app, '/api/v1/lms/join', { lesson_id: LESSON });
  assert.equal(r.statusCode, 401);
  r = await join('abc.def.ghi', { lesson_id: LESSON });
  assert.equal(r.statusCode, 401);
  assert.equal(r.json().error, 'invalid_token');
  r = await join(await mentorTok(), { lesson_id: LESSON, extra: 1 });
  assert.equal(r.statusCode, 400);
  r = await join(await mentorTok(), {});
  assert.equal(r.statusCode, 400);
});

test('katalogda yo\'q dars → 404', async () => {
  const r = await join(await mentorTok(), { lesson_id: 'yoq-dars-v1' });
  assert.equal(r.statusCode, 404);
  assert.match(r.json().message, /katalogda/);
});

let s1; // birinchi mentor sessiyasi
test('mentor: sessiya ochiladi (pin/token), kalit yuklanadi, lms_sessions/participants/tokens yoziladi', async () => {
  const tok = await mentorTok({ jti: 'm-jti-1' });
  const r = await join(tok, { lesson_id: LESSON, lesson_version: 'v18', answer_key: { s4: 1, 'quiz-0': 2 } });
  assert.equal(r.statusCode, 200, r.body);
  s1 = r.json();
  assert.equal(s1.mode, 'mentor');
  assert.match(s1.pin, /^\d{6}$/);
  assert.match(s1.token, /^[0-9a-f]{32}$/);
  assert.equal(s1.gid, 861);
  assert.equal(s1.resumed, false);

  const ls = (await t.db.query('select * from lms_sessions where id = $1', [s1.session_id])).rows[0];
  assert.equal(ls.pin, s1.pin);
  assert.equal(Number(ls.gid), 861);
  assert.equal(Number(ls.teacher_id), 145);
  assert.equal(ls.mentor_jti, 'm-jti-1');
  assert.equal(ls.lesson_version, 'v18');
  const keys = (await t.db.query('select count(*)::int as n from quiz_keys where lesson_id = $1', [LESSON])).rows[0].n;
  assert.equal(keys, 2);
  const p = (await t.db.query(`select * from lms_participants where session_id = $1 and role = 'mentor'`, [s1.session_id])).rows[0];
  assert.ok(p.session_token_enc.startsWith('v1:'));
  assert.notEqual(p.session_token_enc, s1.token, 'token ochiq saqlanmasin');
  const tk = (await t.db.query('select * from lms_tokens where jti = $1', ['m-jti-1'])).rows[0];
  assert.equal(tk.session_id, s1.session_id);
});

test('mentor: o\'sha jti bilan qayta → o\'sha sessiya (idempotent)', async () => {
  const r = await join(await mentorTok({ jti: 'm-jti-1' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().pin, s1.pin);
  assert.equal(r.json().token, s1.token);
  assert.equal(r.json().resumed, true);
});

test('mentor: F5 — yangi jti, o\'sha o\'qituvchi → DAVOM (pin/token o\'sha)', async () => {
  const r = await join(await mentorTok({ jti: 'm-jti-2' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().pin, s1.pin);
  assert.equal(r.json().token, s1.token);
  assert.equal(r.json().resumed, true);
  const n = (await t.db.query(`select count(*)::int as n from lms_sessions where gid = 861 and lesson_id = $1 and status = 'live'`, [LESSON])).rows[0].n;
  assert.equal(n, 1);
});

test('me (mentor): ochiq sessiyani qaytaradi; boshqa dars uchun 404', async () => {
  const r = await me(await mentorTok({ jti: 'm-jti-3' }), LESSON);
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().pin, s1.pin);
  const r2 = await me(await mentorTok({ jti: 'm-jti-4' }), OTHER);
  assert.equal(r2.statusCode, 404);
});

let ali;
test('o\'quvchi: bitta sessiya → avto-kirish, ism JWT\'dan, liveStore shakli', async () => {
  const r = await join(await studentTok({ jti: 's-jti-1' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  ali = r.json();
  assert.equal(ali.mode, 'student');
  assert.equal(ali.pin, s1.pin);
  assert.match(ali.playerId, /^[0-9a-f-]{36}$/);
  assert.match(ali.playerToken, /^[0-9a-f]{32}$/);
  assert.equal(ali.nickname, 'Ali Valiyev');
  assert.equal(ali.lastScreen, 0);
  assert.equal(calls.filter((c) => c === 1001).length, 1, 'kontekst 1 marta so\'raldi');

  const pl = (await t.db.query('select nickname from live_players where id = $1', [ali.playerId])).rows[0];
  assert.equal(pl.nickname, 'Ali Valiyev');
  const p = (await t.db.query(`select * from lms_participants where session_id = $1 and role = 'student' and subject_id = 1001`, [s1.session_id])).rows[0];
  assert.equal(Number(p.crm_id), 17226);
  assert.equal(p.player_id, ali.playerId);
});

test('o\'quvchi: F5 — yangi jti → o\'sha o\'yinchi (kontekst qayta so\'ralmaydi)', async () => {
  const before = calls.filter((c) => c === 1001).length;
  const r = await join(await studentTok({ jti: 's-jti-2' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().playerId, ali.playerId);
  assert.equal(r.json().playerToken, ali.playerToken);
  assert.equal(calls.filter((c) => c === 1001).length, before);
  const m = await me(await studentTok({ jti: 's-jti-3' }), LESSON);
  assert.equal(m.statusCode, 200);
  assert.equal(m.json().playerId, ali.playerId);
});

test('o\'quvchi: ism band (PIN bilan kirgan «Ali Valiyev» bor) → «Ali Valiyev 2»', async () => {
  // Boshqa guruh, boshqa sessiya: mentor 862
  const m = await join(await mentorTok({ sub: 146, gid: 862, jti: 'm-862' }), { lesson_id: LESSON });
  assert.equal(m.statusCode, 200);
  await t.db.query('select * from join_session($1, $2)', [m.json().pin, 'Ali Valiyev']);
  const r = await join(await mintToken({ role: 'student', sub: 1003, name: 'Ali Valiyev', jti: 's-1003' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().nickname, 'Ali Valiyev 2');
});

test('o\'quvchi: ikki guruhda ikki sessiya → choose → session_id bilan kiradi', async () => {
  const tok = await mintToken({ role: 'student', sub: 1004, name: 'Vali', jti: 's-1004' });
  const r = await join(tok, { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  const { choose } = r.json();
  assert.equal(choose.length, 2);
  assert.ok(choose.every((c) => c.session_id && c.lesson_title && c.started_at && !('gid' in c)), 'guruh oshkor qilinmaydi');
  const pick = choose.find((c) => c.session_id === s1.session_id);
  const r2 = await join(tok, { lesson_id: LESSON, session_id: pick.session_id });
  assert.equal(r2.statusCode, 200, r2.body);
  assert.equal(r2.json().pin, s1.pin);
  // Endi o'sha token boshqa sessiyaga kira olmaydi
  const otherId = choose.find((c) => c.session_id !== s1.session_id).session_id;
  const r3 = await join(await mintToken({ role: 'student', sub: 1004, name: 'Vali', jti: 's-1004' }), { lesson_id: LESSON, session_id: otherId });
  assert.equal(r3.statusCode, 200, 'faol ishtirok bor → o\'sha sessiyaga qaytadi');
  assert.equal(r3.json().pin, s1.pin);
});

test('o\'quvchi: guruhida sessiya yo\'q → SOLO; guruhsiz → SOLO; LMS\'da yo\'q → 403; School API 500 → 503', async () => {
  let r = await join(await mintToken({ role: 'student', sub: 1002, jti: 's-1002' }), { lesson_id: OTHER });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().mode, 'solo');
  assert.equal(r.json().attempt.kind, 'solo');
  r = await join(await mintToken({ role: 'student', sub: 1005, jti: 's-1005' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().mode, 'solo');
  r = await join(await mintToken({ role: 'student', sub: 1006, jti: 's-1006' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 403);
  r = await join(await mintToken({ role: 'student', sub: 1007, jti: 's-1007' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 503);
  assert.equal(r.json().error, 'school_api_error');
});

test('jti boshqa sessiyaga bog\'langan → 409', async () => {
  // s-1003 token 862-sessiyaga bog'langan; endi shu jti bilan (soxta) 861 ga urinamiz — bu faqat token o'g'irlanganda bo'ladi
  const r = await join(await mintToken({ role: 'student', sub: 1003, name: 'Ali Valiyev', jti: 's-1003' }), { lesson_id: LESSON, session_id: s1.session_id });
  // 1003 ning faol ishtiroki 862 da — resume qaytaradi (o'sha sessiya), 861 ga o'tkazmaydi
  assert.equal(r.statusCode, 200);
  assert.notEqual(r.json().pin, s1.pin);
});

test('§6.6: boshqa o\'qituvchi (TA) o\'sha guruh+dars → eskisi auto_replaced, yangi pin; eski o\'quvchi polling\'da ended ko\'radi', async () => {
  const r = await join(await mentorTok({ sub: 777, jti: 'ta-1' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200, r.body);
  const s2 = r.json();
  assert.notEqual(s2.pin, s1.pin);
  assert.equal(s2.replaced_session_id, s1.session_id);
  const old = (await t.db.query('select status, end_reason, auto_ended_by from lms_sessions where id = $1', [s1.session_id])).rows[0];
  assert.equal(old.status, 'ended');
  assert.equal(old.end_reason, 'auto_replaced');
  assert.equal(old.auto_ended_by, s2.session_id);
  const live = (await t.db.query('select status from live_sessions where pin = $1', [s1.pin])).rows[0];
  assert.equal(live.status, 'ended');
  // Ali (1001) yangi jti bilan kirsa → yangi sessiyaga tushadi
  const r2 = await join(await studentTok({ jti: 's-jti-9' }), { lesson_id: LESSON });
  assert.equal(r2.statusCode, 200);
  assert.equal(r2.json().pin, s2.pin);
  assert.notEqual(r2.json().playerId, ali.playerId);
});

test('stale: live_sessions ended bo\'lsa (PIN-yo\'lida tugatilgan) lms_sessions ham yopiladi, mentor yangi ochadi', async () => {
  const cur = (await t.db.query(`select s.id, s.pin from lms_sessions s where s.gid = 861 and s.lesson_id = $1 and s.status = 'live'`, [LESSON])).rows[0];
  await t.db.query(`update live_sessions set status = 'ended' where pin = $1`, [cur.pin]);
  const r = await join(await mentorTok({ sub: 777, jti: 'ta-2' }), { lesson_id: LESSON });
  assert.equal(r.statusCode, 200);
  assert.notEqual(r.json().pin, cur.pin);
  const old = (await t.db.query('select status, end_reason from lms_sessions where id = $1', [cur.id])).rows[0];
  assert.equal(old.status, 'ended');
  assert.equal(old.end_reason, 'stale');
});

test('ko\'prik o\'chiq (env yo\'q) → 503 lms_bridge_disabled', async () => {
  const off = await makeTestApp({}, { lms: false });
  try {
    const r = await post(off.app, '/api/v1/lms/join', { lesson_id: LESSON }, bearer('x.y.z'));
    assert.equal(r.statusCode, 503);
    assert.equal(r.json().error, 'lms_bridge_disabled');
  } finally {
    await off.close();
  }
});
