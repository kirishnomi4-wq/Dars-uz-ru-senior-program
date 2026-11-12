// F-1112-01: checkReport — sessiyasiz jim, matn ≤300 va bo'shliqlar, id ≤64, tozalash faqat o'z reporterini o'chiradi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportCheck, setCheckReporter, checkText, checkOrderText, CHECK_TEXT_MAX } from './checkReport.js';

test('reporter yo\'q — jim (false), xato otmaydi', () => {
  assert.equal(reportCheck({ correct: true, text: 'a' }), false);
});

test('ro\'yxatdan o\'tgan reporter — correct, matn tozalangan va ≤300, id ≤64', () => {
  const got = [];
  const off = setCheckReporter((r) => got.push(r));
  assert.equal(reportCheck({ correct: false, text: '  <H1>   Salom \n dunyo ' }), true);
  assert.equal(reportCheck({ correct: true, text: 'x'.repeat(500), id: 'y'.repeat(80) }), true);
  assert.equal(reportCheck({ correct: 'ha' }), false); // correct boolean emas — yuborilmaydi
  assert.equal(reportCheck({ correct: true, text: 42 }), true);
  assert.deepEqual(got[0], { correct: false, text: '<H1> Salom dunyo', id: null, sub: null, screen: null });
  assert.equal(got[1].text.length, CHECK_TEXT_MAX);
  assert.equal(got[1].id.length, 64);
  assert.equal(got[2].text, null);
  off();
  assert.equal(reportCheck({ correct: true }), false);
});

test('tozalash boshqa (yangiroq) reporterni o\'chirmaydi; reporter xatosi tashqariga chiqmaydi', () => {
  const offOld = setCheckReporter(() => {});
  const got = [];
  const offNew = setCheckReporter((r) => got.push(r));
  offOld();
  assert.equal(reportCheck({ correct: true }), true);
  assert.equal(got.length, 1);
  offNew();
  setCheckReporter(() => { throw new Error('tarmoq'); });
  assert.equal(reportCheck({ correct: true }), false);
  setCheckReporter(null);
});

test('sub: maydon nomi (≤24) uzatiladi; obyekt/massiv matni « | » bilan', () => {
  const got = [];
  const off = setCheckReporter((r) => got.push(r));
  reportCheck({ correct: true, sub: 'raqamlar', text: { risk: 'Narx qimmat', qadam: '  5 kishi bilan gaplashaman ', son: 3 } });
  reportCheck({ correct: false, sub: 2, text: ['a', '', 'b'] });
  assert.deepEqual([got[0].sub, got[0].text], ['raqamlar', 'Narx qimmat | 5 kishi bilan gaplashaman']);
  assert.deepEqual([got[1].sub, got[1].text], ['2', 'a | b']);
  off();
});

test('checkText: bo\'sh/oq satr → null', () => {
  assert.equal(checkText('   '), null);
  assert.equal(checkText(undefined), null);
});

test('checkOrderText: satr yorliq, {uz,ru} → uz, noma\'lum → id', () => {
  const items = [{ id: 'a', label: 'function' }, { id: 'b', label: { uz: 'Brauzer', ru: 'Браузер' } }, { id: 'c', label: null }];
  assert.equal(checkOrderText(['b', 'a', 'c', 'z'], items), 'Brauzer → function → c → z');
  assert.equal(checkOrderText(null, items), '');
});

test('screen: aniq ekran raqami uzatiladi (manfiy/son emas — null)', () => {
  const got = [];
  const off = setCheckReporter((r) => got.push(r));
  reportCheck({ correct: false, text: 'x', screen: 16 });
  reportCheck({ correct: false, text: 'x', screen: -1 });
  reportCheck({ correct: false, text: 'x', screen: '3' });
  assert.deepEqual(got.map((r) => r.screen), [16, null, null]);
  off();
});
