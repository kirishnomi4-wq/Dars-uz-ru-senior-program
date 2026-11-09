// F-1105-03 L2: brauzer yuki v4 (25 §8) — bayroq yoqilganda va o'chiqda. node --test src/live/resultSchema.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

const V3 = { lessonId: 'css-01-v17', totalQuestions: 5, correctAnswers: 3, detailsVersion: 3, questions: [], codestrike: { played: true, passed: true } };

test('bayroq o\'chiq: yuk o\'zgarmaydi, avto-yakun yo\'q', async () => {
  const m = await import('./resultSchema.js?off');
  m.setDarsApi('css-01-v17', { attempt_id: 'a1', session_key: 'sess_1', lesson_version: 'v5' }, { auto: true });
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.RESULT_V4, false);
  assert.deepEqual(m.toV4('css-01-v17', V3), V3);
  assert.equal(m.autoFinishReady(), false);
});

test('bayroq yoqilgan: schema_version 2 + dars_api (lr_ = attempt), codestrike yo\'q; bog\'lanishsiz — v3', async () => {
  globalThis.__RESULT_SCHEMA_V2__ = 'on';
  const m = await import('./resultSchema.js?on');
  assert.equal(m.RESULT_V4, true);
  assert.deepEqual(m.toV4('css-01-v17', V3), V3, 'bog\'lanish yo\'q (self/preview) — o\'zgarmaydi');
  m.setDarsApi('css-01-v17', { attempt_id: '7d3f', session_key: 'sess_483920_20261110T090012Z', lesson_version: 'v5' }, { auto: true });
  const v4 = m.toV4('css-01-v17', V3);
  assert.equal('codestrike' in v4, false);
  assert.deepEqual([v4.schema_version, v4.dars_api], [2, { attempt_id: '7d3f', session_key: 'sess_483920_20261110T090012Z', lesson_version: 'v5', lesson_result_event_id: 'lr_7d3f' }]);
  assert.equal(v4.totalQuestions, 5, 'eski maydonlar o\'tish davri uchun qoladi');
  assert.equal(m.autoFinishReady(), false, 'oxirgi ekranga yetmagan');
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.autoFinishReady(), true);
  m.noteScreen('css-01-v17', 5, 22);
  assert.equal(m.autoFinishReady(), false, 'orqaga qaytdi');
  m.setDarsApi('css-01-v17', { attempt_id: '7d3f' }, { auto: false }); // ko'rish rejimi
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.autoFinishReady(), false, 'ko\'rish rejimida avto yo\'q');
  m.setDarsApi('css-01-v17', { attempt_id: 's1', session_key: null, lesson_version: null }, { auto: true });
  assert.deepEqual(m.toV4('css-01-v17', V3).dars_api, { attempt_id: 's1', session_key: null, lesson_version: null, lesson_result_event_id: 'lr_s1' }, 'solo — session_key null');
  delete globalThis.__RESULT_SCHEMA_V2__;
});
