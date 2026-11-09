// F-1105-03 S11: analitika view'lari — ma'lumot bor, shaxsiy ma'lumot yo'q, asosiy sonlar to'g'ri.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
let t;
const ctxFetch = fakeSchoolApi(Object.fromEntries(Array.from({ length: 7 }, (_, i) => [9801 + i, [9901]])));
before(async () => {
  t = await makeTestApp({}, { lms: true, fetchImpl: ctxFetch });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });
const join = (tok, body = {}) => post(t.app, '/api/v1/lms/join', { lesson_id: LESSON, ...body }, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, p) => t.db.query(sql, p);

test('view\'lar: natija, savol urinishlari (kalit+reviziya), amaliyot, ekranlar, arena to\'liq o\'rin, ko\'p xato (≥5), sessiyalar', async () => {
  const m = (await join(await mintToken({ role: 'mentor', sub: 9990, gid: 9901, jti: 'vw-m' }), { lesson_version: 'v18', answer_key: { s4: 1, 'quiz-0': 0 } })).json();
  const st = [];
  for (let i = 0; i < 7; i++) st.push((await join(await mintToken({ role: 'student', sub: 9801 + i, name: `V${i}`, jti: `vw-${i}` }))).json());
  await q(`insert into question_keys (lesson_key, lesson_version, question_id, question_key, revision, kind, order_no) values ('internet-01', 'v18', 's4', 'internet-01:s4', 'abcabcabcabc', 'test', 1)`);
  for (const [i, s] of st.entries()) {
    const base = { p_pin: m.pin, p_player_id: s.playerId, p_token: s.playerToken };
    await rpc('screen_open', { ...base, p_screen: 4, p_screen_id: 's4', p_by_student: true });
    await rpc('record_attempt', { ...base, p_screen: 4, p_question_id: 's4', p_picked: i < 6 ? 0 : 1, p_elapsed_ms: 1000 + i, p_texts: { question: 'MAXFIY SAVOL', options: ['a', 'b'], picked: 'a', correct: 'b', lang: 'uz' } });
    if (i === 0) await rpc('record_practice', { ...base, p_screen: 15, p_screen_id: 's15', p_checked: true, p_correct: true, p_text: 'MAXFIY MATN' });
  }
  await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: 'q', p_q: 0 });
  await rpc('submit_answer', { p_pin: m.pin, p_player_id: st[0].playerId, p_token: st[0].playerToken, p_screen: 100, p_question_id: 'quiz-0', p_picked: 0, p_correct: false, p_elapsed_ms: 700 });
  await rpc('submit_answer', { p_pin: m.pin, p_player_id: st[1].playerId, p_token: st[1].playerToken, p_screen: 100, p_question_id: 'quiz-0', p_picked: 0, p_correct: false, p_elapsed_ms: 900 });

  const lr = (await q('select * from v_lesson_results where lesson_id = $1 order by student_id', [LESSON])).rows;
  assert.equal(lr.length, 7);
  assert.deepEqual([lr[0].attempt_no, lr[0].group_id, lr[0].tests_answered, lr[0].tests_correct, lr[0].practice_screens, lr[0].screens_by_student, lr[0].lesson_version], ['1', '9901', 1, 0, 1, 1, 'v18']);
  const qa = (await q('select * from v_question_attempts where student_id = 9807')).rows;
  assert.deepEqual([qa[0].question_key, qa[0].revision, qa[0].kind, qa[0].correct, qa[0].lang], ['internet-01:s4', 'abcabcabcabc', 'test', true, 'uz']);
  const wrong = (await q('select * from v_wrong_answers_top')).rows;
  assert.deepEqual(wrong.map((w) => [w.question_key, w.students, w.wrong_students, w.top_wrong_option]), [['internet-01:s4', 7, 6, 0]]);
  const fp = (await q('select * from v_arena_full_place order by full_place')).rows;
  assert.deepEqual(fp.map((r) => [Number(r.student_id), r.full_place, Number(r.ranked_players)]), [[9801, '1', 2], [9802, '2', 2]]);
  const ar = (await q('select * from v_arena where student_id = 9801')).rows[0];
  assert.deepEqual([ar.participated, ar.answered, ar.correct_answers], [true, 1, 1]);
  const sv = (await q('select * from v_screen_views where student_id = 9801')).rows;
  assert.equal(sv.length, 1);
  assert.ok(sv[0].active_sec_est >= 0 && sv[0].active_sec_est <= 300);
  const ses = (await q('select * from v_sessions where session_id = $1', [m.session_id])).rows[0];
  assert.deepEqual([ses.students_lms, ses.players_total, ses.players_pin_only], [7, 7, 0]);
  assert.equal((await q('select count(*)::int as n from v_practice')).rows[0].n, 1);
  // shaxsiy ma'lumot / matn yo'q: hech bir view ustunida
  const cols = (await q(`select table_name, column_name from information_schema.columns where table_name like 'v\\_%' and table_schema = 'public'`)).rows;
  const banned = cols.filter((c) => /name|nick|token|^text|_text$|phone|email|^answers$|payload/.test(c.column_name));
  assert.deepEqual(banned, []);
  for (const v of ['v_lesson_results', 'v_question_attempts', 'v_practice', 'v_screen_views', 'v_arena', 'v_arena_full_place', 'v_wrong_answers_top', 'v_sessions']) {
    const dump = JSON.stringify((await q(`select * from ${v}`)).rows);
    assert.ok(!/MAXFIY/.test(dump), `${v} da matn chiqdi`);
  }
});
