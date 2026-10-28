// 0010_arena_yopilishi (28.10, F-1023-01 PODIUM-05): arena yakunlangach shu sessiyada arena javoblari qabul qilinmaydi.
// Kafolat: done'dan keyin arena jadvali = done paytidagi jadval (dars codestrike.podium o'rnini shu jadvaldan hisoblaydi).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { freshDatabase } from '../helpers/db.js';

const CODE = 'TEST-CODE-2026';
let db;

before(async () => {
  db = await freshDatabase();
  await db.query(`insert into app_config (key, value) values ('mentor_code', $1)`, [CODE]);
  await db.query('select set_quiz_keys($1, $2, $3)', ['yopish-lesson', CODE, '{"quiz-0":2,"quiz-1":1,"quiz-2":0,"s4":1}']);
});
after(async () => { await db?.end(); });

const q = (sql, params) => db.query(sql, params).then((r) => r.rows);
const one = async (sql, params) => (await q(sql, params))[0];
const ctrl = (s, state, n = -1) => q('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, state, n]);
const submit = async (s, p, screen, qid, picked, elapsed = 900) =>
  (await one('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, p.player_id, p.token, screen, qid, picked, false, elapsed])).ok;
const attempt = async (s, p, screen, qid, picked) =>
  (await one('select record_attempt($1,$2,$3,$4,$5,$6,$7,$8) as n', [s.pin, p.player_id, p.token, screen, qid, picked, 900, null])).n;
const jadval = (s) => q(`select player_id, screen_idx, picked, correct, elapsed_ms from live_answers
                          where pin = $1 and screen_idx >= 100 order by player_id, screen_idx`, [s.pin]);

async function sinf(names = ['Ali', 'Vali', 'Gani']) {
  const s = await one('select * from create_session($1, $2)', ['yopish-lesson', CODE]);
  const ps = [];
  for (const n of names) ps.push(await one('select * from join_session($1, $2)', [s.pin, n]));
  return { s, ps };
}

test('done gacha arena javoblari yoziladi; done dan keyin — yozilmaydi (false), jadval o\'zgarmaydi', async () => {
  const { s, ps: [ali, vali, gani] } = await sinf();
  await ctrl(s, 'lobby'); await ctrl(s, 'q', 0);
  assert.equal(await submit(s, ali, 100, 'quiz-0', 2), true);
  assert.equal(await submit(s, vali, 100, 'quiz-0', 1), true);
  await ctrl(s, 'r', 0); await ctrl(s, 'q', 1);
  assert.equal(await submit(s, ali, 101, 'quiz-1', 1), true);
  await ctrl(s, 'r', 1);
  // kechikkan javob 'r' holatida — hali done emas, yoziladi (bugungi xulq o'zgarmagan)
  assert.equal(await submit(s, vali, 101, 'quiz-1', 1, 2000), true);
  await ctrl(s, 'done', 1);
  const oldin = await jadval(s);
  assert.equal(oldin.length, 4);

  // done dan keyin: kechikkan javoblar (o'zi va boshqalar), yangi savol, qayta yuborish — hammasi rad
  assert.equal(await submit(s, gani, 100, 'quiz-0', 2), false);
  assert.equal(await submit(s, gani, 101, 'quiz-1', 1), false);
  assert.equal(await submit(s, ali, 102, 'quiz-2', 0), false);
  assert.equal(await submit(s, vali, 100, 'quiz-0', 2), false); // allaqachon javob bergan + yopiq
  assert.deepEqual(await jadval(s), oldin);
  const st = await one('select quiz_state, quiz_done_at from live_sessions where pin = $1', [s.pin]);
  assert.equal(st.quiz_state, 'done');
  assert.ok(st.quiz_done_at);
});

test('yopilgan arena API orqali qayta ochilsa ham (lobby/q) — javob qabul qilinmaydi; quiz_done_at birinchi done vaqti', async () => {
  const { s, ps: [ali, vali] } = await sinf(['Ali', 'Vali']);
  await ctrl(s, 'q', 0);
  assert.equal(await submit(s, ali, 100, 'quiz-0', 2), true);
  await ctrl(s, 'done', 0);
  const t1 = (await one('select quiz_done_at from live_sessions where pin = $1', [s.pin])).quiz_done_at;
  await new Promise((r) => setTimeout(r, 30));
  await ctrl(s, 'lobby'); await ctrl(s, 'q', 1);
  assert.equal(await submit(s, vali, 101, 'quiz-1', 1), false);
  assert.equal(await submit(s, ali, 101, 'quiz-1', 1), false);
  await ctrl(s, 'done', 1);
  const t2 = (await one('select quiz_done_at from live_sessions where pin = $1', [s.pin])).quiz_done_at;
  assert.equal(t2.getTime(), t1.getTime(), "quiz_done_at qayta done'da o'zgarmasin");
  assert.equal((await jadval(s)).length, 1);
});

test('dars ekranlaridagi savollar (screen < 100) done dan keyin ham yoziladi — faqat arena yopiladi', async () => {
  const { s, ps: [ali] } = await sinf(['Ali']);
  await ctrl(s, 'q', 0); await ctrl(s, 'done', 0);
  assert.equal(await submit(s, ali, 4, 's4', 1), true);
  const a = await one('select correct from live_answers where player_id = $1 and screen_idx = 4', [ali.player_id]);
  assert.equal(a.correct, true);
  assert.equal(await attempt(s, ali, 5, 's5', 0), 1);
});

test('record_attempt: arena done dan keyin 0 — urinish ham, ball-qatori ham yozilmaydi; done gacha odatdagidek', async () => {
  const { s, ps: [ali, vali] } = await sinf(['Ali', 'Vali']);
  await ctrl(s, 'q', 0);
  assert.equal(await attempt(s, ali, 100, 'quiz-0', 2), 1);
  await ctrl(s, 'done', 0);
  assert.equal(await attempt(s, vali, 100, 'quiz-0', 2), 0);
  assert.equal(await attempt(s, ali, 100, 'quiz-0', 1), 0);
  const n = await one('select count(*)::int as n from answer_attempts where pin = $1 and screen_idx >= 100', [s.pin]);
  assert.equal(n.n, 1);
  assert.equal((await jadval(s)).length, 1);
});

test('poyga: javob tranzaksiyasi ochiq turganda done KUTADI; javob done dan oldin yoziladi, keyingisi rad', async () => {
  const { s, ps: [ali, vali] } = await sinf(['Ali', 'Vali']);
  await ctrl(s, 'q', 0);
  const a = await db.connect();
  const b = await db.connect();
  try {
    await a.query('begin');
    const r = await a.query('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 100, 'quiz-0', 2, false, 900]);
    assert.equal(r.rows[0].ok, true);
    let doneTugadi = false;
    const done = b.query('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'done', 0]).then(() => { doneTugadi = true; });
    await new Promise((x) => setTimeout(x, 400));
    assert.equal(doneTugadi, false, "done javob tranzaksiyasi tugashini kutishi kerak");
    await a.query('commit');
    await done;
    assert.equal(doneTugadi, true);
  } finally {
    await a.query('rollback').catch(() => {});
    a.release(); b.release();
  }
  assert.equal(await submit(s, vali, 100, 'quiz-0', 2), false);
  const t = await jadval(s);
  assert.equal(t.length, 1);
  assert.equal(t[0].player_id, ali.player_id);
});

test('poyga teskari: done tranzaksiyasi ochiq turganda javob KUTADI va keyin rad etiladi', async () => {
  const { s, ps: [ali] } = await sinf(['Ali']);
  await ctrl(s, 'q', 0);
  const a = await db.connect();
  const b = await db.connect();
  try {
    await b.query('begin');
    await b.query('select quiz_control($1,$2,$3,$4)', [s.pin, s.token, 'done', 0]);
    let javob = null;
    const p = a.query('select submit_answer($1,$2,$3,$4,$5,$6,$7,$8) as ok', [s.pin, ali.player_id, ali.token, 100, 'quiz-0', 2, false, 900])
      .then((r) => { javob = r.rows[0].ok; });
    await new Promise((x) => setTimeout(x, 400));
    assert.equal(javob, null, 'javob done tranzaksiyasi tugashini kutishi kerak');
    await b.query('commit');
    await p;
    assert.equal(javob, false);
  } finally {
    await b.query('rollback').catch(() => {});
    a.release(); b.release();
  }
  assert.equal((await jadval(s)).length, 0);
});
