// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/JsIntroLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/2-Modull/JsIntroLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/JsIntroLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useRef as useRef3, useCallback as useCallback2, createContext as createContext2, useContext as useContext2 } from "react";

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
  try {
    store()?.removeItem(KEY(lessonId));
  } catch {
  }
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

// src/2-Modull/JsIntroLesson.jsx
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
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var useLang = () => useContext2(LangContext);
var __lang = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
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
var AudioEngine = class {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.currentUtterance = null;
    this.onStateChange = null;
    this.waitingFor = null;
    this.voicesByLang = { ru: null, uz: null };
    this.voicesReady = false;
    this.currentLang = "uz";
    this.initVoices();
  }
  initVoices() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load2 = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesByLang.uz = v.find((x) => x.lang.startsWith("uz")) || v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesReady = true;
    };
    load2();
    if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = load2;
  }
  setLang(l) {
    this.currentLang = l;
  }
  getVoice() {
    return this.voicesByLang[this.currentLang] || this.voicesByLang.ru || null;
  }
  hasUz() {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().some((v) => v.lang.startsWith("uz"));
  }
  loadQueue(s) {
    this.stop();
    this.queue = s;
    this.currentIdx = 0;
    this.waitingFor = null;
  }
  playSegment(seg) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(seg.text);
    const useUz = this.currentLang === "uz" && this.hasUz();
    u.lang = useUz ? "uz-UZ" : "ru-RU";
    u.rate = 0.95;
    u.pitch = 1;
    const v = this.getVoice();
    if (v) u.voice = v;
    u.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: seg.id });
    };
    u.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleEnd(seg);
    };
    u.onerror = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
    };
    this.currentUtterance = u;
  }
  handleEnd(seg) {
    if (seg.waits_for) {
      this.waitingFor = seg.waits_for;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: seg.waits_for });
    } else {
      this.currentIdx++;
      this.playNext();
    }
  }
  playNext() {
    if (this.currentIdx >= this.queue.length) return;
    this.playSegment(this.queue[this.currentIdx]);
  }
  start() {
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }
  triggerEvent(type, target) {
    if (!this.waitingFor) return;
    const m = this.waitingFor.type === type && (this.waitingFor.target === target || !this.waitingFor.target);
    if (m) {
      this.waitingFor = null;
      this.currentIdx++;
      this.playNext();
    }
  }
  pushOneOff(text) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: "manual", waits_for: null });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }
  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }
  stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    this.isPlaying = false;
    this.currentUtterance = null;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
};
var audioEngineInstance = null;
var getAudioEngine = () => {
  if (typeof window === "undefined") return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};
function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState3({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef3(null);
  const segmentsRef = useRef3(segments);
  const key = segments ? JSON.stringify(segments) : "";
  const prevKey = useRef3(key);
  if (prevKey.current !== key) {
    segmentsRef.current = segments;
    prevKey.current = key;
  }
  const stable = segmentsRef.current;
  useEffect4(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.onStateChange = (s) => setState((p) => ({ ...p, ...s }));
    if (stable && stable.length > 0 && !state.muted) {
      engine.loadQueue(stable);
      const t = setTimeout(() => engine.start(), 300);
      return () => {
        clearTimeout(t);
        engine.stop();
      };
    }
    return () => {
      if (engine) engine.stop();
    };
  }, [stable, lang]);
  const triggerEvent = useCallback2((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const replay = useCallback2(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback2(() => {
    setState((p) => {
      const m = !p.muted;
      if (m && engineRef.current) engineRef.current.stop();
      return { ...p, muted: m };
    });
  }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}
var LESSON_META = { lessonId: "js-intro-01-v18", lessonTitle: { uz: "Sistema va Algoritm", ru: "Система и алгоритм" } };
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
  { id: "sflash", type: "flashcard", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var ACHIEVEMENTS = {
  scout: { icon: "🔍", name: "System Scout", desc: { uz: "Atrofdagi sistemani tanidingiz", ru: "Вы распознали систему вокруг себя" } },
  recipe: { icon: "📋", name: "Algorithm Master", desc: { uz: "Algoritm — qadamlar tartibini o'zlashtirdingiz", ru: "Вы освоили алгоритм — порядок шагов" } },
  bughunter: { icon: "🐞", name: "Bug Hunter", desc: { uz: "Chalkash dasturni tuzatib RUN qildingiz", ru: "Вы починили запутанную программу и нажали RUN" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "Sistema va algoritm darsini to'liq yakunladingiz", ru: "Вы полностью прошли урок о системе и алгоритме" } }
};
var ACH_TRIGGERS = { s4: "scout", s9: "recipe", s15: "bughunter" };
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
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{tr2(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var RECAPS = {
  4: {
    title: { uz: "Sistema nima?", ru: "Что такое система?" },
    cards: [
      {
        ic: "🧩",
        h: { uz: "Sistema — birga ishlovchi qismlar", ru: "Система — части, работающие вместе" },
        body: { uz: <>Sistema — bu <b>birga ishlaydigan komponentlar</b> va ularning <b>bog'lanishlari</b>. Bitta yaxlit narsa emas, aksincha ko'p qismning jamoasi.</>, ru: <>Система — это <b>компоненты, работающие вместе</b>, и их <b>связи</b>. Это не один цельный предмет, а команда из многих частей.</> },
        vis: <RcFlow items={[{ uz: "🫀 yurak", ru: "🫀 сердце" }, { uz: "🫁 o'pka", ru: "🫁 лёгкие" }, { uz: "🩸 qon", ru: "🩸 кровь" }]} sep="+" />,
        ask: { uz: "Sinfimiz sistema bo'la oladimi? Qaysi qismlardan iborat?", ru: "Может ли наш класс быть системой? Из каких частей он состоит?" }
      },
      {
        ic: "🚗",
        h: { uz: "Bir qism yetmaydi", ru: "Одной части мало" },
        body: { uz: <>Faqat <b>bitta g'ildirak</b> mashina emas. Mashina bo'lishi uchun dvigatel, g'ildirak, rul — hammasi <b>birga</b> ishlashi kerak.</>, ru: <>Одно <b>колесо</b> — это ещё не машина. Чтобы получилась машина, двигатель, колёса и руль должны работать <b>вместе</b>.</> },
        vis: <RcFlow items={[{ uz: "😕 bitta g'ildirak", ru: "😕 одно колесо" }, { uz: "🔧 hamma qism birga", ru: "🔧 все части вместе" }, { uz: "🚗 mashina", ru: "🚗 машина" }]} />
      },
      {
        ic: "🎯",
        h: { uz: "Umumiy maqsad uchun", ru: "Ради общей цели" },
        body: { uz: <>Sistemaning qismlari <b>tasodifiy</b> emas — ular <b>bitta maqsad</b> uchun birlashgan. Inson tanasi yashash uchun, mashina yurish uchun.</>, ru: <>Части системы собраны <b>не случайно</b> — их объединяет <b>одна цель</b>. Тело человека — чтобы жить, машина — чтобы ехать.</> }
      }
    ]
  },
  6: {
    title: { uz: "Bog'lanish nima?", ru: "Что такое связь?" },
    cards: [
      {
        ic: "🔗",
        h: { uz: "Bog'lanish — qismlar orasidagi yo'l", ru: "Связь — путь между частями" },
        body: { uz: <>Bog'lanish — bu qismlar <b>bir-biriga ta'sir o'tkazadigan yo'l</b>. U eng katta qism ham, sistemaning nomi ham emas.</>, ru: <>Связь — это <b>путь, по которому части влияют друг на друга</b>. Это не самая большая часть и не название системы.</> },
        vis: <RcFlow items={[{ uz: "🫀 yurak", ru: "🫀 сердце" }, { uz: "🩸 qon yuboradi", ru: "🩸 гонит кровь" }, { uz: "🫁 o'pka", ru: "🫁 лёгкие" }]} />,
        ask: { uz: "Uyda svet va vaklyuchatel orasida qanday bog'lanish bor?", ru: "Какая связь дома между лампочкой и выключателем?" }
      },
      {
        ic: "🚦",
        h: { uz: "Ta'sir bir qismdan ikkinchisiga o'tadi", ru: "Действие переходит от части к части" },
        body: { uz: <>Yurak <b>qon haydaydi</b>, qon o'pkaga <b>kislorod</b> uchun boradi. Bir qismning ishi ikkinchisiga <b>o'tib</b> ketadi — mana bu bog'lanish.</>, ru: <>Сердце <b>гонит кровь</b>, кровь идёт в лёгкие за <b>кислородом</b>. Работа одной части <b>передаётся</b> другой — вот это и есть связь.</> },
        vis: <RcFlow items={[{ uz: "👆 bosdim", ru: "👆 нажал" }, { uz: "⚡ tok o'tdi", ru: "⚡ ток прошёл" }, { uz: "💡 chiroq yondi", ru: "💡 лампа загорелась" }]} />
      },
      {
        ic: "🎯",
        h: { uz: "Bog'lanishsiz — sistema emas", ru: "Без связей — не система" },
        body: { uz: <>Agar qismlar <b>bir-biriga ta'sir qilmasa</b>, ular shunchaki alohida narsalar. Aynan bog'lanishlar ularni <b>bitta sistema</b> qiladi.</>, ru: <>Если части <b>не влияют друг на друга</b>, это просто отдельные предметы. Именно связи делают их <b>одной системой</b>.</> }
      }
    ]
  },
  10: {
    title: { uz: "Shart (agar...bo'lsa)", ru: "Условие (если... то)" },
    cards: [
      {
        ic: "🌦️",
        h: { uz: "Shart — tanlov qadami", ru: "Условие — шаг выбора" },
        body: { uz: <>«AGAR yomg'ir bo'lsa, soyabon ol» — bu <b>shart</b>. Bir narsa <b>rost bo'lsa</b> — bir ish qilamiz, bo'lmasa — qilmaymiz.</>, ru: <>«ЕСЛИ идёт дождь — возьми зонт» — это <b>условие</b>. Если что-то <b>верно</b> — делаем одно, если нет — не делаем.</> },
        vis: <RcFlow items={[{ uz: "🌧️ yomg'ir bormi?", ru: "🌧️ идёт дождь?" }, { uz: "☂️ ha → soyabon", ru: "☂️ да → зонт" }, { uz: "😎 yo'q → olmaymiz", ru: "😎 нет → не берём" }]} />,
        ask: { uz: "Kunlik hayotdan yana bitta «agar...bo'lsa» misolini kim aytadi?", ru: "Кто назовёт ещё один пример «если... то» из повседневной жизни?" }
      },
      {
        ic: "🚦",
        h: { uz: "Sikldan farqi", ru: "Чем отличается от цикла" },
        body: { uz: <>Shart <b>bir marta</b> tekshiradi va yo'l tanlaydi. Sikl esa bir ishni <b>ko'p marta takrorlaydi</b> — bular boshqa-boshqa narsa.</>, ru: <>Условие проверяет <b>один раз</b> и выбирает путь. А цикл <b>повторяет действие много раз</b> — это разные вещи.</> },
        vis: <RcFlow items={[{ uz: "🚦 yashil bo'lsa → yur", ru: "🚦 зелёный → иди" }, { uz: "🔴 qizil bo'lsa → to'xta", ru: "🔴 красный → стой" }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "«bo'lsa» so'ziga qara", ru: "Ищите слово «если»" },
        body: { uz: <>Gapda <b>«agar... bo'lsa»</b> bo'lsa — bu deyarli har doim <b>shart</b>. U qadamni holatga qarab tanlaydi.</>, ru: <>Если во фразе есть <b>«если... то»</b> — это почти всегда <b>условие</b>. Оно выбирает шаг в зависимости от ситуации.</> }
      }
    ]
  },
  13: {
    title: { uz: "Sikl (takrorlash)", ru: "Цикл (повторение)" },
    cards: [
      {
        ic: "🔁",
        h: { uz: "Sikl — takrorlash qadami", ru: "Цикл — шаг повторения" },
        body: { uz: <>Bir xil amalni <b>ko'p marta</b> takrorlash uchun <b>sikl</b> ishlatamiz. Har safar qaytadan yozib o'tirmaymiz.</>, ru: <>Чтобы повторить одно действие <b>много раз</b>, используем <b>цикл</b>. Не пишем его заново каждый раз.</> },
        vis: <RcFlow items={[{ uz: "🪜 zina 1", ru: "🪜 ступенька 1" }, { uz: "🪜 zina 2", ru: "🪜 ступенька 2" }, { uz: "🪜 zina 3", ru: "🪜 ступенька 3" }, { uz: "🔁 takror", ru: "🔁 повтор" }]} />,
        ask: { uz: "Tishni yuvishda cho'tkani necha marta yuqoriga-pastga yuritamiz — bu sikls mi?", ru: "Сколько раз мы водим щёткой вверх-вниз, когда чистим зубы, — это цикл?" }
      },
      {
        ic: "🏃",
        h: { uz: "Misol: 10 marta o'tir-tur", ru: "Пример: 10 приседаний" },
        body: { uz: <>«10 marta o'tir-tur qil» — bu <b>sikl</b>. Bitta harakat <b>10 marta qaytariladi</b>. Shartdan farqi: sikl takrorlaydi, shart tanlaydi.</>, ru: <>«Присядь 10 раз» — это <b>цикл</b>. Одно движение <b>повторяется 10 раз</b>. Отличие от условия: цикл повторяет, условие выбирает.</> },
        vis: <RcFlow items={["1", "2", "3", "…", "10"]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "«ko'p marta» = sikl", ru: "«много раз» = цикл" },
        body: { uz: <>Agar bir ish <b>bir necha marta qaytarilsa</b> — bu sikl. «takror», «har safar», «necha marta» so'zlari sikldan darak beradi.</>, ru: <>Если действие повторяется <b>несколько раз</b> — это цикл. Слова «повтори», «каждый раз», «сколько раз» указывают на цикл.</> }
      }
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
        <span className="rc-tag">{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Объясняем ещё раз" })}</span>
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Назад" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr2({ uz: "-karta", ru: "-я карточка" })}`} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Дальше →" })}</button>}
      </div>
    </div>;
}
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и счёт ✅/❌ скрыты — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников." })}</p>}
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
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как идти дальше, лучше коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Объяснить ещё раз" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответов пока мало ({answered}) — по проценту трудно судить. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Объяснить ещё раз" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: "⚠️ Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options, picked: options[i], correct: options[correctIdx], lang: typeof __lang !== "undefined" && __lang === "ru" ? "ru" : "uz" });
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
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, думайте перед нажатием!" })}</p>}
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
            {isMentorLive ? fmtCode(`${tr2({ uz: "✓ To'g'ri javob:", ru: "✓ Правильный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`) : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? fmtCode(`${tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`) : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? explainCorrect : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Скоро вы узнаете правильный ответ." }) : wrongLocked ? explainWrong[picked] ?? explainWrong.default : solved ? explainCorrect : explainWrong[picked] ?? explainWrong.default}
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> {tr2({ uz: "· ko'rsatmani ochish ▾", ru: "· открыть подсказку ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
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
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: "s0", text: `Yugurib ketayotganingizni tasavvur qiling. Faqat oyoq ishlayaptimi? Yo'q — yurak tezroq uradi, nafas tezlashadi, miya har bir qadamni boshqaradi. Hammasi bir vaqtda, siz buyurmasdan ham. Bu qanday bo'ladi? "Yugur" tugmasini bosib ko'ring.`, trigger: "on_mount", waits_for: { type: "option_picked" } }]);
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const [view, setView] = useState3("rest");
  const ORGANS = [{ ic: "🧠", n: tr2({ uz: "Miya", ru: "Мозг" }) }, { ic: "🫁", n: tr2({ uz: "O'pka", ru: "Лёгкие" }) }, { ic: "🫀", n: tr2({ uz: "Yurak", ru: "Сердце" }) }, { ic: "💪", n: tr2({ uz: "Mushaklar", ru: "Мышцы" }) }];
  const OPTS = [
    { id: "a", label: tr2({ uz: "Faqat oyoq mushaklari ishlaydi", ru: "Работают только мышцы ног" }) },
    { id: "b", label: tr2({ uz: "Ko'p a'zo birgalikda ishlaydi", ru: "Много органов работают вместе" }) },
    { id: "c", label: tr2({ uz: "Hech qanday sa'y-harakatsiz", ru: "Вообще без каких-либо усилий" }) }
  ];
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
    audio.triggerEvent("option_picked");
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>Yugurganda tanangizda <span className="italic" style={{ color: T.accent }}>faqat oyoq</span> ishlaydimi?</>, ru: <>Когда вы бежите, в теле работают <span className="italic" style={{ color: T.accent }}>только ноги</span>?</> })}</h1>
        <Mentor>{tr2({ uz: <>Yugurib ketayotganingizni tasavvur qiling. Faqat oyoq ishlayaptimi? Yo'q — yurak tezroq uradi, nafas tezlashadi, miya har bir qadamni boshqaradi. Hammasi bir vaqtda, <b style={{ color: T.ink }}>siz buyurmasdan ham</b>. Bu qanday bo'ladi? <b style={{ color: T.ink }}>"Yugur"</b> tugmasini bosib ko'ring.</>, ru: <>Представьте, что вы бежите. Работают только ноги? Нет — сердце бьётся быстрее, дыхание ускоряется, мозг управляет каждым шагом. Всё одновременно, <b style={{ color: T.ink }}>даже без вашей команды</b>. Как так получается? Нажмите кнопку <b style={{ color: T.ink }}>«Беги»</b> и посмотрите.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${view === "rest" ? "chip-on" : ""}`} onClick={() => setView("rest")}>{tr2({ uz: "🧍 Tinch", ru: "🧍 Покой" })}</button>
              <button className={`chip ${view === "run" ? "chip-on" : ""}`} onClick={() => setView("run")}>{tr2({ uz: "🏃 Yugur", ru: "🏃 Беги" })}</button>
            </div>
            <div className="demo-swap" key={view} style={{ background: T.paper, borderRadius: 14, padding: "18px 16px", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <p className="flow-label" style={{ marginBottom: 12 }}>{view === "run" ? tr2({ uz: "🏃 Yugurmoqda — a'zolar birga ishlayapti", ru: "🏃 Бежит — органы работают вместе" }) : tr2({ uz: "🧍 Tinch holatda", ru: "🧍 В состоянии покоя" })}</p>
              <div className="bpm-row">
                <span className="bpm-heart" style={{ animationDuration: view === "run" ? "0.42s" : "1s" }}>❤️</span>
                <div className="bpm-info">
                  <span className="bpm-num" style={{ color: view === "run" ? T.accent : T.ink2 }}>{view === "run" ? "140" : "72"}</span>
                  <span className="bpm-unit">{tr2({ uz: "zarba / daqiqa", ru: "ударов / мин" })}</span>
                </div>
                <div className="eq">
                  {[0, 1, 2, 3, 4].map((i) => <span key={i} className="eq-bar" style={{ animationDuration: view === "run" ? "0.5s" : "1.4s", animationDelay: `${i * 0.08}s`, opacity: view === "run" ? 1 : 0.45 }} />)}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {ORGANS.map((o, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 10, background: view === "run" ? T.accentSoft : T.bg, boxShadow: view === "run" ? "0 6px 16px -5px rgba(255,79,40,0.4)" : "none", transition: "all 0.3s" }}>
                    <span style={{ fontSize: 22, animation: view === "run" ? `dl-pulse 0.7s ease-in-out infinite ${i * 0.12}s` : "none", display: "inline-block" }}>{o.ic}</span>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: view === "run" ? T.accent : T.ink2 }}>{o.n}</span>
                  </div>)}
              </div>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Sizningcha, nega yugura olasiz?", ru: "Как думаете, почему вы можете бежать?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{o.label}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: <>To'g'ri! Tana — bu <b>sistema</b>: ko'p a'zo birga ishlaydi. Bugun shuni o'rganamiz.</>, ru: <>Верно! Тело — это <b>система</b>: много органов работают вместе. Сегодня мы это и изучим.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s1", text: `Kod yozishni boshlashdan oldin yaxshi dasturchilar muammoni qanday hal qilishni o'ylaydi. Buning uchun ular ikkita kuchli vositadan foydalanadi: sistema va algoritm. Bugun shu ikki g'oyani oddiy misollar orqali o'rganamiz, keyingi darslarda esa ularni JavaScript'da ishlatamiz.`, trigger: "on_mount", waits_for: null }]);
  const STEPS = [
    { text: tr2({ uz: "Sistema nima? — komponentlar", ru: "Что такое система? — компоненты" }), tag: "" },
    { text: tr2({ uz: "Bog'lanishlar — qismlar qanday ulanadi", ru: "Связи — как части соединяются" }), tag: "" },
    { text: tr2({ uz: "Algoritm — qadamlar tartibi", ru: "Алгоритм — порядок шагов" }), tag: "" },
    { text: tr2({ uz: "Shart va takrorlash", ru: "Условие и повторение" }), tag: tr2({ uz: "agar · sikl", ru: "если · цикл" }) },
    { text: tr2({ uz: "O'z algoritmingizni tuzing", ru: "Составьте свой алгоритм" }), tag: "" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 2 ta asosiy tushuncha", ru: "Сегодня 2 главные идеи" })}</p>
      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span className="idea-ic idea-ic-sys">🧩</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>{tr2({ uz: "SISTEMA", ru: "СИСТЕМА" })}</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Bir nechta qismlar birgalikda ishlasa — sistema hosil bo'ladi.", ru: "Когда несколько частей работают вместе — получается система." })}</p></div>
        </div>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span className="idea-ic idea-ic-algo">📋</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>{tr2({ uz: "ALGORITM", ru: "АЛГОРИТМ" })}</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Maqsadga olib boradigan aniq qadamlar.", ru: "Точные шаги, которые ведут к цели." })}</p></div>
        </div>
      </div>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr2({ uz: "→ Har qanday dastur aynan shu ikki g'oyadan quriladi", ru: "→ Любая программа строится именно из этих двух идей" })}</p>
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
          <h2 className="title h-title fade-up"><span className="italic" style={{ color: T.accent }}>{tr2({ uz: "Bugun dasturchidek fikrlashni o'rganamiz!", ru: "Сегодня учимся думать как программист!" })}</span></h2>
        </div>
        <Mentor>{tr2({ uz: <>Kod yozishni boshlashdan oldin yaxshi dasturchilar muammoni qanday <b style={{ color: T.ink }}>hal qilishni</b> o'ylaydi. Buning uchun ular ikkita kuchli vositadan foydalanadi: <b style={{ color: T.ink }}>sistema</b> va <b style={{ color: T.ink }}>algoritm</b>. Bugun shu ikki g'oyani oddiy misollar orqali o'rganamiz, keyingi darslarda esa ularni <b style={{ color: T.ink }}>JavaScript</b>'da ishlatamiz.</>, ru: <>Прежде чем начать писать код, хорошие программисты думают, как <b style={{ color: T.ink }}>решить задачу</b>. Для этого у них есть два сильных инструмента: <b style={{ color: T.ink }}>система</b> и <b style={{ color: T.ink }}>алгоритм</b>. Сегодня разберём эти две идеи на простых примерах, а на следующих уроках применим их в <b style={{ color: T.ink }}>JavaScript</b>.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "📋 Bugungi 5 qadamni ko'rish", ru: "📋 Посмотреть 5 шагов на сегодня" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ G'oyalarni ko'rish", ru: "↩ Вернуться к идеям" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s2", text: `Tanangizni bir butun deb o'ylaysiz, to'g'rimi? Aslida u ko'plab qismdan — komponentdan iborat, va har biri o'z ishini bajaradi: miya boshqaradi, yurak qon haydaydi, o'pka kislorod oladi. Har bir a'zoni bosib, vazifasini bilib oling.`, trigger: "on_mount", waits_for: null }]);
  const PARTS = {
    miya: { ic: "🧠", name: tr2({ uz: "Miya", ru: "Мозг" }), role: tr2({ uz: "Boshqaruv markazi — barcha a'zolarga buyruq beradi.", ru: "Центр управления — отдаёт команды всем органам." }) },
    yurak: { ic: "🫀", name: tr2({ uz: "Yurak", ru: "Сердце" }), role: tr2({ uz: "Nasos — qonni butun tanaga haydaydi.", ru: "Насос — гонит кровь по всему телу." }) },
    opka: { ic: "🫁", name: tr2({ uz: "O'pka", ru: "Лёгкие" }), role: tr2({ uz: "Havodan kislorod oladi va qonga beradi.", ru: "Берут кислород из воздуха и отдают его крови." }) },
    mushak: { ic: "💪", name: tr2({ uz: "Mushaklar", ru: "Мышцы" }), role: tr2({ uz: "Harakatni bajaradi — yuradi, ko'taradi, yuguradi.", ru: "Выполняют движение — ходят, поднимают, бегут." }) }
  };
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size === 4;
  const tap = (k) => {
    setActive(k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Sistema", ru: "Система" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/4 ${tr2({ uz: "a'zo ko'rilgan", ru: "органа изучено" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Tana <span className="italic" style={{ color: T.accent }}>nimalardan</span> tuzilgan?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>состоит</span> тело?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Tanangizni bir butun deb o'ylaysiz, to'g'rimi? Aslida u ko'plab <b style={{ color: T.ink }}>qismdan (komponentdan)</b> iborat, va har biri o'z ishini bajaradi: miya boshqaradi, yurak qon haydaydi, o'pka kislorod oladi. Har bir a'zoni bosib, vazifasini bilib oling.</>, ru: <>Вы думаете о теле как о едином целом, верно? На самом деле оно состоит из множества <b style={{ color: T.ink }}>частей (компонентов)</b>, и каждая делает свою работу: мозг управляет, сердце гонит кровь, лёгкие берут кислород. Нажмите на каждый орган и узнайте его задачу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Komponentlar (a'zolar)", ru: "Компоненты (органы)" })}</p>
            <div className="fade-up delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.keys(PARTS).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", border: "none", borderRadius: 14, padding: "16px 10px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span style={{ fontSize: 30 }}>{PARTS[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: T.ink }}>{PARTS[k].name}</span>
                  {seen.has(k) && <span style={{ color: T.success, fontSize: 12 }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 26 }}>{PARTS[active].ic}</span><span className="sk-wordbadge">{PARTS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: "11px 0 0" }}>{PARTS[active].role}</p>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir a'zoni bosing", ru: "Нажмите на любой орган" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Mana shu — <b>komponentlar</b>. Har biri alohida ishni bajaradi, lekin birga — bitta sistema. Endi ko'ramiz: ular qanday <b>bog'lanadi</b>?</>, ru: <>✓ Вот это — <b>компоненты</b>. Каждый делает свою работу, но вместе они — одна система. Теперь посмотрим: как они <b>связаны</b>?</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s3", text: `Komponentlar yolg'iz hech nima qila olmaydi — ular bir-biriga bog'langan. Miya mushakka "qimirla" degan signalni nerv orqali jo'natadi. Lekin shu bog'lanish uzilib qolsa-chi? Tugmani bosib, o'z ko'zingiz bilan ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const [broken, setBroken] = useState3(false);
  const [touched, setTouched] = useState3(false);
  const done = touched;
  const toggle = () => {
    setBroken((b) => !b);
    setTouched(true);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Bog'lanishlar", ru: "Связи" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Bog'lanishni sinab ko'ring", ru: "Проверьте связь" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qismlar bir-biriga <span className="italic" style={{ color: T.accent }}>qanday</span> ulanadi?</>, ru: <>Как части <span className="italic" style={{ color: T.accent }}>соединяются</span> друг с другом?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Komponentlar yolg'iz hech nima qila olmaydi — ular bir-biriga <b style={{ color: T.ink }}>bog'langan</b>. Miya mushakka "qimirla" signalini <b style={{ color: T.ink }}>nerv</b> orqali jo'natadi. Lekin shu bog'lanish uzilib qolsa-chi? Tugmani bosib, o'z ko'zingiz bilan ko'ring.</>, ru: <>Поодиночке компоненты ничего не могут — они <b style={{ color: T.ink }}>связаны</b> друг с другом. Мозг посылает мышце сигнал «двигайся» через <b style={{ color: T.ink }}>нерв</b>. А если эта связь оборвётся? Нажмите кнопку и посмотрите своими глазами.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="conn-flow fade-up delay-1">
          <div className="conn-node"><span style={{ fontSize: 34 }}>🧠</span><span className="conn-lbl">{tr2({ uz: "Miya", ru: "Мозг" })}</span><span className="conn-sub">{tr2({ uz: "buyruq beradi", ru: "отдаёт команду" })}</span></div>
          <div className={`conn-link ${broken ? "cut" : ""}`}>
            <span className="conn-line" />
            <span className="conn-sig">{broken ? "✂️" : "⚡"}</span>
            <span className="conn-line" />
          </div>
          <div className="conn-node" style={{ opacity: broken ? 0.45 : 1 }}><span style={{ fontSize: 34 }}>{broken ? "😴" : "💪"}</span><span className="conn-lbl">{tr2({ uz: "Mushak", ru: "Мышца" })}</span><span className="conn-sub">{broken ? tr2({ uz: "buyruq yetmadi", ru: "команда не дошла" }) : tr2({ uz: "harakatlanadi", ru: "двигается" })}</span></div>
        </div>
        <button className="btn" onClick={toggle} style={{ alignSelf: "flex-start" }}>{broken ? tr2({ uz: "🔗 Bog'lanishni ulash", ru: "🔗 Восстановить связь" }) : tr2({ uz: "✂️ Bog'lanishni uzish", ru: "✂️ Разорвать связь" })}</button>
        {done && (broken ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bog'lanish uzildi — signal mushakka <b>yetib bormadi</b>, harakat yo'q. Demak sistemada bog'lanish ham komponent kabi muhim!</>, ru: <>Связь оборвалась — сигнал <b>не дошёл</b> до мышцы, движения нет. Значит, связь в системе так же важна, как и компонент!</> })}</p></div> : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ <b>Bog'lanish</b> — qismlar bir-biriga ta'sir o'tkazadigan yo'l. U bo'lmasa, komponentlar yakka qoladi va sistema ishlamaydi.</>, ru: <>✓ <b>Связь</b> — путь, по которому части влияют друг на друга. Без неё компоненты остаются поодиночке, и система не работает.</> })}</p></div>)}
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  idx={4}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Упражнение · вопрос 1" })}
  audioText="Sistema nima? To'g'ri variantni tanlang."
  questionText="Sistema nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "Sistema nima?", ru: "Что такое система?" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: "Sistema nima?", ru: "Что такое система?" })}</h2></>}
  options={[tr2({ uz: "Bo'linmaydigan, ichki qismlari yo'q yaxlit bir narsa", ru: "Неделимый цельный предмет без внутренних частей" }), tr2({ uz: "Birga ishlaydigan komponentlar va ularning bog'lanishlari", ru: "Компоненты, работающие вместе, и их связи" }), tr2({ uz: "Bir-biriga hech qanday aloqasi yo'q tasodifiy narsalar", ru: "Случайные предметы, никак не связанные между собой" }), tr2({ uz: "Faqat kompyuterga tegishli, boshqa hech narsa emas", ru: "Что-то только про компьютеры и больше ни про что" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Sistema — birga ishlaydigan komponentlar (qismlar) va ular orasidagi bog'lanishlardir. Inson tanasi shunga misol.", ru: "Верно! Система — это компоненты (части), работающие вместе, и связи между ними. Тело человека — отличный пример." })}
  explainWrong={{ 0: tr2({ uz: "Yo'q — sistema aynan ko'p qismdan iborat, bitta bo'linmas narsa emas.", ru: "Нет — система как раз состоит из многих частей, это не один неделимый предмет." }), 2: tr2({ uz: "Yo'q — sistemadagi qismlar tasodifiy emas, ular birga, maqsad bilan ishlaydi.", ru: "Нет — части системы не случайны, они работают вместе, ради цели." }), 3: tr2({ uz: "Yo'q — kompyuter ham sistema, lekin sistema faqat kompyuter degani emas. Tana, jamoa ham sistema.", ru: "Нет — компьютер тоже система, но система — это не только компьютер. Тело и команда — тоже системы." }), default: tr2({ uz: "Sistema — komponentlar va ularning bog'lanishlari.", ru: "Система — это компоненты и их связи." }) }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s5", text: `Bir marta payqang — endi sistemani hamma joyda ko'ra boshlaysiz. Futbol jamoasi, tanangiz, hatto o'zingiz yasagan sayt ham — bari sistema. Har birini bosib, qismlari va bog'lanishini toping.`, trigger: "on_mount", waits_for: null }]);
  const EX = {
    tana: { ic: "🫀", title: tr2({ uz: "Inson tanasi", ru: "Тело человека" }), parts: [tr2({ uz: "miya", ru: "мозг" }), tr2({ uz: "yurak", ru: "сердце" }), tr2({ uz: "o'pka", ru: "лёгкие" }), tr2({ uz: "mushaklar", ru: "мышцы" })], conn: tr2({ uz: "qon tomir va nervlar", ru: "сосуды и нервы" }), note: tr2({ uz: "Bir a'zo to'xtasa, butun tana qiynaladi.", ru: "Если один орган остановится, страдает всё тело." }) },
    jamoa: { ic: "⚽", title: tr2({ uz: "Futbol jamoasi", ru: "Футбольная команда" }), parts: [tr2({ uz: "o'yinchilar", ru: "игроки" }), tr2({ uz: "darvozabon", ru: "вратарь" }), tr2({ uz: "murabbiy", ru: "тренер" })], conn: tr2({ uz: "paslar va kelishuv", ru: "пасы и взаимопонимание" }), note: tr2({ uz: "Paslar yo'q bo'lsa, jamoa o'yin qura olmaydi.", ru: "Без пасов команда не сможет построить игру." }) },
    sayt: { ic: "🌐", title: tr2({ uz: "Veb-sayt", ru: "Веб-сайт" }), parts: [tr2({ uz: "brauzer", ru: "браузер" }), tr2({ uz: "server", ru: "сервер" }), "HTML", "CSS"], conn: tr2({ uz: "internet so'rovlari", ru: "интернет-запросы" }), note: tr2({ uz: "Internet darsida ko'rgan so'rov yo'li — ayni shu bog'lanish!", ru: "Путь запроса из урока об интернете — это и есть та самая связь!" }) }
  };
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 3;
  const tap = (k) => {
    setActive(k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Sistemalar atrofda", ru: "Системы вокруг нас" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/3 ${tr2({ uz: "ko'ring", ru: "посмотрите" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Yana <span className="italic" style={{ color: T.accent }}>qayerda</span> sistema bor?</>, ru: <>Где <span className="italic" style={{ color: T.accent }}>ещё</span> есть системы?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bir marta payqang — endi sistemani <b style={{ color: T.ink }}>hamma joyda</b> ko'ra boshlaysiz. Futbol jamoasi, tanangiz, hatto o'zingiz yasagan <b style={{ color: T.ink }}>sayt</b> ham — bari sistema! Har birini bosib, qismlari va bog'lanishini ko'ring.</>, ru: <>Стоит один раз заметить — и вы начнёте видеть системы <b style={{ color: T.ink }}>повсюду</b>. Футбольная команда, ваше тело, даже <b style={{ color: T.ink }}>сайт</b>, который вы сами сделали, — всё это системы! Нажмите на каждую и посмотрите её части и связи.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {Object.keys(EX).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 12, padding: "13px 15px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span style={{ fontSize: 26 }}>{EX[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{EX[k].title}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, fontSize: 14 }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 24 }}>{EX[active].ic}</span><span className="sk-wordbadge">{EX[active].title}</span></span>
                <p className="flow-label" style={{ margin: "13px 0 7px" }}>{tr2({ uz: "Komponentlar (qismlar)", ru: "Компоненты (части)" })}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {EX[active].parts.map((p, i) => <span key={i} className="el-in" style={{ animationDelay: `${i * 0.07}s`, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 12.5, color: T.ink, background: T.bg, padding: "6px 12px", borderRadius: 99 }}>{p}</span>)}
                </div>
                <div className="el-in" style={{ animationDelay: "0.28s", display: "flex", alignItems: "center", gap: 9, marginTop: 12, background: T.successSoft, borderRadius: 10, padding: "10px 13px" }}>
                  <span className="lnk-pulse" style={{ fontSize: 17 }}>🔗</span>
                  <span className="body" style={{ margin: 0, color: T.ink }}><b>{tr2({ uz: "Bog'lanish:", ru: "Связь:" })}</b> {EX[active].conn}</span>
                </div>
                <p className="body" style={{ color: T.ink2, margin: "10px 0 0", fontStyle: "italic" }}>{EX[active].note}</p>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir misolni bosing — qismlari ko'rinadi", ru: "Нажмите на пример — увидите его части" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Har xil narsa — lekin tuzilishi bir xil: <b>qismlar + bog'lanish</b>. Siz yasagan sayt ham aynan shunday sistema edi!</>, ru: <>Предметы разные — а устройство одно: <b>части + связи</b>. Сайт, который вы сделали, был точно такой же системой!</> })}</p></div>}
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
  audioText="Sistemada bog'lanish nima?"
  questionText="Sistemada 'bog'lanish' nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "Mustahkamlash", ru: "Закрепление" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Sistemada <span className="italic" style={{ color: T.accent }}>bog'lanish</span> nima?</>, ru: <>Что такое <span className="italic" style={{ color: T.accent }}>связь</span> в системе?</> })}</h2></>}
  options={[tr2({ uz: "Qismlar bir-biriga ta'sir o'tkazadigan yo'l", ru: "Путь, по которому части влияют друг на друга" }), tr2({ uz: "Sistemadagi eng katta va asosiy komponent", ru: "Самый большой и главный компонент системы" }), tr2({ uz: "Butun sistemaga berilgan umumiy bitta nom", ru: "Общее название всей системы целиком" }), tr2({ uz: "Rejasiz yuz beradigan tasodifiy hodisa", ru: "Случайное событие, которое происходит без плана" })]}
  correctIdx={0}
  explainCorrect={tr2({ uz: "To'g'ri! Bog'lanish — komponentlar bir-biriga ta'sir o'tkazadigan, signal yoki ma'lumot uzatadigan yo'l (masalan, nerv yoki internet so'rovi).", ru: "Верно! Связь — это путь, по которому компоненты влияют друг на друга, передают сигнал или данные (например, нерв или интернет-запрос)." })}
  explainWrong={{
    1: tr2({ uz: "Yo'q — bu komponent emas. Bog'lanish — qismlarni ulaydigan yo'l.", ru: "Нет — это не компонент. Связь — путь, соединяющий части." }),
    2: tr2({ uz: "Yo'q — bog'lanish nom emas, u qismlar orasidagi aloqa.", ru: "Нет — связь не название, это соединение между частями." }),
    3: tr2({ uz: "Yo'q — bog'lanish tasodif emas, u qismlarni maqsadli ulaydi.", ru: "Нет — связь не случайность, она соединяет части с целью." }),
    default: tr2({ uz: "Bog'lanish — qismlar bir-biriga ta'sir o'tkazadigan yo'l.", ru: "Связь — путь, по которому части влияют друг на друга." })
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s6", text: `Har kuni ertalab deyarli bir xil ishni qilasiz: uyg'onasiz, yuvinasiz, kiyinasiz... O'ylab ko'rsangiz, bu ham algoritm — maqsadga olib boradigan aniq, ketma-ket qadamlar. "Boshlash"ni bosib, qadamlarni kuzating.`, trigger: "on_mount", waits_for: { type: "flow_done" } }]);
  const STEPS = [
    { ic: "🛏️", h: tr2({ uz: "Uyg'onish", ru: "Проснуться" }) },
    { ic: "🚿", h: tr2({ uz: "Yuvinish", ru: "Умыться" }) },
    { ic: "👕", h: tr2({ uz: "Kiyinish", ru: "Одеться" }) },
    { ic: "🍳", h: tr2({ uz: "Nonushta", ru: "Завтрак" }) },
    { ic: "🏫", h: tr2({ uz: "Maktabga", ru: "В школу" }) }
  ];
  const [step, setStep] = useState3(storedAnswer ? STEPS.length : 0);
  const [running, setRunning] = useState3(false);
  const timer = useRef3(null);
  const isNarrow = useIsMobile(768);
  const done = step >= STEPS.length;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setStep(0);
    setRunning(true);
    const tick = (i) => {
      setStep(i);
      if (i < STEPS.length) timer.current = setTimeout(() => tick(i + 1), 560);
      else {
        setRunning(false);
        audio.triggerEvent("flow_done");
      }
    };
    timer.current = setTimeout(() => tick(1), 350);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Algoritm", ru: "Алгоритм" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval ko'ring", ru: "Сначала посмотрите" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Ertalab nimadan <span className="italic" style={{ color: T.accent }}>boshlaysiz</span>?</>, ru: <>С чего <span className="italic" style={{ color: T.accent }}>начинается</span> ваше утро?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Har kuni ertalab deyarli bir xil ishni qilasiz: uyg'onasiz, yuvinasiz, kiyinasiz... O'ylab ko'rsangiz, bu ham <b style={{ color: T.ink }}>algoritm</b> — maqsadga olib boradigan aniq, <b style={{ color: T.ink }}>ketma-ket qadamlar</b>. Tugmani bosib, qadamlarni kuzating.</>, ru: <>Каждое утро вы делаете почти одно и то же: просыпаетесь, умываетесь, одеваетесь... Если подумать, это тоже <b style={{ color: T.ink }}>алгоритм</b> — точные, <b style={{ color: T.ink }}>последовательные шаги</b>, ведущие к цели. Нажмите кнопку и понаблюдайте за шагами.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!isNarrow ? <div className="pz-flow" style={{ justifyContent: "center" }}>
            {STEPS.map((s, i) => <React3.Fragment key={i}>
                <div className={`pz-step ${step > i ? "on" : ""} ${running && step === i + 1 ? "active" : ""}`} style={{ minWidth: 92 }}>
                  <span style={{ fontSize: 26 }}>{step > i ? s.ic : "○"}</span>
                  <span className="pz-lbl"><b style={{ color: step > i ? T.ink : T.ink2 }}>{s.h}</b></span>
                </div>
                {i < STEPS.length - 1 && <span className={`pz-arrow ${step > i + 1 ? "on" : ""}`}>→</span>}
              </React3.Fragment>)}
          </div> : <div className="pz-flow-v">
            {STEPS.map((s, i) => <React3.Fragment key={i}>
                <div className={`pz-rowstep ${step > i ? "on" : ""} ${running && step === i + 1 ? "active" : ""}`}>
                  <span className="pz-rowic">{step > i ? s.ic : "○"}</span>
                  <span className="pz-rowtxt"><b>{i + 1}. {s.h}</b></span>
                  {step > i && <span style={{ marginLeft: "auto", color: T.success, fontSize: 15 }}>✓</span>}
                </div>
                {i < STEPS.length - 1 && <span className={`pz-varrow ${step > i + 1 ? "on" : ""}`}>↓</span>}
              </React3.Fragment>)}
          </div>}
        <button className="btn" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Bajarilmoqda…", ru: "Выполняется…" }) : done ? tr2({ uz: "↻ Yana ko'rsatish", ru: "↻ Показать ещё раз" }) : tr2({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Mana shu — <b>algoritm</b>: aniq qadamlar, aniq <b>tartibda</b>. Kompyuterga ham xuddi shunday aniq qadamlar beramiz.</>, ru: <>✓ Вот это — <b>алгоритм</b>: точные шаги в точном <b>порядке</b>. Компьютеру мы даём такие же точные шаги.</> })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s7", text: `Retsept qadamlarining o'rnini almashtirib ko'ring-chi — tuxumni pishirishdan oldin yorasizmi yoki keyin? Algoritmda ham xuddi shunday: bitta qadam o'rnini o'zgartirsa, natija kulgili bo'lib qoladi. To'g'ri va chalkash tartibni birma-bir tanlab, RUN bosing.`, trigger: "on_mount", waits_for: null }]);
  const CORRECT = [{ ic: "🛏️", h: tr2({ uz: "Uyg'onish", ru: "Проснуться" }) }, { ic: "🚿", h: tr2({ uz: "Yuvinish", ru: "Умыться" }) }, { ic: "👕", h: tr2({ uz: "Kiyinish", ru: "Одеться" }) }, { ic: "🎒", h: tr2({ uz: "Ko'chaga chiqish", ru: "Выйти на улицу" }) }];
  const MIXED = [{ ic: "🎒", h: tr2({ uz: "Ko'chaga chiqish", ru: "Выйти на улицу" }) }, { ic: "👕", h: tr2({ uz: "Kiyinish", ru: "Одеться" }) }, { ic: "🚿", h: tr2({ uz: "Yuvinish", ru: "Умыться" }) }, { ic: "🛏️", h: tr2({ uz: "Uyg'onish", ru: "Проснуться" }) }];
  const [order, setOrder] = useState3("correct");
  const [phase, setPhase] = useState3("idle");
  const [running, setRunning] = useState3(-1);
  const [ranOnce, setRanOnce] = useState3(!!storedAnswer);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const list = order === "correct" ? CORRECT : MIXED;
  const done = ranOnce;
  const pick = (o) => {
    if (phase === "run") return;
    setOrder(o);
    setPhase("idle");
    setRunning(-1);
  };
  const run = () => {
    clearTimeout(timer.current);
    setPhase("run");
    setRunning(0);
    const step = (i) => {
      setRunning(i);
      if (i < list.length - 1) timer.current = setTimeout(() => step(i + 1), 500);
      else timer.current = setTimeout(() => {
        setPhase(order === "correct" ? "done" : "fail");
        setRunning(-1);
        setRanOnce(true);
      }, 500);
    };
    timer.current = setTimeout(() => step(0), 260);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Ketma-ketlik", ru: "Последовательность" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : phase === "run" ? tr2({ uz: "Bajarilmoqda…", ru: "Выполняется…" }) : tr2({ uz: "RUN bosing", ru: "Нажмите RUN" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qadamlar <span className="italic" style={{ color: T.accent }}>tartibi</span> muhimmi?</>, ru: <>Важен ли <span className="italic" style={{ color: T.accent }}>порядок</span> шагов?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Retsept qadamlarining o'rnini almashtirib ko'ring-chi — tuxumni pishirishdan <b style={{ color: T.ink }}>oldin</b> yorasizmi yoki <b style={{ color: T.ink }}>keyin</b>? Algoritmda ham shunday: bitta qadam o'rnini o'zgartirsa, natija <b style={{ color: T.ink }}>kulgili</b> bo'lib qoladi. <b style={{ color: T.ink }}>To'g'ri</b> va <b style={{ color: T.ink }}>chalkash</b> tartibni birma-bir tanlab, <b style={{ color: T.ink }}>▶ RUN</b> bosing.</>, ru: <>Попробуйте поменять шаги рецепта местами — яйцо вы разбиваете <b style={{ color: T.ink }}>до</b> жарки или <b style={{ color: T.ink }}>после</b>? В алгоритме так же: сдвиньте один шаг — и результат получится <b style={{ color: T.ink }}>смешным</b>. Выберите по очереди <b style={{ color: T.ink }}>правильный</b> и <b style={{ color: T.ink }}>перепутанный</b> порядок и нажмите <b style={{ color: T.ink }}>▶ RUN</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${order === "correct" ? "chip-on" : ""}`} disabled={phase === "run"} onClick={() => pick("correct")}>{tr2({ uz: "✅ To'g'ri tartib", ru: "✅ Правильный порядок" })}</button>
              <button className={`chip ${order === "mixed" ? "chip-on" : ""}`} disabled={phase === "run"} onClick={() => pick("mixed")}>{tr2({ uz: "🔀 Chalkash", ru: "🔀 Перепутанный" })}</button>
            </div>
            <div className="demo-swap" key={order} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {list.map((s, i) => <div key={i} className={`el-in ${phase === "run" && i === running ? "cc-active" : ""}`} style={{ animationDelay: `${i * 0.1}s`, display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderRadius: 12, background: T.paper, boxShadow: `0 6px 16px -6px rgba(${T.shadowBase},0.14)` }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: T.accent }}>{i + 1}</span>
                  <span style={{ fontSize: 22 }}>{s.ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink }}>{s.h}</span>
                </div>)}
            </div>
            <button className="btn cc-run" onClick={run} disabled={phase === "run"} style={{ alignSelf: "flex-start" }}>{phase === "run" ? tr2({ uz: "BAJARILMOQDA…", ru: "ВЫПОЛНЯЕТСЯ…" }) : ranOnce ? tr2({ uz: "↻ Yana RUN", ru: "↻ Ещё раз RUN" }) : "▶ RUN"}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Ertalabki sahna", ru: "Утренняя сцена" })}</p>
            <SahnaStage
    phase={phase}
    current={running}
    steps={list.map((s) => s.ic)}
    label={running >= 0 && list[running] ? `${list[running].ic} ${list[running].h}` : ""}
    idleCap={tr2({ uz: "ertalab, hali hech nima qilinmagan", ru: "утро, ещё ничего не сделано" })}
    result={{ icon: "🎒🙂", cap: tr2({ uz: "Maktabga tayyor", ru: "Готов к школе" }) }}
    failIcon="🙈👕"
    failText={tr2({ uz: "Pijamada ko'chada qoldingiz!", ru: "Вы остались на улице в пижаме!" })}
  />
            {phase === "done" && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ To'g'ri tartib — avval kiyinasiz, keyin ko'chaga chiqasiz. To'g'ri natija!", ru: "✓ Правильный порядок — сначала одеваетесь, потом выходите на улицу. Верный результат!" })}</p></div>}
            {phase === "fail" && <div className="frame-warn fade-step"><p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tr2({ uz: "😄 Kulgili xato", ru: "😄 Смешная ошибка" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Avval ko'chaga chiqib, keyin kiyinish? Pijamada ko'chada qolasiz! <b>Tartib o'zgardi — natija buzildi.</b></>, ru: <>Сначала выйти на улицу, а потом одеться? Так вы и останетесь на улице в пижаме! <b>Порядок изменился — результат сломался.</b></> })}</p></div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Shuning uchun algoritmda <b>ketma-ketlik</b> — birinchi qoida. Kompyuter qadamlarni aynan yozgan tartibingizda bajaradi.</>, ru: <>Поэтому <b>последовательность</b> — первое правило алгоритма. Компьютер выполняет шаги ровно в том порядке, в каком вы их записали.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s8", text: `Har doim bir xil ish qilmaysiz-ku: tashqarida yomg'ir bo'lsa soyabon olasiz, bo'lmasa — olmaysiz. Algoritm ham xuddi shunday o'ylaydi: agar bo'lsa, buni qil; aks holda, buni qil. Bunga shart deyiladi. Ob-havoni almashtirib, qarorni kuzating.`, trigger: "on_mount", waits_for: null }]);
  const [weather, setWeather] = useState3("sun");
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set(["sun"]));
  const rain = weather === "rain";
  const done = seen.size >= 2;
  const toggle = () => {
    const w = rain ? "sun" : "rain";
    setWeather(w);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(w);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Shartlar", ru: "Условия" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ob-havoni almashtiring", ru: "Переключите погоду" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Algoritm <span className="italic" style={{ color: T.accent }}>qaror</span> qabul qila oladimi?</>, ru: <>Может ли алгоритм принимать <span className="italic" style={{ color: T.accent }}>решения</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Har doim bir xil ish qilmaysiz-ku: tashqarida yomg'ir bo'lsa soyabon olasiz, bo'lmasa — olmaysiz. Algoritm ham shunday o'ylaydi: <b style={{ color: T.ink }}>AGAR</b> yomg'ir bo'lsa — soyabon ol, <b style={{ color: T.ink }}>AKS HOLDA</b> — soyabonsiz chiq. Bunga <b style={{ color: T.ink }}>shart</b> deyiladi. Ob-havoni almashtiring.</>, ru: <>Вы же не делаете всегда одно и то же: если на улице дождь — берёте зонт, если нет — не берёте. Алгоритм думает так же: <b style={{ color: T.ink }}>ЕСЛИ</b> идёт дождь — возьми зонт, <b style={{ color: T.ink }}>ИНАЧЕ</b> — выходи без зонта. Это называется <b style={{ color: T.ink }}>условие</b>. Переключите погоду.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Tashqarida hozir:", ru: "Сейчас на улице:" })}</p>
            <button onClick={toggle} className={`weather-btn fade-up delay-1 ${done ? "" : "wx-hint"}`} style={{ cursor: "pointer", border: "none", borderRadius: 16, padding: "24px", background: rain ? "#dce6ef" : "#fff4d6", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.16)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.3s", width: "100%" }}>
              {rain ? <span className="wx-fx">{[8, 26, 44, 62, 80, 92].map((l, i) => <i key={i} style={{ left: `${l}%`, animationDelay: `${i * 0.13}s` }} />)}</span> : <span className="sun-fx" />}
              <span style={{ fontSize: 48, position: "relative", zIndex: 1 }}>{rain ? "🌧️" : "☀️"}</span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, color: T.ink, position: "relative", zIndex: 1 }}>{rain ? tr2({ uz: "Yomg'ir yog'yapti", ru: "Идёт дождь" }) : tr2({ uz: "Quyoshli", ru: "Солнечно" })}</span>
              <span className="wx-cta">{tr2({ uz: "↻ Ob-havoni almashtirish", ru: "↻ Переключить погоду" })}</span>
            </button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Algoritmning qarori", ru: "Решение алгоритма" })}</p>
            <div className="cond-card fade-up delay-1">
              <div className={`cond-line ${rain ? "on" : ""}`}>{tr2({ uz: <><span className="cond-kw">AGAR</span> yomg'ir 🌧️ <span className="cond-kw">BO'LSA</span> → <b>soyabon ol ☂️</b></>, ru: <><span className="cond-kw">ЕСЛИ</span> дождь 🌧️ <span className="cond-kw">ИДЁТ</span> → <b>возьми зонт ☂️</b></> })}</div>
              <div className={`cond-line ${!rain ? "on" : ""}`}>{tr2({ uz: <><span className="cond-kw">AKS HOLDA</span> ☀️ → <b>soyabonsiz chiq</b></>, ru: <><span className="cond-kw">ИНАЧЕ</span> ☀️ → <b>выходи без зонта</b></> })}</div>
            </div>
            <div className="cond-result" key={`r${weather}`} style={{ color: rain ? T.blue : T.accent }}><span style={{ fontSize: 20 }}>{rain ? "☂️" : "🚶"}</span>{rain ? tr2({ uz: "Soyabon olindi", ru: "Зонт взят" }) : tr2({ uz: "Soyabonsiz chiqildi", ru: "Вышли без зонта" })}</div>
            <div className="frame-success fade-step" key={weather}><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Hozir {rain ? "🌧️ yomg'irli" : "☀️ quyoshli"} — algoritm <b>{rain ? "soyabon olishni" : "soyabonsiz chiqishni"}</b> tanladi.</>, ru: <>Сейчас {rain ? "🌧️ дождливо" : "☀️ солнечно"} — алгоритм выбрал <b>{rain ? "взять зонт" : "выйти без зонта"}</b>.</> })}</p></div>
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bitta algoritm — vaziyatga qarab ikki xil ishladi. Mana <b>shart</b>ning kuchi!</>, ru: <>Один алгоритм — а сработал по-разному, в зависимости от ситуации. Вот она, сила <b>условия</b>!</> })}</p></div>}
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
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Упражнение · вопрос 2" })}
  audioText="Agar yomg'ir bo'lsa, soyabon ol — algoritmda bu qanday qism?"
  questionText="'AGAR yomg'ir bo'lsa, soyabon ol' — algoritmda bu qanday qism?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: "«AGAR yomg'ir bo'lsa, soyabon ol» — bu qanday qism?", ru: "«ЕСЛИ идёт дождь — возьми зонт» — что это за часть?" })}</h2></>}
  options={[tr2({ uz: "Sikl (takrorlash)", ru: "Цикл (повторение)" }), tr2({ uz: "Shart (agar...bo'lsa)", ru: "Условие (если... то)" }), tr2({ uz: "Komponent (qism)", ru: "Компонент (часть)" }), tr2({ uz: "Bog'lanish (aloqa)", ru: "Связь (соединение)" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Bu — shart: algoritm vaziyatga qarab («agar...bo'lsa») qaror qabul qiladi.", ru: "Верно! Это условие: алгоритм принимает решение в зависимости от ситуации («если... то»)." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — sikl bu amalni takrorlash. Bu yerda esa qaror qabul qilinyapti — bu shart.", ru: "Нет — цикл повторяет действие. А здесь принимается решение — это условие." }),
    2: tr2({ uz: "Yo'q — komponent sistemaning qismi. Bu esa algoritmdagi qaror — shart.", ru: "Нет — компонент это часть системы. А это решение в алгоритме — условие." }),
    3: tr2({ uz: "Yo'q — bog'lanish qismlarni ulaydi. Bu esa shart: agar...bo'lsa.", ru: "Нет — связь соединяет части. А это условие: если... то." }),
    default: tr2({ uz: "Bu — shart: agar...bo'lsa...", ru: "Это условие: если... то..." })
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s10", text: `Sport mashg'ulotini eslang: murabbiy "o'tirib-tur, o'n marta!" deydi. U buni o'n marta takrorlab aytmaydi-ku — bir marta aytadi, son bilan. Kodda ham aynan shunday: bir marta yozasiz, "o'n marta takrorla" deysiz. Bunga sikl deyiladi. Tugmani bosing.`, trigger: "on_mount", waits_for: { type: "loop_done" } }]);
  const TOTAL = 10;
  const [count, setCount] = useState3(storedAnswer ? TOTAL : 0);
  const [running, setRunning] = useState3(false);
  const timer = useRef3(null);
  const done = count >= TOTAL;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setCount(0);
    setRunning(true);
    const tick = (i) => {
      setCount(i);
      if (i < TOTAL) timer.current = setTimeout(() => tick(i + 1), 280);
      else {
        setRunning(false);
        audio.triggerEvent("loop_done");
      }
    };
    timer.current = setTimeout(() => tick(1), 300);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Sikllar", ru: "Циклы" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Siklni ishga tushiring", ru: "Запустите цикл" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bir ishni <span className="italic" style={{ color: T.accent }}>takror-takror</span> — qanday qilamiz?</>, ru: <>Как делать одно и то же <span className="italic" style={{ color: T.accent }}>снова и снова</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Sport mashg'ulotini eslang: murabbiy "o'tirib-tur, 10 marta!" deydi. U buni 10 marta takrorlab aytmaydi-ku — bir marta aytadi, son bilan. Kodda ham shunday: bir marta yozasiz, <b style={{ color: T.ink }}>"10 marta takrorla"</b> deysiz. Bunga <b style={{ color: T.ink }}>sikl</b> deyiladi.</>, ru: <>Вспомните тренировку: тренер говорит «присядь 10 раз!». Он же не повторяет это 10 раз — говорит один раз, числом. В коде так же: пишете один раз и говорите <b style={{ color: T.ink }}>«повтори 10 раз»</b>. Это называется <b style={{ color: T.ink }}>цикл</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="loop-card fade-up delay-1">
              <p className="loop-kw"><span className="cond-kw">{tr2({ uz: "TAKRORLA 10 marta:", ru: "ПОВТОРИ 10 раз:" })}</span></p>
              <div className="squat-stage" key={count}>
                <span className="squat-fig">🏋️</span>
                <span className="loop-spin">🔁</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink }}>{tr2({ uz: "o'tirib-tur", ru: "присядь" })}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
                <span className={running ? "loop-num" : ""} key={count} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(40px,8vw,60px)", color: count > 0 ? T.accent : T.ink3, lineHeight: 1 }}>{count}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.ink3, fontSize: 18 }}>/ {TOTAL} {tr2({ uz: "marta", ru: "раз" })}</span>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                {Array.from({ length: TOTAL }).map((_, i) => <span key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: i < count ? T.accent : T.ink3 + "33", transform: i === count - 1 && running ? "scale(1.45)" : "scale(1)", boxShadow: i === count - 1 && running ? "0 0 10px rgba(255,79,40,0.6)" : "none", transition: "all 0.2s" }} />)}
              </div>
            </div>
            <button className="btn cc-run" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Bajarilmoqda…", ru: "Выполняется…" }) : done ? tr2({ uz: "↻ Yana", ru: "↻ Ещё раз" }) : tr2({ uz: "▶ Siklni boshlash", ru: "▶ Запустить цикл" })}</button>
          </Col>
          <Col>
            <div className="frame fade-up delay-2">
              <p className="eyebrow" style={{ color: T.accent, margin: "0 0 6px" }}>{tr2({ uz: "Sikl nimaga kerak?", ru: "Зачем нужен цикл?" })}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Tasavvur qiling — 100 marta takrorlash kerak. Sikl bo'lmasa, 100 qator yozardingiz! Sikl bilan — <b>bitta qoida, 100 marta bajariladi.</b></>, ru: <>Представьте: нужно повторить 100 раз. Без цикла вы бы написали 100 строк! А с циклом — <b>одно правило, и оно выполнится 100 раз.</b></> })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ <b>Sikl</b> — bir amalni belgilangan marta (yoki shart bajarilguncha) takrorlaydi. Dasturchining eng kuchli vositasi.</>, ru: <>✓ <b>Цикл</b> повторяет действие заданное число раз (или пока выполняется условие). Самый мощный инструмент программиста.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s11", text: `Mana eng qiziq haqiqat — va u juda oddiy: butun dunyodagi har bir dastur — o'yinmi, ilovami, sayt-mi — atigi uchta asosiy qismdan quriladi: ketma-ketlik, shart va sikl. Siz ularning uchalasini ham ko'rib bo'ldingiz! Har birini bosib, yodga oling.`, trigger: "on_mount", waits_for: null }]);
  const BRICKS = {
    seq: { ic: "📋", name: tr2({ uz: "Ketma-ketlik", ru: "Последовательность" }), ex: tr2({ uz: "Qadamlar aniq tartibda: uyg'on → yuvin → kiyin.", ru: "Шаги в точном порядке: проснись → умойся → оденься." }) },
    cond: { ic: "🔀", name: tr2({ uz: "Shart", ru: "Условие" }), ex: tr2({ uz: "Vaziyatga qarab qaror: agar yomg'ir bo'lsa — soyabon ol.", ru: "Решение по ситуации: если идёт дождь — возьми зонт." }) },
    loop: { ic: "🔁", name: tr2({ uz: "Sikl", ru: "Цикл" }), ex: tr2({ uz: "Takrorlash: o'tirib-turishni 10 marta bajar.", ru: "Повторение: сделай 10 приседаний." }) }
  };
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 3;
  const tap = (k) => {
    setActive(k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Algoritm asoslari", ru: "Основы алгоритма" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/3 ${tr2({ uz: "eslang", ru: "вспомните" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Algoritm <span className="italic" style={{ color: T.accent }}>nimalardan</span> quriladi?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>строится</span> алгоритм?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Mana eng qiziq haqiqat — va u juda oddiy: butun dunyodagi <b style={{ color: T.ink }}>har bir dastur</b> — o'yinmi, ilovami — atigi uchta asosiy qismdan quriladi: <b style={{ color: T.ink }}>ketma-ketlik</b>, <b style={{ color: T.ink }}>shart</b> va <b style={{ color: T.ink }}>sikl</b>. Siz uchalasini ham ko'rib bo'ldingiz! Har birini bosing.</>, ru: <>Вот самый интересный факт — и он очень простой: <b style={{ color: T.ink }}>каждая программа</b> в мире — игра или приложение — строится всего из трёх основных частей: <b style={{ color: T.ink }}>последовательность</b>, <b style={{ color: T.ink }}>условие</b> и <b style={{ color: T.ink }}>цикл</b>. Вы уже видели все три! Нажмите на каждую.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.keys(BRICKS).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 14, padding: "15px 16px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span style={{ fontSize: 28 }}>{BRICKS[k].ic}</span>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 18, color: T.ink }}>{BRICKS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, fontSize: 15 }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 26 }}>{BRICKS[active].ic}</span><span className="sk-wordbadge">{BRICKS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: "11px 0 0" }}>{BRICKS[active].ex}</p>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir qismni bosing", ru: "Нажмите на любую часть" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ Mana shu uchtasi — barcha dasturlarning poydevori. Hatto eng katta o'yinlar ham shulardan tuzilgan!", ru: "✓ Вот эти три — фундамент всех программ. Даже самые большие игры собраны из них!" })}</p></div>}
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
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Упражнение · вопрос 3" })}
  audioText="Bir xil amalni ko'p marta takrorlash uchun algoritmda nima ishlatamiz?"
  questionText="Bir xil amalni ko'p marta takrorlash uchun algoritmda nima ishlatamiz?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: "Bir xil amalni ko'p marta takrorlash uchun nima ishlatamiz?", ru: "Что мы используем, чтобы повторить одно действие много раз?" })}</h2></>}
  options={[tr2({ uz: "Shart (agar...bo'lsa)", ru: "Условие (если... то)" }), tr2({ uz: "Sikl (takrorlash)", ru: "Цикл (повторение)" }), tr2({ uz: "Komponent (qism)", ru: "Компонент (часть)" }), tr2({ uz: "Bog'lanish (aloqa)", ru: "Связь (соединение)" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Sikl bir amalni belgilangan marta takrorlaydi — uni qayta-qayta yozish shart emas.", ru: "Верно! Цикл повторяет действие заданное число раз — не нужно писать его снова и снова." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — shart qaror qabul qiladi (agar...bo'lsa). Takrorlash uchun esa sikl kerak.", ru: "Нет — условие принимает решение (если... то). А для повторения нужен цикл." }),
    2: tr2({ uz: "Yo'q — komponent sistemaning qismi. Takrorlash — sikl ishi.", ru: "Нет — компонент это часть системы. Повторение — работа цикла." }),
    3: tr2({ uz: "Yo'q — bog'lanish qismlarni ulaydi. Takrorlash uchun sikl ishlatamiz.", ru: "Нет — связь соединяет части. Для повторения используем цикл." }),
    default: tr2({ uz: "Takrorlash uchun — sikl.", ru: "Для повторения — цикл." })
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s13", text: `Endi navbat sizga. Quyidagi bloklardan o'z ertalabki algoritmingizni yig'ing — qadam, shart va siklni qo'shing. Keyin RUN bosib, qadamlar birma-bir bajarilganini ko'ring. Kamida 3 ta blok qo'shing.`, trigger: "on_mount", waits_for: null }]);
  const BLOCKS = [
    { ic: "🛏️", label: tr2({ uz: "Uyg'onish", ru: "Проснуться" }), type: "qadam" },
    { ic: "🚿", label: tr2({ uz: "Yuvinish", ru: "Умыться" }), type: "qadam" },
    { ic: "👕", label: tr2({ uz: "Kiyinish", ru: "Одеться" }), type: "qadam" },
    { ic: "🍳", label: tr2({ uz: "Nonushta", ru: "Позавтракать" }), type: "qadam" },
    { ic: "🔀", label: tr2({ uz: "Agar yomg'ir → soyabon ol", ru: "Если дождь → возьми зонт" }), type: "shart" },
    { ic: "🔁", label: tr2({ uz: "O'tirib-tur × 10 marta", ru: "Присядь × 10 раз" }), type: "sikl" }
  ];
  const MAX = 6;
  const [items, setItems] = useState3([]);
  const [phase, setPhase] = useState3("idle");
  const [running, setRunning] = useState3(-1);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const done = items.length >= 3;
  const add = (b) => {
    if (items.length >= MAX) return;
    setItems((prev) => [...prev, b]);
    setPhase("idle");
  };
  const reset = () => {
    clearTimeout(timer.current);
    setItems([]);
    setPhase("idle");
    setRunning(-1);
  };
  const program = items.map((b) => ({ ic: b.ic, t: b.label, type: b.type }));
  const canRun = items.length >= 1 && phase !== "run";
  const run = () => {
    if (items.length < 1) return;
    clearTimeout(timer.current);
    setPhase("run");
    setRunning(0);
    const step = (i) => {
      setRunning(i);
      if (i < items.length - 1) timer.current = setTimeout(() => step(i + 1), 450);
      else timer.current = setTimeout(() => {
        setPhase("done");
        setRunning(-1);
      }, 450);
    };
    timer.current = setTimeout(() => step(0), 260);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Amaliyot · algoritm yig'ish", ru: "Практика · сборка алгоритма" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "Kamida 3 blok", ru: "Минимум 3 блока" })} (${items.length}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'z algoritmingizni <span className="italic" style={{ color: T.accent }}>quring</span></>, ru: <><span className="italic" style={{ color: T.accent }}>Соберите</span> свой алгоритм</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi navbat sizga. Quyidagi bloklardan o'z ertalabki algoritmingizni yig'ing — <b style={{ color: T.ink }}>qadam</b>, <b style={{ color: T.blue }}>shart</b> va <b style={{ color: T.accent }}>sikl</b>ni qo'shing. Haqiqiy dasturchi ham bo'laklardan yaxlit narsa quradi. Keyin <b style={{ color: T.ink }}>▶ RUN</b> bosing. Kamida 3 ta blok qo'shing.</>, ru: <>Теперь ваша очередь. Соберите из блоков ниже свой утренний алгоритм — добавьте <b style={{ color: T.ink }}>шаг</b>, <b style={{ color: T.blue }}>условие</b> и <b style={{ color: T.accent }}>цикл</b>. Настоящий программист тоже собирает целое из кусочков. Потом нажмите <b style={{ color: T.ink }}>▶ RUN</b>. Добавьте минимум 3 блока.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Bloklar — bosib qo'shing", ru: "Блоки — нажмите, чтобы добавить" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BLOCKS.map((b, i) => <button key={i} className="gchip" disabled={items.length >= MAX || phase === "run"} onClick={() => add(b)}>
                  <span style={{ fontSize: 15 }}>{b.ic}</span> {b.label}
                </button>)}
            </div>
            <p className="body fade-up delay-2" style={{ margin: "2px 0 0", color: T.ink3, fontSize: 13 }}>{tr2({ uz: <><b style={{ color: T.ink2 }}>Maslahat:</b> kuchli algoritm — qadam + shart + sikl birga.</>, ru: <><b style={{ color: T.ink2 }}>Совет:</b> сильный алгоритм — шаг + условие + цикл вместе.</> })}</p>
            <CommandConsole program={program} running={running} phase={phase} onRun={run} onReset={reset} canRun={canRun} />
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Ertalabki sahna", ru: "Утренняя сцена" })}</p>
            <SahnaStage
    phase={phase}
    current={running}
    steps={program.map((b) => b.ic)}
    label={running >= 0 && program[running] ? `${program[running].ic} ${program[running].t}` : ""}
    idleCap={tr2({ uz: "bloklarni qo'shing va RUN bosing", ru: "добавьте блоки и нажмите RUN" })}
    result={{ icon: "🎒🙂", cap: tr2({ uz: "Algoritmingiz bajarildi", ru: "Ваш алгоритм выполнен" }) }}
  />
            {phase === "done" && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Qadamlar <b>aynan siz yozgan tartibda</b> bajarildi — bu dastur!</>, ru: <>✓ Шаги выполнились <b>ровно в том порядке, как вы написали</b> — это и есть программа!</> })}</p></div>}
            {done && phase !== "done" && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Zo'r! Siz <b>algoritm</b> tuzdingiz — aynan shunday fikrlash dasturchini dasturchi qiladi. Endi ▶ RUN bosing.</>, ru: <>Отлично! Вы составили <b>алгоритм</b> — именно такое мышление и делает программиста программистом. Теперь нажмите ▶ RUN.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var BLOK_TYPE_COLOR = { qadam: T.ink2, shart: T.blue, sikl: T.accent };
var BLOK_TYPE_LABEL = { qadam: { uz: "qadam", ru: "шаг" }, shart: { uz: "shart", ru: "условие" }, sikl: { uz: "sikl", ru: "цикл" } };
function SahnaStage({ phase, current, label, result, failText, failIcon, steps, idleIcon, idleCap }) {
  const collected = phase === "run" && Array.isArray(steps) ? steps.slice(0, Math.max(0, current) + 1) : [];
  return <div className={`kx-stage kx-${phase}`}>
      {
    /* fail — kulgili tutun to'lqinlari */
  }
      {phase === "fail" && <span className="kx-smoke" aria-hidden="true"><span>💨</span><span>💨</span><span>💨</span></span>}
      <div className="kx-counter">
        {phase === "idle" && <span className="kx-plate kx-empty">{idleIcon || "⏳"} <span className="kx-cap">{idleCap || tr2({ uz: "hali boshlanmadi", ru: "ещё не начато" })}</span></span>}
        {phase === "run" && <span className="kx-plate kx-working">
            {collected.length > 0 ? <span className="kx-fill">{collected.map((ic, i) => <span key={i} className={i === collected.length - 1 ? "kx-drop" : ""}>{ic}</span>)}</span> : <span className="kx-step">{label}</span>}
            <span className="kx-cap">{label ? `${label} · ${tr2({ uz: "bajarilmoqda…", ru: "выполняется…" })}` : tr2({ uz: "bajarilmoqda…", ru: "выполняется…" })}</span>
          </span>}
        {phase === "done" && <span className="kx-plate kx-ok"><span className="kx-served">{result?.icon || "🙂"}</span> <span className="kx-cap">{result?.cap || tr2({ uz: "Tayyor!", ru: "Готово!" })}</span></span>}
        {phase === "fail" && <span className="kx-plate kx-bad"><span className="kx-splat">{failIcon || "💥"}</span> <span className="kx-cap">{failText || tr2({ uz: "Tartib chalkash — natija buzildi!", ru: "Порядок перепутан — результат сломался!" })}</span></span>}
      </div>
    </div>;
}
function CommandConsole({ program, running, phase, onRun, onReset, canRun, title }) {
  return <div className="cc-console">
      <p className="flow-label">{title || tr2({ uz: "Mening algoritmim", ru: "Мой алгоритм" })}</p>
      <div className="algo-build" style={{ minHeight: 120 }}>
        {program.length === 0 ? <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{tr2({ uz: "// bloklarni tartib bilan qo'shing…", ru: "// добавляйте блоки по порядку…" })}</p> : program.map((b, i) => <div key={i} className={`algo-line el-in ${phase === "run" && i === running ? "cc-active" : ""}`} style={{ borderLeft: `3px solid ${BLOK_TYPE_COLOR[b.type]}` }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.ink3, fontSize: 12, minWidth: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 16 }}>{b.ic}</span>
              <span style={{ flex: 1, fontFamily: "'Manrope',sans-serif", fontSize: 14, color: T.ink }}>{b.t}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, color: BLOK_TYPE_COLOR[b.type], textTransform: "uppercase", letterSpacing: "0.06em", background: `${BLOK_TYPE_COLOR[b.type]}1A`, padding: "3px 8px", borderRadius: 7 }}>{tr2(BLOK_TYPE_LABEL[b.type] || { uz: b.type })}</span>
            </div>)}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn cc-run" disabled={!canRun || phase === "run"} onClick={onRun} style={{ alignSelf: "flex-start" }}>{phase === "run" ? tr2({ uz: "BAJARILMOQDA…", ru: "ВЫПОЛНЯЕТСЯ…" }) : "▶ RUN"}</button>
        {program.length > 0 && phase !== "run" && <button className="btn-soft" onClick={onReset}>{tr2({ uz: "↺ Tozalash", ru: "↺ Очистить" })}</button>}
      </div>
    </div>;
}
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s14", text: `AI sizga algoritm yozib berdi, lekin biror joyda adashibdi — qadamlar chalkashib ketibdi. Dasturchining eng muhim mahorati shu: xatoni topish. Diqqat bilan o'qing — qaysi ish noto'g'ri joyda turibdi? Topib, o'sha qatorni bosing.`, trigger: "on_mount", waits_for: { type: "error_found" } }]);
  const [picked, setPicked] = useState3(storedAnswer ? "go" : null);
  const [fixed, setFixed] = useState3(!!storedAnswer);
  const found = picked === "go";
  const done = fixed;
  const pickGo = () => {
    if (found) return;
    setPicked("go");
    audio.triggerEvent("error_found");
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Topdingiz! "Maktabga chiqish" birinchi bo'lib qolgan — kiyinishdan oldin. Endi tartibni to'g'rilaymiz.`);
    }, 300);
  };
  const fix = () => {
    setFixed(true);
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Tuzatildi! Endi tartib to'g'ri: kiyin, nonushta qil, keyin maktabga.`);
    }, 300);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const WRONG = [{ id: "go", ic: "🏫", t: tr2({ uz: "Maktabga chiqish", ru: "Выйти в школу" }) }, { id: "dress", ic: "👕", t: tr2({ uz: "Kiyinish", ru: "Одеться" }) }, { id: "eat", ic: "🍳", t: tr2({ uz: "Nonushta", ru: "Позавтракать" }) }];
  const RIGHT = [{ ic: "👕", t: tr2({ uz: "Kiyinish", ru: "Одеться" }) }, { ic: "🍳", t: tr2({ uz: "Nonushta", ru: "Позавтракать" }) }, { ic: "🏫", t: tr2({ uz: "Maktabga chiqish", ru: "Выйти в школу" }) }];
  return <Stage eyebrow={tr2({ uz: "Debugging", ru: "Debugging" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : found ? tr2({ uz: "Endi tuzating", ru: "Теперь исправьте" }) : tr2({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Algoritmda <span className="italic" style={{ color: T.accent }}>xato</span> bor — toping</>, ru: <>В алгоритме есть <span className="italic" style={{ color: T.accent }}>ошибка</span> — найдите её</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI sizga algoritm yozib berdi, lekin biror joyda <b style={{ color: T.ink }}>adashibdi</b> — qadamlar chalkashib ketibdi. Dasturchining eng muhim mahorati — xatoni topish. Qaysi qadam noto'g'ri joyda turibdi? O'sha qatorni bosing.</>, ru: <>AI написал вам алгоритм, но где-то <b style={{ color: T.ink }}>ошибся</b> — шаги перепутались. Самое важное умение программиста — находить ошибку. Какой шаг стоит не на своём месте? Нажмите на эту строку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "Ertalabki tartibingiz tayyor:", ru: "Ваш утренний порядок готов:" })}</span></div>
              <div className="ai-code">
                {!fixed ? WRONG.map((s, i) => <div key={s.id} className={`ai-line ${found && s.id === "go" ? "bad" : picked === s.id && !found ? "ok" : ""}`} onClick={() => {
    if (found) return;
    if (s.id === "go") pickGo();
    else setPicked(s.id);
  }}>
                    <span style={{ color: CODE.comment }}>{i + 1}.</span> {s.ic} {s.t} {s.id === "go" && <span style={{ color: CODE.comment }}>{tr2({ uz: "← birinchi?", ru: "← первым?" })}</span>}
                  </div>) : RIGHT.map((s, i) => <div key={i} className="ai-line ok"><span style={{ color: CODE.comment }}>{i + 1}.</span> {s.ic} {s.t}</div>)}
              </div>
              {!found && <p className="ai-prompt">{tr2({ uz: "Qaysi qadam noto'g'ri joyda? Bosing.", ru: "Какой шаг стоит не на своём месте? Нажмите." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={fix}>{tr2({ uz: "🔧 Tartibni to'g'rilash", ru: "🔧 Исправить порядок" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>{tr2({ uz: "✓ Tartib to'g'rilandi!", ru: "✓ Порядок исправлен!" })}</p>}
            </div>
          </Col>
          <Col>
            {!found && (picked && picked !== "go" ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bu qadam o'rnida — yaxshi. Lekin yana qarang: qaysi ish boshqalardan <b>oldin</b> bo'lib qolgan, vaholanki u oxirida bo'lishi kerak?</>, ru: <>Этот шаг на своём месте — хорошо. Но посмотрите ещё раз: какое дело оказалось <b>раньше</b> остальных, хотя должно быть последним?</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Mantiqan o'ylang: maktabga chiqishdan <b>oldin</b> nima qilish kerak? Tartibni tekshiring.</>, ru: <>Подумайте логически: что нужно сделать <b>перед</b> выходом в школу? Проверьте порядок.</> })}</p></div>)}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr2({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>«Maktabga chiqish» birinchi bo'lib qolgan — kiyinish va nonushtadan oldin! Chap tugmani bosib to'g'rilang →</>, ru: <>«Выйти в школу» оказалось первым — раньше одевания и завтрака! Нажмите кнопку слева и исправьте →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr2({ uz: "Topdingiz va tuzatdingiz — bu debugging!", ru: "Нашли и исправили — это и есть debugging!" })}</p><p className="ta-sub">{tr2({ uz: "Algoritmda tartib — eng ko'p xato chiqadigan joy", ru: "Порядок в алгоритме — место, где чаще всего появляются ошибки" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s15", text: `Mana, oxirgi sinov. Endi hammasini o'zingiz qiling: ertalabki tartibni to'g'ri ketma-ketlikda tuzing, keyin RUN bosing. Yaxshilab o'ylang — eng avval nimadan boshlanadi?`, trigger: "on_mount", waits_for: { type: "typed_ok" } }]);
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === "mentor");
  const STEPS = { wake: { ic: "🛏️", t: tr2({ uz: "Uyg'onish", ru: "Проснуться" }), type: "qadam" }, wash: { ic: "🚿", t: tr2({ uz: "Yuvinish", ru: "Умыться" }), type: "qadam" }, dress: { ic: "👕", t: tr2({ uz: "Kiyinish", ru: "Одеться" }), type: "qadam" }, eat: { ic: "🍳", t: tr2({ uz: "Nonushta", ru: "Позавтракать" }), type: "qadam" } };
  const CORRECT = ["wake", "wash", "dress", "eat"];
  const SHUFFLED = ["dress", "eat", "wake", "wash"];
  const [order, setOrder] = useState3(Array.isArray(storedAnswer?.picked) ? storedAnswer.picked : []);
  const [passed, setPassed] = useState3(!!storedAnswer?.correct);
  const [phase, setPhase] = useState3(storedAnswer?.correct ? "done" : "idle");
  const [running, setRunning] = useState3(-1);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const program = order.map((id) => ({ id, ...STEPS[id] }));
  const canRun = order.length === CORRECT.length;
  const tap = (id) => {
    if (phase === "run" || passed || order.includes(id)) return;
    setOrder((o) => [...o, id]);
    setPhase("idle");
  };
  const reset = () => {
    clearTimeout(timer.current);
    setOrder([]);
    setPhase("idle");
    setRunning(-1);
  };
  const run = () => {
    if (!canRun) return;
    clearTimeout(timer.current);
    setPhase("run");
    setRunning(0);
    const step = (i) => {
      setRunning(i);
      if (i < CORRECT.length - 1) {
        timer.current = setTimeout(() => step(i + 1), 520);
      } else {
        timer.current = setTimeout(() => {
          const ok = order.every((x, k) => x === CORRECT[k]);
          if (ok) {
            setPhase("done");
            setPassed(true);
            setRunning(-1);
            onAnswer(screen, { correct: true, picked: order });
            if (live && live.mode === "student") live.submitAnswer(screen, "s15", 0, true, 0);
            audio.triggerEvent("typed_ok");
            if (!audio.muted) setTimeout(() => {
              const e = getAudioEngine();
              if (e && !audio.muted) e.pushOneOff(`Zo'r! Ketma-ketlik to'liq to'g'ri.`);
            }, 300);
          } else {
            setPhase("fail");
            setRunning(-1);
          }
        }, 520);
      }
    };
    timer.current = setTimeout(() => step(0), 300);
  };
  const firstErr = order.findIndex((x, k) => x !== CORRECT[k]);
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !passed} label={isMentorLive ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : passed ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : canRun ? tr2({ uz: "RUN bosing", ru: "Нажмите RUN" }) : tr2({ uz: "Tartibni tuzing", ru: "Составьте порядок" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>tartibni</span> o'zingiz tuzing.</>, ru: <>Последний шаг: составьте <span className="italic" style={{ color: T.accent }}>порядок</span> сами.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Mana, oxirgi sinov. Endi hammasini o'zingiz qiling: ertalabki tartibni <b style={{ color: T.ink }}>to'g'ri ketma-ketlikda</b> tuzing, keyin <b style={{ color: T.ink }}>▶ RUN</b> bosing. Yaxshilab o'ylang — eng avval nimadan boshlanadi?</>, ru: <>Вот и последнее испытание. Теперь всё сами: составьте утренний порядок <b style={{ color: T.ink }}>в правильной последовательности</b>, потом нажмите <b style={{ color: T.ink }}>▶ RUN</b>. Подумайте как следует — с чего всё начинается?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Qadamlar — to'g'ri tartibda bosing", ru: "Шаги — нажимайте в правильном порядке" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {SHUFFLED.map((id) => {
    const used = order.includes(id);
    return <button key={id} onClick={() => tap(id)} disabled={used || phase === "run" || passed} style={{ display: "flex", alignItems: "center", gap: 8, cursor: used || passed ? "default" : "pointer", border: `1.5px solid ${BLOK_TYPE_COLOR[STEPS[id].type]}44`, borderRadius: 12, padding: "12px 15px", background: used ? T.bg : T.paper, opacity: used ? 0.4 : 1, boxShadow: used ? "none" : `0 6px 16px -6px rgba(${T.shadowBase},0.16)`, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink, transition: "all 0.18s" }}>
                    <span style={{ fontSize: 18 }}>{STEPS[id].ic}</span> {STEPS[id].t}
                  </button>;
  })}
            </div>
            <CommandConsole program={program} running={running} phase={phase} onRun={run} onReset={reset} canRun={canRun} />
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Ertalabki sahna", ru: "Утренняя сцена" })}</p>
            <SahnaStage
    phase={phase}
    current={running}
    steps={program.map((b) => b.ic)}
    label={running >= 0 && program[running] ? `${program[running].ic} ${program[running].t}` : ""}
    idleCap={tr2({ uz: "qadamlarni tartibla va RUN bos", ru: "расставьте шаги и нажмите RUN" })}
    result={{ icon: "🎒🙂", cap: tr2({ uz: "Ertalab mukammal o'tdi", ru: "Утро прошло идеально" }) }}
    failIcon="🙈"
    failText={tr2({ uz: "Tartib chalkash — natija buzildi!", ru: "Порядок перепутан — результат сломался!" })}
  />
            {phase === "done" && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ To'g'ri! Uyg'on → yuvin → kiyin → nonushta. Mukammal ketma-ketlik!", ru: "✓ Верно! Проснуться → умыться → одеться → позавтракать. Идеальная последовательность!" })}</p></div>}
            {phase === "fail" && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr2({ uz: "Tartib aralashdi", ru: "Порядок перепутался" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{firstErr >= 0 ? tr2({ uz: `${firstErr + 1}-qadam noto'g'ri joyda.`, ru: `Шаг №${firstErr + 1} не на своём месте.` }) : tr2({ uz: "Tartib chalkash.", ru: "Порядок перепутан." })} {tr2({ uz: <>«↺ Tozalash» bosib qaytadan urinib ko'ring — avval nimadan boshlaysiz? Xatoni topib tuzatish — bu <b>debugging</b>!</>, ru: <>Нажмите «↺ Очистить» и попробуйте снова — с чего вы начинаете? Искать и чинить ошибки — это <b>debugging</b>!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var JS_FLASHCARDS = [
  { front: { uz: "Birga ishlab, bitta maqsadga xizmat qiladigan qismlar to'plami qanday ataladi?", ru: "Как называется набор частей, которые работают вместе ради одной цели?" }, back: { uz: "Sistema", ru: "Система" }, note: { uz: "tana · jamoa · sayt — hammasi sistema", ru: "тело · команда · сайт — всё это системы" } },
  { front: { uz: "Sistemaning bitta qismini nima deb ataymiz?", ru: "Как мы называем одну часть системы?" }, back: { uz: "Komponent", ru: "Компонент" }, note: { uz: "yurak — tananing komponenti", ru: "сердце — компонент тела" } },
  { front: { uz: "Qismlarni bir-biriga ulaydigan yo'l qanday ataladi?", ru: "Как называется путь, соединяющий части между собой?" }, back: { uz: "Bog'lanish", ru: "Связь" }, note: { uz: "yurak qon yuboradi — o'pkaga boradi", ru: "сердце гонит кровь — она идёт в лёгкие" } },
  { front: { uz: "Aniq, ketma-ket qadamlardan tuzilgan reja qanday ataladi?", ru: "Как называется план из точных, последовательных шагов?" }, back: { uz: "Algoritm", ru: "Алгоритм" }, note: { uz: "non oling · murabbo suring · yeng", ru: "возьмите хлеб · намажьте варенье · ешьте" } },
  { front: { uz: "Algoritmda qadamlar tartibi muhimmi?", ru: "Важен ли в алгоритме порядок шагов?" }, back: { uz: "Ha, juda muhim", ru: "Да, очень важен" }, note: { uz: "avval non, keyin murabbo — teskarisi ishlamaydi", ru: "сначала хлеб, потом варенье — наоборот не выйдет" } },
  { front: { uz: "«Agar yomg'ir yog'sa — soyabon oling» — bu qanday qadam?", ru: "«Если идёт дождь — возьмите зонт» — что это за шаг?" }, back: { uz: "Shart", ru: "Условие" }, note: { uz: "agar... bo'lsa... — yo'l tanlaydi", ru: "если... то... — выбирает путь" } },
  { front: { uz: "«10 marta o'tirib-turing» — bu qanday qadam?", ru: "«Присядьте 10 раз» — что это за шаг?" }, back: { uz: "Sikl", ru: "Цикл" }, note: { uz: "bitta harakat ko'p marta qaytariladi", ru: "одно движение повторяется много раз" } },
  { front: { uz: "Shart bilan sikl orasidagi farq nima?", ru: "В чём разница между условием и циклом?" }, back: { uz: "Shart tanlaydi, sikl takrorlaydi", ru: "Условие выбирает, цикл повторяет" }, note: { uz: "shart bir marta tekshiradi", ru: "условие проверяет один раз" } },
  { front: { uz: "Kompyuter bajaradigan tayyor algoritm nima deb ataladi?", ru: "Как называется готовый алгоритм, который выполняет компьютер?" }, back: { uz: "Dastur", ru: "Программа" }, note: { uz: "kodga aylangan algoritm", ru: "алгоритм, ставший кодом" } },
  { front: { uz: "Koddagi xatoni topib tuzatish qanday ataladi?", ru: "Как называется поиск и исправление ошибки в коде?" }, back: { uz: "Debugging", ru: "Debugging" }, note: { uz: "har bir dasturchi buni har kuni qiladi", ru: "это делает каждый программист каждый день" } },
  { front: { uz: "Bitta g'ildirak mashina bo'la oladimi?", ru: "Может ли одно колесо быть машиной?" }, back: { uz: "Yo'q — qismlar birga kerak", ru: "Нет — нужны все части вместе" }, note: { uz: "sistema = qismlar + bog'lanishlar", ru: "система = части + связи" } }
];
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{total}/{total} {tr2({ uz: "tushuncha yodlandi", ru: "понятий выучено" })}</p><button className="fc-btn ghost" onClick={restart}>{tr2({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda ·", ru: "↻ Учим ·" })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim ·", ru: "✓ Знаю ·" })} <b>{known}</b></span></div>
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
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "sflash", text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: "on_mount", waits_for: null }]);
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={JS_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, onReset, onPrev, onFinish }) => {
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
  const audio = useAudio([{ id: "s16", text: "Tabriklaymiz — bugun siz dasturchining tilida fikrlay boshladingiz! Bitta gapni yodda saqlang: har qanday ilova — bu sistema, sistema ichida esa algoritmlar ishlaydi. Keyingi darsda eng qizig'i boshlanadi — shu algoritmlarni kompyuterga JavaScript tilida yozamiz.", trigger: "on_mount", waits_for: null }]);
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const [arena, setArena] = useState3(false);
  const [arenaSolo, setArenaSolo] = useState3(false);
  const quizSt = live && live.quiz && live.quiz.state || "off";
  const isStudentL = live && live.mode === "student";
  const isMentorL = live && live.mode === "mentor";
  const classOver = !!(live && (live.status === "ended" || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== "done";
  const studentLive = isStudentL && !studentSolo && quizSt !== "off";
  const studentWait = isStudentL && !studentSolo && quizSt === "off";
  const openArena = async () => {
    if (isMentorL && quizSt === "off") {
      try {
        await live.quizControl("lobby", -1);
      } catch {
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [tr2({ uz: "Sistema — komponentlar va bog'lanishlar", ru: "Система — компоненты и связи" }), tr2({ uz: "Atrofdagi sistemalar (tana, jamoa, sayt)", ru: "Системы вокруг нас (тело, команда, сайт)" }), tr2({ uz: "Algoritm — aniq qadamlar tartibi", ru: "Алгоритм — порядок точных шагов" }), tr2({ uz: "Ketma-ketlik — tartib muhim", ru: "Последовательность — порядок важен" }), tr2({ uz: "Shart (agar...bo'lsa) va Sikl (takrorla)", ru: "Условие (если... то) и Цикл (повтори)" })];
  const HOMEWORK = [{ b: tr2({ uz: "Sistemani toping", ru: "Найдите систему" }), t: tr2({ uz: "— atrofingizdan 1 sistema toping, qismlarini yozing", ru: "— найдите вокруг себя 1 систему и запишите её части" }) }, { b: tr2({ uz: "Algoritm yozing", ru: "Напишите алгоритм" }), t: tr2({ uz: "— maktabga tayyorgarlikni qadam-baqadam yozing", ru: "— распишите сборы в школу шаг за шагом" }) }, { b: tr2({ uz: "Shart qo'shing", ru: "Добавьте условие" }), t: tr2({ uz: `— "agar... bo'lsa..." qadamini qo'shing`, ru: "— добавьте шаг «если... то...»" }) }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const earned = useContext2(AchCtx);
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Dars tugadi", ru: "Урок завершён" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>dasturchidek</span> fikrlaysiz.</>, ru: <>Теперь вы думаете <span className="italic" style={{ color: T.accent }}>как программист</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        {
    /* F-0807-02: «Bugungi asosiy fikr» qatori olib tashlandi — pastdagi «Endi siz bilasiz»
       ro'yxati o'sha fikrni allaqachon aytadi; takror yopuvchi gap ortiqcha yuk edi. */
  }
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark
    stats={false}
    liveOn={studentLive}
    disabled={studentWait}
    onClick={studentWait ? void 0 : openArena}
    hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0}
  />
        </div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: "Atrofingizdagi hayotni algoritm qilib yozing:", ru: "Опишите жизнь вокруг себя в виде алгоритма:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "Keyingi darsda shu algoritmlarni kompyuterga JavaScript tilida yozishni boshlaymiz! 🚀", ru: "На следующем уроке начнём записывать эти алгоритмы для компьютера на языке JavaScript! 🚀" })}</p></div>}
        {
    /* 🔴 Nishon-kolleksiyasi — SHAXSIY hisob, mentor proyektorida ko'rsatilmaydi (90-qonun) */
  }
        {!isMentorL && <div className="card fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz —", ru: "🏅 Ваши награды —" })} {earned ? earned.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid" style={{ marginTop: 8 }}>{Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(earned && earned.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`}><span className="ach-badge-ic">{got ? a.icon : "🔒"}</span><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{got ? tr2(a.desc) : "—"}</span></div>;
  })}</div>
        </div>}
        {
    /* F-0807-02: «Kalit so'zlar» akkordeoni olib tashlandi — flashcard ekrani (sflash)
       o'sha atamalarni faolroq takrorlaydi; yakunda ikkinchi lug'at ortiqcha edi. */
  }
      </div>
      {arena && <QuizArena live={live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
    </Stage>;
};
var Q_LABELS = { 4: { uz: "1 — Sistema", ru: "1 — Система" }, 6: { uz: "2 — Bog'lanish", ru: "2 — Связь" }, 10: { uz: "3 — Shart (AGAR)", ru: "3 — Условие (ЕСЛИ)" }, 13: { uz: "4 — Sikl (takror)", ru: "4 — Цикл (повтор)" }, 16: { uz: "5 — Ertalabki tartib", ru: "5 — Утренний порядок" } };
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
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr2({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.", ru: "Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить ещё раз." })}</p>}
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
  { ch: "QADAM", l: 5, t: 10, s: 40, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "AGAR", l: 84, t: 8, s: 36, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "TAKRORLA", l: 7, t: 72, s: 34, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: "▶", l: 82, t: 68, s: 52, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "1→2→3", l: 44, t: 86, s: 32, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "AGAR", l: 66, t: 26, s: 26, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: "QADAM", l: 26, t: 34, s: 24, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "▶", l: 55, t: 5, s: 34, c: "rgba(120,235,175,0.13)", d: 22, dl: 0.6 },
  { ch: "TAKRORLA", l: 92, t: 44, s: 22, c: "rgba(203,173,255,0.10)", d: 24, dl: 1.3 },
  { ch: "1→2→3", l: 2, t: 45, s: 24, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var INLINE_KEYS = { s4: 1, s5b: 0, s9: 1, s12: 1, s15: -1 };
var QUIZ_BANK = [
  { q: { uz: "Sistema — bu asli nima?", ru: "Что такое система на самом деле?" }, opts: [{ uz: "Bir-biriga bog'lanmagan tasodifiy narsalar to'plami", ru: "Набор случайных, не связанных между собой предметов" }, { uz: "Birga ishlab, umumiy maqsadga xizmat qiladigan qismlar", ru: "Части, которые работают вместе ради общей цели" }, { uz: "Faqat kompyuterda ishlaydigan dastur", ru: "Программа, которая работает только на компьютере" }, { uz: "Bo'linmaydigan bitta katta yaxlit qism", ru: "Одна большая неделимая цельная часть" }], correct: 1 },
  { q: { uz: "Quyidagilardan qaysi biri SISTEMA?", ru: "Что из перечисленного — СИСТЕМА?" }, opts: [{ uz: "Yo'lda yotgan bitta oddiy kulrang tosh", ru: "Один обычный серый камень на дороге" }, { uz: "Ichi bo'sh, yopiq turgan bitta quti", ru: "Одна пустая закрытая коробка" }, { uz: "Inson tanasi — a'zolar birga ishlaydi", ru: "Тело человека — органы работают вместе" }, { uz: "Daftar chetidagi alohida bitta harf", ru: "Одна отдельная буква на краю тетради" }], correct: 2 },
  { q: { uz: "Sistemadagi «komponent» nima?", ru: "Что такое «компонент» в системе?" }, opts: [{ uz: "Sistemani tashkil qiluvchi bir qism", ru: "Одна из частей, из которых состоит система" }, { uz: "Butun sistemaga berilgan umumiy nom", ru: "Общее название всей системы" }, { uz: "Sistemadan butunlay tashqaridagi narsa", ru: "То, что находится совсем вне системы" }, { uz: "Sistemadagi juda kichik bir xatolik", ru: "Очень маленькая ошибка в системе" }], correct: 0 },
  { q: { uz: "«Bog'lanish» sistemada nimani bildiradi?", ru: "Что означает «связь» в системе?" }, opts: [{ uz: "Qismlarni bir-biriga ulaydigan aloqa", ru: "Соединение, связывающее части друг с другом" }, { uz: "Sistemadagi eng katta va og'ir qism", ru: "Самая большая и тяжёлая часть системы" }, { uz: "Butun sistemaga berilgan umumiy nom", ru: "Общее название всей системы" }, { uz: "Keraksiz, ortiqcha bo'sh turgan qism", ru: "Ненужная, лишняя простаивающая часть" }], correct: 0 },
  { q: { uz: "Algoritm — bu asli nima?", ru: "Что такое алгоритм на самом деле?" }, opts: [{ uz: "Tartibsiz, chalkash fikrlar to'plami", ru: "Беспорядочный набор запутанных мыслей" }, { uz: "Aniq, ketma-ket qadamlar tartibi", ru: "Порядок точных, последовательных шагов" }, { uz: "Faqat juda murakkab matematik formula", ru: "Только очень сложная математическая формула" }, { uz: "Kompyuter mashinasiga berilgan nom", ru: "Название компьютерной машины" }], correct: 1 },
  { q: { uz: "Ertalabki tartib — uyg'on, yuvin, kiyin — bu nimaga misol?", ru: "Утренний порядок — проснуться, умыться, одеться — пример чего?" }, opts: [{ uz: "Sistema", ru: "Система" }, { uz: "Komponent", ru: "Компонент" }, { uz: "Algoritm", ru: "Алгоритм" }, { uz: "Bog'lanish", ru: "Связь" }], correct: 2 },
  { q: { uz: "Algoritmda qadamlar TARTIBI muhimmi?", ru: "Важен ли ПОРЯДОК шагов в алгоритме?" }, opts: [{ uz: "Yo'q, qadamlar tartibining farqi yo'q", ru: "Нет, порядок шагов не имеет значения" }, { uz: "Faqat kompyuterda ishlaganda muhim", ru: "Важен только при работе на компьютере" }, { uz: "Ha — tartib buzilsa, natija ham buziladi", ru: "Да — нарушится порядок, сломается и результат" }, { uz: "Faqat eng oxirgi bitta qadam muhim", ru: "Важен только самый последний шаг" }], correct: 2 },
  { q: { uz: "«AGAR yomg'ir yog'sa — soyabon ol» — bu algoritmning qaysi qismi?", ru: "«ЕСЛИ идёт дождь — возьми зонт» — какая это часть алгоритма?" }, opts: [{ uz: "Ketma-ketlik", ru: "Последовательность" }, { uz: "Sikl", ru: "Цикл" }, { uz: "Komponent", ru: "Компонент" }, { uz: "Shart", ru: "Условие" }], correct: 3 },
  { q: { uz: "Bir amalni KO'P MARTA takrorlash uchun algoritmda nima ishlatiladi?", ru: "Что используется в алгоритме, чтобы повторить действие МНОГО РАЗ?" }, opts: [{ uz: "Shart (agar...bo'lsa)", ru: "Условие (если... то)" }, { uz: "Sikl (takrorlash)", ru: "Цикл (повторение)" }, { uz: "Bog'lanish (aloqa)", ru: "Связь (соединение)" }, { uz: "Komponent (qism)", ru: "Компонент (часть)" }], correct: 1 },
  { q: { uz: "Futbol jamoasi nega sistema hisoblanadi?", ru: "Почему футбольная команда считается системой?" }, opts: [{ uz: "Chunki maydonda o'yinchi juda ko'p to'plangan", ru: "Потому что на поле собралось очень много игроков" }, { uz: "Chunki futbol maydoni juda katta va yam-yashil", ru: "Потому что футбольное поле большое и зелёное" }, { uz: "Chunki o'yin to'pi dumaloq va silliq shaklda bo'ladi", ru: "Потому что мяч круглый и гладкий" }, { uz: "Chunki o'yinchilar bitta maqsad uchun birga ishlaydi", ru: "Потому что игроки работают вместе ради одной цели" }], correct: 3 },
  { q: { uz: "Algoritmning 3 asosiy «g'ishti» qaysilar?", ru: "Какие 3 главных «кирпича» у алгоритма?" }, opts: [{ uz: "Ketma-ketlik, Shart, Sikl", ru: "Последовательность, Условие, Цикл" }, { uz: "Rang, Shakl, O'lcham", ru: "Цвет, Форма, Размер" }, { uz: "Kim, Muammo, Yechim", ru: "Кто, Проблема, Решение" }, { uz: "Boshi, O'rtasi, Oxiri", ru: "Начало, Середина, Конец" }], correct: 0 },
  { q: { uz: "«Svetofor yashil bo'lsa — yur, qizil bo'lsa — to'xta» — bu qanday qism?", ru: "«Светофор зелёный — иди, красный — стой» — что это за часть?" }, opts: [{ uz: "Sikl (takrorlash)", ru: "Цикл (повторение)" }, { uz: "Ketma-ketlik (tartib)", ru: "Последовательность (порядок)" }, { uz: "Bog'lanish (aloqa)", ru: "Связь (соединение)" }, { uz: "Shart (agar...bo'lsa)", ru: "Условие (если... то)" }], correct: 3 }
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
var QzBolt = ({ size = 72 }) => <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="qz-bolt">
    <defs><linearGradient id="qzbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#FF4F28" /></linearGradient></defs>
    <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#qzbg)" />
    <path d="M56 12 L28 54 L45 54 L38 88 L72 40 L53 40 Z" fill="#fff" stroke="#E23A16" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="76" cy="24" r="3.5" fill="#FFD9A8" /><circle cx="22" cy="72" r="2.6" fill="#FFD9A8" /><circle cx="80" cy="66" r="2.2" fill="#FFD9A8" />
  </svg>;
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
    const TOK = ["QADAM", "AGAR", "TAKRORLA", "▶", "1→2→3", "SHART", "SIKL", "→"];
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
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
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
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме практики" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт бонус 🔥!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте своё на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Будьте быстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: "Siz hozir:", ru: "Вы сейчас:" })} {myRank + 1}-{tr2({ uz: "o'rin", ru: "е место" })}</span>}
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
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: "clamp(20px,3.4vw,30px)" }}>{tr2({ uz: "Test yakunlandi! 🎉", ru: "Тест завершён! 🎉" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? ` · ${tr2({ uz: "eng uzun streak", ru: "лучшая серия" })} 🔥x${soloScore.maxStreak}` : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr2({ uz: "↻ Qayta ishlash", ru: "↻ Пройти ещё раз" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} ball · {b.ok}/{QUIZ_BANK.length}</span>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест ещё раз — практика (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
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
function JsIntroLesson({ lang: langProp, onFinished, liveToken }) {
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
  const earnedRef = useRef3(new Set(saved?.earned || []));
  const [earned, setEarned] = useState3(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState3([]);
  const achKeyRef = useRef3(0);
  const earn = useCallback2((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
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
    if (_m && _m.scored && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  useEffect4(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen]);
  const reset = () => {
    progClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    startTimeRef.current = Date.now();
    earnedRef.current = /* @__PURE__ */ new Set();
    setEarned(/* @__PURE__ */ new Set());
    setAchToasts([]);
  };
  useEffect4(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect4(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const scoredMeta = SCREEN_META.filter((s) => s.scored);
    const finalMeta = scoredMeta.filter((s) => s.scope === "final");
    const scoredAnswers = SCREEN_META.map((s, i) => s.scored ? answers[i] : null).filter(Boolean);
    const correctAnswers = scoredAnswers.filter((a) => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => s.scored && s.scope === "final" ? answers[i] : null).filter(Boolean);
    const finalCorrect = finalAnswers.filter((a) => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null,
      livePin: live.pin || null,
      liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1e3),
      totalQuestions: scoredMeta.length,
      correctAnswers,
      scorePercent: scoredMeta.length ? Math.round(correctAnswers / scoredMeta.length * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false,
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === "function") onFinished(payload);
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
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        /* === OPTIMALLASHTIRISH (2026) — yangi animatsiyalar === */
        /* p1: yurak urishi / tezlik indikatori */
        .bpm-row { display: flex; align-items: center; gap: 12px; background: ${T.bg}; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; }
        .bpm-heart { font-size: 24px; display: inline-block; animation: heart-beat 1s ease-in-out infinite; }
        @keyframes heart-beat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.18); } 56% { transform: scale(1); } }
        .bpm-info { display: flex; flex-direction: column; line-height: 1.05; }
        .bpm-num { font-family: 'Fraunces', serif; font-size: 26px; transition: color 0.3s; }
        .bpm-unit { font-family: 'JetBrains Mono'; font-size: 9px; color: ${T.ink3}; text-transform: uppercase; letter-spacing: 0.07em; }
        .eq { display: flex; align-items: flex-end; gap: 3px; height: 26px; margin-left: auto; }
        .eq-bar { width: 5px; height: 100%; background: ${T.accent}; border-radius: 2px; transform-origin: bottom; animation: eq-bounce 1s ease-in-out infinite; }
        @keyframes eq-bounce { 0%,100% { transform: scaleY(0.28); } 50% { transform: scaleY(1); } }
        /* p2: g'oya emoji badge */
        .idea-ic { width: 54px; height: 54px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; animation: idea-float 3.2s ease-in-out infinite; }
        .idea-ic-sys { background: ${T.accentSoft}; }
        .idea-ic-algo { background: ${T.blueSoft}; animation-delay: 0.8s; }
        @keyframes idea-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
        /* p6: bog'lanish pulsi */
        .lnk-pulse { display: inline-block; animation: lnk-pulse 1.3s ease-in-out infinite; }
        @keyframes lnk-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.22); } }
        /* p7: ketma-ketlik natija */
        .seq-result { display: flex; align-items: center; gap: 10px; margin-top: 4px; padding: 10px 13px; border-radius: 12px; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; animation: fade-step 0.35s ease-out; }
        /* p8: ob-havo effektlari */
        .weather-btn { position: relative; overflow: hidden; }
        /* F-0807-02: karta bosiladigani ko'rinib tursin — ichida haqiqiy tugma-yorliq,
           va birinchi bosilgunicha yengil puls (tap-hint). */
        .weather-btn .wx-cta { display: inline-flex; align-items: center; gap: 7px; margin-top: 4px; padding: 9px 16px; border-radius: 99px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; box-shadow: 0 8px 18px -8px rgba(255,79,40,0.55); position: relative; z-index: 1; transition: transform 0.16s, box-shadow 0.16s; }
        .weather-btn:hover .wx-cta { transform: translateY(-2px); box-shadow: 0 12px 22px -8px rgba(255,79,40,0.6); }
        .weather-btn.wx-hint .wx-cta { animation: wx-tap 1.5s ease-in-out infinite; }
        @keyframes wx-tap { 0%,100% { transform: scale(1); } 50% { transform: scale(1.055); } }
        @media (prefers-reduced-motion: reduce) { .weather-btn.wx-hint .wx-cta { animation: none; } .weather-btn:hover .wx-cta { transform: none; } }
        .wx-fx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .wx-fx i { position: absolute; top: -14%; width: 2px; height: 15px; background: rgba(1,154,203,0.6); border-radius: 2px; animation: rain-fall 0.85s linear infinite; }
        @keyframes rain-fall { to { transform: translateY(170px); opacity: 0.2; } }
        .sun-fx { position: absolute; top: 14px; left: 50%; width: 96px; height: 96px; transform: translateX(-50%); background: radial-gradient(circle, rgba(255,184,0,0.5), transparent 68%); border-radius: 50%; animation: sun-glow 2.6s ease-in-out infinite; pointer-events: none; z-index: 0; }
        @keyframes sun-glow { 0%,100% { transform: translateX(-50%) scale(0.82); opacity: 0.55; } 50% { transform: translateX(-50%) scale(1.16); opacity: 1; } }
        /* F-0807-02: natija-satri — oq karta va soya OLIB TASHLANDI. Ular buni tugmaga
           o'xshatib qo'yardi va o'quvchi bosib ko'rardi (yolg'on affordans). Endi u
           faqat yozuv: bosiladigan yagona narsa — chapdagi ob-havo kartasi. */
        .cond-result { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; margin-top: 4px; padding: 4px 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; animation: veh-pop 0.4s cubic-bezier(.34,1.4,.5,1); }
        @keyframes veh-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        /* p12: sikl — squat figurasi */
        .squat-stage { display: flex; align-items: center; gap: 16px; margin: 4px 0 2px; }
        .squat-fig { font-size: 40px; display: inline-block; animation: squat 0.42s ease-out; }
        @keyframes squat { 0% { transform: translateY(0) scaleY(1); } 42% { transform: translateY(11px) scaleY(0.8); } 100% { transform: translateY(0) scaleY(1); } }
        .loop-spin { font-size: 22px; display: inline-block; animation: loop-rot 0.55s ease-in-out; }
        @keyframes loop-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        /* sikl hisoblagichi — har takrorda puls */
        .loop-num { display: inline-block; animation: loop-num-pop 0.28s cubic-bezier(.3,1.6,.5,1); }
        @keyframes loop-num-pop { 0% { transform: scale(0.7); } 60% { transform: scale(1.22); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .loop-num, .squat-fig, .loop-spin { animation: none !important; } }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
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
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }

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
        .cond-line { position: relative; overflow: hidden; font-family: 'Manrope'; font-size: clamp(13px,1.7vw,15px); color: ${T.ink2}; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; transition: all 0.3s; }
        .cond-line.on { background: ${T.successSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.success}; animation: cond-pick 0.5s cubic-bezier(.3,1.4,.5,1); }
        @keyframes cond-pick { 0% { transform: scale(0.97); } 55% { transform: scale(1.025); } 100% { transform: scale(1); } }
        /* tarmoq-yo'li yorishishi — faol shoxchada yugurib o'tuvchi nur */
        .cond-line.on::after { content: ''; position: absolute; top: 0; left: -40%; width: 40%; height: 100%; background: linear-gradient(100deg, transparent, ${T.success}44 45%, ${T.success}66 50%, transparent); animation: cond-flow 0.7s ease-out; }
        @keyframes cond-flow { from { left: -45%; } to { left: 120%; } }
        @media (prefers-reduced-motion: reduce) { .cond-line.on { animation: none !important; } .cond-line.on::after { display: none; } }
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
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

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

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===================== JONLI DARS CSS (InternetLesson bilan bir xil) ===================== */
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
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.ink}; color: #fff; border: none; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
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
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
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

        /* === ⚡ CTA (yakun sahifasida — yorug' CodeStrike) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(255,79,40,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); } 50% { transform: scale(1.06); box-shadow: 0 16px 34px -6px rgba(255,79,40,0.9); } }
        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

        /* ===== ⚡ ARENA — tungi neon CodeStrike muhiti (indigo turnir-foni) ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
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
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
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
        .pod-col.me .pod-name { color: ${T.accent}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: rgba(18,169,104,0.12); outline: 1.5px solid #12A968; }
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
        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: rgba(167,166,162,0.35); border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid rgba(167,166,162,0.35); z-index: -1; }
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
        .fc-front { background: ${T.paper}; border: 2px solid rgba(167,166,162,0.35); box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
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
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid rgba(167,166,162,0.35); color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }
        /* === 🧩 SahnaStage / CommandConsole (skelet; sayqal → Dizayn/Animatsiya) === */
        .kx-stage { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 14px; border-radius: 20px; padding: clamp(18px,3vw,28px) clamp(16px,3vw,26px) clamp(14px,2.4vw,22px); background: linear-gradient(180deg, #FFF7F3 0%, #FFEFE8 100%); border: 2px solid ${T.accentSoft}; box-shadow: 0 14px 34px -18px rgba(255,79,40,0.28), inset 0 1px 0 rgba(255,255,255,0.7); min-height: 158px; justify-content: center; transition: background 0.3s, border-color 0.3s; }
        .kx-stage.kx-done { background: linear-gradient(180deg, #F1FAF4 0%, ${T.successSoft} 100%); border-color: ${T.success}55; }
        .kx-stage.kx-fail { background: linear-gradient(180deg, #FFF3EE 0%, ${T.accentSoft} 100%); border-color: ${T.accent}66; }
        /* fail — kulgili tutun to'lqinlari */
        .kx-smoke { position: absolute; top: clamp(6px,1.6vw,14px); left: 50%; transform: translateX(-50%); display: flex; gap: 8px; pointer-events: none; }
        .kx-smoke span { font-size: 20px; opacity: 0; animation: kx-smokerise 1.1s ease-out forwards; }
        .kx-smoke span:nth-child(2) { animation-delay: 0.16s; }
        .kx-smoke span:nth-child(3) { animation-delay: 0.32s; }
        @keyframes kx-smokerise { 0% { opacity: 0; transform: translateY(6px) scale(0.6); } 30% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-26px) scale(1.25) rotate(12deg); } }
        /* to'g'ri natija — peshtaxtaga bosqichma-bosqich qo'yilayotgan bo'laklar */
        .kx-fill { display: inline-flex; gap: 2px; font-size: clamp(24px,4.6vw,32px); line-height: 1; }
        .kx-drop { display: inline-block; animation: kx-dropin 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes kx-dropin { 0% { opacity: 0; transform: translateY(-16px) scale(0.5) rotate(-14deg); } 60% { opacity: 1; transform: translateY(2px) scale(1.15); } 100% { transform: translateY(0) scale(1) rotate(0); } }
        .kx-served { display: inline-block; animation: kx-serve 0.55s cubic-bezier(.28,1.5,.4,1) both; }
        @keyframes kx-serve { 0% { transform: scale(0.4) rotate(-10deg); opacity: 0; } 60% { transform: scale(1.18) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        .kx-splat { display: inline-block; animation: kx-splatpop 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes kx-splatpop { 0% { transform: scale(0) rotate(-30deg); } 55% { transform: scale(1.3) rotate(12deg); } 80% { transform: scale(0.92) rotate(-6deg); } 100% { transform: scale(1) rotate(0); } }
        /* sahna sirti — bajarilayotgan qadamlar shu oq sirtda o'qiladi */
        .kx-counter { display: flex; align-items: center; justify-content: center; min-height: 52px; width: 100%; max-width: 340px; padding: 12px 18px; border-radius: 16px; background: #fff; border: 1.5px solid rgba(255,79,40,0.14); box-shadow: inset 0 2px 6px rgba(58,53,48,0.06), 0 6px 16px -10px rgba(58,53,48,0.2); }
        .kx-plate { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; font-size: clamp(26px,5vw,36px); line-height: 1; }
        .kx-cap { font-family: 'Manrope'; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .kx-empty { color: ${T.ink3}; }
        .kx-empty .kx-cap { color: ${T.ink3}; }
        .kx-step { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.4vw,19px); color: ${T.ink}; }
        .kx-ok .kx-cap { color: ${T.success}; }
        .kx-bad .kx-cap { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .kx-actor, .kx-smoke span, .kx-drop, .kx-served, .kx-splat { animation: none !important; } .kx-smoke span { opacity: 0.85; } }
        .cc-console { display: flex; flex-direction: column; gap: 8px; }
        /* step-highlight — hozir bajarilayotgan blok yorishadi (executor puls) */
        .cc-active { position: relative; box-shadow: 0 0 0 2px ${T.accent}55; background: ${T.accentSoft}66; animation: cc-exec 0.5s ease-in-out infinite; }
        @keyframes cc-exec { 0%,100% { box-shadow: 0 0 0 2px ${T.accent}55, 0 0 0 0 rgba(255,79,40,0); } 50% { box-shadow: 0 0 0 2px ${T.accent}, 0 6px 18px -4px rgba(255,79,40,0.55); } }
        @media (prefers-reduced-motion: reduce) { .cc-active { animation: none !important; } }
        /* ▶ RUN — katta va jozibali (algoritmni ishga tushiruvchi asosiy amal) */
        .cc-run { background: linear-gradient(170deg,#FF8A3D,#FF4F28) !important; color: #fff !important; font-size: clamp(15px,1.9vw,18px) !important; font-weight: 800 !important; padding: clamp(13px,1.9vw,16px) clamp(26px,3.4vw,38px) !important; border-radius: 14px !important; box-shadow: 0 14px 30px -10px rgba(255,79,40,0.55), inset 0 2px 0 rgba(255,255,255,0.3) !important; letter-spacing: 0.02em; }
        .cc-run:not(:disabled):hover { background: linear-gradient(170deg,#FF9A4D,#FF5A2C) !important; box-shadow: 0 18px 38px -8px rgba(255,79,40,0.7), inset 0 2px 0 rgba(255,255,255,0.3) !important; }
        .cc-run:disabled { background: #E9E6DF !important; color: #98A0B4 !important; box-shadow: none !important; }
        /* .qcode — kod-so'z chip (fmtCode) */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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
        /* Kolleksiya kartochkalari (summary) */
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed rgba(167,166,162,0.5); opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* Yuqori paneldagi nishon hisoblagichi */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid rgba(167,166,162,0.5); border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid rgba(167,166,162,0.5); border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={tr2({ uz: "JS darsi", ru: "Урок JS" })} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  JsIntroLesson as default
};
