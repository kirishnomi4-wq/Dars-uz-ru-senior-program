// Jonli-dars moduli — barcha darslar shu bitta kirish nuqtasidan oladi.
// Darsda:  import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, setLiveLang, ... } from '../live/index.js';
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
export { useServerProgress } from './useServerProgress.js';
export { LiveGate, LiveBadge, LiveBigCode, LT } from './LiveUI.jsx';
export { buildResultDetails } from './resultDetails.js'; // onFinished detallari (TZ §4) — 2026-09-08
