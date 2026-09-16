// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/4c-Modull/FullPipelineProjectLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/4c-Modull/FullPipelineProjectLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/4c-Modull/FullPipelineProjectLesson.jsx
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

// src/4c-Modull/FullPipelineProjectLesson.jsx
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
var T = {
  bg: "#F6F4EF",
  ink: "#0E0E10",
  ink2: "#5A5A60",
  ink3: "#A7A6A2",
  paper: "#FFFFFF",
  accent: "#FF4F28",
  accentSoft: "#FFE8E1",
  success: "#1F7A4D",
  successSoft: "#E3F0E8",
  blue: "#019ACB",
  blueSoft: "#E2F4FA",
  danger: "#C2362B",
  dangerSoft: "#FAE3E0",
  line: "#E9E6DF",
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
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
var LESSON_META = { lessonId: "cicd-full-pipeline-4c-03-v18", lessonTitle: { uz: "Loyiha kuni — to'liq lentani qurish", ru: "Проектный день — построение полного конвейера" } };
var HW_TOKENS = [
  { t: { uz: "amaliyot", ru: "практика" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "loyiha", ru: "проект" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "mashq", ru: "упражнение" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "natija", ru: "результат" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s3", type: "case", template: "custom", scored: false, scope: null },
  { id: "s4", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s5", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "case", template: "custom", scored: false, scope: null },
  { id: "s7", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s10", type: "case", template: "custom", scored: false, scope: null },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "s13", type: "case", template: "custom", scored: false, scope: null },
  { id: "practice", type: "practice", template: "custom", scored: false, scope: null },
  { id: "podium", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s14", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
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
    const tgt = e.target;
    if (tgt && tgt.closest && tgt.closest(".mentor")) return;
    setMCollapsed(true);
    const isControl = tgt && tgt.closest && tgt.closest("button, input, a, .vcard, .option, .hook-option, .pick-row, .dd-chip, .dbg-line");
    if (!isControl) {
      const el = contentRef.current;
      if (el) setTimeout(() => {
        if (el) el.scrollTo({ top: 0, behavior: "smooth" });
      }, 80);
    }
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
var NavNext = ({ disabled, label = tr2({ uz: "Davom etish", ru: "Продолжить" }), onClick, optionalLive }) => {
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Дождитесь ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : label}</button>;
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
  2: {
    title: { uz: "5 nuqta tartibi — nega ✈️ Uchirish oxirida", ru: "Порядок 5 точек — почему ✈️ Взлёт в конце" },
    cards: [
      { ic: "🧵", h: { uz: "Tartib — himoya ketma-ketligi", ru: "Порядок — цепочка защиты" }, body: { uz: <>Har nuqta o'zidan oldingisiga <b>ishonadi</b>. <span className="mono">Skaner</span> xato topsa, <span className="mono">O'rash</span> va <span className="mono">Uchirish</span> umuman ishga tushmaydi — buzuq yuk yo'lovchiga yetib bormaydi.</>, ru: <>Каждая точка <b>доверяет</b> предыдущей. Если <span className="mono">Сканер</span> нашёл ошибку, <span className="mono">Упаковка</span> и <span className="mono">Взлёт</span> вообще не запускаются — сломанный багаж не доберётся до пассажира.</> }, vis: <RcFlow items={[{ uz: "Yig'ish", ru: "Сборка" }, { uz: "Skaner", ru: "Сканер" }, { uz: "O'lcham ramkasi", ru: "Габарит-рамка" }, { uz: "O'rash", ru: "Упаковка" }, { uz: "Uchirish", ru: "Взлёт" }]} /> },
      { ic: "✈️", h: { uz: "Uchirish — eng oxirgi, chunki qaytarib bo'lmaydi", ru: "Взлёт — последний, потому что его не отменить" }, body: { uz: <>Boshqa nuqtalar xato topsa — tuzatib qayta urinish oson. <b>Uchirish</b>dan keyin yuk yo'lovchi qo'lida — shuning uchun u faqat hammasi tekshirilgach ishga tushadi.</>, ru: <>Если ошибку нашли другие точки — исправить и попробовать снова легко. А после <b>Взлёта</b> багаж уже у пассажира — поэтому он запускается только когда всё проверено.</> } },
      { ic: "🔀", h: { uz: "Tartib teskari bo'lsa — xavfli", ru: "Обратный порядок — опасно" }, body: { uz: <>Agar <b>Uchirish</b> Skanerdan OLDIN tursa, tekshirilmagan buzuq yuk to'g'ridan-to'g'ri yo'lovchiga chiqib ketishi mumkin.</>, ru: <>Если <b>Взлёт</b> стоит ДО Сканера, непроверенный сломанный багаж может улететь прямо к пассажиру.</> }, ask: { uz: "Skaner xato topsa, O'rash nuqtasi ishga tushadimi?", ru: "Если Сканер нашёл ошибку, запустится ли точка Упаковка?" } }
    ]
  },
  5: {
    title: { uz: "YO'L XARITASI — bitta faylda to'liq lenta", ru: "КАРТА МАРШРУТА — весь конвейер в одном файле" },
    cards: [
      { ic: "🗺️", h: { uz: "ci.yml — barcha nuqtalar bitta joyda", ru: "ci.yml — все точки в одном месте" }, body: { uz: <><span className="mono">steps:</span> ostiga 5 nuqta <b>ketma-ket</b> yoziladi. Tartibni almashtirsangiz — lentaning o'zi ham shu tartibda ishlaydi.</>, ru: <>Под <span className="mono">steps:</span> 5 точек записываются <b>по порядку</b>. Поменяете порядок — и сам конвейер будет работать именно в нём.</> } },
      { ic: "🚦", h: { uz: "on: push — START SIGNALI", ru: "on: push — СТАРТ-СИГНАЛ" }, body: { uz: <>Fayl boshida <span className="mono">on: push</span> yozilmasa, lenta hech qachon o'z-o'zidan aylanmaydi — u push signalini kutadi.</>, ru: <>Если в начале файла нет <span className="mono">on: push</span>, конвейер никогда не тронется сам — он ждёт сигнала push.</> } },
      { ic: "📄", h: { uz: "Bitta fayl — alohida repo kerak emas", ru: "Один файл — отдельный репозиторий не нужен" }, body: { uz: <>5 nuqtaning barchasi bitta <span className="mono">ci.yml</span> faylida, bitta <span className="mono">steps:</span> ro'yxatida turadi — har nuqta uchun alohida repozitoriy ochilmaydi.</>, ru: <>Все 5 точек живут в одном файле <span className="mono">ci.yml</span>, в одном списке <span className="mono">steps:</span> — отдельный репозиторий под каждую точку не заводят.</> }, ask: { uz: "on: push yozuvi bo'lmasa, lenta qachon ishga tushadi?", ru: "Если записи on: push нет, когда запустится конвейер?" } }
    ]
  },
  7: {
    title: { uz: "O'lcham ramkasi — nima uchun tushirib bo'lmaydi", ru: "Габарит-рамка — почему её нельзя выкидывать" },
    cards: [
      { ic: "📐", h: { uz: "Sifat filtri", ru: "Фильтр качества" }, body: { uz: <><span className="mono">eslint .</span> kodning uslub qoidalariga mosligini tekshiradi. Bu nuqta bo'lmasa, qoidaga zid kod hech kim tomonidan tutilmay o'tib ketadi.</>, ru: <><span className="mono">eslint .</span> проверяет, соответствует ли код правилам стиля. Без этой точки код, нарушающий правила, никто не поймает — он просто проскочит.</> } },
      { ic: "🔍", h: { uz: "Skaner — mantiq, O'lcham ramkasi — uslub", ru: "Сканер — логика, Габарит-рамка — стиль" }, body: { uz: <>Ikkisi boshqa narsani tekshiradi: <b>Skaner</b> kod ishlaydimi (test), <b>O'lcham ramkasi</b> kod to'g'ri yozilganmi (uslub). Ikkalasi ham kerak.</>, ru: <>Они проверяют разное: <b>Сканер</b> — работает ли код (тесты), <b>Габарит-рамка</b> — правильно ли он написан (стиль). Нужны обе.</> } },
      { ic: "⚙️", h: { uz: "eslint . — buyruqning o'zi", ru: "eslint . — сама команда" }, body: { uz: <><span className="mono">eslint .</span> joriy papkadagi barcha fayllarni uslub qoidalariga qarab tekshiradi — xato topsa, TABLO shu yerda qizil bo'ladi.</>, ru: <><span className="mono">eslint .</span> проверяет все файлы текущей папки по правилам стиля — если найдёт ошибку, ТАБЛО покраснеет именно здесь.</> }, ask: { uz: "Skaner bilan O'lcham ramkasi bir xil narsani tekshiradimi?", ru: "Сканер и Габарит-рамка проверяют одно и то же?" } }
    ]
  },
  9: {
    title: { uz: "Sinov reysi va haqiqiy reys", ru: "Пробный рейс и настоящий рейс" },
    cards: [
      { ic: "🛫", h: { uz: "Sinov reysi (staging) — yo'lovchisiz parvoz", ru: "Пробный рейс (staging) — полёт без пассажиров" }, body: { uz: <>Yangi versiya avval sinov reysida tekshiriladi — u yerda <b>haqiqiy yo'lovchi yo'q</b>, xato chiqsa hech kimga zarar yetmaydi.</>, ru: <>Новая версия сначала проверяется на пробном рейсе — там <b>нет настоящих пассажиров</b>, и если вылезет ошибка, никто не пострадает.</> } },
      { ic: "🌍", h: { uz: "Haqiqiy reys (production) — yo'lovchi qo'lida", ru: "Настоящий рейс (production) — у пассажира" }, body: { uz: <>Sinov reysi yashil bo'lgach, xuddi shu yuk <b>haqiqiy reysga</b> chiqadi — endi uni chinakam foydalanuvchi ko'radi.</>, ru: <>Как только пробный рейс стал зелёным, тот же самый багаж выходит <b>на настоящий рейс</b> — теперь его видит реальный пользователь.</> } },
      { ic: "🔁", h: { uz: "Ikkalasi ham bir lentadan o'tadi", ru: "Оба проходят через один конвейер" }, body: { uz: <>Sinov reysi va haqiqiy reys — ikkalasi ham xuddi shu lentadan o'tadi, faqat sinov reysi avval, xavfsizroq bosqichda turadi.</>, ru: <>И пробный, и настоящий рейс проходят через один и тот же конвейер — просто пробный стоит раньше, на более безопасном этапе.</> }, ask: { uz: "Nega avval sinov reysi, keyin haqiqiy reys?", ru: "Почему сначала пробный рейс и только потом настоящий?" } }
    ]
  },
  12: {
    title: { uz: "Qizil TABLO — jurnal va eski yukni qaytarish", ru: "Красное ТАБЛО — журнал и возврат старого багажа" },
    cards: [
      { ic: "📋", h: { uz: "LENTA JURNALI — sabab shu yerda", ru: "ЖУРНАЛ КОНВЕЙЕРА — причина именно там" }, body: { uz: <>TABLO qizil bo'lsa, avval <b>jurnal o'qiladi</b> — aynan qaysi nuqta va nega to'xtaganini ko'rsatadi. Taxmin qilinmaydi.</>, ru: <>Если ТАБЛО красное, сначала <b>читают журнал</b> — он показывает, какая именно точка и почему остановилась. Никаких догадок.</> }, vis: <RcFlow items={[{ uz: "TABLO qizil", ru: "ТАБЛО красное" }, { uz: "jurnal", ru: "журнал" }, { uz: "sabab topildi", ru: "причина найдена" }]} /> },
      { ic: "⏮️", h: { uz: "Eski yukni qaytarish — tezkor yechim", ru: "Возврат старого багажа — быстрое решение" }, body: { uz: <>Sabab murakkab bo'lsa yoki tezkor yechim kerak bo'lsa, oxirgi <b>yashil versiyaga</b> qaytariladi — yo'lovchi eski, lekin ishlaydigan yukni oladi.</>, ru: <>Если причина сложная или решение нужно срочно, откатываются к последней <b>зелёной версии</b> — пассажир получает старый, но рабочий багаж.</> } },
      { ic: "🛡️", h: { uz: "Maqsad — yo'lovchini himoya qilish", ru: "Цель — защитить пассажира" }, body: { uz: <>Jurnal o'qish ham, eski yukka qaytarish ham bitta maqsadga xizmat qiladi: buzuq versiya yo'lovchi qo'lida uzoq turmasin.</>, ru: <>И чтение журнала, и возврат старого багажа служат одной цели: сломанная версия не должна долго оставаться у пассажира.</> }, ask: { uz: "TABLO qizil bo'lganda birinchi qadam nima?", ru: "Какой первый шаг, когда ТАБЛО красное?" } }
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
        <span className="rc-tag">{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Разбор ещё раз" })}</span>
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
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — едем дальше" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и счёт ✅/❌ скрыты — по кнопке «Открыть результат» всё появится одновременно и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${!isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? `${n} ${tr2({ uz: "o'quvchi", ru: "уч." })} · ${pct}%` : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered >= RECAP_MIN_ANSWERS && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс явно не понял эту тему. Перед тем как идти дальше, стоит коротко её повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Разбор ещё раз — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите тему, прежде чем идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Быстрое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем разобрать её ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef3(Date.now());
  const ou = (o) => o && typeof o === "object" && !React3.isValidElement(o) ? o.uz ?? "" : o;
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: typeof __lang !== "undefined" && __lang === "ru" ? "ru" : "uz" });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — попытка всего одна, сначала подумайте!" })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr2(opt))}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? <>{tr2({ uz: "✓ To'g'ri javob:", ru: "✓ Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете правильный ответ." }) : wrongLocked ? fmtCode(explainWrong[picked] ?? explainWrong.default) : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Быстрое повторение — взглянуть на тему ещё раз" })}</button>}
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> · {tr2({ uz: "ko'rsatmani ochish", ru: "открыть подсказку" })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: "italic" }}>{children}</span>;
var Kw = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
var CodeFile = ({ name, children, minH }) => <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-file">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>;
var Term = ({ title = "Terminal", children, minH }) => <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>;
var TLine = ({ cmd, out, col }) => <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>;
var POINTS = [
  { id: "install", icon: "📦", label: { uz: "Yig'ish", ru: "Сборка" }, cmd: "npm install", d: { uz: "Kerakli paketlarni o'rnatadi — toza muhitda boshlaydi.", ru: "Устанавливает нужные пакеты — начинает с чистой среды." } },
  { id: "test", icon: "🔍", label: { uz: "Skaner", ru: "Сканер" }, cmd: "npm test", d: { uz: "Testlarni ishga tushiradi — kod to'g'ri ishlayaptimi?", ru: "Запускает тесты — правильно ли работает код?" } },
  { id: "lint", icon: "📐", label: { uz: "O'lcham ramkasi", ru: "Габарит-рамка" }, cmd: "eslint .", d: { uz: "Kod qoidalarga mos yozilganini tekshiradi.", ru: "Проверяет, написан ли код по правилам." } },
  { id: "build", icon: "🎁", label: { uz: "O'rash", ru: "Упаковка" }, cmd: "npm run build", d: { uz: "Yukni internetga tayyor holatga o'raydi (optimizatsiya qiladi).", ru: "Упаковывает багаж в готовый для интернета вид (оптимизирует)." } },
  { id: "deploy", icon: "✈️", label: { uz: "Uchirish", ru: "Взлёт" }, cmd: "deploy", d: { uz: "Tayyor yukni internetga — yo'lovchi qo'liga chiqaradi.", ru: "Отправляет готовый багаж в интернет — прямо в руки пассажиру." } }
];
var badgeOf = (s) => s === "pass" ? "✓" : s === "fail" ? "✗" : s === "run" ? "●" : s === "skip" ? "—" : " ";
function pointOkLine(p) {
  const MAP = {
    install: { uz: "▸ 📦 Yig'ish — paketlar o'rnatildi ✓", ru: "▸ 📦 Сборка — пакеты установлены ✓" },
    test: { uz: "▸ 🔍 Skaner — barcha testlar o'tdi ✓", ru: "▸ 🔍 Сканер — все тесты прошли ✓" },
    lint: { uz: "▸ 📐 O'lcham ramkasi — qoidalarga mos ✓", ru: "▸ 📐 Габарит-рамка — правилам соответствует ✓" },
    build: { uz: "▸ 🎁 O'rash — yuk tayyor o'raldi ✓", ru: "▸ 🎁 Упаковка — багаж готов и упакован ✓" },
    deploy: { uz: "▸ ✈️ Uchirish — samolyot ko'tarildi ✓", ru: "▸ ✈️ Взлёт — самолёт поднялся ✓" }
  };
  return tr2(MAP[p.id] || "");
}
var Belt = ({ statuses = {} }) => {
  const runIdx = POINTS.findIndex((p) => statuses[p.id] === "run");
  const passIdx = POINTS.reduce((acc, p, i) => statuses[p.id] === "pass" ? i : acc, -1);
  const failed = POINTS.some((p) => statuses[p.id] === "fail");
  const markerIdx = runIdx >= 0 ? runIdx : passIdx;
  const showMarker = markerIdx >= 0 && !failed;
  const pct = POINTS.length > 1 ? markerIdx / (POINTS.length - 1) * 100 : 0;
  return <div className="pipe-track">
      {showMarker && <span className="pipe-suitcase" style={{ left: `${pct}%` }} aria-hidden="true">🧳</span>}
      <div className="pipe">
        {POINTS.map((p, i) => <React3.Fragment key={p.id}>
            {i > 0 && <span className="pipe-arrow">→</span>}
            <div className={`pipe-step ${statuses[p.id] || ""}`} data-id={p.id}>
              <span className="pipe-ico">{p.icon}</span>
              <span className="pipe-lbl">{tr2(p.label)}</span>
              <span className="pipe-badge">{badgeOf(statuses[p.id])}</span>
            </div>
          </React3.Fragment>)}
      </div>
    </div>;
};
var ALL_PASS = { install: "pass", test: "pass", lint: "pass", build: "pass", deploy: "pass" };
var PhoneMock = ({ state = "old" }) => <div className="phone-mock">
    <div className="phone-body">
      <span className="phone-notch" />
      <div className={`phone-screen ${state}`}>
        <div className="phone-face old-face"><span>🧳</span><p>{tr2({ uz: "Sayt ishlayapti", ru: "Сайт работает" })}</p><span className="phone-ok">{tr2({ uz: "✓ joriy versiya", ru: "✓ текущая версия" })}</span></div>
        <div className="phone-face new-face"><span>🎉</span><p>{tr2({ uz: "Yangi versiya!", ru: "Новая версия!" })}</p><span className="phone-ok">{tr2({ uz: "✓ yangilandi", ru: "✓ обновлено" })}</span></div>
        <div className="phone-face broken-face"><span>💥</span><p>{tr2({ uz: "Sayt buzildi", ru: "Сайт сломался" })}</p><span className="phone-ok">{tr2({ uz: "✗ xato", ru: "✗ ошибка" })}</span></div>
      </div>
    </div>
    <p className="phone-lbl">{tr2({ uz: "📱 foydalanuvchi ekrani", ru: "📱 экран пользователя" })}</p>
  </div>;
var Tablo = ({ ok }) => <span className={`tablo ${ok ? "ok" : "bad"}`}>{ok ? "✓ passing" : "✗ failing"}</span>;
function DragDropOrder({ items, hints, onSolved, doneText, onChange }) {
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
    onChange && onChange(slots);
  }, [slots]);
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
      <div className="dd-slots">
        {slots.map((sid, i) => <div key={i} ref={(el) => slotRefs.current[i] = el} className={`dd-slot ${sid ? "filled" : ""} ${solved && sid ? "ok" : ""} ${wrong && sid && sid !== order[i] ? "bad" : ""}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="dd-hint">{hints ? tr2(hints[i]) : tr2({ uz: "bu yerga joylang", ru: "положите сюда" })}</span>}
          </div>)}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr2({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: "Порядок неверный — нажмите на блок, верните его и разложите заново" })}</span>}
        {pool.map((id) => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, "pool")}>{byId[id].label}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {doneText ? tr2(doneText) : tr2({ uz: "To'g'ri tartib!", ru: "Правильный порядок!" })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr2({ uz: "⚠️ Tartib xato — qayta joylang.", ru: "⚠️ Порядок неверный — разложите заново." })}</div>}
    </div>;
}
function DebugChallenge({ lines, fixed, explain, onSolved, onProgress }) {
  const bugIdx = lines.findIndex((l) => l.bug);
  const [picked, setPicked] = useState3(-1);
  const [wrongIdx, setWrongIdx] = useState3(-1);
  const solved = picked === bugIdx;
  useEffect4(() => {
    if (solved) onSolved && onSolved();
  }, [solved]);
  const click = (i) => {
    if (solved) return;
    if (onProgress) onProgress();
    if (i === bugIdx) setPicked(i);
    else {
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
      {!solved ? <p className="dbg-hint">{tr2({ uz: "👆 Qizil chiroq yongan qatorni toping va bosing", ru: "👆 Найдите строку с красным сигналом и нажмите на неё" })}</p> : <div className="dbg-ok">{tr2({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })} {tr2(explain)}</div>}
    </div>;
}
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
  const [tried, setTried] = useState3(!!storedAnswer);
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState3(0);
  const OPTS = [
    { id: "a", label: { uz: "Har safar 5 nuqtani qo'lda, birma-bir o'zim tekshiraman", ru: "Каждый раз проверяю все 5 точек вручную, одну за другой" } },
    { id: "b", label: { uz: "Bugun to'liq LENTA quraman — push qilsam, qolgani o'zi ishlaydi", ru: "Сегодня строю полный КОНВЕЙЕР — сделал push, а дальше всё работает само" } },
    { id: "c", label: { uz: "Faqat Uchirish nuqtasini tekshiraman, qolganini o'tkazib yuboraman", ru: "Проверяю только точку Взлёт, остальные пропускаю" } }
  ];
  const poke = () => {
    setTried(true);
    setSc((n) => n + 1);
  };
  const pick = (v) => {
    if (picked !== null || !tried) return;
    setPicked(v);
    setSc((n) => n + 1);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: v === "b" });
  };
  return <Stage eyebrow={tr2({ uz: "Loyiha kuni · kirish", ru: "Проектный день · вход" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>1- va 2-darsda nuqtalarni va yo'l xaritasini o'rgandingiz. Bugun — <span className="italic" style={{ color: T.accent }}>loyiha kuni</span>: hammasini o'zingiz birlashtirasiz.</>, ru: <>В уроках 1 и 2 вы изучили точки и карту маршрута. Сегодня — <span className="italic" style={{ color: T.accent }}>проектный день</span>: соединяете всё сами.</> })}</h1>
        <Mentor>{tr2({ uz: "Endi sizning navbatingiz. Bitta real loyihaga — 5 nuqtali to'liq lentani, boshidan oxirigacha, o'zingiz quramiz. Avval qo'lda qanchalik og'ir ekanini eslab ko'ring.", ru: "Теперь ваш ход. Берём один реальный проект и строим полный конвейер из 5 точек — от начала и до конца, своими руками. Но сначала вспомните, как тяжело всё это делать вручную." })}</Mentor>
        <Zoomable><Split>
          <Col>
            <Term title={tr2({ uz: "5 nuqtani qo'lda tekshirish", ru: "Проверка 5 точек вручную" })} minH={155}>
              <TLine cmd="npm install" />
              {tried && <>
                <TLine cmd="npm test" />
                <TLine cmd="eslint ." />
                <TLine cmd="npm run build" />
                <TLine cmd="deploy" />
                <TLine out={tr2({ uz: "✓ 5 buyruq, qo'lda, har push'da qaytadan", ru: "✓ 5 команд, вручную, после каждого push заново" })} col={CODE.str} />
              </>}
            </Term>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={poke} disabled={tried}>{tried ? tr2({ uz: "✓ Qo'lda tekshirildi", ru: "✓ Проверено вручную" }) : tr2({ uz: "▶ 5 nuqtani qo'lda ishga tushirish", ru: "▶ Запустить 5 точек вручную" })}</button>
            {tried && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "5 buyruq, har safar qo'lda — birontasini unutsangiz, xato tekshirilmagan yuk yo'lovchiga chiqib ketishi mumkin. Buni to'liq avtomatlashtirsak-chi?", ru: "5 команд, каждый раз вручную — забудете хоть одну, и непроверенный багаж с ошибкой может улететь к пассажиру. А если автоматизировать всё целиком?" })}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Bugun nima qilamiz?", ru: "Что делаем сегодня?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr2(o.label)}</span></button>;
  })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval qo'lda tekshirishni bosing ←", ru: "Сначала нажмите проверку вручную ←" })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{picked === "b" ? tr2({ uz: <>Aynan! Bugun 5 nuqtani <b>bitta LENTA</b>ga birlashtiramiz, jurnal o'qishni va eski yukni qaytarishni o'rganamiz — va TABLONI o'z repongizga qo'yasiz.</>, ru: <>Именно! Сегодня соединим 5 точек в <b>один КОНВЕЙЕР</b>, научимся читать журнал и возвращать старый багаж — а ТАБЛО вы повесите в свой репозиторий.</> }) : tr2({ uz: <>Qo'lda 5 buyruq — bittasini unutsangiz, yuk tekshirilmay uchadi; faqat Uchirishni tekshirsangiz — avvalgi 4 nuqta ko'r qoladi. Shuning uchun bugun 5 nuqtani <b>bitta LENTA</b>ga birlashtiramiz — push qilsangiz, qolgani o'zi ishlaydi.</>, ru: <>Пять команд вручную — забудете одну, и багаж улетит непроверенным; проверять только Взлёт — значит оставить 4 точки слепыми. Поэтому сегодня соединим 5 точек в <b>один КОНВЕЙЕР</b> — сделали push, а дальше всё работает само.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "5 nuqtani bitta yo'l xaritasida tartib bilan yig'ish", ru: "Выстроить 5 точек по порядку в одной карте маршрута" }, tag: { uz: "LENTA QURUVCHISI", ru: "КОНСТРУКТОР КОНВЕЙЕРА" } },
    { text: { uz: "LENTA JURNALIDAN qizil chiroq sababini topish", ru: "Найти в ЖУРНАЛЕ КОНВЕЙЕРА причину красного сигнала" }, tag: { uz: "jurnal", ru: "журнал" } },
    { text: { uz: "Sinov reysi va haqiqiy reys farqini ko'rish", ru: "Увидеть разницу пробного и настоящего рейса" }, tag: "staging → prod" },
    { text: { uz: "Muammo chiqsa — eski yukni qaytarish", ru: "Если что-то пошло не так — вернуть старый багаж" }, tag: "rollback" },
    { text: { uz: "TABLONI repo sahifasiga qo'yish", ru: "Повесить ТАБЛО на страницу репозитория" }, tag: "README" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const Preview = <Col>
      <p className="flow-label">{tr2({ uz: "Dars oxirida — sizning lentangiz shunday ishlaydi", ru: "К концу урока ваш конвейер будет работать так" })}</p>
      <Belt statuses={ALL_PASS} />
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bitta push → 5 nuqta ketma-ket ishlaydi, hammasi <b style={{ color: T.success }}>yashil ✓</b>, TABLO yashil bo'ladi.</>, ru: <>Один push → 5 точек срабатывают по очереди, всё <b style={{ color: T.success }}>зелёное ✓</b>, ТАБЛО зелёное.</> })}</p></div>
    </Col>;
  const StepsB = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 5 qadam", ru: "Сегодняшние 5 шагов" })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr2(s.text)}</span><span className="step-tag">{tr2(s.tag)}</span></span></li>)}</ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>to'liq lentani</span> qanday quramiz?</>, ru: <>Как сегодня построим <span className="italic" style={{ color: T.accent }}>полный конвейер</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Nazariya tugadi — bugun <b style={{ color: T.ink }}>quramiz</b>. Mana natija va 5 qadam.</>, ru: <>Теория закончилась — сегодня <b style={{ color: T.ink }}>строим</b>. Вот результат и 5 шагов.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{Preview}{StepsB}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>{Preview}<button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "5 qadamni ko'rish", ru: "Посмотреть 5 шагов" })}</button></div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}><button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ Natijani ko'rish", ru: "↩ Посмотреть результат" })}</button>{StepsB}</div>}
      </div>
    </Stage>;
};
var Screen2 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Упражнение · вопрос 1" })}
  questionText="Nega ✈️ Uchirish nuqtasi lentaning oxirida turadi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Nega <span className="mono" style={{ color: T.accent }}>✈️ Uchirish</span> nuqtasi lentaning oxirida turadi?</>, ru: <>Почему точка <span className="mono" style={{ color: T.accent }}>✈️ Взлёт</span> стоит в конце конвейера?</> })}</h2></>}
  options={[{ uz: "Chunki u lentaning eng tez ishlaydigan qismi", ru: "Потому что это самая быстрая часть конвейера" }, { uz: "Chunki avvalgi nuqtalar yukni tekshirib bo'lmasa, uchirish xavfli", ru: "Потому что пока предыдущие точки не проверили багаж, взлетать опасно" }, { uz: "Chunki LENTA MASHINASI faqat eng oxirgi qatorni uchirish deb tushunadi", ru: "Потому что МАШИНА КОНВЕЙЕРА считает взлётом только самую последнюю строку" }, { uz: "Chunki uni boshqa joyga qo'yish texnik jihatdan mumkin emas", ru: "Потому что поставить её в другое место технически невозможно" }]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Skaner, O'lcham ramkasi va O'rash yukni tekshirib, tayyorlab bo'lgandan keyingina uchirish xavfsiz — shuning uchun Uchirish doim oxirida.", ru: "Верно! Взлетать безопасно только после того, как Сканер, Габарит-рамка и Упаковка проверили и подготовили багаж — поэтому Взлёт всегда в конце." })}
  explainWrong={{
    0: tr2({ uz: "Tezlik sabab emas — tartib xavfsizlik uchun shunday.", ru: "Дело не в скорости — такой порядок нужен ради безопасности." }),
    2: tr2({ uz: "LENTA MASHINASI faqat siz yozgan tartibda ishlaydi, o'zidan qaror qabul qilmaydi.", ru: "МАШИНА КОНВЕЙЕРА работает строго в том порядке, что вы записали, — сама она решений не принимает." }),
    3: tr2({ uz: "Texnik jihatdan yozish mumkin — lekin natija xavfli bo'ladi.", ru: "Технически записать можно — но результат будет опасным." }),
    default: tr2({ uz: "To'g'risi — avvalgi nuqtalar tekshirib bo'lmasa, uchirish xavfli.", ru: "Правильный ответ: пока предыдущие точки не проверили багаж, взлетать опасно." })
  }}
/>;
var LOG_LINES = [
  { text: { uz: "▶ 📦 Yig'ish — npm install ................ ✓ 12s", ru: "▶ 📦 Сборка — npm install ................ ✓ 12s" } },
  { text: { uz: "▶ 🔍 Skaner — npm test ..................... ✓ 8s", ru: "▶ 🔍 Сканер — npm test ..................... ✓ 8s" } },
  { text: { uz: "▶ 📐 O'lcham ramkasi — eslint . ............ ✗ 1s  Error: Unexpected token", ru: "▶ 📐 Габарит-рамка — eslint . ............ ✗ 1s  Error: Unexpected token" }, bug: true },
  { text: { uz: "▶ 🎁 O'rash — npm run build ................. — o'tkazib yuborildi", ru: "▶ 🎁 Упаковка — npm run build ................. — пропущено" } },
  { text: { uz: "▶ ✈️ Uchirish — deploy ....................... — o'tkazib yuborildi", ru: "▶ ✈️ Взлёт — deploy ....................... — пропущено" } }
];
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [solved, setSolved] = useState3(!!storedAnswer);
  const [prog, setProg] = useState3(0);
  const done = solved;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, prog);
  return <Stage eyebrow={tr2({ uz: "Amaliyot · LENTA JURNALI", ru: "Практика · ЖУРНАЛ КОНВЕЙЕРА" })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Sababni jurnaldan toping", ru: "Найдите причину в журнале" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>TABLO <span className="italic" style={{ color: T.accent }}>qizil</span>. Sababni jurnaldan toping.</>, ru: <>ТАБЛО <span className="italic" style={{ color: T.accent }}>красное</span>. Найдите причину в журнале.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Push qildingiz, lekin TABLO qizil chiqdi. Taxmin qilmang — <b style={{ color: T.ink }}>LENTA JURNALI</b>ni o'qing. Qaysi nuqtada ✗ turibdi?</>, ru: <>Вы сделали push, а ТАБЛО загорелось красным. Не гадайте — читайте <b style={{ color: T.ink }}>ЖУРНАЛ КОНВЕЙЕРА</b>. У какой точки стоит ✗?</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Jurnalni yuqoridan pastga o'qing: ✓ — nuqta o'tdi, — — o'tkazib yuborildi. O'tkazib yuborilganlar qaysi nuqtadan KEYIN boshlangan? O'sha qatorni bosing.", ru: "💡 Читайте журнал сверху вниз: ✓ — точка прошла, — — пропущена. После какой точки начались пропуски? Нажмите на ту строку." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <DebugChallenge
    lines={LOG_LINES}
    onProgress={() => setProg((p) => p + 1)}
    fixed={{ uz: "▶ 📐 O'lcham ramkasi — eslint . ............ ✓ 2s", ru: "▶ 📐 Габарит-рамка — eslint . ............ ✓ 2s" }}
    explain={{ uz: "O'lcham ramkasi nuqtasida xato bor edi — shu sabab O'rash va Uchirish o'tkazib yuborildi (skip). Nuqta tuzatilgach, qolganlar davom etadi.", ru: "Ошибка была в точке Габарит-рамка — поэтому Упаковку и Взлёт пропустили (skip). Как только точку починят, остальные продолжат." }}
    onSolved={() => {
      if (storedAnswer === void 0) {
        setSolved(true);
        onAnswer(screen, { stage: "case", screenIdx: screen, correct: true, picked: true });
      } else setSolved(true);
    }}
  />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Aynan shunday LENTA JURNALI o'qiladi: qaysi nuqtada ✗, o'sha yerdan boshlab qolganlari o'tkazib yuboriladi.", ru: "Именно так читают ЖУРНАЛ КОНВЕЙЕРА: у какой точки ✗ — с неё все следующие пропускаются." })}</p></div>}
      </div>
    </Stage>;
};
var FullYml = ({ hi }) => <CodeFile name=".github/workflows/ci.yml" minH={220}>
    <At>name</At>{": CI"}{"\n"}
    <At>on</At>{": "}<Kw>push</Kw>{"\n"}
    <At>jobs</At>{":"}{"\n"}
    {"  "}<At>lenta</At>{":"}{"\n"}
    {"    "}<At>runs-on</At>{": ubuntu-latest"}{"\n"}
    {"    "}<At>steps</At>{":"}{"\n"}
    {POINTS.map((p, i) => <span key={p.id} style={{ opacity: hi && hi !== p.id ? 0.4 : 1, display: "block" }}>
        {"      - "}<At>run</At>{": "}<St>{p.cmd}</St>{"   "}<Cm>{`# ${i + 1}. ${tr2(p.label)}`}</Cm>
      </span>)}
  </CodeFile>;
var Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState3(storedAnswer ? new Set(POINTS.map((p) => p.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= POINTS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  const firstUnseen = (POINTS.find((p) => !seen.has(p.id)) || {}).id;
  const tap = (id) => {
    setActive(id);
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const cur = POINTS.find((p) => p.id === active);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · YO'L XARITASI", ru: "Понятие · КАРТА МАРШРУТА" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "5 nuqtani ko'ring", ru: "Посмотрите 5 точек" })} (${seen.size}/5)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta faylda <span className="italic" style={{ color: T.accent }}>5 nuqta</span> — qanday joylashadi?</>, ru: <>Как в одном файле размещаются <span className="italic" style={{ color: T.accent }}>5 точек</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>YO'L XARITASI (<span className="mono">ci.yml</span>) bitta fayl — <span className="mono">steps:</span> ostiga 5 nuqta ketma-ket yoziladi. Boshida <span className="mono">on: push</span> — bu START SIGNALI. Har nuqtani bosib ko'ring.</>, ru: <>КАРТА МАРШРУТА (<span className="mono">ci.yml</span>) — один файл: под <span className="mono">steps:</span> 5 точек записываются по порядку. В начале <span className="mono">on: push</span> — это СТАРТ-СИГНАЛ. Нажмите на каждую точку.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Qolgan nuqtani bosing — chapdagi ci.yml'da uning qatori yorishadi.", ru: "💡 Нажмите оставшуюся точку — слева в ci.yml подсветится её строка." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col><FullYml hi={active} /></Col>
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {POINTS.map((p) => <button key={p.id} className={`gchip ${p.id === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(p.id)} style={seen.has(p.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : void 0}>{p.icon} {tr2(p.label)}</button>)}
            </div>
            {cur ? <div className="sk-info fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.icon}</span>{tr2(cur.label)} <span className="mono" style={{ color: T.ink3, marginLeft: 6, fontSize: 12 }}>{cur.cmd}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Nuqtani bosing ←", ru: "Нажмите на точку ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "on: push (START SIGNALI) → 5 nuqta ketma-ket. Endi shuni o'zingiz yig'asiz.", ru: "on: push (СТАРТ-СИГНАЛ) → 5 точек по очереди. Теперь вы соберёте это сами." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Упражнение · вопрос 2" })}
  questionText="Bitta yo'l xaritasida barcha 5 nuqta qanday tashkil qilinadi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Bitta yo'l xaritasida 5 nuqta <span className="italic" style={{ color: T.accent }}>qanday</span> tashkil qilinadi?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>организуются</span> 5 точек в одной карте маршрута?</> })}</h2></>}
  options={[{ uz: "Har nuqta uchun alohida repozitoriy ochiladi", ru: "Под каждую точку открывается отдельный репозиторий" }, { uz: "Nuqtalar tasodifiy tartibda, navbatsiz yoziladi", ru: "Точки записываются в случайном порядке, без очереди" }, { uz: "Faqat bitta nuqta yoziladi, qolganlari har safar qo'lda bajariladi", ru: "Записывается только одна точка, остальные каждый раз выполняются вручную" }, { uz: "Bitta faylda, steps: ostida to'g'ri tartibda ketma-ket yoziladi", ru: "В одном файле, под steps:, в правильном порядке друг за другом" }]}
  correctIdx={3}
  explainCorrect={tr2({ uz: "To'g'ri! Bitta ci.yml faylida, steps: ostida 5 nuqta ketma-ket yoziladi — LENTA MASHINASI shu tartibda ishlaydi.", ru: "Верно! В одном файле ci.yml, под steps:, 5 точек записываются по порядку — МАШИНА КОНВЕЙЕРА работает именно в нём." })}
  explainWrong={{
    0: tr2({ uz: "Bir loyiha — bitta repo. Nuqtalar shu bitta faylda ketma-ket turadi.", ru: "Один проект — один репозиторий. Точки живут друг за другом в одном файле." }),
    1: tr2({ uz: "Tartib tasodifiy bo'lsa, Uchirish Skanerdan oldin ham chiqib qolishi mumkin — xavfli.", ru: "При случайном порядке Взлёт может оказаться раньше Сканера — это опасно." }),
    2: tr2({ uz: "5 nuqtaning hammasi bitta faylda yoziladi — qo'lda bajarish shart emas.", ru: "Все 5 точек записываются в один файл — вручную ничего выполнять не нужно." }),
    default: tr2({ uz: "To'g'risi — bitta faylda, ketma-ket tartibda.", ru: "Правильный ответ: в одном файле, по порядку." })
  }}
/>;
var CONSEQ = [
  { id: "skip", ico: "🕳️", t: { uz: "Nuqta tushib qolsa", ru: "Если точка выпала" }, d: { uz: "Masalan O'lcham ramkasi umuman yozilmasa — qoidaga zid kod hech kim tomonidan tutilmay to'g'ridan-to'g'ri o'tib ketadi.", ru: "Например, Габарит-рамка вообще не записана — код, нарушающий правила, никто не поймает, он проскочит напрямую." } },
  { id: "order", ico: "🔀", t: { uz: "Tartib teskari bo'lsa", ru: "Если порядок перепутан" }, d: { uz: "Uchirish Skanerdan OLDIN tursa — tekshirilmagan buzuq yuk yo'lovchiga chiqib ketishi mumkin.", ru: "Если Взлёт стоит ДО Сканера — непроверенный сломанный багаж может улететь прямо к пассажиру." } },
  { id: "trigger", ico: "🚦", t: { uz: "on: yozilmasa", ru: "Если on: не записан" }, d: { uz: "START SIGNALI bo'lmasa, lenta push qilinganda ham umuman aylanmaydi — hech narsa ishga tushmaydi.", ru: "Без СТАРТ-СИГНАЛА конвейер не тронется даже после push — вообще ничего не запустится." } },
  { id: "secret", ico: "🔐", t: { uz: "Seyf ulanmasa", ru: "Если СЕЙФ не подключён" }, d: { uz: "Uchirish nuqtasiga maxfiy kalit ulanmasa, deploy 401 xatosi bilan yiqiladi — token yo'q.", ru: "Если к точке Взлёт не подключён секретный ключ, deploy падает с ошибкой 401 — токена нет." } }
];
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seenC, setSeenC] = useState3(storedAnswer ? new Set(CONSEQ.map((c) => c.id)) : /* @__PURE__ */ new Set());
  const [activeC, setActiveC] = useState3(null);
  const [built, setBuilt] = useState3(!!storedAnswer);
  const [ptStatus, setPtStatus] = useState3(storedAnswer ? ALL_PASS : {});
  const [running, setRunning] = useState3(false);
  const [log, setLog] = useState3(storedAnswer ? POINTS.map((p, i) => ({ text: pointOkLine(p), tone: "ok", k: i })) : []);
  const [pushed, setPushed] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const seenAll = seenC.size >= CONSEQ.length;
  const firstUnseenC = (CONSEQ.find((c) => !seenC.has(c.id)) || {}).id;
  const tapC = (id) => {
    setActiveC(id);
    setSeenC((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  const pushLog = (text, tone) => setLog((l) => [...l, { text, tone, k: l.length }]);
  const doPush = () => {
    if (running) return;
    setRunning(true);
    setLog([]);
    setPtStatus({});
    const tick = (i) => {
      if (i >= POINTS.length) {
        pushLog(tr2({ uz: "▸ ✈️ Uchirish — samolyot ko'tarildi ✓", ru: "▸ ✈️ Взлёт — самолёт поднялся ✓" }), "ok");
        setRunning(false);
        setPushed(true);
        setSc((n) => n + 1);
        if (storedAnswer === void 0) onAnswer(screen, { stage: "case", screenIdx: screen, correct: true, picked: true });
        return;
      }
      const p = POINTS[i];
      setPtStatus((st) => ({ ...st, [p.id]: "run" }));
      timer.current = setTimeout(() => {
        setPtStatus((st) => ({ ...st, [p.id]: "pass" }));
        pushLog(pointOkLine(p), "ok");
        setSc((n) => n + 1);
        timer.current = setTimeout(() => tick(i + 1), 130);
      }, 620);
    };
    tick(0);
  };
  const curC = CONSEQ.find((c) => c.id === activeC);
  const done = pushed;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seenC.size + (built ? 1 : 0) + log.length + (pushed ? 1 : 0));
  const navLabel = done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : running ? tr2({ uz: "Lenta aylanmoqda…", ru: "Конвейер крутится…" }) : built ? tr2({ uz: "Lentani yig'ib push qiling", ru: "Соберите конвейер и сделайте push" }) : tr2({ uz: "Avval 5 nuqtani tizing", ru: "Сначала выстройте 5 точек" });
  return <Stage eyebrow={tr2({ uz: "LENTA QURUVCHISI · markaziy", ru: "КОНСТРУКТОР КОНВЕЙЕРА · центральный" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bo'sh yo'l xaritasidan <span className="italic" style={{ color: T.accent }}>siz</span> to'liq lenta quring.</>, ru: <>Постройте полный конвейер из пустой карты маршрута — <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Avval 4 ta xato ssenariysini ko'ring — nima buzilishi mumkinligini biling. Keyin 5 nuqtani <b style={{ color: T.ink }}>to'g'ri tartibda</b> tizib, push qiling.</>, ru: <>Сначала посмотрите 4 сценария ошибок — узнайте, что может сломаться. Потом выстройте 5 точек <b style={{ color: T.ink }}>в правильном порядке</b> и сделайте push.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Avval 4 ssenariyni bosib ko'ring — shundan keyin o'ngda quruvchi ochiladi. Bo'lakni bosing yoki sudrang: har slotdagi ipucha qaysi nuqta kerakligini aytadi. Tartib to'g'ri bo'lgach «▶ git push» chiqadi.", ru: "💡 Сначала нажмите 4 сценария — после этого справа откроется конструктор. Нажимайте или перетаскивайте блоки: подсказка в каждом слоте говорит, какая точка нужна. Когда порядок верный — появится «▶ git push»." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "4 xato ssenariysi — har birini bosing", ru: "4 сценария ошибок — нажмите на каждый" })} ({seenC.size}/4)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CONSEQ.map((c) => <button key={c.id} className={`vcard ${c.id === firstUnseenC ? "tap-hint" : ""}`} onClick={() => tapC(c.id)} style={{ boxShadow: activeC === c.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                  <span className="role-ico">{c.ico}</span>
                  <span className="vlbl">{tr2(c.t)}</span>
                  <span className={`vseen ${seenC.has(c.id) ? "tick" : ""}`} style={{ color: seenC.has(c.id) ? T.success : T.ink3 }}>{seenC.has(c.id) ? "✓" : ""}</span>
                </button>)}
            </div>
            {curC ? <div className="sk-info fade-step" key={activeC}><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(curC.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Ssenariyni bosing ←", ru: "Нажмите на сценарий ←" })}</p></div>}
          </Col>
          <Col>
            {!seenAll ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval 4 ssenariyni ko'ring — keyin lenta quruvchisi ochiladi", ru: "Сначала посмотрите 4 сценария — потом откроется конструктор конвейера" })}</p></div> : <>
                  <p className="flow-label">{tr2({ uz: "5 nuqtani to'g'ri tartibda tizing", ru: "Выстройте 5 точек в правильном порядке" })}</p>
                  <DragDropOrder
    items={POINTS.map((p) => ({ id: p.id, label: `${p.icon} ${tr2(p.label)} — ${p.cmd}` }))}
    hints={[{ uz: "avval nima yig'iladi", ru: "сначала — что собирается" }, { uz: "keyin nima skanerlanadi", ru: "затем — что сканируется" }, { uz: "keyin o'lcham qanday tekshiriladi", ru: "затем — как проверяется габарит" }, { uz: "keyin qanday o'raladi", ru: "затем — как упаковывается" }, { uz: "eng oxiri qanday uchadi", ru: "в самом конце — что взлетает" }]}
    doneText={{ uz: "Tartib to'g'ri! Endi push qiling.", ru: "Порядок верный! Теперь сделайте push." }}
    onSolved={() => setBuilt(true)}
  />
                  {built && !pushed && <button className={`btn ${!running ? "tap-hint" : ""}`} style={{ alignSelf: "flex-start" }} disabled={running} onClick={doPush}>{running ? tr2({ uz: "● Lenta aylanmoqda…", ru: "● Конвейер крутится…" }) : "▶ git push origin main"}</button>}
                  {(running || log.length > 0) && <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <Belt statuses={ptStatus} />
                      <div className="belt-log">
                        {log.length === 0 && <span className="belt-log-empty">{tr2({ uz: "Push qildingiz — jurnal shu yerda yoziladi…", ru: "Push сделан — журнал будет писаться здесь…" })}</span>}
                        {log.map((l) => <div key={l.k} className={`belt-log-line ${l.tone}`}>{l.text}</div>)}
                      </div>
                    </div>}
                  {pushed && <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span className="plane-fly" aria-hidden="true">✈️</span>
                        <PhoneMock state="new" />
                        <Tablo ok />
                      </div>
                      <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "To'liq lenta ishladi — 5 nuqta yashil, samolyot uchdi, TABLO yashil. Loyihangiz o'zi yetkazildi.", ru: "Полный конвейер сработал — 5 точек зелёные, самолёт взлетел, ТАБЛО зелёное. Проект доставился сам." })}</p></div>
                    </div>}
                </>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Упражнение · вопрос 3" })}
  questionText="O'lcham ramkasi nuqtasi lentadan olib tashlansa, real oqibati nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <><span className="mono" style={{ color: T.accent }}>O'lcham ramkasi</span> nuqtasi lentadan olib tashlansa, oqibati nima?</>, ru: <>Если точку <span className="mono" style={{ color: T.accent }}>Габарит-рамка</span> убрать с конвейера — каковы последствия?</> })}</h2></>}
  options={[{ uz: "Qoidaga zid yozilgan kod hech kim tomonidan tutilmay o'tib ketadi", ru: "Код, нарушающий правила, никто не поймает — он проскочит насквозь" }, { uz: "Lenta START SIGNALI kelmagani sababli butunlay ishga tushmay qoladi", ru: "Конвейер вообще не запустится, потому что не придёт СТАРТ-СИГНАЛ" }, { uz: "Testlar ikki barobar sekinroq ishlay boshlaydi", ru: "Тесты начнут работать вдвое медленнее" }, { uz: "Yuk avtomatik ravishda kattaroq hajmda o'raladi", ru: "Багаж автоматически будет упаковываться в больший размер" }]}
  correctIdx={0}
  explainCorrect={tr2({ uz: "To'g'ri! O'lcham ramkasi kod uslub qoidalarini tekshiradi. U bo'lmasa, qoidaga zid kod hech kim tomonidan tutilmay to'g'ridan-to'g'ri O'rash va Uchirish nuqtalariga o'tib ketadi.", ru: "Верно! Габарит-рамка проверяет правила стиля кода. Без неё код, нарушающий правила, никто не поймает — он проскочит прямо к Упаковке и Взлёту." })}
  explainWrong={{
    1: tr2({ uz: "on: push bilan bog'liq emas — bu boshqa nuqta, START SIGNALI unga bog'liq emas.", ru: "Это не связано с on: push — СТАРТ-СИГНАЛ от этой точки не зависит." }),
    2: tr2({ uz: "Tezlikka emas, sifat nazoratiga ta'sir qiladi.", ru: "Это влияет не на скорость, а на контроль качества." }),
    3: tr2({ uz: "O'rash hajmga emas, O'lcham ramkasi esa uslubga tegishli.", ru: "Упаковка не про размер, а Габарит-рамка — про стиль." }),
    default: tr2({ uz: "To'g'risi — qoidaga zid kod tutilmay o'tib ketadi.", ru: "Правильный ответ: код, нарушающий правила, проскочит непойманным." })
  }}
/>;
var FLIGHTS = [
  { id: "staging", ico: "🛫", t: { uz: "Sinov reysi", ru: "Пробный рейс" }, tag: "staging", d: { uz: "Yangi versiya avval shu yerda tekshiriladi. Haqiqiy yo'lovchi yo'q — xato chiqsa hech kimga zarar yetmaydi.", ru: "Новая версия сначала проверяется здесь. Настоящих пассажиров нет — если вылезет ошибка, никто не пострадает." } },
  { id: "prod", ico: "🌍", t: { uz: "Haqiqiy reys", ru: "Настоящий рейс" }, tag: "production", d: { uz: "Sinov reysi yashil bo'lgach, xuddi shu yuk shu yerga chiqadi. Endi uni chinakam foydalanuvchi — yo'lovchi — ko'radi.", ru: "Как только пробный рейс стал зелёным, тот же багаж выходит сюда. Теперь его видит реальный пользователь — пассажир." } }
];
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState3(storedAnswer ? new Set(FLIGHTS.map((f) => f.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= FLIGHTS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  const firstUnseen = (FLIGHTS.find((f) => !seen.has(f.id)) || {}).id;
  const tap = (id) => {
    setActive(id);
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const cur = FLIGHTS.find((f) => f.id === active);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · reys", ru: "Понятие · рейс" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "2 reysni ko'ring", ru: "Посмотрите 2 рейса" })} (${seen.size}/2)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har yuk darhol <span className="italic" style={{ color: T.accent }}>yo'lovchiga</span> chiqmaydi.</>, ru: <>Не всякий багаж сразу попадает <span className="italic" style={{ color: T.accent }}>к пассажиру</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Katta loyihalarda yuk avval <b style={{ color: T.ink }}>sinov reysida</b>, keyingina <b style={{ color: T.ink }}>haqiqiy reysda</b> uchadi. Ikkalasini bosib ko'ring.</>, ru: <>В больших проектах багаж сначала летит <b style={{ color: T.ink }}>пробным рейсом</b> и только потом <b style={{ color: T.ink }}>настоящим</b>. Нажмите на оба.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Qolgan reysni bosing — biri yo'lovchisiz sinov, ikkinchisi haqiqiy.", ru: "💡 Нажмите оставшийся рейс — один пробный без пассажиров, другой настоящий." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FLIGHTS.map((f) => <button key={f.id} className={`vcard ${f.id === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(f.id)} style={{ boxShadow: active === f.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                  <span className="role-ico">{f.ico}</span>
                  <span className="vlbl">{tr2(f.t)}</span>
                  <span className="role-r mono">{f.tag}</span>
                  <span className={`vseen ${seen.has(f.id) ? "tick" : ""}`} style={{ color: seen.has(f.id) ? T.success : T.ink3 }}>{seen.has(f.id) ? "✓" : ""}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="sk-info fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.ico}</span>{tr2(cur.t)} <span className="mono" style={{ color: T.ink3, marginLeft: 6, fontSize: 12 }}>{cur.tag}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Reysni bosing ←", ru: "Нажмите на рейс ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Sinov reysi → xavfsiz tekshiruv. Haqiqiy reys → yo'lovchi qo'lida. Ikkalasi ham lenta orqali avtomatik ishlaydi.", ru: "Пробный рейс → безопасная проверка. Настоящий рейс → у пассажира. Оба работают автоматически, через конвейер." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Упражнение · вопрос 4" })}
  questionText="Sinov reysi (staging) va haqiqiy reys (production) orasidagi asosiy farq nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Sinov reysi va haqiqiy reys orasidagi <span className="italic" style={{ color: T.accent }}>asosiy farq</span> nima?</>, ru: <>В чём <span className="italic" style={{ color: T.accent }}>главная разница</span> между пробным и настоящим рейсом?</> })}</h2></>}
  options={[{ uz: "Sinov reysida kod umuman ishlamaydi", ru: "На пробном рейсе код вообще не работает" }, { uz: "Haqiqiy reysda esa testlar butunlay kerak bo'lmay qoladi", ru: "На настоящем рейсе тесты совсем не нужны" }, { uz: "Sinov reysida haqiqiy yo'lovchi yo'q, xatolarni xavfsiz sinash mumkin", ru: "На пробном рейсе нет настоящих пассажиров — ошибки можно проверять безопасно" }, { uz: "Ular texnik jihatdan bir xil, faqat nomi boshqa", ru: "Технически они одинаковы, отличается только название" }]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri! Sinov reysida haqiqiy foydalanuvchi (yo'lovchi) yo'q — shu yerda xato chiqsa hech kimga zarar yetmaydi. Faqat yashil bo'lgach haqiqiy reysga chiqadi.", ru: "Верно! На пробном рейсе нет настоящего пользователя (пассажира) — ошибка там никому не навредит. Только когда всё зелёное, версия выходит на настоящий рейс." })}
  explainWrong={{
    0: tr2({ uz: "Kod sinov reysida ham to'liq ishlaydi — bu haqiqiy tekshiruv muhiti.", ru: "На пробном рейсе код работает полностью — это настоящая проверочная среда." }),
    1: tr2({ uz: "Testlar ikkala muhitda ham kerak — sinov reysi ularni ishlatishning aynan o'zidir.", ru: "Тесты нужны в обеих средах — пробный рейс как раз и есть их применение." }),
    3: tr2({ uz: "Farq bor: birida haqiqiy yo'lovchi bor, ikkinchisida yo'q.", ru: "Разница есть: на одном рейсе настоящие пассажиры есть, на другом — нет." }),
    default: tr2({ uz: "To'g'risi — sinov reysida yo'lovchi yo'q, xato xavfsiz sinaladi.", ru: "Правильный ответ: на пробном рейсе пассажиров нет, ошибки проверяются безопасно." })
  }}
/>;
var VERSIONS = [
  { id: "v1", ico: "✅", t: { uz: "v1 — narxlash tuzatildi", ru: "v1 — исправлено ценообразование" }, tag: { uz: "yashil", ru: "зелёная" }, ok: true },
  { id: "v2", ico: "✅", t: { uz: "v2 — yangi filtr qo'shildi", ru: "v2 — добавлен новый фильтр" }, tag: { uz: "yashil, oxirgi ishlagan", ru: "зелёная, последняя рабочая" }, ok: true },
  { id: "v3", ico: "🔴", t: { uz: "v3 — xarita integratsiyasi (joriy)", ru: "v3 — интеграция карты (текущая)" }, tag: { uz: "productionda xato chiqardi", ru: "выдала ошибку в production" }, ok: false }
];
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState3(!!storedAnswer);
  const [tries, setTries] = useState3(0);
  const { tip: _tip, rescue: _resc } = useStuckValve(solved, tries);
  const pick = (id) => {
    if (solved) return;
    setPicked(id);
    setTries((t) => t + 1);
    if (id === "v2") {
      setSolved(true);
      if (storedAnswer === void 0) onAnswer(screen, { stage: "case", screenIdx: screen, correct: true, picked: id });
    }
  };
  return <Stage eyebrow={tr2({ uz: "Amaliyot · rollback", ru: "Практика · rollback" })} screen={screen} scrollSignal={solved ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solved && !_resc} label={solved || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "To'g'ri versiyani tanlang", ru: "Выберите правильную версию" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>v3 productionda <span className="italic" style={{ color: T.accent }}>xato</span> chiqardi. Qaysi versiyaga qaytamiz?</>, ru: <>v3 выдала <span className="italic" style={{ color: T.accent }}>ошибку</span> в production. К какой версии откатываемся?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Testlar v3'ni tutmagan — xato faqat haqiqiy yo'lovchida chiqdi. Tezkor yechim: <b style={{ color: T.ink }}>eski yukni qaytarish</b>. Jurnaldan qaysi versiya oxirgi ishlagan versiya ekanini toping.</>, ru: <>Тесты не поймали v3 — ошибка вылезла только у настоящих пассажиров. Быстрое решение: <b style={{ color: T.ink }}>вернуть старый багаж</b>. Найдите в журнале последнюю рабочую версию.</> })}</Mentor>
        {_tip && !solved && <p className="bhint fade-step">{tr2({ uz: "💡 Har versiyaning yorlig'ini o'qing: qaysi biri «oxirgi ishlagan» deb belgilangan? Buzuq v3'dan OLDINGI yashil versiyani qidiring.", ru: "💡 Читайте ярлык каждой версии: какая помечена как «последняя рабочая»? Ищите зелёную версию ПЕРЕД сломанной v3." })}</p>}
        {_resc && !solved && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 4 }}>
          <PhoneMock state={solved ? "old" : "broken"} />
          <p className="small" style={{ margin: 0, color: T.ink2, maxWidth: 360 }}>{solved ? tr2({ uz: "Eski yuk qaytdi — yo'lovchi yana ishlaydigan saytni ko'rmoqda.", ru: "Старый багаж вернулся — пассажир снова видит рабочий сайт." }) : tr2({ uz: "Hozir yo'lovchi ekranida — v3 xatosi.", ru: "Сейчас на экране пассажира — ошибка v3." })}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {VERSIONS.map((v) => {
    const isPicked = picked === v.id;
    const isCorrectPick = solved && v.id === "v2";
    return <button key={v.id} className="vcard" disabled={solved} onClick={() => pick(v.id)} style={{
      boxShadow: isCorrectPick ? `inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.25)` : isPicked && !solved ? `inset 0 0 0 1.5px ${T.accent}` : void 0
    }}>
                <span className="role-ico">{v.ico}</span>
                <span className="vlbl">{tr2(v.t)}</span>
                <span className="role-r mono">{tr2(v.tag)}</span>
              </button>;
  })}
        </div>
        {picked && !solved && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>
            {picked === "v3" ? tr2({ uz: "v3 — bu aynan buzuq, joriy versiya. Unga qaytarib bo'lmaydi.", ru: "v3 — это и есть сломанная, текущая версия. К ней откатиться нельзя." }) : tr2({ uz: "v1 — ishlagan, lekin v2 undan keyin chiqqan va u ham yashil edi. Oxirgi yashil versiyani qidiring.", ru: "v1 работала, но после неё вышла v2 — и она тоже была зелёной. Ищите последнюю зелёную версию." })}
          </p></div>}
        {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>To'g'ri! v2 — buzuq v3'dan oldingi <b>oxirgi yashil versiya</b>. Eski yukni qaytarish — yo'lovchi darhol ishlaydigan sayt oladi, sabab esa keyin xotirjam tekshiriladi.</>, ru: <>Верно! v2 — <b>последняя зелёная версия</b> перед сломанной v3. Возврат старого багажа: пассажир сразу получает рабочий сайт, а причину можно спокойно разобрать потом.</> })}</p></div>}
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [on, setOn] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = on;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, on ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · TABLO", ru: "Понятие · ТАБЛО" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "TABLONI yoqing", ru: "Включите ТАБЛО" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Repo sahifasida <span className="italic" style={{ color: T.accent }}>TABLO</span> qanday ko'rinadi?</>, ru: <>Как выглядит <span className="italic" style={{ color: T.accent }}>ТАБЛО</span> на странице репозитория?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>GitHub repongizning <span className="mono">README.md</span> fayliga bitta rasm-havola qo'yasiz — u lenta holatini jonli ko'rsatadi. Yoqib ko'ring.</>, ru: <>В файл <span className="mono">README.md</span> вашего GitHub-репозитория добавляется одна картинка-ссылка — она показывает состояние конвейера вживую. Включите и посмотрите.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «▶ TABLONI yoqish» tugmasini bosing — o'ngdagi repo sahifasida badge rangi o'zgaradi.", ru: "💡 Нажмите «▶ Включить ТАБЛО» — справа на странице репозитория изменится цвет бейджа." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="README.md" minH={70}>
              <St>{"![CI](https://github.com/user/repo/actions/workflows/ci.yml/badge.svg)"}</St>
            </CodeFile>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={on} onClick={() => {
    setOn(true);
    setSc((n) => n + 1);
  }}>{on ? tr2({ uz: "✓ TABLO yoqildi", ru: "✓ ТАБЛО включено" }) : tr2({ uz: "▶ TABLONI yoqish", ru: "▶ Включить ТАБЛО" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "repo sahifasi", ru: "страница репозитория" })}</p>
            <div className="sk-info" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="note-h" style={{ margin: 0 }}>my-repo</span>
              {on ? <Tablo ok /> : <Tablo ok={false} />}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Endi repo sahifasiga kirgan har kim lenta yashilmi yoki qizilmi — sinamasdan, bir qarashda biladi.", ru: "Теперь каждый, кто зайдёт на страницу репозитория, с одного взгляда видит: конвейер зелёный или красный — без всяких проверок." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  scope="final"
  eyebrow={tr2({ uz: "Yakuniy savol", ru: "Финальный вопрос" })}
  questionText="Production'da yangi versiya muammo chiqarsa va TABLO qizil bo'lib qolsa, birinchi navbatda nima qilinadi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "Yakuniy savol", ru: "Финальный вопрос" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>TABLO <span className="italic" style={{ color: T.accent }}>qizil</span> bo'lib qolsa, birinchi navbatda nima qilinadi?</>, ru: <>Если ТАБЛО стало <span className="italic" style={{ color: T.accent }}>красным</span>, что делают в первую очередь?</> })}</h2></>}
  options={[{ uz: "Repozitoriyning o'zi butunlay o'chirilib, yangidan boshlab loyiha qurilyapti", ru: "Полностью удаляют репозиторий и строят проект заново" }, { uz: "Jurnal o'qilib sabab topiladi, kerak bo'lsa eski yukka qaytariladi", ru: "Читают журнал, находят причину, при необходимости возвращают старый багаж" }, { uz: "Hech narsa qilinmaydi, o'z-o'zidan tuzalib ketadi", ru: "Ничего не делают — само починится" }, { uz: "Faqat TABLO rangini qo'lda yashilga o'zgartiriladi", ru: "Просто вручную перекрашивают ТАБЛО в зелёный" }]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Avval LENTA JURNALI o'qiladi — sabab topiladi. Tezkor yechim kerak bo'lsa, oxirgi yashil versiyaga (eski yukka) qaytariladi.", ru: "Верно! Сначала читают ЖУРНАЛ КОНВЕЙЕРА — находят причину. Если нужно быстрое решение, откатываются к последней зелёной версии (старому багажу)." })}
  explainWrong={{
    0: tr2({ uz: "Repozitoriyni o'chirish shart emas — sabab jurnaldan topiladi, kerak bo'lsa faqat qaytariladi.", ru: "Удалять репозиторий не нужно — причина находится в журнале, при необходимости просто откатываются." }),
    2: tr2({ uz: "O'z-o'zidan tuzalmaydi — sabab topilib, tuzatish yoki qaytarish kerak.", ru: "Само не починится — нужно найти причину и исправить или откатиться." }),
    3: tr2({ uz: "TABLO ranggi lenta natijasidan kelib chiqadi — uni qo'lda o'zgartirib bo'lmaydi.", ru: "Цвет ТАБЛО определяется результатом конвейера — вручную его не поменять." }),
    default: tr2({ uz: "To'g'risi — jurnal o'qilib sabab topiladi, kerak bo'lsa qaytariladi.", ru: "Правильный ответ: читают журнал, находят причину, при необходимости откатываются." })
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [trig, setTrig] = useState3(typeof storedAnswer?.trig === "string" ? storedAnswer.trig : "");
  const [secret, setSecret] = useState3(typeof storedAnswer?.secret === "string" ? storedAnswer.secret : "");
  const [passed, setPassed] = useState3(!!storedAnswer?.correct);
  const tn = trig.toLowerCase().replace(/\s+/g, "");
  const sn = secret.toLowerCase().replace(/\s+/g, "");
  const okTrig = tn === "push";
  const okSecret = sn.includes("secrets.");
  const valid = okTrig && okSecret;
  const { tip: _tip, rescue: _resc } = useStuckValve(passed, trig.length + secret.length);
  useEffect4(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: "case", screenIdx: screen, question: "To'liq lenta: START SIGNALI va SEYF", correct: true, solved: true, picked: `on: ${trig} / secret: ${secret}`, trig, secret });
    }
  }, [valid]);
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} scrollSignal={passed ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed && !_resc} label={passed || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Yo'l xaritasini to'ldiring", ru: "Заполните карту маршрута" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>o'zingiz to'ldiring</span>.</>, ru: <>Последний шаг: <span className="italic" style={{ color: T.accent }}>заполните сами</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: "Ikki bo'sh joy qoldi. 1-joy: lentani nima bosilganda ishga tushirishini yozing (darsning boshida o'rgangan START SIGNALI). 2-joy: tokenni to'g'ridan-to'g'ri emas, SEYFdan qanday o'qishni yozing.", ru: "Осталось два пропуска. 1-й: напишите, по какому событию конвейер запускается (СТАРТ-СИГНАЛ из начала урока). 2-й: напишите, как читать токен не напрямую, а из СЕЙФА." })}</Mentor>
        {_tip && !passed && <p className="bhint fade-step">{tr2({ uz: "💡 1-joy: START SIGNALI — yo'l xaritasi ekranidagi ci.yml ning ikkinchi qatorini eslang (on: …). 2-joy: kalitning o'zini emas, SEYFdan o'qish yozuvini — 2-darsda ko'rgansiz.", ru: "💡 1-й пропуск: СТАРТ-СИГНАЛ — вспомните вторую строку ci.yml с экрана карты маршрута (on: …). 2-й: не сам ключ, а запись чтения из СЕЙФА — вы видели её в уроке 2." })}</p>}
        {_resc && !passed && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: ".github/workflows/ci.yml — bo'sh joyni to'ldiring", ru: ".github/workflows/ci.yml — заполните пропуски" })}</p>
            <div className="editor">
              <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-file">ci.yml</span></div>
              <div className="editor-body">
                <div className="code-line"><pre className="editor-code" style={{ display: "inline" }}>{"on: "}</pre><input className={`code-input inline ${okTrig ? "ok" : ""}`} value={trig} onChange={(e) => setTrig(e.target.value)} placeholder="?" spellCheck={false} autoCapitalize="off" autoCorrect="off" /></div>
                <pre className="editor-code">{"jobs:\n  lenta:\n    steps:\n      - run: npm install\n      - run: npm test\n      - run: eslint .\n      - run: npm run build\n      - run: deploy\n        env:"}</pre>
                <div className="code-line"><pre className="editor-code" style={{ display: "inline" }}>{"          DEPLOY_TOKEN: ${{ "}</pre><input className={`code-input inline ${okSecret ? "ok" : ""}`} value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="?" spellCheck={false} autoCapitalize="off" autoCorrect="off" /><pre className="editor-code" style={{ display: "inline" }}>{" }}"}</pre></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: okTrig ? 1 : 0.4 }}>{okTrig ? "✓" : "1"} {tr2({ uz: "START SIGNALI", ru: "СТАРТ-СИГНАЛ" })}</span>
              <span className="tagpill" style={{ opacity: okSecret ? 1 : 0.4 }}>{okSecret ? "✓" : "2"} {tr2({ uz: "SEYF yozuvi", ru: "запись из СЕЙФА" })}</span>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "natija", ru: "результат" })}</p>
            {passed ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Belt statuses={ALL_PASS} /><Tablo ok /></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "1-joy: lentani ishga tushiradigan hodisa nomi. 2-joy: SEYFdan o'qish yozuvi.", ru: "1-й пропуск: имя события, запускающего конвейер. 2-й: запись чтения из СЕЙФА." })}</p></div>}
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ Tabriklaymiz! To'liq lenta tayyor: 5 nuqta, START SIGNALI va SEYFdagi maxfiy kalit bilan. Har push'da o'zi ishlaydi.", ru: "✓ Поздравляем! Полный конвейер готов: 5 точек, СТАРТ-СИГНАЛ и секретный ключ из СЕЙФА. Теперь он работает сам при каждом push." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var PRACTICE_BASE = 500;
var MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState3({ players: null, doneIds: /* @__PURE__ */ new Set() });
  const isMentor = !!(live && live.mode === "mentor" && live.pin);
  useEffect4(() => {
    if (!isMentor) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map((r) => r.player_id)) });
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
  if (!isMentor || !data.players || data.players.length === 0) return null;
  const total = data.players.length;
  const doers = data.players.filter((p) => data.doneIds.has(p.id));
  const waiting = data.players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr2({ uz: "👀 Kim bajardi —", ru: "👀 Кто выполнил —" })} <b>{doers.length}</b>/{total}</div>
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
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext2(LiveGateCtx) || {};
  const _live = live || _gate.live;
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
  return <Stage eyebrow={tr2({ uz: "Amaliyot · VS Code", ru: "Практика · VS Code" })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval bajaring", ru: "Сначала выполните" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2(title)}</h2></div>
        <Mentor>{tr2({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник наблюдает.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr2({ uz: "TOPSHIRIQ", ru: "ЗАДАНИЕ" })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr2(task)}</p>
            </div>
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
            <button className={`lp-done-btn ${done ? "is-done" : ""}`} disabled={done} onClick={complete}>
              {done ? tr2({ uz: "✓ Bajarildi — ustozni kuting", ru: "✓ Выполнено — дождитесь наставника" }) : tr2({ uz: "✅ Bajardim", ru: "✅ Готово" })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: "Отлично! Задание выполнено. Наставник проверит и переведёт вас к следующему шагу." })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>;
}
var ScreenFullPipelinePractice = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "O'z loyihangizga to'liq lentani ulang", ru: "Подключите полный конвейер к своему проекту" }}
  task={{ uz: "VS Code'da o'z repongizga to'liq beshta nuqtali lentani qo'shing: Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish. Push qiling, GitHub'da lenta yashil bo'lishini kuting, so'ng TABLONI README'ga qo'ying.", ru: "В VS Code добавьте в свой репозиторий конвейер из пяти точек: Сборка, Сканер, Габарит-рамка, Упаковка, Взлёт. Сделайте push, дождитесь на GitHub зелёного конвейера, затем повесьте ТАБЛО в README." }}
  checklist={[
    { uz: "`.github/workflows/ci.yml` faylini oching (yo'q bo'lsa yarating)", ru: "Откройте файл `.github/workflows/ci.yml` (если его нет — создайте)" },
    { uz: "`on: push` va `runs-on: ubuntu-latest` yozilganini tekshiring", ru: "Проверьте, что записаны `on: push` и `runs-on: ubuntu-latest`" },
    { uz: "`steps:` ostiga 5 nuqtani ketma-ket yozing: install → test → lint (masalan `eslint .`) → build → deploy", ru: "Под `steps:` запишите 5 точек по порядку: install → test → lint (например `eslint .`) → build → deploy" },
    { uz: "Deploy nuqtasiga maxfiy kalitni `${{ secrets.NOM }}` orqali ulang", ru: "Подключите к точке deploy секретный ключ через `${{ secrets.NOM }}`" },
    { uz: "Push qiling, Actions bo'limida barcha nuqta yashil bo'lguncha kuzating, so'ng TABLONI README.md ga joylashtiring", ru: "Сделайте push, дождитесь в разделе Actions, пока все точки станут зелёными, затем поместите ТАБЛО в README.md" }
  ]}
/>;
var PIPE_FLASHCARDS = [
  { front: { uz: "Lenta qanday ishlashi qaysi faylda yozilgan?", ru: "В каком файле записано, как работает конвейер?" }, back: "ci.yml", note: { uz: "Yo'l xaritasi: 5 nuqtaning hammasi shu faylda turadi", ru: "Карта маршрута: все 5 точек лежат в этом файле" } },
  { front: { uz: "Push bo'lganda lentani nima ishga tushiradi?", ru: "Что запускает конвейер, когда сделан push?" }, back: "on: push", note: { uz: "START SIGNALI: busiz lenta hech qachon aylanmaydi", ru: "СТАРТ-СИГНАЛ: без него конвейер никогда не тронется" } },
  { front: { uz: "Lentaning 5 nuqtasidan qaysi biri eng oxirida turadi?", ru: "Какая из 5 точек конвейера стоит самой последней?" }, back: { uz: "Uchirish", ru: "Взлёт" }, note: { uz: "Uchgan yukni qaytarib bo'lmaydi, shuning uchun u eng oxirida", ru: "Улетевший багаж не вернуть, поэтому он в самом конце" } },
  { front: { uz: "Skaner nuqtasi kodning nimasini tekshiradi?", ru: "Что проверяет точка Сканер?" }, back: { uz: "Kod ishlaydimi", ru: "Работает ли код" }, note: { uz: "npm test buyrug'i mantiqni tekshiradi", ru: "Команда npm test проверяет логику" } },
  { front: { uz: "O'lcham ramkasi kodning nimasini tekshiradi?", ru: "Что проверяет точка Габарит-рамка?" }, back: { uz: "Uslubini", ru: "Стиль" }, note: { uz: "eslint . buyrug'i kod qoidaga mos yozilganini ko'radi", ru: "Команда eslint . смотрит, написан ли код по правилам" } },
  { front: { uz: "Skaner xato topsa, keyingi nuqtalar ishga tushadimi?", ru: "Если Сканер нашёл ошибку, запустятся ли следующие точки?" }, back: { uz: "Yo'q", ru: "Нет" }, note: { uz: "Buzuq yuk shu yerda to'xtaydi, yo'lovchiga yetib bormaydi", ru: "Сломанный багаж останавливается здесь и не доедет до пассажира" } },
  { front: { uz: "Maxfiy kalitni ci.yml faylida qanday chaqirasiz?", ru: "Как вы вызываете секретный ключ в файле ci.yml?" }, back: "${{ secrets.NOM }}", note: { uz: "Kalit seyfdan olinadi, ochiq matn sifatida yozilmaydi", ru: "Ключ берётся из сейфа, открытым текстом его не пишут" } },
  { front: { uz: "Haqiqiy yo'lovchisiz sinab ko'riladigan muhit qanday ataladi?", ru: "Как называется среда, где всё проверяют без настоящих пассажиров?" }, back: "staging", note: { uz: "Sinov reysi: xato chiqsa ham hech kim zarar ko'rmaydi", ru: "Пробный рейс: даже если вылезет ошибка, никто не пострадает" } },
  { front: { uz: "Foydalanuvchi haqiqatan ishlatadigan muhit qanday ataladi?", ru: "Как называется среда, которой реально пользуется пользователь?" }, back: "production", note: { uz: "Haqiqiy reys: yuk endi yo'lovchi qo'lida", ru: "Настоящий рейс: багаж уже у пассажира" } },
  { front: { uz: "Yangi versiya productionda buzilsa, tezkor yechim qanday ataladi?", ru: "Новая версия сломалась в production — как называется быстрое решение?" }, back: "rollback", note: { uz: "Eski yukni qaytarish: oxirgi yashil versiyaga qaytasiz", ru: "Возврат старого багажа: вы откатываетесь к последней зелёной версии" } },
  { front: { uz: "Repo sahifasida lenta yashilmi yoki qizilmi ekanini nima ko'rsatadi?", ru: "Что показывает на странице репозитория, зелёный конвейер или красный?" }, back: "status badge", note: { uz: "TABLO: holat bir qarashda ko'rinadi", ru: "ТАБЛО: состояние видно с одного взгляда" } },
  { front: { uz: "TABLO qizil bo'lganda birinchi qadam nima?", ru: "ТАБЛО покраснело — какой первый шаг?" }, back: { uz: "Jurnalni o'qish", ru: "Прочитать журнал" }, note: { uz: "Jurnal qaysi nuqta va nega to'xtaganini aytadi, taxmin qilinmaydi", ru: "Журнал скажет, какая точка и почему встала — гадать не нужно" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PIPE_FLASHCARDS} /></div>
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda", ru: "↻ Учим" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
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
var ACHIEVEMENTS = {
  blackBox: { icon: "📼", name: "Black Box", desc: { uz: "LENTA JURNALIDAN qizil chiroq sababini topdingiz", ru: "Вы нашли в ЖУРНАЛЕ КОНВЕЙЕРА причину красного сигнала" } },
  pipelineArchitect: { icon: "🏗️", name: "Pipeline Architect", desc: { uz: "5 nuqtani tizib, lentani ishga tushirdingiz", ru: "Вы выстроили 5 точек и запустили конвейер" } },
  safeReturn: { icon: "↩️", name: "Safe Return", desc: { uz: "Oxirgi yashil versiyaga to'g'ri qaytardingiz", ru: "Вы правильно откатились к последней зелёной версии" } },
  boardingComplete: { icon: "🎫", name: "Boarding Complete", desc: { uz: "Yakuniy savolda bilimingizni tasdiqladingiz", ru: "Вы подтвердили знания в финальном вопросе" } }
};
var ACH_TRIGGERS = { s3: "blackBox", s6: "pipelineArchitect", s10: "safeReturn", s12: "boardingComplete" };
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
      <Confetti />
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
var Q_LABELS = { 2: { uz: "1 — Nuqta tartibi", ru: "1 — Порядок точек" }, 5: { uz: "2 — Yo'l xaritasi", ru: "2 — Карта маршрута" }, 7: { uz: "3 — O'lcham ramkasi", ru: "3 — Габарит-рамка" }, 9: { uz: "4 — Sinov vs haqiqiy reys", ru: "4 — Пробный vs настоящий рейс" }, 12: { uz: "5 — Yakuniy", ru: "5 — Финальный" } };
var INLINE_KEYS = { s2: 1, s5: 3, s7: 0, s9: 2, s12: 1, practice: -1 };
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "on: push", l: 5, t: 10, s: 24, c: "rgba(120,235,175,0.16)", d: 19, dl: 0 },
  { ch: "secrets", l: 84, t: 7, s: 30, c: "rgba(80,200,255,0.14)", d: 23, dl: 1.5 },
  { ch: "TABLO", l: 8, t: 72, s: 24, c: "rgba(232,161,58,0.15)", d: 27, dl: 0.8 },
  { ch: "rollback", l: 80, t: 68, s: 30, c: "rgba(255,110,70,0.14)", d: 21, dl: 2.2 },
  { ch: "staging", l: 44, t: 86, s: 28, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "401", l: 62, t: 26, s: 32, c: "rgba(80,200,255,0.13)", d: 17, dl: 0.4 },
  { ch: "NUQTA", l: 26, t: 34, s: 32, c: "rgba(255,110,70,0.14)", d: 20, dl: 1.9 },
  { ch: "AMAL", l: 55, t: 5, s: 30, c: "rgba(203,173,255,0.12)", d: 22, dl: 0.6 },
  { ch: "runs-on", l: 89, t: 42, s: 20, c: "rgba(232,161,58,0.13)", d: 24, dl: 1.3 },
  { ch: "ci.yml", l: 2, t: 45, s: 26, c: "rgba(80,200,255,0.10)", d: 26, dl: 2.6 },
  { ch: "production", l: 36, t: 58, s: 24, c: "rgba(255,110,70,0.11)", d: 28, dl: 0.9 },
  { ch: "404", l: 70, t: 90, s: 28, c: "rgba(203,173,255,0.12)", d: 18, dl: 2 }
];
var QUIZ_BANK = [
  { q: { uz: "To'liq lentada 5 nuqta qaysi tartibda ishlaydi?", ru: "В каком порядке работают 5 точек полного конвейера?" }, opts: [{ uz: "Uchirish, so'ng Yig'ish, Skaner, O'rash, O'lcham ramkasi", ru: "Взлёт, затем Сборка, Сканер, Упаковка, Габарит-рамка" }, { uz: "Skaner, Yig'ish, O'rash, O'lcham ramkasi, Uchirish", ru: "Сканер, Сборка, Упаковка, Габарит-рамка, Взлёт" }, { uz: "O'rash, Skaner, Yig'ish, Uchirish, O'lcham ramkasi", ru: "Упаковка, Сканер, Сборка, Взлёт, Габарит-рамка" }, { uz: "Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish", ru: "Сборка, Сканер, Габарит-рамка, Упаковка, Взлёт" }], correct: 3 },
  { q: { uz: "`on: push` yozuvi lentada nima vazifani bajaradi?", ru: "Что делает запись `on: push` в конвейере?" }, opts: [{ uz: "Push bo'lganda lentani avtomatik ishga tushiradi", ru: "Автоматически запускает конвейер при push" }, { uz: "Testlarni doimiy ravishda butunlay o'chirib qo'yadi", ru: "Навсегда полностью отключает тесты" }, { uz: "Maxfiy kalitni doimiy saqlab turadi", ru: "Постоянно хранит секретный ключ" }, { uz: "Faylni to'g'ridan-to'g'ri serverga nusxalaydi", ru: "Копирует файл напрямую на сервер" }], correct: 0 },
  { q: { uz: "📐 O'lcham ramkasi nuqtasi lentadan olib tashlansa nima bo'ladi?", ru: "Что будет, если убрать с конвейера точку 📐 Габарит-рамка?" }, opts: [{ uz: "Lenta hech qanday ogohlantirishsiz ishga tushmay qoladi", ru: "Конвейер перестанет запускаться без всякого предупреждения" }, { uz: "Testlar ikki marta ketma-ket ishga tushib ketadi", ru: "Тесты начнут запускаться дважды подряд" }, { uz: "Kod qoidaga zid yozilsa ham hech kim tutmaydi", ru: "Даже если код нарушает правила, его никто не поймает" }, { uz: "Yuk hech qachon avtomatik ravishda o'ralmay qoladi", ru: "Багаж больше никогда не будет упаковываться автоматически" }], correct: 2 },
  { q: { uz: "Tartib teskari bo'lib, ✈️ Uchirish 🔍 Skanerdan OLDIN tursa nima bo'ladi?", ru: "Что будет, если порядок перепутан и ✈️ Взлёт стоит ДО 🔍 Сканера?" }, opts: [{ uz: "Hech narsa o'zgarmaydi, natija bir xil", ru: "Ничего не изменится, результат тот же" }, { uz: "Tekshirilmagan buzuq yuk yo'lovchiga chiqib ketadi", ru: "Непроверенный сломанный багаж улетит к пассажиру" }, { uz: "Lenta buyruqni o'zi to'g'irlab qo'yadi", ru: "Конвейер сам исправит команду" }, { uz: "Faqat jurnalga ogohlantirish yoziladi, lekin deploy baribir bo'lmaydi", ru: "В журнал запишется предупреждение, но deploy всё равно не случится" }], correct: 1 },
  { q: { uz: "Maxfiy kalitni ci.yml faylida qanday ishlatamiz?", ru: "Как мы используем секретный ключ в файле ci.yml?" }, opts: [{ uz: "`${{ secrets.NOM }}` orqali SEYFdan xavfsiz olamiz", ru: "Безопасно берём из СЕЙФА через `${{ secrets.NOM }}`" }, { uz: "Kodning o'zi ichiga doimiy o'zgaruvchi sifatida qo'shib qo'yamiz", ru: "Вписываем прямо в код как постоянную переменную" }, { uz: "Har safar qo'lda terib, push oldidan yuboramiz", ru: "Каждый раз набираем вручную и отправляем перед push" }, { uz: "To'g'ridan-to'g'ri ochiq matn sifatida yozamiz", ru: "Пишем открытым текстом напрямую" }], correct: 0 },
  { q: { uz: "Sinov reysi (staging) nima uchun kerak?", ru: "Зачем нужен пробный рейс (staging)?" }, opts: [{ uz: "Yo'lovchilar sonini hisoblash uchun", ru: "Чтобы считать количество пассажиров" }, { uz: "Lentani butunlay to'xtatish uchun", ru: "Чтобы полностью остановить конвейер" }, { uz: "Maxfiy kalitlarni doimiy ravishda ochiq ko'rsatish uchun", ru: "Чтобы постоянно показывать секретные ключи открыто" }, { uz: "Haqiqiy yo'lovchisiz, xatolarni oldindan sinash uchun", ru: "Чтобы заранее проверять ошибки без настоящих пассажиров" }], correct: 3 },
  { q: { uz: "Production (haqiqiy reys) sinov reysidan nimasi bilan farq qiladi?", ru: "Чем production (настоящий рейс) отличается от пробного?" }, opts: [{ uz: "U yerda hech qanday kod ishlab turmaydi, hammasi o'chirilgan", ru: "Там никакой код не работает, всё отключено" }, { uz: "U yerda haqiqiy yo'lovchi (foydalanuvchi) bor", ru: "Там есть настоящий пассажир (пользователь)" }, { uz: "U yerda test umuman o'tkazilmaydi", ru: "Там вообще не проводятся тесты" }, { uz: "U faqat mentor ekranida ko'rinadi", ru: "Он виден только на экране ментора" }], correct: 1 },
  { q: { uz: "Yangi versiya production'da xato chiqarsa, tezkor yechim nima?", ru: "Новая версия выдала ошибку в production — какое быстрое решение?" }, opts: [{ uz: "Butun repozitoriyni o'chirib tashlash", ru: "Удалить весь репозиторий" }, { uz: "Barcha o'quvchilarga xabar yuborish", ru: "Разослать сообщение всем ученикам" }, { uz: "Eski yukni qaytarish (rollback)", ru: "Вернуть старый багаж (rollback)" }, { uz: "Lentani butunlay o'chirib qo'yish", ru: "Полностью выключить конвейер" }], correct: 2 },
  { q: { uz: "Eski yukni qaytarish (rollback) qachon eng to'g'ri qaror bo'ladi?", ru: "Когда возврат старого багажа (rollback) — самое верное решение?" }, opts: [{ uz: "Push hali qilinmagan paytda", ru: "Когда push ещё не сделан" }, { uz: "Lenta hali umuman ishga tushirilmagan holatda turgan paytda", ru: "Когда конвейер ещё вообще не запускался" }, { uz: "Test hali yashil ko'rinib turgan paytda", ru: "Когда тесты ещё горят зелёным" }, { uz: "Yangi versiya productionda muammo chiqarganda", ru: "Когда новая версия создала проблему в production" }], correct: 3 },
  { q: { uz: "TABLO (status badge) repo sahifasida nimani ko'rsatadi?", ru: "Что показывает ТАБЛО (status badge) на странице репозитория?" }, opts: [{ uz: "Lenta hozir yashilmi yoki qizilmi ekanini", ru: "Зелёный сейчас конвейер или красный" }, { uz: "Loyihaning umumiy og'irligini", ru: "Общий вес проекта" }, { uz: "Nechta o'quvchi bu darsni to'liq tugatib ulgurganini", ru: "Сколько учеников успело полностью пройти этот урок" }, { uz: "Serverning geografik joylashuvini", ru: "Географическое расположение сервера" }], correct: 0 },
  { q: { uz: "LENTA JURNALIDA qizil chiroq ko'rinsa, birinchi navbatda nima qilinadi?", ru: "В ЖУРНАЛЕ КОНВЕЙЕРА виден красный сигнал — что делают в первую очередь?" }, opts: [{ uz: "Darhol butun lentani o'chirib tashlanadi", ru: "Немедленно удаляют весь конвейер" }, { uz: "Jurnal o'qilib, qaysi nuqta va nega to'xtaganini topiladi", ru: "Читают журнал и находят, какая точка и почему остановилась" }, { uz: "Kod hech qayerga tegilmasdan yana bir bor push qilib yuboriladi", ru: "Ничего не трогая, просто делают push ещё раз" }, { uz: "Mentordan yangi maxfiy kalit so'raladi", ru: "Просят у ментора новый секретный ключ" }], correct: 1 },
  { q: { uz: "Bitta yo'l xaritasida ikkita mustaqil nuqta parallel ishlasa, ular bir-biriga qanday ta'sir qiladi?", ru: "Две независимые точки в одной карте маршрута работают параллельно — как они влияют друг на друга?" }, opts: [{ uz: "Biri albatta ikkinchisini to'xtatadi", ru: "Одна обязательно остановит другую" }, { uz: "Ular hech qachon parallel bo'lmaydi, doim navbat bilan ketma-ket ishlaydi", ru: "Они никогда не работают параллельно, всегда строго по очереди" }, { uz: "Mustaqil — biri yiqilsa, ikkinchisi baribir davom etadi", ru: "Они независимы — если одна упала, вторая всё равно продолжит" }, { uz: "Faqat birinchisi natija beradi", ru: "Результат даёт только первая" }], correct: 2 }
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
          <span className="cs-hud-i">🏆 PODIUM</span>
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
    const TOK = ["on: push", "secrets", "TABLO", "rollback", "staging", "NUQTA", "AMAL", "ci.yml", "401"];
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

      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест сами:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Дождитесь, пока ментор начнёт тест…" })}</p>}
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Мимо — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Побыстрее! ⏱" })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Следующий →" })}</button>}
        </div>}

      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr2({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
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
                      {b && <span className="qz-pod-pts">{b.pts} {tr2({ uz: "ball", ru: "баллов" })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>;
  })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{myRank + 1}{tr2({ uz: "-o'rin", ru: "-е место" })}</b> · {board[myRank].pts} {tr2({ uz: "ball", ru: "баллов" })}</p>}
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
            <div className="frame-wait" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. В живом уроке здесь появляется рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-wait fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{myIdx + 1}{tr2({ uz: "-o'rin", ru: "-е место" })}</b> ({board[myIdx].okCount}/{totalQ} {tr2({ uz: "to'g'ri", ru: "верно" })})</p>}
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
var Screen14 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "To'liq lentani 5 nuqtada qurdingiz: Yig'ish → Skaner → O'lcham ramkasi → O'rash → Uchirish", ru: "Вы построили полный конвейер из 5 точек: Сборка → Сканер → Габарит-рамка → Упаковка → Взлёт" },
    { uz: "Tartib va START SIGNALI (on: push) nega muhimligini bilasiz", ru: "Вы знаете, почему важны порядок и СТАРТ-СИГНАЛ (on: push)" },
    { uz: "Maxfiy kalitni SEYFda saqlash va lentaga ulashni ko'rdingiz", ru: "Вы видели, как хранить секретный ключ в СЕЙФЕ и подключать его к конвейеру" },
    { uz: "Sinov reysi (staging) va haqiqiy reys (production) farqini ajratasiz", ru: "Вы различаете пробный рейс (staging) и настоящий рейс (production)" },
    { uz: "Muammo chiqsa — jurnalni o'qib, kerak bo'lsa eski yukni qaytarasiz", ru: "Если что-то сломалось — читаете журнал и при необходимости возвращаете старый багаж" },
    { uz: "TABLONI repo sahifasiga qo'yishni bilasiz", ru: "Вы умеете вешать ТАБЛО на страницу репозитория" }
  ];
  const HOMEWORK = [
    { b: { uz: "Ulang", ru: "Подключите" }, t: { uz: "— o'z loyihangizga to'liq 5-nuqtali lentani qo'shing va push qiling", ru: "— добавьте в свой проект полный конвейер из 5 точек и сделайте push" } },
    { b: { uz: "Kuzating", ru: "Проследите" }, t: { uz: "— Actions bo'limida barcha nuqta yashil bo'lishini tasdiqlang", ru: "— убедитесь в разделе Actions, что все точки зелёные" } },
    { b: { uz: "Ko'rsating", ru: "Покажите" }, t: { uz: "— TABLONI README.md ga qo'yib, mentorga repo havolasini yuboring", ru: "— повесьте ТАБЛО в README.md и отправьте ментору ссылку на репозиторий" } }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Modulni yakunlash ✓", ru: "Завершить модуль ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "To'liq lentani qurdingiz", ru: "Вы построили полный конвейер" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Loyihangiz endi <span className="italic" style={{ color: T.accent }}>o'zi uchadi</span>.</>, ru: <>Теперь ваш проект <span className="italic" style={{ color: T.accent }}>летает сам</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Дождитесь ментора" }) : void 0} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{tr2(h.b)}</b> <span className="t">{tr2(h.t)}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "🚀 Endi siz istalgan loyihaga to'liq lentani o'zingiz ulay olasiz!", ru: "🚀 Теперь вы сами можете подключить полный конвейер к любому проекту!" })}</p></div>}
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
function FullPipelineProjectLesson({ lang: langProp, onFinished, liveToken }) {
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
  };
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect4(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenFullPipelinePractice, ScreenPodium, ScreenFlashcards, Screen14];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }
        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 14px; font-size: 12.5px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.6; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); }
        .tagpill { font-family: 'JetBrains Mono'; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope'; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: ow-breathe 1.9s ease-in-out infinite; }
        @keyframes ow-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 30px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; } .role-r { font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope'; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; } .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.24); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }
        /* 🔓 klapan ipuchasi (m4-08 bilan bir xil): .bhint — ipucha, .bhint.calm — «Davom etish» ochildi */
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.accent}; flex-shrink: 0; min-width: 38px; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }

        /* VS CODE EDITOR */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        /* F-0820-307: fayl-nomi YORLIG'I (bosilmaydi) — «tab» nomi tugma taassurotini berardi (4b-01 F-258 pretsedenti) */
        .editor-file { font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.text}; background: ${CODE.bg}; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .code-line { display: flex; align-items: center; flex-wrap: wrap; }
        .code-input { display: block; width: 100%; margin: 2px 0; background: rgba(0,122,204,0.12); border: 1px dashed #4FA8D8; border-radius: 6px; color: ${CODE.text}; font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); padding: 7px 9px; outline: none; }
        .code-input.ok { border: 1.5px solid ${T.success}; background: rgba(31,122,77,0.18); }
        .code-input.inline { display: inline-block; width: auto; min-width: 90px; margin: 0; padding: 3px 8px; }

        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* LENTA (Belt) */
        .pipe-track { position: relative; padding-top: 20px; }
        .pipe-track::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 3px; border-radius: 99px; background-image: repeating-linear-gradient(90deg, ${T.ink3}70 0 9px, transparent 9px 19px); background-size: 38px 100%; animation: belt-scroll 1s linear infinite; opacity: 0.55; }
        @keyframes belt-scroll { to { background-position: -38px 0; } }
        .pipe-track:has(.pipe-step.fail)::after { animation-play-state: paused; opacity: 0.25; }
        .pipe-suitcase { position: absolute; top: 0; font-size: 16px; transform: translateX(-50%); transition: left 0.6s cubic-bezier(.4,0,.2,1); z-index: 2; filter: drop-shadow(0 3px 5px rgba(${T.shadowBase},0.35)); }
        @media (prefers-reduced-motion: reduce) { .pipe-suitcase { transition: none; } }
        .pipe { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; padding: 4px 0; }
        .pipe-step { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; background: ${T.paper}; border-radius: 11px; padding: 9px 11px; min-width: 66px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.25s; overflow: hidden; }
        .pipe-ico { font-size: 19px; line-height: 1; }
        .pipe-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; }
        .pipe-badge { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 800; min-height: 13px; line-height: 1; color: ${T.ink3}; }
        .pipe-arrow { color: ${T.ink3}; font-weight: 700; font-size: 14px; }
        .pipe-step.run { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 5px 14px -6px rgba(1,154,203,0.3); animation: pipe-run-pulse 0.9s ease-in-out infinite; }
        .pipe-step.run::after { content: ''; position: absolute; left: 0; right: 0; top: -45%; height: 45%; background: linear-gradient(180deg, transparent, rgba(1,154,203,0.75), transparent); animation: scan-sweep 0.8s ease-in-out infinite; pointer-events: none; }
        @keyframes scan-sweep { 0% { top: -45%; } 100% { top: 115%; } }
        @keyframes pipe-run-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .pipe-step.run .pipe-badge { color: ${T.blue}; }
        .pipe-step.pass { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .pipe-step.pass .pipe-badge { color: ${T.success}; }
        .pipe-step.fail { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}; animation: pipe-fail-pulse 0.5s ease-in-out 2, pipe-fail-shake 0.5s ease; }
        @keyframes pipe-fail-pulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 0 rgba(194,54,43,0); } 50% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 6px rgba(194,54,43,0.32); } }
        @keyframes pipe-fail-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(4px); } }
        .pipe-step.fail .pipe-badge { color: ${T.danger}; }
        .pipe-step.skip { opacity: 0.35; }
        /* 📋 LENTA JURNALI — jonli qatorlar */
        .belt-log { background: ${CODE.bg}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 3px; min-height: 54px; max-height: 200px; overflow-y: auto; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.22); }
        .belt-log-line { font-family: 'JetBrains Mono'; font-size: 12px; line-height: 1.7; color: ${CODE.text}; animation: el-pop 0.25s ease-out; white-space: pre-wrap; word-break: break-word; }
        .belt-log-line.ok { color: #7DD181; }
        .belt-log-line.bad { color: #FF8B7A; }
        .belt-log-line.skip { color: ${CODE.comment}; font-style: italic; }
        .belt-log-empty { font-family: 'JetBrains Mono'; font-size: 12px; color: ${CODE.comment}; font-style: italic; }

        /* TABLO */
        .tablo { display: inline-flex; align-items: center; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 11.5px; padding: 4px 10px; border-radius: 6px; }
        .tablo.ok { background: ${T.successSoft}; color: ${T.success}; }
        .tablo.bad { background: ${T.dangerSoft}; color: ${T.danger}; }

        /* 📱 TELEFON MOCK */
        .phone-mock { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .phone-body { position: relative; width: clamp(86px,12vw,112px); height: clamp(156px,20vw,200px); background: #16171B; border-radius: 20px; padding: 7px; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 2px #2A2B31; }
        .phone-notch { position: absolute; top: 7px; left: 50%; transform: translateX(-50%); width: 30px; height: 5px; border-radius: 99px; background: #2A2B31; z-index: 2; }
        .phone-screen { position: relative; width: 100%; height: 100%; border-radius: 14px; overflow: hidden; background: ${T.bg}; }
        .phone-face { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center; padding: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .phone-face span:first-child { font-size: 24px; }
        .phone-face p { margin: 0; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; color: ${T.ink}; }
        .phone-ok { font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 700; }
        .phone-screen.old .old-face { opacity: 1; }
        .phone-screen.new .new-face { opacity: 1; }
        .phone-screen.broken .broken-face { opacity: 1; }
        .old-face .phone-ok { color: ${T.ink2}; }
        .new-face .phone-ok, .new-face span:first-child { color: ${T.success}; }
        .broken-face .phone-ok, .broken-face span:first-child { color: ${T.danger}; }
        .phone-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 10px; color: ${T.ink3}; }

        /* ✈️ samolyot uchishi (push muvaffaqiyati) */
        .plane-fly { display: inline-block; font-size: 26px; animation: plane-takeoff 1.4s cubic-bezier(.3,.8,.4,1) both; }
        @keyframes plane-takeoff { 0% { transform: translate(-16px,10px) rotate(-8deg) scale(0.7); opacity: 0; } 40% { opacity: 1; } 100% { transform: translate(28px,-22px) rotate(-8deg) scale(1.1); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .plane-fly { animation: none; } }

        /* 🧩 DRAG-DROP ORDER (LENTA QURUVCHISI) */
        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 46px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: ${T.danger}; background: ${T.dangerSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-slots { position: relative; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(12px,1.6vw,14px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: ${T.danger}; font-size: 13.5px; }

        /* 🐞 LENTA JURNALI (DebugChallenge) */
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.6vw,13px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: ${T.danger}; background: rgba(194,54,43,0.22); animation: dd-shake .4s; }
        .dbg-line.fixed { border-color: ${CODE.ok}; background: rgba(125,209,129,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${CODE.ok}; background: rgba(125,209,129,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
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

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; }
        /* === 👆 TAP-HINT — bosilmagan joy "meni bos" deb chaqiradi (11.7) === */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.32); } 65%,100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 9px rgba(255,79,40,0); } }
        .tap-hint { animation: tap-hint-pulse 2.2s ease-out infinite; }
        .tap-hint:hover { animation-play-state: paused; }
        @keyframes tap-tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.45) rotate(6deg); opacity: 1; } 78% { transform: scale(0.92); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .vseen.tick { display: inline-block; animation: tap-tick-pop 0.44s cubic-bezier(.34,1.56,.44,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .tap-hint, .mstats-reveal.ready { animation: none !important; }
          .vseen.tick, .dd-slot.bad, .dbg-line.wrong { animation: none !important; }
          .fade-up, .fade-step, .el-in { animation-duration: 0.01ms !important; }
          .pipe-step.run, .pipe-step.fail, .belt-log-line, .plane-fly, .pipe-track::after, .pipe-step.run::after { animation: none !important; }
        }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

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
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { position: relative; overflow: hidden; background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        /* O'quvchi ko'radigan sinf-pulsi (StudentPracticePulse, 4-Modul standarti) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        .lp-done-btn.is-done::after { content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 42%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent); transform: skewX(-18deg); animation: lp-sweep 1.05s cubic-bezier(.4,0,.2,1) 0.2s 1 both; }
        @keyframes lp-sweep { to { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done, .lp-done-btn.is-done::after { animation: none !important; } .lp-done-btn.is-done::after { display: none; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }
        .lp-doer { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: rgba(58,53,48,0.07); border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
        .lp-doer.done { color: ${T.success}; background: ${T.successSoft}; }

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
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(17px,2.6vw,21px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
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

        /* === ⚡ CODE STRIKE — CTA neon-kapsula === */
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

        /* ===================== ⚡ JONLI QATLAM CSS ===================== */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
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
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
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
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
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

        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* === ⚡ LIVE BADGE — sekundar UI: kerak bo'lguncha xira (L1 etalon) === */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "Loyiha kuni — to'liq lenta", ru: "Проектный день — полный конвейер" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
            </>}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>;
}
export {
  FullPipelineProjectLesson as default
};
