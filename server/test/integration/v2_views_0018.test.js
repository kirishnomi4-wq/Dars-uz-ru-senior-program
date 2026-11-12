// F-1112-01 (0018): dars → LMS xaritasi (admin), urinish tili (dars aytgan / javobdan), har view'da lms_question_id,
// to'liq o'rin teng bo'lmaydi (kim oldin kirgan), v_skipped, amaliyot har urinishi + takror xato matni (≥5), reestr view'lari.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, bearer, mintToken, fakeSchoolApi } from '../helpers/app.js';

const LESSON = 'internet-01-v18';
const ADMIN = { authorization: `Basic ${Buffer.from('admin:test-admin-parol-12').toString('base64')}` };
const N = 6;
let t;
const ctxFetch = fakeSchoolApi(Object.fromEntries(Array.from({ length: N }, (_, i) => [9701 + i, [9902]])));
before(async () => {
  t = await makeTestApp({ ADMIN_USER: 'admin', ADMIN_PASSWORD: 'test-admin-parol-12' }, { lms: true, fetchImpl: ctxFetch });
  await t.seedCatalog([LESSON]);
});
after(async () => { await t?.close(); });
const join = (tok, body = {}) => post(t.app, '/api/v1/lms/join', { lesson_id: LESSON, ...body }, bearer(tok));
const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const q = (sql, p) => t.db.query(sql, p);
const adminPut = (url, rows, headers = ADMIN) => t.app.inject({ method: 'PUT', url, payload: { rows }, headers: { ...headers, 'content-type': 'application/json' } });

test('admin: lesson-map upsert/ro\'yxat; noto\'g\'ri til 400; parolsiz 401', async () => {
  const rows = [
    { lesson_key: 'internet-01', lang: 'uz', lms_question_id: 13381, class_id: 2374, learn_id: 3148, lesson_version: 'v6', uploaded_on: '2026-11-11' },
    { lesson_key: 'internet-01', lang: 'ru', lms_question_id: 14091, class_id: 2374, learn_id: 3148, lesson_version: 'v6', uploaded_on: '2026-11-11' },
  ];
  assert.equal((await adminPut('/admin/api/lesson-map', rows)).json().upserted, 2);
  assert.equal((await adminPut('/admin/api/lesson-map', rows)).json().upserted, 2); // qayta — upsert
  const list = (await t.app.inject({ method: 'GET', url: '/admin/api/lesson-map?lesson_key=internet-01', headers: ADMIN })).json();
  assert.deepEqual(list.map((r) => [r.lang, Number(r.lms_question_id), Number(r.learn_id), r.uploaded_on]), [['ru', 14091, 3148, '2026-11-11'], ['uz', 13381, 3148, '2026-11-11']]);
  assert.equal((await adminPut('/admin/api/lesson-map', [{ ...rows[0], lang: 'en' }])).statusCode, 400);
  assert.equal((await adminPut('/admin/api/lesson-map', rows, {})).statusCode, 401);
  const qk = [
    { lesson_key: 'internet-01', lesson_version: 'v6', question_id: 's4', question_key: 'internet-01:s4', revision: 'aaaaaaaaaaaa', kind: 'test', order_no: 1 },
    { lesson_key: 'internet-01', lesson_version: 'v6', question_id: 's5', question_key: 'internet-01:s5', revision: 'bbbbbbbbbbbb', kind: 'test', order_no: 2 },
    { lesson_key: 'internet-01', lesson_version: 'v6', question_id: 'bajardim', question_key: 'internet-01:bajardim', revision: 'cccccccccccc', kind: 'practice' },
    { lesson_key: 'internet-01', lesson_version: 'v6', question_id: 'quiz-0', question_key: 'internet-01:quiz-0', revision: 'dddddddddddd', kind: 'arena', order_no: 1 },
    { lesson_key: 'internet-01', lesson_version: 'v6', question_id: 'quiz-1', question_key: 'internet-01:quiz-1', revision: 'eeeeeeeeeeee', kind: 'arena', order_no: 2 },
  ];
  assert.equal((await adminPut('/admin/api/question-keys', qk)).json().upserted, 5);
});

test('view\'lar 0018: til va lms_question_id, to\'liq o\'rin tengsiz, skipped, amaliyot urinishlari, takror xato ≥5, reestr', async () => {
  const m = (await join(await mintToken({ role: 'mentor', sub: 9991, gid: 9902, jti: 'v18-m' }), { lesson_version: 'v6', lang: 'uz', answer_key: { s4: 1, s5: 0, 'quiz-0': 0, 'quiz-1': 0 } })).json();
  assert.equal(m.mode, 'mentor');
  assert.equal((await join(await mintToken({ role: 'student', sub: 9799, name: 'X', jti: 'v18-x' }), { lang: 'en' })).statusCode, 400);
  const toks = [], st = [];
  for (let i = 0; i < N; i++) {
    toks.push(await mintToken({ role: 'student', sub: 9701 + i, name: `S${i}`, jti: `v18-${i}` }));
    const r = await join(toks[i], i === 0 ? { lang: 'ru' } : {});
    assert.equal(r.statusCode, 200, r.body);
    st.push(r.json());
  }
  const base = (s) => ({ p_pin: m.pin, p_player_id: s.playerId, p_token: s.playerToken });
  assert.equal((await q('select lang from attempts where id = $1', [st[0].attempt.id])).rows[0].lang, 'ru');
  // st1 — dars tilini aytmagan, lekin javob matni o'zbekcha → til javobdan
  await rpc('record_attempt', { ...base(st[1]), p_screen: 4, p_question_id: 's4', p_picked: 1, p_elapsed_ms: 900, p_texts: { question: 'MAXFIY SAVOL', options: ['a', 'b'], picked: 'b', correct: 'b', lang: 'uz' } });
  // st0: s4 javob, s5 va «bajardim» javobsiz → oxiriga yetgach ikkalasi skipped
  await rpc('submit_answer', { ...base(st[0]), p_screen: 4, p_question_id: 's4', p_picked: 1, p_correct: true, p_elapsed_ms: 800 });
  const pr = await t.app.inject({ method: 'PUT', url: '/api/v1/me/progress', payload: { lesson_id: LESSON, attempt_id: st[0].attempt.id, screen: 21, total: 22, answers: {}, client_ts: Date.now() }, headers: { 'content-type': 'application/json', ...bearer(toks[0]) } });
  assert.equal(pr.json().reached_end, true, pr.body);
  // amaliyot: st0 ikki marta «Tekshirish» (1 — xato, 2 — to'g'ri); 5 o'quvchi bir xil xato matn (harf/bo'shliq farqi bilan), 1 o'quvchi — boshqa matn
  const variants = ['<H1> Salom', ' <h1>  salom ', '<h1> Salom', '<h1>\tsalom', '<H1> SALOM']; // hammasi → «<h1> salom»
  for (let i = 0; i < 5; i++) await rpc('record_practice', { ...base(st[i]), p_screen: 15, p_screen_id: 's15', p_checked: true, p_correct: false, p_text: variants[i] });
  await rpc('record_practice', { ...base(st[0]), p_screen: 15, p_screen_id: 's15', p_checked: true, p_correct: true, p_text: '<h1>Salom</h1>' });
  await rpc('record_practice', { ...base(st[5]), p_screen: 15, p_screen_id: 's15', p_checked: true, p_correct: false, p_text: 'MAXFIY MATN' });
  // arena: st0 va st1 — bir xil to'g'ri va bir xil vaqt → o'rin kim oldin kirgan bo'yicha (1, 2), teng emas; st2 — 0 to'g'ri → o'rinsiz
  await rpc('quiz_control', { p_pin: m.pin, p_token: m.token, p_state: 'q', p_q: 0 });
  for (const [i, picked] of [[1, 0], [0, 0], [2, 1]]) {
    await rpc('submit_answer', { ...base(st[i]), p_screen: 100, p_question_id: 'quiz-0', p_picked: picked, p_correct: false, p_elapsed_ms: 1000 });
  }
  // arena vaqtini server o'zi o'lchaydi (savol boshlanganidan) — teng holatni sinash uchun vaqt tenglashtiriladi
  await q('update live_answers set elapsed_ms = 1000 where pin = $1 and screen_idx = 100', [m.pin]);

  const lr = Object.fromEntries((await q('select * from v_lesson_results where lesson_id = $1', [LESSON])).rows.map((r) => [Number(r.student_id), r]));
  assert.deepEqual([lr[9701].lang, lr[9701].lang_source, Number(lr[9701].lms_question_id), Number(lr[9701].learn_id), Number(lr[9701].class_id)], ['ru', 'lesson', 14091, 3148, 2374]);
  assert.deepEqual([lr[9702].lang, lr[9702].lang_source, Number(lr[9702].lms_question_id)], ['uz', 'answer', 13381]);
  assert.deepEqual([lr[9703].lang, lr[9703].lang_source, lr[9703].lms_question_id], [null, null, null]);

  const fp = (await q('select * from v_arena_full_place order by full_place nulls last, student_id')).rows;
  assert.deepEqual(fp.map((r) => [Number(r.student_id), r.full_place === null ? null : Number(r.full_place), Number(r.ranked_players), Number(r.answering_players)]),
    [[9701, 1, 2, 3], [9702, 2, 2, 3], [9703, null, 2, 3]]);
  assert.equal(Number(fp[0].lms_question_id), 14091);

  const sk = (await q('select student_id, question_id, kind, lms_question_id from v_skipped order by student_id, question_id')).rows;
  assert.deepEqual(sk.map((r) => [Number(r.student_id), r.question_id, r.kind, Number(r.lms_question_id)]), [[9701, 'bajardim', 'practice', 14091], [9701, 's5', 'test', 14091]]);

  const pa = (await q('select attempt_no, correct from v_practice where student_id = 9701 order by attempt_no')).rows;
  assert.deepEqual(pa.map((r) => [r.attempt_no, r.correct]), [[1, false], [2, true]]);
  const pw = (await q('select * from v_practice_wrong_top')).rows;
  assert.deepEqual(pw.map((r) => [r.question_key, r.wrong_answer, r.students]), [['internet-01:s15', '<h1> salom', 5]]);

  const ql = (await q('select question_id, lang, learn_order from v_quiz_learn order by lang desc, learn_order')).rows;
  assert.deepEqual(ql.map((r) => [r.question_id, r.lang, r.learn_order]), [['quiz-0', 'uz', 1], ['quiz-1', 'uz', 2], ['quiz-0', 'ru', 3], ['quiz-1', 'ru', 4]]);
  const ses = (await q('select * from v_sessions where session_id = $1', [m.session_id])).rows[0];
  assert.deepEqual([Number(ses.lms_question_id_uz), Number(ses.lms_question_id_ru), Number(ses.learn_id)], [13381, 14091, 3148]);
  assert.equal((await q('select count(*)::int as n from v_lessons')).rows[0].n, 2);

  // shaxsiy ma'lumot / yakka matn yo'q: hech bir konnektor view'ida
  const cols = (await q(`select table_name, column_name from information_schema.columns where table_name like 'v\\_%' and table_schema = 'public'`)).rows;
  assert.deepEqual(cols.filter((c) => /name|nick|token|^text|_text$|phone|email|^answers$|payload/.test(c.column_name)), []);
  for (const v of ['v_lesson_results', 'v_question_attempts', 'v_practice', 'v_screen_views', 'v_arena', 'v_arena_full_place', 'v_wrong_answers_top', 'v_sessions',
    'v_skipped', 'v_practice_wrong_top', 'v_lessons', 'v_quiz_learn']) {
    const dump = JSON.stringify((await q(`select * from ${v}`)).rows);
    assert.ok(!/MAXFIY/.test(dump), `${v} da matn chiqdi`);
  }
});
