// F-1105-03 L2 (25 §8): brauzer natija-yuki v4 — `schema_version: 2` + `dars_api` bog'lanishi, `codestrike` YO'Q,
// oxirgi ekranda avtomatik yuboriladi. BAYROQ SERVERDAN (10.11): join/restart/me javobidagi `result_schema: 2`
// (Dars API `RESULT_SCHEMA_V2=on`). Server 1 desa yoki eski server maydonni bermasa — hech narsa o'zgarmaydi: yuk v3, tugma eskicha.
// Favqulodda o'chirish: build-lms `RESULT_SCHEMA_V2=off` bilan yig'ilsa (`__RESULT_SCHEMA_V2__` = 'off') — server nima desa ham v3.
// 172 dars fayliga tegilmaydi — hammasi umumiy `sealPayload` (yuk) va `FinishBtn` (tugma) orqali.
/* global __RESULT_SCHEMA_V2__ */
const BUILD_OFF = typeof __RESULT_SCHEMA_V2__ !== 'undefined' && __RESULT_SCHEMA_V2__ === 'off';

const darsApi = new Map();   // lessonId → { attempt_id, session_key, lesson_version, v2 }
const listeners = new Set(); // FinishBtn: bog'lanish o'zgarsa qayta tekshiradi (join oxirgi ekrandan keyin kelishi mumkin)
const atEnd = new Set();     // oxirgi ekranga yetgan darslar (progressSync ko'radi)
let autoLesson = null;       // faol LMS o'quvchi urinishi bor dars (student / solo) — avto-yakun faqat shunda
const autoFired = new Set();  // «lessonId|attempt_id» — avto-yakun bitta urinishga BIR marta (modal/qayta mount takrorlamaydi)

/** useLiveSession: server javobidan. info null — bog'lanish yo'q (mentor, self, preview). auto — faol urinish (ko'rish rejimi emas).
 *  info.v2 — server javobida `result_schema === 2`. */
export function setDarsApi(lessonId, info, { auto = false } = {}) {
  if (!lessonId) return;
  if (info && info.attempt_id) darsApi.set(lessonId, { ...info, v2: info.v2 === true }); else darsApi.delete(lessonId);
  if (auto && info && info.attempt_id) autoLesson = lessonId;
  else if (autoLesson === lessonId) autoLesson = null;
  for (const fn of listeners) { try { fn(); } catch { /* tinglovchi xatosi yukka ta'sir qilmaydi */ } }
}
/** FinishBtn: o'zgarishga obuna; qaytgan funksiya obunani bekor qiladi */
export function onDarsApiChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const getDarsApi = (lessonId) => darsApi.get(lessonId) || null;
/** progressSync: progWrite har chaqiruvida */
export function noteScreen(lessonId, screen, total) {
  if (!lessonId) return;
  if (Number.isInteger(screen) && Number.isInteger(total) && total > 0 && screen >= total - 1) atEnd.add(lessonId); else atEnd.delete(lessonId);
}
/** v4 yoqilganmi: server `result_schema: 2` bergan bog'lanish bor (lessonId berilmasa — sahifadagi istalgan dars; sahifada bitta dars) */
export function isV4(lessonId) {
  if (BUILD_OFF) return false;
  if (lessonId) return darsApi.get(lessonId)?.v2 === true;
  for (const d of darsApi.values()) if (d.v2 === true) return true;
  return false;
}
/** FinishBtn: avto-yakun sharti — server bayrog'i + faol LMS o'quvchi urinishi + oxirgi ekran */
const autoKey = () => `${autoLesson}|${darsApi.get(autoLesson)?.attempt_id || ''}`;
export const autoFinishReady = () => autoLesson !== null && isV4(autoLesson) && atEnd.has(autoLesson) && !autoFired.has(autoKey());
/** Avto-yakun chaqirildi — shu urinish uchun qayta avto yo'q (qo'lda bosish ishlayveradi) */
export const markAutoFired = () => { if (autoLesson !== null) autoFired.add(autoKey()); };

/** sealPayload: v3 yuk → v4. LMS bog'lanishi bo'lmasa (self, preview) — yuk o'zgarmaydi. */
export function toV4(lessonId, payload) {
  if (!payload || typeof payload !== 'object' || !isV4(lessonId)) return payload;
  const d = getDarsApi(lessonId);
  const { codestrike, ...rest } = payload; // eslint-disable-line no-unused-vars
  return { ...rest, schema_version: 2, dars_api: { attempt_id: d.attempt_id, session_key: d.session_key ?? null, lesson_version: d.lesson_version ?? null, lesson_result_event_id: `lr_${d.attempt_id}` } };
}

/** Test uchun */
export const _resetResultSchema = () => { darsApi.clear(); atEnd.clear(); autoLesson = null; listeners.clear(); autoFired.clear(); };
