// Coddy Camp School Data API mijozi (server-to-server, sapi_ tokenlar). Hozircha faqat integration-context.
// Xatolar 503 sifatida qaytadi — o'quvchi PIN-yo'liga tushadi, dars to'xtamaydi. Token log'ga yozilmaydi.
import { AppError } from '../../lib/errors.js';

const UNAVAILABLE = 'LMS bilan bog\'lanib bo\'lmadi. Bir ozdan keyin qayta urinib ko\'ring.';

/**
 * integration-context javobidan ruxsatli guruh ID'lari (LMS v1.2 §6-6):
 * subscription.status ∈ {active, demo} · subscription.active = true · group.status = active
 * @param {any} body
 * @returns {number[]}
 */
export function extractGroups(body) {
  const subs = body?.data?.subscriptions;
  if (!Array.isArray(subs)) return [];
  const ids = new Set();
  for (const s of subs) {
    if (!s || s.active !== true) continue;
    if (s.status !== 'active' && s.status !== 'demo') continue;
    const g = s.group;
    if (!g || g.status !== 'active') continue;
    const id = Number(g.id);
    if (Number.isInteger(id) && id > 0) ids.add(id);
  }
  return [...ids].sort((a, b) => a - b);
}

/**
 * @param {{ baseUrl: string, contextToken: string, fetchImpl?: typeof fetch, timeoutMs?: number, log: import('pino').Logger }} opts
 */
export function createSchoolApi({ baseUrl, contextToken, resultsToken, fetchImpl = globalThis.fetch, timeoutMs = 5000, log }) {
  async function request(path, token, init = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetchImpl(`${baseUrl}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...(init.headers || {}) },
        signal: ctrl.signal,
      });
    } catch (e) {
      log.warn({ err: { name: e?.name, message: e?.message }, path }, 'school-api: tarmoq xatosi');
      throw new AppError('school_api_unavailable', 503, UNAVAILABLE, { cause: e });
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    /**
     * @param {number} lmsStudentId  (JWT sub)
     * @returns {Promise<{ found: boolean, groups: number[], studentActive: boolean }>}
     */
    async integrationContext(lmsStudentId) {
      const path = `/api/v1/lms/students/${lmsStudentId}/integration-context`;
      const r = await request(path, contextToken);
      if (r.status === 404) return { found: false, groups: [], studentActive: false };
      if (r.status === 429) {
        const retryAfter = Math.max(1, Number(r.headers.get('retry-after')) || 5);
        log.warn({ retryAfter, path }, 'school-api: 429');
        throw new AppError('school_api_rate_limited', 503, UNAVAILABLE, { details: { retry_after: retryAfter } });
      }
      if (r.status === 401 || r.status === 403) {
        log.error({ status: r.status, path }, 'school-api: kontekst-token rad etildi — sozlamani tekshiring');
        throw new AppError('school_api_auth', 503, UNAVAILABLE);
      }
      if (!r.ok) {
        log.warn({ status: r.status, path }, 'school-api: kutilmagan javob');
        throw new AppError('school_api_error', 503, UNAVAILABLE, { details: { status: r.status } });
      }
      let body;
      try { body = await r.json(); } catch (e) { throw new AppError('school_api_error', 503, UNAVAILABLE, { cause: e }); }
      return { found: true, groups: extractGroups(body), studentActive: body?.data?.student?.active !== false };
    },

    /**
     * POST lesson-results (LMS §7). HTTP kodlarni TASHLAMAYDI — ishchi o'zi hal qiladi; faqat tarmoq xatosi throw.
     * @returns {Promise<{ status: number, body: any, requestId: string|null, retryAfter: number|null }>}
     */
    async submitLessonResult(payload) {
      const path = '/api/v1/integrations/dars-platform/lesson-results';
      const r = await request(path, resultsToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let body = null;
      try { body = await r.json(); } catch { /* tanasiz / JSON emas */ }
      return {
        status: r.status,
        body,
        requestId: r.headers.get('x-request-id') || null,
        retryAfter: r.status === 429 ? (Number(r.headers.get('retry-after')) || null) : null,
      };
    },

    /**
     * GET lesson-results/{event_id} (LMS §8, §13-20) — yuborilgan hodisani School API tomonida tasdiqlash (admin uchun).
     * HTTP kodlarni tashlamaydi: 200 → data, 404 → topilmadi/begona klient, boshqasi → holicha.
     * @returns {Promise<{ status: number, body: any, requestId: string|null }>}
     */
    async getLessonResult(eventId) {
      const path = `/api/v1/integrations/dars-platform/lesson-results/${encodeURIComponent(String(eventId))}`;
      const r = await request(path, resultsToken, { method: 'GET' });
      let body = null;
      try { body = await r.json(); } catch { /* tanasiz */ }
      return { status: r.status, body, requestId: r.headers.get('x-request-id') || null };
    },
  };
}
