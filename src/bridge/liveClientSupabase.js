// Jonli-dars mijozi — toza fetch, kutubxonasiz. Server: dars-api (server/), Supabase o'rnini bosadi.
// URL bundler'dan keladi (vite/esbuild `define` → __DARS_API_URL__); berilmasa PROD (LMS serveri, Kristina 2026-09-08).
// Staging: DARS_API_URL=https://staging-dars-api.coddycamp.uz (build-lms / vite). Lokal: http://127.0.0.1:3001.
// O'chirish: DARS_API_URL='' emas — modul har doim yoqiq; oddiy rejim uchun dars «self» ni tanlaydi.
// BRIDGE yig'masi uchun: src/live/liveClient.js ning AYNAN o'sha interfeysi, transporti — eski Supabase (2026-09-24).
// vite.bridge.config.js dagi plugin src/live/ ichidan './liveClient.js' importini shu faylga yo'naltiradi.
// LMS yig'malari, mentor sayti va dars-api bu fayldan bexabar — umumiy fayl o'zgarmaydi.
// Kalit — Supabase «publishable» kalit (brauzer uchun mo'ljallangan, maxfiy emas); huquqlar RPC/RLS da.
const SUPABASE_URL = 'https://dwoubexcexzsinogojiu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX';
const HDR = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
export const LIVE_API_URL = SUPABASE_URL;
export const LIVE_ENABLED = true;

// LIVE_STALE_MS = 180s (60s EMAS): Chrome fon-tabda setInterval'ni ~1 daqiqagacha bo'g'adi —
// mentor boshqa oynaga o'tsa 60s oynada «o'lik» deb topilib, butun sinf-darvoza ochilib ketardi (F-0726-01).
export const LIVE_POLL_MS = 2500;
export const LIVE_POLL_MAX_MS = 15000;
export const LIVE_HEARTBEAT_MS = 10000;
export const LIVE_STALE_MS = 180000;
// F-0910-01: solo rejimda «guruhda jonli dars boshlandimi?» so'rovi oralig'i (o'quvchi mentordan oldin kirgan holat)
export const LMS_SOLO_RECHECK_MS = 20000;

// Supabase'da yo'q RPC: mijoz xatoni ko'rmaydi (analitika bridge'da kerak emas)
const NOOP_RPC = new Set(['record_attempt']);

/** POST /rest/v1/rpc/<fn> — dars-api bilan bir xil shakl: setof → massiv, scalar → qiymat, void → null. */
export async function liveRpc(fn, body) {
  if (NOOP_RPC.has(fn)) return null;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { ...HDR, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) {
    let msg = '';
    try { msg = JSON.parse(await r.text()).message || ''; } catch { /* JSON emas */ }
    const e = new Error(msg || `${fn}: ${r.status}`);
    e.status = r.status;
    throw e;
  }
  if (r.status === 204) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

/** Sessiya qatori; yo'q bo'lsa null. */
export async function liveGet(pin) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: HDR });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json();
  return (rows && rows[0]) || null;
}

async function liveList(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: HDR });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
export const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
export const liveAnswers = (pin, screenIdx) =>
  liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
export const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);

// ---- LMS-ko'prik bridge'da YO'Q (LMS'siz sayt, liveToken kelmaydi). Chaqirilsa — aniq xato, dars «self/mentor/student» da qoladi.
const noLms = async () => { const e = new Error('bridge: LMS yo\'q'); e.code = 'no_lms'; throw e; };
export const lmsJoin = noLms;
export const lmsMe = noLms;
export const lmsRestart = noLms;
export const progressPut = noLms;
/** JWT payload'dan rolni IMZOSIZ o'qish — faqat UX uchun (mentor bo'lsa kalit yuboriladi); ishonch serverda. */
export function peekTokenRole(liveToken) {
  try {
    const part = String(liveToken).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const role = JSON.parse(atob(part)).role;
    return role === 'mentor' || role === 'student' ? role : null;
  } catch { return null; }
}

// ---- Qurilma-holat (localStorage): sessiya, sahifa-holat, ism. Hammasi jim yiqiladi (private rejim, iframe).
const _lsKey = (id) => `liveSession:${id}`;
export const liveRead = (id) => { try { return JSON.parse(localStorage.getItem(_lsKey(id)) || 'null'); } catch { return null; } };
export const liveStore = (id, o) => { try { localStorage.setItem(_lsKey(id), JSON.stringify(o)); } catch { /* jim */ } };
export const liveClear = (id) => { try { localStorage.removeItem(_lsKey(id)); } catch { /* jim */ } };
export const fmtPin = (p) => (p ? String(p).replace(/(\d{3})(\d{3})/, '$1 $2') : '');

// Sahifa-holat saqlovi (F-0730-01): reload'da o'quvchi o'z ekraniga qaytadi.
// TTL 6 soat (kechagi chala urinish bugungi darsga aralashmasin); ekran soni
// o'zgargan bo'lsa saqlov bekor; har qanday xatoda jimgina 0-ekrandan boshlanadi.
// (3-bosqichda server-progress keladi; localStorage kesh bo'lib qoladi.)
const PROG_TTL_MS = 6 * 60 * 60 * 1000;
const _progKey = (id) => `ccProgress:${id}`;
export const progRead = (id, total) => {
  try {
    const p = JSON.parse(localStorage.getItem(_progKey(id)) || 'null');
    if (!p || p.total !== total || Date.now() - (p.savedAt || 0) > PROG_TTL_MS) return null;
    return p;
  } catch { return null; }
};
// progWrite: lokal kesh + (LMS urinishi bo'lsa) server-sinxron. Aylanma importsiz — progressSync.js runtime'da ulanadi.
let _progWriteHook = null;
export const setProgWriteHook = (fn) => { _progWriteHook = typeof fn === 'function' ? fn : null; };
export const progWrite = (id, o) => {
  try { localStorage.setItem(_progKey(id), JSON.stringify(o)); } catch { /* jim */ }
  try { if (_progWriteHook) _progWriteHook(id, o); } catch { /* sinxron xatosi darsni to'xtatmaydi */ }
};
export const progClear = (id) => { try { localStorage.removeItem(_progKey(id)); } catch { /* jim */ } };

// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit): 1-darsda yozadi, qolganlariga o'zi chiqadi
const LIVE_NICK_KEY = 'liveNickname';
export const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
export const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch { /* jim */ } };
