// Kirish nuqtasi: config → logger → pool → migratsiya-tekshiruv → app → listen → nazokatli yopish.
// Ilova migratsiyani O'ZI QILMAYDI (deploy.sh qiladi); faqat qolgan migratsiya bo'lsa xato bilan to'xtaydi.
import { readFile } from 'node:fs/promises';
import { loadConfig } from './config.js';
import { createLogger } from './lib/logger.js';
import { createPool } from './db/pool.js';
import { pendingMigrations } from './db/migrate.js';
import { buildApp } from './app.js';
import { syncAppConfig } from './modules/live/app-config.js';
import { startMaintenance, closeStaleSessionsJob, closeOrphanLmsSessionsJob } from './modules/live/maintenance.js';
import { runLmsMaintenance } from './modules/lms/maintenance.js';

let config;
try {
  config = loadConfig();
} catch (e) {
  // logger hali yo'q — oddiy stderr
  console.error(e.message);
  process.exit(2);
}

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const version = `${pkg.version}+${config.gitSha}`;
const logger = createLogger(config);
const pool = createPool({ connectionString: config.databaseUrl, max: config.dbPoolMax, log: logger });

const pending = await pendingMigrations({ pool }).catch((e) => {
  logger.fatal({ err: e }, 'migratsiya holatini o\'qib bo\'lmadi (baza ishlayaptimi?)');
  process.exit(1);
});
if (pending.length) {
  logger.fatal({ pending }, "qo'llanilmagan migratsiya bor — avval `npm run migrate`");
  process.exit(1);
}

await syncAppConfig(pool, config, logger);

const app = await buildApp({ config, pool, logger, version });
if (app.results && config.resultsWorkerEnabled) {
  app.results.start(config.resultsTickMs);
  logger.info({ tickMs: config.resultsTickMs }, 'natija-navbat ishchisi yoqildi');
}
const maintenance = startMaintenance({
  pool,
  log: logger,
  jobs: [
    { name: 'close_stale_sessions', run: (p, l) => closeStaleSessionsJob(p, l, config.staleSessionMinutes) },
    ...(config.lmsBridgeEnabled ? [
      { name: 'close_orphan_lms_sessions', run: closeOrphanLmsSessionsJob },   // F-0911-01
      { name: 'lms_attempts', run: runLmsMaintenance },
    ] : []),
  ],
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, "to'xtatilmoqda: yangi so'rovlar qabul qilinmaydi, ochiqlari tugatiladi");
  const killer = setTimeout(() => { logger.error("yopish 10 s dan oshdi — majburan chiqish"); process.exit(1); }, 10_000);
  killer.unref();
  try {
    maintenance.stop();
    app.results?.stop();
    await app.close();
    await pool.end();
    logger.info("to'xtadi");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'yopishda xato');
    process.exit(1);
  }
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => { logger.fatal({ err: reason }, 'unhandledRejection'); process.exit(1); });
process.on('uncaughtException', (err) => { logger.fatal({ err }, 'uncaughtException'); process.exit(1); });

await app.listen({ host: config.host, port: config.port });
logger.info({ env: config.env, version, host: config.host, port: config.port }, 'dars-api tayyor');
