// Integratsion testlar uchun baza: har test-faylda toza sxema + barcha migratsiyalar.
// Talab: docker compose up -d (dars_test bazasi initdb'da yaratiladi).
import pg from 'pg';
import { runMigrations } from '../../src/db/migrate.js';

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgres://dars:dars@127.0.0.1:5433/dars_test';

/** Toza baza: public sxema qayta yaratiladi, migratsiyalar qo'llanadi. */
export async function freshDatabase() {
  const pool = new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 4, application_name: 'dars-api-test' });
  try {
    await pool.query('drop schema public cascade; create schema public;');
  } catch (e) {
    e.message = `Test bazasiga ulanib bo'lmadi (${TEST_DATABASE_URL}). docker compose up -d qilinganmi? ${e.message}`;
    await pool.end().catch(() => {});
    throw e;
  }
  await runMigrations({ pool });
  return pool;
}

/** PL/pgSQL `raise exception` xabarini kutish uchun qulay yordamchi. */
export async function expectPgError(promise, messageIncludes) {
  try {
    await promise;
  } catch (e) {
    if (e.code !== 'P0001') throw new Error(`P0001 kutilgan edi, keldi: ${e.code} ${e.message}`);
    if (messageIncludes && !e.message.includes(messageIncludes)) {
      throw new Error(`xabarda «${messageIncludes}» kutilgan edi, keldi: «${e.message}»`);
    }
    return e;
  }
  throw new Error(`xato kutilgan edi (${messageIncludes ?? 'P0001'}), lekin so'rov muvaffaqiyatli o'tdi`);
}
