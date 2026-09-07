// Migratsiya-yurgizgich: migrations/NNNN_nom.sql fayllarini tartib bilan, har birini tranzaksiyada qo'llaydi.
// Qoidalar:
//  - qo'llanilgan fayl QAYTA TAHRIRLANMAYDI — checksum mos kelmasa yurgizgich to'xtaydi (yangi fayl yoziladi);
//  - bir vaqtda ikki yurgizgich ishlamasin — pg_advisory_lock;
//  - CRLF/LF farqi checksum'ni buzmasin (Windows'da yoziladi, Linux'da yuradi) — normalizatsiya;
//  - bazada bor, faylda yo'q migratsiya = xavfli holat, to'xtaydi.
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LOCK_KEY = 727001; // ixtiyoriy doimiy; faqat shu yurgizgich ishlatadi
const FILE_RE = /^(\d{4})_([a-z0-9_]+)\.sql$/;

export const DEFAULT_MIGRATIONS_DIR = fileURLToPath(new URL('../../migrations/', import.meta.url));

export function checksumOf(sql) {
  return createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex');
}

/** @returns {Promise<Array<{ id: string, name: string, sql: string, checksum: string }>>} */
export async function listMigrationFiles(dir = DEFAULT_MIGRATIONS_DIR) {
  const names = (await readdir(dir)).filter((n) => FILE_RE.test(n)).sort();
  const seen = new Set();
  for (const n of names) {
    const num = n.slice(0, 4);
    if (seen.has(num)) throw new Error(`migratsiya raqami takrorlangan: ${num} (${n})`);
    seen.add(num);
  }
  const out = [];
  for (const name of names) {
    const sql = await readFile(path.join(dir, name), 'utf8');
    out.push({ id: name.replace(/\.sql$/, ''), name, sql, checksum: checksumOf(sql) });
  }
  return out;
}

async function ensureTable(client) {
  await client.query(`
    create table if not exists schema_migrations (
      id         text primary key,
      checksum   text not null,
      applied_at timestamptz not null default now()
    )`);
}

/**
 * Qo'llanilmagan migratsiyalar ro'yxati (start-tekshiruvi uchun). Jadval bo'lmasa — hammasi kutilmoqda.
 * @param {{ pool: import('pg').Pool, dir?: string }} opts
 */
export async function pendingMigrations({ pool, dir = DEFAULT_MIGRATIONS_DIR }) {
  const files = await listMigrationFiles(dir);
  const { rows } = await pool.query(
    `select id, checksum from schema_migrations`
  ).catch((e) => (e.code === '42P01' ? { rows: [] } : Promise.reject(e))); // 42P01 = jadval yo'q
  const applied = new Map(rows.map((r) => [r.id, r.checksum]));
  const pending = [];
  for (const f of files) {
    const prev = applied.get(f.id);
    if (prev === undefined) pending.push(f.name);
    else if (prev !== f.checksum) throw new Error(`qo'llanilgan migratsiya o'zgartirilgan: ${f.name}`);
  }
  return pending;
}

/**
 * @param {{ pool: import('pg').Pool, dir?: string, log?: { info: Function } }} opts
 * @returns {Promise<{ applied: string[], total: number }>}
 */
export async function runMigrations({ pool, dir = DEFAULT_MIGRATIONS_DIR, log }) {
  const client = await pool.connect();
  try {
    await client.query('select pg_advisory_lock($1)', [LOCK_KEY]);
    await ensureTable(client);

    const files = await listMigrationFiles(dir);
    const { rows } = await client.query('select id, checksum from schema_migrations order by id');
    const applied = new Map(rows.map((r) => [r.id, r.checksum]));

    for (const id of applied.keys()) {
      if (!files.some((f) => f.id === id)) {
        throw new Error(`bazada qo'llanilgan migratsiya faylda yo'q: ${id} — fayl o'chirilgan yoki noto'g'ri baza`);
      }
    }

    const done = [];
    for (const f of files) {
      const prev = applied.get(f.id);
      if (prev !== undefined) {
        if (prev !== f.checksum) {
          throw new Error(`qo'llanilgan migratsiya o'zgartirilgan: ${f.name}. Eskisini tahrirlamang — yangi fayl yozing.`);
        }
        continue;
      }
      log?.info({ migration: f.name }, "migratsiya qo'llanmoqda");
      await client.query('begin');
      try {
        await client.query(f.sql);
        await client.query('insert into schema_migrations (id, checksum) values ($1, $2)', [f.id, f.checksum]);
        await client.query('commit');
      } catch (err) {
        await client.query('rollback').catch(() => {});
        err.message = `${f.name}: ${err.message}`;
        throw err;
      }
      done.push(f.name);
    }
    return { applied: done, total: files.length };
  } finally {
    await client.query('select pg_advisory_unlock($1)', [LOCK_KEY]).catch(() => {});
    client.release();
  }
}
