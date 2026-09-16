// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/3-Modull/ReactCrudPracticeLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/3-Modull/ReactCrudPracticeLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/3-Modull/ReactCrudPracticeLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useRef as useRef3, createContext as createContext2, useContext as useContext2, useCallback as useCallback2 } from "react";

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

// src/3-Modull/ReactCrudPracticeLesson.jsx
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
  dangerSoft: "#FAE3E0",
  line: "#E9E6DF",
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
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
var LESSON_META = { lessonId: "react-crud-practice-p1-v18", lessonTitle: { uz: "Praktika: CRUD — to'liq boshqariladigan ilova", ru: "Практика: CRUD — управляемое приложение" } };
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
  { id: "sp1", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s5b", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "sp2", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "sp3", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s8", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s9", type: "case", template: "custom", scored: false, scope: null },
  { id: "s10", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s13", type: "debug", template: "custom", scored: false, scope: null },
  { id: "s14", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s15", type: "summary", template: "custom", scored: false, scope: null }
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
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState3(false);
  const contentRef = useRef3(null);
  useEffect4(() => {
    setMCollapsed(false);
  }, [screen]);
  useEffect4(() => {
    if (!scrollSignal || !isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 240);
    return () => clearTimeout(t);
  }, [scrollSignal, isNarrow]);
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
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{tr2(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var RECAPS = {
  4: {
    title: { uz: "CRUD — ilovaning 4 amali", ru: "CRUD — 4 действия приложения" },
    cards: [
      { ic: "🔤", h: { uz: "CRUD — 4 harf, 4 amal", ru: "CRUD — 4 буквы, 4 действия" }, body: { uz: <>CRUD — yangi dastur yoki til emas. U — deyarli har ilova bajaradigan <b>4 ta amalning</b> qisqartmasi: <b>C</b>reate (qo'shish), <b>R</b>ead (ko'rsatish), <b>U</b>pdate (o'zgartirish), <b>D</b>elete (o'chirish).</>, ru: <>CRUD — не новая программа и не язык. Это сокращение <b>4 действий</b>, которые выполняет почти каждое приложение: <b>C</b>reate (добавить), <b>R</b>ead (показать), <b>U</b>pdate (изменить), <b>D</b>elete (удалить).</> }, vis: <RcFlow items={["Create", "Read", "Update", "Delete"]} sep="·" /> },
      { ic: "🐟", h: { uz: "Akvarium misolida", ru: "На примере аквариума" }, body: { uz: <>Akvariumga yangi baliq <b>qo'shasiz</b> (Create), baliqlarga <b>qaraysiz</b> (Read), birining rangini <b>o'zgartirasiz</b> (Update), keraksizini <b>olib tashlaysiz</b> (Delete). "Mening o'yinlarim" ro'yxati ham xuddi shunday ishlaydi.</>, ru: <>В аквариум вы <b>добавляете</b> новую рыбку (Create), <b>смотрите</b> на рыбок (Read), <b>меняете</b> цвет одной из них (Update), ненужную <b>убираете</b> (Delete). Список «Мои игры» работает точно так же.</> } },
      { ic: "📱", h: { uz: "Har joyda shu 4 amal", ru: "Эти 4 действия — везде" }, body: { uz: <>Instagram, do'kon, telefon kitobi — hammasi shu 4 amaldan tashkil topgan. Shuning uchun CRUD'ni bilsangiz, deyarli har ilovaning ichki mantig'ini tushunasiz.</>, ru: <>Instagram, магазин, телефонная книга — всё построено из этих 4 действий. Поэтому, зная CRUD, вы понимаете внутреннюю логику почти любого приложения.</> }, ask: { uz: "Telefoningizdagi qaysi ilovada shu 4 amalning hammasini ko'rasiz?", ru: "В каком приложении на вашем телефоне вы видите все 4 действия?" } }
    ]
  },
  7: {
    title: { uz: "Create — [...games, yangi] bilan qo'shish", ru: "Create — добавление через [...games, yangi]" },
    cards: [
      { ic: "➕", h: { uz: "Qo'shish = eski hammasi + yangisi", ru: "Добавить = всё старое + новое" }, body: { uz: <>Ro'yxatga o'yin qo'shish uchun eski ro'yxatni <b>almashtirmaymiz</b> — uni ko'chiramiz va oxiriga yangisini qo'yamiz: <span className="mono">[...games, yangi]</span>.</>, ru: <>Чтобы добавить игру в список, мы <b>не заменяем</b> старый список — мы копируем его и ставим новую в конец: <span className="mono">[...games, yangi]</span>.</> }, vis: <RcFlow items={["...games", "yangi", { uz: "= yangi ro'yxat", ru: "= новый список" }]} /> },
      { ic: "⋯", h: { uz: "Uch nuqta — spread", ru: "Три точки — spread" }, body: { uz: <>Uch nuqta (<b>spread</b>) "eski ro'yxatning <b>hammasini ko'chir</b>" degani. Keyin vergul qo'yib yangisini yozamiz. Natijada eski o'yinlar ham saqlanadi, yangisi ham qo'shiladi.</>, ru: <>Три точки (<b>spread</b>) значат «<b>скопируй всё</b> из старого списка». Потом ставим запятую и пишем новую. В итоге старые игры сохраняются, и новая добавляется.</> } },
      { ic: "⚠️", h: { uz: "games = yangi — xato", ru: "games = yangi — ошибка" }, body: { uz: <>Agar <span className="mono">games = yangi</span> desangiz, eski o'yinlar <b>yo'qoladi</b>. To'g'ri yo'l — <span className="mono">setGames([...games, yangi])</span>: eski hammasi + yangisi.</>, ru: <>Если написать <span className="mono">games = yangi</span>, старые игры <b>пропадут</b>. Правильный путь — <span className="mono">setGames([...games, yangi])</span>: всё старое + новая.</> }, ask: { uz: "Nega [...games, yangi] eski o'yinlarni saqlaydi, games = yangi esa saqlamaydi?", ru: "Почему [...games, yangi] сохраняет старые игры, а games = yangi — нет?" } }
    ]
  },
  12: {
    title: { uz: "Delete — filter bilan o'chirish", ru: "Delete — удаление через filter" },
    cards: [
      { ic: "🗑️", h: { uz: "O'chirish = boshqasini saqlab qolish", ru: "Удалить = сохранить всё остальное" }, body: { uz: <>Bitta o'yinni o'chirish uchun uni "o'chir" demaymiz — <b>undan boshqa hammasini saqlab</b> qolamiz: <span className="mono">games.filter(g =&gt; g.id !== id)</span>.</>, ru: <>Чтобы удалить одну игру, мы не говорим ей «удались» — мы <b>сохраняем все остальные</b>: <span className="mono">games.filter(g =&gt; g.id !== id)</span>.</> }, vis: <RcFlow items={["games", { uz: "filter(id !== o'chiriladigan)", ru: "filter(id !== удаляемый)" }, { uz: "qolgani", ru: "остальное" }]} /> },
      { ic: "🔍", h: { uz: "filter — shartga mos kelganini olib qol", ru: "filter — оставь подходящее под условие" }, body: { uz: <><b>filter</b> ro'yxatdan shartga <b>mos kelganlarini</b> saqlaydi. <span className="mono">g.id !== id</span> = "o'chirilayotganidan boshqa hammasi rost" — natijada o'sha bitta o'yin tushib qoladi.</>, ru: <><b>filter</b> сохраняет из списка элементы, <b>подходящие под условие</b>. <span className="mono">g.id !== id</span> = «все, кроме удаляемой, — истина» — в итоге именно та игра выпадает.</> } },
      { ic: "🚫", h: { uz: "map ham, [...games] ham emas", ru: "не map и не [...games]" }, body: { uz: <>map — o'zgartirish (Update), <span className="mono">[...games, yangi]</span> — qo'shish (Create). O'chirish faqat <b>filter</b> bilan bo'ladi.</>, ru: <>map — изменение (Update), <span className="mono">[...games, yangi]</span> — добавление (Create). Удаление делается только через <b>filter</b>.</> }, ask: { uz: "Nega o'chirishni 'boshqasini saqlash' deb tushunish osonroq?", ru: "Почему удаление проще понимать как «сохранить остальные»?" } }
    ]
  },
  16: {
    title: { uz: "Update — map bilan o'zgartirish", ru: "Update — изменение через map" },
    cards: [
      { ic: "✏️", h: { uz: "Update = mavjudini o'zgartirish", ru: "Update = изменить существующее" }, body: { uz: <>Like sonini oshirsangiz, o'yin o'sha o'yinligicha <b>qoladi</b> — faqat bir xossasi o'zgaradi. Bu — <b>Update</b>. Buning uchun <span className="mono">games.map</span> ishlatamiz.</>, ru: <>Когда вы увеличиваете число лайков, игра <b>остаётся</b> той же игрой — меняется лишь одно её свойство. Это — <b>Update</b>. Для этого используем <span className="mono">games.map</span>.</> }, vis: <RcFlow items={["games.map", { uz: "kerakli o'yinni topib", ru: "находим нужную игру" }, { uz: "yangilaymiz", ru: "обновляем" }]} /> },
      { ic: "🎯", h: { uz: "map — faqat kerakligini yangilaydi", ru: "map обновляет только нужную" }, body: { uz: <><span className="mono">games.map(g =&gt; g.id === id ? {"{"} ...g, likes: g.likes + 1 {"}"} : g)</span> — mos o'yinni <b>yangilaydi</b>, qolganini o'z holicha qaytaradi.</>, ru: <><span className="mono">games.map(g =&gt; g.id === id ? {"{"} ...g, likes: g.likes + 1 {"}"} : g)</span> — <b>обновляет</b> подходящую игру, остальные возвращает как есть.</> } },
      { ic: "🔁", h: { uz: "Qo'shish emas, o'chirish emas", ru: "Не добавление и не удаление" }, body: { uz: <>Yangi o'yin qo'shilmayapti (Create emas), o'yin o'chmayapti (Delete emas). Mavjud narsa <b>o'zgaryapti</b> — bu Update.</>, ru: <>Новая игра не добавляется (не Create), игра не удаляется (не Delete). Существующее <b>меняется</b> — это Update.</> }, ask: { uz: "Like bosish nega Create yoki Delete emas, balki Update?", ru: "Почему лайк — это не Create и не Delete, а Update?" } }
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
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "🗣️ Sinfga savol:", ru: "🗣️ Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Назад" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Дальше →" })}</button>}
      </div>
    </div>;
}
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
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
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : tr2({ uz: <>Javob berdi: <b>{answered}</b> / {total}</>, ru: <>Ответили: <b>{answered}</b> / {total}</> })}</span>
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и число ✅/❌ скрыто — при нажатии «Открыть результат» оно откроется сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${!isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? tr2({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered >= RECAP_MIN_ANSWERS && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — эта тема осталась классу непонятной. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Повторное объяснение — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить её ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
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
            {isMentorLive ? <>{tr2({ uz: "✓ To'g'ri javob:", ru: "✓ Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Скоро узнаете правильный ответ." }) : wrongLocked ? fmtCode(explainWrong[picked] ?? explainWrong.default) : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue">{tr2({ uz: " · ko'rsatmani ochish ▾", ru: " · открыть подсказку ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
var At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: "italic" }}>{children}</span>;
var Win = ({ title, children, minH }) => <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: "relative" }}>{children}</div></div>;
var TLine = ({ cmd, out, dim }) => <div className="el-in" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(11.5px,1.4vw,13px)", lineHeight: 1.7, color: dim ? CODE.comment : CODE.text }}>
    {cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : out}
  </div>;
var GAMES = [
  { id: 1, name: "Adopt Me!", emoji: "🐾", likes: 92, bg: "linear-gradient(135deg,#F3C2D2,#DFA6BA)" },
  { id: 2, name: "Blox Fruits", emoji: "🍇", likes: 95, bg: "linear-gradient(135deg,#BAC4EC,#98A6DC)" },
  { id: 3, name: "Brookhaven", emoji: "🏠", likes: 89, bg: "linear-gradient(135deg,#B6DDC4,#92C8A7)" },
  { id: 4, name: "Doors", emoji: "🚪", likes: 91, bg: "linear-gradient(135deg,#C6BFB8,#A79E95)" }
];
var POOL = [
  { id: 5, name: "Piggy", emoji: "🐷", likes: 87, bg: "linear-gradient(135deg,#DCC0D2,#C29FB6)" },
  { id: 6, name: "Tower of Hell", emoji: "🗼", likes: 84, bg: "linear-gradient(135deg,#A6D4CF,#82BDB6)" },
  { id: 7, name: "Bee Swarm", emoji: "🐝", likes: 93, bg: "linear-gradient(135deg,#CFD8B2,#B0BC90)" },
  { id: 8, name: "Pet Sim 99", emoji: "🐶", likes: 90, bg: "linear-gradient(135deg,#D2C0EE,#B6A0E2)" }
];
var MyCard = ({ game, onLike, onTop, onDelete, dim, flash }) => <div className="rocard el-in" style={{ position: "relative", opacity: dim ? 0.4 : 1, boxShadow: flash ? `0 0 0 2px ${T.success}, 0 6px 16px -5px rgba(0,0,0,0.2)` : void 0, transition: "all 0.3s" }}>
    <div className="rothumb" style={{ background: game.bg }}>
      <span style={{ fontSize: 24 }}>{game.emoji}</span>
      {game.top && <span className="topbadge el-in">🔥 TOP</span>}
      {onDelete && <button className="cardx" onClick={onDelete} title={tr2({ uz: "O'chirish", ru: "Удалить" })}>✕</button>}
    </div>
    <div className="robody">
      <p className="roname">{game.name}</p>
      <div className="rostats"><span key={game.likes} className="hpop">❤️ {game.likes}</span></div>
      {(onLike || onTop) && <div className="cardacts">
          {onLike && <button className="cardbtn" onClick={onLike}>❤️ like</button>}
          {onTop && <button className="cardbtn" onClick={onTop} style={game.top ? { background: T.accentSoft, color: T.accent } : void 0}>🔥 TOP</button>}
        </div>}
    </div>
  </div>;
var AddBtn = ({ onClick, disabled, mock, small, shake }) => {
  const cls = `chip chip-on${shake ? " shake" : ""}`;
  const st = small ? { padding: "6px 12px", fontSize: 12 } : { padding: "7px 13px", fontSize: 13 };
  const txt = tr2({ uz: "+ O'yin qo'shish", ru: "+ Добавить игру" });
  return mock ? <span className={cls} aria-hidden="true" style={{ ...st, cursor: "default" }}>{txt}</span> : <button className={cls} onClick={onClick} disabled={disabled} style={st}>{txt}</button>;
};
var CardGrid = ({ children, cols = 3 }) => <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 8 }}>{children}</div>;
var OPS = [
  { key: "C", amal: { uz: "Qo'shish", ru: "Добавить" }, en: "Create", effId: "add", eff: { uz: "+1 element qo'shiladi", ru: "+1 элемент добавляется" }, code: "setGames([...games, yangi])" },
  { key: "R", amal: { uz: "Ko'rsatish", ru: "Показать" }, en: "Read", effId: "map", eff: { uz: "map bilan chiziladi", ru: "рисуется через map" }, code: "games.map(g => <Card />)" },
  { key: "U", amal: { uz: "O'zgartirish", ru: "Изменить" }, en: "Update", effId: "change", eff: { uz: "1 element o'zgaradi", ru: "1 элемент меняется" }, code: "games.map(... ? {...g} : g)" },
  { key: "D", amal: { uz: "O'chirish", ru: "Удалить" }, en: "Delete", effId: "remove", eff: { uz: "1 element olib tashlanadi", ru: "1 элемент убирается" }, code: "games.filter(g => g.id !== id)" }
];
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState3(!!storedAnswer);
  const [shakeId, setShakeId] = useState3(null);
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const poke = (id) => {
    setTried(true);
    clearTimeout(timer.current);
    setShakeId(id);
    timer.current = setTimeout(() => setShakeId(null), 450);
  };
  const OPTS = [
    { id: "a", label: { uz: "Hech narsa — ko'rsatgani yetadi", ru: "Ничего — достаточно, что показывает" } },
    { id: "b", label: { uz: "Qo'shish, o'zgartirish va o'chirish ham kerak", ru: "Нужно ещё добавлять, изменять и удалять" } },
    { id: "c", label: { uz: "Ko'proq rang va animatsiya", ru: "Больше цветов и анимации" } }
  ];
  const pick = (v) => {
    if (picked !== null || !tried) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} scrollSignal={picked !== null} navContent={<NavNext disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>Kartochkalar ko'rinadi — lekin nega ularni <span className="italic" style={{ color: T.accent }}>o'zgartirib bo'lmaydi</span>?</>, ru: <>Карточки видны — но почему их <span className="italic" style={{ color: T.accent }}>нельзя изменить</span>?</> })}</h1>
        <Mentor>{tr2({ uz: <>Mana "Mening o'yinlarim" ro'yxati. Yangi o'yin <b style={{ color: T.ink }}>qo'shmoqchi</b> bo'ling yoki bittasini <b style={{ color: T.ink }}>o'chirmoqchi</b> bo'ling — tugmalarni bosib ko'ring. Nima sezdingiz?</>, ru: <>Вот список «Мои игры». Попробуйте <b style={{ color: T.ink }}>добавить</b> новую игру или <b style={{ color: T.ink }}>удалить</b> одну — понажимайте кнопки. Что заметили?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
              <AddBtn shake={shakeId === "add"} onClick={() => poke("add")} />
            </div>
            <div className="fade-up delay-2"><CardGrid cols={3}>
              {GAMES.slice(0, 3).map((g) => <div key={g.id} className={shakeId === g.id ? "shake" : ""}>
                  <MyCard game={g} onDelete={() => poke(g.id)} />
                </div>)}
            </CardGrid></div>
            {tried && <p className="small fade-step" style={{ color: T.accent, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Tugmalar bor — lekin hech narsa bo'lmadi. Orqasida kod yo'q!", ru: "Кнопки есть — но ничего не произошло. За ними нет кода!" })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Haqiqiy ilovaga, ko'rsatishdan tashqari, yana nima kerak?", ru: "Что ещё нужно настоящему приложению, кроме показа?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr2(o.label)}</span>
                  </button>;
  })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval tugmalarni bosib ko'ring ←", ru: "Сначала понажимайте кнопки ←" })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: <>Aynan! Hozircha ilova faqat <b>ko'rsata</b> oladi (Read). Yana uchtasi kerak: <b>qo'shish, o'zgartirish, o'chirish</b> — bugun shularni o'rganamiz.</>, ru: <>Именно! Пока приложение умеет только <b>показывать</b> (Read). Нужны ещё три: <b>добавить, изменить, удалить</b> — сегодня их и изучим.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: tr2({ uz: "CRUD — ilovaning 4 amali", ru: "CRUD — 4 действия приложения" }), tag: "Create · Read · Update · Delete" },
    { text: tr2({ uz: "Create — qo'shish", ru: "Create — добавление" }), tag: "[...games, yangi]" },
    { text: tr2({ uz: "Update — o'zgartirish", ru: "Update — изменение" }), tag: "games.map(...)" },
    { text: tr2({ uz: "Delete — o'chirish", ru: "Delete — удаление" }), tag: "games.filter(...)" },
    { text: tr2({ uz: "AI bilan loyihani bitirish", ru: "Завершение проекта с AI" }), tag: "vibecoding" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Dars oxirida — sizning to'liq ilovangiz", ru: "В конце урока — ваше полное приложение" })}</p>
      <Win title={tr2({ uz: "Mening o'yinlarim — localhost:5173", ru: "Мои игры — localhost:5173" })} minH={120}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 12.5, color: T.ink }}>{tr2({ uz: "3 ta o'yin", ru: "3 игры" })}</span>
          <AddBtn mock small />
        </div>
        <CardGrid cols={3}><MyCard game={{ ...GAMES[0], top: true }} /><MyCard game={GAMES[1]} /><MyCard game={GAMES[3]} /></CardGrid>
      </Win>
      <pre className="code-box" style={{ padding: "10px 14px" }}>{"setGames("}<span style={{ background: "rgba(255,79,40,0.18)", borderRadius: 5, padding: "1px 5px" }}>{"[...games, yangi]"}</span>{")"}</pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr2({ uz: "→ qo'shish · o'zgartirish · o'chirish — hammasi sizda", ru: "→ добавить · изменить · удалить — всё в ваших руках" })}</p>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 5 qadam", ru: "5 шагов на сегодня" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr2({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>bitta to'liq ilovani</span> AI bilan bitirasiz.</>, ru: <>Сегодня вы завершите <span className="italic" style={{ color: T.accent }}>одно полное приложение</span> вместе с AI.</> })}</h2>
        </div>
        <Mentor>{tr2({ uz: <>Ishonasizmi — dars oxirida o'yinlarni <b style={{ color: T.ink }}>qo'sha, o'zgartira va o'chira</b> oladigan ilovangiz bo'ladi. Avval har amalni o'zingiz tushunasiz, keyin AI bilan birga loyihani <b style={{ color: T.ink }}>to'liq bitirasiz</b>.</>, ru: <>Представляете — к концу урока у вас будет приложение, где игры можно <b style={{ color: T.ink }}>добавлять, изменять и удалять</b>. Сначала вы сами разберёте каждое действие, потом вместе с AI <b style={{ color: T.ink }}>полностью завершите</b> проект.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "Bugungi 5 qadamni ko'rish", ru: "Показать 5 шагов на сегодня" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ Natijani ko'rish", ru: "↩ Показать результат" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const BASE = GAMES.slice(0, 3);
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(storedAnswer ? new Set(OPS.map((o) => o.key)) : /* @__PURE__ */ new Set());
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
  const list = (() => {
    if (active === "C") return [...BASE, POOL[0]];
    if (active === "D") return BASE.slice(0, 2);
    if (active === "U") return BASE.map((g, i) => i === 0 ? { ...g, top: true } : g);
    return BASE;
  })();
  return <Stage eyebrow={tr2({ uz: "CRUD · 4 amal", ru: "CRUD · 4 действия" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `${seen.size}/4 amalni sinang`, ru: `Попробуйте ${seen.size}/4 действия` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har ilova <span className="italic" style={{ color: T.accent }}>4 ta amal</span> ustida turadi.</>, ru: <>Каждое приложение стоит на <span className="italic" style={{ color: T.accent }}>4 действиях</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Instagram, Roblox, do'kon — hammasi shu 4 amalni bajaradi: <b style={{ color: T.ink }}>qo'shish, ko'rsatish, o'zgartirish, o'chirish</b>. Ularning nomi — <b style={{ color: T.ink }}>CRUD</b>. To'rttasini bosib, ro'yxatga nima bo'lishini kuzating.</>, ru: <>Instagram, Roblox, магазин — все выполняют эти 4 действия: <b style={{ color: T.ink }}>добавить, показать, изменить, удалить</b>. Их общее имя — <b style={{ color: T.ink }}>CRUD</b>. Нажмите все четыре и наблюдайте, что происходит со списком.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {OPS.map((o) => {
    const on = active === o.key;
    return <button key={o.key} className="vcard" onClick={() => tap(o.key)} style={{ boxShadow: on ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                    <span className="vbadge" style={{ background: o.key === "D" ? T.danger : o.key === "C" ? T.success : o.key === "U" ? "#B45309" : T.blue }}>{o.en}</span>
                    <span className="vlbl">{tr2(o.amal)}</span>
                    <span className="vseen" style={{ color: seen.has(o.key) ? T.success : T.ink3 }}>{seen.has(o.key) ? "✓" : ""}</span>
                  </button>;
  })}
            </div>
            {active && <div className="sk-info" key={active}><p className="body zb-notch" style={{ margin: 0, color: T.ink }}><b style={{ color: T.accent }}>{tr2(OPS.find((o) => o.key === active).amal)}</b> — {tr2(OPS.find((o) => o.key === active).eff)}.</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Tirik akvarium — suv = ma'lumot (state), oyna = ekran", ru: "Живой аквариум — вода = данные (state), стекло = экран" })}</p>
            <Aquarium
    fish={list}
    minH={130}
    addId={active === "C" ? POOL[0].id : null}
    feedId={active === "U" ? list[0]?.id : null}
    netName={active === "D" ? BASE[BASE.length - 1]?.name : null}
  />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Mana ular — <b>CRUD</b>: <b>C</b>reate (qo'shish) · <b>R</b>ead (ko'rsatish) · <b>U</b>pdate (o'zgartirish) · <b>D</b>elete (o'chirish). Baliqlar suvda yashaganidek, o'yinlar ham xotirada turadi — buni <b>state</b> deymiz, kod tilida u <span className="mono">games</span> ro'yxati. Bugun hammasini shu state bilan quramiz.</>, ru: <>Вот они — <b>CRUD</b>: <b>C</b>reate (добавить) · <b>R</b>ead (показать) · <b>U</b>pdate (изменить) · <b>D</b>elete (удалить). Как рыбки живут в воде, так и игры живут в памяти — это называется <b>state</b>, на языке кода это список <span className="mono">games</span>. Сегодня всё построим на этом state.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const EFFECTS = [
    { id: "add", label: tr2({ uz: "+1 element qo'shiladi", ru: "+1 элемент добавляется" }) },
    { id: "map", label: tr2({ uz: "map bilan chiziladi", ru: "рисуется через map" }) },
    { id: "change", label: tr2({ uz: "1 element o'zgaradi", ru: "1 элемент меняется" }) },
    { id: "remove", label: tr2({ uz: "1 element olib tashlanadi", ru: "1 элемент убирается" }) }
  ];
  const [taskIdx, setTaskIdx] = useState3(storedAnswer ? OPS.length : 0);
  const [shakeId, setShakeId] = useState3(null);
  const timer = useRef3(null);
  const done = taskIdx >= OPS.length;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const cur = OPS[Math.min(taskIdx, OPS.length - 1)];
  const tap = (effId) => {
    if (done) return;
    if (effId === cur.effId) {
      setTaskIdx((t) => t + 1);
    } else {
      clearTimeout(timer.current);
      setShakeId(effId);
      timer.current = setTimeout(() => setShakeId(null), 450);
    }
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "1-qadam · loyihalash", ru: "Шаг 1 · проектирование" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `Rejani tuzing (${Math.min(taskIdx, OPS.length)}/4)`, ru: `Составьте план (${Math.min(taskIdx, OPS.length)}/4)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har amal <span className="italic" style={{ color: T.accent }}>o'yinlarni</span> qanday o'zgartiradi?</>, ru: <>Как каждое действие меняет <span className="italic" style={{ color: T.accent }}>игры</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI kod yozishidan oldin <b style={{ color: T.ink }}>siz</b> rejani tuzasiz: ro'yxat (massiv) <span className="mono">games</span> — har amal unga nima qiladi? Har bir amal uchun to'g'ri natijani tanlang.</>, ru: <>Прежде чем AI напишет код, план составляете <b style={{ color: T.ink }}>вы</b>: список (массив) <span className="mono">games</span> — что каждое действие с ним делает? Выберите правильный результат для каждого действия.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "CRUD amallari", ru: "Действия CRUD" })}</p>
            <div className="opcol fade-up delay-1">
              {OPS.map((o, i) => {
    const matched = i < taskIdx;
    const activeRow = !done && i === taskIdx;
    const badge = o.key === "D" ? T.danger : o.key === "C" ? T.success : o.key === "U" ? "#B45309" : T.blue;
    return <div key={o.key} className={`opcard ${activeRow ? "active" : ""} ${matched ? "matched" : ""}`}>
                    <div className="opcard-top">
                      <span className="opcard-badge" style={{ background: badge }}>{o.en}</span>
                      <span className="opcard-amal">{tr2(o.amal)}</span>
                      {matched && <span className="opcard-tick">✓</span>}
                      {activeRow && <span className="opcard-now">{tr2({ uz: "hozir", ru: "сейчас" })}</span>}
                    </div>
                    <div className="opcard-eff">
                      {matched ? <span className="opcard-effdone el-in">{EFFECTS.find((e) => e.id === o.effId).label}</span> : activeRow ? <span className="opcard-q">{tr2({ uz: "natijasini o'ngdan tanlang ↓", ru: "выберите результат справа ↓" })}</span> : <span className="opcard-wait">{tr2({ uz: "kutilmoqda…", ru: "ожидает…" })}</span>}
                    </div>
                  </div>;
  })}
            </div>
          </Col>
          <Col>
            {!done ? <>
                <div className="sk-info" key={taskIdx}><p className="body zb-notch" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><b style={{ color: T.accent }}>{tr2(cur.amal)}</b> ({cur.en}) bosilganda <span className="mono">games</span> ro'yxatiga nima bo'ladi?</>, ru: <>Что произойдёт со списком <span className="mono">games</span> при нажатии <b style={{ color: T.accent }}>{tr2(cur.amal)}</b> ({cur.en})?</> })}</p></div>
                <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Natijani tanlang", ru: "Выберите результат" })}</p>
                <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {EFFECTS.map((e) => {
    const used = OPS.slice(0, taskIdx).some((o) => o.effId === e.id);
    return <button key={e.id} className={`effbtn ${shakeId === e.id ? "shake" : ""} ${used ? "used" : ""}`} disabled={used} onClick={() => tap(e.id)}>{used && <span className="effbtn-tick">✓</span>}{e.label}</button>;
  })}
                </div>
              </> : <>
                <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Tayyor reja — kod tilida", ru: "Готовый план — на языке кода" })}</p>
                <pre className="code-box fade-step" style={{ lineHeight: 1.95 }}>
                  {OPS.map((o) => <React3.Fragment key={o.key}><Cm>{`// ${tr2(o.amal)}`}</Cm>{`
${o.code}

`}</React3.Fragment>)}
                </pre>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Reja tayyor! Har amal — <span className="mono">games</span> ustida bitta amal. Endi uchtasini (qo'shish, o'zgartirish, o'chirish) birma-bir quramiz.</>, ru: <>План готов! Каждое действие — одна операция над <span className="mono">games</span>. Теперь построим три из них (добавить, изменить, удалить) по очереди.</> })}</p></div>
              </>}
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
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Упражнение · вопрос 1" })}
  questionText="CRUD nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <><span className="mono" style={{ color: T.accent }}>CRUD</span> — bu <span className="italic" style={{ color: T.accent }}>nima</span>?</>, ru: <><span className="mono" style={{ color: T.accent }}>CRUD</span> — это <span className="italic" style={{ color: T.accent }}>что</span>?</> })}</h2></>}
  options={[tr2({ uz: "Internet tezligini oshiruvchi dastur", ru: "Программа для ускорения интернета" }), tr2({ uz: "Ilovaning 4 amali (qo'shish, o'chirish...)", ru: "4 действия приложения (добавить, удалить...)" }), tr2({ uz: "CSS'dagi maxsus rang nomi", ru: "Название специального цвета в CSS" }), tr2({ uz: "Yangi dasturlash tilining nomi", ru: "Название нового языка программирования" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! CRUD = Create (qo'shish) · Read (ko'rsatish) · Update (o'zgartirish) · Delete (o'chirish). Deyarli har ilova shu 4 amalni bajaradi.", ru: "Верно! CRUD = Create (добавить) · Read (показать) · Update (изменить) · Delete (удалить). Почти каждое приложение выполняет эти 4 действия." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — tezlikka aloqasi yo'q. CRUD — ma'lumot ustidagi 4 amal.", ru: "Нет — к скорости это не относится. CRUD — 4 действия над данными." }),
    2: tr2({ uz: "Yo'q — rang emas. CRUD = qo'shish, ko'rsatish, o'zgartirish, o'chirish.", ru: "Нет — это не цвет. CRUD = добавить, показать, изменить, удалить." }),
    3: tr2({ uz: "Yo'q — CRUD til emas. Bu 4 ta amalning qisqartmasi: Create, Read, Update, Delete.", ru: "Нет — CRUD не язык. Это сокращение 4 действий: Create, Read, Update, Delete." }),
    default: tr2({ uz: "CRUD = Create · Read · Update · Delete — ilovaning 4 asosiy amali.", ru: "CRUD = Create · Read · Update · Delete — 4 основных действия приложения." })
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const START = GAMES.slice(0, 2);
  const [list, setList] = useState3(storedAnswer ? [...START, POOL[0], POOL[1]] : START);
  const added = list.length - START.length;
  const done = added >= 2;
  const remaining = POOL.filter((p) => !list.some((g) => g.id === p.id));
  const add = (g) => setList((prev) => prev.some((x) => x.id === g.id) ? prev : [...prev, g]);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Create · qo'shish", ru: "Create · добавление" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `Kamida 2 ta qo'shing (${added}/2)`, ru: `Добавьте минимум 2 (${added}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Yangi o'yin ro'yxatga <span className="italic" style={{ color: T.accent }}>qanday</span> qo'shiladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> новая игра добавляется в список?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Akvariumdagi o'sha 4 amal — endi <b style={{ color: T.ink }}>«Mening o'yinlarim»</b> ro'yxatida. Qo'shishning kaliti uch nuqtada: <span className="mono">[...games, yangi]</span>. Uch nuqta (<b style={{ color: T.ink }}>spread</b>) "eski ro'yxatning <b style={{ color: T.ink }}>hammasini ko'chir</b>" degani, keyin oxiriga <b style={{ color: T.ink }}>yangisini</b> qo'shamiz. O'yin tanlab, qo'shib ko'ring.</>, ru: <>Те же 4 действия из аквариума — теперь в списке <b style={{ color: T.ink }}>«Мои игры»</b>. Ключ к добавлению — в трёх точках: <span className="mono">[...games, yangi]</span>. Три точки (<b style={{ color: T.ink }}>spread</b>) значат «<b style={{ color: T.ink }}>скопируй всё</b> из старого списка», потом в конец добавляем <b style={{ color: T.ink }}>новую</b>. Выберите игру и попробуйте добавить.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Qo'shish uchun tanlang", ru: "Выберите, что добавить" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {remaining.length ? remaining.map((g) => <button key={g.id} className="gchip" onClick={() => add(g)}>+ {g.emoji} {g.name}</button>) : <span className="small" style={{ color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "Hammasi qo'shildi ✓", ru: "Всё добавлено ✓" })}</span>}
            </div>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.95 }}>
              <Jx>{"const"}</Jx>{" yangi = { name: "}<St>"…"</St>{" };"}{"\n\n"}
              {"setGames("}<span style={{ background: "rgba(255,79,40,0.18)", borderRadius: 5, padding: "1px 5px", boxShadow: `inset 0 0 0 1px ${T.accent}` }}>{"["}<At>...games</At>{", yangi]"}</span>{");"}{"\n"}
              <Cm>{tr2({ uz: "//      ↑ eski hammasi   ↑ yangisi", ru: "//      ↑ всё старое   ↑ новая" })}</Cm>
            </pre>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingRight: 40 }}>
              <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
              <span className="mono small" style={{ color: T.ink3 }}>{tr2({ uz: `${list.length} ta`, ru: `${list.length} шт.` })}</span>
            </div>
            <Win title="localhost:5173" minH={110}>
              <CardGrid cols={3}>{list.map((g) => <MyCard key={g.id} game={g} flash={added > 0 && g.id === list[list.length - 1].id} />)}</CardGrid>
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Ro'yxat o'sdi! <span className="mono">[...games, yangi]</span> har safar yangi ro'yxat yasaydi: eskisi + yangisi. React buni ko'radi va kartochkani chizadi.</>, ru: <>Список вырос! <span className="mono">[...games, yangi]</span> каждый раз создаёт новый список: старое + новая. React это видит и рисует карточку.</> })}</p></div>}
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
  questionText="Ro'yxatga yangi o'yin qo'shish uchun to'g'ri kod qaysi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "Mustahkamlash", ru: "Закрепление" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Ro'yxatga <span className="italic" style={{ color: T.accent }}>yangi o'yin qo'shish</span> uchun qaysi kod?</>, ru: <>Какой код <span className="italic" style={{ color: T.accent }}>добавит новую игру</span> в список?</> })}</h2></>}
  options={[tr2({ uz: "games = yangi — ro'yxatni almashtiradi", ru: "games = yangi — заменяет список" }), tr2({ uz: "games.length + 1 — sonini oshiradi", ru: "games.length + 1 — увеличивает число" }), tr2({ uz: "setGames(yangi) — faqat bittasi qoladi", ru: "setGames(yangi) — останется только одна" }), tr2({ uz: "setGames([...games, yangi]) — eski + yangisi", ru: "setGames([...games, yangi]) — старое + новая" })]}
  correctIdx={3}
  explainCorrect={tr2({ uz: "To'g'ri! [...games, yangi] eski ro'yxatning hammasini ko'chiradi va oxiriga yangisini qo'shadi. setGames buni ekranga chiqaradi.", ru: "Верно! [...games, yangi] копирует весь старый список и добавляет новую в конец. setGames выводит это на экран." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — bunda eski o'yinlar yo'qoladi. [...games, yangi] eskisini ham saqlaydi.", ru: "Нет — так старые игры пропадут. [...games, yangi] сохраняет и старое." }),
    1: tr2({ uz: "Yo'q — bu shunchaki son. Ro'yxatga qo'shish: [...games, yangi].", ru: "Нет — это просто число. Добавление в список: [...games, yangi]." }),
    2: tr2({ uz: "Yo'q — setGames(yangi) bo'lsa ro'yxatda faqat bitta o'yin qoladi. Eskisini saqlash uchun [...games, yangi].", ru: "Нет — с setGames(yangi) в списке останется только одна игра. Чтобы сохранить старое: [...games, yangi]." }),
    default: tr2({ uz: "Qo'shish = setGames([...games, yangi]): eski hammasi + yangisi.", ru: "Добавление = setGames([...games, yangi]): всё старое + новая." })
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [list, setList] = useState3(storedAnswer ? GAMES.slice(0, 3).map((g, i) => i < 2 ? { ...g, top: true } : g) : GAMES.slice(0, 3));
  const [lastId, setLastId] = useState3(null);
  const changed = list.filter((g) => g.top).length;
  const done = changed >= 2;
  const toggleTop = (id) => {
    setLastId(id);
    setList((prev) => prev.map((g) => g.id === id ? { ...g, top: !g.top } : g));
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Update · o'zgartirish", ru: "Update · изменение" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `2 ta o'yinni TOP qiling (${changed}/2)`, ru: `Сделайте TOP 2 играм (${changed}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta o'yin o'zgaradi — <span className="italic" style={{ color: T.accent }}>qolganlari joyida qoladimi</span>?</>, ru: <>Одна игра меняется — <span className="italic" style={{ color: T.accent }}>останутся ли остальные на месте</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bu yerda <span className="mono">map</span> yana yordam beradi! U <b style={{ color: T.ink }}>har bir o'yindan o'tadi</b>: kerakligini topsa — o'zgartiradi, qolganini <b style={{ color: T.ink }}>o'sha holicha</b> qoldiradi. <span className="mono">{"{...g, top: !g.top}"}</span> — "o'yinni ko'chir, faqat top'ini o'zgartir". Kartochkalardagi 🔥 TOP ni bosing.</>, ru: <>Здесь снова помогает <span className="mono">map</span>! Он <b style={{ color: T.ink }}>проходит по каждой игре</b>: найдя нужную — меняет её, остальные оставляет <b style={{ color: T.ink }}>как есть</b>. <span className="mono">{"{...g, top: !g.top}"}</span> — «скопируй игру, поменяй только top». Нажмите 🔥 TOP на карточках.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.95 }}>
              {"setGames(games.map(g =>"}{"\n"}
              {"  g.id === id"}{"\n"}
              {"    ? "}<span style={{ background: "rgba(255,79,40,0.16)", borderRadius: 5, padding: "1px 5px" }}>{"{ "}<At>...g</At>{", top: !g.top }"}</span>{"  "}<Cm>{tr2({ uz: "// o'zgartir", ru: "// изменить" })}</Cm>{"\n"}
              {"    : g"}{"             "}<Cm>{tr2({ uz: "// o'sha holicha", ru: "// как есть" })}</Cm>{"\n"}
              {"));"}
            </pre>
            <div className="code-box" style={{ padding: "9px 13px", minHeight: 38 }}>
              {lastId ? <TLine out={<span className="el-in" style={{ display: "inline-block", color: CODE.str }}>{tr2({ uz: <>✓ "{list.find((g) => g.id === lastId)?.name}" yangilandi — qolganlari o'zgarmadi</>, ru: <>✓ «{list.find((g) => g.id === lastId)?.name}» обновлена — остальные не изменились</> })}</span>} /> : <TLine out={<span style={{ color: CODE.comment, fontStyle: "italic" }}>{tr2({ uz: "kartochkadan 🔥 TOP ni bosing…", ru: "нажмите 🔥 TOP на карточке…" })}</span>} />}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
            <Win title="localhost:5173" minH={120}>
              <CardGrid cols={3}>{list.map((g) => <MyCard key={g.id} game={g} onTop={() => toggleTop(g.id)} flash={g.id === lastId} />)}</CardGrid>
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Sezdingizmi — faqat <b>siz bosgan</b> o'yin o'zgardi, qolganlari joyida. <span className="mono">map</span> shuning uchun ishonchli: u har birini ko'rib chiqadi, lekin faqat keraklisini almashtiradi.</>, ru: <>Заметили — изменилась только игра, <b>которую вы нажали</b>, остальные на месте. Поэтому <span className="mono">map</span> надёжен: он просматривает каждую, но заменяет только нужную.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const START = GAMES.slice(0, 4);
  const [list, setList] = useState3(storedAnswer ? START.slice(0, 2) : START);
  const [lastName, setLastName] = useState3(null);
  const removed = START.length - list.length;
  const done = removed >= 1;
  const del = (g) => {
    setLastName(g.name);
    setList((prev) => prev.filter((x) => x.id !== g.id));
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Delete · o'chirish", ru: "Delete · удаление" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Bitta o'yinni o'chiring", ru: "Удалите одну игру" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Keraksiz o'yinni ro'yxatdan <span className="italic" style={{ color: T.accent }}>qanday</span> olib tashlaymiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> убрать ненужную игру из списка?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bunga <span className="mono">filter</span> bor — "elak" kabi. U <b style={{ color: T.ink }}>shartga mos kelganlarni</b> o'tkazadi, qolganini tashlab yuboradi. <span className="mono">{"g.id !== id"}</span> = "o'chirilayotganidan <b style={{ color: T.ink }}>boshqa</b> hammasini saqla". Kartochkadagi ✕ ni bosing.</>, ru: <>Для этого есть <span className="mono">filter</span> — как «сито». Он <b style={{ color: T.ink }}>пропускает подходящие под условие</b>, остальное отбрасывает. <span className="mono">{"g.id !== id"}</span> = «сохрани все, <b style={{ color: T.ink }}>кроме</b> удаляемой». Нажмите ✕ на карточке.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.95 }}>
              {"setGames(games."}<span style={{ background: "rgba(255,79,40,0.16)", borderRadius: 5, padding: "1px 5px" }}><At>filter</At>{"(g => g.id !== id)"}</span>{");"}{"\n"}
              <Cm>{tr2({ uz: `// "shu id'dan boshqa hammasini saqla"`, ru: "// «сохрани все, кроме этого id»" })}</Cm>
            </pre>
            <div className="code-box" style={{ padding: "9px 13px", minHeight: 38 }}>
              {lastName ? <TLine out={<span className="el-in" style={{ display: "inline-block", color: CODE.str }}>{tr2({ uz: <>✓ "{lastName}" o'chirildi — ro'yxatda {list.length} ta qoldi</>, ru: <>✓ «{lastName}» удалена — в списке осталось {list.length}</> })}</span>} /> : <TLine out={<span style={{ color: CODE.comment, fontStyle: "italic" }}>{tr2({ uz: "kartochkadagi ✕ ni bosing…", ru: "нажмите ✕ на карточке…" })}</span>} />}
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingRight: 40 }}>
              <p className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
              <span className="mono small" style={{ color: T.ink3 }}>{tr2({ uz: `${list.length} ta`, ru: `${list.length} шт.` })}</span>
            </div>
            <Win title="localhost:5173" minH={120}>
              {list.length ? <CardGrid cols={2}>{list.map((g) => <MyCard key={g.id} game={g} onDelete={() => del(g)} />)}</CardGrid> : <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", fontSize: 13 }}>{tr2({ uz: "Ro'yxat bo'sh qoldi…", ru: "Список опустел…" })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><span className="mono">filter</span> o'chirilgan o'yinsiz yangi ro'yxat yasadi. E'tibor bering: hech narsani "buzib" tashlamaydik — har safar <b>yangi ro'yxat</b> yasaymiz.</>, ru: <><span className="mono">filter</span> создал новый список без удалённой игры. Обратите внимание: мы ничего не «ломали» — каждый раз создаём <b>новый список</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = (props) => <QuestionScreen
  {...props}
  idx={8}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Упражнение · вопрос 3" })}
  questionText="Bitta o'yinni ro'yxatdan o'chirish uchun qaysi kod?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Bitta o'yinni <span className="italic" style={{ color: T.accent }}>o'chirish</span> uchun qaysi kod?</>, ru: <>Какой код <span className="italic" style={{ color: T.accent }}>удалит</span> одну игру?</> })}</h2></>}
  options={[tr2({ uz: "games.map(...) — bittasini o'zgartiradi", ru: "games.map(...) — изменяет одну" }), tr2({ uz: "[...games, yangi] — bittasini qo'shadi", ru: "[...games, yangi] — добавляет одну" }), tr2({ uz: "games.filter(g => g.id !== id) — boshqasini saqlaydi", ru: "games.filter(g => g.id !== id) — сохраняет остальные" }), tr2({ uz: "games.length — faqat sonini sanaydi", ru: "games.length — просто считает количество" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri! filter shartga mos kelganlarni saqlaydi. g.id !== id = 'o'chirilayotganidan boshqa hammasini olib qol' — natijada o'sha o'yin tushib qoladi.", ru: "Верно! filter сохраняет подходящие под условие. g.id !== id = «оставь все, кроме удаляемой» — в итоге та игра выпадает." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — map o'chirmaydi, o'zgartiradi (Update). O'chirish — filter.", ru: "Нет — map не удаляет, а изменяет (Update). Удаление — filter." }),
    1: tr2({ uz: "Yo'q — bu qo'shish (Create). O'chirish uchun filter.", ru: "Нет — это добавление (Create). Для удаления — filter." }),
    3: tr2({ uz: "Yo'q — bu shunchaki son. O'chirish: games.filter(g => g.id !== id).", ru: "Нет — это просто число. Удаление: games.filter(g => g.id !== id)." }),
    default: tr2({ uz: "O'chirish = games.filter(g => g.id !== id) — o'sha id'dan boshqa hammasini saqlaydi.", ru: "Удаление = games.filter(g => g.id !== id) — сохраняет все, кроме этого id." })
  }}
/>;
var Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TASKS = [
    { id: "t1", label: tr2({ uz: "Qo'shish tugmasi yasa — bosilganda ro'yxatga yangi o'yin qo'shilsin", ru: "Сделай кнопку добавления — при нажатии в список добавляется новая игра" }), plan: [tr2({ uz: "Tugmaga onClick qo'shaman", ru: "Добавлю кнопке onClick" }), tr2({ uz: "setGames([...games, yangi]) chaqiraman", ru: "Вызову setGames([...games, yangi])" })], code: <>{"setGames("}<At>{"[...games, yangi]"}</At>{")"}</> },
    { id: "t2", label: tr2({ uz: "Har kartochkaga ❤️ tugma — bosilganda like soni oshsin", ru: "На каждую карточку кнопку ❤️ — при нажатии число лайков растёт" }), plan: [tr2({ uz: "map ichida o'sha o'yinni topaman", ru: "Найду эту игру внутри map" }), tr2({ uz: "{...g, likes: g.likes + 1} bilan yangilayman", ru: "Обновлю через {...g, likes: g.likes + 1}" })], code: <>{"games.map(g => g.id === id ? { "}<At>...g</At>{", likes: g.likes + 1 } : g)"}</> },
    { id: "t3", label: tr2({ uz: "Har kartochkaga ✕ tugma — bosilganda o'chsin", ru: "На каждую карточку кнопку ✕ — при нажатии она удаляется" }), plan: [tr2({ uz: "filter bilan o'sha o'yinni chiqarib tashlayman", ru: "Уберу эту игру через filter" })], code: <>{"games."}<At>filter</At>{"(g => g.id !== id)"}</> }
  ];
  const [task, setTask] = useState3(null);
  const [phase, setPhase] = useState3(storedAnswer ? "done" : "idle");
  const [demo, setDemo] = useState3(GAMES.slice(0, 3));
  const timer = useRef3(null);
  const done = phase === "done";
  useEffect4(() => () => clearTimeout(timer.current), []);
  const choose = (id) => {
    clearTimeout(timer.current);
    setTask(id);
    setPhase("planned");
    setDemo(GAMES.slice(0, 3));
  };
  const approve = () => {
    clearTimeout(timer.current);
    setPhase("building");
    timer.current = setTimeout(() => setPhase("done"), 1300);
  };
  const cur = TASKS.find((t) => t.id === task) || (storedAnswer ? TASKS[0] : null);
  const addDemo = () => setDemo((prev) => prev.length >= 4 ? prev : [...prev, POOL[prev.length - 3] || POOL[0]]);
  const likeDemo = (id) => setDemo((prev) => prev.map((g) => g.id === id ? { ...g, likes: g.likes + 1 } : g));
  const delDemo = (id) => setDemo((prev) => prev.filter((g) => g.id !== id));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "AI bilan qurish", ru: "Строим с AI" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Agent bilan quring", ru: "Постройте с агентом" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Reja tayyor — endi loyihani <span className="italic" style={{ color: T.accent }}>AI bilan</span> quramiz.</>, ru: <>План готов — теперь строим проект <span className="italic" style={{ color: T.accent }}>вместе с AI</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Siz har amal state'ni qanday o'zgartirishini bilasiz, demak agent kodini <b style={{ color: T.ink }}>tekshira olasiz</b>: qo'shishda <span className="mono">[...games]</span> bormi, o'chirishda <span className="mono">filter</span>mi. Buyruq bering, rejani <b style={{ color: T.ink }}>tasdiqlang</b>, natijani <b style={{ color: T.ink }}>o'zingiz sinang</b>.</>, ru: <>Вы знаете, как каждое действие меняет state, а значит можете <b style={{ color: T.ink }}>проверить</b> код агента: есть ли <span className="mono">[...games]</span> при добавлении, <span className="mono">filter</span> ли при удалении. Дайте команду, <b style={{ color: T.ink }}>утвердите</b> план, <b style={{ color: T.ink }}>сами испытайте</b> результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "1. Agentga so'z bilan ayting", ru: "1. Скажите агенту словами" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TASKS.map((t) => <button key={t.id} className={`chip ${task === t.id ? "chip-on" : ""}`} onClick={() => choose(t.id)} style={{ justifyContent: "flex-start", textAlign: "left" }}>"{t.label}"</button>)}
            </div>
            {!cur && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Yuqoridan bitta buyruqni tanlang", ru: "Выберите одну команду выше" })}</p></div>}
            {cur && <div className="ai-card fade-step" key={task || "stored"}>
                <div className="ai-row"><span className="ai-badge">Agent</span><span className="ai-bubble">{phase === "planned" ? tr2({ uz: "Mana rejam — tasdiqlaysizmi?", ru: "Вот мой план — утверждаете?" }) : phase === "building" ? tr2({ uz: "Yozyapman…", ru: "Пишу…" }) : tr2({ uz: "Bajardim — natijani sinang", ru: "Готово — испытайте результат" })}</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {cur.plan.map((p, i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}><span style={{ color: phase === "planned" ? T.ink3 : T.success }}>{phase === "planned" ? "○" : "✓"}</span><span style={{ color: T.ink }}>{p}</span></div>)}
                </div>
                {phase === "planned" && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={approve}>{tr2({ uz: "Rejani tasdiqlash", ru: "Утвердить план" })}</button>}
                {phase === "building" && <p className="ai-prompt" style={{ color: T.accent }}>{tr2({ uz: "Kod yozilyapti…", ru: "Код пишется…" })}</p>}
                {phase === "done" && <div className="ai-code fade-step"><div className="ai-line ok" style={{ cursor: "default", whiteSpace: "pre-wrap" }}>{cur.code}</div></div>}
              </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "2. Natija — o'zingiz sinab ko'ring", ru: "2. Результат — испытайте сами" })}</p>
            <Win title={tr2({ uz: "Mening o'yinlarim — localhost:5173", ru: "Мои игры — localhost:5173" })} minH={150}>
              {done && cur ? <div className="fade-step">
                  {cur.id === "t1" && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}><AddBtn small onClick={addDemo} /></div>}
                  <CardGrid cols={3}>
                    {demo.map((g) => <MyCard key={g.id} game={g} onLike={cur.id === "t2" ? () => likeDemo(g.id) : void 0} onDelete={cur.id === "t3" ? () => delDemo(g.id) : void 0} />)}
                  </CardGrid>
                  {cur.id === "t1" && <p className="small" style={{ color: T.accent, fontStyle: "italic", margin: "8px 0 0" }}>{tr2({ uz: `"+ O'yin qo'shish"ni bosing — ro'yxat o'sadi.`, ru: "Нажмите «+ Добавить игру» — список вырастет." })}</p>}
                  {cur.id === "t2" && <p className="small" style={{ color: T.accent, fontStyle: "italic", margin: "8px 0 0" }}>{tr2({ uz: "Kartochkadagi ❤️ ni bosing — like oshadi.", ru: "Нажмите ❤️ на карточке — лайк вырастет." })}</p>}
                  {cur.id === "t3" && <p className="small" style={{ color: T.accent, fontStyle: "italic", margin: "8px 0 0" }}>{tr2({ uz: "Kartochkadagi ✕ ni bosing — o'chadi.", ru: "Нажмите ✕ на карточке — она удалится." })}</p>}
                </div> : <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", fontSize: 13 }}>{tr2({ uz: "Buyruq bering va rejani tasdiqlang…", ru: "Дайте команду и утвердите план…" })}</p>}
            </Win>
            {done ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Ishladi! Kodni o'qing: amal to'g'ri (qo'shish/o'zgartirish/o'chirish), state ko'chirilgan (<span className="mono">...games</span> yoki <span className="mono">filter</span>). Agent ishini <b>sinab</b> qabul qildingiz.</>, ru: <>Работает! Прочитайте код: действие верное (добавить/изменить/удалить), state скопирован (<span className="mono">...games</span> или <span className="mono">filter</span>). Вы приняли работу агента, <b>испытав</b> её.</> })}</p></div> : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr2({ uz: "Natija shu yerda jonlanadi — keyin uni o'zingiz sinaysiz.", ru: "Результат оживёт здесь — потом вы испытаете его сами." })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [list, setList] = useState3(GAMES.slice(0, 3));
  const [asking, setAsking] = useState3(null);
  const [done, setDone] = useState3(!!storedAnswer);
  const [cancelled, setCancelled] = useState3(false);
  const confirmDel = () => {
    setList((prev) => prev.filter((g) => g.id !== asking.id));
    setAsking(null);
    setDone(true);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Xavfsizlik · tasdiq", ru: "Безопасность · подтверждение" })} screen={screen} scrollSignal={done || !!asking} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Bitta o'yinni o'chiring", ru: "Удалите одну игру" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Nega o'chirishdan oldin <span className="italic" style={{ color: T.accent }}>"Rostdan?"</span> deb so'raladi?</>, ru: <>Почему перед удалением спрашивают <span className="italic" style={{ color: T.accent }}>«Точно?»</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>O'chirishni <b style={{ color: T.ink }}>qaytarib bo'lmaydi</b> — bitta noto'g'ri bosish, o'yin yo'q. Shuning uchun yaxshi ilovalar avval <b style={{ color: T.ink }}>tasdiq</b> so'raydi. Kartochkadagi ✕ ni bosing — nima bo'lishini ko'ring.</>, ru: <>Удаление <b style={{ color: T.ink }}>нельзя отменить</b> — одно неверное нажатие, и игры нет. Поэтому хорошие приложения сначала просят <b style={{ color: T.ink }}>подтверждение</b>. Нажмите ✕ на карточке — посмотрите, что будет.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
            <Win title="localhost:5173" minH={120}>
              {list.length ? <CardGrid cols={3}>{list.map((g) => <MyCard key={g.id} game={g} onDelete={() => {
    setAsking(g);
    setCancelled(false);
  }} />)}</CardGrid> : <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", fontSize: 13 }}>{tr2({ uz: "Bo'sh…", ru: "Пусто…" })}</p>}
            </Win>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.9, padding: "10px 14px" }}>
              <Jx>{"if"}</Jx>{" (confirm("}<St>{tr2({ uz: `"Rostdan o'chirilsinmi?"`, ru: '"Точно удалить?"' })}</St>{")) {"}{"\n"}
              {"  setGames(games.filter(...));"}{"\n"}
              {"}"}
            </pre>
          </Col>
          <Col>
            {asking && <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${T.danger}, 0 8px 22px -6px rgba(${T.shadowBase},0.2)` }}>
                <p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "Rostdan o'chirilsinmi?", ru: "Точно удалить?" })}</p>
                <p className="body" style={{ margin: "0 0 12px", color: T.ink }}>{tr2({ uz: <>"{asking.name}" ro'yxatdan butunlay olib tashlanadi. Buni qaytarib bo'lmaydi.</>, ru: <>«{asking.name}» будет полностью убрана из списка. Это нельзя отменить.</> })}</p>
                <div style={{ display: "flex", gap: 9 }}>
                  <button className="btn-soft" onClick={() => {
    setAsking(null);
    setCancelled(true);
  }}>{tr2({ uz: "Bekor qilish", ru: "Отмена" })}</button>
                  <button className="btn" style={{ background: T.danger }} onClick={confirmDel}>{tr2({ uz: "Ha, o'chirilsin", ru: "Да, удалить" })}</button>
                </div>
              </div>}
            {cancelled && !asking && !done && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: "Bekor qildingiz — hech narsa o'zgarmadi. Bu ham muhim: tasdiq sizni xatodan saqladi. Tayyor bo'lsangiz, yana ✕ ni bosing.", ru: "Вы отменили — ничего не изменилось. Это тоже важно: подтверждение спасло вас от ошибки. Когда будете готовы, нажмите ✕ снова." })}</p></div>}
            {!asking && !done && !cancelled && <div className="hint fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Maslahat: foydalanuvchini o'zidan himoya qiling — muhim amaldan oldin doim <b style={{ color: T.ink }}>so'rang</b>.</>, ru: <>Совет: защищайте пользователя от него самого — перед важным действием всегда <b style={{ color: T.ink }}>спрашивайте</b>.</> })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Mana yaxshi ilova: avval <b>so'radi</b>, keyin <b>o'chirdi</b>. Bitta bosishda muhim narsa yo'qolmasin. Siz ham o'z ilovangizda shunday qilasiz.</>, ru: <>Вот хорошее приложение: сначала <b>спросило</b>, потом <b>удалило</b>. Пусть важное не пропадает от одного нажатия. Вы в своём приложении сделаете так же.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [list, setList] = useState3(storedAnswer ? [...GAMES.slice(0, 2), POOL[0]] : GAMES.slice(0, 2));
  const [didAdd, setDidAdd] = useState3(!!storedAnswer);
  const [didTop, setDidTop] = useState3(!!storedAnswer);
  const [didDel, setDidDel] = useState3(!!storedAnswer);
  const done = didAdd && didTop && didDel;
  const remaining = POOL.filter((p) => !list.some((g) => g.id === p.id));
  const add = (g) => {
    setList((prev) => [...prev, g]);
    setDidAdd(true);
  };
  const top = (id) => {
    setList((prev) => prev.map((g) => g.id === id ? { ...g, top: !g.top } : g));
    setDidTop(true);
  };
  const del = (id) => {
    setList((prev) => prev.filter((g) => g.id !== id));
    setDidDel(true);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const Tick = ({ ok, label }) => <span className="tagpill" style={{ color: ok ? T.success : T.ink3, boxShadow: ok ? `0 3px 10px -5px rgba(31,122,77,0.3)` : void 0 }}>{ok ? "✓" : "○"} {label}</span>;
  return <Stage eyebrow={tr2({ uz: "Amaliyot · loyihani bitirish", ru: "Практика · завершение проекта" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "3 amalni ham bajaring", ru: "Выполните все 3 действия" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Endi o'zingiz — loyihani <span className="italic" style={{ color: T.accent }}>to'liq boshqaring</span>.</>, ru: <>Теперь сами — <span className="italic" style={{ color: T.accent }}>полностью управляйте</span> проектом.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Mana sizning ilovangiz. Uchala amalni ham sinang: bitta o'yin <b style={{ color: T.ink }}>qo'shing</b>, bittasini <b style={{ color: T.ink }}>🔥 TOP</b> qiling, bittasini <b style={{ color: T.ink }}>✕ o'chiring</b>. Uchalasi bajarilsa — loyihangiz tayyor!</>, ru: <>Вот ваше приложение. Испытайте все три действия: <b style={{ color: T.ink }}>добавьте</b> одну игру, сделайте одну <b style={{ color: T.ink }}>🔥 TOP</b>, одну <b style={{ color: T.ink }}>✕ удалите</b>. Выполните все три — и проект готов!</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Qo'shish uchun", ru: "Для добавления" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {remaining.length ? remaining.map((g) => <button key={g.id} className="gchip" onClick={() => add(g)}>+ {g.emoji} {g.name}</button>) : <span className="small" style={{ color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "Hammasi qo'shildi", ru: "Всё добавлено" })}</span>}
            </div>
            <p className="flow-label" style={{ margin: "4px 0 0" }}>{tr2({ uz: "Bajarildi", ru: "Выполнено" })}</p>
            <div className="fade-up delay-2" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              <Tick ok={didAdd} label={tr2({ uz: "Qo'shdim", ru: "Добавлено" })} /><Tick ok={didTop} label={tr2({ uz: "TOP qildim", ru: "TOP сделан" })} /><Tick ok={didDel} label={tr2({ uz: "O'chirdim", ru: "Удалено" })} />
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Mening o'yinlarim", ru: "Мои игры" })}</p>
            <Win title="localhost:5173" minH={130}>
              {list.length ? <CardGrid cols={2}>{list.map((g) => <MyCard key={g.id} game={g} onTop={() => top(g.id)} onDelete={() => del(g.id)} />)}</CardGrid> : <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", fontSize: 13 }}>{tr2({ uz: "Bo'sh — o'yin qo'shing…", ru: "Пусто — добавьте игру…" })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "🎉 Loyihangiz tayyor! Siz to'liq CRUD ilovani boshqardingiz: qo'shdingiz, o'zgartirdingiz, o'chirdingiz — hammasi state bilan.", ru: "🎉 Ваш проект готов! Вы полностью управляли CRUD-приложением: добавили, изменили, удалили — всё через state." })}</p></div>}
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
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Упражнение · вопрос 4" })}
  questionText="O'yinning like sonini oshirish — bu CRUD'ning qaysi amali?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>O'yinning <span className="italic" style={{ color: T.accent }}>like sonini oshirish</span> — qaysi amal?</>, ru: <>Увеличить <span className="italic" style={{ color: T.accent }}>число лайков</span> игры — какое это действие?</> })}</h2></>}
  options={[tr2({ uz: "Update — mavjud o'yinni o'zgartirish", ru: "Update — изменить существующую игру" }), tr2({ uz: "Create — yangi o'yin qo'shish", ru: "Create — добавить новую игру" }), tr2({ uz: "Delete — o'yinni ro'yxatdan o'chirish", ru: "Delete — удалить игру из списка" }), tr2({ uz: "Read — ro'yxatni ekranga ko'rsatish", ru: "Read — показать список на экране" })]}
  correctIdx={0}
  explainCorrect={tr2({ uz: "To'g'ri! Like soni o'zgaradi, lekin o'yin o'sha o'yinligicha qoladi — bu Update. games.map bilan faqat o'sha elementni yangilaymiz.", ru: "Верно! Число лайков меняется, но игра остаётся той же — это Update. Через games.map обновляем только этот элемент." })}
  explainWrong={{
    1: tr2({ uz: "Yo'q — yangi o'yin qo'shilmayapti, mavjudi o'zgaryapti. Bu Update.", ru: "Нет — новая игра не добавляется, меняется существующая. Это Update." }),
    2: tr2({ uz: "Yo'q — o'yin o'chmayapti, like'i o'zgaryapti. Bu Update.", ru: "Нет — игра не удаляется, меняется её лайк. Это Update." }),
    3: tr2({ uz: "Read — faqat ko'rsatish. Bu yerda esa o'zgartirish bor — Update.", ru: "Read — только показ. А здесь есть изменение — Update." }),
    default: tr2({ uz: "Mavjud narsani o'zgartirish = Update (games.map).", ru: "Изменение существующего = Update (games.map)." })
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState3(storedAnswer ? "push" : null);
  const [fixed, setFixed] = useState3(!!storedAnswer);
  const [clicks, setClicks] = useState3(0);
  const found = picked === "push";
  const done = fixed;
  const base = GAMES.slice(0, 2);
  const shown = fixed ? [...base, ...Array.from({ length: clicks }, (_, i) => POOL[i] || POOL[0])] : base;
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="Debugging" screen={screen} scrollSignal={found || fixed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : found ? tr2({ uz: "Endi tuzating", ru: "Теперь исправьте" }) : tr2({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>AI помогает — а <span className="italic" style={{ color: T.accent }}>проверяете</span> вы.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI "Qo'shish"ni yozdi — lekin tugmani bosganda <b style={{ color: T.ink }}>hech narsa bo'lmayapti</b>! O'yin qo'shilmaydi. <b style={{ color: T.ink }}>State darsini</b> eslang: ro'yxatni to'g'ridan-to'g'ri o'zgartirsangiz, React buni <b style={{ color: T.ink }}>ko'rmaydi</b>. Qaysi qatorda shu xato?</>, ru: <>AI написал «Добавить» — но при нажатии кнопки <b style={{ color: T.ink }}>ничего не происходит</b>! Игра не добавляется. Вспомните <b style={{ color: T.ink }}>урок про state</b>: если менять список напрямую, React этого <b style={{ color: T.ink }}>не видит</b>. В какой строке эта ошибка?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-2">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "Qo'shish kodini yozdim:", ru: "Я написал код добавления:" })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${picked === "obj" ? "ok" : ""}`} onClick={() => {
    if (!found) setPicked("obj");
  }}><Jx>{"const"}</Jx>{" yangi = { name: "}<St>"Piggy"</St>{" };"}</div>
                {!fixed ? <div className={`ai-line ${found ? "bad" : ""}`} onClick={() => {
    if (!found) setPicked("push");
  }}>{"games."}<At>push</At>{"(yangi);"}{"  "}<Cm>{tr2({ uz: "// o'sha ro'yxatning o'ziga qo'shdi", ru: "// добавил в тот же список" })}</Cm></div> : <div className="ai-line ok el-in">{"setGames("}<At>{"[...games, yangi]"}</At>{");"}{"  "}<Cm>{tr2({ uz: "// yangi ro'yxat — React ko'radi!", ru: "// новый список — React видит!" })}</Cm></div>}
                {!fixed && <div className={`ai-line ${picked === "set" ? "ok" : ""}`} onClick={() => {
    if (!found) setPicked("set");
  }}>{"setGames(games);"}{"  "}<Cm>{tr2({ uz: "// o'sha ro'yxat...", ru: "// тот же список..." })}</Cm></div>}
              </div>
              {!found && <p className="ai-prompt">{tr2({ uz: "Ro'yxat nega yangilanmayapti? Xato qatorni bosing.", ru: "Почему список не обновляется? Нажмите на строку с ошибкой." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={() => {
    setFixed(true);
    setClicks(0);
  }}>{tr2({ uz: "🔧 setGames([...games, yangi]) ga almashtirish", ru: "🔧 Заменить на setGames([...games, yangi])" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>{tr2({ uz: "✓ Tuzatildi — endi yangi ro'yxat yasaladi, React ko'radi!", ru: "✓ Исправлено — теперь создаётся новый список, React видит!" })}</p>}
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="chip" style={{ padding: "6px 12px", fontSize: 12 }} disabled={clicks >= 2} onClick={() => setClicks((c) => Math.min(c + 1, 2))}>{fixed ? tr2({ uz: "+ [...games, yangi]", ru: "+ [...games, yangi]" }) : tr2({ uz: "+ push (tez qo'l)", ru: "+ push (на скорую руку)" })}</button>
            </div>
            <Aquarium fish={shown} frozen={!fixed} minH={110} addId={fixed && clicks > 0 ? shown[shown.length - 1]?.id : null} />
            {!found && (picked === "obj" || picked === "set" ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{picked === "obj" ? tr2({ uz: <>Bu qator to'g'ri — yangi o'yin tayyorlandi. Yana qarang: <span className="mono">games</span> ro'yxatining <b>o'ziga</b> tegayotgan qator qaysi?</>, ru: <>Эта строка верна — новая игра подготовлена. Посмотрите ещё раз: какая строка трогает <b>сам</b> список <span className="mono">games</span>?</> }) : tr2({ uz: <>Yaqin! Bu qator o'zi xato emas — muammo unga <b>o'sha eski ro'yxat</b> uzatilayotganida. Uni o'sha holicha kim qoldirdi? Yuqoridagi qatorga qarang.</>, ru: <>Близко! Сама строка не ошибка — проблема в том, что в неё передаётся <b>тот же старый список</b>. А кто оставил его таким? Посмотрите на строку выше.</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>"+ push"ni bosing — son o'zgarmaydi. <span className="mono" style={{ color: T.ink }}>push</span> o'sha eski ro'yxatning <b style={{ color: T.ink }}>o'ziga</b> qo'shadi, yangi ro'yxat yasamaydi — React esa faqat yangi ro'yxatni sezadi.</>, ru: <>Нажмите «+ push» — число не меняется. <span className="mono" style={{ color: T.ink }}>push</span> добавляет в <b style={{ color: T.ink }}>тот же</b> старый список, а нового не создаёт — React же замечает только новый список.</> })}</p></div>)}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr2({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><b>①</b> <span className="mono">games.push(yangi)</span> — o'sha eski ro'yxatning <b>o'ziga</b> qo'shadi, yangi ro'yxat yasamaydi. <b>②</b> <span className="mono">setGames(games)</span> React'ga <b>o'sha eski ro'yxatni</b> uzatadi — React uchun hech narsa o'zgarmagan, shuning uchun qayta chizmaydi. To'g'risi: <span className="mono">setGames([...games, yangi])</span> — yangi ro'yxat. Chapdagi tugma bilan tuzating →</>, ru: <><b>①</b> <span className="mono">games.push(yangi)</span> добавляет в <b>тот же</b> старый список, нового не создаёт. <b>②</b> <span className="mono">setGames(games)</span> передаёт React <b>тот же самый старый список</b> — для React ничего не изменилось, поэтому он не перерисовывает. Правильно: <span className="mono">setGames([...games, yangi])</span> — новый список. Исправьте кнопкой слева →</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [value, setValue] = useState3(typeof storedAnswer?.picked === "string" ? storedAnswer.picked : "");
  const [passed, setPassed] = useState3(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, " ").trim();
  const valid = /^setGames\(\s*\[\s*\.\.\.\s*games\s*,\s*yangi\s*\]\s*\)\s*;?$/.test(norm);
  const hasSet = /setGames\s*\(/.test(value);
  const hasSpread = /\[\s*\.\.\.\s*games/.test(value);
  const hasNew = /,\s*yangi\s*\]/.test(value);
  const pushBug = /\bgames\s*\.\s*push\b/.test(value);
  useEffect4(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: "final", screenIdx: screen, question: "VS Code: setGames([...games, yangi]) ni yozing", studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => <div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: "pre" }}>{children}</span></div>;
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} scrollSignal={passed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Qo'shish qatorini yozing", ru: "Напишите строку добавления" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>qo'shish</span> kodini o'zingiz yozing.</>, ru: <>Последний шаг: сами напишите код <span className="italic" style={{ color: T.accent }}>добавления</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>VS Code'da <span className="mono">App.jsx</span> ochiq: forma tayyor, yangi o'yin <span className="mono">yangi</span>'da turibdi — faqat <b style={{ color: T.ink }}>3-qator bo'sh</b>. Uni ro'yxatga qo'shing: <b style={{ color: T.ink }}>setGames(</b> + <b style={{ color: T.ink }}>[...games</b> (eski hammasi) + <b style={{ color: T.ink }}>, yangi]</b> (yangisi) + <b style={{ color: T.ink }}>)</b>.</>, ru: <>В VS Code открыт <span className="mono">App.jsx</span>: форма готова, новая игра лежит в <span className="mono">yangi</span> — пуста только <b style={{ color: T.ink }}>строка 3</b>. Добавьте её в список: <b style={{ color: T.ink }}>setGames(</b> + <b style={{ color: T.ink }}>[...games</b> (всё старое) + <b style={{ color: T.ink }}>, yangi]</b> (новая) + <b style={{ color: T.ink }}>)</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: "#61DAFB" }}>⚛</span> App.jsx <span style={{ color: "#6E7681", marginLeft: 4 }}>×</span></span>
                <span className="vsc-tab">GameCard.jsx</span>
              </div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{"function"}</Jx><span style={{ color: "#DCDCAA" }}> qoshish</span>{"() {"}</Ln>
                <Ln n={2}>{"  "}<Jx>{"const"}</Jx>{" yangi = { name: "}<St>'Piggy'</St>{" };"}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">3</span>
                  <span style={{ whiteSpace: "pre" }}>{"  "}</span>
                  <input className={`vsc-input ${valid ? "ok" : ""}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder='setGames([...games, yangi])' spellCheck={false} autoCapitalize="off" autoCorrect="off" />
                </div>
                <Ln n={4}>{"}"}</Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: hasSet ? 1 : 0.4 }}>{hasSet ? "✓" : "1"} setGames(</span>
              <span className="tagpill" style={{ opacity: hasSpread ? 1 : 0.4 }}>{hasSpread ? "✓" : "2"} [...games</span>
              <span className="tagpill" style={{ opacity: hasNew ? 1 : 0.4 }}>{hasNew ? "✓" : "3"} , yangi]</span>
            </div>
            {pushBug && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Esingizdami? <span className="mono">games.push</span> ishlamaydi — React ko'rmaydi. Yangi ro'yxat kerak: <span className="mono">setGames([...games, yangi])</span>.</>, ru: <>Помните? <span className="mono">games.push</span> не работает — React не видит. Нужен новый список: <span className="mono">setGames([...games, yangi])</span>.</> })}</p></div>}
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ Mukammal! Qo'shish ishladi — eski hammasi + yangisi. To'liq CRUD ilovasi sizning qo'lingizda.", ru: "✓ Отлично! Добавление сработало — всё старое + новая. Полное CRUD-приложение в ваших руках." })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "natija — localhost:5173", ru: "результат — localhost:5173" })}</p>
            <Win title={tr2({ uz: "Mening o'yinlarim — localhost:5173", ru: "Мои игры — localhost:5173" })} minH={130}>
              {valid ? <div className="fade-step"><CardGrid cols={3}><MyCard game={GAMES[0]} /><MyCard game={GAMES[1]} /><MyCard game={{ ...POOL[0] }} flash /></CardGrid><p className="small" style={{ color: T.success, fontWeight: 700, margin: "8px 0 0" }}>{tr2({ uz: `✓ "Piggy" qo'shildi!`, ru: "✓ «Piggy» добавлена!" })}</p></div> : <p style={{ fontFamily: "Georgia, serif", color: T.ink3, fontStyle: "italic", margin: 0, textAlign: "center", lineHeight: 1.5 }}>{tr2({ uz: <>3-qator yozilmaguncha qo'shish ishlamaydi: <span className="mono" style={{ fontStyle: "normal" }}>setGames([...games, yangi])</span></>, ru: <>Пока строка 3 не написана, добавление не работает: <span className="mono" style={{ fontStyle: "normal" }}>setGames([...games, yangi])</span></> })}</p>}
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Aquarium = ({ fish = [], frozen = false, feedId = null, addId = null, netName = null, minH = 150 }) => <div className={`aq ${frozen ? "is-frozen" : ""}`}>
    <div className="aq-bar"><span className="aq-bar-t">{tr2({ uz: "🪟 Oyna — ekran (React kamerasi)", ru: "🪟 Стекло — экран (камера React)" })}</span><span className="aq-count">🐟 {fish.length}</span></div>
    <div className="aq-water" style={{ minHeight: minH }}>
      <span className="aq-ray" aria-hidden="true" /><span className="aq-ray r2" aria-hidden="true" />
      {fish.map((f, i) => <span
  key={f.id}
  className={`aq-fish ${f.id === feedId ? "fed" : ""} ${f.id === addId ? "splash" : ""}`}
  style={{ left: `${10 + i % 4 * 21}%`, top: `${16 + i * 41 % 58}%`, animationDelay: `${i % 5 * 0.5}s` }}
  title={f.name}
>{f.emoji || "🐟"}</span>)}
      {!fish.length && !frozen && <span className="aq-empty">{tr2({ uz: "Suv bo'sh — baliq tashlang…", ru: "Вода пуста — запустите рыбку…" })}</span>}
      {frozen && <div className="aq-frost">
          <span className="aq-frost-ic">❄️</span>
          <span className="aq-frost-t">{tr2({ uz: <>Oyna muzladi — React o'zgarishni <b>ko'rmadi</b></>, ru: <>Стекло замёрзло — React <b>не увидел</b> изменение</> })}</span>
        </div>}
      {netName && <span className="aq-blop">{tr2({ uz: `blop! «${netName}» to'r bilan chiqdi`, ru: `блюп! «${netName}» выловлен сачком` })}</span>}
    </div>
  </div>;
var PRACTICE_BASE = 500;
var MentorPracticeStats = ({ live, screen, label }) => {
  const [data, setData] = useState3({ players: null, doneIds: /* @__PURE__ */ new Set() });
  const isMentor = !!(live && live.mode === "mentor" && live.pin);
  useEffect4(() => {
    if (!isMentor) return;
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
  }, [isMentor, live && live.pin, screen]);
  if (!isMentor) return null;
  if (data.players === null || data.players.length === 0) return null;
  const players = data.players;
  const doers = players.filter((p) => data.doneIds.has(p.id));
  const waiting = players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr2(label || { uz: "👀 Kim bajardi", ru: "👀 Кто выполнил" })} — <b>{doers.length}</b>/{players.length}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {doers.map((p) => <span key={p.id} className="lp-doer done">✓ {p.nickname}</span>)}
        {waiting.slice(0, 10).map((p) => <span key={p.id} className="lp-doer">⏳ {p.nickname}</span>)}
        {waiting.length > 10 && <span className="lp-doer">+{waiting.length - 10}</span>}
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
function ScreenLivePractice({ title, task, checklist, statsLabel, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
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
    onAnswer(screen, { stage: "practice", screenIdx: screen, practice: title, solved: true, correct: true, picked: true });
    if (_live && _live.mode === "student") _live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
  };
  return <Stage eyebrow={tr2({ uz: "Amaliyot · VS Code", ru: "Практика · VS Code" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval bajaring", ru: "Сначала выполните" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2(title)}</h2></div>
        <Mentor>{isMentor ? tr2({ uz: <>O'quvchilar topshiriqni <b style={{ color: T.ink }}>VS Code'da</b> bajarmoqda. Nechtasi tugatgani pastda ko'rinadi — hamma tayyor bo'lgach davom eting.</>, ru: <>Ученики выполняют задание <b style={{ color: T.ink }}>в VS Code</b>. Сколько закончили — видно ниже; продолжайте, когда будут готовы все.</> }) : tr2({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Закончив, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник наблюдает.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr2({ uz: "TOPSHIRIQ", ru: "ЗАДАНИЕ" })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr2(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} label={statsLabel} />
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
            {!isMentor && <button className={`lp-done-btn ${done ? "is-done" : ""}`} disabled={done} onClick={complete}>
              {done ? tr2({ uz: "✓ Bajarildi — ustozni kuting", ru: "✓ Выполнено — ждите наставника" }) : tr2({ uz: "✅ Bajardim", ru: "✅ Выполнил" })}
            </button>}
            {done && !isMentor && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: "Отлично! Вы выполнили задание. Наставник проверит и переведёт на следующий шаг." })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>;
}
var ScreenPractice1 = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "Checkpoint 1 — Create: o'yin qo'shish", ru: "Checkpoint 1 — Create: добавление игры" }}
  statsLabel={{ uz: "✅ Qo'shganlar", ru: "✅ Добавили" }}
  task={{ uz: "VS Code'dagi «Mening o'yinlarim» loyihangizda forma orqali yangi o'yin qo'shing. Tugma bosilganda ro'yxat o'ssin — spread bilan.", ru: "В своём проекте «Мои игры» в VS Code добавьте новую игру через форму. При нажатии кнопки список должен вырасти — через spread." }}
  checklist={[
    { uz: "Formadagi tugmaga `onClick` qo'shing", ru: "Добавьте кнопке формы `onClick`" },
    { uz: "Yangi o'yin obyektini yozing: `const yangi = { id, name }`", ru: "Напишите объект новой игры: `const yangi = { id, name }`" },
    { uz: "`setGames([...games, yangi])` bilan ro'yxatga qo'shing", ru: "Добавьте в список через `setGames([...games, yangi])`" },
    { uz: "Saqlang — localhost:5173 da yangi kartochka chiqdimi?", ru: "Сохраните — появилась ли новая карточка на localhost:5173?" }
  ]}
/>;
var ScreenPractice2 = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "Checkpoint 2 — Update: 🔥 TOP toggle", ru: "Checkpoint 2 — Update: переключатель 🔥 TOP" }}
  statsLabel={{ uz: "🔥 TOP qilganlar", ru: "🔥 Сделали TOP" }}
  task={{ uz: "Har kartochkaga «🔥 TOP» tugmasini qo'shing. Bosilganda faqat o'sha o'yinning top holati o'zgarsin, qolganlari joyida qolsin.", ru: "Добавьте на каждую карточку кнопку «🔥 TOP». При нажатии должно меняться top-состояние только этой игры, остальные — на месте." }}
  checklist={[
    { uz: "Kartochka tugmasiga `onClick={() => toggleTop(g.id)}` bering", ru: "Дайте кнопке карточки `onClick={() => toggleTop(g.id)}`" },
    { uz: "`games.map(g => g.id === id ? { ...g, top: !g.top } : g)` yozing", ru: "Напишите `games.map(g => g.id === id ? { ...g, top: !g.top } : g)`" },
    { uz: "`setGames(...)` bilan yangi ro'yxatni qo'ying", ru: "Подставьте новый список через `setGames(...)`" },
    { uz: "Saqlang — faqat bosilgan kartochka o'zgardimi?", ru: "Сохраните — изменилась только нажатая карточка?" }
  ]}
/>;
var ScreenPractice3 = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "Checkpoint 3 — Delete: ✕ o'chirish (tasdiq bilan)", ru: "Checkpoint 3 — Delete: удаление ✕ (с подтверждением)" }}
  statsLabel={{ uz: "✕ O'chirganlar", ru: "✕ Удалили" }}
  task={{ uz: "Har kartochkaga «✕» tugmasini qo'shing. Bosilganda avval tasdiq so'rang, keyin filter bilan o'sha o'yinni ro'yxatdan chiqaring.", ru: "Добавьте на каждую карточку кнопку «✕». При нажатии сначала спросите подтверждение, потом уберите эту игру из списка через filter." }}
  checklist={[
    { uz: '`if (confirm("Rostdan?")) { ... }` bilan tasdiq so\'rang', ru: 'Спросите подтверждение: `if (confirm("Rostdan?")) { ... }`' },
    { uz: "`games.filter(g => g.id !== id)` yozing", ru: "Напишите `games.filter(g => g.id !== id)`" },
    { uz: "`setGames(...)` bilan yangi ro'yxatni qo'ying", ru: "Подставьте новый список через `setGames(...)`" },
    { uz: "Saqlang — o'sha o'yin ro'yxatdan tushdimi?", ru: "Сохраните — игра исчезла из списка?" }
  ]}
/>;
var REACT_FLASHCARDS = [
  { front: { uz: "CRUD — qaysi 4 amalning qisqartmasi?", ru: "Сокращением каких 4 действий является CRUD?" }, back: "Create · Read · Update · Delete", note: { uz: "qo'shish · ko'rsatish · o'zgartirish · o'chirish", ru: "добавить · показать · изменить · удалить" } },
  { front: { uz: "Ro'yxatga yangi o'yin qo'shish qaysi amal?", ru: "Какое это действие — добавить новую игру в список?" }, back: "Create", note: "setGames([...games, yangi])" },
  { front: { uz: "Ro'yxatni ekranga chiqarish qaysi amal?", ru: "Какое это действие — вывести список на экран?" }, back: "Read", note: "games.map(g => <GameCard game={g} />)" },
  { front: { uz: "Like sonini oshirish qaysi amal?", ru: "Какое это действие — увеличить число лайков?" }, back: "Update", note: { uz: "o'yin o'sha o'yin, faqat bir xossasi o'zgardi", ru: "игра та же, изменилось лишь одно свойство" } },
  { front: { uz: "O'yinni ro'yxatdan olib tashlash qaysi amal?", ru: "Какое это действие — убрать игру из списка?" }, back: "Delete", note: "games.filter(g => g.id !== id)" },
  { front: { uz: "Uch nuqta (...) nimani anglatadi?", ru: "Что означают три точки (...)?" }, back: { uz: "Hammasini ko'chir", ru: "Скопируй всё" }, note: { uz: "spread: eski ro'yxat butunlay ko'chiriladi", ru: "spread: старый список копируется целиком" } },
  { front: { uz: "Yangi o'yinni qo'shish kodi qanday yoziladi?", ru: "Как пишется код добавления новой игры?" }, back: "setGames([...games, yangi])", note: { uz: "eski hammasi + yangisi", ru: "всё старое + новая" } },
  { front: { uz: "games = yangi desangiz nima bo'ladi?", ru: "Что будет, если написать games = yangi?" }, back: { uz: "Eski o'yinlar yo'qoladi", ru: "Старые игры пропадут" }, note: { uz: "shuning uchun [...games, yangi] yoziladi", ru: "поэтому пишут [...games, yangi]" } },
  { front: { uz: "O'chirish uchun qaysi buyruq ishlatiladi?", ru: "Какая команда используется для удаления?" }, back: "filter", note: { uz: "o'chiriladiganidan boshqa hammasini saqlaydi", ru: "сохраняет все, кроме удаляемой" } },
  { front: { uz: "Bitta o'yinni o'zgartirish uchun qaysi buyruq ishlatiladi?", ru: "Какая команда используется, чтобы изменить одну игру?" }, back: "map", note: "g.id === id ? { ...g, likes: g.likes + 1 } : g" },
  { front: { uz: "«O'yinni ko'chir, faqat top'ini almashtir» kodi qanday?", ru: "Как выглядит код «скопируй игру, поменяй только top»?" }, back: "{ ...g, top: !g.top }", note: { uz: "spread + bitta o'zgarish", ru: "spread + одно изменение" } },
  { front: { uz: "games.push(yangi) nega ishlamaydi?", ru: "Почему games.push(yangi) не работает?" }, back: { uz: "React o'zgarishni ko'rmaydi", ru: "React не видит изменение" }, note: { uz: "mutatsiya: ro'yxat o'sha — yangisi yasalmaydi", ru: "мутация: список тот же — нового не создаётся" } }
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{tr2({ uz: `${total}/${total} atama yodlandi`, ru: `${total}/${total} терминов выучено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr2({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda · ", ru: "↻ Учим · " })}<b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim · ", ru: "✓ Знаю · " })}<b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr2(card.front)}</span><span className="fc-cue">{tr2({ uz: "Javobni o'ylang", ru: "Подумайте над ответом" })} 🤔 <span className="fc-tap">{tr2({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr2(card.back))}{card.note && <span className="fc-note">{tr2(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr2({ uz: "✗ Takrorlash", ru: "✗ Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })}</button></div> : <p className="fc-hint">{tr2({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: "👆 Нажмите на карту — увидите ответ" })}</p>}
    </div>;
}
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
var ACHIEVEMENTS = {
  builder: { icon: "🧱", name: "Full CRUD!", desc: { uz: "Qo'shdingiz, o'zgartirdingiz, o'chirdingiz", ru: "Вы добавили, изменили и удалили" } },
  debugger: { icon: "🐞", name: "Nice Catch!", desc: { uz: "push mutatsiya xatosini topib, spread'ga tuzatdingiz", ru: "Нашли ошибку-мутацию push и исправили её на spread" } },
  finisher: { icon: "⚡", name: "Ship It!", desc: { uz: "Qo'shish kodini VS Code'da o'zingiz yozdingiz", ru: "Сами написали код добавления в VS Code" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "CRUD praktikasini to'liq yakunladingiz", ru: "Полностью завершили практику CRUD" } }
};
var ACH_TRIGGERS = { s11: "builder", s13: "debugger", s14: "finisher" };
function AchCelebrate({ ach, onDone }) {
  useEffect4(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr2({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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
var Q_LABELS = { 4: { uz: "1 — CRUD nima", ru: "1 — что такое CRUD" }, 7: "2 — Create", 12: "3 — Delete", 16: "4 — Update", 18: { uz: "5 — Yakuniy", ru: "5 — Финал" } };
var INLINE_KEYS = { s4: 1, s5b: 3, s8: 2, s12: 0, s14: -1, practice: -1 };
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "Create", l: 5, t: 10, s: 30, c: "rgba(120,235,175,0.16)", d: 19, dl: 0 },
  { ch: "Read", l: 84, t: 7, s: 30, c: "rgba(80,200,255,0.14)", d: 23, dl: 1.5 },
  { ch: "Update", l: 8, t: 72, s: 28, c: "rgba(232,161,58,0.15)", d: 27, dl: 0.8 },
  { ch: "Delete", l: 80, t: 68, s: 36, c: "rgba(255,110,70,0.14)", d: 21, dl: 2.2 },
  { ch: "⚛", l: 44, t: 86, s: 40, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "[...games]", l: 62, t: 26, s: 26, c: "rgba(203,173,255,0.13)", d: 17, dl: 0.4 },
  { ch: "filter", l: 26, t: 34, s: 28, c: "rgba(80,200,255,0.14)", d: 20, dl: 1.9 },
  { ch: "map", l: 55, t: 5, s: 30, c: "rgba(203,173,255,0.12)", d: 22, dl: 0.6 },
  { ch: "setGames", l: 89, t: 42, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "state", l: 2, t: 45, s: 26, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "CRUD nimaning qisqartmasi?", ru: "Сокращением чего является CRUD?" }, opts: ["Create, Read, Update, Delete", "Copy, Run, Undo, Delete", "Code, Read, Update, Deploy", "Create, React, Update, Data"], correct: 0 },
  { q: { uz: "Ro'yxatga yangi element qo'shish (Create) uchun to'g'ri kod qaysi?", ru: "Какой код верно добавит новый элемент в список (Create)?" }, opts: ["games.push(yangi)", "setGames([...games, yangi])", "games = yangi", "setGames(yangi)"], correct: 1 },
  { q: { uz: "Ro'yxatni ekranga chizish (Read) uchun nima ishlatiladi?", ru: "Что используется, чтобы нарисовать список на экране (Read)?" }, opts: ["filter", "push", "map", "confirm"], correct: 2 },
  { q: { uz: "Bitta o'yinni o'zgartirish (Update) uchun qaysi amal ishlatiladi?", ru: "Какой метод используется, чтобы изменить одну игру (Update)?" }, opts: ["push", "filter", "pop", "map"], correct: 3 },
  { q: { uz: "O'yinni o'chirish (Delete) uchun to'g'ri kod qaysi?", ru: "Какой код верно удалит игру (Delete)?" }, opts: ["games.filter(g => g.id !== id)", "games.map(g => g.id)", "games.push(id)", "games.length - 1"], correct: 0 },
  { q: { uz: "`...games` (uch nuqta — spread) nima qiladi?", ru: "Что делает `...games` (три точки — spread)?" }, opts: [{ uz: "Butun ro'yxatni o'chirib tashlaydi", ru: "Полностью удаляет список" }, { uz: "Eski ro'yxatning hammasini ko'chiradi", ru: "Копирует всё из старого списка" }, { uz: "Faqat oxirgi elementni ajratib oladi", ru: "Выделяет только последний элемент" }, { uz: "Ro'yxat tartibini teskari qiladi", ru: "Разворачивает порядок списка" }], correct: 1 },
  { q: { uz: "Nega `games.push(yangi)` React'da ishlamaydi?", ru: "Почему `games.push(yangi)` не работает в React?" }, opts: [{ uz: "push juda sekin, sahifani qotiradi", ru: "push слишком медленный, страница зависнет" }, { uz: "push faqat serverda ishlaydi", ru: "push работает только на сервере" }, { uz: "O'sha ro'yxatning o'ziga qo'shadi — React yangisini ko'rmaydi", ru: "Добавляет в тот же список — React не видит нового" }, { uz: "push raqamlar bilan ishlamaydi", ru: "push не работает с числами" }], correct: 2 },
  { q: { uz: "`games.map(g => g.id === id ? {...g, top: true} : g)` nima qiladi?", ru: "Что делает `games.map(g => g.id === id ? {...g, top: true} : g)`?" }, opts: [{ uz: "Hamma o'yinni birdek o'chirib tashlaydi", ru: "Разом удаляет все игры" }, { uz: "Ro'yxatga yangi o'yin qo'shib qo'yadi", ru: "Добавляет в список новую игру" }, { uz: "Butun ro'yxatni bo'shatib yuboradi", ru: "Полностью опустошает список" }, { uz: "Bitta o'yinni o'zgartirib, qolganini saqlaydi", ru: "Меняет одну игру, сохраняя остальные" }], correct: 3 },
  { q: { uz: "`filter` qanday ishlaydi?", ru: "Как работает `filter`?" }, opts: [{ uz: "Mos kelganlarni saqlab, qolganini tashlaydi", ru: "Сохраняет подходящие, отбрасывает остальное" }, { uz: "Hamma elementni birdek o'zgartiradi", ru: "Одинаково меняет все элементы" }, { uz: "Ro'yxat oxiriga element qo'shadi", ru: "Добавляет элемент в конец списка" }, { uz: "Ro'yxatdagi barcha sonlarni qo'shadi", ru: "Складывает все числа в списке" }], correct: 0 },
  { q: { uz: "O'yinning like sonini oshirish — CRUD'ning qaysi amali?", ru: "Увеличить число лайков игры — какое это действие CRUD?" }, opts: ["Delete", "Update", "Create", "Read"], correct: 1 },
  { q: { uz: "Bu darsda ilova ma'lumoti qayerda saqlanadi?", ru: "Где хранятся данные приложения в этом уроке?" }, opts: [{ uz: "Serverda — abadiy saqlanadi", ru: "На сервере — хранится вечно" }, { uz: "Kompyuter diskida — o'chmaydi", ru: "На диске компьютера — не пропадает" }, { uz: "Xotirada (state) — yangilansa yo'qoladi", ru: "В памяти (state) — пропадёт при обновлении" }, { uz: "Internet bulutida — hamma ko'radi", ru: "В интернет-облаке — видят все" }], correct: 2 },
  { q: { uz: "Nega o'chirishdan oldin `confirm` bilan tasdiq so'raladi?", ru: "Зачем перед удалением спрашивают подтверждение через `confirm`?" }, opts: [{ uz: "Kodni tezroq ishlatish uchun", ru: "Чтобы код работал быстрее" }, { uz: "React buni majburiy talab qiladi", ru: "React это обязательно требует" }, { uz: "Kartochkaga rang qo'shish uchun", ru: "Чтобы добавить карточке цвет" }, { uz: "O'chirilgan qaytmaydi — xatodan saqlaydi", ru: "Удалённое не вернуть — защита от ошибки" }], correct: 3 }
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
    const TOK = ["setGames", "filter", "map", "state", "...games", "CRUD", "push", "Delete"];
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
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться ровно сюда через «⚡ Продолжить».\n\nВсё равно закрыть?" }))) return;
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
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест сами:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме практики" })}</button>
        </div>}

      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!" })}</p>
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? tr2({ uz: ` · 🔥 x${streakUpTo(qi)} streak`, ru: ` · 🔥 x${streakUpTo(qi)} серия` }) : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Быстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
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
              <p className="qz-sub">{tr2({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ""}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верно${soloScore.maxStreak >= 2 ? ` · самая длинная серия 🔥x${soloScore.maxStreak}` : ""}` })}</p>
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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь будет рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не присоединился." })}</p></div> : <>
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
          </>}
      </div>
    </Stage>;
};
var Screen15 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    tr2({ uz: "CRUD = ilovaning 4 amali: Create · Read · Update · Delete", ru: "CRUD = 4 действия приложения: Create · Read · Update · Delete" }),
    tr2({ uz: "Create — qo'shish: setGames([...games, yangi])", ru: "Create — добавление: setGames([...games, yangi])" }),
    tr2({ uz: "Update — o'zgartirish: games.map(... ? {...g} : g)", ru: "Update — изменение: games.map(... ? {...g} : g)" }),
    tr2({ uz: "Delete — o'chirish: games.filter(g => g.id !== id)", ru: "Delete — удаление: games.filter(g => g.id !== id)" }),
    tr2({ uz: "Ro'yxatni buzma — har safar YANGI ro'yxat yasa (React shuni ko'radi)", ru: "Не ломай список — каждый раз создавай НОВЫЙ (именно его видит React)" })
  ];
  const HOMEWORK = [
    { b: tr2({ uz: "To'liq CRUD", ru: "Полный CRUD" }), t: tr2({ uz: "— Antigravity bilan o'z ro'yxatingizga qo'shish, o'zgartirish, o'chirishni qo'shing", ru: "— вместе с Antigravity добавьте в свой список добавление, изменение и удаление" }) },
    { b: tr2({ uz: "Tasdiq", ru: "Подтверждение" }), t: tr2({ uz: "— o'chirishdan oldin 'Rostdan?' deb so'rang", ru: "— перед удалением спросите «Точно?»" }) },
    { b: tr2({ uz: "Tekshiring", ru: "Проверяйте" }), t: tr2({ uz: "— qo'shishda [...games] bormi, o'chirishda filter'mi — o'zingiz nazorat qiling", ru: "— есть ли [...games] при добавлении и filter при удалении — контролируйте сами" }) }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Birinchi loyihangiz bitdi", ru: "Ваш первый проект завершён" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>To'liq ilovani <span className="italic" style={{ color: T.accent }}>o'zingiz bitirdingiz</span>.</>, ru: <>Вы <span className="italic" style={{ color: T.accent }}>сами завершили</span> полное приложение.</> })}</h2>{
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: "Antigravity bilan o'z loyihangizda sinang:", ru: "Попробуйте в своём проекте с Antigravity:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "⚠️ Lekin sahifani yangilang — ro'yxatingiz YO'QOLADI! Chunki hammasi faqat xotirada. Keyingi darsda buni hal qilamiz: server — ma'lumot abadiy saqlanadigan joy. 🚀", ru: "⚠️ Но обновите страницу — и ваш список ПРОПАДЁТ! Ведь всё живёт только в памяти. На следующем уроке решим это: сервер — место, где данные хранятся вечно. 🚀" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz — ", ru: "🏅 Ваши значки — " })}{achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
function ReactCrudPracticeLesson({ lang: langProp, onFinished, liveToken }) {
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
    if (_m && _m.scored && _m.scope === "final" && data && data.correct && live.mode === "student") live.submitAnswer(idx, _m.id, 0, true, 0);
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
    progClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    startTimeRef.current = Date.now();
  };
  useEffect4(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, ScreenPractice1, Screen5b, Screen6, ScreenPractice2, Screen7, ScreenPractice3, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenPodium, ScreenFlashcards, Screen15];
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
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
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

        /* === VCARD (CRUD amal tugmasi) === */
        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover { transform: translateY(-1px); }
        .vbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: #fff; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.02em; }
        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        /* F-0912-09 · 147-qonun (m1 da muhrlangan naqsh): matn ⛶ tugmasi burchagini
           AYLANIB o'tadi — faqat tugma yonidagi qator qisqaradi, qolganlari to'liq
           kenglikda qoladi. Tugma o'ngdan 6+30=36px egallaydi, 28px nafas bilan olinadi.
           Ruscha «Показать/Удалить» uzunroq — uz da sig'gan qator ru da tugma ostiga tushadi. */
        .zb-notch::before { content: ''; float: right; width: 28px; height: 28px; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
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

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
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

        /* === PRAKTIKA · CRUD CSS === */
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        /* O'yin kartochkasi */
        .rocard { border-radius: 12px; background: #fff; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.16); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.15s, box-shadow 0.15s; }
        .rothumb { height: 54px; display: flex; align-items: center; justify-content: center; position: relative; }
        .topbadge { position: absolute; top: 4px; left: 6px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 8.5px; color: #fff; background: rgba(14,14,16,0.72); padding: 2px 7px; border-radius: 99px; letter-spacing: 0.04em; }
        .robody { padding: 7px 9px 9px; }
        .roname { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: ${T.ink}; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rostats { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${T.ink3}; font-weight: 600; }
        @keyframes heart-pop { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .hpop { animation: heart-pop 0.4s ease; display: inline-block; }
        /* Kartochka amal tugmalari */
        .cardx { position: absolute; top: 4px; right: 5px; width: 20px; height: 20px; border-radius: 50%; border: none; background: rgba(14,14,16,0.5); color: #fff; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: background 0.15s; z-index: 2; }
        .cardx:hover { background: ${T.danger}; }
        .cardacts { display: flex; gap: 5px; margin-top: 6px; }
        .cardbtn { flex: 1; border: none; background: ${T.bg}; border-radius: 7px; padding: 5px 4px; font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; cursor: pointer; transition: all 0.15s; }
        .cardbtn:hover { background: #EFEBE3; color: ${T.ink}; transform: translateY(-1px); }
        /* Route/qator (loyihalash ro'yxati) */
        .routerow { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 11px; transition: all 0.3s; }
        /* CRUD amal kartalari (loyihalash — tanlanayotgani balandda, yozuv pastda) */
        .opcol { display: flex; flex-direction: column; gap: 9px; }
        .opcard { background: ${T.paper}; border-radius: 13px; padding: 11px 14px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); transition: transform 0.3s cubic-bezier(.34,1.3,.5,1), box-shadow 0.3s, background 0.3s; opacity: 0.62; }
        .opcard-top { display: flex; align-items: center; gap: 9px; }
        .opcard-badge { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; color: #fff; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.02em; flex-shrink: 0; }
        .opcard-amal { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .opcard-tick { margin-left: auto; color: ${T.success}; font-weight: 800; font-size: 14px; }
        .opcard-now { margin-left: auto; font-family: 'Manrope'; font-weight: 800; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; background: ${T.accent}; padding: 3px 8px; border-radius: 99px; }
        .opcard-eff { margin-top: 7px; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 600; }
        .opcard-effdone { color: ${T.success}; display: inline-block; }
        .opcard-q { color: ${T.accent}; }
        .opcard-wait { color: ${T.ink3}; font-style: italic; }
        .opcard.active { opacity: 1; transform: scale(1.04); background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -8px rgba(255,79,40,0.35); }
        .opcard.matched { opacity: 1; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        /* Natija tanlash tugmalari */
        .effbtn { position: relative; width: 100%; text-align: left; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; padding: 13px 15px; border-radius: 11px; border: 1.5px solid rgba(0,0,0,0.08); background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); display: flex; align-items: center; gap: 8px; }
        .effbtn:hover:not(:disabled) { transform: translateY(-1px); border-color: rgba(255,79,40,0.45); box-shadow: 0 8px 18px -6px rgba(255,79,40,0.28); }
        .effbtn.used { background: ${T.successSoft}; border-color: ${T.success}; color: ${T.success}; cursor: default; opacity: 0.85; }
        .effbtn-tick { font-weight: 800; }
        /* Silkinish (xato tanlov / ishlamaydigan tugma) */
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }
        /* VS Code muhiti (yakuniy ekran) */
        .vsc { background: #1E1E1E; border-radius: 13px; overflow: hidden; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.3); }
        .vsc-bar { background: #252526; display: flex; align-items: flex-end; }
        .vsc-tab { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #8B949E; background: #2D2D2D; padding: 8px 14px; display: inline-flex; align-items: center; gap: 6px; }
        .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
        .vsc-body { padding: 12px 14px 14px 8px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13px); color: #D4D4D4; line-height: 2; }
        .vsc-line { display: flex; align-items: center; }
        .vsc-ln { color: #6E7681; min-width: 22px; text-align: right; margin-right: 14px; font-size: 11px; flex-shrink: 0; user-select: none; }
        .vsc-input { background: rgba(0,122,204,0.08); border: 1px dashed #007ACC; border-radius: 6px; color: #E6EDF3; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13px); padding: 4px 9px; outline: none; flex: 1; min-width: 0; transition: border-color 0.2s, background 0.2s; }
        .vsc-input::placeholder { color: #5A6374; }
        .vsc-input.ok { border: 1.5px solid ${T.success}; background: rgba(31,122,77,0.14); }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🐠 TIRIK AKVARIUM === */
        .aq { border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.18); background: #fff; }
        .aq-bar { display: flex; align-items: center; justify-content: space-between; background: #f0eee8; padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink3}; }
        .aq-count { font-weight: 700; color: ${T.ink2}; }
        .aq-water { position: relative; overflow: hidden; background: linear-gradient(180deg, ${T.blueSoft} 0%, #7FC9E8 45%, ${T.blue} 100%); }
        .aq-ray { position: absolute; top: -20%; left: 20%; width: 40px; height: 160%; background: linear-gradient(180deg, rgba(255,255,255,0.35), transparent); transform: rotate(14deg); filter: blur(2px); animation: aq-ray 6s ease-in-out infinite; }
        .aq-ray.r2 { left: 62%; width: 26px; animation-delay: 2s; }
        @keyframes aq-ray { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .aq-fish { position: absolute; font-size: clamp(22px,3vw,30px); filter: drop-shadow(0 3px 5px rgba(0,0,0,0.18)); animation: aq-swim 5s ease-in-out infinite; will-change: transform; }
        @keyframes aq-swim { 0%,100% { transform: translate(0,0) rotate(-3deg); } 50% { transform: translate(10px,-8px) rotate(4deg); } }
        .aq-fish.fed { animation: aq-glow 0.9s ease; filter: drop-shadow(0 0 10px ${T.success}) drop-shadow(0 0 18px ${T.success}); }
        @keyframes aq-glow { 0%,100% { transform: scale(1); } 40% { transform: scale(1.3); } }
        .aq-fish.splash { animation: aq-splash 0.7s cubic-bezier(.34,1.4,.4,1); }
        @keyframes aq-splash { 0% { transform: translateY(-40px) scale(0.4); opacity: 0; } 60% { transform: translateY(4px) scale(1.15); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
        .aq-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-style: italic; color: rgba(255,255,255,0.85); font-size: 13px; }
        .aq-blop { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(14,14,16,0.62); color: #fff; font-family: 'Manrope'; font-weight: 700; font-size: 11px; padding: 4px 11px; border-radius: 99px; animation: aq-blop-up 0.5s cubic-bezier(.34,1.5,.4,1); }
        @keyframes aq-blop-up { 0% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.7); } 55% { opacity: 1; transform: translateX(-50%) translateY(-3px) scale(1.08); } 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        .aq-frost { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 12px;
          background: linear-gradient(135deg, rgba(233,239,243,0.9), rgba(201,213,221,0.94)); backdrop-filter: blur(3px) grayscale(0.35); -webkit-backdrop-filter: blur(3px) grayscale(0.35);
          box-shadow: inset 0 0 0 3px rgba(255,255,255,0.6), inset 0 0 40px rgba(255,255,255,0.5); animation: aq-freeze 0.28s cubic-bezier(.2,.9,.3,1) both; }
        @keyframes aq-freeze { 0% { opacity: 0; transform: scale(1.05); box-shadow: inset 0 0 0 0 rgba(255,255,255,0), inset 0 0 0 rgba(255,255,255,0); } 45% { opacity: 1; } 100% { opacity: 1; transform: scale(1); box-shadow: inset 0 0 0 3px rgba(255,255,255,0.6), inset 0 0 40px rgba(255,255,255,0.5); } }
        .aq-frost-ic { font-size: 34px; animation: aq-frost-pop 0.42s cubic-bezier(.3,1.6,.4,1) both, aq-shiver 2.5s ease-in-out 0.42s infinite; }
        @keyframes aq-frost-pop { 0% { transform: scale(0) rotate(-30deg); } 60% { transform: scale(1.22) rotate(9deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes aq-shiver { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        .aq-frost-t { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: #1B4E66; }
        .aq-frost-t b { color: ${T.danger}; }
        @media (prefers-reduced-motion: reduce) {
          .aq-ray, .aq-fish, .aq-frost-ic, .aq-blop { animation: none !important; }
          .aq-frost { animation: aq-freeze-rm 0.25s ease both; backdrop-filter: grayscale(0.35); -webkit-backdrop-filter: grayscale(0.35); }
          @keyframes aq-freeze-rm { from { opacity: 0; } to { opacity: 1; } }
        }

        /* === 🛠️ JONLI PRAKTIKA (VS Code-uslub, self-report) === */
        .lp-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; border-left: 4px solid ${T.accent}; }
        .lp-task-h { display: flex; align-items: center; gap: 8px; }
        .lp-task-badge { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 10.5px; letter-spacing: 0.12em; color: #fff; background: ${T.accent}; padding: 3px 9px; border-radius: 6px; }
        .lp-steps { display: flex; flex-direction: column; gap: 8px; }
        .lp-step { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; cursor: pointer; transition: all 0.16s; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .lp-check { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; transition: all 0.16s; }
        .lp-step.on .lp-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .lp-step-t { flex: 1; min-width: 0; }
        /* 144-qonun (F-0824-06 naqshi, NodeServerLesson dan): ko'chirib yoziladigan kod.
           Umumiy qcode sinfida white-space nowrap turadi — qisqa chip uchun to'g'ri,
           lekin uzun chip kartadan tashqariga chiqib ketadi (bu darsda 1-bosqich 70 belgi).
           pre-wrap — kodning o'z bo'shliqlari saqlanadi, bo'shliq joyida ko'chadi;
           break-word — bitta uzluksiz so'z qatordan uzun bo'lsa, himoya to'ri;
           liga 0 va calt 0 — ligatura o'chadi, aks holda ikki-uch belgi bitta glifga
           qo'shilib chiziladi va o'quvchi uni klaviaturadan qidiradi. */
        .lp-step .qcode { white-space: pre-wrap; overflow-wrap: break-word; font-feature-settings: "liga" 0, "calt" 0; }
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }
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

        /* ===================== ⚡ JONLI QATLAM CSS (ReactIntro etalonidan) ===================== */
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

        /* ===== 📖 QAYTA TUSHUNTIRISH (recap) ===== */
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }
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
        @media (max-width: 560px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

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


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* === 🛠️ JONLI PRAKTIKA — mentor «kim bajardi» chiplari === */
        .lp-doer { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: rgba(58,53,48,0.07); border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
        .lp-doer.done { color: ${T.success}; background: ${T.successSoft}; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "React praktikasi", ru: "Практика React" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
            </>}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>;
}
export {
  ReactCrudPracticeLesson as default
};
