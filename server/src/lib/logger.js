// Logger — pino (Fastify bilan bir xil). Asosiy qoida: sir va shaxsiy ma'lumot LOG'GA TUSHMAYDI.
// LMS v1.2 §10: token, JWT, sapi_, ism, to'liq payload log'lanmaydi. Shu yerda redact bilan majburlanadi.
import pino from 'pino';

const SECRET_KEYS = [
  'token', 'p_token', 'mentor_token', 'player_token', 'live_token', 'liveToken', 'jwt', 'authorization',
  'p_mentor_code', 'mentor_code', 'secret', 'password', 'apikey', 'cookie',
];
const PERSONAL_KEYS = ['nickname', 'p_nickname', 'name', 'display_name', 'crm_id'];

// pino'da '*' faqat bitta darajani qamraydi — shuning uchun 1..3 chuqurlik alohida yoziladi.
const depthPaths = (key) => [key, `*.${key}`, `*.*.${key}`, `*.*.*.${key}`];

export const REDACT_PATHS = Object.freeze([
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  ...SECRET_KEYS.flatMap(depthPaths),
  ...PERSONAL_KEYS.flatMap(depthPaths),
]);

/**
 * @param {{ logLevel: string, env: string }} cfg
 */
export function createLogger(cfg) {
  const pretty = cfg.env === 'dev' || cfg.env === 'test';
  return pino({
    level: cfg.logLevel,
    base: { service: 'dars-api', env: cfg.env },
    redact: { paths: [...REDACT_PATHS], censor: '[redacted]' },
    // dev'da o'qiladigan ko'rinish; prod'da toza JSON (journald → grep/jq)
    transport: pretty
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss.l', ignore: 'pid,hostname,service,env' } }
      : undefined,
  });
}
