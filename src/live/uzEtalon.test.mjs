// F-1109-07: RU yozuvi UZ-etalonga — node --test src/live/uzEtalon.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { uzEtalon } from './uzEtalon.js';
import { QT_UZ } from './questionTextUz.js';

test('xaritada yo\'q / uz rejim / texts yo\'q — o\'zgarmaydi', () => {
  const t = { question: 'Q', options: ['a', 'b'], picked: 'a', correct: 'b', lang: 'ru' };
  assert.equal(uzEtalon('yoq-dars', 's4', t, 0), t);
  const u = { ...t, lang: 'uz' };
  const [lid, qs] = Object.entries(QT_UZ)[0]; const qid = Object.keys(qs)[0];
  assert.equal(uzEtalon(lid, qid, u, 0), u);
  assert.equal(uzEtalon(lid, qid, undefined, 0), undefined);
});

test('haqiqiy yozuvlar (SAVOL_MATNLARI.json): har RU yuk → aynan UZ yuk (savol, variantlar, tanlangan, to\'g\'ri), lang ru qoladi', () => {
  const d = JSON.parse(readFileSync(new URL('../../SAVOL_MATNLARI.json', import.meta.url), 'utf8')).lessons;
  let n = 0, untouched = 0;
  for (const [lid, l] of Object.entries(d)) for (const [qid, sc] of Object.entries(l.screens || {})) {
    if (!sc.uz || !sc.ru) continue;
    const opts = sc.ru.options || [];
    const tu = (v) => (v && typeof v === 'object' ? (v.uz ?? v.ru) : v); // UZ yuk serverga qanday yetsa (obyekt → uz matn)
    const uzOpts = (sc.uz.options || []).map(tu);
    for (let pick = 0; pick < opts.length; pick++) {
      const ci = Number.isInteger(sc.key) && sc.key >= 0 && sc.key < opts.length ? sc.key : 0;
      const ru = { question: sc.ru.question, options: opts, picked: opts[pick], correct: opts[ci], lang: 'ru' };
      const r = uzEtalon(lid, qid, ru, pick);
      assert.equal(r.lang, 'ru');
      assert.equal(r.question, tu(sc.uz.question), `${lid}:${qid} savol`);
      assert.deepEqual(r.options.map(tu), uzOpts, `${lid}:${qid} variantlar`);
      assert.equal(tu(r.picked), uzOpts[pick], `${lid}:${qid} tanlangan ${pick}`);
      assert.equal(tu(r.correct), uzOpts[ci], `${lid}:${qid} to'g'ri`);
      if (r === ru) untouched++;
      n++;
    }
  }
  assert.ok(n > 1500, `yozuvlar: ${n}`);
  assert.ok(untouched > 0, 'UZ-etalon darslar o\'zgarmay o\'tadi');
});

test('variant obyekt ({uz,ru}) ko\'rinishida kelsa ham; tanlangan matn raqamga mos kelmasa — matn bo\'yicha', () => {
  const [lid, qs] = Object.entries(QT_UZ).find(([, x]) => Object.values(x).some((e) => e[1].length >= 3));
  const [qid, [q, uz]] = Object.entries(qs).find(([, e]) => e[1].length >= 3);
  const ruOpts = uz.map((o, i) => ({ uz: o, ru: `RU-${i}` }));
  const r = uzEtalon(lid, qid, { question: 'RU savol', options: ruOpts, picked: 'RU-2', correct: { uz: uz[1], ru: 'RU-1' }, lang: 'ru' }, 0);
  assert.deepEqual([r.question, r.picked, r.correct], [q, uz[2], uz[1]]);
  const bad = uzEtalon(lid, qid, { question: 'RU', options: ruOpts, picked: 'TANISH-YO\'Q', lang: 'ru' }, 99);
  assert.equal('picked' in bad, false, 'tanib bo\'lmagan matn noto\'g\'ri tilda yozilmaydi');
});
