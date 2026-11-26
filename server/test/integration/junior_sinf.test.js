// Junior sinf aloqasi (0019): kalit tekshiruvi, kim kimni ko'radi, tartib, dars tugagach yozish yo'q, tozalash.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeTestApp, post, TEST_MENTOR_CODE } from '../helpers/app.js';
import { juniorTozalashJob } from '../../src/modules/junior/routes.js';

let t;
before(async () => { t = await makeTestApp(); });
after(async () => { await t?.close(); });

const rpc = (fn, body) => post(t.app, `/api/v1/live/rpc/${fn}`, body);
const yubor = (body) => post(t.app, '/api/v1/junior/yubor', body);
const oqi = (body) => post(t.app, '/api/v1/junior/oqi', body);

async function sinf() {
  const m = (await rpc('create_session', { p_lesson_id: 'junior-001-tanishuv-v1', p_mentor_code: TEST_MENTOR_CODE })).json()[0];
  const a = (await rpc('join_session', { p_pin: m.pin, p_nickname: 'Ali' })).json()[0];
  const b = (await rpc('join_session', { p_pin: m.pin, p_nickname: 'Vali' })).json()[0];
  const U = { pin: m.pin, kim: 'ustoz', token: m.token };
  const A = { pin: m.pin, kim: a.player_id, token: a.token };
  const B = { pin: m.pin, kim: b.player_id, token: b.token };
  return { m, U, A, B };
}

test('birinchi ulanish (dan=-1) faqat joriy raqamni beradi', async () => {
  const { U, A } = await sinf();
  let r = await oqi({ ...U, dan: -1 });
  assert.equal(r.statusCode, 200, r.body);
  assert.deepEqual(r.json(), { n: 0, x: [] });
  assert.equal((await yubor({ ...U, x: { t: 'qadam', i: 3 } })).statusCode, 204);
  r = await oqi({ ...A, dan: -1 });
  assert.deepEqual(r.json(), { n: 1, x: [] });
});

test('ustoz hammaning xabarini oladi (o\'zinikini emas); o\'quvchi faqat ustoznikini', async () => {
  const { U, A, B } = await sinf();
  await yubor({ ...U, x: { t: 'qadam', i: 1 } });
  await yubor({ ...A, x: { t: 'tanladi', k: 'momiq' } });
  await yubor({ ...B, x: { t: 'bloklar', x: { right: 3 } } });
  await yubor({ ...U, x: { t: 'kimbor' } });

  const u = (await oqi({ ...U, dan: 0 })).json();
  assert.equal(u.n, 4);
  assert.deepEqual(u.x.map((x) => x.t), ['tanladi', 'bloklar']);

  const a = (await oqi({ ...A, dan: 0 })).json();
  assert.deepEqual(a.x.map((x) => x.t), ['qadam', 'kimbor']);   // Vali'ning bloklari Ali'ga bormaydi

  const a2 = (await oqi({ ...A, dan: 2 })).json();
  assert.deepEqual(a2.x.map((x) => x.t), ['kimbor']);
});

test('o\'quvchi xabaridagi `kim` server tomonidan o\'z id\'siga almashadi', async () => {
  const { U, A, B } = await sinf();
  await yubor({ ...A, x: { t: 'tanladi', kim: B.kim, k: 'jele' } });
  const u = (await oqi({ ...U, dan: 0 })).json();
  assert.equal(u.x[0].kim, A.kim);
});

test('kalit noto\'g\'ri yoki boshqa sinfniki → rad', async () => {
  const s1 = await sinf();
  const s2 = await sinf();
  let r = await yubor({ ...s1.U, token: '0'.repeat(32), x: { t: 'qadam' } });
  assert.equal(r.statusCode, 400);
  assert.match(r.json().message, /Ruxsat/);
  r = await yubor({ ...s1.A, pin: s2.m.pin, x: { t: 'tanladi' } });      // 1-sinf bolasi 2-sinfga yoza olmaydi
  assert.match(r.json().message, /Ruxsat/);
  r = await oqi({ ...s2.U, token: s1.U.token, dan: 0 });                  // 1-sinf ustozi 2-sinfni o'qiy olmaydi
  assert.match(r.json().message, /Ruxsat/);
  r = await oqi({ ...s1.A, kim: 'ustoz', dan: 0 });                       // bola o'zini ustoz deb ko'rsata olmaydi
  assert.match(r.json().message, /Ruxsat/);
});

test('shakl: ortiqcha maydon, katta xabar, noto\'g\'ri kim → rad', async () => {
  const { U } = await sinf();
  assert.equal((await yubor({ ...U, x: { t: 'a' }, extra: 1 })).statusCode, 400);
  assert.equal((await yubor({ ...U, kim: 'admin', x: { t: 'a' } })).statusCode, 400);
  const r = await yubor({ ...U, x: { t: 'a', s: 'x'.repeat(17 * 1024) } });
  assert.equal(r.statusCode, 413);
});

test('dars tugagach yozib bo\'lmaydi, o\'qish ishlaydi', async () => {
  const { m, U, A } = await sinf();
  await yubor({ ...U, x: { t: 'tugadi' } });
  await rpc('end_session', { p_pin: m.pin, p_token: m.token });
  const r = await yubor({ ...A, x: { t: 'tayyor' } });
  assert.match(r.json().message, /Dars tugagan/);
  const a = (await oqi({ ...A, dan: 0 })).json();
  assert.deepEqual(a.x.map((x) => x.t), ['tugadi']);
});

test('bir vaqtda ko\'p yozuv: raqamlar teshiksiz va tartibli', async () => {
  const { U, A, B } = await sinf();
  await Promise.all(Array.from({ length: 30 }, (_, i) => yubor({ ...(i % 2 ? A : B), x: { t: 'pog', n: i } })));
  const u = (await oqi({ ...U, dan: 0 })).json();
  assert.equal(u.n, 30);
  assert.equal(u.x.length, 30);
});

test('tozalash: 1 kundan eskisi o\'chadi', async () => {
  const { U } = await sinf();
  await yubor({ ...U, x: { t: 'qadam' } });
  await t.db.query(`update junior_xabarlar set at = now() - interval '2 days' where pin = $1`, [U.pin]);
  const n = await juniorTozalashJob(t.db, { info() {} });
  assert.ok(n >= 1);
  const { rows } = await t.db.query('select count(*)::int as c from junior_xabarlar where pin = $1', [U.pin]);
  assert.equal(rows[0].c, 0);
});
