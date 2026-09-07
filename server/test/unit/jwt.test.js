// LMS v1.2 §5.1 — 12 band, har biri alohida sinov + salbiy holatlar. Tokenlar jose SignJWT bilan yasaladi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createVerifier, keyFromSecret, TokenError, cleanName } from '../../src/modules/lms/jwt.js';
import { mintToken, TEST_JWT } from '../helpers/app.js';

const cfg = {
  secret: TEST_JWT.secret, issuer: TEST_JWT.issuer, audience: TEST_JWT.audience, keyId: TEST_JWT.keyId,
  secretNext: TEST_JWT.secretNext, keyIdNext: TEST_JWT.keyIdNext, maxTtlSeconds: 43200, clockToleranceSeconds: 60,
};
const verify = createVerifier(cfg);

async function rejectsWith(promise, reason) {
  await assert.rejects(promise, (e) => {
    assert.ok(e instanceof TokenError, `TokenError kutilgan, keldi ${e?.constructor?.name}: ${e?.message}`);
    assert.equal(e.statusCode, 401);
    assert.equal(e.code, 'invalid_token');
    assert.equal(e.reason, reason);
    return true;
  });
}

test('to\'g\'ri o\'quvchi tokeni → claims', async () => {
  const c = await verify(await mintToken({ role: 'student', sub: 34174, name: '  Ali   Valiyev ', crm_id: 17226 }));
  assert.equal(c.role, 'student');
  assert.equal(c.sub, 34174);
  assert.equal(c.name, 'Ali Valiyev');
  assert.equal(c.crmId, 17226);
  assert.equal(c.gid, null);
  assert.equal(c.kid, 'v1');
  assert.ok(c.exp instanceof Date && c.exp.getTime() > Date.now());
  assert.ok(c.jti.length > 10);
});

test('to\'g\'ri mentor tokeni → gid; gid yo\'q → rad', async () => {
  const c = await verify(await mintToken({ role: 'mentor', sub: 145, gid: 861 }));
  assert.equal(c.role, 'mentor');
  assert.equal(c.gid, 861);
  assert.equal(c.crmId, null);
  await rejectsWith(verify(await mintToken({ role: 'mentor', gid: null })), 'gid');
  await rejectsWith(verify(await mintToken({ role: 'mentor', gid: 0 })), 'gid');
});

test('1 — uch segment', async () => {
  await rejectsWith(verify('abc.def'), 'malformed');
  await rejectsWith(verify(''), 'malformed');
  await rejectsWith(verify(null), 'malformed');
});

test('2 — alg faqat HS256 (HS384/HS512/none rad)', async () => {
  await rejectsWith(verify(await mintToken({ alg: 'HS384' })), 'alg');
  await rejectsWith(verify(await mintToken({ alg: 'HS512' })), 'alg');
  // alg=none: imzosiz token qo'lda
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const none = `${b64({ alg: 'none', typ: 'JWT', kid: 'v1' })}.${b64({ sub: '1', role: 'student', jti: 'x', iat: 1, exp: 2 })}.`;
  await rejectsWith(verify(none), 'alg');
});

test('3 — typ=JWT shart', async () => {
  await rejectsWith(verify(await mintToken({ typ: null })), 'typ');
  await rejectsWith(verify(await mintToken({ typ: 'jwt' })), 'typ');
});

test('4 — kid allowlist; kid yo\'q → rad', async () => {
  await rejectsWith(verify(await mintToken({ kid: 'v9' })), 'kid');
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const noKid = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: '1' })}.sig`;
  await rejectsWith(verify(noKid), 'kid');
});

test('5 — imzo: begona secret rad; kid v2 o\'z secret\'i bilan qabul (rotatsiya)', async () => {
  await rejectsWith(verify(await mintToken({ secret: 'wrong-secret-wrong-secret' })), 'signature');
  // kid v1 header, lekin v2 secret bilan imzolangan → rad (kid bo'yicha kalit tanlanadi)
  await rejectsWith(verify(await mintToken({ kid: 'v1', secret: TEST_JWT.secretNext })), 'signature');
  const c = await verify(await mintToken({ kid: 'v2' }));
  assert.equal(c.kid, 'v2');
});

test('6/7 — iss va aud aynan', async () => {
  await rejectsWith(verify(await mintToken({ iss: 'boshqa' })), 'iss');
  await rejectsWith(verify(await mintToken({ aud: 'boshqa' })), 'aud');
  await rejectsWith(verify(await mintToken({ iss: null })), 'iss');
  await rejectsWith(verify(await mintToken({ aud: null })), 'aud');
});

test('8 — vaqt: 60 s bardosh ichida o\'tadi, tashqarida rad (exp, nbf)', async () => {
  const now = Math.floor(Date.now() / 1000);
  // 30 s oldin tugagan — bardosh ichida
  await verify(await mintToken({ iat: now - 3600, ttl: 3600 - 30 }));
  // 120 s oldin tugagan — rad
  await rejectsWith(verify(await mintToken({ iat: now - 3600, ttl: 3600 - 120 })), 'expired');
  // nbf 30 s kelajakda — o'tadi; 5 daqiqa kelajakda — rad
  await verify(await mintToken({ nbf: now + 30 }));
  await rejectsWith(verify(await mintToken({ nbf: now + 300 })), 'nbf');
});

test('9 — exp > nbf va exp - iat ≤ 43200', async () => {
  await rejectsWith(verify(await mintToken({ ttl: 43201 })), 'ttl');
  await verify(await mintToken({ ttl: 43200 }));
  // exp <= nbf holati: nbf kelajakda bo'lsa jose avval 'nbf' deydi (8-band), nbf o'tmishda bo'lsa exp ham o'tmishda → 'expired'.
  // Ya'ni 9-bandning «exp > nbf» qismi 8-band bilan qoplanadi; bizning qo'shimcha tekshiruv zaxira.
  const now = Math.floor(Date.now() / 1000);
  await rejectsWith(verify(await mintToken({ nbf: now + 7200, ttl: 3600 })), 'nbf');
});

test('10 — jti bo\'sh emas', async () => {
  await rejectsWith(verify(await mintToken({ jti: '' })), 'jti'); // jose uchun '' mavjud claim — bizning tekshiruv ushlaydi
  await rejectsWith(verify(await mintToken({ jti: '   ' })), 'jti');
  await rejectsWith(verify(await mintToken({ jti: 'x'.repeat(129) })), 'jti');
});

test('11 — role faqat student|mentor', async () => {
  await rejectsWith(verify(await mintToken({ extra: { role: 'admin' } })), 'role');
  await rejectsWith(verify(await mintToken({ extra: { role: 'Student' } })), 'role');
});

test('12 — sub musbat butun son (satr)', async () => {
  await rejectsWith(verify(await mintToken({ sub: '0' })), 'sub');
  await rejectsWith(verify(await mintToken({ sub: 'abc' })), 'sub');
  await rejectsWith(verify(await mintToken({ sub: '-5' })), 'sub');
  await rejectsWith(verify(await mintToken({ sub: '007' })), 'sub');
  await rejectsWith(verify(await mintToken({ sub: null })), 'claim:sub');
});

test('secret: base64: prefiks baytlarga, oddiy satr UTF-8 (LMS §5.1)', () => {
  const raw = Buffer.from('abc');
  assert.deepEqual(Buffer.from(keyFromSecret('base64:' + raw.toString('base64'))), raw);
  assert.deepEqual(Buffer.from(keyFromSecret('abc')), Buffer.from('abc', 'utf8'));
  assert.throws(() => keyFromSecret(''), /berilmagan/);
});

test('cleanName: bo\'shliqlar yig\'iladi, 64 belgi, satr bo\'lmasa bo\'sh', () => {
  assert.equal(cleanName('  A   B  '), 'A B');
  assert.equal(cleanName('x'.repeat(100)).length, 64);
  assert.equal(cleanName(42), '');
  assert.equal(cleanName(undefined), '');
});
