// liveToken (Coddy Camp LMS JWT) tekshiruvi — LMS v1.2 §5.1 ning 12 bandi, hammasi shu yerda.
//  1 uch segment · 2 alg=HS256 qat'iy · 3 typ=JWT · 4 kid allowlist · 5 HMAC imzo · 6 iss · 7 aud
//  8 nbf/iat/exp (60 s bardosh) · 9 exp>nbf, exp-iat ≤ 43200 · 10 jti · 11 role · 12 sub musbat son
// Kalit AVVAL kid bo'yicha qat'iy ro'yxatdan tanlanadi, KEYIN imzo shu kalit bilan tekshiriladi.
// Mijozga sabab aytilmaydi (bitta umumiy xabar); sabab faqat log uchun `reason` maydonida.
import { jwtVerify, decodeProtectedHeader, errors as joseErrors } from 'jose';
import { AppError } from '../../lib/errors.js';

export class TokenError extends AppError {
  constructor(reason, cause) {
    super('invalid_token', 401, 'Kirish tokeni yaroqsiz. Sahifani yangilab qayta urinib ko\'ring.', { cause });
    this.reason = reason;
  }
}

/** `base64:<...>` → baytlar; aks holda UTF-8 satr (LMS §5.1). */
export function keyFromSecret(value) {
  if (!value) throw new Error('JWT secret berilmagan');
  return value.startsWith('base64:')
    ? new Uint8Array(Buffer.from(value.slice(7), 'base64'))
    : new Uint8Array(Buffer.from(value, 'utf8'));
}

function mapJoseError(e) {
  if (e instanceof joseErrors.JWSSignatureVerificationFailed) return 'signature';
  if (e instanceof joseErrors.JWTExpired) return 'expired';
  if (e instanceof joseErrors.JWTClaimValidationFailed) {
    if (e.claim === 'iss') return 'iss';
    if (e.claim === 'aud') return 'aud';
    if (e.claim === 'nbf') return 'nbf';
    if (e.claim === 'iat') return 'iat';
    return `claim:${e.claim}`;
  }
  if (e instanceof joseErrors.JOSEAlgNotAllowed) return 'alg';
  return 'verify';
}

const SUB_RE = /^[1-9][0-9]{0,15}$/;

export function cleanName(v) {
  if (typeof v !== 'string') return '';
  return v.replace(/\s+/g, ' ').trim().slice(0, 64);
}

/**
 * @param {{ secret: string, issuer: string, audience: string, keyId: string, secretNext?: string, keyIdNext?: string,
 *           maxTtlSeconds: number, clockToleranceSeconds: number }} cfg
 * @returns {(token: string) => Promise<LiveClaims>}
 */
export function createVerifier(cfg) {
  const keys = new Map([[cfg.keyId, keyFromSecret(cfg.secret)]]);
  if (cfg.keyIdNext && cfg.secretNext) keys.set(cfg.keyIdNext, keyFromSecret(cfg.secretNext));

  return async function verifyLiveToken(token) {
    if (typeof token !== 'string' || token.length > 4096 || token.split('.').length !== 3) throw new TokenError('malformed'); // 1

    let header;
    try { header = decodeProtectedHeader(token); } catch (e) { throw new TokenError('bad_header', e); }
    if (header.alg !== 'HS256') throw new TokenError('alg');                       // 2 (alg=none, HS384… hammasi rad)
    if (header.typ !== 'JWT') throw new TokenError('typ');                         // 3
    if (typeof header.kid !== 'string' || !keys.has(header.kid)) throw new TokenError('kid'); // 4
    const key = keys.get(header.kid);

    let payload;
    try {
      ({ payload } = await jwtVerify(token, key, {                                  // 5 imzo · 6 iss · 7 aud · 8 vaqt
        algorithms: ['HS256'],
        issuer: cfg.issuer,
        audience: cfg.audience,
        clockTolerance: cfg.clockToleranceSeconds,
        requiredClaims: ['iat', 'exp', 'jti', 'sub', 'role'],
      }));
    } catch (e) {
      throw new TokenError(mapJoseError(e), e);
    }

    // 9 — vaqt maydonlari butun son, exp > nbf (yoki iat), umr ≤ maxTtl
    const { iat, exp } = payload;
    const nbf = payload.nbf ?? iat;
    if (!Number.isInteger(iat) || !Number.isInteger(exp) || !Number.isInteger(nbf)) throw new TokenError('time');
    if (exp <= nbf) throw new TokenError('ttl');
    if (exp - iat > cfg.maxTtlSeconds) throw new TokenError('ttl');

    // 10
    if (typeof payload.jti !== 'string' || payload.jti.trim().length === 0 || payload.jti.length > 128) throw new TokenError('jti');
    // 11
    if (payload.role !== 'student' && payload.role !== 'mentor') throw new TokenError('role');
    // 12
    if (typeof payload.sub !== 'string' || !SUB_RE.test(payload.sub)) throw new TokenError('sub');

    /** @type {LiveClaims} */
    const claims = {
      role: payload.role,
      sub: Number(payload.sub),
      jti: payload.jti.trim(),
      name: cleanName(payload.name),
      iat,
      exp: new Date(exp * 1000),
      kid: header.kid,
      gid: null,
      crmId: null,
    };
    if (claims.role === 'mentor') {
      if (!Number.isInteger(payload.gid) || payload.gid < 1) throw new TokenError('gid');
      claims.gid = payload.gid;
    } else if (Number.isInteger(payload.crm_id) && payload.crm_id > 0) {
      claims.crmId = payload.crm_id;
    }
    return claims;
  };
}

/**
 * @typedef {{ role: 'student'|'mentor', sub: number, jti: string, name: string, iat: number, exp: Date,
 *             kid: string, gid: number|null, crmId: number|null }} LiveClaims
 */
