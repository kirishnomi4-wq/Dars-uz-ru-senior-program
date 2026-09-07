import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nicknameFrom, nicknameVariant } from '../../src/modules/lms/names.js';

test('nicknameFrom: 2 so\'z, 24 belgi, qisqa/bo\'sh → «O\'quvchi <id>»', () => {
  assert.equal(nicknameFrom("Abdurahmonov Abdulaziz Abdulla o'g'li", 1), 'Abdurahmonov Abdulaziz');
  assert.equal(nicknameFrom('Ali Valiyev', 1), 'Ali Valiyev');
  assert.equal(nicknameFrom('Ali', 1), 'Ali');
  assert.equal(nicknameFrom('Muhammadyusufbekjonovich Abdulhamidovich', 1), 'Muhammadyusufbekjonovich');
  assert.equal(nicknameFrom('', 34174), "O'quvchi 34174");
  assert.equal(nicknameFrom('A', 7), "O'quvchi 7");
  assert.ok(nicknameFrom('x'.repeat(40), 1).length <= 24);
});

test('nicknameVariant: raqam qo\'shiladi, 24 ichida', () => {
  assert.equal(nicknameVariant('Ali Valiyev', 1), 'Ali Valiyev');
  assert.equal(nicknameVariant('Ali Valiyev', 2), 'Ali Valiyev 2');
  const long = nicknameVariant('Abdurahmonov Abdulaziz', 3);
  assert.ok(long.length <= 24 && long.endsWith(' 3'), long);
});
