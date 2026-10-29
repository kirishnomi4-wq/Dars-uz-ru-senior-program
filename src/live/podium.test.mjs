// node --test src/live/podium.test.mjs — CodeStrike podium (Abdulloh QA 28.10): o'rin hisobi darsdagi formulaga AYNAN tengmi,
// teng ochkoda hamma klientda bir xil o'rin, LMS shartnomasi (place 1–3 yoki null).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { arenaPoints, arenaScore, arenaOrder, arenaPlaceOf, podiumPlace } from './podium.js';

// Darsdan quizPts + quizScore ni o'zini olib, ishlatib ko'ramiz (nusxa emas — formulani dars belgilaydi)
const lessonScore = (file, quizMs, total, baseIdx) => {
  const s = readFileSync(file, 'utf8');
  const pts = /^const quizPts = [^\n]+$/m.exec(s)[0];
  const a = s.search(/^const quizScore = \(rows\) => \{/m); const b = s.indexOf('\n};', a);
  const ctx = { QUIZ_MS: quizMs, QUIZ_BASE_IDX: baseIdx, QUIZ_BANK: { length: total } };
  vm.runInNewContext(`${pts}\n${s.slice(a, b + 3)}\nthis.quizScore = quizScore;`, ctx);
  return ctx.quizScore;
};
const rnd = (seed) => () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

test('podium · ochko: darsdagi quizScore bilan 2000 tasodifiy holatda teng (InternetLesson, PmMetrics, QUIZ_MS 20000 darsi)', () => {
  const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
  const files = walk('src').filter((f) => f.endsWith('.jsx') && /^const quizScore = \(rows\) => \{/m.test(readFileSync(f, 'utf8')));
  assert.ok(files.length >= 183, `darslar: ${files.length}`);
  const pick = ['src/1-Modull/InternetLesson.jsx', 'src/pm/PmMetricsLesson.jsx', files.find((f) => /^const QUIZ_MS = 20000/m.test(readFileSync(f, 'utf8')))];
  for (const f of pick) {
    const quizMs = Number(/^const QUIZ_MS = (\d+)/m.exec(readFileSync(f, 'utf8'))[1]);
    const ls = lessonScore(f, quizMs, 12, 100); const r = rnd(7);
    for (let k = 0; k < 2000; k++) {
      const rows = []; for (let q = 0; q < 12; q++) if (r() < 0.8) rows.push({ screen_idx: 100 + q, correct: r() < 0.6, elapsed_ms: Math.floor(r() * quizMs * 1.2) });
      const a = ls(rows), b = arenaScore(rows, { total: 12, quizMs, baseIdx: 100 });
      assert.deepEqual([b.pts, b.ok], [a.pts, a.ok], `${f} #${k}`);
    }
  }
  // 183 darsning hammasida formula matni bir xil (PmMetrics — faqat maydon nomi maxSeria)
  const norm = (f) => { const s = readFileSync(f, 'utf8'); const a = s.search(/^const quizScore = /m); return s.slice(a, s.indexOf('\n};', a)).replace(/maxSeria/g, 'maxStreak').replace(/seria/g, 'streak'); };
  assert.equal(new Set(files.map(norm)).size, 1);
  assert.equal(new Set(files.map((f) => /^const quizPts = [^\n]+$/m.exec(readFileSync(f, 'utf8'))[0])).size, 1);
  assert.equal(arenaPoints(500, 15000), 1000); assert.equal(arenaPoints(15000, 15000), 500);
});

const OPTS = { total: 12, quizMs: 15000, baseIdx: 100 };
const row = (pid, q, correct, ms) => ({ player_id: pid, screen_idx: 100 + q, correct, elapsed_ms: ms });
test('podium · teng ochko: oldin qo\'shilgan yuqorida; hamma o\'yinchi uchun o\'rinlar takrorlanmaydi; ro\'yxat tartibi ta\'sir qilmaydi', () => {
  const players = [{ id: 'b', joined_at: '2026-10-28T09:00:05Z' }, { id: 'a', joined_at: '2026-10-28T09:00:01Z' }, { id: 'c', joined_at: '2026-10-28T09:00:01Z' }, { id: 'd', joined_at: '2026-10-28T09:00:09Z' }];
  const rows = ['a', 'b', 'c'].map((p) => row(p, 0, true, 700)); // uchalasi teng
  const places = players.map((p) => arenaPlaceOf(players, rows, p.id, OPTS));
  assert.deepEqual(places, [3, 1, 2, 4]); // a (09:00:01, id a) · c (09:00:01, id c) · b · d (0 ochko)
  assert.deepEqual([...players].reverse().map((p) => arenaPlaceOf([...players].reverse(), rows, p.id, OPTS)), [4, 2, 1, 3]);
  assert.equal(new Set(places).size, players.length);
  // jadval saralash (dars ekrani) ham xuddi shu tartib
  const board = players.map((p) => ({ id: p.id, ...arenaScore(rows.filter((r) => r.player_id === p.id), OPTS) })).sort(arenaOrder(players));
  assert.deepEqual(board.map((b) => b.id), ['a', 'c', 'b', 'd']);
  assert.equal(arenaPlaceOf(players, rows, 'yoq', OPTS), 0);
});
test('podium · LMS shartnomasi: place faqat 1–3, qolgani null', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 12, 0, -1, 2.5, null, '1'].map(podiumPlace), [1, 2, 3, null, null, null, null, null, null, null, null]);
});
