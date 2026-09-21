// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/4-Modull/ApiPostmanLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/4-Modull/ApiPostmanLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/4-Modull/ApiPostmanLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useRef as useRef3, createContext as createContext2, useContext as useContext2, useCallback as useCallback2, useMemo } from "react";

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

// src/4-Modull/ApiPostmanLesson.jsx
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
  danger: "#C2362B",
  line: "#E9E6DF",
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var METHODS = { GET: T.success, POST: T.accent, PUT: T.blue, DELETE: T.danger };
var STAT = { 200: ["200 OK", T.success], 201: ["201 Created", T.success], 404: ["404 Not Found", T.danger], 400: ["400 Bad Request", "#7C5CBF"] };
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var AchMissCtx = createContext2(null);
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
var __lang = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var getAudioEngine = () => null;
var useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {
}, replay: () => {
}, toggleMute: () => {
} });
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
var LESSON_META = { lessonId: "api-postman-04-06-v18", lessonTitle: { uz: "API va Postman — front backend bilan qanday gaplashadi", ru: "API и Postman — как фронт говорит с бэком" } };
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
  { id: "s11", type: "case", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s13", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s14", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "practice", type: "practice", template: "custom", scored: false, scope: null },
  { id: "podium", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
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
var NavNext = ({ disabled, label = { uz: "Davom etish", ru: "Продолжить" }, onClick, optionalLive }) => {
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2(label)}</button>;
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
var INLINE_KEYS = { s4: 2, s5b: 0, s9: 3, s12: 1, s15: 0, practice: -1 };
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var RECAPS = {
  4: {
    title: { uz: "API — ikki dastur gaplashadigan til", ru: "API — язык общения двух программ" },
    cards: [
      { ic: "📮", h: { uz: "API = pochta tizimi", ru: "API = почтовая система" }, body: { uz: <>Sayt bazani <b>ko'rmaydi</b> — u <b>API</b> orqali serverga so'rov yuboradi. API — til va qoidalar to'plami.</>, ru: <>Сайт <b>не видит</b> базу — он отправляет запрос серверу <b>через API</b>. API — это язык и набор правил.</> } },
      { ic: "✉️", h: { uz: "So'rov = konvert", ru: "Запрос = конверт" }, body: { uz: <>Har so'rov: <b>METHOD</b> (niyat) + <b>URL</b> (manzil) + ba'zan <b>BODY</b> (ichi). Server javob-konvert qaytaradi.</>, ru: <>Каждый запрос: <b>METHOD</b> (намерение) + <b>URL</b> (адрес) + иногда <b>BODY</b> (содержимое). Сервер возвращает конверт-ответ.</> } },
      { ic: "🔁", h: { uz: "So'rov → javob", ru: "Запрос → ответ" }, body: { uz: <>Sayt → API → server → baza, keyin javob shu yo'l bilan ortga qaytadi.</>, ru: <>Сайт → API → сервер → база, потом ответ возвращается тем же путём.</> }, ask: { uz: "Sayt bazaga to'g'ridan-to'g'ri kira oladimi?", ru: "Может ли сайт попасть в базу напрямую?" } }
    ]
  },
  6: {
    title: { uz: "GET — ma'lumotni o'qib olish", ru: "GET — чтение данных" },
    cards: [
      { ic: "📥", h: { uz: "GET = «o'qib ol»", ru: "GET = «прочитай»" }, body: { uz: <><b>GET</b> serverdan ma'lumotni <b>oladi</b>, hech narsani o'zgartirmaydi. Bazadagi <span className="mono">SELECT</span> bilan bir xil.</>, ru: <><b>GET</b> <b>получает</b> данные с сервера и ничего не меняет. То же самое, что <span className="mono">SELECT</span> в базе.</> } },
      { ic: "🟢", h: "200 OK", body: { uz: <>Muvaffaqiyatli GET javobi — <b>200 OK</b> shtampi + JSON ma'lumot.</>, ru: <>Успешный ответ GET — штамп <b>200 OK</b> + данные в JSON.</> } },
      { ic: "🚫", h: { uz: "BODY yo'q", ru: "BODY нет" }, body: { uz: <>GET'da <b>BODY bo'lmaydi</b> — faqat manzil (URL). Qo'shish/o'zgartirishda BODY kerak.</>, ru: <>У GET <b>нет BODY</b> — только адрес (URL). BODY нужен при добавлении и изменении.</> }, ask: { uz: "GET yangi ma'lumot qo'sha oladimi?", ru: "Может ли GET добавить новые данные?" } }
    ]
  },
  10: {
    title: { uz: "POST — yangi ma'lumot qo'shish", ru: "POST — добавление новых данных" },
    cards: [
      { ic: "➕", h: { uz: "POST = «qo'shib qo'y»", ru: "POST = «добавь»" }, body: { uz: <><b>POST</b> bazaga yangi yozuv qo'shadi — <span className="mono">INSERT</span> bilan bir xil. BODY'da yangi ma'lumot ketadi.</>, ru: <><b>POST</b> добавляет в базу новую запись — как <span className="mono">INSERT</span>. Новые данные едут в BODY.</> } },
      { ic: "🆕", h: "201 Created", body: { uz: <>Muvaffaqiyatli POST javobi — <b>201 Created</b>: yangi narsa yaratildi.</>, ru: <>Успешный ответ POST — <b>201 Created</b>: создано что-то новое.</> } },
      { ic: "📦", h: { uz: "BODY shart", ru: "BODY обязателен" }, body: { uz: <>POST'da <b>BODY</b> bor — qo'shiladigan ma'lumot. Aks holda server nimani saqlashni bilmaydi.</>, ru: <>У POST есть <b>BODY</b> — данные для добавления. Иначе сервер не знает, что сохранять.</> }, ask: { uz: "Yangi mahsulot qo'shish uchun qaysi method?", ru: "Каким методом добавить новый товар?" } }
    ]
  },
  13: {
    title: { uz: "Front backend bilan qanday gaplashadi", ru: "Как фронт говорит с бэком" },
    cards: [
      { ic: "🔌", h: { uz: "Sayt o'zi kira olmaydi", ru: "Сайт сам войти не может" }, body: { uz: <>Sayt bazaga <b>to'g'ridan-to'g'ri</b> kira olmaydi — bu xavfli. U <b>API</b> orqali so'raydi.</>, ru: <>Сайт не может попасть в базу <b>напрямую</b> — это опасно. Он спрашивает <b>через API</b>.</> } },
      { ic: "🔗", h: { uz: "Method = CRUD amali", ru: "Метод = операция CRUD" }, body: <>GET·POST·PUT·DELETE → SELECT·INSERT·UPDATE·DELETE.</> },
      { ic: "📨", h: { uz: "So'rov → javob", ru: "Запрос → ответ" }, body: { uz: <>Sayt API'ga <b>so'rov</b> yuboradi, server bazada ishlaydi va <b>javob</b> qaytaradi.</>, ru: <>Сайт отправляет в API <b>запрос</b>, сервер работает с базой и возвращает <b>ответ</b>.</> }, ask: { uz: "Frontend serverdan ma'lumotni qanday so'raydi?", ru: "Как фронтенд запрашивает данные у сервера?" } }
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
        <span className="rc-tag">{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Разбор темы" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "🗣️ Sinfga savol:", ru: "🗣️ Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
      </div>
    </div>;
}
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ждём ⏳" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr2({ uz: "javob berdi 📨", ru: "ответили 📨" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ждём ⏳" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. Нажмите «Открыть результат» — и всё откроется сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? `${n} ${tr2({ uz: "o'quvchi", ru: "уч." })} · ${pct}%` : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед тем как идти дальше, коротко повторите.</> })}</p>}
            {level === "maybe" && <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите тему перед продолжением.</> })}</p>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответов мало ({answered}) — делать выводы по процентам рано. Оцените сами.</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблись — похоже, тема осталась непонятной. Объясните ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, думайте перед кликом!" })}</p>}
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
            {isMentorLive ? <>✓ {tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете правильный ответ." }) : wrongLocked ? fmtCode(explainWrong[picked] ?? explainWrong.default) : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> {tr2({ uz: "· ko'rsatmani ochish ▾", ru: "· открыть подсказку ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Win = ({ title, children, minH, hotTitle }) => <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title" style={hotTitle ? { color: T.accent, fontWeight: 700 } : void 0}>{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: "relative" }}>{children}</div></div>;
var PRODUCTS = [
  { id: 1, nom: "Klaviatura", narx: 12e4, soni: 8 },
  { id: 2, nom: "Sichqoncha", narx: 75e3, soni: 15 },
  { id: 3, nom: "Quloqchin", narx: 95e3, soni: 5 }
];
var NEW_PRODUCT = { id: 4, nom: "Mikrofon", narx: 6e4, soni: 12 };
var fmtNarx = (n) => Number(n).toLocaleString("ru-RU");
var MethodBadge = ({ method, big }) => <span className="mbadge" style={{ color: METHODS[method] || T.ink2, background: (METHODS[method] || T.ink2) + "22", fontSize: big ? 12 : 10.5, padding: big ? "3px 10px" : "2px 7px" }}>{method}</span>;
var StatusBadge = ({ code, punch }) => {
  const s = STAT[code] || ["", T.ink2];
  const tone = code === 404 ? " sb-err" : code === 400 ? " sb-warn" : " sb-ok";
  return <span key={punch ? code : void 0} className={`status-badge${punch ? " sb-punch" + tone : ""}`} style={{ color: s[1], background: s[1] + "14", borderColor: s[1] }}>{s[0]}</span>;
};
var JsonBox = ({ data, sm }) => {
  const txt = JSON.stringify(data, null, 2);
  return <pre className={`json-box ${sm ? "sm" : ""}`}>{txt.split("\n").map((ln, i) => {
    const m = ln.match(/^(\s*)"([^"]+)":\s?(.*)$/);
    if (m) {
      const v = m[3];
      const isStr = v.startsWith('"');
      return <div key={i}>{m[1]}<span className="j-key">"{m[2]}"</span>: <span className={isStr ? "j-str" : "j-num"}>{v}</span></div>;
    }
    return <div key={i}>{ln}</div>;
  })}</pre>;
};
var Postman = ({ method, url, body, methodPicker, onMethod, onSend, sending, sent, status, children, sendDisabled, sendLabel = "Send" }) => <div className={`postman fade-up ${sending ? "is-sending" : ""}`}>
    <div className="pm-chrome">
      <span className="bb-dots"><i /><i /><i /></span>
      <span className="pm-app">Postman</span>
      <span className="pm-tab mono">{url}</span>
    </div>
    <div className="pm-bar">
      {methodPicker ? <div className="pm-methods">{["GET", "POST", "PUT", "DELETE"].map((m) => <button key={m} className="pm-mbtn" onClick={() => onMethod && onMethod(m)} style={method === m ? { color: "#fff", background: METHODS[m] } : { color: METHODS[m], background: METHODS[m] + "18" }}>{m}</button>)}</div> : <span className="pm-method" style={{ color: METHODS[method] }}>{method}</span>}
      <span className="pm-url mono">{url}</span>
      <button className="pm-send" disabled={sendDisabled || sending} onClick={onSend}>{sending ? "…" : sendLabel}</button>
    </div>
    {body && <div className="pm-body"><span className="pm-bodylbl">Body (JSON)</span><JsonBox sm data={body} /></div>}
    <div className="pm-resp">
      <div className="pm-resp-h"><span className="pm-resp-lbl">{tr2({ uz: "Javob (Response)", ru: "Ответ (Response)" })}</span>{sent && status ? <StatusBadge code={status} punch /> : null}</div>
      {sending ? <div className="pm-loading"><span className="pm-flytrack" aria-hidden="true"><span className="pm-fly">📨</span></span> {tr2({ uz: "Yuborilmoqda…", ru: "Отправляем…" })}</div> : sent ? <div className="pm-respbody fade-step">{children}</div> : <div className="pm-empty">{tr2({ uz: "▸ Send bosing — server javobi shu yerda chiqadi", ru: "▸ Нажмите Send — ответ сервера появится здесь" })}</div>}
    </div>
  </div>;
var VALVE_TIP_SEC = 40;
var VALVE_TIP_IDLE = 25;
var VALVE_RES_SEC = 110;
var VALVE_RES_IDLE = 60;
function useStuckValve(done, progress = 0) {
  const _gate = useContext2(LiveGateCtx) || {};
  const isMentor = !!(_gate.live && _gate.live.mode === "mentor");
  const [sec, setSec] = useState3(0);
  const [idle, setIdle] = useState3(0);
  const lastProg = useRef3(progress);
  useEffect4(() => {
    if (lastProg.current !== progress) {
      lastProg.current = progress;
      setIdle(0);
    }
  }, [progress]);
  useEffect4(() => {
    if (done || isMentor) return;
    const t = setInterval(() => {
      setSec((v) => v + 1);
      setIdle((v) => v + 1);
    }, 1e3);
    return () => clearInterval(t);
  }, [done, isMentor]);
  const live = !done && !isMentor;
  return {
    tip: live && (sec >= VALVE_TIP_SEC || idle >= VALVE_TIP_IDLE),
    rescue: live && (sec >= VALVE_RES_SEC || idle >= VALVE_RES_IDLE),
    isMentor
  };
}
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [phase, setPhase] = useState3(storedAnswer ? "done" : "idle");
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const tried = phase === "done";
  const fly = () => {
    if (phase !== "idle") return;
    setPhase("flying");
    setTimeout(() => setPhase("done"), 1100);
  };
  const OPTS = [
    { id: "a", label: { uz: "Ma'lumot saytning kodi ichida yozib qo'yilgan", ru: "Данные заранее записаны в коде сайта" } },
    { id: "b", label: { uz: "Sayt serverga so'rov (API) yuboradi va javob oladi", ru: "Сайт отправляет серверу запрос (API) и получает ответ" } },
    { id: "c", label: { uz: "Sayt bazaga to'g'ridan-to'g'ri o'zi kiradi", ru: "Сайт сам напрямую заходит в базу" } }
  ];
  const correct = "b";
  const pick = (v) => {
    if (picked !== null || !tried) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: v === correct });
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>Ilovani ochasiz — yangi ma'lumot <span className="italic" style={{ color: T.accent }}>qayerdan</span> keladi?</>, ru: <>Вы открываете приложение — <span className="italic" style={{ color: T.accent }}>откуда</span> приходят новые данные?</> })}</h1>
        <Mentor>{tr2({ uz: <>O'tgan darslarda server qurdik va bazada CRUD qildik. Lekin sayt (frontend) bazani <b style={{ color: T.ink }}>ko'rmaydi</b> — u serverga <b style={{ color: T.accent }}>xat (so'rov)</b> yuboradi, server javob qaytaradi. Tugmani bosing — konvert qanday uchishini ko'ring.</>, ru: <>На прошлых уроках мы собрали сервер и делали CRUD в базе. Но сайт (фронтенд) базу <b style={{ color: T.ink }}>не видит</b> — он отправляет серверу <b style={{ color: T.accent }}>письмо (запрос)</b>, а сервер возвращает ответ. Нажмите кнопку — посмотрите, как летит конверт.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <Win title={tr2({ uz: "zakaz-shop.uz — ilova", ru: "zakaz-shop.uz — приложение" })} minH={150}>
              <div className="shopmock">
                {(phase === "done" ? [...PRODUCTS, NEW_PRODUCT] : PRODUCTS).map((p) => <div key={p.id} className="shop-card"><div className="shop-name">{p.nom}</div><div className="shop-narx">{fmtNarx(p.narx)} {tr2({ uz: "so'm", ru: "сум" })}</div></div>)}
              </div>
            </Win>
            <div className="flyrow">
              <span className="flynode">{tr2({ uz: "Sayt", ru: "Сайт" })}</span>
              <span className="flytrack"><span className={`flyenv ${phase}`}>{phase === "done" ? "📩" : "📨"}</span></span>
              <span className="flynode">{tr2({ uz: "Server", ru: "Сервер" })}</span>
            </div>
            {phase === "idle" && <button className="btn" style={{ alignSelf: "flex-start" }} onClick={fly}>{tr2({ uz: "📨 Serverdan ma'lumot so'rash", ru: "📨 Запросить данные с сервера" })}</button>}
            {phase === "flying" && <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr2({ uz: "Konvert serverga uchmoqda…", ru: "Конверт летит к серверу…" })}</p>}
            {phase === "done" && <p className="mono small" style={{ color: T.success, margin: 0 }}>{tr2({ uz: `✓ Javob keldi — yangi mahsulot "Mikrofon" qo'shildi!`, ru: "✓ Ответ пришёл — добавлен новый товар «Mikrofon»!" })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Sizningcha sayt ma'lumotni qanday oladi?", ru: "Как, по-вашему, сайт получает данные?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr2(o.label)}</span>
                  </button>;
  })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval konvertni uchirib ko'ring ←", ru: "Сначала отправьте конверт ←" })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{picked === correct ? tr2({ uz: <>To'g'ri! Sayt serverga <b>so'rov (API)</b> yuboradi, server javob qaytaradi. Bugun shu suhbatni o'rganamiz.</>, ru: <>Верно! Сайт отправляет серверу <b>запрос (API)</b>, а сервер возвращает ответ. Сегодня мы изучим этот разговор.</> }) : tr2({ uz: <>Aslida sayt serverga <b>so'rov (API)</b> yuboradi va javob oladi — bazaga o'zi kira olmaydi. Mana shu suhbatni bugun o'rganamiz.</>, ru: <>На самом деле сайт отправляет серверу <b>запрос (API)</b> и получает ответ — сам в базу он попасть не может. Этот разговор мы сегодня и изучим.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "API nima — ikki dastur tili", ru: "Что такое API — язык двух программ" }, tag: { uz: "pochta", ru: "почта" } },
    { text: { uz: "So'rov va javob (konvert)", ru: "Запрос и ответ (конверт)" }, tag: "request · response" },
    { text: { uz: "4 method — GET/POST/PUT/DELETE", ru: "4 метода — GET/POST/PUT/DELETE" }, tag: "CRUD" },
    { text: { uz: "Postman — postachi asbob", ru: "Postman — инструмент-почтальон" }, tag: { uz: "sinab ko'rish", ru: "проверка" } },
    { text: { uz: "O'z API'ingizni chaqirasiz", ru: "Вызовете свой собственный API" }, tag: "/api/products" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Dars oxirida — siz Postman'da so'rov yuborasiz", ru: "В конце урока вы сами отправите запрос в Postman" })}</p>
      <Postman method="GET" url="/api/products" sent status={200}><JsonBox sm data={PRODUCTS.slice(0, 2)} /></Postman>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr2({ uz: "→ method tanlaysiz, Send bosasiz, javobni ko'rasiz", ru: "→ выбираете метод, жмёте Send, видите ответ" })}</p>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 5 qadam", ru: "Сегодняшние 5 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr2(s.text)}</span>{s.tag && <span className="step-tag">{tr2(s.tag)}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Front backend bilan <span className="italic" style={{ color: T.accent }}>qanday gaplashadi?</span></>, ru: <>Как фронт <span className="italic" style={{ color: T.accent }}>говорит с бэком?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Ishonasizmi — dars oxirida siz <b style={{ color: T.ink }}>Postman</b> degan asbob bilan o'z serveringizga so'rov yuborib, javobini o'z ko'zingiz bilan ko'rasiz. Buning uchun sayt yozish ham shart emas. Bularning bari bitta narsa ustida quriladi: <b style={{ color: T.ink }}>API</b>. 3-Modulda <b style={{ color: T.ink }}>ofitsiant</b> taom olib kelardi (GET), siz <b style={{ color: T.ink }}>jo'natma</b> yuborardingiz (POST). Bugun ikkalasini bitta rasmga yig'amiz — <b style={{ color: T.accent }}>pochta</b>: har so'rov konvert, har javob shtampli qaytgan xat. Ikki yo'nalish, bitta tizim.</>, ru: <>Поверите ли — в конце урока вы через инструмент <b style={{ color: T.ink }}>Postman</b> отправите запрос своему серверу и своими глазами увидите ответ. И для этого даже не нужно писать сайт. Всё это строится на одной вещи: <b style={{ color: T.ink }}>API</b>. В 3-м модуле <b style={{ color: T.ink }}>официант</b> приносил блюдо (GET), а вы отправляли <b style={{ color: T.ink }}>посылку</b> (POST). Сегодня соберём оба в одну картину — <b style={{ color: T.accent }}>почта</b>: каждый запрос — конверт, каждый ответ — вернувшееся письмо со штампом. Два направления, одна система.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "Bugungi 5 qadamni ko'rish", ru: "Посмотреть 5 шагов" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ Natijani ko'rish", ru: "↩ Посмотреть результат" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PARTS = [
    { k: "sayt", label: { uz: "Sayt (Frontend)", ru: "Сайт (Frontend)" }, desc: { uz: "Foydalanuvchi ko'radigan tomon. U ma'lumotni o'zi saqlamaydi — serverdan so'raydi.", ru: "Сторона, которую видит пользователь. Данные сайт сам не хранит — запрашивает их у сервера." } },
    { k: "api", label: { uz: "API (Pochta)", ru: "API (Почта)" }, desc: { uz: "Ikki dastur orasidagi til va qoidalar. Sayt API orqali so'rov yuboradi — to'g'ridan-to'g'ri bazaga kira olmaydi. Pochta kabi: xat aniq manzilga, aniq qoida bilan boradi.", ru: "Язык и правила между двумя программами. Сайт отправляет запрос через API — напрямую в базу попасть не может. Как почта: письмо идёт по точному адресу и по правилам." } },
    { k: "server", label: { uz: "Server + Baza", ru: "Сервер + База" }, desc: { uz: "So'rovni qabul qiladi, bazada ish bajaradi (CRUD) va javob qaytaradi.", ru: "Принимает запрос, выполняет работу в базе (CRUD) и возвращает ответ." } }
  ];
  const [seen, setSeen] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["sayt", "api", "server"]) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(storedAnswer ? "api" : null);
  const done = seen.size >= 3;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const tap = (k) => {
    setActive(k);
    setSeen((s) => new Set(s).add(k));
  };
  const cur = PARTS.find((p) => p.k === active);
  const firstUnseen = (PARTS.find((p) => !seen.has(p.k)) || {}).k;
  return <Stage eyebrow={tr2({ uz: "API nima", ru: "Что такое API" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `${seen.size}/3 qismni ko'ring`, ru: `Посмотрите части: ${seen.size}/3` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Sayt bazaga <span className="italic" style={{ color: T.accent }}>o'zi kira oladimi?</span></>, ru: <>Может ли сайт <span className="italic" style={{ color: T.accent }}>сам войти в базу?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Yo'q. Sayt va server — ikki alohida dastur. Ular orasida <b style={{ color: T.accent }}>API</b> turadi: bu <b style={{ color: T.ink }}>til va qoidalar</b> to'plami. Xuddi pochta kabi — xatni to'g'ri manzilga, qoida bilan yetkazadi; ofitsiant ham, jo'natma ham — shu pochtaning ichida. Uchta qismni bosib ko'ring.</>, ru: <>Нет. Сайт и сервер — две отдельные программы. Между ними стоит <b style={{ color: T.accent }}>API</b>: это набор <b style={{ color: T.ink }}>языка и правил</b>. Совсем как почта — доставляет письмо по нужному адресу и по правилам; и официант, и посылка — внутри этой почты. Нажмите на все три части.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Uchta qismdan qolganini bosing — har biri o'z ishini aytadi.", ru: "💡 Нажмите оставшиеся части — каждая расскажет о своей работе." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="apiflow">
              {PARTS.map((p, i) => <React3.Fragment key={p.k}>
                  <button className={`apinode ${active === p.k ? "on" : ""} ${seen.has(p.k) ? "seen" : p.k === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(p.k)}>{tr2(p.label)} {seen.has(p.k) ? <span className="tick-pop">✓</span> : ""}</button>
                  {i < PARTS.length - 1 && <span className="apiarrow">⇄</span>}
                </React3.Fragment>)}
            </div>
            {cur && <div className="sk-info fade-step" key={cur.k}><span className="sk-tagbig"><span className="sk-wordbadge">{tr2(cur.label)}</span></span><p className="body" style={{ color: T.ink, margin: "9px 0 0" }}>{tr2(cur.desc)}</p></div>}
          </Col>
          <Col>
            {done ? <div className="takeaway fade-step"><div className="ta-bulb">📮</div><p className="ta-h">{tr2({ uz: "API = ikki dastur gaplashadigan til", ru: "API = язык общения двух программ" })}</p><p className="ta-sub">{tr2({ uz: "Sayt → API → Server. To'g'ridan-to'g'ri emas — qoida bilan.", ru: "Сайт → API → Сервер. Не напрямую — по правилам." })}</p></div> : <div className="frame-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", textAlign: "center", margin: 0 }}>{tr2({ uz: "← Qismlarni bosib o'rganing", ru: "← Нажимайте на части и изучайте" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var S3_INFO = {
  method: { uz: "METHOD — niyat: nima qilmoqchisiz (olish, qo'shish, o'chirish)? Konvertdagi «xizmat turi».", ru: "METHOD — намерение: что вы хотите сделать (получить, добавить, удалить)? «Тип услуги» на конверте." },
  url: { uz: "URL — manzil: qaysi ma'lumot kerak? Masalan /api/products. Konvertdagi «manzil» qatori.", ru: "URL — адрес: какие данные нужны? Например /api/products. Строка «адрес» на конверте." },
  body: { uz: "BODY — konvertning ichidagi ma'lumot (faqat qo'shish va o'zgartirishda kerak). Konvertdagi «xat matni».", ru: "BODY — содержимое конверта (нужно только при добавлении и изменении). «Текст письма» внутри конверта." },
  status: { uz: "STATUS — javob shtampi: ish o'tdimi? 200 = o'tdi, 201 = yangi narsa yaratildi, 404 = manzil topilmadi.", ru: "STATUS — штамп ответа: получилось ли? 200 = получилось, 201 = создано новое, 404 = адрес не найден." },
  data: { uz: "DATA — javob konvertining ichi: server qaytargan ma'lumot (JSON).", ru: "DATA — содержимое конверта-ответа: данные, которые вернул сервер (JSON)." }
};
var S3_PIECES = [
  { k: "method", zone: "req", node: <><MethodBadge method="GET" big /> <span className="ep-lbl">METHOD</span></> },
  { k: "url", zone: "req", node: <><span className="mono">/api/products</span> <span className="ep-lbl">URL</span></> },
  { k: "body", zone: "req", node: <><span className="mono" style={{ color: T.ink3 }}>{"{ ... }"}</span> <span className="ep-lbl">BODY</span></> },
  { k: "status", zone: "res", node: <><StatusBadge code={200} /> <span className="ep-lbl">STATUS</span></> },
  { k: "data", zone: "res", node: <><span className="mono" style={{ color: T.success }}>[ ... ]</span> <span className="ep-lbl">DATA</span></> }
];
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext2(AchMissCtx);
  const [placed, setPlaced] = useState3(() => storedAnswer ? Object.fromEntries(S3_PIECES.map((p) => [p.k, p.zone])) : {});
  const [active, setActive] = useState3(null);
  const [sel, setSel] = useState3(null);
  const [hot, setHot] = useState3(null);
  const [reject, setReject] = useState3(null);
  const zoneRefs = useRef3({});
  const pool = S3_PIECES.filter((p) => !placed[p.k]);
  const nPlaced = S3_PIECES.length - pool.length;
  const done = pool.length === 0;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, nPlaced);
  const zoneFull = (z) => S3_PIECES.filter((p) => p.zone === z).every((p) => placed[p.k]);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const tryPlace = (k, zone) => {
    const piece = S3_PIECES.find((p) => p.k === k);
    if (!piece || placed[k]) return;
    if (piece.zone !== zone) {
      if (achMiss) achMiss.miss(screen);
      setSel(null);
      setReject(k);
      setTimeout(() => setReject((r) => r === k ? null : r), 520);
      return;
    }
    setPlaced((p) => ({ ...p, [k]: zone }));
    setActive(k);
    setSel(null);
  };
  const hitZone = (x, y) => {
    let z = null;
    Object.keys(zoneRefs.current).forEach((zk) => {
      const elm = zoneRefs.current[zk];
      if (!elm) return;
      const r = elm.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) z = zk;
    });
    return z;
  };
  const down = (ev, k) => {
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
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
        moved = true;
        setSel(null);
      }
      if (moved) {
        el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
        setHot(hitZone(e.clientX, e.clientY));
      }
    };
    const finish = () => {
      el.style.zIndex = "";
      el.style.willChange = "";
      el.style.transform = "";
      el.style.transition = "";
    };
    const up = (e) => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      setHot(null);
      if (!moved) {
        finish();
        setActive(k);
        setSel((s) => s === k ? null : k);
        return;
      }
      const z = hitZone(e.clientX, e.clientY);
      if (z) {
        finish();
        tryPlace(k, z);
      } else {
        el.style.transition = "transform .2s cubic-bezier(.34,1.3,.4,1)";
        el.style.transform = "";
        setTimeout(finish, 210);
      }
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  };
  const renderZone = (z, label, color) => <React3.Fragment key={z}>
      <p className="flow-label" style={{ color }}>{label}</p>
      <div ref={(el) => zoneRefs.current[z] = el} className={`envcard ${z} env-zone ${hot === z ? "hot" : ""} ${zoneFull(z) ? "sealed" : ""}`} onClick={() => sel && tryPlace(sel, z)}>
        {S3_PIECES.filter((p) => p.zone === z).map((p) => placed[p.k] ? <button key={p.k} className={`envpart placed ${active === p.k ? "on" : ""}`} onClick={() => setActive(p.k)}>{p.node}</button> : <span key={p.k} className="env-slot" aria-hidden="true">{tr2({ uz: "bo'lakni shu yerga tashlang", ru: "перетащите деталь сюда" })}</span>)}
        {zoneFull(z) && <span className="env-seal" aria-hidden="true">📮</span>}
      </div>
    </React3.Fragment>;
  return <Stage eyebrow={tr2({ uz: "So'rov va javob", ru: "Запрос и ответ" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `${nPlaced}/5 bo'lakni joylang`, ru: `Разложите детали: ${nPlaced}/5` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har bir suhbat — <span className="italic" style={{ color: T.accent }}>ikki konvert</span></>, ru: <>Каждый разговор — <span className="italic" style={{ color: T.accent }}>два конверта</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Siz <b style={{ color: T.accent }}>so'rov</b> (request) yuborasiz, server <b style={{ color: T.success }}>javob</b> (response) qaytaradi. So'rov = METHOD + URL (+ ba'zan BODY). Javob = STATUS + DATA. Bo'laklarni o'z konvertiga <b style={{ color: T.ink }}>sudrab yoki bosib</b> joylang — har birining vazifasi yonida chiqadi.</>, ru: <>Вы отправляете <b style={{ color: T.accent }}>запрос</b> (request), сервер возвращает <b style={{ color: T.success }}>ответ</b> (response). Запрос = METHOD + URL (+ иногда BODY). Ответ = STATUS + DATA. Разложите детали по своим конвертам — <b style={{ color: T.ink }}>перетащите или нажмите</b>, роль каждой появится рядом.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Konvertga hamma bo'lak kerak: so'rovga METHOD, URL, BODY — javobga STATUS, DATA. Bo'lakni bosing, keyin konvertni bosing.", ru: "💡 Конверту нужны все детали: в запрос METHOD, URL, BODY — в ответ STATUS, DATA. Нажмите деталь, затем нажмите конверт." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="env-pool-h">
              <span className="ep-lbl" style={{ margin: 0 }}>{tr2({ uz: "Bo'laklar", ru: "Детали" })}</span>
              <span className="env-count mono" key={nPlaced}>{nPlaced}/5</span>
            </div>
            <div className="env-pool">
              {pool.length === 0 ? <span className="env-pool-done">{tr2({ uz: "✓ Ikkala konvert ham yig'ildi", ru: "✓ Оба конверта собраны" })}</span> : pool.map((p) => <button key={p.k} className={`envpart chip ${sel === p.k ? "sel" : ""} ${reject === p.k ? "reject" : ""} ${sel || reject === p.k ? "" : "tap-hint"}`} onPointerDown={(e) => down(e, p.k)}>{p.node}</button>)}
            </div>
            {!done && <AchRule screen={screen} />}
            {sel && <p className="env-tip small">{tr2({ uz: <>Endi konvertni bosing — <b>{sel.toUpperCase()}</b> shu yerga tushadi (yoki bo'lakni sudrang).</>, ru: <>Теперь нажмите на конверт — <b>{sel.toUpperCase()}</b> ляжет туда (или перетащите деталь).</> })}</p>}
            {renderZone("req", tr2({ uz: "So'rov konverti (siz → server)", ru: "Конверт запроса (вы → сервер)" }), T.accent)}
            {renderZone("res", tr2({ uz: "Javob konverti (server → siz)", ru: "Конверт ответа (сервер → вы)" }), T.success)}
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}><p className="body" style={{ color: T.ink, margin: 0 }}>{tr2(S3_INFO[active])}</p></div> : <div className="frame-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", textAlign: "center", margin: 0 }}>{tr2({ uz: "← Bo'lakni konvertga sudrang (yoki bosib tanlang)", ru: "← Перетащите деталь в конверт (или выберите нажатием)" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "So'rov = nima + qayerdan. Javob = o'tdimi + natija. Endi METHOD'larni ko'ramiz.", ru: "Запрос = что + откуда. Ответ = получилось ли + результат. Теперь посмотрим на методы." })}</p></div>}
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
  questionText={tr2({ uz: "API nima vazifani bajaradi?", ru: "Какую задачу выполняет API?" })}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Sayt va server orasida turadigan <span className="italic" style={{ color: T.accent }}>API</span> nima qiladi?</>, ru: <>Что делает <span className="italic" style={{ color: T.accent }}>API</span>, стоящий между сайтом и сервером?</> })}</h2></>}
  options={[tr2({ uz: "Saytning ranglari va shriftlarini chiroyli qilib bezaydi", ru: "Красиво оформляет цвета и шрифты сайта" }), tr2({ uz: "Server rasmlarini saqlaydigan katta papka", ru: "Большая папка, где сервер хранит картинки" }), tr2({ uz: "Ikki dastur (sayt va server) gaplashadigan til va qoidalar", ru: "Язык и правила, на которых общаются две программы (сайт и сервер)" }), tr2({ uz: "Internet tezligini oshiradigan maxsus dastur", ru: "Специальная программа для ускорения интернета" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri! API — bu sayt va server bir-biri bilan gaplashadigan til va qoidalar. Sayt API orqali so'rov yuboradi, javob oladi.", ru: "Верно! API — это язык и правила, на которых сайт и сервер общаются друг с другом. Сайт отправляет запрос через API и получает ответ." })}
  explainWrong={{
    0: tr2({ uz: "Bezash — CSS ishi. API ma'lumot almashish uchun.", ru: "Оформление — работа CSS. API нужен для обмена данными." }),
    1: tr2({ uz: "API papka emas — u har qanday ma'lumotni so'rov-javob orqali uzatadi.", ru: "API — не папка. Он передаёт любые данные через запрос-ответ." }),
    3: tr2({ uz: "API tezlik vositasi emas — u sayt va server orasidagi til.", ru: "API — не про скорость. Это язык между сайтом и сервером." }),
    default: tr2({ uz: "API = dasturlar gaplashadigan til va qoidalar.", ru: "API = язык и правила общения программ." })
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(!!storedAnswer);
  const done = sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, sent ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 850);
  };
  return <Stage eyebrow="Postman + GET" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Send bosing", ru: "Нажмите Send" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Frontend yozmasdan API'ni <span className="italic" style={{ color: T.accent }}>qanday sinaymiz?</span></>, ru: <>Как протестировать API <span className="italic" style={{ color: T.accent }}>без фронтенда?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: T.ink }}>Postman</b> — bu "postachi" asbob: siz so'rovni yozasiz, u serverga eltadi va javobni keltiradi. Birinchi so'rov — <b style={{ color: METHODS.GET }}>GET /api/products</b>: "menga mahsulotlar ro'yxatini ber". Bu bazadagi <span className="mono">SELECT</span> bilan bir xil. Send'ni bosing.</>, ru: <><b style={{ color: T.ink }}>Postman</b> — инструмент-«почтальон»: вы пишете запрос, он относит его серверу и приносит ответ. Первый запрос — <b style={{ color: METHODS.GET }}>GET /api/products</b>: «дай мне список товаров». Это то же самое, что <span className="mono">SELECT</span> в базе. Нажмите Send.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Postman'dagi «Send» tugmasini bosing — konvert serverga ketadi.", ru: "💡 Нажмите «Send» в Postman — конверт уйдёт на сервер." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="GET" url="/api/products" sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={PRODUCTS} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="GET" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr2({ uz: "SELECT (o'qish)", ru: "SELECT (чтение)" })}</span></div>
            {sent ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Server <b>200 OK</b> shtampi bilan 3 ta mahsulotni JSON qilib qaytardi. GET — ma'lumotni faqat <b>o'qiydi</b>, hech narsani o'zgartirmaydi.</>, ru: <>Сервер вернул 3 товара в JSON со штампом <b>200 OK</b>. GET только <b>читает</b> данные и ничего не меняет.</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: `GET = "ma'lumotni so'rab ol". Eng ko'p ishlatiladigan method. Postman'da Send bosib, javobni ko'ring.`, ru: "GET = «запроси данные». Самый частый метод. Нажмите Send в Postman и посмотрите ответ." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  idx={6}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Практика · вопрос 2" })}
  questionText={tr2({ uz: "GET method nima qiladi?", ru: "Что делает метод GET?" })}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <><span className="italic" style={{ color: METHODS.GET }}>GET</span> so'rovi serverdan nimani so'raydi?</>, ru: <>Что запрашивает у сервера <span className="italic" style={{ color: METHODS.GET }}>GET</span>?</> })}</h2></>}
  options={[tr2({ uz: "Mavjud ma'lumotni o'qib (olib) keladi", ru: "Читает (получает) существующие данные" }), tr2({ uz: "Butunlay yangi ma'lumot qo'shib yozadi", ru: "Записывает совершенно новые данные" }), tr2({ uz: "Mavjud ma'lumotni bazadan o'chiradi", ru: "Удаляет существующие данные из базы" }), tr2({ uz: "Serverni butunlay o'chirib qo'yadi", ru: "Полностью выключает сервер" })]}
  correctIdx={0}
  explainCorrect={tr2({ uz: "To'g'ri! GET — ma'lumotni o'qish uchun. Bazadagi SELECT bilan bir xil: faqat oladi, o'zgartirmaydi.", ru: "Верно! GET — для чтения данных. Как SELECT в базе: только получает, ничего не меняет." })}
  explainWrong={{
    1: tr2({ uz: "Qo'shish — POST ishi. GET faqat o'qiydi.", ru: "Добавление — работа POST. GET только читает." }),
    2: tr2({ uz: "O'chirish — DELETE ishi. GET hech narsani o'chirmaydi.", ru: "Удаление — работа DELETE. GET ничего не удаляет." }),
    3: tr2({ uz: "GET serverni o'chirmaydi — u shunchaki ma'lumot so'raydi.", ru: "GET не выключает сервер — он просто запрашивает данные." }),
    default: tr2({ uz: "GET = o'qish (olish).", ru: "GET = чтение (получение)." })
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(!!storedAnswer);
  const done = sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, sent ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 850);
  };
  const body = { nom: "Mikrofon", narx: 6e4, soni: 12 };
  return <Stage eyebrow={tr2({ uz: "POST · qo'shish", ru: "POST · добавление" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Send bosing", ru: "Нажмите Send" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bazaga yangi mahsulot <span className="italic" style={{ color: T.accent }}>qanday qo'shamiz?</span></>, ru: <>Как добавить в базу <span className="italic" style={{ color: T.accent }}>новый товар?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: METHODS.POST }}>POST</b> = "mana yangi narsa, qo'shib qo'y". So'rov ichida (BODY) yangi mahsulot ma'lumoti ketadi. Server uni bazaga yozadi va <b style={{ color: T.success }}>201 Created</b> qaytaradi. Bu <span className="mono">INSERT</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.POST }}>POST</b> = «вот новое, добавь». Внутри запроса (BODY) едут данные нового товара. Сервер записывает их в базу и возвращает <b style={{ color: T.success }}>201 Created</b>. Это то же самое, что <span className="mono">INSERT</span>.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 BODY tayyor — «Send» bosing, server 201 shtampini bosadi.", ru: "💡 BODY готов — нажмите «Send», сервер поставит штамп 201." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="POST" url="/api/products" body={body} sending={sending} sent={sent} status={201} onSend={send} sendLabel="Send">
              <JsonBox data={{ id: 4, ...body }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="POST" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr2({ uz: "INSERT (qo'shish)", ru: "INSERT (добавление)" })}</span></div>
            {sent ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Server <b>201 Created</b> qaytardi va yangi mahsulotni <b>id: 4</b> bilan saqladi. POST — yangi ma'lumot <b>qo'shadi</b>.</>, ru: <>Сервер вернул <b>201 Created</b> и сохранил новый товар с <b>id: 4</b>. POST <b>добавляет</b> новые данные.</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Diqqat: POST'da <b>BODY</b> bor — qo'shiladigan ma'lumot. GET'da body yo'q edi.</>, ru: <>Заметьте: у POST есть <b>BODY</b> — данные для добавления. У GET body не было.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(!!storedAnswer);
  const done = sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, sent ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 850);
  };
  const body = { narx: 99e3 };
  return <Stage eyebrow={tr2({ uz: "PUT · o'zgartirish", ru: "PUT · изменение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Send bosing", ru: "Нажмите Send" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Mahsulot narxini <span className="italic" style={{ color: T.accent }}>qanday yangilaymiz?</span></>, ru: <>Как обновить <span className="italic" style={{ color: T.accent }}>цену товара?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: METHODS.PUT }}>PUT</b> = "buni yangilab qo'y". URL'da <b style={{ color: T.ink }}>qaysi</b> mahsulot (/api/products/<b>1</b>), BODY'da yangi qiymat. Server <b style={{ color: T.success }}>200 OK</b> qaytaradi. Bu <span className="mono">UPDATE</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.PUT }}>PUT</b> = «обнови это». В URL — <b style={{ color: T.ink }}>какой</b> товар (/api/products/<b>1</b>), в BODY — новое значение. Сервер вернёт <b style={{ color: T.success }}>200 OK</b>. Это то же самое, что <span className="mono">UPDATE</span>.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 URL'dagi /1 — qaysi mahsulot ekani. «Send» bosing — narx yangilanadi.", ru: "💡 /1 в URL — какой это товар. Нажмите «Send» — цена обновится." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="PUT" url="/api/products/1" body={body} sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={{ id: 1, nom: "Klaviatura", narx: 99e3, soni: 8 }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="PUT" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr2({ uz: "UPDATE (o'zgartirish)", ru: "UPDATE (изменение)" })}</span></div>
            <p className="flow-label" style={{ margin: "2px 0 0" }}>{tr2({ uz: "Do'kon sayti — /api/products", ru: "Сайт магазина — /api/products" })}</p>
            <div className="shopmock col">
              {PRODUCTS.map((p) => {
    const hit = sent && p.id === 1;
    return <div key={p.id} className={`shop-card${hit ? " hit" : ""}`}>
                    <span className="shop-name">{p.nom}</span>
                    <span className="shop-narx">{hit && <span className="narx-old">{fmtNarx(p.narx)}</span>}<span className={hit ? "narx-new" : ""}>{fmtNarx(hit ? body.narx : p.narx)}</span> {tr2({ uz: "so'm", ru: "сум" })}</span>
                  </div>;
  })}
            </div>
            {sent ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Klaviatura narxi yangilandi — qolgan ikki mahsulot <b>o'zgarmadi</b>. URL'dagi <b>/1</b> serverga aynan qaysi qatorni o'zgartirishni aytdi (bazadagi WHERE id=1 kabi).</>, ru: <>Цена клавиатуры обновилась — два других товара <b>не изменились</b>. <b>/1</b> в URL сказал серверу, какую именно строку менять (как WHERE id=1 в базе).</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>URL oxiridagi <b>/1</b> — bu mahsulotning id'si. PUT'da u shart: aks holda qaysisini yangilashni server bilmaydi.</>, ru: <><b>/1</b> в конце URL — это id товара. Для PUT он обязателен: иначе сервер не знает, что обновлять.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(!!storedAnswer);
  const done = sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, sent ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 850);
  };
  return <Stage eyebrow={tr2({ uz: "DELETE · o'chirish", ru: "DELETE · удаление" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Send bosing", ru: "Нажмите Send" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Mahsulot sotuvdan chiqdi — <span className="italic" style={{ color: T.accent }}>qanday o'chiramiz?</span></>, ru: <>Товар снят с продажи — <span className="italic" style={{ color: T.accent }}>как его удалить?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: METHODS.DELETE }}>DELETE</b> = "buni o'chir". URL'da o'chiriladigan mahsulot id'si (/api/products/<b>3</b>). BODY kerak emas. Server <b style={{ color: T.success }}>200 OK</b> qaytaradi. Bu <span className="mono">DELETE FROM</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.DELETE }}>DELETE</b> = «удали это». В URL — id удаляемого товара (/api/products/<b>3</b>). BODY не нужен. Сервер вернёт <b style={{ color: T.success }}>200 OK</b>. Это то же самое, что <span className="mono">DELETE FROM</span>.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «Send» bosing — 3-mahsulot o'chadi, javobda shtamp keladi.", ru: "💡 Нажмите «Send» — товар 3 удалится, в ответе придёт штамп." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="DELETE" url="/api/products/3" sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={{ ochirildi: true, id: 3 }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="DELETE" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr2({ uz: "DELETE (o'chirish)", ru: "DELETE (удаление)" })}</span></div>
            <p className="flow-label" style={{ margin: "2px 0 0" }}>{tr2({ uz: "Do'kon sayti — /api/products", ru: "Сайт магазина — /api/products" })}</p>
            <div className="shopmock col">
              {PRODUCTS.map((p) => {
    const gone = sent && p.id === 3;
    return <div key={p.id} className={`shop-card${gone ? " gone" : ""}`}>
                    <span className="shop-name">{p.nom}</span>
                    <span className="shop-narx">{fmtNarx(p.narx)} {tr2({ uz: "so'm", ru: "сум" })}</span>
                  </div>;
  })}
            </div>
            {sent ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Uchinchi qator — <b>Quloqchin</b> — ro'yxatdan chiqdi, qolgan ikkitasi joyida. DELETE'da URL'dagi id juda muhim: noto'g'ri raqam — noto'g'ri mahsulot o'chadi.</>, ru: <>Третья строка — <b>Quloqchin</b> — ушла из списка, остальные две на месте. В DELETE id в URL очень важен: неверный номер — удалится не тот товар.</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: `DELETE — eng "xavfli" method. Shuning uchun id aniq bo'lishi shart.`, ru: "DELETE — самый «опасный» метод. Поэтому id должен быть точным." })}</p></div>}
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
  questionText={tr2({ uz: "Bazaga yangi mahsulot qo'shish uchun qaysi method?", ru: "Каким методом добавить в базу новый товар?" })}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Do'konga yangi mahsulot qo'shmoqchisiz. <span className="italic" style={{ color: T.accent }}>Qaysi method?</span></>, ru: <>Вы хотите добавить в магазин новый товар. <span className="italic" style={{ color: T.accent }}>Какой метод?</span></> })}</h2></>}
  options={[tr2({ uz: "GET — mavjud ma'lumotni o'qib oladi", ru: "GET — читает существующие данные" }), tr2({ uz: "DELETE — mavjud yozuvni o'chiradi", ru: "DELETE — удаляет существующую запись" }), tr2({ uz: "PUT — mavjud yozuvni o'zgartiradi", ru: "PUT — изменяет существующую запись" }), tr2({ uz: "POST — yangi ma'lumot qo'shib yozadi", ru: "POST — записывает новые данные" })]}
  correctIdx={3}
  explainCorrect={tr2({ uz: "To'g'ri! POST yangi yozuv (mahsulot) yaratadi — BODY'da uning ma'lumoti ketadi. Server 201 Created qaytaradi.", ru: "Верно! POST создаёт новую запись (товар) — её данные едут в BODY. Сервер возвращает 201 Created." })}
  explainWrong={{
    0: tr2({ uz: "GET faqat o'qiydi — yangi narsa qo'shmaydi.", ru: "GET только читает — ничего нового не добавляет." }),
    1: tr2({ uz: "DELETE mavjud mahsulotni o'chiradi, yangi qo'shmaydi.", ru: "DELETE удаляет существующий товар, а не добавляет новый." }),
    2: tr2({ uz: "PUT mavjud mahsulotni o'zgartiradi, yangi qo'shmaydi.", ru: "PUT изменяет существующий товар, а не добавляет новый." }),
    default: tr2({ uz: "Yangi qo'shish — POST.", ru: "Добавить новое — POST." })
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const MAP = [
    { m: "GET", crud: "Read", sql: "SELECT * FROM products", ex: "GET /api/products", desc: { uz: "Ro'yxatni o'qib oladi.", ru: "Читает список." } },
    { m: "POST", crud: "Create", sql: "INSERT INTO products ...", ex: "POST /api/products", desc: { uz: "Yangi qator qo'shadi (BODY bilan).", ru: "Добавляет новую строку (с BODY)." } },
    { m: "PUT", crud: "Update", sql: "UPDATE products SET ... WHERE id", ex: "PUT /api/products/1", desc: { uz: "Mavjud qatorni o'zgartiradi.", ru: "Изменяет существующую строку." } },
    { m: "DELETE", crud: "Delete", sql: "DELETE FROM products WHERE id", ex: "DELETE /api/products/3", desc: { uz: "Qatorni o'chiradi.", ru: "Удаляет строку." } }
  ];
  const [seen, setSeen] = useState3(storedAnswer ? new Set(MAP.map((x) => x.m)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(storedAnswer ? "GET" : null);
  const done = seen.size >= 4;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const tap = (m) => {
    setActive(m);
    setSeen((s) => new Set(s).add(m));
  };
  const cur = MAP.find((x) => x.m === active);
  const firstUnseen = (MAP.find((x) => !seen.has(x.m)) || {}).m;
  return <Stage eyebrow="Method ↔ CRUD ↔ SQL" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `${seen.size}/4 method ko'ring`, ru: `Посмотрите методы: ${seen.size}/4` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>To'rt method — <span className="italic" style={{ color: T.accent }}>o'sha CRUD, endi internetda</span></>, ru: <>Четыре метода — <span className="italic" style={{ color: T.accent }}>тот же CRUD, теперь в интернете</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Eng muhim ko'prik: API method'lari o'tgan darsdagi <b style={{ color: T.ink }}>CRUD</b> amallariga to'g'ridan-to'g'ri mos keladi. Postman'da bir tugma bosasiz → server kodi ishlaydi → bazada SQL bajariladi. Har method'ni bosib, ortidagi SQL'ni ko'ring.</>, ru: <>Самый важный мост: методы API напрямую соответствуют операциям <b style={{ color: T.ink }}>CRUD</b> из прошлого урока. Нажимаете кнопку в Postman → работает код сервера → в базе выполняется SQL. Нажмите на каждый метод и посмотрите SQL за ним.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Qolgan method-kartalarni bosing — har biri ortidagi SQL'ni ko'rsatadi.", ru: "💡 Нажмите оставшиеся карточки методов — каждая покажет свой SQL." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {MAP.map((x) => <button key={x.m} className={`crud-card ${active === x.m ? "on" : ""} ${seen.has(x.m) ? "seen" : x.m === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(x.m)} style={active === x.m ? { boxShadow: `0 0 0 2px ${METHODS[x.m]}, 0 8px 18px -6px rgba(0,0,0,0.18)` } : void 0}>
                  <span className="crud-word" style={{ color: METHODS[x.m] }}>{x.m}</span>
                  <span className="crud-uz">{x.crud} {seen.has(x.m) && <span className="tick-pop" style={{ color: T.success }}>✓</span>}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="sk-info fade-step" key={cur.m}>
                  <div className="maprow" style={{ marginBottom: 8 }}><MethodBadge method={cur.m} big /><span className="maparrow">→</span><span className="mono small" style={{ color: T.ink2 }}>{cur.crud}</span></div>
                  <p className="mono small" style={{ color: T.ink, margin: "0 0 6px" }}>{cur.ex}</p>
                  <p className="small" style={{ color: T.ink2, margin: "0 0 8px" }}>{tr2({ uz: "Server ortida:", ru: "На стороне сервера:" })} <span className="mono" style={{ color: T.accent }}>{cur.sql}</span></p>
                  <p className="body" style={{ color: T.ink, margin: 0 }}>{tr2(cur.desc)}</p>
                </div> : <div className="frame-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", textAlign: "center", margin: 0 }}>{tr2({ uz: "← Method'lardan birini bosing", ru: "← Нажмите на один из методов" })}</p></div>}
            {done && <div className="takeaway fade-step"><div className="ta-bulb">🔗</div><p className="ta-h">{tr2({ uz: "API method = baza amali", ru: "Метод API = операция в базе" })}</p><p className="ta-sub">GET·POST·PUT·DELETE → SELECT·INSERT·UPDATE·DELETE</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var JNODES = [
  { k: "sayt", label: { uz: "Sayt", ru: "Сайт" } },
  { k: "api", label: "API" },
  { k: "server", label: "Nest server" },
  { k: "baza", label: { uz: "Baza", ru: "База" } }
];
var JSEQ = [
  { idx: 0, dir: "req", note: { uz: "Sayt so'rov yaratadi: GET /api/products", ru: "Сайт создаёт запрос: GET /api/products" } },
  { idx: 1, dir: "req", note: { uz: "API so'rovni qabul qiladi (pochta)", ru: "API принимает запрос (почта)" } },
  { idx: 2, dir: "req", note: { uz: "Nest server kerakli kodni topadi (routing)", ru: "Nest-сервер находит нужный код (routing)" } },
  { idx: 3, dir: "req", note: { uz: "Baza SELECT bajaradi — ma'lumotni topadi", ru: "База выполняет SELECT — находит данные" } },
  { idx: 2, dir: "res", note: { uz: "Server javobni JSON qiladi", ru: "Сервер упаковывает ответ в JSON" } },
  { idx: 1, dir: "res", note: { uz: "API javobni ortga uzatadi", ru: "API передаёт ответ обратно" } },
  { idx: 0, dir: "res", note: { uz: "Sayt ma'lumotni ekranda ko'rsatadi · 200 OK", ru: "Сайт показывает данные на экране · 200 OK" } }
];
var NODEPCT = [3, 35, 65, 92];
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState3(storedAnswer ? JSEQ.length - 1 : -1);
  const [playing, setPlaying] = useState3(false);
  const timer = useRef3(null);
  const done = step >= JSEQ.length - 1;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, step);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  useEffect4(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);
  const play = () => {
    if (playing) return;
    setPlaying(true);
    setStep(0);
    let s = 0;
    timer.current = setInterval(() => {
      s += 1;
      if (s >= JSEQ.length) {
        clearInterval(timer.current);
        setPlaying(false);
        return;
      }
      setStep(s);
    }, 950);
  };
  const cur = step >= 0 ? JSEQ[step] : null;
  const envLeft = cur ? NODEPCT[cur.idx] : NODEPCT[0];
  const envColor = cur ? cur.dir === "req" ? T.accent : T.success : T.ink3;
  return <Stage eyebrow={tr2({ uz: "To'liq sayohat", ru: "Полное путешествие" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Sayohatni ko'ring (▶)", ru: "Посмотрите путешествие (▶)" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Send bosganda konvert <span className="italic" style={{ color: T.accent }}>shu yo'lni</span> bosib o'tadi</>, ru: <>Когда вы жмёте Send, конверт проходит <span className="italic" style={{ color: T.accent }}>вот этот путь</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Postman (yoki sayt) Send bosganda so'rov konverti: Sayt → API → Nest server → Baza, keyin javob xuddi shu yo'l bilan ortga qaytadi. <b style={{ color: T.accent }}>▶ tugmasini</b> bosib, butun sayohatni kuzating.</>, ru: <>Когда Postman (или сайт) жмёт Send, конверт запроса летит: Сайт → API → Nest-сервер → База, а ответ возвращается тем же путём. Нажмите <b style={{ color: T.accent }}>кнопку ▶</b> и проследите всё путешествие.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 ▶ tugmasini bosing — konvert 4 bekatdan o'tib qaytadi, kuzating.", ru: "💡 Нажмите ▶ — конверт пройдёт 4 станции и вернётся, наблюдайте." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <div className="jflow">
          {JNODES.map((n, i) => <div key={n.k} className={`jnode ${cur && cur.idx === i ? "on" : ""}`} style={cur && cur.idx === i ? { boxShadow: `0 0 0 2px ${envColor}` } : void 0}>
              <span className="jnode-ic">{n.k === "sayt" ? "🖥️" : n.k === "api" ? "📮" : n.k === "server" ? "🗄️" : "💾"}</span>
              <span className="jnode-lbl">{tr2(n.label)}</span>
            </div>)}
          <div className="jtrack"><span className="jenv" style={{ left: `${envLeft}%`, color: envColor }}>{cur && cur.dir === "res" ? "📩" : "📨"}</span></div>
        </div>
        <div className="jnote">
          {cur ? <p className="body fade-step" key={step} style={{ margin: 0, color: T.ink }}><span className="mono" style={{ color: envColor, fontWeight: 700 }}>{cur.dir === "req" ? tr2({ uz: "SO'ROV →", ru: "ЗАПРОС →" }) : tr2({ uz: "← JAVOB", ru: "← ОТВЕТ" })}</span> &nbsp;{tr2(cur.note)}</p> : <p className="small" style={{ margin: 0, color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "▶ tugmasini bosing — konvert sayohatini boshlang", ru: "▶ Нажмите кнопку — отправьте конверт в путешествие" })}</p>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!playing && <button className="btn" onClick={play}>{step < 0 ? tr2({ uz: "▶ Sayohatni boshlash", ru: "▶ Начать путешествие" }) : tr2({ uz: "↻ Qaytadan", ru: "↻ Заново" })}</button>}
          {done && !playing && <span className="mono small" style={{ color: T.success, alignSelf: "center" }}>{tr2({ uz: "✓ Javob saytga yetib keldi — 200 OK", ru: "✓ Ответ дошёл до сайта — 200 OK" })}</span>}
        </div>
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  idx={12}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Практика · вопрос 4" })}
  questionText={tr2({ uz: "Sayt ma'lumot kerak bo'lganda nima qiladi?", ru: "Что делает сайт, когда ему нужны данные?" })}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Frontend backend bilan <span className="italic" style={{ color: T.accent }}>qanday gaplashadi?</span></>, ru: <>Как фронтенд <span className="italic" style={{ color: T.accent }}>говорит с бэкендом?</span></> })}</h2></>}
  options={[tr2({ uz: "Bazaga to'g'ridan-to'g'ri o'zi kirib ma'lumot oladi", ru: "Сам напрямую заходит в базу и берёт данные" }), tr2({ uz: "API'ga so'rov yuboradi, server javob qaytaradi", ru: "Отправляет запрос в API, сервер возвращает ответ" }), tr2({ uz: "Hech kim bilan gaplashmaydi — hammasini o'zi biladi", ru: "Ни с кем не разговаривает — всё знает сам" }), tr2({ uz: "Boshqa saytdan tayyor ma'lumot nusxasini oladi", ru: "Берёт готовую копию данных с другого сайта" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Sayt API'ga so'rov (request) yuboradi → server bazada ishlaydi → javob (response) qaytaradi. Sayt bazaga o'zi kira olmaydi.", ru: "Верно! Сайт отправляет запрос (request) в API → сервер работает с базой → возвращает ответ (response). Сам в базу сайт попасть не может." })}
  explainWrong={{
    0: tr2({ uz: "Sayt bazaga to'g'ridan-to'g'ri kira olmaydi — bu xavfli. U API orqali so'raydi.", ru: "Сайт не может войти в базу напрямую — это опасно. Он спрашивает через API." }),
    2: tr2({ uz: "Sayt aniq gaplashadi — API orqali serverga so'rov yuboradi.", ru: "Ещё как разговаривает — отправляет запрос серверу через API." }),
    3: tr2({ uz: "Yo'q — har sayt o'z serveridan API orqali so'raydi.", ru: "Нет — каждый сайт спрашивает свой сервер через API." }),
    default: tr2({ uz: "Front → API so'rov → server javob.", ru: "Фронт → запрос в API → ответ сервера." })
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEPS = [
    { label: { uz: "1. GET — ro'yxatni ko'r", ru: "1. GET — посмотрите список" }, method: "GET", url: "/api/products", status: 200, hint: { uz: "GET so'rovini yuboring — hozir 3 mahsulot bor.", ru: "Отправьте GET-запрос — сейчас в списке 3 товара." }, data: PRODUCTS },
    { label: { uz: "2. POST — yangi qo'sh", ru: "2. POST — добавьте новый" }, method: "POST", url: "/api/products", status: 201, body: NEW_PRODUCT, hint: { uz: "Endi POST bilan Mikrofonni qo'shing (201 Created).", ru: "Теперь добавьте Mikrofon через POST (201 Created)." }, data: { id: 4, nom: "Mikrofon", narx: 6e4, soni: 12 } },
    { label: { uz: "3. GET — qaytadan ko'r", ru: "3. GET — посмотрите снова" }, method: "GET", url: "/api/products", status: 200, hint: { uz: "Yana GET qiling — endi 4 mahsulot bo'ladi!", ru: "Снова сделайте GET — теперь товаров будет 4!" }, data: [...PRODUCTS, NEW_PRODUCT] }
  ];
  const [step, setStep] = useState3(storedAnswer ? 2 : 0);
  const [sent, setSent] = useState3(!!storedAnswer);
  const [sending, setSending] = useState3(false);
  const done = step === 2 && sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, step + (sent ? 1 : 0));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sending || sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };
  const nextStep = () => {
    setStep((s) => s + 1);
    setSent(false);
  };
  const cur = STEPS[step];
  return <Stage eyebrow={tr2({ uz: "Amaliyot", ru: "Практика" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "3 so'rovni bajaring", ru: "Выполните 3 запроса" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'z API'ingizni Postman'da <span className="italic" style={{ color: T.accent }}>chaqiring</span></>, ru: <>Вызовите свой API <span className="italic" style={{ color: T.accent }}>в Postman</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>To'liq yo'lni sinab ko'ring: avval <b style={{ color: METHODS.GET }}>GET</b> bilan ro'yxatni oling, keyin <b style={{ color: METHODS.POST }}>POST</b> bilan yangi mahsulot qo'shing, so'ng yana <b style={{ color: METHODS.GET }}>GET</b> qiling — yangi mahsulot ro'yxatda paydo bo'ladi. Bu — haqiqiy backend ishi.</>, ru: <>Проверьте весь путь: сначала получите список через <b style={{ color: METHODS.GET }}>GET</b>, потом добавьте новый товар через <b style={{ color: METHODS.POST }}>POST</b>, затем снова сделайте <b style={{ color: METHODS.GET }}>GET</b> — новый товар появится в списке. Это настоящая работа бэкендера.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Uch so'rov ketma-ket: Send → «Keyingi so'rov» → Send → «Keyingi so'rov» → Send.", ru: "💡 Три запроса по порядку: Send → «Следующий запрос» → Send → «Следующий запрос» → Send." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="stepbar">
              {STEPS.map((s, i) => {
    const ok = i < step || i === step && sent;
    const isCur = i === step && !ok;
    return <span key={i} className={`stepdot ${ok ? "done" : ""} ${isCur ? "cur" : ""}`}>{ok ? "✓" : i + 1}</span>;
  })}
            </div>
            <Postman method={cur.method} url={cur.url} body={cur.body} sending={sending} sent={sent} status={cur.status} onSend={send} sendLabel="Send" sendDisabled={sent}>
              <JsonBox data={cur.data} />
            </Postman>
            {sent && step < 2 && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={nextStep}>{tr2({ uz: "Keyingi so'rov →", ru: "Следующий запрос →" })}</button>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Vazifa:", ru: "Задача:" })} {tr2(cur.label)}</p>
            {done ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>🎉 Ajoyib! Siz GET → POST → GET qildingiz. Oxirgi GET'da <b>4 ta</b> mahsulot — Mikrofon ro'yxatga qo'shildi. Mana shu — API bilan ishlashning to'liq yo'li.</>, ru: <>🎉 Отлично! Вы сделали GET → POST → GET. В последнем GET — <b>4</b> товара: Mikrofon добавился в список. Вот он — полный цикл работы с API.</> })}</p></div> : sent ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ <b>{cur.status === 201 ? "201 Created" : "200 OK"}</b> — javob keldi. "Keyingi so'rov →" tugmasini bosing.</>, ru: <>✓ <b>{cur.status === 201 ? "201 Created" : "200 OK"}</b> — ответ пришёл. Нажмите «Следующий запрос →».</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2(cur.hint)}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext2(AchMissCtx);
  const [found, setFound] = useState3(!!storedAnswer);
  const [miss, setMiss] = useState3(false);
  const [fixed, setFixed] = useState3(!!storedAnswer);
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(!!storedAnswer);
  const done = sent;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (found ? 1 : 0) + (fixed ? 1 : 0) + (sent ? 1 : 0));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const send = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };
  return <Stage eyebrow={tr2({ uz: "Tekshiruv · 404", ru: "Отладка · 404" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : fixed ? tr2({ uz: "Send bosing", ru: "Нажмите Send" }) : tr2({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>So'rov ishlamadi — <span className="italic" style={{ color: T.accent }}>404? Nega?</span></>, ru: <>Запрос не сработал — <span className="italic" style={{ color: T.accent }}>404? Почему?</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI siz uchun GET so'rov yozdi, lekin server <b style={{ color: STAT[404][1] }}>404 Not Found</b> qaytardi — "bunday manzil yo'q". Status kodi sizga muammoni darrov aytadi. Pastki ikki qator — <b style={{ color: T.ink }}>sarlavhalar</b>: kimga yuborilyapti va javob qaysi ko'rinishda kutilyapti. So'rovni qatorma-qator tekshiring: qaysi qatorda xato bor? Topib, tuzating.</>, ru: <>AI написал для вас GET-запрос, но сервер вернул <b style={{ color: STAT[404][1] }}>404 Not Found</b> — «такого адреса нет». Код статуса сразу подсказывает, в чём проблема. Две нижние строки — <b style={{ color: T.ink }}>заголовки</b>: кому отправляется и в каком виде ожидается ответ. Проверьте запрос строка за строкой: в какой строке ошибка? Найдите и исправьте.</> })}</Mentor>
        {_tip && miss && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Manzilda bitta harf yetishmaydi — xato qatorni bosing, tuzating va qayta Send.", ru: "💡 В адресе не хватает одной буквы — нажмите на строку с ошибкой, исправьте и снова Send." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "Mana so'rov:", ru: "Вот запрос:" })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={found ? { cursor: "default" } : void 0} onClick={() => {
    if (found) return;
    setMiss(true);
    if (achMiss) achMiss.miss(screen);
  }}><MethodBadge method="GET" /></div>
                {fixed ? <div className="ai-line ok" style={{ cursor: "default" }}>/api/products</div> : <div className={`ai-line ${found ? "bad" : ""}`} onClick={() => setFound(true)}>/api/produts</div>}
                {
    /* N10-A: yana ikki haqiqiy qator — tanlov 1/2 dan 1/4 ga tushdi, o'quvchi hammasini o'qishi kerak */
  }
                <div className="ai-line" style={found ? { cursor: "default" } : void 0} onClick={() => {
    if (found) return;
    setMiss(true);
    if (achMiss) achMiss.miss(screen);
  }}>Host: zakaz-shop.uz</div>
                <div className="ai-line" style={found ? { cursor: "default" } : void 0} onClick={() => {
    if (found) return;
    setMiss(true);
    if (achMiss) achMiss.miss(screen);
  }}>Accept: application/json</div>
              </div>
              {!found && <p className="ai-prompt">{tr2({ uz: "Qaysi qatorda xato bor? Bosing.", ru: "В какой строке ошибка? Нажмите." })}</p>}
              {miss && !found && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Bu qatorda xato yo'q — yana qarang.", ru: "В этой строке ошибки нет — посмотрите ещё раз." })}</p></div>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={() => setFixed(true)}>🔧 produts → products</button>}
              {fixed && !sent && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={send}>{tr2({ uz: "▶ Qaytadan Send", ru: "▶ Send ещё раз" })}</button>}
            </div>
            {!done && <AchRule screen={screen} />}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Javob", ru: "Ответ" })}</p>
            {!fixed ? <div className="pm-resp" style={{ marginTop: 0 }}><div className="pm-resp-h"><span className="pm-resp-lbl">Response</span><StatusBadge code={404} punch /></div><div className="pm-respbody"><JsonBox data={{ error: "Not Found", message: tr2({ uz: "Bunday manzil yo'q", ru: "Такого адреса нет" }) }} /></div></div> : !sent ? <div className="frame-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 90 }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Tuzatildi — endi Send bosing", ru: "Исправлено — теперь нажмите Send" })}</p></div> : <><div className="pm-resp" style={{ marginTop: 0 }}><div className="pm-resp-h"><span className="pm-resp-lbl">Response</span><StatusBadge code={200} punch /></div><div className="pm-respbody fade-step"><JsonBox data={PRODUCTS} /></div></div>
                  <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Topdingiz! Bitta harf (c) butun so'rovni ishlatdi. <b>Status kodi — sizning do'stingiz:</b> 404 = manzil noto'g'ri, 200 = hammasi joyida.</>, ru: <>Нашли! Одна буква (c) решила судьбу всего запроса. <b>Код статуса — ваш друг:</b> 404 = адрес неверный, 200 = всё в порядке.</> })}</p></div></>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [method, setMethod] = useState3(storedAnswer ? "POST" : null);
  const [sending, setSending] = useState3(false);
  const [sent, setSent] = useState3(false);
  const [passed, setPassed] = useState3(!!(storedAnswer && (storedAnswer.solved || storedAnswer.correct)));
  const achMiss = useContext2(AchMissCtx);
  const wrongEverRef = useRef3(false);
  const isCorrect = method === "POST";
  const status = isCorrect ? 201 : method === "GET" ? 200 : method === "DELETE" ? 400 : method === "PUT" ? 400 : null;
  const body = { nom: "Mishka", narx: 5e4, soni: 10 };
  const send = () => {
    if (!method || sending) return;
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 850);
  };
  useEffect4(() => {
    if (sent && !isCorrect && !passed) {
      wrongEverRef.current = true;
      if (achMiss) achMiss.miss(screen);
    }
    if (sent && isCorrect && !passed) {
      setPassed(true);
      const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
      onAnswer(screen, { stage: "final", screenIdx: screen, question: "Yangi mahsulot qo'shish uchun to'g'ri so'rovni yig'ing", studentAnswer: method, correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
    }
  }, [sent, isCorrect]);
  const pickMethod = (m) => {
    if (passed) return;
    setMethod(m);
    setSent(false);
  };
  const navLabel = passed ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : method ? sent ? tr2({ uz: "Boshqa method tanlang", ru: "Выберите другой метод" }) : tr2({ uz: "▶ Send bosing", ru: "▶ Нажмите Send" }) : tr2({ uz: "Method tanlang", ru: "Выберите метод" });
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Vazifa: bazaga <span className="italic" style={{ color: T.accent }}>yangi mahsulot qo'shing</span></>, ru: <>Задача: добавьте в базу <span className="italic" style={{ color: T.accent }}>новый товар</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Postman tayyor: URL <span className="mono">/api/products</span> va BODY (yangi mahsulot) yozilgan. Sizdan bittagina narsa kerak — <b style={{ color: T.ink }}>to'g'ri METHOD'ni tanlang</b>. "Yangi narsa qo'shish" qaysi method edi? Tanlab, <b style={{ color: T.ink }}>Send</b> bosing.</>, ru: <>Postman готов: URL <span className="mono">/api/products</span> и BODY (новый товар) уже написаны. От вас нужно одно — <b style={{ color: T.ink }}>выбрать правильный METHOD</b>. Какой метод был «добавить новое»? Выберите и нажмите <b style={{ color: T.ink }}>Send</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman
    method={method}
    url="/api/products"
    body={body}
    methodPicker
    onMethod={pickMethod}
    sending={sending}
    sent={sent}
    status={status}
    onSend={send}
    sendDisabled={!method}
    sendLabel="Send"
  >
              {isCorrect ? <JsonBox data={{ id: 4, ...body }} /> : <JsonBox data={method === "GET" ? PRODUCTS : { error: tr2({ uz: "Bu method yangi mahsulot qo'shmaydi", ru: "Этот метод не добавляет новый товар" }) }} />}
            </Postman>
          </Col>
          <Col>
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: method ? 1 : 0.4, color: method ? T.success : T.ink }}>{method ? "✓" : "1"} {tr2({ uz: "Method tanlandi", ru: "Метод выбран" })}</span>
              <span className="tagpill" style={{ opacity: sent ? 1 : 0.4, color: sent ? T.success : T.ink }}>{sent ? "✓" : "2"} {tr2({ uz: "Send bosildi", ru: "Send нажат" })}</span>
              <span className="tagpill" style={{ opacity: passed ? 1 : 0.4, color: passed ? T.success : T.ink }}>{passed ? "✓" : "3"} 201 Created</span>
            </div>
            {passed ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>🎉 Tabriklaymiz! <b>POST</b> bilan yangi mahsulot qo'shildi — <b>201 Created</b>. Siz endi API bilan gaplasha olasiz!</>, ru: <>🎉 Поздравляем! Новый товар добавлен через <b>POST</b> — <b>201 Created</b>. Теперь вы умеете говорить с API!</> })}</p></div> : sent && !isCorrect ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{method === "GET" ? tr2({ uz: "GET faqat o'qiydi — ro'yxat keldi, lekin yangi narsa qo'shilmadi.", ru: "GET только читает — список пришёл, но ничего нового не добавилось." }) : tr2({ uz: "Bu method yangi mahsulot qo'shmaydi.", ru: "Этот метод не добавляет новый товар." })} {tr2({ uz: <>Eslatma: GET=o'qish, POST=qo'shish, PUT=o'zgartirish, DELETE=o'chirish. Yangi narsa <b>yaratish</b> qaysi method edi? Qayta tanlang.</>, ru: <>Напомним: GET=чтение, POST=добавление, PUT=изменение, DELETE=удаление. Какой метод <b>создаёт</b> новое? Выберите снова.</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: "Method tanlang va Send bosing — shtamp javob beradi.", ru: "Выберите метод и нажмите Send — штамп ответит." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda", ru: "↻ Учу" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
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
var API_FLASHCARDS = [
  { front: { uz: "Sayt server bilan nima orqali gaplashadi?", ru: "Через что сайт общается с сервером?" }, back: "API", note: { uz: "pochta kabi: xat boradi, javob qaytadi", ru: "как почта: письмо ушло — ответ вернулся" } },
  { front: { uz: "So'rov (request) qaysi qismlardan yig'iladi?", ru: "Из каких частей собирается запрос (request)?" }, back: "METHOD + URL (+ BODY)", note: { uz: "niyat + manzil + ichidagi ma'lumot", ru: "намерение + адрес + содержимое" } },
  { front: { uz: "Javob (response) qaysi ikki qismdan iborat?", ru: "Из каких двух частей состоит ответ (response)?" }, back: "STATUS + DATA", note: { uz: "shtamp va JSON ma'lumot", ru: "штамп и данные в JSON" } },
  { front: { uz: "Ma'lumotni o'qib olish uchun qaysi method?", ru: "Каким методом прочитать данные?" }, back: "GET", note: { uz: "hech narsani o'zgartirmaydi", ru: "ничего не меняет" } },
  { front: { uz: "Yangi ma'lumot qo'shish uchun qaysi method?", ru: "Каким методом добавить новые данные?" }, back: "POST", note: { uz: "yangi ma'lumot BODY'da ketadi", ru: "новые данные едут в BODY" } },
  { front: { uz: "Mavjud narxni yangilash uchun qaysi method?", ru: "Каким методом обновить существующую цену?" }, back: "PUT", note: { uz: "yozuv o'chmaydi, ichi yangilanadi", ru: "запись не исчезает — обновляется" } },
  { front: { uz: "Yozuvni o'chirish uchun qaysi method?", ru: "Каким методом удалить запись?" }, back: "DELETE", note: "DELETE /api/products/3" },
  { front: { uz: "GET bazadagi qaysi amalga to'g'ri keladi?", ru: "Какой операции в базе соответствует GET?" }, back: "SELECT", note: { uz: "POST → INSERT, PUT → UPDATE", ru: "POST → INSERT, PUT → UPDATE" } },
  { front: { uz: "200 va 201 shtamplari nimani bildiradi?", ru: "Что означают штампы 200 и 201?" }, back: { uz: "Hammasi joyida", ru: "Всё в порядке" }, note: { uz: "200 — o'qildi, 201 — yangi yozuv yaratildi", ru: "200 — прочитано, 201 — создана новая запись" } },
  { front: { uz: "404 shtampi nimani aytadi?", ru: "О чём говорит штамп 404?" }, back: { uz: "Manzil topilmadi", ru: "Адрес не найден" }, note: { uz: "URL'ni tekshiring — harf xato bo'lishi mumkin", ru: "проверьте URL — возможна опечатка" } },
  { front: { uz: "Sayt yozmasdan API'ni qaysi dasturda sinaysiz?", ru: "В какой программе испытать API, не написав сайт?" }, back: "Postman", note: { uz: "so'rovni o'zingiz yig'ib jo'natasiz", ru: "запрос собираете и отправляете сами" } },
  { front: { uz: "Konvert ichidagi ma'lumot qaysi formatda yoziladi?", ru: "В каком формате пишутся данные внутри конверта?" }, back: "JSON", note: { uz: "kalit: qiymat juftliklari", ru: "пары ключ: значение" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={API_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var ACHIEVEMENTS = {
  envelopeBuilder: { icon: "📮", name: "Envelope Builder!", desc: { uz: "Konvertlarni o'zingiz yig'ib jo'natdingiz", ru: "Вы сами собрали и отправили конверты" } },
  stampReader: { icon: "🔖", name: "Stamp Reader!", desc: { uz: "404 shtampini o'qib, xatoni topib tuzatdingiz", ru: "Вы прочитали штамп 404, нашли и исправили ошибку" } },
  testMaster: { icon: "🎓", name: "Test Master!", desc: { uz: "Method va CRUD mosligini to'g'ri aniqladingiz", ru: "Вы верно сопоставили методы и операции CRUD" } },
  levelUp: { icon: "🚀", name: "Level Up!", desc: { uz: "To'g'ri so'rovni yig'ib, yangi mahsulot qo'shdingiz", ru: "Вы собрали правильный запрос и добавили новый товар" } }
};
var ACH_TRIGGERS = { s3: "envelopeBuilder", s12: "testMaster", s14: "stampReader", s15: "levelUp" };
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
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr2({ uz: "Yangi nishon:", ru: "Новый значок:" })} ${ach.name}`}>
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
var Q_LABELS = { 4: "1 — API", 6: "2 — GET", 10: { uz: "3 — method", ru: "3 — метод" }, 13: { uz: "4 — front↔back", ru: "4 — фронт↔бэк" }, 16: { uz: "5 — yakuniy", ru: "5 — финал" } };
var QUIZ_MS = 15e3;
var QZ_BG_SHAPES = [
  { ch: "GET", l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: "POST", l: 84, t: 7, s: 30, d: 23, dl: 1.5 },
  { ch: "200 OK", l: 8, t: 72, s: 28, d: 27, dl: 0.8 },
  { ch: "201", l: 78, t: 68, s: 30, d: 21, dl: 2.2 },
  { ch: "404", l: 44, t: 86, s: 30, d: 25, dl: 1.1 },
  { ch: "Send", l: 66, t: 26, s: 28, d: 17, dl: 0.4 },
  { ch: "URL", l: 26, t: 34, s: 28, d: 20, dl: 1.9 },
  { ch: "BODY", l: 55, t: 5, s: 26, d: 22, dl: 0.6 },
  { ch: "JSON", l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: "PUT", l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: "DELETE", l: 36, t: 60, s: 26, d: 18, dl: 1.7 }
];
var QUIZ_BANK = [
  { q: { uz: "`GET` so'rovi nima qiladi?", ru: "Что делает запрос `GET`?" }, opts: [{ uz: "Ma'lumotni bazadan butunlay o'chiradi", ru: "Полностью удаляет данные из базы" }, { uz: "Serverga butunlay yangi ma'lumot qo'shib yozadi", ru: "Записывает на сервер совершенно новые данные" }, { uz: "Serverni butunlay o'chirib qo'yadi", ru: "Полностью выключает сервер" }, { uz: "Ma'lumotni o'qib oladi (o'zgartirmaydi)", ru: "Читает данные (не меняет их)" }], correct: 3 },
  { q: { uz: "API nima?", ru: "Что такое API?" }, opts: [{ uz: "Ikki dastur gaplashadigan til va qoidalar", ru: "Язык и правила, на которых общаются две программы" }, { uz: "Server rasmlari saqlanadigan katta papka", ru: "Большая папка, где хранятся картинки сервера" }, { uz: "Sayt sahifasini bezaydigan chizish vositasi", ru: "Инструмент для рисования дизайна сайта" }, { uz: "Internet tezligini oshiradigan maxsus asbob", ru: "Специальный прибор для ускорения интернета" }], correct: 0 },
  { q: { uz: "`201 Created` statusi nimani bildiradi?", ru: "Что означает статус `201 Created`?" }, opts: [{ uz: "Server javob bermay o'chib qoldi", ru: "Сервер выключился, не ответив" }, { uz: "Yangi ma'lumot muvaffaqiyatli yaratildi", ru: "Новые данные успешно созданы" }, { uz: "So'rovda tuzatib bo'lmaydigan xatolik bor", ru: "В запросе неисправимая ошибка" }, { uz: "So'ralgan manzil serverda topilmadi", ru: "Запрошенный адрес не найден на сервере" }], correct: 1 },
  { q: { uz: "`POST` so'rovida BODY nima uchun kerak?", ru: "Зачем нужен BODY в запросе `POST`?" }, opts: [{ uz: "Sahifani chiroyli ko'rsatib turishi uchun", ru: "Чтобы страница красиво выглядела" }, { uz: "Server javobini tezlashtirish uchun", ru: "Чтобы ускорить ответ сервера" }, { uz: "Qo'shiladigan yangi ma'lumotni tashish uchun", ru: "Чтобы передать добавляемые новые данные" }, { uz: "So'rov manzilini yashirib qo'yish uchun", ru: "Чтобы спрятать адрес запроса" }], correct: 2 },
  { q: { uz: "Postman qanday asbob?", ru: "Что за инструмент Postman?" }, opts: [{ uz: "Sayt dizaynini chizadigan grafik dastur", ru: "Графическая программа для рисования дизайна" }, { uz: "Serverga faqat rasm yuklab beradi", ru: "Только загружает картинки на сервер" }, { uz: "Frontend yozmasdan API'ni sinaydi", ru: "Тестирует API без написания фронтенда" }, { uz: "Bazadagi ma'lumotni o'chirib tashlaydi", ru: "Стирает данные из базы" }], correct: 2 },
  { q: { uz: "`404 Not Found` nima demoqchi?", ru: "О чём говорит `404 Not Found`?" }, opts: [{ uz: "Ma'lumot muvaffaqiyatli qaytib keldi", ru: "Данные успешно вернулись" }, { uz: "So'ralgan manzil topilmadi", ru: "Запрошенный адрес не найден" }, { uz: "Yangi yozuv muvaffaqiyatli yaratildi", ru: "Новая запись успешно создана" }, { uz: "Serverga kirish taqiqlab qo'yilgan", ru: "Доступ к серверу запрещён" }], correct: 1 },
  { q: { uz: "Mahsulot narxini yangilash uchun qaysi method?", ru: "Каким методом обновить цену товара?" }, opts: ["POST", "DELETE", "GET", "PUT"], correct: 3 },
  { q: { uz: "So'rov (request) qismlari qaysilar?", ru: "Из чего состоит запрос (request)?" }, opts: ["METHOD + URL (+ BODY)", { uz: "Faqat rang, shrift va bezaklar", ru: "Только цвета, шрифты и украшения" }, { uz: "Faqat rasm va videolar", ru: "Только картинки и видео" }, { uz: "Faqat login va parol", ru: "Только логин и пароль" }], correct: 0 },
  { q: { uz: "`DELETE /api/products/3` nima qiladi?", ru: "Что сделает `DELETE /api/products/3`?" }, opts: [{ uz: "3-mahsulotni o'chiradi", ru: "Удалит товар с id 3" }, { uz: "Yangi mahsulot qo'shadi", ru: "Добавит новый товар" }, { uz: "Ro'yxatni o'qib beradi", ru: "Прочитает и вернёт список" }, { uz: "Narxni oshirib qo'yadi", ru: "Поднимет цену" }], correct: 0 },
  { q: { uz: "`GET` bazadagi qaysi SQL amaliga to'g'ri keladi?", ru: "Какой SQL-операции соответствует `GET`?" }, opts: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2 },
  { q: { uz: "Sayt ma'lumot kerak bo'lganda nima qiladi?", ru: "Что делает сайт, когда ему нужны данные?" }, opts: [{ uz: "Bazaga to'g'ridan-to'g'ri o'zi kiradi", ru: "Сам напрямую заходит в базу" }, { uz: "Hech kim bilan bog'lanmay o'zi ishlaydi", ru: "Работает сам, ни с кем не связываясь" }, { uz: "Boshqa saytdan tayyor nusxa oladi", ru: "Берёт готовую копию с другого сайта" }, { uz: "API'ga so'rov yuboradi, javob oladi", ru: "Отправляет запрос в API и получает ответ" }], correct: 3 },
  { q: { uz: "Javob konverti (response) nimalardan iborat?", ru: "Из чего состоит конверт-ответ (response)?" }, opts: [{ uz: "Faqat ichiga solingan bitta rasm fayli", ru: "Только один вложенный файл-картинка" }, { uz: "STATUS (shtamp) + DATA (JSON)", ru: "STATUS (штамп) + DATA (JSON)" }, { uz: "Faqat foydalanuvchi paroli", ru: "Только пароль пользователя" }, { uz: "Faqat so'rov manzili (URL)", ru: "Только адрес запроса (URL)" }], correct: 1 }
];
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
          <span className="cs-hud-i">{tr2({ uz: "🏆 PODIUM", ru: "🏆 ПОДИУМ" })}</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
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
function QzFX() {
  const ref = useRef3(null);
  useEffect4(() => {
    const cv = ref.current;
    if (!cv) return;
    if (typeof window === "undefined") return;
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
    const TOK = ["GET", "POST", "200 OK", "201", "404", "Send", "URL", "BODY", "JSON", "📮"];
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
      if (typeof window !== "undefined" && !window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжайте тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Ждите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr2({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>}
        </div>}

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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Будьте быстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас на ${myRank + 1}-м месте` })}</span>}
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

      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr2({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? tr2({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr2({ uz: "↻ Qayta ishlash", ru: "↻ Пройти ещё раз" })}</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{myRank + 1}-{tr2({ uz: "o'rin", ru: "е место" })}</b> · {board[myRank].pts} {tr2({ uz: "ball", ru: "баллов" })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест ещё раз — тренировка (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
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
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Загружаем результаты…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
            <Confetti />
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{myIdx + 1}-{tr2({ uz: "o'rin", ru: "е место" })}</b> ({board[myIdx].okCount}/{totalQ} {tr2({ uz: "to'g'ri", ru: "верно" })})</p>}
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
          </>}
      </div>
    </Stage>;
};
var PRACTICE_BASE = 500;
var MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState3({ players: null, doneIds: /* @__PURE__ */ new Set() });
  useEffect4(() => {
    if (!live || live.mode !== "mentor" || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players2, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players: players2, doneIds: new Set(rows.map((r) => r.player_id)) });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== "mentor") return null;
  if (data.players === null || data.players.length === 0) return null;
  const players = data.players;
  const doers = players.filter((p) => data.doneIds.has(p.id));
  const waiting = players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr2({ uz: "👀 Kim bajardi —", ru: "👀 Кто выполнил —" })} {doers.length}/{players.length}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {doers.map((p) => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
        {waiting.map((p) => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
      </div>
    </div>;
};
var StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState3(null);
  useEffect4(() => {
    if (!live || live.mode !== "student" || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ total: players.length, done: new Set(rows.map((r) => r.player_id)).size });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== "student" || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return <div className="done-mini fade-up">
      👥 {tr2({ uz: "Sinfda:", ru: "В классе:" })} <b>{data.done}</b> {tr2({ uz: "bajardi", ru: "выполнили" })}
      {doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr2({ uz: "hali bajarmoqda", ru: "ещё выполняют" })}</span>}
    </div>;
};
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext2(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentor = !!(_live && _live.mode === "mentor");
  const [checked, setChecked] = useState3(() => /* @__PURE__ */ new Set());
  const [done, setDone] = useState3(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked((prev) => {
    const s = new Set(prev);
    if (s.has(i)) s.delete(i);
    else s.add(i);
    return s;
  });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: "practice", screenIdx: screen, practice: title && title.uz || title, solved: true, correct: true, picked: true });
    if (_live && _live.mode === "student") _live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
  };
  return <Stage eyebrow={tr2({ uz: "Amaliyot · VS Code", ru: "Практика · VS Code" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval bajaring", ru: "Сначала выполните" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2(title)}</h2></div>
        <Mentor>{isMentor ? tr2({ uz: <>O'quvchilar topshiriqni <b style={{ color: T.ink }}>o'z kompyuterida</b> bajarmoqda. Nechtasi tugatgani pastda ko'rinadi — hamma tayyor bo'lgach davom eting.</>, ru: <>Ученики выполняют задание <b style={{ color: T.ink }}>на своих компьютерах</b>. Сколько закончили — видно ниже; продолжайте, когда будут готовы все.</> }) : tr2({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник наблюдает.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr2({ uz: "TOPSHIRIQ", ru: "ЗАДАНИЕ" })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr2(task)}</p>
            </div>
            {!isMentor && <button className={`lp-done-btn ${done ? "is-done" : ""}`} disabled={done} onClick={complete}>
              {done ? tr2({ uz: "✓ Bajarildi — ustozni kuting", ru: "✓ Выполнено — ждите наставника" }) : tr2({ uz: "✅ Bajardim", ru: "✅ Выполнил" })}
            </button>}
            {done && !isMentor && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: "Отлично! Задание выполнено. Наставник проверит и переведёт вас на следующий шаг." })}</p></div>}
            <MentorPracticeStats live={_live} screen={screen} />
            <StudentPracticePulse live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Bosqichlar — belgilab boring", ru: "Шаги — отмечайте по ходу" })}</p>
            <div className="lp-steps fade-up delay-2">
              {checklist.map((c, i) => {
    const on = checked.has(i);
    return <button key={i} className={`lp-step ${on ? "on" : ""}`} onClick={() => toggle(i)}>
                    <span className="lp-check">{on ? "✓" : i + 1}</span>
                    <span className="lp-step-t">{fmtCode(tr2(c))}</span>
                  </button>;
  })}
            </div>
          </Col>
        </div>
      </div>
    </Stage>;
}
var ScreenPostmanPractice = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "Postman'da o'z API'ingizni sinang", ru: "Проверьте свой API в Postman" }}
  task={{ uz: "O'z serveringizga (yoki ochiq API'ga) Postman yoki Thunder Client orqali GET va POST so'rov yuboring — qaytgan status shtampini (200/201) va JSON javobni o'qing.", ru: "Отправьте GET- и POST-запросы к своему серверу (или открытому API) через Postman или Thunder Client — прочитайте штамп статуса (200/201) и JSON-ответ." }}
  checklist={[
    { uz: "Postman yoki VS Code'dagi Thunder Client'ni oching", ru: "Откройте Postman или Thunder Client в VS Code" },
    { uz: "`GET /api/products` so'rovini yuboring — Send bosing", ru: "Отправьте запрос `GET /api/products` — нажмите Send" },
    { uz: "Qaytgan `200 OK` shtampini va JSON ro'yxatni ko'ring", ru: "Посмотрите вернувшийся штамп `200 OK` и JSON-список" },
    { uz: "`POST /api/products` tanlab, BODY'ga yangi mahsulot yozing", ru: "Выберите `POST /api/products` и напишите в BODY новый товар" },
    { uz: "Send bosing — `201 Created` shtampini o'qing", ru: "Нажмите Send — прочитайте штамп `201 Created`" },
    { uz: "Yana `GET` qiling — yangi mahsulot ro'yxatda paydo bo'lganini tekshiring", ru: "Снова сделайте `GET` — проверьте, что новый товар появился в списке" }
  ]}
/>;
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
  const RECAP = [
    { uz: "API — sayt va server gaplashadigan til/qoidalar", ru: "API — язык/правила, на которых общаются сайт и сервер" },
    { uz: "So'rov = METHOD + URL (+ BODY); javob = STATUS + DATA", ru: "Запрос = METHOD + URL (+ BODY); ответ = STATUS + DATA" },
    "GET·POST·PUT·DELETE = SELECT·INSERT·UPDATE·DELETE",
    { uz: "Postman — frontend yozmasdan API'ni sinash asbobi", ru: "Postman — инструмент для проверки API без фронтенда" },
    { uz: "Status: 200 OK · 201 Created · 404 Not Found", ru: "Статусы: 200 OK · 201 Created · 404 Not Found" }
  ];
  const HOMEWORK = [
    { b: { uz: "Postman'ni o'rnating", ru: "Установите Postman" }, t: { uz: "— postman.com'dan yuklab oling (bepul)", ru: "— скачайте с postman.com (бесплатно)" } },
    { b: { uz: "Ochiq API'ni chaqiring", ru: "Вызовите открытый API" }, t: { uz: "— GET so'rov yuboring va kelgan JSON javobni ko'ring", ru: "— отправьте GET-запрос и посмотрите пришедший JSON" } },
    { b: { uz: "4 method'ni eslang", ru: "Запомните 4 метода" }, t: { uz: "— har biri qaysi CRUD amaliga to'g'ri kelishini yozib chiqing", ru: "— выпишите, какой операции CRUD соответствует каждый" } }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Dars tugadi", ru: "Урок окончен" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>API bilan</span> gaplasha olasiz.</>, ru: <>Теперь вы умеете <span className="italic" style={{ color: T.accent }}>говорить с API</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0} />
        </div>
        {arena && <QuizArena live={_live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr2({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr2(r)}</span></li>)}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{tr2(h.b)}</b> <span className="t">{tr2(h.t)}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "Keyingi: Backend praktika — o'z CRUD loyihangiz. Keyin NestJS bilan API'ni haqiqiy loyihadagidek yozamiz! 🚀", ru: "Дальше: практика по бэкенду — ваш собственный CRUD-проект. А потом напишем API на NestJS — как в настоящем проекте! 🚀" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz —", ru: "🏅 Ваши значки —" })} {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
function ApiPostmanLesson({ lang: langProp, onFinished, liveToken }) {
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
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect4(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
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
    if (_m && _m.scored && _m.scope === "final" && data && data.solved && live.mode === "student") live.submitAnswer(idx, _m.id, data.picked === 1 ? 1 : 0, !!data.correct, 0);
  };
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPostmanPractice, ScreenPodium, ScreenFlashcards, Screen16];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
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
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; transition: color 0.3s; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

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

        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        /* 🔓 klapan ipuchasi (m4-08 bilan bir xil): .bhint — ipucha, .bhint.calm — «Davom etish» ochildi */
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }

        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
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

        /* === 4-MODUL · 6-DARS: API + POSTMAN === */
        /* JSON ko'rinishi */
        .json-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.45vw,13px); line-height: 1.6; padding: 12px 14px; border-radius: 10px; margin: 0; overflow-x: auto; white-space: pre; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04); }
        .json-box.sm { font-size: 11.5px; padding: 9px 11px; line-height: 1.5; }
        .json-box .j-key { color: ${CODE.attr}; } .json-box .j-str { color: ${CODE.str}; } .json-box .j-num { color: #7FB3FF; }

        /* method badge */
        .mbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; border-radius: 6px; letter-spacing: 0.03em; display: inline-block; }
        .maprow { display: flex; align-items: center; gap: 10px; }
        .maparrow { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.ink3}; }

        /* status badge */
        /* Javob shtampi — server bosgan retro pochta muhri (qiya, ikki halqali) */
        .status-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; padding: 2px 9px; border-radius: 6px; white-space: nowrap; border: 2px solid currentColor; transform: rotate(-3.5deg); box-shadow: inset 0 0 0 1.5px ${T.paper}; }
        /* 📭 SHTAMP «bosilib urilish» — server javob-konvertga muhr bosadi (darsning yodda qoladigan lahzasi) */
        .status-badge.sb-ok { animation: sb-punch-ok .52s cubic-bezier(.3,1.45,.5,1) both; }
        .status-badge.sb-err { animation: sb-punch-err .62s cubic-bezier(.34,1.2,.5,1) both; transform-origin: center; }
        .status-badge.sb-warn { animation: sb-punch-warn .62s cubic-bezier(.34,1.2,.5,1) both; transform-origin: center; }
        /* yashil 200/201 — yumshoq bounce */
        @keyframes sb-punch-ok { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 40% { transform: rotate(-3.5deg) scale(.84); opacity: 1; } 62% { transform: rotate(-3.5deg) scale(1.12); } 80% { transform: rotate(-3.5deg) scale(.96); } 100% { transform: rotate(-3.5deg) scale(1); } }
        /* qizil 404 — bosilib, keyin titrash (qaltirash) */
        @keyframes sb-punch-err { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 34% { transform: rotate(-3.5deg) scale(.9); opacity: 1; } 46% { transform: rotate(-3.5deg) translateX(-3px); } 56% { transform: rotate(-3.5deg) translateX(3px); } 66% { transform: rotate(-3.5deg) translateX(-2.5px); } 76% { transform: rotate(-3.5deg) translateX(2px); } 86% { transform: rotate(-3.5deg) translateX(-1px); } 100% { transform: rotate(-3.5deg) translateX(0); } }
        /* to'q sariq 400 — bosilib, keyin silkinish (burchak titrash) */
        @keyframes sb-punch-warn { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 34% { transform: rotate(-3.5deg) scale(.9); opacity: 1; } 50% { transform: rotate(-11deg) scale(1.04); } 64% { transform: rotate(2deg); } 78% { transform: rotate(-7deg); } 90% { transform: rotate(-1deg); } 100% { transform: rotate(-3.5deg); } }
        /* shtamp URILGANDA — ostidan zarba to'lqini tarqaladi */
        .status-badge.sb-punch { position: relative; }
        .status-badge.sb-punch::after { content: ''; position: absolute; inset: -5px; border-radius: 9px; border: 2px solid currentColor; opacity: 0; pointer-events: none; animation: sb-ripple 0.6s ease-out 0.14s both; }
        @keyframes sb-ripple { 0% { transform: scale(0.72); opacity: 0.5; } 100% { transform: scale(1.55); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .status-badge.sb-ok, .status-badge.sb-err, .status-badge.sb-warn { animation: sb-punch-calm .3s ease-out both; } @keyframes sb-punch-calm { from { opacity: 0; } to { opacity: 1; } } .status-badge.sb-punch::after { display: none; } }

        /* POSTMAN mock */
        .postman { background: ${T.paper}; border-radius: 13px; overflow: hidden; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.18); }
        /* Postman ilova oynasi — chrome: dots + ilova nomi + so'rov tab'i (haqiqiy dastur ko'rinishi) */
        .pm-chrome { display: flex; align-items: center; gap: 9px; padding: 8px 11px 0; background: #f0eee8; }
        .pm-app { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: ${T.ink2}; padding-bottom: 8px; }
        .pm-app::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: ${T.accent}; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85); }
        .pm-chrome .bb-dots { padding-bottom: 8px; }
        .pm-tab { margin-left: auto; max-width: 58%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px; font-weight: 600; color: ${T.ink2}; background: #FBFAF7; border-radius: 7px 7px 0 0; padding: 6px 11px; }
        .pm-bar { display: flex; align-items: center; gap: 8px; padding: 9px 10px; background: #FBFAF7; border-bottom: 1px solid #EFECE5; }
        .pm-method { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 8px; background: ${T.bg}; flex-shrink: 0; }
        .pm-methods { display: flex; gap: 4px; flex-shrink: 0; }
        .pm-mbtn { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 11px; border: none; border-radius: 7px; padding: 5px 8px; cursor: pointer; transition: all 0.15s; }
        .pm-mbtn:hover { transform: translateY(-1px); }
        .pm-url { flex: 1; min-width: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink}; overflow-x: auto; white-space: nowrap; padding: 4px 8px; background: #fff; border-radius: 7px; box-shadow: inset 0 0 0 1px #EFECE5; }
        .pm-send { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: #fff; background: ${T.accent}; border: none; border-radius: 8px; padding: 6px 16px; cursor: pointer; flex-shrink: 0; transition: all 0.16s; }
        .pm-send:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(255,79,40,0.5); }
        .pm-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .pm-body { padding: 9px 11px; border-bottom: 1px solid #EFECE5; }
        .pm-bodylbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink3}; display: block; margin-bottom: 5px; }
        /* Javob paneli: Postman oynasi ichida — tekis; yakka holda (14-ekran) — o'z kartasi */
        .pm-resp { padding: 10px 12px; background: ${T.paper}; border-radius: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); }
        .postman .pm-resp { border-radius: 0; box-shadow: none; }
        .pm-resp-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        .pm-resp-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink3}; }
        .pm-loading { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.accent}; padding: 14px 4px; }
        /* SEND MOMENTI — konvert haqiqatan "ketadi": uchish + simda oqim + tugma nafas oladi */
        .pm-flytrack { position: relative; display: inline-block; width: 62px; height: 20px; flex-shrink: 0; overflow: hidden; }
        .pm-fly { position: absolute; left: 0; top: 0; font-size: 16px; line-height: 20px; animation: pm-envfly 0.85s cubic-bezier(.5,0,.4,1) infinite; }
        @keyframes pm-envfly { 0% { transform: translateX(-4px) rotate(-8deg); opacity: 0; } 15% { opacity: 1; } 72% { opacity: 1; } 100% { transform: translateX(48px) rotate(8deg); opacity: 0; } }
        .postman.is-sending .pm-bar { position: relative; overflow: hidden; }
        .postman.is-sending .pm-bar::after { content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 34%; background: linear-gradient(90deg, transparent, ${T.accent}, transparent); animation: pm-wire 0.85s linear infinite; }
        @keyframes pm-wire { from { transform: translateX(-110%); } to { transform: translateX(400%); } }
        .postman.is-sending .pm-send { animation: pm-send-throb 0.85s ease-in-out infinite; }
        @keyframes pm-send-throb { 0%,100% { transform: scale(1); box-shadow: 0 4px 10px -5px rgba(255,79,40,0.5); } 50% { transform: scale(1.04); box-shadow: 0 8px 20px -5px rgba(255,79,40,0.75); } }
        .pm-send:active:not(:disabled) { transform: scale(0.94); }
        .pm-empty { font-size: 12.5px; color: ${T.ink3}; font-style: italic; padding: 12px 4px; }
        .pm-respbody { }

        /* API oqimi (s2) */
        .apiflow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .apinode { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; border: none; border-radius: 11px; padding: 12px 13px; cursor: pointer; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.16s; flex: 1; min-width: 0; }
        .apinode:hover { transform: translateY(-1px); }
        .apinode.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -5px rgba(255,79,40,0.4); }
        .apinode.seen:not(.on) { background: #FBFAF7; }
        .apiarrow { color: ${T.ink3}; font-weight: 700; flex-shrink: 0; }
        /* affordance: hali bosilmagan qism "meni bos" deb pulslaydi; bosilgani ✓ bilan muhrlanadi */
        .apinode.tap-hint, .crud-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .tick-pop { display: inline-block; animation: tick-pop 0.42s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.35) rotate(6deg); opacity: 1; } 100% { transform: scale(1) rotate(0); opacity: 1; } }

        /* so'rov/javob konvert (s3) */
        .envcard { display: flex; flex-direction: column; gap: 7px; border-radius: 12px; padding: 11px; }
        /* chiquvchi (siz → server) — accent chekka; qaytgan (server → siz) — yashil chekka */
        .envcard.req { background: ${T.accentSoft}; border-left: 3px solid ${T.accent}; }
        .envcard.res { background: ${T.successSoft}; border-left: 3px solid ${T.success}; }
        .envpart { display: flex; align-items: center; gap: 9px; background: #fff; border: none; border-radius: 9px; padding: 9px 12px; cursor: pointer; transition: all 0.15s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16); text-align: left; }
        .envpart:hover { transform: translateX(2px); }
        .envpart.on { box-shadow: inset 0 0 0 1.5px ${T.ink}; }
        .ep-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 9.5px; letter-spacing: 0.1em; color: ${T.ink3}; margin-left: auto; }

        /* s3 KONVERT YIG'ISH — sudrab/bosib joylash */
        .env-pool-h { display: flex; align-items: center; justify-content: space-between; }
        .env-count { font-weight: 800; font-size: 12px; color: ${T.accent}; animation: env-count-bump 0.4s cubic-bezier(.3,1.5,.5,1); }
        @keyframes env-count-bump { 0% { transform: scale(1); } 42% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .env-pool { display: flex; flex-wrap: wrap; gap: 8px; min-height: 48px; padding: 10px; border-radius: 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); align-items: center; }
        .env-pool-done { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; animation: fade-step 0.35s ease-out both; }
        /* sudraladigan bo'lak: touch-action:none — barmoq bilan ham suriladi */
        .envpart.chip { touch-action: none; user-select: none; cursor: grab; }
        .envpart.chip:hover { transform: translateY(-2px); box-shadow: 0 9px 20px -7px rgba(${T.shadowBase},0.3); }
        .envpart.chip:active { cursor: grabbing; }
        .envpart.chip.sel { box-shadow: 0 0 0 2px ${T.accent}, 0 10px 20px -7px rgba(255,79,40,0.4); transform: translateY(-2px); }
        .envpart.chip.reject { animation: env-reject 0.5s cubic-bezier(.3,1.2,.5,1); }
        @keyframes env-reject { 0% { transform: translateY(0); } 22% { transform: translateY(-9px) scale(1.05) rotate(-2deg); } 44% { transform: translateX(-5px) rotate(1deg); } 62% { transform: translateX(5px) rotate(-1deg); } 80% { transform: translateX(-3px); } 100% { transform: none; } }
        /* affordance: hali joylanmagan bo'lak "meni sudra" deb pulslaydi — to'lqin bo'lib, birvarakayiga emas */
        .envpart.chip.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .env-pool .envpart.chip.tap-hint:nth-child(2) { animation-delay: 0.16s; }
        .env-pool .envpart.chip.tap-hint:nth-child(3) { animation-delay: 0.32s; }
        .env-pool .envpart.chip.tap-hint:nth-child(4) { animation-delay: 0.48s; }
        .env-pool .envpart.chip.tap-hint:nth-child(5) { animation-delay: 0.64s; }
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.42); } 70%,100% { box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16), 0 0 0 9px rgba(255,79,40,0); } }
        .env-tip { margin: 0; color: ${T.ink2}; animation: fade-step 0.3s ease-out both; }
        /* konvert = tashlash zonasi */
        .env-zone { position: relative; transition: box-shadow 0.2s, transform 0.2s; }
        .env-zone.hot { box-shadow: 0 0 0 2px ${T.accent}, 0 12px 26px -8px rgba(255,79,40,0.3); transform: translateY(-2px); }
        .env-zone.res.hot { box-shadow: 0 0 0 2px ${T.success}, 0 12px 26px -8px rgba(31,122,77,0.3); }
        .env-slot { display: flex; align-items: center; min-height: 38px; padding: 9px 12px; border-radius: 9px; border: 1.5px dashed rgba(${T.shadowBase},0.22); font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; font-style: italic; }
        .envpart.placed { animation: env-settle 0.5s cubic-bezier(.3,1.5,.5,1); }
        @keyframes env-settle { 0% { transform: translateY(-12px) scale(1.07); opacity: 0; } 55% { transform: translateY(2px) scale(0.96); opacity: 1; } 78% { transform: translateY(-1px) scale(1.02); } 100% { transform: none; } }
        /* konvert to'lganda — muhrlanadi */
        .env-seal { position: absolute; right: 8px; top: -10px; font-size: 20px; animation: env-seal-drop 0.55s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes env-seal-drop { 0% { transform: translateY(-16px) scale(1.9) rotate(-18deg); opacity: 0; } 45% { transform: translateY(0) scale(0.9) rotate(4deg); opacity: 1; } 70% { transform: scale(1.08) rotate(-2deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .env-zone.sealed { box-shadow: inset 0 0 0 1.5px ${T.success}55; }

        /* CRUD/method karta (s10) */
        .crud-card { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 13px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .crud-card:hover { transform: translateY(-1px); }
        .crud-card.seen { background: #FBFAF7; }
        .crud-word { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; }
        .crud-uz { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }

        /* sayohat (s11) */
        .jflow { position: relative; display: flex; justify-content: space-between; gap: 6px; padding: 6px 0 30px; }
        .jnode { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 12px; padding: 12px 6px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.25s; }
        .jnode-ic { font-size: 24px; } .jnode-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; text-align: center; }
        /* konvert qaysi bekatga yetsa — o'sha bekat "jonlanadi" */
        .jnode.on { animation: jnode-ping 0.9s ease-out; }
        @keyframes jnode-ping { 0% { transform: scale(1); } 26% { transform: scale(1.07) translateY(-3px); } 55% { transform: scale(0.99); } 100% { transform: scale(1); } }
        .jtrack { position: absolute; left: 0; right: 0; bottom: 4px; height: 22px; }
        .jenv { position: absolute; bottom: 0; font-size: 22px; transition: left 0.85s cubic-bezier(.45,0,.25,1); transform: translateX(-50%); animation: jenv-bob 1.6s ease-in-out infinite; }
        @keyframes jenv-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -4px; } }
        .jnote { background: ${T.paper}; border-radius: 11px; padding: 12px 15px; min-height: 46px; display: flex; align-items: center; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.12); }

        /* amaliyot stepbar (s13) */
        .stepbar { display: flex; gap: 8px; }
        .stepdot { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); }
        .stepdot.cur { background: ${T.accent}; color: #fff; box-shadow: none; }
        .stepdot.done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }

        /* hook do'kon + konvert uchish */
        .shopmock { display: flex; gap: 8px; flex-wrap: wrap; }
        .shop-card { flex: 1; min-width: 84px; background: #fff; border-radius: 11px; padding: 11px; box-shadow: 0 4px 14px -6px rgba(${T.shadowBase},0.18); display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
        .shop-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 13.5px; color: ${T.ink}; }
        .shop-narx { font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.accent}; font-weight: 700; }
        /* F-0824-07: PUT va DELETE ekranlarida o'zgarish KO'RSATILADI, aytilmaydi.
           Ilgari yashil quti «narxi 120 000 dan 99 000 ga tushdi» derdi, lekin eski narx
           ekranda umuman yo'q edi — o'quvchi faqat o'zi yuborgan raqamni ko'rardi.
           Do'kon maketi 0-ekranda tanishtirilgan, ya'ni yangi obraz kiritilmayapti.
           Ustun ko'rinishi: uchta qator, faqat bittasi o'zgaradi — bu WHERE id=1 ni
           so'zsiz tushuntiradi. Eski qiymat ustiga chizilib QOLADI: yo'qolib ketsa,
           o'quvchi uchun bu yana oddiy raqam almashuvi bo'lardi. */
        .shopmock.col { flex-direction: column; gap: 7px; }
        .shopmock.col .shop-card { flex: none; width: 100%; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; transition: box-shadow 0.25s, opacity 0.45s, transform 0.45s; }
        .shop-card.hit { box-shadow: inset 0 0 0 2px ${T.success}, 0 6px 18px -7px rgba(${T.shadowBase},0.24); animation: shop-hit 0.75s cubic-bezier(.3,1.2,.5,1); }
        @keyframes shop-hit { 0% { transform: scale(1); } 34% { transform: scale(1.035); } 100% { transform: scale(1); } }
        .shop-card.gone { opacity: 0.34; transform: translateX(14px); box-shadow: none; }
        .shop-card.gone .shop-name, .shop-card.gone .shop-narx { text-decoration: line-through; color: ${T.ink3}; }
        .narx-old { color: ${T.ink3}; text-decoration: line-through; font-weight: 600; margin-right: 7px; }
        .narx-new { color: ${T.success}; }
        @media (prefers-reduced-motion: reduce) { .shop-card.hit { animation: none; } .shopmock.col .shop-card { transition: none; } }
        .flyrow { display: flex; align-items: center; gap: 10px; }
        .flynode { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; background: ${T.paper}; padding: 8px 12px; border-radius: 9px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .flytrack { position: relative; flex: 1; height: 26px; }
        .flyenv { position: absolute; top: 0; font-size: 21px; left: 0; transition: none; }
        .flyenv.flying { animation: flyacross 1.1s cubic-bezier(.45,0,.25,1) forwards; }
        .flyenv.done { left: 0; }
        @keyframes flyacross { 0% { left: 0; } 45% { left: calc(100% - 21px); transform: scale(1); } 50% { left: calc(100% - 21px); } 55% { transform: scaleX(-1); } 100% { left: 0; transform: scaleX(-1); } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== v18 QATLAMLAR CSS (L1/ReactApiGet etalondan) ===== */
        /* === 🛠️ JONLI PRAKTIKA (VS Code-uslub, self-report) === */
        .lp-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; border-left: 4px solid ${T.accent}; }
        .lp-task-h { display: flex; align-items: center; gap: 8px; }
        .lp-task-badge { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 10.5px; letter-spacing: 0.12em; color: #fff; background: ${T.accent}; padding: 3px 9px; border-radius: 6px; }
        .lp-steps { display: flex; flex-direction: column; gap: 8px; }
        .lp-step { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 8px 12px; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; cursor: pointer; transition: all 0.16s; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .lp-check { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; transition: all 0.16s; }
        .lp-step.on .lp-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .lp-step-t { flex: 1; min-width: 0; }
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }
        /* O'quvchi ko'radigan sinf-pulsi (StudentPracticePulse, 4-Modul standarti) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
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
        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
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
        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }
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
        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; filter: saturate(.4) brightness(.65); } 51% { opacity: 1; filter: none; } 57% { opacity: .55; filter: saturate(.5) brightness(.75); } 66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
        .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
        @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
        .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
        @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
        .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
        @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
        .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
        .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
        @keyframes cs-bolt-strike { 0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } 5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); } 9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); } 13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); } 20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none; background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow { 0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); } 50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }
        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) — L1 etalondan ===== */
        /* 11.15 — sekundar UI xira: LiveBadge kerak bo'lguncha ko'zga tashlanmaydi (L1 etaloni) */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(${T.shadowBase},0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) — mentor natijani ochguncha «nafas olish» pulsatsiyasi */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: option-wait-breathe 1.8s ease-in-out infinite; }
        @keyframes option-wait-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.28); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 10px 30px -6px rgba(1,154,203,0.55); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
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

        /* --- kod-atama chip (fmtCode) arena variantlari --- */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* --- CodeStrike bolt FX qatlami --- */
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }

        /* ===== HARAKATNI KAMAYTIRISH — takrorlanuvchi/og'ir animatsiyalarga tinch variant ===== */
        @media (prefers-reduced-motion: reduce) {
          .envpart.chip.tap-hint, .apinode.tap-hint, .crud-card.tap-hint,
          .envpart.chip.reject, .envpart.placed, .env-seal, .env-count,
          .pm-fly, .postman.is-sending .pm-bar::after, .postman.is-sending .pm-send,
          .jenv, .jnode.on, .tick-pop, .flyenv.flying { animation: none !important; }
          .env-zone, .envpart, .pm-send, .apinode, .crud-card { transition: none !important; }
        }
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={tr2({ uz: "API va Postman darsi", ru: "Урок «API и Postman»" })} /> : <>
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
  ApiPostmanLesson as default
};
