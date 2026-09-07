// Jonli-API: SQL funksiyalar ro'yxati (allowlist) + har birining so'rov-sxemasi.
// Klient (src/live/liveClient.js) `POST /api/v1/live/rpc/<fn>` ga PostgREST davridagi nomlar bilan (p_*) yuboradi.
// Sxema QASDDAN bo'sh-qo'l: ism uzunligi, kod to'g'riligi kabi qoidalarni SQL o'zi tekshiradi va o'quvchiga
// mo'ljallangan xabar qaytaradi («Bu ism band — boshqa ism tanlang»). Bu yerda faqat TUR va SHAKL nazorati.

export const PIN = { type: 'string', pattern: '^[0-9]{6}$' };
const TOKEN = { type: 'string', pattern: '^[0-9a-f]{32}$' };
const UUID = { type: 'string', format: 'uuid' };
// LMS v1.2 §7.3 lesson_id qoidasi bilan bir xil
export const LESSON_ID = { type: 'string', minLength: 1, maxLength: 128, pattern: '^[A-Za-z0-9][A-Za-z0-9._:@-]*$' };
const SCREEN = { type: 'integer', minimum: -1, maximum: 9999 };

const obj = (properties, required = Object.keys(properties)) => ({
  type: 'object',
  additionalProperties: false,
  properties,
  required,
});

/**
 * returns:
 *  - 'rows'   → setof: JSON massiv (klient rows[0] oladi)
 *  - 'scalar' → bitta qiymat (boolean/int) JSON sifatida
 *  - 'void'   → 204, tanasiz
 * rateLimit.max — IP bo'yicha daqiqasiga. Sinf bitta NAT-IP ortida bo'ladi: 30 o'quvchi × javob/heartbeat —
 * shuning uchun oddiy chaqiruvlar keng (600), faqat PIN-qidiruv va sessiya-ochish tor.
 */
export const RPC = Object.freeze({
  create_session: {
    args: ['p_lesson_id', 'p_mentor_code'],
    returns: 'rows',
    rateLimit: { max: 10 },
    body: obj({ p_lesson_id: LESSON_ID, p_mentor_code: { type: 'string', maxLength: 128 } }),
  },
  join_session: {
    args: ['p_pin', 'p_nickname'],
    returns: 'rows',
    rateLimit: { max: 20 }, // PIN-perebor himoyasi (1 000 000 kombinatsiya)
    body: obj({ p_pin: PIN, p_nickname: { type: 'string', maxLength: 64 } }),
  },
  advance_session: {
    args: ['p_pin', 'p_token', 'p_screen'],
    returns: 'void',
    body: obj({ p_pin: PIN, p_token: TOKEN, p_screen: SCREEN }),
  },
  session_heartbeat: {
    args: ['p_pin', 'p_token'],
    returns: 'void',
    body: obj({ p_pin: PIN, p_token: TOKEN }),
  },
  end_session: {
    args: ['p_pin', 'p_token'],
    returns: 'void',
    body: obj({ p_pin: PIN, p_token: TOKEN }),
  },
  reveal_screen: {
    args: ['p_pin', 'p_token', 'p_screen'],
    returns: 'void',
    body: obj({ p_pin: PIN, p_token: TOKEN, p_screen: SCREEN }),
  },
  quiz_control: {
    args: ['p_pin', 'p_token', 'p_state', 'p_q'],
    returns: 'void',
    body: obj(
      { p_pin: PIN, p_token: TOKEN, p_state: { type: 'string', enum: ['off', 'lobby', 'q', 'r', 'done'] }, p_q: { ...SCREEN, default: -1 } },
      ['p_pin', 'p_token', 'p_state'],
    ),
  },
  submit_answer: {
    args: ['p_pin', 'p_player_id', 'p_token', 'p_screen', 'p_question_id', 'p_picked', 'p_correct', 'p_elapsed_ms'],
    returns: 'scalar',
    body: obj({
      p_pin: PIN,
      p_player_id: UUID,
      p_token: TOKEN,
      p_screen: { type: 'integer', minimum: 0, maximum: 9999 },
      p_question_id: { type: 'string', maxLength: 64 },
      p_picked: { type: 'integer', minimum: -1, maximum: 999 },
      p_correct: { type: 'boolean' }, // server e'tiborga olmaydi — imzo mosligi uchun
      p_elapsed_ms: { type: 'integer', minimum: 0, maximum: 2147483647 }, // SQL 0..3 600 000 ga qirqadi
    }),
  },
  set_quiz_keys: {
    args: ['p_lesson_id', 'p_mentor_code', 'p_keys'],
    returns: 'scalar',
    rateLimit: { max: 10 },
    body: obj({
      p_lesson_id: LESSON_ID,
      p_mentor_code: { type: 'string', maxLength: 128 },
      p_keys: {
        type: 'object',
        minProperties: 1,
        maxProperties: 500,
        propertyNames: { pattern: '^[A-Za-z0-9._-]{1,64}$' },
        additionalProperties: { type: 'integer', minimum: -1, maximum: 99 },
      },
    }),
  },
});

export const RPC_DEFAULT_LIMIT = 600;

/** SQL matni: setof → `select * from fn(...)`; scalar/void → `select fn(...) as result` */
export function sqlFor(fn, def) {
  const ph = def.args.map((_, i) => `$${i + 1}`).join(', ');
  return def.returns === 'rows' ? `select * from ${fn}(${ph})` : `select ${fn}(${ph}) as result`;
}
