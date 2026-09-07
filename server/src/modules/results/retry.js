// Qayta-yuborish jadvali (LMS v1.2 §8: 1, 3, 10 s, keyin fon-navbat). Faqat tarmoq / 429 / 500 / 503 uchun.
// 401/403/409/422 — avto-takror YO'Q (manual_review).
const SCHEDULE_MS = [1_000, 3_000, 10_000, 60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000];
export const MAX_SEND_ATTEMPTS = 30; // ~24 soat soatlik urinish bilan, keyin manual_review

/** attempt — shu paytgacha nechta urinish bo'lgan (1 = birinchisi yiqildi) */
export function nextDelayMs(attempt) {
  const i = Math.max(0, attempt - 1);
  return SCHEDULE_MS[Math.min(i, SCHEDULE_MS.length - 1)];
}

export function isRetryable(httpStatus) {
  if (httpStatus == null) return true; // tarmoq
  return httpStatus === 429 || httpStatus === 500 || httpStatus === 502 || httpStatus === 503 || httpStatus === 504;
}
