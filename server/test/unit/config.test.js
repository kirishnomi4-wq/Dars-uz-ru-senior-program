import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../../src/config.js';

const base = { DARS_ENV: 'dev', DATABASE_URL: 'postgres://u:p@h/db' };

test('minimal dev config: defaultlar to\'g\'ri', () => {
  const c = loadConfig(base);
  assert.equal(c.env, 'dev');
  assert.equal(c.isProdLike, false);
  assert.equal(c.host, '127.0.0.1');
  assert.equal(c.port, 3001);
  assert.equal(c.logLevel, 'debug');
  assert.equal(c.trustProxy, false);
  assert.deepEqual(c.corsOrigins, []);
  assert.equal(c.migrateDatabaseUrl, c.databaseUrl);
  assert.ok(Object.isFrozen(c));
});

test('barcha muammolar bir yo\'la yig\'iladi', () => {
  assert.throws(
    () => loadConfig({ DARS_ENV: 'prod', PORT: 'abc', LOG_LEVEL: 'loud' }),
    (e) => {
      assert.equal(e.code, 'CONFIG_INVALID');
      const p = e.problems.join('\n');
      assert.match(p, /DATABASE_URL: majburiy/);
      assert.match(p, /PORT: butun son/);
      assert.match(p, /LOG_LEVEL: ruxsat etilgan/);
      assert.match(p, /CORS_ORIGINS: majburiy/);
      assert.match(p, /LIVE_MENTOR_CODE: majburiy/);
      return true;
    },
  );
});

test('xato xabarida qiymat emas, faqat nom bo\'ladi', () => {
  assert.throws(
    () => loadConfig({ ...base, PORT: 'SECRET-VALUE-99' }),
    (e) => { assert.doesNotMatch(e.message, /SECRET-VALUE/); return true; },
  );
});

test('CORS origin faqat sxema+host; yo\'l bilan rad', () => {
  assert.throws(() => loadConfig({ ...base, CORS_ORIGINS: 'https://lms.coddycamp.uz/lesson' }), /yo'lsiz/);
  assert.throws(() => loadConfig({ ...base, CORS_ORIGINS: 'lms.coddycamp.uz' }), /origin noto'g'ri/);
  const c = loadConfig({ ...base, CORS_ORIGINS: ' https://lms.coddycamp.uz/ , https://a.vercel.app' });
  assert.deepEqual(c.corsOrigins, ['https://lms.coddycamp.uz', 'https://a.vercel.app']);
});

test('prod: HOST faqat 127.0.0.1, CORS faqat https, mentor-kod ≥6', () => {
  const prod = { DARS_ENV: 'prod', DATABASE_URL: 'postgres://u:p@h/db', CORS_ORIGINS: 'http://x.uz', LIVE_MENTOR_CODE: 'abc', HOST: '0.0.0.0' };
  // proksisiz 0.0.0.0 — HOST xatosi
  assert.throws(() => loadConfig({ ...prod, TRUST_PROXY: 'false' }), (e) => {
    const p = e.problems.join('\n');
    assert.match(p, /HOST: prod\/staging/);
    assert.match(p, /faqat https/);
    assert.match(p, /kamida 6 belgi/);
    return true;
  });
  // konteyner: 0.0.0.0 faqat TRUST_PROXY=true bilan — HOST muammosi bo'lmasin (boshqa muammolar qolsa ham)
  assert.throws(() => loadConfig({ ...prod, TRUST_PROXY: 'true' }), (e) => {
    assert.doesNotMatch(e.problems.join('\n'), /HOST:/);
    return true;
  });
  assert.throws(() => loadConfig({ ...prod, HOST: '10.0.0.5', TRUST_PROXY: 'true' }), (e) => {
    assert.match(e.problems.join('\n'), /HOST:/);
    return true;
  });
  // prod'da LMS-ko'prik ham majburiy
  assert.throws(() => loadConfig({ ...prod, HOST: '127.0.0.1', CORS_ORIGINS: 'https://lms.coddycamp.uz', LIVE_MENTOR_CODE: 'MENTOR-2026' }), (e) => {
    assert.match(e.problems.join('\n'), /CODDYCAMP_LIVE_JWT_SECRET: majburiy/);
    assert.match(e.problems.join('\n'), /TOKEN_ENC_KEY: majburiy/);
    return true;
  });
  const LMS = {
    CODDYCAMP_CONTEXT_API_TOKEN: 'sapi_x', CODDYCAMP_RESULTS_API_TOKEN: 'sapi_y',
    CODDYCAMP_LIVE_JWT_SECRET: 'base64:' + Buffer.alloc(48, 1).toString('base64'),
    CODDYCAMP_LIVE_JWT_ISSUER: 'coddycamp-lms', CODDYCAMP_LIVE_JWT_AUDIENCE: 'dars-platform', CODDYCAMP_LIVE_JWT_KEY_ID: 'v1',
    TOKEN_ENC_KEY: Buffer.alloc(32, 2).toString('base64'),
  };
  const ok = loadConfig({ ...prod, ...LMS, HOST: '127.0.0.1', CORS_ORIGINS: 'https://lms.coddycamp.uz', LIVE_MENTOR_CODE: 'MENTOR-2026' });
  assert.equal(ok.trustProxy, true);
  assert.equal(ok.logLevel, 'info');
  assert.equal(ok.lmsBridgeEnabled, true);
});

test('LMS-ko\'prik: dev\'da ixtiyoriy (o\'chiq), rotatsiya juftligi, enc-kalit uzunligi', () => {
  assert.equal(loadConfig(base).lmsBridgeEnabled, false);
  assert.throws(() => loadConfig({ ...base, CODDYCAMP_LIVE_JWT_SECRET_NEXT: 'abc-abc-abc-abc-abc' }), /ikkalasi birga/);
  assert.throws(() => loadConfig({ ...base, TOKEN_ENC_KEY: 'c2hvcnQ=' }), /32 bayt/);
  assert.throws(() => loadConfig({ ...base, CODDYCAMP_LIVE_JWT_SECRET: 'short' }), /juda qisqa/);
});

test('TRUST_PROXY va butun sonlar qat\'iy', () => {
  assert.throws(() => loadConfig({ ...base, TRUST_PROXY: 'yes' }), /true, false yoki proksi soni/);
  assert.equal(loadConfig({ ...base, TRUST_PROXY: '1' }).trustProxy, 1, 'raqam = proksi soni (Fastify hop count)');
  assert.equal(loadConfig({ ...base, TRUST_PROXY: '0' }).trustProxy, false);
  assert.throws(() => loadConfig({ ...base, RATE_LIMIT_PER_MIN: '5' }), /10\.\.100000/);
  assert.equal(loadConfig({ ...base, TRUST_PROXY: '1', DB_POOL_MAX: '3' }).dbPoolMax, 3);
});

test('RESULT_DETAILS: off (default) | a; boshqasi xato', () => {
  assert.equal(loadConfig(base).resultDetails, 'off');
  assert.equal(loadConfig({ ...base, RESULT_DETAILS: 'a' }).resultDetails, 'a');
  assert.throws(() => loadConfig({ ...base, RESULT_DETAILS: 'b' }), /off \| a/);
});
