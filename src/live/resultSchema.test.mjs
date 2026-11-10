// F-1105-03 L2: brauzer yuki v4 (25 §8) — bayroq SERVERDAN (join `result_schema`). node --test src/live/resultSchema.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

const V3 = { lessonId: 'css-01-v17', totalQuestions: 5, correctAnswers: 3, detailsVersion: 3, questions: [], codestrike: { played: true, passed: true } };

test('server result_schema 1 yoki eski server (v2 yo\'q): yuk o\'zgarmaydi, avto-yakun yo\'q', async () => {
  const m = await import('./resultSchema.js?v1');
  m.setDarsApi('css-01-v17', { attempt_id: 'a1', session_key: 'sess_1', lesson_version: 'v5' }, { auto: true }); // eski server — v2 maydoni yo'q
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.isV4('css-01-v17'), false);
  assert.deepEqual(m.toV4('css-01-v17', V3), V3);
  assert.equal(m.autoFinishReady(), false);
  m.setDarsApi('css-01-v17', { attempt_id: 'a1', session_key: 'sess_1', lesson_version: 'v5', v2: false }, { auto: true });
  assert.deepEqual(m.toV4('css-01-v17', V3), V3);
  assert.equal(m.autoFinishReady(), false);
});

test('server result_schema 2: schema_version 2 + dars_api (lr_ = attempt), codestrike yo\'q; bog\'lanishsiz — v3', async () => {
  const m = await import('./resultSchema.js?v2');
  assert.equal(m.isV4(), false, 'bog\'lanish hali yo\'q');
  assert.deepEqual(m.toV4('css-01-v17', V3), V3, 'bog\'lanish yo\'q (self/preview) — o\'zgarmaydi');
  let calls = 0;
  const off = m.onDarsApiChange(() => { calls++; });
  m.setDarsApi('css-01-v17', { attempt_id: '7d3f', session_key: 'sess_483920_20261110T090012Z', lesson_version: 'v5', v2: true }, { auto: true });
  assert.equal(calls, 1, 'FinishBtn xabardor qilinadi');
  off();
  assert.equal(m.isV4(), true);
  assert.equal(m.isV4('css-01-v17'), true);
  assert.equal(m.isV4('boshqa-dars'), false);
  const v4 = m.toV4('css-01-v17', V3);
  assert.equal('codestrike' in v4, false);
  assert.equal('v2' in v4.dars_api, false, 'ichki bayroq yukka chiqmaydi');
  assert.deepEqual([v4.schema_version, v4.dars_api], [2, { attempt_id: '7d3f', session_key: 'sess_483920_20261110T090012Z', lesson_version: 'v5', lesson_result_event_id: 'lr_7d3f' }]);
  assert.equal(v4.totalQuestions, 5, 'eski maydonlar o\'tish davri uchun qoladi');
  assert.equal(m.autoFinishReady(), false, 'oxirgi ekranga yetmagan');
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.autoFinishReady(), true);
  m.noteScreen('css-01-v17', 5, 22);
  assert.equal(m.autoFinishReady(), false, 'orqaga qaytdi');
  m.setDarsApi('css-01-v17', { attempt_id: '7d3f', v2: true }, { auto: false }); // ko'rish rejimi
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.autoFinishReady(), false, 'ko\'rish rejimida avto yo\'q');
  m.setDarsApi('css-01-v17', { attempt_id: 's1', session_key: null, lesson_version: null, v2: true }, { auto: true });
  assert.deepEqual(m.toV4('css-01-v17', V3).dars_api, { attempt_id: 's1', session_key: null, lesson_version: null, lesson_result_event_id: 'lr_s1' }, 'solo — session_key null');
  m.setDarsApi('css-01-v17', null);
  assert.equal(m.isV4(), false, 'bog\'lanish uzildi (mentor/self)');
  assert.deepEqual(m.toV4('css-01-v17', V3), V3);
});

test('favqulodda o\'chirish: build RESULT_SCHEMA_V2=off — server 2 desa ham v3', async () => {
  globalThis.__RESULT_SCHEMA_V2__ = 'off';
  const m = await import('./resultSchema.js?buildoff');
  m.setDarsApi('css-01-v17', { attempt_id: '7d3f', session_key: 's', lesson_version: 'v5', v2: true }, { auto: true });
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.isV4(), false);
  assert.deepEqual(m.toV4('css-01-v17', V3), V3);
  assert.equal(m.autoFinishReady(), false);
  delete globalThis.__RESULT_SCHEMA_V2__;
});

test('avto-yakun bitta urinishga bir marta: markAutoFired dan keyin false; yangi urinish — yana true', async () => {
  const m = await import('./resultSchema.js?once');
  m.setDarsApi('css-01-v17', { attempt_id: 'a1', session_key: null, lesson_version: 'v5', v2: true }, { auto: true });
  m.noteScreen('css-01-v17', 21, 22);
  assert.equal(m.autoFinishReady(), true);
  m.markAutoFired();
  assert.equal(m.autoFinishReady(), false, 'oyna ochilib FinishBtn qayta mount bo\'lsa — takror avto yo\'q');
  m.setDarsApi('css-01-v17', { attempt_id: 'a2', session_key: null, lesson_version: 'v5', v2: true }, { auto: true });
  assert.equal(m.autoFinishReady(), true, 'yangi urinish (Qaytadan boshlash)');
});
