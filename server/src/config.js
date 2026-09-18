// Konfiguratsiya — faqat env'dan o'qiladi va START vaqtida to'liq tekshiriladi.
// Qoidalar:
//  - qiymatlar hech qachon log'ga yozilmaydi; xatoda faqat o'zgaruvchi NOMI aytiladi;
//  - hamma muammo bir yo'la yig'ilib, bitta xato bilan qaytariladi (birma-bir topish emas);
//  - natija muzlatilgan (Object.freeze) — ish vaqtida o'zgartirib bo'lmaydi.
//
// Ikki qatlam: JONLI-API (har doim) va LMS-KO'PRIK (CODDYCAMP_* + TOKEN_ENC_KEY berilsa).
// Prod/staging'da ko'prik majburiy; dev/test'da berilmasa ko'prik marshrutlari 503 qaytaradi.

export const DARS_ENVS = Object.freeze(['dev', 'test', 'staging', 'prod']);
const LOG_LEVELS = Object.freeze(['fatal', 'error', 'warn', 'info', 'debug', 'trace']);

const parseInt_ = (min, max) => (raw) => {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`butun son ${min}..${max} bo'lsin`);
  return n;
};

const parseBool = (raw) => {
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  throw new Error("true yoki false bo'lsin");
};

const parseList = (raw) => raw.split(',').map((s) => s.trim()).filter(Boolean);

// TRUST_PROXY. To'g'ri qiymat — ISHONCHLI TARMOQLAR ro'yxati (masalan `loopback,172.16.0.0/12`).
// Nega son emas: konteyner oldida docker-proxy turadi va soket manzili doim docker ko'prigi
// (172.x.0.1). Fastify 5 da son berilsa req.ip o'sha ko'prik bo'lib qoladi — YA'NI HAMMA MIJOZ
// BITTA req.ip ga tushadi va rate-limit hammaga bitta chelak bo'ladi (jonli darsda hamma 429 oladi).
// `true` esa mijoz o'zi yuborgan X-Forwarded-For ning eng chap qiymatini oladi — soxtalash mumkin.
// Ro'yxat berilsa: ko'prik ishonchli, undan chapdagi birinchi ishonchsiz manzil = haqiqiy mijoz.
// Son va `true` moslik uchun qoldirilgan, lekin prod uchun tavsiya etilmaydi.
const TRUST_PRESETS = new Set(['loopback', 'linklocal', 'uniquelocal']);
const parseTrustProxy = (raw) => {
  if (raw === 'true') return true;
  if (raw === 'false' || raw === '0') return false;
  const n = Number(raw);
  if (Number.isInteger(n) && n >= 1 && n <= 10) return n;
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const ok = list.length > 0 && list.every((v) => TRUST_PRESETS.has(v) || /^[0-9a-fA-F.:]+(\/\d{1,3})?$/.test(v));
  if (ok) return list;
  throw new Error("true, false yoki proksi soni 1..10, yoki ishonchli tarmoqlar ro'yxati bo'lsin");
};

const parseOrigins = (raw) => {
  const items = parseList(raw);
  return items.map((o) => {
    let u;
    try { u = new URL(o); } catch { throw new Error(`origin noto'g'ri: ${o}`); }
    if (!['http:', 'https:'].includes(u.protocol)) throw new Error(`origin faqat http/https: ${o}`);
    if (u.pathname !== '/' || u.search || u.hash || u.username || u.password) {
      throw new Error(`origin faqat sxema+host bo'lsin (yo'lsiz): ${o}`);
    }
    return u.origin;
  });
};

const parseHttpsUrl = (raw) => {
  let u;
  try { u = new URL(raw); } catch { throw new Error('URL noto\'g\'ri'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('faqat http/https');
  return u.origin + u.pathname.replace(/\/+$/, '');
};

// base64 → 32 bayt (AES-256-GCM). Qiymat qaytarilmaydi, faqat tekshiriladi.
const parseEncKey = (raw) => {
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) throw new Error('base64 ko\'rinishida aynan 32 bayt bo\'lsin (openssl rand -base64 32)');
  return raw;
};

/**
 * @param {Record<string, string|undefined>} env
 */
export function loadConfig(env = process.env) {
  const problems = [];

  const read = (name, { required = false, def, enums, parse } = {}) => {
    const raw = env[name];
    if (raw === undefined || raw === '') {
      if (required) { problems.push(`${name}: majburiy, berilmagan`); return undefined; }
      return def;
    }
    let val = raw;
    if (parse) {
      try { val = parse(raw); } catch (e) { problems.push(`${name}: ${e.message}`); return undefined; }
    }
    if (enums && !enums.includes(val)) {
      problems.push(`${name}: ruxsat etilgan qiymatlar — ${enums.join(' | ')}`);
      return undefined;
    }
    return val;
  };

  const darsEnv = read('DARS_ENV', { required: true, enums: DARS_ENVS });
  const isProdLike = darsEnv === 'prod' || darsEnv === 'staging';

  const cfg = {
    env: darsEnv,
    isProdLike,
    host: read('HOST', { def: '127.0.0.1' }),
    port: read('PORT', { def: 3001, parse: parseInt_(1, 65535) }),
    logLevel: read('LOG_LEVEL', { def: isProdLike ? 'info' : 'debug', enums: LOG_LEVELS }),
    trustProxy: read('TRUST_PROXY', { def: isProdLike, parse: parseTrustProxy }),
    databaseUrl: read('DATABASE_URL', { required: true }),
    migrateDatabaseUrl: read('MIGRATE_DATABASE_URL'),
    dbPoolMax: read('DB_POOL_MAX', { def: 10, parse: parseInt_(1, 100) }),
    corsOrigins: read('CORS_ORIGINS', { required: isProdLike, def: [], parse: parseOrigins }),
    liveMentorCode: read('LIVE_MENTOR_CODE', { required: isProdLike }),
    rateLimitPerMin: read('RATE_LIMIT_PER_MIN', { def: 300, parse: parseInt_(10, 100000) }),
    // Marshrut-limitlarini ko'paytiruvchi (yuklama-sinov / katta maktab NAT'i uchun). Prod'da odatda 1.
    rateLimitScale: read('RATE_LIMIT_SCALE', { def: 1, parse: parseInt_(1, 1000) }),
    gitSha: read('GIT_SHA', { def: 'dev' }),

    // ---- LMS-ko'prik (Coddy Camp School API + liveToken JWT). Prod/staging'da majburiy.
    schoolApiUrl: read('CODDYCAMP_SCHOOL_API_URL', { def: 'https://school-api.coddycamp.uz', parse: parseHttpsUrl }),
    contextApiToken: read('CODDYCAMP_CONTEXT_API_TOKEN', { required: isProdLike }),
    resultsApiToken: read('CODDYCAMP_RESULTS_API_TOKEN', { required: isProdLike }),
    jwt: {
      secret: read('CODDYCAMP_LIVE_JWT_SECRET', { required: isProdLike }),
      issuer: read('CODDYCAMP_LIVE_JWT_ISSUER', { required: isProdLike }),
      audience: read('CODDYCAMP_LIVE_JWT_AUDIENCE', { required: isProdLike }),
      keyId: read('CODDYCAMP_LIVE_JWT_KEY_ID', { required: isProdLike }),
      // Rotatsiya: ikkinchi kalit (kid v2) — ikkalasi ham qabul qilinadi, imzo tanlangan kalit bilan tekshiriladi
      secretNext: read('CODDYCAMP_LIVE_JWT_SECRET_NEXT'),
      keyIdNext: read('CODDYCAMP_LIVE_JWT_KEY_ID_NEXT'),
      maxTtlSeconds: read('CODDYCAMP_LIVE_JWT_MAX_TTL_SECONDS', { def: 43200, parse: parseInt_(60, 86400) }),
      clockToleranceSeconds: 60,
    },
    tokenEncKey: read('TOKEN_ENC_KEY', { required: isProdLike, parse: parseEncKey }),
    contextCacheTtlSeconds: read('CONTEXT_CACHE_TTL_SECONDS', { def: 300, parse: parseInt_(0, 3600) }),
    schoolApiTimeoutMs: read('SCHOOL_API_TIMEOUT_MS', { def: 5000, parse: parseInt_(500, 30000) }),

    // Tashlandiq jonli sessiya: mentor heartbeat'i shuncha daqiqa kelmasa yopiladi (natija tangaga ketadi).
    // 30 daqiqa = 15 daqiqalik tanaffusni qamraydi; kamaytirmang (tanaffusda dars yopilib ketadi).
    staleSessionMinutes: read('STALE_SESSION_MINUTES', { def: 30, parse: parseInt_(5, 720) }),

    // Natija-detallari (TZ_LESSON_RESULT_DETAILS_RU): off = faqat asosiy StudentResult · a = A-variant (lang, questions[],
    // achievements[] o'sha hodisa ichida). LMS kontraktni tasdiqlaguncha OFF; tasdiqlangach env'da `a`.
    resultDetails: read('RESULT_DETAILS', { def: 'off', enums: ['off', 'a'] }),

    // Tanga-qoidasi jonli hodisada (F-0918-04): skip = shu dars bo'yicha oldin TUGALLANGAN natijasi bor o'quvchi yangi jonli
    // hodisadan chiqariladi (bir o'quvchi — bir dars — bitta natija; prod shunday). send = eski xulq: har sessiya hammani
    // yuboradi — FAQAT sinov muhiti uchun (o'sha test-o'quvchi bilan bitta darsni qayta-qayta sinash kerak bo'lganda).
    resultLiveRepeat: read('RESULT_LIVE_REPEAT', { def: 'skip', enums: ['skip', 'send'] }),

    // ---- Natija-navbat ishchisi va kuzatuv
    resultsWorkerEnabled: read('RESULTS_WORKER_ENABLED', { def: true, parse: parseBool }),
    resultsTickMs: read('RESULTS_TICK_MS', { def: 5000, parse: parseInt_(1000, 600000) }),
    telegramBotToken: read('TELEGRAM_BOT_TOKEN'),
    telegramChatId: read('TELEGRAM_CHAT_ID'),
    adminUser: read('ADMIN_USER'),
    adminPassword: read('ADMIN_PASSWORD'),
  };

  if (cfg.migrateDatabaseUrl === undefined) cfg.migrateDatabaseUrl = cfg.databaseUrl;

  // Ko'prik yoqiqmi: hamma kerakli qiymat bor bo'lsa
  cfg.lmsBridgeEnabled = !!(cfg.jwt.secret && cfg.jwt.issuer && cfg.jwt.audience && cfg.jwt.keyId && cfg.contextApiToken && cfg.tokenEncKey);

  // Prod/staging: yo 127.0.0.1 (systemd + Caddy), yo 0.0.0.0 KONTEYNER ichida — bunda proksi ortida ekani
  // (TRUST_PROXY=true) shart; compose portni faqat 127.0.0.1 ga chiqaradi. Boshqa manzil — xato.
  const hostLocal = cfg.host === '127.0.0.1' || cfg.host === 'localhost';
  const hostContainer = cfg.host === '0.0.0.0' && cfg.trustProxy;
  if (isProdLike && !hostLocal && !hostContainer) {
    problems.push('HOST: prod/staging da 127.0.0.1 (proksi orqasida) yoki 0.0.0.0 faqat TRUST_PROXY=true bilan (konteyner)');
  }
  if (isProdLike && cfg.corsOrigins && cfg.corsOrigins.some((o) => o.startsWith('http://'))) {
    problems.push('CORS_ORIGINS: prod/staging da faqat https origin');
  }
  if (cfg.liveMentorCode !== undefined && cfg.liveMentorCode.length < 6) {
    problems.push('LIVE_MENTOR_CODE: kamida 6 belgi');
  }
  if ((cfg.jwt.secretNext && !cfg.jwt.keyIdNext) || (!cfg.jwt.secretNext && cfg.jwt.keyIdNext)) {
    problems.push('CODDYCAMP_LIVE_JWT_SECRET_NEXT va CODDYCAMP_LIVE_JWT_KEY_ID_NEXT — ikkalasi birga beriladi');
  }
  if (cfg.jwt.keyIdNext && cfg.jwt.keyIdNext === cfg.jwt.keyId) {
    problems.push('CODDYCAMP_LIVE_JWT_KEY_ID_NEXT: asosiy kid bilan bir xil bo\'lmasin');
  }
  if (cfg.jwt.secret !== undefined && cfg.jwt.secret.length < 16) {
    problems.push('CODDYCAMP_LIVE_JWT_SECRET: juda qisqa');
  }
  if (isProdLike && cfg.schoolApiUrl && !cfg.schoolApiUrl.startsWith('https://')) {
    problems.push('CODDYCAMP_SCHOOL_API_URL: prod/staging da faqat https');
  }
  if (!!cfg.telegramBotToken !== !!cfg.telegramChatId) {
    problems.push('TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID — ikkalasi birga beriladi');
  }
  if (!!cfg.adminUser !== !!cfg.adminPassword) {
    problems.push('ADMIN_USER va ADMIN_PASSWORD — ikkalasi birga beriladi');
  }
  if (cfg.adminPassword !== undefined && cfg.adminPassword.length < 12) {
    problems.push('ADMIN_PASSWORD: kamida 12 belgi');
  }
  cfg.adminEnabled = !!(cfg.adminUser && cfg.adminPassword);

  if (problems.length) {
    const err = new Error(`Konfiguratsiya xatosi:\n - ${problems.join('\n - ')}`);
    err.code = 'CONFIG_INVALID';
    err.problems = problems;
    throw err;
  }
  Object.freeze(cfg.jwt);
  return Object.freeze(cfg);
}
