// Jonli-dars moduli — barcha darslar shu bitta kirish nuqtasidan oladi.
// Darsda:  import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, setLiveLang, ... } from '../live/index.js';
import './previewMode.js'; // F-1015: preview-belgi (yagona manba — visitMode prop, build-lms o'rami orqali)
import './progressSync.js'; // progWrite → server-sinxron (yon ta'sir: hook ro'yxatdan o'tadi)
export { setLiveLang, getLiveLang, tr as liveTr } from './i18n.js';
export {
  LIVE_API_URL, LIVE_ENABLED, LIVE_POLL_MS, LIVE_POLL_MAX_MS, LIVE_HEARTBEAT_MS, LIVE_STALE_MS, LMS_SOLO_RECHECK_MS,
  liveRpc, liveGet, livePlayers, liveAnswers, liveQuizAnswers,
  liveRead, liveStore, liveClear, fmtPin,
  progRead, progWrite, progClear,
  nickRead, nickStore,
  lmsJoin, lmsMe, lmsRestart,
} from './liveClient.js';
export { useLiveSession, LiveGateCtx, useLiveLock } from './useLiveSession.js';
export { isPreview, notePreviewProps } from './previewMode.js'; // F-1015: LMS preview (Bilimlar bazasi)
export { useServerProgress } from './useServerProgress.js';
export { useAutoNext, AUTO_NEXT_MS } from './useAutoNext.js'; // arena: javob ochilgach keyingi savolga avto o'tish (F-0922-03)
export { LiveGate, LiveBadge, LiveBigCode, LT, FinishBtn, liveToast } from './LiveUI.jsx'; // FinishBtn/liveToast — yakun ekrani jim emas (F-1017-225)
export { buildResultDetails, sealPayload } from './resultDetails.js'; // onFinished detallari (TZ §4) — 2026-09-08 · yukni muhrlash (F-0918-07)
