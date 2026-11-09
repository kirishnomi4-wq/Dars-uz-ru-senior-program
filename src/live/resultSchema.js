// F-1105-03 L2 (25 §8): brauzer natija-yuki v4 — `schema_version: 2` + `dars_api` bog'lanishi, `codestrike` YO'Q,
// oxirgi ekranda avtomatik yuboriladi. BAYROQ: build-lms `define` → `__RESULT_SCHEMA_V2__` = 'on' bo'lgandagina (T kuni).
// Bayroq o'chiq (sukut) — hech narsa o'zgarmaydi: yuk v3, tugma eskicha. 172 dars fayliga tegilmaydi — hammasi
// umumiy `sealPayload` (yuk) va `FinishBtn` (tugma) orqali.
/* global __RESULT_SCHEMA_V2__ */
export const RESULT_V4 = typeof __RESULT_SCHEMA_V2__ !== 'undefined' && __RESULT_SCHEMA_V2__ === 'on';

const darsApi = new Map();   // lessonId → { attempt_id, session_key, lesson_version }
const atEnd = new Set();     // oxirgi ekranga yetgan darslar (progressSync ko'radi)
let autoLesson = null;       // faol LMS o'quvchi urinishi bor dars (student / solo) — avto-yakun faqat shunda

/** useLiveSession: server javobidan. info null — bog'lanish yo'q (mentor, self, preview). auto — faol urinish (ko'rish rejimi emas). */
export function setDarsApi(lessonId, info, { auto = false } = {}) {
  if (!lessonId) return;
  if (info && info.attempt_id) darsApi.set(lessonId, info); else darsApi.delete(lessonId);
  if (auto && info && info.attempt_id) autoLesson = lessonId;
  else if (autoLesson === lessonId) autoLesson = null;
}
export const getDarsApi = (lessonId) => darsApi.get(lessonId) || null;
/** progressSync: progWrite har chaqiruvida */
export function noteScreen(lessonId, screen, total) {
  if (!lessonId) return;
  if (Number.isInteger(screen) && Number.isInteger(total) && total > 0 && screen >= total - 1) atEnd.add(lessonId); else atEnd.delete(lessonId);
}
/** FinishBtn: avto-yakun sharti — bayroq + faol LMS o'quvchi urinishi + oxirgi ekran */
export const autoFinishReady = () => RESULT_V4 && autoLesson !== null && atEnd.has(autoLesson);

/** sealPayload: v3 yuk → v4. LMS bog'lanishi bo'lmasa (self, preview) — yuk o'zgarmaydi. */
export function toV4(lessonId, payload) {
  if (!RESULT_V4 || !payload || typeof payload !== 'object') return payload;
  const d = getDarsApi(lessonId);
  if (!d) return payload;
  const { codestrike, ...rest } = payload; // eslint-disable-line no-unused-vars
  return { ...rest, schema_version: 2, dars_api: { attempt_id: d.attempt_id, session_key: d.session_key ?? null, lesson_version: d.lesson_version ?? null, lesson_result_event_id: `lr_${d.attempt_id}` } };
}

/** Test uchun */
export const _resetResultSchema = () => { darsApi.clear(); atEnd.clear(); autoLesson = null; };
