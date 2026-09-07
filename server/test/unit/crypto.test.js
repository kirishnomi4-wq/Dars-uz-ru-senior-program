import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEncKey, encryptText, decryptText } from '../../src/lib/crypto.js';

const key = loadEncKey(Buffer.alloc(32, 1).toString('base64'));

test('kalit aynan 32 bayt bo\'lsin', () => {
  assert.throws(() => loadEncKey(Buffer.alloc(16).toString('base64')), /32 bayt/);
  assert.throws(() => loadEncKey(''), /32 bayt/);
});

test('aylanma: shifr → ochish; har safar boshqa iv', () => {
  const a = encryptText(key, 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4');
  const b = encryptText(key, 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4');
  assert.notEqual(a, b);
  assert.match(a, /^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
  assert.equal(decryptText(key, a), 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4');
  assert.equal(decryptText(key, encryptText(key, "o'zbekcha ✓")), "o'zbekcha ✓");
});

test('buzilgan shifr yoki boshqa kalit → xato', () => {
  const blob = encryptText(key, 'secret');
  const parts = blob.split(':');
  parts[2] = Buffer.from('xx').toString('base64');
  assert.throws(() => decryptText(key, parts.join(':')));
  assert.throws(() => decryptText(loadEncKey(Buffer.alloc(32, 2).toString('base64')), blob));
  assert.throws(() => decryptText(key, 'v0:a:b:c'), /format/);
});
