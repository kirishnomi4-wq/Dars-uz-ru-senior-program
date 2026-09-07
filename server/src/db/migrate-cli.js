#!/usr/bin/env node
// Buyruq-satr: npm run migrate  |  npm run migrate:status
// Deploy'da ilova START'dan OLDIN alohida yuritiladi (ilova o'zi migratsiya qilmaydi — xato aniq ko'rinsin,
// ikki nusxa bir vaqtda ko'tarilsa ham baza bir marta o'zgarsin).
import pg from 'pg';
import { loadConfig } from '../config.js';
import { runMigrations, pendingMigrations } from './migrate.js';

const statusOnly = process.argv.includes('--status');

let config;
try {
  config = loadConfig();
} catch (e) {
  console.error(e.message);
  process.exit(2);
}

const pool = new pg.Pool({ connectionString: config.migrateDatabaseUrl, max: 2, application_name: 'dars-api-migrate' });
const log = { info: (o, msg) => console.log(`[migrate] ${msg}: ${o?.migration ?? ''}`.trim()) };

try {
  if (statusOnly) {
    const pending = await pendingMigrations({ pool });
    console.log(pending.length ? `[migrate] kutilmoqda (${pending.length}):\n - ${pending.join('\n - ')}` : '[migrate] hammasi qo\'llanilgan');
    process.exitCode = pending.length ? 1 : 0;
  } else {
    const { applied, total } = await runMigrations({ pool, log });
    console.log(applied.length
      ? `[migrate] qo'llanildi ${applied.length} ta (jami ${total}): ${applied.join(', ')}`
      : `[migrate] yangi migratsiya yo'q (jami ${total})`);
  }
} catch (e) {
  console.error(`[migrate] XATO: ${e.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
