import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromPgError } from '../../src/lib/errors.js';

test("F-0918-01: PG raise «Mentor kodi noto'g'ri» → 403 forbidden (klient «Mentor kodi noto'g'ri.» ko'rsatadi); boshqa raise → 400 domain_error", () => {
  const e = fromPgError({ code: 'P0001', message: "Mentor kodi noto'g'ri" });
  assert.deepEqual([e.code, e.statusCode, e.message], ['forbidden', 403, "Mentor kodi noto'g'ri"]);
  const d = fromPgError({ code: 'P0001', message: 'Dars identifikatori berilmagan' });
  assert.deepEqual([d.code, d.statusCode], ['domain_error', 400]);
  assert.equal(fromPgError({ code: 'XX000', message: 'x' }), null);
  assert.equal(fromPgError(null), null);
});
