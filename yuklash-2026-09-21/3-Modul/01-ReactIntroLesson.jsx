// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/3-Modull/ReactIntroLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/3-Modull/ReactIntroLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/3-Modull/ReactIntroLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useRef as useRef3, useCallback as useCallback2, useMemo, createContext as createContext2, useContext as useContext2 } from "react";

// src/live/liveClient.js
var DEFAULT_API_URL = "https://dars-api.coddycamp.uz";
var LIVE_API_URL = "" ? String("").replace(/\/+$/, "") : DEFAULT_API_URL;
var LIVE_ENABLED = !!LIVE_API_URL;
var LIVE_POLL_MS = 2500;
var LIVE_POLL_MAX_MS = 15e3;
var LIVE_HEARTBEAT_MS = 1e4;
var LIVE_STALE_MS = 18e4;
var LMS_SOLO_RECHECK_MS = 2e4;
var API = `${LIVE_API_URL}/api/v1/live`;
async function errorFrom(r, fallback) {
  let msg = "";
  try {
    msg = (await r.json()).message || "";
  } catch {
  }
  const e = new Error(msg || fallback);
  e.status = r.status;
  return e;
}
async function liveRpc(fn, body) {
  const r = await fetch(`${API}/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  if (!r.ok) throw await errorFrom(r, `${fn}: ${r.status}`);
  if (r.status === 204) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
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
var livePlayers = (pin) => liveList(`${API}/players/${encodeURIComponent(pin)}`);
var liveAnswers = (pin, screenIdx) => liveList(`${API}/answers/${encodeURIComponent(pin)}${screenIdx == null ? "" : `?screen=${encodeURIComponent(screenIdx)}`}`);
var liveQuizAnswers = (pin) => liveList(`${API}/answers/${encodeURIComponent(pin)}?range=arena`);
async function lmsFetch(method, url, liveToken, body) {
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${liveToken}`, ...body ? { "Content-Type": "application/json" } : {} },
    body: body ? JSON.stringify(body) : void 0
  });
  let data = null;
  try {
    data = await r.json();
  } catch {
  }
  if (!r.ok) {
    const e = new Error(data && data.message || `lms: ${r.status}`);
    e.code = data && data.error || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
var lmsJoin = (liveToken, body) => lmsFetch("POST", `${LIVE_API_URL}/api/v1/lms/join`, liveToken, body);
var lmsRestart = (liveToken, lessonId) => lmsFetch("POST", `${LIVE_API_URL}/api/v1/lms/restart`, liveToken, { lesson_id: lessonId });
async function progressPut(liveToken, body, { keepalive = false } = {}) {
  const r = await fetch(`${LIVE_API_URL}/api/v1/me/progress`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${liveToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive
  });
  let data = null;
  try {
    data = await r.json();
  } catch {
  }
  if (!r.ok) {
    const e = new Error(data && data.message || `progress: ${r.status}`);
    e.code = data && data.error || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
function peekTokenRole(liveToken) {
  try {
    const part = String(liveToken).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const role = JSON.parse(atob(part)).role;
    return role === "mentor" || role === "student" ? role : null;
  } catch {
    return null;
  }
}
var _lsKey = (id) => `liveSession:${id}`;
var liveRead = (id) => {
  try {
    return JSON.parse(localStorage.getItem(_lsKey(id)) || "null");
  } catch {
    return null;
  }
};
var liveStore = (id, o) => {
  try {
    localStorage.setItem(_lsKey(id), JSON.stringify(o));
  } catch {
  }
};
var liveClear = (id) => {
  try {
    localStorage.removeItem(_lsKey(id));
  } catch {
  }
};
var fmtPin = (p) => p ? String(p).replace(/(\d{3})(\d{3})/, "$1 $2") : "";
var PROG_TTL_MS = 6 * 60 * 60 * 1e3;
var _progKey = (id) => `ccProgress:${id}`;
var progRead = (id, total) => {
  try {
    const p = JSON.parse(localStorage.getItem(_progKey(id)) || "null");
    if (!p || p.total !== total || Date.now() - (p.savedAt || 0) > PROG_TTL_MS) return null;
    return p;
  } catch {
    return null;
  }
};
var _progWriteHook = null;
var setProgWriteHook = (fn) => {
  _progWriteHook = typeof fn === "function" ? fn : null;
};
var progWrite = (id, o) => {
  try {
    localStorage.setItem(_progKey(id), JSON.stringify(o));
  } catch {
  }
  try {
    if (_progWriteHook) _progWriteHook(id, o);
  } catch {
  }
};
var progClear = (id) => {
  try {
    localStorage.removeItem(_progKey(id));
  } catch {
  }
};
var LIVE_NICK_KEY = "liveNickname";
var nickRead = () => {
  try {
    return localStorage.getItem(LIVE_NICK_KEY) || "";
  } catch {
    return "";
  }
};
var nickStore = (n) => {
  try {
    localStorage.setItem(LIVE_NICK_KEY, n);
  } catch {
  }
};

// src/live/i18n.js
import React from "react";
var liveLang = "uz";
var setLiveLang = (lang) => {
  liveLang = lang === "ru" ? "ru" : "uz";
};
var getLiveLang = () => liveLang;
var tr = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[liveLang] ?? node.uz ?? node.ru ?? "";
};

// src/live/resultDetails.js
var LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20, name: 40, title: 200, elapsed: 36e5 };
var cut = (v, n) => typeof v === "string" ? v.slice(0, n) : void 0;
var iso = (t) => new Date(t || Date.now()).toISOString().replace(/\.\d{3}Z$/, "Z");
var optText = (o, lang) => o && typeof o === "object" ? String(o[lang] ?? o.uz ?? "") : String(o ?? "");
var attemptsByLesson = /* @__PURE__ */ new Map();
var earnedAtByLesson = /* @__PURE__ */ new Map();
var arenaByLesson = /* @__PURE__ */ new Map();
var ARENA_Q = /^quiz-(\d+)$/;
var KEY = (lessonId) => `ccDetails:${lessonId}`;
var store = () => {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
};
var loaded = /* @__PURE__ */ new Set();
function load(lessonId) {
  if (loaded.has(lessonId)) return;
  loaded.add(lessonId);
  const st = store();
  if (!st) return;
  let o = null;
  try {
    o = JSON.parse(st.getItem(KEY(lessonId)) || "null");
  } catch {
    return;
  }
  if (!o || typeof o !== "object") return;
  const am = attemptsByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [k, list] of Object.entries(o.attempts || {})) {
    const idx = Number(k);
    if (!Number.isInteger(idx) || !Array.isArray(list) || am.has(idx)) continue;
    am.set(idx, list.filter((t) => t && typeof t === "object" && Number.isFinite(t.at)).slice(0, LIM.attempts));
  }
  attemptsByLesson.set(lessonId, am);
  const em = earnedAtByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [id, t] of Object.entries(o.earnedAt || {})) if (Number.isFinite(t) && !em.has(id)) em.set(id, t);
  earnedAtByLesson.set(lessonId, em);
  const ar = arenaByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [k, e] of Object.entries(o.arena || {})) {
    const qi = Number(k);
    if (!Number.isInteger(qi) || ar.has(qi) || !e || typeof e !== "object" || !Number.isFinite(e.at)) continue;
    ar.set(qi, { option: Number.isInteger(e.option) ? e.option : -1, correct: e.correct === true, elapsed_ms: Number.isFinite(e.elapsed_ms) ? e.elapsed_ms : 0, at: e.at });
  }
  arenaByLesson.set(lessonId, ar);
}
function persist(lessonId) {
  const st = store();
  if (!st) return;
  const attempts = {};
  for (const [k, v] of attemptsByLesson.get(lessonId) || []) attempts[k] = v;
  const earnedAt = Object.fromEntries(earnedAtByLesson.get(lessonId) || []);
  const arena = {};
  for (const [k, v] of arenaByLesson.get(lessonId) || []) arena[k] = v;
  try {
    st.setItem(KEY(lessonId), JSON.stringify({ v: 1, attempts, earnedAt, arena }));
  } catch {
  }
}
function logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs } = {}) {
  if (!lessonId || !Number.isInteger(screenIdx)) return;
  load(lessonId);
  if (!attemptsByLesson.has(lessonId)) attemptsByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const m = attemptsByLesson.get(lessonId);
  if (!m.has(screenIdx)) m.set(screenIdx, []);
  const list = m.get(screenIdx);
  if (list.length >= LIM.attempts) return;
  list.push({ option: Number.isInteger(picked) ? picked : -1, answer: cut(texts && texts.picked, LIM.text), elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
}
function logArena(lessonId, questionId, { picked, correct, elapsedMs } = {}) {
  const m = ARENA_Q.exec(String(questionId || ""));
  if (!lessonId || !m) return false;
  const qi = Number(m[1]);
  load(lessonId);
  if (!arenaByLesson.has(lessonId)) arenaByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const ar = arenaByLesson.get(lessonId);
  if (ar.has(qi) || ar.size >= LIM.questions) return false;
  ar.set(qi, { option: Number.isInteger(picked) ? picked : -1, correct: correct === true, elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
  return true;
}
function noteEarned(lessonId, ids) {
  if (!lessonId || !Array.isArray(ids)) return;
  load(lessonId);
  if (!earnedAtByLesson.has(lessonId)) earnedAtByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const m = earnedAtByLesson.get(lessonId);
  const now = Date.now();
  let changed = false;
  for (const raw of ids) {
    const id = String(raw);
    if (!m.has(id)) {
      m.set(id, now);
      changed = true;
    }
  }
  if (changed) persist(lessonId);
}
function resetResultDetails(lessonId) {
  attemptsByLesson.delete(lessonId);
  earnedAtByLesson.delete(lessonId);
  arenaByLesson.delete(lessonId);
  loaded.delete(lessonId);
  sealedByLesson.delete(lessonId);
  try {
    store()?.removeItem(KEY(lessonId));
  } catch {
  }
  try {
    store()?.removeItem(SEAL_KEY(lessonId));
  } catch {
  }
}
var sealedByLesson = /* @__PURE__ */ new Map();
var SEAL_KEY = (lessonId) => `ccSeal:${lessonId}`;
var attemptMark = (lessonId) => {
  try {
    const ls = JSON.parse(store()?.getItem(`liveSession:${lessonId}`) || "null");
    return String(ls && (ls.attemptId || ls.pin) || "");
  } catch {
    return "";
  }
};
var sealKey = (lessonId, p) => `${(p && p.livePin) ?? ""}|${(p && p.liveMode) ?? ""}|${attemptMark(lessonId)}`;
function sealPayload(lessonId, payload) {
  if (!lessonId || !payload || typeof payload !== "object") return payload;
  try {
    const key = sealKey(lessonId, payload);
    let held = sealedByLesson.get(lessonId);
    if (!held) {
      try {
        held = JSON.parse(store()?.getItem(SEAL_KEY(lessonId)) || "null");
      } catch {
        held = null;
      }
      if (held && held.key && held.json) sealedByLesson.set(lessonId, held);
      else held = null;
    }
    if (held && held.key === key) return JSON.parse(held.json);
    const rec = { key, json: JSON.stringify(payload) };
    sealedByLesson.set(lessonId, rec);
    try {
      store()?.setItem(SEAL_KEY(lessonId), JSON.stringify(rec));
    } catch {
    }
    return JSON.parse(rec.json);
  } catch {
    return payload;
  }
}
function unsealPayload(lessonId) {
  sealedByLesson.delete(lessonId);
}
function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now, arenaBank } = {}) {
  const lang = langIn === "ru" || langIn === "uz" ? langIn : getLiveLang();
  const finish = now || Date.now();
  load(lessonId);
  const log = attemptsByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  const questions = [];
  (screenMeta || []).forEach((meta, i) => {
    if (!meta || !meta.scored) return;
    const a = answers && answers[i];
    if (!a || typeof a !== "object" || !Number.isInteger(a.picked)) return;
    if (questions.length >= LIM.questions) return;
    const correctIdx = Number.isInteger(a.correctIndex) ? a.correctIndex : Number.isInteger(a.correctIdx) ? a.correctIdx : null;
    const raw = (log.get(i) || []).slice().sort((x, y) => x.at - y.at).slice(0, LIM.attempts);
    const options = Array.isArray(a.options) ? a.options.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : void 0;
    const correct = a.correct === true;
    const last = Number.isInteger(a.lastPicked) ? a.lastPicked : a.picked;
    const eventually = correctIdx !== null ? last === correctIdx : a.solved === true;
    const baseAt = Number.isInteger(a.at) ? a.at : finish;
    const fallback = correct || !eventually ? [{ option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt }] : [{ option: -1, elapsed_ms: 0, at: baseAt, correct: false }, { option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt, correct: true }];
    const attempts = (raw.length ? raw : fallback).map((t, n) => {
      const o = { n: n + 1, option: t.option, correct: typeof t.correct === "boolean" ? t.correct : correctIdx !== null ? t.option === correctIdx : false, elapsed_ms: t.elapsed_ms, at: iso(t.at) };
      const ans = t.answer ?? (options && t.option >= 0 ? options[t.option] : void 0);
      if (typeof ans === "string") o.answer = ans.slice(0, LIM.text);
      return o;
    });
    if (attempts[0]) attempts[0].correct = correct;
    if (correctIdx === null && eventually && !attempts.some((t) => t.correct)) attempts[attempts.length - 1].correct = true;
    const q = {
      question_id: meta.id && String(meta.id) || `s${i}`,
      kind: "test",
      order: questions.length + 1,
      correct,
      solved: attempts.some((t) => t.correct),
      // F-0909-03: dars bayrog'i emas, urinish-dalili (server result-builder.js:356 bilan bir xil)
      attempts
    };
    const qt = cut(typeof a.question === "string" ? a.question : optText(a.question, lang), LIM.text);
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    const ca = cut(typeof a.correctAnswer === "string" ? a.correctAnswer : options && correctIdx !== null ? options[correctIdx] : void 0, LIM.text);
    if (ca) q.correct_answer = ca;
    if (correctIdx === null) return;
    questions.push(q);
  });
  const arena = [...(arenaByLesson.get(lessonId) || /* @__PURE__ */ new Map()).entries()].sort((x, y) => x[0] - y[0]);
  for (const [qi, e] of arena) {
    if (questions.length >= LIM.questions) break;
    const bank = Array.isArray(arenaBank) ? arenaBank[qi] : null;
    const rawOpts = bank && (Array.isArray(bank.opts) ? bank.opts : Array.isArray(bank.options) ? bank.options : null);
    const options = rawOpts ? rawOpts.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : void 0;
    const correctIdx = bank && Number.isInteger(bank.correct) ? bank.correct : null;
    const attempt = { n: 1, option: e.option, correct: e.correct, elapsed_ms: e.elapsed_ms, at: iso(e.at) };
    if (options && e.option >= 0 && e.option < options.length) attempt.answer = options[e.option];
    const q = { question_id: `quiz-${qi}`, kind: "arena", order: questions.length + 1, correct: e.correct, solved: e.correct, attempts: [attempt] };
    const qt = bank ? cut(typeof (bank.q ?? bank.question) === "string" ? bank.q ?? bank.question : optText(bank.q ?? bank.question, lang), LIM.text) : void 0;
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    if (options && correctIdx !== null && options[correctIdx]) q.correct_answer = options[correctIdx];
    questions.push(q);
  }
  const at = earnedAtByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Set();
  const list = [];
  for (const raw of earned instanceof Set ? [...earned] : Array.isArray(earned) ? earned : []) {
    const id = String(raw).toLowerCase();
    if (!/^[a-z0-9_-]{1,32}$/.test(id) || seen.has(id)) continue;
    seen.add(id);
    const def = achievements && (achievements[raw] || achievements[id]) || null;
    const desc = def && def.desc;
    const title = typeof desc === "string" ? desc : desc && (desc[lang] || desc.uz) || def && def.name || id;
    list.push({ id, name: String(def && def.name || id).slice(0, LIM.name), title: String(title).slice(0, LIM.title), earned_at: iso(at.get(String(raw)) ?? at.get(id) ?? finish) });
  }
  list.sort((x, y) => x.earned_at < y.earned_at ? -1 : x.earned_at > y.earned_at ? 1 : 0);
  return { lang, questions, achievements: list.slice(0, LIM.achievements) };
}

// src/live/progressSync.js
var DEBOUNCE_MS = 2e3;
var channels = /* @__PURE__ */ new Map();
function setProgressChannel(lessonId, ch) {
  const prev = channels.get(lessonId);
  if (prev) {
    clearTimeout(prev.timer);
    flush(lessonId, { keepalive: true });
  }
  if (!ch) {
    channels.delete(lessonId);
    return;
  }
  channels.set(lessonId, { ...ch, timer: null, pending: null, inFlight: false });
}
function queueProgress(lessonId, obj) {
  if (obj && Array.isArray(obj.earned)) noteEarned(lessonId, obj.earned);
  const ch = channels.get(lessonId);
  if (!ch || ch.status !== "active" || !obj) return;
  ch.pending = {
    lesson_id: lessonId,
    attempt_id: ch.attemptId,
    screen: Number.isInteger(obj.screen) ? obj.screen : 0,
    total: Number.isInteger(obj.total) && obj.total > 0 ? obj.total : void 0,
    answers: obj.answers && typeof obj.answers === "object" ? obj.answers : {},
    earned: Array.isArray(obj.earned) ? obj.earned.map(String) : [],
    started_at_ms: Number.isInteger(obj.startedAt) ? obj.startedAt : void 0,
    client_ts: Date.now()
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
    if (r && r.status === "finished") {
      ch.status = "finished";
      ch.onFinished?.({ reason: r.finish_reason || "completed" });
    }
  } catch (e) {
    if (e && (e.status === 409 || e.status === 404 || e.status === 401 || e.status === 403)) {
      ch.status = "finished";
      if (e.status === 409) ch.onFinished?.({ reason: "server" });
    } else {
      if (!ch.pending) ch.pending = body;
    }
    ch.onError?.(e);
  } finally {
    ch.inFlight = false;
    if (ch.pending && ch.status === "active" && !ch.timer) ch.timer = setTimeout(() => {
      ch.timer = null;
      flush(lessonId);
    }, DEBOUNCE_MS);
  }
}
function flushAll(keepalive) {
  for (const id of channels.keys()) {
    const ch = channels.get(id);
    clearTimeout(ch.timer);
    ch.timer = null;
    flush(id, { keepalive });
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => flushAll(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushAll(true);
  });
}
setProgWriteHook(queueProgress);

// src/live/useLiveSession.js
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
var LiveGateCtx = createContext(null);
var STORED_MODES = ["self", "student", "mentor", "solo", "review"];
function useLiveSession(lessonId, answerKey, opts = {}) {
  const liveToken = opts.liveToken || null;
  const lessonVersion = opts.lessonVersion || null;
  const keyRef = useRef(answerKey);
  keyRef.current = answerKey;
  useEffect(() => {
    unsealPayload(lessonId);
  }, [lessonId]);
  const initRef = useRef(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED) return "self";
    if (init && STORED_MODES.includes(init.mode)) return init.mode;
    return "choosing";
  });
  const [pin, setPin] = useState(init?.pin || null);
  const tokenRef = useRef(init?.token || null);
  const playerRef = useRef(init?.playerId ? { id: init.playerId, token: init.playerToken } : null);
  const nickRef = useRef(init?.nickname || "");
  const [mentorScreen, setMentorScreen] = useState(init?.lastScreen || 0);
  const [mentorMax, setMentorMax] = useState(init?.maxScreen ?? init?.lastScreen ?? 0);
  const [status, setStatus] = useState("live");
  const [mentorAlive, setMentorAlive] = useState(true);
  const [connected, setConnected] = useState(true);
  const [ended, setEnded] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [busy, setBusy] = useState(false);
  const [quiz, setQuiz] = useState({ state: "off", q: -1 });
  const [revealScreen, setRevealScreen] = useState(-1);
  const lastSeenRef = useRef(Date.now());
  const lastUpdatedRef = useRef(null);
  const mentorScreenOf = (row) => typeof row.cur_screen === "number" ? row.cur_screen : row.max_screen;
  const syncQuiz = useCallback((row) => {
    const qs = row?.quiz_state || "off", qq = row?.quiz_q ?? -1;
    setQuiz((p) => p.state === qs && p.q === qq ? p : { state: qs, q: qq });
    const rv = row?.reveal_screen ?? -1;
    setRevealScreen((p) => p === rv ? p : rv);
  }, []);
  useEffect(() => {
    if (mode !== "student" || !pin) return;
    let on = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => {
      if (on) timer = setTimeout(tick, delay);
    };
    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) {
        schedule();
        return;
      }
      try {
        const row = await liveGet(pin);
        if (!on) return;
        delay = LIVE_POLL_MS;
        setConnected(true);
        if (!row) {
          setStatus((p) => p === "ended" ? p : "ended");
          schedule();
          return;
        }
        const mScr = mentorScreenOf(row);
        const mMax = Math.max(row.max_screen ?? 0, mScr);
        setMentorScreen((p) => p === mScr ? p : mScr);
        setMentorMax((p) => mMax > p ? mMax : p);
        setStatus((p) => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) {
          lastUpdatedRef.current = row.updated_at;
          lastSeenRef.current = Date.now();
          liveStore(lessonId, { mode: "student", pin, lastScreen: mScr, maxScreen: mMax, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current });
        }
        const alive = Date.now() - lastSeenRef.current < LIVE_STALE_MS;
        setMentorAlive((p) => p === alive ? p : alive);
      } catch {
        if (!on) return;
        setConnected(false);
        delay = Math.min(delay * 2, LIVE_POLL_MAX_MS);
      }
      schedule();
    };
    tick();
    const onVis = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        delay = LIVE_POLL_MS;
        tick();
      }
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearTimeout(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  useEffect(() => {
    if (mode !== "mentor" || !pin) return;
    let on = true;
    liveGet(pin).then((row) => {
      if (!on) return;
      if (!row || row.status === "ended") {
        liveClear(lessonId);
        setPin(null);
        tokenRef.current = null;
        setMode("choosing");
        setEnded(false);
        return;
      }
      syncQuiz(row);
    }).catch(() => {
    });
    const beat = () => {
      liveRpc("session_heartbeat", { p_pin: pin, p_token: tokenRef.current }).catch(() => {
      });
    };
    beat();
    const id = setInterval(beat, LIVE_HEARTBEAT_MS);
    const onVis = () => {
      if (typeof document !== "undefined" && !document.hidden) beat();
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearInterval(id);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  const startMentor = useCallback(async (mentorCode) => {
    setBusy(true);
    setJoinError("");
    try {
      const res = await liveRpc("create_session", { p_lesson_id: lessonId, p_mentor_code: (mentorCode || "").trim() });
      const row = Array.isArray(res) ? res[0] : res;
      if (!row?.pin) throw new Error("no pin");
      tokenRef.current = row.token;
      setPin(row.pin);
      setMode("mentor");
      setEnded(false);
      liveStore(lessonId, { mode: "mentor", pin: row.pin, token: row.token });
      if (keyRef.current) liveRpc("set_quiz_keys", { p_lesson_id: lessonId, p_mentor_code: (mentorCode || "").trim(), p_keys: keyRef.current }).catch(() => {
      });
    } catch (e) {
      const st = e && e.status;
      setJoinError(
        st === 401 || st === 403 ? tr({ uz: "Mentor kodi noto'g'ri.", ru: "Неверный код ментора." }) : st ? tr({ uz: `Server javob bermadi (xato ${st}). Birozdan keyin urinib ko'ring.`, ru: `Сервер не ответил (ошибка ${st}). Попробуйте чуть позже.` }) : tr({
          uz: "Serverga ulanib bo'lmadi. Internetni tekshiring — yoki «← Orqaga» bosib, «Kodsiz, o'zim ko'raman» bilan darsni jonli rejimsiz o'tkazing.",
          ru: "Не удалось подключиться к серверу. Проверьте интернет — или нажмите «← Назад» и выберите «Без кода, смотрю сам», чтобы провести урок без живого режима."
        })
      );
    } finally {
      setBusy(false);
    }
  }, [lessonId]);
  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || "").replace(/\D/g, "");
    const nick = (rawNick || "").trim();
    if (p.length < 4) {
      setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: "Введите код полностью." }));
      return;
    }
    if (nick.length < 2) {
      setJoinError(tr({ uz: "Ismingizni kiriting (kamida 2 harf).", ru: "Введите имя (минимум 2 буквы)." }));
      return;
    }
    setBusy(true);
    setJoinError("");
    try {
      const row = await liveGet(p);
      if (!row) {
        setJoinError(tr({ uz: "Bunday kod topilmadi.", ru: "Такой код не найден." }));
        setBusy(false);
        return;
      }
      if (row.lesson_id && row.lesson_id !== lessonId) {
        setJoinError(tr({ uz: "Bu kod boshqa darsga tegishli.", ru: "Этот код относится к другому уроку." }));
        setBusy(false);
        return;
      }
      if (row.status !== "live") {
        setJoinError(tr({ uz: "Bu dars allaqachon yakunlangan.", ru: "Этот урок уже завершён." }));
        setBusy(false);
        return;
      }
      const res = await liveRpc("join_session", { p_pin: p, p_nickname: nick });
      const player = Array.isArray(res) ? res[0] : res;
      if (!player?.player_id) throw new Error("no player");
      playerRef.current = { id: player.player_id, token: player.token };
      nickRef.current = nick;
      nickStore(nick);
      lastUpdatedRef.current = row.updated_at;
      lastSeenRef.current = Date.now();
      const jScr = mentorScreenOf(row), jMax = Math.max(row.max_screen ?? 0, jScr);
      setPin(p);
      setMentorScreen(jScr);
      setMentorMax(jMax);
      setStatus(row.status);
      setMode("student");
      liveStore(lessonId, { mode: "student", pin: p, lastScreen: jScr, maxScreen: jMax, playerId: player.player_id, playerToken: player.token, nickname: nick });
    } catch (e) {
      const m = String(e?.message || "");
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: "Не удалось подключиться. Проверьте интернет." }));
    } finally {
      setBusy(false);
    }
  }, [lessonId]);
  const selfStudy = useCallback(() => {
    setMode("self");
    liveStore(lessonId, { mode: "self" });
  }, [lessonId]);
  const reportScreen = useCallback((idx) => {
    if (mode === "mentor" && pin) liveRpc("advance_session", { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {
    });
  }, [mode, pin]);
  const endSession = useCallback(() => {
    if (mode === "mentor" && pin) {
      liveRpc("end_session", { p_pin: pin, p_token: tokenRef.current }).catch(() => {
      });
      setEnded(true);
    }
  }, [mode, pin]);
  const submitAnswer = useCallback((screenIdx, questionId, picked, correct, elapsedMs) => {
    if (mode === "student") logArena(lessonId, questionId, { picked, correct, elapsedMs });
    if (mode !== "student" && mode !== "solo" || !pin || !playerRef.current) return;
    const body = {
      p_pin: pin,
      p_player_id: playerRef.current.id,
      p_token: playerRef.current.token,
      p_screen: screenIdx,
      p_question_id: questionId || "",
      p_picked: picked,
      p_correct: !!correct,
      p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0))
    };
    const attempt2 = (n) => {
      liveRpc("submit_answer", body).catch(() => {
        if (n < 3) setTimeout(() => attempt2(n + 1), 3e3 * (n + 1));
      });
    };
    attempt2(0);
  }, [mode, pin, lessonId]);
  const recordAttempt = useCallback((screenIdx, questionId, picked, elapsedMs, texts) => {
    logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs });
    if (mode !== "student" && mode !== "solo" || !pin || !playerRef.current) return;
    const cut2 = (v) => typeof v === "string" ? v.slice(0, 300) : void 0;
    const t = texts && typeof texts === "object" ? {
      question: cut2(texts.question),
      options: Array.isArray(texts.options) ? texts.options.slice(0, 6).map((o) => cut2(String(o ?? ""))) : void 0,
      picked: cut2(texts.picked),
      correct: cut2(texts.correct),
      lang: texts.lang === "ru" ? "ru" : "uz"
    } : void 0;
    if (t) {
      for (const k of Object.keys(t)) if (t[k] === void 0) delete t[k];
    }
    const body = {
      p_pin: pin,
      p_player_id: playerRef.current.id,
      p_token: playerRef.current.token,
      p_screen: screenIdx,
      p_question_id: questionId || "",
      p_picked: picked,
      p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0)),
      ...t ? { p_texts: t } : {}
    };
    const attempt2 = (n) => {
      liveRpc("record_attempt", body).catch(() => {
        if (n < 3) setTimeout(() => attempt2(n + 1), 3e3 * (n + 1));
      });
    };
    attempt2(0);
  }, [mode, pin]);
  const quizControl = useCallback(async (state, q) => {
    if (mode !== "mentor" || !pin) throw new Error("mentor emas");
    await liveRpc("quiz_control", { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);
  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== "mentor" || !pin) return;
    setRevealScreen(screenIdx);
    liveRpc("reveal_screen", { p_pin: pin, p_token: tokenRef.current, p_screen: screenIdx }).catch(() => {
    });
  }, [mode, pin]);
  const [lms, setLms] = useState({ state: "idle", choices: null, message: "" });
  const [attempt, setAttempt] = useState(null);
  const [serverProgress, setServerProgress] = useState(null);
  const lmsTokenRef = useRef(null);
  const openChannel = useCallback((tok, att) => {
    if (!att || att.status !== "active") {
      setProgressChannel(lessonId, null);
      return;
    }
    setProgressChannel(lessonId, {
      token: tok,
      attemptId: att.id,
      status: "active",
      onFinished: (info) => setAttempt((a) => a && a.id === att.id ? { ...a, status: "finished", finish_reason: info?.reason || "completed" } : a)
    });
  }, [lessonId]);
  const applyServerSession = useCallback((p, tok) => {
    if (!p || typeof p !== "object") return false;
    const prog = p.progress ? { ...p.progress, seq: Date.now() + Math.random() } : null;
    if (p.mode === "mentor" && p.pin && p.token) {
      tokenRef.current = p.token;
      setPin(p.pin);
      setEnded(false);
      setJoinError("");
      setMode("mentor");
      liveStore(lessonId, { mode: "mentor", pin: p.pin, token: p.token });
      setAttempt(null);
      setProgressChannel(lessonId, null);
      return true;
    }
    if (p.mode === "student" && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken };
      nickRef.current = p.nickname || "";
      if (p.nickname) nickStore(p.nickname);
      lastUpdatedRef.current = null;
      lastSeenRef.current = Date.now();
      const scr = p.lastScreen || 0, mx = Math.max(p.maxScreen || 0, scr);
      setPin(p.pin);
      setMentorScreen(scr);
      setMentorMax(mx);
      setStatus("live");
      setJoinError("");
      setMode("student");
      liveStore(lessonId, { mode: "student", pin: p.pin, lastScreen: scr, maxScreen: mx, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      openChannel(tok, p.attempt);
      return true;
    }
    if (p.mode === "solo" && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken };
      nickRef.current = p.nickname || "";
      if (p.nickname) nickStore(p.nickname);
      setPin(p.pin);
      setStatus("live");
      setJoinError("");
      setMode("solo");
      liveStore(lessonId, { mode: "solo", pin: p.pin, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      openChannel(tok, p.attempt);
      return true;
    }
    if (p.mode === "review") {
      setJoinError("");
      setMode("review");
      liveStore(lessonId, { mode: "review", attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      setProgressChannel(lessonId, null);
      return true;
    }
    return false;
  }, [lessonId, openChannel]);
  const joinWithToken = useCallback(async (sessionId) => {
    const tok = lmsTokenRef.current;
    if (!tok) return;
    setLms((s) => ({ ...s, state: "joining", message: "" }));
    try {
      const body = { lesson_id: lessonId };
      if (lessonVersion) body.lesson_version = lessonVersion;
      if (sessionId) body.session_id = sessionId;
      if (keyRef.current && peekTokenRole(tok) === "mentor") body.answer_key = keyRef.current;
      const res = await lmsJoin(tok, body);
      if (res && Array.isArray(res.choose)) {
        setLms({ state: "choose", choices: res.choose, message: "" });
        return;
      }
      if (applyServerSession(res, tok)) {
        setLms({ state: "joined", choices: null, message: "" });
        return;
      }
      setLms({ state: "error", choices: null, message: "" });
    } catch (e) {
      const code = e && e.code || "";
      setLms({ state: code === "no_active_session" ? "none" : "error", choices: null, message: String(e && e.message || "") });
    }
  }, [lessonId, lessonVersion, applyServerSession]);
  const restartAttempt = useCallback(async () => {
    resetResultDetails(lessonId);
    const tok = lmsTokenRef.current;
    if (!tok) return false;
    setBusy(true);
    try {
      const res = await lmsRestart(tok, lessonId);
      return applyServerSession(res, tok);
    } catch (e) {
      setJoinError(String(e && e.message || tr({ uz: "Qaytadan boshlab bo'lmadi.", ru: "Не удалось начать заново." })));
      return false;
    } finally {
      setBusy(false);
    }
  }, [lessonId, applyServerSession]);
  useEffect(() => {
    if (!LIVE_ENABLED || !liveToken || lmsTokenRef.current === liveToken) return;
    lmsTokenRef.current = liveToken;
    joinWithToken();
  }, [liveToken, joinWithToken]);
  const [liveJoinedNote, setLiveJoinedNote] = useState(false);
  const attemptId = attempt?.id || null, attemptStatus = attempt?.status || null;
  useEffect(() => {
    if (mode !== "solo" || lms.state !== "joined" || !attemptId || attemptStatus !== "active") return;
    const tok = lmsTokenRef.current;
    if (!tok || peekTokenRole(tok) !== "student") return;
    let on = true, inFlight = false;
    const recheck = async () => {
      if (!on || inFlight || typeof document !== "undefined" && document.hidden) return;
      inFlight = true;
      try {
        const body = { lesson_id: lessonId };
        if (lessonVersion) body.lesson_version = lessonVersion;
        const res = await lmsJoin(tok, body);
        if (!on || !res || res.mode !== "student") return;
        resetResultDetails(lessonId);
        if (applyServerSession(res, tok)) setLiveJoinedNote(true);
      } catch {
      } finally {
        inFlight = false;
      }
    };
    const id = setInterval(recheck, LMS_SOLO_RECHECK_MS);
    const onVis = () => {
      if (typeof document !== "undefined" && !document.hidden) recheck();
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearInterval(id);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, lms.state, attemptId, attemptStatus, lessonId, lessonVersion, applyServerSession]);
  useEffect(() => {
    if (!liveJoinedNote) return;
    const t = setTimeout(() => setLiveJoinedNote(false), 8e3);
    return () => clearTimeout(t);
  }, [liveJoinedNote]);
  useEffect(() => () => setProgressChannel(lessonId, null), [lessonId]);
  return {
    mode,
    pin,
    mentorScreen,
    mentorMax,
    status,
    mentorAlive,
    connected,
    ended,
    joinError,
    busy,
    startMentor,
    joinStudent,
    selfStudy,
    reportScreen,
    endSession,
    submitAnswer,
    recordAttempt,
    quiz,
    quizControl,
    revealScreen,
    mentorReveal,
    playerId: playerRef.current?.id || null,
    nickname: nickRef.current,
    lms,
    joinWithToken,
    hasLmsToken: !!liveToken,
    attempt,
    serverProgress,
    restartAttempt,
    liveJoinedNote
  };
}

// src/live/useServerProgress.js
import { useEffect as useEffect2, useRef as useRef2 } from "react";
function useServerProgress(live, refs) {
  const seenRef = useRef2(null);
  const p = live && live.serverProgress;
  useEffect2(() => {
    if (!p || !p.seq || seenRef.current === p.seq) return;
    seenRef.current = p.seq;
    const { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total } = refs || {};
    let answers = p.answers && typeof p.answers === "object" ? p.answers : {};
    let earned = Array.isArray(p.earned) ? p.earned : [];
    let screen = Number.isInteger(p.screen) ? p.screen : 0;
    if (p.total && total && p.total !== total) {
      answers = {};
      earned = [];
      screen = 0;
    }
    if (total) screen = Math.min(Math.max(screen, 0), total - 1);
    if (typeof setAnswers === "function") setAnswers(answers);
    if (typeof setScreen === "function") setScreen(screen);
    if (earnedRef && typeof earnedRef === "object") earnedRef.current = new Set(earned);
    if (typeof setEarned === "function") setEarned(new Set(earned));
    if (startTimeRef && typeof startTimeRef === "object") startTimeRef.current = Number.isInteger(p.startedAt) ? p.startedAt : Date.now();
  }, [p]);
}

// src/live/LiveUI.jsx
import React2, { useState as useState2, useEffect as useEffect3 } from "react";
var LT = { bg: "#F6F4EF", ink: "#0E0E10", ink2: "#5A5A60", ink3: "#A7A6A2", paper: "#FFFFFF", accent: "#FF4F28", accentSoft: "#FFE8E1", success: "#1F7A4D" };
var _liveBtnPri = { background: LT.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer" };
var _liveBadgeS = { position: "fixed", top: 2, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: "2px 14px", fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: "0 2px 10px rgba(58,53,48,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", maxWidth: "92vw" };
var _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: "inline-block" });
function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || "").split("");
  const overlay = { position: "fixed", inset: 0, zIndex: 1e4, background: LT.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,40px)", textAlign: "center" };
  const box = { background: LT.paper, color: LT.ink, borderRadius: "clamp(10px,1.6vw,18px)", fontFamily: "monospace", fontWeight: 800, lineHeight: 1, fontSize: "clamp(48px,13vw,150px)", padding: "clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" };
  return <div style={overlay}>
      <div style={{ fontSize: "clamp(13px,2vw,18px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: LT.accent, marginBottom: "clamp(14px,3vw,28px)" }}>{tr({ uz: "Jonli darsga qo'shilish", ru: "Подключение к живому уроку" })}</div>
      <div style={{ display: "flex", gap: "clamp(6px,1.4vw,16px)", justifyContent: "center", flexWrap: "wrap" }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: "#fff", opacity: 0.85, fontSize: "clamp(15px,2.2vw,22px)", maxWidth: 640, margin: "clamp(20px,4vw,36px) 0 0", lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: "#fff" }}>«👨‍🎓 O'quvchiman»</b> → shu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: "#fff" }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr({ uz: "Darsni boshlash →", ru: "Начать урок →" })}</button>
    </div>;
}
function LiveGate({ live, title = "Jonli dars" }) {
  const [code, setCode] = useState2("");
  const [nick, setNick] = useState2(() => nickRead());
  const [mentorCode, setMentorCode] = useState2("");
  const [role, setRole] = useState2("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  const lms = live.lms || { state: "idle" };
  const [pinFallback, setPinFallback] = useState2(false);
  if (lms.state === "joining" || live.hasLmsToken && lms.state === "idle") {
    return <div style={wrap}><div style={card} data-live="lms-joining">
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr({ uz: "Darsga ulanmoqda…", ru: "Подключение к уроку…" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "LMS orqali avtomatik kirish. Bir necha soniya.", ru: "Автоматический вход через LMS. Несколько секунд." })}</p></div>
    </div></div>;
  }
  if (lms.state === "choose" && !pinFallback && Array.isArray(lms.choices)) {
    const when = (iso2) => {
      try {
        return new Date(iso2).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    };
    return <div style={wrap}><div style={card} data-live="lms-choose">
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr({ uz: "Qaysi darsga kirasiz?", ru: "На какой урок войти?" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "Hozir bir nechta jonli dars ketmoqda.", ru: "Сейчас идёт несколько живых уроков." })}</p></div>
      {lms.choices.map((c) => <button key={c.session_id} onClick={() => live.joinWithToken(c.session_id)} style={{ ..._liveBtnPri, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>{tr(c.lesson_title) || tr(title)}</span><span style={{ opacity: 0.8, fontWeight: 600 }}>{when(c.started_at)}</span>
        </button>)}
      <button onClick={() => setPinFallback(true)} style={link}>{tr({ uz: "Kod bilan kiraman →", ru: "Войду по коду →" })}</button>
    </div></div>;
  }
  const lmsNote = lms.state === "none" ? tr({ uz: "Guruhingizda hozir jonli dars yo'q. Kod bilan kiring yoki o'zingiz ko'ring.", ru: "В вашей группе сейчас нет живого урока. Войдите по коду или смотрите сами." }) : lms.state === "error" ? tr({ uz: "Avtomatik kirish bo'lmadi. Kod bilan kiring.", ru: "Автоматический вход не удался. Войдите по коду." }) : "";
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>{tr({ uz: "🧑‍🏫 Mentor kirishi", ru: "🧑‍🏫 Вход для ментора" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "Mentor kodini kiriting.", ru: "Введите код ментора." })}</p></div>
      <input value={mentorCode} onChange={(e) => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: "Mentor kodi", ru: "Код ментора" })} onKeyDown={(e) => {
      if (e.key === "Enter") live.startMentor(mentorCode);
    }} style={{ width: "100%", padding: "14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: "center", outline: "none" }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: "Tekshirilmoqda…", ru: "Проверка…" }) : tr({ uz: "Kirish →", ru: "Войти →" })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
      <button onClick={() => {
      setRole("student");
      setMentorCode("");
    }} style={link}>{tr({ uz: "← Orqaga", ru: "← Назад" })}</button>
    </div></div>;
  }
  return <div style={wrap}><div style={card}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr({ uz: "Darsga qo'shilish", ru: "Присоединиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
    <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: "100%", padding: "16px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", outline: "none" }} />
    <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder={tr({ uz: "Ismingiz (masalan: Ali)", ru: "Ваше имя (например: Али)" })} onKeyDown={(e) => {
    if (e.key === "Enter") live.joinStudent(code, nick);
  }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: "center", outline: "none" }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: "Ulanmoqda…", ru: "Подключение…" }) : tr({ uz: "Qo'shilish →", ru: "Присоединиться →" })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
    {lmsNote && <div data-live="lms-note" style={{ color: LT.ink2, fontSize: 13, textAlign: "center", background: LT.bg, borderRadius: 10, padding: "8px 10px" }}>{lmsNote}</div>}
    {
    /* Jonli dars bo'lmasa (uyda, keyinroq) — darsni kodsiz ochish yo'li. Ilgari bu yo'l yo'q edi (F-0903-01). */
  }
    <button data-live="self" onClick={() => live.selfStudy()} style={link}>{tr({ uz: "Kodsiz, o'zim ko'raman →", ru: "Без кода, смотрю сам →" })}</button>
    <button onClick={() => {
    setRole("mentor");
    setCode("");
  }} title="Mentor" aria-label="Mentor" style={{ position: "absolute", bottom: 10, right: 12, background: "none", border: "none", fontSize: 16, opacity: 0.3, cursor: "pointer", lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>;
}
function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState2(false);
  const [nPlayers, setNPlayers] = useState2(null);
  useEffect3(() => {
    if (live.mode !== "mentor" || !live.pin || live.ended) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const rows = await livePlayers(live.pin);
        if (on) setNPlayers(rows.length);
      } catch {
      }
      if (on) t = setTimeout(tick, 6e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.mode, live.pin, live.ended]);
  if (live.mode === "mentor") {
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: "🔓 Ученики отпущены" })}</div>;
    return <>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div data-tour="live" className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> Kod: <b style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: "Показать код крупно" })} style={{ marginLeft: 6, background: LT.ink, color: "#fff", border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr({ uz: "📺 Ko'rsatish", ru: "📺 Показать" })}</button>
        <button onClick={() => {
      if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: "Отпустить учеников? Они продолжат самостоятельно." }))) live.endSession();
    }} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr({ uz: "🔓 Erkin qilish", ru: "🔓 Отпустить" })}</button>
      </div>
    </>;
  }
  const restartBtn = <button data-live="restart" disabled={live.busy} onClick={() => live.restartAttempt && live.restartAttempt()} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr({ uz: "↻ Qaytadan boshlash", ru: "↻ Начать заново" })}</button>;
  if (live.mode === "solo") {
    const done = live.attempt && live.attempt.status === "finished";
    return <div data-tour="live" data-live="badge-solo" className="live-badge" style={_liveBadgeS}>
      <span style={_liveDot(done ? LT.ink3 : LT.success)} /> {done ? tr({ uz: "✓ Yakunlandi — javoblaringiz saqlandi", ru: "✓ Завершено — ответы сохранены" }) : tr({ uz: "📘 Mustaqil rejim", ru: "📘 Самостоятельный режим" })}
      {!done && live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}
      {done && restartBtn}
    </div>;
  }
  if (live.mode === "review") {
    return <div data-tour="live" data-live="badge-review" className="live-badge" style={_liveBadgeS}>
      <span style={_liveDot(LT.ink3)} /> {tr({ uz: "👁 Ko'rish rejimi — oldingi javoblaringiz", ru: "👁 Режим просмотра — ваши прежние ответы" })}
      {restartBtn}
    </div>;
  }
  if (live.mode === "student") {
    if (live.liveJoinedNote) return <div data-tour="live" data-live="badge-joined" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🎉 Mentor darsni boshladi — jonli darsga ulandingiz", ru: "🎉 Ментор начал урок — вы подключены к живому уроку" })}</div>;
    if (live.status === "ended") return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: "🔓 Свободный режим — продолжайте сами" })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "⚠️ Mentor uzildi — erkin rejim", ru: "⚠️ Ментор отключился — свободный режим" })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot("#FFD380")} /> {tr({ uz: "🔄 Qayta ulanmoqda…", ru: "🔄 Переподключение…" })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "👨‍🏫 Mentor:", ru: "👨‍🏫 Ментор:" })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

// src/3-Modull/ReactIntroLesson.jsx
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
var T = {
  bg: "#F6F4EF",
  ink: "#0E0E10",
  ink2: "#5A5A60",
  ink3: "#A7A6A2",
  paper: "#FFFFFF",
  accent: "#FF4F28",
  accentSoft: "#FFE8E1",
  accentVivid: "#FF4F28",
  success: "#1F7A4D",
  successSoft: "#E3F0E8",
  blue: "#019ACB",
  blueSoft: "#E2F4FA",
  link: "#1a56db",
  line: "#E9E6DF",
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var AchMissCtx = createContext2(null);
var __lang = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState3(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect4(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}
var getAudioEngine = () => null;
var useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {
}, replay: () => {
}, toggleMute: () => {
} });
var LESSON_META = { lessonId: "react-intro-01-v18", lessonTitle: { uz: "React nima va nima uchun?", ru: "Что такое React и зачем" } };
var HW_TOKENS = [
  { t: { uz: "amaliyot", ru: "практика" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "loyiha", ru: "проект" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "mashq", ru: "упражнение" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "natija", ru: "результат" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s3", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s4", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s5", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s5b", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s10", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s13", type: "case", template: "custom", scored: false, scope: null },
  { id: "s14", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
function AchCounter() {
  const earned = useContext2(AchCtx);
  const gate = useContext2(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef3(count);
  const [bump, setBump] = useState3(false);
  const [open, setOpen] = useState3(false);
  useEffect4(() => {
    if (count > prevRef.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 800);
      prevRef.current = count;
      return () => clearTimeout(t);
    }
    prevRef.current = count;
  }, [count]);
  if (gate && gate.live && gate.live.mode === "mentor") return null;
  return <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? "bump" : ""} ${count > 0 ? "has" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(earned && earned.has(id));
    return <div key={id} className={`ach-pop-row ${got ? "got" : ""}`}><span className="ach-pop-ic">{got ? a.icon : "🔒"}</span><span className="ach-pop-nm">{a.name}</span></div>;
  })}
        </div>}
    </div>;
}
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState3(false);
  const contentRef = useRef3(null);
  useEffect4(() => {
    setMCollapsed(false);
  }, [screen]);
  const setCollapsed = useCallback2((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        if (el) el.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest(".mentor")) return;
    setMCollapsed(true);
  };
  const onContentScroll = () => {
    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;
    if (el && el.scrollTop > 6) setMCollapsed(true);
  };
  return <MentorCtx.Provider value={{ enabled: collapseOn, collapsed: mCollapsed, setCollapsed }}>
      <div className="stage">
        <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${(screen + 1) / totalScreens * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {
    /* AUDIOSIZ: ovoz tugmasi (AudioIndicator) ko'rsatilmaydi — ovoz allaqachon o'chirilgan */
  }
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, "0")} / {String(totalScreens).padStart(2, "0")}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? "narrow" : ""}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>;
};
var NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Orqaga", ru: "Назад" })}</button>;
var NavNext = ({ disabled, label, onClick, optionalLive }) => {
  label = label || tr2({ uz: "Davom etish", ru: "Продолжить" });
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : label}</button>;
};
var FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState3(show);
  const [visible, setVisible] = useState3(false);
  const ref = useRef3(null);
  useEffect4(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => {
          if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 350);
      }));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? "visible" : ""}`}><div className={neutral ? "frame-wait" : isCorrect ? "frame-success" : "frame-soft"}>{children}</div></div>;
};
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var RECAPS = {
  4: {
    title: { uz: "React — interfeys quruvchi kutubxona", ru: "React — библиотека для интерфейсов" },
    cards: [
      { ic: "🧰", h: { uz: "React — tayyor asboblar to'plami", ru: "React — набор готовых инструментов" }, body: { uz: <>React — yangi til EMAS. U — siz o'rgangan <b>JavaScript'da yozilgan kutubxona</b>. Kutubxona degani — <b>tayyor asboblar to'plami</b>: sahifaning ko'rinadigan qismini (tugma, menyu, kartochka) tez qurish uchun. Har safar noldan yozmaysiz — tayyorini olasiz.</>, ru: <>React — НЕ новый язык. Это <b>библиотека, написанная на JavaScript</b>, который вы уже знаете. Библиотека — это <b>набор готовых инструментов</b>: чтобы быстро строить видимую часть страницы (кнопки, меню, карточки). Не пишете каждый раз с нуля — берёте готовое.</> }, vis: { uz: <RcFlow items={["JavaScript", "React kutubxonasi", "Interfeys tez quriladi"]} />, ru: <RcFlow items={["JavaScript", "Библиотека React", "Интерфейс строится быстро"]} /> } },
      { ic: "🚫", h: { uz: "Til ham, brauzer ham, tizim ham emas", ru: "Не язык, не браузер и не система" }, body: { uz: <>React — yangi dasturlash tili emas (u JavaScript'ning o'zida yozilgan). Brauzer emas (brauzer — Chrome, Safari). Operatsion tizim emas (u — Windows, Android). React faqat <b>bitta ish</b> qiladi: interfeys quradi.</>, ru: <>React — не новый язык программирования (он написан на самом JavaScript). Не браузер (браузер — это Chrome, Safari). Не операционная система (это Windows, Android). React делает <b>одно дело</b>: строит интерфейс.</> } },
      { ic: "🏭", h: { uz: "Kim yaratgan", ru: "Кто создал" }, body: { uz: <>React'ni <b>Facebook 2013-yilda</b> yaratgan. Bugun Instagram, WhatsApp kabi minglab ilovalar shu kutubxonada ishlaydi. Ya'ni siz mashhur, ishonchli asbob bilan tanishyapsiz.</>, ru: <>React создал <b>Facebook в 2013 году</b>. Сегодня тысячи приложений вроде Instagram и WhatsApp работают на этой библиотеке. То есть вы знакомитесь с известным, надёжным инструментом.</> }, ask: { uz: "React qaysi tanish tilning o'zida yozilgan?", ru: "На каком знакомом вам языке написан React?" } }
    ]
  },
  6: {
    title: { uz: "Komponent — qayta ishlatiladigan blok", ru: "Компонент — переиспользуемый блок" },
    cards: [
      { ic: "🧱", h: { uz: "Komponent — sahifaning bloki", ru: "Компонент — блок страницы" }, body: { uz: <>Minecraft'da butun dunyo <b>alohida bloklardan</b> quriladi. React'da sahifa ham xuddi shunday — <b>komponent</b> degan bloklardan yig'iladi. Menyu, qidiruv katagi, kartochka, tugma — har biri mustaqil blok.</>, ru: <>В Minecraft весь мир строится из <b>отдельных блоков</b>. В React страница точно так же — собирается из блоков под названием <b>компоненты</b>. Меню, строка поиска, карточка, кнопка — каждый из них самостоятельный блок.</> }, vis: { uz: <RcFlow items={["Navbar", "SearchBar", "SkinCard", "LikeButton"]} />, ru: <RcFlow items={["Navbar", "SearchBar", "SkinCard", "LikeButton"]} /> } },
      { ic: "♻️", h: { uz: "Bir marta yoz, ko'p marta ishlat", ru: "Напиши один раз — используй много" }, body: { uz: <>Komponentning eng katta foydasi: uni <b>bir marta yozasiz</b>, keyin <b>xohlagancha qayta ishlatasiz</b>. Sahifada 10 ta bir xil kartochka bo'lsa ham, kod bitta bo'lib qoladi. Xuddi Minecraft'da bitta blokni qayta-qayta qo'yganday.</>, ru: <>Главная польза компонента: вы <b>пишете его один раз</b>, а потом <b>переиспользуете сколько хотите</b>. Даже если на странице 10 одинаковых карточек, код остаётся один. Как в Minecraft, где один и тот же блок ставится снова и снова.</> } },
      { ic: "🎁", h: { uz: "Blok ichida blok", ru: "Блок внутри блока" }, body: { uz: <>Komponent — sozlama, rasm turi yoki tezlik emas. U — sahifaning mustaqil <b>bo'lagi</b>. Blok ichida yana blok yashashi mumkin: kartochka ichida like tugmasi turadi.</>, ru: <>Компонент — не настройка, не формат картинки и не скорость. Это самостоятельная <b>часть</b> страницы. Внутри блока может жить другой блок: внутри карточки находится кнопка лайка.</> }, ask: { uz: "Yoqtirgan saytingizni bloklarga bo'lsangiz, qanday bo'laklarni ko'rasiz?", ru: "Если разбить ваш любимый сайт на блоки — какие части вы увидите?" } }
    ]
  },
  10: {
    title: { uz: "Virtual DOM — xotiradagi nusxa", ru: "Virtual DOM — копия в памяти" },
    cards: [
      { ic: "📝", h: { uz: "Virtual DOM — yengil nusxa", ru: "Virtual DOM — лёгкая копия" }, body: { uz: <>React xotirasida sahifaning yengil nusxasini saqlaydi — bu <b>Virtual DOM</b> deyiladi. O'zgarish bo'lganda React yangi nusxa yaratadi, eskisi bilan solishtiradi va <b>faqat o'zgargan joyni</b> haqiqiy sahifada yangilaydi.</>, ru: <>React хранит в памяти лёгкую копию страницы — она <b>называется Virtual DOM</b>. При изменении React создаёт новую копию, сравнивает со старой и обновляет на настоящей странице <b>только изменившееся место</b>.</> }, vis: { uz: <RcFlow items={["Yangi nusxa", "Eski bilan solishtir", "Faqat o'zgargan joyni yangila"]} />, ru: <RcFlow items={["Новая копия", "Сравни со старой", "Обнови только изменившееся"]} /> } },
      { ic: "⚡", h: { uz: "Faqat o'zgargan joy yangilanadi", ru: "Обновляется только изменившееся место" }, body: { uz: <>Eski usulda like bosilsa <b>butun sahifa</b> qaytadan yuklanardi — sekin, miltillaydi. Virtual DOM aynan shundan qutqaradi: butun sahifani emas, <b>faqat o'zgargan bitta joyni</b> yangilaydi. Shuning uchun React ilovalar tez ishlaydi.</>, ru: <>Раньше при нажатии лайка <b>вся страница</b> перезагружалась — медленно, с миганием. Virtual DOM спасает именно от этого: обновляет не всю страницу, а <b>только одно изменившееся место</b>. Поэтому React-приложения работают быстро.</> } },
      { ic: "🙈", h: { uz: "U ko'rinmaydi", ru: "Его не видно" }, body: { uz: <>Virtual DOM internetni tezlashtirmaydi va kodni o'zi yozib bermaydi. U — xotirada turadigan <b>ko'rinmas nusxa</b>: solishtiradi, farqni topadi, faqat kerakli joyni yangilaydi.</>, ru: <>Virtual DOM не ускоряет интернет и не пишет код за вас. Это <b>невидимая копия</b> в памяти: сравнивает, находит разницу и обновляет только нужное место.</> }, ask: { uz: "Nega butun sahifani qayta chizishdan ko'ra, faqat farqni yangilash tezroq?", ru: "Почему обновить только разницу быстрее, чем перерисовать всю страницу?" } }
    ]
  },
  13: {
    title: { uz: "React Native — bir bilim, ikki platforma", ru: "React Native — одно знание, две платформы" },
    cards: [
      { ic: "📱", h: { uz: "Sayt ham, telefon ilovasi ham", ru: "И сайт, и мобильное приложение" }, body: { uz: <>React'ni o'rgansangiz, faqat sayt emas — <b>haqiqiy telefon ilovalarini</b> ham yasay olasiz. Buning nomi <b>React Native</b>. Bir marta React o'rganasiz — brauzerda ham, telefonda ham ishlaydi.</>, ru: <>Выучив React, вы сможете делать не только сайты, но и <b>настоящие мобильные приложения</b>. Это называется <b>React Native</b>. Один раз учите React — работает и в браузере, и на телефоне.</> }, vis: { uz: <RcFlow items={["Bitta React bilimi", "Brauzerda sayt", "Telefonda ilova"]} />, ru: <RcFlow items={["Одно знание React", "Сайт в браузере", "Приложение на телефоне"]} /> } },
      { ic: "🌍", h: { uz: "Kod bitta, dunyo ikkita", ru: "Код один, мира два" }, body: { uz: <>Xuddi bitta tilni bilib ikki mamlakatda gaplashganday: <b>aynan o'sha komponent kodi</b> brauzerda sayt bo'ladi, telefonda ilova bo'ladi. Ikki marta o'rganish shart emas — bilim bitta.</>, ru: <>Как знать один язык и говорить на нём в двух странах: <b>тот же самый код компонента</b> в браузере становится сайтом, а на телефоне — приложением. Учиться дважды не нужно — знание одно.</> } },
      { ic: "⭐", h: { uz: "Mashhur ilovalar shu yo'lda", ru: "Известные приложения идут этим путём" }, body: { uz: <>React Native — o'yin, bezash yoki internetga ulanish emas. U — React bilimi bilan <b>iOS va Android ilovalari</b> qurish. Instagram, Discord, Shopify aynan shu yo'ldan foydalanadi.</>, ru: <>React Native — не игра, не украшение и не подключение к интернету. Это создание <b>приложений для iOS и Android</b> со знанием React. Instagram, Discord, Shopify используют именно этот путь.</> }, ask: { uz: "Telefoningizdagi qaysi ilovalar React Native'da qurilgan bo'lishi mumkin?", ru: "Какие приложения на вашем телефоне могут быть сделаны на React Native?" } }
    ]
  }
};
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState3(0);
  useEffect4(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setI((p) => Math.min(p + 1, rc.cards.length - 1));
      else if (e.key === "ArrowLeft") setI((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, rc]);
  if (!rc) return null;
  const card = rc.cards[i];
  const last = i === rc.cards.length - 1;
  return <div className="rc-overlay">
      <div className="rc-head">
        <span className="rc-tag">{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Повторное объяснение" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{tr2(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "🗣️ Sinfga savol:", ru: "🗣️ Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr2({ uz: "-karta", ru: "-я карточка" })}`} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
      </div>
    </div>;
}
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState3({ players: null, rows: [] });
  useEffect4(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const answered = data.rows.length;
  const ok = data.rows.filter((a) => a.picked === correctIdx).length;
  const bad = answered - ok;
  const allIn = total > 0 && answered >= total;
  const struggling = answered >= 2 && bad > ok;
  const answeredIds = new Set(data.rows.map((r) => r.player_id));
  const waiting = data.players.filter((p) => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter((a) => a.picked === i).length));
  return <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">{tr2({ uz: "📊 Jonli natija", ru: "📊 Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr2({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>{tr2({ uz: "🔓 Natijani ochish", ru: "🔓 Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr2({ uz: "to'g'ri ✅", ru: "верно ✅" })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr2({ uz: "xato ❌", ru: "ошибка ❌" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr2({ uz: "javob berdi 📨", ru: "ответили 📨" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и число ✅/❌ скрыто — при нажатии «Открыть результат» откроется сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? `${n} ${tr2({ uz: "o'quvchi", ru: "учен." })} · ${pct}%` : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — эта тема осталась для класса непонятной. Перед продолжением рекомендуется короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Повторное объяснение — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту сложно делать вывод. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Повторное объяснение — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуется объяснить ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext2(AchMissCtx);
  const fpPractice = !!(_am && _am.practice);
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }] : null);
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef3(Date.now());
  const [picked, setPicked] = useState3(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState3(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const firstCorrectRef = useRef3(storedAnswer ? storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null : null);
  const [mReveal, setMReveal] = useState3(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState3(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => {
    setMReveal(true);
    if (live) live.mentorReveal(screen);
    if (storedAnswer === void 0) onAnswer(screen, { mentorRevealed: true });
  };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect4(() => {
    if (isMentorLive && liveRevealScreen === screen) setMReveal(true);
  }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options, picked: options[i], correct: options[correctIdx], lang: typeof __lang !== "undefined" && __lang === "ru" ? "ru" : "uz" });
    if (audioText) {
      audio.triggerEvent("option_picked");
      if (!audio.muted) setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) e.pushOneOff(isCorrect ? audioOk || "To'g'ri." : audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.");
      }, 300);
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, нажимайте подумав!" })}</p>}
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
    let cls = "option";
    if (isMentorLive) {
      if (mReveal) {
        if (i === correctIdx) cls += " option-correct";
        else cls += " option-wrong";
      }
    } else if (solved) {
      if (waiting) {
        if (i === picked) cls += " option-wait";
      } else {
        if (i === correctIdx) cls += " option-correct";
        else cls += " option-wrong";
        if (wrongLocked && i === picked) cls += " option-picked-wrong";
      }
    } else if (i === picked) cls += " option-picked-wrong";
    const showGreenLetter = isMentorLive ? mReveal && i === correctIdx : solved && revealed && i === correctIdx;
    return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? "clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)" : "clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)", fontSize: "clamp(15px,1.85vw,17px)", display: "flex", alignItems: "center", gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? <>{tr2({ uz: "✓ To'g'ri javob:", ru: "✓ Верный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Верный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас вы узнаете верный ответ." }) : wrongLocked ? fmtCode(explainWrong[picked] ?? explainWrong.default) : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>;
};
function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState3(C);
  useEffect4(() => {
    const t = setTimeout(() => setOff(C * (1 - PCT)), 200);
    return () => clearTimeout(t);
  }, [C, PCT]);
  return <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + "40"} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr2({ uz: "to'g'ri javob", ru: "верных ответов" })}</div></div>
    </div>;
}
var Mentor = ({ children }) => {
  const ctx = useContext2(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => {
    e.stopPropagation();
    if (ctx.setCollapsed) ctx.setCollapsed(false);
  };
  return <div className={`mentor fade-up ${enabled ? "mentor-mob" : ""} ${collapsed ? "is-collapsed" : ""}`} onClick={collapsed ? expand : void 0} role={collapsed ? "button" : void 0}>
      <div className="mentor-ava" aria-hidden="true">
        <img src={MENTOR_IMG} alt="" />
      </div>
      <div className="mentor-col">
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> · {tr2({ uz: "ko'rsatmani ochish ▾", ru: "открыть подсказку ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
var Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: "italic" }}>{children}</span>;
var Win = ({ title, children, minH }) => <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: "relative" }}>{children}</div></div>;
var SKINS = [
  { name: { uz: "Creeper", ru: "Крипер" }, emoji: "🟩", bg: "#97D8A8" },
  // H135 toza yashil
  { name: { uz: "Zombi", ru: "Зомби" }, emoji: "🧟", bg: "#C4D590" },
  // H75  zaytun-yashil
  { name: { uz: "Ninja", ru: "Ниндзя" }, emoji: "🥷", bg: "#92A2D3" },
  // H225 yumshoq navy
  { name: { uz: "Qahramon", ru: "Герой" }, emoji: "🦸", bg: "#C2A9DA" },
  // H270 yumshoq lavanda
  { name: { uz: "Robot", ru: "Робот" }, emoji: "🤖", bg: "#B3D0DB" },
  // H196 kulrang-ko'k, ochroq
  { name: { uz: "Piglin", ru: "Пиглин" }, emoji: "🐷", bg: "#E0AEBF" }
  // H340 pastel pushti
];
var SkinCard = ({ n }) => {
  const s = SKINS[(n - 1) % SKINS.length];
  const [liked, setLiked] = useState3(false);
  return <div className="vcard el-in">
      <div className="vthumb" style={{ background: s.bg }}><span className="vthumb-em">{s.emoji}</span></div>
      <div className="vcard-b">
        <p className="vcard-name">{tr2(s.name)}</p>
        <button className={`vcard-like ${liked ? "on" : ""}`} onClick={() => setLiked((v) => !v)} title={tr2({ uz: "Like bosib ko'ring", ru: "Нажмите лайк" })}>
          <span className={liked ? "hpop" : void 0}>{liked ? "♥" : "♡"}</span> {10 + n * 3 + (liked ? 1 : 0)}
        </button>
      </div>
    </div>;
};
var McShot = () => <div className="mc-shot" aria-hidden="true">
    <span className="mc-sun" />
    <span className="mc-cloud m1" /><span className="mc-cloud m2" />
    <div className="mc-castle">
      <span className="mc-tower" />
      <span className="mc-keep"><span className="mc-flag" /><span className="mc-door" /></span>
      <span className="mc-tower" />
    </div>
    <span className="mc-ground" />
  </div>;
var LikeDemo = ({ mode, title, onLiked, badge }) => {
  const [likes, setLikes] = useState3(248);
  const [liked, setLiked] = useState3(false);
  const [loading, setLoading] = useState3(false);
  const [rk, setRk] = useState3(0);
  const [pop, setPop] = useState3(false);
  const [tapped, setTapped] = useState3(false);
  const [shown, setShown] = useState3(false);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const apply = () => {
    setLikes((l) => l + (liked ? -1 : 1));
    setLiked((v) => !v);
    if (onLiked) onLiked();
  };
  const click = () => {
    if (loading) return;
    setTapped(true);
    if (mode === "old") {
      setLoading(true);
      timer.current = setTimeout(() => {
        apply();
        setRk((k) => k + 1);
        setLoading(false);
        setShown(true);
      }, 950);
    } else {
      apply();
      setPop(true);
      setShown(true);
      timer.current = setTimeout(() => setPop(false), 420);
    }
  };
  return <>
    <Win title={title}>
      {loading && <div className="reload-cover"><span className="spinner" /><span className="small" style={{ color: T.ink2 }}>{tr2({ uz: "Sahifa qayta yuklanmoqda…", ru: "Страница перезагружается…" })}</span></div>}
      <div key={rk} className={mode === "old" ? "post fade-step" : "post"}>
        <div className="post-head">
          <span className="post-ava">🟩</span>
          <div className="post-meta"><span className="post-user">mc_quruvchi <span className="post-verif">✓</span></span><span className="post-time">{tr2({ uz: "Toshkent · 2 soat oldin", ru: "Ташкент · 2 часа назад" })}</span></div>
          <span className="post-more">···</span>
        </div>
        <McShot />
        <div className="post-actions">
          <button className={`post-like ${liked ? "on" : ""} ${tapped ? "tapped" : ""}`} onClick={click} title={tr2({ uz: "Like bosing", ru: "Нажмите лайк" })}>
            <span className={pop ? "hpop" : void 0}>{liked ? "♥" : "♡"}</span>
          </button>
          <svg className="post-ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          <svg className="post-ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </div>
        <div className="post-likes">{likes.toLocaleString("ru-RU")} {tr2({ uz: "ta like", ru: "лайков" })}</div>
        <div className="post-cap"><b>mc_quruvchi</b> {tr2({ uz: "Yangi qasrni qurib bo'ldim — kelib ko'ringlar! 🏰", ru: "Достроил новый замок — заходите посмотреть! 🏰" })}</div>
      </div>
    </Win>
    {badge && shown && <div className={`lk-badge ${mode === "old" ? "bad" : "good"}`} key={mode + rk + String(liked)}>
        {mode === "old" ? tr2({ uz: "🔄 Sahifa qayta yuklandi", ru: "🔄 Страница перезагрузилась" }) : tr2({ uz: "⚡ Faqat like soni yangilandi", ru: "⚡ Обновилось только число лайков" })}
      </div>}
    </>;
};
var Zoomable = ({ children }) => {
  const [big, setBig] = useState3(false);
  useEffect4(() => {
    if (!big) return;
    const onKey = (e) => {
      if (e.key === "Escape") setBig(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [big]);
  return <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${big ? "zoom-on" : ""}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>
        {children}
      </div>
    </>;
};
function DragDropOrder({ items, hints, onSolved, onWrong }) {
  const order = items.map((x) => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map((x) => [x.id, x])), [items]);
  const [st, setSt] = useState3(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef3([]);
  const full = slots.every((s) => s !== null);
  const solved = slots.every((s, i) => s === order[i]);
  const wrong = full && !solved;
  useEffect4(() => {
    if (solved) onSolved && onSolved();
  }, [solved]);
  useEffect4(() => {
    if (wrong) onWrong && onWrong();
  }, [wrong]);
  const place = (id, from, slotIdx) => setSt(({ pool: pool2, slots: slots2 }) => {
    const ns = slots2.slice();
    const occ = ns[slotIdx];
    if (typeof from === "number") ns[from] = null;
    ns[slotIdx] = id;
    let np = from === "pool" ? pool2.filter((x) => x !== id) : pool2.slice();
    if (occ) np = [...np, occ];
    return { pool: np, slots: ns };
  });
  const toPool = (slotIdx) => setSt(({ pool: pool2, slots: slots2 }) => {
    const id = slots2[slotIdx];
    if (!id) return { pool: pool2, slots: slots2 };
    const ns = slots2.slice();
    ns[slotIdx] = null;
    return { pool: [...pool2, id], slots: ns };
  });
  const tap = (id) => setSt(({ pool: pool2, slots: slots2 }) => {
    const e = slots2.findIndex((s) => s === null);
    if (e < 0) return { pool: pool2, slots: slots2 };
    const ns = slots2.slice();
    ns[e] = id;
    return { pool: pool2.filter((x) => x !== id), slots: ns };
  });
  const down = (ev, id, from) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget;
    const sx = ev.clientX, sy = ev.clientY;
    let moved = false;
    el.style.transition = "none";
    el.style.zIndex = "9999";
    el.style.willChange = "transform";
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
    };
    const finish = (el2) => {
      el2.style.zIndex = "";
      el2.style.willChange = "";
      el2.style.transform = "";
      el2.style.transition = "";
    };
    const up = (e) => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      if (!moved) {
        finish(el);
        if (from === "pool") tap(id);
        else toPool(from);
        return;
      }
      let t = -1;
      slotRefs.current.forEach((elm, i) => {
        if (!elm) return;
        const r = elm.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) t = i;
      });
      if (t >= 0) {
        finish(el);
        place(id, from, t);
      } else if (typeof from === "number") {
        finish(el);
        toPool(from);
      } else {
        el.style.transition = "transform .2s cubic-bezier(.34,1.3,.4,1)";
        el.style.transform = "";
        setTimeout(() => finish(el), 210);
      }
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  };
  return <div className="dd fade-up">
      <div className="dd-wrap">
        <div className="dd-col">
          <span className="dd-lbl">{tr2({ uz: "Bo'laklar", ru: "Блоки" })}</span>
          <div className="dd-pool">
            {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr2({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: "Порядок неверный — нажмите на блок, чтобы вернуть, и разложите заново" })}</span>}
            {pool.map((id) => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, "pool")}>{tr2(byId[id].label)}</button>)}
          </div>
        </div>
        <div className="dd-col">
          <span className="dd-lbl">{tr2({ uz: "To'g'ri tartib", ru: "Правильный порядок" })}</span>
          <div className="dd-slots">
            {slots.map((sid, i) => <div key={i} ref={(el) => slotRefs.current[i] = el} className={`dd-slot ${sid ? "filled" : ""} ${solved && sid ? "ok" : ""} ${wrong && sid && sid !== order[i] ? "bad" : ""}`}>
                <span className="dd-slotn">{i + 1}</span>
                {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr2(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr2(hints[i]) : tr2({ uz: "bu yerga joylang", ru: "положите сюда" })}</span>}
              </div>)}
          </div>
        </div>
      </div>
      {solved && <div className="dd-done">{tr2({ uz: "✓ To'g'ri! Tartib aynan shunday.", ru: "✓ Верно! Порядок именно такой." })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr2({ uz: "⚠️ Tartib xato — qayta joylang.", ru: "⚠️ Порядок неверный — разложите заново." })}</div>}
    </div>;
}
function DebugChallenge({ lines, fixed, explain, onSolved, onWrong }) {
  const bugIdx = lines.findIndex((l) => l.bug);
  const [picked, setPicked] = useState3(-1);
  const [wrongIdx, setWrongIdx] = useState3(-1);
  const solved = picked === bugIdx;
  useEffect4(() => {
    if (solved) onSolved && onSolved();
  }, [solved]);
  const click = (i) => {
    if (solved) return;
    if (i === bugIdx) setPicked(i);
    else {
      if (onWrong) onWrong();
      setWrongIdx(i);
      setTimeout(() => setWrongIdx((w) => w === i ? -1 : w), 500);
    }
  };
  return <div className="dbg fade-up">
      <div className="dbg-code">
        {lines.map((l, i) => <div key={i} className={`dbg-line ${solved && i === bugIdx ? "fixed" : ""} ${wrongIdx === i ? "wrong" : ""}`} onClick={() => click(i)}>
            <span className="dbg-ln">{i + 1}</span>
            <span className="dbg-txt">{solved && i === bugIdx ? tr2(fixed) : tr2(l.text)}</span>
            {solved && i === bugIdx && <span className="dbg-badge">{tr2({ uz: "✓ tuzatildi", ru: "✓ исправлено" })}</span>}
          </div>)}
      </div>
      {!solved ? <p className="dbg-hint">{tr2({ uz: "👆 Xato bor qatorni toping va bosing", ru: "👆 Найдите строку с ошибкой и нажмите на неё" })}</p> : <div className="dbg-ok">{tr2({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })} {tr2(explain)}</div>}
    </div>;
}
var FC_CODE_WORDS = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
var FC_VOCAB = /* @__PURE__ */ new Set(["let", "const", "var", "string", "number", "boolean", "true", "false", "null", "undefined", "function", "return", "for", "while", "if", "else"]);
var fcIsCode = (s) => {
  if (FC_VOCAB.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
var fcTier = (s) => s.length <= 8 ? "t1" : s.length <= 16 ? "t2" : s.length <= 32 ? "t3" : "t4";
var fcAnswer = (raw) => {
  const s = String(raw ?? "");
  const oneToken = !/\s/.test(s) && fcIsCode(s);
  const cls = `fc-tag ${fcTier(s)} ${oneToken ? "mono-all" : "prose"}`;
  if (oneToken) return <span className={cls}>{s}</span>;
  const parts = s.split(FC_CODE_WORDS);
  return <span className={cls}>
      {parts.map((p, i) => i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p)}
    </span>;
};
function Flashcards({ cards }) {
  const [queue, setQueue] = useState3(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState3(false);
  const [known, setKnown] = useState3(0);
  const [exiting, setExiting] = useState3(null);
  const swapRef = useRef3(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? "knew" : "again");
    setTimeout(() => {
      setExiting(null);
      setFlipped(false);
      swapRef.current++;
      if (removed) setKnown((k) => k + 1);
      setQueue((q) => {
        const [first, ...rest] = q;
        return removed ? rest : [...rest, first];
      });
    }, 420);
  };
  const knew = () => advance(true);
  const again = () => advance(false);
  const restart = () => {
    setQueue(cards.map((_, i) => i));
    setKnown(0);
    setFlipped(false);
  };
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{total}/{total} {tr2({ uz: "atama yodlandi", ru: "терминов выучено" })}</p><button className="fc-btn ghost" onClick={restart}>{tr2({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda", ru: "↻ Учится" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr2(card.front)}</span><span className="fc-cue">{tr2({ uz: "Javobni o'ylang", ru: "Подумайте над ответом" })} 🤔 <span className="fc-tap">{tr2({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr2(card.back))}{card.note && <span className="fc-note">{tr2(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr2({ uz: "✗ Takrorlash", ru: "✗ Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })}</button></div> : <p className="fc-hint">{tr2({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: "👆 Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: "s0", text: `Telefoningizda like bosganingizda butun ekran o'chib-yonadimi? Albatta yo'q. Lekin eski saytlarda aynan shunday bo'lardi. Ikkala rejimni almashtirib, like bosib ko'ring — farqni his qiling. Keyin ayting: zamonaviy ilovalar buni qanday uddalaydi?`, trigger: "on_mount", waits_for: { type: "option_picked" } }]);
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const [view, setView] = useState3("old");
  const OPTS = [
    { id: "a", label: tr2({ uz: "Telefon va internet juda tez bo'lgani uchun", ru: "Потому что телефон и интернет очень быстрые" }) },
    { id: "b", label: tr2({ uz: "Faqat o'zgargan joygina yangilanadi", ru: "Обновляется только изменившееся место" }) },
    { id: "c", label: tr2({ uz: "Har safar butun sahifa qayta yuklanadi", ru: "Каждый раз перезагружается вся страница" }) }
  ];
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
    audio.triggerEvent("option_picked");
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>Like bossangiz, butun sahifa <span className="italic" style={{ color: T.accent }}>qayta yuklanadimi</span>?</>, ru: <>Нажали лайк — <span className="italic" style={{ color: T.accent }}>перезагружается ли</span> вся страница?</> })}</h1>
        <Mentor>{tr2({ uz: <>Telefoningizda like bosganingizda butun ekran o'chib-yonadimi? Albatta yo'q. Lekin <b style={{ color: T.ink }}>eski saytlarda</b> aynan shunday bo'lardi. Ikkala rejimni almashtirib, like bosib ko'ring — <b style={{ color: T.ink }}>farqni his qiling</b>.</>, ru: <>Когда вы ставите лайк на телефоне, весь экран гаснет и загорается заново? Нет же! А вот на <b style={{ color: T.ink }}>старых сайтах</b> было именно так. Переключайте оба режима и нажимайте лайк — <b style={{ color: T.ink }}>почувствуйте разницу</b>.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className={`chip ${view === "old" ? "chip-on" : ""}`} onClick={() => setView("old")}>{tr2({ uz: "Eski sayt", ru: "Старый сайт" })}</button>
              <button className={`chip ${view === "react" ? "chip-on" : ""}`} onClick={() => setView("react")}>{tr2({ uz: "Zamonaviy ilova", ru: "Современное приложение" })}</button>
            </div>
            <div className="demo-swap" key={view}>
              <LikeDemo mode={view} title={view === "old" ? "eski-sayt.uz" : "zamonaviy-ilova.uz"} />
              <p className="mono small" style={{ color: T.ink3, marginTop: 6 }}>{view === "old" ? tr2({ uz: "↑ like bosing — nima bo'lishini kuzating", ru: "↑ нажмите лайк — смотрите, что произойдёт" }) : tr2({ uz: "↑ like bosing — endi solishtiring", ru: "↑ нажмите лайк — теперь сравните" })}</p>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Sizningcha, zamonaviy ilovalar buni qanday uddalaydi?", ru: "Как вы думаете, как современные приложения это делают?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{o.label}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: <>To'g'ri! <b>Faqat o'zgargan joy yangilanadi</b>. Buni qiladigan vositaning nomi — <b>React</b>. Hozir qanday ishlashini ko'ramiz.</>, ru: <>Верно! <b>Обновляется только изменившееся место</b>. Инструмент, который это делает, называется <b>React</b>. Сейчас посмотрим, как это работает.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s1", text: `Ishonasizmi — dars oxirida Instagram nega buncha tez ishlashini aniq bilib olasiz. Buning ortida ikkita muhim tushuncha bor: Komponent va Virtual DOM. Bugun shu ikkalasini o'rganamiz, 5 ta qadamda.`, trigger: "on_mount", waits_for: null }]);
  const STEPS = [
    { text: tr2({ uz: "Oddiy saytning kamchiligi", ru: "Недостаток обычного сайта" }), tag: "HTML + JS" },
    { text: tr2({ uz: "React nima? Kim ishlatadi?", ru: "Что такое React? Кто им пользуется?" }), tag: tr2({ uz: "kutubxona", ru: "библиотека" }) },
    { text: tr2({ uz: "Komponent — sahifa bloklari", ru: "Компонент — блоки страницы" }), tag: "<SkinCard />" },
    { text: tr2({ uz: "Virtual DOM — aqlli yangilash", ru: "Virtual DOM — умное обновление" }), tag: tr2({ uz: "solishtir → yangila", ru: "сравни → обнови" }) },
    { text: tr2({ uz: "React Native — telefonga yo'l", ru: "React Native — путь к телефону" }), tag: "iOS · Android" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugun o'rganadigan 2 tushuncha", ru: "2 понятия, которые изучим сегодня" })}</p>
      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span style={{ fontSize: 32 }}>🧩</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>{tr2({ uz: "KOMPONENT", ru: "КОМПОНЕНТ" })}</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Bir marta yaratasiz — istalgan joyda ishlatasiz", ru: "Создаёте один раз — используете где угодно" })}</p></div>
        </div>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>VIRTUAL DOM</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Solishtiradi — faqat o'zgargan joyni yangilaydi", ru: "Сравнивает — обновляет только изменившееся место" })}</p></div>
        </div>
      </div>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr2({ uz: "5 qadam", ru: "5 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr2({ uz: <>Instagram nega buncha <span className="italic" style={{ color: T.accent }}>tez</span> ishlaydi?</>, ru: <>Почему Instagram работает так <span className="italic" style={{ color: T.accent }}>быстро</span>?</> })}</h2>
        </div>
        <Mentor>{tr2({ uz: <>Ishonasizmi — dars oxirida <b style={{ color: T.ink }}>Instagram nega buncha tez ishlashini</b> aniq bilib olasiz. Buning ortida <b style={{ color: T.ink }}>ikkita muhim tushuncha</b> bor: <b style={{ color: T.ink }}>Komponent</b> va <b style={{ color: T.ink }}>Virtual DOM</b>. Bugun shu ikkalasini o'rganamiz, 5 ta qadamda.</>, ru: <>Поверите ли — к концу урока вы точно будете знать, <b style={{ color: T.ink }}>почему Instagram работает так быстро</b>. За этим стоят <b style={{ color: T.ink }}>два важных понятия</b>: <b style={{ color: T.ink }}>Компонент</b> и <b style={{ color: T.ink }}>Virtual DOM</b>. Сегодня изучим оба, за 5 шагов.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "Bugungi 5 qadamni ko'rish", ru: "Посмотреть 5 шагов на сегодня" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ G'oyalarni ko'rish", ru: "↩ Посмотреть идеи" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s2", text: `Mana oddiy HTML'da yasalgan Minecraft skinlar sayti. Yana bitta skin kartochkasi kerakmi? Kodni nusxalaysiz. Yana bittasi? Yana nusxalaysiz. "Skin qo'shish" tugmasini bosib ko'ring — kod qanday shishib ketishini kuzating.`, trigger: "on_mount", waits_for: null }]);
  const [n, setN] = useState3(storedAnswer ? 3 : 1);
  const done = n >= 3;
  const CARD_LINES = 22;
  const lines = n * CARD_LINES;
  const add = () => setN((v) => Math.min(v + 1, 6));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Muammo", ru: "Проблема" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "Kamida 3 ta skin", ru: "Минимум 3 скина" })} (${n}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har bir kartochkani <span className="italic" style={{ color: T.accent }}>qo'lda</span> nusxalab chiqasizmi?</>, ru: <>Будете копировать каждую карточку <span className="italic" style={{ color: T.accent }}>вручную</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Mana oddiy HTML'da yasalgan <b style={{ color: T.ink }}>Minecraft skinlar sayti</b>. Yana bitta skin kerakmi? Kodni <b style={{ color: T.ink }}>nusxalaysiz</b>. Yana bittasi? Yana nusxalaysiz. <b style={{ color: T.ink }}>"Skin qo'shish"</b> tugmasini bosib ko'ring — kod qanday shishib ketishini kuzating.</>, ru: <>Вот <b style={{ color: T.ink }}>сайт Minecraft-скинов</b>, сделанный на обычном HTML. Нужен ещё один скин? <b style={{ color: T.ink }}>Копируете</b> код. Ещё один? Снова копируете. Нажмите кнопку <b style={{ color: T.ink }}>«Добавить скин»</b> — смотрите, как раздувается код.</> })}</Mentor>
        <Zoomable>
        <div className="split-4555">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button className={`btn ${n === 1 ? "invite" : ""}`} onClick={add} disabled={n >= 6}>{tr2({ uz: "+ Skin qo'shish", ru: "+ Добавить скин" })}</button>
              <span className="tagpill" key={lines} style={{ color: n >= 3 ? T.accent : T.ink }}>{lines} {tr2({ uz: "qator kod", ru: "строк кода" })}</span>
            </div>
            <pre className="code-box fade-up delay-2">
              {Array.from({ length: Math.min(n, 2) }, (_, i) => <React3.Fragment key={i}>
                  <Jx>{'<div class="skin">'}</Jx>{"\n"}
                  {"  "}<Jx>{'<img src="skin' + (i + 1) + '.png">'}</Jx>{"\n"}
                  {"  "}<Jx>{"<h3>"}</Jx>{tr2(SKINS[i].name)}<Jx>{"</h3>"}</Jx>{"\n"}
                  {"  "}<Cm>{tr2({ uz: "<!-- narx, like, tugma... yana 18 qator -->", ru: "<!-- цена, лайк, кнопка... ещё 18 строк -->" })}</Cm>{"\n"}
                  <Jx>{"</div>"}</Jx>{"\n\n"}
                </React3.Fragment>)}
              {n > 2 && <Cm>{tr2({ uz: "<!-- ...va yana " + (n - 2) + " marta XUDDI SHU 22 qator -->", ru: "<!-- ...и ещё " + (n - 2) + " раз ТЕ ЖЕ САМЫЕ 22 строки -->" })}</Cm>}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sayt shunday ko'rinadi — like bosib ko'ring", ru: "Вот как выглядит сайт — нажмите лайк" })}</p>
            <Win title="mc-skinlar.uz" minH={120}>
              <div className="mk-grid">
                {Array.from({ length: n }, (_, i) => <SkinCard key={i} n={i + 1} />)}
              </div>
            </Win>
            {n >= 6 && <p className="mono small fade-step" style={{ color: T.accent, margin: 0 }}>{tr2({ uz: "Bir xil kod qayta-qayta yozilyapti.", ru: "Один и тот же код пишется снова и снова." })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s3", text: `Bir xil kartochkani qayta-qayta yozish shart emas. React bu muammoni komponentlar yordamida hal qiladi. Avval React nima ekanini bilib olaylik — ilovalarni bosib ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const APPS = {
    ig: { n: "Instagram", bg: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)", letter: "In", fact: tr2({ uz: "Lenta, stories, like tugmasi — hammasi React komponentlari. Telefondagi ilovasi esa React Native'da.", ru: "Лента, сторис, кнопка лайка — всё это React-компоненты. А приложение на телефоне — на React Native." }) },
    fb: { n: "Facebook", bg: "#1877F2", letter: "f", fact: tr2({ uz: "Lenta, tugma, bildirishnoma — har biri alohida komponent. React ana shunday katta sahifalar uchun tug'ilgan: Facebook uni 2013-yilda yaratgan.", ru: "Лента, кнопка, уведомление — каждый из них отдельный компонент. React родился именно для таких больших страниц: Facebook создал его в 2013 году." }) },
    nf: { n: "Netflix", bg: "#E50914", letter: "N", fact: tr2({ uz: "Minglab film kartochkasi — aslida bitta komponent, minglab marta qayta ishlatilgan.", ru: "Тысячи карточек фильмов — на самом деле один компонент, переиспользованный тысячи раз." }) },
    wa: { n: "WhatsApp Web", bg: "#25D366", letter: "W", fact: tr2({ uz: "Kompyuterdagi WhatsApp ham React'da qurilgan — har bir chat qatori bitta komponent.", ru: "WhatsApp на компьютере тоже построен на React — каждая строка чата это один компонент." }) }
  };
  const KEYS = ["ig", "fb", "nf", "wa"];
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(storedAnswer ? new Set(KEYS) : /* @__PURE__ */ new Set());
  const done = seen.size >= 4;
  const tap = (k) => {
    setActive(k);
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(k);
      return s;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "React nima?", ru: "Что такое React?" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/4 ${tr2({ uz: "ilova ko'rildi", ru: "приложения изучено" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Shu nusxalash muammosi <span className="italic" style={{ color: T.accent }}>qanday</span> hal qilingan?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> решена эта проблема копирования?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bir xil kartochkani qayta-qayta yozish shart emas. React bu muammoni <b style={{ color: T.ink }}>komponentlar</b> yordamida hal qiladi. Avval React nima ekanini bilib olaylik — ilovalarni bosib ko'ring.</>, ru: <>Одну и ту же карточку не нужно писать снова и снова. React решает эту проблему с помощью <b style={{ color: T.ink }}>компонентов</b>. Сначала разберёмся, что такое React — нажимайте на приложения.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="frame fade-up delay-1" style={{ padding: "13px 16px" }}>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><b style={{ color: T.accent }}>React</b> — saytni tayyor bo'laklardan qurishga yordam beradigan <b>JavaScript kutubxonasi</b>. Kutubxona degani — tayyor asboblar to'plami: hammasini noldan yozmaysiz.</>, ru: <><b style={{ color: T.accent }}>React</b> — <b>библиотека JavaScript</b>, которая помогает строить сайт из готовых блоков. Библиотека — это набор готовых инструментов: не пишете всё с нуля.</> })}</p>
            </div>
            <div className="fade-up delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {KEYS.map((k) => <button key={k} className={`appbtn ${active === k ? "active" : ""} ${seen.has(k) ? "seen" : ""}`} onClick={() => tap(k)}>
                  <span className="applogo" style={{ background: APPS[k].bg }}>{APPS[k].letter}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: T.ink }}>{APPS[k].n}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "React'da qurilganmi?", ru: "Построено на React?" })}</p>
              <span className="small mono" style={{ color: done ? T.success : T.ink3 }}>{seen.size} / 4</span>
            </div>
            {active ? <div className="sk-info" key={active}>
                <span className="sk-tagbig"><span className="applogo" style={{ background: APPS[active].bg, width: 28, height: 28, fontSize: 12, borderRadius: 7 }}>{APPS[active].letter}</span><span className="sk-wordbadge">{tr2({ uz: "React'da qurilgan ✓", ru: "Построено на React ✓" })}</span></span>
                <p className="body" style={{ color: T.ink, margin: "11px 0 0" }}>{APPS[active].fact}</p>
              </div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Ilovalardan birini bosing", ru: "Нажмите на одно из приложений" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Siz ishlatadigan <b>ko'plab ilovalar</b> React yordamida qurilgan. Endi shu texnologiyani o'rganishni boshlaymiz.</>, ru: <>Многие приложения, которыми вы пользуетесь, построены с помощью <b>React</b>. Теперь начинаем изучать эту технологию.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  idx={4}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Практика · вопрос 1" })}
  audioText="React aslida nima? To'g'ri javobni tanlang."
  questionText="React aslida nima?"
  question={tr2({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>React aslida <span className="italic" style={{ color: T.accent }}>nima</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что же такое <span className="italic" style={{ color: T.accent }}>React</span> на самом деле?</h2></> })}
  options={[tr2({ uz: "Yangi dasturlash tili", ru: "Новый язык программирования" }), tr2({ uz: "JavaScript kutubxonasi", ru: "Библиотека JavaScript" }), tr2({ uz: "Brauzer dasturining nomi", ru: "Название браузера" }), tr2({ uz: "Operatsion tizim turi", ru: "Вид операционной системы" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! React — JavaScript'da yozilgan kutubxona: sahifa interfeysini qurish uchun tayyor asboblar to'plami.", ru: "Верно! React — библиотека, написанная на JavaScript: набор готовых инструментов для построения интерфейса страницы." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — React yangi til emas. U siz o'rgangan JavaScript'ning o'zida yozilgan kutubxona.", ru: "Нет — React не новый язык. Это библиотека, написанная на самом JavaScript, который вы уже знаете." }),
    2: tr2({ uz: "Brauzer — Chrome, Safari kabi dastur. React esa kutubxona — kod uchun asboblar to'plami.", ru: "Браузер — это программа вроде Chrome или Safari. А React — библиотека, набор инструментов для кода." }),
    3: tr2({ uz: "Operatsion tizim — Windows, Android. React — interfeys qurish kutubxonasi.", ru: "Операционная система — это Windows, Android. React — библиотека для построения интерфейсов." }),
    default: tr2({ uz: "React — interfeys qurish uchun JavaScript kutubxonasi.", ru: "React — библиотека JavaScript для построения интерфейсов." })
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s5", text: `Minecraft'dagi kabi, React'da ham sahifa kichik bo'laklardan yig'iladi. Bu bo'laklar komponentlar deb ataladi. Sahifadagi har bir qismni bosib, qaysi komponent ekanini bilib oling.`, trigger: "on_mount", waits_for: null }]);
  const PARTS = {
    nav: { jx: "<Navbar />", word: tr2({ uz: "Yuqori menyu", ru: "Верхнее меню" }), role: tr2({ uz: "Sayt nomi va qidiruvni ko'rsatadi.", ru: "Показывает название сайта и поиск." }), reuse: tr2({ uz: "Bir marta yoziladi — saytning har sahifasida ishlatiladi.", ru: "Пишется один раз — используется на каждой странице сайта." }) },
    search: { jx: "<SearchBar />", word: tr2({ uz: "Qidiruv katagi", ru: "Строка поиска" }), role: tr2({ uz: "Skin nomi bo'yicha qidiradi.", ru: "Ищет по названию скина." }), reuse: tr2({ uz: "Boshqa loyihaga ham o'zgarishsiz olib o'tiladi.", ru: "Переносится в другой проект без изменений." }) },
    card: { jx: "<SkinCard />", word: tr2({ uz: "Skin kartochka", ru: "Карточка скина" }), role: tr2({ uz: "Skin rasmi, nomi va like sonini chiqaradi.", ru: "Выводит картинку скина, название и число лайков." }), reuse: tr2({ uz: "Sahifada ikkita kartochka bor, lekin kod BITTA. Yangi skin qo'shilsa — shu komponent yana ishlatiladi.", ru: "На странице две карточки, а код ОДИН. Добавится новый скин — этот же компонент используется снова." }) },
    like: { jx: "<LikeButton />", word: tr2({ uz: "Like tugmasi", ru: "Кнопка лайка" }), role: tr2({ uz: "Like bosilganini saqlaydi va sonini yangilaydi.", ru: "Запоминает нажатие лайка и обновляет счётчик." }), reuse: tr2({ uz: "Kartochka ichida yashaydi — komponent ichida komponent.", ru: "Живёт внутри карточки — компонент внутри компонента." }) }
  };
  const HINT = tr2({ uz: "Bu ham alohida blok", ru: "Это тоже отдельный блок" });
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["nav", "search", "card", "like"]) : /* @__PURE__ */ new Set());
  const done = seen.size >= 4;
  const tap = (k, e) => {
    if (e) e.stopPropagation();
    setActive(k);
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(k);
      return s;
    });
  };
  const zc = (k) => `zone ${active === k ? "active" : ""} ${seen.has(k) ? "seen" : ""}`;
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Komponent", ru: "Компонент" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "🎉 Davom etish", ru: "🎉 Продолжить" }) : `${seen.size}/4 ${tr2({ uz: "komponent topildi", ru: "компонента найдено" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bu sahifa nechta <span className="italic" style={{ color: T.accent }}>blokdan</span> yig'ilgan?</>, ru: <>Из скольких <span className="italic" style={{ color: T.accent }}>блоков</span> собрана эта страница?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Minecraft'dagi kabi, React'da ham sahifa <b style={{ color: T.ink }}>kichik bo'laklardan</b> yig'iladi. Bu bo'laklar <b style={{ color: T.ink }}>komponentlar</b> deb ataladi. Sahifadagi <b style={{ color: T.ink }}>har bir qismni bosib</b>, qaysi komponent ekanini bilib oling.</>, ru: <>Как в Minecraft, в React страница тоже собирается из <b style={{ color: T.ink }}>маленьких блоков</b>. Эти блоки называются <b style={{ color: T.ink }}>компонентами</b>. <b style={{ color: T.ink }}>Нажимайте на каждую часть</b> страницы — узнайте, какой это компонент.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="frame fade-up delay-2" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className={zc("nav")} data-hint={HINT} onClick={() => tap("nav")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.bg, padding: "8px 11px", gap: 8 }}>
                {seen.has("nav") && <span className="zlbl">{"<Navbar />"}</span>}
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 12.5, color: T.ink }}>{tr2({ uz: "⛏ MC Skinlar", ru: "⛏ MC Скины" })}</span>
                <span className={zc("search")} data-hint={HINT} onClick={(e) => tap("search", e)} style={{ background: "#fff", borderRadius: 8, padding: "5px 10px", fontFamily: "'Manrope',sans-serif", fontSize: 10.5, color: T.ink3, flex: "0 1 110px", position: "relative" }}>
                  {seen.has("search") && <span className="zlbl">{"<SearchBar />"}</span>}
                  {tr2({ uz: "Skin qidirish…", ru: "Поиск скина…" })}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[1, 2].map((i) => <div key={i} className={zc("card")} data-hint={HINT} onClick={() => tap("card")} style={{ background: "#fff", boxShadow: "0 3px 9px -3px rgba(0,0,0,0.12)", overflow: "visible", padding: 0 }}>
                    {seen.has("card") && i === 1 && <span className="zlbl">{"<SkinCard />"}</span>}
                    <div className="vthumb" style={{ borderRadius: "10px 10px 0 0", background: SKINS[i - 1].bg }}><span style={{ fontSize: 17 }}>{SKINS[i - 1].emoji}</span></div>
                    <div style={{ padding: "7px 9px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 11, color: T.ink }}>{tr2(SKINS[i - 1].name)}</span>
                      <span className={zc("like")} data-hint={HINT} onClick={(e) => tap("like", e)} style={{ background: T.bg, borderRadius: 7, padding: "3px 8px", fontSize: 10.5, color: T.ink2, position: "relative" }}>
                        {seen.has("like") && i === 2 && <span className="zlbl">{"<LikeButton />"}</span>}
                        ♥ {9 + i * 3}
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Komponentlar", ru: "Компоненты" })}</p>
              <span className="small mono" style={{ color: done ? T.success : T.ink3 }}>{seen.size} / 4 {tr2({ uz: "komponent topildi", ru: "компонента найдено" })}</span>
            </div>
            {done ? <div className="frame-success fade-step"><p className="small mono" style={{ margin: "0 0 4px", fontWeight: 600, color: T.success, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tr2({ uz: "✓ Hammasini topdingiz", ru: "✓ Вы нашли всё" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Sahifa = komponentlar yig'indisi: <span className="mono">Navbar + SearchBar + SkinCard + LikeButton</span>. Har biri — mustaqil blok.</>, ru: <>Страница = сумма компонентов: <span className="mono">Navbar + SearchBar + SkinCard + LikeButton</span>. Каждый — самостоятельный блок.</> })}</p></div> : active ? <div className="sk-info" key={active}>
                <span className="sk-tagbig"><span className="mono" data-dark-ok="kod-bo'lagi" style={{ fontWeight: 700, fontSize: 14, color: CODE.tag, background: CODE.bg, padding: "4px 10px", borderRadius: 7 }}>{PARTS[active].jx}</span><span className="sk-wordbadge">{PARTS[active].word}</span></span>
                <div className="sk-fact"><span className="sk-fact-l">{tr2({ uz: "Vazifasi", ru: "Задача" })}</span><p className="body">{PARTS[active].role}</p></div>
                <div className="sk-fact"><span className="sk-fact-l">{tr2({ uz: "Qayta ishlatish", ru: "Переиспользование" })}</span><p className="body">{PARTS[active].reuse}</p></div>
              </div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Chapdagi sahifada 4 ta komponent yashiringan. Bosib toping.", ru: "На странице слева спрятаны 4 компонента. Найдите их нажатием." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Tekshiruv", ru: "Проверка" })}
  audioText="Komponent nima? To'g'ri javobni tanlang."
  questionText="Komponent nima?"
  question={tr2({ uz: <><p className="eyebrow" style={{ color: T.accent }}>Mustahkamlash</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>Komponent</span> nima?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Закрепление</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что такое <span className="italic" style={{ color: T.accent }}>компонент</span>?</h2></> })}
  options={[tr2({ uz: "Brauzerning ichki sozlamasi", ru: "Внутренняя настройка браузера" }), tr2({ uz: "Internetni tezlashtiradigan dastur", ru: "Программа, ускоряющая интернет" }), tr2({ uz: "Sahifaning qayta ishlatiladigan bo'lagi", ru: "Переиспользуемая часть страницы" }), tr2({ uz: "Rasm va video fayllari turi", ru: "Тип файлов картинок и видео" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri! Komponent — sahifaning mustaqil bo'lagi: bir marta yoziladi, istalgancha qayta ishlatiladi.", ru: "Верно! Компонент — самостоятельная часть страницы: пишется один раз, переиспользуется сколько угодно." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — sozlama emas. Komponent — sahifaning qayta ishlatiladigan bo'lagi.", ru: "Нет — не настройка. Компонент — переиспользуемая часть страницы." }),
    1: tr2({ uz: "Yo'q — tezlikka aloqasi yo'q. Komponent — sahifaning qayta ishlatiladigan bloki.", ru: "Нет — к скорости это не относится. Компонент — переиспользуемый блок страницы." }),
    3: tr2({ uz: "Yo'q — rasm emas. Komponent — interfeys bo'lagi: kartochka, tugma, menyu.", ru: "Нет — не картинка. Компонент — часть интерфейса: карточка, кнопка, меню." }),
    default: tr2({ uz: "Komponent — qayta ishlatiladigan interfeys bo'lagi.", ru: "Компонент — переиспользуемая часть интерфейса." })
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s6", text: `Esingizdami, oddiy HTML'da kod qanday shishib ketgan edi? Endi React usuli: SkinCard komponenti bir marta yoziladi. Keyin uni xohlagancha chaqirasiz. Qo'shib ko'ring — kod qatorini diqqat bilan kuzating.`, trigger: "on_mount", waits_for: null }]);
  const [n, setN] = useState3(storedAnswer ? 3 : 1);
  const done = n >= 3;
  const add = () => setN((v) => Math.min(v + 1, 6));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Qayta ishlatish", ru: "Переиспользование" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "Kamida 3 ta qo'shing", ru: "Добавьте минимум 3" })} (${n}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bir marta yozib, <span className="italic" style={{ color: T.accent }}>istalgancha</span> ishlatish mumkinmi?</>, ru: <>Можно ли написать один раз и использовать <span className="italic" style={{ color: T.accent }}>сколько угодно</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Esingizdami, oddiy HTML'da kod qanday <b style={{ color: T.ink }}>shishib ketgan</b> edi? Endi React usuli: <span className="mono">SkinCard</span> <b style={{ color: T.ink }}>bir marta</b> yoziladi, keyin xohlagancha chaqiriladi. Qo'shib ko'ring — kod qatorini kuzating.</>, ru: <>Помните, как в обычном HTML код <b style={{ color: T.ink }}>раздувался</b>? Теперь способ React: <span className="mono">SkinCard</span> пишется <b style={{ color: T.ink }}>один раз</b>, а потом вызывается сколько хотите. Попробуйте добавить — следите за строками кода.</> })}</Mentor>
        <Zoomable>
        <div className="split-4555">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button className={`btn ${n === 1 ? "invite" : ""}`} onClick={add} disabled={n >= 6}>{tr2({ uz: "+ <SkinCard /> qo'shish", ru: "+ Добавить <SkinCard />" })}</button>
            </div>
            <pre className="code-box fade-up delay-2">
              <Cm>{tr2({ uz: "// blok BIR marta yoziladi:", ru: "// блок пишется ОДИН раз:" })}</Cm>{"\n"}
              <Jx>{"function"}</Jx>{" SkinCard() { … }"}{"\n\n"}
              <Cm>{tr2({ uz: "// keyin xohlagancha ishlatiladi:", ru: "// потом используется сколько угодно:" })}</Cm>{"\n"}
              {Array.from({ length: n }, (_, i) => <React3.Fragment key={i}><Jx>{"<SkinCard />"}</Jx>{"\n"}</React3.Fragment>)}
            </pre>
            <div className="vs-box fade-up delay-2">
              <div className="vs-side win">
                <span className="vs-lbl">React</span>
                <span className="vs-num" key={"r" + n}>{4 + n}</span>
                <span className="vs-unit">{tr2({ uz: "qator", ru: "строк" })}</span>
              </div>
              <span className="vs-mid">vs</span>
              <div className="vs-side lose">
                <span className="vs-lbl">{tr2({ uz: "Oddiy HTML", ru: "Обычный HTML" })}</span>
                <span className="vs-num" key={"h" + n}>{n * 22}</span>
                <span className="vs-unit">{tr2({ uz: "qator", ru: "строк" })}</span>
              </div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sahifa — like bosib ko'ring", ru: "Страница — нажмите лайк" })}</p>
            <Win title="mc-skinlar.uz" minH={120}>
              <div className="mk-grid">
                {Array.from({ length: n }, (_, i) => <SkinCard key={i} n={i + 1} />)}
              </div>
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Kartochkalar ko'paydi, kod esa <b>deyarli o'zgarmadi</b>. Komponentning kuchi shunda.</>, ru: <>Карточек стало больше, а код <b>почти не изменился</b>. В этом и сила компонента.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s7", text: `Sinf jurnalini tasavvur qiling. Azizaning matematikadan bahosi o'zgardi. O'qituvchi butun jurnalni boshidan qayta yozadimi? Albatta yo'q — faqat bitta katakni to'g'rilaydi. Ikkala usulni ham sinab ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const NAMES = [tr2({ uz: "Aziza", ru: "Азиза" }), tr2({ uz: "Bobur", ru: "Бобур" }), tr2({ uz: "Dilnoza", ru: "Дильноза" })];
  const SUBJ = [tr2({ uz: "Mat", ru: "Мат" }), tr2({ uz: "Ona tili", ru: "Родной яз." }), tr2({ uz: "Ingliz", ru: "Англ" }), tr2({ uz: "Fizika", ru: "Физика" })];
  const [mode, setMode] = useState3("old");
  const [grade, setGrade] = useState3(4);
  const [flashKey, setFlashKey] = useState3(0);
  const [tried, setTried] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["old", "smart"]) : /* @__PURE__ */ new Set());
  const done = tried.has("old") && tried.has("smart");
  const change = () => {
    setGrade((g) => g === 4 ? 5 : 4);
    if (mode === "old") setFlashKey((k) => k + 1);
    setTried((prev) => {
      const s = new Set(prev);
      s.add(mode);
      return s;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const cellStyle = { background: "#fff", borderRadius: 7, padding: "6px 4px", textAlign: "center", fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: T.ink };
  return <Stage eyebrow={tr2({ uz: "Hayotdan misol", ru: "Пример из жизни" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ikkala usulni sinang", ru: "Попробуйте оба способа" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta baho o'zgarsa, <span className="italic" style={{ color: T.accent }}>butun jurnalni</span> qayta yozasizmi?</>, ru: <>Изменилась одна оценка — переписывать <span className="italic" style={{ color: T.accent }}>весь журнал</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Sinf jurnalini tasavvur qiling. Azizaning matematikadan bahosi o'zgardi. O'qituvchi <b style={{ color: T.ink }}>butun jurnalni</b> boshidan qayta yozadimi? Albatta yo'q — <b style={{ color: T.ink }}>faqat bitta katakni</b> to'g'rilaydi. Ikkala usulni sinab ko'ring.</>, ru: <>Представьте классный журнал. У Азизы изменилась оценка по математике. Учитель перепишет <b style={{ color: T.ink }}>весь журнал</b> с начала? Конечно нет — исправит <b style={{ color: T.ink }}>только одну клетку</b>. Попробуйте оба способа.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className={`chip ${mode === "old" ? "chip-on" : ""}`} onClick={() => setMode("old")}>{tr2({ uz: "Eski usul", ru: "Старый способ" })} {tried.has("old") ? "✓" : ""}</button>
              <button className={`chip ${mode === "smart" ? "chip-on" : ""}`} onClick={() => setMode("smart")}>{tr2({ uz: "Aqlli usul", ru: "Умный способ" })} {tried.has("smart") ? "✓" : ""}</button>
            </div>
            {
    /* F-0820-136: kirish-animatsiya (fade-up) o'rovchida, puls (invite) tugmada — bir elementda `animation` to'qnashib opacity 0 da qolardi */
  }
            <div className="fade-up delay-2" style={{ alignSelf: "flex-start" }}><button className={`btn ${tried.size === 0 ? "invite" : ""}`} onClick={change}>{tr2({ uz: "Azizaning bahosini o'zgartirish", ru: "Изменить оценку Азизы" })}</button></div>
            {tried.size > 0 && mode === "smart" && <div className="hint fade-step" key={`${mode}-${tried.size}`}>
                <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Endi <b style={{ color: T.success }}>faqat 1 katak</b> yangilandi. React ham aynan shunday ishlaydi.</>, ru: <>Теперь обновилась <b style={{ color: T.success }}>только 1 клетка</b>. React работает точно так же.</> })}</p>
              </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sinf jurnali", ru: "Классный журнал" })}</p>
            <div className="frame fade-up delay-2" style={{ padding: 12 }} key={mode === "old" ? `j-${flashKey}` : "j-smart"}>
              <div style={{ display: "grid", gridTemplateColumns: "76px repeat(4, 1fr)", gap: 5 }}>
                <span />
                {SUBJ.map((s) => <span key={s} style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, color: T.ink3, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s}</span>)}
                {NAMES.map((nm, r) => <React3.Fragment key={nm}>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 12, color: T.ink2, alignSelf: "center" }}>{nm}</span>
                    {SUBJ.map((s, c) => {
    const isHot = r === 0 && c === 0;
    const flashing = mode === "old" && flashKey > 0;
    const hotNow = mode === "smart" && isHot;
    return <span key={`${r}-${c}-${isHot ? grade : 0}`} className={flashing ? "jflash" : hotNow ? "jhot" : ""} style={{ ...cellStyle, animationDelay: flashing ? `${(r * 4 + c) * 0.05}s` : void 0 }}>
                          {isHot ? grade : [4, 5, 4, 5, 3, 4, 5, 4, 4, 5, 4, 3][r * 4 + c]}
                        </span>;
  })}
                  </React3.Fragment>)}
              </div>
            </div>
            {tried.size > 0 && <div className={`jr-card ${mode === "old" ? "jr-bad" : "jr-good"}`} key={`rt-${mode}-${grade}-${flashKey}`}>
                <span className="jr-ic">{mode === "old" ? "🔴" : "✅"}</span>
                <span className="jr-num">{mode === "old" ? 12 : 1}</span>
                <span className="jr-txt">
                  <span className="jr-hd">{mode === "old" ? tr2({ uz: "ta katak qayta chizildi", ru: "клеток перерисовано" }) : tr2({ uz: "ta katak yangilandi", ru: "клетка обновилась" })}</span>
                  <span className="jr-sub">{mode === "old" ? tr2({ uz: "Butun jadval yangidan", ru: "Вся таблица заново" }) : tr2({ uz: "Faqat kerakli katak", ru: "Только нужная клетка" })}</span>
                </span>
              </div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s8", text: `React xotirasida sahifaning yengil nusxasini saqlaydi. Bu Virtual DOM deyiladi. O'zgarish bo'lganda u yangi nusxa yaratadi, eskisi bilan solishtiradi va faqat o'zgargan joyni haqiqiy sahifada yangilaydi. Tugmani bosib, jarayonni kuzating.`, trigger: "on_mount", waits_for: null }]);
  const [phase, setPhase] = useState3(storedAnswer ? 3 : 0);
  const [running, setRunning] = useState3(false);
  const timer = useRef3(null);
  const done = phase >= 3;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setRunning(true);
    setPhase(1);
    timer.current = setTimeout(() => {
      setPhase(2);
      timer.current = setTimeout(() => {
        setPhase(3);
        setRunning(false);
      }, 1100);
    }, 1100);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const STEPS = [tr2({ uz: "Xotirada yangi nusxa yaratiladi", ru: "В памяти создаётся новая копия" }), tr2({ uz: "Eski nusxa bilan solishtiriladi", ru: "Сравнивается со старой копией" }), tr2({ uz: "Faqat o'zgargan joy yangilanadi", ru: "Обновляется только изменившееся место" })];
  const Snap = ({ label, likes, hot }) => <div data-dark-ok="kod-oynasi" style={{ flex: 1, minWidth: 0, background: CODE.bg, borderRadius: 10, padding: "9px 10px" }}>
      <p className="mono" style={{ fontSize: 9.5, color: CODE.comment, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <p className="mono" style={{ fontSize: 11.5, color: CODE.text, margin: 0 }}>{tr2({ uz: `post: "Qal'a"`, ru: 'post: "Замок"' })}</p>
      <p className={`mono ${hot ? "vdom-hot" : ""}`} style={{ fontSize: 11.5, color: CODE.text, margin: "3px 0 0", borderRadius: 5, padding: "1px 4px", background: hot ? "rgba(255,79,40,0.22)" : "transparent", display: "inline-block" }}>like: <span style={{ color: CODE.str }}>{likes}</span></p>
    </div>;
  return <Stage eyebrow="Virtual DOM" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Jarayonni kuzating", ru: "Понаблюдайте за процессом" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>React qaysi joy o'zgarganini <span className="italic" style={{ color: T.accent }}>qanday</span> aniqlaydi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> React определяет, какое место изменилось?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>React xotirasida sahifaning <b style={{ color: T.ink }}>yengil nusxasini</b> saqlaydi. Bu <b style={{ color: T.ink }}>Virtual DOM</b> deyiladi. O'zgarish bo'lganda: yangi nusxa → eskisi bilan solishtirish → <b style={{ color: T.ink }}>faqat o'zgargan joy</b> yangilanadi. Tugmani bosib kuzating.</>, ru: <>React хранит в памяти <b style={{ color: T.ink }}>лёгкую копию</b> страницы. Это называется <b style={{ color: T.ink }}>Virtual DOM</b>. При изменении: новая копия → сравнение со старой → обновляется <b style={{ color: T.ink }}>только изменившееся место</b>. Нажмите кнопку и наблюдайте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {
    /* F-0820-136: fade-up o'rovchida, invite tugmada (yuqoridagi Screen7 izohiga qarang) */
  }
            <div className="fade-up delay-1" style={{ alignSelf: "flex-start" }}><button className={`btn ${phase === 0 ? "invite" : ""}`} onClick={run} disabled={running}>{running ? tr2({ uz: "Ishlayapti…", ru: "Работает…" }) : done ? tr2({ uz: "↻ Yana ko'rsatish", ru: "↻ Показать ещё раз" }) : tr2({ uz: "▶ Like bosildi — kuzating", ru: "▶ Лайк нажат — наблюдайте" })}</button></div>
            <div className="fade-up delay-2" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {STEPS.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 11, background: phase > i ? T.successSoft : T.bg, opacity: phase > i ? 1 : 0.55, transition: "all 0.4s" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 12, color: phase > i ? T.success : T.ink3, minWidth: 16 }}>{phase > i ? "✓" : i + 1}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13.5, color: phase > i ? T.ink : T.ink2 }}>{s}</span>
                </div>)}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Xotirada (Virtual DOM)", ru: "В памяти (Virtual DOM)" })}</p>
            <div style={{ position: "relative", display: "flex", gap: 8 }}>
              <Snap label={tr2({ uz: "Eski nusxa", ru: "Старая копия" })} likes={12} hot={phase === 2} />
              {phase >= 1 ? <Snap label={tr2({ uz: "Yangi nusxa", ru: "Новая копия" })} likes={13} hot={phase === 2} /> : <div style={{ flex: 1, border: `1.5px dashed ${T.ink3}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 70 }}><span className="small" style={{ color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "kutilmoqda…", ru: "ожидание…" })}</span></div>}
              {phase === 2 && <span className="vdom-vs" key="vs">🔍</span>}
            </div>
            {phase >= 2 && <div className="vdiff fade-step" key="vd">
                <span className="vdiff-lbl">{tr2({ uz: "Yagona farq", ru: "Единственная разница" })}</span>
                <span className="vdiff-old mono">like: 12</span>
                <span className="vdiff-arw">→</span>
                <span className="vdiff-new mono">like: 13</span>
              </div>}
            <div className={`vdom-flow ${phase >= 3 ? "on" : ""}`}>{phase >= 3 ? tr2({ uz: "↓ faqat shu farqni o'tkazadi", ru: "↓ переносит только эту разницу" }) : tr2({ uz: "↓ farq sahifaga", ru: "↓ разница на страницу" })}</div>
            <p className="flow-label" style={{ marginTop: 2 }}>{tr2({ uz: "Haqiqiy sahifa", ru: "Настоящая страница" })}</p>
            <Win title="ilova.uz" minH={56}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#8FBF6B,#6D4C41)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏰</span>
                <span className={phase >= 3 ? "jhot" : ""} key={`pg-${phase >= 3 ? "new" : "old"}`} style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: phase >= 3 ? T.success : T.ink, borderRadius: 7, padding: "3px 9px" }}>♥ {phase >= 3 ? 13 : 12}</span>
                {phase >= 3 && <span className="small fade-step" style={{ color: T.success, fontWeight: 600 }}>{tr2({ uz: "faqat shu son yangilandi!", ru: "обновилось только это число!" })}</span>}
              </div>
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>React butun sahifani emas, <b>faqat o'zgargan joyni</b> yangilaydi. Shu sababli u tez ishlaydi.</>, ru: <>React обновляет не всю страницу, а <b>только изменившееся место</b>. Поэтому он работает быстро.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  idx={9}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Практика · вопрос 3" })}
  audioText="Virtual DOM nima qiladi? To'g'ri javobni tanlang."
  questionText="Virtual DOM nima qiladi?"
  question={tr2({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>Virtual DOM</span> nima qiladi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что делает <span className="italic" style={{ color: T.accent }}>Virtual DOM</span>?</h2></> })}
  options={[tr2({ uz: "Sahifani har safar to'liq qayta yuklaydi", ru: "Каждый раз полностью перезагружает страницу" }), tr2({ uz: "Internet ulanishini tezlashtiradi", ru: "Ускоряет интернет-соединение" }), tr2({ uz: "Kodni avtomatik o'zi yozib beradi", ru: "Автоматически пишет код за вас" }), tr2({ uz: "Farqni topib, faqat o'zgargan joyni yangilaydi", ru: "Находит разницу и обновляет только изменившееся место" })]}
  correctIdx={3}
  explainCorrect={tr2({ uz: "To'g'ri! Virtual DOM — xotiradagi nusxa: React eski va yangi nusxani solishtiradi va faqat o'zgargan joyni yangilaydi.", ru: "Верно! Virtual DOM — копия в памяти: React сравнивает старую и новую копии и обновляет только изменившееся место." })}
  explainWrong={{
    0: tr2({ uz: "Aksincha! To'liq qayta yuklash — eski usul. Virtual DOM aynan shundan qutqaradi.", ru: "Наоборот! Полная перезагрузка — это старый способ. Virtual DOM спасает именно от этого." }),
    1: tr2({ uz: "Yo'q — internet tezligiga aloqasi yo'q. Gap sahifani aqlli yangilashda.", ru: "Нет — к скорости интернета это не относится. Речь об умном обновлении страницы." }),
    2: tr2({ uz: "Yo'q — kod yozib bermaydi. U o'zgarishlarni topib, faqat kerakli joyni yangilaydi.", ru: "Нет — код он не пишет. Он находит изменения и обновляет только нужное место." }),
    default: tr2({ uz: "Virtual DOM solishtiradi va faqat farqni yangilaydi.", ru: "Virtual DOM сравнивает и обновляет только разницу." })
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s10", text: `Dars boshida oddiy sayt bilan ishlagandik. Endi React bilan yonma-yon taqqoslang — ikkalasida ham like bosing va farqni kuzating.`, trigger: "on_mount", waits_for: null }]);
  const [liked, setLiked] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["old", "react"]) : /* @__PURE__ */ new Set());
  const done = liked.has("old") && liked.has("react");
  const mark = (k) => setLiked((prev) => {
    const s = new Set(prev);
    s.add(k);
    return s;
  });
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const ROWS = [
    [tr2({ uz: "Butun sahifa yangilanadi", ru: "Обновляется вся страница" }), tr2({ uz: "Faqat o'zgargan joy yangilanadi", ru: "Обновляется только изменившееся место" })],
    [tr2({ uz: "Kod nusxa-nusxa ko'payadi", ru: "Код растёт копия за копией" }), tr2({ uz: "Komponentlar qayta ishlatiladi", ru: "Компоненты используются повторно" })],
    [tr2({ uz: "Sekin ishlaydi", ru: "Работает медленно" }), tr2({ uz: "Tez ishlaydi", ru: "Работает быстро" })]
  ];
  return <Stage eyebrow={tr2({ uz: "Taqqoslash", ru: "Сравнение" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ikkalasida like bosing", ru: "Нажмите лайк на обоих" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oddiy sayt va React ilova — <span className="italic" style={{ color: T.accent }}>farqini ko'ring</span>.</>, ru: <>Обычный сайт и React-приложение — <span className="italic" style={{ color: T.accent }}>увидьте разницу</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Dars boshida oddiy sayt bilan ishlagandik. Endi React bilan <b style={{ color: T.ink }}>yonma-yon taqqoslang</b> — ikkalasida ham like bosing va <b style={{ color: T.ink }}>farqni kuzating</b>.</>, ru: <>В начале урока мы работали с обычным сайтом. Теперь <b style={{ color: T.ink }}>сравните его с React бок о бок</b> — нажмите лайк на обоих и <b style={{ color: T.ink }}>проследите за разницей</b>.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Oddiy sayt (HTML + JS)", ru: "Обычный сайт (HTML + JS)" })} {liked.has("old") ? "✓" : ""}</p>
            <LikeDemo mode="old" title="eski-sayt.uz" badge onLiked={() => mark("old")} />
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "React ilova", ru: "React-приложение" })} {liked.has("react") ? "✓" : ""}</p>
            <LikeDemo mode="react" title="react-ilova.uz" badge onLiked={() => mark("react")} />
          </Col>
        </div>
        {done && <div className="cmp-wrap fade-step">
            <div className="cmp-grid">
              <span className="cmp-hd bad">{tr2({ uz: "Oddiy sayt", ru: "Обычный сайт" })}</span>
              <span className="cmp-hd good">{tr2({ uz: "React ilova", ru: "React-приложение" })}</span>
              {ROWS.map(([a, b], i) => <React3.Fragment key={i}>
                  <span className="cmp-cell bad">{a}</span>
                  <span className="cmp-cell good">{b}</span>
                </React3.Fragment>)}
            </div>
          </div>}
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s11", text: `React'ni bilsangiz, faqat sayt emas — haqiqiy telefon ilovalarini ham yasay olasiz. Buning nomi React Native. Ikkala ko'rinishni almashtirib ko'ring: kod bitta, dunyo ikkita.`, trigger: "on_mount", waits_for: null }]);
  const [view, setView] = useState3("web");
  const [likes, setLikes] = useState3(124);
  const [fav, setFav] = useState3(false);
  const [pop, setPop] = useState3(false);
  const popT = useRef3(null);
  useEffect4(() => () => clearTimeout(popT.current), []);
  const like = () => {
    setLikes((v) => v + (fav ? -1 : 1));
    setFav((v) => !v);
    setPop(true);
    clearTimeout(popT.current);
    popT.current = setTimeout(() => setPop(false), 420);
  };
  const [seen, setSeen] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["web", "phone"]) : /* @__PURE__ */ new Set(["web"]));
  const done = seen.has("web") && seen.has("phone");
  const [boot, setBoot] = useState3(2);
  const bootT = useRef3([]);
  useEffect4(() => () => bootT.current.forEach(clearTimeout), []);
  const startBoot = () => {
    bootT.current.forEach(clearTimeout);
    bootT.current = [];
    setBoot(0);
    bootT.current.push(setTimeout(() => setBoot(1), 800));
    bootT.current.push(setTimeout(() => setBoot(2), 1800));
  };
  const sw = (v) => {
    setView(v);
    if (v === "phone") startBoot();
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(v);
      return s;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const SHOP = [
    { name: tr2({ uz: "Creeper", ru: "Крипер" }), emoji: "🟩", bg: "linear-gradient(135deg,#8FBF6B,#3E7A33)", price: "12 000" },
    { name: tr2({ uz: "Ninja", ru: "Ниндзя" }), emoji: "🥷", bg: "linear-gradient(135deg,#7A87A8,#2E3A56)", price: "18 000" },
    { name: tr2({ uz: "Robot", ru: "Робот" }), emoji: "🤖", bg: "linear-gradient(135deg,#AFC2D2,#5E7A92)", price: "15 000" },
    { name: tr2({ uz: "Qahramon", ru: "Герой" }), emoji: "🦸", bg: "linear-gradient(135deg,#F0B27A,#C96B2E)", price: "9 000" }
  ];
  const AppUI = ({ compact }) => <div className={`shop ${compact ? "shop-c" : ""}`}>
      <div className="shop-top">
        <span className="shop-logo">⛏ Skin Market</span>
        <span className="shop-top-r">
          <button type="button" className={`shop-like ${fav ? "on" : ""}`} onClick={like} title={tr2({ uz: "Like bosib ko'ring", ru: "Нажмите лайк" })}>
            <span className={pop ? "hpop" : void 0}>{fav ? "♥" : "♡"}</span> {likes}
          </button>
          <span className="shop-cart">🛒<span className="shop-badge">2</span></span>
        </span>
      </div>
      <div className="shop-search">{tr2({ uz: "🔍 Skin qidirish…", ru: "🔍 Поиск скина…" })}</div>
      <div className="shop-grid">
        {SHOP.map((p, i) => <div key={i} className="shop-card">
            <div className="shop-thumb" style={{ background: p.bg }}>{p.emoji}</div>
            <div className="shop-cap">
              <span className="shop-name">{p.name}</span>
              <div className="shop-buy"><span className="shop-price">{p.price} {tr2({ uz: "so'm", ru: "сум" })}</span><span className="shop-add">+</span></div>
            </div>
          </div>)}
      </div>
    </div>;
  return <Stage eyebrow="React Native" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ikkala ko'rinishni ko'ring", ru: "Посмотрите оба вида" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta texnologiya bilan <span className="italic" style={{ color: T.accent }}>telefon ilovasi</span> ham yasaladimi?</>, ru: <>Можно ли с одной технологией сделать и <span className="italic" style={{ color: T.accent }}>мобильное приложение</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>React'ni bilsangiz, faqat sayt emas — haqiqiy <b style={{ color: T.ink }}>telefon ilovalarini</b> ham yasay olasiz. Buning nomi <b style={{ color: T.ink }}>React Native</b>. Ikkala ko'rinishni almashtiring: <b style={{ color: T.ink }}>kod bitta, dunyo ikkita</b>.</>, ru: <>Зная React, вы сможете делать не только сайты, но и настоящие <b style={{ color: T.ink }}>мобильные приложения</b>. Это называется <b style={{ color: T.ink }}>React Native</b>. Переключайте оба вида: <b style={{ color: T.ink }}>код один, мира два</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className={`chip ${view === "web" ? "chip-on" : ""}`} onClick={() => sw("web")}>{tr2({ uz: "Brauzerda — React", ru: "В браузере — React" })} {seen.has("web") ? "✓" : ""}</button>
              <button className={`chip ${view === "phone" ? "chip-on" : ""}`} onClick={() => sw("phone")}>{tr2({ uz: "Telefonda — React Native", ru: "На телефоне — React Native" })} {seen.has("phone") ? "✓" : ""}</button>
            </div>
            <pre className="code-box fade-up delay-2">
              <Cm>{tr2({ uz: "// AYNAN SHU kod ishlaydi:", ru: "// работает ИМЕННО ЭТОТ код:" })}</Cm>{"\n"}
              <Jx>{"function"}</Jx>{" SkinCard() { … }"}{"\n\n"}
              <Jx>{"<SkinCard "}</Jx><span style={{ color: CODE.attr }}>price</span>{"="}<span style={{ color: CODE.str }}>"12 000"</span><Jx>{" />"}</Jx>{"\n"}
              <Jx>{"<Shop />"}</Jx>{"\n"}
              <Jx>{"<Inventory />"}</Jx>{"\n\n"}
              <Cm>{view === "web" ? tr2({ uz: "// → 🌐 brauzerda sayt bo'ladi — React", ru: "// → 🌐 в браузере станет сайтом — React" }) : tr2({ uz: "// → 📱 telefonda ilova bo'ladi — React Native", ru: "// → 📱 на телефоне станет приложением — React Native" })}</Cm>
            </pre>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>React bilsangiz, <b>bir xil fikrlash</b> bilan ham sayt, ham telefon ilovasi yarata olasiz.</>, ru: <>Зная React, вы <b>одним и тем же мышлением</b> создаёте и сайт, и мобильное приложение.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{view === "web" ? tr2({ uz: "Brauzer (sayt)", ru: "Браузер (сайт)" }) : tr2({ uz: "Telefon (ilova)", ru: "Телефон (приложение)" })}</p>
            <div className={`demo-swap ${view === "phone" ? "to-phone" : "to-web"}`} key={view}>
              {view === "web" ? <Win title="skin-market.uz" minH={110}><AppUI /></Win> : <div className="phone">
                  <div className="phone-scr">
                    <div className={`phone-bar ${boot < 2 ? "on-dark" : ""}`}>
                      <span className="pb-time">9:41</span>
                      <span className="pb-island" />
                      <span className="pb-right">
                        <span className="pb-sig"><i /><i /><i /><i /></span>
                        <span className="pb-net">5G</span>
                        <span className="pb-bat"><span className="pb-bat-f" /></span>
                        <span className="pb-batn">92%</span>
                      </span>
                    </div>
                    {boot < 2 ? <div className="phone-boot">
                        <span className={`boot-ic ${boot >= 1 ? "big" : ""}`}>⛏</span>
                        {boot >= 1 && <span className="boot-txt">
                            <span className="boot-name">Skin Market</span>
                            <span className="boot-sub">Powered by React Native</span>
                          </span>}
                      </div> : <div className="phone-app"><AppUI compact /></div>}
                  </div>
                </div>}
            </div>
            <div className="rn-apps fade-up delay-3">
              <span className="rn-apps-l">{tr2({ uz: "React Native bilan quriladigan ilovalar", ru: "Что создают на React Native" })}</span>
              <div className="rn-apps-row">
                <span className="rn-app">🛒 {tr2({ uz: "Onlayn do'kon", ru: "Онлайн-магазин" })}</span>
                <span className="rn-app">💬 {tr2({ uz: "Chat", ru: "Чат" })}</span>
                <span className="rn-app">🎮 {tr2({ uz: "O'yin", ru: "Игра" })}</span>
                <span className="rn-app">🎬 {tr2({ uz: "Video", ru: "Видео" })}</span>
              </div>
            </div>
            {fav && <p className="rn-proof fade-step">{tr2({ uz: <>Bir xil React logikasi — <b>webda ham, telefonda ham</b> ishlaydi. Ko'rinishni almashtiring: son o'zgarmaydi.</>, ru: <>Одна и та же логика React работает <b>и в вебе, и на телефоне</b>. Переключите вид — число не изменится.</> })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  idx={12}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Практика · вопрос 4" })}
  audioText="React Native nima imkon beradi? To'g'ri javobni tanlang."
  questionText="React Native nima imkon beradi?"
  question={tr2({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>React Native</span> nima imkon beradi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что даёт <span className="italic" style={{ color: T.accent }}>React Native</span>?</h2></> })}
  options={[tr2({ uz: "Faqat kompyuter o'yinlarini yasash", ru: "Делать только компьютерные игры" }), tr2({ uz: "React bilimi bilan telefon ilovasi yasash", ru: "Делать мобильные приложения со знанием React" }), tr2({ uz: "Saytlarni rang bilan bezash", ru: "Украшать сайты цветом" }), tr2({ uz: "Internetga simsiz ulanish", ru: "Беспроводное подключение к интернету" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! React Native — o'sha React bilimi bilan iOS va Android ilovalari yasash imkonini beradi. Instagram va Discord shu yo'ldan foydalanadi.", ru: "Верно! React Native позволяет с тем же знанием React делать приложения для iOS и Android. Instagram и Discord используют этот путь." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — o'yin emas. React Native telefon ilovalari yasaydi: Instagram, Discord kabi.", ru: "Нет — не игры. React Native делает мобильные приложения: как Instagram, Discord." }),
    2: tr2({ uz: "Bezash — CSS'ning ishi. React Native — telefon ilovalarini qurish vositasi.", ru: "Украшение — работа CSS. React Native — инструмент для создания мобильных приложений." }),
    3: tr2({ uz: "Yo'q — internetga ulanish emas. Bu React bilan telefon ilovalari qurish.", ru: "Нет — не подключение к интернету. Это создание мобильных приложений с React." }),
    default: tr2({ uz: "React Native — React bilimi bilan telefon ilovalari yasash.", ru: "React Native — создание мобильных приложений со знанием React." })
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s13", text: `Endi o'zingiz quring. Tugmalarni bosib, Minecraft saytingizni bloklardan yig'ing. Xohlagan blokni qayta-qayta qo'yish mumkin.`, trigger: "on_mount", waits_for: null }]);
  const COMP = {
    nav: { l: "<Navbar />", name: tr2({ uz: "Menyu", ru: "Меню" }) },
    search: { l: "<SearchBar />", name: tr2({ uz: "Qidiruv", ru: "Поиск" }) },
    card: { l: "<SkinCard />", name: tr2({ uz: "Skin kartochka", ru: "Карточка скина" }) },
    footer: { l: "<Footer />", name: tr2({ uz: "Pastki qism", ru: "Нижняя часть" }) }
  };
  const [items, setItems] = useState3(storedAnswer ? ["nav", "card", "card"] : []);
  const done = items.length >= 3;
  const MAX = 7;
  const add = (k) => {
    if (items.length >= MAX) return;
    setItems((prev) => [...prev, k]);
  };
  const reset = () => setItems([]);
  const counts = items.reduce((m, k) => {
    m[k] = (m[k] || 0) + 1;
    return m;
  }, {});
  const reused = Object.keys(counts).find((k) => counts[k] >= 2);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const renderPart = (k, i) => {
    switch (k) {
      case "nav":
        return <div key={i} className="el-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg, borderRadius: 8, padding: "6px 10px" }}><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 11, color: T.ink }}>{tr2({ uz: "⛏ Mening MC saytim", ru: "⛏ Мой MC сайт" })}</span><span style={{ fontSize: 9.5, color: T.ink3, fontFamily: "'Manrope',sans-serif" }}>{tr2({ uz: "Asosiy · Skinlar", ru: "Главная · Скины" })}</span></div>;
      case "search":
        return <div key={i} className="el-in" style={{ background: T.bg, borderRadius: 8, padding: "6px 10px", fontFamily: "'Manrope',sans-serif", fontSize: 10.5, color: T.ink3 }}>{tr2({ uz: "Skin qidirish…", ru: "Поиск скина…" })}</div>;
      case "card":
        return <div key={i} className="el-in" style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, padding: 6, boxShadow: "0 2px 7px -2px rgba(0,0,0,0.12)" }}><span style={{ width: 34, height: 24, borderRadius: 5, background: SKINS[i % SKINS.length].bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{SKINS[i % SKINS.length].emoji}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10.5, color: T.ink }}>{tr2(SKINS[i % SKINS.length].name)}</span><span style={{ marginLeft: "auto", fontSize: 9.5, color: T.ink3 }}>♥ 12</span></div>;
      case "footer":
        return <div key={i} className="el-in" style={{ background: T.bg, borderRadius: 8, padding: "6px 10px", textAlign: "center", fontFamily: "'Manrope',sans-serif", fontSize: 9.5, color: T.ink3 }}>{tr2({ uz: "© Mening saytim · 2026", ru: "© Мой сайт · 2026" })}</div>;
      default:
        return null;
    }
  };
  return <Stage eyebrow={tr2({ uz: "Amaliyot · sahifa yig'amiz", ru: "Практика · собираем страницу" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "Kamida 3 ta blok", ru: "Минимум 3 блока" })} (${items.length}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'z saytingizni <span className="italic" style={{ color: T.accent }}>bloklardan</span> quring.</>, ru: <>Постройте свой сайт из <span className="italic" style={{ color: T.accent }}>блоков</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi o'zingiz quring. <b style={{ color: T.ink }}>Tugmalarni bosib</b>, Minecraft saytingizni bloklardan yig'ing — xohlagan blokni <b style={{ color: T.ink }}>qayta-qayta</b> qo'yish mumkin.</>, ru: <>Теперь стройте сами. <b style={{ color: T.ink }}>Нажимайте кнопки</b> и собирайте свой Minecraft-сайт из блоков — один блок можно ставить <b style={{ color: T.ink }}>снова и снова</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Bloklar (komponentlar)", ru: "Блоки (компоненты)" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(COMP).map((k) => <button key={k} className="gchip" disabled={items.length >= MAX} onClick={() => add(k)}>{COMP[k].name} <span className="mono" style={{ color: CODE.tag, fontSize: 11 }}>{COMP[k].l}</span></button>)}
              {items.length > 0 && <button className="gchip" onClick={reset}>{tr2({ uz: "↺ Tozalash", ru: "↺ Очистить" })}</button>}
            </div>
            <div className="algo-build fade-up delay-2" style={{ minHeight: 110 }}>
              <div className="mono" style={{ fontSize: 12.5, color: CODE.comment }}>{"<App>"}</div>
              {items.length === 0 ? <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, paddingLeft: 14 }}>{tr2({ uz: "// blok qo'shing…", ru: "// добавьте блок…" })}</p> : items.map((k, i) => <div key={i} className="algo-line el-in" style={{ borderLeft: `3px solid ${T.accent}` }}><span className="mono" style={{ fontSize: 12.5, color: "#C8501F" }}>{COMP[k].l}</span></div>)}
              <div className="mono" style={{ fontSize: 12.5, color: CODE.comment }}>{"</App>"}</div>
            </div>
            {reused && <span className="tagpill fade-step" style={{ color: T.success }}>✓ {COMP[reused].l} — {counts[reused]} {tr2({ uz: "marta. Bitta kod!", ru: "раза. Один код!" })}</span>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sahifangiz", ru: "Ваша страница" })}</p>
            <Win title="mening-mc-saytim.uz" minH={130}>
              {items.length === 0 ? <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", fontSize: 13 }}>{tr2({ uz: "Bo'sh sahifa — blok qo'shing…", ru: "Пустая страница — добавьте блок…" })}</p> : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{items.map((k, i) => renderPart(k, i))}</div>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Siz hozir <b>React'cha fikrladingiz</b>: sahifa = komponentlar ro'yxati.</>, ru: <>Вы только что <b>мыслили как React</b>: страница = список компонентов.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState3(!!storedAnswer);
  const achMiss = useContext2(AchMissCtx);
  const LINES = [
    { text: tr2({ uz: "<Navbar />        // yuqori menyu", ru: "<Navbar />        // верхнее меню" }) },
    { text: tr2({ uz: "<ButunSahifa />   // sahifa", ru: "<ВсяСтраница />   // страница" }), bug: true },
    { text: tr2({ uz: "<Footer />        // pastki qism", ru: "<Footer />        // нижняя часть" }) }
  ];
  const solve = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { correct: true, picked: true });
  };
  return <Stage eyebrow={tr2({ uz: "Debugging", ru: "Дебаггинг" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>ИИ помогает — а вы <span className="italic" style={{ color: T.accent }}>проверяете</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI Minecraft do'koni sahifasini bir zumda komponentlarga bo'lib berdi. Lekin <b style={{ color: T.ink }}>AI ham xato qiladi</b>. Bitta qator komponent qoidasiga zid — <b style={{ color: T.ink }}>toping va tuzating</b>.</>, ru: <>ИИ мигом разбил страницу Minecraft-магазина на компоненты. Но <b style={{ color: T.ink }}>ИИ тоже ошибается</b>. Одна строка нарушает правило компонента — <b style={{ color: T.ink }}>найдите и исправьте</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "Minecraft do'koni sahifasini komponentlarga bo'ldim:", ru: "Я разбил страницу Minecraft-магазина на компоненты:" })}</span></div>
            <DebugChallenge
    lines={LINES}
    fixed={tr2({ uz: "<SkinKartasi />  <Savat />   // ikki alohida blok", ru: "<КарточкаСкина />  <Корзина />   // два отдельных блока" })}
    explain={tr2({ uz: "«ButunSahifa» — hammasi bitta ulkan monolitda edi. Endi har bo'lak alohida, qayta ishlatiladigan komponent.", ru: "«ВсяСтраница» — всё было в одном огромном монолите. Теперь каждая часть — отдельный, переиспользуемый компонент." })}
    onSolved={solve}
    onWrong={() => {
      if (achMiss) achMiss.miss(screen);
    }}
  />
            {!done && <AchRule screen={screen} />}
          </Col>
          <Col>
            {!done ? <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Komponent — <b style={{ color: T.ink }}>kichik va aniq</b> bo'lak: bitta blok, bitta vazifa. Qaysi qator bu qoidaga zid?</>, ru: <>Компонент — <b style={{ color: T.ink }}>маленькая и понятная</b> часть: один блок, одна задача. Какая строка нарушает это правило?</> })}</p></div> : <>
                  <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Tanish-a? Bu — Praktika darsidagi <b>dekompozitsiya</b>! React shu fikrlashni kodning o'ziga olib kiradi.</>, ru: <>Знакомо, правда? Это — <b>декомпозиция</b> с урока Практики! React переносит это мышление в сам код.</> })}</p></div>
                </>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [passed, setPassed] = useState3(!!(storedAnswer && (storedAnswer.solved || storedAnswer.correct)));
  const achMiss = useContext2(AchMissCtx);
  const wrongEverRef = useRef3(false);
  const onWrong = () => {
    wrongEverRef.current = true;
    if (achMiss) achMiss.miss(screen);
  };
  const ITEMS = [
    { id: "change", label: tr2({ uz: "👆 Foydalanuvchi like bosadi", ru: "👆 Пользователь нажимает лайк" }) },
    { id: "draft", label: tr2({ uz: "📝 React yangi nusxa yaratadi", ru: "📝 React создаёт новую копию" }) },
    { id: "diff", label: tr2({ uz: "🔍 Eski nusxa bilan solishtiradi", ru: "🔍 Сравнивает со старой копией" }) },
    { id: "update", label: tr2({ uz: "⚡ Faqat farqni sahifaga qo'yadi", ru: "⚡ Переносит на страницу только разницу" }) }
  ];
  const HINTS = [tr2({ uz: "1-qadam — nimadan boshlanadi?", ru: "шаг 1 — с чего всё начинается?" }), tr2({ uz: "keyin nima bo'ladi?", ru: "что происходит потом?" }), tr2({ uz: "keyin nima?", ru: "а дальше?" }), tr2({ uz: "oxirgi — natija", ru: "последний — результат" })];
  const solve = () => {
    if (passed) return;
    setPassed(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Tartibni tuzing", ru: "Составьте порядок" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Like bosildi — React ichida <span className="italic" style={{ color: T.accent }}>nima yuz beradi</span>?</>, ru: <>Лайк нажат — <span className="italic" style={{ color: T.accent }}>что происходит</span> внутри React?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Oxirgi sinov! Like bosilgandan to sahifa yangilangunigacha React ichida <b style={{ color: T.ink }}>nima yuz beradi</b>? Bo'laklarni <b style={{ color: T.ink }}>to'g'ri tartibda</b> joylang — sudrab yoki bosib.</>, ru: <>Последнее испытание! От нажатия лайка до обновления страницы — <b style={{ color: T.ink }}>что происходит</b> внутри React? Разложите блоки <b style={{ color: T.ink }}>в правильном порядке</b> — перетаскивая или нажимая.</> })}</Mentor>
        <div className="fc-center fc-top">
          <div style={{ maxWidth: 880, width: "100%" }}>
            <DragDropOrder items={ITEMS} hints={HINTS} onSolved={solve} onWrong={onWrong} />
            {passed && <div className="frame-success fade-step" style={{ marginTop: 12 }}><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ Mukammal! Bosildi → yangi nusxa → solishtirish → faqat o'zgargan joy. React aynan shunday ishlaydi!", ru: "✓ Идеально! Нажатие → новая копия → сравнение → только изменившееся место. React работает именно так!" })}</p></div>}
          </div>
        </div>
      </div>
    </Stage>;
};
var REACT_FLASHCARDS = [
  { front: { uz: "React qaysi dasturlash tilida yozilgan?", ru: "На каком языке программирования написан React?" }, back: "JavaScript", note: { uz: "React yangi til emas — kutubxona", ru: "React — не новый язык, а библиотека" } },
  { front: { uz: "React nima qurish uchun ishlatiladi?", ru: "Для чего используют React?" }, back: { uz: "Interfeys", ru: "Интерфейс" }, note: { uz: "sahifaning ko'rinadigan qismi: menyu, kartochka, tugma", ru: "видимая часть страницы: меню, карточки, кнопки" } },
  { front: { uz: "Tayyor asboblar to'plami qanday ataladi?", ru: "Как называется набор готовых инструментов?" }, back: { uz: "Kutubxona", ru: "Библиотека" }, note: { uz: "har safar noldan yozmaysiz — tayyorini olasiz", ru: "не пишете каждый раз с нуля — берёте готовое" } },
  { front: { uz: "React'ni kim va qaysi yilda yaratgan?", ru: "Кто и в каком году создал React?" }, back: "Facebook, 2013", note: { uz: "Instagram, WhatsApp shu kutubxonada ishlaydi", ru: "Instagram и WhatsApp работают на этой библиотеке" } },
  { front: { uz: "Sahifaning qayta ishlatiladigan bo'lagi qanday ataladi?", ru: "Как называется переиспользуемая часть страницы?" }, back: { uz: "Komponent", ru: "Компонент" }, note: { uz: "menyu, qidiruv katagi, kartochka, tugma", ru: "меню, строка поиска, карточка, кнопка" } },
  { front: { uz: "Bitta komponentni necha marta ishlatish mumkin?", ru: "Сколько раз можно использовать один компонент?" }, back: { uz: "Istalgancha", ru: "Сколько угодно" }, note: { uz: "kartochka ko'payadi, kod bitta qoladi", ru: "карточек больше, а код остаётся один" } },
  { front: { uz: "Komponent ichida boshqa komponent tura oladimi?", ru: "Может ли внутри компонента быть другой компонент?" }, back: { uz: "Ha", ru: "Да" }, note: { uz: "kartochka ichida like tugmasi yashaydi", ru: "внутри карточки живёт кнопка лайка" } },
  { front: { uz: "React xotirasida saqlaydigan yengil nusxa qanday ataladi?", ru: "Как называется лёгкая копия, которую React хранит в памяти?" }, back: "Virtual DOM", note: { uz: "ko'rinmas nusxa", ru: "невидимая копия" } },
  { front: { uz: "Virtual DOM yangi nusxani nima bilan solishtiradi?", ru: "С чем Virtual DOM сравнивает новую копию?" }, back: { uz: "Eski nusxa bilan", ru: "Со старой копией" }, note: { uz: "solishtiradi va farqni topadi", ru: "сравнивает и находит разницу" } },
  { front: { uz: "O'zgarish bo'lganda React sahifaning qaysi qismini yangilaydi?", ru: "Какую часть страницы React обновляет при изменении?" }, back: { uz: "Faqat o'zgargan joyni", ru: "Только изменившееся место" }, note: { uz: "butun sahifa emas — shuning uchun tez", ru: "не всю страницу — поэтому быстро" } },
  { front: { uz: "React bilimi bilan telefon ilovasi yasash nima deyiladi?", ru: "Как называется создание мобильных приложений со знанием React?" }, back: "React Native", note: { uz: "Instagram, Discord, Shopify shu yo'lda", ru: "Instagram, Discord, Shopify идут этим путём" } },
  { front: { uz: "Koddagi xatoni topib tuzatish qanday ataladi?", ru: "Как называется поиск и исправление ошибки в коде?" }, back: { uz: "Debugging", ru: "Дебаггинг" }, note: { uz: "AI ham xato qiladi — siz tekshirasiz", ru: "ИИ тоже ошибается — проверяете вы" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={REACT_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const [hwOpen, setHwOpen] = useState3(false);
  const [hwCharge, setHwCharge] = useState3(false);
  const fireHw = () => {
    if (hwCharge || hwOpen) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwOpen(true);
      setHwCharge(false);
    }, 500);
  };
  const _gate = useContext2(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState3(false);
  const [arenaSolo, setArenaSolo] = useState3(false);
  const quizSt = _live && _live.quiz && _live.quiz.state || "off";
  const isStudentL = _live && _live.mode === "student";
  const isMentorL = _live && _live.mode === "mentor";
  const classOver = !!(_live && (_live.status === "ended" || !_live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== "done";
  const studentLive = isStudentL && !studentSolo && quizSt !== "off";
  const studentWait = isStudentL && !studentSolo && quizSt === "off";
  const openArena = async () => {
    if (isMentorL && quizSt === "off") {
      try {
        await _live.quizControl("lobby", -1);
      } catch {
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const audio = useAudio([{ id: "s16", text: "Tabriklaymiz — React dunyosiga birinchi qadamni qo'ydingiz! Esda saqlang: React — interfeys uchun JavaScript kutubxonasi. Komponent — sahifaning bloki: bir marta yoz, istalgancha ishlat. Virtual DOM esa solishtiradi va faqat o'zgargan joyni yangilaydi. Keyingi darsda birinchi komponentingizni o'zingiz yozasiz.", trigger: "on_mount", waits_for: null }]);
  const RECAP = [
    tr2({ uz: "React — interfeys uchun JavaScript kutubxonasi (Facebook, 2013)", ru: "React — библиотека JavaScript для интерфейсов (Facebook, 2013)" }),
    tr2({ uz: "Komponent — sahifaning bloki: bir marta yoz, istalgancha ishlat", ru: "Компонент — блок страницы: напиши раз — используй сколько хочешь" }),
    tr2({ uz: "Virtual DOM — solishtiradi, faqat farqni yangilaydi", ru: "Virtual DOM — сравнивает, обновляет только разницу" }),
    tr2({ uz: "Oddiy sayt to'liq yangilanadi, React — kerakli joynigina", ru: "Обычный сайт обновляется целиком, React — только нужное место" }),
    tr2({ uz: "React Native — shu bilim bilan telefon ilovalari", ru: "React Native — мобильные приложения с этим же знанием" })
  ];
  const HOMEWORK = [
    { b: tr2({ uz: "Komponent ovi", ru: "Охота на компоненты" }), t: tr2({ uz: "— Instagram yoki YouTube'ni oching, takrorlanadigan 5 ta bo'lakni toping va nomlarini yozib qo'ying", ru: "— откройте Instagram или YouTube, найдите 5 повторяющихся частей и запишите их названия" }) },
    { b: tr2({ uz: "Bo'laklash", ru: "Разбиение" }), t: tr2({ uz: "— sevimli saytingiz bosh sahifasini qog'ozga komponentlarga bo'lib chizing", ru: "— нарисуйте на бумаге главную страницу любимого сайта, разбив её на компоненты" }) },
    { b: tr2({ uz: "Kuzatuv", ru: "Наблюдение" }), t: tr2({ uz: "— 3 ta ilovada like yoki tugma bosing: sahifa to'liq yangilanadimi yoki faqat bir joyi?", ru: "— нажмите лайк или кнопку в 3 приложениях: обновляется вся страница или только одно место?" }) }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Dars tugadi", ru: "Урок завершён" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>React dunyosiga <span className="italic" style={{ color: T.accent }}>xush kelibsiz</span>.</>, ru: <>Добро пожаловать в <span className="italic" style={{ color: T.accent }}>мир React</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0} />
        </div>
        {arena && <QuizArena live={_live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr2({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>)}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? "charging" : ""}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{tr2(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr2({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
            <span className="hw-big-s">{tr2({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: "Atrofingizdagi ilovalarni komponentlarga bo'lib ko'ring:", ru: "Разберите окружающие приложения на компоненты:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "Keyingi darsda muhitni o'rnatib, birinchi React komponentingizni o'zingiz yozasiz! 🚀", ru: "На следующем уроке настроите окружение и сами напишете свой первый React-компонент! 🚀" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz", ru: "🏅 Ваши награды" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(achievements && achievements.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`} title={tr2(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : "🔒"}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr2(a.desc)}</span>}
              </div>;
  })}
          </div>
        </div>}
      </div>
    </Stage>;
};
var ACHIEVEMENTS = {
  builder: { icon: "🧱", name: "Built It!", desc: { uz: "Saytni komponent bloklaridan yig'dingiz", ru: "Вы собрали сайт из блоков-компонентов" } },
  debugger: { icon: "🐞", name: "Nice Catch!", desc: { uz: "AI kodidagi xatoni topib tuzatdingiz", ru: "Вы нашли и исправили ошибку в коде ИИ" } },
  flow: { icon: "⚡", name: "Flow Master!", desc: { uz: "React yangilash oqimini to'g'ri tuzdingiz", ru: "Вы верно выстроили поток обновления React" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "React'ga kirish darsini to'liq yakunladingiz", ru: "Вы полностью прошли вводный урок React" } }
};
var ACH_TRIGGERS = { s13: "builder", s14: "debugger", s15: "flow" };
var AchRule = ({ screen, once }) => {
  const earned = useContext2(AchCtx);
  const am = useContext2(AchMissCtx);
  const gate = useContext2(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || gate.live && gate.live.mode === "mentor" || earned && earned.has(ach)) return null;
  const lost = am.missed.has(sid);
  return <p className={`ach-rule ${lost ? "lost" : ""}`}>{lost ? once ? tr2({ uz: "Nishon birinchi urinish uchun edi.", ru: "Значок давался за первую попытку." }) : tr2({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: "Значок давался за первую попытку — теперь спокойно найдите верный ответ." }) : tr2({ uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "🏅 Справитесь с первой попытки — значок ваш." })}</p>;
};
function AchCelebrate({ ach, onDone }) {
  useEffect4(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr2({ uz: "Yangi nishon:", ru: "Новая награда:" })} ${ach.name}`}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">{ach.icon}<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="acu-spark" style={{ "--a": `${i * (360 / 14)}deg`, animationDelay: `${0.18 + i % 5 * 0.05}s` }}>✦</span>)}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{tr2(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr2({ uz: "bosib davom eting", ru: "нажмите, чтобы продолжить" })}</span>
      </div>
    </div>;
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}
var Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, "#FFD380", "#FF7755", "#7DD181"];
  return <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
    const left = (i * 2.31 + i % 7 * 4) % 100;
    const size = 6 + i % 4 * 2;
    return <span key={i} className="confetti-bit" style={{
      left: `${left}%`,
      background: COLORS[i % COLORS.length],
      width: size,
      height: size * 1.5,
      animationDelay: `${i % 11 * 0.16}s`,
      animationDuration: `${2.4 + i % 6 * 0.45}s`,
      borderRadius: i % 2 ? "2px" : "50%"
    }} />;
  })}
    </div>;
};
var Q_LABELS = { 4: { uz: "1 — React nima", ru: "1 — Что такое React" }, 6: { uz: "2 — Komponent", ru: "2 — Компонент" }, 10: "3 — Virtual DOM", 13: "4 — React Native", 16: { uz: "5 — Yangilash tartibi", ru: "5 — Порядок обновления" } };
var INLINE_KEYS = { s4: 1, s5b: 2, s9: 3, s12: 1, s15: 0 };
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState3([]);
  const [rows, setRows] = useState3([]);
  const [loaded2, setLoaded] = useState3(false);
  useEffect4(() => {
    if (!isLive || !livePin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on) {
          setPlayers(p);
          setRows(a);
          setLoaded(true);
        }
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [isLive, livePin]);
  const totalQ = SCORED_IDX.length;
  const board = players.map((p) => {
    const mine = rows.filter((a) => a.player_id === p.id && SCORED_IDX.includes(a.screen_idx));
    const okCount = mine.filter((a) => a.correct).length;
    const time = mine.reduce((s, a) => s + (a.elapsed_ms || 0), 0);
    return { id: p.id, nickname: p.nickname, okCount, time };
  }).sort((x, y) => y.okCount - x.okCount || x.time - y.time);
  const fmtT = (ms) => `${(ms / 1e3).toFixed(1)}s`;
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex((b) => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  return <Stage eyebrow={tr2({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не присоединился." })}</p></div> : <>
            <Confetti />
            {
    /* Podium — 2-1-3 tartibida (o'rtada g'olib, balandroq) */
  }
            <div className="pod-stage fade-up">
              {[1, 0, 2].map((rank) => {
    const b = top3[rank];
    return <div key={rank} className={`pod-col pod-${rank + 1} ${b && live.playerId === b.id ? "me" : ""}`}>
                    <span className="pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : "—"}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ} · {fmtT(b.time)}</span>}
                    <div className="pod-bar" />
                  </div>;
  })}
            </div>
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏆 To'liq reyting", ru: "🏆 Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={tr2(Q_LABELS[q])} />;
  })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>)}
              </div>
            </div>
            {
    /* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */
  }
            <div className="card fade-up d2">
              <div className="card-lbl" style={{ color: T.blue }}>{tr2({ uz: "📊 Savollar bo'yicha", ru: "📊 По вопросам" })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map((q) => {
    const qa = rows.filter((r) => r.screen_idx === q);
    const okN = qa.filter((r) => r.correct).length;
    const pct = qa.length ? Math.round(okN / qa.length * 100) : 0;
    const hard = qa.length >= 2 && pct < 50;
    return <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{Q_LABELS[q] ? tr2(Q_LABELS[q]) : `#${q}`}{hard && " ⚠️"}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>;
  })}
              </div>
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr2({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Yana bir bor tushuntiring.", ru: "Вопросы со знаком ⚠️ — темы, с которыми класс справился хуже. Рекомендуется объяснить ещё раз." })}</p>}
            </div>
          </>}
      </div>
    </Stage>;
};
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "useState", l: 5, t: 10, s: 30, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "<App/>", l: 84, t: 7, s: 30, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "props", l: 8, t: 72, s: 32, c: "rgba(80,200,255,0.16)", d: 27, dl: 0.8 },
  { ch: "JSX", l: 80, t: 68, s: 36, c: "rgba(120,235,175,0.14)", d: 21, dl: 2.2 },
  { ch: "⚛", l: 44, t: 86, s: 40, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "<Tag/>", l: 66, t: 26, s: 30, c: "rgba(255,110,70,0.13)", d: 17, dl: 0.4 },
  { ch: "render", l: 26, t: 34, s: 28, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "DOM", l: 55, t: 5, s: 30, c: "rgba(80,200,255,0.14)", d: 22, dl: 0.6 },
  { ch: "Virtual", l: 91, t: 42, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "component", l: 2, t: 45, s: 22, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "React aslida nima?", ru: "Что такое React на самом деле?" }, opts: [{ uz: "Yangi dasturlash tili", ru: "Новый язык программирования" }, { uz: "JavaScript kutubxonasi", ru: "Библиотека JavaScript" }, { uz: "Brauzer dasturining nomi", ru: "Название браузера" }, { uz: "Operatsion tizim turi", ru: "Вид операционной системы" }], correct: 1 },
  { q: { uz: "React'ni kim va qachon yaratgan?", ru: "Кто и когда создал React?" }, opts: [{ uz: "Google kompaniyasi, 2020-yil", ru: "Компания Google, 2020 год" }, { uz: "Apple kompaniyasi, 2010-yil", ru: "Компания Apple, 2010 год" }, { uz: "Microsoft kompaniyasi, 2015-yil", ru: "Компания Microsoft, 2015 год" }, { uz: "Facebook kompaniyasi, 2013-yil", ru: "Компания Facebook, 2013 год" }], correct: 3 },
  { q: { uz: "Komponent nima?", ru: "Что такое компонент?" }, opts: [{ uz: "Rasm fayllarining turi", ru: "Тип файлов картинок" }, { uz: "Internet tezligini oshiradi", ru: "Повышает скорость интернета" }, { uz: "Qayta ishlatiladigan bo'lak", ru: "Переиспользуемая часть" }, { uz: "Brauzer ichki sozlamasi", ru: "Внутренняя настройка браузера" }], correct: 2 },
  { q: { uz: "Virtual DOM asosiy vazifasi nima?", ru: "Главная задача Virtual DOM?" }, opts: [{ uz: "Farqni topib yangilaydi", ru: "Находит разницу и обновляет" }, { uz: "Internetni tezlashtiradi", ru: "Ускоряет интернет" }, { uz: "Kodni avtomatik yozadi", ru: "Автоматически пишет код" }, { uz: "Saytga rang beradi", ru: "Красит сайт" }], correct: 0 },
  { q: { uz: "React qaysi tilda yozilgan?", ru: "На каком языке написан React?" }, opts: ["Python", "JavaScript", "HTML", "C++"], correct: 1 },
  { q: { uz: "React bilan telefon ilovasi qanday yasaladi?", ru: "Как с React делают мобильное приложение?" }, opts: [{ uz: "React DOM orqali", ru: "Через React DOM" }, { uz: "React CSS orqali", ru: "Через React CSS" }, { uz: "React Web orqali", ru: "Через React Web" }, { uz: "React Native orqali", ru: "Через React Native" }], correct: 3 },
  { q: { uz: "Komponentning asosiy foydasi nima?", ru: "Главная польза компонента?" }, opts: [{ uz: "Kodni ancha sekinlashtiradi", ru: "Сильно замедляет код" }, { uz: "Internetga tezroq ulaydi", ru: "Быстрее подключает к интернету" }, { uz: "Bir marta yoz, ko'p ishlat", ru: "Напиши раз — используй много" }, { uz: "Rasmlarni ekranga chizadi", ru: "Рисует картинки на экране" }], correct: 2 },
  { q: { uz: "Oddiy eski sayt like bosilganda nima qiladi?", ru: "Что делает старый сайт при нажатии лайка?" }, opts: [{ uz: "Butun sahifa qayta yuklanadi", ru: "Перезагружает всю страницу" }, { uz: "Umuman javob qaytarmaydi", ru: "Вообще не отвечает" }, { uz: "Sayt butunlay o'chib qoladi", ru: "Сайт полностью выключается" }, { uz: "Faqat rang o'zgaradi", ru: "Меняется только цвет" }], correct: 0 },
  { q: { uz: "DOM nima?", ru: "Что такое DOM?" }, opts: [{ uz: "Kod yozadigan dastur (Editor)", ru: "Редактор для написания кода" }, { uz: "Sahifaning haqiqiy tuzilishi", ru: "Настоящая структура страницы" }, { uz: "Ranglar palitrasi dasturi", ru: "Программа палитры цветов" }, { uz: "Internet provayderi nomi", ru: "Название интернет-провайдера" }], correct: 1 },
  { q: { uz: "Virtual DOM qayerda turadi?", ru: "Где находится Virtual DOM?" }, opts: [{ uz: "Ekranda, ko'z oldida", ru: "На экране, у всех на виду" }, { uz: "Serverda, uzoq joyda", ru: "На сервере, далеко" }, { uz: "Internet bulutida", ru: "В интернет-облаке" }, { uz: "Xotirada, ko'rinmaydi", ru: "В памяти, невидим" }], correct: 3 },
  { q: { uz: "Bir komponentni ko'p marta ishlatish nima deyiladi?", ru: "Как называется использование одного компонента много раз?" }, opts: [{ uz: "Qaytadan yuklash", ru: "Перезагрузка" }, { uz: "Butunlay o'chirish", ru: "Полное удаление" }, { uz: "Qayta ishlatish", ru: "Переиспользование" }, { uz: "Boshqa tilga tarjima", ru: "Перевод на другой язык" }], correct: 2 },
  { q: { uz: "JSX'da komponent qanday chaqiriladi?", ru: "Как вызывается компонент в JSX?" }, opts: ["<SkinCard />", "call SkinCard", "SkinCard()", "{SkinCard}"], correct: 0 }
];
var quizPts = (elapsedMs) => elapsedMs <= 500 ? 1e3 : Math.max(0, Math.round(1e3 * (1 - Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS / 2)));
var quizScore = (rows) => {
  const byQ = {};
  rows.forEach((r) => {
    byQ[r.screen_idx - QUIZ_BASE_IDX] = r;
  });
  let pts = 0, streak = 0, maxStreak = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      ok++;
      pts += quizPts(a.elapsed_ms) + (streak >= 2 ? 100 : 0);
    } else streak = 0;
  }
  return { pts, ok, maxStreak };
};
function QzTimer({ remaining }) {
  const R = 26, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1e3);
  const col = remaining > 1e4 ? "#2BD97C" : remaining > 5e3 ? "#FFC94D" : "#FF5A5A";
  return <div className={`qz-timer ${remaining <= 5e3 && remaining > 0 ? "urgent" : ""}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 0.12s linear, stroke 0.4s" }} />
      </svg>
      <span className="qz-timer-n" style={{ color: col }}>{sec}</span>
    </div>;
}
var CsNeonBolt = ({ flip }) => <span className={`csn-boltwrap ${flip ? "flip" : ""}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>;
var CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState3(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true);
    setTimeout(onClick, 430);
    setTimeout(() => setCharge(false), 900);
  };
  return <div
    className={`cs-cap ${clickable ? "cs-clickable" : ""} ${disabled ? "cs-off" : ""} ${liveOn ? "cs-live" : ""} ${charge ? "cs-charging" : ""}`}
    {...clickable ? { role: "button", tabIndex: 0, onClick: fire, onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fire();
      }
    } } : {}}
  >
      <span className="cs-ring" aria-hidden="true" />
      <div className="cs-sky" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className={`cs-tok ${i % 2 ? "back" : "front"}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, "--d": `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>)}
        {[[14, 30, 24], [38, 66, 15], [57, 20, 27], [76, 60, 18], [88, 36, 13]].map(([l, t, w], i) => <i key={i} className="cs-dash" style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `-${i * 1.7}s` }} />)}
        <span className="cs-thunder" />
      </div>
      <div className="cs-row">
        {bolt && <CsNeonBolt />}
        <div className="cs-word" data-text="CODE STRIKE" aria-label="CodeStrike">CODE STRIKE</div>
        {bolt && <CsNeonBolt flip />}
      </div>
      {stats && <div className="cs-hud">
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr2({ uz: "SAVOL", ru: "ВОПРОСОВ" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1e3}</b> {tr2({ uz: "SONIYA", ru: "СЕКУНД" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
function QzFX() {
  const ref = useRef3(null);
  useEffect4(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const ctx = cv.getContext("2d");
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => {
      W = cv.width = Math.max(1, cv.offsetWidth * DPR);
      H = cv.height = Math.max(1, cv.offsetHeight * DPR);
    };
    size();
    window.addEventListener("resize", size);
    const TOK = ["useState", "props", "JSX", "render", "⚛", "DOM", "Virtual", "component"];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28, sw: 0.3 + Math.random() * 0.6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: 0.4 + Math.random() * 0.9, vx: (Math.random() - 0.5) * 0.16, t: TOK[i % TOK.length], r: (Math.random() - 0.5) * 0.5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) {
        p.y -= (0.15 + p.z * 0.35) * DPR;
        p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * 0.35;
        if (p.y < -12) {
          p.y = H + 12;
          p.x = Math.random() * W;
        }
      }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) {
        const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR;
        if (d < mx) {
          ctx.strokeStyle = "rgba(150,95,255," + 0.11 * (1 - d / mx) + ")";
          ctx.beginPath();
          ctx.moveTo(em[a].x, em[a].y);
          ctx.lineTo(em[b].x, em[b].y);
          ctx.stroke();
        }
      }
      for (const p of em) {
        const s = (1.3 + p.z * 2.2) * DPR, tw = 0.22 + p.z * 0.3 + Math.sin(tm / 600 + p.ph) * 0.1;
        ctx.fillStyle = "rgba(205,175,255," + tw + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, 6.29);
        ctx.fill();
      }
      for (const t of toks) {
        t.x += t.vx * DPR;
        t.y -= (0.08 + t.z * 0.12) * DPR;
        if (t.y < -34) t.y = H + 34;
        if (t.x < -50) t.x = W + 50;
        if (t.x > W + 50) t.x = -50;
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.r * 0.12);
        ctx.font = "700 " + (13 + t.z * 22) * DPR + 'px "JetBrains Mono",monospace';
        ctx.fillStyle = "rgba(190,150,255," + (0.05 + t.z * 0.07) + ")";
        ctx.textAlign = "center";
        ctx.fillText(t.t, 0, 0);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);
  return <canvas ref={ref} className="qz-fx" aria-hidden="true" />;
}
function QuizArena({ live, onClose, startSolo }) {
  const isMentor = live.mode === "mentor";
  const isStudent = live.mode === "student";
  const [soloMode, setSoloMode] = useState3(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef3(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState3("lobby");
  const [qi, setQi] = useState3(-1);
  const [remaining, setRemaining] = useState3(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState3({});
  const [players, setPlayers] = useState3([]);
  const [qRows, setQRows] = useState3([]);
  const [answeredN, setAnsweredN] = useState3(0);
  const [classEnded, setClassEnded] = useState3(false);
  const seenQRef = useRef3(-1);
  const qStartRef = useRef3(0);
  const deadlineRef = useRef3(0);
  const phaseRef = useRef3(phase);
  phaseRef.current = phase;
  useEffect4(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then((rows) => {
      const mine = {};
      rows.filter((r) => r.player_id === live.playerId).forEach((r) => {
        mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms };
      });
      setMyAnswers((m) => ({ ...mine, ...m }));
    }).catch(() => {
    });
  }, []);
  useEffect4(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || "off", q = row.quiz_q ?? -1;
          if (st === "q" && q !== seenQRef.current) {
            seenQRef.current = q;
            qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700);
            setQi(q);
            setRemaining(deadlineRef.current - Date.now());
            setPhase("q");
            setAnsweredN(0);
          } else if (st === "r") {
            if (q !== seenQRef.current) {
              seenQRef.current = q;
              setQi(q);
            }
            setPhase((p) => p === "done" ? p : "reveal");
          } else if (st === "done") {
            setPhase("done");
          }
        }
        const st1 = row ? row.quiz_state || "off" : null;
        const ph = st1 === "r" ? "reveal" : st1 === "done" ? "done" : st1 === "lobby" ? "lobby" : st1 === "q" ? "q" : phaseRef.current;
        if (on) setClassEnded(!row || row.status === "ended");
        if (ph === "lobby" || ph === "reveal" || ph === "done" || phaseRef.current === "reveal") {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on) {
            setPlayers(pl);
            setQRows(qa);
          }
        } else if (ph === "q" && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on) {
            setPlayers(pl);
            setAnsweredN(qa.length);
          }
        }
      } catch {
      }
      if (on) t = setTimeout(tick, 1200);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, []);
  useEffect4(() => {
    if (phase !== "q") return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase("reveal");
        if (isMentor && !soloRef.current) ctrl("r", seenQRef.current);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]);
  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === "q") {
        seenQRef.current = q;
        qStartRef.current = Date.now();
        deadlineRef.current = Date.now() + QUIZ_MS;
        setQi(q);
        setRemaining(QUIZ_MS);
        setPhase("q");
        setAnsweredN(0);
      } else if (state === "r" || state === "done") {
        setPhase(state === "r" ? "reveal" : "done");
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => {
          setPlayers(pl);
          setQRows(qa);
        }).catch(() => {
        });
      }
    } catch {
    }
  };
  const soloStart = (i) => {
    seenQRef.current = i;
    qStartRef.current = Date.now();
    deadlineRef.current = Date.now() + QUIZ_MS;
    setQi(i);
    setRemaining(QUIZ_MS);
    setPhase("q");
  };
  const soloNext = () => {
    const n = qi + 1;
    if (n >= QUIZ_BANK.length) setPhase("done");
    else soloStart(n);
  };
  const soloReplay = () => {
    setMyAnswers({});
    soloStart(0);
  };
  const startPractice = () => {
    setSoloMode(true);
    setMyAnswers({});
    soloStart(0);
  };
  const answer = (i) => {
    if (phase !== "q" || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers((m) => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase("reveal");
  };
  const streakUpTo = (k) => {
    let s = 0;
    for (let i = 0; i <= k; i++) {
      if (myAnswers[i]?.correct) s++;
      else s = 0;
    }
    return s;
  };
  const myPtsFor = (k) => {
    const a = myAnswers[k];
    if (!a || !a.correct) return 0;
    return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0);
  };
  const board = players.map((p) => {
    const s = quizScore(qRows.filter((r) => r.player_id === p.id));
    return { id: p.id, nickname: p.nickname, ...s };
  }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex((b) => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: "me", screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);
  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter((r) => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some((r) => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  const my = qi >= 0 ? myAnswers[qi] : null;
  const closeArena = () => {
    if (isMentor && !solo && phase !== "done") {
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚡ Продолжить».\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершился — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ожидаем учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Ждите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr2({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>}
        </div>}

      {
    /* ===== SAVOL ===== */
  }
      {phase === "q" && Q && <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr2({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span> : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : " "}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr2(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const pickedThis = my && my.picked === i;
    return <button key={i} className={`qz-tile ${my ? pickedThis ? "picked" : "faded" : ""}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr2(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>;
  })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr2({ uz: "✔ Javob qabul qilindi — natijani kuting…", ru: "✔ Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr2({ uz: "✓ Hamma javob berdi!", ru: "✓ Все ответили!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>{tr2({ uz: "⏹ Natijani ochish", ru: "⏹ Открыть результат" })}</button>
            </div>}
        </div>}

      {
    /* ===== NATIJA (reveal) ===== */
  }
      {phase === "reveal" && Q && <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr2({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr2({ uz: "natija", ru: "результат" })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr2(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const win = i === Q.correct;
    const pickedThis = my && my.picked === i;
    return <div key={i} className={`qz-tile rv ${win ? "win" : "lose"} ${pickedThis ? "picked" : ""}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr2(o))}</span>
                  <span className="qz-cnt">{win ? "✓ " : ""}{counts[i]}</span>
                </div>;
  })}
          </div>
          {!isMentor && <div className={`qz-res ${my?.correct ? "good" : "bad"}`}>
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} ${tr2({ uz: "streak", ru: "стрик" })}` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Быстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: "Siz hozir:", ru: "Вы сейчас:" })} {myRank + 1}{tr2({ uz: "-o'rin", ru: "-е место" })}</span>}
            </div>}
          {!solo && <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
              {board.slice(0, 5).map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>)}
            </div>}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : ctrl("q", qi + 1)}>{lastQ ? tr2({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr2({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

      {
    /* ===== YAKUN — PODIUM ===== */
  }
      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr2({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? ` · ${tr2({ uz: "eng uzun streak", ru: "лучший стрик" })} 🔥x${soloScore.maxStreak}` : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr2({ uz: "↻ Qayta ishlash", ru: "↻ Пройти заново" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr2({ uz: "ball", ru: "баллов" })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>;
  })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест заново — тренировка (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
function ReactIntroLesson({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || "uz";
  __lang = lang;
  setLiveLang(lang);
  const savedRef = useRef3(void 0);
  if (savedRef.current === void 0) {
    const p = progRead(LESSON_META.lessonId, TOTAL_SCREENS);
    if (p) {
      const li = LIVE_ENABLED ? liveRead(LESSON_META.lessonId) : null;
      if (li && li.mode === "student" && typeof li.lastScreen === "number")
        p.screen = Math.min(p.screen || 0, Math.max(0, li.lastScreen - 1));
    }
    savedRef.current = p;
  }
  const saved = savedRef.current;
  const [screen, setScreen] = useState3(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState3(() => saved && saved.answers || {});
  const startTimeRef = useRef3(saved?.startedAt || Date.now());
  const firstPassRef = useRef3(saved?.firstPass || null);
  const soloSentRef = useRef3(/* @__PURE__ */ new Set());
  const [fpPractice, setFpPractice] = useState3(!!saved?.firstPass);
  const earnedRef = useRef3(new Set(saved?.earned || []));
  const [earned, setEarned] = useState3(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState3([]);
  const achKeyRef = useRef3(0);
  const earn = useCallback2((id) => {
    if (firstPassRef.current) return;
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  const missedRef = useRef3(new Set(saved?.missed || []));
  const [missed, setMissed] = useState3(() => new Set(saved?.missed || []));
  const missTry = useCallback2((idx) => {
    const sid = SCREEN_META[idx] && SCREEN_META[idx].id;
    const ach = ACH_TRIGGERS[sid];
    if (!sid || missedRef.current.has(sid) || ach && earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect4(() => {
    const upd = () => {
      const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1e3)));
      document.documentElement.style.setProperty("--lz", String(Math.round(z * 1e3) / 1e3));
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  const FLASH_IDX = SCREEN_META.findIndex((m) => m.id === "sflash");
  const flashHidden = () => live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const next = () => setScreen((s) => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const prev = () => setScreen((s) => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && live.mode === "solo" && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) {
        soloSentRef.current.add(idx);
        live.submitAnswer(idx, _m.id, key < 0 ? 0 : data.correct ? key : key === 0 ? 1 : 0, !!data.correct, data.elapsedMs || 0);
      }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
    if (_m && _m.scored && _m.scope === "final" && data && (data.solved || data.correct) && live.mode === "student") live.submitAnswer(idx, _m.id, data.picked === 1 ? 1 : 0, !!data.correct, 0);
  };
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect4(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  useEffect4(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen, earn]);
  const reset = () => {
    if (!firstPassRef.current) {
      firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1e3) };
      setFpPractice(true);
    }
    progClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    startTimeRef.current = Date.now();
  };
  useEffect4(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);
  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const fp = firstPassRef.current;
    const ans = fp ? fp.answers : answers;
    const scoredMeta = SCREEN_META.filter((s) => s.scored);
    const finalMeta = scoredMeta.filter((s) => s.scope === "final");
    const scoredAnswers = SCREEN_META.map((s, i) => s.scored ? ans[i] : null).filter(Boolean);
    const correctAnswers = scoredAnswers.filter((a) => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => s.scored && s.scope === "final" ? ans[i] : null).filter(Boolean);
    const finalCorrect = finalAnswers.filter((a) => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1e3),
      totalQuestions: scoredMeta.length,
      correctAnswers,
      scorePercent: scoredMeta.length ? Math.round(correctAnswers / scoredMeta.length * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false,
      answers: SCREEN_META.map((s, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === "function") onFinished(sealPayload(LESSON_META.lessonId, payload));
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .zoomable { position: relative; }
        /* Zoomable tugmasi (⛶) o'ng yuqori burchakdagi hisoblagich bilan to'qnashmasin (F-0819-35). */
        .zoomable .split > .col:last-child > div:first-child,
        .zoomable .split-4555 > .col:last-child > div:first-child { padding-right: 38px; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: 9px 18px; font-size: 13.5px; line-height: 1.25; }
        .btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; animation: none; }
        /* bosish-ishorasi: birinchi bosilishgacha yumshoq puls + yoyiluvchi halqa (F-0819-34) */
        @keyframes btn-invite { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,79,40,0.40); }
          60% { transform: scale(1.035); box-shadow: 0 0 0 10px rgba(255,79,40,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .btn.invite { animation: btn-invite 1.9s ease-out infinite; }
        .btn.invite:hover, .btn.invite:active { animation: none; }
        @media (prefers-reduced-motion: reduce) { .btn.invite { animation: none; box-shadow: 0 0 0 3px rgba(255,79,40,0.30); } }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        /* markaziy solishtiruv: ekranning asosiy zarbasi (F-0819-16) */
        .vs-box { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: clamp(6px,1.6vw,14px); background: #fff; border-radius: 14px; padding: clamp(12px,2vw,17px) clamp(8px,1.8vw,14px); box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.20); border: 1px solid rgba(0,0,0,0.04); }
        .vs-side { text-align: center; min-width: 0; }
        .vs-lbl { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.09em; text-transform: uppercase; color: ${T.ink3}; }
        .vs-num { display: block; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(28px,5.2vw,42px); line-height: 1.05; margin: 2px 0 1px; animation: num-pop 0.42s cubic-bezier(.34,1.45,.5,1); }
        .vs-unit { display: block; font-family: 'Manrope', sans-serif; font-size: 10px; color: ${T.ink3}; }
        .vs-side.win .vs-num { color: ${T.success}; }
        .vs-side.lose .vs-num { color: ${T.accent}; }
        .vs-mid { width: 30px; height: 30px; border-radius: 50%; background: ${T.bg}; display: flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 10.5px; color: ${T.ink3}; flex-shrink: 0; }
        @keyframes num-pop { 0% { transform: scale(0.72); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .vs-num { animation: none; } }
        .sk-fact { margin-top: 11px; }
        .sk-fact-l { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 3px; }
        .sk-fact .body { margin: 0; color: ${T.ink}; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        /* kod 45% / natija 55% — o'quvchi avval natijani ko'rsin (F-0819-09) */
        .split-4555 { display: grid; grid-template-columns: minmax(0,45fr) minmax(0,55fr); gap: clamp(18px,3vw,36px); align-items: start; }
        @media (max-width: 760px) { .split-4555 { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }
        /* Web <-> Mobile shakl-o'zgarishi (F-0819-22) */
        .demo-swap.to-phone { animation: to-phone 0.62s cubic-bezier(.34,1.2,.4,1) both; transform-origin: center top; }
        @keyframes to-phone { 0% { opacity: 0; transform: scaleX(1.55) scaleY(0.70); } 55% { opacity: 1; transform: scaleX(0.94) scaleY(1.04); } 100% { opacity: 1; transform: scale(1); } }
        .demo-swap.to-web { animation: to-web 0.55s cubic-bezier(.34,1.2,.4,1) both; transform-origin: center top; }
        @keyframes to-web { 0% { opacity: 0; transform: scaleX(0.60) scaleY(1.20); } 60% { opacity: 1; transform: scaleX(1.03) scaleY(0.97); } 100% { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .demo-swap.to-phone, .demo-swap.to-web { animation: fade-step 0.3s ease-out both; } }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === STEP FLOW (gorizontal) === */
        .pz-flow { display: flex; align-items: flex-start; gap: 4px; overflow-x: auto; padding: 4px 2px 2px; }
        .pz-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 88px; flex: 0 0 auto; padding: 10px 6px; border-radius: 12px; transition: background 0.3s; }
        .pz-step.on { background: ${T.successSoft}; }
        .pz-step.active { background: ${T.accentSoft}; }
        .pz-lbl { font-size: 11.5px; text-align: center; color: ${T.ink2}; line-height: 1.3; font-weight: 500; }
        .pz-step.on .pz-lbl { color: ${T.ink}; }
        .pz-arrow { align-self: center; margin-top: 18px; color: ${T.ink3}; font-size: 15px; flex: 0 0 auto; transition: color 0.3s; }
        .pz-arrow.on { color: ${T.success}; }
        /* Vertikal oqim (mobil) */
        .pz-flow-v { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
        .pz-rowstep { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; background: ${T.bg}; transition: background 0.3s; }
        .pz-rowstep.on { background: ${T.successSoft}; }
        .pz-rowstep.active { background: ${T.accentSoft}; }
        .pz-rowic { font-size: 22px; width: 28px; text-align: center; flex-shrink: 0; }
        .pz-rowtxt { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .pz-rowtxt b { font-size: 14px; color: ${T.ink2}; font-weight: 700; }
        .pz-rowstep.on .pz-rowtxt b { color: ${T.ink}; }
        .pz-varrow { align-self: center; color: ${T.ink3}; font-size: 15px; line-height: 1; transition: color 0.3s; }
        .pz-varrow.on { color: ${T.success}; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === CONN (bog'lanish) === */
        .conn-flow { display: flex; align-items: center; justify-content: center; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 20px 14px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .conn-node { display: flex; flex-direction: column; align-items: center; gap: 3px; flex-shrink: 0; transition: opacity 0.3s; }
        .conn-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .conn-sub { font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; text-align: center; }
        .conn-link { display: flex; align-items: center; gap: 3px; flex: 1; max-width: 140px; }
        .conn-line { flex: 1; height: 3px; background: ${T.success}; border-radius: 2px; transition: background 0.3s; }
        .conn-sig { font-size: 18px; }
        .conn-link.cut .conn-line { background: ${T.ink3}; opacity: 0.5; border-top: 2px dashed ${T.accent}; height: 0; }
        .conn-link.cut { animation: shake 0.3s; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

        /* === COND (shart) === */
        .cond-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .cond-line { font-family: 'Manrope'; font-size: clamp(13px,1.7vw,15px); color: ${T.ink2}; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; transition: all 0.3s; }
        .cond-line.on { background: ${T.successSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .cond-kw { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.blue}; font-size: 0.92em; }

        /* === LOOP (sikl) === */
        .loop-card { background: ${T.paper}; border-radius: 14px; padding: 16px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .loop-kw { margin: 0; }
        .loop-act { font-family: 'Manrope'; font-weight: 600; color: ${T.ink}; margin: 4px 0 0; padding-left: 14px; }

        /* === ALGO BUILD === */
        .algo-build { background: ${T.paper}; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .algo-line { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; background: ${T.bg}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }


        /* === REACT-1 DARS CSS === */
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        /* marketplace to'ri: 3x2, kartochkalar ~17% kichik (F-0819-08) */
        .mk-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 7px; }
        .mk-grid .vcard .vthumb { height: 62px; }
        .mk-grid .vcard .vthumb-em { font-size: 42px; }
        .mk-grid .vcard-b { padding: 5px 7px; gap: 4px; }
        .mk-grid .vcard-name { font-size: 10px; }
        .mk-grid .vcard-like { font-size: 9px; }
        @media (max-width: 420px) { .mk-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .vcard { border-radius: 10px; background: #fff; box-shadow: 0 4px 12px -4px rgba(0,0,0,0.14); overflow: hidden; border: 1px solid rgba(0,0,0,0.06); transition: transform 0.18s cubic-bezier(.34,1.2,.5,1), box-shadow 0.18s; }
        .vcard:hover { transform: translateY(-3px); box-shadow: 0 10px 20px -8px rgba(0,0,0,0.20); }
        @media (prefers-reduced-motion: reduce) { .vcard:hover { transform: none; } }
        .vthumb-em { font-size: 19px; }
        .vcard-b { padding: 7px 9px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .vcard-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink}; margin: 0; }
        .vcard-like { border: none; background: transparent; cursor: pointer; padding: 0; font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 400; color: ${T.ink3}; }
        .vcard-like.on { font-weight: 700; color: ${T.accent}; }
        .vcard-like > span { display: inline-block; }
        .vthumb { height: 42px; background: ${T.bg}; display: flex; align-items: center; justify-content: center; }
        /* VARIANT D: SkinCard strip'i baland, emoji katta (F-0819-33) */
        .vcard .vthumb { height: 66px; }
        .vcard .vthumb-em { font-size: 46px; }
        .vplay { width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,0.85); color: #333; font-size: 8px; display: flex; align-items: center; justify-content: center; }
        .likebtn { font-family: 'Manrope'; font-weight: 700; font-size: 13px; border: none; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 7px 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; box-shadow: 0 3px 8px -3px rgba(0,0,0,0.15); }
        .likebtn:hover { transform: translateY(-1px); }
        .likebtn.liked { background: ${T.accentSoft}; color: ${T.accent}; }
        @keyframes heart-pop { 0% { transform: scale(1); } 40% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .hpop { animation: heart-pop 0.4s ease; display: inline-block; }
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .reload-cover { position: absolute; inset: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; z-index: 2; }
        .spinner { width: 22px; height: 22px; border-radius: 50%; border: 3px solid rgba(167,166,162,0.4); border-top-color: ${T.accent}; animation: spin360 0.7s linear infinite; }
        .appbtn { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 14px; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all 0.18s; width: 100%; text-align: left; }
        .appbtn:hover { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .appbtn.seen { box-shadow: inset 0 0 0 1.5px ${T.success}, 0 4px 10px -5px rgba(${T.shadowBase},0.12); }
        .appbtn.active { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.25); }
        .applogo { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 15px; flex-shrink: 0; }
        .zone { cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; border-radius: 10px; position: relative; }
        .zone:not(.seen)::after { content: ''; position: absolute; inset: 0; border-radius: 10px; pointer-events: none; animation: zone-invite 2.2s ease-in-out infinite; }
        @keyframes zone-invite { 0%,100% { box-shadow: 0 0 0 1.5px rgba(255,79,40,0.28); } 50% { box-shadow: 0 0 0 3px rgba(255,79,40,0.70); } }
        .zone:hover:not(.seen) { transform: translateY(-1px); }
        .zone:hover:not(.seen)::after { animation: none; box-shadow: 0 0 0 3px ${T.accent}; }
        /* hover-yorlig'i: qaysi qism bosiladiganini aytadi (F-0819-15) */
        .zone:not(.seen):hover:not(:has(.zone:hover))::before { content: '✨ ' attr(data-hint); position: absolute; left: 50%; bottom: 100%; transform: translate(-50%,-7px); background: ${T.ink}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 9.5px; letter-spacing: 0.01em; padding: 3px 9px; border-radius: 6px; white-space: nowrap; z-index: 6; pointer-events: none; animation: zlbl-in 0.22s ease; }
        @media (prefers-reduced-motion: reduce) { .zone:not(.seen)::after { animation: none; box-shadow: 0 0 0 2px rgba(255,79,40,0.55); } }
        .zone.seen { box-shadow: 0 0 0 1.5px ${T.success}; }
        .zone.seen::after { display: none; }
        .zone.active { box-shadow: 0 0 0 2px ${T.accent}; animation: zone-pop 0.4s ease; }
        @keyframes zone-pop { 0% { transform: scale(1); } 35% { transform: scale(1.04); } 100% { transform: scale(1); } }
        /* ichma-ich zonada (qidiruv menyu ichida, like kartochka ichida) ikkala
           yorliq ham o'ng burchakka tushib ustma-ust qolardi (F-0819-30) */
        .zone .zone .zlbl { right: auto; left: -5px; }
        .zlbl { position: absolute; top: -9px; right: -5px; font-family: 'JetBrains Mono'; font-size: 9px; background: ${T.ink}; color: #fff; padding: 2px 7px; border-radius: 6px; z-index: 3; white-space: nowrap; animation: zlbl-in 0.38s cubic-bezier(.34,1.45,.5,1); }
        @keyframes zlbl-in { from { opacity: 0; transform: translateY(5px) scale(0.78); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes jflash { 0% { background: #fff; transform: scale(1); } 22% { background: ${T.accent}; color: #fff; transform: scale(0.88); } 60% { background: ${T.accentSoft}; } 100% { background: #fff; transform: scale(1); } }
        .jflash { animation: jflash 0.7s ease-out both; }
        @keyframes jpop { 0% { transform: scale(0.5); } 55% { transform: scale(1.16); } 100% { transform: scale(1); } }
        .jhot { animation: jpop 0.5s cubic-bezier(.34,1.45,.5,1); background: ${T.successSoft} !important; box-shadow: inset 0 0 0 2px ${T.success}; }
        /* natija-kartasi: raqam ekranning bosh qahramoni (F-0819-17) */
        .jr-card { display: flex; align-items: center; gap: clamp(9px,2vw,14px); border-radius: 12px; padding: clamp(10px,1.8vw,14px) clamp(12px,2vw,16px); animation: fade-step 0.35s; }
        .jr-bad { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.35); }
        .jr-good { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .jr-ic { font-size: 14px; line-height: 1; flex-shrink: 0; opacity: 0.75; }
        .jr-num { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(26px,3.6vw,34px); line-height: 1; flex-shrink: 0; animation: num-pop 0.42s cubic-bezier(.34,1.45,.5,1); }
        .jr-bad .jr-num { color: ${T.accent}; } .jr-good .jr-num { color: ${T.success}; }
        .jr-txt { display: flex; flex-direction: column; min-width: 0; }
        .jr-hd { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(11.5px,1.7vw,13px); color: ${T.ink}; line-height: 1.25; }
        .jr-sub { font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .jr-num { animation: none; } }
        .phone { width: clamp(210px,24vw,258px); background: #0E0E10; border-radius: 34px; padding: 7px; box-shadow: 0 18px 38px -12px rgba(${T.shadowBase},0.50), inset 0 0 0 1.5px #2c2c31; margin: 0 auto; }
        .phone-scr { background: #fff; border-radius: 28px; overflow: hidden; position: relative; min-height: 300px; display: flex; flex-direction: column; }
        /* status qatori + Dynamic Island (F-0819-25) */
        .phone-bar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 9px 15px 5px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 10px; color: ${T.ink}; flex-shrink: 0; transition: color 0.3s; }
        .phone-bar.on-dark { color: #fff; }
        .pb-island { position: absolute; left: 50%; top: 6px; transform: translateX(-50%); width: 58px; height: 17px; border-radius: 99px; background: #0E0E10; }
        .pb-right { display: flex; align-items: center; gap: 4px; }
        .pb-sig { display: inline-flex; align-items: flex-end; gap: 1.5px; height: 9px; }
        .pb-sig i { width: 2px; background: currentColor; border-radius: 1px; }
        .pb-sig i:nth-child(1) { height: 3px; } .pb-sig i:nth-child(2) { height: 5px; } .pb-sig i:nth-child(3) { height: 7px; } .pb-sig i:nth-child(4) { height: 9px; }
        .pb-net { font-size: 8.5px; letter-spacing: 0.02em; }
        .pb-bat { width: 17px; height: 9px; border-radius: 3px; border: 1.2px solid currentColor; padding: 1px; display: inline-flex; }
        .pb-bat-f { width: 92%; border-radius: 1.5px; background: currentColor; }
        .pb-batn { font-size: 8.5px; }
        /* ilova ichida havo bo'lsin */
        .phone-app { padding: 6px 14px 16px; flex: 1; }
        /* ochilish: qora ekran -> ikonka -> splash (F-0819-26) */
        .phone-boot { position: absolute; inset: 0; background: #0E0E10; border-radius: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
        .boot-ic { width: 46px; height: 46px; border-radius: 13px; background: linear-gradient(135deg,#8FBF6B,#3E7A33); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 8px 20px -6px rgba(62,122,51,0.7); animation: boot-in 0.55s cubic-bezier(.34,1.45,.5,1) both; transition: transform 0.5s cubic-bezier(.34,1.3,.5,1); }
        .boot-ic.big { transform: scale(1.22); }
        @keyframes boot-in { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        .boot-txt { display: flex; flex-direction: column; align-items: center; gap: 3px; animation: fade-step 0.45s both; }
        .boot-name { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: #fff; letter-spacing: 0.01em; }
        .boot-sub { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: #7FC96B; letter-spacing: 0.04em; }
        @media (prefers-reduced-motion: reduce) { .boot-ic { animation: none; transition: none; } }

        /* === IJTIMOIY POST (LikeDemo) === */
        /* like natijasi ochiq aytiladi (F-0819-20) */
        .lk-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; border-radius: 999px; padding: 5px 12px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; animation: fade-step 0.32s; }
        .lk-badge.bad { background: ${T.accentSoft}; color: ${T.accent}; }
        .lk-badge.good { background: ${T.successSoft}; color: ${T.success}; }
        /* yakuniy taqqoslash (F-0819-21) */
        .cmp-wrap { display: flex; flex-direction: column; gap: 10px; }
        .cmp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .cmp-hd { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.09em; text-transform: uppercase; padding: 0 4px 2px; }
        .cmp-hd.bad { color: ${T.ink3}; } .cmp-hd.good { color: ${T.accent}; }
        .cmp-cell { display: flex; align-items: center; gap: 8px; border-radius: 10px; padding: 9px 11px; font-family: 'Manrope', sans-serif; font-size: 12.5px; line-height: 1.3; }
        .cmp-cell.bad { background: ${T.bg}; color: ${T.ink3}; }
        .cmp-cell.good { background: ${T.successSoft}; color: ${T.ink}; font-weight: 600; }
        @media (max-width: 520px) { .cmp-grid { grid-template-columns: 1fr; } .cmp-hd.good { margin-top: 6px; } }
        .post { display: flex; flex-direction: column; }
        .post-head { display: flex; align-items: center; gap: 9px; padding: 1px 1px 9px; }
        .post-ava { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; background: linear-gradient(135deg,#8FBF6B,#3E7A33); box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px ${T.accent}; }
        .post-meta { display: flex; flex-direction: column; line-height: 1.25; flex: 1; min-width: 0; }
        .post-user { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; display: flex; align-items: center; gap: 4px; }
        .post-verif { width: 13px; height: 13px; background: ${T.blue}; color: #fff; border-radius: 50%; font-size: 8px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .post-time { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink3}; }
        .post-more { color: ${T.ink3}; font-weight: 700; letter-spacing: 1px; align-self: flex-start; }
        .post-actions { display: flex; align-items: center; gap: 13px; padding: 9px 1px 5px; color: ${T.ink2}; }
        .post-like { border: none; background: transparent; cursor: pointer; padding: 0; font-size: 22px; line-height: 1; color: ${T.ink2}; transition: color 0.15s, transform 0.15s; }
        .post-like:hover { transform: scale(1.12); }
        /* bosish-ishorasi: yurakcha bosilmaguncha sekin urib turadi (F-0819-02) */
        @keyframes like-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        .post-like:not(.tapped) > span { display: inline-block; animation: like-beat 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .post-like > span { animation: none; } }
        .post-like.on { color: ${T.accent}; }
        .post-ic { color: ${T.ink2}; cursor: default; }
        .post-likes { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; padding: 0 1px; }
        .post-cap { font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink2}; padding: 4px 1px 0; line-height: 1.4; } .post-cap b { color: ${T.ink}; font-weight: 700; }

        /* === MINECRAFT SKRINSHOT (CSS piksel qasr) === */
        .mc-shot { position: relative; height: 148px; border-radius: 10px; overflow: hidden; background: linear-gradient(#a3d5f7 0%, #c8e9fb 55%, #e4f4fd 100%); }
        .mc-sun { position: absolute; top: 14px; right: 18px; width: 22px; height: 22px; background: #FFD25A; border-radius: 5px; box-shadow: 0 0 0 5px rgba(255,210,90,0.28); }
        .mc-cloud { position: absolute; height: 9px; background: rgba(255,255,255,0.92); border-radius: 99px; }
        .mc-cloud.m1 { top: 24px; left: 20px; width: 42px; box-shadow: 11px -7px 0 -2px rgba(255,255,255,0.92); }
        .mc-cloud.m2 { top: 50px; left: 78px; width: 28px; }
        .mc-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 32px; background: #7a5230; }
        .mc-ground::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 11px; background: #5fa544; box-shadow: inset 0 -3px 0 rgba(0,0,0,0.12); }
        .mc-castle { position: absolute; bottom: 27px; left: 50%; transform: translateX(-50%); display: flex; align-items: flex-end; }
        .mc-tower { width: 21px; height: 48px; background: #9ba1a7; position: relative; box-shadow: inset -4px 0 0 rgba(0,0,0,0.14), inset 5px 0 0 rgba(255,255,255,0.16); }
        .mc-tower::before { content: ''; position: absolute; top: -6px; left: -1px; right: -1px; height: 6px; background: repeating-linear-gradient(90deg, #9ba1a7 0 6px, transparent 6px 12px); }
        .mc-keep { width: 40px; height: 64px; background: #aeb4ba; position: relative; margin: 0 -3px; z-index: 1; box-shadow: inset -5px 0 0 rgba(0,0,0,0.12), inset 5px 0 0 rgba(255,255,255,0.18); }
        .mc-keep::before { content: ''; position: absolute; top: -7px; left: -1px; right: -1px; height: 7px; background: repeating-linear-gradient(90deg, #aeb4ba 0 7px, transparent 7px 14px); }
        .mc-keep::after { content: ''; position: absolute; top: 13px; left: 50%; transform: translateX(-50%); width: 7px; height: 9px; background: #3a4a63; border-radius: 2px; box-shadow: -12px 0 0 #3a4a63, 12px 0 0 #3a4a63; }
        .mc-door { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 15px; height: 21px; background: #4a3526; border-radius: 8px 8px 0 0; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.2); }
        .mc-flag { position: absolute; top: -22px; left: 50%; width: 2px; height: 16px; background: #6b6b70; }
        .mc-flag::after { content: ''; position: absolute; top: 0; left: 2px; border-left: 13px solid ${T.accent}; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }

        /* === SKIN MARKET (React Native ekrani) === */
        .shop { font-family: 'Manrope', sans-serif; }
        .shop-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
        .shop-top-r { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
        /* bitta hisoblagich — ikkala platformada bir xil holat (F-0819-23) */
        .shop-like { border: none; background: transparent; cursor: pointer; padding: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; gap: 3px; transition: color 0.15s; }
        .shop-like > span { display: inline-block; font-size: 14px; line-height: 1; }
        .shop-like.on { color: ${T.accent}; }
        .shop-c .shop-like { font-size: 12.5px; } .shop-c .shop-like > span { font-size: 15px; }
        .rn-proof.rn-proof { font-family: 'Manrope', sans-serif; font-size: 12px; line-height: 1.4; color: ${T.ink2}; background: ${T.successSoft}; border-radius: 10px; padding: 8px 12px; margin: 0; } .rn-proof.rn-proof b { color: ${T.ink}; }
        .rn-apps { display: flex; flex-direction: column; gap: 6px; }
        .rn-apps-l { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; }
        .rn-apps-row { display: flex; gap: 7px; flex-wrap: wrap; }
        .rn-app { display: inline-flex; align-items: center; gap: 5px; background: #fff; border-radius: 999px; padding: 6px 12px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink}; box-shadow: 0 3px 9px -4px rgba(${T.shadowBase},0.20); border: 1px solid rgba(0,0,0,0.05); }
        .shop-logo { font-weight: 800; font-size: 12.5px; color: ${T.ink}; }
        .shop-cart { position: relative; font-size: 14px; }
        .shop-badge { position: absolute; top: -5px; right: -8px; background: ${T.accent}; color: #fff; font-size: 8px; font-weight: 700; min-width: 13px; height: 13px; border-radius: 99px; display: flex; align-items: center; justify-content: center; padding: 0 2px; }
        .shop-search { background: ${T.bg}; border-radius: 8px; padding: 6px 10px; font-size: 10.5px; color: ${T.ink3}; margin-bottom: 9px; }
        .shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .shop-card { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px -4px rgba(${T.shadowBase},0.16); }
        .shop-thumb { height: 46px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .shop-cap { padding: 6px 8px; }
        .shop-name { font-weight: 700; font-size: 11px; color: ${T.ink}; display: block; }
        .shop-buy { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; gap: 4px; }
        .shop-price { font-family: 'JetBrains Mono'; font-size: 9.5px; font-weight: 600; color: ${T.ink2}; }
        .shop-add { width: 18px; height: 18px; border-radius: 6px; background: ${T.accent}; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; line-height: 1; flex-shrink: 0; }
        .shop-c .shop-thumb { height: 50px; font-size: 23px; } .shop-c .shop-name { font-size: 11px; } .shop-c .shop-grid { gap: 11px; } .shop-c .shop-logo { font-size: 12.5px; }
        .shop-c .shop-top { margin-bottom: 11px; }
        .shop-c .shop-search { padding: 9px 12px; font-size: 11.5px; margin-bottom: 12px; border-radius: 10px; }
        .shop-c .shop-cap { padding: 8px 9px; }
        .shop-c .shop-card { box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.18); border-radius: 12px; }

        /* === VIRTUAL DOM oqimi === */
        .vdom-vs { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 32px; height: 32px; border-radius: 50%; background: #fff; box-shadow: 0 6px 16px -4px rgba(${T.shadowBase},0.32); display: flex; align-items: center; justify-content: center; font-size: 15px; z-index: 2; animation: vs-pop 0.4s cubic-bezier(.34,1.45,.5,1); }
        @keyframes vs-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.4); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes vdom-pulse { 0%,100% { box-shadow: inset 0 0 0 1px ${T.accent}; } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 10px -2px rgba(255,79,40,0.6); } }
        .vdom-hot { animation: vdom-pulse 0.8s ease-in-out infinite; }
        /* yagona farqni ochiq ko'rsatish (F-0819-18) */
        .vdiff { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 11px; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.38); margin-top: 8px; }
        .vdiff-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .vdiff-old { font-size: 12px; color: ${T.ink3}; text-decoration: line-through; }
        .vdiff-arw { color: ${T.ink3}; font-weight: 700; }
        .vdiff-new { font-size: 12.5px; font-weight: 700; color: ${T.success}; }
        .vdom-flow { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; text-align: center; padding: 3px 0; transition: color 0.3s; }
        .vdom-flow.on { color: ${T.success}; animation: fade-step 0.3s; }

        /* === TARTIB OQIMI (yakuniy) === */
        .flow-arrow { text-align: center; color: ${T.ink3}; font-size: 13px; line-height: 1; margin: -3px 0; animation: fade-step 0.3s; transition: color 0.3s; }
        .flow-arrow.on { color: ${T.success}; }
        @keyframes line-win { 0% { background: ${T.bg}; transform: translateX(0); } 45% { background: ${T.successSoft}; transform: translateX(5px); } 100% { background: ${T.successSoft}; transform: translateX(0); } }
        .algo-line.line-win { background: ${T.successSoft}; animation: line-win 0.5s ease both; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === 🧲 DRAG-DROP ORDER (reusable) === */
        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
        /* ikki ustun: chapda bo'laklar, o'ngda tartib — bir ustunli zinapoya o'rniga (F-0819-27) */
        .dd-wrap { display: grid; grid-template-columns: minmax(0,0.92fr) minmax(0,1.08fr); gap: clamp(12px,2.2vw,22px); align-items: start; }
        .dd-col { min-width: 0; }
        .dd-lbl { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.09em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 7px; }
        .dd-wrap .dd-pool { flex-direction: column; gap: 8px; }
        .dd-wrap .dd-pool .dd-chip { width: 100%; text-align: left; }
        @media (max-width: 700px) { .dd-wrap { grid-template-columns: 1fr; } .dd-wrap .dd-pool { flex-direction: row; flex-wrap: wrap; } .dd-wrap .dd-pool .dd-chip { width: auto; } }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 10px; min-height: 50px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-slots { position: relative; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11.5px,1.5vw,13.5px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 10px 13px; line-height: 1.3; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }

        /* === 🐞 DEBUG CHALLENGE (reusable) === */
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.8vw,15px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: #E24848; background: rgba(226,72,72,0.16); animation: dd-shake .4s; }
        .dbg-line.fixed { border-color: ${T.success}; background: rgba(18,169,104,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.success}; background: rgba(18,169,104,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        /* tarkib past tushmasin — Mentor'dan keyin darrov boshlansin (F-0819-28) */
        .fc-center.fc-top { align-items: flex-start; padding-top: 0; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; min-height: 48px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 ACHIEVEMENTS — to'liq-ekran nishon bayrami === */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        .acu-stage { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,3vw,22px); animation: acu-bg-in 0.3s ease-out; }
        .acu-medal-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
        .acu-medal { position: relative; width: clamp(112px,26vw,152px); height: clamp(112px,26vw,152px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(54px,13vw,74px); overflow: hidden;
          background: radial-gradient(circle at 38% 30%, #FFF0BE 0%, #FFD35A 42%, #F5A623 72%, #E4870C 100%);
          box-shadow: 0 0 70px 12px rgba(255,201,77,0.55), 0 22px 54px -12px rgba(0,0,0,0.55), inset 0 -9px 18px rgba(140,70,0,0.28), inset 0 7px 14px rgba(255,255,255,0.6);
          animation: acu-medal-pop 0.7s cubic-bezier(.28,1.5,.4,1) both, acu-float 2.6s ease-in-out 0.7s infinite; }
        @keyframes acu-medal-pop { 0% { transform: scale(0) rotate(-40deg); } 55% { transform: scale(1.18) rotate(10deg); } 75% { transform: scale(0.94) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes acu-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .acu-shine { position: absolute; top: 0; bottom: 0; left: -70%; width: 45%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent); transform: skewX(-18deg); animation: acu-shine-sweep 1.1s ease 0.5s 2; }
        @keyframes acu-shine-sweep { to { left: 130%; } }
        .acu-spark { position: absolute; top: 50%; left: 50%; font-size: clamp(14px,2.6vw,20px); color: #FFE9A8; text-shadow: 0 0 8px rgba(255,201,77,0.9); pointer-events: none; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; animation: acu-spark-burst 1s ease-out both; }
        @keyframes acu-spark-burst { 0% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(clamp(-130px,-24vw,-96px)) scale(1); opacity: 0; } }
        .acu-txt { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
        .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
        .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }

        /* === kod chip (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        /* ===================== JONLI DARS CSS (InternetLesson bilan bir xil) ===================== */
        /* Jonli tasma dars ustida osilib turadi — xira, ustiga borilganda yonadi (F-0819-35).
           Manba naqsh 81 ta darsda bor edi, 3-Modul React darslariga yetib bormagan.
           Naqshdagi ikki karra opacity e'loni bu yerda bitta qoidaga yig'ildi. */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        /* Konfetti */
        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          55% { transform: translateY(48vh) translateX(22px) rotate(320deg); }
          100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        /* .ready — to'ldirilgan holat: kontur bazasi accent matn ishlatadi, shuning uchun
           fon accentga o'tganda matn OQga o'tishi shart (aks holda accent-ustida-accent). */
        .mstats-reveal.ready { background: ${T.accent}; color: #fff; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(1,154,203,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) — proyektorga katta shrift === */
        .rc-overlay { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
        .rc-head { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .rc-tag { font-weight: 800; font-size: clamp(11px,1.4vw,13px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
        .rc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.4vw,22px); color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rc-x { background: ${T.paper}; border: none; border-radius: 10px; width: 36px; height: 36px; font-size: 15px; color: ${T.ink2}; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .rc-x:hover { color: ${T.accent}; }
        .rc-card { flex: 1; width: 100%; max-width: 880px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: clamp(10px,2.2vw,20px); padding: clamp(16px,3vw,28px) 0; animation: fade-step 0.35s ease-out; }
        .rc-ic { font-size: clamp(44px,8vw,76px); line-height: 1; }
        .rc-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4.6vw,44px); color: ${T.ink}; line-height: 1.12; max-width: 800px; margin: 0; }
        .rc-body { font-size: clamp(15px,2.4vw,21px); line-height: 1.55; color: ${T.ink2}; max-width: 720px; margin: 0; }
        .rc-body b { color: ${T.ink}; }
        .rc-vis { margin-top: clamp(4px,1vw,10px); display: flex; justify-content: center; width: 100%; }
        .rc-flow { display: flex; align-items: center; justify-content: center; gap: clamp(6px,1.4vw,12px); flex-wrap: wrap; }
        .rc-chip { font-weight: 700; font-size: clamp(13px,2vw,18px); background: ${T.paper}; color: ${T.ink}; border-radius: 12px; padding: clamp(8px,1.4vw,13px) clamp(12px,2vw,18px); box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); white-space: nowrap; }
        .rc-arr { font-size: clamp(15px,2.2vw,22px); color: ${T.accent}; font-weight: 800; }
        .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
        .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
        .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: #E03E1B; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === ⚔️ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
        .qz-sub b { color: #F2ECFF; }
        .qz-dimtxt { color: #8C86A8; font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(186,140,255,0.34); color: #F2ECFF; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; box-shadow: 0 0 18px rgba(124,58,237,0.2); animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(255,79,40,0.45); }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(255,79,40,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
        .qz-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .qz-btn:disabled { opacity: 0.5; cursor: default; }
        .qz-btn.big { font-size: clamp(16px,2.2vw,19px); padding: clamp(15px,2vw,18px) clamp(32px,4vw,46px); }
        .qz-btn.ghost { background: linear-gradient(170deg,#7C3AED,#5B21B6); color: #F2ECFF; border: 1px solid rgba(186,140,255,0.5); box-shadow: 0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
        .qz-btn.ghost:hover:not(:disabled) { box-shadow: 0 0 34px rgba(140,72,255,0.6), inset 0 1px 0 rgba(255,255,255,0.2); }
        .qz-waitmsg { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #3CE88E; text-align: center; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-qview { max-width: 880px; }
        .qz-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .qz-count { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: #B9A8E6; }
        .qz-count b { color: #F2ECFF; font-size: 1.25em; }
        .qz-ansn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: #FF7A4D; min-width: 64px; text-align: right; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
        .qz-timer { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .qz-timer-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .qz-timer.urgent { animation: qz-shake 0.5s ease-in-out infinite; }
        @keyframes qz-shake { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #F2ECFF; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.34); border-radius: 20px; padding: clamp(18px,2.8vw,28px) clamp(18px,3vw,30px); width: 100%; box-shadow: 0 0 34px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.06); backdrop-filter: blur(8px); text-wrap: balance; }
        .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(11px,1.6vw,15px); width: 100%; }
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } .qz-wm { font-size: clamp(24px,7vw,34px); } }
        .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
        .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
        .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
        .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
        .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); box-shadow: 0 18px 34px -12px rgba(0,0,0,0.6), 0 0 40px -2px rgba(var(--gl),0.6), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -4px 0 rgba(0,0,0,0.24), inset 0 0 0 1.5px rgba(0,0,0,0.26); }
        .qz-tile:active:not(:disabled):not(.rv) { transform: translateY(2px) scale(0.985); }
        .qz-tile:disabled { cursor: default; }
        .qz-shape { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.22); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: clamp(16px,2.2vw,20px); color: #fff; flex-shrink: 0; }
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
        .qz-tile.faded { filter: saturate(0.5); opacity: 0.4; }
        .qz-tile.picked { outline: 3px solid #fff; box-shadow: 0 0 0 4px rgba(255,255,255,0.4), 0 14px 26px -12px rgba(0,0,0,0.4); animation: qz-pop 0.3s; }
        .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 27px; height: 27px; border-radius: 50%; background: #fff; color: #12A968; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px rgba(0,0,0,0.28); }
        .qz-tile.rv.win { outline: 4px solid #fff; box-shadow: 0 0 0 5px rgba(43,217,124,0.45), 0 0 60px rgba(43,217,124,0.7), 0 14px 30px -12px rgba(0,0,0,0.5); animation: qz-pop 0.4s; }
        .qz-tile.rv.lose { filter: saturate(0.45); opacity: 0.4; }
        .qz-cnt { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.2vw,19px); color: #fff; background: rgba(0,0,0,0.22); border-radius: 99px; padding: 4px 13px; flex-shrink: 0; margin-left: auto; font-variant-numeric: tabular-nums; }
        .qz-mrow { display: flex; align-items: center; gap: 14px; }
        .qz-allin { font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); animation: qz-pop 0.4s; }
        .qz-res { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: center; border-radius: 16px; padding: 14px 26px; animation: qz-pop 0.45s cubic-bezier(.34,1.5,.4,1); }
        .qz-res.good { background: rgba(43,217,124,0.15); outline: 1.5px solid rgba(43,217,124,0.5); box-shadow: 0 0 30px rgba(43,217,124,0.28); }
        .qz-res.bad { background: rgba(255,90,90,0.14); outline: 1.5px solid rgba(255,90,90,0.42); box-shadow: 0 0 30px rgba(255,90,90,0.22); }
        .qz-res-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,4.4vw,40px); color: #3CE88E; line-height: 1; text-shadow: 0 0 20px rgba(60,232,142,0.45); font-variant-numeric: tabular-nums; }
        .qz-res-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #F2ECFF; }
        .qz-res-rank { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: #B9A8E6; width: 100%; text-align: center; }
        .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.32); border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 0 32px rgba(124,58,237,0.25); backdrop-filter: blur(8px); }
        .qz-board.wide { max-width: 640px; max-height: 260px; overflow: auto; }
        .qz-board-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.1em; color: #FF7A4D; margin-bottom: 3px; text-transform: uppercase; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
        .qz-brow { display: flex; align-items: center; gap: 10px; padding: 8px 11px; border-radius: 11px; background: rgba(255,255,255,0.05); }
        .qz-brow.me { background: linear-gradient(90deg,rgba(43,217,124,0.26),rgba(43,217,124,0.06)); outline: 1.5px solid rgba(43,217,124,0.55); }
        .qz-brank { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: #F2ECFF; background: rgba(255,255,255,0.18); border-radius: 8px; min-width: 23px; height: 23px; display: flex; align-items: center; justify-content: center; }
        .qz-brow:first-of-type .qz-brank { background: #FFCE3D; color: #1B0F3F; box-shadow: 0 0 14px rgba(255,206,61,0.5); }
        .qz-brow.me .qz-brank { background: #2BD97C; color: #0B2417; }
        .qz-bname { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #F2ECFF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-bstreak { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FF9A5D; }
        .qz-bok { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: #B9A8E6; }
        .qz-bpts { font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: #FF7A4D; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums; text-shadow: 0 0 10px rgba(255,90,44,0.35); }
        .qz-pod { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2.4vw,24px); padding-top: 18px; }
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
        .qz-crown { position: absolute; top: -30px; font-size: 28px; animation: qz-float-sm 2s ease-in-out infinite; }
        @keyframes qz-float-sm { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(4deg); } }
        .qz-pod-medal { font-size: clamp(30px,5vw,46px); line-height: 1; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.4)); }
        .qz-pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,2vw,18px); color: #F2ECFF; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-pod-pts { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.5vw,13px); color: #B9A8E6; font-variant-numeric: tabular-nums; }
        .qz-pod-bar { width: 100%; border-radius: 14px 14px 0 0; box-shadow: inset 0 2px 0 rgba(255,255,255,0.45); animation: qz-rise 0.9s cubic-bezier(.3,1.2,.4,1); transform-origin: bottom; }
        @keyframes qz-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .qz-pod-col.p1 .qz-pod-bar { height: clamp(96px,14vw,156px); background: linear-gradient(180deg, #FFDE6B, #F5A623); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 54px rgba(245,166,35,0.55); }
        .qz-pod-col.p2 .qz-pod-bar { height: clamp(66px,10vw,110px); background: linear-gradient(180deg, #E4E7EE, #A2A8B4); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 30px rgba(214,217,224,0.35); }
        .qz-pod-col.p3 .qz-pod-bar { height: clamp(48px,7vw,82px); background: linear-gradient(180deg, #F4C08F, #CB8149); box-shadow: inset 0 2px 0 rgba(255,255,255,0.4), 0 0 30px rgba(237,177,131,0.35); }
        .qz-pod-col.me .qz-pod-name { color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: #B9A8E6; }
        .qz-mypl b { color: #3CE88E; }
        .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FF7A4D; text-shadow: 0 0 40px rgba(255,90,44,0.55); font-variant-numeric: tabular-nums; }
        .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(27,15,63,0.86); border: 1px solid rgba(186,140,255,0.4); border-radius: 16px; padding: 10px 16px; color: #F2ECFF; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; box-shadow: 0 0 34px rgba(124,58,237,0.35); backdrop-filter: blur(10px); }

        /* === 🏆 PODIUM / STATISTIKA SAHIFASI === */
        .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
        .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
        .pod-qstats { display: flex; flex-direction: column; gap: 8px; }
        .qstat-row { display: flex; align-items: center; gap: 10px; }
        .qstat-lbl { min-width: clamp(120px,22vw,190px); font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .qstat-n { min-width: 40px; text-align: right; font-size: 12px; color: ${T.ink2}; }
        .pm-pop { animation: pmPop 0.5s cubic-bezier(.34,1.55,.5,1); }
        @keyframes pmPop { 0% { transform: scale(0.9); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        .pm-match { animation: pmMatch 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes pmMatch { 0% { transform: scale(1); } 35% { transform: scale(1.06); box-shadow: 0 0 0 5px rgba(31,122,77,0.16); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(31,122,77,0); } }
        .pm-shake { animation: shake 0.4s ease; }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === 🔴 JONLI EFIR (LiveFrame / hearts / countdown) — puls·uchish·zarb ✨ Animatsiyaga, rang 🎨 Dizaynga === */
        .lb-frame { border-radius: 15px; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.28); transition: box-shadow 0.3s, transform 0.3s; }
        /* efirda kadr "yozib olinyapti" — nur-hoshiya nafas ritmida (✨ Animatsiya, rang 🎨 Dizayndan) */
        .lb-frame.on { box-shadow: 0 0 0 2px ${T.accent}33, 0 16px 40px -14px rgba(255,79,40,0.4); animation: lb-rec-breathe 2.8s ease-in-out infinite; }
        @keyframes lb-rec-breathe { 0%,100% { box-shadow: 0 0 0 2px ${T.accent}33, 0 16px 40px -14px rgba(255,79,40,0.4); } 50% { box-shadow: 0 0 0 3px ${T.accent}55, 0 20px 48px -12px rgba(255,79,40,0.6); } }
        .lb-bar { display: flex; align-items: center; justify-content: space-between; padding: 7px 11px; background: ${T.ink}; }
        .lb-frame.off .lb-bar { background: #2A2A30; }
        .lb-onair { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; color: #fff; background: ${T.accent}; border-radius: 99px; padding: 3px 10px; }
        .lb-onair.dim { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.6); }
        .lb-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; display: inline-block; animation: lb-pulse 1.1s ease-in-out infinite; }
        .lb-onair.dim .lb-dot { animation: none; opacity: 0.5; }
        @keyframes lb-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.55); opacity: 0.5; } }
        .lb-viewers { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: #fff; }
        .lb-viewers b { font-variant-numeric: tabular-nums; }
        /* ko'ruvchi-soni almashganda mikro-puls (raqam "tirik" his qilinadi) */
        .lb-tick { display: inline-block; animation: lb-tick 0.42s cubic-bezier(.3,1.4,.4,1); }
        @keyframes lb-tick { 0% { transform: translateY(-3px) scale(1.22); opacity: 0.35; } 100% { transform: none; opacity: 1; } }
        .lb-eye { font-size: 13px; }
        .lb-stage { position: relative; overflow: hidden; }
        .lb-hearts { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 3; }
        .lb-heart { position: absolute; bottom: 12px; font-size: 20px; pointer-events: none; will-change: transform, opacity; animation: lb-rise 1.3s cubic-bezier(.3,.7,.4,1) forwards; }
        @keyframes lb-rise { 0% { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; } 18% { opacity: 1; } 100% { transform: translateY(-118px) translateX(var(--dx,0)) scale(1.15); opacity: 0; } }
        .lb-count-big { font-family: 'Fraunces', serif; font-size: clamp(26px,4vw,34px); line-height: 1; color: ${T.accent}; display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
        .chip.lb-golive { color: ${T.accent}; }
        .chip.lb-golive.chip-on { background: ${T.accent}; color: #fff; }
        .btn.lb-golive { background: ${T.accent}; color: #fff; }
        .lb-timer.frame { position: relative; }
        .lb-cd { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; }
        .lb-cd-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.14em; color: ${T.accent}; }
        .lb-cd-n { font-family: 'Fraunces', serif; font-size: 52px; line-height: 1; color: ${T.ink}; animation: lb-cd-pop 0.9s cubic-bezier(.3,1.4,.4,1); }
        @keyframes lb-cd-pop { 0% { transform: scale(0.4); opacity: 0; } 45% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lb-dot, .lb-heart, .lb-cd-n, .lb-tick { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; } .lb-frame.on { animation: none !important; } }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        /* tarkib past tushmasin — Mentor'dan keyin darrov boshlansin (F-0819-28) */
        .fc-center.fc-top { align-items: flex-start; padding-top: 0; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; min-height: 48px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 ACHIEVEMENTS === */
        /* ===== 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI ===== */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        .acu-stage { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,3vw,22px); animation: acu-bg-in 0.3s ease-out; }
        .acu-medal-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
        .acu-medal { position: relative; width: clamp(112px,26vw,152px); height: clamp(112px,26vw,152px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(54px,13vw,74px); overflow: hidden;
          background: radial-gradient(circle at 38% 30%, #FFF0BE 0%, #FFD35A 42%, #F5A623 72%, #E4870C 100%);
          box-shadow: 0 0 70px 12px rgba(255,201,77,0.55), 0 22px 54px -12px rgba(0,0,0,0.55), inset 0 -9px 18px rgba(140,70,0,0.28), inset 0 7px 14px rgba(255,255,255,0.6);
          animation: acu-medal-pop 0.7s cubic-bezier(.28,1.5,.4,1) both, acu-float 2.6s ease-in-out 0.7s infinite; }
        @keyframes acu-medal-pop { 0% { transform: scale(0) rotate(-40deg); } 55% { transform: scale(1.18) rotate(10deg); } 75% { transform: scale(0.94) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes acu-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .acu-shine { position: absolute; top: 0; bottom: 0; left: -70%; width: 45%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent); transform: skewX(-18deg); animation: acu-shine-sweep 1.1s ease 0.5s 2; }
        @keyframes acu-shine-sweep { to { left: 130%; } }
        .acu-spark { position: absolute; top: 50%; left: 50%; font-size: clamp(14px,2.6vw,20px); color: #FFE9A8; text-shadow: 0 0 8px rgba(255,201,77,0.9); pointer-events: none; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; animation: acu-spark-burst 1s ease-out both; }
        @keyframes acu-spark-burst { 0% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(clamp(-130px,-24vw,-96px)) scale(1); opacity: 0; } }
        .acu-txt { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
        .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
        .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        /* Neon yonish-sekvensi: sahifa ochilganda vivyeska lip-lip etib yonadi */
        @keyframes cs-ignite {
          0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; }
          32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; }
          38% { opacity: 1; filter: none; }
          44% { opacity: .38; filter: saturate(.4) brightness(.65); }
          51% { opacity: 1; filter: none; }
          57% { opacity: .55; filter: saturate(.5) brightness(.75); }
          66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe {
          0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); }
          50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }

        /* Kontur bo'ylab yuguruvchi tok-chizig'i */
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }

        /* Dars-DNK: suzuvchi tokenlar + tezlik-chiziqlar + yashin-flash */
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; user-select: none;
          color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4);
          animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
        .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
        @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
        .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
        @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
        .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
        @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }

        /* Yon chaqmoqlar + hover-uchqunlar */
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
        /* Chaqmoqlar TIK turadi (aks/burilish yo'q) va TEZLIK RAMZIday chaqib turadi: yarq-yarq razryad + mikro-silkinish, navbatma-navbat */
        .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
        .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
        @keyframes cs-bolt-strike {
          0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); }
          5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); }
          9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); }
          13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); }
          20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }

        /* Wordmark: oq→siyohrang neon, qiya-sport uslub */
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic;
          font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em;
          background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none;
          background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow {
          0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); }
          50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }

        /* HUD-chiziq: turnir-tablo uslubidagi neon-pilyulalar */
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }

        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }

        /* Holatlar: xira kutish · jonli LIVE · bosish-portal */
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none;
          background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%);
          animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={tr2({ uz: "React darsi", ru: "Урок React" })} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
            </>}
        </div>
      </LiveGateCtx.Provider>
      </AchMissCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>;
}
export {
  ReactIntroLesson as default
};
