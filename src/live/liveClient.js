import { noteProgressCleared } from './resultDetails.js'; // F-0924-20 (resultDetails faqat i18n import qiladi — sikl yo'q)
// Jonli-dars mijozi — toza fetch, kutubxonasiz. Server: dars-api (server/), Supabase o'rnini bosadi.
// URL bundler'dan keladi (vite/esbuild `define` → __DARS_API_URL__); berilmasa PROD (LMS serveri, Kristina 2026-09-08).
// Staging: DARS_API_URL=https://staging-dars-api.coddycamp.uz (build-lms / vite). Lokal: http://127.0.0.1:3001.
// O'chirish: DARS_API_URL='' emas — modul har doim yoqiq; oddiy rejim uchun dars «self» ni tanlaydi.
/* global __DARS_API_URL__ */

const DEFAULT_API_URL = 'https://dars-api.coddycamp.uz';
export const LIVE_API_URL = (typeof __DARS_API_URL__ !== 'undefined' && __DARS_API_URL__)
  ? String(__DARS_API_URL__).replace(/\/+$/, '')
  : DEFAULT_API_URL;
export const LIVE_ENABLED = !!LIVE_API_URL;

// LIVE_STALE_MS = 180s (60s EMAS): Chrome fon-tabda setInterval'ni ~1 daqiqagacha bo'g'adi —
// mentor boshqa oynaga o'tsa 60s oynada «o'lik» deb topilib, butun sinf-darvoza ochilib ketardi (F-0726-01).
export const LIVE_POLL_MS = 2500;
export const LIVE_POLL_MAX_MS = 15000;
export const LIVE_HEARTBEAT_MS = 10000;
export const LIVE_STALE_MS = 180000;
// F-0910-01: solo rejimda «guruhda jonli dars boshlandimi?» so'rovi oralig'i (o'quvchi mentordan oldin kirgan holat)
export const LMS_SOLO_RECHECK_MS = 20000;

const API = `${LIVE_API_URL}/api/v1/live`;

// Server har xatoni { error, message } shaklida beradi; `message` o'quvchiga ko'rsatiladi
// (masalan «Bu ism band — boshqa ism tanlang»). Shakl buzilsa — umumiy xabar.
async function errorFrom(r, fallback) {
  let msg = '';
  try { msg = (await r.json()).message || ''; } catch { /* JSON emas */ }
  const e = new Error(msg || fallback);
  // 🔴 F-0912-07: HTTP holati XATO OBYEKTIGA ilinadi. Busiz chaqiruvchi «kod noto'g'ri» (401)
  // bilan «serverga yetib bo'lmadi» (tarmoq/CORS — fetch umuman otiladi) ni ajrata olmaydi va
  // ikkalasiga bitta xabar beradi. Sinfda server yiqilganda mentor kodni qidirib vaqt yo'qotadi.
  e.status = r.status;
  return e;
}

/** POST /rpc/<fn> — setof → massiv, scalar → qiymat, void → null (204). */
export async function liveRpc(fn, body) {
  const r = await fetch(`${API}/rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw await errorFrom(r, `${fn}: ${r.status}`);
  if (r.status === 204) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

/** Sessiya qatori; yo'q bo'lsa null (404). Brauzer ETag/304 ni o'zi hal qiladi (cache-control: no-cache). */
export async function liveGet(pin) {
  const r = await fetch(`${API}/session/${encodeURIComponent(pin)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`get: ${r.status}`);
  return r.json();
}

async function liveList(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
export const livePlayers = (pin) => liveList(`${API}/players/${encodeURIComponent(pin)}`);
// screenIdx berilmasa — faqat DARS javoblari (<100); arena javoblari 100+ indekslarda
export const liveAnswers = (pin, screenIdx) =>
  liveList(`${API}/answers/${encodeURIComponent(pin)}${screenIdx == null ? '' : `?screen=${encodeURIComponent(screenIdx)}`}`);
export const liveQuizAnswers = (pin) => liveList(`${API}/answers/${encodeURIComponent(pin)}?range=arena`);

// ---- LMS-ko'prik: liveToken (LMS bergan JWT) bilan kirish. Token faqat Authorization sarlavhasida, hech qayerda saqlanmaydi.
async function lmsFetch(method, url, liveToken, body) {
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${liveToken}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* tanasiz */ }
  if (!r.ok) {
    const e = new Error((data && data.message) || `lms: ${r.status}`);
    e.code = (data && data.error) || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
/** POST /lms/join → {mode:'mentor'|'student', …} yoki {choose:[…]} ; xato: e.code (no_active_session, invalid_token, …) */
export const lmsJoin = (liveToken, body) => lmsFetch('POST', `${LIVE_API_URL}/api/v1/lms/join`, liveToken, body);
/** GET /lms/me — bor sessiyani qaytaradi, yaratmaydi (404 = yo'q) */
export const lmsMe = (liveToken, lessonId) => lmsFetch('GET', `${LIVE_API_URL}/api/v1/lms/me?lesson_id=${encodeURIComponent(lessonId)}`, liveToken);
/** POST /lms/restart — ko'rishdan yangi solo urinish */
export const lmsRestart = (liveToken, lessonId) => lmsFetch('POST', `${LIVE_API_URL}/api/v1/lms/restart`, liveToken, { lesson_id: lessonId });
/** PUT /me/progress — server-progress (progressSync.js chaqiradi). keepalive: sahifa yopilayotganda ham yetib borsin. */
export async function progressPut(liveToken, body, { keepalive = false } = {}) {
  const r = await fetch(`${LIVE_API_URL}/api/v1/me/progress`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${liveToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive,
  });
  let data = null;
  try { data = await r.json(); } catch { /* tanasiz */ }
  if (!r.ok) {
    const e = new Error((data && data.message) || `progress: ${r.status}`);
    e.code = (data && data.error) || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
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
export const progClear = (id) => {
  try { noteProgressCleared(id, JSON.parse(localStorage.getItem(_progKey(id)) || 'null')); } catch { /* jim */ } // F-0924-20: yakun-konteksti — tozalash OLDIDAN
  try { localStorage.removeItem(_progKey(id)); } catch { /* jim */ }
};

// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit): 1-darsda yozadi, qolganlariga o'zi chiqadi
const LIVE_NICK_KEY = 'liveNickname';
export const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
export const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch { /* jim */ } };
