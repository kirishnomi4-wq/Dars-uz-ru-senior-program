// PostgreSQL ulanish-havzasi. Bitta pool — butun ilova; tranzaksiya kerak bo'lsa withTransaction.
import pg from 'pg';

/**
 * @param {{ connectionString: string, max?: number, log: import('pino').Logger, applicationName?: string }} opts
 */
export function createPool({ connectionString, max = 10, log, applicationName = 'dars-api' }) {
  const pool = new pg.Pool({
    connectionString,
    max,
    application_name: applicationName,
    // Har bir so'rov 5 s dan oshsa baza uni bekor qiladi (57014) — osilib qolgan so'rov havzani band qilmasin.
    statement_timeout: 5000,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    // Yopilgan ulanishlarni bo'sh turganda tekshirib turadi
    allowExitOnIdle: false,
  });
  // Bo'sh turgan ulanishda tarmoq xatosi bo'lsa pool uni tashlaydi; jarayon yiqilmasin
  pool.on('error', (err) => log.error({ err }, "pg pool: bo'sh ulanishda xato"));
  return pool;
}

/**
 * begin/commit/rollback bilan o'raydi. fn ichida faqat `client` ishlatilsin (pool emas).
 * @template T
 * @param {pg.Pool} pool
 * @param {(client: pg.PoolClient) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const result = await fn(client);
    await client.query('commit');
    return result;
  } catch (err) {
    try { await client.query('rollback'); } catch { /* ulanish allaqachon buzilgan bo'lishi mumkin */ }
    throw err;
  } finally {
    client.release();
  }
}
