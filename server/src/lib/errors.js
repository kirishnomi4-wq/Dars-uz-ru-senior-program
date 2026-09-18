// Domen-xatolar. Mijozga faqat { error, message, details? } chiqadi; ichki tafsilot log'da qoladi.
// Klient (98 dars) RPC-xatoda `message` maydonini o'qib o'quvchiga ko'rsatadi
// (masalan «Bu ism band — boshqa ism tanlang») — shakl saqlanadi.

export class AppError extends Error {
  /**
   * @param {string} code      mashina o'qiydigan kod (snake_case)
   * @param {number} statusCode HTTP kod
   * @param {string} message   odam o'qiydigan xabar (o'quvchiga ko'rsatilishi mumkin)
   * @param {{ details?: unknown, cause?: unknown }} [opts]
   */
  constructor(code, statusCode, message, opts = {}) {
    super(message, opts.cause ? { cause: opts.cause } : undefined);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = opts.details;
  }
}

export const badRequest = (message, details) => new AppError('bad_request', 400, message, { details });
export const unauthorized = (message = 'Kirish uchun ruxsat kerak') => new AppError('unauthorized', 401, message);
export const forbidden = (message = "Ruxsat yo'q") => new AppError('forbidden', 403, message);
export const notFound = (message = 'Topilmadi') => new AppError('not_found', 404, message);
export const conflict = (message, details) => new AppError('conflict', 409, message, { details });
export const unavailable = (message = 'Xizmat vaqtincha ishlamayapti') => new AppError('unavailable', 503, message);

// PostgreSQL SQLSTATE kodlari (faqat kerakligi)
const PG = {
  RAISE_EXCEPTION: 'P0001',   // PL/pgSQL `raise exception` — bizning domen-xabarlar
  UNIQUE_VIOLATION: '23505',
  FK_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02', // masalan buzuq uuid
  QUERY_CANCELED: '57014',    // statement_timeout
};

/**
 * pg xatosini domen-xatoga aylantiradi. Moslik bo'lmasa null (500 bo'lib ketadi).
 * @param {any} err
 * @returns {AppError|null}
 */
export function fromPgError(err) {
  if (!err || typeof err.code !== 'string') return null;
  switch (err.code) {
    case PG.RAISE_EXCEPTION:
      // F-0918-01 (jonli sinov 2026-09-18): noto'g'ri mentor-kod 400 bo'lib ketardi, klient (`startMentor`) faqat 401/403 ni
      // «Mentor kodi noto'g'ri» deb biladi → mentor «Server javob bermadi (xato 400)» ko'rardi va kodni qayta tekshirmasdi.
      // Kirish-xatosi = 403 (darslar qayta yig'ilmaydi — klient tayyor).
      if (/^Mentor kodi noto.g.ri$/.test(String(err.message || ''))) return new AppError('forbidden', 403, err.message, { cause: err });
      // SQL ichidagi xabar o'quvchiga mo'ljallangan (o'zbekcha) — shundayligicha
      return new AppError('domain_error', 400, err.message, { cause: err });
    case PG.UNIQUE_VIOLATION:
      return new AppError('conflict', 409, 'Bunday yozuv allaqachon bor', { cause: err });
    case PG.FK_VIOLATION:
      return new AppError('not_found', 404, "Bog'liq yozuv topilmadi", { cause: err });
    case PG.CHECK_VIOLATION:
    case PG.INVALID_TEXT_REPRESENTATION:
      return new AppError('bad_request', 400, "Qiymat noto'g'ri", { cause: err });
    case PG.QUERY_CANCELED:
      return new AppError('unavailable', 503, "So'rov vaqti tugadi, qayta urinib ko'ring", { cause: err });
    default:
      return null;
  }
}
