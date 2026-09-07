#!/usr/bin/env node
// seed-catalog — server/data/lesson-catalog.json → lesson_catalog (upsert). Katalogda yo'q darslar active=false qilinadi.
//   npm run seed:catalog            (env: DATABASE_URL yoki MIGRATE_DATABASE_URL)
// Deploy'da migratsiyadan keyin yuritiladi; katalog o'zgarmasa hech narsa o'zgarmaydi (idempotent).
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { loadConfig } from '../src/config.js';

let config;
try { config = loadConfig(); } catch (e) { console.error(e.message); process.exit(2); }

const file = new URL('../data/lesson-catalog.json', import.meta.url);
const { lessons } = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(lessons) || !lessons.length) { console.error('katalog bo\'sh — avval: node scripts/gen-lesson-catalog.mjs (repo ildizida)'); process.exit(1); }

const pool = new pg.Pool({ connectionString: config.migrateDatabaseUrl, max: 2, application_name: 'dars-api-seed' });
const client = await pool.connect();
try {
  await client.query('begin');
  let upserted = 0;
  for (const l of lessons) {
    const r = await client.query(
      `insert into lesson_catalog (lesson_id, title_uz, title_ru, version, active, updated_at)
       values ($1, $2, $3, $4, true, now())
       on conflict (lesson_id) do update
         set title_uz = excluded.title_uz, title_ru = excluded.title_ru, version = excluded.version, active = true, updated_at = now()
         where (lesson_catalog.title_uz, lesson_catalog.title_ru, lesson_catalog.version, lesson_catalog.active)
               is distinct from (excluded.title_uz, excluded.title_ru, excluded.version, true)`,
      [l.lesson_id, l.title_uz, l.title_ru, l.version],
    );
    upserted += r.rowCount;
  }
  const off = await client.query(
    `update lesson_catalog set active = false, updated_at = now() where active and lesson_id <> all($1::text[])`,
    [lessons.map((l) => l.lesson_id)],
  );
  await client.query('commit');
  console.log(`[seed:catalog] ${lessons.length} dars · yangilandi ${upserted} · o'chirildi (active=false) ${off.rowCount}`);
} catch (e) {
  await client.query('rollback').catch(() => {});
  console.error(`[seed:catalog] XATO: ${e.message}`);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
