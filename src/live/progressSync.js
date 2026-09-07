// Server-progress sinxroni: dars ildizi `progWrite(id, obj)` chaqirganda (har holat o'zgarishida) shu modul
// 2 s debounce bilan `PUT /me/progress` yuboradi — faqat LMS-token bilan ochilgan FAOL urinish bo'lsa.
// Sahifa yopilayotganda (pagehide / yashirin) kutilayotgan yozuv keepalive bilan darhol ketadi.
// localStorage yozuvi (kesh) o'zgarishsiz qoladi — server yo'q bo'lsa ham dars ishlayveradi.
import { progressPut, setProgWriteHook } from './liveClient.js';

const DEBOUNCE_MS = 2000;
/** @type {Map<string, Channel>} */
const channels = new Map();

/**
 * @typedef {{ token: string, attemptId: string, status: 'active'|'finished', timer: any, pending: object|null,
 *             inFlight: boolean, onFinished?: (info: object) => void, onError?: (e: any) => void }} Channel
 */

/** Hook chaqiradi: urinish ochilganda kanal, yopilganda null. */
export function setProgressChannel(lessonId, ch) {
  const prev = channels.get(lessonId);
  if (prev) { clearTimeout(prev.timer); flush(lessonId, { keepalive: true }); }
  if (!ch) { channels.delete(lessonId); return; }
  channels.set(lessonId, { ...ch, timer: null, pending: null, inFlight: false });
}

export function progressChannelStatus(lessonId) {
  return channels.get(lessonId)?.status || null;
}

/** progWrite'dan: obj = { screen, answers, earned, startedAt, total, savedAt } */
export function queueProgress(lessonId, obj) {
  const ch = channels.get(lessonId);
  if (!ch || ch.status !== 'active' || !obj) return;
  ch.pending = {
    lesson_id: lessonId,
    attempt_id: ch.attemptId,
    screen: Number.isInteger(obj.screen) ? obj.screen : 0,
    total: Number.isInteger(obj.total) && obj.total > 0 ? obj.total : undefined,
    answers: obj.answers && typeof obj.answers === 'object' ? obj.answers : {},
    earned: Array.isArray(obj.earned) ? obj.earned.map(String) : [],
    started_at_ms: Number.isInteger(obj.startedAt) ? obj.startedAt : undefined,
    client_ts: Date.now(),
  };
  clearTimeout(ch.timer);
  ch.timer = setTimeout(() => flush(lessonId), DEBOUNCE_MS);
}

async function flush(lessonId, { keepalive = false } = {}) {
  const ch = channels.get(lessonId);
  if (!ch || !ch.pending || ch.inFlight) return;
  const body = ch.pending;
  ch.pending = null;
  ch.inFlight = true;
  try {
    const r = await progressPut(ch.token, body, { keepalive });
    if (r && r.status === 'finished') {
      ch.status = 'finished';
      ch.onFinished?.({ reason: r.finish_reason || 'completed' });
    }
  } catch (e) {
    if (e && (e.status === 409 || e.status === 404 || e.status === 401 || e.status === 403)) {
      // urinish tugagan / yo'q / token eskirgan — sinxron to'xtaydi, dars ishlayveradi
      ch.status = 'finished';
      if (e.status === 409) ch.onFinished?.({ reason: 'server' });
    } else {
      // tarmoq — keyingi yozuvda qayta uriniladi (pending qayta to'ladi)
      if (!ch.pending) ch.pending = body;
    }
    ch.onError?.(e);
  } finally {
    ch.inFlight = false;
    if (ch.pending && ch.status === 'active' && !ch.timer) ch.timer = setTimeout(() => { ch.timer = null; flush(lessonId); }, DEBOUNCE_MS);
  }
}

function flushAll(keepalive) {
  for (const id of channels.keys()) { const ch = channels.get(id); clearTimeout(ch.timer); ch.timer = null; flush(id, { keepalive }); }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => flushAll(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushAll(true); });
}

// liveClient.progWrite → shu navbat (aylanma import o'rniga runtime-hook)
setProgWriteHook(queueProgress);
